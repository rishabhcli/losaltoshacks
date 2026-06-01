import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  VENTURE_ROADMAP_PRIORITY_OPTIONS,
  VENTURE_ROADMAP_STATUS_OPTIONS,
  type VentureRoadmapTaskCandidate,
  type VentureRoadmapTaskPriority,
  type VentureRoadmapTaskRecord,
  type VentureRoadmapTaskStatus,
} from "@/lib/venture-portfolio";

function roadmapPriorityBadge(priority: VentureRoadmapTaskPriority) {
  if (priority === "high") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (priority === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function roadmapStatusBadge(status: VentureRoadmapTaskStatus) {
  if (status === "done") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "in-progress") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "dismissed") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function roadmapStatusLabel(status: VentureRoadmapTaskStatus) {
  return VENTURE_ROADMAP_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function RoadmapSupportQueuePanel({
  roadmapTaskCount,
  roadmapCandidateCount,
  latestRoadmapTask,
  firstRoadmapCandidate,
  roadmapTitleDraft,
  roadmapOwnerDraft,
  roadmapPriority,
  roadmapStatus,
  roadmapDetailDraft,
  roadmapSupportDraft,
  roadmapRiskDraft,
  roadmapNextActionDraft,
  canSaveRoadmapTask,
  onRoadmapTitleDraftChange,
  onRoadmapOwnerDraftChange,
  onRoadmapPriorityChange,
  onRoadmapStatusChange,
  onRoadmapDetailDraftChange,
  onRoadmapSupportDraftChange,
  onRoadmapRiskDraftChange,
  onRoadmapNextActionDraftChange,
  onSaveRoadmapTask,
}: {
  roadmapTaskCount: number;
  roadmapCandidateCount: number;
  latestRoadmapTask?: VentureRoadmapTaskRecord;
  firstRoadmapCandidate?: VentureRoadmapTaskCandidate;
  roadmapTitleDraft: string;
  roadmapOwnerDraft: string;
  roadmapPriority: VentureRoadmapTaskPriority;
  roadmapStatus: VentureRoadmapTaskStatus;
  roadmapDetailDraft: string;
  roadmapSupportDraft: string;
  roadmapRiskDraft: string;
  roadmapNextActionDraft: string;
  canSaveRoadmapTask: boolean;
  onRoadmapTitleDraftChange: (value: string) => void;
  onRoadmapOwnerDraftChange: (value: string) => void;
  onRoadmapPriorityChange: (value: VentureRoadmapTaskPriority) => void;
  onRoadmapStatusChange: (value: VentureRoadmapTaskStatus) => void;
  onRoadmapDetailDraftChange: (value: string) => void;
  onRoadmapSupportDraftChange: (value: string) => void;
  onRoadmapRiskDraftChange: (value: string) => void;
  onRoadmapNextActionDraftChange: (value: string) => void;
  onSaveRoadmapTask: () => void;
}) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3 dark:border-rose-900/70 dark:bg-rose-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardList className="h-4 w-4 text-rose-700 dark:text-rose-300" />
        <h3 className="text-xs font-semibold text-rose-900 dark:text-rose-100">Roadmap and support queue</h3>
        <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
          {roadmapTaskCount} task{roadmapTaskCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
          {roadmapCandidateCount} inbox signal{roadmapCandidateCount === 1 ? "" : "s"}
        </Badge>
      </div>
      {latestRoadmapTask ? (
        <div className="mt-2 rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Latest roadmap task</span>
            <Badge variant="secondary" className={roadmapPriorityBadge(latestRoadmapTask.priority)}>
              {latestRoadmapTask.priority}
            </Badge>
            <Badge variant="secondary" className={roadmapStatusBadge(latestRoadmapTask.status)}>
              {roadmapStatusLabel(latestRoadmapTask.status)}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestRoadmapTask.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestRoadmapTask.detail}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestRoadmapTask.owner}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Support load: {latestRoadmapTask.supportLoad}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Risk reduction: {latestRoadmapTask.riskReduction}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestRoadmapTask.nextAction}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-rose-800/70 dark:text-rose-200/70">
          No roadmap task has been recorded yet.
        </p>
      )}
      {firstRoadmapCandidate && (
        <div className="mt-2 rounded-md border border-rose-200 bg-white/75 p-2 dark:border-rose-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200">Roadmap inbox candidate</span>
            <Badge variant="secondary" className={roadmapPriorityBadge(firstRoadmapCandidate.suggestedPriority)}>
              {firstRoadmapCandidate.suggestedPriority}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-rose-800 dark:bg-slate-950/70 dark:text-rose-200">
              {firstRoadmapCandidate.sourceType}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstRoadmapCandidate.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{firstRoadmapCandidate.detail}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{firstRoadmapCandidate.nextAction}</p>
        </div>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_150px_150px]">
        <Input
          value={roadmapTitleDraft}
          onChange={(event) => onRoadmapTitleDraftChange(event.target.value)}
          placeholder="Roadmap task title"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Input
          value={roadmapOwnerDraft}
          onChange={(event) => onRoadmapOwnerDraftChange(event.target.value)}
          placeholder="Roadmap owner"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Select value={roadmapPriority} onValueChange={(value) => onRoadmapPriorityChange(value as VentureRoadmapTaskPriority)}>
          <SelectTrigger
            aria-label="Roadmap priority"
            size="sm"
            className="w-full border-rose-200 bg-white/80 text-xs dark:border-rose-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_ROADMAP_PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roadmapStatus} onValueChange={(value) => onRoadmapStatusChange(value as VentureRoadmapTaskStatus)}>
          <SelectTrigger
            aria-label="Roadmap status"
            size="sm"
            className="w-full border-rose-200 bg-white/80 text-xs dark:border-rose-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_ROADMAP_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={roadmapDetailDraft}
        onChange={(event) => onRoadmapDetailDraftChange(event.target.value)}
        placeholder="Roadmap task detail"
        className="mt-2 min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
      />
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <Textarea
          value={roadmapSupportDraft}
          onChange={(event) => onRoadmapSupportDraftChange(event.target.value)}
          placeholder="Support-load note"
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={roadmapRiskDraft}
          onChange={(event) => onRoadmapRiskDraftChange(event.target.value)}
          placeholder="Risk-reduction note"
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={roadmapNextActionDraft}
          onChange={(event) => onRoadmapNextActionDraftChange(event.target.value)}
          placeholder="Roadmap next action"
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onSaveRoadmapTask}
        disabled={!canSaveRoadmapTask}
        className="mt-2 h-8 self-start bg-rose-700 text-xs text-white hover:bg-rose-800"
      >
        Save roadmap task
      </Button>
    </div>
  );
}
