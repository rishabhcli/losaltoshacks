import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { generateReport } from "@/lib/openai";
import { trendsCollection, findInsightsByTrendIds, reportsCollection } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trendIds, targetContext, reportName } = body;

    if (!trendIds?.length || !targetContext) {
      return NextResponse.json(
        { error: "trendIds and targetContext are required" },
        { status: 400 }
      );
    }

    const objectIds = trendIds.map((id: string) => new ObjectId(id));
    const tCol = await trendsCollection();

    const [trends, insights] = await Promise.all([
      tCol.find({ _id: { $in: objectIds } }).toArray(),
      findInsightsByTrendIds(objectIds),
    ]);

    const insightMap = new Map(
      insights.map((i) => [i.trendId.toString(), i])
    );

    const trendInputs = trends.map((t) => {
      const insight = insightMap.get(t._id.toString());
      return {
        name: t.name,
        description: t.description || "",
        audience: insight?.audience?.demographic || "General consumers",
        actions: (insight?.businessActions || []).map(
          (a: { action: string }) => a.action
        ),
      };
    });

    const summary = await generateReport(trendInputs, targetContext);

    const report = {
      reportName: reportName || `Market Brief - ${new Date().toLocaleDateString()}`,
      targetContext,
      selectedTrendIds: objectIds,
      generatedSummary: summary,
      createdAt: new Date(),
    };

    const rCol = await reportsCollection();
    const result = await rCol.insertOne(report);

    return NextResponse.json({
      success: true,
      report: {
        _id: result.insertedId.toString(),
        ...report,
        selectedTrendIds: trendIds,
        createdAt: report.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Report generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
