import type { RuntimeHealthReport } from "@/hooks/useRuntimeHealth";
import type { WorkerPreflightReport } from "@/hooks/useWorkerPreflight";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface RuntimeHealthMemorySnapshot {
  id: string;
  capturedAt: string;
  runtimeStatus: string;
  runtimeOk: boolean;
  demoMode: boolean;
  workerStatus: string;
  workerCanStart: boolean;
  liveMissionReady: boolean;
  requiredFailureCount: number;
  optionalIssueCount: number;
  issueCount: number;
  checks: Array<{
    name: string;
    status: string;
    ok: boolean;
    required: boolean;
    message: string;
    action: string;
  }>;
  message: string;
  nextAction: string;
}

const STORAGE_PREFIX = "marketpulse-runtime-health-memory";

function normalizeOwnerKey(ownerKey: string) {
  return ownerKey.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-") || "anonymous";
}

export function getRuntimeHealthMemoryStorageKey(ownerKey: string) {
  return `${STORAGE_PREFIX}:${normalizeOwnerKey(ownerKey)}`;
}

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function workerStatusFor(preflight: WorkerPreflightReport | null | undefined, preflightError?: string | null) {
  if (preflight?.liveMissionReady) return "ready";
  if (preflight?.workerCanStart) return `llm-${preflight.liveLlm?.status ?? "missing"}`;
  return preflight?.insforge?.status ?? preflightError ?? "unavailable";
}

export function buildRuntimeHealthMemorySnapshot(params: {
  health?: RuntimeHealthReport | null;
  healthError?: string | null;
  preflight?: WorkerPreflightReport | null;
  preflightError?: string | null;
  now?: string;
}): RuntimeHealthMemorySnapshot {
  const capturedAt = params.now ?? new Date().toISOString();
  const checks = params.health?.checks ?? [];
  const requiredFailures = checks.filter((check) => check.required && !check.ok);
  const optionalIssues = checks.filter((check) => !check.required && !check.ok);
  const workerHealthy = Boolean(params.preflight?.liveMissionReady);
  const issueCount = requiredFailures.length + optionalIssues.length + (workerHealthy ? 0 : 1);
  const primaryFailure = requiredFailures[0] ?? optionalIssues[0];
  const nextAction = primaryFailure?.action ||
    params.preflight?.liveLlm?.action ||
    params.preflight?.message ||
    params.preflightError ||
    params.healthError ||
    "No runtime action required.";

  return {
    id: `runtime-health-${capturedAt}`,
    capturedAt,
    runtimeStatus: params.health?.demoMode
      ? "demo-ready"
      : params.health?.status ?? (params.healthError ? "unavailable" : "unknown"),
    runtimeOk: Boolean(params.health?.ok),
    demoMode: Boolean(params.health?.demoMode),
    workerStatus: workerStatusFor(params.preflight, params.preflightError),
    workerCanStart: Boolean(params.preflight?.workerCanStart),
    liveMissionReady: workerHealthy,
    requiredFailureCount: requiredFailures.length,
    optionalIssueCount: optionalIssues.length,
    issueCount,
    checks: checks.map((check) => ({
      name: check.name,
      status: check.status,
      ok: check.ok,
      required: check.required,
      message: check.message,
      action: check.action,
    })),
    message: primaryFailure?.message ||
      params.preflight?.message ||
      params.preflightError ||
      params.healthError ||
      "Runtime and worker preflight are ready.",
    nextAction,
  };
}

function isRuntimeHealthMemorySnapshot(value: unknown): value is RuntimeHealthMemorySnapshot {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<RuntimeHealthMemorySnapshot>;
  return Boolean(
    record.id &&
    record.capturedAt &&
    typeof record.runtimeStatus === "string" &&
    typeof record.workerStatus === "string" &&
    Array.isArray(record.checks),
  );
}

export function loadRuntimeHealthMemorySnapshot(
  ownerKey: string,
  storage: StorageLike | null = browserStorage(),
) {
  if (!storage) return null;
  try {
    const parsed: unknown = JSON.parse(storage.getItem(getRuntimeHealthMemoryStorageKey(ownerKey)) ?? "null");
    return isRuntimeHealthMemorySnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveRuntimeHealthMemorySnapshot(
  ownerKey: string,
  snapshot: RuntimeHealthMemorySnapshot,
  storage: StorageLike | null = browserStorage(),
) {
  if (!storage) return snapshot;
  storage.setItem(getRuntimeHealthMemoryStorageKey(ownerKey), JSON.stringify(snapshot));
  return snapshot;
}
