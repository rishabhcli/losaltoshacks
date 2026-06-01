import { Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureCompetitorCandidate,
  type VentureCompetitorRecord,
  type VentureCompetitorThreatLevel,
} from "@/lib/venture-portfolio";

function competitorThreatBadge(threat: VentureCompetitorThreatLevel) {
  if (threat === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (threat === "high") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (threat === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function CompetitorWatchlistPanel({
  competitorCount,
  competitorCandidateCount,
  latestCompetitor,
  firstCompetitorCandidate,
  competitorNameDraft,
  competitorOwnerDraft,
  competitorPositioningDraft,
  competitorEvidenceDraft,
  competitorDifferentiationDraft,
  competitorResponseDraft,
  competitorCadenceDraft,
  competitorNextActionDraft,
  canSaveCompetitor,
  onCompetitorNameDraftChange,
  onCompetitorOwnerDraftChange,
  onCompetitorPositioningDraftChange,
  onCompetitorEvidenceDraftChange,
  onCompetitorDifferentiationDraftChange,
  onCompetitorResponseDraftChange,
  onCompetitorCadenceDraftChange,
  onCompetitorNextActionDraftChange,
  onSaveCompetitor,
}: {
  competitorCount: number;
  competitorCandidateCount: number;
  latestCompetitor?: VentureCompetitorRecord;
  firstCompetitorCandidate?: VentureCompetitorCandidate;
  competitorNameDraft: string;
  competitorOwnerDraft: string;
  competitorPositioningDraft: string;
  competitorEvidenceDraft: string;
  competitorDifferentiationDraft: string;
  competitorResponseDraft: string;
  competitorCadenceDraft: string;
  competitorNextActionDraft: string;
  canSaveCompetitor: boolean;
  onCompetitorNameDraftChange: (value: string) => void;
  onCompetitorOwnerDraftChange: (value: string) => void;
  onCompetitorPositioningDraftChange: (value: string) => void;
  onCompetitorEvidenceDraftChange: (value: string) => void;
  onCompetitorDifferentiationDraftChange: (value: string) => void;
  onCompetitorResponseDraftChange: (value: string) => void;
  onCompetitorCadenceDraftChange: (value: string) => void;
  onCompetitorNextActionDraftChange: (value: string) => void;
  onSaveCompetitor: () => void;
}) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/70 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <Radar className="h-4 w-4 text-amber-700 dark:text-amber-300" />
        <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-100">Competitor watchlist</h3>
        <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
          {competitorCount} watch{competitorCount === 1 ? "" : "es"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
          {competitorCandidateCount} inbox signal{competitorCandidateCount === 1 ? "" : "s"}
        </Badge>
      </div>
      {latestCompetitor ? (
        <div className="mt-2 rounded-md border border-amber-200 bg-white/75 p-2 dark:border-amber-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">Latest competitor watch</span>
            <Badge variant="secondary" className={competitorThreatBadge(latestCompetitor.threatLevel)}>
              {latestCompetitor.threatLevel}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
              {latestCompetitor.competitorType}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestCompetitor.competitorName}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestCompetitor.positioning}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Differentiation: {latestCompetitor.differentiation}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Response: {latestCompetitor.responsePlan}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Cadence: {latestCompetitor.watchCadence}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestCompetitor.nextAction}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-amber-800/70 dark:text-amber-200/70">No competitor watch has been saved yet.</p>
      )}
      {firstCompetitorCandidate && (
        <div className="mt-2 rounded-md border border-amber-200 bg-white/75 p-2 dark:border-amber-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">Competitor candidate</span>
            <Badge variant="secondary" className={competitorThreatBadge(firstCompetitorCandidate.suggestedThreatLevel)}>
              {firstCompetitorCandidate.suggestedThreatLevel}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-amber-800 dark:bg-slate-950/70 dark:text-amber-200">
              {firstCompetitorCandidate.competitorType}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstCompetitorCandidate.competitorName}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{firstCompetitorCandidate.positioning}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{firstCompetitorCandidate.nextAction}</p>
        </div>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input value={competitorNameDraft} onChange={(event) => onCompetitorNameDraftChange(event.target.value)} placeholder="Competitor name" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={competitorOwnerDraft} onChange={(event) => onCompetitorOwnerDraftChange(event.target.value)} placeholder="Competitor owner" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={competitorPositioningDraft} onChange={(event) => onCompetitorPositioningDraftChange(event.target.value)} placeholder="Competitor positioning" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={competitorEvidenceDraft} onChange={(event) => onCompetitorEvidenceDraftChange(event.target.value)} placeholder="Competitor evidence" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={competitorDifferentiationDraft} onChange={(event) => onCompetitorDifferentiationDraftChange(event.target.value)} placeholder="Differentiation plan" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={competitorResponseDraft} onChange={(event) => onCompetitorResponseDraftChange(event.target.value)} placeholder="Competitor response plan" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea value={competitorCadenceDraft} onChange={(event) => onCompetitorCadenceDraftChange(event.target.value)} placeholder="Competitor watch cadence" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={competitorNextActionDraft} onChange={(event) => onCompetitorNextActionDraftChange(event.target.value)} placeholder="Competitor next action" className="min-h-[56px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <Button type="button" size="sm" onClick={onSaveCompetitor} disabled={!canSaveCompetitor} className="mt-2 h-8 self-start bg-amber-700 text-xs text-white hover:bg-amber-800">
        Save competitor watch
      </Button>
    </div>
  );
}
