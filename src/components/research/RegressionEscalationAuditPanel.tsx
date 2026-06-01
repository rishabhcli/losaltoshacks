import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BREACH_PROCESS_REGRESSION_ESCALATION_FRAGILE_GOVERNANCE_EXPIRY_DAYS,
  BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_REVOCATION_EXPIRY_DAYS,
  buildBreachProcessRegressionEscalationAppealReClearanceCalibrations,
} from "@/lib/breach-process-regression-escalations";
import type {
  BreachProcessRegressionEscalation,
  BreachProcessRegressionEscalationAuditAssignment,
  BreachProcessRegressionEscalationAuditAppeal,
  BreachProcessRegressionEscalationAuditAppealStatus,
  BreachProcessRegressionEscalationAuditClosure,
  BreachProcessRegressionEscalationAuditReview,
  BreachProcessRegressionEscalationAuditReviewOutcome,
} from "@/lib/breach-process-regression-escalations";
import type {
  RegressionEscalationAuditAppealDraft,
  RegressionEscalationAuditDraft,
  RegressionEscalationAuditReviewDraft,
  RegressionEscalationAuditStaleGovernanceContext,
} from "@/hooks/useRegressionEscalationAuditDrafts";

function splitReviewerIdentities(value: string) {
  return value.split(/[,\n]/).map((reviewer) => reviewer.trim()).filter(Boolean);
}

export function RegressionEscalationAuditPanel({
  escalation,
  assignments,
  closures,
  reviews,
  appeals,
  draft,
  reviewDraft,
  appealDraft,
  onAssign,
  onDraftChange,
  onClose,
  onReviewDraftChange,
  onReview,
  onAppealDraftChange,
  onRecordAppeal,
}: {
  escalation: BreachProcessRegressionEscalation;
  assignments: BreachProcessRegressionEscalationAuditAssignment[];
  closures: BreachProcessRegressionEscalationAuditClosure[];
  reviews: BreachProcessRegressionEscalationAuditReview[];
  appeals: BreachProcessRegressionEscalationAuditAppeal[];
  draft: RegressionEscalationAuditDraft;
  reviewDraft: RegressionEscalationAuditReviewDraft;
  appealDraft: RegressionEscalationAuditAppealDraft;
  onAssign: (escalation: BreachProcessRegressionEscalation) => void;
  onDraftChange: (escalationId: string, patch: Partial<RegressionEscalationAuditDraft>) => void;
  onClose: (
    escalation: BreachProcessRegressionEscalation,
    assignment: BreachProcessRegressionEscalationAuditAssignment,
    proofSummary: string,
    proofArtifact: string,
  ) => boolean;
  onReviewDraftChange: (auditClosureId: string, patch: Partial<RegressionEscalationAuditReviewDraft>) => void;
  onReview: (
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    outcome: BreachProcessRegressionEscalationAuditReviewOutcome,
    reviewer: string,
    reviewSummary: string,
    reviewArtifact: string,
  ) => boolean;
  onAppealDraftChange: (auditClosureId: string, patch: Partial<RegressionEscalationAuditAppealDraft>) => void;
  onRecordAppeal: (
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
  const latestAssignment = assignments[0];
  const latestClosure = closures[0];
  const closureReviews = latestClosure
    ? reviews.filter((review) => review.auditClosureId === latestClosure.id)
    : [];
  const latestReview = closureReviews[0];
  const latestDispute = closureReviews.find((review) => review.outcome === "disputed");
  const latestCorrectiveAfterDispute = latestDispute
    ? closureReviews.find((review) => review.outcome === "corrective-proof" && review.reviewedAt > latestDispute.reviewedAt)
    : undefined;
  const closureAppeals = latestClosure
    ? appeals
      .filter((appeal) => appeal.auditClosureId === latestClosure.id)
      .slice()
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    : [];
  const latestClearedAppeal = latestDispute
    ? closureAppeals.find((appeal) => (
      appeal.status === "quorum-cleared" &&
      appeal.recordedAt > latestDispute.reviewedAt
    ))
    : undefined;
  const conflictingReviewIds = latestDispute
    ? closureReviews
      .filter((review) => review.id !== latestDispute.id && review.outcome !== "disputed")
      .map((review) => review.id)
    : [];
  const reviewerIdentities = Array.from(new Set(closureReviews.map((review) => review.reviewer).filter(Boolean)));
  const independentReviewerIdentities = reviewerIdentities.filter((reviewer) => (
    reviewer !== latestClosure?.closedBy &&
    reviewer !== latestAssignment?.assignedOwner
  ));
  const reviewerQuorumCount = reviewerIdentities.length;
  const independentReviewerCount = independentReviewerIdentities.length;
  const staleDisputeAgeDays = latestDispute
    ? Math.max(0, Math.floor((Date.now() - Date.parse(latestDispute.reviewedAt)) / (24 * 60 * 60 * 1000)))
    : 0;
  // Appeal-clearance durability monitoring: a later breached receipt makes a prior quorum clearance stale.
  const latestQuorumClearedAppeal = closureAppeals.find((appeal) => appeal.status === "quorum-cleared");
  const clearanceBaselineReceiptIds = latestQuorumClearedAppeal
    ? latestQuorumClearedAppeal.clearanceBaselineReceiptIds ?? escalation.newBreachedResolutionIds
    : [];
  const reopenedAfterClearanceReceiptIds = latestQuorumClearedAppeal
    ? escalation.newBreachedResolutionIds.filter(
      (id) => !clearanceBaselineReceiptIds.includes(id),
    )
    : [];
  const clearanceStale = Boolean(latestQuorumClearedAppeal && reopenedAfterClearanceReceiptIds.length > 0);
  const staleClearancePacket = clearanceStale && latestQuorumClearedAppeal
    ? closureAppeals.find((appeal) => (
      appeal.status === "clearance-stale" &&
      appeal.recordedAt > latestQuorumClearedAppeal.recordedAt
    ))
    : undefined;
  const correctiveAfterStalePacket = staleClearancePacket
    ? closureReviews.find((review) => (
      review.outcome === "corrective-proof" &&
      review.reviewedAt > staleClearancePacket.recordedAt
    ))
    : undefined;
  const reClearedAppeal = latestQuorumClearedAppeal && latestQuorumClearedAppeal.priorClearanceAppealId
    ? latestQuorumClearedAppeal
    : undefined;
  const staleClearanceAgeDays = clearanceStale && latestQuorumClearedAppeal
    ? Math.max(0, Math.floor((Date.now() - Date.parse(latestQuorumClearedAppeal.recordedAt)) / (24 * 60 * 60 * 1000)))
    : 0;
  // Appeal re-clearance audit calibration: track how often this owner/source's clearances go stale.
  const reClearanceCalibration = buildBreachProcessRegressionEscalationAppealReClearanceCalibrations(appeals)[0];
  const fragileClearance = reClearanceCalibration?.fragileClearance ?? false;
  const latestFragileGovernancePacket = fragileClearance && staleClearancePacket
    ? closureAppeals.find((appeal) => (
      appeal.status === "fragile-governance" &&
      appeal.recordedAt > staleClearancePacket.recordedAt
    ))
    : undefined;
  const acceptedFragileGovernancePackets = fragileClearance
    ? closureAppeals.filter((appeal) => appeal.status === "fragile-governance")
    : [];
  const latestAcceptedFragileGovernancePacket = fragileClearance
    ? latestFragileGovernancePacket ?? acceptedFragileGovernancePackets.find((appeal) => (
      !latestQuorumClearedAppeal || appeal.recordedAt <= latestQuorumClearedAppeal.recordedAt
    ))
    : undefined;
  const governanceBaselineReceiptIds = latestAcceptedFragileGovernancePacket?.governanceBaselineReceiptIds ?? latestAcceptedFragileGovernancePacket?.clearanceBaselineReceiptIds ?? [];
  const reopenedAfterGovernanceReceiptIds = latestAcceptedFragileGovernancePacket
    ? escalation.newBreachedResolutionIds.filter((id) => !governanceBaselineReceiptIds.includes(id))
    : [];
  const staleGovernanceAgeDays = latestAcceptedFragileGovernancePacket
    ? Math.max(0, Math.floor((Date.now() - Date.parse(latestAcceptedFragileGovernancePacket.recordedAt)) / (24 * 60 * 60 * 1000)))
    : 0;
  const fragileGovernanceHasSuccessfulReclearance = Boolean(
    latestAcceptedFragileGovernancePacket &&
    closureAppeals.some((appeal) => (
      appeal.status === "quorum-cleared" &&
      Boolean(appeal.priorClearanceAppealId) &&
      appeal.recordedAt > latestAcceptedFragileGovernancePacket.recordedAt
    )),
  );
  const fragileGovernanceReopenedAfterAcceptance = Boolean(
    clearanceStale &&
    latestAcceptedFragileGovernancePacket &&
    reopenedAfterGovernanceReceiptIds.length > 0,
  );
  const fragileGovernanceExpiredWithoutReclearance = Boolean(
    clearanceStale &&
    staleClearancePacket &&
    latestAcceptedFragileGovernancePacket &&
    latestAcceptedFragileGovernancePacket.recordedAt > staleClearancePacket.recordedAt &&
    !fragileGovernanceHasSuccessfulReclearance &&
    staleGovernanceAgeDays >= BREACH_PROCESS_REGRESSION_ESCALATION_FRAGILE_GOVERNANCE_EXPIRY_DAYS,
  );
  const staleGovernanceReason: RegressionEscalationAuditStaleGovernanceContext["staleGovernanceReason"] | null = fragileGovernanceReopenedAfterAcceptance
    ? "new-breach-after-governance"
    : fragileGovernanceExpiredWithoutReclearance
      ? "aged-without-reclearance"
      : null;
  const fragileGovernanceStale = Boolean(staleGovernanceReason);
  const staleFragileGovernancePacket = fragileGovernanceStale && latestAcceptedFragileGovernancePacket
    ? closureAppeals.find((appeal) => (
      appeal.status === "fragile-governance-stale" &&
      appeal.priorFragileGovernanceAppealId === latestAcceptedFragileGovernancePacket.id
    ))
    : undefined;
  const staleGovernancePackets = closureAppeals.filter((appeal) => appeal.status === "fragile-governance-stale");
  const latestGovernanceRevocationPacket = staleGovernancePackets.length >= 2
    ? closureAppeals.find((appeal) => (
      appeal.status === "fragile-governance-revoked" &&
      appeal.recordedAt > staleGovernancePackets[0].recordedAt
    ))
    : undefined;
  const freshGovernanceAfterRevocation = latestGovernanceRevocationPacket
    ? closureAppeals.find((appeal) => (
      appeal.status === "fragile-governance" &&
      appeal.recordedAt > latestGovernanceRevocationPacket.recordedAt
    ))
    : undefined;
  const staleGovernanceRevocationAgeDays = latestGovernanceRevocationPacket
    ? Math.max(0, Math.floor((Date.now() - Date.parse(latestGovernanceRevocationPacket.recordedAt)) / (24 * 60 * 60 * 1000)))
    : 0;
  const governanceRevocationExpiredWithoutFreshGovernance = Boolean(
    latestGovernanceRevocationPacket &&
    !freshGovernanceAfterRevocation &&
    staleGovernanceRevocationAgeDays >= BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_REVOCATION_EXPIRY_DAYS,
  );
  const staleGovernanceRevocationPacket = latestGovernanceRevocationPacket
    ? closureAppeals.find((appeal) => (
      appeal.status === "fragile-governance-revocation-stale" &&
      appeal.priorGovernanceRevocationAppealId === latestGovernanceRevocationPacket.id
    ))
    : undefined;
  const governanceRevocationStaleRequired = Boolean(
    governanceRevocationExpiredWithoutFreshGovernance &&
    !staleGovernanceRevocationPacket,
  );
  const governanceRevocationRequired = Boolean(
    staleGovernancePackets.length >= 2 &&
    latestAcceptedFragileGovernancePacket &&
    (!latestGovernanceRevocationPacket || Boolean(staleGovernanceRevocationPacket)),
  );
  const repeatReviewerSet = new Set((reClearanceCalibration?.repeatReviewers ?? []).map((reviewer) => reviewer.toLowerCase()));
  const rotatedReviewerIdentities = latestFragileGovernancePacket?.rotatedReviewerIdentities ?? [];
  const governanceHasRotatedReviewer = rotatedReviewerIdentities.some((reviewer) => !repeatReviewerSet.has(reviewer.toLowerCase()));
  const governanceHasSeparateOwner = Boolean(
    latestFragileGovernancePacket?.fragileRemediationOwner &&
    latestFragileGovernancePacket.fragileRemediationOwner !== escalation.owner &&
    latestFragileGovernancePacket.fragileRemediationOwner !== latestFragileGovernancePacket.recordedBy,
  );
  const fragileGovernanceCleared = !fragileClearance || Boolean(
    !fragileGovernanceStale &&
    !governanceRevocationRequired &&
    !governanceRevocationStaleRequired &&
    latestFragileGovernancePacket?.fragileEscalationArtifact &&
    latestFragileGovernancePacket.reviewerRotationProof &&
    governanceHasSeparateOwner &&
    governanceHasRotatedReviewer,
  );
  const fragileGovernanceRequired = Boolean(
    clearanceStale &&
    fragileClearance &&
    staleClearancePacket &&
    correctiveAfterStalePacket &&
    (!fragileGovernanceStale || staleFragileGovernancePacket) &&
    !governanceRevocationRequired &&
    !governanceRevocationStaleRequired &&
    !fragileGovernanceCleared,
  );
  const staleGovernanceAcknowledgementRequired = Boolean(
    clearanceStale &&
    fragileGovernanceStale &&
    staleClearancePacket &&
    !staleFragileGovernancePacket,
  );
  const quorumCleared = Boolean(
    latestDispute &&
    latestCorrectiveAfterDispute &&
    independentReviewerCount >= 2 &&
    latestClearedAppeal &&
    latestClearedAppeal.recordedAt > latestCorrectiveAfterDispute.reviewedAt &&
    !clearanceStale,
  );
  const quorumRequired = Boolean(
    latestDispute &&
    conflictingReviewIds.length > 0 &&
    !quorumCleared &&
    !clearanceStale,
  );
  const disputeOpen = Boolean(latestDispute && (!latestCorrectiveAfterDispute || quorumRequired));
  const reviewRequired = Boolean(latestClosure && closureReviews.length === 0);
  const receiptReopened = Boolean(
    latestClosure && (
      escalation.currentBreachCount > latestClosure.currentBreachCount ||
      escalation.newBreachedResolutionIds.some((id) => !latestClosure.newBreachedResolutionIds.includes(id))
    ),
  );
  const auditReopened = Boolean(
    latestClosure && (receiptReopened || disputeOpen || quorumRequired || clearanceStale),
  );
  const newReceiptsAfterClosure = latestClosure
    ? escalation.newBreachedResolutionIds.filter((id) => !latestClosure.newBreachedResolutionIds.includes(id))
    : [];
  const reviewStatus = !latestClosure
    ? "audit review pending"
    : reviewRequired
      ? "audit review required"
      : clearanceStale
        ? "audit clearance stale"
        : quorumRequired
          ? "audit appeal quorum required"
          : disputeOpen
          ? "audit dispute unresolved"
          : quorumCleared
            ? "audit appeal quorum cleared"
            : latestCorrectiveAfterDispute
              ? "audit dispute corrected"
              : latestReview?.outcome === "attested"
                ? "audit review attested"
                : "audit review recorded";
  const reviewBadgeClass = reviewRequired || disputeOpen || quorumRequired || clearanceStale
    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
    : quorumCleared || latestCorrectiveAfterDispute || latestReview?.outcome === "attested"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300";
  const appealStatus = !latestDispute
    ? "audit appeal not required"
    : clearanceStale
      ? "audit appeal clearance stale"
      : quorumCleared
        ? "audit appeal quorum cleared"
        : quorumRequired && staleDisputeAgeDays >= 7
          ? "audit appeal stale"
          : quorumRequired
            ? "audit appeal quorum required"
            : "audit appeal monitoring";
  const appealBadgeClass = quorumRequired || staleDisputeAgeDays >= 7 || clearanceStale
    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
    : quorumCleared
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300";

  return (
    <div
      aria-label={`Reopen SLA breach process regression escalation audit ${escalation.owner} ${escalation.sourceType}`}
      className="mt-2 rounded border border-red-200 bg-white/80 p-2 dark:border-red-900/60 dark:bg-slate-950/70"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className={latestAssignment ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
          {assignments.length} audit assignment{assignments.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className={latestClosure ? auditReopened ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}>
          {latestClosure ? auditReopened ? "audit closure reopened" : "audit proof-closed" : "audit proof open"}
        </Badge>
        <Badge variant="secondary" className={reviewBadgeClass}>
          {closureReviews.length} audit review{closureReviews.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className={reviewBadgeClass}>
          {reviewStatus}
        </Badge>
        <Badge variant="secondary" className={appealBadgeClass}>
          {independentReviewerCount} independent reviewer{independentReviewerCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className={appealBadgeClass}>
          {appealStatus}
        </Badge>
        {reClearanceCalibration && reClearanceCalibration.staleRecurrenceCount > 0 && (
          <Badge
            variant="secondary"
            className={fragileClearance
              ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              : "bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300"}
          >
            {fragileClearance ? "fragile clearance" : "clearance calibration"}
          </Badge>
        )}
      </div>
      {latestAssignment ? (
        <div className="mt-1.5 rounded border border-blue-200 bg-blue-50/70 p-1.5 dark:border-blue-900/60 dark:bg-blue-950/20">
          <p>Audit owner: {latestAssignment.assignedOwner}</p>
          <p>Audit due: {latestAssignment.dueAt}</p>
          <p>Assigned by {latestAssignment.assignedBy} at {latestAssignment.assignedAt}</p>
          <p>Proof required: {latestAssignment.proofRequired}</p>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-1.5 h-7 px-2 text-[11px] text-red-900 dark:text-red-100"
          onClick={() => onAssign(escalation)}
        >
          Assign regression escalation audit {escalation.owner} {escalation.sourceType}
        </Button>
      )}
      {latestClosure && (
        <div className={auditReopened ? "mt-1.5 rounded border border-red-200 bg-red-50/70 p-1.5 dark:border-red-900/60 dark:bg-red-950/20" : "mt-1.5 rounded border border-emerald-200 bg-emerald-50/70 p-1.5 dark:border-emerald-900/60 dark:bg-emerald-950/20"}>
          <p>Audit closed by {latestClosure.closedBy} at {latestClosure.closedAt}</p>
          <p>Audit closure proof: {latestClosure.proofSummary}</p>
          <p>Audit closure artifact: {latestClosure.proofArtifact}</p>
          <p>Audit closure breach count: {latestClosure.currentBreachCount}; current breach count: {escalation.currentBreachCount}</p>
          {reviewRequired && (
            <p>Independent review required before stability can be accepted.</p>
          )}
          {receiptReopened && (
            <p>New receipts after audit closure: {newReceiptsAfterClosure.length > 0 ? newReceiptsAfterClosure.join(", ") : "latest breach after audit closure"}</p>
          )}
          {disputeOpen && latestDispute && (
            <p>Stability blocked by independent dispute: {latestDispute.reviewSummary}</p>
          )}
          {latestDispute && (
            <p>Stale dispute age: {staleDisputeAgeDays} day{staleDisputeAgeDays === 1 ? "" : "s"}; reviewer quorum: {reviewerQuorumCount} total, {independentReviewerCount} independent.</p>
          )}
          {quorumRequired && (
            <p>Appeal quorum required before stability can be accepted.</p>
          )}
          {quorumCleared && latestClearedAppeal && (
            <p>Appeal quorum cleared by {latestClearedAppeal.recordedBy} at {latestClearedAppeal.recordedAt}.</p>
          )}
          {clearanceStale && latestQuorumClearedAppeal && (
            <>
              <p>Prior appeal quorum clearance {latestQuorumClearedAppeal.recordedAt} is stale after a later reopened SLA breach; stability blocked again.</p>
              <p>Prior clearance baseline receipts: {clearanceBaselineReceiptIds.join(", ") || "none recorded"}</p>
              <p>Reopened-after-clearance receipts: {reopenedAfterClearanceReceiptIds.join(", ")}</p>
              <p>Stale clearance age: {staleClearanceAgeDays} day{staleClearanceAgeDays === 1 ? "" : "s"}.</p>
              {!staleClearancePacket && (
                <p>Record a fresh stale-clearance appeal packet before a new re-clearance can be attempted.</p>
              )}
              {staleClearancePacket && !correctiveAfterStalePacket && (
                <p>Fresh corrective review required after the stale-clearance packet before re-clearance.</p>
              )}
              {staleClearancePacket && correctiveAfterStalePacket && (
                <p>Stale-clearance packet and fresh corrective proof recorded; two reviewers can re-clear the appeal quorum.</p>
              )}
              {fragileGovernanceRequired && (
                <p>Fragile clearance governance required: assign a separate remediation owner, attach an escalation artifact, and prove reviewer rotation before re-clearance can be treated as operationally stable.</p>
              )}
              {latestFragileGovernancePacket && !fragileGovernanceCleared && (
                <p>Fragile governance packet is incomplete; repeat reviewers alone cannot clear a fragile owner/source.</p>
              )}
              {latestFragileGovernancePacket && fragileGovernanceCleared && (
                <p>Fragile governance accepted: {latestFragileGovernancePacket.fragileRemediationOwner} owns remediation, rotation proof is attached, and re-clearance can proceed.</p>
              )}
              {fragileGovernanceStale && latestAcceptedFragileGovernancePacket && (
                staleGovernanceReason === "aged-without-reclearance" ? (
                  <p>Fragile governance stale: {latestAcceptedFragileGovernancePacket.fragileEscalationArtifact ?? latestAcceptedFragileGovernancePacket.appealArtifact} sat {staleGovernanceAgeDays} day{staleGovernanceAgeDays === 1 ? "" : "s"} without successful re-clearance.</p>
                ) : (
                  <p>Fragile governance stale: {latestAcceptedFragileGovernancePacket.fragileEscalationArtifact ?? latestAcceptedFragileGovernancePacket.appealArtifact} no longer covers reopened receipts {reopenedAfterGovernanceReceiptIds.join(", ")}.</p>
                )
              )}
              {staleGovernanceAcknowledgementRequired && (
                <p>Record a stale fragile-governance packet before a fresh rotated owner/reviewer lane can be reused.</p>
              )}
              {governanceRevocationRequired && latestAcceptedFragileGovernancePacket && (
                <p>Fragile governance revocation required: repeated stale governance revoked {latestAcceptedFragileGovernancePacket.fragileRemediationOwner ?? "the prior owner"} / {(latestAcceptedFragileGovernancePacket.rotatedReviewerIdentities ?? []).join(", ") || "the prior reviewer"} until a governance council packet is recorded.</p>
              )}
              {governanceRevocationStaleRequired && latestGovernanceRevocationPacket && (
                <p>Governance council revocation stale: {latestGovernanceRevocationPacket.fragileEscalationArtifact ?? latestGovernanceRevocationPacket.appealArtifact} sat {staleGovernanceRevocationAgeDays} day{staleGovernanceRevocationAgeDays === 1 ? "" : "s"} without a fresh accepted governance lane.</p>
              )}
            </>
          )}
          {reClearedAppeal && !clearanceStale && (
            <p>Appeal quorum re-cleared by {reClearedAppeal.recordedBy} at {reClearedAppeal.recordedAt} after stale clearance.</p>
          )}
        </div>
      )}
      {latestClosure && closureReviews.length > 0 && (
        <div className="mt-1.5 rounded border border-violet-200 bg-violet-50/70 p-1.5 dark:border-violet-900/60 dark:bg-violet-950/20">
          {closureReviews.slice(0, 4).map((review) => (
            <div key={review.id} className="mt-1 first:mt-0">
              <p>Independent review {review.outcome} by {review.reviewer} at {review.reviewedAt}</p>
              <p>Review proof: {review.reviewSummary}</p>
              <p>Review artifact: {review.reviewArtifact}</p>
            </div>
          ))}
        </div>
      )}
      {latestClosure && closureAppeals.length > 0 && (
        <div className="mt-1.5 rounded border border-orange-200 bg-orange-50/70 p-1.5 dark:border-orange-900/60 dark:bg-orange-950/20">
          {closureAppeals.slice(0, 5).map((appeal) => (
            <div key={appeal.id} className="mt-1 first:mt-0">
              <p>Appeal packet {appeal.status} by {appeal.recordedBy} at {appeal.recordedAt}</p>
              <p>Appeal proof: {appeal.appealSummary}</p>
              <p>Appeal artifact: {appeal.appealArtifact}</p>
              <p>Appeal quorum: {appeal.reviewerQuorumCount} total, {appeal.independentReviewerCount} independent; stale dispute age {appeal.staleDisputeAgeDays} day{appeal.staleDisputeAgeDays === 1 ? "" : "s"}.</p>
              {(appeal.clearanceBaselineReceiptIds?.length ?? 0) > 0 && (
                <p>Clearance baseline receipts: {(appeal.clearanceBaselineReceiptIds ?? []).join(", ")}</p>
              )}
              {(appeal.reopenedAfterClearanceReceiptIds?.length ?? 0) > 0 && (
                <p>Reopened-after-clearance receipts: {(appeal.reopenedAfterClearanceReceiptIds ?? []).join(", ")}; stale clearance age {appeal.staleClearanceAgeDays ?? 0} day{(appeal.staleClearanceAgeDays ?? 0) === 1 ? "" : "s"}.</p>
              )}
              {appeal.priorClearanceAppealId && (
                <p>Supersedes prior clearance appeal: {appeal.priorClearanceAppealId}</p>
              )}
              {(appeal.status === "fragile-governance" || appeal.status === "fragile-governance-revoked") && (
                <>
                  <p>Fragile remediation owner: {appeal.fragileRemediationOwner ?? "not recorded"}</p>
                  <p>Fragile escalation artifact: {appeal.fragileEscalationArtifact ?? "not recorded"}</p>
                  <p>Reviewer rotation proof: {appeal.reviewerRotationProof ?? "not recorded"}</p>
                  <p>Rotated reviewers: {(appeal.rotatedReviewerIdentities ?? []).join(", ") || "none recorded"}</p>
                </>
              )}
              {appeal.status === "fragile-governance-revoked" && (
                <>
                  <p>Revoked fragile governance packet: {appeal.revokedFragileGovernanceAppealId ?? "not recorded"}</p>
                  <p>Revoked by stale-governance packets: {(appeal.revokedGovernanceStaleAppealIds ?? []).join(", ") || "not recorded"}</p>
                  <p>Revocation reason: {appeal.revocationReason ?? "not recorded"}</p>
                </>
              )}
              {appeal.status === "fragile-governance-revocation-stale" && (
                <>
                  <p>Stale governance council revocation packet: {appeal.priorGovernanceRevocationAppealId ?? "not recorded"}</p>
                  <p>Stale council revocation reason: {appeal.staleGovernanceRevocationReason ?? "not recorded"}; age {appeal.staleGovernanceRevocationAgeDays ?? 0} day{(appeal.staleGovernanceRevocationAgeDays ?? 0) === 1 ? "" : "s"}.</p>
                </>
              )}
              {appeal.status === "fragile-governance-stale" && (
                <>
                  <p>Stale fragile governance packet: {appeal.priorFragileGovernanceAppealId ?? "not linked"}</p>
                  <p>Governance baseline receipts: {(appeal.governanceBaselineReceiptIds ?? []).join(", ") || "none recorded"}</p>
                  <p>Reopened-after-governance receipts: {(appeal.reopenedAfterGovernanceReceiptIds ?? []).join(", ") || "none recorded"}</p>
                  <p>Stale governance reason: {appeal.staleGovernanceReason ?? "not recorded"}; age {appeal.staleGovernanceAgeDays ?? 0} day{(appeal.staleGovernanceAgeDays ?? 0) === 1 ? "" : "s"}.</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {reClearanceCalibration && reClearanceCalibration.staleRecurrenceCount > 0 && (
        <div
          aria-label={`Reopen SLA breach process regression escalation appeal re-clearance calibration ${escalation.owner} ${escalation.sourceType}`}
          className={fragileClearance
            ? "mt-1.5 rounded border border-red-200 bg-red-50/70 p-1.5 dark:border-red-900/60 dark:bg-red-950/20"
            : "mt-1.5 rounded border border-slate-200 bg-slate-50/70 p-1.5 dark:border-slate-800/60 dark:bg-slate-950/40"}
        >
          <p>
            {fragileClearance ? "Fragile clearance" : "Clearance calibration"}: {reClearanceCalibration.staleRecurrenceCount} clearance/governance packet{reClearanceCalibration.staleRecurrenceCount === 1 ? "" : "s"} went stale (mean {reClearanceCalibration.meanDaysToStale} day{reClearanceCalibration.meanDaysToStale === 1 ? "" : "s"}-to-stale).
          </p>
          <p>Re-clearances recorded: {reClearanceCalibration.reClearanceCount}; latest appeal status: {reClearanceCalibration.latestStatus ?? "none"}.</p>
          {reClearanceCalibration.repeatReviewers.length > 0 && (
            <p>Repeat reviewers: {reClearanceCalibration.repeatReviewers.join(", ")}</p>
          )}
          {fragileClearance && (
            <p>Chronic re-breach detected: clearance stays flagged fragile even though the latest appeal re-clearance succeeded.</p>
          )}
        </div>
      )}
      {latestAssignment && (
        <div className="mt-2 rounded border border-emerald-200 bg-white/80 p-2 dark:border-emerald-900/60 dark:bg-slate-950/70">
          <Textarea
            value={draft.proofSummary}
            onChange={(event) => onDraftChange(escalation.id, { proofSummary: event.target.value })}
            placeholder="Regression escalation audit proof summary"
            className="min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
          />
          <Input
            value={draft.proofArtifact}
            onChange={(event) => onDraftChange(escalation.id, { proofArtifact: event.target.value })}
            placeholder="Regression escalation audit artifact or receipt link"
            className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
          />
          <Button
            type="button"
            size="sm"
            className="mt-1.5 h-7 px-2 text-[11px]"
            onClick={() => onClose(escalation, latestAssignment, draft.proofSummary, draft.proofArtifact)}
          >
            Close regression escalation audit with proof {escalation.owner} {escalation.sourceType}
          </Button>
        </div>
      )}
      {latestClosure && (
        <div className="mt-2 rounded border border-violet-200 bg-white/80 p-2 dark:border-violet-900/60 dark:bg-slate-950/70">
          <Input
            value={reviewDraft.reviewer}
            onChange={(event) => onReviewDraftChange(latestClosure.id, { reviewer: event.target.value })}
            placeholder="Independent reviewer identity"
            className="mb-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
          />
          <Textarea
            value={reviewDraft.reviewSummary}
            onChange={(event) => onReviewDraftChange(latestClosure.id, { reviewSummary: event.target.value })}
            placeholder="Independent audit review summary"
            className="min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
          />
          <Input
            value={reviewDraft.reviewArtifact}
            onChange={(event) => onReviewDraftChange(latestClosure.id, { reviewArtifact: event.target.value })}
            placeholder="Independent audit review artifact or dispute packet"
            className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px]"
              onClick={() => onReview(escalation, latestClosure, "attested", reviewDraft.reviewer, reviewDraft.reviewSummary, reviewDraft.reviewArtifact)}
            >
              Attest regression escalation audit review {escalation.owner} {escalation.sourceType}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px] text-red-900 dark:text-red-100"
              onClick={() => onReview(escalation, latestClosure, "disputed", reviewDraft.reviewer, reviewDraft.reviewSummary, reviewDraft.reviewArtifact)}
            >
              Dispute regression escalation audit review {escalation.owner} {escalation.sourceType}
            </Button>
            {(disputeOpen || (clearanceStale && Boolean(staleClearancePacket) && !correctiveAfterStalePacket)) && (
              <Button
                type="button"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => onReview(escalation, latestClosure, "corrective-proof", reviewDraft.reviewer, reviewDraft.reviewSummary, reviewDraft.reviewArtifact)}
              >
                Record corrective audit proof {escalation.owner} {escalation.sourceType}
              </Button>
            )}
          </div>
        </div>
      )}
      {latestClosure && latestDispute && (quorumRequired || clearanceStale) && (
        <div className="mt-2 rounded border border-orange-200 bg-white/80 p-2 dark:border-orange-900/60 dark:bg-slate-950/70">
          <Textarea
            value={appealDraft.appealSummary}
            onChange={(event) => onAppealDraftChange(latestClosure.id, { appealSummary: event.target.value })}
            placeholder="Audit appeal quorum summary"
            className="min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
          />
          <Input
            value={appealDraft.appealArtifact}
            onChange={(event) => onAppealDraftChange(latestClosure.id, { appealArtifact: event.target.value })}
            placeholder="Audit appeal artifact or quorum packet"
            className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
          />
          {(fragileGovernanceRequired || staleGovernanceAcknowledgementRequired || governanceRevocationRequired || governanceRevocationStaleRequired) && (
            <div className="mt-1.5 rounded border border-red-200 bg-red-50/70 p-1.5 dark:border-red-900/60 dark:bg-red-950/20">
              {fragileGovernanceRequired || governanceRevocationRequired ? (
                <>
                  <Input
                    value={appealDraft.fragileRemediationOwner}
                    onChange={(event) => onAppealDraftChange(latestClosure.id, { fragileRemediationOwner: event.target.value })}
                    placeholder="Fragile remediation owner"
                    className="h-8 bg-white/90 text-xs dark:bg-slate-950/70"
                  />
                  <Input
                    value={appealDraft.fragileEscalationArtifact}
                    onChange={(event) => onAppealDraftChange(latestClosure.id, { fragileEscalationArtifact: event.target.value })}
                    placeholder="Fragile escalation artifact"
                    className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
                  />
                  <Textarea
                    value={appealDraft.reviewerRotationProof}
                    onChange={(event) => onAppealDraftChange(latestClosure.id, { reviewerRotationProof: event.target.value })}
                    placeholder="Reviewer rotation proof"
                    className="mt-1.5 min-h-[56px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
                  />
                  <Input
                    value={appealDraft.rotatedReviewerIdentity}
                    onChange={(event) => onAppealDraftChange(latestClosure.id, { rotatedReviewerIdentity: event.target.value })}
                    placeholder="Rotated reviewer identity"
                    className="mt-1.5 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
                  />
                  <p className="mt-1 text-[11px] text-red-800 dark:text-red-200">
                    {governanceRevocationRequired
                      ? "A governance council packet must revoke the stale lane before any fresh fragile governance can be reused."
                      : "Repeat reviewers alone cannot clear a fragile owner/source."}
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-red-800 dark:text-red-200">
                  {governanceRevocationStaleRequired
                    ? "Prior governance council revocation is stale; record stale council history before a new two-reviewer council packet can be accepted."
                    : "Prior fragile governance is stale; record a stale-governance packet before a new rotated owner/reviewer lane can be accepted."}
                </p>
              )}
            </div>
          )}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {quorumRequired && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] text-orange-900 dark:text-orange-100"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  staleDisputeAgeDays >= 7 ? "stale-dispute" : "quorum-required",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  latestCorrectiveAfterDispute?.id ?? null,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  [],
                  [],
                  null,
                  0,
                  null,
                  null,
                  null,
                  [],
                )}
              >
                Record audit appeal packet {escalation.owner} {escalation.sourceType}
              </Button>
            )}
            {quorumRequired && latestCorrectiveAfterDispute && independentReviewerCount >= 2 && (
              <Button
                type="button"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  "quorum-cleared",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  latestCorrectiveAfterDispute.id,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  escalation.newBreachedResolutionIds,
                  [],
                  null,
                  0,
                  null,
                  null,
                  null,
                  [],
                )}
              >
                Clear audit appeal quorum {escalation.owner} {escalation.sourceType}
              </Button>
            )}
            {clearanceStale && latestQuorumClearedAppeal && !staleClearancePacket && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] text-orange-900 dark:text-orange-100"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  "clearance-stale",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  latestCorrectiveAfterDispute?.id ?? null,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  clearanceBaselineReceiptIds,
                  reopenedAfterClearanceReceiptIds,
                  latestQuorumClearedAppeal.id,
                  staleClearanceAgeDays,
                  null,
                  null,
                  null,
                  [],
                )}
              >
                Record stale clearance appeal packet {escalation.owner} {escalation.sourceType}
              </Button>
            )}
            {fragileGovernanceRequired && latestQuorumClearedAppeal && staleClearancePacket && correctiveAfterStalePacket && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] text-red-900 dark:text-red-100"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  "fragile-governance",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  correctiveAfterStalePacket.id,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  escalation.newBreachedResolutionIds,
                  reopenedAfterClearanceReceiptIds,
                  latestQuorumClearedAppeal.id,
                  staleClearanceAgeDays,
                  appealDraft.fragileRemediationOwner,
                  appealDraft.fragileEscalationArtifact,
                  appealDraft.reviewerRotationProof,
                  splitReviewerIdentities(appealDraft.rotatedReviewerIdentity),
                )}
              >
                Record fragile clearance governance packet {escalation.owner} {escalation.sourceType}
              </Button>
            )}
            {staleGovernanceAcknowledgementRequired && latestQuorumClearedAppeal && latestAcceptedFragileGovernancePacket && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] text-red-900 dark:text-red-100"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  "fragile-governance-stale",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  correctiveAfterStalePacket?.id ?? null,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  clearanceBaselineReceiptIds,
                  reopenedAfterClearanceReceiptIds,
                  latestQuorumClearedAppeal.id,
                  staleClearanceAgeDays,
                  null,
                  null,
                  null,
                  [],
                  {
                    priorFragileGovernanceAppealId: latestAcceptedFragileGovernancePacket.id,
                    governanceBaselineReceiptIds,
                    reopenedAfterGovernanceReceiptIds,
                    staleGovernanceAgeDays,
                    staleGovernanceReason: staleGovernanceReason ?? "new-breach-after-governance",
                  },
                )}
              >
                Record stale fragile governance packet {escalation.owner} {escalation.sourceType}
              </Button>
            )}
            {governanceRevocationStaleRequired && latestQuorumClearedAppeal && latestGovernanceRevocationPacket && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] text-red-900 dark:text-red-100"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  "fragile-governance-revocation-stale",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  correctiveAfterStalePacket?.id ?? null,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  clearanceBaselineReceiptIds,
                  reopenedAfterClearanceReceiptIds,
                  latestQuorumClearedAppeal.id,
                  staleClearanceAgeDays,
                  null,
                  null,
                  null,
                  [],
                  {
                    priorFragileGovernanceAppealId: latestGovernanceRevocationPacket.revokedFragileGovernanceAppealId ?? null,
                    governanceBaselineReceiptIds,
                    reopenedAfterGovernanceReceiptIds,
                    staleGovernanceAgeDays,
                    staleGovernanceReason: staleGovernanceReason ?? "new-breach-after-governance",
                    priorGovernanceRevocationAppealId: latestGovernanceRevocationPacket.id,
                    staleGovernanceRevocationAgeDays,
                    staleGovernanceRevocationReason: "aged-without-fresh-governance",
                  },
                )}
              >
                Record stale governance council revocation packet {escalation.owner} {escalation.sourceType}
              </Button>
            )}
            {governanceRevocationRequired && latestQuorumClearedAppeal && latestAcceptedFragileGovernancePacket && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] text-red-900 dark:text-red-100"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  "fragile-governance-revoked",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  correctiveAfterStalePacket?.id ?? null,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  clearanceBaselineReceiptIds,
                  reopenedAfterClearanceReceiptIds,
                  latestQuorumClearedAppeal.id,
                  staleClearanceAgeDays,
                  appealDraft.fragileRemediationOwner,
                  appealDraft.fragileEscalationArtifact,
                  appealDraft.reviewerRotationProof,
                  splitReviewerIdentities(appealDraft.rotatedReviewerIdentity),
                  {
                    priorFragileGovernanceAppealId: latestAcceptedFragileGovernancePacket.id,
                    governanceBaselineReceiptIds,
                    reopenedAfterGovernanceReceiptIds,
                    staleGovernanceAgeDays,
                    staleGovernanceReason: staleGovernanceReason ?? "new-breach-after-governance",
                    revokedGovernanceStaleAppealIds: staleGovernancePackets.map((appeal) => appeal.id),
                  },
                )}
              >
                Record fragile governance revocation packet {escalation.owner} {escalation.sourceType}
              </Button>
            )}
            {clearanceStale && latestQuorumClearedAppeal && staleClearancePacket && correctiveAfterStalePacket && independentReviewerCount >= 2 && fragileGovernanceCleared && (
              <Button
                type="button"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => onRecordAppeal(
                  escalation,
                  latestClosure,
                  latestDispute,
                  "quorum-cleared",
                  staleDisputeAgeDays,
                  reviewerQuorumCount,
                  independentReviewerCount,
                  correctiveAfterStalePacket.id,
                  conflictingReviewIds,
                  reviewerIdentities,
                  appealDraft.appealSummary,
                  appealDraft.appealArtifact,
                  escalation.newBreachedResolutionIds,
                  reopenedAfterClearanceReceiptIds,
                  latestQuorumClearedAppeal.id,
                  staleClearanceAgeDays,
                  null,
                  null,
                  null,
                  [],
                )}
              >
                Re-clear audit appeal quorum {escalation.owner} {escalation.sourceType}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
