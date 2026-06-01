import { describe, expect, it } from "vitest";
import {
  buildRuntimeHealthMemorySnapshot,
  getRuntimeHealthMemoryStorageKey,
  loadRuntimeHealthMemorySnapshot,
  saveRuntimeHealthMemorySnapshot,
} from "./runtime-health-memory";

class MemoryStorage {
  private records = new Map<string, string>();

  getItem(key: string) {
    return this.records.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.records.set(key, value);
  }
}

describe("runtime health memory", () => {
  it("builds and stores latest runtime and worker preflight status", () => {
    const storage = new MemoryStorage();
    const snapshot = buildRuntimeHealthMemorySnapshot({
      now: "2026-05-27T12:00:00.000Z",
      health: {
        ok: false,
        service: "marketpulse-ai-server",
        demoMode: true,
        status: "degraded",
        timestamp: "2026-05-27T12:00:00.000Z",
        missingRequired: ["insforge"],
        checks: [
          {
            name: "insforge",
            ok: false,
            required: true,
            status: "unreachable",
            message: "InsForge database probe failed.",
            action: "Fix InsForge health check.",
          },
          {
            name: "tts",
            ok: false,
            required: false,
            status: "optional-missing",
            message: "TTS is not configured.",
            action: "Set ElevenLabs credentials if voice is needed.",
          },
        ],
      },
      preflight: {
        ok: false,
        strict: false,
        workerCanStart: false,
        liveMissionReady: false,
        insforge: { status: "unreachable", message: "Cannot read missions." },
        liveLlm: { status: "missing", action: "Configure live LLM credentials." },
        message: "Worker preflight blocked.",
      },
    });

    saveRuntimeHealthMemorySnapshot("Test@MarketPulse.dev", snapshot, storage);

    expect(getRuntimeHealthMemoryStorageKey("Test@MarketPulse.dev")).toBe("marketpulse-runtime-health-memory:test-marketpulse.dev");
    expect(loadRuntimeHealthMemorySnapshot("test@marketpulse.dev", storage)).toEqual(expect.objectContaining({
      runtimeStatus: "demo-ready",
      workerStatus: "unreachable",
      issueCount: 3,
      requiredFailureCount: 1,
      optionalIssueCount: 1,
      message: "InsForge database probe failed.",
      nextAction: "Fix InsForge health check.",
    }));
  });
});
