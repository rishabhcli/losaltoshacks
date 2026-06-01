import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

import {
  MASTERBUILD_DASHBOARD_CONTRACT_VERSION,
  MASTERBUILD_DASHBOARD_KEYS,
  hasMasterBuildDashboardShape,
} from "../src/lib/masterbuild-contract.ts";

const host = process.env.MARKETPULSE_API_CONTRACT_HOST || "127.0.0.1";
const portOverride = Number.parseInt(process.env.MARKETPULSE_API_CONTRACT_PORT || "0", 10);
const port = portOverride > 0 ? portOverride : await findFreePort(3401);
const baseUrl = `http://${host}:${port}`;
const timeoutMs = Number.parseInt(process.env.MARKETPULSE_API_CONTRACT_TIMEOUT_MS || "45000", 10);
const shutdownGraceMs = Number.parseInt(process.env.MARKETPULSE_API_CONTRACT_SHUTDOWN_MS || "5000", 10);
const verbose = process.env.MARKETPULSE_API_CONTRACT_VERBOSE === "1";

const errors = [];
const checks = [];
const output = [];
const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "marketpulse-api-contracts-runtime-"));

function addError(message, details = {}) {
  errors.push({ message, ...details });
}

function record(name, details = {}) {
  checks.push({ name, ...details });
}

function collectStructuredServerLogs() {
  return output
    .join("")
    .split(/\r?\n/)
    .map((line) => {
      const jsonStart = line.indexOf("{");
      const candidate = jsonStart >= 0 ? line.slice(jsonStart) : line;
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    })
    .filter((entry) => entry?.scope === "ai-server" && typeof entry.event === "string");
}

function canListen(portToCheck) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(portToCheck, host);
  });
}

async function findFreePort(startPort) {
  for (let candidate = startPort; candidate < startPort + 200; candidate += 1) {
    if (await canListen(candidate)) return candidate;
  }
  throw new Error(`No free TCP port found from ${startPort} to ${startPort + 199}.`);
}

function prefixStream(stream, prefix) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    const text = String(chunk);
    output.push(text);
    if (!verbose) return;
    for (const line of text.split(/\r?\n/)) {
      if (line.trim()) console.log(`${prefix} ${line}`);
    }
  });
}

async function fetchJson(path, { method = "GET", body, statuses = [200], recordErrors = true, requestTimeoutMs = 5000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      if (recordErrors) addError("Endpoint returned non-JSON body.", { path, status: response.status, body: text.slice(0, 200) });
      return { response, json: null };
    }
    if (recordErrors && !statuses.includes(response.status)) {
      addError("Endpoint returned unexpected status.", { path, expected: statuses, actual: response.status, body: json });
    }
    return { response, json };
  } catch (error) {
    if (recordErrors) addError("Endpoint request failed.", { path, error: String(error?.message ?? error) });
    return { response: null, json: null };
  } finally {
    clearTimeout(timer);
  }
}

async function waitForHealth() {
  const startedAt = Date.now();
  let lastError = null;
  while (Date.now() - startedAt < timeoutMs) {
    if (exitedEarly) throw new Error("AI server exited before health became ready.");
    try {
      const { response, json } = await fetchJson("/health", { recordErrors: false });
      if (response?.ok && json?.ok === true && json?.demoMode === true) return json;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`AI server /health did not become ready within ${timeoutMs}ms: ${lastError?.message ?? "not ready"}`);
}

function assertRecord(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    addError(`${label} must be an object.`);
    return false;
  }
  return true;
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    addError(`${label} must be an array.`);
    return false;
  }
  return true;
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    addError(`${label} must be a nonempty string.`);
    return false;
  }
  return true;
}

function isPathInside(childPath, parentPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertBoolean(value, label) {
  if (typeof value !== "boolean") {
    addError(`${label} must be a boolean.`);
    return false;
  }
  return true;
}

function validateHealth(body) {
  if (!assertRecord(body, "/health body")) return;
  if (body.ok !== true) addError("/health ok must be true.", { body });
  if (body.demoMode !== true) addError("/health demoMode must be true.", { body });
  if (body.status !== "ready") addError("/health status must be ready.", { status: body.status });
  if (!Array.isArray(body.missingRequired) || body.missingRequired.length !== 0) addError("/health missingRequired must be empty.", { missingRequired: body.missingRequired });
  assertArray(body.checks, "/health checks");
  const names = new Set((body.checks ?? []).map((check) => check?.name));
  for (const name of ["ai-server", "insforge", "openai", "python-worker", "mongodb-vector", "tts", "brave-search"]) {
    if (!names.has(name)) addError("/health checks missing integration.", { name });
  }
  record("health", { integrations: [...names].length });
}

function validatePreflight(body, { strict }) {
  if (!assertRecord(body, strict ? "strict worker preflight body" : "worker preflight body")) return;
  if (body.strict !== strict) addError("Worker preflight strict flag mismatch.", { strict, actual: body.strict });
  assertBoolean(body.ok, "worker preflight ok");
  assertBoolean(body.workerCanStart, "worker preflight workerCanStart");
  assertBoolean(body.liveMissionReady, "worker preflight liveMissionReady");
  if (typeof body.exitCode !== "number") addError("worker preflight exitCode must be numeric.", { exitCode: body.exitCode });
  if (body.insforge !== undefined) assertRecord(body.insforge, "worker preflight insforge");
  if (body.liveLlm !== undefined) assertRecord(body.liveLlm, "worker preflight liveLlm");
  if (strict && body.ok !== body.liveMissionReady) {
    addError("Strict worker preflight ok must equal liveMissionReady.", { ok: body.ok, liveMissionReady: body.liveMissionReady });
  }
  record(strict ? "worker-preflight-strict" : "worker-preflight", {
    ok: body.ok,
    workerCanStart: body.workerCanStart,
    liveMissionReady: body.liveMissionReady,
  });
}

function validateMissionCreate(body, prompt) {
  if (!assertRecord(body, "mission create body")) return null;
  if (body.ok !== true) addError("mission create ok must be true.", { body });
  if (body.demoMode !== true) addError("mission create must report demoMode.", { body });
  if (!assertRecord(body.mission, "mission create mission")) return null;
  assertString(body.mission.mission_id, "mission.mission_id");
  if (body.mission.prompt !== prompt) addError("mission prompt mismatch.", { expected: prompt, actual: body.mission.prompt });
  if (body.mission.status !== "completed") addError("demo mission status must be completed.", { status: body.mission.status });
  assertArray(body.mission.supersededMissionIds, "mission.supersededMissionIds");
  record("mission-create", { missionId: body.mission.mission_id, status: body.mission.status });
  return body.mission.mission_id;
}

function validateDashboard(body, missionId = null) {
  if (!hasMasterBuildDashboardShape(body)) {
    addError("dashboard body does not match masterbuild dashboard shape.", { contract: MASTERBUILD_DASHBOARD_CONTRACT_VERSION });
    return;
  }
  for (const key of MASTERBUILD_DASHBOARD_KEYS) {
    if (!(key in body)) addError("dashboard missing contract key.", { key });
  }
  if (missionId && body.mission?.id !== missionId) addError("dashboard mission id mismatch.", { expected: missionId, actual: body.mission?.id });
  if (missionId) {
    if ((body.agents ?? []).length !== 5) addError("dashboard must expose five demo agents.", { agents: body.agents?.length });
    if ((body.discoveries ?? []).length === 0) addError("dashboard must expose demo discoveries.");
    if ((body.businessPlans ?? []).length === 0) addError("dashboard must expose demo business plans.");
  }
  record("dashboard", {
    mission: body.mission?.id ?? null,
    agents: body.agents.length,
    discoveries: body.discoveries.length,
    businessPlans: body.businessPlans.length,
  });
}

function validateRetry(body, missionId) {
  if (!assertRecord(body, "agent retry body")) return;
  if (body.ok !== true) addError("agent retry ok must be true.", { body });
  if (body.demoMode !== true) addError("agent retry must report demoMode.", { body });
  if (body.missionId !== missionId) addError("agent retry mission id mismatch.", { expected: missionId, actual: body.missionId });
  if (body.agentId !== 3) addError("agent retry agent id mismatch.", { agentId: body.agentId });
  if (!assertRecord(body.agent, "agent retry agent")) return;
  if (body.agent.status !== "queued") addError("retried agent must be queued.", { status: body.agent.status });
  record("agent-retry", { agentId: body.agentId, status: body.agent.status });
}

function validateTrends(body) {
  if (!assertRecord(body, "trends body")) return;
  assertArray(body.trends, "trends.trends");
  assertArray(body.insights, "trends.insights");
  if ((body.trends ?? []).length === 0) addError("demo trends must be nonempty after mission create.");
  if (!body.trends?.some((trend) => Array.isArray(trend.sources) && trend.sources.length > 0)) {
    addError("at least one demo trend must include source evidence.");
  }
  record("trends", { trends: body.trends?.length ?? 0, insights: body.insights?.length ?? 0 });
}

function validateRecommendations(body) {
  if (!assertRecord(body, "recommendations body")) return;
  assertArray(body.recommendations, "recommendations.recommendations");
  if ((body.recommendations ?? []).length === 0) addError("demo recommendations must be nonempty after mission create.");
  record("recommendations", { recommendations: body.recommendations?.length ?? 0 });
}

function validateBackgroundRefreshStatus(body, { afterRefresh = false, expectedSkipped = 1, expectedRunId = null } = {}) {
  if (!assertRecord(body, "background refresh status body")) return;
  if (body.ok !== true) addError("background refresh status ok must be true.", { body });
  if (body.demoMode !== true) addError("background refresh status must report demoMode.", { body });
  if (body.status !== "disabled") addError("demo background refresh status must be disabled.", { status: body.status });
  if (body.scheduler?.enabled !== false) addError("demo background refresh scheduler must be disabled.", { scheduler: body.scheduler });
  if (body.scheduler?.blocked !== true) addError("demo background refresh scheduler must report blocked readiness.", { scheduler: body.scheduler });
  if (typeof body.scheduler?.queryCount !== "number" || body.scheduler.queryCount <= 0) addError("background refresh scheduler queryCount must be positive.", { scheduler: body.scheduler });
  validateBackgroundRefreshReadiness(body.readiness, { embedded: true });
  assertRecord(body.totals, "background refresh totals");
  assertArray(body.recentRuns, "background refresh recentRuns");

  if (afterRefresh) {
    if (body.lastRun?.status !== "skipped" || body.lastRun?.reason !== "demo_mode") {
      addError("demo background refresh trigger must record a skipped demo-mode run.", { lastRun: body.lastRun });
    }
    if (!("retry" in (body.lastRun ?? {})) || body.lastRun.retry !== null) {
      addError("non-failed background refresh runs must expose an empty retry field.", { lastRun: body.lastRun });
    }
    if (typeof body.lastRun?.duplicateSourcesSkipped !== "number" || typeof body.lastRun?.discoveryInsertFailures !== "number") {
      addError("background refresh runs must expose idempotency counters.", { lastRun: body.lastRun });
    }
    if (expectedRunId && body.lastRun?.runId !== expectedRunId) {
      addError("background refresh status must preserve the latest run id.", { expectedRunId, lastRun: body.lastRun });
    }
    if (body.currentRun !== null) {
      addError("demo background refresh skip must not leak a currentRun.", { currentRun: body.currentRun });
    }
    if (!Array.isArray(body.recentRuns) || body.recentRuns.length === 0) {
      addError("demo background refresh trigger must record a recent run.", { recentRuns: body.recentRuns });
    } else if (body.recentRuns[0]?.runId !== body.lastRun?.runId) {
      addError("latest background refresh run must be prepended to recentRuns.", {
        lastRun: body.lastRun,
        firstRecentRun: body.recentRuns[0],
      });
    }
    if (Number(body.totals?.skipped ?? 0) < expectedSkipped) {
      addError("background refresh skipped total must increment after demo trigger.", { totals: body.totals });
    }
  }

  record(afterRefresh ? "background-refresh-status-after-trigger" : "background-refresh-status", {
    status: body.status,
    lastRunStatus: body.lastRun?.status ?? null,
    skipped: body.totals?.skipped ?? 0,
  });
}

function validateBackgroundRefreshReadiness(body, { embedded = false } = {}) {
  if (!assertRecord(body, "background refresh readiness body")) return;
  if (body.demoMode !== true) addError("background refresh readiness must report demoMode.", { body });
  if (body.ok !== false || body.liveReady !== false || body.canStartNow !== false) {
    addError("demo background refresh readiness must block live starts.", {
      ok: body.ok,
      liveReady: body.liveReady,
      canStartNow: body.canStartNow,
    });
  }
  assertArray(body.blockingReasons, "background refresh readiness blockingReasons");
  assertArray(body.warnings, "background refresh readiness warnings");
  assertArray(body.checks, "background refresh readiness checks");
  const names = new Set((body.checks ?? []).map((check) => check?.name));
  for (const name of ["live-mode", "insforge-url", "insforge-token", "brave-search-key", "openai-key", "rate-limit-budget", "single-flight", "mongodb-vector"]) {
    if (!names.has(name)) addError("background refresh readiness missing check.", { name });
  }
  if (!body.blockingReasons?.includes("live-mode")) {
    addError("demo background refresh readiness must include live-mode as a blocker.", { blockingReasons: body.blockingReasons });
  }
  if (typeof body.rateLimit?.queryCount !== "number" || body.rateLimit.queryCount <= 0) {
    addError("background refresh readiness must expose rate-limit query count.", { rateLimit: body.rateLimit });
  }
  if (typeof body.rateLimit?.searchDelayMs !== "number" || body.rateLimit.searchDelayMs < body.rateLimit?.minDelayMs) {
    addError("background refresh readiness must expose a safe search delay.", { rateLimit: body.rateLimit });
  }

  if (!embedded) {
    record("background-refresh-readiness", {
      liveReady: body.liveReady,
      blockers: body.blockingReasons?.length ?? 0,
      queryCount: body.rateLimit?.queryCount ?? null,
    });
  }
}

function validateBackgroundRefreshExport(body, expectedRunId = null) {
  if (!assertRecord(body, "background refresh export body")) return;
  if (body.ok !== true) addError("background refresh export ok must be true.", { body });
  if (body.artifactType !== "marketpulse.background-refresh.operation-evidence") {
    addError("background refresh export artifact type mismatch.", { artifactType: body.artifactType });
  }
  if (body.schemaVersion !== 1) addError("background refresh export schema version must be 1.", { schemaVersion: body.schemaVersion });
  assertString(body.path, "background refresh export path");
  assertString(body.runtimeRelativePath, "background refresh export runtimeRelativePath");
  assertString(body.sha256, "background refresh export sha256");
  if (typeof body.bytes !== "number" || body.bytes <= 0) addError("background refresh export bytes must be positive.", { bytes: body.bytes });
  if (!assertRecord(body.operatorSummary, "background refresh export operatorSummary")) return;
  if (body.operatorSummary.lastRunId !== expectedRunId) {
    addError("background refresh export must preserve latest run id.", {
      expectedRunId,
      lastRunId: body.operatorSummary.lastRunId,
    });
  }
  if (!isPathInside(body.path, runtimeDir)) {
    addError("background refresh export must be written inside MASTERBUILD_RUNTIME_DIR.", {
      path: body.path,
      runtimeDir,
    });
    return;
  }
  if (!fs.existsSync(body.path)) {
    addError("background refresh export artifact file must exist.", { path: body.path });
    return;
  }

  const raw = fs.readFileSync(body.path, "utf8");
  const sha256 = crypto.createHash("sha256").update(raw).digest("hex");
  if (sha256 !== body.sha256) {
    addError("background refresh export artifact hash mismatch.", { expected: body.sha256, actual: sha256 });
  }
  if (Buffer.byteLength(raw, "utf8") !== body.bytes) {
    addError("background refresh export artifact byte count mismatch.", { expected: body.bytes, actual: Buffer.byteLength(raw, "utf8") });
  }

  try {
    const artifact = JSON.parse(raw);
    if (artifact.artifactType !== body.artifactType) addError("background refresh export file artifact type mismatch.", { artifactType: artifact.artifactType });
    if (artifact.schemaVersion !== body.schemaVersion) addError("background refresh export file schema version mismatch.", { schemaVersion: artifact.schemaVersion });
    if (artifact.operatorSummary?.lastRunId !== expectedRunId) {
      addError("background refresh export file must preserve latest run id.", {
        expectedRunId,
        lastRunId: artifact.operatorSummary?.lastRunId,
      });
    }
    validateBackgroundRefreshReadiness(artifact.evidence?.readiness, { embedded: true });
    if (!Array.isArray(artifact.evidence?.recentRuns)) {
      addError("background refresh export file must include recent runs.", { evidence: artifact.evidence });
    }
  } catch (error) {
    addError("background refresh export artifact file must be parseable JSON.", { error: String(error?.message ?? error) });
  }

  record("background-refresh-export", {
    bytes: body.bytes,
    runtimeRelativePath: body.runtimeRelativePath,
    lastRunId: body.operatorSummary.lastRunId,
  });
}

function validateBackgroundRefreshExportsIndex(body, exportedArtifact) {
  if (!assertRecord(body, "background refresh exports index body")) return;
  if (body.ok !== true) addError("background refresh exports index ok must be true.", { body });
  if (body.artifactType !== "marketpulse.background-refresh.operation-evidence.index") {
    addError("background refresh exports index artifact type mismatch.", { artifactType: body.artifactType });
  }
  if (body.schemaVersion !== 1) addError("background refresh exports index schema version must be 1.", { schemaVersion: body.schemaVersion });
  assertString(body.runtimeRelativeDirectory, "background refresh exports index runtimeRelativeDirectory");
  assertArray(body.artifacts, "background refresh exports index artifacts");
  if (typeof body.count !== "number" || body.count < 1) {
    addError("background refresh exports index count must include the exported artifact.", { count: body.count });
  }
  const match = (body.artifacts ?? []).find((artifact) => artifact.filename === exportedArtifact?.filename);
  if (!match) {
    addError("background refresh exports index must include the exported artifact.", {
      filename: exportedArtifact?.filename,
      artifacts: body.artifacts,
    });
    return;
  }
  if (match.sha256 !== exportedArtifact.sha256) {
    addError("background refresh exports index must preserve artifact hash.", { expected: exportedArtifact.sha256, actual: match.sha256 });
  }
  if (match.bytes !== exportedArtifact.bytes) {
    addError("background refresh exports index must preserve artifact byte count.", { expected: exportedArtifact.bytes, actual: match.bytes });
  }
  if (match.lastRunId !== exportedArtifact.operatorSummary?.lastRunId) {
    addError("background refresh exports index must preserve latest run id.", {
      expected: exportedArtifact.operatorSummary?.lastRunId,
      actual: match.lastRunId,
    });
  }
  if (match.parseable !== true) addError("background refresh exports index must mark exported artifact parseable.", { match });

  record("background-refresh-exports-index", {
    count: body.count,
    latest: match.runtimeRelativePath,
    lastRunId: match.lastRunId,
  });
}

function validateBackgroundRefreshImportInspection(body, exportedArtifact) {
  if (!assertRecord(body, "background refresh import inspection body")) return;
  if (body.ok !== true) addError("background refresh import inspection ok must be true.", { body });
  if (body.artifactType !== "marketpulse.background-refresh.operation-evidence.inspection") {
    addError("background refresh import inspection artifact type mismatch.", { artifactType: body.artifactType });
  }
  if (body.schemaVersion !== 1) addError("background refresh import inspection schema version must be 1.", { schemaVersion: body.schemaVersion });
  if (body.validArtifact !== true || body.parseable !== true || body.validSchema !== true) {
    addError("background refresh import inspection must validate the exported artifact.", {
      validArtifact: body.validArtifact,
      parseable: body.parseable,
      validSchema: body.validSchema,
    });
  }
  if (body.exists !== true) addError("background refresh import inspection must find the exported artifact.", { exists: body.exists });
  if (body.hashMatchesExpected !== true) {
    addError("background refresh import inspection must verify expected hash.", { hashMatchesExpected: body.hashMatchesExpected });
  }
  if (body.file?.sha256 !== exportedArtifact?.sha256) {
    addError("background refresh import inspection file hash mismatch.", {
      expected: exportedArtifact?.sha256,
      actual: body.file?.sha256,
    });
  }
  if (body.file?.bytes !== exportedArtifact?.bytes) {
    addError("background refresh import inspection file byte count mismatch.", {
      expected: exportedArtifact?.bytes,
      actual: body.file?.bytes,
    });
  }
  if (body.artifactSummary?.lastRunId !== exportedArtifact?.operatorSummary?.lastRunId) {
    addError("background refresh import inspection must preserve artifact last run id.", {
      expected: exportedArtifact?.operatorSummary?.lastRunId,
      actual: body.artifactSummary?.lastRunId,
    });
  }
  if (body.comparison?.matchesCurrentLastRunId !== true || body.comparison?.matchesCurrentStatus !== true) {
    addError("background refresh import inspection must compare artifact with current state.", { comparison: body.comparison });
  }
  if (!isPathInside(body.path, runtimeDir)) {
    addError("background refresh import inspection path must stay inside MASTERBUILD_RUNTIME_DIR.", {
      path: body.path,
      runtimeDir,
    });
  }

  record("background-refresh-import-inspection", {
    runtimeRelativePath: body.runtimeRelativePath,
    lastRunId: body.artifactSummary?.lastRunId,
    hashMatchesExpected: body.hashMatchesExpected,
  });
}

async function waitForExit(child, timeout) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, timeout);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

let exitedEarly = false;
let exitCode = null;
let exitSignal = null;
let shuttingDown = false;

const childEnv = {
  ...process.env,
  AI_SERVER_PORT: String(port),
  MARKETPULSE_DEMO_MODE: "1",
  MASTERBUILD_WORKER_PREFLIGHT_TIMEOUT_MS: process.env.MASTERBUILD_WORKER_PREFLIGHT_TIMEOUT_MS || "12000",
  MASTERBUILD_LOG_STRUCTURED: "1",
  MASTERBUILD_RUNTIME_DIR: runtimeDir,
  NO_COLOR: "1",
};
delete childEnv.FORCE_COLOR;

const child = spawn(process.execPath, ["server/ai-server.mjs"], {
  cwd: rootDir(),
  env: childEnv,
  stdio: ["ignore", "pipe", "pipe"],
});

function rootDir() {
  return process.cwd();
}

prefixStream(child.stdout, "[api-contracts]");
prefixStream(child.stderr, "[api-contracts]");

child.once("exit", (code, signal) => {
  exitedEarly = true;
  exitCode = code;
  exitSignal = signal;
});

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  if (child.exitCode === null && child.signalCode === null) {
    try { child.kill("SIGTERM"); } catch { /* already gone */ }
  }
  await waitForExit(child, shutdownGraceMs);
  if (child.exitCode === null && child.signalCode === null) {
    try { child.kill("SIGKILL"); } catch { /* already gone */ }
    await waitForExit(child, 1000);
  }
}

const signalHandler = () => {
  shutdown().finally(() => process.exit(130));
};
process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);

const startedAt = Date.now();
try {
  const health = await waitForHealth();
  validateHealth(health);

  const preflight = await fetchJson("/api/worker/preflight", { statuses: [200, 503], requestTimeoutMs: 15000 });
  validatePreflight(preflight.json, { strict: false });

  const strictPreflight = await fetchJson("/api/worker/preflight?strict=1", { statuses: [200, 503], requestTimeoutMs: 15000 });
  validatePreflight(strictPreflight.json, { strict: true });

  const emptyMission = await fetchJson("/api/mission/create", {
    method: "POST",
    body: { prompt: "" },
    statuses: [400],
  });
  if (emptyMission.json?.error !== "mission_prompt_required") {
    addError("empty mission prompt should return mission_prompt_required.", { body: emptyMission.json });
  }
  record("mission-create-empty-rejected");

  await fetchJson("/api/mission/reset", { method: "POST", statuses: [200] });

  const prompt = "AI wellness apps for Gen Z";
  const mission = await fetchJson("/api/mission/create", {
    method: "POST",
    body: { prompt },
  });
  const missionId = validateMissionCreate(mission.json, prompt);

  const dashboard = await fetchJson("/api/dashboard");
  validateDashboard(dashboard.json, missionId);

  const invalidRetry = await fetchJson("/api/agent/retry", {
    method: "POST",
    body: { agentId: 99 },
    statuses: [400],
  });
  if (invalidRetry.json?.error !== "agent_id_invalid") {
    addError("invalid agent retry should return agent_id_invalid.", { body: invalidRetry.json });
  }
  record("agent-retry-invalid-rejected");

  const retry = await fetchJson("/api/agent/retry", {
    method: "POST",
    body: { agentId: 3 },
  });
  validateRetry(retry.json, missionId);

  const trends = await fetchJson("/api/trends");
  validateTrends(trends.json);

  const recommendations = await fetchJson("/api/recommendations");
  validateRecommendations(recommendations.json);

  const backgroundStatus = await fetchJson("/api/background/refresh/status");
  validateBackgroundRefreshStatus(backgroundStatus.json);

  const backgroundReadiness = await fetchJson("/api/background/refresh/readiness");
  validateBackgroundRefreshReadiness(backgroundReadiness.json);

  const backgroundTrigger = await fetchJson("/api/refresh", { method: "POST" });
  let firstBackgroundRunId = null;
  if (backgroundTrigger.json?.ok !== true || !backgroundTrigger.json?.backgroundRefresh) {
    addError("demo background refresh trigger must return status evidence.", { body: backgroundTrigger.json });
  } else {
    firstBackgroundRunId = backgroundTrigger.json.backgroundRefresh.lastRun?.runId ?? null;
    validateBackgroundRefreshStatus(backgroundTrigger.json.backgroundRefresh, { afterRefresh: true, expectedSkipped: 1 });
  }

  const backgroundStatusAfter = await fetchJson("/api/background/refresh/status");
  validateBackgroundRefreshStatus(backgroundStatusAfter.json, { afterRefresh: true, expectedSkipped: 1, expectedRunId: firstBackgroundRunId });

  const secondBackgroundTrigger = await fetchJson("/api/refresh", { method: "POST" });
  if (secondBackgroundTrigger.json?.ok !== true || !secondBackgroundTrigger.json?.backgroundRefresh) {
    addError("second demo background refresh trigger must return status evidence.", { body: secondBackgroundTrigger.json });
  } else {
    const secondBackgroundRunId = secondBackgroundTrigger.json.backgroundRefresh.lastRun?.runId ?? null;
    if (firstBackgroundRunId && secondBackgroundRunId === firstBackgroundRunId) {
      addError("repeated demo background refresh trigger must create a distinct run id.", {
        firstBackgroundRunId,
        secondBackgroundRunId,
      });
    }
    validateBackgroundRefreshStatus(secondBackgroundTrigger.json.backgroundRefresh, { afterRefresh: true, expectedSkipped: 2 });

    const secondBackgroundStatusAfter = await fetchJson("/api/background/refresh/status");
    validateBackgroundRefreshStatus(secondBackgroundStatusAfter.json, {
      afterRefresh: true,
      expectedSkipped: 2,
      expectedRunId: secondBackgroundRunId,
    });

    const backgroundExport = await fetchJson("/api/background/refresh/export", { method: "POST" });
    validateBackgroundRefreshExport(backgroundExport.json, secondBackgroundRunId);

    const backgroundExportsIndex = await fetchJson("/api/background/refresh/exports?limit=5");
    validateBackgroundRefreshExportsIndex(backgroundExportsIndex.json, backgroundExport.json);

    const backgroundImportInspection = await fetchJson("/api/background/refresh/import/inspect", {
      method: "POST",
      body: {
        runtimeRelativePath: backgroundExport.json.runtimeRelativePath,
        sha256: backgroundExport.json.sha256,
      },
    });
    validateBackgroundRefreshImportInspection(backgroundImportInspection.json, backgroundExport.json);
  }

  const stop = await fetchJson("/api/mission/stop", { method: "POST" });
  if (stop.json?.ok !== true) addError("mission stop ok must be true.", { body: stop.json });
  record("mission-stop");

  const reset = await fetchJson("/api/mission/reset", { method: "POST" });
  if (reset.json?.ok !== true) addError("mission reset ok must be true.", { body: reset.json });
  record("mission-reset");
} catch (error) {
  addError("API contract verifier failed unexpectedly.", { error: String(error?.message ?? error) });
} finally {
  await shutdown();
}

const structuredServerLogs = collectStructuredServerLogs();
const structuredServerEvents = [...new Set(structuredServerLogs.map((entry) => entry.event))].sort();
for (const event of [
  "agent.retry.accepted",
  "agent.retry.rejected",
  "background.refresh.disabled",
  "background.refresh.exported",
  "background.refresh.exports_listed",
  "background.refresh.import_inspected",
  "background.refresh.readiness",
  "background.refresh.skipped",
  "background.refresh.started",
  "http.response",
  "mission.create.accepted",
  "mission.create.rejected",
  "mission.reset",
  "mission.stop",
  "runtime.health",
  "worker.preflight",
]) {
  if (!structuredServerEvents.includes(event)) {
    addError("Structured server log event was not emitted.", { event });
  }
}
const backgroundStartedLogs = structuredServerLogs.filter((entry) => entry.event === "background.refresh.started");
if (!backgroundStartedLogs.some((entry) => typeof entry.runId === "string" && entry.runId.length > 0)) {
  addError("background refresh started logs must include runId payloads.");
}
const backgroundSkippedLogs = structuredServerLogs.filter((entry) => entry.event === "background.refresh.skipped");
if (!backgroundSkippedLogs.some((entry) => entry.reason === "demo_mode" && typeof entry.runId === "string" && entry.runId.length > 0)) {
  addError("background refresh skipped logs must include demo_mode reason and runId payloads.");
}
const backgroundReadinessLogs = structuredServerLogs.filter((entry) => entry.event === "background.refresh.readiness");
if (!backgroundReadinessLogs.some((entry) => entry.liveReady === false && Array.isArray(entry.blockingReasons) && entry.blockingReasons.includes("live-mode"))) {
  addError("background refresh readiness logs must include live-mode blocker payloads.");
}
const backgroundExportLogs = structuredServerLogs.filter((entry) => entry.event === "background.refresh.exported");
if (!backgroundExportLogs.some((entry) => typeof entry.sha256 === "string" && entry.sha256.length === 64 && typeof entry.bytes === "number" && entry.bytes > 0)) {
  addError("background refresh export logs must include artifact hash and byte payloads.");
}
const backgroundExportsListedLogs = structuredServerLogs.filter((entry) => entry.event === "background.refresh.exports_listed");
if (!backgroundExportsListedLogs.some((entry) => typeof entry.count === "number" && entry.count >= 1)) {
  addError("background refresh exports list logs must include artifact counts.");
}
const backgroundImportInspectionLogs = structuredServerLogs.filter((entry) => entry.event === "background.refresh.import_inspected");
if (!backgroundImportInspectionLogs.some((entry) => entry.validArtifact === true && entry.hashMatchesExpected === true && entry.matchesCurrentLastRunId === true)) {
  addError("background refresh import inspection logs must include validation and comparison payloads.");
}

const summary = {
  ok: errors.length === 0,
  mode: "demo",
  baseUrl,
  durationMs: Date.now() - startedAt,
  contractVersion: MASTERBUILD_DASHBOARD_CONTRACT_VERSION,
  checks,
  structuredServerLogs: {
    count: structuredServerLogs.length,
    events: structuredServerEvents,
  },
  errors,
  runtimeDir: errors.length > 0 ? runtimeDir : undefined,
  serverExit: exitedEarly ? { code: exitCode, signal: exitSignal } : null,
  tail: errors.length > 0 ? output.join("").split(/\r?\n/).slice(-40).join("\n") : undefined,
};

if (errors.length > 0) {
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}

fs.rmSync(runtimeDir, { recursive: true, force: true });
console.log(JSON.stringify(summary, null, 2));
