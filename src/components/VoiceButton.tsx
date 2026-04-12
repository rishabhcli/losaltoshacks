import { useState, useRef } from "react";
import { Volume2, Loader2, Square } from "lucide-react";

interface VoiceButtonProps {
  getText: () => string;
  className?: string;
  label?: string;
  size?: "sm" | "md";
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export function VoiceButton({ getText, className = "", label = "Hear", size = "sm" }: VoiceButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    if (state === "playing") {
      audioRef.current?.pause();
      if (audioRef.current?.src) URL.revokeObjectURL(audioRef.current.src);
      setState("idle");
      return;
    }

    const text = getText();
    if (!text.trim()) return;

    setState("loading");
    try {
      const res = await fetch(`${API_BASE}/api/ai/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 5000) }),
      });
      if (!res.ok) throw new Error("TTS request failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      audio.onerror = () => setState("idle");
      await audio.play();
      setState("playing");
    } catch {
      setState("idle");
    }
  };

  const sizeClasses =
    size === "sm" ? "px-2.5 py-1.5 text-xs gap-1.5" : "px-3.5 py-2 text-sm gap-2";

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      onClick={handleClick}
      title="Listen with ElevenLabs"
      className={`inline-flex items-center font-medium rounded-lg border transition-colors shrink-0 ${sizeClasses} ${
        state === "playing"
          ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-400"
          : state === "loading"
            ? "bg-slate-50 border-slate-200 text-slate-400 cursor-wait dark:bg-slate-800 dark:border-slate-700"
            : "bg-white border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-400"
      } ${className}`}
    >
      {state === "loading" ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : state === "playing" ? (
        <Square className={iconSize} />
      ) : (
        <Volume2 className={iconSize} />
      )}
      {state === "loading" ? "Generating…" : state === "playing" ? "Stop" : label}
    </button>
  );
}
