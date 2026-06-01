export const BREACH_PROCESS_REGRESSION_ESCALATIONS_EXPORT_KEY = "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations";
export const BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_ASSIGNMENTS_EXPORT_KEY = "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments";
export const BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_CLOSURES_EXPORT_KEY = "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures";
export const BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_REVIEWS_EXPORT_KEY = "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews";
export const BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_APPEALS_EXPORT_KEY = "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals";
export const BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY = "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests";

const REGRESSION_STABILITY_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

type SourceType = string;

type Regression = {
  id: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: SourceType;
  currentBreachCount: number;
  latestBreachAt: string | null;
  newBreachedResolutionIds: string[];
};

type RegressionClosure = {
  id: string;
  regressionId: string;
  closedBy: string;
  closedAt: string;
  currentBreachCount: number;
  newBreachedResolutionIds: string[];
};

export type BreachProcessRegressionEscalation = {
  id: string;
  regressionId: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: SourceType;
  severity: "high" | "critical";
  reason: "rebreach-after-reclosure" | "aged-without-stable-proof";
  closureCount: number;
  triggerClosureId: string;
  triggerClosureClosedAt: string;
  triggerClosureBreachCount: number;
  latestClosureId: string;
  latestClosureClosedAt: string;
  currentBreachCount: number;
  latestBreachAt: string | null;
  agedDays: number;
  newBreachedResolutionIds: string[];
  summary: string;
  nextAction: string;
  evidence: string[];
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type BreachProcessRegressionEscalationAuditAssignment = {
  id: string;
  escalationId: string;
  regressionId: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: SourceType;
  assignedOwner: string;
  assignedBy: string;
  assignedAt: string;
  dueAt: string;
  severity: "high" | "critical";
  reason: BreachProcessRegressionEscalation["reason"];
  currentBreachCount: number;
  latestBreachAt: string | null;
  triggerClosureId: string;
  newBreachedResolutionIds: string[];
  proofRequired: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type BreachProcessRegressionEscalationAuditClosure = {
  id: string;
  assignmentId: string;
  escalationId: string;
  regressionId: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: SourceType;
  closedBy: string;
  closedAt: string;
  severity: "high" | "critical";
  reason: BreachProcessRegressionEscalation["reason"];
  currentBreachCount: number;
  latestBreachAt: string | null;
  triggerClosureId: string;
  newBreachedResolutionIds: string[];
  proofSummary: string;
  proofArtifact: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type BreachProcessRegressionEscalationAuditReviewOutcome = "attested" | "disputed" | "corrective-proof";

export type BreachProcessRegressionEscalationAuditReview = {
  id: string;
  auditClosureId: string;
  assignmentId: string;
  escalationId: string;
  regressionId: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: SourceType;
  reviewer: string;
  reviewedAt: string;
  outcome: BreachProcessRegressionEscalationAuditReviewOutcome;
  severity: "high" | "critical";
  reason: BreachProcessRegressionEscalation["reason"];
  currentBreachCount: number;
  latestBreachAt: string | null;
  triggerClosureId: string;
  newBreachedResolutionIds: string[];
  reviewSummary: string;
  reviewArtifact: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type BreachProcessRegressionEscalationAuditAppealStatus = "quorum-required" | "quorum-cleared" | "stale-dispute" | "clearance-stale" | "fragile-governance" | "fragile-governance-stale" | "fragile-governance-revoked" | "fragile-governance-revocation-stale";

export type BreachProcessRegressionEscalationAuditAppeal = {
  id: string;
  auditClosureId: string;
  assignmentId: string;
  escalationId: string;
  regressionId: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: SourceType;
  recordedBy: string;
  recordedAt: string;
  status: BreachProcessRegressionEscalationAuditAppealStatus;
  reviewerQuorumCount: number;
  independentReviewerCount: number;
  staleDisputeAgeDays: number;
  latestDisputeReviewId: string;
  latestCorrectiveReviewId: string | null;
  conflictingReviewIds: string[];
  reviewerIdentities: string[];
  appealSummary: string;
  appealArtifact: string;
  nextAction: string;
  /** Snapshot of the breached resolution ids covered by a quorum-cleared appeal. */
  clearanceBaselineReceiptIds?: string[];
  /** Breached resolution ids that arrived after a prior quorum clearance and made it stale. */
  reopenedAfterClearanceReceiptIds?: string[];
  /** Id of the prior quorum-cleared appeal that a stale-clearance packet supersedes. */
  priorClearanceAppealId?: string | null;
  /** Days since the prior quorum clearance was recorded when staleness was detected. */
  staleClearanceAgeDays?: number;
  /** Separate owner accountable for fragile-clearance remediation governance. */
  fragileRemediationOwner?: string | null;
  /** Escalation artifact proving fragile-clearance remediation ownership and scope. */
  fragileEscalationArtifact?: string | null;
  /** Proof that reviewer rotation was required before another fragile re-clearance. */
  reviewerRotationProof?: string | null;
  /** Reviewers rotated into the fragile-clearance governance lane. */
  rotatedReviewerIdentities?: string[];
  /** Id of the fragile-governance packet later marked stale. */
  priorFragileGovernanceAppealId?: string | null;
  /** Breached resolution ids the governance packet covered. */
  governanceBaselineReceiptIds?: string[];
  /** Breached resolution ids that landed after governance was accepted. */
  reopenedAfterGovernanceReceiptIds?: string[];
  /** Days since governance was recorded when it became stale. */
  staleGovernanceAgeDays?: number;
  /** Reason the governance packet can no longer clear a fragile owner/source. */
  staleGovernanceReason?: "aged-without-reclearance" | "new-breach-after-governance";
  /** Id of the fragile-governance packet revoked after repeated stale governance. */
  revokedFragileGovernanceAppealId?: string | null;
  /** Stale-governance appeal packets that triggered governance revocation. */
  revokedGovernanceStaleAppealIds?: string[];
  /** Reason the fragile-governance lane was revoked. */
  revocationReason?: "repeated-stale-governance";
  /** Id of the governance-council revocation packet later marked stale. */
  priorGovernanceRevocationAppealId?: string | null;
  /** Days since council revocation was recorded when it expired. */
  staleGovernanceRevocationAgeDays?: number;
  /** Reason the council revocation packet can no longer unlock fresh governance. */
  staleGovernanceRevocationReason?: "aged-without-fresh-governance";
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type BreachProcessRegressionEscalationGovernanceDigest = {
  id: string;
  digestVersion: 1;
  immutable: true;
  escalationId: string;
  regressionId: string;
  owner: string;
  sourceType: SourceType;
  generatedAt: string;
  firstPacketAt: string;
  latestPacketAt: string;
  latestPacketId: string;
  latestStatus: BreachProcessRegressionEscalationAuditAppealStatus;
  packetCount: number;
  governancePacketIds: string[];
  staleGovernancePacketIds: string[];
  councilRevocationPacketIds: string[];
  staleCouncilRevocationPacketIds: string[];
  revokedFragileGovernanceAppealIds: string[];
  revokedGovernanceStaleAppealIds: string[];
  fragileRemediationOwners: string[];
  rotatedReviewerIdentities: string[];
  artifactReferences: string[];
  compactSummary: string;
  packetSearchText: string;
  packetChainSignature: string;
  fullPacketGateRequired: true;
  digestCannotClearGovernance: true;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function nonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isBreachProcessRegressionEscalation(value: unknown): value is BreachProcessRegressionEscalation {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<BreachProcessRegressionEscalation>;
  return (
    typeof record.id === "string" &&
    typeof record.regressionId === "string" &&
    typeof record.planId === "string" &&
    typeof record.closureId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    typeof record.sourceType === "string" &&
    (record.severity === "high" || record.severity === "critical") &&
    (record.reason === "rebreach-after-reclosure" || record.reason === "aged-without-stable-proof") &&
    nonNegativeNumber(record.closureCount) &&
    typeof record.triggerClosureId === "string" &&
    typeof record.triggerClosureClosedAt === "string" &&
    nonNegativeNumber(record.triggerClosureBreachCount) &&
    typeof record.latestClosureId === "string" &&
    typeof record.latestClosureClosedAt === "string" &&
    nonNegativeNumber(record.currentBreachCount) &&
    (record.latestBreachAt === null || typeof record.latestBreachAt === "string") &&
    nonNegativeNumber(record.agedDays) &&
    stringArray(record.newBreachedResolutionIds) &&
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    stringArray(record.evidence)
  );
}

export function isBreachProcessRegressionEscalationAuditAssignment(value: unknown): value is BreachProcessRegressionEscalationAuditAssignment {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<BreachProcessRegressionEscalationAuditAssignment>;
  return (
    typeof record.id === "string" &&
    typeof record.escalationId === "string" &&
    typeof record.regressionId === "string" &&
    typeof record.planId === "string" &&
    typeof record.closureId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    typeof record.sourceType === "string" &&
    typeof record.assignedOwner === "string" &&
    typeof record.assignedBy === "string" &&
    typeof record.assignedAt === "string" &&
    typeof record.dueAt === "string" &&
    (record.severity === "high" || record.severity === "critical") &&
    (record.reason === "rebreach-after-reclosure" || record.reason === "aged-without-stable-proof") &&
    nonNegativeNumber(record.currentBreachCount) &&
    (record.latestBreachAt === null || typeof record.latestBreachAt === "string") &&
    typeof record.triggerClosureId === "string" &&
    stringArray(record.newBreachedResolutionIds) &&
    typeof record.proofRequired === "string" &&
    typeof record.nextAction === "string"
  );
}

export function isBreachProcessRegressionEscalationAuditClosure(value: unknown): value is BreachProcessRegressionEscalationAuditClosure {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<BreachProcessRegressionEscalationAuditClosure>;
  return (
    typeof record.id === "string" &&
    typeof record.assignmentId === "string" &&
    typeof record.escalationId === "string" &&
    typeof record.regressionId === "string" &&
    typeof record.planId === "string" &&
    typeof record.closureId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    typeof record.sourceType === "string" &&
    typeof record.closedBy === "string" &&
    typeof record.closedAt === "string" &&
    (record.severity === "high" || record.severity === "critical") &&
    (record.reason === "rebreach-after-reclosure" || record.reason === "aged-without-stable-proof") &&
    nonNegativeNumber(record.currentBreachCount) &&
    (record.latestBreachAt === null || typeof record.latestBreachAt === "string") &&
    typeof record.triggerClosureId === "string" &&
    stringArray(record.newBreachedResolutionIds) &&
    typeof record.proofSummary === "string" &&
    typeof record.proofArtifact === "string" &&
    typeof record.nextAction === "string"
  );
}

export function isBreachProcessRegressionEscalationAuditReview(value: unknown): value is BreachProcessRegressionEscalationAuditReview {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<BreachProcessRegressionEscalationAuditReview>;
  return (
    typeof record.id === "string" &&
    typeof record.auditClosureId === "string" &&
    typeof record.assignmentId === "string" &&
    typeof record.escalationId === "string" &&
    typeof record.regressionId === "string" &&
    typeof record.planId === "string" &&
    typeof record.closureId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    typeof record.sourceType === "string" &&
    typeof record.reviewer === "string" &&
    typeof record.reviewedAt === "string" &&
    (record.outcome === "attested" || record.outcome === "disputed" || record.outcome === "corrective-proof") &&
    (record.severity === "high" || record.severity === "critical") &&
    (record.reason === "rebreach-after-reclosure" || record.reason === "aged-without-stable-proof") &&
    nonNegativeNumber(record.currentBreachCount) &&
    (record.latestBreachAt === null || typeof record.latestBreachAt === "string") &&
    typeof record.triggerClosureId === "string" &&
    stringArray(record.newBreachedResolutionIds) &&
    typeof record.reviewSummary === "string" &&
    typeof record.reviewArtifact === "string" &&
    typeof record.nextAction === "string"
  );
}

export function isBreachProcessRegressionEscalationAuditAppeal(value: unknown): value is BreachProcessRegressionEscalationAuditAppeal {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<BreachProcessRegressionEscalationAuditAppeal>;
  return (
    typeof record.id === "string" &&
    typeof record.auditClosureId === "string" &&
    typeof record.assignmentId === "string" &&
    typeof record.escalationId === "string" &&
    typeof record.regressionId === "string" &&
    typeof record.planId === "string" &&
    typeof record.closureId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    typeof record.sourceType === "string" &&
    typeof record.recordedBy === "string" &&
    typeof record.recordedAt === "string" &&
    (record.status === "quorum-required" || record.status === "quorum-cleared" || record.status === "stale-dispute" || record.status === "clearance-stale" || record.status === "fragile-governance" || record.status === "fragile-governance-stale" || record.status === "fragile-governance-revoked" || record.status === "fragile-governance-revocation-stale") &&
    nonNegativeNumber(record.reviewerQuorumCount) &&
    nonNegativeNumber(record.independentReviewerCount) &&
    nonNegativeNumber(record.staleDisputeAgeDays) &&
    typeof record.latestDisputeReviewId === "string" &&
    (record.latestCorrectiveReviewId === null || typeof record.latestCorrectiveReviewId === "string") &&
    stringArray(record.conflictingReviewIds) &&
    stringArray(record.reviewerIdentities) &&
    typeof record.appealSummary === "string" &&
    typeof record.appealArtifact === "string" &&
    typeof record.nextAction === "string" &&
    (record.clearanceBaselineReceiptIds === undefined || stringArray(record.clearanceBaselineReceiptIds)) &&
    (record.reopenedAfterClearanceReceiptIds === undefined || stringArray(record.reopenedAfterClearanceReceiptIds)) &&
    (record.priorClearanceAppealId === undefined || record.priorClearanceAppealId === null || typeof record.priorClearanceAppealId === "string") &&
    (record.staleClearanceAgeDays === undefined || nonNegativeNumber(record.staleClearanceAgeDays)) &&
    (record.fragileRemediationOwner === undefined || record.fragileRemediationOwner === null || typeof record.fragileRemediationOwner === "string") &&
    (record.fragileEscalationArtifact === undefined || record.fragileEscalationArtifact === null || typeof record.fragileEscalationArtifact === "string") &&
    (record.reviewerRotationProof === undefined || record.reviewerRotationProof === null || typeof record.reviewerRotationProof === "string") &&
    (record.rotatedReviewerIdentities === undefined || stringArray(record.rotatedReviewerIdentities)) &&
    (record.priorFragileGovernanceAppealId === undefined || record.priorFragileGovernanceAppealId === null || typeof record.priorFragileGovernanceAppealId === "string") &&
    (record.governanceBaselineReceiptIds === undefined || stringArray(record.governanceBaselineReceiptIds)) &&
    (record.reopenedAfterGovernanceReceiptIds === undefined || stringArray(record.reopenedAfterGovernanceReceiptIds)) &&
    (record.staleGovernanceAgeDays === undefined || nonNegativeNumber(record.staleGovernanceAgeDays)) &&
    (record.staleGovernanceReason === undefined || record.staleGovernanceReason === "aged-without-reclearance" || record.staleGovernanceReason === "new-breach-after-governance") &&
    (record.revokedFragileGovernanceAppealId === undefined || record.revokedFragileGovernanceAppealId === null || typeof record.revokedFragileGovernanceAppealId === "string") &&
    (record.revokedGovernanceStaleAppealIds === undefined || stringArray(record.revokedGovernanceStaleAppealIds)) &&
    (record.revocationReason === undefined || record.revocationReason === "repeated-stale-governance") &&
    (record.priorGovernanceRevocationAppealId === undefined || record.priorGovernanceRevocationAppealId === null || typeof record.priorGovernanceRevocationAppealId === "string") &&
    (record.staleGovernanceRevocationAgeDays === undefined || nonNegativeNumber(record.staleGovernanceRevocationAgeDays)) &&
    (record.staleGovernanceRevocationReason === undefined || record.staleGovernanceRevocationReason === "aged-without-fresh-governance")
  );
}

export function isBreachProcessRegressionEscalationGovernanceDigest(value: unknown): value is BreachProcessRegressionEscalationGovernanceDigest {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<BreachProcessRegressionEscalationGovernanceDigest>;
  return (
    typeof record.id === "string" &&
    record.digestVersion === 1 &&
    record.immutable === true &&
    typeof record.escalationId === "string" &&
    typeof record.regressionId === "string" &&
    typeof record.owner === "string" &&
    typeof record.sourceType === "string" &&
    typeof record.generatedAt === "string" &&
    typeof record.firstPacketAt === "string" &&
    typeof record.latestPacketAt === "string" &&
    typeof record.latestPacketId === "string" &&
    (record.latestStatus === "fragile-governance" || record.latestStatus === "fragile-governance-stale" || record.latestStatus === "fragile-governance-revoked" || record.latestStatus === "fragile-governance-revocation-stale") &&
    nonNegativeNumber(record.packetCount) &&
    stringArray(record.governancePacketIds) &&
    stringArray(record.staleGovernancePacketIds) &&
    stringArray(record.councilRevocationPacketIds) &&
    stringArray(record.staleCouncilRevocationPacketIds) &&
    stringArray(record.revokedFragileGovernanceAppealIds) &&
    stringArray(record.revokedGovernanceStaleAppealIds) &&
    stringArray(record.fragileRemediationOwners) &&
    stringArray(record.rotatedReviewerIdentities) &&
    stringArray(record.artifactReferences) &&
    typeof record.compactSummary === "string" &&
    typeof record.packetSearchText === "string" &&
    typeof record.packetChainSignature === "string" &&
    record.fullPacketGateRequired === true &&
    record.digestCannotClearGovernance === true
  );
}

export function parseBreachProcessRegressionEscalationsImport(raw: string): BreachProcessRegressionEscalation[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
    if (!Object.prototype.hasOwnProperty.call(payload, BREACH_PROCESS_REGRESSION_ESCALATIONS_EXPORT_KEY)) return null;
    const entries = payload[BREACH_PROCESS_REGRESSION_ESCALATIONS_EXPORT_KEY];
    const importedAt = new Date().toISOString();
    const exportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const exportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(entries)
      ? entries.filter(isBreachProcessRegressionEscalation).map((entry) => ({
        ...entry,
        source: "imported" as const,
        exportedAt: entry.exportedAt ?? exportedAt,
        exportedBy: entry.exportedBy ?? exportedBy,
        importedAt,
      }))
      : [];
  } catch {
    return null;
  }
}

function parseArrayImport<T>(
  raw: string,
  key: string,
  guard: (value: unknown) => value is T,
): T[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
    if (!Object.prototype.hasOwnProperty.call(payload, key)) return null;
    const entries = payload[key];
    const importedAt = new Date().toISOString();
    const exportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const exportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(entries)
      ? entries.filter(guard).map((entry) => ({
        ...entry,
        source: "imported" as const,
        exportedAt: (entry as { exportedAt?: string }).exportedAt ?? exportedAt,
        exportedBy: (entry as { exportedBy?: string }).exportedBy ?? exportedBy,
        importedAt,
      }))
      : [];
  } catch {
    return null;
  }
}

export function parseBreachProcessRegressionEscalationAuditAssignmentsImport(raw: string) {
  return parseArrayImport(
    raw,
    BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_ASSIGNMENTS_EXPORT_KEY,
    isBreachProcessRegressionEscalationAuditAssignment,
  );
}

export function parseBreachProcessRegressionEscalationAuditClosuresImport(raw: string) {
  return parseArrayImport(
    raw,
    BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_CLOSURES_EXPORT_KEY,
    isBreachProcessRegressionEscalationAuditClosure,
  );
}

export function parseBreachProcessRegressionEscalationAuditReviewsImport(raw: string) {
  return parseArrayImport(
    raw,
    BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_REVIEWS_EXPORT_KEY,
    isBreachProcessRegressionEscalationAuditReview,
  );
}

export function parseBreachProcessRegressionEscalationAuditAppealsImport(raw: string) {
  return parseArrayImport(
    raw,
    BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_APPEALS_EXPORT_KEY,
    isBreachProcessRegressionEscalationAuditAppeal,
  );
}

export function parseBreachProcessRegressionEscalationGovernanceDigestsImport(raw: string) {
  return parseArrayImport(
    raw,
    BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY,
    isBreachProcessRegressionEscalationGovernanceDigest,
  );
}

export function dedupeBreachProcessRegressionEscalationAuditAssignments(assignments: BreachProcessRegressionEscalationAuditAssignment[]) {
  const byId = new Map<string, BreachProcessRegressionEscalationAuditAssignment>();
  assignments
    .slice()
    .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt))
    .forEach((assignment) => {
      if (!byId.has(assignment.id)) byId.set(assignment.id, assignment);
    });
  return Array.from(byId.values()).sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
}

export function dedupeBreachProcessRegressionEscalationAuditClosures(closures: BreachProcessRegressionEscalationAuditClosure[]) {
  const byId = new Map<string, BreachProcessRegressionEscalationAuditClosure>();
  closures
    .slice()
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt))
    .forEach((closure) => {
      if (!byId.has(closure.id)) byId.set(closure.id, closure);
    });
  return Array.from(byId.values()).sort((a, b) => b.closedAt.localeCompare(a.closedAt));
}

export function dedupeBreachProcessRegressionEscalationAuditReviews(reviews: BreachProcessRegressionEscalationAuditReview[]) {
  const byId = new Map<string, BreachProcessRegressionEscalationAuditReview>();
  reviews
    .slice()
    .sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt))
    .forEach((review) => {
      if (!byId.has(review.id)) byId.set(review.id, review);
    });
  return Array.from(byId.values()).sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));
}

export function dedupeBreachProcessRegressionEscalationAuditAppeals(appeals: BreachProcessRegressionEscalationAuditAppeal[]) {
  const byId = new Map<string, BreachProcessRegressionEscalationAuditAppeal>();
  appeals
    .slice()
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    .forEach((appeal) => {
      if (!byId.has(appeal.id)) byId.set(appeal.id, appeal);
    });
  return Array.from(byId.values()).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim() ?? "").filter(Boolean)))
    .sort((a, b) => a.localeCompare(b));
}

function digestIdPart(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "unknown";
}

function compactHash(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function buildGovernancePacketChainSignature(appeals: BreachProcessRegressionEscalationAuditAppeal[]) {
  const parts = appeals
    .slice()
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt) || a.id.localeCompare(b.id))
    .map((appeal) => [
      appeal.id,
      appeal.status,
      appeal.recordedAt,
      appeal.escalationId,
      appeal.regressionId,
      appeal.owner,
      appeal.sourceType,
      appeal.priorFragileGovernanceAppealId ?? "",
      appeal.priorGovernanceRevocationAppealId ?? "",
      appeal.revokedFragileGovernanceAppealId ?? "",
      (appeal.revokedGovernanceStaleAppealIds ?? []).slice().sort().join(","),
      appeal.revocationReason ?? "",
      appeal.staleGovernanceReason ?? "",
      appeal.staleGovernanceRevocationReason ?? "",
      appeal.appealArtifact,
    ].join("|"));
  return `governance-digest-v1:${compactHash(parts.join("\n"))}`;
}

const GOVERNANCE_DIGEST_STATUSES = new Set<BreachProcessRegressionEscalationAuditAppealStatus>([
  "fragile-governance",
  "fragile-governance-stale",
  "fragile-governance-revoked",
  "fragile-governance-revocation-stale",
]);

export function buildBreachProcessRegressionEscalationGovernanceDigests(
  appeals: BreachProcessRegressionEscalationAuditAppeal[],
  generatedAt = new Date().toISOString(),
): BreachProcessRegressionEscalationGovernanceDigest[] {
  const byChain = new Map<string, BreachProcessRegressionEscalationAuditAppeal[]>();
  dedupeBreachProcessRegressionEscalationAuditAppeals(appeals)
    .filter((appeal) => GOVERNANCE_DIGEST_STATUSES.has(appeal.status))
    .forEach((appeal) => {
      const key = `${appeal.owner}::${appeal.sourceType}::${appeal.escalationId}`;
      byChain.set(key, [...(byChain.get(key) ?? []), appeal]);
    });

  const digests: BreachProcessRegressionEscalationGovernanceDigest[] = [];
  byChain.forEach((group) => {
    const sorted = group.slice().sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
    const first = sorted[0];
    const latest = sorted[sorted.length - 1];
    if (!first || !latest) return;
    const governancePackets = sorted.filter((appeal) => appeal.status === "fragile-governance");
    const staleGovernancePackets = sorted.filter((appeal) => appeal.status === "fragile-governance-stale");
    const councilRevocationPackets = sorted.filter((appeal) => appeal.status === "fragile-governance-revoked");
    const staleCouncilRevocationPackets = sorted.filter((appeal) => appeal.status === "fragile-governance-revocation-stale");
    const packetIds = sorted.map((appeal) => appeal.id);
    const artifactReferences = uniqueStrings(sorted.flatMap((appeal) => [
      appeal.appealArtifact,
      appeal.fragileEscalationArtifact,
      appeal.reviewerRotationProof,
    ]));

    digests.push({
      id: `breach-process-regression-governance-digest-${digestIdPart(first.owner)}-${digestIdPart(first.sourceType)}-${digestIdPart(first.escalationId)}-${sorted.length}-${digestIdPart(latest.recordedAt)}`,
      digestVersion: 1,
      immutable: true,
      escalationId: first.escalationId,
      regressionId: first.regressionId,
      owner: first.owner,
      sourceType: first.sourceType,
      generatedAt,
      firstPacketAt: first.recordedAt,
      latestPacketAt: latest.recordedAt,
      latestPacketId: latest.id,
      latestStatus: latest.status,
      packetCount: sorted.length,
      governancePacketIds: governancePackets.map((appeal) => appeal.id),
      staleGovernancePacketIds: staleGovernancePackets.map((appeal) => appeal.id),
      councilRevocationPacketIds: councilRevocationPackets.map((appeal) => appeal.id),
      staleCouncilRevocationPacketIds: staleCouncilRevocationPackets.map((appeal) => appeal.id),
      revokedFragileGovernanceAppealIds: uniqueStrings(councilRevocationPackets.map((appeal) => appeal.revokedFragileGovernanceAppealId)),
      revokedGovernanceStaleAppealIds: uniqueStrings(councilRevocationPackets.flatMap((appeal) => appeal.revokedGovernanceStaleAppealIds ?? [])),
      fragileRemediationOwners: uniqueStrings(sorted.map((appeal) => appeal.fragileRemediationOwner)),
      rotatedReviewerIdentities: uniqueStrings(sorted.flatMap((appeal) => appeal.rotatedReviewerIdentities ?? appeal.reviewerIdentities)),
      artifactReferences,
      compactSummary: `${first.owner} / ${first.sourceType} governance chain compacted into ${sorted.length} packets: ${governancePackets.length} governance, ${staleGovernancePackets.length} stale governance, ${councilRevocationPackets.length} council revocation, ${staleCouncilRevocationPackets.length} stale council revocation.`,
      packetSearchText: uniqueStrings([
        ...packetIds,
        ...sorted.map((appeal) => appeal.status),
        ...sorted.map((appeal) => appeal.appealSummary),
        ...artifactReferences,
        ...sorted.flatMap((appeal) => appeal.reviewerIdentities),
        ...sorted.flatMap((appeal) => appeal.rotatedReviewerIdentities ?? []),
      ]).join(" | "),
      packetChainSignature: buildGovernancePacketChainSignature(sorted),
      fullPacketGateRequired: true,
      digestCannotClearGovernance: true,
      source: "local",
    });
  });

  return digests.sort((a, b) => (
    b.latestPacketAt.localeCompare(a.latestPacketAt)
    || b.packetCount - a.packetCount
    || a.owner.localeCompare(b.owner)
    || a.sourceType.localeCompare(b.sourceType)
  ));
}

export type BreachProcessRegressionEscalationGovernanceDigestIntegrityIssue = {
  digestId: string;
  reason: "missing-packets" | "signature-mismatch";
  missingPacketIds: string[];
  packetChainSignature: string;
  expectedPacketChainSignature: string | null;
};

export type BreachProcessRegressionEscalationGovernanceDigestReplayIssue = {
  digestId: string;
  digestExportedAt: string;
  latestLocalPacketId: string;
  latestLocalPacketAt: string;
};

export type BreachProcessRegressionEscalationGovernanceDigestConflictIssue = {
  owner: string;
  sourceType: string;
  escalationId: string;
  digestIds: string[];
  signatureCount: number;
  packetWindowCount: number;
  packetWindows: string[];
  preferredFullPacketId: string | null;
  preferredFullPacketAt: string | null;
};

export function auditBreachProcessRegressionEscalationGovernanceDigestIntegrity(
  digests: BreachProcessRegressionEscalationGovernanceDigest[],
  appeals: BreachProcessRegressionEscalationAuditAppeal[],
): BreachProcessRegressionEscalationGovernanceDigestIntegrityIssue[] {
  const appealsById = new Map(appeals.map((appeal) => [appeal.id, appeal]));
  const expectedByScope = new Map(
    buildBreachProcessRegressionEscalationGovernanceDigests(appeals, "integrity-audit")
      .map((digest) => [`${digest.owner}::${digest.sourceType}::${digest.escalationId}`, digest]),
  );
  return digests.flatMap((digest) => {
    const digestPacketIds = uniqueStrings([
      ...digest.governancePacketIds,
      ...digest.staleGovernancePacketIds,
      ...digest.councilRevocationPacketIds,
      ...digest.staleCouncilRevocationPacketIds,
    ]);
    const missingPacketIds = digestPacketIds.filter((id) => !appealsById.has(id));
    const expected = expectedByScope.get(`${digest.owner}::${digest.sourceType}::${digest.escalationId}`) ?? null;
    if (missingPacketIds.length > 0) {
      return [{
        digestId: digest.id,
        reason: "missing-packets" as const,
        missingPacketIds,
        packetChainSignature: digest.packetChainSignature,
        expectedPacketChainSignature: expected?.packetChainSignature ?? null,
      }];
    }
    if (!expected || expected.packetChainSignature !== digest.packetChainSignature) {
      return [{
        digestId: digest.id,
        reason: "signature-mismatch" as const,
        missingPacketIds: [],
        packetChainSignature: digest.packetChainSignature,
        expectedPacketChainSignature: expected?.packetChainSignature ?? null,
      }];
    }
    return [];
  });
}

export function auditBreachProcessRegressionEscalationGovernanceDigestReplay(
  digests: BreachProcessRegressionEscalationGovernanceDigest[],
  localAppeals: BreachProcessRegressionEscalationAuditAppeal[],
): BreachProcessRegressionEscalationGovernanceDigestReplayIssue[] {
  const localByScope = new Map<string, BreachProcessRegressionEscalationAuditAppeal[]>();
  localAppeals
    .filter((appeal) => GOVERNANCE_DIGEST_STATUSES.has(appeal.status))
    .forEach((appeal) => {
      const key = `${appeal.owner}::${appeal.sourceType}::${appeal.escalationId}`;
      localByScope.set(key, [...(localByScope.get(key) ?? []), appeal]);
    });

  return digests.flatMap((digest) => {
    const digestExportedAt = digest.exportedAt ?? digest.generatedAt;
    const digestExportedMs = Date.parse(digestExportedAt);
    if (!Number.isFinite(digestExportedMs)) return [];
    const localChain = localByScope.get(`${digest.owner}::${digest.sourceType}::${digest.escalationId}`) ?? [];
    const latestLocalPacket = localChain
      .slice()
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0];
    if (!latestLocalPacket) return [];
    const latestLocalMs = Date.parse(latestLocalPacket.recordedAt);
    if (!Number.isFinite(latestLocalMs) || latestLocalMs <= digestExportedMs) return [];
    return [{
      digestId: digest.id,
      digestExportedAt,
      latestLocalPacketId: latestLocalPacket.id,
      latestLocalPacketAt: latestLocalPacket.recordedAt,
    }];
  });
}

export function auditBreachProcessRegressionEscalationGovernanceDigestConflicts(
  digests: BreachProcessRegressionEscalationGovernanceDigest[],
  appeals: BreachProcessRegressionEscalationAuditAppeal[],
): BreachProcessRegressionEscalationGovernanceDigestConflictIssue[] {
  const digestsByScope = new Map<string, BreachProcessRegressionEscalationGovernanceDigest[]>();
  digests.forEach((digest) => {
    const key = `${digest.owner}::${digest.sourceType}::${digest.escalationId}`;
    digestsByScope.set(key, [...(digestsByScope.get(key) ?? []), digest]);
  });
  const appealsByScope = new Map<string, BreachProcessRegressionEscalationAuditAppeal[]>();
  appeals
    .filter((appeal) => GOVERNANCE_DIGEST_STATUSES.has(appeal.status))
    .forEach((appeal) => {
      const key = `${appeal.owner}::${appeal.sourceType}::${appeal.escalationId}`;
      appealsByScope.set(key, [...(appealsByScope.get(key) ?? []), appeal]);
    });

  const issues: BreachProcessRegressionEscalationGovernanceDigestConflictIssue[] = [];
  digestsByScope.forEach((group, scope) => {
    if (group.length < 2) return;
    const signatures = uniqueStrings(group.map((digest) => digest.packetChainSignature));
    const packetWindows = uniqueStrings(group.map((digest) => (
      `${digest.firstPacketAt}..${digest.latestPacketAt}:${digest.latestPacketId}:${digest.packetCount}`
    )));
    if (signatures.length < 2 && packetWindows.length < 2) return;
    const [owner, sourceType, escalationId] = scope.split("::");
    const preferredFullPacket = (appealsByScope.get(scope) ?? [])
      .slice()
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0] ?? null;
    issues.push({
      owner,
      sourceType,
      escalationId,
      digestIds: uniqueStrings(group.map((digest) => digest.id)),
      signatureCount: signatures.length,
      packetWindowCount: packetWindows.length,
      packetWindows,
      preferredFullPacketId: preferredFullPacket?.id ?? null,
      preferredFullPacketAt: preferredFullPacket?.recordedAt ?? null,
    });
  });
  return issues.sort((a, b) => (
    b.signatureCount - a.signatureCount
    || b.packetWindowCount - a.packetWindowCount
    || a.owner.localeCompare(b.owner)
    || a.sourceType.localeCompare(b.sourceType)
  ));
}

export function formatBreachProcessRegressionEscalationGovernanceDigestConflictDrilldown(
  issue: BreachProcessRegressionEscalationGovernanceDigestConflictIssue,
) {
  const preferredPacket = issue.preferredFullPacketId
    ? `${issue.preferredFullPacketId} at ${issue.preferredFullPacketAt ?? "unknown time"}`
    : "no matching full packet";
  return [
    `Compact governance digest conflict drilldown for ${issue.owner} / ${issue.sourceType} / ${issue.escalationId}.`,
    `Digest ids: ${issue.digestIds.join(", ")}.`,
    `Signatures: ${issue.signatureCount}; packet windows: ${issue.packetWindowCount} (${issue.packetWindows.join(" vs ")}).`,
    `Preferred full appeal packet: ${preferredPacket}.`,
    "Preview-only: compact summaries cannot overwrite or suppress appeal packets.",
  ].join(" ");
}

/** A clearance is treated as fragile once this many of its re-clearances have later gone stale. */
export const BREACH_PROCESS_REGRESSION_ESCALATION_FRAGILE_CLEARANCE_RECURRENCE_THRESHOLD = 2;
export const BREACH_PROCESS_REGRESSION_ESCALATION_FRAGILE_GOVERNANCE_EXPIRY_DAYS = 7;
export const BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_REVOCATION_EXPIRY_DAYS = 7;

export type BreachProcessRegressionEscalationAppealReClearanceCalibration = {
  owner: string;
  sourceType: string;
  /** Number of recorded quorum-cleared appeal packets. */
  clearanceCount: number;
  /** Number of quorum clearances that superseded a prior clearance (re-clearances). */
  reClearanceCount: number;
  /** Number of recorded clearance/governance-stale appeal packets. */
  staleRecurrenceCount: number;
  /** Mean stale age across the stale packets, rounded. */
  meanDaysToStale: number;
  /** Reviewers who appear across more than one stale/cleared appeal packet. */
  repeatReviewers: string[];
  /** Status of the most recently recorded appeal packet. */
  latestStatus: BreachProcessRegressionEscalationAuditAppealStatus | null;
  /** True when stale recurrences cross the fragile-clearance threshold. */
  fragileClearance: boolean;
  summary: string;
};

/**
 * Calibrate appeal re-clearance durability per owner/source from appeal history.
 *
 * A chronically re-breaching owner/source whose quorum clearances keep going stale is
 * flagged as `fragileClearance` even after each individual re-clearance succeeds, because
 * the signal is derived from the recurrence of stale clearances, not the latest status.
 */
export function buildBreachProcessRegressionEscalationAppealReClearanceCalibrations(
  appeals: BreachProcessRegressionEscalationAuditAppeal[],
): BreachProcessRegressionEscalationAppealReClearanceCalibration[] {
  const byOwnerSource = new Map<string, BreachProcessRegressionEscalationAuditAppeal[]>();
  appeals.forEach((appeal) => {
    const key = `${appeal.owner}::${appeal.sourceType}`;
    byOwnerSource.set(key, [...(byOwnerSource.get(key) ?? []), appeal]);
  });
  const calibrations: BreachProcessRegressionEscalationAppealReClearanceCalibration[] = [];
  byOwnerSource.forEach((group) => {
    const sorted = group.slice().sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    const { owner, sourceType } = sorted[0];
    const staleAppeals = sorted.filter((appeal) => appeal.status === "clearance-stale" || appeal.status === "fragile-governance-stale");
    const clearedAppeals = sorted.filter((appeal) => appeal.status === "quorum-cleared");
    const reClearances = clearedAppeals.filter((appeal) => Boolean(appeal.priorClearanceAppealId));
    const staleRecurrenceCount = staleAppeals.length;
    const staleAges = staleAppeals
      .map((appeal) => (
        appeal.status === "fragile-governance-stale"
          ? appeal.staleGovernanceAgeDays ?? appeal.staleClearanceAgeDays ?? 0
          : appeal.staleClearanceAgeDays ?? 0
      ))
      .filter((age) => Number.isFinite(age));
    const meanDaysToStale = staleAges.length > 0
      ? Math.round(staleAges.reduce((total, age) => total + age, 0) / staleAges.length)
      : 0;
    const reviewerPacketCounts = new Map<string, number>();
    [...staleAppeals, ...clearedAppeals].forEach((appeal) => {
      Array.from(new Set(appeal.reviewerIdentities)).forEach((reviewer) => {
        if (!reviewer) return;
        reviewerPacketCounts.set(reviewer, (reviewerPacketCounts.get(reviewer) ?? 0) + 1);
      });
    });
    const repeatReviewers = Array.from(reviewerPacketCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([reviewer]) => reviewer)
      .sort((a, b) => a.localeCompare(b));
    const fragileClearance = staleRecurrenceCount >= BREACH_PROCESS_REGRESSION_ESCALATION_FRAGILE_CLEARANCE_RECURRENCE_THRESHOLD;
    calibrations.push({
      owner,
      sourceType,
      clearanceCount: clearedAppeals.length,
      reClearanceCount: reClearances.length,
      staleRecurrenceCount,
      meanDaysToStale,
      repeatReviewers,
      latestStatus: sorted[0]?.status ?? null,
      fragileClearance,
      summary: fragileClearance
        ? `${owner} / ${sourceType} clearance is fragile: ${staleRecurrenceCount} clearance/governance packets went stale (mean ${meanDaysToStale} days-to-stale).`
        : `${owner} / ${sourceType} clearance recurrence ${staleRecurrenceCount} is below the fragile threshold.`,
    });
  });
  return calibrations.sort((a, b) => (
    (b.fragileClearance ? 1 : 0) - (a.fragileClearance ? 1 : 0)
    || b.staleRecurrenceCount - a.staleRecurrenceCount
    || a.owner.localeCompare(b.owner)
    || a.sourceType.localeCompare(b.sourceType)
  ));
}

function dedupeClosures(closures: RegressionClosure[]) {
  const byId = new Map<string, RegressionClosure>();
  closures
    .slice()
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt))
    .forEach((closure) => {
      if (!byId.has(closure.id)) byId.set(closure.id, closure);
    });
  return Array.from(byId.values()).sort((a, b) => b.closedAt.localeCompare(a.closedAt));
}

export function buildBreachProcessRegressionEscalations(
  regressions: Regression[],
  closures: RegressionClosure[],
  now = new Date(),
): BreachProcessRegressionEscalation[] {
  const closuresByRegression = new Map<string, RegressionClosure[]>();
  dedupeClosures(closures).forEach((closure) => {
    closuresByRegression.set(closure.regressionId, [
      ...(closuresByRegression.get(closure.regressionId) ?? []),
      closure,
    ].sort((a, b) => b.closedAt.localeCompare(a.closedAt)));
  });
  const nowMs = now.getTime();
  return regressions.flatMap((regression) => {
    const regressionClosures = closuresByRegression.get(regression.id) ?? [];
    const latestClosure = regressionClosures[0];
    if (!latestClosure) return [];
    const triggerClosure = regressionClosures
      .slice()
      .sort((a, b) => a.closedAt.localeCompare(b.closedAt))
      .find((closure) => (
        regression.currentBreachCount > closure.currentBreachCount
        || Boolean(regression.latestBreachAt && regression.latestBreachAt > closure.closedAt)
      ));
    const latestClosedMs = Date.parse(latestClosure.closedAt);
    const agedDays = Number.isFinite(latestClosedMs)
      ? Math.max(0, Math.floor((nowMs - latestClosedMs) / (24 * 60 * 60 * 1000)))
      : 0;
    const isAged = !triggerClosure && Number.isFinite(latestClosedMs) && nowMs - latestClosedMs >= REGRESSION_STABILITY_WINDOW_MS;
    if (!triggerClosure && !isAged) return [];
    const closure = triggerClosure ?? latestClosure;
    const reason = triggerClosure ? "rebreach-after-reclosure" as const : "aged-without-stable-proof" as const;
    const newBreachedResolutionIds = regression.newBreachedResolutionIds.filter((id) => !closure.newBreachedResolutionIds.includes(id));
    return [{
      id: `demand-source-blocker-packet-handoff-reopen-sla-breach-process-regression-escalation-${regression.id}`,
      regressionId: regression.id,
      planId: regression.planId,
      closureId: regression.closureId,
      trendId: regression.trendId,
      owner: regression.owner,
      sourceType: regression.sourceType,
      severity: reason === "rebreach-after-reclosure" ? "critical" as const : "high" as const,
      reason,
      closureCount: regressionClosures.length,
      triggerClosureId: closure.id,
      triggerClosureClosedAt: closure.closedAt,
      triggerClosureBreachCount: closure.currentBreachCount,
      latestClosureId: latestClosure.id,
      latestClosureClosedAt: latestClosure.closedAt,
      currentBreachCount: regression.currentBreachCount,
      latestBreachAt: regression.latestBreachAt,
      agedDays,
      newBreachedResolutionIds,
      summary: reason === "rebreach-after-reclosure"
        ? `${regression.owner} / ${regression.sourceType} breached again after regression proof was re-closed.`
        : `${regression.owner} / ${regression.sourceType} regression proof aged without a fresh stable-period checkpoint.`,
      nextAction: "Run a higher-severity owner/source process audit before accepting another reopened handoff as stable.",
      evidence: [
        `Trigger re-closure ${closure.id} at ${closure.closedAt}`,
        `Breach count ${closure.currentBreachCount} -> ${regression.currentBreachCount}; aged ${agedDays} days`,
        `New receipts: ${newBreachedResolutionIds.slice(0, 4).join(", ") || "none"}`,
      ],
      source: "local" as const,
    }];
  }).sort((a, b) => (
    (a.severity === "critical" ? 0 : 1) - (b.severity === "critical" ? 0 : 1)
    || b.currentBreachCount - a.currentBreachCount
    || b.agedDays - a.agedDays
    || a.owner.localeCompare(b.owner)
    || a.sourceType.localeCompare(b.sourceType)
  ));
}
