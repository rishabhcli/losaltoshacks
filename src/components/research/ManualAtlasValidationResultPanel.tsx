import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureAtlasValidationCommandPack,
  type VentureAtlasValidationResultOutcome,
  type VentureAtlasValidationResultRecord,
} from "@/lib/venture-portfolio";

export function ManualAtlasValidationResultPanel({
  validationPack,
  latestValidationResult,
  atlasValidationOutcome,
  atlasValidationBuyerDraft,
  atlasValidationPainDraft,
  atlasValidationWedgeDraft,
  atlasValidationPaidDraft,
  atlasValidationQuoteDraft,
  atlasValidationObjectionDraft,
  atlasValidationEvidenceDraft,
  atlasValidationLearningDraft,
  atlasValidationOwnerDraft,
  atlasValidationNextActionDraft,
  canSaveAtlasValidationResult,
  onAtlasValidationOutcomeChange,
  onAtlasValidationBuyerDraftChange,
  onAtlasValidationPainDraftChange,
  onAtlasValidationWedgeDraftChange,
  onAtlasValidationPaidDraftChange,
  onAtlasValidationQuoteDraftChange,
  onAtlasValidationObjectionDraftChange,
  onAtlasValidationEvidenceDraftChange,
  onAtlasValidationLearningDraftChange,
  onAtlasValidationOwnerDraftChange,
  onAtlasValidationNextActionDraftChange,
  onSaveAtlasValidationResult,
}: {
  validationPack?: VentureAtlasValidationCommandPack;
  latestValidationResult?: VentureAtlasValidationResultRecord;
  atlasValidationOutcome: VentureAtlasValidationResultOutcome;
  atlasValidationBuyerDraft: string;
  atlasValidationPainDraft: string;
  atlasValidationWedgeDraft: string;
  atlasValidationPaidDraft: string;
  atlasValidationQuoteDraft: string;
  atlasValidationObjectionDraft: string;
  atlasValidationEvidenceDraft: string;
  atlasValidationLearningDraft: string;
  atlasValidationOwnerDraft: string;
  atlasValidationNextActionDraft: string;
  canSaveAtlasValidationResult: boolean;
  onAtlasValidationOutcomeChange: (value: VentureAtlasValidationResultOutcome) => void;
  onAtlasValidationBuyerDraftChange: (value: string) => void;
  onAtlasValidationPainDraftChange: (value: string) => void;
  onAtlasValidationWedgeDraftChange: (value: string) => void;
  onAtlasValidationPaidDraftChange: (value: string) => void;
  onAtlasValidationQuoteDraftChange: (value: string) => void;
  onAtlasValidationObjectionDraftChange: (value: string) => void;
  onAtlasValidationEvidenceDraftChange: (value: string) => void;
  onAtlasValidationLearningDraftChange: (value: string) => void;
  onAtlasValidationOwnerDraftChange: (value: string) => void;
  onAtlasValidationNextActionDraftChange: (value: string) => void;
  onSaveAtlasValidationResult: () => void;
}) {
  if (!validationPack) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-violet-200 bg-violet-50/70 p-3 dark:border-violet-900/70 dark:bg-violet-950/20">
      <div className="mb-1 flex items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-violet-700 dark:text-violet-300" />
        <h3 className="text-xs font-semibold text-violet-900 dark:text-violet-100">Manual atlas validation result</h3>
        <Badge variant="secondary" className="bg-white/70 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
          Result ledger
        </Badge>
      </div>
      <p className="text-xs leading-relaxed text-violet-800/90 dark:text-violet-200/90">{validationPack.hypothesis}</p>
      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Source pack: {validationPack.title}
      </p>
      {latestValidationResult && (
        <div className="rounded-md border border-violet-200 bg-white/75 p-2 dark:border-violet-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-800 dark:text-violet-200">Latest validation result</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
            {latestValidationResult.outcome}: {latestValidationResult.qualifiedBuyerCount} qualified buyers, {latestValidationResult.hiddenWedgeResonanceCount} hidden-wedge confirmations, {latestValidationResult.paidPricingSignalCount} paid pricing signals.
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Demand drift score: {latestValidationResult.demandDriftScore}/100. Next: {latestValidationResult.nextAction}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
        <Select value={atlasValidationOutcome} onValueChange={(value) => onAtlasValidationOutcomeChange(value as VentureAtlasValidationResultOutcome)}>
          <SelectTrigger
            aria-label="Atlas validation outcome"
            size="sm"
            className="w-full border-violet-200 bg-white/80 text-xs dark:border-violet-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pivot">Pivot</SelectItem>
            <SelectItem value="inconclusive">Inconclusive</SelectItem>
          </SelectContent>
        </Select>
        <Input value={atlasValidationBuyerDraft} onChange={(event) => onAtlasValidationBuyerDraftChange(event.target.value)} placeholder="Validation buyer count" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={atlasValidationPainDraft} onChange={(event) => onAtlasValidationPainDraftChange(event.target.value)} placeholder="Validation pain count" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={atlasValidationWedgeDraft} onChange={(event) => onAtlasValidationWedgeDraftChange(event.target.value)} placeholder="Validation wedge count" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={atlasValidationPaidDraft} onChange={(event) => onAtlasValidationPaidDraftChange(event.target.value)} placeholder="Validation paid count" className="bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea value={atlasValidationQuoteDraft} onChange={(event) => onAtlasValidationQuoteDraftChange(event.target.value)} placeholder="Strongest validation quote..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={atlasValidationObjectionDraft} onChange={(event) => onAtlasValidationObjectionDraftChange(event.target.value)} placeholder="Strongest validation objection..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={atlasValidationEvidenceDraft} onChange={(event) => onAtlasValidationEvidenceDraftChange(event.target.value)} placeholder="Source-backed validation evidence..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={atlasValidationLearningDraft} onChange={(event) => onAtlasValidationLearningDraftChange(event.target.value)} placeholder="Validation learning..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input value={atlasValidationOwnerDraft} onChange={(event) => onAtlasValidationOwnerDraftChange(event.target.value)} placeholder="Validation owner" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={atlasValidationNextActionDraft} onChange={(event) => onAtlasValidationNextActionDraftChange(event.target.value)} placeholder="Validation next action" className="bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <p className="text-[11px] leading-relaxed text-violet-700 dark:text-violet-200">
        No external side effect: {validationPack.noExternalSideEffectProof}
      </p>
      <Button
        type="button"
        size="sm"
        onClick={onSaveAtlasValidationResult}
        disabled={!canSaveAtlasValidationResult}
        className="h-8 self-start bg-violet-600 text-xs hover:bg-violet-700"
      >
        Save atlas validation result
      </Button>
    </div>
  );
}
