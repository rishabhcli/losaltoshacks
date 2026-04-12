import { useMemo } from "react";
import { ShieldCheck, Activity, AlertTriangle, Zap } from "lucide-react";
import { generateTrendTimeSeries, analyzeTrendStability, type StabilityLevel } from "@/lib/trendChartData";

const levelConfig: Record<StabilityLevel, { icon: typeof ShieldCheck; colors: string; dotColor: string }> = {
  steady: {
    icon: ShieldCheck,
    colors: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    dotColor: "bg-emerald-500",
  },
  moderate: {
    icon: Activity,
    colors: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    dotColor: "bg-blue-500",
  },
  volatile: {
    icon: AlertTriangle,
    colors: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    dotColor: "bg-amber-500",
  },
  spike: {
    icon: Zap,
    colors: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
    dotColor: "bg-red-500",
  },
};

interface StabilityBadgeProps {
  trendId: string;
  score: number;
  growthRate: number;
  mentionCount: number;
  /** "compact" = small inline badge, "full" = card with description */
  variant?: "compact" | "full";
}

export function StabilityBadge({ trendId, score, growthRate, mentionCount, variant = "compact" }: StabilityBadgeProps) {
  const stability = useMemo(() => {
    const data = generateTrendTimeSeries(trendId, score, growthRate, mentionCount, "7d");
    return analyzeTrendStability(data, score);
  }, [trendId, score, growthRate, mentionCount]);

  const config = levelConfig[stability.level];
  const Icon = config.icon;

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-medium uppercase tracking-widest ${config.colors}`}>
        <Icon className="w-3 h-3" />
        {stability.label}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${config.colors}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-semibold text-sm">{stability.label}</span>
            <span className="text-xs opacity-70">Stability: {stability.stabilityScore}/100</span>
          </div>
          <p className="text-xs leading-relaxed opacity-80">{stability.description}</p>
          {stability.adjustedScore < score && (
            <p className="text-xs mt-2 font-medium">
              Adjusted score: {stability.adjustedScore} <span className="opacity-60">(raw: {score})</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
