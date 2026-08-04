import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";

const host = "127.0.0.1";

function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, host, () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

function requestJson(baseUrl, pathname, options = {}) {
  return fetch(`${baseUrl}${pathname}`, options).then(async (response) => ({
    status: response.status,
    body: await response.json(),
  }));
}

const insforgePort = await findFreePort();
const aiPort = await findFreePort();
let authValidationCalls = 0;

const authServer = http.createServer((request, response) => {
  if (request.url === "/api/auth/sessions/current") {
    authValidationCalls += 1;
    const token = String(request.headers.authorization ?? "");
    if (token === "Bearer valid-user-token") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ user: { id: "user-1", email: "user@example.test" } }));
      return;
    }
    response.writeHead(401, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "invalid_token" }));
    return;
  }

  if (request.url?.startsWith("/api/database/records/missions")) {
    response.writeHead(200, { "content-type": "application/json" });
    response.end("[]");
    return;
  }

  response.writeHead(404);
  response.end();
});

await new Promise((resolve) => authServer.listen(insforgePort, host, resolve));

const child = spawn(process.execPath, ["server/ai-server.mjs"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    MARKETPULSE_DEMO_MODE: "0",
    AI_SERVER_PORT: String(aiPort),
    MASTERBUILD_INSFORGE_URL: `http://${host}:${insforgePort}`,
    INSFORGE_SERVICE_ROLE_KEY: "test-service-token",
    MASTERBUILD_LOG_STRUCTURED: "1",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
child.stdout.on("data", (chunk) => { output += String(chunk); });
child.stderr.on("data", (chunk) => { output += String(chunk); });

const baseUrl = `http://${host}:${aiPort}`;
const startedAt = Date.now();
while (Date.now() - startedAt < 15_000) {
  try {
    const response = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(500) });
    if (response.status === 200 || response.status === 503) break;
  } catch {
    // The server is still starting.
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
}

try {
  const missing = await requestJson(baseUrl, "/api/dashboard");
  if (missing.status !== 401 || missing.body.error !== "authentication_required") {
    throw new Error(`Missing-token request was not rejected: ${JSON.stringify(missing)}`);
  }

  const invalid = await requestJson(baseUrl, "/api/dashboard", {
    headers: { Authorization: "Bearer invalid-token" },
  });
  if (invalid.status !== 401 || invalid.body.error !== "invalid_session") {
    throw new Error(`Invalid-token request was not rejected: ${JSON.stringify(invalid)}`);
  }

  const valid = await requestJson(baseUrl, "/api/route-authenticated-but-unknown", {
    headers: { Authorization: "Bearer valid-user-token" },
  });
  if (valid.status !== 404 || valid.body.error !== "Not found") {
    throw new Error(`Valid-token request did not pass auth gate: ${JSON.stringify(valid)}`);
  }

  const health = await requestJson(baseUrl, "/health");
  if (!health.body || typeof health.body.ok !== "boolean") {
    throw new Error(`Health endpoint was not public: ${JSON.stringify(health)}`);
  }

  console.log(JSON.stringify({
    ok: true,
    missingTokenStatus: missing.status,
    invalidTokenStatus: invalid.status,
    validTokenPostAuthStatus: valid.status,
    publicHealthStatus: health.status,
    authValidationCalls,
  }, null, 2));
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => child.once("exit", resolve));
  await new Promise((resolve) => authServer.close(resolve));
  if (output.includes("Unhandled Rejection") || output.includes("Uncaught Exception")) {
    console.error(output);
    process.exitCode = 1;
  }
}
