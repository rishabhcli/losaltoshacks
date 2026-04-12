import { useState, useMemo } from "react";
import { useOsdkObjects, marketRecommendation, marketTrend } from "@/lib/osdk-shims";
import { usePreferences } from "@/hooks/usePreferences";
import { Lightbulb, Filter, Search } from "lucide-react";
import { VoiceButton } from "@/components/VoiceButton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { RecDetailModal, type RecObj } from "@/components/market/RecDetailModal";
import { getIndustryLabel } from "@/lib/industry";

export function Recommendations() {
  const { preferences } = usePreferences();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState<"all" | "matching">("matching");
  const [search, setSearch] = useState("");
  const [selectedRec, setSelectedRec] = useState<RecObj | null>(null);

  const { data: recommendations, isLoading } = useOsdkObjects(marketRecommendation, {
    pageSize: 100,
    industry: preferences.industry,
  });

  // Load trends for context
  const { data: trends } = useOsdkObjects(marketTrend, {
    pageSize: 100,
  });

  // Build a trendId -> { title, industry } map for context display and filtering
  const trendMap = useMemo(() => {
    const map = new Map<string, { title: string; industry: string }>();
    if (trends) {
      trends.forEach(t => {
        const trendId = (t as { trendId?: string }).trendId;
        const title = (t as { title?: string }).title;
        const industry = (t as { industry?: string }).industry;
        if (trendId && title) {
          map.set(trendId, { title, industry: industry ?? "" });
        }
      });
    }
    return map;
  }, [trends]);

  // Derived filter options
  const categories = useMemo(() => {
    if (!recommendations) return [];
    return [...new Set(recommendations.map(r => (r as { productCategory?: string }).productCategory).filter(Boolean))] as string[];
  }, [recommendations]);

  const filteredRecs = useMemo(() => {
    if (!recommendations) return [];
    let result = [...recommendations];

    // Only show recommendations the user hasn't acted on
    result = result.filter(r => {
      const status = (r as { status?: string }).status;
      return status === "new" || status === "reviewed" || status === "active";
    });

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(r => (r as { priority?: string }).priority === priorityFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(r => (r as { productCategory?: string }).productCategory === categoryFilter);
    }

    const userIndustry = preferences.industry;

    // Apply industry filter using model-tagged industry on each recommendation
    if (industryFilter === "matching" && userIndustry && userIndustry !== "All") {
      result = result.filter(r => {
        const ind = (r as { industry?: string }).industry ?? "All";
        return ind === userIndustry || ind === "All";
      });
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((r) => {
        const title = String((r as { title?: string }).title ?? "").toLowerCase();
        const desc = String((r as { description?: string }).description ?? "").toLowerCase();
        const cat = String((r as { productCategory?: string }).productCategory ?? "").toLowerCase();
        const demo = String((r as { targetDemographic?: string }).targetDemographic ?? "").toLowerCase();
        const plan = String((r as { actionPlan?: string }).actionPlan ?? "").toLowerCase();
        const rev = String((r as { estimatedRevenuePotential?: string }).estimatedRevenuePotential ?? "").toLowerCase();
        const indSlug = String((r as { industry?: string }).industry ?? "").toLowerCase();
        const indLabel = (r as { industry?: string }).industry
          ? getIndustryLabel((r as { industry?: string }).industry!).toLowerCase()
          : "";
        const recTrendId = (r as { trendId?: string }).trendId;
        const linkedTrend = String(trendMap.get(recTrendId ?? "")?.title ?? "").toLowerCase();
        return (
          title.includes(q) ||
          desc.includes(q) ||
          cat.includes(q) ||
          demo.includes(q) ||
          plan.includes(q) ||
          rev.includes(q) ||
          indSlug.includes(q) ||
          indLabel.includes(q) ||
          linkedTrend.includes(q)
        );
      });
    }

    // Sort: user's sector first, other specific sectors next, "All" last; then confidence
    result.sort((a, b) => {
      const aIndustry = (a as { industry?: string }).industry ?? "All";
      const bIndustry = (b as { industry?: string }).industry ?? "All";

      if (userIndustry && userIndustry !== "All") {
        const rank = (ind: string) => {
          if (ind === userIndustry) return 0;
          if (ind === "All") return 2;
          return 1;
        };
        const dr = rank(aIndustry) - rank(bIndustry);
        if (dr !== 0) return dr;
      }
      const aScore = (a as { confidenceScore?: number }).confidenceScore ?? 0;
      const bScore = (b as { confidenceScore?: number }).confidenceScore ?? 0;
      return bScore - aScore;
    });

    return result;
  }, [recommendations, priorityFilter, categoryFilter, industryFilter, preferences.industry, search, trendMap]);

  if (isLoading && !recommendations) {
    return <LoadingState label="Loading recommendations" />;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1120px]">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Recommendations</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {filteredRecs.length} AI-generated recommendation{filteredRecs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <Input
              placeholder="Search recommendations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 glass border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg"
              aria-label="Search recommendations"
            />
          </div>

          <div className="flex items-center gap-2 mr-1">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Filters:</span>
          </div>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectItem value="all" className="text-sm">All Priorities</SelectItem>
              <SelectItem value="high" className="text-sm">High</SelectItem>
              <SelectItem value="medium" className="text-sm">Medium</SelectItem>
              <SelectItem value="low" className="text-sm">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectItem value="all" className="text-sm">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-sm">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {preferences.industry && preferences.industry !== "All" && (
            <Select value={industryFilter} onValueChange={(v) => setIndustryFilter(v as "all" | "matching")}>
              <SelectTrigger className="w-[180px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 dark:border-slate-700 rounded-lg">
                <SelectItem value="matching" className="text-sm">
                  Matching: {getIndustryLabel(preferences.industry)}
                </SelectItem>
                <SelectItem value="all" className="text-sm">All Industries</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Recommendation grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRecs.map(rec => {
            const recTrendId = (rec as { trendId?: string }).trendId;
            return (
              <RecCard
                key={rec.$primaryKey as string}
                rec={rec as { $primaryKey: string | number; title?: string; description?: string; confidenceScore?: number; estimatedRevenuePotential?: string; priority?: string; industry?: string }}
                trendTitle={trendMap.get(recTrendId ?? "")?.title ?? null}
                onClick={() => setSelectedRec(rec as RecObj)}
              />
            );
          })}
        </div>

        {filteredRecs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400">
              No recommendations match your filters{search.trim() ? " or search" : ""}
            </p>
          </div>
        )}
      </div>

      <RecDetailModal
        rec={selectedRec}
        trendTitle={selectedRec ? (trendMap.get((selectedRec as { trendId?: string }).trendId ?? "")?.title ?? null) : null}
        action={{ type: "accept-or-dismiss" }}
        onClose={() => setSelectedRec(null)}
      />
    </ScrollArea>
  );
}

function RecCard({ rec, trendTitle, onClick }: { rec: { $primaryKey: string | number; title?: string; description?: string; confidenceScore?: number; estimatedRevenuePotential?: string; priority?: string; industry?: string }; trendTitle: string | null; onClick: () => void }) {
  const industryLabel = rec.industry ? getIndustryLabel(rec.industry) : null;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="border border-slate-200 glass rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left cursor-pointer w-full"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{rec.title}</h3>
          {(industryLabel || trendTitle) && (
            <p className="text-[10px] text-slate-400 mt-0.5 space-x-1">
              {industryLabel && (
                <span className="text-slate-500 dark:text-slate-400">{industryLabel}</span>
              )}
              {industryLabel && trendTitle ? <span className="text-slate-300">·</span> : null}
              {trendTitle && (
                <span>
                  Linked: <span className="text-blue-600 font-medium">{trendTitle}</span>
                </span>
              )}
            </p>
          )}
        </div>
        <StatusBadge value={rec.priority} />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{rec.description}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-blue-600">
            {rec.confidenceScore != null ? `${(rec.confidenceScore * 100).toFixed(0)}% confidence` : ""}
          </span>
          {rec.estimatedRevenuePotential && (
            <span className="font-semibold text-emerald-500">{rec.estimatedRevenuePotential}</span>
          )}
        </div>
        <div onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} role="presentation">
          <VoiceButton
            size="sm"
            label="Read"
            getText={() =>
              `${rec.title ?? ""}. ${rec.description ?? ""}. ${
                rec.confidenceScore != null
                  ? `Confidence: ${(rec.confidenceScore * 100).toFixed(0)} percent.`
                  : ""
              } ${rec.estimatedRevenuePotential ? `Estimated revenue: ${rec.estimatedRevenuePotential}.` : ""}`
            }
          />
        </div>
      </div>
    </div>
  );
}
