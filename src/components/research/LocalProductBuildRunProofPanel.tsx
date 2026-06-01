import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureProductBuildCommand,
  type VentureProductBuildCommandRunLedgerItem,
  type VentureProductBuildCommandRunState,
} from "@/lib/venture-portfolio";

export function LocalProductBuildRunProofPanel({
  command,
  latestProductBuildRun,
  productBuildRunState,
  productBuildRunOwnerDraft,
  productBuildRunProofDraft,
  productBuildArtifactProofDraft,
  productBuildVerifierProofDraft,
  productBuildRunLearningDraft,
  canSaveProductBuildRun,
  onProductBuildRunStateChange,
  onProductBuildRunOwnerDraftChange,
  onProductBuildRunProofDraftChange,
  onProductBuildArtifactProofDraftChange,
  onProductBuildVerifierProofDraftChange,
  onProductBuildRunLearningDraftChange,
  onSaveProductBuildRun,
}: {
  command?: VentureProductBuildCommand;
  latestProductBuildRun?: VentureProductBuildCommandRunLedgerItem;
  productBuildRunState: VentureProductBuildCommandRunState;
  productBuildRunOwnerDraft: string;
  productBuildRunProofDraft: string;
  productBuildArtifactProofDraft: string;
  productBuildVerifierProofDraft: string;
  productBuildRunLearningDraft: string;
  canSaveProductBuildRun: boolean;
  onProductBuildRunStateChange: (value: VentureProductBuildCommandRunState) => void;
  onProductBuildRunOwnerDraftChange: (value: string) => void;
  onProductBuildRunProofDraftChange: (value: string) => void;
  onProductBuildArtifactProofDraftChange: (value: string) => void;
  onProductBuildVerifierProofDraftChange: (value: string) => void;
  onProductBuildRunLearningDraftChange: (value: string) => void;
  onSaveProductBuildRun: () => void;
}) {
  if (!command) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/70 dark:bg-emerald-950/20">
      <div className="mb-1 flex items-center gap-2">
        <PackageCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Local product-build run proof</h3>
        <Badge variant="secondary" className="bg-white/70 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-200">
          Validation-backed build
        </Badge>
      </div>
      <p className="text-xs leading-relaxed text-emerald-800/90 dark:text-emerald-200/90">{command.title}</p>
      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Command: {command.buildCommand}</p>
      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Target: {command.artifactTarget}</p>
      {latestProductBuildRun && (
        <div className="rounded-md border border-emerald-200 bg-white/75 p-2 dark:border-emerald-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">Latest build run proof</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
            {latestProductBuildRun.runState}: {latestProductBuildRun.runProof}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Verifier proof: {latestProductBuildRun.verifierReportProof}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[180px_1fr]">
        <Select value={productBuildRunState} onValueChange={(value) => onProductBuildRunStateChange(value as VentureProductBuildCommandRunState)}>
          <SelectTrigger
            aria-label="Product build run state"
            size="sm"
            className="w-full border-emerald-200 bg-white/80 text-xs dark:border-emerald-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="executed">Executed</SelectItem>
            <SelectItem value="imported">Imported</SelectItem>
            <SelectItem value="promoted">Promoted</SelectItem>
          </SelectContent>
        </Select>
        <Input value={productBuildRunOwnerDraft} onChange={(event) => onProductBuildRunOwnerDraftChange(event.target.value)} placeholder="Product build run owner" className="bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea value={productBuildRunProofDraft} onChange={(event) => onProductBuildRunProofDraftChange(event.target.value)} placeholder="Local build run proof..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={productBuildArtifactProofDraft} onChange={(event) => onProductBuildArtifactProofDraftChange(event.target.value)} placeholder="Local artifact proof..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={productBuildVerifierProofDraft} onChange={(event) => onProductBuildVerifierProofDraftChange(event.target.value)} placeholder="Verifier report proof..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={productBuildRunLearningDraft} onChange={(event) => onProductBuildRunLearningDraftChange(event.target.value)} placeholder="Product build run learning..." className="min-h-[72px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <p className="text-[11px] leading-relaxed text-red-700 dark:text-red-200">
        No external build side effect: product-build run proof records local evidence only; it does not run commands, deploy, send outreach, spend, contact customers, or change billing.
      </p>
      <Button
        type="button"
        size="sm"
        onClick={onSaveProductBuildRun}
        disabled={!canSaveProductBuildRun}
        className="h-8 self-start bg-emerald-600 text-xs hover:bg-emerald-700"
      >
        Save product build run proof
      </Button>
    </div>
  );
}
