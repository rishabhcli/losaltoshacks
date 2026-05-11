import type { TrendDataPoint } from "./trendChartData";

export type TrendLifecycleType = "new" | "resurfacing" | "sustained" | "cooling" | "watchlist";

export interface TrendMemorySource {
  platform?: string | null;
  title?: string | null;
  url?: string | null;
  timestamp?: string | null;
  fetchedAt?: string | null;
  created_at?: string | null;
  collectedAt?: string | null;
}

export interface TrendMemoryInput {
  trendId: string;
  title?: string | null;
  status?: string | null;
  detectedAt?: string | null;
  trendScore?: number | null;
  growthRate?: number | null;
  sentimentScore?: number | null;
  mentionCount?: number | null;
  sources?: TrendMemorySource[] | null;
  timeSeries?: TrendDataPoint[] | null;
  now?: Date;
}

export interface TrendMemorySnapshot {
  lifecycleType: TrendLifecycleType;
  lifecycleLabel: string;
  lifecycleReason: string;
  detectedLabel: string;
  ageHours: number | null;
  momentumDelta: number;
  momentumLabel: string;
  forecastConfidence: number;
  forecastConfidenceLabel: string;
  sourceCount: number;
  platformCount: number;
  sourceMixLabel: string;
  platforms: string[];
  watchWindow: string;
  changeSummary: string;
  watchItems: string[];
  warnings: string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getSourceTimestamp(source: TrendMemorySource): Date | null {
  return (
    parseDate(source.timestamp) ??
    parseDate(source.fetchedAt) ??
    parseDate(source.created_at) ??
    parseDate(source.collectedAt)
  );
}

function formatDetectedLabel(ageHours: number | null) {
  if (ageHours == null) return "Detection time unknown";
  if (ageHours < 1) return "Detected in the last hour";
  if (ageHours < 24) return `Detected ${Math.round(ageHours)}h ago`;
  const days = Math.max(1, Math.round(ageHours / 24));
  return `Detected ${days} day${days === 1 ? "" : "s"} ago`;
}

function normalizePlatform(platform?: string | null) {
  return String(platform ?? "unknown").trim().toLowerCase().replace(/\s+/g, "_") || "unknown";
}

function formatPlatform(platform: string) {
  if (platform === "x") return "X";
  if (platform === "market_research") return "Market research";
  return platform
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLifecycle(input: {
  ageHours: number | null;
  status?: string | null;
  trendScore: number;
  growthRate: number;
}): Pick<TrendMemorySnapshot, "lifecycleType" | "lifecycleLabel" | "lifecycleReason" | "watchWindow"> {
  const status = String(input.status ?? "").toLowerCase();

  if (status === "declining" || input.growthRate < -5) {
    return {
      lifecycleType: "cooling",
      lifecycleLabel: "Cooling signal",
      lifecycleReason: "Momentum is negative, so the trend should be treated as a retention or exit watch item.",
      watchWindow: "Recheck before committing new spend",
    };
  }

  if (input.ageHours != null && input.ageHours <= 24) {
    return {
      lifecycleType: "new",
      lifecycleLabel: "New signal",
      lifecycleReason: "The signal was detected recently and needs another pass before it becomes assumed market memory.",
      watchWindow: "Recheck in 24 hours",
    };
  }

  if (input.ageHours != null && input.ageHours >= 96 && input.growthRate >= 15 && input.trendScore >= 65) {
    return {
      lifecycleType: "resurfacing",
      lifecycleLabel: "Resurfacing signal",
      lifecycleReason: "Older detection age plus renewed growth suggests the market may be revisiting this theme.",
      watchWindow: "Compare against last week's baseline",
    };
  }

  if (input.growthRate >= 25 && input.trendScore >= 75) {
    return {
      lifecycleType: "sustained",
      lifecycleLabel: "Sustained acceleration",
      lifecycleReason: "Score and growth rate are both high enough to watch for near-term opportunity creation.",
      watchWindow: "Recheck every 48 hours",
    };
  }

  return {
    lifecycleType: "watchlist",
    lifecycleLabel: "Watchlist signal",
    lifecycleReason: "The signal is visible but still needs stronger momentum or source diversity before action.",
    watchWindow: "Recheck after the next research mission",
  };
}

function getMomentumDelta(timeSeries: TrendDataPoint[] | null | undefined, growthRate: number) {
  if (timeSeries && timeSeries.length >= 2) {
    const first = timeSeries[0]?.score ?? 0;
    const last = timeSeries[timeSeries.length - 1]?.score ?? first;
    return round(last - first);
  }
  return round(growthRate);
}

function getForecastConfidence(input: {
  trendScore: number;
  growthRate: number;
  sentimentScore: number;
  sourceCount: number;
  platformCount: number;
  ageHours: number | null;
}) {
  let score = 42;
  score += input.trendScore * 0.24;
  score += clamp(input.growthRate, -20, 40) * 0.35;
  score += clamp(input.sentimentScore, -1, 1) * 8;
  score += Math.min(18, input.sourceCount * 4);
  score += Math.min(14, input.platformCount * 4);

  if (input.sourceCount === 0) score -= 20;
  if (input.platformCount === 1) score -= 8;
  if (input.ageHours != null && input.ageHours > 168) score -= 10;
  if (input.growthRate < 0) score -= 10;

  return Math.round(clamp(score, 5, 96));
}

function getForecastConfidenceLabel(confidence: number) {
  if (confidence >= 80) return "High confidence";
  if (confidence >= 60) return "Moderate confidence";
  return "Low confidence";
}

export function buildTrendMemory(input: TrendMemoryInput): TrendMemorySnapshot {
  const now = input.now ?? new Date();
  const detectedAt = parseDate(input.detectedAt);
  const ageHours = detectedAt ? Math.max(0, (now.getTime() - detectedAt.getTime()) / 3_600_000) : null;
  const trendScore = input.trendScore ?? 0;
  const growthRate = input.growthRate ?? 0;
  const sentimentScore = input.sentimentScore ?? 0;
  const sources = input.sources ?? [];
  const platforms = Array.from(new Set(sources.map((source) => normalizePlatform(source.platform)))).sort();
  const platformCount = platforms.filter((platform) => platform !== "unknown").length || platforms.length;
  const sourceCount = sources.length;
  const latestSourceTimestamp = sources
    .map(getSourceTimestamp)
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  const sourceAgeHours = latestSourceTimestamp
    ? Math.max(0, (now.getTime() - latestSourceTimestamp.getTime()) / 3_600_000)
    : null;

  const lifecycle = getLifecycle({ ageHours, status: input.status, trendScore, growthRate });
  const momentumDelta = getMomentumDelta(input.timeSeries, growthRate);
  const momentumLabel =
    growthRate > 0
      ? `+${round(growthRate).toFixed(1)}% growth`
      : `${round(growthRate).toFixed(1)}% growth`;
  const forecastConfidence = getForecastConfidence({
    trendScore,
    growthRate,
    sentimentScore,
    sourceCount,
    platformCount,
    ageHours,
  });
  const sourceMixLabel =
    sourceCount > 0
      ? `${sourceCount} source${sourceCount === 1 ? "" : "s"} across ${platformCount} platform${platformCount === 1 ? "" : "s"}`
      : "No source evidence attached";

  const warnings: string[] = [];
  if (sourceCount === 0) warnings.push("No source evidence attached to this trend");
  if (platformCount > 0 && platformCount < 2) warnings.push("Single-platform signal");
  if (sourceCount > 0 && !platforms.some((platform) => platform === "x" || platform === "twitter")) {
    warnings.push("X/Twitter coverage missing");
  }
  if (sourceAgeHours == null && sourceCount > 0) warnings.push("Source freshness unknown");
  if (ageHours != null && ageHours > 168) warnings.push("Trend detection is older than one week");
  if (forecastConfidence < 60) warnings.push("Forecast confidence below decision threshold");

  const platformText = platforms.length > 0 ? platforms.map(formatPlatform).join(", ") : "no attached sources";
  const changeSummary =
    `${input.title ?? "This trend"} is currently classified as ${lifecycle.lifecycleLabel.toLowerCase()} with ` +
    `${momentumLabel} and ${getForecastConfidenceLabel(forecastConfidence).toLowerCase()} from ${platformText}.`;

  const watchItems = [
    lifecycle.watchWindow,
    sourceCount > 0
      ? `Check whether ${platformText} keeps moving in the same direction.`
      : "Run a source-capture mission before using this as a planning input.",
    forecastConfidence >= 75
      ? "Look for a concrete product or campaign wedge while confidence remains high."
      : "Wait for stronger source diversity before committing roadmap or budget.",
  ];

  return {
    ...lifecycle,
    detectedLabel: formatDetectedLabel(ageHours),
    ageHours: ageHours == null ? null : round(ageHours),
    momentumDelta,
    momentumLabel,
    forecastConfidence,
    forecastConfidenceLabel: getForecastConfidenceLabel(forecastConfidence),
    sourceCount,
    platformCount,
    sourceMixLabel,
    platforms,
    changeSummary,
    watchItems,
    warnings,
  };
}
