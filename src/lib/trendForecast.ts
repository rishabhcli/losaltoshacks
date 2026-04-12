import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ForecastType = "growth" | "steady" | "caution" | "warning" | "decline";

export interface TrendForecast {
  label: string;
  type: ForecastType;
  message: string;
  icon: LucideIcon;
}

export function getTrendForecast(
  status: string | undefined,
  growthRate: number | undefined,
  trendScore?: number | undefined,
  sentimentScore?: number | undefined,
): TrendForecast {
  // trendScore and sentimentScore are accepted for future use
  void trendScore;
  void sentimentScore;
  const gr = growthRate ?? 0;

  if (status === "emerging" && gr > 20) {
    return {
      label: "Rapid Growth Expected",
      type: "growth",
      message: "This trend is gaining momentum fast. Demand is expected to increase significantly in the coming weeks.",
      icon: TrendingUp,
    };
  }

  if (status === "emerging") {
    return {
      label: "Growth Expected",
      type: "growth",
      message: "Early signals are positive. This trend is likely to grow as more consumers engage with it.",
      icon: TrendingUp,
    };
  }

  if (status === "growing" && gr > 30) {
    return {
      label: "Strong Growth Continuing",
      type: "growth",
      message: "Momentum is strong and accelerating. Demand will likely keep increasing in the near term.",
      icon: TrendingUp,
    };
  }

  if (status === "growing") {
    return {
      label: "Steady Growth",
      type: "steady",
      message: "This trend is growing at a stable pace. Expect demand to remain strong with gradual increases.",
      icon: ArrowRight,
    };
  }

  if (status === "peaking" && gr > 10) {
    return {
      label: "Approaching Plateau",
      type: "caution",
      message: "This trend is near its peak but still growing. Demand may level off soon \u2014 consider acting now.",
      icon: AlertTriangle,
    };
  }

  if (status === "peaking") {
    return {
      label: "Likely to Decline Soon",
      type: "warning",
      message: "This trend has peaked. Demand is expected to slow down and may decrease in the coming weeks.",
      icon: TrendingDown,
    };
  }

  if (status === "declining" && gr > -10) {
    return {
      label: "Gradual Decline",
      type: "warning",
      message: "Interest is fading gradually. This trend may still have some relevance but is losing momentum.",
      icon: TrendingDown,
    };
  }

  if (status === "declining") {
    return {
      label: "Trend Fading",
      type: "decline",
      message: "This trend is losing relevance. Demand is dropping and it may cease to be a notable trend soon.",
      icon: TrendingDown,
    };
  }

  return {
    label: "Outlook Uncertain",
    type: "steady",
    message: "Not enough data to predict the trajectory. Monitor for changes.",
    icon: HelpCircle,
  };
}

/** CSS classes keyed by forecast type */
export const forecastColors: Record<ForecastType, { bg: string; border: string; text: string; iconColor: string }> = {
  growth: {
    bg: "bg-emerald-50",
    border: "border-l-emerald-500",
    text: "text-emerald-700",
    iconColor: "text-emerald-600",
  },
  steady: {
    bg: "bg-blue-50",
    border: "border-l-blue-500",
    text: "text-blue-700",
    iconColor: "text-blue-600",
  },
  caution: {
    bg: "bg-amber-50",
    border: "border-l-amber-500",
    text: "text-amber-700",
    iconColor: "text-amber-600",
  },
  warning: {
    bg: "bg-orange-50",
    border: "border-l-orange-500",
    text: "text-orange-700",
    iconColor: "text-orange-600",
  },
  decline: {
    bg: "bg-red-50",
    border: "border-l-red-500",
    text: "text-red-700",
    iconColor: "text-red-600",
  },
};
