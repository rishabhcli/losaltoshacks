import { spawn } from "node:child_process";
import net from "node:net";

const host = process.env.MARKETPULSE_DEMO_HOST || "127.0.0.1";
const frontendPort = Number.parseInt(process.env.MARKETPULSE_FRONTEND_PORT || "3000", 10);
const aiPort = Number.parseInt(process.env.MARKETPULSE_AI_PORT || process.env.AI_SERVER_PORT || "3001", 10);
const frontendUrl = `http://${host}:${frontendPort}`;
const aiUrl = `http://${host}:${aiPort}`;

function assertValidPort(name, port) {
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`${name} must be a valid TCP port, received ${String(port)}.`);
  }
}

function assertPortFree(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (error) => {
      reject(new Error(`Port ${port} is not available: ${error.message}`));
    });
    server.once("listening", () => {
      server.close(() => resolve());
    });
    server.listen(port, host);
  });
}

function prefixStream(stream, prefix) {
  let buffer = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) console.log(`${prefix} ${line}`);
    }
  });
  stream.on("end", () => {
    if (buffer.trim()) console.log(`${prefix} ${buffer}`);
  });
}

function spawnManaged(label, command, args, env) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  prefixStream(child.stdout, `[${label}]`);
  prefixStream(child.stderr, `[${label}]`);
  return child;
}

assertValidPort("MARKETPULSE_FRONTEND_PORT", frontendPort);
assertValidPort("MARKETPULSE_AI_PORT", aiPort);

await Promise.all([assertPortFree(frontendPort), assertPortFree(aiPort)]);

const children = [];
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) child.kill("SIGKILL");
    }
    process.exit(code);
  }, 2500).unref();
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

const sharedEnv = {
  ...process.env,
  MARKETPULSE_DEMO_MODE: "1",
  AI_SERVER_PORT: String(aiPort),
  VITE_API_BASE_URL: aiUrl,
};

children.push(spawnManaged("ai", process.execPath, ["server/ai-server.mjs"], sharedEnv));
children.push(spawnManaged("web", "pnpm", ["exec", "vite", "--host", host, "--port", String(frontendPort), "--strictPort"], sharedEnv));

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    const exitLabel = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.error(`[demo] Child process exited unexpectedly with ${exitLabel}.`);
    shutdown(code && code > 0 ? code : 1);
  });
}

console.log(`[demo] MarketPulse demo starting`);
console.log(`[demo] Frontend: ${frontendUrl}`);
console.log(`[demo] AI server: ${aiUrl}`);
console.log("[demo] Press Ctrl-C to stop both processes.");
