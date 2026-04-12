import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3, CheckCircle2, Copy, ExternalLink, Loader2, Square, TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AGENTS, PLATFORM_COLORS, type AgentData, type BusinessPlan, type DiscoveredContent } from "@/hooks/useAgentData";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";
import { buildDetailedLovablePromptFromReport, buildLovableLaunchUrl } from "@/lib/lovableHandoff";

interface Props {
  plans: BusinessPlan[];
  agents: AgentData[];
  discoveries: DiscoveredContent[];
  missionPrompt: string;
  isRunning: boolean;
  finalOptions: FinalOptionsPayload | null;
  onStopAll?: () => void;
}

const PLAN_SECTIONS: { key: keyof Pick<BusinessPlan, "market_opportunity" | "competitive_landscape" | "revenue_models" | "user_acquisition" | "risk_analysis">; label: string; icon: string }[] = [
  { key: "market_opportunity", label: "Market", icon: "M" },
  { key: "competitive_landscape", label: "Competition", icon: "C" },
  { key: "revenue_models", label: "Revenue", icon: "R" },
  { key: "user_acquisition", label: "Growth", icon: "G" },
  { key: "risk_analysis", label: "Risks", icon: "!" },
];

function confidenceColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-500";
}

function confidenceProgressColor(score: number) {
  if (score >= 70) return "[&>div]:bg-green-500";
  if (score >= 40) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="flex justify-center py-1">
      <div
        className={`w-0.5 h-4 rounded-full transition-colors ${
          active ? "bg-gradient-to-b from-blue-400 to-blue-600" : "bg-slate-200 dark:bg-slate-700"
        }`}
      />
    </div>
  );
}

function renderMarkdownLight(text: string): React.ReactNode[] {
  if (!text) return [];
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const key = `md-${i}`;

    if (line.trim() === "") { nodes.push(<div key={key} className="h-2" />); continue; }
    if (line.startsWith("# ")) { nodes.push(<div key={key} className="text-base font-bold text-slate-900 dark:text-slate-50 mt-4 mb-1">{line.slice(2)}</div>); continue; }
    if (line.startsWith("## ")) { nodes.push(<div key={key} className="text-xs font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide mt-3 mb-1">{line.slice(3)}</div>); continue; }
    if (line.startsWith("### ")) { nodes.push(<div key={key} className="text-sm font-semibold text-slate-700 dark:text-slate-100 mt-2 mb-0.5">{line.slice(4)}</div>); continue; }

    if (line.trimStart().startsWith("- ")) {
      const indent = line.length - line.trimStart().length;
      nodes.push(
        <div key={key} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" style={{ paddingLeft: 16 + indent * 8 }}>
          <span className="text-slate-400 dark:text-slate-500 mr-1.5">&bull;</span>
          {renderInline(line.trimStart().slice(2))}
        </div>
      );
      continue;
    }

    nodes.push(<div key={key} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{renderInline(line)}</div>);
  }

  return nodes;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<span key={match.index} className="font-semibold text-slate-800 dark:text-slate-100">{match[1]}</span>);
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function agentStatusMeta(status: AgentData["status"]) {
  switch (status) {
    case "searching": case "found_trend": case "exploiting": case "reassigning":
      return { dotClass: "bg-green-500", glow: true };
    case "weak": return { dotClass: "bg-yellow-500", glow: false };
    case "error": return { dotClass: "bg-red-500", glow: false };
    case "stopped": return { dotClass: "bg-slate-400", glow: false };
    default: return { dotClass: "bg-slate-300", glow: false };
  }
}

export function BusinessPlanPanel({ plans, agents, discoveries, missionPrompt, isRunning, finalOptions, onStopAll }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedLovable, setCopiedLovable] = useState(false);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  const latest = plans[0] ?? null;
  const history = plans.slice(1);

  const agentDiscCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const d of discoveries) counts[d.found_by_agent_id] = (counts[d.found_by_agent_id] ?? 0) + 1;
    return counts;
  }, [discoveries]);

  const reportNodes = useMemo(() => latest?.raw_plan ? renderMarkdownLight(latest.raw_plan) : null, [latest?.raw_plan]);

  useEffect(() => { if (reportRef.current) reportRef.current.scrollTop = reportRef.current.scrollHeight; }, [latest?.raw_plan]);

  const handleCopy = useCallback(() => {
    if (!latest?.raw_plan) return;
    navigator.clipboard.writeText(latest.raw_plan).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    });
  }, [latest?.raw_plan]);

  /** Any persisted plan row can drive a Lovable brief (mission + discoveries fill gaps). */
  const canOpenLovable = Boolean(latest);

  const derivedLovablePrompt = useMemo(() => {
    if (!latest) return "";
    return buildDetailedLovablePromptFromReport({
      missionPrompt,
      plan: latest,
      discoveries,
      finalOptions,
    });
  }, [latest, missionPrompt, discoveries, finalOptions]);

  const derivedLovableUrl = useMemo(() => buildLovableLaunchUrl(derivedLovablePrompt), [derivedLovablePrompt]);

  const finalLovableUrl = finalOptions?.lovableHandoff?.launchUrl?.trim() ?? "";
  /** Prefer engine-built URL when coverage is complete; always fall back to live-report prompt. */
  const primaryLovableUrl =
    finalOptions?.coverage?.readyForLovable && finalLovableUrl ? finalLovableUrl : derivedLovableUrl;

  const handleCopyLovablePrompt = useCallback(() => {
    if (!derivedLovablePrompt) return;
    navigator.clipboard.writeText(derivedLovablePrompt).then(() => {
      setCopiedLovable(true);
      setTimeout(() => setCopiedLovable(false), 2000);
    });
  }, [derivedLovablePrompt]);

  const copyHistoryPrompt = useCallback((planId: string, prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedHistoryId(planId);
      setTimeout(() => setCopiedHistoryId(null), 2000);
    });
  }, []);

  // ── Empty states ──
  if (!missionPrompt) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-16 gap-3">
        <BarChart3 className="w-8 h-8 opacity-40" />
        <span className="text-sm">Launch a mission to generate a business report</span>
      </div>
    );
  }
  if (plans.length === 0 && isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-16 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-sm">Synthesizing report from agent discoveries...</span>
        <span className="text-xs text-slate-300 dark:text-slate-500">{discoveries.length} discoveries collected</span>
      </div>
    );
  }
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-16 gap-3">
        <BarChart3 className="w-8 h-8 opacity-40" />
        <span className="text-sm">No business plan synthesized yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-0 overflow-hidden">
      {/* ── PIPELINE FLOWCHART (top ~45%) ── */}
      <div className="flex-shrink-0 overflow-auto p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-0">
        {/* Mission node */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 shadow-sm dark:shadow-[0_16px_40px_rgba(2,6,23,0.35)]">
          <CardContent className="p-2.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Mission</div>
            <div className="text-xs text-slate-700 dark:text-slate-100 line-clamp-2 leading-snug">{missionPrompt}</div>
          </CardContent>
        </Card>

        <Connector active={isRunning || plans.length > 0} />

        {/* Agent row */}
        <div className="flex gap-1.5 justify-center flex-wrap">
          {AGENTS.map((def) => {
            const data = agents.find((a) => a.agent_id === def.agentId);
            const meta = agentStatusMeta(data?.status ?? "idle");
            const count = agentDiscCounts[def.agentId] ?? 0;
            return (
              <div key={def.id} className="flex flex-col items-center gap-0.5 flex-1 min-w-[48px] max-w-[68px] px-1.5 py-1.5 rounded-md border border-slate-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/80">
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass} ${meta.glow ? "animate-pulse" : ""}`} />
                <span className="text-[9px] font-semibold truncate" style={{ color: PLATFORM_COLORS[def.platform] }}>{def.name}</span>
                <span className="text-[7px] text-slate-400 uppercase tracking-wider">
                  {def.platform === "market_research" ? "MKT" : def.platform}
                </span>
                {count > 0 && <span className="text-[8px] text-slate-500 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 px-1 rounded">{count}</span>}
              </div>
            );
          })}
        </div>

        <Connector active={plans.length > 0} />

        {/* Synthesis status */}
        {latest && (
          <Card className={`border ${latest.is_final ? "border-green-200 dark:border-green-800/80 bg-green-50/50 dark:bg-emerald-950/30" : "border-blue-200 dark:border-blue-800/80 bg-blue-50/30 dark:bg-blue-950/30"}`}>
            <CardContent className="p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {latest.is_final ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <TrendingUp className="w-3 h-3 text-blue-600" />}
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-200">{latest.is_final ? "Final" : `v${latest.version}`}</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{latest.discovery_count} disc</span>
              </div>
              <Progress value={Math.min(100, latest.confidence_score)} className={`h-1 ${confidenceProgressColor(latest.confidence_score)}`} />
              <div className={`text-[10px] text-right mt-0.5 font-medium ${confidenceColor(latest.confidence_score)}`}>{latest.confidence_score}%</div>
            </CardContent>
          </Card>
        )}

        <Connector active={plans.length > 0} />

        {/* Plan section cards (2-col grid) */}
        {latest && (
          <div className="grid grid-cols-2 gap-1.5">
            {PLAN_SECTIONS.map((section) => {
              const content = latest[section.key] ?? "";
              const filled = content.length > 0 && !content.startsWith("Pending");
              return (
                <div key={section.key} className={`rounded-md border p-2 ${filled ? "border-blue-200/80 dark:border-blue-800/80 bg-white dark:bg-slate-950/85" : "border-slate-100 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-950/55"}`}>
                  <div className="flex items-center gap-1 mb-0.5">
                    {filled ? <CheckCircle2 className="w-2.5 h-2.5 text-blue-500 dark:text-blue-300" /> : <div className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600" />}
                    <span className={`text-[9px] font-semibold uppercase tracking-wider ${filled ? "text-slate-600 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>{section.label}</span>
                  </div>
                  {filled && <div className="text-[10px] text-slate-500 dark:text-slate-300 line-clamp-2 leading-snug">{content}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── LIVE REPORT (bottom ~55%) ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-transparent dark:bg-slate-950/45">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-100">Live Report</span>
            {latest && <Badge variant="secondary" className="text-[9px] bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300">v{latest.version}</Badge>}
          </div>
          {latest?.raw_plan && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 text-[10px] text-slate-400 dark:text-slate-300 gap-1">
              <Copy className="w-3 h-3" />
              {copiedReport ? "Copied" : "Copy"}
            </Button>
          )}
        </div>

        <div
          ref={reportRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-2 dark:bg-slate-950/35"
        >
          {reportNodes && reportNodes.length > 0 ? reportNodes : (
            <div className="text-sm text-slate-400 dark:text-slate-500 text-center pt-8">
              {isRunning ? "Report will appear as agents gather data..." : "No raw report data available."}
            </div>
          )}
        </div>

        {/* Version history — saved reports + Lovable per version */}
        {history.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800/80 shrink-0 px-3 py-2 space-y-2 bg-transparent dark:bg-slate-950/45 max-h-[200px] overflow-y-auto">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">History</span>
            <div className="space-y-2">
              {history.map((plan) => {
                const histPrompt = buildDetailedLovablePromptFromReport({
                  missionPrompt,
                  plan,
                  discoveries,
                  finalOptions: null,
                });
                const histUrl = buildLovableLaunchUrl(histPrompt);
                return (
                  <div
                    key={plan._id}
                    className="rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/80 px-2 py-1.5 flex flex-wrap items-center gap-1.5"
                  >
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-200">
                      v{plan.version}
                    </span>
                    <span className={`text-[10px] ${confidenceColor(plan.confidence_score)}`}>
                      {plan.confidence_score}%
                    </span>
                    <a
                      href={histUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      Build in Lovable
                    </a>
                    <button
                      type="button"
                      onClick={() => copyHistoryPrompt(plan._id, histPrompt)}
                      className="text-[10px] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      {copiedHistoryId === plan._id ? "Copied" : "Copy prompt"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons — Lovable stays available from live report; stop clears browsers & finalizes on server */}
        <div className="px-3 py-2 shrink-0 flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800/80 bg-transparent dark:bg-slate-950/55">
          {canOpenLovable && primaryLovableUrl && (
            <div className="flex flex-wrap gap-2">
              <a
                href={primaryLovableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Build in Lovable
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLovablePrompt}
                disabled={!derivedLovablePrompt}
                className="h-9 text-xs border-slate-200 dark:border-slate-700"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copiedLovable ? "Copied prompt" : "Copy Lovable prompt"}
              </Button>
            </div>
          )}
          {isRunning && (
            <button
              type="button"
              onClick={() => onStopAll?.()}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop session — save report &amp; clear browser previews
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
