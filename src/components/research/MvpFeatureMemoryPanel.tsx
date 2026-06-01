import { Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureMvpFeatureMemory } from "@/lib/venture-portfolio";

export function MvpFeatureMemoryPanel({ memories }: { memories: VentureMvpFeatureMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="MVP feature memory" className="rounded-lg border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900/70 dark:bg-violet-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Code2 className="h-4 w-4 text-violet-700 dark:text-violet-300" />
        <h2 className="text-sm font-semibold text-violet-950 dark:text-violet-100">MVP feature memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
          {memories.length} feature{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-violet-200 bg-white/75 p-3 dark:border-violet-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200">
                {memory.impactScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
                {memory.proofStatus}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
                {memory.qaStatus}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.feature}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-violet-800 dark:text-violet-200">{memory.reusableLesson}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {memory.requestedCount} requests · {memory.roadmapTaskCount} tasks · {memory.retainedUserCount} retained · {memory.paidUserCount} paid
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
