import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotEnv } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

let loaded = false;

export function loadProjectEnv() {
  if (loaded) {
    return;
  }

  const files = [".env", ".env.local", ".env.development", ".env.development.local"];

  files.forEach((fileName, index) => {
    const envPath = path.join(projectRoot, fileName);
    if (existsSync(envPath)) {
      loadDotEnv({ path: envPath, override: index > 0 });
    }
  });

  loaded = true;
}

export function getRequiredEnv(name) {
  loadProjectEnv();
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`${name} is missing.`);
  }

  return value;
}
