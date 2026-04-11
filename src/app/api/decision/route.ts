import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { DecisionArtifact, DecisionStatus } from "@/types";
import {
  findTrendById,
  findInsightByTrendId,
  findArticlesByIds,
  decisionsCollection,
  findDecisionsByTrendId,
  serializeDecision,
} from "@/lib/db";
import { pushToPalantirAIP, isPalantirConfigured } from "@/lib/palantir";

// ── GET: Retrieve decisions for a trend ───────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const trendId = request.nextUrl.searchParams.get("trendId");
    if (!trendId) {
      return NextResponse.json(
        { error: "trendId query parameter is required" },
        { status: 400 }
      );
    }

    const decisions = await findDecisionsByTrendId(trendId);

    return NextResponse.json({
      decisions: decisions.map(serializeDecision),
      palantirConfigured: isPalantirConfigured(),
    });
  } catch (error) {
    console.error("Decision fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch decisions", details: String(error) },
      { status: 500 }
    );
  }
}

// ── POST: Create a new decision artifact ──────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trendId } = body;

    if (!trendId) {
      return NextResponse.json(
        { error: "trendId is required" },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(trendId);

    const trend = await findTrendById(trendId);
    if (!trend) {
      return NextResponse.json({ error: "Trend not found" }, { status: 404 });
    }

    const [insight, articles] = await Promise.all([
      findInsightByTrendId(objectId),
      findArticlesByIds(trend.articleIds || []),
    ]);

    // Compute per-article relevance scores based on recency
    const now = Date.now();
    const maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days in ms
    const evidenceChain = articles.map((a) => {
      const pubDate = a.publishedAt instanceof Date
        ? a.publishedAt
        : new Date(a.publishedAt as unknown as string);
      const age = now - pubDate.getTime();
      const relevance = Math.max(0.1, Math.round((1 - age / maxAge) * 100) / 100);
      return {
        sourceType: "yahoo_rss_article" as const,
        sourceId: a._id.toString(),
        title: a.title,
        publishedAt: pubDate,
        relevanceScore: relevance,
      };
    });

    // Sort evidence by relevance descending
    evidenceChain.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const artifact: DecisionArtifact = {
      objectType: "MarketTrendDecision",
      properties: {
        trendName: trend.name,
        signalStrength: trend.compositeScore || 0,
        audienceSegment: insight?.audience?.demographic || "Unknown",
        recommendedActions: (insight?.businessActions || []).map(
          (a: { action: string; category: string; priority?: string }) => ({
            description: a.action,
            category: a.category,
            owner: undefined,
            deadline: undefined,
            status: "proposed" as const,
          })
        ),
        evidenceChain,
        riskFactors: insight?.risks || [],
        decisionStatus: "proposed",
      },
      relationships: {
        derivedFrom: articles.map((a) => a._id.toString()),
        informsTrend: trendId,
        generatedBy: "trendscope-ai-v1",
      },
    };

    // Store locally
    const dCol = await decisionsCollection();
    const result = await dCol.insertOne({
      ...artifact,
      createdAt: new Date(),
      palantirPushed: false,
    });

    const decisionId = result.insertedId.toString();

    // Push to Palantir AIP if configured
    const palantirResult = await pushToPalantirAIP(artifact, decisionId);

    if (palantirResult.pushed) {
      await dCol.updateOne(
        { _id: result.insertedId },
        {
          $set: {
            palantirPushed: true,
            palantirRid: palantirResult.objectRid,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      decisionId,
      artifact,
      palantir: palantirResult,
    });
  } catch (error) {
    console.error("Decision artifact error:", error);
    return NextResponse.json(
      { error: "Decision artifact creation failed", details: String(error) },
      { status: 500 }
    );
  }
}

// ── PATCH: Update decision status ─────────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { decisionId, status } = body;

    if (!decisionId || !status) {
      return NextResponse.json(
        { error: "decisionId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses: DecisionStatus[] = [
      "proposed", "under_review", "approved", "executed",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const dCol = await decisionsCollection();
    const result = await dCol.findOneAndUpdate(
      { _id: new ObjectId(decisionId) },
      { $set: { "properties.decisionStatus": status } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      decision: serializeDecision(result),
    });
  } catch (error) {
    console.error("Decision update error:", error);
    return NextResponse.json(
      { error: "Decision update failed", details: String(error) },
      { status: 500 }
    );
  }
}
