import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureWrongClaimMemory } from "@/lib/venture-portfolio";

function wrongClaimSourceLabel(sourceType: VentureWrongClaimMemory["sourceType"]) {
  if (sourceType === "failed-experiment") return "Failed test";
  if (sourceType === "rejected-pricing") return "Pricing rejected";
  if (sourceType === "killed-decision") return "Killed";
  return "Contradiction";
}

function wrongClaimSeverityBadge(severity: VentureWrongClaimMemory["severity"]) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function WrongClaimMemoryPanel({ memories }: { memories: VentureWrongClaimMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Wrong claim memory" className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/70 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-300" />
        <h2 className="text-sm font-semibold text-amber-950 dark:text-amber-100">Wrong claim memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
          {memories.length} corrected
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-amber-200 bg-white/75 p-3 dark:border-amber-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={wrongClaimSeverityBadge(memory.severity)}>
                {memory.severity}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
                {wrongClaimSourceLabel(memory.sourceType)}
              </Badge>
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.title}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{memory.claim}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">{memory.evidence}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{memory.correctedBelief}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {memory.nextAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
