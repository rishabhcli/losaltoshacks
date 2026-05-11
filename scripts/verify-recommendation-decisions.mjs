import fs from "node:fs";
import path from "node:path";
import { loadProjectEnv } from "../server/lib/env.mjs";
import {
  describeLinkedInsforgeProject,
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
  process.env.VITE_INSFORGE_ANON_KEY ||
  "";

const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
const email = `codex-marketpulse-decision-smoke-${timestamp}-${Math.random().toString(36).slice(2, 8)}@example.test`;
const password = `MarketPulse${timestamp}!`;
const recommendationId = `codex-live-decision-smoke-${timestamp}`;

function compact(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 360);
}

if (!baseUrl || !adminToken) {
  console.error("Missing InsForge env. Set MASTERBUILD_INSFORGE_URL and INSFORGE_SERVICE_ROLE_KEY, or app Vite InsForge env equivalents.");
  process.exit(1);
}

if (linkedProject?.oss_host && linkedProject.oss_host.replace(/\/+$/, "") !== baseUrl) {
  console.error(
    `InsForge target mismatch: env points at ${baseUrl}, but .insforge/project.json points at ${linkedProject.oss_host}. ` +
      "Use explicit MASTERBUILD_INSFORGE_URL/INSFORGE_SERVICE_ROLE_KEY overrides for the backend you intend to mutate."
  );
  process.exit(1);
}

if (linkedProject) {
  console.log(`Linked InsForge project: ${describeLinkedInsforgeProject(linkedProject)}`);
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

async function request(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    signal: AbortSignal.timeout(8000),
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.admin ? { Authorization: `Bearer ${adminToken}` } : {}),
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

async function createSmokeUser() {
  const body = await request("/api/auth/users?client_type=server", {
    method: "POST",
    body: JSON.stringify({ email, password, name: "Codex MarketPulse Decision Smoke" }),
    label: "create temp auth user",
  });
  let userId = body?.user?.id;
  if (!userId) {
    const users = await request(`/api/auth/users?search=${encodeURIComponent(email)}&limit=5`, {
      method: "GET",
      admin: true,
      label: "lookup temp auth user",
    });
    userId = users?.data?.find?.((user) => user?.email === email)?.id;
  }
  if (!userId) {
    throw new Error(`Temp auth user response did not include user.id: ${compact(JSON.stringify(body))}`);
  }
  return String(userId);
}

async function deleteSmokeUser(userId) {
  await request("/api/auth/users", {
    method: "DELETE",
    admin: true,
    body: JSON.stringify({ userIds: [userId] }),
    label: "delete temp auth user",
  });
}

function decisionPath(query = "") {
  return `/api/database/records/recommendation_decisions${query}`;
}

function filtersFor(userId) {
  return `?user_id=eq.${encodeURIComponent(userId)}&recommendation_id=eq.${encodeURIComponent(recommendationId)}`;
}

async function insertDecision(userId) {
  return request(decisionPath(), {
    method: "POST",
    admin: true,
    prefer: "return=representation",
    body: JSON.stringify([
      {
        user_id: userId,
        recommendation_id: recommendationId,
        status: "accepted",
        trend_id: "codex-live-trend",
        title: "Codex live recommendation decision smoke",
        recommendation_snapshot: {
          title: "Codex live recommendation decision smoke",
          description: "Disposable smoke row proving generated recommendation decisions persist to InsForge.",
          industry: "tech-saas",
          priority: "high",
          sourceEvidence: [
            {
              platform: "test",
              title: "Live decision verifier",
              url: "https://example.test/marketpulse-decision-smoke",
            },
          ],
        },
      },
    ]),
    label: "insert decision",
  });
}

async function updateDecision(userId) {
  return request(decisionPath(filtersFor(userId)), {
    method: "PATCH",
    admin: true,
    prefer: "return=representation",
    body: JSON.stringify({ status: "dismissed", title: "Codex live recommendation decision smoke updated" }),
    label: "update decision",
  });
}

async function readDecision(userId) {
  const query = `${filtersFor(userId)}&select=user_id,recommendation_id,status,title,recommendation_snapshot,updated_at&limit=1`;
  return request(decisionPath(query), {
    method: "GET",
    admin: true,
    label: "read decision",
  });
}

async function deleteDecision(userId) {
  return request(decisionPath(filtersFor(userId)), {
    method: "DELETE",
    admin: true,
    prefer: "return=representation",
    label: "delete decision",
  });
}

let smokeUserId = null;
let decisionDeleted = false;
let userDeleted = false;

try {
  smokeUserId = await createSmokeUser();
  const inserted = await insertDecision(smokeUserId);
  const updated = await updateDecision(smokeUserId);
  const rows = await readDecision(smokeUserId);

  if (!Array.isArray(inserted) || inserted.length !== 1) {
    throw new Error(`Insert returned unexpected shape: ${compact(JSON.stringify(inserted))}`);
  }
  if (!Array.isArray(updated) || updated[0]?.status !== "dismissed") {
    throw new Error(`Update did not return dismissed status: ${compact(JSON.stringify(updated))}`);
  }
  if (!Array.isArray(rows) || rows[0]?.status !== "dismissed" || rows[0]?.recommendation_id !== recommendationId) {
    throw new Error(`Readback did not match updated smoke decision: ${compact(JSON.stringify(rows))}`);
  }

  const deleted = await deleteDecision(smokeUserId);
  decisionDeleted = true;
  if (!Array.isArray(deleted) || deleted.length !== 1) {
    throw new Error(`Delete returned unexpected shape: ${compact(JSON.stringify(deleted))}`);
  }

  await deleteSmokeUser(smokeUserId);
  userDeleted = true;

  console.log(JSON.stringify({
    ok: true,
    backend: baseUrl,
    recommendationId,
    insertedStatus: inserted[0].status,
    updatedStatus: updated[0].status,
    readbackStatus: rows[0].status,
    deletedRows: deleted.length,
    cleanup: { decisionDeleted, userDeleted },
  }, null, 2));
} catch (error) {
  if (smokeUserId && !decisionDeleted) {
    try {
      await deleteDecision(smokeUserId);
      decisionDeleted = true;
    } catch (cleanupError) {
      console.error(`Cleanup warning: decision delete failed: ${compact(cleanupError?.message ?? cleanupError)}`);
    }
  }
  if (smokeUserId && !userDeleted) {
    try {
      await deleteSmokeUser(smokeUserId);
      userDeleted = true;
    } catch (cleanupError) {
      console.error(`Cleanup warning: temp auth user delete failed: ${compact(cleanupError?.message ?? cleanupError)}`);
    }
  }
  console.error(`Recommendation decision verification failed: ${compact(error?.message ?? error)}`);
  process.exit(1);
}
