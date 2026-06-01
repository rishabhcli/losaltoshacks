import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureDemandDriftStatus, type VentureFakeMarketMemory } from "@/lib/venture-portfolio";

function demandDriftBadge(status: VentureDemandDriftStatus) {
  if (status === "confirmed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "overestimated") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "underestimated") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "mixed") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function FakeMarketMemoryPanel({ memories }: { memories: VentureFakeMarketMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Fake market memory" className="rounded-lg border border-red-200 bg-red-50/70 p-4 dark:border-red-900/70 dark:bg-red-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-red-700 dark:text-red-300" />
        <h2 className="text-sm font-semibold text-red-950 dark:text-red-100">Fake market memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
          {memories.length} market{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-red-200 bg-white/80 p-3 dark:border-red-900/70 dark:bg-slate-950/70">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-200">
                {memory.fakeScore}/100
              </Badge>
              <Badge variant="secondary" className={demandDriftBadge(memory.demandDriftStatus)}>
                {memory.demandDriftStatus}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
                actual {memory.actualDemandScore}/100
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.marketLabel}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">{memory.whyFake}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memory.neverRepeat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
