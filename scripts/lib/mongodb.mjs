import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotEnv } from "dotenv";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

[".env", ".env.local", ".env.development", ".env.development.local"].forEach((fileName, index) => {
  const envPath = path.join(projectRoot, fileName);
  if (existsSync(envPath)) {
    loadDotEnv({ path: envPath, override: index > 0 });
  }
});

let cachedClient;

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value || value.includes("<db_password>")) {
    throw new Error(`${name} is missing or still contains a placeholder value.`);
  }

  return value;
}

export function getMongoConfig() {
  return {
    uri: getRequiredEnv("MONGODB_URI"),
    dbName: getRequiredEnv("MONGODB_DB_NAME"),
  };
}

export async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const { uri } = getMongoConfig();

  cachedClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  await cachedClient.connect();
  return cachedClient;
}

export async function getDb() {
  const { dbName } = getMongoConfig();
  const client = await getMongoClient();
  return client.db(dbName);
}

export async function closeMongoClient() {
  if (!cachedClient) {
    return;
  }

  await cachedClient.close();
  cachedClient = undefined;
}
