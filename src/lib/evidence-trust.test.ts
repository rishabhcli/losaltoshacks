import { describe, expect, test } from "vitest";
import { buildEvidenceTrustSummary } from "./evidence-trust";

describe("buildEvidenceTrustSummary", () => {
  test("deduplicates canonical URLs and surfaces missing freshness", () => {
    const summary = buildEvidenceTrustSummary([
      {
        id: "source-a",
        url: "https://example.com/signal/?utm_source=feed#top",
        platform: "youtube",
        title: "Creators report growing demand for recovery routines",
        summary: "Repeat use and retention are rising.",
      },
      {
        id: "source-a-copy",
        url: "https://example.com/signal/",
        platform: "youtube",
        title: "Creators report growing demand for recovery routines",
        summary: "Repeat use and retention are rising.",
      },
    ]);

    expect(summary.sourceCount).toBe(2);
    expect(summary.uniqueSourceCount).toBe(1);
    expect(summary.duplicateCount).toBe(2);
    expect(summary.unknownFreshnessCount).toBe(2);
    expect(summary.warnings).toContain("2 duplicate sources detected");
    expect(summary.warnings).toContain("2 sources freshness unknown");
    expect(summary.sources.every((source) => source.duplicate)).toBe(true);
  });

  test("flags novelty and contradiction when sources repeat or disagree", () => {
    const summary = buildEvidenceTrustSummary([
      {
        url: "https://example.com/growth",
        platform: "reddit",
        title: "Growing demand for weekly recovery routines",
        summary: "People want repeatable planning and report useful retention.",
      },
      {
        url: "https://example.com/pushback",
        platform: "x",
        title: "Pushback on recovery routines",
        summary: "Skeptics report weak demand and concern about the format.",
      },
    ]);
    expect(summary.platformCount).toBe(2);
    expect(summary.contradictionRisk).toBeGreaterThan(20);
    expect(summary.sources[1].contradictionScore).toBeGreaterThan(
      summary.sources[0].contradictionScore,
    );
    expect(summary.warnings).toContain(
      "Contradiction risk is elevated; review the underlying source text",
    );
  });

  test("keeps an empty result explicitly unready", () => {
    const summary = buildEvidenceTrustSummary([]);

    expect(summary).toEqual(
      expect.objectContaining({
        sourceCount: 0,
        platformCount: 0,
        averageCredibility: 0,
        averageNovelty: 0,
        contradictionRisk: 0,
      }),
    );
    expect(summary.warnings).toContain("No source evidence attached");
    expect(summary.methodNote).toMatch(/Heuristic only/);
  });
});
