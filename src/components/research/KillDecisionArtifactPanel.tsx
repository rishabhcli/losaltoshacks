import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  VENTURE_DECISION_OPTIONS,
  type VentureDecisionType,
  type VentureKillDecisionArtifact,
} from "@/lib/venture-portfolio";

function killDecisionSeverityBadge(severity: VentureKillDecisionArtifact["severity"]) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function decisionLabel(decision: VentureDecisionType) {
  return VENTURE_DECISION_OPTIONS.find((option) => option.value === decision)?.label ?? decision;
}

export function KillDecisionArtifactPanel({
  killDecisionArtifact,
}: {
  killDecisionArtifact: VentureKillDecisionArtifact;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Kill decision artifact</h3>
        <Badge variant="secondary" className="bg-white/80 text-zinc-800 dark:bg-slate-950/70 dark:text-zinc-200">
          {decisionLabel(killDecisionArtifact.recommendation)}
        </Badge>
        <Badge variant="secondary" className={killDecisionSeverityBadge(killDecisionArtifact.severity)}>
          {killDecisionArtifact.severity}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-zinc-800 dark:bg-slate-950/70 dark:text-zinc-200">
          Confidence {killDecisionArtifact.confidenceScore}/100
        </Badge>
      </div>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{killDecisionArtifact.primaryReason}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Latest: {killDecisionArtifact.latestRecordedDecision}</p>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white/75 p-2 dark:border-zinc-800 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Evidence for stopping</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {killDecisionArtifact.evidenceForStopping.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white/75 p-2 dark:border-zinc-800 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Evidence for continuing</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {killDecisionArtifact.evidenceForContinuing.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white/75 p-2 dark:border-zinc-800 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Stop and pivot rules</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {[...killDecisionArtifact.stopRules, ...killDecisionArtifact.pivotTriggers].slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white/75 p-2 dark:border-zinc-800 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Next actions</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {killDecisionArtifact.nextActions.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <Textarea
        aria-label="Kill decision markdown"
        readOnly
        value={killDecisionArtifact.markdown}
        className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
      />
    </div>
  );
}
