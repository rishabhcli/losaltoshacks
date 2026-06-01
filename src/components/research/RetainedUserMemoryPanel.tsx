import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureRetainedUserMemory } from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(cents / 100);
}

export function RetainedUserMemoryPanel({ memories }: { memories: VentureRetainedUserMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Retained user memory" className="rounded-lg border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Activity className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
        <h2 className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">Retained user memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          {memories.length} cohort{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-cyan-200 bg-white/75 p-3 dark:border-cyan-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
                {memory.retentionScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                {memory.retentionRate}% retained
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                {formatMoney(memory.revenueCents)}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.cohortLabel}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-cyan-800 dark:text-cyan-200">{memory.reusableLesson}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {memory.retainedUserCount} retained · {memory.paidUserCount} paid · {memory.supportIssueCount} support
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
