import { describe, expect, test } from "vitest";
import { scoreFinalOptions } from "./opportunity-scoring";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

const evidence = [
  {
    id: "e1",
    platform: "youtube",
    title: "Video demand",
    keywords: "burnout, recovery",
    summary: "Creators are packaging burnout recovery as weekly routines.",
    url: "https://example.com/youtube",
  },
  {
    id: "e2",
    platform: "reddit",
    title: "Community demand",
    keywords: "accountability",
    summary: "Students want lightweight accountability without clinical friction.",
    url: "https://example.com/reddit",
  },
  {
    id: "e3",
    platform: "substack",
    title: "Newsletter packaging",
    keywords: "weekly planning",
    summary: "Wellness newsletters are moving into operating plans.",
    url: "https://example.com/substack",
  },
];

function demoFinalOptions(): FinalOptionsPayload {
  return {
    generatedAt: "2026-05-11T00:00:00.000Z",
    isFinal: true,
    marketResearch: {
      summary: "MarketPulse found early credible demand.",
      signals: ["High save intent", "Low-pressure coaching", "Weekly routine packaging"],
    },
    options: [
      {
        id: "demo-option-1",
        title: "Gen Z Recovery Planner",
        concept: "A lightweight AI planner that turns burnout signals into weekly plans.",
        audience: "Students and first-job Gen Z professionals.",
        whyPromising: "The strongest evidence clusters around routines and accountability.",
        marketAngle: "Position as an operating ritual for recovery.",
        recommendedFormat: "Mobile-first planner",
        evidence,
      },
      {
        id: "demo-option-2",
        title: "Creator Recovery Kits",
        concept: "Downloadable recovery templates sold through wellness creators.",
        audience: "Wellness creators with Gen Z audiences.",
        whyPromising: "Creator-led rituals can become repeatable products.",
        marketAngle: "Start as a template bundle before expanding into software.",
        recommendedFormat: "Digital product",
        evidence: evidence.slice(0, 2),
      },
    ],
    primaryOptionId: "demo-option-1",
    coverage: {
      requiredPlatforms: ["youtube", "x", "reddit", "substack"],
      completedPlatforms: ["youtube", "reddit", "substack"],
      missingPlatforms: ["x"],
      readyForLovable: false,
    },
    implementationPlan: {
      generatedBy: "MiniMax-M2.7",
      title: "Gen Z Recovery Planner",
      oneLiner: "A weekly recovery operating system.",
      problem: "Burned-out users want low-friction recovery help, but most apps feel clinical or too heavy.",
      targetUsers: "Gen Z students",
      valueProp: "Turn stress signals into a weekly plan.",
      whyNow: "Social evidence is shifting toward repeatable recovery systems.",
      coreUserFlows: ["Run a weekly burnout check", "Generate a recovery plan"],
      screens: [
        { name: "Weekly Reset", purpose: "Collect stress signals", modules: ["check-in"] },
        { name: "Recovery Plan", purpose: "Show the plan", modules: ["tasks"] },
      ],
      dataModel: [
        { entity: "RecoveryPlan", purpose: "Stores weekly plans", fields: ["energyScore"] },
      ],
      workflows: [
        { name: "Sunday reset", trigger: "User starts check-in", outcome: "Personalized plan" },
      ],
      integrations: ["Calendar", "Push notifications"],
      monetization: "$9/month",
      launchPlan: ["Ship a template MVP"],
      successMetrics: ["40% week-two retention"],
      sourceEvidence: evidence,
    },
    lovableHandoff: {
      title: "Build Gen Z Recovery Planner",
      prompt: "Build the planner.",
      launchUrl: "",
      evidence,
    },
  };
}

describe("scoreFinalOptions", () => {
  test("ranks the primary evidence-backed planner above the weaker template option", () => {
    const scorecard = scoreFinalOptions(demoFinalOptions());

    expect(scorecard.primary).toEqual(expect.objectContaining({
      optionId: "demo-option-1",
      opportunityScore: 64,
      label: "Promising",
      evidenceDiversityScore: 75,
      missingPlatforms: ["x"],
    }));
    expect(scorecard.rankedOptions.map((option) => option.optionId)).toEqual([
      "demo-option-1",
      "demo-option-2",
    ]);
    expect(scorecard.primary.drivers).toContain("Evidence diversity: 3/4 platforms");
    expect(scorecard.primary.warnings).toContain("Missing platform coverage: x");
  });

  test("drops confidence and adds warnings when an option has no evidence", () => {
    const payload = demoFinalOptions();
    payload.options[0] = { ...payload.options[0], evidence: [] };

    const scorecard = scoreFinalOptions(payload);

    expect(scorecard.primary.evidenceDiversityScore).toBe(0);
    expect(scorecard.primary.confidenceScore).toBeLessThan(10);
    expect(scorecard.primary.warnings).toContain("Confidence is weak; collect more source evidence.");
  });
});
