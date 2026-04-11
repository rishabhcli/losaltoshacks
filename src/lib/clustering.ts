import { Article } from "@/types";

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

/**
 * Union-Find with path compression and union-by-rank.
 */
class UnionFind {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();

  makeSet(x: string) {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }

  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string) {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return;
    const rankX = this.rank.get(rx)!;
    const rankY = this.rank.get(ry)!;
    if (rankX < rankY) this.parent.set(rx, ry);
    else if (rankX > rankY) this.parent.set(ry, rx);
    else { this.parent.set(ry, rx); this.rank.set(rx, rankX + 1); }
  }

  /** Return all connected components as arrays of member keys. */
  components(): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    for (const key of this.parent.keys()) {
      const root = this.find(key);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(key);
    }
    return groups;
  }
}

export interface ArticleCluster {
  articles: Article[];
  centroid: number[];
  avgSimilarity: number; // intra-cluster coherence metric
}

/**
 * Cluster articles by embedding similarity using Union-Find.
 * Falls back to keyword-based grouping if embeddings are unavailable.
 *
 * Articles with embeddings that don't join any cluster are excluded
 * (noise). Each article appears in at most one cluster.
 */
export function clusterArticles(
  articles: Article[],
  similarityThreshold: number = 0.78,
  minClusterSize: number = 2
): ArticleCluster[] {
  const withEmbeddings = articles.filter(
    (a) => a.embedding && a.embedding.length > 0
  );

  if (withEmbeddings.length < 3) {
    return clusterByKeywords(articles, minClusterSize);
  }

  // Build article lookup by _id string
  const idToArticle = new Map<string, Article>();
  for (const a of withEmbeddings) {
    idToArticle.set(a._id!.toString(), a);
  }

  const uf = new UnionFind();
  for (const a of withEmbeddings) uf.makeSet(a._id!.toString());

  // Cap pairwise comparisons at 500 articles (hackathon scale)
  const capped = withEmbeddings.slice(0, 500);

  for (let i = 0; i < capped.length; i++) {
    for (let j = i + 1; j < capped.length; j++) {
      const sim = cosineSimilarity(
        capped[i].embedding!,
        capped[j].embedding!
      );
      if (sim >= similarityThreshold) {
        uf.union(capped[i]._id!.toString(), capped[j]._id!.toString());
      }
    }
  }

  // Build clusters from connected components
  const components = uf.components();
  const clusters: ArticleCluster[] = [];

  for (const memberIds of components.values()) {
    if (memberIds.length < minClusterSize) continue;

    const clusterArts = memberIds
      .map((id) => idToArticle.get(id)!)
      .filter(Boolean);

    const embeddings = clusterArts.map((a) => a.embedding!);
    const centroid = computeCentroid(embeddings);

    // Compute average cosine similarity to centroid (coherence)
    const avgSimilarity =
      embeddings.reduce((s, e) => s + cosineSimilarity(e, centroid), 0) /
      embeddings.length;

    clusters.push({ articles: clusterArts, centroid, avgSimilarity });
  }

  // Sort by cluster size descending, then by coherence
  clusters.sort(
    (a, b) =>
      b.articles.length - a.articles.length ||
      b.avgSimilarity - a.avgSimilarity
  );

  return clusters;
}

function computeCentroid(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return [];
  const dim = embeddings[0].length;
  const centroid = new Array<number>(dim).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) centroid[i] += emb[i];
  }
  for (let i = 0; i < dim; i++) centroid[i] /= embeddings.length;
  return centroid;
}

/**
 * Keyword-based fallback clustering.
 * Each article is assigned to its *primary* keyword tag only
 * (the first one) to avoid duplicating articles across clusters.
 */
function clusterByKeywords(
  articles: Article[],
  minClusterSize: number
): ArticleCluster[] {
  const groups = new Map<string, Article[]>();
  for (const article of articles) {
    // Use the first keyword tag as the primary group key
    const key = (article.keywordTags[0] || "unknown").toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(article);
  }

  return Array.from(groups.values())
    .filter((g) => g.length >= minClusterSize)
    .map((arts) => ({
      articles: arts,
      centroid: [],
      avgSimilarity: 0,
    }));
}
