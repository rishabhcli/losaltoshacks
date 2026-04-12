// ============================================================
// Mock data — replaces Palantir OSDK / Foundry data layer
// All pages import from here via the osdk-shims hooks
// ============================================================

/** Generates an ISO date string for N hours ago from now */
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

export interface TrendSource {
  url: string;
  thumbnail?: string | null;
  platform: string;
  keywords: string;
  likes?: number;
  views?: number;
  comments?: number;
}

export interface MockTrend {
  $primaryKey: string;
  trendId: string;
  title: string;
  description: string;
  industry: string;
  category: string;
  status: string;
  trendScore: number;
  mentionCount: number;
  growthRate: number;
  sentimentScore: number;
  topKeywords: string;
  detectedAt: string;
  sources?: TrendSource[];
}

export interface MockInsight {
  $primaryKey: string;
  insightId: string;
  title: string;
  summary: string;
  insightType: string;
  industry: string;
  generatedAt: string;
  relatedTrendIds: string;
  // KPI fields
  metricValue?: number;
  metricUnit?: string;
  changePercent?: number;
  period?: string;
}

export interface MockRecommendation {
  $primaryKey: string;
  recommendationId: string;
  trendId: string;
  title: string;
  description: string;
  productCategory: string;
  targetDemographic: string;
  confidenceScore: number;
  estimatedRevenuePotential: string;
  priority: string;
  status: string;
  actionPlan: string;
  createdAt: string;
}

export interface MockSource {
  $primaryKey: string;
  platform: string;
  mentionCount: number;
  engagementRate: number;
  sentimentBreakdown: string;
  collectedAt: string;
  trendId: string;
}

export interface MockDemographic {
  $primaryKey: string;
  ageGroup: string;
  gender: string;
  location: string;
  affinityScore: number;
  engagementIndex: number;
  purchaseIntent: number;
  topInterests: string;
  trendId: string;
}

// ---- Trends ----
export const MOCK_TRENDS: MockTrend[] = [
  {
    $primaryKey: "t1", trendId: "t1",
    title: "Quiet Luxury Minimalism",
    description: "A shift toward understated, high-quality fashion that signals wealth through subtle craftsmanship rather than overt branding. Consumers are moving away from logo-heavy pieces toward timeless silhouettes and premium fabrics.",
    industry: "fashion-retail", category: "Apparel", status: "growing",
    trendScore: 92, mentionCount: 845000, growthRate: 34.2,
    sentimentScore: 0.72, topKeywords: "quiet luxury, old money, stealth wealth, minimalism, cashmere",
    detectedAt: hoursAgo(6),   // ~6 hours ago
  },
  {
    $primaryKey: "t2", trendId: "t2",
    title: "Workcation-Ready Travel Bundles",
    description: "Remote workers are blending business travel with leisure, demanding hotels and airlines that offer seamlessly integrated workspaces, high-speed connectivity, and extended-stay packages.",
    industry: "travel-hospitality", category: "Hotels & Lodging", status: "emerging",
    trendScore: 87, mentionCount: 620000, growthRate: 28.5,
    sentimentScore: 0.65, topKeywords: "workcation, bleisure, remote work, digital nomad, extended stay",
    detectedAt: hoursAgo(18),  // ~18 hours ago
  },
  {
    $primaryKey: "t3", trendId: "t3",
    title: "Adaptogenic Wellness Beverages",
    description: "Consumer interest in stress-relief drinks featuring adaptogens like ashwagandha, reishi, and lion's mane is skyrocketing, driven by wellness culture and the 'slow living' movement.",
    industry: "food-beverage", category: "Beverages", status: "growing",
    trendScore: 85, mentionCount: 512000, growthRate: 41.3,
    sentimentScore: 0.78, topKeywords: "adaptogens, ashwagandha, functional beverages, wellness, nootropics",
    detectedAt: hoursAgo(36),  // ~1.5 days ago
  },
  {
    $primaryKey: "t4", trendId: "t4",
    title: "Resale & Recommerce Acceleration",
    description: "Second-hand luxury platforms are experiencing explosive growth as Gen Z drives circular fashion values. Brands are launching in-house recommerce programs to capture margin and reduce returns.",
    industry: "fashion-retail", category: "Recommerce", status: "growing",
    trendScore: 83, mentionCount: 730000, growthRate: 29.1,
    sentimentScore: 0.63, topKeywords: "resale, recommerce, circular fashion, thrift, depop",
    detectedAt: hoursAgo(52),  // ~2 days ago
  },
  {
    $primaryKey: "t5", trendId: "t5",
    title: "Hyper-Local Culinary Experiences",
    description: "Travelers are increasingly seeking curated food-and-culture experiences that highlight local ingredients, heritage recipes, and artisan producers — moving away from generic hotel dining.",
    industry: "travel-hospitality", category: "Food & Beverage", status: "emerging",
    trendScore: 79, mentionCount: 340000, growthRate: 22.7,
    sentimentScore: 0.71, topKeywords: "farm-to-table, local cuisine, food tourism, artisan, heritage",
    detectedAt: hoursAgo(72),  // ~3 days ago
  },
  {
    $primaryKey: "t6", trendId: "t6",
    title: "AI-Curated Skincare Personalization",
    description: "Beauty brands are deploying AI diagnostics that analyze skin profiles to deliver bespoke formulations and routines. DTC brands are winning loyalty through data-driven personalization.",
    industry: "beauty-skincare", category: "Beauty & Skincare", status: "emerging",
    trendScore: 77, mentionCount: 490000, growthRate: 38.9,
    sentimentScore: 0.69, topKeywords: "AI skincare, personalization, custom formulation, beauty tech, skin analysis",
    detectedAt: hoursAgo(96),  // ~4 days ago
  },
  {
    $primaryKey: "t7", trendId: "t7",
    title: "Chromatic Maximalism in Accessories",
    description: "A backlash against quiet luxury is emerging, with bold color-blocking and oversized statement accessories dominating runway previews and social media. Younger consumers are leaning into joyful self-expression.",
    industry: "fashion-retail", category: "Accessories", status: "emerging",
    trendScore: 72, mentionCount: 280000, growthRate: 18.4,
    sentimentScore: 0.55, topKeywords: "color blocking, maximalism, statement accessories, bold fashion, Y2K",
    detectedAt: hoursAgo(120), // ~5 days ago
  },
  {
    $primaryKey: "t8", trendId: "t8",
    title: "Wellness Retreat & Digital Detox Packages",
    description: "Demand for no-phone, high-nature wellness retreats is surging among high-income millennials experiencing burnout. Spas converting to tech-free sanctuaries report 60%+ occupancy boosts.",
    industry: "wellness-fitness", category: "Wellness", status: "growing",
    trendScore: 81, mentionCount: 412000, growthRate: 31.6,
    sentimentScore: 0.82, topKeywords: "digital detox, wellness retreat, mindfulness, burnout recovery, spa",
    detectedAt: hoursAgo(132), // ~5.5 days ago
  },
  {
    $primaryKey: "t9", trendId: "t9",
    title: "Regenerative Ingredient Sourcing",
    description: "Consumer products companies are pivoting to regenerative agriculture sourcing to meet rising sustainability expectations. Brands marketing regenerative practices report 22% higher NPS vs. organic-only claims.",
    industry: "beauty-skincare", category: "Sustainability", status: "growing",
    trendScore: 76, mentionCount: 375000, growthRate: 26.4,
    sentimentScore: 0.74, topKeywords: "regenerative agriculture, sustainability, carbon-neutral, clean label, B-corp",
    detectedAt: hoursAgo(150), // ~6 days ago
  },
  {
    $primaryKey: "t10", trendId: "t10",
    title: "Capsule Wardrobe Tech-Wear",
    description: "Performance fabrics engineered for urban commuting are crossing into mainstream fashion. Gore-Tex blazers, self-cleaning textiles, and UV-protective streetwear are forming a new functional-fashion segment.",
    industry: "fashion-retail", category: "Technical Apparel", status: "emerging",
    trendScore: 68, mentionCount: 210000, growthRate: 15.2,
    sentimentScore: 0.58, topKeywords: "techwear, performance fabric, functional fashion, urban commuting, Gore-Tex",
    detectedAt: hoursAgo(162), // ~6.75 days ago
  },
  // ── New industries ──
  {
    $primaryKey: "t11", trendId: "t11",
    title: "AI-Powered Code Review Tools",
    description: "Developer teams are adopting AI code reviewers that catch bugs, security vulnerabilities, and style issues before human review. Adoption rates doubled in Q1 among mid-market SaaS companies.",
    industry: "tech-saas", category: "Developer Tools", status: "growing",
    trendScore: 91, mentionCount: 720000, growthRate: 52.1,
    sentimentScore: 0.81, topKeywords: "AI code review, developer productivity, DevOps, static analysis, copilot",
    detectedAt: hoursAgo(8),
  },
  {
    $primaryKey: "t12", trendId: "t12",
    title: "Vertical SaaS for Niche Industries",
    description: "Horizontal SaaS fatigue is driving demand for deeply specialized software built for specific trades — HVAC scheduling, dental practice management, trucking compliance — with 3x higher NPS than generic alternatives.",
    industry: "tech-saas", category: "Vertical SaaS", status: "emerging",
    trendScore: 78, mentionCount: 340000, growthRate: 29.8,
    sentimentScore: 0.69, topKeywords: "vertical SaaS, niche software, industry-specific, SMB, automation",
    detectedAt: hoursAgo(48),
  },
  {
    $primaryKey: "t13", trendId: "t13",
    title: "Remote Patient Monitoring Wearables",
    description: "FDA-cleared wearables for continuous glucose, blood pressure, and ECG monitoring are moving from hospital pilots to direct-to-consumer channels, enabled by reimbursement changes.",
    industry: "healthcare", category: "Wearables", status: "growing",
    trendScore: 88, mentionCount: 580000, growthRate: 38.7,
    sentimentScore: 0.76, topKeywords: "RPM, wearables, CGM, telehealth, remote monitoring, FDA",
    detectedAt: hoursAgo(12),
  },
  {
    $primaryKey: "t14", trendId: "t14",
    title: "AI Scribes for Clinical Documentation",
    description: "Ambient listening AI that auto-generates clinical notes during patient visits is reducing physician burnout and saving 2+ hours/day. Major EHR vendors are racing to integrate.",
    industry: "healthcare", category: "MedTech", status: "emerging",
    trendScore: 84, mentionCount: 410000, growthRate: 44.2,
    sentimentScore: 0.73, topKeywords: "AI scribe, clinical documentation, EHR, physician burnout, ambient AI",
    detectedAt: hoursAgo(30),
  },
  {
    $primaryKey: "t15", trendId: "t15",
    title: "Embedded Finance in Non-Financial Apps",
    description: "SaaS platforms, marketplaces, and gig economy apps are embedding lending, insurance, and payments directly into their UX, generating new revenue streams with 60%+ margins.",
    industry: "finance-fintech", category: "Payments", status: "growing",
    trendScore: 89, mentionCount: 650000, growthRate: 36.5,
    sentimentScore: 0.70, topKeywords: "embedded finance, BaaS, payments API, lending, insurance",
    detectedAt: hoursAgo(14),
  },
  {
    $primaryKey: "t16", trendId: "t16",
    title: "AI-Driven Personal Finance Coaches",
    description: "Chatbot-based financial advisors using LLMs to provide personalized budgeting, tax optimization, and investment guidance are seeing 5x user engagement vs traditional robo-advisors.",
    industry: "finance-fintech", category: "Personal Finance", status: "emerging",
    trendScore: 75, mentionCount: 290000, growthRate: 31.0,
    sentimentScore: 0.67, topKeywords: "AI financial advisor, personal finance, budgeting, robo-advisor, LLM",
    detectedAt: hoursAgo(60),
  },
  {
    $primaryKey: "t17", trendId: "t17",
    title: "PropTech Virtual Staging & Tours",
    description: "AI-generated virtual staging and 3D property tours are cutting listing times by 40% and reducing staging costs from $3K to under $100 per property.",
    industry: "real-estate", category: "PropTech", status: "growing",
    trendScore: 82, mentionCount: 380000, growthRate: 27.3,
    sentimentScore: 0.71, topKeywords: "virtual staging, 3D tour, PropTech, AI real estate, listing optimization",
    detectedAt: hoursAgo(20),
  },
  {
    $primaryKey: "t18", trendId: "t18",
    title: "Fractional Real Estate Investing Platforms",
    description: "Tokenized and fractional ownership platforms are democratizing commercial real estate investing with $50 minimums, attracting Gen Z and millennial investors priced out of traditional markets.",
    industry: "real-estate", category: "Investing", status: "emerging",
    trendScore: 72, mentionCount: 250000, growthRate: 22.8,
    sentimentScore: 0.63, topKeywords: "fractional investing, tokenized real estate, REIT, Gen Z investing",
    detectedAt: hoursAgo(72),
  },
  {
    $primaryKey: "t19", trendId: "t19",
    title: "AI Tutoring That Adapts in Real-Time",
    description: "Adaptive AI tutors that adjust difficulty, pacing, and teaching style based on student performance are showing 2x improvement in test scores vs static online courses.",
    industry: "education", category: "EdTech", status: "growing",
    trendScore: 86, mentionCount: 520000, growthRate: 40.1,
    sentimentScore: 0.79, topKeywords: "AI tutor, adaptive learning, personalized education, EdTech, LLM",
    detectedAt: hoursAgo(10),
  },
  {
    $primaryKey: "t20", trendId: "t20",
    title: "Micro-Credentials Over Degrees",
    description: "Employers are increasingly accepting industry micro-credentials and skill badges over traditional degrees, with 68% of hiring managers saying certifications matter more than diplomas for tech roles.",
    industry: "education", category: "Credentialing", status: "emerging",
    trendScore: 74, mentionCount: 310000, growthRate: 25.6,
    sentimentScore: 0.66, topKeywords: "micro-credentials, skill badges, certification, upskilling, hiring",
    detectedAt: hoursAgo(55),
  },
  {
    $primaryKey: "t21", trendId: "t21",
    title: "AI-Generated Short-Form Content at Scale",
    description: "Creator tools using AI to batch-produce TikTok, Reels, and Shorts content are enabling solo creators to publish 10x more, with AI handling editing, captioning, and A/B testing thumbnails.",
    industry: "entertainment-media", category: "Creator Economy", status: "growing",
    trendScore: 90, mentionCount: 810000, growthRate: 48.3,
    sentimentScore: 0.77, topKeywords: "AI content creation, short-form video, creator tools, TikTok, automation",
    detectedAt: hoursAgo(5),
  },
  {
    $primaryKey: "t22", trendId: "t22",
    title: "Interactive Live Shopping Events",
    description: "Live commerce combining entertainment, influencer hosting, and real-time purchasing is generating 10x higher conversion rates than traditional e-commerce in fashion and beauty categories.",
    industry: "entertainment-media", category: "Live Commerce", status: "emerging",
    trendScore: 79, mentionCount: 430000, growthRate: 33.7,
    sentimentScore: 0.72, topKeywords: "live shopping, social commerce, livestream, influencer, conversion",
    detectedAt: hoursAgo(40),
  },
];

// ---- Insights ----
export const MOCK_INSIGHTS: MockInsight[] = [
  // KPIs
  {
    $primaryKey: "i1", insightId: "i1", insightType: "kpi",
    title: "Avg Trend Score", metricValue: 80, metricUnit: "pts", changePercent: 12.3, period: "vs last month",
    summary: "Average trend score across all tracked markets.", industry: "All",
    generatedAt: "2025-04-01T08:00:00Z", relatedTrendIds: "",
  },
  {
    $primaryKey: "i2", insightId: "i2", insightType: "kpi",
    title: "Total Mentions", metricValue: 4814000, metricUnit: "mentions", changePercent: 8.7, period: "30d rolling",
    summary: "Total cross-platform mentions aggregated across all tracked trends.", industry: "All",
    generatedAt: "2025-04-01T08:00:00Z", relatedTrendIds: "",
  },
  {
    $primaryKey: "i3", insightId: "i3", insightType: "kpi",
    title: "Avg Growth Rate", metricValue: 28.6, metricUnit: "%", changePercent: 4.1, period: "30d rolling",
    summary: "Average growth rate across emerging and growing trends.", industry: "fashion-retail",
    generatedAt: "2025-04-01T08:00:00Z", relatedTrendIds: "",
  },
  {
    $primaryKey: "i4", insightId: "i4", insightType: "kpi",
    title: "Active Trends", metricValue: 10, metricUnit: "trends", changePercent: 25.0, period: "vs last quarter",
    summary: "Total number of active market trends being tracked.", industry: "beauty-skincare",
    generatedAt: "2025-04-01T08:00:00Z", relatedTrendIds: "",
  },
  // Opportunities
  {
    $primaryKey: "i5", insightId: "i5", insightType: "opportunity",
    title: "White Space in Quiet Luxury Footwear",
    summary: "Only 18% of quiet luxury market entrants have launched coordinated footwear lines, representing a $2.1B addressable gap. Competitor analysis shows minimal category overlap in the sub-$400 premium range.",
    industry: "fashion-retail", generatedAt: "2025-04-05T09:00:00Z", relatedTrendIds: "t1,t4",
  },
  {
    $primaryKey: "i6", insightId: "i6", insightType: "opportunity",
    title: "B2B Workcation Packages Untapped",
    summary: "Corporate travel managers actively looking for turnkey 'workcation' packages for remote teams. Only 12 major hotel chains offer purpose-built remote-work suites. First-mover advantage significant.",
    industry: "travel-hospitality", generatedAt: "2025-04-06T10:00:00Z", relatedTrendIds: "t2,t8",
  },
  {
    $primaryKey: "i7", insightId: "i7", insightType: "opportunity",
    title: "DTC Adaptogen Subscription Box Potential",
    summary: "Subscription wellness boxes featuring curated adaptogen products show 3.4x higher LTV vs one-time purchases. The category has <5% subscription penetration — major growth lever for CPG brands.",
    industry: "food-beverage", generatedAt: "2025-04-07T11:00:00Z", relatedTrendIds: "t3",
  },
  // Alerts
  {
    $primaryKey: "i8", insightId: "i8", insightType: "alert",
    title: "Fast Fashion Price War Intensifying",
    summary: "Major fast-fashion retailers are slashing prices by 30-40% on core SKUs, threatening mid-market brands. Gross margin compression of 8-12% projected across the fashion segment if trend continues through Q3.",
    industry: "fashion-retail", generatedAt: "2025-04-04T08:30:00Z", relatedTrendIds: "t4,t7",
  },
  {
    $primaryKey: "i9", insightId: "i9", insightType: "alert",
    title: "Plastic Regulation Impacting Packaging Supply Chain",
    summary: "New EU single-use plastics directives effective Q3 may impact 34% of consumer products packaging. Brands without alternative packaging solutions risk €500K+ compliance penalties and shelf delisting.",
    industry: "beauty-skincare", generatedAt: "2025-04-03T14:00:00Z", relatedTrendIds: "t9,t6",
  },
  // Summaries
  {
    $primaryKey: "i10", insightId: "i10", insightType: "summary",
    title: "Fashion & Retail Monthly Summary",
    summary: "Fashion markets showed strong momentum in Q1, led by quiet luxury (+34%) and recommerce (+29%). Sentiment remains positive. Key risk: macroeconomic pressure on mid-tier spending could shift volume to value segments.",
    industry: "fashion-retail", generatedAt: "2025-04-08T09:00:00Z", relatedTrendIds: "t1,t4,t7,t10",
  },
  {
    $primaryKey: "i11", insightId: "i11", insightType: "summary",
    title: "Travel & Hospitality Q1 Recap",
    summary: "Post-pandemic normalization complete. Business travel recovering faster than forecast (+22% YoY). Leisure travel shifting toward experiential and wellness verticals. Revenue per available room (RevPAR) up 14% in luxury segment.",
    industry: "travel-hospitality", generatedAt: "2025-04-08T09:30:00Z", relatedTrendIds: "t2,t5,t8",
  },
  {
    $primaryKey: "i12", insightId: "i12", insightType: "summary",
    title: "Wellness & Fitness Momentum Check",
    summary: "Consumers are shifting wellness spend toward immersive recovery formats rather than one-off classes. Retreats, sleep programs, and membership-based reset offerings are outperforming generic spa packages on both retention and premium pricing.",
    industry: "wellness-fitness", generatedAt: "2025-04-09T08:45:00Z", relatedTrendIds: "t8",
  },
  {
    $primaryKey: "i13", insightId: "i13", insightType: "summary",
    title: "Beauty & Skincare Trend Pulse",
    summary: "Beauty buyers are rewarding brands that combine clinical credibility with personalized routines and sustainable sourcing. Skin barrier messaging, refillable formats, and provenance-backed ingredients are increasing conversion across both DTC and retail discovery channels.",
    industry: "beauty-skincare", generatedAt: "2025-04-09T09:00:00Z", relatedTrendIds: "t6,t9",
  },
  {
    $primaryKey: "i14", insightId: "i14", insightType: "summary",
    title: "Food & Beverage Functional Category Recap",
    summary: "Functional beverages continue to outpace broader packaged beverage growth as consumers seek everyday mood, focus, and recovery support. Subscription, sampler packs, and creator-led education remain the strongest conversion levers for new entrants.",
    industry: "food-beverage", generatedAt: "2025-04-09T09:20:00Z", relatedTrendIds: "t3",
  },
  // ── New industry summaries ──
  {
    $primaryKey: "i15", insightId: "i15", insightType: "summary",
    title: "Tech & SaaS Market Pulse",
    summary: "AI-powered developer tools and vertical SaaS are the two fastest-growing segments. Teams are willing to pay premium pricing for tools that demonstrably save engineering hours, while niche industry software is beating horizontal competitors on retention and NPS.",
    industry: "tech-saas", generatedAt: "2025-04-09T10:00:00Z", relatedTrendIds: "t11,t12",
  },
  {
    $primaryKey: "i16", insightId: "i16", insightType: "summary",
    title: "Healthcare Digital Transformation",
    summary: "Remote patient monitoring and AI clinical documentation are converging to reshape care delivery. Reimbursement tailwinds and physician burnout are accelerating adoption faster than regulatory bodies can keep pace, creating first-mover advantages for compliant platforms.",
    industry: "healthcare", generatedAt: "2025-04-09T10:15:00Z", relatedTrendIds: "t13,t14",
  },
  {
    $primaryKey: "i17", insightId: "i17", insightType: "summary",
    title: "Finance & Fintech Innovation Recap",
    summary: "Embedded finance is becoming table stakes for any platform with transaction flow, while AI financial coaching is opening a new consumer segment that traditional robo-advisors missed. Regulation clarity in 2025 is unlocking previously cautious enterprise buyers.",
    industry: "finance-fintech", generatedAt: "2025-04-09T10:30:00Z", relatedTrendIds: "t15,t16",
  },
  {
    $primaryKey: "i18", insightId: "i18", insightType: "summary",
    title: "Real Estate Technology Outlook",
    summary: "PropTech is bifurcating into AI-powered marketing tools (virtual staging, automated listings) and democratized investing platforms. The former saves agents time, the latter unlocks new capital — both are growing 25%+ YoY with strong unit economics.",
    industry: "real-estate", generatedAt: "2025-04-09T10:45:00Z", relatedTrendIds: "t17,t18",
  },
  {
    $primaryKey: "i19", insightId: "i19", insightType: "summary",
    title: "Education & Upskilling Trends",
    summary: "Adaptive AI tutoring and micro-credentials are disrupting traditional education from both ends. Learners want personalized pacing and employers want proof of skills, not seat time. Platforms bridging both sides are seeing the highest LTV.",
    industry: "education", generatedAt: "2025-04-09T11:00:00Z", relatedTrendIds: "t19,t20",
  },
  {
    $primaryKey: "i20", insightId: "i20", insightType: "summary",
    title: "Entertainment & Media Creator Economy",
    summary: "AI content tools are enabling a new class of solo creators to compete with studio-level output. Live shopping is emerging as the highest-converting format for product-oriented content, blending entertainment with instant commerce.",
    industry: "entertainment-media", generatedAt: "2025-04-09T11:15:00Z", relatedTrendIds: "t21,t22",
  },
];

// ---- Recommendations ----
export const MOCK_RECOMMENDATIONS: MockRecommendation[] = [
  {
    $primaryKey: "r1", recommendationId: "r1", trendId: "t1",
    title: "Launch Quiet Luxury Essentials Collection",
    description: "Develop a 12-piece capsule targeting professional women 28-45 focused on neutral tones, premium fabrics, and no visible branding. Price point $180-$450.",
    productCategory: "Apparel", targetDemographic: "Professional Women 28-45",
    confidenceScore: 0.89, estimatedRevenuePotential: "$3.2M first year",
    priority: "high", status: "accepted",
    actionPlan: "Source cashmere and merino from certified suppliers. Partner with 3 micro-influencers in the #OldMoney space. Launch DTC-first with editorial photography shoot.",
    createdAt: "2025-04-06T10:00:00Z",
  },
  {
    $primaryKey: "r2", recommendationId: "r2", trendId: "t2",
    title: "Create Extended Stay Workcation Package",
    description: "Bundle complimentary high-speed Wi-Fi upgrade, ergonomic desk setup, daily credit for café purchases, and flex checkout times for stays of 5+ nights.",
    productCategory: "Hotel Packages", targetDemographic: "Remote Workers 25-40",
    confidenceScore: 0.84, estimatedRevenuePotential: "$1.8M additional hotel revenue",
    priority: "high", status: "new",
    actionPlan: "Retrofit 20% of room inventory with standing desks and monitor arms. Partner with local coworking spaces for day passes. Target digital nomad communities on LinkedIn and Reddit.",
    createdAt: "2025-04-05T11:00:00Z",
  },
  {
    $primaryKey: "r3", recommendationId: "r3", trendId: "t3",
    title: "Introduce Adaptogen RTD Drink Line",
    description: "Launch 4 SKUs of ready-to-drink adaptogenic beverages: Focus (lion's mane), Calm (ashwagandha), Energy (rhodiola), and Immunity (reishi). Target natural grocery and DTC channels.",
    productCategory: "Beverages", targetDemographic: "Health-Conscious Millennials",
    confidenceScore: 0.81, estimatedRevenuePotential: "$2.4M annual",
    priority: "high", status: "accepted",
    actionPlan: "Contract co-packer for 3 month pilot run. Apply for NSF certified-for-sport certification. Brief PR firm on functional wellness launch narrative.",
    createdAt: "2025-04-04T09:00:00Z",
  },
  {
    $primaryKey: "r4", recommendationId: "r4", trendId: "t4",
    title: "Partner with Recommerce Platform for Brand Resale",
    description: "Launch an authenticated resale program via The Real Real or Vestiaire Collective, capturing a 15% platform revenue share while extending brand lifecycle and attracting price-sensitive new customers.",
    productCategory: "Recommerce", targetDemographic: "Eco-Conscious Gen Z",
    confidenceScore: 0.76, estimatedRevenuePotential: "$900K cost savings",
    priority: "medium", status: "new",
    actionPlan: "Negotiate co-branded 'Certified Resale' page. Train CS team on authentication flow. Integrate resale program into loyalty points system.",
    createdAt: "2025-04-07T14:00:00Z",
  },
  {
    $primaryKey: "r5", recommendationId: "r5", trendId: "t8",
    title: "Launch Digital Detox Weekend Package",
    description: "Create a tech-free wellness experience: silent spa mornings, guided forest bathing, no-TV rooms, and analog activities (pottery, journaling, stargazing). Premium pricing at 2.2x standard room rate.",
    productCategory: "Wellness Packages", targetDemographic: "High-Income Millennials",
    confidenceScore: 0.79, estimatedRevenuePotential: "$1.1M additional bookings",
    priority: "high", status: "accepted",
    actionPlan: "Convert one wing (12 rooms) to analog-only. Train staff on silent service protocols. Market via mental health and mindfulness influencer partnerships.",
    createdAt: "2025-04-06T13:00:00Z",
  },
  {
    $primaryKey: "r6", recommendationId: "r6", trendId: "t5",
    title: "Curate Local Chef's Table Experiences",
    description: "Partner with 5 local farms and 3 heritage chefs to create monthly rotating farm-to-table dining nights. Offer as hotel package add-on or standalone booking.",
    productCategory: "F&B Experiences", targetDemographic: "Food Tourism Enthusiasts",
    confidenceScore: 0.72, estimatedRevenuePotential: "$600K food & dining revenue",
    priority: "medium", status: "accepted",
    actionPlan: "Source local pantry suppliers within 50-mile radius. Create storytelling content documenting each chef's heritage. Promote via Eater and local lifestyle publications.",
    createdAt: "2025-04-08T10:00:00Z",
  },
  {
    $primaryKey: "r7", recommendationId: "r7", trendId: "t6",
    title: "AI Skin Consultation At-Home Kit",
    description: "Develop a smartphone camera-based skin diagnostic tool that generates a personalized 6-product routine. Gate detailed results behind a $49 subscription; sample kit shipped free.",
    productCategory: "Beauty Tech", targetDemographic: "Beauty Enthusiasts 22-38",
    confidenceScore: 0.77, estimatedRevenuePotential: "$4.1M annual recurring revenue",
    priority: "high", status: "dismissed",
    actionPlan: "Partner with dermatology AI startup for model licensing. Prototype app in 3 months. Beta test with 1,000 loyal customers.",
    createdAt: "2025-04-03T12:00:00Z",
  },
  {
    $primaryKey: "r8", recommendationId: "r8", trendId: "t9",
    title: "Regenerative Farm Partnership Certification Program",
    description: "Co-launch a regenerative sourcing certification with 3 key ingredient suppliers, enabling on-pack 'Regenerative Certified' seal similar to Rainforest Alliance.",
    productCategory: "Sustainability", targetDemographic: "ESG-Driven Retailers & B2B Buyers",
    confidenceScore: 0.68, estimatedRevenuePotential: "$700K from premium retail partnerships",
    priority: "medium", status: "accepted",
    actionPlan: "Engage sustainability consulting firm for certification framework. Pilot with 2 suppliers. Brief retail buyers 6 months ahead of launch.",
    createdAt: "2025-04-02T10:00:00Z",
  },
  {
    $primaryKey: "r9", recommendationId: "r9", trendId: "t6",
    title: "Launch Barrier-First Routine Builder",
    description: "Package AI skin analysis with a barrier-repair starter routine, refill reminders, and dermatologist-backed education modules. Position the product line around skin resilience instead of aggressive active cycling.",
    productCategory: "Beauty & Skincare", targetDemographic: "Ingredient-Conscious Shoppers 20-40",
    confidenceScore: 0.83, estimatedRevenuePotential: "$2.9M direct-to-consumer sales",
    priority: "high", status: "accepted",
    actionPlan: "Bundle cleanser, serum, and moisturizer SKUs with guided onboarding. Rework PDP copy around skin barrier recovery. Test subscription replenishment at 45-day cadence.",
    createdAt: "2025-04-09T10:00:00Z",
  },
  {
    $primaryKey: "r10", recommendationId: "r10", trendId: "t8",
    title: "Build a Monthly Reset Membership",
    description: "Turn wellness retreat demand into recurring revenue with a membership that includes one guided reset weekend per quarter, monthly digital detox circles, and recovery coaching between visits.",
    productCategory: "Memberships", targetDemographic: "Burnout-Prone Professionals 30-50",
    confidenceScore: 0.8, estimatedRevenuePotential: "$1.6M recurring annual revenue",
    priority: "high", status: "new",
    actionPlan: "Pilot with existing retreat guests, price as premium annual membership, and add corporate wellness partnerships for team off-sites during low-occupancy periods.",
    createdAt: "2025-04-09T10:20:00Z",
  },
];

// ---- Sources (linked to trends) ----
export const MOCK_SOURCES: MockSource[] = [
  { $primaryKey: "s1", platform: "Instagram", mentionCount: 380000, engagementRate: 4.2, sentimentBreakdown: "72% positive, 18% neutral, 10% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t1" },
  { $primaryKey: "s2", platform: "TikTok", mentionCount: 290000, engagementRate: 7.8, sentimentBreakdown: "68% positive, 22% neutral, 10% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t1" },
  { $primaryKey: "s3", platform: "News", mentionCount: 175000, engagementRate: 1.2, sentimentBreakdown: "60% positive, 30% neutral, 10% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t1" },
  { $primaryKey: "s4", platform: "Twitter", mentionCount: 210000, engagementRate: 3.1, sentimentBreakdown: "55% positive, 25% neutral, 20% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t2" },
  { $primaryKey: "s5", platform: "News", mentionCount: 140000, engagementRate: 0.9, sentimentBreakdown: "70% positive, 20% neutral, 10% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t2" },
  { $primaryKey: "s6", platform: "Instagram", mentionCount: 270000, engagementRate: 5.9, sentimentBreakdown: "80% positive, 16% neutral, 4% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t3" },
  { $primaryKey: "s7", platform: "TikTok", mentionCount: 242000, engagementRate: 8.4, sentimentBreakdown: "76% positive, 18% neutral, 6% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t3" },
  { $primaryKey: "s8", platform: "YouTube", mentionCount: 168000, engagementRate: 6.1, sentimentBreakdown: "74% positive, 20% neutral, 6% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t6" },
  { $primaryKey: "s9", platform: "Instagram", mentionCount: 195000, engagementRate: 5.3, sentimentBreakdown: "82% positive, 13% neutral, 5% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t8" },
  { $primaryKey: "s10", platform: "News", mentionCount: 128000, engagementRate: 1.6, sentimentBreakdown: "69% positive, 24% neutral, 7% negative", collectedAt: "2025-04-08T07:00:00Z", trendId: "t9" },
];

// ---- Demographics (linked to trends) ----
export const MOCK_DEMOGRAPHICS: MockDemographic[] = [
  { $primaryKey: "d1", ageGroup: "25-34", gender: "Female", location: "USA", affinityScore: 0.84, engagementIndex: 7.2, purchaseIntent: 0.62, topInterests: "fashion, sustainability, investment dressing", trendId: "t1" },
  { $primaryKey: "d2", ageGroup: "35-44", gender: "Female", location: "UK", affinityScore: 0.79, engagementIndex: 6.1, purchaseIntent: 0.71, topInterests: "luxury goods, minimalism, classic style", trendId: "t1" },
  { $primaryKey: "d3", ageGroup: "25-34", gender: "All", location: "USA", affinityScore: 0.76, engagementIndex: 5.8, purchaseIntent: 0.55, topInterests: "remote work, travel, productivity", trendId: "t2" },
  { $primaryKey: "d4", ageGroup: "35-44", gender: "All", location: "Global", affinityScore: 0.71, engagementIndex: 4.9, purchaseIntent: 0.48, topInterests: "entrepreneurship, nomadic lifestyle, digital tools", trendId: "t2" },
  { $primaryKey: "d5", ageGroup: "22-34", gender: "All", location: "USA", affinityScore: 0.88, engagementIndex: 8.3, purchaseIntent: 0.67, topInterests: "wellness, yoga, meditation, health optimization", trendId: "t3" },
  { $primaryKey: "d6", ageGroup: "24-39", gender: "Female", location: "USA", affinityScore: 0.85, engagementIndex: 7.6, purchaseIntent: 0.73, topInterests: "dermatology, ingredients, beauty tech, skin health", trendId: "t6" },
  { $primaryKey: "d7", ageGroup: "30-49", gender: "All", location: "North America", affinityScore: 0.8, engagementIndex: 6.7, purchaseIntent: 0.61, topInterests: "burnout recovery, mindfulness, luxury travel, longevity", trendId: "t8" },
  { $primaryKey: "d8", ageGroup: "27-42", gender: "Female", location: "UK", affinityScore: 0.74, engagementIndex: 5.9, purchaseIntent: 0.58, topInterests: "clean beauty, sustainability, ingredient sourcing, refill systems", trendId: "t9" },
];
