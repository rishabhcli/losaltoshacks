import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AGENTS, PLATFORM_COLORS, type AgentData, type DiscoveredContent } from "@/hooks/useAgentData";

interface Props {
  agents: AgentData[];
  discoveries: DiscoveredContent[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function statusLabel(status: AgentData["status"]) {
  switch (status) {
    case "searching": return "SEARCHING";
    case "found_trend": return "FOUND";
    case "exploiting": return "DEEP DIVE";
    case "reassigning": return "REASSIGNING";
    case "weak": return "WEAK";
    case "error": return "ERROR";
    case "stopped": return "STOPPED";
    case "idle": default: return "IDLE";
  }
}

function statusColor(status: AgentData["status"]) {
  switch (status) {
    case "searching": case "exploiting": return "bg-green-500 text-white";
    case "found_trend": return "bg-blue-500 text-white";
    case "weak": case "reassigning": return "bg-yellow-500 text-white";
    case "error": return "bg-red-500 text-white";
    default: return "bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300";
  }
}

export function AgentBrowserCards({ agents, discoveries }: Props) {
  // Refresh preview images periodically when agents are active
  const [refreshKey, setRefreshKey] = useState(0);
  const hasActiveAgents = agents.some((a) =>
    ["searching", "exploiting", "found_trend"].includes(a.status)
  );

  useEffect(() => {
    if (!hasActiveAgents) return;
    const interval = setInterval(() => setRefreshKey((k) => k + 1), 3000);
    return () => clearInterval(interval);
  }, [hasActiveAgents]);

  const discoveryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const d of discoveries) counts[d.found_by_agent_id] = (counts[d.found_by_agent_id] ?? 0) + 1;
    return counts;
  }, [discoveries]);

  // Only show browser agents (1-4), not Atlas (5)
  const browserAgents = AGENTS.filter((a) => a.platform !== "market_research");

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-semibold text-slate-800">
          Browser Sessions
        </h2>
        <span className="text-xs text-slate-400">
          {agents.filter((a) => ["searching", "exploiting"].includes(a.status)).length} active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {browserAgents.map((def) => {
          const data = agents.find((a) => a.agent_id === def.agentId);
          const status = data?.status ?? "idle";
          const currentUrl = data?.current_url ?? "";
          const color = PLATFORM_COLORS[def.platform] ?? def.color;
          const count = discoveryCounts[def.agentId] ?? 0;

          return (
            <div
              key={def.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm dark:shadow-black/20"
            >
              {/* Preview image */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={`${API_BASE}/api/agent-stream/${def.agentId}/frame?t=${refreshKey}`}
                  alt={`Agent ${def.name} preview`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Platform badge */}
                <Badge
                  className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider border-0"
                  style={{ backgroundColor: color, color: "white" }}
                >
                  {def.platform}
                </Badge>
                {/* Status badge */}
                <Badge
                  className={`absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider border-0 ${statusColor(status)}`}
                >
                  {statusLabel(status)}
                </Badge>
                {/* Discovery count */}
                {count > 0 && (
                  <Badge className="absolute bottom-2 right-2 text-[10px] bg-white/90 dark:bg-slate-800/90 text-slate-700 border-0">
                    {count} found
                  </Badge>
                )}
              </div>

              {/* Agent info */}
              <div className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color }}>
                    {def.name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {def.baseRole}
                  </span>
                </div>
                {currentUrl && (
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {currentUrl}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
