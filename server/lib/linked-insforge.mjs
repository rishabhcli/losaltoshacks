import fs from "node:fs";
import path from "node:path";

function normalizeUrl(value) {
  return String(value ?? "").trim().replace(/\/+$/, "");
}

export function readLinkedInsforgeProject(cwd = process.cwd()) {
  const projectConfigPath = path.resolve(cwd, ".insforge/project.json");
  if (!fs.existsSync(projectConfigPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(projectConfigPath, "utf8"));
  } catch {
    return null;
  }
}

export function getLinkedInsforgeBaseUrl(linkedProject = readLinkedInsforgeProject()) {
  return normalizeUrl(linkedProject?.oss_host);
}

export function getLinkedInsforgeAdminKey(baseUrl = "", linkedProject = readLinkedInsforgeProject()) {
  const linkedBaseUrl = getLinkedInsforgeBaseUrl(linkedProject);
  const requestedBaseUrl = normalizeUrl(baseUrl);

  if (!linkedProject?.api_key || !linkedBaseUrl) return "";
  if (requestedBaseUrl && requestedBaseUrl !== linkedBaseUrl) return "";

  return String(linkedProject.api_key);
}

export function describeLinkedInsforgeProject(linkedProject = readLinkedInsforgeProject()) {
  if (!linkedProject) return "";
  return `${linkedProject.project_name} (${linkedProject.appkey}, ${linkedProject.region})`;
}
