import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useOsdkObjects, marketInsight, marketTrend } from "@/lib/osdk-shims";
import { Play, Pause, Volume2, SkipBack, SkipForward, Clock, Sparkles, FileText, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingState } from "@/components/market/LoadingState";
import { usePreferences } from "@/hooks/usePreferences";
import { getIndustryLabel } from "@/lib/industry";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { inferWithOpenAI } from "@/lib/openai";
import { generateAudio } from "@/lib/elevenlabs";

/** Generates a realistic executive briefing script from trend and insight data */
function generateBriefingScript(
  trends: Array<{ title: string | undefined; trendScore: number | undefined; status: string | undefined; industry: string | undefined; growthRate: number | undefined; description: string | undefined }>,
  insights: Array<{ title: string | undefined; summary: string | undefined; insightType: string | undefined; industry: string | undefined }>,
  industry: string,
): string {
  const topTrends = trends
    .filter(t => t.status === "growing" || t.status === "emerging")
    .sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0))
    .slice(0, 3);

  const alerts = insights.filter(i => i.insightType === "alert").slice(0, 2);
  const opportunities = insights.filter(i => i.insightType === "opportunity").slice(0, 2);

  const date = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const industryLabel = industry !== "All" ? getIndustryLabel(industry) : "all tracked sectors";

  let script = `Good morning. Here's your MarketPulse intelligence briefing for ${industryLabel}, prepared on ${date}.\n\n`;

  if (topTrends.length > 0) {
    script += `We're currently tracking ${trends.length} active trends. Let me walk you through the top signals.\n\n`;

    topTrends.forEach((t, i) => {
      script += `Number ${i + 1}: ${t.title}. `;
      script += `This trend is currently ${t.status} with a score of ${t.trendScore?.toFixed(0) ?? "N/A"} `;
      if (t.growthRate != null) {
        script += `and a growth rate of ${t.growthRate.toFixed(1)} percent. `;
      }
      if (t.description) {
        // Take first sentence of description
        const firstSentence = t.description.split(/\.\s/)[0];
        script += `${firstSentence}.\n\n`;
      }
    });
  }

  if (alerts.length > 0) {
    script += `Now for key alerts. `;
    alerts.forEach(a => {
      script += `${a.title}: ${a.summary?.split(/\.\s/).slice(0, 2).join(". ")}.\n\n`;
    });
  }

  if (opportunities.length > 0) {
    script += `Looking at opportunities. `;
    opportunities.forEach(o => {
      script += `${o.title}: ${o.summary?.split(/\.\s/).slice(0, 2).join(". ")}.\n\n`;
    });
  }

  script += `That's your briefing. MarketPulse will continue monitoring these signals and alert you to any significant changes. Have a productive day.`;

  return script;
}

function buildOpenAIPrompt(
  trends: Array<{ title: string | undefined; trendScore: number | undefined; status: string | undefined; industry: string | undefined; growthRate: number | undefined; description: string | undefined }>,
  insights: Array<{ title: string | undefined; summary: string | undefined; insightType: string | undefined; industry: string | undefined }>,
  industry: string,
): string {
  return [
    "Create a spoken executive market intelligence briefing for the following dataset.",
    "Return plain text only.",
    "Use 5 to 7 short paragraphs with no markdown or bullet points.",
    "Cover the strongest growth signals, the top risks, and the clearest opportunities.",
    "End with a short operator-style takeaway.",
    "",
    `Industry focus: ${industry}`,
    "",
    `Trend data: ${JSON.stringify(trends.slice(0, 8))}`,
    "",
    `Insight data: ${JSON.stringify(insights.slice(0, 8))}`,
  ].join("\n");
}

export function Briefing() {
  const { preferences } = usePreferences();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [highlightedParagraph, setHighlightedParagraph] = useState(0);
  const [liveScript, setLiveScript] = useState<string | null>(null);
  const [liveModel, setLiveModel] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: trends, isLoading: trendsLoading } = useOsdkObjects(marketTrend, {
    orderBy: { trendScore: "desc" },
    pageSize: 50,
  });

  const { data: insights, isLoading: insightsLoading } = useOsdkObjects(marketInsight, {
    orderBy: { generatedAt: "desc" },
    pageSize: 50,
  });

  const filteredTrends = useMemo(() => {
    if (!trends) return [];
    if (preferences.industry === "All") return [...trends];
    return trends.filter(t => t.industry === preferences.industry);
  }, [trends, preferences.industry]);

  const filteredInsights = useMemo(() => {
    if (!insights) return [];
    if (preferences.industry === "All") return [...insights];
    return insights.filter(i => i.industry === preferences.industry || i.industry === "All");
  }, [insights, preferences.industry]);

  const draftScript = useMemo(() => {
    if (!filteredTrends.length && !filteredInsights.length) return "";
    return generateBriefingScript(filteredTrends, filteredInsights, preferences.industry);
  }, [filteredTrends, filteredInsights, preferences.industry]);

  const displayedScript = liveScript ?? draftScript;

  const paragraphs = useMemo(() => displayedScript.split("\n\n").filter(Boolean), [displayedScript]);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setPlayRequested(false);
    setCurrentTime(0);
    setAudioUrl(null);
    setDuration(0);
    setHighlightedParagraph(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const generateLiveBriefing = useCallback(async () => {
    setIsGenerating(true);
    setGenerationError(null);
    resetPlayback();

    try {
      const result = await inferWithOpenAI({
        systemPrompt:
          "You are MarketPulse, an executive market intelligence analyst. Produce concise, high-signal briefings for business operators.",
        userPrompt: buildOpenAIPrompt(filteredTrends, filteredInsights, preferences.industry),
        temperature: 1,
      });

      setLiveScript(result.text);
      setLiveModel(result.model);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "OpenAI generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }, [filteredInsights, filteredTrends, preferences.industry, resetPlayback]);

  const useDraftBriefing = useCallback(() => {
    setLiveScript(null);
    setLiveModel(null);
    setGenerationError(null);
    resetPlayback();
  }, [resetPlayback]);

  // Pre-fetch audio as soon as script is ready
  useEffect(() => {
    if (displayedScript.trim() && !audioUrl && !isGeneratingAudio) {
      // Debounce pre-fetch slightly to avoid hitting API during rapid filter changes
      const timer = setTimeout(() => {
        void (async () => {
          setIsGeneratingAudio(true);
          setGenerationError(null);
          try {
            const url = await generateAudio(displayedScript);
            setAudioUrl(url);
          } catch (error) {
            console.error("Audio pre-fetch failed", error);
            // Don't show blocking error for background pre-fetch,
            // only if user actually requested play (handled in togglePlay)
          } finally {
            setIsGeneratingAudio(false);
          }
        })();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [displayedScript, audioUrl, isGeneratingAudio]);

  // Handle Play/Pause
  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      setIsPlaying(false);
      setPlayRequested(false);
      audioRef.current?.pause();
    } else {
      if (!audioUrl) {
        // If not loaded yet, set a flag to play as soon as pre-fetch finishes
        setPlayRequested(true);
        if (!isGeneratingAudio) {
          // If pre-fetch hasn't even started (or failed), trigger it now
          setIsGeneratingAudio(true);
          try {
            const url = await generateAudio(displayedScript);
            setAudioUrl(url);
          } catch (error) {
            setGenerationError(error instanceof Error ? error.message : "Audio generation failed.");
            setPlayRequested(false);
          } finally {
            setIsGeneratingAudio(false);
          }
        }
      } else {
        setIsPlaying(true);
        audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));
      }
    }
  }, [isPlaying, audioUrl, displayedScript, isGeneratingAudio]);

  // Automatically start playing once the audio URL is set if the user clicked play early
  useEffect(() => {
    if (audioUrl && playRequested && !isPlaying && audioRef.current) {
      setIsPlaying(true);
      setPlayRequested(false);
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed", e);
        setIsPlaying(false);
      });
    }
  }, [audioUrl, playRequested, isPlaying]);

  // Reset playback if the industry/preferences change
  useEffect(() => {
    resetPlayback();
  }, [preferences.industry, resetPlayback]);

  // Estimated duration: ~150 words per minute speaking rate
  const wordCount = displayedScript.trim() ? displayedScript.trim().split(/\s+/).length : 0;
  const estimatedDuration = Math.ceil((wordCount / 150) * 60); // seconds
  const actualDuration = duration > 0 && duration !== Infinity ? duration : estimatedDuration;

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Update highlighted paragraph based on time
  useEffect(() => {
    if (paragraphs.length === 0 || actualDuration === 0) return;
    const timePerParagraph = actualDuration / paragraphs.length;
    const idx = Math.min(Math.floor(currentTime / timePerParagraph), paragraphs.length - 1);
    setHighlightedParagraph(idx);
  }, [currentTime, paragraphs.length, actualDuration]);

  const progress = actualDuration > 0 ? (currentTime / actualDuration) * 100 : 0;

  // Generate stable visual variation without restricted randomness.
  const waveformBars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, index) => {
        const wave = Math.sin((index + 1) * 1.37) + Math.cos((index + 1) * 0.61);
        return 0.2 + ((wave + 2) / 4) * 0.8;
      }),
    [],
  );

  if ((trendsLoading || insightsLoading) && (!trends || !insights)) {
    return <LoadingState label="Preparing briefing" />;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-blue-600" />
                <h1 className="text-4xl font-semibold text-slate-900">Intelligence Briefing</h1>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                AI-generated executive summary for {getIndustryLabel(preferences.industry)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={generateLiveBriefing} disabled={isGenerating || filteredTrends.length === 0}>
                {isGenerating ? "Generating with OpenAI..." : "Generate with OpenAI"}
              </Button>
              {liveScript ? (
                <Button variant="outline" onClick={useDraftBriefing} disabled={isGenerating}>
                  Use draft version
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {generationError ? (
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>System Error</AlertTitle>
            <AlertDescription>{generationError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="text-xs text-slate-500">
          Source: {liveScript ? `Live OpenAI response${liveModel ? ` (${liveModel})` : ""}` : "Local draft from trend data"}
        </div>

        {/* Audio Player Card */}
        <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />

          {/* Waveform Visualizer */}
          <div className="flex items-end justify-center gap-[2px] h-20 mb-6 px-4">
            {waveformBars.map((height, i) => {
              const barProgress = (i / waveformBars.length) * 100;
              const isPast = barProgress < progress;
              const isCurrent = Math.abs(barProgress - progress) < (100 / waveformBars.length);
              return (
                <div
                  key={i}
                  className={`w-[3px] rounded-full transition-all duration-150 ${
                    isCurrent
                      ? "bg-blue-600"
                      : isPast
                        ? "bg-blue-400"
                        : "bg-slate-200"
                  }`}
                  style={{
                    height: `${height * 100}%`,
                    opacity: isCurrent ? 1 : isPast ? 0.8 : 0.5,
                  }}
                />
              );
            })}
          </div>

          {/* Progress bar */}
          <button
            type="button"
            className="relative h-1 w-full bg-slate-200 rounded-full mb-4 cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const newTime = pct * actualDuration;
              setCurrentTime(newTime);
              if (audioRef.current && audioUrl) {
                audioRef.current.currentTime = newTime;
              }
            }}
            aria-label="Jump to a position in the briefing"
          >
            <div
              className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: "-6px" }}
            />
          </button>

          {/* Time labels */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium tabular-nums mb-5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(actualDuration)}</span>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                const newTime = Math.max(0, currentTime - 10);
                setCurrentTime(newTime);
                if (audioRef.current && audioUrl) audioRef.current.currentTime = newTime;
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Skip back 10 seconds"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              disabled={isGeneratingAudio && playRequested}
              className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                (isGeneratingAudio && playRequested) ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"
              }`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {(isGeneratingAudio && playRequested) ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => {
                const newTime = Math.min(actualDuration, currentTime + 10);
                setCurrentTime(newTime);
                if (audioRef.current && audioUrl) audioRef.current.currentTime = newTime;
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>~{Math.ceil(actualDuration / 60)} min briefing</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>ElevenLabs Voice</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{wordCount} words</span>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-4">Transcript</h2>
          <div className="space-y-3">
            {paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={`text-sm leading-relaxed transition-all duration-300 ${
                  idx === highlightedParagraph && isPlaying
                    ? "text-slate-900 dark:text-slate-100 font-medium bg-blue-50/50 dark:bg-blue-950/30 -mx-3 px-3 py-2 rounded-lg border-l-2 border-blue-400 dark:border-blue-500"
                    : idx < highlightedParagraph && currentTime > 0
                      ? "text-slate-400"
                      : "text-slate-600"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Covered trends */}
        <div className="border border-slate-200 glass rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-4">
            Trends Covered in This Briefing
          </h2>
          <div className="flex flex-wrap gap-2">
            {filteredTrends
              .filter(t => t.status === "growing" || t.status === "emerging")
              .sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0))
              .slice(0, 5)
              .map(t => (
                <span
                  key={t.$primaryKey}
                  className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-md border border-blue-100 dark:border-blue-800"
                >
                  {t.title} — Score {t.trendScore?.toFixed(0)}
                </span>
              ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
