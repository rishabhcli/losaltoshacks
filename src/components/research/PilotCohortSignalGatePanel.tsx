import { Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  VenturePilotCohortSignalGate,
  VenturePilotCohortSignalGateStatus,
} from "@/lib/venture-portfolio";

function pilotCohortSignalGateStatusBadge(status: VenturePilotCohortSignalGateStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-release-workspace") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "needs-inbound-signal") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

export function PilotCohortSignalGatePanel({ gates }: { gates: VenturePilotCohortSignalGate[] }) {
  if (gates.length === 0) return null;
  const readyCount = gates.filter((g) => g.status === "ready").length;
  const needsReleaseCount = gates.filter((g) => g.status === "needs-release-workspace").length;
  const needsSignalCount = gates.filter((g) => g.status === "needs-inbound-signal").length;

  return (
    <div
      aria-label="Pilot cohort signal gates"
      className="rounded-lg border border-teal-200 bg-teal-50/80 p-4 dark:border-teal-900/70 dark:bg-teal-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Send className="h-4 w-4 text-teal-700 dark:text-teal-300" />
        <h2 className="text-sm font-semibold text-teal-950 dark:text-teal-100">Pilot cohort signal gates</h2>
        <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
          {gates.length} gate{gates.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/70 text-teal-700 dark:bg-slate-950/60 dark:text-teal-300">
          No-send pilot cohort
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-teal-600 dark:bg-slate-950/50 dark:text-teal-400">
          No contact no deploy
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-teal-900/80 dark:text-teal-100/80">
        Pilot cohort signal gates turn an executable MVP release workspace into an operator-owned inbound signal capture step. All capture is local-only: no deploy, no send, no external contact, no billing change.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {readyCount > 0 && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {readyCount} ready
          </Badge>
        )}
        {needsReleaseCount > 0 && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {needsReleaseCount} needs-release-workspace
          </Badge>
        )}
        {needsSignalCount > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {needsSignalCount} needs-inbound-signal
          </Badge>
        )}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {gates.slice(0, 6).map((gate) => (
          <div key={gate.id} className="rounded-md border border-teal-200 bg-white/80 p-3 dark:border-teal-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={pilotCohortSignalGateStatusBadge(gate.status)}>
                {gate.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
                {gate.priority}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{gate.ventureTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Owner: {gate.owner}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-teal-800 dark:text-teal-200">Release workspace: {gate.releaseWorkspaceStatus}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Cohort: {gate.cohortLabel}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Local capture: {gate.localCaptureCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Activation draft: {gate.activationCohortDraft.signupTarget}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Demand proof draft: {gate.demandCaptureProofDraft}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">No-send boundary: {gate.noSendBoundary}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">Next action: {gate.nextAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
