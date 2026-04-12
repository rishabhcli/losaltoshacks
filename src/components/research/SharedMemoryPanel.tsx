import { useState } from "react";
import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AgentMemoryEntry } from "@/hooks/useAgentData";

interface Props {
  memory: AgentMemoryEntry[];
}

export function SharedMemoryPanel({ memory }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const sorted = [...memory].sort((a, b) => a.filename.localeCompare(b.filename));
  const active = sorted.find((m) => m.filename === selected) ?? sorted[0] ?? null;

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16 gap-3">
        <FileText className="w-8 h-8 opacity-40" />
        <span className="text-sm">No memory files yet</span>
        <span className="text-xs text-slate-300">Agents will write shared context here during research</span>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-3">
      {/* File list */}
      <div className="w-44 shrink-0 overflow-auto space-y-0.5">
        {sorted.map((m) => (
          <button
            key={m.filename}
            onClick={() => setSelected(m.filename)}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm transition-colors ${
              active?.filename === m.filename
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700"
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-xs">{m.filename}</span>
            <span className="text-[10px] text-slate-300 ml-auto shrink-0">v{m.version}</span>
          </button>
        ))}
      </div>

      {/* Content pane */}
      <div className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden flex flex-col">
        {active ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <span className="text-sm font-semibold text-slate-700">{active.filename}</span>
              <span className="text-[11px] text-slate-400">
                v{active.version} &middot; {active.updated_by ?? "system"} &middot; {new Date(active.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <ScrollArea className="flex-1 p-4">
              <pre className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed font-mono">
                {active.content || "(empty)"}
              </pre>
            </ScrollArea>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            Select a memory file to view
          </div>
        )}
      </div>
    </div>
  );
}
