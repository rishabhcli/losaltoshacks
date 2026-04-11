"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendSerialized } from "@/types";

interface VelocityChartProps {
  trends: TrendSerialized[];
}

const COLORS = ["#6366f1", "#818cf8", "#22c55e", "#f59e0b", "#ef4444"];

export default function VelocityChart({ trends }: VelocityChartProps) {
  // Merge all score histories into a unified timeline
  const dateMap = new Map<string, Record<string, string | number>>();

  trends.forEach((trend, i) => {
    (trend.scoreHistory || []).forEach((entry) => {
      const dateKey = new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dateMap.has(dateKey)) dateMap.set(dateKey, { name: dateKey });
      dateMap.get(dateKey)![`trend_${i}`] = Math.round(entry.score * 100);
    });
  });

  const data = Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
  );

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Run analysis multiple times to build velocity data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          {trends.map((_, i) => (
            <linearGradient key={i} id={`gradient_${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f3f4f6",
          }}
        />
        <Legend />
        {trends.map((trend, i) => (
          <Area
            key={trend._id}
            type="monotone"
            dataKey={`trend_${i}`}
            name={trend.name.slice(0, 30)}
            stroke={COLORS[i % COLORS.length]}
            fill={`url(#gradient_${i})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
