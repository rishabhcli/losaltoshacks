import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOsdkObjects, marketTrend } from "@/lib/osdk-shims";
import { Search, ArrowUpRight, ArrowDownRight, MessageCircle, TrendingUp, Sparkles, X } from "lucide-react";
import { getTrendForecast, forecastColors } from "@/lib/trendForecast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { usePreferences } from "@/hooks/usePreferences";
import { getIndustryLabel } from "@/lib/industry";
import { TrendSparkline } from "@/components/market/TrendSparkline";
import { StabilityBadge } from "@/components/market/StabilityBadge";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

type SortField = "trendScore" | "mentionCount" | "growthRate";

interface SemanticResult {
  keywords: string;
  source_url: string;
  thumbnail_url?: string;
  agent_id: number;
  likes?: number;
  views?: number;
  comments?: number;
  created_at: string;
  score: number;
}

export function TrendsExplorer() {
  const { preferences } = usePreferences();
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState(preferences.industry === "All" ? "all" : preferences.industry);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("trendScore");
  const [semanticQuery, setSemanticQuery] = useState("");
  const [semanticResults, setSemanticResults] = useState<SemanticResult[] | null>(null);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [semanticMode, setSemanticMode] = useState(false);
  const navigate = useNavigate();

  const runSemanticSearch = async (q: string) => {
    if (!q.trim()) return;
    setSemanticLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/search/semantic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 12 }),
      });
      if (!res.ok) throw new Error("Semantic search failed");
      const data = await res.json();
      setSemanticResults(data.results ?? []);
    } catch {
      setSemanticResults([]);
    } finally {
      setSemanticLoading(false);
    }
  };

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

    // Industry filter (industry === "All" on live trends means cross-industry)
    if (industryFilter !== "all") {
      result = result.filter(t => t.industry === industryFilter || t.industry === "All");
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Trends Explorer</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {filteredTrends.length} trend{filteredTrends.length !== 1 ? "s" : ""} detected across all sources
            </p>
          </div>
          <button
            onClick={() => { setSemanticMode(m => !m); setSemanticResults(null); setSemanticQuery(""); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors shrink-0 ${
              semanticMode
                ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Semantic Search
            {semanticMode && <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">ON</span>}
          </button>
        </div>

        {/* Semantic Search Panel — MongoDB Atlas Vector Search */}
        {semanticMode && (
          <div className="border border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              MongoDB Atlas Vector Search
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <input
                  placeholder="Describe what you're looking for… e.g. sustainable energy startups"
                  value={semanticQuery}
                  onChange={e => setSemanticQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runSemanticSearch(semanticQuery)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-violet-200 dark:border-violet-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <button
                onClick={() => runSemanticSearch(semanticQuery)}
                disabled={semanticLoading || !semanticQuery.trim()}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {semanticLoading ? "Searching…" : "Search"}
              </button>
              {semanticResults !== null && (
                <button onClick={() => { setSemanticResults(null); setSemanticQuery(""); }} className="px-2 py-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {semanticResults !== null && (
              <div>
                <p className="text-xs text-slate-500 mb-3">
                  {semanticResults.length} semantically similar signal{semanticResults.length !== 1 ? "s" : ""} found
                </p>
                {semanticResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {semanticResults.map((r, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 line-clamp-2">{r.keywords}</p>
                          <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded shrink-0">
                            {(r.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        {r.source_url && (
                          <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline truncate block">{r.source_url}</a>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          {(r.views ?? 0) > 0 && <span>{r.views?.toLocaleString()} views</span>}
                          {(r.likes ?? 0) > 0 && <span>{r.likes?.toLocaleString()} likes</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 py-2">No signals matched — try a different query or run a mission first to populate data.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search trends..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 glass border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg"
            />
          </div>

          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectItem value="all" className="text-sm">
                All Industries
              </SelectItem>
              {industries.map(ind => (
                <SelectItem key={ind} value={ind} className="text-sm">
                  {getIndustryLabel(ind)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectItem value="all" className="text-sm">
                All Statuses
              </SelectItem>
              {statuses.map(st => (
                <SelectItem key={st} value={st} className="text-sm capitalize">
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={v => setSortBy(v as SortField)}>
            <SelectTrigger className="w-[160px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectItem value="trendScore" className="text-sm">
                Trend Score
              </SelectItem>
              <SelectItem value="mentionCount" className="text-sm">
                Mentions
              </SelectItem>
              <SelectItem value="growthRate" className="text-sm">
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
      className="border border-slate-200 glass rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left group cursor-pointer w-full"
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

      {/* Sparkline */}
      <div className="mb-3">
        <TrendSparkline
          trendId={trend.$primaryKey as string}
          score={trend.trendScore ?? 0}
          growthRate={trend.growthRate ?? 0}
          mentionCount={trend.mentionCount ?? 0}
          height={48}
        />
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

      {/* Forecast + Stability badges */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <ForecastBadge status={trend.status} growthRate={trend.growthRate} />
        <StabilityBadge
          trendId={trend.$primaryKey as string}
          score={trend.trendScore ?? 0}
          growthRate={trend.growthRate ?? 0}
          mentionCount={trend.mentionCount ?? 0}
        />
      </div>

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
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md w-fit ${colors.bg}`}>
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
