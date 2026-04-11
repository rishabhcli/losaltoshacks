"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Loader2, CheckCircle, Clock, AlertTriangle,
  FileJson, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";
import { DecisionSerialized } from "@/types";

interface DecisionPanelProps {
  trendId: string;
}

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  proposed: { icon: Clock, color: "text-amber-400 bg-amber-400/10", label: "Proposed" },
  under_review: { icon: AlertTriangle, color: "text-blue-400 bg-blue-400/10", label: "Under Review" },
  approved: { icon: CheckCircle, color: "text-green-400 bg-green-400/10", label: "Approved" },
  executed: { icon: CheckCircle, color: "text-indigo-400 bg-indigo-400/10", label: "Executed" },
};

export default function DecisionPanel({ trendId }: DecisionPanelProps) {
  const [decisions, setDecisions] = useState<DecisionSerialized[]>([]);
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDecisions = useCallback(async () => {
    try {
      const res = await fetch(`/api/decision?trendId=${trendId}`);
      const data = await res.json();
      setDecisions(data.decisions || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [trendId]);

  useEffect(() => { fetchDecisions(); }, [fetchDecisions]);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trendId }),
      });
      const data = await res.json();
      if (data.success) await fetchDecisions();
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  }

  async function handleStatusChange(decisionId: string, status: string) {
    try {
      await fetch("/api/decision", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisionId, status }),
      });
      await fetchDecisions();
    } catch (e) { console.error(e); }
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="h-5 w-5 text-violet-400" /> Decision Artifacts
        </h2>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
          {creating ? "Creating..." : "Create New"}
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Structured Palantir AIP–compatible objects with evidence chains, audience segments, and recommended actions.
      </p>

      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-gray-500" /></div>
      ) : decisions.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500">
          No decision artifacts yet. Click &quot;Create New&quot; to generate one.
        </div>
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => {
            const statusCfg = STATUS_CONFIG[d.properties.decisionStatus] || STATUS_CONFIG.proposed;
            const StatusIcon = statusCfg.icon;
            const isExpanded = expanded === d._id;

            return (
              <div key={d._id} className="rounded-lg border border-gray-700 bg-gray-800/50 overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : d._id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                      <StatusIcon className="h-3 w-3" /> {statusCfg.label}
                    </span>
                    <span className="text-sm font-medium">{d.properties.trendName}</span>
                    <span className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                    {d.palantirPushed && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <ExternalLink className="h-3 w-3" /> AIP
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-700"
                    >
                      <div className="p-4 space-y-4 text-sm">
                        {/* Signal + Audience */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Signal Strength</p>
                            <p className="font-semibold">{(d.properties.signalStrength * 100).toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Audience</p>
                            <p className="text-gray-300">{d.properties.audienceSegment}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        {d.properties.recommendedActions.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Actions ({d.properties.recommendedActions.length})</p>
                            {d.properties.recommendedActions.slice(0, 3).map((a, i) => (
                              <div key={i} className="flex items-start gap-2 mb-1.5">
                                <span className="text-indigo-400 mt-0.5">•</span>
                                <span className="text-gray-300">{a.description}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Evidence */}
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Evidence Chain ({d.properties.evidenceChain.length} sources)
                          </p>
                          <div className="flex gap-1 flex-wrap">
                            {d.properties.evidenceChain.slice(0, 5).map((e, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 truncate max-w-[200px]"
                                title={e.title}
                              >
                                {e.title.slice(0, 40)}…
                              </span>
                            ))}
                            {d.properties.evidenceChain.length > 5 && (
                              <span className="text-xs text-gray-500">
                                +{d.properties.evidenceChain.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Risks */}
                        {d.properties.riskFactors.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Risks</p>
                            <ul className="space-y-1">
                              {d.properties.riskFactors.map((r, i) => (
                                <li key={i} className="text-xs text-amber-300">⚠ {r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Status controls */}
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-xs text-gray-400 mb-2">Update Status</p>
                          <div className="flex gap-2 flex-wrap">
                            {["proposed", "under_review", "approved", "executed"].map(
                              (s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(d._id, s)}
                                  disabled={d.properties.decisionStatus === s}
                                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                                    d.properties.decisionStatus === s
                                      ? "bg-indigo-500/20 text-indigo-300 cursor-default"
                                      : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                                  }`}
                                >
                                  {s.replace("_", " ")}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
