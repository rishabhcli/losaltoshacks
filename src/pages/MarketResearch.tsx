import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Eye, Radio, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMasterBuildDashboard } from "@/hooks/useMasterBuildDashboard";
import { MissionControl } from "@/components/research/MissionControl";
import { AgentBrowserCards } from "@/components/research/AgentBrowserCards";
import { ResearchObservability } from "@/components/research/ResearchObservability";
import { DiscoveryGrid } from "@/components/research/DiscoveryGrid";
import { FinalOptionsPanel } from "@/components/research/FinalOptionsPanel";
import { BusinessPlanPanel } from "@/components/research/BusinessPlanPanel";
import { RuntimeHealthStrip } from "@/components/research/RuntimeHealthStrip";
import { useTheme } from "@/lib/theme";
import { apiFetch } from "@/lib/api";
import { isAgentActiveStatus, isAgentIssueStatus } from "@/hooks/useAgentData";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

type ViewMode = "command" | "observe";

export function MarketResearch() {
  const {
    latestMission, agents, discoveries, logs, signals, thoughts, memory, businessPlans,
    isLoading, isCreatingMission, retryingAgentId, error,
    createMission, stopAll, resetAll, retryAgent,
  } = useMasterBuildDashboard();

  const [viewMode, setViewMode] = useState<ViewMode>("command");
  const [showFinalOptions, setShowFinalOptions] = useState(false);
  const [themeSyncError, setThemeSyncError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Sync theme to server so browser showcase matches
  useEffect(() => {
    let cancelled = false;

    async function syncTheme() {
      setThemeSyncError(null);
      try {
        const response = await apiFetch(`${API_BASE}/api/theme`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme }),
        });
        if (!response.ok) {
          throw new Error(`Theme sync failed with HTTP ${response.status}.`);
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Theme sync failed.";
          setThemeSyncError(message);
          console.warn("[marketpulse] Theme sync unavailable:", error);
        }
      }
    }

    void syncTheme();
    return () => {
      cancelled = true;
    };
  }, [theme]);

  const isRunning = useMemo(() => {
    const status = latestMission?.status;
    return status === "queued" || status === "active";
  }, [latestMission?.status]);

  const activeAgentCount = useMemo(
    () => agents.filter((a) => isAgentActiveStatus(a.status)).length,
    [agents],
  );
  const issueAgentCount = useMemo(
    () => agents.filter((a) => isAgentIssueStatus(a.status)).length,
    [agents],
  );

  const handleReset = useCallback(async () => {
    if (isRunning) {
      stopAll();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await resetAll();
    // Hard refresh to clear all state and caches
    window.location.reload();
  }, [isRunning, stopAll, resetAll]);

  const handleCreateFollowUpMission = useCallback(async (prompt: string) => {
    setShowFinalOptions(false);
    setViewMode("command");
    await createMission(prompt);
  }, [createMission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-slate-400">Loading research dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent dark:bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.82),rgba(2,6,23,0.96))]">
      {/* ── Top Header Bar ────────────────────────────────────── */}
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60 glass shrink-0 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
            Market Research
          </h1>
          {isRunning && activeAgentCount > 0 && (
            <Badge className="bg-green-100 dark:bg-emerald-950/70 text-green-700 dark:text-emerald-300 border-0 gap-1.5 text-[11px] font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              {activeAgentCount} active
            </Badge>
          )}
          {!isRunning && discoveries.length > 0 && (
            <Badge variant="secondary" className="text-[11px] bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300">
              {discoveries.length} discoveries
            </Badge>
          )}
          {issueAgentCount > 0 && (
            <Badge className="bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-0 text-[11px] font-medium">
              {issueAgentCount} agents need review
            </Badge>
          )}
        </div>

        <div className="flex w-full items-center gap-2 overflow-x-auto sm:w-auto sm:justify-end">
        {/* View Results button */}
        {latestMission?.finalOptions && (
          <button
            onClick={() => setShowFinalOptions(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            View Results
          </button>
        )}
        {/* Reset button */}
        {latestMission && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200/60 dark:border-red-800/60 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950/70 rounded-lg p-0.5 border border-slate-200/60 dark:border-slate-800/80">
          <button
            onClick={() => setViewMode("command")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "command"
                ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-[#f8fafc] dark:border dark:border-slate-800 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Command
          </button>
          <button
            onClick={() => setViewMode("observe")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "observe"
                ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-[#f8fafc] dark:border dark:border-slate-800 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Observe
          </button>
        </div>
        </div>
      </div>
      <RuntimeHealthStrip themeSyncError={themeSyncError} />

      {/* ── Main Content Area (fills viewport) ──────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 lg:flex-row lg:overflow-hidden">

        {viewMode === "command" ? (
          /* ── COMMAND VIEW ──────────────────────────────────── */
          /* Left: Business Plan pipeline + report                */
          /* Right: Agent grid + Discovery grid (stacked)         */
          <>
            {/* Left Panel */}
            <div className="w-full shrink-0 border-b border-slate-200/60 dark:border-slate-800/80 flex flex-col overflow-hidden bg-slate-50/30 dark:bg-slate-950/55 lg:w-[400px] lg:min-w-[320px] lg:border-b-0 lg:border-r lg:min-h-0">
              <div className="min-h-[520px] overflow-hidden flex flex-col lg:flex-1 lg:min-h-0">
                <BusinessPlanPanel
                  plans={businessPlans}
                  agents={agents}
                  discoveries={discoveries}
                  missionPrompt={latestMission?.prompt ?? ""}
                  isRunning={isRunning}
                  finalOptions={latestMission?.finalOptions ?? null}
                  onStopAll={stopAll}
                />
              </div>
            </div>

            {/* Right Panel */}
            <div className="min-w-0 flex-1 overflow-visible dark:bg-slate-950/20 lg:overflow-y-auto">
              {/* Agent browser preview cards */}
              <div className="px-4 pt-4 pb-2">
                <AgentBrowserCards
                  agents={agents}
                  discoveries={discoveries}
                  isRunning={isRunning}
                  retryingAgentId={retryingAgentId}
                  onRetryAgent={retryAgent}
                  latestMission={
                    latestMission
                      ? {
                          liveUrl: latestMission.liveUrl,
                          liveUrl2: latestMission.liveUrl2,
                          liveUrl3: latestMission.liveUrl3,
                          liveUrl4: latestMission.liveUrl4,
                        }
                      : null
                  }
                />
              </div>

              {/* Discovery grid + Mission logs side by side */}
              <div className="flex min-h-[440px] flex-col border-t border-slate-200/40 dark:border-slate-800/70 xl:h-[440px] xl:flex-row">
                {/* Discoveries */}
                <div className="min-h-[360px] flex-1 flex flex-col overflow-hidden px-4 pb-3 pt-3 min-w-0 xl:min-h-0">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2 shrink-0">Discoveries</h3>
                  <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                    <DiscoveryGrid discoveries={discoveries} />
                  </div>
                </div>

                {/* Mission Logs (floating-style right sidebar) */}
                <div className="min-h-[220px] w-full shrink-0 border-t border-slate-200/40 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-950/70 flex flex-col overflow-hidden xl:min-h-0 xl:w-[300px] xl:border-l xl:border-t-0">
                  <div className="px-3 py-2.5 border-b border-slate-200/40 dark:border-slate-800/70">
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-200 uppercase tracking-wider">Live Feed</span>
                      {logs.length > 0 && (
                        <Badge variant="secondary" className="text-[9px] ml-auto bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300">{logs.length}</Badge>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                      {logs.length === 0 && thoughts.length === 0 && (
                        <div className="text-xs text-slate-400 text-center py-8">
                          Agent activity will appear here
                        </div>
                      )}
                      {[...thoughts.map(t => ({
                        id: t._id,
                        agentId: t.agent_id,
                        message: t.response_summary || t.prompt_summary,
                        time: t.timestamp,
                        type: "thought" as const,
                      })), ...logs.map(l => ({
                        id: l._id,
                        agentId: l.agent_id,
                        message: l.message,
                        time: l.timestamp * 1000,
                        type: "log" as const,
                      }))]
                        .sort((a, b) => b.time - a.time)
                        .slice(0, 35)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 px-2 py-1.5 rounded-md hover:bg-white/60 dark:hover:bg-slate-900/80 transition-colors"
                          >
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                            </span>
                            {" "}
                            <span className="text-slate-700 dark:text-slate-100 line-clamp-2">{item.message}</span>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── OBSERVE VIEW ─────────────────────────────────── */
          /* Left: Full observability dashboard (tabs)            */
          /* Right: Discovery grid                                */
          <>
            {/* Left Panel — Observability */}
            <div className="min-w-0 flex-1 flex flex-col overflow-hidden p-4">
              <ResearchObservability
                thoughts={thoughts}
                signals={signals}
                logs={logs}
                memory={memory}
                businessPlans={businessPlans}
                agents={agents}
                discoveries={discoveries}
                missionPrompt={latestMission?.prompt ?? ""}
                isRunning={isRunning}
                missionStatus={latestMission?.status ?? null}
                finalOptions={latestMission?.finalOptions ?? null}
              />
            </div>

            {/* Right Panel — Discoveries */}
            <div className="min-h-[420px] w-full shrink-0 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col overflow-hidden p-4 dark:bg-slate-950/45 lg:min-h-0 lg:w-[420px] lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Discoveries</h3>
                {discoveries.length > 0 && (
                  <Badge variant="secondary" className="text-[9px] bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300">{discoveries.length}</Badge>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <DiscoveryGrid discoveries={discoveries} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Bottom Command Bar (sticky) ───────────────────── */}
      <MissionControl
        isRunning={isRunning}
        isCreatingMission={isCreatingMission}
        missionPrompt={latestMission?.prompt ?? ""}
        missionStatus={latestMission?.status ?? null}
        error={error}
        onCreateMission={createMission}
        onStopAll={stopAll}
        onResetAll={resetAll}
      />

      {/* ── Final Options Modal (auto-shows when results arrive) ── */}
      {showFinalOptions && latestMission?.finalOptions && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close results"
            className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFinalOptions(false)}
          />
          {/* Modal */}
          <div className="relative w-[min(760px,calc(100vw-2rem))] max-h-[calc(100vh-160px)] bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xl overflow-hidden flex flex-col sm:w-[min(760px,calc(100vw-4rem))]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-slate-50 dark:bg-slate-950">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Market Research Results</h2>
              <button onClick={() => setShowFinalOptions(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ScrollArea className="flex-1 p-5">
              <FinalOptionsPanel
                finalOptions={latestMission.finalOptions}
                isCreatingFollowUp={isCreatingMission}
                onCreateFollowUpMission={handleCreateFollowUpMission}
              />
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
