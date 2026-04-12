import { useState, useEffect, useCallback } from "react";
import { Check, Loader2, Radio, Radar, Brain, BarChart3, Lightbulb, Target, Volume2 } from "lucide-react";

const PIPELINE_STAGES = [
  { id: "acquisition", label: "Signal Acquisition", icon: Radio, description: "Scanning public sources for market signals" },
  { id: "normalization", label: "Normalization", icon: Radar, description: "Cleaning, deduplicating, and scoring relevance" },
  { id: "clustering", label: "Pattern Detection", icon: Brain, description: "Identifying semantic clusters and themes" },
  { id: "scoring", label: "Trend Scoring", icon: BarChart3, description: "Multi-factor scoring: strength, momentum, freshness" },
  { id: "synthesis", label: "AI Synthesis", icon: Lightbulb, description: "Generating rich explanations and insights" },
  { id: "decisions", label: "Recommendations", icon: Target, description: "Creating actionable decision artifacts" },
  { id: "audio", label: "Briefing Generation", icon: Volume2, description: "Producing executive intelligence briefing" },
] as const;

interface PipelineProgressProps {
  /** If true, auto-plays the animation once */
  autoPlay?: boolean;
  /** Called when the animation completes */
  onComplete?: () => void;
  /** If true, shows the compact inline variant */
  compact?: boolean;
}

export function PipelineProgress({ autoPlay = true, onComplete, compact = false }: PipelineProgressProps) {
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const runPipeline = useCallback(() => {
    setCompletedStages([]);
    setActiveStage(null);
    setIsRunning(true);
    setFinished(false);

    let idx = 0;

    const advanceStage = () => {
      if (idx < PIPELINE_STAGES.length) {
        setActiveStage(PIPELINE_STAGES[idx].id);
        const delay = 800 + Math.random() * 1200; // 0.8s – 2s per stage
        setTimeout(() => {
          setCompletedStages(prev => [...prev, PIPELINE_STAGES[idx].id]);
          idx++;
          advanceStage();
        }, delay);
      } else {
        setActiveStage(null);
        setIsRunning(false);
        setFinished(true);
        onComplete?.();
      }
    };

    advanceStage();
  }, [onComplete]);

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(runPipeline, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, runPipeline]);

  const progress = Math.round((completedStages.length / PIPELINE_STAGES.length) * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {PIPELINE_STAGES.map(stage => {
            const isCompleted = completedStages.includes(stage.id);
            const isActive = activeStage === stage.id;
            return (
              <div
                key={stage.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-500 scale-100"
                    : isActive
                      ? "bg-blue-400 scale-125 animate-pulse"
                      : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>
        {isRunning && activeStage && (
          <span className="text-xs text-slate-500 animate-pulse">
            {PIPELINE_STAGES.find(s => s.id === activeStage)?.label}...
          </span>
        )}
        {finished && <span className="text-xs text-emerald-600 font-medium">Analysis complete</span>}
      </div>
    );
  }

  return (
    <div className="border border-slate-200 bg-teal-50/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base text-slate-900">Intelligence Pipeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {finished
              ? "All stages complete — insights are ready"
              : isRunning
                ? `Processing stage ${completedStages.length + 1} of ${PIPELINE_STAGES.length}...`
                : "Ready to analyze"}
          </p>
        </div>
        <div className="text-right">
          <span className="font-semibold text-2xl text-blue-600 tabular-nums">{progress}%</span>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Complete</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isCompleted = completedStages.includes(stage.id);
          const isActive = activeStage === stage.id;
          const isPending = !isCompleted && !isActive;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`relative flex flex-col items-center text-center p-3 rounded-lg transition-all duration-300 ${
                isCompleted
                  ? "bg-blue-50 border border-blue-200"
                  : isActive
                    ? "bg-blue-50/80 border border-blue-300 shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                    : "bg-white/50 border border-slate-100"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-500 text-white"
                    : isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-50 text-slate-300"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium leading-tight ${
                  isCompleted ? "text-blue-700" : isActive ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {stage.label}
              </span>

              {/* Step number */}
              <span
                className={`absolute top-1.5 right-1.5 text-[9px] font-semibold tabular-nums ${
                  isCompleted ? "text-blue-400" : isActive ? "text-blue-400" : "text-slate-200"
                }`}
              >
                {idx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active stage description */}
      {isRunning && activeStage && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
          <span>{PIPELINE_STAGES.find(s => s.id === activeStage)?.description}</span>
        </div>
      )}
    </div>
  );
}
