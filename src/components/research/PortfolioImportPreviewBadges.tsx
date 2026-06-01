import { Badge } from "@/components/ui/badge";

type ImportPreview = {
  ventureCount: number;
  savedViewCount: number;
  packetTriageCount: number;
  packetTriageAuditCount: number;
  packetWorkloadSummaryCount: number;
  packetWorkloadDriftReconciliationCount: number;
  packetWorkloadPinnedSummaryCount: number;
  packetHandoffHealthCount: number;
  packetHandoffRemediationQueueCount: number;
  packetHandoffRemediationPlansCount: number;
  packetHandoffRemediationClosureCount: number;
  packetHandoffReopenEscalationCount: number;
  packetHandoffReopenEscalationSlaReceiptCount: number;
  packetHandoffReopenEscalationSlaResolutionCount: number;
  packetHandoffReopenEscalationSlaBreachTrendCount: number;
  packetHandoffReopenEscalationSlaBreachProcessPlanCount: number;
  packetHandoffReopenEscalationSlaBreachProcessClosureCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionClosureCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignmentCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosureCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviewCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppealCount: number;
  packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigestCount: number;
  collisionCount: number;
  pruneSnapshotCount: number;
  modeLabel: string;
  modeAction: string;
  warnings: string[];
  savedViewSummary: null | {
    added: number;
    renamed: number;
    replaced: number;
    skipped: number;
  };
};

function plural(count: number, singular: string, pluralLabel = `${singular}s`) {
  return count === 1 ? singular : pluralLabel;
}

export function PortfolioImportPreviewBadges({ preview }: { preview: ImportPreview }) {
  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className={preview.ventureCount > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"}>
          {preview.ventureCount} {plural(preview.ventureCount, "venture")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-blue-700 dark:bg-slate-950 dark:text-blue-200">
          {preview.savedViewCount} saved {plural(preview.savedViewCount, "view")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-orange-700 dark:bg-slate-950 dark:text-orange-200">
          {preview.packetTriageCount} packet triage {plural(preview.packetTriageCount, "state")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-violet-700 dark:bg-slate-950 dark:text-violet-200">
          {preview.packetTriageAuditCount} triage audit {plural(preview.packetTriageAuditCount, "entry", "entries")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-sky-700 dark:bg-slate-950 dark:text-sky-200">
          {preview.packetWorkloadSummaryCount} workload {plural(preview.packetWorkloadSummaryCount, "summary", "summaries")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-amber-700 dark:bg-slate-950 dark:text-amber-200">
          {preview.packetWorkloadDriftReconciliationCount} drift reconciliation {plural(preview.packetWorkloadDriftReconciliationCount, "entry", "entries")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-emerald-700 dark:bg-slate-950 dark:text-emerald-200">
          {preview.packetWorkloadPinnedSummaryCount} pinned workload {plural(preview.packetWorkloadPinnedSummaryCount, "summary", "summaries")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-cyan-700 dark:bg-slate-950 dark:text-cyan-200">
          {preview.packetHandoffHealthCount} handoff health {plural(preview.packetHandoffHealthCount, "group")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-rose-700 dark:bg-slate-950 dark:text-rose-200">
          {preview.packetHandoffRemediationQueueCount} handoff remediation {plural(preview.packetHandoffRemediationQueueCount, "item")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-rose-700 dark:bg-slate-950 dark:text-rose-200">
          {preview.packetHandoffRemediationPlansCount} handoff remediation {plural(preview.packetHandoffRemediationPlansCount, "plan")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-cyan-700 dark:bg-slate-950 dark:text-cyan-200">
          {preview.packetHandoffRemediationClosureCount} handoff remediation closure {plural(preview.packetHandoffRemediationClosureCount, "receipt")}
        </Badge>
        <Badge variant="secondary" className="bg-white text-orange-700 dark:bg-slate-950 dark:text-orange-200">
          {preview.packetHandoffReopenEscalationCount} handoff reopen escalation{preview.packetHandoffReopenEscalationCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-orange-700 dark:bg-slate-950 dark:text-orange-200">
          {preview.packetHandoffReopenEscalationSlaReceiptCount} reopen SLA receipt{preview.packetHandoffReopenEscalationSlaReceiptCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-orange-700 dark:bg-slate-950 dark:text-orange-200">
          {preview.packetHandoffReopenEscalationSlaResolutionCount} reopen SLA resolution{preview.packetHandoffReopenEscalationSlaResolutionCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {preview.packetHandoffReopenEscalationSlaBreachTrendCount} reopen SLA breach trend{preview.packetHandoffReopenEscalationSlaBreachTrendCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-red-700 dark:bg-slate-950 dark:text-red-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessPlanCount} reopen SLA breach process plan{preview.packetHandoffReopenEscalationSlaBreachProcessPlanCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-red-700 dark:bg-slate-950 dark:text-red-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessClosureCount} reopen SLA breach process closure{preview.packetHandoffReopenEscalationSlaBreachProcessClosureCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionCount} reopen SLA breach process regression{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-red-700 dark:bg-slate-950 dark:text-red-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionClosureCount} reopen SLA breach process regression closure{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionClosureCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationCount} reopen SLA breach process regression escalation{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-blue-700 dark:bg-slate-950 dark:text-blue-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignmentCount} reopen SLA breach process regression escalation audit assignment{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignmentCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-emerald-700 dark:bg-slate-950 dark:text-emerald-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosureCount} reopen SLA breach process regression escalation audit closure{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosureCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-violet-700 dark:bg-slate-950 dark:text-violet-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviewCount} reopen SLA breach process regression escalation audit review{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviewCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-orange-700 dark:bg-slate-950 dark:text-orange-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppealCount} reopen SLA breach process regression escalation audit appeal{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppealCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white text-teal-700 dark:bg-slate-950 dark:text-teal-200">
          {preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigestCount} compact governance digest{preview.packetHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigestCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className={preview.collisionCount > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200"}>
          {preview.collisionCount} {plural(preview.collisionCount, "collision")}
        </Badge>
        {preview.pruneSnapshotCount > 0 && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {preview.pruneSnapshotCount} pruned audit {plural(preview.pruneSnapshotCount, "entry", "entries")}
          </Badge>
        )}
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          Mode: {preview.modeLabel}
        </Badge>
      </div>
      {preview.savedViewSummary ? (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {preview.savedViewSummary.added} will add
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {preview.savedViewSummary.renamed} will rename
          </Badge>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {preview.savedViewSummary.replaced} will replace
          </Badge>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
            {preview.savedViewSummary.skipped} will skip
          </Badge>
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
          No deployment escalation saved-view payload found.
        </p>
      )}
      {preview.warnings.length > 0 && (
        <div aria-label="Portfolio import preview warnings" className="mt-1.5 space-y-1">
          {preview.warnings.map((warning) => (
            <p key={warning} className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
              {warning}
            </p>
          ))}
        </div>
      )}
      <p className="mt-1.5 text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
        {preview.modeAction}
      </p>
    </>
  );
}
