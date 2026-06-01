import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureAtlasValidationResultLedgerItem, type VentureAtlasValidationResultOutcome } from "@/lib/venture-portfolio";

function atlasValidationResultOutcomeBadge(outcome: VentureAtlasValidationResultOutcome) {
  if (outcome === "passed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (outcome === "failed") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (outcome === "pivot") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function AtlasValidationResultLedgerPanel({ items }: { items: VentureAtlasValidationResultLedgerItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Atlas validation result ledger"
      className="rounded-lg border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900/70 dark:bg-violet-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-violet-700 dark:text-violet-300" />
        <h2 className="text-sm font-semibold text-violet-950 dark:text-violet-100">Atlas validation result ledger</h2>
        <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
          {items.length} result{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
          Manual demand proof
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
          Updates demand drift
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Saved validation results convert approval-gated atlas packs into operator-entered demand evidence. They preserve buyer counts, paid-pricing signals, quotes, objections, learning, and no-external-side-effect proof so the demand-drift report can move from planned validation to recorded reality.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-violet-200 bg-white/75 p-3 dark:border-violet-900/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={atlasValidationResultOutcomeBadge(item.outcome)}>
                {item.outcome}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Drift {item.demandDriftScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
                {item.qualifiedBuyerCount} buyers
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
                {item.paidPricingSignalCount} paid signals
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.atlasItemTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-violet-800 dark:text-violet-200">
              Manual result: {item.statusSummary}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              Quote: {item.strongestQuote}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Learning: {item.learning}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Demand drift update: {item.demandDriftUpdate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
