import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOsdkObjects, marketTrend } from "@/lib/osdk-shims";
import { Search, ArrowUpRight, ArrowDownRight, MessageCircle, TrendingUp } from "lucide-react";
import { getTrendForecast, forecastColors } from "@/lib/trendForecast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { usePreferences } from "@/hooks/usePreferences";
import { getIndustryLabel } from "@/lib/industry";

type SortField = "trendScore" | "mentionCount" | "growthRate";

export function TrendsExplorer() {
  const { preferences } = usePreferences();
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState(preferences.industry === "All" ? "all" : preferences.industry);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("trendScore");
  const navigate = useNavigate();

  const { data: trends, isLoading } = useOsdkObjects(marketTrend, {
    orderBy: { trendScore: "desc" },
    pageSize: 100,
  });

  const filteredTrends = useMemo(() => {
    if (!trends) return [];
    let result = [...trends];

    // Text search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        t =>
          (t.title ?? "").toLowerCase().includes(lower) ||
          (t.description ?? "").toLowerCase().includes(lower) ||
          (t.topKeywords ?? "").toLowerCase().includes(lower),
      );
    }

    // Industry filter
    if (industryFilter !== "all") {
      result = result.filter(t => t.industry === industryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(t => t.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return (bv as number) - (av as number);
    });

    return result;
  }, [trends, search, industryFilter, statusFilter, sortBy]);

  // Derive unique industries and statuses from data
  const industries = useMemo(() => {
    if (!trends) return [];
    return [...new Set(trends.map(t => t.industry).filter(Boolean))] as string[];
  }, [trends]);

  const statuses = useMemo(() => {
    if (!trends) return [];
    return [...new Set(trends.map(t => t.status).filter(Boolean))] as string[];
  }, [trends]);

  if (isLoading && !trends) {
    return <LoadingState label="Scanning trends" />;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1120px]">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Trends Explorer</h1>
          <p className="text-slate-500 text-sm mt-1">
            {filteredTrends.length} trend{filteredTrends.length !== 1 ? "s" : ""} detected across all sources
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <Input
              placeholder="Search trends..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-teal-50/80 border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-lg"
            />
          </div>

          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px] bg-teal-50/80 border-slate-200 text-slate-700 text-sm rounded-lg">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="bg-teal-50/80 border-slate-200 rounded-lg">
              <SelectItem value="all" className="text-sm text-slate-700">
                All Industries
              </SelectItem>
              {industries.map(ind => (
                <SelectItem key={ind} value={ind} className="text-sm text-slate-700">
                  {getIndustryLabel(ind)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-teal-50/80 border-slate-200 text-slate-700 text-sm rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-teal-50/80 border-slate-200 rounded-lg">
              <SelectItem value="all" className="text-sm text-slate-700">
                All Statuses
              </SelectItem>
              {statuses.map(st => (
                <SelectItem key={st} value={st} className="text-sm text-slate-700 capitalize">
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={v => setSortBy(v as SortField)}>
            <SelectTrigger className="w-[160px] bg-teal-50/80 border-slate-200 text-slate-700 text-sm rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-teal-50/80 border-slate-200 rounded-lg">
              <SelectItem value="trendScore" className="text-sm text-slate-700">
                Trend Score
              </SelectItem>
              <SelectItem value="mentionCount" className="text-sm text-slate-700">
                Mentions
              </SelectItem>
              <SelectItem value="growthRate" className="text-sm text-slate-700">
                Growth Rate
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trend grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTrends.map(trend => (
            <TrendCard key={trend.$primaryKey} trend={trend} onClick={() => navigate(`/trends/${trend.trendId}`)} />
          ))}
        </div>

        {filteredTrends.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-300">No trends match your filters</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface TrendObj {
  $primaryKey: string | number;
  title: string | undefined;
  industry: string | undefined;
  category: string | undefined;
  trendScore: number | undefined;
  status: string | undefined;
  mentionCount: number | undefined;
  growthRate: number | undefined;
  topKeywords: string | undefined;
  description: string | undefined;
  sentimentScore?: number | undefined;
}

function TrendCard({ trend, onClick }: { trend: TrendObj; onClick: () => void }) {
  const keywords =
    trend.topKeywords
      ?.split(",")
      .slice(0, 3)
      .map(k => k.trim()) ?? [];
  const growthPositive = (trend.growthRate ?? 0) >= 0;

  return (
    <button
      onClick={onClick}
      className="border border-slate-200 bg-teal-50/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left group cursor-pointer w-full"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors">
            {trend.title}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{getIndustryLabel(trend.industry ?? "")}</p>
        </div>
        <StatusBadge value={trend.status} />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{trend.description}</p>

      {/* Metrics row */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-blue-600" />
          <span className="font-semibold text-slate-800">{trend.trendScore?.toFixed(0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3 text-slate-400" />
          <span className="font-medium text-slate-500">{formatCompact(trend.mentionCount ?? 0)}</span>
        </div>
        {trend.growthRate != null && (
          <div className="flex items-center gap-0.5">
            {growthPositive ? (
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-red-500" />
            )}
            <span className={`font-medium ${growthPositive ? "text-emerald-500" : "text-red-500"}`}>
              {trend.growthRate.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Forecast badge */}
      <ForecastBadge status={trend.status} growthRate={trend.growthRate} />

      {/* Keywords */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {keywords.map(kw => (
            <span key={kw} className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              {kw}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function ForecastBadge({ status, growthRate }: { status: string | undefined; growthRate: number | undefined }) {
  const forecast = getTrendForecast(status, growthRate, undefined, undefined);
  const colors = forecastColors[forecast.type];
  const Icon = forecast.icon;

  return (
    <div className={`flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-md w-fit ${colors.bg}`}>
      <Icon className={`w-3 h-3 ${colors.iconColor}`} />
      <span className={`text-[11px] font-medium ${colors.text}`}>{forecast.label}</span>
    </div>
  );
}

function formatCompact(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}
