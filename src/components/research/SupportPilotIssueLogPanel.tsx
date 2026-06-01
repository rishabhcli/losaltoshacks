import { LifeBuoy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  VENTURE_SUPPORT_ISSUE_SEVERITY_OPTIONS,
  VENTURE_SUPPORT_ISSUE_STATUS_OPTIONS,
  VENTURE_SUPPORT_ISSUE_TYPE_OPTIONS,
  type VentureSupportIssueCandidate,
  type VentureSupportIssueRecord,
  type VentureSupportIssueSeverity,
  type VentureSupportIssueStatus,
  type VentureSupportIssueType,
} from "@/lib/venture-portfolio";

function supportIssueSeverityBadge(severity: VentureSupportIssueSeverity) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function supportIssueStatusBadge(status: VentureSupportIssueStatus) {
  if (status === "resolved") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "in-progress") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "dismissed") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  if (status === "triaged") return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function supportIssueStatusLabel(status: VentureSupportIssueStatus) {
  return VENTURE_SUPPORT_ISSUE_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function supportIssueTypeLabel(type: VentureSupportIssueType) {
  return VENTURE_SUPPORT_ISSUE_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export function SupportPilotIssueLogPanel({
  supportIssueCount,
  supportIssueCandidateCount,
  latestSupportIssue,
  firstSupportIssueCandidate,
  supportIssueType,
  supportIssueSeverity,
  supportIssueStatus,
  supportTitleDraft,
  supportOwnerDraft,
  supportDetailDraft,
  supportImpactDraft,
  supportLoadDraft,
  supportRetentionDraft,
  supportResolutionDraft,
  supportNextActionDraft,
  canSaveSupportIssue,
  onSupportIssueTypeChange,
  onSupportIssueSeverityChange,
  onSupportIssueStatusChange,
  onSupportTitleDraftChange,
  onSupportOwnerDraftChange,
  onSupportDetailDraftChange,
  onSupportImpactDraftChange,
  onSupportLoadDraftChange,
  onSupportRetentionDraftChange,
  onSupportResolutionDraftChange,
  onSupportNextActionDraftChange,
  onSaveSupportIssue,
}: {
  supportIssueCount: number;
  supportIssueCandidateCount: number;
  latestSupportIssue?: VentureSupportIssueRecord;
  firstSupportIssueCandidate?: VentureSupportIssueCandidate;
  supportIssueType: VentureSupportIssueType;
  supportIssueSeverity: VentureSupportIssueSeverity;
  supportIssueStatus: VentureSupportIssueStatus;
  supportTitleDraft: string;
  supportOwnerDraft: string;
  supportDetailDraft: string;
  supportImpactDraft: string;
  supportLoadDraft: string;
  supportRetentionDraft: string;
  supportResolutionDraft: string;
  supportNextActionDraft: string;
  canSaveSupportIssue: boolean;
  onSupportIssueTypeChange: (value: VentureSupportIssueType) => void;
  onSupportIssueSeverityChange: (value: VentureSupportIssueSeverity) => void;
  onSupportIssueStatusChange: (value: VentureSupportIssueStatus) => void;
  onSupportTitleDraftChange: (value: string) => void;
  onSupportOwnerDraftChange: (value: string) => void;
  onSupportDetailDraftChange: (value: string) => void;
  onSupportImpactDraftChange: (value: string) => void;
  onSupportLoadDraftChange: (value: string) => void;
  onSupportRetentionDraftChange: (value: string) => void;
  onSupportResolutionDraftChange: (value: string) => void;
  onSupportNextActionDraftChange: (value: string) => void;
  onSaveSupportIssue: () => void;
}) {
  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900/70 dark:bg-indigo-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <LifeBuoy className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
        <h3 className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">Support and pilot issue log</h3>
        <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
          {supportIssueCount} issue{supportIssueCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
          {supportIssueCandidateCount} inbox signal{supportIssueCandidateCount === 1 ? "" : "s"}
        </Badge>
      </div>
      {latestSupportIssue ? (
        <div className="mt-2 rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Latest support issue</span>
            <Badge variant="secondary" className={supportIssueSeverityBadge(latestSupportIssue.severity)}>
              {latestSupportIssue.severity}
            </Badge>
            <Badge variant="secondary" className={supportIssueStatusBadge(latestSupportIssue.status)}>
              {supportIssueStatusLabel(latestSupportIssue.status)}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
              {supportIssueTypeLabel(latestSupportIssue.issueType)}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestSupportIssue.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestSupportIssue.detail}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestSupportIssue.owner}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Customer impact: {latestSupportIssue.customerImpact}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Support load: {latestSupportIssue.supportLoad}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Retention risk: {latestSupportIssue.retentionRisk}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Resolution: {latestSupportIssue.resolution}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestSupportIssue.nextAction}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-indigo-800/70 dark:text-indigo-200/70">
          No support or pilot issue has been recorded yet.
        </p>
      )}
      {firstSupportIssueCandidate && (
        <div className="mt-2 rounded-md border border-indigo-200 bg-white/75 p-2 dark:border-indigo-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">Support inbox candidate</span>
            <Badge variant="secondary" className={supportIssueSeverityBadge(firstSupportIssueCandidate.suggestedSeverity)}>
              {firstSupportIssueCandidate.suggestedSeverity}
            </Badge>
            <Badge variant="secondary" className={supportIssueStatusBadge(firstSupportIssueCandidate.suggestedStatus)}>
              {supportIssueStatusLabel(firstSupportIssueCandidate.suggestedStatus)}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
              {supportIssueTypeLabel(firstSupportIssueCandidate.issueType)}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstSupportIssueCandidate.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{firstSupportIssueCandidate.detail}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Support load: {firstSupportIssueCandidate.supportLoad}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Retention risk: {firstSupportIssueCandidate.retentionRisk}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{firstSupportIssueCandidate.nextAction}</p>
        </div>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_160px_150px_150px]">
        <Input
          value={supportTitleDraft}
          onChange={(event) => onSupportTitleDraftChange(event.target.value)}
          placeholder="Support issue title"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Input
          value={supportOwnerDraft}
          onChange={(event) => onSupportOwnerDraftChange(event.target.value)}
          placeholder="Support owner"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Select
          value={firstSupportIssueCandidate?.issueType ?? supportIssueType}
          onValueChange={(value) => onSupportIssueTypeChange(value as VentureSupportIssueType)}
        >
          <SelectTrigger
            aria-label="Support issue type"
            size="sm"
            className="w-full border-indigo-200 bg-white/80 text-xs dark:border-indigo-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_SUPPORT_ISSUE_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={supportIssueSeverity} onValueChange={(value) => onSupportIssueSeverityChange(value as VentureSupportIssueSeverity)}>
          <SelectTrigger
            aria-label="Support severity"
            size="sm"
            className="w-full border-indigo-200 bg-white/80 text-xs dark:border-indigo-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_SUPPORT_ISSUE_SEVERITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={supportIssueStatus} onValueChange={(value) => onSupportIssueStatusChange(value as VentureSupportIssueStatus)}>
          <SelectTrigger
            aria-label="Support status"
            size="sm"
            className="w-full border-indigo-200 bg-white/80 text-xs dark:border-indigo-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_SUPPORT_ISSUE_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={supportDetailDraft}
        onChange={(event) => onSupportDetailDraftChange(event.target.value)}
        placeholder="Support issue detail"
        className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
      />
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea
          value={supportImpactDraft}
          onChange={(event) => onSupportImpactDraftChange(event.target.value)}
          placeholder="Customer impact"
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={supportLoadDraft}
          onChange={(event) => onSupportLoadDraftChange(event.target.value)}
          placeholder="Support-load evidence"
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={supportRetentionDraft}
          onChange={(event) => onSupportRetentionDraftChange(event.target.value)}
          placeholder="Retention-risk evidence"
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={supportResolutionDraft}
          onChange={(event) => onSupportResolutionDraftChange(event.target.value)}
          placeholder="Support resolution evidence"
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <Textarea
        value={supportNextActionDraft}
        onChange={(event) => onSupportNextActionDraftChange(event.target.value)}
        placeholder="Support next action"
        className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
      />
      <Button
        type="button"
        size="sm"
        onClick={onSaveSupportIssue}
        disabled={!canSaveSupportIssue}
        className="mt-2 h-8 self-start bg-indigo-700 text-xs text-white hover:bg-indigo-800"
      >
        Save support issue
      </Button>
    </div>
  );
}
