import { AlertTriangle, FileText, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { BriefingTrustLedger as BriefingTrustLedgerModel } from "@/lib/briefing-trust";

interface Props {
  ledger: BriefingTrustLedgerModel;
}

export function BriefingTrustLedger({ ledger }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950/40" aria-label="Briefing Trust Ledger">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Briefing Trust Ledger</h2>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            A quick audit of source coverage, generation mode, and unsupported briefing claims.
          </p>
        </div>
        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
          {ledger.modeLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TrustMetric icon={FileText} label="Sources" value={ledger.sourceCount} detail={`${ledger.platformCount} platform${ledger.platformCount === 1 ? "" : "s"}`} />
        <TrustMetric icon={ShieldCheck} label="Coverage" value={ledger.evidenceBackedRecommendations} detail={ledger.recommendationCoverageLabel} />
        <TrustMetric icon={SlidersHorizontal} label="Risk" value={ledger.riskLabel} detail={`${ledger.totalRecommendations} recommendation${ledger.totalRecommendations === 1 ? "" : "s"}`} />
      </div>

      {ledger.warnings.length > 0 ? (
        <div className="mt-4 space-y-1.5">
          {ledger.warnings.map((warning) => (
            <div key={warning} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TrustMetric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{detail}</div>
    </div>
  );
}
