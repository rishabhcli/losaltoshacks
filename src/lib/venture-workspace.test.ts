import { describe, expect, it } from "vitest";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";
import { buildManualVentureWorkspace, buildVentureOperatingWorkspace } from "./venture-workspace";

function demoFinalOptions(): FinalOptionsPayload {
  const evidence = [
    {
      id: "e1",
      platform: "youtube",
      title: "Creators package burnout recovery routines",
      keywords: "recovery routines",
      summary: "High save intent around weekly recovery rituals.",
      url: "https://example.com/youtube",
      views: 120000,
    },
    {
      id: "e2",
      platform: "reddit",
      title: "Students ask for lightweight accountability",
      keywords: "student burnout",
      summary: "Students want practical nudges without clinical friction.",
      url: "https://example.com/reddit",
      comments: 320,
    },
  ];

  return {
    generatedAt: "2026-05-27T00:00:00.000Z",
    isFinal: true,
    marketResearch: {
      summary: "Demand is strongest when the product is framed as a recovery operating system.",
      signals: ["High save intent", "Weekly routine packaging"],
    },
    options: [
      {
        id: "option-1",
        title: "Gen Z Recovery Planner",
        concept: "A planner that turns burnout signals into a weekly recovery plan.",
        audience: "Gen Z students and early-career workers",
        whyPromising: "Evidence clusters around routines and accountability.",
        marketAngle: "Position as an operating ritual, not a wellness chatbot.",
        recommendedFormat: "Mobile-first planner",
        evidence,
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
      oneLiner: "Weekly recovery operating system.",
      problem: "Burned-out students need low-friction recovery help.",
      targetUsers: "Gen Z students",
      valueProp: "Turn stress signals into a weekly plan.",
      whyNow: "Wellness content is moving into repeatable systems.",
      coreUserFlows: ["Run a weekly burnout check"],
      screens: [
        { name: "Weekly Reset", purpose: "Collect signals", modules: ["check-in"] },
      ],
      dataModel: [
        { entity: "RecoveryPlan", purpose: "Stores weekly plans", fields: ["energyScore", "planItems"] },
      ],
      workflows: [
        { name: "Sunday reset", trigger: "User check-in", outcome: "Recovery plan" },
      ],
      integrations: ["Calendar"],
      monetization: "$9/month individual plan",
      launchPlan: ["Partner with wellness creators"],
      successMetrics: ["40% week-two retention", "Creator CAC below $18"],
      sourceEvidence: evidence,
    },
    lovableHandoff: {
      title: "Build Gen Z Recovery Planner",
      prompt: "Build a recovery planner.",
      launchUrl: "",
      evidence,
    },
  };
}

describe("buildVentureOperatingWorkspace", () => {
  it("turns final options into an operating workspace without claiming code exists", () => {
    const workspace = buildVentureOperatingWorkspace(demoFinalOptions());

    expect(workspace.title).toBe("Gen Z Recovery Planner");
    expect(workspace.stage).toBe("researching");
    expect(workspace.evidenceSources).toHaveLength(2);
    expect(workspace.claims).toContain("Evidence clusters around routines and accountability.");
    expect(workspace.untestedAssumptions).toContain("Willingness to pay for $9/month individual plan.");
    expect(workspace.mvpHandoff.sourceCodeStatus).toBe("Source code: pending builder output");
    expect(workspace.whyNow).toEqual(expect.objectContaining({
      headline: "Wellness content is moving into repeatable systems.",
      confidence: "supported",
      expiringWindow: expect.stringContaining("No dated catalyst"),
    }));
    expect(workspace.whyNow.drivers).toContain("Wellness content is moving into repeatable systems");
    expect(workspace.whyNow.risks).toEqual(expect.arrayContaining([
      "Missing timing proof from x.",
      "Missing timing proof from substack.",
    ]));
    expect(workspace.whyNow.sources).toHaveLength(2);
    expect(workspace.mvpScope).toEqual(expect.objectContaining({
      confidence: "defined",
      source: "build-brief",
      timeToMvp: expect.stringContaining("1-2 weeks"),
    }));
    expect(workspace.mvpScope.mustHaveFeatures).toEqual(expect.arrayContaining([
      "Weekly recovery operating system",
      "Run a weekly burnout check",
      "Weekly Reset: Collect signals",
    ]));
    expect(workspace.mvpScope.deferredFeatures).toEqual(expect.arrayContaining([
      "Defer scale or deployment until x coverage is resolved.",
      "Defer scale or deployment until substack coverage is resolved.",
    ]));
    expect(workspace.buildEstimate).toEqual(expect.objectContaining({
      effortLevel: "medium",
      confidence: "calculated",
      timeRange: expect.stringContaining("1-2 weeks"),
    }));
    expect(workspace.buildEstimate.complexityDrivers).toEqual(expect.arrayContaining([
      "6 must-have MVP features",
      "3 dependencies",
    ]));
    expect(workspace.evidenceConfidence).toEqual(expect.objectContaining({
      label: "thin",
      sourceCount: 2,
      platformCount: 2,
    }));
    expect(workspace.evidenceConfidence.gaps).toEqual(expect.arrayContaining([
      "Missing evidence from x.",
      "Missing evidence from substack.",
    ]));
    expect(workspace.opportunityDemandSnapshot).toEqual(expect.objectContaining({
      source: "final-options",
      buyer: "Gen Z students and early-career workers",
      demandScore: expect.any(Number),
      evidenceCount: 2,
    }));
    expect(workspace.opportunityDemandSnapshot?.demandSignals[0]).toBe("Buyer: Gen Z students and early-career workers");
    expect(workspace.approvals).toContainEqual(expect.objectContaining({
      level: "Human-approved deployment",
      status: "requires-human",
    }));
    expect(workspace.reasoningDebate).toEqual(expect.objectContaining({
      confidence: "inferred",
    }));
    expect(workspace.reasoningDebate.bullCase).toContain("Gen Z students");
    expect(workspace.reasoningDebate.bullCase).toContain("Partner with wellness creators");
    expect(workspace.reasoningDebate.bearCase).toContain("Missing evidence from x.");
    expect(workspace.reasoningDebate.bearCase).toContain("medium build estimate");
    expect(workspace.reasoningDebate.fatalAssumption).toContain("$9/month individual plan");
    expect(workspace.reasoningDebate.fastestValidationPath).toBe("Publish the waitlist copy and record visitor/signup counts.");
    expect(workspace.reasoningDebate.clearestKillReason).toBe("Buyer does not show urgent pain.");
    expect(workspace.reasoningDebate.downsideIfWrong).toContain("thin evidence confidence");
    expect(workspace.reasoningDebate.sourceSignals).toEqual(expect.arrayContaining([
      "2 sources across 2 platforms",
      "Buyer: Gen Z students and early-career workers",
    ]));
    expect(Object.keys(workspace.evaluationLenses)).toEqual([
      "jobsToBeDone",
      "willingnessToPay",
      "distributionWedge",
      "productLedGrowth",
      "churnRisk",
      "expansionRevenue",
      "platformDependency",
      "marketplaceLiquidity",
      "networkEffects",
      "dataMoats",
      "regulatoryArbitrage",
      "procurementFriction",
      "founderMarketFit",
      "brandTrust",
      "aiAutomationDefensibility",
      "salesLedEnterprise",
      "workflowLockIn",
      "verticalSaasDynamics",
      "marginalCostStructure",
      "integrationComplexity",
      "switchingCosts",
      "distributionMoats",
      "capitalEfficiency",
      "supportBurden",
      "competitiveRetaliation",
    ]);
    expect(workspace.evaluationLenses.salesLedEnterprise.label).toBe("Sales-led enterprise potential");
    expect(workspace.evaluationLenses.workflowLockIn.label).toBe("Workflow lock-in");
    expect(workspace.evaluationLenses.verticalSaasDynamics.label).toBe("Vertical SaaS dynamics");
    expect(workspace.evaluationLenses.marginalCostStructure.label).toBe("Marginal cost structure");
    expect(workspace.evaluationLenses.integrationComplexity.label).toBe("Integration complexity");
    expect(workspace.evaluationLenses.switchingCosts.label).toBe("Switching costs");
    expect(workspace.evaluationLenses.distributionMoats.label).toBe("Distribution moats");
    expect(workspace.evaluationLenses.capitalEfficiency.label).toBe("Capital efficiency");
    expect(workspace.evaluationLenses.workflowLockIn.nextAction).toContain("daily/weekly workflow");
    expect(workspace.evaluationLenses.integrationComplexity.nextAction).toContain("rate limits");
    expect(workspace.evaluationLenses.capitalEfficiency.nextAction).toContain("cash to first paid customer");
    expect(workspace.evaluationLenses.supportBurden.label).toBe("Support burden");
    expect(workspace.evaluationLenses.supportBurden.nextAction).toContain("Log every support question");
    expect(workspace.evaluationLenses.competitiveRetaliation.label).toBe("Competitive retaliation");
    expect(workspace.evaluationLenses.competitiveRetaliation.nextAction).toContain("incumbents or substitutes");
    expect(workspace.evaluationLenses.marketplaceLiquidity.label).toBe("Marketplace liquidity");
    expect(workspace.evaluationLenses.networkEffects.nextAction).toContain("k-factor");
    expect(workspace.evaluationLenses.dataMoats.nextAction).toContain("dataset");
    expect(workspace.evaluationLenses.regulatoryArbitrage.label).toBe("Regulatory arbitrage");
    expect(workspace.evaluationLenses.procurementFriction.label).toBe("Procurement friction");
    expect(workspace.evaluationLenses.founderMarketFit.label).toBe("Founder-market fit");
    expect(workspace.evaluationLenses.brandTrust.label).toBe("Brand trust");
    expect(workspace.evaluationLenses.aiAutomationDefensibility.label).toBe("AI automation defensibility");
    expect(workspace.evaluationLenses.jobsToBeDone.signals).toEqual(expect.arrayContaining([
      "Buyer: Gen Z students",
      "Pain: Burned-out students need low-friction recovery help.",
    ]));
    expect(workspace.evaluationLenses.willingnessToPay.signals).toEqual(expect.arrayContaining([
      "Pricing hypothesis: $9/month individual plan",
    ]));
    expect(workspace.evaluationLenses.distributionWedge.signals).toContain("Channel: Partner with wellness creators");
    expect(workspace.evaluationLenses.productLedGrowth.gaps).toContain("No self-serve signup, invite, share, or activation loop is explicit yet.");
    expect(workspace.evaluationLenses.churnRisk.nextAction).toContain("concierge retention test");
    expect(workspace.evaluationLenses.expansionRevenue.gaps).toContain("Expansion is intentionally gated until repeat usage is proven.");
    expect(workspace.evaluationLenses.platformDependency.signals).toContain("Dependencies: Calendar");
  });

  it("creates concrete experiments and kill criteria from missing evidence", () => {
    const workspace = buildVentureOperatingWorkspace(demoFinalOptions());

    expect(workspace.experiments.map((experiment) => experiment.type)).toEqual([
      "Fake-door waitlist test",
      "Pricing test",
      "Contradiction pressure test",
      "Concierge MVP retention test",
    ]);
    expect(workspace.experiments[2].hypothesis).toContain("x, substack");
    expect(workspace.killCriteria.missingEvidence).toEqual(["x coverage", "substack coverage"]);
    expect(workspace.killCriteria.killReasons).toContain("The MVP is not differentiated from existing substitutes.");
    expect(workspace.companySimulation.retention).toBe("40% week-two retention");
  });

  it("falls back to inferred timing when the build brief has no explicit why-now note", () => {
    const payload = demoFinalOptions();
    payload.implementationPlan.whyNow = "";

    const workspace = buildVentureOperatingWorkspace(payload);

    expect(workspace.whyNow.confidence).toBe("inferred");
    expect(workspace.whyNow.headline).toBe("High save intent");
    expect(workspace.whyNow.expiringWindow).toBe("No dated catalyst on record");
  });

  it("turns a manual thesis into the same operating workspace shape", () => {
    const workspace = buildManualVentureWorkspace({
      title: "Campus Grant Finder",
      targetBuyer: "First-generation college students",
      painStatement: "Students miss small grants because eligibility is scattered.",
      productWedge: "A weekly grant matching digest with deadline reminders.",
      revenueModel: "$5/month student plan",
      acquisitionChannel: "financial aid office partnerships",
      evidenceNote: "Advisor interviews suggest students miss departmental grants.",
    });

    expect(workspace.id).toBe("venture-manual-campus-grant-finder");
    expect(workspace.stage).toBe("researching");
    expect(workspace.stageLabel).toBe("Manual thesis workspace");
    expect(workspace.decision).toBe("validate");
    expect(workspace.targetBuyer).toBe("First-generation college students");
    expect(workspace.painStatement).toBe("Students miss small grants because eligibility is scattered.");
    expect(workspace.productWedge).toBe("A weekly grant matching digest with deadline reminders.");
    expect(workspace.acquisitionChannels).toEqual(["financial aid office partnerships"]);
    expect(workspace.evidenceSources[0]).toEqual(expect.objectContaining({
      platform: "operator-note",
      summary: "Advisor interviews suggest students miss departmental grants.",
    }));
    expect(workspace.contradictions).toContain("Manual thesis still needs independent source evidence.");
    expect(workspace.companySimulation.competitiveResponse).toContain("Existing alternatives");
    expect(workspace.killCriteria.missingEvidence).toContain("source-backed market evidence");
    expect(workspace.experiments.map((experiment) => experiment.type)).toContain("Fake-door waitlist test");
    expect(workspace.experiments.map((experiment) => experiment.type)).toContain("Pricing test");
    expect(workspace.mvpHandoff.deploymentPath).toContain("blocked until independent evidence");
    expect(workspace.whyNow.confidence).toBe("inferred");
    expect(workspace.whyNow.risks).toContain("Missing timing proof from source-backed market evidence.");
    expect(workspace.mvpScope.confidence).toBe("inferred");
    expect(workspace.mvpScope.mustHaveFeatures).toContain("A weekly grant matching digest with deadline reminders");
    expect(workspace.mvpScope.deferredFeatures).toContain("Defer scale or deployment until source-backed market evidence is resolved.");
    expect(workspace.buildEstimate.effortLevel).toBe("high");
    expect(workspace.buildEstimate.confidence).toBe("inferred");
    expect(workspace.evidenceConfidence.label).toBe("thin");
    expect(workspace.evidenceConfidence.gaps).toContain("Missing evidence from source-backed market evidence.");
    expect(workspace.opportunityDemandSnapshot).toEqual(expect.objectContaining({
      source: "manual-thesis",
      buyer: "First-generation college students",
      evidenceCount: 1,
      missingPlatforms: ["source-backed market evidence"],
    }));
    expect(workspace.approvals).toContainEqual(expect.objectContaining({
      level: "Deployment proposal",
      status: "blocked",
    }));
    expect(workspace.nextActions).toContain("Attach source-backed evidence.");
    expect(workspace.reasoningDebate).toEqual(expect.objectContaining({
      confidence: "inferred",
    }));
    expect(workspace.reasoningDebate.bullCase).toContain("First-generation college students");
    expect(workspace.reasoningDebate.bullCase).toContain("financial aid office partnerships");
    expect(workspace.reasoningDebate.bearCase).toContain("Missing evidence from source-backed market evidence.");
    expect(workspace.reasoningDebate.fatalAssumption).toContain("$5/month student plan");
    expect(workspace.reasoningDebate.fastestValidationPath).toBe("Publish the waitlist copy and record visitor/signup counts.");
    expect(workspace.reasoningDebate.clearestKillReason).toBe("Independent evidence does not support the pain.");
    expect(workspace.reasoningDebate.downsideIfWrong).toContain("thin evidence confidence");
    expect(workspace.reasoningDebate.sourceSignals.length).toBeGreaterThan(0);
    expect(workspace.evaluationLenses.jobsToBeDone.signals).toContain("Buyer: First-generation college students");
    expect(workspace.evaluationLenses.willingnessToPay.confidence).toBe("inferred");
    expect(workspace.evaluationLenses.distributionWedge.signals).toContain("Channel: financial aid office partnerships");
    expect(workspace.evaluationLenses.platformDependency.signals).toContain("Manual or integration-light first scope.");
  });

  it("keeps early manual theses speculative when pricing and growth evidence are absent", () => {
    const workspace = buildManualVentureWorkspace({
      title: "Campus Grant Finder",
      targetBuyer: "First-generation college students",
      painStatement: "Students miss small grants because eligibility is scattered.",
      productWedge: "A weekly grant matching digest with deadline reminders.",
    });

    expect(workspace.evaluationLenses.willingnessToPay.confidence).toBe("speculative");
    expect(workspace.evaluationLenses.willingnessToPay.gaps).toContain("Pricing is not validated yet.");
    expect(workspace.evaluationLenses.productLedGrowth.confidence).toBe("speculative");
    expect(workspace.evaluationLenses.expansionRevenue.confidence).toBe("speculative");
  });

  it("keeps manual why-now notes structured when an operator provides one", () => {
    const workspace = buildManualVentureWorkspace({
      title: "Campus Grant Finder",
      targetBuyer: "First-generation college students",
      painStatement: "Students miss small grants because eligibility is scattered.",
      productWedge: "A weekly grant matching digest with deadline reminders.",
      revenueModel: "$5/month student plan",
      acquisitionChannel: "financial aid office partnerships",
      evidenceNote: "Advisor interviews suggest students miss departmental grants.",
      whyNowNote: "Federal Pell rule changes land in Q3 2026.",
      mvpScopeNote: "Concierge matching form plus weekly deadline digest.",
      buildEstimateNote: "No backend automation in the first MVP.",
      evidenceConfidenceNote: "Advisor interview notes only.",
    });

    expect(workspace.whyNow.confidence).toBe("inferred");
    expect(workspace.whyNow.headline).toBe("Federal Pell rule changes land in Q3 2026.");
    expect(workspace.whyNow.expiringWindow).toContain("Q3 2026");
    expect(workspace.whyNow.drivers[0]).toContain("Pell");
    expect(workspace.mvpScope.mustHaveFeatures[0]).toContain("Concierge matching form");
    expect(workspace.buildEstimate.complexityDrivers).toContain("No backend automation in the first MVP.");
    expect(workspace.evidenceConfidence.supportingSignals).toContain("Advisor interview notes only.");
  });
});
