import { useState, useMemo } from "react";
import { useOsdkObjects, useOsdkAction, $Actions, marketRecommendation, marketTrend } from "@/lib/osdk-shims";
import { Check, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { toast } from "sonner";
import { usePreferences } from "@/hooks/usePreferences";

export function Recommendations() {
  const { preferences } = usePreferences();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
    result = result.filter(r => r.status === "new" || r.status === "reviewed");

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
            <h1 className="text-4xl font-semibold text-slate-900">Recommendations</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {filteredRecs.length} AI-generated recommendation{filteredRecs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px] bg-teal-50/80 border-slate-200 text-slate-700 text-sm rounded-lg">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-teal-50/80 border-slate-200 rounded-lg">
              <SelectItem value="all" className="text-sm text-slate-700">
                All Priorities
              </SelectItem>
              <SelectItem value="high" className="text-sm text-slate-700">
                High
              </SelectItem>
              <SelectItem value="medium" className="text-sm text-slate-700">
                Medium
              </SelectItem>
              <SelectItem value="low" className="text-sm text-slate-700">
                Low
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-teal-50/80 border-slate-200 text-slate-700 text-sm rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-teal-50/80 border-slate-200 rounded-lg">
              <SelectItem value="all" className="text-sm text-slate-700">
                All Categories
              </SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-sm text-slate-700">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recommendation grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRecs.map(rec => (
            <RecCard key={rec.$primaryKey} rec={rec} trendTitle={trendMap.get(rec.trendId ?? "")?.title ?? null} />
          ))}
        </div>

        {filteredRecs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-300">No recommendations match your filters</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface RecObj {
  $primaryKey: string | number;
  title: string | undefined;
  description: string | undefined;
  productCategory: string | undefined;
  targetDemographic: string | undefined;
  confidenceScore: number | undefined;
  estimatedRevenuePotential: string | undefined;
  priority: string | undefined;
  status: string | undefined;
  actionPlan: string | undefined;
  trendId: string | undefined;
  createdAt: string | undefined;
}

function RecCard({ rec, trendTitle }: { rec: RecObj; trendTitle: string | null }) {
  const { applyAction, isPending } = useOsdkAction($Actions.updateRecommendationStatus);

  const handleStatusChange = async (newStatus: string) => {
    await applyAction({ recommendation: rec as never, status: newStatus });
    toast.success(`Recommendation ${newStatus}`);
  };

  return (
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-800">{rec.title}</h3>
          {trendTitle && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Linked to: <span className="text-blue-600 font-medium">{trendTitle}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge value={rec.priority} />
          <StatusBadge value={rec.status} />
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-3">{rec.description}</p>

      {/* Metrics */}
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
        {rec.targetDemographic && (
          <div>
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Target </span>
            <span className="font-semibold text-slate-800">{rec.targetDemographic}</span>
          </div>
        )}
        {rec.estimatedRevenuePotential && (
          <div>
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Revenue </span>
            <span className="font-semibold text-emerald-500">{rec.estimatedRevenuePotential}</span>
          </div>
        )}
      </div>

      {/* Action plan */}
      {rec.actionPlan && (
        <div className="border-t border-slate-200 pt-3 mb-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">Action plan</p>
          <p className="text-xs text-slate-500">{rec.actionPlan}</p>
        </div>
      )}

      {/* Action buttons */}
      {rec.status !== "accepted" && rec.status !== "dismissed" && (
        <div className="flex items-center gap-2 mt-3">
          <Button
            onClick={() => handleStatusChange("accepted")}
            disabled={isPending}
            className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs rounded-lg"
            size="sm"
          >
            <Check className="w-3 h-3 mr-1" />
            Accept
          </Button>
          <Button
            onClick={() => handleStatusChange("dismissed")}
            disabled={isPending}
            variant="outline"
            className="text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-lg"
            size="sm"
          >
            <X className="w-3 h-3 mr-1" />
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}
