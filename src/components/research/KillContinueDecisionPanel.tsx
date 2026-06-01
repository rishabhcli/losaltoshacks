import { GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  VENTURE_DECISION_OPTIONS,
  VENTURE_LIFECYCLE_OPTIONS,
  type VentureDecisionRecord,
  type VentureDecisionType,
  type VentureLifecycleStatus,
} from "@/lib/venture-portfolio";

function lifecycleLabel(status: VentureLifecycleStatus) {
  return VENTURE_LIFECYCLE_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function decisionLabel(decision: VentureDecisionType) {
  return VENTURE_DECISION_OPTIONS.find((option) => option.value === decision)?.label ?? decision;
}

export function KillContinueDecisionPanel({
  decisionType,
  nextLifecycleStatus,
  rationaleDraft,
  nextActionDraft,
  canSaveDecision,
  latestDecision,
  onDecisionTypeChange,
  onNextLifecycleStatusChange,
  onRationaleDraftChange,
  onNextActionDraftChange,
  onSaveDecision,
}: {
  decisionType: VentureDecisionType;
  nextLifecycleStatus: VentureLifecycleStatus;
  rationaleDraft: string;
  nextActionDraft: string;
  canSaveDecision: boolean;
  latestDecision?: VentureDecisionRecord;
  onDecisionTypeChange: (value: VentureDecisionType) => void;
  onNextLifecycleStatusChange: (value: VentureLifecycleStatus) => void;
  onRationaleDraftChange: (value: string) => void;
  onNextActionDraftChange: (value: string) => void;
  onSaveDecision: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/70 dark:bg-emerald-950/20">
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Kill/continue decision</h3>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-200/70">Decision</span>
          <Select value={decisionType} onValueChange={(value) => onDecisionTypeChange(value as VentureDecisionType)}>
            <SelectTrigger
              aria-label="Decision"
              size="sm"
              className="w-full border-emerald-200 bg-white/80 text-xs dark:border-emerald-900/70 dark:bg-slate-950/70"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VENTURE_DECISION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-200/70">Next lifecycle</span>
          <Select value={nextLifecycleStatus} onValueChange={(value) => onNextLifecycleStatusChange(value as VentureLifecycleStatus)}>
            <SelectTrigger
              aria-label="Next lifecycle"
              size="sm"
              className="w-full border-emerald-200 bg-white/80 text-xs dark:border-emerald-900/70 dark:bg-slate-950/70"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VENTURE_LIFECYCLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea
          value={rationaleDraft}
          onChange={(event) => onRationaleDraftChange(event.target.value)}
          placeholder="Record kill/continue rationale..."
          className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={nextActionDraft}
          onChange={(event) => onNextActionDraftChange(event.target.value)}
          placeholder="Define next decision action..."
          className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onSaveDecision}
        disabled={!canSaveDecision}
        className="h-8 self-start bg-emerald-700 text-xs hover:bg-emerald-800"
      >
        Save decision
      </Button>
      {latestDecision ? (
        <div className="rounded-md border border-emerald-200 bg-white/75 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">Decision history</div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
            {decisionLabel(latestDecision.decision)}: {lifecycleLabel(latestDecision.previousLifecycleStatus)} -&gt; {lifecycleLabel(latestDecision.nextLifecycleStatus)}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{latestDecision.rationale}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestDecision.nextAction}</p>
        </div>
      ) : (
        <p className="text-[11px] leading-relaxed text-emerald-800/70 dark:text-emerald-200/70">
          No kill/continue decision has been recorded yet.
        </p>
      )}
    </div>
  );
}
