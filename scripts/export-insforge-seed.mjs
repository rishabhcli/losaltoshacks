import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  MOCK_DEMOGRAPHICS,
  MOCK_INSIGHTS,
  MOCK_RECOMMENDATIONS,
  MOCK_SOURCES,
  MOCK_TRENDS,
} from "../src/lib/mockData.ts";

const outputDir = resolve(process.cwd(), process.argv[2] ?? "tmp/insforge-seed");

mkdirSync(outputDir, { recursive: true });

const writeSeedFile = (name, data) => {
  writeFileSync(resolve(outputDir, name), JSON.stringify(data, null, 2) + "\n");
};

writeSeedFile(
  "market_trends.json",
  MOCK_TRENDS.map(trend => ({
    trend_id: trend.trendId,
    title: trend.title,
    description: trend.description,
    industry: trend.industry,
    category: trend.category,
    status: trend.status,
    trend_score: trend.trendScore,
    mention_count: trend.mentionCount,
    growth_rate: trend.growthRate,
    sentiment_score: trend.sentimentScore,
    top_keywords: trend.topKeywords,
    detected_at: trend.detectedAt,
  })),
);

writeSeedFile(
  "market_insights.json",
  MOCK_INSIGHTS.map(insight => ({
    insight_id: insight.insightId,
    title: insight.title,
    summary: insight.summary,
    insight_type: insight.insightType,
    industry: insight.industry,
    generated_at: insight.generatedAt,
    related_trend_ids: insight.relatedTrendIds,
    metric_value: insight.metricValue ?? null,
    metric_unit: insight.metricUnit ?? null,
    change_percent: insight.changePercent ?? null,
    period: insight.period ?? null,
  })),
);

writeSeedFile(
  "market_recommendations.json",
  MOCK_RECOMMENDATIONS.map(recommendation => ({
    recommendation_id: recommendation.recommendationId,
    trend_id: recommendation.trendId,
    title: recommendation.title,
    description: recommendation.description,
    product_category: recommendation.productCategory,
    target_demographic: recommendation.targetDemographic,
    confidence_score: recommendation.confidenceScore,
    estimated_revenue_potential: recommendation.estimatedRevenuePotential,
    priority: recommendation.priority,
    status: recommendation.status,
    action_plan: recommendation.actionPlan,
    created_at: recommendation.createdAt,
  })),
);

writeSeedFile(
  "market_sources.json",
  MOCK_SOURCES.map(source => ({
    source_id: source.$primaryKey,
    trend_id: source.trendId,
    platform: source.platform,
    mention_count: source.mentionCount,
    engagement_rate: source.engagementRate,
    sentiment_breakdown: source.sentimentBreakdown,
    collected_at: source.collectedAt,
  })),
);

writeSeedFile(
  "market_demographics.json",
  MOCK_DEMOGRAPHICS.map(demographic => ({
    demographic_id: demographic.$primaryKey,
    trend_id: demographic.trendId,
    age_group: demographic.ageGroup,
    gender: demographic.gender,
    location: demographic.location,
    affinity_score: demographic.affinityScore,
    engagement_index: demographic.engagementIndex,
    purchase_intent: demographic.purchaseIntent,
    top_interests: demographic.topInterests,
  })),
);

console.log(`Wrote InsForge seed files to ${outputDir}`);
