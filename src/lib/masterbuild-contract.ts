export const MASTERBUILD_DASHBOARD_CONTRACT_VERSION = "masterbuild-dashboard-v1";

export const MASTERBUILD_DASHBOARD_KEYS = [
  "mission",
  "recentMissions",
  "agents",
  "discoveries",
  "logs",
  "signals",
  "thoughts",
  "memory",
  "businessPlans",
] as const;

export type MasterBuildDashboardKey = (typeof MASTERBUILD_DASHBOARD_KEYS)[number];

export type MasterBuildMissionStatus =
  | "queued"
  | "active"
  | "stopping"
  | "stopped"
  | "completed"
  | "error"
  | string;

export type MasterBuildAgentStatus =
  | "idle"
  | "queued"
  | "searching"
  | "extracting"
  | "validating"
  | "synthesizing"
  | "found_trend"
  | "weak"
  | "reassigning"
  | "exploiting"
  | "blocked"
  | "done"
  | "failed"
  | "stale"
  | "stopped"
  | "error"
  | string;

export interface MasterBuildMissionRow {
  id: string;
  prompt: string;
  status: MasterBuildMissionStatus;
  live_url_1?: string | null;
  live_url_2?: string | null;
  live_url_3?: string | null;
  live_url_4?: string | null;
  live_url_5?: string | null;
  final_options?: unknown;
  created_at?: string | null;
  stopped_at?: string | null;
}

export interface MasterBuildAgentRow {
  id: string;
  agent_id: number;
  name?: string | null;
  platform?: string | null;
  role?: string | null;
  status: MasterBuildAgentStatus;
  current_url?: string | null;
  profile_path?: string | null;
  assignment?: string | null;
  energy?: number | null;
  status_detail?: string | null;
  failure_reason?: string | null;
  retry_count?: number | null;
  confidence?: number | null;
  last_heartbeat?: string | null;
}

export interface MasterBuildDiscoveryRow {
  id: string;
  source_url: string;
  thumbnail_url?: string | null;
  agent_id: number;
  platform: string;
  title: string;
  summary?: string | null;
  keywords?: string | null;
  industry?: string | null;
  likes?: number | null;
  views?: number | null;
  comments?: number | null;
  created_at?: string | null;
}

export interface MasterBuildLogRow {
  id: string;
  agent_id?: number | null;
  message: string;
  type: string;
  metadata?: unknown;
  created_at?: string | null;
}

export interface MasterBuildSignalRow {
  id: string;
  from_agent: number;
  to_agent: number;
  message: string;
  signal_type: string;
  created_at?: string | null;
}

export interface MasterBuildThoughtRow {
  id: string;
  agent_id?: number | null;
  thought_type: string;
  prompt_summary?: string | null;
  response_summary?: string | null;
  action_taken?: string | null;
  model?: string | null;
  tokens_used?: number | null;
  duration_ms?: number | null;
  created_at?: string | null;
}

export interface MasterBuildMemoryRow {
  id: string;
  filename: string;
  content: string;
  version?: number | null;
  updated_by?: string | null;
  updated_at?: string | null;
}

export interface MasterBuildBusinessPlanRow {
  id: string;
  version: number;
  market_opportunity: string;
  competitive_landscape: string;
  revenue_models: string;
  user_acquisition: string;
  risk_analysis: string;
  confidence_score?: number | null;
  discovery_count?: number | null;
  is_final?: boolean | null;
  raw_plan?: string | null;
  created_at?: string | null;
}

export interface MasterBuildDashboardSnapshot {
  mission: MasterBuildMissionRow | null;
  recentMissions: MasterBuildMissionRow[];
  agents: MasterBuildAgentRow[];
  discoveries: MasterBuildDiscoveryRow[];
  logs: MasterBuildLogRow[];
  signals: MasterBuildSignalRow[];
  thoughts: MasterBuildThoughtRow[];
  memory: MasterBuildMemoryRow[];
  businessPlans: MasterBuildBusinessPlanRow[];
}

export interface MasterBuildMissionCreateResponse {
  ok: true;
  mission: {
    mission_id: string;
    prompt: string;
    status: MasterBuildMissionStatus;
    supersededMissionIds: string[];
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function hasMasterBuildDashboardShape(value: unknown): value is MasterBuildDashboardSnapshot {
  if (!isRecord(value)) return false;
  if (value.mission !== null && !isRecord(value.mission)) return false;

  return MASTERBUILD_DASHBOARD_KEYS
    .filter((key) => key !== "mission")
    .every((key) => Array.isArray(value[key]));
}
