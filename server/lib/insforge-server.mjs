import { createClient } from "@insforge/sdk";
import { loadProjectEnv } from "./env.mjs";

loadProjectEnv();

let _client = null;

export function createServerInsforgeClient() {
  if (_client) return _client;

  const baseUrl =
    process.env.MASTERBUILD_INSFORGE_URL ||
    process.env.VITE_INSFORGE_URL ||
    "";

  const anonKey = process.env.VITE_INSFORGE_ANON_KEY || "";
  const serviceRoleKey = process.env.INSFORGE_SERVICE_ROLE_KEY || "";

  if (!baseUrl) {
    throw new Error(
      "Missing MASTERBUILD_INSFORGE_URL or VITE_INSFORGE_URL environment variable."
    );
  }

  if (!anonKey && !serviceRoleKey) {
    throw new Error(
      "Missing VITE_INSFORGE_ANON_KEY or INSFORGE_SERVICE_ROLE_KEY environment variable."
    );
  }

  _client = createClient({
    baseUrl,
    anonKey: serviceRoleKey || anonKey,
    ...(serviceRoleKey ? { isServerMode: true } : {}),
  });

  return _client;
}
