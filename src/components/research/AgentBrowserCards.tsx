import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { AGENTS, PLATFORM_COLORS, type AgentData, type DiscoveredContent } from "@/hooks/useAgentData";

interface Props {
  agents: AgentData[];
  discoveries: DiscoveredContent[];
  isRunning: boolean;
  latestMission?: {
    liveUrl: string | null;
    liveUrl2: string | null;
    liveUrl3: string | null;
    liveUrl4: string | null;
  } | null;
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

function isAbsoluteHttpUrl(value: string | null | undefined): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

/** Poll interval (ms) — high frequency for smooth livestream feel (~8fps) */
const PREVIEW_POLL_MS = 120;

export function AgentBrowserCards({ agents, discoveries, isRunning, latestMission }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [cloudEmbedEnabled, setCloudEmbedEnabled] = useState<Record<number, boolean>>({});
  const [cloudEmbedLoaded, setCloudEmbedLoaded] = useState<Record<number, boolean>>({});
  const cloudUrlByAgentId: Record<number, string | null> = {
    1: isAbsoluteHttpUrl(latestMission?.liveUrl) ? latestMission.liveUrl : null,
    2: isAbsoluteHttpUrl(latestMission?.liveUrl2) ? latestMission.liveUrl2 : null,
    3: isAbsoluteHttpUrl(latestMission?.liveUrl3) ? latestMission.liveUrl3 : null,
    4: isAbsoluteHttpUrl(latestMission?.liveUrl4) ? latestMission.liveUrl4 : null,
  };
  const hasAllCloudPreviewsReady = [1, 2, 3, 4].every((agentId) => (
    Boolean(cloudUrlByAgentId[agentId])
    && cloudEmbedEnabled[agentId] !== false
    && cloudEmbedLoaded[agentId] === true
  ));

  useEffect(() => {
    setCloudEmbedEnabled({});
    setCloudEmbedLoaded({});
  }, [
    latestMission?.liveUrl,
    latestMission?.liveUrl2,
    latestMission?.liveUrl3,
    latestMission?.liveUrl4,
  ]);

  useEffect(() => {
    const timers: number[] = [];
    for (const agentId of [1, 2, 3, 4]) {
      const hasCloudUrl = Boolean(cloudUrlByAgentId[agentId]);
      const embedDisabled = cloudEmbedEnabled[agentId] === false;
      const embedLoaded = cloudEmbedLoaded[agentId] === true;
      if (!hasCloudUrl || embedDisabled || embedLoaded) continue;
      const timer = window.setTimeout(() => {
        setCloudEmbedEnabled((prev) => ({ ...prev, [agentId]: false }));
      }, 8000);
      timers.push(timer);
    }
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [
    cloudUrlByAgentId[1], cloudUrlByAgentId[2], cloudUrlByAgentId[3], cloudUrlByAgentId[4],
    cloudEmbedEnabled[1], cloudEmbedEnabled[2], cloudEmbedEnabled[3], cloudEmbedEnabled[4],
    cloudEmbedLoaded[1], cloudEmbedLoaded[2], cloudEmbedLoaded[3], cloudEmbedLoaded[4],
  ]);

  // While the mission is running, poll local fallback frames unless all four cloud sessions are available.
  useEffect(() => {
    if (!isRunning || hasAllCloudPreviewsReady) return;
    const interval = setInterval(() => setRefreshKey((k) => k + 1), PREVIEW_POLL_MS);
    return () => clearInterval(interval);
  }, [isRunning, hasAllCloudPreviewsReady]);

  const handleCloudIframeLoad = (agentId: number, event: SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget;
    try {
      const href = frame.contentWindow?.location?.href ?? "";
      if (!href || href === "about:blank") {
        setCloudEmbedEnabled((prev) => ({ ...prev, [agentId]: false }));
        setCloudEmbedLoaded((prev) => ({ ...prev, [agentId]: false }));
        return;
      }
    } catch {
      // Cross-origin frames throw on location access; treat that as successfully loaded.
    }
    setCloudEmbedLoaded((prev) => ({ ...prev, [agentId]: true }));
  };

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
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Browser Sessions
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {isRunning ? `${agents.filter((a) => ["searching", "exploiting"].includes(a.status)).length} active` : "Stopped"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {browserAgents.map((def) => {
          const data = agents.find((a) => a.agent_id === def.agentId);
          const status = data?.status ?? "idle";
          const currentUrl = data?.current_url ?? "";
          const color = PLATFORM_COLORS[def.platform] ?? def.color;
          const count = discoveryCounts[def.agentId] ?? 0;
          const liveCloudUrl = cloudUrlByAgentId[def.agentId] ?? null;
          const useCloudEmbed = Boolean(liveCloudUrl) && cloudEmbedEnabled[def.agentId] !== false;
          const cloudEmbedVisible = cloudEmbedLoaded[def.agentId] === true;
          const cloudPreviewSrc = liveCloudUrl
            ? `${liveCloudUrl}${String(liveCloudUrl).includes("?") ? "&" : "?"}ui=false`
            : "";
          const fallbackPreviewSrc = `${API_BASE}/api/agent-stream/${def.agentId}/frame?t=${refreshKey}`;

          const isActive = ["searching", "exploiting", "found_trend", "reassigning"].includes(status);

          return (
            <div
              key={def.id}
              className={`
                relative rounded-xl border bg-white dark:bg-slate-950/90 overflow-hidden shadow-sm 
                dark:shadow-[0_18px_42px_rgba(2,6,23,0.35)] transition-all duration-300
                ${isActive 
                  ? "border-transparent ring-2 ring-offset-1 dark:ring-offset-0 ring-green-500/60 dark:ring-green-400/50 animate-live-pulse" 
                  : "border-slate-200 dark:border-slate-800/80"
                }
              `}
              style={isActive ? { 
                boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20, inset 0 0 20px ${color}10` 
              } : undefined}
            >
              {/* Animated glow overlay for active agents */}
              {isActive && (
                <div 
                  className="absolute inset-0 pointer-events-none z-10 rounded-xl"
                  style={{
                    background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 70%)`,
                    animation: "liveGlow 2s ease-in-out infinite alternate"
                  }}
                />
              )}
              {/* Preview image */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={fallbackPreviewSrc}
                  alt={`Agent ${def.name} preview`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {useCloudEmbed && (
                  <iframe
                    src={cloudPreviewSrc}
                    title={`Agent ${def.name} cloud preview`}
                    className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
                      cloudEmbedVisible ? "opacity-100" : "opacity-0"
                    }`}
                    loading="eager"
                    allow="autoplay"
                    onLoad={(event) => handleCloudIframeLoad(def.agentId, event)}
                    onError={() => {
                      setCloudEmbedEnabled((prev) => ({ ...prev, [def.agentId]: false }));
                      setCloudEmbedLoaded((prev) => ({ ...prev, [def.agentId]: false }));
                    }}
                  />
                )}
                {liveCloudUrl && (
                  <a
                    href={liveCloudUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="absolute bottom-2 left-2 rounded bg-black/65 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                  >
                    Open cloud
                  </a>
                )}
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
                  <Badge className="absolute bottom-2 right-2 text-[10px] bg-white/90 dark:bg-slate-950/90 text-slate-700 dark:text-slate-100 border-0">
                    {count} found
                  </Badge>
                )}
              </div>

              {/* Agent info */}
              <div className="px-3 py-2 dark:bg-slate-950/70">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color }}>
                    {def.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {def.baseRole}
                  </span>
                </div>
                {currentUrl && (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
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
