import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { inferWithOpenAI } from "./lib/openai.mjs";
import { generateSpeechWithElevenLabs } from "./lib/elevenlabs.mjs";
import { generateSpeechWithMiniMax } from "./lib/minimax.mjs";
import { loadProjectEnv } from "./lib/env.mjs";
import { createServerInsforgeClient } from "./lib/insforge-server.mjs";

loadProjectEnv();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1);
});

const port = Number.parseInt(process.env.AI_SERVER_PORT || "3001", 10);

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

const MISSION_COLUMNS = "id,prompt,status,live_url_1,live_url_2,live_url_3,live_url_4,live_url_5,final_options";
const AGENT_COLUMNS = "id,agent_id,status,current_url,profile_path,energy";
const DISCOVERY_COLUMNS = "id,source_url,thumbnail_url,agent_id,keywords,likes,views,comments,created_at";
const LOG_COLUMNS = "id,agent_id,message,type,metadata,created_at";
const SIGNAL_COLUMNS = "id,from_agent,to_agent,message,signal_type,created_at";
const THOUGHT_COLUMNS = "id,agent_id,thought_type,prompt_summary,response_summary,action_taken,model,tokens_used,duration_ms,created_at";
const MEMORY_COLUMNS = "id,filename,content,version,updated_by,updated_at";
const BUSINESS_PLAN_COLUMNS = "id,version,market_opportunity,competitive_landscape,revenue_models,user_acquisition,risk_analysis,confidence_score,discovery_count,is_final,raw_plan,created_at";
const DASHBOARD_CACHE_TTL_MS = 1500;

let dashboardSnapshotCache = null;
let dashboardSnapshotFetchedAt = 0;
let dashboardSnapshotInFlight = null;

function invalidateDashboardSnapshot() {
  dashboardSnapshotCache = null;
  dashboardSnapshotFetchedAt = 0;
}

async function resolveMissionId(insforge, missionId) {
  if (missionId) return missionId;

  const result = await insforge.database
    .from("missions")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1);

  if (result.error) throw result.error;

  const row = result.data?.[0];
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
      message: "Mission queued and awaiting worker pickup.",
      metadata: { prompt },
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
    mission: { mission_id: missionId, prompt, status: "queued" },
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

  // Clear browser preview screenshots
  try {
    const envRuntime = process.env.MASTERBUILD_RUNTIME_DIR;
    const runtimeDir = envRuntime
      ? (path.isAbsolute(envRuntime) ? envRuntime : path.join(process.cwd(), "agents", envRuntime))
      : path.join(process.cwd(), "agents", "runtime");
    for (let aid = 1; aid <= 5; aid++) {
      const framePath = path.join(runtimeDir, "previews", `agent-${aid}`, "latest.jpg");
      if (fs.existsSync(framePath)) fs.unlinkSync(framePath);
    }
  } catch { /* ignore cleanup errors */ }

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

  const missionResult = await insforge.database
    .from("missions")
    .select(MISSION_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (missionResult.error) throw missionResult.error;

  const missionId =
    missionResult.data && typeof missionResult.data === "object" && "id" in missionResult.data
      ? String(missionResult.data.id ?? "")
      : "";

  if (!missionId) {
    return {
      mission: null,
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
    mission: missionResult.data ?? null,
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
const STOP_WORDS = new Set(["the", "and", "for", "with", "that", "this", "from", "have", "are", "its", "can", "will", "not", "but", "our"]);

function synthesizeTrendsFromDiscoveries(discoveries, missionPrompt, missionId) {
  if (!discoveries.length) return [];

  const keywordGroups = new Map();

  for (const disc of discoveries) {
    const rawKeywords = disc.keywords ?? "";
    const keywords = rawKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 3 && !STOP_WORDS.has(k));

    const engagement =
      (disc.likes ?? 0) +
      Math.floor((disc.views ?? 0) / 100) +
      (disc.comments ?? 0) * 5;

    const platform = PLATFORM_BY_AGENT_ID[disc.agent_id] ?? "unknown";

    for (const kw of keywords.slice(0, 4)) {
      if (!keywordGroups.has(kw)) {
        keywordGroups.set(kw, { count: 0, engagement: 0, platforms: new Set(), sources: [] });
      }
      const g = keywordGroups.get(kw);
      g.count++;
      g.engagement += engagement;
      g.platforms.add(platform);
      // Collect up to 8 clickable sources per keyword group
      if (disc.source_url && g.sources.length < 8) {
        g.sources.push({
          url: disc.source_url,
          thumbnail: disc.thumbnail_url || null,
          platform,
          keywords: rawKeywords.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 3).join(", "),
          likes: disc.likes ?? 0,
          views: disc.views ?? 0,
          comments: disc.comments ?? 0,
        });
      }
    }
  }

  const sorted = [...keywordGroups.entries()]
    .sort((a, b) => (b[1].count * 3 + b[1].engagement) - (a[1].count * 3 + a[1].engagement))
    .slice(0, 15);

  return sorted.map(([keyword, data], i) => {
    const score = Math.min(99, 40 + data.count * 4 + Math.floor(data.engagement / 50));
    const mentionCount = data.count * 5000 + data.engagement * 100;
    const growthRate = parseFloat(Math.min(99, 12 + (data.count / discoveries.length) * 80).toFixed(1));
    const title = keyword.replace(/\b\w/g, (l) => l.toUpperCase());

    return {
      $primaryKey: `live-${missionId}-${i}`,
      trendId: `live-${missionId}-${i}`,
      title,
      description: `Trending across ${[...data.platforms].join(", ")} — found in ${data.count} source(s) from research on "${missionPrompt}".`,
      industry: "All",
      category: "Live Research",
      status: score > 72 ? "growing" : "emerging",
      trendScore: score,
      mentionCount,
      growthRate,
      sentimentScore: 0.65,
      topKeywords: keyword,
      detectedAt: new Date().toISOString(),
      sources: [...data.sources],
    };
  });
}

function synthesizeTrendsFromOptions(finalOptions, missionPrompt, missionId) {
  if (!finalOptions?.options?.length) return [];

  return finalOptions.options.slice(0, 8).map((option, i) => {
    const evidenceList = option.evidence ?? [];
    const evidenceKeywords = evidenceList
      .map((e) => e.keywords)
      .filter(Boolean)
      .slice(0, 5)
      .join(", ");

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
      title: option.title,
      description: option.concept || option.whyPromising || `Market opportunity from research on "${missionPrompt}"`,
      industry: "All",
      category: option.recommendedFormat || "Live Research",
      status: i < 3 ? "growing" : "emerging",
      trendScore: Math.max(60, 95 - i * 6),
      mentionCount: Math.max(50000, (evidenceList.length ?? 1) * 20000),
      growthRate: parseFloat(Math.max(10, 35 - i * 4).toFixed(1)),
      sentimentScore: 0.72,
      topKeywords: evidenceKeywords || option.title,
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

  const missionResult = await insforge.database
    .from("missions")
    .select("id,prompt,status,final_options")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (missionResult.error || !missionResult.data) {
    writeJson(response, 200, { trends: [], insights: [] });
    return;
  }

  const mission = missionResult.data;
  const missionId = String(mission.id ?? "");
  const missionPrompt = String(mission.prompt ?? "");

  const [discResult, planResult] = await Promise.all([
    insforge.database
      .from("discoveries")
      .select("id,agent_id,source_url,thumbnail_url,keywords,likes,views,comments,created_at")
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
let recsCache = null;
let recsCachedAt = 0;
let recsInFlight = null;

function invalidateRecsCache() {
  recsCache = null;
  recsCachedAt = 0;
}

async function generateLiveRecommendations() {
  const insforge = createServerInsforgeClient();

  const missionResult = await insforge.database
    .from("missions")
    .select("id,prompt,final_options")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (missionResult.error || !missionResult.data) return { recommendations: [] };

  const mission = missionResult.data;
  const missionId = String(mission.id ?? "");
  const missionPrompt = String(mission.prompt ?? "");

  const planResult = await insforge.database
    .from("business_plans")
    .select("id,market_opportunity,competitive_landscape,revenue_models,user_acquisition,risk_analysis,confidence_score,discovery_count,created_at")
    .eq("mission_id", missionId)
    .order("is_final", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (planResult.error || !planResult.data) return { recommendations: [] };

  const plan = planResult.data;

  // Build discovery keyword summary for context
  const discResult = await insforge.database
    .from("discoveries")
    .select("keywords,likes,views")
    .eq("mission_id", missionId)
    .order("created_at", { ascending: false })
    .limit(40);

  const topKeywords = (discResult.data ?? [])
    .flatMap((d) => (d.keywords ?? "").split(",").map((k) => k.trim()).filter(Boolean))
    .slice(0, 20)
    .join(", ");

  const systemPrompt = `You are a strategic market analyst. Given real scraped research data, generate actionable business recommendations with specific, data-grounded revenue estimates. Output only a valid JSON array — no markdown, no prose.`;

  const userPrompt = `Generate 6 actionable business recommendations with realistic revenue potential.

Research Topic: ${missionPrompt}
Confidence Score: ${plan.confidence_score ?? 0}%
Sources Analyzed: ${plan.discovery_count ?? 0}
Top Trending Keywords: ${topKeywords || "N/A"}

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
    "title": "Short action title (max 8 words)",
    "description": "1-2 sentence description of the opportunity and why it matters now",
    "productCategory": "One of: Product, Service, Platform, Partnership, Content, Community",
    "targetDemographic": "Specific target audience (e.g. Gen Z shoppers 18-24, B2B SaaS teams)",
    "confidenceScore": 0.82,
    "estimatedRevenuePotential": "Specific estimate like '$2.4M ARR', '$180K first quarter', '$45K/month'",
    "priority": "high",
    "actionPlan": "2-3 concrete steps to execute this recommendation"
  }
]

Rules:
- Revenue estimates must be specific dollar amounts derived from the data, not vague ranges
- Scale estimates to match the research scope and discovery count
- priority must be "high", "medium", or "low"
- confidenceScore must be between 0.50 and 0.97`;

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

  const recommendations = rawRecs.slice(0, 8).map((rec, i) => ({
    $primaryKey: `live-rec-${missionId}-${i}`,
    recommendationId: `live-rec-${missionId}-${i}`,
    trendId: `live-${missionId}-${i % 8}`,
    title: rec.title ?? "Recommendation",
    description: rec.description ?? "",
    productCategory: rec.productCategory ?? "Product",
    targetDemographic: rec.targetDemographic ?? "",
    confidenceScore: typeof rec.confidenceScore === "number" ? rec.confidenceScore : 0.7,
    estimatedRevenuePotential: rec.estimatedRevenuePotential ?? "",
    priority: ["high", "medium", "low"].includes(rec.priority) ? rec.priority : "medium",
    status: "active",
    actionPlan: rec.actionPlan ?? "",
    createdAt: new Date().toISOString(),
  }));

  return { recommendations, missionId };
}

async function handleRecommendations(_request, response) {
  const now = Date.now();
  if (recsCache && now - recsCachedAt < RECS_CACHE_TTL_MS) {
    writeJson(response, 200, recsCache);
    return;
  }

  if (!recsInFlight) {
    recsInFlight = generateLiveRecommendations()
      .then((result) => {
        recsCache = result;
        recsCachedAt = Date.now();
        return result;
      })
      .finally(() => { recsInFlight = null; });
  }

  try {
    const result = await recsInFlight;
    writeJson(response, 200, result);
  } catch (error) {
    console.error("[ai-server] handleRecommendations error:", error);
    if (recsCache) {
      writeJson(response, 200, recsCache);
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
  "trending clothing streetwear fashion sneakers accessories viral 2025",
  "viral makeup skincare beauty products ingredients trending now",
  "trending food beverages drinks viral recipes new brands 2025",
  "trending travel destinations experiences hotels popular 2025",
  "trending wellness fitness supplements workout wearables 2025",
  "trending AI tools SaaS software apps gaining users 2025",
  "trending digital health telehealth mental health apps 2025",
  "trending fintech payment apps crypto investing platforms 2025",
  "trending proptech real estate market housing 2025",
  "trending edtech online learning courses AI tutoring 2025",
  "trending streaming gaming creator economy social media 2025",
  "trending consumer products brands going viral reddit twitter 2025",
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
  const text = `${title ?? ""} ${description ?? ""}`.toLowerCase();
  const words = text
    .split(/[\s,;:'"!?.|()\[\]{}<>\/\\–—]+/)
    .map(w => w.replace(/[^a-z0-9]/g, ""))
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
  return [...new Set(words)].slice(0, 6).join(", ");
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
      return data?.web?.results ?? [];
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

  // Run Brave Search queries sequentially (200ms gap to respect rate limits)
  const discoveries = [];
  for (const q of BG_SEARCH_QUERIES) {
    const results = await runBraveSearch(q);
    for (const r of results) {
      if (!r.url) continue;
      const keywords = extractKeywordsFromResult(r.title, r.description);
      if (!keywords) continue;
      discoveries.push({
        mission_id:    missionId,
        agent_id:      detectAgentId(r.url),
        source_url:    r.url,
        thumbnail_url: r.thumbnail?.src ?? r.thumbnail?.original ?? null,
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
  for (let i = 0; i < discoveries.length; i += 50) {
    await insforge.database.from("discoveries").insert(discoveries.slice(i, i + 50));
  }
  console.log(`[bg-job] Inserted ${discoveries.length} discoveries`);

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
}`,
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

  writeJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`);
  scheduleBackgroundJob();
});
