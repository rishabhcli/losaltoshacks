import { describe, expect, test } from "vitest";
import { buildTrendMemory } from "./trend-memory";

const now = new Date("2026-05-11T12:00:00.000Z");

describe("buildTrendMemory", () => {
  test("marks fresh multi-source growth as a high-confidence new signal", () => {
    const memory = buildTrendMemory({
      trendId: "trend-1",
      title: "Recovery Routine Planners",
      status: "growing",
      detectedAt: "2026-05-11T06:00:00.000Z",
      trendScore: 88,
      growthRate: 34.8,
      sentimentScore: 0.68,
      sources: [
        { platform: "youtube", title: "Creator routine" },
        { platform: "reddit", title: "Student demand" },
        { platform: "substack", title: "Newsletter systems" },
      ],
      now,
    });

    expect(memory).toEqual(expect.objectContaining({
      lifecycleLabel: "New signal",
      detectedLabel: "Detected 6h ago",
      sourceMixLabel: "3 sources across 3 platforms",
      forecastConfidenceLabel: "High confidence",
    }));
    expect(memory.forecastConfidence).toBeGreaterThanOrEqual(80);
    expect(memory.warnings).toContain("X/Twitter coverage missing");
  });

  test("downgrades unsupported or stale trends into watch items", () => {
    const memory = buildTrendMemory({
      trendId: "trend-2",
      title: "Thin Signal",
      status: "emerging",
      detectedAt: "2026-05-01T12:00:00.000Z",
      trendScore: 52,
      growthRate: 3,
      sentimentScore: 0.1,
      sources: [],
      now,
    });

    expect(memory.lifecycleLabel).toBe("Watchlist signal");
    expect(memory.sourceMixLabel).toBe("No source evidence attached");
    expect(memory.forecastConfidenceLabel).toBe("Low confidence");
    expect(memory.warnings).toEqual(expect.arrayContaining([
      "No source evidence attached to this trend",
      "Trend detection is older than one week",
      "Forecast confidence below decision threshold",
    ]));
  });
});
