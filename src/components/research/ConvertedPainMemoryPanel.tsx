import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureConvertedPainMemory } from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function ConvertedPainMemoryPanel({ memories }: { memories: VentureConvertedPainMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Converted pain memory" className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <DollarSign className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        <h2 className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">Converted pain memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
          {memories.length} reusable
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-emerald-200 bg-white/75 p-3 dark:border-emerald-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                {memory.conversionScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
                {formatMoney(memory.revenueCents)}
              </Badge>
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.targetBuyer}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{memory.painStatement}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200">{memory.strongestSignal}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memory.reusableLesson}</p>
            {memory.channels.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {memory.channels.slice(0, 3).map((channel) => (
                  <Badge key={channel} variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {channel}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
