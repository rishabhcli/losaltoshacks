import { useEffect, useRef } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { apiFetch } from "@/lib/api";
import { INDUSTRY_AUTO_PROMPTS, AUTO_MISSION_COOLDOWN_MS } from "@/lib/industryPrompts";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

interface AutoMissionRecord {
  industry: string;
  triggeredAt: string; // ISO string
  missionId: string;
}

function storageKey(email: string): string {
  return `marketpulse-auto-mission-${email}`;
}

function loadRecord(email: string): AutoMissionRecord | null {
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? (JSON.parse(raw) as AutoMissionRecord) : null;
  } catch {
    return null;
  }
}

function saveRecord(email: string, record: AutoMissionRecord) {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(record));
  } catch {
    // ignore storage errors
  }
}

async function getActiveMissionStatus(): Promise<"active" | "none"> {
  try {
    const res = await apiFetch(`${API_BASE}/api/dashboard`, { cache: "no-store" });
    if (!res.ok) return "none";
    const data = await res.json() as { mission?: { status?: string } | null };
    const status = data?.mission?.status ?? "";
    if (status === "queued" || status === "active") return "active";
    return "none";
  } catch {
    return "none";
  }
}

async function createMission(prompt: string): Promise<string | null> {
  try {
    const res = await apiFetch(`${API_BASE}/api/mission/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { mission?: { mission_id?: string } };
    return data?.mission?.mission_id ?? null;
  } catch {
    return null;
  }
}

/**
 * Automatically triggers a background market research mission based on the
 * user's industry preference. Fires once per session (or when the industry
 * changes), respecting a cooldown window so it doesn't spam missions.
 */
export function useAutoMission() {
  const { preferences, currentUser, isAuthReady } = usePreferences();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!currentUser?.email) return;
    if (!preferences.hasCompletedSetup) return;
    if (preferences.industry === "All") return;
    if (hasTriggeredRef.current) return;

    const prompt = INDUSTRY_AUTO_PROMPTS[preferences.industry];
    if (!prompt) return;

    hasTriggeredRef.current = true;

    void (async () => {
      const email = currentUser.email;
      const record = loadRecord(email);
      const now = Date.now();

      // Skip if same industry was triggered recently (within cooldown)
      if (
        record &&
        record.industry === preferences.industry &&
        now - new Date(record.triggeredAt).getTime() < AUTO_MISSION_COOLDOWN_MS
      ) {
        return;
      }

      // Skip if a mission is currently running
      const activeMission = await getActiveMissionStatus();
      if (activeMission === "active") {
        return;
      }

      // Launch the mission in the background
      const missionId = await createMission(prompt);
      if (missionId) {
        saveRecord(email, {
          industry: preferences.industry,
          triggeredAt: new Date().toISOString(),
          missionId,
        });
      }
    })();
  }, [isAuthReady, currentUser, preferences.hasCompletedSetup, preferences.industry]);
}
