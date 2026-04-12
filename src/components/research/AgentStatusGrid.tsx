import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AGENTS, PLATFORM_COLORS, type AgentData, type DiscoveredContent } from "@/hooks/useAgentData";

interface Props {
  agents: AgentData[];
  discoveries: DiscoveredContent[];
}

function statusMeta(status: AgentData["status"]) {
  switch (status) {
    case "searching":
    case "found_trend":
    case "exploiting":
    case "reassigning":
      return { color: "bg-green-500", label: "Active", ring: "ring-green-500/30" };
    case "weak":
      return { color: "bg-yellow-500", label: "Weak", ring: "ring-yellow-500/30" };
    case "error":
      return { color: "bg-red-500", label: "Error", ring: "ring-red-500/30" };
    case "stopped":
      return { color: "bg-slate-400", label: "Stopped", ring: "" };
    case "idle":
    default:
      return { color: "bg-slate-300", label: "Idle", ring: "" };
  }
}

export function AgentStatusGrid({ agents, discoveries }: Props) {
  const discoveryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const d of discoveries) {
      counts[d.found_by_agent_id] = (counts[d.found_by_agent_id] ?? 0) + 1;
    }
    return counts;
  }, [discoveries]);

  return (
    <div className="grid grid-cols-5 gap-3">
      {AGENTS.map((def) => {
        const data = agents.find((a) => a.agent_id === def.agentId);
        const meta = statusMeta(data?.status ?? "idle");
        const energy = data?.energy ?? 100;
        const count = discoveryCounts[def.agentId] ?? 0;
        const platformColor = PLATFORM_COLORS[def.platform] ?? def.color;

        return (
          <Card key={def.id} className="border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 shadow-sm dark:shadow-[0_18px_42px_rgba(2,6,23,0.28)]">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              {/* Status dot */}
              <div className="flex items-center gap-2 w-full">
                <span
                  className={`h-2 w-2 rounded-full ${meta.color} ${meta.ring ? `ring-4 ${meta.ring}` : ""}`}
                />
                <span className="text-xs text-slate-500 dark:text-slate-300 capitalize">{meta.label}</span>
              </div>

              {/* Agent name + platform */}
              <div className="text-center">
                <div
                  className="text-sm font-semibold"
                  style={{ color: platformColor }}
                >
                  {def.name}
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                  {def.platform === "market_research" ? "Research" : def.platform}
                </div>
              </div>

              {/* Energy bar */}
              <div className="w-full">
                <Progress value={energy} className="h-1.5" />
              </div>

              {/* Discovery count */}
              {count > 0 && (
                <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {count} found
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
