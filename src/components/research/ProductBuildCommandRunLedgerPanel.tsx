import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  VentureProductBuildCommandRunLedgerItem,
  VentureProductBuildCommandRunState,
} from "@/lib/venture-portfolio";

function productBuildRunStateBadge(state: VentureProductBuildCommandRunState) {
  if (state === "promoted") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (state === "imported") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

export function ProductBuildCommandRunLedgerPanel({ items }: { items: VentureProductBuildCommandRunLedgerItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Product build command run ledger"
      className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <PackageCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        <h2 className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">Product build command run ledger</h2>
        <Badge variant="secondary" className="bg-white/80 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
          Local proof only
        </Badge>
        <Badge variant="secondary" className="bg-white/70 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
          No external build side effect
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
        Run records prove a product-build command was executed, imported, or promoted locally; they never run commands, deploy, send outreach, spend, contact customers, or change billing.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div key={item.id} className="rounded-md border border-emerald-200 bg-white/80 p-3 dark:border-emerald-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={productBuildRunStateBadge(item.runState)}>
                {item.runState}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                {item.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.commandTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Run proof: {item.runProof}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Local artifact: {item.localArtifactProof}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200">Verifier proof: {item.verifierReportProof}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">Boundary: {item.noExternalSideEffectProof}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
