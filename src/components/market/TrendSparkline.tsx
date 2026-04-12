import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { generateTrendTimeSeries } from "@/lib/trendChartData";
import { useTheme } from "@/lib/theme";

interface TrendSparklineProps {
  trendId: string;
  score: number;
  growthRate: number;
  mentionCount: number;
  height?: number;
}

export function TrendSparkline({ trendId, score, growthRate, mentionCount, height = 40 }: TrendSparklineProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const data = useMemo(
    () => generateTrendTimeSeries(trendId, score, growthRate, mentionCount),
    [trendId, score, growthRate, mentionCount],
  );

  const isPositive = growthRate >= 0;
  const strokeColor = isPositive
    ? isDark ? "#34d399" : "#059669"
    : isDark ? "#f87171" : "#dc2626";
  const fillColor = isPositive
    ? isDark ? "#34d399" : "#059669"
    : isDark ? "#f87171" : "#dc2626";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`spark-${trendId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="score"
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#spark-${trendId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
