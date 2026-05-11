import { normalizeEvidenceSources, type EvidenceSource } from "./evidence";

export interface BriefingTrustTrend {
  title?: string;
  sources?: EvidenceSource[];
}

export interface BriefingTrustRecommendation {
  title?: string;
  sourceEvidence?: EvidenceSource[];
}

export interface BriefingTrustLedger {
  modeLabel: string;
  sourceCount: number;
  platformCount: number;
  recommendationCoverageLabel: string;
  evidenceBackedRecommendations: number;
  totalRecommendations: number;
  riskLabel: string;
  warnings: string[];
}

function uniqueEvidenceSources(values: unknown[]): EvidenceSource[] {
  const byUrl = new Map<string, EvidenceSource>();
  for (const value of values) {
    for (const source of normalizeEvidenceSources(value)) {
      if (!byUrl.has(source.url)) byUrl.set(source.url, source);
    }
  }
  return Array.from(byUrl.values());
}

export function evidenceBackedOnly<T extends { sources?: EvidenceSource[]; sourceEvidence?: EvidenceSource[] }>(items: T[]): T[] {
  return items.filter((item) => {
    const trendEvidence = normalizeEvidenceSources(item.sources);
    const recommendationEvidence = normalizeEvidenceSources(item.sourceEvidence);
    return trendEvidence.length + recommendationEvidence.length > 0;
  });
}

export function buildBriefingTrustLedger({
  trends,
  recommendations,
  evidenceSources,
  isStrictMode,
  liveModel,
}: {
  trends: BriefingTrustTrend[];
  recommendations: BriefingTrustRecommendation[];
  evidenceSources: EvidenceSource[];
  isStrictMode: boolean;
  liveModel: string | null;
}): BriefingTrustLedger {
  const uniqueSources = uniqueEvidenceSources([
    evidenceSources,
    ...trends.map((trend) => trend.sources),
    ...recommendations.map((recommendation) => recommendation.sourceEvidence),
  ]);
  const platforms = new Set(uniqueSources.map((source) => source.platform || "source"));
  const evidenceBackedRecommendations = recommendations.filter(
    (recommendation) => normalizeEvidenceSources(recommendation.sourceEvidence).length > 0,
  ).length;
  const totalRecommendations = recommendations.length;
  const unsupportedRecommendations = totalRecommendations - evidenceBackedRecommendations;
  const coverage = totalRecommendations > 0
    ? Math.round((evidenceBackedRecommendations / totalRecommendations) * 100)
    : 0;
  const warnings = [
    uniqueSources.length === 0 ? "No source evidence attached" : "",
    unsupportedRecommendations > 0 ? `${unsupportedRecommendations} recommendation${unsupportedRecommendations === 1 ? "" : "s"} missing source evidence` : "",
    !liveModel ? "Local draft, not live LLM regenerated" : "",
    isStrictMode ? "Strict mode filters out unsupported trend and recommendation inputs" : "",
  ].filter(Boolean);

  return {
    modeLabel: liveModel
      ? `Live model: ${liveModel}`
      : isStrictMode
        ? "Strict evidence mode"
        : "Local draft mode",
    sourceCount: uniqueSources.length,
    platformCount: platforms.size,
    recommendationCoverageLabel: totalRecommendations > 0
      ? `${coverage}% recommendation evidence coverage`
      : "No recommendations in briefing",
    evidenceBackedRecommendations,
    totalRecommendations,
    riskLabel: uniqueSources.length === 0
      ? "Evidence missing"
      : unsupportedRecommendations > 0
        ? "Review unsupported claims"
        : "Evidence-backed briefing",
    warnings,
  };
}
