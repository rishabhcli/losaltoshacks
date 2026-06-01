import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression,
  DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt,
} from "@/lib/venture-portfolio";

type ProofDraft = {
  proofSummary: string;
  proofArtifact: string;
};

export function BreachProcessRegressionClosureHistoryPanel({
  owner,
  sourceType,
  regression,
  closures,
  draft,
  onDraftChange,
  onClose,
}: {
  owner: string;
  sourceType: string;
  regression: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression;
  closures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[];
  draft: ProofDraft;
  onDraftChange: (regressionId: string, patch: Partial<ProofDraft>) => void;
  onClose: (regression: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression) => void;
}) {
  return (
    <div
      aria-label={`Reopen SLA breach process regression closure history ${owner} ${sourceType}`}
      className="mt-2 rounded border border-red-200 bg-white/80 p-2 dark:border-red-900/60 dark:bg-slate-950/70"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className={closures.length > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
          {closures.length} regression re-closure{closures.length === 1 ? "" : "s"}
        </Badge>
      </div>
      {closures.length > 0 && (
        <div className="mt-1.5 space-y-1">
          {closures.slice(0, 3).map((closure) => (
            <div key={closure.id} className="rounded border border-emerald-200 bg-emerald-50/70 p-1.5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <p>Regression re-closed by {closure.closedBy} at {closure.closedAt}</p>
              <p>Regression closure proof: {closure.proofSummary}</p>
              <p>Regression closure artifact: {closure.proofArtifact}</p>
              <p>Snapshot breach count: {closure.currentBreachCount}; new receipts: {closure.newBreachedResolutionIds.length > 0 ? closure.newBreachedResolutionIds.join(", ") : "none"}</p>
            </div>
          ))}
        </div>
      )}
      <div aria-label={`Reopen SLA breach process regression proof capture ${owner} ${sourceType}`} className="mt-2 rounded border border-emerald-200 bg-white/80 p-2 dark:border-emerald-900/60 dark:bg-slate-950/70">
        <Textarea
          value={draft.proofSummary}
          onChange={(event) => onDraftChange(regression.id, { proofSummary: event.target.value })}
          placeholder="Regression re-closure proof summary"
          className="min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
        />
        <Input
          value={draft.proofArtifact}
          onChange={(event) => onDraftChange(regression.id, { proofArtifact: event.target.value })}
          placeholder="Regression re-closure artifact or receipt link"
          className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
        />
        <Button
          type="button"
          size="sm"
          className="mt-1.5 h-7 px-2 text-[11px]"
          onClick={() => onClose(regression)}
        >
          Close stale process regression with proof {owner} {sourceType}
        </Button>
      </div>
    </div>
  );
}
