import { describe, expect, test } from "vitest";
import { buildAiOutputAuditTrail, estimateTokenCount } from "./ai-output-audit";

describe("ai-output-audit", () => {
  test("summarizes local report generation with source and uncertainty warnings", () => {
    const audit = buildAiOutputAuditTrail({
      artifact: "report",
      mode: "local-draft",
      missionPrompt: "AI wellness apps for Gen Z",
      outputText: "A concise generated report with enough words to estimate tokens.",
      sources: [
        { url: "https://example.com/a", platform: "youtube" },
        { url: "https://example.com/b", platform: "reddit" },
      ],
      inputCounts: { trends: 2, recommendations: 1, sections: 4 },
    });

    expect(audit).toEqual(expect.objectContaining({
      artifactLabel: "Research report",
      modeLabel: "Local deterministic draft",
      promptSummary: "AI wellness apps for Gen Z",
      sourceInputLabel: "2 sources across 2 platforms",
      inputSummary: "2 trends, 1 recommendation, 4 sections",
    }));
    expect(audit.tokenEstimate).toBeGreaterThan(0);
    expect(audit.warnings).toContain("Local draft, not live LLM regenerated");
  });

  test("marks unsupported empty output as high uncertainty", () => {
    const audit = buildAiOutputAuditTrail({
      artifact: "briefing",
      mode: "strict-local-draft",
      missionPrompt: "",
      outputText: "",
      sources: [],
    });

    expect(audit.sourceInputLabel).toBe("No cited source inputs");
    expect(audit.tokenEstimateLabel).toBe("No output tokens");
    expect(audit.uncertaintyLabel).toBe("High uncertainty");
    expect(audit.warnings).toEqual(expect.arrayContaining([
      "No source inputs attached",
      "No mission prompt attached",
      "No generated output text available",
    ]));
  });

  test("estimates tokens from word count", () => {
    expect(estimateTokenCount("one two three four")).toBe(6);
  });
});
