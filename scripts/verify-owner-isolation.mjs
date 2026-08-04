import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  server: path.join(root, "server/ai-server.mjs"),
  schema: path.join(root, "insforge/masterbuild_schema.sql"),
  migration: path.join(root, "insforge/migration_owner_isolation.sql"),
  policies: path.join(root, "insforge/masterbuild_rls_policies.sql"),
};
const contents = Object.fromEntries(
  Object.entries(files).map(([name, file]) => [name, fs.readFileSync(file, "utf8")]),
);
const failures = [];

function requireText(name, pattern, description) {
  if (!pattern.test(contents[name])) failures.push(description);
}

requireText("schema", /owner_id\s+uuid\s+references\s+auth\.users/i, "schema must define missions.owner_id");
requireText("migration", /ADD COLUMN IF NOT EXISTS owner_id/i, "owner migration must add missions.owner_id");
requireText("migration", /FUNCTION public\.masterbuild_mission_owned[\s\S]*SECURITY DEFINER/i, "owner migration must use a security-definer mission helper");
requireText("migration", /FUNCTION public\.reset_masterbuild\(\)[\s\S]*SECURITY DEFINER\s+SET search_path\s*=\s*pg_catalog, public, pg_temp/i, "owner reset function must pin its security-definer search path");
requireText("migration", /FUNCTION public\.start_masterbuild_mission\(mission_prompt text\)[\s\S]*SECURITY DEFINER\s+SET search_path\s*=\s*pg_catalog, public, pg_temp/i, "owner start function must pin its security-definer search path");
requireText("policies", /owner_id\s*=\s*\(SELECT auth\.uid\(\)\)/i, "mission policies must compare owner_id with auth.uid()");
requireText("policies", /masterbuild_mission_owned\(mission_id\)/i, "child policies must inherit ownership from missions");
requireText("server", /request\.__marketPulseUser\s*=\s*authentication\.user/i, "authenticated requests must carry the validated user identity");
requireText("server", /owner_id:\s*getRequestOwnerId\(request\)/i, "new live missions must persist their owner id");
requireText("server", /function scopeMissionQuery\(query, request\)/i, "live mission reads must be owner-scoped");
requireText("server", /dashboardSnapshotCache = new Map\(\)/i, "dashboard cache must be partitioned by owner");
requireText("server", /const cacheKey = `\$\{ownerKey\}:\$\{industryKey\}`/i, "recommendation cache must be partitioned by owner");

if (/USING\s*\(\s*true\s*\)|WITH\s+CHECK\s*\(\s*true\s*\)/i.test(contents.policies)) {
  failures.push("masterbuild RLS must not retain unconditional true policies");
}

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  mode: "static-contract",
  checked: Object.keys(files),
  remoteApplyRequired: true,
}, null, 2));
