import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureWorkedChannelMemory } from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(cents / 100);
}

function channelPaybackBadge(status: VentureWorkedChannelMemory["paybackStatus"]) {
  if (status === "paid-back") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "partial-payback") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "no-payback") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function WorkedChannelMemoryPanel({ memories }: { memories: VentureWorkedChannelMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Worked channel memory" className="rounded-lg border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900/70 dark:bg-sky-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <GitBranch className="h-4 w-4 text-sky-700 dark:text-sky-300" />
        <h2 className="text-sm font-semibold text-sky-950 dark:text-sky-100">Worked channel memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
          {memories.length} channel{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-sky-200 bg-white/75 p-3 dark:border-sky-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                {memory.channelScore}/100
              </Badge>
              <Badge variant="secondary" className={channelPaybackBadge(memory.paybackStatus)}>
                {memory.paybackStatus}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
                {formatMoney(memory.revenueCents)}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.channel}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-sky-800 dark:text-sky-200">{memory.strongestSignal}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memory.reusableLesson}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              {memory.paidUserCount} paid · {memory.retainedUserCount} retained · CAC {formatMoney(memory.cacCents)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
