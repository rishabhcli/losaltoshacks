export interface EvidenceQualityInput {
  platform?: string;
  title?: string;
  keywords?: string;
  summary?: string;
  url?: string;
  likes?: number;
  views?: number;
  comments?: number;
  fetchedAt?: string | null;
  createdAt?: string | null;
}

export interface EvidenceQualityScore {
  score: number;
  label: "Strong" | "Useful" | "Thin" | "Weak";
  platformScore: number;
  metadataScore: number;
  engagementScore: number;
  freshnessScore: number;
  reasons: string[];
  warnings: string[];
}

const PLATFORM_BASE_SCORE: Record<string, number> = {
  youtube: 72,
  reddit: 74,
  substack: 70,
  x: 58,
  twitter: 58,
  web: 62,
  source: 55,
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number) {
  return Math.round(clamp(value));
}

function present(value: string | undefined | null) {
  return Boolean(String(value ?? "").trim());
}

function platformScore(platform: string | undefined) {
  const key = String(platform ?? "source").trim().toLowerCase();
  return PLATFORM_BASE_SCORE[key] ?? PLATFORM_BASE_SCORE.source;
}

function metadataScore(source: EvidenceQualityInput) {
  const url = present(source.url) ? 25 : 0;
  const title = present(source.title) ? 25 : 0;
  const summary = present(source.summary) ? 30 : 0;
  const keywords = present(source.keywords) ? 20 : 0;
  return url + title + summary + keywords;
}

function engagementScore(source: EvidenceQualityInput) {
  const likes = Number(source.likes ?? 0);
  const views = Number(source.views ?? 0);
  const comments = Number(source.comments ?? 0);
  const weighted = likes * 2 + comments * 12 + views * 0.15;
  if (weighted <= 0) return 35;
  return roundScore(35 + Math.log10(weighted + 1) * 15);
}

function freshnessScore(source: EvidenceQualityInput) {
  const raw = source.fetchedAt || source.createdAt;
  if (!raw) return 40;
  const timestamp = new Date(raw).getTime();
  if (!Number.isFinite(timestamp)) return 40;
  const ageHours = Math.max(0, (Date.now() - timestamp) / 3_600_000);
  if (ageHours <= 24) return 95;
  if (ageHours <= 24 * 7) return 82;
  if (ageHours <= 24 * 30) return 62;
  return 42;
}

function qualityLabel(score: number): EvidenceQualityScore["label"] {
  if (score >= 78) return "Strong";
  if (score >= 62) return "Useful";
  if (score >= 45) return "Thin";
  return "Weak";
}

function formatPlatform(platform: string | undefined) {
  const value = String(platform ?? "source").trim();
  if (!value) return "source";
  return value.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function scoreEvidenceQuality(source: EvidenceQualityInput): EvidenceQualityScore {
  const pScore = platformScore(source.platform);
  const mScore = metadataScore(source);
  const eScore = engagementScore(source);
  const fScore = freshnessScore(source);
  const score = roundScore(pScore * 0.2 + mScore * 0.3 + eScore * 0.28 + fScore * 0.22);
  const reasons = [
    `Platform context: ${formatPlatform(source.platform)}`,
    mScore >= 80 ? "Source metadata complete" : "Source metadata incomplete",
    eScore >= 70 ? "Strong engagement metadata" : eScore > 35 ? "Some engagement metadata" : "No engagement metadata",
  ];
  const warnings = [
    fScore <= 40 ? "Freshness unknown" : "",
    mScore < 70 ? "Missing title, summary, keywords, or URL metadata" : "",
    eScore <= 35 ? "Engagement metadata unavailable" : "",
  ].filter(Boolean);

  return {
    score,
    label: qualityLabel(score),
    platformScore: pScore,
    metadataScore: mScore,
    engagementScore: eScore,
    freshnessScore: fScore,
    reasons,
    warnings,
  };
}
