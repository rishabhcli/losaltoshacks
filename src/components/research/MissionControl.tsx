import { useRef, useState } from "react";
import { Loader2, Mic, Play, Square, RotateCcw, Search, Volume2 } from "lucide-react";
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
  const [isDictating, setIsDictating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  const handleDictate = async () => {
    const textToSpeak = input.trim() || missionPrompt;
    if (!textToSpeak || isDictating || isPlaying) return;

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }

    setIsDictating(true);
    try {
      const response = await fetch(`${API_BASE}/api/ai/tts-minimax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "TTS failed" }));
        console.error("[Dictate] TTS error:", err);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error("[Dictate] Fetch error:", err);
    } finally {
      setIsDictating(false);
    }
  };

  const handleStopDictate = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

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
    <div className="border-t border-slate-200/60 dark:border-slate-800/80 glass px-5 py-3.5 dark:bg-slate-950/70">
      {/* Status line */}
      {(isRunning || error || (missionPrompt && missionStatus === "stopped")) && (
        <div className="flex items-center gap-2 mb-2.5 px-1">
          {isRunning && (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-green-700 dark:text-emerald-300 font-medium">Agents researching</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 truncate">&mdash; {missionPrompt}</span>
            </>
          )}
          {!isRunning && missionPrompt && missionStatus === "stopped" && (
            <span className="text-xs text-slate-500 dark:text-slate-300">
              Mission completed &mdash; {missionPrompt}
            </span>
          )}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex items-center gap-3 bg-slate-50/80 dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a market to research... e.g., AI-powered wellness apps for Gen Z"
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none"
            disabled={isCreatingMission}
          />
        </div>

        {!isRunning ? (
          <>
            {/* Dictate button — MiniMax TTS */}
            <Button
              type="button"
              onClick={isPlaying ? handleStopDictate : handleDictate}
              disabled={isDictating || (!input.trim() && !missionPrompt)}
              title={isPlaying ? "Stop dictation" : "Dictate prompt using MiniMax TTS"}
              className={`h-10 w-10 p-0 rounded-2xl shrink-0 transition-all ${
                isPlaying
                  ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400/50"
                  : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
              }`}
            >
              {isDictating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>

            {/* Launch Mission button */}
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
          </>
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
            className="h-10 px-3 rounded-2xl text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
