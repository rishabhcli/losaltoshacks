import { useState, useMemo } from "react";
import { useOsdkObjects, marketRecommendation, marketTrend } from "@/lib/osdk-shims";
import { Lightbulb } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { RecDetailModal, type RecObj } from "@/components/market/RecDetailModal";
import { usePreferences } from "@/hooks/usePreferences";

export function Recommendations() {
  const { preferences } = usePreferences();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedRec, setSelectedRec] = useState<RecObj | null>(null);

  const { data: recommendations, isLoading } = useOsdkObjects(marketRecommendation, {
    orderBy: { confidenceScore: "desc" },
    pageSize: 100,
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
        if (t.trendId && t.title) {
          map.set(t.trendId, { title: t.title, industry: t.industry ?? "" });
        }
      });
    }
    return map;
  }, [trends]);

  // Derived filter options
  const categories = useMemo(() => {
    if (!recommendations) return [];
    return [...new Set(recommendations.map(r => r.productCategory).filter(Boolean))] as string[];
  }, [recommendations]);

  const filteredRecs = useMemo(() => {
    if (!recommendations) return [];
    let result = [...recommendations];

    // Only show recommendations the user hasn't acted on
    result = result.filter(r => r.status === "new" || r.status === "reviewed" || r.status === "active");

    // Filter by user's preferred industry (cross-reference via trend)
    if (preferences.industry !== "All") {
      result = result.filter(r => {
        const linked = trendMap.get(r.trendId ?? "");
        return linked ? linked.industry === preferences.industry : true;
      });
    }

    if (priorityFilter !== "all") {
      result = result.filter(r => r.priority === priorityFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter(r => r.productCategory === categoryFilter);
    }
    return result;
  }, [recommendations, priorityFilter, categoryFilter, preferences.industry, trendMap]);

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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
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
            <SelectTrigger className="w-[180px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
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
        </div>

        {/* Recommendation grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRecs.map(rec => (
            <RecCard
              key={rec.$primaryKey}
              rec={rec}
              trendTitle={trendMap.get(rec.trendId ?? "")?.title ?? null}
              onClick={() => setSelectedRec(rec as RecObj)}
            />
          ))}
        </div>

        {filteredRecs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-300">No recommendations match your filters</p>
          </div>
        )}
      </div>

      <RecDetailModal
        rec={selectedRec}
        trendTitle={selectedRec ? (trendMap.get(selectedRec.trendId ?? "")?.title ?? null) : null}
        action={{ type: "accept-or-dismiss" }}
        onClose={() => setSelectedRec(null)}
      />
    </ScrollArea>
  );
}

function RecCard({ rec, trendTitle, onClick }: { rec: { $primaryKey: string | number; title?: string; description?: string; confidenceScore?: number; estimatedRevenuePotential?: string; priority?: string }; trendTitle: string | null; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="border border-slate-200 glass rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left cursor-pointer w-full"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-800">{rec.title}</h3>
          {trendTitle && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Linked to: <span className="text-blue-600 font-medium">{trendTitle}</span>
            </p>
          )}
        </div>
        <StatusBadge value={rec.priority} />
      </div>
      <p className="text-xs text-slate-500 line-clamp-2">{rec.description}</p>
      <div className="flex items-center gap-3 mt-3 text-xs">
        <span className="font-semibold text-blue-600">
          {rec.confidenceScore != null ? `${(rec.confidenceScore * 100).toFixed(0)}% confidence` : ""}
        </span>
        {rec.estimatedRevenuePotential && (
          <span className="font-semibold text-emerald-500">{rec.estimatedRevenuePotential}</span>
        )}
      </div>
    </button>
  );
}
