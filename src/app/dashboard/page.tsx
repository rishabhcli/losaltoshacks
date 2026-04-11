"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, TrendingUp, BarChart3, Users, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import TrendCard from "@/components/TrendCard";
import VelocityChart from "@/components/VelocityChart";
import KeywordFilter from "@/components/KeywordFilter";
import AudioBriefing from "@/components/AudioBriefing";
import { TrendSerialized } from "@/types";

const DEFAULT_KEYWORDS = ["fashion trends", "Gen Z consumer", "retail innovation", "beauty industry", "sustainable fashion"];

export default function DashboardPage() {
  const [trends, setTrends] = useState<TrendSerialized[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(DEFAULT_KEYWORDS);
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"info" | "success" | "error">("info");

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trends");
      const data = await res.json();
      setTrends(data.trends || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTrends(); }, [fetchTrends]);

  async function handleIngestAndAnalyze() {
    setIngesting(true);
    setStatus("Ingesting Google News RSS feeds..."); setStatusType("info");
    try {
      const ir = await fetch("/api/ingest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keywords }) });
      const id = await ir.json();
      if (id.error) { setStatus(`Ingestion failed: ${id.error}`); setStatusType("error"); return; }
      setStatus(`Ingested ${id.newArticles} new articles${id.failedFeeds ? ` (${id.failedFeeds} feeds failed)` : ""}. Analyzing trends...`);
      setIngesting(false); setAnalyzing(true);
      const ar = await fetch("/api/analyze", { method: "POST" });
      const ad = await ar.json();
      if (ad.error) { setStatus(`Analysis failed: ${ad.error}`); setStatusType("error"); return; }
      setStatus(`✓ Found ${ad.clustersFound || 0} clusters, created ${ad.trendsCreated || 0} trends, ${ad.insightsCreated || 0} insights.`);
      setStatusType("success");
      await fetchTrends();
    } catch (e) { setStatus(`Error: ${e}`); setStatusType("error"); }
    finally { setIngesting(false); setAnalyzing(false); }
  }

  const filtered = activeKeywords.length === 0 ? trends : trends.filter((t) =>
    t.normalizedKeywords?.some((kw) => activeKeywords.some((ak) => kw.toLowerCase().includes(ak.toLowerCase())))
  );
  const top5 = filtered.slice(0, 5);
  const avgGrowth = filtered.length > 0 ? filtered.reduce((s, t) => s + t.growthRate, 0) / filtered.length : 0;

  const stats = [
    { label: "Trends Detected", value: String(filtered.length), icon: TrendingUp, color: "text-indigo-400" },
    { label: "Avg Growth", value: `${avgGrowth > 0 ? "+" : ""}${avgGrowth.toFixed(0)}%`, icon: BarChart3, color: "text-green-400" },
    { label: "Top Audience", value: top5[0]?.insight?.audience?.demographic?.split(",")[0] || "—", icon: Users, color: "text-violet-400" },
    { label: "Latest Signal", value: top5[0]?.updatedAt ? new Date(top5[0].updatedAt).toLocaleDateString() : "—", icon: Clock, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Trend Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">AI-powered market intelligence from Google News</p>
          </div>
          <button onClick={handleIngestAndAnalyze} disabled={ingesting || analyzing}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 transition-colors disabled:opacity-50">
            {ingesting || analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {ingesting ? "Ingesting..." : analyzing ? "Analyzing..." : "Analyze Trends"}
          </button>
        </div>

        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              statusType === "error" ? "border-red-700 bg-red-900/30 text-red-300" :
              statusType === "success" ? "border-green-700 bg-green-900/30 text-green-300" :
              "border-gray-700 bg-gray-900 text-gray-300"
            }`}>{status}</motion.div>
        )}

        <div className="mb-6">
          <KeywordFilter keywords={keywords} activeKeywords={activeKeywords}
            onToggle={(kw) => setActiveKeywords((p) => p.includes(kw) ? p.filter((k) => k !== kw) : [...p, kw])}
            onAdd={(kw) => { if (!keywords.includes(kw)) setKeywords((p) => [...p, kw]); }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-700 bg-gray-900 p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-gray-400">{s.label}</span>
              </div>
              <p className="text-lg font-bold truncate">{s.value}</p>
            </div>
          ))}
        </div>

        {top5.length > 0 && top5.some((t) => t.scoreHistory?.length > 0) && (
          <div className="mb-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold mb-4">Trend Velocity</h2>
            <VelocityChart trends={top5} />
          </div>
        )}

        {top5.length > 0 && (
          <div className="mb-8"><AudioBriefing trendIds={top5.map((t) => t._id)} /></div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div>
        ) : filtered.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Emerging Trends ({filtered.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t, i) => <TrendCard key={t._id} trend={t} index={i} />)}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No trends yet</h3>
            <p className="text-sm text-gray-400 mb-6">Click &quot;Analyze Trends&quot; to ingest Google News RSS feeds and discover emerging market signals.</p>
          </div>
        )}
      </main>
    </div>
  );
}
