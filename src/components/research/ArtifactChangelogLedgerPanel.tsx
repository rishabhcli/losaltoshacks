import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  VENTURE_ARTIFACT_STATUS_OPTIONS,
  VENTURE_ARTIFACT_TYPE_OPTIONS,
  type VentureArtifactRecord,
  type VentureArtifactStatus,
  type VentureArtifactType,
} from "@/lib/venture-portfolio";

function artifactStatusBadge(status: VentureArtifactStatus) {
  if (status === "verified") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "attached") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (status === "superseded") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function artifactStatusLabel(status: VentureArtifactStatus) {
  return VENTURE_ARTIFACT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function artifactTypeLabel(type: VentureArtifactType) {
  return VENTURE_ARTIFACT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export function ArtifactChangelogLedgerPanel({
  artifactRecordCount,
  latestArtifactRecord,
  artifactType,
  artifactStatus,
  artifactTitleDraft,
  artifactUriDraft,
  artifactOwnerDraft,
  artifactCommandDraft,
  artifactEvidenceDraft,
  artifactChangeDraft,
  canSaveArtifact,
  onArtifactTypeChange,
  onArtifactStatusChange,
  onArtifactTitleDraftChange,
  onArtifactUriDraftChange,
  onArtifactOwnerDraftChange,
  onArtifactCommandDraftChange,
  onArtifactEvidenceDraftChange,
  onArtifactChangeDraftChange,
  onSaveArtifact,
}: {
  artifactRecordCount: number;
  latestArtifactRecord?: VentureArtifactRecord;
  artifactType: VentureArtifactType;
  artifactStatus: VentureArtifactStatus;
  artifactTitleDraft: string;
  artifactUriDraft: string;
  artifactOwnerDraft: string;
  artifactCommandDraft: string;
  artifactEvidenceDraft: string;
  artifactChangeDraft: string;
  canSaveArtifact: boolean;
  onArtifactTypeChange: (value: VentureArtifactType) => void;
  onArtifactStatusChange: (value: VentureArtifactStatus) => void;
  onArtifactTitleDraftChange: (value: string) => void;
  onArtifactUriDraftChange: (value: string) => void;
  onArtifactOwnerDraftChange: (value: string) => void;
  onArtifactCommandDraftChange: (value: string) => void;
  onArtifactEvidenceDraftChange: (value: string) => void;
  onArtifactChangeDraftChange: (value: string) => void;
  onSaveArtifact: () => void;
}) {
  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 dark:border-sky-900/70 dark:bg-sky-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <PackageCheck className="h-4 w-4 text-sky-700 dark:text-sky-300" />
        <h3 className="text-xs font-semibold text-sky-900 dark:text-sky-100">Artifact and changelog ledger</h3>
        <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
          {artifactRecordCount} record{artifactRecordCount === 1 ? "" : "s"}
        </Badge>
        {latestArtifactRecord && (
          <Badge variant="secondary" className={artifactStatusBadge(latestArtifactRecord.status)}>
            {artifactStatusLabel(latestArtifactRecord.status)}
          </Badge>
        )}
      </div>
      {latestArtifactRecord ? (
        <div className="mt-2 rounded-md border border-sky-200 bg-white/75 p-2 dark:border-sky-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-200">Latest artifact record</span>
            <Badge variant="secondary" className={artifactStatusBadge(latestArtifactRecord.status)}>
              {artifactStatusLabel(latestArtifactRecord.status)}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
              {artifactTypeLabel(latestArtifactRecord.artifactType)}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestArtifactRecord.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{latestArtifactRecord.uri}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestArtifactRecord.owner}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Command: {latestArtifactRecord.verificationCommand}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Evidence: {latestArtifactRecord.evidence}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Change: {latestArtifactRecord.changeSummary}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-sky-800/70 dark:text-sky-200/70">
          No artifact record has been saved yet.
        </p>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_160px_160px]">
        <Input
          value={artifactTitleDraft}
          onChange={(event) => onArtifactTitleDraftChange(event.target.value)}
          placeholder="Artifact title"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Input
          value={artifactUriDraft}
          onChange={(event) => onArtifactUriDraftChange(event.target.value)}
          placeholder="Artifact URI"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Select value={artifactType} onValueChange={(value) => onArtifactTypeChange(value as VentureArtifactType)}>
          <SelectTrigger
            aria-label="Artifact type"
            size="sm"
            className="w-full border-sky-200 bg-white/80 text-xs dark:border-sky-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_ARTIFACT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={artifactStatus} onValueChange={(value) => onArtifactStatusChange(value as VentureArtifactStatus)}>
          <SelectTrigger
            aria-label="Artifact status"
            size="sm"
            className="w-full border-sky-200 bg-white/80 text-xs dark:border-sky-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_ARTIFACT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input
          value={artifactOwnerDraft}
          onChange={(event) => onArtifactOwnerDraftChange(event.target.value)}
          placeholder="Artifact owner"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Input
          value={artifactCommandDraft}
          onChange={(event) => onArtifactCommandDraftChange(event.target.value)}
          placeholder="Verification command"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea
          value={artifactEvidenceDraft}
          onChange={(event) => onArtifactEvidenceDraftChange(event.target.value)}
          placeholder="Record artifact evidence..."
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={artifactChangeDraft}
          onChange={(event) => onArtifactChangeDraftChange(event.target.value)}
          placeholder="Record changelog summary..."
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onSaveArtifact}
        disabled={!canSaveArtifact}
        className="mt-2 h-8 self-start bg-sky-700 text-xs text-white hover:bg-sky-800"
      >
        Save artifact record
      </Button>
    </div>
  );
}
