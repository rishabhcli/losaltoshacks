import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  VenturePortfolioDecisionCommand,
  VenturePortfolioDecisionCommandStatus,
} from "@/lib/venture-portfolio";

function portfolioDecisionCommandStatusBadge(status: VenturePortfolioDecisionCommandStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "human-review") return "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

export function PortfolioDecisionCommandQueuePanel({ commands }: { commands: VenturePortfolioDecisionCommand[] }) {
  if (commands.length === 0) return null;

  return (
    <div
      aria-label="Portfolio decision command queue"
      className="rounded-lg border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900/70 dark:bg-violet-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <GitBranch className="h-4 w-4 text-violet-700 dark:text-violet-300" />
        <h2 className="text-sm font-semibold text-violet-950 dark:text-violet-100">Portfolio decision command queue</h2>
        <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
          {commands.length} command{commands.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
          Human review boundary
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Commands synthesize demand proof, revenue posture, launch readiness, product proof, support load, scale state, and kill pressure into reviewable portfolio decisions.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {commands.slice(0, 8).map((command) => (
          <div key={command.id} className="rounded-md border border-violet-200 bg-white/80 p-3 dark:border-violet-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={portfolioDecisionCommandStatusBadge(command.status)}>
                {command.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
                {command.recommendedDecision}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {command.confidenceScore}/100
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{command.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Decision command: {command.decisionCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Confidence note: {command.confidenceNote}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next command: {command.nextCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">Contradiction proof: {command.contradictionProof}</p>
            <div
              aria-label={`Demand source provenance for ${command.title}`}
              className="mt-2 border-t border-violet-200 pt-2 dark:border-violet-900/70"
            >
              <p className="text-[11px] font-semibold text-violet-900 dark:text-violet-100">Demand source provenance</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">Summary: {command.demandSourceProvenanceSummary}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">Decision note: {command.demandSourceDecisionNote}</p>
              {command.demandSourceEvidence.length > 0 && (
                <ul className="mt-1 list-disc pl-4 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                  {command.demandSourceEvidence.slice(0, 3).map((line, index) => (
                    <li key={`${command.id}-demand-source-${index}`}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
            <div
              aria-label={`Demand source blocker provenance for ${command.title}`}
              className="mt-2 rounded border border-amber-200 bg-amber-50/70 p-2 dark:border-amber-900/60 dark:bg-amber-950/30"
            >
              <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-100">Demand source blocker provenance</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">Summary: {command.demandSourceBlockerSummary}</p>
              {command.demandSourceBlockerEvidence.length > 0 && (
                <ul className="mt-1 list-disc pl-4 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                  {command.demandSourceBlockerEvidence.slice(0, 3).map((line, index) => (
                    <li key={`${command.id}-demand-blocker-${index}`}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
            <div
              aria-label={`No-send email gate reply demand for ${command.title}`}
              className="mt-2 rounded border border-violet-200 bg-violet-50/60 p-2 dark:border-violet-900/60 dark:bg-violet-950/30"
            >
              <p className="text-[11px] font-semibold text-violet-900 dark:text-violet-100">No-send email gate reply demand</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">Summary: {command.noSendReplyDemandSummary}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">Influence: {command.noSendReplyDecisionNote}</p>
              {command.noSendReplyDemandEvidence.length > 0 && (
                <ul className="mt-1 list-disc pl-4 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                  {command.noSendReplyDemandEvidence.slice(0, 3).map((line, index) => (
                    <li key={`${command.id}-no-send-reply-${index}`}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">Boundary: {command.humanReviewBoundary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
