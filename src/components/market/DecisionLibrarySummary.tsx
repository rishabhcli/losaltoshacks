import { AlertTriangle, Archive, CalendarClock, ClipboardCheck, ShieldCheck } from "lucide-react";
import { summarizeDecisionLibrary, type DecisionLibraryItem, type DecisionLibraryStatus } from "@/lib/decision-library";

interface Props {
  items: DecisionLibraryItem[];
  status: DecisionLibraryStatus;
}

export function DecisionLibrarySummary({ items, status }: Props) {
  const stats = summarizeDecisionLibrary(items);
  const isAccepted = status === "accepted";
  const title = isAccepted ? "Decision Library" : "Rejected Decision Library";
  const body = isAccepted
    ? "Accepted ideas are active bets. Keep the evidence trail, confidence, and launch review cadence visible before work starts."
    : "Rejected ideas stay audit-ready. Preserve why the team passed so reversals are easy to spot when the market changes.";
  const Icon = isAccepted ? ClipboardCheck : Archive;

  return (
    <section className="space-y-3" aria-label={title}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={isAccepted ? "h-4 w-4 text-emerald-600" : "h-4 w-4 text-slate-500"} />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">{body}</p>
        </div>
        <div className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {stats.averageConfidence == null ? "No confidence data yet" : `${stats.averageConfidence}% avg confidence`}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric
          icon={ClipboardCheck}
          label="Stored decisions"
          value={stats.total}
          detail={isAccepted ? "active bets" : "archived passes"}
          tone="blue"
        />
        <SummaryMetric
          icon={ShieldCheck}
          label="Evidence-backed decisions"
          value={stats.evidenceBacked}
          detail={`${stats.totalEvidenceSources} source${stats.totalEvidenceSources === 1 ? "" : "s"} attached`}
          tone="emerald"
        />
        <SummaryMetric
          icon={AlertTriangle}
          label="Needs review"
          value={stats.needsReview}
          detail="thin evidence or confidence"
          tone={stats.needsReview > 0 ? "amber" : "slate"}
        />
        <SummaryMetric
          icon={CalendarClock}
          label="Review cadence"
          value={isAccepted ? "Weekly" : "Quarterly"}
          detail={isAccepted ? "until launch" : "or on new signals"}
          tone="slate"
        />
      </div>
    </section>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  value: string | number;
  detail: string;
  tone: "blue" | "emerald" | "amber" | "slate";
}) {
  const toneClass = {
    blue: "text-blue-700 bg-blue-50 border-blue-100 dark:text-blue-300 dark:bg-blue-950/20 dark:border-blue-900/70",
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900/70",
    amber: "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-300 dark:bg-amber-950/20 dark:border-amber-900/70",
    slate: "text-slate-700 bg-white border-slate-200 dark:text-slate-200 dark:bg-slate-950/40 dark:border-slate-800",
  }[tone];

  return (
    <div className={`rounded-lg border p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] ${toneClass}`}>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider opacity-80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold leading-none">{value}</div>
      <div className="mt-1 text-xs opacity-75">{detail}</div>
    </div>
  );
}
