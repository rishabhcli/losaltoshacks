import { ClipboardCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry,
  DemandSourceBlockerPacketTriageWorkloadDriftReport,
  DemandSourceBlockerPacketTriageWorkloadDriftStatus,
  DemandSourceBlockerPacketTriageWorkloadPinnedSummary,
} from "@/lib/venture-portfolio";

export function WorkloadDriftPanel({
  driftFilter,
  workloadDriftReports,
  workloadDriftWarnings,
  unresolvedWorkloadDriftWarnings,
  visibleWorkloadDriftReports,
  workloadDriftReconciliation,
  workloadPinnedSummaries,
  latestReconciliationBySnapshot,
  pinnedSummaryByGroup,
  onDriftFilterChange,
  onMarkWorkloadDriftReviewed,
  onPinCurrentWorkload,
  onClearWorkloadDriftReview,
}: {
  driftFilter: "all" | "unresolved";
  workloadDriftReports: DemandSourceBlockerPacketTriageWorkloadDriftReport[];
  workloadDriftWarnings: DemandSourceBlockerPacketTriageWorkloadDriftReport[];
  unresolvedWorkloadDriftWarnings: DemandSourceBlockerPacketTriageWorkloadDriftReport[];
  visibleWorkloadDriftReports: DemandSourceBlockerPacketTriageWorkloadDriftReport[];
  workloadDriftReconciliation: DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry[];
  workloadPinnedSummaries: DemandSourceBlockerPacketTriageWorkloadPinnedSummary[];
  latestReconciliationBySnapshot: Map<string, DemandSourceBlockerPacketTriageWorkloadDriftReconciliationEntry>;
  pinnedSummaryByGroup: Map<string, DemandSourceBlockerPacketTriageWorkloadPinnedSummary>;
  onDriftFilterChange: (filter: "all" | "unresolved") => void;
  onMarkWorkloadDriftReviewed: (report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => void;
  onPinCurrentWorkload: (report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => void;
  onClearWorkloadDriftReview: (report: DemandSourceBlockerPacketTriageWorkloadDriftReport) => void;
}) {
  if (workloadDriftReports.length === 0) return null;

  const workloadDriftStatusLabels: Record<DemandSourceBlockerPacketTriageWorkloadDriftStatus, string> = {
    matching: "Matching",
    "count-mismatch": "Count mismatch",
    stale: "Stale",
    "missing-current": "Missing current",
    "new-current": "New current",
  };

  return (
    <div aria-label="Demand source blocker workload import drift" className="mt-3 rounded-md border border-amber-200 bg-white/80 p-2 dark:border-amber-900/70 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardCheck className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
        <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-100">Imported workload drift report</p>
        <Badge variant="secondary" className={unresolvedWorkloadDriftWarnings.length > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}>
          {unresolvedWorkloadDriftWarnings.length} unresolved drift {unresolvedWorkloadDriftWarnings.length === 1 ? "warning" : "warnings"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
          {workloadDriftWarnings.length} total drift {workloadDriftWarnings.length === 1 ? "warning" : "warnings"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          {workloadDriftReports.length} compared
        </Badge>
        {workloadDriftReconciliation.length > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {workloadDriftReconciliation.length} reconciliation {workloadDriftReconciliation.length === 1 ? "entry" : "entries"}
          </Badge>
        )}
        {workloadPinnedSummaries.length > 0 && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {workloadPinnedSummaries.length} pinned authoritative {workloadPinnedSummaries.length === 1 ? "summary" : "summaries"}
          </Badge>
        )}
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Imported workload summaries are read-only artifacts here; this report compares them to the current portfolio-derived owner workload before a lead trusts the carried queue.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Demand source blocker workload drift filters">
        <Button
          type="button"
          size="sm"
          variant={driftFilter === "unresolved" ? "default" : "outline"}
          className="h-7 px-2 text-[11px]"
          onClick={() => onDriftFilterChange("unresolved")}
        >
          Show unresolved workload drift
        </Button>
        <Button
          type="button"
          size="sm"
          variant={driftFilter === "all" ? "default" : "outline"}
          className="h-7 px-2 text-[11px]"
          onClick={() => onDriftFilterChange("all")}
        >
          Show all workload drift
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {visibleWorkloadDriftReports.slice(0, 4).map((report) => {
          const latestReconciliation = latestReconciliationBySnapshot.get(`${report.id}::${report.recordedAt}`);
          const pinnedSummary = pinnedSummaryByGroup.get(`${report.owner}::${report.sourceType}`);
          const isResolved = report.status !== "matching" && (
            latestReconciliation?.action === "reviewed" ||
            latestReconciliation?.action === "pinned-current" ||
            Boolean(pinnedSummary)
          );
          return (
            <div key={`${report.id}-${report.recordedAt}`} className="rounded-md border border-amber-100 bg-amber-50/60 p-2 dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className={report.status === "matching" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}>
                  {workloadDriftStatusLabels[report.status]}
                </Badge>
                <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
                  {report.owner}
                </Badge>
                <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                  {report.sourceType}
                </Badge>
                {isResolved && latestReconciliation && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {latestReconciliation.action === "pinned-current" ? "Pinned current" : "Reviewed"} by {latestReconciliation.reviewedBy}
                  </Badge>
                )}
                {pinnedSummary && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Pinned authoritative summary
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{report.summary}</p>
              {pinnedSummary && (
                <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200">
                  Pinned current summary: {pinnedSummary.summary.activeCount} active, {pinnedSummary.summary.delegatedCount} delegated, {pinnedSummary.summary.needsEvidenceCount} needs evidence, pinned by {pinnedSummary.pinnedBy} at {pinnedSummary.pinnedAt}.
                </p>
              )}
              {latestReconciliation && latestReconciliation.action !== "cleared" && (
                <p className="mt-1 text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
                  Reconciliation: {latestReconciliation.action} by {latestReconciliation.reviewedBy} at {latestReconciliation.recordedAt}.
                </p>
              )}
              <p className="mt-1 text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">Search anchor: {report.searchAnchor}</p>
              {report.status !== "matching" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px] text-amber-900 dark:text-amber-100"
                    onClick={() => onMarkWorkloadDriftReviewed(report)}
                  >
                    Mark drift reviewed
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px] text-emerald-900 dark:text-emerald-100"
                    onClick={() => onPinCurrentWorkload(report)}
                  >
                    Pin current as authoritative
                  </Button>
                  {latestReconciliation && latestReconciliation.action !== "cleared" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-[11px] text-slate-700 dark:text-slate-200"
                      onClick={() => onClearWorkloadDriftReview(report)}
                    >
                      Clear drift review
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {visibleWorkloadDriftReports.length === 0 && (
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            No workload drift reports match the current drift filter.
          </p>
        )}
      </div>
      {workloadDriftReconciliation.length > 0 && (
        <div aria-label="Demand source blocker workload import drift reconciliation history" className="mt-2 rounded-md border border-blue-100 bg-blue-50/60 p-2 dark:border-blue-900/60 dark:bg-blue-950/20">
          <p className="text-[11px] font-semibold text-blue-900 dark:text-blue-100">Workload drift reconciliation history</p>
          <div className="mt-1 space-y-1">
            {workloadDriftReconciliation.slice(0, 4).map((entry) => (
              <p key={entry.id} className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
                {entry.action} {entry.owner} / {entry.sourceType} by {entry.reviewedBy} at {entry.recordedAt}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
