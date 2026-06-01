import { BookmarkPlus, ClipboardList, ListFilter, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  DemandSourceBlockerSavedView,
  DemandSourceBlockerSavedViewPacket,
  VentureDemandSourceBlockerDrilldownItem,
} from "@/lib/venture-portfolio";

export function DemandSourceBlockerDrilldownPanel({
  items,
  savedViews,
  savedViewPackets,
  viewNameDraft,
  onSearchSource,
  onViewNameChange,
  onSaveView,
  onApplyView,
  onDeleteView,
}: {
  items: VentureDemandSourceBlockerDrilldownItem[];
  savedViews: DemandSourceBlockerSavedView[];
  savedViewPackets: DemandSourceBlockerSavedViewPacket[];
  viewNameDraft: string;
  onSearchSource: (query: string) => void;
  onViewNameChange: (value: string) => void;
  onSaveView: (item: VentureDemandSourceBlockerDrilldownItem) => void;
  onApplyView: (view: DemandSourceBlockerSavedView) => void;
  onDeleteView: (viewId: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Demand source blocker drilldowns"
      className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/70 dark:bg-amber-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ListFilter className="h-4 w-4 text-amber-700 dark:text-amber-300" />
        <h2 className="text-sm font-semibold text-amber-950 dark:text-amber-100">Demand source blocker drilldowns</h2>
        <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
          {items.length} source type{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-amber-700 dark:bg-slate-950/60 dark:text-amber-300">
          Blocker source mix
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Source drilldowns list the ventures contributing blocked or weak-without-captured ordinary demand pressure, then jump the search view to those command cards.
      </p>
      <div aria-label="Demand source blocker saved views" className="mt-3 rounded-md border border-amber-200 bg-white/70 p-2 dark:border-amber-900/70 dark:bg-slate-950/60">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            aria-label="Demand source blocker saved view name"
            value={viewNameDraft}
            onChange={(event) => onViewNameChange(event.target.value)}
            placeholder="Saved blocker view name"
            className="h-8 min-w-[180px] flex-1 bg-white/80 text-xs dark:bg-slate-950/70"
          />
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            Saves source filter
          </Badge>
        </div>
        {savedViews.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {savedViews.map((view) => (
              <div key={view.id} className="flex items-center gap-1 rounded-md border border-amber-200 bg-white/80 p-1 dark:border-amber-900/70 dark:bg-slate-950/70">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onApplyView(view)}
                  className="h-6 px-2 text-[11px] text-amber-900 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-950/50"
                >
                  Apply blocker source view {view.name}
                </Button>
                <Badge
                  variant="secondary"
                  title={[
                    view.exportedAt ? `Exported ${view.exportedAt}` : "",
                    view.importedAt ? `Imported ${view.importedAt}` : "",
                  ].filter(Boolean).join(" · ")}
                  className={view.source === "imported" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "bg-white/70 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200"}
                >
                  {view.source === "imported" ? `Imported${view.exportedBy ? ` · ${view.exportedBy}` : ""}` : view.sourceType}
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-label={`Delete blocker source view ${view.name}`}
                  onClick={() => onDeleteView(view.id)}
                  className="h-6 w-6 p-0 text-slate-500 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            No saved blocker source views yet.
          </p>
        )}
      </div>
      {savedViewPackets.length > 0 && (
        <div aria-label="Demand source blocker saved view packets" className="mt-3 rounded-md border border-amber-200 bg-white/70 p-2 dark:border-amber-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardList className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
            <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-100">Shareable operator packets</p>
            <Badge variant="secondary" className="bg-white/70 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
              {savedViewPackets.length} packet{savedViewPackets.length === 1 ? "" : "s"}
            </Badge>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {savedViewPackets.slice(0, 4).map((packet) => (
              <div key={packet.id} className="rounded-md border border-amber-200 bg-amber-50/60 p-2 dark:border-amber-900/60 dark:bg-amber-950/20">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="bg-white/80 text-amber-900 dark:bg-slate-950/70 dark:text-amber-100">
                    {packet.sourceType}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                    {packet.currentMatchCount} match{packet.currentMatchCount === 1 ? "" : "es"}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/70 text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                    {packet.commandCount} command{packet.commandCount === 1 ? "" : "s"}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{packet.name}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{packet.summary}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-900 dark:text-amber-100">Saved query: {packet.searchQuery}</p>
                {packet.evidence.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                    {packet.evidence.slice(0, 2).map((line, index) => (
                      <li key={`${packet.id}-packet-evidence-${index}`}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 6).map((item) => (
          <div key={item.id} className="rounded-md border border-amber-200 bg-white/80 p-3 dark:border-amber-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                {item.sourceType}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-red-700 dark:bg-slate-950/70 dark:text-red-200">
                {item.blockedCount} blocked
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {item.weakPressureCount} weak
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {item.ventureCount} venture{item.ventureCount === 1 ? "" : "s"}
              </Badge>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{item.summary}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {item.decisionCounts.map((decision) => (
                <Badge key={`${item.id}-${decision.decision}`} variant="secondary" className="bg-white/70 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
                  {decision.decision}: {decision.count}
                </Badge>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-100">Affected ventures</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{item.ventureTitles.join(", ")}</p>
            </div>
            {item.evidence.length > 0 && (
              <ul className="mt-2 list-disc pl-4 text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">
                {item.evidence.slice(0, 3).map((line, index) => (
                  <li key={`${item.id}-evidence-${index}`}>{line}</li>
                ))}
              </ul>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 h-8 gap-1.5 border-amber-300 bg-white/80 text-xs text-amber-900 hover:bg-amber-100 dark:border-amber-900 dark:bg-slate-950/70 dark:text-amber-100 dark:hover:bg-amber-950/50"
              onClick={() => onSearchSource(item.searchQuery)}
            >
              <ListFilter className="h-3.5 w-3.5" />
              Filter {item.sourceType} blocker source
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 h-8 gap-1.5 text-xs text-amber-900 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-950/50"
              onClick={() => onSaveView(item)}
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              Save {item.sourceType} blocker view
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
