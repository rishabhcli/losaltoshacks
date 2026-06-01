import { KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureAutonomyAuditCandidate,
  type VentureAutonomyAuditRecord,
} from "@/lib/venture-portfolio";

export function AutonomyAuditLogPanel({
  autonomyAuditCount,
  autonomyAuditCandidateCount,
  readOnlyAutonomyCandidateCount,
  localCodeAutonomyCandidateCount,
  localTestAutonomyCandidateCount,
  latestAutonomyAudit,
  firstAutonomyAuditCandidate,
  auditActorDraft,
  auditRiskDraft,
  auditReplayDraft,
  auditEvidenceDraft,
  auditNextActionDraft,
  canSaveAutonomyAudit,
  onAuditActorDraftChange,
  onAuditRiskDraftChange,
  onAuditReplayDraftChange,
  onAuditEvidenceDraftChange,
  onAuditNextActionDraftChange,
  onSaveAutonomyAudit,
}: {
  autonomyAuditCount: number;
  autonomyAuditCandidateCount: number;
  readOnlyAutonomyCandidateCount: number;
  localCodeAutonomyCandidateCount: number;
  localTestAutonomyCandidateCount: number;
  latestAutonomyAudit?: VentureAutonomyAuditRecord;
  firstAutonomyAuditCandidate?: VentureAutonomyAuditCandidate;
  auditActorDraft: string;
  auditRiskDraft: string;
  auditReplayDraft: string;
  auditEvidenceDraft: string;
  auditNextActionDraft: string;
  canSaveAutonomyAudit: boolean;
  onAuditActorDraftChange: (value: string) => void;
  onAuditRiskDraftChange: (value: string) => void;
  onAuditReplayDraftChange: (value: string) => void;
  onAuditEvidenceDraftChange: (value: string) => void;
  onAuditNextActionDraftChange: (value: string) => void;
  onSaveAutonomyAudit: () => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex flex-wrap items-center gap-2">
        <KeyRound className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Autonomy audit log</h3>
        <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
          {autonomyAuditCount} audit{autonomyAuditCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
          {autonomyAuditCandidateCount} inbox signal{autonomyAuditCandidateCount === 1 ? "" : "s"}
        </Badge>
        {readOnlyAutonomyCandidateCount > 0 && (
          <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
            {readOnlyAutonomyCandidateCount} read-only research
          </Badge>
        )}
        {localCodeAutonomyCandidateCount > 0 && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {localCodeAutonomyCandidateCount} local code
          </Badge>
        )}
        {localTestAutonomyCandidateCount > 0 && (
          <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
            {localTestAutonomyCandidateCount} local tests
          </Badge>
        )}
      </div>
      {latestAutonomyAudit ? (
        <div className="mt-2 rounded-md border border-slate-200 bg-white/75 p-2 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Latest autonomy audit</div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestAutonomyAudit.actionType}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Approval: {latestAutonomyAudit.approvalLevel}; side effect: {latestAutonomyAudit.sideEffect}; status: {latestAutonomyAudit.status}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Actor: {latestAutonomyAudit.actor}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Replay: {latestAutonomyAudit.replayNote}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestAutonomyAudit.nextAction}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">No autonomy audit has been saved yet.</p>
      )}
      {firstAutonomyAuditCandidate && (
        <div className="mt-2 rounded-md border border-slate-200 bg-white/75 p-2 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Autonomy audit candidate</div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstAutonomyAuditCandidate.actionType}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Approval: {firstAutonomyAuditCandidate.approvalLevel}; side effect: {firstAutonomyAuditCandidate.sideEffect}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{firstAutonomyAuditCandidate.riskNote}</p>
        </div>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input value={auditActorDraft} onChange={(event) => onAuditActorDraftChange(event.target.value)} placeholder="Audit actor" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={auditRiskDraft} onChange={(event) => onAuditRiskDraftChange(event.target.value)} placeholder="Autonomy risk note" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={auditReplayDraft} onChange={(event) => onAuditReplayDraftChange(event.target.value)} placeholder="Replay note" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={auditEvidenceDraft} onChange={(event) => onAuditEvidenceDraftChange(event.target.value)} placeholder="Autonomy evidence" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <Textarea value={auditNextActionDraft} onChange={(event) => onAuditNextActionDraftChange(event.target.value)} placeholder="Autonomy next action" className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      <Button type="button" size="sm" onClick={onSaveAutonomyAudit} disabled={!canSaveAutonomyAudit} className="mt-2 h-8 self-start bg-slate-800 text-xs text-white hover:bg-slate-900">
        Save autonomy audit
      </Button>
    </div>
  );
}
