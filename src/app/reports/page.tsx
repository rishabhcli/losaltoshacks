"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, CheckSquare, Square } from "lucide-react";
import Navbar from "@/components/Navbar";
import AudioBriefing from "@/components/AudioBriefing";
import { TrendSerialized } from "@/types";

export default function ReportsPage() {
  const [trends, setTrends] = useState<TrendSerialized[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [targetContext, setTargetContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<{ reportName: string; generatedSummary: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/trends");
        const data = await res.json();
        setTrends(data.trends || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  function toggleSelect(id: string) {
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }

  async function handleGenerate() {
    if (selected.length === 0 || !targetContext.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trendIds: selected, targetContext, reportName: `Market Brief: ${targetContext}` }),
      });
      const data = await res.json();
      setReport(data.report);
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  }

  return (
    <div className="min-h-screen"><Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Generate Report</h1>
          <p className="text-sm text-gray-400 mt-1">Select trends and generate an AI-powered business brief</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Trend selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
              <h2 className="text-sm font-semibold mb-3">Select Trends ({selected.length})</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {trends.map((t) => (
                  <button key={t._id} onClick={() => toggleSelect(t._id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${selected.includes(t._id) ? "bg-indigo-500/10 border border-indigo-500/30" : "bg-gray-800/50 hover:bg-gray-800"}`}>
                    {selected.includes(t._id) ? <CheckSquare className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" /> : <Square className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.growthRate > 0 ? "+" : ""}{t.growthRate.toFixed(0)}% growth</p>
                    </div>
                  </button>
                ))}
                {trends.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No trends available. Run analysis first.</p>}
              </div>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
              <h2 className="text-sm font-semibold mb-3">Target Context</h2>
              <textarea value={targetContext} onChange={(e) => setTargetContext(e.target.value)} placeholder="e.g., Nike sportswear division, targeting Gen Z in urban markets..."
                className="w-full h-24 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none" />
            </div>

            <button onClick={handleGenerate} disabled={generating || selected.length === 0 || !targetContext.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-600 transition-colors disabled:opacity-50">
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><FileText className="h-4 w-4" /> Generate Business Brief</>}
            </button>

            {selected.length > 0 && <AudioBriefing trendIds={selected} />}
          </div>

          {/* Right: Report output */}
          <div className="lg:col-span-2">
            {report ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-gray-700 bg-gray-900 p-6">
                <h2 className="text-xl font-bold mb-4">{report.reportName}</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  {report.generatedSummary.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) return <h2 key={i} className="text-lg font-bold mt-6 mb-2">{line.slice(2)}</h2>;
                    if (line.startsWith("## ")) return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.slice(3)}</h3>;
                    if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-semibold mt-3 mb-1">{line.slice(4)}</h4>;
                    if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="text-sm text-gray-300 ml-4">{line.slice(2)}</li>;
                    if (line.startsWith("**")) return <p key={i} className="text-sm font-semibold text-gray-200 mt-2">{line.replace(/\*\*/g, "")}</p>;
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="text-sm text-gray-300 leading-relaxed">{line}</p>;
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No report generated yet</h3>
                <p className="text-sm text-gray-400">Select trends, enter a target context, and click Generate to create a business brief.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
