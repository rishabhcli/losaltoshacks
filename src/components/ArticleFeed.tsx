"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import { ArticleSerialized } from "@/types";

interface ArticleFeedProps {
  articles: ArticleSerialized[];
  title?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ArticleFeed({
  articles,
  title = "Source Articles",
}: ArticleFeedProps) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900">
      <div className="border-b border-gray-700 px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-gray-400">
          {articles.length} articles from Google News
        </p>
      </div>
      <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
        {articles.map((article, i) => (
          <motion.a
            key={article._id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {article.title}
              </p>
              {article.summary && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {article.summary}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {timeAgo(article.publishedAt)}
                </span>
                {article.keywordTags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 shrink-0 mt-1 group-hover:text-indigo-400 transition-colors" />
          </motion.a>
        ))}
        {articles.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No articles yet. Run ingestion to fetch from Google News.
          </div>
        )}
      </div>
    </div>
  );
}
