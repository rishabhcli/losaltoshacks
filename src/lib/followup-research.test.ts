import { describe, expect, test } from "vitest";
import { buildFollowUpResearchPrompt } from "./followup-research";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

function payload(): FinalOptionsPayload {
  return {
    generatedAt: "2026-05-11T00:00:00.000Z",
    isFinal: true,
    marketResearch: {
      summary: "Demand is credible but partial.",
      signals: ["High save intent", "Low-pressure coaching", "Weekly routine packaging"],
    },
    options: [
      {
        id: "option-1",
        title: "Gen Z Recovery Planner",
        concept: "A weekly recovery planner.",
        audience: "Gen Z students",
        whyPromising: "Routines and accountability appear in evidence.",
        marketAngle: "Recovery ritual.",
        recommendedFormat: "Mobile-first planner",
        evidence: [
          {
            id: "e1",
            platform: "youtube",
            title: "Creator routines",
            keywords: "burnout",
            summary: "Creators are packaging recovery routines.",
            url: "https://example.com/youtube",
          },
          {
            id: "e2",
            platform: "reddit",
            title: "Student accountability",
            keywords: "accountability",
            summary: "Students want low-pressure accountability.",
            url: "https://example.com/reddit",
          },
        ],
      },
    ],
    primaryOptionId: "option-1",
    coverage: {
      requiredPlatforms: ["youtube", "x", "reddit", "substack"],
      completedPlatforms: ["youtube", "reddit"],
      missingPlatforms: ["x", "substack"],
      readyForLovable: false,
    },
    implementationPlan: {
      generatedBy: "MiniMax-M2.7",
      title: "Gen Z Recovery Planner",
      oneLiner: "",
      problem: "",
      targetUsers: "",
      valueProp: "",
      whyNow: "Recovery systems are getting packaged.",
      coreUserFlows: [],
      screens: [],
      dataModel: [],
      workflows: [],
      integrations: [],
      monetization: "",
      launchPlan: [],
      successMetrics: [],
      sourceEvidence: [],
    },
    lovableHandoff: {
      title: "",
      prompt: "",
      launchUrl: "",
      evidence: [],
    },
  };
}

describe("buildFollowUpResearchPrompt", () => {
  test("turns scorecard gaps into an actionable research prompt", () => {
    const prompt = buildFollowUpResearchPrompt(payload());

    expect(prompt).toContain("Follow-up research: pressure-test Gen Z Recovery Planner.");
    expect(prompt).toContain("especially x, substack");
    expect(prompt).toContain("Missing platform coverage: x, substack");
    expect(prompt).toContain("High save intent, Low-pressure coaching, Weekly routine packaging");
    expect(prompt).toContain("Return fresh source URLs, engagement context, contradictions");
  });
});
