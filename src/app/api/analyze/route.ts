import { NextResponse } from "next/server";
import { clusterArticles, ArticleCluster } from "@/lib/clustering";
import { computeTrendScores, normalizeScoresAcross, slugify, TrendScores } from "@/lib/scoring";
import { generateTrendLabel, generateInsight } from "@/lib/openai";
import { findRecentArticles, trendsCollection, insightsCollection, ensureIndexes } from "@/lib/db";
import { Article, Insight } from "@/types";

/** Process a single cluster: label → score → upsert trend → generate insight. */
async function processCluster(
  cluster: ArticleCluster,
  scores: TrendScores,
  trendsCol: Awaited<ReturnType<typeof trendsCollection>>,
  insightsCol: Awaited<ReturnType<typeof insightsCollection>>
): Promise<{ trend: boolean; insight: boolean; error?: string }> {
  try {
    const titles = cluster.articles.map((a) => a.title);
    const label = await generateTrendLabel(titles);
    const slug = slugify(label.name);
    const now = new Date();

    // Build $set — only include centroidEmbedding if we have one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setFields: Record<string, any> = {
      name: label.name,
      description: label.description,
      normalizedKeywords: label.keywords,
      articleIds: cluster.articles.map((a) => a._id),
      articleCount: cluster.articles.length,
      volume: scores.volume,
      recentVolume: scores.recentVolume,
      growthRate: scores.growthRate,
      acceleration: scores.acceleration,
      recencyScore: scores.recencyScore,
      compositeScore: scores.compositeScore,
      updatedAt: now,
    };
    if (cluster.centroid.length > 0) {
      setFields.centroidEmbedding = cluster.centroid;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateDoc: any = {
      $set: setFields,
      $setOnInsert: { slug, createdAt: now },
      $push: {
        scoreHistory: {
          $each: [{ date: now, score: scores.compositeScore }],
          $slice: -30,
        },
      },
    };

    const trendResult = await trendsCol.findOneAndUpdate(
      { slug },
      updateDoc,
      { upsert: true, returnDocument: "after" }
    );

    if (!trendResult) {
      return { trend: true, insight: false, error: "Trend upsert returned null" };
    }

    // Generate AI insight
    const summaries = cluster.articles.map(
      (a) => `Title: ${a.title}\nSummary: ${a.summary}`
    );

    const insightData = await generateInsight(
      label.name,
      label.description,
      scores.growthRate,
      scores.acceleration,
      summaries
    );

    await insightsCol.updateOne(
      { trendId: trendResult._id },
      {
        $set: {
          trendId: trendResult._id,
          audience: insightData.audience,
          explanation: insightData.explanation,
          businessActions: insightData.businessActions as Insight["businessActions"],
          risks: insightData.risks,
          confidence: insightData.confidence as Insight["confidence"],
          generatedAt: now,
          modelUsed: "MiniMax-M2.7",
        },
      },
      { upsert: true }
    );

    return { trend: true, insight: true };
  } catch (err) {
    console.error("Cluster processing failed:", err);
    return { trend: false, insight: false, error: String(err) };
  }
}

export async function POST() {
  try {
    // 1. Fetch recent articles from MongoDB
    const articles = (await findRecentArticles(14, 500)) as unknown as Article[];

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No recent articles to analyze. Run ingest first.",
        trendsCreated: 0,
      });
    }

    // 2. Cluster by embedding similarity (or keyword fallback)
    const clusters = clusterArticles(articles);

    if (clusters.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No meaningful clusters found. Try ingesting more articles.",
        trendsCreated: 0,
      });
    }

    // 3. Score each cluster, then cross-normalize so best = 1.0
    const rawScores = clusters.map((c) => computeTrendScores(c.articles));
    const normalizedScores = normalizeScoresAcross(rawScores);

    // 4. Process each cluster (label + upsert + insight)
    const trendsCol = await trendsCollection();
    const insightsCol = await insightsCollection();

    const results = await Promise.all(
      clusters.map((cluster, i) =>
        processCluster(cluster, normalizedScores[i], trendsCol, insightsCol)
      )
    );

    const trendsCreated = results.filter((r) => r.trend).length;
    const insightsCreated = results.filter((r) => r.insight).length;
    const errors = results.filter((r) => r.error).map((r) => r.error);

    // 5. Ensure indexes
    await ensureIndexes();

    return NextResponse.json({
      success: true,
      articlesAnalyzed: articles.length,
      clustersFound: clusters.length,
      trendsCreated,
      insightsCreated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: String(error) },
      { status: 500 }
    );
  }
}
