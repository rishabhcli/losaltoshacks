import { Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { VentureFailedOutreachMemory } from "@/lib/venture-portfolio";

function failedOutreachSeverityBadge(severity: VentureFailedOutreachMemory["severity"]) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function failedOutreachSourceLabel(sourceType: VentureFailedOutreachMemory["sourceType"]) {
  if (sourceType === "approval-dismissed") return "Dismissed";
  if (sourceType === "risk-gated") return "Risk gated";
  if (sourceType === "campaign-blocked") return "Blocked gate";
  if (sourceType === "campaign-needs-approval") return "Needs approval";
  return "Approval blocked";
}

export function FailedOutreachMemoryPanel({ memories }: { memories: VentureFailedOutreachMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Failed outreach memory" className="rounded-lg border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/70 dark:bg-rose-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Send className="h-4 w-4 text-rose-700 dark:text-rose-300" />
        <h2 className="text-sm font-semibold text-rose-950 dark:text-rose-100">Failed outreach memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
          {memories.length} no-send lesson{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-rose-200 bg-white/75 p-3 dark:border-rose-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={failedOutreachSeverityBadge(memory.severity)}>
                {memory.severity}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
                {failedOutreachSourceLabel(memory.sourceType)}
              </Badge>
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.channel}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{memory.persona}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-rose-800 dark:text-rose-200">{memory.failureReason}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memory.neverRepeat}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {memory.nextAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
