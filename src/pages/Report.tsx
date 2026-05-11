import { useEffect, useMemo, useState } from "react";
import { useOsdkObjects, marketTrend, marketInsight, marketRecommendation } from "@/lib/osdk-shims";
import {
  FileText,
  Check,
  Download,
  Printer,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingState } from "@/components/market/LoadingState";
import { StatusBadge } from "@/components/market/StatusBadge";
import { AiOutputAuditTrail } from "@/components/market/AiOutputAuditTrail";
import { usePreferences } from "@/hooks/usePreferences";
import { getIndustryLabel } from "@/lib/industry";
import { useMasterBuildDashboard } from "@/hooks/useMasterBuildDashboard";
import { buildAiOutputAuditTrail } from "@/lib/ai-output-audit";
import {
  formatEvidenceMetric,
  formatEvidencePlatform,
  getEvidenceTitle,
  normalizeEvidenceSources,
  type EvidenceSource,
} from "@/lib/evidence";

export function Report() {
  const { preferences } = usePreferences();
  const { latestMission, businessPlans } = useMasterBuildDashboard();
  const [selectedTrendIds, setSelectedTrendIds] = useState<Set<string>>(new Set());
  const [isGenerated, setIsGenerated] = useState(false);
  const [manualSelectionMode, setManualSelectionMode] = useState(false);

  const { data: trends, isLoading: trendsLoading } = useOsdkObjects(marketTrend, {
    orderBy: { trendScore: "desc" },
    pageSize: 50,
  });

  const { data: insights } = useOsdkObjects(marketInsight, {
    orderBy: { generatedAt: "desc" },
    pageSize: 50,
  });

  const { data: recommendations } = useOsdkObjects(marketRecommendation, {
    orderBy: { confidenceScore: "desc" },
    pageSize: 50,
  });
  const latestPlan = businessPlans[0] ?? null;
  const latestMissionId = latestMission?.id ?? null;
  const missionRunning = latestMission?.status === "queued" || latestMission?.status === "active";

  const filteredTrends = useMemo(() => {
    if (!trends) return [];
    if (preferences.industry === "All") return [...trends];
    return trends.filter(t => t.industry === preferences.industry || t.industry === "All");
  }, [trends, preferences.industry]);

  const filteredTrendIds = useMemo(
    () => filteredTrends.map((trend) => trend.trendId ?? "").filter(Boolean),
    [filteredTrends],
  );
  const filteredTrendIdsKey = filteredTrendIds.join("|");

  useEffect(() => {
    setManualSelectionMode(false);
  }, [latestMissionId]);

  useEffect(() => {
    if (!latestMissionId) {
      setSelectedTrendIds(new Set());
      setIsGenerated(false);
      return;
    }

    if (manualSelectionMode) return;

    setSelectedTrendIds(new Set(filteredTrendIds));
    setIsGenerated(filteredTrendIds.length > 0);
  }, [latestMissionId, filteredTrendIds, filteredTrendIdsKey, manualSelectionMode]);

  const toggleTrend = (trendId: string) => {
    setManualSelectionMode(true);
    setSelectedTrendIds(prev => {
      const next = new Set(prev);
      if (next.has(trendId)) {
        next.delete(trendId);
      } else {
        next.add(trendId);
      }
      return next;
    });
    setIsGenerated(false);
  };

  const selectAll = () => {
    setManualSelectionMode(true);
    setSelectedTrendIds(new Set(filteredTrends.map(t => t.trendId ?? "")));
    setIsGenerated(false);
  };

  const clearAll = () => {
    setManualSelectionMode(true);
    setSelectedTrendIds(new Set());
    setIsGenerated(false);
  };

  // Build report content from selected trends
  const selectedTrends = useMemo(() => {
    return filteredTrends.filter(t => selectedTrendIds.has(t.trendId ?? ""));
  }, [filteredTrends, selectedTrendIds]);

  const highlightedTrendTitles = useMemo(
    () => selectedTrends.map((trend) => trend.title ?? "").filter(Boolean).slice(0, 3),
    [selectedTrends],
  );

  const relatedInsights = useMemo(() => {
    if (!insights) return [];
    const linkedInsights = insights.filter(
      i =>
        i.insightType !== "kpi" &&
        (i.relatedTrendIds
          ?.split(",")
          .some(id => selectedTrendIds.has(id)) ??
          false),
    );
    if (linkedInsights.length > 0) return linkedInsights;
    return insights.filter((insight) => insight.insightType !== "kpi").slice(0, 5);
  }, [insights, selectedTrendIds]);

  const relatedRecs = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.filter(r => selectedTrendIds.has(r.trendId ?? ""));
  }, [recommendations, selectedTrendIds]);

  const evidenceSources = useMemo(() => {
    const byUrl = new Map<string, EvidenceSource>();
    const addSources = (sources: unknown) => {
      for (const source of normalizeEvidenceSources(sources)) {
        if (!byUrl.has(source.url)) byUrl.set(source.url, source);
      }
    };

    selectedTrends.forEach((trend) => addSources((trend as { sources?: unknown[] }).sources));
    relatedRecs.forEach((rec) => addSources((rec as { sourceEvidence?: unknown[] }).sourceEvidence));
    return Array.from(byUrl.values()).slice(0, 12);
  }, [relatedRecs, selectedTrends]);

  const reportAuditText = useMemo(() => {
    return [
      latestPlan?.market_opportunity,
      latestPlan?.competitive_landscape,
      latestPlan?.revenue_models,
      latestPlan?.user_acquisition,
      latestPlan?.risk_analysis,
      ...selectedTrends.flatMap((trend) => [trend.title, trend.description]),
      ...relatedRecs.flatMap((rec) => [rec.title, rec.description, rec.actionPlan]),
      ...relatedInsights.flatMap((insight) => [insight.title, insight.summary]),
    ].filter(Boolean).join("\n");
  }, [latestPlan, relatedInsights, relatedRecs, selectedTrends]);

  const reportAuditTrail = useMemo(() => buildAiOutputAuditTrail({
    artifact: "report",
    mode: "local-draft",
    missionPrompt: latestMission?.prompt,
    outputText: reportAuditText,
    sources: evidenceSources,
    inputCounts: {
      trends: selectedTrends.length,
      recommendations: relatedRecs.length,
      insights: relatedInsights.length,
      sections: 4 + (latestPlan ? 1 : 0),
    },
    warnings: [
      missionRunning ? "Mission still running while report is being viewed" : "",
      !latestPlan ? "No business-plan synthesis attached" : "",
    ].filter(Boolean),
  }), [evidenceSources, latestMission?.prompt, latestPlan, missionRunning, relatedInsights.length, relatedRecs.length, reportAuditText, selectedTrends.length]);

  const handleGenerate = () => {
    setManualSelectionMode(true);
    setIsGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (trendsLoading && !trends) {
    return <LoadingState label="Loading trends" />;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-4xl font-semibold text-slate-900">Research Report</h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              {latestMission
                ? "Latest research results are posted here automatically"
                : "Launch a research mission to publish results here"}
            </p>
          </div>
          {isGenerated && (
            <div className="flex gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="text-slate-600 border-slate-200 hover:bg-slate-50 text-sm font-medium rounded-lg"
              >
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg"
              >
                <Download className="w-4 h-4 mr-1" />
                Export PDF
              </Button>
            </div>
          )}
        </div>

        {/* Trend Selector */}
        {!isGenerated && (
          <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-slate-900">
                Select Trends ({selectedTrendIds.size} of {filteredTrends.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Select all
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredTrends.map(trend => {
                const isSelected = selectedTrendIds.has(trend.trendId ?? "");
                return (
                  <button
                    key={trend.$primaryKey}
                    onClick={() => toggleTrend(trend.trendId ?? "")}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/80 shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                        : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-blue-500 text-white" : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-800 truncate">{trend.title}</span>
                        <StatusBadge value={trend.status} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Score: {trend.trendScore?.toFixed(0)} &middot; {getIndustryLabel(trend.industry ?? "")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleGenerate}
                disabled={selectedTrendIds.size === 0}
                className="bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg disabled:opacity-40"
              >
                <FileText className="w-4 h-4 mr-1" />
                Generate Report ({selectedTrendIds.size} trend{selectedTrendIds.size !== 1 ? "s" : ""})
              </Button>
            </div>
          </div>
        )}

        {latestMission && !isGenerated && filteredTrends.length === 0 && !manualSelectionMode && (
          <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="font-semibold text-sm text-slate-900 mb-2">Waiting for research results</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {missionRunning
                ? `Agents are still researching "${latestMission.prompt}". This page will publish the report automatically as trends and recommendations arrive.`
                : `No trends were generated yet for "${latestMission.prompt}".`}
            </p>
          </div>
        )}

        {/* Generated Report */}
        {isGenerated && (
          <div className="space-y-6 print:space-y-4">
            {/* Report Header */}
            <div className="border border-slate-200 glass rounded-xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] print:border-0 print:shadow-none">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-blue-600 mb-3">
                <BarChart3 className="w-3.5 h-3.5" />
                MarketPulse Intelligence Report
              </div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-2">
                Market Intelligence Report
              </h2>
              <p className="text-slate-500 text-sm">
                {getIndustryLabel(preferences.industry)} &middot; {selectedTrends.length} trends analyzed
              </p>
              {latestMission?.prompt && (
                <p className="text-sm text-slate-600 mt-2">
                  Research topic: <span className="font-medium text-slate-800">{latestMission.prompt}</span>
                </p>
              )}
              <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>
                  Generated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>

            <AiOutputAuditTrail audit={reportAuditTrail} />

            {/* Research Synthesis */}
            {latestPlan && (
              <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Research Synthesis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReportSection title="Market Opportunity" body={latestPlan.market_opportunity} />
                  <ReportSection title="Competitive Landscape" body={latestPlan.competitive_landscape} />
                  <ReportSection title="Revenue Models" body={latestPlan.revenue_models} />
                  <ReportSection title="User Acquisition" body={latestPlan.user_acquisition} />
                </div>
                {latestPlan.risk_analysis && (
                  <div className="mt-4">
                    <ReportSection title="Risk Analysis" body={latestPlan.risk_analysis} />
                  </div>
                )}
              </div>
            )}

            {/* Executive Summary */}
            <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Executive Summary
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This report covers {selectedTrends.length} market trend{selectedTrends.length !== 1 ? "s" : ""} across{" "}
                {getIndustryLabel(preferences.industry)}.{" "}
                {highlightedTrendTitles.length > 0 &&
                  `The clearest concrete opportunities right now are ${formatHumanList(highlightedTrendTitles)}. `}
                {selectedTrends.filter(t => t.status === "growing").length > 0 &&
                  `${selectedTrends.filter(t => t.status === "growing").length} trend${selectedTrends.filter(t => t.status === "growing").length !== 1 ? "s are" : " is"} in active growth. `}
                {selectedTrends.filter(t => t.status === "emerging").length > 0 &&
                  `${selectedTrends.filter(t => t.status === "emerging").length} emerging trend${selectedTrends.filter(t => t.status === "emerging").length !== 1 ? "s show" : " shows"} early promise. `}
                The strongest signal is {selectedTrends[0]?.title} with a trend score of{" "}
                {selectedTrends[0]?.trendScore?.toFixed(0)} and{" "}
                {(selectedTrends[0]?.growthRate ?? 0) > 0 ? "positive" : "declining"} momentum at{" "}
                {selectedTrends[0]?.growthRate?.toFixed(1)}% growth rate.
              </p>
            </div>

            {/* Key Findings */}
            <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Key Findings
              </h3>
              <div className="space-y-4">
                {selectedTrends.map((trend, idx) => (
                  <div key={trend.$primaryKey} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-xl text-slate-200 tabular-nums w-8 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-slate-900">{trend.title}</h4>
                          <StatusBadge value={trend.status} />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-2">{trend.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Score </span>
                            <span className="font-semibold text-blue-600">{trend.trendScore?.toFixed(0)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Growth </span>
                            <span
                              className={`font-semibold ${(trend.growthRate ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}
                            >
                              {trend.growthRate?.toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Mentions </span>
                            <span className="font-semibold text-slate-800">{formatNumber(trend.mentionCount ?? 0)}</span>
                          </div>
                        </div>
                        {trend.topKeywords && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {trend.topKeywords
                              .split(",")
                              .slice(0, 5)
                              .map(kw => (
                                <span
                                  key={kw.trim()}
                                  className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
                                >
                                  {kw.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {relatedRecs.length > 0 && (
              <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {relatedRecs.slice(0, 8).map(rec => (
                    <div
                      key={rec.$primaryKey}
                      className="p-4 border border-slate-100 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-slate-800">{rec.title}</h4>
                        <StatusBadge value={rec.priority} />
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{rec.description}</p>
                      <div className="flex gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Confidence </span>
                          <span className="font-semibold text-blue-600">
                            {rec.confidenceScore != null ? `${(rec.confidenceScore * 100).toFixed(0)}%` : "--"}
                          </span>
                        </div>
                        {rec.estimatedRevenuePotential && (
                          <div>
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Revenue </span>
                            <span className="font-semibold text-emerald-500">{rec.estimatedRevenuePotential}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Evidence Appendix
              </h3>
              {evidenceSources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {evidenceSources.map((source, index) => (
                    <a
                      key={`${source.url}-${index}`}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-lg border border-slate-100 bg-white/60 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {formatEvidencePlatform(source.platform)}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500" />
                      </div>
                      <h4 className="line-clamp-2 text-xs font-semibold text-slate-800">
                        {getEvidenceTitle(source, `Evidence source ${index + 1}`)}
                      </h4>
                      {source.summary ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{source.summary}</p>
                      ) : null}
                      <EvidenceMetricRow source={source} />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    Source evidence is missing for this report.
                  </div>
                  <p className="mt-1 text-xs leading-relaxed">
                    Re-run the research mission or inspect the selected trends before using this report as a decision artifact.
                  </p>
                </div>
              )}
            </div>

            {/* Risks & Considerations */}
            {relatedInsights.length > 0 && (
              <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Related Insights & Alerts
                </h3>
                <div className="space-y-3">
                  {relatedInsights.map(insight => (
                    <div key={insight.$primaryKey} className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-medium uppercase tracking-widest ${
                            insight.insightType === "alert"
                              ? "text-red-500"
                              : insight.insightType === "opportunity"
                                ? "text-emerald-500"
                                : "text-slate-500"
                          }`}
                        >
                          {insight.insightType}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-800 mb-1">{insight.title}</h4>
                      <p className="text-xs text-slate-500">{insight.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to selection */}
            <div className="flex justify-center pt-2 pb-8">
              <button
                onClick={() => {
                  setManualSelectionMode(true);
                  setIsGenerated(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                ← Modify trend selection
              </button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function EvidenceMetricRow({ source }: { source: EvidenceSource }) {
  const metrics = [
    ["Views", formatEvidenceMetric(source.views)],
    ["Likes", formatEvidenceMetric(source.likes)],
    ["Comments", formatEvidenceMetric(source.comments)],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (metrics.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
      {metrics.map(([label, value]) => (
        <span key={label}>
          {label}: <span className="font-semibold text-slate-500">{value}</span>
        </span>
      ))}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toFixed(0);
}

function formatHumanList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items[0]}, ${items[1]}, and ${items[2]}`;
}

function ReportSection({ title, body }: { title: string; body: string | undefined }) {
  if (!body) return null;

  return (
    <div className="rounded-lg border border-slate-100 bg-white/60 px-4 py-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
    </div>
  );
}
