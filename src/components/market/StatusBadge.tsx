import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statusStyles: Record<string, string> = {
  emerging: "bg-blue-50 text-blue-600 border-blue-200",
  growing: "bg-emerald-50 text-emerald-600 border-emerald-200",
  peaking: "bg-amber-50 text-amber-600 border-amber-200",
  declining: "bg-slate-100 text-slate-500 border-slate-200",
  // Recommendation statuses
  new: "bg-blue-50 text-blue-600 border-blue-200",
  reviewed: "bg-indigo-50 text-indigo-600 border-indigo-200",
  accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
  dismissed: "bg-slate-100 text-slate-500 border-slate-200",
  // Priority
  high: "bg-blue-50 text-blue-600 border-blue-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-slate-100 text-slate-500 border-slate-200",
};

const statusTooltips: Record<string, string> = {
  // Trend statuses
  emerging: "This trend is newly detected and gaining early traction.",
  growing: "This trend is actively expanding with increasing consumer interest.",
  peaking: "This trend is near its highest point and may plateau soon.",
  declining: "Interest in this trend is fading. It may no longer be actionable.",
  // Recommendation statuses
  new: "This recommendation hasn't been reviewed yet.",
  reviewed: "This recommendation has been seen but no action was taken.",
  accepted: "You've chosen to act on this recommendation.",
  dismissed: "You've decided not to pursue this recommendation.",
  // Priority
  high: "High confidence and strong revenue potential. Act soon for maximum impact.",
  medium: "Moderate opportunity. Worth pursuing but less time-sensitive than high priority.",
  low: "Lower confidence or smaller opportunity. Consider only after higher priorities.",
};

export function StatusBadge({ value, className = "" }: { value: string | undefined; className?: string }) {
  const normalized = (value ?? "").toLowerCase();
  const style = statusStyles[normalized] ?? "bg-slate-50 text-slate-500 border-slate-200";
  const tooltip = statusTooltips[normalized];

  const badge = (
    <Badge
      variant="outline"
      className={`font-sans font-medium text-[10px] uppercase tracking-widest rounded-md ${style} ${className}`}
    >
      {value ?? "Unknown"}
    </Badge>
  );

  if (!tooltip) return badge;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[220px] text-xs leading-relaxed bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-lg"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
