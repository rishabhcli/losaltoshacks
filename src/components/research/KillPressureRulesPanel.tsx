import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  VENTURE_DECISION_OPTIONS,
  type VentureDecisionType,
  type VentureKillPressureReport,
} from "@/lib/venture-portfolio";

function killPressureSeverityBadge(severity: VentureKillPressureReport["severity"]) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function decisionLabel(decision: VentureDecisionType) {
  return VENTURE_DECISION_OPTIONS.find((option) => option.value === decision)?.label ?? decision;
}

export function KillPressureRulesPanel({
  killPressureReport,
}: {
  killPressureReport: VentureKillPressureReport;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Kill pressure rules</h3>
        <Badge variant="secondary" className="bg-white/80 text-zinc-800 dark:bg-slate-950/70 dark:text-zinc-200">
          Recommended decision: {decisionLabel(killPressureReport.recommendation)}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-zinc-800 dark:bg-slate-950/70 dark:text-zinc-200">
          {killPressureReport.signals.length} signal{killPressureReport.signals.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{killPressureReport.note}</p>
      {killPressureReport.signals.slice(0, 4).map((signal) => (
        <div key={signal.id} className="mt-2 rounded-md border border-zinc-200 bg-white/75 p-2 dark:border-zinc-800 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{signal.title}</span>
            <Badge variant="secondary" className={killPressureSeverityBadge(signal.severity)}>
              {signal.severity}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-zinc-800 dark:bg-slate-950/70 dark:text-zinc-200">
              {decisionLabel(signal.recommendation)}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-zinc-800 dark:bg-slate-950/70 dark:text-zinc-200">
              {signal.dimension}
            </Badge>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{signal.reason}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {signal.nextAction}</p>
        </div>
      ))}
    </div>
  );
}
