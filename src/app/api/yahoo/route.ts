import { NextRequest, NextResponse } from "next/server";
import { fetchYahooRSS } from "@/lib/rss";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "Missing query parameter 'q'. Usage: /api/yahoo?q=fashion" },
      { status: 400 }
    );
  }

  try {
    const result = await fetchYahooRSS(q);
    return NextResponse.json({
      ...result,
      articleCount: result.articles.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Yahoo RSS fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Yahoo RSS feed",
        keyword: q,
        details: String(error),
      },
      { status: 500 }
    );
  }
}
