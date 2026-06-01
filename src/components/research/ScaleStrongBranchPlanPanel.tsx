import { GitBranch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type {
  VentureScaleStrongBranchPlan,
  VentureScaleStrongBranchStatus,
} from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function scaleStrongBranchStatusBadge(status: VentureScaleStrongBranchStatus) {
  if (status === "scale-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "approval-required") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
}

export function ScaleStrongBranchPlanPanel({ plan }: { plan: VentureScaleStrongBranchPlan }) {
  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-3 dark:border-teal-900/70 dark:bg-teal-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <GitBranch className="h-4 w-4 text-teal-700 dark:text-teal-300" />
        <h3 className="text-xs font-semibold text-teal-900 dark:text-teal-100">Scale strong branch plan</h3>
        <Badge variant="secondary" className={scaleStrongBranchStatusBadge(plan.status)}>
          {plan.status}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
          Score {plan.scaleScore}/100
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-teal-800 dark:bg-slate-950/70 dark:text-teal-200">
          Ceiling {formatMoney(plan.humanApprovedSpendCeilingCents)}
        </Badge>
      </div>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-teal-900 dark:text-teal-100">
        {plan.summary}
      </p>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-teal-200 bg-white/80 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Scale evidence</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {plan.evidence.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-teal-200 bg-white/80 p-2 dark:border-teal-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-200">Blockers and stop rules</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {(plan.blockers.length > 0 ? plan.blockers : plan.stopRules).slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-teal-900 dark:text-teal-100">
        Next action: {plan.nextAction}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
        Human review only. This app does not spend, contact customers, deploy, or change billing from this plan.
      </p>
      <Textarea
        aria-label="Scale strong branch plan markdown"
        readOnly
        value={plan.markdown}
        className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
      />
    </div>
  );
}
