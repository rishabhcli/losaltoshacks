import { KeyRound, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function KillCriteriaDeploymentBoundaryPanel({
  killReason,
  deploymentBoundaryState,
  deploymentProofCount,
  expectedDeploymentProofCount,
  blockedDeploymentProofCount,
  verifiedDeploymentProofCount,
  deploymentProposalGateStatus,
  humanDeploymentGateStatus,
  approvalBoundaryLevel,
}: {
  killReason: string;
  deploymentBoundaryState: string;
  deploymentProofCount: number;
  expectedDeploymentProofCount: number;
  blockedDeploymentProofCount: number;
  verifiedDeploymentProofCount: number;
  deploymentProposalGateStatus: string;
  humanDeploymentGateStatus: string;
  approvalBoundaryLevel: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-red-200/80 bg-red-50/40 p-3 dark:border-red-900/60 dark:bg-red-950/20">
        <div className="mb-1 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <h3 className="text-xs font-semibold text-red-800 dark:text-red-200">Kill criteria</h3>
        </div>
        <p className="text-xs leading-relaxed text-red-700/80 dark:text-red-200/80">{killReason}</p>
      </div>
      <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <div className="mb-1 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Deployment approval boundary</h3>
        </div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
            {deploymentBoundaryState}
          </Badge>
          <Badge variant="secondary" className="bg-white/80 text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
            {deploymentProofCount} deployment proof{deploymentProofCount === 1 ? "" : "s"}
          </Badge>
          {expectedDeploymentProofCount > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              {expectedDeploymentProofCount} expected
            </Badge>
          )}
          {blockedDeploymentProofCount > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {blockedDeploymentProofCount} blocked proof
            </Badge>
          )}
          {verifiedDeploymentProofCount > 0 && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {verifiedDeploymentProofCount} verified
            </Badge>
          )}
        </div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
          Proposal: {deploymentProposalGateStatus}; human gate: {humanDeploymentGateStatus}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">{approvalBoundaryLevel}</p>
      </div>
    </div>
  );
}
