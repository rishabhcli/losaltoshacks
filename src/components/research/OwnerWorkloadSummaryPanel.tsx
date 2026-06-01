import { ClipboardCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem } from "@/lib/venture-portfolio";

export function OwnerWorkloadSummaryPanel({
  ownerWorkloadSummary,
  ownerSourceFilter,
  onClearOwnerSourceFilter,
  onJumpToOwnerWorkload,
}: {
  ownerWorkloadSummary: DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem[];
  ownerSourceFilter: string;
  onClearOwnerSourceFilter: () => void;
  onJumpToOwnerWorkload: (owner: string, sourceType: DemandSourceBlockerPacketTriageOwnerWorkloadSummaryItem["sourceType"]) => void;
}) {
  if (ownerWorkloadSummary.length === 0) return null;

  return (
    <div aria-label="Demand source blocker packet owner workload summary" className="mt-3 rounded-md border border-sky-200 bg-white/75 p-2 dark:border-sky-900/70 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardCheck className="h-3.5 w-3.5 text-sky-700 dark:text-sky-300" />
        <p className="text-[11px] font-semibold text-sky-900 dark:text-sky-100">Owner workload summary</p>
        <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
          {ownerWorkloadSummary.length} owner/source group{ownerWorkloadSummary.length === 1 ? "" : "s"}
        </Badge>
        {ownerSourceFilter !== "all" && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-[11px] text-sky-800 hover:bg-sky-50 dark:text-sky-200 dark:hover:bg-sky-950/40"
            onClick={onClearOwnerSourceFilter}
          >
            Clear owner workload filter
          </Button>
        )}
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {ownerWorkloadSummary.slice(0, 4).map((item) => (
          <div key={item.id} className="rounded-md border border-sky-100 bg-sky-50/60 p-2 dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
                {item.owner}
              </Badge>
              <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                {item.sourceType}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                {item.delegatedCount} delegated
              </Badge>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                {item.needsEvidenceCount} needs evidence
              </Badge>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              {item.activeCount} active, {item.staleCount} stale, {item.missingEvidenceCount} missing evidence. Latest transition: {item.latestTransitionAt ?? "none"}.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-sky-900 dark:text-sky-100">Search anchor: {item.searchAnchor}</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-2 h-7 px-2 text-[11px] text-sky-900 dark:text-sky-100"
              onClick={() => onJumpToOwnerWorkload(item.owner, item.sourceType)}
            >
              Jump to owner workload {item.owner} {item.sourceType}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
