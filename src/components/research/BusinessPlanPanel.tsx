import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3, CheckCircle2, Copy, ExternalLink, Loader2, TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AGENTS, PLATFORM_COLORS, type AgentData, type BusinessPlan, type DiscoveredContent } from "@/hooks/useAgentData";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

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
  const [copied, setCopied] = useState(false);
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
    navigator.clipboard.writeText(latest.raw_plan).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [latest?.raw_plan]);

  const lovableReady = finalOptions?.coverage?.readyForLovable && finalOptions?.lovableHandoff?.launchUrl;
  const lovableUrl = finalOptions?.lovableHandoff?.launchUrl ?? "";

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
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-transparent dark:bg-slate-950/45">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-100">Live Report</span>
            {latest && <Badge variant="secondary" className="text-[9px] bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300">v{latest.version}</Badge>}
          </div>
          {latest?.raw_plan && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 text-[10px] text-slate-400 dark:text-slate-300 gap-1">
              <Copy className="w-3 h-3" />
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 px-3 py-2 dark:bg-slate-950/35" ref={reportRef}>
          {reportNodes && reportNodes.length > 0 ? reportNodes : (
            <div className="text-sm text-slate-400 dark:text-slate-500 text-center pt-8">
              {isRunning ? "Report will appear as agents gather data..." : "No raw report data available."}
            </div>
          )}
        </ScrollArea>

        {/* Version history */}
        {history.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-slate-100 dark:border-slate-800/80 shrink-0 flex-wrap bg-transparent dark:bg-slate-950/45">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-0.5">History</span>
            {history.map((plan) => (
              <Badge key={plan._id} variant="outline" className="text-[9px] text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 py-0">
                v{plan.version} <span className={`ml-0.5 ${confidenceColor(plan.confidence_score)}`}>{plan.confidence_score}%</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="px-3 py-2 shrink-0 flex gap-2 border-t border-slate-100 dark:border-slate-800/80 bg-transparent dark:bg-slate-950/55">
          {lovableReady && !isRunning && (
            <a
              href={lovableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Build in Lovable
            </a>
          )}
          {isRunning && (
            <button
              onClick={() => {
                onStopAll?.();
                if (lovableUrl) window.open(lovableUrl, "_blank", "noopener,noreferrer");
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Stop &amp; Build in Lovable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
