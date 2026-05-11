import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AGENTS, PLATFORM_COLORS, isAgentActiveStatus, isAgentIssueStatus, type AgentData, type DiscoveredContent } from "@/hooks/useAgentData";

interface Props {
  agents: AgentData[];
  discoveries: DiscoveredContent[];
}

function statusMeta(status: AgentData["status"]) {
  if (isAgentActiveStatus(status)) return { color: "bg-green-500", label: labelFromStatus(status), ring: "ring-green-500/30" };
  if (isAgentIssueStatus(status)) return { color: status === "failed" || status === "error" ? "bg-red-500" : "bg-yellow-500", label: labelFromStatus(status), ring: status === "failed" || status === "error" ? "ring-red-500/30" : "ring-yellow-500/30" };
  if (status === "done") return { color: "bg-blue-500", label: "Done", ring: "ring-blue-500/30" };
  if (status === "stopped") return { color: "bg-slate-400", label: "Stopped", ring: "" };
  return { color: "bg-slate-300", label: "Idle", ring: "" };
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
              {data?.statusDetail && (
                <div className="line-clamp-2 text-center text-[10px] leading-snug text-slate-500 dark:text-slate-400">
                  {data.statusDetail}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function labelFromStatus(status: AgentData["status"]) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
