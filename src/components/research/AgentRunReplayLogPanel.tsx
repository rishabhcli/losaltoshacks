import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureAgentRunCandidate,
  type VentureAgentRunRecord,
  type VentureAgentRunStatus,
} from "@/lib/venture-portfolio";

function agentRunStatusBadge(status: VentureAgentRunStatus) {
  if (status === "executed" || status === "replayed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "prompt-ready") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

export function AgentRunReplayLogPanel({
  agentRunCount,
  agentRunCandidateCount,
  latestAgentRun,
  firstAgentRunCandidate,
  agentModelDraft,
  agentOwnerDraft,
  agentPromptDraft,
  agentOutputDraft,
  agentEvidenceDraft,
  agentToolsDraft,
  agentReplayDraft,
  agentRiskDraft,
  agentNextActionDraft,
  canSaveAgentRun,
  onAgentModelDraftChange,
  onAgentOwnerDraftChange,
  onAgentPromptDraftChange,
  onAgentOutputDraftChange,
  onAgentEvidenceDraftChange,
  onAgentToolsDraftChange,
  onAgentReplayDraftChange,
  onAgentRiskDraftChange,
  onAgentNextActionDraftChange,
  onSaveAgentRun,
}: {
  agentRunCount: number;
  agentRunCandidateCount: number;
  latestAgentRun?: VentureAgentRunRecord;
  firstAgentRunCandidate?: VentureAgentRunCandidate;
  agentModelDraft: string;
  agentOwnerDraft: string;
  agentPromptDraft: string;
  agentOutputDraft: string;
  agentEvidenceDraft: string;
  agentToolsDraft: string;
  agentReplayDraft: string;
  agentRiskDraft: string;
  agentNextActionDraft: string;
  canSaveAgentRun: boolean;
  onAgentModelDraftChange: (value: string) => void;
  onAgentOwnerDraftChange: (value: string) => void;
  onAgentPromptDraftChange: (value: string) => void;
  onAgentOutputDraftChange: (value: string) => void;
  onAgentEvidenceDraftChange: (value: string) => void;
  onAgentToolsDraftChange: (value: string) => void;
  onAgentReplayDraftChange: (value: string) => void;
  onAgentRiskDraftChange: (value: string) => void;
  onAgentNextActionDraftChange: (value: string) => void;
  onSaveAgentRun: () => void;
}) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900/70 dark:bg-blue-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Bot className="h-4 w-4 text-blue-700 dark:text-blue-300" />
        <h3 className="text-xs font-semibold text-blue-900 dark:text-blue-100">Agent run replay log</h3>
        <Badge variant="secondary" className="bg-white/80 text-blue-800 dark:bg-slate-950/70 dark:text-blue-200">
          {agentRunCount} run{agentRunCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-blue-800 dark:bg-slate-950/70 dark:text-blue-200">
          {agentRunCandidateCount} inbox signal{agentRunCandidateCount === 1 ? "" : "s"}
        </Badge>
      </div>
      {latestAgentRun ? (
        <div className="mt-2 rounded-md border border-blue-200 bg-white/75 p-2 dark:border-blue-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-200">Latest agent run</span>
            <Badge variant="secondary" className={agentRunStatusBadge(latestAgentRun.status)}>
              {latestAgentRun.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-blue-800 dark:bg-slate-950/70 dark:text-blue-200">
              {latestAgentRun.sourceType}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestAgentRun.model}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestAgentRun.outputSummary}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Replay: {latestAgentRun.replayCommand}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Tools: {latestAgentRun.toolCalls}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Tokens: {latestAgentRun.tokenEstimate}; owner: {latestAgentRun.owner}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestAgentRun.nextAction}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-blue-800/70 dark:text-blue-200/70">No agent run has been saved yet.</p>
      )}
      {firstAgentRunCandidate && (
        <div className="mt-2 rounded-md border border-blue-200 bg-white/75 p-2 dark:border-blue-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-200">Agent run candidate</span>
            <Badge variant="secondary" className={agentRunStatusBadge(firstAgentRunCandidate.status)}>
              {firstAgentRunCandidate.status}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-blue-800 dark:bg-slate-950/70 dark:text-blue-200">
              {firstAgentRunCandidate.sourceType}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstAgentRunCandidate.model}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Candidate is ready to save with {firstAgentRunCandidate.tokenEstimate} estimated tokens.
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Replay route is captured and will be attached when saved.
          </p>
        </div>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input value={agentModelDraft} onChange={(event) => onAgentModelDraftChange(event.target.value)} placeholder="Agent model" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={agentOwnerDraft} onChange={(event) => onAgentOwnerDraftChange(event.target.value)} placeholder="Agent run owner" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={agentPromptDraft} onChange={(event) => onAgentPromptDraftChange(event.target.value)} placeholder="Agent prompt" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={agentOutputDraft} onChange={(event) => onAgentOutputDraftChange(event.target.value)} placeholder="Agent output summary" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={agentEvidenceDraft} onChange={(event) => onAgentEvidenceDraftChange(event.target.value)} placeholder="Agent input evidence" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={agentToolsDraft} onChange={(event) => onAgentToolsDraftChange(event.target.value)} placeholder="Agent tool calls" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={agentReplayDraft} onChange={(event) => onAgentReplayDraftChange(event.target.value)} placeholder="Agent replay command" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={agentRiskDraft} onChange={(event) => onAgentRiskDraftChange(event.target.value)} placeholder="Agent run risk note" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <Textarea value={agentNextActionDraft} onChange={(event) => onAgentNextActionDraftChange(event.target.value)} placeholder="Agent run next action" className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      <Button type="button" size="sm" onClick={onSaveAgentRun} disabled={!canSaveAgentRun} className="mt-2 h-8 self-start bg-blue-700 text-xs text-white hover:bg-blue-800">
        Save agent run
      </Button>
    </div>
  );
}
