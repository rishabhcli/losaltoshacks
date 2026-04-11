import Parser from "rss-parser";
import { Article } from "@/types";

const parser = new Parser({
  timeout: 10_000, // 10 second timeout per feed
  customFields: {
    item: [["media:content", "mediaContent"]],
  },
});

const GOOGLE_NEWS_RSS_BASE = "https://news.google.com/rss/search";

export interface RSSFetchResult {
  articles: Omit<Article, "_id" | "embedding" | "clusterId">[];
  keyword: string;
  feedTitle: string;
}

export interface MultiFeedResult {
  feeds: RSSFetchResult[];
  errors: { keyword: string; error: string }[];
}

/**
 * Fetch a single Google News RSS feed for a given keyword.
 * Normalises each item into an Article-compatible shape.
 */
export async function fetchYahooRSS(keyword: string): Promise<RSSFetchResult> {
  const url = `${GOOGLE_NEWS_RSS_BASE}?q=${encodeURIComponent(keyword)}&hl=en-US&gl=US&ceid=US:en`;

  const feed = await parser.parseURL(url);

  const now = new Date();
  const articles = (feed.items || [])
    .filter((item) => item.title && item.link)
    .map((item) => {
      const link = item.link || "";

      // Extract source from title (Google News format: "Title - Source")
      const titleParts = (item.title || "").split(" - ");
      const source = titleParts.length > 1 ? titleParts.pop()!.trim() : "Google News";
      const title = titleParts.join(" - ").trim();

      return {
        title,
        summary: cleanSummary(item.contentSnippet || item.content || ""),
        link,
        source,
        keywordTags: [keyword.toLowerCase()],
        publishedAt: item.pubDate ? new Date(item.pubDate) : now,
        fetchedAt: now,
      };
    });

  return {
    articles,
    keyword,
    feedTitle: feed.title || `Google News: ${keyword}`,
  };
}

/**
 * Fetch multiple Yahoo RSS feeds in parallel.
 * Returns both successful feeds and per-keyword errors for diagnostics.
 */
export async function fetchMultipleFeeds(
  keywords: string[]
): Promise<RSSFetchResult[]> {
  const { feeds } = await fetchMultipleFeedsDetailed(keywords);
  return feeds;
}

export async function fetchMultipleFeedsDetailed(
  keywords: string[]
): Promise<MultiFeedResult> {
  const results = await Promise.allSettled(
    keywords.map((kw) => fetchYahooRSS(kw))
  );

  const feeds: RSSFetchResult[] = [];
  const errors: { keyword: string; error: string }[] = [];

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      feeds.push(r.value);
    } else {
      errors.push({ keyword: keywords[i], error: String(r.reason) });
      console.warn(`RSS fetch failed for "${keywords[i]}":`, r.reason);
    }
  });

  return { feeds, errors };
}

/**
 * Strip HTML tags and excessive whitespace from article summaries.
 */
function cleanSummary(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")       // strip HTML tags
    .replace(/&[a-z]+;/gi, " ")    // strip HTML entities
    .replace(/\s+/g, " ")          // collapse whitespace
    .trim()
    .slice(0, 500);
}
