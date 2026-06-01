import { Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureOpportunityDiscoveryBacklogItem, type VentureOpportunityDiscoveryStatus } from "@/lib/venture-portfolio";

function opportunityDiscoveryStatusBadge(status: VentureOpportunityDiscoveryStatus) {
  if (status === "research-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-source") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
}

export function OpportunityDiscoveryBacklogPanel({ items }: { items: VentureOpportunityDiscoveryBacklogItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Opportunity discovery backlog"
      className="rounded-lg border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/70 dark:bg-blue-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Radar className="h-4 w-4 text-blue-700 dark:text-blue-300" />
        <h2 className="text-sm font-semibold text-blue-950 dark:text-blue-100">Opportunity discovery backlog</h2>
        <Badge variant="secondary" className="bg-white/80 text-blue-800 dark:bg-slate-950/70 dark:text-blue-200">
          {items.length} candidate{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-blue-700 dark:bg-slate-950/60 dark:text-blue-300">
          Next research command attached
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Candidates come from market proof gaps, source evidence, browser research, competitor watches, and portfolio memory so discovery improves the next saved venture instead of adding loose notes.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-blue-200 bg-white/75 p-3 dark:border-blue-900/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={opportunityDiscoveryStatusBadge(item.status)}>
                {item.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-blue-800 dark:bg-slate-950/70 dark:text-blue-200">
                {item.priority}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {item.confidenceScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-blue-700 dark:bg-slate-950/60 dark:text-blue-300">
                {item.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">{item.discoveryRationale}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Research: {item.nextResearchCommand}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
              Proof: {item.proofRequired}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Improves venture: {item.improvedVentureInstruction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
