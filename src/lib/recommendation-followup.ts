import { getEvidenceTitle, normalizeEvidenceSources, type EvidenceSource } from "./evidence";

export type RecommendationFollowUpStatus = "open" | "accepted" | "dismissed";

export interface RecommendationFollowUpInput {
  title?: string;
  description?: string;
  productCategory?: string;
  targetDemographic?: string;
  confidenceScore?: number;
  estimatedRevenuePotential?: string;
  priority?: string;
  actionPlan?: string;
  sourceEvidence?: EvidenceSource[];
}

function confidenceLabel(confidenceScore: number | undefined) {
  if (confidenceScore == null || Number.isNaN(confidenceScore)) return "unknown confidence";
  return `${Math.round(confidenceScore * 100)}% confidence`;
}

function statusLabel(status: RecommendationFollowUpStatus) {
  if (status === "accepted") return "accepted decision";
  if (status === "dismissed") return "rejected decision";
  return "open recommendation";
}

export function buildRecommendationFollowUpPrompt(
  recommendation: RecommendationFollowUpInput,
  opts?: { trendTitle?: string | null; status?: RecommendationFollowUpStatus },
): string {
  const title = recommendation.title?.trim() || "this recommendation";
  const evidence = normalizeEvidenceSources(recommendation.sourceEvidence);
  const evidenceSummary = evidence.length > 0
    ? evidence.slice(0, 4).map((source, index) => `${index + 1}. ${getEvidenceTitle(source)}`).join("; ")
    : "No attached source evidence yet.";
  const status = opts?.status ?? "open";
  const trendContext = opts?.trendTitle?.trim()
    ? `Linked trend: ${opts.trendTitle.trim()}.`
    : "No linked trend title is available.";

  return [
    `Follow-up research: reassess ${title}.`,
    `Decision context: ${statusLabel(status)} with ${confidenceLabel(recommendation.confidenceScore)} and ${recommendation.priority ?? "unknown"} priority.`,
    trendContext,
    recommendation.description ? `Current rationale: ${recommendation.description}` : "Current rationale is unavailable.",
    recommendation.actionPlan ? `Current action plan: ${recommendation.actionPlan}` : "Current action plan is unavailable.",
    `Attached evidence to verify: ${evidenceSummary}`,
    "Return fresh source URLs, engagement context, contradictions, competitor movement, pricing/channel signals, and whether to keep, reverse, or escalate this decision.",
  ].join(" ");
}
