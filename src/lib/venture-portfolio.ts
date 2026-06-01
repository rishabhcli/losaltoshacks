import {
  deriveFallbackVentureBuildEstimate,
  deriveFallbackVentureEvidenceConfidence,
  deriveFallbackVentureEvaluationLenses,
  deriveFallbackVentureMvpScope,
  deriveFallbackVentureReasoningDebate,
  deriveFallbackVentureWhyNow,
  type VentureEvaluationLens,
  type VentureEvaluationLenses,
  type VentureOperatingWorkspace,
  type VentureOpportunityDemandSnapshot,
  type VentureStage,
} from "./venture-workspace";
import { scoreEvidenceQuality, type EvidenceQualityScore } from "./evidence-quality";

export const VENTURE_LIFECYCLE_OPTIONS = [
  { value: "raw-idea", label: "Raw idea" },
  { value: "researching", label: "Researching" },
  { value: "validating", label: "Validating" },
  { value: "building", label: "Building" },
  { value: "launched", label: "Launched" },
  { value: "getting-signals", label: "Getting signals" },
  { value: "pivoting", label: "Pivoting" },
  { value: "scaling", label: "Scaling" },
  { value: "paused", label: "Paused" },
  { value: "killed", label: "Killed" },
  { value: "archived", label: "Archived" },
] as const;

export type VentureLifecycleStatus = (typeof VENTURE_LIFECYCLE_OPTIONS)[number]["value"];

export const VENTURE_DECISION_OPTIONS = [
  { value: "continue", label: "Continue" },
  { value: "pivot", label: "Pivot" },
  { value: "pause", label: "Pause" },
  { value: "kill", label: "Kill" },
  { value: "scale", label: "Scale" },
  { value: "archive", label: "Archive" },
] as const;

export type VentureDecisionType = (typeof VENTURE_DECISION_OPTIONS)[number]["value"];

export const VENTURE_EVIDENCE_FILTER_OPTIONS = [
  { value: "all", label: "All evidence" },
  { value: "decision-ready", label: "Decision ready" },
  { value: "needs-pressure-test", label: "Needs pressure test" },
  { value: "too-thin", label: "Too thin" },
  { value: "has-gaps", label: "Has gaps" },
  { value: "has-contradictions", label: "Has contradictions" },
] as const;

export type VentureEvidenceFilter = (typeof VENTURE_EVIDENCE_FILTER_OPTIONS)[number]["value"];
export type VentureEvidenceReadiness = "decision-ready" | "needs-pressure-test" | "too-thin";
export type VentureGapActionType = "missing-evidence" | "contradiction" | "weak-source" | "readiness-review";
export type VentureGapActionPriority = "high" | "medium" | "low";
export type VentureGapActionStatus = "launch-requested" | "launched" | "completed" | "dismissed";
export type VentureDemandCalibrationStatus = "not-measured" | "passed" | "failed" | "inconclusive";
export type VenturePredictionOutcome = "expected-pass" | "expected-fail" | "uncertain";
export type VenturePredictionAlignment = "not-predicted" | "confirmed" | "surprised" | "uncertain";
export type VenturePricingCalibrationStatus = "not-measured" | "validated" | "weak" | "rejected" | "inconclusive";
export type VentureAtlasValidationResultOutcome = "passed" | "failed" | "pivot" | "inconclusive";
export type VentureInterviewSentiment = "positive" | "mixed" | "negative";
export type VentureOutreachApprovalStatus = "draft" | "approved" | "manual-contact-planned" | "completed" | "dismissed";
export type VentureRiskSeverity = "low" | "medium" | "high" | "critical";
export type VentureRiskStatus = "open" | "monitoring" | "mitigating" | "resolved" | "accepted";
export type VentureRiskSourceType = "customer-interview" | "outreach-approval" | "gap-outcome" | "manual";
export type VentureMvpBuildStatus = "not-started" | "brief-ready" | "repo-attached" | "checks-running" | "executable" | "blocked";
export type VentureMvpCheckStatus = "pending" | "passed" | "failed" | "blocked";
export type VentureArtifactType = "build-brief" | "source-repo" | "test-report" | "browser-smoke" | "deployment-proof" | "analytics-plan" | "changelog" | "other";
export type VentureArtifactStatus = "expected" | "attached" | "verified" | "blocked" | "superseded";
export type VentureMoneySignalType = "revenue" | "expense" | "commitment" | "refund" | "credit" | "grant";
export type VentureMoneySignalStatus = "planned" | "committed" | "received" | "spent" | "refunded" | "blocked";
export type VentureMoneyApprovalState = "approval-required" | "record-only" | "blocked-before-external-action";
export type VentureMoneyExternalActionState = "no-app-charge" | "no-app-spend" | "no-app-refund";
export type VentureRoadmapTaskPriority = "high" | "medium" | "low";
export type VentureRoadmapTaskStatus = "queued" | "in-progress" | "done" | "blocked" | "dismissed";
export type VentureRoadmapSourceType = "customer-feature" | "risk-mitigation" | "mvp-blocker" | "artifact-blocker" | "deployment-promotion" | "manual";
export type VentureSupportIssueType = "support-question" | "pilot-issue" | "bug" | "onboarding-friction" | "manual-workaround" | "retention-risk";
export type VentureSupportIssueSeverity = "low" | "medium" | "high" | "critical";
export type VentureSupportIssueStatus = "open" | "triaged" | "in-progress" | "resolved" | "dismissed";
export type VentureSupportIssueSourceType = "customer-interview" | "roadmap-task" | "mvp-workspace" | "deployment-promotion" | "manual";
export type VentureActivationCohortSourceType = "experiment-result" | "money-signal" | "support-issue" | "pilot-signal-gate" | "manual";
export type VentureChannelEconomicsSourceType = "activation-cohort" | "money-signal" | "manual";
export type VenturePaybackStatus = "unknown" | "no-payback" | "partial-payback" | "paid-back";
export type VentureKillPressureDimension = "evidence" | "market-size" | "differentiation" | "demand" | "pricing" | "retention" | "support" | "channel-economics" | "runway";
export type VentureKillPressureSeverity = "low" | "medium" | "high" | "critical";
export type VentureAutonomyApprovalLevel = "read-only-research" | "draft-artifact-generation" | "local-code-generation" | "local-test-execution" | "deployment-proposal" | "human-approved-deployment" | "human-approved-outreach" | "human-approved-spend" | "human-approved-billing-change";
export type VentureAutonomyAuditStatus = "proposed" | "approved" | "executed" | "blocked" | "dismissed";
export type VentureAutonomySideEffect = "none" | "local-only" | "external-proposed" | "external-approved" | "external-blocked";
export type VentureAgentRunSourceType = "recommendation" | "follow-up-mission" | "artifact-generation" | "autonomy-audit" | "manual";
export type VentureAgentRunStatus = "planned" | "prompt-ready" | "executed" | "blocked" | "replayed";
export type VentureCompetitorType = "direct" | "indirect" | "substitute" | "status-quo" | "emerging";
export type VentureCompetitorThreatLevel = "low" | "medium" | "high" | "critical";
export type VentureCompetitorStatus = "watching" | "investigating" | "validated" | "mitigated" | "dismissed";
export type VentureCompetitorSourceType = "workspace-simulation" | "evidence-source" | "risk-record" | "customer-interview" | "manual";
export type VentureBrowserResearchSourceType = "gap-action" | "readiness-notice" | "competitor-watch" | "manual";
export type VentureBrowserResearchStatus = "queued" | "running" | "evidence-captured" | "blocked" | "dismissed";
export type VentureFinancialModelStatus = "scale-ready" | "needs-proof" | "runway-risk" | "blocked";
export type VentureOutreachCampaignStatus = "ready" | "needs-approval" | "blocked" | "recorded";
export type VentureGeneratedAppHandoffStatus = "source-pending" | "brief-ready" | "repo-attached" | "executable";
export type VentureGeneratedAppSourceScaffoldStatus = "draft-only" | "ready-to-materialize" | "repo-attached" | "verified-executable";
export type VentureGeneratedAppVerificationProofStatus = "not-materialized" | "partial-proof" | "verified" | "blocked";
export type VentureRevenueGenerationStatus = "no-evidence" | "paid-validation" | "repeatable-revenue" | "scaling-revenue" | "blocked";
export type VentureScaleStrongBranchStatus = "scale-ready" | "approval-required" | "needs-proof" | "blocked";
export type VentureScaleStrongBranchSupportStatus = "support-light" | "support-monitor" | "support-blocked";

export const VENTURE_NO_MVP_SOURCE_ATTACHED = "No generated source attached yet.";
export const VENTURE_NO_ARTIFACT_URI_ATTACHED = "No artifact URI attached yet.";

export const VENTURE_OUTREACH_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "manual-contact-planned", label: "Manual contact planned" },
  { value: "completed", label: "Completed" },
  { value: "dismissed", label: "Dismissed" },
] as const;

export const VENTURE_RISK_SEVERITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const;

export const VENTURE_RISK_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "monitoring", label: "Monitoring" },
  { value: "mitigating", label: "Mitigating" },
  { value: "resolved", label: "Resolved" },
  { value: "accepted", label: "Accepted" },
] as const;

export const VENTURE_MVP_BUILD_STATUS_OPTIONS = [
  { value: "not-started", label: "Not started" },
  { value: "brief-ready", label: "Brief ready" },
  { value: "repo-attached", label: "Repo attached" },
  { value: "checks-running", label: "Checks running" },
  { value: "executable", label: "Executable" },
  { value: "blocked", label: "Blocked" },
] as const;

export const VENTURE_MVP_CHECK_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "blocked", label: "Blocked" },
] as const;

export const VENTURE_ARTIFACT_TYPE_OPTIONS = [
  { value: "build-brief", label: "Build brief" },
  { value: "source-repo", label: "Source repo" },
  { value: "test-report", label: "Test report" },
  { value: "browser-smoke", label: "Browser smoke" },
  { value: "deployment-proof", label: "Deployment proof" },
  { value: "analytics-plan", label: "Analytics plan" },
  { value: "changelog", label: "Changelog" },
  { value: "other", label: "Other" },
] as const;

export const VENTURE_ARTIFACT_STATUS_OPTIONS = [
  { value: "expected", label: "Expected" },
  { value: "attached", label: "Attached" },
  { value: "verified", label: "Verified" },
  { value: "blocked", label: "Blocked" },
  { value: "superseded", label: "Superseded" },
] as const;

export const VENTURE_BROWSER_RESEARCH_STATUS_OPTIONS = [
  { value: "queued", label: "Queued" },
  { value: "running", label: "Running" },
  { value: "evidence-captured", label: "Evidence captured" },
  { value: "blocked", label: "Blocked" },
  { value: "dismissed", label: "Dismissed" },
] as const;

export const VENTURE_MONEY_SIGNAL_TYPE_OPTIONS = [
  { value: "revenue", label: "Revenue" },
  { value: "expense", label: "Expense" },
  { value: "commitment", label: "Commitment" },
  { value: "refund", label: "Refund" },
  { value: "credit", label: "Credit" },
  { value: "grant", label: "Grant" },
] as const;

export const VENTURE_MONEY_SIGNAL_STATUS_OPTIONS = [
  { value: "planned", label: "Planned" },
  { value: "committed", label: "Committed" },
  { value: "received", label: "Received" },
  { value: "spent", label: "Spent" },
  { value: "refunded", label: "Refunded" },
  { value: "blocked", label: "Blocked" },
] as const;

export const VENTURE_ROADMAP_PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export const VENTURE_ROADMAP_STATUS_OPTIONS = [
  { value: "queued", label: "Queued" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
  { value: "dismissed", label: "Dismissed" },
] as const;

export const VENTURE_SUPPORT_ISSUE_TYPE_OPTIONS = [
  { value: "support-question", label: "Support question" },
  { value: "pilot-issue", label: "Pilot issue" },
  { value: "bug", label: "Bug" },
  { value: "onboarding-friction", label: "Onboarding friction" },
  { value: "manual-workaround", label: "Manual workaround" },
  { value: "retention-risk", label: "Retention risk" },
] as const;

export const VENTURE_SUPPORT_ISSUE_SEVERITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const;

export const VENTURE_SUPPORT_ISSUE_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "triaged", label: "Triaged" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
] as const;

export interface VentureDecisionRecord {
  id: string;
  decidedAt: string;
  decision: VentureDecisionType;
  previousLifecycleStatus: VentureLifecycleStatus;
  nextLifecycleStatus: VentureLifecycleStatus;
  rationale: string;
  nextAction: string;
}

export interface ScoredVentureEvidence {
  id: string;
  platform: string;
  title: string;
  url: string;
  summary: string;
  quality: EvidenceQualityScore;
}

export interface VentureEvidenceProfile {
  sourceCount: number;
  averageScore: number;
  readinessScore: number;
  readiness: VentureEvidenceReadiness;
  strongSourceCount: number;
  weakSourceCount: number;
  missingEvidenceCount: number;
  contradictionCount: number;
  scoredSources: ScoredVentureEvidence[];
  warnings: string[];
}

export type VentureReadinessNoticeTone = "blocked" | "degraded" | "empty";

export interface VentureReadinessNotice {
  id: string;
  tone: VentureReadinessNoticeTone;
  title: string;
  detail: string;
  nextAction: string;
}

export interface VentureThesisDraftInput {
  title?: string;
  targetBuyer?: string;
  painStatement?: string;
  productWedge?: string;
  acquisitionChannel?: string;
}

export interface VentureSimilarityMatch {
  ventureId: string;
  title: string;
  score: number;
  recommendation: "reuse" | "fork" | "merge" | "new";
  matchedFields: string[];
  differenceQuestions: string[];
  reason: string;
  nextAction: string;
}

export type VentureRelatedIdeaMergeRecommendation =
  | "merge"
  | "fork"
  | "reuse"
  | "keep-separate";

export interface VentureRelatedIdeaMergeAudit {
  id: string;
  primaryVentureId: string;
  primaryTitle: string;
  relatedVentureId: string;
  relatedTitle: string;
  similarityScore: number;
  matchedFields: string[];
  recommendation: VentureRelatedIdeaMergeRecommendation;
  sharedThesisSummary: string;
  differencesToPreserve: string[];
  evidenceProvenance: {
    primaryEvidence: string[];
    relatedEvidence: string[];
  };
  risks: string[];
  nextAction: string;
  humanReviewRequired: true;
  markdown: string;
}

export interface VentureConvertedPainMemory {
  id: string;
  ventureId: string;
  title: string;
  targetBuyer: string;
  painStatement: string;
  conversionScore: number;
  strongestSignal: string;
  paidCommitmentCount: number;
  paidUserCount: number;
  retainedUserCount: number;
  revenueCents: number;
  channels: string[];
  evidence: string[];
  reusableLesson: string;
  nextAction: string;
}

export type VentureWrongClaimMemorySourceType = "contradiction" | "failed-experiment" | "rejected-pricing" | "killed-decision";

export interface VentureWrongClaimMemory {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureWrongClaimMemorySourceType;
  severity: "medium" | "high" | "critical";
  claim: string;
  correction: string;
  evidence: string;
  correctedBelief: string;
  neverReuse: string;
  nextAction: string;
}

export interface VentureWorkedChannelMemory {
  id: string;
  ventureId: string;
  title: string;
  channel: string;
  channelScore: number;
  paybackStatus: VenturePaybackStatus;
  signupCount: number;
  activatedCount: number;
  retainedUserCount: number;
  paidUserCount: number;
  spendCents: number;
  revenueCents: number;
  cacCents: number;
  sourceTypes: string[];
  evidence: string[];
  strongestSignal: string;
  reusableLesson: string;
  nextAction: string;
}

export type VentureFailedOutreachMemorySourceType = "approval-blocked" | "approval-dismissed" | "campaign-blocked" | "campaign-needs-approval" | "risk-gated";

export interface VentureFailedOutreachMemory {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureFailedOutreachMemorySourceType;
  severity: "medium" | "high" | "critical";
  persona: string;
  channel: string;
  message: string;
  failureReason: string;
  evidence: string;
  neverRepeat: string;
  reusableLesson: string;
  nextAction: string;
}

export interface VentureConvertedPricingMemory {
  id: string;
  ventureId: string;
  title: string;
  pricingHypothesis: string;
  acceptedPrice: string;
  conversionScore: number;
  qualifiedBuyerCount: number;
  paidCommitmentCount: number;
  invoiceRequestCount: number;
  paidSignalCount: number;
  revenueCents: number;
  evidence: string[];
  reusableLesson: string;
  nextAction: string;
}

export interface VentureMvpFeatureMemory {
  id: string;
  ventureId: string;
  title: string;
  feature: string;
  impactScore: number;
  requestedCount: number;
  roadmapTaskCount: number;
  supportIssueCount: number;
  activationCount: number;
  retainedUserCount: number;
  paidUserCount: number;
  proofStatus: VentureGeneratedAppVerificationProofStatus;
  qaStatus: VentureQaReleaseStatus;
  sourceTypes: string[];
  evidence: string[];
  reusableLesson: string;
  nextAction: string;
}

export interface VentureRetainedUserMemory {
  id: string;
  ventureId: string;
  title: string;
  cohortLabel: string;
  targetBuyer: string;
  acquisitionChannel: string;
  activationEvent: string;
  retentionWindow: string;
  retentionScore: number;
  signupCount: number;
  activatedCount: number;
  retainedUserCount: number;
  paidUserCount: number;
  revenueCents: number;
  supportIssueCount: number;
  retentionRate: number;
  paidRate: number;
  evidence: string[];
  reusableLesson: string;
  nextAction: string;
}

export interface VentureSuccessPredictionMemory {
  id: string;
  ventureId: string;
  title: string;
  experimentId: string;
  type: string;
  predictedOutcome: VenturePredictionOutcome;
  predictionAlignment: VenturePredictionAlignment;
  signalScore: number;
  conversionProbability: number;
  retentionProbability: number;
  expansionPotential: number;
  buyerUrgency: number;
  budgetLikelihood: number;
  channelReach: number;
  successThreshold: string;
  result: string;
  interpretation: string;
  strongestOutcome: string;
  pricingSignalCount: number;
  paidCommitmentCount: number;
  retainedUserCount: number;
  revenueCents: number;
  evidence: string[];
  reusableLesson: string;
  nextAction: string;
}

export type VentureVanityMetricMemorySourceType = "experiment-result" | "activation-cohort" | "channel-economics" | "pricing-signal";

export interface VentureVanityMetricMemory {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureVanityMetricMemorySourceType;
  severity: "medium" | "high" | "critical";
  metricLabel: string;
  metricValue: string;
  metricCount: number;
  weakOutcome: string;
  evidence: string;
  whyMisleading: string;
  neverTreatAs: string;
  nextAction: string;
}

export interface VentureGeneratedCodePatternMemory {
  id: string;
  ventureId: string;
  title: string;
  appName: string;
  patternScore: number;
  scaffoldStatus: VentureGeneratedAppSourceScaffoldStatus;
  proofStatus: VentureGeneratedAppVerificationProofStatus;
  qaStatus: VentureQaReleaseStatus;
  fileCount: number;
  passedCheckCount: number;
  requiredCheckCount: number;
  passedMvpCheckCount: number;
  fastestPattern: string;
  sourceSignaturePreview: string[];
  commandLane: string[];
  evidence: string[];
  reusableLesson: string;
  nextAction: string;
}

export interface VentureEmpiricalCalibrationMemory {
  id: string;
  ventureId: string;
  title: string;
  calibrationScore: number;
  gullibilityRisk: "low" | "medium" | "high";
  confirmedPredictionCount: number;
  surprisedPredictionCount: number;
  vanityTrapCount: number;
  failureLessonCount: number;
  supportBurdenCount: number;
  strongestTrustSignal: string;
  strongestDiscountSignal: string;
  evidence: string[];
  reusableLesson: string;
  nextAction: string;
}

export interface VentureFakeMarketMemory {
  id: string;
  ventureId: string;
  title: string;
  marketLabel: string;
  targetBuyer: string;
  painStatement: string;
  fakeScore: number;
  demandDriftStatus: VentureDemandDriftStatus;
  baselineDemandScore: number;
  actualDemandScore: number;
  vanityTrapCount: number;
  failureLessonCount: number;
  killRecommendation: VentureDecisionType;
  whyAttractive: string;
  whyFake: string;
  evidence: string[];
  neverRepeat: string;
  nextAction: string;
}

export type VentureFailureLessonSourceType = "killed-decision" | "failed-experiment" | "rejected-pricing" | "critical-risk";

export interface VentureFailureLesson {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureFailureLessonSourceType;
  severity: "medium" | "high" | "critical";
  matched: boolean;
  lesson: string;
  evidence: string;
  neverRepeat: string;
  reuseTrigger: string;
  nextAction: string;
}

export type VentureRevivalTriggerSourceType = "passed-experiment" | "validated-pricing" | "resolved-risk" | "captured-browser-evidence";

export interface VentureRevivalTrigger {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureRevivalTriggerSourceType;
  confidence: "watch" | "revival-review";
  matched: boolean;
  originalFailure: string;
  freshEvidence: string;
  changedAssumption: string;
  revivalCondition: string;
  nextAction: string;
  recordedAt: string;
}

export type VentureWeakBranchKillMemorySourceType = "saved-venture" | "spawned-draft";
export type VentureWeakBranchKillMemoryStatus = "kill-recommended" | "pause-recommended" | "archived" | "revival-watch";

export interface VentureWeakBranchKillMemory {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureWeakBranchKillMemorySourceType;
  sourceId: string;
  sourceTitle: string;
  status: VentureWeakBranchKillMemoryStatus;
  recommendation: VentureDecisionType;
  severity: VentureKillPressureSeverity;
  confidenceScore: number;
  primaryReason: string;
  evidence: string[];
  stopRules: string[];
  noGoBoundaries: string[];
  failureLessons: string[];
  revivalConditions: string[];
  nextAction: string;
  markdown: string;
}

export type VentureMarketModelConfidence = "low" | "medium" | "high";

export interface VentureMarketModel {
  id: string;
  ventureId: string;
  title: string;
  competition: string;
  channel: string;
  pricing: string;
  timing: string;
  risks: string[];
  missingProof: string[];
  confidence: VentureMarketModelConfidence;
  confidenceScore: number;
  nextAction: string;
}

export type VentureFounderExecutionMemoStatus = "ready" | "pressure-test" | "blocked";

export interface VentureFounderExecutionMemoSection {
  heading: string;
  body: string;
  nextAction: string;
}

export interface VentureFounderExecutionMemo {
  id: string;
  ventureId: string;
  title: string;
  status: VentureFounderExecutionMemoStatus;
  statusReason: string;
  primaryDecision: VentureDecisionType;
  primaryNextAction: string;
  demandDriftStatus: VentureDemandDriftStatus;
  marketConfidence: VentureMarketModelConfidence;
  technicalTicket: string;
  productSpec: string;
  autonomyBoundary: string;
  sourceEvidence: string[];
  sections: VentureFounderExecutionMemoSection[];
  markdown: string;
}

export type VentureExperimentLaunchPackStatus = "ready" | "needs-approval" | "recorded" | "blocked";

export interface VentureExperimentLaunchPack {
  id: string;
  ventureId: string;
  experimentId: string;
  status: VentureExperimentLaunchPackStatus;
  title: string;
  audience: string;
  channel: string;
  hypothesis: string;
  landingPageSections: string[];
  channelCopy: string[];
  successMetric: string;
  failureMetric: string;
  riskChecks: string[];
  approvalGates: string[];
  checklist: string[];
  replayCommand: string;
  markdown: string;
}

export type VentureQaReleaseStatus = "ready" | "needs-fixes" | "blocked";
export type VentureDeploymentReadinessStatus = "proposal-ready" | "needs-proof" | "blocked";

export interface VentureQaReleaseReport {
  id: string;
  ventureId: string;
  title: string;
  status: VentureQaReleaseStatus;
  releaseReadinessScore: number;
  passedCheckCount: number;
  totalCheckCount: number;
  blockers: string[];
  warnings: string[];
  artifactSummary: string;
  supportRiskSummary: string;
  deploymentBoundary: string;
  launchRiskSummary: string;
  checklist: string[];
  markdown: string;
}

export interface VentureDeploymentReadinessPacket {
  id: string;
  ventureId: string;
  title: string;
  status: VentureDeploymentReadinessStatus;
  readinessScore: number;
  generatedAppProofStatus: VentureGeneratedAppVerificationProofStatus;
  qaStatus: VentureQaReleaseStatus;
  deploymentProofStatus: VentureArtifactStatus | "missing";
  approvalBoundary: string;
  noDeployBoundary: string;
  financeRisk: string;
  supportRisk: string;
  blockers: string[];
  requiredApprovals: string[];
  evidence: string[];
  proposalSteps: string[];
  rollbackPlan: string[];
  markdown: string;
}

export type VentureDeploymentEnvironmentId = "local" | "preview" | "staging" | "production";
export type VentureDeploymentEnvironmentStatus = "ready" | "needs-proof" | "blocked";

export interface VentureDeploymentEnvironmentTarget {
  id: VentureDeploymentEnvironmentId;
  label: string;
  status: VentureDeploymentEnvironmentStatus;
  proofSummary: string;
  approvalBoundary: string;
  requiredProof: string[];
  nextAction: string;
  linkedRoadmapTaskId?: string;
  linkedRoadmapTaskOwner?: string;
  linkedRoadmapTaskStatus?: VentureRoadmapTaskStatus;
  linkedRoadmapTaskTitle?: string;
  linkedSupportIssueId?: string;
  linkedSupportIssueOwner?: string;
  linkedSupportIssueStatus?: VentureSupportIssueStatus;
  linkedSupportIssueTitle?: string;
}

export interface VentureDeploymentEnvironmentMatrix {
  id: string;
  ventureId: string;
  title: string;
  targets: VentureDeploymentEnvironmentTarget[];
  productionBoundary: string;
  markdown: string;
}

export type VentureDeploymentOwnerWorkType = "roadmap-task" | "support-issue";
export type VentureDeploymentOwnerWorkStatus = VentureRoadmapTaskStatus | VentureSupportIssueStatus | "candidate";
export type VentureDeploymentOwnerSlaStatus = "fresh" | "watch" | "stale";

export interface VentureDeploymentOwnerWorkItem {
  id: string;
  ventureId: string;
  ventureTitle: string;
  targetId: VentureDeploymentEnvironmentId;
  targetLabel: string;
  targetStatus: VentureDeploymentEnvironmentStatus;
  workType: VentureDeploymentOwnerWorkType;
  recordId?: string;
  sourceRecordId: string;
  owner: string;
  title: string;
  status: VentureDeploymentOwnerWorkStatus;
  createdAt: string;
  ageDays: number;
  slaStatus: VentureDeploymentOwnerSlaStatus;
  slaReason: string;
  proofSummary: string;
  approvalBoundary: string;
  requiredProof: string[];
  nextAction: string;
}

export interface VentureDeploymentOwnerWorklist {
  ownerFilter: string;
  owners: string[];
  items: VentureDeploymentOwnerWorkItem[];
  markdown: string;
}

export interface VentureDeploymentOwnerWorkloadSummary {
  owner: string;
  itemCount: number;
  unresolvedCount: number;
  candidateCount: number;
  queuedCount: number;
  triagedCount: number;
  inProgressCount: number;
  blockedCount: number;
  doneCount: number;
  resolvedCount: number;
  freshCount: number;
  watchCount: number;
  staleCount: number;
  productionCount: number;
  stagingCount: number;
  previewCount: number;
  localCount: number;
}

export interface VentureDeploymentEscalationAuditItem {
  id: string;
  ventureId: string;
  ventureTitle: string;
  auditId: string;
  sourceRecordId?: string;
  createdAt: string;
  actionType: string;
  actor: string;
  approvalLevel: VentureAutonomyApprovalLevel;
  status: VentureAutonomyAuditStatus;
  sideEffect: VentureAutonomySideEffect;
  riskNote: string;
  replayNote: string;
  evidence: string;
  nextAction: string;
}

export interface VentureDeploymentEscalationAuditRollup {
  count: number;
  proposedCount: number;
  approvedCount: number;
  blockedCount: number;
  executedCount: number;
  dismissedCount: number;
  noSendCount: number;
  externalSideEffectCount: number;
  replayableCount: number;
  latestCreatedAt: string;
  items: VentureDeploymentEscalationAuditItem[];
  markdown: string;
}

export type VentureInvestorBriefStatus = "investable" | "watch" | "not-ready";

export interface VentureInvestorBrief {
  id: string;
  ventureId: string;
  title: string;
  status: VentureInvestorBriefStatus;
  investabilityScore: number;
  recommendation: VentureDecisionType;
  marketSummary: string;
  demandSummary: string;
  tractionSummary: string;
  revenueSummary: string;
  riskSummary: string;
  qaSummary: string;
  nextAsk: string;
  sections: VentureFounderExecutionMemoSection[];
  markdown: string;
}

export interface VentureFinancialModel {
  id: string;
  ventureId: string;
  title: string;
  status: VentureFinancialModelStatus;
  financeScore: number;
  receivedRevenueCents: number;
  committedRevenueCents: number;
  cohortRevenueCents: number;
  channelRevenueCents: number;
  totalEvidenceRevenueCents: number;
  expenseCents: number;
  acquisitionSpendCents: number;
  netEvidenceCashCents: number;
  paidUserCount: number;
  blendedCacCents: number;
  paybackStatus: VenturePaybackStatus;
  runwayRisk: string;
  scalingThreshold: string;
  revenueSummary: string;
  expenseSummary: string;
  unitEconomicsSummary: string;
  runwaySummary: string;
  assumptions: string[];
  risks: string[];
  nextActions: string[];
  markdown: string;
}

export type VentureChartUnit = "score" | "count" | "currency-cents" | "percent";
export type VentureChartTone = "emerald" | "blue" | "amber" | "red" | "slate";

export interface VentureChartDatum {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  unit: VentureChartUnit;
  detail: string;
  tone: VentureChartTone;
}

export interface VenturePortfolioChart {
  id: string;
  title: string;
  unit: VentureChartUnit;
  data: VentureChartDatum[];
}

export interface VenturePortfolioChartPack {
  id: string;
  ventureCount: number;
  chartCount: number;
  charts: VenturePortfolioChart[];
  markdown: string;
}

export interface VentureOutreachCampaignBrief {
  id: string;
  ventureId: string;
  title: string;
  status: VentureOutreachCampaignStatus;
  persona: string;
  channel: string;
  approvalBoundary: string;
  noSendBoundary: string;
  audienceSegments: string[];
  messageSequence: string[];
  proofPoints: string[];
  riskChecks: string[];
  sourceEvidence: string[];
  nextActions: string[];
  markdown: string;
}

export interface VentureGeneratedAppSourceFile {
  path: string;
  role: string;
  language: string;
  content: string;
  contentSignature: string;
}

export interface VentureGeneratedAppSourceScaffold {
  id: string;
  ventureId: string;
  title: string;
  status: VentureGeneratedAppSourceScaffoldStatus;
  appName: string;
  localTargetPath: string;
  sourceBoundary: string;
  materializationInstruction: string;
  runnableProofStatus: string;
  sourceFiles: VentureGeneratedAppSourceFile[];
  noFakeSourceSafeguards: string[];
  verificationCommands: string[];
  proofCaptureChecklist: string[];
  markdown: string;
}

export interface VentureGeneratedAppVerificationCheck {
  label: string;
  command: string;
  status: VentureMvpCheckStatus;
  evidence: string;
}

export interface VentureGeneratedAppVerificationProof {
  id: string;
  ventureId: string;
  title: string;
  status: VentureGeneratedAppVerificationProofStatus;
  appName: string;
  targetPath: string;
  proofSummary: string;
  passedCheckCount: number;
  requiredCheckCount: number;
  materializerCommand: string;
  verifierCommand: string;
  checks: VentureGeneratedAppVerificationCheck[];
  missingProof: string[];
  nextActions: string[];
  markdown: string;
}

export interface VentureGeneratedAppVerifierCommandResult {
  command: string;
  ok: boolean;
  status: number | string | null;
  durationMs: number;
  stdout: string;
  stderr: string;
}

export interface VentureGeneratedAppVerifierReport {
  scaffoldId: string;
  ventureId: string;
  appName: string;
  target: string;
  fileCount: number;
  ok: boolean;
  results: VentureGeneratedAppVerifierCommandResult[];
}

export interface VentureGeneratedAppHandoff {
  id: string;
  ventureId: string;
  title: string;
  status: VentureGeneratedAppHandoffStatus;
  appName: string;
  repoPath: string;
  sourceCodeStatus: string;
  generationBoundary: string;
  routePlan: string[];
  fileManifest: string[];
  dataModel: string[];
  envVars: string[];
  verificationCommands: string[];
  qaChecklist: string[];
  sourceScaffold: VentureGeneratedAppSourceScaffold;
  deploymentBoundary: string;
  owner: string;
  markdown: string;
}

export interface VentureKillDecisionArtifact {
  id: string;
  ventureId: string;
  title: string;
  recommendation: VentureDecisionType;
  severity: VentureKillPressureSeverity;
  confidenceScore: number;
  latestRecordedDecision: string;
  primaryReason: string;
  evidenceForStopping: string[];
  evidenceForContinuing: string[];
  stopRules: string[];
  pivotTriggers: string[];
  scalePrerequisites: string[];
  revivalTriggers: string[];
  nextActions: string[];
  markdown: string;
}

export interface VentureRevenueGenerationPosture {
  id: string;
  ventureId: string;
  title: string;
  status: VentureRevenueGenerationStatus;
  captureScore: number;
  receivedRevenueCents: number;
  committedRevenueCents: number;
  cohortRevenueCents: number;
  channelRevenueCents: number;
  totalEvidenceRevenueCents: number;
  paidPricingSignalCount: number;
  paidCommitmentCount: number;
  invoiceRequestCount: number;
  paidActivationCohortCount: number;
  paidCohortUserCount: number;
  paidBackChannelCount: number;
  channelPaybackCoverageCents: number;
  acquisitionSpendCents: number;
  paybackStatus: VenturePaybackStatus;
  pricingCalibrationStatus: VenturePricingCalibrationStatus;
  primaryRevenueSource: string;
  summary: string;
  evidence: string[];
  gaps: string[];
  nextAction: string;
  markdown: string;
}

export interface VentureScaleStrongBranchPlan {
  id: string;
  ventureId: string;
  title: string;
  status: VentureScaleStrongBranchStatus;
  supportStatus: VentureScaleStrongBranchSupportStatus;
  scaleScore: number;
  revenueStatus: VentureRevenueGenerationStatus;
  financeStatus: VentureFinancialModelStatus;
  killPressureRecommendation: VentureDecisionType;
  paidBackChannelCount: number;
  openSupportIssueCount: number;
  highSupportIssueCount: number;
  resolvedSupportIssueCount: number;
  humanApprovedSpendAuditCount: number;
  humanApprovedSpendCeilingCents: number;
  strongestRevenueEvidence: string;
  summary: string;
  evidence: string[];
  blockers: string[];
  stopRules: string[];
  nextAction: string;
  humanReviewRequired: true;
  markdown: string;
}

export type VentureSpawnedVentureBranchSourceType =
  | "converted-pain"
  | "retained-user"
  | "worked-channel"
  | "converted-pricing";

export type VentureSpawnedVentureDraftStatus = "draft-ready" | "needs-evidence" | "blocked";

export interface VentureSpawnedVentureDraft {
  id: string;
  parentVentureId: string;
  parentTitle: string;
  branchSourceType: VentureSpawnedVentureBranchSourceType;
  sourceMemoryId: string;
  sourceMemoryLabel: string;
  proposedTitle: string;
  targetBuyer: string;
  painStatement: string;
  productWedge: string;
  channel: string;
  pricingHypothesis: string;
  confidenceScore: number;
  status: VentureSpawnedVentureDraftStatus;
  summary: string;
  provenance: string;
  evidence: string[];
  risks: string[];
  kickoffActions: string[];
  markdown: string;
}

export type VentureLearningReinvestmentSourceType =
  | "weak-branch-kill"
  | "spawned-venture-draft"
  | "related-idea-merge"
  | "scale-strong-branch";

export type VentureLearningReinvestmentPriority = "critical" | "high" | "medium" | "low";

export type VentureLearningReinvestmentStatus = "ready" | "needs-owner" | "blocked" | "watch";

export interface VentureLearningReinvestmentQueueItem {
  id: string;
  ventureId: string;
  relatedVentureIds: string[];
  title: string;
  sourceType: VentureLearningReinvestmentSourceType;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  priority: VentureLearningReinvestmentPriority;
  status: VentureLearningReinvestmentStatus;
  owner: string;
  learning: string;
  nextExperiment: string;
  proofRequired: string;
  changedBranchInstruction: string;
  expectedImpact: string;
  evidence: string[];
  humanReviewRequired: true;
  markdown: string;
}

export type VentureOpportunityDiscoverySourceType =
  | "market-proof-gap"
  | "evidence-source"
  | "browser-research"
  | "competitor-watch"
  | "portfolio-memory";

export type VentureOpportunityDiscoveryPriority = "critical" | "high" | "medium" | "low";

export type VentureOpportunityDiscoveryStatus = "research-ready" | "needs-source" | "watch" | "blocked";

export interface VentureOpportunityDiscoveryBacklogItem {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureOpportunityDiscoverySourceType;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  priority: VentureOpportunityDiscoveryPriority;
  status: VentureOpportunityDiscoveryStatus;
  confidenceScore: number;
  owner: string;
  targetBuyer: string;
  painStatement: string;
  opportunityWedge: string;
  discoveryRationale: string;
  sourceProvenance: string[];
  nextResearchCommand: string;
  proofRequired: string;
  improvedVentureInstruction: string;
  markdown: string;
}

export type VentureOverlookedOpportunitySourceType =
  | "opportunity-backlog"
  | "market-proof-gap"
  | "competitor-watch"
  | "fake-market-memory"
  | "converted-pain-memory"
  | "evidence-quality";

export type VentureOverlookedOpportunityStatus = "ranked-ready" | "needs-source" | "watch" | "blocked";
export type VentureOverlookedOpportunityPriority = "critical" | "high" | "medium" | "low";

export interface VentureOverlookedOpportunityAtlasItem {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureOverlookedOpportunitySourceType;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  status: VentureOverlookedOpportunityStatus;
  priority: VentureOverlookedOpportunityPriority;
  rankScore: number;
  confidenceScore: number;
  noveltyScore: number;
  owner: string;
  targetBuyer: string;
  painStatement: string;
  hiddenWedge: string;
  hiddenWedgeRationale: string;
  notRecycledProof: string;
  sourceProvenance: string[];
  cheapInternalTestCommand: string;
  humanReviewBoundary: string;
  noExternalSideEffectProof: string;
  nextAction: string;
  markdown: string;
}

export type VentureAtlasValidationCommandPackSourceType = VentureOverlookedOpportunitySourceType;
export type VentureAtlasValidationCommandPackStatus = "ready" | "needs-approval" | "needs-source" | "blocked";
export type VentureAtlasValidationCommandPackPriority = "critical" | "high" | "medium" | "low";

export interface VentureAtlasValidationCommandPack {
  id: string;
  ventureId: string;
  title: string;
  atlasItemId: string;
  atlasItemTitle: string;
  atlasSourceArtifactId: string;
  atlasSourceArtifactLabel: string;
  sourceType: VentureAtlasValidationCommandPackSourceType;
  status: VentureAtlasValidationCommandPackStatus;
  priority: VentureAtlasValidationCommandPackPriority;
  rankScore: number;
  confidenceScore: number;
  noveltyScore: number;
  owner: string;
  targetBuyer: string;
  hiddenWedge: string;
  hypothesis: string;
  cheapInternalValidationCommand: string;
  manualResultFields: string[];
  manualResultThresholds: string[];
  successCriteria: string;
  failureCriteria: string;
  pivotCriteria: string;
  demandDriftUpdateInstruction: string;
  sourceProvenance: string[];
  humanReviewBoundary: string;
  noExternalSideEffectProof: string;
  approvalGates: string[];
  nextAction: string;
  markdown: string;
}

export interface VentureAtlasValidationResultRecord {
  id: string;
  recordedAt: string;
  atlasValidationPackId: string;
  atlasItemId: string;
  atlasItemTitle: string;
  outcome: VentureAtlasValidationResultOutcome;
  qualifiedBuyerCount: number;
  painConfirmationCount: number;
  hiddenWedgeResonanceCount: number;
  paidPricingSignalCount: number;
  strongestQuote: string;
  strongestObjection: string;
  evidenceNote: string;
  learning: string;
  owner: string;
  nextAction: string;
  noExternalSideEffectProof: string;
  demandDriftScore: number;
}

export interface VentureAtlasValidationResultLedgerItem extends VentureAtlasValidationResultRecord {
  ventureId: string;
  ventureTitle: string;
  sourcePackTitle: string;
  statusSummary: string;
  demandDriftUpdate: string;
  markdown: string;
}

export type VentureProductBuildCommandSourceType =
  | "generated-app-handoff"
  | "source-scaffold"
  | "mvp-build-workspace"
  | "verifier-proof"
  | "validation-result"
  | "qa-report"
  | "roadmap-task"
  | "deployment-blocker";

export type VentureProductBuildCommandStatus = "ready" | "needs-proof" | "blocked" | "verified";
export type VentureProductBuildCommandPriority = "critical" | "high" | "medium" | "low";
export type VentureProductBuildCommandRunState = "executed" | "imported" | "promoted";

export interface VentureProductBuildCommand {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureProductBuildCommandSourceType;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  status: VentureProductBuildCommandStatus;
  priority: VentureProductBuildCommandPriority;
  owner: string;
  appName: string;
  buildCommand: string;
  artifactTarget: string;
  proofRequired: string;
  noFakeSourceBoundary: string;
  nextAction: string;
  evidence: string[];
  markdown: string;
}

export interface VentureProductBuildCommandRunRecord {
  id: string;
  recordedAt: string;
  commandId: string;
  commandTitle: string;
  sourceType: VentureProductBuildCommandSourceType;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  runState: VentureProductBuildCommandRunState;
  appName: string;
  buildCommand: string;
  artifactTarget: string;
  owner: string;
  runProof: string;
  localArtifactProof: string;
  verifierReportProof: string;
  noExternalSideEffectProof: string;
  learning: string;
  evidence: string[];
}

export interface VentureProductBuildCommandRunLedgerItem extends VentureProductBuildCommandRunRecord {
  ventureId: string;
  ventureTitle: string;
  commandStatus: VentureProductBuildCommandStatus | "missing-command";
  proofRequired: string;
  noFakeSourceBoundary: string;
  statusSummary: string;
  markdown: string;
}

export type VentureMvpReleaseWorkspaceStatus = "release-ready" | "needs-run-proof" | "needs-qa-proof" | "blocked";

export interface VentureMvpReleaseWorkspace {
  id: string;
  ventureId: string;
  title: string;
  status: VentureMvpReleaseWorkspaceStatus;
  appName: string;
  sourcePath: string;
  verifierReportProof: string;
  qaProof: string;
  chosenRunId: string;
  chosenRunState: VentureProductBuildCommandRunState | "none";
  productBuildCommandId: string;
  generatedAppProofStatus: VentureGeneratedAppVerificationProofStatus;
  qaStatus: VentureQaReleaseStatus;
  owner: string;
  setupCommand: string;
  testCommand: string;
  buildCommand: string;
  browserSmokeCommand: string;
  noDeployBoundary: string;
  noExternalSideEffectProof: string;
  nextActions: string[];
  evidence: string[];
  markdown: string;
}

export type VenturePilotCohortSignalGateStatus =
  | "ready"
  | "needs-release-workspace"
  | "needs-inbound-signal"
  | "blocked";

export type VenturePilotCohortSignalGatePriority = "critical" | "high" | "medium" | "low";

export interface VenturePilotCohortSignalGateActivationDraft {
  signupTarget: string;
  activatedTarget: string;
  retainedTarget: string;
  paidTarget: string;
  revenueTarget: string;
  supportTarget: string;
}

export interface VenturePilotCohortSignalGate {
  id: string;
  ventureId: string;
  ventureTitle: string;
  status: VenturePilotCohortSignalGateStatus;
  priority: VenturePilotCohortSignalGatePriority;
  owner: string;
  releaseWorkspaceId: string;
  releaseWorkspaceStatus: VentureMvpReleaseWorkspaceStatus | "none";
  appName: string;
  sourcePath: string;
  cohortLabel: string;
  inboundSignalSource: string;
  localCaptureCommand: string;
  activationCohortDraft: VenturePilotCohortSignalGateActivationDraft;
  demandCaptureProofDraft: string;
  qualifiedDemandMetric: string;
  noSendBoundary: string;
  noDeployBoundary: string;
  noExternalSideEffectProof: string;
  nextAction: string;
  evidence: string[];
  markdown: string;
}

export type VentureNoSendEmailGateStatus =
  | "draft-ready"
  | "needs-pilot-gate"
  | "blocked";

export type VentureNoSendEmailGatePriority = "critical" | "high" | "medium" | "low";

export type VentureNoSendEmailGateReplyProofType =
  | "customer-interview"
  | "pricing-signal"
  | "risk"
  | "activation-cohort";

export interface VentureNoSendEmailGateReplyProofReceipt {
  id: string;
  proofType: VentureNoSendEmailGateReplyProofType;
  sourceRecordId: string;
  sourceLabel: string;
  recordedAt: string;
  owner: string;
  redactedReplyNote: string;
  summary: string;
  proofMetric: string;
  dedupeKey: string;
  duplicateHint: string;
  noSendProof: string;
}

export interface VentureNoSendEmailGateWorkItem {
  id: string;
  ventureId: string;
  ventureTitle: string;
  status: VentureNoSendEmailGateStatus;
  priority: VentureNoSendEmailGatePriority;
  owner: string;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  cohortLabel: string;
  recipientPlaceholders: string[];
  draftSubject: string;
  draftBody: string;
  reviewChecklist: string[];
  replayCommand: string;
  humanApprovalBoundary: string;
  noSendBoundary: string;
  noDeployBoundary: string;
  noExternalSideEffectProof: string;
  nextAction: string;
  evidence: string[];
  replyProofReceipts: VentureNoSendEmailGateReplyProofReceipt[];
  replyProofReceiptCount: number;
  replyProofTypesRecorded: VentureNoSendEmailGateReplyProofType[];
  replyProofDedupeHint: string;
  markdown: string;
}

export interface VentureNoSendEmailGateReplyProofInput {
  workItemId: string;
  proofType: VentureNoSendEmailGateReplyProofType;
  owner: string;
  redactedReplyNote: string;
  consentEvidence?: string;
  persona?: string;
  sentiment?: VentureInterviewSentiment;
  willingnessToPay?: string;
  objections?: string;
  requestedFeatures?: string;
  qualifiedBuyerCount?: number;
  paidCommitmentCount?: number;
  invoiceRequestCount?: number;
  acceptedPrice?: string;
  objectionSummary?: string;
  riskTitle?: string;
  riskDetail?: string;
  riskSeverity?: VentureRiskSeverity;
  riskStatus?: VentureRiskStatus;
  riskMitigation?: string;
  riskResolutionEvidence?: string;
  cohortLabel?: string;
  acquisitionChannel?: string;
  activationEvent?: string;
  retentionWindow?: string;
  signupCount?: number;
  activatedCount?: number;
  retainedCount?: number;
  paidCount?: number;
  revenueCents?: number;
  supportIssueCount?: number;
  learning?: string;
  nextAction?: string;
}

export type VentureLaunchControlSourceType =
  | "experiment-launch-pack"
  | "gap-action"
  | "browser-research"
  | "outreach-approval"
  | "autonomy-audit"
  | "agent-replay";

export type VentureLaunchControlStatus = "ready" | "needs-approval" | "blocked" | "recorded";
export type VentureLaunchControlPriority = "critical" | "high" | "medium" | "low";

export interface VentureLaunchControlQueueItem {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureLaunchControlSourceType;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  status: VentureLaunchControlStatus;
  priority: VentureLaunchControlPriority;
  owner: string;
  launchCommand: string;
  humanApprovalBoundary: string;
  successMetric: string;
  failureMetric: string;
  noExternalActionProof: string;
  replayCommand: string;
  evidence: string[];
  nextAction: string;
  markdown: string;
}

export type VentureDemandCaptureProofSourceType =
  | "demand-drift-report"
  | "activation-cohort"
  | "channel-economics"
  | "pricing-signal"
  | "money-signal"
  | "customer-interview"
  | "outreach-approval"
  | "browser-research"
  | "no-send-reply-proof";

export type VentureDemandCaptureProofStatus = "captured" | "needs-follow-up" | "blocked" | "weak";
export type VentureDemandCaptureProofPriority = "critical" | "high" | "medium" | "low";

export interface VentureDemandCaptureProofQueueItem {
  id: string;
  ventureId: string;
  title: string;
  sourceType: VentureDemandCaptureProofSourceType;
  sourceArtifactId: string;
  sourceArtifactLabel: string;
  status: VentureDemandCaptureProofStatus;
  priority: VentureDemandCaptureProofPriority;
  owner: string;
  captureCommand: string;
  qualifiedDemandMetric: string;
  sourceProof: string;
  noFakeDemandBoundary: string;
  followUpAction: string;
  evidence: string[];
  markdown: string;
}

export type VenturePortfolioDecisionCommandStatus = "ready" | "needs-proof" | "blocked" | "human-review";
export type VenturePortfolioDecisionCommandPriority = "critical" | "high" | "medium" | "low";

export interface VenturePortfolioDecisionCommand {
  id: string;
  ventureId: string;
  title: string;
  recommendedDecision: VentureDecisionType;
  status: VenturePortfolioDecisionCommandStatus;
  priority: VenturePortfolioDecisionCommandPriority;
  confidenceScore: number;
  owner: string;
  decisionCommand: string;
  confidenceNote: string;
  contradictionProof: string;
  nextCommand: string;
  humanReviewBoundary: string;
  demandCaptureSummary: string;
  demandSourceProvenanceSummary: string;
  demandSourceDecisionNote: string;
  demandSourceBlockerSummary: string;
  noSendReplyDemandSummary: string;
  noSendReplyDecisionNote: string;
  revenueSummary: string;
  launchSummary: string;
  productProofSummary: string;
  supportSummary: string;
  scaleSummary: string;
  killPressureSummary: string;
  demandSourceEvidence: string[];
  demandSourceBlockerEvidence: string[];
  noSendReplyDemandEvidence: string[];
  evidence: string[];
  blockers: string[];
  markdown: string;
}

export interface VentureDemandSourceBlockerDrilldownDecisionCount {
  decision: VentureDecisionType;
  count: number;
}

export interface VentureDemandSourceBlockerDrilldownItem {
  id: string;
  sourceType: VentureDemandCaptureProofSourceType;
  count: number;
  blockedCount: number;
  weakPressureCount: number;
  ventureCount: number;
  commandCount: number;
  ventureIds: string[];
  ventureTitles: string[];
  commandIds: string[];
  decisionCounts: VentureDemandSourceBlockerDrilldownDecisionCount[];
  summary: string;
  searchQuery: string;
  evidence: string[];
  markdown: string;
}

export type DemandSourceBlockerPacketTriageStatus =
  | "acknowledged"
  | "needs-evidence"
  | "delegated";

export type DemandSourceBlockerPacketTriageInboxFilter = "all" | "needs-evidence" | "delegated";

export type DemandSourceBlockerPacketTriageAuditStatus =
  | "untriaged"
  | DemandSourceBlockerPacketTriageStatus;

export type DemandSourceBlockerSavedView = {
  id: string;
  name: string;
  createdAt: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
  sourceType: VentureDemandCaptureProofSourceType;
  searchQuery: string;
};

export type DemandSourceBlockerSavedViewPacket = {
  id: string;
  savedViewId: string;
  name: string;
  generatedAt: string;
  sourceType: VentureDemandCaptureProofSourceType;
  searchQuery: string;
  currentMatchCount: number;
  matchingVentureIds: string[];
  matchingVentureTitles: string[];
  commandIds: string[];
  commandCount: number;
  decisionCounts: VentureDemandSourceBlockerDrilldownItem["decisionCounts"];
  evidence: string[];
  summary: string;
  markdown: string;
  triageStatus?: DemandSourceBlockerPacketTriageStatus;
  triageUpdatedAt?: string;
  triageSource?: "local" | "imported";
};

export type DemandSourceBlockerPacketTriageState = {
  id: string;
  savedViewId: string;
  savedViewName: string;
  packetId?: string;
  sourceType: VentureDemandCaptureProofSourceType;
  searchQuery: string;
  status: DemandSourceBlockerPacketTriageStatus;
  updatedAt: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketTriageAuditEntry = {
  id: string;
  packetId?: string;
  savedViewId: string;
  savedViewName: string;
  sourceType: VentureDemandCaptureProofSourceType;
  searchQuery: string;
  previousStatus: DemandSourceBlockerPacketTriageAuditStatus;
  nextStatus: DemandSourceBlockerPacketTriageStatus;
  recordedAt: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketTriageOwnerQueueItem = {
  id: string;
  groupKey: string;
  groupLabel: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  triageStatus: Extract<DemandSourceBlockerPacketTriageStatus, "needs-evidence" | "delegated">;
  savedViewId: string;
  savedViewName: string;
  packetId: string;
  searchQuery: string;
  currentMatchCount: number;
  commandCount: number;
  evidenceCount: number;
  matchingVentureTitles: string[];
  latestAuditTransition: {
    previousStatus: DemandSourceBlockerPacketTriageAuditStatus;
    nextStatus: DemandSourceBlockerPacketTriageStatus;
    recordedAt: string;
  } | null;
  latestAuditSummary: string;
  summary: string;
};

export type DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem = {
  id: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  searchAnchor: string;
  queueItemIds: string[];
  savedViewNames: string[];
  activeCount: number;
  delegatedCount: number;
  needsEvidenceCount: number;
  staleCount: number;
  missingEvidenceCount: number;
  latestTransitionAt: string | null;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketTriageWorkloadDriftStatus =
  | "matching"
  | "count-mismatch"
  | "stale"
  | "missing-current"
  | "new-current";

export type DemandSourceBlockerPacketTriageWorkloadDriftReport = {
  id: string;
  recordedAt: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  status: DemandSourceBlockerPacketTriageWorkloadDriftStatus;
  searchAnchor: string;
  importedActiveCount: number;
  currentActiveCount: number;
  importedDelegatedCount: number;
  currentDelegatedCount: number;
  importedNeedsEvidenceCount: number;
  currentNeedsEvidenceCount: number;
  importedStaleCount: number;
  currentStaleCount: number;
  importedMissingEvidenceCount: number;
  currentMissingEvidenceCount: number;
  importedLatestTransitionAt: string | null;
  currentLatestTransitionAt: string | null;
  importedExportedAt?: string;
  importedExportedBy?: string;
  summary: string;
};

export type DemandSourceBlockerPacketTriageWorkloadDriftReconciliationAction =
  | "reviewed"
  | "pinned-current"
  | "cleared";

export type DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry = {
  id: string;
  driftReportId: string;
  importedRecordedAt: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  action: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationAction;
  reviewedBy: string;
  reviewedStatus: DemandSourceBlockerPacketTriageWorkloadDriftStatus;
  recordedAt: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketTriageWorkloadPinnedSummary = {
  id: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  groupKey: string;
  pinnedAt: string;
  pinnedBy: string;
  driftReportId: string;
  importedRecordedAt: string;
  summary: DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffHealthStatus =
  | "clear"
  | "reconciled"
  | "unresolved-drift"
  | "reconciled-churn"
  | "repeated-drift-churn";

export type DemandSourceBlockerPacketHandoffHealthItem = {
  id: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  status: DemandSourceBlockerPacketHandoffHealthStatus;
  searchAnchor: string;
  totalDriftSnapshots: number;
  repeatedDriftCount: number;
  unresolvedDriftCount: number;
  resolvedDriftCount: number;
  reviewedReconciliationCount: number;
  pinnedReconciliationCount: number;
  clearedReconciliationCount: number;
  pinnedSummaryCount: number;
  latestDriftAt: string | null;
  latestReviewAt: string | null;
  latestPinnedAt: string | null;
  staleReviewAgeHours: number | null;
  churnScore: number;
  statusBreakdown: string[];
  summary: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffRemediationTrigger =
  | "repeated-drift"
  | "unresolved-drift"
  | "stale-review";

export type DemandSourceBlockerPacketHandoffRemediationPriority =
  | "critical"
  | "high"
  | "medium";

export type DemandSourceBlockerPacketHandoffReopenEscalationSeverity =
  | "critical"
  | "high";

export type DemandSourceBlockerPacketHandoffRemediationStatus =
  | "ready"
  | "planned"
  | "proof-closed";

export type DemandSourceBlockerPacketHandoffRemediationPlanEntry = {
  id: string;
  remediationId: string;
  healthId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  trigger: DemandSourceBlockerPacketHandoffRemediationTrigger;
  plannedBy: string;
  plannedAt: string;
  proofRequired: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffRemediationClosureReceipt = {
  id: string;
  remediationId: string;
  healthId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  trigger: DemandSourceBlockerPacketHandoffRemediationTrigger;
  closedBy: string;
  closedAt: string;
  proofRequired: string;
  proofSummary: string;
  proofArtifact: string;
  linkedDriftReportIds: string[];
  totalDriftSnapshotsAtClosure?: number;
  unresolvedDriftCountAtClosure?: number;
  repeatedDriftCountAtClosure?: number;
  latestDriftAtAtClosure?: string | null;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffRemediationItem = {
  id: string;
  healthId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  trigger: DemandSourceBlockerPacketHandoffRemediationTrigger;
  priority: DemandSourceBlockerPacketHandoffRemediationPriority;
  status: DemandSourceBlockerPacketHandoffRemediationStatus;
  assignedOwner: string;
  searchAnchor: string;
  churnScore: number;
  totalDriftSnapshots?: number;
  unresolvedDriftCount: number;
  repeatedDriftCount: number;
  staleReviewAgeHours: number | null;
  latestDriftAt: string | null;
  latestReviewAt: string | null;
  plannedAt: string | null;
  plannedBy: string | null;
  planCount: number;
  closedAt?: string | null;
  closedBy?: string | null;
  closureCount?: number;
  closureProofSummary?: string | null;
  closureProofArtifact?: string | null;
  linkedDriftReportIds?: string[];
  reopenedAfterClosure?: boolean;
  reopenedReason?: string | null;
  summary: string;
  proofRequired: string;
  nextAction: string;
  evidence: string[];
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationItem = {
  id: string;
  remediationId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  trigger: DemandSourceBlockerPacketHandoffRemediationTrigger;
  severity: DemandSourceBlockerPacketHandoffReopenEscalationSeverity;
  reopenedCount: number;
  failedClosureCount: number;
  latestReopenedAt: string | null;
  latestClosedAt: string | null;
  latestProofSummary: string | null;
  latestProofArtifact: string | null;
  reopenedReason: string;
  searchAnchor: string;
  churnScore: number;
  totalDriftSnapshots: number;
  repeatedDriftCount: number;
  unresolvedDriftCount: number;
  summary: string;
  nextAction: string;
  evidence: string[];
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt = {
  id: string;
  escalationId: string;
  remediationId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  assignedOwner: string;
  assignedBy: string;
  assignedAt: string;
  dueAt: string;
  reopenedCount: number;
  failedClosureCount: number;
  summary: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt = {
  id: string;
  slaReceiptId: string;
  escalationId: string;
  remediationId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  assignedOwner: string;
  resolvedBy: string;
  resolvedAt: string;
  dueAt: string;
  wasOverdue: boolean;
  reopenedCount: number;
  failedClosureCount: number;
  proofSummary: string;
  proofArtifact: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem = {
  id: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  severity: "critical" | "high";
  breachCount: number;
  resolutionCount: number;
  latestBreachAt: string | null;
  latestDueAt: string | null;
  latestResolvedAt: string | null;
  assignedOwners: string[];
  breachedResolutionIds: string[];
  summary: string;
  nextAction: string;
  evidence: string[];
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan = {
  id: string;
  trendId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  assignedOwner: string;
  plannedBy: string;
  plannedAt: string;
  dueAt: string;
  breachCount: number;
  resolutionCount: number;
  breachedResolutionIds: string[];
  proofRequired: string;
  followUpProof: string;
  summary: string;
  nextAction: string;
  evidence: string[];
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt = {
  id: string;
  planId: string;
  trendId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  closedBy: string;
  closedAt: string;
  breachCount: number;
  breachedResolutionIds: string[];
  proofSummary: string;
  proofArtifact: string;
  proofRequired: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression = {
  id: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  status: "stale-after-closure";
  breachCountAtClosure: number;
  currentBreachCount: number;
  latestBreachAt: string | null;
  closureClosedAt: string;
  closedBy: string;
  proofSummary: string;
  proofArtifact: string;
  newBreachedResolutionIds: string[];
  summary: string;
  nextAction: string;
  evidence: string[];
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt = {
  id: string;
  regressionId: string;
  planId: string;
  closureId: string;
  trendId: string;
  owner: string;
  sourceType: VentureDemandCaptureProofSourceType;
  closedBy: string;
  closedAt: string;
  breachCountAtClosure: number;
  currentBreachCount: number;
  latestBreachAt: string | null;
  newBreachedResolutionIds: string[];
  proofSummary: string;
  proofArtifact: string;
  nextAction: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
};

export interface VentureGapActionTask {
  id: string;
  ventureId: string;
  type: VentureGapActionType;
  priority: VentureGapActionPriority;
  title: string;
  reason: string;
  prompt: string;
}

export interface VentureGapActionRecord {
  id: string;
  taskId: string;
  type: VentureGapActionType;
  priority: VentureGapActionPriority;
  title: string;
  reason: string;
  prompt: string;
  status: VentureGapActionStatus;
  requestedAt: string;
  launchedAt?: string;
  completedAt?: string;
  outcome?: string;
}

export interface VenturePredictionSnapshot {
  id: string;
  experimentId: string;
  type: string;
  predictedAt: string;
  predictedOutcome: VenturePredictionOutcome;
  buyerUrgency: number;
  budgetLikelihood: number;
  adoptionFriction: number;
  trustBarrier: number;
  competitivePull: number;
  messageMarketFit: number;
  channelReach: number;
  conversionProbability: number;
  retentionProbability: number;
  expansionPotential: number;
  successThreshold: string;
  failureThreshold: string;
  rationale: string;
}

export interface VenturePricingSignalRecord {
  id: string;
  experimentId: string;
  recordedAt: string;
  pricingHypothesis: string;
  qualifiedBuyerCount: number;
  paidCommitmentCount: number;
  invoiceRequestCount: number;
  acceptedPrice: string;
  objectionSummary: string;
  evidenceNote: string;
}

export interface VentureCustomerInterviewRecord {
  id: string;
  interviewedAt: string;
  persona: string;
  channel: string;
  painQuote: string;
  willingnessToPay: string;
  objections: string;
  requestedFeatures: string;
  sentiment: VentureInterviewSentiment;
  evidenceNote: string;
}

export interface VentureOutreachApprovalRecord {
  id: string;
  createdAt: string;
  sourceInterviewId?: string;
  approvalLevel: "Human-approved outreach";
  status: VentureOutreachApprovalStatus;
  contactPersona: string;
  channel: string;
  messageDraft: string;
  riskNote: string;
  nextAction: string;
  attribution: string;
  externalSendStatus: "not-sent";
}

export interface VentureRiskRecord {
  id: string;
  createdAt: string;
  sourceType: VentureRiskSourceType;
  sourceRecordId?: string;
  title: string;
  detail: string;
  severity: VentureRiskSeverity;
  status: VentureRiskStatus;
  owner: string;
  mitigation: string;
  resolutionEvidence: string;
}

export interface VentureRiskCandidate {
  id: string;
  sourceType: VentureRiskSourceType;
  sourceRecordId: string;
  title: string;
  detail: string;
  suggestedSeverity: VentureRiskSeverity;
  suggestedOwner: string;
  suggestedMitigation: string;
}

export interface VentureMvpBuildWorkspaceRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: VentureMvpBuildStatus;
  owner: string;
  sourceCodeStatus: string;
  repoPath: string;
  setupInstructions: string;
  setupCommand: string;
  typecheckCommand: string;
  testCommand: string;
  buildCommand: string;
  browserSmokeCommand: string;
  deploymentCommand: string;
  deploymentPath: string;
  analyticsPlan: string;
  securityNotes: string;
  accessibilityPass: string;
  mobileBehavior: string;
  dataModel: string[];
  operatorDashboard: string;
  evidenceBacklink: string;
  setupCheck: VentureMvpCheckStatus;
  typecheckCheck: VentureMvpCheckStatus;
  unitTestCheck: VentureMvpCheckStatus;
  buildCheck: VentureMvpCheckStatus;
  browserSmokeCheck: VentureMvpCheckStatus;
  deploymentCheck: VentureMvpCheckStatus;
  verificationNotes: string;
}

export interface VentureArtifactRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  artifactType: VentureArtifactType;
  status: VentureArtifactStatus;
  title: string;
  uri: string;
  linkedMvpBuildWorkspaceId?: string;
  owner: string;
  verificationCommand: string;
  evidence: string;
  changeSummary: string;
}

export interface VentureMoneySignalRecord {
  id: string;
  recordedAt: string;
  type: VentureMoneySignalType;
  status: VentureMoneySignalStatus;
  amountCents: number;
  currency: string;
  source: string;
  owner: string;
  evidence: string;
  notes: string;
  linkedExperimentId?: string;
  externalBillingStatus: "not-charged";
  approvalLevel?: VentureAutonomyApprovalLevel;
  approvalState?: VentureMoneyApprovalState;
  externalActionState?: VentureMoneyExternalActionState;
  approvalNextAction?: string;
}

export interface VentureRoadmapTaskRecord {
  id: string;
  createdAt: string;
  sourceType: VentureRoadmapSourceType;
  sourceRecordId?: string;
  title: string;
  detail: string;
  priority: VentureRoadmapTaskPriority;
  status: VentureRoadmapTaskStatus;
  owner: string;
  supportLoad: string;
  riskReduction: string;
  nextAction: string;
}

export interface VentureRoadmapTaskCandidate {
  id: string;
  sourceType: VentureRoadmapSourceType;
  sourceRecordId: string;
  title: string;
  detail: string;
  suggestedPriority: VentureRoadmapTaskPriority;
  suggestedOwner: string;
  supportLoad: string;
  riskReduction: string;
  nextAction: string;
}

export interface VentureSupportIssueRecord {
  id: string;
  createdAt: string;
  issueType: VentureSupportIssueType;
  severity: VentureSupportIssueSeverity;
  status: VentureSupportIssueStatus;
  sourceType: VentureSupportIssueSourceType;
  sourceRecordId?: string;
  title: string;
  detail: string;
  customerImpact: string;
  supportLoad: string;
  retentionRisk: string;
  owner: string;
  resolution: string;
  nextAction: string;
}

export interface VentureSupportIssueCandidate {
  id: string;
  sourceType: VentureSupportIssueSourceType;
  sourceRecordId: string;
  issueType: VentureSupportIssueType;
  title: string;
  detail: string;
  suggestedSeverity: VentureSupportIssueSeverity;
  suggestedStatus: VentureSupportIssueStatus;
  suggestedOwner: string;
  customerImpact: string;
  supportLoad: string;
  retentionRisk: string;
  nextAction: string;
}

export interface VentureActivationCohortRecord {
  id: string;
  recordedAt: string;
  sourceType: VentureActivationCohortSourceType;
  sourceRecordId?: string;
  cohortLabel: string;
  acquisitionChannel: string;
  activationEvent: string;
  retentionWindow: string;
  signupCount: number;
  activatedCount: number;
  retainedCount: number;
  paidCount: number;
  revenueCents: number;
  supportIssueCount: number;
  owner: string;
  evidence: string;
  learning: string;
  nextAction: string;
}

export interface VentureActivationCohortCandidate {
  id: string;
  sourceType: VentureActivationCohortSourceType;
  sourceRecordId: string;
  cohortLabel: string;
  suggestedOwner: string;
  acquisitionChannel: string;
  activationEvent: string;
  retentionWindow: string;
  signupCount: number;
  activatedCount: number;
  retainedCount: number;
  paidCount: number;
  revenueCents: number;
  supportIssueCount: number;
  evidence: string;
  learning: string;
  nextAction: string;
}

export interface VentureChannelEconomicsRecord {
  id: string;
  recordedAt: string;
  sourceType: VentureChannelEconomicsSourceType;
  sourceRecordId?: string;
  channel: string;
  spendCents: number;
  impressions: number;
  clicks: number;
  signupCount: number;
  activatedCount: number;
  paidCount: number;
  revenueCents: number;
  costPerSignupCents: number;
  cacCents: number;
  paybackStatus: VenturePaybackStatus;
  owner: string;
  evidence: string;
  nextAction: string;
}

export interface VentureChannelEconomicsCandidate {
  id: string;
  sourceType: VentureChannelEconomicsSourceType;
  sourceRecordId: string;
  channel: string;
  suggestedOwner: string;
  spendCents: number;
  impressions: number;
  clicks: number;
  signupCount: number;
  activatedCount: number;
  paidCount: number;
  revenueCents: number;
  evidence: string;
  nextAction: string;
}

export interface VentureKillPressureSignal {
  id: string;
  dimension: VentureKillPressureDimension;
  severity: VentureKillPressureSeverity;
  recommendation: VentureDecisionType;
  title: string;
  reason: string;
  nextAction: string;
}

export interface VentureKillPressureReport {
  recommendation: VentureDecisionType;
  severity: VentureKillPressureSeverity;
  signals: VentureKillPressureSignal[];
  note: string;
}

export interface VentureAutonomyAuditRecord {
  id: string;
  createdAt: string;
  approvalLevel: VentureAutonomyApprovalLevel;
  status: VentureAutonomyAuditStatus;
  sideEffect: VentureAutonomySideEffect;
  actionType: string;
  actor: string;
  sourceRecordId?: string;
  riskNote: string;
  replayNote: string;
  evidence: string;
  nextAction: string;
}

export interface VentureAutonomyAuditCandidate {
  id: string;
  approvalLevel: VentureAutonomyApprovalLevel;
  status: VentureAutonomyAuditStatus;
  sideEffect: VentureAutonomySideEffect;
  actionType: string;
  suggestedActor: string;
  sourceRecordId: string;
  riskNote: string;
  replayNote: string;
  evidence: string;
  nextAction: string;
}

export interface VentureAgentRunRecord {
  id: string;
  createdAt: string;
  sourceType: VentureAgentRunSourceType;
  sourceRecordId?: string;
  status: VentureAgentRunStatus;
  model: string;
  prompt: string;
  outputSummary: string;
  inputEvidence: string;
  toolCalls: string;
  tokenEstimate: number;
  replayCommand: string;
  riskNote: string;
  owner: string;
  nextAction: string;
}

export interface VentureAgentRunCandidate {
  id: string;
  sourceType: VentureAgentRunSourceType;
  sourceRecordId: string;
  status: VentureAgentRunStatus;
  model: string;
  prompt: string;
  outputSummary: string;
  inputEvidence: string;
  toolCalls: string;
  tokenEstimate: number;
  replayCommand: string;
  riskNote: string;
  suggestedOwner: string;
  nextAction: string;
}

export interface VentureCompetitorRecord {
  id: string;
  createdAt: string;
  sourceType: VentureCompetitorSourceType;
  sourceRecordId?: string;
  competitorName: string;
  competitorType: VentureCompetitorType;
  threatLevel: VentureCompetitorThreatLevel;
  status: VentureCompetitorStatus;
  positioning: string;
  evidence: string;
  differentiation: string;
  responsePlan: string;
  owner: string;
  watchCadence: string;
  nextAction: string;
}

export interface VentureCompetitorCandidate {
  id: string;
  sourceType: VentureCompetitorSourceType;
  sourceRecordId: string;
  competitorName: string;
  competitorType: VentureCompetitorType;
  suggestedThreatLevel: VentureCompetitorThreatLevel;
  suggestedStatus: VentureCompetitorStatus;
  positioning: string;
  evidence: string;
  differentiation: string;
  responsePlan: string;
  suggestedOwner: string;
  watchCadence: string;
  nextAction: string;
}

export interface VentureBrowserResearchTaskRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  sourceType: VentureBrowserResearchSourceType;
  sourceRecordId?: string;
  platform: string;
  sourceTarget: string;
  prompt: string;
  status: VentureBrowserResearchStatus;
  owner: string;
  evidenceUrl: string;
  findings: string;
  replayNote: string;
  nextAction: string;
}

export interface VentureBrowserResearchCandidate {
  id: string;
  sourceType: VentureBrowserResearchSourceType;
  sourceRecordId: string;
  platform: string;
  sourceTarget: string;
  prompt: string;
  suggestedStatus: VentureBrowserResearchStatus;
  suggestedOwner: string;
  evidenceUrl: string;
  findings: string;
  replayNote: string;
  nextAction: string;
}

export interface VenturePortfolioOperatingSummary {
  ventureCount: number;
  evidenceSourceCount: number;
  plannedExperimentCount: number;
  experimentLaunchPackCount: number;
  launchPackReadyCount: number;
  launchPackNeedsApprovalCount: number;
  launchPackRecordedCount: number;
  launchPackBlockedCount: number;
  qaReleaseReportCount: number;
  qaReadyCount: number;
  qaNeedsFixesCount: number;
  qaBlockedCount: number;
  deploymentReadinessPacketCount: number;
  deploymentProposalReadyCount: number;
  deploymentNeedsProofCount: number;
  deploymentBlockedPacketCount: number;
  deploymentOwnedRoadmapBlockerCount: number;
  deploymentOwnedSupportBlockerCount: number;
  investorBriefCount: number;
  investableBriefCount: number;
  watchBriefCount: number;
  notReadyBriefCount: number;
  financialModelCount: number;
  financialScaleReadyCount: number;
  financialNeedsProofCount: number;
  financialRunwayRiskCount: number;
  financialBlockedCount: number;
  averageFinanceScore: number;
  humanGateCount: number;
  averageReadinessScore: number;
  marketModelAverageConfidenceScore: number;
  marketModelHighConfidenceCount: number;
  marketModelMediumConfidenceCount: number;
  marketModelLowConfidenceCount: number;
  marketModelMissingProofCount: number;
  dominantMarketProofGap: string;
  riskiestMarketTitle: string;
  riskiestMarketConfidenceScore: number;
  founderExecutionMemoCount: number;
  founderExecutionMemoReadyCount: number;
  founderExecutionMemoPressureTestCount: number;
  founderExecutionMemoBlockedCount: number;
  decisionReadyCount: number;
  needsPressureTestCount: number;
  tooThinCount: number;
  openGapTaskCount: number;
  completedGapOutcomeCount: number;
  launchedGapTaskCount: number;
  killPressureCount: number;
  scalePressureCount: number;
  measuredExperimentCount: number;
  demandPassCount: number;
  demandFailCount: number;
  demandInconclusiveCount: number;
  demandDriftMeasuredCount: number;
  demandDriftConfirmedCount: number;
  demandOverestimatedCount: number;
  demandUnderestimatedCount: number;
  demandDriftMixedCount: number;
  predictionSnapshotCount: number;
  confirmedPredictionCount: number;
  surprisedPredictionCount: number;
  pricingSignalCount: number;
  paidPricingSignalCount: number;
  pricingValidatedCount: number;
  pricingRejectedCount: number;
  customerInterviewCount: number;
  positiveInterviewCount: number;
  negativeInterviewCount: number;
  featureRequestCount: number;
  outreachApprovalCount: number;
  humanApprovedOutreachCount: number;
  manualOutreachPlannedCount: number;
  notSentOutreachCount: number;
  outreachCampaignCount: number;
  outreachCampaignReadyCount: number;
  outreachCampaignNeedsApprovalCount: number;
  outreachCampaignBlockedCount: number;
  outreachCampaignRecordedCount: number;
  riskRecordCount: number;
  openRiskCount: number;
  highRiskCount: number;
  resolvedRiskCount: number;
  customerInboxRiskCount: number;
  untriagedRiskCandidateCount: number;
  mvpBuildWorkspaceCount: number;
  mvpRepoAttachedCount: number;
  mvpExecutableCount: number;
  mvpBlockedCount: number;
  mvpVerificationPassedCount: number;
  generatedAppHandoffCount: number;
  generatedAppSourcePendingCount: number;
  generatedAppBriefReadyCount: number;
  generatedAppRepoAttachedCount: number;
  generatedAppExecutableCount: number;
  generatedAppSourceScaffoldCount: number;
  generatedAppSourceFileCount: number;
  generatedAppReadyToMaterializeCount: number;
  generatedAppNoFakeSourceGuardCount: number;
  generatedAppVerificationProofCount: number;
  generatedAppVerifiedProofCount: number;
  generatedAppPartialProofCount: number;
  generatedAppMissingProofCount: number;
  artifactRecordCount: number;
  verifiedArtifactCount: number;
  blockedArtifactCount: number;
  deploymentProofCount: number;
  changelogEntryCount: number;
  moneySignalCount: number;
  revenueCents: number;
  expenseCents: number;
  netRevenueCents: number;
  committedRevenueCents: number;
  runwayRiskCount: number;
  roadmapTaskCount: number;
  openRoadmapTaskCount: number;
  highRoadmapTaskCount: number;
  supportLoadTaskCount: number;
  untriagedRoadmapCandidateCount: number;
  supportIssueCount: number;
  supportQuestionCount: number;
  pilotIssueCount: number;
  openSupportIssueCount: number;
  criticalSupportIssueCount: number;
  resolvedSupportIssueCount: number;
  retentionRiskIssueCount: number;
  untriagedSupportIssueCandidateCount: number;
  activationCohortCount: number;
  cohortSignupCount: number;
  activatedUserCount: number;
  retainedUserCount: number;
  paidCohortUserCount: number;
  cohortRevenueCents: number;
  cohortSupportIssueCount: number;
  averageActivationRate: number;
  averageRetentionRate: number;
  untriagedActivationCohortCandidateCount: number;
  channelEconomicsCount: number;
  acquisitionSpendCents: number;
  channelSignupCount: number;
  channelActivatedCount: number;
  channelPaidUserCount: number;
  channelRevenueCents: number;
  blendedCacCents: number;
  paidBackChannelCount: number;
  untriagedChannelEconomicsCandidateCount: number;
  killRuleSignalCount: number;
  killRuleKillRecommendationCount: number;
  killRulePauseRecommendationCount: number;
  killRulePivotRecommendationCount: number;
  killRuleScaleRecommendationCount: number;
  killDecisionArtifactCount: number;
  killDecisionStopCount: number;
  killDecisionContinueCount: number;
  killDecisionScaleCount: number;
  weakBranchKillMemoryCount: number;
  weakBranchKillRecommendedCount: number;
  weakBranchPauseRecommendedCount: number;
  weakBranchArchivedCount: number;
  weakBranchRevivalWatchCount: number;
  revenueGenerationPostureCount: number;
  revenueGenerationPaidValidationCount: number;
  revenueGenerationRepeatableCount: number;
  revenueGenerationScalingCount: number;
  revenueGenerationBlockedCount: number;
  revenueGenerationNoEvidenceCount: number;
  revenueGenerationEvidenceCents: number;
  averageRevenueGenerationCaptureScore: number;
  scaleStrongBranchPlanCount: number;
  scaleStrongBranchReadyCount: number;
  scaleStrongBranchApprovalRequiredCount: number;
  scaleStrongBranchNeedsProofCount: number;
  scaleStrongBranchBlockedCount: number;
  scaleStrongBranchSpendCeilingCents: number;
  spawnedVentureDraftCount: number;
  spawnedVentureDraftReadyCount: number;
  spawnedVentureDraftNeedsEvidenceCount: number;
  spawnedVentureDraftBlockedCount: number;
  spawnedVentureDraftConvertedPainCount: number;
  spawnedVentureDraftRetainedUserCount: number;
  spawnedVentureDraftWorkedChannelCount: number;
  spawnedVentureDraftConvertedPricingCount: number;
  relatedIdeaMergeAuditCount: number;
  relatedIdeaMergeReuseCount: number;
  relatedIdeaMergeMergeCount: number;
  relatedIdeaMergeForkCount: number;
  relatedIdeaMergeKeepSeparateCount: number;
  learningReinvestmentQueueCount: number;
  learningReinvestmentReadyCount: number;
  learningReinvestmentNeedsOwnerCount: number;
  learningReinvestmentBlockedCount: number;
  learningReinvestmentWatchCount: number;
  learningReinvestmentCriticalCount: number;
  learningReinvestmentHighCount: number;
  opportunityDiscoveryBacklogCount: number;
  opportunityDiscoveryReadyCount: number;
  opportunityDiscoveryNeedsSourceCount: number;
  opportunityDiscoveryWatchCount: number;
  opportunityDiscoveryBlockedCount: number;
  opportunityDiscoveryHighPriorityCount: number;
  overlookedOpportunityAtlasCount: number;
  overlookedOpportunityRankedCount: number;
  overlookedOpportunityNeedsSourceCount: number;
  overlookedOpportunityWatchCount: number;
  overlookedOpportunityBlockedCount: number;
  overlookedOpportunityCriticalCount: number;
  overlookedOpportunityHighPriorityCount: number;
  averageOverlookedOpportunityRankScore: number;
  averageOverlookedOpportunityNoveltyScore: number;
  atlasValidationCommandPackCount: number;
  atlasValidationCommandPackReadyCount: number;
  atlasValidationCommandPackNeedsApprovalCount: number;
  atlasValidationCommandPackNeedsSourceCount: number;
  atlasValidationCommandPackBlockedCount: number;
  atlasValidationCommandPackCriticalCount: number;
  atlasValidationCommandPackHighPriorityCount: number;
  atlasValidationResultCount: number;
  atlasValidationResultPassedCount: number;
  atlasValidationResultFailedCount: number;
  atlasValidationResultPivotCount: number;
  atlasValidationResultInconclusiveCount: number;
  atlasValidationResultQualifiedBuyerCount: number;
  atlasValidationResultPaidPricingSignalCount: number;
  productBuildCommandCount: number;
  productBuildReadyCount: number;
  productBuildNeedsProofCount: number;
  productBuildBlockedCount: number;
  productBuildVerifiedCount: number;
  productBuildCriticalCount: number;
  productBuildRunCount: number;
  productBuildRunExecutedCount: number;
  productBuildRunImportedCount: number;
  productBuildRunPromotedCount: number;
  mvpReleaseWorkspaceCount: number;
  mvpReleaseReadyCount: number;
  mvpReleaseNeedsRunProofCount: number;
  mvpReleaseNeedsQaProofCount: number;
  mvpReleaseBlockedCount: number;
  pilotCohortSignalGateCount: number;
  pilotCohortSignalGateReadyCount: number;
  pilotCohortSignalGateNeedsReleaseWorkspaceCount: number;
  pilotCohortSignalGateNeedsInboundSignalCount: number;
  pilotCohortSignalGateBlockedCount: number;
  pilotCohortSignalGateCriticalCount: number;
  pilotCohortSignalGateHighCount: number;
  noSendEmailGateWorklistCount: number;
  noSendEmailGateDraftReadyCount: number;
  noSendEmailGateNeedsPilotGateCount: number;
  noSendEmailGateBlockedCount: number;
  noSendEmailGateCriticalCount: number;
  launchControlQueueCount: number;
  launchControlReadyCount: number;
  launchControlNeedsApprovalCount: number;
  launchControlBlockedCount: number;
  launchControlRecordedCount: number;
  launchControlCriticalCount: number;
  demandCaptureProofQueueCount: number;
  demandCaptureCapturedCount: number;
  demandCaptureNeedsFollowUpCount: number;
  demandCaptureBlockedCount: number;
  demandCaptureWeakCount: number;
  demandCaptureCriticalCount: number;
  portfolioDecisionCommandCount: number;
  portfolioDecisionReadyCount: number;
  portfolioDecisionNeedsProofCount: number;
  portfolioDecisionBlockedCount: number;
  portfolioDecisionHumanReviewCount: number;
  portfolioDecisionContinueCount: number;
  portfolioDecisionPivotCount: number;
  portfolioDecisionPauseCount: number;
  portfolioDecisionKillCount: number;
  portfolioDecisionScaleCount: number;
  portfolioDecisionDemandSourceBlockerCount: number;
  portfolioDecisionDemandSourceBlockedCount: number;
  portfolioDecisionDemandSourceWeakPressureCount: number;
  portfolioDecisionDemandSourceBlockerTypeCount: number;
  portfolioDecisionDemandSourceBlockerBreakdown: string;
  portfolioDecisionPivotDemandSourceBlockerCount: number;
  portfolioDecisionPauseDemandSourceBlockerCount: number;
  portfolioDecisionKillDemandSourceBlockerCount: number;
  autonomyAuditCount: number;
  externalApprovedActionCount: number;
  externalBlockedActionCount: number;
  replayableActionCount: number;
  untriagedAutonomyAuditCandidateCount: number;
  deploymentStaleEscalationCandidateCount: number;
  agentRunCount: number;
  modelCallLogCount: number;
  replayableAgentRunCount: number;
  blockedAgentRunCount: number;
  untriagedAgentRunCandidateCount: number;
  competitorRecordCount: number;
  highThreatCompetitorCount: number;
  substituteCompetitorCount: number;
  untriagedCompetitorCandidateCount: number;
  browserResearchTaskCount: number;
  queuedBrowserResearchTaskCount: number;
  capturedBrowserResearchTaskCount: number;
  blockedBrowserResearchTaskCount: number;
  untriagedBrowserResearchCandidateCount: number;
}

export interface VentureExperimentCalibration {
  experimentId: string;
  type: string;
  status: Exclude<VentureDemandCalibrationStatus, "not-measured">;
  result: string;
  interpretation: string;
  successThreshold: string;
  failureThreshold: string;
  recordedAt?: string;
  prediction?: VenturePredictionSnapshot;
  predictionAlignment: VenturePredictionAlignment;
  note: string;
}

export interface VentureDemandCalibration {
  status: VentureDemandCalibrationStatus;
  measuredExperimentCount: number;
  passCount: number;
  failCount: number;
  inconclusiveCount: number;
  experiments: VentureExperimentCalibration[];
}

export type VentureDemandDriftStatus = "unmeasured" | "confirmed" | "overestimated" | "underestimated" | "mixed";

export interface VentureDemandDriftComponent {
  source: "experiment" | "pricing" | "activation" | "channel" | "kill-pressure" | "evaluation-lens" | "atlas-validation";
  label: string;
  score: number;
  evidence: string;
}

export interface VentureDemandDriftReport {
  id: string;
  ventureId: string;
  title: string;
  status: VentureDemandDriftStatus;
  baselineDemandScore: number;
  actualDemandScore: number;
  drift: number;
  evidenceComponentCount: number;
  components: VentureDemandDriftComponent[];
  reason: string;
  nextAction: string;
}

export interface VenturePricingCalibration {
  status: VenturePricingCalibrationStatus;
  signalCount: number;
  qualifiedBuyerCount: number;
  paidCommitmentCount: number;
  invoiceRequestCount: number;
  paidSignalCount: number;
  willingnessToPayScore: number;
  strongestAcceptedPrice: string;
  latestSignal?: VenturePricingSignalRecord;
  note: string;
}

export interface SavedVentureWorkspace extends VentureOperatingWorkspace {
  savedAt: string;
  updatedAt: string;
  lifecycleStatus: VentureLifecycleStatus;
  reviewCadence: string;
  decisionHistory: VentureDecisionRecord[];
  gapActionHistory: VentureGapActionRecord[];
  predictionSnapshots: VenturePredictionSnapshot[];
  pricingSignals: VenturePricingSignalRecord[];
  customerInterviews: VentureCustomerInterviewRecord[];
  outreachApprovals: VentureOutreachApprovalRecord[];
  riskRecords: VentureRiskRecord[];
  mvpBuildWorkspaces: VentureMvpBuildWorkspaceRecord[];
  artifactRecords: VentureArtifactRecord[];
  moneySignals: VentureMoneySignalRecord[];
  roadmapTasks: VentureRoadmapTaskRecord[];
  supportIssues: VentureSupportIssueRecord[];
  activationCohorts: VentureActivationCohortRecord[];
  channelEconomics: VentureChannelEconomicsRecord[];
  autonomyAudit: VentureAutonomyAuditRecord[];
  agentRuns: VentureAgentRunRecord[];
  competitors: VentureCompetitorRecord[];
  browserResearchTasks: VentureBrowserResearchTaskRecord[];
  atlasValidationResults: VentureAtlasValidationResultRecord[];
  productBuildCommandRuns: VentureProductBuildCommandRunRecord[];
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_PREFIX = "marketpulse-venture-portfolio";
const EXPORT_VERSION = 1;
const VENTURE_LIFECYCLE_VALUES = new Set(VENTURE_LIFECYCLE_OPTIONS.map((option) => option.value));
const VENTURE_DECISION_VALUES = new Set(VENTURE_DECISION_OPTIONS.map((option) => option.value));
const VENTURE_INTERVIEW_SENTIMENT_VALUES = new Set<VentureInterviewSentiment>(["positive", "mixed", "negative"]);
const VENTURE_OUTREACH_STATUS_VALUES = new Set<VentureOutreachApprovalStatus>(
  VENTURE_OUTREACH_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_RISK_SEVERITY_VALUES = new Set<VentureRiskSeverity>(
  VENTURE_RISK_SEVERITY_OPTIONS.map((option) => option.value),
);
const VENTURE_RISK_STATUS_VALUES = new Set<VentureRiskStatus>(
  VENTURE_RISK_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_MVP_BUILD_STATUS_VALUES = new Set<VentureMvpBuildStatus>(
  VENTURE_MVP_BUILD_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_MVP_CHECK_STATUS_VALUES = new Set<VentureMvpCheckStatus>(
  VENTURE_MVP_CHECK_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_ARTIFACT_TYPE_VALUES = new Set<VentureArtifactType>(
  VENTURE_ARTIFACT_TYPE_OPTIONS.map((option) => option.value),
);
const VENTURE_ARTIFACT_STATUS_VALUES = new Set<VentureArtifactStatus>(
  VENTURE_ARTIFACT_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_MONEY_SIGNAL_TYPE_VALUES = new Set<VentureMoneySignalType>(
  VENTURE_MONEY_SIGNAL_TYPE_OPTIONS.map((option) => option.value),
);
const VENTURE_MONEY_SIGNAL_STATUS_VALUES = new Set<VentureMoneySignalStatus>(
  VENTURE_MONEY_SIGNAL_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_ROADMAP_PRIORITY_VALUES = new Set<VentureRoadmapTaskPriority>(
  VENTURE_ROADMAP_PRIORITY_OPTIONS.map((option) => option.value),
);
const VENTURE_ROADMAP_STATUS_VALUES = new Set<VentureRoadmapTaskStatus>(
  VENTURE_ROADMAP_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_ROADMAP_SOURCE_VALUES = new Set<VentureRoadmapSourceType>([
  "customer-feature",
  "risk-mitigation",
  "mvp-blocker",
  "artifact-blocker",
  "deployment-promotion",
  "manual",
]);
const VENTURE_SUPPORT_ISSUE_TYPE_VALUES = new Set<VentureSupportIssueType>(
  VENTURE_SUPPORT_ISSUE_TYPE_OPTIONS.map((option) => option.value),
);
const VENTURE_SUPPORT_ISSUE_SEVERITY_VALUES = new Set<VentureSupportIssueSeverity>(
  VENTURE_SUPPORT_ISSUE_SEVERITY_OPTIONS.map((option) => option.value),
);
const VENTURE_SUPPORT_ISSUE_STATUS_VALUES = new Set<VentureSupportIssueStatus>(
  VENTURE_SUPPORT_ISSUE_STATUS_OPTIONS.map((option) => option.value),
);
const VENTURE_SUPPORT_ISSUE_SOURCE_VALUES = new Set<VentureSupportIssueSourceType>([
  "customer-interview",
  "roadmap-task",
  "mvp-workspace",
  "deployment-promotion",
  "manual",
]);
const VENTURE_ACTIVATION_COHORT_SOURCE_VALUES = new Set<VentureActivationCohortSourceType>([
  "experiment-result",
  "money-signal",
  "support-issue",
  "pilot-signal-gate",
  "manual",
]);
const VENTURE_CHANNEL_ECONOMICS_SOURCE_VALUES = new Set<VentureChannelEconomicsSourceType>([
  "activation-cohort",
  "money-signal",
  "manual",
]);
const VENTURE_PAYBACK_STATUS_VALUES = new Set<VenturePaybackStatus>([
  "unknown",
  "no-payback",
  "partial-payback",
  "paid-back",
]);
const VENTURE_ATLAS_VALIDATION_RESULT_VALUES = new Set<VentureAtlasValidationResultOutcome>([
  "passed",
  "failed",
  "pivot",
  "inconclusive",
]);
const VENTURE_PRODUCT_BUILD_COMMAND_SOURCE_VALUES = new Set<VentureProductBuildCommandSourceType>([
  "generated-app-handoff",
  "source-scaffold",
  "mvp-build-workspace",
  "verifier-proof",
  "validation-result",
  "qa-report",
  "roadmap-task",
  "deployment-blocker",
]);
const VENTURE_PRODUCT_BUILD_COMMAND_RUN_VALUES = new Set<VentureProductBuildCommandRunState>([
  "executed",
  "imported",
  "promoted",
]);
const VENTURE_AUTONOMY_APPROVAL_VALUES = new Set<VentureAutonomyApprovalLevel>([
  "read-only-research",
  "draft-artifact-generation",
  "local-code-generation",
  "local-test-execution",
  "deployment-proposal",
  "human-approved-deployment",
  "human-approved-outreach",
  "human-approved-spend",
  "human-approved-billing-change",
]);
const VENTURE_AUTONOMY_AUDIT_STATUS_VALUES = new Set<VentureAutonomyAuditStatus>([
  "proposed",
  "approved",
  "executed",
  "blocked",
  "dismissed",
]);
const VENTURE_AUTONOMY_SIDE_EFFECT_VALUES = new Set<VentureAutonomySideEffect>([
  "none",
  "local-only",
  "external-proposed",
  "external-approved",
  "external-blocked",
]);
const VENTURE_AGENT_RUN_SOURCE_VALUES = new Set<VentureAgentRunSourceType>([
  "recommendation",
  "follow-up-mission",
  "artifact-generation",
  "autonomy-audit",
  "manual",
]);
const VENTURE_AGENT_RUN_STATUS_VALUES = new Set<VentureAgentRunStatus>([
  "planned",
  "prompt-ready",
  "executed",
  "blocked",
  "replayed",
]);
const VENTURE_COMPETITOR_TYPE_VALUES = new Set<VentureCompetitorType>([
  "direct",
  "indirect",
  "substitute",
  "status-quo",
  "emerging",
]);
const VENTURE_COMPETITOR_THREAT_VALUES = new Set<VentureCompetitorThreatLevel>([
  "low",
  "medium",
  "high",
  "critical",
]);
const VENTURE_COMPETITOR_STATUS_VALUES = new Set<VentureCompetitorStatus>([
  "watching",
  "investigating",
  "validated",
  "mitigated",
  "dismissed",
]);
const VENTURE_COMPETITOR_SOURCE_VALUES = new Set<VentureCompetitorSourceType>([
  "workspace-simulation",
  "evidence-source",
  "risk-record",
  "customer-interview",
  "manual",
]);
const VENTURE_BROWSER_RESEARCH_SOURCE_VALUES = new Set<VentureBrowserResearchSourceType>([
  "gap-action",
  "readiness-notice",
  "competitor-watch",
  "manual",
]);
const VENTURE_BROWSER_RESEARCH_STATUS_VALUES = new Set<VentureBrowserResearchStatus>(
  VENTURE_BROWSER_RESEARCH_STATUS_OPTIONS.map((option) => option.value),
);

function safeOwner(ownerKey: string) {
  return ownerKey.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-") || "anonymous";
}

export function getVenturePortfolioStorageKey(ownerKey: string) {
  return `${STORAGE_PREFIX}:${safeOwner(ownerKey)}`;
}

function lifecycleFromStage(stage: VentureStage): VentureLifecycleStatus {
  if (stage === "building") return "building";
  if (stage === "validating") return "validating";
  return "researching";
}

function lifecycleFromDecision(decision: VentureDecisionType, current: VentureLifecycleStatus): VentureLifecycleStatus {
  if (decision === "pivot") return "pivoting";
  if (decision === "pause") return "paused";
  if (decision === "kill") return "killed";
  if (decision === "scale") return "scaling";
  if (decision === "archive") return "archived";
  return current;
}

function reviewCadenceForStatus(status: VentureLifecycleStatus) {
  if (status === "killed" || status === "archived") return "Archived; revisit only if new evidence changes the thesis";
  if (status === "scaling") return "Weekly scaling review with revenue, cost, and retention evidence";
  if (status === "paused") return "Monthly revisit; resume only after the blocker changes";
  if (status === "pivoting") return "Review after the pivot assumption receives fresh evidence";
  if (status === "getting-signals") return "Weekly until signal quality justifies build, pivot, or kill";
  return "Weekly until experiment result is recorded";
}

function isVentureLifecycleStatus(value: unknown): value is VentureLifecycleStatus {
  return typeof value === "string" && VENTURE_LIFECYCLE_VALUES.has(value as VentureLifecycleStatus);
}

function isVentureDecisionType(value: unknown): value is VentureDecisionType {
  return typeof value === "string" && VENTURE_DECISION_VALUES.has(value as VentureDecisionType);
}

function isVentureInterviewSentiment(value: unknown): value is VentureInterviewSentiment {
  return typeof value === "string" && VENTURE_INTERVIEW_SENTIMENT_VALUES.has(value as VentureInterviewSentiment);
}

function isVentureOutreachApprovalStatus(value: unknown): value is VentureOutreachApprovalStatus {
  return typeof value === "string" && VENTURE_OUTREACH_STATUS_VALUES.has(value as VentureOutreachApprovalStatus);
}

function isVentureRiskSeverity(value: unknown): value is VentureRiskSeverity {
  return typeof value === "string" && VENTURE_RISK_SEVERITY_VALUES.has(value as VentureRiskSeverity);
}

function isVentureRiskStatus(value: unknown): value is VentureRiskStatus {
  return typeof value === "string" && VENTURE_RISK_STATUS_VALUES.has(value as VentureRiskStatus);
}

function isVentureMvpBuildStatus(value: unknown): value is VentureMvpBuildStatus {
  return typeof value === "string" && VENTURE_MVP_BUILD_STATUS_VALUES.has(value as VentureMvpBuildStatus);
}

function isVentureMvpCheckStatus(value: unknown): value is VentureMvpCheckStatus {
  return typeof value === "string" && VENTURE_MVP_CHECK_STATUS_VALUES.has(value as VentureMvpCheckStatus);
}

function isVentureArtifactType(value: unknown): value is VentureArtifactType {
  return typeof value === "string" && VENTURE_ARTIFACT_TYPE_VALUES.has(value as VentureArtifactType);
}

function isVentureArtifactStatus(value: unknown): value is VentureArtifactStatus {
  return typeof value === "string" && VENTURE_ARTIFACT_STATUS_VALUES.has(value as VentureArtifactStatus);
}

function isVentureMoneySignalType(value: unknown): value is VentureMoneySignalType {
  return typeof value === "string" && VENTURE_MONEY_SIGNAL_TYPE_VALUES.has(value as VentureMoneySignalType);
}

function isVentureMoneySignalStatus(value: unknown): value is VentureMoneySignalStatus {
  return typeof value === "string" && VENTURE_MONEY_SIGNAL_STATUS_VALUES.has(value as VentureMoneySignalStatus);
}

function isVentureRoadmapPriority(value: unknown): value is VentureRoadmapTaskPriority {
  return typeof value === "string" && VENTURE_ROADMAP_PRIORITY_VALUES.has(value as VentureRoadmapTaskPriority);
}

function isVentureRoadmapStatus(value: unknown): value is VentureRoadmapTaskStatus {
  return typeof value === "string" && VENTURE_ROADMAP_STATUS_VALUES.has(value as VentureRoadmapTaskStatus);
}

function isVentureRoadmapSourceType(value: unknown): value is VentureRoadmapSourceType {
  return typeof value === "string" && VENTURE_ROADMAP_SOURCE_VALUES.has(value as VentureRoadmapSourceType);
}

function isVentureSupportIssueType(value: unknown): value is VentureSupportIssueType {
  return typeof value === "string" && VENTURE_SUPPORT_ISSUE_TYPE_VALUES.has(value as VentureSupportIssueType);
}

function isVentureSupportIssueSeverity(value: unknown): value is VentureSupportIssueSeverity {
  return typeof value === "string" && VENTURE_SUPPORT_ISSUE_SEVERITY_VALUES.has(value as VentureSupportIssueSeverity);
}

function isVentureSupportIssueStatus(value: unknown): value is VentureSupportIssueStatus {
  return typeof value === "string" && VENTURE_SUPPORT_ISSUE_STATUS_VALUES.has(value as VentureSupportIssueStatus);
}

function isVentureSupportIssueSourceType(value: unknown): value is VentureSupportIssueSourceType {
  return typeof value === "string" && VENTURE_SUPPORT_ISSUE_SOURCE_VALUES.has(value as VentureSupportIssueSourceType);
}

function isVentureActivationCohortSourceType(value: unknown): value is VentureActivationCohortSourceType {
  return typeof value === "string" && VENTURE_ACTIVATION_COHORT_SOURCE_VALUES.has(value as VentureActivationCohortSourceType);
}

function isVentureChannelEconomicsSourceType(value: unknown): value is VentureChannelEconomicsSourceType {
  return typeof value === "string" && VENTURE_CHANNEL_ECONOMICS_SOURCE_VALUES.has(value as VentureChannelEconomicsSourceType);
}

function isVenturePaybackStatus(value: unknown): value is VenturePaybackStatus {
  return typeof value === "string" && VENTURE_PAYBACK_STATUS_VALUES.has(value as VenturePaybackStatus);
}

function isVentureAtlasValidationResultOutcome(value: unknown): value is VentureAtlasValidationResultOutcome {
  return typeof value === "string" && VENTURE_ATLAS_VALIDATION_RESULT_VALUES.has(value as VentureAtlasValidationResultOutcome);
}

function isVentureAutonomyApprovalLevel(value: unknown): value is VentureAutonomyApprovalLevel {
  return typeof value === "string" && VENTURE_AUTONOMY_APPROVAL_VALUES.has(value as VentureAutonomyApprovalLevel);
}

function isVentureAutonomyAuditStatus(value: unknown): value is VentureAutonomyAuditStatus {
  return typeof value === "string" && VENTURE_AUTONOMY_AUDIT_STATUS_VALUES.has(value as VentureAutonomyAuditStatus);
}

function isVentureAutonomySideEffect(value: unknown): value is VentureAutonomySideEffect {
  return typeof value === "string" && VENTURE_AUTONOMY_SIDE_EFFECT_VALUES.has(value as VentureAutonomySideEffect);
}

function isVentureAgentRunSourceType(value: unknown): value is VentureAgentRunSourceType {
  return typeof value === "string" && VENTURE_AGENT_RUN_SOURCE_VALUES.has(value as VentureAgentRunSourceType);
}

function isVentureAgentRunStatus(value: unknown): value is VentureAgentRunStatus {
  return typeof value === "string" && VENTURE_AGENT_RUN_STATUS_VALUES.has(value as VentureAgentRunStatus);
}

function isVentureCompetitorType(value: unknown): value is VentureCompetitorType {
  return typeof value === "string" && VENTURE_COMPETITOR_TYPE_VALUES.has(value as VentureCompetitorType);
}

function isVentureCompetitorThreatLevel(value: unknown): value is VentureCompetitorThreatLevel {
  return typeof value === "string" && VENTURE_COMPETITOR_THREAT_VALUES.has(value as VentureCompetitorThreatLevel);
}

function isVentureCompetitorStatus(value: unknown): value is VentureCompetitorStatus {
  return typeof value === "string" && VENTURE_COMPETITOR_STATUS_VALUES.has(value as VentureCompetitorStatus);
}

function isVentureCompetitorSourceType(value: unknown): value is VentureCompetitorSourceType {
  return typeof value === "string" && VENTURE_COMPETITOR_SOURCE_VALUES.has(value as VentureCompetitorSourceType);
}

function isVentureBrowserResearchSourceType(value: unknown): value is VentureBrowserResearchSourceType {
  return typeof value === "string" && VENTURE_BROWSER_RESEARCH_SOURCE_VALUES.has(value as VentureBrowserResearchSourceType);
}

function isVentureBrowserResearchStatus(value: unknown): value is VentureBrowserResearchStatus {
  return typeof value === "string" && VENTURE_BROWSER_RESEARCH_STATUS_VALUES.has(value as VentureBrowserResearchStatus);
}

function isVentureProductBuildCommandSourceType(value: unknown): value is VentureProductBuildCommandSourceType {
  return typeof value === "string" && VENTURE_PRODUCT_BUILD_COMMAND_SOURCE_VALUES.has(value as VentureProductBuildCommandSourceType);
}

function isVentureProductBuildCommandRunState(value: unknown): value is VentureProductBuildCommandRunState {
  return typeof value === "string" && VENTURE_PRODUCT_BUILD_COMMAND_RUN_VALUES.has(value as VentureProductBuildCommandRunState);
}

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isSavedVentureWorkspace(value: unknown): value is SavedVentureWorkspace {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<SavedVentureWorkspace>;
  return Boolean(
    record.id &&
    record.title &&
    record.savedAt &&
    record.updatedAt &&
    isVentureLifecycleStatus(record.lifecycleStatus) &&
    Array.isArray(record.experiments) &&
    Array.isArray(record.approvals) &&
    record.killCriteria,
  );
}

function isDecisionRecord(value: unknown): value is VentureDecisionRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureDecisionRecord>;
  return Boolean(
    record.id &&
    record.decidedAt &&
    isVentureDecisionType(record.decision) &&
    isVentureLifecycleStatus(record.previousLifecycleStatus) &&
    isVentureLifecycleStatus(record.nextLifecycleStatus) &&
    typeof record.rationale === "string" &&
    typeof record.nextAction === "string",
  );
}

function isGapActionRecord(value: unknown): value is VentureGapActionRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureGapActionRecord>;
  return Boolean(
    record.id &&
    record.taskId &&
    record.type &&
    record.priority &&
    record.title &&
    record.reason &&
    record.prompt &&
    record.status &&
    record.requestedAt,
  );
}

function isPredictionSnapshot(value: unknown): value is VenturePredictionSnapshot {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VenturePredictionSnapshot>;
  return Boolean(
    record.id &&
    record.experimentId &&
    record.type &&
    record.predictedAt &&
    record.predictedOutcome &&
    typeof record.buyerUrgency === "number" &&
    typeof record.conversionProbability === "number" &&
    typeof record.rationale === "string",
  );
}

function isPricingSignalRecord(value: unknown): value is VenturePricingSignalRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VenturePricingSignalRecord>;
  return Boolean(
    record.id &&
    record.experimentId &&
    record.recordedAt &&
    typeof record.pricingHypothesis === "string" &&
    typeof record.qualifiedBuyerCount === "number" &&
    typeof record.paidCommitmentCount === "number" &&
    typeof record.invoiceRequestCount === "number" &&
    typeof record.acceptedPrice === "string" &&
    typeof record.objectionSummary === "string" &&
    typeof record.evidenceNote === "string",
  );
}

function isCustomerInterviewRecord(value: unknown): value is VentureCustomerInterviewRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureCustomerInterviewRecord>;
  return Boolean(
    record.id &&
    record.interviewedAt &&
    typeof record.persona === "string" &&
    typeof record.channel === "string" &&
    typeof record.painQuote === "string" &&
    typeof record.willingnessToPay === "string" &&
    typeof record.objections === "string" &&
    typeof record.requestedFeatures === "string" &&
    isVentureInterviewSentiment(record.sentiment) &&
    typeof record.evidenceNote === "string",
  );
}

function isOutreachApprovalRecord(value: unknown): value is VentureOutreachApprovalRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureOutreachApprovalRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    record.approvalLevel === "Human-approved outreach" &&
    isVentureOutreachApprovalStatus(record.status) &&
    typeof record.contactPersona === "string" &&
    typeof record.channel === "string" &&
    typeof record.messageDraft === "string" &&
    typeof record.riskNote === "string" &&
    typeof record.nextAction === "string" &&
    typeof record.attribution === "string" &&
    record.externalSendStatus === "not-sent",
  );
}

function isRiskRecord(value: unknown): value is VentureRiskRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureRiskRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    record.sourceType &&
    typeof record.title === "string" &&
    typeof record.detail === "string" &&
    isVentureRiskSeverity(record.severity) &&
    isVentureRiskStatus(record.status) &&
    typeof record.owner === "string" &&
    typeof record.mitigation === "string" &&
    typeof record.resolutionEvidence === "string",
  );
}

function isMvpBuildWorkspaceRecord(value: unknown): value is VentureMvpBuildWorkspaceRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureMvpBuildWorkspaceRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    record.updatedAt &&
    isVentureMvpBuildStatus(record.status) &&
    typeof record.owner === "string" &&
    typeof record.sourceCodeStatus === "string" &&
    typeof record.repoPath === "string" &&
    typeof record.setupInstructions === "string" &&
    typeof record.setupCommand === "string" &&
    typeof record.typecheckCommand === "string" &&
    typeof record.testCommand === "string" &&
    typeof record.buildCommand === "string" &&
    typeof record.browserSmokeCommand === "string" &&
    typeof record.deploymentCommand === "string" &&
    typeof record.deploymentPath === "string" &&
    typeof record.analyticsPlan === "string" &&
    typeof record.securityNotes === "string" &&
    typeof record.accessibilityPass === "string" &&
    typeof record.mobileBehavior === "string" &&
    Array.isArray(record.dataModel) &&
    typeof record.operatorDashboard === "string" &&
    typeof record.evidenceBacklink === "string" &&
    isVentureMvpCheckStatus(record.setupCheck) &&
    isVentureMvpCheckStatus(record.typecheckCheck) &&
    isVentureMvpCheckStatus(record.unitTestCheck) &&
    isVentureMvpCheckStatus(record.buildCheck) &&
    isVentureMvpCheckStatus(record.browserSmokeCheck) &&
    isVentureMvpCheckStatus(record.deploymentCheck) &&
    typeof record.verificationNotes === "string",
  );
}

function isArtifactRecord(value: unknown): value is VentureArtifactRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureArtifactRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    record.updatedAt &&
    isVentureArtifactType(record.artifactType) &&
    isVentureArtifactStatus(record.status) &&
    typeof record.title === "string" &&
    typeof record.uri === "string" &&
    typeof record.owner === "string" &&
    typeof record.verificationCommand === "string" &&
    typeof record.evidence === "string" &&
    typeof record.changeSummary === "string",
  );
}

function isMoneySignalRecord(value: unknown): value is VentureMoneySignalRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureMoneySignalRecord>;
  return Boolean(
    record.id &&
    record.recordedAt &&
    isVentureMoneySignalType(record.type) &&
    isVentureMoneySignalStatus(record.status) &&
    typeof record.amountCents === "number" &&
    typeof record.currency === "string" &&
    typeof record.source === "string" &&
    typeof record.owner === "string" &&
    typeof record.evidence === "string" &&
    typeof record.notes === "string" &&
    record.externalBillingStatus === "not-charged",
  );
}

function isRoadmapTaskRecord(value: unknown): value is VentureRoadmapTaskRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureRoadmapTaskRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    isVentureRoadmapSourceType(record.sourceType) &&
    typeof record.title === "string" &&
    typeof record.detail === "string" &&
    isVentureRoadmapPriority(record.priority) &&
    isVentureRoadmapStatus(record.status) &&
    typeof record.owner === "string" &&
    typeof record.supportLoad === "string" &&
    typeof record.riskReduction === "string" &&
    typeof record.nextAction === "string",
  );
}

function isSupportIssueRecord(value: unknown): value is VentureSupportIssueRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureSupportIssueRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    isVentureSupportIssueType(record.issueType) &&
    isVentureSupportIssueSeverity(record.severity) &&
    isVentureSupportIssueStatus(record.status) &&
    isVentureSupportIssueSourceType(record.sourceType) &&
    typeof record.title === "string" &&
    typeof record.detail === "string" &&
    typeof record.customerImpact === "string" &&
    typeof record.supportLoad === "string" &&
    typeof record.retentionRisk === "string" &&
    typeof record.owner === "string" &&
    typeof record.resolution === "string" &&
    typeof record.nextAction === "string",
  );
}

function isActivationCohortRecord(value: unknown): value is VentureActivationCohortRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureActivationCohortRecord>;
  return Boolean(
    record.id &&
    record.recordedAt &&
    isVentureActivationCohortSourceType(record.sourceType) &&
    typeof record.cohortLabel === "string" &&
    typeof record.acquisitionChannel === "string" &&
    typeof record.activationEvent === "string" &&
    typeof record.retentionWindow === "string" &&
    typeof record.signupCount === "number" &&
    typeof record.activatedCount === "number" &&
    typeof record.retainedCount === "number" &&
    typeof record.paidCount === "number" &&
    typeof record.revenueCents === "number" &&
    typeof record.supportIssueCount === "number" &&
    typeof record.owner === "string" &&
    typeof record.evidence === "string" &&
    typeof record.learning === "string" &&
    typeof record.nextAction === "string",
  );
}

function isChannelEconomicsRecord(value: unknown): value is VentureChannelEconomicsRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureChannelEconomicsRecord>;
  return Boolean(
    record.id &&
    record.recordedAt &&
    isVentureChannelEconomicsSourceType(record.sourceType) &&
    typeof record.channel === "string" &&
    typeof record.spendCents === "number" &&
    typeof record.impressions === "number" &&
    typeof record.clicks === "number" &&
    typeof record.signupCount === "number" &&
    typeof record.activatedCount === "number" &&
    typeof record.paidCount === "number" &&
    typeof record.revenueCents === "number" &&
    typeof record.costPerSignupCents === "number" &&
    typeof record.cacCents === "number" &&
    isVenturePaybackStatus(record.paybackStatus) &&
    typeof record.owner === "string" &&
    typeof record.evidence === "string" &&
    typeof record.nextAction === "string",
  );
}

function isAutonomyAuditRecord(value: unknown): value is VentureAutonomyAuditRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureAutonomyAuditRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    isVentureAutonomyApprovalLevel(record.approvalLevel) &&
    isVentureAutonomyAuditStatus(record.status) &&
    isVentureAutonomySideEffect(record.sideEffect) &&
    typeof record.actionType === "string" &&
    typeof record.actor === "string" &&
    typeof record.riskNote === "string" &&
    typeof record.replayNote === "string" &&
    typeof record.evidence === "string" &&
    typeof record.nextAction === "string",
  );
}

function isAgentRunRecord(value: unknown): value is VentureAgentRunRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureAgentRunRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    isVentureAgentRunSourceType(record.sourceType) &&
    isVentureAgentRunStatus(record.status) &&
    typeof record.model === "string" &&
    typeof record.prompt === "string" &&
    typeof record.outputSummary === "string" &&
    typeof record.inputEvidence === "string" &&
    typeof record.toolCalls === "string" &&
    typeof record.tokenEstimate === "number" &&
    typeof record.replayCommand === "string" &&
    typeof record.riskNote === "string" &&
    typeof record.owner === "string" &&
    typeof record.nextAction === "string",
  );
}

function isCompetitorRecord(value: unknown): value is VentureCompetitorRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureCompetitorRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    isVentureCompetitorSourceType(record.sourceType) &&
    typeof record.competitorName === "string" &&
    isVentureCompetitorType(record.competitorType) &&
    isVentureCompetitorThreatLevel(record.threatLevel) &&
    isVentureCompetitorStatus(record.status) &&
    typeof record.positioning === "string" &&
    typeof record.evidence === "string" &&
    typeof record.differentiation === "string" &&
    typeof record.responsePlan === "string" &&
    typeof record.owner === "string" &&
    typeof record.watchCadence === "string" &&
    typeof record.nextAction === "string",
  );
}

function isBrowserResearchTaskRecord(value: unknown): value is VentureBrowserResearchTaskRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureBrowserResearchTaskRecord>;
  return Boolean(
    record.id &&
    record.createdAt &&
    record.updatedAt &&
    isVentureBrowserResearchSourceType(record.sourceType) &&
    typeof record.platform === "string" &&
    typeof record.sourceTarget === "string" &&
    typeof record.prompt === "string" &&
    isVentureBrowserResearchStatus(record.status) &&
    typeof record.owner === "string" &&
    typeof record.evidenceUrl === "string" &&
    typeof record.findings === "string" &&
    typeof record.replayNote === "string" &&
    typeof record.nextAction === "string",
  );
}

function isAtlasValidationResultRecord(value: unknown): value is VentureAtlasValidationResultRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureAtlasValidationResultRecord>;
  return Boolean(
    record.id &&
    record.recordedAt &&
    record.atlasValidationPackId &&
    record.atlasItemId &&
    record.atlasItemTitle &&
    isVentureAtlasValidationResultOutcome(record.outcome) &&
    typeof record.qualifiedBuyerCount === "number" &&
    typeof record.painConfirmationCount === "number" &&
    typeof record.hiddenWedgeResonanceCount === "number" &&
    typeof record.paidPricingSignalCount === "number" &&
    typeof record.strongestQuote === "string" &&
    typeof record.strongestObjection === "string" &&
    typeof record.evidenceNote === "string" &&
    typeof record.learning === "string" &&
    typeof record.owner === "string" &&
    typeof record.nextAction === "string" &&
    typeof record.noExternalSideEffectProof === "string" &&
    typeof record.demandDriftScore === "number",
  );
}

function isProductBuildCommandRunRecord(value: unknown): value is VentureProductBuildCommandRunRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<VentureProductBuildCommandRunRecord>;
  return Boolean(
    record.id &&
    record.recordedAt &&
    record.commandId &&
    record.commandTitle &&
    isVentureProductBuildCommandSourceType(record.sourceType) &&
    record.sourceArtifactId &&
    typeof record.sourceArtifactLabel === "string" &&
    isVentureProductBuildCommandRunState(record.runState) &&
    typeof record.appName === "string" &&
    typeof record.buildCommand === "string" &&
    typeof record.artifactTarget === "string" &&
    typeof record.owner === "string" &&
    typeof record.runProof === "string" &&
    typeof record.localArtifactProof === "string" &&
    typeof record.verifierReportProof === "string" &&
    typeof record.noExternalSideEffectProof === "string" &&
    typeof record.learning === "string" &&
    Array.isArray(record.evidence),
  );
}

function normalizeSavedVentureWorkspace(venture: SavedVentureWorkspace): SavedVentureWorkspace {
  const decisionHistory = Array.isArray(venture.decisionHistory)
    ? venture.decisionHistory.filter(isDecisionRecord)
    : [];
  const gapActionHistory = Array.isArray(venture.gapActionHistory)
    ? venture.gapActionHistory.filter(isGapActionRecord)
    : [];
  const predictionSnapshots = Array.isArray(venture.predictionSnapshots)
    ? venture.predictionSnapshots.filter(isPredictionSnapshot)
    : [];
  const pricingSignals = Array.isArray(venture.pricingSignals)
    ? venture.pricingSignals.filter(isPricingSignalRecord)
    : [];
  const customerInterviews = Array.isArray(venture.customerInterviews)
    ? venture.customerInterviews.filter(isCustomerInterviewRecord)
    : [];
  const outreachApprovals = Array.isArray(venture.outreachApprovals)
    ? venture.outreachApprovals.filter(isOutreachApprovalRecord)
    : [];
  const riskRecords = Array.isArray(venture.riskRecords)
    ? venture.riskRecords.filter(isRiskRecord)
    : [];
  const mvpBuildWorkspaces = Array.isArray(venture.mvpBuildWorkspaces)
    ? venture.mvpBuildWorkspaces.filter(isMvpBuildWorkspaceRecord)
    : [];
  const artifactRecords = Array.isArray(venture.artifactRecords)
    ? venture.artifactRecords.filter(isArtifactRecord)
    : [];
  const moneySignals = Array.isArray(venture.moneySignals)
    ? venture.moneySignals.filter(isMoneySignalRecord)
    : [];
  const roadmapTasks = Array.isArray(venture.roadmapTasks)
    ? venture.roadmapTasks.filter(isRoadmapTaskRecord)
    : [];
  const supportIssues = Array.isArray(venture.supportIssues)
    ? venture.supportIssues.filter(isSupportIssueRecord)
    : [];
  const activationCohorts = Array.isArray(venture.activationCohorts)
    ? venture.activationCohorts.filter(isActivationCohortRecord)
    : [];
  const channelEconomics = Array.isArray(venture.channelEconomics)
    ? venture.channelEconomics.filter(isChannelEconomicsRecord)
    : [];
  const autonomyAudit = Array.isArray(venture.autonomyAudit)
    ? venture.autonomyAudit.filter(isAutonomyAuditRecord)
    : [];
  const agentRuns = Array.isArray(venture.agentRuns)
    ? venture.agentRuns.filter(isAgentRunRecord)
    : [];
  const competitors = Array.isArray(venture.competitors)
    ? venture.competitors.filter(isCompetitorRecord)
    : [];
  const browserResearchTasks = Array.isArray(venture.browserResearchTasks)
    ? venture.browserResearchTasks.filter(isBrowserResearchTaskRecord)
    : [];
  const atlasValidationResults = Array.isArray(venture.atlasValidationResults)
    ? venture.atlasValidationResults.filter(isAtlasValidationResultRecord)
    : [];
  const productBuildCommandRuns = Array.isArray(venture.productBuildCommandRuns)
    ? venture.productBuildCommandRuns.filter(isProductBuildCommandRunRecord)
    : [];

  return {
    ...venture,
    whyNow: venture.whyNow ?? deriveFallbackVentureWhyNow(venture),
    mvpScope: venture.mvpScope ?? deriveFallbackVentureMvpScope(venture),
    buildEstimate: venture.buildEstimate ?? deriveFallbackVentureBuildEstimate({
      ...venture,
      mvpScope: venture.mvpScope ?? deriveFallbackVentureMvpScope(venture),
    }),
    evidenceConfidence: venture.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(venture),
    reasoningDebate: venture.reasoningDebate ?? deriveFallbackVentureReasoningDebate({
      ...venture,
      whyNow: venture.whyNow ?? deriveFallbackVentureWhyNow(venture),
      mvpScope: venture.mvpScope ?? deriveFallbackVentureMvpScope(venture),
      buildEstimate: venture.buildEstimate ?? deriveFallbackVentureBuildEstimate({
        ...venture,
        mvpScope: venture.mvpScope ?? deriveFallbackVentureMvpScope(venture),
      }),
      evidenceConfidence: venture.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(venture),
    }),
    evaluationLenses: venture.evaluationLenses ?? deriveFallbackVentureEvaluationLenses({
      ...venture,
      mvpScope: venture.mvpScope ?? deriveFallbackVentureMvpScope(venture),
      buildEstimate: venture.buildEstimate ?? deriveFallbackVentureBuildEstimate({
        ...venture,
        mvpScope: venture.mvpScope ?? deriveFallbackVentureMvpScope(venture),
      }),
      evidenceConfidence: venture.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(venture),
    }),
    reviewCadence: venture.reviewCadence || reviewCadenceForStatus(venture.lifecycleStatus),
    opportunityDemandSnapshot: venture.opportunityDemandSnapshot ?? buildFallbackOpportunityDemandSnapshot(venture),
    decisionHistory,
    gapActionHistory,
    predictionSnapshots,
    pricingSignals,
    customerInterviews,
    outreachApprovals,
    riskRecords,
    mvpBuildWorkspaces,
    artifactRecords,
    moneySignals,
    roadmapTasks,
    supportIssues,
    activationCohorts,
    channelEconomics,
    autonomyAudit,
    agentRuns,
    competitors,
    browserResearchTasks,
    atlasValidationResults,
    productBuildCommandRuns,
  };
}

function createDecisionId(ventureId: string, decision: VentureDecisionType, now: string) {
  return `${ventureId}-${decision}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createPricingSignalId(ventureId: string, now: string) {
  return `${ventureId}-pricing-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createCustomerInterviewId(ventureId: string, now: string) {
  return `${ventureId}-interview-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createOutreachApprovalId(ventureId: string, now: string) {
  return `${ventureId}-outreach-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createRiskRecordId(ventureId: string, now: string) {
  return `${ventureId}-risk-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createMvpBuildWorkspaceId(ventureId: string, now: string) {
  return `${ventureId}-mvp-build-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createArtifactRecordId(ventureId: string, artifactType: VentureArtifactType, now: string) {
  return `${ventureId}-artifact-${artifactType}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createMoneySignalId(ventureId: string, type: VentureMoneySignalType, now: string) {
  return `${ventureId}-money-${type}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function moneyApprovalLevelFor(type: VentureMoneySignalType): VentureAutonomyApprovalLevel {
  return type === "expense" ? "human-approved-spend" : "human-approved-billing-change";
}

function moneyApprovalStateFor(status: VentureMoneySignalStatus): VentureMoneyApprovalState {
  if (status === "blocked") return "blocked-before-external-action";
  if (status === "received" || status === "spent" || status === "refunded") return "record-only";
  return "approval-required";
}

function moneyExternalActionStateFor(type: VentureMoneySignalType, status: VentureMoneySignalStatus): VentureMoneyExternalActionState {
  if (type === "expense" || status === "spent") return "no-app-spend";
  if (type === "refund" || status === "refunded") return "no-app-refund";
  return "no-app-charge";
}

function moneyApprovalNextActionFor(type: VentureMoneySignalType, status: VentureMoneySignalStatus) {
  if (status === "blocked") {
    return "Keep the external money action blocked until the owner attaches approval evidence and resolves the blocker.";
  }
  if (type === "expense" || status === "spent") {
    return "Require explicit human spend approval and receipt evidence before any external payment, reimbursement, or ad spend.";
  }
  if (type === "refund" || status === "refunded") {
    return "Require explicit human billing approval before issuing or recording any external refund action.";
  }
  return "Treat this as a record-only money signal until a human approves any charge, invoice, collection, credit, or billing change.";
}

function createRoadmapTaskId(ventureId: string, sourceType: VentureRoadmapSourceType, now: string) {
  return `${ventureId}-roadmap-${sourceType}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createSupportIssueId(ventureId: string, issueType: VentureSupportIssueType, now: string) {
  return `${ventureId}-support-${issueType}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createActivationCohortId(ventureId: string, now: string) {
  return `${ventureId}-cohort-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createChannelEconomicsId(ventureId: string, now: string) {
  return `${ventureId}-channel-economics-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createAutonomyAuditId(ventureId: string, approvalLevel: VentureAutonomyApprovalLevel, now: string) {
  return `${ventureId}-autonomy-${approvalLevel}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createAgentRunId(ventureId: string, sourceType: VentureAgentRunSourceType, now: string) {
  return `${ventureId}-agent-run-${sourceType}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createCompetitorRecordId(ventureId: string, competitorType: VentureCompetitorType, now: string) {
  return `${ventureId}-competitor-${competitorType}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createBrowserResearchTaskId(ventureId: string, sourceType: VentureBrowserResearchSourceType, now: string) {
  return `${ventureId}-browser-research-${sourceType}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createAtlasValidationResultId(ventureId: string, outcome: VentureAtlasValidationResultOutcome, now: string) {
  return `${ventureId}-atlas-validation-result-${outcome}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function createProductBuildCommandRunId(ventureId: string, commandId: string, runState: VentureProductBuildCommandRunState, now: string) {
  const commandSegment = commandId.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  return `${ventureId}-product-build-run-${runState}-${commandSegment}-${now.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

function atlasValidationResultScoreFor(params: {
  outcome: VentureAtlasValidationResultOutcome;
  qualifiedBuyerCount: number;
  painConfirmationCount: number;
  hiddenWedgeResonanceCount: number;
  paidPricingSignalCount: number;
}) {
  const baseScore: Record<VentureAtlasValidationResultOutcome, number> = {
    passed: 76,
    failed: 18,
    pivot: 45,
    inconclusive: 40,
  };
  const proofBonus = Math.min(14, params.qualifiedBuyerCount * 2) +
    Math.min(8, params.painConfirmationCount) +
    Math.min(8, params.hiddenWedgeResonanceCount) +
    Math.min(10, params.paidPricingSignalCount * 4);
  const negativePenalty = params.outcome === "failed" ? Math.min(10, params.qualifiedBuyerCount + params.painConfirmationCount) : 0;
  return clampScore(baseScore[params.outcome] + proofBonus - negativePenalty);
}

function riskSourceKey(sourceType: VentureRiskSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function roadmapSourceKey(sourceType: VentureRoadmapSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function supportIssueSourceKey(sourceType: VentureSupportIssueSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function activationCohortSourceKey(sourceType: VentureActivationCohortSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function channelEconomicsSourceKey(sourceType: VentureChannelEconomicsSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function agentRunSourceKey(sourceType: VentureAgentRunSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function competitorSourceKey(sourceType: VentureCompetitorSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function browserResearchSourceKey(sourceType: VentureBrowserResearchSourceType, sourceRecordId?: string) {
  return sourceRecordId ? `${sourceType}:${sourceRecordId}` : "";
}

function hasAttachedMvpRepo(repoPath: string) {
  const trimmed = repoPath.trim();
  return Boolean(trimmed) && trimmed !== VENTURE_NO_MVP_SOURCE_ATTACHED;
}

function countPassedMvpChecks(workspace: VentureMvpBuildWorkspaceRecord) {
  return [
    workspace.setupCheck,
    workspace.typecheckCheck,
    workspace.unitTestCheck,
    workspace.buildCheck,
    workspace.browserSmokeCheck,
    workspace.deploymentCheck,
  ].filter((status) => status === "passed").length;
}

function hasMeaningfulRiskText(value: string) {
  const text = value.trim();
  return Boolean(text) && !/^no .* recorded\.$/i.test(text);
}

function hasMeaningfulSupportText(value: string) {
  const text = value.trim();
  return Boolean(text) && !/^no .* recorded\.$/i.test(text);
}

function inferRiskSeverity(text: string): VentureRiskSeverity {
  if (/\b(breach|fraud|illegal|unsafe|harm|medical emergency)\b/i.test(text)) return "critical";
  if (/\b(privacy|clinical|compliance|legal|security|consent|regulatory|weak urgency|no demand|failed|reject)\b/i.test(text)) return "high";
  if (/\b(objection|budget|discount|trust|support|friction|confusing|concern)\b/i.test(text)) return "medium";
  return "low";
}

function inferSupportIssueSeverity(text: string): VentureSupportIssueSeverity {
  if (/\b(blocked|cannot use|broken|refund|churn|urgent|critical|unsafe|breach)\b/i.test(text)) return "critical";
  if (/\b(retention|privacy|clinical|support load|manual support|failed|blocked|confusing|consent)\b/i.test(text)) return "high";
  if (/\b(question|friction|objection|setup|pilot|manual|workaround|reminder)\b/i.test(text)) return "medium";
  return "low";
}

function inferCompetitorThreat(text: string): VentureCompetitorThreatLevel {
  if (/\b(monopoly|dominant|entrenched|lock[- ]?in|winner|category leader|critical)\b/i.test(text)) return "critical";
  if (/\b(stronger|better|substitute|copy|crowded|incumbent|retention|pricing pressure|backlash)\b/i.test(text)) return "high";
  if (/\b(competitor|competitive|alternative|similar|manual workaround|status quo)\b/i.test(text)) return "medium";
  return "low";
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeCount(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function normalizeAmountCents(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function estimateRunTokenCount(...parts: Array<string | undefined | null>) {
  const text = parts.map((part) => String(part ?? "").trim()).filter(Boolean).join(" ");
  if (!text) return 0;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words * 1.35));
}

function boundedCount(value: number, max?: number) {
  const normalized = normalizeCount(value);
  return typeof max === "number" && max >= 0 ? Math.min(normalized, max) : normalized;
}

function extractFirstCount(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  if (!match?.[1]) return 0;
  return normalizeCount(Number.parseInt(match[1].replace(/,/g, ""), 10));
}

function divideCurrencyCents(numeratorCents: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Math.round(numeratorCents / denominator);
}

function formatCents(cents: number) {
  const amount = cents / 100;
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

function paybackStatusFor(spendCents: number, revenueCents: number): VenturePaybackStatus {
  if (spendCents <= 0) return "unknown";
  if (revenueCents >= spendCents) return "paid-back";
  if (revenueCents > 0) return "partial-payback";
  return "no-payback";
}

function evidenceReadinessFor(params: {
  sourceCount: number;
  readinessScore: number;
  missingEvidenceCount: number;
  contradictionCount: number;
}): VentureEvidenceReadiness {
  if (params.sourceCount === 0 || params.readinessScore < 45) return "too-thin";
  if (params.readinessScore >= 74 && params.missingEvidenceCount === 0 && params.contradictionCount === 0) {
    return "decision-ready";
  }
  return "needs-pressure-test";
}

function evidenceAverageForWorkspace(workspace: VentureOperatingWorkspace) {
  if (workspace.evidenceSources.length === 0) return 45;
  return clampScore(
    workspace.evidenceSources.reduce((sum, source) => sum + scoreEvidenceQuality(source).score, 0) / workspace.evidenceSources.length,
  );
}

function evaluationLensesForWorkspace(workspace: VentureOperatingWorkspace): VentureEvaluationLenses {
  const mvpScope = workspace.mvpScope ?? deriveFallbackVentureMvpScope(workspace);
  const buildEstimate = workspace.buildEstimate ?? deriveFallbackVentureBuildEstimate({
    ...workspace,
    mvpScope,
  });
  const evidenceConfidence = workspace.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(workspace);
  return workspace.evaluationLenses ?? deriveFallbackVentureEvaluationLenses({
    ...workspace,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
  });
}

const VENTURE_POSTURE_LENS_LABELS = new Set([
  "Jobs-to-be-done",
  "Willingness to pay",
  "Distribution wedge",
  "Churn risk",
  "Expansion revenue",
  "Platform dependency",
  "Procurement friction",
  "Founder-market fit",
  "Brand trust",
  "Workflow lock-in",
  "Switching costs",
  "Capital efficiency",
  "Support burden",
]);

function summarizeEvaluationLenses(workspace: VentureOperatingWorkspace) {
  const lenses = Object.values(evaluationLensesForWorkspace(workspace));
  const averageScore = lenses.length === 0
    ? 0
    : clampScore(lenses.reduce((sum, lens) => sum + lens.score, 0) / lenses.length);
  const postureLenses = lenses.filter((lens) => VENTURE_POSTURE_LENS_LABELS.has(lens.label));
  const postureAverageScore = postureLenses.length === 0
    ? averageScore
    : clampScore(postureLenses.reduce((sum, lens) => sum + lens.score, 0) / postureLenses.length);
  const weakestLens = lenses.slice().sort((a, b) => a.score - b.score)[0] as VentureEvaluationLens | undefined;
  const weakestPostureLens = postureLenses.slice().sort((a, b) => a.score - b.score)[0] as VentureEvaluationLens | undefined;
  const strongestLens = lenses.slice().sort((a, b) => b.score - a.score)[0] as VentureEvaluationLens | undefined;
  const lowLensCount = lenses.filter((lens) => lens.score < 35).length;
  const lowPostureLensCount = postureLenses.filter((lens) => lens.score < 35).length;
  const highLensCount = lenses.filter((lens) => lens.score >= 68).length;
  const speculativeLensCount = lenses.filter((lens) => lens.confidence === "speculative").length;

  return {
    lenses,
    averageScore,
    postureLenses,
    postureAverageScore,
    weakestLens,
    weakestPostureLens,
    strongestLens,
    lowLensCount,
    lowPostureLensCount,
    highLensCount,
    speculativeLensCount,
  };
}

function predictedOutcomeFor(score: number): VenturePredictionOutcome {
  if (score >= 68) return "expected-pass";
  if (score < 45) return "expected-fail";
  return "uncertain";
}

function alignPrediction(
  predictedOutcome: VenturePredictionOutcome | undefined,
  actual: Exclude<VentureDemandCalibrationStatus, "not-measured">,
): VenturePredictionAlignment {
  if (!predictedOutcome) return "not-predicted";
  if (predictedOutcome === "uncertain" || actual === "inconclusive") return "uncertain";
  if (predictedOutcome === "expected-pass" && actual === "passed") return "confirmed";
  if (predictedOutcome === "expected-fail" && actual === "failed") return "confirmed";
  return "surprised";
}

export function buildVenturePredictionSnapshots(
  workspace: VentureOperatingWorkspace,
  now = new Date().toISOString(),
): VenturePredictionSnapshot[] {
  const evidenceAverage = evidenceAverageForWorkspace(workspace);
  const missingEvidencePenalty = workspace.killCriteria.missingEvidence.length * 6;
  const contradictionPenalty = workspace.contradictions.length * 5;
  const readinessScore = clampScore(evidenceAverage - missingEvidencePenalty - contradictionPenalty);
  const lensSummary = summarizeEvaluationLenses(workspace);
  const lensDelta = Math.max(-12, Math.min(10, (lensSummary.postureAverageScore - 60) / 3));
  const weakLensFriction = lensSummary.lowPostureLensCount * 3 + Math.min(4, lensSummary.speculativeLensCount);
  const buyerUrgency = clampScore(readinessScore + (workspace.decision === "continue" ? 8 : workspace.decision === "kill-review" ? -10 : 0));
  const budgetLikelihood = clampScore(
    /paid|\$|price|pricing|revenue|invoice|month/i.test(`${workspace.pricingHypothesis} ${workspace.revenueModel}`)
      ? readinessScore + 6
      : readinessScore - 8,
  );
  const adoptionFriction = clampScore(100 - readinessScore + workspace.keyIntegrations.length * 3 + weakLensFriction);
  const trustBarrier = clampScore(100 - evidenceAverage + workspace.contradictions.length * 8 + lensSummary.lowLensCount * 4 + lensSummary.speculativeLensCount);
  const competitivePull = clampScore(workspace.companySimulation.failureModes.length * 12 + workspace.contradictions.length * 10);
  const messageMarketFit = clampScore(readinessScore + lensDelta);
  const channelReach = clampScore(evidenceAverage + workspace.acquisitionChannels.length * 4 - missingEvidencePenalty);
  const conversionProbability = clampScore((buyerUrgency + budgetLikelihood + messageMarketFit + channelReach) / 4 - adoptionFriction * 0.12 + lensDelta);
  const retentionProbability = clampScore(readinessScore + (/retention|repeat|week|return/i.test(workspace.retentionMechanism) ? 8 : -4) + lensDelta * 0.5);
  const expansionPotential = clampScore((retentionProbability + budgetLikelihood) / 2 - competitivePull * 0.08 + lensDelta * 0.5);
  const weakestLens = lensSummary.weakestPostureLens ?? lensSummary.weakestLens;
  const weakestLensText = weakestLens
    ? ` Weakest decision lens: ${weakestLens.label} ${weakestLens.score}/100; next action: ${weakestLens.nextAction}`
    : "";

  return workspace.experiments.map((experiment) => ({
    id: `${workspace.id}-${experiment.id}-prediction`,
    experimentId: experiment.id,
    type: experiment.type,
    predictedAt: now,
    predictedOutcome: predictedOutcomeFor(conversionProbability),
    buyerUrgency,
    budgetLikelihood,
    adoptionFriction,
    trustBarrier,
    competitivePull,
    messageMarketFit,
    channelReach,
    conversionProbability,
    retentionProbability,
    expansionPotential,
    successThreshold: experiment.successThreshold,
    failureThreshold: experiment.failureThreshold,
    rationale: `Predicted from ${workspace.evidenceSources.length} evidence source${workspace.evidenceSources.length === 1 ? "" : "s"}, ${workspace.killCriteria.missingEvidence.length} missing evidence gap${workspace.killCriteria.missingEvidence.length === 1 ? "" : "s"}, ${workspace.contradictions.length} contradiction warning${workspace.contradictions.length === 1 ? "" : "s"}, and ${lensSummary.postureAverageScore}/100 decision-lens strength.${weakestLensText}`,
  }));
}

function buildFallbackOpportunityDemandSnapshot(workspace: VentureOperatingWorkspace): VentureOpportunityDemandSnapshot {
  const coveredPlatforms = Array.from(new Set(
    workspace.evidenceSources
      .map((source) => source.platform.trim().toLowerCase())
      .filter(Boolean),
  )).sort();
  const evidenceCount = workspace.evidenceSources.filter((source) => source.url.trim() || source.summary.trim()).length;
  const evidenceAverage = evidenceAverageForWorkspace(workspace);
  const painUrgencyScore = clampScore(
    evidenceAverage +
    (/urgent|need|miss|deadline|pain|burnout|reimbursement|budget/i.test(`${workspace.painStatement} ${workspace.claims.join(" ")}`) ? 12 : 0) -
    workspace.contradictions.length * 5,
  );
  const demandEvidenceScore = clampScore(evidenceAverage + Math.min(20, evidenceCount * 5) - workspace.killCriteria.missingEvidence.length * 6);
  const demandScore = clampScore(painUrgencyScore * 0.58 + demandEvidenceScore * 0.42);

  return {
    source: "manual-thesis",
    optionId: workspace.id,
    title: workspace.title,
    buyer: workspace.targetBuyer,
    demandScore,
    painUrgencyScore,
    demandEvidenceScore,
    evidenceCount,
    coveredPlatforms,
    missingPlatforms: workspace.killCriteria.missingEvidence,
    demandSignals: [
      `Buyer: ${workspace.targetBuyer}`,
      `Pain urgency: ${painUrgencyScore}/100`,
      `Demand evidence: ${evidenceCount} source${evidenceCount === 1 ? "" : "s"} across ${coveredPlatforms.length} platform${coveredPlatforms.length === 1 ? "" : "s"}`,
    ],
    warnings: workspace.killCriteria.missingEvidence.map((gap) => `Missing demand proof: ${gap}`),
  };
}

export function buildSavedVentureWorkspace(
  workspace: VentureOperatingWorkspace,
  previous?: SavedVentureWorkspace,
  now = new Date().toISOString(),
): SavedVentureWorkspace {
  return {
    ...workspace,
    whyNow: workspace.whyNow ?? deriveFallbackVentureWhyNow(workspace),
    mvpScope: workspace.mvpScope ?? deriveFallbackVentureMvpScope(workspace),
    buildEstimate: workspace.buildEstimate ?? deriveFallbackVentureBuildEstimate({
      ...workspace,
      mvpScope: workspace.mvpScope ?? deriveFallbackVentureMvpScope(workspace),
    }),
    evidenceConfidence: workspace.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(workspace),
    reasoningDebate: workspace.reasoningDebate ?? deriveFallbackVentureReasoningDebate({
      ...workspace,
      whyNow: workspace.whyNow ?? deriveFallbackVentureWhyNow(workspace),
      mvpScope: workspace.mvpScope ?? deriveFallbackVentureMvpScope(workspace),
      buildEstimate: workspace.buildEstimate ?? deriveFallbackVentureBuildEstimate({
        ...workspace,
        mvpScope: workspace.mvpScope ?? deriveFallbackVentureMvpScope(workspace),
      }),
      evidenceConfidence: workspace.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(workspace),
    }),
    evaluationLenses: workspace.evaluationLenses ?? deriveFallbackVentureEvaluationLenses({
      ...workspace,
      mvpScope: workspace.mvpScope ?? deriveFallbackVentureMvpScope(workspace),
      buildEstimate: workspace.buildEstimate ?? deriveFallbackVentureBuildEstimate({
        ...workspace,
        mvpScope: workspace.mvpScope ?? deriveFallbackVentureMvpScope(workspace),
      }),
      evidenceConfidence: workspace.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(workspace),
    }),
    savedAt: previous?.savedAt ?? now,
    updatedAt: now,
    lifecycleStatus: previous?.lifecycleStatus ?? lifecycleFromStage(workspace.stage),
    reviewCadence: previous?.reviewCadence ?? reviewCadenceForStatus(lifecycleFromStage(workspace.stage)),
    decisionHistory: previous?.decisionHistory ?? [],
    gapActionHistory: previous?.gapActionHistory ?? [],
    predictionSnapshots: previous?.predictionSnapshots ?? buildVenturePredictionSnapshots(workspace, now),
    opportunityDemandSnapshot: previous?.opportunityDemandSnapshot ?? workspace.opportunityDemandSnapshot ?? buildFallbackOpportunityDemandSnapshot(workspace),
    pricingSignals: previous?.pricingSignals ?? [],
    customerInterviews: previous?.customerInterviews ?? [],
    outreachApprovals: previous?.outreachApprovals ?? [],
    riskRecords: previous?.riskRecords ?? [],
    mvpBuildWorkspaces: previous?.mvpBuildWorkspaces ?? [],
    artifactRecords: previous?.artifactRecords ?? [],
    moneySignals: previous?.moneySignals ?? [],
    roadmapTasks: previous?.roadmapTasks ?? [],
    supportIssues: previous?.supportIssues ?? [],
    activationCohorts: previous?.activationCohorts ?? [],
    channelEconomics: previous?.channelEconomics ?? [],
    autonomyAudit: previous?.autonomyAudit ?? [],
    agentRuns: previous?.agentRuns ?? [],
    competitors: previous?.competitors ?? [],
    browserResearchTasks: previous?.browserResearchTasks ?? [],
    atlasValidationResults: previous?.atlasValidationResults ?? [],
    productBuildCommandRuns: previous?.productBuildCommandRuns ?? [],
  };
}

export function loadVenturePortfolio(ownerKey: string, storage: StorageLike | null = browserStorage()): SavedVentureWorkspace[] {
  if (!storage) return [];
  const raw = storage.getItem(getVenturePortfolioStorageKey(ownerKey));
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isSavedVentureWorkspace)
      .map(normalizeSavedVentureWorkspace)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function saveVentureWorkspace(
  ownerKey: string,
  workspace: VentureOperatingWorkspace,
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace {
  const existing = loadVenturePortfolio(ownerKey, storage);
  const previous = existing.find((item) => item.id === workspace.id);
  const saved = buildSavedVentureWorkspace(workspace, previous, now);
  const next = [saved, ...existing.filter((item) => item.id !== workspace.id)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return saved;
}

export function recordVentureExperimentResult(
  ownerKey: string,
  ventureId: string,
  experimentId: string,
  result: {
    result: string;
    interpretation: string;
    nextAction?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    lifecycleStatus: venture.lifecycleStatus === "validating" ? "getting-signals" : venture.lifecycleStatus,
    experiments: venture.experiments.map((experiment) => (
      experiment.id === experimentId
        ? {
            ...experiment,
            result: result.result.trim(),
            interpretation: result.interpretation.trim(),
            nextAction: result.nextAction?.trim() || experiment.nextAction,
            recordedAt: now,
          }
        : experiment
    )),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVentureDecision(
  ownerKey: string,
  ventureId: string,
  decision: {
    decision: VentureDecisionType;
    rationale: string;
    nextAction?: string;
    nextLifecycleStatus?: VentureLifecycleStatus;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const rationale = decision.rationale.trim();
  if (!rationale) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const nextLifecycleStatus = decision.nextLifecycleStatus ?? lifecycleFromDecision(decision.decision, venture.lifecycleStatus);
  const record: VentureDecisionRecord = {
    id: createDecisionId(ventureId, decision.decision, now),
    decidedAt: now,
    decision: decision.decision,
    previousLifecycleStatus: venture.lifecycleStatus,
    nextLifecycleStatus,
    rationale,
    nextAction: decision.nextAction?.trim() || "No follow-up action recorded.",
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    lifecycleStatus: nextLifecycleStatus,
    reviewCadence: reviewCadenceForStatus(nextLifecycleStatus),
    decisionHistory: [record, ...venture.decisionHistory].slice(0, 50),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVentureGapAction(
  ownerKey: string,
  ventureId: string,
  task: VentureGapActionTask,
  update: {
    status: VentureGapActionStatus;
    outcome?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const previous = venture.gapActionHistory.find((record) => record.taskId === task.id);
  const outcome = update.outcome?.trim() || previous?.outcome;
  const record: VentureGapActionRecord = {
    id: previous?.id ?? `${task.id}-record`,
    taskId: task.id,
    type: task.type,
    priority: task.priority,
    title: task.title,
    reason: task.reason,
    prompt: task.prompt,
    status: update.status,
    requestedAt: previous?.requestedAt ?? now,
    launchedAt: update.status === "launched" ? now : previous?.launchedAt,
    completedAt: update.status === "completed" ? now : previous?.completedAt,
    outcome,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    gapActionHistory: [
      record,
      ...venture.gapActionHistory.filter((item) => item.taskId !== task.id),
    ].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVenturePricingSignal(
  ownerKey: string,
  ventureId: string,
  signal: {
    qualifiedBuyerCount: number;
    paidCommitmentCount: number;
    invoiceRequestCount: number;
    acceptedPrice?: string;
    objectionSummary?: string;
    evidenceNote?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const qualifiedBuyerCount = normalizeCount(signal.qualifiedBuyerCount);
  const paidCommitmentCount = normalizeCount(signal.paidCommitmentCount);
  const invoiceRequestCount = normalizeCount(signal.invoiceRequestCount);
  const acceptedPrice = signal.acceptedPrice?.trim() || venture.pricingHypothesis;
  const objectionSummary = signal.objectionSummary?.trim() || "No objections recorded.";
  const evidenceNote = signal.evidenceNote?.trim() || "No pricing evidence note recorded.";
  const hasSignal = qualifiedBuyerCount > 0 || paidCommitmentCount > 0 || invoiceRequestCount > 0 ||
    acceptedPrice.trim() || signal.objectionSummary?.trim() || signal.evidenceNote?.trim();

  if (!hasSignal) return null;

  const pricingExperiment = venture.experiments.find((experiment) => /pricing|paid|invoice/i.test(`${experiment.id} ${experiment.type}`));
  const record: VenturePricingSignalRecord = {
    id: createPricingSignalId(ventureId, now),
    experimentId: pricingExperiment?.id ?? "pricing-smoke",
    recordedAt: now,
    pricingHypothesis: venture.pricingHypothesis,
    qualifiedBuyerCount,
    paidCommitmentCount,
    invoiceRequestCount,
    acceptedPrice,
    objectionSummary,
    evidenceNote,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    pricingSignals: [record, ...venture.pricingSignals].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVentureCustomerInterview(
  ownerKey: string,
  ventureId: string,
  interview: {
    persona: string;
    channel: string;
    painQuote: string;
    willingnessToPay?: string;
    objections?: string;
    requestedFeatures?: string;
    sentiment: VentureInterviewSentiment;
    evidenceNote?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const persona = interview.persona.trim();
  const painQuote = interview.painQuote.trim();
  if (!persona || !painQuote) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureCustomerInterviewRecord = {
    id: createCustomerInterviewId(ventureId, now),
    interviewedAt: now,
    persona,
    channel: interview.channel.trim() || "manual interview",
    painQuote,
    willingnessToPay: interview.willingnessToPay?.trim() || "No willingness-to-pay quote recorded.",
    objections: interview.objections?.trim() || "No objections recorded.",
    requestedFeatures: interview.requestedFeatures?.trim() || "No feature requests recorded.",
    sentiment: interview.sentiment,
    evidenceNote: interview.evidenceNote?.trim() || "No interview evidence note recorded.",
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    customerInterviews: [record, ...venture.customerInterviews].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVentureOutreachApproval(
  ownerKey: string,
  ventureId: string,
  approval: {
    sourceInterviewId?: string;
    contactPersona?: string;
    channel?: string;
    messageDraft: string;
    status: VentureOutreachApprovalStatus;
    riskNote?: string;
    nextAction?: string;
    attribution?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const messageDraft = approval.messageDraft.trim();
  if (!messageDraft) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const sourceInterview = approval.sourceInterviewId
    ? venture.customerInterviews.find((interview) => interview.id === approval.sourceInterviewId)
    : venture.customerInterviews[0];
  const record: VentureOutreachApprovalRecord = {
    id: createOutreachApprovalId(ventureId, now),
    createdAt: now,
    sourceInterviewId: sourceInterview?.id,
    approvalLevel: "Human-approved outreach",
    status: approval.status,
    contactPersona: approval.contactPersona?.trim() || sourceInterview?.persona || venture.targetBuyer,
    channel: approval.channel?.trim() || sourceInterview?.channel || "manual outreach",
    messageDraft,
    riskNote: approval.riskNote?.trim() || "No outreach risk note recorded.",
    nextAction: approval.nextAction?.trim() || "Manual review before any buyer contact leaves the app.",
    attribution: approval.attribution?.trim() || safeOwner(ownerKey),
    externalSendStatus: "not-sent",
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    outreachApprovals: [record, ...venture.outreachApprovals].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function buildVentureRiskCandidates(venture: SavedVentureWorkspace): VentureRiskCandidate[] {
  const recordedSourceKeys = new Set(
    venture.riskRecords
      .map((record) => riskSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureRiskCandidate[] = [];
  const pushCandidate = (candidate: VentureRiskCandidate) => {
    const sourceKey = riskSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (recordedSourceKeys.has(sourceKey) || !hasMeaningfulRiskText(candidate.detail)) return;
    candidates.push(candidate);
  };

  venture.customerInterviews.forEach((interview) => {
    pushCandidate({
      id: `${venture.id}-risk-candidate-interview-${interview.id}`,
      sourceType: "customer-interview",
      sourceRecordId: interview.id,
      title: `Customer objection: ${interview.persona}`,
      detail: interview.objections,
      suggestedSeverity: inferRiskSeverity(interview.objections),
      suggestedOwner: "founder",
      suggestedMitigation: `Resolve the objection with ${interview.persona} before scaling ${venture.title}.`,
    });
  });

  venture.outreachApprovals.forEach((approval) => {
    pushCandidate({
      id: `${venture.id}-risk-candidate-outreach-${approval.id}`,
      sourceType: "outreach-approval",
      sourceRecordId: approval.id,
      title: `Outreach risk: ${approval.contactPersona}`,
      detail: approval.riskNote,
      suggestedSeverity: inferRiskSeverity(approval.riskNote),
      suggestedOwner: approval.attribution || "founder",
      suggestedMitigation: `Review the ${approval.channel} draft and consent path before any external send.`,
    });
  });

  venture.gapActionHistory
    .filter((action) => action.status === "completed" && action.outcome)
    .forEach((action) => {
      pushCandidate({
        id: `${venture.id}-risk-candidate-gap-${action.id}`,
        sourceType: "gap-outcome",
        sourceRecordId: action.id,
        title: `Gap outcome risk: ${action.title}`,
        detail: action.outcome ?? "",
        suggestedSeverity: inferRiskSeverity(action.outcome ?? ""),
        suggestedOwner: "operator",
        suggestedMitigation: "Update the kill/continue decision before new build, spend, or outreach work.",
      });
    });

  return candidates;
}

export function recordVentureRisk(
  ownerKey: string,
  ventureId: string,
  risk: {
    sourceType: VentureRiskSourceType;
    sourceRecordId?: string;
    title: string;
    detail: string;
    severity: VentureRiskSeverity;
    status: VentureRiskStatus;
    owner: string;
    mitigation: string;
    resolutionEvidence?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const title = risk.title.trim();
  const detail = risk.detail.trim();
  const owner = risk.owner.trim();
  const mitigation = risk.mitigation.trim();
  if (!title || !detail || !owner || !mitigation) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureRiskRecord = {
    id: createRiskRecordId(ventureId, now),
    createdAt: now,
    sourceType: risk.sourceType,
    sourceRecordId: risk.sourceRecordId,
    title,
    detail,
    severity: risk.severity,
    status: risk.status,
    owner,
    mitigation,
    resolutionEvidence: risk.resolutionEvidence?.trim() || "Not resolved yet.",
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    riskRecords: [record, ...venture.riskRecords].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVentureMvpBuildWorkspace(
  ownerKey: string,
  ventureId: string,
  build: {
    status: VentureMvpBuildStatus;
    owner: string;
    repoPath?: string;
    setupCommand?: string;
    typecheckCommand?: string;
    testCommand?: string;
    buildCommand?: string;
    browserSmokeCommand?: string;
    deploymentCommand?: string;
    setupCheck: VentureMvpCheckStatus;
    typecheckCheck: VentureMvpCheckStatus;
    unitTestCheck: VentureMvpCheckStatus;
    buildCheck: VentureMvpCheckStatus;
    browserSmokeCheck: VentureMvpCheckStatus;
    deploymentCheck: VentureMvpCheckStatus;
    verificationNotes?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const owner = build.owner.trim();
  if (!owner) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const repoPath = build.repoPath?.trim() || VENTURE_NO_MVP_SOURCE_ATTACHED;
  const repoRequired = build.status === "repo-attached" || build.status === "checks-running" || build.status === "executable";
  if (repoRequired && !hasAttachedMvpRepo(repoPath)) return null;

  const executableChecks = [
    build.setupCheck,
    build.typecheckCheck,
    build.unitTestCheck,
    build.buildCheck,
    build.browserSmokeCheck,
  ];
  if (build.status === "executable" && executableChecks.some((status) => status !== "passed")) {
    return null;
  }

  const record: VentureMvpBuildWorkspaceRecord = {
    id: createMvpBuildWorkspaceId(ventureId, now),
    createdAt: now,
    updatedAt: now,
    status: build.status,
    owner,
    sourceCodeStatus: hasAttachedMvpRepo(repoPath)
      ? `Generated source attached: ${repoPath}`
      : venture.mvpHandoff.sourceCodeStatus,
    repoPath,
    setupInstructions: venture.mvpHandoff.setupInstructions,
    setupCommand: build.setupCommand?.trim() || "pnpm install --frozen-lockfile",
    typecheckCommand: build.typecheckCommand?.trim() || "pnpm type-check",
    testCommand: build.testCommand?.trim() || "pnpm test -- src/lib/venture-portfolio.test.ts",
    buildCommand: build.buildCommand?.trim() || "pnpm build",
    browserSmokeCommand: build.browserSmokeCommand?.trim() || "pnpm exec playwright test e2e/app.spec.ts -g \"core demo flow\"",
    deploymentCommand: build.deploymentCommand?.trim() || "No deployment command approved yet.",
    deploymentPath: venture.mvpHandoff.deploymentPath,
    analyticsPlan: venture.mvpHandoff.analyticsPlan,
    securityNotes: venture.mvpHandoff.securityNotes,
    accessibilityPass: venture.mvpHandoff.accessibilityPass,
    mobileBehavior: venture.mvpHandoff.mobileBehavior,
    dataModel: venture.mvpHandoff.dataModel,
    operatorDashboard: venture.mvpHandoff.operatorDashboard,
    evidenceBacklink: venture.mvpHandoff.evidenceBacklink,
    setupCheck: build.setupCheck,
    typecheckCheck: build.typecheckCheck,
    unitTestCheck: build.unitTestCheck,
    buildCheck: build.buildCheck,
    browserSmokeCheck: build.browserSmokeCheck,
    deploymentCheck: build.deploymentCheck,
    verificationNotes: build.verificationNotes?.trim() || "No MVP workspace verification notes recorded.",
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    lifecycleStatus: build.status === "repo-attached" || build.status === "checks-running" || build.status === "executable"
      ? "building"
      : venture.lifecycleStatus,
    reviewCadence: build.status === "repo-attached" || build.status === "checks-running" || build.status === "executable"
      ? reviewCadenceForStatus("building")
      : venture.reviewCadence,
    mvpBuildWorkspaces: [record, ...venture.mvpBuildWorkspaces].slice(0, 50),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVentureArtifact(
  ownerKey: string,
  ventureId: string,
  artifact: {
    artifactType: VentureArtifactType;
    status: VentureArtifactStatus;
    title: string;
    uri?: string;
    owner: string;
    verificationCommand?: string;
    evidence?: string;
    changeSummary?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const title = artifact.title.trim();
  const owner = artifact.owner.trim();
  const evidence = artifact.evidence?.trim() || "";
  const changeSummary = artifact.changeSummary?.trim() || "";
  const uri = artifact.uri?.trim() || VENTURE_NO_ARTIFACT_URI_ATTACHED;
  if (!title || !owner) return null;

  const requiresAttachedEvidence = artifact.status === "attached" || artifact.status === "verified";
  if (requiresAttachedEvidence && !evidence && uri === VENTURE_NO_ARTIFACT_URI_ATTACHED) return null;
  if ((artifact.artifactType === "source-repo" || artifact.artifactType === "deployment-proof") && requiresAttachedEvidence && uri === VENTURE_NO_ARTIFACT_URI_ATTACHED) {
    return null;
  }
  if (artifact.status === "verified" && !artifact.verificationCommand?.trim() && !evidence) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureArtifactRecord = {
    id: createArtifactRecordId(ventureId, artifact.artifactType, now),
    createdAt: now,
    updatedAt: now,
    artifactType: artifact.artifactType,
    status: artifact.status,
    title,
    uri,
    linkedMvpBuildWorkspaceId: venture.mvpBuildWorkspaces[0]?.id,
    owner,
    verificationCommand: artifact.verificationCommand?.trim() || "No verification command recorded.",
    evidence: evidence || "No artifact evidence recorded.",
    changeSummary: changeSummary || "No changelog summary recorded.",
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    artifactRecords: [record, ...venture.artifactRecords].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

function isVerifierResult(value: unknown): value is VentureGeneratedAppVerifierCommandResult {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return (
    typeof record.command === "string" &&
    typeof record.ok === "boolean" &&
    (typeof record.status === "number" || typeof record.status === "string" || record.status === null || typeof record.status === "undefined") &&
    typeof record.durationMs === "number" &&
    typeof record.stdout === "string" &&
    typeof record.stderr === "string"
  );
}

function normalizeVerifierReport(value: unknown): VentureGeneratedAppVerifierReport | null {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  if (
    typeof record.scaffoldId !== "string" ||
    typeof record.ventureId !== "string" ||
    typeof record.appName !== "string" ||
    typeof record.target !== "string" ||
    typeof record.fileCount !== "number" ||
    typeof record.ok !== "boolean" ||
    !Array.isArray(record.results) ||
    !record.results.every(isVerifierResult)
  ) {
    return null;
  }
  return {
    scaffoldId: record.scaffoldId,
    ventureId: record.ventureId,
    appName: record.appName,
    target: record.target,
    fileCount: record.fileCount,
    ok: record.ok,
    results: record.results,
  };
}

export function parseVentureGeneratedAppVerifierReport(raw: string): VentureGeneratedAppVerifierReport | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidateStarts = [0];
  for (let index = 0; index < trimmed.length; index += 1) {
    if (trimmed[index] === "{" && index !== 0) {
      candidateStarts.push(index);
    }
  }

  for (const start of candidateStarts) {
    try {
      const parsed: unknown = JSON.parse(trimmed.slice(start));
      const normalized = normalizeVerifierReport(parsed);
      if (normalized) return normalized;
    } catch {
      // Keep scanning; generated-app:verify prints command lines before its final JSON report.
    }
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    const normalized = normalizeVerifierReport(parsed);
    if (normalized) return normalized;
  } catch {
    return null;
  }

  return null;
}

function verifierResultStatus(report: VentureGeneratedAppVerifierReport, pattern: RegExp): VentureMvpCheckStatus {
  const result = report.results.find((item) => pattern.test(item.command));
  if (!result) return "pending";
  return result.ok ? "passed" : "failed";
}

export function recordVentureGeneratedAppVerifierReport(
  ownerKey: string,
  ventureId: string,
  rawReport: string,
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const report = parseVentureGeneratedAppVerifierReport(rawReport);
  if (!report || report.ventureId !== ventureId || !report.target.trim()) return null;

  const setupCheck = verifierResultStatus(report, /pnpm\s+install\b/);
  const typecheckCheck = verifierResultStatus(report, /type-check/);
  const unitTestCheck = verifierResultStatus(report, /pnpm\s+test\b/);
  const buildCheck = verifierResultStatus(report, /pnpm\s+build\b/);
  const browserSmokeCheck = verifierResultStatus(report, /browser-smoke/);
  const passedCheckCount = [setupCheck, typecheckCheck, unitTestCheck, buildCheck, browserSmokeCheck]
    .filter((status) => status === "passed").length;
  const mvpStatus: VentureMvpBuildStatus = report.ok && passedCheckCount === 5
    ? "executable"
    : report.results.some((result) => !result.ok)
      ? "blocked"
      : "checks-running";
  const summary = `Generated app verifier ${report.ok ? "passed" : "failed"} for ${report.appName}: ${passedCheckCount}/5 executable checks passed.`;
  const updatedWithWorkspace = recordVentureMvpBuildWorkspace(
    ownerKey,
    ventureId,
    {
      status: mvpStatus,
      owner: "generated-app-verifier",
      repoPath: report.target,
      setupCommand: report.results.find((result) => /pnpm\s+install\b/.test(result.command))?.command ?? "pnpm install",
      typecheckCommand: report.results.find((result) => /type-check/.test(result.command))?.command ?? "pnpm type-check",
      testCommand: report.results.find((result) => /pnpm\s+test\b/.test(result.command))?.command ?? "pnpm test",
      buildCommand: report.results.find((result) => /pnpm\s+build\b/.test(result.command))?.command ?? "pnpm build",
      browserSmokeCommand: report.results.find((result) => /browser-smoke/.test(result.command))?.command ?? "pnpm browser-smoke",
      setupCheck,
      typecheckCheck,
      unitTestCheck,
      buildCheck,
      browserSmokeCheck,
      deploymentCheck: "blocked",
      verificationNotes: summary,
    },
    storage,
    now,
  );
  if (!updatedWithWorkspace) return null;

  return recordVentureArtifact(
    ownerKey,
    ventureId,
    {
      artifactType: "test-report",
      status: report.ok ? "verified" : "blocked",
      title: `Generated app verifier report: ${report.appName}`,
      uri: report.target,
      owner: "generated-app-verifier",
      verificationCommand: "pnpm generated-app:verify",
      evidence: summary,
      changeSummary: `Verifier report ${report.ok ? "attached" : "captured with failures"} from ${report.fileCount} generated files.`,
    },
    storage,
    now,
  ) ?? updatedWithWorkspace;
}

export function recordVentureMoneySignal(
  ownerKey: string,
  ventureId: string,
  signal: {
    type: VentureMoneySignalType;
    status: VentureMoneySignalStatus;
    amountCents: number;
    currency?: string;
    source: string;
    owner: string;
    evidence?: string;
    notes?: string;
    linkedExperimentId?: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const amountCents = normalizeAmountCents(signal.amountCents);
  const source = signal.source.trim();
  const owner = signal.owner.trim();
  if (amountCents <= 0 || !source || !owner) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const moneySignalText = `${signal.type} ${signal.source} ${signal.evidence ?? ""} ${signal.notes ?? ""}`;
  const preferredExperimentPattern = /\b(pricing|paid|invoice|revenue|commitment|pilot|billing)\b/i.test(moneySignalText)
    ? /pricing|paid|invoice/i
    : /pricing|paid|invoice|waitlist|fake-door/i;
  const linkedExperiment = signal.linkedExperimentId
    ? venture.experiments.find((experiment) => experiment.id === signal.linkedExperimentId)
    : venture.experiments.find((experiment) => preferredExperimentPattern.test(`${experiment.id} ${experiment.type}`));
  const approvalLevel = moneyApprovalLevelFor(signal.type);
  const approvalState = moneyApprovalStateFor(signal.status);
  const externalActionState = moneyExternalActionStateFor(signal.type, signal.status);

  const record: VentureMoneySignalRecord = {
    id: createMoneySignalId(ventureId, signal.type, now),
    recordedAt: now,
    type: signal.type,
    status: signal.status,
    amountCents,
    currency: signal.currency?.trim().toUpperCase() || "USD",
    source,
    owner,
    evidence: signal.evidence?.trim() || "No money evidence recorded.",
    notes: signal.notes?.trim() || "No finance note recorded.",
    linkedExperimentId: linkedExperiment?.id,
    externalBillingStatus: "not-charged",
    approvalLevel,
    approvalState,
    externalActionState,
    approvalNextAction: moneyApprovalNextActionFor(signal.type, signal.status),
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    moneySignals: [record, ...venture.moneySignals].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function buildVentureRoadmapCandidates(venture: SavedVentureWorkspace): VentureRoadmapTaskCandidate[] {
  const recordedSourceKeys = new Set(
    venture.roadmapTasks
      .map((record) => roadmapSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureRoadmapTaskCandidate[] = [];
  const pushCandidate = (candidate: VentureRoadmapTaskCandidate) => {
    const sourceKey = roadmapSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (recordedSourceKeys.has(sourceKey)) return;
    candidates.push(candidate);
  };

  venture.customerInterviews
    .filter((interview) => interview.requestedFeatures !== "No feature requests recorded.")
    .forEach((interview) => {
      pushCandidate({
        id: `${venture.id}-roadmap-candidate-feature-${interview.id}`,
        sourceType: "customer-feature",
        sourceRecordId: interview.id,
        title: `Feature request: ${interview.persona}`,
        detail: interview.requestedFeatures,
        suggestedPriority: interview.sentiment === "positive" ? "medium" : "low",
        suggestedOwner: "product",
        supportLoad: `Validate whether ${interview.persona} needs support before automation.`,
        riskReduction: "Turns buyer-requested functionality into a scoped product task.",
        nextAction: "Estimate the smallest workflow slice and attach it to the next MVP artifact.",
      });
    });

  venture.riskRecords
    .filter((risk) => risk.status === "open" || risk.status === "monitoring" || risk.status === "mitigating")
    .forEach((risk) => {
      pushCandidate({
        id: `${venture.id}-roadmap-candidate-risk-${risk.id}`,
        sourceType: "risk-mitigation",
        sourceRecordId: risk.id,
        title: `Mitigate risk: ${risk.title}`,
        detail: risk.mitigation,
        suggestedPriority: risk.severity === "critical" || risk.severity === "high" ? "high" : "medium",
        suggestedOwner: risk.owner,
        supportLoad: "Prevents the same risk from becoming repeated support work.",
        riskReduction: risk.resolutionEvidence,
        nextAction: "Convert mitigation into a concrete product, policy, or experiment task.",
      });
    });

  venture.mvpBuildWorkspaces
    .filter((workspace) => workspace.status === "blocked" || [
      workspace.setupCheck,
      workspace.typecheckCheck,
      workspace.unitTestCheck,
      workspace.buildCheck,
      workspace.browserSmokeCheck,
      workspace.deploymentCheck,
    ].some((status) => status === "failed" || status === "blocked"))
    .forEach((workspace) => {
      pushCandidate({
        id: `${venture.id}-roadmap-candidate-mvp-${workspace.id}`,
        sourceType: "mvp-blocker",
        sourceRecordId: workspace.id,
        title: `Unblock MVP workspace: ${workspace.status}`,
        detail: workspace.verificationNotes,
        suggestedPriority: "high",
        suggestedOwner: workspace.owner,
        supportLoad: "Keeps setup, test, build, browser, and deployment failures visible before launch.",
        riskReduction: "Reduces the chance of treating a blocked handoff as executable.",
        nextAction: "Resolve failed or blocked checks, then attach updated artifact evidence.",
      });
    });

  venture.artifactRecords
    .filter((artifact) => artifact.status === "blocked")
    .forEach((artifact) => {
      pushCandidate({
        id: `${venture.id}-roadmap-candidate-artifact-${artifact.id}`,
        sourceType: "artifact-blocker",
        sourceRecordId: artifact.id,
        title: `Unblock artifact: ${artifact.title}`,
        detail: artifact.evidence,
        suggestedPriority: "high",
        suggestedOwner: artifact.owner,
        supportLoad: "Keeps artifact gaps from leaking into deployment or support work.",
        riskReduction: artifact.changeSummary,
        nextAction: "Attach the missing artifact URI or mark the artifact superseded.",
      });
    });

  buildVentureDeploymentEnvironmentMatrix(venture).targets
    .filter((target) => target.status !== "ready")
    .forEach((target) => {
      pushCandidate({
        id: `${venture.id}-roadmap-candidate-deployment-${target.id}`,
        sourceType: "deployment-promotion",
        sourceRecordId: `${venture.id}-deployment-environment-${target.id}`,
        title: `Deployment promotion blocker: ${target.label}`,
        detail: `${target.proofSummary} ${target.approvalBoundary}`,
        suggestedPriority: target.id === "production" || target.status === "blocked" ? "high" : "medium",
        suggestedOwner: "release-owner",
        supportLoad: `Keeps ${target.label.toLowerCase()} promotion proof from becoming launch or support ambiguity.`,
        riskReduction: target.requiredProof.join(" "),
        nextAction: target.nextAction,
      });
    });

  return candidates;
}

export function recordVentureRoadmapTask(
  ownerKey: string,
  ventureId: string,
  task: {
    sourceType: VentureRoadmapSourceType;
    sourceRecordId?: string;
    title: string;
    detail: string;
    priority: VentureRoadmapTaskPriority;
    status: VentureRoadmapTaskStatus;
    owner: string;
    supportLoad?: string;
    riskReduction?: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const title = task.title.trim();
  const detail = task.detail.trim();
  const owner = task.owner.trim();
  const nextAction = task.nextAction.trim();
  if (!title || !detail || !owner || !nextAction) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureRoadmapTaskRecord = {
    id: createRoadmapTaskId(ventureId, task.sourceType, now),
    createdAt: now,
    sourceType: task.sourceType,
    sourceRecordId: task.sourceRecordId,
    title,
    detail,
    priority: task.priority,
    status: task.status,
    owner,
    supportLoad: task.supportLoad?.trim() || "No support-load note recorded.",
    riskReduction: task.riskReduction?.trim() || "No risk-reduction note recorded.",
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    roadmapTasks: [record, ...venture.roadmapTasks].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function updateVentureRoadmapTaskStatus(
  ownerKey: string,
  ventureId: string,
  taskId: string,
  status: VentureRoadmapTaskStatus,
  nextAction?: string,
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const id = taskId.trim();
  if (!id) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  const task = venture?.roadmapTasks.find((item) => item.id === id);
  if (!venture || !task) return null;

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    roadmapTasks: venture.roadmapTasks.map((item) => item.id === id
      ? {
        ...item,
        status,
        nextAction: nextAction?.trim() || item.nextAction,
      }
      : item),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function buildVentureSupportIssueCandidates(venture: SavedVentureWorkspace): VentureSupportIssueCandidate[] {
  const recordedSourceKeys = new Set(
    venture.supportIssues
      .map((record) => supportIssueSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureSupportIssueCandidate[] = [];
  const pushCandidate = (candidate: VentureSupportIssueCandidate) => {
    const sourceKey = supportIssueSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (recordedSourceKeys.has(sourceKey) || !hasMeaningfulSupportText(candidate.detail)) return;
    candidates.push(candidate);
  };

  venture.customerInterviews.forEach((interview) => {
    const detailParts = [
      hasMeaningfulSupportText(interview.objections) ? `Objection: ${interview.objections}` : "",
      hasMeaningfulSupportText(interview.requestedFeatures) ? `Requested feature: ${interview.requestedFeatures}` : "",
    ].filter(Boolean);
    pushCandidate({
      id: `${venture.id}-support-candidate-interview-${interview.id}`,
      sourceType: "customer-interview",
      sourceRecordId: interview.id,
      issueType: "support-question",
      title: `Support question: ${interview.persona}`,
      detail: detailParts.join(" "),
      suggestedSeverity: inferSupportIssueSeverity(`${interview.objections} ${interview.requestedFeatures}`),
      suggestedStatus: "triaged",
      suggestedOwner: "customer success",
      customerImpact: interview.painQuote,
      supportLoad: `Answer ${interview.persona}'s concern before converting more ${venture.targetBuyer}.`,
      retentionRisk: interview.sentiment === "negative"
        ? "Negative interview sentiment can become immediate churn risk."
        : "Unresolved customer questions can slow activation and repeat usage.",
      nextAction: "Write the concierge answer, test it in the next customer conversation, and attach the result here.",
    });
  });

  venture.roadmapTasks
    .filter((task) => (
      task.status === "queued" ||
      task.status === "in-progress" ||
      task.status === "blocked"
    ) && hasMeaningfulSupportText(task.supportLoad))
    .forEach((task) => {
      pushCandidate({
        id: `${venture.id}-support-candidate-roadmap-${task.id}`,
        sourceType: "roadmap-task",
        sourceRecordId: task.id,
        issueType: "pilot-issue",
        title: `Pilot issue: ${task.title}`,
        detail: task.detail,
        suggestedSeverity: task.status === "blocked" || task.priority === "high"
          ? "high"
          : inferSupportIssueSeverity(`${task.supportLoad} ${task.riskReduction}`),
        suggestedStatus: task.status === "in-progress" ? "in-progress" : "triaged",
        suggestedOwner: task.owner,
        customerImpact: task.riskReduction,
        supportLoad: task.supportLoad,
        retentionRisk: hasMeaningfulSupportText(task.riskReduction)
          ? task.riskReduction
          : "Pilot support work is not yet tied to retention evidence.",
        nextAction: task.nextAction,
      });
    });

  venture.mvpBuildWorkspaces
    .filter((workspace) => workspace.status === "blocked" || [
      workspace.setupCheck,
      workspace.typecheckCheck,
      workspace.unitTestCheck,
      workspace.buildCheck,
      workspace.browserSmokeCheck,
      workspace.deploymentCheck,
    ].some((status) => status === "failed" || status === "blocked"))
    .forEach((workspace) => {
      const failedChecks = [
        ["setup", workspace.setupCheck],
        ["typecheck", workspace.typecheckCheck],
        ["unit test", workspace.unitTestCheck],
        ["build", workspace.buildCheck],
        ["browser smoke", workspace.browserSmokeCheck],
        ["deployment", workspace.deploymentCheck],
      ].filter(([, status]) => status === "failed" || status === "blocked")
        .map(([label]) => label)
        .join(", ");
      pushCandidate({
        id: `${venture.id}-support-candidate-mvp-${workspace.id}`,
        sourceType: "mvp-workspace",
        sourceRecordId: workspace.id,
        issueType: "onboarding-friction",
        title: `MVP handoff issue: ${workspace.status}`,
        detail: workspace.verificationNotes,
        suggestedSeverity: "high",
        suggestedStatus: "open",
        suggestedOwner: workspace.owner,
        customerImpact: failedChecks
          ? `Cannot confidently pilot while ${failedChecks} checks are unresolved.`
          : "Cannot confidently pilot while MVP handoff is blocked.",
        supportLoad: "Founder or pilot customer would need manual help to set up, verify, or use the MVP.",
        retentionRisk: "A broken first-run handoff can erase activation before retention can be measured.",
        nextAction: "Resolve failed or blocked checks and attach updated verification evidence.",
      });
    });

  buildVentureDeploymentEnvironmentMatrix(venture).targets
    .filter((target) => target.status !== "ready")
    .forEach((target) => {
      pushCandidate({
        id: `${venture.id}-support-candidate-deployment-${target.id}`,
        sourceType: "deployment-promotion",
        sourceRecordId: `${venture.id}-deployment-environment-${target.id}`,
        issueType: target.id === "production" ? "retention-risk" : "pilot-issue",
        title: `Deployment support risk: ${target.label}`,
        detail: `${target.proofSummary} ${target.approvalBoundary}`,
        suggestedSeverity: target.id === "production" || target.status === "blocked" ? "high" : "medium",
        suggestedStatus: "triaged",
        suggestedOwner: "support-owner",
        customerImpact: target.id === "production"
          ? "Production users must not be exposed to an environment without proof and human approval."
          : `${target.label} reviewers need clear proof before trusting this release path.`,
        supportLoad: `Manual operator support would be needed if ${target.label.toLowerCase()} promotion happens without the required proof.`,
        retentionRisk: target.requiredProof.join(" "),
        nextAction: target.nextAction,
      });
    });

  const issueOrder: Record<VentureSupportIssueType, number> = {
    "pilot-issue": 0,
    "retention-risk": 1,
    "onboarding-friction": 2,
    "support-question": 3,
    "manual-workaround": 4,
    bug: 5,
  };

  return candidates.sort((a, b) => issueOrder[a.issueType] - issueOrder[b.issueType]);
}

export function recordVentureSupportIssue(
  ownerKey: string,
  ventureId: string,
  issue: {
    issueType: VentureSupportIssueType;
    severity: VentureSupportIssueSeverity;
    status: VentureSupportIssueStatus;
    sourceType: VentureSupportIssueSourceType;
    sourceRecordId?: string;
    title: string;
    detail: string;
    customerImpact?: string;
    supportLoad?: string;
    retentionRisk?: string;
    owner: string;
    resolution?: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const title = issue.title.trim();
  const detail = issue.detail.trim();
  const owner = issue.owner.trim();
  const nextAction = issue.nextAction.trim();
  if (!title || !detail || !owner || !nextAction) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureSupportIssueRecord = {
    id: createSupportIssueId(ventureId, issue.issueType, now),
    createdAt: now,
    issueType: issue.issueType,
    severity: issue.severity,
    status: issue.status,
    sourceType: issue.sourceType,
    sourceRecordId: issue.sourceRecordId,
    title,
    detail,
    customerImpact: issue.customerImpact?.trim() || "No customer-impact note recorded.",
    supportLoad: issue.supportLoad?.trim() || "No support-load note recorded.",
    retentionRisk: issue.retentionRisk?.trim() || "No retention-risk note recorded.",
    owner,
    resolution: issue.resolution?.trim() || "Not resolved yet.",
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    supportIssues: [record, ...venture.supportIssues].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function updateVentureSupportIssueStatus(
  ownerKey: string,
  ventureId: string,
  issueId: string,
  status: VentureSupportIssueStatus,
  resolution?: string,
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const id = issueId.trim();
  if (!id) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  const issue = venture?.supportIssues.find((item) => item.id === id);
  if (!venture || !issue) return null;

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    supportIssues: venture.supportIssues.map((item) => item.id === id
      ? {
        ...item,
        status,
        resolution: resolution?.trim() || item.resolution,
      }
      : item),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function buildVentureActivationCohortCandidates(venture: SavedVentureWorkspace): VentureActivationCohortCandidate[] {
  const recordedSourceKeys = new Set(
    venture.activationCohorts
      .map((record) => activationCohortSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureActivationCohortCandidate[] = [];
  const pushCandidate = (candidate: VentureActivationCohortCandidate) => {
    const sourceKey = activationCohortSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (recordedSourceKeys.has(sourceKey)) return;
    candidates.push(candidate);
  };

  venture.experiments
    .filter((experiment) => experiment.result.trim() && experiment.result !== "Not run yet.")
    .forEach((experiment) => {
      const text = `${experiment.result} ${experiment.interpretation} ${experiment.nextAction}`;
      const signupCount = extractFirstCount(text, /\b(\d[\d,]*)\s+(?:qualified\s+)?(?:signup|signups|waitlist|leads|users|visitors converted)\b/i);
      const activatedCount = extractFirstCount(text, /\b(\d[\d,]*)\s+(?:activated|activation|completed onboarding|used|started|ran)\b/i);
      const retainedCount = extractFirstCount(text, /\b(\d[\d,]*)\s+(?:retained|returned|week[- ]?two|repeat|came back)\b/i);
      const paidCount = extractFirstCount(text, /\b(\d[\d,]*)\s+(?:paid|commitments|invoices|invoice requests|customers)\b/i);
      pushCandidate({
        id: `${venture.id}-cohort-candidate-experiment-${experiment.id}`,
        sourceType: "experiment-result",
        sourceRecordId: experiment.id,
        cohortLabel: `${experiment.type} cohort`,
        suggestedOwner: "growth",
        acquisitionChannel: experiment.channel || venture.acquisitionChannels[0] || "manual",
        activationEvent: experiment.metrics[0] || "Activation event not defined.",
        retentionWindow: venture.retentionMechanism || "Retention window not defined.",
        signupCount,
        activatedCount,
        retainedCount,
        paidCount,
        revenueCents: 0,
        supportIssueCount: venture.supportIssues.filter((issue) => issue.status !== "resolved" && issue.status !== "dismissed").length,
        evidence: experiment.result,
        learning: experiment.interpretation,
        nextAction: experiment.nextAction,
      });
    });

  venture.moneySignals
    .filter((signal) => signal.type === "commitment" || signal.type === "revenue")
    .forEach((signal) => {
      pushCandidate({
        id: `${venture.id}-cohort-candidate-money-${signal.id}`,
        sourceType: "money-signal",
        sourceRecordId: signal.id,
        cohortLabel: `Revenue cohort: ${signal.source}`,
        suggestedOwner: signal.owner,
        acquisitionChannel: "paid or founder-led",
        activationEvent: "Paid intent recorded.",
        retentionWindow: venture.retentionMechanism || "Retention window not defined.",
        signupCount: 0,
        activatedCount: 0,
        retainedCount: 0,
        paidCount: signal.status === "committed" || signal.status === "received" ? 1 : 0,
        revenueCents: signal.amountCents,
        supportIssueCount: venture.supportIssues.filter((issue) => issue.issueType === "pilot-issue").length,
        evidence: signal.evidence,
        learning: signal.notes,
        nextAction: "Connect the paid signal to activation and retention evidence before scaling spend.",
      });
    });

  const pilotGate = buildVenturePilotCohortSignalGate(venture);
  if (pilotGate.status === "ready" && venture.activationCohorts.length === 0) {
    const paidPricingSignalCount = venture.pricingSignals.reduce((sum, signal) => (
      sum + signal.paidCommitmentCount + signal.invoiceRequestCount
    ), 0);
    const qualifiedBuyerCount = venture.pricingSignals.reduce((sum, signal) => sum + signal.qualifiedBuyerCount, 0);
    const committedMoneySignals = venture.moneySignals.filter((signal) => (
      (signal.type === "commitment" && (signal.status === "committed" || signal.status === "received")) ||
      (signal.type === "revenue" && (signal.status === "committed" || signal.status === "received"))
    ));
    const positiveInterviewCount = venture.customerInterviews.filter((interview) => interview.sentiment === "positive").length;
    const signupCount = Math.max(qualifiedBuyerCount, paidPricingSignalCount, committedMoneySignals.length, positiveInterviewCount);
    const paidCount = Math.min(signupCount, Math.max(paidPricingSignalCount, committedMoneySignals.length));
    const revenueCents = committedMoneySignals.reduce((sum, signal) => sum + signal.amountCents, 0);

    pushCandidate({
      id: `${venture.id}-cohort-candidate-${pilotGate.id}`,
      sourceType: "pilot-signal-gate",
      sourceRecordId: pilotGate.id,
      cohortLabel: `${pilotGate.cohortLabel} onboarding proof`,
      suggestedOwner: pilotGate.owner,
      acquisitionChannel: "local-only pilot signal gate",
      activationEvent: `Observed local onboarding for ${pilotGate.appName}; replace staged counts with measured users before saving.`,
      retentionWindow: venture.retentionMechanism || "First retention window after local pilot onboarding.",
      signupCount,
      activatedCount: paidCount,
      retainedCount: 0,
      paidCount,
      revenueCents,
      supportIssueCount: venture.supportIssues.filter((issue) => issue.status !== "resolved" && issue.status !== "dismissed").length,
      evidence: `Pilot onboarding proof staged from ${pilotGate.inboundSignalSource}. ${pilotGate.noSendBoundary} ${pilotGate.noDeployBoundary}`,
      learning: "Pilot signal gate has inbound proof but no saved activation cohort yet; save only after verifying local-only signup or activation counts.",
      nextAction: "Verify the local-only pilot signup and activation counts, save this activation cohort, then inspect the demand-capture proof queue.",
    });
  }

  venture.supportIssues
    .filter((issue) => issue.status === "open" || issue.status === "triaged" || issue.status === "in-progress")
    .forEach((issue) => {
      pushCandidate({
        id: `${venture.id}-cohort-candidate-support-${issue.id}`,
        sourceType: "support-issue",
        sourceRecordId: issue.id,
        cohortLabel: `Support burden cohort: ${issue.title}`,
        suggestedOwner: issue.owner,
        acquisitionChannel: "support inbox",
        activationEvent: issue.customerImpact,
        retentionWindow: issue.retentionRisk,
        signupCount: 0,
        activatedCount: 0,
        retainedCount: 0,
        paidCount: 0,
        revenueCents: 0,
        supportIssueCount: 1,
        evidence: issue.supportLoad,
        learning: issue.retentionRisk,
        nextAction: issue.nextAction,
      });
    });

  return candidates;
}

export function recordVentureActivationCohort(
  ownerKey: string,
  ventureId: string,
  cohort: {
    sourceType: VentureActivationCohortSourceType;
    sourceRecordId?: string;
    cohortLabel: string;
    acquisitionChannel?: string;
    activationEvent?: string;
    retentionWindow?: string;
    signupCount: number;
    activatedCount: number;
    retainedCount: number;
    paidCount: number;
    revenueCents?: number;
    supportIssueCount?: number;
    owner: string;
    evidence?: string;
    learning?: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const cohortLabel = cohort.cohortLabel.trim();
  const owner = cohort.owner.trim();
  const nextAction = cohort.nextAction.trim();
  if (!cohortLabel || !owner || !nextAction) return null;

  const signupCount = normalizeCount(cohort.signupCount);
  const activatedCount = boundedCount(cohort.activatedCount, signupCount || undefined);
  const retainedCount = boundedCount(cohort.retainedCount, activatedCount || signupCount || undefined);
  const paidCount = boundedCount(cohort.paidCount, signupCount || undefined);
  const revenueCents = normalizeAmountCents(cohort.revenueCents ?? 0);
  const supportIssueCount = normalizeCount(cohort.supportIssueCount ?? 0);
  const hasSignal = signupCount > 0 || activatedCount > 0 || retainedCount > 0 || paidCount > 0 || revenueCents > 0 ||
    supportIssueCount > 0 || cohort.evidence?.trim() || cohort.learning?.trim();
  if (!hasSignal) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureActivationCohortRecord = {
    id: createActivationCohortId(ventureId, now),
    recordedAt: now,
    sourceType: cohort.sourceType,
    sourceRecordId: cohort.sourceRecordId,
    cohortLabel,
    acquisitionChannel: cohort.acquisitionChannel?.trim() || venture.acquisitionChannels[0] || "manual",
    activationEvent: cohort.activationEvent?.trim() || "No activation event recorded.",
    retentionWindow: cohort.retentionWindow?.trim() || venture.retentionMechanism || "No retention window recorded.",
    signupCount,
    activatedCount,
    retainedCount,
    paidCount,
    revenueCents,
    supportIssueCount,
    owner,
    evidence: cohort.evidence?.trim() || "No cohort evidence recorded.",
    learning: cohort.learning?.trim() || "No cohort learning recorded.",
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    activationCohorts: [record, ...venture.activationCohorts].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function buildVentureChannelEconomicsCandidates(venture: SavedVentureWorkspace): VentureChannelEconomicsCandidate[] {
  const recordedSourceKeys = new Set(
    venture.channelEconomics
      .map((record) => channelEconomicsSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureChannelEconomicsCandidate[] = [];
  const pushCandidate = (candidate: VentureChannelEconomicsCandidate) => {
    const sourceKey = channelEconomicsSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (recordedSourceKeys.has(sourceKey)) return;
    candidates.push(candidate);
  };

  venture.activationCohorts.forEach((cohort) => {
    pushCandidate({
      id: `${venture.id}-channel-candidate-cohort-${cohort.id}`,
      sourceType: "activation-cohort",
      sourceRecordId: cohort.id,
      channel: cohort.acquisitionChannel,
      suggestedOwner: cohort.owner,
      spendCents: 0,
      impressions: 0,
      clicks: 0,
      signupCount: cohort.signupCount,
      activatedCount: cohort.activatedCount,
      paidCount: cohort.paidCount,
      revenueCents: cohort.revenueCents,
      evidence: cohort.evidence,
      nextAction: "Add acquisition spend or mark this channel as organic before scaling.",
    });
  });

  venture.moneySignals
    .filter((signal) => signal.type === "expense")
    .forEach((signal) => {
      pushCandidate({
        id: `${venture.id}-channel-candidate-money-${signal.id}`,
        sourceType: "money-signal",
        sourceRecordId: signal.id,
        channel: signal.source,
        suggestedOwner: signal.owner,
        spendCents: signal.amountCents,
        impressions: 0,
        clicks: 0,
        signupCount: 0,
        activatedCount: 0,
        paidCount: 0,
        revenueCents: 0,
        evidence: signal.evidence,
        nextAction: "Attach signups, activation, paid users, and revenue to this spend before repeating it.",
      });
    });

  return candidates;
}

export function recordVentureChannelEconomics(
  ownerKey: string,
  ventureId: string,
  economics: {
    sourceType: VentureChannelEconomicsSourceType;
    sourceRecordId?: string;
    channel: string;
    spendCents: number;
    impressions?: number;
    clicks?: number;
    signupCount: number;
    activatedCount: number;
    paidCount: number;
    revenueCents?: number;
    owner: string;
    evidence?: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const channel = economics.channel.trim();
  const owner = economics.owner.trim();
  const nextAction = economics.nextAction.trim();
  if (!channel || !owner || !nextAction) return null;

  const spendCents = normalizeAmountCents(economics.spendCents);
  const impressions = normalizeCount(economics.impressions ?? 0);
  const clicks = boundedCount(economics.clicks ?? 0, impressions || undefined);
  const signupCount = normalizeCount(economics.signupCount);
  const activatedCount = boundedCount(economics.activatedCount, signupCount || undefined);
  const paidCount = boundedCount(economics.paidCount, signupCount || undefined);
  const revenueCents = normalizeAmountCents(economics.revenueCents ?? 0);
  const hasSignal = spendCents > 0 || impressions > 0 || clicks > 0 || signupCount > 0 || activatedCount > 0 ||
    paidCount > 0 || revenueCents > 0 || economics.evidence?.trim();
  if (!hasSignal) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureChannelEconomicsRecord = {
    id: createChannelEconomicsId(ventureId, now),
    recordedAt: now,
    sourceType: economics.sourceType,
    sourceRecordId: economics.sourceRecordId,
    channel,
    spendCents,
    impressions,
    clicks,
    signupCount,
    activatedCount,
    paidCount,
    revenueCents,
    costPerSignupCents: divideCurrencyCents(spendCents, signupCount),
    cacCents: divideCurrencyCents(spendCents, paidCount),
    paybackStatus: paybackStatusFor(spendCents, revenueCents),
    owner,
    evidence: economics.evidence?.trim() || "No channel economics evidence recorded.",
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    channelEconomics: [record, ...venture.channelEconomics].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function buildVentureAutonomyAuditCandidates(
  venture: SavedVentureWorkspace,
  now = new Date().toISOString(),
): VentureAutonomyAuditCandidate[] {
  const recordedSourceIds = new Set(venture.autonomyAudit.map((record) => record.sourceRecordId).filter(Boolean));
  const candidates: VentureAutonomyAuditCandidate[] = [];
  const pushCandidate = (candidate: VentureAutonomyAuditCandidate) => {
    if (recordedSourceIds.has(candidate.sourceRecordId)) return;
    candidates.push(candidate);
  };
  const approvalLevelForGate = (level: string): VentureAutonomyApprovalLevel => {
    if (/read-only/i.test(level)) return "read-only-research";
    if (/draft artifact/i.test(level)) return "draft-artifact-generation";
    if (/local code/i.test(level)) return "local-code-generation";
    if (/local test/i.test(level)) return "local-test-execution";
    if (/human-approved deployment/i.test(level)) return "human-approved-deployment";
    if (/deployment proposal/i.test(level)) return "deployment-proposal";
    if (/outreach/i.test(level)) return "human-approved-outreach";
    if (/spend/i.test(level)) return "human-approved-spend";
    if (/billing/i.test(level)) return "human-approved-billing-change";
    return "deployment-proposal";
  };
  const auditStatusForApprovalGate = (status: string): VentureAutonomyAuditStatus => {
    if (status === "complete") return "approved";
    if (status === "blocked") return "blocked";
    return "proposed";
  };
  const sideEffectForApprovalGate = (approvalLevel: VentureAutonomyApprovalLevel, status: string): VentureAutonomySideEffect => {
    if (approvalLevel === "read-only-research") return "none";
    if (approvalLevel === "draft-artifact-generation" || approvalLevel === "local-code-generation" || approvalLevel === "local-test-execution") return "local-only";
    if (status === "complete") return "external-approved";
    if (approvalLevel === "deployment-proposal" && status === "available") return "external-proposed";
    return "external-blocked";
  };
  const approvalGatePriority = (level: VentureAutonomyApprovalLevel) => {
    if (level === "deployment-proposal") return 0;
    if (level === "human-approved-deployment") return 1;
    if (level.startsWith("human-approved")) return 2;
    if (level === "local-code-generation" || level === "local-test-execution") return 3;
    if (level === "draft-artifact-generation") return 4;
    return 5;
  };
  const autonomyBoundaryForArtifact = (artifact: VentureArtifactRecord): Pick<VentureAutonomyAuditCandidate, "approvalLevel" | "sideEffect" | "riskNote" | "nextAction"> | null => {
    if (artifact.artifactType === "deployment-proof") {
      return {
        approvalLevel: "deployment-proposal",
        sideEffect: artifact.status === "verified" ? "external-proposed" : "external-blocked",
        riskNote: artifact.changeSummary,
        nextAction: artifact.status === "verified" ? "Keep deployment proof attached, but require human approval before external execution." : "Verify or supersede the deployment proof before external use.",
      };
    }
    if (artifact.artifactType === "source-repo") {
      return {
        approvalLevel: "local-code-generation",
        sideEffect: "local-only",
        riskNote: "Generated source is local-only until tests pass and a separate human deployment approval exists.",
        nextAction: artifact.status === "verified" ? "Keep generated source evidence and verification command attached before deployment review." : "Review generated code locally; do not deploy until tests and human deployment approval exist.",
      };
    }
    if (artifact.artifactType === "test-report" || artifact.artifactType === "browser-smoke") {
      return {
        approvalLevel: "local-test-execution",
        sideEffect: "local-only",
        riskNote: "Local verification may read local files or run local services, but must not deploy, spend, contact users, or mutate external systems.",
        nextAction: artifact.status === "verified" ? "Keep the local verification command replayable with the artifact evidence." : "Run or rerun local verification before promotion.",
      };
    }
    if (artifact.artifactType === "build-brief") {
      return {
        approvalLevel: "draft-artifact-generation",
        sideEffect: "local-only",
        riskNote: artifact.changeSummary,
        nextAction: artifact.status === "verified" ? "Keep verification evidence attached." : "Verify or supersede the artifact before external use.",
      };
    }
    return null;
  };

  venture.approvals
    .map((approval, index) => ({ approval, index, approvalLevel: approvalLevelForGate(approval.level) }))
    .sort((a, b) => approvalGatePriority(a.approvalLevel) - approvalGatePriority(b.approvalLevel) || a.index - b.index)
    .forEach(({ approval, index, approvalLevel }) => {
      const sideEffect = sideEffectForApprovalGate(approvalLevel, approval.status);
      pushCandidate({
        id: `${venture.id}-autonomy-candidate-approval-${index}`,
        approvalLevel,
        status: auditStatusForApprovalGate(approval.status),
        sideEffect,
        actionType: approval.level,
        suggestedActor: approvalLevel.startsWith("human-approved") ? "human-operator" : "operator",
        sourceRecordId: `${venture.id}-approval-${index}`,
        riskNote: approval.evidence,
        replayNote: `Review approval gate "${approval.level}" before external execution.`,
        evidence: approval.evidence,
        nextAction: sideEffect === "external-approved" ? "Execute only through the approved external path and keep proof attached." : "Keep the action blocked until the matching approval gate is complete.",
      });
    });

  venture.outreachApprovals.forEach((approval) => {
    pushCandidate({
      id: `${venture.id}-autonomy-candidate-outreach-${approval.id}`,
      approvalLevel: "human-approved-outreach",
      status: approval.status === "completed" ? "executed" : "approved",
      sideEffect: approval.externalSendStatus === "not-sent" ? "external-blocked" : "external-approved",
      actionType: `Outreach draft: ${approval.channel}`,
      suggestedActor: approval.attribution,
      sourceRecordId: approval.id,
      riskNote: approval.riskNote,
      replayNote: "Replay by reviewing the stored message draft, attribution, risk note, and no-send state.",
      evidence: approval.messageDraft,
      nextAction: approval.nextAction,
    });
  });

  venture.moneySignals.forEach((signal) => {
    const approvalLevel = signal.approvalLevel ?? moneyApprovalLevelFor(signal.type);
    const approvalState = signal.approvalState ?? moneyApprovalStateFor(signal.status);
    const externalActionState = signal.externalActionState ?? moneyExternalActionStateFor(signal.type, signal.status);
    pushCandidate({
      id: `${venture.id}-autonomy-candidate-money-${signal.id}`,
      approvalLevel,
      status: signal.status === "blocked" ? "blocked" : "proposed",
      sideEffect: signal.externalBillingStatus === "not-charged" ? "external-blocked" : "external-approved",
      actionType: `${signal.type} ${signal.status}: ${externalActionState}`,
      suggestedActor: signal.owner,
      sourceRecordId: signal.id,
      riskNote: `${signal.notes} Approval state: ${approvalState}; external action: ${externalActionState}.`,
      replayNote: "Replay by comparing money evidence, approval state, and explicit no-charge/no-spend/no-refund boundary.",
      evidence: signal.evidence,
      nextAction: signal.approvalNextAction ?? moneyApprovalNextActionFor(signal.type, signal.status),
    });
  });

  venture.artifactRecords.forEach((artifact) => {
    const boundary = autonomyBoundaryForArtifact(artifact);
    if (!boundary) return;
    pushCandidate({
      id: `${venture.id}-autonomy-candidate-artifact-${artifact.id}`,
      approvalLevel: boundary.approvalLevel,
      status: artifact.status === "verified" ? "executed" : "proposed",
      sideEffect: boundary.sideEffect,
      actionType: `${artifact.artifactType}: ${artifact.title}`,
      suggestedActor: artifact.owner,
      sourceRecordId: artifact.id,
      riskNote: boundary.riskNote,
      replayNote: artifact.verificationCommand,
      evidence: artifact.evidence,
      nextAction: boundary.nextAction,
    });
  });

  buildVentureDeploymentOwnerWorklist([venture], "all", now).items
    .filter((item) => (
      item.slaStatus === "stale" &&
      item.status !== "done" &&
      item.status !== "resolved" &&
      item.status !== "dismissed"
    ))
    .forEach((item) => {
      pushCandidate({
        id: `${venture.id}-autonomy-candidate-deployment-owner-${item.sourceRecordId}-${item.workType}`,
        approvalLevel: "deployment-proposal",
        status: "proposed",
        sideEffect: "none",
        actionType: `No-send deployment escalation: ${item.owner} ${item.targetLabel}`,
        suggestedActor: item.owner,
        sourceRecordId: `${item.sourceRecordId}-${item.workType}-stale-escalation`,
        riskNote: `${item.slaReason} This is an internal escalation draft only; do not send external messages or deploy.`,
        replayNote: `Open /ventures, use deployment owner drilldowns for ${item.owner}, ${item.targetId}, and ${item.slaStatus}, then inspect ${item.title}.`,
        evidence: `${item.title}. ${item.proofSummary} ${item.approvalBoundary}`,
        nextAction: `Follow up internally with ${item.owner}, update the deployment owner work item, and keep deployment, outreach, spend, and billing blocked until separately approved.`,
      });
    });

  venture.browserResearchTasks.forEach((task) => {
    pushCandidate({
      id: `${venture.id}-autonomy-candidate-browser-research-${task.id}`,
      approvalLevel: "read-only-research",
      status: task.status === "evidence-captured" ? "executed" : "proposed",
      sideEffect: "none",
      actionType: `Read-only research: ${task.sourceTarget}`,
      suggestedActor: task.owner,
      sourceRecordId: task.id,
      riskNote: "Read-only browser research must not contact users, spend money, deploy code, or mutate external systems.",
      replayNote: task.replayNote,
      evidence: task.findings,
      nextAction: task.nextAction,
    });
  });

  venture.evidenceSources.slice(0, 4).forEach((source) => {
    pushCandidate({
      id: `${venture.id}-autonomy-candidate-evidence-review-${source.id}`,
      approvalLevel: "read-only-research",
      status: "proposed",
      sideEffect: "none",
      actionType: `Read-only evidence review: ${source.platform}`,
      suggestedActor: "research-reviewer",
      sourceRecordId: source.id,
      riskNote: "Evidence review is read-only and should only inspect source provenance, quality, freshness, and contradictions.",
      replayNote: source.url || `Review evidence source ${source.title}`,
      evidence: source.summary || source.title,
      nextAction: "Record source quality, contradictions, or missing proof before changing venture lifecycle.",
    });
  });

  return candidates;
}

export function recordVentureAutonomyAudit(
  ownerKey: string,
  ventureId: string,
  audit: {
    approvalLevel: VentureAutonomyApprovalLevel;
    status: VentureAutonomyAuditStatus;
    sideEffect: VentureAutonomySideEffect;
    actionType: string;
    actor: string;
    sourceRecordId?: string;
    riskNote?: string;
    replayNote?: string;
    evidence?: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const actionType = audit.actionType.trim();
  const actor = audit.actor.trim();
  const nextAction = audit.nextAction.trim();
  if (!actionType || !actor || !nextAction) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureAutonomyAuditRecord = {
    id: createAutonomyAuditId(ventureId, audit.approvalLevel, now),
    createdAt: now,
    approvalLevel: audit.approvalLevel,
    status: audit.status,
    sideEffect: audit.sideEffect,
    actionType,
    actor,
    sourceRecordId: audit.sourceRecordId,
    riskNote: audit.riskNote?.trim() || "No autonomy risk note recorded.",
    replayNote: audit.replayNote?.trim() || "No replay note recorded.",
    evidence: audit.evidence?.trim() || "No autonomy evidence recorded.",
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    autonomyAudit: [record, ...venture.autonomyAudit].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

function agentRunStatusFromGapAction(status: VentureGapActionStatus): VentureAgentRunStatus {
  if (status === "completed") return "executed";
  if (status === "dismissed") return "blocked";
  if (status === "launched") return "prompt-ready";
  return "planned";
}

function agentRunStatusFromArtifact(status: VentureArtifactStatus): VentureAgentRunStatus {
  if (status === "blocked" || status === "superseded") return "blocked";
  if (status === "verified" || status === "attached") return "executed";
  return "prompt-ready";
}

function agentRunStatusFromAutonomyAudit(status: VentureAutonomyAuditStatus): VentureAgentRunStatus {
  if (status === "executed") return "executed";
  if (status === "blocked" || status === "dismissed") return "blocked";
  if (status === "approved") return "prompt-ready";
  return "planned";
}

export function buildVentureAgentRunCandidates(venture: SavedVentureWorkspace): VentureAgentRunCandidate[] {
  const recordedSourceKeys = new Set(
    venture.agentRuns
      .map((record) => agentRunSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureAgentRunCandidate[] = [];
  const pushCandidate = (candidate: Omit<VentureAgentRunCandidate, "tokenEstimate">) => {
    const sourceKey = agentRunSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (sourceKey && recordedSourceKeys.has(sourceKey)) return;
    candidates.push({
      ...candidate,
      tokenEstimate: estimateRunTokenCount(
        candidate.prompt,
        candidate.outputSummary,
        candidate.inputEvidence,
        candidate.toolCalls,
        candidate.riskNote,
      ),
    });
  };

  venture.autonomyAudit.forEach((audit) => {
    pushCandidate({
      id: `${venture.id}-agent-run-candidate-autonomy-${audit.id}`,
      sourceType: "autonomy-audit",
      sourceRecordId: audit.id,
      status: agentRunStatusFromAutonomyAudit(audit.status),
      model: "human-reviewed-local-audit",
      prompt: `Audit risky action "${audit.actionType}" for ${venture.title}. Approval level: ${audit.approvalLevel}. Side effect boundary: ${audit.sideEffect}. Risk note: ${audit.riskNote}`,
      outputSummary: `Autonomy audit status ${audit.status}; action is bounded as ${audit.sideEffect}.`,
      inputEvidence: audit.evidence,
      toolCalls: audit.replayNote,
      replayCommand: audit.replayNote || `Review autonomy audit ${audit.id} in Venture Lab.`,
      riskNote: audit.riskNote,
      suggestedOwner: audit.actor,
      nextAction: audit.nextAction,
    });
  });

  venture.artifactRecords.forEach((artifact) => {
    pushCandidate({
      id: `${venture.id}-agent-run-candidate-artifact-${artifact.id}`,
      sourceType: "artifact-generation",
      sourceRecordId: artifact.id,
      status: agentRunStatusFromArtifact(artifact.status),
      model: "deterministic-local-generator",
      prompt: `Generate or verify ${artifact.artifactType} artifact "${artifact.title}" for ${venture.title}.`,
      outputSummary: artifact.changeSummary,
      inputEvidence: artifact.evidence,
      toolCalls: artifact.verificationCommand,
      replayCommand: artifact.verificationCommand || `Open artifact URI: ${artifact.uri}`,
      riskNote: artifact.status === "blocked" ? artifact.changeSummary : "Artifact has no blocked status.",
      suggestedOwner: artifact.owner,
      nextAction: artifact.status === "verified" ? "Keep artifact evidence attached to the venture." : "Verify or supersede this artifact before external use.",
    });
  });

  venture.gapActionHistory.forEach((action) => {
    pushCandidate({
      id: `${venture.id}-agent-run-candidate-gap-${action.taskId}`,
      sourceType: "follow-up-mission",
      sourceRecordId: action.taskId,
      status: agentRunStatusFromGapAction(action.status),
      model: "follow-up-research-agent",
      prompt: action.prompt,
      outputSummary: action.outcome || `Gap action is ${action.status}; no returned research output has been attached yet.`,
      inputEvidence: action.reason,
      toolCalls: `createFollowUpMission("${action.prompt.replace(/"/g, "'").slice(0, 160)}")`,
      replayCommand: `Launch follow-up mission from Venture Lab gap task: ${action.title}`,
      riskNote: action.priority === "high" ? "High-priority evidence gap affects decision quality." : "Follow-up mission should be checked before acting on the venture.",
      suggestedOwner: "research-agent",
      nextAction: action.outcome ? "Review the outcome against the venture kill-pressure rules." : "Attach source URLs, contradictions, and decision recommendation after the mission returns.",
    });
  });

  const sourceEvidence = venture.evidenceSources
    .slice(0, 4)
    .map((source) => `${source.platform || "source"}: ${source.title || source.summary || source.url || "Untitled evidence"}`)
    .join("; ");
  pushCandidate({
    id: `${venture.id}-agent-run-candidate-recommendation`,
    sourceType: "recommendation",
    sourceRecordId: `${venture.id}-recommendation`,
    status: "prompt-ready",
    model: "venture-recommendation-generator",
    prompt: [
      `Evaluate venture recommendation "${venture.title}" for ${venture.targetBuyer}.`,
      `Pain: ${venture.painStatement}`,
      `Product wedge: ${venture.productWedge}`,
      `Pricing: ${venture.pricingHypothesis}`,
      `Evidence to cite: ${sourceEvidence || "No linked source evidence yet."}`,
      "Return continue, pivot, pause, kill, or scale with evidence and next action.",
    ].join(" "),
    outputSummary: `Current workspace decision is ${venture.decision}; lifecycle is ${venture.lifecycleStatus}.`,
    inputEvidence: [
      ...venture.claims.slice(0, 3),
      ...venture.contradictions.slice(0, 2).map((item) => `Contradiction: ${item}`),
    ].join(" ") || "No structured claim evidence recorded yet.",
    toolCalls: "summarizeVentureEvidence; buildVentureKillPressureReport; serializeVenturePortfolio",
    replayCommand: `Open /ventures, search "${venture.title}", then review evidence rows and kill-pressure rules.`,
    riskNote: venture.killCriteria.killReasons[0] || "Recommendation should not be trusted without source provenance.",
    suggestedOwner: "portfolio-operator",
    nextAction: venture.nextActions[0] || "Record a kill/continue decision after reviewing evidence.",
  });

  return candidates.slice(0, 100);
}

export function recordVentureAgentRun(
  ownerKey: string,
  ventureId: string,
  run: {
    sourceType: VentureAgentRunSourceType;
    sourceRecordId?: string;
    status: VentureAgentRunStatus;
    model?: string;
    prompt: string;
    outputSummary: string;
    inputEvidence?: string;
    toolCalls?: string;
    tokenEstimate?: number;
    replayCommand?: string;
    riskNote?: string;
    owner: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const prompt = run.prompt.trim();
  const outputSummary = run.outputSummary.trim();
  const owner = run.owner.trim();
  const nextAction = run.nextAction.trim();
  if (!prompt || !outputSummary || !owner || !nextAction) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const inputEvidence = run.inputEvidence?.trim() || "No input evidence recorded.";
  const toolCalls = run.toolCalls?.trim() || "No tool calls recorded.";
  const replayCommand = run.replayCommand?.trim() || "No replay command recorded.";
  const riskNote = run.riskNote?.trim() || "No agent-run risk note recorded.";
  const model = run.model?.trim() || "model-not-recorded";

  const record: VentureAgentRunRecord = {
    id: createAgentRunId(ventureId, run.sourceType, now),
    createdAt: now,
    sourceType: run.sourceType,
    sourceRecordId: run.sourceRecordId,
    status: run.status,
    model,
    prompt,
    outputSummary,
    inputEvidence,
    toolCalls,
    tokenEstimate: normalizeCount(run.tokenEstimate ?? estimateRunTokenCount(prompt, outputSummary, inputEvidence, toolCalls, riskNote)),
    replayCommand,
    riskNote,
    owner,
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    agentRuns: [record, ...venture.agentRuns].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function buildVentureCompetitorCandidates(venture: SavedVentureWorkspace): VentureCompetitorCandidate[] {
  const recordedSourceKeys = new Set(
    venture.competitors
      .map((record) => competitorSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureCompetitorCandidate[] = [];
  const pushCandidate = (candidate: VentureCompetitorCandidate) => {
    const sourceKey = competitorSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (sourceKey && recordedSourceKeys.has(sourceKey)) return;
    candidates.push(candidate);
  };

  const simulationText = [
    venture.companySimulation.competitiveResponse,
    ...venture.companySimulation.failureModes.filter((mode) => /substitute|competitive|competitor|copy|differentiated/i.test(mode)),
    ...venture.killCriteria.killReasons.filter((reason) => /substitute|competitive|competitor|differentiated/i.test(reason)),
  ].filter(Boolean).join(" ");

  if (simulationText.trim()) {
    pushCandidate({
      id: `${venture.id}-competitor-candidate-simulation`,
      sourceType: "workspace-simulation",
      sourceRecordId: `${venture.id}-company-simulation`,
      competitorName: "Existing substitutes",
      competitorType: "substitute",
      suggestedThreatLevel: inferCompetitorThreat(simulationText),
      suggestedStatus: "watching",
      positioning: venture.companySimulation.competitiveResponse,
      evidence: simulationText,
      differentiation: venture.productWedge,
      responsePlan: "Interview buyers about their current substitute, then prove the wedge against that alternative before scaling.",
      suggestedOwner: "competitive-analyst",
      watchCadence: "Weekly until the first paid or retained cohort proves differentiation.",
      nextAction: "Collect names, prices, and switching objections for the top three substitutes.",
    });
  }

  venture.evidenceSources.forEach((source, index) => {
    const text = `${source.title ?? ""} ${source.summary ?? ""} ${source.keywords ?? ""}`;
    if (!/\b(competitor|alternative|substitute|incumbent|platform|tool|app|brand|copy|similar)\b/i.test(text)) return;
    pushCandidate({
      id: `${venture.id}-competitor-candidate-source-${source.id || index}`,
      sourceType: "evidence-source",
      sourceRecordId: source.id || `${venture.id}-source-${index + 1}`,
      competitorName: source.title || "Evidence-source competitor signal",
      competitorType: /substitute|alternative|status quo/i.test(text) ? "substitute" : "indirect",
      suggestedThreatLevel: inferCompetitorThreat(text),
      suggestedStatus: "investigating",
      positioning: source.summary || source.keywords || "Evidence source mentions a possible competing product or behavior.",
      evidence: source.url || source.summary || source.title || "No source URL recorded.",
      differentiation: venture.productWedge,
      responsePlan: "Compare the source signal against the venture wedge, pricing, channel, and retention mechanism.",
      suggestedOwner: "competitive-analyst",
      watchCadence: "Review when new evidence is added or before a scale decision.",
      nextAction: "Open the source and extract competitor name, pricing, target buyer, and weakness.",
    });
  });

  venture.riskRecords
    .filter((risk) => /competitor|substitute|alternative|incumbent|copy|differentiat/i.test(`${risk.title} ${risk.detail} ${risk.mitigation}`))
    .forEach((risk) => {
      pushCandidate({
        id: `${venture.id}-competitor-candidate-risk-${risk.id}`,
        sourceType: "risk-record",
        sourceRecordId: risk.id,
        competitorName: risk.title,
        competitorType: "indirect",
        suggestedThreatLevel: inferCompetitorThreat(`${risk.detail} ${risk.mitigation}`),
        suggestedStatus: risk.status === "resolved" ? "mitigated" : "watching",
        positioning: risk.detail,
        evidence: risk.resolutionEvidence,
        differentiation: risk.mitigation,
        responsePlan: "Keep the risk mitigation attached to the competitor watch until evidence proves the threat is handled.",
        suggestedOwner: risk.owner,
        watchCadence: "Review with the risk register.",
        nextAction: risk.mitigation || "Re-check whether this competitive risk still changes the venture decision.",
      });
    });

  venture.customerInterviews
    .filter((interview) => /competitor|substitute|alternative|currently use|already use|instead|status quo/i.test(`${interview.objections} ${interview.requestedFeatures}`))
    .forEach((interview) => {
      pushCandidate({
        id: `${venture.id}-competitor-candidate-interview-${interview.id}`,
        sourceType: "customer-interview",
        sourceRecordId: interview.id,
        competitorName: `Buyer alternative: ${interview.persona}`,
        competitorType: "status-quo",
        suggestedThreatLevel: inferCompetitorThreat(`${interview.objections} ${interview.requestedFeatures}`),
        suggestedStatus: "investigating",
        positioning: interview.objections || interview.requestedFeatures,
        evidence: interview.painQuote,
        differentiation: interview.willingnessToPay || venture.productWedge,
        responsePlan: "Ask the buyer what they use today, what it costs, and what would make them switch.",
        suggestedOwner: "customer-researcher",
        watchCadence: "Review after the next customer interview.",
        nextAction: "Add substitute and switching-cost questions to the next interview script.",
      });
    });

  return candidates.sort((a, b) => {
    const threatRank: Record<VentureCompetitorThreatLevel, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    return threatRank[b.suggestedThreatLevel] - threatRank[a.suggestedThreatLevel];
  }).slice(0, 100);
}

export function recordVentureCompetitor(
  ownerKey: string,
  ventureId: string,
  competitor: {
    sourceType: VentureCompetitorSourceType;
    sourceRecordId?: string;
    competitorName: string;
    competitorType: VentureCompetitorType;
    threatLevel: VentureCompetitorThreatLevel;
    status: VentureCompetitorStatus;
    positioning?: string;
    evidence?: string;
    differentiation?: string;
    responsePlan?: string;
    owner: string;
    watchCadence?: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const competitorName = competitor.competitorName.trim();
  const owner = competitor.owner.trim();
  const nextAction = competitor.nextAction.trim();
  if (!competitorName || !owner || !nextAction) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureCompetitorRecord = {
    id: createCompetitorRecordId(ventureId, competitor.competitorType, now),
    createdAt: now,
    sourceType: competitor.sourceType,
    sourceRecordId: competitor.sourceRecordId,
    competitorName,
    competitorType: competitor.competitorType,
    threatLevel: competitor.threatLevel,
    status: competitor.status,
    positioning: competitor.positioning?.trim() || "No competitor positioning recorded.",
    evidence: competitor.evidence?.trim() || "No competitor evidence recorded.",
    differentiation: competitor.differentiation?.trim() || "No differentiation plan recorded.",
    responsePlan: competitor.responsePlan?.trim() || "No competitor response plan recorded.",
    owner,
    watchCadence: competitor.watchCadence?.trim() || "Review before the next scale or kill decision.",
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    competitors: [record, ...venture.competitors].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

function inferResearchPlatform(text: string) {
  const value = text.toLowerCase();
  if (/\byoutube|video|creator\b/.test(value)) return "youtube";
  if (/\breddit|subreddit|community\b/.test(value)) return "reddit";
  if (/\bsubstack|newsletter|publication\b/.test(value)) return "substack";
  if (/\bx\/twitter|\btwitter|\bx coverage|\bsocial\b/.test(value)) return "x";
  if (/\bpricing|checkout|paid\b/.test(value)) return "pricing-page";
  if (/\bcompetitor|substitute|alternative|status quo\b/.test(value)) return "competitor-web";
  return "web";
}

export function buildVentureBrowserResearchCandidates(venture: SavedVentureWorkspace): VentureBrowserResearchCandidate[] {
  const recordedSourceKeys = new Set(
    venture.browserResearchTasks
      .map((record) => browserResearchSourceKey(record.sourceType, record.sourceRecordId))
      .filter(Boolean),
  );
  const candidates: VentureBrowserResearchCandidate[] = [];
  const pushCandidate = (candidate: VentureBrowserResearchCandidate) => {
    const sourceKey = browserResearchSourceKey(candidate.sourceType, candidate.sourceRecordId);
    if (sourceKey && recordedSourceKeys.has(sourceKey)) return;
    candidates.push(candidate);
  };

  buildVentureGapActionQueue(venture).forEach((task) => {
    const platform = inferResearchPlatform(`${task.title} ${task.reason} ${task.prompt}`);
    pushCandidate({
      id: `${venture.id}-browser-research-candidate-gap-${task.id}`,
      sourceType: "gap-action",
      sourceRecordId: task.id,
      platform,
      sourceTarget: task.title.replace(/^Research missing evidence:\s*/i, ""),
      prompt: task.prompt,
      suggestedStatus: "queued",
      suggestedOwner: platform === "competitor-web" ? "competitive-analyst" : "browser-researcher",
      evidenceUrl: "",
      findings: task.reason,
      replayNote: `Open Venture Lab, search "${venture.title}", then inspect gap task "${task.title}".`,
      nextAction: "Capture source URLs, quoted evidence, contradictions, and a continue/pivot/kill note.",
    });
  });

  buildVentureReadinessNotices(venture)
    .filter((notice) => notice.id === "source-backed-evidence" || notice.id === "evidence-readiness-degraded")
    .forEach((notice) => {
      pushCandidate({
        id: `${venture.id}-browser-research-candidate-readiness-${notice.id}`,
        sourceType: "readiness-notice",
        sourceRecordId: notice.id,
        platform: "web",
        sourceTarget: notice.title,
        prompt: [
          `Find source-backed evidence for ${venture.title}.`,
          `Target buyer: ${venture.targetBuyer}.`,
          `Pain: ${venture.painStatement}.`,
          `Product wedge: ${venture.productWedge}.`,
          notice.nextAction,
        ].join(" "),
        suggestedStatus: "queued",
        suggestedOwner: "browser-researcher",
        evidenceUrl: "",
        findings: notice.detail,
        replayNote: `Re-run by opening /ventures and reviewing readiness notice "${notice.title}".`,
        nextAction: notice.nextAction,
      });
    });

  buildVentureCompetitorCandidates(venture).slice(0, 3).forEach((candidate) => {
    pushCandidate({
      id: `${venture.id}-browser-research-candidate-competitor-${candidate.id}`,
      sourceType: "competitor-watch",
      sourceRecordId: candidate.id,
      platform: "competitor-web",
      sourceTarget: candidate.competitorName,
      prompt: [
        `Research competitor or substitute "${candidate.competitorName}" for ${venture.title}.`,
        `Buyer: ${venture.targetBuyer}.`,
        `Differentiate with: ${candidate.differentiation}.`,
        `Find pricing, positioning, target buyer, switching costs, and weaknesses.`,
      ].join(" "),
      suggestedStatus: "queued",
      suggestedOwner: candidate.suggestedOwner,
      evidenceUrl: candidate.evidence.startsWith("http") ? candidate.evidence : "",
      findings: candidate.positioning,
      replayNote: `Re-open competitor candidate "${candidate.competitorName}" and verify source evidence.`,
      nextAction: candidate.nextAction,
    });
  });

  return candidates.slice(0, 100);
}

export function recordVentureBrowserResearchTask(
  ownerKey: string,
  ventureId: string,
  task: {
    sourceType: VentureBrowserResearchSourceType;
    sourceRecordId?: string;
    platform: string;
    sourceTarget: string;
    prompt: string;
    status: VentureBrowserResearchStatus;
    owner: string;
    evidenceUrl?: string;
    findings?: string;
    replayNote?: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const platform = task.platform.trim();
  const sourceTarget = task.sourceTarget.trim();
  const prompt = task.prompt.trim();
  const owner = task.owner.trim();
  const nextAction = task.nextAction.trim();
  if (!platform || !sourceTarget || !prompt || !owner || !nextAction) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const record: VentureBrowserResearchTaskRecord = {
    id: createBrowserResearchTaskId(ventureId, task.sourceType, now),
    createdAt: now,
    updatedAt: now,
    sourceType: task.sourceType,
    sourceRecordId: task.sourceRecordId,
    platform,
    sourceTarget,
    prompt,
    status: task.status,
    owner,
    evidenceUrl: task.evidenceUrl?.trim() || "No evidence URL captured yet.",
    findings: task.findings?.trim() || "No browser research findings captured yet.",
    replayNote: task.replayNote?.trim() || "No replay note recorded.",
    nextAction,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    browserResearchTasks: [record, ...venture.browserResearchTasks].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function recordVentureAtlasValidationResult(
  ownerKey: string,
  ventureId: string,
  result: {
    atlasValidationPackId: string;
    outcome: VentureAtlasValidationResultOutcome;
    qualifiedBuyerCount: number;
    painConfirmationCount: number;
    hiddenWedgeResonanceCount: number;
    paidPricingSignalCount: number;
    strongestQuote: string;
    strongestObjection: string;
    evidenceNote: string;
    learning: string;
    owner: string;
    nextAction: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const owner = result.owner.trim();
  const evidenceNote = result.evidenceNote.trim();
  const nextAction = result.nextAction.trim();
  if (!result.atlasValidationPackId.trim() || !owner || !evidenceNote || !nextAction) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const pack = buildVentureAtlasValidationCommandPacks([venture])
    .find((item) => item.id === result.atlasValidationPackId);
  if (!pack) return null;

  const qualifiedBuyerCount = normalizeCount(result.qualifiedBuyerCount);
  const painConfirmationCount = boundedCount(result.painConfirmationCount, qualifiedBuyerCount || undefined);
  const hiddenWedgeResonanceCount = boundedCount(result.hiddenWedgeResonanceCount, qualifiedBuyerCount || undefined);
  const paidPricingSignalCount = boundedCount(result.paidPricingSignalCount, qualifiedBuyerCount || undefined);
  const demandDriftScore = atlasValidationResultScoreFor({
    outcome: result.outcome,
    qualifiedBuyerCount,
    painConfirmationCount,
    hiddenWedgeResonanceCount,
    paidPricingSignalCount,
  });
  const record: VentureAtlasValidationResultRecord = {
    id: createAtlasValidationResultId(ventureId, result.outcome, now),
    recordedAt: now,
    atlasValidationPackId: pack.id,
    atlasItemId: pack.atlasItemId,
    atlasItemTitle: pack.atlasItemTitle,
    outcome: result.outcome,
    qualifiedBuyerCount,
    painConfirmationCount,
    hiddenWedgeResonanceCount,
    paidPricingSignalCount,
    strongestQuote: result.strongestQuote.trim() || "No strongest quote recorded.",
    strongestObjection: result.strongestObjection.trim() || "No strongest objection recorded.",
    evidenceNote,
    learning: result.learning.trim() || "No validation learning recorded.",
    owner,
    nextAction,
    noExternalSideEffectProof: ATLAS_VALIDATION_NO_EXTERNAL_SIDE_EFFECT_PROOF,
    demandDriftScore,
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    lifecycleStatus: venture.lifecycleStatus === "researching" ? "validating" : venture.lifecycleStatus,
    atlasValidationResults: [record, ...venture.atlasValidationResults].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

const PRODUCT_BUILD_RUN_NO_EXTERNAL_SIDE_EFFECT_PROOF =
  "Product-build run proof is local-only: no send / no spend / no deploy / no contact / no billing change. It records command execution evidence already performed by the operator and does not execute commands on its own.";

export function recordVentureProductBuildCommandRun(
  ownerKey: string,
  ventureId: string,
  run: {
    commandId: string;
    runState: VentureProductBuildCommandRunState;
    owner: string;
    runProof: string;
    localArtifactProof: string;
    verifierReportProof: string;
    learning: string;
  },
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const commandId = run.commandId.trim();
  const owner = run.owner.trim();
  const runProof = run.runProof.trim();
  if (!commandId || !owner || !runProof) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const command = buildVentureProductBuildCommandQueue([venture])
    .find((item) => item.id === commandId);
  if (!command) return null;

  const record: VentureProductBuildCommandRunRecord = {
    id: createProductBuildCommandRunId(ventureId, command.id, run.runState, now),
    recordedAt: now,
    commandId: command.id,
    commandTitle: command.title,
    sourceType: command.sourceType,
    sourceArtifactId: command.sourceArtifactId,
    sourceArtifactLabel: command.sourceArtifactLabel,
    runState: run.runState,
    appName: command.appName,
    buildCommand: command.buildCommand,
    artifactTarget: command.artifactTarget,
    owner,
    runProof,
    localArtifactProof: run.localArtifactProof.trim() || command.artifactTarget,
    verifierReportProof: run.verifierReportProof.trim() || command.proofRequired,
    noExternalSideEffectProof: PRODUCT_BUILD_RUN_NO_EXTERNAL_SIDE_EFFECT_PROOF,
    learning: run.learning.trim() || "No build-run learning recorded.",
    evidence: [
      "local product build command run",
      "product build command run ledger",
      command.sourceType === "validation-result" ? "validation-backed product build run" : "",
      command.sourceArtifactLabel,
      command.proofRequired,
      command.noFakeSourceBoundary,
      ...command.evidence.slice(0, 4),
    ].filter(Boolean),
  };

  const updated: SavedVentureWorkspace = {
    ...venture,
    updatedAt: now,
    lifecycleStatus: run.runState === "promoted" && venture.lifecycleStatus !== "launched"
      ? "building"
      : venture.lifecycleStatus,
    productBuildCommandRuns: [
      record,
      ...venture.productBuildCommandRuns.filter((item) => (
        !(item.commandId === command.id && item.runState === run.runState)
      )),
    ].slice(0, 100),
  };

  const next = [updated, ...existing.filter((item) => item.id !== ventureId)]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next));
  }

  return updated;
}

export function serializeVenturePortfolio(
  ventures: SavedVentureWorkspace[],
  options: {
    deploymentEscalationAuditSavedViews?: unknown[];
    deploymentEscalationAuditSavedViewsExportedBy?: string;
    demandSourceBlockerSavedViews?: unknown[];
    demandSourceBlockerSavedViewsExportedBy?: string;
    demandSourceBlockerSavedViewPackets?: unknown[];
    demandSourceBlockerSavedViewPacketsExportedBy?: string;
    demandSourceBlockerPacketTriage?: unknown[];
    demandSourceBlockerPacketTriageExportedBy?: string;
    demandSourceBlockerPacketTriageAuditHistory?: unknown[];
    demandSourceBlockerPacketTriageAuditHistoryExportedBy?: string;
    demandSourceBlockerPacketTriageOwnerQueue?: unknown[];
    demandSourceBlockerPacketTriageOwnerQueueExportedBy?: string;
    demandSourceBlockerPacketTriageOwnerWorkloadSummary?: unknown[];
    demandSourceBlockerPacketTriageOwnerWorkloadSummaryExportedBy?: string;
    demandSourceBlockerPacketTriageWorkloadDriftReconciliation?: unknown[];
    demandSourceBlockerPacketTriageWorkloadDriftReconciliationExportedBy?: string;
    demandSourceBlockerPacketTriageWorkloadPinnedSummaries?: unknown[];
    demandSourceBlockerPacketTriageWorkloadPinnedSummariesExportedBy?: string;
    demandSourceBlockerPacketHandoffHealth?: unknown[];
    demandSourceBlockerPacketHandoffHealthExportedBy?: string;
    demandSourceBlockerPacketHandoffRemediationQueue?: unknown[];
    demandSourceBlockerPacketHandoffRemediationQueueExportedBy?: string;
    demandSourceBlockerPacketHandoffRemediationPlans?: unknown[];
    demandSourceBlockerPacketHandoffRemediationPlansExportedBy?: string;
    demandSourceBlockerPacketHandoffRemediationClosures?: unknown[];
    demandSourceBlockerPacketHandoffRemediationClosuresExportedBy?: string;
    demandSourceBlockerPacketHandoffReopenEscalations?: unknown[];
    demandSourceBlockerPacketHandoffReopenEscalationsExportedBy?: string;
    demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?: unknown[];
    demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsExportedBy?: string;
    demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?: unknown[];
    demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsExportedBy?: string;
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?: unknown[];
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsExportedBy?: string;
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?: unknown[];
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansExportedBy?: string;
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?: unknown[];
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresExportedBy?: string;
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?: unknown[];
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsExportedBy?: string;
    breachProcessRegressionClosures?: unknown[];
    breachProcessRegressionClosuresExportedBy?: string;
    breachProcessRegressionEscalations?: unknown[];
    breachProcessRegressionEscalationsExportedBy?: string;
    breachProcessRegressionEscalationAuditAssignments?: unknown[];
    breachProcessRegressionEscalationAuditAssignmentsExportedBy?: string;
    breachProcessRegressionEscalationAuditClosures?: unknown[];
    breachProcessRegressionEscalationAuditClosuresExportedBy?: string;
    breachProcessRegressionEscalationAuditReviews?: unknown[];
    breachProcessRegressionEscalationAuditReviewsExportedBy?: string;
    breachProcessRegressionEscalationAuditAppeals?: unknown[];
    breachProcessRegressionEscalationAuditAppealsExportedBy?: string;
    breachProcessRegressionEscalationGovernanceDigests?: unknown[];
    breachProcessRegressionEscalationGovernanceDigestsExportedBy?: string;
    portfolioImportAuditHistory?: unknown[];
    portfolioImportAuditHistoryExportedBy?: string;
    portfolioImportAuditPruneSnapshot?: unknown;
    portfolioImportAuditPruneSnapshotExportedBy?: string;
  } = {},
) {
  const exportedAt = new Date().toISOString();
  const portfolioImportAuditPruneSnapshot = options.portfolioImportAuditPruneSnapshot;
  return JSON.stringify({
    version: EXPORT_VERSION,
    exportedAt,
    exportedBy: options.deploymentEscalationAuditSavedViewsExportedBy
      ?? options.demandSourceBlockerSavedViewsExportedBy
      ?? options.demandSourceBlockerSavedViewPacketsExportedBy
      ?? options.demandSourceBlockerPacketTriageExportedBy
      ?? options.demandSourceBlockerPacketTriageAuditHistoryExportedBy
      ?? options.demandSourceBlockerPacketTriageOwnerQueueExportedBy
      ?? options.demandSourceBlockerPacketTriageOwnerWorkloadSummaryExportedBy
      ?? options.demandSourceBlockerPacketTriageWorkloadDriftReconciliationExportedBy
      ?? options.demandSourceBlockerPacketTriageWorkloadPinnedSummariesExportedBy
      ?? options.demandSourceBlockerPacketHandoffHealthExportedBy
      ?? options.demandSourceBlockerPacketHandoffRemediationQueueExportedBy
      ?? options.demandSourceBlockerPacketHandoffRemediationPlansExportedBy
      ?? options.demandSourceBlockerPacketHandoffRemediationClosuresExportedBy
      ?? options.demandSourceBlockerPacketHandoffReopenEscalationsExportedBy
      ?? options.demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsExportedBy
      ?? options.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsExportedBy
      ?? options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsExportedBy
      ?? options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansExportedBy
      ?? options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresExportedBy
      ?? options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsExportedBy
      ?? options.breachProcessRegressionClosuresExportedBy
      ?? options.breachProcessRegressionEscalationsExportedBy
      ?? options.breachProcessRegressionEscalationAuditAssignmentsExportedBy
      ?? options.breachProcessRegressionEscalationAuditClosuresExportedBy
      ?? options.breachProcessRegressionEscalationAuditReviewsExportedBy
      ?? options.breachProcessRegressionEscalationAuditAppealsExportedBy
      ?? options.breachProcessRegressionEscalationGovernanceDigestsExportedBy
      ?? options.portfolioImportAuditHistoryExportedBy
      ?? options.portfolioImportAuditPruneSnapshotExportedBy,
    deploymentEscalationAuditSavedViews: (options.deploymentEscalationAuditSavedViews ?? []).map((view) => (
      view && typeof view === "object"
        ? { ...view, exportedAt, exportedBy: options.deploymentEscalationAuditSavedViewsExportedBy }
        : view
    )),
    demandSourceBlockerSavedViews: (options.demandSourceBlockerSavedViews ?? []).map((view) => (
      view && typeof view === "object"
        ? { ...view, exportedAt, exportedBy: options.demandSourceBlockerSavedViewsExportedBy }
        : view
    )),
    demandSourceBlockerSavedViewPackets: (options.demandSourceBlockerSavedViewPackets ?? []).map((packet) => (
      packet && typeof packet === "object"
        ? { ...packet, exportedAt, exportedBy: options.demandSourceBlockerSavedViewPacketsExportedBy }
        : packet
    )),
    demandSourceBlockerPacketTriage: (options.demandSourceBlockerPacketTriage ?? []).map((state) => (
      state && typeof state === "object"
        ? { ...state, exportedAt, exportedBy: options.demandSourceBlockerPacketTriageExportedBy }
        : state
    )),
    demandSourceBlockerPacketTriageAuditHistory: (options.demandSourceBlockerPacketTriageAuditHistory ?? []).map((entry) => (
      entry && typeof entry === "object"
        ? { ...entry, exportedAt, exportedBy: options.demandSourceBlockerPacketTriageAuditHistoryExportedBy }
        : entry
    )),
    demandSourceBlockerPacketTriageOwnerQueue: (options.demandSourceBlockerPacketTriageOwnerQueue ?? []).map((item) => (
      item && typeof item === "object"
        ? { ...item, exportedAt, exportedBy: options.demandSourceBlockerPacketTriageOwnerQueueExportedBy }
        : item
    )),
    demandSourceBlockerPacketTriageOwnerWorkloadSummary: (options.demandSourceBlockerPacketTriageOwnerWorkloadSummary ?? []).map((item) => (
      item && typeof item === "object"
        ? { ...item, exportedAt, exportedBy: options.demandSourceBlockerPacketTriageOwnerWorkloadSummaryExportedBy }
        : item
    )),
    demandSourceBlockerPacketTriageWorkloadDriftReconciliation: (options.demandSourceBlockerPacketTriageWorkloadDriftReconciliation ?? []).map((entry) => (
      entry && typeof entry === "object"
        ? { ...entry, exportedAt, exportedBy: options.demandSourceBlockerPacketTriageWorkloadDriftReconciliationExportedBy }
        : entry
    )),
    demandSourceBlockerPacketTriageWorkloadPinnedSummaries: (options.demandSourceBlockerPacketTriageWorkloadPinnedSummaries ?? []).map((summary) => (
      summary && typeof summary === "object"
        ? { ...summary, exportedAt, exportedBy: options.demandSourceBlockerPacketTriageWorkloadPinnedSummariesExportedBy }
        : summary
    )),
    demandSourceBlockerPacketHandoffHealth: (options.demandSourceBlockerPacketHandoffHealth ?? []).map((item) => (
      item && typeof item === "object"
        ? { ...item, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffHealthExportedBy }
        : item
    )),
    demandSourceBlockerPacketHandoffRemediationQueue: (options.demandSourceBlockerPacketHandoffRemediationQueue ?? []).map((item) => (
      item && typeof item === "object"
        ? { ...item, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffRemediationQueueExportedBy }
        : item
    )),
    demandSourceBlockerPacketHandoffRemediationPlans: (options.demandSourceBlockerPacketHandoffRemediationPlans ?? []).map((plan) => (
      plan && typeof plan === "object"
        ? { ...plan, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffRemediationPlansExportedBy }
        : plan
    )),
    demandSourceBlockerPacketHandoffRemediationClosures: (options.demandSourceBlockerPacketHandoffRemediationClosures ?? []).map((receipt) => (
      receipt && typeof receipt === "object"
        ? { ...receipt, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffRemediationClosuresExportedBy }
        : receipt
    )),
    demandSourceBlockerPacketHandoffReopenEscalations: (options.demandSourceBlockerPacketHandoffReopenEscalations ?? []).map((item) => (
      item && typeof item === "object"
        ? { ...item, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffReopenEscalationsExportedBy }
        : item
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts: (options.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts ?? []).map((receipt) => (
      receipt && typeof receipt === "object"
        ? { ...receipt, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsExportedBy }
        : receipt
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: (options.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions ?? []).map((receipt) => (
      receipt && typeof receipt === "object"
        ? { ...receipt, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsExportedBy }
        : receipt
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends: (options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends ?? []).map((item) => (
      item && typeof item === "object"
        ? { ...item, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsExportedBy }
        : item
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans: (options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans ?? []).map((plan) => (
      plan && typeof plan === "object"
        ? { ...plan, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansExportedBy }
        : plan
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures: (options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures ?? []).map((closure) => (
      closure && typeof closure === "object"
        ? { ...closure, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresExportedBy }
        : closure
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions: (options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions ?? []).map((regression) => (
      regression && typeof regression === "object"
        ? { ...regression, exportedAt, exportedBy: options.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsExportedBy }
        : regression
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures: (options.breachProcessRegressionClosures ?? []).map((closure) => (
      closure && typeof closure === "object"
        ? { ...closure, exportedAt, exportedBy: options.breachProcessRegressionClosuresExportedBy }
        : closure
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations: (options.breachProcessRegressionEscalations ?? []).map((item) => (
      item && typeof item === "object"
        ? { ...item, exportedAt, exportedBy: options.breachProcessRegressionEscalationsExportedBy }
        : item
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments: (options.breachProcessRegressionEscalationAuditAssignments ?? []).map((assignment) => (
      assignment && typeof assignment === "object"
        ? { ...assignment, exportedAt, exportedBy: options.breachProcessRegressionEscalationAuditAssignmentsExportedBy }
        : assignment
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures: (options.breachProcessRegressionEscalationAuditClosures ?? []).map((closure) => (
      closure && typeof closure === "object"
        ? { ...closure, exportedAt, exportedBy: options.breachProcessRegressionEscalationAuditClosuresExportedBy }
        : closure
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews: (options.breachProcessRegressionEscalationAuditReviews ?? []).map((review) => (
      review && typeof review === "object"
        ? { ...review, exportedAt, exportedBy: options.breachProcessRegressionEscalationAuditReviewsExportedBy }
        : review
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: (options.breachProcessRegressionEscalationAuditAppeals ?? []).map((appeal) => (
      appeal && typeof appeal === "object"
        ? { ...appeal, exportedAt, exportedBy: options.breachProcessRegressionEscalationAuditAppealsExportedBy }
        : appeal
    )),
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests: (options.breachProcessRegressionEscalationGovernanceDigests ?? []).map((digest) => (
      digest && typeof digest === "object"
        ? { ...digest, exportedAt, exportedBy: options.breachProcessRegressionEscalationGovernanceDigestsExportedBy }
        : digest
    )),
    portfolioImportAuditHistory: (options.portfolioImportAuditHistory ?? []).map((entry) => (
      entry && typeof entry === "object"
        ? { ...entry, exportedAt, exportedBy: options.portfolioImportAuditHistoryExportedBy }
        : entry
    )),
    ...(portfolioImportAuditPruneSnapshot
      ? {
        portfolioImportAuditPruneSnapshot: portfolioImportAuditPruneSnapshot && typeof portfolioImportAuditPruneSnapshot === "object"
          ? {
            ...portfolioImportAuditPruneSnapshot,
            status: "pending-restore",
            exportedAt,
            exportedBy: options.portfolioImportAuditPruneSnapshotExportedBy,
          }
          : portfolioImportAuditPruneSnapshot,
      }
      : {}),
    demandDriftReports: ventures.map(buildVentureDemandDriftReport),
    executionMemos: ventures.map(buildVentureFounderExecutionMemo),
    experimentLaunchPacks: ventures.map(buildVentureExperimentLaunchPack),
    qaReleaseReports: ventures.map(buildVentureQaReleaseReport),
    deploymentReadinessPackets: ventures.map(buildVentureDeploymentReadinessPacket),
    deploymentEnvironmentMatrices: ventures.map(buildVentureDeploymentEnvironmentMatrix),
    deploymentOwnerWorklist: buildVentureDeploymentOwnerWorklist(ventures),
    deploymentOwnerWorkload: summarizeVentureDeploymentOwnerWorkload(ventures),
    deploymentEscalationAuditRollup: buildVentureDeploymentEscalationAuditRollup(ventures),
    convertedPainMemories: buildVentureConvertedPainMemories(ventures),
    wrongClaimMemories: buildVentureWrongClaimMemories(ventures),
    workedChannelMemories: buildVentureWorkedChannelMemories(ventures),
    failedOutreachMemories: buildVentureFailedOutreachMemories(ventures),
    convertedPricingMemories: buildVentureConvertedPricingMemories(ventures),
    mvpFeatureMemories: buildVentureMvpFeatureMemories(ventures),
    retainedUserMemories: buildVentureRetainedUserMemories(ventures),
    successPredictionMemories: buildVentureSuccessPredictionMemories(ventures),
    vanityMetricMemories: buildVentureVanityMetricMemories(ventures),
    generatedCodePatternMemories: buildVentureGeneratedCodePatternMemories(ventures),
    empiricalCalibrationMemories: buildVentureEmpiricalCalibrationMemories(ventures),
    fakeMarketMemories: buildVentureFakeMarketMemories(ventures),
    weakBranchKillMemories: buildVentureWeakBranchKillMemories(ventures),
    investorBriefs: ventures.map(buildVentureInvestorBrief),
    financialModels: ventures.map(buildVentureFinancialModel),
    portfolioCharts: buildVenturePortfolioChartPack(ventures),
    portfolioSummary: summarizeVenturePortfolio(ventures),
    outreachCampaigns: ventures.map(buildVentureOutreachCampaignBrief),
    generatedAppHandoffs: ventures.map(buildVentureGeneratedAppHandoff),
    generatedAppSourceScaffolds: ventures.map(buildVentureGeneratedAppSourceScaffold),
    generatedAppVerificationProofs: ventures.map(buildVentureGeneratedAppVerificationProof),
    killDecisionArtifacts: ventures.map(buildVentureKillDecisionArtifact),
    revenueGenerationPostures: ventures.map(buildVentureRevenueGenerationPosture),
    scaleStrongBranchPlans: ventures.map(buildVentureScaleStrongBranchPlan),
    spawnedVentureDrafts: buildVentureSpawnedVentureDrafts(ventures),
    relatedIdeaMergeAudits: buildVentureRelatedIdeaMergeAudits(ventures),
    learningReinvestmentQueue: buildVentureLearningReinvestmentQueue(ventures),
    opportunityDiscoveryBacklog: buildVentureOpportunityDiscoveryBacklog(ventures),
    overlookedOpportunityAtlas: buildVentureOverlookedOpportunityAtlas(ventures),
    atlasValidationCommandPacks: buildVentureAtlasValidationCommandPacks(ventures),
    atlasValidationResultLedger: buildVentureAtlasValidationResultLedger(ventures),
    productBuildCommandQueue: buildVentureProductBuildCommandQueue(ventures),
    productBuildCommandRunLedger: buildVentureProductBuildCommandRunLedger(ventures),
    mvpReleaseWorkspaceList: buildVentureMvpReleaseWorkspaceList(ventures),
    pilotCohortSignalGates: buildVenturePilotCohortSignalGates(ventures),
    noSendEmailGateWorklist: buildVentureNoSendEmailGateWorklist(ventures),
    launchControlQueue: buildVentureLaunchControlQueue(ventures),
    demandCaptureProofQueue: buildVentureDemandCaptureProofQueue(ventures),
    demandSourceBlockerDrilldowns: buildVentureDemandSourceBlockerDrilldowns(ventures),
    portfolioDecisionCommandQueue: buildVenturePortfolioDecisionCommandQueue(ventures),
    ventures,
  }, null, 2);
}

export function parseVenturePortfolioImport(raw: string): SavedVentureWorkspace[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object" ? parsed as { ventures?: unknown } : {};
    const ventures = Array.isArray(payload.ventures) ? payload.ventures : Array.isArray(parsed) ? parsed : [];
    return ventures.filter(isSavedVentureWorkspace).map(normalizeSavedVentureWorkspace);
  } catch {
    return [];
  }
}

export function replaceVenturePortfolio(
  ownerKey: string,
  ventures: SavedVentureWorkspace[],
  storage: StorageLike | null = browserStorage(),
) {
  const normalized = ventures.filter(isSavedVentureWorkspace)
    .map(normalizeSavedVentureWorkspace)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (storage) {
    storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(normalized));
  }

  return normalized;
}

export function filterVenturePortfolio(ventures: SavedVentureWorkspace[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return ventures;

  const allRelatedIdeaMergeAudits = buildVentureRelatedIdeaMergeAudits(ventures);
  const allLearningReinvestmentQueue = buildVentureLearningReinvestmentQueue(ventures);
  const allOpportunityDiscoveryBacklog = buildVentureOpportunityDiscoveryBacklog(ventures);
  const allOverlookedOpportunityAtlas = buildVentureOverlookedOpportunityAtlas(ventures);
  const allAtlasValidationCommandPacks = buildVentureAtlasValidationCommandPacks(ventures);
  const allAtlasValidationResultLedger = buildVentureAtlasValidationResultLedger(ventures);
  const allProductBuildCommands = buildVentureProductBuildCommandQueue(ventures);
  const allProductBuildCommandRuns = buildVentureProductBuildCommandRunLedger(ventures);
  const allMvpReleaseWorkspaces = buildVentureMvpReleaseWorkspaceList(ventures);
  const allPilotCohortSignalGates = buildVenturePilotCohortSignalGates(ventures);
  const allNoSendEmailGateWorklist = buildVentureNoSendEmailGateWorklist(ventures);
  const allLaunchControlQueue = buildVentureLaunchControlQueue(ventures);
  const allDemandCaptureProofQueue = buildVentureDemandCaptureProofQueue(ventures);
  const allDemandSourceBlockerDrilldowns = buildVentureDemandSourceBlockerDrilldowns(ventures);
  const allPortfolioDecisionCommandQueue = buildVenturePortfolioDecisionCommandQueue(ventures);

  return ventures.filter((venture) => {
    const demandDrift = buildVentureDemandDriftReport(venture);
    const founderMemo = buildVentureFounderExecutionMemo(venture);
    const launchPack = buildVentureExperimentLaunchPack(venture);
    const qaReport = buildVentureQaReleaseReport(venture);
    const deploymentPacket = buildVentureDeploymentReadinessPacket(venture);
    const deploymentMatrix = buildVentureDeploymentEnvironmentMatrix(venture);
    const deploymentEscalationAuditRollup = buildVentureDeploymentEscalationAuditRollup([venture]);
    const investorBrief = buildVentureInvestorBrief(venture);
    const financialModel = buildVentureFinancialModel(venture);
    const evidenceProfile = summarizeVentureEvidence(venture);
    const outreachCampaign = buildVentureOutreachCampaignBrief(venture);
    const generatedApp = buildVentureGeneratedAppHandoff(venture);
    const sourceScaffold = buildVentureGeneratedAppSourceScaffold(venture);
    const generatedAppProof = buildVentureGeneratedAppVerificationProof(venture);
    const killDecision = buildVentureKillDecisionArtifact(venture);
    const revenuePosture = buildVentureRevenueGenerationPosture(venture);
    const scaleStrongBranchPlan = buildVentureScaleStrongBranchPlan(venture);
    const spawnedVentureDrafts = buildVentureSpawnedVentureDrafts([venture]);
    const relatedIdeaMergeAudits = allRelatedIdeaMergeAudits.filter(
      (audit) => audit.primaryVentureId === venture.id || audit.relatedVentureId === venture.id,
    );
    const learningReinvestmentQueue = allLearningReinvestmentQueue.filter(
      (item) => item.ventureId === venture.id || item.relatedVentureIds.includes(venture.id),
    );
    const opportunityDiscoveryBacklog = allOpportunityDiscoveryBacklog.filter((item) => item.ventureId === venture.id);
    const overlookedOpportunityAtlas = allOverlookedOpportunityAtlas.filter((item) => item.ventureId === venture.id);
    const atlasValidationCommandPacks = allAtlasValidationCommandPacks.filter((pack) => pack.ventureId === venture.id);
    const atlasValidationResultLedger = allAtlasValidationResultLedger.filter((item) => item.ventureId === venture.id);
    const productBuildCommands = allProductBuildCommands.filter((command) => command.ventureId === venture.id);
    const productBuildCommandRuns = allProductBuildCommandRuns.filter((item) => item.ventureId === venture.id);
    const mvpReleaseWorkspace = allMvpReleaseWorkspaces.find((ws) => ws.ventureId === venture.id);
    const pilotCohortSignalGate = allPilotCohortSignalGates.find((gate) => gate.ventureId === venture.id);
    const noSendEmailGateWorklist = allNoSendEmailGateWorklist.filter((item) => item.ventureId === venture.id);
    const launchControlQueue = allLaunchControlQueue.filter((item) => item.ventureId === venture.id);
    const demandCaptureProofQueue = allDemandCaptureProofQueue.filter((item) => item.ventureId === venture.id);
    const demandSourceBlockerDrilldowns = allDemandSourceBlockerDrilldowns.filter((item) => item.ventureIds.includes(venture.id));
    const portfolioDecisionCommandQueue = allPortfolioDecisionCommandQueue.filter((item) => item.ventureId === venture.id);
    const convertedPainMemories = buildVentureConvertedPainMemories([venture]);
    const wrongClaimMemories = buildVentureWrongClaimMemories([venture]);
    const workedChannelMemories = buildVentureWorkedChannelMemories([venture]);
    const failedOutreachMemories = buildVentureFailedOutreachMemories([venture]);
    const convertedPricingMemories = buildVentureConvertedPricingMemories([venture]);
    const mvpFeatureMemories = buildVentureMvpFeatureMemories([venture]);
    const retainedUserMemories = buildVentureRetainedUserMemories([venture]);
    const successPredictionMemories = buildVentureSuccessPredictionMemories([venture]);
    const vanityMetricMemories = buildVentureVanityMetricMemories([venture]);
    const generatedCodePatternMemories = buildVentureGeneratedCodePatternMemories([venture]);
    const empiricalCalibrationMemories = buildVentureEmpiricalCalibrationMemories([venture]);
    const fakeMarketMemories = buildVentureFakeMarketMemories([venture]);
    const weakBranchKillMemories = buildVentureWeakBranchKillMemories([venture]);
    const searchable = [
      venture.title,
      venture.lifecycleStatus,
      venture.targetBuyer,
      venture.painStatement,
      venture.productWedge,
      venture.revenueModel,
      venture.pricingHypothesis,
      venture.retentionMechanism,
      "why now",
      venture.whyNow?.headline,
      venture.whyNow?.confidence,
      venture.whyNow?.expiringWindow,
      ...(venture.whyNow?.drivers ?? []),
      ...(venture.whyNow?.risks ?? []),
      ...(venture.whyNow?.sources ?? []).flatMap((source) => [
        source.platform,
        source.title,
        source.summary,
        source.keywords,
        source.url,
      ]),
      "mvp scope",
      venture.mvpScope?.confidence,
      venture.mvpScope?.source,
      venture.mvpScope?.timeToMvp,
      ...(venture.mvpScope?.mustHaveFeatures ?? []),
      ...(venture.mvpScope?.deferredFeatures ?? []),
      ...(venture.mvpScope?.dependencies ?? []),
      "build estimate",
      venture.buildEstimate?.effortLevel,
      venture.buildEstimate?.timeRange,
      venture.buildEstimate?.builderProfile,
      venture.buildEstimate?.confidence,
      String(venture.buildEstimate?.effortScore ?? ""),
      ...(venture.buildEstimate?.complexityDrivers ?? []),
      ...(venture.buildEstimate?.riskAdjustments ?? []),
      "evidence confidence",
      venture.evidenceConfidence?.label,
      String(venture.evidenceConfidence?.score ?? ""),
      String(venture.evidenceConfidence?.sourceCount ?? ""),
      String(venture.evidenceConfidence?.platformCount ?? ""),
      ...(venture.evidenceConfidence?.sourcePlatforms ?? []),
      ...(venture.evidenceConfidence?.supportingSignals ?? []),
      ...(venture.evidenceConfidence?.gaps ?? []),
      "reasoning debate",
      venture.reasoningDebate?.bullCase,
      venture.reasoningDebate?.bearCase,
      venture.reasoningDebate?.lazyConsensus,
      venture.reasoningDebate?.nonObviousInsight,
      venture.reasoningDebate?.fatalAssumption,
      venture.reasoningDebate?.fastestValidationPath,
      venture.reasoningDebate?.clearestKillReason,
      venture.reasoningDebate?.downsideIfWrong,
      venture.reasoningDebate?.confidence,
      ...(venture.reasoningDebate?.sourceSignals ?? []),
      "evaluation lenses",
      ...Object.values(venture.evaluationLenses ?? {}).flatMap((lens) => [
        lens.label,
        String(lens.score),
        lens.confidence,
        ...lens.signals,
        ...lens.gaps,
        lens.nextAction,
      ]),
      "converted pain memory",
      ...convertedPainMemories.flatMap((memory) => [
        memory.targetBuyer,
        memory.painStatement,
        memory.strongestSignal,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.conversionScore),
        String(memory.paidUserCount),
        String(memory.revenueCents),
        ...memory.channels,
        ...memory.evidence,
      ]),
      "wrong claim memory",
      ...wrongClaimMemories.flatMap((memory) => [
        memory.sourceType,
        memory.severity,
        memory.claim,
        memory.correction,
        memory.evidence,
        memory.correctedBelief,
        memory.neverReuse,
        memory.nextAction,
      ]),
      "worked channel memory",
      ...workedChannelMemories.flatMap((memory) => [
        memory.channel,
        memory.paybackStatus,
        memory.strongestSignal,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.channelScore),
        String(memory.signupCount),
        String(memory.activatedCount),
        String(memory.retainedUserCount),
        String(memory.paidUserCount),
        String(memory.spendCents),
        String(memory.revenueCents),
        String(memory.cacCents),
        ...memory.sourceTypes,
        ...memory.evidence,
      ]),
      "failed outreach memory",
      ...failedOutreachMemories.flatMap((memory) => [
        memory.sourceType,
        memory.severity,
        memory.persona,
        memory.channel,
        memory.message,
        memory.failureReason,
        memory.evidence,
        memory.neverRepeat,
        memory.reusableLesson,
        memory.nextAction,
      ]),
      "converted pricing memory",
      ...convertedPricingMemories.flatMap((memory) => [
        memory.pricingHypothesis,
        memory.acceptedPrice,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.conversionScore),
        String(memory.qualifiedBuyerCount),
        String(memory.paidCommitmentCount),
        String(memory.invoiceRequestCount),
        String(memory.paidSignalCount),
        String(memory.revenueCents),
        ...memory.evidence,
      ]),
      "mvp feature memory",
      ...mvpFeatureMemories.flatMap((memory) => [
        memory.feature,
        memory.proofStatus,
        memory.qaStatus,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.impactScore),
        String(memory.requestedCount),
        String(memory.roadmapTaskCount),
        String(memory.supportIssueCount),
        String(memory.activationCount),
        String(memory.retainedUserCount),
        String(memory.paidUserCount),
        ...memory.sourceTypes,
        ...memory.evidence,
      ]),
      "retained user memory",
      ...retainedUserMemories.flatMap((memory) => [
        memory.cohortLabel,
        memory.targetBuyer,
        memory.acquisitionChannel,
        memory.activationEvent,
        memory.retentionWindow,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.retentionScore),
        String(memory.signupCount),
        String(memory.activatedCount),
        String(memory.retainedUserCount),
        String(memory.paidUserCount),
        String(memory.revenueCents),
        String(memory.supportIssueCount),
        String(memory.retentionRate),
        String(memory.paidRate),
        ...memory.evidence,
      ]),
      "success prediction memory",
      ...successPredictionMemories.flatMap((memory) => [
        memory.type,
        memory.predictedOutcome,
        memory.predictionAlignment,
        memory.successThreshold,
        memory.result,
        memory.interpretation,
        memory.strongestOutcome,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.signalScore),
        String(memory.conversionProbability),
        String(memory.retentionProbability),
        String(memory.expansionPotential),
        String(memory.buyerUrgency),
        String(memory.budgetLikelihood),
        String(memory.channelReach),
        String(memory.pricingSignalCount),
        String(memory.paidCommitmentCount),
        String(memory.retainedUserCount),
        String(memory.revenueCents),
        ...memory.evidence,
      ]),
      "vanity metric memory",
      ...vanityMetricMemories.flatMap((memory) => [
        memory.sourceType,
        memory.severity,
        memory.metricLabel,
        memory.metricValue,
        memory.weakOutcome,
        memory.evidence,
        memory.whyMisleading,
        memory.neverTreatAs,
        memory.nextAction,
        String(memory.metricCount),
      ]),
      "generated code pattern memory",
      ...generatedCodePatternMemories.flatMap((memory) => [
        memory.appName,
        memory.scaffoldStatus,
        memory.proofStatus,
        memory.qaStatus,
        memory.fastestPattern,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.patternScore),
        String(memory.fileCount),
        String(memory.passedCheckCount),
        String(memory.requiredCheckCount),
        String(memory.passedMvpCheckCount),
        ...memory.sourceSignaturePreview,
        ...memory.commandLane,
        ...memory.evidence,
      ]),
      "empirical calibration memory",
      ...empiricalCalibrationMemories.flatMap((memory) => [
        memory.gullibilityRisk,
        memory.strongestTrustSignal,
        memory.strongestDiscountSignal,
        memory.reusableLesson,
        memory.nextAction,
        String(memory.calibrationScore),
        String(memory.confirmedPredictionCount),
        String(memory.surprisedPredictionCount),
        String(memory.vanityTrapCount),
        String(memory.failureLessonCount),
        String(memory.supportBurdenCount),
        ...memory.evidence,
      ]),
      "fake market memory",
      ...fakeMarketMemories.flatMap((memory) => [
        memory.marketLabel,
        memory.targetBuyer,
        memory.painStatement,
        memory.demandDriftStatus,
        memory.killRecommendation,
        memory.whyAttractive,
        memory.whyFake,
        memory.neverRepeat,
        memory.nextAction,
        String(memory.fakeScore),
        String(memory.baselineDemandScore),
        String(memory.actualDemandScore),
        String(memory.vanityTrapCount),
        String(memory.failureLessonCount),
        ...memory.evidence,
      ]),
      venture.opportunityDemandSnapshot?.source,
      venture.opportunityDemandSnapshot?.buyer,
      String(venture.opportunityDemandSnapshot?.demandScore ?? ""),
      String(venture.opportunityDemandSnapshot?.painUrgencyScore ?? ""),
      String(venture.opportunityDemandSnapshot?.demandEvidenceScore ?? ""),
      ...(venture.opportunityDemandSnapshot?.demandSignals ?? []),
      ...(venture.opportunityDemandSnapshot?.warnings ?? []),
      "demand drift",
      demandDrift.status,
      String(demandDrift.baselineDemandScore),
      String(demandDrift.actualDemandScore),
      String(demandDrift.drift),
      demandDrift.reason,
      demandDrift.nextAction,
      ...demandDrift.components.flatMap((component) => [
        component.source,
        component.label,
        component.evidence,
        String(component.score),
      ]),
      "founder execution memo",
      founderMemo.status,
      founderMemo.statusReason,
      founderMemo.primaryDecision,
      founderMemo.primaryNextAction,
      founderMemo.demandDriftStatus,
      founderMemo.marketConfidence,
      founderMemo.technicalTicket,
      founderMemo.productSpec,
      founderMemo.autonomyBoundary,
      founderMemo.markdown,
      ...founderMemo.sourceEvidence,
      ...founderMemo.sections.flatMap((section) => [
        section.heading,
        section.body,
        section.nextAction,
      ]),
      "experiment launch pack",
      launchPack.status,
      launchPack.title,
      launchPack.audience,
      launchPack.channel,
      launchPack.hypothesis,
      launchPack.successMetric,
      launchPack.failureMetric,
      launchPack.replayCommand,
      launchPack.markdown,
      ...launchPack.landingPageSections,
      ...launchPack.channelCopy,
      ...launchPack.riskChecks,
      ...launchPack.approvalGates,
      ...launchPack.checklist,
      "qa release report",
      qaReport.status,
      String(qaReport.releaseReadinessScore),
      qaReport.artifactSummary,
      qaReport.supportRiskSummary,
      qaReport.deploymentBoundary,
      qaReport.launchRiskSummary,
      qaReport.markdown,
      ...qaReport.blockers,
      ...qaReport.warnings,
      ...qaReport.checklist,
      "deployment readiness packet",
      deploymentPacket.status,
      String(deploymentPacket.readinessScore),
      deploymentPacket.generatedAppProofStatus,
      deploymentPacket.qaStatus,
      deploymentPacket.deploymentProofStatus,
      deploymentPacket.approvalBoundary,
      deploymentPacket.noDeployBoundary,
      deploymentPacket.financeRisk,
      deploymentPacket.supportRisk,
      deploymentPacket.markdown,
      ...deploymentPacket.blockers,
      ...deploymentPacket.requiredApprovals,
      ...deploymentPacket.evidence,
      ...deploymentPacket.proposalSteps,
      ...deploymentPacket.rollbackPlan,
      "deployment environment matrix",
      deploymentMatrix.productionBoundary,
      deploymentMatrix.markdown,
      "deployment owner worklist",
      ...deploymentMatrix.targets.flatMap((target) => [
        target.label,
        target.status,
        target.proofSummary,
        target.approvalBoundary,
        target.nextAction,
        target.status !== "ready" ? "release-owner" : "",
        target.status !== "ready" ? "support-owner" : "",
        target.linkedRoadmapTaskId ?? "",
        target.linkedRoadmapTaskOwner ?? "",
        target.linkedRoadmapTaskStatus ?? "",
        target.linkedRoadmapTaskTitle ?? "",
        target.linkedSupportIssueId ?? "",
        target.linkedSupportIssueOwner ?? "",
        target.linkedSupportIssueStatus ?? "",
        target.linkedSupportIssueTitle ?? "",
        ...target.requiredProof,
      ]),
      "deployment escalation audit replay",
      deploymentEscalationAuditRollup.markdown,
      ...deploymentEscalationAuditRollup.items.flatMap((item) => [
        item.actionType,
        item.actor,
        item.approvalLevel,
        item.status,
        item.sideEffect,
        item.sourceRecordId,
        item.riskNote,
        item.replayNote,
        item.evidence,
        item.nextAction,
      ]),
      "investor brief",
      investorBrief.status,
      String(investorBrief.investabilityScore),
      investorBrief.recommendation,
      investorBrief.marketSummary,
      investorBrief.demandSummary,
      investorBrief.tractionSummary,
      investorBrief.revenueSummary,
      investorBrief.riskSummary,
      investorBrief.qaSummary,
      investorBrief.nextAsk,
      investorBrief.markdown,
      ...investorBrief.sections.flatMap((section) => [
        section.heading,
        section.body,
        section.nextAction,
      ]),
      "financial model",
      financialModel.status,
      String(financialModel.financeScore),
      String(financialModel.receivedRevenueCents),
      String(financialModel.committedRevenueCents),
      String(financialModel.cohortRevenueCents),
      String(financialModel.channelRevenueCents),
      String(financialModel.totalEvidenceRevenueCents),
      String(financialModel.expenseCents),
      String(financialModel.acquisitionSpendCents),
      String(financialModel.netEvidenceCashCents),
      String(financialModel.paidUserCount),
      String(financialModel.blendedCacCents),
      financialModel.paybackStatus,
      financialModel.runwayRisk,
      financialModel.scalingThreshold,
      financialModel.revenueSummary,
      financialModel.expenseSummary,
      financialModel.unitEconomicsSummary,
      financialModel.runwaySummary,
      financialModel.markdown,
      ...financialModel.assumptions,
      ...financialModel.risks,
      ...financialModel.nextActions,
      "portfolio charts",
      "Evidence Readiness Chart",
      "Demand Reality Chart",
      "Finance Score Chart",
      "QA Readiness Chart",
      "Net Evidence Cash Chart",
      "Lifecycle Distribution Chart",
      "Kill Scale Recommendation Chart",
      "Deployment Owner Workload Chart",
      "Deployment Environment Workload Chart",
      "Deployment SLA Workload Chart",
      "Deployment Status Workload Chart",
      "Deployment Escalation Status Chart",
      "Deployment Escalation Side Effect Chart",
      "Deployment Escalation Actor Chart",
      String(evidenceProfile.readinessScore),
      evidenceProfile.readiness,
      "outreach campaign",
      outreachCampaign.status,
      outreachCampaign.persona,
      outreachCampaign.channel,
      outreachCampaign.approvalBoundary,
      outreachCampaign.noSendBoundary,
      outreachCampaign.markdown,
      ...outreachCampaign.audienceSegments,
      ...outreachCampaign.messageSequence,
      ...outreachCampaign.proofPoints,
      ...outreachCampaign.riskChecks,
      ...outreachCampaign.sourceEvidence,
      ...outreachCampaign.nextActions,
      "generated app handoff",
      generatedApp.status,
      generatedApp.appName,
      generatedApp.repoPath,
      generatedApp.sourceCodeStatus,
      generatedApp.generationBoundary,
      generatedApp.deploymentBoundary,
      generatedApp.owner,
      generatedApp.markdown,
      ...generatedApp.routePlan,
      ...generatedApp.fileManifest,
      ...generatedApp.dataModel,
      ...generatedApp.envVars,
      ...generatedApp.verificationCommands,
      ...generatedApp.qaChecklist,
      "generated app source scaffold",
      sourceScaffold.status,
      sourceScaffold.appName,
      sourceScaffold.localTargetPath,
      sourceScaffold.sourceBoundary,
      sourceScaffold.materializationInstruction,
      sourceScaffold.runnableProofStatus,
      sourceScaffold.markdown,
      ...sourceScaffold.noFakeSourceSafeguards,
      ...sourceScaffold.verificationCommands,
      ...sourceScaffold.proofCaptureChecklist,
      ...sourceScaffold.sourceFiles.flatMap((file) => [
        file.path,
        file.role,
        file.language,
        file.content,
        file.contentSignature,
      ]),
      "generated app verification proof",
      generatedAppProof.status,
      generatedAppProof.appName,
      generatedAppProof.targetPath,
      generatedAppProof.proofSummary,
      String(generatedAppProof.passedCheckCount),
      String(generatedAppProof.requiredCheckCount),
      generatedAppProof.materializerCommand,
      generatedAppProof.verifierCommand,
      generatedAppProof.markdown,
      ...generatedAppProof.checks.flatMap((check) => [
        check.label,
        check.command,
        check.status,
        check.evidence,
      ]),
      ...generatedAppProof.missingProof,
      ...generatedAppProof.nextActions,
      "kill decision artifact",
      killDecision.recommendation,
      killDecision.severity,
      String(killDecision.confidenceScore),
      killDecision.latestRecordedDecision,
      killDecision.primaryReason,
      killDecision.markdown,
      ...killDecision.evidenceForStopping,
      ...killDecision.evidenceForContinuing,
      ...killDecision.stopRules,
      ...killDecision.pivotTriggers,
      ...killDecision.scalePrerequisites,
      ...killDecision.revivalTriggers,
      ...killDecision.nextActions,
      "weak branch kill memory",
      "kill weak branches",
      "no spend no outreach",
      ...weakBranchKillMemories.flatMap((memory) => [
        memory.sourceType,
        memory.sourceTitle,
        memory.status,
        memory.recommendation,
        memory.severity,
        memory.primaryReason,
        memory.nextAction,
        memory.markdown,
        String(memory.confidenceScore),
        ...memory.evidence,
        ...memory.stopRules,
        ...memory.noGoBoundaries,
        ...memory.failureLessons,
        ...memory.revivalConditions,
      ]),
      "revenue generation posture",
      "generate revenue",
      revenuePosture.status,
      String(revenuePosture.captureScore),
      revenuePosture.paybackStatus,
      revenuePosture.pricingCalibrationStatus,
      revenuePosture.primaryRevenueSource,
      revenuePosture.summary,
      revenuePosture.nextAction,
      revenuePosture.markdown,
      String(revenuePosture.receivedRevenueCents),
      String(revenuePosture.committedRevenueCents),
      String(revenuePosture.cohortRevenueCents),
      String(revenuePosture.channelRevenueCents),
      String(revenuePosture.totalEvidenceRevenueCents),
      String(revenuePosture.paidPricingSignalCount),
      String(revenuePosture.paidCommitmentCount),
      String(revenuePosture.invoiceRequestCount),
      String(revenuePosture.paidActivationCohortCount),
      String(revenuePosture.paidCohortUserCount),
      String(revenuePosture.paidBackChannelCount),
      String(revenuePosture.channelPaybackCoverageCents),
      String(revenuePosture.acquisitionSpendCents),
      ...revenuePosture.evidence,
      ...revenuePosture.gaps,
      "scale strong branch plan",
      "scale strong branches",
      "human-approved spend ceiling",
      scaleStrongBranchPlan.status,
      scaleStrongBranchPlan.supportStatus,
      scaleStrongBranchPlan.revenueStatus,
      scaleStrongBranchPlan.financeStatus,
      scaleStrongBranchPlan.killPressureRecommendation,
      scaleStrongBranchPlan.strongestRevenueEvidence,
      scaleStrongBranchPlan.summary,
      scaleStrongBranchPlan.nextAction,
      scaleStrongBranchPlan.markdown,
      String(scaleStrongBranchPlan.scaleScore),
      String(scaleStrongBranchPlan.paidBackChannelCount),
      String(scaleStrongBranchPlan.openSupportIssueCount),
      String(scaleStrongBranchPlan.highSupportIssueCount),
      String(scaleStrongBranchPlan.resolvedSupportIssueCount),
      String(scaleStrongBranchPlan.humanApprovedSpendAuditCount),
      String(scaleStrongBranchPlan.humanApprovedSpendCeilingCents),
      ...scaleStrongBranchPlan.evidence,
      ...scaleStrongBranchPlan.blockers,
      ...scaleStrongBranchPlan.stopRules,
      "spawned venture draft",
      "spawn new ventures",
      "branch draft",
      ...spawnedVentureDrafts.flatMap((draft) => [
        draft.branchSourceType,
        draft.status,
        draft.proposedTitle,
        draft.targetBuyer,
        draft.painStatement,
        draft.productWedge,
        draft.channel,
        draft.pricingHypothesis,
        draft.sourceMemoryLabel,
        draft.summary,
        draft.provenance,
        draft.markdown,
        String(draft.confidenceScore),
        ...draft.evidence,
        ...draft.risks,
        ...draft.kickoffActions,
      ]),
      "related idea merge audit",
      "merge related ideas",
      "merge audit",
      ...relatedIdeaMergeAudits.flatMap((audit) => [
        audit.primaryTitle,
        audit.relatedTitle,
        audit.recommendation,
        audit.sharedThesisSummary,
        audit.nextAction,
        audit.markdown,
        String(audit.similarityScore),
        ...audit.matchedFields,
        ...audit.differencesToPreserve,
        ...audit.evidenceProvenance.primaryEvidence,
        ...audit.evidenceProvenance.relatedEvidence,
        ...audit.risks,
      ]),
      "learning reinvestment queue",
      "reinvest learning",
      "old learning changes the next branch",
      ...learningReinvestmentQueue.flatMap((item) => [
        item.title,
        item.sourceType,
        item.sourceArtifactLabel,
        item.priority,
        item.status,
        item.owner,
        item.learning,
        item.nextExperiment,
        item.proofRequired,
        item.changedBranchInstruction,
        item.expectedImpact,
        item.markdown,
        ...item.evidence,
      ]),
      "opportunity discovery backlog",
      "discover opportunities",
      "next research command",
      ...opportunityDiscoveryBacklog.flatMap((item) => [
        item.title,
        item.sourceType,
        item.sourceArtifactLabel,
        item.priority,
        item.status,
        item.owner,
        item.targetBuyer,
        item.painStatement,
        item.opportunityWedge,
        item.discoveryRationale,
        item.nextResearchCommand,
        item.proofRequired,
        item.improvedVentureInstruction,
        item.markdown,
        String(item.confidenceScore),
        ...item.sourceProvenance,
      ]),
      "overlooked opportunity atlas",
      "overlooked high value opportunity",
      "hidden wedge rationale",
      "not recycled proof",
      "cheap internal test command",
      ...overlookedOpportunityAtlas.flatMap((item) => [
        item.title,
        item.sourceType,
        item.sourceArtifactLabel,
        item.priority,
        item.status,
        item.owner,
        item.targetBuyer,
        item.painStatement,
        item.hiddenWedge,
        item.hiddenWedgeRationale,
        item.notRecycledProof,
        item.cheapInternalTestCommand,
        item.humanReviewBoundary,
        item.noExternalSideEffectProof,
        item.nextAction,
        item.markdown,
        String(item.rankScore),
        String(item.confidenceScore),
        String(item.noveltyScore),
        ...item.sourceProvenance,
      ]),
      "atlas validation command packs",
      "prove whether anyone wants one",
      "validation command pack",
      "cheap internal validation command",
      "demand drift update instruction",
      "approval gated validation pack",
      ...atlasValidationCommandPacks.flatMap((pack) => [
        pack.title,
        pack.atlasItemTitle,
        pack.atlasSourceArtifactLabel,
        pack.sourceType,
        pack.status,
        pack.priority,
        pack.owner,
        pack.targetBuyer,
        pack.hiddenWedge,
        pack.hypothesis,
        pack.cheapInternalValidationCommand,
        pack.successCriteria,
        pack.failureCriteria,
        pack.pivotCriteria,
        pack.demandDriftUpdateInstruction,
        pack.humanReviewBoundary,
        pack.noExternalSideEffectProof,
        pack.nextAction,
        pack.markdown,
        String(pack.rankScore),
        String(pack.confidenceScore),
        String(pack.noveltyScore),
        ...pack.manualResultFields,
        ...pack.manualResultThresholds,
        ...pack.sourceProvenance,
        ...pack.approvalGates,
      ]),
      "atlas validation result ledger",
      "manual validation result",
      "validation result ledger",
      "recorded atlas validation outcome",
      "manual demand proof",
      ...atlasValidationResultLedger.flatMap((item) => [
        item.atlasItemTitle,
        item.sourcePackTitle,
        item.outcome,
        item.statusSummary,
        item.strongestQuote,
        item.strongestObjection,
        item.evidenceNote,
        item.learning,
        item.owner,
        item.nextAction,
        item.noExternalSideEffectProof,
        item.demandDriftUpdate,
        item.markdown,
        String(item.qualifiedBuyerCount),
        String(item.painConfirmationCount),
        String(item.hiddenWedgeResonanceCount),
        String(item.paidPricingSignalCount),
        String(item.demandDriftScore),
      ]),
      "product build command queue",
      "build products",
      "no fake source boundary",
      ...productBuildCommands.flatMap((command) => [
        command.title,
        command.sourceType,
        command.sourceArtifactLabel,
        command.status,
        command.priority,
        command.owner,
        command.appName,
        command.buildCommand,
        command.artifactTarget,
        command.proofRequired,
        command.noFakeSourceBoundary,
        command.nextAction,
        command.markdown,
        ...command.evidence,
      ]),
      "product build command run ledger",
      "local product build command run",
      "product build run proof",
      "validation-backed product build run",
      "no external build side effect",
      ...productBuildCommandRuns.flatMap((item) => [
        item.commandTitle,
        item.sourceType,
        item.sourceArtifactLabel,
        item.runState,
        item.commandStatus,
        item.owner,
        item.appName,
        item.buildCommand,
        item.artifactTarget,
        item.runProof,
        item.localArtifactProof,
        item.verifierReportProof,
        item.noExternalSideEffectProof,
        item.learning,
        item.proofRequired,
        item.noFakeSourceBoundary,
        item.statusSummary,
        item.markdown,
        ...item.evidence,
      ]),
      "executable mvp release workspace",
      "build first product release workspace",
      "promoted product build run",
      "source path",
      "verifier report proof",
      "qa proof",
      "no-deploy release boundary",
      ...(mvpReleaseWorkspace ? [
        mvpReleaseWorkspace.status,
        mvpReleaseWorkspace.appName,
        mvpReleaseWorkspace.sourcePath,
        mvpReleaseWorkspace.verifierReportProof,
        mvpReleaseWorkspace.qaProof,
        mvpReleaseWorkspace.chosenRunState,
        mvpReleaseWorkspace.generatedAppProofStatus,
        mvpReleaseWorkspace.qaStatus,
        mvpReleaseWorkspace.owner,
        mvpReleaseWorkspace.setupCommand,
        mvpReleaseWorkspace.testCommand,
        mvpReleaseWorkspace.buildCommand,
        mvpReleaseWorkspace.browserSmokeCommand,
        mvpReleaseWorkspace.noDeployBoundary,
        mvpReleaseWorkspace.noExternalSideEffectProof,
        mvpReleaseWorkspace.markdown,
        ...mvpReleaseWorkspace.nextActions,
        ...mvpReleaseWorkspace.evidence,
      ] : []),
      "launch control queue",
      "launch experiments",
      "no external send spend deploy",
      ...launchControlQueue.flatMap((item) => [
        item.title,
        item.sourceType,
        item.sourceArtifactLabel,
        item.status,
        item.priority,
        item.owner,
        item.launchCommand,
        item.humanApprovalBoundary,
        item.successMetric,
        item.failureMetric,
        item.noExternalActionProof,
        item.replayCommand,
        item.nextAction,
        item.markdown,
        ...item.evidence,
      ]),
      "demand capture proof queue",
      "capture demand",
      "no fake demand boundary",
      ...demandCaptureProofQueue.flatMap((item) => [
        item.title,
        item.sourceType,
        item.sourceArtifactLabel,
        item.status,
        item.priority,
        item.owner,
        item.captureCommand,
        item.qualifiedDemandMetric,
        item.sourceProof,
        item.noFakeDemandBoundary,
        item.followUpAction,
        item.markdown,
        ...item.evidence,
      ]),
      ...(demandSourceBlockerDrilldowns.length > 0 ? [
        "demand source blocker drilldown",
        "blocker source mix drilldown",
        "jump to blocker source",
        ...demandSourceBlockerDrilldowns.flatMap((item) => [
          item.sourceType,
          item.summary,
          item.searchQuery,
          item.markdown,
          String(item.count),
          String(item.blockedCount),
          String(item.weakPressureCount),
          String(item.ventureCount),
          ...item.ventureTitles,
          ...item.commandIds,
          ...item.decisionCounts.map((entry) => `${entry.decision}: ${entry.count}`),
          ...item.evidence,
        ]),
      ] : []),
      "portfolio decision command queue",
      "recommend continue pivot kill",
      "continue pivot kill recommendation",
      "human review boundary",
      "no-send email gate reply demand",
      "no-send reply demand influence",
      "decision confidence note",
      "demand source provenance",
      "non-no-send demand source",
      "demand source blocker provenance",
      "blocked non-no-send demand source",
      ...portfolioDecisionCommandQueue.flatMap((command) => [
        command.title,
        command.recommendedDecision,
        command.status,
        command.priority,
        command.owner,
        command.decisionCommand,
        command.contradictionProof,
        command.nextCommand,
        command.humanReviewBoundary,
        command.demandCaptureSummary,
        command.demandSourceProvenanceSummary,
        command.demandSourceDecisionNote,
        command.demandSourceBlockerSummary,
        command.confidenceNote,
        command.revenueSummary,
        command.launchSummary,
        command.productProofSummary,
        command.supportSummary,
        command.scaleSummary,
        command.killPressureSummary,
        command.noSendReplyDemandSummary,
        command.noSendReplyDecisionNote,
        command.markdown,
        String(command.confidenceScore),
        ...command.evidence,
        ...command.blockers,
        ...command.demandSourceEvidence,
        ...command.demandSourceBlockerEvidence,
        ...command.noSendReplyDemandEvidence,
      ]),
      "pilot cohort signal gate",
      "capture inbound pilot signal",
      "no-send pilot cohort",
      "activation cohort draft",
      "demand capture proof draft",
      "no contact no deploy",
      ...(pilotCohortSignalGate ? [
        pilotCohortSignalGate.status,
        pilotCohortSignalGate.priority,
        pilotCohortSignalGate.owner,
        pilotCohortSignalGate.cohortLabel,
        pilotCohortSignalGate.inboundSignalSource,
        pilotCohortSignalGate.localCaptureCommand,
        pilotCohortSignalGate.demandCaptureProofDraft,
        pilotCohortSignalGate.qualifiedDemandMetric,
        pilotCohortSignalGate.noSendBoundary,
        pilotCohortSignalGate.noDeployBoundary,
        pilotCohortSignalGate.noExternalSideEffectProof,
        pilotCohortSignalGate.nextAction,
        pilotCohortSignalGate.markdown,
        pilotCohortSignalGate.activationCohortDraft.signupTarget,
        pilotCohortSignalGate.activationCohortDraft.activatedTarget,
        pilotCohortSignalGate.activationCohortDraft.retainedTarget,
        pilotCohortSignalGate.activationCohortDraft.paidTarget,
        pilotCohortSignalGate.activationCohortDraft.revenueTarget,
        pilotCohortSignalGate.activationCohortDraft.supportTarget,
          ...pilotCohortSignalGate.evidence,
        ] : []),
      "no-send email gate",
      "email gate dispatch worklist",
      "internal outreach draft",
      "draft only do not send",
      "recipient placeholders",
      "no-send reply proof receipts",
      "reply proof dedupe",
      ...noSendEmailGateWorklist.flatMap((item) => [
        item.ventureTitle,
        item.status,
        item.priority,
        item.owner,
        item.sourceArtifactLabel,
        item.cohortLabel,
        item.draftSubject,
        item.draftBody,
        item.replayCommand,
        item.humanApprovalBoundary,
        item.noSendBoundary,
        item.noDeployBoundary,
        item.noExternalSideEffectProof,
        item.nextAction,
        item.replyProofDedupeHint,
        item.markdown,
        String(item.replyProofReceiptCount),
        ...item.replyProofTypesRecorded,
        ...item.recipientPlaceholders,
        ...item.reviewChecklist,
        ...item.evidence,
        ...item.replyProofReceipts.flatMap((receipt) => [
          receipt.proofType,
          receipt.sourceRecordId,
          receipt.sourceLabel,
          receipt.owner,
          receipt.redactedReplyNote,
          receipt.summary,
          receipt.proofMetric,
          receipt.dedupeKey,
          receipt.duplicateHint,
          receipt.noSendProof,
        ]),
      ]),
      ...venture.acquisitionChannels,
      ...venture.keyIntegrations,
      ...venture.claims,
      ...venture.contradictions,
      ...venture.untestedAssumptions,
      ...venture.evidenceSources.flatMap((source) => [
        source.platform,
        source.title,
        source.keywords,
        source.summary,
        source.url,
      ]),
      ...venture.experiments.flatMap((experiment) => [
        experiment.type,
        experiment.hypothesis,
        experiment.audience,
        experiment.channel,
        experiment.result,
        experiment.interpretation,
        experiment.nextAction,
      ]),
      ...venture.decisionHistory.flatMap((decision) => [
        decision.decision,
        decision.previousLifecycleStatus,
        decision.nextLifecycleStatus,
        decision.rationale,
        decision.nextAction,
      ]),
      ...venture.gapActionHistory.flatMap((action) => [
        action.status,
        action.type,
        action.priority,
        action.title,
        action.reason,
        action.prompt,
        action.outcome,
      ]),
      ...venture.predictionSnapshots.flatMap((prediction) => [
        prediction.predictedOutcome,
        prediction.type,
        prediction.rationale,
        prediction.successThreshold,
        prediction.failureThreshold,
        String(prediction.conversionProbability),
        String(prediction.retentionProbability),
      ]),
      ...venture.pricingSignals.flatMap((signal) => [
        signal.pricingHypothesis,
        signal.acceptedPrice,
        signal.objectionSummary,
        signal.evidenceNote,
        String(signal.qualifiedBuyerCount),
        String(signal.paidCommitmentCount),
        String(signal.invoiceRequestCount),
      ]),
      ...venture.customerInterviews.flatMap((interview) => [
        interview.persona,
        interview.channel,
        interview.painQuote,
        interview.willingnessToPay,
        interview.objections,
        interview.requestedFeatures,
        interview.sentiment,
        interview.evidenceNote,
      ]),
      ...venture.outreachApprovals.flatMap((approval) => [
        approval.approvalLevel,
        approval.status,
        approval.contactPersona,
        approval.channel,
        approval.messageDraft,
        approval.riskNote,
        approval.nextAction,
        approval.attribution,
        approval.externalSendStatus,
      ]),
      ...venture.riskRecords.flatMap((risk) => [
        risk.sourceType,
        risk.title,
        risk.detail,
        risk.severity,
        risk.status,
        risk.owner,
        risk.mitigation,
        risk.resolutionEvidence,
      ]),
      ...venture.mvpBuildWorkspaces.flatMap((workspace) => [
        workspace.status,
        workspace.owner,
        workspace.sourceCodeStatus,
        workspace.repoPath,
        workspace.setupInstructions,
        workspace.setupCommand,
        workspace.typecheckCommand,
        workspace.testCommand,
        workspace.buildCommand,
        workspace.browserSmokeCommand,
        workspace.deploymentCommand,
        workspace.deploymentPath,
        workspace.analyticsPlan,
        workspace.securityNotes,
        workspace.accessibilityPass,
        workspace.mobileBehavior,
        ...workspace.dataModel,
        workspace.operatorDashboard,
        workspace.evidenceBacklink,
        workspace.setupCheck,
        workspace.typecheckCheck,
        workspace.unitTestCheck,
        workspace.buildCheck,
        workspace.browserSmokeCheck,
        workspace.deploymentCheck,
        workspace.verificationNotes,
      ]),
      ...venture.artifactRecords.flatMap((artifact) => [
        artifact.artifactType,
        artifact.status,
        artifact.title,
        artifact.uri,
        artifact.linkedMvpBuildWorkspaceId,
        artifact.owner,
        artifact.verificationCommand,
        artifact.evidence,
        artifact.changeSummary,
      ]),
      ...venture.moneySignals.flatMap((signal) => [
        signal.type,
        signal.status,
        signal.currency,
        signal.source,
        signal.owner,
        signal.evidence,
        signal.notes,
        signal.linkedExperimentId,
        signal.externalBillingStatus,
        signal.approvalLevel,
        signal.approvalState,
        signal.externalActionState,
        signal.approvalNextAction,
        String(signal.amountCents),
      ]),
      ...venture.roadmapTasks.flatMap((task) => [
        task.sourceType,
        task.title,
        task.detail,
        task.priority,
        task.status,
        task.owner,
        task.supportLoad,
        task.riskReduction,
        task.nextAction,
      ]),
      ...venture.supportIssues.flatMap((issue) => [
        issue.issueType,
        issue.severity,
        issue.status,
        issue.sourceType,
        issue.title,
        issue.detail,
        issue.customerImpact,
        issue.supportLoad,
        issue.retentionRisk,
        issue.owner,
        issue.resolution,
        issue.nextAction,
      ]),
      ...venture.activationCohorts.flatMap((cohort) => [
        cohort.sourceType,
        cohort.cohortLabel,
        cohort.acquisitionChannel,
        cohort.activationEvent,
        cohort.retentionWindow,
        cohort.owner,
        cohort.evidence,
        cohort.learning,
        cohort.nextAction,
        String(cohort.signupCount),
        String(cohort.activatedCount),
        String(cohort.retainedCount),
        String(cohort.paidCount),
        String(cohort.revenueCents),
        String(cohort.supportIssueCount),
      ]),
      ...venture.channelEconomics.flatMap((economics) => [
        economics.sourceType,
        economics.channel,
        economics.paybackStatus,
        economics.owner,
        economics.evidence,
        economics.nextAction,
        String(economics.spendCents),
        String(economics.impressions),
        String(economics.clicks),
        String(economics.signupCount),
        String(economics.activatedCount),
        String(economics.paidCount),
        String(economics.revenueCents),
        String(economics.costPerSignupCents),
        String(economics.cacCents),
      ]),
      ...venture.autonomyAudit.flatMap((audit) => [
        audit.approvalLevel,
        audit.status,
        audit.sideEffect,
        audit.actionType,
        audit.actor,
        audit.riskNote,
        audit.replayNote,
        audit.evidence,
        audit.nextAction,
      ]),
      ...venture.agentRuns.flatMap((run) => [
        run.sourceType,
        run.status,
        run.model,
        run.prompt,
        run.outputSummary,
        run.inputEvidence,
        run.toolCalls,
        run.replayCommand,
        run.riskNote,
        run.owner,
        run.nextAction,
        String(run.tokenEstimate),
      ]),
      ...venture.competitors.flatMap((competitor) => [
        competitor.sourceType,
        competitor.competitorName,
        competitor.competitorType,
        competitor.threatLevel,
        competitor.status,
        competitor.positioning,
        competitor.evidence,
        competitor.differentiation,
        competitor.responsePlan,
        competitor.owner,
        competitor.watchCadence,
        competitor.nextAction,
      ]),
      ...venture.browserResearchTasks.flatMap((task) => [
        task.sourceType,
        task.platform,
        task.sourceTarget,
        task.prompt,
        task.status,
        task.owner,
        task.evidenceUrl,
        task.findings,
        task.replayNote,
        task.nextAction,
      ]),
      ...venture.killCriteria.killReasons,
      ...venture.killCriteria.missingEvidence,
    ].join(" ").toLowerCase();

    return searchable.includes(needle);
  });
}

export function summarizeVentureEvidence(venture: SavedVentureWorkspace): VentureEvidenceProfile {
  const scoredSources = venture.evidenceSources.map((source, index) => ({
    id: source.id || `${venture.id}-source-${index + 1}`,
    platform: source.platform || "source",
    title: source.title || "Untitled source",
    url: source.url || "",
    summary: source.summary || source.keywords || "No source summary recorded.",
    quality: scoreEvidenceQuality(source),
  }));
  const sourceCount = scoredSources.length;
  const averageScore = sourceCount > 0
    ? clampScore(scoredSources.reduce((sum, source) => sum + source.quality.score, 0) / sourceCount)
    : 0;
  const strongSourceCount = scoredSources.filter((source) => source.quality.score >= 78).length;
  const weakSourceCount = scoredSources.filter((source) => source.quality.score < 62).length;
  const missingEvidenceCount = venture.killCriteria.missingEvidence.length;
  const contradictionCount = venture.contradictions.length;
  const readinessScore = clampScore(
    averageScore
    - missingEvidenceCount * 8
    - contradictionCount * 6
    - weakSourceCount * 4,
  );
  const warnings = Array.from(new Set([
    ...scoredSources.flatMap((source) => source.quality.warnings),
    ...venture.killCriteria.missingEvidence.map((item) => `Missing evidence: ${item}`),
    ...venture.contradictions.map((item) => `Contradiction: ${item}`),
  ])).slice(0, 6);

  return {
    sourceCount,
    averageScore,
    readinessScore,
    readiness: evidenceReadinessFor({
      sourceCount,
      readinessScore,
      missingEvidenceCount,
      contradictionCount,
    }),
    strongSourceCount,
    weakSourceCount,
    missingEvidenceCount,
    contradictionCount,
    scoredSources,
    warnings,
  };
}

export function filterVenturePortfolioByEvidence(
  ventures: SavedVentureWorkspace[],
  evidenceFilter: VentureEvidenceFilter,
) {
  if (evidenceFilter === "all") return ventures;

  return ventures.filter((venture) => {
    const profile = summarizeVentureEvidence(venture);
    if (evidenceFilter === "has-gaps") return profile.missingEvidenceCount > 0;
    if (evidenceFilter === "has-contradictions") return profile.contradictionCount > 0;
    return profile.readiness === evidenceFilter;
  });
}

const STOP_WORDS = new Set([
  "that",
  "this",
  "with",
  "from",
  "into",
  "their",
  "there",
  "have",
  "will",
  "need",
  "needs",
  "user",
  "users",
  "workflow",
  "system",
  "platform",
]);

function tokensForSimilarity(value: string | undefined) {
  return new Set(
    (value ?? "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4 && !STOP_WORDS.has(token)),
  );
}

function overlapScore(left: Set<string>, right: Set<string>) {
  if (left.size === 0 || right.size === 0) return 0;
  let overlap = 0;
  left.forEach((token) => {
    if (right.has(token)) overlap += 1;
  });
  return overlap / Math.min(left.size, right.size);
}

function scoreSimilarityField(
  matchedFields: string[],
  field: string,
  draftValue: string | undefined,
  ventureValue: string | undefined,
  weight: number,
) {
  const score = overlapScore(tokensForSimilarity(draftValue), tokensForSimilarity(ventureValue));
  if (score >= 0.34) matchedFields.push(field);
  return score * weight;
}

function similarityRecommendation(score: number, matchedFields: string[]): VentureSimilarityMatch["recommendation"] {
  if (score >= 70 && matchedFields.includes("buyer") && matchedFields.includes("pain")) return "reuse";
  if (score >= 48 && (matchedFields.includes("buyer") || matchedFields.includes("pain"))) return "fork";
  if (score >= 32) return "merge";
  return "new";
}

function differenceQuestionsFor(matchedFields: string[]) {
  const questions: string[] = [];
  if (!matchedFields.includes("buyer")) questions.push("Is the buyer materially different?");
  if (!matchedFields.includes("pain")) questions.push("Is the pain more urgent or different?");
  if (!matchedFields.includes("wedge")) questions.push("Is the product wedge meaningfully different?");
  if (!matchedFields.includes("channel")) questions.push("Is the acquisition channel different enough to test separately?");
  if (!matchedFields.includes("competitors")) questions.push("Do substitutes or status quo options differ?");
  return questions.length > 0 ? questions : ["What new evidence makes this more than a duplicate?"];
}

export function findSimilarVentureTheses(
  draft: VentureThesisDraftInput,
  ventures: SavedVentureWorkspace[],
): VentureSimilarityMatch[] {
  const hasDraftSignal = [
    draft.title,
    draft.targetBuyer,
    draft.painStatement,
    draft.productWedge,
    draft.acquisitionChannel,
  ].some((value) => Boolean(value?.trim()));
  if (!hasDraftSignal) return [];

  return ventures
    .map((venture) => {
      const matchedFields: string[] = [];
      const competitorText = venture.competitors
        .flatMap((competitor) => [
          competitor.competitorName,
          competitor.positioning,
          competitor.differentiation,
          competitor.responsePlan,
        ])
        .join(" ");
      const score = clampScore(
        scoreSimilarityField(matchedFields, "title", draft.title, venture.title, 12) +
        scoreSimilarityField(matchedFields, "buyer", draft.targetBuyer, venture.targetBuyer, 24) +
        scoreSimilarityField(matchedFields, "pain", draft.painStatement, venture.painStatement, 26) +
        scoreSimilarityField(matchedFields, "wedge", draft.productWedge, venture.productWedge, 22) +
        scoreSimilarityField(matchedFields, "channel", draft.acquisitionChannel, venture.acquisitionChannels.join(" "), 10) +
        scoreSimilarityField(matchedFields, "competitors", `${draft.productWedge ?? ""} ${draft.painStatement ?? ""}`, competitorText, 6),
      );
      const recommendation = similarityRecommendation(score, matchedFields);

      return {
        ventureId: venture.id,
        title: venture.title,
        score,
        recommendation,
        matchedFields,
        differenceQuestions: differenceQuestionsFor(matchedFields),
        reason: matchedFields.length > 0
          ? `Matched ${matchedFields.join(", ")} against saved venture memory.`
          : "Low overlap with saved venture memory.",
        nextAction: recommendation === "reuse"
          ? "Reuse the existing venture workspace or record what is different before creating a duplicate."
          : recommendation === "fork"
            ? "Fork only if the unanswered difference questions create a distinct test plan."
            : recommendation === "merge"
              ? "Merge useful assumptions into the saved venture before creating a new branch."
              : "Save as a new branch only after confirming the overlap is superficial.",
      };
    })
    .filter((match) => match.score >= 18 && match.matchedFields.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function relatedIdeaMergeRecommendation(
  score: number,
  matchedFields: string[],
): VentureRelatedIdeaMergeRecommendation {
  if (score >= 72 && matchedFields.includes("buyer") && matchedFields.includes("pain")) {
    return "reuse";
  }
  if (score >= 52 && (matchedFields.includes("buyer") || matchedFields.includes("pain"))) {
    return "merge";
  }
  if (score >= 34) return "fork";
  return "keep-separate";
}

function relatedIdeaMergeNextAction(
  recommendation: VentureRelatedIdeaMergeRecommendation,
  primaryTitle: string,
  relatedTitle: string,
): string {
  if (recommendation === "reuse") {
    return `Reuse "${primaryTitle}" and archive "${relatedTitle}" after a human reviewer confirms no distinct evidence is lost.`;
  }
  if (recommendation === "merge") {
    return `Merge differentiating evidence from "${relatedTitle}" into "${primaryTitle}" with human review; do NOT delete either venture automatically.`;
  }
  if (recommendation === "fork") {
    return `Keep "${primaryTitle}" and "${relatedTitle}" as parallel forks, cross-link evidence, and review again once each fork has fresh validation.`;
  }
  return `Keep "${primaryTitle}" and "${relatedTitle}" separate; the overlap is too shallow to justify a merge.`;
}

function relatedIdeaEvidenceProvenance(venture: SavedVentureWorkspace): string[] {
  const items: string[] = [];
  venture.evidenceSources.slice(0, 3).forEach((source) => {
    const platform = source.platform?.trim() || "evidence";
    const title = source.title?.trim() || "Untitled evidence";
    const url = source.url?.trim();
    items.push(url ? `${platform}: ${title} (${url})` : `${platform}: ${title}`);
  });
  const latestDecision = venture.decisionHistory[0];
  if (latestDecision) {
    items.push(`Decision history: ${latestDecision.decision} — ${latestDecision.rationale}`);
  }
  if (venture.claims.length > 0) {
    items.push(`Recorded claim: ${venture.claims[0]}`);
  }
  return items.length > 0
    ? items.slice(0, 5)
    : [`No source-backed evidence recorded for ${venture.title}; provenance is from manual workspace fields only.`];
}

function relatedIdeaDifferences(
  primary: SavedVentureWorkspace,
  related: SavedVentureWorkspace,
  matchedFields: string[],
): string[] {
  const diffs: string[] = [];
  if (!matchedFields.includes("buyer") && primary.targetBuyer !== related.targetBuyer) {
    diffs.push(`Buyer: "${primary.targetBuyer}" vs "${related.targetBuyer}" — preserve both buyer framings before merging.`);
  }
  if (!matchedFields.includes("pain") && primary.painStatement !== related.painStatement) {
    diffs.push(`Pain: "${primary.painStatement}" vs "${related.painStatement}" — keep both pain narratives.`);
  }
  if (!matchedFields.includes("wedge") && primary.productWedge !== related.productWedge) {
    diffs.push(`Wedge: "${primary.productWedge}" vs "${related.productWedge}" — record both wedges before collapsing.`);
  }
  const primaryChannel = primary.acquisitionChannels.join(", ");
  const relatedChannel = related.acquisitionChannels.join(", ");
  if (!matchedFields.includes("channel") && primaryChannel !== relatedChannel) {
    diffs.push(`Channel: "${primaryChannel || "unknown"}" vs "${relatedChannel || "unknown"}" — keep distinct channel experiments separate.`);
  }
  if (primary.pricingHypothesis !== related.pricingHypothesis) {
    diffs.push(`Pricing hypothesis: "${primary.pricingHypothesis}" vs "${related.pricingHypothesis}" — pricing proof from one venture does not transfer.`);
  }
  if (primary.lifecycleStatus !== related.lifecycleStatus) {
    diffs.push(`Lifecycle: "${primary.lifecycleStatus}" vs "${related.lifecycleStatus}" — do not collapse ventures at different lifecycle stages.`);
  }
  if (diffs.length === 0) {
    diffs.push("No structural differences detected; confirm by reviewing decision history and experiment results before merging.");
  }
  return diffs.slice(0, 6);
}

function relatedIdeaMergeRisks(
  primary: SavedVentureWorkspace,
  related: SavedVentureWorkspace,
  recommendation: VentureRelatedIdeaMergeRecommendation,
): string[] {
  const risks: string[] = [];
  risks.push("Merging may erase distinct experiment results, contradictions, or kill-criteria recorded against each venture.");
  if (primary.decisionHistory.length > 0 && related.decisionHistory.length > 0) {
    risks.push("Both ventures already carry decision history; merging without provenance loses the audit trail.");
  }
  if (primary.lifecycleStatus === "scaling" || related.lifecycleStatus === "scaling") {
    risks.push("One side is in `scaling`; do not merge an unvalidated thesis into a scaling venture.");
  }
  if (primary.lifecycleStatus === "killed" || related.lifecycleStatus === "killed") {
    risks.push("One side is `killed`; revive only with fresh evidence rather than collapsing the records.");
  }
  if (recommendation === "reuse") {
    risks.push("Reuse assumes the primary venture's evidence covers the related thesis; verify the related buyer/pain delta first.");
  }
  if (recommendation === "fork") {
    risks.push("Forks must each maintain their own evidence trail; do not let them silently re-converge.");
  }
  return risks.slice(0, 6);
}

function relatedIdeaMergeMarkdown(
  audit: Omit<VentureRelatedIdeaMergeAudit, "markdown">,
): string {
  return [
    `# Merge Audit: ${audit.primaryTitle} ↔ ${audit.relatedTitle}`,
    `Primary venture: ${audit.primaryTitle} (${audit.primaryVentureId})`,
    `Related venture: ${audit.relatedTitle} (${audit.relatedVentureId})`,
    `Recommendation: ${audit.recommendation}`,
    `Similarity score: ${audit.similarityScore}/100`,
    `Matched fields: ${audit.matchedFields.length > 0 ? audit.matchedFields.join(", ") : "none"}`,
    "",
    "## Shared thesis",
    audit.sharedThesisSummary,
    "",
    "## Differences to preserve",
    ...audit.differencesToPreserve.map((diff) => `- ${diff}`),
    "",
    "## Evidence provenance (primary)",
    ...audit.evidenceProvenance.primaryEvidence.map((line) => `- ${line}`),
    "",
    "## Evidence provenance (related)",
    ...audit.evidenceProvenance.relatedEvidence.map((line) => `- ${line}`),
    "",
    "## Risks",
    ...audit.risks.map((risk) => `- ${risk}`),
    "",
    "## Next action",
    audit.nextAction,
    "",
    "## Human review only",
    "This audit is for human review. Ventures are NOT merged, archived, or deleted automatically.",
  ].join("\n");
}

function relatedIdeaSharedSummary(
  primary: SavedVentureWorkspace,
  related: SavedVentureWorkspace,
  matchedFields: string[],
): string {
  const parts: string[] = [];
  if (matchedFields.includes("buyer")) {
    parts.push(`shared buyer (${primary.targetBuyer} ≈ ${related.targetBuyer})`);
  }
  if (matchedFields.includes("pain")) {
    parts.push(`shared pain narrative`);
  }
  if (matchedFields.includes("wedge")) {
    parts.push(`overlapping product wedge`);
  }
  if (matchedFields.includes("channel")) {
    parts.push(`overlapping acquisition channel`);
  }
  if (matchedFields.includes("title")) {
    parts.push(`overlapping title language`);
  }
  if (matchedFields.includes("competitors")) {
    parts.push(`overlapping competitive landscape`);
  }
  if (parts.length === 0) {
    return `"${primary.title}" and "${related.title}" only share faint thematic overlap; treat as a low-confidence audit.`;
  }
  return `"${primary.title}" and "${related.title}" overlap on ${parts.join(", ")}.`;
}

function selectRelatedIdeaPrimary(
  a: SavedVentureWorkspace,
  b: SavedVentureWorkspace,
): { primary: SavedVentureWorkspace; related: SavedVentureWorkspace } {
  const aEvidence = a.evidenceSources.length;
  const bEvidence = b.evidenceSources.length;
  if (aEvidence !== bEvidence) {
    return aEvidence > bEvidence ? { primary: a, related: b } : { primary: b, related: a };
  }
  if (a.updatedAt !== b.updatedAt) {
    return a.updatedAt.localeCompare(b.updatedAt) > 0
      ? { primary: a, related: b }
      : { primary: b, related: a };
  }
  return a.id.localeCompare(b.id) <= 0
    ? { primary: a, related: b }
    : { primary: b, related: a };
}

export function buildVentureRelatedIdeaMergeAudits(
  ventures: SavedVentureWorkspace[],
): VentureRelatedIdeaMergeAudit[] {
  if (ventures.length < 2) return [];

  const audits: VentureRelatedIdeaMergeAudit[] = [];

  for (let i = 0; i < ventures.length; i += 1) {
    for (let j = i + 1; j < ventures.length; j += 1) {
      const left = ventures[i];
      const right = ventures[j];
      const matchedFields: string[] = [];
      const leftCompetitorText = left.competitors
        .flatMap((competitor) => [
          competitor.competitorName,
          competitor.positioning,
          competitor.differentiation,
          competitor.responsePlan,
        ])
        .join(" ");
      const rightCompetitorText = right.competitors
        .flatMap((competitor) => [
          competitor.competitorName,
          competitor.positioning,
          competitor.differentiation,
          competitor.responsePlan,
        ])
        .join(" ");
      const score = clampScore(
        scoreSimilarityField(matchedFields, "title", left.title, right.title, 12) +
          scoreSimilarityField(matchedFields, "buyer", left.targetBuyer, right.targetBuyer, 24) +
          scoreSimilarityField(matchedFields, "pain", left.painStatement, right.painStatement, 26) +
          scoreSimilarityField(matchedFields, "wedge", left.productWedge, right.productWedge, 22) +
          scoreSimilarityField(
            matchedFields,
            "channel",
            left.acquisitionChannels.join(" "),
            right.acquisitionChannels.join(" "),
            10,
          ) +
          scoreSimilarityField(matchedFields, "competitors", leftCompetitorText, rightCompetitorText, 6),
      );
      if (matchedFields.length < 2 && score < 36) continue;
      if (score < 24) continue;

      const recommendation = relatedIdeaMergeRecommendation(score, matchedFields);
      if (recommendation === "keep-separate" && matchedFields.length < 2) continue;

      const { primary, related } = selectRelatedIdeaPrimary(left, right);
      const sharedThesisSummary = relatedIdeaSharedSummary(primary, related, matchedFields);
      const differencesToPreserve = relatedIdeaDifferences(primary, related, matchedFields);
      const risks = relatedIdeaMergeRisks(primary, related, recommendation);
      const nextAction = relatedIdeaMergeNextAction(recommendation, primary.title, related.title);
      const auditWithoutMarkdown: Omit<VentureRelatedIdeaMergeAudit, "markdown"> = {
        id: `merge-audit-${primary.id}-${related.id}`,
        primaryVentureId: primary.id,
        primaryTitle: primary.title,
        relatedVentureId: related.id,
        relatedTitle: related.title,
        similarityScore: score,
        matchedFields,
        recommendation,
        sharedThesisSummary,
        differencesToPreserve,
        evidenceProvenance: {
          primaryEvidence: relatedIdeaEvidenceProvenance(primary),
          relatedEvidence: relatedIdeaEvidenceProvenance(related),
        },
        risks,
        nextAction,
        humanReviewRequired: true,
      };
      audits.push({
        ...auditWithoutMarkdown,
        markdown: relatedIdeaMergeMarkdown(auditWithoutMarkdown),
      });
    }
  }

  const recommendationRank: Record<VentureRelatedIdeaMergeRecommendation, number> = {
    reuse: 4,
    merge: 3,
    fork: 2,
    "keep-separate": 1,
  };
  return audits.sort((a, b) =>
    recommendationRank[b.recommendation] - recommendationRank[a.recommendation] ||
    b.similarityScore - a.similarityScore ||
    a.primaryTitle.localeCompare(b.primaryTitle),
  );
}

function draftHasSimilaritySignal(draft?: VentureThesisDraftInput) {
  if (!draft) return false;
  return [
    draft.title,
    draft.targetBuyer,
    draft.painStatement,
    draft.productWedge,
    draft.acquisitionChannel,
  ].some((value) => Boolean(value?.trim()));
}

function failureLessonDraftScore(draft: VentureThesisDraftInput | undefined, venture: SavedVentureWorkspace) {
  if (!draftHasSimilaritySignal(draft)) return 100;
  return clampScore(
    overlapScore(tokensForSimilarity(draft?.title), tokensForSimilarity(venture.title)) * 10 +
    overlapScore(tokensForSimilarity(draft?.targetBuyer), tokensForSimilarity(venture.targetBuyer)) * 28 +
    overlapScore(tokensForSimilarity(draft?.painStatement), tokensForSimilarity(venture.painStatement)) * 30 +
    overlapScore(tokensForSimilarity(draft?.productWedge), tokensForSimilarity(venture.productWedge)) * 22 +
    overlapScore(tokensForSimilarity(draft?.acquisitionChannel), tokensForSimilarity(venture.acquisitionChannels.join(" "))) * 10,
  );
}

export function buildVentureConvertedPainMemories(ventures: SavedVentureWorkspace[]): VentureConvertedPainMemory[] {
  return ventures.flatMap((venture) => {
    const paidCommitmentCount = venture.pricingSignals
      .reduce((sum, signal) => sum + signal.paidCommitmentCount, 0);
    const invoiceRequestCount = venture.pricingSignals
      .reduce((sum, signal) => sum + signal.invoiceRequestCount, 0);
    const committedOrReceivedMoneySignals = venture.moneySignals.filter((signal) => (
      (signal.type === "commitment" || signal.type === "revenue") &&
      (signal.status === "committed" || signal.status === "received")
    ));
    const moneyRevenueCents = committedOrReceivedMoneySignals
      .reduce((sum, signal) => sum + signal.amountCents, 0);
    const cohortPaidUsers = venture.activationCohorts
      .reduce((sum, cohort) => sum + cohort.paidCount, 0);
    const retainedUserCount = venture.activationCohorts
      .reduce((sum, cohort) => sum + cohort.retainedCount, 0);
    const cohortRevenueCents = venture.activationCohorts
      .reduce((sum, cohort) => sum + cohort.revenueCents, 0);
    const channelPaidUsers = venture.channelEconomics
      .reduce((sum, channel) => sum + channel.paidCount, 0);
    const channelRevenueCents = venture.channelEconomics
      .reduce((sum, channel) => sum + channel.revenueCents, 0);
    const paidBackChannelCount = venture.channelEconomics
      .filter((channel) => channel.paybackStatus === "paid-back")
      .length;
    const revenueCents = moneyRevenueCents + cohortRevenueCents + channelRevenueCents;
    const paidUserCount = paidCommitmentCount + cohortPaidUsers + channelPaidUsers;
    const evidence: string[] = [];

    if (paidCommitmentCount > 0 || invoiceRequestCount > 0) {
      evidence.push(`${paidCommitmentCount} paid pricing commitment${paidCommitmentCount === 1 ? "" : "s"} and ${invoiceRequestCount} invoice request${invoiceRequestCount === 1 ? "" : "s"}.`);
    }
    if (committedOrReceivedMoneySignals.length > 0) {
      evidence.push(`${committedOrReceivedMoneySignals.length} money signal${committedOrReceivedMoneySignals.length === 1 ? "" : "s"} worth ${formatCents(moneyRevenueCents)}.`);
    }
    if (cohortPaidUsers > 0 || retainedUserCount > 0) {
      evidence.push(`${cohortPaidUsers} paid cohort user${cohortPaidUsers === 1 ? "" : "s"} and ${retainedUserCount} retained user${retainedUserCount === 1 ? "" : "s"}.`);
    }
    if (channelPaidUsers > 0 || paidBackChannelCount > 0) {
      evidence.push(`${channelPaidUsers} paid channel user${channelPaidUsers === 1 ? "" : "s"} with ${paidBackChannelCount} paid-back channel${paidBackChannelCount === 1 ? "" : "s"}.`);
    }

    if (evidence.length === 0) return [];

    const channels = Array.from(new Set([
      ...venture.acquisitionChannels,
      ...venture.activationCohorts.map((cohort) => cohort.acquisitionChannel),
      ...venture.channelEconomics.map((channel) => channel.channel),
    ].map((channel) => channel.trim()).filter(Boolean))).slice(0, 5);
    const strongestSignal = revenueCents > 0
      ? `${formatCents(revenueCents)} recorded or committed revenue`
      : paidUserCount > 0
        ? `${paidUserCount} paid user/commitment signal${paidUserCount === 1 ? "" : "s"}`
        : `${invoiceRequestCount} invoice request${invoiceRequestCount === 1 ? "" : "s"}`;
    const conversionScore = clampScore(
      paidCommitmentCount * 14 +
      invoiceRequestCount * 8 +
      committedOrReceivedMoneySignals.length * 12 +
      Math.min(30, Math.round(revenueCents / 1000)) +
      cohortPaidUsers * 8 +
      retainedUserCount * 4 +
      channelPaidUsers * 8 +
      paidBackChannelCount * 12,
    );

    return [{
      id: `${venture.id}-converted-pain`,
      ventureId: venture.id,
      title: venture.title,
      targetBuyer: venture.targetBuyer,
      painStatement: venture.painStatement,
      conversionScore,
      strongestSignal,
      paidCommitmentCount,
      paidUserCount,
      retainedUserCount,
      revenueCents,
      channels,
      evidence: evidence.slice(0, 4),
      reusableLesson: `${venture.targetBuyer} converted around "${venture.painStatement}" when ${strongestSignal.toLowerCase()} appeared.`,
      nextAction: `Reuse this pain only with a comparable buyer, channel, and proof path: ${channels[0] ?? "attach a source channel before reuse"}.`,
    }];
  }).sort((a, b) => b.conversionScore - a.conversionScore || b.revenueCents - a.revenueCents);
}

function firstMeaningfulClaim(venture: SavedVentureWorkspace, index = 0) {
  return venture.claims[index]?.trim() ||
    venture.claims[0]?.trim() ||
    venture.productWedge.trim() ||
    venture.title;
}

export function buildVentureWrongClaimMemories(ventures: SavedVentureWorkspace[]): VentureWrongClaimMemory[] {
  const memories: VentureWrongClaimMemory[] = [];

  ventures.forEach((venture) => {
    venture.contradictions
      .map((contradiction) => contradiction.trim())
      .filter(Boolean)
      .forEach((contradiction, index) => {
        const claim = firstMeaningfulClaim(venture, index);
        memories.push({
          id: `${venture.id}-wrong-claim-contradiction-${index + 1}`,
          ventureId: venture.id,
          title: venture.title,
          sourceType: "contradiction",
          severity: "high",
          claim,
          correction: `Treat this claim as unresolved because contradicted evidence says: ${contradiction}`,
          evidence: contradiction,
          correctedBelief: `${venture.targetBuyer} has not validated "${claim}" until the contradiction is resolved with stronger source evidence.`,
          neverReuse: `Do not repeat "${claim}" as fact while "${contradiction}" remains open.`,
          nextAction: venture.killCriteria.disconfirmationPath || "Run the fastest disconfirmation path and attach source-quality evidence before reusing this claim.",
        });
      });

    calibrateVentureDemand(venture).experiments
      .filter((experiment) => experiment.status === "failed")
      .forEach((experiment) => {
        const originalExperiment = venture.experiments.find((item) => item.id === experiment.experimentId);
        const claim = originalExperiment?.hypothesis?.trim() || `${experiment.type} would meet "${experiment.successThreshold}".`;
        const evidence = `${experiment.result} ${experiment.interpretation}`.trim();
        memories.push({
          id: `${venture.id}-wrong-claim-failed-experiment-${experiment.experimentId}`,
          ventureId: venture.id,
          title: venture.title,
          sourceType: "failed-experiment",
          severity: "high",
          claim,
          correction: `${experiment.type} failed against "${experiment.failureThreshold}" before proving "${experiment.successThreshold}".`,
          evidence,
          correctedBelief: `${venture.productWedge} demand is below the planned threshold until a changed buyer, channel, offer, or wedge passes a new test.`,
          neverReuse: `Do not rerun this claim unchanged until the failure threshold changes: ${experiment.failureThreshold}.`,
          nextAction: originalExperiment?.nextAction?.trim() || "Rewrite the experiment around a different buyer, channel, offer, or price before building more product.",
        });
      });

    const pricingCalibration = calibrateVenturePricing(venture);
    if (pricingCalibration.status === "rejected") {
      const pricingEvidence = [
        pricingCalibration.latestSignal?.objectionSummary,
        pricingCalibration.latestSignal?.evidenceNote,
      ].map((value) => value?.trim()).filter(Boolean).join(" ") || pricingCalibration.note;
      memories.push({
        id: `${venture.id}-wrong-claim-rejected-pricing`,
        ventureId: venture.id,
        title: venture.title,
        sourceType: "rejected-pricing",
        severity: "high",
        claim: `Pricing claim: ${venture.pricingHypothesis}`,
        correction: `Qualified buyers rejected willingness to pay for ${venture.pricingHypothesis}.`,
        evidence: pricingEvidence,
        correctedBelief: `${venture.pricingHypothesis} is not validated until qualified buyers accept a price, request invoices, or commit money.`,
        neverReuse: `Do not label ${venture.pricingHypothesis} as validated without a paid commitment or invoice request.`,
        nextAction: "Change pricing, buyer, or packaging before treating the thesis as commercially validated.",
      });
    }

    const killDecision = latestKillDecisionFor(venture);
    if (venture.lifecycleStatus === "killed" || killDecision || venture.decision === "kill-review") {
      const claim = firstMeaningfulClaim(venture);
      const killReason = killDecision?.rationale || venture.killCriteria.killReasons[0] || "Venture was killed or marked for kill review.";
      memories.push({
        id: `${venture.id}-wrong-claim-killed-decision`,
        ventureId: venture.id,
        title: venture.title,
        sourceType: "killed-decision",
        severity: "critical",
        claim,
        correction: `The venture was killed or marked for kill review because: ${killReason}`,
        evidence: killReason,
        correctedBelief: `${claim} should stay false for operating purposes until fresh evidence changes the original kill rationale.`,
        neverReuse: venture.killCriteria.stopTriggers[0] || "Do not revive the killed claim without new evidence that changes the buyer, pain, channel, or wedge.",
        nextAction: killDecision?.nextAction || venture.killCriteria.pivotTriggers[0] || "Reopen only through a revival review with fresh contradictory evidence.",
      });
    }
  });

  const severityRank: Record<VentureWrongClaimMemory["severity"], number> = { critical: 3, high: 2, medium: 1 };
  const sourceRank: Record<VentureWrongClaimMemorySourceType, number> = {
    "killed-decision": 4,
    "failed-experiment": 3,
    "rejected-pricing": 2,
    contradiction: 1,
  };

  return memories
    .sort((a, b) => (
      severityRank[b.severity] - severityRank[a.severity] ||
      sourceRank[b.sourceType] - sourceRank[a.sourceType] ||
      a.title.localeCompare(b.title)
    ))
    .slice(0, 30);
}

interface WorkedChannelDraft {
  channel: string;
  signupCount: number;
  activatedCount: number;
  retainedUserCount: number;
  paidUserCount: number;
  spendCents: number;
  revenueCents: number;
  sourceTypes: Set<string>;
  evidence: string[];
  nextActions: string[];
  paybackStatuses: VenturePaybackStatus[];
}

function channelMemoryKey(channel: string) {
  return channel.trim().toLowerCase() || "unknown-channel";
}

export function buildVentureWorkedChannelMemories(ventures: SavedVentureWorkspace[]): VentureWorkedChannelMemory[] {
  const memories: VentureWorkedChannelMemory[] = [];

  ventures.forEach((venture) => {
    const groups = new Map<string, WorkedChannelDraft>();
    const countedCohortIds = new Set<string>();
    const getGroup = (channel: string) => {
      const normalizedChannel = channel.trim() || venture.acquisitionChannels[0] || "unknown channel";
      const key = channelMemoryKey(normalizedChannel);
      const existing = groups.get(key);
      if (existing) return existing;
      const created: WorkedChannelDraft = {
        channel: normalizedChannel,
        signupCount: 0,
        activatedCount: 0,
        retainedUserCount: 0,
        paidUserCount: 0,
        spendCents: 0,
        revenueCents: 0,
        sourceTypes: new Set<string>(),
        evidence: [],
        nextActions: [],
        paybackStatuses: [],
      };
      groups.set(key, created);
      return created;
    };

    venture.activationCohorts.forEach((cohort) => {
      const group = getGroup(cohort.acquisitionChannel);
      countedCohortIds.add(cohort.id);
      group.signupCount += cohort.signupCount;
      group.activatedCount += cohort.activatedCount;
      group.retainedUserCount += cohort.retainedCount;
      group.paidUserCount += cohort.paidCount;
      group.revenueCents += cohort.revenueCents;
      group.sourceTypes.add(`cohort:${cohort.sourceType}`);
      group.evidence.push(cohort.evidence);
      group.evidence.push(cohort.learning);
      group.nextActions.push(cohort.nextAction);
    });

    venture.channelEconomics.forEach((economics) => {
      const group = getGroup(economics.channel);
      const alreadyCountedSourceCohort = economics.sourceType === "activation-cohort" &&
        Boolean(economics.sourceRecordId) &&
        countedCohortIds.has(economics.sourceRecordId);
      if (!alreadyCountedSourceCohort) {
        group.signupCount += economics.signupCount;
        group.activatedCount += economics.activatedCount;
        group.paidUserCount += economics.paidCount;
        group.revenueCents += economics.revenueCents;
      }
      group.spendCents += economics.spendCents;
      group.sourceTypes.add(`channel:${economics.sourceType}`);
      group.paybackStatuses.push(economics.paybackStatus);
      group.evidence.push(economics.evidence);
      group.nextActions.push(economics.nextAction);
    });

    groups.forEach((group) => {
      const paybackStatus = strongestPaybackStatus(
        group.paybackStatuses,
        paybackStatusFor(group.spendCents, group.revenueCents),
      );
      const hasWorkedSignal = group.retainedUserCount > 0 ||
        group.paidUserCount > 0 ||
        group.revenueCents > 0 ||
        paybackStatus === "paid-back" ||
        paybackStatus === "partial-payback";
      if (!hasWorkedSignal) return;

      const cacCents = divideCurrencyCents(group.spendCents, group.paidUserCount);
      const channelScore = clampScore(
        (paybackStatus === "paid-back" ? 30 : paybackStatus === "partial-payback" ? 12 : 0) +
        Math.min(28, Math.round(group.revenueCents / 1000)) +
        group.paidUserCount * 10 +
        group.retainedUserCount * 5 +
        Math.min(10, group.activatedCount),
      );
      const strongestSignal = paybackStatus === "paid-back" && group.spendCents > 0
        ? `${formatCents(group.revenueCents)} revenue paid back ${formatCents(group.spendCents)} spend`
        : group.revenueCents > 0
          ? `${formatCents(group.revenueCents)} channel-attributed revenue`
          : group.paidUserCount > 0
            ? `${group.paidUserCount} paid user${group.paidUserCount === 1 ? "" : "s"} from channel evidence`
            : `${group.retainedUserCount} retained user${group.retainedUserCount === 1 ? "" : "s"} from channel evidence`;

      memories.push({
        id: `${venture.id}-worked-channel-${channelMemoryKey(group.channel).replace(/[^a-z0-9]+/g, "-")}`,
        ventureId: venture.id,
        title: venture.title,
        channel: group.channel,
        channelScore,
        paybackStatus,
        signupCount: group.signupCount,
        activatedCount: group.activatedCount,
        retainedUserCount: group.retainedUserCount,
        paidUserCount: group.paidUserCount,
        spendCents: group.spendCents,
        revenueCents: group.revenueCents,
        cacCents,
        sourceTypes: Array.from(group.sourceTypes).sort(),
        evidence: Array.from(new Set(group.evidence.map((item) => item.trim()).filter(Boolean))).slice(0, 5),
        strongestSignal,
        reusableLesson: `${group.channel} worked for ${venture.targetBuyer} when ${strongestSignal.toLowerCase()} appeared.`,
        nextAction: group.nextActions.find((action) => action.trim()) || "Repeat this channel only with the same paid, retained, or payback proof attached.",
      });
    });
  });

  const paybackRank: Record<VenturePaybackStatus, number> = {
    "paid-back": 4,
    "partial-payback": 3,
    "no-payback": 1,
    unknown: 2,
  };

  return memories
    .sort((a, b) => (
      b.channelScore - a.channelScore ||
      paybackRank[b.paybackStatus] - paybackRank[a.paybackStatus] ||
      b.revenueCents - a.revenueCents ||
      a.channel.localeCompare(b.channel)
    ))
    .slice(0, 30);
}

function outreachSeverityFrom(text: string, fallback: VentureFailedOutreachMemory["severity"]): VentureFailedOutreachMemory["severity"] {
  if (/\b(unsafe|illegal|clinical|medical|privacy|consent|spam|harassment|critical)\b/i.test(text)) return "critical";
  if (/\b(blocked|dismissed|rejected|do not|no-send|risk|legal|financial|advice)\b/i.test(text)) return "high";
  return fallback;
}

export function buildVentureFailedOutreachMemories(ventures: SavedVentureWorkspace[]): VentureFailedOutreachMemory[] {
  const memories: VentureFailedOutreachMemory[] = [];
  const pushMemory = (memory: VentureFailedOutreachMemory) => {
    memories.push({
      ...memory,
      severity: outreachSeverityFrom(`${memory.failureReason} ${memory.evidence} ${memory.neverRepeat}`, memory.severity),
    });
  };

  ventures.forEach((venture) => {
    const campaign = buildVentureOutreachCampaignBrief(venture);
    if (campaign.status === "blocked" || campaign.status === "needs-approval") {
      const sourceType: VentureFailedOutreachMemorySourceType = campaign.status === "blocked"
        ? "campaign-blocked"
        : "campaign-needs-approval";
      const failureReason = campaign.status === "blocked"
        ? campaign.approvalBoundary
        : campaign.nextActions[0] || "Campaign still needs human approval before any external send.";
      pushMemory({
        id: `${venture.id}-failed-outreach-${sourceType}`,
        ventureId: venture.id,
        title: venture.title,
        sourceType,
        severity: campaign.status === "blocked" ? "high" : "medium",
        persona: campaign.persona,
        channel: campaign.channel,
        message: campaign.messageSequence[0]?.replace(/^Opening:\s*/i, "") || "No outreach message recorded.",
        failureReason,
        evidence: campaign.noSendBoundary,
        neverRepeat: "Do not treat this outreach as sent, successful, or repeatable while the no-send approval boundary is still active.",
        reusableLesson: `${campaign.channel} outreach to ${campaign.persona} failed to clear the ${campaign.status} campaign gate.`,
        nextAction: campaign.nextActions[0] || "Record human-approved outreach before drafting another external campaign.",
      });
    }

    venture.outreachApprovals.forEach((approval) => {
      const riskGated = /\b(do not|clinical|medical|privacy|consent|spam|unsafe|legal|financial|advice|risk)\b/i.test(approval.riskNote);
      const sourceType: VentureFailedOutreachMemorySourceType | null = approval.status === "dismissed"
        ? "approval-dismissed"
        : approval.status === "draft"
          ? (riskGated ? "risk-gated" : "approval-blocked")
          : null;
      if (!sourceType) return;
      pushMemory({
        id: `${venture.id}-failed-outreach-approval-${approval.id}`,
        ventureId: venture.id,
        title: venture.title,
        sourceType,
        severity: approval.status === "dismissed" || riskGated ? "high" : "medium",
        persona: approval.contactPersona,
        channel: approval.channel,
        message: approval.messageDraft,
        failureReason: approval.status === "dismissed"
          ? `Human-approved outreach record was dismissed before send: ${approval.nextAction}`
          : `Outreach stayed in ${approval.status} state and did not clear the human approval gate.`,
        evidence: approval.riskNote,
        neverRepeat: `Do not send or reuse "${approval.messageDraft}" until the risk note is resolved: ${approval.riskNote}`,
        reusableLesson: `${approval.channel} outreach to ${approval.contactPersona} should not be repeated until the no-send record changes from ${approval.status}.`,
        nextAction: approval.nextAction,
      });
    });
  });

  const severityRank: Record<VentureFailedOutreachMemory["severity"], number> = { critical: 3, high: 2, medium: 1 };
  const sourceRank: Record<VentureFailedOutreachMemorySourceType, number> = {
    "approval-dismissed": 5,
    "risk-gated": 4,
    "campaign-blocked": 3,
    "campaign-needs-approval": 2,
    "approval-blocked": 1,
  };

  return memories
    .sort((a, b) => (
      severityRank[b.severity] - severityRank[a.severity] ||
      sourceRank[b.sourceType] - sourceRank[a.sourceType] ||
      a.channel.localeCompare(b.channel)
    ))
    .slice(0, 30);
}

export function buildVentureConvertedPricingMemories(ventures: SavedVentureWorkspace[]): VentureConvertedPricingMemory[] {
  return ventures.flatMap((venture) => {
    const pricingCalibration = calibrateVenturePricing(venture);
    const acceptedPrice = pricingCalibration.strongestAcceptedPrice !== "No accepted price recorded"
      ? pricingCalibration.strongestAcceptedPrice
      : venture.pricingHypothesis;
    const hasAcceptedPrice = venture.pricingSignals.some((signal) => signal.acceptedPrice.trim());
    const hasPaidSignal = pricingCalibration.paidSignalCount > 0;
    if (!hasAcceptedPrice && !hasPaidSignal) return [];

    const revenueSignals = venture.moneySignals.filter((signal) => (
      (signal.type === "commitment" || signal.type === "revenue") &&
      (signal.status === "committed" || signal.status === "received")
    ));
    const revenueCents = revenueSignals.reduce((sum, signal) => sum + signal.amountCents, 0);
    const evidence = [
      ...venture.pricingSignals.flatMap((signal) => [
        signal.acceptedPrice.trim() ? `Accepted price ${signal.acceptedPrice} from ${signal.qualifiedBuyerCount} qualified buyer${signal.qualifiedBuyerCount === 1 ? "" : "s"}.` : "",
        signal.paidCommitmentCount > 0 || signal.invoiceRequestCount > 0
          ? `${signal.paidCommitmentCount} paid commitment${signal.paidCommitmentCount === 1 ? "" : "s"} and ${signal.invoiceRequestCount} invoice request${signal.invoiceRequestCount === 1 ? "" : "s"}.`
          : "",
        signal.evidenceNote,
        signal.objectionSummary,
      ]),
      ...revenueSignals.map((signal) => `${formatCents(signal.amountCents)} ${signal.status} ${signal.type} from ${signal.source}.`),
    ].map((item) => item.trim()).filter(Boolean);
    const conversionScore = clampScore(
      pricingCalibration.paidSignalCount * 18 +
      pricingCalibration.qualifiedBuyerCount * 4 +
      (hasAcceptedPrice ? 16 : 0) +
      Math.min(30, Math.round(revenueCents / 1000)),
    );

    return [{
      id: `${venture.id}-converted-pricing`,
      ventureId: venture.id,
      title: venture.title,
      pricingHypothesis: venture.pricingHypothesis,
      acceptedPrice,
      conversionScore,
      qualifiedBuyerCount: pricingCalibration.qualifiedBuyerCount,
      paidCommitmentCount: pricingCalibration.paidCommitmentCount,
      invoiceRequestCount: pricingCalibration.invoiceRequestCount,
      paidSignalCount: pricingCalibration.paidSignalCount,
      revenueCents,
      evidence: Array.from(new Set(evidence)).slice(0, 6),
      reusableLesson: `${acceptedPrice} converted for ${venture.targetBuyer} when ${pricingCalibration.paidSignalCount} paid pricing signal${pricingCalibration.paidSignalCount === 1 ? "" : "s"} appeared.`,
      nextAction: "Reuse this pricing page only with comparable qualified buyers, accepted-price evidence, and invoice or paid commitment proof.",
    }];
  }).sort((a, b) => b.conversionScore - a.conversionScore || b.revenueCents - a.revenueCents);
}

interface MvpFeatureDraft {
  feature: string;
  requestedCount: number;
  roadmapTaskCount: number;
  supportIssueCount: number;
  activationCount: number;
  retainedUserCount: number;
  paidUserCount: number;
  sourceTypes: Set<string>;
  evidence: string[];
  nextActions: string[];
}

function splitFeatureList(value: string) {
  return value
    .split(/[;,]|\band\b/i)
    .map((item) => item.trim().replace(/^requested feature:\s*/i, ""))
    .filter((item) => item.length > 2 && !/^no feature requests recorded\.?$/i.test(item));
}

function featureMemoryKey(feature: string) {
  return feature.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "feature";
}

export function buildVentureMvpFeatureMemories(ventures: SavedVentureWorkspace[]): VentureMvpFeatureMemory[] {
  const memories: VentureMvpFeatureMemory[] = [];

  ventures.forEach((venture) => {
    const drafts = new Map<string, MvpFeatureDraft>();
    const generatedAppProof = buildVentureGeneratedAppVerificationProof(venture);
    const qaReport = buildVentureQaReleaseReport(venture);
    const getDraft = (feature: string) => {
      const normalized = feature.trim();
      const key = featureMemoryKey(normalized);
      const existing = drafts.get(key);
      if (existing) return existing;
      const created: MvpFeatureDraft = {
        feature: normalized,
        requestedCount: 0,
        roadmapTaskCount: 0,
        supportIssueCount: 0,
        activationCount: 0,
        retainedUserCount: 0,
        paidUserCount: 0,
        sourceTypes: new Set<string>(),
        evidence: [],
        nextActions: [],
      };
      drafts.set(key, created);
      return created;
    };

    venture.customerInterviews.forEach((interview) => {
      splitFeatureList(interview.requestedFeatures).forEach((feature) => {
        const draft = getDraft(feature);
        draft.requestedCount += 1;
        draft.sourceTypes.add("customer-interview");
        draft.evidence.push(`${interview.persona} requested: ${feature}.`);
        draft.evidence.push(interview.evidenceNote);
      });
    });

    venture.roadmapTasks.forEach((task) => {
      splitFeatureList(`${task.title}; ${task.detail}`).forEach((feature) => {
        const draft = getDraft(feature);
        draft.roadmapTaskCount += 1;
        draft.sourceTypes.add(`roadmap:${task.sourceType}`);
        draft.evidence.push(`${task.status} roadmap task: ${task.title}. ${task.detail}`);
        draft.evidence.push(task.riskReduction);
        draft.nextActions.push(task.nextAction);
      });
    });

    venture.supportIssues.forEach((issue) => {
      splitFeatureList(`${issue.title}; ${issue.detail}; ${issue.customerImpact}`).forEach((feature) => {
        const draft = getDraft(feature);
        draft.supportIssueCount += 1;
        draft.sourceTypes.add(`support:${issue.issueType}`);
        draft.evidence.push(`${issue.severity} ${issue.status} support issue: ${issue.title}. ${issue.supportLoad}`);
        draft.evidence.push(issue.retentionRisk);
        draft.nextActions.push(issue.nextAction);
      });
    });

    venture.activationCohorts.forEach((cohort) => {
      const draft = getDraft(cohort.activationEvent);
      draft.activationCount += cohort.activatedCount;
      draft.retainedUserCount += cohort.retainedCount;
      draft.paidUserCount += cohort.paidCount;
      draft.sourceTypes.add(`activation:${cohort.sourceType}`);
      draft.evidence.push(`${cohort.activatedCount} activated, ${cohort.retainedCount} retained, and ${cohort.paidCount} paid after ${cohort.activationEvent}.`);
      draft.evidence.push(cohort.learning);
      draft.nextActions.push(cohort.nextAction);
    });

    drafts.forEach((draft) => {
      const impactScore = clampScore(
        draft.requestedCount * 12 +
        draft.roadmapTaskCount * 12 +
        draft.supportIssueCount * 8 +
        Math.min(20, draft.activationCount * 2) +
        draft.retainedUserCount * 5 +
        draft.paidUserCount * 8 +
        (generatedAppProof.status === "verified" ? 18 : generatedAppProof.status === "partial-proof" ? 8 : 0) +
        (qaReport.status === "ready" ? 8 : qaReport.status === "needs-fixes" ? 4 : 0),
      );
      if (impactScore === 0) return;
      memories.push({
        id: `${venture.id}-mvp-feature-${featureMemoryKey(draft.feature)}`,
        ventureId: venture.id,
        title: venture.title,
        feature: draft.feature,
        impactScore,
        requestedCount: draft.requestedCount,
        roadmapTaskCount: draft.roadmapTaskCount,
        supportIssueCount: draft.supportIssueCount,
        activationCount: draft.activationCount,
        retainedUserCount: draft.retainedUserCount,
        paidUserCount: draft.paidUserCount,
        proofStatus: generatedAppProof.status,
        qaStatus: qaReport.status,
        sourceTypes: Array.from(draft.sourceTypes).sort(),
        evidence: Array.from(new Set(draft.evidence.map((item) => item.trim()).filter(Boolean))).slice(0, 6),
        reusableLesson: `${draft.feature} mattered when it connected requests, activation, retention, paid users, support, or executable proof.`,
        nextAction: draft.nextActions.find((action) => action.trim()) || "Keep this feature only if the next cohort repeats the activation, retention, support, or proof signal.",
      });
    });
  });

  return memories
    .sort((a, b) => b.impactScore - a.impactScore || b.paidUserCount - a.paidUserCount || a.feature.localeCompare(b.feature))
    .slice(0, 40);
}

export function buildVentureRetainedUserMemories(ventures: SavedVentureWorkspace[]): VentureRetainedUserMemory[] {
  return ventures.flatMap((venture) => venture.activationCohorts
    .filter((cohort) => cohort.retainedCount > 0 || cohort.paidCount > 0)
    .map((cohort): VentureRetainedUserMemory => {
      const retentionRate = cohort.activatedCount > 0 ? Math.round((cohort.retainedCount / cohort.activatedCount) * 100) : 0;
      const paidRate = cohort.signupCount > 0 ? Math.round((cohort.paidCount / cohort.signupCount) * 100) : 0;
      const retentionScore = clampScore(
        retentionRate * 0.45 +
        paidRate * 0.2 +
        cohort.retainedCount * 4 +
        cohort.paidCount * 8 +
        Math.min(20, Math.round(cohort.revenueCents / 1000)) -
        Math.min(16, cohort.supportIssueCount * 4),
      );
      const evidence = [
        `${cohort.signupCount} signups, ${cohort.activatedCount} activated, ${cohort.retainedCount} retained, and ${cohort.paidCount} paid.`,
        `${retentionRate}% retention during ${cohort.retentionWindow}.`,
        cohort.revenueCents > 0 ? `${formatCents(cohort.revenueCents)} cohort revenue.` : "",
        cohort.supportIssueCount > 0 ? `${cohort.supportIssueCount} support issue${cohort.supportIssueCount === 1 ? "" : "s"} recorded for the retained cohort.` : "",
        cohort.evidence,
        cohort.learning,
      ].map((item) => item.trim()).filter(Boolean);

      return {
        id: `${venture.id}-retained-user-${cohort.id}`,
        ventureId: venture.id,
        title: venture.title,
        cohortLabel: cohort.cohortLabel,
        targetBuyer: venture.targetBuyer,
        acquisitionChannel: cohort.acquisitionChannel,
        activationEvent: cohort.activationEvent,
        retentionWindow: cohort.retentionWindow,
        retentionScore,
        signupCount: cohort.signupCount,
        activatedCount: cohort.activatedCount,
        retainedUserCount: cohort.retainedCount,
        paidUserCount: cohort.paidCount,
        revenueCents: cohort.revenueCents,
        supportIssueCount: cohort.supportIssueCount,
        retentionRate,
        paidRate,
        evidence: Array.from(new Set(evidence)).slice(0, 6),
        reusableLesson: `${venture.targetBuyer} retained after "${cohort.activationEvent}" in ${cohort.retentionWindow} with ${retentionRate}% retention.`,
        nextAction: cohort.nextAction,
      };
    }))
    .sort((a, b) => (
      b.retentionScore - a.retentionScore ||
      b.retainedUserCount - a.retainedUserCount ||
      b.revenueCents - a.revenueCents
    ))
    .slice(0, 40);
}

export function buildVentureSuccessPredictionMemories(ventures: SavedVentureWorkspace[]): VentureSuccessPredictionMemory[] {
  return ventures.flatMap((venture) => {
    const demandCalibration = calibrateVentureDemand(venture);
    const positivePricingSignals = venture.pricingSignals.filter((signal) => (
      signal.qualifiedBuyerCount > 0 ||
      signal.paidCommitmentCount > 0 ||
      signal.invoiceRequestCount > 0 ||
      signal.acceptedPrice.trim().length > 0
    ));
    const committedRevenueCents = venture.moneySignals
      .filter((signal) => (
        (signal.type === "commitment" || signal.type === "revenue") &&
        (signal.status === "committed" || signal.status === "received")
      ))
      .reduce((sum, signal) => sum + signal.amountCents, 0);

    return demandCalibration.experiments
      .filter((experiment) => (
        experiment.prediction &&
        experiment.prediction.predictedOutcome === "expected-pass" &&
        experiment.status === "passed" &&
        experiment.predictionAlignment === "confirmed"
      ))
      .map((experiment): VentureSuccessPredictionMemory => {
        const prediction = experiment.prediction as VenturePredictionSnapshot;
        const linkedCohorts = venture.activationCohorts.filter((cohort) => cohort.sourceRecordId === experiment.experimentId);
        const outcomeCohorts = linkedCohorts.length > 0
          ? linkedCohorts
          : venture.activationCohorts.filter((cohort) => cohort.retainedCount > 0 || cohort.paidCount > 0 || cohort.revenueCents > 0);
        const linkedCohortIds = new Set(outcomeCohorts.map((cohort) => cohort.id));
        const experimentChannels = new Set([
          experiment.type,
          ...outcomeCohorts.map((cohort) => cohort.acquisitionChannel),
        ].map((channel) => channel.trim().toLowerCase()).filter(Boolean));
        const outcomeChannels = venture.channelEconomics.filter((economics) => (
          (economics.sourceType === "activation-cohort" && Boolean(economics.sourceRecordId) && linkedCohortIds.has(economics.sourceRecordId)) ||
          experimentChannels.has(economics.channel.trim().toLowerCase()) ||
          economics.paidCount > 0 ||
          economics.revenueCents > 0
        ));
        const retainedUserCount = outcomeCohorts.reduce((sum, cohort) => sum + cohort.retainedCount, 0);
        const paidCommitmentCount = positivePricingSignals.reduce((sum, signal) => sum + signal.paidCommitmentCount, 0);
        const pricingSignalCount = positivePricingSignals.reduce((sum, signal) => (
          sum +
          signal.qualifiedBuyerCount +
          signal.paidCommitmentCount +
          signal.invoiceRequestCount
        ), 0);
        const cohortRevenueCents = outcomeCohorts.reduce((sum, cohort) => sum + cohort.revenueCents, 0);
        const channelRevenueCents = outcomeChannels.reduce((sum, economics) => sum + economics.revenueCents, 0);
        const revenueCents = Math.max(committedRevenueCents, cohortRevenueCents, channelRevenueCents);
        const strongestOutcome = revenueCents > 0
          ? `${formatCents(revenueCents)} outcome revenue confirmed the forecast`
          : paidCommitmentCount > 0
            ? `${paidCommitmentCount} paid commitment${paidCommitmentCount === 1 ? "" : "s"} confirmed the forecast`
            : retainedUserCount > 0
              ? `${retainedUserCount} retained user${retainedUserCount === 1 ? "" : "s"} confirmed the forecast`
              : experiment.result;
        const signalScore = clampScore(
          prediction.conversionProbability * 0.3 +
          prediction.retentionProbability * 0.16 +
          prediction.expansionPotential * 0.12 +
          prediction.buyerUrgency * 0.1 +
          prediction.budgetLikelihood * 0.1 +
          prediction.channelReach * 0.08 +
          Math.min(18, pricingSignalCount * 3) +
          retainedUserCount * 4 +
          Math.min(20, Math.round(revenueCents / 1000)),
        );
        const evidence = [
          `Predicted expected pass at ${Math.round(prediction.conversionProbability)} conversion probability.`,
          `Measured result passed: ${experiment.result}`,
          experiment.interpretation,
          prediction.rationale,
          positivePricingSignals[0]
            ? `${positivePricingSignals[0].acceptedPrice} pricing signal with ${paidCommitmentCount} paid commitment${paidCommitmentCount === 1 ? "" : "s"}.`
            : "",
          outcomeCohorts[0]
            ? `${retainedUserCount} retained user${retainedUserCount === 1 ? "" : "s"} from ${outcomeCohorts[0].cohortLabel}.`
            : "",
          outcomeChannels[0]
            ? `${outcomeChannels[0].channel} channel produced ${formatCents(channelRevenueCents)} revenue.`
            : "",
        ].map((item) => item.trim()).filter(Boolean);

        return {
          id: `${venture.id}-success-prediction-${experiment.experimentId}`,
          ventureId: venture.id,
          title: venture.title,
          experimentId: experiment.experimentId,
          type: experiment.type,
          predictedOutcome: prediction.predictedOutcome,
          predictionAlignment: experiment.predictionAlignment,
          signalScore,
          conversionProbability: Math.round(prediction.conversionProbability),
          retentionProbability: Math.round(prediction.retentionProbability),
          expansionPotential: Math.round(prediction.expansionPotential),
          buyerUrgency: prediction.buyerUrgency,
          budgetLikelihood: prediction.budgetLikelihood,
          channelReach: prediction.channelReach,
          successThreshold: experiment.successThreshold,
          result: experiment.result,
          interpretation: experiment.interpretation,
          strongestOutcome,
          pricingSignalCount,
          paidCommitmentCount,
          retainedUserCount,
          revenueCents,
          evidence: Array.from(new Set(evidence)).slice(0, 7),
          reusableLesson: `${experiment.type} predicted success for ${venture.targetBuyer} when ${strongestOutcome.toLowerCase()}.`,
          nextAction: "Trust this signal pattern only when the same predicted-pass forecast is followed by measured demand, paid, retained, or revenue proof.",
        };
      });
  })
    .sort((a, b) => (
      b.signalScore - a.signalScore ||
      b.revenueCents - a.revenueCents ||
      b.retainedUserCount - a.retainedUserCount ||
      a.type.localeCompare(b.type)
    ))
    .slice(0, 40);
}

function vanitySeverity(metricCount: number, hasSpendOrRevenueRisk: boolean): VentureVanityMetricMemory["severity"] {
  if (metricCount >= 1000 || hasSpendOrRevenueRisk) return "high";
  if (metricCount >= 100) return "medium";
  return "medium";
}

export function buildVentureVanityMetricMemories(ventures: SavedVentureWorkspace[]): VentureVanityMetricMemory[] {
  const memories: VentureVanityMetricMemory[] = [];

  ventures.forEach((venture) => {
    venture.experiments.forEach((experiment) => {
      const status = classifyExperimentCalibration(experiment.result, experiment.interpretation);
      const text = `${experiment.result} ${experiment.interpretation}`;
      const attentionCount = extractFirstCount(text, /\b(\d[\d,]*)\s+(?:views|visits|impressions|clicks|likes|opens|pageviews|traffic)\b/i);
      const paidOrRetainedSignal = /\b(paid|invoice|revenue|retained|returned|commitment|converted)\b/i.test(text);
      if (attentionCount < 50 || status === "passed" || paidOrRetainedSignal) return;
      memories.push({
        id: `${venture.id}-vanity-experiment-${experiment.id}`,
        ventureId: venture.id,
        title: venture.title,
        sourceType: "experiment-result",
        severity: status === "failed" ? "high" : vanitySeverity(attentionCount, false),
        metricLabel: `${experiment.type} attention`,
        metricValue: `${attentionCount} attention event${attentionCount === 1 ? "" : "s"}`,
        metricCount: attentionCount,
        weakOutcome: `${status} result against success threshold "${experiment.successThreshold}"`,
        evidence: experiment.result,
        whyMisleading: "Attention volume did not translate into a passed demand result, paid intent, revenue, or retention proof.",
        neverTreatAs: "Do not treat views, visits, clicks, likes, opens, or traffic as validation without conversion, payment, retention, or explicit pass evidence.",
        nextAction: experiment.nextAction || "Rerun the experiment with a conversion, payment, or retention threshold before trusting the attention metric.",
      });
    });

    venture.activationCohorts.forEach((cohort) => {
      const emptyOutcome = cohort.retainedCount === 0 && cohort.paidCount === 0 && cohort.revenueCents === 0;
      if (cohort.signupCount < 10 || !emptyOutcome) return;
      memories.push({
        id: `${venture.id}-vanity-cohort-${cohort.id}`,
        ventureId: venture.id,
        title: venture.title,
        sourceType: "activation-cohort",
        severity: vanitySeverity(cohort.signupCount, false),
        metricLabel: `${cohort.cohortLabel} signups`,
        metricValue: `${cohort.signupCount} signup${cohort.signupCount === 1 ? "" : "s"}`,
        metricCount: cohort.signupCount,
        weakOutcome: `${cohort.retainedCount} retained, ${cohort.paidCount} paid, ${formatCents(cohort.revenueCents)} revenue`,
        evidence: cohort.evidence,
        whyMisleading: "Signup volume did not survive into retained users, paid users, or revenue.",
        neverTreatAs: "Do not count signup volume as traction until the cohort retains, pays, or produces revenue.",
        nextAction: cohort.nextAction || "Measure retained and paid users before repeating this acquisition push.",
      });
    });

    venture.channelEconomics.forEach((economics) => {
      const attentionCount = Math.max(economics.impressions, economics.clicks, economics.signupCount);
      const hasAttention = economics.impressions >= 500 || economics.clicks >= 50 || economics.signupCount >= 10;
      const emptyOutcome = economics.paidCount === 0 && economics.revenueCents === 0 && economics.paybackStatus === "no-payback";
      if (!hasAttention || !emptyOutcome) return;
      const signupLabel = `${economics.signupCount} signup${economics.signupCount === 1 ? "" : "s"}`;
      memories.push({
        id: `${venture.id}-vanity-channel-${economics.id}`,
        ventureId: venture.id,
        title: venture.title,
        sourceType: "channel-economics",
        severity: vanitySeverity(attentionCount, economics.spendCents > 0),
        metricLabel: `${economics.channel} reach`,
        metricValue: `${economics.impressions} impressions, ${economics.clicks} clicks, ${signupLabel}`,
        metricCount: attentionCount,
        weakOutcome: `${economics.paidCount} paid users, ${formatCents(economics.revenueCents)} revenue, ${economics.paybackStatus} payback`,
        evidence: economics.evidence,
        whyMisleading: "Channel reach or clicks did not produce paid users, revenue, or payback.",
        neverTreatAs: "Do not scale this channel on impressions, clicks, or signups alone.",
        nextAction: economics.nextAction || "Attach paid-user, revenue, or payback proof before increasing spend.",
      });
    });

    venture.pricingSignals.forEach((signal) => {
      const hasBuyerAttention = signal.qualifiedBuyerCount >= 5;
      const hasWeakOutcome = signal.paidCommitmentCount === 0 && signal.invoiceRequestCount === 0;
      if (!hasBuyerAttention || !hasWeakOutcome) return;
      memories.push({
        id: `${venture.id}-vanity-pricing-${signal.id}`,
        ventureId: venture.id,
        title: venture.title,
        sourceType: "pricing-signal",
        severity: "medium",
        metricLabel: `${signal.qualifiedBuyerCount} qualified buyer conversations`,
        metricValue: `${signal.qualifiedBuyerCount} qualified buyer${signal.qualifiedBuyerCount === 1 ? "" : "s"}`,
        metricCount: signal.qualifiedBuyerCount,
        weakOutcome: `${signal.paidCommitmentCount} paid commitments and ${signal.invoiceRequestCount} invoice requests`,
        evidence: signal.evidenceNote,
        whyMisleading: "Qualified conversations did not convert into paid commitments or invoice requests.",
        neverTreatAs: "Do not treat buyer conversations as pricing validation without an accepted price, invoice request, or paid commitment.",
        nextAction: "Ask for a paid pilot, invoice request, or explicit no before counting the pricing signal.",
      });
    });
  });

  const severityRank: Record<VentureVanityMetricMemory["severity"], number> = { critical: 3, high: 2, medium: 1 };
  const sourceRank: Record<VentureVanityMetricMemorySourceType, number> = {
    "channel-economics": 4,
    "activation-cohort": 3,
    "experiment-result": 2,
    "pricing-signal": 1,
  };

  return memories
    .sort((a, b) => (
      severityRank[b.severity] - severityRank[a.severity] ||
      sourceRank[b.sourceType] - sourceRank[a.sourceType] ||
      b.metricCount - a.metricCount ||
      a.metricLabel.localeCompare(b.metricLabel)
    ))
    .slice(0, 40);
}

export function buildVentureGeneratedCodePatternMemories(ventures: SavedVentureWorkspace[]): VentureGeneratedCodePatternMemory[] {
  return ventures.flatMap((venture) => {
    const scaffold = buildVentureGeneratedAppSourceScaffold(venture);
    const proof = buildVentureGeneratedAppVerificationProof(venture);
    const qaReport = buildVentureQaReleaseReport(venture);
    const latestMvp = venture.mvpBuildWorkspaces[0];
    const passedMvpCheckCount = latestMvp ? countPassedMvpChecks(latestMvp) : 0;
    const hasShippingSignal = proof.status === "verified" ||
      proof.status === "partial-proof" ||
      scaffold.status === "verified-executable" ||
      scaffold.status === "repo-attached";
    if (!hasShippingSignal) return [];

    const commandLane = Array.from(new Set([
      ...scaffold.verificationCommands,
      ...proof.checks.map((check) => check.command),
      latestMvp?.setupCommand,
      latestMvp?.typecheckCommand,
      latestMvp?.testCommand,
      latestMvp?.buildCommand,
      latestMvp?.browserSmokeCommand,
    ].map((command) => command?.trim()).filter(Boolean) as string[])).slice(0, 8);
    const sourceSignaturePreview = scaffold.sourceFiles
      .slice(0, 6)
      .map((file) => `${file.path}:${file.contentSignature}`);
    const patternScore = clampScore(
      (proof.status === "verified" ? 42 : proof.status === "partial-proof" ? 20 : 8) +
      passedMvpCheckCount * 7 +
      Math.min(18, scaffold.sourceFiles.length) +
      (qaReport.status === "ready" ? 12 : qaReport.status === "needs-fixes" ? 6 : 0) +
      (scaffold.status === "verified-executable" ? 12 : scaffold.status === "repo-attached" ? 8 : 0),
    );
    const fastestPattern = proof.status === "verified"
      ? `${scaffold.appName} shipped through the generated-app verifier with ${proof.passedCheckCount}/${proof.requiredCheckCount} proof checks passed.`
      : `${scaffold.appName} advanced fastest through ${passedMvpCheckCount} MVP checks and ${proof.passedCheckCount}/${proof.requiredCheckCount} generated-app proof checks.`;
    const evidence = [
      proof.proofSummary,
      `Scaffold ${scaffold.status} with ${scaffold.sourceFiles.length} signed source files.`,
      `QA ${qaReport.status} with ${qaReport.passedCheckCount}/${qaReport.totalCheckCount} checks passed.`,
      latestMvp?.verificationNotes ?? "",
      ...proof.checks.map((check) => `${check.label}: ${check.status} via ${check.command}.`),
    ].map((item) => item.trim()).filter(Boolean);

    return [{
      id: `${venture.id}-generated-code-pattern-${scaffold.appName}`,
      ventureId: venture.id,
      title: venture.title,
      appName: scaffold.appName,
      patternScore,
      scaffoldStatus: scaffold.status,
      proofStatus: proof.status,
      qaStatus: qaReport.status,
      fileCount: scaffold.sourceFiles.length,
      passedCheckCount: proof.passedCheckCount,
      requiredCheckCount: proof.requiredCheckCount,
      passedMvpCheckCount,
      fastestPattern,
      sourceSignaturePreview,
      commandLane,
      evidence: Array.from(new Set(evidence)).slice(0, 8),
      reusableLesson: `${scaffold.appName} shipped fastest when signed scaffold files, a fixed command lane, local verifier proof, and QA readiness stayed attached to the venture record.`,
      nextAction: proof.status === "verified"
        ? "Reuse this scaffold pattern for the next generated app, but keep deployment approval separate from local executable proof."
        : "Finish the missing generated-app proof checks before treating this pattern as reusable.",
    }];
  })
    .sort((a, b) => (
      b.patternScore - a.patternScore ||
      b.passedCheckCount - a.passedCheckCount ||
      b.fileCount - a.fileCount ||
      a.appName.localeCompare(b.appName)
    ))
    .slice(0, 30);
}

export function buildVentureEmpiricalCalibrationMemories(ventures: SavedVentureWorkspace[]): VentureEmpiricalCalibrationMemory[] {
  return ventures.flatMap((venture) => {
    const demandCalibration = calibrateVentureDemand(venture);
    const successPredictions = buildVentureSuccessPredictionMemories([venture]);
    const vanityTraps = buildVentureVanityMetricMemories([venture]);
    const failureLessons = buildVentureFailureLessons([venture]);
    const killDecision = buildVentureKillDecisionArtifact(venture);
    const supportBurdenCount = venture.supportIssues.filter((issue) => issue.status !== "resolved" && issue.status !== "dismissed").length;
    const confirmedPredictionCount = demandCalibration.experiments.filter((experiment) => experiment.predictionAlignment === "confirmed").length;
    const surprisedPredictionCount = demandCalibration.experiments.filter((experiment) => experiment.predictionAlignment === "surprised").length;
    const hasCalibrationSignal = confirmedPredictionCount > 0 ||
      surprisedPredictionCount > 0 ||
      vanityTraps.length > 0 ||
      failureLessons.length > 0 ||
      supportBurdenCount > 0 ||
      killDecision.recommendation === "kill";
    if (!hasCalibrationSignal) return [];

    const calibrationScore = clampScore(
      48 +
      confirmedPredictionCount * 12 +
      successPredictions.length * 10 -
      surprisedPredictionCount * 14 -
      vanityTraps.length * 10 -
      failureLessons.filter((lesson) => lesson.severity === "critical").length * 10 -
      supportBurdenCount * 4 +
      (killDecision.recommendation === "scale" ? 8 : killDecision.recommendation === "kill" ? -12 : 0),
    );
    const gullibilityRisk: VentureEmpiricalCalibrationMemory["gullibilityRisk"] = surprisedPredictionCount > 0 ||
      (vanityTraps.length > 0 && confirmedPredictionCount === 0) ||
      killDecision.recommendation === "kill"
      ? "high"
      : vanityTraps.length > 0 || failureLessons.length > 0 || supportBurdenCount > 0
        ? "medium"
        : "low";
    const strongestTrustSignal = successPredictions[0]?.strongestOutcome ||
      demandCalibration.experiments.find((experiment) => experiment.predictionAlignment === "confirmed")?.note ||
      "No confirmed prediction signal yet.";
    const strongestDiscountSignal = vanityTraps[0]?.neverTreatAs ||
      failureLessons[0]?.neverRepeat ||
      (supportBurdenCount > 0 ? `${supportBurdenCount} unresolved support burden signal${supportBurdenCount === 1 ? "" : "s"} still need calibration.` : "No discount signal recorded yet.");
    const evidence = [
      `${confirmedPredictionCount} confirmed prediction${confirmedPredictionCount === 1 ? "" : "s"} and ${surprisedPredictionCount} surprised prediction${surprisedPredictionCount === 1 ? "" : "s"}.`,
      vanityTraps[0] ? `Vanity trap: ${vanityTraps[0].metricValue} -> ${vanityTraps[0].weakOutcome}.` : "",
      successPredictions[0] ? `Trust signal: ${successPredictions[0].strongestOutcome}.` : "",
      failureLessons[0] ? `Failure lesson: ${failureLessons[0].neverRepeat}` : "",
      supportBurdenCount > 0 ? `${supportBurdenCount} unresolved support burden signal${supportBurdenCount === 1 ? "" : "s"}.` : "",
      `Kill/scale recommendation: ${killDecision.recommendation} at ${killDecision.confidenceScore}/100 confidence.`,
    ].map((item) => item.trim()).filter(Boolean);

    return [{
      id: `${venture.id}-empirical-calibration`,
      ventureId: venture.id,
      title: venture.title,
      calibrationScore,
      gullibilityRisk,
      confirmedPredictionCount,
      surprisedPredictionCount,
      vanityTrapCount: vanityTraps.length,
      failureLessonCount: failureLessons.length,
      supportBurdenCount,
      strongestTrustSignal,
      strongestDiscountSignal,
      evidence: Array.from(new Set(evidence)).slice(0, 7),
      reusableLesson: `${venture.title} should trust measured confirmations and discount vanity, surprise, support, or failure signals before recommending scale.`,
      nextAction: gullibilityRisk === "high"
        ? "Require a fresh measured pass, paid signal, retained cohort, or verified proof before making a stronger recommendation."
        : "Carry this calibration into the next recommendation and keep comparing predictions against outcomes.",
    }];
  })
    .sort((a, b) => (
      b.vanityTrapCount - a.vanityTrapCount ||
      b.surprisedPredictionCount - a.surprisedPredictionCount ||
      a.calibrationScore - b.calibrationScore ||
      a.title.localeCompare(b.title)
    ))
    .slice(0, 40);
}

export function buildVentureFakeMarketMemories(ventures: SavedVentureWorkspace[]): VentureFakeMarketMemory[] {
  return ventures.flatMap((venture) => {
    const demandDrift = buildVentureDemandDriftReport(venture);
    const vanityTraps = buildVentureVanityMetricMemories([venture]);
    const failureLessons = buildVentureFailureLessons([venture]);
    const killDecision = buildVentureKillDecisionArtifact(venture);
    const leadingVanityTrap = vanityTraps[0];
    const fakeByDemand = demandDrift.status === "overestimated" ||
      (demandDrift.baselineDemandScore >= 55 && demandDrift.actualDemandScore <= 45);
    const fakeByKill = killDecision.recommendation === "kill" || killDecision.recommendation === "archive";
    const fakeByVanity = Boolean(leadingVanityTrap && leadingVanityTrap.metricCount >= 1000);
    if (!fakeByDemand && !fakeByKill && !fakeByVanity) return [];

    const marketLabel = fakeByVanity && leadingVanityTrap
      ? `${venture.targetBuyer} via ${leadingVanityTrap.metricLabel}`
      : `${venture.targetBuyer}: ${venture.painStatement}`;
    const whyAttractive = demandDrift.baselineDemandScore >= 55
      ? `Pre-venture demand score ${demandDrift.baselineDemandScore}/100 made the market look attractive.`
      : leadingVanityTrap
        ? `${leadingVanityTrap.metricValue} made the market look attractive.`
        : `${venture.targetBuyer} looked attractive from early thesis evidence.`;
    const whyFake = fakeByDemand
      ? demandDrift.reason
      : leadingVanityTrap
        ? leadingVanityTrap.whyMisleading
        : killDecision.primaryReason;
    const fakeScore = clampScore(
      Math.max(0, demandDrift.baselineDemandScore - demandDrift.actualDemandScore) +
      (fakeByDemand ? 24 : 0) +
      (fakeByKill ? 20 : 0) +
      vanityTraps.length * 12 +
      failureLessons.length * 8 +
      (demandDrift.actualDemandScore <= 45 ? 12 : 0),
    );
    const evidence = [
      demandDrift.status !== "unmeasured" ? `Demand drift ${demandDrift.status}: baseline ${demandDrift.baselineDemandScore}/100 vs actual ${demandDrift.actualDemandScore}/100.` : "",
      demandDrift.reason,
      leadingVanityTrap ? `Vanity trap: ${leadingVanityTrap.metricValue}; ${leadingVanityTrap.weakOutcome}.` : "",
      failureLessons[0] ? `Failure lesson: ${failureLessons[0].evidence}` : "",
      killDecision.recommendation === "kill" || killDecision.recommendation === "archive"
        ? `Kill pressure: ${killDecision.primaryReason}`
        : "",
      ...demandDrift.components.slice(0, 3).map((component) => `${component.label} ${component.score}/100: ${component.evidence}`),
    ].map((item) => item.trim()).filter(Boolean);

    return [{
      id: `${venture.id}-fake-market`,
      ventureId: venture.id,
      title: venture.title,
      marketLabel,
      targetBuyer: venture.targetBuyer,
      painStatement: venture.painStatement,
      fakeScore,
      demandDriftStatus: demandDrift.status,
      baselineDemandScore: demandDrift.baselineDemandScore,
      actualDemandScore: demandDrift.actualDemandScore,
      vanityTrapCount: vanityTraps.length,
      failureLessonCount: failureLessons.length,
      killRecommendation: killDecision.recommendation,
      whyAttractive,
      whyFake,
      evidence: Array.from(new Set(evidence)).slice(0, 7),
      neverRepeat: "Do not treat this market as attractive again without fresh measured demand, paid intent, retained users, or channel payback that reverses the fake signal.",
      nextAction: fakeByDemand || fakeByKill
        ? "Keep the thesis killed, narrowed, or cold until new evidence directly reverses the failed demand assumption."
        : "Discount the attractive-looking metric and rerun the market test around paid, retained, or payback evidence.",
    }];
  })
    .sort((a, b) => (
      b.fakeScore - a.fakeScore ||
      b.vanityTrapCount - a.vanityTrapCount ||
      a.marketLabel.localeCompare(b.marketLabel)
    ))
    .slice(0, 40);
}

function pushFailureLesson(
  lessons: VentureFailureLesson[],
  draft: VentureThesisDraftInput | undefined,
  venture: SavedVentureWorkspace,
  lesson: Omit<VentureFailureLesson, "ventureId" | "title" | "matched">,
) {
  const hasDraftSignal = draftHasSimilaritySignal(draft);
  const matched = hasDraftSignal && failureLessonDraftScore(draft, venture) >= 22;
  if (hasDraftSignal && !matched) return;
  lessons.push({
    ...lesson,
    ventureId: venture.id,
    title: venture.title,
    matched,
  });
}

export function buildVentureFailureLessons(
  ventures: SavedVentureWorkspace[],
  draft?: VentureThesisDraftInput,
): VentureFailureLesson[] {
  const lessons: VentureFailureLesson[] = [];

  ventures.forEach((venture) => {
    const latestDecision = venture.decisionHistory[0];
    if (venture.lifecycleStatus === "killed" || latestDecision?.decision === "kill" || venture.decision === "kill-review") {
      const killReason = latestDecision?.rationale || venture.killCriteria.killReasons[0] || "Venture was killed or marked for kill review.";
      pushFailureLesson(lessons, draft, venture, {
        id: `${venture.id}-lesson-killed`,
        sourceType: "killed-decision",
        severity: "critical",
        lesson: "Killed venture memory",
        evidence: killReason,
        neverRepeat: venture.killCriteria.stopTriggers[0] || "Do not restart without new evidence that changes the kill rationale.",
        reuseTrigger: latestDecision?.nextAction || venture.killCriteria.pivotTriggers[0] || "Revisit only if fresh evidence changes the buyer, pain, channel, or wedge.",
        nextAction: "Compare the new thesis against the killed rationale before creating a duplicate branch.",
      });
    }

    calibrateVentureDemand(venture).experiments
      .filter((experiment) => experiment.status === "failed")
      .forEach((experiment) => {
        pushFailureLesson(lessons, draft, venture, {
          id: `${venture.id}-lesson-failed-experiment-${experiment.experimentId}`,
          sourceType: "failed-experiment",
          severity: "high",
          lesson: `${experiment.type} failed`,
          evidence: `${experiment.result} ${experiment.interpretation}`.trim(),
          neverRepeat: `Do not repeat the same test until the failure threshold changes: ${experiment.failureThreshold}.`,
          reuseTrigger: `Revive only with evidence that can meet: ${experiment.successThreshold}.`,
          nextAction: "Revise buyer, offer, channel, or price before running another build loop.",
        });
      });

    const pricingCalibration = calibrateVenturePricing(venture);
    if (pricingCalibration.status === "rejected") {
      pushFailureLesson(lessons, draft, venture, {
        id: `${venture.id}-lesson-rejected-pricing`,
        sourceType: "rejected-pricing",
        severity: "high",
        lesson: "Pricing was rejected",
        evidence: pricingCalibration.note,
        neverRepeat: `Do not reuse ${venture.pricingHypothesis} without a stronger willingness-to-pay signal.`,
        reuseTrigger: "Revisit when qualified buyers accept a price or request invoices.",
        nextAction: "Change pricing, buyer, or packaging before treating the thesis as validated.",
      });
    }

    venture.riskRecords
      .filter((risk) => (risk.severity === "critical" || risk.severity === "high") && risk.status !== "resolved")
      .forEach((risk) => {
        pushFailureLesson(lessons, draft, venture, {
          id: `${venture.id}-lesson-risk-${risk.id}`,
          sourceType: "critical-risk",
          severity: risk.severity === "critical" ? "critical" : "high",
          lesson: risk.title,
          evidence: risk.detail,
          neverRepeat: risk.mitigation || "Do not proceed until this risk has a named mitigation.",
          reuseTrigger: risk.resolutionEvidence || "Revisit when there is resolution evidence.",
          nextAction: risk.mitigation || "Resolve or accept the risk before scaling the thesis.",
        });
      });
  });

  const severityRank: Record<VentureFailureLesson["severity"], number> = { critical: 3, high: 2, medium: 1 };
  return lessons.sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || a.title.localeCompare(b.title)).slice(0, 20);
}

function latestKillDecisionFor(venture: SavedVentureWorkspace) {
  return venture.decisionHistory.find((decision) => decision.decision === "kill");
}

function isFreshAfter(recordedAt: string | undefined, baseline: string) {
  if (!recordedAt) return false;
  const recordedTime = Date.parse(recordedAt);
  const baselineTime = Date.parse(baseline);
  if (Number.isNaN(recordedTime) || Number.isNaN(baselineTime)) {
    return recordedAt.localeCompare(baseline) > 0;
  }
  return recordedTime > baselineTime;
}

function pushRevivalTrigger(
  triggers: VentureRevivalTrigger[],
  draft: VentureThesisDraftInput | undefined,
  venture: SavedVentureWorkspace,
  trigger: Omit<VentureRevivalTrigger, "ventureId" | "title" | "matched">,
) {
  const hasDraftSignal = draftHasSimilaritySignal(draft);
  const matched = hasDraftSignal && failureLessonDraftScore(draft, venture) >= 22;
  if (hasDraftSignal && !matched) return;
  triggers.push({
    ...trigger,
    ventureId: venture.id,
    title: venture.title,
    matched,
  });
}

export function buildVentureRevivalTriggers(
  ventures: SavedVentureWorkspace[],
  draft?: VentureThesisDraftInput,
): VentureRevivalTrigger[] {
  const triggers: VentureRevivalTrigger[] = [];

  ventures.forEach((venture) => {
    const killDecision = latestKillDecisionFor(venture);
    const isKilled = venture.lifecycleStatus === "killed" || Boolean(killDecision);
    if (!isKilled) return;

    const killBaseline = killDecision?.decidedAt ?? venture.savedAt;
    const originalFailure = killDecision?.rationale || venture.killCriteria.killReasons[0] || "The venture was previously killed or marked as not worth continuing.";
    const revivalCondition = killDecision?.nextAction || venture.killCriteria.pivotTriggers[0] || "Only reopen after fresh evidence changes the original kill rationale.";

    calibrateVentureDemand(venture).experiments
      .filter((experiment) => experiment.status === "passed" && isFreshAfter(experiment.recordedAt, killBaseline))
      .forEach((experiment) => {
        pushRevivalTrigger(triggers, draft, venture, {
          id: `${venture.id}-revival-passed-experiment-${experiment.experimentId}`,
          sourceType: "passed-experiment",
          confidence: "revival-review",
          originalFailure,
          freshEvidence: `${experiment.result} ${experiment.interpretation}`.trim(),
          changedAssumption: `${experiment.type} passed after the kill decision, changing the demand assumption.`,
          revivalCondition,
          nextAction: "Open a revival review, rerun the passed test once, and compare the new evidence against the original kill rationale.",
          recordedAt: experiment.recordedAt ?? killBaseline,
        });
      });

    venture.pricingSignals
      .filter((signal) => (
        isFreshAfter(signal.recordedAt, killBaseline) &&
        (signal.paidCommitmentCount > 0 || signal.invoiceRequestCount > 0 || Boolean(signal.acceptedPrice.trim()))
      ))
      .forEach((signal) => {
        const paidSignalCount = signal.paidCommitmentCount + signal.invoiceRequestCount;
        pushRevivalTrigger(triggers, draft, venture, {
          id: `${venture.id}-revival-validated-pricing-${signal.id}`,
          sourceType: "validated-pricing",
          confidence: paidSignalCount > 0 ? "revival-review" : "watch",
          originalFailure,
          freshEvidence: `${paidSignalCount} paid pricing signal${paidSignalCount === 1 ? "" : "s"} from ${signal.qualifiedBuyerCount} qualified buyer${signal.qualifiedBuyerCount === 1 ? "" : "s"}; accepted price ${signal.acceptedPrice || "not recorded"}. ${signal.evidenceNote}`.trim(),
          changedAssumption: "Post-kill willingness-to-pay evidence changes the budget or urgency assumption.",
          revivalCondition,
          nextAction: "Validate the price with one more qualified buyer before reopening build or acquisition work.",
          recordedAt: signal.recordedAt,
        });
      });

    venture.riskRecords
      .filter((risk) => risk.status === "resolved" && isFreshAfter(risk.createdAt, killBaseline) && Boolean(risk.resolutionEvidence.trim()))
      .forEach((risk) => {
        pushRevivalTrigger(triggers, draft, venture, {
          id: `${venture.id}-revival-resolved-risk-${risk.id}`,
          sourceType: "resolved-risk",
          confidence: "watch",
          originalFailure,
          freshEvidence: risk.resolutionEvidence,
          changedAssumption: `${risk.title} was resolved after the kill decision.`,
          revivalCondition,
          nextAction: "Confirm the resolved risk was part of the original kill rationale before changing lifecycle state.",
          recordedAt: risk.createdAt,
        });
      });

    venture.browserResearchTasks
      .filter((task) => task.status === "evidence-captured" && isFreshAfter(task.createdAt, killBaseline))
      .forEach((task) => {
        pushRevivalTrigger(triggers, draft, venture, {
          id: `${venture.id}-revival-browser-evidence-${task.id}`,
          sourceType: "captured-browser-evidence",
          confidence: "watch",
          originalFailure,
          freshEvidence: `${task.findings} Evidence: ${task.evidenceUrl}`.trim(),
          changedAssumption: `Fresh ${task.platform} evidence may change a missing-evidence or market-timing assumption.`,
          revivalCondition,
          nextAction: "Attach the source, score its quality, and only then reopen the thesis.",
          recordedAt: task.createdAt,
        });
      });
  });

  const confidenceRank: Record<VentureRevivalTrigger["confidence"], number> = {
    "revival-review": 2,
    watch: 1,
  };
  return triggers
    .sort((a, b) => confidenceRank[b.confidence] - confidenceRank[a.confidence] || b.recordedAt.localeCompare(a.recordedAt))
    .slice(0, 20);
}

function weakBranchKillMemoryMarkdown(memory: Omit<VentureWeakBranchKillMemory, "markdown">) {
  return [
    `# Weak Branch Kill Memory: ${memory.sourceTitle}`,
    `Parent venture: ${memory.title} (${memory.ventureId})`,
    `Source type: ${memory.sourceType}`,
    `Status: ${memory.status}`,
    `Recommendation: ${memory.recommendation}`,
    `Severity: ${memory.severity}`,
    `Confidence: ${memory.confidenceScore}/100`,
    "",
    "## Primary Reason",
    memory.primaryReason,
    "",
    "## Evidence",
    ...memory.evidence.map((item) => `- ${item}`),
    "",
    "## Stop Rules",
    ...memory.stopRules.map((rule) => `- ${rule}`),
    "",
    "## No-Go Boundaries",
    ...memory.noGoBoundaries.map((boundary) => `- ${boundary}`),
    "",
    "## Failure Lessons",
    ...memory.failureLessons.map((lesson) => `- ${lesson}`),
    "",
    "## Revival Conditions",
    ...memory.revivalConditions.map((condition) => `- ${condition}`),
    "",
    "## Next Action",
    memory.nextAction,
  ].join("\n");
}

export function buildVentureWeakBranchKillMemories(ventures: SavedVentureWorkspace[]): VentureWeakBranchKillMemory[] {
  const memories: VentureWeakBranchKillMemory[] = [];

  ventures.forEach((venture) => {
    const killDecision = buildVentureKillDecisionArtifact(venture);
    const failureLessons = buildVentureFailureLessons([venture]);
    const revivalTriggers = buildVentureRevivalTriggers([venture]);
    const shouldKillSavedVenture = (
      killDecision.recommendation === "kill" ||
      killDecision.recommendation === "pause" ||
      venture.lifecycleStatus === "killed" ||
      venture.decision === "kill-review" ||
      venture.decisionHistory.some((record) => record.decision === "kill" || record.decision === "pause")
    );

    if (shouldKillSavedVenture) {
      const status: VentureWeakBranchKillMemoryStatus = venture.lifecycleStatus === "killed" ||
        venture.decisionHistory.some((record) => record.decision === "kill")
        ? "archived"
        : killDecision.recommendation === "pause"
          ? "pause-recommended"
          : revivalTriggers.length > 0
            ? "revival-watch"
            : "kill-recommended";
      const memoryWithoutMarkdown: Omit<VentureWeakBranchKillMemory, "markdown"> = {
        id: `${venture.id}-weak-branch-kill-saved`,
        ventureId: venture.id,
        title: venture.title,
        sourceType: "saved-venture",
        sourceId: venture.id,
        sourceTitle: venture.title,
        status,
        recommendation: killDecision.recommendation,
        severity: killDecision.severity,
        confidenceScore: killDecision.confidenceScore,
        primaryReason: killDecision.primaryReason,
        evidence: [
          ...killDecision.evidenceForStopping,
          ...failureLessons.map((lesson) => lesson.evidence),
        ].filter(Boolean).slice(0, 8),
        stopRules: killDecision.stopRules.length > 0
          ? killDecision.stopRules
          : ["Archive build/spend/outreach plans unless a revival trigger is met."],
        noGoBoundaries: [
          "No new build scope until the primary kill reason is reversed by measured evidence.",
          "No paid spend or external outreach for this branch while kill memory is active.",
          "Do not merge this branch into active venture memory without preserving the failure lesson.",
        ],
        failureLessons: failureLessons.length > 0
          ? failureLessons.map((lesson) => `${lesson.lesson} Never repeat: ${lesson.neverRepeat}`)
          : [killDecision.primaryReason],
        revivalConditions: [
          ...killDecision.revivalTriggers,
          ...revivalTriggers.map((trigger) => trigger.revivalCondition),
        ].filter(Boolean).slice(0, 8),
        nextAction: killDecision.recommendation === "pause"
          ? "Pause acquisition, build, and outreach until the blocker is resolved and re-reviewed."
          : "Archive this weak branch in memory and require a revival review before reuse.",
      };
      memories.push({
        ...memoryWithoutMarkdown,
        markdown: weakBranchKillMemoryMarkdown(memoryWithoutMarkdown),
      });
    }

    buildVentureSpawnedVentureDrafts([venture])
      .filter((draft) => draft.status === "blocked")
      .forEach((draft) => {
        const memoryWithoutMarkdown: Omit<VentureWeakBranchKillMemory, "markdown"> = {
          id: `${draft.id}-weak-branch-kill`,
          ventureId: venture.id,
          title: venture.title,
          sourceType: "spawned-draft",
          sourceId: draft.id,
          sourceTitle: draft.proposedTitle,
          status: "kill-recommended",
          recommendation: "kill",
          severity: "high",
          confidenceScore: draft.confidenceScore,
          primaryReason: draft.risks[0] ?? "Spawned branch is blocked before validation.",
          evidence: draft.evidence.length > 0 ? draft.evidence : [draft.provenance],
          stopRules: [
            "Do not save this blocked branch as an active venture.",
            "Do not spend, contact customers, or build until the branch blocker is reversed.",
          ],
          noGoBoundaries: [
            "Keep blocked spawned drafts out of active venture memory.",
            "Require fresh evidence before converting this branch into a saved venture.",
          ],
          failureLessons: draft.risks,
          revivalConditions: draft.kickoffActions,
          nextAction: "Keep the blocked branch as kill memory until fresh evidence justifies a new draft.",
        };
        memories.push({
          ...memoryWithoutMarkdown,
          markdown: weakBranchKillMemoryMarkdown(memoryWithoutMarkdown),
        });
      });
  });

  const statusRank: Record<VentureWeakBranchKillMemoryStatus, number> = {
    archived: 4,
    "kill-recommended": 3,
    "pause-recommended": 2,
    "revival-watch": 1,
  };
  return memories.sort((a, b) => (
    statusRank[b.status] - statusRank[a.status] ||
    b.confidenceScore - a.confidenceScore ||
    a.sourceTitle.localeCompare(b.sourceTitle)
  )).slice(0, 80);
}

function confidenceLabelFor(score: number): VentureMarketModelConfidence {
  if (score >= 72) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function buildVentureMarketModel(venture: SavedVentureWorkspace): VentureMarketModel {
  const evidenceProfile = summarizeVentureEvidence(venture);
  const demandCalibration = calibrateVentureDemand(venture);
  const pricingCalibration = calibrateVenturePricing(venture);
  const killPressureReport = buildVentureKillPressureReport(venture);
  const latestCompetitor = venture.competitors[0];
  const latestChannel = venture.channelEconomics[0];
  const capturedBrowserEvidence = venture.browserResearchTasks.find((task) => task.status === "evidence-captured");
  const openRisks = venture.riskRecords.filter((risk) => risk.status !== "resolved");
  const highPressureRisks = killPressureReport.signals
    .filter((signal) => signal.severity !== "low")
    .map((signal) => signal.title);
  const risks = Array.from(new Set([
    ...highPressureRisks,
    ...openRisks.map((risk) => risk.title),
    ...venture.companySimulation.failureModes,
  ].filter(Boolean))).slice(0, 6);
  const missingProof = Array.from(new Set([
    ...venture.killCriteria.missingEvidence,
    ...(evidenceProfile.sourceCount === 0 ? ["Source-backed market evidence"] : []),
    ...(demandCalibration.status === "not-measured" ? ["Measured demand result"] : []),
    ...(pricingCalibration.status === "not-measured" ? ["Willingness-to-pay signal"] : []),
    ...(venture.competitors.length === 0 ? ["Named competitor or substitute"] : []),
    ...(venture.channelEconomics.length === 0 ? ["Channel economics or CAC"] : []),
  ].filter(Boolean))).slice(0, 8);
  const demandScore = demandCalibration.status === "passed"
    ? 18
    : demandCalibration.status === "failed"
      ? -24
      : demandCalibration.status === "inconclusive"
        ? -8
        : 0;
  const pricingScore = pricingCalibration.status === "validated"
    ? 14
    : pricingCalibration.status === "weak"
      ? 6
      : pricingCalibration.status === "rejected"
        ? -14
        : 0;
  const competitorScore = venture.competitors.length > 0 ? 6 : -6;
  const channelScore = venture.channelEconomics.length > 0 ? 8 : -6;
  const riskPenalty = killPressureReport.signals.filter((signal) => signal.recommendation === "kill").length * 12;
  const confidenceScore = clampScore(
    evidenceProfile.readinessScore * 0.52 +
    demandScore +
    pricingScore +
    competitorScore +
    channelScore -
    missingProof.length * 2 -
    riskPenalty,
  );

  return {
    id: `${venture.id}-market-model`,
    ventureId: venture.id,
    title: venture.title,
    competition: latestCompetitor
      ? `${latestCompetitor.competitorName}: ${latestCompetitor.positioning}`
      : venture.companySimulation.competitiveResponse,
    channel: latestChannel
      ? `${latestChannel.channel}: ${latestChannel.signupCount} signups, CAC ${latestChannel.cacCents > 0 ? `$${Math.round(latestChannel.cacCents / 100)}` : "not proven"}`
      : venture.acquisitionChannels.join(", ") || "No acquisition channel modeled.",
    pricing: pricingCalibration.status === "not-measured"
      ? venture.pricingHypothesis
      : `${pricingCalibration.status}: ${pricingCalibration.note}`,
    timing: capturedBrowserEvidence
      ? `${capturedBrowserEvidence.platform} evidence captured: ${capturedBrowserEvidence.findings}`
      : `${venture.companySimulation.salesCycle} ${venture.reviewCadence}`,
    risks: risks.length > 0 ? risks : ["No modeled market risks yet."],
    missingProof: missingProof.length > 0 ? missingProof : ["No major proof gap currently modeled."],
    confidence: confidenceLabelFor(confidenceScore),
    confidenceScore,
    nextAction: missingProof.length > 0
      ? `Prove: ${missingProof[0]}.`
      : "Recheck market model after the next experiment, cohort, or competitor update.",
  };
}

function founderMemoStatusFor(params: {
  killPressureReport: VentureKillPressureReport;
  demandDrift: VentureDemandDriftReport;
  readinessNotices: VentureReadinessNotice[];
  marketModel: VentureMarketModel;
  lensSummary: ReturnType<typeof summarizeEvaluationLenses>;
}): VentureFounderExecutionMemoStatus {
  const blockedNoticeCount = params.readinessNotices.filter((notice) => notice.tone === "blocked").length;
  if (
    params.killPressureReport.recommendation === "kill" ||
    params.killPressureReport.recommendation === "pause" ||
    blockedNoticeCount > 0 ||
    (params.lensSummary.weakestPostureLens?.score ?? 100) < 35
  ) {
    return "blocked";
  }
  if (
    params.demandDrift.status === "unmeasured" ||
    params.demandDrift.status === "overestimated" ||
    params.demandDrift.status === "mixed" ||
    params.marketModel.confidence === "low" ||
    params.lensSummary.postureAverageScore < 55
  ) {
    return "pressure-test";
  }
  return "ready";
}

function founderMemoStatusReason(params: {
  status: VentureFounderExecutionMemoStatus;
  killPressureReport: VentureKillPressureReport;
  demandDrift: VentureDemandDriftReport;
  readinessNotices: VentureReadinessNotice[];
  marketModel: VentureMarketModel;
  lensSummary: ReturnType<typeof summarizeEvaluationLenses>;
}) {
  if (params.status === "blocked") {
    const blockedNotice = params.readinessNotices.find((notice) => notice.tone === "blocked");
    if (params.killPressureReport.recommendation === "kill" || params.killPressureReport.recommendation === "pause") {
      return `Execution blocked by kill-pressure recommendation: ${params.killPressureReport.recommendation}.`;
    }
    if ((params.lensSummary.weakestPostureLens?.score ?? 100) < 35) {
      return `Execution blocked by weak evaluation lens: ${params.lensSummary.weakestPostureLens?.label} ${params.lensSummary.weakestPostureLens?.score}/100.`;
    }
    return blockedNotice
      ? `Execution blocked by readiness notice: ${blockedNotice.title}.`
      : "Execution is blocked until evidence and artifact gaps are resolved.";
  }
  if (params.status === "pressure-test") {
    if (params.lensSummary.postureAverageScore < 55) {
      return `Evaluation lenses need pressure testing: average ${params.lensSummary.postureAverageScore}/100; weakest ${params.lensSummary.weakestPostureLens?.label ?? "unknown"}.`;
    }
    if (params.demandDrift.status !== "confirmed" && params.demandDrift.status !== "underestimated") {
      return `Demand assumption needs pressure testing: ${params.demandDrift.status}.`;
    }
    return `Market confidence is ${params.marketModel.confidence} and still needs sharper proof.`;
  }
  return "Evidence supports the next controlled execution step.";
}

function founderMemoMarkdown(memo: Omit<VentureFounderExecutionMemo, "markdown">) {
  return [
    `# Founder Execution Memo: ${memo.title}`,
    `Status: ${memo.status}`,
    `Decision: ${memo.primaryDecision}`,
    `Reason: ${memo.statusReason}`,
    `Primary next action: ${memo.primaryNextAction}`,
    "",
    ...memo.sections.flatMap((section) => [
      `## ${section.heading}`,
      section.body,
      `Next: ${section.nextAction}`,
      "",
    ]),
    "## Technical Ticket",
    memo.technicalTicket,
    "",
    "## Product Spec",
    memo.productSpec,
    "",
    "## Autonomy Boundary",
    memo.autonomyBoundary,
    "",
    "## Source Evidence",
    ...(memo.sourceEvidence.length > 0 ? memo.sourceEvidence.map((source) => `- ${source}`) : ["- No source evidence attached yet."]),
  ].join("\n");
}

export function buildVentureFounderExecutionMemo(venture: SavedVentureWorkspace): VentureFounderExecutionMemo {
  const marketModel = buildVentureMarketModel(venture);
  const demandDrift = buildVentureDemandDriftReport(venture);
  const killPressureReport = buildVentureKillPressureReport(venture);
  const readinessNotices = buildVentureReadinessNotices(venture);
  const whyNow = venture.whyNow ?? deriveFallbackVentureWhyNow(venture);
  const mvpScope = venture.mvpScope ?? deriveFallbackVentureMvpScope(venture);
  const buildEstimate = venture.buildEstimate ?? deriveFallbackVentureBuildEstimate({
    ...venture,
    mvpScope,
  });
  const evidenceConfidence = venture.evidenceConfidence ?? deriveFallbackVentureEvidenceConfidence(venture);
  const reasoningDebate = venture.reasoningDebate ?? deriveFallbackVentureReasoningDebate({
    ...venture,
    whyNow,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
  });
  const evaluationLenses = venture.evaluationLenses ?? deriveFallbackVentureEvaluationLenses({
    ...venture,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
  });
  const lensSummary = summarizeEvaluationLenses({
    ...venture,
    evaluationLenses,
  });
  const weakestEvaluationLens = lensSummary.weakestPostureLens ?? lensSummary.weakestLens;
  const nextExperiment = venture.experiments.find((experiment) => (
    !experiment.result.trim() || experiment.result === "Not run yet."
  )) ?? venture.experiments[0];
  const requiredHumanGates = venture.approvals.filter((approval) => approval.status === "requires-human");
  const latestMvpWorkspace = venture.mvpBuildWorkspaces[0];
  const latestArtifact = venture.artifactRecords[0];
  const status = founderMemoStatusFor({
    killPressureReport,
    demandDrift,
    readinessNotices,
    marketModel,
    lensSummary,
  });
  const statusReason = founderMemoStatusReason({
    status,
    killPressureReport,
    demandDrift,
    readinessNotices,
    marketModel,
    lensSummary,
  });
  const primaryNextAction = status === "blocked"
    ? ((lensSummary.weakestPostureLens?.score ?? 100) < 35 ? lensSummary.weakestPostureLens?.nextAction : undefined) ??
      readinessNotices.find((notice) => notice.tone === "blocked")?.nextAction ??
      killPressureReport.signals[0]?.nextAction ??
      "Resolve the strongest execution blocker before proceeding."
    : demandDrift.status === "unmeasured" || demandDrift.status === "overestimated" || demandDrift.status === "mixed"
      ? demandDrift.nextAction
      : lensSummary.postureAverageScore < 55
        ? weakestEvaluationLens?.nextAction ?? "Run the weakest evaluation-lens test before changing posture."
      : nextExperiment?.nextAction ?? marketModel.nextAction;
  const technicalTicket = [
    `Owner: ${latestMvpWorkspace?.owner ?? "founder"}.`,
    `Scope: ${venture.mvpHandoff.sourceCodeStatus}`,
    `Setup: ${latestMvpWorkspace?.setupCommand ?? venture.mvpHandoff.setupInstructions}`,
    `Verification: ${latestMvpWorkspace?.testCommand ?? venture.mvpHandoff.testCoverage}`,
    `Artifact: ${latestArtifact ? `${latestArtifact.artifactType} ${latestArtifact.status}: ${latestArtifact.title}` : "No artifact record attached yet."}`,
  ].join(" ");
  const productSpec = [
    `Buyer: ${venture.targetBuyer}.`,
    `Pain: ${venture.painStatement}.`,
    `Wedge: ${venture.productWedge}.`,
    `Retention: ${venture.retentionMechanism}.`,
    `Data: ${venture.dataRequirements.slice(0, 3).join(", ") || "No data requirements recorded."}.`,
  ].join(" ");
  const autonomyBoundary = requiredHumanGates.length > 0
    ? `${requiredHumanGates.length} human gate${requiredHumanGates.length === 1 ? "" : "s"} required before external execution: ${requiredHumanGates.map((approval) => approval.level).join(", ")}.`
    : "No unresolved human approval gate is recorded, but external actions still require explicit audit evidence.";
  const sections: VentureFounderExecutionMemoSection[] = [
    {
      heading: "Decision Posture",
      body: `${killPressureReport.note} Severity ${killPressureReport.severity}. Recommendation ${killPressureReport.recommendation}.`,
      nextAction: killPressureReport.signals[0]?.nextAction ?? "Record the next evidence signal before changing posture.",
    },
    {
      heading: "Market Model",
      body: `Confidence ${marketModel.confidence} at ${marketModel.confidenceScore}/100. Competition: ${marketModel.competition}. Channel: ${marketModel.channel}. Pricing: ${marketModel.pricing}.`,
      nextAction: marketModel.nextAction,
    },
    {
      heading: "Why Now",
      body: `${whyNow.headline} Timing confidence ${whyNow.confidence}. Window: ${whyNow.expiringWindow}. Drivers: ${whyNow.drivers.join(" ")} Risks: ${whyNow.risks.join(" ")}`,
      nextAction: whyNow.risks[0] ?? "Attach fresh timing evidence before scaling the venture.",
    },
    {
      heading: "MVP Scope",
      body: `Scope confidence ${mvpScope.confidence}. Time to MVP: ${mvpScope.timeToMvp}. Must-have: ${mvpScope.mustHaveFeatures.join(" ")} Deferred: ${mvpScope.deferredFeatures.join(" ")} Dependencies: ${mvpScope.dependencies.join(" ")}`,
      nextAction: mvpScope.deferredFeatures[0] ?? "Attach MVP proof before deployment.",
    },
    {
      heading: "Build Estimate",
      body: `Effort ${buildEstimate.effortLevel} at ${buildEstimate.effortScore}/100. ${buildEstimate.timeRange} Builder: ${buildEstimate.builderProfile}. Drivers: ${buildEstimate.complexityDrivers.join(" ")} Risk adjustments: ${buildEstimate.riskAdjustments.join(" ")}`,
      nextAction: buildEstimate.riskAdjustments[0] ?? "Attach build proof before committing to deployment.",
    },
    {
      heading: "Evidence Confidence",
      body: `Evidence confidence ${evidenceConfidence.label} at ${evidenceConfidence.score}/100 from ${evidenceConfidence.sourceCount} source${evidenceConfidence.sourceCount === 1 ? "" : "s"} across ${evidenceConfidence.platformCount} platform${evidenceConfidence.platformCount === 1 ? "" : "s"}. Signals: ${evidenceConfidence.supportingSignals.join(" ")} Gaps: ${evidenceConfidence.gaps.join(" ")}`,
      nextAction: evidenceConfidence.gaps[0] ?? "Keep confidence current as new evidence lands.",
    },
    {
      heading: "Reasoning Debate",
      body: `Bull case: ${reasoningDebate.bullCase} Bear case: ${reasoningDebate.bearCase} Lazy consensus: ${reasoningDebate.lazyConsensus} Non-obvious insight: ${reasoningDebate.nonObviousInsight} Fatal assumption: ${reasoningDebate.fatalAssumption} Downside if wrong: ${reasoningDebate.downsideIfWrong}`,
      nextAction: reasoningDebate.fastestValidationPath,
    },
    {
      heading: "Evaluation Lenses",
      body: Object.values(evaluationLenses)
        .map((lens) => `${lens.label}: ${lens.score}/100 ${lens.confidence}. Signals: ${lens.signals.join(" ")} Gaps: ${lens.gaps.join(" ")}`)
        .join(" "),
      nextAction: weakestEvaluationLens?.nextAction ?? "Run the cheapest evaluation-lens test before changing venture posture.",
    },
    {
      heading: "Demand Drift",
      body: `Demand drift ${demandDrift.status}. Baseline ${demandDrift.baselineDemandScore}/100, actual ${demandDrift.actualDemandScore}/100, drift ${demandDrift.drift >= 0 ? "+" : ""}${demandDrift.drift}. ${demandDrift.reason}`,
      nextAction: demandDrift.nextAction,
    },
    {
      heading: "Next Experiment",
      body: nextExperiment
        ? `${nextExperiment.type}: ${nextExperiment.hypothesis} Audience: ${nextExperiment.audience}. Success: ${nextExperiment.successThreshold}. Failure: ${nextExperiment.failureThreshold}.`
        : "No experiment is attached to this venture yet.",
      nextAction: nextExperiment?.nextAction ?? "Create the first measurable experiment with success and failure thresholds.",
    },
    {
      heading: "Product Handoff",
      body: `${venture.mvpHandoff.sourceCodeStatus} ${venture.mvpHandoff.setupInstructions} ${venture.mvpHandoff.testCoverage} ${venture.mvpHandoff.deploymentPath}`,
      nextAction: latestArtifact?.changeSummary ?? venture.mvpHandoff.analyticsPlan,
    },
    {
      heading: "Approval Boundary",
      body: autonomyBoundary,
      nextAction: requiredHumanGates[0]?.evidence ?? "Keep every external action inside the autonomy audit trail.",
    },
  ];
  const sourceEvidence = [
    ...venture.evidenceSources.map((source) => `${source.platform}: ${source.title || source.summary || source.url}`),
    ...venture.artifactRecords.slice(0, 3).map((artifact) => `${artifact.artifactType}: ${artifact.title} (${artifact.status})`),
    ...venture.browserResearchTasks
      .filter((task) => task.status === "evidence-captured")
      .slice(0, 3)
      .map((task) => `${task.platform}: ${task.findings}`),
  ].filter(Boolean);
  const memoWithoutMarkdown: Omit<VentureFounderExecutionMemo, "markdown"> = {
    id: `${venture.id}-founder-execution-memo`,
    ventureId: venture.id,
    title: venture.title,
    status,
    statusReason,
    primaryDecision: killPressureReport.recommendation,
    primaryNextAction,
    demandDriftStatus: demandDrift.status,
    marketConfidence: marketModel.confidence,
    technicalTicket,
    productSpec,
    autonomyBoundary,
    sourceEvidence,
    sections,
  };

  return {
    ...memoWithoutMarkdown,
    markdown: founderMemoMarkdown(memoWithoutMarkdown),
  };
}

function launchPackMarkdown(pack: Omit<VentureExperimentLaunchPack, "markdown">) {
  return [
    `# Experiment Launch Pack: ${pack.title}`,
    `Status: ${pack.status}`,
    `Audience: ${pack.audience}`,
    `Channel: ${pack.channel}`,
    `Hypothesis: ${pack.hypothesis}`,
    "",
    "## Landing Page Sections",
    ...pack.landingPageSections.map((section) => `- ${section}`),
    "",
    "## Channel Copy",
    ...pack.channelCopy.map((copy) => `- ${copy}`),
    "",
    "## Metrics",
    `Success: ${pack.successMetric}`,
    `Failure: ${pack.failureMetric}`,
    "",
    "## Risk Checks",
    ...pack.riskChecks.map((check) => `- ${check}`),
    "",
    "## Approval Gates",
    ...pack.approvalGates.map((gate) => `- ${gate}`),
    "",
    "## Replay Checklist",
    ...pack.checklist.map((item) => `- [ ] ${item}`),
    "",
    `Replay command: ${pack.replayCommand}`,
  ].join("\n");
}

export function buildVentureExperimentLaunchPack(venture: SavedVentureWorkspace): VentureExperimentLaunchPack {
  const experiment = venture.experiments.find((item) => !item.result.trim() || item.result === "Not run yet.") ?? venture.experiments[0];
  const killPressureReport = buildVentureKillPressureReport(venture);
  const demandDrift = buildVentureDemandDriftReport(venture);
  const requiredHumanGates = venture.approvals.filter((approval) => approval.status === "requires-human");
  const approvalGates = requiredHumanGates.length > 0
    ? requiredHumanGates.map((approval) => `${approval.level}: ${approval.evidence}`)
    : ["No unresolved human approval gate is recorded; keep external actions in the autonomy audit trail."];

  if (!experiment) {
    const emptyPack: Omit<VentureExperimentLaunchPack, "markdown"> = {
      id: `${venture.id}-launch-pack-empty`,
      ventureId: venture.id,
      experimentId: "no-experiment",
      status: "blocked",
      title: `${venture.title} launch pack missing experiment`,
      audience: venture.targetBuyer,
      channel: venture.acquisitionChannels[0] ?? "manual",
      hypothesis: "No experiment hypothesis is attached.",
      landingPageSections: ["Attach an experiment before generating launch copy."],
      channelCopy: ["No channel copy can be generated without an experiment."],
      successMetric: "No success metric recorded.",
      failureMetric: "No failure metric recorded.",
      riskChecks: ["Create a measurable experiment first."],
      approvalGates,
      checklist: ["Create the first experiment with success and failure thresholds."],
      replayCommand: `Open /ventures and add an experiment for ${venture.id}.`,
    };
    return { ...emptyPack, markdown: launchPackMarkdown(emptyPack) };
  }

  const recorded = experiment.result.trim() && experiment.result !== "Not run yet.";
  const externalApprovalNeeded = requiredHumanGates.length > 0 || /\b(outreach|email|linkedin|ad|paid|deploy|launch|billing|charge)\b/i.test(`${experiment.channel} ${experiment.nextAction}`);
  const status: VentureExperimentLaunchPackStatus = recorded
    ? "recorded"
    : killPressureReport.recommendation === "kill" || killPressureReport.recommendation === "pause"
      ? "blocked"
      : externalApprovalNeeded
        ? "needs-approval"
        : "ready";
  const landingPageSections = [
    `Hero: ${venture.painStatement}`,
    `Promise: ${venture.productWedge}`,
    `Proof: ${venture.claims[0] ?? "Evidence is still being gathered."}`,
    `CTA: Join or request the ${experiment.type.toLowerCase()} for ${experiment.audience}.`,
  ];
  const channelCopy = [
    `${experiment.audience}: ${experiment.hypothesis}`,
    `Try the smallest version of ${venture.title}: ${venture.productWedge}`,
    `Reply or sign up if ${venture.painStatement.toLowerCase()}`,
  ];
  const riskChecks = [
    `Ethics: ${experiment.ethicsReview}`,
    `Demand drift: ${demandDrift.status}; ${demandDrift.nextAction}`,
    `Kill pressure: ${killPressureReport.recommendation}; ${killPressureReport.signals[0]?.title ?? "no high-pressure signal"}`,
    `No external spend, outreach, deployment, or billing change without the recorded approval gate.`,
  ];
  const checklist = [
    `Prepare ${experiment.channel} surface for ${experiment.audience}.`,
    `Publish copy only after approval gates are satisfied: ${approvalGates[0]}`,
    `Instrument success metric: ${experiment.successThreshold}.`,
    `Instrument failure metric: ${experiment.failureThreshold}.`,
    "Capture source URL, screenshot, or operator evidence before interpreting results.",
    `Record measured result and interpretation back into Venture Lab for ${experiment.id}.`,
  ];
  const packWithoutMarkdown: Omit<VentureExperimentLaunchPack, "markdown"> = {
    id: `${venture.id}-${experiment.id}-launch-pack`,
    ventureId: venture.id,
    experimentId: experiment.id,
    status,
    title: `${experiment.type} launch pack`,
    audience: experiment.audience,
    channel: experiment.channel,
    hypothesis: experiment.hypothesis,
    landingPageSections,
    channelCopy,
    successMetric: experiment.successThreshold,
    failureMetric: experiment.failureThreshold,
    riskChecks,
    approvalGates,
    checklist,
    replayCommand: `Open /ventures, select ${venture.id}, run ${experiment.id}, then record result and interpretation.`,
  };

  return {
    ...packWithoutMarkdown,
    markdown: launchPackMarkdown(packWithoutMarkdown),
  };
}

function qaReportMarkdown(report: Omit<VentureQaReleaseReport, "markdown">) {
  return [
    `# QA Release Report: ${report.title}`,
    `Status: ${report.status}`,
    `Release readiness: ${report.releaseReadinessScore}/100`,
    `Checks: ${report.passedCheckCount}/${report.totalCheckCount} passed`,
    "",
    "## Blockers",
    ...(report.blockers.length > 0 ? report.blockers.map((blocker) => `- ${blocker}`) : ["- No release blocker detected."]),
    "",
    "## Warnings",
    ...(report.warnings.length > 0 ? report.warnings.map((warning) => `- ${warning}`) : ["- No release warning detected."]),
    "",
    "## Evidence Summary",
    `Artifacts: ${report.artifactSummary}`,
    `Support: ${report.supportRiskSummary}`,
    `Deployment: ${report.deploymentBoundary}`,
    `Launch: ${report.launchRiskSummary}`,
    "",
    "## QA Checklist",
    ...report.checklist.map((item) => `- [ ] ${item}`),
  ].join("\n");
}

export function buildVentureQaReleaseReport(venture: SavedVentureWorkspace): VentureQaReleaseReport {
  const launchPack = buildVentureExperimentLaunchPack(venture);
  const latestMvp = venture.mvpBuildWorkspaces[0];
  const checkStatuses = venture.mvpBuildWorkspaces.flatMap((workspace) => [
    workspace.setupCheck,
    workspace.typecheckCheck,
    workspace.unitTestCheck,
    workspace.buildCheck,
    workspace.browserSmokeCheck,
    workspace.deploymentCheck,
  ]);
  const totalCheckCount = checkStatuses.length;
  const passedCheckCount = checkStatuses.filter((status) => status === "passed").length;
  const verifiedArtifacts = venture.artifactRecords.filter((artifact) => artifact.status === "verified").length;
  const blockedArtifacts = venture.artifactRecords.filter((artifact) => artifact.status === "blocked").length;
  const deploymentProofs = venture.artifactRecords.filter((artifact) => artifact.artifactType === "deployment-proof");
  const verifiedDeploymentProof = deploymentProofs.some((artifact) => artifact.status === "verified");
  const blockedDeploymentProof = deploymentProofs.some((artifact) => artifact.status === "blocked" || artifact.status === "expected");
  const openSupportIssues = venture.supportIssues.filter((issue) => issue.status === "open" || issue.status === "triaged" || issue.status === "in-progress");
  const highSupportIssues = openSupportIssues.filter((issue) => issue.severity === "high" || issue.severity === "critical");
  const blockers = [
    venture.mvpBuildWorkspaces.length === 0 ? "No MVP build workspace is attached." : "",
    totalCheckCount > 0 && passedCheckCount < totalCheckCount ? `${totalCheckCount - passedCheckCount} MVP check${totalCheckCount - passedCheckCount === 1 ? "" : "s"} are not passed.` : "",
    venture.artifactRecords.length === 0 ? "No artifact proof is attached." : "",
    blockedArtifacts > 0 ? `${blockedArtifacts} artifact${blockedArtifacts === 1 ? "" : "s"} blocked.` : "",
    blockedDeploymentProof ? "Deployment proof is blocked or only expected." : "",
    highSupportIssues.length > 0 ? `${highSupportIssues.length} high or critical support issue${highSupportIssues.length === 1 ? "" : "s"} remain open.` : "",
    launchPack.status === "blocked" ? "Experiment launch pack is blocked." : "",
  ].filter(Boolean);
  const warnings = [
    launchPack.status === "needs-approval" ? "Experiment launch pack needs human approval before external action." : "",
    !verifiedDeploymentProof ? "No verified deployment proof is attached." : "",
    verifiedArtifacts === 0 ? "No verified artifact is attached." : "",
    latestMvp && latestMvp.browserSmokeCheck !== "passed" ? "Browser smoke has not passed." : "",
  ].filter(Boolean);
  const releaseReadinessScore = clampScore(
    35 +
    (totalCheckCount > 0 ? (passedCheckCount / totalCheckCount) * 35 : -15) +
    verifiedArtifacts * 6 +
    (verifiedDeploymentProof ? 12 : 0) -
    blockers.length * 12 -
    warnings.length * 4,
  );
  const status: VentureQaReleaseStatus = blockers.length > 0
    ? "blocked"
    : warnings.length > 0 || releaseReadinessScore < 80
      ? "needs-fixes"
      : "ready";
  const reportWithoutMarkdown: Omit<VentureQaReleaseReport, "markdown"> = {
    id: `${venture.id}-qa-release-report`,
    ventureId: venture.id,
    title: venture.title,
    status,
    releaseReadinessScore,
    passedCheckCount,
    totalCheckCount,
    blockers,
    warnings,
    artifactSummary: `${venture.artifactRecords.length} artifact${venture.artifactRecords.length === 1 ? "" : "s"}, ${verifiedArtifacts} verified, ${blockedArtifacts} blocked.`,
    supportRiskSummary: `${openSupportIssues.length} open support issue${openSupportIssues.length === 1 ? "" : "s"}, ${highSupportIssues.length} high or critical.`,
    deploymentBoundary: verifiedDeploymentProof
      ? "Verified deployment proof is attached, but human approval is still required before external execution."
      : blockedDeploymentProof
        ? "Deployment proof is blocked or expected; no deployment should be treated as complete."
        : "No deployment proof is attached.",
    launchRiskSummary: `${launchPack.title} is ${launchPack.status}; ${launchPack.riskChecks[0] ?? "no launch risk check recorded"}`,
    checklist: [
      "Replay setup, typecheck, unit test, build, browser smoke, and deployment checks.",
      "Attach or supersede blocked artifacts before release review.",
      "Resolve high-severity support issues before acquisition or launch.",
      "Verify deployment proof and keep human approval separate from local QA.",
      "Record launch-pack evidence before interpreting demand.",
    ],
  };

  return {
    ...reportWithoutMarkdown,
    markdown: qaReportMarkdown(reportWithoutMarkdown),
  };
}

function deploymentReadinessPacketMarkdown(packet: Omit<VentureDeploymentReadinessPacket, "markdown">) {
  return [
    `# Deployment Readiness Packet: ${packet.title}`,
    `Status: ${packet.status}`,
    `Readiness score: ${packet.readinessScore}/100`,
    `Generated app proof: ${packet.generatedAppProofStatus}`,
    `QA: ${packet.qaStatus}`,
    `Deployment proof: ${packet.deploymentProofStatus}`,
    `Approval boundary: ${packet.approvalBoundary}`,
    `No-deploy boundary: ${packet.noDeployBoundary}`,
    "",
    "## Blockers",
    ...(packet.blockers.length > 0 ? packet.blockers.map((blocker) => `- ${blocker}`) : ["- No deployment proposal blocker detected."]),
    "",
    "## Required Approvals",
    ...packet.requiredApprovals.map((approval) => `- ${approval}`),
    "",
    "## Evidence",
    ...packet.evidence.map((item) => `- ${item}`),
    "",
    "## Proposal Steps",
    ...packet.proposalSteps.map((step) => `- [ ] ${step}`),
    "",
    "## Rollback Plan",
    ...packet.rollbackPlan.map((step) => `- [ ] ${step}`),
  ].join("\n");
}

export function buildVentureDeploymentReadinessPacket(venture: SavedVentureWorkspace): VentureDeploymentReadinessPacket {
  const generatedAppProof = buildVentureGeneratedAppVerificationProof(venture);
  const qaReport = buildVentureQaReleaseReport(venture);
  const financialModel = buildVentureFinancialModel(venture);
  const deploymentProofs = venture.artifactRecords.filter((artifact) => artifact.artifactType === "deployment-proof");
  const verifiedDeploymentProof = deploymentProofs.find((artifact) => artifact.status === "verified");
  const latestDeploymentProof = deploymentProofs[0];
  const humanDeploymentGate = venture.approvals.find((approval) => /human-approved deployment/i.test(approval.level));
  const deploymentProposalGate = venture.approvals.find((approval) => /deployment proposal/i.test(approval.level));
  const openSupportIssues = venture.supportIssues.filter((issue) => issue.status === "open" || issue.status === "triaged" || issue.status === "in-progress");
  const highSupportIssues = openSupportIssues.filter((issue) => issue.severity === "high" || issue.severity === "critical");
  const deploymentProofStatus = verifiedDeploymentProof?.status ?? latestDeploymentProof?.status ?? "missing";
  const humanDeploymentApproved = humanDeploymentGate?.status === "complete";
  const deploymentProposalAvailable = deploymentProposalGate?.status === "available" || deploymentProposalGate?.status === "complete";
  const hardBlockers = [
    generatedAppProof.status !== "verified" ? "Generated app executable proof is not verified." : "",
    qaReport.status === "blocked" ? `QA release report is blocked: ${qaReport.blockers[0] ?? "missing QA proof"}` : "",
    financialModel.status === "blocked" || financialModel.status === "runway-risk" ? `Finance model is ${financialModel.status}: ${financialModel.runwayRisk}` : "",
    highSupportIssues.length > 0 ? `${highSupportIssues.length} high or critical support issue${highSupportIssues.length === 1 ? "" : "s"} remain open.` : "",
  ].filter(Boolean);
  const proofBlockers = [
    !verifiedDeploymentProof ? "No verified deployment-proof artifact is attached." : "",
    !humanDeploymentApproved ? "Human-approved deployment gate is not complete." : "",
    !deploymentProposalAvailable ? "Deployment proposal gate is not available." : "",
  ].filter(Boolean);
  const blockers = [...hardBlockers, ...proofBlockers];
  const status: VentureDeploymentReadinessStatus = hardBlockers.length > 0
    ? "blocked"
    : proofBlockers.length > 0
      ? "needs-proof"
      : "proposal-ready";
  const readinessScore = clampScore(
    20 +
    (generatedAppProof.status === "verified" ? 25 : 0) +
    (qaReport.status === "ready" ? 20 : qaReport.status === "needs-fixes" ? 12 : 0) +
    (verifiedDeploymentProof ? 15 : 0) +
    (humanDeploymentApproved ? 12 : 0) +
    (deploymentProposalAvailable ? 8 : 0) -
    hardBlockers.length * 15 -
    proofBlockers.length * 6,
  );
  const requiredApprovals = [
    deploymentProposalGate ? `${deploymentProposalGate.level}: ${deploymentProposalGate.status}; ${deploymentProposalGate.evidence}` : "Deployment proposal gate missing.",
    humanDeploymentGate ? `${humanDeploymentGate.level}: ${humanDeploymentGate.status}; ${humanDeploymentGate.evidence}` : "Human-approved deployment gate missing.",
    "No external deployment may run from this packet; it is a review artifact only.",
  ];
  const evidence = [
    `Generated app proof ${generatedAppProof.status}: ${generatedAppProof.passedCheckCount}/${generatedAppProof.requiredCheckCount} checks passed at ${generatedAppProof.targetPath}.`,
    `QA release ${qaReport.status}: ${qaReport.passedCheckCount}/${qaReport.totalCheckCount} checks passed; readiness ${qaReport.releaseReadinessScore}/100.`,
    verifiedDeploymentProof
      ? `Verified deployment proof artifact: ${verifiedDeploymentProof.title} (${verifiedDeploymentProof.uri}).`
      : latestDeploymentProof
        ? `Latest deployment proof artifact is ${latestDeploymentProof.status}: ${latestDeploymentProof.title}.`
        : "No deployment-proof artifact is attached.",
    financialModel.revenueSummary,
    `${openSupportIssues.length} open support issue${openSupportIssues.length === 1 ? "" : "s"}; ${highSupportIssues.length} high or critical.`,
  ];
  const proposalSteps = [
    "Review the generated app proof, QA release report, finance model, support risk, and deployment proof artifact together.",
    "Attach a verified deployment-proof artifact that names the target environment, command, reviewer, and evidence URI.",
    "Record human-approved deployment only after the operator approves the exact external target and rollback plan.",
    "Keep VITE_EXTERNAL_ACTIONS_ENABLED=false until deployment approval is complete and audited.",
  ];
  const rollbackPlan = [
    "Keep the previous deployment target and artifact URI available before any external release.",
    "Verify the generated app can be rebuilt from the saved scaffold and verifier report.",
    "Define the manual rollback owner and stop condition before any production action.",
    "Record rollback evidence as a deployment-proof or changelog artifact after review.",
  ];
  const noDeployBoundary = "This packet proposes readiness only; it does not deploy, send outreach, spend money, charge users, or change production state.";
  const packetWithoutMarkdown: Omit<VentureDeploymentReadinessPacket, "markdown"> = {
    id: `${venture.id}-deployment-readiness-packet`,
    ventureId: venture.id,
    title: venture.title,
    status,
    readinessScore,
    generatedAppProofStatus: generatedAppProof.status,
    qaStatus: qaReport.status,
    deploymentProofStatus,
    approvalBoundary: humanDeploymentApproved
      ? "Human-approved deployment gate is complete; execute only through the separately approved external path."
      : "Human-approved deployment is required before any external execution.",
    noDeployBoundary,
    financeRisk: financialModel.runwayRisk,
    supportRisk: `${openSupportIssues.length} open support issue${openSupportIssues.length === 1 ? "" : "s"}, ${highSupportIssues.length} high or critical.`,
    blockers,
    requiredApprovals,
    evidence,
    proposalSteps,
    rollbackPlan,
  };

  return {
    ...packetWithoutMarkdown,
    markdown: deploymentReadinessPacketMarkdown(packetWithoutMarkdown),
  };
}

function deploymentEnvironmentMatrixMarkdown(matrix: Omit<VentureDeploymentEnvironmentMatrix, "markdown">) {
  return [
    `# Deployment Environment Matrix: ${matrix.title}`,
    `Production boundary: ${matrix.productionBoundary}`,
    "",
    "## Targets",
    ...matrix.targets.flatMap((target) => [
      `### ${target.label}`,
      `Status: ${target.status}`,
      `Proof: ${target.proofSummary}`,
      `Approval: ${target.approvalBoundary}`,
      target.linkedRoadmapTaskTitle
        ? `Roadmap task: ${target.linkedRoadmapTaskTitle} (${target.linkedRoadmapTaskStatus}, owner ${target.linkedRoadmapTaskOwner ?? "unknown"})`
        : "Roadmap task: not recorded",
      target.linkedSupportIssueTitle
        ? `Support issue: ${target.linkedSupportIssueTitle} (${target.linkedSupportIssueStatus}, owner ${target.linkedSupportIssueOwner ?? "unknown"})`
        : "Support issue: not recorded",
      "Required proof:",
      ...target.requiredProof.map((proof) => `- ${proof}`),
      `Next: ${target.nextAction}`,
      "",
    ]),
  ].join("\n");
}

export function buildVentureDeploymentEnvironmentMatrix(venture: SavedVentureWorkspace): VentureDeploymentEnvironmentMatrix {
  const generatedAppProof = buildVentureGeneratedAppVerificationProof(venture);
  const qaReport = buildVentureQaReleaseReport(venture);
  const deploymentPacket = buildVentureDeploymentReadinessPacket(venture);
  const verifiedDeploymentProof = venture.artifactRecords.find((artifact) => artifact.artifactType === "deployment-proof" && artifact.status === "verified");
  const humanDeploymentGate = venture.approvals.find((approval) => /human-approved deployment/i.test(approval.level));
  const humanDeploymentApproved = humanDeploymentGate?.status === "complete";
  const linkedPromotionTask = (targetId: VentureDeploymentEnvironmentId) => venture.roadmapTasks.find((task) => (
    task.sourceType === "deployment-promotion" &&
    task.sourceRecordId === `${venture.id}-deployment-environment-${targetId}`
  ));
  const linkedPromotionIssue = (targetId: VentureDeploymentEnvironmentId) => venture.supportIssues.find((issue) => (
    issue.sourceType === "deployment-promotion" &&
    issue.sourceRecordId === `${venture.id}-deployment-environment-${targetId}`
  ));
  const localReady = generatedAppProof.status === "verified";
  const previewReady = localReady && Boolean(verifiedDeploymentProof) && qaReport.status !== "blocked";
  const stagingReady = previewReady && deploymentPacket.status !== "blocked";
  const productionReady = deploymentPacket.status === "proposal-ready";
  const baseTargets: VentureDeploymentEnvironmentTarget[] = [
    {
      id: "local",
      label: "Local",
      status: localReady ? "ready" : generatedAppProof.status === "blocked" ? "blocked" : "needs-proof",
      proofSummary: `${generatedAppProof.status}; ${generatedAppProof.passedCheckCount}/${generatedAppProof.requiredCheckCount} generated-app checks passed.`,
      approvalBoundary: "Local verification only; no external deployment approval is implied.",
      requiredProof: [
        "Materialized generated app source path.",
        "Setup, typecheck, unit test, build, and browser smoke proof.",
      ],
      nextAction: localReady ? "Keep verifier report attached before any environment promotion." : "Run generated-app verifier and attach the report.",
    },
    {
      id: "preview",
      label: "Preview",
      status: previewReady ? "ready" : localReady ? "needs-proof" : "blocked",
      proofSummary: verifiedDeploymentProof
        ? `Verified deployment proof: ${verifiedDeploymentProof.title}.`
        : "No verified preview deployment-proof artifact is attached.",
      approvalBoundary: "Preview proposal may be reviewed, but this matrix does not create or mutate a preview deployment.",
      requiredProof: [
        "Verified deployment-proof artifact with target URL or rehearsal evidence.",
        "QA release report not blocked.",
      ],
      nextAction: previewReady ? "Review preview evidence against rollback plan." : "Attach verified preview or rehearsal proof without touching production.",
    },
    {
      id: "staging",
      label: "Staging",
      status: stagingReady ? "ready" : localReady ? "needs-proof" : "blocked",
      proofSummary: `${qaReport.status}; ${qaReport.passedCheckCount}/${qaReport.totalCheckCount} QA checks passed.`,
      approvalBoundary: "Staging remains a proposal target until deployment proof and rollback evidence are attached.",
      requiredProof: [
        "Preview proof reviewed by operator.",
        "Rollback plan recorded in the deployment readiness packet.",
        "Open high-severity support issues resolved or explicitly accepted.",
      ],
      nextAction: stagingReady ? "Prepare human deployment review for production boundary." : "Resolve packet blockers before staging promotion.",
    },
    {
      id: "production",
      label: "Production",
      status: productionReady ? "ready" : deploymentPacket.status === "blocked" ? "blocked" : "needs-proof",
      proofSummary: `${deploymentPacket.status}; readiness ${deploymentPacket.readinessScore}/100.`,
      approvalBoundary: humanDeploymentApproved
        ? "Human-approved deployment gate is complete, but execution still requires the separately approved external path."
        : "Production is blocked until human-approved deployment is complete.",
      requiredProof: [
        "Deployment readiness packet proposal-ready.",
        "Human-approved deployment gate complete.",
        "Verified deployment-proof artifact and rollback evidence attached.",
      ],
      nextAction: productionReady ? "Execute only through the approved external path and record proof." : "Keep production blocked and use the packet to close missing proof.",
    },
  ];
  const targets = baseTargets.map((target) => {
    const linkedTask = linkedPromotionTask(target.id);
    const linkedIssue = linkedPromotionIssue(target.id);
    const linkedTarget = {
      ...target,
      linkedRoadmapTaskId: linkedTask?.id,
      linkedRoadmapTaskOwner: linkedTask?.owner,
      linkedRoadmapTaskStatus: linkedTask?.status,
      linkedRoadmapTaskTitle: linkedTask?.title,
      linkedSupportIssueId: linkedIssue?.id,
      linkedSupportIssueOwner: linkedIssue?.owner,
      linkedSupportIssueStatus: linkedIssue?.status,
      linkedSupportIssueTitle: linkedIssue?.title,
    };
    if (target.status === "ready") return linkedTarget;
    if (linkedTask && linkedIssue) {
      return {
        ...linkedTarget,
        nextAction: `Roadmap task "${linkedTask.title}" and support issue "${linkedIssue.title}" are owned; update both with proof before promotion.`,
      };
    }
    if (linkedTask) {
      return {
        ...linkedTarget,
        nextAction: `Roadmap task "${linkedTask.title}" is ${linkedTask.status}; update it with proof before promotion.`,
      };
    }
    if (linkedIssue) {
      return {
        ...linkedTarget,
        nextAction: `Support issue "${linkedIssue.title}" is ${linkedIssue.status}; resolve customer/support risk before promotion.`,
      };
    }
    return linkedTarget;
  });
  const matrixWithoutMarkdown: Omit<VentureDeploymentEnvironmentMatrix, "markdown"> = {
    id: `${venture.id}-deployment-environment-matrix`,
    ventureId: venture.id,
    title: venture.title,
    targets,
    productionBoundary: "Production remains blocked unless the matrix says ready and a separate human-approved deployment action exists.",
  };

  return {
    ...matrixWithoutMarkdown,
    markdown: deploymentEnvironmentMatrixMarkdown(matrixWithoutMarkdown),
  };
}

function deploymentOwnerWorklistMarkdown(worklist: Omit<VentureDeploymentOwnerWorklist, "markdown">) {
  return [
    "# Deployment Owner Worklist",
    `Owner filter: ${worklist.ownerFilter}`,
    `Items: ${worklist.items.length}`,
    `Owners: ${worklist.owners.length > 0 ? worklist.owners.join(", ") : "none"}`,
    "",
    ...worklist.items.flatMap((item) => [
      `## ${item.owner} - ${item.ventureTitle} / ${item.targetLabel}`,
      `Type: ${item.workType}`,
      `Status: ${item.status}`,
      `Age: ${item.ageDays} day${item.ageDays === 1 ? "" : "s"} (${item.slaStatus})`,
      `SLA reason: ${item.slaReason}`,
      `Title: ${item.title}`,
      `Environment: ${item.targetLabel} (${item.targetStatus})`,
      `Proof: ${item.proofSummary}`,
      `Approval: ${item.approvalBoundary}`,
      "Required proof:",
      ...item.requiredProof.map((proof) => `- ${proof}`),
      `Next: ${item.nextAction}`,
      "",
    ]),
  ].join("\n");
}

function calculateAgeDays(createdAt: string, now: string) {
  const createdDate = new Date(createdAt);
  const nowDate = new Date(now);
  if (Number.isNaN(createdDate.getTime()) || Number.isNaN(nowDate.getTime())) return 0;
  return Math.max(0, Math.floor((nowDate.getTime() - createdDate.getTime()) / 86_400_000));
}

function deploymentOwnerSla(
  item: {
    status: VentureDeploymentOwnerWorkStatus;
    targetId: VentureDeploymentEnvironmentId;
    targetStatus: VentureDeploymentEnvironmentStatus;
    ageDays: number;
  },
): { slaStatus: VentureDeploymentOwnerSlaStatus; slaReason: string } {
  if (item.status === "done" || item.status === "resolved" || item.status === "dismissed") {
    return {
      slaStatus: "fresh",
      slaReason: "Owner work is already closed.",
    };
  }
  if (item.targetStatus === "blocked" || item.ageDays >= 7 || (item.targetId === "production" && item.ageDays >= 1)) {
    return {
      slaStatus: "stale",
      slaReason: `${item.targetId} deployment work has waited ${item.ageDays} day${item.ageDays === 1 ? "" : "s"}.`,
    };
  }
  if (item.ageDays >= 3 || item.targetId === "production") {
    return {
      slaStatus: "watch",
      slaReason: `${item.targetId} deployment work should be reviewed before it becomes stale.`,
    };
  }
  return {
    slaStatus: "fresh",
    slaReason: "Deployment owner work is still fresh.",
  };
}

export function buildVentureDeploymentOwnerWorklist(
  ventures: SavedVentureWorkspace[],
  ownerFilter = "all",
  now = new Date().toISOString(),
): VentureDeploymentOwnerWorklist {
  const targetOrder: Record<VentureDeploymentEnvironmentId, number> = {
    production: 0,
    staging: 1,
    preview: 2,
    local: 3,
  };
  const allItems = ventures.flatMap((venture) => {
    const matrix = buildVentureDeploymentEnvironmentMatrix(venture);
    return matrix.targets
      .filter((target) => target.status !== "ready")
      .flatMap((target): VentureDeploymentOwnerWorkItem[] => {
        const sourceRecordId = `${venture.id}-deployment-environment-${target.id}`;
        const linkedRoadmapTask = target.linkedRoadmapTaskId
          ? venture.roadmapTasks.find((task) => task.id === target.linkedRoadmapTaskId)
          : undefined;
        const linkedSupportIssue = target.linkedSupportIssueId
          ? venture.supportIssues.find((issue) => issue.id === target.linkedSupportIssueId)
          : undefined;
        const roadmapStatus: VentureDeploymentOwnerWorkStatus = target.linkedRoadmapTaskStatus ?? "candidate";
        const supportStatus: VentureDeploymentOwnerWorkStatus = target.linkedSupportIssueStatus ?? "candidate";
        const roadmapCreatedAt = linkedRoadmapTask?.createdAt ?? venture.updatedAt;
        const supportCreatedAt = linkedSupportIssue?.createdAt ?? venture.updatedAt;
        const roadmapAgeDays = calculateAgeDays(roadmapCreatedAt, now);
        const supportAgeDays = calculateAgeDays(supportCreatedAt, now);
        const roadmapSla = deploymentOwnerSla({
          status: roadmapStatus,
          targetId: target.id,
          targetStatus: target.status,
          ageDays: roadmapAgeDays,
        });
        const supportSla = deploymentOwnerSla({
          status: supportStatus,
          targetId: target.id,
          targetStatus: target.status,
          ageDays: supportAgeDays,
        });
        return [
          {
            id: `${venture.id}-${target.id}-deployment-roadmap-owner-work`,
            ventureId: venture.id,
            ventureTitle: venture.title,
            targetId: target.id,
            targetLabel: target.label,
            targetStatus: target.status,
            workType: "roadmap-task",
            recordId: target.linkedRoadmapTaskId,
            sourceRecordId,
            owner: target.linkedRoadmapTaskOwner ?? "release-owner",
            title: target.linkedRoadmapTaskTitle ?? `Deployment promotion blocker: ${target.label}`,
            status: roadmapStatus,
            createdAt: roadmapCreatedAt,
            ageDays: roadmapAgeDays,
            slaStatus: roadmapSla.slaStatus,
            slaReason: roadmapSla.slaReason,
            proofSummary: target.proofSummary,
            approvalBoundary: target.approvalBoundary,
            requiredProof: target.requiredProof,
            nextAction: target.nextAction,
          },
          {
            id: `${venture.id}-${target.id}-deployment-support-owner-work`,
            ventureId: venture.id,
            ventureTitle: venture.title,
            targetId: target.id,
            targetLabel: target.label,
            targetStatus: target.status,
            workType: "support-issue",
            recordId: target.linkedSupportIssueId,
            sourceRecordId,
            owner: target.linkedSupportIssueOwner ?? "support-owner",
            title: target.linkedSupportIssueTitle ?? `Deployment support risk: ${target.label}`,
            status: supportStatus,
            createdAt: supportCreatedAt,
            ageDays: supportAgeDays,
            slaStatus: supportSla.slaStatus,
            slaReason: supportSla.slaReason,
            proofSummary: target.proofSummary,
            approvalBoundary: target.approvalBoundary,
            requiredProof: target.requiredProof,
            nextAction: target.nextAction,
          },
        ];
      });
  }).sort((a, b) => (
    a.owner.localeCompare(b.owner) ||
    targetOrder[a.targetId] - targetOrder[b.targetId] ||
    a.workType.localeCompare(b.workType) ||
    a.ventureTitle.localeCompare(b.ventureTitle)
  ));
  const owners = Array.from(new Set(allItems.map((item) => item.owner))).sort((a, b) => a.localeCompare(b));
  const normalizedOwnerFilter = ownerFilter.trim();
  const ownerFilterKey = normalizedOwnerFilter.toLowerCase();
  const items = !normalizedOwnerFilter || ownerFilterKey === "all"
    ? allItems
    : allItems.filter((item) => item.owner.toLowerCase() === ownerFilterKey);
  const worklistWithoutMarkdown: Omit<VentureDeploymentOwnerWorklist, "markdown"> = {
    ownerFilter: !normalizedOwnerFilter || ownerFilterKey === "all" ? "all" : normalizedOwnerFilter,
    owners,
    items,
  };

  return {
    ...worklistWithoutMarkdown,
    markdown: deploymentOwnerWorklistMarkdown(worklistWithoutMarkdown),
  };
}

export function summarizeVentureDeploymentOwnerWorkload(
  ventures: SavedVentureWorkspace[],
  now = new Date().toISOString(),
): VentureDeploymentOwnerWorkloadSummary[] {
  const items = buildVentureDeploymentOwnerWorklist(ventures, "all", now).items;
  const summaries = new Map<string, VentureDeploymentOwnerWorkloadSummary>();
  const getSummary = (owner: string) => {
    const existing = summaries.get(owner);
    if (existing) return existing;
    const summary: VentureDeploymentOwnerWorkloadSummary = {
      owner,
      itemCount: 0,
      unresolvedCount: 0,
      candidateCount: 0,
      queuedCount: 0,
      triagedCount: 0,
      inProgressCount: 0,
      blockedCount: 0,
      doneCount: 0,
      resolvedCount: 0,
      freshCount: 0,
      watchCount: 0,
      staleCount: 0,
      productionCount: 0,
      stagingCount: 0,
      previewCount: 0,
      localCount: 0,
    };
    summaries.set(owner, summary);
    return summary;
  };

  items.forEach((item) => {
    const summary = getSummary(item.owner);
    summary.itemCount += 1;
    if (item.status !== "done" && item.status !== "resolved" && item.status !== "dismissed") {
      summary.unresolvedCount += 1;
    }
    if (item.status === "candidate") summary.candidateCount += 1;
    if (item.status === "queued") summary.queuedCount += 1;
    if (item.status === "triaged") summary.triagedCount += 1;
    if (item.status === "in-progress") summary.inProgressCount += 1;
    if (item.status === "blocked") summary.blockedCount += 1;
    if (item.status === "done") summary.doneCount += 1;
    if (item.status === "resolved") summary.resolvedCount += 1;
    if (item.slaStatus === "fresh") summary.freshCount += 1;
    if (item.slaStatus === "watch") summary.watchCount += 1;
    if (item.slaStatus === "stale") summary.staleCount += 1;
    if (item.targetId === "production") summary.productionCount += 1;
    if (item.targetId === "staging") summary.stagingCount += 1;
    if (item.targetId === "preview") summary.previewCount += 1;
    if (item.targetId === "local") summary.localCount += 1;
  });

  return Array.from(summaries.values()).sort((a, b) => (
    b.unresolvedCount - a.unresolvedCount ||
    b.productionCount - a.productionCount ||
    a.owner.localeCompare(b.owner)
  ));
}

function deploymentEscalationAuditRollupMarkdown(rollup: Omit<VentureDeploymentEscalationAuditRollup, "markdown">) {
  return [
    "# Deployment Escalation Audit Replay",
    `Recorded no-send deployment escalations: ${rollup.count}`,
    `No-send side effects: ${rollup.noSendCount}`,
    `Replayable audits: ${rollup.replayableCount}`,
    `External side effects: ${rollup.externalSideEffectCount}`,
    `Latest audit: ${rollup.latestCreatedAt || "none"}`,
    "",
    ...rollup.items.flatMap((item) => [
      `## ${item.ventureTitle} - ${item.status}`,
      `Action: ${item.actionType}`,
      `Actor: ${item.actor}`,
      `Approval: ${item.approvalLevel}`,
      `Side effect: ${item.sideEffect}`,
      `Source: ${item.sourceRecordId ?? "none"}`,
      `Risk: ${item.riskNote}`,
      `Replay: ${item.replayNote}`,
      `Evidence: ${item.evidence}`,
      `Next: ${item.nextAction}`,
      "",
    ]),
  ].join("\n");
}

export function buildVentureDeploymentEscalationAuditRollup(
  ventures: SavedVentureWorkspace[],
): VentureDeploymentEscalationAuditRollup {
  const items = ventures.flatMap((venture) => venture.autonomyAudit
    .filter((audit) => audit.actionType.startsWith("No-send deployment escalation"))
    .map((audit): VentureDeploymentEscalationAuditItem => ({
      id: `${venture.id}-${audit.id}-deployment-escalation-audit`,
      ventureId: venture.id,
      ventureTitle: venture.title,
      auditId: audit.id,
      sourceRecordId: audit.sourceRecordId,
      createdAt: audit.createdAt,
      actionType: audit.actionType,
      actor: audit.actor,
      approvalLevel: audit.approvalLevel,
      status: audit.status,
      sideEffect: audit.sideEffect,
      riskNote: audit.riskNote,
      replayNote: audit.replayNote,
      evidence: audit.evidence,
      nextAction: audit.nextAction,
    })))
    .sort((a, b) => (
      b.createdAt.localeCompare(a.createdAt) ||
      a.ventureTitle.localeCompare(b.ventureTitle) ||
      a.actionType.localeCompare(b.actionType)
    ));
  const rollupWithoutMarkdown: Omit<VentureDeploymentEscalationAuditRollup, "markdown"> = {
    count: items.length,
    proposedCount: items.filter((item) => item.status === "proposed").length,
    approvedCount: items.filter((item) => item.status === "approved").length,
    blockedCount: items.filter((item) => item.status === "blocked").length,
    executedCount: items.filter((item) => item.status === "executed").length,
    dismissedCount: items.filter((item) => item.status === "dismissed").length,
    noSendCount: items.filter((item) => item.sideEffect === "none").length,
    externalSideEffectCount: items.filter((item) => item.sideEffect.startsWith("external-")).length,
    replayableCount: items.filter((item) => item.replayNote.trim() && item.nextAction.trim()).length,
    latestCreatedAt: items[0]?.createdAt ?? "",
    items,
  };

  return {
    ...rollupWithoutMarkdown,
    markdown: deploymentEscalationAuditRollupMarkdown(rollupWithoutMarkdown),
  };
}

function investorBriefMarkdown(brief: Omit<VentureInvestorBrief, "markdown">) {
  return [
    `# Investor Brief: ${brief.title}`,
    `Status: ${brief.status}`,
    `Investability score: ${brief.investabilityScore}/100`,
    `Recommendation: ${brief.recommendation}`,
    `Next ask: ${brief.nextAsk}`,
    "",
    ...brief.sections.flatMap((section) => [
      `## ${section.heading}`,
      section.body,
      `Next: ${section.nextAction}`,
      "",
    ]),
  ].join("\n");
}

export function buildVentureInvestorBrief(venture: SavedVentureWorkspace): VentureInvestorBrief {
  const marketModel = buildVentureMarketModel(venture);
  const demandDrift = buildVentureDemandDriftReport(venture);
  const pricingCalibration = calibrateVenturePricing(venture);
  const killPressureReport = buildVentureKillPressureReport(venture);
  const qaReport = buildVentureQaReleaseReport(venture);
  const totalSignups = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.signupCount, 0);
  const totalActivated = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.activatedCount, 0);
  const cohortRevenueCents = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.revenueCents, 0);
  const receivedRevenueCents = venture.moneySignals
    .filter((signal) => (signal.type === "revenue" || signal.type === "grant" || signal.type === "credit") && signal.status === "received")
    .reduce((sum, signal) => sum + signal.amountCents, 0);
  const committedRevenueCents = venture.moneySignals
    .filter((signal) => (signal.type === "commitment" && (signal.status === "committed" || signal.status === "received")) || (signal.type === "revenue" && signal.status === "committed"))
    .reduce((sum, signal) => sum + signal.amountCents, 0);
  const revenueCents = receivedRevenueCents + committedRevenueCents + cohortRevenueCents;
  const openHighRisks = venture.riskRecords.filter((risk) => (
    risk.status !== "resolved" &&
    (risk.severity === "high" || risk.severity === "critical")
  )).length;
  const investabilityScore = clampScore(
    marketModel.confidenceScore * 0.24 +
    demandDrift.actualDemandScore * 0.24 +
    pricingCalibration.willingnessToPayScore * 0.16 +
    qaReport.releaseReadinessScore * 0.18 +
    Math.min(18, revenueCents / 1000) +
    (killPressureReport.recommendation === "scale" ? 8 : killPressureReport.recommendation === "kill" ? -22 : 0) -
    openHighRisks * 8,
  );
  const status: VentureInvestorBriefStatus = investabilityScore >= 72 && killPressureReport.recommendation !== "kill" && qaReport.status !== "blocked"
    ? "investable"
    : investabilityScore >= 45 && killPressureReport.recommendation !== "kill"
      ? "watch"
      : "not-ready";
  const sections: VentureFounderExecutionMemoSection[] = [
    {
      heading: "Market",
      body: `${marketModel.confidence} confidence at ${marketModel.confidenceScore}/100. ${marketModel.competition} Channel: ${marketModel.channel}`,
      nextAction: marketModel.nextAction,
    },
    {
      heading: "Demand",
      body: `Demand drift ${demandDrift.status}: baseline ${demandDrift.baselineDemandScore}/100, actual ${demandDrift.actualDemandScore}/100. ${demandDrift.reason}`,
      nextAction: demandDrift.nextAction,
    },
    {
      heading: "Traction",
      body: `${totalSignups} signups, ${totalActivated} activated users, ${venture.customerInterviews.length} interviews, ${venture.channelEconomics.length} channel economics record${venture.channelEconomics.length === 1 ? "" : "s"}.`,
      nextAction: totalSignups > 0 ? "Separate repeat activation from novelty before scaling spend." : "Capture the first measured traction signal.",
    },
    {
      heading: "Revenue",
      body: `${pricingCalibration.note} Revenue and commitments total $${Math.round(revenueCents / 100)}.`,
      nextAction: pricingCalibration.status === "validated" ? "Connect paid intent to retention and delivery proof." : "Validate willingness to pay before treating this as fundable.",
    },
    {
      heading: "Risks",
      body: `${killPressureReport.note} ${openHighRisks} unresolved high or critical risk${openHighRisks === 1 ? "" : "s"}.`,
      nextAction: killPressureReport.signals[0]?.nextAction ?? "Record the next risk-reducing evidence point.",
    },
    {
      heading: "QA Readiness",
      body: `QA ${qaReport.status} at ${qaReport.releaseReadinessScore}/100. ${qaReport.artifactSummary} ${qaReport.deploymentBoundary}`,
      nextAction: qaReport.checklist[0],
    },
  ];
  const nextAsk = status === "investable"
    ? "Prepare a live diligence packet with source evidence, customer proof, and deployment/QA evidence."
    : status === "watch"
      ? "Run the next experiment or QA fix before treating this as investor-ready."
      : "Do not pitch; resolve demand, risk, QA, or kill-pressure blockers first.";
  const briefWithoutMarkdown: Omit<VentureInvestorBrief, "markdown"> = {
    id: `${venture.id}-investor-brief`,
    ventureId: venture.id,
    title: venture.title,
    status,
    investabilityScore,
    recommendation: killPressureReport.recommendation,
    marketSummary: sections[0].body,
    demandSummary: sections[1].body,
    tractionSummary: sections[2].body,
    revenueSummary: sections[3].body,
    riskSummary: sections[4].body,
    qaSummary: sections[5].body,
    nextAsk,
    sections,
  };

  return {
    ...briefWithoutMarkdown,
    markdown: investorBriefMarkdown(briefWithoutMarkdown),
  };
}

function financialModelMarkdown(model: Omit<VentureFinancialModel, "markdown">) {
  return [
    `# Financial Model: ${model.title}`,
    `Status: ${model.status}`,
    `Finance score: ${model.financeScore}/100`,
    `Payback: ${model.paybackStatus}`,
    `Net evidence cash: ${formatCents(model.netEvidenceCashCents)}`,
    "",
    "## Revenue",
    model.revenueSummary,
    "",
    "## Costs",
    model.expenseSummary,
    "",
    "## Unit Economics",
    model.unitEconomicsSummary,
    "",
    "## Runway",
    model.runwaySummary,
    "",
    "## Scaling Threshold",
    model.scalingThreshold,
    "",
    "## Assumptions",
    ...model.assumptions.map((assumption) => `- ${assumption}`),
    "",
    "## Risks",
    ...(model.risks.length > 0 ? model.risks.map((risk) => `- ${risk}`) : ["- No finance risk detected from recorded evidence."]),
    "",
    "## Next Actions",
    ...model.nextActions.map((action) => `- ${action}`),
  ].join("\n");
}

function strongestPaybackStatus(statuses: VenturePaybackStatus[], computedStatus: VenturePaybackStatus): VenturePaybackStatus {
  const allStatuses = [...statuses, computedStatus];
  if (allStatuses.includes("paid-back")) return "paid-back";
  if (allStatuses.includes("partial-payback")) return "partial-payback";
  if (allStatuses.includes("no-payback")) return "no-payback";
  return "unknown";
}

export function buildVentureFinancialModel(venture: SavedVentureWorkspace): VentureFinancialModel {
  const pricingCalibration = calibrateVenturePricing(venture);
  const receivedRevenueCents = venture.moneySignals
    .filter((signal) => (signal.type === "revenue" || signal.type === "grant" || signal.type === "credit") && signal.status === "received")
    .reduce((sum, signal) => sum + signal.amountCents, 0);
  const committedRevenueCents = venture.moneySignals
    .filter((signal) => (signal.type === "commitment" && (signal.status === "committed" || signal.status === "received")) || (signal.type === "revenue" && signal.status === "committed"))
    .reduce((sum, signal) => sum + signal.amountCents, 0);
  const moneyExpenseCents = venture.moneySignals
    .filter((signal) => (
      (signal.type === "expense" && (signal.status === "planned" || signal.status === "committed" || signal.status === "spent")) ||
      (signal.type === "refund" && signal.status === "refunded")
    ))
    .reduce((sum, signal) => sum + signal.amountCents, 0);
  const blockedMoneySignalCount = venture.moneySignals.filter((signal) => signal.status === "blocked").length;
  const cohortRevenueCents = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.revenueCents, 0);
  const channelRevenueCents = venture.channelEconomics.reduce((sum, economics) => sum + economics.revenueCents, 0);
  const acquisitionSpendCents = venture.channelEconomics.reduce((sum, economics) => sum + economics.spendCents, 0);
  const totalEvidenceRevenueCents = receivedRevenueCents + cohortRevenueCents + channelRevenueCents;
  const expenseCents = moneyExpenseCents + acquisitionSpendCents;
  const netEvidenceCashCents = totalEvidenceRevenueCents + committedRevenueCents - expenseCents;
  const paidUserCount = venture.channelEconomics.reduce((sum, economics) => sum + economics.paidCount, 0) ||
    venture.activationCohorts.reduce((sum, cohort) => sum + cohort.paidCount, 0);
  const blendedCacCents = divideCurrencyCents(acquisitionSpendCents, paidUserCount);
  const paybackStatus = strongestPaybackStatus(
    venture.channelEconomics.map((economics) => economics.paybackStatus),
    paybackStatusFor(acquisitionSpendCents, channelRevenueCents + cohortRevenueCents),
  );
  const openHighRisks = venture.riskRecords.filter((risk) => (
    risk.status !== "resolved" &&
    (risk.severity === "high" || risk.severity === "critical")
  )).length;
  const highSupportIssues = venture.supportIssues.filter((issue) => (
    issue.status !== "resolved" &&
    issue.status !== "dismissed" &&
    (issue.severity === "high" || issue.severity === "critical")
  )).length;
  const hasRunwayRisk = blockedMoneySignalCount > 0 ||
    netEvidenceCashCents < 0 ||
    (expenseCents > 0 && totalEvidenceRevenueCents + committedRevenueCents <= 0);
  const financeScore = clampScore(
    28 +
    Math.min(18, totalEvidenceRevenueCents / 1000) +
    Math.min(14, committedRevenueCents / 1000) +
    (paidUserCount > 0 ? 8 : -5) +
    (pricingCalibration.paidSignalCount > 0 ? 8 : -4) +
    (paybackStatus === "paid-back" ? 18 : paybackStatus === "partial-payback" ? 6 : paybackStatus === "no-payback" ? -16 : -6) +
    (netEvidenceCashCents >= 0 ? 8 : -12) -
    blockedMoneySignalCount * 12 -
    openHighRisks * 5 -
    highSupportIssues * 4,
  );
  const status: VentureFinancialModelStatus = blockedMoneySignalCount > 0
    ? "blocked"
    : hasRunwayRisk
      ? "runway-risk"
      : financeScore >= 75 && paybackStatus === "paid-back" && paidUserCount > 0
        ? "scale-ready"
        : "needs-proof";
  const runwayRisk = blockedMoneySignalCount > 0
    ? `${blockedMoneySignalCount} money signal${blockedMoneySignalCount === 1 ? "" : "s"} blocked before external action.`
    : netEvidenceCashCents < 0
      ? `Expenses exceed recorded revenue and commitments by ${formatCents(Math.abs(netEvidenceCashCents))}.`
      : expenseCents > 0 && totalEvidenceRevenueCents + committedRevenueCents <= 0
        ? "Spend is planned before any revenue, commitment, grant, credit, cohort revenue, or channel revenue is recorded."
        : "No immediate runway risk detected from recorded finance evidence.";
  const scalingThreshold = status === "scale-ready"
    ? `Scale only if the next cohort keeps CAC at or below ${formatCents(blendedCacCents)} and channel revenue stays above acquisition spend.`
    : paybackStatus === "unknown"
      ? "Do not scale until acquisition spend, paid users, and channel revenue are tied to the same cohort."
      : paybackStatus === "no-payback"
        ? "Pause repeat spend until channel revenue or retained paid users can cover acquisition cost."
        : "Run one more measured cohort before increasing spend, hiring, or external billing.";
  const assumptions = [
    `Pricing hypothesis remains ${venture.pricingHypothesis || "unpriced"}.`,
    `Retention depends on ${venture.retentionMechanism || "a recorded repeat-use mechanism"}.`,
    `Primary acquisition starts with ${venture.acquisitionChannels[0] ?? "an unrecorded channel"}.`,
    "Money, cohort, and channel records are evidence streams; reconcile duplicates before treating this as audited accounting.",
  ];
  const risks = [
    pricingCalibration.status === "validated" ? "" : `Pricing is ${pricingCalibration.status}; willingness-to-pay proof is not yet investor-grade.`,
    venture.activationCohorts.length === 0 ? "No activation cohort connects revenue to retained users." : "",
    venture.channelEconomics.length === 0 ? "No channel economics record connects spend to paid users." : "",
    paybackStatus === "no-payback" ? "Recorded acquisition spend has not paid back." : "",
    blockedMoneySignalCount > 0 ? runwayRisk : "",
    openHighRisks > 0 ? `${openHighRisks} high or critical business risk${openHighRisks === 1 ? "" : "s"} remain unresolved.` : "",
    highSupportIssues > 0 ? `${highSupportIssues} high or critical support issue${highSupportIssues === 1 ? "" : "s"} may damage gross margin or retention.` : "",
    netEvidenceCashCents < 0 ? "Net evidence cash is negative." : "",
  ].filter(Boolean);
  const nextActions = [
    venture.moneySignals.length === 0 ? "Record at least one money signal before producing a scaling budget." : "",
    venture.activationCohorts.length === 0 ? "Attach revenue to an activation cohort with retained and paid users." : "",
    venture.channelEconomics.length === 0 ? "Record channel economics so CAC and payback are measurable." : "",
    paybackStatus === "no-payback" ? "Stop repeat spend until the payback gap is closed or the channel is killed." : "",
    hasRunwayRisk ? "Resolve blocked/negative runway evidence before approving spend, billing, or hiring." : "",
    status === "scale-ready" ? "Prepare a human-approved scaling budget with explicit spend ceilings and payback stop rules." : "",
  ].filter(Boolean);
  if (nextActions.length === 0) {
    nextActions.push("Keep finance evidence fresh after the next launch, cohort, or billing decision.");
  }

  const modelWithoutMarkdown: Omit<VentureFinancialModel, "markdown"> = {
    id: `${venture.id}-financial-model`,
    ventureId: venture.id,
    title: venture.title,
    status,
    financeScore,
    receivedRevenueCents,
    committedRevenueCents,
    cohortRevenueCents,
    channelRevenueCents,
    totalEvidenceRevenueCents,
    expenseCents,
    acquisitionSpendCents,
    netEvidenceCashCents,
    paidUserCount,
    blendedCacCents,
    paybackStatus,
    runwayRisk,
    scalingThreshold,
    revenueSummary: `${formatCents(receivedRevenueCents)} received, ${formatCents(committedRevenueCents)} committed, ${formatCents(cohortRevenueCents)} cohort revenue, and ${formatCents(channelRevenueCents)} channel revenue.`,
    expenseSummary: `${formatCents(moneyExpenseCents)} money expenses/refunds plus ${formatCents(acquisitionSpendCents)} acquisition spend; total modeled expense ${formatCents(expenseCents)}.`,
    unitEconomicsSummary: `${paidUserCount} paid user${paidUserCount === 1 ? "" : "s"}, blended CAC ${formatCents(blendedCacCents)}, payback ${paybackStatus}.`,
    runwaySummary: `${runwayRisk} Net evidence cash is ${formatCents(netEvidenceCashCents)}.`,
    assumptions,
    risks,
    nextActions,
  };

  return {
    ...modelWithoutMarkdown,
    markdown: financialModelMarkdown(modelWithoutMarkdown),
  };
}

function chartValueText(value: number, unit: VentureChartUnit) {
  if (unit === "currency-cents") return formatCents(value);
  if (unit === "score") return `${Math.round(value)}/100`;
  if (unit === "percent") return `${Math.round(value)}%`;
  return String(Math.round(value));
}

function scoreTone(value: number): VentureChartTone {
  if (value >= 75) return "emerald";
  if (value >= 50) return "blue";
  if (value >= 30) return "amber";
  return "red";
}

function countTone(value: number): VentureChartTone {
  if (value <= 0) return "slate";
  if (value === 1) return "blue";
  if (value <= 3) return "amber";
  return "emerald";
}

function deploymentEscalationAuditStatusTone(status: VentureAutonomyAuditStatus, count: number): VentureChartTone {
  if (count <= 0) return "slate";
  if (status === "blocked") return "red";
  if (status === "approved" || status === "executed") return "emerald";
  if (status === "dismissed") return "slate";
  return "amber";
}

function deploymentEscalationAuditSideEffectTone(sideEffect: VentureAutonomySideEffect, count: number): VentureChartTone {
  if (count <= 0) return "slate";
  if (sideEffect.startsWith("external-")) return "red";
  if (sideEffect === "none") return "emerald";
  return "blue";
}

function withChartMax(data: Array<Omit<VentureChartDatum, "maxValue">>, floor = 1): VentureChartDatum[] {
  const maxValue = Math.max(floor, ...data.map((datum) => Math.abs(datum.value)));
  return data.map((datum) => ({ ...datum, maxValue }));
}

function portfolioChartPackMarkdown(pack: Omit<VenturePortfolioChartPack, "markdown">) {
  return [
    "# Venture Portfolio Charts",
    `Ventures: ${pack.ventureCount}`,
    `Charts: ${pack.chartCount}`,
    "",
    ...pack.charts.flatMap((chart) => [
      `## ${chart.title}`,
      ...(chart.data.length > 0
        ? chart.data.map((datum) => `- ${datum.label}: ${chartValueText(datum.value, datum.unit)}; ${datum.detail}`)
        : ["- No chart data available."]),
      "",
    ]),
  ].join("\n");
}

export function buildVenturePortfolioChartPack(ventures: SavedVentureWorkspace[]): VenturePortfolioChartPack {
  const scoredVentures = ventures.map((venture) => {
    const evidence = summarizeVentureEvidence(venture);
    const demandDrift = buildVentureDemandDriftReport(venture);
    const finance = buildVentureFinancialModel(venture);
    const qa = buildVentureQaReleaseReport(venture);
    const killPressure = buildVentureKillPressureReport(venture);

    return {
      venture,
      evidence,
      demandDrift,
      finance,
      qa,
      killPressure,
    };
  });

  const scoreCharts: VenturePortfolioChart[] = [
    {
      id: "evidence-readiness-chart",
      title: "Evidence Readiness Chart",
      unit: "score",
      data: scoredVentures.map(({ venture, evidence }) => ({
        id: `${venture.id}-evidence-readiness`,
        label: venture.title,
        value: evidence.readinessScore,
        maxValue: 100,
        unit: "score",
        detail: `${evidence.readiness}; ${evidence.sourceCount} source${evidence.sourceCount === 1 ? "" : "s"}.`,
        tone: scoreTone(evidence.readinessScore),
      })),
    },
    {
      id: "demand-reality-chart",
      title: "Demand Reality Chart",
      unit: "score",
      data: scoredVentures.map(({ venture, demandDrift }) => ({
        id: `${venture.id}-demand-reality`,
        label: venture.title,
        value: demandDrift.actualDemandScore,
        maxValue: 100,
        unit: "score",
        detail: `${demandDrift.status}; baseline ${demandDrift.baselineDemandScore}/100 and drift ${demandDrift.drift >= 0 ? "+" : ""}${demandDrift.drift}.`,
        tone: scoreTone(demandDrift.actualDemandScore),
      })),
    },
    {
      id: "finance-score-chart",
      title: "Finance Score Chart",
      unit: "score",
      data: scoredVentures.map(({ venture, finance }) => ({
        id: `${venture.id}-finance-score`,
        label: venture.title,
        value: finance.financeScore,
        maxValue: 100,
        unit: "score",
        detail: `${finance.status}; payback ${finance.paybackStatus}; net ${formatCents(finance.netEvidenceCashCents)}.`,
        tone: scoreTone(finance.financeScore),
      })),
    },
    {
      id: "qa-readiness-chart",
      title: "QA Readiness Chart",
      unit: "score",
      data: scoredVentures.map(({ venture, qa }) => ({
        id: `${venture.id}-qa-readiness`,
        label: venture.title,
        value: qa.releaseReadinessScore,
        maxValue: 100,
        unit: "score",
        detail: `${qa.status}; ${qa.passedCheckCount}/${qa.totalCheckCount} checks passed.`,
        tone: scoreTone(qa.releaseReadinessScore),
      })),
    },
  ];

  const lifecycleCounts = ventures.reduce<Record<string, number>>((counts, venture) => ({
    ...counts,
    [venture.lifecycleStatus]: (counts[venture.lifecycleStatus] ?? 0) + 1,
  }), {});
  const recommendationCounts = scoredVentures.reduce<Record<VentureDecisionType, number>>((counts, item) => ({
    ...counts,
    [item.killPressure.recommendation]: (counts[item.killPressure.recommendation] ?? 0) + 1,
  }), {
    continue: 0,
    pivot: 0,
    pause: 0,
    kill: 0,
    scale: 0,
    archive: 0,
  });
  const netCashData = withChartMax(scoredVentures.map(({ venture, finance }) => ({
    id: `${venture.id}-net-evidence-cash`,
    label: venture.title,
    value: finance.netEvidenceCashCents,
    unit: "currency-cents" as const,
    detail: `${finance.status}; ${finance.runwayRisk}`,
    tone: finance.netEvidenceCashCents < 0 ? "red" as const : finance.netEvidenceCashCents > 0 ? "emerald" as const : "slate" as const,
  })));
  const lifecycleData = withChartMax(Object.entries(lifecycleCounts).map(([status, count]) => ({
    id: `lifecycle-${status}`,
    label: status,
    value: count,
    unit: "count" as const,
    detail: `${count} venture${count === 1 ? "" : "s"} currently ${status}.`,
    tone: countTone(count),
  })));
  const recommendationData = withChartMax(Object.entries(recommendationCounts).map(([decision, count]) => ({
    id: `recommendation-${decision}`,
    label: decision,
    value: count,
    unit: "count" as const,
    detail: `${count} venture${count === 1 ? "" : "s"} currently recommended to ${decision}.`,
    tone: decision === "kill" || decision === "pause" ? (count > 0 ? "red" as const : "slate" as const) : countTone(count),
  })));
  const deploymentWorkload = summarizeVentureDeploymentOwnerWorkload(ventures);
  const deploymentWorkItems = buildVentureDeploymentOwnerWorklist(ventures).items;
  const deploymentEscalationAuditRollup = buildVentureDeploymentEscalationAuditRollup(ventures);
  const deploymentEnvironmentCounts = deploymentWorkItems.reduce<Record<VentureDeploymentEnvironmentId, number>>((counts, item) => ({
    ...counts,
    [item.targetId]: (counts[item.targetId] ?? 0) + 1,
  }), {
    local: 0,
    preview: 0,
    staging: 0,
    production: 0,
  });
  const deploymentSlaCounts = deploymentWorkItems.reduce<Record<VentureDeploymentOwnerSlaStatus, number>>((counts, item) => ({
    ...counts,
    [item.slaStatus]: (counts[item.slaStatus] ?? 0) + 1,
  }), {
    fresh: 0,
    watch: 0,
    stale: 0,
  });
  const deploymentStatusCounts = deploymentWorkItems.reduce<Record<string, number>>((counts, item) => ({
    ...counts,
    [item.status]: (counts[item.status] ?? 0) + 1,
  }), {});
  const deploymentOwnerData = withChartMax(deploymentWorkload.map((summary) => ({
    id: `deployment-owner-${summary.owner}`,
    label: summary.owner,
    value: summary.unresolvedCount,
    unit: "count" as const,
    detail: `${summary.itemCount} total, ${summary.staleCount} stale, ${summary.productionCount} production.`,
    tone: summary.staleCount > 0 ? "red" as const : summary.unresolvedCount > 0 ? "amber" as const : "emerald" as const,
  })));
  const deploymentEnvironmentData = withChartMax(([
    ["production", deploymentEnvironmentCounts.production],
    ["staging", deploymentEnvironmentCounts.staging],
    ["preview", deploymentEnvironmentCounts.preview],
    ["local", deploymentEnvironmentCounts.local],
  ] as const).map(([environment, count]) => ({
    id: `deployment-environment-${environment}`,
    label: environment,
    value: count,
    unit: "count" as const,
    detail: `${count} owner work item${count === 1 ? "" : "s"} tied to ${environment}.`,
    tone: environment === "production" && count > 0 ? "red" as const : countTone(count),
  })));
  const deploymentSlaData = withChartMax(([
    ["stale", deploymentSlaCounts.stale],
    ["watch", deploymentSlaCounts.watch],
    ["fresh", deploymentSlaCounts.fresh],
  ] as const).map(([slaStatus, count]) => ({
    id: `deployment-sla-${slaStatus}`,
    label: slaStatus,
    value: count,
    unit: "count" as const,
    detail: `${count} deployment owner work item${count === 1 ? "" : "s"} in ${slaStatus} SLA state.`,
    tone: slaStatus === "stale" ? (count > 0 ? "red" as const : "slate" as const) : slaStatus === "watch" ? "amber" as const : "emerald" as const,
  })));
  const deploymentStatusData = withChartMax(Object.entries(deploymentStatusCounts).map(([status, count]) => ({
    id: `deployment-status-${status}`,
    label: status,
    value: count,
    unit: "count" as const,
    detail: `${count} deployment owner work item${count === 1 ? "" : "s"} currently ${status}.`,
    tone: status === "done" || status === "resolved" ? "emerald" as const : status === "blocked" ? "red" as const : countTone(count),
  })));
  const deploymentEscalationStatusValues: VentureAutonomyAuditStatus[] = ["proposed", "approved", "executed", "blocked", "dismissed"];
  const deploymentEscalationSideEffectValues: VentureAutonomySideEffect[] = ["none", "local-only", "external-proposed", "external-approved", "external-blocked"];
  const deploymentEscalationActorCounts = deploymentEscalationAuditRollup.items.reduce<Record<string, number>>((counts, item) => ({
    ...counts,
    [item.actor]: (counts[item.actor] ?? 0) + 1,
  }), {});
  const deploymentEscalationStatusData = withChartMax(deploymentEscalationStatusValues.map((status) => {
    const count = deploymentEscalationAuditRollup.items.filter((item) => item.status === status).length;
    return {
      id: `deployment-escalation-status-${status}`,
      label: status,
      value: count,
      unit: "count" as const,
      detail: `${count} recorded deployment escalation audit${count === 1 ? "" : "s"} currently ${status}.`,
      tone: deploymentEscalationAuditStatusTone(status, count),
    };
  }));
  const deploymentEscalationSideEffectData = withChartMax(deploymentEscalationSideEffectValues.map((sideEffect) => {
    const count = deploymentEscalationAuditRollup.items.filter((item) => item.sideEffect === sideEffect).length;
    return {
      id: `deployment-escalation-side-effect-${sideEffect}`,
      label: sideEffect,
      value: count,
      unit: "count" as const,
      detail: `${count} recorded deployment escalation audit${count === 1 ? "" : "s"} with ${sideEffect} side effect.`,
      tone: deploymentEscalationAuditSideEffectTone(sideEffect, count),
    };
  }));
  const deploymentEscalationActorData = withChartMax(Object.entries(deploymentEscalationActorCounts).map(([actor, count]) => ({
    id: `deployment-escalation-actor-${actor}`,
    label: actor,
    value: count,
    unit: "count" as const,
    detail: `${count} recorded deployment escalation audit${count === 1 ? "" : "s"} owned by ${actor}.`,
    tone: countTone(count),
  })));
  const charts: VenturePortfolioChart[] = [
    ...scoreCharts,
    {
      id: "net-evidence-cash-chart",
      title: "Net Evidence Cash Chart",
      unit: "currency-cents",
      data: netCashData,
    },
    {
      id: "lifecycle-distribution-chart",
      title: "Lifecycle Distribution Chart",
      unit: "count",
      data: lifecycleData,
    },
    {
      id: "kill-scale-recommendation-chart",
      title: "Kill Scale Recommendation Chart",
      unit: "count",
      data: recommendationData,
    },
    {
      id: "deployment-owner-workload-chart",
      title: "Deployment Owner Workload Chart",
      unit: "count",
      data: deploymentOwnerData,
    },
    {
      id: "deployment-environment-workload-chart",
      title: "Deployment Environment Workload Chart",
      unit: "count",
      data: deploymentEnvironmentData,
    },
    {
      id: "deployment-sla-workload-chart",
      title: "Deployment SLA Workload Chart",
      unit: "count",
      data: deploymentSlaData,
    },
    {
      id: "deployment-status-workload-chart",
      title: "Deployment Status Workload Chart",
      unit: "count",
      data: deploymentStatusData,
    },
    {
      id: "deployment-escalation-status-chart",
      title: "Deployment Escalation Status Chart",
      unit: "count",
      data: deploymentEscalationStatusData,
    },
    {
      id: "deployment-escalation-side-effect-chart",
      title: "Deployment Escalation Side Effect Chart",
      unit: "count",
      data: deploymentEscalationSideEffectData,
    },
    {
      id: "deployment-escalation-actor-chart",
      title: "Deployment Escalation Actor Chart",
      unit: "count",
      data: deploymentEscalationActorData,
    },
  ];
  const packWithoutMarkdown: Omit<VenturePortfolioChartPack, "markdown"> = {
    id: "venture-portfolio-chart-pack",
    ventureCount: ventures.length,
    chartCount: charts.length,
    charts,
  };

  return {
    ...packWithoutMarkdown,
    markdown: portfolioChartPackMarkdown(packWithoutMarkdown),
  };
}

function outreachCampaignMarkdown(campaign: Omit<VentureOutreachCampaignBrief, "markdown">) {
  return [
    `# Outreach Campaign Brief: ${campaign.title}`,
    `Status: ${campaign.status}`,
    `Persona: ${campaign.persona}`,
    `Channel: ${campaign.channel}`,
    `Approval boundary: ${campaign.approvalBoundary}`,
    `No-send boundary: ${campaign.noSendBoundary}`,
    "",
    "## Audience Segments",
    ...campaign.audienceSegments.map((segment) => `- ${segment}`),
    "",
    "## Message Sequence",
    ...campaign.messageSequence.map((message) => `- ${message}`),
    "",
    "## Proof Points",
    ...campaign.proofPoints.map((proof) => `- ${proof}`),
    "",
    "## Risk Checks",
    ...campaign.riskChecks.map((risk) => `- ${risk}`),
    "",
    "## Source Evidence",
    ...campaign.sourceEvidence.map((source) => `- ${source}`),
    "",
    "## Next Actions",
    ...campaign.nextActions.map((action) => `- ${action}`),
  ].join("\n");
}

export function buildVentureOutreachCampaignBrief(venture: SavedVentureWorkspace): VentureOutreachCampaignBrief {
  const latestApproval = venture.outreachApprovals[0];
  const latestInterview = venture.customerInterviews[0];
  const openHighRisks = venture.riskRecords.filter((risk) => (
    risk.status !== "resolved" &&
    (risk.severity === "high" || risk.severity === "critical")
  ));
  const persona = latestApproval?.contactPersona || latestInterview?.persona || venture.targetBuyer;
  const channel = latestApproval?.channel || latestInterview?.channel || venture.acquisitionChannels[0] || "manual founder-led outreach";
  const generatedDraft = `Hi ${persona}, we are testing ${venture.productWedge} for ${venture.painStatement} Would a short manual walkthrough be useful?`;
  const status: VentureOutreachCampaignStatus = latestApproval?.status === "completed"
    ? "recorded"
    : latestApproval?.status === "approved" || latestApproval?.status === "manual-contact-planned"
      ? "ready"
      : latestApproval?.status === "draft" || latestInterview
        ? "needs-approval"
        : "blocked";
  const approvalBoundary = latestApproval
    ? `${latestApproval.approvalLevel} recorded as ${latestApproval.status}; attribution ${latestApproval.attribution}.`
    : "Requires a human-approved outreach record before any external contact.";
  const noSendBoundary = latestApproval
    ? `External send status: ${latestApproval.externalSendStatus}. The app stores the draft and did not send it.`
    : "External send status: not-sent. The app may draft only until a human records approval.";
  const audienceSegments = Array.from(new Set([
    persona,
    latestInterview ? `${latestInterview.sentiment} interview: ${latestInterview.persona}` : "",
    venture.targetBuyer,
    ...venture.acquisitionChannels.map((candidate) => `${candidate} audience`),
  ].filter(Boolean))).slice(0, 6);
  const messageSequence = [
    `Opening: ${latestApproval?.messageDraft || generatedDraft}`,
    `Follow-up: Ask whether "${venture.painStatement}" is urgent enough to try a manual pilot this week.`,
    `Proof request: Ask for one workflow artifact, screenshot, or calendar moment that proves the pain is real.`,
    "Stop rule: stop immediately on no consent, unclear fit, clinical/legal sensitivity, or no reply after the human-approved sequence.",
  ];
  const proofPoints = Array.from(new Set([
    latestInterview?.painQuote ? `Pain quote: ${latestInterview.painQuote}` : "",
    latestInterview?.willingnessToPay ? `Willingness to pay: ${latestInterview.willingnessToPay}` : "",
    venture.evidenceSources[0]?.summary ? `Source: ${venture.evidenceSources[0].summary}` : "",
    venture.experiments.find((experiment) => experiment.result !== "Not run yet.")?.result ?? "",
    venture.pricingSignals[0]?.evidenceNote ?? "",
  ].filter(Boolean))).slice(0, 6);
  const riskChecks = Array.from(new Set([
    latestApproval?.riskNote || "No outreach approval risk note recorded.",
    "Do not imply a finished product, collected payment, deployment, or medical/legal/financial advice.",
    "Keep opt-out and consent language visible in any human-sent message.",
    ...openHighRisks.map((risk) => `${risk.severity} risk: ${risk.title} - ${risk.mitigation}`),
  ])).slice(0, 8);
  const sourceEvidence = Array.from(new Set([
    latestApproval ? `Approval ${latestApproval.id}: ${latestApproval.messageDraft}` : "",
    latestInterview ? `Interview ${latestInterview.id}: ${latestInterview.painQuote}` : "",
    ...venture.evidenceSources.slice(0, 3).map((source) => `${source.platform}: ${source.title || source.summary}`),
  ].filter(Boolean))).slice(0, 8);
  const nextActions = [
    status === "blocked" ? "Record a customer interview or outreach approval before creating an external campaign." : "",
    status === "needs-approval" ? "Route this campaign through human-approved outreach before any external send." : "",
    status === "ready" ? "Have the human owner review the draft, risk checks, and no-send boundary before manually contacting anyone." : "",
    status === "recorded" ? "Review measured replies and convert them into experiment, interview, pricing, or risk records." : "",
    openHighRisks.length > 0 ? "Resolve high or critical risks before scaling the campaign." : "",
  ].filter(Boolean);
  if (nextActions.length === 0) {
    nextActions.push("Keep outreach evidence tied to approvals, interviews, and explicit no-send state.");
  }
  const campaignWithoutMarkdown: Omit<VentureOutreachCampaignBrief, "markdown"> = {
    id: `${venture.id}-outreach-campaign`,
    ventureId: venture.id,
    title: venture.title,
    status,
    persona,
    channel,
    approvalBoundary,
    noSendBoundary,
    audienceSegments,
    messageSequence,
    proofPoints,
    riskChecks,
    sourceEvidence,
    nextActions,
  };

  return {
    ...campaignWithoutMarkdown,
    markdown: outreachCampaignMarkdown(campaignWithoutMarkdown),
  };
}

function generatedAppMarkdown(app: Omit<VentureGeneratedAppHandoff, "markdown">) {
  return [
    `# Generated App Handoff: ${app.title}`,
    `Status: ${app.status}`,
    `App: ${app.appName}`,
    `Repo: ${app.repoPath}`,
    `Source: ${app.sourceCodeStatus}`,
    `Boundary: ${app.generationBoundary}`,
    `Deployment: ${app.deploymentBoundary}`,
    "",
    "## Route Plan",
    ...app.routePlan.map((route) => `- ${route}`),
    "",
    "## File Manifest",
    ...app.fileManifest.map((file) => `- ${file}`),
    "",
    "## Data Model",
    ...app.dataModel.map((model) => `- ${model}`),
    "",
    "## Environment",
    ...app.envVars.map((envVar) => `- ${envVar}`),
    "",
    "## Verification Commands",
    ...app.verificationCommands.map((command) => `- ${command}`),
    "",
    "## QA Checklist",
    ...app.qaChecklist.map((item) => `- [ ] ${item}`),
    "",
    "## Generated Source Scaffold",
    `Scaffold status: ${app.sourceScaffold.status}`,
    `Local target path: ${app.sourceScaffold.localTargetPath}`,
    `Source boundary: ${app.sourceScaffold.sourceBoundary}`,
    `Materialization: ${app.sourceScaffold.materializationInstruction}`,
    `Runnable proof: ${app.sourceScaffold.runnableProofStatus}`,
    "",
    "### Source Files",
    ...app.sourceScaffold.sourceFiles.map((file) => `- ${file.path} (${file.language}, ${file.role}, ${file.contentSignature})`),
    "",
    "### Proof Capture Checklist",
    ...app.sourceScaffold.proofCaptureChecklist.map((item) => `- [ ] ${item}`),
    "",
    "### No-Fake-Source Safeguards",
    ...app.sourceScaffold.noFakeSourceSafeguards.map((safeguard) => `- ${safeguard}`),
  ].join("\n");
}

function appSlug(title: string) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || "generated-venture-app";
}

function sourceContentSignature(content: string) {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function sourceFile(path: string, role: string, language: string, content: string): VentureGeneratedAppSourceFile {
  return {
    path,
    role,
    language,
    content,
    contentSignature: sourceContentSignature(content),
  };
}

function generatedAppVerificationCommands(latestMvp?: VentureMvpBuildWorkspaceRecord) {
  return Array.from(new Set([
    latestMvp?.setupCommand ?? "pnpm install --frozen-lockfile",
    latestMvp?.typecheckCommand ?? "pnpm type-check",
    latestMvp?.testCommand ?? "pnpm test",
    latestMvp?.buildCommand ?? "pnpm build",
    latestMvp?.browserSmokeCommand ?? "pnpm exec playwright test e2e/app.spec.ts -g \"core demo flow\"",
  ]));
}

function buildGeneratedAppSourceFiles(venture: SavedVentureWorkspace, appName: string): VentureGeneratedAppSourceFile[] {
  const experiment = venture.experiments[0];
  const firstChannel = venture.acquisitionChannels[0] ?? "manual founder outreach";
  const ventureData = {
    title: venture.title,
    targetBuyer: venture.targetBuyer,
    painStatement: venture.painStatement,
    productWedge: venture.productWedge,
    revenueModel: venture.revenueModel,
    pricingHypothesis: venture.pricingHypothesis,
    retentionMechanism: venture.retentionMechanism,
    firstChannel,
    nextExperiment: experiment
      ? {
          type: experiment.type,
          hypothesis: experiment.hypothesis,
          successThreshold: experiment.successThreshold,
          failureThreshold: experiment.failureThreshold,
          primaryMetric: experiment.metrics[0] ?? "Qualified opt-ins",
        }
      : {
          type: "Manual validation",
          hypothesis: `If ${venture.targetBuyer} urgently feels ${venture.painStatement}, they will join a no-send waitlist before a full build.`,
          successThreshold: "At least 5 qualified opt-ins from source-backed channels.",
          failureThreshold: "Fewer than 2 qualified opt-ins after a focused validation sprint.",
          primaryMetric: "Qualified opt-ins",
        },
    safeguards: [
      "No outreach sends without human approval.",
      "No paid spend without human approval.",
      "No deployment without local verification and approval.",
      "No billing changes without a human-approved billing gate.",
    ],
  };
  const packageJson = `${JSON.stringify({
    name: appName,
    private: true,
    version: "0.0.1",
    type: "module",
    scripts: {
      dev: "vite --host 127.0.0.1 --port 4174",
      "type-check": "tsc --noEmit",
      test: "vitest run tests",
      build: "vite build",
      "browser-smoke": "playwright test e2e/venture-flow.spec.ts",
      preview: "vite preview --host 127.0.0.1",
    },
    dependencies: {
      "@vitejs/plugin-react": "latest",
      vite: "latest",
      typescript: "latest",
      react: "latest",
      "react-dom": "latest",
      vitest: "latest",
    },
    devDependencies: {
      "@types/react": "latest",
      "@types/react-dom": "latest",
      "@playwright/test": "latest",
    },
  }, null, 2)}\n`;
  const ventureDataTs = [
    `export const venture = ${JSON.stringify(ventureData, null, 2)} as const;`,
    "",
    "export type VentureValidationData = typeof venture;",
  ].join("\n");
  const indexHtml = [
    "<!doctype html>",
    "<html lang=\"en\">",
    "  <head>",
    "    <meta charset=\"UTF-8\" />",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
    `    <title>${venture.title}</title>`,
    "  </head>",
    "  <body>",
    "    <div id=\"root\"></div>",
    "    <script type=\"module\" src=\"/src/main.tsx\"></script>",
    "  </body>",
    "</html>",
  ].join("\n");
  const mainTsx = [
    "import React from \"react\";",
    "import { createRoot } from \"react-dom/client\";",
    "import App from \"./App\";",
    "",
    "createRoot(document.getElementById(\"root\") as HTMLElement).render(",
    "  <React.StrictMode>",
    "    <App />",
    "  </React.StrictMode>,",
    ");",
  ].join("\n");
  const tsconfigJson = `${JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["DOM", "DOM.Iterable", "ES2022"],
      allowJs: false,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
    },
    include: ["src", "tests", "e2e"],
  }, null, 2)}\n`;
  const viteConfigTs = [
    "import react from \"@vitejs/plugin-react\";",
    "import { defineConfig } from \"vite\";",
    "",
    "export default defineConfig({",
    "  plugins: [react()],",
    "});",
  ].join("\n");
  const playwrightConfigTs = [
    "import { defineConfig } from \"@playwright/test\";",
    "",
    "export default defineConfig({",
    "  use: { baseURL: \"http://127.0.0.1:4174\" },",
    "  webServer: {",
    "    command: \"pnpm dev\",",
    "    url: \"http://127.0.0.1:4174\",",
    "    reuseExistingServer: !process.env.CI,",
    "  },",
    "});",
  ].join("\n");
  const approvalBoundariesTs = [
    "export const approvalBoundaries = [",
    "  \"read-only research\",",
    "  \"draft artifact generation\",",
    "  \"local code generation\",",
    "  \"local test execution\",",
    "  \"deployment proposal\",",
    "  \"human-approved deployment\",",
    "  \"human-approved outreach\",",
    "  \"human-approved spend\",",
    "  \"human-approved billing changes\",",
    "] as const;",
    "",
    "export const externalActionsDisabledNotice =",
    "  \"External send, spend, deploy, and billing actions are disabled until a human approves them.\";",
    "",
    "export function canRunExternalAction(approved: boolean) {",
    "  return approved === true;",
    "}",
  ].join("\n");
  const appTsx = [
    "import { approvalBoundaries, externalActionsDisabledNotice } from \"./lib/approval-boundaries\";",
    "import { venture } from \"./lib/venture-data\";",
    "import \"./styles.css\";",
    "",
    "function Metric({ label, value }: { label: string; value: string }) {",
    "  return (",
    "    <div className=\"metric\">",
    "      <span>{label}</span>",
    "      <strong>{value}</strong>",
    "    </div>",
    "  );",
    "}",
    "",
    "export default function App() {",
    "  return (",
    "    <main className=\"shell\">",
    "      <section className=\"hero\">",
    "        <p className=\"eyebrow\">Local validation app</p>",
    "        <h1>{venture.title}</h1>",
    "        <p>{venture.productWedge}</p>",
    "      </section>",
    "      <section className=\"grid\">",
    "        <Metric label=\"Buyer\" value={venture.targetBuyer} />",
    "        <Metric label=\"Channel\" value={venture.firstChannel} />",
    "        <Metric label=\"Pricing\" value={venture.pricingHypothesis} />",
    "      </section>",
    "      <section className=\"panel\">",
    "        <h2>Next experiment</h2>",
    "        <p>{venture.nextExperiment.hypothesis}</p>",
    "        <ul>",
    "          <li>Success: {venture.nextExperiment.successThreshold}</li>",
    "          <li>Failure: {venture.nextExperiment.failureThreshold}</li>",
    "          <li>Metric: {venture.nextExperiment.primaryMetric}</li>",
    "        </ul>",
    "      </section>",
    "      <section className=\"panel danger\">",
    "        <h2>No external side effects</h2>",
    "        <p>{externalActionsDisabledNotice}</p>",
    "        <ul>{approvalBoundaries.map((boundary) => <li key={boundary}>{boundary}</li>)}</ul>",
    "      </section>",
    "    </main>",
    "  );",
    "}",
  ].join("\n");
  const stylesCss = [
    ":root { color: #10201b; background: #f5faf8; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }",
    "body { margin: 0; }",
    ".shell { max-width: 1040px; margin: 0 auto; padding: 32px 20px 56px; }",
    ".hero { border-bottom: 1px solid #c7dfd8; padding-bottom: 20px; }",
    ".eyebrow { color: #0f766e; font-size: 12px; font-weight: 700; text-transform: uppercase; }",
    "h1 { margin: 0; font-size: clamp(32px, 6vw, 56px); line-height: 1; }",
    ".grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 20px 0; }",
    ".metric, .panel { border: 1px solid #c7dfd8; border-radius: 8px; background: white; padding: 16px; }",
    ".metric span { display: block; color: #64748b; font-size: 12px; }",
    ".metric strong { display: block; margin-top: 6px; }",
    ".danger { border-color: #fda4af; background: #fff1f2; }",
  ].join("\n");
  const validationTest = [
    "import { describe, expect, it } from \"vitest\";",
    "import { externalActionsDisabledNotice } from \"../src/lib/approval-boundaries\";",
    "import { venture } from \"../src/lib/venture-data\";",
    "",
    "describe(\"venture validation scaffold\", () => {",
    "  it(\"keeps the app tied to a real buyer and no-side-effect boundary\", () => {",
    "    expect(venture.targetBuyer.length).toBeGreaterThan(0);",
    "    expect(venture.nextExperiment.successThreshold.length).toBeGreaterThan(0);",
    "    expect(externalActionsDisabledNotice).toContain(\"disabled\");",
    "  });",
    "});",
  ].join("\n");
  const viteEnvDts = [
    "/// <reference types=\"vite/client\" />",
    "",
  ].join("\n");
  const browserSmoke = [
    "import { expect, test } from \"@playwright/test\";",
    "",
    "test(\"venture scaffold keeps external actions blocked\", async ({ page }) => {",
    "  await page.goto(\"/\");",
    `  await expect(page.getByRole("heading", { name: ${JSON.stringify(venture.title)} })).toBeVisible();`,
    "  await expect(page.getByText(\"No external side effects\")).toBeVisible();",
    "  await expect(page.getByText(/disabled until a human approves/)).toBeVisible();",
    "});",
  ].join("\n");

  return [
    sourceFile("package.json", "Package manifest with local verification scripts", "json", packageJson),
    sourceFile("index.html", "Vite HTML entrypoint", "html", indexHtml),
    sourceFile("vite.config.ts", "Vite React configuration", "ts", viteConfigTs),
    sourceFile("tsconfig.json", "Strict TypeScript configuration", "json", tsconfigJson),
    sourceFile("playwright.config.ts", "Generated-app browser smoke configuration", "ts", playwrightConfigTs),
    sourceFile("src/main.tsx", "React root entrypoint", "tsx", mainTsx),
    sourceFile("src/App.tsx", "Approval-aware route shell and validation cockpit", "tsx", appTsx),
    sourceFile("src/vite-env.d.ts", "Vite client and CSS module declarations", "ts", viteEnvDts),
    sourceFile("src/lib/venture-data.ts", "Typed venture data seed from source-backed workspace", "ts", ventureDataTs),
    sourceFile("src/lib/approval-boundaries.ts", "No-send, no-spend, no-deploy, and no-billing gates", "ts", approvalBoundariesTs),
    sourceFile("src/styles.css", "Responsive local validation styling", "css", stylesCss),
    sourceFile("tests/venture-validation.test.ts", "Smoke test for buyer data and external-action boundary", "ts", validationTest),
    sourceFile("e2e/venture-flow.spec.ts", "Browser smoke for generated app no-side-effect boundary", "ts", browserSmoke),
  ];
}

function generatedAppSourceScaffoldMarkdown(scaffold: Omit<VentureGeneratedAppSourceScaffold, "markdown">) {
  return [
    `# Generated App Source Scaffold: ${scaffold.title}`,
    `Status: ${scaffold.status}`,
    `App: ${scaffold.appName}`,
    `Local target: ${scaffold.localTargetPath}`,
    `Boundary: ${scaffold.sourceBoundary}`,
    `Materialization: ${scaffold.materializationInstruction}`,
    `Runnable proof: ${scaffold.runnableProofStatus}`,
    "",
    "## Source Files",
    ...scaffold.sourceFiles.map((file) => `- ${file.path}: ${file.role} (${file.language}, ${file.contentSignature})`),
    "",
    "## Verification Commands",
    ...scaffold.verificationCommands.map((command) => `- ${command}`),
    "",
    "## Proof Capture Checklist",
    ...scaffold.proofCaptureChecklist.map((item) => `- [ ] ${item}`),
    "",
    "## No-Fake-Source Safeguards",
    ...scaffold.noFakeSourceSafeguards.map((safeguard) => `- ${safeguard}`),
  ].join("\n");
}

export function buildVentureGeneratedAppSourceScaffold(venture: SavedVentureWorkspace): VentureGeneratedAppSourceScaffold {
  const latestMvp = venture.mvpBuildWorkspaces[0];
  const repoAttached = latestMvp ? hasAttachedMvpRepo(latestMvp.repoPath) : false;
  const executable = latestMvp?.status === "executable" && countPassedMvpChecks(latestMvp) >= 5;
  const status: VentureGeneratedAppSourceScaffoldStatus = executable
    ? "verified-executable"
    : repoAttached
      ? "repo-attached"
      : latestMvp
        ? "ready-to-materialize"
        : "draft-only";
  const appName = appSlug(venture.title);
  const localTargetPath = latestMvp && repoAttached ? latestMvp.repoPath : `./generated-apps/${appName}`;
  const sourceFiles = buildGeneratedAppSourceFiles(venture, appName);
  const verificationCommands = [
    "pnpm install",
    "pnpm type-check",
    "pnpm test",
    "pnpm build",
    "pnpm browser-smoke",
  ];
  const sourceBoundary = repoAttached
    ? "A repo path is attached; keep treating this source scaffold as untrusted until all local checks pass."
    : "Source files live inside this artifact/export only; the browser has not written a repo to disk.";
  const runnableProofStatus = executable
    ? "Executable proof is attached through the latest MVP workspace and passed verification checks."
    : "Not executable yet: materialize the source files locally, run verification, and attach the repo path before claiming a working app.";
  const scaffoldWithoutMarkdown: Omit<VentureGeneratedAppSourceScaffold, "markdown"> = {
    id: `${venture.id}-generated-app-source-scaffold`,
    ventureId: venture.id,
    title: venture.title,
    status,
    appName,
    localTargetPath,
    sourceBoundary,
    materializationInstruction: `Export this portfolio JSON, run pnpm generated-app:materialize -- --input <portfolio.json> --venture-id ${venture.id} --target ${localTargetPath} for a dry run, then run pnpm generated-app:verify -- --input <portfolio.json> --venture-id ${venture.id} --target ${localTargetPath} --report-out <verifier-report.json> when ready for full child-app proof.`,
    runnableProofStatus,
    sourceFiles,
    noFakeSourceSafeguards: [
      "Run pnpm generated-app:materialize in dry-run mode first; it verifies source file signatures and refuses path traversal.",
      "Do not mark the app executable until an attached repo path exists and setup, typecheck, tests, build, and browser smoke are passed.",
      "Do not treat embedded source text as a deployed product; it is a local-only source scaffold until materialized.",
      "Keep VITE_EXTERNAL_ACTIONS_ENABLED=false unless a human approves deployment, outreach, spend, or billing side effects.",
      "Exported files include content signatures so reviewers can notice scaffold drift before verification.",
    ],
    verificationCommands,
    proofCaptureChecklist: [
      "Run the parent materializer in dry-run mode and keep the output with the venture record.",
      "Run the materializer with --write into the local target path.",
      "Run pnpm generated-app:verify with --report-out to materialize, verify, and save the child-app proof report.",
      "Run pnpm install inside the generated app target.",
      "Run pnpm type-check, pnpm test, pnpm build, and pnpm browser-smoke inside the generated app target.",
      "Attach the target path and command results as an MVP build workspace before marking executable.",
    ],
  };

  return {
    ...scaffoldWithoutMarkdown,
    markdown: generatedAppSourceScaffoldMarkdown(scaffoldWithoutMarkdown),
  };
}

function generatedAppVerificationProofMarkdown(proof: Omit<VentureGeneratedAppVerificationProof, "markdown">) {
  return [
    `# Generated App Verification Proof: ${proof.title}`,
    `Status: ${proof.status}`,
    `App: ${proof.appName}`,
    `Target: ${proof.targetPath}`,
    `Checks: ${proof.passedCheckCount}/${proof.requiredCheckCount} passed`,
    `Summary: ${proof.proofSummary}`,
    "",
    "## Commands",
    `- Materializer: ${proof.materializerCommand}`,
    `- Verifier: ${proof.verifierCommand}`,
    "",
    "## Check Evidence",
    ...proof.checks.map((check) => `- ${check.label}: ${check.status} (${check.command}) - ${check.evidence}`),
    "",
    "## Missing Proof",
    ...proof.missingProof.map((item) => `- ${item}`),
    "",
    "## Next Actions",
    ...proof.nextActions.map((item) => `- ${item}`),
  ].join("\n");
}

export function buildVentureGeneratedAppVerificationProof(venture: SavedVentureWorkspace): VentureGeneratedAppVerificationProof {
  const sourceScaffold = buildVentureGeneratedAppSourceScaffold(venture);
  const latestMvp = venture.mvpBuildWorkspaces[0];
  const repoAttached = latestMvp ? hasAttachedMvpRepo(latestMvp.repoPath) : false;
  const targetPath = repoAttached ? latestMvp.repoPath : sourceScaffold.localTargetPath;
  const materializerCommand = `pnpm generated-app:materialize -- --input <portfolio.json> --venture-id ${venture.id} --target ${targetPath}`;
  const verifierCommand = `pnpm generated-app:verify -- --input <portfolio.json> --venture-id ${venture.id} --target ${targetPath} --report-out <verifier-report.json>`;
  const checks: VentureGeneratedAppVerificationCheck[] = [
    {
      label: "Materialized source path",
      command: `${materializerCommand} --write`,
      status: repoAttached ? "passed" : "pending",
      evidence: repoAttached ? `Attached repo path: ${latestMvp.repoPath}` : "No materialized repo path has been attached yet.",
    },
    {
      label: "Install/setup",
      command: latestMvp?.setupCommand ?? "pnpm install",
      status: latestMvp?.setupCheck ?? "pending",
      evidence: latestMvp?.verificationNotes ?? "No setup proof recorded.",
    },
    {
      label: "Typecheck",
      command: latestMvp?.typecheckCommand ?? "pnpm type-check",
      status: latestMvp?.typecheckCheck ?? "pending",
      evidence: latestMvp?.verificationNotes ?? "No typecheck proof recorded.",
    },
    {
      label: "Unit tests",
      command: latestMvp?.testCommand ?? "pnpm test",
      status: latestMvp?.unitTestCheck ?? "pending",
      evidence: latestMvp?.verificationNotes ?? "No unit-test proof recorded.",
    },
    {
      label: "Production build",
      command: latestMvp?.buildCommand ?? "pnpm build",
      status: latestMvp?.buildCheck ?? "pending",
      evidence: latestMvp?.verificationNotes ?? "No build proof recorded.",
    },
    {
      label: "Browser smoke",
      command: latestMvp?.browserSmokeCommand ?? "pnpm browser-smoke",
      status: latestMvp?.browserSmokeCheck ?? "pending",
      evidence: latestMvp?.verificationNotes ?? "No browser-smoke proof recorded.",
    },
  ];
  const passedCheckCount = checks.filter((check) => check.status === "passed").length;
  const failedOrBlocked = checks.some((check) => check.status === "failed" || check.status === "blocked") || latestMvp?.status === "blocked";
  const requiredCheckCount = checks.length;
  const allProofPassed = repoAttached && passedCheckCount === requiredCheckCount;
  const status: VentureGeneratedAppVerificationProofStatus = allProofPassed
    ? "verified"
    : failedOrBlocked
      ? "blocked"
      : passedCheckCount > 0
        ? "partial-proof"
        : "not-materialized";
  const missingProof = checks
    .filter((check) => check.status !== "passed")
    .map((check) => `${check.label} proof missing or not passed.`);
  const nextActions = allProofPassed
    ? ["Keep the verification report attached before any deployment approval."]
    : [
        "Export the portfolio JSON and run the generated-app materializer dry run.",
        "Run the generated-app verifier against a local target path.",
        "Attach the repo path and command results as an MVP build workspace.",
      ];
  const proofSummary = allProofPassed
    ? "Generated app has a materialized source path and all local executable proof checks passed."
    : repoAttached
      ? `${passedCheckCount}/${requiredCheckCount} generated-app proof checks passed for the attached source path.`
      : "Generated app source exists as an exportable scaffold, but no materialized repo path proof is attached yet.";
  const proofWithoutMarkdown: Omit<VentureGeneratedAppVerificationProof, "markdown"> = {
    id: `${venture.id}-generated-app-verification-proof`,
    ventureId: venture.id,
    title: venture.title,
    status,
    appName: sourceScaffold.appName,
    targetPath,
    proofSummary,
    passedCheckCount,
    requiredCheckCount,
    materializerCommand,
    verifierCommand,
    checks,
    missingProof: missingProof.length > 0 ? missingProof : ["All generated app executable proof checks are attached."],
    nextActions,
  };

  return {
    ...proofWithoutMarkdown,
    markdown: generatedAppVerificationProofMarkdown(proofWithoutMarkdown),
  };
}

export function buildVentureGeneratedAppHandoff(venture: SavedVentureWorkspace): VentureGeneratedAppHandoff {
  const latestMvp = venture.mvpBuildWorkspaces[0];
  const repoAttached = latestMvp ? hasAttachedMvpRepo(latestMvp.repoPath) : false;
  const executable = latestMvp?.status === "executable" && countPassedMvpChecks(latestMvp) >= 5;
  const status: VentureGeneratedAppHandoffStatus = executable
    ? "executable"
    : repoAttached
      ? "repo-attached"
      : latestMvp
        ? "brief-ready"
        : "source-pending";
  const appName = appSlug(venture.title);
  const routePlan = [
    `/: explain ${venture.productWedge} to ${venture.targetBuyer} and collect consent-safe interest.`,
    "/dashboard: operator view for demand, activation, retention, support, and finance signals.",
    "/experiments: run and record waitlist, pricing, concierge, and retention experiments.",
    "/evidence: inspect source provenance, claims, contradictions, and approval boundaries.",
    "/settings: configure no-send outreach, deployment approval, analytics, and billing gates.",
  ];
  const fileManifest = [
    "package.json: scripts for install, typecheck, test, build, and browser smoke.",
    "src/App.tsx: route shell with approval-aware navigation.",
    "src/routes/Landing.tsx: buyer-facing validation surface.",
    "src/routes/OperatorDashboard.tsx: venture metrics and evidence review.",
    "src/routes/Experiments.tsx: experiment setup, result capture, and kill/scale interpretation.",
    "src/lib/venture-data.ts: typed local data model and import/export helpers.",
    "src/lib/approval-boundaries.ts: no-send/no-spend/no-deploy gate helpers.",
    "tests/venture-flow.test.ts: source-backed smoke coverage for the core loop.",
  ];
  const dataModel = Array.from(new Set([
    ...venture.mvpHandoff.dataModel,
    "VentureLead: persona, channel, consentState, sourceEvidenceId",
    "ExperimentResult: hypothesis, metric, result, interpretation, nextAction",
    "ActivationCohort: signups, activated, retained, paid, revenue, supportLoad",
    "ApprovalGate: level, actor, sideEffect, replayNote, externalActionState",
  ]));
  const verificationCommands = generatedAppVerificationCommands(latestMvp);
  const sourceScaffold = buildVentureGeneratedAppSourceScaffold(venture);
  const qaChecklist = [
    "Prove every route renders from source-backed data or an honest empty state.",
    "Verify no-send, no-spend, no-billing, and no-deploy boundaries are visible before external actions.",
    "Run typecheck, unit tests, build, and browser smoke against the attached repo before marking executable.",
    "Link generated source, test report, browser smoke, deployment proof, and changelog artifacts.",
    "Record experiment analytics before interpreting demand or scaling acquisition.",
  ];
  const generationBoundary = repoAttached
    ? "Generated source has been attached as a local/reviewable repo path; verify before treating it as executable."
    : "No generated app source has been attached; this is a local-only handoff manifest, not a created app.";
  const appWithoutMarkdown: Omit<VentureGeneratedAppHandoff, "markdown"> = {
    id: `${venture.id}-generated-app-handoff`,
    ventureId: venture.id,
    title: venture.title,
    status,
    appName,
    repoPath: latestMvp?.repoPath ?? VENTURE_NO_MVP_SOURCE_ATTACHED,
    sourceCodeStatus: latestMvp?.sourceCodeStatus ?? venture.mvpHandoff.sourceCodeStatus,
    generationBoundary,
    routePlan,
    fileManifest,
    dataModel,
    envVars: [
      "VITE_MARKETPULSE_OWNER_KEY: owner-scoped local portfolio key.",
      "VITE_ANALYTICS_WRITE_KEY: optional analytics key; keep empty in local validation.",
      "VITE_EXTERNAL_ACTIONS_ENABLED=false: default no-send/no-spend/no-deploy boundary.",
    ],
    verificationCommands,
    qaChecklist,
    sourceScaffold,
    deploymentBoundary: latestMvp?.deploymentCommand ?? venture.mvpHandoff.deploymentPath,
    owner: latestMvp?.owner ?? "unassigned-builder",
  };

  return {
    ...appWithoutMarkdown,
    markdown: generatedAppMarkdown(appWithoutMarkdown),
  };
}

function killDecisionMarkdown(decision: Omit<VentureKillDecisionArtifact, "markdown">) {
  return [
    `# Kill Decision Artifact: ${decision.title}`,
    `Recommendation: ${decision.recommendation}`,
    `Severity: ${decision.severity}`,
    `Confidence: ${decision.confidenceScore}/100`,
    `Latest recorded decision: ${decision.latestRecordedDecision}`,
    `Primary reason: ${decision.primaryReason}`,
    "",
    "## Evidence For Stopping",
    ...decision.evidenceForStopping.map((item) => `- ${item}`),
    "",
    "## Evidence For Continuing",
    ...decision.evidenceForContinuing.map((item) => `- ${item}`),
    "",
    "## Stop Rules",
    ...decision.stopRules.map((item) => `- ${item}`),
    "",
    "## Pivot Triggers",
    ...decision.pivotTriggers.map((item) => `- ${item}`),
    "",
    "## Scale Prerequisites",
    ...decision.scalePrerequisites.map((item) => `- ${item}`),
    "",
    "## Revival Triggers",
    ...decision.revivalTriggers.map((item) => `- ${item}`),
    "",
    "## Next Actions",
    ...decision.nextActions.map((item) => `- ${item}`),
  ].join("\n");
}

export function buildVentureKillDecisionArtifact(venture: SavedVentureWorkspace): VentureKillDecisionArtifact {
  const report = buildVentureKillPressureReport(venture);
  const latestDecision = venture.decisionHistory[0];
  const failedExperiments = venture.experiments.filter((experiment) => /fail|miss|below|not urgent|reject/i.test(`${experiment.result} ${experiment.interpretation}`));
  const passedExperiments = venture.experiments.filter((experiment) => /pass|qualified|above|retained|paid/i.test(`${experiment.result} ${experiment.interpretation}`));
  const paidSignals = venture.pricingSignals.filter((signal) => signal.paidCommitmentCount + signal.invoiceRequestCount > 0);
  const retainedCohorts = venture.activationCohorts.filter((cohort) => cohort.retainedCount > 0 || cohort.paidCount > 0);
  const stopSignals = report.signals.filter((signal) => signal.recommendation === "kill" || signal.recommendation === "pause");
  const continueSignals = report.signals.filter((signal) => signal.recommendation === "continue" || signal.recommendation === "scale");
  const confidenceScore = clampScore(
    35 +
    report.signals.length * 7 +
    (report.severity === "critical" ? 18 : report.severity === "high" ? 12 : report.severity === "medium" ? 6 : 0) +
    (latestDecision?.decision === report.recommendation ? 12 : 0) +
    failedExperiments.length * 5 +
    passedExperiments.length * 5,
  );
  const evidenceForStopping = Array.from(new Set([
    ...stopSignals.map((signal) => `${signal.title}: ${signal.evidence}`),
    ...venture.killCriteria.killReasons,
    ...failedExperiments.map((experiment) => `${experiment.type}: ${experiment.result}`),
    ...venture.riskRecords.filter((risk) => risk.status !== "resolved" && (risk.severity === "high" || risk.severity === "critical")).map((risk) => `${risk.severity} risk: ${risk.title}`),
  ])).filter(Boolean).slice(0, 8);
  const evidenceForContinuing = Array.from(new Set([
    ...continueSignals.map((signal) => `${signal.title}: ${signal.evidence}`),
    ...passedExperiments.map((experiment) => `${experiment.type}: ${experiment.result}`),
    ...paidSignals.map((signal) => `${signal.paidCommitmentCount + signal.invoiceRequestCount} paid pricing signal${signal.paidCommitmentCount + signal.invoiceRequestCount === 1 ? "" : "s"} at ${signal.acceptedPrice}`),
    ...retainedCohorts.map((cohort) => `${cohort.cohortLabel}: ${cohort.retainedCount} retained, ${cohort.paidCount} paid`),
  ])).filter(Boolean).slice(0, 8);
  const revivalTriggers = [
    paidSignals.length > 0 ? "Paid pricing evidence can revive a killed idea only if retention and delivery risk improve." : "",
    passedExperiments.length > 0 ? "A fresh passed experiment can reopen the decision if it contradicts the original stop reason." : "",
    venture.riskRecords.some((risk) => risk.status === "resolved") ? "Resolved high-risk evidence can justify a revival review." : "",
    "Do not revive on enthusiasm alone; require a new measured signal tied to the failed assumption.",
  ].filter(Boolean);
  const decisionWithoutMarkdown: Omit<VentureKillDecisionArtifact, "markdown"> = {
    id: `${venture.id}-kill-decision-artifact`,
    ventureId: venture.id,
    title: venture.title,
    recommendation: report.recommendation,
    severity: report.severity,
    confidenceScore,
    latestRecordedDecision: latestDecision
      ? `${latestDecision.decision}: ${latestDecision.rationale}`
      : "No human-recorded decision yet.",
    primaryReason: report.signals[0]?.title ?? report.note,
    evidenceForStopping: evidenceForStopping.length > 0 ? evidenceForStopping : ["No explicit stop evidence recorded beyond the current kill criteria."],
    evidenceForContinuing: evidenceForContinuing.length > 0 ? evidenceForContinuing : ["No strong continue evidence recorded yet."],
    stopRules: venture.killCriteria.stopTriggers,
    pivotTriggers: venture.killCriteria.pivotTriggers,
    scalePrerequisites: [
      "Demand passes against the declared success threshold.",
      "Willingness-to-pay evidence is validated.",
      "Retention and support burden are measured.",
      "Channel payback is not negative.",
      "Deployment, billing, spend, and outreach gates remain human-approved.",
    ],
    revivalTriggers,
    nextActions: [
      report.signals[0]?.nextAction ?? "Record the next disconfirming or confirming evidence point.",
      latestDecision ? "Compare the artifact recommendation to the latest recorded human decision." : "Record a human decision with rationale and next action.",
      report.recommendation === "kill" ? "Archive build/spend/outreach plans unless a revival trigger is met." : "Run the next evidence step before increasing scope.",
    ],
  };

  return {
    ...decisionWithoutMarkdown,
    markdown: killDecisionMarkdown(decisionWithoutMarkdown),
  };
}

function revenueGenerationMarkdown(posture: Omit<VentureRevenueGenerationPosture, "markdown">) {
  return [
    `# Revenue Generation Posture: ${posture.title}`,
    `Status: ${posture.status}`,
    `Capture score: ${posture.captureScore}/100`,
    `Payback: ${posture.paybackStatus}`,
    `Pricing calibration: ${posture.pricingCalibrationStatus}`,
    `Primary revenue source: ${posture.primaryRevenueSource}`,
    "",
    "## Summary",
    posture.summary,
    "",
    "## Recorded Revenue Evidence",
    `- Received revenue: ${formatCents(posture.receivedRevenueCents)}`,
    `- Committed revenue: ${formatCents(posture.committedRevenueCents)}`,
    `- Cohort revenue: ${formatCents(posture.cohortRevenueCents)}`,
    `- Channel revenue: ${formatCents(posture.channelRevenueCents)}`,
    `- Total evidence revenue: ${formatCents(posture.totalEvidenceRevenueCents)}`,
    `- Paid pricing signals: ${posture.paidPricingSignalCount} (commitments ${posture.paidCommitmentCount}, invoice requests ${posture.invoiceRequestCount})`,
    `- Paid activation cohorts: ${posture.paidActivationCohortCount} (${posture.paidCohortUserCount} paid user${posture.paidCohortUserCount === 1 ? "" : "s"})`,
    `- Paid-back channels: ${posture.paidBackChannelCount}; coverage ${formatCents(posture.channelPaybackCoverageCents)} against ${formatCents(posture.acquisitionSpendCents)} spend`,
    "",
    "## Evidence",
    ...(posture.evidence.length > 0 ? posture.evidence.map((item) => `- ${item}`) : ["- No revenue evidence recorded yet."]),
    "",
    "## Gaps",
    ...(posture.gaps.length > 0 ? posture.gaps.map((item) => `- ${item}`) : ["- No revenue evidence gap detected."]),
    "",
    "## Next Action",
    posture.nextAction,
  ].join("\n");
}

export function buildVentureRevenueGenerationPosture(venture: SavedVentureWorkspace): VentureRevenueGenerationPosture {
  const pricingCalibration = calibrateVenturePricing(venture);
  const receivedRevenueCents = venture.moneySignals
    .filter((signal) => (signal.type === "revenue" || signal.type === "grant" || signal.type === "credit") && signal.status === "received")
    .reduce((sum, signal) => sum + signal.amountCents, 0);
  const committedRevenueCents = venture.moneySignals
    .filter((signal) => (signal.type === "commitment" && (signal.status === "committed" || signal.status === "received")) || (signal.type === "revenue" && signal.status === "committed"))
    .reduce((sum, signal) => sum + signal.amountCents, 0);
  const blockedMoneySignalCount = venture.moneySignals.filter((signal) => signal.status === "blocked").length;
  const cohortRevenueCents = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.revenueCents, 0);
  const channelRevenueCents = venture.channelEconomics.reduce((sum, economics) => sum + economics.revenueCents, 0);
  const acquisitionSpendCents = venture.channelEconomics.reduce((sum, economics) => sum + economics.spendCents, 0);
  const totalEvidenceRevenueCents = receivedRevenueCents + cohortRevenueCents + channelRevenueCents;
  const paidActivationCohorts = venture.activationCohorts.filter((cohort) => cohort.paidCount > 0 || cohort.revenueCents > 0);
  const paidCohortUserCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.paidCount, 0);
  const paidBackChannels = venture.channelEconomics.filter((economics) => economics.paybackStatus === "paid-back");
  const channelPaybackCoverageCents = channelRevenueCents - acquisitionSpendCents;
  const paybackStatus = strongestPaybackStatus(
    venture.channelEconomics.map((economics) => economics.paybackStatus),
    paybackStatusFor(acquisitionSpendCents, channelRevenueCents + cohortRevenueCents),
  );
  const paidCommitmentCount = venture.pricingSignals.reduce((sum, signal) => sum + signal.paidCommitmentCount, 0);
  const invoiceRequestCount = venture.pricingSignals.reduce((sum, signal) => sum + signal.invoiceRequestCount, 0);
  const paidPricingSignalCount = pricingCalibration.paidSignalCount;
  const captureScore = clampScore(
    20 +
    Math.min(20, receivedRevenueCents / 1000) +
    Math.min(12, committedRevenueCents / 1000) +
    Math.min(14, cohortRevenueCents / 1000) +
    Math.min(14, channelRevenueCents / 1000) +
    (paidPricingSignalCount > 0 ? 10 : -6) +
    (paidActivationCohorts.length > 0 ? 8 : -4) +
    (paidBackChannels.length > 0 ? 12 : paybackStatus === "partial-payback" ? 4 : paybackStatus === "no-payback" ? -14 : -4) +
    (paidCohortUserCount > 0 ? 6 : -4) -
    blockedMoneySignalCount * 14,
  );
  const primaryRevenueSource = receivedRevenueCents > 0
    ? `${formatCents(receivedRevenueCents)} received revenue from money signals`
    : channelRevenueCents > 0
      ? `${formatCents(channelRevenueCents)} channel revenue from ${paidBackChannels.length > 0 ? "paid-back" : "active"} channels`
      : cohortRevenueCents > 0
        ? `${formatCents(cohortRevenueCents)} cohort revenue from ${paidActivationCohorts.length} paid activation cohort${paidActivationCohorts.length === 1 ? "" : "s"}`
        : committedRevenueCents > 0
          ? `${formatCents(committedRevenueCents)} committed revenue from money commitments`
          : paidPricingSignalCount > 0
            ? `${paidPricingSignalCount} paid pricing signal${paidPricingSignalCount === 1 ? "" : "s"} (no recorded payment yet)`
            : "No recorded revenue source.";
  const evidence: string[] = [];
  if (receivedRevenueCents > 0) {
    evidence.push(`${formatCents(receivedRevenueCents)} received revenue across ${venture.moneySignals.filter((signal) => signal.status === "received" && (signal.type === "revenue" || signal.type === "grant" || signal.type === "credit")).length} money signal${receivedRevenueCents === 0 ? "" : "s"}.`);
  }
  if (committedRevenueCents > 0) {
    evidence.push(`${formatCents(committedRevenueCents)} committed revenue (commitments or revenue-status committed money signals).`);
  }
  if (cohortRevenueCents > 0) {
    evidence.push(`${formatCents(cohortRevenueCents)} cohort revenue across ${paidActivationCohorts.length} paid activation cohort${paidActivationCohorts.length === 1 ? "" : "s"}; ${paidCohortUserCount} paid user${paidCohortUserCount === 1 ? "" : "s"}.`);
  }
  if (channelRevenueCents > 0) {
    evidence.push(`${formatCents(channelRevenueCents)} channel revenue across ${venture.channelEconomics.length} channel record${venture.channelEconomics.length === 1 ? "" : "s"}; ${paidBackChannels.length} paid back.`);
  }
  if (paidPricingSignalCount > 0) {
    evidence.push(`${paidPricingSignalCount} paid pricing signal${paidPricingSignalCount === 1 ? "" : "s"} at ${pricingCalibration.strongestAcceptedPrice || "an unrecorded price"}; ${paidCommitmentCount} commitment${paidCommitmentCount === 1 ? "" : "s"} and ${invoiceRequestCount} invoice request${invoiceRequestCount === 1 ? "" : "s"}.`);
  }
  const gaps: string[] = [];
  if (totalEvidenceRevenueCents <= 0 && committedRevenueCents <= 0) {
    gaps.push("No received, committed, cohort, or channel revenue recorded yet.");
  }
  if (paidPricingSignalCount === 0) {
    gaps.push("No paid pricing signal captured; willingness-to-pay is not commitment-backed.");
  }
  if (paidActivationCohorts.length === 0) {
    gaps.push("No activation cohort records paid users tied to retained activation.");
  }
  if (paidBackChannels.length === 0 && acquisitionSpendCents > 0 && paybackStatus !== "paid-back") {
    gaps.push(`Acquisition spend of ${formatCents(acquisitionSpendCents)} has not been paid back by recorded channel revenue.`);
  }
  if (blockedMoneySignalCount > 0) {
    gaps.push(`${blockedMoneySignalCount} money signal${blockedMoneySignalCount === 1 ? "" : "s"} blocked before external action; cannot count toward revenue evidence.`);
  }
  if (pricingCalibration.status === "rejected") {
    gaps.push("Pricing calibration is rejected; recorded objections outweigh paid intent.");
  }
  const status: VentureRevenueGenerationStatus = blockedMoneySignalCount > 0
    ? "blocked"
    : totalEvidenceRevenueCents <= 0 && committedRevenueCents <= 0 && paidPricingSignalCount === 0
      ? "no-evidence"
      : paidBackChannels.length > 0 && paidActivationCohorts.length > 0 && (receivedRevenueCents > 0 || cohortRevenueCents > 0) && captureScore >= 72
        ? "scaling-revenue"
        : ((receivedRevenueCents > 0 || cohortRevenueCents > 0) && paidActivationCohorts.length > 0) || (channelRevenueCents > 0 && paidBackChannels.length > 0)
          ? "repeatable-revenue"
          : "paid-validation";
  const nextAction = blockedMoneySignalCount > 0
    ? "Unblock or escalate the blocked money signals before treating any revenue claim as evidence."
    : status === "no-evidence"
      ? "Record the first paid pricing signal, paid activation cohort, or received money signal before claiming revenue."
      : status === "paid-validation"
        ? "Attach paid intent to a retained activation cohort and a measured channel before declaring repeatable revenue."
        : status === "repeatable-revenue"
          ? "Run one more measured cohort with paid retention before scaling spend; require channel payback to hold."
          : "Prepare a human-approved scaling budget with explicit payback stop rules and revenue evidence per cohort.";
  const summary = status === "no-evidence"
    ? "No evidence-backed revenue has been captured yet from money signals, paid pricing signals, cohorts, or channels."
    : status === "blocked"
      ? `Revenue capture is blocked: ${blockedMoneySignalCount} money signal${blockedMoneySignalCount === 1 ? "" : "s"} are halted before external action.`
      : status === "paid-validation"
        ? `${primaryRevenueSource} validates willingness to pay; revenue is not yet repeatable across a cohort and channel.`
        : status === "repeatable-revenue"
          ? `${primaryRevenueSource} repeats across paid activation and channel records; payback is ${paybackStatus}.`
          : `${primaryRevenueSource} scales: paid-back channel, paid cohort, and recorded revenue all confirm capture.`;

  const postureWithoutMarkdown: Omit<VentureRevenueGenerationPosture, "markdown"> = {
    id: `${venture.id}-revenue-generation-posture`,
    ventureId: venture.id,
    title: venture.title,
    status,
    captureScore,
    receivedRevenueCents,
    committedRevenueCents,
    cohortRevenueCents,
    channelRevenueCents,
    totalEvidenceRevenueCents,
    paidPricingSignalCount,
    paidCommitmentCount,
    invoiceRequestCount,
    paidActivationCohortCount: paidActivationCohorts.length,
    paidCohortUserCount,
    paidBackChannelCount: paidBackChannels.length,
    channelPaybackCoverageCents,
    acquisitionSpendCents,
    paybackStatus,
    pricingCalibrationStatus: pricingCalibration.status,
    primaryRevenueSource,
    summary,
    evidence,
    gaps,
    nextAction,
  };

  return {
    ...postureWithoutMarkdown,
    markdown: revenueGenerationMarkdown(postureWithoutMarkdown),
  };
}

function scaleStrongBranchMarkdown(plan: Omit<VentureScaleStrongBranchPlan, "markdown">): string {
  return [
    `# Scale Strong Branch Plan: ${plan.title}`,
    `Status: ${plan.status}`,
    `Scale score: ${plan.scaleScore}/100`,
    `Revenue status: ${plan.revenueStatus}`,
    `Finance status: ${plan.financeStatus}`,
    `Kill-pressure recommendation: ${plan.killPressureRecommendation}`,
    `Paid-back channels: ${plan.paidBackChannelCount}`,
    `Support status: ${plan.supportStatus}`,
    `Human-approved spend ceiling: ${formatCents(plan.humanApprovedSpendCeilingCents)}`,
    "",
    "## Summary",
    plan.summary,
    "",
    "## Evidence",
    ...(plan.evidence.length > 0 ? plan.evidence.map((item) => `- ${item}`) : ["- No scale evidence recorded yet."]),
    "",
    "## Blockers",
    ...(plan.blockers.length > 0 ? plan.blockers.map((item) => `- ${item}`) : ["- No blocker detected for the current scale plan."]),
    "",
    "## Stop Rules",
    ...plan.stopRules.map((rule) => `- ${rule}`),
    "",
    "## Next Action",
    plan.nextAction,
    "",
    "## Human Review Only",
    "This plan is an internal scale recommendation. It does NOT spend money, contact customers, deploy, or change billing automatically.",
  ].join("\n");
}

export function buildVentureScaleStrongBranchPlan(venture: SavedVentureWorkspace): VentureScaleStrongBranchPlan {
  const revenuePosture = buildVentureRevenueGenerationPosture(venture);
  const financialModel = buildVentureFinancialModel(venture);
  const killPressureReport = buildVentureKillPressureReport(venture);
  const paidBackChannelCount = venture.channelEconomics.filter((economics) => economics.paybackStatus === "paid-back").length;
  const openSupportIssues = venture.supportIssues.filter((issue) => (
    issue.status === "open" ||
    issue.status === "triaged" ||
    issue.status === "in-progress"
  ));
  const highSupportIssueCount = openSupportIssues.filter((issue) => issue.severity === "high" || issue.severity === "critical").length;
  const resolvedSupportIssueCount = venture.supportIssues.filter((issue) => issue.status === "resolved").length;
  const supportStatus: VentureScaleStrongBranchSupportStatus = highSupportIssueCount > 0
    ? "support-blocked"
    : openSupportIssues.length > 0
      ? "support-monitor"
      : "support-light";
  const humanApprovedSpendAudits = venture.autonomyAudit.filter((audit) => (
    audit.approvalLevel === "human-approved-spend" &&
    (audit.status === "approved" || audit.status === "executed")
  ));
  const spendCeilingSignals = venture.moneySignals.filter((signal) => (
    signal.type === "expense" &&
    signal.status !== "blocked" &&
    (signal.approvalLevel ?? moneyApprovalLevelFor(signal.type)) === "human-approved-spend"
  ));
  const humanApprovedSpendCeilingCents = humanApprovedSpendAudits.length > 0
    ? spendCeilingSignals.reduce((max, signal) => Math.max(max, signal.amountCents), 0)
    : 0;
  const scaleScore = clampScore(
    18 +
    (revenuePosture.status === "scaling-revenue" ? 28 : revenuePosture.status === "repeatable-revenue" ? 16 : revenuePosture.status === "paid-validation" ? 6 : -14) +
    (financialModel.status === "scale-ready" ? 18 : financialModel.status === "needs-proof" ? 6 : -12) +
    Math.min(16, paidBackChannelCount * 8) +
    (supportStatus === "support-light" ? 12 : supportStatus === "support-monitor" ? 4 : -18) +
    (humanApprovedSpendCeilingCents > 0 ? 12 : -8) +
    (killPressureReport.recommendation === "scale" ? 8 : killPressureReport.recommendation === "continue" ? 3 : -10),
  );
  const coreScaleReady = revenuePosture.status === "scaling-revenue" &&
    financialModel.status === "scale-ready" &&
    paidBackChannelCount > 0 &&
    supportStatus !== "support-blocked" &&
    killPressureReport.recommendation !== "kill" &&
    killPressureReport.recommendation !== "pause";
  const status: VentureScaleStrongBranchStatus = revenuePosture.status === "blocked" ||
    financialModel.status === "blocked" ||
    supportStatus === "support-blocked" ||
    killPressureReport.recommendation === "kill" ||
    killPressureReport.recommendation === "pause"
    ? "blocked"
    : coreScaleReady && humanApprovedSpendCeilingCents > 0
      ? "scale-ready"
      : coreScaleReady
        ? "approval-required"
        : "needs-proof";
  const evidence = [
    `Revenue posture is ${revenuePosture.status} at ${revenuePosture.captureScore}/100: ${revenuePosture.primaryRevenueSource}`,
    `Financial model is ${financialModel.status} at ${financialModel.financeScore}/100 with net evidence cash ${formatCents(financialModel.netEvidenceCashCents)}.`,
    `${paidBackChannelCount} paid-back channel${paidBackChannelCount === 1 ? "" : "s"} recorded.`,
    `${openSupportIssues.length} open support issue${openSupportIssues.length === 1 ? "" : "s"}; ${highSupportIssueCount} high or critical; ${resolvedSupportIssueCount} resolved.`,
    humanApprovedSpendCeilingCents > 0
      ? `${humanApprovedSpendAudits.length} human-approved spend audit${humanApprovedSpendAudits.length === 1 ? "" : "s"} supports a ${formatCents(humanApprovedSpendCeilingCents)} spend ceiling.`
      : "No human-approved spend ceiling is attached.",
    `Kill-pressure recommendation is ${killPressureReport.recommendation}.`,
  ];
  const blockers = [
    revenuePosture.status !== "scaling-revenue" ? `Revenue posture is ${revenuePosture.status}; require scaling-revenue before scaling a branch.` : "",
    financialModel.status !== "scale-ready" ? `Financial model is ${financialModel.status}; require scale-ready unit economics before increasing spend.` : "",
    paidBackChannelCount === 0 ? "No paid-back channel exists; scale would be unbounded acquisition spend." : "",
    highSupportIssueCount > 0 ? `${highSupportIssueCount} high or critical support issue${highSupportIssueCount === 1 ? "" : "s"} remain open.` : "",
    openSupportIssues.length > 1 && highSupportIssueCount === 0 ? `${openSupportIssues.length} open support issue${openSupportIssues.length === 1 ? "" : "s"} need monitoring before expanding volume.` : "",
    humanApprovedSpendCeilingCents <= 0 ? "No explicit human-approved spend ceiling is recorded." : "",
    killPressureReport.recommendation === "kill" || killPressureReport.recommendation === "pause" ? `Kill-pressure recommendation is ${killPressureReport.recommendation}.` : "",
  ].filter(Boolean);
  const stopRules = [
    humanApprovedSpendCeilingCents > 0
      ? `Do not exceed ${formatCents(humanApprovedSpendCeilingCents)} without a new human-approved-spend audit.`
      : "Do not spend externally until a human-approved-spend audit and ceiling are recorded.",
    "Stop scaling if the next channel record is not paid-back.",
    "Stop scaling if high or critical support issues reopen.",
    "Stop scaling if revenue posture falls below scaling-revenue or finance status falls below scale-ready.",
  ];
  const nextAction = status === "scale-ready"
    ? "Run the next cohort under the approved ceiling and record payback, retention, support load, and stop-rule results before raising the ceiling."
    : status === "approval-required"
      ? "Record a human-approved-spend audit and explicit spend ceiling before any external spend or scale motion."
      : status === "blocked"
        ? "Resolve the blocked scale prerequisites before increasing acquisition, billing, hiring, or deployment scope."
        : "Keep collecting revenue, payback, finance, support, and approval evidence before scaling this branch.";
  const summary = status === "scale-ready"
    ? `${venture.title} is ready for a bounded human-reviewed scale step under ${formatCents(humanApprovedSpendCeilingCents)}.`
    : status === "approval-required"
      ? `${venture.title} has strong scale evidence but still needs an explicit human-approved spend ceiling.`
      : status === "blocked"
        ? `${venture.title} is blocked from scaling by ${blockers[0] ?? "an unresolved scale prerequisite"}.`
        : `${venture.title} is not ready to scale; ${blockers[0] ?? "more proof is required"}.`;
  const planWithoutMarkdown: Omit<VentureScaleStrongBranchPlan, "markdown"> = {
    id: `${venture.id}-scale-strong-branch-plan`,
    ventureId: venture.id,
    title: venture.title,
    status,
    supportStatus,
    scaleScore,
    revenueStatus: revenuePosture.status,
    financeStatus: financialModel.status,
    killPressureRecommendation: killPressureReport.recommendation,
    paidBackChannelCount,
    openSupportIssueCount: openSupportIssues.length,
    highSupportIssueCount,
    resolvedSupportIssueCount,
    humanApprovedSpendAuditCount: humanApprovedSpendAudits.length,
    humanApprovedSpendCeilingCents,
    strongestRevenueEvidence: revenuePosture.evidence[0] ?? revenuePosture.primaryRevenueSource,
    summary,
    evidence,
    blockers,
    stopRules,
    nextAction,
    humanReviewRequired: true,
  };

  return {
    ...planWithoutMarkdown,
    markdown: scaleStrongBranchMarkdown(planWithoutMarkdown),
  };
}

function spawnedVentureDraftMarkdown(
  draft: Omit<VentureSpawnedVentureDraft, "markdown">,
): string {
  return [
    `# Spawned Venture Draft: ${draft.proposedTitle}`,
    `Parent: ${draft.parentTitle} (${draft.parentVentureId})`,
    `Branch source: ${draft.branchSourceType}`,
    `Status: ${draft.status}`,
    `Confidence: ${draft.confidenceScore}/100`,
    "",
    "## Summary",
    draft.summary,
    "",
    "## Provenance",
    draft.provenance,
    "",
    "## Thesis Kickoff",
    `- Target buyer: ${draft.targetBuyer}`,
    `- Pain: ${draft.painStatement}`,
    `- Wedge: ${draft.productWedge}`,
    `- Channel: ${draft.channel}`,
    `- Pricing hypothesis: ${draft.pricingHypothesis}`,
    "",
    "## Evidence",
    ...(draft.evidence.length > 0 ? draft.evidence.map((item) => `- ${item}`) : ["- No source evidence carried."]),
    "",
    "## Risks / Gaps to Re-validate",
    ...(draft.risks.length > 0 ? draft.risks.map((item) => `- ${item}`) : ["- No risks recorded for this branch."]),
    "",
    "## Kickoff Actions",
    ...(draft.kickoffActions.length > 0 ? draft.kickoffActions.map((item) => `- ${item}`) : ["- Record the first disconfirmation step before reusing the parent thesis."]),
  ].join("\n");
}

function spawnedVentureDraftStatusFor(
  venture: SavedVentureWorkspace,
  confidenceScore: number,
  branchSource: VentureSpawnedVentureBranchSourceType,
): VentureSpawnedVentureDraftStatus {
  const latestDecision = venture.decisionHistory[0];
  const isKilled = venture.lifecycleStatus === "killed" ||
    venture.decision === "kill-review" ||
    latestDecision?.decision === "kill";
  if (isKilled) return "blocked";
  if (venture.riskRecords.some((risk) => (risk.severity === "critical") && risk.status !== "resolved")) {
    return "blocked";
  }
  if (confidenceScore >= 60 && branchSource === "converted-pricing") return "draft-ready";
  if (confidenceScore >= 55) return "draft-ready";
  return "needs-evidence";
}

export function buildVentureSpawnedVentureDrafts(
  ventures: SavedVentureWorkspace[],
): VentureSpawnedVentureDraft[] {
  const drafts: VentureSpawnedVentureDraft[] = [];

  ventures.forEach((venture) => {
    const convertedPain = buildVentureConvertedPainMemories([venture]);
    const retainedUser = buildVentureRetainedUserMemories([venture]);
    const workedChannel = buildVentureWorkedChannelMemories([venture]);
    const convertedPricing = buildVentureConvertedPricingMemories([venture]);

    convertedPain.slice(0, 2).forEach((memory) => {
      const adjacentBuyer = `Adjacent buyer of ${memory.targetBuyer}`;
      const channel = memory.channels[0] || venture.acquisitionChannels[0] || "unknown channel";
      const confidence = clampScore(memory.conversionScore - 12);
      const status = spawnedVentureDraftStatusFor(venture, confidence, "converted-pain");
      const draftWithoutMarkdown: Omit<VentureSpawnedVentureDraft, "markdown"> = {
        id: `${venture.id}-spawned-converted-pain-${memory.id}`,
        parentVentureId: venture.id,
        parentTitle: venture.title,
        branchSourceType: "converted-pain",
        sourceMemoryId: memory.id,
        sourceMemoryLabel: `Converted pain memory for ${memory.targetBuyer}`,
        proposedTitle: `${venture.title} — adjacent buyer branch`,
        targetBuyer: adjacentBuyer,
        painStatement: memory.painStatement,
        productWedge: venture.productWedge,
        channel,
        pricingHypothesis: venture.pricingHypothesis,
        confidenceScore: confidence,
        status,
        summary: `Branch the wedge into ${adjacentBuyer} since the parent venture converted ${memory.strongestSignal.toLowerCase()} for ${memory.targetBuyer}.`,
        provenance: `Derived from converted-pain memory ${memory.id} (${memory.conversionScore}/100, ${formatCents(memory.revenueCents)} revenue, ${memory.paidUserCount} paid signals).`,
        evidence: [
          memory.strongestSignal,
          memory.reusableLesson,
          ...memory.evidence,
        ].filter(Boolean).slice(0, 5),
        risks: [
          `${adjacentBuyer} has not been validated; treat parent conversion as a hypothesis, not proof.`,
          `Channel "${channel}" worked for the parent buyer; the adjacent buyer may not respond to the same channel.`,
          ...venture.contradictions.slice(0, 1),
        ].filter(Boolean).slice(0, 4),
        kickoffActions: [
          `Record a fresh customer interview with ${adjacentBuyer} before reusing the parent pain narrative.`,
          `Run a fake-door experiment with ${adjacentBuyer} on "${channel}" before reusing parent acquisition spend.`,
          memory.nextAction,
        ].filter(Boolean).slice(0, 4),
      };
      drafts.push({
        ...draftWithoutMarkdown,
        markdown: spawnedVentureDraftMarkdown(draftWithoutMarkdown),
      });
    });

    retainedUser.slice(0, 2).forEach((memory) => {
      const confidence = clampScore(memory.retentionScore - 8);
      const status = spawnedVentureDraftStatusFor(venture, confidence, "retained-user");
      const proposedWedge = `Deepen "${memory.activationEvent}" into a retained-user ritual loop`;
      const draftWithoutMarkdown: Omit<VentureSpawnedVentureDraft, "markdown"> = {
        id: `${venture.id}-spawned-retained-user-${memory.id}`,
        parentVentureId: venture.id,
        parentTitle: venture.title,
        branchSourceType: "retained-user",
        sourceMemoryId: memory.id,
        sourceMemoryLabel: `Retained user memory for ${memory.cohortLabel}`,
        proposedTitle: `${venture.title} — retained cohort deepening branch`,
        targetBuyer: memory.targetBuyer,
        painStatement: venture.painStatement,
        productWedge: proposedWedge,
        channel: memory.acquisitionChannel,
        pricingHypothesis: venture.pricingHypothesis,
        confidenceScore: confidence,
        status,
        summary: `Branch into a deeper retention ritual for ${memory.cohortLabel} (${memory.retentionRate}% retention, ${memory.paidUserCount} paid).`,
        provenance: `Derived from retained-user memory ${memory.id} (${memory.retentionScore}/100, ${memory.retainedUserCount} retained, ${memory.paidUserCount} paid).`,
        evidence: [
          `${memory.retentionRate}% retention during ${memory.retentionWindow}.`,
          memory.reusableLesson,
          ...memory.evidence,
        ].filter(Boolean).slice(0, 5),
        risks: [
          `Retention may not survive a new wedge; the parent activation event is the only proven loop.`,
          memory.supportIssueCount > 0
            ? `${memory.supportIssueCount} support issue${memory.supportIssueCount === 1 ? "" : "s"} attached to the retained cohort must be resolved before branching.`
            : "Support burden has not been measured for the retained cohort.",
        ].filter(Boolean).slice(0, 4),
        kickoffActions: [
          `Interview retained users from ${memory.cohortLabel} about the next paid ritual before building.`,
          `Design a follow-up activation event that extends "${memory.activationEvent}" without breaking the proven retention window.`,
          memory.nextAction,
        ].filter(Boolean).slice(0, 4),
      };
      drafts.push({
        ...draftWithoutMarkdown,
        markdown: spawnedVentureDraftMarkdown(draftWithoutMarkdown),
      });
    });

    workedChannel.slice(0, 2).forEach((memory) => {
      const confidence = clampScore(
        memory.channelScore -
        (memory.paybackStatus === "paid-back" ? 4 : memory.paybackStatus === "partial-payback" ? 12 : 24),
      );
      const status = spawnedVentureDraftStatusFor(venture, confidence, "worked-channel");
      const draftWithoutMarkdown: Omit<VentureSpawnedVentureDraft, "markdown"> = {
        id: `${venture.id}-spawned-worked-channel-${memory.id}`,
        parentVentureId: venture.id,
        parentTitle: venture.title,
        branchSourceType: "worked-channel",
        sourceMemoryId: memory.id,
        sourceMemoryLabel: `Worked channel memory for ${memory.channel}`,
        proposedTitle: `${venture.title} — channel reuse branch on ${memory.channel}`,
        targetBuyer: venture.targetBuyer,
        painStatement: venture.painStatement,
        productWedge: `Adjacent wedge that can ride "${memory.channel}" without rebuilding distribution`,
        channel: memory.channel,
        pricingHypothesis: venture.pricingHypothesis,
        confidenceScore: confidence,
        status,
        summary: `Reuse ${memory.channel} (${memory.paybackStatus}) for an adjacent wedge; ${memory.strongestSignal.toLowerCase()}.`,
        provenance: `Derived from worked-channel memory ${memory.id} (${memory.channelScore}/100, ${memory.paybackStatus}, ${formatCents(memory.revenueCents)} channel revenue).`,
        evidence: [
          memory.strongestSignal,
          memory.reusableLesson,
          ...memory.evidence,
        ].filter(Boolean).slice(0, 5),
        risks: [
          memory.paybackStatus === "paid-back"
            ? `Channel paid back for the parent wedge; an adjacent wedge may not match the same CAC of ${formatCents(memory.cacCents)}.`
            : `Channel only ${memory.paybackStatus}; do not branch into a new wedge until parent payback holds.`,
          `Audience overlap between the parent wedge and a new wedge has not been measured.`,
        ].filter(Boolean).slice(0, 4),
        kickoffActions: [
          `Define the adjacent wedge before reusing ${memory.channel} spend.`,
          `Run a fake-door for the adjacent wedge on ${memory.channel} with the same CAC threshold (${formatCents(memory.cacCents)}).`,
          memory.nextAction,
        ].filter(Boolean).slice(0, 4),
      };
      drafts.push({
        ...draftWithoutMarkdown,
        markdown: spawnedVentureDraftMarkdown(draftWithoutMarkdown),
      });
    });

    convertedPricing.slice(0, 2).forEach((memory) => {
      const confidence = clampScore(memory.conversionScore - 10);
      const status = spawnedVentureDraftStatusFor(venture, confidence, "converted-pricing");
      const proposedPricing = `Adjacent pricing tier branching from accepted price ${memory.acceptedPrice}`;
      const draftWithoutMarkdown: Omit<VentureSpawnedVentureDraft, "markdown"> = {
        id: `${venture.id}-spawned-converted-pricing-${memory.id}`,
        parentVentureId: venture.id,
        parentTitle: venture.title,
        branchSourceType: "converted-pricing",
        sourceMemoryId: memory.id,
        sourceMemoryLabel: `Converted pricing memory at ${memory.acceptedPrice}`,
        proposedTitle: `${venture.title} — pricing tier branch`,
        targetBuyer: venture.targetBuyer,
        painStatement: venture.painStatement,
        productWedge: venture.productWedge,
        channel: venture.acquisitionChannels[0] || "unknown channel",
        pricingHypothesis: proposedPricing,
        confidenceScore: confidence,
        status,
        summary: `Branch into an adjacent pricing tier based on accepted price ${memory.acceptedPrice} and ${memory.paidCommitmentCount} paid commitment${memory.paidCommitmentCount === 1 ? "" : "s"}.`,
        provenance: `Derived from converted-pricing memory ${memory.id} (${memory.conversionScore}/100, ${memory.paidSignalCount} paid signals, ${formatCents(memory.revenueCents)} revenue).`,
        evidence: [
          `Accepted price ${memory.acceptedPrice}; ${memory.paidCommitmentCount} commitments and ${memory.invoiceRequestCount} invoice requests.`,
          memory.reusableLesson,
          ...memory.evidence,
        ].filter(Boolean).slice(0, 5),
        risks: [
          `An adjacent pricing tier has not been validated; a higher tier may not convert and a lower tier may not pay back acquisition.`,
          `Qualified buyer count was ${memory.qualifiedBuyerCount}; a different tier requires a new qualified-buyer sample.`,
        ].slice(0, 4),
        kickoffActions: [
          `Draft the adjacent tier and re-run a pricing test with comparable qualified buyers.`,
          `Require a paid commitment or invoice request before treating the adjacent tier as validated.`,
          memory.nextAction,
        ].filter(Boolean).slice(0, 4),
      };
      drafts.push({
        ...draftWithoutMarkdown,
        markdown: spawnedVentureDraftMarkdown(draftWithoutMarkdown),
      });
    });
  });

  const sourceRank: Record<VentureSpawnedVentureBranchSourceType, number> = {
    "converted-pain": 4,
    "converted-pricing": 3,
    "retained-user": 2,
    "worked-channel": 1,
  };
  const statusRank: Record<VentureSpawnedVentureDraftStatus, number> = {
    "draft-ready": 3,
    "needs-evidence": 2,
    blocked: 1,
  };

  return drafts.sort((a, b) => (
    statusRank[b.status] - statusRank[a.status] ||
    b.confidenceScore - a.confidenceScore ||
    sourceRank[b.branchSourceType] - sourceRank[a.branchSourceType] ||
    a.proposedTitle.localeCompare(b.proposedTitle)
  )).slice(0, 40);
}

function ventureLearningOwnerFor(venture: SavedVentureWorkspace) {
  const owner = [
    venture.roadmapTasks[0]?.owner,
    venture.supportIssues[0]?.owner,
    venture.activationCohorts[0]?.owner,
    venture.channelEconomics[0]?.owner,
    venture.moneySignals[0]?.owner,
    venture.artifactRecords[0]?.owner,
    venture.autonomyAudit[0]?.actor,
    venture.agentRuns[0]?.owner,
    venture.competitors[0]?.owner,
    venture.browserResearchTasks[0]?.owner,
  ].find((candidate) => candidate?.trim());
  return owner?.trim() || "portfolio operator";
}

function learningReinvestmentMarkdown(item: Omit<VentureLearningReinvestmentQueueItem, "markdown">): string {
  return [
    `# Learning Reinvestment Task: ${item.title}`,
    `Source: ${item.sourceType} (${item.sourceArtifactLabel})`,
    `Priority: ${item.priority}`,
    `Status: ${item.status}`,
    `Owner: ${item.owner}`,
    "Old learning changes the next branch.",
    "",
    "## Learning",
    item.learning,
    "",
    "## Next Experiment",
    item.nextExperiment,
    "",
    "## Proof Required",
    item.proofRequired,
    "",
    "## Changed Branch Instruction",
    item.changedBranchInstruction,
    "",
    "## Expected Impact",
    item.expectedImpact,
    "",
    "## Evidence",
    ...(item.evidence.length > 0 ? item.evidence.map((evidence) => `- ${evidence}`) : ["- No evidence attached yet."]),
    "",
    "## Human Review Only",
    "This queue item changes the next internal experiment plan only. It does NOT spend money, contact customers, deploy, merge ventures, or save spawned branches automatically.",
  ].join("\n");
}

function learningReinvestmentItem(
  item: Omit<VentureLearningReinvestmentQueueItem, "markdown">,
): VentureLearningReinvestmentQueueItem {
  return {
    ...item,
    markdown: learningReinvestmentMarkdown(item),
  };
}

function slugifySegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "item";
}

export function buildVentureLearningReinvestmentQueue(
  ventures: SavedVentureWorkspace[],
): VentureLearningReinvestmentQueueItem[] {
  const venturesById = new Map(ventures.map((venture) => [venture.id, venture]));
  const items: VentureLearningReinvestmentQueueItem[] = [];

  buildVentureWeakBranchKillMemories(ventures).forEach((memory) => {
    const venture = venturesById.get(memory.ventureId);
    const owner = venture ? ventureLearningOwnerFor(venture) : "portfolio operator";
    const status: VentureLearningReinvestmentStatus = memory.status === "revival-watch" ? "watch" : "blocked";
    const priority: VentureLearningReinvestmentPriority = memory.status === "archived" || memory.status === "kill-recommended"
      ? "critical"
      : memory.status === "pause-recommended"
        ? "high"
        : "medium";
    items.push(learningReinvestmentItem({
      id: `${memory.id}-learning-reinvestment`,
      ventureId: memory.ventureId,
      relatedVentureIds: [],
      title: `Reinvest kill learning from ${memory.sourceTitle}`,
      sourceType: "weak-branch-kill",
      sourceArtifactId: memory.id,
      sourceArtifactLabel: `Weak branch kill memory for ${memory.sourceTitle}`,
      priority,
      status,
      owner,
      learning: memory.failureLessons[0] ?? memory.primaryReason,
      nextExperiment: memory.revivalConditions[0] ?? memory.nextAction,
      proofRequired: `Show with fresh demand, pricing, retention, or support evidence that "${memory.primaryReason}" has changed before reusing this branch.`,
      changedBranchInstruction: `Do not copy ${memory.sourceTitle}; carry forward the no-go boundary "${memory.noGoBoundaries[0] ?? "No external action while kill memory is active."}" and redesign the next branch around the failure lesson.`,
      expectedImpact: "Prevents the lab from re-spending effort on a weak branch without evidence that the old failure mode has changed.",
      evidence: [
        memory.primaryReason,
        ...memory.evidence,
        ...memory.stopRules.slice(0, 2),
        ...memory.noGoBoundaries.slice(0, 2),
      ].filter(Boolean).slice(0, 8),
      humanReviewRequired: true,
    }));
  });

  buildVentureSpawnedVentureDrafts(ventures).forEach((draft) => {
    const venture = venturesById.get(draft.parentVentureId);
    const owner = venture ? ventureLearningOwnerFor(venture) : "portfolio operator";
    const status: VentureLearningReinvestmentStatus = draft.status === "draft-ready"
      ? "ready"
      : draft.status === "blocked"
        ? "blocked"
        : "watch";
    const priority: VentureLearningReinvestmentPriority = draft.status === "draft-ready" && draft.confidenceScore >= 65
      ? "high"
      : draft.status === "blocked"
        ? "medium"
        : "medium";
    items.push(learningReinvestmentItem({
      id: `${draft.id}-learning-reinvestment`,
      ventureId: draft.parentVentureId,
      relatedVentureIds: [],
      title: `Reinvest branch learning into ${draft.proposedTitle}`,
      sourceType: "spawned-venture-draft",
      sourceArtifactId: draft.id,
      sourceArtifactLabel: draft.sourceMemoryLabel,
      priority,
      status,
      owner,
      learning: `${draft.sourceMemoryLabel}: ${draft.summary}`,
      nextExperiment: draft.kickoffActions[0] ?? "Run the first disconfirmation experiment before saving this branch.",
      proofRequired: draft.risks[0] ?? "Attach fresh buyer/channel/pricing evidence before treating the parent memory as proof.",
      changedBranchInstruction: `Use parent evidence only as a hypothesis input; validate ${draft.targetBuyer} on ${draft.channel} before saving or scaling the branch.`,
      expectedImpact: "Turns successful venture memory into a bounded next experiment instead of an unreviewed duplicate venture.",
      evidence: [
        draft.provenance,
        ...draft.evidence,
        ...draft.risks.slice(0, 2),
      ].filter(Boolean).slice(0, 8),
      humanReviewRequired: true,
    }));
  });

  buildVentureRelatedIdeaMergeAudits(ventures).forEach((audit) => {
    const primary = venturesById.get(audit.primaryVentureId);
    const owner = primary ? ventureLearningOwnerFor(primary) : "portfolio operator";
    const status: VentureLearningReinvestmentStatus = audit.recommendation === "keep-separate" ? "watch" : "ready";
    const priority: VentureLearningReinvestmentPriority = audit.recommendation === "merge" || audit.recommendation === "reuse"
      ? "high"
      : audit.recommendation === "fork"
        ? "medium"
        : "low";
    items.push(learningReinvestmentItem({
      id: `${audit.id}-learning-reinvestment`,
      ventureId: audit.primaryVentureId,
      relatedVentureIds: [audit.relatedVentureId],
      title: `Reinvest merge learning from ${audit.primaryTitle} and ${audit.relatedTitle}`,
      sourceType: "related-idea-merge",
      sourceArtifactId: audit.id,
      sourceArtifactLabel: `Merge audit: ${audit.recommendation}`,
      priority,
      status,
      owner,
      learning: audit.sharedThesisSummary,
      nextExperiment: audit.nextAction,
      proofRequired: `Compare the retained provenance from both ventures and prove the next experiment preserves: ${audit.differencesToPreserve[0] ?? "the distinct buyer/pain/channel evidence."}`,
      changedBranchInstruction: `Do not create a duplicate branch; use the ${audit.recommendation} recommendation to rewrite the next thesis while preserving both audit trails.`,
      expectedImpact: "Converts related-idea overlap into a deliberate reuse/merge/fork decision without losing source provenance.",
      evidence: [
        ...audit.evidenceProvenance.primaryEvidence.slice(0, 2),
        ...audit.evidenceProvenance.relatedEvidence.slice(0, 2),
        ...audit.risks.slice(0, 2),
      ].filter(Boolean).slice(0, 8),
      humanReviewRequired: true,
    }));
  });

  ventures.forEach((venture) => {
    const plan = buildVentureScaleStrongBranchPlan(venture);
    const owner = ventureLearningOwnerFor(venture);
    const status: VentureLearningReinvestmentStatus = plan.status === "scale-ready"
      ? "ready"
      : plan.status === "approval-required"
        ? "needs-owner"
        : plan.status === "blocked"
          ? "blocked"
          : "watch";
    const priority: VentureLearningReinvestmentPriority = plan.status === "scale-ready" || plan.status === "approval-required"
      ? "high"
      : plan.status === "blocked"
        ? "high"
        : "medium";
    items.push(learningReinvestmentItem({
      id: `${plan.id}-learning-reinvestment`,
      ventureId: venture.id,
      relatedVentureIds: [],
      title: `Reinvest scale learning into ${venture.title}`,
      sourceType: "scale-strong-branch",
      sourceArtifactId: plan.id,
      sourceArtifactLabel: `Scale strong branch plan: ${plan.status}`,
      priority,
      status,
      owner,
      learning: plan.summary,
      nextExperiment: plan.nextAction,
      proofRequired: `Record the next cohort's payback, retention, support load, and stop-rule result. First stop rule: ${plan.stopRules[0] ?? "Do not scale without proof."}`,
      changedBranchInstruction: `Carry forward the strongest revenue evidence (${plan.strongestRevenueEvidence}) and cap the next branch by the human-approved spend ceiling before increasing scope.`,
      expectedImpact: "Turns scale evidence into a measured reinvestment loop with explicit stop rules instead of blind expansion.",
      evidence: [
        plan.strongestRevenueEvidence,
        ...plan.evidence,
        ...plan.blockers.slice(0, 2),
        ...plan.stopRules.slice(0, 2),
      ].filter(Boolean).slice(0, 8),
      humanReviewRequired: true,
    }));
  });

  const priorityRank: Record<VentureLearningReinvestmentPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureLearningReinvestmentStatus, number> = {
    blocked: 4,
    ready: 3,
    "needs-owner": 2,
    watch: 1,
  };

  return items.sort((a, b) => (
    priorityRank[b.priority] - priorityRank[a.priority] ||
    statusRank[b.status] - statusRank[a.status] ||
    a.title.localeCompare(b.title)
  )).slice(0, 120);
}

function opportunityDiscoveryMarkdown(item: Omit<VentureOpportunityDiscoveryBacklogItem, "markdown">): string {
  return [
    `# Opportunity Discovery Backlog: ${item.title}`,
    `Source: ${item.sourceType} (${item.sourceArtifactLabel})`,
    `Priority: ${item.priority}`,
    `Status: ${item.status}`,
    `Confidence: ${item.confidenceScore}/100`,
    `Owner: ${item.owner}`,
    "",
    "## Discovery Rationale",
    item.discoveryRationale,
    "",
    "## Opportunity Thesis",
    `- Target buyer: ${item.targetBuyer}`,
    `- Pain: ${item.painStatement}`,
    `- Wedge: ${item.opportunityWedge}`,
    "",
    "## Source Provenance",
    ...(item.sourceProvenance.length > 0 ? item.sourceProvenance.map((source) => `- ${source}`) : ["- No source provenance attached yet."]),
    "",
    "## Next Research Command",
    item.nextResearchCommand,
    "",
    "## Proof Required",
    item.proofRequired,
    "",
    "## Improved Venture Instruction",
    item.improvedVentureInstruction,
  ].join("\n");
}

function opportunityDiscoveryItem(
  item: Omit<VentureOpportunityDiscoveryBacklogItem, "markdown">,
): VentureOpportunityDiscoveryBacklogItem {
  return {
    ...item,
    markdown: opportunityDiscoveryMarkdown(item),
  };
}

function opportunityDiscoveryPriorityFor(
  confidenceScore: number,
  status: VentureOpportunityDiscoveryStatus,
): VentureOpportunityDiscoveryPriority {
  if (status === "blocked") return "critical";
  if (confidenceScore >= 76) return "high";
  if (confidenceScore >= 50) return "medium";
  return "low";
}

export function buildVentureOpportunityDiscoveryBacklog(
  ventures: SavedVentureWorkspace[],
): VentureOpportunityDiscoveryBacklogItem[] {
  const items: VentureOpportunityDiscoveryBacklogItem[] = [];

  ventures.forEach((venture) => {
    const owner = ventureLearningOwnerFor(venture);
    const marketModel = buildVentureMarketModel(venture);

    marketModel.missingProof
      .filter((gap) => gap !== "No major proof gap currently modeled.")
      .slice(0, 3)
      .forEach((gap, index) => {
        const status: VentureOpportunityDiscoveryStatus = gap.toLowerCase().includes("source")
          ? "needs-source"
          : "research-ready";
        const confidenceScore = clampScore(70 - index * 6 + (marketModel.confidence === "low" ? 8 : marketModel.confidence === "medium" ? 4 : 0));
        items.push(opportunityDiscoveryItem({
          id: `${venture.id}-opportunity-gap-${slugifySegment(gap)}-${index}`,
          ventureId: venture.id,
          title: `Discover opportunity proof for ${venture.title}: ${gap}`,
          sourceType: "market-proof-gap",
          sourceArtifactId: marketModel.id,
          sourceArtifactLabel: `Market model gap: ${gap}`,
          priority: opportunityDiscoveryPriorityFor(confidenceScore, status),
          status,
          confidenceScore,
          owner,
          targetBuyer: venture.targetBuyer,
          painStatement: venture.painStatement,
          opportunityWedge: venture.productWedge,
          discoveryRationale: `The current market model is ${marketModel.confidence} confidence and still needs proof for "${gap}" before the lab treats this as a stronger opportunity.`,
          sourceProvenance: [
            `Market model confidence ${marketModel.confidence} (${marketModel.confidenceScore}/100).`,
            marketModel.nextAction,
            ...marketModel.risks.slice(0, 2),
          ].filter(Boolean),
          nextResearchCommand: `Research "${gap}" for ${venture.targetBuyer} in ${venture.title}; capture source URLs, buyer quotes, dated evidence, and a pass/fail interpretation.`,
          proofRequired: `Attach source-backed evidence that resolves "${gap}" and state whether it changes buyer, pain, wedge, channel, or pricing before saving the next venture.`,
          improvedVentureInstruction: "Only create or update the next saved venture after the discovered proof changes at least one thesis field or removes a documented market-model gap.",
        }));
      });

    venture.evidenceSources.slice(0, 3).forEach((source, index) => {
      const quality = scoreEvidenceQuality(source);
      const status: VentureOpportunityDiscoveryStatus = source.url.trim() ? "research-ready" : "needs-source";
      const title = source.title || source.summary || `${source.platform} evidence`;
      items.push(opportunityDiscoveryItem({
        id: `${venture.id}-opportunity-evidence-${source.id || index}`,
        ventureId: venture.id,
        title: `Refresh opportunity evidence from ${title}`,
        sourceType: "evidence-source",
        sourceArtifactId: source.id || `${venture.id}-evidence-${index}`,
        sourceArtifactLabel: `${source.platform}: ${title}`,
        priority: opportunityDiscoveryPriorityFor(quality.score, status),
        status,
        confidenceScore: quality.score,
        owner,
        targetBuyer: venture.targetBuyer,
        painStatement: venture.painStatement,
        opportunityWedge: venture.productWedge,
        discoveryRationale: `Existing ${source.platform} evidence can be refreshed into a current opportunity signal instead of remaining static research context.`,
        sourceProvenance: [
          `${source.platform}: ${title}`,
          source.summary,
          source.keywords,
          source.url,
        ].filter(Boolean),
        nextResearchCommand: source.url.trim()
          ? `Open ${source.url}, verify the current signal, and extract the buyer/pain/wedge change that should affect the next saved venture.`
          : `Find a source URL for ${source.platform} evidence "${title}" and capture a dated quote or metric before using it for discovery.`,
        proofRequired: "Capture a current source URL, quote or metric, date, and explicit interpretation of whether the opportunity is stronger, weaker, or different.",
        improvedVentureInstruction: "Promote this evidence into a new or updated venture only if it changes the thesis, score, source provenance, or fastest validation path.",
      }));
    });

    venture.browserResearchTasks
      .filter((task) => task.status !== "dismissed")
      .slice(0, 4)
      .forEach((task) => {
        const status: VentureOpportunityDiscoveryStatus = task.status === "blocked"
          ? "blocked"
          : task.status === "evidence-captured"
            ? "research-ready"
            : "watch";
        const confidenceScore = task.status === "evidence-captured" ? 78 : task.status === "blocked" ? 35 : 58;
        items.push(opportunityDiscoveryItem({
          id: `${task.id}-opportunity-discovery`,
          ventureId: venture.id,
          title: `Convert browser research into opportunity: ${task.sourceTarget}`,
          sourceType: "browser-research",
          sourceArtifactId: task.id,
          sourceArtifactLabel: `${task.platform}: ${task.sourceTarget}`,
          priority: opportunityDiscoveryPriorityFor(confidenceScore, status),
          status,
          confidenceScore,
          owner: task.owner || owner,
          targetBuyer: venture.targetBuyer,
          painStatement: venture.painStatement,
          opportunityWedge: venture.productWedge,
          discoveryRationale: task.findings,
          sourceProvenance: [
            task.prompt,
            task.evidenceUrl,
            task.replayNote,
          ].filter(Boolean),
          nextResearchCommand: task.nextAction || task.prompt,
          proofRequired: "Attach a browser-captured source URL, findings summary, and replay note before treating this as opportunity discovery.",
          improvedVentureInstruction: "Update the next saved venture only after the browser finding changes source provenance, competitor assumptions, or the fastest validation path.",
        }));
      });

    venture.competitors
      .filter((competitor) => competitor.status !== "dismissed")
      .slice(0, 4)
      .forEach((competitor) => {
        const status: VentureOpportunityDiscoveryStatus = competitor.threatLevel === "critical" ? "blocked" : "research-ready";
        const confidenceScore = competitor.threatLevel === "critical"
          ? 42
          : competitor.threatLevel === "high"
            ? 74
            : 60;
        items.push(opportunityDiscoveryItem({
          id: `${competitor.id}-opportunity-discovery`,
          ventureId: venture.id,
          title: `Discover differentiated wedge against ${competitor.competitorName}`,
          sourceType: "competitor-watch",
          sourceArtifactId: competitor.id,
          sourceArtifactLabel: `${competitor.competitorType}: ${competitor.competitorName}`,
          priority: opportunityDiscoveryPriorityFor(confidenceScore, status),
          status,
          confidenceScore,
          owner: competitor.owner || owner,
          targetBuyer: venture.targetBuyer,
          painStatement: venture.painStatement,
          opportunityWedge: competitor.differentiation || venture.productWedge,
          discoveryRationale: competitor.positioning,
          sourceProvenance: [
            competitor.evidence,
            competitor.responsePlan,
            competitor.watchCadence,
          ].filter(Boolean),
          nextResearchCommand: competitor.nextAction,
          proofRequired: `Compare ${competitor.competitorName} against the proposed wedge with source-backed differentiation, switching-cost, and buyer urgency evidence.`,
          improvedVentureInstruction: "Do not save a new opportunity that is only a copycat; require the competitor watch to change differentiation or kill the thesis.",
        }));
      });

    buildVentureConvertedPainMemories([venture]).slice(0, 2).forEach((memory) => {
      const confidenceScore = clampScore(memory.conversionScore - 5);
      items.push(opportunityDiscoveryItem({
        id: `${memory.id}-opportunity-discovery`,
        ventureId: venture.id,
        title: `Discover adjacent opportunity from converted pain: ${memory.targetBuyer}`,
        sourceType: "portfolio-memory",
        sourceArtifactId: memory.id,
        sourceArtifactLabel: `Converted pain memory for ${memory.targetBuyer}`,
        priority: opportunityDiscoveryPriorityFor(confidenceScore, "research-ready"),
        status: "research-ready",
        confidenceScore,
        owner,
        targetBuyer: memory.targetBuyer,
        painStatement: memory.painStatement,
        opportunityWedge: venture.productWedge,
        discoveryRationale: memory.reusableLesson,
        sourceProvenance: [
          memory.strongestSignal,
          ...memory.evidence.slice(0, 4),
        ].filter(Boolean),
        nextResearchCommand: `Find an adjacent buyer segment for "${memory.painStatement}" and capture a fresh interview, pricing, or activation signal before branching.`,
        proofRequired: "Show that the converted pain repeats outside the current venture through a fresh buyer quote, pricing signal, or activation event.",
        improvedVentureInstruction: "Use this memory to seed a new opportunity only when fresh proof changes target buyer, channel, or pricing instead of copying the old branch.",
      }));
    });

    buildVentureFakeMarketMemories([venture]).slice(0, 2).forEach((memory) => {
      const confidenceScore = clampScore(80 - memory.fakeScore);
      items.push(opportunityDiscoveryItem({
        id: `${memory.id}-opportunity-discovery`,
        ventureId: venture.id,
        title: `Avoid fake-market opportunity: ${memory.marketLabel}`,
        sourceType: "portfolio-memory",
        sourceArtifactId: memory.id,
        sourceArtifactLabel: `Fake market memory for ${memory.marketLabel}`,
        priority: "critical",
        status: "blocked",
        confidenceScore,
        owner,
        targetBuyer: memory.targetBuyer,
        painStatement: memory.painStatement,
        opportunityWedge: venture.productWedge,
        discoveryRationale: memory.whyFake,
        sourceProvenance: [
          memory.whyAttractive,
          memory.neverRepeat,
          ...memory.evidence.slice(0, 4),
        ].filter(Boolean),
        nextResearchCommand: memory.nextAction,
        proofRequired: "Do not advance this opportunity unless fresh evidence reverses the fake-market reason with demand, pricing, or retained-user proof.",
        improvedVentureInstruction: "Keep this as a blocked discovery guardrail so the next venture avoids the old fake-market pattern.",
      }));
    });
  });

  const priorityRank: Record<VentureOpportunityDiscoveryPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureOpportunityDiscoveryStatus, number> = {
    blocked: 4,
    "research-ready": 3,
    "needs-source": 2,
    watch: 1,
  };

  return items.sort((a, b) => (
    priorityRank[b.priority] - priorityRank[a.priority] ||
    statusRank[b.status] - statusRank[a.status] ||
    b.confidenceScore - a.confidenceScore ||
    a.title.localeCompare(b.title)
  )).slice(0, 120);
}

function overlookedOpportunityAtlasMarkdown(
  item: Omit<VentureOverlookedOpportunityAtlasItem, "markdown">,
): string {
  return [
    `# Overlooked Opportunity Atlas Item: ${item.title}`,
    `Source: ${item.sourceType} (${item.sourceArtifactLabel})`,
    `Status: ${item.status}`,
    `Priority: ${item.priority}`,
    `Rank: ${item.rankScore}/100`,
    `Confidence: ${item.confidenceScore}/100`,
    `Novelty (not-recycled): ${item.noveltyScore}/100`,
    `Owner: ${item.owner}`,
    "",
    "## Hidden Wedge Thesis",
    `- Target buyer: ${item.targetBuyer}`,
    `- Pain: ${item.painStatement}`,
    `- Hidden wedge: ${item.hiddenWedge}`,
    "",
    "## Hidden Wedge Rationale",
    item.hiddenWedgeRationale,
    "",
    "## Not-Recycled Proof",
    item.notRecycledProof,
    "",
    "## Source Provenance",
    ...(item.sourceProvenance.length > 0
      ? item.sourceProvenance.map((source) => `- ${source}`)
      : ["- No source provenance attached yet."]),
    "",
    "## Cheap Internal Test Command",
    item.cheapInternalTestCommand,
    "",
    "## Human Review Boundary",
    item.humanReviewBoundary,
    "",
    "## No External Side Effect Proof",
    item.noExternalSideEffectProof,
    "",
    "## Next Action",
    item.nextAction,
  ].join("\n");
}

function overlookedOpportunityAtlasItem(
  item: Omit<VentureOverlookedOpportunityAtlasItem, "markdown">,
): VentureOverlookedOpportunityAtlasItem {
  return {
    ...item,
    markdown: overlookedOpportunityAtlasMarkdown(item),
  };
}

function overlookedOpportunityPriorityFor(
  rankScore: number,
  status: VentureOverlookedOpportunityStatus,
): VentureOverlookedOpportunityPriority {
  if (status === "blocked") return "critical";
  if (rankScore >= 80) return "critical";
  if (rankScore >= 65) return "high";
  if (rankScore >= 45) return "medium";
  return "low";
}

const OVERLOOKED_HUMAN_REVIEW_BOUNDARY =
  "Human review required before saving a new venture, contacting any buyer, or changing portfolio scope. This atlas item is a ranked discovery suggestion only.";

const OVERLOOKED_NO_EXTERNAL_SIDE_EFFECT_PROOF =
  "Atlas guarantees no send / no spend / no deploy / no contact / no billing change. The cheap test command is internal-only and limited to local saved data, in-app filters, and the existing browser-research queue.";

function overlookedOpportunityNoveltyFor(
  venture: SavedVentureWorkspace,
  buyer: string,
  pain: string,
  wedge: string,
): number {
  const ventureSignature = `${venture.targetBuyer} ${venture.painStatement} ${venture.productWedge}`.toLowerCase();
  const candidateSignature = `${buyer} ${pain} ${wedge}`.toLowerCase();
  const ventureTokens = new Set(
    ventureSignature
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4),
  );
  const candidateTokens = candidateSignature
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4);
  if (candidateTokens.length === 0) return 70;
  const overlap = candidateTokens.filter((token) => ventureTokens.has(token)).length;
  const overlapRatio = overlap / candidateTokens.length;
  return clampScore(100 - Math.round(overlapRatio * 100));
}

export function buildVentureOverlookedOpportunityAtlas(
  ventures: SavedVentureWorkspace[],
): VentureOverlookedOpportunityAtlasItem[] {
  const items: VentureOverlookedOpportunityAtlasItem[] = [];

  ventures.forEach((venture) => {
    const owner = ventureLearningOwnerFor(venture);
    const evidenceProfile = summarizeVentureEvidence(venture);
    const marketModel = buildVentureMarketModel(venture);
    const opportunityBacklog = buildVentureOpportunityDiscoveryBacklog([venture]);
    const convertedPainMemories = buildVentureConvertedPainMemories([venture]);
    const fakeMarketMemories = buildVentureFakeMarketMemories([venture]);

    opportunityBacklog
      .filter((entry) => entry.status === "research-ready" || entry.status === "needs-source")
      .slice(0, 4)
      .forEach((entry) => {
        const novelty = overlookedOpportunityNoveltyFor(
          venture,
          entry.targetBuyer,
          entry.painStatement,
          entry.opportunityWedge,
        );
        const status: VentureOverlookedOpportunityStatus = entry.status === "research-ready" ? "ranked-ready" : "needs-source";
        const rankScore = clampScore(entry.confidenceScore * 0.55 + novelty * 0.35 + (evidenceProfile.readinessScore < 60 ? 5 : 0));
        items.push(overlookedOpportunityAtlasItem({
          id: `${entry.id}-overlooked-atlas`,
          ventureId: venture.id,
          title: `Overlooked opportunity: ${entry.title}`,
          sourceType: "opportunity-backlog",
          sourceArtifactId: entry.id,
          sourceArtifactLabel: `Opportunity discovery backlog: ${entry.sourceArtifactLabel}`,
          status,
          priority: overlookedOpportunityPriorityFor(rankScore, status),
          rankScore,
          confidenceScore: entry.confidenceScore,
          noveltyScore: novelty,
          owner,
          targetBuyer: entry.targetBuyer,
          painStatement: entry.painStatement,
          hiddenWedge: entry.opportunityWedge,
          hiddenWedgeRationale: entry.discoveryRationale,
          notRecycledProof: `Novelty ${novelty}/100 against current saved venture "${venture.title}" — only promote if the cheap internal test shows this changes buyer, pain, wedge, channel, or pricing.`,
          sourceProvenance: [
            `Discovery backlog source: ${entry.sourceArtifactLabel}`,
            ...entry.sourceProvenance.slice(0, 4),
          ].filter(Boolean),
          cheapInternalTestCommand: `Locally run \`pnpm test -- src/lib/venture-portfolio.test.ts -t "opportunity discovery backlog"\` and then filter Venture Lab with "opportunity discovery backlog" to inspect this candidate against saved evidence in this app only.`,
          humanReviewBoundary: OVERLOOKED_HUMAN_REVIEW_BOUNDARY,
          noExternalSideEffectProof: OVERLOOKED_NO_EXTERNAL_SIDE_EFFECT_PROOF,
          nextAction: entry.nextResearchCommand,
        }));
      });

    marketModel.missingProof
      .filter((gap) => gap !== "No major proof gap currently modeled.")
      .slice(0, 2)
      .forEach((gap, index) => {
        const novelty = overlookedOpportunityNoveltyFor(
          venture,
          venture.targetBuyer,
          gap,
          venture.productWedge,
        );
        const confidence = clampScore(70 - index * 8 + (marketModel.confidence === "low" ? 6 : marketModel.confidence === "medium" ? 2 : 0));
        const rankScore = clampScore(confidence * 0.55 + novelty * 0.4);
        const status: VentureOverlookedOpportunityStatus = marketModel.confidence === "low" ? "needs-source" : "ranked-ready";
        items.push(overlookedOpportunityAtlasItem({
          id: `${venture.id}-overlooked-gap-${slugifySegment(gap)}-${index}`,
          ventureId: venture.id,
          title: `Overlooked proof gap: ${gap}`,
          sourceType: "market-proof-gap",
          sourceArtifactId: marketModel.id,
          sourceArtifactLabel: `Market model proof gap: ${gap}`,
          status,
          priority: overlookedOpportunityPriorityFor(rankScore, status),
          rankScore,
          confidenceScore: confidence,
          noveltyScore: novelty,
          owner,
          targetBuyer: venture.targetBuyer,
          painStatement: venture.painStatement,
          hiddenWedge: `Unproven wedge implied by "${gap}" — open until evidence resolves the gap.`,
          hiddenWedgeRationale: `Market model is ${marketModel.confidence} confidence (${marketModel.confidenceScore}/100) and still has an open proof gap "${gap}" that has not been validated against current evidence.`,
          notRecycledProof: `Saved venture "${venture.title}" has not yet attached source-backed proof for this gap; novelty score ${novelty}/100 confirms it is not a recycled validated wedge.`,
          sourceProvenance: [
            `Market confidence ${marketModel.confidence} (${marketModel.confidenceScore}/100)`,
            marketModel.nextAction,
            ...marketModel.risks.slice(0, 2),
          ].filter(Boolean),
          cheapInternalTestCommand: `Run \`pnpm test -- src/lib/venture-portfolio.test.ts -t "market model"\` and use the in-app Venture Lab search "${gap.slice(0, 40)}" to inspect saved evidence locally in this app only.`,
          humanReviewBoundary: OVERLOOKED_HUMAN_REVIEW_BOUNDARY,
          noExternalSideEffectProof: OVERLOOKED_NO_EXTERNAL_SIDE_EFFECT_PROOF,
          nextAction: `Capture local source-backed evidence that resolves "${gap}" before promoting this overlooked opportunity into a new venture.`,
        }));
      });

    venture.competitors
      .filter((competitor) => competitor.status !== "dismissed")
      .filter((competitor) => (
        competitor.competitorType === "substitute" ||
        competitor.competitorType === "status-quo" ||
        competitor.threatLevel === "high" ||
        competitor.threatLevel === "critical"
      ))
      .slice(0, 3)
      .forEach((competitor) => {
        const novelty = overlookedOpportunityNoveltyFor(
          venture,
          venture.targetBuyer,
          venture.painStatement,
          competitor.differentiation || venture.productWedge,
        );
        const confidence = competitor.threatLevel === "critical"
          ? 48
          : competitor.threatLevel === "high"
            ? 68
            : 60;
        const rankScore = clampScore(confidence * 0.5 + novelty * 0.45);
        const status: VentureOverlookedOpportunityStatus = competitor.threatLevel === "critical" ? "blocked" : "ranked-ready";
        items.push(overlookedOpportunityAtlasItem({
          id: `${competitor.id}-overlooked-atlas`,
          ventureId: venture.id,
          title: `Overlooked wedge against ${competitor.competitorName}`,
          sourceType: "competitor-watch",
          sourceArtifactId: competitor.id,
          sourceArtifactLabel: `${competitor.competitorType}: ${competitor.competitorName}`,
          status,
          priority: overlookedOpportunityPriorityFor(rankScore, status),
          rankScore,
          confidenceScore: confidence,
          noveltyScore: novelty,
          owner: competitor.owner || owner,
          targetBuyer: venture.targetBuyer,
          painStatement: venture.painStatement,
          hiddenWedge: competitor.differentiation || `Differentiated wedge against ${competitor.competitorName} not yet proven.`,
          hiddenWedgeRationale: competitor.positioning || `${competitor.competitorName} currently absorbs demand; an overlooked wedge would have to beat it on switching cost, urgency, or buyer fit.`,
          notRecycledProof: `Novelty ${novelty}/100 against current saved venture wedge — only treat as overlooked if the wedge changes vs. ${competitor.competitorName}'s current offer.`,
          sourceProvenance: [
            competitor.evidence,
            competitor.responsePlan,
            competitor.watchCadence,
          ].filter(Boolean),
          cheapInternalTestCommand: `Open Venture Lab, filter saved ventures by "${competitor.competitorName}", and inspect already-recorded substitute evidence and customer interviews stored locally in this app only.`,
          humanReviewBoundary: OVERLOOKED_HUMAN_REVIEW_BOUNDARY,
          noExternalSideEffectProof: OVERLOOKED_NO_EXTERNAL_SIDE_EFFECT_PROOF,
          nextAction: competitor.nextAction,
        }));
      });

    fakeMarketMemories.slice(0, 2).forEach((memory) => {
      const novelty = overlookedOpportunityNoveltyFor(
        venture,
        memory.targetBuyer,
        memory.painStatement,
        venture.productWedge,
      );
      const confidence = clampScore(70 - memory.fakeScore);
      const rankScore = clampScore(confidence * 0.4 + novelty * 0.5);
      items.push(overlookedOpportunityAtlasItem({
        id: `${memory.id}-overlooked-atlas`,
        ventureId: venture.id,
        title: `Overlooked angle past fake market: ${memory.marketLabel}`,
        sourceType: "fake-market-memory",
        sourceArtifactId: memory.id,
        sourceArtifactLabel: `Fake market memory: ${memory.marketLabel}`,
        status: "blocked",
        priority: "critical",
        rankScore,
        confidenceScore: confidence,
        noveltyScore: novelty,
        owner,
        targetBuyer: memory.targetBuyer,
        painStatement: memory.painStatement,
        hiddenWedge: `Different buyer or pain than the fake-market drift (fake score ${memory.fakeScore}/100).`,
        hiddenWedgeRationale: memory.whyFake,
        notRecycledProof: `Past ${memory.marketLabel} attempt failed because: ${memory.neverRepeat}. Novelty ${novelty}/100 must show a different buyer, pain, or wedge before this is treated as a new opportunity.`,
        sourceProvenance: [
          memory.whyAttractive,
          memory.neverRepeat,
          ...memory.evidence.slice(0, 4),
        ].filter(Boolean),
        cheapInternalTestCommand: `Search Venture Lab for "${memory.marketLabel}" and re-read the saved fake-market memory plus failure lessons locally before any new venture is saved in this app only.`,
        humanReviewBoundary: OVERLOOKED_HUMAN_REVIEW_BOUNDARY,
        noExternalSideEffectProof: OVERLOOKED_NO_EXTERNAL_SIDE_EFFECT_PROOF,
        nextAction: memory.nextAction,
      }));
    });

    convertedPainMemories.slice(0, 2).forEach((memory) => {
      const adjacentBuyer = `Adjacent segment to ${memory.targetBuyer}`;
      const novelty = overlookedOpportunityNoveltyFor(
        venture,
        adjacentBuyer,
        memory.painStatement,
        venture.productWedge,
      );
      const confidence = clampScore(memory.conversionScore - 10);
      const rankScore = clampScore(confidence * 0.45 + novelty * 0.5);
      const status: VentureOverlookedOpportunityStatus = novelty >= 55 ? "ranked-ready" : "watch";
      items.push(overlookedOpportunityAtlasItem({
        id: `${memory.id}-overlooked-atlas`,
        ventureId: venture.id,
        title: `Overlooked adjacency from converted pain: ${memory.targetBuyer}`,
        sourceType: "converted-pain-memory",
        sourceArtifactId: memory.id,
        sourceArtifactLabel: `Converted pain memory: ${memory.targetBuyer}`,
        status,
        priority: overlookedOpportunityPriorityFor(rankScore, status),
        rankScore,
        confidenceScore: confidence,
        noveltyScore: novelty,
        owner,
        targetBuyer: adjacentBuyer,
        painStatement: memory.painStatement,
        hiddenWedge: `Reuse the validated wedge in an adjacent segment that has not yet been served by saved venture "${venture.title}".`,
        hiddenWedgeRationale: memory.reusableLesson,
        notRecycledProof: `Converted pain memory already proved demand for "${memory.targetBuyer}"; novelty ${novelty}/100 must show this atlas item targets a different buyer/channel/pricing before it is saved as a new venture.`,
        sourceProvenance: [
          memory.strongestSignal,
          `Paid users ${memory.paidUserCount}, channels ${memory.channels.join(", ") || "n/a"}`,
          ...memory.evidence.slice(0, 4),
        ].filter(Boolean),
        cheapInternalTestCommand: `Run \`pnpm test -- src/lib/venture-portfolio.test.ts -t "converted pain memory"\` and filter Venture Lab by "converted pain memory" to locally compare adjacent segments before saving anything in this app only.`,
        humanReviewBoundary: OVERLOOKED_HUMAN_REVIEW_BOUNDARY,
        noExternalSideEffectProof: OVERLOOKED_NO_EXTERNAL_SIDE_EFFECT_PROOF,
        nextAction: memory.nextAction,
      }));
    });

    evidenceProfile.scoredSources
      .slice()
      .sort((a, b) => a.quality.score - b.quality.score)
      .slice(0, 2)
      .forEach((scored, index) => {
        const quality = scored.quality;
        const novelty = overlookedOpportunityNoveltyFor(
          venture,
          venture.targetBuyer,
          scored.summary || venture.painStatement,
          venture.productWedge,
        );
        const confidence = clampScore(100 - quality.score);
        const rankScore = clampScore(confidence * 0.45 + novelty * 0.45);
        const status: VentureOverlookedOpportunityStatus = scored.url.trim() ? "watch" : "needs-source";
        const platformTitle = scored.title || scored.summary || `${scored.platform} evidence`;
        items.push(overlookedOpportunityAtlasItem({
          id: `${venture.id}-overlooked-evidence-${scored.id || index}`,
          ventureId: venture.id,
          title: `Overlooked weak-evidence signal: ${platformTitle}`,
          sourceType: "evidence-quality",
          sourceArtifactId: scored.id || `${venture.id}-evidence-${index}`,
          sourceArtifactLabel: `${scored.platform}: ${platformTitle}`,
          status,
          priority: overlookedOpportunityPriorityFor(rankScore, status),
          rankScore,
          confidenceScore: confidence,
          noveltyScore: novelty,
          owner,
          targetBuyer: venture.targetBuyer,
          painStatement: scored.summary || venture.painStatement,
          hiddenWedge: scored.summary || venture.productWedge,
          hiddenWedgeRationale: `Saved evidence "${platformTitle}" scores ${quality.score}/100 quality, so it has been under-weighted in current decisions. A stronger source could reveal an overlooked wedge.`,
          notRecycledProof: `Quality score ${quality.score}/100 and novelty ${novelty}/100 show this is not yet a recycled validated wedge in saved venture "${venture.title}".`,
          sourceProvenance: [
            `${scored.platform}: ${platformTitle}`,
            scored.summary,
            scored.url,
            ...quality.warnings.slice(0, 2),
          ].filter(Boolean),
          cheapInternalTestCommand: scored.url.trim()
            ? `Open Venture Lab, filter by "${scored.platform}", and re-read the saved source plus its quality warnings locally in this app only.`
            : `Use Venture Lab to attach a saved source URL or local quote for "${platformTitle}" before promoting this overlooked signal in this app only.`,
          humanReviewBoundary: OVERLOOKED_HUMAN_REVIEW_BOUNDARY,
          noExternalSideEffectProof: OVERLOOKED_NO_EXTERNAL_SIDE_EFFECT_PROOF,
          nextAction: `Capture a stronger local source or quote that resolves the quality warning, then re-rank this overlooked opportunity before saving a new venture.`,
        }));
      });
  });

  const priorityRank: Record<VentureOverlookedOpportunityPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureOverlookedOpportunityStatus, number> = {
    blocked: 4,
    "ranked-ready": 3,
    "needs-source": 2,
    watch: 1,
  };

  return items
    .sort((a, b) => (
      priorityRank[b.priority] - priorityRank[a.priority] ||
      b.rankScore - a.rankScore ||
      statusRank[b.status] - statusRank[a.status] ||
      b.noveltyScore - a.noveltyScore ||
      a.title.localeCompare(b.title)
    ))
    .slice(0, 120);
}

const ATLAS_VALIDATION_HUMAN_REVIEW_BOUNDARY =
  "Human review required before running this validation pack. The pack is an internal command artifact that does not send messages, spend money, deploy code, contact customers, or change billing on its own.";

const ATLAS_VALIDATION_NO_EXTERNAL_SIDE_EFFECT_PROOF =
  "Validation pack guarantees no send / no spend / no deploy / no contact / no billing change. The cheapest internal validation command is restricted to local pnpm/test/filter commands and manual result capture in this app only.";

const ATLAS_VALIDATION_APPROVAL_GATES: string[] = [
  "Human operator must explicitly approve running this validation pack before any local execution.",
  "Pack must not send messages, spend money, deploy code, contact customers, or change billing.",
  "All experiment results must be manually captured into local saved evidence and the demand drift report.",
];

function atlasValidationCommandPackMarkdown(
  pack: Omit<VentureAtlasValidationCommandPack, "markdown">,
): string {
  return [
    `# Atlas Validation Command Pack: ${pack.title}`,
    `Atlas item: ${pack.atlasItemTitle} (${pack.atlasItemId})`,
    `Source: ${pack.sourceType} (${pack.atlasSourceArtifactLabel})`,
    `Status: ${pack.status}`,
    `Priority: ${pack.priority}`,
    `Rank: ${pack.rankScore}/100`,
    `Confidence: ${pack.confidenceScore}/100`,
    `Novelty (not-recycled): ${pack.noveltyScore}/100`,
    `Owner: ${pack.owner}`,
    "",
    "## Target Buyer",
    pack.targetBuyer,
    "",
    "## Hidden Wedge",
    pack.hiddenWedge,
    "",
    "## Hypothesis",
    pack.hypothesis,
    "",
    "## Cheapest Internal Validation Command",
    pack.cheapInternalValidationCommand,
    "",
    "## Manual Result Fields",
    ...(pack.manualResultFields.length > 0
      ? pack.manualResultFields.map((field) => `- ${field}`)
      : ["- No manual result fields captured yet."]),
    "",
    "## Manual Result Thresholds",
    ...(pack.manualResultThresholds.length > 0
      ? pack.manualResultThresholds.map((threshold) => `- ${threshold}`)
      : ["- No manual result thresholds captured yet."]),
    "",
    "## Success Criteria",
    pack.successCriteria,
    "",
    "## Failure Criteria",
    pack.failureCriteria,
    "",
    "## Pivot Criteria",
    pack.pivotCriteria,
    "",
    "## Demand Drift Update Instruction",
    pack.demandDriftUpdateInstruction,
    "",
    "## Source Provenance",
    ...(pack.sourceProvenance.length > 0
      ? pack.sourceProvenance.map((line) => `- ${line}`)
      : ["- No source provenance attached yet."]),
    "",
    "## Approval Gates",
    ...pack.approvalGates.map((gate) => `- ${gate}`),
    "",
    "## Human Review Boundary",
    pack.humanReviewBoundary,
    "",
    "## No External Side Effect Proof",
    pack.noExternalSideEffectProof,
    "",
    "## Next Action",
    pack.nextAction,
  ].join("\n");
}

function atlasValidationCommandPack(
  pack: Omit<VentureAtlasValidationCommandPack, "markdown">,
): VentureAtlasValidationCommandPack {
  return {
    ...pack,
    markdown: atlasValidationCommandPackMarkdown(pack),
  };
}

function atlasValidationCommandPackStatusFor(
  atlasItem: VentureOverlookedOpportunityAtlasItem,
): VentureAtlasValidationCommandPackStatus {
  if (atlasItem.status === "blocked") return "blocked";
  if (atlasItem.status === "needs-source") return "needs-source";
  if (atlasItem.status === "ranked-ready" && atlasItem.rankScore >= 60) return "ready";
  return "needs-approval";
}

function atlasValidationCommandPackPriorityFor(
  status: VentureAtlasValidationCommandPackStatus,
  rankScore: number,
): VentureAtlasValidationCommandPackPriority {
  if (status === "blocked") return "critical";
  if (rankScore >= 80) return "critical";
  if (rankScore >= 65) return "high";
  if (rankScore >= 45) return "medium";
  return "low";
}

export function buildVentureAtlasValidationCommandPacks(
  ventures: SavedVentureWorkspace[],
): VentureAtlasValidationCommandPack[] {
  const atlas = buildVentureOverlookedOpportunityAtlas(ventures);
  if (atlas.length === 0) return [];

  const ventureById = new Map(ventures.map((venture) => [venture.id, venture] as const));
  const perVentureCounts = new Map<string, number>();
  const packs: VentureAtlasValidationCommandPack[] = [];

  for (const atlasItem of atlas) {
    const venture = ventureById.get(atlasItem.ventureId);
    if (!venture) continue;
    const used = perVentureCounts.get(atlasItem.ventureId) ?? 0;
    if (used >= 6) continue;
    perVentureCounts.set(atlasItem.ventureId, used + 1);

    const status = atlasValidationCommandPackStatusFor(atlasItem);
    const priority = atlasValidationCommandPackPriorityFor(status, atlasItem.rankScore);
    const hypothesis = `If we serve "${atlasItem.targetBuyer}" with "${atlasItem.hiddenWedge}" against pain "${atlasItem.painStatement}", local saved evidence will show qualified demand within the success thresholds; otherwise we treat this overlooked opportunity as falsified.`;
    const validationCommand = atlasItem.cheapInternalTestCommand;
    const manualResultFields = [
      `Qualified buyers matching "${atlasItem.targetBuyer}" interviewed or observed in saved evidence.`,
      `Hidden-wedge resonance count (qualified buyers that confirmed "${atlasItem.hiddenWedge}" beats the current substitute).`,
      `Pain-statement confirmation count ("${atlasItem.painStatement}") with at least one paraphrased quote.`,
      `Pricing willingness signal (acknowledged paid commitment range from saved pricing signals or interviews).`,
      `Source-backed objection count and the strongest objection summary.`,
    ];
    const manualResultThresholds = [
      "Success threshold: 5 source-backed qualified buyers confirm the pain and the hidden-wedge resonance within the cheap internal test window.",
      "Failure threshold: fewer than 2 qualified buyers confirm the pain or hidden wedge after the cheap internal test window.",
      "Pivot threshold: 2-4 qualified buyers confirm a different buyer, pain, wedge, or pricing band than the atlas hypothesis.",
      "All thresholds require source-backed local evidence; vanity interest or unsourced anecdotes do not count.",
    ];
    const successCriteria = `At least 5 source-backed qualified buyers confirm both "${atlasItem.painStatement}" and "${atlasItem.hiddenWedge}" within the cheap internal validation window, and at least 1 pricing signal supports the proposed wedge.`;
    const failureCriteria = `Fewer than 2 source-backed qualified buyers confirm the pain or hidden wedge within the cheap internal validation window, or the strongest objection is unresolved and source-backed.`;
    const pivotCriteria = `Between 2 and 4 source-backed qualified buyers confirm a different buyer, pain, wedge, or pricing band than the atlas hypothesis — pivot the wedge or target buyer before promoting this atlas item to a new saved venture.`;
    const demandDriftUpdateInstruction = `After capturing the manual result fields locally, re-run \`buildVentureDemandDriftReport\` for saved venture "${venture.title}" via the in-app Venture Lab summary and update the demand drift report so the recorded actual demand reflects the new source-backed evidence rather than the prior baseline.`;
    const sourceProvenance = [
      `Atlas item ${atlasItem.id} sourced from ${atlasItem.sourceArtifactLabel}`,
      ...atlasItem.sourceProvenance.slice(0, 4),
    ].filter(Boolean);
    const ownerSegment = atlasItem.owner || ventureLearningOwnerFor(venture);
    const approvalGates = [
      `${ATLAS_VALIDATION_APPROVAL_GATES[0]} Atlas owner: ${ownerSegment}.`,
      ATLAS_VALIDATION_APPROVAL_GATES[1],
      ATLAS_VALIDATION_APPROVAL_GATES[2],
    ];

    packs.push(atlasValidationCommandPack({
      id: `${atlasItem.id}-atlas-validation-pack`,
      ventureId: venture.id,
      title: `Validate atlas wedge: ${atlasItem.title}`,
      atlasItemId: atlasItem.id,
      atlasItemTitle: atlasItem.title,
      atlasSourceArtifactId: atlasItem.sourceArtifactId,
      atlasSourceArtifactLabel: atlasItem.sourceArtifactLabel,
      sourceType: atlasItem.sourceType,
      status,
      priority,
      rankScore: atlasItem.rankScore,
      confidenceScore: atlasItem.confidenceScore,
      noveltyScore: atlasItem.noveltyScore,
      owner: ownerSegment,
      targetBuyer: atlasItem.targetBuyer,
      hiddenWedge: atlasItem.hiddenWedge,
      hypothesis,
      cheapInternalValidationCommand: validationCommand,
      manualResultFields,
      manualResultThresholds,
      successCriteria,
      failureCriteria,
      pivotCriteria,
      demandDriftUpdateInstruction,
      sourceProvenance,
      humanReviewBoundary: ATLAS_VALIDATION_HUMAN_REVIEW_BOUNDARY,
      noExternalSideEffectProof: ATLAS_VALIDATION_NO_EXTERNAL_SIDE_EFFECT_PROOF,
      approvalGates,
      nextAction: status === "needs-source"
        ? `Attach a saved source URL or quote for "${atlasItem.title}" before approving this validation pack.`
        : status === "blocked"
          ? `Resolve the atlas blocker for "${atlasItem.title}" before approving this validation pack.`
          : `Operator must approve running the cheap internal validation command, then capture manual result fields locally and update the demand drift report.`,
    }));
  }

  const priorityRank: Record<VentureAtlasValidationCommandPackPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureAtlasValidationCommandPackStatus, number> = {
    blocked: 4,
    "needs-source": 3,
    "needs-approval": 2,
    ready: 1,
  };

  return packs
    .sort((a, b) => (
      priorityRank[b.priority] - priorityRank[a.priority] ||
      b.rankScore - a.rankScore ||
      statusRank[b.status] - statusRank[a.status] ||
      a.title.localeCompare(b.title)
    ))
    .slice(0, 60);
}

function atlasValidationResultLedgerMarkdown(
  item: Omit<VentureAtlasValidationResultLedgerItem, "markdown">,
): string {
  return [
    `# Atlas Validation Result: ${item.atlasItemTitle}`,
    `Venture: ${item.ventureTitle}`,
    `Outcome: ${item.outcome}`,
    `Demand drift score: ${item.demandDriftScore}/100`,
    `Recorded at: ${item.recordedAt}`,
    `Owner: ${item.owner}`,
    "",
    "## Source Pack",
    item.sourcePackTitle,
    "",
    "## Manual Result",
    `Qualified buyers: ${item.qualifiedBuyerCount}`,
    `Pain confirmations: ${item.painConfirmationCount}`,
    `Hidden-wedge resonance: ${item.hiddenWedgeResonanceCount}`,
    `Paid pricing signals: ${item.paidPricingSignalCount}`,
    "",
    "## Strongest Quote",
    item.strongestQuote,
    "",
    "## Strongest Objection",
    item.strongestObjection,
    "",
    "## Evidence Note",
    item.evidenceNote,
    "",
    "## Learning",
    item.learning,
    "",
    "## Demand Drift Update",
    item.demandDriftUpdate,
    "",
    "## No External Side Effect Proof",
    item.noExternalSideEffectProof,
    "",
    "## Next Action",
    item.nextAction,
  ].join("\n");
}

function atlasValidationResultLedgerItem(
  item: Omit<VentureAtlasValidationResultLedgerItem, "markdown">,
): VentureAtlasValidationResultLedgerItem {
  return {
    ...item,
    markdown: atlasValidationResultLedgerMarkdown(item),
  };
}

export function buildVentureAtlasValidationResultLedger(
  ventures: SavedVentureWorkspace[],
): VentureAtlasValidationResultLedgerItem[] {
  const packs = buildVentureAtlasValidationCommandPacks(ventures);
  const packById = new Map(packs.map((pack) => [pack.id, pack] as const));

  return ventures.flatMap((venture) => (
    venture.atlasValidationResults.map((result) => {
      const pack = packById.get(result.atlasValidationPackId);
      const statusSummary = `${result.outcome}: ${result.qualifiedBuyerCount} qualified buyers, ${result.hiddenWedgeResonanceCount} hidden-wedge confirmations, ${result.paidPricingSignalCount} paid pricing signals.`;
      return atlasValidationResultLedgerItem({
        ...result,
        ventureId: venture.id,
        ventureTitle: venture.title,
        sourcePackTitle: pack?.title ?? `Missing source pack ${result.atlasValidationPackId}`,
        statusSummary,
        demandDriftUpdate: `Demand drift now includes this atlas-validation result at ${result.demandDriftScore}/100; rerun the portfolio summary before deciding continue, pivot, or kill.`,
      });
    })
  )).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)).slice(0, 200);
}

function productBuildCommandRunMarkdown(item: Omit<VentureProductBuildCommandRunLedgerItem, "markdown">): string {
  return [
    `# Product Build Command Run: ${item.commandTitle}`,
    `Venture: ${item.ventureTitle} (${item.ventureId})`,
    `Command: ${item.commandId}`,
    `Source: ${item.sourceType} (${item.sourceArtifactLabel})`,
    `Run state: ${item.runState}`,
    `Command status: ${item.commandStatus}`,
    `Recorded at: ${item.recordedAt}`,
    `Owner: ${item.owner}`,
    `App: ${item.appName}`,
    "",
    "## Build Command",
    item.buildCommand,
    "",
    "## Artifact Target",
    item.artifactTarget,
    "",
    "## Run Proof",
    item.runProof,
    "",
    "## Local Artifact Proof",
    item.localArtifactProof,
    "",
    "## Verifier Report Proof",
    item.verifierReportProof,
    "",
    "## Required Proof",
    item.proofRequired,
    "",
    "## No-Fake-Source Boundary",
    item.noFakeSourceBoundary,
    "",
    "## No External Side Effect Proof",
    item.noExternalSideEffectProof,
    "",
    "## Learning",
    item.learning,
    "",
    "## Evidence",
    ...(item.evidence.length > 0 ? item.evidence.map((line) => `- ${line}`) : ["- No evidence attached."]),
  ].join("\n");
}

function productBuildCommandRunLedgerItem(
  item: Omit<VentureProductBuildCommandRunLedgerItem, "markdown">,
): VentureProductBuildCommandRunLedgerItem {
  return {
    ...item,
    markdown: productBuildCommandRunMarkdown(item),
  };
}

export function buildVentureProductBuildCommandRunLedger(
  ventures: SavedVentureWorkspace[],
): VentureProductBuildCommandRunLedgerItem[] {
  const commands = buildVentureProductBuildCommandQueue(ventures);
  const commandById = new Map(commands.map((command) => [command.id, command] as const));

  return ventures.flatMap((venture) => (
    venture.productBuildCommandRuns.map((run) => {
      const command = commandById.get(run.commandId);
      const statusSummary = `${run.runState}: ${run.runProof}`;
      return productBuildCommandRunLedgerItem({
        ...run,
        ventureId: venture.id,
        ventureTitle: venture.title,
        commandStatus: command?.status ?? "missing-command",
        proofRequired: command?.proofRequired ?? run.verifierReportProof,
        noFakeSourceBoundary: command?.noFakeSourceBoundary ?? "Original product-build command is missing; do not treat this run as promoted until the command is restored.",
        statusSummary,
      });
    })
  )).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)).slice(0, 200);
}

function mvpReleaseWorkspaceMarkdown(ws: Omit<VentureMvpReleaseWorkspace, "markdown">): string {
  return [
    `# Executable MVP Release Workspace: ${ws.title}`,
    `Venture: ${ws.ventureId}`,
    `Status: ${ws.status}`,
    `App: ${ws.appName}`,
    `Source path: ${ws.sourcePath}`,
    `Owner: ${ws.owner}`,
    "",
    "## Chosen Run",
    `Run ID: ${ws.chosenRunId || "none"}`,
    `Run state: ${ws.chosenRunState}`,
    `Product build command: ${ws.productBuildCommandId || "none"}`,
    "",
    "## Verifier Report Proof",
    ws.verifierReportProof,
    "",
    "## QA Proof",
    ws.qaProof,
    `QA status: ${ws.qaStatus}`,
    `Generated app proof status: ${ws.generatedAppProofStatus}`,
    "",
    "## Commands",
    `Setup: ${ws.setupCommand}`,
    `Test: ${ws.testCommand}`,
    `Build: ${ws.buildCommand}`,
    `Browser smoke: ${ws.browserSmokeCommand}`,
    "",
    "## No-Deploy Release Boundary",
    ws.noDeployBoundary,
    "",
    "## No External Side Effect Proof",
    ws.noExternalSideEffectProof,
    "",
    "## Next Actions",
    ...(ws.nextActions.length > 0 ? ws.nextActions.map((a) => `- ${a}`) : ["- None."]),
    "",
    "## Evidence",
    ...(ws.evidence.length > 0 ? ws.evidence.map((e) => `- ${e}`) : ["- No evidence attached."]),
  ].join("\n");
}

export function buildVentureMvpReleaseWorkspace(venture: SavedVentureWorkspace): VentureMvpReleaseWorkspace {
  const proof = buildVentureGeneratedAppVerificationProof(venture);
  const qaReport = buildVentureQaReleaseReport(venture);
  const handoff = buildVentureGeneratedAppHandoff(venture);
  const scaffold = buildVentureGeneratedAppSourceScaffold(venture);
  const commands = buildVentureProductBuildCommandQueue([venture]);

  const runs = venture.productBuildCommandRuns;
  const promotedRun = runs.find((r) => r.runState === "promoted");
  const executedRun = runs.find((r) => r.runState === "executed" || r.runState === "imported");
  const chosenRun = promotedRun ?? executedRun ?? null;
  const command = (chosenRun ? commands.find((candidate) => candidate.id === chosenRun.commandId) : undefined) ?? commands[0];

  const appName = handoff.appName || scaffold.appName || proof.appName || slugifySegment(venture.title);
  const sourcePath = chosenRun?.localArtifactProof || proof.targetPath || handoff.repoPath || scaffold.localTargetPath || "No source path attached yet.";
  const verifierReportProof = chosenRun?.verifierReportProof || proof.proofSummary || "No verifier report proof attached yet.";
  const qaProof = qaReport.artifactSummary || "No QA proof attached yet.";

  const hasRunProof = !!chosenRun;
  const hasQaProof = qaReport.status === "ready";
  const hasVerifierProof = proof.status === "verified" || Boolean(chosenRun?.verifierReportProof.trim());

  let status: VentureMvpReleaseWorkspaceStatus;
  if (proof.status === "blocked" || qaReport.status === "blocked") {
    status = "blocked";
  } else if (!hasRunProof || !hasVerifierProof) {
    status = "needs-run-proof";
  } else if (!hasQaProof) {
    status = "needs-qa-proof";
  } else if (hasVerifierProof && hasRunProof && hasQaProof) {
    status = "release-ready";
  } else {
    status = "blocked";
  }

  const verificationCommands = handoff.verificationCommands;
  const setupCommand = verificationCommands.find((c) => /setup|install/i.test(c)) || command?.buildCommand.split("&&")[0]?.trim() || "No setup command defined.";
  const testCommand = verificationCommands.find((c) => /test/i.test(c)) || "No test command defined.";
  const buildCommand = verificationCommands.find((c) => /build/i.test(c)) || command?.buildCommand || "No build command defined.";
  const browserSmokeCommand = verificationCommands.find((c) => /browser|smoke|playwright/i.test(c)) || "No browser smoke command defined.";

  const noDeployBoundary = qaReport.deploymentBoundary || handoff.deploymentBoundary || "No deploy; no external publish; no billing change until human-approved deployment step.";
  const noExternalSideEffectProof = chosenRun?.noExternalSideEffectProof || "No external side effects: no deploy, no send, no spend, no contact, no billing change.";

  const nextActions: string[] = [];
  if (!hasRunProof) nextActions.push("Record a product-build command run (executed, imported, or promoted) with verifier proof.");
  if (!hasQaProof) nextActions.push("Complete QA release checklist and attach QA proof.");
  if (!hasVerifierProof) nextActions.push("Attach verifier report proof to the run record.");
  if (nextActions.length === 0) nextActions.push("Release workspace is ready. Proceed with human-approved deployment proposal.");

  const evidence: string[] = [
    `Proof status: ${proof.status}`,
    `QA status: ${qaReport.status}`,
    ...(chosenRun ? [`Chosen run: ${chosenRun.runState} recorded ${chosenRun.recordedAt}`] : []),
    ...(qaReport.checklist.slice(0, 3)),
    ...(proof.nextActions.slice(0, 2)),
  ];

  const id = `${venture.id}-mvp-release-workspace`;
  const wsWithoutMarkdown: Omit<VentureMvpReleaseWorkspace, "markdown"> = {
    id,
    ventureId: venture.id,
    title: `${venture.title} MVP Release Workspace`,
    status,
    appName,
    sourcePath,
    verifierReportProof,
    qaProof,
    chosenRunId: chosenRun?.id ?? "",
    chosenRunState: chosenRun?.runState ?? "none",
    productBuildCommandId: command?.id ?? "",
    generatedAppProofStatus: proof.status,
    qaStatus: qaReport.status,
    owner: chosenRun?.owner || command?.owner || venture.title,
    setupCommand,
    testCommand,
    buildCommand,
    browserSmokeCommand,
    noDeployBoundary,
    noExternalSideEffectProof,
    nextActions,
    evidence,
  };

  return {
    ...wsWithoutMarkdown,
    markdown: mvpReleaseWorkspaceMarkdown(wsWithoutMarkdown),
  };
}

export function buildVentureMvpReleaseWorkspaceList(ventures: SavedVentureWorkspace[]): VentureMvpReleaseWorkspace[] {
  return ventures.map(buildVentureMvpReleaseWorkspace);
}

function pilotCohortSignalGateMarkdown(gate: Omit<VenturePilotCohortSignalGate, "markdown">): string {
  return [
    `# Pilot Cohort Signal Gate: ${gate.ventureTitle}`,
    `Venture: ${gate.ventureId}`,
    `Status: ${gate.status}`,
    `Priority: ${gate.priority}`,
    `Owner: ${gate.owner}`,
    "",
    "## Release Workspace",
    `Release workspace ID: ${gate.releaseWorkspaceId || "none"}`,
    `Release workspace status: ${gate.releaseWorkspaceStatus}`,
    `App: ${gate.appName}`,
    `Source path: ${gate.sourcePath}`,
    "",
    "## Cohort Signal",
    `Cohort label: ${gate.cohortLabel}`,
    `Inbound signal source: ${gate.inboundSignalSource}`,
    `Local capture command: ${gate.localCaptureCommand}`,
    "",
    "## Activation Cohort Draft",
    `Signup target: ${gate.activationCohortDraft.signupTarget}`,
    `Activated target: ${gate.activationCohortDraft.activatedTarget}`,
    `Retained target: ${gate.activationCohortDraft.retainedTarget}`,
    `Paid target: ${gate.activationCohortDraft.paidTarget}`,
    `Revenue target: ${gate.activationCohortDraft.revenueTarget}`,
    `Support target: ${gate.activationCohortDraft.supportTarget}`,
    "",
    "## Demand Capture Proof Draft",
    gate.demandCaptureProofDraft,
    `Qualified demand metric: ${gate.qualifiedDemandMetric}`,
    "",
    "## No-Send Boundary",
    gate.noSendBoundary,
    "",
    "## No-Deploy Boundary",
    gate.noDeployBoundary,
    "",
    "## No External Side Effect Proof",
    gate.noExternalSideEffectProof,
    "",
    "## Next Action",
    gate.nextAction,
    "",
    "## Evidence",
    ...(gate.evidence.length > 0 ? gate.evidence.map((e) => `- ${e}`) : ["- No evidence attached."]),
  ].join("\n");
}

export function buildVenturePilotCohortSignalGate(venture: SavedVentureWorkspace): VenturePilotCohortSignalGate {
  const releaseWorkspace = buildVentureMvpReleaseWorkspace(venture);
  const activationCohorts = venture.activationCohorts;
  const pricingSignals = venture.pricingSignals;
  const moneySignals = venture.moneySignals;
  const customerInterviews = venture.customerInterviews;

  const hasRunProof = releaseWorkspace.chosenRunState !== "none";
  const releaseWorkspaceBlocked = releaseWorkspace.status === "blocked";

  const hasActivationCohort = activationCohorts.length > 0;
  const hasPricingSignal = pricingSignals.length > 0;
  const hasMoneySignal = moneySignals.length > 0;
  const hasInterview = customerInterviews.length > 0;
  const hasInboundSignal = hasActivationCohort || hasPricingSignal || hasMoneySignal || hasInterview;

  let status: VenturePilotCohortSignalGateStatus;
  if (releaseWorkspaceBlocked) {
    status = "blocked";
  } else if (!hasRunProof) {
    status = "needs-release-workspace";
  } else if (!hasInboundSignal) {
    status = "needs-inbound-signal";
  } else {
    status = "ready";
  }

  const latestCohort = activationCohorts[0];
  const cohortLabel = latestCohort?.cohortLabel || `${venture.title} Pilot Cohort`;

  const inboundSignalSources: string[] = [];
  if (hasActivationCohort) inboundSignalSources.push(`activation cohort: ${latestCohort?.cohortLabel}`);
  if (hasPricingSignal) inboundSignalSources.push(`pricing signal: ${pricingSignals[0]?.acceptedPrice || "WTP recorded"}`);
  if (hasMoneySignal) inboundSignalSources.push(`money signal: ${moneySignals[0]?.type || "signal recorded"}`);
  if (hasInterview) inboundSignalSources.push(`interview: ${customerInterviews[0]?.persona || "persona recorded"}`);
  const inboundSignalSource = inboundSignalSources.length > 0
    ? inboundSignalSources.join("; ")
    : "No inbound signal captured yet. Use local capture command to record manual inbound interest.";

  const appName = releaseWorkspace.appName;
  const sourcePath = releaseWorkspace.sourcePath;

  const localCaptureCommand = releaseWorkspace.setupCommand !== "No setup command defined."
    ? `${releaseWorkspace.setupCommand} && printf 'Record pilot signups locally only; do not deploy, send, contact, spend, or change billing.'`
    : "pnpm dev # run locally, record pilot signups in local storage without any deploy or send";

  const signupTarget = latestCohort ? `Target: ${latestCohort.signupCount + 3} signups (current: ${latestCohort.signupCount})` : "Target: ≥3 manual signups from local run or waitlist form without deploy";
  const activatedTarget = latestCohort ? `Target: ${Math.max(1, Math.ceil(latestCohort.activatedCount))} activated (current: ${latestCohort.activatedCount})` : "Target: ≥1 pilot user completes core activation event";
  const retainedTarget = latestCohort ? `Retained: ${latestCohort.retainedCount} / ${latestCohort.activatedCount} activated` : "Target: ≥1 pilot user returns within retention window";
  const paidTarget = latestCohort ? `Paid: ${latestCohort.paidCount} users / ${formatCents(latestCohort.revenueCents)} revenue` : "Target: ≥1 paid commitment or invoice request from pilot cohort";
  const revenueTarget = latestCohort ? `Revenue: $${(latestCohort.revenueCents / 100).toFixed(2)} recorded` : "Target: record any revenue or paid commitment evidence";
  const supportTarget = latestCohort ? `Support issues: ${latestCohort.supportIssueCount}` : "Target: track all support questions from pilot cohort";

  const demandCaptureProofDraft = hasInboundSignal
    ? `Demand proof draft: ${inboundSignalSource}. Local capture command available. No deploy, no send, no external contact occurred.`
    : "Demand proof draft: pending. Run local capture command and record manual inbound pilot signups before advancing to external demand capture.";

  const qualifiedDemandMetric = hasPricingSignal
    ? `Qualified demand: ${pricingSignals.length} pricing signal(s) recorded`
    : hasMoneySignal
      ? `Qualified demand: ${moneySignals.filter((s) => s.status === "committed" || s.status === "received").length} committed/received money signal(s)`
      : hasActivationCohort
        ? `Qualified demand: ${activationCohorts.reduce((sum, c) => sum + c.activatedCount, 0)} activated users across ${activationCohorts.length} cohort(s)`
        : "Qualified demand metric: not yet measured. Record pilot signups and activation events to generate first qualified metric.";

  const noSendBoundary = "No email, no SMS, no push notification, no outreach, no contact with any person outside this operator session. All signal capture is local-only.";
  const noDeployBoundary = releaseWorkspace.noDeployBoundary;
  const noExternalSideEffectProof = releaseWorkspace.noExternalSideEffectProof;

  let nextAction: string;
  if (status === "blocked") {
    nextAction = "Unblock the MVP release workspace before advancing the pilot cohort signal gate.";
  } else if (status === "needs-release-workspace") {
    nextAction = "Record a product-build command run with verifier proof to unlock the pilot cohort signal gate.";
  } else if (status === "needs-inbound-signal") {
    nextAction = `Run local capture command without deploying: ${localCaptureCommand}. Record ≥1 manual pilot signup or activation event.`;
  } else {
    nextAction = "Gate is ready. Record pilot cohort data from local run and advance to activation cohort tracking. No deploy, no send, no external contact.";
  }

  let priority: VenturePilotCohortSignalGatePriority;
  if (status === "blocked") {
    priority = "high";
  } else if (status === "ready") {
    priority = hasActivationCohort && hasPricingSignal ? "critical" : "high";
  } else {
    priority = "medium";
  }

  const evidence: string[] = [
    `Release workspace status: ${releaseWorkspace.status}`,
    `Run proof: ${hasRunProof ? releaseWorkspace.chosenRunState : "none"}`,
    `Activation cohorts: ${activationCohorts.length}`,
    `Pricing signals: ${pricingSignals.length}`,
    `Money signals: ${moneySignals.length}`,
    `Customer interviews: ${customerInterviews.length}`,
    ...(latestCohort ? [`Latest cohort: ${latestCohort.cohortLabel} (${latestCohort.signupCount} signups, ${latestCohort.activatedCount} activated)`] : []),
  ];

  const id = `${venture.id}-pilot-cohort-signal-gate`;
  const gateWithoutMarkdown: Omit<VenturePilotCohortSignalGate, "markdown"> = {
    id,
    ventureId: venture.id,
    ventureTitle: venture.title,
    status,
    priority,
    owner: releaseWorkspace.owner,
    releaseWorkspaceId: releaseWorkspace.id,
    releaseWorkspaceStatus: releaseWorkspace.status,
    appName,
    sourcePath,
    cohortLabel,
    inboundSignalSource,
    localCaptureCommand,
    activationCohortDraft: {
      signupTarget,
      activatedTarget,
      retainedTarget,
      paidTarget,
      revenueTarget,
      supportTarget,
    },
    demandCaptureProofDraft,
    qualifiedDemandMetric,
    noSendBoundary,
    noDeployBoundary,
    noExternalSideEffectProof,
    nextAction,
    evidence,
  };

  return {
    ...gateWithoutMarkdown,
    markdown: pilotCohortSignalGateMarkdown(gateWithoutMarkdown),
  };
}

export function buildVenturePilotCohortSignalGates(ventures: SavedVentureWorkspace[]): VenturePilotCohortSignalGate[] {
  return ventures.map(buildVenturePilotCohortSignalGate);
}

function noSendEmailGateMarkdown(item: Omit<VentureNoSendEmailGateWorkItem, "markdown">): string {
  return [
    `# No-Send Email Gate Work Item: ${item.ventureTitle}`,
    `Status: ${item.status}`,
    `Priority: ${item.priority}`,
    `Owner: ${item.owner}`,
    `Source: ${item.sourceArtifactLabel}`,
    `Cohort: ${item.cohortLabel}`,
    "",
    "## Recipient Placeholders",
    ...item.recipientPlaceholders.map((recipient) => `- ${recipient}`),
    "",
    "## Draft Subject",
    item.draftSubject,
    "",
    "## Draft Body",
    item.draftBody,
    "",
    "## Review Checklist",
    ...item.reviewChecklist.map((check) => `- [ ] ${check}`),
    "",
    "## Replay Command",
    item.replayCommand,
    "",
    "## Human Approval Boundary",
    item.humanApprovalBoundary,
    "",
    "## No-Send Boundary",
    item.noSendBoundary,
    "",
    "## No-Deploy Boundary",
    item.noDeployBoundary,
    "",
    "## No External Side Effect Proof",
    item.noExternalSideEffectProof,
    "",
    "## Evidence",
    ...item.evidence.map((evidence) => `- ${evidence}`),
    "",
    "## Reply Proof Receipts",
    ...(item.replyProofReceipts.length > 0
      ? item.replyProofReceipts.map((receipt) => (
        `- ${receipt.proofType}: ${receipt.sourceLabel}; ${receipt.proofMetric}; ${receipt.summary}; ${receipt.duplicateHint}`
      ))
      : ["- No no-send reply proof has been converted yet."]),
    "",
    "## Reply Proof Dedupe",
    item.replyProofDedupeHint,
    "",
    "## Next Action",
    item.nextAction,
  ].join("\n");
}

const NO_SEND_REPLY_PROOF_PREFIX = "No-send email gate reply proof from ";
const NO_SEND_REPLY_NOTE_PREFIX = "Manual redacted reply note: ";
const NO_SEND_REPLY_CONSENT_PREFIX = " Consent evidence:";

function normalizedNoSendReplyProofDedupeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function noSendEmailGateReplyDedupeKey(
  workItemId: string,
  proofType: VentureNoSendEmailGateReplyProofType,
  redactedReplyNote: string,
) {
  return `${workItemId}:${proofType}:${normalizedNoSendReplyProofDedupeText(redactedReplyNote)}`;
}

function evidenceHasNoSendReplyProofFor(evidence: string | undefined, workItemId: string) {
  return Boolean(evidence?.includes(`${NO_SEND_REPLY_PROOF_PREFIX}${workItemId}.`));
}

function evidenceHasAnyNoSendReplyProof(evidence: string | undefined) {
  return Boolean(evidence?.includes(NO_SEND_REPLY_PROOF_PREFIX));
}

function extractNoSendReplyProofNote(evidence: string | undefined) {
  if (!evidence) return "";
  const noteStart = evidence.indexOf(NO_SEND_REPLY_NOTE_PREFIX);
  if (noteStart < 0) return "";
  const start = noteStart + NO_SEND_REPLY_NOTE_PREFIX.length;
  const consentStart = evidence.indexOf(NO_SEND_REPLY_CONSENT_PREFIX, start);
  const end = consentStart >= 0 ? consentStart : evidence.length;
  return evidence.slice(start, end).trim();
}

function buildNoSendEmailGateReplyProofReceipts(
  venture: SavedVentureWorkspace,
  workItemId: string,
): VentureNoSendEmailGateReplyProofReceipt[] {
  const duplicateHint = "Review this receipt before recording another reply; exact duplicate redacted notes for this proof type are rejected.";
  const noSendProof = "Receipt only; no email was sent, no real recipient was stored, and no deploy, spend, tracking, contact, or billing change occurred.";
  const receipts: VentureNoSendEmailGateReplyProofReceipt[] = [];

  venture.customerInterviews
    .filter((interview) => evidenceHasNoSendReplyProofFor(interview.evidenceNote, workItemId))
    .forEach((interview) => {
      const redactedReplyNote = extractNoSendReplyProofNote(interview.evidenceNote) || interview.painQuote;
      receipts.push({
        id: `${interview.id}-no-send-reply-receipt`,
        proofType: "customer-interview",
        sourceRecordId: interview.id,
        sourceLabel: `Customer interview: ${interview.persona}`,
        recordedAt: interview.interviewedAt,
        owner: interview.persona,
        redactedReplyNote,
        summary: interview.painQuote,
        proofMetric: `Sentiment ${interview.sentiment}`,
        dedupeKey: noSendEmailGateReplyDedupeKey(workItemId, "customer-interview", redactedReplyNote),
        duplicateHint,
        noSendProof,
      });
    });

  venture.pricingSignals
    .filter((signal) => evidenceHasNoSendReplyProofFor(signal.evidenceNote, workItemId))
    .forEach((signal) => {
      const redactedReplyNote = extractNoSendReplyProofNote(signal.evidenceNote) || signal.evidenceNote;
      receipts.push({
        id: `${signal.id}-no-send-reply-receipt`,
        proofType: "pricing-signal",
        sourceRecordId: signal.id,
        sourceLabel: `Pricing signal: ${signal.acceptedPrice || signal.pricingHypothesis}`,
        recordedAt: signal.recordedAt,
        owner: "pricing-owner",
        redactedReplyNote,
        summary: signal.objectionSummary,
        proofMetric: `${signal.paidCommitmentCount} paid / ${signal.qualifiedBuyerCount} qualified / ${signal.invoiceRequestCount} invoice`,
        dedupeKey: noSendEmailGateReplyDedupeKey(workItemId, "pricing-signal", redactedReplyNote),
        duplicateHint,
        noSendProof,
      });
    });

  venture.riskRecords
    .filter((risk) => risk.sourceRecordId === workItemId || evidenceHasNoSendReplyProofFor(risk.detail, workItemId))
    .forEach((risk) => {
      const redactedReplyNote = extractNoSendReplyProofNote(risk.detail) || risk.detail;
      receipts.push({
        id: `${risk.id}-no-send-reply-receipt`,
        proofType: "risk",
        sourceRecordId: risk.id,
        sourceLabel: `Risk: ${risk.title}`,
        recordedAt: risk.createdAt,
        owner: risk.owner,
        redactedReplyNote,
        summary: risk.detail,
        proofMetric: `${risk.severity} / ${risk.status}`,
        dedupeKey: noSendEmailGateReplyDedupeKey(workItemId, "risk", redactedReplyNote),
        duplicateHint,
        noSendProof,
      });
    });

  venture.activationCohorts
    .filter((cohort) => evidenceHasNoSendReplyProofFor(cohort.evidence, workItemId))
    .forEach((cohort) => {
      const redactedReplyNote = extractNoSendReplyProofNote(cohort.evidence) || cohort.activationEvent;
      receipts.push({
        id: `${cohort.id}-no-send-reply-receipt`,
        proofType: "activation-cohort",
        sourceRecordId: cohort.id,
        sourceLabel: `Activation cohort: ${cohort.cohortLabel}`,
        recordedAt: cohort.recordedAt,
        owner: cohort.owner,
        redactedReplyNote,
        summary: cohort.activationEvent,
        proofMetric: `${cohort.signupCount} signup / ${cohort.activatedCount} activated / ${cohort.paidCount} paid`,
        dedupeKey: noSendEmailGateReplyDedupeKey(workItemId, "activation-cohort", redactedReplyNote),
        duplicateHint,
        noSendProof,
      });
    });

  return receipts.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

function noSendEmailGateReplyProofDedupeHint(receipts: VentureNoSendEmailGateReplyProofReceipt[]) {
  if (receipts.length === 0) {
    return "No converted reply proof yet; record only redacted, manually reviewed replies and keep recipients outside the app.";
  }
  const proofTypes = Array.from(new Set(receipts.map((receipt) => receipt.proofType))).join(", ");
  return `${receipts.length} converted reply proof receipt${receipts.length === 1 ? "" : "s"} recorded (${proofTypes}). Review receipts before saving another reply; exact duplicate redacted notes for the same proof type are rejected.`;
}

export function buildVentureNoSendEmailGateWorklist(
  ventures: SavedVentureWorkspace[],
): VentureNoSendEmailGateWorkItem[] {
  const priorityRank: Record<VentureNoSendEmailGatePriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureNoSendEmailGateStatus, number> = {
    "draft-ready": 3,
    blocked: 2,
    "needs-pilot-gate": 1,
  };

  return ventures.map((venture) => {
    const gate = buildVenturePilotCohortSignalGate(venture);
    const openHighRisks = venture.riskRecords.filter((risk) => (
      risk.status !== "resolved" &&
      (risk.severity === "high" || risk.severity === "critical")
    ));
    const latestApproval = venture.outreachApprovals[0];
    const persona = latestApproval?.contactPersona || venture.targetBuyer;
    const channel = latestApproval?.channel || "manual no-send email draft";
    const status: VentureNoSendEmailGateStatus = gate.status === "blocked" || openHighRisks.length > 0
      ? "blocked"
      : gate.status === "ready"
        ? "draft-ready"
        : "needs-pilot-gate";
    const priority: VentureNoSendEmailGatePriority = status === "draft-ready"
      ? (venture.activationCohorts.length === 0 ? "critical" : "high")
      : status === "blocked"
        ? "high"
        : "medium";
    const recipientPlaceholders = Array.from(new Set([
      `${persona} pilot cohort placeholder`,
      `${gate.cohortLabel} manual signup slot`,
      "Operator-supplied consented recipient only after separate human approval",
    ])).slice(0, 4);
    const draftSubject = `Manual pilot check: ${venture.title}`;
    const draftBody = [
      "DRAFT ONLY - DO NOT SEND FROM THIS APP.",
      `Hi ${persona}, we are manually testing ${venture.productWedge} for ${venture.painStatement}`,
      `If this is urgent this week, would you review a local-only pilot walkthrough for ${gate.cohortLabel}?`,
      "No account creation, payment, production deploy, tracking pixel, or automated follow-up happens from this draft.",
      "A human owner must rewrite, review consent language, and record separate outreach approval before any manual send outside this app.",
    ].join("\n\n");
    const reviewChecklist = [
      `Confirm pilot gate status is draftable: ${gate.status}.`,
      `Confirm inbound proof source before writing to any person: ${gate.inboundSignalSource}.`,
      "Replace every placeholder with a consented recipient outside this app only after separate human outreach approval.",
      "Keep opt-out, scope, privacy, and no-payment language in the human-reviewed message.",
      "Record replies back as interviews, pricing signals, activation cohorts, or risks before claiming demand.",
    ];
    const replayCommand = `Open Venture Lab, search "no-send email gate", inspect ${venture.id}, and record a human-approved outreach approval only after this draft is manually reviewed outside the app.`;
    const humanApprovalBoundary = latestApproval
      ? `${latestApproval.approvalLevel} currently recorded as ${latestApproval.status}; this work item still does not send email.`
      : "No human-approved outreach is attached. This work item is an internal draft only and cannot be treated as permission to contact anyone.";
    const noSendBoundary = "No email, SMS, push notification, DM, webhook, API send, or external contact is executed by this worklist. It only renders an internal draft.";
    const noDeployBoundary = gate.noDeployBoundary;
    const noExternalSideEffectProof = `${gate.noExternalSideEffectProof} Email gate adds no send, no contact, no spend, no deploy, no tracking, no billing change, and no recipient persistence.`;
    const nextAction = status === "draft-ready"
      ? "Review the draft internally, replace placeholders only after explicit human approval, then record replies as demand proof; do not send from this app."
      : status === "blocked"
        ? "Resolve the pilot gate or high-risk blocker before drafting any outreach copy."
        : "Complete the pilot cohort signal gate with release proof and inbound demand before drafting email-gate copy.";
    const workItemId = `${venture.id}-no-send-email-gate`;
    const replyProofReceipts = buildNoSendEmailGateReplyProofReceipts(venture, workItemId);
    const replyProofTypesRecorded = Array.from(new Set(replyProofReceipts.map((receipt) => receipt.proofType)));
    const replyProofDedupeHint = noSendEmailGateReplyProofDedupeHint(replyProofReceipts);
    const evidence = [
      `Pilot gate status: ${gate.status}`,
      `Pilot gate priority: ${gate.priority}`,
      `Inbound source: ${gate.inboundSignalSource}`,
      `Qualified demand metric: ${gate.qualifiedDemandMetric}`,
      `Demand proof draft: ${gate.demandCaptureProofDraft}`,
      `Channel: ${channel}`,
      replyProofDedupeHint,
      ...openHighRisks.map((risk) => `${risk.severity} risk: ${risk.title}`),
    ];
    const itemWithoutMarkdown: Omit<VentureNoSendEmailGateWorkItem, "markdown"> = {
      id: workItemId,
      ventureId: venture.id,
      ventureTitle: venture.title,
      status,
      priority,
      owner: gate.owner,
      sourceArtifactId: gate.id,
      sourceArtifactLabel: `Pilot cohort signal gate: ${gate.cohortLabel}`,
      cohortLabel: gate.cohortLabel,
      recipientPlaceholders,
      draftSubject,
      draftBody,
      reviewChecklist,
      replayCommand,
      humanApprovalBoundary,
      noSendBoundary,
      noDeployBoundary,
      noExternalSideEffectProof,
      nextAction,
      evidence,
      replyProofReceipts,
      replyProofReceiptCount: replyProofReceipts.length,
      replyProofTypesRecorded,
      replyProofDedupeHint,
    };

    return {
      ...itemWithoutMarkdown,
      markdown: noSendEmailGateMarkdown(itemWithoutMarkdown),
    };
  }).sort((a, b) => (
    priorityRank[b.priority] - priorityRank[a.priority] ||
    statusRank[b.status] - statusRank[a.status] ||
    a.ventureTitle.localeCompare(b.ventureTitle)
  ));
}

const RAW_RECIPIENT_EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const RAW_RECIPIENT_PHONE_PATTERN = /\b(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/;

function containsRawRecipientIdentifier(value?: string) {
  const candidate = value?.trim();
  if (!candidate) return false;
  return RAW_RECIPIENT_EMAIL_PATTERN.test(candidate) || RAW_RECIPIENT_PHONE_PATTERN.test(candidate);
}

function noSendEmailGateReplyProofHasRawRecipient(input: VentureNoSendEmailGateReplyProofInput) {
  return [
    input.redactedReplyNote,
    input.consentEvidence,
    input.persona,
    input.willingnessToPay,
    input.objections,
    input.requestedFeatures,
    input.acceptedPrice,
    input.objectionSummary,
    input.riskTitle,
    input.riskDetail,
    input.riskMitigation,
    input.riskResolutionEvidence,
    input.cohortLabel,
    input.acquisitionChannel,
    input.activationEvent,
    input.retentionWindow,
    input.learning,
    input.nextAction,
  ].some(containsRawRecipientIdentifier);
}

function noSendEmailGateReplyProofEvidence(
  item: VentureNoSendEmailGateWorkItem,
  redactedReplyNote: string,
  consentEvidence?: string,
) {
  const consent = consentEvidence?.trim() ||
    "Manual consent evidence was reviewed outside the app; no recipient is stored in this record.";
  return [
    `No-send email gate reply proof from ${item.id}.`,
    `Manual redacted reply note: ${redactedReplyNote}`,
    `Consent evidence: ${consent}`,
    `Boundary: ${item.noSendBoundary}`,
    "The app did not send email, store a real recipient, deploy, spend, track, contact anyone, or change billing.",
  ].join(" ");
}

export function recordVentureNoSendEmailGateReplyProof(
  ownerKey: string,
  ventureId: string,
  input: VentureNoSendEmailGateReplyProofInput,
  storage: StorageLike | null = browserStorage(),
  now = new Date().toISOString(),
): SavedVentureWorkspace | null {
  const owner = input.owner.trim();
  const redactedReplyNote = input.redactedReplyNote.trim();
  if (!owner || !redactedReplyNote || noSendEmailGateReplyProofHasRawRecipient(input)) return null;

  const existing = loadVenturePortfolio(ownerKey, storage);
  const venture = existing.find((item) => item.id === ventureId);
  if (!venture) return null;

  const workItem = buildVentureNoSendEmailGateWorklist([venture])
    .find((item) => item.id === input.workItemId);
  if (!workItem || workItem.status !== "draft-ready") return null;
  const dedupeKey = noSendEmailGateReplyDedupeKey(workItem.id, input.proofType, redactedReplyNote);
  if (workItem.replyProofReceipts.some((receipt) => receipt.dedupeKey === dedupeKey)) return null;

  const evidenceNote = noSendEmailGateReplyProofEvidence(
    workItem,
    redactedReplyNote,
    input.consentEvidence,
  );

  if (input.proofType === "customer-interview") {
    return recordVentureCustomerInterview(
      ownerKey,
      ventureId,
      {
        persona: input.persona?.trim() || workItem.cohortLabel,
        channel: "manual no-send email gate reply",
        painQuote: redactedReplyNote,
        willingnessToPay: input.willingnessToPay,
        objections: input.objections,
        requestedFeatures: input.requestedFeatures,
        sentiment: input.sentiment ?? "mixed",
        evidenceNote,
      },
      storage,
      now,
    );
  }

  if (input.proofType === "pricing-signal") {
    return recordVenturePricingSignal(
      ownerKey,
      ventureId,
      {
        qualifiedBuyerCount: input.qualifiedBuyerCount ?? 1,
        paidCommitmentCount: input.paidCommitmentCount ?? 0,
        invoiceRequestCount: input.invoiceRequestCount ?? 0,
        acceptedPrice: input.acceptedPrice,
        objectionSummary: input.objectionSummary || input.objections,
        evidenceNote,
      },
      storage,
      now,
    );
  }

  if (input.proofType === "risk") {
    const riskTitle = input.riskTitle?.trim() || `No-send reply risk: ${workItem.ventureTitle}`;
    const riskDetail = input.riskDetail?.trim() || redactedReplyNote;
    const riskMitigation = input.riskMitigation?.trim() ||
      "Resolve the redacted reply concern before any external outreach, launch, spend, deploy, or billing change.";
    return recordVentureRisk(
      ownerKey,
      ventureId,
      {
        sourceType: "manual",
        sourceRecordId: workItem.id,
        title: riskTitle,
        detail: `${riskDetail} ${evidenceNote}`,
        severity: input.riskSeverity ?? "medium",
        status: input.riskStatus ?? "monitoring",
        owner,
        mitigation: riskMitigation,
        resolutionEvidence: input.riskResolutionEvidence,
      },
      storage,
      now,
    );
  }

  if (input.proofType === "activation-cohort") {
    return recordVentureActivationCohort(
      ownerKey,
      ventureId,
      {
        sourceType: "pilot-signal-gate",
        sourceRecordId: workItem.sourceArtifactId,
        cohortLabel: input.cohortLabel?.trim() || workItem.cohortLabel,
        acquisitionChannel: input.acquisitionChannel?.trim() || "manual no-send email gate reply",
        activationEvent: input.activationEvent?.trim() || redactedReplyNote,
        retentionWindow: input.retentionWindow?.trim() || venture.retentionMechanism,
        signupCount: input.signupCount ?? 0,
        activatedCount: input.activatedCount ?? 0,
        retainedCount: input.retainedCount ?? 0,
        paidCount: input.paidCount ?? 0,
        revenueCents: input.revenueCents ?? 0,
        supportIssueCount: input.supportIssueCount ?? 0,
        owner,
        evidence: evidenceNote,
        learning: input.learning?.trim() || "A manually reviewed no-send email reply became source-backed pilot activation proof.",
        nextAction: input.nextAction?.trim() ||
          "Review this cohort proof before any external outreach, deployment, spend, tracking, or billing change.",
      },
      storage,
      now,
    );
  }

  return null;
}

function productBuildCommandMarkdown(command: Omit<VentureProductBuildCommand, "markdown">): string {
  return [
    `# Product Build Command: ${command.title}`,
    `Source: ${command.sourceType} (${command.sourceArtifactLabel})`,
    `Status: ${command.status}`,
    `Priority: ${command.priority}`,
    `Owner: ${command.owner}`,
    `App: ${command.appName}`,
    "",
    "## Build Command",
    command.buildCommand,
    "",
    "## Artifact Target",
    command.artifactTarget,
    "",
    "## Proof Required",
    command.proofRequired,
    "",
    "## No-Fake-Source Boundary",
    command.noFakeSourceBoundary,
    "",
    "## Evidence",
    ...(command.evidence.length > 0 ? command.evidence.map((item) => `- ${item}`) : ["- No evidence attached yet."]),
    "",
    "## Next Action",
    command.nextAction,
  ].join("\n");
}

function productBuildCommand(
  command: Omit<VentureProductBuildCommand, "markdown">,
): VentureProductBuildCommand {
  return {
    ...command,
    markdown: productBuildCommandMarkdown(command),
  };
}

function productBuildPriorityFor(status: VentureProductBuildCommandStatus): VentureProductBuildCommandPriority {
  if (status === "blocked") return "critical";
  if (status === "ready") return "high";
  if (status === "needs-proof") return "medium";
  return "low";
}

export function buildVentureProductBuildCommandQueue(
  ventures: SavedVentureWorkspace[],
): VentureProductBuildCommand[] {
  const commands: VentureProductBuildCommand[] = [];

  ventures.forEach((venture) => {
    const handoff = buildVentureGeneratedAppHandoff(venture);
    const scaffold = buildVentureGeneratedAppSourceScaffold(venture);
    const proof = buildVentureGeneratedAppVerificationProof(venture);
    const qaReport = buildVentureQaReleaseReport(venture);
    const validationResultLedger = buildVentureAtlasValidationResultLedger([venture]);
    const deploymentMatrix = buildVentureDeploymentEnvironmentMatrix(venture);
    const appName = handoff.appName || scaffold.appName || proof.appName || slugifySegment(venture.title);
    const noFakeSourceBoundary = scaffold.noFakeSourceSafeguards[0] ?? "Do not claim source exists until generated files, signatures, and verifier proof are attached.";
    const handoffStatus: VentureProductBuildCommandStatus = handoff.status === "executable"
      ? "verified"
      : handoff.status === "source-pending"
        ? "needs-proof"
        : "ready";
    commands.push(productBuildCommand({
      id: `${handoff.id}-product-build-command`,
      ventureId: venture.id,
      title: `Build product from handoff: ${venture.title}`,
      sourceType: "generated-app-handoff",
      sourceArtifactId: handoff.id,
      sourceArtifactLabel: `Generated app handoff: ${handoff.status}`,
      status: handoffStatus,
      priority: productBuildPriorityFor(handoffStatus),
      owner: handoff.owner || ventureLearningOwnerFor(venture),
      appName,
      buildCommand: proof.materializerCommand,
      artifactTarget: handoff.repoPath || scaffold.localTargetPath,
      proofRequired: `Materialize the source scaffold, run ${proof.verifierCommand}, and attach the verifier report before claiming the product is built.`,
      noFakeSourceBoundary,
      nextAction: handoff.status === "executable" ? "Keep verifier proof current before expanding product scope." : "Materialize the generated app scaffold locally and import verifier proof.",
      evidence: [
        handoff.generationBoundary,
        handoff.sourceCodeStatus,
        ...handoff.verificationCommands.slice(0, 3),
      ].filter(Boolean),
    }));

    const scaffoldStatus: VentureProductBuildCommandStatus = scaffold.status === "ready-to-materialize" ? "ready" : "needs-proof";
    commands.push(productBuildCommand({
      id: `${scaffold.id}-product-build-command`,
      ventureId: venture.id,
      title: `Materialize source scaffold: ${scaffold.appName}`,
      sourceType: "source-scaffold",
      sourceArtifactId: scaffold.id,
      sourceArtifactLabel: `Source scaffold: ${scaffold.status}`,
      status: scaffoldStatus,
      priority: productBuildPriorityFor(scaffoldStatus),
      owner: ventureLearningOwnerFor(venture),
      appName: scaffold.appName,
      buildCommand: `${proof.materializerCommand} --write`,
      artifactTarget: scaffold.localTargetPath,
      proofRequired: `Run scaffold materialization, then run ${proof.verifierCommand} and preserve source signatures.`,
      noFakeSourceBoundary,
      nextAction: scaffold.materializationInstruction,
      evidence: [
        scaffold.runnableProofStatus,
        ...scaffold.noFakeSourceSafeguards.slice(0, 3),
        ...scaffold.verificationCommands.slice(0, 3),
      ].filter(Boolean),
    }));

    venture.mvpBuildWorkspaces.slice(0, 4).forEach((workspace) => {
      const passedChecks = countPassedMvpChecks(workspace);
      const status: VentureProductBuildCommandStatus = workspace.status === "executable" && passedChecks >= 4
        ? "verified"
        : workspace.status === "blocked"
          ? "blocked"
          : "ready";
      commands.push(productBuildCommand({
        id: `${workspace.id}-product-build-command`,
        ventureId: venture.id,
        title: `Run MVP build workspace: ${workspace.repoPath}`,
        sourceType: "mvp-build-workspace",
        sourceArtifactId: workspace.id,
        sourceArtifactLabel: `MVP workspace: ${workspace.status}`,
        status,
        priority: productBuildPriorityFor(status),
        owner: workspace.owner,
        appName,
        buildCommand: workspace.buildCommand || workspace.testCommand || workspace.setupCommand,
        artifactTarget: workspace.repoPath,
        proofRequired: `Pass setup/typecheck/unit/build/browser-smoke checks and attach verification notes; current passed checks ${passedChecks}/5.`,
        noFakeSourceBoundary: "Do not mark the product executable unless the repo path is attached and the recorded commands pass.",
        nextAction: workspace.verificationNotes,
        evidence: [
          workspace.sourceCodeStatus,
          workspace.setupCommand,
          workspace.typecheckCommand,
          workspace.testCommand,
          workspace.buildCommand,
          workspace.browserSmokeCommand,
        ].filter(Boolean).slice(0, 8),
      }));
    });

    const proofStatus: VentureProductBuildCommandStatus = proof.status === "verified"
      ? "verified"
      : proof.status === "blocked"
        ? "blocked"
        : "needs-proof";
    commands.push(productBuildCommand({
      id: `${proof.id}-product-build-command`,
      ventureId: venture.id,
      title: `Verify product build: ${proof.appName}`,
      sourceType: "verifier-proof",
      sourceArtifactId: proof.id,
      sourceArtifactLabel: `Generated app verification: ${proof.status}`,
      status: proofStatus,
      priority: productBuildPriorityFor(proofStatus),
      owner: "generated-app-verifier",
      appName: proof.appName,
      buildCommand: proof.verifierCommand,
      artifactTarget: proof.targetPath,
      proofRequired: `${proof.requiredCheckCount} executable checks must pass; current passed checks ${proof.passedCheckCount}/${proof.requiredCheckCount}.`,
      noFakeSourceBoundary,
      nextAction: proof.nextActions[0] ?? "Run verifier and import the report.",
      evidence: [
        proof.proofSummary,
        ...proof.checks.map((check) => `${check.label}: ${check.status} via ${check.command}`),
        ...proof.missingProof,
      ].filter(Boolean).slice(0, 8),
    }));

    validationResultLedger
      .filter((result) => result.outcome === "passed" || result.paidPricingSignalCount > 0 || result.qualifiedBuyerCount > 0)
      .slice(0, 4)
      .forEach((result) => {
        const status: VentureProductBuildCommandStatus = result.outcome === "passed"
          ? "ready"
          : result.outcome === "failed"
            ? "blocked"
            : "needs-proof";
        commands.push(productBuildCommand({
          id: `${result.id}-product-build-command`,
          ventureId: venture.id,
          title: `Build validated product handoff: ${result.atlasItemTitle}`,
          sourceType: "validation-result",
          sourceArtifactId: result.id,
          sourceArtifactLabel: `Atlas validation result: ${result.outcome}`,
          status,
          priority: productBuildPriorityFor(status),
          owner: result.owner || ventureLearningOwnerFor(venture),
          appName,
          buildCommand: proof.verifierCommand,
          artifactTarget: proof.targetPath || scaffold.localTargetPath,
          proofRequired: `Validation-backed product build: ${result.qualifiedBuyerCount} qualified buyers, ${result.painConfirmationCount} pain confirmations, ${result.hiddenWedgeResonanceCount} hidden-wedge confirmations, and ${result.paidPricingSignalCount} paid pricing signals must be carried into a local setup/typecheck/test/build/browser-smoke verifier proof.`,
          noFakeSourceBoundary: `${noFakeSourceBoundary} ${result.noExternalSideEffectProof} No production deploy, outreach, spend, contact, or billing change is allowed from this command.`,
          nextAction: result.nextAction || `Run ${proof.verifierCommand} and import the verifier report before claiming a built product.`,
          evidence: [
            "validation-backed product build",
            "build first product",
            result.statusSummary,
            result.demandDriftUpdate,
            `Source validation pack: ${result.sourcePackTitle}`,
            `Strongest quote: ${result.strongestQuote}`,
            `Strongest objection: ${result.strongestObjection}`,
            `Learning: ${result.learning}`,
            `Generated app verifier: ${proof.verifierCommand}`,
            `Local product handoff target: ${proof.targetPath || scaffold.localTargetPath}`,
          ].filter(Boolean).slice(0, 10),
        }));
      });

    const qaStatus: VentureProductBuildCommandStatus = qaReport.status === "ready"
      ? "ready"
      : qaReport.status === "blocked"
        ? "blocked"
        : "needs-proof";
    commands.push(productBuildCommand({
      id: `${qaReport.id}-product-build-command`,
      ventureId: venture.id,
      title: `Close QA build gate: ${venture.title}`,
      sourceType: "qa-report",
      sourceArtifactId: qaReport.id,
      sourceArtifactLabel: `QA release report: ${qaReport.status}`,
      status: qaStatus,
      priority: productBuildPriorityFor(qaStatus),
      owner: ventureLearningOwnerFor(venture),
      appName,
      buildCommand: qaReport.checklist[0] ?? "Run the QA checklist before release.",
      artifactTarget: qaReport.artifactSummary,
      proofRequired: `${qaReport.passedCheckCount}/${qaReport.totalCheckCount} QA checks pass; resolve blockers before product build is considered ready.`,
      noFakeSourceBoundary: qaReport.deploymentBoundary,
      nextAction: qaReport.blockers[0] ?? qaReport.warnings[0] ?? "Keep QA proof current.",
      evidence: [
        qaReport.artifactSummary,
        qaReport.supportRiskSummary,
        qaReport.launchRiskSummary,
        ...qaReport.blockers,
        ...qaReport.warnings,
      ].filter(Boolean).slice(0, 8),
    }));

    venture.roadmapTasks
      .filter((task) => task.status === "queued" || task.status === "in-progress" || task.status === "blocked")
      .slice(0, 4)
      .forEach((task) => {
        const status: VentureProductBuildCommandStatus = task.status === "blocked" ? "blocked" : "ready";
        commands.push(productBuildCommand({
          id: `${task.id}-product-build-command`,
          ventureId: venture.id,
          title: `Build roadmap task: ${task.title}`,
          sourceType: "roadmap-task",
          sourceArtifactId: task.id,
          sourceArtifactLabel: `Roadmap task: ${task.status}`,
          status,
          priority: productBuildPriorityFor(status),
          owner: task.owner,
          appName,
          buildCommand: task.nextAction,
          artifactTarget: task.title,
          proofRequired: `Complete the roadmap task and attach evidence that it reduces risk: ${task.riskReduction}`,
          noFakeSourceBoundary: "Do not represent roadmap intent as shipped product until an artifact or verifier proof is attached.",
          nextAction: task.nextAction,
          evidence: [task.detail, task.supportLoad, task.riskReduction].filter(Boolean),
        }));
      });

    deploymentMatrix.targets
      .filter((target) => target.status !== "ready")
      .slice(0, 4)
      .forEach((target) => {
        const status: VentureProductBuildCommandStatus = target.status === "blocked" ? "blocked" : "needs-proof";
        commands.push(productBuildCommand({
          id: `${venture.id}-${target.id}-product-build-command`,
          ventureId: venture.id,
          title: `Resolve deployment blocker: ${target.label}`,
          sourceType: "deployment-blocker",
          sourceArtifactId: target.id,
          sourceArtifactLabel: `Deployment ${target.label}: ${target.status}`,
          status,
          priority: productBuildPriorityFor(status),
          owner: target.linkedRoadmapTaskOwner ?? target.linkedSupportIssueOwner ?? ventureLearningOwnerFor(venture),
          appName,
          buildCommand: target.nextAction,
          artifactTarget: target.label,
          proofRequired: target.requiredProof.join("; "),
          noFakeSourceBoundary: deploymentMatrix.productionBoundary,
          nextAction: target.nextAction,
          evidence: [
            target.proofSummary,
            target.approvalBoundary,
            target.linkedRoadmapTaskTitle ?? "",
            target.linkedSupportIssueTitle ?? "",
          ].filter(Boolean),
        }));
      });
  });

  const priorityRank: Record<VentureProductBuildCommandPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureProductBuildCommandStatus, number> = {
    blocked: 4,
    ready: 3,
    "needs-proof": 2,
    verified: 1,
  };

  return commands.sort((a, b) => (
    priorityRank[b.priority] - priorityRank[a.priority] ||
    statusRank[b.status] - statusRank[a.status] ||
    a.title.localeCompare(b.title)
  )).slice(0, 120);
}

function launchControlMarkdown(item: Omit<VentureLaunchControlQueueItem, "markdown">): string {
  return [
    `# Launch Control Queue Item: ${item.title}`,
    `Source: ${item.sourceType} (${item.sourceArtifactLabel})`,
    `Status: ${item.status}`,
    `Priority: ${item.priority}`,
    `Owner: ${item.owner}`,
    "",
    "## Launch Command",
    item.launchCommand,
    "",
    "## Human Approval Boundary",
    item.humanApprovalBoundary,
    "",
    "## Metrics",
    `- Success: ${item.successMetric}`,
    `- Failure: ${item.failureMetric}`,
    "",
    "## No External Action Proof",
    item.noExternalActionProof,
    "",
    "## Replay Command",
    item.replayCommand,
    "",
    "## Evidence",
    ...(item.evidence.length > 0 ? item.evidence.map((line) => `- ${line}`) : ["- No evidence attached yet."]),
    "",
    "## Next Action",
    item.nextAction,
  ].join("\n");
}

function launchControlItem(item: Omit<VentureLaunchControlQueueItem, "markdown">): VentureLaunchControlQueueItem {
  return {
    ...item,
    markdown: launchControlMarkdown(item),
  };
}

function launchControlPriorityFor(status: VentureLaunchControlStatus): VentureLaunchControlPriority {
  if (status === "blocked") return "critical";
  if (status === "ready") return "high";
  if (status === "needs-approval") return "medium";
  return "low";
}

export function buildVentureLaunchControlQueue(
  ventures: SavedVentureWorkspace[],
): VentureLaunchControlQueueItem[] {
  const items: VentureLaunchControlQueueItem[] = [];

  ventures.forEach((venture) => {
    const owner = ventureLearningOwnerFor(venture);
    const launchPack = buildVentureExperimentLaunchPack(venture);
    const launchStatus: VentureLaunchControlStatus = launchPack.status === "ready"
      ? "ready"
      : launchPack.status === "recorded"
        ? "recorded"
        : launchPack.status === "blocked"
          ? "blocked"
          : "needs-approval";
    items.push(launchControlItem({
      id: `${launchPack.id}-launch-control`,
      ventureId: venture.id,
      title: `Launch experiment: ${launchPack.title}`,
      sourceType: "experiment-launch-pack",
      sourceArtifactId: launchPack.id,
      sourceArtifactLabel: `Experiment launch pack: ${launchPack.status}`,
      status: launchStatus,
      priority: launchControlPriorityFor(launchStatus),
      owner,
      launchCommand: launchPack.replayCommand,
      humanApprovalBoundary: launchPack.approvalGates[0] ?? "Human approval required before any external send, spend, deploy, or billing change.",
      successMetric: launchPack.successMetric,
      failureMetric: launchPack.failureMetric,
      noExternalActionProof: "Launch pack is an internal command artifact; it records copy, checklist, and replay steps but does not send, spend, deploy, or charge automatically.",
      replayCommand: launchPack.replayCommand,
      evidence: [
        launchPack.hypothesis,
        launchPack.audience,
        launchPack.channel,
        ...launchPack.riskChecks.slice(0, 3),
        ...launchPack.checklist.slice(0, 3),
      ].filter(Boolean),
      nextAction: launchStatus === "ready" ? "Run the approved internal launch checklist and record the experiment result." : "Resolve launch approval or blocking evidence before running the experiment.",
    }));

    buildVentureGapActionQueue(venture).slice(0, 4).forEach((task) => {
      const status: VentureLaunchControlStatus = task.priority === "high" ? "ready" : "needs-approval";
      items.push(launchControlItem({
        id: `${task.id}-launch-control`,
        ventureId: venture.id,
        title: `Launch gap action: ${task.title}`,
        sourceType: "gap-action",
        sourceArtifactId: task.id,
        sourceArtifactLabel: `Gap action: ${task.type}`,
        status,
        priority: task.priority === "high" ? "high" : task.priority,
        owner,
        launchCommand: task.prompt,
        humanApprovalBoundary: "Gap actions may launch internal research only; external outreach, paid spend, deployment, and billing remain separately gated.",
        successMetric: "The missing evidence gap is resolved with source-backed proof or a measured result.",
        failureMetric: "The gap remains unresolved or introduces a contradiction that blocks the venture.",
        noExternalActionProof: "The gap action stores a prompt and launch request only; it does not perform an external side effect without separate human approval.",
        replayCommand: task.prompt,
        evidence: [task.reason],
        nextAction: task.prompt,
      }));
    });

    venture.browserResearchTasks
      .filter((task) => task.status !== "dismissed")
      .slice(0, 4)
      .forEach((task) => {
        const status: VentureLaunchControlStatus = task.status === "blocked"
          ? "blocked"
          : task.status === "evidence-captured"
            ? "recorded"
            : "ready";
        items.push(launchControlItem({
          id: `${task.id}-launch-control`,
          ventureId: venture.id,
          title: `Launch browser research: ${task.sourceTarget}`,
          sourceType: "browser-research",
          sourceArtifactId: task.id,
          sourceArtifactLabel: `${task.platform}: ${task.status}`,
          status,
          priority: launchControlPriorityFor(status),
          owner: task.owner || owner,
          launchCommand: task.prompt,
          humanApprovalBoundary: "Browser research is read-only evidence capture; it must not send messages, spend money, deploy, or change billing.",
          successMetric: "Evidence URL, findings, and replay note are captured.",
          failureMetric: "Research is blocked, dismissed, or lacks a source URL plus replay note.",
          noExternalActionProof: task.replayNote || "Read-only browser research task has no external side effect recorded.",
          replayCommand: task.replayNote || task.prompt,
          evidence: [task.findings, task.evidenceUrl, task.replayNote].filter(Boolean),
          nextAction: task.nextAction,
        }));
      });

    venture.outreachApprovals
      .filter((approval) => approval.status !== "dismissed")
      .slice(0, 4)
      .forEach((approval) => {
        const status: VentureLaunchControlStatus = approval.status === "approved" || approval.status === "manual-contact-planned"
          ? "needs-approval"
          : approval.status === "completed"
            ? "recorded"
            : "blocked";
        items.push(launchControlItem({
          id: `${approval.id}-launch-control`,
          ventureId: venture.id,
          title: `Prepare no-send outreach launch: ${approval.contactPersona}`,
          sourceType: "outreach-approval",
          sourceArtifactId: approval.id,
          sourceArtifactLabel: `Outreach approval: ${approval.status}`,
          status,
          priority: launchControlPriorityFor(status),
          owner,
          launchCommand: approval.messageDraft,
          humanApprovalBoundary: `${approval.approvalLevel}; external send status remains ${approval.externalSendStatus}.`,
          successMetric: "Manual contact result is recorded as an interview, pricing signal, or experiment outcome after human action.",
          failureMetric: "Message is not sent, risk note blocks contact, or no attribution/result is captured.",
          noExternalActionProof: `No automatic outreach: externalSendStatus=${approval.externalSendStatus}.`,
          replayCommand: `Review outreach approval ${approval.id}, attribution, risk note, and human approval before any manual contact.`,
          evidence: [approval.riskNote, approval.attribution, approval.nextAction].filter(Boolean),
          nextAction: approval.nextAction,
        }));
      });

    venture.autonomyAudit
      .filter((audit) => audit.status !== "dismissed")
      .slice(0, 4)
      .forEach((audit) => {
        const status: VentureLaunchControlStatus = audit.status === "blocked"
          ? "blocked"
          : audit.status === "approved" || audit.status === "executed"
            ? "ready"
            : "needs-approval";
        items.push(launchControlItem({
          id: `${audit.id}-launch-control`,
          ventureId: venture.id,
          title: `Launch audited action replay: ${audit.actionType}`,
          sourceType: "autonomy-audit",
          sourceArtifactId: audit.id,
          sourceArtifactLabel: `Autonomy audit: ${audit.status}`,
          status,
          priority: launchControlPriorityFor(status),
          owner: audit.actor || owner,
          launchCommand: audit.nextAction,
          humanApprovalBoundary: `${audit.approvalLevel}; side effect boundary ${audit.sideEffect}.`,
          successMetric: "Replay confirms the action stayed inside the recorded side-effect boundary.",
          failureMetric: "Replay cannot prove approval, attribution, evidence, and side-effect boundary.",
          noExternalActionProof: audit.sideEffect === "none" || audit.sideEffect === "local-only"
            ? `No external side effect: ${audit.sideEffect}.`
            : `External side effect remains governed by audit status ${audit.status} and boundary ${audit.sideEffect}.`,
          replayCommand: audit.replayNote,
          evidence: [audit.riskNote, audit.evidence, audit.replayNote].filter(Boolean),
          nextAction: audit.nextAction,
        }));
      });

    venture.agentRuns
      .filter((run) => run.status !== "blocked")
      .slice(0, 4)
      .forEach((run) => {
        const status: VentureLaunchControlStatus = run.status === "executed" || run.status === "replayed"
          ? "recorded"
          : "ready";
        items.push(launchControlItem({
          id: `${run.id}-launch-control`,
          ventureId: venture.id,
          title: `Replay launch agent run: ${run.model}`,
          sourceType: "agent-replay",
          sourceArtifactId: run.id,
          sourceArtifactLabel: `Agent run: ${run.status}`,
          status,
          priority: launchControlPriorityFor(status),
          owner: run.owner || owner,
          launchCommand: run.prompt,
          humanApprovalBoundary: "Agent replay is internal and evidence-only; it cannot perform external sends, spend, deployment, or billing changes by itself.",
          successMetric: "Replay command reproduces output summary and tool-call evidence.",
          failureMetric: "Replay command is missing, blocked, or cannot be attributed to input evidence.",
          noExternalActionProof: run.riskNote,
          replayCommand: run.replayCommand,
          evidence: [run.outputSummary, run.inputEvidence, run.toolCalls].filter(Boolean),
          nextAction: run.nextAction,
        }));
      });
  });

  const priorityRank: Record<VentureLaunchControlPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureLaunchControlStatus, number> = {
    blocked: 4,
    ready: 3,
    "needs-approval": 2,
    recorded: 1,
  };

  return items.sort((a, b) => (
    priorityRank[b.priority] - priorityRank[a.priority] ||
    statusRank[b.status] - statusRank[a.status] ||
    a.title.localeCompare(b.title)
  )).slice(0, 120);
}

function demandCaptureProofMarkdown(item: Omit<VentureDemandCaptureProofQueueItem, "markdown">): string {
  return [
    `# Demand Capture Proof Item: ${item.title}`,
    `Source: ${item.sourceType} (${item.sourceArtifactLabel})`,
    `Status: ${item.status}`,
    `Priority: ${item.priority}`,
    `Owner: ${item.owner}`,
    "",
    "## Capture Command",
    item.captureCommand,
    "",
    "## Qualified Demand Metric",
    item.qualifiedDemandMetric,
    "",
    "## Source Proof",
    item.sourceProof,
    "",
    "## No-Fake-Demand Boundary",
    item.noFakeDemandBoundary,
    "",
    "## Follow-Up Action",
    item.followUpAction,
    "",
    "## Evidence",
    ...(item.evidence.length > 0 ? item.evidence.map((line) => `- ${line}`) : ["- No demand proof attached yet."]),
  ].join("\n");
}

function demandCaptureProofItem(
  item: Omit<VentureDemandCaptureProofQueueItem, "markdown">,
): VentureDemandCaptureProofQueueItem {
  return {
    ...item,
    markdown: demandCaptureProofMarkdown(item),
  };
}

function demandCapturePriorityFor(status: VentureDemandCaptureProofStatus): VentureDemandCaptureProofPriority {
  if (status === "blocked") return "critical";
  if (status === "captured") return "high";
  if (status === "needs-follow-up") return "medium";
  return "low";
}

function demandCaptureStatusForDrift(status: VentureDemandDriftStatus): VentureDemandCaptureProofStatus {
  if (status === "overestimated") return "blocked";
  if (status === "confirmed" || status === "underestimated") return "captured";
  if (status === "mixed") return "needs-follow-up";
  return "weak";
}

function demandCaptureStatusForNoSendReplyReceipt(receipt: VentureNoSendEmailGateReplyProofReceipt): VentureDemandCaptureProofStatus {
  if (receipt.proofType === "risk") {
    return /\b(high|critical|open|mitigating)\b/i.test(receipt.proofMetric) ? "blocked" : "needs-follow-up";
  }
  if (receipt.proofType === "customer-interview") {
    if (/\bnegative\b/i.test(receipt.proofMetric)) return "blocked";
    return /\bpositive\b/i.test(receipt.proofMetric) ? "captured" : "needs-follow-up";
  }
  if (receipt.proofType === "pricing-signal") {
    return /^0 paid \/ 0 qualified \/ 0 invoice$/i.test(receipt.proofMetric) ? "weak" : "captured";
  }
  return "captured";
}

export function buildVentureDemandCaptureProofQueue(
  ventures: SavedVentureWorkspace[],
): VentureDemandCaptureProofQueueItem[] {
  const items: VentureDemandCaptureProofQueueItem[] = [];

  ventures.forEach((venture) => {
    const owner = ventureLearningOwnerFor(venture);
    const demandDrift = buildVentureDemandDriftReport(venture);
    const driftStatus = demandCaptureStatusForDrift(demandDrift.status);
    const noSendReplyDemandDedupeKeys = new Set<string>();
    items.push(demandCaptureProofItem({
      id: `${demandDrift.id}-demand-capture`,
      ventureId: venture.id,
      title: `Capture demand reality: ${venture.title}`,
      sourceType: "demand-drift-report",
      sourceArtifactId: demandDrift.id,
      sourceArtifactLabel: `Demand drift: ${demandDrift.status}`,
      status: driftStatus,
      priority: demandCapturePriorityFor(driftStatus),
      owner,
      captureCommand: demandDrift.nextAction,
      qualifiedDemandMetric: `Actual demand ${demandDrift.actualDemandScore}/100 vs baseline ${demandDrift.baselineDemandScore}/100; drift ${demandDrift.drift >= 0 ? "+" : ""}${demandDrift.drift}.`,
      sourceProof: demandDrift.reason,
      noFakeDemandBoundary: "Demand is not counted as captured unless an experiment, pricing, cohort, channel, interview, money, outreach, or browser source backs it.",
      followUpAction: demandDrift.nextAction,
      evidence: demandDrift.components.map((component) => `${component.label} ${component.score}/100: ${component.evidence}`),
    }));

    buildVentureNoSendEmailGateWorklist([venture]).forEach((workItem) => {
      workItem.replyProofReceipts.forEach((receipt) => {
        if (noSendReplyDemandDedupeKeys.has(receipt.dedupeKey)) return;
        noSendReplyDemandDedupeKeys.add(receipt.dedupeKey);
        const status = demandCaptureStatusForNoSendReplyReceipt(receipt);
        items.push(demandCaptureProofItem({
          id: `${venture.id}-no-send-reply-demand-${slugifySegment(receipt.dedupeKey)}`,
          ventureId: venture.id,
          title: `Capture no-send reply proof: ${receipt.sourceLabel}`,
          sourceType: "no-send-reply-proof",
          sourceArtifactId: receipt.sourceRecordId,
          sourceArtifactLabel: `${receipt.sourceLabel} via ${workItem.id}`,
          status,
          priority: demandCapturePriorityFor(status),
          owner: receipt.owner || owner,
          captureCommand: `Review no-send reply proof receipt ${receipt.sourceRecordId}, then decide whether it changes demand, risk, or follow-up priority for ${venture.title}.`,
          qualifiedDemandMetric: `${receipt.proofType}: ${receipt.proofMetric}.`,
          sourceProof: receipt.redactedReplyNote,
          noFakeDemandBoundary: "No-send reply demand is counted once per dedupe key and only from a redacted receipt; it cannot add another claim if the same reply is already represented by an interview, pricing signal, risk, or activation cohort.",
          followUpAction: receipt.duplicateHint,
          evidence: [
            `Email gate work item: ${workItem.id}`,
            `Source record: ${receipt.sourceRecordId}`,
            `Dedupe key: ${receipt.dedupeKey}`,
            receipt.summary,
            receipt.noSendProof,
            receipt.duplicateHint,
          ].filter(Boolean),
        }));
      });
    });

    venture.activationCohorts
      .filter((cohort) => !evidenceHasAnyNoSendReplyProof(cohort.evidence))
      .slice(0, 4).forEach((cohort) => {
      const activationRate = Math.round((cohort.activatedCount / Math.max(cohort.signupCount, 1)) * 100);
      const retentionRate = cohort.activatedCount > 0 ? Math.round((cohort.retainedCount / cohort.activatedCount) * 100) : 0;
      const status: VentureDemandCaptureProofStatus = cohort.signupCount === 0
        ? "weak"
        : cohort.paidCount > 0 || cohort.revenueCents > 0 || cohort.retainedCount > 0
          ? "captured"
          : activationRate >= 35
            ? "needs-follow-up"
            : "weak";
      items.push(demandCaptureProofItem({
        id: `${cohort.id}-demand-capture`,
        ventureId: venture.id,
        title: `Capture cohort demand: ${cohort.cohortLabel}`,
        sourceType: "activation-cohort",
        sourceArtifactId: cohort.id,
        sourceArtifactLabel: `Activation cohort: ${cohort.acquisitionChannel}`,
        status,
        priority: demandCapturePriorityFor(status),
        owner: cohort.owner || owner,
        captureCommand: cohort.nextAction,
        qualifiedDemandMetric: `${cohort.signupCount} signups, ${activationRate}% activated, ${retentionRate}% retained, ${cohort.paidCount} paid, ${formatCents(cohort.revenueCents)} revenue.`,
        sourceProof: cohort.evidence,
        noFakeDemandBoundary: "Cohort demand requires recorded signups, activation, retention, payment, or revenue evidence; vanity interest alone does not count.",
        followUpAction: cohort.nextAction,
        evidence: [cohort.activationEvent, cohort.retentionWindow, cohort.learning, cohort.evidence].filter(Boolean),
      }));
    });

    venture.channelEconomics.slice(0, 4).forEach((economics) => {
      const status: VentureDemandCaptureProofStatus = economics.paybackStatus === "paid-back"
        ? "captured"
        : economics.paybackStatus === "no-payback"
          ? "blocked"
          : economics.paybackStatus === "partial-payback"
            ? "needs-follow-up"
            : "weak";
      items.push(demandCaptureProofItem({
        id: `${economics.id}-demand-capture`,
        ventureId: venture.id,
        title: `Capture channel demand: ${economics.channel}`,
        sourceType: "channel-economics",
        sourceArtifactId: economics.id,
        sourceArtifactLabel: `Channel economics: ${economics.paybackStatus}`,
        status,
        priority: demandCapturePriorityFor(status),
        owner: economics.owner || owner,
        captureCommand: economics.nextAction,
        qualifiedDemandMetric: `${economics.signupCount} signups, ${economics.activatedCount} activated, ${economics.paidCount} paid, CAC ${formatCents(economics.cacCents)}, revenue ${formatCents(economics.revenueCents)}.`,
        sourceProof: economics.evidence,
        noFakeDemandBoundary: "Channel demand requires tracked spend, signup, activation, paid-user, revenue, and payback evidence before scaling.",
        followUpAction: economics.nextAction,
        evidence: [
          `${economics.impressions} impressions and ${economics.clicks} clicks.`,
          `${formatCents(economics.spendCents)} spend; ${formatCents(economics.revenueCents)} revenue.`,
          economics.evidence,
        ],
      }));
    });

    venture.pricingSignals
      .filter((signal) => !evidenceHasAnyNoSendReplyProof(signal.evidenceNote))
      .slice(0, 4).forEach((signal) => {
      const status: VentureDemandCaptureProofStatus = signal.paidCommitmentCount > 0 || signal.invoiceRequestCount > 0
        ? "captured"
        : signal.qualifiedBuyerCount > 0
          ? "needs-follow-up"
          : "weak";
      items.push(demandCaptureProofItem({
        id: `${signal.id}-demand-capture`,
        ventureId: venture.id,
        title: `Capture pricing demand: ${signal.acceptedPrice || signal.pricingHypothesis}`,
        sourceType: "pricing-signal",
        sourceArtifactId: signal.id,
        sourceArtifactLabel: `Pricing signal: ${signal.qualifiedBuyerCount} qualified`,
        status,
        priority: demandCapturePriorityFor(status),
        owner,
        captureCommand: "Convert the pricing signal into a paid commitment, invoice request, or recorded objection before treating demand as qualified.",
        qualifiedDemandMetric: `${signal.qualifiedBuyerCount} qualified buyers, ${signal.paidCommitmentCount} paid commitments, ${signal.invoiceRequestCount} invoice requests at ${signal.acceptedPrice || signal.pricingHypothesis}.`,
        sourceProof: signal.evidenceNote,
        noFakeDemandBoundary: "Pricing interest is not qualified demand unless buyer count, paid commitment, invoice request, accepted price, or objection evidence is recorded.",
        followUpAction: signal.objectionSummary || "Ask the next qualified buyer for payment or a concrete invoice request.",
        evidence: [signal.pricingHypothesis, signal.acceptedPrice, signal.objectionSummary, signal.evidenceNote].filter(Boolean),
      }));
    });

    venture.moneySignals.slice(0, 4).forEach((signal) => {
      const status: VentureDemandCaptureProofStatus = signal.status === "blocked"
        ? "blocked"
        : signal.amountCents > 0 && (signal.status === "received" || signal.status === "committed")
          ? "captured"
          : "needs-follow-up";
      items.push(demandCaptureProofItem({
        id: `${signal.id}-demand-capture`,
        ventureId: venture.id,
        title: `Capture money demand: ${signal.source}`,
        sourceType: "money-signal",
        sourceArtifactId: signal.id,
        sourceArtifactLabel: `Money signal: ${signal.status}`,
        status,
        priority: demandCapturePriorityFor(status),
        owner: signal.owner || owner,
        captureCommand: signal.approvalNextAction || "Attach attribution and reconcile this money signal before counting it as captured demand.",
        qualifiedDemandMetric: `${formatCents(signal.amountCents)} ${signal.status} ${signal.type}; billing state ${signal.externalBillingStatus}.`,
        sourceProof: signal.evidence,
        noFakeDemandBoundary: `Money demand must remain attributable and billing-safe; externalBillingStatus=${signal.externalBillingStatus}.`,
        followUpAction: signal.approvalNextAction || signal.notes || "Reconcile the source, approval state, and demand attribution.",
        evidence: [signal.source, signal.evidence, signal.notes, signal.approvalState ?? "", signal.externalActionState ?? ""].filter(Boolean),
      }));
    });

    venture.customerInterviews
      .filter((interview) => !evidenceHasAnyNoSendReplyProof(interview.evidenceNote))
      .slice(0, 4).forEach((interview) => {
      const status: VentureDemandCaptureProofStatus = interview.sentiment === "positive"
        ? "captured"
        : interview.sentiment === "negative"
          ? "blocked"
          : "needs-follow-up";
      items.push(demandCaptureProofItem({
        id: `${interview.id}-demand-capture`,
        ventureId: venture.id,
        title: `Capture interview demand: ${interview.persona}`,
        sourceType: "customer-interview",
        sourceArtifactId: interview.id,
        sourceArtifactLabel: `Interview: ${interview.sentiment}`,
        status,
        priority: demandCapturePriorityFor(status),
        owner,
        captureCommand: "Convert the interview into a recorded experiment result, pricing signal, cohort, or roadmap decision.",
        qualifiedDemandMetric: `${interview.sentiment} interview; willingness to pay: ${interview.willingnessToPay}.`,
        sourceProof: interview.evidenceNote || interview.painQuote,
        noFakeDemandBoundary: "Interview demand requires a quote, willingness-to-pay statement, objection, or requested feature; politeness alone does not count.",
        followUpAction: interview.requestedFeatures || interview.objections || "Ask for a concrete next step or payment signal.",
        evidence: [interview.painQuote, interview.willingnessToPay, interview.objections, interview.requestedFeatures, interview.evidenceNote].filter(Boolean),
      }));
    });

    venture.outreachApprovals
      .filter((approval) => approval.status !== "dismissed")
      .slice(0, 4)
      .forEach((approval) => {
        const status: VentureDemandCaptureProofStatus = approval.status === "completed"
          ? "captured"
          : approval.status === "approved" || approval.status === "manual-contact-planned"
            ? "needs-follow-up"
            : "blocked";
        items.push(demandCaptureProofItem({
          id: `${approval.id}-demand-capture`,
          ventureId: venture.id,
          title: `Capture outreach demand: ${approval.contactPersona}`,
          sourceType: "outreach-approval",
          sourceArtifactId: approval.id,
          sourceArtifactLabel: `No-send outreach: ${approval.status}`,
          status,
          priority: demandCapturePriorityFor(status),
          owner,
          captureCommand: approval.nextAction,
          qualifiedDemandMetric: `Approval status ${approval.status}; external send ${approval.externalSendStatus}; channel ${approval.channel}.`,
          sourceProof: approval.attribution,
          noFakeDemandBoundary: `Outreach approval is not demand until a human-recorded response exists; externalSendStatus=${approval.externalSendStatus}.`,
          followUpAction: approval.nextAction,
          evidence: [approval.messageDraft, approval.riskNote, approval.attribution].filter(Boolean),
        }));
      });

    venture.browserResearchTasks
      .filter((task) => task.status !== "dismissed")
      .slice(0, 4)
      .forEach((task) => {
        const status: VentureDemandCaptureProofStatus = task.status === "evidence-captured"
          ? "captured"
          : task.status === "blocked"
            ? "blocked"
            : "needs-follow-up";
        items.push(demandCaptureProofItem({
          id: `${task.id}-demand-capture`,
          ventureId: venture.id,
          title: `Capture source-backed demand: ${task.sourceTarget}`,
          sourceType: "browser-research",
          sourceArtifactId: task.id,
          sourceArtifactLabel: `${task.platform}: ${task.status}`,
          status,
          priority: demandCapturePriorityFor(status),
          owner: task.owner || owner,
          captureCommand: task.nextAction,
          qualifiedDemandMetric: task.findings || `Research status ${task.status} for ${task.sourceTarget}.`,
          sourceProof: task.evidenceUrl || task.replayNote,
          noFakeDemandBoundary: "Browser research is read-only market evidence; it cannot count as demand without source URL, findings, and replay note.",
          followUpAction: task.nextAction,
          evidence: [task.prompt, task.findings, task.evidenceUrl, task.replayNote].filter(Boolean),
        }));
      });
  });

  const priorityRank: Record<VentureDemandCaptureProofPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  const statusRank: Record<VentureDemandCaptureProofStatus, number> = {
    blocked: 4,
    captured: 3,
    "needs-follow-up": 2,
    weak: 1,
  };

  return items.sort((a, b) => (
    priorityRank[b.priority] - priorityRank[a.priority] ||
    statusRank[b.status] - statusRank[a.status] ||
    a.title.localeCompare(b.title)
  )).slice(0, 120);
}

function portfolioDecisionCommandMarkdown(command: Omit<VenturePortfolioDecisionCommand, "markdown">): string {
  return [
    `# Portfolio Decision Command: ${command.title}`,
    `Recommended decision: ${command.recommendedDecision}`,
    `Status: ${command.status}`,
    `Priority: ${command.priority}`,
    `Confidence: ${command.confidenceScore}/100`,
    `Owner: ${command.owner}`,
    "",
    "## Decision Command",
    command.decisionCommand,
    "",
    "## Confidence Note",
    command.confidenceNote,
    "",
    "## Next Command",
    command.nextCommand,
    "",
    "## Human Review Boundary",
    command.humanReviewBoundary,
    "",
    "## Contradiction Proof",
    command.contradictionProof,
    "",
    "## Input Summaries",
    `- Demand capture: ${command.demandCaptureSummary}`,
    `- Demand source provenance: ${command.demandSourceProvenanceSummary}`,
    `- Demand source decision note: ${command.demandSourceDecisionNote}`,
    `- Demand source blocker provenance: ${command.demandSourceBlockerSummary}`,
    `- No-send reply demand: ${command.noSendReplyDemandSummary}`,
    `- No-send reply decision note: ${command.noSendReplyDecisionNote}`,
    `- Revenue: ${command.revenueSummary}`,
    `- Launch: ${command.launchSummary}`,
    `- Product proof: ${command.productProofSummary}`,
    `- Support: ${command.supportSummary}`,
    `- Scale: ${command.scaleSummary}`,
    `- Kill pressure: ${command.killPressureSummary}`,
    "",
    "## Demand Source Provenance",
    `Summary: ${command.demandSourceProvenanceSummary}`,
    `Decision note: ${command.demandSourceDecisionNote}`,
    ...(command.demandSourceEvidence.length > 0
      ? command.demandSourceEvidence.map((item) => `- ${item}`)
      : ["- No non-no-send demand source provenance is attached yet."]),
    "",
    "## Demand Source Blocker Provenance",
    `Summary: ${command.demandSourceBlockerSummary}`,
    ...(command.demandSourceBlockerEvidence.length > 0
      ? command.demandSourceBlockerEvidence.map((item) => `- ${item}`)
      : ["- No blocked non-no-send demand source is contributing blocker pressure."]),
    "",
    "## No-Send Email Gate Reply Demand",
    `Summary: ${command.noSendReplyDemandSummary}`,
    `Influence: ${command.noSendReplyDecisionNote}`,
    ...(command.noSendReplyDemandEvidence.length > 0
      ? command.noSendReplyDemandEvidence.map((item) => `- ${item}`)
      : ["- No redacted no-send email-gate reply receipts have shifted this recommendation yet."]),
    "",
    "## Evidence",
    ...(command.evidence.length > 0 ? command.evidence.map((item) => `- ${item}`) : ["- No decision evidence attached yet."]),
    "",
    "## Blockers",
    ...(command.blockers.length > 0 ? command.blockers.map((item) => `- ${item}`) : ["- No decision blocker detected."]),
  ].join("\n");
}

function portfolioDecisionCommand(
  command: Omit<VenturePortfolioDecisionCommand, "markdown">,
): VenturePortfolioDecisionCommand {
  return {
    ...command,
    markdown: portfolioDecisionCommandMarkdown(command),
  };
}

function portfolioDecisionStatusFor(params: {
  decision: VentureDecisionType;
  blockers: string[];
  needsProof: boolean;
  requiresHumanReview: boolean;
}): VenturePortfolioDecisionCommandStatus {
  if (params.decision === "kill" || params.decision === "pause" || params.blockers.some((blocker) => /blocked|kill|stop|do not/i.test(blocker))) {
    return "blocked";
  }
  if (params.requiresHumanReview || params.decision === "scale" || params.decision === "archive") return "human-review";
  if (params.needsProof) return "needs-proof";
  return "ready";
}

function portfolioDecisionPriorityFor(status: VenturePortfolioDecisionCommandStatus): VenturePortfolioDecisionCommandPriority {
  if (status === "blocked") return "critical";
  if (status === "human-review") return "high";
  if (status === "ready") return "high";
  return "medium";
}

function noSendReplyDemandDedupeKeys(items: VentureDemandCaptureProofQueueItem[]) {
  return Array.from(new Set(items.map((item) => (
    item.evidence.find((line) => line.startsWith("Dedupe key:"))?.replace("Dedupe key:", "").trim() ||
    item.sourceArtifactId
  )).filter(Boolean)));
}

function demandSourceStatusCounts(items: VentureDemandCaptureProofQueueItem[]) {
  return {
    captured: items.filter((item) => item.status === "captured").length,
    needsFollowUp: items.filter((item) => item.status === "needs-follow-up").length,
    blocked: items.filter((item) => item.status === "blocked").length,
    weak: items.filter((item) => item.status === "weak").length,
  };
}

function demandSourceTypeCounts(items: VentureDemandCaptureProofQueueItem[]) {
  return Array.from(items.reduce<Map<VentureDemandCaptureProofSourceType, number>>((counts, item) => {
    counts.set(item.sourceType, (counts.get(item.sourceType) ?? 0) + 1);
    return counts;
  }, new Map()).entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function demandSourceTypeCountSummary(items: VentureDemandCaptureProofQueueItem[]) {
  const entries = demandSourceTypeCounts(items);
  return entries.length > 0
    ? entries.map(([sourceType, count]) => `${sourceType}: ${count}`).join("; ")
    : "None";
}

function demandSourceEvidenceLines(items: VentureDemandCaptureProofQueueItem[]) {
  return items.slice(0, 6).map((item) => (
    `${item.sourceType} via ${item.sourceArtifactLabel} [${item.status}]: ${item.qualifiedDemandMetric} - ${item.sourceProof}`
  ));
}

function demandSourceBlockerPressureItems(
  items: VentureDemandCaptureProofQueueItem[],
  hasCapturedDemand: boolean,
) {
  return items.filter((item) => (
    item.status === "blocked" ||
    (!hasCapturedDemand && item.status === "weak")
  ));
}

function nonNoSendDemandSourceItems(items: VentureDemandCaptureProofQueueItem[]) {
  return items.filter((item) => item.sourceType !== "no-send-reply-proof");
}

function demandSourceBlockerPressureItemsForVenture(items: VentureDemandCaptureProofQueueItem[]) {
  const nonNoSendItems = nonNoSendDemandSourceItems(items);
  return demandSourceBlockerPressureItems(
    nonNoSendItems,
    nonNoSendItems.some((item) => item.status === "captured"),
  );
}

function demandSourceBlockerEvidenceLines(items: VentureDemandCaptureProofQueueItem[]) {
  return items.slice(0, 6).map((item) => (
    `${item.sourceType} blocker via ${item.sourceArtifactLabel} [${item.status}]: ${item.qualifiedDemandMetric} - ${item.sourceProof}; boundary: ${item.noFakeDemandBoundary}; next: ${item.followUpAction}`
  ));
}

function decisionLabel(decision: VentureDecisionType) {
  return VENTURE_DECISION_OPTIONS.find((option) => option.value === decision)?.label ?? decision;
}

export function buildVenturePortfolioDecisionCommandQueue(
  ventures: SavedVentureWorkspace[],
): VenturePortfolioDecisionCommand[] {
  const demandCaptureQueue = buildVentureDemandCaptureProofQueue(ventures);
  const productBuildQueue = buildVentureProductBuildCommandQueue(ventures);
  const launchControlQueue = buildVentureLaunchControlQueue(ventures);

  return ventures.map((venture) => {
    const owner = ventureLearningOwnerFor(venture);
    const demandItems = demandCaptureQueue.filter((item) => item.ventureId === venture.id);
    const productCommands = productBuildQueue.filter((item) => item.ventureId === venture.id);
    const launchItems = launchControlQueue.filter((item) => item.ventureId === venture.id);
    const revenuePosture = buildVentureRevenueGenerationPosture(venture);
    const scalePlan = buildVentureScaleStrongBranchPlan(venture);
    const killPressure = buildVentureKillPressureReport(venture);
    const killDecision = buildVentureKillDecisionArtifact(venture);
    const evidenceProfile = summarizeVentureEvidence(venture);
    const capturedDemandCount = demandItems.filter((item) => item.status === "captured").length;
    const weakDemandCount = demandItems.filter((item) => item.status === "weak").length;
    const blockedDemandCount = demandItems.filter((item) => item.status === "blocked").length;
    const noSendReplyDemandItems = demandItems.filter((item) => item.sourceType === "no-send-reply-proof");
    const nonNoSendDemandItems = nonNoSendDemandSourceItems(demandItems);
    const noSendReplyCapturedCount = noSendReplyDemandItems.filter((item) => item.status === "captured").length;
    const noSendReplyNeedsFollowUpCount = noSendReplyDemandItems.filter((item) => item.status === "needs-follow-up").length;
    const noSendReplyBlockedCount = noSendReplyDemandItems.filter((item) => item.status === "blocked").length;
    const noSendReplyWeakCount = noSendReplyDemandItems.filter((item) => item.status === "weak").length;
    const nonNoSendCapturedCount = capturedDemandCount - noSendReplyCapturedCount;
    const nonNoSendBlockedCount = blockedDemandCount - noSendReplyBlockedCount;
    const noSendReplyDedupeKeys = noSendReplyDemandDedupeKeys(noSendReplyDemandItems);
    const nonNoSendDemandStatus = demandSourceStatusCounts(nonNoSendDemandItems);
    const demandSourceTypeCountEntries = demandSourceTypeCounts(nonNoSendDemandItems);
    const demandSourceTypeSummary = demandSourceTypeCountSummary(nonNoSendDemandItems);
    const demandBlockerItems = demandSourceBlockerPressureItemsForVenture(demandItems);
    const demandSourceBlockerStatus = demandSourceStatusCounts(demandBlockerItems);
    const demandSourceBlockerTypeSummary = demandSourceTypeCountSummary(demandBlockerItems);
    const productBlockedCount = productCommands.filter((item) => item.status === "blocked").length;
    const productNeedsProofCount = productCommands.filter((item) => item.status === "needs-proof").length;
    const productVerifiedCount = productCommands.filter((item) => item.status === "verified").length;
    const launchBlockedCount = launchItems.filter((item) => item.status === "blocked").length;
    const launchReadyCount = launchItems.filter((item) => item.status === "ready").length;
    const launchNeedsApprovalCount = launchItems.filter((item) => item.status === "needs-approval").length;
    const openSupportIssues = venture.supportIssues.filter((issue) => (
      issue.status === "open" ||
      issue.status === "triaged" ||
      issue.status === "in-progress"
    ));
    const highSupportIssueCount = openSupportIssues.filter((issue) => issue.severity === "high" || issue.severity === "critical").length;
    const contradictions = [
      ...venture.contradictions,
      ...evidenceProfile.scoredSources.flatMap((source) => source.quality.warnings.filter((warning) => /contradict|conflict/i.test(warning))),
      ...killDecision.evidenceForStopping.filter((item) => /contradict|reject|failed|not differentiated|support|blocked|no payback|weak/i.test(item)),
    ].filter(Boolean);

    const recommendedDecision: VentureDecisionType = scalePlan.status === "scale-ready"
      ? "scale"
      : killPressure.recommendation === "kill" ||
        killPressure.recommendation === "pause" ||
        killPressure.recommendation === "pivot"
        ? killPressure.recommendation
        : blockedDemandCount > 0 ||
            productBlockedCount > 0 ||
            revenuePosture.status === "blocked" ||
            highSupportIssueCount > 0
          ? "pivot"
          : revenuePosture.status === "scaling-revenue" && scalePlan.status === "approval-required"
            ? "scale"
            : capturedDemandCount > 0 || revenuePosture.status !== "no-evidence"
              ? "continue"
              : "pivot";

    const blockers = [
      blockedDemandCount > 0 ? `${blockedDemandCount} demand-capture proof item${blockedDemandCount === 1 ? "" : "s"} blocked.` : "",
      demandBlockerItems.length > 0 ? `${demandBlockerItems.length} non-no-send demand source${demandBlockerItems.length === 1 ? "" : "s"} contribute blocker provenance.` : "",
      weakDemandCount > 0 && capturedDemandCount === 0 ? `${weakDemandCount} weak demand proof item${weakDemandCount === 1 ? "" : "s"} and no captured demand.` : "",
      revenuePosture.status === "blocked" || revenuePosture.status === "no-evidence" ? `Revenue posture is ${revenuePosture.status}.` : "",
      productBlockedCount > 0 ? `${productBlockedCount} product-build command${productBlockedCount === 1 ? "" : "s"} blocked.` : "",
      productNeedsProofCount > 0 ? `${productNeedsProofCount} product-build command${productNeedsProofCount === 1 ? "" : "s"} still need proof.` : "",
      launchBlockedCount > 0 ? `${launchBlockedCount} launch-control item${launchBlockedCount === 1 ? "" : "s"} blocked.` : "",
      launchNeedsApprovalCount > 0 ? `${launchNeedsApprovalCount} launch-control item${launchNeedsApprovalCount === 1 ? "" : "s"} need approval.` : "",
      highSupportIssueCount > 0 ? `${highSupportIssueCount} high or critical support issue${highSupportIssueCount === 1 ? "" : "s"} remain open.` : "",
      scalePlan.status === "blocked" ? `Scale plan is blocked: ${scalePlan.blockers[0] ?? scalePlan.summary}` : "",
    ].filter(Boolean);
    const needsProof = capturedDemandCount === 0 ||
      productNeedsProofCount > 0 ||
      launchNeedsApprovalCount > 0 ||
      revenuePosture.status === "no-evidence" ||
      evidenceProfile.readiness !== "decision-ready";
    const requiresHumanReview = recommendedDecision === "scale" ||
      recommendedDecision === "archive" ||
      launchNeedsApprovalCount > 0 ||
      scalePlan.status === "approval-required";
    const status = portfolioDecisionStatusFor({
      decision: recommendedDecision,
      blockers,
      needsProof,
      requiresHumanReview,
    });
    const priority = portfolioDecisionPriorityFor(status);
    const confidenceScore = clampScore(
      24 +
      killPressure.signals.length * 5 +
      capturedDemandCount * 5 +
      productVerifiedCount * 5 +
      launchReadyCount * 3 +
      revenuePosture.captureScore * 0.16 +
      scalePlan.scaleScore * 0.12 +
      evidenceProfile.readinessScore * 0.12 -
      blockers.length * 5 -
      (status === "blocked" ? 8 : 0),
    );
    const demandCaptureSummary = `${capturedDemandCount}/${demandItems.length} captured; ${blockedDemandCount} blocked; ${weakDemandCount} weak.`;
    const revenueSummary = `${revenuePosture.status} at ${revenuePosture.captureScore}/100: ${revenuePosture.primaryRevenueSource}`;
    const launchSummary = `${launchReadyCount}/${launchItems.length} ready; ${launchNeedsApprovalCount} need approval; ${launchBlockedCount} blocked.`;
    const productProofSummary = `${productVerifiedCount}/${productCommands.length} verified; ${productNeedsProofCount} need proof; ${productBlockedCount} blocked.`;
    const supportSummary = `${openSupportIssues.length} open support issue${openSupportIssues.length === 1 ? "" : "s"}; ${highSupportIssueCount} high or critical.`;
    const scaleSummary = `${scalePlan.status} at ${scalePlan.scaleScore}/100; ${scalePlan.nextAction}`;
    const killPressureSummary = `${killPressure.recommendation} / ${killPressure.severity}: ${killPressure.note}`;
    const contradictionProof = contradictions.length > 0
      ? contradictions.slice(0, 4).join(" | ")
      : `No explicit contradiction recorded; evidence readiness is ${evidenceProfile.readiness} with ${evidenceProfile.contradictionCount} contradiction${evidenceProfile.contradictionCount === 1 ? "" : "s"}.`;
    const decisionCommand = `Recommend ${decisionLabel(recommendedDecision)} for ${venture.title} with ${confidenceScore}/100 confidence after comparing demand capture, revenue posture, launch readiness, product proof, support load, scale plan, and kill pressure.`;
    const nextCommand = recommendedDecision === "scale"
      ? scalePlan.nextAction
      : recommendedDecision === "kill" || recommendedDecision === "pause"
        ? killDecision.nextActions[0] ?? "Record the human kill/pause decision and preserve revival conditions."
        : recommendedDecision === "pivot"
          ? killPressure.signals[0]?.nextAction ?? blockers[0] ?? "Run the cheapest disconfirmation step before continuing."
          : killDecision.nextActions[0] ?? revenuePosture.nextAction;
    const humanReviewBoundary = "This decision command is advisory and human-reviewed: it does not mutate lifecycle state, archive ventures, contact customers, spend money, deploy code, or change billing automatically.";
    const demandSourceProvenanceSummary = nonNoSendDemandItems.length === 0
      ? `No non-no-send demand sources are attached; ${noSendReplyDemandItems.length} no-send reply demand item${noSendReplyDemandItems.length === 1 ? "" : "s"} remain the only source-specific demand proof.`
      : `${nonNoSendDemandItems.length} non-no-send demand source${nonNoSendDemandItems.length === 1 ? "" : "s"} across ${demandSourceTypeCountEntries.length} type${demandSourceTypeCountEntries.length === 1 ? "" : "s"} (${demandSourceTypeSummary}): ${nonNoSendDemandStatus.captured} captured, ${nonNoSendDemandStatus.needsFollowUp} need follow-up, ${nonNoSendDemandStatus.blocked} blocked, ${nonNoSendDemandStatus.weak} weak; compare against ${noSendReplyDemandItems.length} no-send reply item${noSendReplyDemandItems.length === 1 ? "" : "s"}.`;
    const demandSourceDecisionNote = nonNoSendDemandItems.length === 0
      ? `No interview, cohort, pricing, money, outreach, browser, or drift demand source is available outside no-send reply proof for the ${decisionLabel(recommendedDecision)} recommendation.`
      : nonNoSendCapturedCount > 0 && noSendReplyCapturedCount > 0
        ? `The ${decisionLabel(recommendedDecision)} recommendation has captured demand from both non-no-send sources and redacted no-send replies, so operators can compare regular provenance against reply receipts before acting.`
        : nonNoSendCapturedCount > 0
          ? `The ${decisionLabel(recommendedDecision)} recommendation is backed by ${nonNoSendCapturedCount} captured non-no-send demand source${nonNoSendCapturedCount === 1 ? "" : "s"}; no-send reply proof is not the only demand basis.`
          : nonNoSendBlockedCount > 0
            ? `${nonNoSendBlockedCount} non-no-send demand source${nonNoSendBlockedCount === 1 ? "" : "s"} are blocked and add pivot/kill pressure independent of no-send replies.`
            : `Non-no-send demand provenance is present but still weak or follow-up only, so the ${decisionLabel(recommendedDecision)} recommendation should not treat aggregate demand as captured without more proof.`;
    const demandSourceBlockerSummary = demandBlockerItems.length === 0
      ? "No blocked non-no-send demand source or weak-only non-no-send demand pressure is contributing blocker pressure."
      : `${demandBlockerItems.length} non-no-send demand blocker source${demandBlockerItems.length === 1 ? "" : "s"} (${demandSourceBlockerTypeSummary}): ${demandSourceBlockerStatus.blocked} blocked and ${demandSourceBlockerStatus.weak} weak-without-captured pressure; review before accepting a ${decisionLabel(recommendedDecision)} command.`;
    const noSendReplyDemandSummary = noSendReplyDemandItems.length === 0
      ? "No redacted no-send email-gate reply receipts have been converted into demand-capture proof for this venture."
      : `${noSendReplyDemandItems.length} no-send email-gate reply receipt${noSendReplyDemandItems.length === 1 ? "" : "s"}: ${noSendReplyCapturedCount} captured / ${noSendReplyNeedsFollowUpCount} needs-follow-up / ${noSendReplyBlockedCount} blocked / ${noSendReplyWeakCount} weak across ${noSendReplyDedupeKeys.length} dedupe key${noSendReplyDedupeKeys.length === 1 ? "" : "s"}.`;
    const noSendReplyDecisionNote = noSendReplyDemandItems.length === 0
      ? `No-send email-gate reply demand did not influence the ${decisionLabel(recommendedDecision)} recommendation; it relied on the other demand, revenue, launch, product, support, scale, and kill-pressure signals above.`
      : noSendReplyBlockedCount > 0
        ? `${noSendReplyBlockedCount} redacted no-send email-gate reply receipt${noSendReplyBlockedCount === 1 ? "" : "s"} reported blocked demand; the explicit no-send reply signal pushed the recommendation toward ${decisionLabel(recommendedDecision)} instead of continue.`
        : recommendedDecision === "continue" || recommendedDecision === "scale"
          ? `${noSendReplyCapturedCount} of ${noSendReplyDemandItems.length} redacted no-send email-gate reply receipt${noSendReplyDemandItems.length === 1 ? "" : "s"} contributed captured demand evidence that supported the ${decisionLabel(recommendedDecision)} recommendation; ${nonNoSendCapturedCount} non-no-send captured demand item${nonNoSendCapturedCount === 1 ? "" : "s"} also backed it.`
          : recommendedDecision === "pivot" || recommendedDecision === "pause" || recommendedDecision === "kill"
            ? `${noSendReplyCapturedCount} captured / ${noSendReplyNeedsFollowUpCount} needs-follow-up / ${noSendReplyWeakCount} weak no-send email-gate reply receipt${noSendReplyDemandItems.length === 1 ? "" : "s"} were considered, but the ${decisionLabel(recommendedDecision)} recommendation was driven by other blockers above; no-send reply demand alone is not sufficient to flip it back to continue.`
            : `${noSendReplyDemandItems.length} no-send email-gate reply receipt${noSendReplyDemandItems.length === 1 ? "" : "s"} provided demand signal alongside other inputs for the ${decisionLabel(recommendedDecision)} recommendation.`;
    const noSendReplyDemandEvidence = noSendReplyDemandItems.slice(0, 4).map((item) => (
      `${item.sourceArtifactLabel} [${item.status}]: ${item.qualifiedDemandMetric} - ${item.sourceProof}`
    ));
    const demandSourceEvidence = demandSourceEvidenceLines(nonNoSendDemandItems);
    const demandSourceBlockerEvidence = demandSourceBlockerEvidenceLines(demandBlockerItems);
    const confidenceNote = `${confidenceScore}/100 includes +5 per captured demand item, including ${noSendReplyCapturedCount} captured redacted no-send repl${noSendReplyCapturedCount === 1 ? "y" : "ies"}, plus product, launch, revenue, scale, kill-pressure, and blocker penalties. ${noSendReplyDecisionNote}`;
    const evidence = [
      demandCaptureSummary,
      demandSourceProvenanceSummary,
      demandSourceDecisionNote,
      demandSourceBlockerSummary,
      confidenceNote,
      revenueSummary,
      launchSummary,
      productProofSummary,
      supportSummary,
      scaleSummary,
      killPressureSummary,
      noSendReplyDemandSummary,
      noSendReplyDecisionNote,
      ...demandSourceBlockerEvidence,
      ...demandSourceEvidence,
      ...demandItems.slice(0, 3).map((item) => `${item.sourceType}: ${item.qualifiedDemandMetric}`),
      ...productCommands.slice(0, 3).map((item) => `${item.sourceType}: ${item.status} via ${item.buildCommand}`),
      ...launchItems.slice(0, 3).map((item) => `${item.sourceType}: ${item.status} via ${item.launchCommand}`),
      ...noSendReplyDemandEvidence,
    ].filter(Boolean).slice(0, 22);

    return portfolioDecisionCommand({
      id: `${venture.id}-portfolio-decision-command`,
      ventureId: venture.id,
      title: venture.title,
      recommendedDecision,
      status,
      priority,
      confidenceScore,
      owner,
      decisionCommand,
      confidenceNote,
      contradictionProof,
      nextCommand,
      humanReviewBoundary,
      demandCaptureSummary,
      demandSourceProvenanceSummary,
      demandSourceDecisionNote,
      demandSourceBlockerSummary,
      revenueSummary,
      launchSummary,
      productProofSummary,
      supportSummary,
      scaleSummary,
      killPressureSummary,
      demandSourceEvidence,
      demandSourceBlockerEvidence,
      noSendReplyDemandSummary,
      noSendReplyDecisionNote,
      noSendReplyDemandEvidence,
      evidence,
      blockers,
    });
  }).sort((a, b) => (
    decisionPressureRank(b.recommendedDecision) - decisionPressureRank(a.recommendedDecision) ||
    b.confidenceScore - a.confidenceScore ||
    a.title.localeCompare(b.title)
  ));
}

function demandSourceBlockerDrilldownMarkdown(
  item: Omit<VentureDemandSourceBlockerDrilldownItem, "markdown">,
) {
  return [
    `# Demand Source Blocker Drilldown: ${item.sourceType}`,
    "",
    "## Summary",
    item.summary,
    "",
    "## Decisions",
    ...(item.decisionCounts.length > 0
      ? item.decisionCounts.map((decision) => `- ${decision.decision}: ${decision.count}`)
      : ["- No linked portfolio decision command."]),
    "",
    "## Ventures",
    ...(item.ventureTitles.length > 0
      ? item.ventureTitles.map((title) => `- ${title}`)
      : ["- No ventures linked."]),
    "",
    "## Evidence",
    ...(item.evidence.length > 0
      ? item.evidence.map((line) => `- ${line}`)
      : ["- No blocker evidence attached."]),
    "",
    "## Operator Search Query",
    item.searchQuery,
  ].join("\n");
}

export function buildVentureDemandSourceBlockerDrilldowns(
  ventures: SavedVentureWorkspace[],
): VentureDemandSourceBlockerDrilldownItem[] {
  const demandCaptureQueue = buildVentureDemandCaptureProofQueue(ventures);
  const commandQueue = buildVenturePortfolioDecisionCommandQueue(ventures);
  const commandByVentureId = new Map(commandQueue.map((command) => [command.ventureId, command]));
  const commandById = new Map(commandQueue.map((command) => [command.id, command]));
  const groups = new Map<VentureDemandCaptureProofSourceType, {
    sourceType: VentureDemandCaptureProofSourceType;
    items: VentureDemandCaptureProofQueueItem[];
    ventureIds: Set<string>;
    ventureTitles: Set<string>;
    commandIds: Set<string>;
  }>();

  ventures.forEach((venture) => {
    const blockerItems = demandSourceBlockerPressureItemsForVenture(
      demandCaptureQueue.filter((item) => item.ventureId === venture.id),
    );
    const command = commandByVentureId.get(venture.id);

    demandSourceTypeCounts(blockerItems).forEach(([sourceType]) => {
      const sourceItems = blockerItems.filter((item) => item.sourceType === sourceType);
      const group = groups.get(sourceType) ?? {
        sourceType,
        items: [],
        ventureIds: new Set<string>(),
        ventureTitles: new Set<string>(),
        commandIds: new Set<string>(),
      };
      sourceItems.forEach((item) => group.items.push(item));
      group.ventureIds.add(venture.id);
      group.ventureTitles.add(venture.title);
      if (command) group.commandIds.add(command.id);
      groups.set(sourceType, group);
    });
  });

  return Array.from(groups.values()).map((group) => {
    const commandIds = Array.from(group.commandIds).sort();
    const decisionCounts = Array.from(commandIds.reduce<Map<VentureDecisionType, number>>((counts, commandId) => {
      const command = commandById.get(commandId);
      if (command) counts.set(command.recommendedDecision, (counts.get(command.recommendedDecision) ?? 0) + 1);
      return counts;
    }, new Map()).entries())
      .map(([decision, count]) => ({ decision, count }))
      .sort((a, b) => decisionPressureRank(b.decision) - decisionPressureRank(a.decision) || a.decision.localeCompare(b.decision));
    const decisionSummary = decisionCounts.length > 0
      ? decisionCounts.map((entry) => `${entry.decision}: ${entry.count}`).join("; ")
      : "none";
    const blockedCount = group.items.filter((item) => item.status === "blocked").length;
    const weakPressureCount = group.items.filter((item) => item.status === "weak").length;
    const ventureIds = Array.from(group.ventureIds).sort();
    const ventureTitles = Array.from(group.ventureTitles).sort((a, b) => a.localeCompare(b));
    const evidence = group.items.slice(0, 12).map((item) => {
      const command = commandByVentureId.get(item.ventureId);
      const decisionText = command ? `${command.recommendedDecision}/${command.status}` : "no-command";
      return `${item.title} -> ${decisionText}: ${item.sourceArtifactLabel} [${item.status}] ${item.qualifiedDemandMetric} - ${item.sourceProof}; next: ${item.followUpAction}`;
    });
    const count = group.items.length;
    const summary = `${group.sourceType} contributes ${count} demand-source blocker${count === 1 ? "" : "s"} across ${ventureIds.length} venture${ventureIds.length === 1 ? "" : "s"}: ${blockedCount} blocked, ${weakPressureCount} weak-without-captured pressure; decisions ${decisionSummary}.`;
    const drilldown: Omit<VentureDemandSourceBlockerDrilldownItem, "markdown"> = {
      id: `demand-source-blocker-drilldown-${group.sourceType}`,
      sourceType: group.sourceType,
      count,
      blockedCount,
      weakPressureCount,
      ventureCount: ventureIds.length,
      commandCount: commandIds.length,
      ventureIds,
      ventureTitles,
      commandIds,
      decisionCounts,
      summary,
      searchQuery: `demand source blocker drilldown ${group.sourceType}`,
      evidence,
    };

    return {
      ...drilldown,
      markdown: demandSourceBlockerDrilldownMarkdown(drilldown),
    };
  }).sort((a, b) => (
    b.count - a.count ||
    b.blockedCount - a.blockedCount ||
    a.sourceType.localeCompare(b.sourceType)
  ));
}

function hasSourceBackedEvidence(venture: SavedVentureWorkspace) {
  return venture.evidenceSources.some((source) => {
    const platform = source.platform.trim().toLowerCase();
    const isOperatorNote = platform === "operator-note" || platform === "manual" || platform === "founder-note";
    return !isOperatorNote && Boolean(source.url.trim());
  });
}

export function buildVentureReadinessNotices(venture: SavedVentureWorkspace): VentureReadinessNotice[] {
  const evidenceProfile = summarizeVentureEvidence(venture);
  const demandCalibration = calibrateVentureDemand(venture);
  const pricingCalibration = calibrateVenturePricing(venture);
  const notices: VentureReadinessNotice[] = [];

  if (!hasSourceBackedEvidence(venture)) {
    notices.push({
      id: "source-backed-evidence",
      tone: "blocked",
      title: "No source-backed evidence attached",
      detail: "This workspace still relies on operator notes or empty evidence, so the thesis is not decision-ready.",
      nextAction: "Attach recent URLs, quotes, or platform evidence before making build or spend decisions.",
    });
  } else if (evidenceProfile.readiness !== "decision-ready") {
    notices.push({
      id: "evidence-readiness-degraded",
      tone: "degraded",
      title: `Evidence readiness is ${evidenceProfile.readiness}`,
      detail: `${evidenceProfile.missingEvidenceCount} evidence gap${evidenceProfile.missingEvidenceCount === 1 ? "" : "s"} and ${evidenceProfile.contradictionCount} contradiction${evidenceProfile.contradictionCount === 1 ? "" : "s"} still need review.`,
      nextAction: "Complete the highest-priority gap action before changing lifecycle status.",
    });
  }

  if (demandCalibration.measuredExperimentCount === 0) {
    notices.push({
      id: "experiment-result-empty",
      tone: "empty",
      title: "No measured experiment result",
      detail: "Demand, conversion, and prediction calibration are still unproven.",
      nextAction: "Record the first fake-door, pricing, or concierge experiment result.",
    });
  }

  if (pricingCalibration.signalCount === 0) {
    notices.push({
      id: "pricing-signal-empty",
      tone: "empty",
      title: "No pricing signal",
      detail: "The willingness-to-pay forecast has no buyer count, paid commitment, invoice request, or price objection.",
      nextAction: "Capture a pricing signal from interviews, checkout intent, or pilot commitment.",
    });
  }

  if (venture.customerInterviews.length === 0) {
    notices.push({
      id: "customer-interview-empty",
      tone: "empty",
      title: "No customer interview",
      detail: "The buyer and pain are not grounded in a saved customer quote yet.",
      nextAction: "Record a persona, pain quote, willingness-to-pay quote, and objections.",
    });
  }

  if (venture.mvpBuildWorkspaces.length === 0) {
    notices.push({
      id: "mvp-workspace-empty",
      tone: "blocked",
      title: "No MVP build workspace",
      detail: "There is no repo path, setup check, test check, build check, browser smoke, or deployment check attached.",
      nextAction: "Create or attach an MVP build workspace before treating the product as executable.",
    });
  }

  if (venture.artifactRecords.length === 0) {
    notices.push({
      id: "artifact-proof-empty",
      tone: "blocked",
      title: "No artifact proof",
      detail: "No build brief, source repo, test report, browser smoke, deployment proof, analytics plan, or changelog is saved.",
      nextAction: "Attach the next concrete artifact and its verification command.",
    });
  }

  if (venture.competitors.length === 0) {
    notices.push({
      id: "competitor-watch-empty",
      tone: "empty",
      title: "No competitor watch saved",
      detail: "Substitutes and status quo pressure are still only inferred from the workspace.",
      nextAction: "Commit the strongest substitute or status quo into the competitor watchlist.",
    });
  }

  if (venture.autonomyAudit.length === 0) {
    notices.push({
      id: "autonomy-audit-empty",
      tone: "empty",
      title: "No autonomy audit saved",
      detail: "Risky or external actions do not yet have a saved actor, approval level, side-effect boundary, or replay note.",
      nextAction: "Save an autonomy audit before any external launch, outreach, spend, billing, or deployment action.",
    });
  }

  return notices;
}

export function buildVentureGapActionQueue(venture: SavedVentureWorkspace): VentureGapActionTask[] {
  const profile = summarizeVentureEvidence(venture);
  const missingEvidenceTasks: VentureGapActionTask[] = venture.killCriteria.missingEvidence.map((gap, index) => ({
    id: `${venture.id}-missing-${index + 1}`,
    ventureId: venture.id,
    type: "missing-evidence",
    priority: "high",
    title: `Research missing evidence: ${gap}`,
    reason: `The venture cannot be decision-ready until ${gap} is checked against fresh sources.`,
    prompt: [
      `Follow-up research for ${venture.title}.`,
      `Validate missing evidence: ${gap}.`,
      `Target buyer: ${venture.targetBuyer}.`,
      `Current thesis: ${venture.productWedge}.`,
      "Return source URLs, buyer objections, contradiction notes, and a continue/pivot/kill recommendation.",
    ].join(" "),
  }));
  const contradictionTasks: VentureGapActionTask[] = venture.contradictions.map((contradiction, index) => ({
    id: `${venture.id}-contradiction-${index + 1}`,
    ventureId: venture.id,
    type: "contradiction",
    priority: "high",
    title: `Resolve contradiction: ${contradiction}`,
    reason: "Contradictory evidence should be resolved before scaling the venture.",
    prompt: [
      `Resolve this contradiction for ${venture.title}: ${contradiction}.`,
      `Buyer: ${venture.targetBuyer}.`,
      "Find fresh supporting and opposing evidence, then recommend whether to continue, pivot, pause, or kill.",
    ].join(" "),
  }));
  const weakSourceTasks: VentureGapActionTask[] = profile.scoredSources
    .filter((source) => source.quality.score < 62)
    .slice(0, 3)
    .map((source) => ({
      id: `${venture.id}-weak-source-${source.id}`,
      ventureId: venture.id,
      type: "weak-source",
      priority: "medium",
      title: `Replace weak source: ${source.title}`,
      reason: `${source.platform} evidence scored ${source.quality.score}/100 because ${source.quality.warnings.join("; ") || "source quality is thin"}.`,
      prompt: [
        `Find a stronger replacement source for ${venture.title}.`,
        `Weak source: ${source.title}.`,
        `Platform: ${source.platform}.`,
        "Prefer recent sources with URL, title, summary, keywords, and engagement metadata.",
      ].join(" "),
    }));
  const readinessTask: VentureGapActionTask[] = profile.readiness === "decision-ready" ? [] : [{
    id: `${venture.id}-readiness-review`,
    ventureId: venture.id,
    type: "readiness-review",
    priority: profile.readiness === "too-thin" ? "high" : "medium",
    title: `Run readiness review: ${profile.readiness}`,
    reason: `Evidence readiness is ${profile.readiness} at ${profile.readinessScore}/100.`,
    prompt: [
      `Run a decision-readiness review for ${venture.title}.`,
      `Current readiness: ${profile.readiness} (${profile.readinessScore}/100).`,
      `Missing evidence count: ${profile.missingEvidenceCount}.`,
      `Contradiction count: ${profile.contradictionCount}.`,
      "Produce the cheapest next experiment and a clear continue/pivot/kill threshold.",
    ].join(" "),
  }];

  return [
    ...missingEvidenceTasks,
    ...contradictionTasks,
    ...weakSourceTasks,
    ...readinessTask,
  ];
}

function classifyExperimentCalibration(result: string, interpretation: string): VentureExperimentCalibration["status"] {
  const text = `${result} ${interpretation}`.toLowerCase();
  if (/\b(fail|failed|below|missed|reject|rejected|refuse|refused|no demand|weak demand|weak buyer urgency)\b/.test(text)) {
    return "failed";
  }
  if (/\b(pass|passed|crossed|above|met|exceeded|qualified|converted|strong demand|paid|invoice)\b/.test(text)) {
    return "passed";
  }
  return "inconclusive";
}

export function calibrateVentureDemand(venture: SavedVentureWorkspace): VentureDemandCalibration {
  const predictionByExperimentId = new Map(
    venture.predictionSnapshots.map((prediction) => [prediction.experimentId, prediction]),
  );
  const experiments = venture.experiments
    .filter((experiment) => experiment.result.trim() && experiment.result !== "Not run yet.")
    .map<VentureExperimentCalibration>((experiment) => {
      const status = classifyExperimentCalibration(experiment.result, experiment.interpretation);
      const prediction = predictionByExperimentId.get(experiment.id);
      const predictionAlignment = alignPrediction(prediction?.predictedOutcome, status);
      return {
        experimentId: experiment.id,
        type: experiment.type,
        status,
        result: experiment.result,
        interpretation: experiment.interpretation,
        successThreshold: experiment.successThreshold,
        failureThreshold: experiment.failureThreshold,
        recordedAt: experiment.recordedAt,
        prediction,
        predictionAlignment,
        note: `${experiment.type}: ${status} against success threshold "${experiment.successThreshold}" and failure threshold "${experiment.failureThreshold}". Prediction alignment: ${predictionAlignment}.`,
      };
    });
  const passCount = experiments.filter((experiment) => experiment.status === "passed").length;
  const failCount = experiments.filter((experiment) => experiment.status === "failed").length;
  const inconclusiveCount = experiments.filter((experiment) => experiment.status === "inconclusive").length;
  const status: VentureDemandCalibrationStatus = experiments.length === 0
    ? "not-measured"
    : failCount > 0
      ? "failed"
      : passCount > 0
        ? "passed"
        : "inconclusive";

  return {
    status,
    measuredExperimentCount: experiments.length,
    passCount,
    failCount,
    inconclusiveCount,
    experiments,
  };
}

export function calibrateVenturePricing(venture: SavedVentureWorkspace): VenturePricingCalibration {
  const signalCount = venture.pricingSignals.length;
  const qualifiedBuyerCount = venture.pricingSignals.reduce((sum, signal) => sum + signal.qualifiedBuyerCount, 0);
  const paidCommitmentCount = venture.pricingSignals.reduce((sum, signal) => sum + signal.paidCommitmentCount, 0);
  const invoiceRequestCount = venture.pricingSignals.reduce((sum, signal) => sum + signal.invoiceRequestCount, 0);
  const paidSignalCount = paidCommitmentCount + invoiceRequestCount;
  const latestSignal = venture.pricingSignals[0];
  const strongestAcceptedPrice = venture.pricingSignals.find((signal) => signal.acceptedPrice.trim())?.acceptedPrice ?? "No accepted price recorded";
  const rejectionLanguage = venture.pricingSignals.some((signal) => (
    /\b(too expensive|no budget|refuse|refused|won't pay|would not pay|free|reject|rejected|price sensitive|student discount)\b/i
      .test(`${signal.objectionSummary} ${signal.evidenceNote}`)
  ));
  const willingnessToPayScore = qualifiedBuyerCount > 0
    ? clampScore((paidSignalCount / qualifiedBuyerCount) * 100)
    : clampScore(paidSignalCount * 20);
  const status: VenturePricingCalibrationStatus = signalCount === 0
    ? "not-measured"
    : paidSignalCount >= 3
      ? "validated"
      : paidSignalCount > 0
        ? "weak"
        : qualifiedBuyerCount >= 3 && rejectionLanguage
          ? "rejected"
          : "inconclusive";

  return {
    status,
    signalCount,
    qualifiedBuyerCount,
    paidCommitmentCount,
    invoiceRequestCount,
    paidSignalCount,
    willingnessToPayScore,
    strongestAcceptedPrice,
    latestSignal,
    note: signalCount === 0
      ? `No willingness-to-pay evidence has been recorded against "${venture.pricingHypothesis}" yet.`
      : `${paidSignalCount} paid signal${paidSignalCount === 1 ? "" : "s"} from ${qualifiedBuyerCount} qualified buyer${qualifiedBuyerCount === 1 ? "" : "s"} against "${venture.pricingHypothesis}".`,
  };
}

function decisionPressureRank(decision: VentureDecisionType) {
  if (decision === "kill") return 5;
  if (decision === "pause") return 4;
  if (decision === "pivot") return 3;
  if (decision === "scale") return 2;
  return 1;
}

function severityRank(severity: VentureKillPressureSeverity) {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function textForKillClassifier(venture: SavedVentureWorkspace) {
  return [
    venture.title,
    venture.targetBuyer,
    venture.painStatement,
    venture.productWedge,
    venture.revenueModel,
    venture.pricingHypothesis,
    ...venture.acquisitionChannels,
    ...venture.companySimulation.customerSegments,
    venture.companySimulation.salesCycle,
    venture.companySimulation.pricing,
    venture.companySimulation.cac,
    venture.companySimulation.paybackPeriod,
    venture.companySimulation.expansion,
    venture.companySimulation.competitiveResponse,
    ...venture.companySimulation.failureModes,
    ...venture.killCriteria.killReasons,
    ...venture.killCriteria.stopTriggers,
    ...venture.evidenceSources.flatMap((source) => [source.title, source.summary, source.keywords]),
    ...venture.competitors.flatMap((competitor) => [
      competitor.competitorName,
      competitor.positioning,
      competitor.evidence,
      competitor.differentiation,
      competitor.responsePlan,
    ]),
  ].join(" ");
}

function buildMarketSizeKillSignal(venture: SavedVentureWorkspace): VentureKillPressureSignal | null {
  const text = textForKillClassifier(venture);
  const explicitSmallMarket = /\b(market too small|tam too small|small market|tiny market|limited market|niche too small|not enough buyers|too few buyers|handful of buyers|single buyer|single campus|one campus|one club|local-only|not scalable|can't scale|cannot scale)\b/i.test(text);
  if (!explicitSmallMarket) return null;

  return {
    id: `${venture.id}-kill-pressure-market-size`,
    dimension: "market-size",
    severity: "critical",
    recommendation: "kill",
    title: "Market too small",
    reason: "Market-size evidence or simulation text says the reachable buyer pool is too small or not scalable.",
    nextAction: "Do not build until the buyer segment, reachable market, and expansion path are materially larger.",
  };
}

function buildDifferentiationKillSignal(venture: SavedVentureWorkspace): VentureKillPressureSignal | null {
  const text = textForKillClassifier(venture);
  const explicitlyUndifferentiated = /\b(not differentiated|no differentiation|undifferentiated|commodity|copycat|me-too|same as existing|no moat|no wedge|weak wedge)\b/i.test(text);
  const copyableSubstitutePressure = /\b(substitutes? can copy|easy to copy|buyers already use|already use .*templates?|status quo|current substitute|switching cost)\b/i.test(text);
  if (!explicitlyUndifferentiated && !copyableSubstitutePressure) return null;

  return {
    id: `${venture.id}-kill-pressure-differentiation`,
    dimension: "differentiation",
    severity: explicitlyUndifferentiated ? "high" : "medium",
    recommendation: explicitlyUndifferentiated ? "kill" : "pivot",
    title: explicitlyUndifferentiated ? "Product not differentiated" : "Product differentiation unproven",
    reason: explicitlyUndifferentiated
      ? "Competitive evidence says the product is not meaningfully differentiated from existing alternatives."
      : "Substitute or status-quo pressure can copy the wedge before switching-cost evidence proves otherwise.",
    nextAction: "Prove a unique wedge against the strongest substitute before adding build scope or paid acquisition.",
  };
}

function buildBuyerUrgencyKillSignal(
  venture: SavedVentureWorkspace,
  demandCalibration: VentureDemandCalibration,
  pricingCalibration: VenturePricingCalibration,
  activationRate: number,
): VentureKillPressureSignal | null {
  const weakUrgencyPattern = /\b(not urgent|no urgency|low urgency|not a priority|low priority|nice to have|would not switch|wouldn't switch|won't switch|will not switch|does not care|doesn't care|do not care|don't care|not painful|no budget|won't pay|would not pay|no paid intent|liked the idea but|meh)\b/i;
  const failedUrgencyExperiment = venture.experiments.find((experiment) => (
    weakUrgencyPattern.test(`${experiment.result} ${experiment.interpretation} ${experiment.failureThreshold}`) &&
    classifyExperimentCalibration(experiment.result, experiment.interpretation) === "failed"
  ));
  const weakInterview = venture.customerInterviews.find((interview) => (
    interview.sentiment === "negative" ||
    weakUrgencyPattern.test(`${interview.painQuote} ${interview.willingnessToPay} ${interview.objections} ${interview.evidenceNote}`)
  ));
  const rejectedPricingSignal = pricingCalibration.status === "rejected"
    ? venture.pricingSignals.find((signal) => weakUrgencyPattern.test(`${signal.objectionSummary} ${signal.evidenceNote}`)) ?? venture.pricingSignals[0]
    : undefined;
  const weakActivationCohort = venture.activationCohorts.find((cohort) => (
    cohort.signupCount >= 5 &&
    cohort.activatedCount / Math.max(cohort.signupCount, 1) < 0.2
  ));

  const reasons = [
    failedUrgencyExperiment ? `${failedUrgencyExperiment.type} failed with weak urgency: ${failedUrgencyExperiment.interpretation || failedUrgencyExperiment.result}` : "",
    weakInterview ? `${weakInterview.persona} interview shows weak urgency or negative sentiment.` : "",
    rejectedPricingSignal ? `Pricing evidence rejected payment: ${rejectedPricingSignal.objectionSummary || rejectedPricingSignal.evidenceNote}` : "",
    weakActivationCohort ? `Activation is ${Math.round(activationRate)}% after ${weakActivationCohort.signupCount} signups.` : "",
  ].filter(Boolean);

  if (reasons.length === 0) return null;

  return {
    id: `${venture.id}-kill-pressure-buyer-urgency`,
    dimension: "demand",
    severity: failedUrgencyExperiment || rejectedPricingSignal ? "critical" : "high",
    recommendation: "kill",
    title: "Buyer does not care",
    reason: reasons.join(" "),
    nextAction: "Do not build more until a buyer shows urgent switching behavior, paid intent, or repeated activation.",
  };
}

export function buildVentureKillPressureReport(venture: SavedVentureWorkspace): VentureKillPressureReport {
  const signals: VentureKillPressureSignal[] = [];
  const pushSignal = (signal: VentureKillPressureSignal) => signals.push(signal);
  const evidenceProfile = summarizeVentureEvidence(venture);
  const demandCalibration = calibrateVentureDemand(venture);
  const pricingCalibration = calibrateVenturePricing(venture);
  const openSupportIssues = venture.supportIssues.filter((issue) => (
    issue.status === "open" ||
    issue.status === "triaged" ||
    issue.status === "in-progress"
  ));
  const totalSignups = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.signupCount, 0);
  const totalActivated = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.activatedCount, 0);
  const totalRetained = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.retainedCount, 0);
  const activationRate = totalSignups > 0 ? (totalActivated / totalSignups) * 100 : 0;
  const retentionRate = totalActivated > 0 ? (totalRetained / totalActivated) * 100 : 0;
  const marketSizeSignal = buildMarketSizeKillSignal(venture);
  const differentiationSignal = buildDifferentiationKillSignal(venture);
  const buyerUrgencySignal = buildBuyerUrgencyKillSignal(venture, demandCalibration, pricingCalibration, activationRate);

  if (evidenceProfile.readiness === "too-thin") {
    pushSignal({
      id: `${venture.id}-kill-pressure-evidence`,
      dimension: "evidence",
      severity: "high",
      recommendation: "kill",
      title: "Evidence too thin",
      reason: `Readiness is ${evidenceProfile.readiness} at ${evidenceProfile.readinessScore}/100.`,
      nextAction: "Do not scale until missing evidence or contradictions are resolved.",
    });
  } else if (evidenceProfile.readiness === "needs-pressure-test") {
    pushSignal({
      id: `${venture.id}-kill-pressure-evidence-review`,
      dimension: "evidence",
      severity: "medium",
      recommendation: "pivot",
      title: "Evidence needs pressure test",
      reason: `Readiness is ${evidenceProfile.readiness} with ${evidenceProfile.missingEvidenceCount} missing evidence gap${evidenceProfile.missingEvidenceCount === 1 ? "" : "s"}.`,
      nextAction: "Run the cheapest disconfirmation test before new build or spend.",
    });
  }

  if (marketSizeSignal) pushSignal(marketSizeSignal);
  if (differentiationSignal) pushSignal(differentiationSignal);
  if (buyerUrgencySignal) pushSignal(buyerUrgencySignal);

  if (demandCalibration.status === "failed") {
    pushSignal({
      id: `${venture.id}-kill-pressure-demand`,
      dimension: "demand",
      severity: "critical",
      recommendation: "kill",
      title: "Demand failed threshold",
      reason: `${demandCalibration.failCount} measured experiment${demandCalibration.failCount === 1 ? "" : "s"} failed.`,
      nextAction: "Stop or redefine the buyer pain before adding product scope.",
    });
  } else if (demandCalibration.status === "passed") {
    pushSignal({
      id: `${venture.id}-kill-pressure-demand-pass`,
      dimension: "demand",
      severity: "low",
      recommendation: "continue",
      title: "Demand passed threshold",
      reason: `${demandCalibration.passCount} measured experiment${demandCalibration.passCount === 1 ? "" : "s"} passed.`,
      nextAction: "Tie demand to activation, retention, support load, and payback before scaling.",
    });
  }

  if (pricingCalibration.status === "rejected") {
    pushSignal({
      id: `${venture.id}-kill-pressure-pricing`,
      dimension: "pricing",
      severity: "high",
      recommendation: "pivot",
      title: "Pricing rejected",
      reason: pricingCalibration.note,
      nextAction: "Change price, buyer segment, or value wedge before building more.",
    });
  } else if (pricingCalibration.status === "validated") {
    pushSignal({
      id: `${venture.id}-kill-pressure-pricing-validated`,
      dimension: "pricing",
      severity: "low",
      recommendation: "continue",
      title: "Pricing validated",
      reason: pricingCalibration.note,
      nextAction: "Connect paid intent to delivered retention and payback.",
    });
  }

  if (venture.activationCohorts.length > 0 && retentionRate < 40) {
    pushSignal({
      id: `${venture.id}-kill-pressure-retention`,
      dimension: "retention",
      severity: "high",
      recommendation: "pivot",
      title: "Retention weak",
      reason: `Retention is ${Math.round(retentionRate)}% from ${totalActivated} activated user${totalActivated === 1 ? "" : "s"}.`,
      nextAction: "Fix repeat usage before buying more traffic.",
    });
  } else if (venture.activationCohorts.length > 0 && activationRate >= 50 && retentionRate >= 50) {
    pushSignal({
      id: `${venture.id}-kill-pressure-retention-healthy`,
      dimension: "retention",
      severity: "low",
      recommendation: "continue",
      title: "Activation and retention usable",
      reason: `Activation is ${Math.round(activationRate)}% and retention is ${Math.round(retentionRate)}%.`,
      nextAction: "Keep measuring cohort quality against support load and payback.",
    });
  }

  if (openSupportIssues.some((issue) => issue.severity === "critical" || issue.severity === "high")) {
    pushSignal({
      id: `${venture.id}-kill-pressure-support`,
      dimension: "support",
      severity: "high",
      recommendation: "pause",
      title: "Support load pressure",
      reason: `${openSupportIssues.length} open support issue${openSupportIssues.length === 1 ? "" : "s"} include high or critical severity.`,
      nextAction: "Resolve high-severity support issues before scaling acquisition.",
    });
  }

  if (venture.channelEconomics.some((economics) => economics.paybackStatus === "no-payback")) {
    pushSignal({
      id: `${venture.id}-kill-pressure-channel-no-payback`,
      dimension: "channel-economics",
      severity: "high",
      recommendation: "pivot",
      title: "Channel has no payback",
      reason: "At least one channel has spend with no recorded revenue payback.",
      nextAction: "Change channel, offer, or buyer before repeating spend.",
    });
  } else if (venture.channelEconomics.some((economics) => economics.paybackStatus === "partial-payback")) {
    pushSignal({
      id: `${venture.id}-kill-pressure-channel-partial-payback`,
      dimension: "channel-economics",
      severity: "medium",
      recommendation: "pause",
      title: "Channel payback incomplete",
      reason: "At least one channel has revenue but has not paid back spend.",
      nextAction: "Improve conversion or monetization before increasing spend.",
    });
  } else if (venture.channelEconomics.some((economics) => economics.paybackStatus === "paid-back")) {
    pushSignal({
      id: `${venture.id}-kill-pressure-channel-paid-back`,
      dimension: "channel-economics",
      severity: "low",
      recommendation: "scale",
      title: "Channel paid back",
      reason: "At least one channel has recorded revenue greater than or equal to spend.",
      nextAction: "Scale only if support load and retention stay healthy.",
    });
  }

  const recommendation = signals.reduce<VentureDecisionType>((current, signal) => (
    decisionPressureRank(signal.recommendation) > decisionPressureRank(current)
      ? signal.recommendation
      : current
  ), "continue");
  const severity = signals.reduce<VentureKillPressureSeverity>((current, signal) => (
    severityRank(signal.severity) > severityRank(current)
      ? signal.severity
      : current
  ), "low");

  const orderedSignals = [...signals].sort((a, b) => (
    severityRank(b.severity) - severityRank(a.severity) ||
    decisionPressureRank(b.recommendation) - decisionPressureRank(a.recommendation)
  ));

  return {
    recommendation,
    severity,
    signals: orderedSignals,
    note: signals.length === 0
      ? "No kill-pressure rules have enough evidence yet."
      : `${signals.length} pressure signal${signals.length === 1 ? "" : "s"} point to ${recommendation}.`,
  };
}

function componentAverageScore(components: VentureDemandDriftComponent[]) {
  if (components.length === 0) return 0;
  return clampScore(components.reduce((sum, component) => sum + component.score, 0) / components.length);
}

function demandCalibrationRealityComponent(calibration: VentureDemandCalibration): VentureDemandDriftComponent | null {
  if (calibration.status === "not-measured") return null;
  const score = calibration.status === "passed"
    ? 82
    : calibration.status === "failed"
      ? 18
      : 45;

  return {
    source: "experiment",
    label: "Measured experiments",
    score,
    evidence: `${calibration.passCount} pass, ${calibration.failCount} fail, ${calibration.inconclusiveCount} inconclusive.`,
  };
}

function pricingRealityComponent(calibration: VenturePricingCalibration): VentureDemandDriftComponent | null {
  if (calibration.status === "not-measured") return null;
  const score = calibration.status === "validated"
    ? 82
    : calibration.status === "weak"
      ? 60
      : calibration.status === "rejected"
        ? 20
        : 42;

  return {
    source: "pricing",
    label: "Willingness to pay",
    score,
    evidence: calibration.note,
  };
}

function activationRealityComponent(venture: SavedVentureWorkspace): VentureDemandDriftComponent | null {
  const signupCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.signupCount, 0);
  if (signupCount === 0) return null;

  const activatedCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.activatedCount, 0);
  const retainedCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.retainedCount, 0);
  const paidCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.paidCount, 0);
  const supportIssueCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.supportIssueCount, 0);
  const activationRate = (activatedCount / Math.max(signupCount, 1)) * 100;
  const retentionRate = activatedCount > 0 ? (retainedCount / activatedCount) * 100 : 0;
  const paidRate = (paidCount / Math.max(signupCount, 1)) * 100;
  const score = clampScore(
    activationRate * 0.45 +
    retentionRate * 0.35 +
    paidRate * 0.2 +
    (paidCount > 0 ? 10 : 0) -
    Math.min(20, supportIssueCount * 4),
  );

  return {
    source: "activation",
    label: "Activation cohorts",
    score,
    evidence: `${signupCount} signups, ${Math.round(activationRate)}% activation, ${Math.round(retentionRate)}% retention, ${paidCount} paid.`,
  };
}

function channelRealityComponent(venture: SavedVentureWorkspace): VentureDemandDriftComponent | null {
  if (venture.channelEconomics.length === 0) return null;
  const statusScores: Record<VenturePaybackStatus, number> = {
    unknown: 42,
    "no-payback": 22,
    "partial-payback": 55,
    "paid-back": 78,
  };
  const score = componentAverageScore(
    venture.channelEconomics.map((economics): VentureDemandDriftComponent => ({
      source: "channel",
      label: economics.channel,
      score: statusScores[economics.paybackStatus],
      evidence: economics.paybackStatus,
    })),
  );
  const paidBackCount = venture.channelEconomics.filter((economics) => economics.paybackStatus === "paid-back").length;

  return {
    source: "channel",
    label: "Channel payback",
    score,
    evidence: `${paidBackCount} paid-back channel${paidBackCount === 1 ? "" : "s"} across ${venture.channelEconomics.length} recorded channel${venture.channelEconomics.length === 1 ? "" : "s"}.`,
  };
}

function killPressureRealityComponent(report: VentureKillPressureReport): VentureDemandDriftComponent | null {
  const realityDimensions: VentureKillPressureDimension[] = ["demand", "pricing", "retention", "channel-economics"];
  const realitySignals = report.signals.filter((signal) => realityDimensions.includes(signal.dimension));
  if (realitySignals.length === 0) return null;

  const leadingSignal = [...realitySignals].sort((a, b) => (
    decisionPressureRank(b.recommendation) - decisionPressureRank(a.recommendation) ||
    severityRank(b.severity) - severityRank(a.severity)
  ))[0];
  const scoreByRecommendation: Record<VentureDecisionType, number> = {
    continue: 70,
    scale: 84,
    pivot: 32,
    pause: 38,
    kill: 12,
    archive: 20,
  };

  return {
    source: "kill-pressure",
    label: "Kill-pressure reality",
    score: scoreByRecommendation[leadingSignal.recommendation],
    evidence: realitySignals.map((signal) => signal.title).slice(0, 3).join("; "),
  };
}

function evaluationLensRealityComponent(venture: SavedVentureWorkspace): VentureDemandDriftComponent | null {
  const lensSummary = summarizeEvaluationLenses(venture);
  if (lensSummary.lenses.length === 0) return null;
  if (!lensSummary.weakestLens) return null;
  const weakestLens = lensSummary.weakestPostureLens ?? lensSummary.weakestLens;

  return {
    source: "evaluation-lens",
    label: "Evaluation lenses",
    score: lensSummary.postureAverageScore,
    evidence: `Average ${lensSummary.postureAverageScore}/100 across ${lensSummary.postureLenses.length} decision lens${lensSummary.postureLenses.length === 1 ? "" : "es"}; weakest ${weakestLens.label} ${weakestLens.score}/100. Next: ${weakestLens.nextAction}`,
  };
}

function atlasValidationRealityComponent(venture: SavedVentureWorkspace): VentureDemandDriftComponent | null {
  if (venture.atlasValidationResults.length === 0) return null;
  const score = componentAverageScore(venture.atlasValidationResults.map((result): VentureDemandDriftComponent => ({
    source: "atlas-validation",
    label: result.atlasItemTitle,
    score: result.demandDriftScore,
    evidence: `${result.outcome}: ${result.qualifiedBuyerCount} qualified buyers, ${result.painConfirmationCount} pain confirmations, ${result.hiddenWedgeResonanceCount} hidden-wedge confirmations, ${result.paidPricingSignalCount} paid pricing signals.`,
  })));
  const passedCount = venture.atlasValidationResults.filter((result) => result.outcome === "passed").length;
  const failedCount = venture.atlasValidationResults.filter((result) => result.outcome === "failed").length;
  const pivotCount = venture.atlasValidationResults.filter((result) => result.outcome === "pivot").length;
  const qualifiedBuyerCount = venture.atlasValidationResults.reduce((sum, result) => sum + result.qualifiedBuyerCount, 0);
  const paidPricingSignalCount = venture.atlasValidationResults.reduce((sum, result) => sum + result.paidPricingSignalCount, 0);
  const latest = venture.atlasValidationResults[0];

  return {
    source: "atlas-validation",
    label: "Atlas validation results",
    score,
    evidence: `${venture.atlasValidationResults.length} manual validation result${venture.atlasValidationResults.length === 1 ? "" : "s"}: ${passedCount} pass, ${failedCount} fail, ${pivotCount} pivot, ${qualifiedBuyerCount} qualified buyers, ${paidPricingSignalCount} paid pricing signals. Latest: ${latest.outcome} for ${latest.atlasItemTitle}.`,
  };
}

function demandDriftStatusFor(params: {
  baselineDemandScore: number;
  actualDemandScore: number;
  drift: number;
  components: VentureDemandDriftComponent[];
}): VentureDemandDriftStatus {
  if (params.components.length === 0) return "unmeasured";
  const highSignalCount = params.components.filter((component) => component.score >= 68).length;
  const lowSignalCount = params.components.filter((component) => component.score <= 35).length;
  if (params.drift <= -20 && params.actualDemandScore <= 58) return "overestimated";
  if (params.drift >= 20 && params.actualDemandScore >= 58) return "underestimated";
  if (highSignalCount > 0 && lowSignalCount > 0) return "mixed";
  if (
    Math.abs(params.drift) <= 15 ||
    (params.baselineDemandScore < 45 && params.actualDemandScore < 45) ||
    (params.baselineDemandScore >= 60 && params.actualDemandScore >= 60)
  ) {
    return "confirmed";
  }
  return "mixed";
}

function demandDriftNextAction(status: VentureDemandDriftStatus, actualDemandScore: number) {
  if (status === "unmeasured") {
    return "Record an experiment result, pricing signal, activation cohort, or channel-economics result before trusting the pre-venture demand score.";
  }
  if (status === "overestimated") {
    return "Stop treating the opportunity score as validated; narrow the buyer, change the wedge, or kill the thesis before building more.";
  }
  if (status === "underestimated") {
    return "Upgrade priority and run the next proof step while preserving the evidence that beat the original demand estimate.";
  }
  if (status === "mixed") {
    return "Resolve the split between positive and negative demand signals before scaling, spending, or adding product scope.";
  }
  return actualDemandScore >= 60
    ? "Continue with the next proof step because actual demand is tracking the original assumption."
    : "Keep the thesis cold or small because actual demand confirmed a weak starting assumption.";
}

export function buildVentureDemandDriftReport(venture: SavedVentureWorkspace): VentureDemandDriftReport {
  const snapshot = venture.opportunityDemandSnapshot ?? buildFallbackOpportunityDemandSnapshot(venture);
  const baselineDemandScore = snapshot.demandScore;
  const demandCalibration = calibrateVentureDemand(venture);
  const pricingCalibration = calibrateVenturePricing(venture);
  const killPressureReport = buildVentureKillPressureReport(venture);
  const components = [
    demandCalibrationRealityComponent(demandCalibration),
    pricingRealityComponent(pricingCalibration),
    activationRealityComponent(venture),
    channelRealityComponent(venture),
    killPressureRealityComponent(killPressureReport),
    evaluationLensRealityComponent(venture),
    atlasValidationRealityComponent(venture),
  ].filter((component): component is VentureDemandDriftComponent => Boolean(component));
  const actualDemandScore = componentAverageScore(components);
  const drift = components.length > 0 ? actualDemandScore - baselineDemandScore : 0;
  const status = demandDriftStatusFor({
    baselineDemandScore,
    actualDemandScore,
    drift,
    components,
  });
  const evidencePreview = components
    .slice(0, 3)
    .map((component) => `${component.label} ${component.score}/100: ${component.evidence}`)
    .join(" ");

  return {
    id: `${venture.id}-demand-drift`,
    ventureId: venture.id,
    title: venture.title,
    status,
    baselineDemandScore,
    actualDemandScore,
    drift,
    evidenceComponentCount: components.length,
    components,
    reason: components.length === 0
      ? `Pre-venture demand score ${baselineDemandScore}/100 has no actual demand evidence yet.`
      : `Pre-venture demand score ${baselineDemandScore}/100 vs actual demand score ${actualDemandScore}/100 (${drift >= 0 ? "+" : ""}${drift}). ${evidencePreview}`,
    nextAction: demandDriftNextAction(status, actualDemandScore),
  };
}

function mostFrequentValue(values: string[], fallback: string) {
  const counts = values.reduce<Map<string, number>>((acc, value) => {
    const key = value.trim();
    if (!key) return acc;
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map());
  const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return top?.[0] ?? fallback;
}

export function summarizeVenturePortfolio(ventures: SavedVentureWorkspace[]): VenturePortfolioOperatingSummary {
  if (ventures.length === 0) {
    return {
      ventureCount: 0,
      evidenceSourceCount: 0,
      plannedExperimentCount: 0,
      experimentLaunchPackCount: 0,
      launchPackReadyCount: 0,
      launchPackNeedsApprovalCount: 0,
      launchPackRecordedCount: 0,
      launchPackBlockedCount: 0,
      qaReleaseReportCount: 0,
      qaReadyCount: 0,
      qaNeedsFixesCount: 0,
      qaBlockedCount: 0,
      deploymentReadinessPacketCount: 0,
      deploymentProposalReadyCount: 0,
      deploymentNeedsProofCount: 0,
      deploymentBlockedPacketCount: 0,
      deploymentOwnedRoadmapBlockerCount: 0,
      deploymentOwnedSupportBlockerCount: 0,
      investorBriefCount: 0,
      investableBriefCount: 0,
      watchBriefCount: 0,
      notReadyBriefCount: 0,
      financialModelCount: 0,
      financialScaleReadyCount: 0,
      financialNeedsProofCount: 0,
      financialRunwayRiskCount: 0,
      financialBlockedCount: 0,
      averageFinanceScore: 0,
      humanGateCount: 0,
      averageReadinessScore: 0,
      marketModelAverageConfidenceScore: 0,
      marketModelHighConfidenceCount: 0,
      marketModelMediumConfidenceCount: 0,
      marketModelLowConfidenceCount: 0,
      marketModelMissingProofCount: 0,
      dominantMarketProofGap: "None",
      riskiestMarketTitle: "None",
      riskiestMarketConfidenceScore: 0,
      founderExecutionMemoCount: 0,
      founderExecutionMemoReadyCount: 0,
      founderExecutionMemoPressureTestCount: 0,
      founderExecutionMemoBlockedCount: 0,
      decisionReadyCount: 0,
      needsPressureTestCount: 0,
      tooThinCount: 0,
      openGapTaskCount: 0,
      completedGapOutcomeCount: 0,
      launchedGapTaskCount: 0,
      killPressureCount: 0,
      scalePressureCount: 0,
      measuredExperimentCount: 0,
      demandPassCount: 0,
      demandFailCount: 0,
      demandInconclusiveCount: 0,
      demandDriftMeasuredCount: 0,
      demandDriftConfirmedCount: 0,
      demandOverestimatedCount: 0,
      demandUnderestimatedCount: 0,
      demandDriftMixedCount: 0,
      predictionSnapshotCount: 0,
      confirmedPredictionCount: 0,
      surprisedPredictionCount: 0,
      pricingSignalCount: 0,
      paidPricingSignalCount: 0,
      pricingValidatedCount: 0,
      pricingRejectedCount: 0,
      customerInterviewCount: 0,
      positiveInterviewCount: 0,
      negativeInterviewCount: 0,
      featureRequestCount: 0,
      outreachApprovalCount: 0,
      humanApprovedOutreachCount: 0,
      manualOutreachPlannedCount: 0,
      notSentOutreachCount: 0,
      outreachCampaignCount: 0,
      outreachCampaignReadyCount: 0,
      outreachCampaignNeedsApprovalCount: 0,
      outreachCampaignBlockedCount: 0,
      outreachCampaignRecordedCount: 0,
      riskRecordCount: 0,
      openRiskCount: 0,
      highRiskCount: 0,
      resolvedRiskCount: 0,
      customerInboxRiskCount: 0,
      untriagedRiskCandidateCount: 0,
      mvpBuildWorkspaceCount: 0,
      mvpRepoAttachedCount: 0,
      mvpExecutableCount: 0,
      mvpBlockedCount: 0,
      mvpVerificationPassedCount: 0,
      generatedAppHandoffCount: 0,
      generatedAppSourcePendingCount: 0,
      generatedAppBriefReadyCount: 0,
      generatedAppRepoAttachedCount: 0,
      generatedAppExecutableCount: 0,
      generatedAppSourceScaffoldCount: 0,
      generatedAppSourceFileCount: 0,
      generatedAppReadyToMaterializeCount: 0,
      generatedAppNoFakeSourceGuardCount: 0,
      generatedAppVerificationProofCount: 0,
      generatedAppVerifiedProofCount: 0,
      generatedAppPartialProofCount: 0,
      generatedAppMissingProofCount: 0,
      artifactRecordCount: 0,
      verifiedArtifactCount: 0,
      blockedArtifactCount: 0,
      deploymentProofCount: 0,
      changelogEntryCount: 0,
      moneySignalCount: 0,
      revenueCents: 0,
      expenseCents: 0,
      netRevenueCents: 0,
      committedRevenueCents: 0,
      runwayRiskCount: 0,
      roadmapTaskCount: 0,
      openRoadmapTaskCount: 0,
      highRoadmapTaskCount: 0,
      supportLoadTaskCount: 0,
      untriagedRoadmapCandidateCount: 0,
      supportIssueCount: 0,
      supportQuestionCount: 0,
      pilotIssueCount: 0,
      openSupportIssueCount: 0,
      criticalSupportIssueCount: 0,
      resolvedSupportIssueCount: 0,
      retentionRiskIssueCount: 0,
      untriagedSupportIssueCandidateCount: 0,
      activationCohortCount: 0,
      cohortSignupCount: 0,
      activatedUserCount: 0,
      retainedUserCount: 0,
      paidCohortUserCount: 0,
      cohortRevenueCents: 0,
      cohortSupportIssueCount: 0,
      averageActivationRate: 0,
      averageRetentionRate: 0,
      untriagedActivationCohortCandidateCount: 0,
      channelEconomicsCount: 0,
      acquisitionSpendCents: 0,
      channelSignupCount: 0,
      channelActivatedCount: 0,
      channelPaidUserCount: 0,
      channelRevenueCents: 0,
      blendedCacCents: 0,
      paidBackChannelCount: 0,
      untriagedChannelEconomicsCandidateCount: 0,
      killRuleSignalCount: 0,
      killRuleKillRecommendationCount: 0,
      killRulePauseRecommendationCount: 0,
      killRulePivotRecommendationCount: 0,
      killRuleScaleRecommendationCount: 0,
      killDecisionArtifactCount: 0,
      killDecisionStopCount: 0,
      killDecisionContinueCount: 0,
      killDecisionScaleCount: 0,
      weakBranchKillMemoryCount: 0,
      weakBranchKillRecommendedCount: 0,
      weakBranchPauseRecommendedCount: 0,
      weakBranchArchivedCount: 0,
      weakBranchRevivalWatchCount: 0,
      revenueGenerationPostureCount: 0,
      revenueGenerationPaidValidationCount: 0,
      revenueGenerationRepeatableCount: 0,
      revenueGenerationScalingCount: 0,
      revenueGenerationBlockedCount: 0,
      revenueGenerationNoEvidenceCount: 0,
      revenueGenerationEvidenceCents: 0,
      averageRevenueGenerationCaptureScore: 0,
      scaleStrongBranchPlanCount: 0,
      scaleStrongBranchReadyCount: 0,
      scaleStrongBranchApprovalRequiredCount: 0,
      scaleStrongBranchNeedsProofCount: 0,
      scaleStrongBranchBlockedCount: 0,
      scaleStrongBranchSpendCeilingCents: 0,
      spawnedVentureDraftCount: 0,
      spawnedVentureDraftReadyCount: 0,
      spawnedVentureDraftNeedsEvidenceCount: 0,
      spawnedVentureDraftBlockedCount: 0,
      spawnedVentureDraftConvertedPainCount: 0,
      spawnedVentureDraftRetainedUserCount: 0,
      spawnedVentureDraftWorkedChannelCount: 0,
      spawnedVentureDraftConvertedPricingCount: 0,
      relatedIdeaMergeAuditCount: 0,
      relatedIdeaMergeReuseCount: 0,
      relatedIdeaMergeMergeCount: 0,
      relatedIdeaMergeForkCount: 0,
      relatedIdeaMergeKeepSeparateCount: 0,
      learningReinvestmentQueueCount: 0,
      learningReinvestmentReadyCount: 0,
      learningReinvestmentNeedsOwnerCount: 0,
      learningReinvestmentBlockedCount: 0,
      learningReinvestmentWatchCount: 0,
      learningReinvestmentCriticalCount: 0,
      learningReinvestmentHighCount: 0,
      opportunityDiscoveryBacklogCount: 0,
      opportunityDiscoveryReadyCount: 0,
      opportunityDiscoveryNeedsSourceCount: 0,
      opportunityDiscoveryWatchCount: 0,
      opportunityDiscoveryBlockedCount: 0,
      opportunityDiscoveryHighPriorityCount: 0,
      overlookedOpportunityAtlasCount: 0,
      overlookedOpportunityRankedCount: 0,
      overlookedOpportunityNeedsSourceCount: 0,
      overlookedOpportunityWatchCount: 0,
      overlookedOpportunityBlockedCount: 0,
      overlookedOpportunityCriticalCount: 0,
      overlookedOpportunityHighPriorityCount: 0,
      averageOverlookedOpportunityRankScore: 0,
      averageOverlookedOpportunityNoveltyScore: 0,
      atlasValidationCommandPackCount: 0,
      atlasValidationCommandPackReadyCount: 0,
      atlasValidationCommandPackNeedsApprovalCount: 0,
      atlasValidationCommandPackNeedsSourceCount: 0,
      atlasValidationCommandPackBlockedCount: 0,
      atlasValidationCommandPackCriticalCount: 0,
      atlasValidationCommandPackHighPriorityCount: 0,
      atlasValidationResultCount: 0,
      atlasValidationResultPassedCount: 0,
      atlasValidationResultFailedCount: 0,
      atlasValidationResultPivotCount: 0,
      atlasValidationResultInconclusiveCount: 0,
      atlasValidationResultQualifiedBuyerCount: 0,
      atlasValidationResultPaidPricingSignalCount: 0,
      productBuildCommandCount: 0,
      productBuildReadyCount: 0,
      productBuildNeedsProofCount: 0,
      productBuildBlockedCount: 0,
      productBuildVerifiedCount: 0,
      productBuildCriticalCount: 0,
      productBuildRunCount: 0,
      productBuildRunExecutedCount: 0,
      productBuildRunImportedCount: 0,
      productBuildRunPromotedCount: 0,
      launchControlQueueCount: 0,
      launchControlReadyCount: 0,
      launchControlNeedsApprovalCount: 0,
      launchControlBlockedCount: 0,
      launchControlRecordedCount: 0,
      launchControlCriticalCount: 0,
      demandCaptureProofQueueCount: 0,
      demandCaptureCapturedCount: 0,
      demandCaptureNeedsFollowUpCount: 0,
      demandCaptureBlockedCount: 0,
      demandCaptureWeakCount: 0,
      demandCaptureCriticalCount: 0,
      portfolioDecisionCommandCount: 0,
      portfolioDecisionReadyCount: 0,
      portfolioDecisionNeedsProofCount: 0,
      portfolioDecisionBlockedCount: 0,
      portfolioDecisionHumanReviewCount: 0,
      portfolioDecisionContinueCount: 0,
      portfolioDecisionPivotCount: 0,
      portfolioDecisionPauseCount: 0,
      portfolioDecisionKillCount: 0,
      portfolioDecisionScaleCount: 0,
      portfolioDecisionDemandSourceBlockerCount: 0,
      portfolioDecisionDemandSourceBlockedCount: 0,
      portfolioDecisionDemandSourceWeakPressureCount: 0,
      portfolioDecisionDemandSourceBlockerTypeCount: 0,
      portfolioDecisionDemandSourceBlockerBreakdown: "None",
      portfolioDecisionPivotDemandSourceBlockerCount: 0,
      portfolioDecisionPauseDemandSourceBlockerCount: 0,
      portfolioDecisionKillDemandSourceBlockerCount: 0,
      autonomyAuditCount: 0,
      externalApprovedActionCount: 0,
      externalBlockedActionCount: 0,
      replayableActionCount: 0,
      untriagedAutonomyAuditCandidateCount: 0,
      deploymentStaleEscalationCandidateCount: 0,
      agentRunCount: 0,
      modelCallLogCount: 0,
      replayableAgentRunCount: 0,
      blockedAgentRunCount: 0,
      untriagedAgentRunCandidateCount: 0,
      competitorRecordCount: 0,
      highThreatCompetitorCount: 0,
      substituteCompetitorCount: 0,
      untriagedCompetitorCandidateCount: 0,
      browserResearchTaskCount: 0,
      queuedBrowserResearchTaskCount: 0,
      capturedBrowserResearchTaskCount: 0,
      blockedBrowserResearchTaskCount: 0,
      untriagedBrowserResearchCandidateCount: 0,
    };
  }

  const marketModels = ventures.map((venture) => buildVentureMarketModel(venture));
  const dominantMarketProofGap = mostFrequentValue(
    marketModels.flatMap((model) => model.missingProof.filter((proof) => proof !== "No major proof gap currently modeled.")),
    "No dominant proof gap",
  );
  const riskiestMarket = [...marketModels].sort((a, b) => (
    a.confidenceScore - b.confidenceScore ||
    b.risks.length - a.risks.length ||
    a.title.localeCompare(b.title)
  ))[0];

  const relatedIdeaMergeAuditsAll = buildVentureRelatedIdeaMergeAudits(ventures);
  const relatedIdeaMergeAuditCount = relatedIdeaMergeAuditsAll.length;
  const relatedIdeaMergeReuseCount = relatedIdeaMergeAuditsAll.filter((audit) => audit.recommendation === "reuse").length;
  const relatedIdeaMergeMergeCount = relatedIdeaMergeAuditsAll.filter((audit) => audit.recommendation === "merge").length;
  const relatedIdeaMergeForkCount = relatedIdeaMergeAuditsAll.filter((audit) => audit.recommendation === "fork").length;
  const relatedIdeaMergeKeepSeparateCount = relatedIdeaMergeAuditsAll.filter((audit) => audit.recommendation === "keep-separate").length;
  const learningReinvestmentQueueAll = buildVentureLearningReinvestmentQueue(ventures);
  const learningReinvestmentQueueCount = learningReinvestmentQueueAll.length;
  const learningReinvestmentReadyCount = learningReinvestmentQueueAll.filter((item) => item.status === "ready").length;
  const learningReinvestmentNeedsOwnerCount = learningReinvestmentQueueAll.filter((item) => item.status === "needs-owner").length;
  const learningReinvestmentBlockedCount = learningReinvestmentQueueAll.filter((item) => item.status === "blocked").length;
  const learningReinvestmentWatchCount = learningReinvestmentQueueAll.filter((item) => item.status === "watch").length;
  const learningReinvestmentCriticalCount = learningReinvestmentQueueAll.filter((item) => item.priority === "critical").length;
  const learningReinvestmentHighCount = learningReinvestmentQueueAll.filter((item) => item.priority === "high").length;
  const opportunityDiscoveryBacklogAll = buildVentureOpportunityDiscoveryBacklog(ventures);
  const opportunityDiscoveryBacklogCount = opportunityDiscoveryBacklogAll.length;
  const opportunityDiscoveryReadyCount = opportunityDiscoveryBacklogAll.filter((item) => item.status === "research-ready").length;
  const opportunityDiscoveryNeedsSourceCount = opportunityDiscoveryBacklogAll.filter((item) => item.status === "needs-source").length;
  const opportunityDiscoveryWatchCount = opportunityDiscoveryBacklogAll.filter((item) => item.status === "watch").length;
  const opportunityDiscoveryBlockedCount = opportunityDiscoveryBacklogAll.filter((item) => item.status === "blocked").length;
  const opportunityDiscoveryHighPriorityCount = opportunityDiscoveryBacklogAll.filter((item) => item.priority === "high").length;
  const overlookedOpportunityAtlasAll = buildVentureOverlookedOpportunityAtlas(ventures);
  const overlookedOpportunityAtlasCount = overlookedOpportunityAtlasAll.length;
  const overlookedOpportunityRankedCount = overlookedOpportunityAtlasAll.filter((item) => item.status === "ranked-ready").length;
  const overlookedOpportunityNeedsSourceCount = overlookedOpportunityAtlasAll.filter((item) => item.status === "needs-source").length;
  const overlookedOpportunityWatchCount = overlookedOpportunityAtlasAll.filter((item) => item.status === "watch").length;
  const overlookedOpportunityBlockedCount = overlookedOpportunityAtlasAll.filter((item) => item.status === "blocked").length;
  const overlookedOpportunityCriticalCount = overlookedOpportunityAtlasAll.filter((item) => item.priority === "critical").length;
  const overlookedOpportunityHighPriorityCount = overlookedOpportunityAtlasAll.filter((item) => item.priority === "high").length;
  const averageOverlookedOpportunityRankScore = overlookedOpportunityAtlasCount > 0
    ? clampScore(overlookedOpportunityAtlasAll.reduce((sum, item) => sum + item.rankScore, 0) / overlookedOpportunityAtlasCount)
    : 0;
  const averageOverlookedOpportunityNoveltyScore = overlookedOpportunityAtlasCount > 0
    ? clampScore(overlookedOpportunityAtlasAll.reduce((sum, item) => sum + item.noveltyScore, 0) / overlookedOpportunityAtlasCount)
    : 0;
  const atlasValidationCommandPacksAll = buildVentureAtlasValidationCommandPacks(ventures);
  const atlasValidationCommandPackCount = atlasValidationCommandPacksAll.length;
  const atlasValidationCommandPackReadyCount = atlasValidationCommandPacksAll.filter((pack) => pack.status === "ready").length;
  const atlasValidationCommandPackNeedsApprovalCount = atlasValidationCommandPacksAll.filter((pack) => pack.status === "needs-approval").length;
  const atlasValidationCommandPackNeedsSourceCount = atlasValidationCommandPacksAll.filter((pack) => pack.status === "needs-source").length;
  const atlasValidationCommandPackBlockedCount = atlasValidationCommandPacksAll.filter((pack) => pack.status === "blocked").length;
  const atlasValidationCommandPackCriticalCount = atlasValidationCommandPacksAll.filter((pack) => pack.priority === "critical").length;
  const atlasValidationCommandPackHighPriorityCount = atlasValidationCommandPacksAll.filter((pack) => pack.priority === "high").length;
  const atlasValidationResultLedgerAll = buildVentureAtlasValidationResultLedger(ventures);
  const atlasValidationResultCount = atlasValidationResultLedgerAll.length;
  const atlasValidationResultPassedCount = atlasValidationResultLedgerAll.filter((result) => result.outcome === "passed").length;
  const atlasValidationResultFailedCount = atlasValidationResultLedgerAll.filter((result) => result.outcome === "failed").length;
  const atlasValidationResultPivotCount = atlasValidationResultLedgerAll.filter((result) => result.outcome === "pivot").length;
  const atlasValidationResultInconclusiveCount = atlasValidationResultLedgerAll.filter((result) => result.outcome === "inconclusive").length;
  const atlasValidationResultQualifiedBuyerCount = atlasValidationResultLedgerAll.reduce((sum, result) => sum + result.qualifiedBuyerCount, 0);
  const atlasValidationResultPaidPricingSignalCount = atlasValidationResultLedgerAll.reduce((sum, result) => sum + result.paidPricingSignalCount, 0);
  const mvpReleaseWorkspaceAll = buildVentureMvpReleaseWorkspaceList(ventures);
  const mvpReleaseWorkspaceCount = mvpReleaseWorkspaceAll.length;
  const mvpReleaseReadyCount = mvpReleaseWorkspaceAll.filter((ws) => ws.status === "release-ready").length;
  const mvpReleaseNeedsRunProofCount = mvpReleaseWorkspaceAll.filter((ws) => ws.status === "needs-run-proof").length;
  const mvpReleaseNeedsQaProofCount = mvpReleaseWorkspaceAll.filter((ws) => ws.status === "needs-qa-proof").length;
  const mvpReleaseBlockedCount = mvpReleaseWorkspaceAll.filter((ws) => ws.status === "blocked").length;
  const pilotCohortSignalGateAll = buildVenturePilotCohortSignalGates(ventures);
  const pilotCohortSignalGateCount = pilotCohortSignalGateAll.length;
  const pilotCohortSignalGateReadyCount = pilotCohortSignalGateAll.filter((g) => g.status === "ready").length;
  const pilotCohortSignalGateNeedsReleaseWorkspaceCount = pilotCohortSignalGateAll.filter((g) => g.status === "needs-release-workspace").length;
  const pilotCohortSignalGateNeedsInboundSignalCount = pilotCohortSignalGateAll.filter((g) => g.status === "needs-inbound-signal").length;
  const pilotCohortSignalGateBlockedCount = pilotCohortSignalGateAll.filter((g) => g.status === "blocked").length;
  const pilotCohortSignalGateCriticalCount = pilotCohortSignalGateAll.filter((g) => g.priority === "critical").length;
  const pilotCohortSignalGateHighCount = pilotCohortSignalGateAll.filter((g) => g.priority === "high").length;
  const noSendEmailGateWorklistAll = buildVentureNoSendEmailGateWorklist(ventures);
  const noSendEmailGateWorklistCount = noSendEmailGateWorklistAll.length;
  const noSendEmailGateDraftReadyCount = noSendEmailGateWorklistAll.filter((item) => item.status === "draft-ready").length;
  const noSendEmailGateNeedsPilotGateCount = noSendEmailGateWorklistAll.filter((item) => item.status === "needs-pilot-gate").length;
  const noSendEmailGateBlockedCount = noSendEmailGateWorklistAll.filter((item) => item.status === "blocked").length;
  const noSendEmailGateCriticalCount = noSendEmailGateWorklistAll.filter((item) => item.priority === "critical").length;
  const productBuildCommandAll = buildVentureProductBuildCommandQueue(ventures);
  const productBuildCommandCount = productBuildCommandAll.length;
  const productBuildReadyCount = productBuildCommandAll.filter((command) => command.status === "ready").length;
  const productBuildNeedsProofCount = productBuildCommandAll.filter((command) => command.status === "needs-proof").length;
  const productBuildBlockedCount = productBuildCommandAll.filter((command) => command.status === "blocked").length;
  const productBuildVerifiedCount = productBuildCommandAll.filter((command) => command.status === "verified").length;
  const productBuildCriticalCount = productBuildCommandAll.filter((command) => command.priority === "critical").length;
  const productBuildCommandRunAll = buildVentureProductBuildCommandRunLedger(ventures);
  const productBuildRunCount = productBuildCommandRunAll.length;
  const productBuildRunExecutedCount = productBuildCommandRunAll.filter((item) => item.runState === "executed").length;
  const productBuildRunImportedCount = productBuildCommandRunAll.filter((item) => item.runState === "imported").length;
  const productBuildRunPromotedCount = productBuildCommandRunAll.filter((item) => item.runState === "promoted").length;
  const launchControlQueueAll = buildVentureLaunchControlQueue(ventures);
  const launchControlQueueCount = launchControlQueueAll.length;
  const launchControlReadyCount = launchControlQueueAll.filter((item) => item.status === "ready").length;
  const launchControlNeedsApprovalCount = launchControlQueueAll.filter((item) => item.status === "needs-approval").length;
  const launchControlBlockedCount = launchControlQueueAll.filter((item) => item.status === "blocked").length;
  const launchControlRecordedCount = launchControlQueueAll.filter((item) => item.status === "recorded").length;
  const launchControlCriticalCount = launchControlQueueAll.filter((item) => item.priority === "critical").length;
  const demandCaptureProofQueueAll = buildVentureDemandCaptureProofQueue(ventures);
  const demandCaptureProofQueueCount = demandCaptureProofQueueAll.length;
  const demandCaptureCapturedCount = demandCaptureProofQueueAll.filter((item) => item.status === "captured").length;
  const demandCaptureNeedsFollowUpCount = demandCaptureProofQueueAll.filter((item) => item.status === "needs-follow-up").length;
  const demandCaptureBlockedCount = demandCaptureProofQueueAll.filter((item) => item.status === "blocked").length;
  const demandCaptureWeakCount = demandCaptureProofQueueAll.filter((item) => item.status === "weak").length;
  const demandCaptureCriticalCount = demandCaptureProofQueueAll.filter((item) => item.priority === "critical").length;
  const portfolioDecisionCommandAll = buildVenturePortfolioDecisionCommandQueue(ventures);
  const portfolioDecisionCommandCount = portfolioDecisionCommandAll.length;
  const portfolioDecisionReadyCount = portfolioDecisionCommandAll.filter((item) => item.status === "ready").length;
  const portfolioDecisionNeedsProofCount = portfolioDecisionCommandAll.filter((item) => item.status === "needs-proof").length;
  const portfolioDecisionBlockedCount = portfolioDecisionCommandAll.filter((item) => item.status === "blocked").length;
  const portfolioDecisionHumanReviewCount = portfolioDecisionCommandAll.filter((item) => item.status === "human-review").length;
  const portfolioDecisionContinueCount = portfolioDecisionCommandAll.filter((item) => item.recommendedDecision === "continue").length;
  const portfolioDecisionPivotCount = portfolioDecisionCommandAll.filter((item) => item.recommendedDecision === "pivot").length;
  const portfolioDecisionPauseCount = portfolioDecisionCommandAll.filter((item) => item.recommendedDecision === "pause").length;
  const portfolioDecisionKillCount = portfolioDecisionCommandAll.filter((item) => item.recommendedDecision === "kill").length;
  const portfolioDecisionScaleCount = portfolioDecisionCommandAll.filter((item) => item.recommendedDecision === "scale").length;
  const demandSourceBlockerItemsByVentureId = new Map<string, VentureDemandCaptureProofQueueItem[]>();
  ventures.forEach((venture) => {
    demandSourceBlockerItemsByVentureId.set(
      venture.id,
      demandSourceBlockerPressureItemsForVenture(
        demandCaptureProofQueueAll.filter((item) => item.ventureId === venture.id),
      ),
    );
  });
  const portfolioDecisionDemandSourceBlockerItems = Array.from(demandSourceBlockerItemsByVentureId.values()).flat();
  const portfolioDecisionDemandSourceBlockerCount = portfolioDecisionDemandSourceBlockerItems.length;
  const portfolioDecisionDemandSourceBlockedCount = portfolioDecisionDemandSourceBlockerItems.filter((item) => item.status === "blocked").length;
  const portfolioDecisionDemandSourceWeakPressureCount = portfolioDecisionDemandSourceBlockerItems.filter((item) => item.status === "weak").length;
  const portfolioDecisionDemandSourceBlockerTypeEntries = demandSourceTypeCounts(portfolioDecisionDemandSourceBlockerItems);
  const portfolioDecisionDemandSourceBlockerTypeCount = portfolioDecisionDemandSourceBlockerTypeEntries.length;
  const portfolioDecisionDemandSourceBlockerBreakdown = demandSourceTypeCountSummary(portfolioDecisionDemandSourceBlockerItems);
  const demandSourceBlockerCountForDecision = (decision: VentureDecisionType) => portfolioDecisionCommandAll
    .filter((item) => item.recommendedDecision === decision)
    .reduce((sum, item) => sum + (demandSourceBlockerItemsByVentureId.get(item.ventureId)?.length ?? 0), 0);
  const portfolioDecisionPivotDemandSourceBlockerCount = demandSourceBlockerCountForDecision("pivot");
  const portfolioDecisionPauseDemandSourceBlockerCount = demandSourceBlockerCountForDecision("pause");
  const portfolioDecisionKillDemandSourceBlockerCount = demandSourceBlockerCountForDecision("kill");

  return ventures.reduce<VenturePortfolioOperatingSummary>((summary, venture, index) => {
    const evidenceProfile = summarizeVentureEvidence(venture);
    const marketModel = marketModels[index];
    const demandCalibration = calibrateVentureDemand(venture);
    const pricingCalibration = calibrateVenturePricing(venture);
    const gapTasks = buildVentureGapActionQueue(venture);
    const closedGapTaskIds = new Set(
      venture.gapActionHistory
        .filter((record) => record.status === "completed" || record.status === "dismissed")
        .map((record) => record.taskId),
    );
    const latestDecision = venture.decisionHistory[0];
    const nextAverage = ((summary.averageReadinessScore * index) + evidenceProfile.readinessScore) / (index + 1);
    const nextMarketConfidenceAverage = ((summary.marketModelAverageConfidenceScore * index) + marketModel.confidenceScore) / (index + 1);
    const humanApprovedOutreachCount = venture.outreachApprovals.filter((approval) => (
      approval.status === "approved" ||
      approval.status === "manual-contact-planned" ||
      approval.status === "completed"
    )).length;
    const riskCandidates = buildVentureRiskCandidates(venture);
    const openRiskCount = venture.riskRecords.filter((risk) => (
      risk.status === "open" ||
      risk.status === "monitoring" ||
      risk.status === "mitigating"
    )).length;
    const customerInboxRiskCount = venture.riskRecords.filter((risk) => (
      risk.sourceType === "customer-interview" ||
      risk.sourceType === "outreach-approval" ||
      risk.sourceType === "gap-outcome"
    )).length;
    const attachedMvpWorkspaceCount = venture.mvpBuildWorkspaces.filter((workspace) => hasAttachedMvpRepo(workspace.repoPath)).length;
    const mvpVerificationPassedCount = venture.mvpBuildWorkspaces
      .reduce((count, workspace) => count + countPassedMvpChecks(workspace), 0);
    const revenueCents = venture.moneySignals
      .filter((signal) => (signal.type === "revenue" || signal.type === "grant" || signal.type === "credit") && signal.status === "received")
      .reduce((sum, signal) => sum + signal.amountCents, 0);
    const committedRevenueCents = venture.moneySignals
      .filter((signal) => (signal.type === "commitment" && (signal.status === "committed" || signal.status === "received")) || (signal.type === "revenue" && signal.status === "committed"))
      .reduce((sum, signal) => sum + signal.amountCents, 0);
    const expenseCents = venture.moneySignals
      .filter((signal) => signal.type === "expense" && (signal.status === "planned" || signal.status === "committed" || signal.status === "spent"))
      .reduce((sum, signal) => sum + signal.amountCents, 0);
    const runwayRiskCount = expenseCents > revenueCents + committedRevenueCents ||
      venture.moneySignals.some((signal) => signal.status === "blocked")
      ? 1
      : 0;
    const roadmapCandidates = buildVentureRoadmapCandidates(venture);
    const openRoadmapTaskCount = venture.roadmapTasks.filter((task) => (
      task.status === "queued" ||
      task.status === "in-progress" ||
      task.status === "blocked"
    )).length;
    const supportIssueCandidates = buildVentureSupportIssueCandidates(venture);
    const openSupportIssueCount = venture.supportIssues.filter((issue) => (
      issue.status === "open" ||
      issue.status === "triaged" ||
      issue.status === "in-progress"
    )).length;
    const activationCohortCandidates = buildVentureActivationCohortCandidates(venture);
    const cohortSignupCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.signupCount, 0);
    const cohortActivatedCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.activatedCount, 0);
    const cohortRetainedCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.retainedCount, 0);
    const cohortPaidCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.paidCount, 0);
    const cohortRevenueCents = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.revenueCents, 0);
    const cohortSupportIssueCount = venture.activationCohorts.reduce((sum, cohort) => sum + cohort.supportIssueCount, 0);
    const nextSignupCount = summary.cohortSignupCount + cohortSignupCount;
    const nextActivatedCount = summary.activatedUserCount + cohortActivatedCount;
    const nextRetainedCount = summary.retainedUserCount + cohortRetainedCount;
    const channelEconomicsCandidates = buildVentureChannelEconomicsCandidates(venture);
    const channelSpendCents = venture.channelEconomics.reduce((sum, economics) => sum + economics.spendCents, 0);
    const channelSignupCount = venture.channelEconomics.reduce((sum, economics) => sum + economics.signupCount, 0);
    const channelActivatedCount = venture.channelEconomics.reduce((sum, economics) => sum + economics.activatedCount, 0);
    const channelPaidUserCount = venture.channelEconomics.reduce((sum, economics) => sum + economics.paidCount, 0);
    const channelRevenueCents = venture.channelEconomics.reduce((sum, economics) => sum + economics.revenueCents, 0);
    const nextChannelSpendCents = summary.acquisitionSpendCents + channelSpendCents;
    const nextChannelPaidUserCount = summary.channelPaidUserCount + channelPaidUserCount;
    const killPressureReport = buildVentureKillPressureReport(venture);
    const killDecision = buildVentureKillDecisionArtifact(venture);
    const weakBranchKillMemories = buildVentureWeakBranchKillMemories([venture]);
    const revenuePosture = buildVentureRevenueGenerationPosture(venture);
    const nextRevenueCaptureAverage = ((summary.averageRevenueGenerationCaptureScore * index) + revenuePosture.captureScore) / (index + 1);
    const scaleStrongBranchPlan = buildVentureScaleStrongBranchPlan(venture);
    const spawnedDrafts = buildVentureSpawnedVentureDrafts([venture]);
    const demandDrift = buildVentureDemandDriftReport(venture);
    const founderMemo = buildVentureFounderExecutionMemo(venture);
    const launchPack = buildVentureExperimentLaunchPack(venture);
    const qaReport = buildVentureQaReleaseReport(venture);
    const deploymentPacket = buildVentureDeploymentReadinessPacket(venture);
    const investorBrief = buildVentureInvestorBrief(venture);
    const financialModel = buildVentureFinancialModel(venture);
    const outreachCampaign = buildVentureOutreachCampaignBrief(venture);
    const generatedApp = buildVentureGeneratedAppHandoff(venture);
    const generatedAppProof = buildVentureGeneratedAppVerificationProof(venture);
    const deploymentMatrix = buildVentureDeploymentEnvironmentMatrix(venture);
    const nextFinanceAverage = ((summary.averageFinanceScore * index) + financialModel.financeScore) / (index + 1);
    const autonomyAuditCandidates = buildVentureAutonomyAuditCandidates(venture);
    const agentRunCandidates = buildVentureAgentRunCandidates(venture);
    const competitorCandidates = buildVentureCompetitorCandidates(venture);
    const browserResearchCandidates = buildVentureBrowserResearchCandidates(venture);

    return {
      ventureCount: summary.ventureCount + 1,
      evidenceSourceCount: summary.evidenceSourceCount + venture.evidenceSources.length,
      plannedExperimentCount: summary.plannedExperimentCount + venture.experiments.length,
      experimentLaunchPackCount: summary.experimentLaunchPackCount + (launchPack.experimentId === "no-experiment" ? 0 : 1),
      launchPackReadyCount: summary.launchPackReadyCount + (launchPack.status === "ready" ? 1 : 0),
      launchPackNeedsApprovalCount: summary.launchPackNeedsApprovalCount + (launchPack.status === "needs-approval" ? 1 : 0),
      launchPackRecordedCount: summary.launchPackRecordedCount + (launchPack.status === "recorded" ? 1 : 0),
      launchPackBlockedCount: summary.launchPackBlockedCount + (launchPack.status === "blocked" ? 1 : 0),
      qaReleaseReportCount: summary.qaReleaseReportCount + 1,
      qaReadyCount: summary.qaReadyCount + (qaReport.status === "ready" ? 1 : 0),
      qaNeedsFixesCount: summary.qaNeedsFixesCount + (qaReport.status === "needs-fixes" ? 1 : 0),
      qaBlockedCount: summary.qaBlockedCount + (qaReport.status === "blocked" ? 1 : 0),
      deploymentReadinessPacketCount: summary.deploymentReadinessPacketCount + 1,
      deploymentProposalReadyCount: summary.deploymentProposalReadyCount + (deploymentPacket.status === "proposal-ready" ? 1 : 0),
      deploymentNeedsProofCount: summary.deploymentNeedsProofCount + (deploymentPacket.status === "needs-proof" ? 1 : 0),
      deploymentBlockedPacketCount: summary.deploymentBlockedPacketCount + (deploymentPacket.status === "blocked" ? 1 : 0),
      deploymentOwnedRoadmapBlockerCount: summary.deploymentOwnedRoadmapBlockerCount + deploymentMatrix.targets.filter((target) => target.status !== "ready" && target.linkedRoadmapTaskTitle).length,
      deploymentOwnedSupportBlockerCount: summary.deploymentOwnedSupportBlockerCount + deploymentMatrix.targets.filter((target) => target.status !== "ready" && target.linkedSupportIssueTitle).length,
      investorBriefCount: summary.investorBriefCount + 1,
      investableBriefCount: summary.investableBriefCount + (investorBrief.status === "investable" ? 1 : 0),
      watchBriefCount: summary.watchBriefCount + (investorBrief.status === "watch" ? 1 : 0),
      notReadyBriefCount: summary.notReadyBriefCount + (investorBrief.status === "not-ready" ? 1 : 0),
      financialModelCount: summary.financialModelCount + 1,
      financialScaleReadyCount: summary.financialScaleReadyCount + (financialModel.status === "scale-ready" ? 1 : 0),
      financialNeedsProofCount: summary.financialNeedsProofCount + (financialModel.status === "needs-proof" ? 1 : 0),
      financialRunwayRiskCount: summary.financialRunwayRiskCount + (financialModel.status === "runway-risk" ? 1 : 0),
      financialBlockedCount: summary.financialBlockedCount + (financialModel.status === "blocked" ? 1 : 0),
      averageFinanceScore: clampScore(nextFinanceAverage),
      humanGateCount: summary.humanGateCount + venture.approvals.filter((approval) => approval.status === "requires-human").length,
      averageReadinessScore: clampScore(nextAverage),
      marketModelAverageConfidenceScore: clampScore(nextMarketConfidenceAverage),
      marketModelHighConfidenceCount: summary.marketModelHighConfidenceCount + (marketModel.confidence === "high" ? 1 : 0),
      marketModelMediumConfidenceCount: summary.marketModelMediumConfidenceCount + (marketModel.confidence === "medium" ? 1 : 0),
      marketModelLowConfidenceCount: summary.marketModelLowConfidenceCount + (marketModel.confidence === "low" ? 1 : 0),
      marketModelMissingProofCount: summary.marketModelMissingProofCount + marketModel.missingProof.filter((proof) => proof !== "No major proof gap currently modeled.").length,
      dominantMarketProofGap,
      riskiestMarketTitle: riskiestMarket?.title ?? "None",
      riskiestMarketConfidenceScore: riskiestMarket?.confidenceScore ?? 0,
      founderExecutionMemoCount: summary.founderExecutionMemoCount + 1,
      founderExecutionMemoReadyCount: summary.founderExecutionMemoReadyCount + (founderMemo.status === "ready" ? 1 : 0),
      founderExecutionMemoPressureTestCount: summary.founderExecutionMemoPressureTestCount + (founderMemo.status === "pressure-test" ? 1 : 0),
      founderExecutionMemoBlockedCount: summary.founderExecutionMemoBlockedCount + (founderMemo.status === "blocked" ? 1 : 0),
      decisionReadyCount: summary.decisionReadyCount + (evidenceProfile.readiness === "decision-ready" ? 1 : 0),
      needsPressureTestCount: summary.needsPressureTestCount + (evidenceProfile.readiness === "needs-pressure-test" ? 1 : 0),
      tooThinCount: summary.tooThinCount + (evidenceProfile.readiness === "too-thin" ? 1 : 0),
      openGapTaskCount: summary.openGapTaskCount + gapTasks.filter((task) => !closedGapTaskIds.has(task.id)).length,
      completedGapOutcomeCount: summary.completedGapOutcomeCount + venture.gapActionHistory.filter((record) => record.status === "completed").length,
      launchedGapTaskCount: summary.launchedGapTaskCount + venture.gapActionHistory.filter((record) => record.status === "launch-requested" || record.status === "launched").length,
      killPressureCount: summary.killPressureCount + (
        venture.lifecycleStatus === "killed" ||
        venture.decision === "kill-review" ||
        latestDecision?.decision === "kill" ||
        evidenceProfile.readiness === "too-thin"
          ? 1
          : 0
      ),
      scalePressureCount: summary.scalePressureCount + (
        venture.lifecycleStatus === "scaling" ||
        latestDecision?.decision === "scale" ||
        evidenceProfile.readiness === "decision-ready"
          ? 1
          : 0
      ),
      measuredExperimentCount: summary.measuredExperimentCount + demandCalibration.measuredExperimentCount,
      demandPassCount: summary.demandPassCount + demandCalibration.passCount,
      demandFailCount: summary.demandFailCount + demandCalibration.failCount,
      demandInconclusiveCount: summary.demandInconclusiveCount + demandCalibration.inconclusiveCount,
      demandDriftMeasuredCount: summary.demandDriftMeasuredCount + (demandDrift.status === "unmeasured" ? 0 : 1),
      demandDriftConfirmedCount: summary.demandDriftConfirmedCount + (demandDrift.status === "confirmed" ? 1 : 0),
      demandOverestimatedCount: summary.demandOverestimatedCount + (demandDrift.status === "overestimated" ? 1 : 0),
      demandUnderestimatedCount: summary.demandUnderestimatedCount + (demandDrift.status === "underestimated" ? 1 : 0),
      demandDriftMixedCount: summary.demandDriftMixedCount + (demandDrift.status === "mixed" ? 1 : 0),
      predictionSnapshotCount: summary.predictionSnapshotCount + venture.predictionSnapshots.length,
      confirmedPredictionCount: summary.confirmedPredictionCount + demandCalibration.experiments.filter((experiment) => experiment.predictionAlignment === "confirmed").length,
      surprisedPredictionCount: summary.surprisedPredictionCount + demandCalibration.experiments.filter((experiment) => experiment.predictionAlignment === "surprised").length,
      pricingSignalCount: summary.pricingSignalCount + pricingCalibration.signalCount,
      paidPricingSignalCount: summary.paidPricingSignalCount + pricingCalibration.paidSignalCount,
      pricingValidatedCount: summary.pricingValidatedCount + (pricingCalibration.status === "validated" ? 1 : 0),
      pricingRejectedCount: summary.pricingRejectedCount + (pricingCalibration.status === "rejected" ? 1 : 0),
      customerInterviewCount: summary.customerInterviewCount + venture.customerInterviews.length,
      positiveInterviewCount: summary.positiveInterviewCount + venture.customerInterviews.filter((interview) => interview.sentiment === "positive").length,
      negativeInterviewCount: summary.negativeInterviewCount + venture.customerInterviews.filter((interview) => interview.sentiment === "negative").length,
      featureRequestCount: summary.featureRequestCount + venture.customerInterviews.filter((interview) => interview.requestedFeatures !== "No feature requests recorded.").length,
      outreachApprovalCount: summary.outreachApprovalCount + venture.outreachApprovals.length,
      humanApprovedOutreachCount: summary.humanApprovedOutreachCount + humanApprovedOutreachCount,
      manualOutreachPlannedCount: summary.manualOutreachPlannedCount + venture.outreachApprovals.filter((approval) => approval.status === "manual-contact-planned").length,
      notSentOutreachCount: summary.notSentOutreachCount + venture.outreachApprovals.filter((approval) => approval.externalSendStatus === "not-sent").length,
      outreachCampaignCount: summary.outreachCampaignCount + 1,
      outreachCampaignReadyCount: summary.outreachCampaignReadyCount + (outreachCampaign.status === "ready" ? 1 : 0),
      outreachCampaignNeedsApprovalCount: summary.outreachCampaignNeedsApprovalCount + (outreachCampaign.status === "needs-approval" ? 1 : 0),
      outreachCampaignBlockedCount: summary.outreachCampaignBlockedCount + (outreachCampaign.status === "blocked" ? 1 : 0),
      outreachCampaignRecordedCount: summary.outreachCampaignRecordedCount + (outreachCampaign.status === "recorded" ? 1 : 0),
      riskRecordCount: summary.riskRecordCount + venture.riskRecords.length,
      openRiskCount: summary.openRiskCount + openRiskCount,
      highRiskCount: summary.highRiskCount + venture.riskRecords.filter((risk) => risk.severity === "high" || risk.severity === "critical").length,
      resolvedRiskCount: summary.resolvedRiskCount + venture.riskRecords.filter((risk) => risk.status === "resolved").length,
      customerInboxRiskCount: summary.customerInboxRiskCount + customerInboxRiskCount,
      untriagedRiskCandidateCount: summary.untriagedRiskCandidateCount + riskCandidates.length,
      mvpBuildWorkspaceCount: summary.mvpBuildWorkspaceCount + venture.mvpBuildWorkspaces.length,
      mvpRepoAttachedCount: summary.mvpRepoAttachedCount + attachedMvpWorkspaceCount,
      mvpExecutableCount: summary.mvpExecutableCount + venture.mvpBuildWorkspaces.filter((workspace) => workspace.status === "executable").length,
      mvpBlockedCount: summary.mvpBlockedCount + venture.mvpBuildWorkspaces.filter((workspace) => workspace.status === "blocked").length,
      mvpVerificationPassedCount: summary.mvpVerificationPassedCount + mvpVerificationPassedCount,
      generatedAppHandoffCount: summary.generatedAppHandoffCount + 1,
      generatedAppSourcePendingCount: summary.generatedAppSourcePendingCount + (generatedApp.status === "source-pending" ? 1 : 0),
      generatedAppBriefReadyCount: summary.generatedAppBriefReadyCount + (generatedApp.status === "brief-ready" ? 1 : 0),
      generatedAppRepoAttachedCount: summary.generatedAppRepoAttachedCount + (generatedApp.status === "repo-attached" ? 1 : 0),
      generatedAppExecutableCount: summary.generatedAppExecutableCount + (generatedApp.status === "executable" ? 1 : 0),
      generatedAppSourceScaffoldCount: summary.generatedAppSourceScaffoldCount + 1,
      generatedAppSourceFileCount: summary.generatedAppSourceFileCount + generatedApp.sourceScaffold.sourceFiles.length,
      generatedAppReadyToMaterializeCount: summary.generatedAppReadyToMaterializeCount + (generatedApp.sourceScaffold.status === "ready-to-materialize" ? 1 : 0),
      generatedAppNoFakeSourceGuardCount: summary.generatedAppNoFakeSourceGuardCount + generatedApp.sourceScaffold.noFakeSourceSafeguards.length,
      generatedAppVerificationProofCount: summary.generatedAppVerificationProofCount + 1,
      generatedAppVerifiedProofCount: summary.generatedAppVerifiedProofCount + (generatedAppProof.status === "verified" ? 1 : 0),
      generatedAppPartialProofCount: summary.generatedAppPartialProofCount + (generatedAppProof.status === "partial-proof" ? 1 : 0),
      generatedAppMissingProofCount: summary.generatedAppMissingProofCount + (generatedAppProof.status === "not-materialized" || generatedAppProof.status === "blocked" ? 1 : 0),
      artifactRecordCount: summary.artifactRecordCount + venture.artifactRecords.length,
      verifiedArtifactCount: summary.verifiedArtifactCount + venture.artifactRecords.filter((artifact) => artifact.status === "verified").length,
      blockedArtifactCount: summary.blockedArtifactCount + venture.artifactRecords.filter((artifact) => artifact.status === "blocked").length,
      deploymentProofCount: summary.deploymentProofCount + venture.artifactRecords.filter((artifact) => artifact.artifactType === "deployment-proof").length,
      changelogEntryCount: summary.changelogEntryCount + venture.artifactRecords.filter((artifact) => artifact.artifactType === "changelog" || artifact.changeSummary !== "No changelog summary recorded.").length,
      moneySignalCount: summary.moneySignalCount + venture.moneySignals.length,
      revenueCents: summary.revenueCents + revenueCents,
      expenseCents: summary.expenseCents + expenseCents,
      netRevenueCents: summary.netRevenueCents + revenueCents - expenseCents,
      committedRevenueCents: summary.committedRevenueCents + committedRevenueCents,
      runwayRiskCount: summary.runwayRiskCount + runwayRiskCount,
      roadmapTaskCount: summary.roadmapTaskCount + venture.roadmapTasks.length,
      openRoadmapTaskCount: summary.openRoadmapTaskCount + openRoadmapTaskCount,
      highRoadmapTaskCount: summary.highRoadmapTaskCount + venture.roadmapTasks.filter((task) => task.priority === "high").length,
      supportLoadTaskCount: summary.supportLoadTaskCount + venture.roadmapTasks.filter((task) => task.supportLoad !== "No support-load note recorded.").length,
      untriagedRoadmapCandidateCount: summary.untriagedRoadmapCandidateCount + roadmapCandidates.length,
      supportIssueCount: summary.supportIssueCount + venture.supportIssues.length,
      supportQuestionCount: summary.supportQuestionCount + venture.supportIssues.filter((issue) => issue.issueType === "support-question").length,
      pilotIssueCount: summary.pilotIssueCount + venture.supportIssues.filter((issue) => issue.issueType === "pilot-issue").length,
      openSupportIssueCount: summary.openSupportIssueCount + openSupportIssueCount,
      criticalSupportIssueCount: summary.criticalSupportIssueCount + venture.supportIssues.filter((issue) => issue.severity === "critical").length,
      resolvedSupportIssueCount: summary.resolvedSupportIssueCount + venture.supportIssues.filter((issue) => issue.status === "resolved").length,
      retentionRiskIssueCount: summary.retentionRiskIssueCount + venture.supportIssues.filter((issue) => (
        issue.issueType === "retention-risk" ||
        issue.retentionRisk !== "No retention-risk note recorded."
      )).length,
      untriagedSupportIssueCandidateCount: summary.untriagedSupportIssueCandidateCount + supportIssueCandidates.length,
      activationCohortCount: summary.activationCohortCount + venture.activationCohorts.length,
      cohortSignupCount: nextSignupCount,
      activatedUserCount: nextActivatedCount,
      retainedUserCount: nextRetainedCount,
      paidCohortUserCount: summary.paidCohortUserCount + cohortPaidCount,
      cohortRevenueCents: summary.cohortRevenueCents + cohortRevenueCents,
      cohortSupportIssueCount: summary.cohortSupportIssueCount + cohortSupportIssueCount,
      averageActivationRate: nextSignupCount > 0 ? clampScore((nextActivatedCount / nextSignupCount) * 100) : 0,
      averageRetentionRate: nextActivatedCount > 0 ? clampScore((nextRetainedCount / nextActivatedCount) * 100) : 0,
      untriagedActivationCohortCandidateCount: summary.untriagedActivationCohortCandidateCount + activationCohortCandidates.length,
      channelEconomicsCount: summary.channelEconomicsCount + venture.channelEconomics.length,
      acquisitionSpendCents: nextChannelSpendCents,
      channelSignupCount: summary.channelSignupCount + channelSignupCount,
      channelActivatedCount: summary.channelActivatedCount + channelActivatedCount,
      channelPaidUserCount: nextChannelPaidUserCount,
      channelRevenueCents: summary.channelRevenueCents + channelRevenueCents,
      blendedCacCents: divideCurrencyCents(nextChannelSpendCents, nextChannelPaidUserCount),
      paidBackChannelCount: summary.paidBackChannelCount + venture.channelEconomics.filter((economics) => economics.paybackStatus === "paid-back").length,
      untriagedChannelEconomicsCandidateCount: summary.untriagedChannelEconomicsCandidateCount + channelEconomicsCandidates.length,
      killRuleSignalCount: summary.killRuleSignalCount + killPressureReport.signals.length,
      killRuleKillRecommendationCount: summary.killRuleKillRecommendationCount + (killPressureReport.recommendation === "kill" ? 1 : 0),
      killRulePauseRecommendationCount: summary.killRulePauseRecommendationCount + (killPressureReport.recommendation === "pause" ? 1 : 0),
      killRulePivotRecommendationCount: summary.killRulePivotRecommendationCount + (killPressureReport.recommendation === "pivot" ? 1 : 0),
      killRuleScaleRecommendationCount: summary.killRuleScaleRecommendationCount + (killPressureReport.recommendation === "scale" ? 1 : 0),
      killDecisionArtifactCount: summary.killDecisionArtifactCount + 1,
      killDecisionStopCount: summary.killDecisionStopCount + (killDecision.recommendation === "kill" || killDecision.recommendation === "pause" ? 1 : 0),
      killDecisionContinueCount: summary.killDecisionContinueCount + (killDecision.recommendation === "continue" || killDecision.recommendation === "pivot" ? 1 : 0),
      killDecisionScaleCount: summary.killDecisionScaleCount + (killDecision.recommendation === "scale" ? 1 : 0),
      weakBranchKillMemoryCount: summary.weakBranchKillMemoryCount + weakBranchKillMemories.length,
      weakBranchKillRecommendedCount: summary.weakBranchKillRecommendedCount + weakBranchKillMemories.filter((memory) => memory.status === "kill-recommended").length,
      weakBranchPauseRecommendedCount: summary.weakBranchPauseRecommendedCount + weakBranchKillMemories.filter((memory) => memory.status === "pause-recommended").length,
      weakBranchArchivedCount: summary.weakBranchArchivedCount + weakBranchKillMemories.filter((memory) => memory.status === "archived").length,
      weakBranchRevivalWatchCount: summary.weakBranchRevivalWatchCount + weakBranchKillMemories.filter((memory) => memory.status === "revival-watch").length,
      revenueGenerationPostureCount: summary.revenueGenerationPostureCount + 1,
      revenueGenerationPaidValidationCount: summary.revenueGenerationPaidValidationCount + (revenuePosture.status === "paid-validation" ? 1 : 0),
      revenueGenerationRepeatableCount: summary.revenueGenerationRepeatableCount + (revenuePosture.status === "repeatable-revenue" ? 1 : 0),
      revenueGenerationScalingCount: summary.revenueGenerationScalingCount + (revenuePosture.status === "scaling-revenue" ? 1 : 0),
      revenueGenerationBlockedCount: summary.revenueGenerationBlockedCount + (revenuePosture.status === "blocked" ? 1 : 0),
      revenueGenerationNoEvidenceCount: summary.revenueGenerationNoEvidenceCount + (revenuePosture.status === "no-evidence" ? 1 : 0),
      revenueGenerationEvidenceCents: summary.revenueGenerationEvidenceCents + revenuePosture.totalEvidenceRevenueCents,
      averageRevenueGenerationCaptureScore: clampScore(nextRevenueCaptureAverage),
      scaleStrongBranchPlanCount: summary.scaleStrongBranchPlanCount + 1,
      scaleStrongBranchReadyCount: summary.scaleStrongBranchReadyCount + (scaleStrongBranchPlan.status === "scale-ready" ? 1 : 0),
      scaleStrongBranchApprovalRequiredCount: summary.scaleStrongBranchApprovalRequiredCount + (scaleStrongBranchPlan.status === "approval-required" ? 1 : 0),
      scaleStrongBranchNeedsProofCount: summary.scaleStrongBranchNeedsProofCount + (scaleStrongBranchPlan.status === "needs-proof" ? 1 : 0),
      scaleStrongBranchBlockedCount: summary.scaleStrongBranchBlockedCount + (scaleStrongBranchPlan.status === "blocked" ? 1 : 0),
      scaleStrongBranchSpendCeilingCents: summary.scaleStrongBranchSpendCeilingCents + scaleStrongBranchPlan.humanApprovedSpendCeilingCents,
      spawnedVentureDraftCount: summary.spawnedVentureDraftCount + spawnedDrafts.length,
      spawnedVentureDraftReadyCount: summary.spawnedVentureDraftReadyCount + spawnedDrafts.filter((draft) => draft.status === "draft-ready").length,
      spawnedVentureDraftNeedsEvidenceCount: summary.spawnedVentureDraftNeedsEvidenceCount + spawnedDrafts.filter((draft) => draft.status === "needs-evidence").length,
      spawnedVentureDraftBlockedCount: summary.spawnedVentureDraftBlockedCount + spawnedDrafts.filter((draft) => draft.status === "blocked").length,
      spawnedVentureDraftConvertedPainCount: summary.spawnedVentureDraftConvertedPainCount + spawnedDrafts.filter((draft) => draft.branchSourceType === "converted-pain").length,
      spawnedVentureDraftRetainedUserCount: summary.spawnedVentureDraftRetainedUserCount + spawnedDrafts.filter((draft) => draft.branchSourceType === "retained-user").length,
      spawnedVentureDraftWorkedChannelCount: summary.spawnedVentureDraftWorkedChannelCount + spawnedDrafts.filter((draft) => draft.branchSourceType === "worked-channel").length,
      spawnedVentureDraftConvertedPricingCount: summary.spawnedVentureDraftConvertedPricingCount + spawnedDrafts.filter((draft) => draft.branchSourceType === "converted-pricing").length,
      relatedIdeaMergeAuditCount: summary.relatedIdeaMergeAuditCount + (index === 0 ? relatedIdeaMergeAuditCount : 0),
      relatedIdeaMergeReuseCount: summary.relatedIdeaMergeReuseCount + (index === 0 ? relatedIdeaMergeReuseCount : 0),
      relatedIdeaMergeMergeCount: summary.relatedIdeaMergeMergeCount + (index === 0 ? relatedIdeaMergeMergeCount : 0),
      relatedIdeaMergeForkCount: summary.relatedIdeaMergeForkCount + (index === 0 ? relatedIdeaMergeForkCount : 0),
      relatedIdeaMergeKeepSeparateCount: summary.relatedIdeaMergeKeepSeparateCount + (index === 0 ? relatedIdeaMergeKeepSeparateCount : 0),
      learningReinvestmentQueueCount: summary.learningReinvestmentQueueCount + (index === 0 ? learningReinvestmentQueueCount : 0),
      learningReinvestmentReadyCount: summary.learningReinvestmentReadyCount + (index === 0 ? learningReinvestmentReadyCount : 0),
      learningReinvestmentNeedsOwnerCount: summary.learningReinvestmentNeedsOwnerCount + (index === 0 ? learningReinvestmentNeedsOwnerCount : 0),
      learningReinvestmentBlockedCount: summary.learningReinvestmentBlockedCount + (index === 0 ? learningReinvestmentBlockedCount : 0),
      learningReinvestmentWatchCount: summary.learningReinvestmentWatchCount + (index === 0 ? learningReinvestmentWatchCount : 0),
      learningReinvestmentCriticalCount: summary.learningReinvestmentCriticalCount + (index === 0 ? learningReinvestmentCriticalCount : 0),
      learningReinvestmentHighCount: summary.learningReinvestmentHighCount + (index === 0 ? learningReinvestmentHighCount : 0),
      opportunityDiscoveryBacklogCount: summary.opportunityDiscoveryBacklogCount + (index === 0 ? opportunityDiscoveryBacklogCount : 0),
      opportunityDiscoveryReadyCount: summary.opportunityDiscoveryReadyCount + (index === 0 ? opportunityDiscoveryReadyCount : 0),
      opportunityDiscoveryNeedsSourceCount: summary.opportunityDiscoveryNeedsSourceCount + (index === 0 ? opportunityDiscoveryNeedsSourceCount : 0),
      opportunityDiscoveryWatchCount: summary.opportunityDiscoveryWatchCount + (index === 0 ? opportunityDiscoveryWatchCount : 0),
      opportunityDiscoveryBlockedCount: summary.opportunityDiscoveryBlockedCount + (index === 0 ? opportunityDiscoveryBlockedCount : 0),
      opportunityDiscoveryHighPriorityCount: summary.opportunityDiscoveryHighPriorityCount + (index === 0 ? opportunityDiscoveryHighPriorityCount : 0),
      overlookedOpportunityAtlasCount: summary.overlookedOpportunityAtlasCount + (index === 0 ? overlookedOpportunityAtlasCount : 0),
      overlookedOpportunityRankedCount: summary.overlookedOpportunityRankedCount + (index === 0 ? overlookedOpportunityRankedCount : 0),
      overlookedOpportunityNeedsSourceCount: summary.overlookedOpportunityNeedsSourceCount + (index === 0 ? overlookedOpportunityNeedsSourceCount : 0),
      overlookedOpportunityWatchCount: summary.overlookedOpportunityWatchCount + (index === 0 ? overlookedOpportunityWatchCount : 0),
      overlookedOpportunityBlockedCount: summary.overlookedOpportunityBlockedCount + (index === 0 ? overlookedOpportunityBlockedCount : 0),
      overlookedOpportunityCriticalCount: summary.overlookedOpportunityCriticalCount + (index === 0 ? overlookedOpportunityCriticalCount : 0),
      overlookedOpportunityHighPriorityCount: summary.overlookedOpportunityHighPriorityCount + (index === 0 ? overlookedOpportunityHighPriorityCount : 0),
      averageOverlookedOpportunityRankScore: index === 0 ? averageOverlookedOpportunityRankScore : summary.averageOverlookedOpportunityRankScore,
      averageOverlookedOpportunityNoveltyScore: index === 0 ? averageOverlookedOpportunityNoveltyScore : summary.averageOverlookedOpportunityNoveltyScore,
      atlasValidationCommandPackCount: summary.atlasValidationCommandPackCount + (index === 0 ? atlasValidationCommandPackCount : 0),
      atlasValidationCommandPackReadyCount: summary.atlasValidationCommandPackReadyCount + (index === 0 ? atlasValidationCommandPackReadyCount : 0),
      atlasValidationCommandPackNeedsApprovalCount: summary.atlasValidationCommandPackNeedsApprovalCount + (index === 0 ? atlasValidationCommandPackNeedsApprovalCount : 0),
      atlasValidationCommandPackNeedsSourceCount: summary.atlasValidationCommandPackNeedsSourceCount + (index === 0 ? atlasValidationCommandPackNeedsSourceCount : 0),
      atlasValidationCommandPackBlockedCount: summary.atlasValidationCommandPackBlockedCount + (index === 0 ? atlasValidationCommandPackBlockedCount : 0),
      atlasValidationCommandPackCriticalCount: summary.atlasValidationCommandPackCriticalCount + (index === 0 ? atlasValidationCommandPackCriticalCount : 0),
      atlasValidationCommandPackHighPriorityCount: summary.atlasValidationCommandPackHighPriorityCount + (index === 0 ? atlasValidationCommandPackHighPriorityCount : 0),
      atlasValidationResultCount: summary.atlasValidationResultCount + (index === 0 ? atlasValidationResultCount : 0),
      atlasValidationResultPassedCount: summary.atlasValidationResultPassedCount + (index === 0 ? atlasValidationResultPassedCount : 0),
      atlasValidationResultFailedCount: summary.atlasValidationResultFailedCount + (index === 0 ? atlasValidationResultFailedCount : 0),
      atlasValidationResultPivotCount: summary.atlasValidationResultPivotCount + (index === 0 ? atlasValidationResultPivotCount : 0),
      atlasValidationResultInconclusiveCount: summary.atlasValidationResultInconclusiveCount + (index === 0 ? atlasValidationResultInconclusiveCount : 0),
      atlasValidationResultQualifiedBuyerCount: summary.atlasValidationResultQualifiedBuyerCount + (index === 0 ? atlasValidationResultQualifiedBuyerCount : 0),
      atlasValidationResultPaidPricingSignalCount: summary.atlasValidationResultPaidPricingSignalCount + (index === 0 ? atlasValidationResultPaidPricingSignalCount : 0),
      productBuildCommandCount: summary.productBuildCommandCount + (index === 0 ? productBuildCommandCount : 0),
      productBuildReadyCount: summary.productBuildReadyCount + (index === 0 ? productBuildReadyCount : 0),
      productBuildNeedsProofCount: summary.productBuildNeedsProofCount + (index === 0 ? productBuildNeedsProofCount : 0),
      productBuildBlockedCount: summary.productBuildBlockedCount + (index === 0 ? productBuildBlockedCount : 0),
      productBuildVerifiedCount: summary.productBuildVerifiedCount + (index === 0 ? productBuildVerifiedCount : 0),
      productBuildCriticalCount: summary.productBuildCriticalCount + (index === 0 ? productBuildCriticalCount : 0),
      productBuildRunCount: summary.productBuildRunCount + (index === 0 ? productBuildRunCount : 0),
      productBuildRunExecutedCount: summary.productBuildRunExecutedCount + (index === 0 ? productBuildRunExecutedCount : 0),
      productBuildRunImportedCount: summary.productBuildRunImportedCount + (index === 0 ? productBuildRunImportedCount : 0),
      productBuildRunPromotedCount: summary.productBuildRunPromotedCount + (index === 0 ? productBuildRunPromotedCount : 0),
      mvpReleaseWorkspaceCount: summary.mvpReleaseWorkspaceCount + (index === 0 ? mvpReleaseWorkspaceCount : 0),
      mvpReleaseReadyCount: summary.mvpReleaseReadyCount + (index === 0 ? mvpReleaseReadyCount : 0),
      mvpReleaseNeedsRunProofCount: summary.mvpReleaseNeedsRunProofCount + (index === 0 ? mvpReleaseNeedsRunProofCount : 0),
      mvpReleaseNeedsQaProofCount: summary.mvpReleaseNeedsQaProofCount + (index === 0 ? mvpReleaseNeedsQaProofCount : 0),
      mvpReleaseBlockedCount: summary.mvpReleaseBlockedCount + (index === 0 ? mvpReleaseBlockedCount : 0),
      pilotCohortSignalGateCount: summary.pilotCohortSignalGateCount + (index === 0 ? pilotCohortSignalGateCount : 0),
      pilotCohortSignalGateReadyCount: summary.pilotCohortSignalGateReadyCount + (index === 0 ? pilotCohortSignalGateReadyCount : 0),
      pilotCohortSignalGateNeedsReleaseWorkspaceCount: summary.pilotCohortSignalGateNeedsReleaseWorkspaceCount + (index === 0 ? pilotCohortSignalGateNeedsReleaseWorkspaceCount : 0),
      pilotCohortSignalGateNeedsInboundSignalCount: summary.pilotCohortSignalGateNeedsInboundSignalCount + (index === 0 ? pilotCohortSignalGateNeedsInboundSignalCount : 0),
      pilotCohortSignalGateBlockedCount: summary.pilotCohortSignalGateBlockedCount + (index === 0 ? pilotCohortSignalGateBlockedCount : 0),
      pilotCohortSignalGateCriticalCount: summary.pilotCohortSignalGateCriticalCount + (index === 0 ? pilotCohortSignalGateCriticalCount : 0),
      pilotCohortSignalGateHighCount: summary.pilotCohortSignalGateHighCount + (index === 0 ? pilotCohortSignalGateHighCount : 0),
      noSendEmailGateWorklistCount: summary.noSendEmailGateWorklistCount + (index === 0 ? noSendEmailGateWorklistCount : 0),
      noSendEmailGateDraftReadyCount: summary.noSendEmailGateDraftReadyCount + (index === 0 ? noSendEmailGateDraftReadyCount : 0),
      noSendEmailGateNeedsPilotGateCount: summary.noSendEmailGateNeedsPilotGateCount + (index === 0 ? noSendEmailGateNeedsPilotGateCount : 0),
      noSendEmailGateBlockedCount: summary.noSendEmailGateBlockedCount + (index === 0 ? noSendEmailGateBlockedCount : 0),
      noSendEmailGateCriticalCount: summary.noSendEmailGateCriticalCount + (index === 0 ? noSendEmailGateCriticalCount : 0),
      launchControlQueueCount: summary.launchControlQueueCount + (index === 0 ? launchControlQueueCount : 0),
      launchControlReadyCount: summary.launchControlReadyCount + (index === 0 ? launchControlReadyCount : 0),
      launchControlNeedsApprovalCount: summary.launchControlNeedsApprovalCount + (index === 0 ? launchControlNeedsApprovalCount : 0),
      launchControlBlockedCount: summary.launchControlBlockedCount + (index === 0 ? launchControlBlockedCount : 0),
      launchControlRecordedCount: summary.launchControlRecordedCount + (index === 0 ? launchControlRecordedCount : 0),
      launchControlCriticalCount: summary.launchControlCriticalCount + (index === 0 ? launchControlCriticalCount : 0),
      demandCaptureProofQueueCount: summary.demandCaptureProofQueueCount + (index === 0 ? demandCaptureProofQueueCount : 0),
      demandCaptureCapturedCount: summary.demandCaptureCapturedCount + (index === 0 ? demandCaptureCapturedCount : 0),
      demandCaptureNeedsFollowUpCount: summary.demandCaptureNeedsFollowUpCount + (index === 0 ? demandCaptureNeedsFollowUpCount : 0),
      demandCaptureBlockedCount: summary.demandCaptureBlockedCount + (index === 0 ? demandCaptureBlockedCount : 0),
      demandCaptureWeakCount: summary.demandCaptureWeakCount + (index === 0 ? demandCaptureWeakCount : 0),
      demandCaptureCriticalCount: summary.demandCaptureCriticalCount + (index === 0 ? demandCaptureCriticalCount : 0),
      portfolioDecisionCommandCount: summary.portfolioDecisionCommandCount + (index === 0 ? portfolioDecisionCommandCount : 0),
      portfolioDecisionReadyCount: summary.portfolioDecisionReadyCount + (index === 0 ? portfolioDecisionReadyCount : 0),
      portfolioDecisionNeedsProofCount: summary.portfolioDecisionNeedsProofCount + (index === 0 ? portfolioDecisionNeedsProofCount : 0),
      portfolioDecisionBlockedCount: summary.portfolioDecisionBlockedCount + (index === 0 ? portfolioDecisionBlockedCount : 0),
      portfolioDecisionHumanReviewCount: summary.portfolioDecisionHumanReviewCount + (index === 0 ? portfolioDecisionHumanReviewCount : 0),
      portfolioDecisionContinueCount: summary.portfolioDecisionContinueCount + (index === 0 ? portfolioDecisionContinueCount : 0),
      portfolioDecisionPivotCount: summary.portfolioDecisionPivotCount + (index === 0 ? portfolioDecisionPivotCount : 0),
      portfolioDecisionPauseCount: summary.portfolioDecisionPauseCount + (index === 0 ? portfolioDecisionPauseCount : 0),
      portfolioDecisionKillCount: summary.portfolioDecisionKillCount + (index === 0 ? portfolioDecisionKillCount : 0),
      portfolioDecisionScaleCount: summary.portfolioDecisionScaleCount + (index === 0 ? portfolioDecisionScaleCount : 0),
      portfolioDecisionDemandSourceBlockerCount: summary.portfolioDecisionDemandSourceBlockerCount + (index === 0 ? portfolioDecisionDemandSourceBlockerCount : 0),
      portfolioDecisionDemandSourceBlockedCount: summary.portfolioDecisionDemandSourceBlockedCount + (index === 0 ? portfolioDecisionDemandSourceBlockedCount : 0),
      portfolioDecisionDemandSourceWeakPressureCount: summary.portfolioDecisionDemandSourceWeakPressureCount + (index === 0 ? portfolioDecisionDemandSourceWeakPressureCount : 0),
      portfolioDecisionDemandSourceBlockerTypeCount: summary.portfolioDecisionDemandSourceBlockerTypeCount + (index === 0 ? portfolioDecisionDemandSourceBlockerTypeCount : 0),
      portfolioDecisionDemandSourceBlockerBreakdown: index === 0 ? portfolioDecisionDemandSourceBlockerBreakdown : summary.portfolioDecisionDemandSourceBlockerBreakdown,
      portfolioDecisionPivotDemandSourceBlockerCount: summary.portfolioDecisionPivotDemandSourceBlockerCount + (index === 0 ? portfolioDecisionPivotDemandSourceBlockerCount : 0),
      portfolioDecisionPauseDemandSourceBlockerCount: summary.portfolioDecisionPauseDemandSourceBlockerCount + (index === 0 ? portfolioDecisionPauseDemandSourceBlockerCount : 0),
      portfolioDecisionKillDemandSourceBlockerCount: summary.portfolioDecisionKillDemandSourceBlockerCount + (index === 0 ? portfolioDecisionKillDemandSourceBlockerCount : 0),
      autonomyAuditCount: summary.autonomyAuditCount + venture.autonomyAudit.length,
      externalApprovedActionCount: summary.externalApprovedActionCount + venture.autonomyAudit.filter((audit) => audit.sideEffect === "external-approved").length,
      externalBlockedActionCount: summary.externalBlockedActionCount + venture.autonomyAudit.filter((audit) => audit.sideEffect === "external-blocked").length,
      replayableActionCount: summary.replayableActionCount + venture.autonomyAudit.filter((audit) => audit.replayNote !== "No replay note recorded.").length,
      untriagedAutonomyAuditCandidateCount: summary.untriagedAutonomyAuditCandidateCount + autonomyAuditCandidates.length,
      deploymentStaleEscalationCandidateCount: summary.deploymentStaleEscalationCandidateCount + autonomyAuditCandidates.filter((candidate) => candidate.actionType.startsWith("No-send deployment escalation")).length,
      agentRunCount: summary.agentRunCount + venture.agentRuns.length,
      modelCallLogCount: summary.modelCallLogCount + venture.agentRuns.filter((run) => run.prompt !== "No prompt recorded." && run.model !== "model-not-recorded").length,
      replayableAgentRunCount: summary.replayableAgentRunCount + venture.agentRuns.filter((run) => run.replayCommand !== "No replay command recorded.").length,
      blockedAgentRunCount: summary.blockedAgentRunCount + venture.agentRuns.filter((run) => run.status === "blocked").length,
      untriagedAgentRunCandidateCount: summary.untriagedAgentRunCandidateCount + agentRunCandidates.length,
      competitorRecordCount: summary.competitorRecordCount + venture.competitors.length,
      highThreatCompetitorCount: summary.highThreatCompetitorCount + venture.competitors.filter((competitor) => competitor.threatLevel === "high" || competitor.threatLevel === "critical").length,
      substituteCompetitorCount: summary.substituteCompetitorCount + venture.competitors.filter((competitor) => competitor.competitorType === "substitute" || competitor.competitorType === "status-quo").length,
      untriagedCompetitorCandidateCount: summary.untriagedCompetitorCandidateCount + competitorCandidates.length,
      browserResearchTaskCount: summary.browserResearchTaskCount + venture.browserResearchTasks.length,
      queuedBrowserResearchTaskCount: summary.queuedBrowserResearchTaskCount + venture.browserResearchTasks.filter((task) => task.status === "queued" || task.status === "running").length,
      capturedBrowserResearchTaskCount: summary.capturedBrowserResearchTaskCount + venture.browserResearchTasks.filter((task) => task.status === "evidence-captured").length,
      blockedBrowserResearchTaskCount: summary.blockedBrowserResearchTaskCount + venture.browserResearchTasks.filter((task) => task.status === "blocked").length,
      untriagedBrowserResearchCandidateCount: summary.untriagedBrowserResearchCandidateCount + browserResearchCandidates.length,
    };
  }, {
    ventureCount: 0,
    evidenceSourceCount: 0,
    plannedExperimentCount: 0,
    experimentLaunchPackCount: 0,
    launchPackReadyCount: 0,
    launchPackNeedsApprovalCount: 0,
    launchPackRecordedCount: 0,
    launchPackBlockedCount: 0,
    qaReleaseReportCount: 0,
    qaReadyCount: 0,
    qaNeedsFixesCount: 0,
    qaBlockedCount: 0,
    deploymentReadinessPacketCount: 0,
    deploymentProposalReadyCount: 0,
    deploymentNeedsProofCount: 0,
    deploymentBlockedPacketCount: 0,
    deploymentOwnedRoadmapBlockerCount: 0,
    deploymentOwnedSupportBlockerCount: 0,
    investorBriefCount: 0,
    investableBriefCount: 0,
    watchBriefCount: 0,
    notReadyBriefCount: 0,
    financialModelCount: 0,
    financialScaleReadyCount: 0,
    financialNeedsProofCount: 0,
    financialRunwayRiskCount: 0,
    financialBlockedCount: 0,
    averageFinanceScore: 0,
    humanGateCount: 0,
    averageReadinessScore: 0,
    marketModelAverageConfidenceScore: 0,
    marketModelHighConfidenceCount: 0,
    marketModelMediumConfidenceCount: 0,
    marketModelLowConfidenceCount: 0,
    marketModelMissingProofCount: 0,
    dominantMarketProofGap: "None",
    riskiestMarketTitle: "None",
    riskiestMarketConfidenceScore: 0,
    founderExecutionMemoCount: 0,
    founderExecutionMemoReadyCount: 0,
    founderExecutionMemoPressureTestCount: 0,
    founderExecutionMemoBlockedCount: 0,
    decisionReadyCount: 0,
    needsPressureTestCount: 0,
    tooThinCount: 0,
    openGapTaskCount: 0,
    completedGapOutcomeCount: 0,
    launchedGapTaskCount: 0,
    killPressureCount: 0,
    scalePressureCount: 0,
    measuredExperimentCount: 0,
      demandPassCount: 0,
      demandFailCount: 0,
      demandInconclusiveCount: 0,
      demandDriftMeasuredCount: 0,
      demandDriftConfirmedCount: 0,
      demandOverestimatedCount: 0,
      demandUnderestimatedCount: 0,
      demandDriftMixedCount: 0,
      predictionSnapshotCount: 0,
      confirmedPredictionCount: 0,
      surprisedPredictionCount: 0,
    pricingSignalCount: 0,
    paidPricingSignalCount: 0,
    pricingValidatedCount: 0,
    pricingRejectedCount: 0,
    customerInterviewCount: 0,
    positiveInterviewCount: 0,
    negativeInterviewCount: 0,
    featureRequestCount: 0,
    outreachApprovalCount: 0,
    humanApprovedOutreachCount: 0,
    manualOutreachPlannedCount: 0,
    notSentOutreachCount: 0,
    outreachCampaignCount: 0,
    outreachCampaignReadyCount: 0,
    outreachCampaignNeedsApprovalCount: 0,
    outreachCampaignBlockedCount: 0,
    outreachCampaignRecordedCount: 0,
    riskRecordCount: 0,
    openRiskCount: 0,
    highRiskCount: 0,
    resolvedRiskCount: 0,
    customerInboxRiskCount: 0,
    untriagedRiskCandidateCount: 0,
    mvpBuildWorkspaceCount: 0,
    mvpRepoAttachedCount: 0,
    mvpExecutableCount: 0,
    mvpBlockedCount: 0,
    mvpVerificationPassedCount: 0,
    generatedAppHandoffCount: 0,
    generatedAppSourcePendingCount: 0,
    generatedAppBriefReadyCount: 0,
    generatedAppRepoAttachedCount: 0,
    generatedAppExecutableCount: 0,
    generatedAppSourceScaffoldCount: 0,
    generatedAppSourceFileCount: 0,
    generatedAppReadyToMaterializeCount: 0,
    generatedAppNoFakeSourceGuardCount: 0,
    generatedAppVerificationProofCount: 0,
    generatedAppVerifiedProofCount: 0,
    generatedAppPartialProofCount: 0,
    generatedAppMissingProofCount: 0,
    artifactRecordCount: 0,
    verifiedArtifactCount: 0,
    blockedArtifactCount: 0,
    deploymentProofCount: 0,
    changelogEntryCount: 0,
    moneySignalCount: 0,
    revenueCents: 0,
    expenseCents: 0,
    netRevenueCents: 0,
    committedRevenueCents: 0,
    runwayRiskCount: 0,
    roadmapTaskCount: 0,
    openRoadmapTaskCount: 0,
    highRoadmapTaskCount: 0,
    supportLoadTaskCount: 0,
    untriagedRoadmapCandidateCount: 0,
    supportIssueCount: 0,
    supportQuestionCount: 0,
    pilotIssueCount: 0,
    openSupportIssueCount: 0,
    criticalSupportIssueCount: 0,
    resolvedSupportIssueCount: 0,
    retentionRiskIssueCount: 0,
    untriagedSupportIssueCandidateCount: 0,
    activationCohortCount: 0,
    cohortSignupCount: 0,
    activatedUserCount: 0,
    retainedUserCount: 0,
    paidCohortUserCount: 0,
    cohortRevenueCents: 0,
    cohortSupportIssueCount: 0,
    averageActivationRate: 0,
    averageRetentionRate: 0,
    untriagedActivationCohortCandidateCount: 0,
    channelEconomicsCount: 0,
    acquisitionSpendCents: 0,
    channelSignupCount: 0,
    channelActivatedCount: 0,
    channelPaidUserCount: 0,
    channelRevenueCents: 0,
    blendedCacCents: 0,
    paidBackChannelCount: 0,
    untriagedChannelEconomicsCandidateCount: 0,
    killRuleSignalCount: 0,
    killRuleKillRecommendationCount: 0,
    killRulePauseRecommendationCount: 0,
    killRulePivotRecommendationCount: 0,
    killRuleScaleRecommendationCount: 0,
    killDecisionArtifactCount: 0,
    killDecisionStopCount: 0,
    killDecisionContinueCount: 0,
    killDecisionScaleCount: 0,
    weakBranchKillMemoryCount: 0,
    weakBranchKillRecommendedCount: 0,
    weakBranchPauseRecommendedCount: 0,
    weakBranchArchivedCount: 0,
    weakBranchRevivalWatchCount: 0,
    revenueGenerationPostureCount: 0,
    revenueGenerationPaidValidationCount: 0,
    revenueGenerationRepeatableCount: 0,
    revenueGenerationScalingCount: 0,
    revenueGenerationBlockedCount: 0,
    revenueGenerationNoEvidenceCount: 0,
    revenueGenerationEvidenceCents: 0,
    averageRevenueGenerationCaptureScore: 0,
    scaleStrongBranchPlanCount: 0,
    scaleStrongBranchReadyCount: 0,
    scaleStrongBranchApprovalRequiredCount: 0,
    scaleStrongBranchNeedsProofCount: 0,
    scaleStrongBranchBlockedCount: 0,
    scaleStrongBranchSpendCeilingCents: 0,
    spawnedVentureDraftCount: 0,
    spawnedVentureDraftReadyCount: 0,
    spawnedVentureDraftNeedsEvidenceCount: 0,
    spawnedVentureDraftBlockedCount: 0,
    spawnedVentureDraftConvertedPainCount: 0,
    spawnedVentureDraftRetainedUserCount: 0,
    spawnedVentureDraftWorkedChannelCount: 0,
    spawnedVentureDraftConvertedPricingCount: 0,
    relatedIdeaMergeAuditCount: 0,
    relatedIdeaMergeReuseCount: 0,
    relatedIdeaMergeMergeCount: 0,
    relatedIdeaMergeForkCount: 0,
    relatedIdeaMergeKeepSeparateCount: 0,
    learningReinvestmentQueueCount: 0,
    learningReinvestmentReadyCount: 0,
    learningReinvestmentNeedsOwnerCount: 0,
    learningReinvestmentBlockedCount: 0,
    learningReinvestmentWatchCount: 0,
    learningReinvestmentCriticalCount: 0,
    learningReinvestmentHighCount: 0,
    opportunityDiscoveryBacklogCount: 0,
    opportunityDiscoveryReadyCount: 0,
    opportunityDiscoveryNeedsSourceCount: 0,
    opportunityDiscoveryWatchCount: 0,
    opportunityDiscoveryBlockedCount: 0,
    opportunityDiscoveryHighPriorityCount: 0,
    overlookedOpportunityAtlasCount: 0,
    overlookedOpportunityRankedCount: 0,
    overlookedOpportunityNeedsSourceCount: 0,
    overlookedOpportunityWatchCount: 0,
    overlookedOpportunityBlockedCount: 0,
    overlookedOpportunityCriticalCount: 0,
    overlookedOpportunityHighPriorityCount: 0,
    averageOverlookedOpportunityRankScore: 0,
    averageOverlookedOpportunityNoveltyScore: 0,
    atlasValidationCommandPackCount: 0,
    atlasValidationCommandPackReadyCount: 0,
    atlasValidationCommandPackNeedsApprovalCount: 0,
    atlasValidationCommandPackNeedsSourceCount: 0,
    atlasValidationCommandPackBlockedCount: 0,
    atlasValidationCommandPackCriticalCount: 0,
    atlasValidationCommandPackHighPriorityCount: 0,
    atlasValidationResultCount: 0,
    atlasValidationResultPassedCount: 0,
    atlasValidationResultFailedCount: 0,
    atlasValidationResultPivotCount: 0,
    atlasValidationResultInconclusiveCount: 0,
    atlasValidationResultQualifiedBuyerCount: 0,
    atlasValidationResultPaidPricingSignalCount: 0,
    productBuildCommandCount: 0,
    productBuildReadyCount: 0,
    productBuildNeedsProofCount: 0,
    productBuildBlockedCount: 0,
    productBuildVerifiedCount: 0,
    productBuildCriticalCount: 0,
    productBuildRunCount: 0,
    productBuildRunExecutedCount: 0,
    productBuildRunImportedCount: 0,
    productBuildRunPromotedCount: 0,
    mvpReleaseWorkspaceCount: 0,
    mvpReleaseReadyCount: 0,
    mvpReleaseNeedsRunProofCount: 0,
    mvpReleaseNeedsQaProofCount: 0,
    mvpReleaseBlockedCount: 0,
    pilotCohortSignalGateCount: 0,
    pilotCohortSignalGateReadyCount: 0,
    pilotCohortSignalGateNeedsReleaseWorkspaceCount: 0,
    pilotCohortSignalGateNeedsInboundSignalCount: 0,
    pilotCohortSignalGateBlockedCount: 0,
    pilotCohortSignalGateCriticalCount: 0,
    pilotCohortSignalGateHighCount: 0,
    noSendEmailGateWorklistCount: 0,
    noSendEmailGateDraftReadyCount: 0,
    noSendEmailGateNeedsPilotGateCount: 0,
    noSendEmailGateBlockedCount: 0,
    noSendEmailGateCriticalCount: 0,
    launchControlQueueCount: 0,
    launchControlReadyCount: 0,
    launchControlNeedsApprovalCount: 0,
    launchControlBlockedCount: 0,
    launchControlRecordedCount: 0,
    launchControlCriticalCount: 0,
    demandCaptureProofQueueCount: 0,
    demandCaptureCapturedCount: 0,
    demandCaptureNeedsFollowUpCount: 0,
    demandCaptureBlockedCount: 0,
    demandCaptureWeakCount: 0,
    demandCaptureCriticalCount: 0,
    portfolioDecisionCommandCount: 0,
    portfolioDecisionReadyCount: 0,
    portfolioDecisionNeedsProofCount: 0,
    portfolioDecisionBlockedCount: 0,
    portfolioDecisionHumanReviewCount: 0,
    portfolioDecisionContinueCount: 0,
    portfolioDecisionPivotCount: 0,
    portfolioDecisionPauseCount: 0,
    portfolioDecisionKillCount: 0,
    portfolioDecisionScaleCount: 0,
    portfolioDecisionDemandSourceBlockerCount: 0,
    portfolioDecisionDemandSourceBlockedCount: 0,
    portfolioDecisionDemandSourceWeakPressureCount: 0,
    portfolioDecisionDemandSourceBlockerTypeCount: 0,
    portfolioDecisionDemandSourceBlockerBreakdown: "None",
    portfolioDecisionPivotDemandSourceBlockerCount: 0,
    portfolioDecisionPauseDemandSourceBlockerCount: 0,
    portfolioDecisionKillDemandSourceBlockerCount: 0,
    autonomyAuditCount: 0,
    externalApprovedActionCount: 0,
    externalBlockedActionCount: 0,
    replayableActionCount: 0,
    untriagedAutonomyAuditCandidateCount: 0,
    deploymentStaleEscalationCandidateCount: 0,
    agentRunCount: 0,
    modelCallLogCount: 0,
    replayableAgentRunCount: 0,
    blockedAgentRunCount: 0,
    untriagedAgentRunCandidateCount: 0,
    competitorRecordCount: 0,
    highThreatCompetitorCount: 0,
    substituteCompetitorCount: 0,
    untriagedCompetitorCandidateCount: 0,
    browserResearchTaskCount: 0,
    queuedBrowserResearchTaskCount: 0,
    capturedBrowserResearchTaskCount: 0,
    blockedBrowserResearchTaskCount: 0,
    untriagedBrowserResearchCandidateCount: 0,
  });
}
