import {
  scoreEvidenceQuality,
  type EvidenceQualityInput,
} from "./evidence-quality";

export interface EvidenceTrustInput extends EvidenceQualityInput {
  id?: string;
}

export type EvidenceTrustLabel = "supported context" | "watch" | "weak context";

export interface EvidenceTrustScore {
  id: string;
  url: string;
  credibilityScore: number;
  noveltyScore: number;
  contradictionScore: number;
  label: EvidenceTrustLabel;
  duplicate: boolean;
  reasons: string[];
  warnings: string[];
}

export interface EvidenceTrustSummary {
  sources: EvidenceTrustScore[];
  sourceCount: number;
  uniqueSourceCount: number;
  duplicateCount: number;
  platformCount: number;
  averageCredibility: number;
  averageNovelty: number;
  contradictionRisk: number;
  freshnessKnownCount: number;
  staleCount: number;
  unknownFreshnessCount: number;
  warnings: string[];
  methodNote: string;
}

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "because",
  "been",
  "being",
  "from",
  "have",
  "into",
  "more",
  "over",
  "that",
  "their",
  "there",
  "these",
  "they",
  "this",
  "with",
  "would",
]);

const POSITIVE_CUES =
  /\b(adopt|adoption|demand|growing|growth|interest|popular|surge|want|wanted|retention|repeat|rising|traction|useful)\b/i;
const NEGATIVE_CUES =
  /\b(backlash|concern|declin|doubt|mixed signal|pushback|skeptic|struggle|weak|worry|friction)\b/i;

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number) {
  return Math.round(clamp(value));
}

function textFor(source: EvidenceTrustInput) {
  return [source.title, source.keywords, source.summary]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function tokensFor(source: EvidenceTrustInput) {
  return new Set(
    textFor(source)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 4 && !STOP_WORDS.has(token)),
  );
}

function canonicalUrl(value: string | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    url.hash = "";
    for (const key of Array.from(url.searchParams.keys())) {
      if (key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key);
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return raw.replace(/\/$/, "");
  }
}

function hasValidTimestamp(source: EvidenceTrustInput) {
  const raw = source.fetchedAt || source.createdAt;
  return Boolean(raw && Number.isFinite(new Date(raw).getTime()));
}

function isStale(source: EvidenceTrustInput) {
  const raw = source.fetchedAt || source.createdAt;
  if (!raw) return false;
  const timestamp = new Date(raw).getTime();
  if (!Number.isFinite(timestamp)) return false;
  return Date.now() - timestamp > 30 * 24 * 3_600_000;
}

function polarity(source: EvidenceTrustInput) {
  const text = textFor(source);
  const positive = POSITIVE_CUES.test(text);
  const negative = NEGATIVE_CUES.test(text);
  if (positive && negative) return 0;
  if (positive) return 1;
  if (negative) return -1;
  return 0;
}

function credibilityFor(source: EvidenceTrustInput, duplicate: boolean) {
  const quality = scoreEvidenceQuality(source);
  const platform = String(source.platform ?? "source")
    .trim()
    .toLowerCase();
  const hasHttpsUrl = /^https:\/\//i.test(String(source.url ?? "").trim());
  const score =
    quality.score * 0.68 +
    (hasHttpsUrl ? 8 : 0) +
    (platform && platform !== "source" ? 8 : 0) +
    (hasValidTimestamp(source) ? 8 : 0) -
    (duplicate ? 12 : 0);
  return roundScore(score);
}

function noveltyFor(
  source: EvidenceTrustInput,
  peers: EvidenceTrustInput[],
  duplicate: boolean,
) {
  if (duplicate) return 0;
  const tokens = tokensFor(source);
  if (tokens.size === 0) return 20;
  if (peers.length === 0) return 50;

  const peerTokens = new Set(
    peers.flatMap((peer) => Array.from(tokensFor(peer))),
  );
  const novelTokens = Array.from(tokens).filter(
    (token) => !peerTokens.has(token),
  ).length;
  return roundScore(30 + (novelTokens / tokens.size) * 70);
}

function contradictionFor(
  source: EvidenceTrustInput,
  peers: EvidenceTrustInput[],
) {
  const text = textFor(source);
  const hasPositive = POSITIVE_CUES.test(text);
  const hasNegative = NEGATIVE_CUES.test(text);
  let score = hasPositive && hasNegative ? 58 : hasNegative ? 30 : 8;

  const peerPolarities = peers.map(polarity).filter((value) => value !== 0);
  const positivePeers = peerPolarities.filter((value) => value === 1).length;
  const negativePeers = peerPolarities.filter((value) => value === -1).length;
  const majority =
    positivePeers === negativePeers
      ? 0
      : positivePeers > negativePeers
        ? 1
        : -1;
  if (majority !== 0 && polarity(source) !== 0 && polarity(source) !== majority)
    score += 32;

  return roundScore(score);
}

function labelFor(score: number): EvidenceTrustLabel {
  if (score >= 75) return "supported context";
  if (score >= 55) return "watch";
  return "weak context";
}

function average(values: number[]) {
  return values.length > 0
    ? roundScore(
        values.reduce((total, value) => total + value, 0) / values.length,
      )
    : 0;
}

export function buildEvidenceTrustSummary(
  input: EvidenceTrustInput[],
): EvidenceTrustSummary {
  const sources = input.filter((source) => String(source.url ?? "").trim());
  const counts = new Map<string, number>();
  for (const source of sources) {
    const key = canonicalUrl(source.url);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const trustScores = sources.map((source, index) => {
    const key = canonicalUrl(source.url);
    const duplicate = (counts.get(key) ?? 0) > 1;
    const peers = sources.filter((_, peerIndex) => peerIndex !== index);
    const quality = scoreEvidenceQuality(source);
    const credibilityScore = credibilityFor(source, duplicate);
    const noveltyScore = noveltyFor(source, peers, duplicate);
    const contradictionScore = contradictionFor(source, peers);
    const warnings = [
      ...quality.warnings,
      duplicate ? "Duplicate URL detected in this result" : "",
      noveltyScore < 45 ? "Low novelty versus the other attached sources" : "",
      contradictionScore >= 45 ? "Contradiction cues need operator review" : "",
    ].filter(Boolean);

    return {
      id: String(source.id ?? source.url),
      url: String(source.url),
      credibilityScore,
      noveltyScore,
      contradictionScore,
      label: labelFor(credibilityScore),
      duplicate,
      reasons: [
        credibilityScore >= 75
          ? "Metadata and source context support this signal"
          : "Source context is incomplete; treat this as directional",
        noveltyScore >= 65
          ? "Adds distinct language or framing"
          : "Overlaps with other attached source language",
        contradictionScore >= 45
          ? "Contains mixed or opposing signal language"
          : "No strong contradiction cue detected",
      ],
      warnings,
    } satisfies EvidenceTrustScore;
  });

  const platformCount = new Set(
    sources
      .map((source) =>
        String(source.platform ?? "source")
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean),
  ).size;
  const duplicateCount = trustScores.filter(
    (source) => source.duplicate,
  ).length;
  const freshnessKnownCount = sources.filter(hasValidTimestamp).length;
  const staleCount = sources.filter(isStale).length;
  const unknownFreshnessCount = sources.length - freshnessKnownCount;
  const contradictionRisk = average(
    trustScores.map((source) => source.contradictionScore),
  );
  const warnings = [
    sources.length === 0 ? "No source evidence attached" : "",
    duplicateCount > 0
      ? `${duplicateCount} duplicate source${duplicateCount === 1 ? "" : "s"} detected`
      : "",
    platformCount < 2 && sources.length > 0
      ? "Evidence comes from one platform; diversity is limited"
      : "",
    unknownFreshnessCount > 0
      ? `${unknownFreshnessCount} source${unknownFreshnessCount === 1 ? "" : "s"} freshness unknown`
      : "",
    staleCount > 0
      ? `${staleCount} stale source${staleCount === 1 ? "" : "s"} older than 30 days`
      : "",
    contradictionRisk >= 30
      ? "Contradiction risk is elevated; review the underlying source text"
      : "",
  ].filter(Boolean);

  return {
    sources: trustScores,
    sourceCount: sources.length,
    uniqueSourceCount: counts.size,
    duplicateCount,
    platformCount,
    averageCredibility: average(
      trustScores.map((source) => source.credibilityScore),
    ),
    averageNovelty: average(trustScores.map((source) => source.noveltyScore)),
    contradictionRisk,
    freshnessKnownCount,
    staleCount,
    unknownFreshnessCount,
    warnings,
    methodNote:
      "Heuristic only: scores compare attached metadata and language; they do not verify author identity or claim truth.",
  };
}
