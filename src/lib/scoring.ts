import { Article } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────

function daysBetween(d1: Date, d2: Date): number {
  return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
}

/** Ensure a value is a Date, handling strings from MongoDB. */
function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (typeof v === "string" || typeof v === "number") return new Date(v);
  return new Date();
}

/** Clamp-and-normalize a value into [0, 1]. */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// ── Public API ────────────────────────────────────────────────────────

export interface TrendScores {
  volume: number;
  recentVolume: number;
  growthRate: number;
  acceleration: number;
  recencyScore: number;
  compositeScore: number;
}

/**
 * Compute trend scores for a set of articles belonging to one cluster.
 *
 * Scoring formula (weights sum to 1.0):
 *   0.35 × volume  +  0.25 × growthRate  +  0.20 × acceleration  +  0.20 × recency
 *
 * - Volume:       total article count (normalized against [0, maxVolume]).
 * - Growth rate:  % change between the recent window (0-3 days) and the
 *                 prior window (3-7 days).
 * - Acceleration: 2nd derivative — is growth itself speeding up?
 *                 Compares first-half vs second-half of the recent window.
 * - Recency:      exponential-decay weighted average of article ages
 *                 (more recent = higher score).
 */
export function computeTrendScores(
  articles: Article[],
  maxVolume: number = 50
): TrendScores {
  if (articles.length === 0) {
    return {
      volume: 0, recentVolume: 0, growthRate: 0,
      acceleration: 0, recencyScore: 0, compositeScore: 0,
    };
  }

  const now = new Date();
  const RECENT = 3; // days
  const PRIOR = 7;  // days

  // Partition articles into time windows
  const recentArticles: Article[] = [];
  const priorArticles: Article[] = [];

  for (const a of articles) {
    const age = daysBetween(toDate(a.publishedAt), now);
    if (age <= RECENT) recentArticles.push(a);
    else if (age <= PRIOR) priorArticles.push(a);
  }

  const volume = articles.length;
  const recentVolume = recentArticles.length;
  const priorVolume = priorArticles.length;

  // ── Growth rate ──────────────────────────────────────────
  const growthRate =
    priorVolume === 0
      ? recentVolume > 0 ? 100 : 0
      : ((recentVolume - priorVolume) / priorVolume) * 100;

  // ── Acceleration (2nd derivative) ────────────────────────
  // Split the recent window at its midpoint and compare halves.
  const midpoint = RECENT / 2;
  let firstHalf = 0;
  let secondHalf = 0;
  for (const a of recentArticles) {
    const age = daysBetween(toDate(a.publishedAt), now);
    if (age <= midpoint) secondHalf++;
    else firstHalf++;
  }
  const acceleration =
    firstHalf === 0
      ? secondHalf > 0 ? 1 : 0
      : (secondHalf - firstHalf) / firstHalf;

  // ── Recency score ────────────────────────────────────────
  // Exponential decay: recent articles contribute more.
  const recencyScore =
    articles.reduce((sum, a) => {
      const age = daysBetween(toDate(a.publishedAt), now);
      return sum + Math.exp(-0.3 * age);
    }, 0) / articles.length;

  // ── Composite score ──────────────────────────────────────
  const compositeScore = Math.min(
    1,
    0.35 * normalize(volume, 0, maxVolume) +
    0.25 * normalize(growthRate, -100, 200) +
    0.20 * normalize(acceleration, -1, 2) +
    0.20 * normalize(recencyScore, 0, 1)
  );

  return {
    volume, recentVolume, growthRate,
    acceleration, recencyScore, compositeScore,
  };
}

/**
 * Re-normalize composite scores across an array of score objects
 * so the highest is 1.0 and the lowest maps proportionally.
 * Useful after scoring all clusters independently.
 */
export function normalizeScoresAcross(
  scores: TrendScores[]
): TrendScores[] {
  if (scores.length === 0) return [];
  const max = Math.max(...scores.map((s) => s.compositeScore));
  if (max === 0) return scores;
  return scores.map((s) => ({
    ...s,
    compositeScore: s.compositeScore / max,
  }));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
