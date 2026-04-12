import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { insforge } from "@/lib/insforge";
import { invalidateLiveResearchCache } from "@/lib/osdk-shims";
import type {
  AgentData,
  AgentMemoryEntry,
  AgentSignal,
  AgentThought,
  BusinessPlan,
  DiscoveredContent,
  LogEntry,
} from "./useAgentData";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FinalOptionEvidence {
  id: string;
  platform: string;
  title: string;
  keywords: string;
  summary: string;
  url: string;
}

export interface FinalOption {
  id: string;
  title: string;
  concept: string;
  audience: string;
  whyPromising: string;
  marketAngle: string;
  recommendedFormat: string;
  evidence: FinalOptionEvidence[];
}

export interface FinalOptionsCoverage {
  requiredPlatforms: readonly ("youtube" | "x" | "reddit" | "substack")[];
  completedPlatforms: string[];
  missingPlatforms: string[];
  readyForLovable: boolean;
}

export interface ImplementationPlanScreen {
  name: string;
  purpose: string;
  modules: string[];
}

export interface ImplementationPlanDataModel {
  entity: string;
  purpose: string;
  fields: string[];
}

export interface ImplementationPlanWorkflow {
  name: string;
  trigger: string;
  outcome: string;
}

export interface FinalImplementationPlan {
  generatedBy: "MiniMax-M2.7";
  title: string;
  oneLiner: string;
  problem: string;
  targetUsers: string;
  valueProp: string;
  whyNow: string;
  coreUserFlows: string[];
  screens: ImplementationPlanScreen[];
  dataModel: ImplementationPlanDataModel[];
  workflows: ImplementationPlanWorkflow[];
  integrations: string[];
  monetization: string;
  launchPlan: string[];
  successMetrics: string[];
  sourceEvidence: FinalOptionEvidence[];
}

export interface LovableHandoff {
  title: string;
  prompt: string;
  launchUrl: string;
  evidence: FinalOptionEvidence[];
}

export interface FinalOptionsPayload {
  generatedAt: string;
  isFinal: boolean;
  marketResearch: {
    summary: string;
    signals: string[];
  };
  options: FinalOption[];
  primaryOptionId: string;
  coverage: FinalOptionsCoverage;
  implementationPlan: FinalImplementationPlan;
  lovableHandoff: LovableHandoff;
}

interface MissionRecord {
  id: string;
  prompt: string;
  status: "queued" | "active" | "stopping" | "stopped" | "completed" | "error";
  createdAt: string | null;
  stoppedAt: string | null;
  liveUrl: string | null;
  liveUrl2: string | null;
  liveUrl3: string | null;
  liveUrl4: string | null;
  liveUrl5: string | null;
  finalOptions: FinalOptionsPayload | null;
}

/* ------------------------------------------------------------------ */
/*  API helpers                                                        */
/* ------------------------------------------------------------------ */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const REALTIME_CHANNELS = [
  "missions", "agents", "discoveries", "logs", "signals",
  "agent_memory", "agent_thoughts", "business_plans",
] as const;
const REALTIME_EVENTS = REALTIME_CHANNELS.map((ch) => `${ch}_changed`);
let realtimeSetupPromise: Promise<void> | null = null;

async function callMissionControlRoute<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  let payload: unknown = null;
  try { payload = await response.json(); } catch { payload = null; }

  if (!response.ok) {
    const error =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error ?? "")
        : "";
    throw new Error(error || `Request failed with status ${response.status}.`);
  }

  return payload as T;
}

interface DashboardSnapshotPayload {
  mission: Record<string, unknown> | null;
  recentMissions?: unknown;
  agents: unknown;
  discoveries: unknown;
  logs: unknown;
  signals: unknown;
  thoughts: unknown;
  memory: unknown;
  businessPlans: unknown;
}

async function fetchDashboardSnapshot() {
  const response = await fetch(`${API_BASE}/api/dashboard`, {
    method: "GET",
    cache: "no-store",
  });

  let payload: unknown = null;
  try { payload = await response.json(); } catch { payload = null; }

  if (!response.ok) {
    const error =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error ?? "")
        : "";
    throw new Error(error || `Request failed with status ${response.status}.`);
  }

  return payload as DashboardSnapshotPayload;
}

async function ensureRealtimeReady() {
  if (realtimeSetupPromise) return realtimeSetupPromise;

  realtimeSetupPromise = (async () => {
    await insforge.realtime.connect();
    for (const channel of REALTIME_CHANNELS) {
      const result = await insforge.realtime.subscribe(channel);
      if (!result.ok) {
        throw new Error(result.error?.message ?? `Failed to subscribe to ${channel}`);
      }
    }
  })().catch((err) => {
    realtimeSetupPromise = null;
    throw err;
  });

  return realtimeSetupPromise;
}

/* ------------------------------------------------------------------ */
/*  Normalizers                                                        */
/* ------------------------------------------------------------------ */

function toEpochSeconds(value: string | null | undefined) {
  if (!value) return Math.floor(Date.now() / 1000);
  return Math.floor(new Date(value).getTime() / 1000);
}

function toEpochMilliseconds(value: string | null | undefined) {
  if (!value) return Date.now();
  return new Date(value).getTime();
}

function normalizeEvidenceList(value: unknown): FinalOptionEvidence[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const r = item as Record<string, unknown>;
    return { id: String(r.id ?? ""), platform: String(r.platform ?? ""), title: String(r.title ?? ""), keywords: String(r.keywords ?? ""), summary: String(r.summary ?? ""), url: String(r.url ?? "") };
  }).filter((i) => i.url);
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((i) => String(i ?? "").trim()).filter(Boolean);
}

function normalizeCoverage(value: unknown): FinalOptionsCoverage {
  const r = (value && typeof value === "object") ? value as Record<string, unknown> : {};
  const completed = normalizeStringList(r.completedPlatforms);
  const required = ["youtube", "x", "reddit", "substack"] as const;
  const missing = normalizeStringList(r.missingPlatforms).length > 0
    ? normalizeStringList(r.missingPlatforms)
    : required.filter((p) => !completed.includes(p));
  return { requiredPlatforms: required, completedPlatforms: completed, missingPlatforms: missing, readyForLovable: Boolean(r.readyForLovable) && missing.length === 0 };
}

function normalizeImplementationPlan(value: unknown, fallbackOption: FinalOption | undefined, fallbackEvidence: FinalOptionEvidence[]): FinalImplementationPlan {
  const r = (value && typeof value === "object") ? value as Record<string, unknown> : {};
  const screens = Array.isArray(r.screens) ? r.screens.map((i) => { const s = i as Record<string, unknown>; return { name: String(s.name ?? ""), purpose: String(s.purpose ?? ""), modules: normalizeStringList(s.modules) }; }).filter((s) => s.name || s.purpose || s.modules.length > 0) : [];
  const dataModel = Array.isArray(r.dataModel) ? r.dataModel.map((i) => { const e = i as Record<string, unknown>; return { entity: String(e.entity ?? ""), purpose: String(e.purpose ?? ""), fields: normalizeStringList(e.fields) }; }).filter((e) => e.entity || e.purpose || e.fields.length > 0) : [];
  const workflows = Array.isArray(r.workflows) ? r.workflows.map((i) => { const w = i as Record<string, unknown>; return { name: String(w.name ?? ""), trigger: String(w.trigger ?? ""), outcome: String(w.outcome ?? "") }; }).filter((w) => w.name || w.trigger || w.outcome) : [];
  return {
    generatedBy: "MiniMax-M2.7", title: String(r.title ?? fallbackOption?.title ?? ""), oneLiner: String(r.oneLiner ?? fallbackOption?.concept ?? ""), problem: String(r.problem ?? fallbackOption?.whyPromising ?? ""), targetUsers: String(r.targetUsers ?? fallbackOption?.audience ?? ""), valueProp: String(r.valueProp ?? fallbackOption?.marketAngle ?? ""), whyNow: String(r.whyNow ?? ""),
    coreUserFlows: normalizeStringList(r.coreUserFlows), screens, dataModel, workflows, integrations: normalizeStringList(r.integrations), monetization: String(r.monetization ?? ""), launchPlan: normalizeStringList(r.launchPlan), successMetrics: normalizeStringList(r.successMetrics),
    sourceEvidence: normalizeEvidenceList(r.sourceEvidence).length > 0 ? normalizeEvidenceList(r.sourceEvidence) : fallbackEvidence,
  };
}

function normalizeLovableHandoff(value: unknown, plan: FinalImplementationPlan, fallbackEvidence: FinalOptionEvidence[]): LovableHandoff {
  const r = (value && typeof value === "object") ? value as Record<string, unknown> : {};
  const evidence = normalizeEvidenceList(r.evidence);
  return { title: String(r.title ?? plan.title), prompt: String(r.prompt ?? ""), launchUrl: String(r.launchUrl ?? ""), evidence: evidence.length > 0 ? evidence : fallbackEvidence };
}

function normalizeFinalOptions(value: unknown): FinalOptionsPayload | null {
  if (!value) return null;
  if (typeof value === "string") { try { return normalizeFinalOptions(JSON.parse(value)); } catch { return null; } }
  if (typeof value !== "object") return null;

  const r = value as Record<string, unknown>;
  const options = Array.isArray(r.options) ? r.options as FinalOption[] : [];
  const fallback = options[0];
  const primaryId = String(r.primaryOptionId ?? fallback?.id ?? "");
  const winner = options.find((o) => o.id === primaryId) ?? fallback;
  const fallbackEvidence = winner?.evidence ?? [];
  const coverage = normalizeCoverage(r.coverage);
  const implPlan = normalizeImplementationPlan(r.implementationPlan, winner, fallbackEvidence);
  const lovable = normalizeLovableHandoff(r.lovableHandoff, implPlan, fallbackEvidence);

  return {
    generatedAt: String(r.generatedAt ?? new Date().toISOString()), isFinal: Boolean(r.isFinal),
    marketResearch: { summary: String((r.marketResearch as Record<string, unknown> | undefined)?.summary ?? ""), signals: normalizeStringList((r.marketResearch as Record<string, unknown> | undefined)?.signals) },
    options, primaryOptionId: primaryId, coverage, implementationPlan: implPlan, lovableHandoff: lovable,
  };
}

function normalizeMission(row: Record<string, unknown> | null | undefined): MissionRecord | null {
  if (!row || typeof row !== "object") return null;
  return {
    id: String(row.id), prompt: String(row.prompt ?? ""), status: String(row.status ?? "queued") as MissionRecord["status"],
    createdAt: row.created_at != null ? String(row.created_at) : null,
    stoppedAt: row.stopped_at != null ? String(row.stopped_at) : null,
    liveUrl: (row.live_url_1 as string | null) ?? null, liveUrl2: (row.live_url_2 as string | null) ?? null, liveUrl3: (row.live_url_3 as string | null) ?? null, liveUrl4: (row.live_url_4 as string | null) ?? null, liveUrl5: (row.live_url_5 as string | null) ?? null,
    finalOptions: normalizeFinalOptions(row.final_options),
  };
}

function normalizeAgents(rows: unknown): AgentData[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => { const r = row as Record<string, unknown>; return { _id: String(r.id), agent_id: Number(r.agent_id ?? 0), status: String(r.status ?? "idle") as AgentData["status"], current_url: String(r.current_url ?? ""), profile_id: String(r.profile_path ?? ""), energy: Number(r.energy ?? 100) }; });
}

function normalizeDiscoveries(rows: unknown): DiscoveredContent[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => { const r = row as Record<string, unknown>; return { _id: String(r.id), video_url: String(r.source_url ?? ""), thumbnail: String(r.thumbnail_url ?? ""), found_by_agent_id: Number(r.agent_id ?? 0), keywords: String(r.keywords ?? ""), likes: Number(r.likes ?? 0), views: Number(r.views ?? 0), comments: Number(r.comments ?? 0), _creationTime: toEpochSeconds(r.created_at as string | null) }; });
}

function normalizeLogs(rows: unknown): LogEntry[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => { const r = row as Record<string, unknown>; return { _id: String(r.id), agent_id: Number(r.agent_id ?? 0), message: String(r.message ?? ""), type: String(r.type ?? "status") as LogEntry["type"], timestamp: toEpochSeconds(r.created_at as string | null), metadata: r.metadata ? JSON.stringify(r.metadata) : undefined }; });
}

function normalizeSignals(rows: unknown): AgentSignal[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => { const r = row as Record<string, unknown>; return { _id: String(r.id), fromAgent: Number(r.from_agent ?? 0), toAgent: Number(r.to_agent ?? 0), message: String(r.message ?? ""), signalType: String(r.signal_type ?? "share"), timestamp: toEpochMilliseconds(r.created_at as string | null) }; });
}

function normalizeThoughts(rows: unknown): AgentThought[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => { const r = row as Record<string, unknown>; return { _id: String(r.id), agent_id: r.agent_id != null ? Number(r.agent_id) : null, thought_type: String(r.thought_type ?? "inference") as AgentThought["thought_type"], prompt_summary: String(r.prompt_summary ?? ""), response_summary: String(r.response_summary ?? ""), action_taken: String(r.action_taken ?? ""), model: String(r.model ?? ""), tokens_used: Number(r.tokens_used ?? 0), duration_ms: Number(r.duration_ms ?? 0), timestamp: toEpochMilliseconds(r.created_at as string | null) }; });
}

function normalizeMemory(rows: unknown): AgentMemoryEntry[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => { const r = row as Record<string, unknown>; return { _id: String(r.id), filename: String(r.filename ?? ""), content: String(r.content ?? ""), version: Number(r.version ?? 1), updated_by: r.updated_by != null ? String(r.updated_by) : null, timestamp: toEpochMilliseconds(r.updated_at as string | null) }; });
}

function normalizeBusinessPlans(rows: unknown): BusinessPlan[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => { const r = row as Record<string, unknown>; return { _id: String(r.id), version: Number(r.version ?? 1), market_opportunity: String(r.market_opportunity ?? ""), competitive_landscape: String(r.competitive_landscape ?? ""), revenue_models: String(r.revenue_models ?? ""), user_acquisition: String(r.user_acquisition ?? ""), risk_analysis: String(r.risk_analysis ?? ""), confidence_score: Number(r.confidence_score ?? 0), discovery_count: Number(r.discovery_count ?? 0), is_final: Boolean(r.is_final), raw_plan: String(r.raw_plan ?? ""), timestamp: toEpochMilliseconds(r.created_at as string | null) }; });
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useMasterBuildDashboard() {
  const [latestMission, setLatestMission] = useState<MissionRecord | null>(null);
  const [missionHistory, setMissionHistory] = useState<MissionRecord[]>([]);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [discoveries, setDiscoveries] = useState<DiscoveredContent[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [signals, setSignals] = useState<AgentSignal[]>([]);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [memory, setMemory] = useState<AgentMemoryEntry[]>([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingMission, setIsCreatingMission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reloadTokenRef = useRef(0);
  const loadInFlightRef = useRef(false);
  const reloadQueuedRef = useRef(false);
  const refreshTimerRef = useRef<number | null>(null);
  const previousMissionIdRef = useRef<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (loadInFlightRef.current) {
      reloadQueuedRef.current = true;
      return;
    }

    loadInFlightRef.current = true;
    const token = ++reloadTokenRef.current;

    try {
      const snapshot = await fetchDashboardSnapshot();
      if (token !== reloadTokenRef.current) return;

      startTransition(() => {
        const normalizedLatestMission = normalizeMission(snapshot.mission);
        const normalizedMissionHistory = Array.isArray(snapshot.recentMissions)
          ? snapshot.recentMissions
            .map((row) => normalizeMission(row as Record<string, unknown>))
            .filter((mission): mission is MissionRecord => mission !== null)
          : (normalizedLatestMission ? [normalizedLatestMission] : []);

        setLatestMission(normalizedLatestMission);
        setMissionHistory(normalizedMissionHistory);
        setAgents(normalizeAgents(snapshot.agents));
        setDiscoveries(normalizeDiscoveries(snapshot.discoveries));
        setLogs(normalizeLogs(snapshot.logs));
        setSignals(normalizeSignals(snapshot.signals));
        setThoughts(normalizeThoughts(snapshot.thoughts));
        setMemory(normalizeMemory(snapshot.memory));
        setBusinessPlans(normalizeBusinessPlans(snapshot.businessPlans));
        setError(null);
        setIsLoading(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load research data.");
      setIsLoading(false);
    } finally {
      loadInFlightRef.current = false;
      if (reloadQueuedRef.current) {
        reloadQueuedRef.current = false;
        window.setTimeout(() => { void loadDashboard(); }, 250);
      }
    }
  }, []);

  const scheduleDashboardReload = useCallback(() => {
    if (refreshTimerRef.current !== null) return;
    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null;
      void loadDashboard();
    }, 400);
  }, [loadDashboard]);

  // Initial load
  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  useEffect(() => {
    const missionId = latestMission?.id ?? null;
    if (previousMissionIdRef.current === missionId) return;
    previousMissionIdRef.current = missionId;
    invalidateLiveResearchCache();
  }, [latestMission?.id]);

  // Realtime subscriptions
  useEffect(() => {
    let mounted = true;

    const refresh = () => { if (mounted) scheduleDashboardReload(); };
    const handleDisconnect = () => {
      if (!mounted) return;
      setError("Realtime connection lost. Retrying...");
      realtimeSetupPromise = null;
    };
    const handleError = (err: unknown) => {
      if (!mounted) return;
      setError(err instanceof Error ? err.message : "Realtime connection failed.");
      realtimeSetupPromise = null;
    };

    insforge.realtime.on("disconnect", handleDisconnect);
    insforge.realtime.on("connect_error", handleError);
    for (const ev of REALTIME_EVENTS) {
      insforge.realtime.on(ev, refresh);
    }

    void ensureRealtimeReady().catch((err) => {
      setError(err instanceof Error ? err.message : "Realtime connection failed.");
    });

    return () => {
      mounted = false;
      insforge.realtime.off("disconnect", handleDisconnect);
      insforge.realtime.off("connect_error", handleError);
      for (const ev of REALTIME_EVENTS) {
        insforge.realtime.off(ev, refresh);
      }
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [loadDashboard, scheduleDashboardReload]);

  const createMission = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsCreatingMission(true);
    try {
      const payload = await callMissionControlRoute<{
        mission?: { mission_id?: string; prompt?: string; status?: MissionRecord["status"] };
      }>("/api/mission/create", { prompt: prompt.trim() });

      startTransition(() => {
        setLatestMission({
          id: String(payload.mission?.mission_id ?? ""),
          prompt: String(payload.mission?.prompt ?? prompt.trim()),
          status: payload.mission?.status ?? "queued",
          createdAt: new Date().toISOString(),
          stoppedAt: null,
          liveUrl: null,
          liveUrl2: null,
          liveUrl3: null,
          liveUrl4: null,
          liveUrl5: null,
          finalOptions: null,
        });
        setMissionHistory((current) => {
          const currentMission = current[0];
          const archived = currentMission ? current : [];
          return [
            {
              id: String(payload.mission?.mission_id ?? ""),
              prompt: String(payload.mission?.prompt ?? prompt.trim()),
              status: payload.mission?.status ?? "queued",
              createdAt: new Date().toISOString(),
              stoppedAt: null,
              liveUrl: null,
              liveUrl2: null,
              liveUrl3: null,
              liveUrl4: null,
              liveUrl5: null,
              finalOptions: null,
            },
            ...archived,
          ];
        });
        setAgents([]);
        setDiscoveries([]);
        setLogs([]);
        setSignals([]);
        setThoughts([]);
        setMemory([]);
        setBusinessPlans([]);
        setError(null);
      });
      invalidateLiveResearchCache();
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create mission.");
    } finally {
      setIsCreatingMission(false);
    }
  }, [loadDashboard]);

  const stopAll = useCallback(async () => {
    try {
      await callMissionControlRoute("/api/mission/stop", { missionId: latestMission?.id ?? null });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop mission.");
    }
  }, [latestMission?.id, loadDashboard]);

  const resetAll = useCallback(async () => {
    try {
      await callMissionControlRoute("/api/mission/reset", { missionId: latestMission?.id ?? null });
      invalidateLiveResearchCache(false);
      startTransition(() => {
        setLatestMission(null);
        setMissionHistory([]);
        setAgents([]);
        setDiscoveries([]);
        setLogs([]);
        setSignals([]);
        setThoughts([]);
        setMemory([]);
        setBusinessPlans([]);
        setError(null);
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset.");
    }
  }, [latestMission?.id, loadDashboard]);

  return {
    latestMission, missionHistory, agents, discoveries, logs, signals, thoughts, memory, businessPlans,
    isLoading, isCreatingMission, error,
    createMission, stopAll, resetAll,
  };
}
