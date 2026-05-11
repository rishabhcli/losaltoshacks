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

const baseUrl = (
  process.env.MASTERBUILD_INSFORGE_URL ||
  process.env.VITE_INSFORGE_URL ||
  getLinkedInsforgeBaseUrl() ||
  ""
).replace(/\/+$/, "");
const token =
  process.env.INSFORGE_SERVICE_ROLE_KEY ||
  process.env.MASTERBUILD_INSFORGE_TOKEN ||
  getLinkedInsforgeAdminKey(baseUrl) ||
  process.env.VITE_INSFORGE_ANON_KEY ||
  "";
const projectConfigPath = path.resolve(".insforge/project.json");
const linkedProject = fs.existsSync(projectConfigPath) ? readLinkedInsforgeProject() : null;

const checks = [
  {
    table: "missions",
    columns: "id,prompt,status,live_url_1,live_url_2,live_url_3,live_url_4,live_url_5,final_options,created_at,stopped_at",
  },
  {
    table: "agents",
    columns: "id,agent_id,name,platform,role,status,current_url,profile_path,assignment,energy,status_detail,failure_reason,retry_count,confidence,last_heartbeat",
  },
  {
    table: "discoveries",
    columns: "id,mission_id,source_url,thumbnail_url,agent_id,platform,title,summary,keywords,industry,likes,views,comments,created_at",
  },
  {
    table: "logs",
    columns: "id,mission_id,agent_id,message,type,metadata,created_at",
  },
  {
    table: "business_plans",
    columns: "id,mission_id,version,market_opportunity,competitive_landscape,revenue_models,user_acquisition,risk_analysis,confidence_score,discovery_count,is_final,raw_plan,created_at",
  },
  {
    table: "recommendation_decisions",
    columns: "user_id,recommendation_id,status,trend_id,title,recommendation_snapshot,created_at,updated_at",
  },
];

function compact(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 260);
}

if (!baseUrl || !token) {
  console.error("Missing InsForge env. Set VITE_INSFORGE_URL plus VITE_INSFORGE_ANON_KEY, or the MASTERBUILD/INSFORGE service equivalents.");
  process.exit(1);
}

if (linkedProject?.oss_host && linkedProject.oss_host.replace(/\/+$/, "") !== baseUrl) {
  console.error(
    `InsForge target mismatch: app env points at ${baseUrl}, but .insforge/project.json points at ${linkedProject.oss_host}. ` +
      "Relink the project or update env before applying schema."
  );
  process.exit(1);
}

if (linkedProject) {
  console.log(`Linked InsForge project: ${describeLinkedInsforgeProject(linkedProject)}`);
}

const results = [];

for (const check of checks) {
  const url = new URL(`${baseUrl}/api/database/records/${check.table}`);
  url.searchParams.set("select", check.columns);
  url.searchParams.set("limit", "1");

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    const body = compact(await response.text());
    results.push({
      table: check.table,
      ok: response.ok,
      status: response.status,
      message: response.ok ? "queryable" : body || response.statusText,
    });
  } catch (error) {
    results.push({
      table: check.table,
      ok: false,
      status: "network-error",
      message: compact(error?.message ?? error),
    });
  }
}

const failures = results.filter((result) => !result.ok);
for (const result of results) {
  const marker = result.ok ? "OK" : "FAIL";
  console.log(`${marker} ${result.table} (${result.status}): ${result.message}`);
}

if (failures.length > 0) {
  console.error(
    `Masterbuild schema verification failed for ${failures.length}/${results.length} checks against ${baseUrl}. ` +
      "Apply/repair insforge/masterbuild_schema.sql, insforge/masterbuild_schema_v2.sql, and insforge/schema.sql on this exact backend."
  );
  process.exit(1);
}

console.log(`Masterbuild schema verification passed against ${baseUrl}.`);
