import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface RuntimeHealthCheck {
  name: string;
  ok: boolean;
  required: boolean;
  status: string;
  message: string;
  action: string;
}

export interface RuntimeHealthReport {
  ok: boolean;
  service: string;
  demoMode: boolean;
  status: "ready" | "degraded" | string;
  timestamp: string;
  missingRequired: string[];
  checks: RuntimeHealthCheck[];
}

export function useRuntimeHealth() {
  const [health, setHealth] = useState<RuntimeHealthReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHealth() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/health`, { cache: "no-store" });
        const payload = (await response.json()) as RuntimeHealthReport;
        if (!cancelled) {
          setHealth(payload);
          setError(response.ok ? null : payload.missingRequired?.join(", ") || `Health check failed with ${response.status}.`);
        }
      } catch (err) {
        if (!cancelled) {
          setHealth(null);
          setError(err instanceof Error ? err.message : "Runtime health check failed.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  return { health, error, isLoading };
}
