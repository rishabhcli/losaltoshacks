import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    hmr: {
      overlay: false,
    },
  },
  css: {
    modules: {
      generateScopedName: "[name]_[local]_[hash:base64:5]",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/src/components/research/PortfolioImportPreviewBadges.tsx")) return "portfolio-import-preview-badges";
          if (id.includes("/src/components/research/RegressionEscalationAuditPanel.tsx")) return "regression-escalation-audit-panel";
          if (id.includes("/src/components/research/LaunchControlQueuePanel.tsx")) return "launch-control-queue-panel";
          if (id.includes("/src/components/research/PortfolioDecisionCommandQueuePanel.tsx")) return "portfolio-decision-command-queue-panel";
          if (id.includes("/src/components/research/ScaleStrongBranchPlanPanel.tsx")) return "scale-strong-branch-plan-panel";
          if (id.includes("/src/components/research/DemandCaptureProofQueuePanel.tsx")) return "demand-capture-proof-queue-panel";
          if (id.includes("/src/components/research/ProductBuildCommandRunLedgerPanel.tsx")) return "product-build-command-run-ledger-panel";
          if (id.includes("/src/components/research/LearningReinvestmentQueuePanel.tsx")) return "learning-reinvestment-queue-panel";
          if (id.includes("/src/components/research/PortfolioChartPanel.tsx")) return "portfolio-chart-panel";
          if (id.includes("/src/components/research/DemandSourceBlockerDrilldownPanel.tsx")) return "demand-source-blocker-drilldown-panel";
          if (id.includes("/src/components/research/BreachProcessPlanCard.tsx")) return "breach-process-plan-card";
          if (id.includes("/src/components/research/BreachProcessRegressionClosureHistoryPanel.tsx")) return "breach-process-regression-closure-history-panel";
          if (id.includes("/src/components/research/WorkloadDriftPanel.tsx")) return "workload-drift-panel";
          if (id.includes("/src/components/research/OwnerWorkloadSummaryPanel.tsx")) return "owner-workload-summary-panel";
          if (id.includes("/src/components/research/OwnerTriageQueuePanel.tsx")) return "owner-triage-queue-panel";
          if (id.includes("/src/components/research/DemandSourceBlockerPacketTriageQueuePanel.tsx")) return "demand-source-blocker-packet-triage-queue-panel";
          if (id.includes("/src/components/research/FailedOutreachMemoryPanel.tsx")) return "failed-outreach-memory-panel";
          if (id.includes("/src/components/research/NoSendEmailGateWorklistPanel.tsx")) return "no-send-email-gate-worklist-panel";
          if (id.includes("/src/components/research/MvpReleaseWorkspacePanel.tsx")) return "mvp-release-workspace-panel";
          if (id.includes("/src/components/research/PilotCohortSignalGatePanel.tsx")) return "pilot-cohort-signal-gate-panel";
          if (id.includes("/src/components/research/QaReleaseReportPanel.tsx")) return "qa-release-report-panel";
          if (id.includes("/src/components/research/DeploymentReadinessPacketPanel.tsx")) return "deployment-readiness-packet-panel";
          if (id.includes("/src/components/research/ArtifactChangelogLedgerPanel.tsx")) return "artifact-changelog-ledger-panel";
          if (id.includes("/src/components/research/RevenueCostLedgerPanel.tsx")) return "revenue-cost-ledger-panel";
          if (id.includes("/src/components/research/RoadmapSupportQueuePanel.tsx")) return "roadmap-support-queue-panel";
          if (id.includes("/src/components/research/SupportPilotIssueLogPanel.tsx")) return "support-pilot-issue-log-panel";
          if (id.includes("/src/components/research/ActivationRetentionCohortsPanel.tsx")) return "activation-retention-cohorts-panel";
          if (id.includes("/src/components/research/ChannelEconomicsCacPanel.tsx")) return "channel-economics-cac-panel";
          if (id.includes("/src/components/research/KillPressureRulesPanel.tsx")) return "kill-pressure-rules-panel";
          if (id.includes("/src/components/research/KillDecisionArtifactPanel.tsx")) return "kill-decision-artifact-panel";
          if (id.includes("/src/components/research/CompetitorWatchlistPanel.tsx")) return "competitor-watchlist-panel";
          if (id.includes("/src/components/research/ConvertedPainMemoryPanel.tsx")) return "converted-pain-memory-panel";
          if (id.includes("/src/components/research/ConvertedPricingMemoryPanel.tsx")) return "converted-pricing-memory-panel";
          if (id.includes("/src/components/research/MvpFeatureMemoryPanel.tsx")) return "mvp-feature-memory-panel";
          if (id.includes("/src/components/research/RetainedUserMemoryPanel.tsx")) return "retained-user-memory-panel";
          if (id.includes("/src/components/research/SuccessPredictionMemoryPanel.tsx")) return "success-prediction-memory-panel";
          if (id.includes("/src/components/research/VanityMetricMemoryPanel.tsx")) return "vanity-metric-memory-panel";
          if (id.includes("/src/components/research/GeneratedCodePatternMemoryPanel.tsx")) return "generated-code-pattern-memory-panel";
          if (id.includes("/src/components/research/EmpiricalCalibrationMemoryPanel.tsx")) return "empirical-calibration-memory-panel";
          if (id.includes("/src/components/research/FakeMarketMemoryPanel.tsx")) return "fake-market-memory-panel";
          if (id.includes("/src/components/research/WrongClaimMemoryPanel.tsx")) return "wrong-claim-memory-panel";
          if (id.includes("/src/components/research/WorkedChannelMemoryPanel.tsx")) return "worked-channel-memory-panel";
          if (id.includes("/src/components/research/FailureLessonsPanel.tsx")) return "failure-lessons-panel";
          if (id.includes("/src/components/research/WeakBranchKillMemoryPanel.tsx")) return "weak-branch-kill-memory-panel";
          if (id.includes("/src/components/research/RevivalTriggersPanel.tsx")) return "revival-triggers-panel";
          if (id.includes("/src/components/research/AutonomyAuditLogPanel.tsx")) return "autonomy-audit-log-panel";
          if (id.includes("/src/components/research/AgentRunReplayLogPanel.tsx")) return "agent-run-replay-log-panel";
          if (id.includes("/src/components/research/ExperimentLaunchPackPanel.tsx")) return "experiment-launch-pack-panel";
          if (id.includes("/src/components/research/ExperimentResultEntryPanel.tsx")) return "experiment-result-entry-panel";
          if (id.includes("/src/components/research/ManualAtlasValidationResultPanel.tsx")) return "manual-atlas-validation-result-panel";
          if (id.includes("/src/components/research/LocalProductBuildRunProofPanel.tsx")) return "local-product-build-run-proof-panel";
          if (id.includes("/src/components/research/KillContinueDecisionPanel.tsx")) return "kill-continue-decision-panel";
          if (id.includes("/src/components/research/KillCriteriaDeploymentBoundaryPanel.tsx")) return "kill-criteria-deployment-boundary-panel";
          if (id.includes("/src/components/research/SpawnedVentureDraftPanel.tsx")) return "spawned-venture-draft-panel";
          if (id.includes("/src/components/research/RelatedIdeaMergeAuditPanel.tsx")) return "related-idea-merge-audit-panel";
          if (id.includes("/src/components/research/OpportunityDiscoveryBacklogPanel.tsx")) return "opportunity-discovery-backlog-panel";
          if (id.includes("/src/components/research/OverlookedOpportunityAtlasPanel.tsx")) return "overlooked-opportunity-atlas-panel";
          if (id.includes("/src/components/research/AtlasValidationCommandPackPanel.tsx")) return "atlas-validation-command-pack-panel";
          if (id.includes("/src/components/research/AtlasValidationResultLedgerPanel.tsx")) return "atlas-validation-result-ledger-panel";
          if (id.includes("/src/lib/breach-process-regression-escalations.ts")) return "breach-process-regression-escalations";
          if (id.includes("/src/lib/venture-workspace.ts")) return "venture-workspace";
          if (id.includes("/src/lib/venture-portfolio.ts")) return "venture-portfolio";
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          if (/node_modules\/(react|react-dom|react-router-dom|scheduler)\//.test(id)) return "vendor-react";
          if (id.includes("@tanstack/react-query")) return "vendor-react";
          return undefined;
        },
      },
    },
  },
}));
