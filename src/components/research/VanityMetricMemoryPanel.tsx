import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureVanityMetricMemory } from "@/lib/venture-portfolio";

export function VanityMetricMemoryPanel({ memories }: { memories: VentureVanityMetricMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Vanity metric memory" className="rounded-lg border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/70 dark:bg-rose-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-rose-700 dark:text-rose-300" />
        <h2 className="text-sm font-semibold text-rose-950 dark:text-rose-100">Vanity metric memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
          {memories.length} trap{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-rose-200 bg-white/75 p-3 dark:border-rose-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                {memory.severity}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
                {memory.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.metricLabel}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-rose-800 dark:text-rose-200">{memory.metricValue}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memory.weakOutcome}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memory.neverTreatAs}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
