import {
  actionType,
  createObjectActionImplementation,
  modifyObjectActionImplementation,
  objectType,
  oneToManyLinkType,
  ontology,
} from "@palantir/pilot-ontology-api";

// =============================================================================
// OBJECT TYPES
// =============================================================================

/**
 * MarketTrend — the core entity representing an identified market trend
 * derived from social media and news analysis.
 */
const marketTrend = objectType({
  apiName: "marketTrend",
  displayName: "Market Trend",
  pluralDisplayName: "Market Trends",
  icon: {
    name: "trending-up",
    color: "#1F6FEB",
  },
  properties: {
    trendId: {
      displayName: "Trend ID",
      nullable: false,
      type: { type: "string" },
    },
    title: {
      displayName: "Title",
      nullable: false,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: false,
      type: { type: "string" },
    },
    category: {
      displayName: "Category",
      nullable: false,
      type: { type: "string" },
    },
    industry: {
      displayName: "Industry",
      nullable: false,
      type: { type: "string" },
    },
    trendScore: {
      displayName: "Trend Score",
      nullable: false,
      type: { type: "double" },
    },
    sentimentScore: {
      displayName: "Sentiment Score",
      nullable: true,
      type: { type: "double" },
    },
    status: {
      displayName: "Status",
      nullable: false,
      type: { type: "string" },
    },
    region: {
      displayName: "Region",
      nullable: true,
      type: { type: "string" },
    },
    detectedAt: {
      displayName: "Detected At",
      nullable: false,
      type: { type: "timestamp" },
    },
    peakDate: {
      displayName: "Peak Date",
      nullable: true,
      type: { type: "date" },
    },
    mentionCount: {
      displayName: "Mention Count",
      nullable: false,
      type: { type: "integer" },
    },
    growthRate: {
      displayName: "Growth Rate",
      nullable: true,
      type: { type: "double" },
    },
    topKeywords: {
      displayName: "Top Keywords",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "trendId",
  titlePropertyApiName: "title",
});

/**
 * TrendSource — represents a data source (social media platform, news outlet)
 * contributing signal to a trend.
 */
const trendSource = objectType({
  apiName: "trendSource",
  displayName: "Trend Source",
  pluralDisplayName: "Trend Sources",
  icon: {
    name: "globe-network",
    color: "#9F1AB1",
  },
  properties: {
    sourceId: {
      displayName: "Source ID",
      nullable: false,
      type: { type: "string" },
    },
    trendId: {
      displayName: "Trend ID",
      nullable: false,
      type: { type: "string" },
    },
    platform: {
      displayName: "Platform",
      nullable: false,
      type: { type: "string" },
    },
    mentionCount: {
      displayName: "Mention Count",
      nullable: false,
      type: { type: "integer" },
    },
    engagementRate: {
      displayName: "Engagement Rate",
      nullable: true,
      type: { type: "double" },
    },
    sampleUrl: {
      displayName: "Sample URL",
      nullable: true,
      type: { type: "string" },
    },
    collectedAt: {
      displayName: "Collected At",
      nullable: false,
      type: { type: "timestamp" },
    },
    sentimentBreakdown: {
      displayName: "Sentiment Breakdown",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "sourceId",
  titlePropertyApiName: "platform",
});

/**
 * TrendDemographic — demographic segment driving a specific trend,
 * with engagement and affinity metrics.
 */
const trendDemographic = objectType({
  apiName: "trendDemographic",
  displayName: "Trend Demographic",
  pluralDisplayName: "Trend Demographics",
  icon: {
    name: "people",
    color: "#D9822B",
  },
  properties: {
    demographicId: {
      displayName: "Demographic ID",
      nullable: false,
      type: { type: "string" },
    },
    trendId: {
      displayName: "Trend ID",
      nullable: false,
      type: { type: "string" },
    },
    ageGroup: {
      displayName: "Age Group",
      nullable: false,
      type: { type: "string" },
    },
    gender: {
      displayName: "Gender",
      nullable: true,
      type: { type: "string" },
    },
    location: {
      displayName: "Location",
      nullable: true,
      type: { type: "string" },
    },
    affinityScore: {
      displayName: "Affinity Score",
      nullable: false,
      type: { type: "double" },
    },
    engagementIndex: {
      displayName: "Engagement Index",
      nullable: true,
      type: { type: "double" },
    },
    purchaseIntent: {
      displayName: "Purchase Intent",
      nullable: true,
      type: { type: "double" },
    },
    topInterests: {
      displayName: "Top Interests",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "demographicId",
  titlePropertyApiName: "ageGroup",
});

/**
 * MarketRecommendation — AI-generated product/service recommendation
 * derived from a trend's signal and demographic data.
 */
const marketRecommendation = objectType({
  apiName: "marketRecommendation",
  displayName: "Market Recommendation",
  pluralDisplayName: "Market Recommendations",
  icon: {
    name: "lightbulb",
    color: "#0F9960",
  },
  properties: {
    recommendationId: {
      displayName: "Recommendation ID",
      nullable: false,
      type: { type: "string" },
    },
    trendId: {
      displayName: "Trend ID",
      nullable: false,
      type: { type: "string" },
    },
    title: {
      displayName: "Title",
      nullable: false,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: false,
      type: { type: "string" },
    },
    productCategory: {
      displayName: "Product Category",
      nullable: false,
      type: { type: "string" },
    },
    targetDemographic: {
      displayName: "Target Demographic",
      nullable: true,
      type: { type: "string" },
    },
    confidenceScore: {
      displayName: "Confidence Score",
      nullable: false,
      type: { type: "double" },
    },
    estimatedRevenuePotential: {
      displayName: "Estimated Revenue Potential",
      nullable: true,
      type: { type: "string" },
    },
    priority: {
      displayName: "Priority",
      nullable: false,
      type: { type: "string" },
    },
    status: {
      displayName: "Status",
      nullable: false,
      type: { type: "string" },
    },
    createdAt: {
      displayName: "Created At",
      nullable: false,
      type: { type: "timestamp" },
    },
    actionPlan: {
      displayName: "Action Plan",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "recommendationId",
  titlePropertyApiName: "title",
});

/**
 * MarketInsight — high-level KPI / dashboard insight that summarizes
 * cross-trend intelligence for the overview dashboard.
 */
const marketInsight = objectType({
  apiName: "marketInsight",
  displayName: "Market Insight",
  pluralDisplayName: "Market Insights",
  icon: {
    name: "chart",
    color: "#7157D9",
  },
  properties: {
    insightId: {
      displayName: "Insight ID",
      nullable: false,
      type: { type: "string" },
    },
    title: {
      displayName: "Title",
      nullable: false,
      type: { type: "string" },
    },
    summary: {
      displayName: "Summary",
      nullable: false,
      type: { type: "string" },
    },
    insightType: {
      displayName: "Insight Type",
      nullable: false,
      type: { type: "string" },
    },
    industry: {
      displayName: "Industry",
      nullable: false,
      type: { type: "string" },
    },
    metricValue: {
      displayName: "Metric Value",
      nullable: true,
      type: { type: "double" },
    },
    metricUnit: {
      displayName: "Metric Unit",
      nullable: true,
      type: { type: "string" },
    },
    changePercent: {
      displayName: "Change Percent",
      nullable: true,
      type: { type: "double" },
    },
    period: {
      displayName: "Period",
      nullable: false,
      type: { type: "string" },
    },
    generatedAt: {
      displayName: "Generated At",
      nullable: false,
      type: { type: "timestamp" },
    },
    relatedTrendIds: {
      displayName: "Related Trend IDs",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "insightId",
  titlePropertyApiName: "title",
});

/**
 * MarketPulseUserProfile — persistent user profile that stores
 * account info and preferences (industry, business name) so they
 * survive across sessions, devices, and browsers.
 */
const marketPulseUserProfile = objectType({
  apiName: "marketPulseUserProfile",
  displayName: "MarketPulse User Profile",
  pluralDisplayName: "MarketPulse User Profiles",
  icon: {
    name: "person",
    color: "#2965CC",
  },
  properties: {
    profileId: {
      displayName: "Profile ID",
      nullable: false,
      type: { type: "string" },
    },
    displayName: {
      displayName: "Display Name",
      nullable: false,
      type: { type: "string" },
    },
    email: {
      displayName: "Email",
      nullable: false,
      type: { type: "string" },
    },
    industry: {
      displayName: "Industry",
      nullable: true,
      type: { type: "string" },
    },
    businessName: {
      displayName: "Business Name",
      nullable: true,
      type: { type: "string" },
    },
    createdAt: {
      displayName: "Created At",
      nullable: false,
      type: { type: "timestamp" },
    },
    lastLoginAt: {
      displayName: "Last Login At",
      nullable: true,
      type: { type: "timestamp" },
    },
  },
  primaryKeyPropertyApiName: "profileId",
  titlePropertyApiName: "displayName",
});

// =============================================================================
// ACTION TYPES
// =============================================================================

/**
 * Bookmark a trend for follow-up or watchlist tracking.
 */
const bookmarkTrend = actionType({
  apiName: "bookmark-trend",
  displayName: "Bookmark Trend",
  icon: {
    name: "bookmark",
    color: "#1F6FEB",
  },
  parameters: {
    trend: {
      displayName: "Trend",
      required: true,
      type: { type: "object", objectTypeApiName: "marketTrend" },
    },
    status: {
      displayName: "Status",
      required: true,
      type: { type: "string" },
    },
  },
});

const bookmarkTrendImpl = modifyObjectActionImplementation({
  actionType: bookmarkTrend,
  objectType: marketTrend,
  primaryKeyParameter: "trend",
  parameterMapping: {
    status: "status",
  },
});

/**
 * Update the status of a recommendation (e.g. accepted, dismissed, in-review).
 */
const updateRecommendationStatus = actionType({
  apiName: "update-recommendation-status",
  displayName: "Update Recommendation Status",
  icon: {
    name: "tick-circle",
    color: "#0F9960",
  },
  parameters: {
    recommendation: {
      displayName: "Recommendation",
      required: true,
      type: { type: "object", objectTypeApiName: "marketRecommendation" },
    },
    status: {
      displayName: "Status",
      required: true,
      type: { type: "string" },
    },
  },
});

const updateRecommendationStatusImpl = modifyObjectActionImplementation({
  actionType: updateRecommendationStatus,
  objectType: marketRecommendation,
  primaryKeyParameter: "recommendation",
  parameterMapping: {
    status: "status",
  },
});

/**
 * Create a new MarketPulse user profile during signup.
 */
const createUserProfile = actionType({
  apiName: "create-user-profile",
  displayName: "Create User Profile",
  icon: {
    name: "new-person",
    color: "#2965CC",
  },
  parameters: {
    profileId: {
      displayName: "Profile ID",
      required: true,
      type: { type: "string" },
    },
    displayName: {
      displayName: "Display Name",
      required: true,
      type: { type: "string" },
    },
    email: {
      displayName: "Email",
      required: true,
      type: { type: "string" },
    },
    industry: {
      displayName: "Industry",
      required: false,
      type: { type: "string" },
    },
    businessName: {
      displayName: "Business Name",
      required: false,
      type: { type: "string" },
    },
    createdAt: {
      displayName: "Created At",
      required: true,
      type: { type: "timestamp" },
    },
    lastLoginAt: {
      displayName: "Last Login At",
      required: false,
      type: { type: "timestamp" },
    },
  },
});

const createUserProfileImpl = createObjectActionImplementation({
  actionType: createUserProfile,
  objectType: marketPulseUserProfile,
  parameterMapping: {
    profileId: "profileId",
    displayName: "displayName",
    email: "email",
    industry: "industry",
    businessName: "businessName",
    createdAt: "createdAt",
    lastLoginAt: "lastLoginAt",
  },
});

/**
 * Update an existing user profile's preferences (industry, business name,
 * display name) and record the latest login timestamp.
 */
const updateUserProfile = actionType({
  apiName: "update-user-profile",
  displayName: "Update User Profile",
  icon: {
    name: "edit",
    color: "#2965CC",
  },
  parameters: {
    userProfile: {
      displayName: "User Profile",
      required: true,
      type: { type: "object", objectTypeApiName: "marketPulseUserProfile" },
    },
    displayName: {
      displayName: "Display Name",
      required: false,
      type: { type: "string" },
    },
    industry: {
      displayName: "Industry",
      required: false,
      type: { type: "string" },
    },
    businessName: {
      displayName: "Business Name",
      required: false,
      type: { type: "string" },
    },
    lastLoginAt: {
      displayName: "Last Login At",
      required: false,
      type: { type: "timestamp" },
    },
  },
});

const updateUserProfileImpl = modifyObjectActionImplementation({
  actionType: updateUserProfile,
  objectType: marketPulseUserProfile,
  primaryKeyParameter: "userProfile",
  parameterMapping: {
    displayName: "displayName",
    industry: "industry",
    businessName: "businessName",
    lastLoginAt: "lastLoginAt",
  },
});

/**
 * Create a new market insight (e.g. from a periodic analysis pipeline).
 */
const createMarketInsight = actionType({
  apiName: "create-market-insight",
  displayName: "Create Market Insight",
  icon: {
    name: "plus",
    color: "#7157D9",
  },
  parameters: {
    insightId: {
      displayName: "Insight ID",
      required: true,
      type: { type: "string" },
    },
    title: {
      displayName: "Title",
      required: true,
      type: { type: "string" },
    },
    summary: {
      displayName: "Summary",
      required: true,
      type: { type: "string" },
    },
    insightType: {
      displayName: "Insight Type",
      required: true,
      type: { type: "string" },
    },
    industry: {
      displayName: "Industry",
      required: true,
      type: { type: "string" },
    },
    metricValue: {
      displayName: "Metric Value",
      required: false,
      type: { type: "double" },
    },
    metricUnit: {
      displayName: "Metric Unit",
      required: false,
      type: { type: "string" },
    },
    changePercent: {
      displayName: "Change Percent",
      required: false,
      type: { type: "double" },
    },
    period: {
      displayName: "Period",
      required: true,
      type: { type: "string" },
    },
    generatedAt: {
      displayName: "Generated At",
      required: true,
      type: { type: "timestamp" },
    },
    relatedTrendIds: {
      displayName: "Related Trend IDs",
      required: false,
      type: { type: "string" },
    },
  },
});

const createMarketInsightImpl = createObjectActionImplementation({
  actionType: createMarketInsight,
  objectType: marketInsight,
  parameterMapping: {
    insightId: "insightId",
    title: "title",
    summary: "summary",
    insightType: "insightType",
    industry: "industry",
    metricValue: "metricValue",
    metricUnit: "metricUnit",
    changePercent: "changePercent",
    period: "period",
    generatedAt: "generatedAt",
    relatedTrendIds: "relatedTrendIds",
  },
});

// =============================================================================
// LINK TYPES
// =============================================================================

/**
 * A trend has many sources (social/news data points).
 */
const trendToSources = oneToManyLinkType({
  one: {
    objectType: marketTrend,
    linkApiName: "trendToSourcesSources",
  },
  toMany: {
    objectType: trendSource,
    linkApiName: "trendToSourcesTrend",
    foreignKeyPropertyApiName: "trendId",
  },
});

/**
 * A trend has many demographic segments.
 */
const trendToDemographics = oneToManyLinkType({
  one: {
    objectType: marketTrend,
    linkApiName: "trendToDemographicsDemographics",
  },
  toMany: {
    objectType: trendDemographic,
    linkApiName: "trendToDemographicsTrend",
    foreignKeyPropertyApiName: "trendId",
  },
});

/**
 * A trend has many AI-generated recommendations.
 */
const trendToRecommendations = oneToManyLinkType({
  one: {
    objectType: marketTrend,
    linkApiName: "trendToRecommendationsRecommendations",
  },
  toMany: {
    objectType: marketRecommendation,
    linkApiName: "trendToRecommendationsTrend",
    foreignKeyPropertyApiName: "trendId",
  },
});

// =============================================================================
// ONTOLOGY EXPORT
// =============================================================================

export const ontologyDefinition = ontology({
  actionTypes: [
    bookmarkTrendImpl,
    updateRecommendationStatusImpl,
    createUserProfileImpl,
    updateUserProfileImpl,
    createMarketInsightImpl,
  ],
  objectTypes: [
    marketTrend,
    trendSource,
    trendDemographic,
    marketRecommendation,
    marketInsight,
    marketPulseUserProfile,
  ],
  linkTypes: [trendToSources, trendToDemographics, trendToRecommendations],
});
