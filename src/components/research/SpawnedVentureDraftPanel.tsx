import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  type VentureSpawnedVentureDraft,
  type VentureSpawnedVentureDraftStatus,
  type VentureSpawnedVentureBranchSourceType,
} from "@/lib/venture-portfolio";

function spawnedVentureDraftStatusBadge(status: VentureSpawnedVentureDraftStatus) {
  if (status === "draft-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-evidence") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function spawnedVentureDraftBranchLabel(source: VentureSpawnedVentureBranchSourceType) {
  if (source === "converted-pain") return "Pain branch";
  if (source === "retained-user") return "Retained cohort";
  if (source === "worked-channel") return "Channel reuse";
  return "Pricing tier";
}

export function SpawnedVentureDraftPanel({ drafts }: { drafts: VentureSpawnedVentureDraft[] }) {
  if (drafts.length === 0) return null;

  return (
    <div aria-label="Spawned venture drafts" className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <GitBranch className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
        <h2 className="text-sm font-semibold text-indigo-950 dark:text-indigo-100">Spawned venture drafts</h2>
        <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
          {drafts.length} branch draft{drafts.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-indigo-700 dark:bg-slate-950/60 dark:text-indigo-300">
          Human review required before save
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Drafts derived from converted-pain, retained-user, worked-channel, and converted-pricing memories. These are kickoff theses for human review — they are NOT auto-saved into the portfolio.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {drafts.slice(0, 6).map((draft) => (
          <div key={draft.id} className="rounded-md border border-indigo-200 bg-white/75 p-3 dark:border-indigo-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={spawnedVentureDraftStatusBadge(draft.status)}>
                {draft.status}
              </Badge>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
                {spawnedVentureDraftBranchLabel(draft.branchSourceType)}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
                {draft.confidenceScore}/100
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{draft.proposedTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Parent: {draft.parentTitle}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-200">{draft.summary}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{draft.provenance}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Buyer: {draft.targetBuyer} · Channel: {draft.channel} · Price: {draft.pricingHypothesis}
            </p>
            {draft.risks.length > 0 && (
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
                {draft.risks.slice(0, 2).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            )}
            {draft.kickoffActions.length > 0 && (
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Next: {draft.kickoffActions[0]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
