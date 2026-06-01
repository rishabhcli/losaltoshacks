import { Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureOverlookedOpportunityAtlasItem, type VentureOverlookedOpportunityStatus } from "@/lib/venture-portfolio";

function overlookedOpportunityStatusBadge(status: VentureOverlookedOpportunityStatus) {
  if (status === "ranked-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-source") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
}

export function OverlookedOpportunityAtlasPanel({ items }: { items: VentureOverlookedOpportunityAtlasItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Overlooked opportunity atlas"
      className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Radar className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
        <h2 className="text-sm font-semibold text-indigo-950 dark:text-indigo-100">Overlooked opportunity atlas</h2>
        <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
          {items.length} ranked
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-indigo-700 dark:bg-slate-950/60 dark:text-indigo-300">
          Find overlooked high-value opportunities
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-indigo-700 dark:bg-slate-950/60 dark:text-indigo-300">
          Cheap internal test only
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-indigo-700 dark:bg-slate-950/60 dark:text-indigo-300">
          No external send / spend / deploy / billing
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Atlas ranks overlooked opportunities from the discovery backlog, market proof gaps, competitor watches, fake-market memory, converted-pain memory, and evidence quality. Every item carries source provenance, a hidden-wedge rationale, confidence, novelty (not-recycled) proof, a cheap internal-only test command, and the human-review boundary that keeps this app from sending, spending, deploying, contacting, or changing billing.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-indigo-200 bg-white/75 p-3 dark:border-indigo-900/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={overlookedOpportunityStatusBadge(item.status)}>
                {item.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
                {item.priority}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Rank {item.rankScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Confidence {item.confidenceScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Novelty {item.noveltyScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-indigo-700 dark:bg-slate-950/60 dark:text-indigo-300">
                {item.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-200">
              Hidden wedge: {item.hiddenWedge}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Rationale: {item.hiddenWedgeRationale}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
              Not recycled: {item.notRecycledProof}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              Cheap test: {item.cheapInternalTestCommand}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Human review: {item.humanReviewBoundary}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              No external side effect: {item.noExternalSideEffectProof}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
