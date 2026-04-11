"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Pause, Play, Loader2, Radio, FileText, RotateCcw } from "lucide-react";

interface AudioBriefingProps {
  trendIds: string[];
}

type Status = "idle" | "generating_script" | "generating_audio" | "ready" | "error";

export default function AudioBriefing({ trendIds }: AudioBriefingProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [scriptText, setScriptText] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Deterministic bar heights for the audio visualizer animation
  const barHeights = useMemo(() => [14,22,8,18,10,24,6,20,12,16,9,21,7,19,13,23,11,17,15,20,8,22,10,18], []);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setScriptText(null);
    setPlaying(false);
    setErrorMsg(null);
    setShowScript(false);
    setStatus("idle");
  }, [audioUrl]);

  async function handleGenerate() {
    setStatus("generating_script");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trendIds }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("audio")) {
        setStatus("generating_audio");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Script isn't returned when audio is returned — fetch it separately
        setScriptText(null);
        setStatus("ready");
      } else {
        const data = await res.json();
        if (data.error) {
          setErrorMsg(data.error);
          setStatus("error");
          return;
        }
        setScriptText(data.script || null);
        setStatus("ready");
      }
    } catch (error) {
      console.error("Briefing error:", error);
      setErrorMsg(String(error));
      setStatus("error");
    }
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  const isLoading = status === "generating_script" || status === "generating_audio";
  const statusLabel =
    status === "generating_script" ? "Generating script..." :
    status === "generating_audio" ? "Synthesizing audio..." : "";

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
            <Radio className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Audio Briefing</h4>
            <p className="text-xs text-gray-400">
              AI-generated executive summary · ElevenLabs TTS
            </p>
          </div>
        </div>
        {status === "ready" && (
          <button onClick={reset} className="text-gray-400 hover:text-white transition-colors" title="Reset">
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Generate button */}
      {status === "idle" && (
        <button
          onClick={handleGenerate}
          disabled={trendIds.length === 0}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 className="h-4 w-4" />
          Generate Audio Briefing
        </button>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          {statusLabel}
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="space-y-2">
          <p className="text-sm text-red-400">⚠ {errorMsg || "Something went wrong"}</p>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-white underline">
            Try again
          </button>
        </div>
      )}

      {/* Audio player */}
      <AnimatePresence>
        {audioUrl && status === "ready" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} />
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shrink-0"
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <div className="flex-1 flex items-end gap-0.5 h-6">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm bg-indigo-400"
                    animate={playing
                      ? { height: [3, barHeights[i], 3] }
                      : { height: 3 }
                    }
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.04 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Script text (fallback or toggle) */}
      {status === "ready" && scriptText && !audioUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-gray-800 p-3 text-sm text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto"
        >
          <p className="text-xs text-amber-400 mb-2 font-medium">
            ⚠ ElevenLabs not configured — showing script text
          </p>
          {scriptText}
        </motion.div>
      )}

      {/* Script toggle when audio is available */}
      {status === "ready" && audioUrl && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button
            onClick={() => setShowScript(!showScript)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <FileText className="h-3 w-3" />
            {showScript ? "Hide script" : "View script"}
          </button>
          <AnimatePresence>
            {showScript && scriptText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 rounded-lg bg-gray-800 p-3 text-sm text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto"
              >
                {scriptText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
