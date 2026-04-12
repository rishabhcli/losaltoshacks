import { useMemo, useState } from "react";
import {
  Search, Activity, Heart, Sparkles, Zap, BatteryLow, RefreshCw,
  Radio, AlertCircle, Lightbulb, TrendingUp, Compass, Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAgentById, type AgentSignal, type AgentThought, type LogEntry } from "@/hooks/useAgentData";

interface Props {
  thoughts: AgentThought[];
  signals: AgentSignal[];
  logs: LogEntry[];
}

type Filter = "all" | "thoughts" | "signals" | "logs";

const ICON_MAP: Record<string, typeof Circle> = {
  search: Search, activity: Activity, heart: Heart, sparkles: Sparkles,
  zap: Zap, "battery-low": BatteryLow, "refresh-cw": RefreshCw,
  radio: Radio, "alert-circle": AlertCircle, lightbulb: Lightbulb,
  "trending-up": TrendingUp, compass: Compass, circle: Circle,
};

function getIconForType(type: string) {
  const map: Record<string, string> = {
    search: "search", analysis: "activity", likes: "heart", discovery: "sparkles",
    energy_gain: "zap", energy_loss: "battery-low", task_swap: "refresh-cw",
    status: "radio", error: "alert-circle", refinement: "lightbulb",
    market_research: "trending-up", final_options: "compass",
  };
  return ICON_MAP[map[type] ?? "circle"] ?? Circle;
}

interface FeedItem {
  id: string;
  kind: "thought" | "signal" | "log";
  agentId: number | null;
  timestamp: number;
  title: string;
  detail: string;
  type: string;
}

export function AgentFeed({ thoughts, signals, logs }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    const all: FeedItem[] = [];

    for (const t of thoughts) {
      all.push({
        id: t._id, kind: "thought", agentId: t.agent_id, timestamp: t.timestamp,
        title: t.response_summary || t.prompt_summary,
        detail: t.action_taken ? `Action: ${t.action_taken}` : `${t.model} - ${t.tokens_used} tokens`,
        type: t.thought_type,
      });
    }

    for (const s of signals) {
      const from = getAgentById(s.fromAgent);
      const to = getAgentById(s.toAgent);
      all.push({
        id: s._id, kind: "signal", agentId: s.fromAgent, timestamp: s.timestamp,
        title: s.message,
        detail: `${from.name} -> ${to.name} (${s.signalType})`,
        type: "signal",
      });
    }

    for (const l of logs) {
      all.push({
        id: l._id, kind: "log", agentId: l.agent_id || null, timestamp: l.timestamp * 1000,
        title: l.message,
        detail: l.type,
        type: l.type,
      });
    }

    all.sort((a, b) => b.timestamp - a.timestamp);
    return all;
  }, [thoughts, signals, logs]);

  const filtered = filter === "all" ? items : items.filter((i) => i.kind === filter.slice(0, -1) as FeedItem["kind"] || (filter === "thoughts" && i.kind === "thought") || (filter === "signals" && i.kind === "signal") || (filter === "logs" && i.kind === "log"));

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => {
      if (filter === "thoughts") return i.kind === "thought";
      if (filter === "signals") return i.kind === "signal";
      if (filter === "logs") return i.kind === "log";
      return true;
    });
  }, [items, filter]);

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex items-center gap-2 pb-3">
        {(["all", "thoughts", "signals", "logs"] as Filter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={`h-7 text-xs capitalize ${filter === f ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}
          >
            {f}
          </Button>
        ))}
        <Badge variant="secondary" className="ml-auto text-xs bg-slate-100 dark:bg-slate-800 text-slate-500">
          {filteredItems.length} events
        </Badge>
      </div>

      {/* Feed */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-3">
          {filteredItems.length === 0 && (
            <div className="text-center text-sm text-slate-400 py-10">
              No events yet. Launch a research mission to see agent activity.
            </div>
          )}
          {filteredItems.slice(0, 100).map((item) => {
            const agent = item.agentId != null ? getAgentById(item.agentId) : null;
            const Icon = getIconForType(item.type);

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
                style={{ borderLeftWidth: 3, borderLeftColor: agent?.color ?? "#cbd5e1" }}
              >
                <Icon className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {agent && (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: agent.color }}
                      >
                        {agent.name}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-slate-700 leading-snug line-clamp-2">{item.title}</div>
                  {item.detail && (
                    <div className="text-xs text-slate-400 mt-0.5 truncate">{item.detail}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
