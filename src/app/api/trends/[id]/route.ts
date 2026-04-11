import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  findTrendById,
  findInsightByTrendId,
  findArticlesByIds,
  serializeTrend,
  serializeInsight,
  serializeArticle,
} from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: "Invalid trend ID" }, { status: 400 });
    }

    const trend = await findTrendById(id);
    if (!trend) {
      return NextResponse.json({ error: "Trend not found" }, { status: 404 });
    }

    const [insight, articles] = await Promise.all([
      findInsightByTrendId(objectId),
      findArticlesByIds(trend.articleIds || []),
    ]);

    return NextResponse.json({
      trend: serializeTrend(trend),
      insight: insight ? serializeInsight(insight) : null,
      articles: articles.map(serializeArticle),
    });
  } catch (error) {
    console.error("Trend detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trend details" },
      { status: 500 }
    );
  }
}
