import { useState } from "react";
import { Loader2, Play, Square, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isRunning: boolean;
  isCreatingMission: boolean;
  missionPrompt: string;
  missionStatus: string | null;
  error: string | null;
  onCreateMission: (prompt: string) => void;
  onStopAll: () => void;
  onResetAll: () => void;
}

export function MissionControl({
  isRunning,
  isCreatingMission,
  missionPrompt,
  missionStatus,
  error,
  onCreateMission,
  onStopAll,
  onResetAll,
}: Props) {
  const [input, setInput] = useState("");

  const handleLaunch = () => {
    if (!input.trim() || isCreatingMission) return;
    onCreateMission(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLaunch();
    }
  };

  return (
    <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-xl px-5 py-3.5">
      {/* Status line */}
      {(isRunning || error || (missionPrompt && missionStatus === "stopped")) && (
        <div className="flex items-center gap-2 mb-2.5 px-1">
          {isRunning && (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-green-700 font-medium">Agents researching</span>
              <span className="text-xs text-slate-400 truncate">&mdash; {missionPrompt}</span>
            </>
          )}
          {!isRunning && missionPrompt && missionStatus === "stopped" && (
            <span className="text-xs text-slate-500">
              Mission completed &mdash; {missionPrompt}
            </span>
          )}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex items-center gap-3 bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a market to research... e.g., AI-powered wellness apps for Gen Z"
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            disabled={isCreatingMission}
          />
        </div>

        {!isRunning ? (
          <Button
            onClick={handleLaunch}
            disabled={!input.trim() || isCreatingMission}
            className="h-10 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm font-medium shrink-0"
          >
            {isCreatingMission ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isCreatingMission ? "Launching..." : "Launch Mission"}
          </Button>
        ) : (
          <Button
            onClick={onStopAll}
            variant="destructive"
            className="h-10 px-5 rounded-2xl gap-2 text-sm font-medium shrink-0"
          >
            <Square className="w-4 h-4" />
            Stop All
          </Button>
        )}
        {missionPrompt && !isRunning && (
          <Button
            onClick={onResetAll}
            variant="outline"
            className="h-10 px-3 rounded-2xl text-slate-500 border-slate-200 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
