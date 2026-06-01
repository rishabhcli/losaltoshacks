import { Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureRevivalTrigger } from "@/lib/venture-portfolio";

function revivalTriggerSourceLabel(sourceType: VentureRevivalTrigger["sourceType"]) {
  if (sourceType === "passed-experiment") return "Passed test";
  if (sourceType === "validated-pricing") return "Pricing";
  if (sourceType === "resolved-risk") return "Resolved risk";
  return "Fresh source";
}

function revivalConfidenceBadge(confidence: VentureRevivalTrigger["confidence"]) {
  if (confidence === "revival-review") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  return "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
}

export function RevivalTriggersPanel({ triggers }: { triggers: VentureRevivalTrigger[] }) {
  if (triggers.length === 0) return null;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/70 dark:bg-emerald-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Radar className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Revival triggers</h3>
        <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
          {triggers.length} signal{triggers.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {triggers.slice(0, 6).map((trigger) => (
          <div key={trigger.id} className="rounded-md border border-emerald-200 bg-white/80 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={revivalConfidenceBadge(trigger.confidence)}>
                {trigger.confidence}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {revivalTriggerSourceLabel(trigger.sourceType)}
              </Badge>
              {trigger.matched && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  matched
                </Badge>
              )}
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{trigger.title}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Original failure: {trigger.originalFailure}</p>
            <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{trigger.changedAssumption}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Fresh evidence: {trigger.freshEvidence}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Revival condition: {trigger.revivalCondition}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {trigger.nextAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
