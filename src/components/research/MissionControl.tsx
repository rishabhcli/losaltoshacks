import { useRef, useState } from "react";
import { Loader2, Mic, Play, Square, RotateCcw, Search, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isRunning: boolean;
  isCreatingMission: boolean;
  missionPrompt: string;
  missionStatus: "queued" | "active" | "stopping" | "stopped" | "completed" | "error" | null;
  error: string | null;
  onCreateMission: (prompt: string) => void;
  onStopAll: () => void;
  onResetAll: () => void;
}

function getMissionStatusCopy(missionStatus: Props["missionStatus"]) {
  switch (missionStatus) {
    case "queued":
      return {
        tone: "amber" as const,
        label: "Worker pickup in progress",
      };
    case "active":
      return {
        tone: "green" as const,
        label: "Agents researching",
      };
    case "stopping":
      return {
        tone: "amber" as const,
        label: "Stopping current mission",
      };
    case "completed":
      return {
        tone: "slate" as const,
        label: "Mission completed",
      };
    case "stopped":
      return {
        tone: "slate" as const,
        label: "Mission stopped",
      };
    case "error":
      return {
        tone: "red" as const,
        label: "Mission error",
      };
    default:
      return null;
  }
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

  const handleRetryMission = () => {
    const prompt = missionPrompt.trim();
    if (!prompt || isCreatingMission || isRunning) return;
    onCreateMission(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLaunch();
    }
  };

  const statusCopy = getMissionStatusCopy(missionStatus);
  const canRecoverMission =
    Boolean(missionPrompt.trim()) &&
    !isRunning &&
    !isCreatingMission &&
    (missionStatus === "error" || missionStatus === "stopped");
  const statusToneClasses = statusCopy?.tone === "green"
    ? {
        dotOuter: "bg-green-400",
        dotInner: "bg-green-500",
        text: "text-green-700 dark:text-emerald-300",
      }
    : statusCopy?.tone === "amber"
      ? {
          dotOuter: "bg-amber-400",
          dotInner: "bg-amber-500",
          text: "text-amber-700 dark:text-amber-300",
        }
      : statusCopy?.tone === "red"
        ? {
            dotOuter: "bg-red-400",
            dotInner: "bg-red-500",
            text: "text-red-700 dark:text-red-300",
          }
        : {
            dotOuter: "bg-slate-400",
            dotInner: "bg-slate-500",
            text: "text-slate-500 dark:text-slate-300",
          };

  return (
    <div className="border-t border-slate-200/60 dark:border-slate-800/80 glass px-3 py-3 dark:bg-slate-950/70 sm:px-5 sm:py-3.5">
      {/* Status line */}
      {(statusCopy || error) && (
        <div className="flex flex-wrap items-center gap-2 mb-2.5 px-1">
          {statusCopy && missionPrompt && (
            <>
              <span className="relative flex h-2 w-2">
                {(missionStatus === "queued" || missionStatus === "active" || missionStatus === "stopping") && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusToneClasses.dotOuter}`} />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${statusToneClasses.dotInner}`} />
              </span>
              <span className={`text-xs font-medium ${statusToneClasses.text}`}>{statusCopy.label}</span>
              <span className="min-w-0 flex-1 text-xs text-slate-400 dark:text-slate-500 truncate">&mdash; {missionPrompt}</span>
            </>
          )}
          {error && <span className="text-xs text-red-600">{error}</span>}
          {canRecoverMission && (
            <div className="flex w-full flex-wrap items-center gap-1.5 sm:ml-auto sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onResetAll}
                className="h-7 rounded-lg border-slate-200 px-2.5 text-[11px] text-slate-600 hover:text-slate-900 dark:border-slate-800/80 dark:text-slate-300 dark:hover:text-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Mission
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleRetryMission}
                className="h-7 rounded-lg bg-blue-600 px-2.5 text-[11px] text-white hover:bg-blue-700"
              >
                <Play className="w-3.5 h-3.5" />
                Retry Prompt
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Input bar */}
      <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 bg-slate-50/80 dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            aria-label="Research mission prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRunning ? "Ask a new research question to replace the current mission" : "Describe a market to research... e.g., AI-powered wellness apps for Gen Z"}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none"
            disabled={isCreatingMission}
          />
        </div>

        {/* Dictate button — MiniMax TTS */}
        <Button
          type="button"
          aria-label={isPlaying ? "Stop prompt dictation" : "Dictate research mission prompt"}
          onClick={isPlaying ? handleStopDictate : handleDictate}
          disabled={isDictating || (!input.trim() && !missionPrompt)}
          title={isPlaying ? "Stop dictation" : "Dictate prompt using MiniMax TTS"}
          className={`h-10 w-full p-0 rounded-2xl shrink-0 transition-all sm:w-10 ${
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

        <Button
          onClick={handleLaunch}
          disabled={!input.trim() || isCreatingMission}
          className="h-10 w-full px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm font-medium shrink-0 sm:w-auto"
        >
          {isCreatingMission ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isCreatingMission ? "Launching..." : isRunning ? "Start New Mission" : "Launch Mission"}
        </Button>

        {isRunning && (
          <Button
            onClick={onStopAll}
            variant="destructive"
            className="h-10 w-full px-5 rounded-2xl gap-2 text-sm font-medium shrink-0 sm:w-auto"
          >
            <Square className="w-4 h-4" />
            Stop All
          </Button>
        )}
        {missionPrompt && !isRunning && (
          <Button
            onClick={onResetAll}
            variant="outline"
            aria-label="Clear current mission"
            title="Clear current mission"
            className="h-10 w-full px-3 rounded-2xl text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 shrink-0 sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
