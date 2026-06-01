import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type {
  VentureDeploymentEnvironmentMatrix,
  VentureDeploymentEnvironmentStatus,
  VentureDeploymentEnvironmentTarget,
  VentureDeploymentReadinessPacket,
  VentureDeploymentReadinessStatus,
} from "@/lib/venture-portfolio";

function deploymentReadinessStatusBadge(status: VentureDeploymentReadinessStatus) {
  if (status === "proposal-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-proof") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function deploymentEnvironmentStatusBadge(status: VentureDeploymentEnvironmentStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-proof") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

export function DeploymentReadinessPacketPanel({
  deploymentPacket,
  deploymentMatrix,
  onStageDeploymentRehearsalProof,
  onStageDeploymentPromotionTask,
}: {
  deploymentPacket: VentureDeploymentReadinessPacket;
  deploymentMatrix: VentureDeploymentEnvironmentMatrix;
  onStageDeploymentRehearsalProof: () => void;
  onStageDeploymentPromotionTask: (target: VentureDeploymentEnvironmentTarget) => void;
}) {
  return (
    <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <PackageCheck className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
        <h3 className="text-xs font-semibold text-cyan-900 dark:text-cyan-100">Deployment readiness packet</h3>
        <Badge variant="secondary" className={deploymentReadinessStatusBadge(deploymentPacket.status)}>
          {deploymentPacket.status}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          Readiness {deploymentPacket.readinessScore}/100
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          Deployment proof {deploymentPacket.deploymentProofStatus}
        </Badge>
      </div>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{deploymentPacket.noDeployBoundary}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{deploymentPacket.approvalBoundary}</p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onStageDeploymentRehearsalProof}
        className="mt-2 h-8 border-cyan-200 bg-white/80 text-xs text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
      >
        Stage deployment rehearsal proof
      </Button>
      <div className="mt-2 rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Deployment environment matrix</div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{deploymentMatrix.productionBoundary}</p>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
          {deploymentMatrix.targets.map((target) => (
            <div key={target.id} className="rounded-md border border-cyan-200 bg-cyan-50/60 p-2 dark:border-cyan-900/70 dark:bg-cyan-950/20">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">{target.label}</span>
                <Badge variant="secondary" className={deploymentEnvironmentStatusBadge(target.status)}>
                  {target.status}
                </Badge>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{target.proofSummary}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{target.approvalBoundary}</p>
              {target.linkedRoadmapTaskTitle && (
                <p className="mt-1 text-[11px] leading-relaxed text-cyan-700 dark:text-cyan-200">
                  Roadmap task: {target.linkedRoadmapTaskTitle} ({target.linkedRoadmapTaskStatus}, owner {target.linkedRoadmapTaskOwner ?? "unknown"})
                </p>
              )}
              {target.linkedSupportIssueTitle && (
                <p className="mt-1 text-[11px] leading-relaxed text-cyan-700 dark:text-cyan-200">
                  Support issue: {target.linkedSupportIssueTitle} ({target.linkedSupportIssueStatus}, owner {target.linkedSupportIssueOwner ?? "unknown"})
                </p>
              )}
              {target.status !== "ready" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onStageDeploymentPromotionTask(target)}
                  className="mt-2 h-7 border-cyan-200 bg-white/80 text-[11px] text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-slate-950/70 dark:text-cyan-200"
                >
                  Stage {target.label} roadmap task
                </Button>
              )}
            </div>
          ))}
        </div>
        <Textarea
          aria-label="Deployment environment matrix markdown"
          readOnly
          value={deploymentMatrix.markdown}
          className="mt-2 min-h-[104px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
        />
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Blockers</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {(deploymentPacket.blockers.length > 0 ? deploymentPacket.blockers : ["No deployment proposal blocker detected."]).slice(0, 5).map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Required approvals</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {deploymentPacket.requiredApprovals.slice(0, 5).map((approval) => (
              <li key={approval}>{approval}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Evidence</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {deploymentPacket.evidence.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Rollback plan</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {deploymentPacket.rollbackPlan.slice(0, 4).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
      <Textarea
        aria-label="Deployment readiness packet markdown"
        readOnly
        value={deploymentPacket.markdown}
        className="mt-2 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
      />
    </div>
  );
}
