"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Zap, Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { TrendSerialized } from "@/types";

interface TrendCardProps {
  trend: TrendSerialized;
  index: number;
}

function getGrowthColor(rate: number) {
  if (rate > 20) return "text-green-400";
  if (rate > 0) return "text-emerald-400";
  if (rate === 0) return "text-gray-400";
  return "text-red-400";
}

function getConfidenceBadge(confidence: string) {
  switch (confidence) {
    case "high":
      return { icon: Shield, color: "bg-green-400/10 text-green-400", label: "High" };
    case "medium":
      return { icon: AlertTriangle, color: "bg-amber-400/10 text-amber-400", label: "Medium" };
    default:
      return { icon: AlertTriangle, color: "bg-red-400/10 text-red-400", label: "Low" };
  }
}

export default function TrendCard({ trend, index }: TrendCardProps) {
  const growthRate = trend.growthRate;
  const confidence = getConfidenceBadge(trend.insight?.confidence || "medium");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link href={`/trends/${trend._id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-5 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-100 group-hover:text-indigo-400 transition-colors line-clamp-2 pr-4">
              {trend.name}
            </h3>
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors" />
          </div>

          {/* Growth + Acceleration */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`flex items-center gap-1 text-sm font-medium ${getGrowthColor(growthRate)}`}>
              {growthRate > 0 ? <TrendingUp className="h-4 w-4" /> : growthRate < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              {growthRate > 0 ? "+" : ""}
              {growthRate.toFixed(0)}%
            </span>
            {trend.acceleration > 0.2 && (
              <span className="flex items-center gap-1 text-xs text-violet-400">
                <Zap className="h-3 w-3" /> Accelerating
              </span>
            )}
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${confidence.color}`}>
              {confidence.label}
            </span>
          </div>

          {/* Audience */}
          {trend.insight?.audience && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              <span className="font-medium text-gray-200">Audience:</span>{" "}
              {trend.insight.audience.demographic}
            </p>
          )}

          {/* Top Action */}
          {trend.insight?.businessActions?.[0] && (
            <p className="text-sm text-gray-400 line-clamp-2">
              <span className="font-medium text-gray-200">Action:</span>{" "}
              {trend.insight.businessActions[0].action}
            </p>
          )}

          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {trend.normalizedKeywords?.slice(0, 3).map((kw) => (
              <span key={kw} className="text-xs px-2 py-0.5 rounded-md bg-gray-800 text-gray-400">
                {kw}
              </span>
            ))}
          </div>

          {/* Score bar */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Signal Strength</span>
              <span>{(trend.compositeScore * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${trend.compositeScore * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
