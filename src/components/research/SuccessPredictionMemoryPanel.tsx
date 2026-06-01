import { Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureSuccessPredictionMemory } from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(cents / 100);
}

export function SuccessPredictionMemoryPanel({ memories }: { memories: VentureSuccessPredictionMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Success prediction memory" className="rounded-lg border border-lime-200 bg-lime-50/70 p-4 dark:border-lime-900/70 dark:bg-lime-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Radar className="h-4 w-4 text-lime-700 dark:text-lime-300" />
        <h2 className="text-sm font-semibold text-lime-950 dark:text-lime-100">Success prediction memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
          {memories.length} forecast{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-lime-200 bg-white/75 p-3 dark:border-lime-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-lime-100 text-lime-800 dark:bg-lime-950/40 dark:text-lime-200">
                {memory.signalScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
                {memory.predictionAlignment}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
                {formatMoney(memory.revenueCents)}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.type}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-lime-800 dark:text-lime-200">{memory.strongestOutcome}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {memory.conversionProbability}% conversion forecast · {memory.retainedUserCount} retained · {memory.paidCommitmentCount} paid commitments
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
