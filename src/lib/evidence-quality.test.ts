import { describe, expect, test } from "vitest";
import { scoreEvidenceQuality } from "./evidence-quality";

describe("scoreEvidenceQuality", () => {
  test("scores metadata-rich engaged evidence as useful while warning about unknown freshness", () => {
    const score = scoreEvidenceQuality({
      platform: "youtube",
      title: "Gen Z creators are packaging burnout recovery",
      keywords: "recovery routines, burnout reset",
      summary: "Short-form creators are turning burnout recovery into repeatable rituals.",
      url: "https://example.com/source",
      likes: 18_400,
      views: 248_000,
      comments: 920,
    });

    expect(score).toEqual(expect.objectContaining({
      score: 81,
      label: "Strong",
      metadataScore: 100,
      freshnessScore: 40,
    }));
    expect(score.reasons).toContain("Source metadata complete");
    expect(score.reasons).toContain("Strong engagement metadata");
    expect(score.warnings).toContain("Freshness unknown");
  });

  test("penalizes evidence with missing metadata and engagement", () => {
    const score = scoreEvidenceQuality({
      platform: "source",
      url: "https://example.com/thin",
    });

    expect(score.score).toBeLessThan(50);
    expect(score.label).toBe("Weak");
    expect(score.warnings).toContain("Missing title, summary, keywords, or URL metadata");
    expect(score.warnings).toContain("Engagement metadata unavailable");
  });
});
