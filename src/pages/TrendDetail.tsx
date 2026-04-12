import { useParams, useNavigate } from "react-router-dom";
import { useOsdkObject, useOsdkAction, useLinks, $Actions, marketTrend } from "@/lib/osdk-shims";
import {
  ArrowLeft,
  Bookmark,
  Globe,
  Users,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Instagram,
  Facebook,
  Tv,
  Newspaper,
  MessageCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { getTrendForecast, forecastColors } from "@/lib/trendForecast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { toast } from "sonner";
import { usePreferences } from "@/hooks/usePreferences";
import { getIndustryLabel } from "@/lib/industry";

export function TrendDetail() {
  const { trendId } = useParams<{ trendId: string }>();
  const navigate = useNavigate();
  const { preferences } = usePreferences();

  const { object: trend, isLoading: trendLoading } = useOsdkObject(marketTrend, trendId ?? "");

  // Load linked data
  const { links: sources, isLoading: sourcesLoading } = useLinks(trend, "trendToSourcesSources", {
    pageSize: 20,
  });

  const { links: demographics, isLoading: demosLoading } = useLinks(trend, "trendToDemographicsDemographics", {
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
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              This trend is in <span className="font-semibold">{getIndustryLabel(trend.industry ?? "")}</span>, outside
              your focus area ({getIndustryLabel(preferences.industry)})
            </span>
          </div>
        )}

        {/* Hero section */}
        <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
            <Button
              onClick={() => handleBookmark(trend.status === "emerging" ? "growing" : "emerging")}
              disabled={bookmarking}
              className="bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
            >
              <Bookmark className="w-4 h-4 mr-1" />
              {bookmarking ? "Saving..." : "Bookmark"}
            </Button>
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

        {/* Trend Forecast */}
        <ForecastCard
          status={trend.status}
          growthRate={trend.growthRate}
          trendScore={trend.trendScore}
          sentimentScore={trend.sentimentScore}
        />

        {/* Sources breakdown */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-lg text-slate-900">Sources</h2>
          </div>
          {sourcesLoading && !sources ? (
            <LoadingState label="Loading sources" />
          ) : sources && sources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map(src => (
                <SourceCard key={src.$primaryKey} source={src} />
              ))}
            </div>
          ) : (
            <p className="text-slate-300 text-sm py-4">No source data available</p>
          )}
        </section>

        {/* Demographics */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-lg text-slate-900">Demographics</h2>
          </div>
          {demosLoading && !demographics ? (
            <LoadingState label="Loading demographics" />
          ) : demographics && demographics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demographics.map(demo => (
                <DemographicCard key={demo.$primaryKey} demo={demo} />
              ))}
            </div>
          ) : (
            <p className="text-slate-300 text-sm py-4">No demographic data available</p>
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

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  tiktok: <Tv className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  twitter: <MessageCircle className="w-4 h-4" />,
  news: <Newspaper className="w-4 h-4" />,
};

interface SourceObj {
  $primaryKey: string | number;
  platform: string | undefined;
  mentionCount: number | undefined;
  engagementRate: number | undefined;
  sentimentBreakdown: string | undefined;
  collectedAt: string | undefined;
}

function SourceCard({ source }: { source: SourceObj }) {
  const platform = (source.platform ?? "unknown").toLowerCase();
  return (
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-600">{platformIcons[platform] ?? <Globe className="w-4 h-4" />}</span>
        <span className="font-semibold text-sm text-slate-800 capitalize">{source.platform}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Mentions</p>
          <p className="font-semibold text-slate-800 text-lg">{formatNumber(source.mentionCount ?? 0)}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Engagement</p>
          <p className="font-semibold text-slate-800 text-lg">
            {source.engagementRate != null ? `${source.engagementRate.toFixed(1)}%` : "--"}
          </p>
        </div>
      </div>
      {source.sentimentBreakdown && (
        <p className="text-[10px] text-slate-300 mt-2 truncate">{source.sentimentBreakdown}</p>
      )}
    </div>
  );
}

interface DemoObj {
  $primaryKey: string | number;
  ageGroup: string | undefined;
  gender: string | undefined;
  location: string | undefined;
  affinityScore: number | undefined;
  engagementIndex: number | undefined;
  purchaseIntent: number | undefined;
  topInterests: string | undefined;
}

function DemographicCard({ demo }: { demo: DemoObj }) {
  return (
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-medium text-xs border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
          {demo.ageGroup}
        </span>
        {demo.gender && (
          <span className="font-medium text-xs border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
            {demo.gender}
          </span>
        )}
        {demo.location && <span className="text-[10px] text-slate-400">{demo.location}</span>}
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Affinity</p>
          <p className="font-semibold text-blue-600 text-lg">
            {demo.affinityScore != null ? `${(demo.affinityScore * 100).toFixed(0)}%` : "--"}
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Engagement</p>
          <p className="font-semibold text-slate-800 text-lg">{demo.engagementIndex?.toFixed(1) ?? "--"}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Purchase</p>
          <p className="font-semibold text-slate-800 text-lg">
            {demo.purchaseIntent != null ? `${(demo.purchaseIntent * 100).toFixed(0)}%` : "--"}
          </p>
        </div>
      </div>
      {demo.topInterests && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {demo.topInterests
            .split(",")
            .slice(0, 3)
            .map(interest => (
              <span
                key={interest.trim()}
                className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md"
              >
                {interest.trim()}
              </span>
            ))}
        </div>
      )}
    </div>
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
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
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

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}
