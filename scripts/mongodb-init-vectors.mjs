/**
 * Creates an Atlas Vector Search index on the `discoveries` collection
 * and backfills OpenAI embeddings for existing records.
 *
 * Run once: node scripts/mongodb-init-vectors.mjs
 */

import { MongoClient } from "mongodb";
import { loadProjectEnv } from "../server/lib/env.mjs";

loadProjectEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB_NAME || "losaltoshacks";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = "text-embedding-3-small";
const VECTOR_DIMS = 1536;
const INDEX_NAME = "discoveries_vector_index";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

async function embedText(text) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: text.slice(0, 8000), model: EMBEDDING_MODEL }),
  });
  if (!res.ok) throw new Error(`OpenAI embed error: ${res.status}`);
  const json = await res.json();
  return json.data[0].embedding;
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const coll = db.collection("discoveries");

  // ── 1. Create Atlas Vector Search index ──────────────────────────────────
  console.log("Creating Atlas Vector Search index…");
  try {
    await coll.createSearchIndex({
      name: INDEX_NAME,
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: VECTOR_DIMS,
            similarity: "cosine",
          },
          { type: "filter", path: "mission_id" },
          { type: "filter", path: "agent_id" },
        ],
      },
    });
    console.log(`Index "${INDEX_NAME}" creation initiated (may take a minute to build).`);
  } catch (err) {
    if (err.codeName === "IndexAlreadyExists" || (err.message ?? "").includes("already exists")) {
      console.log(`Index "${INDEX_NAME}" already exists — skipping.`);
    } else {
      throw err;
    }
  }

  // ── 2. Backfill embeddings for existing discoveries ───────────────────────
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set — skipping backfill.");
    await client.close();
    return;
  }

  const missing = await coll.find({ embedding: { $exists: false } }).toArray();
  console.log(`Backfilling embeddings for ${missing.length} existing discoveries…`);

  let count = 0;
  for (const doc of missing) {
    const text = [doc.keywords, doc.title, doc.description].filter(Boolean).join(". ");
    if (!text.trim()) continue;
    try {
      const embedding = await embedText(text);
      await coll.updateOne({ _id: doc._id }, { $set: { embedding } });
      count++;
      if (count % 10 === 0) console.log(`  ${count}/${missing.length} embedded…`);
      // Respect OpenAI rate limits
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.warn(`  Failed to embed doc ${doc._id}: ${err.message}`);
    }
  }

  console.log(`Done. ${count} documents backfilled.`);
  await client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
