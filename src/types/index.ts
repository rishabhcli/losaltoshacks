import { ObjectId } from "mongodb";

export interface Article {
  _id?: ObjectId;
  title: string;
  summary: string;
  link: string;
  source: string;
  keywordTags: string[];
  publishedAt: Date;
  fetchedAt: Date;
  embedding?: number[];
  clusterId?: string;
}

export interface TrendScoreHistory {
  date: Date;
  score: number;
}

export interface Trend {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  normalizedKeywords: string[];
  articleIds: ObjectId[];
  articleCount: number;
  volume: number;
  recentVolume: number;
  growthRate: number;
  acceleration: number;
  recencyScore: number;
  compositeScore: number;
  scoreHistory: TrendScoreHistory[];
  centroidEmbedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AudienceProfile {
  demographic: string;
  psychographic: string;
  behaviors: string[];
}

export interface BusinessAction {
  action: string;
  category: "product" | "marketing" | "branding" | "pricing";
  priority: "high" | "medium" | "low";
}

export interface Insight {
  _id?: ObjectId;
  trendId: ObjectId;
  audience: AudienceProfile;
  explanation: string;
  businessActions: BusinessAction[];
  risks: string[];
  confidence: "high" | "medium" | "low";
  generatedAt: Date;
  modelUsed: string;
}

export interface Report {
  _id?: ObjectId;
  reportName: string;
  targetContext: string;
  selectedTrendIds: ObjectId[];
  generatedSummary: string;
  audioUrl?: string;
  decisionArtifact?: DecisionArtifact;
  createdAt: Date;
}

export interface Evidence {
  sourceType: "yahoo_rss_article";
  sourceId: string;
  title: string;
  publishedAt: Date;
  relevanceScore: number;
}

export interface DecisionAction {
  description: string;
  category: string;
  owner?: string;
  deadline?: string;
  status: "proposed" | "in_progress" | "completed";
}

export type DecisionStatus = "proposed" | "under_review" | "approved" | "executed";

export interface DecisionArtifact {
  objectType: "MarketTrendDecision";
  properties: {
    trendName: string;
    signalStrength: number;
    audienceSegment: string;
    recommendedActions: DecisionAction[];
    evidenceChain: Evidence[];
    riskFactors: string[];
    decisionStatus: DecisionStatus;
  };
  relationships: {
    derivedFrom: string[];
    informsTrend: string;
    generatedBy: string;
  };
}

export interface StoredDecision extends DecisionArtifact {
  _id?: ObjectId;
  createdAt: Date;
  palantirRid?: string;
  palantirPushed: boolean;
}

export interface DecisionSerialized {
  _id: string;
  objectType: "MarketTrendDecision";
  properties: DecisionArtifact["properties"];
  relationships: DecisionArtifact["relationships"];
  createdAt: string;
  palantirRid?: string;
  palantirPushed: boolean;
}

// Serialized versions for frontend (ObjectId → string)
export interface ArticleSerialized extends Omit<Article, "_id" | "publishedAt" | "fetchedAt" | "embedding"> {
  _id: string;
  publishedAt: string;
  fetchedAt: string;
}

export interface TrendSerialized extends Omit<Trend, "_id" | "articleIds" | "createdAt" | "updatedAt" | "scoreHistory" | "centroidEmbedding"> {
  _id: string;
  articleIds: string[];
  createdAt: string;
  updatedAt: string;
  scoreHistory: { date: string; score: number }[];
  insight?: InsightSerialized;
}

export interface InsightSerialized extends Omit<Insight, "_id" | "trendId" | "generatedAt"> {
  _id: string;
  trendId: string;
  generatedAt: string;
}

export interface ReportSerialized extends Omit<Report, "_id" | "selectedTrendIds" | "createdAt"> {
  _id: string;
  selectedTrendIds: string[];
  createdAt: string;
}
