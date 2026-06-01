import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Activity, BarChart3, BookmarkPlus, BriefcaseBusiness, CalendarClock, ClipboardCheck, ClipboardList, Code2, DollarSign, ExternalLink, FlaskConical, Gauge, ListFilter, MessageSquareText, PackageCheck, RefreshCw, Send, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RuntimeHealthStrip } from "@/components/research/RuntimeHealthStrip";
import { SpawnedVentureDraftPanel } from "@/components/research/SpawnedVentureDraftPanel";
import { RelatedIdeaMergeAuditPanel } from "@/components/research/RelatedIdeaMergeAuditPanel";
import { OpportunityDiscoveryBacklogPanel } from "@/components/research/OpportunityDiscoveryBacklogPanel";
import { OverlookedOpportunityAtlasPanel } from "@/components/research/OverlookedOpportunityAtlasPanel";
import { AtlasValidationCommandPackPanel } from "@/components/research/AtlasValidationCommandPackPanel";
import { PortfolioImportPreviewBadges } from "@/components/research/PortfolioImportPreviewBadges";
import { LaunchControlQueuePanel } from "@/components/research/LaunchControlQueuePanel";
import { PortfolioDecisionCommandQueuePanel } from "@/components/research/PortfolioDecisionCommandQueuePanel";
import { ScaleStrongBranchPlanPanel } from "@/components/research/ScaleStrongBranchPlanPanel";
import { DemandCaptureProofQueuePanel } from "@/components/research/DemandCaptureProofQueuePanel";
import { ProductBuildCommandRunLedgerPanel } from "@/components/research/ProductBuildCommandRunLedgerPanel";
import { LearningReinvestmentQueuePanel } from "@/components/research/LearningReinvestmentQueuePanel";
import { PortfolioChartPanel } from "@/components/research/PortfolioChartPanel";
import { DemandSourceBlockerDrilldownPanel } from "@/components/research/DemandSourceBlockerDrilldownPanel";
import { BreachProcessPlanCard } from "@/components/research/BreachProcessPlanCard";
import { WorkloadDriftPanel } from "@/components/research/WorkloadDriftPanel";
import { OwnerWorkloadSummaryPanel } from "@/components/research/OwnerWorkloadSummaryPanel";
import { OwnerTriageQueuePanel } from "@/components/research/OwnerTriageQueuePanel";
import { DemandSourceBlockerPacketTriageQueuePanel } from "@/components/research/DemandSourceBlockerPacketTriageQueuePanel";
import { FailedOutreachMemoryPanel } from "@/components/research/FailedOutreachMemoryPanel";
import { NoSendEmailGateWorklistPanel } from "@/components/research/NoSendEmailGateWorklistPanel";
import { MvpReleaseWorkspacePanel } from "@/components/research/MvpReleaseWorkspacePanel";
import { PilotCohortSignalGatePanel } from "@/components/research/PilotCohortSignalGatePanel";
import { QaReleaseReportPanel } from "@/components/research/QaReleaseReportPanel";
import { DeploymentReadinessPacketPanel } from "@/components/research/DeploymentReadinessPacketPanel";
import { ArtifactChangelogLedgerPanel } from "@/components/research/ArtifactChangelogLedgerPanel";
import { RevenueCostLedgerPanel } from "@/components/research/RevenueCostLedgerPanel";
import { RoadmapSupportQueuePanel } from "@/components/research/RoadmapSupportQueuePanel";
import { SupportPilotIssueLogPanel } from "@/components/research/SupportPilotIssueLogPanel";
import { ActivationRetentionCohortsPanel } from "@/components/research/ActivationRetentionCohortsPanel";
import { ChannelEconomicsCacPanel } from "@/components/research/ChannelEconomicsCacPanel";
import { KillPressureRulesPanel } from "@/components/research/KillPressureRulesPanel";
import { KillDecisionArtifactPanel } from "@/components/research/KillDecisionArtifactPanel";
import { CompetitorWatchlistPanel } from "@/components/research/CompetitorWatchlistPanel";
import { ConvertedPainMemoryPanel } from "@/components/research/ConvertedPainMemoryPanel";
import { ConvertedPricingMemoryPanel } from "@/components/research/ConvertedPricingMemoryPanel";
import { MvpFeatureMemoryPanel } from "@/components/research/MvpFeatureMemoryPanel";
import { RetainedUserMemoryPanel } from "@/components/research/RetainedUserMemoryPanel";
import { SuccessPredictionMemoryPanel } from "@/components/research/SuccessPredictionMemoryPanel";
import { VanityMetricMemoryPanel } from "@/components/research/VanityMetricMemoryPanel";
import { GeneratedCodePatternMemoryPanel } from "@/components/research/GeneratedCodePatternMemoryPanel";
import { EmpiricalCalibrationMemoryPanel } from "@/components/research/EmpiricalCalibrationMemoryPanel";
import { FakeMarketMemoryPanel } from "@/components/research/FakeMarketMemoryPanel";
import { WrongClaimMemoryPanel } from "@/components/research/WrongClaimMemoryPanel";
import { WorkedChannelMemoryPanel } from "@/components/research/WorkedChannelMemoryPanel";
import { FailureLessonsPanel } from "@/components/research/FailureLessonsPanel";
import { WeakBranchKillMemoryPanel } from "@/components/research/WeakBranchKillMemoryPanel";
import { RevivalTriggersPanel } from "@/components/research/RevivalTriggersPanel";
import { AutonomyAuditLogPanel } from "@/components/research/AutonomyAuditLogPanel";
import { AgentRunReplayLogPanel } from "@/components/research/AgentRunReplayLogPanel";
import { ExperimentLaunchPackPanel } from "@/components/research/ExperimentLaunchPackPanel";
import { ExperimentResultEntryPanel } from "@/components/research/ExperimentResultEntryPanel";
import { ManualAtlasValidationResultPanel } from "@/components/research/ManualAtlasValidationResultPanel";
import { LocalProductBuildRunProofPanel } from "@/components/research/LocalProductBuildRunProofPanel";
import { KillContinueDecisionPanel } from "@/components/research/KillContinueDecisionPanel";
import { KillCriteriaDeploymentBoundaryPanel } from "@/components/research/KillCriteriaDeploymentBoundaryPanel";
import { usePreferences } from "@/hooks/usePreferences";
import { useRecommendationFollowUpMission } from "@/hooks/useRecommendationFollowUpMission";
import {
  EMPTY_REGRESSION_ESCALATION_AUDIT_APPEAL_DRAFT,
  EMPTY_REGRESSION_ESCALATION_AUDIT_DRAFT,
  EMPTY_REGRESSION_ESCALATION_AUDIT_REVIEW_DRAFT,
  useRegressionEscalationAuditDrafts,
  type RegressionEscalationAuditStaleGovernanceContext,
} from "@/hooks/useRegressionEscalationAuditDrafts";
import { useRuntimeHealth } from "@/hooks/useRuntimeHealth";
import { useWorkerPreflight } from "@/hooks/useWorkerPreflight";
import {
  VENTURE_BROWSER_RESEARCH_STATUS_OPTIONS,
  VENTURE_DECISION_OPTIONS,
  VENTURE_EVIDENCE_FILTER_OPTIONS,
  VENTURE_MVP_BUILD_STATUS_OPTIONS,
  VENTURE_MVP_CHECK_STATUS_OPTIONS,
  VENTURE_OUTREACH_STATUS_OPTIONS,
  VENTURE_RISK_SEVERITY_OPTIONS,
  VENTURE_RISK_STATUS_OPTIONS,
  buildVentureGapActionQueue,
  buildVentureAgentRunCandidates,
  buildVentureActivationCohortCandidates,
  buildVentureAutonomyAuditCandidates,
  buildVentureBrowserResearchCandidates,
  buildVentureChannelEconomicsCandidates,
  buildVentureCompetitorCandidates,
  buildVentureConvertedPainMemories,
  buildVentureConvertedPricingMemories,
  buildVentureDemandDriftReport,
  buildVentureEmpiricalCalibrationMemories,
  buildVentureExperimentLaunchPack,
  buildVentureFakeMarketMemories,
  buildVentureFailedOutreachMemories,
  buildVentureFinancialModel,
  buildVentureFounderExecutionMemo,
  buildVentureGeneratedAppHandoff,
  buildVentureGeneratedAppVerificationProof,
  buildVentureGeneratedCodePatternMemories,
  buildVentureDeploymentReadinessPacket,
  buildVentureDeploymentEnvironmentMatrix,
  buildVentureDeploymentEscalationAuditRollup,
  buildVentureDeploymentOwnerWorklist,
  buildVentureFailureLessons,
  buildVentureInvestorBrief,
  buildVentureKillDecisionArtifact,
  buildVentureKillPressureReport,
  buildVentureRevenueGenerationPosture,
  buildVentureLearningReinvestmentQueue,
  buildVentureOpportunityDiscoveryBacklog,
  buildVentureOverlookedOpportunityAtlas,
  buildVentureAtlasValidationCommandPacks,
  buildVentureAtlasValidationResultLedger,
  buildVentureProductBuildCommandQueue,
  buildVentureProductBuildCommandRunLedger,
  buildVentureMvpReleaseWorkspaceList,
  buildVenturePilotCohortSignalGates,
  buildVentureNoSendEmailGateWorklist,
  buildVentureLaunchControlQueue,
  buildVentureDemandCaptureProofQueue,
  buildVentureDemandSourceBlockerDrilldowns,
  buildVenturePortfolioDecisionCommandQueue,
  buildVentureScaleStrongBranchPlan,
  buildVentureSpawnedVentureDrafts,
  buildVentureRelatedIdeaMergeAudits,
  buildVentureMarketModel,
  buildVentureMvpFeatureMemories,
  buildVentureOutreachCampaignBrief,
  buildVenturePortfolioChartPack,
  buildVentureQaReleaseReport,
  buildVentureReadinessNotices,
  buildVentureRevivalTriggers,
  buildVentureRetainedUserMemories,
  buildVentureSuccessPredictionMemories,
  buildVentureVanityMetricMemories,
  buildVentureWeakBranchKillMemories,
  buildVentureRoadmapCandidates,
  buildVentureRiskCandidates,
  buildVentureSupportIssueCandidates,
  buildVentureWrongClaimMemories,
  buildVentureWorkedChannelMemories,
  calibrateVentureDemand,
  calibrateVenturePricing,
  filterVenturePortfolio,
  filterVenturePortfolioByEvidence,
  findSimilarVentureTheses,
  loadVenturePortfolio,
  parseVenturePortfolioImport,
  recordVentureArtifact,
  recordVentureAgentRun,
  recordVentureActivationCohort,
  recordVentureAtlasValidationResult,
  recordVentureProductBuildCommandRun,
  recordVentureAutonomyAudit,
  recordVentureBrowserResearchTask,
  recordVentureChannelEconomics,
  recordVentureCompetitor,
  recordVentureDecision,
  recordVentureCustomerInterview,
  recordVentureExperimentResult,
  recordVentureGapAction,
  recordVentureGeneratedAppVerifierReport,
  recordVentureMvpBuildWorkspace,
  recordVentureMoneySignal,
  recordVentureNoSendEmailGateReplyProof,
  recordVentureOutreachApproval,
  recordVenturePricingSignal,
  recordVentureRisk,
  recordVentureRoadmapTask,
  recordVentureSupportIssue,
  replaceVenturePortfolio,
  saveVentureWorkspace,
  serializeVenturePortfolio,
  updateVentureRoadmapTaskStatus,
  updateVentureSupportIssueStatus,
  type VentureDecisionType,
  type VentureDemandCalibrationStatus,
  type VentureDemandDriftStatus,
  type VentureDeploymentEnvironmentId,
  type VentureDeploymentOwnerWorkItem,
  type VentureDeploymentOwnerSlaStatus,
  type VentureDeploymentOwnerWorkStatus,
  type VentureEvidenceFilter,
  type VentureEvidenceReadiness,
  type VentureFinancialModelStatus,
  type VentureRevenueGenerationStatus,
  type VentureAtlasValidationResultLedgerItem,
  type VentureAtlasValidationResultOutcome,
  type VentureProductBuildCommand,
  type VentureProductBuildCommandRunState,
  type VentureProductBuildCommandStatus,
  type VentureNoSendEmailGateReplyProofInput,
  type VentureDemandCaptureProofSourceType,
  type VentureDemandSourceBlockerDrilldownItem,
  type DemandSourceBlockerPacketTriageStatus,
  type DemandSourceBlockerPacketTriageInboxFilter,
  type DemandSourceBlockerPacketTriageAuditStatus,
  type DemandSourceBlockerSavedView,
  type DemandSourceBlockerSavedViewPacket,
  type DemandSourceBlockerPacketTriageState,
  type DemandSourceBlockerPacketTriageAuditEntry,
  type DemandSourceBlockerPacketTriageOwnerQueueItem,
  type DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem,
  type DemandSourceBlockerPacketTriageWorkloadDriftStatus,
  type DemandSourceBlockerPacketTriageWorkloadDriftReport,
  type DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry,
  type DemandSourceBlockerPacketTriageWorkloadPinnedSummary,
  type DemandSourceBlockerPacketHandoffHealthStatus,
  type DemandSourceBlockerPacketHandoffHealthItem,
  type DemandSourceBlockerPacketHandoffRemediationTrigger,
  type DemandSourceBlockerPacketHandoffRemediationPriority,
  type DemandSourceBlockerPacketHandoffReopenEscalationSeverity,
  type DemandSourceBlockerPacketHandoffRemediationPlanEntry,
  type DemandSourceBlockerPacketHandoffRemediationClosureReceipt,
  type DemandSourceBlockerPacketHandoffRemediationItem,
  type DemandSourceBlockerPacketHandoffReopenEscalationItem,
  type DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt,
  type DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt,
  type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem,
  type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan,
  type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt,
  type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression,
  type DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt,
  type VentureFounderExecutionMemoStatus,
  type VentureGeneratedAppHandoffStatus,
  type VentureGeneratedAppVerificationProofStatus,
  type VentureAgentRunSourceType,
  type VentureAgentRunStatus,
  type VentureActivationCohortSourceType,
  type VentureAutonomyApprovalLevel,
  type VentureAutonomyAuditStatus,
  type VentureAutonomyAuditCandidate,
  type VentureAutonomySideEffect,
  type VentureBrowserResearchSourceType,
  type VentureBrowserResearchStatus,
  type VentureChannelEconomicsSourceType,
  type VentureCompetitorSourceType,
  type VentureCompetitorStatus,
  type VentureCompetitorThreatLevel,
  type VentureCompetitorType,
  type VentureGapActionPriority,
  type VentureGapActionRecord,
  type VentureGapActionStatus,
  type VentureGapActionTask,
  type VentureInterviewSentiment,
  type VentureInvestorBriefStatus,
  type VentureLifecycleStatus,
  type VentureMarketModelConfidence,
  type VentureMvpBuildStatus,
  type VentureMvpBuildWorkspaceRecord,
  type VentureMvpCheckStatus,
  type VentureMoneySignalRecord,
  type VentureMoneySignalStatus,
  type VentureMoneySignalType,
  type VentureOutreachApprovalStatus,
  type VentureOutreachCampaignStatus,
  type VenturePredictionAlignment,
  type VenturePredictionOutcome,
  type VenturePricingCalibrationStatus,
  type VentureRoadmapSourceType,
  type VentureRoadmapTaskPriority,
  type VentureRoadmapTaskStatus,
  type VentureRiskSeverity,
  type VentureRiskStatus,
  type VentureRiskSourceType,
  type VentureSupportIssueSeverity,
  type VentureSupportIssueSourceType,
  type VentureSupportIssueStatus,
  type VentureSupportIssueType,
  type SavedVentureWorkspace,
  type VentureArtifactStatus,
  type VentureArtifactType,
  summarizeVentureEvidence,
  summarizeVentureDeploymentOwnerWorkload,
  summarizeVenturePortfolio,
} from "@/lib/venture-portfolio";
import {
  BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_ASSIGNMENTS_EXPORT_KEY,
  BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_APPEALS_EXPORT_KEY,
  BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_CLOSURES_EXPORT_KEY,
  BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_REVIEWS_EXPORT_KEY,
  BREACH_PROCESS_REGRESSION_ESCALATION_FRAGILE_GOVERNANCE_EXPIRY_DAYS,
  BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_REVOCATION_EXPIRY_DAYS,
  BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY,
  BREACH_PROCESS_REGRESSION_ESCALATIONS_EXPORT_KEY,
  auditBreachProcessRegressionEscalationGovernanceDigestConflicts,
  auditBreachProcessRegressionEscalationGovernanceDigestIntegrity,
  auditBreachProcessRegressionEscalationGovernanceDigestReplay,
  buildBreachProcessRegressionEscalations,
  buildBreachProcessRegressionEscalationGovernanceDigests,
  dedupeBreachProcessRegressionEscalationAuditAssignments,
  dedupeBreachProcessRegressionEscalationAuditAppeals,
  dedupeBreachProcessRegressionEscalationAuditClosures,
  dedupeBreachProcessRegressionEscalationAuditReviews,
  isBreachProcessRegressionEscalationAuditAssignment,
  isBreachProcessRegressionEscalationAuditAppeal,
  isBreachProcessRegressionEscalationAuditClosure,
  isBreachProcessRegressionEscalationAuditReview,
  formatBreachProcessRegressionEscalationGovernanceDigestConflictDrilldown,
  parseBreachProcessRegressionEscalationsImport,
  parseBreachProcessRegressionEscalationAuditAssignmentsImport,
  parseBreachProcessRegressionEscalationAuditAppealsImport,
  parseBreachProcessRegressionEscalationAuditClosuresImport,
  parseBreachProcessRegressionEscalationAuditReviewsImport,
  parseBreachProcessRegressionEscalationGovernanceDigestsImport,
  type BreachProcessRegressionEscalation,
  type BreachProcessRegressionEscalationAuditAssignment,
  type BreachProcessRegressionEscalationAuditAppeal,
  type BreachProcessRegressionEscalationAuditAppealStatus,
  type BreachProcessRegressionEscalationAuditClosure,
  type BreachProcessRegressionEscalationAuditReview,
  type BreachProcessRegressionEscalationAuditReviewOutcome,
} from "@/lib/breach-process-regression-escalations";
import { buildManualVentureWorkspace, type ManualVentureThesisInput } from "@/lib/venture-workspace";
import {
  buildRuntimeHealthMemorySnapshot,
  loadRuntimeHealthMemorySnapshot,
  saveRuntimeHealthMemorySnapshot,
  type RuntimeHealthMemorySnapshot,
} from "@/lib/runtime-health-memory";

const EMPTY_MANUAL_THESIS_DRAFT: ManualVentureThesisInput = {
  title: "",
  targetBuyer: "",
  painStatement: "",
  productWedge: "",
  revenueModel: "",
  pricingHypothesis: "",
  acquisitionChannel: "",
  evidenceNote: "",
};

const DEPLOYMENT_ESCALATION_AUDIT_STATUSES: VentureAutonomyAuditStatus[] = ["proposed", "approved", "executed", "blocked", "dismissed"];
const DEPLOYMENT_ESCALATION_AUDIT_SIDE_EFFECTS: VentureAutonomySideEffect[] = ["none", "local-only", "external-proposed", "external-approved", "external-blocked"];
const DEMAND_SOURCE_BLOCKER_SOURCE_TYPES: VentureDemandCaptureProofSourceType[] = [
  "demand-drift-report",
  "activation-cohort",
  "channel-economics",
  "pricing-signal",
  "money-signal",
  "customer-interview",
  "outreach-approval",
  "browser-research",
  "no-send-reply-proof",
];
const MAX_DEPLOYMENT_ESCALATION_AUDIT_SAVED_VIEWS = 20;
const MAX_DEMAND_SOURCE_BLOCKER_SAVED_VIEWS = 20;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATES = 50;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_HISTORY = 100;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_SUMMARY_ITEMS = 50;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_REPORTS = 50;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION = 100;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_PINNED_SUMMARIES = 50;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS = 50;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS = 50;
const MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES = 50;
const MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY = 8;

const DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATUSES = [
  "acknowledged",
  "needs-evidence",
  "delegated",
] as const;

const DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_STATUSES = [
  "untriaged",
  ...DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATUSES,
] as const;

const DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_LABELS: Record<DemandSourceBlockerPacketTriageStatus, string> = {
  acknowledged: "Acknowledged",
  "needs-evidence": "Needs evidence",
  delegated: "Delegated",
};

function demandSourceBlockerPacketTriageLabel(status: DemandSourceBlockerPacketTriageAuditStatus) {
  return status === "untriaged" ? "Untriaged" : DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_LABELS[status];
}

type DeploymentEscalationAuditSavedView = {
  id: string;
  name: string;
  createdAt: string;
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
  statusFilter: "all" | VentureAutonomyAuditStatus;
  sideEffectFilter: "all" | VentureAutonomySideEffect;
  actorFilter: string;
};

type DeploymentEscalationAuditImportMode = "keep-both" | "replace" | "skip";

type DeploymentEscalationAuditImportSummary = {
  total: number;
  added: number;
  renamed: number;
  replaced: number;
  skipped: number;
};

type PortfolioImportAuditEntry = {
  id: string;
  recordedAt: string;
  status: "imported" | "blocked";
  source?: "local" | "imported";
  exportedAt?: string;
  exportedBy?: string;
  importedAt?: string;
  ventureCount: number;
  savedViewCount: number;
  mode: DeploymentEscalationAuditImportMode;
  collisionCount: number;
  added: number;
  renamed: number;
  replaced: number;
  skipped: number;
  blockedReason?: string;
  compactGovernanceDigestConflictReceipts?: string[];
};

type PortfolioImportAuditRestoreSnapshot = {
  entries: PortfolioImportAuditEntry[];
  label: string;
  prunedAt: string;
};

const DEPLOYMENT_ESCALATION_AUDIT_IMPORT_MODE_LABELS: Record<DeploymentEscalationAuditImportMode, string> = {
  "keep-both": "Keep both",
  replace: "Replace matching",
  skip: "Skip matching",
};

const DEPLOYMENT_ESCALATION_AUDIT_IMPORT_MODE_ACTIONS: Record<DeploymentEscalationAuditImportMode, string> = {
  "keep-both": "Collisions will be renamed as imported copies.",
  replace: "Collisions will replace existing saved views.",
  skip: "Collisions will keep existing saved views and skip imported copies.",
};

function deploymentEscalationAuditSavedViewsKey(ownerKey: string) {
  return `marketpulse-deployment-escalation-audit-views:${ownerKey}`;
}

function demandSourceBlockerSavedViewsKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-views:${ownerKey}`;
}

function demandSourceBlockerPacketTriageKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-triage:${ownerKey}`;
}

function demandSourceBlockerPacketTriageAuditHistoryKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-triage-audit:${ownerKey}`;
}

function demandSourceBlockerPacketTriageWorkloadDriftReportsKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-workload-drift:${ownerKey}`;
}

function demandSourceBlockerPacketTriageWorkloadDriftReconciliationKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-workload-drift-reconciliation:${ownerKey}`;
}

function demandSourceBlockerPacketTriageWorkloadPinnedSummariesKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-workload-pinned:${ownerKey}`;
}

function demandSourceBlockerPacketHandoffRemediationPlansKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-handoff-remediation-plans:${ownerKey}`;
}

function demandSourceBlockerPacketHandoffRemediationClosuresKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-handoff-remediation-closures:${ownerKey}`;
}

function demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-handoff-reopen-escalation-slas:${ownerKey}`;
}

function demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-handoff-reopen-escalation-sla-resolutions:${ownerKey}`;
}

function demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-handoff-reopen-escalation-sla-breach-process-plans:${ownerKey}`;
}

function demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-handoff-reopen-escalation-sla-breach-process-closures:${ownerKey}`;
}

function demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-handoff-reopen-escalation-sla-breach-process-regression-closures:${ownerKey}`;
}

function regressionEscalationAuditAssignmentsKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-reopen-sla-regression-escalation-audit-assignments:${ownerKey}`;
}

function regressionEscalationAuditClosuresKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-reopen-sla-regression-escalation-audit-closures:${ownerKey}`;
}

function regressionEscalationAuditReviewsKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-reopen-sla-regression-escalation-audit-reviews:${ownerKey}`;
}

function regressionEscalationAuditAppealsKey(ownerKey: string) {
  return `marketpulse-demand-source-blocker-packet-reopen-sla-regression-escalation-audit-appeals:${ownerKey}`;
}

function portfolioImportAuditHistoryKey(ownerKey: string) {
  return `marketpulse-portfolio-import-audit:${ownerKey}`;
}

function portfolioImportAuditRestoreSnapshotKey(ownerKey: string) {
  return `marketpulse-portfolio-import-audit-restore:${ownerKey}`;
}

function isDeploymentEscalationAuditSavedView(value: unknown): value is DeploymentEscalationAuditSavedView {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DeploymentEscalationAuditSavedView>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.createdAt === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string") &&
    (record.statusFilter === "all" || DEPLOYMENT_ESCALATION_AUDIT_STATUSES.includes(record.statusFilter as VentureAutonomyAuditStatus)) &&
    (record.sideEffectFilter === "all" || DEPLOYMENT_ESCALATION_AUDIT_SIDE_EFFECTS.includes(record.sideEffectFilter as VentureAutonomySideEffect)) &&
    typeof record.actorFilter === "string"
  );
}

function isDemandSourceBlockerSavedView(value: unknown): value is DemandSourceBlockerSavedView {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerSavedView>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.createdAt === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string") &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.searchQuery === "string" &&
    record.searchQuery.trim().length > 0
  );
}

function isDemandSourceBlockerPacketTriageState(value: unknown): value is DemandSourceBlockerPacketTriageState {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketTriageState>;
  return (
    typeof record.id === "string" &&
    typeof record.savedViewId === "string" &&
    typeof record.savedViewName === "string" &&
    (record.packetId === undefined || typeof record.packetId === "string") &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.searchQuery === "string" &&
    record.searchQuery.trim().length > 0 &&
    DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATUSES.includes(record.status as DemandSourceBlockerPacketTriageStatus) &&
    typeof record.updatedAt === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketTriageAuditEntry(value: unknown): value is DemandSourceBlockerPacketTriageAuditEntry {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketTriageAuditEntry>;
  return (
    typeof record.id === "string" &&
    (record.packetId === undefined || typeof record.packetId === "string") &&
    typeof record.savedViewId === "string" &&
    typeof record.savedViewName === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.searchQuery === "string" &&
    record.searchQuery.trim().length > 0 &&
    DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_STATUSES.includes(record.previousStatus as DemandSourceBlockerPacketTriageAuditStatus) &&
    DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATUSES.includes(record.nextStatus as DemandSourceBlockerPacketTriageStatus) &&
    typeof record.recordedAt === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isDemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem(
  value: unknown,
): value is DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem>;
  return (
    typeof record.id === "string" &&
    typeof record.owner === "string" &&
    record.owner.trim().length > 0 &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.searchAnchor === "string" &&
    record.searchAnchor.trim().length > 0 &&
    isStringArray(record.queueItemIds) &&
    isStringArray(record.savedViewNames) &&
    isNonNegativeFiniteNumber(record.activeCount) &&
    isNonNegativeFiniteNumber(record.delegatedCount) &&
    isNonNegativeFiniteNumber(record.needsEvidenceCount) &&
    isNonNegativeFiniteNumber(record.staleCount) &&
    isNonNegativeFiniteNumber(record.missingEvidenceCount) &&
    (record.latestTransitionAt === null || typeof record.latestTransitionAt === "string") &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketTriageWorkloadDriftReport(
  value: unknown,
): value is DemandSourceBlockerPacketTriageWorkloadDriftReport {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketTriageWorkloadDriftReport>;
  return (
    typeof record.id === "string" &&
    typeof record.recordedAt === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (
      record.status === "matching" ||
      record.status === "count-mismatch" ||
      record.status === "stale" ||
      record.status === "missing-current" ||
      record.status === "new-current"
    ) &&
    typeof record.searchAnchor === "string" &&
    isNonNegativeFiniteNumber(record.importedActiveCount) &&
    isNonNegativeFiniteNumber(record.currentActiveCount) &&
    isNonNegativeFiniteNumber(record.importedDelegatedCount) &&
    isNonNegativeFiniteNumber(record.currentDelegatedCount) &&
    isNonNegativeFiniteNumber(record.importedNeedsEvidenceCount) &&
    isNonNegativeFiniteNumber(record.currentNeedsEvidenceCount) &&
    isNonNegativeFiniteNumber(record.importedStaleCount) &&
    isNonNegativeFiniteNumber(record.currentStaleCount) &&
    isNonNegativeFiniteNumber(record.importedMissingEvidenceCount) &&
    isNonNegativeFiniteNumber(record.currentMissingEvidenceCount) &&
    (record.importedLatestTransitionAt === null || typeof record.importedLatestTransitionAt === "string") &&
    (record.currentLatestTransitionAt === null || typeof record.currentLatestTransitionAt === "string") &&
    (record.importedExportedAt === undefined || typeof record.importedExportedAt === "string") &&
    (record.importedExportedBy === undefined || typeof record.importedExportedBy === "string") &&
    typeof record.summary === "string"
  );
}

function isDemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry(
  value: unknown,
): value is DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry>;
  return (
    typeof record.id === "string" &&
    typeof record.driftReportId === "string" &&
    typeof record.importedRecordedAt === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (record.action === "reviewed" || record.action === "pinned-current" || record.action === "cleared") &&
    typeof record.reviewedBy === "string" &&
    (
      record.reviewedStatus === "matching" ||
      record.reviewedStatus === "count-mismatch" ||
      record.reviewedStatus === "stale" ||
      record.reviewedStatus === "missing-current" ||
      record.reviewedStatus === "new-current"
    ) &&
    typeof record.recordedAt === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketTriageWorkloadPinnedSummary(
  value: unknown,
): value is DemandSourceBlockerPacketTriageWorkloadPinnedSummary {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketTriageWorkloadPinnedSummary>;
  return (
    typeof record.id === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.groupKey === "string" &&
    typeof record.pinnedAt === "string" &&
    typeof record.pinnedBy === "string" &&
    typeof record.driftReportId === "string" &&
    typeof record.importedRecordedAt === "string" &&
    isDemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem(record.summary) &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffHealthItem(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffHealthItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffHealthItem>;
  return (
    typeof record.id === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (
      record.status === "clear" ||
      record.status === "reconciled" ||
      record.status === "unresolved-drift" ||
      record.status === "reconciled-churn" ||
      record.status === "repeated-drift-churn"
    ) &&
    typeof record.searchAnchor === "string" &&
    isNonNegativeFiniteNumber(record.totalDriftSnapshots) &&
    isNonNegativeFiniteNumber(record.repeatedDriftCount) &&
    isNonNegativeFiniteNumber(record.unresolvedDriftCount) &&
    isNonNegativeFiniteNumber(record.resolvedDriftCount) &&
    isNonNegativeFiniteNumber(record.reviewedReconciliationCount) &&
    isNonNegativeFiniteNumber(record.pinnedReconciliationCount) &&
    isNonNegativeFiniteNumber(record.clearedReconciliationCount) &&
    isNonNegativeFiniteNumber(record.pinnedSummaryCount) &&
    (record.latestDriftAt === null || typeof record.latestDriftAt === "string") &&
    (record.latestReviewAt === null || typeof record.latestReviewAt === "string") &&
    (record.latestPinnedAt === null || typeof record.latestPinnedAt === "string") &&
    (record.staleReviewAgeHours === null || isNonNegativeFiniteNumber(record.staleReviewAgeHours)) &&
    isNonNegativeFiniteNumber(record.churnScore) &&
    isStringArray(record.statusBreakdown) &&
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffRemediationPlanEntry(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffRemediationPlanEntry {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffRemediationPlanEntry>;
  return (
    typeof record.id === "string" &&
    typeof record.remediationId === "string" &&
    typeof record.healthId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (
      record.trigger === "repeated-drift" ||
      record.trigger === "unresolved-drift" ||
      record.trigger === "stale-review"
    ) &&
    typeof record.plannedBy === "string" &&
    typeof record.plannedAt === "string" &&
    typeof record.proofRequired === "string" &&
    typeof record.nextAction === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffRemediationClosureReceipt(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffRemediationClosureReceipt {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffRemediationClosureReceipt>;
  return (
    typeof record.id === "string" &&
    typeof record.remediationId === "string" &&
    typeof record.healthId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (
      record.trigger === "repeated-drift" ||
      record.trigger === "unresolved-drift" ||
      record.trigger === "stale-review"
    ) &&
    typeof record.closedBy === "string" &&
    typeof record.closedAt === "string" &&
    typeof record.proofRequired === "string" &&
    typeof record.proofSummary === "string" &&
    typeof record.proofArtifact === "string" &&
    isStringArray(record.linkedDriftReportIds) &&
    (record.totalDriftSnapshotsAtClosure === undefined || isNonNegativeFiniteNumber(record.totalDriftSnapshotsAtClosure)) &&
    (record.unresolvedDriftCountAtClosure === undefined || isNonNegativeFiniteNumber(record.unresolvedDriftCountAtClosure)) &&
    (record.repeatedDriftCountAtClosure === undefined || isNonNegativeFiniteNumber(record.repeatedDriftCountAtClosure)) &&
    (record.latestDriftAtAtClosure === undefined || record.latestDriftAtAtClosure === null || typeof record.latestDriftAtAtClosure === "string") &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffRemediationItem(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffRemediationItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffRemediationItem>;
  return (
    typeof record.id === "string" &&
    typeof record.healthId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (
      record.trigger === "repeated-drift" ||
      record.trigger === "unresolved-drift" ||
      record.trigger === "stale-review"
    ) &&
    (
      record.priority === "critical" ||
      record.priority === "high" ||
      record.priority === "medium"
    ) &&
    (record.status === "ready" || record.status === "planned" || record.status === "proof-closed") &&
    typeof record.assignedOwner === "string" &&
    typeof record.searchAnchor === "string" &&
    isNonNegativeFiniteNumber(record.churnScore) &&
    (record.totalDriftSnapshots === undefined || isNonNegativeFiniteNumber(record.totalDriftSnapshots)) &&
    isNonNegativeFiniteNumber(record.unresolvedDriftCount) &&
    isNonNegativeFiniteNumber(record.repeatedDriftCount) &&
    (record.staleReviewAgeHours === null || isNonNegativeFiniteNumber(record.staleReviewAgeHours)) &&
    (record.latestDriftAt === null || typeof record.latestDriftAt === "string") &&
    (record.latestReviewAt === null || typeof record.latestReviewAt === "string") &&
    (record.plannedAt === null || typeof record.plannedAt === "string") &&
    (record.plannedBy === null || typeof record.plannedBy === "string") &&
    isNonNegativeFiniteNumber(record.planCount) &&
    (record.closedAt === undefined || record.closedAt === null || typeof record.closedAt === "string") &&
    (record.closedBy === undefined || record.closedBy === null || typeof record.closedBy === "string") &&
    (record.closureCount === undefined || isNonNegativeFiniteNumber(record.closureCount)) &&
    (record.closureProofSummary === undefined || record.closureProofSummary === null || typeof record.closureProofSummary === "string") &&
    (record.closureProofArtifact === undefined || record.closureProofArtifact === null || typeof record.closureProofArtifact === "string") &&
    (record.linkedDriftReportIds === undefined || isStringArray(record.linkedDriftReportIds)) &&
    (record.reopenedAfterClosure === undefined || typeof record.reopenedAfterClosure === "boolean") &&
    (record.reopenedReason === undefined || record.reopenedReason === null || typeof record.reopenedReason === "string") &&
    typeof record.summary === "string" &&
    typeof record.proofRequired === "string" &&
    typeof record.nextAction === "string" &&
    isStringArray(record.evidence) &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationItem(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationItem>;
  return (
    typeof record.id === "string" &&
    typeof record.remediationId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (
      record.trigger === "repeated-drift" ||
      record.trigger === "unresolved-drift" ||
      record.trigger === "stale-review"
    ) &&
    (record.severity === "critical" || record.severity === "high") &&
    isNonNegativeFiniteNumber(record.reopenedCount) &&
    isNonNegativeFiniteNumber(record.failedClosureCount) &&
    (record.latestReopenedAt === null || typeof record.latestReopenedAt === "string") &&
    (record.latestClosedAt === null || typeof record.latestClosedAt === "string") &&
    (record.latestProofSummary === null || typeof record.latestProofSummary === "string") &&
    (record.latestProofArtifact === null || typeof record.latestProofArtifact === "string") &&
    typeof record.reopenedReason === "string" &&
    typeof record.searchAnchor === "string" &&
    isNonNegativeFiniteNumber(record.churnScore) &&
    isNonNegativeFiniteNumber(record.totalDriftSnapshots) &&
    isNonNegativeFiniteNumber(record.repeatedDriftCount) &&
    isNonNegativeFiniteNumber(record.unresolvedDriftCount) &&
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    isStringArray(record.evidence) &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt>;
  return (
    typeof record.id === "string" &&
    typeof record.escalationId === "string" &&
    typeof record.remediationId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.assignedOwner === "string" &&
    typeof record.assignedBy === "string" &&
    typeof record.assignedAt === "string" &&
    typeof record.dueAt === "string" &&
    isNonNegativeFiniteNumber(record.reopenedCount) &&
    isNonNegativeFiniteNumber(record.failedClosureCount) &&
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt>;
  return (
    typeof record.id === "string" &&
    typeof record.slaReceiptId === "string" &&
    typeof record.escalationId === "string" &&
    typeof record.remediationId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.assignedOwner === "string" &&
    typeof record.resolvedBy === "string" &&
    typeof record.resolvedAt === "string" &&
    typeof record.dueAt === "string" &&
    typeof record.wasOverdue === "boolean" &&
    isNonNegativeFiniteNumber(record.reopenedCount) &&
    isNonNegativeFiniteNumber(record.failedClosureCount) &&
    typeof record.proofSummary === "string" &&
    typeof record.proofArtifact === "string" &&
    typeof record.nextAction === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem>;
  return (
    typeof record.id === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    (record.severity === "critical" || record.severity === "high") &&
    isNonNegativeFiniteNumber(record.breachCount) &&
    isNonNegativeFiniteNumber(record.resolutionCount) &&
    (record.latestBreachAt === null || typeof record.latestBreachAt === "string") &&
    (record.latestDueAt === null || typeof record.latestDueAt === "string") &&
    (record.latestResolvedAt === null || typeof record.latestResolvedAt === "string") &&
    isStringArray(record.assignedOwners) &&
    isStringArray(record.breachedResolutionIds) &&
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    isStringArray(record.evidence) &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan>;
  return (
    typeof record.id === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.assignedOwner === "string" &&
    typeof record.plannedBy === "string" &&
    typeof record.plannedAt === "string" &&
    typeof record.dueAt === "string" &&
    isNonNegativeFiniteNumber(record.breachCount) &&
    isNonNegativeFiniteNumber(record.resolutionCount) &&
    isStringArray(record.breachedResolutionIds) &&
    typeof record.proofRequired === "string" &&
    typeof record.followUpProof === "string" &&
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    isStringArray(record.evidence) &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt>;
  return (
    typeof record.id === "string" &&
    typeof record.planId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.closedBy === "string" &&
    typeof record.closedAt === "string" &&
    isNonNegativeFiniteNumber(record.breachCount) &&
    isStringArray(record.breachedResolutionIds) &&
    typeof record.proofSummary === "string" &&
    typeof record.proofArtifact === "string" &&
    typeof record.proofRequired === "string" &&
    typeof record.nextAction === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression>;
  return (
    typeof record.id === "string" &&
    typeof record.planId === "string" &&
    typeof record.closureId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    record.status === "stale-after-closure" &&
    isNonNegativeFiniteNumber(record.breachCountAtClosure) &&
    isNonNegativeFiniteNumber(record.currentBreachCount) &&
    (record.latestBreachAt === null || typeof record.latestBreachAt === "string") &&
    typeof record.closureClosedAt === "string" &&
    typeof record.closedBy === "string" &&
    typeof record.proofSummary === "string" &&
    typeof record.proofArtifact === "string" &&
    isStringArray(record.newBreachedResolutionIds) &&
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    isStringArray(record.evidence) &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt(
  value: unknown,
): value is DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt>;
  return (
    typeof record.id === "string" &&
    typeof record.regressionId === "string" &&
    typeof record.planId === "string" &&
    typeof record.closureId === "string" &&
    typeof record.trendId === "string" &&
    typeof record.owner === "string" &&
    DEMAND_SOURCE_BLOCKER_SOURCE_TYPES.includes(record.sourceType as VentureDemandCaptureProofSourceType) &&
    typeof record.closedBy === "string" &&
    typeof record.closedAt === "string" &&
    isNonNegativeFiniteNumber(record.breachCountAtClosure) &&
    isNonNegativeFiniteNumber(record.currentBreachCount) &&
    (record.latestBreachAt === null || typeof record.latestBreachAt === "string") &&
    isStringArray(record.newBreachedResolutionIds) &&
    typeof record.proofSummary === "string" &&
    typeof record.proofArtifact === "string" &&
    typeof record.nextAction === "string" &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string")
  );
}

function isPortfolioImportAuditEntry(value: unknown): value is PortfolioImportAuditEntry {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<PortfolioImportAuditEntry>;
  return (
    typeof record.id === "string" &&
    typeof record.recordedAt === "string" &&
    (record.status === "imported" || record.status === "blocked") &&
    (record.source === undefined || record.source === "local" || record.source === "imported") &&
    (record.exportedAt === undefined || typeof record.exportedAt === "string") &&
    (record.exportedBy === undefined || typeof record.exportedBy === "string") &&
    (record.importedAt === undefined || typeof record.importedAt === "string") &&
    typeof record.ventureCount === "number" &&
    typeof record.savedViewCount === "number" &&
    (record.mode === "keep-both" || record.mode === "replace" || record.mode === "skip") &&
    typeof record.collisionCount === "number" &&
    typeof record.added === "number" &&
    typeof record.renamed === "number" &&
    typeof record.replaced === "number" &&
    typeof record.skipped === "number" &&
    (record.blockedReason === undefined || typeof record.blockedReason === "string") &&
    (
      record.compactGovernanceDigestConflictReceipts === undefined ||
      isStringArray(record.compactGovernanceDigestConflictReceipts)
    )
  );
}

function isPortfolioImportAuditRestoreSnapshot(value: unknown): value is PortfolioImportAuditRestoreSnapshot {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<PortfolioImportAuditRestoreSnapshot>;
  return (
    Array.isArray(record.entries) &&
    record.entries.every(isPortfolioImportAuditEntry) &&
    typeof record.label === "string" &&
    typeof record.prunedAt === "string"
  );
}

function portfolioImportAuditHistoryDedupeKey(entry: PortfolioImportAuditEntry) {
  return entry.id.trim() || [
    entry.status,
    entry.recordedAt,
    entry.blockedReason ?? "",
    entry.ventureCount,
    entry.savedViewCount,
    entry.mode,
    entry.collisionCount,
    entry.added,
    entry.renamed,
    entry.replaced,
    entry.skipped,
    ...(entry.compactGovernanceDigestConflictReceipts ?? []),
  ].join("|");
}

function portfolioImportAuditHistoryRecency(entry: PortfolioImportAuditEntry) {
  return entry.importedAt ?? entry.exportedAt ?? entry.recordedAt;
}

function mergePortfolioImportAuditHistoryEntries(
  existing: PortfolioImportAuditEntry,
  incoming: PortfolioImportAuditEntry,
) {
  const incomingIsNewer = portfolioImportAuditHistoryRecency(incoming).localeCompare(
    portfolioImportAuditHistoryRecency(existing),
  ) > 0;
  const primary = incomingIsNewer ? incoming : existing;
  const secondary = incomingIsNewer ? existing : incoming;
  return {
    ...secondary,
    ...primary,
    source: primary.source ?? secondary.source,
    exportedAt: primary.exportedAt ?? secondary.exportedAt,
    exportedBy: primary.exportedBy ?? secondary.exportedBy,
    importedAt: primary.importedAt ?? secondary.importedAt,
    blockedReason: primary.blockedReason ?? secondary.blockedReason,
  };
}

function dedupePortfolioImportAuditHistory(entries: PortfolioImportAuditEntry[]) {
  const orderedKeys: string[] = [];
  const byKey = new Map<string, PortfolioImportAuditEntry>();
  entries.forEach((entry) => {
    const key = portfolioImportAuditHistoryDedupeKey(entry);
    const existing = byKey.get(key);
    if (!existing) {
      orderedKeys.push(key);
      byKey.set(key, entry);
      return;
    }
    byKey.set(key, mergePortfolioImportAuditHistoryEntries(existing, entry));
  });
  return orderedKeys
    .map((key) => byKey.get(key))
    .filter((entry): entry is PortfolioImportAuditEntry => Boolean(entry));
}

function loadDeploymentEscalationAuditSavedViews(ownerKey: string): DeploymentEscalationAuditSavedView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(deploymentEscalationAuditSavedViewsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(isDeploymentEscalationAuditSavedView).slice(0, MAX_DEPLOYMENT_ESCALATION_AUDIT_SAVED_VIEWS)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerSavedViews(ownerKey: string): DemandSourceBlockerSavedView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerSavedViewsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(isDemandSourceBlockerSavedView).slice(0, MAX_DEMAND_SOURCE_BLOCKER_SAVED_VIEWS)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketTriageStates(ownerKey: string): DemandSourceBlockerPacketTriageState[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketTriageKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketTriageStates(parsed.filter(isDemandSourceBlockerPacketTriageState)).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATES)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketTriageAuditHistory(ownerKey: string): DemandSourceBlockerPacketTriageAuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketTriageAuditHistoryKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketTriageAuditHistory(parsed.filter(isDemandSourceBlockerPacketTriageAuditEntry)).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_HISTORY)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketTriageWorkloadDriftReports(
  ownerKey: string,
): DemandSourceBlockerPacketTriageWorkloadDriftReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketTriageWorkloadDriftReportsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketTriageWorkloadDriftReports(
        parsed.filter(isDemandSourceBlockerPacketTriageWorkloadDriftReport),
      )
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_REPORTS)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(
  ownerKey: string,
): DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketTriageWorkloadDriftReconciliationKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(
        parsed.filter(isDemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(
  ownerKey: string,
): DemandSourceBlockerPacketTriageWorkloadPinnedSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketTriageWorkloadPinnedSummariesKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(
        parsed.filter(isDemandSourceBlockerPacketTriageWorkloadPinnedSummary),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_PINNED_SUMMARIES)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketHandoffRemediationPlans(
  ownerKey: string,
): DemandSourceBlockerPacketHandoffRemediationPlanEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketHandoffRemediationPlansKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketHandoffRemediationPlans(
        parsed.filter(isDemandSourceBlockerPacketHandoffRemediationPlanEntry),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketHandoffRemediationClosures(
  ownerKey: string,
): DemandSourceBlockerPacketHandoffRemediationClosureReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketHandoffRemediationClosuresKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketHandoffRemediationClosures(
        parsed.filter(isDemandSourceBlockerPacketHandoffRemediationClosureReceipt),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(
  ownerKey: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(
        parsed.filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(
  ownerKey: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(
        parsed.filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(
  ownerKey: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(
        parsed.filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(
  ownerKey: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(
        parsed.filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(
  ownerKey: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(
        parsed.filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadRegressionEscalationAuditAssignments(ownerKey: string): BreachProcessRegressionEscalationAuditAssignment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(regressionEscalationAuditAssignmentsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeBreachProcessRegressionEscalationAuditAssignments(
        parsed.filter(isBreachProcessRegressionEscalationAuditAssignment),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadRegressionEscalationAuditClosures(ownerKey: string): BreachProcessRegressionEscalationAuditClosure[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(regressionEscalationAuditClosuresKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeBreachProcessRegressionEscalationAuditClosures(
        parsed.filter(isBreachProcessRegressionEscalationAuditClosure),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadRegressionEscalationAuditReviews(ownerKey: string): BreachProcessRegressionEscalationAuditReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(regressionEscalationAuditReviewsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeBreachProcessRegressionEscalationAuditReviews(
        parsed.filter(isBreachProcessRegressionEscalationAuditReview),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadRegressionEscalationAuditAppeals(ownerKey: string): BreachProcessRegressionEscalationAuditAppeal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(regressionEscalationAuditAppealsKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupeBreachProcessRegressionEscalationAuditAppeals(
        parsed.filter(isBreachProcessRegressionEscalationAuditAppeal),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return [];
  }
}

function loadPortfolioImportAuditHistory(ownerKey: string): PortfolioImportAuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(portfolioImportAuditHistoryKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? dedupePortfolioImportAuditHistory(parsed.filter(isPortfolioImportAuditEntry)).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY)
      : [];
  } catch {
    return [];
  }
}

function persistPortfolioImportAuditHistory(ownerKey: string, entries: PortfolioImportAuditEntry[]) {
  if (typeof window === "undefined") return;
  const next = dedupePortfolioImportAuditHistory(entries).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY);
  window.localStorage.setItem(
    portfolioImportAuditHistoryKey(ownerKey),
    JSON.stringify(next),
  );
}

function loadPortfolioImportAuditRestoreSnapshot(ownerKey: string): PortfolioImportAuditRestoreSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(portfolioImportAuditRestoreSnapshotKey(ownerKey));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!isPortfolioImportAuditRestoreSnapshot(parsed)) return null;
    return {
      ...parsed,
      entries: dedupePortfolioImportAuditHistory(parsed.entries).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY),
    };
  } catch {
    return null;
  }
}

function persistPortfolioImportAuditRestoreSnapshot(ownerKey: string, snapshot: PortfolioImportAuditRestoreSnapshot | null) {
  if (typeof window === "undefined") return;
  if (!snapshot) {
    window.localStorage.removeItem(portfolioImportAuditRestoreSnapshotKey(ownerKey));
    return;
  }
  window.localStorage.setItem(
    portfolioImportAuditRestoreSnapshotKey(ownerKey),
    JSON.stringify({
      ...snapshot,
      entries: dedupePortfolioImportAuditHistory(snapshot.entries).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY),
    }),
  );
}

function parseDeploymentEscalationAuditSavedViewsImport(raw: string): DeploymentEscalationAuditSavedView[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { deploymentEscalationAuditSavedViews?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "deploymentEscalationAuditSavedViews")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.deploymentEscalationAuditSavedViews)
      ? payload.deploymentEscalationAuditSavedViews
        .filter(isDeploymentEscalationAuditSavedView)
        .map((view) => ({
          ...view,
          source: "imported" as const,
          exportedAt: view.exportedAt ?? payloadExportedAt,
          exportedBy: view.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEPLOYMENT_ESCALATION_AUDIT_SAVED_VIEWS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerSavedViewsImport(raw: string): DemandSourceBlockerSavedView[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerSavedViews?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerSavedViews")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerSavedViews)
      ? payload.demandSourceBlockerSavedViews
        .filter(isDemandSourceBlockerSavedView)
        .map((view) => ({
          ...view,
          source: "imported" as const,
          exportedAt: view.exportedAt ?? payloadExportedAt,
          exportedBy: view.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_SAVED_VIEWS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketTriageImport(raw: string): DemandSourceBlockerPacketTriageState[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketTriage?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriage")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketTriage)
      ? dedupeDemandSourceBlockerPacketTriageStates(
        payload.demandSourceBlockerPacketTriage
          .filter(isDemandSourceBlockerPacketTriageState)
          .map((state) => ({
            ...state,
            source: "imported" as const,
            exportedAt: state.exportedAt ?? payloadExportedAt,
            exportedBy: state.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATES)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketTriageAuditHistoryImport(raw: string): DemandSourceBlockerPacketTriageAuditEntry[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketTriageAuditHistory?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageAuditHistory")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketTriageAuditHistory)
      ? dedupeDemandSourceBlockerPacketTriageAuditHistory(
        payload.demandSourceBlockerPacketTriageAuditHistory
          .filter(isDemandSourceBlockerPacketTriageAuditEntry)
          .map((entry) => ({
            ...entry,
            source: "imported" as const,
            exportedAt: entry.exportedAt ?? payloadExportedAt,
            exportedBy: entry.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_HISTORY)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketTriageOwnerWorkloadSummaryImport(
  raw: string,
): DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketTriageOwnerWorkloadSummary?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageOwnerWorkloadSummary")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketTriageOwnerWorkloadSummary)
      ? payload.demandSourceBlockerPacketTriageOwnerWorkloadSummary
        .filter(isDemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem)
        .map((item) => ({
          ...item,
          source: "imported" as const,
          exportedAt: item.exportedAt ?? payloadExportedAt,
          exportedBy: item.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_SUMMARY_ITEMS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketTriageWorkloadDriftReconciliationImport(
  raw: string,
): DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketTriageWorkloadDriftReconciliation?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageWorkloadDriftReconciliation")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketTriageWorkloadDriftReconciliation)
      ? dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(
        payload.demandSourceBlockerPacketTriageWorkloadDriftReconciliation
          .filter(isDemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry)
          .map((entry) => ({
            ...entry,
            source: "imported" as const,
            exportedAt: entry.exportedAt ?? payloadExportedAt,
            exportedBy: entry.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketTriageWorkloadPinnedSummariesImport(
  raw: string,
): DemandSourceBlockerPacketTriageWorkloadPinnedSummary[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketTriageWorkloadPinnedSummaries?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageWorkloadPinnedSummaries")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketTriageWorkloadPinnedSummaries)
      ? dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(
        payload.demandSourceBlockerPacketTriageWorkloadPinnedSummaries
          .filter(isDemandSourceBlockerPacketTriageWorkloadPinnedSummary)
          .map((summary) => ({
            ...summary,
            source: "imported" as const,
            exportedAt: summary.exportedAt ?? payloadExportedAt,
            exportedBy: summary.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_PINNED_SUMMARIES)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffHealthImport(
  raw: string,
): DemandSourceBlockerPacketHandoffHealthItem[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffHealth?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffHealth")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffHealth)
      ? payload.demandSourceBlockerPacketHandoffHealth
        .filter(isDemandSourceBlockerPacketHandoffHealthItem)
        .map((item) => ({
          ...item,
          source: "imported" as const,
          exportedAt: item.exportedAt ?? payloadExportedAt,
          exportedBy: item.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffRemediationQueueImport(
  raw: string,
): DemandSourceBlockerPacketHandoffRemediationItem[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffRemediationQueue?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffRemediationQueue")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffRemediationQueue)
      ? payload.demandSourceBlockerPacketHandoffRemediationQueue
        .filter(isDemandSourceBlockerPacketHandoffRemediationItem)
        .map((item) => ({
          ...item,
          source: "imported" as const,
          exportedAt: item.exportedAt ?? payloadExportedAt,
          exportedBy: item.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffRemediationPlansImport(
  raw: string,
): DemandSourceBlockerPacketHandoffRemediationPlanEntry[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffRemediationPlans?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffRemediationPlans")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffRemediationPlans)
      ? dedupeDemandSourceBlockerPacketHandoffRemediationPlans(
        payload.demandSourceBlockerPacketHandoffRemediationPlans
          .filter(isDemandSourceBlockerPacketHandoffRemediationPlanEntry)
          .map((plan) => ({
            ...plan,
            source: "imported" as const,
            exportedAt: plan.exportedAt ?? payloadExportedAt,
            exportedBy: plan.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffRemediationClosuresImport(
  raw: string,
): DemandSourceBlockerPacketHandoffRemediationClosureReceipt[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffRemediationClosures?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffRemediationClosures")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffRemediationClosures)
      ? dedupeDemandSourceBlockerPacketHandoffRemediationClosures(
        payload.demandSourceBlockerPacketHandoffRemediationClosures
          .filter(isDemandSourceBlockerPacketHandoffRemediationClosureReceipt)
          .map((receipt) => ({
            ...receipt,
            source: "imported" as const,
            exportedAt: receipt.exportedAt ?? payloadExportedAt,
            exportedBy: receipt.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationsImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationItem[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalations?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalations")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalations)
      ? payload.demandSourceBlockerPacketHandoffReopenEscalations
        .filter(isDemandSourceBlockerPacketHandoffReopenEscalationItem)
        .map((item) => ({
          ...item,
          source: "imported" as const,
          exportedAt: item.exportedAt ?? payloadExportedAt,
          exportedBy: item.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(
        payload.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts
          .filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt)
          .map((receipt) => ({
            ...receipt,
            source: "imported" as const,
            exportedAt: receipt.exportedAt ?? payloadExportedAt,
            exportedBy: receipt.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(
        payload.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions
          .filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt)
          .map((receipt) => ({
            ...receipt,
            source: "imported" as const,
            exportedAt: receipt.exportedAt ?? payloadExportedAt,
            exportedBy: receipt.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends)
      ? payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends
        .filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem)
        .map((item) => ({
          ...item,
          source: "imported" as const,
          exportedAt: item.exportedAt ?? payloadExportedAt,
          exportedBy: item.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(
        payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans
          .filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan)
          .map((plan) => ({
            ...plan,
            source: "imported" as const,
            exportedAt: plan.exportedAt ?? payloadExportedAt,
            exportedBy: plan.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(
        payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures
          .filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt)
          .map((closure) => ({
            ...closure,
            source: "imported" as const,
            exportedAt: closure.exportedAt ?? payloadExportedAt,
            exportedBy: closure.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions)
      ? payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions
        .filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression)
        .map((regression) => ({
          ...regression,
          source: "imported" as const,
          exportedAt: regression.exportedAt ?? payloadExportedAt,
          exportedBy: regression.exportedBy ?? payloadExportedBy,
          importedAt,
        }))
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS)
      : [];
  } catch {
    return null;
  }
}

function parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresImport(
  raw: string,
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures)
      ? dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(
        payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures
          .filter(isDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt)
          .map((closure) => ({
            ...closure,
            source: "imported" as const,
            exportedAt: closure.exportedAt ?? payloadExportedAt,
            exportedBy: closure.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES)
      : [];
  } catch {
    return null;
  }
}

function parsePortfolioImportAuditHistoryImport(raw: string): PortfolioImportAuditEntry[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { portfolioImportAuditHistory?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "portfolioImportAuditHistory")) return null;
    const importedAt = new Date().toISOString();
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    return Array.isArray(payload.portfolioImportAuditHistory)
      ? dedupePortfolioImportAuditHistory(
        payload.portfolioImportAuditHistory
          .filter(isPortfolioImportAuditEntry)
          .map((entry) => ({
            ...entry,
            source: "imported" as const,
            exportedAt: entry.exportedAt ?? payloadExportedAt,
            exportedBy: entry.exportedBy ?? payloadExportedBy,
            importedAt,
          })),
      )
        .slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY)
      : [];
  } catch {
    return null;
  }
}

function parsePortfolioImportAuditPruneSnapshotImport(raw: string): PortfolioImportAuditRestoreSnapshot | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as { portfolioImportAuditPruneSnapshot?: unknown; exportedAt?: unknown; exportedBy?: unknown }
      : {};
    if (!Object.prototype.hasOwnProperty.call(payload, "portfolioImportAuditPruneSnapshot")) return null;
    const snapshot = payload.portfolioImportAuditPruneSnapshot && typeof payload.portfolioImportAuditPruneSnapshot === "object"
      ? payload.portfolioImportAuditPruneSnapshot as {
        entries?: unknown;
        label?: unknown;
        prunedAt?: unknown;
        exportedAt?: unknown;
        exportedBy?: unknown;
      }
      : {};
    if (!Array.isArray(snapshot.entries)) return null;
    const importedAt = new Date().toISOString();
    const snapshotExportedAt = typeof snapshot.exportedAt === "string" ? snapshot.exportedAt : undefined;
    const snapshotExportedBy = typeof snapshot.exportedBy === "string" ? snapshot.exportedBy : undefined;
    const payloadExportedAt = typeof payload.exportedAt === "string" ? payload.exportedAt : undefined;
    const payloadExportedBy = typeof payload.exportedBy === "string" ? payload.exportedBy : undefined;
    const entries = dedupePortfolioImportAuditHistory(
      snapshot.entries
        .filter(isPortfolioImportAuditEntry)
        .map((entry) => ({
          ...entry,
          source: "imported" as const,
          exportedAt: entry.exportedAt ?? snapshotExportedAt ?? payloadExportedAt,
          exportedBy: entry.exportedBy ?? snapshotExportedBy ?? payloadExportedBy,
          importedAt,
        })),
    ).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY);
    if (entries.length === 0) return null;
    return {
      entries,
      label: typeof snapshot.label === "string" ? snapshot.label : "imported",
      prunedAt: typeof snapshot.prunedAt === "string" ? snapshot.prunedAt : importedAt,
    };
  } catch {
    return null;
  }
}

function persistDeploymentEscalationAuditSavedViews(ownerKey: string, views: DeploymentEscalationAuditSavedView[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    deploymentEscalationAuditSavedViewsKey(ownerKey),
    JSON.stringify(views.slice(0, MAX_DEPLOYMENT_ESCALATION_AUDIT_SAVED_VIEWS)),
  );
}

function persistDemandSourceBlockerSavedViews(ownerKey: string, views: DemandSourceBlockerSavedView[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerSavedViewsKey(ownerKey),
    JSON.stringify(views.slice(0, MAX_DEMAND_SOURCE_BLOCKER_SAVED_VIEWS)),
  );
}

function persistDemandSourceBlockerPacketTriageStates(ownerKey: string, states: DemandSourceBlockerPacketTriageState[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketTriageKey(ownerKey),
    JSON.stringify(dedupeDemandSourceBlockerPacketTriageStates(states).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATES)),
  );
}

function persistDemandSourceBlockerPacketTriageAuditHistory(ownerKey: string, entries: DemandSourceBlockerPacketTriageAuditEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketTriageAuditHistoryKey(ownerKey),
    JSON.stringify(dedupeDemandSourceBlockerPacketTriageAuditHistory(entries).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_HISTORY)),
  );
}

function persistDemandSourceBlockerPacketTriageWorkloadDriftReports(
  ownerKey: string,
  reports: DemandSourceBlockerPacketTriageWorkloadDriftReport[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketTriageWorkloadDriftReportsKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketTriageWorkloadDriftReports(reports)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_REPORTS),
    ),
  );
}

function persistDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(
  ownerKey: string,
  entries: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketTriageWorkloadDriftReconciliationKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(entries)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION),
    ),
  );
}

function persistDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(
  ownerKey: string,
  summaries: DemandSourceBlockerPacketTriageWorkloadPinnedSummary[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketTriageWorkloadPinnedSummariesKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(summaries)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_PINNED_SUMMARIES),
    ),
  );
}

function persistDemandSourceBlockerPacketHandoffRemediationPlans(
  ownerKey: string,
  plans: DemandSourceBlockerPacketHandoffRemediationPlanEntry[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketHandoffRemediationPlansKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketHandoffRemediationPlans(plans)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS),
    ),
  );
}

function persistDemandSourceBlockerPacketHandoffRemediationClosures(
  ownerKey: string,
  closures: DemandSourceBlockerPacketHandoffRemediationClosureReceipt[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketHandoffRemediationClosuresKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketHandoffRemediationClosures(closures)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(
  ownerKey: string,
  receipts: DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(receipts)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(
  ownerKey: string,
  receipts: DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(receipts)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(
  ownerKey: string,
  plans: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(plans)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS),
    ),
  );
}

function persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(
  ownerKey: string,
  closures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(closures)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(
  ownerKey: string,
  closures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresKey(ownerKey),
    JSON.stringify(
      dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(closures)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistRegressionEscalationAuditAssignments(
  ownerKey: string,
  assignments: BreachProcessRegressionEscalationAuditAssignment[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    regressionEscalationAuditAssignmentsKey(ownerKey),
    JSON.stringify(
      dedupeBreachProcessRegressionEscalationAuditAssignments(assignments)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistRegressionEscalationAuditClosures(
  ownerKey: string,
  closures: BreachProcessRegressionEscalationAuditClosure[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    regressionEscalationAuditClosuresKey(ownerKey),
    JSON.stringify(
      dedupeBreachProcessRegressionEscalationAuditClosures(closures)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistRegressionEscalationAuditReviews(
  ownerKey: string,
  reviews: BreachProcessRegressionEscalationAuditReview[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    regressionEscalationAuditReviewsKey(ownerKey),
    JSON.stringify(
      dedupeBreachProcessRegressionEscalationAuditReviews(reviews)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function persistRegressionEscalationAuditAppeals(
  ownerKey: string,
  appeals: BreachProcessRegressionEscalationAuditAppeal[],
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    regressionEscalationAuditAppealsKey(ownerKey),
    JSON.stringify(
      dedupeBreachProcessRegressionEscalationAuditAppeals(appeals)
        .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES),
    ),
  );
}

function uniqueDeploymentEscalationViewName(baseName: string, usedNames: Set<string>) {
  const base = `${baseName} (imported copy)`;
  let candidate = base;
  let index = 2;
  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${base} ${index}`;
    index += 1;
  }
  usedNames.add(candidate.toLowerCase());
  return candidate;
}

function demandSourceBlockerPacketTriageDedupeKey(state: Pick<DemandSourceBlockerPacketTriageState, "savedViewId" | "savedViewName" | "sourceType">) {
  return `${state.savedViewId || state.savedViewName.toLowerCase()}::${state.savedViewName.toLowerCase()}::${state.sourceType}`;
}

function demandSourceBlockerPacketTriagePacketKey(packet: Pick<DemandSourceBlockerSavedViewPacket, "savedViewId" | "name" | "sourceType">) {
  return `${packet.savedViewId || packet.name.toLowerCase()}::${packet.name.toLowerCase()}::${packet.sourceType}`;
}

function dedupeDemandSourceBlockerPacketTriageStates(states: DemandSourceBlockerPacketTriageState[]) {
  const byKey = new Map<string, DemandSourceBlockerPacketTriageState>();
  states
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .forEach((state) => {
      const key = demandSourceBlockerPacketTriageDedupeKey(state);
      if (!byKey.has(key)) byKey.set(key, state);
    });
  return Array.from(byKey.values())
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function dedupeDemandSourceBlockerPacketTriageAuditHistory(entries: DemandSourceBlockerPacketTriageAuditEntry[]) {
  const byId = new Map<string, DemandSourceBlockerPacketTriageAuditEntry>();
  entries
    .slice()
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    .forEach((entry) => {
      if (!byId.has(entry.id)) byId.set(entry.id, entry);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

function demandSourceBlockerPacketTriageWorkloadDriftSnapshotKey(
  report: Pick<DemandSourceBlockerPacketTriageWorkloadDriftReport, "id" | "recordedAt">,
) {
  return `${report.id}::${report.recordedAt}`;
}

function demandSourceBlockerPacketTriageWorkloadPinnedGroupKey(
  item: Pick<DemandSourceBlockerPacketTriageWorkloadPinnedSummary, "owner" | "sourceType">,
) {
  return `${item.owner}::${item.sourceType}`;
}

function dedupeDemandSourceBlockerPacketTriageWorkloadDriftReports(
  reports: DemandSourceBlockerPacketTriageWorkloadDriftReport[],
) {
  const bySnapshot = new Map<string, DemandSourceBlockerPacketTriageWorkloadDriftReport>();
  reports
    .slice()
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    .forEach((report) => {
      const key = demandSourceBlockerPacketTriageWorkloadDriftSnapshotKey(report);
      if (!bySnapshot.has(key)) bySnapshot.set(key, report);
    });
  return Array.from(bySnapshot.values())
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

function dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(
  entries: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry>();
  entries
    .slice()
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    .forEach((entry) => {
      if (!byId.has(entry.id)) byId.set(entry.id, entry);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

function dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(
  summaries: DemandSourceBlockerPacketTriageWorkloadPinnedSummary[],
) {
  const byGroup = new Map<string, DemandSourceBlockerPacketTriageWorkloadPinnedSummary>();
  summaries
    .slice()
    .sort((a, b) => b.pinnedAt.localeCompare(a.pinnedAt))
    .forEach((summary) => {
      const key = demandSourceBlockerPacketTriageWorkloadPinnedGroupKey(summary);
      if (!byGroup.has(key)) byGroup.set(key, summary);
    });
  return Array.from(byGroup.values())
    .sort((a, b) => b.pinnedAt.localeCompare(a.pinnedAt));
}

function dedupeDemandSourceBlockerPacketHandoffRemediationPlans(
  plans: DemandSourceBlockerPacketHandoffRemediationPlanEntry[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffRemediationPlanEntry>();
  plans
    .slice()
    .sort((a, b) => b.plannedAt.localeCompare(a.plannedAt))
    .forEach((plan) => {
      if (!byId.has(plan.id)) byId.set(plan.id, plan);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.plannedAt.localeCompare(a.plannedAt));
}

function dedupeDemandSourceBlockerPacketHandoffRemediationClosures(
  closures: DemandSourceBlockerPacketHandoffRemediationClosureReceipt[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffRemediationClosureReceipt>();
  closures
    .slice()
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt))
    .forEach((closure) => {
      if (!byId.has(closure.id)) byId.set(closure.id, closure);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt));
}

function dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(
  receipts: DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt>();
  receipts
    .slice()
    .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt))
    .forEach((receipt) => {
      if (!byId.has(receipt.id)) byId.set(receipt.id, receipt);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
}

function dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(
  receipts: DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt>();
  receipts
    .slice()
    .sort((a, b) => b.resolvedAt.localeCompare(a.resolvedAt))
    .forEach((receipt) => {
      if (!byId.has(receipt.id)) byId.set(receipt.id, receipt);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.resolvedAt.localeCompare(a.resolvedAt));
}

function dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(
  plans: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan>();
  plans
    .slice()
    .sort((a, b) => b.plannedAt.localeCompare(a.plannedAt))
    .forEach((plan) => {
      if (!byId.has(plan.id)) byId.set(plan.id, plan);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.plannedAt.localeCompare(a.plannedAt));
}

function dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(
  closures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt>();
  closures
    .slice()
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt))
    .forEach((closure) => {
      if (!byId.has(closure.id)) byId.set(closure.id, closure);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt));
}

function dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(
  closures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt>();
  closures
    .slice()
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt))
    .forEach((closure) => {
      if (!byId.has(closure.id)) byId.set(closure.id, closure);
    });
  return Array.from(byId.values())
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt));
}

function combineDeploymentEscalationAuditImportSummaries(
  summaries: Array<DeploymentEscalationAuditImportSummary | null>,
): DeploymentEscalationAuditImportSummary | null {
  const present = summaries.filter((summary): summary is DeploymentEscalationAuditImportSummary => Boolean(summary));
  if (present.length === 0) return null;
  return present.reduce<DeploymentEscalationAuditImportSummary>((combined, summary) => ({
    total: combined.total + summary.total,
    added: combined.added + summary.added,
    renamed: combined.renamed + summary.renamed,
    replaced: combined.replaced + summary.replaced,
    skipped: combined.skipped + summary.skipped,
  }), emptyDeploymentEscalationAuditImportSummary(0));
}

function emptyDeploymentEscalationAuditImportSummary(total = 0): DeploymentEscalationAuditImportSummary {
  return {
    total,
    added: 0,
    renamed: 0,
    replaced: 0,
    skipped: 0,
  };
}

function formatDeploymentEscalationAuditImportSummary(summary: DeploymentEscalationAuditImportSummary) {
  const savedViewLabel = summary.total === 1 ? "saved view" : "saved views";
  return `${summary.total} ${savedViewLabel}: ${summary.added} added, ${summary.renamed} renamed, ${summary.replaced} replaced, ${summary.skipped} skipped`;
}

function inspectPortfolioImportPayload(raw: string) {
  try {
    const parsed: unknown = JSON.parse(raw);
    const payload = parsed && typeof parsed === "object"
      ? parsed as {
        ventures?: unknown;
        deploymentEscalationAuditSavedViews?: unknown;
        demandSourceBlockerSavedViews?: unknown;
        demandSourceBlockerPacketTriage?: unknown;
        demandSourceBlockerPacketTriageAuditHistory?: unknown;
        demandSourceBlockerPacketTriageOwnerWorkloadSummary?: unknown;
        demandSourceBlockerPacketTriageWorkloadDriftReconciliation?: unknown;
        demandSourceBlockerPacketTriageWorkloadPinnedSummaries?: unknown;
        demandSourceBlockerPacketHandoffHealth?: unknown;
        demandSourceBlockerPacketHandoffRemediationQueue?: unknown;
        demandSourceBlockerPacketHandoffRemediationPlans?: unknown;
        demandSourceBlockerPacketHandoffRemediationClosures?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalations?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?: unknown;
        demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?: unknown;
      }
      : {};
    const payloadRecord = payload as Record<string, unknown>;
    const venturePayload = Array.isArray(parsed) ? parsed : payload.ventures;
    const hasVenturePayload = Array.isArray(parsed) || Object.prototype.hasOwnProperty.call(payload, "ventures");
    const hasSavedViewPayload = Object.prototype.hasOwnProperty.call(payload, "deploymentEscalationAuditSavedViews");
    const savedViewPayload = payload.deploymentEscalationAuditSavedViews;
    const hasDemandSourceBlockerSavedViewPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerSavedViews");
    const demandSourceBlockerSavedViewPayload = payload.demandSourceBlockerSavedViews;
    const hasDemandSourceBlockerPacketTriagePayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriage");
    const demandSourceBlockerPacketTriagePayload = payload.demandSourceBlockerPacketTriage;
    const hasDemandSourceBlockerPacketTriageAuditPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageAuditHistory");
    const demandSourceBlockerPacketTriageAuditPayload = payload.demandSourceBlockerPacketTriageAuditHistory;
    const hasDemandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageOwnerWorkloadSummary");
    const demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload = payload.demandSourceBlockerPacketTriageOwnerWorkloadSummary;
    const hasDemandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageWorkloadDriftReconciliation");
    const demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload = payload.demandSourceBlockerPacketTriageWorkloadDriftReconciliation;
    const hasDemandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketTriageWorkloadPinnedSummaries");
    const demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload = payload.demandSourceBlockerPacketTriageWorkloadPinnedSummaries;
    const hasDemandSourceBlockerPacketHandoffHealthPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffHealth");
    const demandSourceBlockerPacketHandoffHealthPayload = payload.demandSourceBlockerPacketHandoffHealth;
    const hasDemandSourceBlockerPacketHandoffRemediationQueuePayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffRemediationQueue");
    const demandSourceBlockerPacketHandoffRemediationQueuePayload = payload.demandSourceBlockerPacketHandoffRemediationQueue;
    const hasDemandSourceBlockerPacketHandoffRemediationPlansPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffRemediationPlans");
    const demandSourceBlockerPacketHandoffRemediationPlansPayload = payload.demandSourceBlockerPacketHandoffRemediationPlans;
    const hasDemandSourceBlockerPacketHandoffRemediationClosuresPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffRemediationClosures");
    const demandSourceBlockerPacketHandoffRemediationClosuresPayload = payload.demandSourceBlockerPacketHandoffRemediationClosures;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationsPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalations");
    const demandSourceBlockerPacketHandoffReopenEscalationsPayload = payload.demandSourceBlockerPacketHandoffReopenEscalations;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts");
    const demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload = payload.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions");
    const demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload = payload.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends");
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload = payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans");
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload = payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures");
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload = payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions");
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload = payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions;
    const hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresPayload = Object.prototype.hasOwnProperty.call(payload, "demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures");
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresPayload = payload.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures;
    const hasRegressionEscalationPayload = Object.prototype.hasOwnProperty.call(payloadRecord, BREACH_PROCESS_REGRESSION_ESCALATIONS_EXPORT_KEY);
    const regressionEscalationPayload = payloadRecord[BREACH_PROCESS_REGRESSION_ESCALATIONS_EXPORT_KEY];
    const hasRegressionAuditAssignmentPayload = Object.prototype.hasOwnProperty.call(payloadRecord, BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_ASSIGNMENTS_EXPORT_KEY);
    const regressionAuditAssignmentPayload = payloadRecord[BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_ASSIGNMENTS_EXPORT_KEY];
    const hasRegressionAuditClosurePayload = Object.prototype.hasOwnProperty.call(payloadRecord, BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_CLOSURES_EXPORT_KEY);
    const regressionAuditClosurePayload = payloadRecord[BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_CLOSURES_EXPORT_KEY];
    const hasRegressionAuditReviewPayload = Object.prototype.hasOwnProperty.call(payloadRecord, BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_REVIEWS_EXPORT_KEY);
    const regressionAuditReviewPayload = payloadRecord[BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_REVIEWS_EXPORT_KEY];
    const hasRegressionAuditAppealPayload = Object.prototype.hasOwnProperty.call(payloadRecord, BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_APPEALS_EXPORT_KEY);
    const regressionAuditAppealPayload = payloadRecord[BREACH_PROCESS_REGRESSION_ESCALATION_AUDIT_APPEALS_EXPORT_KEY];
    const hasRegressionGovernanceDigestPayload = Object.prototype.hasOwnProperty.call(payloadRecord, BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY);
    const regressionGovernanceDigestPayload = payloadRecord[BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY];

    return {
      isJsonValid: true,
      hasVenturePayload,
      venturePayloadIsArray: Array.isArray(venturePayload),
      rawVentureCount: Array.isArray(venturePayload) ? venturePayload.length : 0,
      hasSavedViewPayload,
      savedViewPayloadIsArray: Array.isArray(savedViewPayload),
      rawSavedViewCount: Array.isArray(savedViewPayload) ? savedViewPayload.length : 0,
      hasDemandSourceBlockerSavedViewPayload,
      demandSourceBlockerSavedViewPayloadIsArray: Array.isArray(demandSourceBlockerSavedViewPayload),
      rawDemandSourceBlockerSavedViewCount: Array.isArray(demandSourceBlockerSavedViewPayload) ? demandSourceBlockerSavedViewPayload.length : 0,
      hasDemandSourceBlockerPacketTriagePayload,
      demandSourceBlockerPacketTriagePayloadIsArray: Array.isArray(demandSourceBlockerPacketTriagePayload),
      rawDemandSourceBlockerPacketTriageCount: Array.isArray(demandSourceBlockerPacketTriagePayload) ? demandSourceBlockerPacketTriagePayload.length : 0,
      hasDemandSourceBlockerPacketTriageAuditPayload,
      demandSourceBlockerPacketTriageAuditPayloadIsArray: Array.isArray(demandSourceBlockerPacketTriageAuditPayload),
      rawDemandSourceBlockerPacketTriageAuditCount: Array.isArray(demandSourceBlockerPacketTriageAuditPayload) ? demandSourceBlockerPacketTriageAuditPayload.length : 0,
      hasDemandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload,
      demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayloadIsArray: Array.isArray(demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload),
      rawDemandSourceBlockerPacketTriageOwnerWorkloadSummaryCount: Array.isArray(demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload) ? demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload.length : 0,
      hasDemandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload,
      demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayloadIsArray: Array.isArray(demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload),
      rawDemandSourceBlockerPacketTriageWorkloadDriftReconciliationCount: Array.isArray(demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload) ? demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload.length : 0,
      hasDemandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload,
      demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayloadIsArray: Array.isArray(demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload),
      rawDemandSourceBlockerPacketTriageWorkloadPinnedSummariesCount: Array.isArray(demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload) ? demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffHealthPayload,
      demandSourceBlockerPacketHandoffHealthPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffHealthPayload),
      rawDemandSourceBlockerPacketHandoffHealthCount: Array.isArray(demandSourceBlockerPacketHandoffHealthPayload) ? demandSourceBlockerPacketHandoffHealthPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffRemediationQueuePayload,
      demandSourceBlockerPacketHandoffRemediationQueuePayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffRemediationQueuePayload),
      rawDemandSourceBlockerPacketHandoffRemediationQueueCount: Array.isArray(demandSourceBlockerPacketHandoffRemediationQueuePayload) ? demandSourceBlockerPacketHandoffRemediationQueuePayload.length : 0,
      hasDemandSourceBlockerPacketHandoffRemediationPlansPayload,
      demandSourceBlockerPacketHandoffRemediationPlansPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffRemediationPlansPayload),
      rawDemandSourceBlockerPacketHandoffRemediationPlansCount: Array.isArray(demandSourceBlockerPacketHandoffRemediationPlansPayload) ? demandSourceBlockerPacketHandoffRemediationPlansPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffRemediationClosuresPayload,
      demandSourceBlockerPacketHandoffRemediationClosuresPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffRemediationClosuresPayload),
      rawDemandSourceBlockerPacketHandoffRemediationClosuresCount: Array.isArray(demandSourceBlockerPacketHandoffRemediationClosuresPayload) ? demandSourceBlockerPacketHandoffRemediationClosuresPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationsPayload,
      demandSourceBlockerPacketHandoffReopenEscalationsPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationsPayload),
      rawDemandSourceBlockerPacketHandoffReopenEscalationsCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationsPayload) ? demandSourceBlockerPacketHandoffReopenEscalationsPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload,
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload),
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload) ? demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload,
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload),
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload) ? demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload),
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload) ? demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload),
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload) ? demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload),
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload) ? demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload.length : 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload),
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload) ? demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload.length : 0,
      hasRegressionClosurePayload: hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresPayload,
      regressionClosurePayloadIsArray: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresPayload),
      rawRegressionClosureCount: Array.isArray(demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresPayload) ? demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresPayload.length : 0,
      hasRegressionEscalationPayload,
      regressionEscalationPayloadIsArray: Array.isArray(regressionEscalationPayload),
      rawRegressionEscalationCount: Array.isArray(regressionEscalationPayload) ? regressionEscalationPayload.length : 0,
      hasRegressionAuditAssignmentPayload,
      regressionAuditAssignmentPayloadIsArray: Array.isArray(regressionAuditAssignmentPayload),
      rawRegressionAuditAssignmentCount: Array.isArray(regressionAuditAssignmentPayload) ? regressionAuditAssignmentPayload.length : 0,
      hasRegressionAuditClosurePayload,
      regressionAuditClosurePayloadIsArray: Array.isArray(regressionAuditClosurePayload),
      rawRegressionAuditClosureCount: Array.isArray(regressionAuditClosurePayload) ? regressionAuditClosurePayload.length : 0,
      hasRegressionAuditReviewPayload,
      regressionAuditReviewPayloadIsArray: Array.isArray(regressionAuditReviewPayload),
      rawRegressionAuditReviewCount: Array.isArray(regressionAuditReviewPayload) ? regressionAuditReviewPayload.length : 0,
      hasRegressionAuditAppealPayload,
      regressionAuditAppealPayloadIsArray: Array.isArray(regressionAuditAppealPayload),
      rawRegressionAuditAppealCount: Array.isArray(regressionAuditAppealPayload) ? regressionAuditAppealPayload.length : 0,
      hasRegressionGovernanceDigestPayload,
      regressionGovernanceDigestPayloadIsArray: Array.isArray(regressionGovernanceDigestPayload),
      rawRegressionGovernanceDigestCount: Array.isArray(regressionGovernanceDigestPayload) ? regressionGovernanceDigestPayload.length : 0,
    };
  } catch {
    return {
      isJsonValid: false,
      hasVenturePayload: false,
      venturePayloadIsArray: false,
      rawVentureCount: 0,
      hasSavedViewPayload: false,
      savedViewPayloadIsArray: false,
      rawSavedViewCount: 0,
      hasDemandSourceBlockerSavedViewPayload: false,
      demandSourceBlockerSavedViewPayloadIsArray: false,
      rawDemandSourceBlockerSavedViewCount: 0,
      hasDemandSourceBlockerPacketTriagePayload: false,
      demandSourceBlockerPacketTriagePayloadIsArray: false,
      rawDemandSourceBlockerPacketTriageCount: 0,
      hasDemandSourceBlockerPacketTriageAuditPayload: false,
      demandSourceBlockerPacketTriageAuditPayloadIsArray: false,
      rawDemandSourceBlockerPacketTriageAuditCount: 0,
      hasDemandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload: false,
      demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayloadIsArray: false,
      rawDemandSourceBlockerPacketTriageOwnerWorkloadSummaryCount: 0,
      hasDemandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload: false,
      demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayloadIsArray: false,
      rawDemandSourceBlockerPacketTriageWorkloadDriftReconciliationCount: 0,
      hasDemandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload: false,
      demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayloadIsArray: false,
      rawDemandSourceBlockerPacketTriageWorkloadPinnedSummariesCount: 0,
      hasDemandSourceBlockerPacketHandoffHealthPayload: false,
      demandSourceBlockerPacketHandoffHealthPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffHealthCount: 0,
      hasDemandSourceBlockerPacketHandoffRemediationQueuePayload: false,
      demandSourceBlockerPacketHandoffRemediationQueuePayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffRemediationQueueCount: 0,
      hasDemandSourceBlockerPacketHandoffRemediationPlansPayload: false,
      demandSourceBlockerPacketHandoffRemediationPlansPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffRemediationPlansCount: 0,
      hasDemandSourceBlockerPacketHandoffRemediationClosuresPayload: false,
      demandSourceBlockerPacketHandoffRemediationClosuresPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffRemediationClosuresCount: 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationsPayload: false,
      demandSourceBlockerPacketHandoffReopenEscalationsPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffReopenEscalationsCount: 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload: false,
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsCount: 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload: false,
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsCount: 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload: false,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsCount: 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload: false,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansCount: 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload: false,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresCount: 0,
      hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload: false,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayloadIsArray: false,
      rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsCount: 0,
      hasRegressionClosurePayload: false,
      regressionClosurePayloadIsArray: false,
      rawRegressionClosureCount: 0,
      hasRegressionEscalationPayload: false,
      regressionEscalationPayloadIsArray: false,
      rawRegressionEscalationCount: 0,
      hasRegressionAuditAssignmentPayload: false,
      regressionAuditAssignmentPayloadIsArray: false,
      rawRegressionAuditAssignmentCount: 0,
      hasRegressionAuditClosurePayload: false,
      regressionAuditClosurePayloadIsArray: false,
      rawRegressionAuditClosureCount: 0,
      hasRegressionAuditReviewPayload: false,
      regressionAuditReviewPayloadIsArray: false,
      rawRegressionAuditReviewCount: 0,
      hasRegressionAuditAppealPayload: false,
      regressionAuditAppealPayloadIsArray: false,
      rawRegressionAuditAppealCount: 0,
      hasRegressionGovernanceDigestPayload: false,
      regressionGovernanceDigestPayloadIsArray: false,
      rawRegressionGovernanceDigestCount: 0,
    };
  }
}

function mergeDeploymentEscalationAuditSavedViews(
  existingViews: DeploymentEscalationAuditSavedView[],
  importedViews: DeploymentEscalationAuditSavedView[],
  mode: DeploymentEscalationAuditImportMode,
): { views: DeploymentEscalationAuditSavedView[]; summary: DeploymentEscalationAuditImportSummary } {
  const summary = emptyDeploymentEscalationAuditImportSummary(importedViews.length);

  if (mode === "replace") {
    const existingNames = new Set(existingViews.map((view) => view.name.toLowerCase()));
    const importedNames = new Set(importedViews.map((view) => view.name.toLowerCase()));
    summary.replaced = existingViews.filter((view) => importedNames.has(view.name.toLowerCase())).length;
    summary.added = importedViews.filter((view) => !existingNames.has(view.name.toLowerCase())).length;
    return {
      views: [
        ...importedViews,
        ...existingViews.filter((view) => !importedNames.has(view.name.toLowerCase())),
      ].slice(0, MAX_DEPLOYMENT_ESCALATION_AUDIT_SAVED_VIEWS),
      summary,
    };
  }

  const usedNames = new Set(existingViews.map((view) => view.name.toLowerCase()));
  const mergedImports = importedViews.flatMap((view, index): DeploymentEscalationAuditSavedView[] => {
    const nameKey = view.name.toLowerCase();
    if (!usedNames.has(nameKey)) {
      usedNames.add(nameKey);
      summary.added += 1;
      return [view];
    }
    if (mode === "skip") {
      summary.skipped += 1;
      return [];
    }
    summary.renamed += 1;
    return [{
      ...view,
      id: `${view.id}-imported-copy-${Date.now()}-${index}`,
      name: uniqueDeploymentEscalationViewName(view.name, usedNames),
    }];
  });

  return {
    views: [
      ...mergedImports,
      ...existingViews,
    ].slice(0, MAX_DEPLOYMENT_ESCALATION_AUDIT_SAVED_VIEWS),
    summary,
  };
}

function mergeDemandSourceBlockerSavedViews(
  existingViews: DemandSourceBlockerSavedView[],
  importedViews: DemandSourceBlockerSavedView[],
  mode: DeploymentEscalationAuditImportMode,
): { views: DemandSourceBlockerSavedView[]; summary: DeploymentEscalationAuditImportSummary } {
  const summary = emptyDeploymentEscalationAuditImportSummary(importedViews.length);

  if (mode === "replace") {
    const existingNames = new Set(existingViews.map((view) => view.name.toLowerCase()));
    const importedNames = new Set(importedViews.map((view) => view.name.toLowerCase()));
    summary.replaced = existingViews.filter((view) => importedNames.has(view.name.toLowerCase())).length;
    summary.added = importedViews.filter((view) => !existingNames.has(view.name.toLowerCase())).length;
    return {
      views: [
        ...importedViews,
        ...existingViews.filter((view) => !importedNames.has(view.name.toLowerCase())),
      ].slice(0, MAX_DEMAND_SOURCE_BLOCKER_SAVED_VIEWS),
      summary,
    };
  }

  const usedNames = new Set(existingViews.map((view) => view.name.toLowerCase()));
  const mergedImports = importedViews.flatMap((view, index): DemandSourceBlockerSavedView[] => {
    const nameKey = view.name.toLowerCase();
    if (!usedNames.has(nameKey)) {
      usedNames.add(nameKey);
      summary.added += 1;
      return [view];
    }
    if (mode === "skip") {
      summary.skipped += 1;
      return [];
    }
    summary.renamed += 1;
    return [{
      ...view,
      id: `${view.id}-imported-copy-${Date.now()}-${index}`,
      name: uniqueDeploymentEscalationViewName(view.name, usedNames),
    }];
  });

  return {
    views: [
      ...mergedImports,
      ...existingViews,
    ].slice(0, MAX_DEMAND_SOURCE_BLOCKER_SAVED_VIEWS),
    summary,
  };
}

function mergeDemandSourceBlockerPacketTriageStates(
  existingStates: DemandSourceBlockerPacketTriageState[],
  importedStates: DemandSourceBlockerPacketTriageState[],
  mode: DeploymentEscalationAuditImportMode,
): { states: DemandSourceBlockerPacketTriageState[]; summary: DeploymentEscalationAuditImportSummary } {
  const summary = emptyDeploymentEscalationAuditImportSummary(importedStates.length);
  const byKey = new Map<string, DemandSourceBlockerPacketTriageState>();

  existingStates.forEach((state) => {
    byKey.set(demandSourceBlockerPacketTriageDedupeKey(state), state);
  });

  importedStates.forEach((state) => {
    const key = demandSourceBlockerPacketTriageDedupeKey(state);
    if (!byKey.has(key)) {
      summary.added += 1;
      byKey.set(key, state);
      return;
    }
    if (mode === "skip") {
      summary.skipped += 1;
      return;
    }
    summary.replaced += 1;
    byKey.set(key, state);
  });

  return {
    states: dedupeDemandSourceBlockerPacketTriageStates(Array.from(byKey.values()))
      .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATES),
    summary,
  };
}

function mergeDemandSourceBlockerPacketTriageAuditHistory(
  existingEntries: DemandSourceBlockerPacketTriageAuditEntry[],
  importedEntries: DemandSourceBlockerPacketTriageAuditEntry[],
): DemandSourceBlockerPacketTriageAuditEntry[] {
  return dedupeDemandSourceBlockerPacketTriageAuditHistory([
    ...importedEntries,
    ...existingEntries,
  ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_HISTORY);
}

function buildDemandSourceBlockerPacketTriageOwnerQueue(
  packets: DemandSourceBlockerSavedViewPacket[],
  auditHistory: DemandSourceBlockerPacketTriageAuditEntry[],
  ownerKey: string,
): DemandSourceBlockerPacketTriageOwnerQueueItem[] {
  const auditEntriesByPacketKey = new Map<string, DemandSourceBlockerPacketTriageAuditEntry[]>();
  auditHistory.forEach((entry) => {
    const key = demandSourceBlockerPacketTriagePacketKey({
      savedViewId: entry.savedViewId,
      name: entry.savedViewName,
      sourceType: entry.sourceType,
    });
    auditEntriesByPacketKey.set(key, [
      entry,
      ...(auditEntriesByPacketKey.get(key) ?? []),
    ].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)));
  });

  return packets
    .filter((packet): packet is DemandSourceBlockerSavedViewPacket & { triageStatus: "needs-evidence" | "delegated" } => (
      packet.triageStatus === "needs-evidence" || packet.triageStatus === "delegated"
    ))
    .map((packet) => {
      const packetAuditEntries = auditEntriesByPacketKey.get(demandSourceBlockerPacketTriagePacketKey(packet)) ?? [];
      const latestAuditEntry = packetAuditEntries[0];
      const owner = latestAuditEntry?.exportedBy
        ?? ownerKey;
      const groupKey = `${owner}::${packet.sourceType}::${packet.triageStatus}`;
      const latestAuditTransition = latestAuditEntry
        ? {
          previousStatus: latestAuditEntry.previousStatus,
          nextStatus: latestAuditEntry.nextStatus,
          recordedAt: latestAuditEntry.recordedAt,
        }
        : null;
      return {
        id: `${packet.id}-triage-owner-queue`,
        groupKey,
        groupLabel: `${owner} / ${packet.sourceType} / ${demandSourceBlockerPacketTriageLabel(packet.triageStatus).toLowerCase()}`,
        owner,
        sourceType: packet.sourceType,
        triageStatus: packet.triageStatus,
        savedViewId: packet.savedViewId,
        savedViewName: packet.name,
        packetId: packet.id,
        searchQuery: packet.searchQuery,
        currentMatchCount: packet.currentMatchCount,
        commandCount: packet.commandCount,
        evidenceCount: packet.evidence.length,
        matchingVentureTitles: packet.matchingVentureTitles,
        latestAuditTransition,
        latestAuditSummary: latestAuditTransition
          ? `${demandSourceBlockerPacketTriageLabel(latestAuditTransition.previousStatus)} -> ${demandSourceBlockerPacketTriageLabel(latestAuditTransition.nextStatus)} at ${latestAuditTransition.recordedAt}`
          : "No triage audit transition recorded yet.",
        summary: `${packet.name} is ${demandSourceBlockerPacketTriageLabel(packet.triageStatus).toLowerCase()} for ${packet.sourceType} blocker pressure across ${packet.currentMatchCount} current match${packet.currentMatchCount === 1 ? "" : "es"}.`,
      };
    })
    .sort((a, b) => (
      a.owner.localeCompare(b.owner)
      || a.sourceType.localeCompare(b.sourceType)
      || a.triageStatus.localeCompare(b.triageStatus)
      || a.savedViewName.localeCompare(b.savedViewName)
    ));
}

function buildDemandSourceBlockerPacketTriageOwnerWorkloadSummary(
  queueItems: DemandSourceBlockerPacketTriageOwnerQueueItem[],
): DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem[] {
  const byGroup = new Map<string, DemandSourceBlockerPacketTriageOwnerQueueItem[]>();
  queueItems.forEach((item) => {
    const groupKey = `${item.owner}::${item.sourceType}`;
    byGroup.set(groupKey, [...(byGroup.get(groupKey) ?? []), item]);
  });

  return Array.from(byGroup.entries()).map(([groupKey, items]) => {
    const [owner, sourceType] = groupKey.split("::") as [string, VentureDemandCaptureProofSourceType];
    const latestTransitionAt = items
      .map((item) => item.latestAuditTransition?.recordedAt)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => b.localeCompare(a))[0] ?? null;
    return {
      id: `demand-source-blocker-packet-workload-${owner}-${sourceType}`,
      owner,
      sourceType,
      searchAnchor: `blocker packet owner workload ${owner} ${sourceType}`,
      queueItemIds: items.map((item) => item.id),
      savedViewNames: Array.from(new Set(items.map((item) => item.savedViewName))).sort((a, b) => a.localeCompare(b)),
      activeCount: items.length,
      delegatedCount: items.filter((item) => item.triageStatus === "delegated").length,
      needsEvidenceCount: items.filter((item) => item.triageStatus === "needs-evidence").length,
      staleCount: items.filter((item) => item.currentMatchCount === 0).length,
      missingEvidenceCount: items.filter((item) => item.evidenceCount === 0).length,
      latestTransitionAt,
    };
  }).sort((a, b) => (
    a.owner.localeCompare(b.owner)
    || a.sourceType.localeCompare(b.sourceType)
  ));
}

function demandSourceBlockerPacketTriageWorkloadGroupKey(
  item: Pick<DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem, "owner" | "sourceType">,
) {
  return `${item.owner}::${item.sourceType}`;
}

function demandSourceBlockerPacketTriageWorkloadCountSummary(
  prefix: string,
  item: Pick<
    DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem,
    "activeCount" | "delegatedCount" | "needsEvidenceCount" | "staleCount" | "missingEvidenceCount"
  >,
) {
  return `${prefix} active ${item.activeCount}, delegated ${item.delegatedCount}, needs evidence ${item.needsEvidenceCount}, stale ${item.staleCount}, missing evidence ${item.missingEvidenceCount}`;
}

function emptyDemandSourceBlockerPacketTriageWorkloadSummary(
  owner: string,
  sourceType: VentureDemandCaptureProofSourceType,
): DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem {
  return {
    id: `empty-demand-source-blocker-packet-workload-${owner}-${sourceType}`,
    owner,
    sourceType,
    searchAnchor: `blocker packet owner workload ${owner} ${sourceType}`,
    queueItemIds: [],
    savedViewNames: [],
    activeCount: 0,
    delegatedCount: 0,
    needsEvidenceCount: 0,
    staleCount: 0,
    missingEvidenceCount: 0,
    latestTransitionAt: null,
  };
}

function buildDemandSourceBlockerPacketTriageWorkloadDriftReports(
  importedSummary: DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem[],
  currentSummary: DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem[],
  recordedAt: string,
): DemandSourceBlockerPacketTriageWorkloadDriftReport[] {
  const importedByGroup = new Map(importedSummary.map((item) => [
    demandSourceBlockerPacketTriageWorkloadGroupKey(item),
    item,
  ]));
  const currentByGroup = new Map(currentSummary.map((item) => [
    demandSourceBlockerPacketTriageWorkloadGroupKey(item),
    item,
  ]));
  const groupKeys = Array.from(new Set([
    ...importedByGroup.keys(),
    ...currentByGroup.keys(),
  ])).sort((a, b) => a.localeCompare(b));

  return groupKeys.map((groupKey) => {
    const importedItem = importedByGroup.get(groupKey);
    const currentItem = currentByGroup.get(groupKey);
    const owner = importedItem?.owner ?? currentItem?.owner ?? "unknown";
    const sourceType = (importedItem?.sourceType ?? currentItem?.sourceType ?? "channel-economics") as VentureDemandCaptureProofSourceType;
    const importedCounts = importedItem ?? emptyDemandSourceBlockerPacketTriageWorkloadSummary(owner, sourceType);
    const currentCounts = currentItem ?? emptyDemandSourceBlockerPacketTriageWorkloadSummary(owner, sourceType);
    const countsMatch = (
      importedCounts.activeCount === currentCounts.activeCount &&
      importedCounts.delegatedCount === currentCounts.delegatedCount &&
      importedCounts.needsEvidenceCount === currentCounts.needsEvidenceCount &&
      importedCounts.staleCount === currentCounts.staleCount &&
      importedCounts.missingEvidenceCount === currentCounts.missingEvidenceCount
    );
    const latestTransitionMatches = importedCounts.latestTransitionAt === currentCounts.latestTransitionAt;
    let status: DemandSourceBlockerPacketTriageWorkloadDriftStatus = "matching";
    if (!importedItem && currentItem) {
      status = "new-current";
    } else if (importedItem && !currentItem) {
      status = "missing-current";
    } else if (!countsMatch) {
      status = "count-mismatch";
    } else if (!latestTransitionMatches) {
      status = "stale";
    }
    const statusSummary: Record<DemandSourceBlockerPacketTriageWorkloadDriftStatus, string> = {
      matching: "Imported workload matches the current derived summary.",
      "count-mismatch": "Imported workload count mismatch against the current derived summary.",
      stale: "Imported workload latest transition is stale against the current derived summary.",
      "missing-current": "Imported workload group is missing from the current derived summary.",
      "new-current": "Current derived workload group was not present in the imported summary.",
    };
    return {
      id: `demand-source-blocker-packet-workload-drift-${owner}-${sourceType}`,
      recordedAt,
      owner,
      sourceType,
      status,
      searchAnchor: importedItem?.searchAnchor ?? currentItem?.searchAnchor ?? `blocker packet owner workload ${owner} ${sourceType}`,
      importedActiveCount: importedCounts.activeCount,
      currentActiveCount: currentCounts.activeCount,
      importedDelegatedCount: importedCounts.delegatedCount,
      currentDelegatedCount: currentCounts.delegatedCount,
      importedNeedsEvidenceCount: importedCounts.needsEvidenceCount,
      currentNeedsEvidenceCount: currentCounts.needsEvidenceCount,
      importedStaleCount: importedCounts.staleCount,
      currentStaleCount: currentCounts.staleCount,
      importedMissingEvidenceCount: importedCounts.missingEvidenceCount,
      currentMissingEvidenceCount: currentCounts.missingEvidenceCount,
      importedLatestTransitionAt: importedCounts.latestTransitionAt,
      currentLatestTransitionAt: currentCounts.latestTransitionAt,
      importedExportedAt: importedItem?.exportedAt,
      importedExportedBy: importedItem?.exportedBy,
      summary: [
        `${statusSummary[status]} ${owner} / ${sourceType}.`,
        demandSourceBlockerPacketTriageWorkloadCountSummary("Imported", importedCounts),
        demandSourceBlockerPacketTriageWorkloadCountSummary("current", currentCounts),
        `Latest transition imported ${importedCounts.latestTransitionAt ?? "none"} vs current ${currentCounts.latestTransitionAt ?? "none"}.`,
      ].join(" "),
    };
  }).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_REPORTS);
}

function buildDemandSourceBlockerPacketTriageWorkloadSummaryFromReport(
  report: DemandSourceBlockerPacketTriageWorkloadDriftReport,
): DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem {
  return {
    id: `pinned-current-demand-source-blocker-packet-workload-${report.owner}-${report.sourceType}`,
    owner: report.owner,
    sourceType: report.sourceType,
    searchAnchor: report.searchAnchor,
    queueItemIds: [],
    savedViewNames: [],
    activeCount: report.currentActiveCount,
    delegatedCount: report.currentDelegatedCount,
    needsEvidenceCount: report.currentNeedsEvidenceCount,
    staleCount: report.currentStaleCount,
    missingEvidenceCount: report.currentMissingEvidenceCount,
    latestTransitionAt: report.currentLatestTransitionAt,
    source: "local",
  };
}

function getLatestDemandSourceBlockerPacketTriageWorkloadReconciliationBySnapshot(
  entries: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[],
) {
  const bySnapshot = new Map<string, DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry>();
  dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(entries).forEach((entry) => {
    const key = `${entry.driftReportId}::${entry.importedRecordedAt}`;
    if (!bySnapshot.has(key)) bySnapshot.set(key, entry);
  });
  return bySnapshot;
}

function getDemandSourceBlockerPacketTriageWorkloadPinnedSummariesByGroup(
  summaries: DemandSourceBlockerPacketTriageWorkloadPinnedSummary[],
) {
  return new Map(dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(summaries).map((summary) => [
    demandSourceBlockerPacketTriageWorkloadPinnedGroupKey(summary),
    summary,
  ]));
}

function latestIso(values: Array<string | null | undefined>) {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => b.localeCompare(a))[0] ?? null;
}

function hoursBetweenIso(laterIso: string, earlierIso: string) {
  const later = Date.parse(laterIso);
  const earlier = Date.parse(earlierIso);
  if (!Number.isFinite(later) || !Number.isFinite(earlier) || later < earlier) return 0;
  return Math.floor((later - earlier) / (1000 * 60 * 60));
}

function buildDemandSourceBlockerPacketHandoffHealth(
  reports: DemandSourceBlockerPacketTriageWorkloadDriftReport[],
  reconciliation: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[],
  pinnedSummaries: DemandSourceBlockerPacketTriageWorkloadPinnedSummary[],
  measuredAt: string,
): DemandSourceBlockerPacketHandoffHealthItem[] {
  const driftReports = dedupeDemandSourceBlockerPacketTriageWorkloadDriftReports(reports)
    .filter((report) => report.status !== "matching");
  const reconciliationEntries = dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(reconciliation);
  const pinned = dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(pinnedSummaries);
  const latestReconciliationBySnapshot = getLatestDemandSourceBlockerPacketTriageWorkloadReconciliationBySnapshot(reconciliationEntries);
  const pinnedSummaryByGroup = getDemandSourceBlockerPacketTriageWorkloadPinnedSummariesByGroup(pinned);
  const groupKeys = Array.from(new Set([
    ...driftReports.map((report) => `${report.owner}::${report.sourceType}`),
    ...reconciliationEntries.map((entry) => `${entry.owner}::${entry.sourceType}`),
    ...pinned.map((summary) => demandSourceBlockerPacketTriageWorkloadPinnedGroupKey(summary)),
  ])).sort((a, b) => a.localeCompare(b));

  return groupKeys.map((groupKey) => {
    const [owner, sourceType] = groupKey.split("::") as [string, VentureDemandCaptureProofSourceType];
    const reportsForGroup = driftReports.filter((report) => `${report.owner}::${report.sourceType}` === groupKey);
    const reconciliationForGroup = reconciliationEntries.filter((entry) => `${entry.owner}::${entry.sourceType}` === groupKey);
    const pinnedForGroup = pinned.filter((summary) => demandSourceBlockerPacketTriageWorkloadPinnedGroupKey(summary) === groupKey);
    const unresolvedDriftCount = reportsForGroup.filter((report) => {
      const latestReconciliation = latestReconciliationBySnapshot.get(demandSourceBlockerPacketTriageWorkloadDriftSnapshotKey(report));
      const pinnedSummary = pinnedSummaryByGroup.get(groupKey);
      return latestReconciliation?.action !== "reviewed" && latestReconciliation?.action !== "pinned-current" && Boolean(!pinnedSummary);
    }).length;
    const resolvedDriftCount = Math.max(0, reportsForGroup.length - unresolvedDriftCount);
    const reviewedReconciliationCount = reconciliationForGroup.filter((entry) => entry.action === "reviewed").length;
    const pinnedReconciliationCount = reconciliationForGroup.filter((entry) => entry.action === "pinned-current").length;
    const clearedReconciliationCount = reconciliationForGroup.filter((entry) => entry.action === "cleared").length;
    const latestDriftAt = latestIso(reportsForGroup.map((report) => report.recordedAt));
    const latestReviewAt = latestIso(reconciliationForGroup.map((entry) => entry.recordedAt));
    const latestPinnedAt = latestIso(pinnedForGroup.map((summary) => summary.pinnedAt));
    const repeatedDriftCount = Math.max(0, reportsForGroup.length - 1);
    const statusBreakdown = Object.entries(reportsForGroup.reduce<Record<string, number>>((counts, report) => ({
      ...counts,
      [report.status]: (counts[report.status] ?? 0) + 1,
    }), {}))
      .map(([status, count]) => `${status}: ${count}`)
      .sort((a, b) => a.localeCompare(b));
    const churnScore = Math.min(100, (unresolvedDriftCount * 40) + (repeatedDriftCount * 25) + (clearedReconciliationCount * 10));
    let status: DemandSourceBlockerPacketHandoffHealthStatus = "clear";
    if (repeatedDriftCount > 0) {
      status = "repeated-drift-churn";
    } else if (unresolvedDriftCount > 0) {
      status = "unresolved-drift";
    } else if (resolvedDriftCount > 0 || reviewedReconciliationCount > 0 || pinnedReconciliationCount > 0 || pinnedForGroup.length > 0) {
      status = "reconciled";
    }
    const searchAnchor = reportsForGroup[0]?.searchAnchor
      ?? pinnedForGroup[0]?.summary.searchAnchor
      ?? `blocker packet owner workload ${owner} ${sourceType}`;
    const staleReviewAgeHours = latestReviewAt ? hoursBetweenIso(measuredAt, latestReviewAt) : null;
    const summary = [
      `${owner} / ${sourceType} has ${reportsForGroup.length} drift snapshot${reportsForGroup.length === 1 ? "" : "s"}.`,
      `${unresolvedDriftCount} unresolved, ${resolvedDriftCount} resolved, ${reviewedReconciliationCount} reviewed, ${pinnedReconciliationCount} pinned action${pinnedReconciliationCount === 1 ? "" : "s"}, ${pinnedForGroup.length} pinned summar${pinnedForGroup.length === 1 ? "y" : "ies"}.`,
      `${repeatedDriftCount} repeated drift event${repeatedDriftCount === 1 ? "" : "s"}; churn score ${churnScore}/100.`,
    ].join(" ");
    const nextAction = unresolvedDriftCount > 0
      ? "Review the newest unresolved drift snapshot before trusting this handoff."
      : repeatedDriftCount > 0
        ? "Audit why this owner/source handoff keeps drifting before accepting another transfer."
        : pinnedForGroup.length > 0
          ? "Use the pinned authoritative summary as the transfer baseline."
          : "No immediate handoff action required.";

    return {
      id: `demand-source-blocker-packet-handoff-health-${owner}-${sourceType}`,
      owner,
      sourceType,
      status,
      searchAnchor,
      totalDriftSnapshots: reportsForGroup.length,
      repeatedDriftCount,
      unresolvedDriftCount,
      resolvedDriftCount,
      reviewedReconciliationCount,
      pinnedReconciliationCount,
      clearedReconciliationCount,
      pinnedSummaryCount: pinnedForGroup.length,
      latestDriftAt,
      latestReviewAt,
      latestPinnedAt,
      staleReviewAgeHours,
      churnScore,
      statusBreakdown,
      summary,
      nextAction,
      source: "local",
    };
  }).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS);
}

function demandSourceBlockerPacketHandoffRemediationTrigger(
  health: DemandSourceBlockerPacketHandoffHealthItem,
): DemandSourceBlockerPacketHandoffRemediationTrigger | null {
  if (health.repeatedDriftCount > 0) return "repeated-drift";
  if (health.unresolvedDriftCount > 0) return "unresolved-drift";
  if ((health.staleReviewAgeHours ?? 0) >= 24) return "stale-review";
  return null;
}

function demandSourceBlockerPacketHandoffRemediationPriority(
  health: DemandSourceBlockerPacketHandoffHealthItem,
  trigger: DemandSourceBlockerPacketHandoffRemediationTrigger,
): DemandSourceBlockerPacketHandoffRemediationPriority {
  if (trigger === "repeated-drift" && (health.unresolvedDriftCount > 0 || health.churnScore >= 60)) return "critical";
  if (trigger === "repeated-drift") return "high";
  if (trigger === "unresolved-drift" && health.unresolvedDriftCount > 1) return "critical";
  if (trigger === "unresolved-drift") return "high";
  return "medium";
}

function demandSourceBlockerPacketHandoffRemediationProofRequired(
  health: DemandSourceBlockerPacketHandoffHealthItem,
  trigger: DemandSourceBlockerPacketHandoffRemediationTrigger,
) {
  if (trigger === "repeated-drift") {
    return `Attach a fresh owner workload summary for ${health.owner} / ${health.sourceType}, explain why ${health.repeatedDriftCount} repeated drift event${health.repeatedDriftCount === 1 ? "" : "s"} happened, and choose accept, pin, or reject before the next import.`;
  }
  if (trigger === "unresolved-drift") {
    return `Resolve ${health.unresolvedDriftCount} unresolved drift warning${health.unresolvedDriftCount === 1 ? "" : "s"} for ${health.owner} / ${health.sourceType} with reviewed or pinned-current provenance.`;
  }
  return `Refresh the ${health.owner} / ${health.sourceType} handoff review because the latest review is ${health.staleReviewAgeHours ?? 0} hours old.`;
}

function demandSourceBlockerPacketHandoffRemediationNextAction(
  health: DemandSourceBlockerPacketHandoffHealthItem,
  trigger: DemandSourceBlockerPacketHandoffRemediationTrigger,
) {
  if (trigger === "repeated-drift") {
    return "Schedule owner/source remediation before accepting another portfolio transfer.";
  }
  if (trigger === "unresolved-drift") {
    return "Open the unresolved drift filter, inspect the newest mismatch, then review or pin current state.";
  }
  return "Re-run the owner workload summary and record a fresh handoff review.";
}

function getLatestDemandSourceBlockerPacketHandoffRemediationPlanById(
  plans: DemandSourceBlockerPacketHandoffRemediationPlanEntry[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffRemediationPlanEntry>();
  dedupeDemandSourceBlockerPacketHandoffRemediationPlans(plans).forEach((plan) => {
    if (!byId.has(plan.remediationId)) byId.set(plan.remediationId, plan);
  });
  return byId;
}

function getLatestDemandSourceBlockerPacketHandoffRemediationClosureById(
  closures: DemandSourceBlockerPacketHandoffRemediationClosureReceipt[],
) {
  const byId = new Map<string, DemandSourceBlockerPacketHandoffRemediationClosureReceipt>();
  dedupeDemandSourceBlockerPacketHandoffRemediationClosures(closures).forEach((closure) => {
    if (!byId.has(closure.remediationId)) byId.set(closure.remediationId, closure);
  });
  return byId;
}

function demandSourceBlockerPacketHandoffRemediationReopenReason(
  health: DemandSourceBlockerPacketHandoffHealthItem,
  closure: DemandSourceBlockerPacketHandoffRemediationClosureReceipt | undefined,
) {
  if (!closure) return null;
  if (health.latestDriftAt && health.latestDriftAt > closure.closedAt) {
    return `Imported drift arrived after closure at ${closure.closedAt}.`;
  }
  if (
    typeof closure.totalDriftSnapshotsAtClosure === "number" &&
    health.totalDriftSnapshots > closure.totalDriftSnapshotsAtClosure
  ) {
    return `Drift snapshots increased from ${closure.totalDriftSnapshotsAtClosure} to ${health.totalDriftSnapshots}.`;
  }
  if (
    typeof closure.repeatedDriftCountAtClosure === "number" &&
    health.repeatedDriftCount > closure.repeatedDriftCountAtClosure
  ) {
    return `Repeated drift increased from ${closure.repeatedDriftCountAtClosure} to ${health.repeatedDriftCount}.`;
  }
  if (
    typeof closure.unresolvedDriftCountAtClosure === "number" &&
    health.unresolvedDriftCount > closure.unresolvedDriftCountAtClosure
  ) {
    return `Unresolved drift increased from ${closure.unresolvedDriftCountAtClosure} to ${health.unresolvedDriftCount}.`;
  }
  return null;
}

function buildDemandSourceBlockerPacketHandoffRemediationQueue(
  healthItems: DemandSourceBlockerPacketHandoffHealthItem[],
  plans: DemandSourceBlockerPacketHandoffRemediationPlanEntry[],
  closures: DemandSourceBlockerPacketHandoffRemediationClosureReceipt[],
): DemandSourceBlockerPacketHandoffRemediationItem[] {
  const plansByRemediationId = getLatestDemandSourceBlockerPacketHandoffRemediationPlanById(plans);
  const closuresByRemediationId = getLatestDemandSourceBlockerPacketHandoffRemediationClosureById(closures);
  return healthItems.flatMap((health) => {
    const trigger = demandSourceBlockerPacketHandoffRemediationTrigger(health);
    if (!trigger) return [];
    const id = `demand-source-blocker-packet-handoff-remediation-${health.owner}-${health.sourceType}-${trigger}`;
    const latestPlan = plansByRemediationId.get(id);
    const latestClosure = closuresByRemediationId.get(id);
    const reopenedReason = demandSourceBlockerPacketHandoffRemediationReopenReason(health, latestClosure);
    const reopenedAfterClosure = Boolean(reopenedReason);
    const priority = demandSourceBlockerPacketHandoffRemediationPriority(health, trigger);
    const proofRequired = latestPlan?.proofRequired ?? demandSourceBlockerPacketHandoffRemediationProofRequired(health, trigger);
    const nextAction = reopenedAfterClosure
      ? "Re-plan remediation with fresh proof because new imported drift arrived after the prior closure."
      : latestClosure
      ? "Review closure receipt against the retained drift history before accepting the next portfolio transfer."
      : latestPlan?.nextAction ?? demandSourceBlockerPacketHandoffRemediationNextAction(health, trigger);
    const triggerLabel = trigger.replace(/-/g, " ");
    const evidence = [
      `${health.totalDriftSnapshots} drift snapshots`,
      `${health.unresolvedDriftCount} unresolved drift warnings`,
      `${health.repeatedDriftCount} repeated drift events`,
      `Churn score ${health.churnScore}/100`,
      `Latest drift ${health.latestDriftAt ?? "none"}`,
      `Latest review ${health.latestReviewAt ?? "none"}`,
    ];
    return [{
      id,
      healthId: health.id,
      owner: health.owner,
      sourceType: health.sourceType,
      trigger,
      priority,
      status: reopenedAfterClosure ? "ready" as const : latestClosure ? "proof-closed" as const : latestPlan ? "planned" as const : "ready" as const,
      assignedOwner: health.owner,
      searchAnchor: health.searchAnchor,
      churnScore: health.churnScore,
      totalDriftSnapshots: health.totalDriftSnapshots,
      unresolvedDriftCount: health.unresolvedDriftCount,
      repeatedDriftCount: health.repeatedDriftCount,
      staleReviewAgeHours: health.staleReviewAgeHours,
      latestDriftAt: health.latestDriftAt,
      latestReviewAt: health.latestReviewAt,
      plannedAt: latestPlan?.plannedAt ?? null,
      plannedBy: latestPlan?.plannedBy ?? null,
      planCount: plans.filter((plan) => plan.remediationId === id).length,
      closedAt: latestClosure?.closedAt ?? null,
      closedBy: latestClosure?.closedBy ?? null,
      closureCount: closures.filter((closure) => closure.remediationId === id).length,
      closureProofSummary: latestClosure?.proofSummary ?? null,
      closureProofArtifact: latestClosure?.proofArtifact ?? null,
      linkedDriftReportIds: latestClosure?.linkedDriftReportIds ?? [],
      reopenedAfterClosure,
      reopenedReason,
      summary: `${health.owner} / ${health.sourceType} needs ${triggerLabel} remediation before this handoff is trusted. ${health.summary}`,
      proofRequired,
      nextAction,
      evidence,
      source: "local" as const,
    }];
  }).sort((a, b) => {
    const priorityRank: Record<DemandSourceBlockerPacketHandoffRemediationPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
    };
    return (
      priorityRank[a.priority] - priorityRank[b.priority]
      || b.churnScore - a.churnScore
      || b.unresolvedDriftCount - a.unresolvedDriftCount
      || a.owner.localeCompare(b.owner)
      || a.sourceType.localeCompare(b.sourceType)
    );
  }).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS);
}

function buildDemandSourceBlockerPacketHandoffReopenEscalations(
  remediationQueue: DemandSourceBlockerPacketHandoffRemediationItem[],
): DemandSourceBlockerPacketHandoffReopenEscalationItem[] {
  return remediationQueue
    .filter((item) => item.reopenedAfterClosure)
    .map((item) => {
      const failedClosureCount = Math.max(1, item.closureCount ?? 0);
      const severity: DemandSourceBlockerPacketHandoffReopenEscalationSeverity = (
        failedClosureCount > 1 ||
        item.repeatedDriftCount > 1 ||
        item.unresolvedDriftCount > 0
      ) ? "critical" : "high";
      const evidence = [
        `${failedClosureCount} failed closure ${failedClosureCount === 1 ? "receipt" : "receipts"}`,
        `${item.totalDriftSnapshots ?? 0} current drift snapshots`,
        `${item.repeatedDriftCount} repeated drift events`,
        `${item.unresolvedDriftCount} unresolved drift warnings`,
        `Latest reopened drift ${item.latestDriftAt ?? "none"}`,
        `Prior closure ${item.closedAt ?? "none"}`,
      ];
      return {
        id: `demand-source-blocker-packet-handoff-reopen-escalation-${item.owner}-${item.sourceType}-${item.trigger}`,
        remediationId: item.id,
        owner: item.owner,
        sourceType: item.sourceType,
        trigger: item.trigger,
        severity,
        reopenedCount: failedClosureCount,
        failedClosureCount,
        latestReopenedAt: item.latestDriftAt,
        latestClosedAt: item.closedAt ?? null,
        latestProofSummary: item.closureProofSummary ?? null,
        latestProofArtifact: item.closureProofArtifact ?? null,
        reopenedReason: item.reopenedReason ?? "A closed remediation reopened after new imported drift.",
        searchAnchor: item.searchAnchor,
        churnScore: item.churnScore,
        totalDriftSnapshots: item.totalDriftSnapshots ?? 0,
        repeatedDriftCount: item.repeatedDriftCount,
        unresolvedDriftCount: item.unresolvedDriftCount,
        summary: `${item.owner} / ${item.sourceType} reopened after closure; prior proof no longer stabilizes this handoff.`,
        nextAction: "Escalate to a lead before accepting another portfolio transfer; require fresh remediation proof and review the failed closure receipt.",
        evidence,
        source: "local" as const,
      };
    })
    .sort((a, b) => (
      (a.severity === "critical" ? 0 : 1) - (b.severity === "critical" ? 0 : 1)
      || b.reopenedCount - a.reopenedCount
      || b.churnScore - a.churnScore
      || a.owner.localeCompare(b.owner)
      || a.sourceType.localeCompare(b.sourceType)
    ))
    .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS);
}

function buildDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends(
  resolutions: DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt[],
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem[] {
  const dedupedResolutions = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(resolutions);
  const overdueResolutions = dedupedResolutions.filter((receipt) => receipt.wasOverdue);
  const groupKeys = Array.from(new Set(overdueResolutions.map((receipt) => `${receipt.owner}::${receipt.sourceType}`)))
    .sort((a, b) => a.localeCompare(b));

  return groupKeys.map((groupKey) => {
    const [owner, sourceType] = groupKey.split("::") as [string, VentureDemandCaptureProofSourceType];
    const breachedForGroup = overdueResolutions.filter((receipt) => `${receipt.owner}::${receipt.sourceType}` === groupKey);
    const allForGroup = dedupedResolutions.filter((receipt) => `${receipt.owner}::${receipt.sourceType}` === groupKey);
    const latestBreachedResolution = breachedForGroup
      .slice()
      .sort((a, b) => b.resolvedAt.localeCompare(a.resolvedAt))[0];
    const assignedOwners = Array.from(new Set(allForGroup.map((receipt) => receipt.assignedOwner).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));
    const breachCount = breachedForGroup.length;
    const resolutionCount = allForGroup.length;
    const severity: "critical" | "high" = breachCount > 1 ? "critical" : "high";
    const evidence = [
      `${breachCount} resolved SLA ${breachCount === 1 ? "receipt breached its due date" : "receipts breached due dates"}`,
      `${resolutionCount} total reopened handoff SLA ${resolutionCount === 1 ? "resolution" : "resolutions"} for this owner/source`,
      `Latest breached due date ${latestBreachedResolution?.dueAt ?? "none"}`,
      `Latest breached resolution ${latestBreachedResolution?.resolvedAt ?? "none"}`,
      `Assigned SLA owners ${assignedOwners.length > 0 ? assignedOwners.join(", ") : "none"}`,
    ];
    return {
      id: `demand-source-blocker-packet-handoff-reopen-escalation-sla-breach-trend-${owner}-${sourceType}`,
      owner,
      sourceType,
      severity,
      breachCount,
      resolutionCount,
      latestBreachAt: latestBreachedResolution?.resolvedAt ?? null,
      latestDueAt: latestIso(breachedForGroup.map((receipt) => receipt.dueAt)),
      latestResolvedAt: latestIso(allForGroup.map((receipt) => receipt.resolvedAt)),
      assignedOwners,
      breachedResolutionIds: breachedForGroup.map((receipt) => receipt.id),
      summary: `${owner} / ${sourceType} has ${breachCount} reopened handoff SLA ${breachCount === 1 ? "breach" : "breaches"} after proof closure failed.`,
      nextAction: breachCount > 1
        ? "Run an owner/source process review before accepting another handoff transfer."
        : "Review the breached SLA receipt before accepting another handoff transfer.",
      evidence,
      source: "local" as const,
    };
  }).sort((a, b) => (
    (a.severity === "critical" ? 0 : 1) - (b.severity === "critical" ? 0 : 1)
    || b.breachCount - a.breachCount
    || (b.latestBreachAt ?? "").localeCompare(a.latestBreachAt ?? "")
    || a.owner.localeCompare(b.owner)
    || a.sourceType.localeCompare(b.sourceType)
  )).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS);
}

function buildDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions(
  trends: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem[],
  plans: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan[],
  closures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt[],
): DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression[] {
  const trendById = new Map(trends.map((trend) => [trend.id, trend]));
  const latestClosureByPlanId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt>();
  dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(closures).forEach((closure) => {
    if (!latestClosureByPlanId.has(closure.planId)) latestClosureByPlanId.set(closure.planId, closure);
  });

  return dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(plans)
    .flatMap((plan) => {
      const trend = trendById.get(plan.trendId);
      const closure = latestClosureByPlanId.get(plan.id);
      if (!trend || !closure) return [];
      const newBreachedResolutionIds = trend.breachedResolutionIds.filter((id) => !closure.breachedResolutionIds.includes(id));
      const breachAfterClosure = Boolean(trend.latestBreachAt && trend.latestBreachAt > closure.closedAt);
      const countIncreased = trend.breachCount > closure.breachCount;
      if (!breachAfterClosure && !countIncreased && newBreachedResolutionIds.length === 0) return [];
      const evidence = [
        `Closed process proof at ${closure.closedAt} by ${closure.closedBy}`,
        `Breach count moved from ${closure.breachCount} at closure to ${trend.breachCount}`,
        `Latest breach ${trend.latestBreachAt ?? "none"}`,
        `New breached receipts: ${newBreachedResolutionIds.slice(0, 4).join(", ") || "none"}`,
        `Prior proof: ${closure.proofSummary}`,
      ];
      return [{
        id: `demand-source-blocker-packet-handoff-reopen-sla-breach-process-regression-${plan.id}`,
        planId: plan.id,
        closureId: closure.id,
        trendId: plan.trendId,
        owner: plan.owner,
        sourceType: plan.sourceType,
        status: "stale-after-closure" as const,
        breachCountAtClosure: closure.breachCount,
        currentBreachCount: trend.breachCount,
        latestBreachAt: trend.latestBreachAt,
        closureClosedAt: closure.closedAt,
        closedBy: closure.closedBy,
        proofSummary: closure.proofSummary,
        proofArtifact: closure.proofArtifact,
        newBreachedResolutionIds,
        summary: `${plan.owner} / ${plan.sourceType} breached reopened SLA work after process proof closure, so the closed process plan is stale.`,
        nextAction: "Re-open process review, preserve the prior closure receipt, and require fresh process proof before trusting another reopened handoff.",
        evidence,
        source: "local" as const,
      }];
    })
    .sort((a, b) => (
      b.currentBreachCount - a.currentBreachCount
      || (b.latestBreachAt ?? "").localeCompare(a.latestBreachAt ?? "")
      || a.owner.localeCompare(b.owner)
      || a.sourceType.localeCompare(b.sourceType)
    ))
    .slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS);
}

function demandSourceBlockerSavedViewPacketMarkdown(packet: Omit<DemandSourceBlockerSavedViewPacket, "markdown">) {
  return [
    `# Demand Source Blocker Saved View Packet: ${packet.name}`,
    "",
    "## Summary",
    packet.summary,
    "",
    "## Triage",
    packet.triageStatus
      ? `${DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_LABELS[packet.triageStatus]}${packet.triageUpdatedAt ? ` at ${packet.triageUpdatedAt}` : ""}`
      : "Untriaged",
    "",
    "## Saved Search Query",
    packet.searchQuery,
    "",
    "## Source Type",
    packet.sourceType,
    "",
    "## Matching Ventures",
    ...(packet.matchingVentureTitles.length > 0
      ? packet.matchingVentureTitles.map((title) => `- ${title}`)
      : ["- No current matching ventures."]),
    "",
    "## Linked Command IDs",
    ...(packet.commandIds.length > 0
      ? packet.commandIds.map((id) => `- ${id}`)
      : ["- No current linked command ids."]),
    "",
    "## Decision Counts",
    ...(packet.decisionCounts.length > 0
      ? packet.decisionCounts.map((decision) => `- ${decision.decision}: ${decision.count}`)
      : ["- No current decision counts."]),
    "",
    "## Latest Evidence",
    ...(packet.evidence.length > 0
      ? packet.evidence.map((line) => `- ${line}`)
      : ["- No current blocker evidence for this saved view."]),
  ].join("\n");
}

function buildDemandSourceBlockerSavedViewPackets(
  savedViews: DemandSourceBlockerSavedView[],
  drilldowns: VentureDemandSourceBlockerDrilldownItem[],
  generatedAt: string,
  triageStates: DemandSourceBlockerPacketTriageState[] = [],
): DemandSourceBlockerSavedViewPacket[] {
  const drilldownBySourceType = new Map(drilldowns.map((item) => [item.sourceType, item]));
  const triageBySavedViewId = new Map(triageStates.map((state) => [state.savedViewId, state]));
  const triageByPacketKey = new Map(triageStates.map((state) => [demandSourceBlockerPacketTriageDedupeKey(state), state]));

  return savedViews.map((view) => {
    const drilldown = drilldownBySourceType.get(view.sourceType);
    const triageState = triageBySavedViewId.get(view.id)
      ?? triageByPacketKey.get(demandSourceBlockerPacketTriagePacketKey({
        savedViewId: view.id,
        name: view.name,
        sourceType: view.sourceType,
      }));
    const matchingVentureIds = drilldown?.ventureIds ?? [];
    const matchingVentureTitles = drilldown?.ventureTitles ?? [];
    const commandIds = drilldown?.commandIds ?? [];
    const currentMatchCount = matchingVentureIds.length;
    const evidence = drilldown?.evidence.slice(0, 8) ?? [];
    const summary = drilldown
      ? `${view.name} tracks ${view.sourceType} blocker pressure across ${currentMatchCount} current venture${currentMatchCount === 1 ? "" : "s"} and ${commandIds.length} linked command${commandIds.length === 1 ? "" : "s"}. ${drilldown.summary}`
      : `${view.name} tracks ${view.sourceType} blocker pressure, but no current venture matches this saved view.`;
    const packet: Omit<DemandSourceBlockerSavedViewPacket, "markdown"> = {
      id: `${view.id}-packet`,
      savedViewId: view.id,
      name: view.name,
      generatedAt,
      sourceType: view.sourceType,
      searchQuery: view.searchQuery,
      currentMatchCount,
      matchingVentureIds,
      matchingVentureTitles,
      commandIds,
      commandCount: commandIds.length,
      decisionCounts: drilldown?.decisionCounts ?? [],
      evidence,
      summary,
      triageStatus: triageState?.status,
      triageUpdatedAt: triageState?.updatedAt,
      triageSource: triageState?.source,
    };

    return {
      ...packet,
      markdown: demandSourceBlockerSavedViewPacketMarkdown(packet),
    };
  });
}

function statusBadge(status: SavedVentureWorkspace["lifecycleStatus"]) {
  if (status === "building" || status === "launched" || status === "scaling") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (status === "validating" || status === "getting-signals") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  }
  if (status === "killed" || status === "archived") {
    return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  }
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function readinessBadge(readiness: VentureEvidenceReadiness) {
  if (readiness === "decision-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (readiness === "needs-pressure-test") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function readinessNoticeBadge(tone: "blocked" | "degraded" | "empty") {
  if (tone === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (tone === "degraded") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function qualityBadge(label: string) {
  if (label === "Strong") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (label === "Useful") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (label === "Thin") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function priorityBadge(priority: VentureGapActionPriority) {
  if (priority === "high") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (priority === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function gapStatusBadge(status: VentureGapActionStatus) {
  if (status === "completed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "launched") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "dismissed") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function demandStatusBadge(status: VentureDemandCalibrationStatus) {
  if (status === "passed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "failed") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "inconclusive") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function demandDriftBadge(status: VentureDemandDriftStatus) {
  if (status === "confirmed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "overestimated") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "underestimated") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "mixed") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function predictionAlignmentBadge(alignment: VenturePredictionAlignment) {
  if (alignment === "confirmed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (alignment === "surprised") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (alignment === "uncertain") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function pricingStatusBadge(status: VenturePricingCalibrationStatus) {
  if (status === "validated") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "rejected") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "weak") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "inconclusive") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function interviewSentimentBadge(sentiment: VentureInterviewSentiment) {
  if (sentiment === "positive") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (sentiment === "negative") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function outreachStatusBadge(status: VentureOutreachApprovalStatus) {
  if (status === "approved" || status === "completed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "manual-contact-planned") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "dismissed") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function outreachCampaignStatusBadge(status: VentureOutreachCampaignStatus) {
  if (status === "ready" || status === "recorded") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-approval") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function outreachStatusLabel(status: VentureOutreachApprovalStatus) {
  return VENTURE_OUTREACH_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function riskSeverityBadge(severity: VentureRiskSeverity) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function riskStatusBadge(status: VentureRiskStatus) {
  if (status === "resolved") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "mitigating") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "accepted") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  if (status === "monitoring") return "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function riskStatusLabel(status: VentureRiskStatus) {
  return VENTURE_RISK_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function atlasValidationResultOutcomeBadge(outcome: VentureAtlasValidationResultOutcome) {
  if (outcome === "passed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (outcome === "failed") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (outcome === "pivot") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function AtlasValidationResultLedgerPanel({ items }: { items: VentureAtlasValidationResultLedgerItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Atlas validation result ledger"
      className="rounded-lg border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900/70 dark:bg-violet-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-violet-700 dark:text-violet-300" />
        <h2 className="text-sm font-semibold text-violet-950 dark:text-violet-100">Atlas validation result ledger</h2>
        <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
          {items.length} result{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
          Manual demand proof
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
          Updates demand drift
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Saved validation results convert approval-gated atlas packs into operator-entered demand evidence. They preserve buyer counts, paid-pricing signals, quotes, objections, learning, and no-external-side-effect proof so the demand-drift report can move from planned validation to recorded reality.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-violet-200 bg-white/75 p-3 dark:border-violet-900/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={atlasValidationResultOutcomeBadge(item.outcome)}>
                {item.outcome}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Drift {item.demandDriftScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
                {item.qualifiedBuyerCount} buyers
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
                {item.paidPricingSignalCount} paid signals
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.atlasItemTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-violet-800 dark:text-violet-200">
              Manual result: {item.statusSummary}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              Quote: {item.strongestQuote}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Learning: {item.learning}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Demand drift update: {item.demandDriftUpdate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function productBuildCommandStatusBadge(status: VentureProductBuildCommandStatus) {
  if (status === "verified") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "ready") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function ProductBuildCommandQueuePanel({ commands }: { commands: VentureProductBuildCommand[] }) {
  if (commands.length === 0) return null;

  const hasValidationBackedBuild = commands.some((command) => command.sourceType === "validation-result");

  return (
    <div
      aria-label="Product build command queue"
      className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Code2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Product build command queue</h2>
        <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
          {commands.length} command{commands.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
          No fake source boundary
        </Badge>
        {hasValidationBackedBuild && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            Validation-backed build
          </Badge>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Commands convert handoffs, scaffolds, MVP workspaces, verifier proofs, release-quality artifacts, roadmap tasks, and deployment blockers into buildable product work with artifact targets and proof requirements.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {commands.slice(0, 8).map((command) => (
          <div key={command.id} className="rounded-md border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={productBuildCommandStatusBadge(command.status)}>
                {command.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                {command.priority}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {command.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{command.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Command: {command.buildCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Target: {command.artifactTarget}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">Proof: {command.proofRequired}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">Boundary: {command.noFakeSourceBoundary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemandSourceBlockerPacketInbox({
  packets,
  auditHistory,
  ownerQueue,
  ownerWorkloadSummary,
  workloadDriftReports,
  workloadDriftReconciliation,
  workloadPinnedSummaries,
  handoffHealth,
  handoffRemediationQueue,
  handoffReopenEscalations,
  handoffReopenEscalationSlaReceipts,
  handoffReopenEscalationSlaResolutions,
  handoffReopenEscalationSlaBreachTrends,
  handoffReopenEscalationSlaBreachProcessPlans,
  handoffReopenEscalationSlaBreachProcessClosures,
  handoffReopenEscalationSlaBreachProcessRegressions,
  handoffReopenEscalationSlaBreachProcessRegressionClosures,
  handoffReopenEscalationSlaBreachProcessRegressionEscalations,
  regressionEscalationAuditAssignments,
  regressionEscalationAuditClosures,
  regressionEscalationAuditReviews,
  regressionEscalationAuditAppeals,
  onReplayPacket,
  onMarkPacketTriage,
  onMarkWorkloadDriftReviewed,
  onPinCurrentWorkload,
  onClearWorkloadDriftReview,
  onMarkHandoffRemediationPlanned,
  onCloseHandoffRemediation,
  onAssignHandoffReopenEscalationSla,
  onResolveHandoffReopenEscalationSla,
  onPlanHandoffReopenEscalationSlaBreachProcess,
  onCloseHandoffReopenEscalationSlaBreachProcess,
  onCloseHandoffReopenEscalationSlaBreachProcessRegression,
  onAssignRegressionEscalationAudit,
  onCloseRegressionEscalationAudit,
  onReviewRegressionEscalationAudit,
  onRecordRegressionEscalationAuditAppeal,
}: {
  packets: DemandSourceBlockerSavedViewPacket[];
  auditHistory: DemandSourceBlockerPacketTriageAuditEntry[];
  ownerQueue: DemandSourceBlockerPacketTriageOwnerQueueItem[];
  ownerWorkloadSummary: DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem[];
  workloadDriftReports: DemandSourceBlockerPacketTriageWorkloadDriftReport[];
  workloadDriftReconciliation: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[];
  workloadPinnedSummaries: DemandSourceBlockerPacketTriageWorkloadPinnedSummary[];
  handoffHealth: DemandSourceBlockerPacketHandoffHealthItem[];
  handoffRemediationQueue: DemandSourceBlockerPacketHandoffRemediationItem[];
  handoffReopenEscalations: DemandSourceBlockerPacketHandoffReopenEscalationItem[];
  handoffReopenEscalationSlaReceipts: DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt[];
  handoffReopenEscalationSlaResolutions: DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt[];
  handoffReopenEscalationSlaBreachTrends: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem[];
  handoffReopenEscalationSlaBreachProcessPlans: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan[];
  handoffReopenEscalationSlaBreachProcessClosures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt[];
  handoffReopenEscalationSlaBreachProcessRegressions: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression[];
  handoffReopenEscalationSlaBreachProcessRegressionClosures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[];
  handoffReopenEscalationSlaBreachProcessRegressionEscalations: BreachProcessRegressionEscalation[];
  regressionEscalationAuditAssignments: BreachProcessRegressionEscalationAuditAssignment[];
  regressionEscalationAuditClosures: BreachProcessRegressionEscalationAuditClosure[];
  regressionEscalationAuditReviews: BreachProcessRegressionEscalationAuditReview[];
  regressionEscalationAuditAppeals: BreachProcessRegressionEscalationAuditAppeal[];
  onReplayPacket: (packet: DemandSourceBlockerSavedViewPacket) => void;
  onMarkPacketTriage: (packet: DemandSourceBlockerSavedViewPacket, status: DemandSourceBlockerPacketTriageStatus) => void;
  onMarkWorkloadDriftReviewed: (report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => void;
  onPinCurrentWorkload: (report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => void;
  onClearWorkloadDriftReview: (report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => void;
  onMarkHandoffRemediationPlanned: (item: DemandSourceBlockerPacketHandoffRemediationItem) => void;
  onCloseHandoffRemediation: (item: DemandSourceBlockerPacketHandoffRemediationItem, proofSummary: string, proofArtifact: string) => boolean;
  onAssignHandoffReopenEscalationSla: (item: DemandSourceBlockerPacketHandoffReopenEscalationItem) => void;
  onResolveHandoffReopenEscalationSla: (receipt: DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt, proofSummary: string, proofArtifact: string) => boolean;
  onPlanHandoffReopenEscalationSlaBreachProcess: (item: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem) => void;
  onCloseHandoffReopenEscalationSlaBreachProcess: (plan: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan, proofSummary: string, proofArtifact: string) => boolean;
  onCloseHandoffReopenEscalationSlaBreachProcessRegression: (regression: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression, proofSummary: string, proofArtifact: string) => boolean;
  onAssignRegressionEscalationAudit: (escalation: BreachProcessRegressionEscalation) => void;
  onCloseRegressionEscalationAudit: (
    escalation: BreachProcessRegressionEscalation,
    assignment: BreachProcessRegressionEscalationAuditAssignment,
    proofSummary: string,
    proofArtifact: string,
  ) => boolean;
  onReviewRegressionEscalationAudit: (
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    outcome: BreachProcessRegressionEscalationAuditReviewOutcome,
    reviewer: string,
    reviewSummary: string,
    reviewArtifact: string,
  ) => boolean;
  onRecordRegressionEscalationAuditAppeal: (
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    latestDispute: BreachProcessRegressionEscalationAuditReview,
    status: BreachProcessRegressionEscalationAuditAppealStatus,
    staleDisputeAgeDays: number,
    reviewerQuorumCount: number,
    independentReviewerCount: number,
    latestCorrectiveReviewId: string | null,
    conflictingReviewIds: string[],
    reviewerIdentities: string[],
    appealSummary: string,
    appealArtifact: string,
    clearanceBaselineReceiptIds: string[],
    reopenedAfterClearanceReceiptIds: string[],
    priorClearanceAppealId: string | null,
    staleClearanceAgeDays: number,
    fragileRemediationOwner: string | null,
    fragileEscalationArtifact: string | null,
    reviewerRotationProof: string | null,
    rotatedReviewerIdentities: string[],
    staleGovernanceContext?: RegressionEscalationAuditStaleGovernanceContext,
  ) => boolean;
}) {
  const [triageFilter, setTriageFilter] = useState<DemandSourceBlockerPacketTriageInboxFilter>("all");
  const [ownerSourceFilter, setOwnerSourceFilter] = useState("all");
  const [driftFilter, setDriftFilter] = useState<"all" | "unresolved">("all");
  const [remediationClosureDrafts, setRemediationClosureDrafts] = useState<Record<string, { proofSummary: string; proofArtifact: string }>>({});
  const [reopenSlaResolutionDrafts, setReopenSlaResolutionDrafts] = useState<Record<string, { proofSummary: string; proofArtifact: string }>>({});
  const [breachProcessClosureDrafts, setBreachProcessClosureDrafts] = useState<Record<string, { proofSummary: string; proofArtifact: string }>>({});
  const [breachProcessRegressionClosureDrafts, setBreachProcessRegressionClosureDrafts] = useState<Record<string, { proofSummary: string; proofArtifact: string }>>({});
  const {
    regressionEscalationAuditDrafts,
    regressionEscalationAuditReviewDrafts,
    regressionEscalationAuditAppealDrafts,
    updateRegressionEscalationAuditDraft,
    submitRegressionEscalationAuditClosure,
    updateRegressionEscalationAuditReviewDraft,
    submitRegressionEscalationAuditReview,
    updateRegressionEscalationAuditAppealDraft,
    submitRegressionEscalationAuditAppeal,
  } = useRegressionEscalationAuditDrafts({
    onCloseRegressionEscalationAudit,
    onReviewRegressionEscalationAudit,
    onRecordRegressionEscalationAuditAppeal,
  });

  const updateRemediationClosureDraft = (
    itemId: string,
    patch: Partial<{ proofSummary: string; proofArtifact: string }>,
  ) => {
    setRemediationClosureDrafts((current) => ({
      ...current,
      [itemId]: {
        proofSummary: "",
        proofArtifact: "",
        ...(current[itemId] ?? {}),
        ...patch,
      },
    }));
  };

  const submitRemediationClosure = (item: DemandSourceBlockerPacketHandoffRemediationItem) => {
    const draft = remediationClosureDrafts[item.id] ?? { proofSummary: "", proofArtifact: "" };
    const saved = onCloseHandoffRemediation(item, draft.proofSummary, draft.proofArtifact);
    if (saved) {
      setRemediationClosureDrafts((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
    }
  };

  const updateReopenSlaResolutionDraft = (
    receiptId: string,
    patch: Partial<{ proofSummary: string; proofArtifact: string }>,
  ) => {
    setReopenSlaResolutionDrafts((current) => ({
      ...current,
      [receiptId]: {
        proofSummary: "",
        proofArtifact: "",
        ...(current[receiptId] ?? {}),
        ...patch,
      },
    }));
  };

  const submitReopenSlaResolution = (receipt: DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt) => {
    const draft = reopenSlaResolutionDrafts[receipt.id] ?? { proofSummary: "", proofArtifact: "" };
    const saved = onResolveHandoffReopenEscalationSla(receipt, draft.proofSummary, draft.proofArtifact);
    if (saved) {
      setReopenSlaResolutionDrafts((current) => {
        const next = { ...current };
        delete next[receipt.id];
        return next;
      });
    }
  };

  const updateBreachProcessClosureDraft = (
    planId: string,
    patch: Partial<{ proofSummary: string; proofArtifact: string }>,
  ) => {
    setBreachProcessClosureDrafts((current) => ({
      ...current,
      [planId]: {
        proofSummary: "",
        proofArtifact: "",
        ...(current[planId] ?? {}),
        ...patch,
      },
    }));
  };

  const submitBreachProcessClosure = (plan: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan) => {
    const draft = breachProcessClosureDrafts[plan.id] ?? { proofSummary: "", proofArtifact: "" };
    const saved = onCloseHandoffReopenEscalationSlaBreachProcess(plan, draft.proofSummary, draft.proofArtifact);
    if (saved) {
      setBreachProcessClosureDrafts((current) => {
        const next = { ...current };
        delete next[plan.id];
        return next;
      });
    }
  };

  const updateBreachProcessRegressionClosureDraft = (
    regressionId: string,
    patch: Partial<{ proofSummary: string; proofArtifact: string }>,
  ) => {
    setBreachProcessRegressionClosureDrafts((current) => ({
      ...current,
      [regressionId]: {
        proofSummary: "",
        proofArtifact: "",
        ...(current[regressionId] ?? {}),
        ...patch,
      },
    }));
  };

  const submitBreachProcessRegressionClosure = (regression: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression) => {
    const draft = breachProcessRegressionClosureDrafts[regression.id] ?? { proofSummary: "", proofArtifact: "" };
    const saved = onCloseHandoffReopenEscalationSlaBreachProcessRegression(regression, draft.proofSummary, draft.proofArtifact);
    if (saved) {
      setBreachProcessRegressionClosureDrafts((current) => {
        const next = { ...current };
        delete next[regression.id];
        return next;
      });
    }
  };

  if (packets.length === 0) return null;

  const packetsWithoutMatches = packets.filter((packet) => packet.currentMatchCount === 0).length;
  const packetsWithoutEvidence = packets.filter((packet) => packet.evidence.length === 0).length;
  const untriagedCount = packets.filter((packet) => !packet.triageStatus).length;
  const acknowledgedCount = packets.filter((packet) => packet.triageStatus === "acknowledged").length;
  const needsEvidenceCount = packets.filter((packet) => packet.triageStatus === "needs-evidence").length;
  const delegatedCount = packets.filter((packet) => packet.triageStatus === "delegated").length;
  const auditEntriesByPacketKey = new Map<string, DemandSourceBlockerPacketTriageAuditEntry[]>();
  auditHistory.forEach((entry) => {
    const key = demandSourceBlockerPacketTriagePacketKey({
      savedViewId: entry.savedViewId,
      name: entry.savedViewName,
      sourceType: entry.sourceType,
    });
    auditEntriesByPacketKey.set(key, [
      entry,
      ...(auditEntriesByPacketKey.get(key) ?? []),
    ].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)));
  });
  const filteredPackets = triageFilter === "all"
    ? packets
    : packets.filter((packet) => packet.triageStatus === triageFilter);
  const filteredOwnerQueue = triageFilter === "all"
    ? ownerQueue
    : ownerQueue.filter((item) => item.triageStatus === triageFilter);
  const ownerSourceFilteredQueue = ownerSourceFilter === "all"
    ? filteredOwnerQueue
    : filteredOwnerQueue.filter((item) => `${item.owner}::${item.sourceType}` === ownerSourceFilter);
  const ownerSourceQueuePacketIds = new Set(ownerSourceFilteredQueue.map((item) => item.packetId));
  const ownerSourceFilteredPackets = ownerSourceFilter === "all"
    ? filteredPackets
    : filteredPackets.filter((packet) => ownerSourceQueuePacketIds.has(packet.id));
  const workloadDriftWarnings = workloadDriftReports.filter((report) => report.status !== "matching");
  const latestReconciliationBySnapshot = getLatestDemandSourceBlockerPacketTriageWorkloadReconciliationBySnapshot(workloadDriftReconciliation);
  const pinnedSummaryByGroup = getDemandSourceBlockerPacketTriageWorkloadPinnedSummariesByGroup(workloadPinnedSummaries);
  const unresolvedWorkloadDriftWarnings = workloadDriftWarnings.filter((report) => {
    const latestReconciliation = latestReconciliationBySnapshot.get(demandSourceBlockerPacketTriageWorkloadDriftSnapshotKey(report));
    const pinnedSummary = pinnedSummaryByGroup.get(`${report.owner}::${report.sourceType}`);
    return latestReconciliation?.action !== "reviewed" && latestReconciliation?.action !== "pinned-current" && Boolean(!pinnedSummary);
  });
  const visibleWorkloadDriftReports = driftFilter === "unresolved"
    ? unresolvedWorkloadDriftWarnings
    : workloadDriftReports;
  const handoffHealthUnresolvedCount = handoffHealth.reduce((total, item) => total + item.unresolvedDriftCount, 0);
  const handoffHealthRepeatedCount = handoffHealth.reduce((total, item) => total + item.repeatedDriftCount, 0);
  const handoffHealthPinnedCount = handoffHealth.reduce((total, item) => total + item.pinnedSummaryCount, 0);
  const latestReopenEscalationSlaByEscalationId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt>();
  handoffReopenEscalationSlaReceipts.forEach((receipt) => {
    const current = latestReopenEscalationSlaByEscalationId.get(receipt.escalationId);
    if (!current || receipt.assignedAt.localeCompare(current.assignedAt) > 0) {
      latestReopenEscalationSlaByEscalationId.set(receipt.escalationId, receipt);
    }
  });
  const latestReopenEscalationSlaResolutionByReceiptId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt>();
  handoffReopenEscalationSlaResolutions.forEach((receipt) => {
    const current = latestReopenEscalationSlaResolutionByReceiptId.get(receipt.slaReceiptId);
    if (!current || receipt.resolvedAt.localeCompare(current.resolvedAt) > 0) {
      latestReopenEscalationSlaResolutionByReceiptId.set(receipt.slaReceiptId, receipt);
    }
  });
  const nowMs = Date.now();
  const openReopenEscalationSlaReceipts = handoffReopenEscalationSlaReceipts.filter((receipt) => !latestReopenEscalationSlaResolutionByReceiptId.has(receipt.id));
  const overdueReopenEscalationSlaCount = openReopenEscalationSlaReceipts.filter((receipt) => Date.parse(receipt.dueAt) < nowMs).length;
  const breachedReopenEscalationSlaResolutionCount = handoffReopenEscalationSlaResolutions.filter((receipt) => receipt.wasOverdue).length;
  const breachedReopenEscalationSlaTrendResolutionCount = handoffReopenEscalationSlaBreachTrends.reduce((total, item) => total + item.breachCount, 0);
  const criticalReopenEscalationSlaBreachTrendCount = handoffReopenEscalationSlaBreachTrends.filter((item) => item.severity === "critical").length;
  const latestBreachProcessPlanByTrendId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan>();
  handoffReopenEscalationSlaBreachProcessPlans.forEach((plan) => {
    const current = latestBreachProcessPlanByTrendId.get(plan.trendId);
    if (!current || plan.plannedAt.localeCompare(current.plannedAt) > 0) {
      latestBreachProcessPlanByTrendId.set(plan.trendId, plan);
    }
  });
  const latestBreachProcessClosureByPlanId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt>();
  handoffReopenEscalationSlaBreachProcessClosures.forEach((closure) => {
    const current = latestBreachProcessClosureByPlanId.get(closure.planId);
    if (!current || closure.closedAt.localeCompare(current.closedAt) > 0) {
      latestBreachProcessClosureByPlanId.set(closure.planId, closure);
    }
  });
  const breachProcessRegressionByPlanId = new Map(handoffReopenEscalationSlaBreachProcessRegressions.map((regression) => [regression.planId, regression]));
  const breachProcessRegressionClosuresByRegressionId = new Map<string, DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[]>();
  handoffReopenEscalationSlaBreachProcessRegressionClosures.forEach((closure) => {
    breachProcessRegressionClosuresByRegressionId.set(closure.regressionId, [
      closure,
      ...(breachProcessRegressionClosuresByRegressionId.get(closure.regressionId) ?? []),
    ].sort((a, b) => b.closedAt.localeCompare(a.closedAt)));
  });
  const breachProcessRegressionEscalationByRegressionId = new Map(handoffReopenEscalationSlaBreachProcessRegressionEscalations.map((item) => [item.regressionId, item]));
  const regressionEscalationAuditAssignmentsByEscalationId = new Map<string, BreachProcessRegressionEscalationAuditAssignment[]>();
  regressionEscalationAuditAssignments.forEach((assignment) => {
    regressionEscalationAuditAssignmentsByEscalationId.set(assignment.escalationId, [
      assignment,
      ...(regressionEscalationAuditAssignmentsByEscalationId.get(assignment.escalationId) ?? []),
    ].sort((a, b) => b.assignedAt.localeCompare(a.assignedAt)));
  });
  const regressionEscalationAuditClosuresByEscalationId = new Map<string, BreachProcessRegressionEscalationAuditClosure[]>();
  regressionEscalationAuditClosures.forEach((closure) => {
    regressionEscalationAuditClosuresByEscalationId.set(closure.escalationId, [
      closure,
      ...(regressionEscalationAuditClosuresByEscalationId.get(closure.escalationId) ?? []),
    ].sort((a, b) => b.closedAt.localeCompare(a.closedAt)));
  });
  const regressionEscalationAuditReviewsByEscalationId = new Map<string, BreachProcessRegressionEscalationAuditReview[]>();
  regressionEscalationAuditReviews.forEach((review) => {
    regressionEscalationAuditReviewsByEscalationId.set(review.escalationId, [
      review,
      ...(regressionEscalationAuditReviewsByEscalationId.get(review.escalationId) ?? []),
    ].sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt)));
  });
  const regressionEscalationAuditAppealsByEscalationId = new Map<string, BreachProcessRegressionEscalationAuditAppeal[]>();
  regressionEscalationAuditAppeals.forEach((appeal) => {
    regressionEscalationAuditAppealsByEscalationId.set(appeal.escalationId, [
      appeal,
      ...(regressionEscalationAuditAppealsByEscalationId.get(appeal.escalationId) ?? []),
    ].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)));
  });
  const handoffHealthStatusLabels: Record<DemandSourceBlockerPacketHandoffHealthStatus, string> = {
    clear: "Clear",
    reconciled: "Reconciled",
    "unresolved-drift": "Unresolved drift",
    "reconciled-churn": "Reconciled churn",
    "repeated-drift-churn": "Repeated drift churn",
  };
  const handoffHealthStatusBadge = (status: DemandSourceBlockerPacketHandoffHealthStatus) => {
    if (status === "clear" || status === "reconciled") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    if (status === "reconciled-churn") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    if (status === "repeated-drift-churn") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  };

  return (
    <div
      aria-label="Demand source blocker packet inbox"
      className="rounded-lg border border-orange-200 bg-orange-50/70 p-4 dark:border-orange-900/70 dark:bg-orange-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardList className="h-4 w-4 text-orange-700 dark:text-orange-300" />
        <h2 className="text-sm font-semibold text-orange-950 dark:text-orange-100">Demand source blocker packet inbox</h2>
        <Badge variant="secondary" className="bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200">
          {packets.length} packet{packets.length === 1 ? "" : "s"}
        </Badge>
        {packetsWithoutMatches > 0 && (
          <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {packetsWithoutMatches} stale
          </Badge>
        )}
        {packetsWithoutEvidence > 0 && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {packetsWithoutEvidence} missing evidence
          </Badge>
        )}
        <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          {untriagedCount} untriaged
        </Badge>
        {acknowledgedCount > 0 && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {acknowledgedCount} acknowledged
          </Badge>
        )}
        {needsEvidenceCount > 0 && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {needsEvidenceCount} needs evidence
          </Badge>
        )}
        {delegatedCount > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {delegatedCount} delegated
          </Badge>
        )}
        {auditHistory.length > 0 && (
          <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
            {auditHistory.length} triage audit {auditHistory.length === 1 ? "entry" : "entries"}
          </Badge>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Saved blocker-source views become handoff packets here, with replayable search, current match counts, freshness timestamps, and warnings before another operator opens the full export.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Demand source blocker packet inbox filters">
        <Button
          type="button"
          size="sm"
          variant={triageFilter === "all" ? "default" : "outline"}
          className="h-7 px-2 text-[11px]"
          onClick={() => setTriageFilter("all")}
        >
          Show all blocker packets
        </Button>
        <Button
          type="button"
          size="sm"
          variant={triageFilter === "needs-evidence" ? "default" : "outline"}
          className="h-7 px-2 text-[11px]"
          onClick={() => setTriageFilter("needs-evidence")}
        >
          Show needs-evidence blocker packets
        </Button>
        <Button
          type="button"
          size="sm"
          variant={triageFilter === "delegated" ? "default" : "outline"}
          className="h-7 px-2 text-[11px]"
          onClick={() => setTriageFilter("delegated")}
        >
          Show delegated blocker packets
        </Button>
      </div>
      {handoffHealth.length > 0 && (
        <div aria-label="Demand source blocker packet handoff health" className="mt-3 rounded-md border border-cyan-200 bg-white/80 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-300" />
            <p className="text-[11px] font-semibold text-cyan-900 dark:text-cyan-100">Portfolio handoff health</p>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              {handoffHealth.length} owner/source health {handoffHealth.length === 1 ? "group" : "groups"}
            </Badge>
            <Badge variant="secondary" className={handoffHealthUnresolvedCount > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
              {handoffHealthUnresolvedCount} unresolved drift
            </Badge>
            <Badge variant="secondary" className={handoffHealthRepeatedCount > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
              {handoffHealthRepeatedCount} repeated drift {handoffHealthRepeatedCount === 1 ? "event" : "events"}
            </Badge>
            {handoffHealthPinnedCount > 0 && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {handoffHealthPinnedCount} pinned {handoffHealthPinnedCount === 1 ? "summary" : "summaries"}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Health groups roll imported workload drift, reconciliation actions, pinned summaries, and repeated drift snapshots into a lead-level transfer check before a portfolio handoff is trusted.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {handoffHealth.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-md border border-cyan-100 bg-cyan-50/60 p-2 dark:border-cyan-900/60 dark:bg-cyan-950/20">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className={handoffHealthStatusBadge(item.status)}>
                    {handoffHealthStatusLabels[item.status]}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                    {item.owner}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                    {item.sourceType}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                    {item.totalDriftSnapshots} drift snapshot{item.totalDriftSnapshots === 1 ? "" : "s"}
                  </Badge>
                  <Badge variant="secondary" className={item.repeatedDriftCount > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
                    {item.repeatedDriftCount} repeated drift {item.repeatedDriftCount === 1 ? "event" : "events"}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{item.summary}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-cyan-900 dark:text-cyan-100">
                  Latest drift: {item.latestDriftAt ?? "none"} · Latest review: {item.latestReviewAt ?? "none"} · Review age: {item.staleReviewAgeHours === null ? "none" : `${item.staleReviewAgeHours}h`}
                </p>
                {item.latestPinnedAt && (
                  <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200">
                    Latest pinned authoritative summary: {item.latestPinnedAt}
                  </p>
                )}
                {item.statusBreakdown.length > 0 && (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Drift status mix: {item.statusBreakdown.join(", ")}
                  </p>
                )}
                <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
                  Next: {item.nextAction}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-cyan-900 dark:text-cyan-100">Search anchor: {item.searchAnchor}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {handoffRemediationQueue.length > 0 && (
        <div
          aria-label="Demand source blocker packet handoff remediation queue"
          className="mt-3 rounded-md border border-rose-200 bg-white/80 p-2 dark:border-rose-900/70 dark:bg-slate-950/60"
        >
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardList className="h-3.5 w-3.5 text-rose-700 dark:text-rose-300" />
            <p className="text-[11px] font-semibold text-rose-900 dark:text-rose-100">Handoff remediation queue</p>
            <Badge variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {handoffRemediationQueue.length} remediation {handoffRemediationQueue.length === 1 ? "item" : "items"}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
              {handoffRemediationQueue.filter((item) => item.status === "ready").length} ready
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {handoffRemediationQueue.filter((item) => item.status === "planned").length} planned
            </Badge>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              {handoffRemediationQueue.filter((item) => item.status === "proof-closed").length} proof-closed
            </Badge>
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {handoffRemediationQueue.filter((item) => item.priority === "critical").length} critical
            </Badge>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Lead-owned remediation items are derived from handoff health: repeated-drift, unresolved-drift, and stale-review owner/source groups need a planned next step with proof before the next portfolio transfer is trusted.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {handoffRemediationQueue.slice(0, 6).map((item) => {
              const closureDraft = remediationClosureDrafts[item.id] ?? { proofSummary: "", proofArtifact: "" };
              return (
              <div key={item.id} className="rounded-md border border-rose-100 bg-rose-50/60 p-2 dark:border-rose-900/60 dark:bg-rose-950/20">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className={item.priority === "critical" ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : item.priority === "high" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"}>
                    {item.priority}
                  </Badge>
                  <Badge variant="secondary" className={item.status === "proof-closed" ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300" : item.status === "planned" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"}>
                    {item.status}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
                    {item.trigger.replace(/-/g, " ")}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                    {item.assignedOwner}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                    {item.sourceType}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                    Churn {item.churnScore}/100
                  </Badge>
                  {item.reopenedAfterClosure && (
                    <Badge
                      aria-label="Re-opened handoff remediation"
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                    >
                      Re-opened after {item.closureCount ?? 0} closure {(item.closureCount ?? 0) === 1 ? "receipt" : "receipts"}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{item.summary}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-rose-900 dark:text-rose-100">Proof required: {item.proofRequired}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">Next action: {item.nextAction}</p>
                {item.evidence.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.evidence.slice(0, 4).map((line, index) => (
                      <li key={`${item.id}-evidence-${index}`}>{line}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-1 text-[11px] leading-relaxed text-rose-900 dark:text-rose-100">Search anchor: {item.searchAnchor}</p>
                {item.status === "planned" && item.plannedAt && (
                  <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200">
                    Planned by {item.plannedBy ?? "unknown"} at {item.plannedAt} ({item.planCount} plan {item.planCount === 1 ? "entry" : "entries"})
                  </p>
                )}
                {item.status === "proof-closed" && item.closedAt && (
                  <div className="mt-1 rounded border border-cyan-200 bg-cyan-50/70 p-2 dark:border-cyan-900/60 dark:bg-cyan-950/20">
                    <p className="text-[11px] leading-relaxed text-cyan-900 dark:text-cyan-100">
                      Closed by {item.closedBy ?? "unknown"} at {item.closedAt} ({item.closureCount ?? 0} closure {(item.closureCount ?? 0) === 1 ? "receipt" : "receipts"})
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-cyan-900 dark:text-cyan-100">Closure proof: {item.closureProofSummary ?? "none"}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Proof artifact: {item.closureProofArtifact ?? "none"}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Linked drift reports: {(item.linkedDriftReportIds ?? []).length > 0 ? (item.linkedDriftReportIds ?? []).join(", ") : "none"}
                    </p>
                  </div>
                )}
                {item.reopenedAfterClosure && item.closedAt && (
                  <div className="mt-1 rounded border border-orange-200 bg-orange-50/70 p-2 dark:border-orange-900/60 dark:bg-orange-950/20">
                    <p className="text-[11px] leading-relaxed text-orange-900 dark:text-orange-100">
                      Previous closure by {item.closedBy ?? "unknown"} at {item.closedAt} remains attached.
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-orange-900 dark:text-orange-100">
                      Previous closure proof: {item.closureProofSummary ?? "none"}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                      New drift reason: {item.reopenedReason ?? "New drift requires fresh remediation."}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Linked drift reports: {(item.linkedDriftReportIds ?? []).length > 0 ? (item.linkedDriftReportIds ?? []).join(", ") : "none"}
                    </p>
                  </div>
                )}
                {item.status === "planned" && (
                  <div aria-label={`Handoff remediation proof capture ${item.owner} ${item.sourceType}`} className="mt-2 rounded border border-emerald-200 bg-white/80 p-2 dark:border-emerald-900/60 dark:bg-slate-950/70">
                    <Textarea
                      value={closureDraft.proofSummary}
                      onChange={(event) => updateRemediationClosureDraft(item.id, { proofSummary: event.target.value })}
                      placeholder="Remediation proof summary"
                      className="min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
                    />
                    <Input
                      value={closureDraft.proofArtifact}
                      onChange={(event) => updateRemediationClosureDraft(item.id, { proofArtifact: event.target.value })}
                      placeholder="Closure artifact or receipt link"
                      className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="mt-1.5 h-7 px-2 text-[11px]"
                      onClick={() => submitRemediationClosure(item)}
                    >
                      Close remediation with proof {item.owner} {item.sourceType}
                    </Button>
                  </div>
                )}
                {item.status === "ready" && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[11px] text-rose-900 dark:text-rose-100"
                      onClick={() => onMarkHandoffRemediationPlanned(item)}
                    >
                      Mark remediation planned {item.owner} {item.sourceType}
                    </Button>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
      )}
      {handoffReopenEscalations.length > 0 && (
        <div
          aria-label="Demand source blocker packet handoff reopen escalation"
          className="mt-3 rounded-md border border-orange-200 bg-white/80 p-2 dark:border-orange-900/70 dark:bg-slate-950/60"
        >
          <div className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-orange-700 dark:text-orange-300" />
            <p className="text-[11px] font-semibold text-orange-900 dark:text-orange-100">Reopened handoff remediation escalations</p>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
              {handoffReopenEscalations.length} reopen escalation{handoffReopenEscalations.length === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {handoffReopenEscalations.filter((item) => item.severity === "critical").length} critical
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200">
              {handoffReopenEscalations.reduce((total, item) => total + item.failedClosureCount, 0)} failed closure {handoffReopenEscalations.reduce((total, item) => total + item.failedClosureCount, 0) === 1 ? "receipt" : "receipts"}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200">
              {handoffReopenEscalationSlaReceipts.length} assigned SLA {handoffReopenEscalationSlaReceipts.length === 1 ? "receipt" : "receipts"}
            </Badge>
            <Badge variant="secondary" className={overdueReopenEscalationSlaCount > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
              {overdueReopenEscalationSlaCount} overdue SLA{overdueReopenEscalationSlaCount === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              {handoffReopenEscalationSlaResolutions.length} resolved SLA {handoffReopenEscalationSlaResolutions.length === 1 ? "receipt" : "receipts"}
            </Badge>
            <Badge variant="secondary" className={breachedReopenEscalationSlaResolutionCount > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200"}>
              {breachedReopenEscalationSlaResolutionCount} breached history {breachedReopenEscalationSlaResolutionCount === 1 ? "receipt" : "receipts"}
            </Badge>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Reopened remediation escalations identify owner/source groups where prior closure proof did not keep imported handoff drift stable.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {handoffReopenEscalations.slice(0, 4).map((item) => {
              const slaReceipt = latestReopenEscalationSlaByEscalationId.get(item.id);
              const slaResolution = slaReceipt ? latestReopenEscalationSlaResolutionByReceiptId.get(slaReceipt.id) : undefined;
              const slaIsOverdue = slaReceipt ? Date.parse(slaReceipt.dueAt) < nowMs : false;
              const slaResolutionDraft = slaReceipt ? reopenSlaResolutionDrafts[slaReceipt.id] ?? { proofSummary: "", proofArtifact: "" } : null;
              return (
              <div key={item.id} className="rounded-md border border-orange-100 bg-orange-50/60 p-2 dark:border-orange-900/60 dark:bg-orange-950/20">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className={item.severity === "critical" ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"}>
                    {item.severity}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200">
                    {item.owner}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                    {item.sourceType}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                    {item.trigger.replace(/-/g, " ")}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200">
                    {item.reopenedCount} reopened drift {item.reopenedCount === 1 ? "event" : "events"}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200">
                    {item.failedClosureCount} failed closure {item.failedClosureCount === 1 ? "receipt" : "receipts"}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{item.summary}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-orange-900 dark:text-orange-100">Reason: {item.reopenedReason}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Latest reopened drift: {item.latestReopenedAt ?? "none"}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Latest failed closure: {item.latestClosedAt ?? "none"}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-orange-900 dark:text-orange-100">Failed proof: {item.latestProofSummary ?? "none"}</p>
                <ul className="mt-1 list-disc pl-4 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.evidence.slice(0, 4).map((line, index) => (
                    <li key={`${item.id}-evidence-${index}`}>{line}</li>
                  ))}
                </ul>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">Next: {item.nextAction}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-orange-900 dark:text-orange-100">Search anchor: {item.searchAnchor}</p>
                {slaReceipt && slaResolution ? (
                  <div className="mt-2 rounded border border-cyan-200 bg-white/80 p-2 text-[11px] leading-relaxed text-cyan-950 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-100">
                    <Badge variant="secondary" className={slaResolution.wasOverdue ? "mb-1 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "mb-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"}>
                      {slaResolution.wasOverdue ? "resolved overdue SLA" : "resolved SLA"}
                    </Badge>
                    <p>SLA owner: {slaResolution.assignedOwner}</p>
                    <p>SLA due: {slaResolution.dueAt}</p>
                    <p>SLA resolved by {slaResolution.resolvedBy} at {slaResolution.resolvedAt}</p>
                    <p>SLA resolution proof: {slaResolution.proofSummary}</p>
                    <p>Resolution artifact: {slaResolution.proofArtifact}</p>
                  </div>
                ) : slaReceipt ? (
                  <div className="mt-2 rounded border border-orange-200 bg-white/80 p-2 text-[11px] leading-relaxed text-orange-950 dark:border-orange-900/70 dark:bg-slate-950/70 dark:text-orange-100">
                    <Badge variant="secondary" className={slaIsOverdue ? "mb-1 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "mb-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
                      {slaIsOverdue ? "overdue SLA" : "open SLA"}
                    </Badge>
                    <p>SLA owner: {slaReceipt.assignedOwner}</p>
                    <p>SLA due: {slaReceipt.dueAt}</p>
                    <p>SLA assigned by {slaReceipt.assignedBy} at {slaReceipt.assignedAt}</p>
                    <div aria-label={`Reopen escalation SLA proof capture ${slaReceipt.owner} ${slaReceipt.sourceType}`} className="mt-2 rounded border border-cyan-200 bg-white/80 p-2 dark:border-cyan-900/60 dark:bg-slate-950/70">
                      <Textarea
                        value={slaResolutionDraft?.proofSummary ?? ""}
                        onChange={(event) => updateReopenSlaResolutionDraft(slaReceipt.id, { proofSummary: event.target.value })}
                        placeholder="SLA resolution proof summary"
                        className="min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
                      />
                      <Input
                        value={slaResolutionDraft?.proofArtifact ?? ""}
                        onChange={(event) => updateReopenSlaResolutionDraft(slaReceipt.id, { proofArtifact: event.target.value })}
                        placeholder="SLA resolution artifact or receipt link"
                        className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="mt-1.5 h-7 px-2 text-[11px]"
                        onClick={() => submitReopenSlaResolution(slaReceipt)}
                      >
                        Resolve escalation SLA with proof {slaReceipt.owner} {slaReceipt.sourceType}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-2 h-7 px-2 text-[11px] text-orange-900 dark:text-orange-100"
                    onClick={() => onAssignHandoffReopenEscalationSla(item)}
                  >
                    Assign escalation SLA {item.owner} {item.sourceType}
                  </Button>
                )}
              </div>
              );
            })}
          </div>
        </div>
      )}
      {handoffReopenEscalationSlaBreachTrends.length > 0 && (
        <div
          aria-label="Demand source blocker packet handoff reopen SLA breach trends"
          className="mt-3 rounded-md border border-red-200 bg-white/80 p-2 dark:border-red-900/70 dark:bg-slate-950/60"
        >
          <div className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-red-700 dark:text-red-300" />
            <p className="text-[11px] font-semibold text-red-900 dark:text-red-100">Reopen SLA breach trends</p>
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {handoffReopenEscalationSlaBreachTrends.length} breach trend{handoffReopenEscalationSlaBreachTrends.length === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
              {breachedReopenEscalationSlaTrendResolutionCount} breached SLA resolution{breachedReopenEscalationSlaTrendResolutionCount === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className={criticalReopenEscalationSlaBreachTrendCount > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
              {criticalReopenEscalationSlaBreachTrendCount} critical
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
              {handoffReopenEscalationSlaBreachProcessPlans.length} process plan{handoffReopenEscalationSlaBreachProcessPlans.length === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {handoffReopenEscalationSlaBreachProcessClosures.length} process closure{handoffReopenEscalationSlaBreachProcessClosures.length === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className={handoffReopenEscalationSlaBreachProcessRegressions.length > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
              {handoffReopenEscalationSlaBreachProcessRegressions.length} process regression{handoffReopenEscalationSlaBreachProcessRegressions.length === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
              {handoffReopenEscalationSlaBreachProcessRegressionClosures.length} regression re-closure{handoffReopenEscalationSlaBreachProcessRegressionClosures.length === 1 ? "" : "s"}
            </Badge>
            <Badge variant="secondary" className={handoffReopenEscalationSlaBreachProcessRegressionEscalations.length > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
              {handoffReopenEscalationSlaBreachProcessRegressionEscalations.length} regression escalation{handoffReopenEscalationSlaBreachProcessRegressionEscalations.length === 1 ? "" : "s"}
            </Badge>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Reopened handoff SLA resolutions that missed their due dates are grouped by owner and source so recurring process debt stays visible after the receipt is closed.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {handoffReopenEscalationSlaBreachTrends.slice(0, 4).map((item) => {
              const latestPlan = latestBreachProcessPlanByTrendId.get(item.id);
              const latestClosure = latestPlan ? latestBreachProcessClosureByPlanId.get(latestPlan.id) : undefined;
              const regression = latestPlan ? breachProcessRegressionByPlanId.get(latestPlan.id) : undefined;
              const closureDraft = latestPlan ? breachProcessClosureDrafts[latestPlan.id] ?? { proofSummary: "", proofArtifact: "" } : null;
              const regressionClosures = regression ? breachProcessRegressionClosuresByRegressionId.get(regression.id) ?? [] : [];
              const regressionEscalation = regression ? breachProcessRegressionEscalationByRegressionId.get(regression.id) : undefined;
              const regressionEscalationAuditAssignmentsForItem = regressionEscalation
                ? regressionEscalationAuditAssignmentsByEscalationId.get(regressionEscalation.id) ?? []
                : [];
              const regressionEscalationAuditClosuresForItem = regressionEscalation
                ? regressionEscalationAuditClosuresByEscalationId.get(regressionEscalation.id) ?? []
                : [];
              const latestRegressionEscalationAuditClosure = regressionEscalationAuditClosuresForItem[0];
              const regressionEscalationAuditReviewsForItem = regressionEscalation
                ? regressionEscalationAuditReviewsByEscalationId.get(regressionEscalation.id) ?? []
                : [];
              const regressionEscalationAuditAppealsForItem = regressionEscalation
                ? regressionEscalationAuditAppealsByEscalationId.get(regressionEscalation.id) ?? []
                : [];
              const regressionEscalationAuditReviewDraft = latestRegressionEscalationAuditClosure
                ? regressionEscalationAuditReviewDrafts[latestRegressionEscalationAuditClosure.id] ?? EMPTY_REGRESSION_ESCALATION_AUDIT_REVIEW_DRAFT
                : EMPTY_REGRESSION_ESCALATION_AUDIT_REVIEW_DRAFT;
              const regressionEscalationAuditAppealDraft = latestRegressionEscalationAuditClosure
                ? regressionEscalationAuditAppealDrafts[latestRegressionEscalationAuditClosure.id] ?? EMPTY_REGRESSION_ESCALATION_AUDIT_APPEAL_DRAFT
                : EMPTY_REGRESSION_ESCALATION_AUDIT_APPEAL_DRAFT;
              const regressionClosureDraft = regression ? breachProcessRegressionClosureDrafts[regression.id] ?? { proofSummary: "", proofArtifact: "" } : null;
              return (
                <BreachProcessPlanCard
                  key={item.id}
                  item={item}
                  latestPlan={latestPlan}
                  latestClosure={latestClosure}
                  closureDraft={closureDraft ?? { proofSummary: "", proofArtifact: "" }}
                  regression={regression}
                  regressionClosures={regressionClosures}
                  regressionClosureDraft={regressionClosureDraft ?? { proofSummary: "", proofArtifact: "" }}
                  regressionEscalation={regressionEscalation}
                  regressionEscalationAuditAssignments={regressionEscalationAuditAssignmentsForItem}
                  regressionEscalationAuditClosures={regressionEscalationAuditClosuresForItem}
                  regressionEscalationAuditReviews={regressionEscalationAuditReviewsForItem}
                  regressionEscalationAuditAppeals={regressionEscalationAuditAppealsForItem}
                  regressionEscalationAuditDraft={regressionEscalation ? regressionEscalationAuditDrafts[regressionEscalation.id] ?? EMPTY_REGRESSION_ESCALATION_AUDIT_DRAFT : EMPTY_REGRESSION_ESCALATION_AUDIT_DRAFT}
                  regressionEscalationAuditReviewDraft={regressionEscalationAuditReviewDraft}
                  regressionEscalationAuditAppealDraft={regressionEscalationAuditAppealDraft}
                  onCreatePlan={onPlanHandoffReopenEscalationSlaBreachProcess}
                  onBreachProcessClosureDraftChange={updateBreachProcessClosureDraft}
                  onSubmitBreachProcessClosure={submitBreachProcessClosure}
                  onBreachProcessRegressionClosureDraftChange={updateBreachProcessRegressionClosureDraft}
                  onSubmitBreachProcessRegressionClosure={submitBreachProcessRegressionClosure}
                  onAssignRegressionEscalationAudit={onAssignRegressionEscalationAudit}
                  onRegressionEscalationAuditDraftChange={updateRegressionEscalationAuditDraft}
                  onSubmitRegressionEscalationAuditClosure={submitRegressionEscalationAuditClosure}
                  onRegressionEscalationAuditReviewDraftChange={updateRegressionEscalationAuditReviewDraft}
                  onSubmitRegressionEscalationAuditReview={submitRegressionEscalationAuditReview}
                  onRegressionEscalationAuditAppealDraftChange={updateRegressionEscalationAuditAppealDraft}
                  onSubmitRegressionEscalationAuditAppeal={submitRegressionEscalationAuditAppeal}
                />
              );
            })}
          </div>
        </div>
      )}
      <WorkloadDriftPanel
        driftFilter={driftFilter}
        workloadDriftReports={workloadDriftReports}
        workloadDriftWarnings={workloadDriftWarnings}
        unresolvedWorkloadDriftWarnings={unresolvedWorkloadDriftWarnings}
        visibleWorkloadDriftReports={visibleWorkloadDriftReports}
        workloadDriftReconciliation={workloadDriftReconciliation}
        workloadPinnedSummaries={workloadPinnedSummaries}
        latestReconciliationBySnapshot={latestReconciliationBySnapshot}
        pinnedSummaryByGroup={pinnedSummaryByGroup}
        onDriftFilterChange={setDriftFilter}
        onMarkWorkloadDriftReviewed={onMarkWorkloadDriftReviewed}
        onPinCurrentWorkload={onPinCurrentWorkload}
        onClearWorkloadDriftReview={onClearWorkloadDriftReview}
      />
      <OwnerWorkloadSummaryPanel
        ownerWorkloadSummary={ownerWorkloadSummary}
        ownerSourceFilter={ownerSourceFilter}
        onClearOwnerSourceFilter={() => setOwnerSourceFilter("all")}
        onJumpToOwnerWorkload={(owner, sourceType) => {
          setOwnerSourceFilter(`${owner}::${sourceType}`);
          setTriageFilter("all");
        }}
      />
      <OwnerTriageQueuePanel
        ownerQueue={ownerQueue}
        ownerSourceFilteredQueue={ownerSourceFilteredQueue}
        triageLabel={demandSourceBlockerPacketTriageLabel}
      />
      <DemandSourceBlockerPacketTriageQueuePanel
        packets={ownerSourceFilteredPackets}
        auditEntriesByPacketKey={auditEntriesByPacketKey}
        packetKey={demandSourceBlockerPacketTriagePacketKey}
        triageLabel={demandSourceBlockerPacketTriageLabel}
        onReplayPacket={onReplayPacket}
        onMarkPacketTriage={onMarkPacketTriage}
      />
    </div>
  );
}

function marketConfidenceBadge(confidence: VentureMarketModelConfidence) {
  if (confidence === "high") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (confidence === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function founderMemoStatusBadge(status: VentureFounderExecutionMemoStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "pressure-test") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function deploymentEnvironmentStatusBadge(status: "ready" | "needs-proof" | "blocked") {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-proof") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function investorBriefStatusBadge(status: VentureInvestorBriefStatus) {
  if (status === "investable") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "watch") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function financialModelStatusBadge(status: VentureFinancialModelStatus) {
  if (status === "scale-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-proof") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "runway-risk") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function revenueGenerationStatusBadge(status: VentureRevenueGenerationStatus) {
  if (status === "scaling-revenue") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "repeatable-revenue") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "paid-validation") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function generatedAppStatusBadge(status: VentureGeneratedAppHandoffStatus) {
  if (status === "executable") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "repo-attached") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "brief-ready") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function generatedAppProofStatusBadge(status: VentureGeneratedAppVerificationProofStatus) {
  if (status === "verified") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "partial-proof") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function mvpBuildStatusBadge(status: VentureMvpBuildStatus) {
  if (status === "executable") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "repo-attached" || status === "checks-running") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "brief-ready") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function mvpBuildStatusLabel(status: VentureMvpBuildStatus) {
  return VENTURE_MVP_BUILD_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function mvpCheckStatusBadge(status: VentureMvpCheckStatus) {
  if (status === "passed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "failed") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "blocked") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function mvpCheckStatusLabel(status: VentureMvpCheckStatus) {
  return VENTURE_MVP_CHECK_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
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

function moneySignalApprovalLevel(signal: VentureMoneySignalRecord): VentureAutonomyApprovalLevel {
  return signal.approvalLevel ?? (signal.type === "expense" ? "human-approved-spend" : "human-approved-billing-change");
}

function browserResearchStatusBadge(status: VentureBrowserResearchStatus) {
  if (status === "evidence-captured") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "running") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "dismissed") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function browserResearchStatusLabel(status: VentureBrowserResearchStatus) {
  return VENTURE_BROWSER_RESEARCH_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function predictionOutcomeLabel(outcome: VenturePredictionOutcome) {
  if (outcome === "expected-pass") return "expected pass";
  if (outcome === "expected-fail") return "expected fail";
  return "uncertain";
}

function formatPredictionScore(value: number) {
  return `${Math.round(value)}%`;
}

function parseCountDraft(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function parseAmountDraftToCents(value: string) {
  const parsed = Number.parseFloat(value.replace(/[$,]/g, ""));
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100)) : 0;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function decisionLabel(decision: VentureDecisionType) {
  return VENTURE_DECISION_OPTIONS.find((option) => option.value === decision)?.label ?? decision;
}

export function VentureLab() {
  const { currentUser } = usePreferences();
  const { createFollowUpMission, isCreatingFollowUp } = useRecommendationFollowUpMission();
  const { health, error: runtimeHealthError, isLoading: isRuntimeHealthLoading } = useRuntimeHealth();
  const { preflight, error: workerPreflightError, isLoading: isWorkerPreflightLoading } = useWorkerPreflight();
  const [ventures, setVentures] = useState<SavedVentureWorkspace[]>([]);
  const [exportText, setExportText] = useState("");
  const [importDraft, setImportDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [evidenceFilter, setEvidenceFilter] = useState<VentureEvidenceFilter>("all");
  const [deploymentOwnerFilter, setDeploymentOwnerFilter] = useState("all");
  const [deploymentEnvironmentFilter, setDeploymentEnvironmentFilter] = useState<"all" | VentureDeploymentEnvironmentId>("all");
  const [deploymentSlaFilter, setDeploymentSlaFilter] = useState<"all" | VentureDeploymentOwnerSlaStatus>("all");
  const [deploymentStatusFilter, setDeploymentStatusFilter] = useState<"all" | VentureDeploymentOwnerWorkStatus>("all");
  const [deploymentEscalationAuditStatusFilter, setDeploymentEscalationAuditStatusFilter] = useState<"all" | VentureAutonomyAuditStatus>("all");
  const [deploymentEscalationAuditSideEffectFilter, setDeploymentEscalationAuditSideEffectFilter] = useState<"all" | VentureAutonomySideEffect>("all");
  const [deploymentEscalationAuditActorFilter, setDeploymentEscalationAuditActorFilter] = useState("all");
  const [deploymentEscalationAuditSavedViews, setDeploymentEscalationAuditSavedViews] = useState<DeploymentEscalationAuditSavedView[]>([]);
  const [deploymentEscalationAuditViewNameDraft, setDeploymentEscalationAuditViewNameDraft] = useState("");
  const [demandSourceBlockerSavedViews, setDemandSourceBlockerSavedViews] = useState<DemandSourceBlockerSavedView[]>([]);
  const [demandSourceBlockerViewNameDraft, setDemandSourceBlockerViewNameDraft] = useState("");
  const [demandSourceBlockerPacketTriageStates, setDemandSourceBlockerPacketTriageStates] = useState<DemandSourceBlockerPacketTriageState[]>([]);
  const [demandSourceBlockerPacketTriageAuditHistory, setDemandSourceBlockerPacketTriageAuditHistory] = useState<DemandSourceBlockerPacketTriageAuditEntry[]>([]);
  const [demandSourceBlockerPacketTriageWorkloadDriftReports, setDemandSourceBlockerPacketTriageWorkloadDriftReports] = useState<DemandSourceBlockerPacketTriageWorkloadDriftReport[]>([]);
  const [demandSourceBlockerPacketTriageWorkloadDriftReconciliation, setDemandSourceBlockerPacketTriageWorkloadDriftReconciliation] = useState<DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[]>([]);
  const [demandSourceBlockerPacketTriageWorkloadPinnedSummaries, setDemandSourceBlockerPacketTriageWorkloadPinnedSummaries] = useState<DemandSourceBlockerPacketTriageWorkloadPinnedSummary[]>([]);
  const [demandSourceBlockerPacketHandoffRemediationPlans, setDemandSourceBlockerPacketHandoffRemediationPlans] = useState<DemandSourceBlockerPacketHandoffRemediationPlanEntry[]>([]);
  const [demandSourceBlockerPacketHandoffRemediationClosures, setDemandSourceBlockerPacketHandoffRemediationClosures] = useState<DemandSourceBlockerPacketHandoffRemediationClosureReceipt[]>([]);
  const [demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts, setDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts] = useState<DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt[]>([]);
  const [demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions, setDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions] = useState<DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt[]>([]);
  const [demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans, setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans] = useState<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan[]>([]);
  const [demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures, setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures] = useState<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt[]>([]);
  const [demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures, setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures] = useState<DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[]>([]);
  const [breachProcessRegressionEscalationAuditAssignments, setBreachProcessRegressionEscalationAuditAssignments] = useState<BreachProcessRegressionEscalationAuditAssignment[]>([]);
  const [breachProcessRegressionEscalationAuditClosures, setBreachProcessRegressionEscalationAuditClosures] = useState<BreachProcessRegressionEscalationAuditClosure[]>([]);
  const [breachProcessRegressionEscalationAuditReviews, setBreachProcessRegressionEscalationAuditReviews] = useState<BreachProcessRegressionEscalationAuditReview[]>([]);
  const [breachProcessRegressionEscalationAuditAppeals, setBreachProcessRegressionEscalationAuditAppeals] = useState<BreachProcessRegressionEscalationAuditAppeal[]>([]);
  const [deploymentEscalationAuditImportMode, setDeploymentEscalationAuditImportMode] = useState<DeploymentEscalationAuditImportMode>("keep-both");
  const [deploymentEscalationAuditLastImportSummary, setDeploymentEscalationAuditLastImportSummary] = useState<DeploymentEscalationAuditImportSummary | null>(null);
  const [portfolioImportAuditHistory, setPortfolioImportAuditHistory] = useState<PortfolioImportAuditEntry[]>([]);
  const [portfolioImportAuditRestoreSnapshot, setPortfolioImportAuditRestoreSnapshot] = useState<PortfolioImportAuditRestoreSnapshot | null>(null);
  const lastBlockedImportAuditKeyRef = useRef("");
  const [manualThesisDraft, setManualThesisDraft] = useState<ManualVentureThesisInput>(EMPTY_MANUAL_THESIS_DRAFT);
  const [runtimeHealthSnapshot, setRuntimeHealthSnapshot] = useState<RuntimeHealthMemorySnapshot | null>(null);
  const ownerKey = currentUser?.email ?? "anonymous";
  const canCreateManualThesis = Boolean(
    manualThesisDraft.title.trim() &&
    manualThesisDraft.targetBuyer.trim() &&
    manualThesisDraft.painStatement.trim() &&
    manualThesisDraft.productWedge.trim(),
  );

  const refresh = useCallback(() => {
    setVentures(loadVenturePortfolio(ownerKey));
  }, [ownerKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setRuntimeHealthSnapshot(loadRuntimeHealthMemorySnapshot(ownerKey));
  }, [ownerKey]);

  useEffect(() => {
    setDeploymentEscalationAuditSavedViews(loadDeploymentEscalationAuditSavedViews(ownerKey));
    setDemandSourceBlockerSavedViews(loadDemandSourceBlockerSavedViews(ownerKey));
    setDemandSourceBlockerPacketTriageStates(loadDemandSourceBlockerPacketTriageStates(ownerKey));
    setDemandSourceBlockerPacketTriageAuditHistory(loadDemandSourceBlockerPacketTriageAuditHistory(ownerKey));
    setDemandSourceBlockerPacketTriageWorkloadDriftReports(loadDemandSourceBlockerPacketTriageWorkloadDriftReports(ownerKey));
    setDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(loadDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(ownerKey));
    setDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(loadDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(ownerKey));
    setDemandSourceBlockerPacketHandoffRemediationPlans(loadDemandSourceBlockerPacketHandoffRemediationPlans(ownerKey));
    setDemandSourceBlockerPacketHandoffRemediationClosures(loadDemandSourceBlockerPacketHandoffRemediationClosures(ownerKey));
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(loadDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(ownerKey));
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(loadDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(ownerKey));
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(loadDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(ownerKey));
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(loadDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(ownerKey));
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(loadDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(ownerKey));
    setBreachProcessRegressionEscalationAuditAssignments(loadRegressionEscalationAuditAssignments(ownerKey));
    setBreachProcessRegressionEscalationAuditClosures(loadRegressionEscalationAuditClosures(ownerKey));
    setBreachProcessRegressionEscalationAuditReviews(loadRegressionEscalationAuditReviews(ownerKey));
    setBreachProcessRegressionEscalationAuditAppeals(loadRegressionEscalationAuditAppeals(ownerKey));
  }, [ownerKey]);

  useEffect(() => {
    setPortfolioImportAuditHistory(loadPortfolioImportAuditHistory(ownerKey));
    setPortfolioImportAuditRestoreSnapshot(loadPortfolioImportAuditRestoreSnapshot(ownerKey));
    lastBlockedImportAuditKeyRef.current = "";
  }, [ownerKey]);

  useEffect(() => {
    if (isRuntimeHealthLoading || isWorkerPreflightLoading) return;
    const snapshot = buildRuntimeHealthMemorySnapshot({
      health,
      healthError: runtimeHealthError,
      preflight,
      preflightError: workerPreflightError,
    });
    saveRuntimeHealthMemorySnapshot(ownerKey, snapshot);
    setRuntimeHealthSnapshot(snapshot);
  }, [
    health,
    isRuntimeHealthLoading,
    isWorkerPreflightLoading,
    ownerKey,
    preflight,
    runtimeHealthError,
    workerPreflightError,
  ]);

  const updateManualThesisDraft = useCallback((field: keyof ManualVentureThesisInput, value: string) => {
    setManualThesisDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const handleCreateManualVenture = useCallback(() => {
    if (!canCreateManualThesis) {
      toast.error("Complete the required thesis fields");
      return;
    }

    const workspace = buildManualVentureWorkspace(manualThesisDraft);
    saveVentureWorkspace(ownerKey, workspace);
    setVentures(loadVenturePortfolio(ownerKey));
    setManualThesisDraft(EMPTY_MANUAL_THESIS_DRAFT);
    setExportText("");
    toast.success("Venture thesis created");
  }, [canCreateManualThesis, manualThesisDraft, ownerKey]);

  const handleRecordExperiment = useCallback((
    ventureId: string,
    experimentId: string,
    result: string,
    interpretation: string,
  ) => {
    const updated = recordVentureExperimentResult(ownerKey, ventureId, experimentId, {
      result,
      interpretation,
    });
    if (!updated) {
      toast.error("Experiment result could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Experiment result saved");
  }, [ownerKey]);

  const handleRecordPricingSignal = useCallback((
    ventureId: string,
    signal: {
      qualifiedBuyerCount: number;
      paidCommitmentCount: number;
      invoiceRequestCount: number;
      acceptedPrice: string;
      objectionSummary: string;
      evidenceNote: string;
    },
  ) => {
    const updated = recordVenturePricingSignal(ownerKey, ventureId, signal);
    if (!updated) {
      toast.error("Pricing signal could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Pricing signal saved");
  }, [ownerKey]);

  const handleRecordCustomerInterview = useCallback((
    ventureId: string,
    interview: {
      persona: string;
      channel: string;
      painQuote: string;
      willingnessToPay: string;
      objections: string;
      requestedFeatures: string;
      sentiment: VentureInterviewSentiment;
      evidenceNote: string;
    },
  ) => {
    const updated = recordVentureCustomerInterview(ownerKey, ventureId, interview);
    if (!updated) {
      toast.error("Customer interview could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Customer interview saved");
  }, [ownerKey]);

  const handleRecordOutreachApproval = useCallback((
    ventureId: string,
    approval: {
      sourceInterviewId?: string;
      contactPersona: string;
      channel: string;
      messageDraft: string;
      status: VentureOutreachApprovalStatus;
      riskNote: string;
      nextAction: string;
    },
  ) => {
    const updated = recordVentureOutreachApproval(ownerKey, ventureId, {
      ...approval,
      attribution: currentUser?.email ?? ownerKey,
    });
    if (!updated) {
      toast.error("Outreach approval could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Outreach approval saved");
  }, [currentUser?.email, ownerKey]);

  const handleRecordRisk = useCallback((
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
      resolutionEvidence: string;
    },
  ) => {
    const updated = recordVentureRisk(ownerKey, ventureId, risk);
    if (!updated) {
      toast.error("Risk record could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Risk record saved");
  }, [ownerKey]);

  const handleRecordNoSendEmailGateReplyProof = useCallback((
    ventureId: string,
    input: VentureNoSendEmailGateReplyProofInput,
  ) => {
    const updated = recordVentureNoSendEmailGateReplyProof(ownerKey, ventureId, input);
    if (!updated) {
      toast.error("No-send reply proof could not be saved");
      return false;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("No-send reply proof saved");
    return true;
  }, [ownerKey]);

  const handleRecordMvpBuildWorkspace = useCallback((
    ventureId: string,
    build: {
      status: VentureMvpBuildStatus;
      owner: string;
      repoPath: string;
      setupCheck: VentureMvpCheckStatus;
      typecheckCheck: VentureMvpCheckStatus;
      unitTestCheck: VentureMvpCheckStatus;
      buildCheck: VentureMvpCheckStatus;
      browserSmokeCheck: VentureMvpCheckStatus;
      deploymentCheck: VentureMvpCheckStatus;
      verificationNotes: string;
    },
  ) => {
    const updated = recordVentureMvpBuildWorkspace(ownerKey, ventureId, build);
    if (!updated) {
      toast.error("MVP build workspace could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("MVP build workspace saved");
  }, [ownerKey]);

  const handleRecordArtifact = useCallback((
    ventureId: string,
    artifact: {
      artifactType: VentureArtifactType;
      status: VentureArtifactStatus;
      title: string;
      uri: string;
      owner: string;
      verificationCommand: string;
      evidence: string;
      changeSummary: string;
    },
  ) => {
    const updated = recordVentureArtifact(ownerKey, ventureId, artifact);
    if (!updated) {
      toast.error("Artifact record could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Artifact record saved");
  }, [ownerKey]);

  const handleRecordGeneratedAppVerifierReport = useCallback((ventureId: string, rawReport: string) => {
    const updated = recordVentureGeneratedAppVerifierReport(ownerKey, ventureId, rawReport);
    if (!updated) {
      toast.error("Generated app verifier report could not be saved");
      return false;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Generated app verifier report saved");
    return true;
  }, [ownerKey]);

  const handleRecordProductBuildCommandRun = useCallback((
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
  ) => {
    const updated = recordVentureProductBuildCommandRun(ownerKey, ventureId, run);
    if (!updated) {
      toast.error("Product build run proof could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Product build run proof saved");
  }, [ownerKey]);

  const handleRecordMoneySignal = useCallback((
    ventureId: string,
    signal: {
      type: VentureMoneySignalType;
      status: VentureMoneySignalStatus;
      amountCents: number;
      currency: string;
      source: string;
      owner: string;
      evidence: string;
      notes: string;
    },
  ) => {
    const updated = recordVentureMoneySignal(ownerKey, ventureId, signal);
    if (!updated) {
      toast.error("Money signal could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Money signal saved");
  }, [ownerKey]);

  const handleRecordRoadmapTask = useCallback((
    ventureId: string,
    task: {
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
    },
  ) => {
    const updated = recordVentureRoadmapTask(ownerKey, ventureId, task);
    if (!updated) {
      toast.error("Roadmap task could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Roadmap task saved");
  }, [ownerKey]);

  const handleRecordSupportIssue = useCallback((
    ventureId: string,
    issue: {
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
    },
  ) => {
    const updated = recordVentureSupportIssue(ownerKey, ventureId, issue);
    if (!updated) {
      toast.error("Support issue could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Support issue saved");
  }, [ownerKey]);

  const handleRecordDeploymentOwnerWorkItem = useCallback((item: VentureDeploymentOwnerWorkItem) => {
    const sourceRecordId = `${item.ventureId}-deployment-environment-${item.targetId}`;
    const detail = `${item.proofSummary} ${item.approvalBoundary}`;
    const highPriority = item.targetId === "production" || item.targetStatus === "blocked";

    if (item.workType === "roadmap-task") {
      const updated = recordVentureRoadmapTask(ownerKey, item.ventureId, {
        sourceType: "deployment-promotion",
        sourceRecordId,
        title: item.title,
        detail,
        priority: highPriority ? "high" : "medium",
        status: "queued",
        owner: item.owner,
        supportLoad: `Keeps ${item.targetLabel.toLowerCase()} promotion proof from becoming launch or support ambiguity.`,
        riskReduction: item.requiredProof.join(" "),
        nextAction: item.nextAction,
      });
      if (!updated) {
        toast.error("Deployment roadmap task could not be recorded");
        return;
      }
      setVentures(loadVenturePortfolio(ownerKey));
      toast.success("Deployment roadmap task recorded");
      return;
    }

    const updated = recordVentureSupportIssue(ownerKey, item.ventureId, {
      issueType: item.targetId === "production" ? "retention-risk" : "pilot-issue",
      severity: highPriority ? "high" : "medium",
      status: "triaged",
      sourceType: "deployment-promotion",
      sourceRecordId,
      title: item.title,
      detail,
      customerImpact: item.targetId === "production"
        ? "Production users must not be exposed to an environment without proof and human approval."
        : `${item.targetLabel} reviewers need clear proof before trusting this release path.`,
      supportLoad: `Manual operator support would be needed if ${item.targetLabel.toLowerCase()} promotion happens without the required proof.`,
      retentionRisk: item.requiredProof.join(" "),
      owner: item.owner,
      resolution: "No resolution evidence recorded yet.",
      nextAction: item.nextAction,
    });
    if (!updated) {
      toast.error("Deployment support issue could not be recorded");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Deployment support issue recorded");
  }, [ownerKey]);

  const handleAdvanceDeploymentOwnerWorkItem = useCallback((item: VentureDeploymentOwnerWorkItem) => {
    if (!item.recordId) {
      toast.error("Deployment owner work has no recorded item yet");
      return;
    }

    if (item.workType === "roadmap-task") {
      const updated = updateVentureRoadmapTaskStatus(
        ownerKey,
        item.ventureId,
        item.recordId,
        "done",
        `Marked done from Operating Analytics for ${item.targetLabel} deployment proof.`,
      );
      if (!updated) {
        toast.error("Deployment roadmap task could not be updated");
        return;
      }
      setVentures(loadVenturePortfolio(ownerKey));
      toast.success("Deployment roadmap task marked done");
      return;
    }

    const updated = updateVentureSupportIssueStatus(
      ownerKey,
      item.ventureId,
      item.recordId,
      "resolved",
      `Resolved from Operating Analytics for ${item.targetLabel} deployment proof.`,
    );
    if (!updated) {
      toast.error("Deployment support issue could not be updated");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Deployment support issue resolved");
  }, [ownerKey]);

  const handleRecordActivationCohort = useCallback((
    ventureId: string,
    cohort: {
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
    },
  ) => {
    const updated = recordVentureActivationCohort(ownerKey, ventureId, cohort);
    if (!updated) {
      toast.error("Activation cohort could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Activation cohort saved");
  }, [ownerKey]);

  const handleRecordChannelEconomics = useCallback((
    ventureId: string,
    economics: {
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
      owner: string;
      evidence: string;
      nextAction: string;
    },
  ) => {
    const updated = recordVentureChannelEconomics(ownerKey, ventureId, economics);
    if (!updated) {
      toast.error("Channel economics could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Channel economics saved");
  }, [ownerKey]);

  const handleRecordAutonomyAudit = useCallback((
    ventureId: string,
    audit: {
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
    },
  ) => {
    const updated = recordVentureAutonomyAudit(ownerKey, ventureId, audit);
    if (!updated) {
      toast.error("Autonomy audit could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Autonomy audit saved");
  }, [ownerKey]);

  const handleRecordDeploymentEscalationAudit = useCallback((ventureId: string, candidate: VentureAutonomyAuditCandidate) => {
    const updated = recordVentureAutonomyAudit(ownerKey, ventureId, {
      approvalLevel: candidate.approvalLevel,
      status: candidate.status,
      sideEffect: candidate.sideEffect,
      actionType: candidate.actionType,
      actor: candidate.suggestedActor,
      sourceRecordId: candidate.sourceRecordId,
      riskNote: candidate.riskNote,
      replayNote: candidate.replayNote,
      evidence: candidate.evidence,
      nextAction: candidate.nextAction,
    });
    if (!updated) {
      toast.error("Deployment escalation audit could not be recorded");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Deployment escalation audit recorded");
  }, [ownerKey]);

  const handleRecordAgentRun = useCallback((
    ventureId: string,
    run: {
      sourceType: VentureAgentRunSourceType;
      sourceRecordId?: string;
      status: VentureAgentRunStatus;
      model: string;
      prompt: string;
      outputSummary: string;
      inputEvidence: string;
      toolCalls: string;
      tokenEstimate?: number;
      replayCommand: string;
      riskNote: string;
      owner: string;
      nextAction: string;
    },
  ) => {
    const updated = recordVentureAgentRun(ownerKey, ventureId, run);
    if (!updated) {
      toast.error("Agent run could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Agent run saved");
  }, [ownerKey]);

  const handleRecordCompetitor = useCallback((
    ventureId: string,
    competitor: {
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
    },
  ) => {
    const updated = recordVentureCompetitor(ownerKey, ventureId, competitor);
    if (!updated) {
      toast.error("Competitor watch could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Competitor watch saved");
  }, [ownerKey]);

  const handleRecordBrowserResearchTask = useCallback((
    ventureId: string,
    task: {
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
    },
  ) => {
    const updated = recordVentureBrowserResearchTask(ownerKey, ventureId, task);
    if (!updated) {
      toast.error("Browser research task could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Browser research task saved");
  }, [ownerKey]);

  const handleRecordAtlasValidationResult = useCallback((
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
  ) => {
    const updated = recordVentureAtlasValidationResult(ownerKey, ventureId, result);
    if (!updated) {
      toast.error("Atlas validation result could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Atlas validation result saved");
  }, [ownerKey]);

  const handleRecordDecision = useCallback((
    ventureId: string,
    decision: VentureDecisionType,
    nextLifecycleStatus: VentureLifecycleStatus,
    rationale: string,
    nextAction: string,
  ) => {
    const updated = recordVentureDecision(ownerKey, ventureId, {
      decision,
      nextLifecycleStatus,
      rationale,
      nextAction,
    });
    if (!updated) {
      toast.error("Venture decision could not be saved");
      return;
    }
    setVentures(loadVenturePortfolio(ownerKey));
    toast.success("Venture decision saved");
  }, [ownerKey]);

  const handleRecordGapAction = useCallback((
    ventureId: string,
    task: VentureGapActionTask,
    status: VentureGapActionStatus,
    outcome?: string,
    options: { refreshAfterSave?: boolean } = {},
  ) => {
    const updated = recordVentureGapAction(ownerKey, ventureId, task, { status, outcome });
    if (!updated) {
      toast.error("Gap action could not be saved");
      return null;
    }
    if (options.refreshAfterSave ?? true) {
      setVentures(loadVenturePortfolio(ownerKey));
    }
    return updated;
  }, [ownerKey]);

  const handleLaunchGapMission = useCallback(async (ventureId: string, task: VentureGapActionTask) => {
    const requested = handleRecordGapAction(
      ventureId,
      task,
      "launch-requested",
      "Human approved a follow-up research launch from Venture Lab.",
    );
    if (!requested) return;

    await createFollowUpMission(task.prompt);
    recordVentureGapAction(ownerKey, ventureId, task, {
      status: "launched",
      outcome: "Follow-up research mission was launched from the gap action prompt.",
    });
  }, [createFollowUpMission, handleRecordGapAction, ownerKey]);

  const handleRecordGapOutcome = useCallback((ventureId: string, task: VentureGapActionTask, outcome: string) => {
    const updated = handleRecordGapAction(ventureId, task, "completed", outcome);
    if (!updated) return;
    toast.success("Gap outcome saved");
  }, [handleRecordGapAction]);

  const updatePortfolioImportAuditRestoreSnapshot = useCallback((snapshot: PortfolioImportAuditRestoreSnapshot | null) => {
    setPortfolioImportAuditRestoreSnapshot(snapshot);
    persistPortfolioImportAuditRestoreSnapshot(ownerKey, snapshot);
  }, [ownerKey]);

  const handleExport = () => {
    const generatedAt = new Date().toISOString();
    const demandSourceBlockerSavedViewExportPackets = buildDemandSourceBlockerSavedViewPackets(
      demandSourceBlockerSavedViews,
      buildVentureDemandSourceBlockerDrilldowns(ventures),
      generatedAt,
      demandSourceBlockerPacketTriageStates,
    );
    const demandSourceBlockerPacketTriageOwnerQueue = buildDemandSourceBlockerPacketTriageOwnerQueue(
      demandSourceBlockerSavedViewExportPackets,
      demandSourceBlockerPacketTriageAuditHistory,
      ownerKey,
    );
    const demandSourceBlockerPacketTriageOwnerWorkloadSummary = buildDemandSourceBlockerPacketTriageOwnerWorkloadSummary(
      demandSourceBlockerPacketTriageOwnerQueue,
    );
    const demandSourceBlockerPacketHandoffHealth = buildDemandSourceBlockerPacketHandoffHealth(
      demandSourceBlockerPacketTriageWorkloadDriftReports,
      demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
      demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
      generatedAt,
    );
    const demandSourceBlockerPacketHandoffRemediationQueue = buildDemandSourceBlockerPacketHandoffRemediationQueue(
      demandSourceBlockerPacketHandoffHealth,
      demandSourceBlockerPacketHandoffRemediationPlans,
      demandSourceBlockerPacketHandoffRemediationClosures,
    );
    const demandSourceBlockerPacketHandoffReopenEscalations = buildDemandSourceBlockerPacketHandoffReopenEscalations(
      demandSourceBlockerPacketHandoffRemediationQueue,
    );
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends = buildDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends(
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions,
    );
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions = buildDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions(
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
    );
    const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations = buildBreachProcessRegressionEscalations(
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
      new Date(generatedAt),
    ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS);
    const breachProcessRegressionEscalationGovernanceDigests = buildBreachProcessRegressionEscalationGovernanceDigests(
      breachProcessRegressionEscalationAuditAppeals,
      generatedAt,
    );
    setExportText(serializeVenturePortfolio(ventures, {
      deploymentEscalationAuditSavedViews: deploymentEscalationAuditSavedViews,
      deploymentEscalationAuditSavedViewsExportedBy: ownerKey,
      demandSourceBlockerSavedViews,
      demandSourceBlockerSavedViewsExportedBy: ownerKey,
      demandSourceBlockerSavedViewPackets: demandSourceBlockerSavedViewExportPackets,
      demandSourceBlockerSavedViewPacketsExportedBy: ownerKey,
      demandSourceBlockerPacketTriage: demandSourceBlockerPacketTriageStates,
      demandSourceBlockerPacketTriageExportedBy: ownerKey,
      demandSourceBlockerPacketTriageAuditHistory,
      demandSourceBlockerPacketTriageAuditHistoryExportedBy: ownerKey,
      demandSourceBlockerPacketTriageOwnerQueue,
      demandSourceBlockerPacketTriageOwnerQueueExportedBy: ownerKey,
      demandSourceBlockerPacketTriageOwnerWorkloadSummary,
      demandSourceBlockerPacketTriageOwnerWorkloadSummaryExportedBy: ownerKey,
      demandSourceBlockerPacketTriageWorkloadDriftReconciliation: demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
      demandSourceBlockerPacketTriageWorkloadDriftReconciliationExportedBy: ownerKey,
      demandSourceBlockerPacketTriageWorkloadPinnedSummaries: demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
      demandSourceBlockerPacketTriageWorkloadPinnedSummariesExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffHealth,
      demandSourceBlockerPacketHandoffHealthExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffRemediationQueue,
      demandSourceBlockerPacketHandoffRemediationQueueExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffRemediationPlans,
      demandSourceBlockerPacketHandoffRemediationPlansExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffRemediationClosures,
      demandSourceBlockerPacketHandoffRemediationClosuresExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffReopenEscalations,
      demandSourceBlockerPacketHandoffReopenEscalationsExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts,
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions,
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresExportedBy: ownerKey,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsExportedBy: ownerKey,
      breachProcessRegressionClosures: demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
      breachProcessRegressionClosuresExportedBy: ownerKey,
      breachProcessRegressionEscalations: demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations,
      breachProcessRegressionEscalationsExportedBy: ownerKey,
      breachProcessRegressionEscalationAuditAssignments,
      breachProcessRegressionEscalationAuditAssignmentsExportedBy: ownerKey,
      breachProcessRegressionEscalationAuditClosures,
      breachProcessRegressionEscalationAuditClosuresExportedBy: ownerKey,
      breachProcessRegressionEscalationAuditReviews,
      breachProcessRegressionEscalationAuditReviewsExportedBy: ownerKey,
      breachProcessRegressionEscalationAuditAppeals,
      breachProcessRegressionEscalationAuditAppealsExportedBy: ownerKey,
      breachProcessRegressionEscalationGovernanceDigests,
      breachProcessRegressionEscalationGovernanceDigestsExportedBy: ownerKey,
      portfolioImportAuditHistory,
      portfolioImportAuditHistoryExportedBy: ownerKey,
      portfolioImportAuditPruneSnapshot: portfolioImportAuditRestoreSnapshot,
      portfolioImportAuditPruneSnapshotExportedBy: ownerKey,
    }));
  };

  const recordPortfolioImportAudit = useCallback((
    entry: Omit<PortfolioImportAuditEntry, "id" | "recordedAt">,
    historyBase = portfolioImportAuditHistory,
  ) => {
    const next = dedupePortfolioImportAuditHistory([
      {
        ...entry,
        id: `portfolio-import-audit-${Date.now()}`,
        recordedAt: new Date().toISOString(),
        source: "local",
      },
      ...historyBase,
    ]).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY);
    setPortfolioImportAuditHistory(next);
    persistPortfolioImportAuditHistory(ownerKey, next);
  }, [ownerKey, portfolioImportAuditHistory]);

  const handleImport = () => {
    const parsed = parseVenturePortfolioImport(importDraft);
    if (parsed.length === 0) {
      toast.error("No valid venture records found");
      return;
    }
    const imported = replaceVenturePortfolio(ownerKey, parsed);
    const importedEscalationViews = parseDeploymentEscalationAuditSavedViewsImport(importDraft);
    const importedDemandSourceBlockerViews = parseDemandSourceBlockerSavedViewsImport(importDraft);
    const importedDemandSourceBlockerPacketTriage = parseDemandSourceBlockerPacketTriageImport(importDraft);
    const importedDemandSourceBlockerPacketTriageAuditHistory = parseDemandSourceBlockerPacketTriageAuditHistoryImport(importDraft);
    const importedDemandSourceBlockerPacketTriageOwnerWorkloadSummary = parseDemandSourceBlockerPacketTriageOwnerWorkloadSummaryImport(importDraft);
    const importedDemandSourceBlockerPacketTriageWorkloadDriftReconciliation = parseDemandSourceBlockerPacketTriageWorkloadDriftReconciliationImport(importDraft);
    const importedDemandSourceBlockerPacketTriageWorkloadPinnedSummaries = parseDemandSourceBlockerPacketTriageWorkloadPinnedSummariesImport(importDraft);
    const importedDemandSourceBlockerPacketHandoffRemediationPlans = parseDemandSourceBlockerPacketHandoffRemediationPlansImport(importDraft);
    const importedDemandSourceBlockerPacketHandoffRemediationClosures = parseDemandSourceBlockerPacketHandoffRemediationClosuresImport(importDraft);
    const importedDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts = parseDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsImport(importDraft);
    const importedDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions = parseDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsImport(importDraft);
    const importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans = parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansImport(importDraft);
    const importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures = parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresImport(importDraft);
    const importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures = parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresImport(importDraft);
    const importedBreachProcessRegressionEscalationAuditAssignments = parseBreachProcessRegressionEscalationAuditAssignmentsImport(importDraft);
    const importedBreachProcessRegressionEscalationAuditClosures = parseBreachProcessRegressionEscalationAuditClosuresImport(importDraft);
    const importedBreachProcessRegressionEscalationAuditReviews = parseBreachProcessRegressionEscalationAuditReviewsImport(importDraft);
    const importedBreachProcessRegressionEscalationAuditAppeals = parseBreachProcessRegressionEscalationAuditAppealsImport(importDraft);
    const importedAuditHistory = parsePortfolioImportAuditHistoryImport(importDraft);
    const importedPruneSnapshot = parsePortfolioImportAuditPruneSnapshotImport(importDraft);
    let auditHistoryBase = portfolioImportAuditHistory;
    let escalationViewSummary: DeploymentEscalationAuditImportSummary | null = null;
    let demandSourceBlockerViewSummary: DeploymentEscalationAuditImportSummary | null = null;
    let nextDemandSourceBlockerSavedViews = demandSourceBlockerSavedViews;
    let nextDemandSourceBlockerPacketTriageStates = demandSourceBlockerPacketTriageStates;
    let nextDemandSourceBlockerPacketTriageAuditHistory = demandSourceBlockerPacketTriageAuditHistory;
    if (importedEscalationViews) {
      const mergeResult = mergeDeploymentEscalationAuditSavedViews(
        deploymentEscalationAuditSavedViews,
        importedEscalationViews,
        deploymentEscalationAuditImportMode,
      );
      escalationViewSummary = mergeResult.summary;
      setDeploymentEscalationAuditSavedViews(mergeResult.views);
      persistDeploymentEscalationAuditSavedViews(ownerKey, mergeResult.views);
    }
    if (importedDemandSourceBlockerViews) {
      const mergeResult = mergeDemandSourceBlockerSavedViews(
        demandSourceBlockerSavedViews,
        importedDemandSourceBlockerViews,
        deploymentEscalationAuditImportMode,
      );
      demandSourceBlockerViewSummary = mergeResult.summary;
      nextDemandSourceBlockerSavedViews = mergeResult.views;
      setDemandSourceBlockerSavedViews(mergeResult.views);
      persistDemandSourceBlockerSavedViews(ownerKey, mergeResult.views);
    }
    if (importedDemandSourceBlockerPacketTriage) {
      const mergeResult = mergeDemandSourceBlockerPacketTriageStates(
        demandSourceBlockerPacketTriageStates,
        importedDemandSourceBlockerPacketTriage,
        deploymentEscalationAuditImportMode,
      );
      nextDemandSourceBlockerPacketTriageStates = mergeResult.states;
      setDemandSourceBlockerPacketTriageStates(mergeResult.states);
      persistDemandSourceBlockerPacketTriageStates(ownerKey, mergeResult.states);
    }
    if (importedDemandSourceBlockerPacketTriageAuditHistory) {
      const nextAuditHistory = mergeDemandSourceBlockerPacketTriageAuditHistory(
        demandSourceBlockerPacketTriageAuditHistory,
        importedDemandSourceBlockerPacketTriageAuditHistory,
      );
      nextDemandSourceBlockerPacketTriageAuditHistory = nextAuditHistory;
      setDemandSourceBlockerPacketTriageAuditHistory(nextAuditHistory);
      persistDemandSourceBlockerPacketTriageAuditHistory(ownerKey, nextAuditHistory);
    }
    const workloadDriftRecordedAt = new Date().toISOString();
    if (importedDemandSourceBlockerPacketTriageOwnerWorkloadSummary && importedDemandSourceBlockerPacketTriageOwnerWorkloadSummary.length > 0) {
      const importedWorkloadDriftReports = buildDemandSourceBlockerPacketTriageWorkloadDriftReports(
        importedDemandSourceBlockerPacketTriageOwnerWorkloadSummary,
        buildDemandSourceBlockerPacketTriageOwnerWorkloadSummary(
          buildDemandSourceBlockerPacketTriageOwnerQueue(
            buildDemandSourceBlockerSavedViewPackets(
              nextDemandSourceBlockerSavedViews,
              buildVentureDemandSourceBlockerDrilldowns(imported),
              workloadDriftRecordedAt,
              nextDemandSourceBlockerPacketTriageStates,
            ),
            nextDemandSourceBlockerPacketTriageAuditHistory,
            ownerKey,
          ),
        ),
        workloadDriftRecordedAt,
      );
      const nextWorkloadDriftReports = dedupeDemandSourceBlockerPacketTriageWorkloadDriftReports([
        ...importedWorkloadDriftReports,
        ...demandSourceBlockerPacketTriageWorkloadDriftReports,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_REPORTS);
      setDemandSourceBlockerPacketTriageWorkloadDriftReports(nextWorkloadDriftReports);
      persistDemandSourceBlockerPacketTriageWorkloadDriftReports(ownerKey, nextWorkloadDriftReports);
    }
    if (importedDemandSourceBlockerPacketTriageWorkloadDriftReconciliation) {
      const next = dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation([
        ...importedDemandSourceBlockerPacketTriageWorkloadDriftReconciliation,
        ...demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION);
      setDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(next);
      persistDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketTriageWorkloadPinnedSummaries) {
      const next = dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries([
        ...importedDemandSourceBlockerPacketTriageWorkloadPinnedSummaries,
        ...demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_PINNED_SUMMARIES);
      setDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(next);
      persistDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketHandoffRemediationPlans) {
      const next = dedupeDemandSourceBlockerPacketHandoffRemediationPlans([
        ...importedDemandSourceBlockerPacketHandoffRemediationPlans,
        ...demandSourceBlockerPacketHandoffRemediationPlans,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS);
      setDemandSourceBlockerPacketHandoffRemediationPlans(next);
      persistDemandSourceBlockerPacketHandoffRemediationPlans(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketHandoffRemediationClosures) {
      const next = dedupeDemandSourceBlockerPacketHandoffRemediationClosures([
        ...importedDemandSourceBlockerPacketHandoffRemediationClosures,
        ...demandSourceBlockerPacketHandoffRemediationClosures,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setDemandSourceBlockerPacketHandoffRemediationClosures(next);
      persistDemandSourceBlockerPacketHandoffRemediationClosures(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts) {
      const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts([
        ...importedDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts,
        ...demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(next);
      persistDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions) {
      const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions([
        ...importedDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions,
        ...demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(next);
      persistDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans) {
      const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans([
        ...importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
        ...demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS);
      setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(next);
      persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures) {
      const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures([
        ...importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
        ...demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(next);
      persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(ownerKey, next);
    }
    if (importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures) {
      const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures([
        ...importedDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
        ...demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(next);
      persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(ownerKey, next);
    }
    if (importedBreachProcessRegressionEscalationAuditAssignments) {
      const next = dedupeBreachProcessRegressionEscalationAuditAssignments([
        ...importedBreachProcessRegressionEscalationAuditAssignments,
        ...breachProcessRegressionEscalationAuditAssignments,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS);
      setBreachProcessRegressionEscalationAuditAssignments(next);
      persistRegressionEscalationAuditAssignments(ownerKey, next);
    }
    if (importedBreachProcessRegressionEscalationAuditClosures) {
      const next = dedupeBreachProcessRegressionEscalationAuditClosures([
        ...importedBreachProcessRegressionEscalationAuditClosures,
        ...breachProcessRegressionEscalationAuditClosures,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setBreachProcessRegressionEscalationAuditClosures(next);
      persistRegressionEscalationAuditClosures(ownerKey, next);
    }
    if (importedBreachProcessRegressionEscalationAuditReviews) {
      const next = dedupeBreachProcessRegressionEscalationAuditReviews([
        ...importedBreachProcessRegressionEscalationAuditReviews,
        ...breachProcessRegressionEscalationAuditReviews,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setBreachProcessRegressionEscalationAuditReviews(next);
      persistRegressionEscalationAuditReviews(ownerKey, next);
    }
    if (importedBreachProcessRegressionEscalationAuditAppeals) {
      const next = dedupeBreachProcessRegressionEscalationAuditAppeals([
        ...importedBreachProcessRegressionEscalationAuditAppeals,
        ...breachProcessRegressionEscalationAuditAppeals,
      ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
      setBreachProcessRegressionEscalationAuditAppeals(next);
      persistRegressionEscalationAuditAppeals(ownerKey, next);
    }
    if (importedAuditHistory) {
      auditHistoryBase = dedupePortfolioImportAuditHistory([
        ...importedAuditHistory,
        ...portfolioImportAuditHistory,
      ]).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY);
    }
    if (importedPruneSnapshot) {
      updatePortfolioImportAuditRestoreSnapshot(importedPruneSnapshot);
    }
    setVentures(imported);
    setImportDraft("");
    setExportText("");
    const combinedSavedViewSummary = combineDeploymentEscalationAuditImportSummaries([
      escalationViewSummary,
      demandSourceBlockerViewSummary,
    ]);
    setDeploymentEscalationAuditLastImportSummary(combinedSavedViewSummary);
    const importSummary = combinedSavedViewSummary ?? emptyDeploymentEscalationAuditImportSummary(0);
    recordPortfolioImportAudit({
      status: "imported",
      ventureCount: imported.length,
      savedViewCount: importSummary.total,
      mode: deploymentEscalationAuditImportMode,
      collisionCount: importSummary.renamed + importSummary.replaced + importSummary.skipped,
      added: importSummary.added,
      renamed: importSummary.renamed,
      replaced: importSummary.replaced,
      skipped: importSummary.skipped,
      compactGovernanceDigestConflictReceipts: portfolioImportPreview?.compactGovernanceDigestConflictReceipts,
    }, auditHistoryBase);
    lastBlockedImportAuditKeyRef.current = "";
    const importMessage = `Imported ${imported.length} venture workspace${imported.length === 1 ? "" : "s"}`;
    if (combinedSavedViewSummary) {
      toast.success(importMessage, {
        description: formatDeploymentEscalationAuditImportSummary(combinedSavedViewSummary),
      });
    } else {
      toast.success(importMessage);
    }
  };

  const portfolioImportPreview = useMemo(() => {
    if (!importDraft.trim()) return null;
    const inspection = inspectPortfolioImportPayload(importDraft);
    const previewVentures = inspection.isJsonValid ? parseVenturePortfolioImport(importDraft) : [];
    const previewEscalationViews = inspection.isJsonValid ? parseDeploymentEscalationAuditSavedViewsImport(importDraft) : null;
    const previewDemandSourceBlockerViews = inspection.isJsonValid ? parseDemandSourceBlockerSavedViewsImport(importDraft) : null;
    const previewDemandSourceBlockerPacketTriage = inspection.isJsonValid ? parseDemandSourceBlockerPacketTriageImport(importDraft) : null;
    const previewDemandSourceBlockerPacketTriageAuditHistory = inspection.isJsonValid ? parseDemandSourceBlockerPacketTriageAuditHistoryImport(importDraft) : null;
    const previewDemandSourceBlockerPacketTriageOwnerWorkloadSummary = inspection.isJsonValid ? parseDemandSourceBlockerPacketTriageOwnerWorkloadSummaryImport(importDraft) : null;
    const previewDemandSourceBlockerPacketTriageWorkloadDriftReconciliation = inspection.isJsonValid ? parseDemandSourceBlockerPacketTriageWorkloadDriftReconciliationImport(importDraft) : null;
    const previewDemandSourceBlockerPacketTriageWorkloadPinnedSummaries = inspection.isJsonValid ? parseDemandSourceBlockerPacketTriageWorkloadPinnedSummariesImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffHealth = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffHealthImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffRemediationQueue = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffRemediationQueueImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffRemediationPlans = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffRemediationPlansImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffRemediationClosures = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffRemediationClosuresImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalations = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationsImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsImport(importDraft) : null;
    const previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures = inspection.isJsonValid ? parseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosuresImport(importDraft) : null;
    const previewBreachProcessRegressionEscalations = inspection.isJsonValid ? parseBreachProcessRegressionEscalationsImport(importDraft) : null;
    const previewBreachProcessRegressionEscalationAuditAssignments = inspection.isJsonValid ? parseBreachProcessRegressionEscalationAuditAssignmentsImport(importDraft) : null;
    const previewBreachProcessRegressionEscalationAuditClosures = inspection.isJsonValid ? parseBreachProcessRegressionEscalationAuditClosuresImport(importDraft) : null;
    const previewBreachProcessRegressionEscalationAuditReviews = inspection.isJsonValid ? parseBreachProcessRegressionEscalationAuditReviewsImport(importDraft) : null;
    const previewBreachProcessRegressionEscalationAuditAppeals = inspection.isJsonValid ? parseBreachProcessRegressionEscalationAuditAppealsImport(importDraft) : null;
    const previewBreachProcessRegressionEscalationGovernanceDigests = inspection.isJsonValid ? parseBreachProcessRegressionEscalationGovernanceDigestsImport(importDraft) : null;
    const previewPruneSnapshot = inspection.isJsonValid ? parsePortfolioImportAuditPruneSnapshotImport(importDraft) : null;
    const savedViewCount = (previewEscalationViews?.length ?? 0) + (previewDemandSourceBlockerViews?.length ?? 0);
    const packetTriageCount = previewDemandSourceBlockerPacketTriage?.length ?? 0;
    const packetTriageAuditCount = previewDemandSourceBlockerPacketTriageAuditHistory?.length ?? 0;
    const packetWorkloadSummaryCount = previewDemandSourceBlockerPacketTriageOwnerWorkloadSummary?.length ?? 0;
    const packetWorkloadDriftReconciliationCount = previewDemandSourceBlockerPacketTriageWorkloadDriftReconciliation?.length ?? 0;
    const packetWorkloadPinnedSummaryCount = previewDemandSourceBlockerPacketTriageWorkloadPinnedSummaries?.length ?? 0;
    const packetHandoffHealthCount = previewDemandSourceBlockerPacketHandoffHealth?.length ?? 0;
    const packetHandoffRemediationQueueCount = previewDemandSourceBlockerPacketHandoffRemediationQueue?.length ?? 0;
    const packetHandoffRemediationPlansCount = previewDemandSourceBlockerPacketHandoffRemediationPlans?.length ?? 0;
    const packetHandoffRemediationClosureCount = previewDemandSourceBlockerPacketHandoffRemediationClosures?.length ?? 0;
    const packetHandoffReopenEscalationCount = previewDemandSourceBlockerPacketHandoffReopenEscalations?.length ?? 0;
    const packetHandoffReopenEscalationSlaReceiptCount = previewDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?.length ?? 0;
    const packetHandoffReopenEscalationSlaResolutionCount = previewDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachTrendCount = previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessPlanCount = previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessClosureCount = previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionCount = previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionClosureCount = previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationCount = previewBreachProcessRegressionEscalations?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignmentCount = previewBreachProcessRegressionEscalationAuditAssignments?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosureCount = previewBreachProcessRegressionEscalationAuditClosures?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviewCount = previewBreachProcessRegressionEscalationAuditReviews?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppealCount = previewBreachProcessRegressionEscalationAuditAppeals?.length ?? 0;
    const packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigestCount = previewBreachProcessRegressionEscalationGovernanceDigests?.length ?? 0;
    const invalidSavedViewCount = inspection.savedViewPayloadIsArray
      ? Math.max(0, inspection.rawSavedViewCount - (previewEscalationViews?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerSavedViewCount = inspection.demandSourceBlockerSavedViewPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerSavedViewCount - (previewDemandSourceBlockerViews?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketTriageCount = inspection.demandSourceBlockerPacketTriagePayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketTriageCount - (previewDemandSourceBlockerPacketTriage?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketTriageAuditCount = inspection.demandSourceBlockerPacketTriageAuditPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketTriageAuditCount - (previewDemandSourceBlockerPacketTriageAuditHistory?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketWorkloadSummaryCount = inspection.demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketTriageOwnerWorkloadSummaryCount - (previewDemandSourceBlockerPacketTriageOwnerWorkloadSummary?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketWorkloadDriftReconciliationCount = inspection.demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketTriageWorkloadDriftReconciliationCount - (previewDemandSourceBlockerPacketTriageWorkloadDriftReconciliation?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketWorkloadPinnedSummaryCount = inspection.demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketTriageWorkloadPinnedSummariesCount - (previewDemandSourceBlockerPacketTriageWorkloadPinnedSummaries?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffHealthCount = inspection.demandSourceBlockerPacketHandoffHealthPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffHealthCount - (previewDemandSourceBlockerPacketHandoffHealth?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffRemediationQueueCount = inspection.demandSourceBlockerPacketHandoffRemediationQueuePayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffRemediationQueueCount - (previewDemandSourceBlockerPacketHandoffRemediationQueue?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffRemediationPlansCount = inspection.demandSourceBlockerPacketHandoffRemediationPlansPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffRemediationPlansCount - (previewDemandSourceBlockerPacketHandoffRemediationPlans?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffRemediationClosureCount = inspection.demandSourceBlockerPacketHandoffRemediationClosuresPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffRemediationClosuresCount - (previewDemandSourceBlockerPacketHandoffRemediationClosures?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationCount = inspection.demandSourceBlockerPacketHandoffReopenEscalationsPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffReopenEscalationsCount - (previewDemandSourceBlockerPacketHandoffReopenEscalations?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptCount = inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsCount - (previewDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionCount = inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsCount - (previewDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendCount = inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsCount - (previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlanCount = inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansCount - (previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureCount = inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresCount - (previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionCount = inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayloadIsArray
      ? Math.max(0, inspection.rawDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsCount - (previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?.length ?? 0))
      : 0;
    const invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureCount = inspection.regressionClosurePayloadIsArray
      ? Math.max(0, inspection.rawRegressionClosureCount - (previewDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?.length ?? 0))
      : 0;
    const invalidBreachProcessRegressionEscalationCount = inspection.regressionEscalationPayloadIsArray
      ? Math.max(0, inspection.rawRegressionEscalationCount - (previewBreachProcessRegressionEscalations?.length ?? 0))
      : 0;
    const invalidBreachProcessRegressionEscalationAuditAssignmentCount = inspection.regressionAuditAssignmentPayloadIsArray
      ? Math.max(0, inspection.rawRegressionAuditAssignmentCount - (previewBreachProcessRegressionEscalationAuditAssignments?.length ?? 0))
      : 0;
    const invalidBreachProcessRegressionEscalationAuditClosureCount = inspection.regressionAuditClosurePayloadIsArray
      ? Math.max(0, inspection.rawRegressionAuditClosureCount - (previewBreachProcessRegressionEscalationAuditClosures?.length ?? 0))
      : 0;
    const invalidBreachProcessRegressionEscalationAuditReviewCount = inspection.regressionAuditReviewPayloadIsArray
      ? Math.max(0, inspection.rawRegressionAuditReviewCount - (previewBreachProcessRegressionEscalationAuditReviews?.length ?? 0))
      : 0;
    const invalidBreachProcessRegressionEscalationAuditAppealCount = inspection.regressionAuditAppealPayloadIsArray
      ? Math.max(0, inspection.rawRegressionAuditAppealCount - (previewBreachProcessRegressionEscalationAuditAppeals?.length ?? 0))
      : 0;
    const invalidBreachProcessRegressionEscalationGovernanceDigestCount = inspection.regressionGovernanceDigestPayloadIsArray
      ? Math.max(0, inspection.rawRegressionGovernanceDigestCount - (previewBreachProcessRegressionEscalationGovernanceDigests?.length ?? 0))
      : 0;
    const governanceDigestIntegrityIssueCount = previewBreachProcessRegressionEscalationGovernanceDigests
      ? auditBreachProcessRegressionEscalationGovernanceDigestIntegrity(
        previewBreachProcessRegressionEscalationGovernanceDigests,
        previewBreachProcessRegressionEscalationAuditAppeals ?? [],
      ).length
      : 0;
    const governanceDigestReplayIssueCount = previewBreachProcessRegressionEscalationGovernanceDigests
      ? auditBreachProcessRegressionEscalationGovernanceDigestReplay(
        previewBreachProcessRegressionEscalationGovernanceDigests,
        breachProcessRegressionEscalationAuditAppeals,
      ).length
      : 0;
    const governanceDigestConflictIssues = previewBreachProcessRegressionEscalationGovernanceDigests
      ? auditBreachProcessRegressionEscalationGovernanceDigestConflicts(
        previewBreachProcessRegressionEscalationGovernanceDigests,
        [
          ...breachProcessRegressionEscalationAuditAppeals,
          ...(previewBreachProcessRegressionEscalationAuditAppeals ?? []),
        ],
      )
      : [];
    const governanceDigestConflictIssueCount = governanceDigestConflictIssues.length;
    const compactGovernanceDigestConflictReceipts = governanceDigestConflictIssues
      .slice(0, 2)
      .map(formatBreachProcessRegressionEscalationGovernanceDigestConflictDrilldown);
    const warnings: string[] = [];

    if (!inspection.isJsonValid) {
      warnings.push("Invalid JSON; import will be blocked.");
    } else {
      if (inspection.hasVenturePayload && !inspection.venturePayloadIsArray) {
        warnings.push("Venture payload is malformed; import will be blocked.");
      }
      if (previewVentures.length === 0) {
        warnings.push("No valid venture records found; import will be blocked.");
      }
      if (inspection.hasSavedViewPayload && !inspection.savedViewPayloadIsArray) {
        warnings.push("Saved-view payload is malformed; no saved views will import.");
      }
      if (inspection.hasDemandSourceBlockerSavedViewPayload && !inspection.demandSourceBlockerSavedViewPayloadIsArray) {
        warnings.push("Demand-source blocker saved-view payload is malformed; no blocker saved views will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketTriagePayload && !inspection.demandSourceBlockerPacketTriagePayloadIsArray) {
        warnings.push("Demand-source blocker packet triage payload is malformed; no packet triage will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketTriageAuditPayload && !inspection.demandSourceBlockerPacketTriageAuditPayloadIsArray) {
        warnings.push("Demand-source blocker packet triage audit payload is malformed; no packet triage audit entries will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload && !inspection.demandSourceBlockerPacketTriageOwnerWorkloadSummaryPayloadIsArray) {
        warnings.push("Demand-source blocker workload summary payload is malformed; no workload summary artifact will be compared.");
      }
      if (inspection.hasDemandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload && !inspection.demandSourceBlockerPacketTriageWorkloadDriftReconciliationPayloadIsArray) {
        warnings.push("Demand-source blocker workload drift reconciliation payload is malformed; no drift reconciliation entries will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload && !inspection.demandSourceBlockerPacketTriageWorkloadPinnedSummariesPayloadIsArray) {
        warnings.push("Demand-source blocker pinned workload summary payload is malformed; no pinned summaries will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffHealthPayload && !inspection.demandSourceBlockerPacketHandoffHealthPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff health payload is malformed; no handoff health groups will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffRemediationQueuePayload && !inspection.demandSourceBlockerPacketHandoffRemediationQueuePayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff remediation queue payload is malformed; no remediation queue items will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffRemediationPlansPayload && !inspection.demandSourceBlockerPacketHandoffRemediationPlansPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff remediation plans payload is malformed; no remediation plans will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffRemediationClosuresPayload && !inspection.demandSourceBlockerPacketHandoffRemediationClosuresPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff remediation closure receipts payload is malformed; no remediation closure receipts will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationsPayload && !inspection.demandSourceBlockerPacketHandoffReopenEscalationsPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation payload is malformed; no reopen escalations will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload && !inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA receipt payload is malformed; no reopen escalation SLA receipts will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload && !inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA resolution payload is malformed; no reopen escalation SLA resolutions will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload && !inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach trend payload is malformed; no reopen escalation SLA breach trends will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload && !inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process plan payload is malformed; no reopen escalation SLA breach process plans will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload && !inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process closure payload is malformed; no reopen escalation SLA breach process closures will import.");
      }
      if (inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload && !inspection.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression payload is malformed; no reopen escalation SLA breach process regressions will import.");
      }
      if (inspection.hasRegressionClosurePayload && !inspection.regressionClosurePayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression closure payload is malformed; no reopen escalation SLA breach process regression closures will import.");
      }
      if (inspection.hasRegressionEscalationPayload && !inspection.regressionEscalationPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation payload is malformed; no reopen escalation SLA breach process regression escalations will import.");
      }
      if (inspection.hasRegressionAuditAssignmentPayload && !inspection.regressionAuditAssignmentPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit assignment payload is malformed; no reopen escalation SLA breach process regression escalation audit assignments will import.");
      }
      if (inspection.hasRegressionAuditClosurePayload && !inspection.regressionAuditClosurePayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit closure payload is malformed; no reopen escalation SLA breach process regression escalation audit closures will import.");
      }
      if (inspection.hasRegressionAuditReviewPayload && !inspection.regressionAuditReviewPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit review payload is malformed; no reopen escalation SLA breach process regression escalation audit reviews will import.");
      }
      if (inspection.hasRegressionAuditAppealPayload && !inspection.regressionAuditAppealPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit appeal payload is malformed; no reopen escalation SLA breach process regression escalation audit appeals will import.");
      }
      if (inspection.hasRegressionGovernanceDigestPayload && !inspection.regressionGovernanceDigestPayloadIsArray) {
        warnings.push("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation governance digest payload is malformed; no compact governance digests will be previewed.");
      }
      const totalInvalidSavedViewCount = invalidSavedViewCount + invalidDemandSourceBlockerSavedViewCount;
      if (totalInvalidSavedViewCount > 0) {
        warnings.push(`${totalInvalidSavedViewCount} saved ${totalInvalidSavedViewCount === 1 ? "view is" : "views are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketTriageCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketTriageCount} packet triage ${invalidDemandSourceBlockerPacketTriageCount === 1 ? "state is" : "states are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketTriageAuditCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketTriageAuditCount} packet triage audit ${invalidDemandSourceBlockerPacketTriageAuditCount === 1 ? "entry is" : "entries are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketWorkloadSummaryCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketWorkloadSummaryCount} workload summary ${invalidDemandSourceBlockerPacketWorkloadSummaryCount === 1 ? "artifact is" : "artifacts are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketWorkloadDriftReconciliationCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketWorkloadDriftReconciliationCount} workload drift reconciliation ${invalidDemandSourceBlockerPacketWorkloadDriftReconciliationCount === 1 ? "entry is" : "entries are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketWorkloadPinnedSummaryCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketWorkloadPinnedSummaryCount} pinned workload ${invalidDemandSourceBlockerPacketWorkloadPinnedSummaryCount === 1 ? "summary is" : "summaries are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffHealthCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffHealthCount} handoff health ${invalidDemandSourceBlockerPacketHandoffHealthCount === 1 ? "group is" : "groups are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffRemediationQueueCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffRemediationQueueCount} handoff remediation queue ${invalidDemandSourceBlockerPacketHandoffRemediationQueueCount === 1 ? "item is" : "items are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffRemediationPlansCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffRemediationPlansCount} handoff remediation ${invalidDemandSourceBlockerPacketHandoffRemediationPlansCount === 1 ? "plan is" : "plans are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffRemediationClosureCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffRemediationClosureCount} handoff remediation closure ${invalidDemandSourceBlockerPacketHandoffRemediationClosureCount === 1 ? "receipt is" : "receipts are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationCount} handoff reopen escalation ${invalidDemandSourceBlockerPacketHandoffReopenEscalationCount === 1 ? "item is" : "items are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptCount} reopen escalation SLA ${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptCount === 1 ? "receipt is" : "receipts are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionCount} reopen escalation SLA ${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionCount === 1 ? "resolution is" : "resolutions are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendCount} reopen escalation SLA breach ${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendCount === 1 ? "trend is" : "trends are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlanCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlanCount} reopen escalation SLA breach process ${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlanCount === 1 ? "plan is" : "plans are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureCount} reopen escalation SLA breach process ${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureCount === 1 ? "closure is" : "closures are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionCount} reopen escalation SLA breach process ${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionCount === 1 ? "regression is" : "regressions are"} invalid and will be ignored.`);
      }
      if (invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureCount > 0) {
        warnings.push(`${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureCount} reopen escalation SLA breach process regression ${invalidDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureCount === 1 ? "closure is" : "closures are"} invalid and will be ignored.`);
      }
      if (invalidBreachProcessRegressionEscalationCount > 0) {
        warnings.push(`${invalidBreachProcessRegressionEscalationCount} reopen escalation SLA breach process regression ${invalidBreachProcessRegressionEscalationCount === 1 ? "escalation is" : "escalations are"} invalid and will be ignored.`);
      }
      if (invalidBreachProcessRegressionEscalationAuditAssignmentCount > 0) {
        warnings.push(`${invalidBreachProcessRegressionEscalationAuditAssignmentCount} reopen escalation SLA breach process regression escalation audit ${invalidBreachProcessRegressionEscalationAuditAssignmentCount === 1 ? "assignment is" : "assignments are"} invalid and will be ignored.`);
      }
      if (invalidBreachProcessRegressionEscalationAuditClosureCount > 0) {
        warnings.push(`${invalidBreachProcessRegressionEscalationAuditClosureCount} reopen escalation SLA breach process regression escalation audit ${invalidBreachProcessRegressionEscalationAuditClosureCount === 1 ? "closure is" : "closures are"} invalid and will be ignored.`);
      }
      if (invalidBreachProcessRegressionEscalationAuditReviewCount > 0) {
        warnings.push(`${invalidBreachProcessRegressionEscalationAuditReviewCount} reopen escalation SLA breach process regression escalation audit ${invalidBreachProcessRegressionEscalationAuditReviewCount === 1 ? "review is" : "reviews are"} invalid and will be ignored.`);
      }
      if (invalidBreachProcessRegressionEscalationAuditAppealCount > 0) {
        warnings.push(`${invalidBreachProcessRegressionEscalationAuditAppealCount} reopen escalation SLA breach process regression escalation audit ${invalidBreachProcessRegressionEscalationAuditAppealCount === 1 ? "appeal is" : "appeals are"} invalid and will be ignored.`);
      }
      if (invalidBreachProcessRegressionEscalationGovernanceDigestCount > 0) {
        warnings.push(`${invalidBreachProcessRegressionEscalationGovernanceDigestCount} compact governance ${invalidBreachProcessRegressionEscalationGovernanceDigestCount === 1 ? "digest is" : "digests are"} invalid and will be ignored.`);
      }
      if (governanceDigestIntegrityIssueCount > 0) {
        warnings.push(`${governanceDigestIntegrityIssueCount} compact governance ${governanceDigestIntegrityIssueCount === 1 ? "digest has" : "digests have"} a missing or altered packet chain and will stay preview-only.`);
      }
      if (governanceDigestReplayIssueCount > 0) {
        warnings.push(`${governanceDigestReplayIssueCount} compact governance ${governanceDigestReplayIssueCount === 1 ? "digest is" : "digests are"} older than local governance packet history and will stay preview-only.`);
      }
      if (governanceDigestConflictIssueCount > 0) {
        warnings.push(`${governanceDigestConflictIssueCount} compact governance digest ${governanceDigestConflictIssueCount === 1 ? "conflict has" : "conflicts have"} competing signatures or packet windows; newest full appeal packets remain authoritative.`);
        warnings.push(...compactGovernanceDigestConflictReceipts);
      }
      if (packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigestCount > 0 && packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppealCount === 0) {
        warnings.push("Compact governance digests are preview-only; full audit appeal packets are still required before governance or re-clearance gates can unlock.");
      }
      if (previewVentures.length > 0 && !inspection.hasSavedViewPayload && !inspection.hasDemandSourceBlockerSavedViewPayload && !inspection.hasDemandSourceBlockerPacketTriagePayload && !inspection.hasDemandSourceBlockerPacketTriageAuditPayload && !inspection.hasDemandSourceBlockerPacketTriageOwnerWorkloadSummaryPayload && !inspection.hasDemandSourceBlockerPacketTriageWorkloadDriftReconciliationPayload && !inspection.hasDemandSourceBlockerPacketTriageWorkloadPinnedSummariesPayload && !inspection.hasDemandSourceBlockerPacketHandoffHealthPayload && !inspection.hasDemandSourceBlockerPacketHandoffRemediationQueuePayload && !inspection.hasDemandSourceBlockerPacketHandoffRemediationPlansPayload && !inspection.hasDemandSourceBlockerPacketHandoffRemediationClosuresPayload && !inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationsPayload && !inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsPayload && !inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsPayload && !inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsPayload && !inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansPayload && !inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresPayload && !inspection.hasDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsPayload && !inspection.hasRegressionClosurePayload && !inspection.hasRegressionEscalationPayload && !inspection.hasRegressionAuditAssignmentPayload && !inspection.hasRegressionAuditClosurePayload && !inspection.hasRegressionAuditReviewPayload && !inspection.hasRegressionAuditAppealPayload && !inspection.hasRegressionGovernanceDigestPayload) {
        warnings.push("Valid ventures with no saved views.");
      }
      if (previewPruneSnapshot) {
        warnings.push(`${previewPruneSnapshot.entries.length} pruned import audit ${previewPruneSnapshot.entries.length === 1 ? "entry" : "entries"} can be restored after import.`);
      }
    }

    const escalationSavedViewSummary = previewEscalationViews
      ? mergeDeploymentEscalationAuditSavedViews(
        deploymentEscalationAuditSavedViews,
        previewEscalationViews,
        deploymentEscalationAuditImportMode,
      ).summary
      : null;
    const demandSourceBlockerSavedViewSummary = previewDemandSourceBlockerViews
      ? mergeDemandSourceBlockerSavedViews(
        demandSourceBlockerSavedViews,
        previewDemandSourceBlockerViews,
        deploymentEscalationAuditImportMode,
      ).summary
      : null;
    const savedViewSummary = combineDeploymentEscalationAuditImportSummaries([
      escalationSavedViewSummary,
      demandSourceBlockerSavedViewSummary,
    ]);
    const collisionCount = savedViewSummary
      ? savedViewSummary.renamed + savedViewSummary.replaced + savedViewSummary.skipped
      : 0;
    let blockedReason = "";
    if (!inspection.isJsonValid) {
      blockedReason = "Import blocked: invalid JSON.";
    } else if (previewVentures.length === 0) {
      blockedReason = "Import blocked: no valid venture records.";
    }

    return {
      ventureCount: previewVentures.length,
      savedViewCount,
      packetTriageCount,
      packetTriageAuditCount,
      packetWorkloadSummaryCount,
      packetWorkloadDriftReconciliationCount,
      packetWorkloadPinnedSummaryCount,
      packetHandoffHealthCount,
      packetHandoffRemediationQueueCount,
      packetHandoffRemediationPlansCount,
      packetHandoffRemediationClosureCount,
      packetHandoffReopenEscalationCount,
      packetHandoffReopenEscalationSlaReceiptCount,
      packetHandoffReopenEscalationSlaResolutionCount,
      packetHandoffReopenEscalationSlaBreachTrendCount,
      packetHandoffReopenEscalationSlaBreachProcessPlanCount,
      packetHandoffReopenEscalationSlaBreachProcessClosureCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionClosureCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignmentCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosureCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviewCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppealCount,
      packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigestCount,
      savedViewSummary,
      pruneSnapshotCount: previewPruneSnapshot?.entries.length ?? 0,
      collisionCount,
      warnings,
      compactGovernanceDigestConflictReceipts,
      blockedReason,
      modeLabel: DEPLOYMENT_ESCALATION_AUDIT_IMPORT_MODE_LABELS[deploymentEscalationAuditImportMode],
      modeAction: DEPLOYMENT_ESCALATION_AUDIT_IMPORT_MODE_ACTIONS[deploymentEscalationAuditImportMode],
    };
  }, [breachProcessRegressionEscalationAuditAppeals, demandSourceBlockerSavedViews, deploymentEscalationAuditImportMode, deploymentEscalationAuditSavedViews, importDraft]);

  useEffect(() => {
    if (!portfolioImportPreview?.blockedReason || !importDraft.trim()) {
      lastBlockedImportAuditKeyRef.current = "";
      return;
    }
    const auditKey = `${portfolioImportPreview.blockedReason}:${importDraft}`;
    if (lastBlockedImportAuditKeyRef.current === auditKey) return;
    lastBlockedImportAuditKeyRef.current = auditKey;
    const summary = portfolioImportPreview.savedViewSummary ?? emptyDeploymentEscalationAuditImportSummary(0);
    recordPortfolioImportAudit({
      status: "blocked",
      ventureCount: portfolioImportPreview.ventureCount,
      savedViewCount: portfolioImportPreview.savedViewCount,
      mode: deploymentEscalationAuditImportMode,
      collisionCount: portfolioImportPreview.collisionCount,
      added: summary.added,
      renamed: summary.renamed,
      replaced: summary.replaced,
      skipped: summary.skipped,
      blockedReason: portfolioImportPreview.blockedReason,
      compactGovernanceDigestConflictReceipts: portfolioImportPreview.compactGovernanceDigestConflictReceipts,
    });
  }, [deploymentEscalationAuditImportMode, importDraft, portfolioImportPreview, recordPortfolioImportAudit]);

  const filteredPortfolioImportAuditHistory = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return portfolioImportAuditHistory;
    return portfolioImportAuditHistory.filter((entry) => [
      entry.status,
      entry.mode,
      DEPLOYMENT_ESCALATION_AUDIT_IMPORT_MODE_LABELS[entry.mode],
      entry.source,
      entry.exportedBy,
      entry.blockedReason,
      `${entry.ventureCount} ventures`,
      `${entry.savedViewCount} saved views`,
      `${entry.collisionCount} collisions`,
      `${entry.added} added`,
      `${entry.renamed} renamed`,
      `${entry.replaced} replaced`,
      `${entry.skipped} skipped`,
      ...(entry.compactGovernanceDigestConflictReceipts ?? []),
    ].join(" ").toLowerCase().includes(needle));
  }, [portfolioImportAuditHistory, searchQuery]);

  const handleClearMatchingPortfolioImportAuditHistory = useCallback(() => {
    const matchingKeys = new Set(filteredPortfolioImportAuditHistory.map(portfolioImportAuditHistoryDedupeKey));
    const next = portfolioImportAuditHistory.filter((entry) => !matchingKeys.has(portfolioImportAuditHistoryDedupeKey(entry)));
    const removedEntries = portfolioImportAuditHistory.filter((entry) => matchingKeys.has(portfolioImportAuditHistoryDedupeKey(entry)));
    const removedCount = portfolioImportAuditHistory.length - next.length;
    if (removedCount === 0) return;
    setPortfolioImportAuditHistory(next);
    updatePortfolioImportAuditRestoreSnapshot({
      entries: removedEntries,
      label: "matching",
      prunedAt: new Date().toISOString(),
    });
    persistPortfolioImportAuditHistory(ownerKey, next);
    toast.success(`Cleared ${removedCount} matching import audit ${removedCount === 1 ? "entry" : "entries"}`);
  }, [filteredPortfolioImportAuditHistory, ownerKey, portfolioImportAuditHistory, updatePortfolioImportAuditRestoreSnapshot]);

  const handleClearPortfolioImportAuditHistory = useCallback(() => {
    if (portfolioImportAuditHistory.length === 0) return;
    setPortfolioImportAuditHistory([]);
    updatePortfolioImportAuditRestoreSnapshot({
      entries: portfolioImportAuditHistory,
      label: "all",
      prunedAt: new Date().toISOString(),
    });
    persistPortfolioImportAuditHistory(ownerKey, []);
    toast.success("Import audit history cleared");
  }, [ownerKey, portfolioImportAuditHistory, updatePortfolioImportAuditRestoreSnapshot]);

  const handleRestorePortfolioImportAuditHistory = useCallback(() => {
    if (!portfolioImportAuditRestoreSnapshot) return;
    const restored = dedupePortfolioImportAuditHistory([
      ...portfolioImportAuditRestoreSnapshot.entries,
      ...portfolioImportAuditHistory,
    ]).slice(0, MAX_PORTFOLIO_IMPORT_AUDIT_HISTORY);
    setPortfolioImportAuditHistory(restored);
    updatePortfolioImportAuditRestoreSnapshot(null);
    persistPortfolioImportAuditHistory(ownerKey, restored);
    toast.success(`Restored ${portfolioImportAuditRestoreSnapshot.entries.length} import audit ${portfolioImportAuditRestoreSnapshot.entries.length === 1 ? "entry" : "entries"}`);
  }, [ownerKey, portfolioImportAuditHistory, portfolioImportAuditRestoreSnapshot, updatePortfolioImportAuditRestoreSnapshot]);

  const textFilteredVentures = useMemo(
    () => filterVenturePortfolio(ventures, searchQuery),
    [ventures, searchQuery],
  );

  const filteredVentures = useMemo(
    () => filterVenturePortfolioByEvidence(textFilteredVentures, evidenceFilter),
    [textFilteredVentures, evidenceFilter],
  );

  const convertedPainMemories = useMemo(
    () => buildVentureConvertedPainMemories(filteredVentures),
    [filteredVentures],
  );

  const convertedPricingMemories = useMemo(
    () => buildVentureConvertedPricingMemories(filteredVentures),
    [filteredVentures],
  );

  const mvpFeatureMemories = useMemo(
    () => buildVentureMvpFeatureMemories(filteredVentures),
    [filteredVentures],
  );

  const retainedUserMemories = useMemo(
    () => buildVentureRetainedUserMemories(filteredVentures),
    [filteredVentures],
  );

  const successPredictionMemories = useMemo(
    () => buildVentureSuccessPredictionMemories(filteredVentures),
    [filteredVentures],
  );

  const vanityMetricMemories = useMemo(
    () => buildVentureVanityMetricMemories(filteredVentures),
    [filteredVentures],
  );

  const generatedCodePatternMemories = useMemo(
    () => buildVentureGeneratedCodePatternMemories(filteredVentures),
    [filteredVentures],
  );

  const empiricalCalibrationMemories = useMemo(
    () => buildVentureEmpiricalCalibrationMemories(filteredVentures),
    [filteredVentures],
  );

  const fakeMarketMemories = useMemo(
    () => buildVentureFakeMarketMemories(filteredVentures),
    [filteredVentures],
  );

  const weakBranchKillMemories = useMemo(
    () => buildVentureWeakBranchKillMemories(filteredVentures),
    [filteredVentures],
  );

  const wrongClaimMemories = useMemo(
    () => buildVentureWrongClaimMemories(filteredVentures),
    [filteredVentures],
  );

  const workedChannelMemories = useMemo(
    () => buildVentureWorkedChannelMemories(filteredVentures),
    [filteredVentures],
  );

  const spawnedVentureDrafts = useMemo(
    () => buildVentureSpawnedVentureDrafts(filteredVentures),
    [filteredVentures],
  );

  const relatedIdeaMergeAudits = useMemo(
    () => buildVentureRelatedIdeaMergeAudits(filteredVentures),
    [filteredVentures],
  );

  const learningReinvestmentQueue = useMemo(
    () => buildVentureLearningReinvestmentQueue(filteredVentures),
    [filteredVentures],
  );

  const opportunityDiscoveryBacklog = useMemo(
    () => buildVentureOpportunityDiscoveryBacklog(filteredVentures),
    [filteredVentures],
  );

  const overlookedOpportunityAtlas = useMemo(
    () => buildVentureOverlookedOpportunityAtlas(filteredVentures),
    [filteredVentures],
  );

  const atlasValidationCommandPacks = useMemo(
    () => buildVentureAtlasValidationCommandPacks(filteredVentures),
    [filteredVentures],
  );

  const atlasValidationResultLedger = useMemo(
    () => buildVentureAtlasValidationResultLedger(filteredVentures),
    [filteredVentures],
  );

  const productBuildCommandQueue = useMemo(
    () => buildVentureProductBuildCommandQueue(filteredVentures),
    [filteredVentures],
  );

  const productBuildCommandRunLedger = useMemo(
    () => buildVentureProductBuildCommandRunLedger(filteredVentures),
    [filteredVentures],
  );

  const mvpReleaseWorkspaceList = useMemo(
    () => buildVentureMvpReleaseWorkspaceList(filteredVentures),
    [filteredVentures],
  );

  const pilotCohortSignalGates = useMemo(
    () => buildVenturePilotCohortSignalGates(filteredVentures),
    [filteredVentures],
  );

  const noSendEmailGateWorklist = useMemo(
    () => buildVentureNoSendEmailGateWorklist(filteredVentures),
    [filteredVentures],
  );

  const launchControlQueue = useMemo(
    () => buildVentureLaunchControlQueue(filteredVentures),
    [filteredVentures],
  );

  const demandCaptureProofQueue = useMemo(
    () => buildVentureDemandCaptureProofQueue(filteredVentures),
    [filteredVentures],
  );

  const demandSourceBlockerDrilldowns = useMemo(
    () => buildVentureDemandSourceBlockerDrilldowns(filteredVentures),
    [filteredVentures],
  );

  const portfolioDemandSourceBlockerDrilldowns = useMemo(
    () => buildVentureDemandSourceBlockerDrilldowns(ventures),
    [ventures],
  );

  const demandSourceBlockerSavedViewPackets = useMemo(
    () => buildDemandSourceBlockerSavedViewPackets(
      demandSourceBlockerSavedViews,
      demandSourceBlockerDrilldowns,
      new Date().toISOString(),
      demandSourceBlockerPacketTriageStates,
    ),
    [demandSourceBlockerDrilldowns, demandSourceBlockerPacketTriageStates, demandSourceBlockerSavedViews],
  );

  const portfolioDemandSourceBlockerSavedViewPackets = useMemo(
    () => buildDemandSourceBlockerSavedViewPackets(
      demandSourceBlockerSavedViews,
      portfolioDemandSourceBlockerDrilldowns,
      new Date().toISOString(),
      demandSourceBlockerPacketTriageStates,
    ),
    [demandSourceBlockerPacketTriageStates, demandSourceBlockerSavedViews, portfolioDemandSourceBlockerDrilldowns],
  );

  const demandSourceBlockerPacketTriageOwnerQueue = useMemo(
    () => buildDemandSourceBlockerPacketTriageOwnerQueue(
      portfolioDemandSourceBlockerSavedViewPackets,
      demandSourceBlockerPacketTriageAuditHistory,
      ownerKey,
    ),
    [demandSourceBlockerPacketTriageAuditHistory, ownerKey, portfolioDemandSourceBlockerSavedViewPackets],
  );

  const demandSourceBlockerPacketTriageOwnerWorkloadSummary = useMemo(
    () => buildDemandSourceBlockerPacketTriageOwnerWorkloadSummary(demandSourceBlockerPacketTriageOwnerQueue),
    [demandSourceBlockerPacketTriageOwnerQueue],
  );

  const demandSourceBlockerPacketHandoffHealth = useMemo(
    () => buildDemandSourceBlockerPacketHandoffHealth(
      demandSourceBlockerPacketTriageWorkloadDriftReports,
      demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
      demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
      new Date().toISOString(),
    ),
    [
      demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
      demandSourceBlockerPacketTriageWorkloadDriftReports,
      demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
    ],
  );

  const demandSourceBlockerPacketHandoffRemediationQueue = useMemo(
    () => buildDemandSourceBlockerPacketHandoffRemediationQueue(
      demandSourceBlockerPacketHandoffHealth,
      demandSourceBlockerPacketHandoffRemediationPlans,
      demandSourceBlockerPacketHandoffRemediationClosures,
    ),
    [
      demandSourceBlockerPacketHandoffHealth,
      demandSourceBlockerPacketHandoffRemediationClosures,
      demandSourceBlockerPacketHandoffRemediationPlans,
    ],
  );

  const demandSourceBlockerPacketHandoffReopenEscalations = useMemo(
    () => buildDemandSourceBlockerPacketHandoffReopenEscalations(
      demandSourceBlockerPacketHandoffRemediationQueue,
    ),
    [demandSourceBlockerPacketHandoffRemediationQueue],
  );

  const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends = useMemo(
    () => buildDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends(
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions,
    ),
    [demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions],
  );

  const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions = useMemo(
    () => buildDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions(
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
    ),
    [
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends,
    ],
  );

  const demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations = useMemo(
    () => buildBreachProcessRegressionEscalations(
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
    ).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_HEALTH_ITEMS),
    [
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions,
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
    ],
  );

  const handlePlanDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcess = useCallback((
    item: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem,
  ) => {
    const plannedAt = new Date().toISOString();
    const dueAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString();
    const proofRequired = `Attach a process-change receipt for ${item.owner} / ${item.sourceType}, name the breached SLA receipt ids, and prove the next reopened handoff will be reviewed before due date.`;
    const plan: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan = {
      id: `${item.id}-process-plan-${plannedAt}`,
      trendId: item.id,
      owner: item.owner,
      sourceType: item.sourceType,
      assignedOwner: item.owner,
      plannedBy: ownerKey,
      plannedAt,
      dueAt,
      breachCount: item.breachCount,
      resolutionCount: item.resolutionCount,
      breachedResolutionIds: item.breachedResolutionIds,
      proofRequired,
      followUpProof: `Pending owner/source process proof for ${item.breachCount} breached reopened SLA ${item.breachCount === 1 ? "resolution" : "resolutions"}.`,
      summary: `${item.owner} / ${item.sourceType} now has an assigned process plan for reopened SLA breach debt.`,
      nextAction: "Collect the process-change receipt before accepting another reopened handoff for this owner/source.",
      evidence: [
        item.summary,
        ...item.evidence.slice(0, 3),
        `Breached receipt ids: ${item.breachedResolutionIds.slice(0, 3).join(", ") || "none"}`,
      ],
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans([
      plan,
      ...demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS);
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(next);
    persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans(ownerKey, next);
    toast.success("Reopen SLA breach process plan assigned");
  }, [demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans, ownerKey]);

  const handleCloseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcess = useCallback((
    plan: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan,
    proofSummary: string,
    proofArtifact: string,
  ) => {
    const trimmedProofSummary = proofSummary.trim();
    const trimmedProofArtifact = proofArtifact.trim();
    if (!trimmedProofSummary || !trimmedProofArtifact) {
      toast.error("Process closure proof and artifact are required");
      return false;
    }
    const closedAt = new Date().toISOString();
    const closure: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt = {
      id: `${plan.id}-closure-${closedAt}`,
      planId: plan.id,
      trendId: plan.trendId,
      owner: plan.owner,
      sourceType: plan.sourceType,
      closedBy: ownerKey,
      closedAt,
      breachCount: plan.breachCount,
      breachedResolutionIds: plan.breachedResolutionIds,
      proofSummary: trimmedProofSummary,
      proofArtifact: trimmedProofArtifact,
      proofRequired: plan.proofRequired,
      nextAction: "Review the closure receipt against future reopened SLA breach trends before accepting another owner/source handoff.",
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures([
      closure,
      ...demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(next);
    persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures(ownerKey, next);
    toast.success("Reopen SLA breach process proof closed");
    return true;
  }, [demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures, ownerKey]);

  const handleCloseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression = useCallback((
    regression: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression,
    proofSummary: string,
    proofArtifact: string,
  ) => {
    const trimmedProofSummary = proofSummary.trim();
    const trimmedProofArtifact = proofArtifact.trim();
    if (!trimmedProofSummary || !trimmedProofArtifact) {
      toast.error("Regression re-closure proof and artifact are required");
      return false;
    }
    const closedAt = new Date().toISOString();
    const closure: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt = {
      id: `${regression.id}-reclosure-${closedAt}`,
      regressionId: regression.id,
      planId: regression.planId,
      closureId: regression.closureId,
      trendId: regression.trendId,
      owner: regression.owner,
      sourceType: regression.sourceType,
      closedBy: ownerKey,
      closedAt,
      breachCountAtClosure: regression.breachCountAtClosure,
      currentBreachCount: regression.currentBreachCount,
      latestBreachAt: regression.latestBreachAt,
      newBreachedResolutionIds: regression.newBreachedResolutionIds,
      proofSummary: trimmedProofSummary,
      proofArtifact: trimmedProofArtifact,
      nextAction: "Keep this regression closure in the process history and compare it against future reopened SLA breach trends before accepting another handoff.",
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures([
      closure,
      ...demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(next);
    persistDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures(ownerKey, next);
    toast.success("Reopen SLA breach process regression proof closed");
    return true;
  }, [demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures, ownerKey]);

  const handleAssignBreachProcessRegressionEscalationAudit = useCallback((
    escalation: BreachProcessRegressionEscalation,
  ) => {
    const assignedAt = new Date().toISOString();
    const dueAt = new Date(Date.now() + (5 * 24 * 60 * 60 * 1000)).toISOString();
    const assignment: BreachProcessRegressionEscalationAuditAssignment = {
      id: `${escalation.id}-audit-assignment-${assignedAt}`,
      escalationId: escalation.id,
      regressionId: escalation.regressionId,
      planId: escalation.planId,
      closureId: escalation.closureId,
      trendId: escalation.trendId,
      owner: escalation.owner,
      sourceType: escalation.sourceType,
      assignedOwner: escalation.owner,
      assignedBy: ownerKey,
      assignedAt,
      dueAt,
      severity: escalation.severity,
      reason: escalation.reason,
      currentBreachCount: escalation.currentBreachCount,
      latestBreachAt: escalation.latestBreachAt,
      triggerClosureId: escalation.triggerClosureId,
      newBreachedResolutionIds: escalation.newBreachedResolutionIds,
      proofRequired: `Run a higher-severity owner/source process audit for ${escalation.owner} / ${escalation.sourceType}, attach the audit receipt, and prove the reopened handoff is stable before due date.`,
      nextAction: escalation.nextAction,
      source: "local",
    };
    const next = dedupeBreachProcessRegressionEscalationAuditAssignments([
      assignment,
      ...breachProcessRegressionEscalationAuditAssignments,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS);
    setBreachProcessRegressionEscalationAuditAssignments(next);
    persistRegressionEscalationAuditAssignments(ownerKey, next);
    toast.success("Regression escalation audit assigned");
  }, [breachProcessRegressionEscalationAuditAssignments, ownerKey]);

  const handleCloseBreachProcessRegressionEscalationAudit = useCallback((
    escalation: BreachProcessRegressionEscalation,
    assignment: BreachProcessRegressionEscalationAuditAssignment,
    proofSummary: string,
    proofArtifact: string,
  ) => {
    const trimmedProofSummary = proofSummary.trim();
    const trimmedProofArtifact = proofArtifact.trim();
    if (!trimmedProofSummary || !trimmedProofArtifact) {
      toast.error("Regression escalation audit proof and artifact are required");
      return false;
    }
    const closedAt = new Date().toISOString();
    const closure: BreachProcessRegressionEscalationAuditClosure = {
      id: `${assignment.id}-audit-closure-${closedAt}`,
      assignmentId: assignment.id,
      escalationId: escalation.id,
      regressionId: escalation.regressionId,
      planId: escalation.planId,
      closureId: escalation.closureId,
      trendId: escalation.trendId,
      owner: escalation.owner,
      sourceType: escalation.sourceType,
      closedBy: ownerKey,
      closedAt,
      severity: escalation.severity,
      reason: escalation.reason,
      currentBreachCount: escalation.currentBreachCount,
      latestBreachAt: escalation.latestBreachAt,
      triggerClosureId: escalation.triggerClosureId,
      newBreachedResolutionIds: escalation.newBreachedResolutionIds,
      proofSummary: trimmedProofSummary,
      proofArtifact: trimmedProofArtifact,
      nextAction: "Keep this regression escalation audit closure in the process history and compare it against future reopened SLA breach process regressions before accepting another handoff.",
      source: "local",
    };
    const next = dedupeBreachProcessRegressionEscalationAuditClosures([
      closure,
      ...breachProcessRegressionEscalationAuditClosures,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setBreachProcessRegressionEscalationAuditClosures(next);
    persistRegressionEscalationAuditClosures(ownerKey, next);
    toast.success("Regression escalation audit proof closed");
    return true;
  }, [breachProcessRegressionEscalationAuditClosures, ownerKey]);

  const handleReviewBreachProcessRegressionEscalationAudit = useCallback((
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    outcome: BreachProcessRegressionEscalationAuditReviewOutcome,
    reviewer: string,
    reviewSummary: string,
    reviewArtifact: string,
  ) => {
    const trimmedReviewer = reviewer.trim();
    const trimmedReviewSummary = reviewSummary.trim();
    const trimmedReviewArtifact = reviewArtifact.trim();
    if (!trimmedReviewer || !trimmedReviewSummary || !trimmedReviewArtifact) {
      toast.error("Regression escalation audit reviewer, summary, and artifact are required");
      return false;
    }
    const reviewedAt = new Date().toISOString();
    const reviewerId = trimmedReviewer.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "") || "reviewer";
    const nextActionByOutcome: Record<BreachProcessRegressionEscalationAuditReviewOutcome, string> = {
      attested: "Independent reviewer attested the audit closure proof; keep this attestation in the process history before accepting another reopened handoff as stable.",
      disputed: "Independent reviewer disputed the audit closure proof; block stability acceptance and require fresh corrective proof before trusting another reopened handoff.",
      "corrective-proof": "Independent reviewer recorded corrective proof resolving the prior dispute; compare it against future reopened SLA breach process regressions before accepting another handoff.",
    };
    const review: BreachProcessRegressionEscalationAuditReview = {
      id: `${closure.id}-audit-review-${outcome}-${reviewerId}-${reviewedAt}`,
      auditClosureId: closure.id,
      assignmentId: closure.assignmentId,
      escalationId: escalation.id,
      regressionId: escalation.regressionId,
      planId: escalation.planId,
      closureId: escalation.closureId,
      trendId: escalation.trendId,
      owner: escalation.owner,
      sourceType: escalation.sourceType,
      reviewer: trimmedReviewer,
      reviewedAt,
      outcome,
      severity: escalation.severity,
      reason: escalation.reason,
      currentBreachCount: escalation.currentBreachCount,
      latestBreachAt: escalation.latestBreachAt,
      triggerClosureId: escalation.triggerClosureId,
      newBreachedResolutionIds: escalation.newBreachedResolutionIds,
      reviewSummary: trimmedReviewSummary,
      reviewArtifact: trimmedReviewArtifact,
      nextAction: nextActionByOutcome[outcome],
      source: "local",
    };
    const next = dedupeBreachProcessRegressionEscalationAuditReviews([
      review,
      ...breachProcessRegressionEscalationAuditReviews,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setBreachProcessRegressionEscalationAuditReviews(next);
    persistRegressionEscalationAuditReviews(ownerKey, next);
    toast.success(
      outcome === "attested"
        ? "Regression escalation audit review attested"
        : outcome === "disputed"
          ? "Regression escalation audit review disputed"
          : "Regression escalation audit corrective proof recorded",
    );
    return true;
  }, [breachProcessRegressionEscalationAuditReviews, ownerKey]);

  const handleRecordBreachProcessRegressionEscalationAuditAppeal = useCallback((
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    latestDispute: BreachProcessRegressionEscalationAuditReview,
    status: BreachProcessRegressionEscalationAuditAppealStatus,
    staleDisputeAgeDays: number,
    reviewerQuorumCount: number,
    independentReviewerCount: number,
    latestCorrectiveReviewId: string | null,
    conflictingReviewIds: string[],
    reviewerIdentities: string[],
    appealSummary: string,
    appealArtifact: string,
    clearanceBaselineReceiptIds: string[],
    reopenedAfterClearanceReceiptIds: string[],
    priorClearanceAppealId: string | null,
    staleClearanceAgeDays: number,
    fragileRemediationOwner: string | null,
    fragileEscalationArtifact: string | null,
    reviewerRotationProof: string | null,
    rotatedReviewerIdentities: string[],
    staleGovernanceContext?: RegressionEscalationAuditStaleGovernanceContext,
  ) => {
    const trimmedAppealSummary = appealSummary.trim();
    const trimmedAppealArtifact = appealArtifact.trim();
    const trimmedFragileRemediationOwner = fragileRemediationOwner?.trim() ?? "";
    const trimmedFragileEscalationArtifact = fragileEscalationArtifact?.trim() ?? "";
    const trimmedReviewerRotationProof = reviewerRotationProof?.trim() ?? "";
    const trimmedRotatedReviewerIdentities = rotatedReviewerIdentities.map((reviewer) => reviewer.trim()).filter(Boolean);
    const revokedGovernanceAppealIds = new Set(breachProcessRegressionEscalationAuditAppeals
      .filter((appeal) => appeal.escalationId === escalation.id && appeal.status === "fragile-governance-revoked")
      .map((appeal) => appeal.revokedFragileGovernanceAppealId)
      .filter((id): id is string => Boolean(id)));
    const revokedGovernancePackets = breachProcessRegressionEscalationAuditAppeals.filter((appeal) => (
      appeal.escalationId === escalation.id &&
      appeal.status === "fragile-governance" &&
      revokedGovernanceAppealIds.has(appeal.id)
    ));
    const revokedGovernanceOwners = new Set(revokedGovernancePackets
      .map((appeal) => appeal.fragileRemediationOwner?.toLowerCase())
      .filter((owner): owner is string => Boolean(owner)));
    const revokedGovernanceReviewers = new Set(revokedGovernancePackets
      .flatMap((appeal) => appeal.rotatedReviewerIdentities ?? [])
      .map((reviewer) => reviewer.toLowerCase()));
    if (!trimmedAppealSummary || !trimmedAppealArtifact) {
      toast.error("Regression escalation audit appeal summary and artifact are required");
      return false;
    }
    if (status === "quorum-cleared" && (!latestCorrectiveReviewId || independentReviewerCount < 2)) {
      toast.error("Corrective proof and two independent reviewers are required before clearing the audit appeal quorum");
      return false;
    }
    if (status === "fragile-governance") {
      if (!trimmedFragileRemediationOwner || !trimmedFragileEscalationArtifact || !trimmedReviewerRotationProof || trimmedRotatedReviewerIdentities.length === 0) {
        toast.error("Fragile clearance governance requires owner, escalation artifact, rotation proof, and a rotated reviewer");
        return false;
      }
      if (trimmedFragileRemediationOwner === escalation.owner || trimmedFragileRemediationOwner === ownerKey) {
        toast.error("Fragile clearance remediation owner must be separate from the fragile owner and recorder");
        return false;
      }
      if (!trimmedRotatedReviewerIdentities.some((reviewer) => !reviewerIdentities.includes(reviewer))) {
        toast.error("Fragile clearance governance requires a rotated reviewer beyond the repeat reviewers");
        return false;
      }
      if (revokedGovernanceOwners.has(trimmedFragileRemediationOwner.toLowerCase()) || trimmedRotatedReviewerIdentities.some((reviewer) => revokedGovernanceReviewers.has(reviewer.toLowerCase()))) {
        toast.error("Revoked fragile governance owner or reviewer cannot be reused");
        return false;
      }
    }
    if (status === "fragile-governance-stale") {
      if (!staleGovernanceContext?.priorFragileGovernanceAppealId) {
        toast.error("Stale fragile governance requires a prior governance packet");
        return false;
      }
      if (staleGovernanceContext.staleGovernanceReason === "new-breach-after-governance" && staleGovernanceContext.reopenedAfterGovernanceReceiptIds.length === 0) {
        toast.error("Stale fragile governance requires reopened receipt evidence");
        return false;
      }
      if (staleGovernanceContext.staleGovernanceReason === "aged-without-reclearance" && staleGovernanceContext.staleGovernanceAgeDays < BREACH_PROCESS_REGRESSION_ESCALATION_FRAGILE_GOVERNANCE_EXPIRY_DAYS) {
        toast.error("Aged fragile governance must reach the expiry window before it can be marked stale");
        return false;
      }
    }
    if (status === "fragile-governance-revoked") {
      if (!staleGovernanceContext?.priorFragileGovernanceAppealId || (staleGovernanceContext.revokedGovernanceStaleAppealIds?.length ?? 0) < 2) {
        toast.error("Fragile governance revocation requires a prior governance packet and repeated stale-governance evidence");
        return false;
      }
      if (!trimmedFragileRemediationOwner || !trimmedFragileEscalationArtifact || !trimmedReviewerRotationProof || trimmedRotatedReviewerIdentities.length === 0) {
        toast.error("Fragile governance revocation requires council owner, artifact, proof, and reviewer identity");
        return false;
      }
      if (new Set(trimmedRotatedReviewerIdentities.map((reviewer) => reviewer.toLowerCase())).size < 2) {
        toast.error("Fragile governance revocation requires two independent council reviewers");
        return false;
      }
    }
    if (status === "fragile-governance-revocation-stale") {
      if (!staleGovernanceContext?.priorGovernanceRevocationAppealId) {
        toast.error("Stale governance council revocation requires a prior council packet");
        return false;
      }
      if ((staleGovernanceContext.staleGovernanceRevocationAgeDays ?? 0) < BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_REVOCATION_EXPIRY_DAYS) {
        toast.error("Governance council revocation must reach the expiry window before it can be marked stale");
        return false;
      }
    }
    const recordedAt = new Date().toISOString();
    const appeal: BreachProcessRegressionEscalationAuditAppeal = {
      id: `${closure.id}-audit-appeal-${status}-${recordedAt}`,
      auditClosureId: closure.id,
      assignmentId: closure.assignmentId,
      escalationId: escalation.id,
      regressionId: escalation.regressionId,
      planId: escalation.planId,
      closureId: escalation.closureId,
      trendId: escalation.trendId,
      owner: escalation.owner,
      sourceType: escalation.sourceType,
      recordedBy: ownerKey,
      recordedAt,
      status,
      reviewerQuorumCount,
      independentReviewerCount,
      staleDisputeAgeDays,
      latestDisputeReviewId: latestDispute.id,
      latestCorrectiveReviewId,
      conflictingReviewIds,
      reviewerIdentities,
      appealSummary: trimmedAppealSummary,
      appealArtifact: trimmedAppealArtifact,
      clearanceBaselineReceiptIds,
      reopenedAfterClearanceReceiptIds,
      priorClearanceAppealId,
      staleClearanceAgeDays,
      fragileRemediationOwner: status === "fragile-governance" || status === "fragile-governance-revoked" ? trimmedFragileRemediationOwner : undefined,
      fragileEscalationArtifact: status === "fragile-governance" || status === "fragile-governance-revoked" ? trimmedFragileEscalationArtifact : undefined,
      reviewerRotationProof: status === "fragile-governance" || status === "fragile-governance-revoked" ? trimmedReviewerRotationProof : undefined,
      rotatedReviewerIdentities: status === "fragile-governance" || status === "fragile-governance-revoked" ? trimmedRotatedReviewerIdentities : undefined,
      priorFragileGovernanceAppealId: status === "fragile-governance-stale" ? staleGovernanceContext?.priorFragileGovernanceAppealId ?? null : undefined,
      governanceBaselineReceiptIds: status === "fragile-governance-stale" ? staleGovernanceContext?.governanceBaselineReceiptIds ?? [] : undefined,
      reopenedAfterGovernanceReceiptIds: status === "fragile-governance-stale" ? staleGovernanceContext?.reopenedAfterGovernanceReceiptIds ?? [] : undefined,
      staleGovernanceAgeDays: status === "fragile-governance-stale" ? staleGovernanceContext?.staleGovernanceAgeDays ?? 0 : undefined,
      staleGovernanceReason: status === "fragile-governance-stale" ? staleGovernanceContext?.staleGovernanceReason : undefined,
      revokedFragileGovernanceAppealId: status === "fragile-governance-revoked" ? staleGovernanceContext?.priorFragileGovernanceAppealId ?? null : undefined,
      revokedGovernanceStaleAppealIds: status === "fragile-governance-revoked" ? staleGovernanceContext?.revokedGovernanceStaleAppealIds ?? [] : undefined,
      revocationReason: status === "fragile-governance-revoked" ? "repeated-stale-governance" : undefined,
      priorGovernanceRevocationAppealId: status === "fragile-governance-revocation-stale" ? staleGovernanceContext?.priorGovernanceRevocationAppealId ?? null : undefined,
      staleGovernanceRevocationAgeDays: status === "fragile-governance-revocation-stale" ? staleGovernanceContext?.staleGovernanceRevocationAgeDays ?? 0 : undefined,
      staleGovernanceRevocationReason: status === "fragile-governance-revocation-stale" ? staleGovernanceContext?.staleGovernanceRevocationReason : undefined,
      nextAction: status === "quorum-cleared"
        ? "Keep the appeal clearance attached and snapshot the covered receipts, but mark it stale if any later reopened SLA breach lands outside this baseline."
        : status === "fragile-governance"
          ? "Keep fragile clearance blocked from operational stability until the separate remediation owner, escalation artifact, and reviewer rotation proof are attached before re-clearance."
        : status === "fragile-governance-revoked"
          ? "Do not reuse the revoked fragile governance owner or reviewer; require a fresh governance lane before another re-clearance."
        : status === "fragile-governance-revocation-stale"
          ? "Do not rely on this stale council revocation; record a fresh two-reviewer council packet before accepting replacement governance."
        : status === "fragile-governance-stale"
          ? "Do not reuse this stale fragile governance packet; require a fresh rotated owner/reviewer governance lane before another re-clearance."
        : status === "clearance-stale"
          ? "Preserve the prior clearance packet, keep stability blocked, and require a fresh corrective review plus a new two-reviewer re-clearance after this stale packet."
          : "Keep stability blocked until corrective proof and two independent reviewers clear this appeal quorum.",
      source: "local",
    };
    const next = dedupeBreachProcessRegressionEscalationAuditAppeals([
      appeal,
      ...breachProcessRegressionEscalationAuditAppeals,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setBreachProcessRegressionEscalationAuditAppeals(next);
    persistRegressionEscalationAuditAppeals(ownerKey, next);
    toast.success(status === "quorum-cleared"
      ? "Regression escalation audit appeal quorum cleared"
      : status === "fragile-governance"
        ? "Regression escalation audit fragile governance packet recorded"
      : status === "fragile-governance-revoked"
        ? "Regression escalation audit fragile governance revoked"
      : status === "fragile-governance-revocation-stale"
        ? "Regression escalation audit governance council revocation marked stale"
      : status === "fragile-governance-stale"
        ? "Regression escalation audit fragile governance marked stale"
      : status === "clearance-stale"
        ? "Regression escalation audit appeal clearance marked stale"
        : "Regression escalation audit appeal packet recorded");
    return true;
  }, [breachProcessRegressionEscalationAuditAppeals, ownerKey]);

  const handleAssignDemandSourceBlockerPacketHandoffReopenEscalationSla = useCallback((
    item: DemandSourceBlockerPacketHandoffReopenEscalationItem,
  ) => {
    const assignedAt = new Date().toISOString();
    const dueAt = item.latestClosedAt ?? item.latestReopenedAt ?? assignedAt;
    const receipt: DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt = {
      id: `${item.id}-sla-${assignedAt}`,
      escalationId: item.id,
      remediationId: item.remediationId,
      owner: item.owner,
      sourceType: item.sourceType,
      assignedOwner: item.owner,
      assignedBy: ownerKey,
      assignedAt,
      dueAt,
      reopenedCount: item.reopenedCount,
      failedClosureCount: item.failedClosureCount,
      summary: item.summary,
      nextAction: item.nextAction,
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts([
      receipt,
      ...demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(next);
    persistDemandSourceBlockerPacketHandoffReopenEscalationSlaReceipts(ownerKey, next);
    toast.success("Reopen escalation SLA assigned");
  }, [demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts, ownerKey]);

  const handleResolveDemandSourceBlockerPacketHandoffReopenEscalationSla = useCallback((
    receipt: DemandSourceBlockerPacketHandoffReopenEscalationSlaReceipt,
    proofSummary: string,
    proofArtifact: string,
  ) => {
    const trimmedProofSummary = proofSummary.trim();
    const trimmedProofArtifact = proofArtifact.trim();
    if (!trimmedProofSummary || !trimmedProofArtifact) {
      toast.error("Add SLA resolution proof before closing");
      return false;
    }
    const resolvedAt = new Date().toISOString();
    const resolution: DemandSourceBlockerPacketHandoffReopenEscalationSlaResolutionReceipt = {
      id: `${receipt.id}-resolved-${resolvedAt}`,
      slaReceiptId: receipt.id,
      escalationId: receipt.escalationId,
      remediationId: receipt.remediationId,
      owner: receipt.owner,
      sourceType: receipt.sourceType,
      assignedOwner: receipt.assignedOwner,
      resolvedBy: ownerKey,
      resolvedAt,
      dueAt: receipt.dueAt,
      wasOverdue: Date.parse(receipt.dueAt) < Date.parse(resolvedAt),
      reopenedCount: receipt.reopenedCount,
      failedClosureCount: receipt.failedClosureCount,
      proofSummary: trimmedProofSummary,
      proofArtifact: trimmedProofArtifact,
      nextAction: receipt.nextAction,
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions([
      resolution,
      ...demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(next);
    persistDemandSourceBlockerPacketHandoffReopenEscalationSlaResolutions(ownerKey, next);
    toast.success("Reopen escalation SLA resolved");
    return true;
  }, [demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions, ownerKey]);

  const handleMarkDemandSourceBlockerPacketHandoffRemediationPlanned = useCallback((
    item: DemandSourceBlockerPacketHandoffRemediationItem,
  ) => {
    const plannedAt = new Date().toISOString();
    const entry: DemandSourceBlockerPacketHandoffRemediationPlanEntry = {
      id: `${item.id}-planned-${plannedAt}`,
      remediationId: item.id,
      healthId: item.healthId,
      owner: item.owner,
      sourceType: item.sourceType,
      trigger: item.trigger,
      plannedBy: ownerKey,
      plannedAt,
      proofRequired: item.proofRequired,
      nextAction: item.nextAction,
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketHandoffRemediationPlans([
      entry,
      ...demandSourceBlockerPacketHandoffRemediationPlans,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_PLANS);
    setDemandSourceBlockerPacketHandoffRemediationPlans(next);
    persistDemandSourceBlockerPacketHandoffRemediationPlans(ownerKey, next);
    toast.success("Handoff remediation marked planned");
  }, [demandSourceBlockerPacketHandoffRemediationPlans, ownerKey]);

  const handleCloseDemandSourceBlockerPacketHandoffRemediation = useCallback((
    item: DemandSourceBlockerPacketHandoffRemediationItem,
    proofSummary: string,
    proofArtifact: string,
  ) => {
    const trimmedProofSummary = proofSummary.trim();
    const trimmedProofArtifact = proofArtifact.trim();
    if (!trimmedProofSummary || !trimmedProofArtifact) {
      toast.error("Add remediation proof before closing");
      return false;
    }
    const closedAt = new Date().toISOString();
    const linkedDriftReportIds = demandSourceBlockerPacketTriageWorkloadDriftReports
      .filter((report) => report.owner === item.owner && report.sourceType === item.sourceType)
      .map((report) => report.id);
    const receipt: DemandSourceBlockerPacketHandoffRemediationClosureReceipt = {
      id: `${item.id}-closed-${closedAt}`,
      remediationId: item.id,
      healthId: item.healthId,
      owner: item.owner,
      sourceType: item.sourceType,
      trigger: item.trigger,
      closedBy: ownerKey,
      closedAt,
      proofRequired: item.proofRequired,
      proofSummary: trimmedProofSummary,
      proofArtifact: trimmedProofArtifact,
      linkedDriftReportIds,
      totalDriftSnapshotsAtClosure: item.totalDriftSnapshots ?? 0,
      unresolvedDriftCountAtClosure: item.unresolvedDriftCount,
      repeatedDriftCountAtClosure: item.repeatedDriftCount,
      latestDriftAtAtClosure: item.latestDriftAt,
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketHandoffRemediationClosures([
      receipt,
      ...demandSourceBlockerPacketHandoffRemediationClosures,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_HANDOFF_REMEDIATION_CLOSURES);
    setDemandSourceBlockerPacketHandoffRemediationClosures(next);
    persistDemandSourceBlockerPacketHandoffRemediationClosures(ownerKey, next);
    toast.success("Handoff remediation proof closed");
    return true;
  }, [
    demandSourceBlockerPacketHandoffRemediationClosures,
    demandSourceBlockerPacketTriageWorkloadDriftReports,
    ownerKey,
  ]);

  const handleMarkDemandSourceBlockerWorkloadDriftReviewed = useCallback((report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => {
    const recordedAt = new Date().toISOString();
    const entry: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry = {
      id: `${report.id}-${report.recordedAt}-reviewed-${recordedAt}`,
      driftReportId: report.id,
      importedRecordedAt: report.recordedAt,
      owner: report.owner,
      sourceType: report.sourceType,
      action: "reviewed",
      reviewedBy: ownerKey,
      reviewedStatus: report.status,
      recordedAt,
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation([
      entry,
      ...demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION);
    setDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(next);
    persistDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(ownerKey, next);
    toast.success("Workload drift marked reviewed");
  }, [demandSourceBlockerPacketTriageWorkloadDriftReconciliation, ownerKey]);

  const handlePinDemandSourceBlockerCurrentWorkload = useCallback((report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => {
    const pinnedAt = new Date().toISOString();
    const groupKey = `${report.owner}::${report.sourceType}`;
    const currentSummary = demandSourceBlockerPacketTriageOwnerWorkloadSummary.find((item) => `${item.owner}::${item.sourceType}` === groupKey)
      ?? buildDemandSourceBlockerPacketTriageWorkloadSummaryFromReport(report);
    const pinnedSummary: DemandSourceBlockerPacketTriageWorkloadPinnedSummary = {
      id: `${report.id}-${report.recordedAt}-pinned-current-${pinnedAt}`,
      owner: report.owner,
      sourceType: report.sourceType,
      groupKey,
      pinnedAt,
      pinnedBy: ownerKey,
      driftReportId: report.id,
      importedRecordedAt: report.recordedAt,
      summary: {
        ...currentSummary,
        source: "local",
      },
      source: "local",
    };
    const reconciliationEntry: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry = {
      id: `${report.id}-${report.recordedAt}-pinned-current-${pinnedAt}`,
      driftReportId: report.id,
      importedRecordedAt: report.recordedAt,
      owner: report.owner,
      sourceType: report.sourceType,
      action: "pinned-current",
      reviewedBy: ownerKey,
      reviewedStatus: report.status,
      recordedAt: pinnedAt,
      source: "local",
    };
    const nextPinned = dedupeDemandSourceBlockerPacketTriageWorkloadPinnedSummaries([
      pinnedSummary,
      ...demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_PINNED_SUMMARIES);
    const nextReconciliation = dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation([
      reconciliationEntry,
      ...demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION);
    setDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(nextPinned);
    setDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(nextReconciliation);
    persistDemandSourceBlockerPacketTriageWorkloadPinnedSummaries(ownerKey, nextPinned);
    persistDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(ownerKey, nextReconciliation);
    toast.success("Current workload pinned as authoritative");
  }, [
    demandSourceBlockerPacketTriageOwnerWorkloadSummary,
    demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
    demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
    ownerKey,
  ]);

  const handleClearDemandSourceBlockerWorkloadDriftReview = useCallback((report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => {
    const recordedAt = new Date().toISOString();
    const entry: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry = {
      id: `${report.id}-${report.recordedAt}-cleared-${recordedAt}`,
      driftReportId: report.id,
      importedRecordedAt: report.recordedAt,
      owner: report.owner,
      sourceType: report.sourceType,
      action: "cleared",
      reviewedBy: ownerKey,
      reviewedStatus: report.status,
      recordedAt,
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketTriageWorkloadDriftReconciliation([
      entry,
      ...demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_WORKLOAD_DRIFT_RECONCILIATION);
    setDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(next);
    persistDemandSourceBlockerPacketTriageWorkloadDriftReconciliation(ownerKey, next);
    toast.success("Workload drift review cleared");
  }, [demandSourceBlockerPacketTriageWorkloadDriftReconciliation, ownerKey]);

  const portfolioDecisionCommandQueue = useMemo(
    () => buildVenturePortfolioDecisionCommandQueue(filteredVentures),
    [filteredVentures],
  );

  const failedOutreachMemories = useMemo(
    () => buildVentureFailedOutreachMemories(filteredVentures),
    [filteredVentures],
  );

  const portfolioSummary = useMemo(
    () => summarizeVenturePortfolio(filteredVentures),
    [filteredVentures],
  );
  const deploymentOwnerWorklist = useMemo(
    () => buildVentureDeploymentOwnerWorklist(filteredVentures, deploymentOwnerFilter),
    [deploymentOwnerFilter, filteredVentures],
  );
  const deploymentOwnerWorkload = useMemo(
    () => summarizeVentureDeploymentOwnerWorkload(filteredVentures),
    [filteredVentures],
  );
  const deploymentEscalationCandidates = useMemo(
    () => filteredVentures.flatMap((venture) => buildVentureAutonomyAuditCandidates(venture)
      .filter((candidate) => candidate.actionType.startsWith("No-send deployment escalation"))
      .map((candidate) => ({ venture, candidate }))),
    [filteredVentures],
  );
  const deploymentEscalationAuditRollup = useMemo(
    () => buildVentureDeploymentEscalationAuditRollup(filteredVentures),
    [filteredVentures],
  );
  const deploymentEscalationAuditStatuses = useMemo(
    () => Array.from(new Set(deploymentEscalationAuditRollup.items.map((item) => item.status))).sort((a, b) => a.localeCompare(b)),
    [deploymentEscalationAuditRollup.items],
  );
  const deploymentEscalationAuditSideEffects = useMemo(
    () => Array.from(new Set(deploymentEscalationAuditRollup.items.map((item) => item.sideEffect))).sort((a, b) => a.localeCompare(b)),
    [deploymentEscalationAuditRollup.items],
  );
  const deploymentEscalationAuditActors = useMemo(
    () => Array.from(new Set(deploymentEscalationAuditRollup.items.map((item) => item.actor))).sort((a, b) => a.localeCompare(b)),
    [deploymentEscalationAuditRollup.items],
  );
  const displayedDeploymentEscalationAudits = useMemo(
    () => deploymentEscalationAuditRollup.items.filter((item) => (
      (deploymentEscalationAuditStatusFilter === "all" || item.status === deploymentEscalationAuditStatusFilter) &&
      (deploymentEscalationAuditSideEffectFilter === "all" || item.sideEffect === deploymentEscalationAuditSideEffectFilter) &&
      (deploymentEscalationAuditActorFilter === "all" || item.actor === deploymentEscalationAuditActorFilter)
    )),
    [
      deploymentEscalationAuditActorFilter,
      deploymentEscalationAuditRollup.items,
      deploymentEscalationAuditSideEffectFilter,
      deploymentEscalationAuditStatusFilter,
    ],
  );
  const deploymentStatusDrilldowns = useMemo(
    () => Array.from(new Set(deploymentOwnerWorklist.items.map((item) => item.status))).sort((a, b) => a.localeCompare(b)),
    [deploymentOwnerWorklist.items],
  );
  const displayedDeploymentOwnerItems = useMemo(
    () => deploymentOwnerWorklist.items.filter((item) => (
      (deploymentEnvironmentFilter === "all" || item.targetId === deploymentEnvironmentFilter) &&
      (deploymentSlaFilter === "all" || item.slaStatus === deploymentSlaFilter) &&
      (deploymentStatusFilter === "all" || item.status === deploymentStatusFilter)
    )),
    [deploymentEnvironmentFilter, deploymentOwnerWorklist.items, deploymentSlaFilter, deploymentStatusFilter],
  );
  const deploymentDrilldownActive = deploymentEnvironmentFilter !== "all" || deploymentSlaFilter !== "all" || deploymentStatusFilter !== "all" || deploymentOwnerFilter !== "all";
  const clearDeploymentDrilldowns = useCallback(() => {
    setDeploymentOwnerFilter("all");
    setDeploymentEnvironmentFilter("all");
    setDeploymentSlaFilter("all");
    setDeploymentStatusFilter("all");
  }, []);
  const deploymentEscalationAuditFilterActive = deploymentEscalationAuditStatusFilter !== "all" || deploymentEscalationAuditSideEffectFilter !== "all" || deploymentEscalationAuditActorFilter !== "all";
  const clearDeploymentEscalationAuditFilters = useCallback(() => {
    setDeploymentEscalationAuditStatusFilter("all");
    setDeploymentEscalationAuditSideEffectFilter("all");
    setDeploymentEscalationAuditActorFilter("all");
  }, []);
  const handleSaveDeploymentEscalationAuditView = useCallback(() => {
    const name = deploymentEscalationAuditViewNameDraft.trim();
    if (!name) {
      toast.error("Name the escalation view before saving");
      return;
    }
    const view: DeploymentEscalationAuditSavedView = {
      id: `deployment-escalation-view-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      source: "local",
      statusFilter: deploymentEscalationAuditStatusFilter,
      sideEffectFilter: deploymentEscalationAuditSideEffectFilter,
      actorFilter: deploymentEscalationAuditActorFilter,
    };
    const next = [
      view,
      ...deploymentEscalationAuditSavedViews.filter((item) => item.name.toLowerCase() !== name.toLowerCase()),
    ].slice(0, MAX_DEPLOYMENT_ESCALATION_AUDIT_SAVED_VIEWS);
    setDeploymentEscalationAuditSavedViews(next);
    persistDeploymentEscalationAuditSavedViews(ownerKey, next);
    setDeploymentEscalationAuditViewNameDraft("");
    toast.success("Deployment escalation view saved");
  }, [
    deploymentEscalationAuditActorFilter,
    deploymentEscalationAuditSavedViews,
    deploymentEscalationAuditSideEffectFilter,
    deploymentEscalationAuditStatusFilter,
    deploymentEscalationAuditViewNameDraft,
    ownerKey,
  ]);
  const handleApplyDeploymentEscalationAuditView = useCallback((view: DeploymentEscalationAuditSavedView) => {
    setDeploymentEscalationAuditStatusFilter(view.statusFilter);
    setDeploymentEscalationAuditSideEffectFilter(view.sideEffectFilter);
    setDeploymentEscalationAuditActorFilter(view.actorFilter);
    toast.success(`Deployment escalation view applied: ${view.name}`);
  }, []);
  const handleDeleteDeploymentEscalationAuditView = useCallback((viewId: string) => {
    const next = deploymentEscalationAuditSavedViews.filter((view) => view.id !== viewId);
    setDeploymentEscalationAuditSavedViews(next);
    persistDeploymentEscalationAuditSavedViews(ownerKey, next);
    toast.success("Deployment escalation view deleted");
  }, [deploymentEscalationAuditSavedViews, ownerKey]);
  const handleSaveDemandSourceBlockerView = useCallback((item: VentureDemandSourceBlockerDrilldownItem) => {
    const name = demandSourceBlockerViewNameDraft.trim();
    if (!name) {
      toast.error("Name the blocker source view before saving");
      return;
    }
    const view: DemandSourceBlockerSavedView = {
      id: `demand-source-blocker-view-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      source: "local",
      sourceType: item.sourceType,
      searchQuery: item.searchQuery,
    };
    const next = [
      view,
      ...demandSourceBlockerSavedViews.filter((savedView) => savedView.name.toLowerCase() !== name.toLowerCase()),
    ].slice(0, MAX_DEMAND_SOURCE_BLOCKER_SAVED_VIEWS);
    setDemandSourceBlockerSavedViews(next);
    persistDemandSourceBlockerSavedViews(ownerKey, next);
    setDemandSourceBlockerViewNameDraft("");
    toast.success("Demand source blocker view saved");
  }, [demandSourceBlockerSavedViews, demandSourceBlockerViewNameDraft, ownerKey]);
  const handleApplyDemandSourceBlockerView = useCallback((view: DemandSourceBlockerSavedView) => {
    setSearchQuery(view.searchQuery);
    toast.success(`Demand source blocker view applied: ${view.name}`);
  }, []);
  const handleReplayDemandSourceBlockerPacket = useCallback((packet: DemandSourceBlockerSavedViewPacket) => {
    setSearchQuery(packet.searchQuery);
    toast.success(`Demand source blocker packet replayed: ${packet.name}`);
  }, []);
  const handleMarkDemandSourceBlockerPacketTriage = useCallback((
    packet: DemandSourceBlockerSavedViewPacket,
    status: DemandSourceBlockerPacketTriageStatus,
  ) => {
    const now = new Date().toISOString();
    const previousStatus: DemandSourceBlockerPacketTriageAuditStatus = packet.triageStatus ?? "untriaged";
    const state: DemandSourceBlockerPacketTriageState = {
      id: `demand-source-blocker-packet-triage-${packet.savedViewId}`,
      savedViewId: packet.savedViewId,
      savedViewName: packet.name,
      packetId: packet.id,
      sourceType: packet.sourceType,
      searchQuery: packet.searchQuery,
      status,
      updatedAt: now,
      source: "local",
    };
    const auditEntry: DemandSourceBlockerPacketTriageAuditEntry = {
      id: `demand-source-blocker-packet-triage-audit-${packet.savedViewId}-${now}`,
      savedViewId: packet.savedViewId,
      savedViewName: packet.name,
      packetId: packet.id,
      sourceType: packet.sourceType,
      searchQuery: packet.searchQuery,
      previousStatus,
      nextStatus: status,
      recordedAt: now,
      source: "local",
    };
    const next = dedupeDemandSourceBlockerPacketTriageStates([
      state,
      ...demandSourceBlockerPacketTriageStates.filter((item) => (
        demandSourceBlockerPacketTriageDedupeKey(item) !== demandSourceBlockerPacketTriageDedupeKey(state)
      )),
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_STATES);
    const nextAuditHistory = dedupeDemandSourceBlockerPacketTriageAuditHistory([
      auditEntry,
      ...demandSourceBlockerPacketTriageAuditHistory,
    ]).slice(0, MAX_DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_AUDIT_HISTORY);
    setDemandSourceBlockerPacketTriageStates(next);
    setDemandSourceBlockerPacketTriageAuditHistory(nextAuditHistory);
    persistDemandSourceBlockerPacketTriageStates(ownerKey, next);
    persistDemandSourceBlockerPacketTriageAuditHistory(ownerKey, nextAuditHistory);
    toast.success(`Demand source blocker packet marked ${DEMAND_SOURCE_BLOCKER_PACKET_TRIAGE_LABELS[status].toLowerCase()}: ${packet.name}`);
  }, [demandSourceBlockerPacketTriageAuditHistory, demandSourceBlockerPacketTriageStates, ownerKey]);
  const handleDeleteDemandSourceBlockerView = useCallback((viewId: string) => {
    const next = demandSourceBlockerSavedViews.filter((view) => view.id !== viewId);
    setDemandSourceBlockerSavedViews(next);
    persistDemandSourceBlockerSavedViews(ownerKey, next);
    toast.success("Demand source blocker view deleted");
  }, [demandSourceBlockerSavedViews, ownerKey]);
  const portfolioChartPack = useMemo(
    () => buildVenturePortfolioChartPack(filteredVentures),
    [filteredVentures],
  );
  const manualThesisSimilarityMatches = useMemo(
    () => findSimilarVentureTheses(manualThesisDraft, ventures),
    [manualThesisDraft, ventures],
  );
  const manualThesisFailureLessons = useMemo(
    () => buildVentureFailureLessons(ventures, manualThesisDraft),
    [manualThesisDraft, ventures],
  );
  const manualThesisRevivalTriggers = useMemo(
    () => buildVentureRevivalTriggers(ventures, manualThesisDraft),
    [manualThesisDraft, ventures],
  );

  return (
    <ScrollArea className="h-screen">
      <div className="flex max-w-[1180px] flex-col gap-5 p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Venture Lab</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Saved venture workspaces with evidence, experiments, kill criteria, and autonomy gates.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
              Export JSON
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={refresh} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
          <RuntimeHealthStrip />
        </div>

        {runtimeHealthSnapshot && (
          <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex flex-wrap items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Runtime health memory</h2>
              <Badge variant="secondary" className={runtimeHealthSnapshot.issueCount > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
                {runtimeHealthSnapshot.issueCount} issue{runtimeHealthSnapshot.issueCount === 1 ? "" : "s"}
              </Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                captured {formatDate(runtimeHealthSnapshot.capturedAt)}
              </Badge>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
              <MetricTile label="Runtime status" value={runtimeHealthSnapshot.runtimeStatus} />
              <MetricTile label="Worker status" value={runtimeHealthSnapshot.workerStatus} />
              <MetricTile label="Required failures" value={runtimeHealthSnapshot.requiredFailureCount} />
              <MetricTile label="Optional issues" value={runtimeHealthSnapshot.optionalIssueCount} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{runtimeHealthSnapshot.message}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {runtimeHealthSnapshot.nextAction}</p>
          </div>
        )}

        <div className="rounded-lg border border-blue-200 bg-white/85 p-4 shadow-sm dark:border-blue-950/60 dark:bg-slate-950/85">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Create venture thesis</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              Manual workspace
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Input
              aria-label="Thesis title"
              value={manualThesisDraft.title}
              onChange={(event) => updateManualThesisDraft("title", event.target.value)}
              placeholder="Thesis title"
              className="bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
            <Input
              aria-label="Target buyer"
              value={manualThesisDraft.targetBuyer}
              onChange={(event) => updateManualThesisDraft("targetBuyer", event.target.value)}
              placeholder="Target buyer"
              className="bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
            <Textarea
              aria-label="Pain statement"
              value={manualThesisDraft.painStatement}
              onChange={(event) => updateManualThesisDraft("painStatement", event.target.value)}
              placeholder="Pain statement"
              className="min-h-[82px] resize-none bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
            <Textarea
              aria-label="Product wedge"
              value={manualThesisDraft.productWedge}
              onChange={(event) => updateManualThesisDraft("productWedge", event.target.value)}
              placeholder="Product wedge"
              className="min-h-[82px] resize-none bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
            <Input
              aria-label="Revenue model"
              value={manualThesisDraft.revenueModel}
              onChange={(event) => updateManualThesisDraft("revenueModel", event.target.value)}
              placeholder="Revenue model"
              className="bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
            <Input
              aria-label="Pricing hypothesis"
              value={manualThesisDraft.pricingHypothesis}
              onChange={(event) => updateManualThesisDraft("pricingHypothesis", event.target.value)}
              placeholder="Pricing hypothesis"
              className="bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
            <Input
              aria-label="Acquisition channel"
              value={manualThesisDraft.acquisitionChannel}
              onChange={(event) => updateManualThesisDraft("acquisitionChannel", event.target.value)}
              placeholder="Acquisition channel"
              className="bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
            <Textarea
              aria-label="Evidence note"
              value={manualThesisDraft.evidenceNote}
              onChange={(event) => updateManualThesisDraft("evidenceNote", event.target.value)}
              placeholder="Evidence note"
              className="min-h-[82px] resize-none bg-slate-50/80 text-sm dark:bg-slate-900/70"
            />
          </div>
          {manualThesisSimilarityMatches.length > 0 && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/70 dark:bg-amber-950/20">
              <div className="flex flex-wrap items-center gap-2">
                <ListFilter className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-100">Tried-this-before matches</h3>
                <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
                  {manualThesisSimilarityMatches.length} similar
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {manualThesisSimilarityMatches.slice(0, 4).map((match) => (
                  <div key={match.ventureId} className="rounded-md border border-amber-200 bg-white/75 p-2 dark:border-amber-900/70 dark:bg-slate-950/60">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                        {match.score}/100
                      </Badge>
                      <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
                        {match.recommendation}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{match.title}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{match.reason}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Difference check: {match.differenceQuestions.slice(0, 2).join(" ")}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {match.nextAction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {manualThesisFailureLessons.length > 0 && (
            <div className="mt-3">
              <FailureLessonsPanel lessons={manualThesisFailureLessons} />
            </div>
          )}
          {manualThesisRevivalTriggers.length > 0 && (
            <div className="mt-3">
              <RevivalTriggersPanel triggers={manualThesisRevivalTriggers} />
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={handleCreateManualVenture}
              disabled={!canCreateManualThesis}
              className="gap-1.5 bg-blue-600 text-xs hover:bg-blue-700"
            >
              <Send className="h-3.5 w-3.5" />
              Create venture thesis
            </Button>
          </div>
        </div>

        {(exportText || ventures.length > 0) && (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/80">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-100">Portfolio export</div>
              {portfolioImportAuditRestoreSnapshot && (
                <div
                  aria-label="Portfolio export pending import audit pruning"
                  className="mt-2 rounded-md border border-amber-200 bg-amber-50/80 p-2 dark:border-amber-900/70 dark:bg-amber-950/20"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="bg-white text-amber-800 dark:bg-slate-950 dark:text-amber-200">
                      {portfolioImportAuditRestoreSnapshot.entries.length} pruned
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                      {portfolioImportAuditRestoreSnapshot.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
                    Export will include pending import-audit restore metadata from {formatDate(portfolioImportAuditRestoreSnapshot.prunedAt)}.
                  </p>
                </div>
              )}
              <Textarea
                readOnly
                value={exportText}
                placeholder="Click Export JSON to generate a portable venture portfolio payload."
                className="mt-2 min-h-[112px] resize-none bg-slate-50/80 text-xs dark:bg-slate-900/70"
              />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/80">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-100">Portfolio import</div>
              <Textarea
                value={importDraft}
                onChange={(event) => setImportDraft(event.target.value)}
                placeholder="Paste portfolio JSON..."
                className="mt-2 min-h-[112px] resize-none bg-slate-50/80 text-xs dark:bg-slate-900/70"
              />
              {portfolioImportPreview && (
                <div
                  aria-label="Portfolio import preview"
                  className="mt-2 rounded-md border border-blue-100 bg-blue-50/70 p-2 dark:border-blue-950/60 dark:bg-blue-950/20"
                >
                  <PortfolioImportPreviewBadges preview={portfolioImportPreview} />
                </div>
              )}
              <Select value={deploymentEscalationAuditImportMode} onValueChange={(value) => setDeploymentEscalationAuditImportMode(value as DeploymentEscalationAuditImportMode)}>
                <SelectTrigger
                  aria-label="Deployment escalation saved-view import collision mode"
                  size="sm"
                  className="mt-2 w-full bg-slate-50/80 text-xs dark:bg-slate-900/70"
                >
                  <SelectValue placeholder="Saved-view collision mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keep-both">Keep both saved views</SelectItem>
                  <SelectItem value="replace">Replace matching saved views</SelectItem>
                  <SelectItem value="skip">Skip matching saved views</SelectItem>
                </SelectContent>
              </Select>
              {deploymentEscalationAuditLastImportSummary && (
                <div
                  aria-label="Deployment escalation saved-view import summary"
                  className="mt-2 flex flex-wrap gap-1.5 rounded-md border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <Badge variant="secondary" className="bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    {deploymentEscalationAuditLastImportSummary.total} saved {deploymentEscalationAuditLastImportSummary.total === 1 ? "view" : "views"}
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {deploymentEscalationAuditLastImportSummary.added} added
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {deploymentEscalationAuditLastImportSummary.renamed} renamed
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    {deploymentEscalationAuditLastImportSummary.replaced} replaced
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    {deploymentEscalationAuditLastImportSummary.skipped} skipped
                  </Badge>
                </div>
              )}
              <Button
                type="button"
                size="sm"
                onClick={handleImport}
                disabled={!importDraft.trim() || Boolean(portfolioImportPreview?.blockedReason)}
                className="mt-2 h-8 bg-blue-600 text-xs hover:bg-blue-700"
              >
                Import portfolio JSON
              </Button>
              {portfolioImportPreview?.blockedReason && (
                <p aria-label="Portfolio import blocked reason" className="mt-1.5 text-[11px] leading-relaxed text-red-700 dark:text-red-300">
                  {portfolioImportPreview.blockedReason}
                </p>
              )}
              {(portfolioImportAuditHistory.length > 0 || portfolioImportAuditRestoreSnapshot) && (
                <div
                  aria-label="Portfolio import audit history"
                  className="mt-2 rounded-md border border-slate-200 bg-white/70 p-2 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Import audit history</div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      {filteredPortfolioImportAuditHistory.length}/{portfolioImportAuditHistory.length} shown
                    </Badge>
                    {portfolioImportAuditRestoreSnapshot && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        {portfolioImportAuditRestoreSnapshot.entries.length} {portfolioImportAuditRestoreSnapshot.label} pruned
                      </Badge>
                    )}
                    <div className="ml-auto flex flex-wrap gap-1">
                      {portfolioImportAuditRestoreSnapshot && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          aria-label="Restore portfolio import audit history"
                          onClick={handleRestorePortfolioImportAuditHistory}
                          className="h-7 gap-1 px-2 text-[11px]"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Restore
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label="Clear matching portfolio import audit history"
                        disabled={!searchQuery.trim() || filteredPortfolioImportAuditHistory.length === 0}
                        onClick={handleClearMatchingPortfolioImportAuditHistory}
                        className="h-7 gap-1 px-2 text-[11px]"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear shown
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-label="Clear all portfolio import audit history"
                        disabled={portfolioImportAuditHistory.length === 0}
                        onClick={handleClearPortfolioImportAuditHistory}
                        className="h-7 gap-1 px-2 text-[11px] text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear all
                      </Button>
                    </div>
                  </div>
                  {filteredPortfolioImportAuditHistory.length > 0 ? (
                    <div className="mt-1.5 space-y-1.5">
                      {filteredPortfolioImportAuditHistory.slice(0, 4).map((entry) => (
                        <div key={entry.id} className="rounded-md border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-900/70">
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className={entry.status === "imported" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"}>
                              {entry.status === "imported" ? "Imported" : "Blocked"}
                            </Badge>
                            <Badge variant="secondary" className="bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                              {entry.ventureCount} {entry.ventureCount === 1 ? "venture" : "ventures"}
                            </Badge>
                            <Badge variant="secondary" className="bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                              {entry.savedViewCount} saved {entry.savedViewCount === 1 ? "view" : "views"}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                              {DEPLOYMENT_ESCALATION_AUDIT_IMPORT_MODE_LABELS[entry.mode]}
                            </Badge>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                            {formatDate(entry.recordedAt)} · {entry.added} added · {entry.renamed} renamed · {entry.replaced} replaced · {entry.skipped} skipped
                          </p>
                          {entry.blockedReason && (
                            <p className="mt-1 text-[11px] leading-relaxed text-red-700 dark:text-red-300">{entry.blockedReason}</p>
                          )}
                          {entry.compactGovernanceDigestConflictReceipts && entry.compactGovernanceDigestConflictReceipts.length > 0 && (
                            <div
                              aria-label={`Portfolio import governance digest conflict receipts ${entry.id}`}
                              className="mt-1.5 rounded border border-amber-200 bg-amber-50/70 p-2 dark:border-amber-900/70 dark:bg-amber-950/20"
                            >
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                                {entry.compactGovernanceDigestConflictReceipts.length} preview-only digest conflict {entry.compactGovernanceDigestConflictReceipts.length === 1 ? "receipt" : "receipts"}
                              </Badge>
                              <div className="mt-1 space-y-1">
                                {entry.compactGovernanceDigestConflictReceipts.slice(0, 2).map((receipt) => (
                                  <p key={`${entry.id}-${receipt}`} className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">
                                    {receipt}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      No import audit entries match the current search.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ventures</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{portfolioSummary.ventureCount}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Evidence Sources</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{portfolioSummary.evidenceSourceCount}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Planned Experiments</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{portfolioSummary.plannedExperimentCount}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Human Gates</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{portfolioSummary.humanGateCount}</div>
          </div>
        </div>

        {convertedPainMemories.length > 0 && (
          <ConvertedPainMemoryPanel memories={convertedPainMemories} />
        )}

        {convertedPricingMemories.length > 0 && (
          <ConvertedPricingMemoryPanel memories={convertedPricingMemories} />
        )}

        {mvpFeatureMemories.length > 0 && (
          <MvpFeatureMemoryPanel memories={mvpFeatureMemories} />
        )}

        {retainedUserMemories.length > 0 && (
          <RetainedUserMemoryPanel memories={retainedUserMemories} />
        )}

        {successPredictionMemories.length > 0 && (
          <SuccessPredictionMemoryPanel memories={successPredictionMemories} />
        )}

        {vanityMetricMemories.length > 0 && (
          <VanityMetricMemoryPanel memories={vanityMetricMemories} />
        )}

        {generatedCodePatternMemories.length > 0 && (
          <GeneratedCodePatternMemoryPanel memories={generatedCodePatternMemories} />
        )}

        {empiricalCalibrationMemories.length > 0 && (
          <EmpiricalCalibrationMemoryPanel memories={empiricalCalibrationMemories} />
        )}

        {fakeMarketMemories.length > 0 && (
          <FakeMarketMemoryPanel memories={fakeMarketMemories} />
        )}

        {weakBranchKillMemories.length > 0 && (
          <WeakBranchKillMemoryPanel memories={weakBranchKillMemories} />
        )}

        {wrongClaimMemories.length > 0 && (
          <WrongClaimMemoryPanel memories={wrongClaimMemories} />
        )}

        {workedChannelMemories.length > 0 && (
          <WorkedChannelMemoryPanel memories={workedChannelMemories} />
        )}

        {spawnedVentureDrafts.length > 0 && (
          <SpawnedVentureDraftPanel drafts={spawnedVentureDrafts} />
        )}

        {relatedIdeaMergeAudits.length > 0 && (
          <RelatedIdeaMergeAuditPanel audits={relatedIdeaMergeAudits} />
        )}

        {learningReinvestmentQueue.length > 0 && (
          <LearningReinvestmentQueuePanel items={learningReinvestmentQueue} />
        )}

        {opportunityDiscoveryBacklog.length > 0 && (
          <OpportunityDiscoveryBacklogPanel items={opportunityDiscoveryBacklog} />
        )}

        {overlookedOpportunityAtlas.length > 0 && (
          <OverlookedOpportunityAtlasPanel items={overlookedOpportunityAtlas} />
        )}

        {atlasValidationCommandPacks.length > 0 && (
          <AtlasValidationCommandPackPanel packs={atlasValidationCommandPacks} />
        )}

        {atlasValidationResultLedger.length > 0 && (
          <AtlasValidationResultLedgerPanel items={atlasValidationResultLedger} />
        )}

        {productBuildCommandQueue.length > 0 && (
          <ProductBuildCommandQueuePanel commands={productBuildCommandQueue} />
        )}

        {productBuildCommandRunLedger.length > 0 && (
          <ProductBuildCommandRunLedgerPanel items={productBuildCommandRunLedger} />
        )}

        {mvpReleaseWorkspaceList.length > 0 && (
          <MvpReleaseWorkspacePanel workspaces={mvpReleaseWorkspaceList} />
        )}

        {pilotCohortSignalGates.length > 0 && (
          <PilotCohortSignalGatePanel gates={pilotCohortSignalGates} />
        )}

        {noSendEmailGateWorklist.length > 0 && (
          <NoSendEmailGateWorklistPanel
            items={noSendEmailGateWorklist}
            onRecordReplyProof={handleRecordNoSendEmailGateReplyProof}
          />
        )}

        {launchControlQueue.length > 0 && (
          <LaunchControlQueuePanel items={launchControlQueue} />
        )}

        {portfolioDemandSourceBlockerSavedViewPackets.length > 0 && (
          <DemandSourceBlockerPacketInbox
            packets={portfolioDemandSourceBlockerSavedViewPackets}
            auditHistory={demandSourceBlockerPacketTriageAuditHistory}
            ownerQueue={demandSourceBlockerPacketTriageOwnerQueue}
            ownerWorkloadSummary={demandSourceBlockerPacketTriageOwnerWorkloadSummary}
            workloadDriftReports={demandSourceBlockerPacketTriageWorkloadDriftReports}
            workloadDriftReconciliation={demandSourceBlockerPacketTriageWorkloadDriftReconciliation}
            workloadPinnedSummaries={demandSourceBlockerPacketTriageWorkloadPinnedSummaries}
            handoffHealth={demandSourceBlockerPacketHandoffHealth}
            handoffRemediationQueue={demandSourceBlockerPacketHandoffRemediationQueue}
            handoffReopenEscalations={demandSourceBlockerPacketHandoffReopenEscalations}
            handoffReopenEscalationSlaReceipts={demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts}
            handoffReopenEscalationSlaResolutions={demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions}
            handoffReopenEscalationSlaBreachTrends={demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends}
            handoffReopenEscalationSlaBreachProcessPlans={demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans}
            handoffReopenEscalationSlaBreachProcessClosures={demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures}
            handoffReopenEscalationSlaBreachProcessRegressions={demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions}
            handoffReopenEscalationSlaBreachProcessRegressionClosures={demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures}
            handoffReopenEscalationSlaBreachProcessRegressionEscalations={demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations}
            regressionEscalationAuditAssignments={breachProcessRegressionEscalationAuditAssignments}
            regressionEscalationAuditClosures={breachProcessRegressionEscalationAuditClosures}
            regressionEscalationAuditReviews={breachProcessRegressionEscalationAuditReviews}
            regressionEscalationAuditAppeals={breachProcessRegressionEscalationAuditAppeals}
            onReplayPacket={handleReplayDemandSourceBlockerPacket}
            onMarkPacketTriage={handleMarkDemandSourceBlockerPacketTriage}
            onMarkWorkloadDriftReviewed={handleMarkDemandSourceBlockerWorkloadDriftReviewed}
            onPinCurrentWorkload={handlePinDemandSourceBlockerCurrentWorkload}
            onClearWorkloadDriftReview={handleClearDemandSourceBlockerWorkloadDriftReview}
            onMarkHandoffRemediationPlanned={handleMarkDemandSourceBlockerPacketHandoffRemediationPlanned}
            onCloseHandoffRemediation={handleCloseDemandSourceBlockerPacketHandoffRemediation}
            onAssignHandoffReopenEscalationSla={handleAssignDemandSourceBlockerPacketHandoffReopenEscalationSla}
            onResolveHandoffReopenEscalationSla={handleResolveDemandSourceBlockerPacketHandoffReopenEscalationSla}
            onPlanHandoffReopenEscalationSlaBreachProcess={handlePlanDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcess}
            onCloseHandoffReopenEscalationSlaBreachProcess={handleCloseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcess}
            onCloseHandoffReopenEscalationSlaBreachProcessRegression={handleCloseDemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression}
            onAssignRegressionEscalationAudit={handleAssignBreachProcessRegressionEscalationAudit}
            onCloseRegressionEscalationAudit={handleCloseBreachProcessRegressionEscalationAudit}
            onReviewRegressionEscalationAudit={handleReviewBreachProcessRegressionEscalationAudit}
            onRecordRegressionEscalationAuditAppeal={handleRecordBreachProcessRegressionEscalationAuditAppeal}
          />
        )}

        {demandCaptureProofQueue.length > 0 && (
          <DemandCaptureProofQueuePanel items={demandCaptureProofQueue} />
        )}

        {demandSourceBlockerDrilldowns.length > 0 && (
          <DemandSourceBlockerDrilldownPanel
            items={demandSourceBlockerDrilldowns}
            savedViews={demandSourceBlockerSavedViews}
            savedViewPackets={demandSourceBlockerSavedViewPackets}
            viewNameDraft={demandSourceBlockerViewNameDraft}
            onSearchSource={setSearchQuery}
            onViewNameChange={setDemandSourceBlockerViewNameDraft}
            onSaveView={handleSaveDemandSourceBlockerView}
            onApplyView={handleApplyDemandSourceBlockerView}
            onDeleteView={handleDeleteDemandSourceBlockerView}
          />
        )}

        {portfolioDecisionCommandQueue.length > 0 && (
          <PortfolioDecisionCommandQueuePanel commands={portfolioDecisionCommandQueue} />
        )}

        {failedOutreachMemories.length > 0 && (
          <FailedOutreachMemoryPanel memories={failedOutreachMemories} />
        )}

        {ventures.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mb-3 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Operating analytics</h2>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Readiness {portfolioSummary.averageReadinessScore}/100
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
              <MetricTile label="Decision ready" value={portfolioSummary.decisionReadyCount} />
              <MetricTile label="Needs pressure test" value={portfolioSummary.needsPressureTestCount} />
              <MetricTile label="Too thin" value={portfolioSummary.tooThinCount} />
              <MetricTile label="Market confidence" value={portfolioSummary.marketModelAverageConfidenceScore} />
              <MetricTile label="High-confidence markets" value={portfolioSummary.marketModelHighConfidenceCount} />
              <MetricTile label="Medium-confidence markets" value={portfolioSummary.marketModelMediumConfidenceCount} />
              <MetricTile label="Low-confidence markets" value={portfolioSummary.marketModelLowConfidenceCount} />
              <MetricTile label="Market proof gaps" value={portfolioSummary.marketModelMissingProofCount} />
              <MetricTile label="Dominant proof gap" value={portfolioSummary.dominantMarketProofGap} />
              <MetricTile label="Riskiest market" value={portfolioSummary.riskiestMarketTitle} />
              <MetricTile label="Founder memos" value={portfolioSummary.founderExecutionMemoCount} />
              <MetricTile label="Memo ready" value={portfolioSummary.founderExecutionMemoReadyCount} />
              <MetricTile label="Memo pressure-test" value={portfolioSummary.founderExecutionMemoPressureTestCount} />
              <MetricTile label="Memo blocked" value={portfolioSummary.founderExecutionMemoBlockedCount} />
              <MetricTile label="Open gaps" value={portfolioSummary.openGapTaskCount} />
              <MetricTile label="Completed follow-up outcomes" value={portfolioSummary.completedGapOutcomeCount} />
              <MetricTile label="Launched gap tasks" value={portfolioSummary.launchedGapTaskCount} />
              <MetricTile label="Kill pressure" value={portfolioSummary.killPressureCount} />
              <MetricTile label="Scale pressure" value={portfolioSummary.scalePressureCount} />
              <MetricTile label="Measured experiments" value={portfolioSummary.measuredExperimentCount} />
              <MetricTile label="Launch packs" value={portfolioSummary.experimentLaunchPackCount} />
              <MetricTile label="Launch ready" value={portfolioSummary.launchPackReadyCount} />
              <MetricTile label="Launch needs approval" value={portfolioSummary.launchPackNeedsApprovalCount} />
              <MetricTile label="Launch recorded" value={portfolioSummary.launchPackRecordedCount} />
              <MetricTile label="Launch blocked" value={portfolioSummary.launchPackBlockedCount} />
              <MetricTile label="QA reports" value={portfolioSummary.qaReleaseReportCount} />
              <MetricTile label="QA ready" value={portfolioSummary.qaReadyCount} />
              <MetricTile label="QA needs fixes" value={portfolioSummary.qaNeedsFixesCount} />
              <MetricTile label="QA blocked" value={portfolioSummary.qaBlockedCount} />
              <MetricTile label="Deployment packets" value={portfolioSummary.deploymentReadinessPacketCount} />
              <MetricTile label="Deployment ready" value={portfolioSummary.deploymentProposalReadyCount} />
              <MetricTile label="Deployment needs proof" value={portfolioSummary.deploymentNeedsProofCount} />
              <MetricTile label="Deployment blocked" value={portfolioSummary.deploymentBlockedPacketCount} />
              <MetricTile label="Deployment roadmap-owned" value={portfolioSummary.deploymentOwnedRoadmapBlockerCount} />
              <MetricTile label="Deployment support-owned" value={portfolioSummary.deploymentOwnedSupportBlockerCount} />
              <MetricTile label="Investor briefs" value={portfolioSummary.investorBriefCount} />
              <MetricTile label="Investable briefs" value={portfolioSummary.investableBriefCount} />
              <MetricTile label="Watch briefs" value={portfolioSummary.watchBriefCount} />
              <MetricTile label="Not-ready briefs" value={portfolioSummary.notReadyBriefCount} />
              <MetricTile label="Financial models" value={portfolioSummary.financialModelCount} />
              <MetricTile label="Finance score" value={portfolioSummary.averageFinanceScore} />
              <MetricTile label="Finance scale-ready" value={portfolioSummary.financialScaleReadyCount} />
              <MetricTile label="Finance needs proof" value={portfolioSummary.financialNeedsProofCount} />
              <MetricTile label="Finance runway risk" value={portfolioSummary.financialRunwayRiskCount} />
              <MetricTile label="Finance blocked" value={portfolioSummary.financialBlockedCount} />
              <MetricTile label="Revenue postures" value={portfolioSummary.revenueGenerationPostureCount} />
              <MetricTile label="Revenue capture score" value={portfolioSummary.averageRevenueGenerationCaptureScore} />
              <MetricTile label="Revenue scaling" value={portfolioSummary.revenueGenerationScalingCount} />
              <MetricTile label="Revenue repeatable" value={portfolioSummary.revenueGenerationRepeatableCount} />
              <MetricTile label="Revenue paid validation" value={portfolioSummary.revenueGenerationPaidValidationCount} />
              <MetricTile label="Revenue no evidence" value={portfolioSummary.revenueGenerationNoEvidenceCount} />
              <MetricTile label="Revenue blocked" value={portfolioSummary.revenueGenerationBlockedCount} />
              <MetricTile label="Scale plans" value={portfolioSummary.scaleStrongBranchPlanCount} />
              <MetricTile label="Scale ready plans" value={portfolioSummary.scaleStrongBranchReadyCount} />
              <MetricTile label="Scale approval needed" value={portfolioSummary.scaleStrongBranchApprovalRequiredCount} />
              <MetricTile label="Scale needs proof" value={portfolioSummary.scaleStrongBranchNeedsProofCount} />
              <MetricTile label="Scale blocked plans" value={portfolioSummary.scaleStrongBranchBlockedCount} />
              <MetricTile label="Scale spend ceiling" value={portfolioSummary.scaleStrongBranchSpendCeilingCents} />
              <MetricTile label="Spawned drafts" value={portfolioSummary.spawnedVentureDraftCount} />
              <MetricTile label="Spawned ready" value={portfolioSummary.spawnedVentureDraftReadyCount} />
              <MetricTile label="Spawned needs evidence" value={portfolioSummary.spawnedVentureDraftNeedsEvidenceCount} />
              <MetricTile label="Spawned pain branches" value={portfolioSummary.spawnedVentureDraftConvertedPainCount} />
              <MetricTile label="Spawned pricing branches" value={portfolioSummary.spawnedVentureDraftConvertedPricingCount} />
              <MetricTile label="Merge audits" value={portfolioSummary.relatedIdeaMergeAuditCount} />
              <MetricTile label="Merge reuse" value={portfolioSummary.relatedIdeaMergeReuseCount} />
              <MetricTile label="Merge merge" value={portfolioSummary.relatedIdeaMergeMergeCount} />
              <MetricTile label="Merge fork" value={portfolioSummary.relatedIdeaMergeForkCount} />
              <MetricTile label="Merge keep-separate" value={portfolioSummary.relatedIdeaMergeKeepSeparateCount} />
              <MetricTile label="Learning queue" value={portfolioSummary.learningReinvestmentQueueCount} />
              <MetricTile label="Learning ready" value={portfolioSummary.learningReinvestmentReadyCount} />
              <MetricTile label="Learning needs owner" value={portfolioSummary.learningReinvestmentNeedsOwnerCount} />
              <MetricTile label="Learning blocked" value={portfolioSummary.learningReinvestmentBlockedCount} />
              <MetricTile label="Learning watch" value={portfolioSummary.learningReinvestmentWatchCount} />
              <MetricTile label="Learning critical" value={portfolioSummary.learningReinvestmentCriticalCount} />
              <MetricTile label="Learning high" value={portfolioSummary.learningReinvestmentHighCount} />
              <MetricTile label="Opportunity backlog" value={portfolioSummary.opportunityDiscoveryBacklogCount} />
              <MetricTile label="Opportunity ready" value={portfolioSummary.opportunityDiscoveryReadyCount} />
              <MetricTile label="Opportunity needs source" value={portfolioSummary.opportunityDiscoveryNeedsSourceCount} />
              <MetricTile label="Opportunity watch" value={portfolioSummary.opportunityDiscoveryWatchCount} />
              <MetricTile label="Opportunity blocked" value={portfolioSummary.opportunityDiscoveryBlockedCount} />
              <MetricTile label="Opportunity high priority" value={portfolioSummary.opportunityDiscoveryHighPriorityCount} />
              <MetricTile label="Overlooked atlas" value={portfolioSummary.overlookedOpportunityAtlasCount} />
              <MetricTile label="Overlooked ranked" value={portfolioSummary.overlookedOpportunityRankedCount} />
              <MetricTile label="Overlooked needs source" value={portfolioSummary.overlookedOpportunityNeedsSourceCount} />
              <MetricTile label="Overlooked watch" value={portfolioSummary.overlookedOpportunityWatchCount} />
              <MetricTile label="Overlooked blocked" value={portfolioSummary.overlookedOpportunityBlockedCount} />
              <MetricTile label="Overlooked critical" value={portfolioSummary.overlookedOpportunityCriticalCount} />
              <MetricTile label="Overlooked high priority" value={portfolioSummary.overlookedOpportunityHighPriorityCount} />
              <MetricTile label="Overlooked rank score" value={portfolioSummary.averageOverlookedOpportunityRankScore} />
              <MetricTile label="Overlooked novelty score" value={portfolioSummary.averageOverlookedOpportunityNoveltyScore} />
              <MetricTile label="Validation packs" value={portfolioSummary.atlasValidationCommandPackCount} />
              <MetricTile label="Validation ready" value={portfolioSummary.atlasValidationCommandPackReadyCount} />
              <MetricTile label="Validation needs approval" value={portfolioSummary.atlasValidationCommandPackNeedsApprovalCount} />
              <MetricTile label="Validation needs source" value={portfolioSummary.atlasValidationCommandPackNeedsSourceCount} />
              <MetricTile label="Validation blocked" value={portfolioSummary.atlasValidationCommandPackBlockedCount} />
              <MetricTile label="Validation critical" value={portfolioSummary.atlasValidationCommandPackCriticalCount} />
              <MetricTile label="Validation high priority" value={portfolioSummary.atlasValidationCommandPackHighPriorityCount} />
              <MetricTile label="Validation results" value={portfolioSummary.atlasValidationResultCount} />
              <MetricTile label="Validation passed" value={portfolioSummary.atlasValidationResultPassedCount} />
              <MetricTile label="Validation failed" value={portfolioSummary.atlasValidationResultFailedCount} />
              <MetricTile label="Validation pivot" value={portfolioSummary.atlasValidationResultPivotCount} />
              <MetricTile label="Validation inconclusive" value={portfolioSummary.atlasValidationResultInconclusiveCount} />
              <MetricTile label="Validation buyers" value={portfolioSummary.atlasValidationResultQualifiedBuyerCount} />
              <MetricTile label="Validation paid signals" value={portfolioSummary.atlasValidationResultPaidPricingSignalCount} />
              <MetricTile label="Product build commands" value={portfolioSummary.productBuildCommandCount} />
              <MetricTile label="Product ready" value={portfolioSummary.productBuildReadyCount} />
              <MetricTile label="Product needs proof" value={portfolioSummary.productBuildNeedsProofCount} />
              <MetricTile label="Product blocked" value={portfolioSummary.productBuildBlockedCount} />
              <MetricTile label="Product verified" value={portfolioSummary.productBuildVerifiedCount} />
              <MetricTile label="Product critical" value={portfolioSummary.productBuildCriticalCount} />
              <MetricTile label="Product build runs" value={portfolioSummary.productBuildRunCount} />
              <MetricTile label="Product runs executed" value={portfolioSummary.productBuildRunExecutedCount} />
              <MetricTile label="Product runs imported" value={portfolioSummary.productBuildRunImportedCount} />
              <MetricTile label="Product runs promoted" value={portfolioSummary.productBuildRunPromotedCount} />
              <MetricTile label="MVP release workspaces" value={portfolioSummary.mvpReleaseWorkspaceCount} />
              <MetricTile label="Release ready" value={portfolioSummary.mvpReleaseReadyCount} />
              <MetricTile label="Release needs run proof" value={portfolioSummary.mvpReleaseNeedsRunProofCount} />
              <MetricTile label="Release needs QA proof" value={portfolioSummary.mvpReleaseNeedsQaProofCount} />
              <MetricTile label="Release blocked" value={portfolioSummary.mvpReleaseBlockedCount} />
              <MetricTile label="Pilot signal gates" value={portfolioSummary.pilotCohortSignalGateCount} />
              <MetricTile label="Pilot gates ready" value={portfolioSummary.pilotCohortSignalGateReadyCount} />
              <MetricTile label="Pilot gates need release" value={portfolioSummary.pilotCohortSignalGateNeedsReleaseWorkspaceCount} />
              <MetricTile label="Pilot gates need signal" value={portfolioSummary.pilotCohortSignalGateNeedsInboundSignalCount} />
              <MetricTile label="Pilot gates blocked" value={portfolioSummary.pilotCohortSignalGateBlockedCount} />
              <MetricTile label="Pilot gates critical" value={portfolioSummary.pilotCohortSignalGateCriticalCount} />
              <MetricTile label="Pilot gates high" value={portfolioSummary.pilotCohortSignalGateHighCount} />
              <MetricTile label="Email gates" value={portfolioSummary.noSendEmailGateWorklistCount} />
              <MetricTile label="Email draft ready" value={portfolioSummary.noSendEmailGateDraftReadyCount} />
              <MetricTile label="Email needs pilot" value={portfolioSummary.noSendEmailGateNeedsPilotGateCount} />
              <MetricTile label="Email blocked" value={portfolioSummary.noSendEmailGateBlockedCount} />
              <MetricTile label="Email critical" value={portfolioSummary.noSendEmailGateCriticalCount} />
              <MetricTile label="Control queue" value={portfolioSummary.launchControlQueueCount} />
              <MetricTile label="Control ready" value={portfolioSummary.launchControlReadyCount} />
              <MetricTile label="Control approval" value={portfolioSummary.launchControlNeedsApprovalCount} />
              <MetricTile label="Control blocked" value={portfolioSummary.launchControlBlockedCount} />
              <MetricTile label="Control recorded" value={portfolioSummary.launchControlRecordedCount} />
              <MetricTile label="Control critical" value={portfolioSummary.launchControlCriticalCount} />
              <MetricTile label="Capture queue" value={portfolioSummary.demandCaptureProofQueueCount} />
              <MetricTile label="Capture verified" value={portfolioSummary.demandCaptureCapturedCount} />
              <MetricTile label="Capture follow-up" value={portfolioSummary.demandCaptureNeedsFollowUpCount} />
              <MetricTile label="Capture blocked" value={portfolioSummary.demandCaptureBlockedCount} />
              <MetricTile label="Capture weak" value={portfolioSummary.demandCaptureWeakCount} />
              <MetricTile label="Capture critical" value={portfolioSummary.demandCaptureCriticalCount} />
              <MetricTile label="Command queue" value={portfolioSummary.portfolioDecisionCommandCount} />
              <MetricTile label="Command ready" value={portfolioSummary.portfolioDecisionReadyCount} />
              <MetricTile label="Command needs proof" value={portfolioSummary.portfolioDecisionNeedsProofCount} />
              <MetricTile label="Command blocked" value={portfolioSummary.portfolioDecisionBlockedCount} />
              <MetricTile label="Command review" value={portfolioSummary.portfolioDecisionHumanReviewCount} />
              <MetricTile label="Command continue" value={portfolioSummary.portfolioDecisionContinueCount} />
              <MetricTile label="Command pivot" value={portfolioSummary.portfolioDecisionPivotCount} />
              <MetricTile label="Command pause" value={portfolioSummary.portfolioDecisionPauseCount} />
              <MetricTile label="Command kill" value={portfolioSummary.portfolioDecisionKillCount} />
              <MetricTile label="Command scale" value={portfolioSummary.portfolioDecisionScaleCount} />
              <MetricTile label="Command source blockers" value={portfolioSummary.portfolioDecisionDemandSourceBlockerCount} />
              <MetricTile label="Command source blocked" value={portfolioSummary.portfolioDecisionDemandSourceBlockedCount} />
              <MetricTile label="Command source weak" value={portfolioSummary.portfolioDecisionDemandSourceWeakPressureCount} />
              <MetricTile label="Command blocker types" value={portfolioSummary.portfolioDecisionDemandSourceBlockerTypeCount} />
              <MetricTile label="Blocker source mix" value={portfolioSummary.portfolioDecisionDemandSourceBlockerBreakdown} />
              <MetricTile label="Pivot source blockers" value={portfolioSummary.portfolioDecisionPivotDemandSourceBlockerCount} />
              <MetricTile label="Pause source blockers" value={portfolioSummary.portfolioDecisionPauseDemandSourceBlockerCount} />
              <MetricTile label="Kill source blockers" value={portfolioSummary.portfolioDecisionKillDemandSourceBlockerCount} />
              <MetricTile label="Demand passed" value={portfolioSummary.demandPassCount} />
              <MetricTile label="Demand failed" value={portfolioSummary.demandFailCount} />
              <MetricTile label="Demand inconclusive" value={portfolioSummary.demandInconclusiveCount} />
              <MetricTile label="Demand drift measured" value={portfolioSummary.demandDriftMeasuredCount} />
              <MetricTile label="Demand confirmed" value={portfolioSummary.demandDriftConfirmedCount} />
              <MetricTile label="Demand overestimated" value={portfolioSummary.demandOverestimatedCount} />
              <MetricTile label="Demand underestimated" value={portfolioSummary.demandUnderestimatedCount} />
              <MetricTile label="Demand mixed" value={portfolioSummary.demandDriftMixedCount} />
              <MetricTile label="Prediction snapshots" value={portfolioSummary.predictionSnapshotCount} />
              <MetricTile label="Predictions confirmed" value={portfolioSummary.confirmedPredictionCount} />
              <MetricTile label="Predictions surprised" value={portfolioSummary.surprisedPredictionCount} />
              <MetricTile label="Pricing signals" value={portfolioSummary.pricingSignalCount} />
              <MetricTile label="Paid pricing signals" value={portfolioSummary.paidPricingSignalCount} />
              <MetricTile label="Pricing validated" value={portfolioSummary.pricingValidatedCount} />
              <MetricTile label="Pricing rejected" value={portfolioSummary.pricingRejectedCount} />
              <MetricTile label="Customer interviews" value={portfolioSummary.customerInterviewCount} />
              <MetricTile label="Positive interviews" value={portfolioSummary.positiveInterviewCount} />
              <MetricTile label="Negative interviews" value={portfolioSummary.negativeInterviewCount} />
              <MetricTile label="Feature requests" value={portfolioSummary.featureRequestCount} />
              <MetricTile label="Outreach approvals" value={portfolioSummary.outreachApprovalCount} />
              <MetricTile label="Human-approved outreach" value={portfolioSummary.humanApprovedOutreachCount} />
              <MetricTile label="Manual outreach planned" value={portfolioSummary.manualOutreachPlannedCount} />
              <MetricTile label="No-send outreach" value={portfolioSummary.notSentOutreachCount} />
              <MetricTile label="Outreach campaigns" value={portfolioSummary.outreachCampaignCount} />
              <MetricTile label="Campaign ready" value={portfolioSummary.outreachCampaignReadyCount} />
              <MetricTile label="Campaign needs approval" value={portfolioSummary.outreachCampaignNeedsApprovalCount} />
              <MetricTile label="Campaign blocked" value={portfolioSummary.outreachCampaignBlockedCount} />
              <MetricTile label="Campaign recorded" value={portfolioSummary.outreachCampaignRecordedCount} />
              <MetricTile label="Risk records" value={portfolioSummary.riskRecordCount} />
              <MetricTile label="Open risks" value={portfolioSummary.openRiskCount} />
              <MetricTile label="High risks" value={portfolioSummary.highRiskCount} />
              <MetricTile label="Resolved risks" value={portfolioSummary.resolvedRiskCount} />
              <MetricTile label="Customer inbox risks" value={portfolioSummary.customerInboxRiskCount} />
              <MetricTile label="Untriaged risk signals" value={portfolioSummary.untriagedRiskCandidateCount} />
              <MetricTile label="MVP build workspaces" value={portfolioSummary.mvpBuildWorkspaceCount} />
              <MetricTile label="Repos attached" value={portfolioSummary.mvpRepoAttachedCount} />
              <MetricTile label="Executable MVPs" value={portfolioSummary.mvpExecutableCount} />
              <MetricTile label="MVP blockers" value={portfolioSummary.mvpBlockedCount} />
              <MetricTile label="MVP checks passed" value={portfolioSummary.mvpVerificationPassedCount} />
              <MetricTile label="Generated app handoffs" value={portfolioSummary.generatedAppHandoffCount} />
              <MetricTile label="App source pending" value={portfolioSummary.generatedAppSourcePendingCount} />
              <MetricTile label="App briefs ready" value={portfolioSummary.generatedAppBriefReadyCount} />
              <MetricTile label="App repos attached" value={portfolioSummary.generatedAppRepoAttachedCount} />
              <MetricTile label="Executable app handoffs" value={portfolioSummary.generatedAppExecutableCount} />
              <MetricTile label="Source scaffolds" value={portfolioSummary.generatedAppSourceScaffoldCount} />
              <MetricTile label="Source scaffold files" value={portfolioSummary.generatedAppSourceFileCount} />
              <MetricTile label="Ready to materialize" value={portfolioSummary.generatedAppReadyToMaterializeCount} />
              <MetricTile label="No-fake-source guards" value={portfolioSummary.generatedAppNoFakeSourceGuardCount} />
              <MetricTile label="App proof reports" value={portfolioSummary.generatedAppVerificationProofCount} />
              <MetricTile label="Verified app proofs" value={portfolioSummary.generatedAppVerifiedProofCount} />
              <MetricTile label="Partial app proofs" value={portfolioSummary.generatedAppPartialProofCount} />
              <MetricTile label="Missing app proofs" value={portfolioSummary.generatedAppMissingProofCount} />
              <MetricTile label="Artifact records" value={portfolioSummary.artifactRecordCount} />
              <MetricTile label="Verified artifacts" value={portfolioSummary.verifiedArtifactCount} />
              <MetricTile label="Blocked artifacts" value={portfolioSummary.blockedArtifactCount} />
              <MetricTile label="Deployment proofs" value={portfolioSummary.deploymentProofCount} />
              <MetricTile label="Changelog entries" value={portfolioSummary.changelogEntryCount} />
              <MetricTile label="Money signals" value={portfolioSummary.moneySignalCount} />
              <MetricTile label="Revenue" value={portfolioSummary.revenueCents / 100} />
              <MetricTile label="Expenses" value={portfolioSummary.expenseCents / 100} />
              <MetricTile label="Committed revenue" value={portfolioSummary.committedRevenueCents / 100} />
              <MetricTile label="Runway risks" value={portfolioSummary.runwayRiskCount} />
              <MetricTile label="Roadmap tasks" value={portfolioSummary.roadmapTaskCount} />
              <MetricTile label="Open roadmap tasks" value={portfolioSummary.openRoadmapTaskCount} />
              <MetricTile label="High roadmap tasks" value={portfolioSummary.highRoadmapTaskCount} />
              <MetricTile label="Support-load tasks" value={portfolioSummary.supportLoadTaskCount} />
              <MetricTile label="Roadmap inbox signals" value={portfolioSummary.untriagedRoadmapCandidateCount} />
              <MetricTile label="Support issues" value={portfolioSummary.supportIssueCount} />
              <MetricTile label="Support questions" value={portfolioSummary.supportQuestionCount} />
              <MetricTile label="Pilot issues" value={portfolioSummary.pilotIssueCount} />
              <MetricTile label="Open support issues" value={portfolioSummary.openSupportIssueCount} />
              <MetricTile label="Critical support" value={portfolioSummary.criticalSupportIssueCount} />
              <MetricTile label="Resolved support" value={portfolioSummary.resolvedSupportIssueCount} />
              <MetricTile label="Retention risks" value={portfolioSummary.retentionRiskIssueCount} />
              <MetricTile label="Support inbox signals" value={portfolioSummary.untriagedSupportIssueCandidateCount} />
              <MetricTile label="Activation cohorts" value={portfolioSummary.activationCohortCount} />
              <MetricTile label="Cohort signups" value={portfolioSummary.cohortSignupCount} />
              <MetricTile label="Activated users" value={portfolioSummary.activatedUserCount} />
              <MetricTile label="Retained users" value={portfolioSummary.retainedUserCount} />
              <MetricTile label="Paid cohort users" value={portfolioSummary.paidCohortUserCount} />
              <MetricTile label="Cohort revenue" value={portfolioSummary.cohortRevenueCents / 100} />
              <MetricTile label="Cohort support issues" value={portfolioSummary.cohortSupportIssueCount} />
              <MetricTile label="Activation rate" value={portfolioSummary.averageActivationRate} />
              <MetricTile label="Retention rate" value={portfolioSummary.averageRetentionRate} />
              <MetricTile label="Cohort inbox signals" value={portfolioSummary.untriagedActivationCohortCandidateCount} />
              <MetricTile label="Channel economics" value={portfolioSummary.channelEconomicsCount} />
              <MetricTile label="Acquisition spend" value={portfolioSummary.acquisitionSpendCents / 100} />
              <MetricTile label="Channel signups" value={portfolioSummary.channelSignupCount} />
              <MetricTile label="Channel activated" value={portfolioSummary.channelActivatedCount} />
              <MetricTile label="Channel paid users" value={portfolioSummary.channelPaidUserCount} />
              <MetricTile label="Channel revenue" value={portfolioSummary.channelRevenueCents / 100} />
              <MetricTile label="Blended CAC" value={portfolioSummary.blendedCacCents / 100} />
              <MetricTile label="Paid-back channels" value={portfolioSummary.paidBackChannelCount} />
              <MetricTile label="Channel inbox signals" value={portfolioSummary.untriagedChannelEconomicsCandidateCount} />
              <MetricTile label="Kill-rule signals" value={portfolioSummary.killRuleSignalCount} />
              <MetricTile label="Kill recommendations" value={portfolioSummary.killRuleKillRecommendationCount} />
              <MetricTile label="Pause recommendations" value={portfolioSummary.killRulePauseRecommendationCount} />
              <MetricTile label="Pivot recommendations" value={portfolioSummary.killRulePivotRecommendationCount} />
              <MetricTile label="Scale recommendations" value={portfolioSummary.killRuleScaleRecommendationCount} />
              <MetricTile label="Kill decision artifacts" value={portfolioSummary.killDecisionArtifactCount} />
              <MetricTile label="Stop decisions" value={portfolioSummary.killDecisionStopCount} />
              <MetricTile label="Continue decisions" value={portfolioSummary.killDecisionContinueCount} />
              <MetricTile label="Scale decisions" value={portfolioSummary.killDecisionScaleCount} />
              <MetricTile label="Weak kill memories" value={portfolioSummary.weakBranchKillMemoryCount} />
              <MetricTile label="Weak kill recommended" value={portfolioSummary.weakBranchKillRecommendedCount} />
              <MetricTile label="Weak pause recommended" value={portfolioSummary.weakBranchPauseRecommendedCount} />
              <MetricTile label="Weak branches archived" value={portfolioSummary.weakBranchArchivedCount} />
              <MetricTile label="Weak revival watch" value={portfolioSummary.weakBranchRevivalWatchCount} />
              <MetricTile label="Autonomy audits" value={portfolioSummary.autonomyAuditCount} />
              <MetricTile label="External approved" value={portfolioSummary.externalApprovedActionCount} />
              <MetricTile label="External blocked" value={portfolioSummary.externalBlockedActionCount} />
              <MetricTile label="Replayable actions" value={portfolioSummary.replayableActionCount} />
              <MetricTile label="Autonomy inbox signals" value={portfolioSummary.untriagedAutonomyAuditCandidateCount} />
              <MetricTile label="Stale deploy escalations" value={portfolioSummary.deploymentStaleEscalationCandidateCount} />
              <MetricTile label="Agent runs" value={portfolioSummary.agentRunCount} />
              <MetricTile label="Model-call logs" value={portfolioSummary.modelCallLogCount} />
              <MetricTile label="Replayable agent runs" value={portfolioSummary.replayableAgentRunCount} />
              <MetricTile label="Blocked agent runs" value={portfolioSummary.blockedAgentRunCount} />
              <MetricTile label="Agent-run inbox signals" value={portfolioSummary.untriagedAgentRunCandidateCount} />
              <MetricTile label="Competitor watches" value={portfolioSummary.competitorRecordCount} />
              <MetricTile label="High-threat competitors" value={portfolioSummary.highThreatCompetitorCount} />
              <MetricTile label="Substitute watches" value={portfolioSummary.substituteCompetitorCount} />
              <MetricTile label="Competitor inbox signals" value={portfolioSummary.untriagedCompetitorCandidateCount} />
              <MetricTile label="Browser research tasks" value={portfolioSummary.browserResearchTaskCount} />
              <MetricTile label="Queued browser research" value={portfolioSummary.queuedBrowserResearchTaskCount} />
              <MetricTile label="Captured browser evidence" value={portfolioSummary.capturedBrowserResearchTaskCount} />
              <MetricTile label="Blocked browser research" value={portfolioSummary.blockedBrowserResearchTaskCount} />
              <MetricTile label="Browser research inbox" value={portfolioSummary.untriagedBrowserResearchCandidateCount} />
            </div>
            {deploymentOwnerWorklist.owners.length > 0 && (
              <section
                aria-label="Deployment owner worklist"
                className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50/50 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/20"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <PackageCheck className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
                    <h3 className="text-xs font-semibold text-cyan-900 dark:text-cyan-100">Deployment owner worklist</h3>
                    <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                      {displayedDeploymentOwnerItems.length} item{displayedDeploymentOwnerItems.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                  <Select value={deploymentOwnerFilter} onValueChange={setDeploymentOwnerFilter}>
                    <SelectTrigger
                      aria-label="Deployment owner filter"
                      size="sm"
                      className="w-full bg-white/80 text-xs dark:bg-slate-950/70 sm:w-[220px]"
                    >
                      <SelectValue placeholder="All owners" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All owners</SelectItem>
                      {deploymentOwnerWorklist.owners.map((owner) => (
                        <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {deploymentOwnerWorkload.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Deployment workload summary</div>
                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      {deploymentOwnerWorkload.map((summary) => (
                        <div key={summary.owner} className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200">
                              {summary.owner} workload
                            </Badge>
                            <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                              {summary.unresolvedCount} unresolved
                            </Badge>
                            <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                              {summary.productionCount} production
                            </Badge>
                            <Badge variant="secondary" className={summary.staleCount > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
                              {summary.staleCount} stale
                            </Badge>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                            Candidate: {summary.candidateCount}; Queued: {summary.queuedCount}; Triaged: {summary.triagedCount}; In progress: {summary.inProgressCount}; Blocked: {summary.blockedCount}; Done: {summary.doneCount}; Resolved: {summary.resolvedCount}.
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                            SLA: Fresh {summary.freshCount}, Watch {summary.watchCount}, Stale {summary.staleCount}.
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                            Environments: Production {summary.productionCount}, Staging {summary.stagingCount}, Preview {summary.previewCount}, Local {summary.localCount}.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div aria-label="Deployment chart drilldowns" className="mt-2 rounded-md border border-cyan-200 bg-white/60 p-2 dark:border-cyan-900/70 dark:bg-slate-950/50">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Chart drilldowns</span>
                    {deploymentOwnerWorkload.map((summary) => (
                      <Button
                        key={summary.owner}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeploymentOwnerFilter(summary.owner)}
                        className="h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                      >
                        Drilldown owner {summary.owner}
                      </Button>
                    ))}
                    {(["production", "staging", "preview", "local"] as const).map((environment) => deploymentOwnerWorklist.items.some((item) => item.targetId === environment) && (
                      <Button
                        key={environment}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeploymentEnvironmentFilter(environment)}
                        className="h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                      >
                        Drilldown {environment}
                      </Button>
                    ))}
                    {(["stale", "watch", "fresh"] as const).map((slaStatus) => deploymentOwnerWorklist.items.some((item) => item.slaStatus === slaStatus) && (
                      <Button
                        key={slaStatus}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeploymentSlaFilter(slaStatus)}
                        className="h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                      >
                        Drilldown {slaStatus} SLA
                      </Button>
                    ))}
                    {deploymentStatusDrilldowns.map((status) => (
                      <Button
                        key={status}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeploymentStatusFilter(status)}
                        className="h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                      >
                        Drilldown status {status}
                      </Button>
                    ))}
                    {deploymentDrilldownActive && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={clearDeploymentDrilldowns}
                        className="h-7 border-slate-200 bg-white/80 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
                      >
                        Clear deployment drilldowns
                      </Button>
                    )}
                  </div>
                </div>
                <div aria-label="Stale deployment escalation queue" className="mt-2 rounded-md border border-cyan-200 bg-white/60 p-2 dark:border-cyan-900/70 dark:bg-slate-950/50">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Stale deployment escalation queue</span>
                    <Badge variant="secondary" className={deploymentEscalationCandidates.length > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
                      {deploymentEscalationCandidates.length} no-send escalation{deploymentEscalationCandidates.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                  {deploymentEscalationCandidates[0] ? (
                    <div className="mt-2 rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
                      <p className="text-[11px] font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{deploymentEscalationCandidates[0].venture.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{deploymentEscalationCandidates[0].candidate.actionType}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{deploymentEscalationCandidates[0].candidate.riskNote}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-cyan-700 dark:text-cyan-200">Next: {deploymentEscalationCandidates[0].candidate.nextAction}</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRecordDeploymentEscalationAudit(deploymentEscalationCandidates[0].venture.id, deploymentEscalationCandidates[0].candidate)}
                        className="mt-2 h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                      >
                        Record no-send escalation audit
                      </Button>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      No stale no-send deployment escalations are waiting.
                    </p>
                  )}
                </div>
                <div aria-label="Deployment escalation audit replay" className="mt-2 rounded-md border border-slate-200 bg-white/60 p-2 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Deployment escalation audit replay</span>
                    <Badge variant="secondary" className={deploymentEscalationAuditRollup.count > 0 ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200" : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"}>
                      {deploymentEscalationAuditRollup.count} recorded
                    </Badge>
                    <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                      {deploymentEscalationAuditRollup.noSendCount} no-send
                    </Badge>
                    <Badge variant="secondary" className={deploymentEscalationAuditRollup.externalSideEffectCount > 0 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
                      {deploymentEscalationAuditRollup.externalSideEffectCount} external side effects
                    </Badge>
                    <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                      {deploymentEscalationAuditRollup.replayableCount} replayable
                    </Badge>
                    <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                      {displayedDeploymentEscalationAudits.length} shown
                    </Badge>
                  </div>
                  {deploymentEscalationAuditRollup.count > 0 && (
                    <div aria-label="Deployment escalation audit filters" className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                      <Select value={deploymentEscalationAuditStatusFilter} onValueChange={(value) => setDeploymentEscalationAuditStatusFilter(value as "all" | VentureAutonomyAuditStatus)}>
                        <SelectTrigger
                          aria-label="Deployment escalation audit status filter"
                          size="sm"
                          className="w-full bg-white/80 text-xs dark:bg-slate-950/70"
                        >
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          {deploymentEscalationAuditStatuses.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={deploymentEscalationAuditSideEffectFilter} onValueChange={(value) => setDeploymentEscalationAuditSideEffectFilter(value as "all" | VentureAutonomySideEffect)}>
                        <SelectTrigger
                          aria-label="Deployment escalation audit side-effect filter"
                          size="sm"
                          className="w-full bg-white/80 text-xs dark:bg-slate-950/70"
                        >
                          <SelectValue placeholder="All side effects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All side effects</SelectItem>
                          {deploymentEscalationAuditSideEffects.map((sideEffect) => (
                            <SelectItem key={sideEffect} value={sideEffect}>{sideEffect}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Select value={deploymentEscalationAuditActorFilter} onValueChange={setDeploymentEscalationAuditActorFilter}>
                          <SelectTrigger
                            aria-label="Deployment escalation audit actor filter"
                            size="sm"
                            className="w-full bg-white/80 text-xs dark:bg-slate-950/70"
                          >
                            <SelectValue placeholder="All actors" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All actors</SelectItem>
                            {deploymentEscalationAuditActors.map((actor) => (
                              <SelectItem key={actor} value={actor}>{actor}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {deploymentEscalationAuditFilterActive && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={clearDeploymentEscalationAuditFilters}
                            className="h-8 shrink-0 border-slate-200 bg-white/80 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <div aria-label="Deployment escalation saved views" className="mt-2 rounded-md border border-slate-200 bg-white/70 p-2 dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        aria-label="Deployment escalation saved view name"
                        value={deploymentEscalationAuditViewNameDraft}
                        onChange={(event) => setDeploymentEscalationAuditViewNameDraft(event.target.value)}
                        placeholder="Saved view name"
                        className="h-8 min-w-[180px] flex-1 bg-white/80 text-xs dark:bg-slate-950/70"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleSaveDeploymentEscalationAuditView}
                        className="h-8 gap-1.5 border-slate-200 bg-white/80 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        Save escalation view
                      </Button>
                    </div>
                    {deploymentEscalationAuditSavedViews.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {deploymentEscalationAuditSavedViews.map((view) => (
                          <div key={view.id} className="flex items-center gap-1 rounded-md border border-slate-200 bg-white/80 p-1 dark:border-slate-800 dark:bg-slate-950/70">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApplyDeploymentEscalationAuditView(view)}
                              className="h-6 px-2 text-[11px] text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                            >
                              Apply saved view {view.name}
                            </Button>
                            <Badge
                              variant="secondary"
                              title={[
                                view.exportedAt ? `Exported ${view.exportedAt}` : "",
                                view.importedAt ? `Imported ${view.importedAt}` : "",
                              ].filter(Boolean).join(" · ")}
                              className={view.source === "imported" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"}
                            >
                              {view.source === "imported" ? `Imported${view.exportedBy ? ` · ${view.exportedBy}` : ""}` : "Local"}
                            </Badge>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              aria-label={`Delete saved view ${view.name}`}
                              onClick={() => handleDeleteDeploymentEscalationAuditView(view.id)}
                              className="h-6 w-6 p-0 text-slate-500 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        No saved escalation audit filter views yet.
                      </p>
                    )}
                  </div>
                  {displayedDeploymentEscalationAudits[0] ? (
                    <div className="mt-2 rounded-md border border-slate-200 bg-white/75 p-2 dark:border-slate-800 dark:bg-slate-950/60">
                      <p className="text-[11px] font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{displayedDeploymentEscalationAudits[0].ventureTitle}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{displayedDeploymentEscalationAudits[0].actionType}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        Status: {displayedDeploymentEscalationAudits[0].status}; side effect: {displayedDeploymentEscalationAudits[0].sideEffect}; source: {displayedDeploymentEscalationAudits[0].sourceRecordId ?? "none"}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Replay: {displayedDeploymentEscalationAudits[0].replayNote}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Evidence: {displayedDeploymentEscalationAudits[0].evidence}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {displayedDeploymentEscalationAudits[0].nextAction}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {deploymentEscalationAuditRollup.count > 0 ? "No recorded no-send deployment escalation audits match these filters." : "No recorded no-send deployment escalation audits yet."}
                    </p>
                  )}
                  <Textarea
                    readOnly
                    aria-label="Deployment escalation audit markdown"
                    value={deploymentEscalationAuditRollup.markdown}
                    className="mt-2 min-h-[88px] resize-none bg-white/80 text-[11px] dark:bg-slate-950/70"
                  />
                </div>
                {displayedDeploymentOwnerItems.length > 0 ? (
                  <div aria-label="Deployment owner work items" className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
                    {displayedDeploymentOwnerItems.slice(0, 8).map((item) => (
                      <div key={item.id} className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200">
                            {item.owner}
                          </Badge>
                          <Badge variant="secondary" className={deploymentEnvironmentStatusBadge(item.targetStatus)}>
                            {item.targetLabel}: {item.targetStatus}
                          </Badge>
                          <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                            {item.workType}
                          </Badge>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            {item.status}
                          </Badge>
                          <Badge variant="secondary" className={item.slaStatus === "stale" ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : item.slaStatus === "watch" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
                            {item.slaStatus}
                          </Badge>
                        </div>
                        <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{item.ventureTitle}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{item.title}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Age: {item.ageDays} day{item.ageDays === 1 ? "" : "s"}. {item.slaReason}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{item.proofSummary}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-cyan-700 dark:text-cyan-200">Next: {item.nextAction}</p>
                        {item.status === "candidate" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleRecordDeploymentOwnerWorkItem(item)}
                            className="mt-2 h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                          >
                            {item.workType === "roadmap-task" ? "Record roadmap task" : "Record support issue"}
                          </Button>
                        )}
                        {item.workType === "roadmap-task" && item.status !== "candidate" && item.status !== "done" && item.status !== "dismissed" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdvanceDeploymentOwnerWorkItem(item)}
                            className="mt-2 h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                          >
                            Mark roadmap done
                          </Button>
                        )}
                        {item.workType === "support-issue" && item.status !== "candidate" && item.status !== "resolved" && item.status !== "dismissed" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdvanceDeploymentOwnerWorkItem(item)}
                            className="mt-2 h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                          >
                            Resolve support issue
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    No owned deployment blockers match this owner filter.
                  </p>
                )}
              </section>
            )}
          </div>
        )}

        {filteredVentures.length > 0 && (
          <PortfolioChartPanel
            chartPack={portfolioChartPack}
            onDeploymentEscalationStatusDrilldown={setDeploymentEscalationAuditStatusFilter}
            onDeploymentEscalationSideEffectDrilldown={setDeploymentEscalationAuditSideEffectFilter}
            onDeploymentEscalationActorDrilldown={setDeploymentEscalationAuditActorFilter}
          />
        )}

        {ventures.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px]">
              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-100">Search venture memory</div>
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search ventures or import audits by buyer, pain, channel, reason, or outcome..."
                  className="mt-2 bg-slate-50/80 text-sm dark:bg-slate-900/70"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-100">
                  <ListFilter className="h-3.5 w-3.5 text-slate-400" />
                  Evidence filter
                </div>
                <Select value={evidenceFilter} onValueChange={(value) => setEvidenceFilter(value as VentureEvidenceFilter)}>
                  <SelectTrigger
                    aria-label="Evidence filter"
                    size="sm"
                    className="mt-2 w-full bg-slate-50/80 text-sm dark:bg-slate-900/70"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VENTURE_EVIDENCE_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {ventures.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-slate-800 dark:bg-slate-950/70">
            <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />
            <h2 className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No saved venture workspaces</h2>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Launch a Market Research mission, open results, and save the Venture Operating Workspace to start a portfolio record.
            </p>
          </div>
        ) : filteredVentures.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-slate-800 dark:bg-slate-950/70">
            <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />
            <h2 className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No ventures match this search</h2>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Search covers buyer, pain, channel, evidence, lifecycle status, experiment result, and kill criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredVentures.map((venture) => (
              <VentureCard
                key={venture.id}
                venture={venture}
                onRecordExperiment={handleRecordExperiment}
                onRecordPricingSignal={handleRecordPricingSignal}
                onRecordCustomerInterview={handleRecordCustomerInterview}
                onRecordOutreachApproval={handleRecordOutreachApproval}
                onRecordRisk={handleRecordRisk}
                onRecordMvpBuildWorkspace={handleRecordMvpBuildWorkspace}
                onRecordArtifact={handleRecordArtifact}
                onRecordGeneratedAppVerifierReport={handleRecordGeneratedAppVerifierReport}
                onRecordProductBuildCommandRun={handleRecordProductBuildCommandRun}
                onRecordMoneySignal={handleRecordMoneySignal}
                onRecordRoadmapTask={handleRecordRoadmapTask}
                onRecordSupportIssue={handleRecordSupportIssue}
                onRecordActivationCohort={handleRecordActivationCohort}
                onRecordChannelEconomics={handleRecordChannelEconomics}
                onRecordAutonomyAudit={handleRecordAutonomyAudit}
                onRecordAgentRun={handleRecordAgentRun}
                onRecordCompetitor={handleRecordCompetitor}
                onRecordBrowserResearchTask={handleRecordBrowserResearchTask}
                onRecordAtlasValidationResult={handleRecordAtlasValidationResult}
                defaultRiskOwner={currentUser?.email ?? ownerKey}
                onRecordDecision={handleRecordDecision}
                onLaunchGapMission={handleLaunchGapMission}
                onRecordGapOutcome={handleRecordGapOutcome}
                isLaunchingGapMission={isCreatingFollowUp}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function MetricTile({ label, value }: { label: string; value: number | string }) {
  const valueClassName = typeof value === "number"
    ? "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50"
    : "mt-1 text-xs font-semibold leading-snug text-slate-900 dark:text-slate-50";

  return (
    <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-900/70">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
}

function MvpCheckSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: VentureMvpCheckStatus;
  onChange: (value: VentureMvpCheckStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(nextValue) => onChange(nextValue as VentureMvpCheckStatus)}>
      <SelectTrigger
        aria-label={label}
        size="sm"
        className="w-full border-teal-200 bg-white/80 text-xs dark:border-teal-900/70 dark:bg-slate-950/70"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {VENTURE_MVP_CHECK_STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function VentureCard({
  venture,
  onRecordExperiment,
  onRecordPricingSignal,
  onRecordCustomerInterview,
  onRecordOutreachApproval,
  onRecordRisk,
  onRecordMvpBuildWorkspace,
  onRecordArtifact,
  onRecordGeneratedAppVerifierReport,
  onRecordProductBuildCommandRun,
  onRecordMoneySignal,
  onRecordRoadmapTask,
  onRecordSupportIssue,
  onRecordActivationCohort,
  onRecordChannelEconomics,
  onRecordAutonomyAudit,
  onRecordAgentRun,
  onRecordCompetitor,
  onRecordBrowserResearchTask,
  onRecordAtlasValidationResult,
  defaultRiskOwner,
  onRecordDecision,
  onLaunchGapMission,
  onRecordGapOutcome,
  isLaunchingGapMission,
}: {
  venture: SavedVentureWorkspace;
  onRecordExperiment: (ventureId: string, experimentId: string, result: string, interpretation: string) => void;
  onRecordPricingSignal: (
    ventureId: string,
    signal: {
      qualifiedBuyerCount: number;
      paidCommitmentCount: number;
      invoiceRequestCount: number;
      acceptedPrice: string;
      objectionSummary: string;
      evidenceNote: string;
    },
  ) => void;
  onRecordCustomerInterview: (
    ventureId: string,
    interview: {
      persona: string;
      channel: string;
      painQuote: string;
      willingnessToPay: string;
      objections: string;
      requestedFeatures: string;
      sentiment: VentureInterviewSentiment;
      evidenceNote: string;
    },
  ) => void;
  onRecordOutreachApproval: (
    ventureId: string,
    approval: {
      sourceInterviewId?: string;
      contactPersona: string;
      channel: string;
      messageDraft: string;
      status: VentureOutreachApprovalStatus;
      riskNote: string;
      nextAction: string;
    },
  ) => void;
  onRecordRisk: (
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
      resolutionEvidence: string;
    },
  ) => void;
  onRecordMvpBuildWorkspace: (
    ventureId: string,
    build: {
      status: VentureMvpBuildStatus;
      owner: string;
      repoPath: string;
      setupCheck: VentureMvpCheckStatus;
      typecheckCheck: VentureMvpCheckStatus;
      unitTestCheck: VentureMvpCheckStatus;
      buildCheck: VentureMvpCheckStatus;
      browserSmokeCheck: VentureMvpCheckStatus;
      deploymentCheck: VentureMvpCheckStatus;
      verificationNotes: string;
    },
  ) => void;
  onRecordArtifact: (
    ventureId: string,
    artifact: {
      artifactType: VentureArtifactType;
      status: VentureArtifactStatus;
      title: string;
      uri: string;
      owner: string;
      verificationCommand: string;
      evidence: string;
      changeSummary: string;
    },
  ) => void;
  onRecordGeneratedAppVerifierReport: (ventureId: string, rawReport: string) => boolean;
  onRecordProductBuildCommandRun: (
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
  ) => void;
  onRecordMoneySignal: (
    ventureId: string,
    signal: {
      type: VentureMoneySignalType;
      status: VentureMoneySignalStatus;
      amountCents: number;
      currency: string;
      source: string;
      owner: string;
      evidence: string;
      notes: string;
    },
  ) => void;
  onRecordRoadmapTask: (
    ventureId: string,
    task: {
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
    },
  ) => void;
  onRecordSupportIssue: (
    ventureId: string,
    issue: {
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
    },
  ) => void;
  onRecordActivationCohort: (
    ventureId: string,
    cohort: {
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
    },
  ) => void;
  onRecordChannelEconomics: (
    ventureId: string,
    economics: {
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
      owner: string;
      evidence: string;
      nextAction: string;
    },
  ) => void;
  onRecordAutonomyAudit: (
    ventureId: string,
    audit: {
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
    },
  ) => void;
  onRecordAgentRun: (
    ventureId: string,
    run: {
      sourceType: VentureAgentRunSourceType;
      sourceRecordId?: string;
      status: VentureAgentRunStatus;
      model: string;
      prompt: string;
      outputSummary: string;
      inputEvidence: string;
      toolCalls: string;
      tokenEstimate?: number;
      replayCommand: string;
      riskNote: string;
      owner: string;
      nextAction: string;
    },
  ) => void;
  onRecordCompetitor: (
    ventureId: string,
    competitor: {
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
    },
  ) => void;
  onRecordBrowserResearchTask: (
    ventureId: string,
    task: {
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
    },
  ) => void;
  onRecordAtlasValidationResult: (
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
  ) => void;
  defaultRiskOwner: string;
  onRecordDecision: (
    ventureId: string,
    decision: VentureDecisionType,
    nextLifecycleStatus: VentureLifecycleStatus,
    rationale: string,
    nextAction: string,
  ) => void;
  onLaunchGapMission: (ventureId: string, task: VentureGapActionTask) => Promise<void>;
  onRecordGapOutcome: (ventureId: string, task: VentureGapActionTask, outcome: string) => void;
  isLaunchingGapMission: boolean;
}) {
  const [resultDraft, setResultDraft] = useState("");
  const [interpretationDraft, setInterpretationDraft] = useState("");
  const [qualifiedBuyerDraft, setQualifiedBuyerDraft] = useState("");
  const [paidCommitmentDraft, setPaidCommitmentDraft] = useState("");
  const [invoiceRequestDraft, setInvoiceRequestDraft] = useState("");
  const [acceptedPriceDraft, setAcceptedPriceDraft] = useState("");
  const [pricingObjectionDraft, setPricingObjectionDraft] = useState("");
  const [pricingEvidenceDraft, setPricingEvidenceDraft] = useState("");
  const [interviewPersonaDraft, setInterviewPersonaDraft] = useState("");
  const [interviewChannelDraft, setInterviewChannelDraft] = useState("");
  const [interviewPainDraft, setInterviewPainDraft] = useState("");
  const [interviewWtpDraft, setInterviewWtpDraft] = useState("");
  const [interviewObjectionsDraft, setInterviewObjectionsDraft] = useState("");
  const [interviewFeaturesDraft, setInterviewFeaturesDraft] = useState("");
  const [interviewEvidenceDraft, setInterviewEvidenceDraft] = useState("");
  const [interviewSentiment, setInterviewSentiment] = useState<VentureInterviewSentiment>("mixed");
  const [outreachPersonaDraft, setOutreachPersonaDraft] = useState("");
  const [outreachChannelDraft, setOutreachChannelDraft] = useState("");
  const [outreachMessageDraft, setOutreachMessageDraft] = useState("");
  const [outreachRiskDraft, setOutreachRiskDraft] = useState("");
  const [outreachNextActionDraft, setOutreachNextActionDraft] = useState("");
  const [outreachStatus, setOutreachStatus] = useState<VentureOutreachApprovalStatus>("approved");
  const [riskTitleDraft, setRiskTitleDraft] = useState("");
  const [riskDetailDraft, setRiskDetailDraft] = useState("");
  const [riskOwnerDraft, setRiskOwnerDraft] = useState("");
  const [riskMitigationDraft, setRiskMitigationDraft] = useState("");
  const [riskResolutionDraft, setRiskResolutionDraft] = useState("");
  const [riskSeverity, setRiskSeverity] = useState<VentureRiskSeverity>("medium");
  const [riskStatus, setRiskStatus] = useState<VentureRiskStatus>("open");
  const [mvpBuildStatus, setMvpBuildStatus] = useState<VentureMvpBuildStatus>("brief-ready");
  const [mvpRepoPathDraft, setMvpRepoPathDraft] = useState("");
  const [mvpOwnerDraft, setMvpOwnerDraft] = useState("");
  const [mvpVerificationDraft, setMvpVerificationDraft] = useState("");
  const [mvpSetupCheck, setMvpSetupCheck] = useState<VentureMvpCheckStatus>("pending");
  const [mvpTypecheckCheck, setMvpTypecheckCheck] = useState<VentureMvpCheckStatus>("pending");
  const [mvpUnitTestCheck, setMvpUnitTestCheck] = useState<VentureMvpCheckStatus>("pending");
  const [mvpBuildCheck, setMvpBuildCheck] = useState<VentureMvpCheckStatus>("pending");
  const [mvpBrowserSmokeCheck, setMvpBrowserSmokeCheck] = useState<VentureMvpCheckStatus>("pending");
  const [mvpDeploymentCheck, setMvpDeploymentCheck] = useState<VentureMvpCheckStatus>("pending");
  const [artifactType, setArtifactType] = useState<VentureArtifactType>("build-brief");
  const [artifactStatus, setArtifactStatus] = useState<VentureArtifactStatus>("expected");
  const [artifactTitleDraft, setArtifactTitleDraft] = useState("");
  const [artifactUriDraft, setArtifactUriDraft] = useState("");
  const [artifactOwnerDraft, setArtifactOwnerDraft] = useState("");
  const [artifactCommandDraft, setArtifactCommandDraft] = useState("");
  const [artifactEvidenceDraft, setArtifactEvidenceDraft] = useState("");
  const [artifactChangeDraft, setArtifactChangeDraft] = useState("");
  const [verifierReportDraft, setVerifierReportDraft] = useState("");
  const [moneyType, setMoneyType] = useState<VentureMoneySignalType>("commitment");
  const [moneyStatus, setMoneyStatus] = useState<VentureMoneySignalStatus>("committed");
  const [moneyAmountDraft, setMoneyAmountDraft] = useState("");
  const [moneyCurrencyDraft, setMoneyCurrencyDraft] = useState("USD");
  const [moneySourceDraft, setMoneySourceDraft] = useState("");
  const [moneyOwnerDraft, setMoneyOwnerDraft] = useState("");
  const [moneyEvidenceDraft, setMoneyEvidenceDraft] = useState("");
  const [moneyNotesDraft, setMoneyNotesDraft] = useState("");
  const [roadmapTitleDraft, setRoadmapTitleDraft] = useState("");
  const [roadmapOwnerDraft, setRoadmapOwnerDraft] = useState("");
  const [roadmapDetailDraft, setRoadmapDetailDraft] = useState("");
  const [roadmapSupportDraft, setRoadmapSupportDraft] = useState("");
  const [roadmapRiskDraft, setRoadmapRiskDraft] = useState("");
  const [roadmapNextActionDraft, setRoadmapNextActionDraft] = useState("");
  const [roadmapPriority, setRoadmapPriority] = useState<VentureRoadmapTaskPriority>("medium");
  const [roadmapStatus, setRoadmapStatus] = useState<VentureRoadmapTaskStatus>("queued");
  const [roadmapSourceDraft, setRoadmapSourceDraft] = useState<{ sourceType: VentureRoadmapSourceType; sourceRecordId?: string } | null>(null);
  const [supportIssueType, setSupportIssueType] = useState<VentureSupportIssueType>("support-question");
  const [supportIssueSeverity, setSupportIssueSeverity] = useState<VentureSupportIssueSeverity>("medium");
  const [supportIssueStatus, setSupportIssueStatus] = useState<VentureSupportIssueStatus>("triaged");
  const [supportTitleDraft, setSupportTitleDraft] = useState("");
  const [supportOwnerDraft, setSupportOwnerDraft] = useState("");
  const [supportDetailDraft, setSupportDetailDraft] = useState("");
  const [supportImpactDraft, setSupportImpactDraft] = useState("");
  const [supportLoadDraft, setSupportLoadDraft] = useState("");
  const [supportRetentionDraft, setSupportRetentionDraft] = useState("");
  const [supportResolutionDraft, setSupportResolutionDraft] = useState("");
  const [supportNextActionDraft, setSupportNextActionDraft] = useState("");
  const [cohortLabelDraft, setCohortLabelDraft] = useState("");
  const [cohortOwnerDraft, setCohortOwnerDraft] = useState("");
  const [cohortChannelDraft, setCohortChannelDraft] = useState("");
  const [cohortActivationEventDraft, setCohortActivationEventDraft] = useState("");
  const [cohortRetentionWindowDraft, setCohortRetentionWindowDraft] = useState("");
  const [cohortSignupDraft, setCohortSignupDraft] = useState("");
  const [cohortActivatedDraft, setCohortActivatedDraft] = useState("");
  const [cohortRetainedDraft, setCohortRetainedDraft] = useState("");
  const [cohortPaidDraft, setCohortPaidDraft] = useState("");
  const [cohortRevenueDraft, setCohortRevenueDraft] = useState("");
  const [cohortSupportIssueDraft, setCohortSupportIssueDraft] = useState("");
  const [cohortEvidenceDraft, setCohortEvidenceDraft] = useState("");
  const [cohortLearningDraft, setCohortLearningDraft] = useState("");
  const [cohortNextActionDraft, setCohortNextActionDraft] = useState("");
  const [channelDraft, setChannelDraft] = useState("");
  const [channelOwnerDraft, setChannelOwnerDraft] = useState("");
  const [channelSpendDraft, setChannelSpendDraft] = useState("");
  const [channelImpressionsDraft, setChannelImpressionsDraft] = useState("");
  const [channelClicksDraft, setChannelClicksDraft] = useState("");
  const [channelSignupDraft, setChannelSignupDraft] = useState("");
  const [channelActivatedDraft, setChannelActivatedDraft] = useState("");
  const [channelPaidDraft, setChannelPaidDraft] = useState("");
  const [channelRevenueDraft, setChannelRevenueDraft] = useState("");
  const [channelEvidenceDraft, setChannelEvidenceDraft] = useState("");
  const [channelNextActionDraft, setChannelNextActionDraft] = useState("");
  const [auditActorDraft, setAuditActorDraft] = useState("");
  const [auditRiskDraft, setAuditRiskDraft] = useState("");
  const [auditReplayDraft, setAuditReplayDraft] = useState("");
  const [auditEvidenceDraft, setAuditEvidenceDraft] = useState("");
  const [auditNextActionDraft, setAuditNextActionDraft] = useState("");
  const [agentModelDraft, setAgentModelDraft] = useState("");
  const [agentOwnerDraft, setAgentOwnerDraft] = useState("");
  const [agentPromptDraft, setAgentPromptDraft] = useState("");
  const [agentOutputDraft, setAgentOutputDraft] = useState("");
  const [agentEvidenceDraft, setAgentEvidenceDraft] = useState("");
  const [agentToolsDraft, setAgentToolsDraft] = useState("");
  const [agentReplayDraft, setAgentReplayDraft] = useState("");
  const [agentRiskDraft, setAgentRiskDraft] = useState("");
  const [agentNextActionDraft, setAgentNextActionDraft] = useState("");
  const [competitorNameDraft, setCompetitorNameDraft] = useState("");
  const [competitorOwnerDraft, setCompetitorOwnerDraft] = useState("");
  const [competitorPositioningDraft, setCompetitorPositioningDraft] = useState("");
  const [competitorEvidenceDraft, setCompetitorEvidenceDraft] = useState("");
  const [competitorDifferentiationDraft, setCompetitorDifferentiationDraft] = useState("");
  const [competitorResponseDraft, setCompetitorResponseDraft] = useState("");
  const [competitorCadenceDraft, setCompetitorCadenceDraft] = useState("");
  const [competitorNextActionDraft, setCompetitorNextActionDraft] = useState("");
  const [browserResearchStatus, setBrowserResearchStatus] = useState<VentureBrowserResearchStatus>("queued");
  const [browserResearchPlatformDraft, setBrowserResearchPlatformDraft] = useState("");
  const [browserResearchTargetDraft, setBrowserResearchTargetDraft] = useState("");
  const [browserResearchOwnerDraft, setBrowserResearchOwnerDraft] = useState("");
  const [browserResearchEvidenceUrlDraft, setBrowserResearchEvidenceUrlDraft] = useState("");
  const [browserResearchFindingsDraft, setBrowserResearchFindingsDraft] = useState("");
  const [browserResearchReplayDraft, setBrowserResearchReplayDraft] = useState("");
  const [browserResearchNextActionDraft, setBrowserResearchNextActionDraft] = useState("");
  const [atlasValidationOutcome, setAtlasValidationOutcome] = useState<VentureAtlasValidationResultOutcome>("passed");
  const [atlasValidationBuyerDraft, setAtlasValidationBuyerDraft] = useState("");
  const [atlasValidationPainDraft, setAtlasValidationPainDraft] = useState("");
  const [atlasValidationWedgeDraft, setAtlasValidationWedgeDraft] = useState("");
  const [atlasValidationPaidDraft, setAtlasValidationPaidDraft] = useState("");
  const [atlasValidationQuoteDraft, setAtlasValidationQuoteDraft] = useState("");
  const [atlasValidationObjectionDraft, setAtlasValidationObjectionDraft] = useState("");
  const [atlasValidationEvidenceDraft, setAtlasValidationEvidenceDraft] = useState("");
  const [atlasValidationLearningDraft, setAtlasValidationLearningDraft] = useState("");
  const [atlasValidationOwnerDraft, setAtlasValidationOwnerDraft] = useState("");
  const [atlasValidationNextActionDraft, setAtlasValidationNextActionDraft] = useState("");
  const [productBuildRunState, setProductBuildRunState] = useState<VentureProductBuildCommandRunState>("executed");
  const [productBuildRunProofDraft, setProductBuildRunProofDraft] = useState("");
  const [productBuildArtifactProofDraft, setProductBuildArtifactProofDraft] = useState("");
  const [productBuildVerifierProofDraft, setProductBuildVerifierProofDraft] = useState("");
  const [productBuildRunLearningDraft, setProductBuildRunLearningDraft] = useState("");
  const [productBuildRunOwnerDraft, setProductBuildRunOwnerDraft] = useState("");
  const [decisionType, setDecisionType] = useState<VentureDecisionType>("continue");
  const [nextLifecycleStatus, setNextLifecycleStatus] = useState<VentureLifecycleStatus>(venture.lifecycleStatus);
  const [rationaleDraft, setRationaleDraft] = useState("");
  const [nextActionDraft, setNextActionDraft] = useState("");
  const [gapOutcomeDrafts, setGapOutcomeDrafts] = useState<Record<string, string>>({});
  const firstExperiment = venture.experiments[0];
  const firstApproval = venture.approvals.find((approval) => approval.status === "requires-human") ?? venture.approvals[0];
  const deploymentProposalGate = venture.approvals.find((approval) => /deployment proposal/i.test(approval.level));
  const humanDeploymentGate = venture.approvals.find((approval) => /human-approved deployment/i.test(approval.level));
  const deploymentProofs = venture.artifactRecords.filter((artifact) => artifact.artifactType === "deployment-proof");
  const expectedDeploymentProofCount = deploymentProofs.filter((artifact) => artifact.status === "expected").length;
  const blockedDeploymentProofCount = deploymentProofs.filter((artifact) => artifact.status === "blocked").length;
  const verifiedDeploymentProofCount = deploymentProofs.filter((artifact) => artifact.status === "verified").length;
  const deploymentBoundaryState = humanDeploymentGate?.status === "complete"
    ? "human-approved deployment"
    : verifiedDeploymentProofCount > 0
      ? "deployment proof waiting for human approval"
      : blockedDeploymentProofCount > 0
        ? "no-deploy: deployment proof blocked"
        : "no-deploy: human approval required";
  const latestDecision = venture.decisionHistory[0];
  const evidenceProfile = useMemo(() => summarizeVentureEvidence(venture), [venture]);
  const gapTasks = useMemo(() => buildVentureGapActionQueue(venture), [venture]);
  const demandCalibration = useMemo(() => calibrateVentureDemand(venture), [venture]);
  const demandDrift = useMemo(() => buildVentureDemandDriftReport(venture), [venture]);
  const pricingCalibration = useMemo(() => calibrateVenturePricing(venture), [venture]);
  const outreachCampaign = useMemo(() => buildVentureOutreachCampaignBrief(venture), [venture]);
  const latestInterview = venture.customerInterviews[0];
  const latestOutreachApproval = venture.outreachApprovals[0];
  const latestRiskRecord = venture.riskRecords[0];
  const latestMvpBuildWorkspace = venture.mvpBuildWorkspaces[0];
  const generatedAppHandoff = useMemo(() => buildVentureGeneratedAppHandoff(venture), [venture]);
  const generatedAppProof = useMemo(() => buildVentureGeneratedAppVerificationProof(venture), [venture]);
  const latestArtifactRecord = venture.artifactRecords[0];
  const latestMoneySignal = venture.moneySignals[0];
  const spendGatedMoneySignalCount = venture.moneySignals.filter((signal) => moneySignalApprovalLevel(signal) === "human-approved-spend").length;
  const billingGatedMoneySignalCount = venture.moneySignals.filter((signal) => moneySignalApprovalLevel(signal) === "human-approved-billing-change").length;
  const latestRoadmapTask = venture.roadmapTasks[0];
  const latestSupportIssue = venture.supportIssues[0];
  const latestActivationCohort = venture.activationCohorts[0];
  const latestChannelEconomics = venture.channelEconomics[0];
  const latestAutonomyAudit = venture.autonomyAudit[0];
  const latestAgentRun = venture.agentRuns[0];
  const latestCompetitor = venture.competitors[0];
  const latestBrowserResearchTask = venture.browserResearchTasks[0];
  const marketModel = useMemo(() => buildVentureMarketModel(venture), [venture]);
  const founderMemo = useMemo(() => buildVentureFounderExecutionMemo(venture), [venture]);
  const launchPack = useMemo(() => buildVentureExperimentLaunchPack(venture), [venture]);
  const qaReport = useMemo(() => buildVentureQaReleaseReport(venture), [venture]);
  const deploymentPacket = useMemo(() => buildVentureDeploymentReadinessPacket(venture), [venture]);
  const deploymentMatrix = useMemo(() => buildVentureDeploymentEnvironmentMatrix(venture), [venture]);
  const investorBrief = useMemo(() => buildVentureInvestorBrief(venture), [venture]);
  const financialModel = useMemo(() => buildVentureFinancialModel(venture), [venture]);
  const revenueGenerationPosture = useMemo(() => buildVentureRevenueGenerationPosture(venture), [venture]);
  const scaleStrongBranchPlan = useMemo(() => buildVentureScaleStrongBranchPlan(venture), [venture]);
  const riskCandidates = useMemo(() => buildVentureRiskCandidates(venture), [venture]);
  const firstRiskCandidate = riskCandidates[0];
  const roadmapCandidates = useMemo(() => buildVentureRoadmapCandidates(venture), [venture]);
  const firstRoadmapCandidate = roadmapCandidates[0];
  const supportIssueCandidates = useMemo(() => buildVentureSupportIssueCandidates(venture), [venture]);
  const firstSupportIssueCandidate = supportIssueCandidates[0];
  const activationCohortCandidates = useMemo(() => buildVentureActivationCohortCandidates(venture), [venture]);
  const firstActivationCohortCandidate = activationCohortCandidates[0];
  const channelEconomicsCandidates = useMemo(() => buildVentureChannelEconomicsCandidates(venture), [venture]);
  const firstChannelEconomicsCandidate = channelEconomicsCandidates[0];
  const killPressureReport = useMemo(() => buildVentureKillPressureReport(venture), [venture]);
  const killDecisionArtifact = useMemo(() => buildVentureKillDecisionArtifact(venture), [venture]);
  const autonomyAuditCandidates = useMemo(() => buildVentureAutonomyAuditCandidates(venture), [venture]);
  const readOnlyAutonomyCandidateCount = autonomyAuditCandidates.filter((candidate) => candidate.approvalLevel === "read-only-research").length;
  const localCodeAutonomyCandidateCount = autonomyAuditCandidates.filter((candidate) => candidate.approvalLevel === "local-code-generation").length;
  const localTestAutonomyCandidateCount = autonomyAuditCandidates.filter((candidate) => candidate.approvalLevel === "local-test-execution").length;
  const firstAutonomyAuditCandidate = autonomyAuditCandidates[0];
  const agentRunCandidates = useMemo(() => buildVentureAgentRunCandidates(venture), [venture]);
  const firstAgentRunCandidate = agentRunCandidates[0];
  const competitorCandidates = useMemo(() => buildVentureCompetitorCandidates(venture), [venture]);
  const firstCompetitorCandidate = competitorCandidates[0];
  const browserResearchCandidates = useMemo(() => buildVentureBrowserResearchCandidates(venture), [venture]);
  const firstBrowserResearchCandidate = browserResearchCandidates[0];
  const ventureAtlasValidationPacks = useMemo(() => buildVentureAtlasValidationCommandPacks([venture]), [venture]);
  const firstAtlasValidationPack = ventureAtlasValidationPacks[0];
  const latestAtlasValidationResult = venture.atlasValidationResults[0];
  const ventureProductBuildCommands = useMemo(() => buildVentureProductBuildCommandQueue([venture]), [venture]);
  const firstValidationBackedProductBuildCommand = ventureProductBuildCommands.find((command) => command.sourceType === "validation-result");
  const ventureProductBuildRunLedger = useMemo(() => buildVentureProductBuildCommandRunLedger([venture]), [venture]);
  const latestProductBuildRun = ventureProductBuildRunLedger[0];
  const readinessNotices = useMemo(() => buildVentureReadinessNotices(venture), [venture]);
  const ventureFailureLessons = useMemo(() => buildVentureFailureLessons([venture]), [venture]);
  const ventureRevivalTriggers = useMemo(() => buildVentureRevivalTriggers([venture]), [venture]);
  const leadingPrediction = firstExperiment
    ? venture.predictionSnapshots.find((prediction) => prediction.experimentId === firstExperiment.id) ?? venture.predictionSnapshots[0]
    : venture.predictionSnapshots[0];
  const gapActionByTaskId = useMemo(() => {
    return new Map<string, VentureGapActionRecord>(
      venture.gapActionHistory.map((record) => [record.taskId, record]),
    );
  }, [venture.gapActionHistory]);
  const canSaveExperiment = Boolean(firstExperiment && resultDraft.trim() && interpretationDraft.trim());
  const canSavePricingSignal = Boolean(
    qualifiedBuyerDraft.trim() ||
    paidCommitmentDraft.trim() ||
    invoiceRequestDraft.trim() ||
    acceptedPriceDraft.trim() ||
    pricingObjectionDraft.trim() ||
    pricingEvidenceDraft.trim()
  );
  const canSaveInterview = Boolean(interviewPersonaDraft.trim() && interviewPainDraft.trim());
  const canSaveOutreachApproval = Boolean(outreachMessageDraft.trim());
  const canSaveRisk = Boolean(
    (riskTitleDraft.trim() || firstRiskCandidate?.title) &&
    (riskDetailDraft.trim() || firstRiskCandidate?.detail) &&
    (riskOwnerDraft.trim() || defaultRiskOwner) &&
    riskMitigationDraft.trim(),
  );
  const canSaveMvpBuildWorkspace = Boolean(mvpOwnerDraft.trim() || defaultRiskOwner);
  const canSaveArtifact = Boolean(artifactTitleDraft.trim() && (artifactOwnerDraft.trim() || defaultRiskOwner));
  const canSaveVerifierReport = Boolean(verifierReportDraft.trim());
  const canSaveMoneySignal = Boolean(parseAmountDraftToCents(moneyAmountDraft) > 0 && moneySourceDraft.trim() && (moneyOwnerDraft.trim() || defaultRiskOwner));
  const canSaveRoadmapTask = Boolean(
    (roadmapTitleDraft.trim() || firstRoadmapCandidate?.title) &&
    (roadmapDetailDraft.trim() || firstRoadmapCandidate?.detail) &&
    (roadmapOwnerDraft.trim() || firstRoadmapCandidate?.suggestedOwner || defaultRiskOwner) &&
    (roadmapNextActionDraft.trim() || firstRoadmapCandidate?.nextAction),
  );
  const canSaveSupportIssue = Boolean(
    (supportTitleDraft.trim() || firstSupportIssueCandidate?.title) &&
    (supportDetailDraft.trim() || firstSupportIssueCandidate?.detail) &&
    (supportOwnerDraft.trim() || firstSupportIssueCandidate?.suggestedOwner || defaultRiskOwner) &&
    (supportNextActionDraft.trim() || firstSupportIssueCandidate?.nextAction),
  );
  const canSaveActivationCohort = Boolean(
    (cohortLabelDraft.trim() || firstActivationCohortCandidate?.cohortLabel) &&
    (cohortOwnerDraft.trim() || firstActivationCohortCandidate?.suggestedOwner || defaultRiskOwner) &&
    (cohortNextActionDraft.trim() || firstActivationCohortCandidate?.nextAction),
  );
  const canSaveChannelEconomics = Boolean(
    (channelDraft.trim() || firstChannelEconomicsCandidate?.channel) &&
    (channelOwnerDraft.trim() || firstChannelEconomicsCandidate?.suggestedOwner || defaultRiskOwner) &&
    (channelNextActionDraft.trim() || firstChannelEconomicsCandidate?.nextAction),
  );
  const canSaveAutonomyAudit = Boolean(
    firstAutonomyAuditCandidate &&
    (auditActorDraft.trim() || firstAutonomyAuditCandidate.suggestedActor || defaultRiskOwner) &&
    (auditNextActionDraft.trim() || firstAutonomyAuditCandidate.nextAction),
  );
  const canSaveAgentRun = Boolean(
    (agentPromptDraft.trim() || firstAgentRunCandidate?.prompt) &&
    (agentOutputDraft.trim() || firstAgentRunCandidate?.outputSummary) &&
    (agentOwnerDraft.trim() || firstAgentRunCandidate?.suggestedOwner || defaultRiskOwner) &&
    (agentNextActionDraft.trim() || firstAgentRunCandidate?.nextAction),
  );
  const canSaveCompetitor = Boolean(
    (competitorNameDraft.trim() || firstCompetitorCandidate?.competitorName) &&
    (competitorOwnerDraft.trim() || firstCompetitorCandidate?.suggestedOwner || defaultRiskOwner) &&
    (competitorNextActionDraft.trim() || firstCompetitorCandidate?.nextAction),
  );
  const canSaveBrowserResearchTask = Boolean(
    (browserResearchPlatformDraft.trim() || firstBrowserResearchCandidate?.platform) &&
    (browserResearchTargetDraft.trim() || firstBrowserResearchCandidate?.sourceTarget) &&
    (browserResearchOwnerDraft.trim() || firstBrowserResearchCandidate?.suggestedOwner || defaultRiskOwner) &&
    (browserResearchNextActionDraft.trim() || firstBrowserResearchCandidate?.nextAction),
  );
  const canSaveAtlasValidationResult = Boolean(
    firstAtlasValidationPack &&
    (atlasValidationBuyerDraft.trim() || atlasValidationPainDraft.trim() || atlasValidationWedgeDraft.trim() || atlasValidationPaidDraft.trim()) &&
    atlasValidationEvidenceDraft.trim() &&
    (atlasValidationOwnerDraft.trim() || defaultRiskOwner) &&
    atlasValidationNextActionDraft.trim(),
  );
  const canSaveProductBuildRun = Boolean(
    firstValidationBackedProductBuildCommand &&
    productBuildRunProofDraft.trim() &&
    (productBuildRunOwnerDraft.trim() || defaultRiskOwner),
  );
  const canSaveDecision = Boolean(rationaleDraft.trim());

  useEffect(() => {
    setNextLifecycleStatus(venture.lifecycleStatus);
  }, [venture.lifecycleStatus]);

  const handleSaveExperiment = () => {
    if (!firstExperiment || !canSaveExperiment) return;
    onRecordExperiment(venture.id, firstExperiment.id, resultDraft, interpretationDraft);
    setResultDraft("");
    setInterpretationDraft("");
  };

  const handleSavePricingSignal = () => {
    if (!canSavePricingSignal) return;
    onRecordPricingSignal(venture.id, {
      qualifiedBuyerCount: parseCountDraft(qualifiedBuyerDraft),
      paidCommitmentCount: parseCountDraft(paidCommitmentDraft),
      invoiceRequestCount: parseCountDraft(invoiceRequestDraft),
      acceptedPrice: acceptedPriceDraft,
      objectionSummary: pricingObjectionDraft,
      evidenceNote: pricingEvidenceDraft,
    });
    setQualifiedBuyerDraft("");
    setPaidCommitmentDraft("");
    setInvoiceRequestDraft("");
    setAcceptedPriceDraft("");
    setPricingObjectionDraft("");
    setPricingEvidenceDraft("");
  };

  const handleSaveCustomerInterview = () => {
    if (!canSaveInterview) return;
    onRecordCustomerInterview(venture.id, {
      persona: interviewPersonaDraft,
      channel: interviewChannelDraft,
      painQuote: interviewPainDraft,
      willingnessToPay: interviewWtpDraft,
      objections: interviewObjectionsDraft,
      requestedFeatures: interviewFeaturesDraft,
      sentiment: interviewSentiment,
      evidenceNote: interviewEvidenceDraft,
    });
    setInterviewPersonaDraft("");
    setInterviewChannelDraft("");
    setInterviewPainDraft("");
    setInterviewWtpDraft("");
    setInterviewObjectionsDraft("");
    setInterviewFeaturesDraft("");
    setInterviewEvidenceDraft("");
    setInterviewSentiment("mixed");
  };

  const handleSaveOutreachApproval = () => {
    if (!canSaveOutreachApproval) return;
    onRecordOutreachApproval(venture.id, {
      sourceInterviewId: latestInterview?.id,
      contactPersona: outreachPersonaDraft || latestInterview?.persona || venture.targetBuyer,
      channel: outreachChannelDraft || latestInterview?.channel || "manual outreach",
      messageDraft: outreachMessageDraft,
      status: outreachStatus,
      riskNote: outreachRiskDraft,
      nextAction: outreachNextActionDraft,
    });
    setOutreachPersonaDraft("");
    setOutreachChannelDraft("");
    setOutreachMessageDraft("");
    setOutreachRiskDraft("");
    setOutreachNextActionDraft("");
    setOutreachStatus("approved");
  };

  const handleSaveRisk = () => {
    if (!canSaveRisk) return;
    onRecordRisk(venture.id, {
      sourceType: firstRiskCandidate?.sourceType ?? "manual",
      sourceRecordId: firstRiskCandidate?.sourceRecordId,
      title: riskTitleDraft || firstRiskCandidate?.title || "Manual venture risk",
      detail: riskDetailDraft || firstRiskCandidate?.detail || "No risk detail recorded.",
      severity: riskSeverity,
      status: riskStatus,
      owner: riskOwnerDraft || defaultRiskOwner,
      mitigation: riskMitigationDraft,
      resolutionEvidence: riskResolutionDraft,
    });
    setRiskTitleDraft("");
    setRiskDetailDraft("");
    setRiskOwnerDraft("");
    setRiskMitigationDraft("");
    setRiskResolutionDraft("");
    setRiskSeverity("medium");
    setRiskStatus("open");
  };

  const handleSaveMvpBuildWorkspace = () => {
    if (!canSaveMvpBuildWorkspace) return;
    onRecordMvpBuildWorkspace(venture.id, {
      status: mvpBuildStatus,
      owner: mvpOwnerDraft || defaultRiskOwner,
      repoPath: mvpRepoPathDraft,
      setupCheck: mvpSetupCheck,
      typecheckCheck: mvpTypecheckCheck,
      unitTestCheck: mvpUnitTestCheck,
      buildCheck: mvpBuildCheck,
      browserSmokeCheck: mvpBrowserSmokeCheck,
      deploymentCheck: mvpDeploymentCheck,
      verificationNotes: mvpVerificationDraft,
    });
    setMvpVerificationDraft("");
  };

  const handleSaveArtifact = () => {
    if (!canSaveArtifact) return;
    onRecordArtifact(venture.id, {
      artifactType,
      status: artifactStatus,
      title: artifactTitleDraft,
      uri: artifactUriDraft,
      owner: artifactOwnerDraft || defaultRiskOwner,
      verificationCommand: artifactCommandDraft,
      evidence: artifactEvidenceDraft,
      changeSummary: artifactChangeDraft,
    });
    setArtifactTitleDraft("");
    setArtifactUriDraft("");
    setArtifactCommandDraft("");
    setArtifactEvidenceDraft("");
    setArtifactChangeDraft("");
  };

  const handleStageGeneratedAppProofArtifact = () => {
    setArtifactTitleDraft(`Generated app verifier proof: ${generatedAppProof.appName}`);
    setArtifactUriDraft(generatedAppProof.targetPath);
    setArtifactType("test-report");
    setArtifactStatus(generatedAppProof.status === "verified" ? "verified" : "expected");
    setArtifactOwnerDraft(defaultRiskOwner);
    setArtifactCommandDraft(generatedAppProof.verifierCommand);
    setArtifactEvidenceDraft(generatedAppProof.proofSummary);
    setArtifactChangeDraft(`Generated app proof ${generatedAppProof.status}: ${generatedAppProof.passedCheckCount}/${generatedAppProof.requiredCheckCount} checks passed.`);
    toast.success("Generated app proof staged as an artifact");
  };

  const handleSaveVerifierReport = () => {
    if (!canSaveVerifierReport) return;
    const saved = onRecordGeneratedAppVerifierReport(venture.id, verifierReportDraft);
    if (saved) {
      setVerifierReportDraft("");
    }
  };

  const handleLoadVerifierReportFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    void file.text()
      .then((content) => {
        setVerifierReportDraft(content);
        toast.success("Generated app verifier report file loaded");
      })
      .catch(() => {
        toast.error("Generated app verifier report file could not be read");
      });
  };

  const handleStageDeploymentRehearsalProof = () => {
    setArtifactTitleDraft(`Deployment rehearsal proof: ${deploymentPacket.title}`);
    setArtifactUriDraft(`deployment-readiness/${venture.id}.md`);
    setArtifactType("deployment-proof");
    setArtifactStatus(deploymentPacket.status === "proposal-ready" ? "expected" : "blocked");
    setArtifactOwnerDraft(defaultRiskOwner);
    setArtifactCommandDraft("No deployment command executed. Review the readiness packet and run only after human-approved deployment.");
    setArtifactEvidenceDraft([
      deploymentPacket.noDeployBoundary,
      ...deploymentPacket.evidence,
      ...deploymentPacket.blockers.map((blocker) => `Blocker: ${blocker}`),
    ].join("\n"));
    setArtifactChangeDraft(`Deployment readiness ${deploymentPacket.status}; rollback plan: ${deploymentPacket.rollbackPlan.join(" ")}`);
    toast.success("Deployment rehearsal proof staged");
  };

  const handleStageDeploymentPromotionTask = (target: typeof deploymentMatrix.targets[number]) => {
    setRoadmapTitleDraft(`Deployment promotion blocker: ${target.label}`);
    setRoadmapDetailDraft(`${target.proofSummary} ${target.approvalBoundary}`);
    setRoadmapPriority(target.id === "production" || target.status === "blocked" ? "high" : "medium");
    setRoadmapStatus("queued");
    setRoadmapOwnerDraft(defaultRiskOwner);
    setRoadmapSupportDraft(`Keeps ${target.label.toLowerCase()} promotion proof from becoming launch or support ambiguity.`);
    setRoadmapRiskDraft(target.requiredProof.join(" "));
    setRoadmapNextActionDraft(target.nextAction);
    setRoadmapSourceDraft({
      sourceType: "deployment-promotion",
      sourceRecordId: `${venture.id}-deployment-environment-${target.id}`,
    });
    toast.success("Deployment promotion task staged");
  };

  const handleSaveMoneySignal = () => {
    if (!canSaveMoneySignal) return;
    onRecordMoneySignal(venture.id, {
      type: moneyType,
      status: moneyStatus,
      amountCents: parseAmountDraftToCents(moneyAmountDraft),
      currency: moneyCurrencyDraft,
      source: moneySourceDraft,
      owner: moneyOwnerDraft || defaultRiskOwner,
      evidence: moneyEvidenceDraft,
      notes: moneyNotesDraft,
    });
    setMoneyAmountDraft("");
    setMoneySourceDraft("");
    setMoneyEvidenceDraft("");
    setMoneyNotesDraft("");
  };

  const handleSaveRoadmapTask = () => {
    if (!canSaveRoadmapTask) return;
    const stagedRoadmapSource = roadmapSourceDraft && (roadmapTitleDraft.trim() || roadmapDetailDraft.trim())
      ? roadmapSourceDraft
      : null;
    onRecordRoadmapTask(venture.id, {
      sourceType: stagedRoadmapSource ? stagedRoadmapSource.sourceType : firstRoadmapCandidate?.sourceType ?? "manual",
      sourceRecordId: stagedRoadmapSource ? stagedRoadmapSource.sourceRecordId : firstRoadmapCandidate?.sourceRecordId,
      title: roadmapTitleDraft || firstRoadmapCandidate?.title || "Manual roadmap task",
      detail: roadmapDetailDraft || firstRoadmapCandidate?.detail || "No roadmap detail recorded.",
      priority: roadmapPriority,
      status: roadmapStatus,
      owner: roadmapOwnerDraft || firstRoadmapCandidate?.suggestedOwner || defaultRiskOwner,
      supportLoad: roadmapSupportDraft || firstRoadmapCandidate?.supportLoad || "No support-load note recorded.",
      riskReduction: roadmapRiskDraft || firstRoadmapCandidate?.riskReduction || "No risk-reduction note recorded.",
      nextAction: roadmapNextActionDraft || firstRoadmapCandidate?.nextAction || "No roadmap next action recorded.",
    });
    setRoadmapTitleDraft("");
    setRoadmapOwnerDraft("");
    setRoadmapDetailDraft("");
    setRoadmapSupportDraft("");
    setRoadmapRiskDraft("");
    setRoadmapNextActionDraft("");
    setRoadmapPriority("medium");
    setRoadmapStatus("queued");
    setRoadmapSourceDraft(null);
  };

  const handleSaveSupportIssue = () => {
    if (!canSaveSupportIssue) return;
    onRecordSupportIssue(venture.id, {
      issueType: firstSupportIssueCandidate?.issueType ?? supportIssueType,
      severity: supportIssueSeverity,
      status: supportIssueStatus,
      sourceType: firstSupportIssueCandidate?.sourceType ?? "manual",
      sourceRecordId: firstSupportIssueCandidate?.sourceRecordId,
      title: supportTitleDraft || firstSupportIssueCandidate?.title || "Manual support issue",
      detail: supportDetailDraft || firstSupportIssueCandidate?.detail || "No support issue detail recorded.",
      customerImpact: supportImpactDraft || firstSupportIssueCandidate?.customerImpact || "No customer-impact note recorded.",
      supportLoad: supportLoadDraft || firstSupportIssueCandidate?.supportLoad || "No support-load note recorded.",
      retentionRisk: supportRetentionDraft || firstSupportIssueCandidate?.retentionRisk || "No retention-risk note recorded.",
      owner: supportOwnerDraft || firstSupportIssueCandidate?.suggestedOwner || defaultRiskOwner,
      resolution: supportResolutionDraft,
      nextAction: supportNextActionDraft || firstSupportIssueCandidate?.nextAction || "No support issue next action recorded.",
    });
    setSupportTitleDraft("");
    setSupportOwnerDraft("");
    setSupportDetailDraft("");
    setSupportImpactDraft("");
    setSupportLoadDraft("");
    setSupportRetentionDraft("");
    setSupportResolutionDraft("");
    setSupportNextActionDraft("");
    setSupportIssueType("support-question");
    setSupportIssueSeverity("medium");
    setSupportIssueStatus("triaged");
  };

  const handleSaveActivationCohort = () => {
    if (!canSaveActivationCohort) return;
    onRecordActivationCohort(venture.id, {
      sourceType: firstActivationCohortCandidate?.sourceType ?? "manual",
      sourceRecordId: firstActivationCohortCandidate?.sourceRecordId,
      cohortLabel: cohortLabelDraft || firstActivationCohortCandidate?.cohortLabel || "Manual activation cohort",
      acquisitionChannel: cohortChannelDraft || firstActivationCohortCandidate?.acquisitionChannel || venture.acquisitionChannels[0] || "manual",
      activationEvent: cohortActivationEventDraft || firstActivationCohortCandidate?.activationEvent || "No activation event recorded.",
      retentionWindow: cohortRetentionWindowDraft || firstActivationCohortCandidate?.retentionWindow || venture.retentionMechanism,
      signupCount: cohortSignupDraft.trim() ? parseCountDraft(cohortSignupDraft) : firstActivationCohortCandidate?.signupCount ?? 0,
      activatedCount: cohortActivatedDraft.trim() ? parseCountDraft(cohortActivatedDraft) : firstActivationCohortCandidate?.activatedCount ?? 0,
      retainedCount: cohortRetainedDraft.trim() ? parseCountDraft(cohortRetainedDraft) : firstActivationCohortCandidate?.retainedCount ?? 0,
      paidCount: cohortPaidDraft.trim() ? parseCountDraft(cohortPaidDraft) : firstActivationCohortCandidate?.paidCount ?? 0,
      revenueCents: cohortRevenueDraft.trim() ? parseAmountDraftToCents(cohortRevenueDraft) : firstActivationCohortCandidate?.revenueCents ?? 0,
      supportIssueCount: cohortSupportIssueDraft.trim() ? parseCountDraft(cohortSupportIssueDraft) : firstActivationCohortCandidate?.supportIssueCount ?? 0,
      owner: cohortOwnerDraft || firstActivationCohortCandidate?.suggestedOwner || defaultRiskOwner,
      evidence: cohortEvidenceDraft || firstActivationCohortCandidate?.evidence || "No cohort evidence recorded.",
      learning: cohortLearningDraft || firstActivationCohortCandidate?.learning || "No cohort learning recorded.",
      nextAction: cohortNextActionDraft || firstActivationCohortCandidate?.nextAction || "No cohort next action recorded.",
    });
    setCohortLabelDraft("");
    setCohortOwnerDraft("");
    setCohortChannelDraft("");
    setCohortActivationEventDraft("");
    setCohortRetentionWindowDraft("");
    setCohortSignupDraft("");
    setCohortActivatedDraft("");
    setCohortRetainedDraft("");
    setCohortPaidDraft("");
    setCohortRevenueDraft("");
    setCohortSupportIssueDraft("");
    setCohortEvidenceDraft("");
    setCohortLearningDraft("");
    setCohortNextActionDraft("");
  };

  const handleSaveChannelEconomics = () => {
    if (!canSaveChannelEconomics) return;
    onRecordChannelEconomics(venture.id, {
      sourceType: firstChannelEconomicsCandidate?.sourceType ?? "manual",
      sourceRecordId: firstChannelEconomicsCandidate?.sourceRecordId,
      channel: channelDraft || firstChannelEconomicsCandidate?.channel || "Manual channel",
      spendCents: channelSpendDraft.trim() ? parseAmountDraftToCents(channelSpendDraft) : firstChannelEconomicsCandidate?.spendCents ?? 0,
      impressions: channelImpressionsDraft.trim() ? parseCountDraft(channelImpressionsDraft) : firstChannelEconomicsCandidate?.impressions ?? 0,
      clicks: channelClicksDraft.trim() ? parseCountDraft(channelClicksDraft) : firstChannelEconomicsCandidate?.clicks ?? 0,
      signupCount: channelSignupDraft.trim() ? parseCountDraft(channelSignupDraft) : firstChannelEconomicsCandidate?.signupCount ?? 0,
      activatedCount: channelActivatedDraft.trim() ? parseCountDraft(channelActivatedDraft) : firstChannelEconomicsCandidate?.activatedCount ?? 0,
      paidCount: channelPaidDraft.trim() ? parseCountDraft(channelPaidDraft) : firstChannelEconomicsCandidate?.paidCount ?? 0,
      revenueCents: channelRevenueDraft.trim() ? parseAmountDraftToCents(channelRevenueDraft) : firstChannelEconomicsCandidate?.revenueCents ?? 0,
      owner: channelOwnerDraft || firstChannelEconomicsCandidate?.suggestedOwner || defaultRiskOwner,
      evidence: channelEvidenceDraft || firstChannelEconomicsCandidate?.evidence || "No channel economics evidence recorded.",
      nextAction: channelNextActionDraft || firstChannelEconomicsCandidate?.nextAction || "No channel next action recorded.",
    });
    setChannelDraft("");
    setChannelOwnerDraft("");
    setChannelSpendDraft("");
    setChannelImpressionsDraft("");
    setChannelClicksDraft("");
    setChannelSignupDraft("");
    setChannelActivatedDraft("");
    setChannelPaidDraft("");
    setChannelRevenueDraft("");
    setChannelEvidenceDraft("");
    setChannelNextActionDraft("");
  };

  const handleSaveAutonomyAudit = () => {
    if (!canSaveAutonomyAudit || !firstAutonomyAuditCandidate) return;
    onRecordAutonomyAudit(venture.id, {
      approvalLevel: firstAutonomyAuditCandidate.approvalLevel,
      status: firstAutonomyAuditCandidate.status,
      sideEffect: firstAutonomyAuditCandidate.sideEffect,
      actionType: firstAutonomyAuditCandidate.actionType,
      actor: auditActorDraft || firstAutonomyAuditCandidate.suggestedActor || defaultRiskOwner,
      sourceRecordId: firstAutonomyAuditCandidate.sourceRecordId,
      riskNote: auditRiskDraft || firstAutonomyAuditCandidate.riskNote,
      replayNote: auditReplayDraft || firstAutonomyAuditCandidate.replayNote,
      evidence: auditEvidenceDraft || firstAutonomyAuditCandidate.evidence,
      nextAction: auditNextActionDraft || firstAutonomyAuditCandidate.nextAction,
    });
    setAuditActorDraft("");
    setAuditRiskDraft("");
    setAuditReplayDraft("");
    setAuditEvidenceDraft("");
    setAuditNextActionDraft("");
  };

  const handleSaveAgentRun = () => {
    if (!canSaveAgentRun) return;
    onRecordAgentRun(venture.id, {
      sourceType: firstAgentRunCandidate?.sourceType ?? "manual",
      sourceRecordId: firstAgentRunCandidate?.sourceRecordId,
      status: firstAgentRunCandidate?.status ?? "prompt-ready",
      model: agentModelDraft || firstAgentRunCandidate?.model || "model-not-recorded",
      prompt: agentPromptDraft || firstAgentRunCandidate?.prompt || "No prompt recorded.",
      outputSummary: agentOutputDraft || firstAgentRunCandidate?.outputSummary || "No output summary recorded.",
      inputEvidence: agentEvidenceDraft || firstAgentRunCandidate?.inputEvidence || "No input evidence recorded.",
      toolCalls: agentToolsDraft || firstAgentRunCandidate?.toolCalls || "No tool calls recorded.",
      tokenEstimate: firstAgentRunCandidate?.tokenEstimate,
      replayCommand: agentReplayDraft || firstAgentRunCandidate?.replayCommand || "No replay command recorded.",
      riskNote: agentRiskDraft || firstAgentRunCandidate?.riskNote || "No agent-run risk note recorded.",
      owner: agentOwnerDraft || firstAgentRunCandidate?.suggestedOwner || defaultRiskOwner,
      nextAction: agentNextActionDraft || firstAgentRunCandidate?.nextAction || "No agent-run next action recorded.",
    });
    setAgentModelDraft("");
    setAgentOwnerDraft("");
    setAgentPromptDraft("");
    setAgentOutputDraft("");
    setAgentEvidenceDraft("");
    setAgentToolsDraft("");
    setAgentReplayDraft("");
    setAgentRiskDraft("");
    setAgentNextActionDraft("");
  };

  const handleSaveCompetitor = () => {
    if (!canSaveCompetitor) return;
    onRecordCompetitor(venture.id, {
      sourceType: firstCompetitorCandidate?.sourceType ?? "manual",
      sourceRecordId: firstCompetitorCandidate?.sourceRecordId,
      competitorName: competitorNameDraft || firstCompetitorCandidate?.competitorName || "Manual competitor watch",
      competitorType: firstCompetitorCandidate?.competitorType ?? "substitute",
      threatLevel: firstCompetitorCandidate?.suggestedThreatLevel ?? "medium",
      status: firstCompetitorCandidate?.suggestedStatus ?? "watching",
      positioning: competitorPositioningDraft || firstCompetitorCandidate?.positioning || "No competitor positioning recorded.",
      evidence: competitorEvidenceDraft || firstCompetitorCandidate?.evidence || "No competitor evidence recorded.",
      differentiation: competitorDifferentiationDraft || firstCompetitorCandidate?.differentiation || "No differentiation plan recorded.",
      responsePlan: competitorResponseDraft || firstCompetitorCandidate?.responsePlan || "No competitor response plan recorded.",
      owner: competitorOwnerDraft || firstCompetitorCandidate?.suggestedOwner || defaultRiskOwner,
      watchCadence: competitorCadenceDraft || firstCompetitorCandidate?.watchCadence || "Review before the next scale or kill decision.",
      nextAction: competitorNextActionDraft || firstCompetitorCandidate?.nextAction || "No competitor next action recorded.",
    });
    setCompetitorNameDraft("");
    setCompetitorOwnerDraft("");
    setCompetitorPositioningDraft("");
    setCompetitorEvidenceDraft("");
    setCompetitorDifferentiationDraft("");
    setCompetitorResponseDraft("");
    setCompetitorCadenceDraft("");
    setCompetitorNextActionDraft("");
  };

  const handleSaveBrowserResearchTask = () => {
    if (!canSaveBrowserResearchTask) return;
    onRecordBrowserResearchTask(venture.id, {
      sourceType: firstBrowserResearchCandidate?.sourceType ?? "manual",
      sourceRecordId: firstBrowserResearchCandidate?.sourceRecordId,
      platform: browserResearchPlatformDraft || firstBrowserResearchCandidate?.platform || "web",
      sourceTarget: browserResearchTargetDraft || firstBrowserResearchCandidate?.sourceTarget || "Manual browser research target",
      prompt: firstBrowserResearchCandidate?.prompt || `Research ${venture.title} for source-backed evidence.`,
      status: browserResearchStatus,
      owner: browserResearchOwnerDraft || firstBrowserResearchCandidate?.suggestedOwner || defaultRiskOwner,
      evidenceUrl: browserResearchEvidenceUrlDraft || firstBrowserResearchCandidate?.evidenceUrl || "No evidence URL captured yet.",
      findings: browserResearchFindingsDraft || firstBrowserResearchCandidate?.findings || "No browser research findings captured yet.",
      replayNote: browserResearchReplayDraft || firstBrowserResearchCandidate?.replayNote || "No replay note recorded.",
      nextAction: browserResearchNextActionDraft || firstBrowserResearchCandidate?.nextAction || "No browser research next action recorded.",
    });
    setBrowserResearchStatus("queued");
    setBrowserResearchPlatformDraft("");
    setBrowserResearchTargetDraft("");
    setBrowserResearchOwnerDraft("");
    setBrowserResearchEvidenceUrlDraft("");
    setBrowserResearchFindingsDraft("");
    setBrowserResearchReplayDraft("");
    setBrowserResearchNextActionDraft("");
  };

  const handleSaveAtlasValidationResult = () => {
    if (!firstAtlasValidationPack || !canSaveAtlasValidationResult) return;
    onRecordAtlasValidationResult(venture.id, {
      atlasValidationPackId: firstAtlasValidationPack.id,
      outcome: atlasValidationOutcome,
      qualifiedBuyerCount: parseCountDraft(atlasValidationBuyerDraft),
      painConfirmationCount: parseCountDraft(atlasValidationPainDraft),
      hiddenWedgeResonanceCount: parseCountDraft(atlasValidationWedgeDraft),
      paidPricingSignalCount: parseCountDraft(atlasValidationPaidDraft),
      strongestQuote: atlasValidationQuoteDraft,
      strongestObjection: atlasValidationObjectionDraft,
      evidenceNote: atlasValidationEvidenceDraft,
      learning: atlasValidationLearningDraft,
      owner: atlasValidationOwnerDraft || defaultRiskOwner,
      nextAction: atlasValidationNextActionDraft,
    });
    setAtlasValidationOutcome("passed");
    setAtlasValidationBuyerDraft("");
    setAtlasValidationPainDraft("");
    setAtlasValidationWedgeDraft("");
    setAtlasValidationPaidDraft("");
    setAtlasValidationQuoteDraft("");
    setAtlasValidationObjectionDraft("");
    setAtlasValidationEvidenceDraft("");
    setAtlasValidationLearningDraft("");
    setAtlasValidationOwnerDraft("");
    setAtlasValidationNextActionDraft("");
  };

  const handleSaveProductBuildRun = () => {
    if (!firstValidationBackedProductBuildCommand || !canSaveProductBuildRun) return;
    onRecordProductBuildCommandRun(venture.id, {
      commandId: firstValidationBackedProductBuildCommand.id,
      runState: productBuildRunState,
      owner: productBuildRunOwnerDraft || defaultRiskOwner,
      runProof: productBuildRunProofDraft,
      localArtifactProof: productBuildArtifactProofDraft || firstValidationBackedProductBuildCommand.artifactTarget,
      verifierReportProof: productBuildVerifierProofDraft || firstValidationBackedProductBuildCommand.proofRequired,
      learning: productBuildRunLearningDraft,
    });
    setProductBuildRunState("executed");
    setProductBuildRunProofDraft("");
    setProductBuildArtifactProofDraft("");
    setProductBuildVerifierProofDraft("");
    setProductBuildRunLearningDraft("");
    setProductBuildRunOwnerDraft("");
  };

  const handleSaveDecision = () => {
    if (!canSaveDecision) return;
    onRecordDecision(venture.id, decisionType, nextLifecycleStatus, rationaleDraft, nextActionDraft);
    setRationaleDraft("");
    setNextActionDraft("");
  };

  const handleCopyGapPrompt = async (task: VentureGapActionTask) => {
    try {
      await navigator.clipboard.writeText(task.prompt);
      toast.success("Research prompt copied");
    } catch {
      toast.error("Research prompt could not be copied");
    }
  };

  const handleSaveGapOutcome = (task: VentureGapActionTask) => {
    const outcome = gapOutcomeDrafts[task.id]?.trim() ?? "";
    if (!outcome) return;
    onRecordGapOutcome(venture.id, task, outcome);
    setGapOutcomeDrafts((current) => ({ ...current, [task.id]: "" }));
  };

  return (
    <Card className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{venture.title}</h2>
              <Badge variant="secondary" className={statusBadge(venture.lifecycleStatus)}>
                {venture.lifecycleStatus}
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-white/70 text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                {venture.stageLabel}
              </Badge>
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{venture.productWedge}</p>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            Saved {formatDate(venture.savedAt)}
            <br />
            Updated {formatDate(venture.updatedAt)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Buyer</div>
            <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{venture.targetBuyer}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Evidence</div>
            <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
              {evidenceProfile.sourceCount} sources - {evidenceProfile.readinessScore}/100
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Decision</div>
            <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
              {latestDecision ? decisionLabel(latestDecision.decision) : venture.decision}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900/70 dark:bg-indigo-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
            <h3 className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">Market model</h3>
            <Badge variant="secondary" className={marketConfidenceBadge(marketModel.confidence)}>
              {marketModel.confidence} confidence
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
              {marketModel.confidenceScore}/100
            </Badge>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Competition</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{marketModel.competition}</p>
            </div>
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Channel</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{marketModel.channel}</p>
            </div>
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Pricing</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{marketModel.pricing}</p>
            </div>
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Timing</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{marketModel.timing}</p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Risks</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {marketModel.risks.slice(0, 5).map((risk) => (
                  <Badge key={risk} variant="outline" className="border-indigo-200 bg-indigo-50 text-[10px] text-indigo-800 dark:border-indigo-900/70 dark:bg-indigo-950/30 dark:text-indigo-200">
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Missing proof</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {marketModel.missingProof.slice(0, 5).map((proof) => (
                  <Badge key={proof} variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
                    {proof}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {marketModel.nextAction}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/70 dark:bg-emerald-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardList className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Founder execution memo</h3>
            <Badge variant="secondary" className={founderMemoStatusBadge(founderMemo.status)}>
              {founderMemo.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
              Decision: {founderMemo.primaryDecision}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
              Demand drift: {founderMemo.demandDriftStatus}
            </Badge>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{founderMemo.statusReason}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {founderMemo.primaryNextAction}</p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {founderMemo.sections.slice(0, 4).map((section) => (
              <div key={section.heading} className="rounded-md border border-emerald-200 bg-white/75 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">{section.heading}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{section.body}</p>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-emerald-800 dark:text-emerald-200">Next: {section.nextAction}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            <div className="rounded-md border border-emerald-200 bg-white/75 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">Technical ticket</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{founderMemo.technicalTicket}</p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-white/75 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">Product spec</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{founderMemo.productSpec}</p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-white/75 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">Autonomy boundary</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{founderMemo.autonomyBoundary}</p>
            </div>
          </div>
          <Textarea
            aria-label="Founder memo markdown"
            readOnly
            value={founderMemo.markdown}
            className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
          />
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-3 dark:border-purple-900/70 dark:bg-purple-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 text-purple-700 dark:text-purple-300" />
            <h3 className="text-xs font-semibold text-purple-900 dark:text-purple-100">Investor brief</h3>
            <Badge variant="secondary" className={investorBriefStatusBadge(investorBrief.status)}>
              {investorBrief.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-purple-800 dark:bg-slate-950/70 dark:text-purple-200">
              Investability {investorBrief.investabilityScore}/100
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-purple-800 dark:bg-slate-950/70 dark:text-purple-200">
              {investorBrief.recommendation}
            </Badge>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">Next ask: {investorBrief.nextAsk}</p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            {investorBrief.sections.slice(0, 6).map((section) => (
              <div key={section.heading} className="rounded-md border border-purple-200 bg-white/75 p-2 dark:border-purple-900/70 dark:bg-slate-950/60">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-800 dark:text-purple-200">{section.heading}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{section.body}</p>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-purple-800 dark:text-purple-200">Next: {section.nextAction}</p>
              </div>
            ))}
          </div>
          <Textarea
            aria-label="Investor brief markdown"
            readOnly
            value={investorBrief.markdown}
            className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
          />
        </div>

        <div className="rounded-lg border border-lime-200 bg-lime-50/60 p-3 dark:border-lime-900/70 dark:bg-lime-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <DollarSign className="h-4 w-4 text-lime-700 dark:text-lime-300" />
            <h3 className="text-xs font-semibold text-lime-900 dark:text-lime-100">Financial model</h3>
            <Badge variant="secondary" className={financialModelStatusBadge(financialModel.status)}>
              {financialModel.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
              Finance {financialModel.financeScore}/100
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
              Payback {financialModel.paybackStatus}
            </Badge>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="rounded-md border border-lime-200 bg-white/75 p-2 dark:border-lime-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-200">Revenue evidence</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{financialModel.revenueSummary}</p>
            </div>
            <div className="rounded-md border border-lime-200 bg-white/75 p-2 dark:border-lime-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-200">Costs</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{financialModel.expenseSummary}</p>
            </div>
            <div className="rounded-md border border-lime-200 bg-white/75 p-2 dark:border-lime-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-200">Unit economics</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{financialModel.unitEconomicsSummary}</p>
            </div>
            <div className="rounded-md border border-lime-200 bg-white/75 p-2 dark:border-lime-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-200">Runway</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{financialModel.runwaySummary}</p>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-lime-900 dark:text-lime-100">
            Scaling threshold: {financialModel.scalingThreshold}
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-lime-200 bg-white/75 p-2 dark:border-lime-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-200">Finance risks</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {(financialModel.risks.length > 0 ? financialModel.risks : ["No finance risk detected from recorded evidence."]).slice(0, 4).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-lime-200 bg-white/75 p-2 dark:border-lime-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-200">Finance next actions</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {financialModel.nextActions.slice(0, 4).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
          <Textarea
            aria-label="Financial model markdown"
            readOnly
            value={financialModel.markdown}
            className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
          />
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/70 dark:bg-emerald-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Revenue generation posture</h3>
            <Badge variant="secondary" className={revenueGenerationStatusBadge(revenueGenerationPosture.status)}>
              {revenueGenerationPosture.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
              Capture {revenueGenerationPosture.captureScore}/100
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
              Payback {revenueGenerationPosture.paybackStatus}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
              Pricing {revenueGenerationPosture.pricingCalibrationStatus}
            </Badge>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-900 dark:text-emerald-100">
            {revenueGenerationPosture.summary}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Primary revenue source: {revenueGenerationPosture.primaryRevenueSource}
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-emerald-200 bg-white/80 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">Revenue evidence</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {(revenueGenerationPosture.evidence.length > 0 ? revenueGenerationPosture.evidence : ["No revenue evidence recorded yet."]).slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-emerald-200 bg-white/80 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">Revenue gaps</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {(revenueGenerationPosture.gaps.length > 0 ? revenueGenerationPosture.gaps : ["No revenue evidence gap detected."]).slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-900 dark:text-emerald-100">
            Next action: {revenueGenerationPosture.nextAction}
          </p>
          <Textarea
            aria-label="Revenue generation posture markdown"
            readOnly
            value={revenueGenerationPosture.markdown}
            className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
          />
        </div>

        <ScaleStrongBranchPlanPanel plan={scaleStrongBranchPlan} />

        {readinessNotices.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-slate-500" />
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100">Venture readiness blockers</h3>
              <Badge variant="secondary" className="bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                {readinessNotices.length} open
              </Badge>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {readinessNotices.slice(0, 6).map((notice) => (
                <div key={notice.id} className="rounded-md border border-slate-200 bg-white/80 p-2 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className={readinessNoticeBadge(notice.tone)}>
                      {notice.tone}
                    </Badge>
                    <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{notice.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{notice.detail}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {notice.nextAction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <FailureLessonsPanel lessons={ventureFailureLessons} />
        <RevivalTriggersPanel triggers={ventureRevivalTriggers} />

        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-slate-500" />
                <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100">Evidence readiness</h3>
                <Badge variant="secondary" className={readinessBadge(evidenceProfile.readiness)}>
                  {evidenceProfile.readiness}
                </Badge>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Average source quality {evidenceProfile.averageScore}/100 - {evidenceProfile.strongSourceCount} strong - {evidenceProfile.weakSourceCount} weak - {evidenceProfile.missingEvidenceCount} gaps - {evidenceProfile.contradictionCount} contradictions
              </p>
            </div>
          </div>
          {evidenceProfile.warnings.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {evidenceProfile.warnings.slice(0, 3).map((warning) => (
                <Badge key={warning} variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
                  {warning}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Source provenance</div>
            {evidenceProfile.scoredSources.length === 0 ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No linked sources are stored for this venture yet.</p>
            ) : (
              <div className="mt-2 grid grid-cols-1 gap-2">
                {evidenceProfile.scoredSources.slice(0, 3).map((source) => (
                  <div key={source.id} className="rounded-md border border-slate-200 bg-white/80 p-2 dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary" className={qualityBadge(source.quality.label)}>
                            {source.quality.label} {source.quality.score}
                          </Badge>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-100">{source.platform}</span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{source.title}</p>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{source.summary}</p>
                      </div>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300"
                        >
                          Open
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/70 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-amber-700 dark:text-amber-300" />
            <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-100">Gap action queue</h3>
            <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
              {gapTasks.length} tasks
            </Badge>
          </div>
          {gapTasks.length === 0 ? (
            <p className="mt-2 text-xs leading-relaxed text-amber-800/70 dark:text-amber-200/70">
              No evidence gaps are queued for this venture.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-1 gap-2">
              {gapTasks.slice(0, 4).map((task) => {
                const actionRecord = gapActionByTaskId.get(task.id);
                const outcomeDraft = gapOutcomeDrafts[task.id] ?? "";
                return (
                  <div key={task.id} className="rounded-md border border-amber-200 bg-white/75 p-2 dark:border-amber-900/70 dark:bg-slate-950/60">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary" className={priorityBadge(task.priority)}>
                            {task.priority}
                          </Badge>
                          {actionRecord && (
                            <Badge variant="secondary" className={gapStatusBadge(actionRecord.status)}>
                              {actionRecord.status}
                            </Badge>
                          )}
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{task.title}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{task.reason}</p>
                        {actionRecord?.outcome && (
                          <div className="mt-2 rounded border border-amber-200 bg-amber-50/80 p-2 dark:border-amber-900/70 dark:bg-amber-950/30">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">Gap outcome recorded</div>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{actionRecord.outcome}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void handleCopyGapPrompt(task)}
                          className="h-7 text-[11px]"
                        >
                          Copy prompt
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => void onLaunchGapMission(venture.id, task)}
                          disabled={isLaunchingGapMission}
                          className="h-7 bg-amber-700 text-[11px] text-white hover:bg-amber-800"
                        >
                          {isLaunchingGapMission ? "Launching..." : "Launch research"}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
                      <Textarea
                        value={outcomeDraft}
                        onChange={(event) => setGapOutcomeDrafts((current) => ({
                          ...current,
                          [task.id]: event.target.value,
                        }))}
                        placeholder="Record gap outcome..."
                        className="min-h-[60px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveGapOutcome(task)}
                        disabled={!outcomeDraft.trim()}
                        className="h-8 self-start bg-amber-700 text-xs text-white hover:bg-amber-800"
                      >
                        Save gap outcome
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 dark:border-sky-900/70 dark:bg-sky-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <Activity className="h-4 w-4 text-sky-700 dark:text-sky-300" />
            <h3 className="text-xs font-semibold text-sky-900 dark:text-sky-100">Browser research queue</h3>
            <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
              {venture.browserResearchTasks.length} saved
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
              {browserResearchCandidates.length} inbox
            </Badge>
            {latestBrowserResearchTask && (
              <Badge variant="secondary" className={browserResearchStatusBadge(latestBrowserResearchTask.status)}>
                {browserResearchStatusLabel(latestBrowserResearchTask.status)}
              </Badge>
            )}
          </div>
          {latestBrowserResearchTask ? (
            <div className="mt-2 rounded-md border border-sky-200 bg-white/75 p-2 dark:border-sky-900/70 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-200">Latest browser research task</span>
                <Badge variant="secondary" className={browserResearchStatusBadge(latestBrowserResearchTask.status)}>
                  {browserResearchStatusLabel(latestBrowserResearchTask.status)}
                </Badge>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  {latestBrowserResearchTask.platform}
                </Badge>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestBrowserResearchTask.sourceTarget}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestBrowserResearchTask.findings}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Evidence: {latestBrowserResearchTask.evidenceUrl}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Replay: {latestBrowserResearchTask.replayNote}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestBrowserResearchTask.nextAction}</p>
            </div>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-sky-800/70 dark:text-sky-200/70">No browser research task has been saved yet.</p>
          )}
          {firstBrowserResearchCandidate && (
            <div className="mt-2 rounded-md border border-sky-200 bg-white/75 p-2 dark:border-sky-900/70 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-200">Browser research candidate</span>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  {firstBrowserResearchCandidate.platform}
                </Badge>
                <Badge variant="secondary" className={browserResearchStatusBadge(firstBrowserResearchCandidate.suggestedStatus)}>
                  {browserResearchStatusLabel(firstBrowserResearchCandidate.suggestedStatus)}
                </Badge>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstBrowserResearchCandidate.sourceTarget}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{firstBrowserResearchCandidate.prompt}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Replay: {firstBrowserResearchCandidate.replayNote}</p>
            </div>
          )}
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            <Select value={browserResearchStatus} onValueChange={(value) => setBrowserResearchStatus(value as VentureBrowserResearchStatus)}>
              <SelectTrigger
                aria-label="Browser research status"
                size="sm"
                className="w-full border-sky-200 bg-white/80 text-xs dark:border-sky-900/70 dark:bg-slate-950/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENTURE_BROWSER_RESEARCH_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={browserResearchPlatformDraft}
              onChange={(event) => setBrowserResearchPlatformDraft(event.target.value)}
              placeholder="Browser research platform"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={browserResearchOwnerDraft}
              onChange={(event) => setBrowserResearchOwnerDraft(event.target.value)}
              placeholder="Browser research owner"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={browserResearchTargetDraft}
              onChange={(event) => setBrowserResearchTargetDraft(event.target.value)}
              placeholder="Source target"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={browserResearchEvidenceUrlDraft}
              onChange={(event) => setBrowserResearchEvidenceUrlDraft(event.target.value)}
              placeholder="Evidence URL"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={browserResearchNextActionDraft}
              onChange={(event) => setBrowserResearchNextActionDraft(event.target.value)}
              placeholder="Browser research next action"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Textarea
              value={browserResearchFindingsDraft}
              onChange={(event) => setBrowserResearchFindingsDraft(event.target.value)}
              placeholder="Browser findings"
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Textarea
              value={browserResearchReplayDraft}
              onChange={(event) => setBrowserResearchReplayDraft(event.target.value)}
              placeholder="Browser replay note"
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveBrowserResearchTask}
            disabled={!canSaveBrowserResearchTask}
            className="mt-2 h-8 self-start bg-sky-700 text-xs text-white hover:bg-sky-800"
          >
            Save browser research task
          </Button>
        </div>

        <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3 dark:border-violet-900/70 dark:bg-violet-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <FlaskConical className="h-4 w-4 text-violet-700 dark:text-violet-300" />
            <h3 className="text-xs font-semibold text-violet-900 dark:text-violet-100">Demand calibration</h3>
            <Badge variant="secondary" className={demandStatusBadge(demandCalibration.status)}>
              {demandCalibration.status}
            </Badge>
            <span className="text-[11px] text-violet-800/70 dark:text-violet-200/70">
              {demandCalibration.measuredExperimentCount} measured - {demandCalibration.passCount} pass - {demandCalibration.failCount} fail
            </span>
            <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
              {venture.predictionSnapshots.length} prediction snapshot{venture.predictionSnapshots.length === 1 ? "" : "s"}
            </Badge>
          </div>
          <div className="mt-2 rounded-md border border-violet-200 bg-white/75 p-2 dark:border-violet-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">Demand drift analytics</span>
              <Badge variant="secondary" className={demandDriftBadge(demandDrift.status)}>
                {demandDrift.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
                Actual demand score {demandDrift.actualDemandScore}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Baseline {demandDrift.baselineDemandScore}/100; drift {demandDrift.drift >= 0 ? "+" : ""}{demandDrift.drift}; {demandDrift.evidenceComponentCount} reality component{demandDrift.evidenceComponentCount === 1 ? "" : "s"}.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{demandDrift.reason}</p>
            {demandDrift.components[0] && (
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Leading signal: {demandDrift.components[0].label} {demandDrift.components[0].score}/100.
              </p>
            )}
            <p className="mt-1 text-[11px] font-semibold leading-relaxed text-violet-800 dark:text-violet-200">
              Next: {demandDrift.nextAction}
            </p>
          </div>
          {demandCalibration.experiments.length === 0 ? (
            <>
              {venture.opportunityDemandSnapshot && (
                <div className="mt-2 rounded-md border border-violet-200 bg-white/75 p-2 dark:border-violet-900/70 dark:bg-slate-950/60">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">Opportunity demand snapshot</span>
                    <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
                      Pre-venture demand score {venture.opportunityDemandSnapshot.demandScore}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Buyer: {venture.opportunityDemandSnapshot.buyer}; pain urgency {venture.opportunityDemandSnapshot.painUrgencyScore}/100; demand evidence {venture.opportunityDemandSnapshot.demandEvidenceScore}/100
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {venture.opportunityDemandSnapshot.demandSignals[0] ?? "No demand signal captured yet."}
                  </p>
                </div>
              )}
              <p className="mt-2 text-xs leading-relaxed text-violet-800/70 dark:text-violet-200/70">
                No experiment result has been recorded yet, so the demand forecast is uncalibrated.
              </p>
              {leadingPrediction ? (
                <div className="mt-2 rounded-md border border-violet-200 bg-white/75 p-2 dark:border-violet-900/70 dark:bg-slate-950/60">
                  <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                    Prediction snapshot: {predictionOutcomeLabel(leadingPrediction.predictedOutcome)} at {formatPredictionScore(leadingPrediction.conversionProbability)} conversion probability
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Buyer urgency {leadingPrediction.buyerUrgency}/100 - budget likelihood {leadingPrediction.budgetLikelihood}/100 - adoption friction {leadingPrediction.adoptionFriction}/100 - trust barrier {leadingPrediction.trustBarrier}/100
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{leadingPrediction.rationale}</p>
                </div>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-violet-800/70 dark:text-violet-200/70">
                  No pre-run prediction snapshot has been stored for this venture yet.
                </p>
              )}
            </>
          ) : (
            <div className="mt-2 flex flex-col gap-1.5">
              {venture.opportunityDemandSnapshot && (
                <div className="rounded-md border border-violet-200 bg-white/75 p-2 dark:border-violet-900/70 dark:bg-slate-950/60">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">Opportunity demand snapshot</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Pre-venture demand score {venture.opportunityDemandSnapshot.demandScore}; buyer {venture.opportunityDemandSnapshot.buyer}; demand evidence {venture.opportunityDemandSnapshot.demandEvidenceScore}/100.
                  </p>
                </div>
              )}
              {demandCalibration.experiments.slice(0, 2).map((experiment) => (
                <div key={experiment.experimentId} className="rounded-md border border-violet-200 bg-white/75 p-2 dark:border-violet-900/70 dark:bg-slate-950/60">
                  <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{experiment.note}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{experiment.interpretation}</p>
                  {experiment.prediction ? (
                    <div className="mt-2 rounded border border-violet-200 bg-violet-50/70 p-2 dark:border-violet-900/70 dark:bg-violet-950/30">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                          Prediction snapshot: {predictionOutcomeLabel(experiment.prediction.predictedOutcome)} at {formatPredictionScore(experiment.prediction.conversionProbability)} conversion probability
                        </span>
                        <Badge variant="secondary" className={predictionAlignmentBadge(experiment.predictionAlignment)}>
                          Prediction alignment: {experiment.predictionAlignment}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        Retention {experiment.prediction.retentionProbability}/100 - expansion {experiment.prediction.expansionPotential}/100 - channel reach {experiment.prediction.channelReach}/100
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Prediction alignment: not-predicted
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <DollarSign className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
            <h3 className="text-xs font-semibold text-cyan-900 dark:text-cyan-100">Pricing calibration</h3>
            <Badge variant="secondary" className={pricingStatusBadge(pricingCalibration.status)}>
              {pricingCalibration.status}
            </Badge>
            <span className="text-[11px] text-cyan-800/70 dark:text-cyan-200/70">
              {pricingCalibration.paidSignalCount} paid signals - {pricingCalibration.qualifiedBuyerCount} qualified buyers
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-cyan-800/80 dark:text-cyan-200/80">
            Pricing hypothesis: {venture.pricingHypothesis}
          </p>
          <div className="mt-2 rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
            <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{pricingCalibration.note}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Willingness to pay score {pricingCalibration.willingnessToPayScore}/100 - strongest accepted price {pricingCalibration.strongestAcceptedPrice}
            </p>
            {pricingCalibration.latestSignal && (
              <div className="mt-2 rounded border border-cyan-200 bg-cyan-50/70 p-2 dark:border-cyan-900/70 dark:bg-cyan-950/30">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Latest pricing signal</div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {pricingCalibration.latestSignal.paidCommitmentCount} paid commitments and {pricingCalibration.latestSignal.invoiceRequestCount} invoice requests from {pricingCalibration.latestSignal.qualifiedBuyerCount} qualified buyers at {pricingCalibration.latestSignal.acceptedPrice}.
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{pricingCalibration.latestSignal.objectionSummary}</p>
              </div>
            )}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={qualifiedBuyerDraft}
              onChange={(event) => setQualifiedBuyerDraft(event.target.value)}
              placeholder="Qualified buyers"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={paidCommitmentDraft}
              onChange={(event) => setPaidCommitmentDraft(event.target.value)}
              placeholder="Paid commitments"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={invoiceRequestDraft}
              onChange={(event) => setInvoiceRequestDraft(event.target.value)}
              placeholder="Invoice requests"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={acceptedPriceDraft}
              onChange={(event) => setAcceptedPriceDraft(event.target.value)}
              placeholder="Accepted price"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Textarea
              value={pricingObjectionDraft}
              onChange={(event) => setPricingObjectionDraft(event.target.value)}
              placeholder="Record pricing objections..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Textarea
              value={pricingEvidenceDraft}
              onChange={(event) => setPricingEvidenceDraft(event.target.value)}
              placeholder="Record pricing evidence..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSavePricingSignal}
            disabled={!canSavePricingSignal}
            className="mt-2 h-8 self-start bg-cyan-700 text-xs text-white hover:bg-cyan-800"
          >
            Save pricing signal
          </Button>
        </div>

        <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50/60 p-3 dark:border-fuchsia-900/70 dark:bg-fuchsia-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-fuchsia-700 dark:text-fuchsia-300" />
            <h3 className="text-xs font-semibold text-fuchsia-900 dark:text-fuchsia-100">Customer interview memory</h3>
            <Badge variant="secondary" className="bg-white/80 text-fuchsia-800 dark:bg-slate-950/70 dark:text-fuchsia-200">
              {venture.customerInterviews.length} interviews
            </Badge>
            {latestInterview && (
              <Badge variant="secondary" className={interviewSentimentBadge(latestInterview.sentiment)}>
                {latestInterview.sentiment}
              </Badge>
            )}
          </div>
          {latestInterview ? (
            <div className="mt-2 rounded-md border border-fuchsia-200 bg-white/75 p-2 dark:border-fuchsia-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-800 dark:text-fuchsia-200">Latest interview</div>
              <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestInterview.persona} via {latestInterview.channel}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestInterview.painQuote}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">WTP: {latestInterview.willingnessToPay}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Objections: {latestInterview.objections}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Feature requests: {latestInterview.requestedFeatures}</p>
            </div>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-fuchsia-800/70 dark:text-fuchsia-200/70">
              No customer interview has been recorded yet. Capture a buyer quote before trusting the persona.
            </p>
          )}
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_160px]">
            <Input
              value={interviewPersonaDraft}
              onChange={(event) => setInterviewPersonaDraft(event.target.value)}
              placeholder="Interview persona"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={interviewChannelDraft}
              onChange={(event) => setInterviewChannelDraft(event.target.value)}
              placeholder="Interview channel"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Select value={interviewSentiment} onValueChange={(value) => setInterviewSentiment(value as VentureInterviewSentiment)}>
              <SelectTrigger
                aria-label="Interview sentiment"
                size="sm"
                className="w-full border-fuchsia-200 bg-white/80 text-xs dark:border-fuchsia-900/70 dark:bg-slate-950/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Textarea
              value={interviewPainDraft}
              onChange={(event) => setInterviewPainDraft(event.target.value)}
              placeholder="Record buyer pain quote..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Textarea
              value={interviewWtpDraft}
              onChange={(event) => setInterviewWtpDraft(event.target.value)}
              placeholder="Record willingness-to-pay quote..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Textarea
              value={interviewObjectionsDraft}
              onChange={(event) => setInterviewObjectionsDraft(event.target.value)}
              placeholder="Record interview objections..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Textarea
              value={interviewFeaturesDraft}
              onChange={(event) => setInterviewFeaturesDraft(event.target.value)}
              placeholder="Record requested features..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
          </div>
          <Textarea
            value={interviewEvidenceDraft}
            onChange={(event) => setInterviewEvidenceDraft(event.target.value)}
            placeholder="Record interview evidence note..."
            className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSaveCustomerInterview}
            disabled={!canSaveInterview}
            className="mt-2 h-8 self-start bg-fuchsia-700 text-xs text-white hover:bg-fuchsia-800"
          >
            Save customer interview
          </Button>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900/70 dark:bg-indigo-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <Send className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
            <h3 className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">Outreach approval log</h3>
            <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
              {venture.outreachApprovals.length} approvals
            </Badge>
            {latestOutreachApproval && (
              <Badge variant="secondary" className={outreachStatusBadge(latestOutreachApproval.status)}>
                {outreachStatusLabel(latestOutreachApproval.status)}
              </Badge>
            )}
          </div>
          {latestOutreachApproval ? (
            <div className="mt-2 rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Latest outreach approval</div>
              <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
                {latestOutreachApproval.contactPersona} via {latestOutreachApproval.channel}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestOutreachApproval.messageDraft}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Risk: {latestOutreachApproval.riskNote}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestOutreachApproval.nextAction}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Attributed to {latestOutreachApproval.attribution}. No external message was sent.
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-indigo-800/70 dark:text-indigo-200/70">
              No outreach approval has been recorded yet.
            </p>
          )}
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_180px]">
            <Input
              value={outreachPersonaDraft}
              onChange={(event) => setOutreachPersonaDraft(event.target.value)}
              placeholder="Outreach contact persona"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={outreachChannelDraft}
              onChange={(event) => setOutreachChannelDraft(event.target.value)}
              placeholder="Outreach channel"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Select value={outreachStatus} onValueChange={(value) => setOutreachStatus(value as VentureOutreachApprovalStatus)}>
              <SelectTrigger
                aria-label="Outreach status"
                size="sm"
                className="w-full border-indigo-200 bg-white/80 text-xs dark:border-indigo-900/70 dark:bg-slate-950/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENTURE_OUTREACH_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={outreachMessageDraft}
            onChange={(event) => setOutreachMessageDraft(event.target.value)}
            placeholder="Draft outreach message..."
            className="mt-2 min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
          />
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Textarea
              value={outreachRiskDraft}
              onChange={(event) => setOutreachRiskDraft(event.target.value)}
              placeholder="Record outreach risk note..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Textarea
              value={outreachNextActionDraft}
              onChange={(event) => setOutreachNextActionDraft(event.target.value)}
              placeholder="Define outreach next action..."
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveOutreachApproval}
            disabled={!canSaveOutreachApproval}
            className="mt-2 h-8 self-start bg-indigo-700 text-xs text-white hover:bg-indigo-800"
          >
            Save outreach approval
          </Button>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900/70 dark:bg-indigo-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <Send className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
            <h3 className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">Outreach campaign brief</h3>
            <Badge variant="secondary" className={outreachCampaignStatusBadge(outreachCampaign.status)}>
              {outreachCampaign.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
              {outreachCampaign.channel}
            </Badge>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{outreachCampaign.persona}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{outreachCampaign.approvalBoundary}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{outreachCampaign.noSendBoundary}</p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Message sequence</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {outreachCampaign.messageSequence.slice(0, 4).map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Risk checks</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {outreachCampaign.riskChecks.slice(0, 4).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Proof points</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {(outreachCampaign.proofPoints.length > 0 ? outreachCampaign.proofPoints : ["No campaign proof point recorded yet."]).slice(0, 4).map((proof) => (
                  <li key={proof}>{proof}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Campaign next actions</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {outreachCampaign.nextActions.slice(0, 4).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
          <Textarea
            aria-label="Outreach campaign markdown"
            readOnly
            value={outreachCampaign.markdown}
            className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
          />
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 dark:border-red-900/70 dark:bg-red-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-700 dark:text-red-300" />
            <h3 className="text-xs font-semibold text-red-900 dark:text-red-100">Risk register</h3>
            <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
              {venture.riskRecords.length} records
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
              {riskCandidates.length} inbox signal{riskCandidates.length === 1 ? "" : "s"}
            </Badge>
          </div>
          {latestRiskRecord ? (
            <div className="mt-2 rounded-md border border-red-200 bg-white/75 p-2 dark:border-red-900/70 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-800 dark:text-red-200">Latest risk record</span>
                <Badge variant="secondary" className={riskSeverityBadge(latestRiskRecord.severity)}>
                  {latestRiskRecord.severity}
                </Badge>
                <Badge variant="secondary" className={riskStatusBadge(latestRiskRecord.status)}>
                  {riskStatusLabel(latestRiskRecord.status)}
                </Badge>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestRiskRecord.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestRiskRecord.detail}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestRiskRecord.owner}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Mitigation: {latestRiskRecord.mitigation}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Resolution evidence: {latestRiskRecord.resolutionEvidence}</p>
            </div>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-red-800/70 dark:text-red-200/70">
              No risk record has been assigned yet.
            </p>
          )}
          {firstRiskCandidate ? (
            <div className="mt-2 rounded-md border border-red-200 bg-white/75 p-2 dark:border-red-900/70 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-800 dark:text-red-200">Customer inbox risk candidate</span>
                <Badge variant="secondary" className={riskSeverityBadge(firstRiskCandidate.suggestedSeverity)}>
                  {firstRiskCandidate.suggestedSeverity}
                </Badge>
                <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
                  {firstRiskCandidate.sourceType}
                </Badge>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstRiskCandidate.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{firstRiskCandidate.detail}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{firstRiskCandidate.suggestedMitigation}</p>
            </div>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-red-800/70 dark:text-red-200/70">
              No untriaged customer inbox risks are pending from interviews, outreach, or gap outcomes.
            </p>
          )}
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_160px_160px]">
            <Input
              value={riskTitleDraft}
              onChange={(event) => setRiskTitleDraft(event.target.value)}
              placeholder="Risk title"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={riskOwnerDraft}
              onChange={(event) => setRiskOwnerDraft(event.target.value)}
              placeholder="Risk owner"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Select value={riskSeverity} onValueChange={(value) => setRiskSeverity(value as VentureRiskSeverity)}>
              <SelectTrigger
                aria-label="Risk severity"
                size="sm"
                className="w-full border-red-200 bg-white/80 text-xs dark:border-red-900/70 dark:bg-slate-950/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENTURE_RISK_SEVERITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={riskStatus} onValueChange={(value) => setRiskStatus(value as VentureRiskStatus)}>
              <SelectTrigger
                aria-label="Risk status"
                size="sm"
                className="w-full border-red-200 bg-white/80 text-xs dark:border-red-900/70 dark:bg-slate-950/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENTURE_RISK_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={riskDetailDraft}
            onChange={(event) => setRiskDetailDraft(event.target.value)}
            placeholder="Risk detail"
            className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
          />
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <Textarea
              value={riskMitigationDraft}
              onChange={(event) => setRiskMitigationDraft(event.target.value)}
              placeholder="Risk mitigation"
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Textarea
              value={riskResolutionDraft}
              onChange={(event) => setRiskResolutionDraft(event.target.value)}
              placeholder="Resolution evidence"
              className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveRisk}
            disabled={!canSaveRisk}
            className="mt-2 h-8 self-start bg-red-700 text-xs text-white hover:bg-red-800"
          >
            Save risk record
          </Button>
        </div>

        <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-3 dark:border-teal-900/70 dark:bg-teal-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <Code2 className="h-4 w-4 text-teal-700 dark:text-teal-300" />
            <h3 className="text-xs font-semibold text-teal-900 dark:text-teal-100">MVP build workspace</h3>
            <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
              {venture.mvpBuildWorkspaces.length} workspace{venture.mvpBuildWorkspaces.length === 1 ? "" : "s"}
            </Badge>
            {latestMvpBuildWorkspace && (
              <Badge variant="secondary" className={mvpBuildStatusBadge(latestMvpBuildWorkspace.status)}>
                {mvpBuildStatusLabel(latestMvpBuildWorkspace.status)}
              </Badge>
            )}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Handoff truth</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{venture.mvpHandoff.sourceCodeStatus}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{venture.mvpHandoff.setupInstructions}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{venture.mvpHandoff.testCoverage}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{venture.mvpHandoff.deploymentPath}</p>
            </div>
            <div className="rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
              {latestMvpBuildWorkspace ? (
                <>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <PackageCheck className="h-3.5 w-3.5 text-teal-700 dark:text-teal-300" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Latest MVP build workspace</span>
                    <Badge variant="secondary" className={mvpBuildStatusBadge(latestMvpBuildWorkspace.status)}>
                      {mvpBuildStatusLabel(latestMvpBuildWorkspace.status)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestMvpBuildWorkspace.repoPath}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestMvpBuildWorkspace.owner}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Checks: {countPassedMvpChecks(latestMvpBuildWorkspace)}/6 passed
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[
                      ["Setup", latestMvpBuildWorkspace.setupCheck],
                      ["Typecheck", latestMvpBuildWorkspace.typecheckCheck],
                      ["Unit tests", latestMvpBuildWorkspace.unitTestCheck],
                      ["Build", latestMvpBuildWorkspace.buildCheck],
                      ["Browser smoke", latestMvpBuildWorkspace.browserSmokeCheck],
                      ["Deployment", latestMvpBuildWorkspace.deploymentCheck],
                    ].map(([label, status]) => (
                      <Badge key={label} variant="secondary" className={mvpCheckStatusBadge(status as VentureMvpCheckStatus)}>
                        {label}: {mvpCheckStatusLabel(status as VentureMvpCheckStatus)}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestMvpBuildWorkspace.verificationNotes}</p>
                </>
              ) : (
                <p className="text-xs leading-relaxed text-teal-800/70 dark:text-teal-200/70">
                  No MVP build workspace has been saved yet.
                </p>
              )}
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_180px]">
            <Input
              value={mvpRepoPathDraft}
              onChange={(event) => setMvpRepoPathDraft(event.target.value)}
              placeholder="Generated repo path"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Input
              value={mvpOwnerDraft}
              onChange={(event) => setMvpOwnerDraft(event.target.value)}
              placeholder="MVP workspace owner"
              className="bg-white/80 text-xs dark:bg-slate-950/70"
            />
            <Select value={mvpBuildStatus} onValueChange={(value) => setMvpBuildStatus(value as VentureMvpBuildStatus)}>
              <SelectTrigger
                aria-label="MVP build status"
                size="sm"
                className="w-full border-teal-200 bg-white/80 text-xs dark:border-teal-900/70 dark:bg-slate-950/70"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENTURE_MVP_BUILD_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-6">
            <MvpCheckSelect label="Setup check" value={mvpSetupCheck} onChange={setMvpSetupCheck} />
            <MvpCheckSelect label="Typecheck check" value={mvpTypecheckCheck} onChange={setMvpTypecheckCheck} />
            <MvpCheckSelect label="Unit test check" value={mvpUnitTestCheck} onChange={setMvpUnitTestCheck} />
            <MvpCheckSelect label="Build check" value={mvpBuildCheck} onChange={setMvpBuildCheck} />
            <MvpCheckSelect label="Browser smoke check" value={mvpBrowserSmokeCheck} onChange={setMvpBrowserSmokeCheck} />
            <MvpCheckSelect label="Deployment check" value={mvpDeploymentCheck} onChange={setMvpDeploymentCheck} />
          </div>
          <Textarea
            value={mvpVerificationDraft}
            onChange={(event) => setMvpVerificationDraft(event.target.value)}
            placeholder="Record MVP workspace verification notes..."
            className="mt-2 min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSaveMvpBuildWorkspace}
            disabled={!canSaveMvpBuildWorkspace}
            className="mt-2 h-8 self-start bg-teal-700 text-xs text-white hover:bg-teal-800"
          >
            Save MVP build workspace
          </Button>
        </div>

        <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-3 dark:border-teal-900/70 dark:bg-teal-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <Code2 className="h-4 w-4 text-teal-700 dark:text-teal-300" />
            <h3 className="text-xs font-semibold text-teal-900 dark:text-teal-100">Generated app handoff</h3>
            <Badge variant="secondary" className={generatedAppStatusBadge(generatedAppHandoff.status)}>
              {generatedAppHandoff.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
              {generatedAppHandoff.appName}
            </Badge>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{generatedAppHandoff.generationBoundary}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Repo: {generatedAppHandoff.repoPath}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Deployment: {generatedAppHandoff.deploymentBoundary}</p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Route plan</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {generatedAppHandoff.routePlan.slice(0, 5).map((route) => (
                  <li key={route}>{route}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">File manifest</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {generatedAppHandoff.fileManifest.slice(0, 5).map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Data model</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {generatedAppHandoff.dataModel.slice(0, 5).map((model) => (
                  <li key={model}>{model}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Verification commands</div>
              <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {generatedAppHandoff.verificationCommands.slice(0, 5).map((command) => (
                  <li key={command}>{command}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-2 rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Generated source scaffold</div>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                {generatedAppHandoff.sourceScaffold.status}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{generatedAppHandoff.sourceScaffold.sourceBoundary}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Local target: {generatedAppHandoff.sourceScaffold.localTargetPath}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Runnable proof: {generatedAppHandoff.sourceScaffold.runnableProofStatus}</p>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Source files</div>
                <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {generatedAppHandoff.sourceScaffold.sourceFiles.slice(0, 8).map((file) => (
                    <li key={file.path}>{file.path}: {file.contentSignature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Proof capture checklist</div>
                <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {generatedAppHandoff.sourceScaffold.proofCaptureChecklist.slice(0, 5).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">No-fake-source safeguards</div>
                <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {generatedAppHandoff.sourceScaffold.noFakeSourceSafeguards.slice(0, 4).map((safeguard) => (
                    <li key={safeguard}>{safeguard}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Textarea
              aria-label="Generated app source scaffold markdown"
              readOnly
              value={generatedAppHandoff.sourceScaffold.markdown}
              className="mt-2 min-h-[104px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
            />
            <Textarea
              aria-label="Generated app source file preview"
              readOnly
              value={generatedAppHandoff.sourceScaffold.sourceFiles.find((file) => file.path === "src/App.tsx")?.content ?? generatedAppHandoff.sourceScaffold.sourceFiles[0]?.content ?? ""}
              className="mt-2 min-h-[104px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
            />
          </div>
          <div className="mt-2 rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Generated app verification proof</div>
              <Badge variant="secondary" className={generatedAppProofStatusBadge(generatedAppProof.status)}>
                {generatedAppProof.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
                {generatedAppProof.passedCheckCount}/{generatedAppProof.requiredCheckCount} passed
              </Badge>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{generatedAppProof.proofSummary}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Target: {generatedAppProof.targetPath}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Verifier: {generatedAppProof.verifierCommand}</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleStageGeneratedAppProofArtifact}
              className="mt-2 h-8 border-teal-200 bg-white/80 text-xs text-teal-800 hover:bg-teal-100 dark:border-teal-900/70 dark:bg-slate-950/70 dark:text-teal-200"
            >
              Stage verifier proof artifact
            </Button>
            <div className="mt-2 rounded-md border border-teal-200 bg-white/75 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Verifier report import</div>
              <Input
                aria-label="Generated app verifier report file"
                type="file"
                accept=".json,application/json,text/plain"
                onChange={handleLoadVerifierReportFile}
                className="mt-2 bg-white/80 text-xs dark:bg-slate-950/70"
              />
              <Textarea
                aria-label="Generated app verifier report JSON"
                value={verifierReportDraft}
                onChange={(event) => setVerifierReportDraft(event.target.value)}
                placeholder="Paste generated-app:verify JSON report..."
                className="mt-2 min-h-[88px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleSaveVerifierReport}
                disabled={!canSaveVerifierReport}
                className="mt-2 h-8 bg-teal-700 text-xs text-white hover:bg-teal-800"
              >
                Save verifier report
              </Button>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Proof checks</div>
                <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {generatedAppProof.checks.slice(0, 6).map((check) => (
                    <li key={check.label}>{check.label}: {mvpCheckStatusLabel(check.status)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Missing proof</div>
                <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {generatedAppProof.missingProof.slice(0, 6).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Textarea
              aria-label="Generated app verification proof markdown"
              readOnly
              value={generatedAppProof.markdown}
              className="mt-2 min-h-[104px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
            />
          </div>
          <Textarea
            aria-label="Generated app handoff markdown"
            readOnly
            value={generatedAppHandoff.markdown}
            className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
          />
        </div>

        <QaReleaseReportPanel qaReport={qaReport} />

        <DeploymentReadinessPacketPanel
          deploymentPacket={deploymentPacket}
          deploymentMatrix={deploymentMatrix}
          onStageDeploymentRehearsalProof={handleStageDeploymentRehearsalProof}
          onStageDeploymentPromotionTask={handleStageDeploymentPromotionTask}
        />

        <ArtifactChangelogLedgerPanel
          artifactRecordCount={venture.artifactRecords.length}
          latestArtifactRecord={latestArtifactRecord}
          artifactType={artifactType}
          artifactStatus={artifactStatus}
          artifactTitleDraft={artifactTitleDraft}
          artifactUriDraft={artifactUriDraft}
          artifactOwnerDraft={artifactOwnerDraft}
          artifactCommandDraft={artifactCommandDraft}
          artifactEvidenceDraft={artifactEvidenceDraft}
          artifactChangeDraft={artifactChangeDraft}
          canSaveArtifact={canSaveArtifact}
          onArtifactTypeChange={setArtifactType}
          onArtifactStatusChange={setArtifactStatus}
          onArtifactTitleDraftChange={setArtifactTitleDraft}
          onArtifactUriDraftChange={setArtifactUriDraft}
          onArtifactOwnerDraftChange={setArtifactOwnerDraft}
          onArtifactCommandDraftChange={setArtifactCommandDraft}
          onArtifactEvidenceDraftChange={setArtifactEvidenceDraft}
          onArtifactChangeDraftChange={setArtifactChangeDraft}
          onSaveArtifact={handleSaveArtifact}
        />

        <RevenueCostLedgerPanel
          moneySignalCount={venture.moneySignals.length}
          latestMoneySignal={latestMoneySignal}
          spendGatedMoneySignalCount={spendGatedMoneySignalCount}
          billingGatedMoneySignalCount={billingGatedMoneySignalCount}
          moneyType={moneyType}
          moneyStatus={moneyStatus}
          moneyAmountDraft={moneyAmountDraft}
          moneyCurrencyDraft={moneyCurrencyDraft}
          moneySourceDraft={moneySourceDraft}
          moneyOwnerDraft={moneyOwnerDraft}
          moneyEvidenceDraft={moneyEvidenceDraft}
          moneyNotesDraft={moneyNotesDraft}
          canSaveMoneySignal={canSaveMoneySignal}
          onMoneyTypeChange={setMoneyType}
          onMoneyStatusChange={setMoneyStatus}
          onMoneyAmountDraftChange={setMoneyAmountDraft}
          onMoneyCurrencyDraftChange={setMoneyCurrencyDraft}
          onMoneySourceDraftChange={setMoneySourceDraft}
          onMoneyOwnerDraftChange={setMoneyOwnerDraft}
          onMoneyEvidenceDraftChange={setMoneyEvidenceDraft}
          onMoneyNotesDraftChange={setMoneyNotesDraft}
          onSaveMoneySignal={handleSaveMoneySignal}
        />

        <RoadmapSupportQueuePanel
          roadmapTaskCount={venture.roadmapTasks.length}
          roadmapCandidateCount={roadmapCandidates.length}
          latestRoadmapTask={latestRoadmapTask}
          firstRoadmapCandidate={firstRoadmapCandidate}
          roadmapTitleDraft={roadmapTitleDraft}
          roadmapOwnerDraft={roadmapOwnerDraft}
          roadmapPriority={roadmapPriority}
          roadmapStatus={roadmapStatus}
          roadmapDetailDraft={roadmapDetailDraft}
          roadmapSupportDraft={roadmapSupportDraft}
          roadmapRiskDraft={roadmapRiskDraft}
          roadmapNextActionDraft={roadmapNextActionDraft}
          canSaveRoadmapTask={canSaveRoadmapTask}
          onRoadmapTitleDraftChange={setRoadmapTitleDraft}
          onRoadmapOwnerDraftChange={setRoadmapOwnerDraft}
          onRoadmapPriorityChange={setRoadmapPriority}
          onRoadmapStatusChange={setRoadmapStatus}
          onRoadmapDetailDraftChange={setRoadmapDetailDraft}
          onRoadmapSupportDraftChange={setRoadmapSupportDraft}
          onRoadmapRiskDraftChange={setRoadmapRiskDraft}
          onRoadmapNextActionDraftChange={setRoadmapNextActionDraft}
          onSaveRoadmapTask={handleSaveRoadmapTask}
        />

        <SupportPilotIssueLogPanel
          supportIssueCount={venture.supportIssues.length}
          supportIssueCandidateCount={supportIssueCandidates.length}
          latestSupportIssue={latestSupportIssue}
          firstSupportIssueCandidate={firstSupportIssueCandidate}
          supportIssueType={supportIssueType}
          supportIssueSeverity={supportIssueSeverity}
          supportIssueStatus={supportIssueStatus}
          supportTitleDraft={supportTitleDraft}
          supportOwnerDraft={supportOwnerDraft}
          supportDetailDraft={supportDetailDraft}
          supportImpactDraft={supportImpactDraft}
          supportLoadDraft={supportLoadDraft}
          supportRetentionDraft={supportRetentionDraft}
          supportResolutionDraft={supportResolutionDraft}
          supportNextActionDraft={supportNextActionDraft}
          canSaveSupportIssue={canSaveSupportIssue}
          onSupportIssueTypeChange={setSupportIssueType}
          onSupportIssueSeverityChange={setSupportIssueSeverity}
          onSupportIssueStatusChange={setSupportIssueStatus}
          onSupportTitleDraftChange={setSupportTitleDraft}
          onSupportOwnerDraftChange={setSupportOwnerDraft}
          onSupportDetailDraftChange={setSupportDetailDraft}
          onSupportImpactDraftChange={setSupportImpactDraft}
          onSupportLoadDraftChange={setSupportLoadDraft}
          onSupportRetentionDraftChange={setSupportRetentionDraft}
          onSupportResolutionDraftChange={setSupportResolutionDraft}
          onSupportNextActionDraftChange={setSupportNextActionDraft}
          onSaveSupportIssue={handleSaveSupportIssue}
        />

        <ActivationRetentionCohortsPanel
          activationCohortCount={venture.activationCohorts.length}
          activationCohortCandidateCount={activationCohortCandidates.length}
          latestActivationCohort={latestActivationCohort}
          firstActivationCohortCandidate={firstActivationCohortCandidate}
          cohortLabelDraft={cohortLabelDraft}
          cohortOwnerDraft={cohortOwnerDraft}
          cohortChannelDraft={cohortChannelDraft}
          cohortSignupDraft={cohortSignupDraft}
          cohortActivatedDraft={cohortActivatedDraft}
          cohortRetainedDraft={cohortRetainedDraft}
          cohortPaidDraft={cohortPaidDraft}
          cohortRevenueDraft={cohortRevenueDraft}
          cohortSupportIssueDraft={cohortSupportIssueDraft}
          cohortActivationEventDraft={cohortActivationEventDraft}
          cohortRetentionWindowDraft={cohortRetentionWindowDraft}
          cohortEvidenceDraft={cohortEvidenceDraft}
          cohortLearningDraft={cohortLearningDraft}
          cohortNextActionDraft={cohortNextActionDraft}
          canSaveActivationCohort={canSaveActivationCohort}
          onCohortLabelDraftChange={setCohortLabelDraft}
          onCohortOwnerDraftChange={setCohortOwnerDraft}
          onCohortChannelDraftChange={setCohortChannelDraft}
          onCohortSignupDraftChange={setCohortSignupDraft}
          onCohortActivatedDraftChange={setCohortActivatedDraft}
          onCohortRetainedDraftChange={setCohortRetainedDraft}
          onCohortPaidDraftChange={setCohortPaidDraft}
          onCohortRevenueDraftChange={setCohortRevenueDraft}
          onCohortSupportIssueDraftChange={setCohortSupportIssueDraft}
          onCohortActivationEventDraftChange={setCohortActivationEventDraft}
          onCohortRetentionWindowDraftChange={setCohortRetentionWindowDraft}
          onCohortEvidenceDraftChange={setCohortEvidenceDraft}
          onCohortLearningDraftChange={setCohortLearningDraft}
          onCohortNextActionDraftChange={setCohortNextActionDraft}
          onSaveActivationCohort={handleSaveActivationCohort}
        />

        <ChannelEconomicsCacPanel
          channelEconomicsCount={venture.channelEconomics.length}
          channelEconomicsCandidateCount={channelEconomicsCandidates.length}
          latestChannelEconomics={latestChannelEconomics}
          firstChannelEconomicsCandidate={firstChannelEconomicsCandidate}
          channelDraft={channelDraft}
          channelOwnerDraft={channelOwnerDraft}
          channelSpendDraft={channelSpendDraft}
          channelImpressionsDraft={channelImpressionsDraft}
          channelClicksDraft={channelClicksDraft}
          channelSignupDraft={channelSignupDraft}
          channelActivatedDraft={channelActivatedDraft}
          channelPaidDraft={channelPaidDraft}
          channelRevenueDraft={channelRevenueDraft}
          channelEvidenceDraft={channelEvidenceDraft}
          channelNextActionDraft={channelNextActionDraft}
          canSaveChannelEconomics={canSaveChannelEconomics}
          onChannelDraftChange={setChannelDraft}
          onChannelOwnerDraftChange={setChannelOwnerDraft}
          onChannelSpendDraftChange={setChannelSpendDraft}
          onChannelImpressionsDraftChange={setChannelImpressionsDraft}
          onChannelClicksDraftChange={setChannelClicksDraft}
          onChannelSignupDraftChange={setChannelSignupDraft}
          onChannelActivatedDraftChange={setChannelActivatedDraft}
          onChannelPaidDraftChange={setChannelPaidDraft}
          onChannelRevenueDraftChange={setChannelRevenueDraft}
          onChannelEvidenceDraftChange={setChannelEvidenceDraft}
          onChannelNextActionDraftChange={setChannelNextActionDraft}
          onSaveChannelEconomics={handleSaveChannelEconomics}
        />

        <KillPressureRulesPanel killPressureReport={killPressureReport} />

        <KillDecisionArtifactPanel killDecisionArtifact={killDecisionArtifact} />

        <CompetitorWatchlistPanel
          competitorCount={venture.competitors.length}
          competitorCandidateCount={competitorCandidates.length}
          latestCompetitor={latestCompetitor}
          firstCompetitorCandidate={firstCompetitorCandidate}
          competitorNameDraft={competitorNameDraft}
          competitorOwnerDraft={competitorOwnerDraft}
          competitorPositioningDraft={competitorPositioningDraft}
          competitorEvidenceDraft={competitorEvidenceDraft}
          competitorDifferentiationDraft={competitorDifferentiationDraft}
          competitorResponseDraft={competitorResponseDraft}
          competitorCadenceDraft={competitorCadenceDraft}
          competitorNextActionDraft={competitorNextActionDraft}
          canSaveCompetitor={canSaveCompetitor}
          onCompetitorNameDraftChange={setCompetitorNameDraft}
          onCompetitorOwnerDraftChange={setCompetitorOwnerDraft}
          onCompetitorPositioningDraftChange={setCompetitorPositioningDraft}
          onCompetitorEvidenceDraftChange={setCompetitorEvidenceDraft}
          onCompetitorDifferentiationDraftChange={setCompetitorDifferentiationDraft}
          onCompetitorResponseDraftChange={setCompetitorResponseDraft}
          onCompetitorCadenceDraftChange={setCompetitorCadenceDraft}
          onCompetitorNextActionDraftChange={setCompetitorNextActionDraft}
          onSaveCompetitor={handleSaveCompetitor}
        />

        <AutonomyAuditLogPanel
          autonomyAuditCount={venture.autonomyAudit.length}
          autonomyAuditCandidateCount={autonomyAuditCandidates.length}
          readOnlyAutonomyCandidateCount={readOnlyAutonomyCandidateCount}
          localCodeAutonomyCandidateCount={localCodeAutonomyCandidateCount}
          localTestAutonomyCandidateCount={localTestAutonomyCandidateCount}
          latestAutonomyAudit={latestAutonomyAudit}
          firstAutonomyAuditCandidate={firstAutonomyAuditCandidate}
          auditActorDraft={auditActorDraft}
          auditRiskDraft={auditRiskDraft}
          auditReplayDraft={auditReplayDraft}
          auditEvidenceDraft={auditEvidenceDraft}
          auditNextActionDraft={auditNextActionDraft}
          canSaveAutonomyAudit={canSaveAutonomyAudit}
          onAuditActorDraftChange={setAuditActorDraft}
          onAuditRiskDraftChange={setAuditRiskDraft}
          onAuditReplayDraftChange={setAuditReplayDraft}
          onAuditEvidenceDraftChange={setAuditEvidenceDraft}
          onAuditNextActionDraftChange={setAuditNextActionDraft}
          onSaveAutonomyAudit={handleSaveAutonomyAudit}
        />

        <AgentRunReplayLogPanel
          agentRunCount={venture.agentRuns.length}
          agentRunCandidateCount={agentRunCandidates.length}
          latestAgentRun={latestAgentRun}
          firstAgentRunCandidate={firstAgentRunCandidate}
          agentModelDraft={agentModelDraft}
          agentOwnerDraft={agentOwnerDraft}
          agentPromptDraft={agentPromptDraft}
          agentOutputDraft={agentOutputDraft}
          agentEvidenceDraft={agentEvidenceDraft}
          agentToolsDraft={agentToolsDraft}
          agentReplayDraft={agentReplayDraft}
          agentRiskDraft={agentRiskDraft}
          agentNextActionDraft={agentNextActionDraft}
          canSaveAgentRun={canSaveAgentRun}
          onAgentModelDraftChange={setAgentModelDraft}
          onAgentOwnerDraftChange={setAgentOwnerDraft}
          onAgentPromptDraftChange={setAgentPromptDraft}
          onAgentOutputDraftChange={setAgentOutputDraft}
          onAgentEvidenceDraftChange={setAgentEvidenceDraft}
          onAgentToolsDraftChange={setAgentToolsDraft}
          onAgentReplayDraftChange={setAgentReplayDraft}
          onAgentRiskDraftChange={setAgentRiskDraft}
          onAgentNextActionDraftChange={setAgentNextActionDraft}
          onSaveAgentRun={handleSaveAgentRun}
        />

        <ExperimentLaunchPackPanel visible={Boolean(firstExperiment)} launchPack={launchPack} />

        <ExperimentResultEntryPanel
          experiment={firstExperiment}
          resultDraft={resultDraft}
          interpretationDraft={interpretationDraft}
          canSaveExperiment={canSaveExperiment}
          onResultDraftChange={setResultDraft}
          onInterpretationDraftChange={setInterpretationDraft}
          onSaveExperiment={handleSaveExperiment}
        />

        <ManualAtlasValidationResultPanel
          validationPack={firstAtlasValidationPack}
          latestValidationResult={latestAtlasValidationResult}
          atlasValidationOutcome={atlasValidationOutcome}
          atlasValidationBuyerDraft={atlasValidationBuyerDraft}
          atlasValidationPainDraft={atlasValidationPainDraft}
          atlasValidationWedgeDraft={atlasValidationWedgeDraft}
          atlasValidationPaidDraft={atlasValidationPaidDraft}
          atlasValidationQuoteDraft={atlasValidationQuoteDraft}
          atlasValidationObjectionDraft={atlasValidationObjectionDraft}
          atlasValidationEvidenceDraft={atlasValidationEvidenceDraft}
          atlasValidationLearningDraft={atlasValidationLearningDraft}
          atlasValidationOwnerDraft={atlasValidationOwnerDraft}
          atlasValidationNextActionDraft={atlasValidationNextActionDraft}
          canSaveAtlasValidationResult={canSaveAtlasValidationResult}
          onAtlasValidationOutcomeChange={setAtlasValidationOutcome}
          onAtlasValidationBuyerDraftChange={setAtlasValidationBuyerDraft}
          onAtlasValidationPainDraftChange={setAtlasValidationPainDraft}
          onAtlasValidationWedgeDraftChange={setAtlasValidationWedgeDraft}
          onAtlasValidationPaidDraftChange={setAtlasValidationPaidDraft}
          onAtlasValidationQuoteDraftChange={setAtlasValidationQuoteDraft}
          onAtlasValidationObjectionDraftChange={setAtlasValidationObjectionDraft}
          onAtlasValidationEvidenceDraftChange={setAtlasValidationEvidenceDraft}
          onAtlasValidationLearningDraftChange={setAtlasValidationLearningDraft}
          onAtlasValidationOwnerDraftChange={setAtlasValidationOwnerDraft}
          onAtlasValidationNextActionDraftChange={setAtlasValidationNextActionDraft}
          onSaveAtlasValidationResult={handleSaveAtlasValidationResult}
        />

        <LocalProductBuildRunProofPanel
          command={firstValidationBackedProductBuildCommand}
          latestProductBuildRun={latestProductBuildRun}
          productBuildRunState={productBuildRunState}
          productBuildRunOwnerDraft={productBuildRunOwnerDraft}
          productBuildRunProofDraft={productBuildRunProofDraft}
          productBuildArtifactProofDraft={productBuildArtifactProofDraft}
          productBuildVerifierProofDraft={productBuildVerifierProofDraft}
          productBuildRunLearningDraft={productBuildRunLearningDraft}
          canSaveProductBuildRun={canSaveProductBuildRun}
          onProductBuildRunStateChange={setProductBuildRunState}
          onProductBuildRunOwnerDraftChange={setProductBuildRunOwnerDraft}
          onProductBuildRunProofDraftChange={setProductBuildRunProofDraft}
          onProductBuildArtifactProofDraftChange={setProductBuildArtifactProofDraft}
          onProductBuildVerifierProofDraftChange={setProductBuildVerifierProofDraft}
          onProductBuildRunLearningDraftChange={setProductBuildRunLearningDraft}
          onSaveProductBuildRun={handleSaveProductBuildRun}
        />

        <KillContinueDecisionPanel
          decisionType={decisionType}
          nextLifecycleStatus={nextLifecycleStatus}
          rationaleDraft={rationaleDraft}
          nextActionDraft={nextActionDraft}
          canSaveDecision={canSaveDecision}
          latestDecision={latestDecision}
          onDecisionTypeChange={setDecisionType}
          onNextLifecycleStatusChange={setNextLifecycleStatus}
          onRationaleDraftChange={setRationaleDraft}
          onNextActionDraftChange={setNextActionDraft}
          onSaveDecision={handleSaveDecision}
        />

        <KillCriteriaDeploymentBoundaryPanel
          killReason={venture.killCriteria.killReasons[0]}
          deploymentBoundaryState={deploymentBoundaryState}
          deploymentProofCount={deploymentProofs.length}
          expectedDeploymentProofCount={expectedDeploymentProofCount}
          blockedDeploymentProofCount={blockedDeploymentProofCount}
          verifiedDeploymentProofCount={verifiedDeploymentProofCount}
          deploymentProposalGateStatus={deploymentProposalGate?.status ?? "missing"}
          humanDeploymentGateStatus={humanDeploymentGate?.status ?? "missing"}
          approvalBoundaryLevel={firstApproval?.level ?? "No approval gate recorded"}
        />

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <CalendarClock className="h-3.5 w-3.5" />
          Review cadence: {venture.reviewCadence}
        </div>
      </CardContent>
    </Card>
  );
}
