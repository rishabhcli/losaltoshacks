import { useState, useMemo } from "react";
import { useOsdkObjects, marketRecommendation, marketTrend } from "@/lib/osdk-shims";
import { XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { usePreferences } from "@/hooks/usePreferences";

export function RejectedIdeas() {
  const { preferences } = usePreferences();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: recommendations, isLoading } = useOsdkObjects(marketRecommendation, {
    where: { status: { $eq: "dismissed" } },
    orderBy: { confidenceScore: "desc" },
    pageSize: 100,
  });

  const { data: trends } = useOsdkObjects(marketTrend, {
    pageSize: 100,
  });

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

  const categories = useMemo(() => {
    if (!recommendations) return [];
    return [...new Set(recommendations.map(r => r.productCategory).filter(Boolean))] as string[];
  }, [recommendations]);

  const filteredRecs = useMemo(() => {
    if (!recommendations) return [];
    let result = [...recommendations];

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
    return <LoadingState label="Loading rejected ideas" />;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1120px]">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-slate-400" />
            <h1 className="text-4xl font-semibold text-slate-900">Rejected Ideas</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {filteredRecs.length} dismissed recommendation{filteredRecs.length !== 1 ? "s" : ""}
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

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRecs.map(rec => (
            <IdeaCard key={rec.$primaryKey} rec={rec} trendTitle={trendMap.get(rec.trendId ?? "")?.title ?? null} />
          ))}
        </div>

        {filteredRecs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-300">No rejected ideas yet</p>
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
}

function IdeaCard({ rec, trendTitle }: { rec: RecObj; trendTitle: string | null }) {
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
        <div className="border-t border-slate-200 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">Action plan</p>
          <p className="text-xs text-slate-500">{rec.actionPlan}</p>
        </div>
      )}
    </div>
  );
}
