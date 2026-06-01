import { Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  VentureDemandCaptureProofQueueItem,
  VentureDemandCaptureProofStatus,
} from "@/lib/venture-portfolio";

function demandCaptureProofStatusBadge(status: VentureDemandCaptureProofStatus) {
  if (status === "captured") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-follow-up") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

export function DemandCaptureProofQueuePanel({ items }: { items: VentureDemandCaptureProofQueueItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Demand capture proof queue"
      className="rounded-lg border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Radar className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
        <h2 className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">Demand capture proof queue</h2>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          {items.length} proof item{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-cyan-700 dark:bg-slate-950/60 dark:text-cyan-300">
          No fake demand boundary
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Proof items turn qualified source records into capture commands, measurable demand proof, and follow-up boundaries before any growth claim can count.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div key={item.id} className="rounded-md border border-cyan-200 bg-white/80 p-3 dark:border-cyan-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={demandCaptureProofStatusBadge(item.status)}>
                {item.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
                {item.priority}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {item.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Capture command: {item.captureCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Metric: {item.qualifiedDemandMetric}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">Source proof: {item.sourceProof}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">Boundary: {item.noFakeDemandBoundary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
