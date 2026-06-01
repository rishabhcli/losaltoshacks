import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  VentureLaunchControlQueueItem,
  VentureLaunchControlStatus,
} from "@/lib/venture-portfolio";

function launchControlStatusBadge(status: VentureLaunchControlStatus) {
  if (status === "ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "needs-approval") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

export function LaunchControlQueuePanel({ items }: { items: VentureLaunchControlQueueItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      aria-label="Launch control queue"
      className="rounded-lg border border-lime-200 bg-lime-50/70 p-4 dark:border-lime-900/70 dark:bg-lime-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <FlaskConical className="h-4 w-4 text-lime-700 dark:text-lime-300" />
        <h2 className="text-sm font-semibold text-lime-950 dark:text-lime-100">Launch control queue</h2>
        <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
          {items.length} launch item{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-lime-700 dark:bg-slate-950/60 dark:text-lime-300">
          No external send / spend / deploy
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Queue items turn experiment-control packets, gap actions, read-only browsing work, no-send approval records, approval-trail checks, and replay logs into internal launch commands with metrics and proof boundaries.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 8).map((item) => (
          <div key={item.id} className="rounded-md border border-lime-200 bg-white/80 p-3 dark:border-lime-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={launchControlStatusBadge(item.status)}>
                {item.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
                {item.priority}
              </Badge>
              <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                {item.sourceType}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Launch command: {item.launchCommand}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Approval: {item.humanApprovalBoundary}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Success: {item.successMetric}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">Failure: {item.failureMetric}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">Boundary: {item.noExternalActionProof}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
