import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { VentureLearningReinvestmentQueueItem, VentureLearningReinvestmentStatus } from "@/lib/venture-portfolio";

function learningReinvestmentStatusBadge(status: VentureLearningReinvestmentStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-owner") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
}

export function LearningReinvestmentQueuePanel({ items }: { items: VentureLearningReinvestmentQueueItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Learning reinvestment queue"
      className="rounded-lg border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <RefreshCw className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
        <h2 className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">Learning reinvestment queue</h2>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          {items.length} task{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-cyan-700 dark:bg-slate-950/60 dark:text-cyan-300">
          Old learning changes the next branch
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Queue items convert kill memory, branch-draft artifacts, merge audits, and scale plans into a concrete next experiment with proof required before reuse, merge, save, or scale.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-cyan-200 bg-white/75 p-3 dark:border-cyan-900/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={learningReinvestmentStatusBadge(item.status)}>
                {item.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                {item.priority}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {item.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-cyan-800 dark:text-cyan-200">{item.learning}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Next experiment: {item.nextExperiment}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
              Proof: {item.proofRequired}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Change: {item.changedBranchInstruction}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Owner: {item.owner}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
