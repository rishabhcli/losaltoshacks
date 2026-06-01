import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureConvertedPricingMemory } from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function ConvertedPricingMemoryPanel({ memories }: { memories: VentureConvertedPricingMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Converted pricing memory" className="rounded-lg border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900/70 dark:bg-teal-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <DollarSign className="h-4 w-4 text-teal-700 dark:text-teal-300" />
        <h2 className="text-sm font-semibold text-teal-950 dark:text-teal-100">Converted pricing memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
          {memories.length} price{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-teal-200 bg-white/75 p-3 dark:border-teal-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
                {memory.conversionScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
                {memory.acceptedPrice}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
                {formatMoney(memory.revenueCents)}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.pricingHypothesis}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-teal-800 dark:text-teal-200">{memory.reusableLesson}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {memory.paidCommitmentCount} commitments · {memory.invoiceRequestCount} invoices · {memory.qualifiedBuyerCount} qualified buyers
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
