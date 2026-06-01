import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type VentureWorkspaceExperiment } from "@/lib/venture-workspace";

export function ExperimentResultEntryPanel({
  experiment,
  resultDraft,
  interpretationDraft,
  canSaveExperiment,
  onResultDraftChange,
  onInterpretationDraftChange,
  onSaveExperiment,
}: {
  experiment: VentureWorkspaceExperiment | undefined;
  resultDraft: string;
  interpretationDraft: string;
  canSaveExperiment: boolean;
  onResultDraftChange: (value: string) => void;
  onInterpretationDraftChange: (value: string) => void;
  onSaveExperiment: () => void;
}) {
  if (!experiment) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/70 dark:bg-blue-950/20">
      <div className="mb-1 flex items-center gap-2">
        <FlaskConical className="h-4 w-4 text-blue-600" />
        <h3 className="text-xs font-semibold text-blue-800 dark:text-blue-200">{experiment.type}</h3>
      </div>
      <p className="text-xs leading-relaxed text-blue-700/80 dark:text-blue-200/80">{experiment.hypothesis}</p>
      <p className="mt-1 text-[11px] text-blue-700/70 dark:text-blue-200/70">Next: {experiment.nextAction}</p>
      {experiment.result !== "Not run yet." && (
        <div className="rounded-md border border-blue-200 bg-white/70 p-2 dark:border-blue-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Recorded result</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{experiment.result}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{experiment.interpretation}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea
          value={resultDraft}
          onChange={(event) => onResultDraftChange(event.target.value)}
          placeholder="Record measured result..."
          className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={interpretationDraft}
          onChange={(event) => onInterpretationDraftChange(event.target.value)}
          placeholder="Interpret the signal..."
          className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onSaveExperiment}
        disabled={!canSaveExperiment}
        className="h-8 self-start bg-blue-600 text-xs hover:bg-blue-700"
      >
        Save experiment result
      </Button>
    </div>
  );
}
