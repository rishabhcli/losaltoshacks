import { NextRequest, NextResponse } from "next/server";
import { fetchMultipleFeedsDetailed } from "@/lib/rss";
import { generateEmbeddings } from "@/lib/openai";
import {
  findExistingLinks,
  mergeKeywordTags,
  insertArticlesBatch,
  ensureIndexes,
} from "@/lib/db";

const DEFAULT_KEYWORDS = [
  "fashion trends",
  "Gen Z consumer",
  "retail innovation",
  "beauty industry",
  "sustainable fashion",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const keywords: string[] = body.keywords || DEFAULT_KEYWORDS;

    // 1. Fetch all RSS feeds in parallel
    const { feeds: feedResults, errors: feedErrors } =
      await fetchMultipleFeedsDetailed(keywords);

    // Flatten all articles from all feeds
    type RawArticle = {
      title: string; summary: string; link: string;
      source: string; keywordTags: string[];
      publishedAt: Date; fetchedAt: Date;
    };
    const allArticles: RawArticle[] = [];
    for (const feed of feedResults) {
      for (const article of feed.articles) {
        allArticles.push(article);
      }
    }

    if (allArticles.length === 0) {
      return NextResponse.json({
        success: true,
        newArticles: 0,
        existingArticles: 0,
        totalFeeds: feedResults.length,
        keywords,
        message: "No articles returned from Yahoo RSS feeds.",
      });
    }

    // 2. Deduplicate within the batch (same link from multiple keywords)
    const seen = new Map<string, RawArticle>();
    for (const a of allArticles) {
      if (seen.has(a.link)) {
        // Merge keyword tags into the first occurrence
        const existing = seen.get(a.link)!;
        for (const tag of a.keywordTags) {
          if (!existing.keywordTags.includes(tag)) {
            existing.keywordTags.push(tag);
          }
        }
      } else {
        seen.set(a.link, a);
      }
    }
    const dedupedArticles = Array.from(seen.values());

    // 3. Check which links already exist in the database
    const existingLinks = await findExistingLinks(
      dedupedArticles.map((a) => a.link)
    );

    const newArticles = dedupedArticles.filter((a) => !existingLinks.has(a.link));
    const existingArticles = dedupedArticles.filter((a) => existingLinks.has(a.link));

    // 4. Merge keyword tags for existing articles (bulk)
    if (existingArticles.length > 0) {
      await mergeKeywordTags(
        existingArticles.map((a) => ({
          link: a.link,
          keywordTags: a.keywordTags,
        }))
      );
    }

    // 5. Generate embeddings for new articles in batch, then insert
    let insertedCount = 0;
    if (newArticles.length > 0) {
      const texts = newArticles.map(
        (a) => `${a.title}. ${a.summary}`.slice(0, 500)
      );
      const embeddings = await generateEmbeddings(texts);

      const docsToInsert = newArticles.map((article, i) => ({
        ...article,
        embedding: embeddings[i],
      }));

      insertedCount = await insertArticlesBatch(docsToInsert);
    }

    // 6. Ensure indexes exist (idempotent)
    await ensureIndexes();

    return NextResponse.json({
      success: true,
      newArticles: insertedCount,
      existingArticles: existingArticles.length,
      totalFeeds: feedResults.length,
      failedFeeds: feedErrors.length,
      feedErrors: feedErrors.length > 0 ? feedErrors : undefined,
      totalParsed: allArticles.length,
      deduplicated: allArticles.length - dedupedArticles.length,
      keywords,
    });
  } catch (error) {
    console.error("Ingest error:", error);
    return NextResponse.json(
      { error: "Ingestion failed", details: String(error) },
      { status: 500 }
    );
  }
}
