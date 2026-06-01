import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureRelatedIdeaMergeAudit, type VentureRelatedIdeaMergeRecommendation } from "@/lib/venture-portfolio";

function relatedIdeaMergeBadge(recommendation: VentureRelatedIdeaMergeRecommendation) {
  if (recommendation === "reuse") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (recommendation === "merge") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (recommendation === "fork") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
  return "bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function RelatedIdeaMergeAuditPanel({ audits }: { audits: VentureRelatedIdeaMergeAudit[] }) {
  if (audits.length === 0) return null;

  return (
    <div
      aria-label="Related idea merge audits"
      className="rounded-lg border border-purple-200 bg-purple-50/70 p-4 dark:border-purple-900/70 dark:bg-purple-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <GitBranch className="h-4 w-4 text-purple-700 dark:text-purple-300" />
        <h2 className="text-sm font-semibold text-purple-950 dark:text-purple-100">Merge related ideas</h2>
        <Badge variant="secondary" className="bg-white/80 text-purple-800 dark:bg-slate-950/70 dark:text-purple-200">
          {audits.length} merge audit{audits.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-purple-700 dark:bg-slate-950/60 dark:text-purple-300">
          Human review only — no automatic merge
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Pairwise audits over saved ventures with overlapping thesis fields. Each audit retains provenance from both sides and recommends reuse/merge/fork/keep-separate; ventures are never merged, archived, or deleted automatically.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {audits.slice(0, 8).map((audit) => (
          <div
            key={audit.id}
            className="rounded-md border border-purple-200 bg-white/75 p-3 dark:border-purple-900/70 dark:bg-slate-950/60"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={relatedIdeaMergeBadge(audit.recommendation)}>
                {audit.recommendation}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-purple-800 dark:bg-slate-950/70 dark:text-purple-200">
                {audit.similarityScore}/100
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {audit.matchedFields.length > 0 ? audit.matchedFields.join(", ") : "no matched fields"}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">
              {audit.primaryTitle} ↔ {audit.relatedTitle}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-purple-800 dark:text-purple-200">
              {audit.sharedThesisSummary}
            </p>
            {audit.differencesToPreserve.length > 0 && (
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                {audit.differencesToPreserve.slice(0, 3).map((diff) => (
                  <li key={diff}>{diff}</li>
                ))}
              </ul>
            )}
            {audit.evidenceProvenance.primaryEvidence.length > 0 && (
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Primary evidence: {audit.evidenceProvenance.primaryEvidence[0]}
              </p>
            )}
            {audit.evidenceProvenance.relatedEvidence.length > 0 && (
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Related evidence: {audit.evidenceProvenance.relatedEvidence[0]}
              </p>
            )}
            {audit.risks.length > 0 && (
              <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
                Risk: {audit.risks[0]}
              </p>
            )}
            <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
              Next: {audit.nextAction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
