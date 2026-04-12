import { useOsdkObject, useOsdkAction, $Actions, marketTrend } from "@/lib/osdk-shims";
import { RotateCcw, Check, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/market/StatusBadge";
import { StabilityBadge } from "@/components/market/StabilityBadge";
import { TrendSparkline } from "@/components/market/TrendSparkline";
import { useTheme } from "@/lib/theme";
import { getIndustryLabel } from "@/lib/industry";
import { toast } from "sonner";

export interface RecObj {
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

type ModalAction =
  | { type: "change-mind-to-rejected" }
  | { type: "change-mind-to-accepted" }
  | { type: "accept-or-dismiss" };

interface RecDetailModalProps {
  rec: RecObj | null;
  trendTitle: string | null;
  action: ModalAction;
  onClose: () => void;
}

export function RecDetailModal({ rec, trendTitle, action, onClose }: RecDetailModalProps) {
  const { applyAction, isPending } = useOsdkAction($Actions.updateRecommendationStatus);
  const { theme } = useTheme();

  const { object: trend } = useOsdkObject(marketTrend, rec?.trendId ?? "");

  const handleAction = async (newStatus: string, message: string) => {
    await applyAction({ recommendation: rec as never, status: newStatus });
    toast.success(message);
    onClose();
  };

  if (!rec) return null;

  const sentimentLabel = trend?.sentimentScore != null
    ? trend.sentimentScore > 0.3 ? "Positive" : trend.sentimentScore < -0.3 ? "Negative" : "Neutral"
    : "Unknown";
  const sentimentColor = trend?.sentimentScore != null
    ? trend.sentimentScore > 0.3 ? "text-emerald-500" : trend.sentimentScore < -0.3 ? "text-red-500" : "text-slate-500"
    : "text-slate-400";

  return (
    <Dialog open={!!rec} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[780px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{rec.title}</DialogTitle>
        <DialogDescription className="sr-only">Details for {rec.title}</DialogDescription>

        {/* Recommendation header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{rec.title}</h2>
              {trendTitle && (
                <p className="text-xs text-slate-400 mt-1">
                  Linked to: <span className="text-blue-600 font-medium">{trendTitle}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge value={rec.priority} />
              <StatusBadge value={rec.status} />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-6" />

        {/* Description */}
        <div className="px-6 pt-4 pb-3">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{rec.description}</p>
        </div>

        {/* Metrics */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1 inline-flex items-center gap-1 cursor-help">
                      Confidence <Info className="w-2.5 h-2.5" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-lg">
                    How likely this recommendation is to succeed, based on trend strength, data quality, and market signals.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="font-semibold text-lg text-blue-600">
                {rec.confidenceScore != null ? `${(rec.confidenceScore * 100).toFixed(0)}%` : "--"}
              </p>
            </div>
            {rec.productCategory && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">Category</p>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{rec.productCategory}</p>
              </div>
            )}
            {rec.targetDemographic && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">Target</p>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{rec.targetDemographic}</p>
              </div>
            )}
            {rec.estimatedRevenuePotential && (
              <div>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1 inline-flex items-center gap-1 cursor-help">
                        Est. Revenue <Info className="w-2.5 h-2.5" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-lg">
                      AI-projected revenue if this recommendation is executed. Based on market size, growth rate, and confidence score.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="font-semibold text-sm text-emerald-500">{rec.estimatedRevenuePotential}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action plan */}
        {rec.actionPlan && (
          <>
            <div className="h-px bg-slate-100 dark:bg-slate-700 mx-6" />
            <div className="px-6 pt-4 pb-3">
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-2">Action Plan</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{rec.actionPlan}</p>
            </div>
          </>
        )}

        {/* Linked trend */}
        {trend && (
          <>
            <div className="h-px bg-slate-100 dark:bg-slate-700 mx-6" />
            <div className="px-6 pt-4 pb-3">
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-3">Linked Trend</p>

              <div className="border border-slate-200 dark:border-slate-700 glass rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <StatusBadge value={trend.status} />
                  <span className="text-xs text-slate-400">
                    {getIndustryLabel(trend.industry ?? "")} &middot; {trend.category}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">{trend.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{trend.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-0.5">Score</p>
                    <p className="font-semibold text-lg text-blue-600">{trend.trendScore?.toFixed(0) ?? "--"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-0.5">Sentiment</p>
                    <p className={`font-semibold text-lg ${sentimentColor}`}>{sentimentLabel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-0.5">Mentions</p>
                    <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{fmtCompact(trend.mentionCount ?? 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-0.5">Growth</p>
                    <p className={`font-semibold text-lg ${(trend.growthRate ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {trend.growthRate != null ? `${trend.growthRate.toFixed(1)}%` : "--"}
                    </p>
                  </div>
                </div>

                {trend.topKeywords && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(trend.topKeywords as string).split(",").slice(0, 5).map((kw: string) => (
                      <span key={kw.trim()} className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <StabilityBadge
                  trendId={trend.trendId ?? ""}
                  score={trend.trendScore ?? 0}
                  growthRate={trend.growthRate ?? 0}
                  mentionCount={trend.mentionCount ?? 0}
                  variant="full"
                />
              </div>

              <div className="border border-slate-200 dark:border-slate-700 glass rounded-xl p-4 mb-4">
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-2">Score Trend (7d)</p>
                <TrendSparkline
                  trendId={trend.trendId ?? ""}
                  score={trend.trendScore ?? 0}
                  growthRate={trend.growthRate ?? 0}
                  mentionCount={trend.mentionCount ?? 0}
                  height={80}
                />
              </div>

            </div>
          </>
        )}

        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-6" />

        {/* Actions */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {action.type === "change-mind-to-rejected" && (
              <Button
                onClick={() => handleAction("dismissed", "Moved to rejected ideas")}
                disabled={isPending}
                variant="outline"
                className="text-slate-500 border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-medium text-xs rounded-lg"
                size="sm"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {isPending ? "Moving..." : "Changed my mind"}
              </Button>
            )}
            {action.type === "change-mind-to-accepted" && (
              <Button
                onClick={() => handleAction("accepted", "Moved to accepted ideas")}
                disabled={isPending}
                variant="outline"
                className="text-slate-500 border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 font-medium text-xs rounded-lg"
                size="sm"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {isPending ? "Moving..." : "Changed my mind"}
              </Button>
            )}
            {action.type === "accept-or-dismiss" && (
              <>
                <Button
                  onClick={() => handleAction("accepted", "Recommendation accepted")}
                  disabled={isPending}
                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs rounded-lg"
                  size="sm"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleAction("dismissed", "Recommendation dismissed")}
                  disabled={isPending}
                  variant="outline"
                  className="text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-lg"
                  size="sm"
                >
                  <X className="w-3 h-3 mr-1" />
                  Dismiss
                </Button>
              </>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="text-slate-500 border-slate-200 hover:bg-slate-50 font-medium text-xs rounded-lg"
            size="sm"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function fmtCompact(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num.toString();
}
