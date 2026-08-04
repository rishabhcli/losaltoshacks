import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { invalidateLiveResearchCache } from "@/lib/osdk-shims";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export function useRecommendationFollowUpMission() {
  const navigate = useNavigate();
  const [isCreatingFollowUp, setIsCreatingFollowUp] = useState(false);

  const createFollowUpMission = useCallback(async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setIsCreatingFollowUp(true);
    try {
      const response = await apiFetch(`${API_BASE}/api/mission/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || `Mission create failed with HTTP ${response.status}`);
      }

      invalidateLiveResearchCache();
      toast.success("Follow-up research mission launched");
      navigate("/market-research");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to launch follow-up mission");
      throw error;
    } finally {
      setIsCreatingFollowUp(false);
    }
  }, [navigate]);

  return { createFollowUpMission, isCreatingFollowUp };
}
