export const AGENTS = [
  { id: "youtube-1", agentId: 1, name: "Echo", color: "#ff0033", baseRole: "Video Scan", platform: "youtube" },
  { id: "x-1", agentId: 2, name: "Pulse", color: "#dbe4ee", baseRole: "Conversation Scan", platform: "x" },
  { id: "reddit-1", agentId: 3, name: "Thread", color: "#ff6b35", baseRole: "Community Scan", platform: "reddit" },
  { id: "substack-1", agentId: 4, name: "Ledger", color: "#18b47b", baseRole: "Narrative Scan", platform: "substack" },
  { id: "research-1", agentId: 5, name: "Atlas", color: "#8b5cf6", baseRole: "Market Research", platform: "market_research" },
] as const;

export interface AgentData {
  _id: string;
  agent_id: number;
  status: AgentStatus;
  current_url: string;
  profile_id: string;
  energy: number;
  objective?: string;
  statusDetail?: string;
  retryCount?: number;
  confidence?: number;
  lastHeartbeat?: number | null;
}

export type AgentStatus =
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
  | "error";

export interface AgentSignal {
  _id: string;
  fromAgent: number;
  toAgent: number;
  message: string;
  signalType: string;
  timestamp: number;
}

export interface LogEntry {
  _id: string;
  agent_id: number;
  message: string;
  type:
    | "search"
    | "analysis"
    | "likes"
    | "discovery"
    | "energy_gain"
    | "energy_loss"
    | "task_swap"
    | "status"
    | "error"
    | "refinement"
    | "market_research"
    | "final_options";
  timestamp: number;
  metadata?: string;
}

export interface DiscoveredContent {
  _id: string;
  video_url: string;
  thumbnail: string;
  platform?: string;
  title?: string;
  summary?: string;
  found_by_agent_id: number;
  keywords?: string;
  likes?: number;
  views?: number;
  comments?: number;
  _creationTime?: number;
}

export interface AgentThought {
  _id: string;
  agent_id: number | null;
  thought_type: "inference" | "strategy" | "refinement" | "planning" | "action";
  prompt_summary: string;
  response_summary: string;
  action_taken: string;
  model: string;
  tokens_used: number;
  duration_ms: number;
  timestamp: number;
}

export interface AgentMemoryEntry {
  _id: string;
  filename: string;
  content: string;
  version: number;
  updated_by: string | null;
  timestamp: number;
}

export interface BusinessPlan {
  _id: string;
  version: number;
  market_opportunity: string;
  competitive_landscape: string;
  revenue_models: string;
  user_acquisition: string;
  risk_analysis: string;
  confidence_score: number;
  discovery_count: number;
  is_final: boolean;
  raw_plan: string;
  timestamp: number;
}

export const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#ff0033",
  x: "#1d9bf0",
  reddit: "#ff6b35",
  substack: "#18b47b",
  market_research: "#8b5cf6",
  web: "#10b981",
};

export function getAgentById(agentId: number) {
  return AGENTS.find((agent) => agent.agentId === agentId) ?? AGENTS[0];
}

export function isAgentActiveStatus(status: AgentStatus) {
  return ["queued", "searching", "extracting", "validating", "synthesizing", "found_trend", "reassigning", "exploiting"].includes(status);
}

export function isAgentIssueStatus(status: AgentStatus) {
  return ["weak", "blocked", "failed", "stale", "error"].includes(status);
}

export function isAgentCompleteStatus(status: AgentStatus) {
  return status === "done" || status === "stopped";
}

export function getLogIcon(type: string) {
  switch (type) {
    case "search":
      return "search";
    case "analysis":
      return "activity";
    case "likes":
      return "heart";
    case "discovery":
      return "sparkles";
    case "energy_gain":
      return "zap";
    case "energy_loss":
      return "battery-low";
    case "task_swap":
      return "refresh-cw";
    case "status":
      return "radio";
    case "error":
      return "alert-circle";
    case "refinement":
      return "lightbulb";
    case "market_research":
      return "trending-up";
    case "final_options":
      return "compass";
    default:
      return "circle";
  }
}
