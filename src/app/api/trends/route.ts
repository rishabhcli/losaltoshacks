import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { findTrends, findInsightsByTrendIds, serializeTrend, serializeInsight } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const keyword = request.nextUrl.searchParams.get("keyword");

    const filter: Record<string, unknown> = {};
    if (keyword) {
      filter.normalizedKeywords = { $regex: keyword, $options: "i" };
    }

    const trends = await findTrends(filter);

    // Join with insights
    const trendIds = trends.map((t) => t._id) as ObjectId[];
    const insights = await findInsightsByTrendIds(trendIds);
    const insightMap = new Map(
      insights.map((i) => [i.trendId.toString(), i])
    );

    const result = trends.map((t) => {
      const serialized = serializeTrend(t);
      const insight = insightMap.get(t._id.toString());
      return {
        ...serialized,
        insight: insight ? serializeInsight(insight) : null,
      };
    });

    return NextResponse.json({ trends: result });
  } catch (error) {
    console.error("Trends fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
