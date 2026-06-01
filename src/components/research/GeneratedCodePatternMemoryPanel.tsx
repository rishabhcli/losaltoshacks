import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureGeneratedCodePatternMemory } from "@/lib/venture-portfolio";

export function GeneratedCodePatternMemoryPanel({ memories }: { memories: VentureGeneratedCodePatternMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Generated code pattern memory" className="rounded-lg border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900/70 dark:bg-sky-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <PackageCheck className="h-4 w-4 text-sky-700 dark:text-sky-300" />
        <h2 className="text-sm font-semibold text-sky-950 dark:text-sky-100">Generated code pattern memory</h2>
        <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
          {memories.length} pattern{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-sky-200 bg-white/75 p-3 dark:border-sky-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                {memory.patternScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
                {memory.proofStatus}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
                {memory.qaStatus}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.appName}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-sky-800 dark:text-sky-200">{memory.fastestPattern}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {memory.fileCount} files · {memory.passedCheckCount}/{memory.requiredCheckCount} proof checks · {memory.passedMvpCheckCount} MVP checks
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
