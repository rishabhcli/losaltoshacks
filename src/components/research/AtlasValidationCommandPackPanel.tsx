import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureAtlasValidationCommandPack, type VentureAtlasValidationCommandPackStatus } from "@/lib/venture-portfolio";

function atlasValidationCommandPackStatusBadge(status: VentureAtlasValidationCommandPackStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-approval") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "needs-source") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

export function AtlasValidationCommandPackPanel({ packs }: { packs: VentureAtlasValidationCommandPack[] }) {
  if (packs.length === 0) return null;

  return (
    <div
      aria-label="Atlas validation command packs"
      className="rounded-lg border border-purple-200 bg-purple-50/70 p-4 dark:border-purple-900/70 dark:bg-purple-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <FlaskConical className="h-4 w-4 text-purple-700 dark:text-purple-300" />
        <h2 className="text-sm font-semibold text-purple-950 dark:text-purple-100">Atlas validation command packs</h2>
        <Badge variant="secondary" className="bg-white/80 text-purple-800 dark:bg-slate-950/70 dark:text-purple-200">
          {packs.length} pack{packs.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-purple-700 dark:bg-slate-950/60 dark:text-purple-300">
          Prove whether anyone wants one
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-purple-700 dark:bg-slate-950/60 dark:text-purple-300">
          Approval gated
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-purple-700 dark:bg-slate-950/60 dark:text-purple-300">
          No external send / spend / deploy / contact / billing
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Validation packs turn top overlooked-opportunity atlas items into approval-gated cheap-internal validation commands. Every pack ties atlas source provenance to a hypothesis, manual result fields and thresholds, success/failure/pivot criteria, and a demand-drift update instruction so this app captures whether anyone actually wants the wedge without sending messages, spending money, deploying code, contacting customers, or changing billing.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {packs.slice(0, 8).map((pack) => (
          <div
            key={pack.id}
            className="rounded-md border border-purple-200 bg-white/75 p-3 dark:border-purple-900/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={atlasValidationCommandPackStatusBadge(pack.status)}>
                {pack.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-purple-800 dark:bg-slate-950/70 dark:text-purple-200">
                {pack.priority}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Rank {pack.rankScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Confidence {pack.confidenceScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                Novelty {pack.noveltyScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-purple-700 dark:bg-slate-950/60 dark:text-purple-300">
                {pack.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{pack.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-purple-800 dark:text-purple-200">
              Atlas item: {pack.atlasItemTitle}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              Hypothesis: {pack.hypothesis}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              Validation command: {pack.cheapInternalValidationCommand}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200">
              Success: {pack.successCriteria}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">
              Failure: {pack.failureCriteria}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
              Pivot: {pack.pivotCriteria}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Demand drift update: {pack.demandDriftUpdateInstruction}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Approval: {pack.approvalGates[0]}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Human review: {pack.humanReviewBoundary}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              No external side effect: {pack.noExternalSideEffectProof}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
