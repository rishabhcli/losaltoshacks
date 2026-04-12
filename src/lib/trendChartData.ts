/**
 * Generates synthetic time-series data for a trend based on its
 * current score, growth rate, and a configurable time frame.
 */
export interface TrendDataPoint {
  label: string;
  score: number;
  mentions: number;
  timestamp: number; // epoch ms — used for zoom/slice
}

export type TimeFrame = "24h" | "3d" | "7d";

interface TimeFrameConfig {
  points: number;
  hoursPerStep: number;
  labelFormat: (d: Date) => string;
}

const TIME_FRAME_CONFIGS: Record<TimeFrame, TimeFrameConfig> = {
  "24h": {
    points: 24,
    hoursPerStep: 1,
    labelFormat: (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
  },
  "3d": {
    points: 18,
    hoursPerStep: 4,
    labelFormat: (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
  },
  "7d": {
    points: 14,
    hoursPerStep: 12,
    labelFormat: (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
  },
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Volatility profiles that make certain trends appear spiky or erratic.
 * Keyed by trendId — trends not listed here get the default smooth curve.
 */
const VOLATILITY_PROFILES: Record<string, { noise: number; spikeAt?: number; spikeMagnitude?: number }> = {
  "t7":  { noise: 0.35 },                           // Chromatic Maximalism — volatile, faddish
  "t10": { noise: 0.30, spikeAt: 0.7, spikeMagnitude: 1.45 }, // Tech-Wear — sudden spike near recent end
  "t2":  { noise: 0.25, spikeAt: 0.8, spikeMagnitude: 1.35 }, // Workcation — recent viral spike
};

export function generateTrendTimeSeries(
  trendId: string,
  currentScore: number,
  growthRate: number,
  mentionCount: number,
  timeFrame: TimeFrame = "7d",
): TrendDataPoint[] {
  const config = TIME_FRAME_CONFIGS[timeFrame];
  const seed = trendId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + timeFrame.charCodeAt(0);
  const rand = seededRandom(seed);
  const profile = VOLATILITY_PROFILES[trendId];
  const noiseFactor = profile?.noise ?? 0.12;

  const data: TrendDataPoint[] = [];
  const hourlyGrowth = growthRate / 100 / (365 * 24);

  const now = Date.now();

  for (let i = config.points - 1; i >= 0; i--) {
    const hoursAgo = i * config.hoursPerStep;
    const progress = 1 - i / (config.points - 1); // 0 = oldest, 1 = newest
    const decay = 1 - hourlyGrowth * hoursAgo;
    let noise = 1 + (rand() - 0.5) * noiseFactor;

    // Inject a spike at a specific point in the series
    if (profile?.spikeAt != null && profile.spikeMagnitude != null) {
      const distFromSpike = Math.abs(progress - profile.spikeAt);
      if (distFromSpike < 0.1) {
        noise *= profile.spikeMagnitude;
      }
    }

    const score = Math.max(0, Math.min(100, currentScore * decay * noise));
    const mentionNoise = 1 + (rand() - 0.5) * noiseFactor * 1.5;
    const mentions = Math.round(mentionCount * decay * mentionNoise);

    const timestamp = now - hoursAgo * 60 * 60 * 1000;
    const d = new Date(timestamp);
    const label = config.labelFormat(d);

    data.push({ label, score: Math.round(score * 10) / 10, mentions, timestamp });
  }

  return data;
}

export const TIME_FRAME_OPTIONS: { value: TimeFrame; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "3d", label: "Last 3 days" },
  { value: "7d", label: "Last 7 days" },
];

/* ── Trend Stability Analysis ─────────────────────────────────── */

export type StabilityLevel = "steady" | "moderate" | "volatile" | "spike";

export interface TrendStability {
  level: StabilityLevel;
  label: string;
  description: string;
  /** 0–100, higher = more stable */
  stabilityScore: number;
  /** Adjusted trend score that penalizes unreliable spikes */
  adjustedScore: number;
}

/**
 * Analyzes a trend's time-series data to determine if it's a
 * reliable steady trend or an unreliable temporary spike.
 *
 * Metrics used:
 * - Coefficient of variation (CV) of scores — high CV = volatile
 * - Max single-step jump — large jumps suggest a spike
 * - Ratio of latest score to mean — if latest >> mean, it's a spike
 */
export function analyzeTrendStability(
  data: TrendDataPoint[],
  currentScore: number,
): TrendStability {
  if (data.length < 3) {
    return { level: "moderate", label: "Insufficient Data", description: "Not enough data points to assess reliability.", stabilityScore: 50, adjustedScore: currentScore };
  }

  const scores = data.map(d => d.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0; // coefficient of variation as %

  // Max single-step change
  let maxJump = 0;
  for (let i = 1; i < scores.length; i++) {
    const jump = Math.abs(scores[i] - scores[i - 1]);
    if (jump > maxJump) maxJump = jump;
  }
  const maxJumpPct = mean > 0 ? (maxJump / mean) * 100 : 0;

  // Spike ratio: how much the latest score exceeds the first-half average
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const firstHalfMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const spikeRatio = firstHalfMean > 0 ? currentScore / firstHalfMean : 1;

  // Composite stability score (0–100, higher = more stable)
  let stabilityScore = 100;
  stabilityScore -= Math.min(30, cv * 3);           // penalize high variance
  stabilityScore -= Math.min(30, maxJumpPct * 2);    // penalize large jumps
  stabilityScore -= Math.min(20, Math.max(0, (spikeRatio - 1.15) * 80)); // penalize spike-like ratio
  stabilityScore = Math.max(0, Math.min(100, Math.round(stabilityScore)));

  // Adjusted score: penalize unreliable trends
  const penalty = stabilityScore < 40 ? 0.7 : stabilityScore < 60 ? 0.85 : stabilityScore < 75 ? 0.95 : 1;
  const adjustedScore = Math.round(currentScore * penalty * 10) / 10;

  if (stabilityScore >= 75) {
    return {
      level: "steady",
      label: "Steady Trend",
      description: "This trend shows consistent, reliable momentum over time. The score reflects sustained interest.",
      stabilityScore,
      adjustedScore,
    };
  }
  if (stabilityScore >= 55) {
    return {
      level: "moderate",
      label: "Moderate Volatility",
      description: "Some fluctuation detected. The trend is generally reliable but watch for sudden changes.",
      stabilityScore,
      adjustedScore,
    };
  }
  if (stabilityScore >= 35) {
    return {
      level: "volatile",
      label: "Volatile Trend",
      description: "Significant score swings detected. This trend may be driven by short-term events rather than lasting demand.",
      stabilityScore,
      adjustedScore,
    };
  }
  return {
    level: "spike",
    label: "Possible Spike",
    description: "This trend shows a sharp, sudden increase that may not be sustainable. The score has been adjusted downward to reflect uncertainty.",
    stabilityScore,
    adjustedScore,
  };
}
