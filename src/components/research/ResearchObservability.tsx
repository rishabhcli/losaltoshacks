import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AgentFeed } from "./AgentFeed";
import { BusinessPlanPanel } from "./BusinessPlanPanel";
import { SharedMemoryPanel } from "./SharedMemoryPanel";
import type { AgentData, AgentMemoryEntry, AgentSignal, AgentThought, BusinessPlan, DiscoveredContent, LogEntry } from "@/hooks/useAgentData";

interface Props {
  thoughts: AgentThought[];
  signals: AgentSignal[];
  logs: LogEntry[];
  memory: AgentMemoryEntry[];
  businessPlans: BusinessPlan[];
  agents: AgentData[];
  discoveries: DiscoveredContent[];
  missionPrompt: string;
  isRunning: boolean;
  missionStatus: "queued" | "active" | "stopping" | "stopped" | "completed" | "error" | null;
}

function deriveObservabilityStatus({
  missionStatus,
  logs,
  agents,
  discoveries,
  businessPlans,
}: {
  missionStatus: Props["missionStatus"];
  logs: LogEntry[];
  agents: AgentData[];
  discoveries: DiscoveredContent[];
  businessPlans: BusinessPlan[];
}) {
  const latestLog = [...logs]
    .sort((a, b) => b.timestamp - a.timestamp)
    .find((log) => log.type === "status" || log.type === "error" || log.type === "final_options" || log.type === "market_research");
  const latestMessage = latestLog?.message ?? "";
  const activeAgents = agents.filter((agent) => ["searching", "found_trend", "exploiting", "reassigning"].includes(agent.status)).length;
  const latestPlan = businessPlans[0] ?? null;

  if (missionStatus === "queued") {
    if (/switch|preempt|stopping the previous mission|newer research request/i.test(latestMessage)) {
      return {
        label: "Switching Worker",
        tone: "amber",
        detail: latestMessage,
      };
    }
    return {
      label: "Waiting For Pickup",
      tone: "amber",
      detail: latestMessage || "Mission was accepted and is waiting for the worker to claim it.",
    };
  }

  if (missionStatus === "active") {
    if (latestPlan?.is_final) {
      return {
        label: "Finalizing Results",
        tone: "green",
        detail: latestMessage || "Research is packaging the final report and recommendations now.",
      };
    }
    if (latestPlan) {
      return {
        label: "Synthesizing Report",
        tone: "blue",
        detail: latestMessage || `Business plan v${latestPlan.version} is being updated from ${latestPlan.discovery_count} discoveries.`,
      };
    }
    if (discoveries.length > 0) {
      return {
        label: "Collecting Discoveries",
        tone: "blue",
        detail: latestMessage || `${discoveries.length} discoveries collected so far across ${Math.max(activeAgents, 1)} active agents.`,
      };
    }
    return {
      label: "Starting Research",
      tone: "blue",
      detail: latestMessage || "Initializing agents, generating queries, and preparing live sources.",
    };
  }

  if (missionStatus === "stopping") {
    return {
      label: "Stopping Mission",
      tone: "amber",
      detail: latestMessage || "The worker is winding down the current mission.",
    };
  }

  if (missionStatus === "error") {
    return {
      label: "Mission Error",
      tone: "red",
      detail: latestMessage || "The mission hit an error before completion.",
    };
  }

  if (missionStatus === "completed") {
    return {
      label: "Mission Complete",
      tone: "slate",
      detail: latestMessage || "The latest mission finished and published its final output.",
    };
  }

  if (missionStatus === "stopped") {
    return {
      label: "Mission Stopped",
      tone: "slate",
      detail: latestMessage || "The latest mission was stopped before normal completion.",
    };
  }

  return {
    label: "No Active Mission",
    tone: "slate",
    detail: "Launch a research mission to see live observability updates here.",
  };
}

function statusToneClasses(tone: "blue" | "green" | "amber" | "red" | "slate") {
  switch (tone) {
    case "blue":
      return {
        badge: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-900/70",
        background: "bg-blue-50/70 dark:bg-blue-950/20",
      };
    case "green":
      return {
        badge: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-900/70",
        background: "bg-emerald-50/70 dark:bg-emerald-950/20",
      };
    case "amber":
      return {
        badge: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-900/70",
        background: "bg-amber-50/70 dark:bg-amber-950/20",
      };
    case "red":
      return {
        badge: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300",
        border: "border-red-200 dark:border-red-900/70",
        background: "bg-red-50/70 dark:bg-red-950/20",
      };
    default:
      return {
        badge: "bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300",
        border: "border-slate-200 dark:border-slate-800/80",
        background: "bg-slate-50/70 dark:bg-slate-950/30",
      };
  }
}

export function ResearchObservability({
  thoughts, signals, logs, memory, businessPlans, agents, discoveries, missionPrompt, isRunning, missionStatus,
}: Props) {
  const statusSummary = deriveObservabilityStatus({
    missionStatus,
    logs,
    agents,
    discoveries,
    businessPlans,
  });
  const toneClasses = statusToneClasses(statusSummary.tone);

  return (
    <Tabs defaultValue="feed" className="flex flex-col h-full">
      <div className={`mb-3 rounded-xl border px-4 py-3 ${toneClasses.border} ${toneClasses.background}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="secondary" className={`text-[10px] uppercase tracking-wider ${toneClasses.badge}`}>
            {statusSummary.label}
          </Badge>
          {missionPrompt ? (
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {missionPrompt}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          {statusSummary.detail}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span>{agents.filter((agent) => ["searching", "found_trend", "exploiting", "reassigning"].includes(agent.status)).length} active agents</span>
          <span>{discoveries.length} discoveries</span>
          <span>{businessPlans.length} plan versions</span>
          <span>{logs.length} log events</span>
        </div>
      </div>

      <TabsList className="bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shrink-0 w-fit">
        <TabsTrigger value="feed" className="text-xs gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#f8fafc] dark:data-[state=active]:border-slate-800">
          Agent Feed
          {thoughts.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600">{thoughts.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="plan" className="text-xs gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#f8fafc] dark:data-[state=active]:border-slate-800">
          Business Plan
          {businessPlans.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 bg-green-100 dark:bg-green-900/30 text-green-600">v{businessPlans[0].version}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="memory" className="text-xs gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#f8fafc] dark:data-[state=active]:border-slate-800">
          Shared Memory
          {memory.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500">{memory.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="feed" className="flex-1 mt-3 overflow-hidden">
        <AgentFeed thoughts={thoughts} signals={signals} logs={logs} />
      </TabsContent>

      <TabsContent value="plan" className="flex-1 mt-3 overflow-hidden">
        <BusinessPlanPanel
          plans={businessPlans}
          agents={agents}
          discoveries={discoveries}
          missionPrompt={missionPrompt}
          isRunning={isRunning}
        />
      </TabsContent>

      <TabsContent value="memory" className="flex-1 mt-3 overflow-hidden">
        <SharedMemoryPanel memory={memory} />
      </TabsContent>
    </Tabs>
  );
}
