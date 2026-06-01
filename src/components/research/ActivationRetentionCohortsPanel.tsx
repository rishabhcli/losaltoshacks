import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureActivationCohortCandidate,
  type VentureActivationCohortRecord,
} from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatRate(numerator: number, denominator: number) {
  if (denominator <= 0) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

export function ActivationRetentionCohortsPanel({
  activationCohortCount,
  activationCohortCandidateCount,
  latestActivationCohort,
  firstActivationCohortCandidate,
  cohortLabelDraft,
  cohortOwnerDraft,
  cohortChannelDraft,
  cohortSignupDraft,
  cohortActivatedDraft,
  cohortRetainedDraft,
  cohortPaidDraft,
  cohortRevenueDraft,
  cohortSupportIssueDraft,
  cohortActivationEventDraft,
  cohortRetentionWindowDraft,
  cohortEvidenceDraft,
  cohortLearningDraft,
  cohortNextActionDraft,
  canSaveActivationCohort,
  onCohortLabelDraftChange,
  onCohortOwnerDraftChange,
  onCohortChannelDraftChange,
  onCohortSignupDraftChange,
  onCohortActivatedDraftChange,
  onCohortRetainedDraftChange,
  onCohortPaidDraftChange,
  onCohortRevenueDraftChange,
  onCohortSupportIssueDraftChange,
  onCohortActivationEventDraftChange,
  onCohortRetentionWindowDraftChange,
  onCohortEvidenceDraftChange,
  onCohortLearningDraftChange,
  onCohortNextActionDraftChange,
  onSaveActivationCohort,
}: {
  activationCohortCount: number;
  activationCohortCandidateCount: number;
  latestActivationCohort?: VentureActivationCohortRecord;
  firstActivationCohortCandidate?: VentureActivationCohortCandidate;
  cohortLabelDraft: string;
  cohortOwnerDraft: string;
  cohortChannelDraft: string;
  cohortSignupDraft: string;
  cohortActivatedDraft: string;
  cohortRetainedDraft: string;
  cohortPaidDraft: string;
  cohortRevenueDraft: string;
  cohortSupportIssueDraft: string;
  cohortActivationEventDraft: string;
  cohortRetentionWindowDraft: string;
  cohortEvidenceDraft: string;
  cohortLearningDraft: string;
  cohortNextActionDraft: string;
  canSaveActivationCohort: boolean;
  onCohortLabelDraftChange: (value: string) => void;
  onCohortOwnerDraftChange: (value: string) => void;
  onCohortChannelDraftChange: (value: string) => void;
  onCohortSignupDraftChange: (value: string) => void;
  onCohortActivatedDraftChange: (value: string) => void;
  onCohortRetainedDraftChange: (value: string) => void;
  onCohortPaidDraftChange: (value: string) => void;
  onCohortRevenueDraftChange: (value: string) => void;
  onCohortSupportIssueDraftChange: (value: string) => void;
  onCohortActivationEventDraftChange: (value: string) => void;
  onCohortRetentionWindowDraftChange: (value: string) => void;
  onCohortEvidenceDraftChange: (value: string) => void;
  onCohortLearningDraftChange: (value: string) => void;
  onCohortNextActionDraftChange: (value: string) => void;
  onSaveActivationCohort: () => void;
}) {
  return (
    <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Activity className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
        <h3 className="text-xs font-semibold text-cyan-900 dark:text-cyan-100">Activation and retention cohorts</h3>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          {activationCohortCount} cohort{activationCohortCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          {activationCohortCandidateCount} inbox signal{activationCohortCandidateCount === 1 ? "" : "s"}
        </Badge>
      </div>
      {latestActivationCohort ? (
        <div className="mt-2 rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Latest activation cohort</span>
            <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
              {latestActivationCohort.sourceType}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Activation {formatRate(latestActivationCohort.activatedCount, latestActivationCohort.signupCount)}
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              Retention {formatRate(latestActivationCohort.retainedCount, latestActivationCohort.activatedCount)}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestActivationCohort.cohortLabel}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {latestActivationCohort.signupCount} signups, {latestActivationCohort.activatedCount} activated, {latestActivationCohort.retainedCount} retained, {latestActivationCohort.paidCount} paid
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestActivationCohort.owner}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Channel: {latestActivationCohort.acquisitionChannel}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Activation event: {latestActivationCohort.activationEvent}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Retention window: {latestActivationCohort.retentionWindow}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Revenue: {formatMoney(latestActivationCohort.revenueCents)}; support issues: {latestActivationCohort.supportIssueCount}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Evidence: {latestActivationCohort.evidence}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Learning: {latestActivationCohort.learning}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestActivationCohort.nextAction}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-cyan-800/70 dark:text-cyan-200/70">
          No activation or retention cohort has been recorded yet.
        </p>
      )}
      {firstActivationCohortCandidate && (
        <div className="mt-2 rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Activation cohort candidate</span>
            <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
              {firstActivationCohortCandidate.sourceType}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstActivationCohortCandidate.cohortLabel}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Suggested: {firstActivationCohortCandidate.signupCount} signups, {firstActivationCohortCandidate.activatedCount} activated, {firstActivationCohortCandidate.retainedCount} retained, {firstActivationCohortCandidate.supportIssueCount} support issues
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{firstActivationCohortCandidate.learning}</p>
        </div>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <Input value={cohortLabelDraft} onChange={(event) => onCohortLabelDraftChange(event.target.value)} placeholder="Cohort label" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={cohortOwnerDraft} onChange={(event) => onCohortOwnerDraftChange(event.target.value)} placeholder="Cohort owner" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={cohortChannelDraft} onChange={(event) => onCohortChannelDraftChange(event.target.value)} placeholder="Acquisition channel" className="bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-6">
        <Input value={cohortSignupDraft} onChange={(event) => onCohortSignupDraftChange(event.target.value)} placeholder="Signups" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={cohortActivatedDraft} onChange={(event) => onCohortActivatedDraftChange(event.target.value)} placeholder="Activated" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={cohortRetainedDraft} onChange={(event) => onCohortRetainedDraftChange(event.target.value)} placeholder="Retained" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={cohortPaidDraft} onChange={(event) => onCohortPaidDraftChange(event.target.value)} placeholder="Paid users" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={cohortRevenueDraft} onChange={(event) => onCohortRevenueDraftChange(event.target.value)} placeholder="Cohort revenue" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={cohortSupportIssueDraft} onChange={(event) => onCohortSupportIssueDraftChange(event.target.value)} placeholder="Support issues" className="bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea value={cohortActivationEventDraft} onChange={(event) => onCohortActivationEventDraftChange(event.target.value)} placeholder="Activation event" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={cohortRetentionWindowDraft} onChange={(event) => onCohortRetentionWindowDraftChange(event.target.value)} placeholder="Retention window" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={cohortEvidenceDraft} onChange={(event) => onCohortEvidenceDraftChange(event.target.value)} placeholder="Cohort evidence" className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={cohortLearningDraft} onChange={(event) => onCohortLearningDraftChange(event.target.value)} placeholder="Cohort learning" className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <Textarea
        value={cohortNextActionDraft}
        onChange={(event) => onCohortNextActionDraftChange(event.target.value)}
        placeholder="Cohort next action"
        className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
      />
      <Button
        type="button"
        size="sm"
        onClick={onSaveActivationCohort}
        disabled={!canSaveActivationCohort}
        className="mt-2 h-8 self-start bg-cyan-700 text-xs text-white hover:bg-cyan-800"
      >
        Save activation cohort
      </Button>
    </div>
  );
}
