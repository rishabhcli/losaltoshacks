import { useState, useMemo } from "react";
import { useOsdkObjects, marketRecommendation, marketTrend } from "@/lib/osdk-shims";
import { CalendarClock, CheckCircle2, ClipboardCheck, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/market/StatusBadge";
import { LoadingState } from "@/components/market/LoadingState";
import { RecDetailModal, type RecObj } from "@/components/market/RecDetailModal";
import { useTheme } from "@/lib/theme";
import { generateTrendTimeSeries, type TimeFrame } from "@/lib/trendChartData";
import { ChartControls } from "@/components/market/ChartControls";
import { DecisionLibrarySummary } from "@/components/market/DecisionLibrarySummary";
import { useMergedChartZoom } from "@/hooks/useChartZoom";
import { useRecommendationFollowUpMission } from "@/hooks/useRecommendationFollowUpMission";
import { buildDecisionMemo } from "@/lib/decision-library";
import { normalizeEvidenceSources } from "@/lib/evidence";

const CHART_COLORS_LIGHT = ["#1e40af", "#7e22ce", "#be185d", "#b45309", "#047857", "#0e7490", "#6d28d9", "#c2410c"];
const CHART_COLORS_DARK = ["#f472b6", "#facc15", "#fb923c", "#34d399", "#60a5fa", "#c084fc", "#f87171", "#a78bfa"];

export function AcceptedIdeas() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibleTrends, setVisibleTrends] = useState<Set<string> | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("7d");
  const [selectedRec, setSelectedRec] = useState<RecObj | null>(null);
  const { createFollowUpMission, isCreatingFollowUp } = useRecommendationFollowUpMission();

  const { data: recommendations, isLoading } = useOsdkObjects(marketRecommendation, {
    where: { status: { $eq: "accepted" } },
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

    if (priorityFilter !== "all") {
      result = result.filter(r => r.priority === priorityFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter(r => r.productCategory === categoryFilter);
    }
    return result;
  }, [recommendations, priorityFilter, categoryFilter]);

  // One chart line per accepted recommendation, using its linked trend's data
  const acceptedLines = useMemo(() => {
    if (!trends || !filteredRecs.length) return [];
    return filteredRecs.map(rec => {
      const t = trends.find(tr => tr.trendId === (rec.trendId ?? ""));
      return {
        key: rec.$primaryKey as string,
        title: rec.title ?? "Untitled",
        trendId: rec.trendId ?? "",
        score: t?.trendScore ?? 0,
        growthRate: t?.growthRate ?? 0,
        mentionCount: t?.mentionCount ?? 0,
      };
    });
  }, [trends, filteredRecs]);

  // Effective visible set — null means "show all"
  const effectiveVisible = visibleTrends ?? new Set(acceptedLines.map(l => l.key));

  // Merge all time-series into a single dataset keyed by label
  const mergedChartData = useMemo(() => {
    const map = new Map<string, Record<string, number | string>>();
    for (const line of acceptedLines) {
      // Use key (rec primary key) as seed so recs sharing a trend still get distinct curves
      const series = generateTrendTimeSeries(line.key, line.score, line.growthRate, line.mentionCount, timeFrame);
      for (const pt of series) {
        const existing = map.get(pt.label) ?? { label: pt.label };
        existing[line.key] = pt.score;
        map.set(pt.label, existing);
      }
    }
    return Array.from(map.values());
  }, [acceptedLines, timeFrame]);

  const toggleLine = (key: string) => {
    setVisibleTrends(prev => {
      const base = prev ?? new Set(acceptedLines.map(l => l.key));
      const next = new Set(base);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const colors = isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;

  if (isLoading && !recommendations) {
    return <LoadingState label="Loading accepted ideas" />;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1120px]">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h1 className="text-4xl font-semibold text-slate-900">Accepted Ideas</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {filteredRecs.length} accepted recommendation{filteredRecs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <DecisionLibrarySummary items={filteredRecs} status="accepted" />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px] glass border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectItem value="all" className="text-sm">
                All Priorities
              </SelectItem>
              <SelectItem value="high" className="text-sm">
                High
              </SelectItem>
              <SelectItem value="medium" className="text-sm">
                Medium
              </SelectItem>
              <SelectItem value="low" className="text-sm">
                Low
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] glass border-slate-200 text-slate-700 text-sm rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="glass border-slate-200 rounded-lg">
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

        {/* Accepted Trends Chart */}
        {acceptedLines.length > 0 && (
          <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="font-semibold text-lg text-slate-900 mb-1">Accepted Trend Performance</h2>
            <p className="text-xs text-slate-400 mb-2">Trend scores over time for your accepted recommendations</p>

            <AcceptedChart
              mergedChartData={mergedChartData}
              acceptedLines={acceptedLines}
              effectiveVisible={effectiveVisible}
              toggleLine={toggleLine}
              colors={colors}
              isDark={isDark}
              timeFrame={timeFrame}
              onTimeFrameChange={setTimeFrame}
            />
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRecs.map(rec => (
            <IdeaCard
              key={rec.$primaryKey}
              rec={rec}
              trendTitle={trendMap.get(rec.trendId ?? "")?.title ?? null}
              onClick={() => setSelectedRec(rec as RecObj)}
            />
          ))}
        </div>

        {filteredRecs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-300">No accepted ideas yet</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <RecDetailModal
        rec={selectedRec}
        trendTitle={selectedRec ? (trendMap.get(selectedRec.trendId ?? "")?.title ?? null) : null}
        action={{ type: "change-mind-to-rejected" }}
        followUpStatus="accepted"
        isCreatingFollowUp={isCreatingFollowUp}
        onCreateFollowUpMission={createFollowUpMission}
        onClose={() => setSelectedRec(null)}
      />
    </ScrollArea>
  );
}

function IdeaCard({ rec, trendTitle, onClick }: { rec: RecObj; trendTitle: string | null; onClick: () => void }) {
  const evidenceCount = normalizeEvidenceSources(rec.sourceEvidence).length;
  const memo = buildDecisionMemo(rec, "accepted");

  return (
    <button
      type="button"
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
      <div className="mt-3">
        {evidenceCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            <ShieldCheck className="h-3 w-3" />
            Source Evidence: {evidenceCount}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
            <AlertTriangle className="h-3 w-3" />
            Evidence missing
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs">
        <span className="font-semibold text-blue-600">
          {rec.confidenceScore != null ? `${(rec.confidenceScore * 100).toFixed(0)}% confidence` : ""}
        </span>
        {rec.estimatedRevenuePotential && (
          <span className="font-semibold text-emerald-500">{rec.estimatedRevenuePotential}</span>
        )}
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Decision memo
          </span>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            {memo.posture}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{memo.rationale}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <CalendarClock className="h-3 w-3" />
            Review cadence: {memo.reviewCadence}
          </span>
          <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
            {memo.evidenceLabel}
          </span>
        </div>
      </div>
    </button>
  );
}

interface AcceptedLineInfo {
  key: string;
  title: string;
}

function AcceptedChart({
  mergedChartData,
  acceptedLines,
  effectiveVisible,
  toggleLine,
  colors,
  isDark,
  timeFrame,
  onTimeFrameChange,
}: {
  mergedChartData: Record<string, number | string>[];
  acceptedLines: AcceptedLineInfo[];
  effectiveVisible: Set<string>;
  toggleLine: (key: string) => void;
  colors: string[];
  isDark: boolean;
  timeFrame: TimeFrame;
  onTimeFrameChange: (tf: TimeFrame) => void;
}) {
  const { visibleData, isZoomed, zoomIn, zoomOut, resetZoom } = useMergedChartZoom(mergedChartData);

  return (
    <>
      <ChartControls
        timeFrame={timeFrame}
        onTimeFrameChange={onTimeFrameChange}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        isZoomed={isZoomed}
      />

      {/* Legend with checkboxes */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
        {acceptedLines.map((line, i) => (
          <label key={line.key} className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={effectiveVisible.has(line.key)}
              onChange={() => toggleLine(line.key)}
              className="sr-only peer"
            />
            <span
              className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
              style={{
                borderColor: effectiveVisible.has(line.key) ? colors[i % colors.length] : isDark ? "#475569" : "#94a3b8",
                backgroundColor: effectiveVisible.has(line.key) ? colors[i % colors.length] : "transparent",
              }}
            >
              {effectiveVisible.has(line.key) && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              {line.title}
            </span>
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={visibleData}>
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
            domain={[0, 100]}
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
          {acceptedLines.map((line, i) =>
            effectiveVisible.has(line.key) ? (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.title}
                stroke={colors[i % colors.length]}
                strokeWidth={2.5}
                dot={{ fill: colors[i % colors.length], r: 4, strokeWidth: 0 }}
                activeDot={{ fill: colors[i % colors.length], r: 6, strokeWidth: 0 }}
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
