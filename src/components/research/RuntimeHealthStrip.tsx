import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRuntimeHealth } from "@/hooks/useRuntimeHealth";
import { useWorkerPreflight } from "@/hooks/useWorkerPreflight";

const IMPORTANT_CHECKS = new Set(["insforge", "openai", "python-worker", "mongodb-vector", "tts"]);

export function RuntimeHealthStrip() {
  const { health, error, isLoading } = useRuntimeHealth();
  const { preflight, error: workerError, isLoading: workerLoading } = useWorkerPreflight();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 text-xs text-slate-500 dark:text-slate-300">
        <Activity className="w-3.5 h-3.5 animate-pulse text-blue-500" />
        Checking runtime health
      </div>
    );
  }

  if (!health) {
    return (
      <div className="flex items-center gap-2 px-5 py-2 border-b border-amber-200/80 dark:border-amber-900/70 bg-amber-50/80 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-200">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        Runtime health unavailable{error ? `: ${error}` : ""}
      </div>
    );
  }

  const requiredFailures = health.checks.filter((check) => check.required && !check.ok);
  const optionalIssues = health.checks.filter((check) => !check.required && !check.ok && IMPORTANT_CHECKS.has(check.name));
  const hasIssues = requiredFailures.length > 0 || optionalIssues.length > 0;
  const primaryIssue = requiredFailures[0] ?? optionalIssues[0] ?? null;
  const workerStatus = workerLoading
    ? "checking"
    : preflight?.liveMissionReady
      ? "ready"
      : preflight?.workerCanStart
        ? `llm-${preflight.liveLlm?.status ?? "missing"}`
        : preflight?.insforge?.status ?? "unavailable";
  const workerDetail = workerLoading
    ? "Checking Python worker preflight..."
    : preflight?.liveMissionReady
      ? "Worker can claim live missions."
      : preflight?.workerCanStart
        ? preflight.liveLlm?.action || "Worker can start, but live inference is not ready."
        : workerError || preflight?.message || "Worker preflight is unavailable.";
  const showWorkerDetail = workerLoading || Boolean(preflight || workerError);

  return (
    <div
      className={`flex flex-wrap items-center gap-2 px-5 py-2 border-b text-xs ${
        hasIssues
          ? "border-amber-200/80 dark:border-amber-900/70 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
          : "border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-100"
      }`}
    >
      {hasIssues ? (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
      )}
      <span className="font-medium">
        {health.demoMode ? "Demo ready" : health.ok ? "Live runtime ready" : "Live runtime degraded"}
      </span>
      {hasIssues && (
        <span className="text-amber-800/90 dark:text-amber-100/80">
          Live backend degraded{primaryIssue ? `: ${primaryIssue.message}` : ""}
        </span>
      )}
      {!hasIssues && (
        <span className="text-emerald-800/80 dark:text-emerald-100/80">
          Required services are reachable.
        </span>
      )}
      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <Badge
          variant="secondary"
          className={`text-[10px] uppercase tracking-wider border-0 ${
            preflight?.liveMissionReady
              ? "bg-white/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-200"
              : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200"
          }`}
        >
          worker-preflight: {workerStatus}
        </Badge>
        {health.checks
          .filter((check) => IMPORTANT_CHECKS.has(check.name))
          .map((check) => (
            <Badge
              key={check.name}
              variant="secondary"
              className={`text-[10px] uppercase tracking-wider border-0 ${
                check.ok
                  ? "bg-white/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-200"
                  : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200"
              }`}
            >
              {check.name}: {check.status}
            </Badge>
          ))}
      </div>
      {showWorkerDetail && (
        <div className="basis-full text-[11px] leading-snug text-amber-800/90 dark:text-amber-100/80">
          Worker preflight: {workerDetail}
        </div>
      )}
    </div>
  );
}
