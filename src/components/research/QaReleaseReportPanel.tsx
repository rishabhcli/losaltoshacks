import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { VentureQaReleaseReport, VentureQaReleaseStatus } from "@/lib/venture-portfolio";

function qaReleaseStatusBadge(status: VentureQaReleaseStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-fixes") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

export function QaReleaseReportPanel({ qaReport }: { qaReport: VentureQaReleaseReport }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3 dark:border-rose-900/70 dark:bg-rose-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <PackageCheck className="h-4 w-4 text-rose-700 dark:text-rose-300" />
        <h3 className="text-xs font-semibold text-rose-900 dark:text-rose-100">QA release report</h3>
        <Badge variant="secondary" className={qaReleaseStatusBadge(qaReport.status)}>
          {qaReport.status}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
          Readiness {qaReport.releaseReadinessScore}/100
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
          Checks {qaReport.passedCheckCount}/{qaReport.totalCheckCount}
        </Badge>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Blockers</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {(qaReport.blockers.length > 0 ? qaReport.blockers : ["No release blocker detected."]).slice(0, 4).map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Warnings</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {(qaReport.warnings.length > 0 ? qaReport.warnings : ["No release warning detected."]).slice(0, 4).map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
        <div className="rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Artifacts</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{qaReport.artifactSummary}</p>
        </div>
        <div className="rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Support</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{qaReport.supportRiskSummary}</p>
        </div>
        <div className="rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Deployment</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{qaReport.deploymentBoundary}</p>
        </div>
        <div className="rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Launch risk</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{qaReport.launchRiskSummary}</p>
        </div>
      </div>
      <Textarea
        aria-label="QA release report markdown"
        readOnly
        value={qaReport.markdown}
        className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
      />
    </div>
  );
}
