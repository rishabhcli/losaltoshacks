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
}

export function ResearchObservability({
  thoughts, signals, logs, memory, businessPlans, agents, discoveries, missionPrompt, isRunning,
}: Props) {
  return (
    <Tabs defaultValue="feed" className="flex flex-col h-full">
      <TabsList className="bg-slate-100/80 border border-slate-200 shrink-0 w-fit">
        <TabsTrigger value="feed" className="text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600">
          Agent Feed
          {thoughts.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 bg-blue-100 text-blue-600">{thoughts.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="plan" className="text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600">
          Business Plan
          {businessPlans.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 bg-green-100 text-green-600">v{businessPlans[0].version}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="memory" className="text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600">
          Shared Memory
          {memory.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 bg-slate-200 text-slate-500">{memory.length}</Badge>
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
