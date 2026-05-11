import { AlertTriangle, CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getAgentById,
  isAgentIssueStatus,
  type AgentData,
  type BusinessPlan,
  type DiscoveredContent,
} from "@/hooks/useAgentData";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

type MissionStatus = "queued" | "active" | "stopping" | "stopped" | "completed" | "error" | null;

interface MissionTrustAuditProps {
  agents: AgentData[];
  discoveries: DiscoveredContent[];
  businessPlans: BusinessPlan[];
  finalOptions: FinalOptionsPayload | null;
  missionPrompt: string;
  missionStatus: MissionStatus;
}

type AuditTone = "pass" | "watch" | "block" | "idle";

interface AuditItem {
  id: string;
  title: string;
  tone: AuditTone;
  label: string;
  metric: string;
  detail: string;
}

const REQUIRED_PLATFORMS = ["youtube", "x", "reddit", "substack"] as const;
const LOW_CONFIDENCE_THRESHOLD = 0.65;
const STALE_HEARTBEAT_SECONDS = 30 * 60;

const TONE_CLASSES: Record<AuditTone, { badge: string; icon: string; text: string }> = {
  pass: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: "bg-emerald-500 text-white",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  watch: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    icon: "bg-amber-500 text-white",
    text: "text-amber-700 dark:text-amber-300",
  },
  block: {
    badge: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    icon: "bg-red-500 text-white",
    text: "text-red-700 dark:text-red-300",
  },
  idle: {
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    icon: "bg-slate-300 text-white dark:bg-slate-700",
    text: "text-slate-500 dark:text-slate-400",
  },
};

function toneIcon(tone: AuditTone) {
  if (tone === "pass") return CheckCircle2;
  if (tone === "block") return CircleAlert;
  if (tone === "watch") return AlertTriangle;
  return ShieldCheck;
}

function normalizedPlatforms(discoveries: DiscoveredContent[]) {
  return new Set(
    discoveries
      .map((discovery) => String(discovery.platform ?? "").trim().toLowerCase())
      .filter(Boolean),
  );
}

function getRequiredPlatforms(finalOptions: FinalOptionsPayload | null) {
  const required = finalOptions?.coverage?.requiredPlatforms ?? [];
  return required.length > 0 ? required.map((platform) => platform.toLowerCase()) : [...REQUIRED_PLATFORMS];
}

function getCompletedPlatforms(finalOptions: FinalOptionsPayload | null, discoveries: DiscoveredContent[]) {
  const completed = finalOptions?.coverage?.completedPlatforms ?? [];
  if (completed.length > 0) {
    return new Set(completed.map((platform) => platform.toLowerCase()));
  }
  return normalizedPlatforms(discoveries);
}

function deriveMissingPlatforms(finalOptions: FinalOptionsPayload | null, discoveries: DiscoveredContent[], requiredPlatforms: string[]) {
  if (finalOptions?.coverage?.missingPlatforms && finalOptions.coverage.missingPlatforms.length > 0) {
    return finalOptions.coverage.missingPlatforms.map((platform) => platform.toLowerCase());
  }
  const present = getCompletedPlatforms(finalOptions, discoveries);
  return requiredPlatforms.filter((platform) => !present.has(platform));
}

function isStaleAgent(agent: AgentData) {
  if (agent.status === "stale") return true;
  if (!agent.lastHeartbeat) return false;
  return Math.floor(Date.now() / 1000) - agent.lastHeartbeat > STALE_HEARTBEAT_SECONDS;
}

function buildAuditItems({
  agents,
  discoveries,
  businessPlans,
  finalOptions,
  missionPrompt,
  missionStatus,
}: MissionTrustAuditProps): AuditItem[] {
  const hasMission = Boolean(missionPrompt.trim() || missionStatus || agents.length > 0 || discoveries.length > 0 || finalOptions);
  const requiredPlatforms = getRequiredPlatforms(finalOptions);
  const completedPlatforms = getCompletedPlatforms(finalOptions, discoveries);
  const missingPlatforms = deriveMissingPlatforms(finalOptions, discoveries, requiredPlatforms);
  const issueAgents = agents.filter((agent) => isAgentIssueStatus(agent.status));
  const staleAgents = agents.filter(isStaleAgent);
  const lowConfidenceAgents = agents.filter((agent) => typeof agent.confidence === "number" && agent.confidence < LOW_CONFIDENCE_THRESHOLD);
  const planConfidence = businessPlans[0]?.confidence_score ?? null;
  const optionCount = finalOptions?.options.length ?? 0;
  const issueAgentSummary = issueAgents
    .map((agent) => `${getAgentById(agent.agent_id).name} ${agent.status}`)
    .slice(0, 3)
    .join(", ");

  return [
    {
      id: "evidence-diversity",
      title: "Evidence Diversity",
      tone: !hasMission
        ? "idle"
        : missingPlatforms.length === 0 && discoveries.length > 0
          ? "pass"
          : discoveries.length > 0
            ? "watch"
            : "block",
      label: !hasMission ? "Waiting" : missingPlatforms.length === 0 ? "Covered" : "Partial",
      metric: !hasMission ? "No evidence yet" : `${completedPlatforms.size}/${requiredPlatforms.length} channels covered`,
      detail: !hasMission
        ? "Launch a mission to audit source coverage."
        : missingPlatforms.length === 0
          ? "Required evidence channels are represented."
          : `Missing: ${missingPlatforms.join(", ")}.`,
    },
    {
      id: "agent-health",
      title: "Agent Health",
      tone: !hasMission
        ? "idle"
        : issueAgents.length === 0
          ? "pass"
          : issueAgents.some((agent) => agent.status === "failed" || agent.status === "error" || agent.status === "blocked")
            ? "block"
            : "watch",
      label: !hasMission ? "Waiting" : issueAgents.length === 0 ? "Clear" : "Needs Review",
      metric: !hasMission
        ? "No agent issues"
        : `${issueAgents.length} agent${issueAgents.length === 1 ? " needs" : "s need"} review`,
      detail: !hasMission
        ? "Agent status will appear after launch."
        : issueAgents.length === 0
          ? "No failed, stale, weak, or blocked agents."
          : `${issueAgentSummary}${issueAgents.length > 3 ? ", ..." : ""}.`,
    },
    {
      id: "freshness",
      title: "Freshness",
      tone: !hasMission
        ? "idle"
        : staleAgents.length === 0
          ? "pass"
          : "watch",
      label: !hasMission ? "Waiting" : staleAgents.length === 0 ? "Fresh" : "Stale",
      metric: !hasMission
        ? "No heartbeat yet"
        : `${staleAgents.length} stale heartbeat${staleAgents.length === 1 ? "" : "s"}`,
      detail: !hasMission
        ? "Heartbeat freshness will be checked after launch."
        : staleAgents.length === 0
          ? "Agent heartbeats are current enough for this mission."
          : `${staleAgents.map((agent) => getAgentById(agent.agent_id).name).join(", ")} should be refreshed before launch decisions.`,
    },
    {
      id: "confidence",
      title: "Confidence",
      tone: !hasMission
        ? "idle"
        : lowConfidenceAgents.length > 0 || (typeof planConfidence === "number" && planConfidence < 70)
          ? "watch"
          : "pass",
      label: !hasMission ? "Waiting" : lowConfidenceAgents.length > 0 ? "Mixed" : "Usable",
      metric: !hasMission
        ? "No plan confidence yet"
        : typeof planConfidence === "number"
          ? `Plan confidence ${planConfidence}%`
          : `${lowConfidenceAgents.length} low-confidence channel${lowConfidenceAgents.length === 1 ? "" : "s"}`,
      detail: !hasMission
        ? "Confidence is unavailable until agents run."
        : lowConfidenceAgents.length > 0
          ? `${lowConfidenceAgents.length} low-confidence channel${lowConfidenceAgents.length === 1 ? "" : "s"} below ${(LOW_CONFIDENCE_THRESHOLD * 100).toFixed(0)}%.`
          : "Current confidence is usable for a demo decision, with evidence visible.",
    },
    {
      id: "decision-readiness",
      title: "Decision Readiness",
      tone: !hasMission
        ? "idle"
        : optionCount > 0 && missingPlatforms.length === 0 && issueAgents.length === 0
          ? "pass"
          : optionCount > 0
          ? "watch"
          : "block",
      label: !hasMission ? "Waiting" : optionCount > 0 ? "Review" : "Blocked",
      metric: !hasMission
        ? "No options yet"
        : optionCount > 0 && missingPlatforms.length === 0 && issueAgents.length === 0
          ? "Ready for handoff"
          : optionCount > 0
            ? "Partial package"
            : "No generated options",
      detail: !hasMission
        ? "Options will appear after synthesis."
        : optionCount > 0 && missingPlatforms.length === 0 && issueAgents.length === 0
          ? "Ready for an accept/reject decision."
          : optionCount > 0
            ? `Resolve ${missingPlatforms.length > 0 ? missingPlatforms.join(", ") : "agent warnings"} before Lovable handoff.`
            : "No generated options are ready yet.",
    },
  ];
}

export function MissionTrustAudit(props: MissionTrustAuditProps) {
  const items = buildAuditItems(props);
  const hasMission = Boolean(props.missionPrompt.trim() || props.missionStatus || props.agents.length > 0 || props.discoveries.length > 0 || props.finalOptions);
  const blockerCount = items.filter((item) => item.tone === "block").length;
  const watchCount = items.filter((item) => item.tone === "watch").length;

  return (
    <div className="mb-3 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-950/40">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
            Trust Audit
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Evidence, agent health, freshness, confidence, and decision readiness.
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "w-fit text-[10px] uppercase tracking-wider",
            !hasMission
              ? TONE_CLASSES.idle.badge
              : blockerCount > 0
              ? TONE_CLASSES.block.badge
              : watchCount > 0
                ? TONE_CLASSES.watch.badge
                : TONE_CLASSES.pass.badge,
          )}
        >
          {!hasMission ? "Waiting" : blockerCount > 0 ? `${blockerCount} blockers` : watchCount > 0 ? `${watchCount} watch` : "Clear"}
        </Badge>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => {
          const Icon = toneIcon(item.tone);
          const classes = TONE_CLASSES[item.tone];
          return (
            <div key={item.id} className="min-h-[116px] rounded-lg border border-slate-200/70 px-3 py-2.5 dark:border-slate-800/80">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", classes.icon)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{item.title}</span>
                </div>
                <Badge variant="secondary" className={cn("shrink-0 text-[9px] uppercase tracking-wider", classes.badge)}>
                  {item.label}
                </Badge>
              </div>
              <div className={cn("mt-2 text-xs font-semibold", classes.text)}>{item.metric}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
