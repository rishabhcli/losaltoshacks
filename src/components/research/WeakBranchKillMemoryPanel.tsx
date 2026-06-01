import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureWeakBranchKillMemory } from "@/lib/venture-portfolio";

function weakBranchKillStatusBadge(status: VentureWeakBranchKillMemory["status"]) {
  if (status === "archived") return "bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  if (status === "pause-recommended") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "revival-watch") return "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function weakBranchKillSeverityBadge(severity: VentureWeakBranchKillMemory["severity"]) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function WeakBranchKillMemoryPanel({ memories }: { memories: VentureWeakBranchKillMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Weak branch kill memory" className="rounded-lg border border-red-200 bg-red-50/70 p-4 dark:border-red-900/70 dark:bg-red-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-red-700 dark:text-red-300" />
        <h2 className="text-sm font-semibold text-red-950 dark:text-red-100">Kill weak branches</h2>
        <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
          {memories.length} kill memor{memories.length === 1 ? "y" : "ies"}
        </Badge>
        <Badge variant="secondary" className="bg-white/70 text-red-700 dark:bg-slate-950/70 dark:text-red-200">
          no spend / no outreach
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {memories.slice(0, 8).map((memory) => (
          <div key={memory.id} className="rounded-md border border-red-200 bg-white/80 p-3 dark:border-red-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={weakBranchKillStatusBadge(memory.status)}>
                {memory.status}
              </Badge>
              <Badge variant="secondary" className={weakBranchKillSeverityBadge(memory.severity)}>
                {memory.severity}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
                {memory.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.sourceTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">{memory.primaryReason}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Stop: {memory.stopRules[0] ?? "Archive until evidence changes."}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Boundary: {memory.noGoBoundaries[0] ?? "No external action from this branch."}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Next: {memory.nextAction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
