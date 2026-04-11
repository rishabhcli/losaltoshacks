import { Collection, ObjectId, type WithId, type Document } from "mongodb";
import { getDb } from "./mongodb";
import type { Article, Trend, Insight, Report, StoredDecision } from "@/types";

// ── Typed collection accessors ────────────────────────────────────────

export async function articlesCollection(): Promise<Collection<Article & Document>> {
  const db = await getDb();
  return db.collection<Article & Document>("articles");
}

export async function trendsCollection(): Promise<Collection<Trend & Document>> {
  const db = await getDb();
  return db.collection<Trend & Document>("trends");
}

export async function insightsCollection(): Promise<Collection<Insight & Document>> {
  const db = await getDb();
  return db.collection<Insight & Document>("insights");
}

export async function reportsCollection(): Promise<Collection<Report & Document>> {
  const db = await getDb();
  return db.collection<Report & Document>("reports");
}

export async function decisionsCollection(): Promise<Collection<StoredDecision & Document>> {
  const db = await getDb();
  return db.collection<StoredDecision & Document>("decisions");
}

// ── Article helpers ───────────────────────────────────────────────────

/**
 * Check which article links already exist in the database.
 * Returns a Set of links that are already stored.
 */
export async function findExistingLinks(links: string[]): Promise<Set<string>> {
  if (links.length === 0) return new Set();
  const col = await articlesCollection();
  const docs = await col
    .find({ link: { $in: links } }, { projection: { link: 1 } })
    .toArray();
  return new Set(docs.map((d) => d.link));
}

/**
 * Merge keyword tags into existing articles (by link).
 */
export async function mergeKeywordTags(
  updates: { link: string; keywordTags: string[] }[]
): Promise<void> {
  if (updates.length === 0) return;
  const col = await articlesCollection();
  const ops = updates.map((u) => ({
    updateOne: {
      filter: { link: u.link },
      update: { $addToSet: { keywordTags: { $each: u.keywordTags } } },
    },
  }));
  await col.bulkWrite(ops);
}

/**
 * Batch-insert new articles (with embeddings already attached).
 * Skips duplicates via ordered:false so partial failures don't block.
 */
export async function insertArticlesBatch(
  articles: (Omit<Article, "_id" | "clusterId"> & { embedding?: number[] })[]
): Promise<number> {
  if (articles.length === 0) return 0;
  const col = await articlesCollection();
  try {
    const result = await col.insertMany(
      articles as (Article & Document)[],
      { ordered: false }
    );
    return result.insertedCount;
  } catch (err: unknown) {
    // Duplicate key errors are expected if a race condition occurs
    const mongoErr = err as { insertedCount?: number; code?: number };
    if (mongoErr.code === 11000) {
      return mongoErr.insertedCount ?? 0;
    }
    throw err;
  }
}

export async function findRecentArticles(daysBack: number = 14, limit: number = 500) {
  const col = await articlesCollection();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);
  return col.find({ publishedAt: { $gte: cutoff } }).sort({ publishedAt: -1 }).limit(limit).toArray();
}

export async function findArticlesByIds(ids: (string | ObjectId)[]) {
  const col = await articlesCollection();
  const objectIds = ids.map((id) => (typeof id === "string" ? new ObjectId(id) : id));
  return col.find({ _id: { $in: objectIds } }).sort({ publishedAt: -1 }).toArray();
}

// ── Trend helpers ─────────────────────────────────────────────────────

export async function findTrends(filter: Record<string, unknown> = {}, limit: number = 50) {
  const col = await trendsCollection();
  return col.find(filter).sort({ compositeScore: -1 }).limit(limit).toArray();
}

export async function findTrendById(id: string) {
  const col = await trendsCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

// ── Insight helpers ───────────────────────────────────────────────────

export async function findInsightsByTrendIds(trendIds: ObjectId[]) {
  const col = await insightsCollection();
  return col.find({ trendId: { $in: trendIds } }).toArray();
}

export async function findInsightByTrendId(trendId: string | ObjectId) {
  const col = await insightsCollection();
  const oid = typeof trendId === "string" ? new ObjectId(trendId) : trendId;
  return col.findOne({ trendId: oid });
}

// ── Serialization helpers ─────────────────────────────────────────────

function safeIso(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (typeof val === "string") return val;
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

export function serializeTrend(t: WithId<Document>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { centroidEmbedding, ...rest } = t;
  return {
    ...rest,
    _id: t._id.toString(),
    articleIds: (t.articleIds || []).map((id: { toString: () => string }) => id.toString()),
    createdAt: safeIso(t.createdAt),
    updatedAt: safeIso(t.updatedAt),
    scoreHistory: (t.scoreHistory || []).map((s: { date: unknown; score: number }) => ({
      date: safeIso(s.date),
      score: s.score,
    })),
  };
}

export function serializeInsight(i: WithId<Document>) {
  return {
    ...i,
    _id: i._id.toString(),
    trendId: i.trendId?.toString(),
    generatedAt: safeIso(i.generatedAt),
  };
}

export function serializeArticle(a: WithId<Document>) {
  return {
    _id: a._id.toString(),
    title: a.title,
    summary: a.summary,
    link: a.link,
    source: a.source,
    keywordTags: a.keywordTags,
    publishedAt: safeIso(a.publishedAt),
    fetchedAt: safeIso(a.fetchedAt),
  };
}

// ── Index setup (idempotent) ──────────────────────────────────────────

export async function ensureIndexes(): Promise<void> {
  const [articles, trends, insights] = await Promise.all([
    articlesCollection(),
    trendsCollection(),
    insightsCollection(),
  ]);
  await Promise.all([
    articles.createIndex({ link: 1 }, { unique: true }).catch(() => {}),
    articles.createIndex({ publishedAt: -1 }).catch(() => {}),
    articles.createIndex({ keywordTags: 1 }).catch(() => {}),
    trends.createIndex({ compositeScore: -1 }).catch(() => {}),
    trends.createIndex({ slug: 1 }, { unique: true }).catch(() => {}),
    insights.createIndex({ trendId: 1 }).catch(() => {}),
  ]);
}


// ── Decision helpers ──────────────────────────────────────────────────

export async function findDecisionById(id: string) {
  const col = await decisionsCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

export async function findDecisionsByTrendId(trendId: string) {
  const col = await decisionsCollection();
  return col
    .find({ "relationships.informsTrend": trendId })
    .sort({ createdAt: -1 })
    .toArray();
}

export function serializeDecision(d: WithId<Document>) {
  return {
    _id: d._id.toString(),
    objectType: d.objectType,
    properties: d.properties,
    relationships: d.relationships,
    createdAt: safeIso(d.createdAt),
    palantirRid: d.palantirRid || null,
    palantirPushed: d.palantirPushed || false,
  };
}