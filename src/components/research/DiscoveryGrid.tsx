import { useMemo, useState } from "react";
import { ExternalLink, Eye, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAgentById, PLATFORM_COLORS, type DiscoveredContent } from "@/hooks/useAgentData";

interface Props {
  discoveries: DiscoveredContent[];
}

const PLATFORM_FILTERS = ["all", "youtube", "x", "reddit", "substack"] as const;
type PlatformFilter = (typeof PLATFORM_FILTERS)[number];

function platformFromAgentId(agentId: number): string {
  const agent = getAgentById(agentId);
  return agent.platform;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function DiscoveryGrid({ discoveries }: Props) {
  const [filter, setFilter] = useState<PlatformFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return discoveries;
    return discoveries.filter((d) => platformFromAgentId(d.found_by_agent_id) === filter);
  }, [discoveries, filter]);

  if (discoveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-16 gap-3">
        <Eye className="w-8 h-8 opacity-40" />
        <span className="text-sm">No discoveries yet</span>
        <span className="text-xs text-slate-300 dark:text-slate-500">Agents will report findings here once the mission starts</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex items-center gap-2 pb-3 shrink-0">
        {PLATFORM_FILTERS.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={`h-7 text-xs capitalize ${
              filter === f ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            {f === "all" ? "All" : f}
          </Button>
        ))}
        <Badge variant="secondary" className="ml-auto text-xs bg-slate-100 dark:bg-slate-800 text-slate-500">
          {filtered.length}
        </Badge>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pr-2 pb-3">
          {filtered.map((d) => {
            const agent = getAgentById(d.found_by_agent_id);
            const platform = platformFromAgentId(d.found_by_agent_id);
            const color = PLATFORM_COLORS[platform] ?? "#64748b";

            return (
              <Card key={d._id} className="border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 shadow-sm dark:shadow-[0_18px_42px_rgba(2,6,23,0.35)] overflow-hidden">
                {/* Thumbnail */}
                {d.thumbnail && (
                  <div className="h-28 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={d.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardContent className="p-3">
                  {/* Platform + Agent */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-current capitalize"
                      style={{ color }}
                    >
                      {platform === "market_research" ? "Research" : platform}
                    </Badge>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{agent.name}</span>
                  </div>

                  {/* Keywords */}
                  {d.keywords && (
                    <div className="text-xs text-slate-700 dark:text-slate-100 font-medium line-clamp-2 mb-2 leading-snug">
                      {d.keywords}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                    {(d.likes ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {formatNumber(d.likes!)}
                      </span>
                    )}
                    {(d.views ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(d.views!)}
                      </span>
                    )}
                    {(d.comments ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {formatNumber(d.comments!)}
                      </span>
                    )}
                    {d.video_url && (
                      <a
                        href={d.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
