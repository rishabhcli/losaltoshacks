import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureExperimentLaunchPack,
  type VentureExperimentLaunchPackStatus,
} from "@/lib/venture-portfolio";

function launchPackStatusBadge(status: VentureExperimentLaunchPackStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-approval") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "recorded") return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

export function ExperimentLaunchPackPanel({
  visible,
  launchPack,
}: {
  visible: boolean;
  launchPack: VentureExperimentLaunchPack;
}) {
  if (!visible) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-cyan-200 bg-cyan-50/70 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <FlaskConical className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
        <h3 className="text-xs font-semibold text-cyan-900 dark:text-cyan-100">Experiment launch pack</h3>
        <Badge variant="secondary" className={launchPackStatusBadge(launchPack.status)}>
          {launchPack.status}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-cyan-800 dark:bg-slate-950/70 dark:text-cyan-200">
          {launchPack.channel}
        </Badge>
      </div>
      <p className="text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{launchPack.title}</p>
      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Audience: {launchPack.audience}; success: {launchPack.successMetric}; failure: {launchPack.failureMetric}</p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Landing sections</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {launchPack.landingPageSections.slice(0, 4).map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Channel copy</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {launchPack.channelCopy.slice(0, 3).map((copy) => (
              <li key={copy}>{copy}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Launch checklist</div>
          <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {launchPack.checklist.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Risk checks</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{launchPack.riskChecks[0]}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{launchPack.riskChecks[1]}</p>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white/75 p-2 dark:border-cyan-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">Approval gates</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{launchPack.approvalGates[0]}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Replay: {launchPack.replayCommand}</p>
        </div>
      </div>
      <Textarea
        aria-label="Experiment launch pack markdown"
        readOnly
        value={launchPack.markdown}
        className="min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
      />
    </div>
  );
}
