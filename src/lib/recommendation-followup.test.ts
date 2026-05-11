import { describe, expect, test } from "vitest";
import { buildRecommendationFollowUpPrompt } from "./recommendation-followup";

describe("buildRecommendationFollowUpPrompt", () => {
  test("turns an accepted recommendation into a pressure-test mission prompt", () => {
    const prompt = buildRecommendationFollowUpPrompt({
      title: "Launch Gen Z Recovery Planner",
      description: "A low-pressure AI recovery planner for students.",
      productCategory: "Wellness app",
      targetDemographic: "Gen Z students",
      confidenceScore: 0.84,
      estimatedRevenuePotential: "$120k ARR",
      priority: "high",
      actionPlan: "Pilot a weekly recovery check-in.",
      sourceEvidence: [
        {
          platform: "youtube",
          title: "Gen Z creators are packaging burnout recovery",
          url: "https://example.com/youtube",
        },
        {
          platform: "reddit",
          title: "Students want low-pressure accountability",
          url: "https://example.com/reddit",
        },
      ],
    }, {
      status: "accepted",
      trendTitle: "Recovery Routine Planners",
    });

    expect(prompt).toContain("Follow-up research: reassess Launch Gen Z Recovery Planner.");
    expect(prompt).toContain("accepted decision with 84% confidence and high priority");
    expect(prompt).toContain("Linked trend: Recovery Routine Planners.");
    expect(prompt).toContain("1. Gen Z creators are packaging burnout recovery; 2. Students want low-pressure accountability");
    expect(prompt).toContain("whether to keep, reverse, or escalate this decision");
  });

  test("labels rejected recommendations as reversal checks even when evidence is missing", () => {
    const prompt = buildRecommendationFollowUpPrompt({
      title: "Creator Template Pack",
      confidenceScore: 0.48,
      priority: "low",
      sourceEvidence: [],
    }, { status: "dismissed" });

    expect(prompt).toContain("Decision context: rejected decision with 48% confidence and low priority.");
    expect(prompt).toContain("No linked trend title is available.");
    expect(prompt).toContain("Attached evidence to verify: No attached source evidence yet.");
  });
});
