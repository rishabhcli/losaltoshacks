import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOsdkObjects, marketTrend, marketInsight } from "@/lib/osdk-shims";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Eye, BarChart3 } from "lucide-react";
import { getTrendForecast, forecastColors } from "@/lib/trendForecast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { PipelineProgress } from "@/components/market/PipelineProgress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePreferences } from "@/hooks/usePreferences";
import { getIndustryLabel, INDUSTRY_OPTIONS } from "@/lib/industry";

export function Dashboard() {
  const { preferences } = usePreferences();
  const [activeIndustry, setActiveIndustry] = useState<string>(preferences.industry);
  const [showPipeline, setShowPipeline] = useState(true);
  const navigate = useNavigate();

  // Sync active industry tab when preferences change
  useEffect(() => {
    setActiveIndustry(preferences.industry);
  }, [preferences.industry]);

  // Load all trends
  const { data: trends, isLoading: trendsLoading } = useOsdkObjects(marketTrend, {
    orderBy: { trendScore: "desc" },
    pageSize: 50,
  });

  // Load all insights
  const { data: insights, isLoading: insightsLoading } = useOsdkObjects(marketInsight, {
    orderBy: { generatedAt: "desc" },
    pageSize: 50,
  });

  // Filter by industry
  const filteredTrends = useMemo(() => {
    if (!trends) return [];
    if (activeIndustry === "All") return trends;
    return trends.filter(t => t.industry === activeIndustry);
  }, [trends, activeIndustry]);

  // KPI insights — filtered by user's industry preference
  const kpiInsights = useMemo(() => {
    if (!insights) return [];
    let kpis = insights.filter(i => i.insightType === "kpi");
    if (activeIndustry !== "All") {
      kpis = kpis.filter(i => i.industry === activeIndustry || i.industry === "All");
    }
    return kpis;
  }, [insights, activeIndustry]);

  // Top 5 trends
  const topTrends = useMemo(() => {
    return filteredTrends.filter(t => t.status === "emerging" || t.status === "growing").slice(0, 5);
  }, [filteredTrends]);

  // Chart data — trends by detection date
  const chartData = useMemo(() => {
    if (!filteredTrends.length) return [];
    const sorted = [...filteredTrends].sort((a, b) => {
      const aDate = a.detectedAt ? new Date(a.detectedAt).getTime() : 0;
      const bDate = b.detectedAt ? new Date(b.detectedAt).getTime() : 0;
      return aDate - bDate;
    });
    return sorted.map(t => ({
      name: t.title ?? "Untitled",
      score: t.trendScore ?? 0,
      mentions: (t.mentionCount ?? 0) / 1000,
      date: t.detectedAt ? new Date(t.detectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    }));
  }, [filteredTrends]);

  // Latest insights (non-KPI) — filtered by industry preference
  const latestInsights = useMemo(() => {
    if (!insights) return [];
    let filtered = insights.filter(i => i.insightType !== "kpi");
    if (activeIndustry !== "All") {
      filtered = filtered.filter(i => i.industry === activeIndustry || i.industry === "All");
    }
    return filtered.slice(0, 6);
  }, [insights, activeIndustry]);

  if (trendsLoading && !trends) {
    return <LoadingState label="Scanning market signals" />;
  }

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <ScrollArea className="h-screen">
          <div className="p-6 lg:p-8 space-y-8 max-w-[1120px]">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
                {preferences.businessName
                  ? `Welcome back, ${preferences.businessName}`
                  : preferences.industry !== "All"
                    ? `MarketPulse \u2014 ${getIndustryLabel(preferences.industry)}`
                    : "MarketPulse"}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                {preferences.industry !== "All"
                  ? `AI-powered market intelligence for ${getIndustryLabel(preferences.industry)}`
                  : "AI-powered market intelligence"}
              </p>
            </div>

            {/* Industry filter tabs — only shown when preference is "All" */}
            {preferences.industry === "All" && (
              <div className="flex gap-0 border-b border-slate-200">
                {INDUSTRY_OPTIONS.filter(industry => industry.value !== "All").map(industry => (
                  <button
                    key={industry.value}
                    onClick={() => setActiveIndustry(industry.value)}
                    className={`px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                      activeIndustry === industry.value
                        ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {industry.label}
                  </button>
                ))}
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {kpiInsights.length > 0 ? (
                kpiInsights.slice(0, 4).map(kpi => <KpiCard key={kpi.$primaryKey} insight={kpi} />)
              ) : (
                <>
                  <SummaryKpiCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Active trends"
                    value={filteredTrends.length.toString()}
                    change={null}
                  />
                  <SummaryKpiCard
                    icon={<Zap className="w-4 h-4" />}
                    label="Avg trend score"
                    value={
                      filteredTrends.length > 0
                        ? (filteredTrends.reduce((s, t) => s + (t.trendScore ?? 0), 0) / filteredTrends.length).toFixed(
                            0,
                          )
                        : "0"
                    }
                    change={null}
                  />
                  <SummaryKpiCard
                    icon={<Eye className="w-4 h-4" />}
                    label="Total mentions"
                    value={formatNumber(filteredTrends.reduce((s, t) => s + (t.mentionCount ?? 0), 0))}
                    change={null}
                  />
                  <SummaryKpiCard
                    icon={<BarChart3 className="w-4 h-4" />}
                    label="Insights generated"
                    value={(insights?.length ?? 0).toString()}
                    change={null}
                  />
                </>
              )}
            </div>

            {/* Trend Velocity Chart */}
            <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h2 className="font-semibold text-lg text-slate-900 mb-1">Trend Velocity</h2>
              <p className="text-xs text-slate-400 mb-5">Score and momentum across detected trends</p>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Sans" }}
                      axisLine={{ stroke: "#E2E8F0" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Sans" }}
                      axisLine={{ stroke: "#E2E8F0" }}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        background: "#f0fdfa",
                        border: "1px solid #E2E8F0",
                        borderRadius: 8,
                        color: "#334155",
                        fontFamily: "DM Sans",
                        fontSize: 13,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#2563EB"
                      strokeWidth={2}
                      fill="url(#blueGrad)"
                      name="Trend Score"
                    />
                    <Area
                      type="monotone"
                      dataKey="mentions"
                      stroke="#93C5FD"
                      strokeWidth={1}
                      fillOpacity={0}
                      name="Mentions (K)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-slate-300 text-sm">
                  No trend data available
                </div>
              )}
            </div>

            {/* Top Emerging Trends */}
            <div>
              <h2 className="font-semibold text-lg text-slate-900 mb-4">Top Emerging Trends</h2>
              <div className="grid gap-3">
                {topTrends.length > 0 ? (
                  topTrends.map((trend, idx) => (
                    <button
                      key={trend.$primaryKey}
                      onClick={() => navigate(`/trends/${trend.trendId}`)}
                      className="flex items-center gap-4 p-4 border border-slate-200 bg-teal-50/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left group cursor-pointer"
                    >
                      <span className="font-semibold text-2xl text-slate-200 w-8 tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-800 truncate">{trend.title}</span>
                          <StatusBadge value={trend.status} />
                          <DashboardForecastBadge status={trend.status} growthRate={trend.growthRate} />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {getIndustryLabel(trend.industry ?? "")} &middot; {trend.category}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-2xl text-blue-600">{trend.trendScore?.toFixed(0)}</span>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Score</p>
                      </div>
                      {trend.growthRate != null && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          {trend.growthRate >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-500" />
                          )}
                          <span
                            className={`font-medium text-xs ${trend.growthRate >= 0 ? "text-emerald-500" : "text-red-500"}`}
                          >
                            {trend.growthRate.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-slate-300 text-sm py-4">No emerging trends detected</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right panel — Latest AI Insights */}
      <aside className="hidden lg:block w-80 xl:w-96 border-l border-white/30 bg-teal-50/80/70 backdrop-blur-xl">
        <ScrollArea className="h-screen">
          <div className="p-5">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Latest AI Insights</h2>
            {insightsLoading && !insights ? (
              <LoadingState label="Analyzing" />
            ) : latestInsights.length > 0 ? (
              <div className="space-y-3">
                {latestInsights.map(insight => (
                  <InsightCard key={insight.$primaryKey} insight={insight} />
                ))}
              </div>
            ) : (
              <p className="text-slate-300 text-sm">No insights yet</p>
            )}
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}

/* ---- Sub-components ---- */

interface KpiInsight {
  $primaryKey: string | number;
  title: string | undefined;
  metricValue: number | undefined;
  metricUnit: string | undefined;
  changePercent: number | undefined;
  period: string | undefined;
}

function KpiCard({ insight }: { insight: KpiInsight }) {
  const isPositive = (insight.changePercent ?? 0) >= 0;
  return (
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-2 truncate">{insight.title}</p>
      <p className="font-semibold text-[44px] leading-none text-slate-900 tabular-nums">
        {insight.metricValue != null ? formatNumber(insight.metricValue) : "--"}
      </p>
      <div className="flex items-center gap-1 mt-2">
        {insight.metricUnit && <span className="text-xs text-slate-400">{insight.metricUnit}</span>}
        {insight.changePercent != null && (
          <span
            className={`font-medium text-xs flex items-center gap-0.5 ${isPositive ? "text-emerald-500" : "text-red-500"}`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {insight.changePercent > 0 ? "+" : ""}
            {insight.changePercent.toFixed(1)}%
          </span>
        )}
      </div>
      {insight.period && <p className="text-[10px] text-slate-300 mt-1">{insight.period}</p>}
    </div>
  );
}

function SummaryKpiCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number | null;
}) {
  return (
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600">{icon}</span>
        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">{label}</p>
      </div>
      <p className="font-semibold text-[40px] lg:text-[44px] leading-none text-slate-900 tabular-nums">{value}</p>
      {change != null && (
        <span
          className={`font-medium text-xs flex items-center gap-0.5 mt-2 ${change >= 0 ? "text-emerald-500" : "text-red-500"}`}
        >
          {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

interface InsightObj {
  $primaryKey: string | number;
  title: string | undefined;
  summary: string | undefined;
  insightType: string | undefined;
  industry: string | undefined;
  generatedAt: string | undefined;
}

function InsightCard({ insight }: { insight: InsightObj }) {
  const typeColors: Record<string, string> = {
    alert: "text-red-500",
    opportunity: "text-emerald-500",
    summary: "text-slate-500",
    kpi: "text-amber-500",
  };

  return (
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-[10px] font-medium uppercase tracking-widest ${typeColors[insight.insightType ?? ""] ?? "text-slate-400"}`}
        >
          {insight.insightType}
        </span>
        <span className="text-[10px] text-slate-300">
          {insight.generatedAt ? new Date(insight.generatedAt).toLocaleDateString() : ""}
        </span>
      </div>
      <h3 className="font-semibold text-sm text-slate-800 mb-1">{insight.title}</h3>
      <p className="text-xs text-slate-500 line-clamp-3">{insight.summary}</p>
      {insight.industry && (
        <span className="inline-block mt-2 text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
          {getIndustryLabel(insight.industry)}
        </span>
      )}
    </div>
  );
}

function DashboardForecastBadge({
  status,
  growthRate,
}: {
  status: string | undefined;
  growthRate: number | undefined;
}) {
  const forecast = getTrendForecast(status, growthRate, undefined, undefined);
  const colors = forecastColors[forecast.type];
  const Icon = forecast.icon;

  return (
    <span
      className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${colors.bg} ${colors.text} shrink-0`}
    >
      <Icon className="w-3 h-3" />
      {forecast.label}
    </span>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toFixed(0);
}
