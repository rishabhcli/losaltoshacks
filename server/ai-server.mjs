import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { inferWithOpenAI } from "./lib/openai.mjs";
import { generateSpeechWithElevenLabs } from "./lib/elevenlabs.mjs";
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

  writeJson(response, 200, { ok: true, missionId: targetId });
}

/* ------------------------------------------------------------------ */
/*  Route: GET /api/dashboard                                          */
/* ------------------------------------------------------------------ */

async function handleDashboard(_request, response) {
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
    return writeJson(response, 200, {
      mission: null,
      agents: [],
      discoveries: [],
      logs: [],
      signals: [],
      thoughts: [],
      memory: [],
      businessPlans: [],
    });
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

  writeJson(response, 200, {
    mission: missionResult.data ?? null,
    agents: agentResult.data ?? [],
    discoveries: discoveryResult.data ?? [],
    logs: logResult.data ?? [],
    signals: signalResult.data ?? [],
    thoughts: thoughtsResult.error ? [] : (thoughtsResult.data ?? []),
    memory: memoryResult.error ? [] : (memoryResult.data ?? []),
    businessPlans: businessPlanResult.error ? [] : (businessPlanResult.data ?? []),
  });
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

    const runtimeDir = process.env.MASTERBUILD_RUNTIME_DIR || path.join(process.cwd(), "agents", "runtime");
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

  writeJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`);
});
