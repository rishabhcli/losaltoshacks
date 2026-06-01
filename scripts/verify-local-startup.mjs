import { spawn } from "node:child_process";
import net from "node:net";

const host = process.env.MARKETPULSE_STARTUP_HOST || "127.0.0.1";
const startupFrontendOverride = Number.parseInt(process.env.MARKETPULSE_STARTUP_FRONTEND_PORT || "0", 10);
const startupAiOverride = Number.parseInt(process.env.MARKETPULSE_STARTUP_AI_PORT || "0", 10);
const frontendPort = startupFrontendOverride > 0 ? startupFrontendOverride : await findFreePort(3300);
const aiPort = startupAiOverride > 0 ? startupAiOverride : await findFreePort(frontendPort + 1);
const frontendUrl = `http://${host}:${frontendPort}`;
const aiUrl = `http://${host}:${aiPort}`;
const timeoutMs = Number.parseInt(process.env.MARKETPULSE_STARTUP_TIMEOUT_MS || "60000", 10);
const shutdownGraceMs = Number.parseInt(process.env.MARKETPULSE_STARTUP_SHUTDOWN_MS || "5000", 10);
const verbose = process.env.MARKETPULSE_STARTUP_VERBOSE === "1";

function assertValidPort(name, port) {
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`${name} must be a valid TCP port, received ${String(port)}.`);
  }
}

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

async function findFreePort(startPort) {
  for (let port = startPort; port < startPort + 200; port += 1) {
    if (await canListen(port)) return port;
  }
  throw new Error(`No free TCP port found from ${startPort} to ${startPort + 199}.`);
}

function prefixStream(stream, prefix, buffer) {
  let pending = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    const text = String(chunk);
    buffer.push(text);
    pending += text;
    const lines = pending.split(/\r?\n/);
    pending = lines.pop() ?? "";
    if (!verbose) return;
    for (const line of lines) {
      if (line.trim()) console.log(`${prefix} ${line}`);
    }
  });
  stream.on("end", () => {
    if (verbose && pending.trim()) console.log(`${prefix} ${pending}`);
  });
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

async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function pollJson(url, label, { acceptNon2xx = false } = {}) {
  const startedAt = Date.now();
  let lastError = null;
  while (Date.now() - startedAt < timeoutMs) {
    if (exitedEarly) {
      throw new Error(`Demo process exited while waiting for ${label}.`);
    }
    try {
      const response = await fetchWithTimeout(url, 3000);
      const text = await response.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch {
        body = null;
      }
      if (!acceptNon2xx && !response.ok) {
        throw new Error(`${label} returned HTTP ${response.status}`);
      }
      if (!body || typeof body !== "object") {
        throw new Error(`${label} returned non-JSON body.`);
      }
      return { body, status: response.status };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`${label} did not respond within ${timeoutMs}ms: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

async function pollText(url, label, predicate) {
  const startedAt = Date.now();
  let lastError = null;
  while (Date.now() - startedAt < timeoutMs) {
    if (exitedEarly) {
      throw new Error(`Demo process exited while waiting for ${label}.`);
    }
    try {
      const response = await fetchWithTimeout(url, 3000);
      if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}`);
      const body = await response.text();
      if (!predicate(body)) {
        throw new Error(`${label} returned unexpected body.`);
      }
      return body;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`${label} did not respond within ${timeoutMs}ms: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
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

assertValidPort("MARKETPULSE_STARTUP_FRONTEND_PORT", frontendPort);
assertValidPort("MARKETPULSE_STARTUP_AI_PORT", aiPort);

const output = [];
const startedAt = Date.now();
const child = spawn("pnpm", ["dev:demo"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    MARKETPULSE_DEMO_MODE: "1",
    MARKETPULSE_DEMO_HOST: host,
    MARKETPULSE_FRONTEND_PORT: String(frontendPort),
    MARKETPULSE_AI_PORT: String(aiPort),
    AI_SERVER_PORT: String(aiPort),
    VITE_API_BASE_URL: aiUrl,
    MASTERBUILD_LOG_STRUCTURED: "1",
  },
  stdio: ["ignore", "pipe", "pipe"],
  detached: false,
});

prefixStream(child.stdout, "[startup-demo]", output);
prefixStream(child.stderr, "[startup-demo]", output);

let exitedEarly = false;
let exitCode = null;
let exitSignal = null;
child.once("exit", (code, signal) => {
  exitedEarly = true;
  exitCode = code;
  exitSignal = signal;
});

let shuttingDown = false;
async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  if (!child.killed && child.exitCode === null) {
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

let summary = null;
let failure = null;
try {
  const { body: health } = await pollJson(`${aiUrl}/health`, "AI server /health");
  if (!(health.ok === true && health.demoMode === true && Array.isArray(health.checks))) {
    throw new Error(`AI server /health did not report ok+demoMode shape: ${JSON.stringify(health)}`);
  }

  const { body: preflight, status: preflightStatus } = await pollJson(
    `${aiUrl}/api/worker/preflight`,
    "worker preflight",
    { acceptNon2xx: true },
  );
  if (typeof preflight.workerCanStart !== "boolean") {
    throw new Error(`Worker preflight returned unexpected shape: ${JSON.stringify(preflight)}`);
  }

  await pollText(frontendUrl, "Vite frontend /", (body) => (
    typeof body === "string" && body.includes('id="root"') && body.includes("/src/main.tsx")
  ));

  if (exitedEarly) {
    throw new Error(`Demo process exited before validation completed (code=${exitCode}, signal=${exitSignal}).`);
  }

  const structuredServerLogs = collectStructuredServerLogs();
  const structuredServerEvents = [...new Set(structuredServerLogs.map((entry) => entry.event))].sort();
  const degraded = (health.checks || [])
    .filter((check) => check && check.ok === false)
    .map((check) => ({ name: check.name, required: Boolean(check.required), status: check.status || "unknown" }));

  summary = {
    ok: true,
    mode: "demo",
    durationMs: Date.now() - startedAt,
    frontendUrl,
    aiUrl,
    health: {
      status: health.status,
      demoMode: health.demoMode,
      missingRequired: Array.isArray(health.missingRequired) ? health.missingRequired : [],
      degradedChecks: degraded,
    },
    workerPreflight: {
      httpStatus: preflightStatus,
      workerCanStart: Boolean(preflight.workerCanStart),
      liveMissionReady: Boolean(preflight.liveMissionReady),
      insforgeStatus: preflight.insforge?.status ?? "unknown",
      liveLlmStatus: preflight.liveLlm?.status ?? "unknown",
    },
    structuredServerLogs: {
      count: structuredServerLogs.length,
      events: structuredServerEvents,
    },
  };
} catch (error) {
  failure = error instanceof Error ? error : new Error(String(error));
} finally {
  await shutdown();
}

if (failure) {
  console.error(JSON.stringify({
    ok: false,
    mode: "demo",
    durationMs: Date.now() - startedAt,
    frontendUrl,
    aiUrl,
    error: failure.message,
    demoExit: exitedEarly ? { code: exitCode, signal: exitSignal } : null,
    tail: output.join("").split(/\r?\n/).slice(-40).join("\n"),
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(summary, null, 2));
process.exit(0);
