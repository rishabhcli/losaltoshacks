import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface WorkerPreflightReport {
  ok: boolean;
  strict: boolean;
  workerCanStart: boolean;
  liveMissionReady: boolean;
  exitCode?: number;
  insforge?: {
    status?: string;
    baseUrl?: string;
    missionReadOk?: boolean;
    message?: string;
  };
  liveLlm?: {
    status?: string;
    openaiConfigured?: boolean;
    openaiBaseUrl?: string;
    openaiModel?: string;
    minimaxConfigured?: boolean;
    minimaxBaseUrl?: string;
    minimaxModel?: string;
    browserUseCloudConfigured?: boolean;
    braveSearchConfigured?: boolean;
    action?: string;
  };
  error?: string;
  message?: string;
}

export function useWorkerPreflight() {
  const [preflight, setPreflight] = useState<WorkerPreflightReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadPreflight() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/api/worker/preflight`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as WorkerPreflightReport;
        if (!cancelled) {
          setPreflight(payload);
          setError(response.ok ? null : payload.message || payload.error || `Worker preflight failed with ${response.status}.`);
        }
      } catch (err) {
        if (!cancelled && err instanceof Error && err.name !== "AbortError") {
          setPreflight(null);
          setError(err.message || "Worker preflight failed.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadPreflight();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { preflight, error, isLoading };
}
