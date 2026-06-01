import { ClipboardCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { DemandSourceBlockerPacketTriageOwnerQueueItem } from "@/lib/venture-portfolio";

export function OwnerTriageQueuePanel({
  ownerQueue,
  ownerSourceFilteredQueue,
  triageLabel,
}: {
  ownerQueue: DemandSourceBlockerPacketTriageOwnerQueueItem[];
  ownerSourceFilteredQueue: DemandSourceBlockerPacketTriageOwnerQueueItem[];
  triageLabel: (status: DemandSourceBlockerPacketTriageOwnerQueueItem["triageStatus"]) => string;
}) {
  if (ownerQueue.length === 0) return null;

  return (
    <div aria-label="Demand source blocker packet triage owner queue" className="mt-3 rounded-md border border-violet-200 bg-white/75 p-2 dark:border-violet-900/70 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardCheck className="h-3.5 w-3.5 text-violet-700 dark:text-violet-300" />
        <p className="text-[11px] font-semibold text-violet-900 dark:text-violet-100">Owner triage work queue</p>
        <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
          {ownerSourceFilteredQueue.length}/{ownerQueue.length} shown
        </Badge>
      </div>
      {ownerSourceFilteredQueue.length > 0 ? (
        <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {ownerSourceFilteredQueue.slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-md border border-violet-100 bg-violet-50/60 p-2 dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className={item.triageStatus === "delegated" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}>
                  {triageLabel(item.triageStatus)}
                </Badge>
                <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
                  {item.sourceType}
                </Badge>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.groupLabel}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{item.summary}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-violet-800 dark:text-violet-200">Latest transition: {item.latestAuditSummary}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-orange-900 dark:text-orange-100">Saved query: {item.searchQuery}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          No owner queue items match the current packet filter.
        </p>
      )}
    </div>
  );
}
