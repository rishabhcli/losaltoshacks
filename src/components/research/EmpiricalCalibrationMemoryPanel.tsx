import { Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureEmpiricalCalibrationMemory } from "@/lib/venture-portfolio";

export function EmpiricalCalibrationMemoryPanel({ memories }: { memories: VentureEmpiricalCalibrationMemory[] }) {
  if (memories.length === 0) return null;

  return (
    <div aria-label="Empirical calibration memory" className="rounded-lg border border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-950/70">
      <div className="flex flex-wrap items-center gap-2">
        <Gauge className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">Empirical calibration memory</h2>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {memories.length} calibration{memories.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {memories.slice(0, 3).map((memory) => (
          <div key={memory.id} className="rounded-md border border-slate-200 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {memory.calibrationScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                {memory.gullibilityRisk} risk
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{memory.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">{memory.strongestTrustSignal}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-rose-700 dark:text-rose-300">{memory.strongestDiscountSignal}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {memory.confirmedPredictionCount} confirmed · {memory.surprisedPredictionCount} surprised · {memory.vanityTrapCount} vanity traps
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
