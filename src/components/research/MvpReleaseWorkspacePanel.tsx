import { PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { VentureMvpReleaseWorkspace, VentureMvpReleaseWorkspaceStatus } from "@/lib/venture-portfolio";

function mvpReleaseWorkspaceStatusBadge(status: VentureMvpReleaseWorkspaceStatus) {
  if (status === "release-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-run-proof") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "needs-qa-proof") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

export function MvpReleaseWorkspacePanel({ workspaces }: { workspaces: VentureMvpReleaseWorkspace[] }) {
  if (workspaces.length === 0) return null;

  return (
    <div
      aria-label="Executable MVP release workspaces"
      className="rounded-lg border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-900/70 dark:bg-violet-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <PackageCheck className="h-4 w-4 text-violet-700 dark:text-violet-300" />
        <h2 className="text-sm font-semibold text-violet-950 dark:text-violet-100">Executable MVP release workspaces</h2>
        <Badge variant="secondary" className="bg-white/80 text-violet-800 dark:bg-slate-950/70 dark:text-violet-200">
          {workspaces.length} workspace{workspaces.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/70 text-violet-700 dark:bg-slate-950/60 dark:text-violet-300">
          No-deploy release boundary
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-violet-600 dark:bg-slate-950/50 dark:text-violet-400">
          No external side effects
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-violet-900/80 dark:text-violet-100/80">
        Release workspaces turn product-build command run proof into a handoff object with verifier report proof, QA proof, operator commands, and a no-deploy release boundary. No deployment, send, spend, contact, or billing change occurs here.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {workspaces.slice(0, 6).map((ws) => (
          <div key={ws.id} className="rounded-md border border-violet-200 bg-white/80 p-3 dark:border-violet-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={mvpReleaseWorkspaceStatusBadge(ws.status)}>
                {ws.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
                {ws.chosenRunState !== "none" ? ws.chosenRunState : "no run"}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{ws.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Source path: {ws.sourcePath}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200">Verifier proof: {ws.verifierReportProof}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">QA proof: {ws.qaProof}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Setup: {ws.setupCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Test: {ws.testCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Build: {ws.buildCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Browser smoke: {ws.browserSmokeCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">No-deploy boundary: {ws.noDeployBoundary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
