import { MongoClient } from "mongodb";

let _client = null;
let _db = null;

const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const EMBEDDING_DIMS = 1536;

function getMongoUri() {
  return (
    process.env.MONGODB_ATLAS_URI ||
    process.env.MONGODB_URI ||
    ""
  );
}

function getDbName() {
  return process.env.MONGODB_DB_NAME || "losaltoshacks";
}

function getVectorIndexName() {
  return process.env.MONGODB_VECTOR_INDEX_NAME || "discoveries_vector_index";
}

/**
 * OpenAI embeddings API (required for Atlas vector search — not LLM-generated vectors).
 */
export async function generateEmbedding(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for embeddings.");
  }
  const input = (text ?? "").trim().slice(0, 8000);
  if (!input) return null;

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input, model: EMBEDDING_MODEL }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI embed error: ${res.status} ${errText.slice(0, 200)}`);
  }
  const json = await res.json();
  const vec = json?.data?.[0]?.embedding;
  if (!Array.isArray(vec) || vec.length !== EMBEDDING_DIMS) {
    throw new Error(`Unexpected embedding shape (expected ${EMBEDDING_DIMS} dims).`);
  }
  return vec;
}

async function connect() {
  if (_client) return { client: _client, db: _db };

  const uri = getMongoUri();
  if (!uri) {
    throw new Error(
      "Missing MONGODB_ATLAS_URI or MONGODB_URI environment variable.",
    );
  }

  _client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
  });

  await _client.connect();
  _db = _client.db(getDbName());

  return { client: _client, db: _db };
}

/** Only paths declared on the Atlas vector index (see scripts/mongodb-init-vectors.mjs). */
function buildVectorFilter({ mission_id, agent_id }) {
  const clauses = [];
  if (mission_id) clauses.push({ equals: { path: "mission_id", value: mission_id } });
  if (agent_id != null && agent_id !== "") {
    clauses.push({ equals: { path: "agent_id", value: Number(agent_id) } });
  }
  if (clauses.length === 0) return undefined;
  if (clauses.length === 1) return clauses[0];
  return { compound: { filter: clauses } };
}

/**
 * Store or update one discovery document + embedding (matches init script index on `embedding`).
 */
export async function storeDiscoveryWithEmbedding(discovery) {
  try {
    const { db } = await connect();
    const collection = db.collection("discoveries");

    const textToEmbed = [
      discovery.keywords || "",
      discovery.source_url || "",
      discovery.title || "",
      discovery.summary || "",
    ]
      .join(" ")
      .trim();

    if (!textToEmbed) {
      return { success: false, error: "Nothing to embed" };
    }

    const embedding = await generateEmbedding(textToEmbed);
    if (!embedding) {
      return { success: false, error: "Embedding failed" };
    }

    const id = discovery.id;
    if (!id) {
      return { success: false, error: "discovery.id is required" };
    }

    const doc = {
      id,
      mission_id: discovery.mission_id ?? null,
      agent_id: discovery.agent_id ?? null,
      platform: discovery.platform ?? null,
      industry: discovery.industry ?? null,
      source_url: discovery.source_url ?? "",
      thumbnail_url: discovery.thumbnail_url ?? "",
      keywords: discovery.keywords ?? "",
      likes: discovery.likes ?? 0,
      views: discovery.views ?? 0,
      comments: discovery.comments ?? 0,
      created_at: discovery.created_at ?? new Date().toISOString(),
      embedding,
      vectorized_at: new Date().toISOString(),
    };

    await collection.updateOne(
      { id },
      { $set: doc },
      { upsert: true },
    );

    return { success: true, id };
  } catch (err) {
    console.error("[mongodb-vector] Error storing discovery:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Best-effort batch sync (used after InsForge inserts). Failures are logged, not thrown.
 */
export async function storeDiscoveriesWithEmbeddings(discoveries) {
  if (!getMongoUri() || !discoveries?.length) return { synced: 0, errors: 0 };
  let synced = 0;
  let errors = 0;
  for (const d of discoveries) {
    const r = await storeDiscoveryWithEmbedding(d);
    if (r.success) synced++;
    else errors++;
    await new Promise((r2) => setTimeout(r2, 40));
  }
  return { synced, errors };
}

/**
 * Atlas $vectorSearch — index name must match `scripts/mongodb-init-vectors.mjs`.
 */
export async function vectorSearch({
  query,
  industry = null,
  platform = null,
  mission_id = null,
  agent_id = null,
  limit = 12,
  minScore = 0,
}) {
  try {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) {
      return { results: [], error: "Failed to generate query embedding" };
    }

    const { db } = await connect();
    const collection = db.collection("discoveries");
    const indexName = getVectorIndexName();
    const filter = buildVectorFilter({ mission_id, agent_id });
    const preLimit = industry || platform ? Math.min(80, limit * 6) : limit;

    const vectorStage = {
      $vectorSearch: {
        index: indexName,
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: Math.min(200, Math.max(preLimit * 10, 50)),
        limit: preLimit,
        ...(filter ? { filter } : {}),
      },
    };

    const pipeline = [
      vectorStage,
      {
        $project: {
          _id: 0,
          id: 1,
          keywords: 1,
          industry: 1,
          platform: 1,
          source_url: 1,
          thumbnail_url: 1,
          agent_id: 1,
          likes: 1,
          views: 1,
          comments: 1,
          created_at: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const postMatch = {};
    if (industry) postMatch.industry = industry;
    if (platform) postMatch.platform = platform;
    if (Object.keys(postMatch).length > 0) {
      pipeline.push({ $match: postMatch });
    }

    if (minScore > 0) {
      pipeline.push({ $match: { score: { $gte: minScore } } });
    }

    pipeline.push({ $limit: limit });

    const raw = await collection.aggregate(pipeline).toArray();

    return {
      results: raw.map((r) => ({
        keywords: r.keywords ?? "",
        source_url: r.source_url ?? "",
        thumbnail_url: r.thumbnail_url ?? "",
        agent_id: r.agent_id ?? 5,
        likes: r.likes ?? 0,
        views: r.views ?? 0,
        comments: r.comments ?? 0,
        created_at: r.created_at ?? new Date().toISOString(),
        score: typeof r.score === "number" ? r.score : 0,
      })),
      count: raw.length,
    };
  } catch (err) {
    console.error("[mongodb-vector] Search error:", err.message);
    return { results: [], error: err.message };
  }
}

export async function getSimilarDiscoveries(discoveryId, limit = 5) {
  try {
    const { db } = await connect();
    const collection = db.collection("discoveries");
    const source = await collection.findOne({ id: discoveryId });
    if (!source?.embedding) {
      return { results: [], error: "Source discovery not found or not vectorized" };
    }

    const indexName = getVectorIndexName();
    const pipeline = [
      {
        $vectorSearch: {
          index: indexName,
          path: "embedding",
          queryVector: source.embedding,
          numCandidates: limit * 8,
          limit: limit + 1,
        },
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        $match: {
          id: { $ne: discoveryId },
        },
      },
      { $limit: limit },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    return {
      results: results.map((r) => ({
        id: r.id,
        keywords: r.keywords,
        industry: r.industry,
        platform: r.platform,
        score: r.score,
      })),
      count: results.length,
    };
  } catch (err) {
    console.error("[mongodb-vector] Similar search error:", err.message);
    return { results: [], error: err.message };
  }
}

export async function checkMongoDBHealth() {
  try {
    const { client } = await connect();
    await client.db().admin().ping();
    return { healthy: true };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}
