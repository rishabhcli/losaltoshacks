/*
 * MarketPulse seed data — realistic market intelligence across
 * fashion/retail, travel/hospitality, and consumer-products industries.
 */
import { FauxFoundry } from "@osdk/faux";
import {
  marketTrend,
  trendSource,
  trendDemographic,
  marketRecommendation,
  marketInsight,
  marketPulseUserProfile,
} from "../.osdk/src";
import { randomUUID } from "node:crypto";

const DEFAULT_ONTOLOGY_RID = "ri.ontology.main.ontology.00000000-0000-0000-0000-000000000000";
const DEFAULT_REALM = "realm";
const DEFAULT_ORG_RID = "ri.multipass..organization.00000000-0000-0000-0000-000000000000";

// ---------------------------------------------------------------------------
// Stable trend IDs so child objects can reference them
// ---------------------------------------------------------------------------
const TREND_IDS = {
  quietLuxury: "t-001-quiet-luxury",
  tiktokMicrotrends: "t-002-tiktok-microtrends",
  genderlessApparel: "t-003-genderless-apparel",
  recommerceResale: "t-004-recommerce-resale",
  dopamineDressing: "t-005-dopamine-dressing",
  aiTravelPlanning: "t-006-ai-travel-planning",
  bleisureTravel: "t-007-bleisure-travel",
  sustainableTourism: "t-008-sustainable-tourism",
  experientialDining: "t-009-experiential-dining",
  soloFemaleTravel: "t-010-solo-female-travel",
  sustainablePackaging: "t-011-sustainable-packaging",
  personalizedNutrition: "t-012-personalized-nutrition",
  smartHomeIntegration: "t-013-smart-home-integration",
  cleanBeauty: "t-014-clean-beauty",
};

export const seed = (fauxFoundry: FauxFoundry) => {
  const dataStore = fauxFoundry.getDataStore(DEFAULT_ONTOLOGY_RID);

  // =========================================================================
  // USERS
  // =========================================================================
  const currentUserId = "c43a1312-1816-4be8-b710-d8c902f9c0ab";

  fauxFoundry.admin.registerUser({
    id: currentUserId,
    username: "analyst",
    givenName: "Maya",
    familyName: "Chen",
    email: "maya.chen@marketpulse.io",
    status: "ACTIVE",
    realm: DEFAULT_REALM,
    organization: DEFAULT_ORG_RID,
    attributes: {},
  });
  fauxFoundry.admin.setCurrentUser(currentUserId);

  fauxFoundry.admin.registerUser({
    id: "e23256fc-8915-41bf-901f-3f51bc7ccc63",
    username: "strategist",
    givenName: "James",
    familyName: "Okafor",
    email: "james.okafor@marketpulse.io",
    realm: DEFAULT_REALM,
    organization: DEFAULT_ORG_RID,
    status: "ACTIVE",
    attributes: {},
  });

  fauxFoundry.admin.registerUser({
    id: "4b1ecc6b-4cc8-4720-85e6-b396186215c5",
    username: "director",
    givenName: "Priya",
    familyName: "Sharma",
    email: "priya.sharma@marketpulse.io",
    realm: DEFAULT_REALM,
    organization: DEFAULT_ORG_RID,
    status: "ACTIVE",
    attributes: {},
  });

  // =========================================================================
  // USER PROFILES
  // =========================================================================

  dataStore.registerObject(marketPulseUserProfile, {
    profileId: "profile-maya-chen",
    displayName: "Maya Chen",
    email: "maya.chen@marketpulse.io",
    industry: "fashion-retail",
    businessName: "TrendVista Analytics",
    createdAt: "2025-12-01T09:00:00Z",
    lastLoginAt: "2026-04-10T14:30:00Z",
  });

  dataStore.registerObject(marketPulseUserProfile, {
    profileId: "profile-james-okafor",
    displayName: "James Okafor",
    email: "james.okafor@marketpulse.io",
    industry: "travel-hospitality",
    businessName: "Okafor Strategy Group",
    createdAt: "2026-01-15T11:00:00Z",
    lastLoginAt: "2026-04-09T08:15:00Z",
  });

  dataStore.registerObject(marketPulseUserProfile, {
    profileId: "profile-priya-sharma",
    displayName: "Priya Sharma",
    email: "priya.sharma@marketpulse.io",
    industry: "consumer-products",
    businessName: "Sharma Consumer Insights",
    createdAt: "2026-02-20T16:45:00Z",
    lastLoginAt: "2026-04-11T10:00:00Z",
  });

  // =========================================================================
  // MARKET TRENDS  (14 trends across 3 industries)
  // =========================================================================

  // ---- Fashion / Retail (5) ------------------------------------------------
  const trend01 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.quietLuxury,
    title: "Quiet Luxury",
    description:
      "A move away from logo-heavy fashion toward understated, high-quality materials and timeless silhouettes. Brands like The Row, Brunello Cucinelli, and Loro Piana are leading a cultural shift where wealth is signaled through craftsmanship rather than conspicuous branding.",
    category: "Luxury & Premium",
    industry: "fashion-retail",
    trendScore: 92,
    sentimentScore: 0.78,
    status: "growing",
    region: "North America",
    detectedAt: "2025-09-15T08:30:00Z",
    peakDate: "2026-04-01",
    mentionCount: 284000,
    growthRate: 34.5,
    topKeywords: "quiet luxury, stealth wealth, old money aesthetic, minimalist fashion, The Row",
  });

  const trend02 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.tiktokMicrotrends,
    title: "TikTok-Driven Microtrends",
    description:
      "Ultra-short lifecycle fashion trends originating on TikTok, including mob wife aesthetic, coquette, and coastal grandmother. These trends can spike to millions of mentions within days before fading, creating urgency for fast-fashion and DTC brands to respond in near-real-time.",
    category: "Social Commerce",
    industry: "fashion-retail",
    trendScore: 88,
    sentimentScore: 0.52,
    status: "peaking",
    region: "Global",
    detectedAt: "2025-07-22T14:00:00Z",
    peakDate: "2026-01-15",
    mentionCount: 1520000,
    growthRate: 67.2,
    topKeywords: "TikTok fashion, microtrend, mob wife, coquette, viral style, #OOTD",
  });

  const trend03 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.genderlessApparel,
    title: "Genderless Apparel",
    description:
      "Rising demand for gender-neutral clothing lines that transcend traditional mens/womens categories. Driven by Gen Z values around inclusivity and self-expression, major retailers from H&M to Nordstrom are expanding unisex collections.",
    category: "Inclusivity & Identity",
    industry: "fashion-retail",
    trendScore: 74,
    sentimentScore: 0.81,
    status: "growing",
    region: "North America",
    detectedAt: "2025-11-03T10:15:00Z",
    peakDate: null,
    mentionCount: 98000,
    growthRate: 22.8,
    topKeywords: "genderless fashion, unisex, gender-neutral, non-binary style, fluid fashion",
  });

  const trend04 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.recommerceResale,
    title: "Recommerce & Resale Boom",
    description:
      "The secondhand and resale market is projected to reach $350B globally by 2027. Platforms like Depop, ThredUp, and The RealReal are mainstreaming pre-owned fashion while luxury houses launch certified resale programs.",
    category: "Sustainability",
    industry: "fashion-retail",
    trendScore: 85,
    sentimentScore: 0.72,
    status: "growing",
    region: "Global",
    detectedAt: "2025-06-10T09:00:00Z",
    peakDate: null,
    mentionCount: 195000,
    growthRate: 28.3,
    topKeywords: "resale, recommerce, secondhand, ThredUp, Depop, circular fashion, pre-owned",
  });

  const trend05 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.dopamineDressing,
    title: "Dopamine Dressing",
    description:
      "Consumers are gravitating toward bold, joy-inducing color palettes and playful patterns as a form of emotional self-care. Bright pinks, saturated yellows, and maximalist prints are driving sell-through rates up 40% in key categories.",
    category: "Color & Design",
    industry: "fashion-retail",
    trendScore: 68,
    sentimentScore: 0.89,
    status: "emerging",
    region: "Europe",
    detectedAt: "2026-01-08T11:45:00Z",
    peakDate: null,
    mentionCount: 62000,
    growthRate: 41.7,
    topKeywords: "dopamine dressing, bold color, maximalist, joy fashion, bright outfit",
  });

  // ---- Travel / Hospitality (5) --------------------------------------------
  const trend06 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.aiTravelPlanning,
    title: "AI-Powered Travel Planning",
    description:
      "Conversational AI assistants are disrupting traditional OTA search by offering personalized itinerary generation, real-time re-booking, and predictive pricing. Adoption among millennial travelers has grown 120% year-over-year.",
    category: "Technology & AI",
    industry: "travel-hospitality",
    trendScore: 91,
    sentimentScore: 0.65,
    status: "growing",
    region: "Global",
    detectedAt: "2025-08-01T07:00:00Z",
    peakDate: null,
    mentionCount: 310000,
    growthRate: 58.4,
    topKeywords: "AI travel, chatbot itinerary, smart booking, predictive pricing, travel assistant",
  });

  const trend07 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.bleisureTravel,
    title: "Bleisure Travel",
    description:
      "The blending of business and leisure travel continues to reshape hospitality. 89% of business travelers now add personal days to work trips, driving demand for extended-stay hotels, co-working amenities, and experience-rich destinations.",
    category: "Work & Lifestyle",
    industry: "travel-hospitality",
    trendScore: 79,
    sentimentScore: 0.7,
    status: "peaking",
    region: "North America",
    detectedAt: "2025-05-20T16:30:00Z",
    peakDate: "2026-03-01",
    mentionCount: 142000,
    growthRate: 15.6,
    topKeywords: "bleisure, workcation, digital nomad, extended stay, business leisure",
  });

  const trend08 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.sustainableTourism,
    title: "Sustainable & Regenerative Tourism",
    description:
      "Travelers are prioritizing destinations and operators that demonstrate genuine environmental stewardship. Regenerative tourism goes beyond neutral impact to actively restore ecosystems, with 67% of luxury travelers willing to pay a premium for certified sustainable experiences.",
    category: "Sustainability",
    industry: "travel-hospitality",
    trendScore: 82,
    sentimentScore: 0.85,
    status: "growing",
    region: "Europe",
    detectedAt: "2025-10-12T13:20:00Z",
    peakDate: null,
    mentionCount: 175000,
    growthRate: 31.2,
    topKeywords: "sustainable travel, regenerative tourism, eco-lodge, carbon offset, green hotel",
  });

  const trend09 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.experientialDining,
    title: "Experiential & Immersive Dining",
    description:
      "Restaurants and hospitality venues are investing heavily in multi-sensory dining experiences — from projection-mapped tasting menus to chef-led foraging expeditions. Average ticket prices for experiential dining are 3x higher than traditional fine dining.",
    category: "Food & Beverage",
    industry: "travel-hospitality",
    trendScore: 71,
    sentimentScore: 0.76,
    status: "emerging",
    region: "Asia-Pacific",
    detectedAt: "2025-12-05T09:45:00Z",
    peakDate: null,
    mentionCount: 88000,
    growthRate: 45.1,
    topKeywords: "immersive dining, experiential restaurant, multi-sensory, chef experience, food theater",
  });

  const trend10 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.soloFemaleTravel,
    title: "Solo Female Travel",
    description:
      "The solo female travel segment is the fastest-growing demographic in global tourism, expanding at 17% annually. Dedicated platforms, women-only tours, and safety-first booking features are creating a $100B+ addressable market.",
    category: "Demographics & Lifestyle",
    industry: "travel-hospitality",
    trendScore: 77,
    sentimentScore: 0.83,
    status: "growing",
    region: "Global",
    detectedAt: "2025-09-28T12:00:00Z",
    peakDate: null,
    mentionCount: 126000,
    growthRate: 17.3,
    topKeywords: "solo female travel, women travel, safety, women-only tours, solo adventure",
  });

  // ---- Consumer Products (4) -----------------------------------------------
  const trend11 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.sustainablePackaging,
    title: "Sustainable Packaging Revolution",
    description:
      "Regulatory pressure and consumer demand are accelerating the shift from single-use plastics to compostable, refillable, and biodegradable packaging. CPG giants are committing to 100% recyclable packaging by 2028, with early movers seeing a 12% brand loyalty uplift.",
    category: "Sustainability",
    industry: "consumer-products",
    trendScore: 87,
    sentimentScore: 0.74,
    status: "growing",
    region: "Global",
    detectedAt: "2025-07-15T10:00:00Z",
    peakDate: null,
    mentionCount: 230000,
    growthRate: 26.9,
    topKeywords: "sustainable packaging, compostable, refillable, plastic-free, biodegradable, CPG",
  });

  const trend12 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.personalizedNutrition,
    title: "Personalized Nutrition & Functional Foods",
    description:
      "DNA-based meal plans, adaptogenic supplements, and functional beverages tailored to individual biomarkers are moving from niche to mainstream. The personalized nutrition market is expected to reach $64B by 2027 with 38% CAGR.",
    category: "Health & Wellness",
    industry: "consumer-products",
    trendScore: 83,
    sentimentScore: 0.68,
    status: "growing",
    region: "North America",
    detectedAt: "2025-08-22T15:30:00Z",
    peakDate: null,
    mentionCount: 167000,
    growthRate: 38.1,
    topKeywords: "personalized nutrition, functional food, adaptogens, gut health, biomarker, supplements",
  });

  const trend13 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.smartHomeIntegration,
    title: "Smart Home Ecosystem Convergence",
    description:
      "The Matter protocol is finally unifying smart home devices across ecosystems. Consumers are upgrading from single-brand setups to interoperable whole-home automation, driving a 52% increase in multi-device bundle purchases.",
    category: "Technology & IoT",
    industry: "consumer-products",
    trendScore: 76,
    sentimentScore: 0.61,
    status: "emerging",
    region: "North America",
    detectedAt: "2025-11-18T08:15:00Z",
    peakDate: null,
    mentionCount: 104000,
    growthRate: 29.5,
    topKeywords: "smart home, Matter protocol, IoT, home automation, interoperability, connected home",
  });

  const trend14 = dataStore.registerObject(marketTrend, {
    trendId: TREND_IDS.cleanBeauty,
    title: "Clean Beauty & Ingredient Transparency",
    description:
      "Consumers are scrutinizing ingredient lists like never before, demanding EWG-verified, cruelty-free, and dermatologist-tested products. Brands with transparent supply chains are outperforming competitors by 23% in customer retention.",
    category: "Health & Wellness",
    industry: "consumer-products",
    trendScore: 80,
    sentimentScore: 0.82,
    status: "peaking",
    region: "Global",
    detectedAt: "2025-06-30T11:00:00Z",
    peakDate: "2026-02-15",
    mentionCount: 203000,
    growthRate: 19.4,
    topKeywords: "clean beauty, ingredient transparency, cruelty-free, EWG verified, non-toxic, vegan beauty",
  });

  // =========================================================================
  // TREND SOURCES  (~4 per trend)
  // =========================================================================

  // Helper to build sources for a trend
  const registerSources = (
    trendObj: ReturnType<typeof dataStore.registerObject>,
    tId: string,
    sources: Array<{
      platform: string;
      mentionCount: number;
      engagementRate: number;
      sampleUrl: string;
      collectedAt: string;
      sentimentBreakdown: string;
    }>,
  ) => {
    for (const s of sources) {
      const src = dataStore.registerObject(trendSource, {
        sourceId: randomUUID(),
        trendId: tId,
        platform: s.platform,
        mentionCount: s.mentionCount,
        engagementRate: s.engagementRate,
        sampleUrl: s.sampleUrl,
        collectedAt: s.collectedAt,
        sentimentBreakdown: s.sentimentBreakdown,
      });
      dataStore.registerLink(trendObj, "trendToSourcesSources", src, "trendToSourcesTrend");
    }
  };

  // --- Trend 01: Quiet Luxury ---
  registerSources(trend01, TREND_IDS.quietLuxury, [
    {
      platform: "instagram",
      mentionCount: 112000,
      engagementRate: 4.8,
      sampleUrl: "https://instagram.com/p/quiet-luxury-therow",
      collectedAt: "2026-03-28T10:00:00Z",
      sentimentBreakdown: "positive:72%,neutral:22%,negative:6%",
    },
    {
      platform: "tiktok",
      mentionCount: 89000,
      engagementRate: 6.2,
      sampleUrl: "https://tiktok.com/@styleguru/quiet-luxury",
      collectedAt: "2026-03-27T18:30:00Z",
      sentimentBreakdown: "positive:68%,neutral:24%,negative:8%",
    },
    {
      platform: "twitter",
      mentionCount: 41000,
      engagementRate: 2.1,
      sampleUrl: "https://twitter.com/fashioninsider/status/ql2026",
      collectedAt: "2026-03-26T14:15:00Z",
      sentimentBreakdown: "positive:65%,neutral:28%,negative:7%",
    },
    {
      platform: "news",
      mentionCount: 42000,
      engagementRate: 1.4,
      sampleUrl: "https://vogue.com/article/quiet-luxury-2026",
      collectedAt: "2026-03-25T09:00:00Z",
      sentimentBreakdown: "positive:80%,neutral:17%,negative:3%",
    },
  ]);

  // --- Trend 02: TikTok Microtrends ---
  registerSources(trend02, TREND_IDS.tiktokMicrotrends, [
    {
      platform: "tiktok",
      mentionCount: 980000,
      engagementRate: 8.7,
      sampleUrl: "https://tiktok.com/@viralstyle/microtrend-alert",
      collectedAt: "2026-03-29T20:00:00Z",
      sentimentBreakdown: "positive:55%,neutral:30%,negative:15%",
    },
    {
      platform: "instagram",
      mentionCount: 320000,
      engagementRate: 5.1,
      sampleUrl: "https://instagram.com/p/microtrend-roundup",
      collectedAt: "2026-03-28T16:45:00Z",
      sentimentBreakdown: "positive:52%,neutral:33%,negative:15%",
    },
    {
      platform: "twitter",
      mentionCount: 125000,
      engagementRate: 3.3,
      sampleUrl: "https://twitter.com/trendalert/microtrend-weekly",
      collectedAt: "2026-03-27T12:00:00Z",
      sentimentBreakdown: "positive:48%,neutral:35%,negative:17%",
    },
    {
      platform: "facebook",
      mentionCount: 95000,
      engagementRate: 1.9,
      sampleUrl: "https://facebook.com/groups/fashionfinds/microtrends",
      collectedAt: "2026-03-26T08:30:00Z",
      sentimentBreakdown: "positive:50%,neutral:37%,negative:13%",
    },
  ]);

  // --- Trend 03: Genderless Apparel ---
  registerSources(trend03, TREND_IDS.genderlessApparel, [
    {
      platform: "instagram",
      mentionCount: 38000,
      engagementRate: 5.4,
      sampleUrl: "https://instagram.com/p/genderless-collection",
      collectedAt: "2026-03-28T11:30:00Z",
      sentimentBreakdown: "positive:76%,neutral:18%,negative:6%",
    },
    {
      platform: "tiktok",
      mentionCount: 32000,
      engagementRate: 7.1,
      sampleUrl: "https://tiktok.com/@inclusivestyle/genderless",
      collectedAt: "2026-03-27T19:00:00Z",
      sentimentBreakdown: "positive:79%,neutral:16%,negative:5%",
    },
    {
      platform: "news",
      mentionCount: 18000,
      engagementRate: 1.2,
      sampleUrl: "https://businessoffashion.com/genderless-apparel-report",
      collectedAt: "2026-03-25T07:45:00Z",
      sentimentBreakdown: "positive:71%,neutral:24%,negative:5%",
    },
    {
      platform: "twitter",
      mentionCount: 10000,
      engagementRate: 2.6,
      sampleUrl: "https://twitter.com/fashionforward/genderless",
      collectedAt: "2026-03-24T15:00:00Z",
      sentimentBreakdown: "positive:73%,neutral:20%,negative:7%",
    },
  ]);

  // --- Trend 04: Recommerce & Resale ---
  registerSources(trend04, TREND_IDS.recommerceResale, [
    {
      platform: "instagram",
      mentionCount: 65000,
      engagementRate: 4.3,
      sampleUrl: "https://instagram.com/p/thredup-haul-2026",
      collectedAt: "2026-03-29T08:00:00Z",
      sentimentBreakdown: "positive:70%,neutral:23%,negative:7%",
    },
    {
      platform: "tiktok",
      mentionCount: 58000,
      engagementRate: 6.8,
      sampleUrl: "https://tiktok.com/@thriftflip/resale-tips",
      collectedAt: "2026-03-28T21:15:00Z",
      sentimentBreakdown: "positive:74%,neutral:19%,negative:7%",
    },
    {
      platform: "news",
      mentionCount: 42000,
      engagementRate: 1.6,
      sampleUrl: "https://reuters.com/sustainable-fashion-resale-surge",
      collectedAt: "2026-03-27T06:30:00Z",
      sentimentBreakdown: "positive:68%,neutral:27%,negative:5%",
    },
    {
      platform: "facebook",
      mentionCount: 30000,
      engagementRate: 2.1,
      sampleUrl: "https://facebook.com/marketplace/resale-trends",
      collectedAt: "2026-03-26T17:00:00Z",
      sentimentBreakdown: "positive:66%,neutral:26%,negative:8%",
    },
  ]);

  // --- Trend 05: Dopamine Dressing ---
  registerSources(trend05, TREND_IDS.dopamineDressing, [
    {
      platform: "instagram",
      mentionCount: 28000,
      engagementRate: 6.1,
      sampleUrl: "https://instagram.com/p/dopamine-color-inspo",
      collectedAt: "2026-03-28T13:00:00Z",
      sentimentBreakdown: "positive:85%,neutral:12%,negative:3%",
    },
    {
      platform: "tiktok",
      mentionCount: 22000,
      engagementRate: 7.9,
      sampleUrl: "https://tiktok.com/@colorqueen/dopamine-dressing",
      collectedAt: "2026-03-27T22:00:00Z",
      sentimentBreakdown: "positive:88%,neutral:9%,negative:3%",
    },
    {
      platform: "news",
      mentionCount: 12000,
      engagementRate: 1.1,
      sampleUrl: "https://elle.com/dopamine-dressing-spring-2026",
      collectedAt: "2026-03-26T10:30:00Z",
      sentimentBreakdown: "positive:82%,neutral:15%,negative:3%",
    },
  ]);

  // --- Trend 06: AI Travel Planning ---
  registerSources(trend06, TREND_IDS.aiTravelPlanning, [
    {
      platform: "twitter",
      mentionCount: 95000,
      engagementRate: 3.8,
      sampleUrl: "https://twitter.com/techcrunch/ai-travel-2026",
      collectedAt: "2026-03-29T11:00:00Z",
      sentimentBreakdown: "positive:60%,neutral:28%,negative:12%",
    },
    {
      platform: "tiktok",
      mentionCount: 88000,
      engagementRate: 5.6,
      sampleUrl: "https://tiktok.com/@travelhacker/ai-itinerary",
      collectedAt: "2026-03-28T19:45:00Z",
      sentimentBreakdown: "positive:63%,neutral:25%,negative:12%",
    },
    {
      platform: "news",
      mentionCount: 72000,
      engagementRate: 2.3,
      sampleUrl: "https://skift.com/ai-travel-planning-revolution",
      collectedAt: "2026-03-27T08:00:00Z",
      sentimentBreakdown: "positive:58%,neutral:32%,negative:10%",
    },
    {
      platform: "instagram",
      mentionCount: 55000,
      engagementRate: 4.1,
      sampleUrl: "https://instagram.com/p/ai-trip-planner-review",
      collectedAt: "2026-03-26T14:30:00Z",
      sentimentBreakdown: "positive:62%,neutral:27%,negative:11%",
    },
  ]);

  // --- Trend 07: Bleisure Travel ---
  registerSources(trend07, TREND_IDS.bleisureTravel, [
    {
      platform: "twitter",
      mentionCount: 52000,
      engagementRate: 2.5,
      sampleUrl: "https://twitter.com/biztraveler/bleisure-tips",
      collectedAt: "2026-03-28T09:30:00Z",
      sentimentBreakdown: "positive:66%,neutral:28%,negative:6%",
    },
    {
      platform: "news",
      mentionCount: 48000,
      engagementRate: 1.8,
      sampleUrl: "https://bloomberg.com/bleisure-travel-reshaping-hotels",
      collectedAt: "2026-03-27T07:00:00Z",
      sentimentBreakdown: "positive:70%,neutral:25%,negative:5%",
    },
    {
      platform: "instagram",
      mentionCount: 28000,
      engagementRate: 3.9,
      sampleUrl: "https://instagram.com/p/workcation-bali-setup",
      collectedAt: "2026-03-26T16:15:00Z",
      sentimentBreakdown: "positive:75%,neutral:20%,negative:5%",
    },
    {
      platform: "facebook",
      mentionCount: 14000,
      engagementRate: 1.5,
      sampleUrl: "https://facebook.com/groups/digitalnomads/bleisure",
      collectedAt: "2026-03-25T12:00:00Z",
      sentimentBreakdown: "positive:72%,neutral:23%,negative:5%",
    },
  ]);

  // --- Trend 08: Sustainable Tourism ---
  registerSources(trend08, TREND_IDS.sustainableTourism, [
    {
      platform: "instagram",
      mentionCount: 68000,
      engagementRate: 5.2,
      sampleUrl: "https://instagram.com/p/ecolodge-costa-rica",
      collectedAt: "2026-03-29T07:30:00Z",
      sentimentBreakdown: "positive:82%,neutral:14%,negative:4%",
    },
    {
      platform: "news",
      mentionCount: 55000,
      engagementRate: 2.0,
      sampleUrl: "https://nationalgeographic.com/regenerative-tourism",
      collectedAt: "2026-03-28T06:00:00Z",
      sentimentBreakdown: "positive:84%,neutral:13%,negative:3%",
    },
    {
      platform: "tiktok",
      mentionCount: 32000,
      engagementRate: 4.7,
      sampleUrl: "https://tiktok.com/@ecotravel/sustainable-stays",
      collectedAt: "2026-03-27T20:30:00Z",
      sentimentBreakdown: "positive:78%,neutral:17%,negative:5%",
    },
    {
      platform: "twitter",
      mentionCount: 20000,
      engagementRate: 2.8,
      sampleUrl: "https://twitter.com/greentravel/regen-tourism-data",
      collectedAt: "2026-03-26T11:45:00Z",
      sentimentBreakdown: "positive:80%,neutral:16%,negative:4%",
    },
  ]);

  // --- Trend 09: Experiential Dining ---
  registerSources(trend09, TREND_IDS.experientialDining, [
    {
      platform: "instagram",
      mentionCount: 42000,
      engagementRate: 7.3,
      sampleUrl: "https://instagram.com/p/immersive-dining-tokyo",
      collectedAt: "2026-03-28T22:00:00Z",
      sentimentBreakdown: "positive:80%,neutral:15%,negative:5%",
    },
    {
      platform: "tiktok",
      mentionCount: 26000,
      engagementRate: 8.1,
      sampleUrl: "https://tiktok.com/@foodieadventure/projection-dinner",
      collectedAt: "2026-03-27T17:30:00Z",
      sentimentBreakdown: "positive:83%,neutral:12%,negative:5%",
    },
    {
      platform: "news",
      mentionCount: 20000,
      engagementRate: 1.5,
      sampleUrl: "https://eater.com/immersive-dining-global-expansion",
      collectedAt: "2026-03-26T09:00:00Z",
      sentimentBreakdown: "positive:76%,neutral:19%,negative:5%",
    },
  ]);

  // --- Trend 10: Solo Female Travel ---
  registerSources(trend10, TREND_IDS.soloFemaleTravel, [
    {
      platform: "instagram",
      mentionCount: 52000,
      engagementRate: 5.8,
      sampleUrl: "https://instagram.com/p/solo-female-travel-guide",
      collectedAt: "2026-03-29T14:00:00Z",
      sentimentBreakdown: "positive:81%,neutral:14%,negative:5%",
    },
    {
      platform: "tiktok",
      mentionCount: 38000,
      engagementRate: 6.4,
      sampleUrl: "https://tiktok.com/@solotraveler/safety-tips",
      collectedAt: "2026-03-28T20:15:00Z",
      sentimentBreakdown: "positive:79%,neutral:15%,negative:6%",
    },
    {
      platform: "news",
      mentionCount: 22000,
      engagementRate: 1.7,
      sampleUrl: "https://cntraveler.com/solo-female-travel-boom",
      collectedAt: "2026-03-27T10:00:00Z",
      sentimentBreakdown: "positive:83%,neutral:13%,negative:4%",
    },
    {
      platform: "facebook",
      mentionCount: 14000,
      engagementRate: 2.3,
      sampleUrl: "https://facebook.com/groups/womenwhotravel",
      collectedAt: "2026-03-26T08:00:00Z",
      sentimentBreakdown: "positive:85%,neutral:11%,negative:4%",
    },
  ]);

  // --- Trend 11: Sustainable Packaging ---
  registerSources(trend11, TREND_IDS.sustainablePackaging, [
    {
      platform: "twitter",
      mentionCount: 78000,
      engagementRate: 2.9,
      sampleUrl: "https://twitter.com/packagingworld/sustainable-2026",
      collectedAt: "2026-03-29T06:00:00Z",
      sentimentBreakdown: "positive:70%,neutral:24%,negative:6%",
    },
    {
      platform: "news",
      mentionCount: 72000,
      engagementRate: 1.9,
      sampleUrl: "https://reuters.com/cpg-packaging-sustainability-mandates",
      collectedAt: "2026-03-28T07:30:00Z",
      sentimentBreakdown: "positive:68%,neutral:27%,negative:5%",
    },
    {
      platform: "instagram",
      mentionCount: 48000,
      engagementRate: 3.5,
      sampleUrl: "https://instagram.com/p/refillable-packaging-haul",
      collectedAt: "2026-03-27T15:00:00Z",
      sentimentBreakdown: "positive:75%,neutral:20%,negative:5%",
    },
    {
      platform: "tiktok",
      mentionCount: 32000,
      engagementRate: 5.2,
      sampleUrl: "https://tiktok.com/@ecowarrior/packaging-hacks",
      collectedAt: "2026-03-26T21:00:00Z",
      sentimentBreakdown: "positive:73%,neutral:21%,negative:6%",
    },
  ]);

  // --- Trend 12: Personalized Nutrition ---
  registerSources(trend12, TREND_IDS.personalizedNutrition, [
    {
      platform: "instagram",
      mentionCount: 56000,
      engagementRate: 4.6,
      sampleUrl: "https://instagram.com/p/dna-nutrition-plan",
      collectedAt: "2026-03-29T12:30:00Z",
      sentimentBreakdown: "positive:65%,neutral:26%,negative:9%",
    },
    {
      platform: "tiktok",
      mentionCount: 45000,
      engagementRate: 6.3,
      sampleUrl: "https://tiktok.com/@biohacker/personalized-supplements",
      collectedAt: "2026-03-28T17:00:00Z",
      sentimentBreakdown: "positive:62%,neutral:27%,negative:11%",
    },
    {
      platform: "news",
      mentionCount: 38000,
      engagementRate: 1.8,
      sampleUrl: "https://wired.com/personalized-nutrition-dna-boom",
      collectedAt: "2026-03-27T09:15:00Z",
      sentimentBreakdown: "positive:60%,neutral:30%,negative:10%",
    },
    {
      platform: "twitter",
      mentionCount: 28000,
      engagementRate: 2.4,
      sampleUrl: "https://twitter.com/healthtech/nutrition-ai-thread",
      collectedAt: "2026-03-26T13:45:00Z",
      sentimentBreakdown: "positive:63%,neutral:28%,negative:9%",
    },
  ]);

  // --- Trend 13: Smart Home Integration ---
  registerSources(trend13, TREND_IDS.smartHomeIntegration, [
    {
      platform: "twitter",
      mentionCount: 38000,
      engagementRate: 3.1,
      sampleUrl: "https://twitter.com/smarthomeweekly/matter-update",
      collectedAt: "2026-03-29T08:45:00Z",
      sentimentBreakdown: "positive:58%,neutral:30%,negative:12%",
    },
    {
      platform: "news",
      mentionCount: 32000,
      engagementRate: 1.6,
      sampleUrl: "https://theverge.com/matter-protocol-one-year-later",
      collectedAt: "2026-03-28T06:30:00Z",
      sentimentBreakdown: "positive:55%,neutral:33%,negative:12%",
    },
    {
      platform: "tiktok",
      mentionCount: 20000,
      engagementRate: 5.4,
      sampleUrl: "https://tiktok.com/@techtok/smart-home-setup-2026",
      collectedAt: "2026-03-27T21:00:00Z",
      sentimentBreakdown: "positive:61%,neutral:28%,negative:11%",
    },
    {
      platform: "instagram",
      mentionCount: 14000,
      engagementRate: 4.0,
      sampleUrl: "https://instagram.com/p/smart-home-matter-guide",
      collectedAt: "2026-03-26T15:30:00Z",
      sentimentBreakdown: "positive:59%,neutral:30%,negative:11%",
    },
  ]);

  // --- Trend 14: Clean Beauty ---
  registerSources(trend14, TREND_IDS.cleanBeauty, [
    {
      platform: "instagram",
      mentionCount: 82000,
      engagementRate: 5.7,
      sampleUrl: "https://instagram.com/p/clean-beauty-routine-2026",
      collectedAt: "2026-03-29T09:30:00Z",
      sentimentBreakdown: "positive:80%,neutral:15%,negative:5%",
    },
    {
      platform: "tiktok",
      mentionCount: 65000,
      engagementRate: 7.2,
      sampleUrl: "https://tiktok.com/@skincarescience/ingredient-check",
      collectedAt: "2026-03-28T23:00:00Z",
      sentimentBreakdown: "positive:78%,neutral:16%,negative:6%",
    },
    {
      platform: "news",
      mentionCount: 36000,
      engagementRate: 1.3,
      sampleUrl: "https://allure.com/clean-beauty-transparency-report",
      collectedAt: "2026-03-27T07:15:00Z",
      sentimentBreakdown: "positive:82%,neutral:14%,negative:4%",
    },
    {
      platform: "twitter",
      mentionCount: 20000,
      engagementRate: 2.5,
      sampleUrl: "https://twitter.com/beautyinsider/ewg-ratings",
      collectedAt: "2026-03-26T18:00:00Z",
      sentimentBreakdown: "positive:77%,neutral:18%,negative:5%",
    },
  ]);

  // =========================================================================
  // TREND DEMOGRAPHICS  (~3 per trend)
  // =========================================================================

  const registerDemographics = (
    trendObj: ReturnType<typeof dataStore.registerObject>,
    tId: string,
    demos: Array<{
      ageGroup: string;
      gender: string | undefined;
      location: string | undefined;
      affinityScore: number;
      engagementIndex: number;
      purchaseIntent: number;
      topInterests: string | undefined;
    }>,
  ) => {
    for (const d of demos) {
      const demo = dataStore.registerObject(trendDemographic, {
        demographicId: randomUUID(),
        trendId: tId,
        ageGroup: d.ageGroup,
        gender: d.gender,
        location: d.location,
        affinityScore: d.affinityScore,
        engagementIndex: d.engagementIndex,
        purchaseIntent: d.purchaseIntent,
        topInterests: d.topInterests,
      });
      dataStore.registerLink(trendObj, "trendToDemographicsDemographics", demo, "trendToDemographicsTrend");
    }
  };

  // --- Trend 01: Quiet Luxury ---
  registerDemographics(trend01, TREND_IDS.quietLuxury, [
    {
      ageGroup: "30-44",
      gender: "Female",
      location: "New York, USA",
      affinityScore: 0.92,
      engagementIndex: 8.4,
      purchaseIntent: 0.78,
      topInterests: "minimalism, designer fashion, investment pieces",
    },
    {
      ageGroup: "25-34",
      gender: "Male",
      location: "London, UK",
      affinityScore: 0.81,
      engagementIndex: 6.7,
      purchaseIntent: 0.65,
      topInterests: "menswear, tailoring, quality fabrics",
    },
    {
      ageGroup: "45-54",
      gender: "Female",
      location: "Milan, Italy",
      affinityScore: 0.88,
      engagementIndex: 5.9,
      purchaseIntent: 0.82,
      topInterests: "luxury brands, cashmere, artisan craftsmanship",
    },
  ]);

  // --- Trend 02: TikTok Microtrends ---
  registerDemographics(trend02, TREND_IDS.tiktokMicrotrends, [
    {
      ageGroup: "16-24",
      gender: "Female",
      location: "Los Angeles, USA",
      affinityScore: 0.95,
      engagementIndex: 9.6,
      purchaseIntent: 0.71,
      topInterests: "fast fashion, TikTok, social media styling",
    },
    {
      ageGroup: "16-24",
      gender: "Male",
      location: "Global",
      affinityScore: 0.82,
      engagementIndex: 8.1,
      purchaseIntent: 0.58,
      topInterests: "streetwear, sneakers, viral trends",
    },
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Sydney, Australia",
      affinityScore: 0.78,
      engagementIndex: 7.3,
      purchaseIntent: 0.62,
      topInterests: "affordable fashion, outfit inspo, influencer picks",
    },
  ]);

  // --- Trend 03: Genderless Apparel ---
  registerDemographics(trend03, TREND_IDS.genderlessApparel, [
    {
      ageGroup: "16-24",
      gender: "Non-binary",
      location: "San Francisco, USA",
      affinityScore: 0.94,
      engagementIndex: 9.1,
      purchaseIntent: 0.76,
      topInterests: "gender expression, inclusivity, streetwear",
    },
    {
      ageGroup: "25-34",
      gender: undefined,
      location: "Berlin, Germany",
      affinityScore: 0.87,
      engagementIndex: 7.8,
      purchaseIntent: 0.69,
      topInterests: "unisex brands, sustainable fashion, identity",
    },
    {
      ageGroup: "16-24",
      gender: "Female",
      location: "Toronto, Canada",
      affinityScore: 0.79,
      engagementIndex: 7.2,
      purchaseIntent: 0.61,
      topInterests: "oversized fits, androgynous style, thrift",
    },
  ]);

  // --- Trend 04: Recommerce & Resale ---
  registerDemographics(trend04, TREND_IDS.recommerceResale, [
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Chicago, USA",
      affinityScore: 0.89,
      engagementIndex: 8.0,
      purchaseIntent: 0.73,
      topInterests: "vintage, thrifting, sustainable living",
    },
    {
      ageGroup: "16-24",
      gender: "Female",
      location: "Global",
      affinityScore: 0.91,
      engagementIndex: 8.5,
      purchaseIntent: 0.68,
      topInterests: "Depop, secondhand luxury, upcycling",
    },
    {
      ageGroup: "35-44",
      gender: "Male",
      location: "Paris, France",
      affinityScore: 0.72,
      engagementIndex: 5.8,
      purchaseIntent: 0.59,
      topInterests: "luxury resale, watches, authenticated goods",
    },
  ]);

  // --- Trend 05: Dopamine Dressing ---
  registerDemographics(trend05, TREND_IDS.dopamineDressing, [
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "London, UK",
      affinityScore: 0.9,
      engagementIndex: 8.8,
      purchaseIntent: 0.74,
      topInterests: "bold prints, color theory, mood fashion",
    },
    {
      ageGroup: "16-24",
      gender: "Female",
      location: "Seoul, South Korea",
      affinityScore: 0.86,
      engagementIndex: 8.2,
      purchaseIntent: 0.7,
      topInterests: "K-fashion, neon, maximalism",
    },
  ]);

  // --- Trend 06: AI Travel Planning ---
  registerDemographics(trend06, TREND_IDS.aiTravelPlanning, [
    {
      ageGroup: "25-34",
      gender: "Male",
      location: "San Francisco, USA",
      affinityScore: 0.88,
      engagementIndex: 7.9,
      purchaseIntent: 0.72,
      topInterests: "tech, AI assistants, budget travel, automation",
    },
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Singapore",
      affinityScore: 0.84,
      engagementIndex: 7.5,
      purchaseIntent: 0.68,
      topInterests: "travel planning, itinerary apps, deal hunting",
    },
    {
      ageGroup: "35-44",
      gender: "Male",
      location: "London, UK",
      affinityScore: 0.76,
      engagementIndex: 6.3,
      purchaseIntent: 0.64,
      topInterests: "business travel, productivity, premium bookings",
    },
  ]);

  // --- Trend 07: Bleisure Travel ---
  registerDemographics(trend07, TREND_IDS.bleisureTravel, [
    {
      ageGroup: "30-44",
      gender: "Male",
      location: "Austin, USA",
      affinityScore: 0.85,
      engagementIndex: 7.2,
      purchaseIntent: 0.67,
      topInterests: "remote work, co-working, extended stays",
    },
    {
      ageGroup: "30-44",
      gender: "Female",
      location: "Amsterdam, Netherlands",
      affinityScore: 0.82,
      engagementIndex: 6.9,
      purchaseIntent: 0.65,
      topInterests: "work-life balance, boutique hotels, city exploration",
    },
    {
      ageGroup: "25-34",
      gender: "Male",
      location: "Dubai, UAE",
      affinityScore: 0.78,
      engagementIndex: 6.5,
      purchaseIntent: 0.6,
      topInterests: "luxury hotels, business lounges, networking",
    },
  ]);

  // --- Trend 08: Sustainable Tourism ---
  registerDemographics(trend08, TREND_IDS.sustainableTourism, [
    {
      ageGroup: "35-54",
      gender: "Female",
      location: "Zurich, Switzerland",
      affinityScore: 0.91,
      engagementIndex: 7.6,
      purchaseIntent: 0.79,
      topInterests: "eco-travel, wildlife conservation, organic stays",
    },
    {
      ageGroup: "25-34",
      gender: "Male",
      location: "Portland, USA",
      affinityScore: 0.86,
      engagementIndex: 7.1,
      purchaseIntent: 0.71,
      topInterests: "carbon offsetting, eco-lodges, hiking",
    },
    {
      ageGroup: "45-64",
      gender: "Female",
      location: "Stockholm, Sweden",
      affinityScore: 0.83,
      engagementIndex: 5.4,
      purchaseIntent: 0.75,
      topInterests: "luxury eco-resorts, cultural preservation, slow travel",
    },
  ]);

  // --- Trend 09: Experiential Dining ---
  registerDemographics(trend09, TREND_IDS.experientialDining, [
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Tokyo, Japan",
      affinityScore: 0.93,
      engagementIndex: 9.0,
      purchaseIntent: 0.81,
      topInterests: "fine dining, food photography, immersive experiences",
    },
    {
      ageGroup: "35-44",
      gender: "Male",
      location: "New York, USA",
      affinityScore: 0.85,
      engagementIndex: 7.4,
      purchaseIntent: 0.74,
      topInterests: "tasting menus, chef collaborations, wine pairing",
    },
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Bangkok, Thailand",
      affinityScore: 0.8,
      engagementIndex: 8.2,
      purchaseIntent: 0.66,
      topInterests: "street food tours, sensory dining, culinary travel",
    },
  ]);

  // --- Trend 10: Solo Female Travel ---
  registerDemographics(trend10, TREND_IDS.soloFemaleTravel, [
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Melbourne, Australia",
      affinityScore: 0.94,
      engagementIndex: 9.2,
      purchaseIntent: 0.77,
      topInterests: "solo adventure, safety apps, women-only hostels",
    },
    {
      ageGroup: "35-44",
      gender: "Female",
      location: "Denver, USA",
      affinityScore: 0.88,
      engagementIndex: 7.8,
      purchaseIntent: 0.72,
      topInterests: "wellness retreats, photography, cultural immersion",
    },
    {
      ageGroup: "18-24",
      gender: "Female",
      location: "Lisbon, Portugal",
      affinityScore: 0.82,
      engagementIndex: 8.4,
      purchaseIntent: 0.63,
      topInterests: "backpacking, budget travel, community platforms",
    },
  ]);

  // --- Trend 11: Sustainable Packaging ---
  registerDemographics(trend11, TREND_IDS.sustainablePackaging, [
    {
      ageGroup: "25-44",
      gender: "Female",
      location: "Seattle, USA",
      affinityScore: 0.87,
      engagementIndex: 7.3,
      purchaseIntent: 0.74,
      topInterests: "zero waste, refillable products, eco-conscious brands",
    },
    {
      ageGroup: "35-54",
      gender: "Male",
      location: "Munich, Germany",
      affinityScore: 0.79,
      engagementIndex: 6.1,
      purchaseIntent: 0.68,
      topInterests: "recyclable materials, EU regulations, CPG innovation",
    },
    {
      ageGroup: "18-24",
      gender: "Female",
      location: "Global",
      affinityScore: 0.91,
      engagementIndex: 8.6,
      purchaseIntent: 0.71,
      topInterests: "plastic-free, TikTok sustainability, brand accountability",
    },
  ]);

  // --- Trend 12: Personalized Nutrition ---
  registerDemographics(trend12, TREND_IDS.personalizedNutrition, [
    {
      ageGroup: "30-44",
      gender: "Male",
      location: "San Francisco, USA",
      affinityScore: 0.86,
      engagementIndex: 7.5,
      purchaseIntent: 0.77,
      topInterests: "biohacking, DNA testing, supplements, fitness",
    },
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Toronto, Canada",
      affinityScore: 0.83,
      engagementIndex: 7.1,
      purchaseIntent: 0.72,
      topInterests: "gut health, adaptogens, wellness routines",
    },
    {
      ageGroup: "45-64",
      gender: "Male",
      location: "Miami, USA",
      affinityScore: 0.74,
      engagementIndex: 5.3,
      purchaseIntent: 0.69,
      topInterests: "longevity, preventive health, functional foods",
    },
  ]);

  // --- Trend 13: Smart Home Integration ---
  registerDemographics(trend13, TREND_IDS.smartHomeIntegration, [
    {
      ageGroup: "25-34",
      gender: "Male",
      location: "Austin, USA",
      affinityScore: 0.89,
      engagementIndex: 8.0,
      purchaseIntent: 0.75,
      topInterests: "smart speakers, Matter devices, home automation",
    },
    {
      ageGroup: "35-44",
      gender: "Female",
      location: "Tokyo, Japan",
      affinityScore: 0.78,
      engagementIndex: 6.4,
      purchaseIntent: 0.67,
      topInterests: "home security, energy efficiency, voice assistants",
    },
    {
      ageGroup: "45-54",
      gender: "Male",
      location: "London, UK",
      affinityScore: 0.71,
      engagementIndex: 5.1,
      purchaseIntent: 0.62,
      topInterests: "home renovation, connected appliances, smart lighting",
    },
  ]);

  // --- Trend 14: Clean Beauty ---
  registerDemographics(trend14, TREND_IDS.cleanBeauty, [
    {
      ageGroup: "25-34",
      gender: "Female",
      location: "Los Angeles, USA",
      affinityScore: 0.93,
      engagementIndex: 9.1,
      purchaseIntent: 0.83,
      topInterests: "skincare routines, ingredient lists, EWG ratings",
    },
    {
      ageGroup: "18-24",
      gender: "Female",
      location: "Seoul, South Korea",
      affinityScore: 0.9,
      engagementIndex: 8.7,
      purchaseIntent: 0.79,
      topInterests: "K-beauty, glass skin, non-toxic products",
    },
    {
      ageGroup: "35-44",
      gender: "Female",
      location: "Paris, France",
      affinityScore: 0.82,
      engagementIndex: 6.5,
      purchaseIntent: 0.76,
      topInterests: "French pharmacy, clean fragrance, vegan beauty",
    },
  ]);

  // =========================================================================
  // MARKET RECOMMENDATIONS  (~2 per trend)
  // =========================================================================

  const registerRecs = (
    trendObj: ReturnType<typeof dataStore.registerObject>,
    tId: string,
    recs: Array<{
      title: string;
      description: string;
      productCategory: string;
      targetDemographic: string;
      confidenceScore: number;
      estimatedRevenuePotential: string;
      priority: string;
      status: string;
      createdAt: string;
      actionPlan: string;
    }>,
  ) => {
    for (const r of recs) {
      const rec = dataStore.registerObject(marketRecommendation, {
        recommendationId: randomUUID(),
        trendId: tId,
        title: r.title,
        description: r.description,
        productCategory: r.productCategory,
        targetDemographic: r.targetDemographic,
        confidenceScore: r.confidenceScore,
        estimatedRevenuePotential: r.estimatedRevenuePotential,
        priority: r.priority,
        status: r.status,
        createdAt: r.createdAt,
        actionPlan: r.actionPlan,
      });
      dataStore.registerLink(trendObj, "trendToRecommendationsRecommendations", rec, "trendToRecommendationsTrend");
    }
  };

  // --- Trend 01: Quiet Luxury ---
  registerRecs(trend01, TREND_IDS.quietLuxury, [
    {
      title: "Launch Capsule Collection with Italian Mill Partners",
      description:
        "Partner with Biella-based wool mills to develop a 12-piece capsule collection featuring unbranded cashmere-blend outerwear and knitwear targeting the stealth-wealth consumer.",
      productCategory: "Premium Outerwear",
      targetDemographic: "Women 30-44, high income",
      confidenceScore: 0.91,
      estimatedRevenuePotential: "$4.2M - $6.8M",
      priority: "high",
      status: "new",
      createdAt: "2026-03-28T14:00:00Z",
      actionPlan:
        "1. Identify 3 Italian mill partners by April 15\n2. Develop sample collection by May 30\n3. Soft launch via DTC channel in July\n4. Expand to Nordstrom/Saks in September",
    },
    {
      title: "Quiet Luxury Content Strategy for Instagram",
      description:
        "Develop an editorial content series showcasing understated styling with UGC from micro-influencers in the 50K-200K follower range, emphasizing craftsmanship and material stories.",
      productCategory: "Digital Marketing",
      targetDemographic: "Men & Women 25-45",
      confidenceScore: 0.85,
      estimatedRevenuePotential: "$1.5M - $2.8M (attributed revenue)",
      priority: "medium",
      status: "reviewed",
      createdAt: "2026-03-25T10:00:00Z",
      actionPlan:
        "1. Brief influencer agency on quiet-luxury aesthetic\n2. Recruit 15 micro-influencers by April 10\n3. Produce 30 posts + 10 Reels over 8 weeks\n4. Track engagement vs. conversion lift",
    },
  ]);

  // --- Trend 02: TikTok Microtrends ---
  registerRecs(trend02, TREND_IDS.tiktokMicrotrends, [
    {
      title: "Real-Time Trend Response Supply Chain",
      description:
        "Build a 72-hour design-to-shelf pipeline for TikTok-originated microtrends using on-demand manufacturing and pre-positioned fabric inventory.",
      productCategory: "Fast Fashion Operations",
      targetDemographic: "Women 16-24",
      confidenceScore: 0.82,
      estimatedRevenuePotential: "$8M - $15M annually",
      priority: "high",
      status: "new",
      createdAt: "2026-03-29T09:30:00Z",
      actionPlan:
        "1. Contract 2 on-demand manufacturers in Turkey/Vietnam\n2. Pre-stock top 20 fabric SKUs\n3. Deploy trend detection AI monitoring TikTok hourly\n4. Target 72-hr concept-to-ship for top signals",
    },
    {
      title: "TikTok Shop Integration for Viral Products",
      description:
        "Enable native TikTok Shop checkout for trending items with live-stream shopping events hosted by brand ambassadors during peak engagement windows.",
      productCategory: "Social Commerce",
      targetDemographic: "Gen Z, 16-24",
      confidenceScore: 0.88,
      estimatedRevenuePotential: "$3.5M - $7M",
      priority: "high",
      status: "accepted",
      createdAt: "2026-03-22T16:00:00Z",
      actionPlan:
        "1. Apply for TikTok Shop merchant program\n2. Onboard 5 brand ambassadors by April 5\n3. Schedule bi-weekly live shopping events\n4. A/B test pricing and bundle strategies",
    },
  ]);

  // --- Trend 03: Genderless Apparel ---
  registerRecs(trend03, TREND_IDS.genderlessApparel, [
    {
      title: "Unisex Basics Line Extension",
      description:
        "Expand the existing basics line with 8 gender-neutral SKUs including oversized tees, wide-leg trousers, and relaxed blazers in a muted earth-tone palette.",
      productCategory: "Apparel - Basics",
      targetDemographic: "All genders 16-34",
      confidenceScore: 0.8,
      estimatedRevenuePotential: "$2.1M - $3.5M",
      priority: "medium",
      status: "new",
      createdAt: "2026-03-27T11:15:00Z",
      actionPlan:
        "1. Finalize size-inclusive grading by April 20\n2. Source organic cotton and recycled polyester\n3. Photography with diverse casting\n4. Launch with pride month tie-in June 1",
    },
  ]);

  // --- Trend 04: Recommerce & Resale ---
  registerRecs(trend04, TREND_IDS.recommerceResale, [
    {
      title: "Certified Pre-Owned Loyalty Program",
      description:
        "Launch a brand-certified resale marketplace with trade-in credits, extending customer lifetime value and capturing the 35% of shoppers who currently resell on third-party platforms.",
      productCategory: "Resale Marketplace",
      targetDemographic: "Women 25-34",
      confidenceScore: 0.87,
      estimatedRevenuePotential: "$5M - $9M",
      priority: "high",
      status: "reviewed",
      createdAt: "2026-03-24T08:45:00Z",
      actionPlan:
        "1. Build trade-in portal on existing ecommerce platform\n2. Establish authentication and grading criteria\n3. Offer 20% store credit on trade-ins\n4. Market via email to existing customer base",
    },
    {
      title: "Vintage Curation Pop-Up Series",
      description:
        "Host quarterly pop-up events in 5 key cities featuring curated vintage pieces alongside new collection items, blending recommerce with brand storytelling.",
      productCategory: "Retail Experience",
      targetDemographic: "Adults 25-44",
      confidenceScore: 0.76,
      estimatedRevenuePotential: "$800K - $1.5M per event",
      priority: "medium",
      status: "new",
      createdAt: "2026-03-26T13:30:00Z",
      actionPlan:
        "1. Secure pop-up venues in NYC, LA, Chicago, London, Paris\n2. Source 200+ vintage pieces per location\n3. Partner with local vintage dealers\n4. Create immersive brand heritage installations",
    },
  ]);

  // --- Trend 05: Dopamine Dressing ---
  registerRecs(trend05, TREND_IDS.dopamineDressing, [
    {
      title: "Bold Color Limited Drops",
      description:
        "Release monthly limited-edition capsules in high-saturation color stories (electric fuchsia, citrine yellow, cobalt blue) to capture the dopamine-dressing momentum.",
      productCategory: "Apparel - Color Collections",
      targetDemographic: "Women 25-34",
      confidenceScore: 0.84,
      estimatedRevenuePotential: "$1.8M - $3.2M",
      priority: "medium",
      status: "new",
      createdAt: "2026-03-28T15:45:00Z",
      actionPlan:
        "1. Design 4 color-story capsules for Q2-Q3\n2. Limit each run to 500 units for scarcity\n3. Announce via Instagram countdown stickers\n4. Track sell-through velocity and sentiment",
    },
  ]);

  // --- Trend 06: AI Travel Planning ---
  registerRecs(trend06, TREND_IDS.aiTravelPlanning, [
    {
      title: "AI Concierge Integration for Hotel Chains",
      description:
        "Deploy a branded AI travel concierge across hotel websites and apps, offering personalized itinerary generation, local recommendations, and real-time rebooking during disruptions.",
      productCategory: "Travel Technology",
      targetDemographic: "Millennial travelers 25-44",
      confidenceScore: 0.89,
      estimatedRevenuePotential: "$12M - $20M (ancillary revenue)",
      priority: "high",
      status: "new",
      createdAt: "2026-03-29T07:00:00Z",
      actionPlan:
        "1. Select LLM provider and negotiate API pricing\n2. Integrate with PMS and booking engine\n3. Beta test with loyalty program members\n4. Full rollout across 200+ properties by Q4",
    },
    {
      title: "Predictive Pricing Newsletter",
      description:
        "Launch a weekly AI-driven newsletter that alerts subscribers to predicted fare drops and optimal booking windows for their saved destinations.",
      productCategory: "Digital Products",
      targetDemographic: "Budget-conscious travelers 25-34",
      confidenceScore: 0.79,
      estimatedRevenuePotential: "$2M - $4M (subscription + affiliate)",
      priority: "medium",
      status: "reviewed",
      createdAt: "2026-03-26T11:30:00Z",
      actionPlan:
        "1. Build price prediction model using historical fare data\n2. Design newsletter template and sign-up flow\n3. Seed with 50K subscribers from existing list\n4. Monetize via premium tier and affiliate links",
    },
  ]);

  // --- Trend 07: Bleisure Travel ---
  registerRecs(trend07, TREND_IDS.bleisureTravel, [
    {
      title: "Co-Working Floor Conversion Program",
      description:
        "Convert underutilized hotel meeting rooms into bookable co-working spaces with high-speed WiFi, standing desks, and barista service, targeting bleisure guests extending stays.",
      productCategory: "Hospitality Amenities",
      targetDemographic: "Business travelers 30-44",
      confidenceScore: 0.83,
      estimatedRevenuePotential: "$3M - $5.5M",
      priority: "high",
      status: "accepted",
      createdAt: "2026-03-20T09:00:00Z",
      actionPlan:
        "1. Audit meeting room utilization across portfolio\n2. Pilot in 10 properties with highest business-travel mix\n3. Install co-working furniture and tech infrastructure\n4. Bundle with extended-stay room rates",
    },
  ]);

  // --- Trend 08: Sustainable Tourism ---
  registerRecs(trend08, TREND_IDS.sustainableTourism, [
    {
      title: "Carbon-Neutral Stay Certification",
      description:
        "Develop a proprietary carbon-neutral certification for hotel stays, including measurable offsets, renewable energy sourcing, and guest-visible sustainability dashboards.",
      productCategory: "Sustainability Programs",
      targetDemographic: "Eco-conscious travelers 35-54",
      confidenceScore: 0.86,
      estimatedRevenuePotential: "$6M - $10M (premium rate uplift)",
      priority: "high",
      status: "new",
      createdAt: "2026-03-28T08:30:00Z",
      actionPlan:
        "1. Partner with verified carbon offset provider\n2. Audit energy and waste across 50 pilot properties\n3. Install guest-facing sustainability dashboards\n4. Market as premium green tier with 15% rate premium",
    },
    {
      title: "Regenerative Tourism Experience Packages",
      description:
        "Curate multi-day packages that include ecosystem restoration activities (coral planting, reforestation, wildlife monitoring) alongside luxury accommodation.",
      productCategory: "Travel Experiences",
      targetDemographic: "Luxury eco-travelers 35-64",
      confidenceScore: 0.81,
      estimatedRevenuePotential: "$2.5M - $4M",
      priority: "medium",
      status: "new",
      createdAt: "2026-03-27T14:00:00Z",
      actionPlan:
        "1. Identify 5 destination partners with active restoration projects\n2. Design 3-5 day itineraries with expert guides\n3. Price at 2x standard luxury package rates\n4. Launch with National Geographic co-branding",
    },
  ]);

  // --- Trend 09: Experiential Dining ---
  registerRecs(trend09, TREND_IDS.experientialDining, [
    {
      title: "Immersive Pop-Up Dining Series",
      description:
        "Launch a traveling immersive dining concept featuring projection-mapped courses, live music, and multi-sensory pairings in 8 cities across Asia-Pacific and North America.",
      productCategory: "Food & Beverage Experiences",
      targetDemographic: "Affluent foodies 25-44",
      confidenceScore: 0.84,
      estimatedRevenuePotential: "$4M - $7M",
      priority: "high",
      status: "new",
      createdAt: "2026-03-29T10:15:00Z",
      actionPlan:
        "1. Partner with 3 Michelin-starred chefs\n2. Commission projection art from digital artists\n3. Secure venues in Tokyo, Singapore, NYC, LA\n4. Sell tickets at $350-$500 per cover",
    },
  ]);

  // --- Trend 10: Solo Female Travel ---
  registerRecs(trend10, TREND_IDS.soloFemaleTravel, [
    {
      title: "Women-First Safety Feature Suite",
      description:
        "Build a suite of safety features for the booking app including verified female-friendly accommodations, real-time location sharing, 24/7 women's helpline, and solo traveler community forums.",
      productCategory: "Travel Technology",
      targetDemographic: "Women 25-44",
      confidenceScore: 0.9,
      estimatedRevenuePotential: "$8M - $14M",
      priority: "high",
      status: "reviewed",
      createdAt: "2026-03-25T12:00:00Z",
      actionPlan:
        "1. Define safety certification criteria with women travelers\n2. Audit and certify 500+ properties\n3. Build app features: SOS button, location sharing, community\n4. Launch marketing campaign with travel influencers",
    },
    {
      title: "Solo Traveler Curated Itineraries",
      description:
        "Create a library of 50+ expert-curated solo-traveler itineraries with safety ratings, female-tested restaurants, and community-vetted activities.",
      productCategory: "Content & Guides",
      targetDemographic: "Women 18-34",
      confidenceScore: 0.78,
      estimatedRevenuePotential: "$1.2M - $2M",
      priority: "medium",
      status: "new",
      createdAt: "2026-03-27T16:30:00Z",
      actionPlan:
        "1. Commission 50 itineraries from solo female travel writers\n2. Build interactive map-based guide format\n3. Integrate with booking for one-tap reservations\n4. Monetize via affiliate commissions and premium content",
    },
  ]);

  // --- Trend 11: Sustainable Packaging ---
  registerRecs(trend11, TREND_IDS.sustainablePackaging, [
    {
      title: "Refillable Packaging System Launch",
      description:
        "Introduce a refill-at-home system for top 20 SKUs with aluminum refill pods and a subscription model, reducing plastic waste by 80% per unit and increasing repeat purchase rates.",
      productCategory: "Packaging Innovation",
      targetDemographic: "Eco-conscious consumers 25-44",
      confidenceScore: 0.88,
      estimatedRevenuePotential: "$15M - $25M",
      priority: "high",
      status: "new",
      createdAt: "2026-03-28T10:00:00Z",
      actionPlan:
        "1. Design refillable vessel and aluminum pod system\n2. Pilot with 5 hero SKUs in Q2\n3. Launch subscription model at 15% discount vs. single-use\n4. Track refill rates and plastic reduction metrics",
    },
    {
      title: "Compostable E-Commerce Mailers",
      description:
        "Replace all polyethylene shipping mailers with certified compostable alternatives made from cornstarch and PBAT, aligning with 2028 sustainability commitments.",
      productCategory: "Supply Chain",
      targetDemographic: "Online shoppers, all demographics",
      confidenceScore: 0.82,
      estimatedRevenuePotential: "$3M - $5M (brand equity impact)",
      priority: "medium",
      status: "accepted",
      createdAt: "2026-03-18T07:30:00Z",
      actionPlan:
        "1. Source certified compostable mailer supplier\n2. Validate material durability and cost delta\n3. Phase in across all DTC shipments by June\n4. Add visible sustainability messaging on mailers",
    },
  ]);

  // --- Trend 12: Personalized Nutrition ---
  registerRecs(trend12, TREND_IDS.personalizedNutrition, [
    {
      title: "DNA-Based Supplement Subscription",
      description:
        "Launch a DTC subscription service that uses at-home DNA and microbiome tests to generate personalized daily supplement packs, with quarterly reformulation based on updated biomarkers.",
      productCategory: "Health Supplements",
      targetDemographic: "Health-conscious adults 30-44",
      confidenceScore: 0.85,
      estimatedRevenuePotential: "$10M - $18M",
      priority: "high",
      status: "new",
      createdAt: "2026-03-29T06:30:00Z",
      actionPlan:
        "1. Partner with CLIA-certified lab for DNA/microbiome kits\n2. Build recommendation algorithm with nutritional scientists\n3. Design custom daily pack packaging\n4. Launch with $99/mo subscription + $149 initial kit",
    },
    {
      title: "Functional Beverage Line - Adaptogens",
      description:
        "Develop a 6-SKU functional beverage line featuring ashwagandha, lion's mane, and reishi in ready-to-drink formats targeting the post-workout and afternoon-focus occasions.",
      productCategory: "Beverages",
      targetDemographic: "Active adults 25-34",
      confidenceScore: 0.81,
      estimatedRevenuePotential: "$5M - $8M",
      priority: "medium",
      status: "reviewed",
      createdAt: "2026-03-24T15:00:00Z",
      actionPlan:
        "1. Formulate with food scientists for taste optimization\n2. Source organic adaptogen ingredients\n3. Design shelf-ready packaging with clear benefits messaging\n4. Launch in Whole Foods and DTC simultaneously",
    },
  ]);

  // --- Trend 13: Smart Home Integration ---
  registerRecs(trend13, TREND_IDS.smartHomeIntegration, [
    {
      title: "Matter-Compatible Product Line Expansion",
      description:
        "Upgrade the existing smart home product line to full Matter protocol compatibility, enabling cross-ecosystem interoperability and capturing the 52% of consumers seeking unified control.",
      productCategory: "Smart Home Devices",
      targetDemographic: "Tech-forward homeowners 25-44",
      confidenceScore: 0.83,
      estimatedRevenuePotential: "$7M - $12M",
      priority: "high",
      status: "new",
      createdAt: "2026-03-28T12:00:00Z",
      actionPlan:
        "1. Audit current product line for Matter readiness\n2. Firmware updates for existing devices where possible\n3. Design 3 new Matter-native devices (hub, sensor, switch)\n4. Launch with Apple/Google/Amazon compatibility messaging",
    },
  ]);

  // --- Trend 14: Clean Beauty ---
  registerRecs(trend14, TREND_IDS.cleanBeauty, [
    {
      title: "Full Ingredient Transparency Platform",
      description:
        "Build a public-facing ingredient transparency portal with QR-scannable packaging linking to sourcing details, safety data, and third-party certifications for every product.",
      productCategory: "Beauty Technology",
      targetDemographic: "Women 25-44",
      confidenceScore: 0.87,
      estimatedRevenuePotential: "$4M - $7M (retention uplift)",
      priority: "high",
      status: "new",
      createdAt: "2026-03-29T08:00:00Z",
      actionPlan:
        "1. Catalog all ingredients with sourcing and safety data\n2. Build web portal and QR code scanning feature\n3. Redesign packaging with prominent QR placement\n4. Launch PR campaign around radical transparency",
    },
    {
      title: "EWG-Verified Product Line Expansion",
      description:
        "Reformulate 15 existing SKUs to meet EWG Verified standards and develop 5 new products in the clean sunscreen and clean fragrance categories.",
      productCategory: "Beauty & Skincare",
      targetDemographic: "Women 18-44",
      confidenceScore: 0.84,
      estimatedRevenuePotential: "$6M - $10M",
      priority: "high",
      status: "reviewed",
      createdAt: "2026-03-23T10:30:00Z",
      actionPlan:
        "1. Submit 15 SKUs for EWG Verified review\n2. Reformulate any flagged ingredients\n3. Develop 5 new clean sunscreen/fragrance SKUs\n4. Launch with Sephora Clean Beauty endcap placement",
    },
  ]);

  // =========================================================================
  // MARKET INSIGHTS  (10 dashboard-level KPIs and summaries)
  // =========================================================================

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Total Active Trends Detected",
    summary:
      "MarketPulse is currently tracking 14 active trends across fashion-retail, travel-hospitality, and consumer-products. 8 trends are in a growth phase, 3 are peaking, and 3 are emerging.",
    insightType: "kpi",
    industry: "all",
    metricValue: 14,
    metricUnit: "trends",
    changePercent: 27.3,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:00:00Z",
    relatedTrendIds: null,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Fashion-Retail Sentiment Surge",
    summary:
      "Average sentiment across fashion-retail trends rose to +0.74, a 12% increase from Q4 2025. Quiet Luxury and Genderless Apparel are driving the highest positive sentiment, while TikTok Microtrends show mixed reception due to fast trend churn.",
    insightType: "summary",
    industry: "fashion-retail",
    metricValue: 0.74,
    metricUnit: "sentiment score",
    changePercent: 12.0,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:05:00Z",
    relatedTrendIds: `${TREND_IDS.quietLuxury},${TREND_IDS.genderlessApparel},${TREND_IDS.tiktokMicrotrends}`,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "AI Travel Planning Adoption Alert",
    summary:
      "AI-Powered Travel Planning mentions have crossed 310K with a 58.4% growth rate, the fastest acceleration in the travel-hospitality vertical. Early-mover brands integrating AI concierges are seeing 23% higher booking conversion rates.",
    insightType: "alert",
    industry: "travel-hospitality",
    metricValue: 310000,
    metricUnit: "mentions",
    changePercent: 58.4,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:10:00Z",
    relatedTrendIds: TREND_IDS.aiTravelPlanning,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Sustainable Packaging Revenue Opportunity",
    summary:
      "The sustainable packaging trend presents an estimated $15M-$25M revenue opportunity through refillable systems alone. Brands launching refillable packaging are seeing a 12% brand loyalty uplift and 34% higher repeat purchase rates.",
    insightType: "opportunity",
    industry: "consumer-products",
    metricValue: 20,
    metricUnit: "$M (midpoint estimate)",
    changePercent: 26.9,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:15:00Z",
    relatedTrendIds: TREND_IDS.sustainablePackaging,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Total Social Mentions Across All Trends",
    summary:
      "Combined mention volume across all 14 tracked trends reached 3.4M in Q1 2026, a 31% increase over Q4 2025. TikTok and Instagram account for 68% of total volume.",
    insightType: "kpi",
    industry: "all",
    metricValue: 3404000,
    metricUnit: "mentions",
    changePercent: 31.0,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:20:00Z",
    relatedTrendIds: null,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "TikTok Microtrend Velocity Warning",
    summary:
      "TikTok-driven microtrends are peaking with 1.52M mentions but show a declining sentiment trajectory (-8% week-over-week). Brands should exercise caution with large inventory bets on current micro-cycles.",
    insightType: "alert",
    industry: "fashion-retail",
    metricValue: 1520000,
    metricUnit: "mentions",
    changePercent: -8.0,
    period: "Week of Mar 23, 2026",
    generatedAt: "2026-03-30T06:25:00Z",
    relatedTrendIds: TREND_IDS.tiktokMicrotrends,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Solo Female Travel Market Expansion",
    summary:
      "The solo female travel segment is growing at 17.3% annually with a $100B+ addressable market. Platforms investing in safety features and women-first experiences are capturing disproportionate market share.",
    insightType: "opportunity",
    industry: "travel-hospitality",
    metricValue: 100,
    metricUnit: "$B (addressable market)",
    changePercent: 17.3,
    period: "Annual 2025-2026",
    generatedAt: "2026-03-30T06:30:00Z",
    relatedTrendIds: TREND_IDS.soloFemaleTravel,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Clean Beauty Nearing Peak Maturity",
    summary:
      "Clean Beauty is approaching peak status with 203K mentions and decelerating growth (19.4%, down from 28% last quarter). Brands should focus on differentiation through ingredient transparency rather than broad clean claims.",
    insightType: "summary",
    industry: "consumer-products",
    metricValue: 203000,
    metricUnit: "mentions",
    changePercent: -8.6,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:35:00Z",
    relatedTrendIds: TREND_IDS.cleanBeauty,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Average Recommendation Confidence Score",
    summary:
      "AI-generated recommendations achieved an average confidence score of 0.84 across all 28 active recommendations, with travel-hospitality producing the highest confidence (0.87 avg) due to richer signal data.",
    insightType: "kpi",
    industry: "all",
    metricValue: 0.84,
    metricUnit: "confidence score",
    changePercent: 5.2,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:40:00Z",
    relatedTrendIds: null,
  });

  dataStore.registerObject(marketInsight, {
    insightId: randomUUID(),
    title: "Personalized Nutrition Growth Acceleration",
    summary:
      "Personalized nutrition is the fastest-growing consumer products trend with 38.1% growth rate. DNA-based supplement subscriptions represent the largest revenue opportunity at $10M-$18M, and functional beverages are gaining shelf space at major retailers.",
    insightType: "opportunity",
    industry: "consumer-products",
    metricValue: 38.1,
    metricUnit: "% growth rate",
    changePercent: 38.1,
    period: "Q1 2026",
    generatedAt: "2026-03-30T06:45:00Z",
    relatedTrendIds: TREND_IDS.personalizedNutrition,
  });
};
