import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BreachProcessRegressionClosureHistoryPanel } from "@/components/research/BreachProcessRegressionClosureHistoryPanel";
import { RegressionEscalationAuditPanel } from "@/components/research/RegressionEscalationAuditPanel";
import type {
  BreachProcessRegressionEscalation,
  BreachProcessRegressionEscalationAuditAppeal,
  BreachProcessRegressionEscalationAuditAppealStatus,
  BreachProcessRegressionEscalationAuditAssignment,
  BreachProcessRegressionEscalationAuditClosure,
  BreachProcessRegressionEscalationAuditReview,
  BreachProcessRegressionEscalationAuditReviewOutcome,
} from "@/lib/breach-process-regression-escalations";
import type {
  DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt,
  DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan,
  DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression,
  DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt,
  DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem,
} from "@/lib/venture-portfolio";
import type {
  RegressionEscalationAuditAppealDraft,
  RegressionEscalationAuditDraft,
  RegressionEscalationAuditReviewDraft,
  RegressionEscalationAuditStaleGovernanceContext,
} from "@/hooks/useRegressionEscalationAuditDrafts";

type ProofDraft = {
  proofSummary: string;
  proofArtifact: string;
};

export function BreachProcessPlanCard({
  item,
  latestPlan,
  latestClosure,
  closureDraft,
  regression,
  regressionClosures,
  regressionClosureDraft,
  regressionEscalation,
  regressionEscalationAuditAssignments,
  regressionEscalationAuditClosures,
  regressionEscalationAuditReviews,
  regressionEscalationAuditAppeals,
  regressionEscalationAuditDraft,
  regressionEscalationAuditReviewDraft,
  regressionEscalationAuditAppealDraft,
  onCreatePlan,
  onBreachProcessClosureDraftChange,
  onSubmitBreachProcessClosure,
  onBreachProcessRegressionClosureDraftChange,
  onSubmitBreachProcessRegressionClosure,
  onAssignRegressionEscalationAudit,
  onRegressionEscalationAuditDraftChange,
  onSubmitRegressionEscalationAuditClosure,
  onRegressionEscalationAuditReviewDraftChange,
  onSubmitRegressionEscalationAuditReview,
  onRegressionEscalationAuditAppealDraftChange,
  onSubmitRegressionEscalationAuditAppeal,
}: {
  item: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem;
  latestPlan?: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan;
  latestClosure?: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosureReceipt;
  closureDraft: ProofDraft;
  regression?: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression;
  regressionClosures: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosureReceipt[];
  regressionClosureDraft: ProofDraft;
  regressionEscalation?: BreachProcessRegressionEscalation;
  regressionEscalationAuditAssignments: BreachProcessRegressionEscalationAuditAssignment[];
  regressionEscalationAuditClosures: BreachProcessRegressionEscalationAuditClosure[];
  regressionEscalationAuditReviews: BreachProcessRegressionEscalationAuditReview[];
  regressionEscalationAuditAppeals: BreachProcessRegressionEscalationAuditAppeal[];
  regressionEscalationAuditDraft: RegressionEscalationAuditDraft;
  regressionEscalationAuditReviewDraft: RegressionEscalationAuditReviewDraft;
  regressionEscalationAuditAppealDraft: RegressionEscalationAuditAppealDraft;
  onCreatePlan: (item: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendItem) => void;
  onBreachProcessClosureDraftChange: (planId: string, patch: Partial<ProofDraft>) => void;
  onSubmitBreachProcessClosure: (plan: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlan) => void;
  onBreachProcessRegressionClosureDraftChange: (regressionId: string, patch: Partial<ProofDraft>) => void;
  onSubmitBreachProcessRegressionClosure: (regression: DemandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegression) => void;
  onAssignRegressionEscalationAudit: (escalation: BreachProcessRegressionEscalation) => void;
  onRegressionEscalationAuditDraftChange: (escalationId: string, patch: Partial<RegressionEscalationAuditDraft>) => void;
  onSubmitRegressionEscalationAuditClosure: (
    escalation: BreachProcessRegressionEscalation,
    assignment: BreachProcessRegressionEscalationAuditAssignment,
    proofSummary: string,
    proofArtifact: string,
  ) => boolean;
  onRegressionEscalationAuditReviewDraftChange: (auditClosureId: string, patch: Partial<RegressionEscalationAuditReviewDraft>) => void;
  onSubmitRegressionEscalationAuditReview: (
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    outcome: BreachProcessRegressionEscalationAuditReviewOutcome,
    reviewer: string,
    reviewSummary: string,
    reviewArtifact: string,
  ) => boolean;
  onRegressionEscalationAuditAppealDraftChange: (auditClosureId: string, patch: Partial<RegressionEscalationAuditAppealDraft>) => void;
  onSubmitRegressionEscalationAuditAppeal: (
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    latestDispute: BreachProcessRegressionEscalationAuditReview,
    status: BreachProcessRegressionEscalationAuditAppealStatus,
    staleDisputeAgeDays: number,
    reviewerQuorumCount: number,
    independentReviewerCount: number,
    latestCorrectiveReviewId: string | null,
    conflictingReviewIds: string[],
    reviewerIdentities: string[],
    appealSummary: string,
    appealArtifact: string,
    clearanceBaselineReceiptIds: string[],
    reopenedAfterClearanceReceiptIds: string[],
    priorClearanceAppealId: string | null,
    staleClearanceAgeDays: number,
    fragileRemediationOwner: string | null,
    fragileEscalationArtifact: string | null,
    reviewerRotationProof: string | null,
    rotatedReviewerIdentities: string[],
    staleGovernanceContext?: RegressionEscalationAuditStaleGovernanceContext,
  ) => boolean;
}) {
  return (
    <div className="rounded-md border border-red-100 bg-red-50/60 p-2 dark:border-red-900/60 dark:bg-red-950/20">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className={item.severity === "critical" ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"}>
          {item.severity}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
          {item.owner}
        </Badge>
        <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          {item.sourceType}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
          {item.breachCount} breach{item.breachCount === 1 ? "" : "es"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          {item.resolutionCount} resolved
        </Badge>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{item.summary}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-red-900 dark:text-red-100">Latest breach: {item.latestBreachAt ?? "none"}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Latest due: {item.latestDueAt ?? "none"}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Latest resolved: {item.latestResolvedAt ?? "none"}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Assigned owners: {item.assignedOwners.length > 0 ? item.assignedOwners.join(", ") : "none"}
      </p>
      <ul className="mt-1 list-disc pl-4 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        {item.evidence.slice(0, 4).map((line, index) => (
          <li key={`${item.id}-evidence-${index}`}>{line}</li>
        ))}
      </ul>
      <p className="mt-1 text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">Next: {item.nextAction}</p>
      {item.breachedResolutionIds.length > 0 && (
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Breached receipts: {item.breachedResolutionIds.slice(0, 3).join(", ")}
        </p>
      )}
      {latestPlan ? (
        <div
          aria-label={`Reopen SLA breach process plan ${item.owner} ${item.sourceType}`}
          className="mt-2 rounded border border-red-200 bg-white/80 p-2 text-[11px] leading-relaxed text-red-950 dark:border-red-900/70 dark:bg-slate-950/70 dark:text-red-100"
        >
          <Badge variant="secondary" className={regression ? "mb-1 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : latestClosure ? "mb-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "mb-1 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"}>
            {regression ? "process plan stale after closure" : latestClosure ? "process plan proof-closed" : "process plan assigned"}
          </Badge>
          <p>Process owner: {latestPlan.assignedOwner}</p>
          <p>Process due: {latestPlan.dueAt}</p>
          <p>Planned by {latestPlan.plannedBy} at {latestPlan.plannedAt}</p>
          <p>Follow-up proof: {latestPlan.followUpProof}</p>
          <p>Proof required: {latestPlan.proofRequired}</p>
          <p>Next: {latestPlan.nextAction}</p>
          {regression ? (
            <div
              aria-label={`Reopen SLA breach process regression ${item.owner} ${item.sourceType}`}
              className="mt-2 rounded border border-red-200 bg-red-50/70 p-2 dark:border-red-900/60 dark:bg-red-950/20"
            >
              <p>Regression: {regression.summary}</p>
              <p>Latest breach after closure: {regression.latestBreachAt ?? "none"}</p>
              <p>Breach count at closure: {regression.breachCountAtClosure}; current breach count: {regression.currentBreachCount}</p>
              <p>Prior closure proof: {regression.proofSummary}</p>
              <p>Prior closure artifact: {regression.proofArtifact}</p>
              <p>New breached receipts: {regression.newBreachedResolutionIds.length > 0 ? regression.newBreachedResolutionIds.join(", ") : "none"}</p>
              {regressionEscalation && (
                <div
                  aria-label={`Reopen SLA breach process regression escalation ${item.owner} ${item.sourceType}`}
                  className="mt-2 rounded border border-red-300 bg-red-100/70 p-2 dark:border-red-800/70 dark:bg-red-950/30"
                >
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="bg-red-200 text-red-800 dark:bg-red-950/60 dark:text-red-200">{regressionEscalation.severity}</Badge>
                    <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
                      {regressionEscalation.reason === "rebreach-after-reclosure" ? "rebreach after re-closure" : "aged without stable proof"}
                    </Badge>
                  </div>
                  <p>Higher-severity process audit required.</p>
                  <p>Breach count moved from {regressionEscalation.triggerClosureBreachCount} to {regressionEscalation.currentBreachCount}; aged {regressionEscalation.agedDays} days.</p>
                  <p>Trigger re-closure: {regressionEscalation.triggerClosureClosedAt}</p>
                  <p>New receipts since trigger: {regressionEscalation.newBreachedResolutionIds.length > 0 ? regressionEscalation.newBreachedResolutionIds.join(", ") : "none"}</p>
                  <p>Next: {regressionEscalation.nextAction}</p>
                  <RegressionEscalationAuditPanel
                    escalation={regressionEscalation}
                    assignments={regressionEscalationAuditAssignments}
                    closures={regressionEscalationAuditClosures}
                    reviews={regressionEscalationAuditReviews}
                    appeals={regressionEscalationAuditAppeals}
                    draft={regressionEscalationAuditDraft}
                    reviewDraft={regressionEscalationAuditReviewDraft}
                    appealDraft={regressionEscalationAuditAppealDraft}
                    onAssign={onAssignRegressionEscalationAudit}
                    onDraftChange={onRegressionEscalationAuditDraftChange}
                    onClose={onSubmitRegressionEscalationAuditClosure}
                    onReviewDraftChange={onRegressionEscalationAuditReviewDraftChange}
                    onReview={onSubmitRegressionEscalationAuditReview}
                    onAppealDraftChange={onRegressionEscalationAuditAppealDraftChange}
                    onRecordAppeal={onSubmitRegressionEscalationAuditAppeal}
                  />
                </div>
              )}
              <BreachProcessRegressionClosureHistoryPanel
                owner={item.owner}
                sourceType={item.sourceType}
                regression={regression}
                closures={regressionClosures}
                draft={regressionClosureDraft}
                onDraftChange={onBreachProcessRegressionClosureDraftChange}
                onClose={onSubmitBreachProcessRegressionClosure}
              />
            </div>
          ) : latestClosure ? (
            <div className="mt-2 rounded border border-emerald-200 bg-emerald-50/70 p-2 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <p>Closed by {latestClosure.closedBy} at {latestClosure.closedAt}</p>
              <p>Closure proof: {latestClosure.proofSummary}</p>
              <p>Closure artifact: {latestClosure.proofArtifact}</p>
            </div>
          ) : (
            <div aria-label={`Reopen SLA breach process proof capture ${item.owner} ${item.sourceType}`} className="mt-2 rounded border border-emerald-200 bg-white/80 p-2 dark:border-emerald-900/60 dark:bg-slate-950/70">
              <Textarea
                value={closureDraft.proofSummary}
                onChange={(event) => onBreachProcessClosureDraftChange(latestPlan.id, { proofSummary: event.target.value })}
                placeholder="Process-change proof summary"
                className="min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
              />
              <Input
                value={closureDraft.proofArtifact}
                onChange={(event) => onBreachProcessClosureDraftChange(latestPlan.id, { proofArtifact: event.target.value })}
                placeholder="Process-change artifact or receipt link"
                className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
              />
              <Button
                type="button"
                size="sm"
                className="mt-1.5 h-7 px-2 text-[11px]"
                onClick={() => onSubmitBreachProcessClosure(latestPlan)}
              >
                Close breach process plan with proof {item.owner} {item.sourceType}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-2 h-7 px-2 text-[11px] text-red-900 dark:text-red-100"
          onClick={() => onCreatePlan(item)}
        >
          Create breach process plan {item.owner} {item.sourceType}
        </Button>
      )}
    </div>
  );
}
