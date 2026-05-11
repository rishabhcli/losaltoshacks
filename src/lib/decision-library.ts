import { normalizeEvidenceSources, type EvidenceSource } from "./evidence";

export type DecisionLibraryStatus = "accepted" | "dismissed";

export interface DecisionLibraryItem {
  title?: string;
  confidenceScore?: number;
  priority?: string;
  estimatedRevenuePotential?: string;
  actionPlan?: string;
  sourceEvidence?: EvidenceSource[];
}

export interface DecisionLibraryStats {
  total: number;
  evidenceBacked: number;
  needsReview: number;
  highConfidence: number;
  highPriority: number;
  totalEvidenceSources: number;
  averageConfidence: number | null;
}

export interface DecisionMemo {
  posture: string;
  rationale: string;
  reviewCadence: string;
  evidenceLabel: string;
  riskLabel: string;
}

function confidencePercent(confidence: number | undefined) {
  if (confidence == null || Number.isNaN(confidence)) return null;
  return Math.round(confidence * 100);
}

function priorityIsHigh(priority: string | undefined) {
  return priority?.toLowerCase() === "high";
}

export function summarizeDecisionLibrary(items: DecisionLibraryItem[]): DecisionLibraryStats {
  let evidenceBacked = 0;
  let needsReview = 0;
  let highConfidence = 0;
  let highPriority = 0;
  let totalEvidenceSources = 0;
  let confidenceTotal = 0;
  let confidenceCount = 0;

  for (const item of items) {
    const evidenceCount = normalizeEvidenceSources(item.sourceEvidence).length;
    const confidence = confidencePercent(item.confidenceScore);
    totalEvidenceSources += evidenceCount;

    if (evidenceCount > 0) evidenceBacked++;
    if (confidence != null) {
      confidenceTotal += confidence;
      confidenceCount++;
      if (confidence >= 75) highConfidence++;
    }
    if (priorityIsHigh(item.priority)) highPriority++;
    if (evidenceCount === 0 || confidence == null || confidence < 60) needsReview++;
  }

  return {
    total: items.length,
    evidenceBacked,
    needsReview,
    highConfidence,
    highPriority,
    totalEvidenceSources,
    averageConfidence: confidenceCount > 0 ? Math.round(confidenceTotal / confidenceCount) : null,
  };
}

export function buildDecisionMemo(item: DecisionLibraryItem, status: DecisionLibraryStatus): DecisionMemo {
  const evidenceCount = normalizeEvidenceSources(item.sourceEvidence).length;
  const confidence = confidencePercent(item.confidenceScore);
  const priority = item.priority?.toLowerCase();
  const hasRevenueSignal = Boolean(item.estimatedRevenuePotential);
  const hasExecutionPlan = Boolean(item.actionPlan?.trim());
  const evidenceLabel = evidenceCount > 0
    ? `${evidenceCount} source${evidenceCount === 1 ? "" : "s"} attached`
    : "No source trail attached";

  if (status === "accepted") {
    const posture = evidenceCount > 0 && (confidence ?? 0) >= 75
      ? "Ready for pilot"
      : evidenceCount > 0
        ? "Pilot with review"
        : "Evidence refresh needed";
    const reviewCadence = evidenceCount > 0
      ? "Weekly until launch"
      : "Refresh evidence before launch";
    const confidenceText = confidence == null ? "unknown confidence" : `${confidence}% confidence`;
    const rationaleParts = [
      `${confidenceText} accepted bet`,
      evidenceCount > 0 ? `supported by ${evidenceLabel}` : "missing source evidence",
      hasRevenueSignal ? "with a revenue signal" : "without a revenue signal yet",
      hasExecutionPlan ? "and an execution plan" : "and no execution plan yet",
    ];

    return {
      posture,
      rationale: rationaleParts.join(", ") + ".",
      reviewCadence,
      evidenceLabel,
      riskLabel: evidenceCount === 0
        ? "Missing source trail"
        : (confidence ?? 0) < 60
          ? "Low confidence"
          : "Tracked evidence",
    };
  }

  const posture = evidenceCount > 0 ? "Archived with evidence" : "Archived without evidence";
  const reviewCadence = priority === "high" || (confidence ?? 0) >= 75
    ? "Revisit if market moves"
    : "Quarterly scan";
  const confidenceText = confidence == null ? "unknown confidence" : `${confidence}% confidence`;

  return {
    posture,
    rationale: `Dismissed with ${confidenceText}; keep the source trail so the team can revisit if new signals contradict the decision.`,
    reviewCadence,
    evidenceLabel,
    riskLabel: evidenceCount === 0
      ? "Thin rejection record"
      : priority === "high"
        ? "High-priority watchlist"
        : "Watch for reversals",
  };
}
