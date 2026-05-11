import { describe, expect, test } from "vitest";
import { buildBriefingTrustLedger, evidenceBackedOnly } from "./briefing-trust";

const source = {
  url: "https://example.com/source",
  platform: "reddit",
  title: "Community demand",
};

describe("briefing-trust", () => {
  test("summarizes strict local briefing evidence coverage", () => {
    const ledger = buildBriefingTrustLedger({
      trends: [{ title: "Recovery routines", sources: [source] }],
      recommendations: [
        { title: "Launch planner", sourceEvidence: [source] },
        { title: "Thin recommendation", sourceEvidence: [] },
      ],
      evidenceSources: [source],
      isStrictMode: true,
      liveModel: null,
    });

    expect(ledger).toEqual(expect.objectContaining({
      modeLabel: "Strict evidence mode",
      sourceCount: 1,
      platformCount: 1,
      recommendationCoverageLabel: "50% recommendation evidence coverage",
      riskLabel: "Review unsupported claims",
    }));
    expect(ledger.warnings).toContain("1 recommendation missing source evidence");
    expect(ledger.warnings).toContain("Local draft, not live LLM regenerated");
    expect(ledger.warnings).toContain("Strict mode filters out unsupported trend and recommendation inputs");
  });

  test("filters unsupported briefing inputs for strict mode", () => {
    const items = evidenceBackedOnly([
      { title: "Supported", sourceEvidence: [source] },
      { title: "Unsupported", sourceEvidence: [] },
    ]);

    expect(items.map((item) => item.title)).toEqual(["Supported"]);
  });
});
