import { describe, expect, test } from "vitest";
import { buildDecisionMemo, summarizeDecisionLibrary } from "./decision-library";

const evidence = [
  {
    url: "https://example.com/reddit",
    platform: "reddit",
    title: "Community demand",
  },
  {
    url: "https://example.com/youtube",
    platform: "youtube",
    title: "Creator demand",
  },
];

describe("decision-library", () => {
  test("summarizes evidence-backed decisions and review debt", () => {
    const stats = summarizeDecisionLibrary([
      {
        title: "Recovery Planner",
        confidenceScore: 0.82,
        priority: "high",
        sourceEvidence: evidence,
      },
      {
        title: "Thin Idea",
        confidenceScore: 0.42,
        priority: "low",
        sourceEvidence: [],
      },
    ]);

    expect(stats).toEqual({
      total: 2,
      evidenceBacked: 1,
      needsReview: 1,
      highConfidence: 1,
      highPriority: 1,
      totalEvidenceSources: 2,
      averageConfidence: 62,
    });
  });

  test("builds accepted decision memos with launch review guidance", () => {
    const memo = buildDecisionMemo({
      confidenceScore: 0.82,
      priority: "high",
      estimatedRevenuePotential: "$50k ARR",
      actionPlan: "Pilot with creator partners.",
      sourceEvidence: evidence,
    }, "accepted");

    expect(memo.posture).toBe("Ready for pilot");
    expect(memo.reviewCadence).toBe("Weekly until launch");
    expect(memo.evidenceLabel).toBe("2 sources attached");
    expect(memo.rationale).toContain("82% confidence accepted bet");
    expect(memo.riskLabel).toBe("Tracked evidence");
  });

  test("builds rejected decision memos as revisit-ready records", () => {
    const memo = buildDecisionMemo({
      confidenceScore: 0.77,
      priority: "high",
      sourceEvidence: evidence.slice(0, 1),
    }, "dismissed");

    expect(memo.posture).toBe("Archived with evidence");
    expect(memo.reviewCadence).toBe("Revisit if market moves");
    expect(memo.riskLabel).toBe("High-priority watchlist");
    expect(memo.rationale).toContain("revisit if new signals contradict");
  });
});
