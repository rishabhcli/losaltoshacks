import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { inferWithOpenAI } from "./lib/openai.mjs";
import { generateSpeechWithElevenLabs } from "./lib/elevenlabs.mjs";
import { generateSpeechWithMiniMax } from "./lib/minimax.mjs";
import { loadProjectEnv } from "./lib/env.mjs";
import { createServerInsforgeClient } from "./lib/insforge-server.mjs";
import {
  getLinkedInsforgeAdminKey,
  getLinkedInsforgeBaseUrl,
} from "./lib/linked-insforge.mjs";
import { vectorSearch, storeDiscoveriesWithEmbeddings } from "./lib/mongodb-vector.mjs";

loadProjectEnv();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1);
});

const port = Number.parseInt(process.env.AI_SERVER_PORT || "3001", 10);

function resolveMasterbuildRuntimeDir() {
  const envRuntime = process.env.MASTERBUILD_RUNTIME_DIR;
  return envRuntime
    ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), envRuntime))
    : path.join(process.cwd(), "runtime");
}

/** Clear local JPEG previews for browser-use agents (default 1–4). */
function clearBrowserAgentPreviewFrames(agentIds = [1, 2, 3, 4]) {
  try {
    const runtimeDir = resolveMasterbuildRuntimeDir();
    for (const aid of agentIds) {
      const framePath = path.join(runtimeDir, "previews", `agent-${aid}`, "latest.jpg");
      if (fs.existsSync(framePath)) fs.unlinkSync(framePath);
    }
  } catch (err) {
    console.warn("[ai-server] clearBrowserAgentPreviewFrames:", err?.message ?? err);
  }
}

function writeJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function hasAnyEnv(names) {
  return names.some((name) => String(process.env[name] ?? "").trim().length > 0);
}

function getFirstEnv(names) {
  for (const name of names) {
    const value = String(process.env[name] ?? "").trim();
    if (value) return value;
  }
  return "";
}

function compactHealthMessage(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function getPythonCommand() {
  return getFirstEnv(["PYTHON", "PYTHON_BIN", "PYTHON_EXECUTABLE"]) || "python";
}

function parseWorkerPreflightOutput(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const jsonStart = trimmed.indexOf("{");
    const jsonEnd = trimmed.lastIndexOf("}");
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1));
      } catch {
        return null;
      }
    }
  }

  return null;
}

let workerPreflightCache = null;
let workerPreflightInFlight = null;

function getWorkerPreflightCacheTtlMs() {
  const ttlMs = Number.parseInt(process.env.MASTERBUILD_WORKER_PREFLIGHT_CACHE_MS || "30000", 10);
  return Number.isFinite(ttlMs) && ttlMs >= 0 ? ttlMs : 30000;
}

function withWorkerPreflightStrictness(payload, strict) {
  const workerCanStart = Boolean(payload?.workerCanStart);
  const liveMissionReady = Boolean(payload?.liveMissionReady);
  const ok = strict ? liveMissionReady : workerCanStart;

  return {
    ...payload,
    strict,
    ok,
    exitCode: ok ? 0 : 1,
  };
}

function runWorkerPreflight({ strict = false } = {}) {
  const timeoutMs = Number.parseInt(process.env.MASTERBUILD_WORKER_PREFLIGHT_TIMEOUT_MS || "15000", 10);
  const args = ["scripts/verify-live-worker-preflight.py"];
  if (strict) args.push("--strict");

  return new Promise((resolve) => {
    execFile(
      getPythonCommand(),
      args,
      {
        cwd: process.cwd(),
        timeout: Number.isFinite(timeoutMs) ? timeoutMs : 15000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        const payload = parseWorkerPreflightOutput(stdout);
        const exitCode = typeof error?.code === "number" ? error.code : 0;

        if (payload && typeof payload === "object") {
          resolve({
            ...payload,
            exitCode,
          });
          return;
        }

        resolve({
          ok: false,
          strict,
          workerCanStart: false,
          liveMissionReady: false,
          exitCode,
          error: error?.killed ? "worker_preflight_timeout" : "worker_preflight_parse_failed",
          message: compactHealthMessage(stderr || error?.message || stdout || "Worker preflight failed before returning JSON."),
        });
      }
    );
  });
}

async function getWorkerPreflight({ strict = false } = {}) {
  const ttlMs = getWorkerPreflightCacheTtlMs();
  const now = Date.now();
  if (workerPreflightCache && now - workerPreflightCache.createdAt <= ttlMs) {
    return withWorkerPreflightStrictness(workerPreflightCache.payload, strict);
  }

  if (!workerPreflightInFlight) {
    workerPreflightInFlight = runWorkerPreflight({ strict: false })
      .then((payload) => {
        workerPreflightCache = {
          createdAt: Date.now(),
          payload,
        };
        return payload;
      })
      .finally(() => {
        workerPreflightInFlight = null;
      });
  }

  const payload = await workerPreflightInFlight;
  return withWorkerPreflightStrictness(payload, strict);
}

async function probeInsForgeDatabase() {
  const baseUrl = (
    getFirstEnv(["MASTERBUILD_INSFORGE_URL", "VITE_INSFORGE_URL"]) ||
    getLinkedInsforgeBaseUrl()
  ).replace(/\/+$/, "");
  const token =
    getFirstEnv(["INSFORGE_SERVICE_ROLE_KEY"]) ||
    getLinkedInsforgeAdminKey(baseUrl) ||
    getFirstEnv(["VITE_INSFORGE_ANON_KEY"]);

  if (!baseUrl || !token) {
    return {
      ok: false,
      status: DEMO_MODE ? "demo-fallback" : "missing",
      message: "InsForge live database credentials are missing.",
      action: "Set MASTERBUILD_INSFORGE_URL or VITE_INSFORGE_URL, plus INSFORGE_SERVICE_ROLE_KEY or VITE_INSFORGE_ANON_KEY.",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/database/records/missions?limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(2500),
    });
    if (response.ok) {
      return {
        ok: true,
        status: "ready",
        message: "InsForge database is reachable and the masterbuild mission table is queryable.",
        action: "",
      };
    }

    const body = compactHealthMessage(await response.text());
    return {
      ok: false,
      status: "unreachable",
      message: `InsForge database probe failed with HTTP ${response.status}${body ? `: ${body}` : ""}`,
      action: "Verify the configured InsForge app is running and that insforge/masterbuild_schema.sql has been applied to that same backend.",
    };
  } catch (error) {
    return {
      ok: false,
      status: "unreachable",
      message: `InsForge database probe failed: ${compactHealthMessage(error?.message ?? error)}`,
      action: "Verify the configured InsForge app is running and reachable from this machine.",
    };
  }
}

function getRuntimeDirHealth() {
  const runtimeDir = resolveMasterbuildRuntimeDir();
  try {
    fs.accessSync(runtimeDir, fs.constants.W_OK);
    return {
      name: "runtime-dir",
      ok: true,
      required: false,
      status: "ready",
      message: `Runtime directory is writable: ${runtimeDir}`,
      action: "",
    };
  } catch {
    return {
      name: "runtime-dir",
      ok: false,
      required: false,
      status: "degraded",
      message: `Runtime directory is not currently writable or does not exist: ${runtimeDir}`,
      action: "Create the runtime directory or set MASTERBUILD_RUNTIME_DIR to a writable path for browser preview frames.",
    };
  }
}

function getPythonWorkerHealth({ insforgeReady, openAiConfigured, minimaxConfigured }) {
  const openAiBaseUrl = getFirstEnv(["OPENAI_BROWSER_BASE_URL", "OPENAI_BASE_URL"]) || "https://api.openai.com/v1";
  const openAiModel = getFirstEnv(["OPENAI_BROWSER_MODEL", "OPENAI_MODEL"]) || "gpt-4o";
  const minimaxBaseUrl = getFirstEnv(["MINIMAX_BASE_URL"]) || "https://api.minimax.io/v1";
  const minimaxModel = getFirstEnv(["MASTERBUILD_AI_MODEL"]) || "MiniMax-M2.7";
  const liveLlmConfigured = openAiConfigured || minimaxConfigured;
  const ready = insforgeReady && liveLlmConfigured;

  if (!insforgeReady) {
    return {
      name: "python-worker",
      ok: false,
      required: !DEMO_MODE,
      status: "blocked",
      message: "Python worker cannot claim live missions until InsForge is reachable.",
      action: "Fix the InsForge health check first, then rerun pnpm worker:preflight.",
      openAiBaseUrl,
      openAiModel,
      minimaxBaseUrl,
      minimaxModel,
    };
  }

  return {
    name: "python-worker",
    ok: ready,
    required: !DEMO_MODE,
    status: ready ? "ready" : "missing-llm",
    message: ready
      ? "Python worker can reach InsForge and has a live LLM provider configured."
      : "Python worker can reach InsForge, but live mission execution is blocked by missing LLM credentials.",
    action: ready
      ? ""
      : "Set OPENAI_API_KEY for OpenAI inference, or MINIMAX_API_KEY for the worker fallback. Use OPENAI_BASE_URL or OPENAI_BROWSER_BASE_URL for compatible gateways.",
    openAiBaseUrl,
    openAiModel,
    minimaxBaseUrl,
    minimaxModel,
  };
}

async function buildHealthReport() {
  const openAiConfigured = hasAnyEnv(["OPENAI_API_KEY"]);
  const minimaxConfigured = hasAnyEnv(["MINIMAX_API_KEY"]);
  const mongoConfigured = hasAnyEnv(["MONGODB_URI", "MONGODB_ATLAS_URI"]);
  const ttsConfigured = hasAnyEnv(["ELEVENLABS_API_KEY", "MINIMAX_API_KEY"]);
  const braveConfigured = hasAnyEnv(["BRAVE_SEARCH_API_KEY"]);
  const insforgeProbe = await probeInsForgeDatabase();

  const checks = [
    {
      name: "ai-server",
      ok: true,
      required: true,
      status: "ready",
      message: "AI server process is accepting requests.",
      action: "",
    },
    {
      name: "insforge",
      ok: insforgeProbe.ok,
      required: !DEMO_MODE,
      status: insforgeProbe.status,
      message: insforgeProbe.message,
      action: insforgeProbe.action,
    },
    {
      name: "openai",
      ok: openAiConfigured || DEMO_MODE,
      required: !DEMO_MODE,
      status: openAiConfigured ? "ready" : "demo-fallback",
      message: openAiConfigured
        ? "OpenAI inference is configured for live synthesis."
        : "OpenAI inference is unavailable; demo mode uses deterministic seeded payloads.",
      action: openAiConfigured ? "" : "Set OPENAI_API_KEY for live recommendation and report synthesis.",
    },
    getPythonWorkerHealth({
      insforgeReady: insforgeProbe.ok,
      openAiConfigured,
      minimaxConfigured,
    }),
    {
      name: "mongodb-vector",
      ok: mongoConfigured,
      required: false,
      status: mongoConfigured ? "ready" : "optional-missing",
      message: mongoConfigured
        ? "MongoDB vector storage/search is configured."
        : "MongoDB vector search is disabled; keyword/demo data remains usable.",
      action: mongoConfigured ? "" : "Set MONGODB_URI or MONGODB_ATLAS_URI to enable semantic evidence search.",
    },
    {
      name: "tts",
      ok: ttsConfigured,
      required: false,
      status: ttsConfigured ? "ready" : "optional-missing",
      message: ttsConfigured
        ? "At least one TTS provider is configured."
        : "Audio generation is disabled; text briefings remain usable.",
      action: ttsConfigured ? "" : "Set ELEVENLABS_API_KEY or MINIMAX_API_KEY to enable briefing audio.",
    },
    {
      name: "brave-search",
      ok: braveConfigured,
      required: false,
      status: braveConfigured ? "ready" : "optional-missing",
      message: braveConfigured
        ? "Brave Search is configured for background refresh."
        : "Background refresh will skip Brave Search and rely on live agents or demo data.",
      action: braveConfigured ? "" : "Set BRAVE_SEARCH_API_KEY to enable background web search.",
    },
    getRuntimeDirHealth(),
  ];
  const missingRequired = checks.filter((check) => check.required && !check.ok).map((check) => check.name);

  return {
    ok: missingRequired.length === 0,
    service: "ai-server",
    demoMode: DEMO_MODE,
    status: missingRequired.length === 0 ? "ready" : "degraded",
    timestamp: new Date().toISOString(),
    missingRequired,
    checks,
  };
}

/* ------------------------------------------------------------------ */
/*  Mission CRUD helpers                                               */
/* ------------------------------------------------------------------ */

const AGENT_ROWS = [
  { agentId: 1, name: "Echo", platform: "youtube", role: "Shorts Scan", previewUrl: "/agent-stream/1" },
  { agentId: 2, name: "Pulse", platform: "x", role: "Conversation Scan", previewUrl: "/agent-stream/2" },
  { agentId: 3, name: "Thread", platform: "reddit", role: "Community Scan", previewUrl: "/agent-stream/3" },
  { agentId: 4, name: "Ledger", platform: "substack", role: "Narrative Scan", previewUrl: "/agent-stream/4" },
  { agentId: 5, name: "Atlas", platform: "market_research", role: "Market Research", previewUrl: "/agent-stream/5" },
];

const RESETTABLE_TABLES = [
  "logs", "discoveries", "signals", "control_commands", "builder_outputs", "agent_memory",
];

const MISSION_COLUMNS = "id,prompt,status,live_url_1,live_url_2,live_url_3,live_url_4,live_url_5,final_options,created_at,stopped_at";
const AGENT_COLUMNS = "id,agent_id,name,platform,role,status,current_url,profile_path,assignment,energy,status_detail,failure_reason,retry_count,confidence,last_heartbeat";
const LEGACY_AGENT_COLUMNS = "id,agent_id,status,current_url,profile_path,energy";
const DISCOVERY_COLUMNS = "id,source_url,thumbnail_url,agent_id,platform,title,summary,keywords,industry,likes,views,comments,created_at";
const LOG_COLUMNS = "id,agent_id,message,type,metadata,created_at";
const SIGNAL_COLUMNS = "id,from_agent,to_agent,message,signal_type,created_at";
const THOUGHT_COLUMNS = "id,agent_id,thought_type,prompt_summary,response_summary,action_taken,model,tokens_used,duration_ms,created_at";
const MEMORY_COLUMNS = "id,filename,content,version,updated_by,updated_at";
const BUSINESS_PLAN_COLUMNS = "id,version,market_opportunity,competitive_landscape,revenue_models,user_acquisition,risk_analysis,confidence_score,discovery_count,is_final,raw_plan,created_at";
const DASHBOARD_CACHE_TTL_MS = 10000;
const USER_MISSION_LOOKBACK_LIMIT = 100;

const AGENT_LIFECYCLE_FIELDS = ["status_detail", "failure_reason", "retry_count", "confidence"];
const LEGACY_AGENT_STATUS = {
  queued: "idle",
  extracting: "searching",
  validating: "searching",
  synthesizing: "searching",
  blocked: "weak",
  done: "found_trend",
  failed: "error",
  stale: "weak",
};

function stringifyError(error) {
  if (!error) return "";
  const pieces = [
    typeof error === "string" ? error : "",
    typeof error?.message === "string" ? error.message : "",
    typeof error?.details === "string" ? error.details : "",
    typeof error?.hint === "string" ? error.hint : "",
    typeof error?.code === "string" ? error.code : "",
  ];
  try {
    pieces.push(JSON.stringify(error));
  } catch {
    pieces.push(String(error));
  }
  return pieces.join(" ").toLowerCase();
}

function isAgentLifecycleSchemaError(error) {
  const text = stringifyError(error);
  return (
    AGENT_LIFECYCLE_FIELDS.some((field) => text.includes(field)) ||
    text.includes("agents_status_check") ||
    text.includes("violates check constraint") ||
    text.includes("schema cache")
  );
}

function toLegacyAgentPayload(payload) {
  const legacy = { ...payload };
  const detail = String(legacy.status_detail ?? legacy.failure_reason ?? "").trim();
  for (const field of AGENT_LIFECYCLE_FIELDS) {
    delete legacy[field];
  }
  if (typeof legacy.status === "string" && LEGACY_AGENT_STATUS[legacy.status]) {
    legacy.status = LEGACY_AGENT_STATUS[legacy.status];
  }
  if (detail && !String(legacy.assignment ?? "").trim()) {
    legacy.assignment = detail.slice(0, 120);
  }
  return legacy;
}

async function insertAgentRows(insforge, rows, context = "agent insert") {
  const result = await insforge.database.from("agents").insert(rows);
  if (!result.error || !isAgentLifecycleSchemaError(result.error)) return result;

  console.warn(`[ai-server] ${context} retried without lifecycle columns: ${result.error.message ?? result.error}`);
  return insforge.database.from("agents").insert(rows.map(toLegacyAgentPayload));
}

async function updateAgentsByMission(insforge, missionId, values, context = "agent update") {
  const result = await insforge.database.from("agents").update(values).eq("mission_id", missionId);
  if (!result.error || !isAgentLifecycleSchemaError(result.error)) return result;

  console.warn(`[ai-server] ${context} retried without lifecycle columns: ${result.error.message ?? result.error}`);
  return insforge.database.from("agents").update(toLegacyAgentPayload(values)).eq("mission_id", missionId);
}

async function updateAgentByMissionAndId(insforge, missionId, agentId, values, context = "agent update") {
  const result = await insforge.database
    .from("agents")
    .update(values)
    .eq("mission_id", missionId)
    .eq("agent_id", agentId);
  if (!result.error || !isAgentLifecycleSchemaError(result.error)) return result;

  console.warn(`[ai-server] ${context} retried without lifecycle columns: ${result.error.message ?? result.error}`);
  return insforge.database
    .from("agents")
    .update(toLegacyAgentPayload(values))
    .eq("mission_id", missionId)
    .eq("agent_id", agentId);
}

async function fetchAgentsForDashboard(insforge, missionId) {
  const result = await insforge.database
    .from("agents")
    .select(AGENT_COLUMNS)
    .eq("mission_id", missionId)
    .order("agent_id", { ascending: true });
  if (!result.error || !isAgentLifecycleSchemaError(result.error)) return result;

  console.warn(`[ai-server] dashboard agent select retried with legacy columns: ${result.error.message ?? result.error}`);
  return insforge.database
    .from("agents")
    .select(LEGACY_AGENT_COLUMNS)
    .eq("mission_id", missionId)
    .order("agent_id", { ascending: true });
}

let dashboardSnapshotCache = null;
let dashboardSnapshotFetchedAt = 0;
let dashboardSnapshotInFlight = null;

const BACKGROUND_MISSION_PROMPT_PREFIX = "Background market research:";
const DEMO_MODE = ["1", "true", "yes"].includes(String(process.env.MARKETPULSE_DEMO_MODE ?? "").toLowerCase());

let demoDashboardState = null;

function demoTimestamp(minutesAgo = 0) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function emptyDashboardSnapshot() {
  return {
    mission: null,
    recentMissions: [],
    agents: [],
    discoveries: [],
    logs: [],
    signals: [],
    thoughts: [],
    memory: [],
    businessPlans: [],
  };
}

function buildDemoEvidence(prompt) {
  return [
    {
      id: "demo-evidence-1",
      platform: "youtube",
      title: "Gen Z creators are packaging burnout recovery as weekly routines",
      keywords: "recovery routines, burnout reset, wellness planner",
      summary: `Short-form creators are turning ${prompt || "AI wellness"} into repeatable recovery rituals with high save intent.`,
      url: "https://www.youtube.com/results?search_query=gen+z+burnout+recovery+routine",
      likes: 18400,
      views: 248000,
      comments: 920,
    },
    {
      id: "demo-evidence-2",
      platform: "reddit",
      title: "Students want lightweight accountability without therapy-like friction",
      keywords: "accountability, low pressure coaching, student wellness",
      summary: "Community discussion points to demand for practical nudges, calendar prompts, and private check-ins instead of heavy clinical positioning.",
      url: "https://www.reddit.com/search/?q=student%20burnout%20accountability%20app",
      likes: 6100,
      views: 82000,
      comments: 340,
    },
    {
      id: "demo-evidence-3",
      platform: "substack",
      title: "Wellness newsletters are moving from inspiration to operating plans",
      keywords: "weekly planning, wellness systems, behavior design",
      summary: "Operator-focused wellness writers are bundling prompts, habit loops, and weekly templates into paid playbooks.",
      url: "https://substack.com/search/wellness%20planning%20burnout",
      likes: 1200,
      views: 31000,
      comments: 84,
    },
  ];
}

function buildDemoFinalOptions(prompt, evidence) {
  return {
    generatedAt: demoTimestamp(),
    isFinal: true,
    marketResearch: {
      summary: `MarketPulse found early but credible demand for ${prompt || "AI wellness apps"} when the offer is framed as a practical recovery operating system rather than a generic chatbot.`,
      signals: ["High save intent", "Low-pressure coaching", "Weekly routine packaging"],
    },
    options: [
      {
        id: "demo-option-1",
        title: "Gen Z Recovery Planner",
        concept: "A lightweight AI planner that turns burnout signals into a weekly recovery plan, calendar nudges, and private accountability loops.",
        audience: "Students and first-job Gen Z professionals who want help without a clinical onboarding flow.",
        whyPromising: "The strongest evidence clusters around routines, accountability, and save-worthy planning content.",
        marketAngle: "Position as an operating ritual for recovery, not another wellness chatbot.",
        recommendedFormat: "Mobile-first planner",
        evidence,
      },
      {
        id: "demo-option-2",
        title: "Creator Recovery Kits",
        concept: "Downloadable recovery templates sold through wellness creators and student communities.",
        audience: "Wellness creators and newsletter operators with Gen Z audiences.",
        whyPromising: "Evidence shows creator-led rituals can become repeatable products.",
        marketAngle: "Start as a template bundle before expanding into software.",
        recommendedFormat: "Digital product",
        evidence: evidence.slice(0, 2),
      },
    ],
    primaryOptionId: "demo-option-1",
    coverage: {
      requiredPlatforms: ["youtube", "x", "reddit", "substack"],
      completedPlatforms: ["youtube", "reddit", "substack"],
      missingPlatforms: ["x"],
      readyForLovable: false,
    },
    implementationPlan: {
      generatedBy: "MiniMax-M2.7",
      title: "Gen Z Recovery Planner",
      oneLiner: "A weekly recovery operating system for students and early-career workers.",
      problem: "Burned-out users want low-friction recovery help, but most apps feel clinical, generic, or too heavy.",
      targetUsers: "Gen Z students and first-job professionals",
      valueProp: "Turn messy stress signals into a simple weekly plan with evidence-backed nudges.",
      whyNow: "Social evidence is shifting from wellness inspiration toward repeatable recovery systems.",
      coreUserFlows: ["Run a weekly burnout check", "Generate a recovery plan", "Track private accountability"],
      screens: [
        { name: "Weekly Reset", purpose: "Collect stress signals and constraints", modules: ["check-in", "calendar import", "energy score"] },
        { name: "Recovery Plan", purpose: "Show the recommended weekly plan", modules: ["tasks", "nudge schedule", "evidence notes"] },
      ],
      dataModel: [
        { entity: "RecoveryPlan", purpose: "Stores weekly plans and user rationale", fields: ["energyScore", "planItems", "evidenceIds"] },
      ],
      workflows: [
        { name: "Sunday reset", trigger: "User starts weekly check-in", outcome: "Personalized recovery plan" },
      ],
      integrations: ["Calendar", "Push notifications"],
      monetization: "$9/month individual plan; creator bundles for acquisition.",
      launchPlan: ["Ship a template MVP", "Partner with three wellness creators", "Measure weekly plan completion"],
      successMetrics: ["40% week-two retention", "25% plan completion lift", "Creator CAC below $18"],
      sourceEvidence: evidence,
    },
    lovableHandoff: {
      title: "Build Gen Z Recovery Planner",
      prompt: "Build a mobile-first recovery planner with weekly check-ins, evidence-backed recommendations, and private accountability loops.",
      launchUrl: "",
      evidence,
    },
  };
}

function buildDemoDashboardState(prompt, status = "completed") {
  const missionId = `demo-${crypto.randomUUID()}`;
  const createdAt = demoTimestamp(18);
  const evidence = buildDemoEvidence(prompt);
  const finalOptions = buildDemoFinalOptions(prompt, evidence);
  const discoveries = evidence.map((item, index) => ({
    id: item.id,
    mission_id: missionId,
    agent_id: index === 0 ? 1 : index === 1 ? 3 : 4,
    platform: item.platform,
    title: item.title,
    source_url: item.url,
    thumbnail_url: "",
    keywords: item.keywords,
    likes: item.likes,
    views: item.views,
    comments: item.comments,
    summary: item.summary,
    industry: "wellness-fitness",
    created_at: demoTimestamp(14 - index * 4),
  }));

  return {
    mission: normalizeMissionPreviewUrls({
      id: missionId,
      prompt,
      status,
      live_url_1: "/agent-stream/1",
      live_url_2: "/agent-stream/2",
      live_url_3: "/agent-stream/3",
      live_url_4: "/agent-stream/4",
      live_url_5: "/agent-stream/5",
      final_options: finalOptions,
      created_at: createdAt,
      stopped_at: status === "stopped" ? demoTimestamp() : null,
    }),
    recentMissions: [],
    agents: AGENT_ROWS.map((agent, index) => {
      const demoAgentState = [
        {
          status: "done",
          current_url: discoveries[0]?.source_url ?? "",
          energy: 92,
          objective: "Scan short-form wellness routines and extract save-worthy demand.",
          status_detail: "Found creator-led burnout recovery routines with high engagement.",
          confidence: 0.86,
          retry_count: 0,
          last_heartbeat: demoTimestamp(2),
        },
        {
          status: "failed",
          current_url: "",
          energy: 0,
          objective: "Validate X conversation velocity for student burnout accountability.",
          status_detail: "X coverage is unavailable in demo mode, so this channel remains a trust gap.",
          confidence: 0.18,
          retry_count: 2,
          failure_reason: "Missing X/Twitter source coverage",
          last_heartbeat: demoTimestamp(26),
        },
        {
          status: "done",
          current_url: discoveries[1]?.source_url ?? "",
          energy: 88,
          objective: "Validate community pain points in student and early-career threads.",
          status_detail: "Validated low-pressure accountability demand in community discussion.",
          confidence: 0.78,
          retry_count: 0,
          last_heartbeat: demoTimestamp(4),
        },
        {
          status: "stale",
          current_url: discoveries[2]?.source_url ?? "",
          energy: 38,
          objective: "Track newsletter narratives for repeatable recovery playbooks.",
          status_detail: "Last heartbeat is stale; use the Substack signal, but refresh before launch decisions.",
          confidence: 0.61,
          retry_count: 1,
          last_heartbeat: demoTimestamp(47),
        },
        {
          status: "synthesizing",
          current_url: "/agent-stream/5",
          energy: 82,
          objective: "Synthesize evidence into final options, business plan, and recommendation payloads.",
          status_detail: "Published final options with explicit missing-channel warnings.",
          confidence: 0.82,
          retry_count: 0,
          last_heartbeat: demoTimestamp(1),
        },
      ][index] ?? {};

      return {
        id: `demo-agent-${agent.agentId}`,
        agent_id: agent.agentId,
        name: agent.name,
        platform: agent.platform,
        role: agent.role,
        profile_path: `demo/${agent.name.toLowerCase()}`,
        ...demoAgentState,
      };
    }),
    discoveries,
    logs: [
      {
        id: "demo-log-1",
        agent_id: 1,
        type: "discovery",
        message: "Echo found repeat saves around burnout recovery routines.",
        metadata: { evidenceId: "demo-evidence-1" },
        created_at: demoTimestamp(12),
      },
      {
        id: "demo-log-2",
        agent_id: 3,
        type: "analysis",
        message: "Thread validated that low-pressure accountability is a recurring user need.",
        metadata: { evidenceId: "demo-evidence-2" },
        created_at: demoTimestamp(8),
      },
      {
        id: "demo-log-3",
        agent_id: 5,
        type: "final_options",
        message: "Atlas synthesized two evidence-backed opportunity paths and recommended the planner wedge.",
        metadata: { optionId: "demo-option-1" },
        created_at: demoTimestamp(3),
      },
      {
        id: "demo-log-4",
        agent_id: 2,
        type: "error",
        message: "Pulse could not validate X coverage; final output is marked partial until that channel is refreshed.",
        metadata: { platform: "x", recovery: "retry_source" },
        created_at: demoTimestamp(2),
      },
    ],
    signals: [
      {
        id: "demo-signal-1",
        from_agent: 3,
        to_agent: 5,
        message: "Reddit discussions support low-friction accountability.",
        signal_type: "validation",
        created_at: demoTimestamp(7),
      },
    ],
    thoughts: [
      {
        id: "demo-thought-1",
        agent_id: 5,
        thought_type: "strategy",
        prompt_summary: "Rank the strongest opportunity from evidence.",
        response_summary: "Planner wedge beats template bundle because it compounds weekly retention data.",
        action_taken: "Recommended Gen Z Recovery Planner",
        model: "demo-synthesis",
        tokens_used: 0,
        duration_ms: 0,
        created_at: demoTimestamp(2),
      },
    ],
    memory: [
      {
        id: "demo-memory-1",
        filename: "mission-summary.md",
        content: "Evidence supports a weekly recovery planning wedge with creator-led acquisition.",
        version: 1,
        updated_by: "Atlas",
        updated_at: demoTimestamp(1),
      },
    ],
    businessPlans: [
      {
        id: "demo-plan-1",
        version: 1,
        market_opportunity: "A mobile-first weekly recovery planner can own the space between wellness content and clinical mental-health apps.",
        competitive_landscape: "Generic habit trackers and therapy apps leave room for a lighter operating ritual.",
        revenue_models: "$9/month subscription, creator affiliate bundles, and campus ambassador cohorts.",
        user_acquisition: "Start with wellness creators whose audiences already save recovery routine content.",
        risk_analysis: "Avoid medical claims, keep recommendations practical, and label uncertainty clearly.",
        confidence_score: 82,
        discovery_count: discoveries.length,
        is_final: true,
        raw_plan: "Recommended: launch the Gen Z Recovery Planner MVP with weekly reset, plan generation, and creator-led acquisition.",
        created_at: demoTimestamp(),
      },
    ],
  };
}

async function handleDemoMissionCreate(request, response) {
  const body = await readJsonBody(request);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return writeJson(response, 400, { error: "mission_prompt_required" });
  }

  demoDashboardState = buildDemoDashboardState(prompt);
  writeJson(response, 200, {
    ok: true,
    demoMode: true,
    mission: {
      mission_id: demoDashboardState.mission.id,
      prompt,
      status: demoDashboardState.mission.status,
      supersededMissionIds: [],
    },
  });
}

async function handleDemoMissionStop(_request, response) {
  if (demoDashboardState?.mission) {
    demoDashboardState = {
      ...demoDashboardState,
      mission: { ...demoDashboardState.mission, status: "stopped", stopped_at: demoTimestamp() },
      agents: demoDashboardState.agents.map((agent) => ({ ...agent, status: "stopped", energy: 0 })),
    };
  }
  writeJson(response, 200, { ok: true, demoMode: true, missionId: demoDashboardState?.mission?.id ?? null });
}

async function handleDemoMissionReset(_request, response) {
  const missionId = demoDashboardState?.mission?.id ?? null;
  demoDashboardState = null;
  writeJson(response, 200, { ok: true, demoMode: true, missionId });
}

async function handleDemoAgentRetry(request, response) {
  const body = await readJsonBody(request);
  const agentId = Number(body?.agentId);

  if (!Number.isInteger(agentId) || agentId < 1 || agentId > 5) {
    return writeJson(response, 400, { error: "agent_id_invalid" });
  }
  if (!demoDashboardState?.mission) {
    return writeJson(response, 404, { error: "mission_not_found" });
  }

  const agentDef = AGENT_ROWS.find((agent) => agent.agentId === agentId);
  const timestamp = demoTimestamp();
  const missionId = demoDashboardState.mission.id;
  let updatedAgent = null;

  demoDashboardState = {
    ...demoDashboardState,
    mission: {
      ...demoDashboardState.mission,
      status: "queued",
      stopped_at: null,
    },
    agents: demoDashboardState.agents.map((agent) => {
      if (Number(agent.agent_id) !== agentId) return agent;
      updatedAgent = {
        ...agent,
        status: "queued",
        current_url: "",
        energy: 100,
        status_detail: "Retry requested from command UI. Waiting for worker pickup.",
        failure_reason: "",
        retry_count: Number(agent.retry_count ?? 0) + 1,
        confidence: null,
        last_heartbeat: timestamp,
      };
      return updatedAgent;
    }),
    logs: [
      {
        id: `demo-log-retry-${agentId}-${Date.now()}`,
        agent_id: agentId,
        type: "status",
        message: `Retry requested for ${agentDef?.name ?? `agent ${agentId}`}.`,
        metadata: { agentId, source: "ui", command: "retry_agent" },
        created_at: timestamp,
      },
      ...demoDashboardState.logs,
    ],
  };

  writeJson(response, 200, {
    ok: true,
    demoMode: true,
    missionId,
    agentId,
    agent: updatedAgent,
  });
}

function demoTrendsPayload() {
  if (!demoDashboardState?.mission) return { trends: [], insights: [] };
  const missionId = String(demoDashboardState.mission.id);
  const missionPrompt = String(demoDashboardState.mission.prompt ?? "");
  const sources = demoDashboardState.discoveries.map((discovery) => ({
    id: discovery.id,
    url: discovery.source_url,
    thumbnail: discovery.thumbnail_url || null,
    platform: discovery.platform,
    title: discovery.title,
    summary: discovery.summary,
    keywords: discovery.keywords,
    likes: discovery.likes,
    views: discovery.views,
    comments: discovery.comments,
  }));

  return {
    missionId,
    missionPrompt,
    trends: [
      {
        $primaryKey: `demo-trend-${missionId}-1`,
        trendId: `demo-trend-${missionId}-1`,
        title: "Recovery Routine Planners",
        description: "Evidence clusters around weekly burnout resets, lightweight accountability, and creator-packaged recovery systems.",
        industry: "wellness-fitness",
        category: "Live Research",
        status: "growing",
        trendScore: 88,
        mentionCount: 361000,
        growthRate: 34.8,
        sentimentScore: 0.68,
        topKeywords: "recovery routines, burnout reset, accountability",
        detectedAt: demoTimestamp(),
        sources,
      },
      {
        $primaryKey: `demo-trend-${missionId}-2`,
        trendId: `demo-trend-${missionId}-2`,
        title: "Low-pressure Coaching",
        description: "Users want practical nudges and private check-ins without a clinical or therapy-like onboarding flow.",
        industry: "wellness-fitness",
        category: "Live Research",
        status: "emerging",
        trendScore: 77,
        mentionCount: 119000,
        growthRate: 21.4,
        sentimentScore: 0.54,
        topKeywords: "low pressure coaching, private check-ins, student wellness",
        detectedAt: demoTimestamp(),
        sources: sources.slice(1),
      },
    ],
    insights: [
      {
        $primaryKey: `demo-insight-${missionId}-1`,
        insightId: `demo-insight-${missionId}-1`,
        title: "Market Opportunity",
        summary: "The strongest wedge is a weekly recovery planner that turns social wellness intent into a repeatable operating ritual.",
        insightType: "opportunity",
        industry: "wellness-fitness",
        generatedAt: demoTimestamp(),
        relatedTrendIds: `demo-trend-${missionId}-1`,
      },
      {
        $primaryKey: `demo-insight-${missionId}-2`,
        insightId: `demo-insight-${missionId}-2`,
        title: "Evidence Risk",
        summary: "The X/Twitter channel is still missing, so channel diversity is not yet complete.",
        insightType: "alert",
        industry: "wellness-fitness",
        generatedAt: demoTimestamp(),
        relatedTrendIds: `demo-trend-${missionId}-1`,
      },
    ],
  };
}

function demoRecommendationsPayload() {
  if (!demoDashboardState?.mission) return { recommendations: [] };
  const missionId = String(demoDashboardState.mission.id);
  const trendId = `demo-trend-${missionId}-1`;
  const sourceEvidence = demoDashboardState.discoveries.map((discovery) => ({
    id: discovery.id,
    url: discovery.source_url,
    thumbnail: discovery.thumbnail_url || null,
    platform: discovery.platform,
    title: discovery.title,
    summary: discovery.summary,
    keywords: discovery.keywords,
    likes: discovery.likes,
    views: discovery.views,
    comments: discovery.comments,
  }));

  return {
    missionId,
    recommendations: [
      {
        $primaryKey: `demo-rec-${missionId}-1`,
        recommendationId: `demo-rec-${missionId}-1`,
        trendId,
        title: "Launch Gen Z Recovery Planner",
        description: "Ship a lightweight weekly reset planner that converts burnout signals into recovery tasks, calendar nudges, and private accountability.",
        industry: "wellness-fitness",
        productCategory: "Platform",
        targetDemographic: "Gen Z students and early-career professionals",
        confidenceScore: 0.84,
        estimatedRevenuePotential: "$42K/month",
        priority: "high",
        status: "new",
        actionPlan: "Prototype the weekly reset flow, recruit three wellness creators, and measure plan completion for two cohorts.",
        sourceTrendTitle: "Recovery Routine Planners",
        sourceEvidence,
        createdAt: demoTimestamp(),
      },
      {
        $primaryKey: `demo-rec-${missionId}-2`,
        recommendationId: `demo-rec-${missionId}-2`,
        trendId,
        title: "Sell Creator Recovery Kits",
        description: "Package weekly reset templates and accountability scripts for creators who already publish wellness routines.",
        industry: "wellness-fitness",
        productCategory: "Content",
        targetDemographic: "Wellness creators with student audiences",
        confidenceScore: 0.73,
        estimatedRevenuePotential: "$18K first quarter",
        priority: "medium",
        status: "new",
        actionPlan: "Create the first template pack, test creator affiliate economics, and promote through newsletters.",
        sourceTrendTitle: "Recovery Routine Planners",
        sourceEvidence: sourceEvidence.slice(0, 2),
        createdAt: demoTimestamp(),
      },
    ],
  };
}

function invalidateDashboardSnapshot() {
  dashboardSnapshotCache = null;
  dashboardSnapshotFetchedAt = 0;
}

function isBackgroundMissionPrompt(prompt) {
  return typeof prompt === "string" && prompt.startsWith(BACKGROUND_MISSION_PROMPT_PREFIX);
}

function selectLatestUserFacingMission(rows) {
  if (!Array.isArray(rows)) return null;
  return rows.find((row) => !isBackgroundMissionPrompt(row?.prompt)) ?? null;
}

function filterUserFacingMissions(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.filter((row) => !isBackgroundMissionPrompt(row?.prompt));
}

function normalizeMissionPreviewUrls(row) {
  if (!row || typeof row !== "object") return row;
  const mission = { ...row };
  for (const agentId of [1, 2, 3, 4]) {
    const key = `live_url_${agentId}`;
    const value = mission[key];
    if (typeof value !== "string" || value.trim() === "") {
      mission[key] = `/agent-stream/${agentId}`;
    }
  }
  if (typeof mission.live_url_5 !== "string" || mission.live_url_5.trim() === "") {
    mission.live_url_5 = "/agent-stream/5";
  }
  return mission;
}

async function resolveMissionId(insforge, missionId) {
  if (missionId) return missionId;

  const result = await insforge.database
    .from("missions")
    .select("id,prompt")
    .order("created_at", { ascending: false })
    .limit(USER_MISSION_LOOKBACK_LIMIT);

  if (result.error) throw result.error;

  const row = selectLatestUserFacingMission(result.data ?? []) ?? result.data?.[0];
  return typeof row?.id === "string" && row.id.trim() ? row.id : null;
}

/* ------------------------------------------------------------------ */
/*  Route: POST /api/mission/create                                    */
/* ------------------------------------------------------------------ */

async function handleMissionCreate(request, response) {
  const body = await readJsonBody(request);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return writeJson(response, 400, { error: "mission_prompt_required" });
  }

  const insforge = createServerInsforgeClient();
  const priorMissionResult = await insforge.database
    .from("missions")
    .select("id,status")
    .order("created_at", { ascending: false })
    .limit(10);

  if (priorMissionResult.error) throw priorMissionResult.error;

  const supersededMissionIds = (priorMissionResult.data ?? [])
    .filter((mission) => ["queued", "active", "stopping"].includes(String(mission.status ?? "")))
    .map((mission) => String(mission.id ?? ""))
    .filter(Boolean);

  if (supersededMissionIds.length > 0) {
    for (const priorMissionId of supersededMissionIds) {
      const stopCommand = await insforge.database.from("control_commands").insert([{
        mission_id: priorMissionId,
        command: "stop_all",
        payload: { source: "superseded_by_new_mission", replacementPrompt: prompt },
        status: "pending",
      }]);
      if (stopCommand.error) throw stopCommand.error;

      const missionStopping = await insforge.database
        .from("missions")
        .update({ status: "stopping" })
        .eq("id", priorMissionId);
      if (missionStopping.error) throw missionStopping.error;

      const agentStopping = await updateAgentsByMission(insforge, priorMissionId, {
        status: "stopped",
        energy: 0,
        status_detail: "Superseded by a newer research request.",
        failure_reason: "",
        last_heartbeat: new Date().toISOString(),
      }, "superseded mission agent update");
      if (agentStopping.error) throw agentStopping.error;

      const latestPlan = await insforge.database
        .from("business_plans")
        .select("id")
        .eq("mission_id", priorMissionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (latestPlan.error) throw latestPlan.error;
      if (latestPlan.data?.id) {
        const markFinal = await insforge.database
          .from("business_plans")
          .update({ is_final: true })
          .eq("id", latestPlan.data.id);
        if (markFinal.error) throw markFinal.error;
      }
    }
  }

  clearBrowserAgentPreviewFrames([1, 2, 3, 4, 5]);

  const missionId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const missionInsert = await insforge.database.from("missions").insert([{
    id: missionId,
    prompt,
    status: "queued",
    live_url_1: null,
    live_url_2: null,
    live_url_3: null,
    live_url_4: null,
    live_url_5: "/agent-stream/5",
    created_at: timestamp,
    updated_at: timestamp,
  }]);

  if (missionInsert.error) throw missionInsert.error;

  try {
    const agentInsert = await insertAgentRows(
      insforge,
      AGENT_ROWS.map((agent) => ({
        mission_id: missionId,
        agent_id: agent.agentId,
        name: agent.name,
        platform: agent.platform,
        role: agent.role,
        status: "queued",
        preview_url: agent.previewUrl,
        assignment: prompt,
        energy: 100,
        status_detail: "Queued for worker pickup.",
        failure_reason: "",
        retry_count: 0,
        confidence: null,
        created_at: timestamp,
        updated_at: timestamp,
        last_heartbeat: timestamp,
      })),
      "mission create agent insert"
    );

    if (agentInsert.error) throw agentInsert.error;

    const logInsert = await insforge.database.from("logs").insert([{
      mission_id: missionId,
      agent_id: null,
      type: "status",
      message:
        supersededMissionIds.length > 0
          ? "New request accepted. Stopping the previous mission and switching the worker now."
          : "Mission created. Worker pickup should begin shortly.",
      metadata: { prompt, supersededMissionIds },
      created_at: timestamp,
    }]);

    if (logInsert.error) throw logInsert.error;
  } catch (insertError) {
    await insforge.database.from("missions").delete().eq("id", missionId);
    throw insertError;
  }

  invalidateDashboardSnapshot();
  invalidateRecsCache();

  writeJson(response, 200, {
    ok: true,
    mission: { mission_id: missionId, prompt, status: "queued", supersededMissionIds },
  });
}

/* ------------------------------------------------------------------ */
/*  Route: POST /api/mission/stop                                      */
/* ------------------------------------------------------------------ */

async function handleMissionStop(request, response) {
  const body = await readJsonBody(request);
  const missionId = typeof body?.missionId === "string" && body.missionId.trim()
    ? body.missionId.trim()
    : null;

  const insforge = createServerInsforgeClient();
  const targetId = await resolveMissionId(insforge, missionId);

  if (!targetId) {
    return writeJson(response, 200, { ok: true, missionId: null });
  }

  const commandResult = await insforge.database.from("control_commands").insert([{
    mission_id: targetId,
    command: "stop_all",
    payload: { source: "ui" },
    status: "pending",
  }]);
  if (commandResult.error) throw commandResult.error;

  const missionUpdate = await insforge.database
    .from("missions")
    .update({ status: "stopping" })
    .eq("id", targetId);
  if (missionUpdate.error) throw missionUpdate.error;

  const agentUpdate = await updateAgentsByMission(insforge, targetId, {
    status: "stopped",
    energy: 0,
    status_detail: "Stopped from the command UI.",
    failure_reason: "",
    last_heartbeat: new Date().toISOString(),
  }, "mission stop agent update");
  if (agentUpdate.error) throw agentUpdate.error;

  // Immediate UX: blank the four browser preview tiles; Python runtime will also wind down.
  clearBrowserAgentPreviewFrames([1, 2, 3, 4]);

  // Persist latest synthesized plan into history as the saved checkpoint for this stop.
  const latestPlan = await insforge.database
    .from("business_plans")
    .select("id")
    .eq("mission_id", targetId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latestPlan.error && latestPlan.data?.id) {
    await insforge.database
      .from("business_plans")
      .update({ is_final: true })
      .eq("id", latestPlan.data.id);
  }

  invalidateDashboardSnapshot();

  writeJson(response, 200, { ok: true, missionId: targetId });
}

/* ------------------------------------------------------------------ */
/*  Route: POST /api/mission/reset                                     */
/* ------------------------------------------------------------------ */

async function handleMissionReset(request, response) {
  const body = await readJsonBody(request);
  const missionId = typeof body?.missionId === "string" && body.missionId.trim()
    ? body.missionId.trim()
    : null;

  const insforge = createServerInsforgeClient();
  const targetId = await resolveMissionId(insforge, missionId);

  if (!targetId) {
    return writeJson(response, 200, { ok: true, missionId: null, message: "No active mission to reset" });
  }

  console.log(`[ai-server] Starting reset for mission: ${targetId}`);

  try {
    // Send stop command first
    const stopResult = await insforge.database.from("control_commands").insert([{
      mission_id: targetId,
      command: "stop_all",
      payload: { source: "reset" },
      status: "pending",
    }]);
    if (stopResult.error) {
      console.warn(`[ai-server] Stop command insert failed (non-fatal): ${stopResult.error.message}`);
    }

    // Wait for agents to acknowledge stop
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Delete data from resettable tables - continue on error for each table
    const deleteErrors = [];
    for (const table of RESETTABLE_TABLES) {
      try {
        const deleteResult = await insforge.database
          .from(table)
          .delete()
          .eq("mission_id", targetId);
        if (deleteResult.error) {
          console.warn(`[ai-server] Failed to delete from ${table}: ${deleteResult.error.message}`);
          deleteErrors.push({ table, error: deleteResult.error.message });
        } else {
          console.log(`[ai-server] Deleted from ${table}`);
        }
      } catch (err) {
        console.warn(`[ai-server] Exception deleting from ${table}: ${err?.message ?? err}`);
        deleteErrors.push({ table, error: err?.message ?? String(err) });
      }
    }

    // Reset agents to idle - non-blocking if it fails
    const agentReset = await updateAgentsByMission(
      insforge,
      targetId,
      {
        status: "idle",
        current_url: "",
        assignment: "",
        energy: 100,
        status_detail: "Reset and ready for a new mission.",
        failure_reason: "",
        retry_count: 0,
        confidence: null,
        session_id: null,
        preview_bucket: null,
        preview_key: null,
        preview_updated_at: null,
        last_heartbeat: new Date().toISOString(),
      },
      "mission reset agent update"
    );
    if (agentReset.error) {
      console.warn(`[ai-server] Agent reset warning: ${agentReset.error.message}`);
    }

    clearBrowserAgentPreviewFrames([1, 2, 3, 4, 5]);

    // Reset mission to stopped
    const missionReset = await insforge.database
      .from("missions")
      .update({
        status: "stopped",
        stopped_at: new Date().toISOString(),
        refined_idea: null,
        final_options: null,
      })
      .eq("id", targetId);
    if (missionReset.error) {
      console.warn(`[ai-server] Mission reset warning: ${missionReset.error.message}`);
    }

    // Clear caches
    invalidateDashboardSnapshot();
    invalidateRecsCache();

    console.log(`[ai-server] Reset complete for mission: ${targetId}`);

    writeJson(response, 200, {
      ok: true,
      missionId: targetId,
      deleteErrors: deleteErrors.length > 0 ? deleteErrors : undefined,
    });
  } catch (error) {
    console.error(`[ai-server] Reset failed for mission ${targetId}:`, error);
    writeJson(response, 500, {
      ok: false,
      error: error?.message ?? "Reset failed",
      missionId: targetId,
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Route: POST /api/agent/retry                                      */
/* ------------------------------------------------------------------ */

async function handleAgentRetry(request, response) {
  const body = await readJsonBody(request);
  const agentId = Number(body?.agentId);
  const missionId = typeof body?.missionId === "string" && body.missionId.trim()
    ? body.missionId.trim()
    : null;

  if (!Number.isInteger(agentId) || agentId < 1 || agentId > 5) {
    return writeJson(response, 400, { error: "agent_id_invalid" });
  }

  const insforge = createServerInsforgeClient();
  const targetId = await resolveMissionId(insforge, missionId);

  if (!targetId) {
    return writeJson(response, 404, { error: "mission_not_found" });
  }

  const missionResult = await insforge.database
    .from("missions")
    .select("id,status")
    .eq("id", targetId)
    .maybeSingle();
  if (missionResult.error) throw missionResult.error;
  if (!missionResult.data) {
    return writeJson(response, 404, { error: "mission_not_found" });
  }
  if (String(missionResult.data.status ?? "") === "stopping") {
    return writeJson(response, 409, { error: "mission_stopping" });
  }

  const agentResult = await insforge.database
    .from("agents")
    .select("id,agent_id,name,platform,role,retry_count,assignment,status")
    .eq("mission_id", targetId)
    .eq("agent_id", agentId)
    .maybeSingle();
  if (agentResult.error) throw agentResult.error;
  if (!agentResult.data) {
    return writeJson(response, 404, { error: "agent_not_found", missionId: targetId, agentId });
  }

  const timestamp = new Date().toISOString();
  const retryCount = Number.isFinite(Number(agentResult.data.retry_count))
    ? Number(agentResult.data.retry_count) + 1
    : 1;
  const agentName = String(agentResult.data.name ?? `Agent ${agentId}`);
  const platform = String(agentResult.data.platform ?? "");

  const commandResult = await insforge.database.from("control_commands").insert([{
    mission_id: targetId,
    command: "retry_agent",
    payload: {
      source: "ui",
      agentId,
      agentName,
      platform,
      priorStatus: String(agentResult.data.status ?? ""),
    },
    status: "pending",
  }]);
  if (commandResult.error) throw commandResult.error;

  const agentUpdate = await updateAgentByMissionAndId(insforge, targetId, agentId, {
    status: "queued",
    current_url: "",
    energy: 100,
    status_detail: "Retry requested from command UI. Waiting for worker pickup.",
    failure_reason: "",
    retry_count: retryCount,
    confidence: null,
    last_heartbeat: timestamp,
  }, "agent retry update");
  if (agentUpdate.error) throw agentUpdate.error;

  if (["completed", "error", "stopped"].includes(String(missionResult.data.status ?? ""))) {
    const missionUpdate = await insforge.database
      .from("missions")
      .update({ status: "queued", stopped_at: null })
      .eq("id", targetId);
    if (missionUpdate.error) throw missionUpdate.error;
  }

  const logResult = await insforge.database.from("logs").insert([{
    mission_id: targetId,
    agent_id: agentId,
    type: "status",
    message: `Retry requested for ${agentName}.`,
    metadata: { source: "ui", command: "retry_agent", agentId, platform },
    created_at: timestamp,
  }]);
  if (logResult.error) throw logResult.error;

  invalidateDashboardSnapshot();

  writeJson(response, 200, {
    ok: true,
    missionId: targetId,
    agentId,
    retryCount,
  });
}

/* ------------------------------------------------------------------ */
/*  Route: GET /api/dashboard                                          */
/* ------------------------------------------------------------------ */

async function fetchDashboardSnapshot() {
  const insforge = createServerInsforgeClient();

  const missionRowsResult = await insforge.database
    .from("missions")
    .select(MISSION_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(USER_MISSION_LOOKBACK_LIMIT);

  if (missionRowsResult.error) throw missionRowsResult.error;

  const missionRows = missionRowsResult.data ?? [];
  const mission = normalizeMissionPreviewUrls(selectLatestUserFacingMission(missionRows));

  const missionId =
    mission && typeof mission === "object" && "id" in mission
      ? String(mission.id ?? "")
      : "";

  if (!missionId) {
    return {
      mission: null,
      recentMissions: [],
      agents: [],
      discoveries: [],
      logs: [],
      signals: [],
      thoughts: [],
      memory: [],
      businessPlans: [],
    };
  }

  const [agentResult, discoveryResult, logResult, signalResult, thoughtsResult, memoryResult, businessPlanResult] =
    await Promise.all([
      fetchAgentsForDashboard(insforge, missionId),
      insforge.database.from("discoveries").select(DISCOVERY_COLUMNS).eq("mission_id", missionId).order("created_at", { ascending: false }).limit(100),
      insforge.database.from("logs").select(LOG_COLUMNS).eq("mission_id", missionId).order("created_at", { ascending: false }).limit(60),
      insforge.database.from("signals").select(SIGNAL_COLUMNS).eq("mission_id", missionId).order("created_at", { ascending: false }).limit(60),
      insforge.database.from("agent_thoughts").select(THOUGHT_COLUMNS).eq("mission_id", missionId).order("created_at", { ascending: false }).limit(100),
      insforge.database.from("agent_memory").select(MEMORY_COLUMNS).eq("mission_id", missionId).order("filename", { ascending: true }),
      insforge.database.from("business_plans").select(BUSINESS_PLAN_COLUMNS).eq("mission_id", missionId).order("created_at", { ascending: false }).limit(20),
    ]);

  const firstError = agentResult.error ?? discoveryResult.error ?? logResult.error ?? signalResult.error;
  if (firstError) throw firstError;

  return {
    mission,
    recentMissions: filterUserFacingMissions(missionRows).map((row) => normalizeMissionPreviewUrls(row)).slice(0, 12),
    agents: agentResult.data ?? [],
    discoveries: discoveryResult.data ?? [],
    logs: logResult.data ?? [],
    signals: signalResult.data ?? [],
    thoughts: thoughtsResult.error ? [] : (thoughtsResult.data ?? []),
    memory: memoryResult.error ? [] : (memoryResult.data ?? []),
    businessPlans: businessPlanResult.error ? [] : (businessPlanResult.data ?? []),
  };
}

async function handleDashboard(_request, response) {
  const now = Date.now();
  if (dashboardSnapshotCache && now - dashboardSnapshotFetchedAt < DASHBOARD_CACHE_TTL_MS) {
    writeJson(response, 200, dashboardSnapshotCache);
    return;
  }

  if (!dashboardSnapshotInFlight) {
    dashboardSnapshotInFlight = fetchDashboardSnapshot()
      .then((snapshot) => {
        dashboardSnapshotCache = snapshot;
        dashboardSnapshotFetchedAt = Date.now();
        return snapshot;
      })
      .finally(() => {
        dashboardSnapshotInFlight = null;
      });
  }

  try {
    const snapshot = await dashboardSnapshotInFlight;
    writeJson(response, 200, snapshot);
  } catch (error) {
    console.error("[ai-server] Failed to load dashboard snapshot.", error);
    if (dashboardSnapshotCache) {
      writeJson(response, 200, dashboardSnapshotCache);
      return;
    }
    writeJson(response, 500, { error: error.message || "Internal Server Error" });
  }
}

/* ------------------------------------------------------------------ */
/*  Route: GET /api/trends                                             */
/* ------------------------------------------------------------------ */

const PLATFORM_BY_AGENT_ID = { 1: "youtube", 2: "x", 3: "reddit", 4: "substack", 5: "market_research" };
const STOP_WORDS = new Set([
  // articles, prepositions, conjunctions
  "the","and","for","with","that","this","from","have","are","its","can","will",
  "not","but","our","was","were","been","being","has","had","does","did","make",
  "into","onto","over","under","about","above","after","before","between","through",
  "more","most","some","just","even","only","other","also","than","then","when",
  "them","they","their","here","how","why","what","where","who","which","while",
  // generic content words that add no signal
  "trend","trends","trending","best","top","list","tips","ways","guide","year",
  "time","like","your","into","made","take","find","look","know","show","work",
  "need","want","help","good","great","news","week","month","post","blog","site",
  "read","seen","said","says","now","new","get","got","see","say","use","used",
  "latest","viral","right","full","free","very","ever","well","many","much",
  "such","both","last","next","each","same","long","high","came","come","said",
  // platforms / companies (too common across all queries to be signal)
  "reddit","tiktok","youtube","twitter","instagram","facebook","google","apple",
  "amazon","microsoft","linkedin","snapchat","pinterest","spotify","netflix",
  // years
  "2024","2025","2026","2023","2022",
]);

const SOURCE_NOISE_PHRASES = new Set([
  "vogue business",
  "business of fashion",
  "business insider",
  "wall street journal",
  "new york times",
  "financial times",
  "washington post",
  "harvard business review",
  "fast company",
  "associated press",
]);

const SOURCE_NOISE_WORDS = new Set([
  "vogue","forbes","fortune","wired","techcrunch","reuters","bloomberg","guardian",
  "journal","times","insider","newsletter","magazine","editorial","substack","axios",
  "hbr","businessoffashion",
]);

const BROAD_TREND_TERMS = new Set([
  "fashion","clothing","apparel","beauty","skincare","wellness","fitness","food","beverage",
  "drink","travel","hospitality","finance","fintech","health","healthcare","education",
  "entertainment","media","gaming","creator","economy","software","saas","technology",
  "tech","product","products","service","services","tool","tools","platform","platforms",
  "brand","brands","market","markets","industry","industries","consumer","consumers",
  "content","audience","demand","growth","opportunity","opportunities","trend","trends",
  "viral","shopping","retail","commerce","startup","business","companies","company",
]);

const ACTIONABLE_SIGNAL_TERMS = new Set([
  "pants","jeans","dress","dresses","skirt","skirts","shorts","hoodie","hoodies","jacket",
  "jackets","coat","coats","sneaker","sneakers","loafer","loafers","heel","heels","flat",
  "flats","boot","boots","bag","bags","tote","wallet","watch","glasses","serum","cleanser",
  "mask","moisturizer","lip","lipstick","fragrance","perfume","supplement","supplements",
  "powder","snack","snacks","soda","coffee","tea","protein","meal","meals","retreat",
  "retreats","package","packages","trip","trips","tour","tours","membership","memberships",
  "subscription","subscriptions","concierge","clinic","therapy","coaching","course","courses",
  "tutoring","dashboard","assistant","copilot","generator","agent","agents","workflow",
  "automation","integrations","integration","api","apis","plugin","plugins","marketplace",
  "community","communities","network","service","services","platform","app","apps","feature",
  "features","program","programs","bundle","bundles","capsule","collection","collections",
]);

const DISPLAY_WORD_OVERRIDES = new Map([
  ["ai", "AI"],
  ["api", "API"],
  ["saas", "SaaS"],
  ["b2b", "B2B"],
  ["d2c", "D2C"],
  ["ux", "UX"],
  ["ui", "UI"],
  ["crm", "CRM"],
]);

function cleanPhrase(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "")
    .trim();
}

function tokenizePhrase(value) {
  return cleanPhrase(value)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function toDisplayPhrase(value) {
  return cleanPhrase(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (DISPLAY_WORD_OVERRIDES.has(lower)) return DISPLAY_WORD_OVERRIDES.get(lower);
      if (/^\d+[a-z]+$/i.test(word)) return word.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function rankPhraseCandidates(values, missionPrompt = "") {
  const missionLower = cleanPhrase(missionPrompt).toLowerCase();
  const ranked = [];

  for (const rawValue of values) {
    const phrase = cleanPhrase(rawValue);
    const lower = phrase.toLowerCase();
    if (!phrase || looksLikeSourceNoise(phrase)) continue;

    const tokens = tokenizePhrase(phrase);
    if (!tokens.length) continue;
    if (tokens.every((token) => STOP_WORDS.has(token) || SOURCE_NOISE_WORDS.has(token))) continue;

    let score = 0;
    if (tokens.length >= 2) score += 4;
    if (tokens.length >= 3 && tokens.length <= 4) score += 1;
    if (tokens.length > 5) score -= 2;
    if (tokens.some((token) => ACTIONABLE_SIGNAL_TERMS.has(token))) score += 4;
    if (tokens.every((token) => BROAD_TREND_TERMS.has(token) || STOP_WORDS.has(token))) score -= 7;
    if (tokens.length === 1 && BROAD_TREND_TERMS.has(tokens[0])) score -= 5;
    if (/(trend|trending|viral|market|industry|business|consumer|audience|growth|opportunity)/.test(lower)) score -= 3;
    if (missionLower && lower === missionLower) score -= 4;

    score += tokens.filter((token) => !BROAD_TREND_TERMS.has(token) && !STOP_WORDS.has(token)).length;

    ranked.push({ phrase, lower, score });
  }

  ranked.sort((a, b) => b.score - a.score || b.phrase.length - a.phrase.length);

  const deduped = [];
  for (const candidate of ranked) {
    if (deduped.some((existing) => existing.lower === candidate.lower || existing.lower.includes(candidate.lower) || candidate.lower.includes(existing.lower))) {
      continue;
    }
    deduped.push(candidate);
  }

  return deduped;
}

function pickPrimaryTrendSignal(keyword, data, missionPrompt = "") {
  const ranked = rankPhraseCandidates([
    keyword,
    ...data.keywordPhrases,
    ...data.allKeywords,
  ], missionPrompt);
  return ranked[0]?.phrase || cleanPhrase(keyword);
}

function looksLikeSourceNoise(value) {
  const phrase = cleanPhrase(value).toLowerCase();
  if (!phrase) return false;
  if (SOURCE_NOISE_PHRASES.has(phrase)) return true;
  const words = phrase.split(/\s+/).filter(Boolean);
  return words.length > 0 && words.length <= 3 && words.every((word) => SOURCE_NOISE_WORDS.has(word));
}

function stripSourceSuffix(title) {
  const raw = String(title ?? "").trim();
  if (!raw) return "";

  const parts = raw.split(/\s(?:\||[-–—]|•|·)\s/).map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) {
    const tail = parts[parts.length - 1];
    if (looksLikeSourceNoise(tail) || tail.split(/\s+/).length <= 3) {
      return parts.slice(0, -1).join(" ").trim();
    }
  }

  const colonIndex = raw.indexOf(":");
  if (colonIndex > 0) {
    const prefix = raw.slice(0, colonIndex).trim();
    if (looksLikeSourceNoise(prefix)) {
      return raw.slice(colonIndex + 1).trim();
    }
  }

  return raw;
}

function formatHumanList(items) {
  const values = items.filter(Boolean);
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values[0]}, ${values[1]}, and ${values[2]}`;
}

function pickSpecificSignals(keyword, data, missionPrompt = "") {
  const keywordLower = keyword.toLowerCase();
  const ranked = rankPhraseCandidates([
    ...data.keywordPhrases,
    ...[...data.allKeywords].filter((item) => item !== keywordLower),
  ], missionPrompt)
    .filter((candidate) => candidate.lower !== keywordLower);

  return ranked.slice(0, 4).map((candidate) => candidate.phrase);
}

function pickEvidenceSentence(keyword, data, specificSignals) {
  const keywordLower = keyword.toLowerCase();
  const signalNeedles = specificSignals.map((signal) => signal.toLowerCase());
  for (const rawSummary of data.summaryHints ?? []) {
    const summary = String(rawSummary ?? "").replace(/\s+/g, " ").trim();
    if (!summary) continue;
    const sentences = summary.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      if (sentence.length < 40) continue;
      if (lower.includes(keywordLower) || signalNeedles.some((needle) => lower.includes(needle))) {
        return sentence;
      }
    }
  }
  return "";
}

function inferTrendLens(keyword, missionPrompt, specificSignals, evidenceSentence) {
  const context = `${keyword} ${specificSignals.join(" ")} ${evidenceSentence} ${missionPrompt}`.toLowerCase();
  if (/(software|saas|automation|ai|app|platform|tool|copilot|workflow|developer|code|api)/.test(context)) return "tools";
  if (/(hotel|travel|trip|stay|booking|destination|tour|retreat|experience|package)/.test(context)) return "services";
  if (/(payment|bank|invest|insurance|loan|merchant|treasury|finance|fintech)/.test(context)) return "services";
  if (/(fashion|wear|style|dress|bag|shoe|apparel|accessor|beauty|skincare|cosmetic|serum|beverage|drink|food|snack|coffee|supplement|wearable|device)/.test(context)) return "products";
  return "areas";
}

function synthesizeTrendsFromDiscoveries(discoveries, missionPrompt, missionId) {
  if (!discoveries.length) return [];

  const keywordGroups = new Map();

  for (const disc of discoveries) {
    const rawKeywords = disc.keywords ?? "";
    const keywords = rawKeywords
      .split(",")
      .map((k) => cleanPhrase(k).toLowerCase())
      .filter((k) => k.length > 3 && !STOP_WORDS.has(k) && !looksLikeSourceNoise(k));

    const engagement =
      (disc.likes ?? 0) +
      Math.floor((disc.views ?? 0) / 100) +
      (disc.comments ?? 0) * 5;

    const platform = PLATFORM_BY_AGENT_ID[disc.agent_id] ?? "unknown";

    const discIndustry = disc.industry ?? "All";

    for (const kw of keywords.slice(0, 4)) {
      if (!keywordGroups.has(kw)) {
        keywordGroups.set(kw, {
          count: 0,
          engagement: 0,
          platforms: new Set(),
          sources: [],
          industries: {},
          allKeywords: new Set(),
          keywordPhrases: new Set(),
          summaryHints: [],
        });
      }
      const g = keywordGroups.get(kw);
      g.count++;
      g.engagement += engagement;
      g.platforms.add(platform);
      // Track industry vote counts to pick the dominant industry for this trend
      g.industries[discIndustry] = (g.industries[discIndustry] ?? 0) + 1;
      // Collect all keywords for description generation
      keywords.forEach(k => g.allKeywords.add(k));
      rawKeywords
        .split(",")
        .map((phrase) => cleanPhrase(phrase))
        .filter(Boolean)
        .forEach((phrase) => {
          if (!looksLikeSourceNoise(phrase)) g.keywordPhrases.add(phrase);
        });
      const titleHints = extractKeywordsFromResult(disc.title ?? "", disc.summary ?? "");
      titleHints
        .split(",")
        .map((phrase) => cleanPhrase(phrase))
        .filter(Boolean)
        .forEach((phrase) => {
          if (!looksLikeSourceNoise(phrase)) g.keywordPhrases.add(phrase);
        });
      if (disc.summary) {
        const summary = String(disc.summary).trim();
        if (summary && !g.summaryHints.includes(summary) && g.summaryHints.length < 10) {
          g.summaryHints.push(summary);
        }
      }
      // Collect up to 8 clickable sources per keyword group
      if (disc.source_url && g.sources.length < 8) {
        g.sources.push({
          id: disc.id,
          url: disc.source_url,
          thumbnail: disc.thumbnail_url || null,
          platform,
          title: stripSourceSuffix(disc.title ?? ""),
          summary: String(disc.summary ?? "").trim(),
          keywords: rawKeywords.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 3).join(", "),
          likes: disc.likes ?? 0,
          views: disc.views ?? 0,
          comments: disc.comments ?? 0,
        });
      }
    }
  }

  const sorted = [...keywordGroups.entries()]
    .sort((a, b) => (b[1].count * 3 + b[1].engagement) - (a[1].count * 3 + a[1].engagement));

  // Deduplicate: if a bigram appears, drop its component unigrams
  const kept = [];
  const suppressedTokens = new Set();
  for (const entry of sorted) {
    const [kw] = entry;
    if (suppressedTokens.has(kw)) continue;
    kept.push(entry);
    // If this keyword is a bigram (has a space), suppress its individual words
    if (kw.includes(" ")) {
      kw.split(" ").forEach(tok => suppressedTokens.add(tok));
    }
    if (kept.length >= 15) break;
  }

  const trendCandidates = kept.map(([keyword, data], i) => {
    const score = Math.min(99, 40 + data.count * 4 + Math.floor(data.engagement / 50));
    const mentionCount = data.count * 5000 + data.engagement * 100;
    const growthRate = parseFloat(Math.min(99, 12 + (data.count / discoveries.length) * 80).toFixed(1));
    const primarySignal = pickPrimaryTrendSignal(keyword, data, missionPrompt);
    const title = toDisplayPhrase(primarySignal || keyword);
    const specificSignals = pickSpecificSignals(keyword, data, missionPrompt)
      .filter((signal) => signal.toLowerCase() !== cleanPhrase(primarySignal).toLowerCase())
      .slice(0, 3);

    // Pick the most-voted industry for this keyword group; fall back to "All"
    const dominantIndustry = Object.entries(data.industries ?? {})
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "All";

    // Generate humanized description from keyword context
    const description = generateTrendDescription(primarySignal || keyword, keyword, data, missionPrompt, specificSignals);
    const topKeywords = [primarySignal, ...specificSignals, keyword]
      .map(cleanPhrase)
      .filter(Boolean)
      .filter((value, index, list) => list.findIndex((candidate) => candidate.toLowerCase() === value.toLowerCase()) === index)
      .slice(0, 5)
      .join(", ");

    return {
      $primaryKey: `live-${missionId}-${i}`,
      trendId: `live-${missionId}-${i}`,
      title,
      description,
      industry: dominantIndustry,
      category: "Live Research",
      status: score > 72 ? "growing" : "emerging",
      trendScore: score,
      mentionCount,
      growthRate,
      sentimentScore: 0.65,
      topKeywords,
      actionableSignal: cleanPhrase(primarySignal || keyword),
      detectedAt: new Date().toISOString(),
      sources: [...data.sources],
    };
  });

  const dedupedTrends = [];
  const seenTitles = new Set();
  for (const trend of trendCandidates) {
    const key = cleanPhrase(trend.title).toLowerCase();
    if (!key || seenTitles.has(key)) continue;
    seenTitles.add(key);
    dedupedTrends.push(trend);
  }

  return dedupedTrends;
}

// Generate humanized trend descriptions from keyword patterns
function generateTrendDescription(primarySignal, keyword, data, missionPrompt, preselectedSignals = []) {
  const platforms = [...data.platforms];
  const platformStr = formatHumanList(platforms.slice(0, 2)) || "current sources";
  const specificSignals = preselectedSignals.length > 0 ? preselectedSignals : pickSpecificSignals(keyword, data, missionPrompt);
  const evidenceSentence = pickEvidenceSentence(primarySignal || keyword, data, [primarySignal, ...specificSignals].filter(Boolean));
  const relatedTerms = [...data.allKeywords]
    .filter((item) => item !== keyword && item !== primarySignal && !looksLikeSourceNoise(item))
    .slice(0, 3);
  const lens = inferTrendLens(primarySignal || keyword, missionPrompt, specificSignals, evidenceSentence);
  const primaryLower = cleanPhrase(primarySignal).toLowerCase();
  const keywordLower = cleanPhrase(keyword).toLowerCase();

  const lensSentence =
    lens === "tools"
      ? "This points to a specific tool or workflow bet rather than generic interest in software."
      : lens === "services"
        ? "This points to a specific service offer or delivery model rather than broad category buzz."
        : lens === "products"
          ? "This points to a specific product line or item to sell rather than broad category chatter."
          : "This points to a concrete sub-theme rather than a vague market narrative.";

  if (primaryLower && primaryLower !== keywordLower) {
    const supporting = [primarySignal, ...specificSignals].filter(Boolean);
    return `${toDisplayPhrase(primarySignal)} is the clearest concrete expression of the broader ${keyword} trend across ${platformStr}. Demand is clustering around ${formatHumanList(supporting)}. ${evidenceSentence || lensSentence}`;
  }

  if (specificSignals.length > 0) {
    return `${toDisplayPhrase(primarySignal || keyword)} is gaining traction across ${platformStr}, with momentum concentrated in ${formatHumanList([primarySignal, ...specificSignals].filter(Boolean))}. ${evidenceSentence || lensSentence}`;
  }

  if (evidenceSentence) {
    return `${toDisplayPhrase(primarySignal || keyword)} is gaining traction across ${platformStr}. ${evidenceSentence}`;
  }

  if (relatedTerms.length > 0) {
    return `${toDisplayPhrase(primarySignal || keyword)} is gaining traction across ${platformStr}, especially around ${formatHumanList(relatedTerms)}. ${lensSentence}`;
  }

  return `${toDisplayPhrase(primarySignal || keyword)} is gaining traction across ${platformStr}. Coverage is still early, but repeated mentions suggest a concrete commercial signal rather than a one-off spike.`;
}

function synthesizeTrendsFromOptions(finalOptions, missionPrompt, missionId) {
  if (!finalOptions?.options?.length) return [];

  return finalOptions.options.slice(0, 8).map((option, i) => {
    const evidenceList = option.evidence ?? [];
    const evidencePhrases = evidenceList.flatMap((e) => String(e.keywords ?? "").split(",").map((keyword) => cleanPhrase(keyword)).filter(Boolean));
    const evidenceKeywords = evidenceList
      .map((e) => e.keywords)
      .filter(Boolean)
      .slice(0, 5)
      .join(", ");
    const primarySignal = rankPhraseCandidates([
      ...evidencePhrases,
      option.title,
      option.concept,
      option.whyPromising,
      option.marketAngle,
    ], missionPrompt)[0]?.phrase || cleanPhrase(option.title);
    const supportingSignals = rankPhraseCandidates([
      ...evidencePhrases,
      evidenceKeywords,
      option.title,
    ], missionPrompt)
      .map((candidate) => candidate.phrase)
      .filter((phrase) => phrase.toLowerCase() !== cleanPhrase(primarySignal).toLowerCase())
      .slice(0, 3);

    const sources = evidenceList
      .filter((e) => e.source_url || e.url)
      .slice(0, 8)
      .map((e) => ({
        id: e.id,
        url: e.source_url || e.url,
        thumbnail: e.thumbnail_url || e.thumbnail || null,
        platform: e.platform || "market_research",
        title: e.title || "",
        summary: e.summary || "",
        keywords: e.keywords || option.title,
        likes: e.likes ?? 0,
        views: e.views ?? 0,
        comments: e.comments ?? 0,
      }));

    return {
      $primaryKey: `live-opt-${missionId}-${i}`,
      trendId: `live-opt-${missionId}-${i}`,
      title: toDisplayPhrase(primarySignal || option.title),
      description:
        supportingSignals.length > 0
          ? `${toDisplayPhrase(primarySignal || option.title)} is the clearest concrete opportunity inside this research track, with supporting demand around ${formatHumanList([primarySignal, ...supportingSignals].filter(Boolean))}. ${option.concept || option.whyPromising || `This is a market opportunity from research on "${missionPrompt}".`}`
          : option.concept || option.whyPromising || `Market opportunity from research on "${missionPrompt}"`,
      industry: "All",
      category: option.recommendedFormat || "Live Research",
      status: i < 3 ? "growing" : "emerging",
      trendScore: Math.max(60, 95 - i * 6),
      mentionCount: Math.max(50000, (evidenceList.length ?? 1) * 20000),
      growthRate: parseFloat(Math.max(10, 35 - i * 4).toFixed(1)),
      sentimentScore: 0.72,
      topKeywords: [primarySignal, ...supportingSignals, evidenceKeywords || option.title].filter(Boolean).join(", "),
      actionableSignal: cleanPhrase(primarySignal || option.title),
      detectedAt: new Date().toISOString(),
      sources,
    };
  });
}

function synthesizeInsightsFromPlan(plan, missionPrompt) {
  if (!plan) return [];
  const id = plan.id;
  const insights = [];

  const sections = [
    { key: "market_opportunity", title: "Market Opportunity", type: "opportunity" },
    { key: "competitive_landscape", title: "Competitive Landscape", type: "summary" },
    { key: "risk_analysis", title: "Risk Analysis", type: "alert" },
    { key: "revenue_models", title: "Revenue Models", type: "summary" },
    { key: "user_acquisition", title: "User Acquisition", type: "opportunity" },
  ];

  for (const section of sections) {
    const content = plan[section.key];
    if (content && content.trim()) {
      insights.push({
        $primaryKey: `insight-${section.key}-${id}`,
        insightId: `insight-${section.key}-${id}`,
        title: section.title,
        summary: content,
        insightType: section.type,
        industry: "All",
        generatedAt: plan.created_at,
        relatedTrendIds: "",
      });
    }
  }

  if (plan.confidence_score != null) {
    insights.push({
      $primaryKey: `insight-kpi-confidence-${id}`,
      insightId: `insight-kpi-confidence-${id}`,
      title: "Research Confidence",
      summary: `${plan.discovery_count ?? 0} discoveries analyzed for "${missionPrompt}"`,
      insightType: "kpi",
      industry: "All",
      generatedAt: plan.created_at,
      relatedTrendIds: "",
      metricValue: plan.confidence_score,
      metricUnit: "%",
      changePercent: plan.confidence_score - 50,
      period: "Current mission",
    });
  }

  if ((plan.discovery_count ?? 0) > 0) {
    insights.push({
      $primaryKey: `insight-kpi-disc-${id}`,
      insightId: `insight-kpi-disc-${id}`,
      title: "Discoveries",
      summary: `Sources analyzed from live web research`,
      insightType: "kpi",
      industry: "All",
      generatedAt: plan.created_at,
      relatedTrendIds: "",
      metricValue: plan.discovery_count,
      metricUnit: "sources",
      changePercent: null,
      period: "Current mission",
    });
  }

  return insights;
}

async function handleTrends(_request, response) {
  const insforge = createServerInsforgeClient();

  const missionRowsResult = await insforge.database
    .from("missions")
    .select("id,prompt,status,final_options")
    .order("created_at", { ascending: false })
    .limit(USER_MISSION_LOOKBACK_LIMIT);

  if (missionRowsResult.error) {
    writeJson(response, 200, { trends: [], insights: [] });
    return;
  }

  const mission = selectLatestUserFacingMission(missionRowsResult.data ?? []);
  if (!mission) {
    writeJson(response, 200, { trends: [], insights: [] });
    return;
  }
  const missionId = String(mission.id ?? "");
  const missionPrompt = String(mission.prompt ?? "");

  const [discResult, planResult] = await Promise.all([
    insforge.database
      .from("discoveries")
      .select("id,agent_id,source_url,thumbnail_url,title,summary,keywords,industry,likes,views,comments,created_at")
      .eq("mission_id", missionId)
      .order("created_at", { ascending: false })
      .limit(200),
    insforge.database
      .from("business_plans")
      .select("id,mission_id,market_opportunity,competitive_landscape,revenue_models,user_acquisition,risk_analysis,confidence_score,discovery_count,is_final,created_at")
      .eq("mission_id", missionId)
      .order("is_final", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const discoveries = discResult.data ?? [];
  const plan = planResult.data ?? null;

  let trends = synthesizeTrendsFromDiscoveries(discoveries, missionPrompt, missionId);

  // Supplement with final_options when discovery-based trends are sparse
  if (trends.length < 4 && mission.final_options) {
    let finalOptions = mission.final_options;
    if (typeof finalOptions === "string") {
      try { finalOptions = JSON.parse(finalOptions); } catch { finalOptions = null; }
    }
    if (finalOptions) {
      const optionTrends = synthesizeTrendsFromOptions(finalOptions, missionPrompt, missionId);
      const existing = new Set(trends.map((t) => t.title.toLowerCase()));
      for (const t of optionTrends) {
        if (!existing.has(t.title.toLowerCase())) {
          trends.push(t);
          existing.add(t.title.toLowerCase());
        }
      }
    }
  }

  const insights = synthesizeInsightsFromPlan(plan, missionPrompt);

  writeJson(response, 200, { trends, insights, missionPrompt, missionId });
}

/* ------------------------------------------------------------------ */
/*  Route: GET /api/recommendations                                   */
/* ------------------------------------------------------------------ */

const RECS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
/** @type {{ focusIndustry: string; payload: { recommendations: unknown[]; missionId?: string } } | null} */
let recsCache = null;
let recsCachedAt = 0;
/** @type {Map<string, Promise<{ recommendations: unknown[]; missionId?: string }>>} */
const recsInflightByKey = new Map();

function invalidateRecsCache() {
  recsCache = null;
  recsCachedAt = 0;
  recsInflightByKey.clear();
}

const REC_INDUSTRY_SLUGS = [
  "beauty-skincare", "fashion-retail", "food-beverage", "travel-hospitality",
  "wellness-fitness", "tech-saas", "healthcare", "finance-fintech",
  "real-estate", "education", "entertainment-media", "All",
];

function normalizeRecIndustry(value) {
  const v = typeof value === "string" ? value.trim() : "";
  return REC_INDUSTRY_SLUGS.includes(v) ? v : "All";
}

function industryRankForSort(industry, focusIndustry) {
  if (!focusIndustry || focusIndustry === "All") return 0;
  if (industry === focusIndustry) return 0;
  if (industry === "All") return 2;
  return 1;
}

async function generateLiveRecommendations(focusIndustry = null) {
  const insforge = createServerInsforgeClient();

  const missionRowsResult = await insforge.database
    .from("missions")
    .select("id,prompt,status,final_options")
    .order("created_at", { ascending: false })
    .limit(USER_MISSION_LOOKBACK_LIMIT);

  if (missionRowsResult.error) return { recommendations: [] };

  const latestMission = selectLatestUserFacingMission(missionRowsResult.data ?? []);
  if (!latestMission) return { recommendations: [] };

  const missionId = String(latestMission.id ?? "");
  const missionPrompt = String(latestMission.prompt ?? "multi-industry market research");
  if (!missionId) return { recommendations: [] };

  // Only use the newest plan for the newest mission. If a fresh mission hasn't
  // produced a plan yet, keep recommendations empty instead of leaking the
  // previous mission's output.
  const planResult = await insforge.database
    .from("business_plans")
    .select("id,mission_id,market_opportunity,competitive_landscape,revenue_models,user_acquisition,risk_analysis,confidence_score,discovery_count,created_at")
    .eq("mission_id", missionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (planResult.error || !planResult.data) return { recommendations: [], missionId };

  const plan = planResult.data;

  // Build live trend summary from the same mission so recommendations stay
  // anchored to specific items, services, and features rather than generic themes.
  const discResult = await insforge.database
    .from("discoveries")
    .select("id,agent_id,source_url,thumbnail_url,title,summary,keywords,industry,likes,views,comments,created_at")
    .eq("mission_id", missionId)
    .order("created_at", { ascending: false })
    .limit(40);

  const discoveries = discResult.data ?? [];
  const topKeywords = discoveries
    .flatMap((d) => (d.keywords ?? "").split(",").map((k) => k.trim()).filter(Boolean))
    .slice(0, 20)
    .join(", ");
  let liveTrends = synthesizeTrendsFromDiscoveries(discoveries, missionPrompt, missionId);

  const finalOptionsRaw = latestMission.final_options;
  if (liveTrends.length < 6 && finalOptionsRaw) {
    try {
      const parsedFinalOptions =
        typeof finalOptionsRaw === "string" ? JSON.parse(finalOptionsRaw) : finalOptionsRaw;
      const optionTrends = synthesizeTrendsFromOptions(parsedFinalOptions, missionPrompt, missionId);
      const existingTitles = new Set(liveTrends.map((trend) => cleanPhrase(trend.title).toLowerCase()));
      for (const trend of optionTrends) {
        const key = cleanPhrase(trend.title).toLowerCase();
        if (!key || existingTitles.has(key)) continue;
        existingTitles.add(key);
        liveTrends.push(trend);
      }
    } catch (error) {
      console.warn("[ai-server] Failed to parse final_options for recommendation trends:", error?.message ?? error);
    }
  }
  liveTrends = liveTrends.slice(0, 8);
  const trendBriefs = liveTrends
    .map((trend) => `- ${trend.title}: ${trend.description} Keywords: ${trend.topKeywords || "N/A"}`)
    .join("\n");

  const industryFocusLine =
    focusIndustry && focusIndustry !== "All"
      ? `User's selected industry (prioritize this): "${focusIndustry}". Each item must include "industry" — use "${focusIndustry}" when the idea clearly serves that sector; use "All" only for ideas that are genuinely cross-industry. Do not assign unrelated industries just to diversify.`
      : `Each item must include "industry" — one of: ${REC_INDUSTRY_SLUGS.join(", ")}.`;

  const systemPrompt = `You are a strategic market analyst. Given real scraped research data, generate actionable business recommendations with specific, data-grounded revenue estimates. Output only a valid JSON array — no markdown, no prose.`;

  const userPrompt = `Generate 6 actionable business recommendations with realistic revenue potential.

${industryFocusLine}

Research Topic: ${missionPrompt}
Confidence Score: ${plan.confidence_score ?? 0}%
Sources Analyzed: ${plan.discovery_count ?? 0}
Top Trending Keywords: ${topKeywords || "N/A"}
Specific Trend Briefs:
${trendBriefs || "N/A"}

Market Opportunity:
${plan.market_opportunity ?? "N/A"}

Revenue Models Identified:
${plan.revenue_models ?? "N/A"}

User Acquisition Insights:
${plan.user_acquisition ?? "N/A"}

Competitive Landscape:
${plan.competitive_landscape ?? "N/A"}

Risk Factors:
${plan.risk_analysis ?? "N/A"}

Return a JSON array with exactly this shape (no extra keys):
[
  {
    "sourceTrendTitle": "Exact trend title from the list above",
    "title": "Short action title (max 8 words) that names the exact thing to sell, launch, offer, or build",
    "description": "1-2 sentence description naming the exact product, service, feature, or package and why it matters now",
    "industry": "One of: ${REC_INDUSTRY_SLUGS.join(", ")}",
    "productCategory": "One of: Product, Service, Platform, Partnership, Content, Community",
    "targetDemographic": "Specific target audience (e.g. Gen Z shoppers 18-24, B2B SaaS teams)",
    "confidenceScore": 0.82,
    "estimatedRevenuePotential": "Specific estimate like '$2.4M ARR', '$180K first quarter', '$45K/month'",
    "priority": "high",
    "actionPlan": "2-3 concrete steps to execute this recommendation"
  }
]

Rules:
- industry must be an exact slug from the list above
- Revenue estimates must be specific dollar amounts derived from the data, not vague ranges
- Scale estimates to match the research scope and discovery count
- priority must be "high", "medium", or "low"
- confidenceScore must be between 0.50 and 0.97
- Every recommendation must explicitly name a concrete product, service, feature, format, or offer. Never say "lean into this trend", "tap into demand", or "build around this space" without naming the exact thing.
- If the signal is consumer-facing, name the exact item or collection (for example cargo pants, charm necklaces, protein soda, sleep gummies).
- If the signal is software or B2B, name the exact workflow, feature, dashboard, integration, or managed service.
- sourceTrendTitle should exactly match one of the trend titles above whenever possible.`;

  let rawRecs = [];
  try {
    const result = await inferWithOpenAI({
      systemPrompt,
      userPrompt,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.35,
    });

    const text = result.text ?? "";
    // Strip markdown code fences if present
    const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const match = clean.match(/\[[\s\S]*\]/);
    if (match) rawRecs = JSON.parse(match[0]);
  } catch (e) {
    console.error("[ai-server] Failed to generate live recommendations:", e.message);
    return { recommendations: [] };
  }

  const trendTitleMap = new Map(
    liveTrends.map((trend) => [cleanPhrase(trend.title).toLowerCase(), trend]),
  );

  function findBestMatchingTrend(rec) {
    const sourceTrendTitle = cleanPhrase(rec.sourceTrendTitle ?? "").toLowerCase();
    if (sourceTrendTitle && trendTitleMap.has(sourceTrendTitle)) {
      return trendTitleMap.get(sourceTrendTitle) ?? null;
    }

    const haystack = `${rec.title ?? ""} ${rec.description ?? ""} ${rec.actionPlan ?? ""} ${rec.targetDemographic ?? ""}`.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    for (const trend of liveTrends) {
      const candidateTerms = [
        trend.title,
        ...(String(trend.topKeywords ?? "").split(",").map((value) => value.trim()).filter(Boolean)),
      ];
      let score = 0;
      for (const term of candidateTerms) {
        const normalizedTerm = cleanPhrase(term).toLowerCase();
        if (!normalizedTerm || !haystack.includes(normalizedTerm)) continue;
        score += normalizedTerm === cleanPhrase(trend.title).toLowerCase() ? 5 : 2;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = trend;
      }
    }
    return bestMatch;
  }

  const recommendations = rawRecs.slice(0, 8).map((rec, i) => {
    const ind = normalizeRecIndustry(rec.industry);
    const matchedTrend = findBestMatchingTrend(rec);
    const matchedTitle = cleanPhrase(rec.sourceTrendTitle ?? matchedTrend?.title ?? "");
    const specificContext = matchedTitle || cleanPhrase(rec.title ?? "");
    let title = String(rec.title ?? "Recommendation").trim();
    let description = String(rec.description ?? "").trim();

    if ((!title || /^(recommendation|opportunity|growth strategy)$/i.test(title)) && specificContext) {
      const verb = String(rec.productCategory ?? "").toLowerCase() === "service"
        ? "Offer"
        : String(rec.productCategory ?? "").toLowerCase() === "platform"
          ? "Build"
          : "Launch";
      title = `${verb} ${specificContext}`;
    }

    if (specificContext && !`${title} ${description}`.toLowerCase().includes(specificContext.toLowerCase())) {
      description = description
        ? `${description} Focus the offer on ${specificContext}.`
        : `Consider launching ${specificContext} based on the current live research signal.`;
    }

    return {
      $primaryKey: `live-rec-${missionId}-${i}`,
      recommendationId: `live-rec-${missionId}-${i}`,
      trendId: matchedTrend?.trendId ?? `live-${missionId}-${i % 8}`,
      title: title || "Recommendation",
      description,
      industry: ind,
      productCategory: rec.productCategory ?? "Product",
      targetDemographic: rec.targetDemographic ?? "",
      confidenceScore: typeof rec.confidenceScore === "number" ? rec.confidenceScore : 0.7,
      estimatedRevenuePotential: rec.estimatedRevenuePotential ?? "",
      priority: ["high", "medium", "low"].includes(rec.priority) ? rec.priority : "medium",
      status: "new",
      actionPlan: rec.actionPlan ?? "",
      sourceTrendTitle: matchedTrend?.title ?? matchedTitle,
      sourceEvidence: Array.isArray(matchedTrend?.sources) ? matchedTrend.sources.slice(0, 6) : [],
      createdAt: new Date().toISOString(),
    };
  });

  const focus = focusIndustry && focusIndustry !== "All" ? focusIndustry : null;
  if (focus) {
    recommendations.sort((a, b) => {
      const dr = industryRankForSort(a.industry, focus) - industryRankForSort(b.industry, focus);
      if (dr !== 0) return dr;
      return (b.confidenceScore ?? 0) - (a.confidenceScore ?? 0);
    });
  }

  return { recommendations, missionId };
}

async function handleRecommendations(request, response) {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const rawIndustry = url.searchParams.get("industry")?.trim();
  const cacheKey = rawIndustry && rawIndustry.length > 0 ? rawIndustry : "__all__";
  const focusIndustry = cacheKey === "__all__" ? null : cacheKey;

  const now = Date.now();
  if (
    recsCache &&
    now - recsCachedAt < RECS_CACHE_TTL_MS &&
    recsCache.focusIndustry === cacheKey
  ) {
    writeJson(response, 200, recsCache.payload);
    return;
  }

  let flight = recsInflightByKey.get(cacheKey);
  if (!flight) {
    flight = generateLiveRecommendations(focusIndustry)
      .then((result) => {
        if (result.recommendations && result.recommendations.length > 0) {
          recsCache = { focusIndustry: cacheKey, payload: result };
          recsCachedAt = Date.now();
        }
        return result;
      })
      .finally(() => {
        recsInflightByKey.delete(cacheKey);
      });
    recsInflightByKey.set(cacheKey, flight);
  }

  try {
    const result = await flight;
    const cacheOk =
      recsCache &&
      recsCache.focusIndustry === cacheKey &&
      recsCache.payload?.recommendations?.length > 0;

    if ((!result.recommendations || result.recommendations.length === 0) && cacheOk) {
      writeJson(response, 200, recsCache.payload);
    } else {
      writeJson(response, 200, result);
    }
  } catch (error) {
    console.error("[ai-server] handleRecommendations error:", error);
    const cacheOk =
      recsCache &&
      recsCache.focusIndustry === cacheKey &&
      recsCache.payload?.recommendations?.length > 0;
    if (cacheOk) {
      writeJson(response, 200, recsCache.payload);
      return;
    }
    writeJson(response, 200, { recommendations: [] });
  }
}

/* ------------------------------------------------------------------ */
/*  Background Data Refresh (Brave Search)                            */
/* ------------------------------------------------------------------ */

const BG_JOB_INTERVAL_MS = 12 * 60 * 60 * 1000;  // re-run every 12 hours
const BG_JOB_MIN_AGE_MS  = 4 * 60 * 60 * 1000;  // skip if latest mission < 4h old

// One query per industry — 12 queries × ≤10 results = ≤120 discoveries per run
const BG_SEARCH_QUERIES = [
  { q: "trending clothing streetwear fashion sneakers accessories viral 2025",    industry: "fashion-retail" },
  { q: "viral makeup skincare beauty products ingredients trending now",           industry: "beauty-skincare" },
  { q: "trending food beverages drinks viral recipes new brands 2025",             industry: "food-beverage" },
  { q: "trending travel destinations experiences hotels popular 2025",             industry: "travel-hospitality" },
  { q: "trending wellness fitness supplements workout wearables 2025",             industry: "wellness-fitness" },
  { q: "trending AI tools SaaS software apps gaining users 2025",                 industry: "tech-saas" },
  { q: "trending digital health telehealth mental health apps 2025",              industry: "healthcare" },
  { q: "trending fintech payment apps crypto investing platforms 2025",            industry: "finance-fintech" },
  { q: "trending proptech real estate market housing 2025",                        industry: "real-estate" },
  { q: "trending edtech online learning courses AI tutoring 2025",                industry: "education" },
  { q: "trending streaming gaming creator economy social media 2025",             industry: "entertainment-media" },
  { q: "trending consumer products brands going viral reddit twitter 2025",        industry: "All" },
];

// Map known domains to agent IDs so platform distribution looks natural
const DOMAIN_TO_AGENT_ID = [
  ["youtube.com",  1],
  ["youtu.be",     1],
  ["x.com",        2],
  ["twitter.com",  2],
  ["reddit.com",   3],
  ["substack.com", 4],
];

function detectAgentId(url) {
  if (!url) return 5;
  for (const [domain, id] of DOMAIN_TO_AGENT_ID) {
    if (url.includes(domain)) return id;
  }
  return 5;
}

function extractKeywordsFromResult(title, description) {
  // Prefer title over description for signal quality
  const cleanedTitle = stripSourceSuffix(title);
  const text = `${cleanedTitle} ${description ?? ""}`.toLowerCase();
  const tokens = text
    .split(/[\s,;:'"!?.|()\[\]{}<>\/\\–—]+/)
    .map(w => w.replace(/[^a-z0-9]/g, ""))
    .filter(w => w.length > 3 && !STOP_WORDS.has(w) && !SOURCE_NOISE_WORDS.has(w) && !/^\d+$/.test(w)); // drop pure numbers

  if (!tokens.length) return "";

  // Build bigrams where both tokens are meaningful (prefer these as they're more specific)
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i].length > 3 && tokens[i + 1].length > 3) {
      const bigram = `${tokens[i]} ${tokens[i + 1]}`;
      if (!looksLikeSourceNoise(bigram)) bigrams.push(bigram);
    }
  }

  // Return up to 2 bigrams + up to 2 unigrams for variety
  const chosen = [...bigrams.slice(0, 2), ...tokens.slice(0, 2)];
  return [...new Set(chosen.map((phrase) => cleanPhrase(phrase)).filter((phrase) => phrase && !looksLikeSourceNoise(phrase)))]
    .slice(0, 4)
    .join(", ");
}

// Domains blocked regardless of Brave's safe-search result
const BLOCKED_DOMAINS = new Set([
  "pornhub.com", "xvideos.com", "xhamster.com", "xnxx.com", "redtube.com",
  "youporn.com", "tube8.com", "spankbang.com", "porntrex.com", "beeg.com",
  "4tube.com", "slutload.com", "tnaflix.com", "drtuber.com", "hclips.com",
  "onlyfans.com", "fansly.com", "manyvids.com", "clips4sale.com",
  "brazzers.com", "bangbros.com", "naughtyamerica.com", "realitykings.com",
  "adultfriendfinder.com", "ashleymadison.com",
  "4chan.org", "rule34.xxx", "gelbooru.com", "danbooru.donmai.us",
  "nhentai.net", "e-hentai.org", "hentaihaven.xxx",
]);

function isSafeUrl(url) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    // Block any domain that contains known NSFW keywords
    if (/\b(porn|xxx|sex|adult|nude|nsfw|hentai|escort|cam(girl|boy|live))\b/i.test(hostname)) return false;
    return !BLOCKED_DOMAINS.has(hostname);
  } catch {
    return false;
  }
}

async function runBraveSearch(query, retries = 2) {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) return [];

  const searchUrl = new URL("https://api.search.brave.com/res/v1/web/search");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("count", "10");
  searchUrl.searchParams.set("search_lang", "en");
  searchUrl.searchParams.set("country", "us");
  searchUrl.searchParams.set("freshness", "pw"); // past week
  searchUrl.searchParams.set("safesearch", "strict"); // block adult content at API level

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(searchUrl.toString(), {
        headers: {
          "Accept": "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 429) {
        const waitMs = 2000 * (attempt + 1);
        console.warn(`[bg-job] Rate limited, waiting ${waitMs}ms before retry...`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      if (!res.ok) {
        console.error(`[bg-job] Brave Search ${res.status} for: ${query}`);
        return [];
      }
      const data = await res.json();
      const results = data?.web?.results ?? [];
      // Secondary filter: drop any result that slipped through safe-search
      return results.filter(r => isSafeUrl(r.url));
    } catch (err) {
      console.error(`[bg-job] Brave Search error for "${query}":`, err.message);
      return [];
    }
  }
  return [];
}

async function runBackgroundDataRefresh(force = false) {
  console.log(`[bg-job] Starting background data refresh${force ? " (forced)" : ""}...`);
  const insforge = createServerInsforgeClient();

  if (!force) {
    // Check if latest mission is too recent or still running
    const latestMission = await insforge.database
      .from("missions")
      .select("id,created_at,status")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestMission.error && latestMission.data) {
      const ageMs = Date.now() - new Date(latestMission.data.created_at).getTime();
      if (ageMs < BG_JOB_MIN_AGE_MS) {
        console.log(`[bg-job] Skipping — last mission ${Math.round(ageMs / 60000)}min ago`);
        return;
      }
      if (latestMission.data.status === "queued" || latestMission.data.status === "active") {
        console.log("[bg-job] Skipping — a mission is currently active");
        return;
      }
    }
  }

  const missionId  = crypto.randomUUID();
  const timestamp  = new Date().toISOString();
  const prompt     = "Background market research: trending products, brands, and content across fashion, beauty, food, tech, wellness, entertainment, and more";

  // Create the mission
  const missionInsert = await insforge.database.from("missions").insert([{
    id: missionId, prompt, status: "active",
    live_url_1: null, live_url_2: null,
    live_url_3: null, live_url_4: null,
    live_url_5: "/agent-stream/5",
    created_at: timestamp, updated_at: timestamp,
  }]);
  if (missionInsert.error) { console.error("[bg-job] Mission insert error:", missionInsert.error); return; }

  const bgAgentInsert = await insertAgentRows(
    insforge,
    AGENT_ROWS.map(a => ({
      mission_id: missionId, agent_id: a.agentId, name: a.name,
      platform: a.platform, role: a.role, status: a.agentId === 5 ? "queued" : "searching",
      preview_url: a.previewUrl, assignment: prompt, energy: 100,
      status_detail: a.agentId === 5 ? "Queued to synthesize the sweep." : `Searching ${a.platform} sources.`,
      failure_reason: "",
      retry_count: 0,
      confidence: null,
      created_at: timestamp, updated_at: timestamp, last_heartbeat: timestamp,
    })),
    "background refresh agent insert"
  );
  if (bgAgentInsert.error) {
    console.warn("[bg-job] Agent insert warning:", bgAgentInsert.error.message ?? bgAgentInsert.error);
  }

  invalidateDashboardSnapshot();
  invalidateRecsCache();

  // Run Brave Search queries sequentially (1.1s gap to respect rate limits)
  const discoveries = [];
  for (const { q, industry } of BG_SEARCH_QUERIES) {
    const results = await runBraveSearch(q);
    for (const r of results) {
      if (!r.url) continue;
      const keywords = extractKeywordsFromResult(r.title, r.description);
      if (!keywords) continue;
      const agentId = detectAgentId(r.url);
      discoveries.push({
        id: crypto.randomUUID(),
        mission_id:    missionId,
        agent_id:      agentId,
        platform:      PLATFORM_BY_AGENT_ID[agentId] ?? "market_research",
        industry,
        title:         r.title ?? "",
        summary:       r.description ?? "",
        source_url:    r.url,
        thumbnail_url: r.thumbnail?.src ?? r.thumbnail?.original ?? "",
        keywords,
        likes:    0,
        views:    0,
        comments: 0,
        created_at: new Date().toISOString(),
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1100)); // Brave allows ~1 req/s
  }

  // Insert discoveries in batches of 50
  let insertedCount = 0;
  for (let i = 0; i < discoveries.length; i += 50) {
    const batch = discoveries.slice(i, i + 50);
    const result = await insforge.database.from("discoveries").insert(batch);
    if (result.error) {
      console.error("[bg-job] Discovery insert error:", JSON.stringify(result.error));
    } else {
      insertedCount += batch.length;
    }
  }
  console.log(`[bg-job] Inserted ${insertedCount}/${discoveries.length} discoveries`);

  const discoveryCountsByAgent = discoveries.reduce((counts, discovery) => {
    counts.set(discovery.agent_id, (counts.get(discovery.agent_id) ?? 0) + 1);
    return counts;
  }, new Map());
  const sourceHeartbeat = new Date().toISOString();
  for (const agent of AGENT_ROWS.filter((row) => row.agentId !== 5)) {
    const count = discoveryCountsByAgent.get(agent.agentId) ?? 0;
    const result = await updateAgentByMissionAndId(insforge, missionId, agent.agentId, {
      status: count > 0 ? "done" : "failed",
      assignment: count > 0 ? `Completed: ${count} background discoveries` : "No valid background sources found",
      energy: count > 0 ? 55 : 0,
      status_detail: count > 0
        ? `Background sweep completed with ${count} usable ${agent.platform} sources.`
        : `Background sweep found no valid ${agent.platform} sources.`,
      failure_reason: count > 0 ? "" : "No valid sources found in background sweep",
      retry_count: count > 0 ? 0 : 1,
      confidence: count > 0 ? Math.min(0.92, 0.55 + count * 0.04) : 0.1,
      last_heartbeat: sourceHeartbeat,
    }, "background source agent update");
    if (result.error) {
      console.warn(`[bg-job] Agent ${agent.agentId} status warning:`, result.error.message ?? result.error);
    }
  }

  if (insertedCount > 0 && (process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI)) {
    try {
      const sync = await storeDiscoveriesWithEmbeddings(discoveries);
      console.log(`[bg-job] MongoDB vector sync: ${sync.synced} stored, ${sync.errors} errors`);
    } catch (mongoErr) {
      console.warn("[bg-job] MongoDB vector sync failed:", mongoErr?.message ?? mongoErr);
    }
  }

  // Generate business plan via AI so /api/recommendations has real data to work with
  const topKws = discoveries
    .flatMap(d => d.keywords.split(", "))
    .reduce((acc, kw) => { acc[kw] = (acc[kw] ?? 0) + 1; return acc; }, {});
  const topKeywordsStr = Object.entries(topKws)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([kw]) => kw)
    .join(", ");

  await updateAgentByMissionAndId(insforge, missionId, 5, {
    status: "synthesizing",
    assignment: "Synthesizing background discoveries",
    energy: 80,
    status_detail: `Synthesizing ${discoveries.length} background discoveries into a business plan.`,
    failure_reason: "",
    retry_count: 0,
    confidence: insertedCount > 0 ? 0.72 : 0.2,
    last_heartbeat: new Date().toISOString(),
  }, "background Atlas synthesizing update");

  try {
    const planResult = await inferWithOpenAI({
      systemPrompt: "You are a senior market research analyst. Synthesize a concise business intelligence report from trending web data. Output valid JSON only — no markdown fences.",
      userPrompt: `Synthesize a market intelligence report from ${discoveries.length} real web results scraped across fashion, beauty, food, tech, wellness, entertainment, fintech, health, travel, real estate, and education.

Top trending keywords by frequency: ${topKeywordsStr}

Return a JSON object with exactly these keys (2-4 sentences each):
{
  "market_opportunity": "...",
  "competitive_landscape": "...",
  "revenue_models": "...",
  "user_acquisition": "...",
  "risk_analysis": "...",
  "confidence_score": 78
}

Rules:
- In every section, name the specific products, services, formats, or features that appear to be winning.
- Avoid generic phrasing like "fashion is trending" or "AI tools are growing" unless you immediately name the concrete thing inside that trend.`,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
    });

    const cleaned = planResult.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const plan = match ? JSON.parse(match[0]) : null;

    if (plan) {
      await insforge.database.from("business_plans").insert([{
        mission_id:            missionId,
        version:               1,
        market_opportunity:    plan.market_opportunity    ?? "",
        competitive_landscape: plan.competitive_landscape ?? "",
        revenue_models:        plan.revenue_models        ?? "",
        user_acquisition:      plan.user_acquisition      ?? "",
        risk_analysis:         plan.risk_analysis         ?? "",
        confidence_score:      typeof plan.confidence_score === "number" ? plan.confidence_score : 75,
        discovery_count:       discoveries.length,
        is_final:              true,
        raw_plan:              JSON.stringify(plan),
        created_at:            new Date().toISOString(),
      }]);
      console.log("[bg-job] Business plan generated");
      await updateAgentByMissionAndId(insforge, missionId, 5, {
        status: "done",
        assignment: "Background plan generated",
        energy: 60,
        status_detail: "Background research synthesized into a saved business plan.",
        failure_reason: "",
        retry_count: 0,
        confidence: typeof plan.confidence_score === "number" ? Math.max(0, Math.min(1, plan.confidence_score / 100)) : 0.75,
        last_heartbeat: new Date().toISOString(),
      }, "background Atlas complete update");
    } else {
      await updateAgentByMissionAndId(insforge, missionId, 5, {
        status: "failed",
        assignment: "Background synthesis produced no parseable plan",
        energy: 0,
        status_detail: "The AI response did not contain a parseable business-plan JSON object.",
        failure_reason: "No parseable business-plan JSON returned",
        retry_count: 1,
        confidence: 0.15,
        last_heartbeat: new Date().toISOString(),
      }, "background Atlas unparseable update");
    }
  } catch (err) {
    console.error("[bg-job] Business plan generation failed:", err.message);
    await updateAgentByMissionAndId(insforge, missionId, 5, {
      status: "failed",
      assignment: "Background synthesis failed",
      energy: 0,
      status_detail: "Background sweep finished, but AI synthesis failed.",
      failure_reason: err?.message ?? "Business plan generation failed",
      retry_count: 1,
      confidence: 0.15,
      last_heartbeat: new Date().toISOString(),
    }, "background Atlas failed update");
  }

  // Finalize mission
  await insforge.database.from("missions").update({
    status: "completed", updated_at: new Date().toISOString(),
  }).eq("id", missionId);

  invalidateDashboardSnapshot();
  invalidateRecsCache();

  console.log("[bg-job] Background data refresh complete");
}

function scheduleBackgroundJob() {
  if (DEMO_MODE) {
    console.log("[bg-job] Demo mode enabled; background refresh is disabled.");
    return;
  }
  // Run 60 seconds after server starts so it's fully ready
  setTimeout(() => {
    runBackgroundDataRefresh().catch(err => console.error("[bg-job] Startup run error:", err));
  }, 60000);

  // Then repeat every 6 hours
  setInterval(() => {
    runBackgroundDataRefresh().catch(err => console.error("[bg-job] Scheduled run error:", err));
  }, BG_JOB_INTERVAL_MS);
}

/* ------------------------------------------------------------------ */
/*  HTTP Server                                                        */
/* ------------------------------------------------------------------ */

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    writeJson(response, 404, { error: "Not found" });
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    writeJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    const health = await buildHealthReport();
    writeJson(response, health.ok ? 200 : 503, health);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/worker/preflight") {
    const strict = url.searchParams.get("strict") === "1" || url.searchParams.get("strict") === "true";
    const preflight = await getWorkerPreflight({ strict });
    writeJson(response, preflight.ok ? 200 : 503, preflight);
    return;
  }

  // Text-to-Speech (ElevenLabs)
  if (request.method === "POST" && url.pathname === "/api/ai/tts") {
    try {
      const body = await readJsonBody(request);
      if (!body.text) {
        writeJson(response, 400, { error: "Text is required" });
        return;
      }
      
      const audioStream = await generateSpeechWithElevenLabs(body.text, body.voiceId);
      
      response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "audio/mpeg",
      });
      
      const reader = audioStream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        response.write(value);
      }
      response.end();
    } catch (error) {
      writeJson(response, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown AI server error.",
      });
    }
    return;
  }

  // Text-to-Speech (MiniMax)
  if (request.method === "POST" && url.pathname === "/api/ai/tts-minimax") {
    try {
      const body = await readJsonBody(request);
      if (!body.text) {
        writeJson(response, 400, { error: "Text is required" });
        return;
      }

      const audioStream = await generateSpeechWithMiniMax(body.text, {
        voiceId: body.voiceId,
        speed: body.speed,
        volume: body.volume,
        pitch: body.pitch,
      });

      response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "audio/mpeg",
      });

      const reader = audioStream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        response.write(value);
      }
      response.end();
    } catch (error) {
      console.error("[ai-server] MiniMax TTS error:", error);
      writeJson(response, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown TTS error.",
      });
    }
    return;
  }

  // AI inference
  if (request.method === "POST" && url.pathname === "/api/ai/infer") {
    try {
      const body = await readJsonBody(request);
      const result = await inferWithOpenAI({
        systemPrompt: body.systemPrompt,
        userPrompt: body.userPrompt,
        imageUrl: body.imageUrl,
        model: body.model,
        temperature: body.temperature,
      });

      writeJson(response, 200, { ok: true, model: result.model, text: result.text });
    } catch (error) {
      writeJson(response, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown AI server error.",
      });
    }
    return;
  }

  // Mission create
  if (request.method === "POST" && url.pathname === "/api/mission/create") {
    try {
      if (DEMO_MODE) {
        await handleDemoMissionCreate(request, response);
        return;
      }
      await handleMissionCreate(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to create mission." });
    }
    return;
  }

  // Mission stop
  if (request.method === "POST" && url.pathname === "/api/mission/stop") {
    try {
      if (DEMO_MODE) {
        await handleDemoMissionStop(request, response);
        return;
      }
      await handleMissionStop(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to stop mission." });
    }
    return;
  }

  // Mission reset
  if (request.method === "POST" && url.pathname === "/api/mission/reset") {
    try {
      if (DEMO_MODE) {
        await handleDemoMissionReset(request, response);
        return;
      }
      await handleMissionReset(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to reset mission." });
    }
    return;
  }

  // Agent retry
  if (request.method === "POST" && url.pathname === "/api/agent/retry") {
    try {
      if (DEMO_MODE) {
        await handleDemoAgentRetry(request, response);
        return;
      }
      await handleAgentRetry(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to retry agent." });
    }
    return;
  }

  // Dashboard snapshot
  if (request.method === "GET" && url.pathname === "/api/dashboard") {
    try {
      if (DEMO_MODE) {
        writeJson(response, 200, demoDashboardState ?? emptyDashboardSnapshot());
        return;
      }
      await handleDashboard(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to load dashboard." });
    }
    return;
  }

  // Agent preview frame (serves latest screenshot from runtime directory)
  const agentFrameMatch = url.pathname.match(/^\/api\/agent-stream\/(\d+)\/frame$/);
  if (request.method === "GET" && agentFrameMatch) {
    const agentId = Number(agentFrameMatch[1]);
    if (agentId < 1 || agentId > 5) {
      writeJson(response, 400, { error: "Invalid agent id" });
      return;
    }

    const envRuntime = process.env.MASTERBUILD_RUNTIME_DIR;
    const runtimeDir = envRuntime
      ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), envRuntime))
      : path.join(process.cwd(), "runtime");
    const framePath = path.join(runtimeDir, "previews", `agent-${agentId}`, "latest.jpg");

    try {
      if (fs.existsSync(framePath)) {
        const bytes = fs.readFileSync(framePath);
        response.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "image/jpeg",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Content-Length": bytes.length,
        });
        response.end(bytes);
      } else {
        // Return placeholder SVG
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="1280" height="720" fill="#f8fafc"/><text x="640" y="340" text-anchor="middle" fill="#94a3b8" font-size="28" font-family="system-ui">Agent ${agentId} — Waiting for preview</text><text x="640" y="380" text-anchor="middle" fill="#cbd5e1" font-size="16" font-family="system-ui">Browser session will appear here</text></svg>`;
        response.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        });
        response.end(svg);
      }
    } catch {
      writeJson(response, 500, { error: "Failed to read preview frame" });
    }
    return;
  }

  // Theme sync — frontend writes current theme so the browser showcase matches
  if (request.method === "POST" && url.pathname === "/api/theme") {
    try {
      const body = await readJsonBody(request);
      const theme = body?.theme === "dark" ? "dark" : "light";
      const envRuntime = process.env.MASTERBUILD_RUNTIME_DIR;
      const runtimeDir = envRuntime
        ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), envRuntime))
        : path.join(process.cwd(), "runtime");
      fs.mkdirSync(runtimeDir, { recursive: true });
      fs.writeFileSync(path.join(runtimeDir, "theme.txt"), theme);
      writeJson(response, 200, { ok: true, theme });
    } catch (error) {
      writeJson(response, 500, { error: "Failed to sync theme" });
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/theme") {
    try {
      const envRuntime = process.env.MASTERBUILD_RUNTIME_DIR;
      const runtimeDir = envRuntime
        ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), envRuntime))
        : path.join(process.cwd(), "runtime");
      const themePath = path.join(runtimeDir, "theme.txt");
      const theme = fs.existsSync(themePath) ? fs.readFileSync(themePath, "utf8").trim() : "light";
      writeJson(response, 200, { theme });
    } catch {
      writeJson(response, 200, { theme: "light" });
    }
    return;
  }

  // Trends & insights derived from live scraped data
  if (request.method === "GET" && url.pathname === "/api/trends") {
    try {
      if (DEMO_MODE) {
        writeJson(response, 200, demoTrendsPayload());
        return;
      }
      await handleTrends(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to load trends." });
    }
    return;
  }

  // Force-trigger a background data refresh (bypasses age/active checks)
  if (request.method === "POST" && url.pathname === "/api/refresh") {
    try {
      writeJson(response, 200, { ok: true, message: "Background refresh triggered" });
      void runBackgroundDataRefresh(true); // force=true
    } catch (error) {
      writeJson(response, 500, { error: "Failed to trigger refresh" });
    }
    return;
  }

  // AI-generated recommendations with real revenue estimates
  if (request.method === "GET" && url.pathname === "/api/recommendations") {
    try {
      if (DEMO_MODE) {
        writeJson(response, 200, demoRecommendationsPayload());
        return;
      }
      await handleRecommendations(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to load recommendations." });
    }
    return;
  }

  // ── MongoDB Atlas Vector Search ─────────────────────────────────────────
  if (request.method === "POST" && url.pathname === "/api/search/semantic") {
    try {
      const body = await readJsonBody(request);
      const query = typeof body?.query === "string" ? body.query.trim() : "";
      if (!query) {
        writeJson(response, 400, { error: "query is required" });
        return;
      }
      const limit = Math.min(Number(body?.limit) || 12, 50);
      const mission_id =
        typeof body?.mission_id === "string" && body.mission_id.trim()
          ? body.mission_id.trim()
          : null;
      const industry =
        typeof body?.industry === "string" && body.industry.trim()
          ? body.industry.trim()
          : null;
      const platform =
        typeof body?.platform === "string" && body.platform.trim()
          ? body.platform.trim()
          : null;
      const agent_id =
        body?.agent_id != null && body.agent_id !== ""
          ? Number(body.agent_id)
          : null;

      const { results, error } = await vectorSearch({
        query,
        limit,
        mission_id,
        industry,
        platform,
        agent_id: Number.isFinite(agent_id) ? agent_id : null,
      });

      if (error) {
        writeJson(response, 500, { error, results: [] });
        return;
      }

      writeJson(response, 200, { results, query });
    } catch (error) {
      console.error("[ai-server] Semantic search error:", error.message);
      writeJson(response, 500, { error: error.message ?? "Semantic search failed" });
    }
    return;
  }

  // ── GPT-4o Deep Trend Analysis ───────────────────────────────────────────
  if (request.method === "POST" && url.pathname === "/api/ai/analyze") {
    try {
      const body = await readJsonBody(request);
      if (!body?.title) {
        writeJson(response, 400, { error: "title is required" });
        return;
      }

      const systemPrompt = `You are an expert market strategist and business analyst with deep expertise in emerging trends and market opportunities. Provide sharp, specific, data-grounded analysis. Be direct and actionable — avoid generic advice. Format your response in clear sections.`;

      const userPrompt = `Perform a deep strategic analysis of this emerging market trend:

**Trend:** ${body.title}
**Industry:** ${body.industry ?? "Not specified"}
**Description:** ${body.description ?? "N/A"}
**Keywords:** ${body.keywords ?? "N/A"}
**Trend Score:** ${body.trendScore ?? "N/A"}/100
**Growth Rate:** ${body.growthRate != null ? `${Number(body.growthRate).toFixed(1)}%` : "N/A"}
**Mention Volume:** ${body.mentionCount ?? "N/A"}

Provide your analysis in exactly these sections:

## Why This Trend Matters Now
2-3 sentences on what's driving it and why the timing is significant.

## Market Opportunity
Specific size estimate, who is underserved, and the most compelling entry angle.

## Competitive Landscape
Who are the existing players (or lack thereof), and what gaps exist.

## Fastest Path to Revenue
The single highest-leverage action a founder could take in the next 30 days.

## Key Risks
2-3 specific risks with brief mitigation strategies.

## 90-Day Outlook
Will this trend accelerate, plateau, or fade? Why?`;

      const result = await inferWithOpenAI({
        systemPrompt,
        userPrompt,
        model: process.env.OPENAI_MODEL || "gpt-4o",
        temperature: 0.4,
      });

      writeJson(response, 200, { ok: true, analysis: result.text, model: result.model ?? "gpt-4o" });
    } catch (error) {
      console.error("[ai-server] Analyze error:", error.message);
      writeJson(response, 500, { ok: false, error: error.message ?? "Analysis failed" });
    }
    return;
  }

  writeJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`);
  scheduleBackgroundJob();
});
