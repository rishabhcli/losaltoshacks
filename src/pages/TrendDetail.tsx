import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOsdkObject, useOsdkAction, useLinks, $Actions, marketTrend } from "@/lib/osdk-shims";
import type { TrendSource } from "@/lib/mockData";
import {
  ArrowLeft,
  Bookmark,
  Globe,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
  MessageCircle,
  Info,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  Eye,
  Youtube,
  Loader2,
  BrainCircuit,
} from "lucide-react";
import { getTrendForecast, forecastColors } from "@/lib/trendForecast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { usePreferences } from "@/hooks/usePreferences";
import { useTheme } from "@/lib/theme";
import { getIndustryLabel } from "@/lib/industry";
import { generateTrendTimeSeries, type TimeFrame } from "@/lib/trendChartData";
import { ChartControls } from "@/components/market/ChartControls";
import { StabilityBadge } from "@/components/market/StabilityBadge";
import { useChartZoom } from "@/hooks/useChartZoom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export function TrendDetail() {
  const { trendId } = useParams<{ trendId: string }>();
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [timeFrame, setTimeFrame] = useState<TimeFrame>("7d");
  const [claudeAnalysis, setClaudeAnalysis] = useState<string | null>(null);
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [claudeModel, setClaudeModel] = useState<string | null>(null);

  const runClaudeAnalysis = async () => {
    if (!trend || claudeLoading) return;
    setClaudeLoading(true);
    setClaudeAnalysis(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trend.title,
          description: trend.description,
          keywords: trend.topKeywords,
          trendScore: trend.trendScore,
          growthRate: trend.growthRate,
          mentionCount: trend.mentionCount,
          industry: trend.industry,
        }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setClaudeAnalysis(data.analysis ?? "");
      setClaudeModel(data.model ?? null);
    } catch {
      setClaudeAnalysis("Analysis unavailable. Check that ANTHROPIC_API_KEY is set in the server environment.");
    } finally {
      setClaudeLoading(false);
    }
  };

  const { object: trend, isLoading: trendLoading } = useOsdkObject(marketTrend, trendId ?? "");

  // Load linked data
  const { links: sources, isLoading: sourcesLoading } = useLinks(trend, "trendToSourcesSources", {
    pageSize: 20,
  });

  const { links: recommendations, isLoading: recsLoading } = useLinks(trend, "trendToRecommendationsRecommendations", {
    pageSize: 20,
  });

  // Bookmark action
  const { applyAction: bookmarkAction, isPending: bookmarking } = useOsdkAction($Actions.bookmarkTrend);

  const handleBookmark = async (newStatus: string) => {
    if (!trend) return;
    await bookmarkAction({ trend: trend, status: newStatus });
    toast.success(`Trend marked as ${newStatus}`);
  };

  if (trendLoading && !trend) {
    return <LoadingState label="Loading trend" />;
  }

  if (!trend) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-300">Trend not found</p>
      </div>
    );
  }

  const sentimentLabel =
    trend.sentimentScore != null
      ? trend.sentimentScore > 0.3
        ? "Positive"
        : trend.sentimentScore < -0.3
          ? "Negative"
          : "Neutral"
      : "Unknown";
  const sentimentColor =
    trend.sentimentScore != null
      ? trend.sentimentScore > 0.3
        ? "text-emerald-500"
        : trend.sentimentScore < -0.3
          ? "text-red-500"
          : "text-slate-500"
      : "text-slate-400";

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-8 max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/trends")}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to trends
        </button>

        {/* Out-of-focus note */}
        {preferences.industry !== "All" && trend.industry && trend.industry !== preferences.industry && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-400">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              This trend is in <span className="font-semibold">{getIndustryLabel(trend.industry ?? "")}</span>, outside
              your focus area ({getIndustryLabel(preferences.industry)})
            </span>
          </div>
        )}

        {/* Hero section */}
        <div className="border border-slate-200 glass rounded-xl p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge value={trend.status} />
                <span className="text-xs text-slate-400">
                  {getIndustryLabel(trend.industry ?? "")} &middot; {trend.category}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900">{trend.title}</h1>
              <p className="text-slate-500 mt-2 max-w-2xl">{trend.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={runClaudeAnalysis}
                disabled={claudeLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
              >
                {claudeLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <BrainCircuit className="w-4 h-4" />
                )}
                {claudeLoading ? "Analyzing…" : "AI Deep Dive"}
              </button>
              <Button
                onClick={() => handleBookmark(trend.status === "emerging" ? "growing" : "emerging")}
                disabled={bookmarking}
                className="bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
              >
                <Bookmark className="w-4 h-4 mr-1" />
                {bookmarking ? "Saving..." : "Bookmark"}
              </Button>
            </div>
          </div>

          {/* Metric strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricBlock label="Trend Score" value={trend.trendScore?.toFixed(0) ?? "--"} accent />
            <MetricBlock label="Sentiment" value={sentimentLabel} valueClass={sentimentColor} />
            <MetricBlock label="Mentions" value={formatNumber(trend.mentionCount ?? 0)} />
            <MetricBlock
              label="Growth Rate"
              value={trend.growthRate != null ? `${trend.growthRate.toFixed(1)}%` : "--"}
              valueClass={(trend.growthRate ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}
              icon={
                (trend.growthRate ?? 0) >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )
              }
            />
          </div>

          {/* Keywords */}
          {trend.topKeywords && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {trend.topKeywords.split(",").map(kw => (
                <span
                  key={kw.trim()}
                  className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md"
                >
                  {kw.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stability Assessment */}
        <StabilityBadge
          trendId={trend.trendId ?? ""}
          score={trend.trendScore ?? 0}
          growthRate={trend.growthRate ?? 0}
          mentionCount={trend.mentionCount ?? 0}
          variant="full"
        />

        {/* Trend Score Chart */}
        <TrendChart
          trendId={trend.trendId ?? ""}
          score={trend.trendScore ?? 0}
          growthRate={trend.growthRate ?? 0}
          mentionCount={trend.mentionCount ?? 0}
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
          isDark={isDark}
        />

        {/* Trend Forecast */}
        <ForecastCard
          status={trend.status}
          growthRate={trend.growthRate}
          trendScore={trend.trendScore}
          sentimentScore={trend.sentimentScore}
        />

        {/* Claude AI Deep Dive */}
        {(claudeLoading || claudeAnalysis) && (
          <section className="border border-violet-200 dark:border-violet-800 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2.5 px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/30 border-b border-violet-200 dark:border-violet-800">
              <BrainCircuit className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="font-semibold text-sm text-violet-800 dark:text-violet-300">AI Deep Dive</span>
              <span className="text-[10px] font-medium text-violet-500 bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 rounded-full ml-auto">
                Powered by {claudeModel ?? "GPT-4o"}
              </span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900">
              {claudeLoading ? (
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  Claude is analyzing this trend…
                </div>
              ) : (
                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                  {claudeAnalysis?.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) {
                      return <h3 key={i} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-5 mb-2 first:mt-0">{line.slice(3)}</h3>;
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={i} className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{line.slice(2, -2)}</p>;
                    }
                    if (line.trim() === "") return <div key={i} className="h-1" />;
                    return <p key={i} className="text-sm text-slate-600 dark:text-slate-400 mb-1 leading-relaxed">{line}</p>;
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Sources breakdown */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-lg text-slate-900">Sources</h2>
          </div>
          {trend.sources && trend.sources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trend.sources.map((src, idx) => (
                <LiveSourceCard key={`${src.url}-${idx}`} source={src} />
              ))}
            </div>
          ) : sourcesLoading ? (
            <LoadingState label="Loading sources" />
          ) : (
            <p className="text-slate-400 text-sm py-4">No source links captured for this trend yet.</p>
          )}
        </section>

        {/* Recommendations */}
        <section className="pb-12">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-lg text-slate-900">AI Recommendations</h2>
          </div>
          {recsLoading && !recommendations ? (
            <LoadingState label="Loading recommendations" />
          ) : recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recommendations.map(rec => (
                <RecommendationCard key={rec.$primaryKey} rec={rec} />
              ))}
            </div>
          ) : (
            <p className="text-slate-300 text-sm py-4">No recommendations generated yet</p>
          )}
        </section>
      </div>
    </ScrollArea>
  );
}

/* ---- Sub-components ---- */

function MetricBlock({
  label,
  value,
  accent,
  valueClass,
  icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  valueClass?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        {icon}
        <span className={`font-semibold text-2xl ${accent ? "text-blue-600" : (valueClass ?? "text-slate-800")}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

const livePlatformIcons: Record<string, React.ReactNode> = {
  youtube: <Youtube className="w-3.5 h-3.5" />,
  x: <MessageCircle className="w-3.5 h-3.5" />,
  reddit: <MessageCircle className="w-3.5 h-3.5" />,
  substack: <Newspaper className="w-3.5 h-3.5" />,
  market_research: <Globe className="w-3.5 h-3.5" />,
};

const livePlatformColors: Record<string, string> = {
  youtube:         "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
  x:               "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  reddit:          "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800",
  substack:        "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800",
  market_research: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
};

function LiveSourceCard({ source }: { source: TrendSource }) {
  const platform = (source.platform ?? "unknown").toLowerCase();
  const badgeClass = livePlatformColors[platform] ?? "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  const icon = livePlatformIcons[platform] ?? <Globe className="w-3.5 h-3.5" />;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-slate-200 glass rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:border-blue-300 transition-all"
    >
      {/* Thumbnail */}
      {source.thumbnail ? (
        <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
          <img
            src={source.thumbnail}
            alt={source.keywords}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
          <Globe className="w-8 h-8 text-slate-300" />
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        {/* Platform badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}>
            {icon}
            {platform === "market_research" ? "Research" : platform}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>

        {/* Keywords */}
        {source.keywords && (
          <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-2">{source.keywords}</p>
        )}

        {/* Engagement */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          {(source.likes ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {formatNumber(source.likes ?? 0)}
            </span>
          )}
          {(source.views ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(source.views ?? 0)}
            </span>
          )}
          {(source.comments ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {formatNumber(source.comments ?? 0)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

interface RecObj {
  $primaryKey: string | number;
  title: string | undefined;
  description: string | undefined;
  confidenceScore: number | undefined;
  priority: string | undefined;
  productCategory: string | undefined;
  targetDemographic: string | undefined;
  actionPlan: string | undefined;
  estimatedRevenuePotential: string | undefined;
}

function RecommendationCard({ rec }: { rec: RecObj }) {
  return (
    <div className="border border-slate-200 glass rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-slate-800">{rec.title}</h3>
        <StatusBadge value={rec.priority} />
      </div>
      <p className="text-xs text-slate-500 mb-3">{rec.description}</p>
      <div className="flex flex-wrap gap-4 text-xs mb-3">
        <div>
          <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Confidence </span>
          <span className="font-semibold text-blue-600">
            {rec.confidenceScore != null ? `${(rec.confidenceScore * 100).toFixed(0)}%` : "--"}
          </span>
        </div>
        {rec.productCategory && (
          <div>
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Category </span>
            <span className="font-semibold text-slate-800">{rec.productCategory}</span>
          </div>
        )}
        {rec.estimatedRevenuePotential && (
          <div>
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Revenue </span>
            <span className="font-semibold text-emerald-500">{rec.estimatedRevenuePotential}</span>
          </div>
        )}
      </div>
      {rec.actionPlan && (
        <div className="border-t border-slate-200 pt-3 mt-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">Action plan</p>
          <p className="text-xs text-slate-500">{rec.actionPlan}</p>
        </div>
      )}
    </div>
  );
}

function ForecastCard({
  status,
  growthRate,
  trendScore,
  sentimentScore,
}: {
  status: string | undefined;
  growthRate: number | undefined;
  trendScore: number | undefined;
  sentimentScore: number | undefined;
}) {
  const forecast = getTrendForecast(status, growthRate, trendScore, sentimentScore);
  const colors = forecastColors[forecast.type];
  const Icon = forecast.icon;

  return (
    <div className={`rounded-xl border-l-4 p-5 ${colors.bg} ${colors.border} shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${colors.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className={`w-3.5 h-3.5 ${colors.iconColor}`} />
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Trend Forecast</span>
          </div>
          <h3 className={`font-semibold text-base ${colors.text}`}>{forecast.label}</h3>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">{forecast.message}</p>
        </div>
      </div>
    </div>
  );
}

function TrendChart({
  trendId,
  score,
  growthRate,
  mentionCount,
  timeFrame,
  onTimeFrameChange,
  isDark,
}: {
  trendId: string;
  score: number;
  growthRate: number;
  mentionCount: number;
  timeFrame: TimeFrame;
  onTimeFrameChange: (tf: TimeFrame) => void;
  isDark: boolean;
}) {
  const fullData = useMemo(
    () => generateTrendTimeSeries(trendId, score, growthRate, mentionCount, timeFrame),
    [trendId, score, growthRate, mentionCount, timeFrame],
  );
  const { visibleData, isZoomed, zoomIn, zoomOut, resetZoom } = useChartZoom(fullData);

  return (
    <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h2 className="font-semibold text-lg text-slate-900 mb-1">Trend Score Over Time</h2>
      <p className="text-xs text-slate-400 mb-2">Score and mention volume trajectory</p>
      <ChartControls
        timeFrame={timeFrame}
        onTimeFrameChange={onTimeFrameChange}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        isZoomed={isZoomed}
      />
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={visibleData}>
          <defs>
            <linearGradient id="trendDetailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#60a5fa" : "#1e40af"} stopOpacity={isDark ? 0.3 : 0.35} />
              <stop offset="100%" stopColor={isDark ? "#60a5fa" : "#1e40af"} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={isDark ? "#475569" : "#94A3B8"} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: isDark ? "#cbd5e1" : "#334155", fontSize: 11, fontFamily: "DM Sans", fontWeight: 500 }}
            axisLine={{ stroke: isDark ? "#475569" : "#94A3B8" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: isDark ? "#cbd5e1" : "#334155", fontSize: 11, fontFamily: "DM Sans", fontWeight: 500 }}
            axisLine={{ stroke: isDark ? "#475569" : "#94A3B8" }}
            tickLine={false}
          />
          <RechartsTooltip
            contentStyle={{
              background: isDark ? "rgba(30,41,59,0.90)" : "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              border: isDark ? "1px solid #475569" : "1px solid #CBD5E1",
              borderRadius: 8,
              color: isDark ? "#f1f5f9" : "#1e293b",
              fontFamily: "DM Sans",
              fontSize: 13,
              boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.30)" : "0 4px 12px rgba(0,0,0,0.10)",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={isDark ? "#60a5fa" : "#1e40af"}
            strokeWidth={3}
            fill="url(#trendDetailGrad)"
            dot={{ fill: isDark ? "#f472b6" : "#6d28d9", r: 5, strokeWidth: 0 }}
            activeDot={{ fill: isDark ? "#fb923c" : "#be185d", r: 7, strokeWidth: 0 }}
            name="Trend Score"
          />
          <Area
            type="monotone"
            dataKey="mentions"
            stroke={isDark ? "#c084fc" : "#7e22ce"}
            strokeWidth={2.5}
            fillOpacity={0}
            dot={{ fill: isDark ? "#facc15" : "#1e40af", r: 4, strokeWidth: 0 }}
            activeDot={{ fill: isDark ? "#f97316" : "#9333ea", r: 6, strokeWidth: 0 }}
            name="Mentions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}
