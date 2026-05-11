import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { loadProjectEnv } from "../server/lib/env.mjs";
import {
  getLinkedInsforgeAdminKey,
  getLinkedInsforgeBaseUrl,
  readLinkedInsforgeProject,
} from "../server/lib/linked-insforge.mjs";

loadProjectEnv();

const projectConfigPath = path.resolve(".insforge/project.json");
const linkedProject = fs.existsSync(projectConfigPath) ? readLinkedInsforgeProject() : null;

const baseUrl = (
  process.env.MASTERBUILD_INSFORGE_URL ||
  process.env.VITE_INSFORGE_URL ||
  getLinkedInsforgeBaseUrl(linkedProject) ||
  ""
).replace(/\/+$/, "");
const adminToken =
  process.env.INSFORGE_SERVICE_ROLE_KEY ||
  process.env.MASTERBUILD_INSFORGE_TOKEN ||
  getLinkedInsforgeAdminKey(baseUrl, linkedProject) ||
  "";
const anonKey =
  process.env.MARKETPULSE_SMOKE_ANON_KEY ||
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
  process.env.VITE_INSFORGE_ANON_KEY ||
  "";

const frontendPort = Number.parseInt(process.env.MARKETPULSE_BROWSER_SMOKE_FRONTEND_PORT || "3340", 10);
const aiPort = Number.parseInt(process.env.MARKETPULSE_BROWSER_SMOKE_AI_PORT || "3341", 10);
const frontendUrl = `http://127.0.0.1:${frontendPort}`;
const aiUrl = `http://127.0.0.1:${aiPort}`;
const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
const smokeEmail = `codex-marketpulse-browser-smoke-${timestamp}-${Math.random().toString(36).slice(2, 8)}@example.test`;
const smokePassword = `MarketPulse${timestamp}!`;
const smokeName = "Codex Browser Decision Smoke";
const recommendationTitle = "Launch Gen Z Recovery Planner";

function compact(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

function ensureConfig() {
  if (!baseUrl || !adminToken || !anonKey) {
    throw new Error("Missing InsForge smoke env. Set MASTERBUILD_INSFORGE_URL, INSFORGE_SERVICE_ROLE_KEY, and an anon key.");
  }
  if (linkedProject?.oss_host && linkedProject.oss_host.replace(/\/+$/, "") !== baseUrl) {
    throw new Error(
      `InsForge target mismatch: env points at ${baseUrl}, but .insforge/project.json points at ${linkedProject.oss_host}.`
    );
  }
  if (linkedProject?.appkey === "mdd528ty" && process.env.MARKETPULSE_ALLOW_OFFICIAL_BACKEND_SMOKE !== "1") {
    throw new Error("Refusing to mutate the official paused MarketPulse backend. Use the disposable active backend or set MARKETPULSE_ALLOW_OFFICIAL_BACKEND_SMOKE=1.");
  }
}

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function adminRequest(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    signal: AbortSignal.timeout(10000),
    ...options,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...(options.headers ?? {}),
    },
  });
  const body = await parseBody(response);
  if (!response.ok) {
    throw new Error(`${options.label ?? options.method ?? "request"} failed (${response.status}): ${compact(JSON.stringify(body))}`);
  }
  return body;
}

async function getAuthConfig() {
  return adminRequest("/api/auth/config", { method: "GET", label: "get auth config" });
}

async function setEmailVerification(required) {
  return adminRequest("/api/auth/config", {
    method: "PUT",
    body: JSON.stringify({ requireEmailVerification: required }),
    label: `set requireEmailVerification=${required}`,
  });
}

async function findSmokeUser() {
  const users = await adminRequest(`/api/auth/users?search=${encodeURIComponent(smokeEmail)}&limit=5`, {
    method: "GET",
    label: "lookup smoke auth user",
  });
  return users?.data?.find?.((user) => user?.email === smokeEmail) ?? null;
}

function decisionQuery(userId) {
  return `?user_id=eq.${encodeURIComponent(userId)}`;
}

async function readDecisions(userId) {
  return adminRequest(`/api/database/records/recommendation_decisions${decisionQuery(userId)}&select=user_id,recommendation_id,status,title,updated_at&limit=10`, {
    method: "GET",
    label: "read browser decision rows",
  });
}

async function deleteDecision(userId) {
  return adminRequest(`/api/database/records/recommendation_decisions${decisionQuery(userId)}`, {
    method: "DELETE",
    prefer: "return=representation",
    label: "delete browser decision row",
  });
}

async function deleteSmokeUser(userId) {
  return adminRequest("/api/auth/users", {
    method: "DELETE",
    body: JSON.stringify({ userIds: [userId] }),
    label: "delete browser smoke user",
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
}

function spawnDemoRunner() {
  const child = spawn("pnpm", ["dev:demo"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MASTERBUILD_INSFORGE_URL: baseUrl,
      INSFORGE_SERVICE_ROLE_KEY: adminToken,
      VITE_INSFORGE_URL: baseUrl,
      VITE_INSFORGE_ANON_KEY: anonKey,
      MARKETPULSE_FRONTEND_PORT: String(frontendPort),
      MARKETPULSE_AI_PORT: String(aiPort),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  prefixStream(child.stdout, "[demo]");
  prefixStream(child.stderr, "[demo]");
  return child;
}

async function waitForHttp(url, label) {
  const deadline = Date.now() + 45_000;
  let lastError = "";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
      lastError = `${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error?.message ?? String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${label}: ${lastError}`);
}

async function pollDecision(userId) {
  const deadline = Date.now() + 15_000;
  let rows = [];
  while (Date.now() < deadline) {
    rows = await readDecisions(userId);
    const accepted = Array.isArray(rows) ? rows.find((row) => row?.status === "accepted") : null;
    if (accepted) return accepted;
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for accepted decision row: ${compact(JSON.stringify(rows))}`);
}

async function seedDemoRecommendationState() {
  await fetch(`${aiUrl}/api/mission/reset`, {
    method: "POST",
    signal: AbortSignal.timeout(8000),
  });
  const response = await fetch(`${aiUrl}/api/mission/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "AI wellness apps for Gen Z" }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Demo mission seed failed (${response.status}): ${compact(await response.text())}`);
  }
}

async function runBrowserFlow() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleMessages = [];
  page.on("console", (message) => {
    const text = message.text();
    if (/insforge|recommendation|error|failed/i.test(text)) {
      consoleMessages.push(`${message.type()}: ${text}`);
    }
  });

  try {
    await page.goto(frontendUrl, { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/login", { timeout: 15_000 });
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByLabel("Display name").fill(smokeName);
    await page.getByLabel("Email").fill(smokeEmail);
    await page.locator("#login-password").fill(smokePassword);
    await page.locator("form").getByRole("button", { name: "Create account" }).click();

    await page.getByRole("heading", { name: /Welcome to MarketPulse|Dashboard|Market Research/i }).waitFor({ timeout: 20_000 });
    if (await page.getByRole("button", { name: "Continue to Dashboard" }).isVisible().catch(() => false)) {
      await page.getByLabel("Business name").fill("Codex Smoke Co");
      await page.getByRole("button", { name: "Continue to Dashboard" }).click();
    }

    await seedDemoRecommendationState();
    await page.goto(`${frontendUrl}/recommendations`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Recommendations" }).waitFor({ timeout: 20_000 });
    await page.getByText(recommendationTitle).first().click();
    await page.getByRole("button", { name: "Accept" }).click();
    await page.getByText("Recommendation accepted").waitFor({ timeout: 10_000 });
  } catch (error) {
    const extra = consoleMessages.length > 0 ? ` Console: ${consoleMessages.slice(-5).join(" | ")}` : "";
    throw new Error(`${error?.message ?? error}${extra}`);
  } finally {
    await browser.close();
  }
}

ensureConfig();

let originalRequireEmailVerification = null;
let demoProcess = null;
let smokeUser = null;
let decisionDeleted = false;
let userDeleted = false;

try {
  const originalAuthConfig = await getAuthConfig();
  originalRequireEmailVerification = Boolean(originalAuthConfig.requireEmailVerification);
  if (originalRequireEmailVerification) {
    await setEmailVerification(false);
  }

  demoProcess = spawnDemoRunner();
  await waitForHttp(`${aiUrl}/health`, "demo AI server health");
  await waitForHttp(frontendUrl, "demo frontend");

  await runBrowserFlow();
  smokeUser = await findSmokeUser();
  if (!smokeUser?.id) {
    throw new Error("Browser signup did not create a discoverable smoke auth user.");
  }

  const row = await pollDecision(smokeUser.id);
  const deleted = await deleteDecision(smokeUser.id);
  decisionDeleted = true;
  await deleteSmokeUser(smokeUser.id);
  userDeleted = true;

  console.log(JSON.stringify({
    ok: true,
    backend: baseUrl,
    frontend: frontendUrl,
    recommendationId: row.recommendation_id,
    recommendationTitle,
    status: row.status,
    deletedRows: Array.isArray(deleted) ? deleted.length : null,
    cleanup: { decisionDeleted, userDeleted },
  }, null, 2));
} catch (error) {
  if (!smokeUser) {
    try {
      smokeUser = await findSmokeUser();
    } catch (lookupError) {
      console.error(`Cleanup warning: smoke user lookup failed: ${compact(lookupError?.message ?? lookupError)}`);
    }
  }
  if (smokeUser?.id && !decisionDeleted) {
    try {
      await deleteDecision(smokeUser.id);
      decisionDeleted = true;
    } catch (cleanupError) {
      console.error(`Cleanup warning: decision delete failed: ${compact(cleanupError?.message ?? cleanupError)}`);
    }
  }
  if (smokeUser?.id && !userDeleted) {
    try {
      await deleteSmokeUser(smokeUser.id);
      userDeleted = true;
    } catch (cleanupError) {
      console.error(`Cleanup warning: smoke user delete failed: ${compact(cleanupError?.message ?? cleanupError)}`);
    }
  }
  console.error(`Browser decision smoke failed: ${compact(error?.message ?? error)}`);
  process.exitCode = 1;
} finally {
  if (demoProcess && !demoProcess.killed) {
    demoProcess.kill("SIGTERM");
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 3000);
      demoProcess.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }
  if (originalRequireEmailVerification !== null) {
    try {
      await setEmailVerification(originalRequireEmailVerification);
    } catch (restoreError) {
      console.error(`Restore warning: auth config restore failed: ${compact(restoreError?.message ?? restoreError)}`);
      process.exitCode = 1;
    }
  }
}
