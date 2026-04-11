"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, AlertTriangle, Users, Lightbulb, Target, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ArticleFeed from "@/components/ArticleFeed";
import AudioBriefing from "@/components/AudioBriefing";
import DecisionPanel from "@/components/DecisionPanel";
import { TrendSerialized, InsightSerialized, ArticleSerialized } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TrendDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [trend, setTrend] = useState<TrendSerialized | null>(null);
  const [insight, setInsight] = useState<InsightSerialized | null>(null);
  const [articles, setArticles] = useState<ArticleSerialized[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/trends/${id}`);
        const data = await res.json();
        setTrend(data.trend); setInsight(data.insight); setArticles(data.articles || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);
  if (loading) return (<div className="min-h-screen"><Navbar /><div className="flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div></div>);
  if (!trend) return (<div className="min-h-screen"><Navbar /><div className="text-center py-32"><p className="text-gray-400">Trend not found</p></div></div>);
  const scoreData = (trend.scoreHistory || []).map((s) => ({ date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), score: Math.round(s.score * 100) }));
  const pc: Record<string, string> = { high: "text-red-400 bg-red-400/10", medium: "text-amber-400 bg-amber-400/10", low: "text-green-400 bg-green-400/10" };
  return (
    <div className="min-h-screen"><Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{trend.name}</h1>
              <p className="text-gray-400">{trend.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {trend.normalizedKeywords?.map((kw) => (<span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300">{kw}</span>))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`text-2xl font-bold ${trend.growthRate > 0 ? "text-green-400" : "text-red-400"}`}>{trend.growthRate > 0 ? "+" : ""}{trend.growthRate.toFixed(0)}%</span>
                <p className="text-xs text-gray-400">growth</p>
              </div>
              {trend.acceleration > 0.2 && (<span className="flex items-center gap-1 text-xs text-violet-400 bg-violet-400/10 px-2.5 py-1 rounded-full"><Zap className="h-3 w-3" /> Accelerating</span>)}
            </div>
          </div>
          {scoreData.length > 0 && (
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-lg font-semibold mb-4">Signal Strength Over Time</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f3f4f6" }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="grid lg:grid-cols-2 gap-6">
            {insight?.audience && (
              <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Users className="h-5 w-5 text-indigo-400" /> Audience Profile</h2>
                <div className="space-y-3">
                  <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Demographic</p><p className="text-sm">{insight.audience.demographic}</p></div>
                  <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Psychographic</p><p className="text-sm">{insight.audience.psychographic}</p></div>
                  <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Behaviors</p>
                    <ul className="space-y-1">{insight.audience.behaviors?.map((b, i) => <li key={i} className="text-sm text-gray-300">• {b}</li>)}</ul></div>
                </div>
              </div>
            )}
            {insight?.explanation && (
              <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Lightbulb className="h-5 w-5 text-amber-400" /> Why It Matters</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{insight.explanation}</p>
                {insight.risks && insight.risks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="flex items-center gap-2 text-sm font-semibold mb-2"><AlertTriangle className="h-4 w-4 text-amber-400" /> Risks</h3>
                    <ul className="space-y-1">{insight.risks.map((r, i) => <li key={i} className="text-sm text-gray-400">• {r}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
          {insight?.businessActions && insight.businessActions.length > 0 && (
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Target className="h-5 w-5 text-green-400" /> Recommended Actions</h2>
              <div className="space-y-3">
                {insight.businessActions.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${pc[a.priority] || pc.medium}`}>{a.priority}</span>
                    <div><p className="text-sm font-medium">{a.action}</p><p className="text-xs text-gray-400 mt-0.5 capitalize">{a.category}</p></div>
                  </div>))}
              </div>
            </div>
          )}
          {/* Audio + Decision */}
          <div className="grid lg:grid-cols-2 gap-6">
            <AudioBriefing trendIds={[id]} />
            <DecisionPanel trendId={id} />
          </div>
          <ArticleFeed articles={articles} title={`Source Articles (${articles.length})`} />
        </motion.div>
      </main>
    </div>
  );
}
