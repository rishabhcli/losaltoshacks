import { Activity, AlertTriangle, CheckCircle2, CircleAlert, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  isAgentActiveStatus,
  isAgentCompleteStatus,
  isAgentIssueStatus,
  type AgentData,
  type BusinessPlan,
  type DiscoveredContent,
} from "@/hooks/useAgentData";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

type MissionStatus = "queued" | "active" | "stopping" | "stopped" | "completed" | "error" | null;
type PhaseState = "waiting" | "active" | "complete" | "attention" | "blocked";

interface MissionTimelineProps {
  agents: AgentData[];
  discoveries: DiscoveredContent[];
  businessPlans: BusinessPlan[];
  missionPrompt: string;
  missionStatus: MissionStatus;
  finalOptions: FinalOptionsPayload | null;
}

interface TimelinePhase {
  id: string;
  label: string;
  state: PhaseState;
  detail: string;
}

const STATE_COPY: Record<PhaseState, string> = {
  waiting: "Waiting",
  active: "Active",
  complete: "Complete",
  attention: "Needs Review",
  blocked: "Blocked",
};

const STATE_CLASSES: Record<PhaseState, { badge: string; dot: string; border: string; background: string; text: string }> = {
  waiting: {
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    dot: "bg-slate-300 dark:bg-slate-700",
    border: "border-slate-200 dark:border-slate-800/80",
    background: "bg-white/70 dark:bg-slate-950/50",
    text: "text-slate-500 dark:text-slate-400",
  },
  active: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    dot: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-900/70",
    background: "bg-blue-50/60 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
  },
  complete: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-900/70",
    background: "bg-emerald-50/60 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  attention: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    dot: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-900/70",
    background: "bg-amber-50/60 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-300",
  },
  blocked: {
    badge: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    dot: "bg-red-500",
    border: "border-red-200 dark:border-red-900/70",
    background: "bg-red-50/60 dark:bg-red-950/20",
    text: "text-red-700 dark:text-red-300",
  },
};

function phaseIcon(state: PhaseState) {
  switch (state) {
    case "active":
      return Activity;
    case "complete":
      return CheckCircle2;
    case "attention":
      return AlertTriangle;
    case "blocked":
      return CircleAlert;
    default:
      return CircleDashed;
  }
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function buildTimeline({
  agents,
  discoveries,
  businessPlans,
  missionPrompt,
  missionStatus,
  finalOptions,
}: MissionTimelineProps) {
  const hasMission = Boolean(missionPrompt.trim() || missionStatus);
  const activeAgents = agents.filter((agent) => isAgentActiveStatus(agent.status)).length;
  const completeAgents = agents.filter((agent) => isAgentCompleteStatus(agent.status)).length;
  const issueAgents = agents.filter((agent) => isAgentIssueStatus(agent.status)).length;
  const finalPlan = businessPlans.find((plan) => plan.is_final) ?? businessPlans[0] ?? null;
  const missingPlatforms = finalOptions?.coverage?.missingPlatforms ?? [];
  const hasFinalPackage = Boolean(finalOptions);

  const phases: TimelinePhase[] = [
    {
      id: "intake",
      label: "Intake",
      state: hasMission ? "complete" : "waiting",
      detail: hasMission
        ? missionStatus === "queued"
          ? "Prompt accepted; worker pickup is pending."
          : "Prompt is attached to the current mission."
        : "No mission has been launched.",
    },
    {
      id: "source-coverage",
      label: "Source Coverage",
      state: !hasMission
        ? "waiting"
        : issueAgents > 0
          ? "attention"
          : activeAgents > 0
            ? "active"
            : discoveries.length > 0 || completeAgents > 0
              ? "complete"
              : "active",
      detail: !hasMission
        ? "Source agents are idle."
        : issueAgents > 0
          ? `${pluralize(discoveries.length, "source")} captured; ${pluralize(issueAgents, "agent")} need review.`
          : discoveries.length > 0
            ? `${pluralize(discoveries.length, "source")} captured across ${pluralize(Math.max(completeAgents, 1), "agent")}.`
            : "Agents are preparing source coverage.",
    },
    {
      id: "synthesis",
      label: "Synthesis",
      state: !hasMission
        ? "waiting"
        : finalPlan?.is_final
          ? "complete"
          : businessPlans.length > 0 || agents.some((agent) => agent.status === "synthesizing")
            ? "active"
            : missionStatus === "error"
              ? "blocked"
              : "waiting",
      detail: !hasMission
        ? "No strategy package yet."
        : finalPlan?.is_final
          ? `Business plan v${finalPlan.version} is final.`
          : businessPlans.length > 0
            ? `Business plan v${businessPlans[0].version} is in progress.`
            : missionStatus === "error"
              ? "Synthesis stopped before a final package."
              : "Waiting for enough evidence to synthesize.",
    },
    {
      id: "decision-package",
      label: "Decision Package",
      state: !hasMission
        ? "waiting"
        : hasFinalPackage && missingPlatforms.length === 0
          ? "complete"
          : hasFinalPackage
            ? "attention"
            : missionStatus === "error"
              ? "blocked"
              : "waiting",
      detail: !hasMission
        ? "No options have been generated."
        : hasFinalPackage && missingPlatforms.length === 0
          ? `${pluralize(finalOptions?.options.length ?? 0, "option")} ready with full coverage.`
          : hasFinalPackage
            ? `${pluralize(finalOptions?.options.length ?? 0, "option")} ready; waiting for ${missingPlatforms.join(", ")}.`
            : missionStatus === "error"
              ? "Decision package is blocked by the mission error."
              : "Waiting for final options.",
    },
    {
      id: "recovery",
      label: "Recovery",
      state: !hasMission
        ? "waiting"
        : missionStatus === "error"
          ? "blocked"
          : issueAgents > 0
            ? "attention"
            : missionStatus === "stopped"
              ? "attention"
              : hasFinalPackage
                ? "complete"
                : "waiting",
      detail: !hasMission
        ? "No recovery actions are open."
        : missionStatus === "error"
          ? "Mission-level recovery is required."
          : issueAgents > 0
            ? `${pluralize(issueAgents, "agent")} can be retried before launch decisions.`
            : missionStatus === "stopped"
              ? "Mission was stopped before normal completion."
              : hasFinalPackage
                ? "No open agent issues."
                : "Recovery state will update as agents finish.",
    },
  ];

  const completeCount = phases.filter((phase) => phase.state === "complete").length;
  const progress = Math.round((completeCount / phases.length) * 100);
  return { phases, completeCount, progress };
}

export function MissionTimeline(props: MissionTimelineProps) {
  const { phases, completeCount, progress } = buildTimeline(props);

  return (
    <div className="mb-3 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-950/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
            Mission Timeline
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {completeCount} of {phases.length} phases complete
          </p>
        </div>
        <div className="flex min-w-[160px] items-center gap-2">
          <Progress value={progress} className="h-1.5 bg-slate-200 dark:bg-slate-800" />
          <span className="w-9 text-right text-[11px] font-medium text-slate-500 dark:text-slate-400">{progress}%</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {phases.map((phase) => {
          const Icon = phaseIcon(phase.state);
          const classes = STATE_CLASSES[phase.state];
          return (
            <div
              key={phase.id}
              className={cn("min-h-[118px] rounded-lg border px-3 py-2.5", classes.border, classes.background)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white", classes.dot)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{phase.label}</span>
                </div>
                <Badge variant="secondary" className={cn("shrink-0 text-[9px] uppercase tracking-wider", classes.badge)}>
                  {STATE_COPY[phase.state]}
                </Badge>
              </div>
              <p className={cn("mt-2 text-[11px] leading-relaxed", classes.text)}>
                {phase.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
