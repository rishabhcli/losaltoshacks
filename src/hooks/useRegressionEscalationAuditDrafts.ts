import { useState } from "react";
import type {
  BreachProcessRegressionEscalation,
  BreachProcessRegressionEscalationAuditAssignment,
  BreachProcessRegressionEscalationAuditAppealStatus,
  BreachProcessRegressionEscalationAuditClosure,
  BreachProcessRegressionEscalationAuditReview,
  BreachProcessRegressionEscalationAuditReviewOutcome,
} from "@/lib/breach-process-regression-escalations";

export type RegressionEscalationAuditDraft = {
  proofSummary: string;
  proofArtifact: string;
};

export type RegressionEscalationAuditReviewDraft = {
  reviewer: string;
  reviewSummary: string;
  reviewArtifact: string;
};

export type RegressionEscalationAuditAppealDraft = {
  appealSummary: string;
  appealArtifact: string;
  fragileRemediationOwner: string;
  fragileEscalationArtifact: string;
  reviewerRotationProof: string;
  rotatedReviewerIdentity: string;
};

export type RegressionEscalationAuditStaleGovernanceContext = {
  priorFragileGovernanceAppealId: string | null;
  governanceBaselineReceiptIds: string[];
  reopenedAfterGovernanceReceiptIds: string[];
  staleGovernanceAgeDays: number;
  staleGovernanceReason: "aged-without-reclearance" | "new-breach-after-governance";
  revokedGovernanceStaleAppealIds?: string[];
  priorGovernanceRevocationAppealId?: string | null;
  staleGovernanceRevocationAgeDays?: number;
  staleGovernanceRevocationReason?: "aged-without-fresh-governance";
};

type UseRegressionEscalationAuditDraftsOptions = {
  onCloseRegressionEscalationAudit: (
    escalation: BreachProcessRegressionEscalation,
    assignment: BreachProcessRegressionEscalationAuditAssignment,
    proofSummary: string,
    proofArtifact: string,
  ) => boolean;
  onReviewRegressionEscalationAudit: (
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    outcome: BreachProcessRegressionEscalationAuditReviewOutcome,
    reviewer: string,
    reviewSummary: string,
    reviewArtifact: string,
  ) => boolean;
  onRecordRegressionEscalationAuditAppeal: (
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
};

export const EMPTY_REGRESSION_ESCALATION_AUDIT_DRAFT: RegressionEscalationAuditDraft = {
  proofSummary: "",
  proofArtifact: "",
};

export const EMPTY_REGRESSION_ESCALATION_AUDIT_REVIEW_DRAFT: RegressionEscalationAuditReviewDraft = {
  reviewer: "",
  reviewSummary: "",
  reviewArtifact: "",
};

export const EMPTY_REGRESSION_ESCALATION_AUDIT_APPEAL_DRAFT: RegressionEscalationAuditAppealDraft = {
  appealSummary: "",
  appealArtifact: "",
  fragileRemediationOwner: "",
  fragileEscalationArtifact: "",
  reviewerRotationProof: "",
  rotatedReviewerIdentity: "",
};

export function useRegressionEscalationAuditDrafts({
  onCloseRegressionEscalationAudit,
  onReviewRegressionEscalationAudit,
  onRecordRegressionEscalationAuditAppeal,
}: UseRegressionEscalationAuditDraftsOptions) {
  const [regressionEscalationAuditDrafts, setRegressionEscalationAuditDrafts] = useState<Record<string, RegressionEscalationAuditDraft>>({});
  const [regressionEscalationAuditReviewDrafts, setRegressionEscalationAuditReviewDrafts] = useState<Record<string, RegressionEscalationAuditReviewDraft>>({});
  const [regressionEscalationAuditAppealDrafts, setRegressionEscalationAuditAppealDrafts] = useState<Record<string, RegressionEscalationAuditAppealDraft>>({});

  const updateRegressionEscalationAuditDraft = (
    escalationId: string,
    patch: Partial<RegressionEscalationAuditDraft>,
  ) => {
    setRegressionEscalationAuditDrafts((current) => ({
      ...current,
      [escalationId]: {
        ...EMPTY_REGRESSION_ESCALATION_AUDIT_DRAFT,
        ...(current[escalationId] ?? {}),
        ...patch,
      },
    }));
  };

  const submitRegressionEscalationAuditClosure = (
    escalation: BreachProcessRegressionEscalation,
    assignment: BreachProcessRegressionEscalationAuditAssignment,
    proofSummary: string,
    proofArtifact: string,
  ) => {
    const saved = onCloseRegressionEscalationAudit(escalation, assignment, proofSummary, proofArtifact);
    if (saved) {
      setRegressionEscalationAuditDrafts((current) => {
        const next = { ...current };
        delete next[escalation.id];
        return next;
      });
    }
    return saved;
  };

  const updateRegressionEscalationAuditReviewDraft = (
    auditClosureId: string,
    patch: Partial<RegressionEscalationAuditReviewDraft>,
  ) => {
    setRegressionEscalationAuditReviewDrafts((current) => ({
      ...current,
      [auditClosureId]: {
        ...EMPTY_REGRESSION_ESCALATION_AUDIT_REVIEW_DRAFT,
        ...(current[auditClosureId] ?? {}),
        ...patch,
      },
    }));
  };

  const submitRegressionEscalationAuditReview = (
    escalation: BreachProcessRegressionEscalation,
    closure: BreachProcessRegressionEscalationAuditClosure,
    outcome: BreachProcessRegressionEscalationAuditReviewOutcome,
    reviewer: string,
    reviewSummary: string,
    reviewArtifact: string,
  ) => {
    const saved = onReviewRegressionEscalationAudit(escalation, closure, outcome, reviewer, reviewSummary, reviewArtifact);
    if (saved) {
      setRegressionEscalationAuditReviewDrafts((current) => {
        const next = { ...current };
        delete next[closure.id];
        return next;
      });
    }
    return saved;
  };

  const updateRegressionEscalationAuditAppealDraft = (
    auditClosureId: string,
    patch: Partial<RegressionEscalationAuditAppealDraft>,
  ) => {
    setRegressionEscalationAuditAppealDrafts((current) => ({
      ...current,
      [auditClosureId]: {
        ...EMPTY_REGRESSION_ESCALATION_AUDIT_APPEAL_DRAFT,
        ...(current[auditClosureId] ?? {}),
        ...patch,
      },
    }));
  };

  const submitRegressionEscalationAuditAppeal = (
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
  ) => {
    const saved = onRecordRegressionEscalationAuditAppeal(
      escalation,
      closure,
      latestDispute,
      status,
      staleDisputeAgeDays,
      reviewerQuorumCount,
      independentReviewerCount,
      latestCorrectiveReviewId,
      conflictingReviewIds,
      reviewerIdentities,
      appealSummary,
      appealArtifact,
      clearanceBaselineReceiptIds,
      reopenedAfterClearanceReceiptIds,
      priorClearanceAppealId,
      staleClearanceAgeDays,
      fragileRemediationOwner,
      fragileEscalationArtifact,
      reviewerRotationProof,
      rotatedReviewerIdentities,
      staleGovernanceContext,
    );
    if (saved) {
      setRegressionEscalationAuditAppealDrafts((current) => {
        const next = { ...current };
        delete next[closure.id];
        return next;
      });
    }
    return saved;
  };

  return {
    regressionEscalationAuditDrafts,
    regressionEscalationAuditReviewDrafts,
    regressionEscalationAuditAppealDrafts,
    updateRegressionEscalationAuditDraft,
    submitRegressionEscalationAuditClosure,
    updateRegressionEscalationAuditReviewDraft,
    submitRegressionEscalationAuditReview,
    updateRegressionEscalationAuditAppealDraft,
    submitRegressionEscalationAuditAppeal,
  };
}
