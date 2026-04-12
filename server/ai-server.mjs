import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { inferWithOpenAI } from "./lib/openai.mjs";
import { generateSpeechWithElevenLabs } from "./lib/elevenlabs.mjs";
import { generateSpeechWithMiniMax } from "./lib/minimax.mjs";
import { loadProjectEnv } from "./lib/env.mjs";
import { createServerInsforgeClient } from "./lib/insforge-server.mjs";
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
    ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), "agents", envRuntime))
    : path.join(process.cwd(), "agents", "runtime");
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
const AGENT_COLUMNS = "id,agent_id,status,current_url,profile_path,energy";
const DISCOVERY_COLUMNS = "id,source_url,thumbnail_url,agent_id,title,summary,keywords,industry,likes,views,comments,created_at";
const LOG_COLUMNS = "id,agent_id,message,type,metadata,created_at";
const SIGNAL_COLUMNS = "id,from_agent,to_agent,message,signal_type,created_at";
const THOUGHT_COLUMNS = "id,agent_id,thought_type,prompt_summary,response_summary,action_taken,model,tokens_used,duration_ms,created_at";
const MEMORY_COLUMNS = "id,filename,content,version,updated_by,updated_at";
const BUSINESS_PLAN_COLUMNS = "id,version,market_opportunity,competitive_landscape,revenue_models,user_acquisition,risk_analysis,confidence_score,discovery_count,is_final,raw_plan,created_at";
const DASHBOARD_CACHE_TTL_MS = 1500;
const USER_MISSION_LOOKBACK_LIMIT = 100;

let dashboardSnapshotCache = null;
let dashboardSnapshotFetchedAt = 0;
let dashboardSnapshotInFlight = null;

const BACKGROUND_MISSION_PROMPT_PREFIX = "Background market research:";

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

      const agentStopping = await insforge.database
        .from("agents")
        .update({ status: "stopped", energy: 0 })
        .eq("mission_id", priorMissionId);
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
    live_url_1: "/agent-stream/1",
    live_url_2: "/agent-stream/2",
    live_url_3: "/agent-stream/3",
    live_url_4: "/agent-stream/4",
    live_url_5: "/agent-stream/5",
    created_at: timestamp,
    updated_at: timestamp,
  }]);

  if (missionInsert.error) throw missionInsert.error;

  try {
    const agentInsert = await insforge.database.from("agents").insert(
      AGENT_ROWS.map((agent) => ({
        mission_id: missionId,
        agent_id: agent.agentId,
        name: agent.name,
        platform: agent.platform,
        role: agent.role,
        status: "idle",
        preview_url: agent.previewUrl,
        assignment: prompt,
        energy: 100,
        created_at: timestamp,
        updated_at: timestamp,
        last_heartbeat: timestamp,
      }))
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

  const agentUpdate = await insforge.database
    .from("agents")
    .update({ status: "stopped", energy: 0 })
    .eq("mission_id", targetId);
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
    return writeJson(response, 200, { ok: true, missionId: null });
  }

  // Send stop command first
  await insforge.database.from("control_commands").insert([{
    mission_id: targetId,
    command: "stop_all",
    payload: { source: "reset" },
    status: "pending",
  }]);

  // Wait for agents to acknowledge stop
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Delete data from resettable tables
  for (const table of RESETTABLE_TABLES) {
    const deleteResult = await insforge.database
      .from(table)
      .delete()
      .eq("mission_id", targetId);
    if (deleteResult.error) throw deleteResult.error;
  }

  // Reset agents to idle
  const agentReset = await insforge.database
    .from("agents")
    .update({
      status: "idle",
      current_url: "",
      assignment: "",
      energy: 100,
      session_id: null,
      preview_bucket: null,
      preview_key: null,
      preview_updated_at: null,
    })
    .eq("mission_id", targetId);
  if (agentReset.error) throw agentReset.error;

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
  if (missionReset.error) throw missionReset.error;

  invalidateDashboardSnapshot();
  invalidateRecsCache();

  writeJson(response, 200, { ok: true, missionId: targetId });
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
  const mission = selectLatestUserFacingMission(missionRows);

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
      insforge.database.from("agents").select(AGENT_COLUMNS).eq("mission_id", missionId).order("agent_id", { ascending: true }),
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
    recentMissions: filterUserFacingMissions(missionRows).slice(0, 12),
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
    throw error;
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
          url: disc.source_url,
          thumbnail: disc.thumbnail_url || null,
          platform,
          title: stripSourceSuffix(disc.title ?? ""),
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
        url: e.source_url || e.url,
        thumbnail: e.thumbnail_url || e.thumbnail || null,
        platform: e.platform || "market_research",
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

const BG_JOB_INTERVAL_MS = 6 * 60 * 60 * 1000;  // re-run every 6 hours
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
    live_url_1: "/agent-stream/1", live_url_2: "/agent-stream/2",
    live_url_3: "/agent-stream/3", live_url_4: "/agent-stream/4",
    live_url_5: "/agent-stream/5",
    created_at: timestamp, updated_at: timestamp,
  }]);
  if (missionInsert.error) { console.error("[bg-job] Mission insert error:", missionInsert.error); return; }

  await insforge.database.from("agents").insert(
    AGENT_ROWS.map(a => ({
      mission_id: missionId, agent_id: a.agentId, name: a.name,
      platform: a.platform, role: a.role, status: "idle",
      preview_url: a.previewUrl, assignment: prompt, energy: 100,
      created_at: timestamp, updated_at: timestamp, last_heartbeat: timestamp,
    }))
  );

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
    }
  } catch (err) {
    console.error("[bg-job] Business plan generation failed:", err.message);
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
  // Run 8 seconds after server starts so it's fully ready
  setTimeout(() => {
    runBackgroundDataRefresh().catch(err => console.error("[bg-job] Startup run error:", err));
  }, 8000);

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
    writeJson(response, 200, { ok: true, service: "ai-server" });
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
      await handleMissionCreate(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to create mission." });
    }
    return;
  }

  // Mission stop
  if (request.method === "POST" && url.pathname === "/api/mission/stop") {
    try {
      await handleMissionStop(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to stop mission." });
    }
    return;
  }

  // Mission reset
  if (request.method === "POST" && url.pathname === "/api/mission/reset") {
    try {
      await handleMissionReset(request, response);
    } catch (error) {
      writeJson(response, 500, { error: error instanceof Error ? error.message : "Failed to reset mission." });
    }
    return;
  }

  // Dashboard snapshot
  if (request.method === "GET" && url.pathname === "/api/dashboard") {
    try {
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
      ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), "agents", envRuntime))
      : path.join(process.cwd(), "agents", "runtime");
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
        ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), "agents", envRuntime))
        : path.join(process.cwd(), "agents", "runtime");
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
        ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), "agents", envRuntime))
        : path.join(process.cwd(), "agents", "runtime");
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
