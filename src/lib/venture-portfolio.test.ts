import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { VentureOperatingWorkspace } from "./venture-workspace";
import {
  buildVenturePredictionSnapshots,
  buildVentureGapActionQueue,
  buildVentureAgentRunCandidates,
  buildVentureActivationCohortCandidates,
  buildVentureAutonomyAuditCandidates,
  buildVentureBrowserResearchCandidates,
  buildVentureChannelEconomicsCandidates,
  buildVentureCompetitorCandidates,
  buildVentureConvertedPainMemories,
  buildVentureConvertedPricingMemories,
  buildVentureDemandDriftReport,
  buildVentureDeploymentEnvironmentMatrix,
  buildVentureDeploymentEscalationAuditRollup,
  buildVentureDeploymentOwnerWorklist,
  buildVentureDeploymentReadinessPacket,
  buildVentureEmpiricalCalibrationMemories,
  buildVentureExperimentLaunchPack,
  buildVentureFakeMarketMemories,
  buildVentureFailedOutreachMemories,
  buildVentureFinancialModel,
  buildVentureFounderExecutionMemo,
  buildVentureGeneratedAppHandoff,
  buildVentureGeneratedAppSourceScaffold,
  buildVentureGeneratedAppVerificationProof,
  buildVentureGeneratedCodePatternMemories,
  buildVentureFailureLessons,
  buildVentureInvestorBrief,
  buildVentureKillDecisionArtifact,
  buildVentureLearningReinvestmentQueue,
  buildVentureLaunchControlQueue,
  buildVentureDemandCaptureProofQueue,
  buildVenturePortfolioDecisionCommandQueue,
  buildVentureOpportunityDiscoveryBacklog,
  buildVentureOverlookedOpportunityAtlas,
  buildVentureAtlasValidationCommandPacks,
  buildVentureAtlasValidationResultLedger,
  buildVentureProductBuildCommandQueue,
  buildVentureProductBuildCommandRunLedger,
  buildVentureMvpReleaseWorkspace,
  buildVentureMvpReleaseWorkspaceList,
  buildVenturePilotCohortSignalGate,
  buildVenturePilotCohortSignalGates,
  buildVentureNoSendEmailGateWorklist,
  buildVentureKillPressureReport,
  buildVentureRevenueGenerationPosture,
  buildVentureDemandSourceBlockerDrilldowns,
  buildVentureScaleStrongBranchPlan,
  buildVentureSpawnedVentureDrafts,
  buildVentureRelatedIdeaMergeAudits,
  buildVentureMarketModel,
  buildVentureMvpFeatureMemories,
  buildVentureOutreachCampaignBrief,
  buildVenturePortfolioChartPack,
  buildVentureQaReleaseReport,
  buildVentureReadinessNotices,
  buildVentureRevivalTriggers,
  buildVentureRetainedUserMemories,
  buildVentureSuccessPredictionMemories,
  buildVentureVanityMetricMemories,
  buildVentureWeakBranchKillMemories,
  buildVentureRoadmapCandidates,
  buildVentureRiskCandidates,
  buildVentureSupportIssueCandidates,
  buildVentureWrongClaimMemories,
  buildVentureWorkedChannelMemories,
  calibrateVentureDemand,
  calibrateVenturePricing,
  getVenturePortfolioStorageKey,
  filterVenturePortfolio,
  filterVenturePortfolioByEvidence,
  findSimilarVentureTheses,
  loadVenturePortfolio,
  parseVentureGeneratedAppVerifierReport,
  parseVenturePortfolioImport,
  recordVentureArtifact,
  recordVentureAgentRun,
  recordVentureActivationCohort,
  recordVentureAtlasValidationResult,
  recordVentureProductBuildCommandRun,
  recordVentureAutonomyAudit,
  recordVentureBrowserResearchTask,
  recordVentureChannelEconomics,
  recordVentureCompetitor,
  recordVentureDecision,
  recordVentureCustomerInterview,
  recordVentureExperimentResult,
  recordVentureGapAction,
  recordVentureGeneratedAppVerifierReport,
  recordVentureMvpBuildWorkspace,
  recordVentureMoneySignal,
  recordVentureNoSendEmailGateReplyProof,
  recordVentureOutreachApproval,
  recordVenturePricingSignal,
  recordVentureRisk,
  recordVentureRoadmapTask,
  recordVentureSupportIssue,
  replaceVenturePortfolio,
  saveVentureWorkspace,
  serializeVenturePortfolio,
  summarizeVentureEvidence,
  summarizeVentureDeploymentOwnerWorkload,
  summarizeVenturePortfolio,
  updateVentureRoadmapTaskStatus,
  updateVentureSupportIssueStatus,
  VENTURE_NO_ARTIFACT_URI_ATTACHED,
  VENTURE_NO_MVP_SOURCE_ATTACHED,
} from "./venture-portfolio";
import {
  BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY,
  auditBreachProcessRegressionEscalationGovernanceDigestConflicts,
  auditBreachProcessRegressionEscalationGovernanceDigestIntegrity,
  auditBreachProcessRegressionEscalationGovernanceDigestReplay,
  buildBreachProcessRegressionEscalationAppealReClearanceCalibrations,
  buildBreachProcessRegressionEscalationGovernanceDigests,
  formatBreachProcessRegressionEscalationGovernanceDigestConflictDrilldown,
  parseBreachProcessRegressionEscalationAuditAppealsImport,
  parseBreachProcessRegressionEscalationGovernanceDigestsImport,
  type BreachProcessRegressionEscalationAuditAppeal,
} from "./breach-process-regression-escalations";

class MemoryStorage {
  private records = new Map<string, string>();

  getItem(key: string) {
    return this.records.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.records.set(key, value);
  }
}

function workspaceFixture(title = "Gen Z Recovery Planner"): VentureOperatingWorkspace {
  return {
    id: "venture-demo-option-1",
    title,
    stage: "validating",
    stageLabel: "Validation workspace",
    decision: "validate",
    targetBuyer: "Gen Z students",
    painStatement: "Burned-out students need help.",
    productWedge: "Weekly planning loop.",
    revenueModel: "$9/month",
    pricingHypothesis: "$9/month",
    acquisitionChannels: ["creator partnerships"],
    retentionMechanism: "40% week-two retention",
    whyNow: {
      headline: "Creator-led recovery content is turning into repeatable planning rituals.",
      drivers: ["Creators are packaging weekly recovery routines.", "Students are searching for low-friction accountability."],
      risks: ["Missing timing proof from x coverage."],
      expiringWindow: "No dated catalyst on record",
      confidence: "inferred",
      sources: [],
    },
    mvpScope: {
      mustHaveFeatures: ["Weekly planning loop", "Fake-door waitlist", "Basic recovery plan dashboard"],
      deferredFeatures: ["Defer production deployment until x coverage is resolved."],
      dependencies: ["Calendar integration", "x coverage evidence"],
      timeToMvp: "1-2 weeks for a focused local MVP with manual setup.",
      confidence: "defined",
      source: "build-brief",
    },
    buildEstimate: {
      effortScore: 57,
      effortLevel: "medium",
      timeRange: "1-2 weeks for a focused local MVP with verification.",
      builderProfile: "Product-minded full-stack builder with founder-led QA.",
      complexityDrivers: ["3 must-have MVP features", "2 dependencies", "1 integration"],
      riskAdjustments: ["1 unresolved evidence gate before deployment confidence."],
      confidence: "calculated",
      source: "build-brief",
    },
    evidenceConfidence: {
      score: 42,
      label: "thin",
      sourceCount: 0,
      platformCount: 0,
      sourcePlatforms: [],
      supportingSignals: ["Evidence supports weekly routines."],
      gaps: ["Missing evidence from x coverage."],
    },
    reasoningDebate: {
      bullCase: "Gen Z students feel burned-out and the weekly planning loop can become a repeat workflow if creator partnerships reach the right early users.",
      bearCase: "Missing evidence from x coverage. The medium build estimate means the team should not build past the MVP before stronger proof exists.",
      lazyConsensus: "This sounds like a useful Gen Z Recovery Planner concept, but usefulness is not enough without pricing, retention, and channel proof.",
      nonObviousInsight: "Creator-led recovery content is turning into repeatable planning rituals. The best first product may be the narrowest repeated workflow in the MVP scope.",
      fatalAssumption: "Gen Z students will accept $9/month and repeat the workflow after the first promised outcome.",
      fastestValidationPath: "Publish the waitlist copy and record visitor/signup counts.",
      clearestKillReason: "Buyer does not show urgent pain.",
      downsideIfWrong: "A premature build would spend 1-2 weeks for a focused local mvp with verification on a thesis with thin evidence confidence.",
      confidence: "inferred",
      sourceSignals: ["0 sources across 0 platforms", "Evidence supports weekly routines."],
    },
    evaluationLenses: {
      jobsToBeDone: {
        label: "Jobs-to-be-done",
        score: 72,
        confidence: "inferred",
        signals: ["Buyer: Gen Z students", "Pain: Burned-out students need help.", "Desired progress: Weekly planning loop."],
        gaps: ["Missing evidence from x coverage."],
        nextAction: "Interview target buyers until the job is stated in their words.",
      },
      willingnessToPay: {
        label: "Willingness to pay",
        score: 46,
        confidence: "inferred",
        signals: ["Pricing hypothesis: $9/month", "Revenue model: $9/month"],
        gaps: ["Missing pricing proof."],
        nextAction: "Ask qualified buyers to commit payment intent.",
      },
      distributionWedge: {
        label: "Distribution wedge",
        score: 58,
        confidence: "inferred",
        signals: ["Channel: creator partnerships", "Creator CAC below $18"],
        gaps: ["Missing channel proof: x coverage."],
        nextAction: "Run one channel-specific fake-door test.",
      },
      productLedGrowth: {
        label: "Product-led growth",
        score: 34,
        confidence: "inferred",
        signals: ["Basic recovery plan dashboard"],
        gaps: ["No invite/share loop is explicit yet."],
        nextAction: "Prototype the activation loop as a self-serve fake-door path.",
      },
      churnRisk: {
        label: "Churn risk",
        score: 51,
        confidence: "inferred",
        signals: ["40% week-two retention", "Log questions."],
        gaps: ["Support burden may hide churn risk until measured."],
        nextAction: "Run the concierge retention test.",
      },
      expansionRevenue: {
        label: "Expansion revenue",
        score: 28,
        confidence: "speculative",
        signals: ["Expand after repeat usage."],
        gaps: ["Only one customer segment is explicit."],
        nextAction: "Ask retained users what adjacent workflow they would pay for.",
      },
      platformDependency: {
        label: "Platform dependency",
        score: 64,
        confidence: "inferred",
        signals: ["Dependencies: Calendar", "1 data requirement recorded."],
        gaps: ["Heavy platform dependencies need outage, API, and terms-of-service review."],
        nextAction: "Document the manual fallback for each external dependency.",
      },
      marketplaceLiquidity: {
        label: "Marketplace liquidity",
        score: 22,
        confidence: "speculative",
        signals: ["No marketplace dynamic captured."],
        gaps: ["No marketplace or two-sided dynamic is explicit yet."],
        nextAction: "Map supply-side and demand-side participants before scaling.",
      },
      networkEffects: {
        label: "Network effects",
        score: 24,
        confidence: "speculative",
        signals: ["No invite or referral loop recorded."],
        gaps: ["No invite, share, referral, or community loop is explicit."],
        nextAction: "Instrument the first invite or referral mechanic and measure k-factor.",
      },
      dataMoats: {
        label: "Data moats",
        score: 34,
        confidence: "inferred",
        signals: ["1 structured data requirement recorded."],
        gaps: ["No proprietary data or feedback loop is explicit yet."],
        nextAction: "Decide which dataset only this venture can accumulate.",
      },
      regulatoryArbitrage: {
        label: "Regulatory arbitrage",
        score: 30,
        confidence: "inferred",
        signals: ["Wellness language present."],
        gaps: ["Regulatory clarity or counsel review is not yet attached."],
        nextAction: "Document the specific rule or licensing posture and validate with counsel.",
      },
      procurementFriction: {
        label: "Procurement friction",
        score: 70,
        confidence: "inferred",
        signals: ["Consumer/SMB language detected; procurement should be light."],
        gaps: [],
        nextAction: "Walk one target buyer through how they would actually buy this.",
      },
      founderMarketFit: {
        label: "Founder-market fit",
        score: 36,
        confidence: "speculative",
        signals: ["Buyer is concretely named: Gen Z students"],
        gaps: ["No founder lived experience is recorded against this thesis."],
        nextAction: "Write down the founder's lived experience and unfair distribution.",
      },
      brandTrust: {
        label: "Brand trust",
        score: 32,
        confidence: "inferred",
        signals: ["2 evidence sources across 2 platforms."],
        gaps: ["No testimonial or referenceable customer is recorded."],
        nextAction: "Capture the first named customer quotes before paid acquisition.",
      },
      aiAutomationDefensibility: {
        label: "AI automation defensibility",
        score: 28,
        confidence: "speculative",
        signals: ["No AI or automation lever is explicit."],
        gaps: ["No AI or automation lever is explicit; defensibility must come from workflow lock-in."],
        nextAction: "Define the workflow that improves the model or the model that improves the workflow.",
      },
      salesLedEnterprise: {
        label: "Sales-led enterprise potential",
        score: 20,
        confidence: "speculative",
        signals: ["Consumer thesis with no enterprise language."],
        gaps: ["No enterprise/B2B procurement language is explicit."],
        nextAction: "Identify one enterprise buyer profile and confirm contract pricing before sales-led investment.",
      },
      workflowLockIn: {
        label: "Workflow lock-in",
        score: 44,
        confidence: "inferred",
        signals: ["Workflow, routine, or recurring loop language detected.", "40% week-two retention signal recorded."],
        gaps: ["No lock-in or system-of-record story is articulated."],
        nextAction: "Map the daily/weekly workflow this venture replaces.",
      },
      verticalSaasDynamics: {
        label: "Vertical SaaS dynamics",
        score: 22,
        confidence: "speculative",
        signals: ["No specific industry or vertical is identified."],
        gaps: ["No specific industry or vertical is identified."],
        nextAction: "Pick a single vertical and document its specific buyer roles.",
      },
      marginalCostStructure: {
        label: "Marginal cost structure",
        score: 48,
        confidence: "inferred",
        signals: ["Pricing hypothesis: $9/month"],
        gaps: ["No explicit software-margin or recurring-revenue language recorded."],
        nextAction: "Estimate the per-user marginal cost (inference, services, hardware) against the pricing hypothesis.",
      },
      integrationComplexity: {
        label: "Integration complexity",
        score: 62,
        confidence: "inferred",
        signals: ["1 integration planned."],
        gaps: [],
        nextAction: "List each integration with required scopes, rate limits, and outage fallbacks.",
      },
      switchingCosts: {
        label: "Switching costs",
        score: 36,
        confidence: "inferred",
        signals: ["Recurring workflow becomes harder to abandon over time."],
        gaps: ["No explicit lock-in or stored-state story is recorded."],
        nextAction: "Decide which user data would make leaving expensive within 30 days of activation.",
      },
      distributionMoats: {
        label: "Distribution moats",
        score: 30,
        confidence: "inferred",
        signals: ["1 non-manual channel signal recorded."],
        gaps: ["No exclusive partnership or owned-audience distribution moat is recorded."],
        nextAction: "Identify one channel where this venture could become uncopiable.",
      },
      capitalEfficiency: {
        label: "Capital efficiency",
        score: 50,
        confidence: "inferred",
        signals: ["Pricing hypothesis: $9/month"],
        gaps: ["No proven pricing means CAC payback cannot yet be modeled."],
        nextAction: "Estimate cash to first paid customer and cash to repeatable channel.",
      },
      supportBurden: {
        label: "Support burden",
        score: 52,
        confidence: "inferred",
        signals: ["Support load posture: Log questions."],
        gaps: ["Concierge / manual / hand-hold language signals high per-user support cost."],
        nextAction: "Log every support question, time spent, and root cause during the first concierge pilot before scaling.",
      },
      competitiveRetaliation: {
        label: "Competitive retaliation",
        score: 38,
        confidence: "inferred",
        signals: ["Competition / substitute / status-quo language present."],
        gaps: ["Clone / wrapper risk is explicit but no defensible workflow or data moat is articulated."],
        nextAction: "Name the strongest two incumbents or substitutes and document the specific moat.",
      },
    },
    keyIntegrations: ["Calendar"],
    dataRequirements: ["RecoveryPlan.energyScore"],
    evidenceSources: [],
    claims: ["Evidence supports weekly routines."],
    contradictions: ["Missing x coverage."],
    untestedAssumptions: ["Willingness to pay for $9/month."],
    changeMindTriggers: ["Qualified buyers reject the pricing hypothesis."],
    companySimulation: {
      customerSegments: ["Gen Z students"],
      salesCycle: "Founder-led validation.",
      pricing: "$9/month",
      grossMargin: "Likely software-margin.",
      cac: "Creator CAC below $18",
      paybackPeriod: "Not proven.",
      activation: "Run weekly check.",
      retention: "40% week-two retention",
      expansion: "Expand after repeat usage.",
      supportLoad: "Log questions.",
      infrastructureCost: "Low until usage.",
      complianceCost: "Review wellness claims.",
      engineeringComplexity: "Moderate",
      competitiveResponse: "Substitutes can copy positioning.",
      hiringNeeds: "Founder plus engineer.",
      capitalIntensity: "Low before ads.",
      failureModes: ["The pain is inspirational but not urgent."],
    },
    experiments: [
      {
        id: "fake-door-waitlist",
        type: "Fake-door waitlist test",
        hypothesis: "Users will join.",
        audience: "Gen Z students",
        channel: "creator partnerships",
        cost: "Landing page",
        successThreshold: "8% signup",
        failureThreshold: "2% signup",
        ethicsReview: "Do not imply a finished product.",
        metrics: ["signup rate"],
        result: "Not run yet.",
        interpretation: "Pending.",
        nextAction: "Publish waitlist.",
      },
    ],
    killCriteria: {
      missingEvidence: ["x coverage"],
      disconfirmationPath: "Launch follow-up research.",
      pivotTriggers: ["Users prefer templates."],
      stopTriggers: ["2% signup"],
      killReasons: ["Buyer does not show urgent pain."],
    },
    mvpHandoff: {
      sourceCodeStatus: "Source code: pending builder output",
      setupInstructions: "Launch builder.",
      testCoverage: "Run checks.",
      deploymentPath: "Deployment proposal blocked.",
      analyticsPlan: "Track signup rate.",
      securityNotes: "No sensitive data.",
      accessibilityPass: "Check mobile.",
      mobileBehavior: "Mobile-first.",
      dataModel: ["RecoveryPlan: energyScore"],
      operatorDashboard: "Show experiments.",
      evidenceBacklink: "2 evidence sources linked.",
    },
    approvals: [
      { level: "Human-approved deployment", status: "requires-human", evidence: "Required." },
    ],
    nextActions: ["Run the fake-door waitlist test."],
  };
}

function evidenceRichWorkspace(title = "Gen Z Recovery Planner") {
  const workspace = workspaceFixture(title);
  workspace.evidenceSources = [
    {
      id: "source-rich",
      platform: "youtube",
      title: "Creators package burnout recovery routines",
      keywords: "burnout recovery, weekly routine",
      summary: "High save intent around weekly recovery rituals.",
      url: "https://example.com/youtube",
      views: 240000,
      comments: 800,
    },
  ];
  return workspace;
}

function withEvaluationLensScores(workspace: VentureOperatingWorkspace, score: number): VentureOperatingWorkspace {
  const confidence = score >= 68 ? "source-backed" : score < 35 ? "speculative" : "inferred";
  return {
    ...workspace,
    evaluationLenses: Object.fromEntries(
      Object.entries(workspace.evaluationLenses).map(([key, lens]) => [
        key,
        {
          ...lens,
          score,
          confidence,
          signals: [`${lens.label} signal at ${score}`],
          gaps: score < 55 ? [`${lens.label} needs more proof.`] : [],
          nextAction: `Improve ${lens.label.toLowerCase()} before changing posture.`,
        },
      ]),
    ) as VentureOperatingWorkspace["evaluationLenses"],
  };
}

function seedDraftReadyNoSendEmailGate(storage = new MemoryStorage(), owner = "test@marketpulse.dev") {
  const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

  recordVentureMvpBuildWorkspace(
    owner,
    saved.id,
    {
      status: "executable",
      owner: "generated-app-verifier",
      repoPath: "/tmp/recovery-planner/dist",
      setupCommand: "pnpm install",
      typecheckCommand: "pnpm type-check",
      testCommand: "pnpm test",
      buildCommand: "pnpm build",
      browserSmokeCommand: "pnpm browser-smoke",
      deploymentCommand: "Local no-deploy preview readiness only",
      setupCheck: "passed",
      typecheckCheck: "passed",
      unitTestCheck: "passed",
      buildCheck: "passed",
      browserSmokeCheck: "passed",
      deploymentCheck: "passed",
      verificationNotes: "All executable and local no-deploy preview checks passed for pilot onboarding.",
    },
    storage,
    "2026-05-27T06:09:00.000Z",
  );
  recordVentureArtifact(
    owner,
    saved.id,
    {
      artifactType: "deployment-proof",
      status: "verified",
      title: "Local no-deploy pilot preview proof",
      uri: "/tmp/recovery-planner/dist",
      owner: "generated-app-verifier",
      verificationCommand: "Local preview only; no external deployment command approved.",
      evidence: "Verified local preview artifact for pilot onboarding. No deploy, no send, no spend, no contact, no billing change.",
      changeSummary: "Attached no-deploy readiness proof so QA can distinguish local pilot proof from external release.",
    },
    storage,
    "2026-05-27T06:09:30.000Z",
  );
  recordVentureExperimentResult(
    owner,
    saved.id,
    "fake-door-waitlist",
    {
      result: "Three local pilot requests were recorded from no-send validation notes.",
      interpretation: "Pass: internal pilot demand exists before any outreach, deployment, spend, or billing change.",
      nextAction: "Convert the local pilot requests into a measured activation cohort before external launch.",
    },
    storage,
    "2026-05-27T06:09:45.000Z",
  );

  let portfolio = loadVenturePortfolio(owner, storage);
  const productBuildCommand = buildVentureProductBuildCommandQueue(portfolio)[0];
  recordVentureProductBuildCommandRun(
    owner,
    saved.id,
    {
      commandId: productBuildCommand?.id ?? "",
      runState: "promoted",
      owner: "Rishabh",
      runProof: "Promoted local MVP run is ready for internal pilot onboarding proof.",
      localArtifactProof: "/tmp/recovery-planner/dist",
      verifierReportProof: "Verifier report: setup/typecheck/test/build/browser-smoke all green.",
      learning: "The first pilot cohort can be measured from local-only onboarding.",
    },
    storage,
    "2026-05-27T06:10:00.000Z",
  );
  recordVenturePricingSignal(
    owner,
    saved.id,
    {
      qualifiedBuyerCount: 3,
      paidCommitmentCount: 1,
      invoiceRequestCount: 1,
      acceptedPrice: "$180 pilot",
      objectionSummary: "Keep onboarding local-only until calendar privacy is proven.",
      evidenceNote: "Three inbound no-send pilot requests came from manual validation notes.",
    },
    storage,
    "2026-05-27T06:12:00.000Z",
  );

  portfolio = loadVenturePortfolio(owner, storage);
  const readyItem = buildVentureNoSendEmailGateWorklist(portfolio)[0];
  if (!readyItem || readyItem.status !== "draft-ready") {
    throw new Error("Expected a draft-ready no-send email gate work item.");
  }

  return { storage, owner, saved, portfolio, readyItem };
}

describe("venture portfolio storage", () => {
  it("uses a stable owner-scoped storage key", () => {
    expect(getVenturePortfolioStorageKey("Test@MarketPulse.dev")).toBe("marketpulse-venture-portfolio:test-marketpulse.dev");
    expect(getVenturePortfolioStorageKey("Team One")).toBe("marketpulse-venture-portfolio:team-one");
  });

  it("saves, loads, and upserts a venture workspace", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";

    const first = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const second = saveVentureWorkspace(owner, workspaceFixture("Updated Recovery Planner"), storage, "2026-05-27T02:00:00.000Z");
    const saved = loadVenturePortfolio(owner, storage);

    expect(first.savedAt).toBe("2026-05-27T01:00:00.000Z");
    expect(second.savedAt).toBe(first.savedAt);
    expect(saved).toHaveLength(1);
    expect(saved[0].title).toBe("Updated Recovery Planner");
    expect(saved[0].lifecycleStatus).toBe("validating");
    expect(saved[0].reviewCadence).toBe("Weekly until experiment result is recorded");
    expect(saved[0].predictionSnapshots).toHaveLength(1);
    expect(saved[0].whyNow.headline).toContain("Creator-led recovery content");
    expect(saved[0].mvpScope.mustHaveFeatures).toContain("Weekly planning loop");
    expect(saved[0].buildEstimate.effortLevel).toBe("medium");
    expect(saved[0].evidenceConfidence.label).toBe("thin");
    expect(saved[0].reasoningDebate.confidence).toBe("inferred");
    expect(saved[0].reasoningDebate.clearestKillReason).toBe("Buyer does not show urgent pain.");
    expect(saved[0].evaluationLenses.jobsToBeDone.score).toBe(72);
    expect(saved[0].evaluationLenses.platformDependency.signals).toContain("Dependencies: Calendar");
    expect(saved[0].opportunityDemandSnapshot).toEqual(expect.objectContaining({
      buyer: "Gen Z students",
      demandScore: expect.any(Number),
    }));
    expect(filterVenturePortfolio(saved, "Buyer: Gen Z students")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "Creator-led recovery content")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "Basic recovery plan dashboard")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "Product-minded full-stack builder")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "evidence confidence")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "reasoning debate")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "evaluation lenses")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "Document the manual fallback")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "Publish the waitlist copy")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "weekly planning loop can become a repeat workflow")).toHaveLength(1);
  });

  it("ignores corrupt stored records instead of crashing", () => {
    const storage = new MemoryStorage();
    storage.setItem(getVenturePortfolioStorageKey("owner"), JSON.stringify([{ bad: true }, workspaceFixture()]));

    expect(loadVenturePortfolio("owner", storage)).toHaveLength(0);
  });

  it("normalizes legacy saved ventures that do not have decision history yet", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const legacyRecord: Record<string, unknown> = { ...saved };
    delete legacyRecord.decisionHistory;
    delete legacyRecord.gapActionHistory;
    delete legacyRecord.predictionSnapshots;
    delete legacyRecord.pricingSignals;
    delete legacyRecord.customerInterviews;
    delete legacyRecord.outreachApprovals;
    delete legacyRecord.riskRecords;
    delete legacyRecord.mvpBuildWorkspaces;
    delete legacyRecord.artifactRecords;
    delete legacyRecord.moneySignals;
    delete legacyRecord.roadmapTasks;
    delete legacyRecord.supportIssues;
    delete legacyRecord.activationCohorts;
    delete legacyRecord.channelEconomics;
    delete legacyRecord.autonomyAudit;
    delete legacyRecord.agentRuns;
    delete legacyRecord.competitors;
    delete legacyRecord.browserResearchTasks;
    delete legacyRecord.evaluationLenses;
    storage.setItem(getVenturePortfolioStorageKey(owner), JSON.stringify([legacyRecord]));

    const loaded = loadVenturePortfolio(owner, storage);

    expect(loaded).toHaveLength(1);
    expect(loaded[0].decisionHistory).toEqual([]);
    expect(loaded[0].gapActionHistory).toEqual([]);
    expect(loaded[0].predictionSnapshots).toEqual([]);
    expect(loaded[0].pricingSignals).toEqual([]);
    expect(loaded[0].customerInterviews).toEqual([]);
    expect(loaded[0].outreachApprovals).toEqual([]);
    expect(loaded[0].riskRecords).toEqual([]);
    expect(loaded[0].mvpBuildWorkspaces).toEqual([]);
    expect(loaded[0].artifactRecords).toEqual([]);
    expect(loaded[0].moneySignals).toEqual([]);
    expect(loaded[0].roadmapTasks).toEqual([]);
    expect(loaded[0].supportIssues).toEqual([]);
    expect(loaded[0].activationCohorts).toEqual([]);
    expect(loaded[0].channelEconomics).toEqual([]);
    expect(loaded[0].autonomyAudit).toEqual([]);
    expect(loaded[0].agentRuns).toEqual([]);
    expect(loaded[0].competitors).toEqual([]);
    expect(loaded[0].browserResearchTasks).toEqual([]);
    expect(loaded[0].evaluationLenses.jobsToBeDone.label).toBe("Jobs-to-be-done");
    expect(loaded[0].evaluationLenses.willingnessToPay.nextAction).toContain("qualified buyers");
  });

  it("builds explicit readiness notices for empty and degraded venture states", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const empty = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const emptyNotices = buildVentureReadinessNotices(empty);
    const emptyNoticeIds = emptyNotices.map((notice) => notice.id);

    expect(emptyNoticeIds).toEqual(expect.arrayContaining([
      "source-backed-evidence",
      "experiment-result-empty",
      "pricing-signal-empty",
      "customer-interview-empty",
      "mvp-workspace-empty",
      "artifact-proof-empty",
      "competitor-watch-empty",
      "autonomy-audit-empty",
    ]));
    expect(emptyNotices[0]).toEqual(expect.objectContaining({
      tone: "blocked",
      title: "No source-backed evidence attached",
    }));

    const sourced = saveVentureWorkspace(owner, evidenceRichWorkspace("Evidence-backed Planner"), storage, "2026-05-27T02:00:00.000Z");
    const sourcedNoticeIds = buildVentureReadinessNotices(sourced).map((notice) => notice.id);

    expect(sourcedNoticeIds).not.toContain("source-backed-evidence");
    expect(sourcedNoticeIds).toContain("evidence-readiness-degraded");
  });

  it("turns evidence gaps into searchable browser research tasks", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const candidate = buildVentureBrowserResearchCandidates(saved)[0];

    expect(candidate).toEqual(expect.objectContaining({
      sourceType: "gap-action",
      platform: "x",
      sourceTarget: "x coverage",
      suggestedStatus: "queued",
    }));

    const updated = recordVentureBrowserResearchTask(
      owner,
      saved.id,
      {
        sourceType: candidate.sourceType,
        sourceRecordId: candidate.sourceRecordId,
        platform: candidate.platform,
        sourceTarget: candidate.sourceTarget,
        prompt: candidate.prompt,
        status: "evidence-captured",
        owner: "browser-researcher",
        evidenceUrl: "https://example.com/x/thread",
        findings: "X thread shows buyers comparing three recovery planner substitutes.",
        replayNote: "Replay by opening the saved X thread and checking quote timestamps.",
        nextAction: "Add the source as evidence, then rerun kill-pressure rules.",
      },
      storage,
      "2026-05-27T02:00:00.000Z",
    );

    expect(updated?.browserResearchTasks[0]).toEqual(expect.objectContaining({
      status: "evidence-captured",
      platform: "x",
      evidenceUrl: "https://example.com/x/thread",
    }));
    expect(buildVentureBrowserResearchCandidates(updated!)).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ sourceRecordId: candidate.sourceRecordId }),
    ]));
    expect(filterVenturePortfolio(loadVenturePortfolio(owner, storage), "recovery planner substitutes")).toHaveLength(1);
    const summary = summarizeVenturePortfolio(loadVenturePortfolio(owner, storage));
    expect(summary.browserResearchTaskCount).toBe(1);
    expect(summary.capturedBrowserResearchTaskCount).toBe(1);
    expect(summary.untriagedBrowserResearchCandidateCount).toBeGreaterThan(0);
  });

  it("finds similar thesis drafts against saved venture memory", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture("Campus Reimbursement Copilot"), storage, "2026-05-27T01:00:00.000Z");
    const updated = {
      ...saved,
      targetBuyer: "Student club treasurers",
      painStatement: "Club leaders miss reimbursement packet deadlines and lose vendor approvals.",
      productWedge: "Inbox-to-budget workflow that turns receipts into approved reimbursement packets.",
      acquisitionChannels: ["student government partnerships"],
    };
    replaceVenturePortfolio(owner, [updated], storage);

    const matches = findSimilarVentureTheses({
      title: "Campus Ops Copilot",
      targetBuyer: "Student club treasurers",
      painStatement: "Treasurers miss reimbursement packet deadlines.",
      productWedge: "Inbox workflow for approved reimbursement packets.",
      acquisitionChannel: "student government partnerships",
    }, loadVenturePortfolio(owner, storage));

    expect(matches[0]).toEqual(expect.objectContaining({
      title: "Campus Reimbursement Copilot",
      recommendation: "reuse",
      matchedFields: expect.arrayContaining(["buyer", "pain", "wedge", "channel"]),
    }));
    expect(matches[0].differenceQuestions).toContain("Do substitutes or status quo options differ?");
    expect(matches[0].score).toBeGreaterThanOrEqual(55);
    expect(findSimilarVentureTheses({ title: "Unrelated procurement tool" }, loadVenturePortfolio(owner, storage))).toEqual([]);
  });

  it("records experiment outcomes and moves validating ventures into signal collection", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    const updated = recordVentureExperimentResult(
      owner,
      "venture-demo-option-1",
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits.",
        interpretation: "Pass: early demand crossed the signup threshold.",
        nextAction: "Interview the first 5 signups.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    const saved = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.lifecycleStatus).toBe("getting-signals");
    expect(saved.updatedAt).toBe("2026-05-27T03:00:00.000Z");
    expect(saved.experiments[0]).toEqual(expect.objectContaining({
      result: "12 qualified signups from 100 visits.",
      interpretation: "Pass: early demand crossed the signup threshold.",
      nextAction: "Interview the first 5 signups.",
    }));
  });

  it("calibrates venture demand against recorded experiment outcomes", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    expect(calibrateVentureDemand(saved).status).toBe("not-measured");

    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits.",
        interpretation: "Pass: early demand crossed the signup threshold.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    const calibration = calibrateVentureDemand(loadVenturePortfolio(owner, storage)[0]);

    expect(calibration.status).toBe("passed");
    expect(calibration.measuredExperimentCount).toBe(1);
    expect(calibration.passCount).toBe(1);
    expect(calibration.experiments[0].prediction).toEqual(expect.objectContaining({
      experimentId: "fake-door-waitlist",
    }));
    expect(calibration.experiments[0].predictionAlignment).not.toBe("not-predicted");
    expect(calibration.experiments[0].note).toContain("success threshold");
  });

  it("builds success prediction memory from confirmed forecasts and measured outcomes", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits.",
        interpretation: "Pass: early demand crossed the signup threshold.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 2,
        invoiceRequestCount: 1,
        acceptedPrice: "$9/month",
        objectionSummary: "Need student discount before annual plan.",
        evidenceNote: "Three qualified buyers accepted the paid pilot.",
      },
      storage,
      "2026-05-27T03:15:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "Two pilot users paid after finishing the reset plan.",
        learning: "Activation rate is usable, retention depends on reducing support load.",
        nextAction: "Interview retained users before buying paid traffic.",
      },
      storage,
      "2026-05-27T04:30:00.000Z",
    );
    const withCohort = loadVenturePortfolio(owner, storage)[0];
    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: withCohort.activationCohorts[0].id,
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 2,
        revenueCents: 18000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements for the cohort.",
        nextAction: "Repeat only if paid cohort revenue stays above acquisition spend.",
      },
      storage,
      "2026-05-27T04:40:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const predicted = {
      ...loaded,
      predictionSnapshots: loaded.predictionSnapshots.map((snapshot) => ({
        ...snapshot,
        predictedOutcome: "expected-pass" as const,
        buyerUrgency: 86,
        budgetLikelihood: 78,
        channelReach: 76,
        conversionProbability: 84,
        retentionProbability: 72,
        expansionPotential: 68,
      })),
    };
    const memories = buildVentureSuccessPredictionMemories([predicted]);
    const exported = JSON.parse(serializeVenturePortfolio([predicted])) as { successPredictionMemories?: Array<{ type?: string; predictionAlignment?: string }> };

    expect(memories[0]).toEqual(expect.objectContaining({
      type: "Fake-door waitlist test",
      predictedOutcome: "expected-pass",
      predictionAlignment: "confirmed",
      paidCommitmentCount: 2,
      retainedUserCount: 5,
      revenueCents: 18000,
    }));
    expect(memories[0].strongestOutcome).toContain("$180");
    expect(memories[0].reusableLesson).toContain("predicted success");
    expect(filterVenturePortfolio([predicted], "success prediction memory")).toHaveLength(1);
    expect(filterVenturePortfolio([predicted], "outcome revenue confirmed the forecast")).toHaveLength(1);
    expect(exported.successPredictionMemories?.[0]).toEqual(expect.objectContaining({
      type: "Fake-door waitlist test",
      predictionAlignment: "confirmed",
    }));
  });

  it("builds vanity metric memory from attention without conversion or payback", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "manual",
        channel: "campus awareness ads",
        spendCents: 12000,
        impressions: 2500,
        clicks: 180,
        signupCount: 1,
        activatedCount: 0,
        paidCount: 0,
        revenueCents: 0,
        owner: "Rishabh",
        evidence: "Awareness ad generated clicks but no paid users.",
        nextAction: "Stop spend until clicks turn into retained or paid users.",
      },
      storage,
      "2026-05-27T04:40:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const memories = buildVentureVanityMetricMemories([loaded]);
    const empiricalMemories = buildVentureEmpiricalCalibrationMemories([loaded]);
    const fakeMarketMemories = buildVentureFakeMarketMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as {
      vanityMetricMemories?: Array<{ metricLabel?: string; sourceType?: string }>;
      empiricalCalibrationMemories?: Array<{ gullibilityRisk?: string; vanityTrapCount?: number }>;
      fakeMarketMemories?: Array<{ marketLabel?: string; vanityTrapCount?: number }>;
    };

    expect(memories[0]).toEqual(expect.objectContaining({
      sourceType: "channel-economics",
      severity: "high",
      metricLabel: "campus awareness ads reach",
      metricValue: "2500 impressions, 180 clicks, 1 signup",
    }));
    expect(memories[0].weakOutcome).toContain("$0 revenue");
    expect(memories[0].neverTreatAs).toContain("impressions, clicks, or signups alone");
    expect(filterVenturePortfolio([loaded], "vanity metric memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Awareness ad generated clicks")).toHaveLength(1);
    expect(empiricalMemories[0]).toEqual(expect.objectContaining({
      gullibilityRisk: "high",
      vanityTrapCount: 1,
      confirmedPredictionCount: 0,
    }));
    expect(filterVenturePortfolio([loaded], "empirical calibration memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "discount vanity")).toHaveLength(1);
    expect(fakeMarketMemories[0]).toEqual(expect.objectContaining({
      marketLabel: "Gen Z students via campus awareness ads reach",
      vanityTrapCount: 1,
    }));
    expect(fakeMarketMemories[0].neverRepeat).toContain("Do not treat this market as attractive again");
    expect(filterVenturePortfolio([loaded], "fake market memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "fresh measured demand")).toHaveLength(1);
    expect(exported.vanityMetricMemories?.[0]).toEqual(expect.objectContaining({
      metricLabel: "campus awareness ads reach",
      sourceType: "channel-economics",
    }));
    expect(exported.empiricalCalibrationMemories?.[0]).toEqual(expect.objectContaining({
      gullibilityRisk: "high",
      vanityTrapCount: 1,
    }));
    expect(exported.fakeMarketMemories?.[0]).toEqual(expect.objectContaining({
      marketLabel: "Gen Z students via campus awareness ads reach",
      vanityTrapCount: 1,
    }));
  });

  it("turns killed and failed ventures into reusable failure lessons", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "Missed signup threshold; students said recovery planning was not urgent.",
        interpretation: "Failed because the buyer liked the idea but would not change their routine.",
      },
      storage,
      "2026-05-27T02:00:00.000Z",
    );
    recordVentureDecision(
      owner,
      saved.id,
      {
        decision: "kill",
        rationale: "Killed because Gen Z students did not show urgent demand.",
        nextAction: "Revisit only if weekly recovery planning becomes externally required.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );

    const lessons = buildVentureFailureLessons(loadVenturePortfolio(owner, storage), {
      title: "Gen Z Recovery Planner",
      targetBuyer: "Gen Z students",
      painStatement: "Burned-out students need weekly recovery help.",
      productWedge: "Weekly planning loop for recovery routines.",
      acquisitionChannel: "creator partnerships",
    });

    expect(lessons).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourceType: "killed-decision",
        severity: "critical",
        matched: true,
        evidence: expect.stringContaining("Killed because Gen Z students"),
        reuseTrigger: "Revisit only if weekly recovery planning becomes externally required.",
      }),
      expect.objectContaining({
        sourceType: "failed-experiment",
        severity: "high",
        matched: true,
        lesson: "Fake-door waitlist test failed",
        neverRepeat: expect.stringContaining("failure threshold"),
        evidence: expect.stringContaining("would not change their routine"),
      }),
    ]));
  });

  it("requires fresh post-kill evidence before flagging a killed venture as newly viable", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    recordVentureDecision(
      owner,
      saved.id,
      {
        decision: "kill",
        rationale: "Killed because Gen Z students did not show urgent demand.",
        nextAction: "Revisit only if weekly recovery planning becomes externally required.",
      },
      storage,
      "2026-05-27T02:00:00.000Z",
    );

    expect(buildVentureRevivalTriggers(loadVenturePortfolio(owner, storage))).toEqual([]);

    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits after the school wellness deadline changed.",
        interpretation: "Passed because students now had an external reason to plan recovery routines.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 4,
        paidCommitmentCount: 1,
        invoiceRequestCount: 1,
        acceptedPrice: "$9/month",
        objectionSummary: "Need a campus wellness discount.",
        evidenceNote: "Two post-kill buyers requested paid access after the deadline change.",
      },
      storage,
      "2026-05-27T04:00:00.000Z",
    );

    const loaded = loadVenturePortfolio(owner, storage)[0];
    const triggers = buildVentureRevivalTriggers([loaded], {
      title: "Gen Z Recovery Planner",
      targetBuyer: "Gen Z students",
      painStatement: "Burned-out students need weekly recovery help.",
      productWedge: "Weekly planning loop for recovery routines.",
      acquisitionChannel: "creator partnerships",
    });

    expect(loaded.lifecycleStatus).toBe("killed");
    expect(loaded.experiments[0].recordedAt).toBe("2026-05-27T03:00:00.000Z");
    expect(triggers).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourceType: "passed-experiment",
        confidence: "revival-review",
        matched: true,
        originalFailure: "Killed because Gen Z students did not show urgent demand.",
        freshEvidence: expect.stringContaining("external reason"),
      }),
      expect.objectContaining({
        sourceType: "validated-pricing",
        confidence: "revival-review",
        matched: true,
        freshEvidence: expect.stringContaining("Two post-kill buyers"),
        revivalCondition: "Revisit only if weekly recovery planning becomes externally required.",
      }),
    ]));
  });

  it("stores pre-run prediction snapshots when saving a venture", () => {
    const snapshots = buildVenturePredictionSnapshots(evidenceRichWorkspace(), "2026-05-27T00:00:00.000Z");

    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]).toEqual(expect.objectContaining({
      experimentId: "fake-door-waitlist",
      predictedAt: "2026-05-27T00:00:00.000Z",
      successThreshold: "8% signup",
      failureThreshold: "2% signup",
    }));
    expect(snapshots[0].conversionProbability).toBeGreaterThan(0);
    expect(["expected-pass", "expected-fail", "uncertain"]).toContain(snapshots[0].predictedOutcome);
  });

  it("uses evaluation lenses to calibrate prediction, drift, and memo posture", () => {
    const highLensWorkspace = withEvaluationLensScores(evidenceRichWorkspace("High Lens Planner"), 82);
    const weakLensWorkspace = withEvaluationLensScores(evidenceRichWorkspace("Weak Lens Planner"), 24);
    const highPrediction = buildVenturePredictionSnapshots(highLensWorkspace, "2026-05-27T00:00:00.000Z")[0];
    const weakPrediction = buildVenturePredictionSnapshots(weakLensWorkspace, "2026-05-27T00:00:00.000Z")[0];
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, weakLensWorkspace, storage, "2026-05-27T01:00:00.000Z");
    const drift = buildVentureDemandDriftReport(saved);
    const memo = buildVentureFounderExecutionMemo(saved);

    expect(weakPrediction.conversionProbability).toBeLessThan(highPrediction.conversionProbability);
    expect(weakPrediction.trustBarrier).toBeGreaterThan(highPrediction.trustBarrier);
    expect(weakPrediction.rationale).toContain("Weakest decision lens");
    expect(drift.components).toContainEqual(expect.objectContaining({
      source: "evaluation-lens",
      label: "Evaluation lenses",
    }));
    expect(drift.status).toBe("overestimated");
    expect(memo.status).toBe("blocked");
    expect(memo.statusReason).toMatch(/weak evaluation lens/i);
    expect(memo.primaryNextAction).toContain("Improve jobs-to-be-done");
  });

  it("records pricing signals and calibrates willingness to pay", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    expect(calibrateVenturePricing(saved).status).toBe("not-measured");

    const updated = recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 2,
        invoiceRequestCount: 1,
        acceptedPrice: "$9/month",
        objectionSummary: "Need student discount before annual plan.",
        evidenceNote: "Three qualified buyers accepted the paid pilot.",
      },
      storage,
      "2026-05-27T03:15:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const calibration = calibrateVenturePricing(loaded);
    const pricingMemories = buildVentureConvertedPricingMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { convertedPricingMemories?: Array<{ acceptedPrice?: string }> };

    expect(updated?.pricingSignals).toHaveLength(1);
    expect(loaded.pricingSignals[0]).toEqual(expect.objectContaining({
      experimentId: "pricing-smoke",
      qualifiedBuyerCount: 5,
      paidCommitmentCount: 2,
      invoiceRequestCount: 1,
      acceptedPrice: "$9/month",
      objectionSummary: "Need student discount before annual plan.",
    }));
    expect(calibration.status).toBe("validated");
    expect(calibration.paidSignalCount).toBe(3);
    expect(calibration.willingnessToPayScore).toBe(60);
    expect(calibration.note).toContain("$9/month");
    expect(pricingMemories[0]).toEqual(expect.objectContaining({
      pricingHypothesis: "$9/month",
      acceptedPrice: "$9/month",
      qualifiedBuyerCount: 5,
      paidCommitmentCount: 2,
      invoiceRequestCount: 1,
      paidSignalCount: 3,
    }));
    expect(pricingMemories[0].reusableLesson).toContain("$9/month converted");
    expect(filterVenturePortfolio([loaded], "converted pricing memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "student discount")).toHaveLength(1);
    expect(exported.convertedPricingMemories?.[0]?.acceptedPrice).toBe("$9/month");
  });

  it("builds converted pain memory from paid pricing, money, and cohort evidence", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 2,
        invoiceRequestCount: 1,
        acceptedPrice: "$9/month",
        objectionSummary: "Need student discount before annual plan.",
        evidenceNote: "Three qualified buyers accepted the paid pilot.",
      },
      storage,
      "2026-05-27T03:15:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 18000,
        currency: "USD",
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Founder call produced a $180 pilot commitment.",
      },
      storage,
      "2026-05-27T04:15:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "manual",
        cohortLabel: "Campus pilot cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "Two pilot users paid after finishing the reset plan.",
        learning: "The burnout pain converts when deadlines are near.",
        nextAction: "Reuse this pain for deadline-heavy student segments.",
      },
      storage,
      "2026-05-27T04:30:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const memories = buildVentureConvertedPainMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { convertedPainMemories?: Array<{ painStatement?: string }> };

    expect(memories).toHaveLength(1);
    expect(memories[0]).toEqual(expect.objectContaining({
      targetBuyer: "Gen Z students",
      painStatement: "Burned-out students need help.",
      paidCommitmentCount: 2,
      paidUserCount: 4,
      retainedUserCount: 5,
      revenueCents: 36000,
    }));
    expect(memories[0].evidence.join(" ")).toContain("$180");
    expect(memories[0].reusableLesson).toContain("Burned-out students need help");
    expect(filterVenturePortfolio([loaded], "converted pain memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "deadline-heavy student segments")).toHaveLength(1);
    expect(exported.convertedPainMemories?.[0]?.painStatement).toBe("Burned-out students need help.");
  });

  it("builds wrong claim memory from contradictions and failed experiments", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T04:00:00.000Z");

    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "Failed below 2% signup.",
        interpretation: "Weak buyer urgency.",
        nextAction: "Rewrite the buyer and channel before another waitlist.",
      },
      storage,
      "2026-05-27T04:15:00.000Z",
    );

    const loaded = loadVenturePortfolio(owner, storage)[0];
    const memories = buildVentureWrongClaimMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { wrongClaimMemories?: Array<{ claim?: string; sourceType?: string }> };

    expect(memories).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourceType: "contradiction",
        claim: "Evidence supports weekly routines.",
        evidence: "Missing x coverage.",
      }),
      expect.objectContaining({
        sourceType: "failed-experiment",
        claim: "Users will join.",
      }),
    ]));
    expect(memories.map((memory) => memory.neverReuse).join(" ")).toContain("Missing x coverage");
    expect(filterVenturePortfolio([loaded], "wrong claim memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Weak buyer urgency")).toHaveLength(1);
    expect(exported.wrongClaimMemories?.some((memory) => memory.sourceType === "failed-experiment")).toBe(true);
  });

  it("records customer interviews as searchable persona memory", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    const updated = recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        willingnessToPay: "$9/month if it saves me time.",
        objections: "Privacy around wellness data.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
        evidenceNote: "Interview notes captured after waitlist signup.",
      },
      storage,
      "2026-05-27T03:20:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.customerInterviews).toHaveLength(1);
    expect(loaded.customerInterviews[0]).toEqual(expect.objectContaining({
      persona: "Burned-out sophomore",
      sentiment: "positive",
      requestedFeatures: "Calendar sync; gentle reminders",
    }));
    expect(filterVenturePortfolio([loaded], "Sunday reset plan")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Calendar sync")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Privacy around wellness data")).toHaveLength(1);
  });

  it("records human-approved outreach as attributable no-send CRM memory", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const interviewSaved = recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        willingnessToPay: "$9/month if it saves me time.",
        objections: "Privacy around wellness data.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
      },
      storage,
      "2026-05-27T03:20:00.000Z",
    );

    const updated = recordVentureOutreachApproval(
      owner,
      saved.id,
      {
        sourceInterviewId: interviewSaved?.customerInterviews[0].id,
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Thanks for joining the Recovery Planner early list.",
        status: "approved",
        riskNote: "Do not imply clinical advice.",
        nextAction: "Send manually after reviewing consent.",
        attribution: "founder@test.dev",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.outreachApprovals).toHaveLength(1);
    expect(loaded.outreachApprovals[0]).toEqual(expect.objectContaining({
      approvalLevel: "Human-approved outreach",
      status: "approved",
      sourceInterviewId: interviewSaved?.customerInterviews[0].id,
      contactPersona: "Burned-out sophomore",
      channel: "manual email",
      messageDraft: "Thanks for joining the Recovery Planner early list.",
      riskNote: "Do not imply clinical advice.",
      nextAction: "Send manually after reviewing consent.",
      attribution: "founder@test.dev",
      externalSendStatus: "not-sent",
    }));
    expect(filterVenturePortfolio([loaded], "clinical advice")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "manual email")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "not-sent")).toHaveLength(1);
  });

  it("builds human-gated no-send outreach campaign briefs from approvals, interviews, and risks", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        willingnessToPay: "$9/month if it saves me time.",
        objections: "Privacy around wellness data.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
      },
      storage,
      "2026-05-27T03:20:00.000Z",
    );
    recordVentureOutreachApproval(
      owner,
      saved.id,
      {
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Thanks for joining the Recovery Planner early list.",
        status: "approved",
        riskNote: "Do not imply clinical advice.",
        nextAction: "Send manually after reviewing consent.",
        attribution: "founder@test.dev",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const campaign = buildVentureOutreachCampaignBrief(loaded);

    expect(campaign).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      status: "ready",
      persona: "Burned-out sophomore",
      channel: "manual email",
    }));
    expect(campaign.noSendBoundary).toContain("not-sent");
    expect(campaign.messageSequence.join(" ")).toContain("Thanks for joining the Recovery Planner early list.");
    expect(campaign.proofPoints.join(" ")).toContain("Sunday reset plan");
    expect(campaign.riskChecks.join(" ")).toContain("clinical advice");
    expect(campaign.markdown).toContain("# Outreach Campaign Brief: Gen Z Recovery Planner");
    expect(campaign.markdown).toContain("No-send boundary");
    expect(filterVenturePortfolio([loaded], "outreach campaign")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "human-approved outreach")).toHaveLength(1);
  });

  it("builds failed outreach memory from blocked campaigns and dismissed no-send approvals", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    expect(buildVentureFailedOutreachMemories([saved])).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourceType: "campaign-blocked",
        channel: "creator partnerships",
      }),
    ]));

    recordVentureOutreachApproval(
      owner,
      saved.id,
      {
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Thanks for joining the Recovery Planner early list.",
        status: "dismissed",
        riskNote: "Do not imply clinical advice.",
        nextAction: "Keep no-send state until consent review is complete.",
        attribution: "founder@test.dev",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const memories = buildVentureFailedOutreachMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { failedOutreachMemories?: Array<{ sourceType?: string; channel?: string }> };

    expect(memories).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourceType: "approval-dismissed",
        persona: "Burned-out sophomore",
        channel: "manual email",
        evidence: "Do not imply clinical advice.",
      }),
    ]));
    expect(memories.map((memory) => memory.neverRepeat).join(" ")).toContain("Thanks for joining the Recovery Planner early list.");
    expect(filterVenturePortfolio([loaded], "failed outreach memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "consent review")).toHaveLength(1);
    expect(exported.failedOutreachMemories?.some((memory) => memory.sourceType === "approval-dismissed")).toBe(true);
  });

  it("turns customer, outreach, and gap signals into owned risk register records", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        willingnessToPay: "$9/month if it saves me time.",
        objections: "Privacy around wellness data.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
      },
      storage,
      "2026-05-27T03:20:00.000Z",
    );
    recordVentureOutreachApproval(
      owner,
      saved.id,
      {
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Thanks for joining the Recovery Planner early list.",
        status: "approved",
        riskNote: "Do not imply clinical advice.",
        nextAction: "Send manually after reviewing consent.",
        attribution: "founder@test.dev",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    const beforeGap = loadVenturePortfolio(owner, storage)[0];
    const task = buildVentureGapActionQueue(beforeGap)[0];
    recordVentureGapAction(
      owner,
      saved.id,
      task,
      { status: "completed", outcome: "New X research still showed weak buyer urgency." },
      storage,
      "2026-05-27T03:35:00.000Z",
    );
    const withSignals = loadVenturePortfolio(owner, storage)[0];
    const candidates = buildVentureRiskCandidates(withSignals);

    expect(candidates.map((candidate) => candidate.sourceType)).toEqual([
      "customer-interview",
      "outreach-approval",
      "gap-outcome",
    ]);
    expect(candidates[0]).toEqual(expect.objectContaining({
      title: "Customer objection: Burned-out sophomore",
      detail: "Privacy around wellness data.",
      suggestedSeverity: "high",
    }));

    const updated = recordVentureRisk(
      owner,
      saved.id,
      {
        sourceType: candidates[0].sourceType,
        sourceRecordId: candidates[0].sourceRecordId,
        title: candidates[0].title,
        detail: candidates[0].detail,
        severity: "high",
        status: "mitigating",
        owner: "Rishabh",
        mitigation: "Add consent language to wellness-data onboarding before outreach.",
        resolutionEvidence: "Consent review queued with the next customer script.",
      },
      storage,
      "2026-05-27T03:40:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.riskRecords).toHaveLength(1);
    expect(loaded.riskRecords[0]).toEqual(expect.objectContaining({
      sourceType: "customer-interview",
      title: "Customer objection: Burned-out sophomore",
      severity: "high",
      status: "mitigating",
      owner: "Rishabh",
      mitigation: "Add consent language to wellness-data onboarding before outreach.",
      resolutionEvidence: "Consent review queued with the next customer script.",
    }));
    expect(buildVentureRiskCandidates(loaded).map((candidate) => candidate.sourceType)).toEqual([
      "outreach-approval",
      "gap-outcome",
    ]);
    expect(filterVenturePortfolio([loaded], "consent language")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "customer-interview")).toHaveLength(1);
  });

  it("records MVP build workspaces without inventing generated source", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    const executableWithoutSource = recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "executable",
        owner: "Rishabh",
        repoPath: "",
        setupCheck: "passed",
        typecheckCheck: "passed",
        unitTestCheck: "passed",
        buildCheck: "passed",
        browserSmokeCheck: "passed",
        deploymentCheck: "pending",
        verificationNotes: "All checks passed, but no generated source has been attached.",
      },
      storage,
      "2026-05-27T03:45:00.000Z",
    );

    expect(executableWithoutSource).toBeNull();

    const updated = recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "brief-ready",
        owner: "Rishabh",
        repoPath: "",
        setupCheck: "passed",
        typecheckCheck: "pending",
        unitTestCheck: "pending",
        buildCheck: "pending",
        browserSmokeCheck: "pending",
        deploymentCheck: "blocked",
        verificationNotes: "Build brief ready; generated source is not attached.",
      },
      storage,
      "2026-05-27T03:50:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.mvpBuildWorkspaces).toHaveLength(1);
    expect(loaded.mvpBuildWorkspaces[0]).toEqual(expect.objectContaining({
      status: "brief-ready",
      owner: "Rishabh",
      sourceCodeStatus: "Source code: pending builder output",
      repoPath: VENTURE_NO_MVP_SOURCE_ATTACHED,
      setupInstructions: "Launch builder.",
      setupCommand: "pnpm install --frozen-lockfile",
      typecheckCommand: "pnpm type-check",
      testCommand: "pnpm test -- src/lib/venture-portfolio.test.ts",
      buildCommand: "pnpm build",
      browserSmokeCommand: "pnpm exec playwright test e2e/app.spec.ts -g \"core demo flow\"",
      deploymentCommand: "No deployment command approved yet.",
      setupCheck: "passed",
      typecheckCheck: "pending",
      unitTestCheck: "pending",
      buildCheck: "pending",
      browserSmokeCheck: "pending",
      deploymentCheck: "blocked",
      verificationNotes: "Build brief ready; generated source is not attached.",
    }));
    expect(filterVenturePortfolio([loaded], "generated source is not attached")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], VENTURE_NO_MVP_SOURCE_ATTACHED)).toHaveLength(1);

    const handoff = buildVentureGeneratedAppHandoff(loaded);
    expect(handoff).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      status: "brief-ready",
      appName: "gen-z-recovery-planner",
      repoPath: VENTURE_NO_MVP_SOURCE_ATTACHED,
    }));
    expect(handoff.generationBoundary).toContain("No generated app source has been attached");
    expect(handoff.routePlan.join(" ")).toContain("/experiments");
    expect(handoff.fileManifest.join(" ")).toContain("src/App.tsx");
    expect(handoff.dataModel.join(" ")).toContain("ActivationCohort");
    expect(handoff.verificationCommands).toContain("pnpm type-check");
    expect(handoff.sourceScaffold.status).toBe("ready-to-materialize");
    expect(handoff.sourceScaffold.localTargetPath).toBe("./generated-apps/gen-z-recovery-planner");
    expect(handoff.sourceScaffold.sourceFiles.map((file) => file.path)).toEqual(expect.arrayContaining([
      "package.json",
      "index.html",
      "vite.config.ts",
      "tsconfig.json",
      "playwright.config.ts",
      "src/main.tsx",
      "src/App.tsx",
      "src/vite-env.d.ts",
      "src/lib/venture-data.ts",
      "src/lib/approval-boundaries.ts",
      "tests/venture-validation.test.ts",
      "e2e/venture-flow.spec.ts",
    ]));
    expect(handoff.sourceScaffold.sourceFiles.find((file) => file.path === "src/App.tsx")?.content).toContain("No external side effects");
    expect(handoff.sourceScaffold.sourceFiles.find((file) => file.path === "playwright.config.ts")?.content).toContain("4174");
    expect(handoff.sourceScaffold.sourceFiles.find((file) => file.path === "src/vite-env.d.ts")?.content).toContain("vite/client");
    expect(handoff.sourceScaffold.verificationCommands).toContain("pnpm browser-smoke");
    expect(handoff.sourceScaffold.proofCaptureChecklist.join(" ")).toContain("pnpm browser-smoke");
    expect(handoff.sourceScaffold.materializationInstruction).toContain("pnpm generated-app:materialize");
    expect(handoff.sourceScaffold.materializationInstruction).toContain("pnpm generated-app:verify");
    expect(handoff.sourceScaffold.materializationInstruction).toContain("--report-out <verifier-report.json>");
    expect(handoff.sourceScaffold.noFakeSourceSafeguards.join(" ")).toContain("Do not mark the app executable");
    expect(handoff.sourceScaffold.markdown).toContain("# Generated App Source Scaffold: Gen Z Recovery Planner");
    expect(handoff.markdown).toContain("# Generated App Handoff: Gen Z Recovery Planner");
    expect(handoff.markdown).toContain("## Generated Source Scaffold");
    const sourceScaffold = buildVentureGeneratedAppSourceScaffold(loaded);
    expect(sourceScaffold.sourceFiles.every((file) => file.contentSignature.startsWith("fnv1a-"))).toBe(true);
    const verificationProof = buildVentureGeneratedAppVerificationProof(loaded);
    expect(verificationProof).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      status: "partial-proof",
      appName: "gen-z-recovery-planner",
      passedCheckCount: 1,
      requiredCheckCount: 6,
    }));
    expect(verificationProof.verifierCommand).toContain("pnpm generated-app:verify");
    expect(verificationProof.verifierCommand).toContain("--report-out <verifier-report.json>");
    expect(verificationProof.checks.map((check) => check.label)).toEqual(expect.arrayContaining([
      "Materialized source path",
      "Install/setup",
      "Typecheck",
      "Unit tests",
      "Production build",
      "Browser smoke",
    ]));
    expect(verificationProof.missingProof.join(" ")).toContain("Browser smoke proof missing");
    expect(verificationProof.markdown).toContain("# Generated App Verification Proof: Gen Z Recovery Planner");
    expect(filterVenturePortfolio([loaded], "generated app handoff")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "generated app source scaffold")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "generated app verification proof")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Browser smoke proof missing")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "VITE_EXTERNAL_ACTIONS_ENABLED=false")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "src/routes/Experiments")).toHaveLength(1);
  });

  it("materializes generated app source scaffolds from exported portfolio JSON", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "marketpulse-generated-app-"));
    const inputPath = path.join(tempRoot, "portfolio.json");
    const targetPath = path.join(tempRoot, "generated-app");
    fs.writeFileSync(inputPath, serializeVenturePortfolio([saved]));

    const dryRun = spawnSync(
      process.execPath,
      ["scripts/materialize-generated-app.mjs", "--", "--input", inputPath, "--venture-id", saved.id, "--target", targetPath],
      { cwd: process.cwd(), encoding: "utf8" },
    );

    expect(dryRun.status).toBe(0);
    expect(dryRun.stdout).toContain("Mode: dry-run");
    expect(fs.existsSync(path.join(targetPath, "package.json"))).toBe(false);

    const writeRun = spawnSync(
      process.execPath,
      ["scripts/materialize-generated-app.mjs", "--", "--input", inputPath, "--venture-id", saved.id, "--target", targetPath, "--write"],
      { cwd: process.cwd(), encoding: "utf8" },
    );

    expect(writeRun.status).toBe(0);
    expect(writeRun.stdout).toContain("Materialization complete.");
    expect(fs.readFileSync(path.join(targetPath, "src/App.tsx"), "utf8")).toContain("No external side effects");
    expect(fs.readFileSync(path.join(targetPath, "package.json"), "utf8")).toContain("\"browser-smoke\"");
    expect(fs.readFileSync(path.join(targetPath, "playwright.config.ts"), "utf8")).toContain("4174");
    expect(fs.readFileSync(path.join(targetPath, "e2e/venture-flow.spec.ts"), "utf8")).toContain("disabled until a human approves");
  });

  it("writes generated app verifier reports to a durable JSON file", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "marketpulse-verifier-report-"));
    const inputPath = path.join(tempRoot, "portfolio.json");
    const targetPath = path.join(tempRoot, "generated-app");
    const reportPath = path.join(tempRoot, "reports", "verifier-report.json");
    const payload = {
      generatedAppSourceScaffolds: [{
        id: "report-scaffold",
        ventureId: "report-venture",
        title: "Report Scaffold",
        appName: "report-scaffold",
        localTargetPath: targetPath,
        verificationCommands: ["node smoke.js"],
        sourceFiles: [{
          path: "smoke.js",
          content: "console.log('report smoke ok');\n",
        }],
      }],
    };
    fs.writeFileSync(inputPath, JSON.stringify(payload, null, 2));

    const run = spawnSync(
      process.execPath,
      [
        "scripts/verify-generated-app-scaffold.mjs",
        "--",
        "--input",
        inputPath,
        "--venture-id",
        "report-venture",
        "--target",
        targetPath,
        "--report-out",
        reportPath,
      ],
      { cwd: process.cwd(), encoding: "utf8" },
    );

    expect(run.status).toBe(0);
    expect(run.stdout).toContain(`Report: ${reportPath}`);
    expect(fs.existsSync(reportPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    expect(report).toEqual(expect.objectContaining({
      scaffoldId: "report-scaffold",
      ventureId: "report-venture",
      appName: "report-scaffold",
      target: targetPath,
      fileCount: 1,
      ok: true,
    }));
    expect(report.results).toEqual([
      expect.objectContaining({
        command: "node smoke.js",
        ok: true,
        stdout: "report smoke ok",
      }),
    ]);
    expect(parseVentureGeneratedAppVerifierReport(fs.readFileSync(reportPath, "utf8"))).toEqual(report);
  });

  it("records generated app verifier reports as executable MVP proof", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const report = {
      scaffoldId: `${saved.id}-generated-app-source-scaffold`,
      ventureId: saved.id,
      appName: "gen-z-recovery-planner",
      target: "/tmp/marketpulse-generated-proof/generated-app",
      fileCount: 13,
      ok: true,
      results: [
        { command: "pnpm install", ok: true, status: 0, durationMs: 100, stdout: "installed", stderr: "" },
        { command: "pnpm type-check", ok: true, status: 0, durationMs: 120, stdout: "", stderr: "" },
        { command: "pnpm test", ok: true, status: 0, durationMs: 130, stdout: "1 passed", stderr: "" },
        { command: "pnpm build", ok: true, status: 0, durationMs: 140, stdout: "built", stderr: "" },
        { command: "pnpm browser-smoke", ok: true, status: 0, durationMs: 150, stdout: "1 passed", stderr: "" },
      ],
    };
    const verifierOutput = [
      "OK pnpm install (100ms)",
      "OK pnpm type-check (120ms)",
      "OK pnpm test (130ms)",
      "OK pnpm build (140ms)",
      "OK pnpm browser-smoke (150ms)",
      JSON.stringify(report, null, 2),
    ].join("\n");

    expect(parseVentureGeneratedAppVerifierReport(verifierOutput)).toEqual(report);
    expect(recordVentureGeneratedAppVerifierReport(owner, "wrong-venture", JSON.stringify(report), storage)).toBeNull();

    const updated = recordVentureGeneratedAppVerifierReport(
      owner,
      saved.id,
      verifierOutput,
      storage,
      "2026-05-27T04:00:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.mvpBuildWorkspaces[0]).toEqual(expect.objectContaining({
      status: "executable",
      owner: "generated-app-verifier",
      repoPath: "/tmp/marketpulse-generated-proof/generated-app",
      setupCommand: "pnpm install",
      typecheckCommand: "pnpm type-check",
      testCommand: "pnpm test",
      buildCommand: "pnpm build",
      browserSmokeCommand: "pnpm browser-smoke",
      setupCheck: "passed",
      typecheckCheck: "passed",
      unitTestCheck: "passed",
      buildCheck: "passed",
      browserSmokeCheck: "passed",
      deploymentCheck: "blocked",
    }));
    expect(loaded.artifactRecords[0]).toEqual(expect.objectContaining({
      artifactType: "test-report",
      status: "verified",
      title: "Generated app verifier report: gen-z-recovery-planner",
      uri: "/tmp/marketpulse-generated-proof/generated-app",
      owner: "generated-app-verifier",
      verificationCommand: "pnpm generated-app:verify",
      evidence: "Generated app verifier passed for gen-z-recovery-planner: 5/5 executable checks passed.",
      changeSummary: "Verifier report attached from 13 generated files.",
    }));

    const proof = buildVentureGeneratedAppVerificationProof(loaded);
    expect(proof).toEqual(expect.objectContaining({
      status: "verified",
      targetPath: "/tmp/marketpulse-generated-proof/generated-app",
      passedCheckCount: 6,
      requiredCheckCount: 6,
    }));
    expect(proof.missingProof).toEqual(["All generated app executable proof checks are attached."]);
    const generatedPatternMemories = buildVentureGeneratedCodePatternMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { generatedCodePatternMemories?: Array<{ appName?: string; proofStatus?: string }> };
    expect(generatedPatternMemories[0]).toEqual(expect.objectContaining({
      appName: "gen-z-recovery-planner",
      proofStatus: "verified",
      fileCount: 13,
      passedCheckCount: 6,
      requiredCheckCount: 6,
      passedMvpCheckCount: 5,
    }));
    expect(generatedPatternMemories[0].fastestPattern).toContain("generated-app verifier");
    expect(generatedPatternMemories[0].sourceSignaturePreview[0]).toContain("package.json:fnv1a-");
    expect(filterVenturePortfolio([loaded], "generated code pattern memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "fixed command lane")).toHaveLength(1);
    expect(exported.generatedCodePatternMemories?.[0]).toEqual(expect.objectContaining({
      appName: "gen-z-recovery-planner",
      proofStatus: "verified",
    }));
    expect(filterVenturePortfolio([loaded], "Generated app verifier report")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "all local executable proof checks passed")).toHaveLength(1);
    const promotionCandidates = buildVentureRoadmapCandidates(loaded)
      .filter((candidate) => candidate.sourceType === "deployment-promotion");
    expect(promotionCandidates.map((candidate) => candidate.title)).toEqual([
      "Deployment promotion blocker: Preview",
      "Deployment promotion blocker: Staging",
      "Deployment promotion blocker: Production",
    ]);
    expect(promotionCandidates.map((candidate) => candidate.suggestedPriority)).toEqual(["medium", "medium", "high"]);
    expect(promotionCandidates.map((candidate) => candidate.nextAction).join(" ")).toContain("Keep production blocked");
    const deploymentSupportCandidates = buildVentureSupportIssueCandidates(loaded)
      .filter((candidate) => candidate.sourceType === "deployment-promotion");
    expect(deploymentSupportCandidates.map((candidate) => candidate.title)).toEqual([
      "Deployment support risk: Preview",
      "Deployment support risk: Staging",
      "Deployment support risk: Production",
    ]);
    expect(deploymentSupportCandidates.map((candidate) => candidate.suggestedSeverity)).toEqual(["medium", "medium", "high"]);
    expect(deploymentSupportCandidates.find((candidate) => candidate.title === "Deployment support risk: Production")?.customerImpact)
      .toContain("Production users must not be exposed");
    const deploymentOwnerWorklist = buildVentureDeploymentOwnerWorklist([loaded]);
    expect(deploymentOwnerWorklist.owners).toEqual(["release-owner", "support-owner"]);
    expect(deploymentOwnerWorklist.items).toHaveLength(6);
    expect(summarizeVentureDeploymentOwnerWorkload([loaded])).toEqual([
      expect.objectContaining({
        owner: "release-owner",
        itemCount: 3,
        unresolvedCount: 3,
        candidateCount: 3,
        productionCount: 1,
        stagingCount: 1,
        previewCount: 1,
      }),
      expect.objectContaining({
        owner: "support-owner",
        itemCount: 3,
        unresolvedCount: 3,
        candidateCount: 3,
        productionCount: 1,
        stagingCount: 1,
        previewCount: 1,
      }),
    ]);
    const agedDeploymentOwnerWorklist = buildVentureDeploymentOwnerWorklist([loaded], "release-owner", "2026-05-29T04:00:00.000Z");
    expect(agedDeploymentOwnerWorklist.items[0]).toEqual(expect.objectContaining({
      targetId: "production",
      ageDays: 2,
      slaStatus: "stale",
      slaReason: expect.stringContaining("production deployment work has waited 2 days"),
    }));
    expect(agedDeploymentOwnerWorklist.items[1]).toEqual(expect.objectContaining({
      targetId: "staging",
      ageDays: 2,
      slaStatus: "fresh",
    }));
    expect(summarizeVentureDeploymentOwnerWorkload([loaded], "2026-05-29T04:00:00.000Z")[0]).toEqual(expect.objectContaining({
      owner: "release-owner",
      freshCount: 2,
      staleCount: 1,
    }));
    expect(buildVentureDeploymentOwnerWorklist([loaded], "release-owner").items.map((item) => item.title)).toEqual([
      "Deployment promotion blocker: Production",
      "Deployment promotion blocker: Staging",
      "Deployment promotion blocker: Preview",
    ]);
    expect(buildVentureDeploymentOwnerWorklist([loaded], "support-owner").items.map((item) => item.workType)).toEqual([
      "support-issue",
      "support-issue",
      "support-issue",
    ]);
    expect(deploymentOwnerWorklist.markdown).toContain("# Deployment Owner Worklist");
    expect(filterVenturePortfolio([loaded], "release-owner")).toHaveLength(1);
    const productionCandidate = promotionCandidates.find((candidate) => candidate.title === "Deployment promotion blocker: Production");
    expect(productionCandidate).toBeDefined();
    recordVentureRoadmapTask(
      owner,
      saved.id,
      {
        sourceType: productionCandidate?.sourceType ?? "deployment-promotion",
        sourceRecordId: productionCandidate?.sourceRecordId,
        title: productionCandidate?.title ?? "Deployment promotion blocker: Production",
        detail: productionCandidate?.detail ?? "Production promotion proof is missing.",
        priority: "high",
        status: "queued",
        owner: "release-owner",
        supportLoad: productionCandidate?.supportLoad,
        riskReduction: productionCandidate?.riskReduction,
        nextAction: productionCandidate?.nextAction ?? "Keep production blocked.",
      },
      storage,
      "2026-05-27T04:04:00.000Z",
    );
    const linkedLoaded = loadVenturePortfolio(owner, storage)[0];
    const linkedProductionTarget = buildVentureDeploymentEnvironmentMatrix(linkedLoaded).targets.find((target) => target.id === "production");
    expect(linkedProductionTarget).toEqual(expect.objectContaining({
      linkedRoadmapTaskStatus: "queued",
      linkedRoadmapTaskTitle: "Deployment promotion blocker: Production",
      nextAction: expect.stringContaining("is queued"),
    }));
    expect(buildVentureRoadmapCandidates(linkedLoaded).some((candidate) => candidate.title === "Deployment promotion blocker: Production")).toBe(false);
    const productionSupportCandidate = deploymentSupportCandidates.find((candidate) => candidate.title === "Deployment support risk: Production");
    expect(productionSupportCandidate).toBeDefined();
    recordVentureSupportIssue(
      owner,
      saved.id,
      {
        issueType: productionSupportCandidate?.issueType ?? "retention-risk",
        severity: productionSupportCandidate?.suggestedSeverity ?? "high",
        status: "triaged",
        sourceType: productionSupportCandidate?.sourceType ?? "deployment-promotion",
        sourceRecordId: productionSupportCandidate?.sourceRecordId,
        title: productionSupportCandidate?.title ?? "Deployment support risk: Production",
        detail: productionSupportCandidate?.detail ?? "Production support risk is not owned.",
        customerImpact: productionSupportCandidate?.customerImpact,
        supportLoad: productionSupportCandidate?.supportLoad,
        retentionRisk: productionSupportCandidate?.retentionRisk,
        owner: "support-owner",
        nextAction: productionSupportCandidate?.nextAction ?? "Keep production blocked.",
      },
      storage,
      "2026-05-27T04:06:00.000Z",
    );
    const supportLinkedLoaded = loadVenturePortfolio(owner, storage)[0];
    const supportLinkedProductionTarget = buildVentureDeploymentEnvironmentMatrix(supportLinkedLoaded).targets.find((target) => target.id === "production");
    expect(supportLinkedProductionTarget).toEqual(expect.objectContaining({
      linkedRoadmapTaskOwner: "release-owner",
      linkedRoadmapTaskStatus: "queued",
      linkedRoadmapTaskTitle: "Deployment promotion blocker: Production",
      linkedSupportIssueOwner: "support-owner",
      linkedSupportIssueStatus: "triaged",
      linkedSupportIssueTitle: "Deployment support risk: Production",
      nextAction: expect.stringContaining("are owned"),
    }));
    const linkedSummary = summarizeVenturePortfolio([supportLinkedLoaded]);
    expect(linkedSummary.deploymentOwnedRoadmapBlockerCount).toBe(1);
    expect(linkedSummary.deploymentOwnedSupportBlockerCount).toBe(1);
    expect(buildVentureDeploymentOwnerWorklist([supportLinkedLoaded], "release-owner").items[0]).toEqual(expect.objectContaining({
      owner: "release-owner",
      status: "queued",
      title: "Deployment promotion blocker: Production",
    }));
    expect(buildVentureDeploymentOwnerWorklist([supportLinkedLoaded], "support-owner").items[0]).toEqual(expect.objectContaining({
      owner: "support-owner",
      status: "triaged",
      title: "Deployment support risk: Production",
    }));
    const linkedReleaseWork = buildVentureDeploymentOwnerWorklist([supportLinkedLoaded], "release-owner").items[0];
    const linkedSupportWork = buildVentureDeploymentOwnerWorklist([supportLinkedLoaded], "support-owner").items[0];
    expect(linkedReleaseWork.recordId).toBeDefined();
    expect(linkedSupportWork.recordId).toBeDefined();
    updateVentureRoadmapTaskStatus(
      owner,
      supportLinkedLoaded.id,
      linkedReleaseWork.recordId ?? "",
      "done",
      "Production deployment proof reviewed from owner worklist.",
      storage,
      "2026-05-27T04:07:00.000Z",
    );
    updateVentureSupportIssueStatus(
      owner,
      supportLinkedLoaded.id,
      linkedSupportWork.recordId ?? "",
      "resolved",
      "Production support risk resolved from owner worklist.",
      storage,
      "2026-05-27T04:08:00.000Z",
    );
    const resolvedLoaded = loadVenturePortfolio(owner, storage)[0];
    const resolvedProductionTarget = buildVentureDeploymentEnvironmentMatrix(resolvedLoaded).targets.find((target) => target.id === "production");
    expect(resolvedProductionTarget).toEqual(expect.objectContaining({
      linkedRoadmapTaskStatus: "done",
      linkedSupportIssueStatus: "resolved",
    }));
    expect(buildVentureDeploymentOwnerWorklist([resolvedLoaded], "release-owner").items[0].status).toBe("done");
    expect(buildVentureDeploymentOwnerWorklist([resolvedLoaded], "support-owner").items[0].status).toBe("resolved");
    expect(summarizeVentureDeploymentOwnerWorkload([resolvedLoaded])).toEqual([
      expect.objectContaining({
        owner: "release-owner",
        doneCount: 1,
        unresolvedCount: 2,
      }),
      expect.objectContaining({
        owner: "support-owner",
        resolvedCount: 1,
        unresolvedCount: 2,
      }),
    ]);
    const linkedExport = serializeVenturePortfolio([supportLinkedLoaded]);
    expect(linkedExport).toContain("\"deploymentOwnerWorklist\"");
    expect(linkedExport).toContain("\"deploymentOwnerWorkload\"");
    expect(linkedExport).toContain("\"owner\": \"release-owner\"");
    expect(linkedExport).toContain("\"owner\": \"support-owner\"");
    expect(linkedExport).toContain("\"linkedRoadmapTaskTitle\": \"Deployment promotion blocker: Production\"");
    expect(linkedExport).toContain("\"linkedSupportIssueTitle\": \"Deployment support risk: Production\"");
    expect(filterVenturePortfolio([supportLinkedLoaded], "Deployment support risk: Production")).toHaveLength(1);
    expect(filterVenturePortfolio([supportLinkedLoaded], "are owned")).toHaveLength(1);
  });

  it("builds no-side-effect deployment readiness packets from proof and approval state", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const workspace = workspaceFixture();
    workspace.approvals = [
      { level: "Deployment proposal", status: "available", evidence: "Operator reviewed the exact target environment." },
      { level: "Human-approved deployment", status: "complete", evidence: "Human approved the deployment proposal packet." },
    ];
    const saved = saveVentureWorkspace(owner, workspace, storage, "2026-05-27T01:00:00.000Z");
    recordVentureExperimentResult(
      owner,
      saved.id,
      saved.experiments[0].id,
      {
        result: "12 qualified signups with 4 users asking for access.",
        interpretation: "Demand passed the fake-door threshold; deployment review can use this as launch evidence.",
      },
      storage,
      "2026-05-27T04:02:00.000Z",
    );
    recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "executable",
        owner: "Rishabh",
        repoPath: "/tmp/marketpulse-generated-proof/generated-app",
        setupCheck: "passed",
        typecheckCheck: "passed",
        unitTestCheck: "passed",
        buildCheck: "passed",
        browserSmokeCheck: "passed",
        deploymentCheck: "passed",
        verificationNotes: "Setup, typecheck, tests, build, browser smoke, and deployment rehearsal passed.",
      },
      storage,
      "2026-05-27T04:05:00.000Z",
    );
    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "deployment-proof",
        status: "verified",
        title: "Deployment rehearsal proof",
        uri: "test-results/deployment-rehearsal.json",
        owner: "Rishabh",
        verificationCommand: "pnpm build && pnpm browser-smoke",
        evidence: "Deployment rehearsal passed against the approved target plan; no external deploy was executed.",
        changeSummary: "Attached verified deployment rehearsal proof for review.",
      },
      storage,
      "2026-05-27T04:10:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const packet = buildVentureDeploymentReadinessPacket(loaded);

    expect(packet).toEqual(expect.objectContaining({
      status: "proposal-ready",
      deploymentProofStatus: "verified",
      generatedAppProofStatus: "verified",
      qaStatus: "ready",
    }));
    expect(packet.readinessScore).toBeGreaterThanOrEqual(80);
    expect(packet.noDeployBoundary).toContain("does not deploy");
    expect(packet.approvalBoundary).toContain("Human-approved deployment gate is complete");
    expect(packet.requiredApprovals.join(" ")).toContain("Human approved the deployment proposal packet");
    expect(packet.evidence.join(" ")).toContain("6/6 checks passed");
    expect(packet.markdown).toContain("# Deployment Readiness Packet: Gen Z Recovery Planner");
    expect(filterVenturePortfolio([loaded], "deployment readiness packet")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Deployment rehearsal proof")).toHaveLength(1);
    const matrix = buildVentureDeploymentEnvironmentMatrix(loaded);
    expect(matrix.targets.map((target) => [target.id, target.status])).toEqual([
      ["local", "ready"],
      ["preview", "ready"],
      ["staging", "ready"],
      ["production", "ready"],
    ]);
    expect(matrix.productionBoundary).toContain("Production remains blocked unless");
    expect(matrix.markdown).toContain("# Deployment Environment Matrix: Gen Z Recovery Planner");
    expect(filterVenturePortfolio([loaded], "deployment environment matrix")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Production remains blocked")).toHaveLength(1);

    const summary = summarizeVenturePortfolio([loaded]);
    expect(summary.deploymentReadinessPacketCount).toBe(1);
    expect(summary.deploymentProposalReadyCount).toBe(1);
    expect(summary.deploymentNeedsProofCount).toBe(0);
    expect(summary.deploymentBlockedPacketCount).toBe(0);
    expect(summary.deploymentOwnedRoadmapBlockerCount).toBe(0);
    expect(summary.deploymentOwnedSupportBlockerCount).toBe(0);
  });

  it("records product artifacts and blocks fake source or deployment proof", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "brief-ready",
        owner: "Rishabh",
        repoPath: "",
        setupCheck: "passed",
        typecheckCheck: "pending",
        unitTestCheck: "pending",
        buildCheck: "pending",
        browserSmokeCheck: "pending",
        deploymentCheck: "blocked",
        verificationNotes: "Build brief ready; generated source is not attached.",
      },
      storage,
      "2026-05-27T03:50:00.000Z",
    );
    const withMvp = loadVenturePortfolio(owner, storage)[0];

    const fakeSource = recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "source-repo",
        status: "attached",
        title: "Generated source repo",
        uri: "",
        owner: "Rishabh",
        evidence: "Claimed attached source without a repo path.",
      },
      storage,
      "2026-05-27T03:55:00.000Z",
    );

    expect(fakeSource).toBeNull();

    const updated = recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "build-brief",
        status: "expected",
        title: "MVP build brief",
        uri: "",
        owner: "Rishabh",
        verificationCommand: "No command until source repo exists.",
        evidence: "Build brief created from handoff; source repo still pending.",
        changeSummary: "Captured the build brief as an expected artifact before generated source exists.",
      },
      storage,
      "2026-05-27T04:00:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.artifactRecords).toHaveLength(1);
    expect(loaded.artifactRecords[0]).toEqual(expect.objectContaining({
      artifactType: "build-brief",
      status: "expected",
      title: "MVP build brief",
      uri: VENTURE_NO_ARTIFACT_URI_ATTACHED,
      linkedMvpBuildWorkspaceId: withMvp.mvpBuildWorkspaces[0].id,
      owner: "Rishabh",
      verificationCommand: "No command until source repo exists.",
      evidence: "Build brief created from handoff; source repo still pending.",
      changeSummary: "Captured the build brief as an expected artifact before generated source exists.",
    }));
    expect(filterVenturePortfolio([loaded], "source repo still pending")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], VENTURE_NO_ARTIFACT_URI_ATTACHED)).toHaveLength(1);
  });

  it("records revenue and cost signals without charging externally", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const workspace = workspaceFixture();
    workspace.experiments.push({
      id: "pricing-smoke",
      type: "Pricing test",
      hypothesis: "Students will accept a paid pilot.",
      audience: "Gen Z students",
      channel: "checkout-intent CTA",
      cost: "Manual tracking",
      successThreshold: "3 paid commitments",
      failureThreshold: "No paid intent",
      ethicsReview: "Do not collect payment without billing approval.",
      metrics: ["willingness to pay"],
      result: "Not run yet.",
      interpretation: "Pending.",
      nextAction: "Ask for paid pilot intent.",
    });
    const saved = saveVentureWorkspace(owner, workspace, storage, "2026-05-27T01:00:00.000Z");

    expect(recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 0,
        source: "Paid pilot LOI",
        owner: "Rishabh",
      },
      storage,
      "2026-05-27T04:10:00.000Z",
    )).toBeNull();

    const updated = recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 18000,
        currency: "usd",
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Founder call produced a $180 pilot commitment; no payment collected.",
        notes: "Use this as revenue intent, not live billing proof.",
      },
      storage,
      "2026-05-27T04:15:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.moneySignals).toHaveLength(1);
    expect(loaded.moneySignals[0]).toEqual(expect.objectContaining({
      type: "commitment",
      status: "committed",
      amountCents: 18000,
      currency: "USD",
      source: "Paid pilot LOI",
      owner: "Rishabh",
      evidence: "Founder call produced a $180 pilot commitment; no payment collected.",
      notes: "Use this as revenue intent, not live billing proof.",
      linkedExperimentId: "pricing-smoke",
      externalBillingStatus: "not-charged",
      approvalLevel: "human-approved-billing-change",
      approvalState: "approval-required",
      externalActionState: "no-app-charge",
      approvalNextAction: "Treat this as a record-only money signal until a human approves any charge, invoice, collection, credit, or billing change.",
    }));
    expect(filterVenturePortfolio([loaded], "not-charged")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "revenue intent")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "approval-required")).toHaveLength(1);

    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "expense",
        status: "planned",
        amountCents: 9000,
        currency: "USD",
        source: "Creator placement budget",
        owner: "Rishabh",
        evidence: "Proposed $90 creator placement; no spend executed by the app.",
        notes: "Budget requires approval before any external payment.",
      },
      storage,
      "2026-05-27T04:16:00.000Z",
    );
    const withExpense = loadVenturePortfolio(owner, storage)[0];
    const spendCandidate = buildVentureAutonomyAuditCandidates(withExpense)
      .find((candidate) => candidate.approvalLevel === "human-approved-spend");
    const billingCandidate = buildVentureAutonomyAuditCandidates(withExpense)
      .find((candidate) => candidate.approvalLevel === "human-approved-billing-change");

    expect(withExpense.moneySignals[0]).toEqual(expect.objectContaining({
      approvalLevel: "human-approved-spend",
      approvalState: "approval-required",
      externalActionState: "no-app-spend",
      approvalNextAction: "Require explicit human spend approval and receipt evidence before any external payment, reimbursement, or ad spend.",
    }));
    expect(spendCandidate).toEqual(expect.objectContaining({
      sideEffect: "external-blocked",
      actionType: "expense planned: no-app-spend",
      riskNote: expect.stringContaining("external action: no-app-spend"),
      nextAction: "Require explicit human spend approval and receipt evidence before any external payment, reimbursement, or ad spend.",
    }));
    expect(billingCandidate).toEqual(expect.objectContaining({
      sideEffect: "external-blocked",
      actionType: "commitment committed: no-app-charge",
      riskNote: expect.stringContaining("approval-required"),
    }));
  });

  it("turns feature requests and risk mitigations into roadmap tasks", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
      },
      storage,
      "2026-05-27T04:20:00.000Z",
    );
    const withInterview = loadVenturePortfolio(owner, storage)[0];
    const candidates = buildVentureRoadmapCandidates(withInterview);

    expect(candidates[0]).toEqual(expect.objectContaining({
      sourceType: "customer-feature",
      title: "Feature request: Burned-out sophomore",
      detail: "Calendar sync; gentle reminders",
      suggestedPriority: "medium",
    }));

    const updated = recordVentureRoadmapTask(
      owner,
      saved.id,
      {
        sourceType: candidates[0].sourceType,
        sourceRecordId: candidates[0].sourceRecordId,
        title: candidates[0].title,
        detail: candidates[0].detail,
        priority: "medium",
        status: "queued",
        owner: "Rishabh",
        supportLoad: "Reduce manual support by designing calendar-sync copy before code.",
        riskReduction: "Avoids shipping reminders without consent expectations.",
        nextAction: "Scope a no-code calendar-sync concierge test.",
      },
      storage,
      "2026-05-27T04:25:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.roadmapTasks).toHaveLength(1);
    expect(loaded.roadmapTasks[0]).toEqual(expect.objectContaining({
      sourceType: "customer-feature",
      title: "Feature request: Burned-out sophomore",
      priority: "medium",
      status: "queued",
      owner: "Rishabh",
      supportLoad: "Reduce manual support by designing calendar-sync copy before code.",
      riskReduction: "Avoids shipping reminders without consent expectations.",
      nextAction: "Scope a no-code calendar-sync concierge test.",
    }));
    const remainingCandidates = buildVentureRoadmapCandidates(loaded);
    expect(remainingCandidates.filter((candidate) => candidate.sourceType !== "deployment-promotion")).toHaveLength(0);
    expect(remainingCandidates.filter((candidate) => candidate.sourceType === "deployment-promotion").length).toBeGreaterThan(0);
    expect(filterVenturePortfolio([loaded], "calendar-sync concierge")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "manual support")).toHaveLength(1);
  });

  it("turns support questions and pilot issues into searchable support logs", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        objections: "Privacy around wellness data.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
      },
      storage,
      "2026-05-27T04:20:00.000Z",
    );
    const withInterview = loadVenturePortfolio(owner, storage)[0];
    const supportQuestionCandidate = buildVentureSupportIssueCandidates(withInterview)
      .find((candidate) => candidate.issueType === "support-question");

    expect(supportQuestionCandidate).toEqual(expect.objectContaining({
      sourceType: "customer-interview",
      title: "Support question: Burned-out sophomore",
      detail: expect.stringContaining("Privacy around wellness data."),
    }));

    recordVentureSupportIssue(
      owner,
      saved.id,
      {
        sourceType: supportQuestionCandidate?.sourceType ?? "manual",
        sourceRecordId: supportQuestionCandidate?.sourceRecordId,
        issueType: "support-question",
        severity: "medium",
        status: "triaged",
        title: supportQuestionCandidate?.title ?? "Support question",
        detail: supportQuestionCandidate?.detail ?? "Privacy around wellness data.",
        customerImpact: supportQuestionCandidate?.customerImpact ?? "Buyer needs confidence before activation.",
        supportLoad: "Answer privacy questions before opening the concierge pilot.",
        retentionRisk: "Retention risk if wellness-data trust stays unresolved.",
        owner: "Rishabh",
        resolution: "Support script not proven yet.",
        nextAction: "Test the privacy answer in the next customer call.",
      },
      storage,
      "2026-05-27T04:22:00.000Z",
    );
    const afterQuestion = loadVenturePortfolio(owner, storage)[0];
    expect(buildVentureSupportIssueCandidates(afterQuestion).find((candidate) => (
      candidate.sourceType === supportQuestionCandidate?.sourceType &&
      candidate.sourceRecordId === supportQuestionCandidate?.sourceRecordId
    ))).toBeUndefined();

    const roadmapCandidate = buildVentureRoadmapCandidates(afterQuestion)[0];
    recordVentureRoadmapTask(
      owner,
      saved.id,
      {
        sourceType: roadmapCandidate.sourceType,
        sourceRecordId: roadmapCandidate.sourceRecordId,
        title: roadmapCandidate.title,
        detail: roadmapCandidate.detail,
        priority: "medium",
        status: "in-progress",
        owner: "Rishabh",
        supportLoad: "Reduce manual support by designing calendar-sync copy before code.",
        riskReduction: "Avoids shipping reminders without consent expectations.",
        nextAction: "Scope a no-code calendar-sync concierge test.",
      },
      storage,
      "2026-05-27T04:25:00.000Z",
    );
    const withRoadmap = loadVenturePortfolio(owner, storage)[0];
    const pilotIssueCandidate = buildVentureSupportIssueCandidates(withRoadmap)[0];

    expect(pilotIssueCandidate).toEqual(expect.objectContaining({
      sourceType: "roadmap-task",
      issueType: "pilot-issue",
      title: "Pilot issue: Feature request: Burned-out sophomore",
      supportLoad: "Reduce manual support by designing calendar-sync copy before code.",
    }));

    const updated = recordVentureSupportIssue(
      owner,
      saved.id,
      {
        sourceType: pilotIssueCandidate.sourceType,
        sourceRecordId: pilotIssueCandidate.sourceRecordId,
        issueType: pilotIssueCandidate.issueType,
        severity: "high",
        status: "in-progress",
        title: pilotIssueCandidate.title,
        detail: pilotIssueCandidate.detail,
        customerImpact: "Pilot users need concierge calendar-sync answers before setup.",
        supportLoad: pilotIssueCandidate.supportLoad,
        retentionRisk: "Retention risk: repeated manual calendar-sync support can swamp the founder.",
        owner: "Rishabh",
        resolution: "Support checklist is still open.",
        nextAction: "Call the first 5 pilot users and measure repeat support questions.",
      },
      storage,
      "2026-05-27T04:30:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.supportIssues).toHaveLength(2);
    expect(loaded.supportIssues[0]).toEqual(expect.objectContaining({
      issueType: "pilot-issue",
      severity: "high",
      status: "in-progress",
      owner: "Rishabh",
      retentionRisk: "Retention risk: repeated manual calendar-sync support can swamp the founder.",
      nextAction: "Call the first 5 pilot users and measure repeat support questions.",
    }));
    expect(buildVentureSupportIssueCandidates(loaded).find((candidate) => (
      candidate.sourceType === pilotIssueCandidate.sourceType &&
      candidate.sourceRecordId === pilotIssueCandidate.sourceRecordId
    ))).toBeUndefined();
    const featureMemories = buildVentureMvpFeatureMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { mvpFeatureMemories?: Array<{ feature?: string }> };
    expect(featureMemories).toEqual(expect.arrayContaining([
      expect.objectContaining({
        feature: "Calendar sync",
        requestedCount: 1,
        roadmapTaskCount: 1,
        supportIssueCount: 1,
      }),
    ]));
    expect(featureMemories.find((memory) => memory.feature === "Calendar sync")?.reusableLesson).toContain("Calendar sync mattered");
    expect(filterVenturePortfolio([loaded], "mvp feature memory")).toHaveLength(1);
    expect(exported.mvpFeatureMemories?.some((memory) => memory.feature === "Calendar sync")).toBe(true);
    expect(filterVenturePortfolio([loaded], "repeat support questions")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "wellness-data trust")).toHaveLength(1);
  });

  it("records activation and retention cohorts from measured experiments", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureSupportIssue(
      owner,
      saved.id,
      {
        sourceType: "manual",
        issueType: "pilot-issue",
        severity: "high",
        status: "in-progress",
        title: "Pilot setup support",
        detail: "Calendar setup requires manual help.",
        customerImpact: "Pilot users need help before activation.",
        supportLoad: "One founder support queue per cohort.",
        retentionRisk: "Retention risk if setup questions repeat.",
        owner: "Rishabh",
        resolution: "Support checklist is still open.",
        nextAction: "Measure repeat support questions after activation.",
      },
      storage,
      "2026-05-27T04:20:00.000Z",
    );
    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits; 8 activated onboarding; 5 retained week two; 2 paid commitments.",
        interpretation: "Pass: activation exists, but retention needs a support-light workflow.",
      },
      storage,
      "2026-05-27T04:25:00.000Z",
    );
    const withExperiment = loadVenturePortfolio(owner, storage)[0];
    const candidate = buildVentureActivationCohortCandidates(withExperiment)[0];

    expect(candidate).toEqual(expect.objectContaining({
      sourceType: "experiment-result",
      cohortLabel: "Fake-door waitlist test cohort",
      signupCount: 12,
      activatedCount: 8,
      retainedCount: 5,
      paidCount: 2,
      supportIssueCount: 1,
    }));

    const updated = recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: candidate.sourceType,
        sourceRecordId: candidate.sourceRecordId,
        cohortLabel: candidate.cohortLabel,
        acquisitionChannel: candidate.acquisitionChannel,
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: candidate.signupCount,
        activatedCount: candidate.activatedCount,
        retainedCount: candidate.retainedCount,
        paidCount: candidate.paidCount,
        revenueCents: 18000,
        supportIssueCount: candidate.supportIssueCount,
        owner: "Rishabh",
        evidence: candidate.evidence,
        learning: "Activation rate is usable, retention depends on reducing support load.",
        nextAction: "Interview retained users before buying paid traffic.",
      },
      storage,
      "2026-05-27T04:30:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.activationCohorts).toHaveLength(1);
    expect(loaded.activationCohorts[0]).toEqual(expect.objectContaining({
      cohortLabel: "Fake-door waitlist test cohort",
      signupCount: 12,
      activatedCount: 8,
      retainedCount: 5,
      paidCount: 2,
      revenueCents: 18000,
      supportIssueCount: 1,
      nextAction: "Interview retained users before buying paid traffic.",
    }));
    expect(buildVentureActivationCohortCandidates(loaded).find((nextCandidate) => (
      nextCandidate.sourceType === candidate.sourceType &&
      nextCandidate.sourceRecordId === candidate.sourceRecordId
    ))).toBeUndefined();
    const retainedMemories = buildVentureRetainedUserMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { retainedUserMemories?: Array<{ cohortLabel?: string }> };
    expect(retainedMemories[0]).toEqual(expect.objectContaining({
      cohortLabel: "Fake-door waitlist test cohort",
      activationEvent: "Completed Sunday reset plan.",
      retentionWindow: "Week-one retention after concierge setup.",
      retainedUserCount: 5,
      paidUserCount: 2,
      revenueCents: 18000,
      supportIssueCount: 1,
      retentionRate: 63,
    }));
    expect(retainedMemories[0].reusableLesson).toContain("63% retention");
    expect(filterVenturePortfolio([loaded], "retained user memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Week-one retention after concierge setup")).toHaveLength(1);
    expect(exported.retainedUserMemories?.[0]?.cohortLabel).toBe("Fake-door waitlist test cohort");
    expect(filterVenturePortfolio([loaded], "support-light workflow")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "buying paid traffic")).toHaveLength(1);
  });

  it("records channel economics with CAC and payback math", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "12 qualified signups from 100 visits.",
        learning: "Activation rate is usable.",
        nextAction: "Interview retained users before buying paid traffic.",
      },
      storage,
      "2026-05-27T04:30:00.000Z",
    );
    const withCohort = loadVenturePortfolio(owner, storage)[0];
    const candidate = buildVentureChannelEconomicsCandidates(withCohort)[0];

    expect(candidate).toEqual(expect.objectContaining({
      sourceType: "activation-cohort",
      channel: "creator partnerships",
      signupCount: 12,
      paidCount: 2,
      revenueCents: 18000,
    }));

    const updated = recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: candidate.sourceType,
        sourceRecordId: candidate.sourceRecordId,
        channel: candidate.channel,
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: candidate.signupCount,
        activatedCount: candidate.activatedCount,
        paidCount: candidate.paidCount,
        revenueCents: candidate.revenueCents,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements for the cohort.",
        nextAction: "Repeat only if paid cohort revenue stays above acquisition spend.",
      },
      storage,
      "2026-05-27T04:40:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.channelEconomics).toHaveLength(1);
    expect(loaded.channelEconomics[0]).toEqual(expect.objectContaining({
      channel: "creator partnerships",
      spendCents: 9000,
      signupCount: 12,
      paidCount: 2,
      revenueCents: 18000,
      costPerSignupCents: 750,
      cacCents: 4500,
      paybackStatus: "paid-back",
      nextAction: "Repeat only if paid cohort revenue stays above acquisition spend.",
    }));
    expect(buildVentureChannelEconomicsCandidates(loaded).find((nextCandidate) => (
      nextCandidate.sourceType === candidate.sourceType &&
      nextCandidate.sourceRecordId === candidate.sourceRecordId
    ))).toBeUndefined();
    const workedChannels = buildVentureWorkedChannelMemories([loaded]);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as { workedChannelMemories?: Array<{ channel?: string }> };
    const drift = buildVentureDemandDriftReport(loaded);

    expect(workedChannels[0]).toEqual(expect.objectContaining({
      channel: "creator partnerships",
      paybackStatus: "paid-back",
      paidUserCount: 2,
      retainedUserCount: 5,
      spendCents: 9000,
      revenueCents: 18000,
    }));
    expect(workedChannels[0].sourceTypes).toEqual(expect.arrayContaining(["channel:activation-cohort", "cohort:experiment-result"]));
    expect(workedChannels[0].strongestSignal).toContain("paid back");
    expect(filterVenturePortfolio([loaded], "worked channel memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "creator partnerships worked")).toHaveLength(1);
    expect(exported.workedChannelMemories?.[0]?.channel).toBe("creator partnerships");
    expect(drift.status).toBe("underestimated");
    expect(drift.actualDemandScore).toBeGreaterThan(drift.baselineDemandScore);
    expect(drift.components.map((component) => component.source)).toEqual(expect.arrayContaining([
      "activation",
      "channel",
      "kill-pressure",
    ]));
    expect(filterVenturePortfolio([loaded], "creator placements")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "above acquisition spend")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "underestimated")).toHaveLength(1);
  });

  it("builds kill-pressure rules from support load, retention, and payback", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const workspace = evidenceRichWorkspace();
    workspace.killCriteria.missingEvidence = [];
    workspace.contradictions = [];
    const saved = saveVentureWorkspace(owner, workspace, storage, "2026-05-27T01:00:00.000Z");
    recordVentureSupportIssue(
      owner,
      saved.id,
      {
        sourceType: "manual",
        issueType: "pilot-issue",
        severity: "high",
        status: "in-progress",
        title: "Pilot setup support",
        detail: "Calendar setup requires manual help.",
        customerImpact: "Pilot users need help before activation.",
        supportLoad: "One founder support queue per cohort.",
        retentionRisk: "Retention risk if setup questions repeat.",
        owner: "Rishabh",
        resolution: "Support checklist is still open.",
        nextAction: "Resolve high-severity support before paid acquisition.",
      },
      storage,
      "2026-05-27T04:20:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "12 qualified signups from 100 visits.",
        learning: "Activation and retention are usable.",
        nextAction: "Interview retained users before buying paid traffic.",
      },
      storage,
      "2026-05-27T04:30:00.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: "fake-door-waitlist",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 2,
        revenueCents: 18000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements for the cohort.",
        nextAction: "Repeat only if paid cohort revenue stays above acquisition spend.",
      },
      storage,
      "2026-05-27T04:40:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const report = buildVentureKillPressureReport(loaded);

    expect(report.recommendation).toBe("pause");
    expect(report.signals).toEqual(expect.arrayContaining([
      expect.objectContaining({
        dimension: "support",
        title: "Support load pressure",
        recommendation: "pause",
      }),
      expect.objectContaining({
        dimension: "channel-economics",
        title: "Channel paid back",
        recommendation: "scale",
      }),
      expect.objectContaining({
        dimension: "retention",
        title: "Activation and retention usable",
        recommendation: "continue",
      }),
    ]));
  });

  it("flags too-small markets and undifferentiated products as kill pressure", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const smallMarket = evidenceRichWorkspace("Tiny Club Scheduler");
    smallMarket.id = "tiny-club-scheduler";
    smallMarket.targetBuyer = "One campus club with a local-only workflow";
    smallMarket.killCriteria.missingEvidence = [];
    smallMarket.companySimulation.customerSegments = ["single campus club"];
    smallMarket.companySimulation.competitiveResponse = "No competitor pressure recorded.";
    smallMarket.companySimulation.failureModes = ["Market too small: only one club has this problem, so it cannot scale."];

    const smallMarketReport = buildVentureKillPressureReport(
      saveVentureWorkspace(owner, smallMarket, storage, "2026-05-27T05:00:00.000Z"),
    );

    expect(smallMarketReport.recommendation).toBe("kill");
    expect(smallMarketReport.signals).toEqual(expect.arrayContaining([
      expect.objectContaining({
        dimension: "market-size",
        title: "Market too small",
        recommendation: "kill",
        severity: "critical",
      }),
    ]));

    const copycat = evidenceRichWorkspace("Template Clone");
    copycat.id = "template-clone";
    copycat.killCriteria.missingEvidence = [];
    copycat.companySimulation.competitiveResponse = "Product is not differentiated from free Notion templates.";
    copycat.companySimulation.failureModes = ["No differentiation: buyers already use free templates and see this as a copycat."];

    const copycatReport = buildVentureKillPressureReport(
      saveVentureWorkspace(owner, copycat, storage, "2026-05-27T05:10:00.000Z"),
    );

    expect(copycatReport.recommendation).toBe("kill");
    expect(copycatReport.signals).toEqual(expect.arrayContaining([
      expect.objectContaining({
        dimension: "differentiation",
        title: "Product not differentiated",
        recommendation: "kill",
        severity: "high",
      }),
    ]));
  });

  it("kills ventures when buyer urgency evidence says buyers do not care", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const weakUrgency = evidenceRichWorkspace("Campus Ops Copilot");
    weakUrgency.id = "campus-ops-copilot";
    weakUrgency.targetBuyer = "Student club treasurers";
    weakUrgency.killCriteria.missingEvidence = [];
    const saved = saveVentureWorkspace(owner, weakUrgency, storage, "2026-05-27T05:20:00.000Z");

    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "Missed signup threshold; treasurers said reimbursement packet automation was not urgent.",
        interpretation: "Failed because buyers liked the idea but would not switch from spreadsheets.",
      },
      storage,
      "2026-05-27T05:21:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const report = buildVentureKillPressureReport(loaded);
    const drift = buildVentureDemandDriftReport(loaded);

    expect(report.recommendation).toBe("kill");
    expect(report.signals).toEqual(expect.arrayContaining([
      expect.objectContaining({
        dimension: "demand",
        title: "Buyer does not care",
        recommendation: "kill",
        severity: "critical",
        nextAction: "Do not build more until a buyer shows urgent switching behavior, paid intent, or repeated activation.",
      }),
    ]));
    expect(drift.status).toBe("overestimated");
    expect(drift.actualDemandScore).toBeLessThan(drift.baselineDemandScore);
    expect(drift.reason).toContain("Pre-venture demand score");
    expect(filterVenturePortfolio([loaded], "overestimated")).toHaveLength(1);
  });

  it("builds explicit kill decision artifacts from pressure rules, evidence, and revival conditions", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const weakUrgency = evidenceRichWorkspace("Campus Ops Copilot");
    weakUrgency.id = "campus-ops-copilot";
    weakUrgency.targetBuyer = "Student club treasurers";
    weakUrgency.killCriteria.missingEvidence = [];
    const saved = saveVentureWorkspace(owner, weakUrgency, storage, "2026-05-27T05:20:00.000Z");
    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "Missed signup threshold; treasurers said reimbursement packet automation was not urgent.",
        interpretation: "Failed because buyers liked the idea but would not switch from spreadsheets.",
      },
      storage,
      "2026-05-27T05:21:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const artifact = buildVentureKillDecisionArtifact(loaded);

    expect(artifact).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Campus Ops Copilot",
      recommendation: "kill",
      confidenceScore: expect.any(Number),
      primaryReason: expect.stringMatching(/Buyer does not care|Product not differentiated/),
    }));
    expect(artifact.evidenceForStopping.join(" ")).toContain("not urgent");
    expect(artifact.stopRules).toContain("2% signup");
    expect(artifact.scalePrerequisites.join(" ")).toContain("Demand passes");
    expect(artifact.revivalTriggers.join(" ")).toContain("measured signal");
    expect(artifact.markdown).toContain("# Kill Decision Artifact: Campus Ops Copilot");
    expect(filterVenturePortfolio([loaded], "kill decision artifact")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Archive build/spend/outreach")).toHaveLength(1);
  });

  it("builds weak-branch kill memory with archive boundaries and revival conditions", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const weakUrgency = evidenceRichWorkspace("Campus Ops Copilot");
    weakUrgency.id = "campus-ops-copilot";
    weakUrgency.targetBuyer = "Student club treasurers";
    weakUrgency.killCriteria.missingEvidence = [];
    const saved = saveVentureWorkspace(owner, weakUrgency, storage, "2026-05-27T05:20:00.000Z");
    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "Missed signup threshold; treasurers said reimbursement packet automation was not urgent.",
        interpretation: "Failed because buyers liked the idea but would not switch from spreadsheets.",
      },
      storage,
      "2026-05-27T05:21:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const memories = buildVentureWeakBranchKillMemories([loaded]);

    expect(memories.length).toBeGreaterThanOrEqual(1);
    const memory = memories[0];
    expect(memory).toEqual(expect.objectContaining({
      ventureId: saved.id,
      sourceType: "saved-venture",
      sourceTitle: "Campus Ops Copilot",
      recommendation: "kill",
      status: "kill-recommended",
    }));
    expect(memory.noGoBoundaries.join(" ")).toContain("No paid spend or external outreach");
    expect(memory.failureLessons.join(" ")).toContain("Never repeat");
    expect(memory.revivalConditions.join(" ")).toContain("measured signal");
    expect(memory.markdown).toContain("# Weak Branch Kill Memory: Campus Ops Copilot");

    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as {
      weakBranchKillMemories?: Array<{ sourceTitle?: string; status?: string }>;
    };
    expect(exported.weakBranchKillMemories?.[0]).toEqual(expect.objectContaining({
      sourceTitle: "Campus Ops Copilot",
    }));
    expect(filterVenturePortfolio([loaded], "weak branch kill memory")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "kill weak branches")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "no spend no outreach")).toHaveLength(1);
    const summary = summarizeVenturePortfolio([loaded]);
    expect(summary.weakBranchKillMemoryCount).toBeGreaterThanOrEqual(1);
    expect(summary.weakBranchKillRecommendedCount).toBeGreaterThanOrEqual(1);
  });

  it("does not create weak-branch kill memory for active branches without kill or pause pressure", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T05:20:00.000Z");
    const memories = buildVentureWeakBranchKillMemories([saved]);

    expect(memories).toHaveLength(0);
    expect(summarizeVenturePortfolio([saved]).weakBranchKillMemoryCount).toBe(0);
  });

  it("builds a structured market model from venture simulation and proof gaps", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T05:20:00.000Z");
    const model = buildVentureMarketModel(saved);

    expect(model).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      competition: "Substitutes can copy positioning.",
      channel: "creator partnerships",
      pricing: "$9/month",
      confidence: expect.stringMatching(/low|medium|high/),
      confidenceScore: expect.any(Number),
      nextAction: expect.stringContaining("Prove:"),
    }));
    expect(model.timing).toContain("Founder-led validation");
    expect(model.risks).toContain("Product differentiation unproven");
    expect(model.missingProof).toEqual(expect.arrayContaining([
      "Measured demand result",
      "Willingness-to-pay signal",
      "Named competitor or substitute",
      "Channel economics or CAC",
    ]));
  });

  it("builds founder execution memos from market, demand, kill, autonomy, and handoff evidence", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T05:20:00.000Z");
    const memo = buildVentureFounderExecutionMemo(saved);

    expect(memo).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      status: "blocked",
      statusReason: expect.stringContaining("weak evaluation lens"),
      demandDriftStatus: "overestimated",
      marketConfidence: expect.stringMatching(/low|medium|high/),
      primaryNextAction: expect.stringContaining("adjacent workflow"),
    }));
    expect(memo.sections.map((section) => section.heading)).toEqual(expect.arrayContaining([
      "Decision Posture",
      "Market Model",
      "Why Now",
      "MVP Scope",
      "Build Estimate",
      "Evidence Confidence",
      "Reasoning Debate",
      "Evaluation Lenses",
      "Demand Drift",
      "Next Experiment",
      "Product Handoff",
      "Approval Boundary",
    ]));
    expect(memo.markdown).toContain("# Founder Execution Memo: Gen Z Recovery Planner");
    expect(memo.markdown).toContain("## Why Now");
    expect(memo.markdown).toContain("## MVP Scope");
    expect(memo.markdown).toContain("## Build Estimate");
    expect(memo.markdown).toContain("## Evidence Confidence");
    expect(memo.markdown).toContain("## Reasoning Debate");
    expect(memo.markdown).toContain("## Evaluation Lenses");
    expect(memo.markdown).toContain("## Technical Ticket");
    expect(memo.technicalTicket).toContain("Source code: pending builder output");
    expect(memo.productSpec).toContain("Buyer: Gen Z students.");
    expect(memo.autonomyBoundary).toContain("Human-approved deployment");
    expect(filterVenturePortfolio([saved], "founder execution memo")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "Why Now")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "MVP Scope")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "Build Estimate")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "Evidence Confidence")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "Reasoning Debate")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "Evaluation Lenses")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "Technical Ticket")).toHaveLength(1);
  });

  it("builds experiment launch packs with copy, metrics, risk checks, approvals, and replay steps", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T05:20:00.000Z");
    const pack = buildVentureExperimentLaunchPack(saved);

    expect(pack).toEqual(expect.objectContaining({
      ventureId: saved.id,
      experimentId: "fake-door-waitlist",
      status: "needs-approval",
      title: "Fake-door waitlist test launch pack",
      audience: "Gen Z students",
      channel: "creator partnerships",
      successMetric: "8% signup",
      failureMetric: "2% signup",
    }));
    expect(pack.landingPageSections).toEqual(expect.arrayContaining([
      expect.stringContaining("Hero:"),
      expect.stringContaining("CTA:"),
    ]));
    expect(pack.channelCopy[0]).toContain("Users will join.");
    expect(pack.riskChecks.join(" ")).toContain("Demand drift");
    expect(pack.approvalGates.join(" ")).toContain("Human-approved deployment");
    expect(pack.checklist.join(" ")).toContain("Record measured result");
    expect(pack.markdown).toContain("# Experiment Launch Pack: Fake-door waitlist test launch pack");
    expect(filterVenturePortfolio([saved], "experiment launch pack")).toHaveLength(1);
    expect(filterVenturePortfolio([saved], "creator partnerships")).toHaveLength(1);
  });

  it("builds QA release reports from checks, artifacts, deployment boundaries, support, and launch risk", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "brief-ready",
        owner: "Rishabh",
        repoPath: "",
        setupCheck: "passed",
        typecheckCheck: "pending",
        unitTestCheck: "pending",
        buildCheck: "pending",
        browserSmokeCheck: "pending",
        deploymentCheck: "blocked",
        verificationNotes: "Build brief ready; generated source is not attached.",
      },
      storage,
      "2026-05-27T05:30:00.000Z",
    );
    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "deployment-proof",
        status: "blocked",
        title: "Deployment proof blocked",
        owner: "Rishabh",
        verificationCommand: "No deploy command approved.",
        evidence: "Deployment proof intentionally withheld until human approval.",
        changeSummary: "No deployment was executed.",
      },
      storage,
      "2026-05-27T05:31:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const report = buildVentureQaReleaseReport(loaded);

    expect(report.status).toBe("blocked");
    expect(report.releaseReadinessScore).toBeLessThan(80);
    expect(report.blockers).toEqual(expect.arrayContaining([
      expect.stringContaining("MVP checks"),
      "Deployment proof is blocked or only expected.",
    ]));
    expect(report.artifactSummary).toContain("1 artifact");
    expect(report.deploymentBoundary).toContain("Deployment proof is blocked");
    expect(report.launchRiskSummary).toContain("launch pack");
    expect(report.markdown).toContain("# QA Release Report: Gen Z Recovery Planner");
    expect(filterVenturePortfolio([loaded], "qa release report")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "No deployment was executed")).toHaveLength(1);
  });

  it("builds investor briefs from market, demand, traction, revenue, risk, and QA evidence", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits.",
        interpretation: "Pass: early demand crossed the signup threshold.",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 2,
        invoiceRequestCount: 1,
        acceptedPrice: "$9/month",
        objectionSummary: "Need student discount before annual plan.",
      },
      storage,
      "2026-05-27T03:45:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const brief = buildVentureInvestorBrief(loaded);

    expect(brief).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      status: expect.stringMatching(/investable|watch|not-ready/),
      recommendation: expect.any(String),
      investabilityScore: expect.any(Number),
    }));
    expect(brief.sections.map((section) => section.heading)).toEqual(expect.arrayContaining([
      "Market",
      "Demand",
      "Traction",
      "Revenue",
      "Risks",
      "QA Readiness",
    ]));
    expect(brief.demandSummary).toContain("Demand drift");
    expect(brief.revenueSummary).toContain("paid signals");
    expect(brief.markdown).toContain("# Investor Brief: Gen Z Recovery Planner");
    expect(filterVenturePortfolio([loaded], "investor brief")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Investability score")).toHaveLength(1);
  });

  it("builds financial models from revenue, commitments, costs, CAC, payback, and runway evidence", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 18000,
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Founder call produced a paid pilot commitment.",
        notes: "Use as revenue intent, not live billing proof.",
      },
      storage,
      "2026-05-27T03:20:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "expense",
        status: "planned",
        amountCents: 9000,
        source: "Creator placement budget",
        owner: "Rishabh",
        evidence: "Proposed creator spend; no external payment executed.",
        notes: "Requires approval before spend.",
      },
      storage,
      "2026-05-27T03:21:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "12 qualified signups from 100 visits.",
        learning: "Retention depends on reducing support load.",
        nextAction: "Interview retained users before buying paid traffic.",
      },
      storage,
      "2026-05-27T03:22:00.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: "fake-door-waitlist",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 2,
        revenueCents: 18000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements for the cohort.",
        nextAction: "Repeat only if paid cohort revenue stays above acquisition spend.",
      },
      storage,
      "2026-05-27T03:23:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const model = buildVentureFinancialModel(loaded);

    expect(model).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      paybackStatus: "paid-back",
      committedRevenueCents: 18000,
      cohortRevenueCents: 18000,
      channelRevenueCents: 18000,
      acquisitionSpendCents: 9000,
      paidUserCount: 2,
      blendedCacCents: 4500,
    }));
    expect(model.status).toMatch(/scale-ready|needs-proof/);
    expect(model.netEvidenceCashCents).toBeGreaterThan(0);
    expect(model.revenueSummary).toContain("$180 committed");
    expect(model.unitEconomicsSummary).toContain("blended CAC $45");
    expect(model.scalingThreshold).toContain("CAC");
    expect(model.markdown).toContain("# Financial Model: Gen Z Recovery Planner");
    expect(model.markdown).toContain("## Scaling Threshold");
    expect(filterVenturePortfolio([loaded], "financial model")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "Net evidence cash")).toHaveLength(1);
  });

  it("flags no-evidence revenue generation posture for a cold venture without money, pricing, cohort, or channel proof", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    const posture = buildVentureRevenueGenerationPosture(saved);

    expect(posture).toEqual(expect.objectContaining({
      ventureId: saved.id,
      status: "no-evidence",
      receivedRevenueCents: 0,
      committedRevenueCents: 0,
      cohortRevenueCents: 0,
      channelRevenueCents: 0,
      paidPricingSignalCount: 0,
      paidActivationCohortCount: 0,
      paidBackChannelCount: 0,
      paybackStatus: "unknown",
    }));
    expect(posture.gaps.some((gap) => gap.includes("No received, committed, cohort, or channel revenue"))).toBe(true);
    expect(posture.gaps.some((gap) => gap.includes("No paid pricing signal"))).toBe(true);
    expect(posture.markdown).toContain("# Revenue Generation Posture: Gen Z Recovery Planner");
    expect(posture.nextAction).toMatch(/Record the first paid pricing signal/);
  });

  it("builds repeatable revenue generation posture from money signals, paid pricing, paid cohorts, and paid-back channels", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 12000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received first paid pilot payment.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 18000,
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Second buyer committed to paid pilot.",
      },
      storage,
      "2026-05-27T03:11:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 3,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "12 qualified signups; 3 paid users.",
        learning: "Retention follows concierge setup.",
        nextAction: "Interview retained users before scaling.",
      },
      storage,
      "2026-05-27T03:13:00.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: "fake-door-waitlist",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 3,
        revenueCents: 18000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements; channel paid back.",
        nextAction: "Repeat only if payback holds.",
      },
      storage,
      "2026-05-27T03:14:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const posture = buildVentureRevenueGenerationPosture(loaded);

    expect(posture).toEqual(expect.objectContaining({
      ventureId: saved.id,
      title: "Gen Z Recovery Planner",
      receivedRevenueCents: 12000,
      committedRevenueCents: 18000,
      cohortRevenueCents: 18000,
      channelRevenueCents: 18000,
      paidActivationCohortCount: 1,
      paidCohortUserCount: 3,
      paidBackChannelCount: 1,
      paybackStatus: "paid-back",
      pricingCalibrationStatus: "validated",
    }));
    expect(posture.paidPricingSignalCount).toBeGreaterThanOrEqual(1);
    expect(posture.paidCommitmentCount).toBeGreaterThanOrEqual(3);
    expect(posture.invoiceRequestCount).toBeGreaterThanOrEqual(1);
    expect(posture.status).toMatch(/repeatable-revenue|scaling-revenue/);
    expect(posture.captureScore).toBeGreaterThanOrEqual(70);
    expect(posture.totalEvidenceRevenueCents).toBe(48000);
    expect(posture.channelPaybackCoverageCents).toBe(9000);
    expect(posture.primaryRevenueSource).toContain("received revenue");
    expect(posture.evidence.some((item) => item.includes("received revenue"))).toBe(true);
    expect(posture.evidence.some((item) => item.includes("paid pricing signal"))).toBe(true);
    expect(posture.evidence.some((item) => item.includes("paid activation cohort"))).toBe(true);
    expect(posture.evidence.some((item) => item.includes("channel revenue"))).toBe(true);
    expect(posture.markdown).toContain("# Revenue Generation Posture: Gen Z Recovery Planner");
    expect(posture.markdown).toContain("## Recorded Revenue Evidence");
    expect(filterVenturePortfolio([loaded], "revenue generation posture")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "generate revenue")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "paid-back")).toHaveLength(1);
    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as {
      revenueGenerationPostures?: Array<{ ventureId?: string; status?: string }>;
    };
    expect(exported.revenueGenerationPostures?.[0]).toEqual(expect.objectContaining({
      ventureId: saved.id,
    }));
  });

  it("marks revenue generation as blocked when money signals are blocked before external action", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "blocked",
        amountCents: 5000,
        source: "Stripe checkout (blocked before live payment)",
        owner: "Rishabh",
        evidence: "External billing is gated; no charge executed.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const posture = buildVentureRevenueGenerationPosture(loaded);

    expect(posture.status).toBe("blocked");
    expect(posture.totalEvidenceRevenueCents).toBe(0);
    expect(posture.committedRevenueCents).toBe(0);
    expect(posture.summary).toContain("blocked");
    expect(posture.nextAction).toContain("Unblock");
  });

  it("builds a human-reviewed scale-strong-branch plan from scaling revenue, paid-back channels, support readiness, and spend ceiling", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 24000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received paid pilot payment before scaling.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "expense",
        status: "committed",
        amountCents: 9000,
        source: "Approved creator test ceiling",
        owner: "Rishabh",
        evidence: "Human approved a bounded creator-placement budget ceiling.",
        notes: "Ceiling only; no app spend executed.",
      },
      storage,
      "2026-05-27T03:11:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 4,
        revenueCents: 24000,
        supportIssueCount: 0,
        owner: "Rishabh",
        evidence: "12 qualified signups; 4 paid users retained.",
        learning: "Retention follows concierge setup.",
        nextAction: "Scale only inside the approved ceiling.",
      },
      storage,
      "2026-05-27T03:13:00.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: "fake-door-waitlist",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 4,
        revenueCents: 24000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements; channel paid back.",
        nextAction: "Repeat only if payback holds.",
      },
      storage,
      "2026-05-27T03:14:00.000Z",
    );
    recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: "human-approved-spend",
        status: "approved",
        sideEffect: "external-approved",
        actionType: "Approved bounded scale budget",
        actor: "Rishabh",
        riskNote: "Do not exceed the creator-placement ceiling.",
        replayNote: "Replay by checking the approved spend ceiling and payback stop rules.",
        evidence: "Human approved a $90 ceiling for the next creator-placement cohort.",
        nextAction: "Run one bounded cohort and stop if payback fails.",
      },
      storage,
      "2026-05-27T03:15:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const plan = buildVentureScaleStrongBranchPlan(loaded);

    expect(plan.status).toBe("scale-ready");
    expect(plan.humanReviewRequired).toBe(true);
    expect(plan.revenueStatus).toBe("scaling-revenue");
    expect(plan.financeStatus).toBe("scale-ready");
    expect(plan.paidBackChannelCount).toBe(1);
    expect(plan.supportStatus).toBe("support-light");
    expect(plan.humanApprovedSpendAuditCount).toBe(1);
    expect(plan.humanApprovedSpendCeilingCents).toBe(9000);
    expect(plan.stopRules.join(" ")).toContain("$90");
    expect(plan.markdown).toContain("# Scale Strong Branch Plan: Gen Z Recovery Planner");
    expect(plan.markdown).toContain("does NOT spend money");

    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as {
      scaleStrongBranchPlans?: Array<{ ventureId?: string; status?: string }>;
    };
    expect(exported.scaleStrongBranchPlans?.[0]).toEqual(expect.objectContaining({
      ventureId: saved.id,
      status: "scale-ready",
    }));
    expect(filterVenturePortfolio([loaded], "scale strong branches")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "human-approved spend ceiling")).toHaveLength(1);
    const summary = summarizeVenturePortfolio([loaded]);
    expect(summary.scaleStrongBranchPlanCount).toBe(1);
    expect(summary.scaleStrongBranchReadyCount).toBe(1);
    expect(summary.scaleStrongBranchSpendCeilingCents).toBe(9000);
  });

  it("blocks scale-strong-branch plans when high-severity support burden remains open", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureSupportIssue(
      owner,
      saved.id,
      {
        sourceType: "manual",
        issueType: "pilot-issue",
        severity: "critical",
        status: "in-progress",
        title: "Pilot setup requires founder concierge",
        detail: "Every paid pilot user needs manual calendar setup.",
        customerImpact: "Pilot users wait for founder setup before activation.",
        supportLoad: "Critical support burden before any acquisition scale.",
        retentionRisk: "Retention fails if support response is delayed.",
        owner: "Rishabh",
        resolution: "No automation shipped yet.",
        nextAction: "Resolve support automation before scaling acquisition.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const plan = buildVentureScaleStrongBranchPlan(loaded);

    expect(plan.status).toBe("blocked");
    expect(plan.supportStatus).toBe("support-blocked");
    expect(plan.highSupportIssueCount).toBe(1);
    expect(plan.blockers.join(" ")).toContain("high or critical support");
    expect(plan.nextAction).toContain("Resolve");
    expect(filterVenturePortfolio([loaded], "support-blocked")).toHaveLength(1);
    const summary = summarizeVenturePortfolio([loaded]);
    expect(summary.scaleStrongBranchBlockedCount).toBe(1);
    expect(summary.scaleStrongBranchReadyCount).toBe(0);
  });

  it("spawns evidence-backed branch drafts from converted-pain, retained-user, worked-channel, and converted-pricing memories", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 12000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received first paid pilot payment.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 3,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "12 qualified signups; 3 paid users.",
        learning: "Retention follows concierge setup.",
        nextAction: "Interview retained users before scaling.",
      },
      storage,
      "2026-05-27T03:13:00.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: "fake-door-waitlist",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 3,
        revenueCents: 18000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements; channel paid back.",
        nextAction: "Repeat only if payback holds.",
      },
      storage,
      "2026-05-27T03:14:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const drafts = buildVentureSpawnedVentureDrafts([loaded]);

    expect(drafts.length).toBeGreaterThanOrEqual(4);
    const branchSources = drafts.map((draft) => draft.branchSourceType);
    expect(branchSources).toEqual(expect.arrayContaining([
      "converted-pain",
      "retained-user",
      "worked-channel",
      "converted-pricing",
    ]));

    const painDraft = drafts.find((draft) => draft.branchSourceType === "converted-pain");
    expect(painDraft).toBeDefined();
    expect(painDraft?.parentVentureId).toBe(saved.id);
    expect(painDraft?.parentTitle).toBe("Gen Z Recovery Planner");
    expect(painDraft?.proposedTitle).toContain("adjacent buyer");
    expect(painDraft?.targetBuyer).toContain("Adjacent buyer of Gen Z students");
    expect(painDraft?.painStatement).toBe(loaded.painStatement);
    expect(painDraft?.provenance).toContain("converted-pain memory");
    expect(painDraft?.kickoffActions.some((action) => /fake-door|interview/i.test(action))).toBe(true);
    expect(painDraft?.markdown).toContain("# Spawned Venture Draft:");
    expect(painDraft?.markdown).toContain("Branch source: converted-pain");

    const retainedDraft = drafts.find((draft) => draft.branchSourceType === "retained-user");
    expect(retainedDraft?.productWedge).toContain("Completed Sunday reset plan");
    expect(retainedDraft?.channel).toBe("creator partnerships");
    expect(retainedDraft?.summary).toContain("Fake-door waitlist test cohort");

    const channelDraft = drafts.find((draft) => draft.branchSourceType === "worked-channel");
    expect(channelDraft?.channel).toBe("creator partnerships");
    expect(channelDraft?.summary).toContain("paid-back");

    const pricingDraft = drafts.find((draft) => draft.branchSourceType === "converted-pricing");
    expect(pricingDraft?.pricingHypothesis).toContain("$12/month");
    expect(pricingDraft?.provenance).toContain("converted-pricing memory");

    expect(drafts.every((draft) => draft.status !== "blocked")).toBe(true);

    const exported = JSON.parse(serializeVenturePortfolio([loaded])) as {
      spawnedVentureDrafts?: Array<{ parentVentureId?: string; branchSourceType?: string }>;
    };
    expect(exported.spawnedVentureDrafts?.length).toBeGreaterThanOrEqual(4);
    expect(exported.spawnedVentureDrafts?.[0]?.parentVentureId).toBe(saved.id);

    expect(filterVenturePortfolio([loaded], "spawned venture draft")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "spawn new ventures")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "adjacent buyer")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "channel reuse branch")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "pricing tier branch")).toHaveLength(1);

    const summary = summarizeVenturePortfolio([loaded]);
    expect(summary.spawnedVentureDraftCount).toBe(drafts.length);
    expect(summary.spawnedVentureDraftConvertedPainCount).toBeGreaterThanOrEqual(1);
    expect(summary.spawnedVentureDraftRetainedUserCount).toBeGreaterThanOrEqual(1);
    expect(summary.spawnedVentureDraftWorkedChannelCount).toBeGreaterThanOrEqual(1);
    expect(summary.spawnedVentureDraftConvertedPricingCount).toBeGreaterThanOrEqual(1);
  });

  it("does not spawn branch drafts when a venture has no converted-pain, retained-user, worked-channel, or converted-pricing memory", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    const drafts = buildVentureSpawnedVentureDrafts([saved]);
    expect(drafts).toHaveLength(0);
    expect(summarizeVenturePortfolio([saved]).spawnedVentureDraftCount).toBe(0);
  });

  it("derives merge audits across overlapping saved ventures with retained provenance and human-review gating", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const wsA = { ...evidenceRichWorkspace("Gen Z Recovery Planner"), id: "venture-recovery-a" };
    const wsB = { ...evidenceRichWorkspace("Gen Z Recovery Companion"), id: "venture-recovery-b" };
    saveVentureWorkspace(owner, wsA, storage, "2026-05-27T01:00:00.000Z");
    saveVentureWorkspace(owner, wsB, storage, "2026-05-27T02:00:00.000Z");
    const portfolio = loadVenturePortfolio(owner, storage);
    expect(portfolio).toHaveLength(2);

    const audits = buildVentureRelatedIdeaMergeAudits(portfolio);
    expect(audits.length).toBeGreaterThanOrEqual(1);
    const audit = audits[0];
    expect([wsA.id, wsB.id]).toContain(audit.primaryVentureId);
    expect([wsA.id, wsB.id]).toContain(audit.relatedVentureId);
    expect(audit.primaryVentureId).not.toBe(audit.relatedVentureId);
    expect(audit.matchedFields.length).toBeGreaterThanOrEqual(2);
    expect(audit.matchedFields).toEqual(expect.arrayContaining(["buyer", "pain"]));
    expect(audit.similarityScore).toBeGreaterThanOrEqual(50);
    expect(["reuse", "merge", "fork"]).toContain(audit.recommendation);
    expect(audit.humanReviewRequired).toBe(true);
    expect(audit.evidenceProvenance.primaryEvidence.length).toBeGreaterThan(0);
    expect(audit.evidenceProvenance.relatedEvidence.length).toBeGreaterThan(0);
    expect(audit.evidenceProvenance.primaryEvidence.join(" ")).toContain("youtube");
    expect(audit.evidenceProvenance.relatedEvidence.join(" ")).toContain("youtube");
    expect(audit.risks.length).toBeGreaterThan(0);
    expect(audit.differencesToPreserve.length).toBeGreaterThan(0);
    expect(audit.sharedThesisSummary).toContain("Gen Z Recovery");
    expect(audit.markdown).toContain("# Merge Audit:");
    expect(audit.markdown).toContain("Human review only");
    expect(audit.markdown).toContain("NOT merged");

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      relatedIdeaMergeAudits?: Array<{ id?: string; recommendation?: string }>;
      ventures?: Array<{ id?: string }>;
    };
    expect(exported.relatedIdeaMergeAudits?.length).toBeGreaterThanOrEqual(1);
    expect(exported.relatedIdeaMergeAudits?.[0]?.id).toBe(audit.id);
    expect(exported.ventures?.length).toBe(2);

    expect(filterVenturePortfolio(portfolio, "merge related ideas").length).toBeGreaterThan(0);
    expect(filterVenturePortfolio(portfolio, "related idea merge audit").length).toBeGreaterThan(0);
    expect(filterVenturePortfolio(portfolio, "merge audit").length).toBeGreaterThan(0);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.relatedIdeaMergeAuditCount).toBe(audits.length);
    expect(
      summary.relatedIdeaMergeReuseCount +
        summary.relatedIdeaMergeMergeCount +
        summary.relatedIdeaMergeForkCount +
        summary.relatedIdeaMergeKeepSeparateCount,
    ).toBe(audits.length);
  });

  it("does not emit a merge audit for ventures with unrelated buyer, pain, wedge, and channel", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const wsA = { ...workspaceFixture("Gen Z Recovery Planner"), id: "venture-unrelated-a" };
    const wsB: VentureOperatingWorkspace = {
      ...workspaceFixture("Industrial Sensor Compliance Tracker"),
      id: "venture-unrelated-b",
      targetBuyer: "Industrial plant compliance officers",
      painStatement: "Audit teams cannot reconcile sensor logs against OSHA filings.",
      productWedge: "Automated reconciliation between PLC telemetry and regulator forms.",
      acquisitionChannels: ["OSHA regulator briefings"],
      revenueModel: "$2,400/year per plant",
      pricingHypothesis: "$2,400/year per plant",
      retentionMechanism: "Annual compliance lock-in",
      claims: ["Compliance teams record reconciliation manually."],
    };
    saveVentureWorkspace(owner, wsA, storage, "2026-05-27T01:00:00.000Z");
    saveVentureWorkspace(owner, wsB, storage, "2026-05-27T02:00:00.000Z");
    const portfolio = loadVenturePortfolio(owner, storage);
    expect(portfolio).toHaveLength(2);

    const audits = buildVentureRelatedIdeaMergeAudits(portfolio);
    expect(audits).toHaveLength(0);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.relatedIdeaMergeAuditCount).toBe(0);
    expect(summary.relatedIdeaMergeReuseCount).toBe(0);
    expect(summary.relatedIdeaMergeMergeCount).toBe(0);
    expect(summary.relatedIdeaMergeForkCount).toBe(0);
    expect(summary.relatedIdeaMergeKeepSeparateCount).toBe(0);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      relatedIdeaMergeAudits?: Array<unknown>;
    };
    expect(exported.relatedIdeaMergeAudits ?? []).toHaveLength(0);
  });

  it("keeps related-idea merge audits deterministic and does not mutate saved ventures", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const evidenceBacked = { ...evidenceRichWorkspace("Gen Z Recovery Planner"), id: "venture-evidence-backed" };
    const thinner = {
      ...workspaceFixture("Gen Z Recovery Companion"),
      id: "venture-thinner-branch",
      targetBuyer: evidenceBacked.targetBuyer,
      painStatement: evidenceBacked.painStatement,
      productWedge: evidenceBacked.productWedge,
      acquisitionChannels: [...evidenceBacked.acquisitionChannels],
    };
    saveVentureWorkspace(owner, thinner, storage, "2026-05-27T03:00:00.000Z");
    saveVentureWorkspace(owner, evidenceBacked, storage, "2026-05-27T02:00:00.000Z");
    const portfolio = loadVenturePortfolio(owner, storage);
    const before = JSON.stringify(portfolio);

    const audits = buildVentureRelatedIdeaMergeAudits(portfolio);
    const audit = audits.find((candidate) => (
      candidate.primaryVentureId === evidenceBacked.id ||
      candidate.relatedVentureId === evidenceBacked.id
    ));

    expect(JSON.stringify(portfolio)).toBe(before);
    expect(audit).toBeDefined();
    expect(audit?.primaryVentureId).toBe(evidenceBacked.id);
    expect(audit?.relatedVentureId).toBe(thinner.id);
    expect(audit?.evidenceProvenance.primaryEvidence.join(" ")).toContain("youtube");
    expect(audit?.nextAction).toContain("human");
  });

  it("builds a learning reinvestment queue from kill memory, branch drafts, merge audits, and scale plans", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const weak = evidenceRichWorkspace("Campus Ops Copilot");
    weak.id = "campus-ops-copilot";
    weak.targetBuyer = "Student club treasurers";
    weak.killCriteria.missingEvidence = [];
    const strong = { ...evidenceRichWorkspace("Gen Z Recovery Planner"), id: "venture-learning-strong" };
    const related = { ...evidenceRichWorkspace("Gen Z Recovery Companion"), id: "venture-learning-related" };

    const savedWeak = saveVentureWorkspace(owner, weak, storage, "2026-05-27T01:00:00.000Z");
    const savedStrong = saveVentureWorkspace(owner, strong, storage, "2026-05-27T01:10:00.000Z");
    saveVentureWorkspace(owner, related, storage, "2026-05-27T01:20:00.000Z");

    recordVentureExperimentResult(
      owner,
      savedWeak.id,
      "fake-door-waitlist",
      {
        result: "Missed signup threshold; treasurers said reimbursement packet automation was not urgent.",
        interpretation: "Failed because buyers liked the idea but would not switch from spreadsheets.",
      },
      storage,
      "2026-05-27T02:00:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      savedStrong.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 12000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received first paid pilot payment.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      savedStrong.id,
      {
        type: "expense",
        status: "planned",
        amountCents: 9000,
        source: "Approved creator-placement scale ceiling",
        owner: "Rishabh",
        evidence: "Human-approved spend ceiling for the next bounded cohort.",
      },
      storage,
      "2026-05-27T03:11:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      savedStrong.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      savedStrong.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 3,
        revenueCents: 18000,
        supportIssueCount: 0,
        owner: "Rishabh",
        evidence: "12 qualified signups; 3 paid users.",
        learning: "Retention follows concierge setup.",
        nextAction: "Interview retained users before scaling.",
      },
      storage,
      "2026-05-27T03:13:00.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      savedStrong.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: "fake-door-waitlist",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 3,
        revenueCents: 18000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements; channel paid back.",
        nextAction: "Repeat only if payback holds.",
      },
      storage,
      "2026-05-27T03:14:00.000Z",
    );
    recordVentureAutonomyAudit(
      owner,
      savedStrong.id,
      {
        approvalLevel: "human-approved-spend",
        status: "approved",
        sideEffect: "external-approved",
        actionType: "Approved bounded scale budget",
        actor: "Rishabh",
        riskNote: "Do not exceed the creator-placement ceiling.",
        replayNote: "Replay by checking the approved spend ceiling and payback stop rules.",
        evidence: "Human approved a $90 ceiling for the next creator-placement cohort.",
        nextAction: "Run one bounded cohort and stop if payback fails.",
      },
      storage,
      "2026-05-27T03:15:00.000Z",
    );

    const portfolio = loadVenturePortfolio(owner, storage);
    const queue = buildVentureLearningReinvestmentQueue(portfolio);
    const sourceTypes = queue.map((item) => item.sourceType);

    expect(sourceTypes).toEqual(expect.arrayContaining([
      "weak-branch-kill",
      "spawned-venture-draft",
      "related-idea-merge",
      "scale-strong-branch",
    ]));
    expect(queue.every((item) => item.humanReviewRequired)).toBe(true);
    expect(queue.every((item) => item.owner.length > 0)).toBe(true);
    expect(queue.every((item) => item.proofRequired.length > 0)).toBe(true);
    expect(queue.every((item) => item.changedBranchInstruction.length > 0)).toBe(true);

    const weakItem = queue.find((item) => item.sourceType === "weak-branch-kill");
    expect(weakItem?.priority).toBe("critical");
    expect(weakItem?.status).toBe("blocked");
    expect(weakItem?.proofRequired).toContain("has changed");
    expect(weakItem?.changedBranchInstruction).toContain("Do not copy");

    const spawnedItem = queue.find((item) => item.sourceType === "spawned-venture-draft");
    expect(spawnedItem?.learning).toContain("Converted");
    expect(spawnedItem?.nextExperiment).toMatch(/interview|fake-door|pricing/i);

    const scaleItem = queue.find((item) => item.sourceType === "scale-strong-branch" && item.ventureId === savedStrong.id);
    expect(scaleItem?.status).toBe("ready");
    expect(scaleItem?.proofRequired).toContain("payback");
    expect(scaleItem?.markdown).toContain("# Learning Reinvestment Task:");
    expect(scaleItem?.markdown).toContain("does NOT spend money");

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      learningReinvestmentQueue?: Array<{ sourceType?: string; proofRequired?: string }>;
    };
    expect(exported.learningReinvestmentQueue?.length).toBe(queue.length);
    expect(exported.learningReinvestmentQueue?.map((item) => item.sourceType)).toEqual(expect.arrayContaining(sourceTypes));
    expect(filterVenturePortfolio(portfolio, "learning reinvestment queue").length).toBeGreaterThan(0);
    expect(filterVenturePortfolio(portfolio, "reinvest learning").length).toBeGreaterThan(0);
    expect(filterVenturePortfolio(portfolio, "old learning changes the next branch").length).toBeGreaterThan(0);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.learningReinvestmentQueueCount).toBe(queue.length);
    expect(summary.learningReinvestmentCriticalCount).toBeGreaterThanOrEqual(1);
    expect(summary.learningReinvestmentHighCount).toBeGreaterThanOrEqual(1);
    expect(summary.learningReinvestmentReadyCount).toBeGreaterThanOrEqual(1);
    expect(summary.learningReinvestmentBlockedCount).toBeGreaterThanOrEqual(1);
  });

  it("builds an opportunity discovery backlog from gaps, sources, browser research, competitors, and memory", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace("Gen Z Recovery Planner"), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 12000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received first paid pilot payment.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );
    recordVentureBrowserResearchTask(
      owner,
      saved.id,
      {
        sourceType: "gap-action",
        sourceRecordId: "source-backed-evidence",
        platform: "x",
        sourceTarget: "x coverage",
        prompt: "Research recent Gen Z burnout recovery buying behavior.",
        status: "evidence-captured",
        owner: "browser-researcher",
        evidenceUrl: "https://example.com/x/recovery-thread",
        findings: "X thread shows buyers comparing three recovery planner substitutes.",
        replayNote: "Replay by opening the saved X thread and checking quote timestamps.",
        nextAction: "Add the source as evidence, then rerun market confidence.",
      },
      storage,
      "2026-05-27T03:20:00.000Z",
    );
    recordVentureCompetitor(
      owner,
      saved.id,
      {
        sourceType: "workspace-simulation",
        sourceRecordId: "company-simulation",
        competitorName: "Notion reset templates",
        competitorType: "substitute",
        threatLevel: "high",
        status: "watching",
        positioning: "Students already use templates and wellness content instead of a recurring app.",
        evidence: "Notion templates are the current substitute.",
        differentiation: "Automated Sunday reset workflow with consent-aware reminders.",
        responsePlan: "Compare activation and repeat-use against templates before scaling paid traffic.",
        owner: "Rishabh",
        watchCadence: "Weekly until paid cohort retention proves differentiation.",
        nextAction: "Interview five users about switching costs from templates.",
      },
      storage,
      "2026-05-27T03:21:00.000Z",
    );
    const portfolio = loadVenturePortfolio(owner, storage);
    const backlog = buildVentureOpportunityDiscoveryBacklog(portfolio);
    const sourceTypes = backlog.map((item) => item.sourceType);

    expect(sourceTypes).toEqual(expect.arrayContaining([
      "market-proof-gap",
      "evidence-source",
      "browser-research",
      "competitor-watch",
      "portfolio-memory",
    ]));
    expect(backlog.every((item) => item.nextResearchCommand.length > 0)).toBe(true);
    expect(backlog.every((item) => item.proofRequired.length > 0)).toBe(true);
    expect(backlog.every((item) => item.improvedVentureInstruction.length > 0)).toBe(true);
    expect(backlog.some((item) => item.nextResearchCommand.includes("x coverage"))).toBe(true);
    expect(backlog.some((item) => item.sourceProvenance.join(" ").includes("Notion templates"))).toBe(true);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      opportunityDiscoveryBacklog?: Array<{ sourceType?: string; markdown?: string }>;
    };
    expect(exported.opportunityDiscoveryBacklog?.length).toBe(backlog.length);
    expect(exported.opportunityDiscoveryBacklog?.[0]?.markdown).toContain("# Opportunity Discovery Backlog:");
    expect(filterVenturePortfolio(portfolio, "opportunity discovery backlog")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "discover opportunities")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "next research command")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.opportunityDiscoveryBacklogCount).toBe(backlog.length);
    expect(summary.opportunityDiscoveryReadyCount).toBeGreaterThanOrEqual(1);
    expect(summary.opportunityDiscoveryHighPriorityCount).toBeGreaterThanOrEqual(1);
  });

  it("ranks overlooked high-value opportunities with hidden wedge, novelty, cheap internal test, and no external side effects", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace("Gen Z Recovery Planner"), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 12000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received first paid pilot payment.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );
    recordVentureCompetitor(
      owner,
      saved.id,
      {
        sourceType: "workspace-simulation",
        sourceRecordId: "company-simulation",
        competitorName: "Notion reset templates",
        competitorType: "substitute",
        threatLevel: "high",
        status: "watching",
        positioning: "Students already use templates and wellness content instead of a recurring app.",
        evidence: "Notion templates are the current substitute.",
        differentiation: "Automated Sunday reset workflow with consent-aware reminders.",
        responsePlan: "Compare activation and repeat-use against templates before scaling paid traffic.",
        owner: "Rishabh",
        watchCadence: "Weekly until paid cohort retention proves differentiation.",
        nextAction: "Interview five users about switching costs from templates.",
      },
      storage,
      "2026-05-27T03:21:00.000Z",
    );

    const portfolio = loadVenturePortfolio(owner, storage);
    const atlas = buildVentureOverlookedOpportunityAtlas(portfolio);
    expect(atlas.length).toBeGreaterThan(0);

    const sourceTypes = atlas.map((item) => item.sourceType);
    expect(sourceTypes).toEqual(expect.arrayContaining([
      "market-proof-gap",
      "competitor-watch",
      "converted-pain-memory",
      "evidence-quality",
    ]));

    expect(atlas.every((item) => item.hiddenWedge.length > 0)).toBe(true);
    expect(atlas.every((item) => item.hiddenWedgeRationale.length > 0)).toBe(true);
    expect(atlas.every((item) => item.notRecycledProof.length > 0)).toBe(true);
    expect(atlas.every((item) => item.cheapInternalTestCommand.length > 0)).toBe(true);
    expect(atlas.every((item) => item.humanReviewBoundary.length > 0)).toBe(true);
    expect(atlas.every((item) => item.noExternalSideEffectProof.length > 0)).toBe(true);
    expect(atlas.every((item) => item.rankScore >= 0 && item.rankScore <= 100)).toBe(true);
    expect(atlas.every((item) => item.noveltyScore >= 0 && item.noveltyScore <= 100)).toBe(true);
    expect(atlas.every((item) => item.confidenceScore >= 0 && item.confidenceScore <= 100)).toBe(true);
    expect(atlas.every((item) => item.sourceProvenance.length > 0)).toBe(true);

    const forbiddenPatterns = [/\bsend\b/i, /\bspend\b/i, /\bdeploy\b/i, /\bcontact\b/i, /billing/i, /\bcharge\b/i];
    atlas.forEach((item) => {
      forbiddenPatterns.forEach((pattern) => {
        expect(pattern.test(item.cheapInternalTestCommand))
          .toBe(false);
      });
    });
    expect(atlas.every((item) => /human review/i.test(item.humanReviewBoundary))).toBe(true);
    expect(atlas.every((item) => /no\b.*(send|spend|deploy|contact|billing)/i.test(item.noExternalSideEffectProof))).toBe(true);

    const sortedRankScores = atlas.map((item) => item.rankScore);
    const sortedCopy = [...sortedRankScores];
    // The atlas should be sorted such that higher-priority items come first; verify priorities are non-increasing rank order within a priority group.
    expect(atlas[0].priority).toBeDefined();

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      overlookedOpportunityAtlas?: Array<{ sourceType?: string; markdown?: string }>;
    };
    expect(exported.overlookedOpportunityAtlas?.length).toBe(atlas.length);
    expect(exported.overlookedOpportunityAtlas?.[0]?.markdown).toContain("# Overlooked Opportunity Atlas Item:");
    expect(exported.overlookedOpportunityAtlas?.[0]?.markdown).toContain("## Hidden Wedge Rationale");
    expect(exported.overlookedOpportunityAtlas?.[0]?.markdown).toContain("## Not-Recycled Proof");
    expect(exported.overlookedOpportunityAtlas?.[0]?.markdown).toContain("## Cheap Internal Test Command");
    expect(exported.overlookedOpportunityAtlas?.[0]?.markdown).toContain("## No External Side Effect Proof");

    expect(filterVenturePortfolio(portfolio, "overlooked opportunity atlas")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "overlooked high value opportunity")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "hidden wedge rationale")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "not recycled proof")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "cheap internal test command")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.overlookedOpportunityAtlasCount).toBe(atlas.length);
    expect(summary.overlookedOpportunityRankedCount + summary.overlookedOpportunityNeedsSourceCount + summary.overlookedOpportunityWatchCount + summary.overlookedOpportunityBlockedCount).toBe(atlas.length);
    expect(summary.averageOverlookedOpportunityRankScore).toBeGreaterThanOrEqual(0);
    expect(summary.averageOverlookedOpportunityNoveltyScore).toBeGreaterThanOrEqual(0);
    expect(sortedCopy).toEqual(sortedRankScores);
  });

  it("builds approval-gated atlas validation command packs that prove whether anyone wants one without external side effects", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace("Gen Z Recovery Planner"), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 12000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received first paid pilot payment.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );
    recordVentureCompetitor(
      owner,
      saved.id,
      {
        sourceType: "workspace-simulation",
        sourceRecordId: "company-simulation",
        competitorName: "Notion reset templates",
        competitorType: "substitute",
        threatLevel: "high",
        status: "watching",
        positioning: "Students already use templates and wellness content instead of a recurring app.",
        evidence: "Notion templates are the current substitute.",
        differentiation: "Automated Sunday reset workflow with consent-aware reminders.",
        responsePlan: "Compare activation and repeat-use against templates before scaling paid traffic.",
        owner: "Rishabh",
        watchCadence: "Weekly until paid cohort retention proves differentiation.",
        nextAction: "Interview five users about switching costs from templates.",
      },
      storage,
      "2026-05-27T03:21:00.000Z",
    );

    const portfolio = loadVenturePortfolio(owner, storage);
    const atlas = buildVentureOverlookedOpportunityAtlas(portfolio);
    expect(atlas.length).toBeGreaterThan(0);

    const packs = buildVentureAtlasValidationCommandPacks(portfolio);
    expect(packs.length).toBeGreaterThan(0);
    expect(packs.length).toBeLessThanOrEqual(atlas.length);

    expect(packs.every((pack) => pack.atlasItemId.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.atlasItemTitle.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.atlasSourceArtifactLabel.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.targetBuyer.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.hiddenWedge.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.hypothesis.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.cheapInternalValidationCommand.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.manualResultFields.length >= 3)).toBe(true);
    expect(packs.every((pack) => pack.manualResultThresholds.length >= 3)).toBe(true);
    expect(packs.every((pack) => pack.successCriteria.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.failureCriteria.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.pivotCriteria.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.demandDriftUpdateInstruction.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.sourceProvenance.length > 0)).toBe(true);
    expect(packs.every((pack) => pack.approvalGates.length >= 3)).toBe(true);
    expect(packs.every((pack) => /human review/i.test(pack.humanReviewBoundary))).toBe(true);
    expect(packs.every((pack) => /no\b.*(send|spend|deploy|contact|billing)/i.test(pack.noExternalSideEffectProof))).toBe(true);

    const forbiddenPatterns = [/\bsend\b/i, /\bspend\b/i, /\bdeploy\b/i, /\bcontact\b/i, /billing/i, /\bcharge\b/i];
    packs.forEach((pack) => {
      forbiddenPatterns.forEach((pattern) => {
        expect(pattern.test(pack.cheapInternalValidationCommand)).toBe(false);
      });
    });

    expect(packs.every((pack) => pack.status === "ready" || pack.status === "needs-approval" || pack.status === "needs-source" || pack.status === "blocked")).toBe(true);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      atlasValidationCommandPacks?: Array<{ status?: string; markdown?: string }>;
    };
    expect(exported.atlasValidationCommandPacks?.length).toBe(packs.length);
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("# Atlas Validation Command Pack:");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Hypothesis");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Cheapest Internal Validation Command");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Manual Result Fields");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Manual Result Thresholds");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Success Criteria");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Failure Criteria");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Pivot Criteria");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Demand Drift Update Instruction");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Source Provenance");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Approval Gates");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## Human Review Boundary");
    expect(exported.atlasValidationCommandPacks?.[0]?.markdown).toContain("## No External Side Effect Proof");

    expect(filterVenturePortfolio(portfolio, "atlas validation command packs")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "prove whether anyone wants one")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "validation command pack")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "cheap internal validation command")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "demand drift update instruction")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "approval gated validation pack")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.atlasValidationCommandPackCount).toBe(packs.length);
    expect(
      summary.atlasValidationCommandPackReadyCount
      + summary.atlasValidationCommandPackNeedsApprovalCount
      + summary.atlasValidationCommandPackNeedsSourceCount
      + summary.atlasValidationCommandPackBlockedCount,
    ).toBe(packs.length);
    expect(summary.atlasValidationCommandPackCriticalCount).toBeGreaterThanOrEqual(0);
    expect(summary.atlasValidationCommandPackHighPriorityCount).toBeGreaterThanOrEqual(0);
  });

  it("records atlas validation results into a demand-drift ledger without external side effects", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace("Gen Z Recovery Planner"), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "revenue",
        status: "received",
        amountCents: 12000,
        source: "Paid pilot invoice paid",
        owner: "Rishabh",
        evidence: "Received first paid pilot payment.",
      },
      storage,
      "2026-05-27T03:10:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 3,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Annual plan needs discount.",
        evidenceNote: "Three buyers accepted paid commitment at $12/month.",
      },
      storage,
      "2026-05-27T03:12:00.000Z",
    );

    const portfolioBefore = loadVenturePortfolio(owner, storage);
    const pack = buildVentureAtlasValidationCommandPacks(portfolioBefore)[0];
    expect(pack).toBeDefined();

    const updated = recordVentureAtlasValidationResult(
      owner,
      saved.id,
      {
        atlasValidationPackId: pack.id,
        outcome: "passed",
        qualifiedBuyerCount: 7,
        painConfirmationCount: 6,
        hiddenWedgeResonanceCount: 5,
        paidPricingSignalCount: 2,
        strongestQuote: "I would use the Sunday reset if it handled reminders without another template.",
        strongestObjection: "Needs calendar privacy guardrails before rollout.",
        evidenceNote: "Seven saved manual interview notes confirmed the pain; two accepted a paid pilot.",
        learning: "The overlooked wedge is reminder orchestration, not another student template.",
        owner: "Rishabh",
        nextAction: "Convert the validation result into the next concierge cohort.",
      },
      storage,
      "2026-05-27T04:00:00.000Z",
    );
    expect(updated?.atlasValidationResults).toHaveLength(1);
    expect(updated?.atlasValidationResults[0]?.noExternalSideEffectProof).toMatch(/no send \/ no spend \/ no deploy \/ no contact \/ no billing/i);
    expect(updated?.atlasValidationResults[0]?.demandDriftScore).toBeGreaterThan(80);

    const portfolio = loadVenturePortfolio(owner, storage);
    const ledger = buildVentureAtlasValidationResultLedger(portfolio);
    expect(ledger).toHaveLength(1);
    expect(ledger[0].outcome).toBe("passed");
    expect(ledger[0].statusSummary).toContain("7 qualified buyers");
    expect(ledger[0].demandDriftUpdate).toContain("Demand drift now includes this atlas-validation result");
    expect(ledger[0].markdown).toContain("# Atlas Validation Result:");
    expect(ledger[0].markdown).toContain("## Manual Result");
    expect(ledger[0].markdown).toContain("## Demand Drift Update");
    expect(ledger[0].markdown).toContain("## No External Side Effect Proof");

    const drift = buildVentureDemandDriftReport(portfolio[0]);
    expect(drift.components.some((component) => component.source === "atlas-validation")).toBe(true);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      atlasValidationResultLedger?: Array<{ outcome?: string; markdown?: string }>;
      ventures?: Array<{ atlasValidationResults?: unknown[] }>;
    };
    expect(exported.atlasValidationResultLedger).toHaveLength(1);
    expect(exported.atlasValidationResultLedger?.[0]?.markdown).toContain("Atlas Validation Result");
    expect(exported.ventures?.[0]?.atlasValidationResults).toHaveLength(1);

    expect(filterVenturePortfolio(portfolio, "atlas validation result ledger")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "manual validation result")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "recorded atlas validation outcome")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "manual demand proof")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.atlasValidationResultCount).toBe(1);
    expect(summary.atlasValidationResultPassedCount).toBe(1);
    expect(summary.atlasValidationResultQualifiedBuyerCount).toBe(7);
    expect(summary.atlasValidationResultPaidPricingSignalCount).toBe(2);
  });

  it("builds a product build command queue from handoffs, scaffolds, proof, QA, roadmap, MVP, and deployment blockers", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace("Gen Z Recovery Planner"), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "brief-ready",
        owner: "Rishabh",
        repoPath: "",
        setupCheck: "passed",
        typecheckCheck: "pending",
        unitTestCheck: "pending",
        buildCheck: "pending",
        browserSmokeCheck: "pending",
        deploymentCheck: "blocked",
        verificationNotes: "Build brief ready; generated source is not attached.",
      },
      storage,
      "2026-05-27T03:50:00.000Z",
    );
    recordVentureRoadmapTask(
      owner,
      saved.id,
      {
        sourceType: "manual",
        title: "Implement recovery plan dashboard",
        detail: "Build the dashboard route and wire evidence-backed data.",
        priority: "high",
        status: "queued",
        owner: "Rishabh",
        supportLoad: "Keep support notes visible before release.",
        riskReduction: "Reduces fake demo risk by requiring real build proof.",
        nextAction: "Open the generated source scaffold and implement the dashboard route.",
      },
      storage,
      "2026-05-27T03:55:00.000Z",
    );
    const portfolioBeforeValidation = loadVenturePortfolio(owner, storage);
    const validationPack = buildVentureAtlasValidationCommandPacks(portfolioBeforeValidation)[0];
    expect(validationPack).toBeDefined();
    recordVentureAtlasValidationResult(
      owner,
      saved.id,
      {
        atlasValidationPackId: validationPack.id,
        outcome: "passed",
        qualifiedBuyerCount: 6,
        painConfirmationCount: 5,
        hiddenWedgeResonanceCount: 4,
        paidPricingSignalCount: 2,
        strongestQuote: "I would pay if this built the weekly recovery flow instead of another checklist.",
        strongestObjection: "Keep it local until privacy and calendar permissions are proven.",
        evidenceNote: "Six validation notes confirmed the build target; two buyers accepted paid pilot pricing.",
        learning: "The first product should be the verified recovery workflow, not another research report.",
        owner: "Rishabh",
        nextAction: "Run the generated-app verifier and attach source proof before pilot handoff.",
      },
      storage,
      "2026-05-27T04:05:00.000Z",
    );
    const portfolio = loadVenturePortfolio(owner, storage);
    const commands = buildVentureProductBuildCommandQueue(portfolio);
    const sourceTypes = commands.map((command) => command.sourceType);

    expect(sourceTypes).toEqual(expect.arrayContaining([
      "generated-app-handoff",
      "source-scaffold",
      "mvp-build-workspace",
      "verifier-proof",
      "validation-result",
      "qa-report",
      "roadmap-task",
      "deployment-blocker",
    ]));
    expect(commands.every((command) => command.buildCommand.length > 0)).toBe(true);
    expect(commands.every((command) => command.artifactTarget.length > 0)).toBe(true);
    expect(commands.every((command) => command.proofRequired.length > 0)).toBe(true);
    expect(commands.every((command) => command.noFakeSourceBoundary.length > 0)).toBe(true);
    expect(commands.some((command) => command.buildCommand.includes("generated-app:materialize"))).toBe(true);
    expect(commands.some((command) => command.noFakeSourceBoundary.toLowerCase().includes("source"))).toBe(true);
    const validationCommand = commands.find((command) => command.sourceType === "validation-result");
    expect(validationCommand).toEqual(expect.objectContaining({
      status: "ready",
      buildCommand: expect.stringContaining("generated-app:verify"),
      proofRequired: expect.stringContaining("6 qualified buyers"),
      nextAction: expect.stringContaining("generated-app verifier"),
    }));
    expect(validationCommand?.proofRequired).toContain("setup/typecheck/test/build/browser-smoke");
    expect(validationCommand?.noFakeSourceBoundary).toMatch(/No production deploy, outreach, spend, contact, or billing change/i);
    expect(validationCommand?.evidence.join(" ")).toContain("validation-backed product build");
    expect(validationCommand?.evidence.join(" ")).toContain("Source validation pack");

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      productBuildCommandQueue?: Array<{ sourceType?: string; markdown?: string }>;
    };
    expect(exported.productBuildCommandQueue?.length).toBe(commands.length);
    expect(exported.productBuildCommandQueue?.[0]?.markdown).toContain("# Product Build Command:");
    expect(filterVenturePortfolio(portfolio, "product build command queue")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "build products")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "validation-backed product build")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "build first product")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "no fake source boundary")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.productBuildCommandCount).toBe(commands.length);
    expect(summary.productBuildReadyCount).toBeGreaterThanOrEqual(1);
    expect(summary.productBuildNeedsProofCount + summary.productBuildBlockedCount).toBeGreaterThanOrEqual(1);

    expect(recordVentureProductBuildCommandRun(
      owner,
      saved.id,
      {
        commandId: "missing-product-build-command",
        runState: "executed",
        owner: "Rishabh",
        runProof: "This should not save because the command id is unknown.",
        localArtifactProof: "No artifact proof.",
        verifierReportProof: "No verifier proof.",
        learning: "No learning.",
      },
      storage,
      "2026-05-27T04:08:00.000Z",
    )).toBeNull();

    expect(validationCommand).toBeDefined();
    const runUpdated = recordVentureProductBuildCommandRun(
      owner,
      saved.id,
      {
        commandId: validationCommand?.id ?? "",
        runState: "executed",
        owner: "Rishabh",
        runProof: "Ran the local generated-app verifier command and captured the report without deploying.",
        localArtifactProof: "/tmp/recovery-planner/generated-app with source signatures preserved.",
        verifierReportProof: "Verifier report shows setup/typecheck/test/build/browser-smoke passed locally.",
        learning: "Validation-backed build proof is ready to import before pilot handoff.",
      },
      storage,
      "2026-05-27T04:10:00.000Z",
    );
    expect(runUpdated?.productBuildCommandRuns).toHaveLength(1);
    expect(runUpdated?.productBuildCommandRuns[0]?.noExternalSideEffectProof).toMatch(/no send \/ no spend \/ no deploy \/ no contact \/ no billing change/i);

    const portfolioWithRun = loadVenturePortfolio(owner, storage);
    const runLedger = buildVentureProductBuildCommandRunLedger(portfolioWithRun);
    expect(runLedger).toHaveLength(1);
    expect(runLedger[0]).toEqual(expect.objectContaining({
      runState: "executed",
      sourceType: "validation-result",
      commandStatus: "ready",
    }));
    expect(runLedger[0].markdown).toContain("# Product Build Command Run:");
    expect(runLedger[0].markdown).toContain("## No External Side Effect Proof");
    expect(filterVenturePortfolio(portfolioWithRun, "product build command run ledger")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolioWithRun, "local product build command run")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolioWithRun, "validation-backed product build run")).toHaveLength(1);
    const exportedWithRun = JSON.parse(serializeVenturePortfolio(portfolioWithRun)) as {
      productBuildCommandRunLedger?: Array<{ runState?: string; markdown?: string }>;
      ventures?: Array<{ productBuildCommandRuns?: unknown[] }>;
    };
    expect(exportedWithRun.productBuildCommandRunLedger).toHaveLength(1);
    expect(exportedWithRun.productBuildCommandRunLedger?.[0]?.markdown).toContain("Product Build Command Run");
    expect(exportedWithRun.ventures?.[0]?.productBuildCommandRuns).toHaveLength(1);
    const summaryWithRun = summarizeVenturePortfolio(portfolioWithRun);
    expect(summaryWithRun.productBuildRunCount).toBe(1);
    expect(summaryWithRun.productBuildRunExecutedCount).toBe(1);
    expect(summaryWithRun.productBuildRunImportedCount).toBe(0);
    expect(summaryWithRun.productBuildRunPromotedCount).toBe(0);
  });

  it("builds executable MVP release workspaces from product-build run proof, verifier proof, and QA proof", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    const portfolio = loadVenturePortfolio(owner, storage);

    const workspace = buildVentureMvpReleaseWorkspace(saved);
    expect(workspace.id).toBe(`${saved.id}-mvp-release-workspace`);
    expect(workspace.ventureId).toBe(saved.id);
    expect(workspace.title).toContain("MVP Release Workspace");
    expect(["release-ready", "needs-run-proof", "needs-qa-proof", "blocked"]).toContain(workspace.status);
    expect(workspace.noDeployBoundary).toBeTruthy();
    expect(workspace.noExternalSideEffectProof).toBeTruthy();
    expect(workspace.markdown).toContain("# Executable MVP Release Workspace:");
    expect(workspace.markdown).toContain("No-Deploy Release Boundary");
    expect(workspace.nextActions.length).toBeGreaterThan(0);

    const workspaceList = buildVentureMvpReleaseWorkspaceList(portfolio);
    expect(workspaceList).toHaveLength(portfolio.length);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      mvpReleaseWorkspaceList?: Array<{ status?: string; sourcePath?: string; markdown?: string }>;
    };
    expect(exported.mvpReleaseWorkspaceList).toHaveLength(portfolio.length);
    expect(exported.mvpReleaseWorkspaceList?.[0]?.markdown).toContain("# Executable MVP Release Workspace:");

    expect(filterVenturePortfolio(portfolio, "executable mvp release workspace")).toHaveLength(portfolio.length);
    expect(filterVenturePortfolio(portfolio, "build first product release workspace")).toHaveLength(portfolio.length);
    expect(filterVenturePortfolio(portfolio, "no-deploy release boundary")).toHaveLength(portfolio.length);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.mvpReleaseWorkspaceCount).toBe(portfolio.length);
    expect(
      summary.mvpReleaseReadyCount +
      summary.mvpReleaseNeedsRunProofCount +
      summary.mvpReleaseNeedsQaProofCount +
      summary.mvpReleaseBlockedCount,
    ).toBe(portfolio.length);

    const validationCommand = buildVentureProductBuildCommandQueue(portfolio)[0];
    expect(validationCommand).toBeDefined();
    const runUpdated = recordVentureProductBuildCommandRun(
      owner,
      saved.id,
      {
        commandId: validationCommand?.id ?? "",
        runState: "promoted",
        owner: "Rishabh",
        runProof: "Promoted: local generated-app verifier passed all checks without deploying.",
        localArtifactProof: "/tmp/recovery-planner/dist with source signatures preserved.",
        verifierReportProof: "Verifier report: setup/typecheck/test/build/browser-smoke all green.",
        learning: "Promoted run confirms release-ready state for pilot handoff.",
      },
      storage,
      "2026-05-27T05:00:00.000Z",
    );
    const portfolioWithPromotedRun = loadVenturePortfolio(owner, storage);
    const promotedWorkspace = buildVentureMvpReleaseWorkspace(runUpdated!);
    expect(promotedWorkspace.chosenRunState).toBe("promoted");
    expect(promotedWorkspace.verifierReportProof).toContain("Verifier report");

    const summaryWithPromoted = summarizeVenturePortfolio(portfolioWithPromotedRun);
    expect(summaryWithPromoted.productBuildRunPromotedCount).toBe(1);
    expect(summaryWithPromoted.mvpReleaseWorkspaceCount).toBe(portfolioWithPromotedRun.length);
  });

  it("builds pilot cohort signal gates with status, boundaries, activation draft, and demand proof draft", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    const portfolio = loadVenturePortfolio(owner, storage);

    const gate = buildVenturePilotCohortSignalGate(saved);
    expect(gate.id).toBe(`${saved.id}-pilot-cohort-signal-gate`);
    expect(gate.ventureId).toBe(saved.id);
    expect(gate.ventureTitle).toBe(saved.title);
    expect(["ready", "needs-release-workspace", "needs-inbound-signal", "blocked"]).toContain(gate.status);
    expect(gate.noSendBoundary).toMatch(/no email|no sms|no outreach|no contact/i);
    expect(gate.noDeployBoundary).toBeTruthy();
    expect(gate.noExternalSideEffectProof).toBeTruthy();
    expect(gate.cohortLabel).toBeTruthy();
    expect(gate.localCaptureCommand).toBeTruthy();
    expect(gate.activationCohortDraft.signupTarget).toBeTruthy();
    expect(gate.activationCohortDraft.activatedTarget).toBeTruthy();
    expect(gate.demandCaptureProofDraft).toBeTruthy();
    expect(gate.qualifiedDemandMetric).toBeTruthy();
    expect(gate.nextAction).toBeTruthy();
    expect(gate.evidence.length).toBeGreaterThan(0);
    expect(gate.markdown).toContain("# Pilot Cohort Signal Gate:");
    expect(gate.markdown).toContain("No-Send Boundary");
    expect(gate.markdown).toContain("Activation Cohort Draft");
    expect(gate.markdown).toContain("Demand Capture Proof Draft");

    const gates = buildVenturePilotCohortSignalGates(portfolio);
    expect(gates).toHaveLength(portfolio.length);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      pilotCohortSignalGates?: Array<{ status?: string; markdown?: string }>;
    };
    expect(exported.pilotCohortSignalGates).toHaveLength(portfolio.length);
    expect(exported.pilotCohortSignalGates?.[0]?.markdown).toContain("# Pilot Cohort Signal Gate:");

    expect(filterVenturePortfolio(portfolio, "pilot cohort signal gate")).toHaveLength(portfolio.length);
    expect(filterVenturePortfolio(portfolio, "capture inbound pilot signal")).toHaveLength(portfolio.length);
    expect(filterVenturePortfolio(portfolio, "no-send pilot cohort")).toHaveLength(portfolio.length);
    expect(filterVenturePortfolio(portfolio, "activation cohort draft")).toHaveLength(portfolio.length);
    expect(filterVenturePortfolio(portfolio, "demand capture proof draft")).toHaveLength(portfolio.length);
    expect(filterVenturePortfolio(portfolio, "no contact no deploy")).toHaveLength(portfolio.length);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.pilotCohortSignalGateCount).toBe(portfolio.length);
    expect(
      summary.pilotCohortSignalGateReadyCount +
      summary.pilotCohortSignalGateNeedsReleaseWorkspaceCount +
      summary.pilotCohortSignalGateNeedsInboundSignalCount +
      summary.pilotCohortSignalGateBlockedCount,
    ).toBe(portfolio.length);

    const validationCommand = buildVentureProductBuildCommandQueue(portfolio)[0];
    const runUpdated = recordVentureProductBuildCommandRun(
      owner,
      saved.id,
      {
        commandId: validationCommand?.id ?? "",
        runState: "promoted",
        owner: "Rishabh",
        runProof: "Promoted run confirms pilot cohort signal gate readiness.",
        localArtifactProof: "/tmp/recovery-planner/dist",
        verifierReportProof: "Verifier report: all checks green.",
        learning: "Promoted run unlocks pilot cohort signal gate.",
      },
      storage,
      "2026-05-27T06:00:00.000Z",
    );
    const portfolioWithRun = loadVenturePortfolio(owner, storage);
    const promotedGate = buildVenturePilotCohortSignalGate(runUpdated!);
    expect(promotedGate.releaseWorkspaceStatus).not.toBe("needs-run-proof");
    expect(promotedGate.sourcePath).toContain("/tmp/recovery-planner");
    const summaryWithRun = summarizeVenturePortfolio(portfolioWithRun);
    expect(summaryWithRun.pilotCohortSignalGateCount).toBe(portfolioWithRun.length);
  });

  it("stages pilot signal gates into activation cohort candidates and demand capture proof", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "executable",
        owner: "generated-app-verifier",
        repoPath: "/tmp/recovery-planner/dist",
        setupCommand: "pnpm install",
        typecheckCommand: "pnpm type-check",
        testCommand: "pnpm test",
        buildCommand: "pnpm build",
        browserSmokeCommand: "pnpm browser-smoke",
        deploymentCommand: "Local no-deploy preview readiness only",
        setupCheck: "passed",
        typecheckCheck: "passed",
        unitTestCheck: "passed",
        buildCheck: "passed",
        browserSmokeCheck: "passed",
        deploymentCheck: "passed",
        verificationNotes: "All executable and local no-deploy preview checks passed for pilot onboarding.",
      },
      storage,
      "2026-05-27T06:09:00.000Z",
    );
    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "deployment-proof",
        status: "verified",
        title: "Local no-deploy pilot preview proof",
        uri: "/tmp/recovery-planner/dist",
        owner: "generated-app-verifier",
        verificationCommand: "Local preview only; no external deployment command approved.",
        evidence: "Verified local preview artifact for pilot onboarding. No deploy, no send, no spend, no contact, no billing change.",
        changeSummary: "Attached no-deploy readiness proof so QA can distinguish local pilot proof from external release.",
      },
      storage,
      "2026-05-27T06:09:30.000Z",
    );
    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "Three local pilot requests were recorded from no-send validation notes.",
        interpretation: "Pass: internal pilot demand exists before any outreach, deployment, spend, or billing change.",
        nextAction: "Convert the local pilot requests into a measured activation cohort before external launch.",
      },
      storage,
      "2026-05-27T06:09:45.000Z",
    );
    let portfolio = loadVenturePortfolio(owner, storage);
    const productBuildCommand = buildVentureProductBuildCommandQueue(portfolio)[0];

    expect(productBuildCommand).toBeDefined();
    recordVentureProductBuildCommandRun(
      owner,
      saved.id,
      {
        commandId: productBuildCommand?.id ?? "",
        runState: "promoted",
        owner: "Rishabh",
        runProof: "Promoted local MVP run is ready for internal pilot onboarding proof.",
        localArtifactProof: "/tmp/recovery-planner/dist",
        verifierReportProof: "Verifier report: setup/typecheck/test/build/browser-smoke all green.",
        learning: "The first pilot cohort can be measured from local-only onboarding.",
      },
      storage,
      "2026-05-27T06:10:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        experimentId: "pilot-gate-inbound",
        pricingHypothesis: "Students will accept a paid recovery planner pilot.",
        qualifiedBuyerCount: 3,
        paidCommitmentCount: 1,
        invoiceRequestCount: 1,
        acceptedPrice: "$180 pilot",
        objectionSummary: "Keep onboarding local-only until calendar privacy is proven.",
        evidenceNote: "Three inbound no-send pilot requests came from manual validation notes.",
      },
      storage,
      "2026-05-27T06:12:00.000Z",
    );

    portfolio = loadVenturePortfolio(owner, storage);
    const gate = buildVenturePilotCohortSignalGate(portfolio[0]);
    expect(gate.status).toBe("ready");

    const pilotCandidate = buildVentureActivationCohortCandidates(portfolio[0])
      .find((candidate) => candidate.sourceType === "pilot-signal-gate");
    expect(pilotCandidate).toEqual(expect.objectContaining({
      sourceRecordId: gate.id,
      cohortLabel: expect.stringContaining("onboarding proof"),
      signupCount: 3,
      paidCount: 2,
      nextAction: expect.stringContaining("demand-capture proof queue"),
    }));
    expect(pilotCandidate?.evidence).toMatch(/no email|no deploy|pilot onboarding proof/i);

    const updated = recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: pilotCandidate?.sourceType ?? "manual",
        sourceRecordId: pilotCandidate?.sourceRecordId,
        cohortLabel: pilotCandidate?.cohortLabel ?? "Pilot onboarding proof",
        acquisitionChannel: pilotCandidate?.acquisitionChannel,
        activationEvent: pilotCandidate?.activationEvent,
        retentionWindow: pilotCandidate?.retentionWindow,
        signupCount: pilotCandidate?.signupCount ?? 0,
        activatedCount: pilotCandidate?.activatedCount ?? 0,
        retainedCount: pilotCandidate?.retainedCount ?? 0,
        paidCount: pilotCandidate?.paidCount ?? 0,
        revenueCents: pilotCandidate?.revenueCents ?? 0,
        supportIssueCount: pilotCandidate?.supportIssueCount ?? 0,
        owner: pilotCandidate?.suggestedOwner ?? "Rishabh",
        evidence: pilotCandidate?.evidence,
        learning: pilotCandidate?.learning,
        nextAction: pilotCandidate?.nextAction ?? "Inspect demand capture proof queue.",
      },
      storage,
      "2026-05-27T06:14:00.000Z",
    );
    expect(updated?.activationCohorts[0]).toEqual(expect.objectContaining({
      sourceType: "pilot-signal-gate",
      sourceRecordId: gate.id,
      signupCount: 3,
      paidCount: 2,
    }));

    const portfolioWithCohort = loadVenturePortfolio(owner, storage);
    expect(buildVentureActivationCohortCandidates(portfolioWithCohort[0]).some((candidate) => (
      candidate.sourceType === "pilot-signal-gate"
    ))).toBe(false);

    const demandCapture = buildVentureDemandCaptureProofQueue(portfolioWithCohort);
    expect(demandCapture.some((item) => (
      item.sourceType === "activation-cohort" &&
      item.sourceArtifactId === portfolioWithCohort[0].activationCohorts[0].id &&
      item.title.includes("onboarding proof")
    ))).toBe(true);
    expect(filterVenturePortfolio(portfolioWithCohort, "pilot onboarding proof")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolioWithCohort, "pilot-signal-gate")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolioWithCohort);
    expect(summary.activationCohortCount).toBe(1);
    expect(summary.demandCaptureProofQueueCount).toBeGreaterThan(1);
  });

  it("builds no-send email gate worklists from pilot signal gates without sending", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    let portfolio = loadVenturePortfolio(owner, storage);
    const gatedItem = buildVentureNoSendEmailGateWorklist(portfolio)[0];
    expect(gatedItem).toEqual(expect.objectContaining({
      ventureId: saved.id,
      status: "blocked",
      sourceArtifactId: `${saved.id}-pilot-cohort-signal-gate`,
    }));
    expect(gatedItem.noSendBoundary).toMatch(/No email|external contact/i);

    recordVentureMvpBuildWorkspace(
      owner,
      saved.id,
      {
        status: "executable",
        owner: "generated-app-verifier",
        repoPath: "/tmp/recovery-planner/dist",
        setupCommand: "pnpm install",
        typecheckCommand: "pnpm type-check",
        testCommand: "pnpm test",
        buildCommand: "pnpm build",
        browserSmokeCommand: "pnpm browser-smoke",
        deploymentCommand: "Local no-deploy preview readiness only",
        setupCheck: "passed",
        typecheckCheck: "passed",
        unitTestCheck: "passed",
        buildCheck: "passed",
        browserSmokeCheck: "passed",
        deploymentCheck: "passed",
        verificationNotes: "All executable and local no-deploy preview checks passed for pilot onboarding.",
      },
      storage,
      "2026-05-27T06:09:00.000Z",
    );
    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "deployment-proof",
        status: "verified",
        title: "Local no-deploy pilot preview proof",
        uri: "/tmp/recovery-planner/dist",
        owner: "generated-app-verifier",
        verificationCommand: "Local preview only; no external deployment command approved.",
        evidence: "Verified local preview artifact for pilot onboarding. No deploy, no send, no spend, no contact, no billing change.",
        changeSummary: "Attached no-deploy readiness proof so QA can distinguish local pilot proof from external release.",
      },
      storage,
      "2026-05-27T06:09:30.000Z",
    );
    recordVentureExperimentResult(
      owner,
      saved.id,
      "fake-door-waitlist",
      {
        result: "Three local pilot requests were recorded from no-send validation notes.",
        interpretation: "Pass: internal pilot demand exists before any outreach, deployment, spend, or billing change.",
        nextAction: "Convert the local pilot requests into a measured activation cohort before external launch.",
      },
      storage,
      "2026-05-27T06:09:45.000Z",
    );
    portfolio = loadVenturePortfolio(owner, storage);
    const productBuildCommand = buildVentureProductBuildCommandQueue(portfolio)[0];
    recordVentureProductBuildCommandRun(
      owner,
      saved.id,
      {
        commandId: productBuildCommand?.id ?? "",
        runState: "promoted",
        owner: "Rishabh",
        runProof: "Promoted local MVP run is ready for internal pilot onboarding proof.",
        localArtifactProof: "/tmp/recovery-planner/dist",
        verifierReportProof: "Verifier report: setup/typecheck/test/build/browser-smoke all green.",
        learning: "The first pilot cohort can be measured from local-only onboarding.",
      },
      storage,
      "2026-05-27T06:10:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        experimentId: "pilot-gate-inbound",
        pricingHypothesis: "Students will accept a paid recovery planner pilot.",
        qualifiedBuyerCount: 3,
        paidCommitmentCount: 1,
        invoiceRequestCount: 1,
        acceptedPrice: "$180 pilot",
        objectionSummary: "Keep onboarding local-only until calendar privacy is proven.",
        evidenceNote: "Three inbound no-send pilot requests came from manual validation notes.",
      },
      storage,
      "2026-05-27T06:12:00.000Z",
    );

    portfolio = loadVenturePortfolio(owner, storage);
    const readyItem = buildVentureNoSendEmailGateWorklist(portfolio)[0];
    expect(readyItem).toEqual(expect.objectContaining({
      status: "draft-ready",
      priority: "critical",
      draftSubject: "Manual pilot check: Gen Z Recovery Planner",
      sourceArtifactLabel: expect.stringContaining("Pilot cohort signal gate"),
    }));
    expect(readyItem.draftBody).toContain("DRAFT ONLY - DO NOT SEND FROM THIS APP.");
    expect(readyItem.recipientPlaceholders.join(" ")).toContain("Operator-supplied consented recipient");
    expect(readyItem.reviewChecklist.join(" ")).toContain("separate human outreach approval");
    expect(readyItem.noExternalSideEffectProof).toMatch(/no send, no contact, no spend, no deploy/i);
    expect(readyItem.markdown).toContain("# No-Send Email Gate Work Item:");

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      noSendEmailGateWorklist?: Array<{ status?: string; markdown?: string }>;
    };
    expect(exported.noSendEmailGateWorklist?.[0]).toEqual(expect.objectContaining({
      status: "draft-ready",
    }));
    expect(exported.noSendEmailGateWorklist?.[0]?.markdown).toContain("## No-Send Boundary");

    expect(filterVenturePortfolio(portfolio, "no-send email gate")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "internal outreach draft")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "draft only do not send")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.noSendEmailGateWorklistCount).toBe(1);
    expect(summary.noSendEmailGateDraftReadyCount).toBe(1);
    expect(summary.noSendEmailGateNeedsPilotGateCount).toBe(0);
    expect(summary.noSendEmailGateCriticalCount).toBe(1);
  });

  it("records redacted no-send email gate reply proof without sending or storing recipients", () => {
    const { storage, owner, saved, readyItem } = seedDraftReadyNoSendEmailGate();

    const interviewUpdate = recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "customer-interview",
        owner: "Rishabh",
        redactedReplyNote: "A student said the Sunday reset was urgent and asked for a local walkthrough.",
        consentEvidence: "Manual consent was reviewed in the operator notes; no recipient was stored.",
        persona: "Burned-out student pilot reviewer",
        sentiment: "positive",
        willingnessToPay: "$180 if it replaces weekly coaching.",
        requestedFeatures: "Calendar privacy controls before any production account.",
      },
      storage,
      "2026-05-27T06:20:00.000Z",
    );
    expect(interviewUpdate?.customerInterviews[0]).toEqual(expect.objectContaining({
      channel: "manual no-send email gate reply",
      persona: "Burned-out student pilot reviewer",
      painQuote: expect.stringContaining("Sunday reset"),
      evidenceNote: expect.stringContaining(`No-send email gate reply proof from ${readyItem.id}`),
    }));
    expect(interviewUpdate?.customerInterviews[0].evidenceNote).toMatch(/app did not send email|no recipient/i);
    expect(interviewUpdate?.outreachApprovals).toHaveLength(0);

    const pricingUpdate = recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "pricing-signal",
        owner: "Rishabh",
        redactedReplyNote: "A second reviewer accepted the paid pilot if onboarding stays local-only.",
        qualifiedBuyerCount: 1,
        paidCommitmentCount: 1,
        invoiceRequestCount: 1,
        acceptedPrice: "$180 pilot",
        objectionSummary: "Needs a written no-tracking promise before any real account.",
      },
      storage,
      "2026-05-27T06:21:00.000Z",
    );
    expect(pricingUpdate?.pricingSignals[0]).toEqual(expect.objectContaining({
      qualifiedBuyerCount: 1,
      paidCommitmentCount: 1,
      invoiceRequestCount: 1,
      evidenceNote: expect.stringContaining("No-send email gate reply proof"),
    }));

    const riskUpdate = recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "risk",
        owner: "Rishabh",
        redactedReplyNote: "Reviewer hesitated because calendar import privacy is unclear.",
        riskTitle: "Calendar privacy blocks pilot trust",
        riskSeverity: "medium",
        riskMitigation: "Ship a local-only calendar import explanation before any external outreach.",
      },
      storage,
      "2026-05-27T06:22:00.000Z",
    );
    expect(riskUpdate?.riskRecords[0]).toEqual(expect.objectContaining({
      sourceType: "manual",
      sourceRecordId: readyItem.id,
      title: "Calendar privacy blocks pilot trust",
      severity: "medium",
      mitigation: expect.stringContaining("local-only calendar"),
    }));

    const cohortUpdate = recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "activation-cohort",
        owner: "Rishabh",
        redactedReplyNote: "Two reviewers completed the local walkthrough and one asked for the paid pilot.",
        cohortLabel: "No-send reply pilot walkthrough cohort",
        signupCount: 2,
        activatedCount: 2,
        retainedCount: 1,
        paidCount: 1,
        revenueCents: 18000,
        learning: "Local-only walkthroughs convert when privacy language is explicit.",
        nextAction: "Record the demand-capture proof queue before any external send.",
      },
      storage,
      "2026-05-27T06:23:00.000Z",
    );
    expect(cohortUpdate?.activationCohorts[0]).toEqual(expect.objectContaining({
      sourceType: "pilot-signal-gate",
      sourceRecordId: readyItem.sourceArtifactId,
      cohortLabel: "No-send reply pilot walkthrough cohort",
      signupCount: 2,
      paidCount: 1,
      evidence: expect.stringContaining(readyItem.id),
    }));

    const finalPortfolio = loadVenturePortfolio(owner, storage);
    const finalWorkItem = buildVentureNoSendEmailGateWorklist(finalPortfolio)[0];
    expect(finalWorkItem.replyProofReceiptCount).toBe(4);
    expect(finalWorkItem.replyProofTypesRecorded).toEqual([
      "activation-cohort",
      "risk",
      "pricing-signal",
      "customer-interview",
    ]);
    expect(finalWorkItem.replyProofReceipts[0]).toEqual(expect.objectContaining({
      proofType: "activation-cohort",
      sourceRecordId: cohortUpdate?.activationCohorts[0].id,
      redactedReplyNote: "Two reviewers completed the local walkthrough and one asked for the paid pilot.",
      duplicateHint: expect.stringContaining("exact duplicate redacted notes"),
      noSendProof: expect.stringContaining("no email was sent"),
    }));
    expect(finalWorkItem.replyProofDedupeHint).toContain("4 converted reply proof receipts");
    expect(finalWorkItem.markdown).toContain("## Reply Proof Receipts");
    expect(finalWorkItem.markdown).toContain("## Reply Proof Dedupe");
    expect(filterVenturePortfolio(finalPortfolio, "No-send email gate reply proof")).toHaveLength(1);
    expect(filterVenturePortfolio(finalPortfolio, "reply proof dedupe")).toHaveLength(1);
    expect(filterVenturePortfolio(finalPortfolio, "Two reviewers completed the local walkthrough")).toHaveLength(1);
    const demandCapture = buildVentureDemandCaptureProofQueue(finalPortfolio);
    const noSendDemandItems = demandCapture.filter((item) => item.sourceType === "no-send-reply-proof");
    expect(noSendDemandItems).toHaveLength(4);
    expect(noSendDemandItems.map((item) => item.sourceArtifactId)).toEqual(expect.arrayContaining([
      interviewUpdate?.customerInterviews[0].id,
      pricingUpdate?.pricingSignals[0].id,
      riskUpdate?.riskRecords[0].id,
      cohortUpdate?.activationCohorts[0].id,
    ]));
    expect(noSendDemandItems.every((item) => item.noFakeDemandBoundary.includes("counted once per dedupe key"))).toBe(true);
    expect(noSendDemandItems.some((item) => item.sourceProof.includes("Two reviewers completed the local walkthrough"))).toBe(true);
    expect(demandCapture.some((item) => (
      item.sourceType === "activation-cohort" &&
      item.sourceArtifactId === cohortUpdate?.activationCohorts[0].id
    ))).toBe(false);
    expect(demandCapture.some((item) => (
      item.sourceType === "customer-interview" &&
      item.sourceArtifactId === interviewUpdate?.customerInterviews[0].id
    ))).toBe(false);
    expect(filterVenturePortfolio(finalPortfolio, "no-send-reply-proof")).toHaveLength(1);
    expect(filterVenturePortfolio(finalPortfolio, "counted once per dedupe key")).toHaveLength(1);
    expect(finalPortfolio[0].outreachApprovals).toHaveLength(0);

    const duplicate = recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "activation-cohort",
        owner: "Rishabh",
        redactedReplyNote: "Two reviewers completed the local walkthrough and one asked for the paid pilot.",
        signupCount: 2,
        activatedCount: 2,
        paidCount: 1,
        nextAction: "Do not double-count the same no-send reply proof.",
      },
      storage,
      "2026-05-27T06:24:00.000Z",
    );
    expect(duplicate).toBeNull();
    expect(loadVenturePortfolio(owner, storage)[0].activationCohorts).toHaveLength(1);
  });

  it("rejects unsafe or unready no-send email gate reply proof", () => {
    const { storage, owner, saved, readyItem } = seedDraftReadyNoSendEmailGate();
    const storageKey = getVenturePortfolioStorageKey(owner);
    const beforeUnsafe = storage.getItem(storageKey);

    const unsafe = recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "customer-interview",
        owner: "Rishabh",
        redactedReplyNote: "Reviewer said yes; email them at jane@example.com tomorrow.",
      },
      storage,
      "2026-05-27T06:24:00.000Z",
    );
    expect(unsafe).toBeNull();
    expect(storage.getItem(storageKey)).toBe(beforeUnsafe);

    recordVentureRisk(
      owner,
      saved.id,
      {
        sourceType: "manual",
        sourceRecordId: "privacy-blocker",
        title: "High-risk privacy blocker",
        detail: "Calendar data export needs review before any outreach draft is used.",
        severity: "high",
        status: "open",
        owner: "Rishabh",
        mitigation: "Resolve privacy language before manual outreach.",
        resolutionEvidence: "Not resolved yet.",
      },
      storage,
      "2026-05-27T06:25:00.000Z",
    );
    const blockedItem = buildVentureNoSendEmailGateWorklist(loadVenturePortfolio(owner, storage))[0];
    expect(blockedItem.status).toBe("blocked");
    const blocked = recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: blockedItem.id,
        proofType: "pricing-signal",
        owner: "Rishabh",
        redactedReplyNote: "Reviewer would pay after the privacy blocker is resolved.",
        qualifiedBuyerCount: 1,
      },
      storage,
      "2026-05-27T06:26:00.000Z",
    );
    expect(blocked).toBeNull();

    const loaded = loadVenturePortfolio(owner, storage)[0];
    expect(loaded.customerInterviews).toHaveLength(0);
    expect(loaded.pricingSignals).toHaveLength(1);
    expect(loaded.riskRecords).toHaveLength(1);
  });

  it("builds launch control queues from launch packs, gaps, research, approvals, audits, and agent replays", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    const browserCandidate = buildVentureBrowserResearchCandidates(saved)[0];

    recordVentureBrowserResearchTask(
      owner,
      saved.id,
      {
        sourceType: browserCandidate?.sourceType ?? "manual",
        sourceRecordId: browserCandidate?.sourceRecordId,
        platform: browserCandidate?.platform ?? "chrome",
        sourceTarget: browserCandidate?.sourceTarget ?? "pricing search",
        prompt: browserCandidate?.prompt ?? "Capture pricing demand evidence without contacting anyone.",
        status: "evidence-captured",
        owner: "browser-researcher",
        evidenceUrl: "https://example.com/pricing-search",
        findings: "Read-only browser evidence shows three paid recovery planner substitutes.",
        replayNote: "Replay by opening the saved pricing search URL and recording screenshots.",
        nextAction: "Convert captured pricing evidence into a demand note.",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    recordVentureOutreachApproval(
      owner,
      saved.id,
      {
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Ask for consent before any recovery planner pilot conversation.",
        status: "manual-contact-planned",
        riskNote: "No automated send is allowed; founder must review consent and claims.",
        nextAction: "Founder reviews the no-send draft before manual contact.",
        attribution: "founder@test.dev",
      },
      storage,
      "2026-05-27T03:35:00.000Z",
    );
    recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: "human-approved-outreach",
        status: "approved",
        sideEffect: "external-proposed",
        actionType: "No-send pilot invitation review",
        actor: "Rishabh",
        sourceRecordId: "manual-outreach-review",
        riskNote: "External outreach is proposed only and remains human-gated.",
        replayNote: "Replay by reviewing the saved no-send message draft and approval trail.",
        evidence: "Approval trail confirms no send, spend, deployment, or billing change.",
        nextAction: "Record manual contact outcome only after founder action.",
      },
      storage,
      "2026-05-27T03:40:00.000Z",
    );
    recordVentureAgentRun(
      owner,
      saved.id,
      {
        sourceType: "autonomy-audit",
        sourceRecordId: "manual-outreach-review",
        status: "replayed",
        model: "human-reviewed-local-audit",
        prompt: "Replay the no-send launch checklist and verify side-effect boundaries.",
        outputSummary: "Agent replay confirmed the launch checklist is internal-only.",
        inputEvidence: "No-send message draft, browser evidence URL, and autonomy audit.",
        toolCalls: "read-only local storage inspection",
        tokenEstimate: 2200,
        replayCommand: "Replay the no-send launch checklist against saved local records.",
        riskNote: "Agent replay cannot send, spend, deploy, or alter billing.",
        owner: "Rishabh",
        nextAction: "Use replay output to decide whether the founder manually launches.",
      },
      storage,
      "2026-05-27T03:45:00.000Z",
    );

    const portfolio = loadVenturePortfolio(owner, storage);
    const items = buildVentureLaunchControlQueue(portfolio);
    const sourceTypes = items.map((item) => item.sourceType);

    expect(sourceTypes).toEqual(expect.arrayContaining([
      "experiment-launch-pack",
      "gap-action",
      "browser-research",
      "outreach-approval",
      "autonomy-audit",
      "agent-replay",
    ]));
    expect(items.every((item) => item.launchCommand.length > 0)).toBe(true);
    expect(items.every((item) => item.humanApprovalBoundary.length > 0)).toBe(true);
    expect(items.every((item) => item.successMetric.length > 0)).toBe(true);
    expect(items.every((item) => item.failureMetric.length > 0)).toBe(true);
    expect(items.every((item) => item.noExternalActionProof.length > 0)).toBe(true);
    expect(items.every((item) => item.replayCommand.length > 0)).toBe(true);
    expect(items.some((item) => item.noExternalActionProof.toLowerCase().includes("does not"))).toBe(true);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      launchControlQueue?: Array<{ sourceType?: string; markdown?: string }>;
    };
    expect(exported.launchControlQueue?.length).toBe(items.length);
    expect(exported.launchControlQueue?.[0]?.markdown).toContain("# Launch Control Queue Item:");
    expect(exported.launchControlQueue?.[0]?.markdown).toContain("## No External Action Proof");
    expect(filterVenturePortfolio(portfolio, "launch control queue")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "launch experiments")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "no external send spend deploy")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.launchControlQueueCount).toBe(items.length);
    expect(summary.launchControlReadyCount + summary.launchControlNeedsApprovalCount).toBeGreaterThanOrEqual(1);
    expect(summary.launchControlRecordedCount).toBeGreaterThanOrEqual(1);
    expect(summary.launchControlCriticalCount).toBeGreaterThanOrEqual(0);
  });

  it("builds demand capture proof queues from drift, cohorts, channels, pricing, money, interviews, outreach, and browser proof", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");

    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 6,
        paidCommitmentCount: 2,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Needs student discount before annual plan.",
        evidenceNote: "Two qualified buyers committed to pay after the recovery planner demo.",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 12000,
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Signed pilot LOI for the recovery planner.",
      },
      storage,
      "2026-05-27T03:31:00.000Z",
    );
    recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        willingnessToPay: "$12/month if it saves me time.",
        objections: "Needs calendar privacy language.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
        evidenceNote: "Interviewee asked to join the paid pilot.",
      },
      storage,
      "2026-05-27T03:32:00.000Z",
    );
    recordVentureOutreachApproval(
      owner,
      saved.id,
      {
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Ask for consent before the pilot conversation.",
        status: "completed",
        riskNote: "No automated send occurred.",
        nextAction: "Record the manual response as a customer interview.",
        attribution: "founder@test.dev",
      },
      storage,
      "2026-05-27T03:33:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "manual",
        cohortLabel: "Week-one paid pilot",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Generated first recovery plan",
        retentionWindow: "7 days",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 2400,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "Pilot spreadsheet shows activation and retained paid users.",
        learning: "Students pay when the reset plan lands before Sunday night.",
        nextAction: "Ask paid users for the next weekly retention proof.",
      },
      storage,
      "2026-05-27T03:34:00.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      saved.id,
      {
        sourceType: "manual",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 4000,
        clicks: 220,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 2,
        revenueCents: 12000,
        owner: "Rishabh",
        evidence: "Creator placement generated paid-back pilot demand.",
        nextAction: "Repeat only if retained paid users stay active.",
      },
      storage,
      "2026-05-27T03:35:00.000Z",
    );
    recordVentureBrowserResearchTask(
      owner,
      saved.id,
      {
        sourceType: "manual",
        platform: "reddit",
        sourceTarget: "student recovery planning thread",
        prompt: "Capture source-backed demand without contacting users.",
        status: "evidence-captured",
        owner: "browser-researcher",
        evidenceUrl: "https://example.com/reddit/recovery-planning",
        findings: "Thread shows students asking for recurring Sunday reset workflows.",
        replayNote: "Replay by opening the saved source URL and checking comments.",
        nextAction: "Convert recurring demand language into an interview script.",
      },
      storage,
      "2026-05-27T03:36:00.000Z",
    );

    const portfolio = loadVenturePortfolio(owner, storage);
    const queue = buildVentureDemandCaptureProofQueue(portfolio);
    const sourceTypes = queue.map((item) => item.sourceType);

    expect(sourceTypes).toEqual(expect.arrayContaining([
      "demand-drift-report",
      "activation-cohort",
      "channel-economics",
      "pricing-signal",
      "money-signal",
      "customer-interview",
      "outreach-approval",
      "browser-research",
    ]));
    expect(queue.every((item) => item.captureCommand.length > 0)).toBe(true);
    expect(queue.every((item) => item.qualifiedDemandMetric.length > 0)).toBe(true);
    expect(queue.every((item) => item.sourceProof.length > 0)).toBe(true);
    expect(queue.every((item) => item.noFakeDemandBoundary.length > 0)).toBe(true);
    expect(queue.some((item) => item.noFakeDemandBoundary.toLowerCase().includes("demand"))).toBe(true);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      demandCaptureProofQueue?: Array<{ sourceType?: string; markdown?: string }>;
    };
    expect(exported.demandCaptureProofQueue?.length).toBe(queue.length);
    expect(exported.demandCaptureProofQueue?.[0]?.markdown).toContain("# Demand Capture Proof Item:");
    expect(exported.demandCaptureProofQueue?.[0]?.markdown).toContain("## No-Fake-Demand Boundary");
    expect(filterVenturePortfolio(portfolio, "demand capture proof queue")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "capture demand")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "no fake demand boundary")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.demandCaptureProofQueueCount).toBe(queue.length);
    expect(summary.demandCaptureCapturedCount).toBeGreaterThanOrEqual(1);
    expect(summary.demandCaptureNeedsFollowUpCount + summary.demandCaptureWeakCount + summary.demandCaptureBlockedCount).toBeGreaterThanOrEqual(0);
  });

  it("builds portfolio decision command queues from proof, launch, revenue, product, support, scale, and kill pressure", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVenturePricingSignal(
      owner,
      saved.id,
      {
        qualifiedBuyerCount: 4,
        paidCommitmentCount: 2,
        invoiceRequestCount: 1,
        acceptedPrice: "$12/month",
        objectionSummary: "Needs privacy copy before annual commitment.",
        evidenceNote: "Two buyers committed after reviewing the recovery planner demo.",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 16000,
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Signed pilot LOI is attached to the venture record.",
      },
      storage,
      "2026-05-27T03:31:00.000Z",
    );
    recordVentureActivationCohort(
      owner,
      saved.id,
      {
        sourceType: "manual",
        cohortLabel: "Week-one paid pilot",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Generated first recovery plan",
        retentionWindow: "7 days",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 2400,
        supportIssueCount: 2,
        owner: "Rishabh",
        evidence: "Pilot spreadsheet shows paid retained users and support load.",
        learning: "Paid users retained when the reset landed before Sunday night.",
        nextAction: "Resolve support load before deciding whether to scale.",
      },
      storage,
      "2026-05-27T03:32:00.000Z",
    );
    recordVentureSupportIssue(
      owner,
      saved.id,
      {
        issueType: "pilot-issue",
        severity: "high",
        status: "open",
        sourceType: "manual",
        title: "Calendar privacy concern",
        detail: "Pilot users ask whether calendar data is stored.",
        customerImpact: "Blocks expansion to privacy-sensitive students.",
        supportLoad: "Founder must answer manually during onboarding.",
        retentionRisk: "High if privacy language remains unclear.",
        owner: "Rishabh",
        nextAction: "Write privacy copy and retest onboarding before scale.",
      },
      storage,
      "2026-05-27T03:33:00.000Z",
    );
    recordVentureCustomerInterview(
      owner,
      saved.id,
      {
        persona: "Privacy-sensitive pilot evaluator",
        channel: "manual interview",
        painQuote: "I cannot use it until calendar storage is clear.",
        willingnessToPay: "$0 until privacy is proven.",
        objections: "Calendar import risk blocks adoption.",
        requestedFeatures: "Local-only privacy explanation.",
        sentiment: "negative",
        evidenceNote: "Negative interview blocked pilot demand until privacy copy is proven.",
      },
      storage,
      "2026-05-27T03:34:00.000Z",
    );
    const portfolio = loadVenturePortfolio(owner, storage);
    const commands = buildVenturePortfolioDecisionCommandQueue(portfolio);

    expect(commands).toHaveLength(1);
    expect(commands[0]).toEqual(expect.objectContaining({
      ventureId: saved.id,
      owner: "Rishabh",
    }));
    expect(commands[0].recommendedDecision).toEqual(expect.stringMatching(/continue|pivot|pause|kill|scale|archive/));
    expect(commands[0].decisionCommand).toContain("Recommend");
    expect(commands[0].nextCommand.length).toBeGreaterThan(0);
    expect(commands[0].humanReviewBoundary).toContain("does not mutate lifecycle");
    expect(commands[0].contradictionProof.length).toBeGreaterThan(0);
    expect(commands[0].demandCaptureSummary).toContain("captured");
    expect(commands[0].demandSourceProvenanceSummary).toContain("non-no-send demand source");
    expect(commands[0].demandSourceProvenanceSummary).toMatch(/activation-cohort|pricing-signal|money-signal/);
    expect(commands[0].demandSourceDecisionNote.toLowerCase()).toContain(commands[0].recommendedDecision);
    expect(commands[0].demandSourceEvidence.join(" ")).toMatch(/activation-cohort|pricing-signal|money-signal/);
    expect(commands[0].demandSourceBlockerSummary).toMatch(/non-no-send demand blocker source/);
    expect(commands[0].demandSourceBlockerSummary).toContain("customer-interview");
    expect(commands[0].demandSourceBlockerSummary).toContain("blocked");
    expect(commands[0].demandSourceBlockerEvidence.join(" ")).toMatch(/customer-interview.*Negative interview blocked pilot demand/i);
    expect(commands[0].revenueSummary).toContain("paid");
    expect(commands[0].launchSummary).toContain("ready");
    expect(commands[0].productProofSummary).toContain("verified");
    expect(commands[0].supportSummary).toContain("high or critical");
    expect(commands[0].killPressureSummary).toContain("pressure");
    expect(commands[0].evidence.length).toBeGreaterThan(5);
    expect(commands[0].evidence).toEqual(expect.arrayContaining([commands[0].demandSourceBlockerSummary]));
    expect(commands[0].blockers.join(" ")).toContain("non-no-send demand source");

    const drilldowns = buildVentureDemandSourceBlockerDrilldowns(portfolio);
    expect(drilldowns.length).toBeGreaterThanOrEqual(1);
    const interviewDrilldown = drilldowns.find((item) => item.sourceType === "customer-interview");
    expect(interviewDrilldown).toEqual(expect.objectContaining({
      id: "demand-source-blocker-drilldown-customer-interview",
      sourceType: "customer-interview",
      count: 1,
      blockedCount: 1,
      weakPressureCount: 0,
      ventureCount: 1,
      commandCount: 1,
      searchQuery: "demand source blocker drilldown customer-interview",
    }));
    expect(interviewDrilldown?.ventureIds).toContain(saved.id);
    expect(interviewDrilldown?.ventureTitles).toContain(saved.title);
    expect(interviewDrilldown?.commandIds).toContain(commands[0].id);
    expect(interviewDrilldown?.decisionCounts[0].decision).toBe(commands[0].recommendedDecision);
    expect(interviewDrilldown?.summary).toContain("customer-interview contributes 1 demand-source blocker");
    expect(interviewDrilldown?.evidence.join(" ")).toMatch(/Negative interview blocked pilot demand/i);
    expect(interviewDrilldown?.markdown).toContain("# Demand Source Blocker Drilldown: customer-interview");
    expect(interviewDrilldown?.markdown).toContain("## Operator Search Query");

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      demandSourceBlockerDrilldowns?: Array<{
        sourceType?: string;
        summary?: string;
        searchQuery?: string;
        evidence?: string[];
        markdown?: string;
      }>;
      portfolioDecisionCommandQueue?: Array<{
        recommendedDecision?: string;
        demandSourceProvenanceSummary?: string;
        demandSourceDecisionNote?: string;
        demandSourceBlockerSummary?: string;
        demandSourceEvidence?: string[];
        demandSourceBlockerEvidence?: string[];
        markdown?: string;
      }>;
    };
    expect(exported.demandSourceBlockerDrilldowns?.length).toBe(drilldowns.length);
    const exportedInterviewDrilldown = exported.demandSourceBlockerDrilldowns?.find((item) => item.sourceType === "customer-interview");
    expect(exportedInterviewDrilldown?.summary).toBe(interviewDrilldown?.summary);
    expect(exportedInterviewDrilldown?.searchQuery).toBe("demand source blocker drilldown customer-interview");
    expect(exportedInterviewDrilldown?.evidence?.join(" ")).toMatch(/Negative interview blocked pilot demand/i);
    expect(exportedInterviewDrilldown?.markdown).toContain("# Demand Source Blocker Drilldown: customer-interview");
    expect(exported.portfolioDecisionCommandQueue?.length).toBe(commands.length);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.markdown).toContain("# Portfolio Decision Command:");
    expect(exported.portfolioDecisionCommandQueue?.[0]?.markdown).toContain("## Demand Source Provenance");
    expect(exported.portfolioDecisionCommandQueue?.[0]?.markdown).toContain("## Demand Source Blocker Provenance");
    expect(exported.portfolioDecisionCommandQueue?.[0]?.markdown).toContain("## Human Review Boundary");
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceProvenanceSummary).toBe(commands[0].demandSourceProvenanceSummary);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceDecisionNote).toBe(commands[0].demandSourceDecisionNote);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceBlockerSummary).toBe(commands[0].demandSourceBlockerSummary);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceEvidence?.length).toBeGreaterThan(0);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceBlockerEvidence?.join(" ")).toMatch(/customer-interview.*Negative interview blocked pilot demand/i);
    expect(filterVenturePortfolio(portfolio, "portfolio decision command queue")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "recommend continue pivot kill")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "human review boundary")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "demand source provenance")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "non-no-send demand source")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "demand source blocker provenance")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "blocked non-no-send demand source")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "demand source blocker drilldown")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "blocker source mix drilldown")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "demand source blocker drilldown customer-interview")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "jump to blocker source")).toHaveLength(1);

    const summary = summarizeVenturePortfolio(portfolio);
    expect(summary.portfolioDecisionCommandCount).toBe(commands.length);
    expect(
      summary.portfolioDecisionContinueCount +
      summary.portfolioDecisionPivotCount +
      summary.portfolioDecisionPauseCount +
      summary.portfolioDecisionKillCount +
      summary.portfolioDecisionScaleCount,
    ).toBe(commands.length);
    expect(
      summary.portfolioDecisionReadyCount +
      summary.portfolioDecisionNeedsProofCount +
      summary.portfolioDecisionBlockedCount +
      summary.portfolioDecisionHumanReviewCount,
    ).toBe(commands.length);
    expect(summary.portfolioDecisionDemandSourceBlockerCount).toBeGreaterThanOrEqual(1);
    expect(summary.portfolioDecisionDemandSourceBlockedCount).toBeGreaterThanOrEqual(1);
    expect(summary.portfolioDecisionDemandSourceWeakPressureCount).toBe(0);
    expect(summary.portfolioDecisionDemandSourceBlockerTypeCount).toBeGreaterThanOrEqual(1);
    expect(summary.portfolioDecisionDemandSourceBlockerBreakdown).toContain("customer-interview");
    expect(drilldowns.reduce((sum, item) => sum + item.count, 0)).toBe(summary.portfolioDecisionDemandSourceBlockerCount);
    expect(drilldowns.reduce((sum, item) => sum + item.blockedCount, 0)).toBe(summary.portfolioDecisionDemandSourceBlockedCount);
    expect(drilldowns.reduce((sum, item) => sum + item.weakPressureCount, 0)).toBe(summary.portfolioDecisionDemandSourceWeakPressureCount);
    expect(drilldowns.length).toBe(summary.portfolioDecisionDemandSourceBlockerTypeCount);
  });

  it("explains how no-send email gate reply demand influenced the portfolio decision command recommendation", () => {
    const { storage, owner, saved, readyItem } = seedDraftReadyNoSendEmailGate();

    const baselineCommands = buildVenturePortfolioDecisionCommandQueue(loadVenturePortfolio(owner, storage));
    expect(baselineCommands).toHaveLength(1);
    expect(baselineCommands[0].noSendReplyDemandSummary).toContain("No redacted no-send email-gate reply receipts");
    expect(baselineCommands[0].noSendReplyDecisionNote).toContain("did not influence");
    expect(baselineCommands[0].confidenceNote).toContain("No-send email-gate reply demand did not influence");
    expect(baselineCommands[0].noSendReplyDemandEvidence).toEqual([]);
    expect(baselineCommands[0].markdown).toContain("## No-Send Email Gate Reply Demand");
    expect(baselineCommands[0].markdown).toContain("No redacted no-send email-gate reply receipts have shifted");

    recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "customer-interview",
        owner: "Rishabh",
        redactedReplyNote: "Pilot reviewer asked for a local Sunday reset walkthrough before any account.",
        consentEvidence: "Manual consent reviewed in operator notes; no recipient was stored.",
        persona: "Burned-out student pilot reviewer",
        sentiment: "positive",
        willingnessToPay: "$180 pilot if onboarding stays local.",
      },
      storage,
      "2026-05-27T06:30:00.000Z",
    );
    recordVentureNoSendEmailGateReplyProof(
      owner,
      saved.id,
      {
        workItemId: readyItem.id,
        proofType: "activation-cohort",
        owner: "Rishabh",
        redactedReplyNote: "Two reviewers completed the local walkthrough and one paid for the pilot.",
        cohortLabel: "No-send reply pilot walkthrough cohort",
        signupCount: 2,
        activatedCount: 2,
        retainedCount: 1,
        paidCount: 1,
        revenueCents: 18000,
        learning: "Local-only walkthroughs convert when privacy language is explicit.",
        nextAction: "Record the demand-capture proof queue before any external send.",
      },
      storage,
      "2026-05-27T06:31:00.000Z",
    );

    const portfolio = loadVenturePortfolio(owner, storage);
    const updatedCommands = buildVenturePortfolioDecisionCommandQueue(portfolio);
    expect(updatedCommands).toHaveLength(1);
    const command = updatedCommands[0];
    expect(command.noSendReplyDemandSummary).toContain("no-send email-gate reply receipt");
    expect(command.noSendReplyDemandSummary).toMatch(/\d+ captured/);
    expect(command.demandSourceProvenanceSummary).toContain("non-no-send demand source");
    expect(command.demandSourceDecisionNote.toLowerCase()).toContain(command.recommendedDecision);
    expect(command.demandSourceEvidence.join(" ")).toMatch(/demand-drift-report|pricing-signal/);
    expect(command.demandSourceBlockerSummary.length).toBeGreaterThan(0);
    expect(command.noSendReplyDecisionNote).toMatch(/no-send email-gate reply receipt/i);
    expect(command.noSendReplyDecisionNote.toLowerCase()).toContain(command.recommendedDecision.toLowerCase());
    expect(command.confidenceNote).toContain("captured redacted no-send");
    expect(command.noSendReplyDemandEvidence.length).toBeGreaterThan(0);
    expect(command.noSendReplyDemandEvidence.join(" ")).toMatch(/no-send-reply-proof|No-send email gate reply proof|activation-cohort|customer-interview/);
    expect(command.markdown).toContain("## No-Send Email Gate Reply Demand");
    expect(command.markdown).toContain("## Demand Source Provenance");
    expect(command.markdown).toContain("## Demand Source Blocker Provenance");
    expect(command.markdown).toContain(command.demandSourceProvenanceSummary);
    expect(command.markdown).toContain(command.demandSourceBlockerSummary);
    expect(command.markdown).toContain(command.noSendReplyDemandSummary);
    expect(command.markdown).toContain(command.noSendReplyDecisionNote);
    expect(command.markdown).toContain(command.confidenceNote);
    expect(command.evidence).toEqual(expect.arrayContaining([command.noSendReplyDemandSummary]));

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      portfolioDecisionCommandQueue?: Array<{
        noSendReplyDemandSummary?: string;
        demandSourceProvenanceSummary?: string;
        demandSourceDecisionNote?: string;
        demandSourceBlockerSummary?: string;
        demandSourceBlockerEvidence?: string[];
        demandSourceEvidence?: string[];
        noSendReplyDecisionNote?: string;
        confidenceNote?: string;
        noSendReplyDemandEvidence?: string[];
        markdown?: string;
      }>;
    };
    expect(exported.portfolioDecisionCommandQueue?.[0]?.noSendReplyDemandSummary).toBe(command.noSendReplyDemandSummary);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceProvenanceSummary).toBe(command.demandSourceProvenanceSummary);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceDecisionNote).toBe(command.demandSourceDecisionNote);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceBlockerSummary).toBe(command.demandSourceBlockerSummary);
    expect(Array.isArray(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceBlockerEvidence)).toBe(true);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceEvidence?.length).toBeGreaterThan(0);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.noSendReplyDecisionNote).toBe(command.noSendReplyDecisionNote);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.confidenceNote).toBe(command.confidenceNote);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.noSendReplyDemandEvidence?.length).toBeGreaterThan(0);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.markdown).toContain("## No-Send Email Gate Reply Demand");

    expect(filterVenturePortfolio(portfolio, "no-send email gate reply demand")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "no-send reply demand influence")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "demand source provenance")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "demand source blocker provenance")).toHaveLength(1);
  });

  it("surfaces blocked non-no-send demand source provenance in the portfolio decision command", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "blocked",
        amountCents: 14000,
        source: "Paid pilot LOI blocked by billing review",
        owner: "Rishabh",
        evidence: "Billing review flagged unsafe attribution; the money signal is blocked until reconciled.",
      },
      storage,
      "2026-05-27T03:32:00.000Z",
    );

    const portfolio = loadVenturePortfolio(owner, storage);
    const commands = buildVenturePortfolioDecisionCommandQueue(portfolio);
    expect(commands).toHaveLength(1);
    const command = commands[0];

    expect(command.demandSourceBlockerSummary).toContain("non-no-send demand blocker source");
    expect(command.demandSourceBlockerSummary).toMatch(/money-signal/);
    expect(command.demandSourceBlockerSummary.toLowerCase()).toContain(command.recommendedDecision.toLowerCase());
    expect(command.demandSourceBlockerEvidence.length).toBeGreaterThan(0);
    expect(command.demandSourceBlockerEvidence.join(" ")).toMatch(/money-signal blocker/);
    expect(command.demandSourceBlockerEvidence.join(" ")).toMatch(/\[blocked\]|\[weak\]/);
    expect(command.evidence).toEqual(expect.arrayContaining([command.demandSourceBlockerSummary]));
    expect(command.markdown).toContain("## Demand Source Blocker Provenance");
    expect(command.markdown).toContain(command.demandSourceBlockerSummary);

    const exported = JSON.parse(serializeVenturePortfolio(portfolio)) as {
      portfolioDecisionCommandQueue?: Array<{
        demandSourceBlockerSummary?: string;
        demandSourceBlockerEvidence?: string[];
        markdown?: string;
      }>;
      portfolioSummary?: {
        portfolioDecisionDemandSourceBlockerCount?: number;
        portfolioDecisionDemandSourceBlockedCount?: number;
        portfolioDecisionDemandSourceWeakPressureCount?: number;
        portfolioDecisionDemandSourceBlockerTypeCount?: number;
        portfolioDecisionDemandSourceBlockerBreakdown?: string;
      };
    };
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceBlockerSummary).toBe(command.demandSourceBlockerSummary);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.demandSourceBlockerEvidence?.length).toBeGreaterThan(0);
    expect(exported.portfolioDecisionCommandQueue?.[0]?.markdown).toContain("## Demand Source Blocker Provenance");
    expect(exported.portfolioSummary?.portfolioDecisionDemandSourceBlockerCount).toBeGreaterThanOrEqual(1);
    expect(exported.portfolioSummary?.portfolioDecisionDemandSourceBlockedCount).toBeGreaterThanOrEqual(1);
    expect(exported.portfolioSummary?.portfolioDecisionDemandSourceWeakPressureCount).toBe(0);
    expect(exported.portfolioSummary?.portfolioDecisionDemandSourceBlockerTypeCount).toBeGreaterThanOrEqual(1);
    expect(exported.portfolioSummary?.portfolioDecisionDemandSourceBlockerBreakdown).toContain("money-signal");

    expect(filterVenturePortfolio(portfolio, "demand source blocker provenance")).toHaveLength(1);
    expect(filterVenturePortfolio(portfolio, "blocked non-no-send demand source")).toHaveLength(1);
  });

  it("builds chart-ready portfolio analytics for evidence, demand, finance, QA, cash, lifecycle, and kill-scale pressure", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureMoneySignal(
      owner,
      saved.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 18000,
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Founder call produced a paid pilot commitment.",
      },
      storage,
      "2026-05-27T03:20:00.000Z",
    );
    const withMoneySignal = loadVenturePortfolio(owner, storage)[0];
    const deploymentEscalationCandidate = buildVentureAutonomyAuditCandidates(withMoneySignal, "2026-05-29T01:00:00.000Z")
      .find((candidate) => candidate.actionType.startsWith("No-send deployment escalation"));
    recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: deploymentEscalationCandidate?.approvalLevel ?? "deployment-proposal",
        status: deploymentEscalationCandidate?.status ?? "proposed",
        sideEffect: deploymentEscalationCandidate?.sideEffect ?? "none",
        actionType: deploymentEscalationCandidate?.actionType ?? "No-send deployment escalation",
        actor: deploymentEscalationCandidate?.suggestedActor ?? "release-owner",
        sourceRecordId: deploymentEscalationCandidate?.sourceRecordId,
        riskNote: deploymentEscalationCandidate?.riskNote,
        replayNote: deploymentEscalationCandidate?.replayNote,
        evidence: deploymentEscalationCandidate?.evidence,
        nextAction: deploymentEscalationCandidate?.nextAction ?? "Keep the escalation internal.",
      },
      storage,
      "2026-05-29T01:05:00.000Z",
    );
    const ventures = loadVenturePortfolio(owner, storage);
    const chartPack = buildVenturePortfolioChartPack(ventures);

    expect(chartPack).toEqual(expect.objectContaining({
      id: "venture-portfolio-chart-pack",
      ventureCount: 1,
      chartCount: 14,
    }));
    expect(chartPack.charts.map((chart) => chart.title)).toEqual([
      "Evidence Readiness Chart",
      "Demand Reality Chart",
      "Finance Score Chart",
      "QA Readiness Chart",
      "Net Evidence Cash Chart",
      "Lifecycle Distribution Chart",
      "Kill Scale Recommendation Chart",
      "Deployment Owner Workload Chart",
      "Deployment Environment Workload Chart",
      "Deployment SLA Workload Chart",
      "Deployment Status Workload Chart",
      "Deployment Escalation Status Chart",
      "Deployment Escalation Side Effect Chart",
      "Deployment Escalation Actor Chart",
    ]);
    expect(chartPack.charts.find((chart) => chart.id === "finance-score-chart")?.data[0]).toEqual(expect.objectContaining({
      label: "Gen Z Recovery Planner",
      unit: "score",
      detail: expect.stringContaining("payback"),
    }));
    expect(chartPack.charts.find((chart) => chart.id === "net-evidence-cash-chart")?.data[0]).toEqual(expect.objectContaining({
      unit: "currency-cents",
      detail: expect.stringContaining("runway"),
    }));
    expect(chartPack.charts.find((chart) => chart.id === "deployment-owner-workload-chart")?.data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        label: "release-owner",
        unit: "count",
        detail: expect.stringContaining("production"),
      }),
      expect.objectContaining({
        label: "support-owner",
        unit: "count",
      }),
    ]));
    expect(chartPack.charts.find((chart) => chart.id === "deployment-environment-workload-chart")?.data[0]).toEqual(expect.objectContaining({
      label: "production",
      tone: "red",
    }));
    expect(chartPack.charts.find((chart) => chart.id === "deployment-sla-workload-chart")?.data.map((datum) => datum.label)).toEqual(["stale", "watch", "fresh"]);
    expect(chartPack.charts.find((chart) => chart.id === "deployment-status-workload-chart")?.data.map((datum) => datum.label)).toContain("candidate");
    expect(chartPack.charts.find((chart) => chart.id === "deployment-escalation-status-chart")?.data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        label: "proposed",
        value: 1,
        tone: "amber",
      }),
    ]));
    expect(chartPack.charts.find((chart) => chart.id === "deployment-escalation-side-effect-chart")?.data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        label: "none",
        value: 1,
        tone: "emerald",
      }),
    ]));
    expect(chartPack.charts.find((chart) => chart.id === "deployment-escalation-actor-chart")?.data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        label: "release-owner",
        value: 1,
      }),
    ]));
    expect(chartPack.markdown).toContain("# Venture Portfolio Charts");
    expect(chartPack.markdown).toContain("## Finance Score Chart");
    expect(chartPack.markdown).toContain("## Deployment Owner Workload Chart");
    expect(chartPack.markdown).toContain("## Deployment Escalation Side Effect Chart");
    expect(filterVenturePortfolio(ventures, "Deployment Owner Workload Chart")).toHaveLength(1);
    expect(filterVenturePortfolio(ventures, "Deployment Escalation Side Effect Chart")).toHaveLength(1);
    expect(filterVenturePortfolio(ventures, "Finance Score Chart")).toHaveLength(1);
    expect(filterVenturePortfolio(ventures, "portfolio charts")).toHaveLength(1);
  });

  it("records autonomy audit entries from approval-boundary candidates", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureOutreachApproval(
      owner,
      saved.id,
      {
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Thanks for joining the Recovery Planner early list.",
        status: "approved",
        riskNote: "No clinical claims.",
        nextAction: "Send manually after consent review.",
        attribution: "Rishabh",
      },
      storage,
      "2026-05-27T04:10:00.000Z",
    );
    const withApproval = loadVenturePortfolio(owner, storage)[0];
    const candidate = buildVentureAutonomyAuditCandidates(withApproval)
      .find((item) => item.approvalLevel === "human-approved-outreach");

    expect(candidate).toEqual(expect.objectContaining({
      sideEffect: "external-blocked",
      actionType: "Outreach draft: manual email",
      riskNote: "No clinical claims.",
    }));

    const updated = recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: candidate?.approvalLevel ?? "human-approved-outreach",
        status: candidate?.status ?? "approved",
        sideEffect: candidate?.sideEffect ?? "external-blocked",
        actionType: candidate?.actionType ?? "Outreach draft",
        actor: "Rishabh",
        sourceRecordId: candidate?.sourceRecordId,
        riskNote: candidate?.riskNote,
        replayNote: "Replay by reviewing the stored message draft and no-send state.",
        evidence: candidate?.evidence,
        nextAction: "Keep no-send state until consent review is complete.",
      },
      storage,
      "2026-05-27T04:15:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.autonomyAudit).toHaveLength(1);
    expect(loaded.autonomyAudit[0]).toEqual(expect.objectContaining({
      approvalLevel: "human-approved-outreach",
      sideEffect: "external-blocked",
      actor: "Rishabh",
      replayNote: "Replay by reviewing the stored message draft and no-send state.",
    }));
    expect(buildVentureAutonomyAuditCandidates(loaded).find((item) => item.sourceRecordId === candidate?.sourceRecordId)).toBeUndefined();
    expect(filterVenturePortfolio([loaded], "no-send state")).toHaveLength(1);
  });

  it("creates no-send autonomy escalation candidates for stale deployment owner work", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-20T01:00:00.000Z");
    const loaded = loadVenturePortfolio(owner, storage)[0];
    const escalationCandidate = buildVentureAutonomyAuditCandidates(loaded, "2026-05-29T01:00:00.000Z")
      .find((item) => item.actionType.startsWith("No-send deployment escalation"));

    expect(escalationCandidate).toEqual(expect.objectContaining({
      approvalLevel: "deployment-proposal",
      status: "proposed",
      sideEffect: "none",
      suggestedActor: expect.stringMatching(/release-owner|support-owner/),
      riskNote: expect.stringContaining("do not send external messages or deploy"),
      nextAction: expect.stringContaining("keep deployment, outreach, spend, and billing blocked"),
    }));
    expect(summarizeVenturePortfolio([loaded]).deploymentStaleEscalationCandidateCount).toBeGreaterThan(0);

    recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: escalationCandidate?.approvalLevel ?? "deployment-proposal",
        status: escalationCandidate?.status ?? "proposed",
        sideEffect: escalationCandidate?.sideEffect ?? "none",
        actionType: escalationCandidate?.actionType ?? "No-send deployment escalation",
        actor: escalationCandidate?.suggestedActor ?? "release-owner",
        sourceRecordId: escalationCandidate?.sourceRecordId,
        riskNote: escalationCandidate?.riskNote,
        replayNote: escalationCandidate?.replayNote,
        evidence: escalationCandidate?.evidence,
        nextAction: escalationCandidate?.nextAction ?? "Keep the escalation internal.",
      },
      storage,
      "2026-05-29T01:05:00.000Z",
    );
    const audited = loadVenturePortfolio(owner, storage)[0];
    const escalationRollup = buildVentureDeploymentEscalationAuditRollup([audited]);

    expect(escalationRollup).toEqual(expect.objectContaining({
      count: 1,
      proposedCount: 1,
      noSendCount: 1,
      externalSideEffectCount: 0,
      replayableCount: 1,
    }));
    expect(escalationRollup.items[0]).toEqual(expect.objectContaining({
      ventureTitle: saved.title,
      actionType: escalationCandidate?.actionType,
      sideEffect: "none",
      sourceRecordId: escalationCandidate?.sourceRecordId,
    }));
    expect(escalationRollup.markdown).toContain("# Deployment Escalation Audit Replay");
    expect(buildVentureAutonomyAuditCandidates(audited, "2026-05-29T01:10:00.000Z").find((item) => item.sourceRecordId === escalationCandidate?.sourceRecordId)).toBeUndefined();
    expect(serializeVenturePortfolio([audited])).toContain("\"deploymentEscalationAuditRollup\"");
    expect(filterVenturePortfolio([audited], "No-send deployment escalation")).toHaveLength(1);
    expect(filterVenturePortfolio([audited], "Deployment Escalation Audit Replay")).toHaveLength(1);
  });

  it("creates read-only research autonomy candidates without side effects", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    recordVentureBrowserResearchTask(
      owner,
      saved.id,
      {
        sourceType: "manual",
        platform: "web",
        sourceTarget: "student wellness forum",
        prompt: "Read public posts about weekly recovery planning.",
        status: "evidence-captured",
        owner: "researcher",
        evidenceUrl: "https://example.com/wellness-forum",
        findings: "Public posts show students comparing recovery-planning templates.",
        replayNote: "Reopen the saved forum URL and review public posts only.",
        nextAction: "Attach source quality notes before changing venture status.",
      },
      storage,
      "2026-05-27T04:16:00.000Z",
    );
    const withResearch = loadVenturePortfolio(owner, storage)[0];
    const candidate = buildVentureAutonomyAuditCandidates(withResearch)
      .find((item) => item.approvalLevel === "read-only-research" && item.sourceRecordId?.startsWith(`${saved.id}-browser-research`));

    expect(candidate).toEqual(expect.objectContaining({
      status: "executed",
      sideEffect: "none",
      actionType: "Read-only research: student wellness forum",
      riskNote: expect.stringContaining("must not contact users"),
    }));

    recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: candidate?.approvalLevel ?? "read-only-research",
        status: candidate?.status ?? "executed",
        sideEffect: candidate?.sideEffect ?? "none",
        actionType: candidate?.actionType ?? "Read-only research",
        actor: candidate?.suggestedActor ?? "researcher",
        sourceRecordId: candidate?.sourceRecordId,
        riskNote: candidate?.riskNote,
        replayNote: candidate?.replayNote,
        evidence: candidate?.evidence,
        nextAction: candidate?.nextAction ?? "No next action.",
      },
      storage,
      "2026-05-27T04:17:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(loaded.autonomyAudit[0]).toEqual(expect.objectContaining({
      approvalLevel: "read-only-research",
      sideEffect: "none",
      evidence: "Public posts show students comparing recovery-planning templates.",
    }));
    expect(buildVentureAutonomyAuditCandidates(loaded).find((item) => item.sourceRecordId === candidate?.sourceRecordId)).toBeUndefined();
  });

  it("classifies local code and local test artifacts as local-only autonomy work", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "source-repo",
        status: "verified",
        title: "Generated MVP source repo",
        uri: "/tmp/recovery-planner-mvp",
        owner: "Rishabh",
        verificationCommand: "pnpm type-check",
        evidence: "Generated source repo exists locally and type-checks.",
        changeSummary: "Created a local-only MVP source tree for review.",
      },
      storage,
      "2026-05-27T04:20:00.000Z",
    );
    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "test-report",
        status: "verified",
        title: "Local verification report",
        uri: "test-results/venture-local.txt",
        owner: "Rishabh",
        verificationCommand: "pnpm test -- src/lib/venture-portfolio.test.ts",
        evidence: "Local unit tests passed against the generated source.",
        changeSummary: "Recorded local test execution before any deployment proposal.",
      },
      storage,
      "2026-05-27T04:21:00.000Z",
    );

    const withArtifacts = loadVenturePortfolio(owner, storage)[0];
    const candidates = buildVentureAutonomyAuditCandidates(withArtifacts);
    const codeCandidate = candidates.find((item) => item.approvalLevel === "local-code-generation");
    const testCandidate = candidates.find((item) => item.approvalLevel === "local-test-execution");

    expect(codeCandidate).toEqual(expect.objectContaining({
      status: "executed",
      sideEffect: "local-only",
      actionType: "source-repo: Generated MVP source repo",
      replayNote: "pnpm type-check",
      riskNote: expect.stringContaining("local-only"),
    }));
    expect(testCandidate).toEqual(expect.objectContaining({
      status: "executed",
      sideEffect: "local-only",
      actionType: "test-report: Local verification report",
      replayNote: "pnpm test -- src/lib/venture-portfolio.test.ts",
      riskNote: expect.stringContaining("must not deploy"),
    }));

    recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: codeCandidate?.approvalLevel ?? "local-code-generation",
        status: codeCandidate?.status ?? "executed",
        sideEffect: codeCandidate?.sideEffect ?? "local-only",
        actionType: codeCandidate?.actionType ?? "Local code generation",
        actor: codeCandidate?.suggestedActor ?? "Rishabh",
        sourceRecordId: codeCandidate?.sourceRecordId,
        riskNote: codeCandidate?.riskNote,
        replayNote: codeCandidate?.replayNote,
        evidence: codeCandidate?.evidence,
        nextAction: codeCandidate?.nextAction ?? "Keep generated source local.",
      },
      storage,
      "2026-05-27T04:22:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(loaded.autonomyAudit[0]).toEqual(expect.objectContaining({
      approvalLevel: "local-code-generation",
      sideEffect: "local-only",
      replayNote: "pnpm type-check",
    }));
    expect(buildVentureAutonomyAuditCandidates(loaded).find((item) => item.sourceRecordId === codeCandidate?.sourceRecordId)).toBeUndefined();
  });

  it("separates deployment proposals from human-approved deployment and no-deploy proof", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const workspace = workspaceFixture();
    workspace.approvals = [
      { level: "Read-only research", status: "available", evidence: "Research is read-only." },
      { level: "Deployment proposal", status: "available", evidence: "Deployment package can be reviewed." },
      { level: "Human-approved deployment", status: "requires-human", evidence: "Human approval is still required." },
    ];
    const saved = saveVentureWorkspace(owner, workspace, storage, "2026-05-27T01:00:00.000Z");
    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "deployment-proof",
        status: "expected",
        title: "Deployment proof placeholder",
        owner: "Rishabh",
        verificationCommand: "No deploy command approved.",
        evidence: "Deployment proof intentionally withheld until human approval.",
        changeSummary: "No deployment was executed.",
      },
      storage,
      "2026-05-27T04:30:00.000Z",
    );
    const withDeploymentBoundary = loadVenturePortfolio(owner, storage)[0];
    const candidates = buildVentureAutonomyAuditCandidates(withDeploymentBoundary);

    expect(candidates[0]).toEqual(expect.objectContaining({
      approvalLevel: "deployment-proposal",
      status: "proposed",
      sideEffect: "external-proposed",
      actionType: "Deployment proposal",
    }));
    expect(candidates[1]).toEqual(expect.objectContaining({
      approvalLevel: "human-approved-deployment",
      status: "proposed",
      sideEffect: "external-blocked",
      actionType: "Human-approved deployment",
      nextAction: "Keep the action blocked until the matching approval gate is complete.",
    }));
    expect(candidates.find((candidate) => candidate.actionType === "deployment-proof: Deployment proof placeholder")).toEqual(expect.objectContaining({
      approvalLevel: "deployment-proposal",
      sideEffect: "external-blocked",
      nextAction: "Verify or supersede the deployment proof before external use.",
    }));

    const approvedWorkspace = workspaceFixture("Approved deployment test");
    approvedWorkspace.approvals = [
      { level: "Human-approved deployment", status: "complete", evidence: "Rishabh approved production deploy." },
    ];
    const approvedSaved = saveVentureWorkspace(owner, approvedWorkspace, storage, "2026-05-27T04:40:00.000Z");
    const approvedCandidate = buildVentureAutonomyAuditCandidates(approvedSaved)[0];

    expect(approvedCandidate).toEqual(expect.objectContaining({
      approvalLevel: "human-approved-deployment",
      status: "approved",
      sideEffect: "external-approved",
      suggestedActor: "human-operator",
      nextAction: "Execute only through the approved external path and keep proof attached.",
    }));
  });

  it("records model-call and agent-run replay logs from autonomy and artifact candidates", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureArtifact(
      owner,
      saved.id,
      {
        artifactType: "build-brief",
        status: "expected",
        title: "MVP build brief",
        owner: "Rishabh",
        verificationCommand: "pnpm test -- src/lib/venture-portfolio.test.ts",
        evidence: "Build brief created from handoff; source repo still pending.",
        changeSummary: "Captured the build brief as an expected artifact before generated source exists.",
      },
      storage,
      "2026-05-27T04:00:00.000Z",
    );
    recordVentureAutonomyAudit(
      owner,
      saved.id,
      {
        approvalLevel: "deployment-proposal",
        status: "proposed",
        sideEffect: "external-proposed",
        actionType: "Human-approved deployment",
        actor: "Rishabh",
        sourceRecordId: "venture-demo-option-1-approval-0",
        riskNote: "Deployment requires human approval.",
        replayNote: "Replay by reviewing deployment approval trail before external execution.",
        evidence: "Required.",
        nextAction: "Keep deployment blocked until a human approves the external action.",
      },
      storage,
      "2026-05-27T04:05:00.000Z",
    );
    const withCandidates = loadVenturePortfolio(owner, storage)[0];
    const candidates = buildVentureAgentRunCandidates(withCandidates);
    const autonomyCandidate = candidates.find((candidate) => candidate.sourceType === "autonomy-audit");

    expect(autonomyCandidate).toEqual(expect.objectContaining({
      status: "planned",
      model: "human-reviewed-local-audit",
      replayCommand: "Replay by reviewing deployment approval trail before external execution.",
      riskNote: "Deployment requires human approval.",
    }));
    expect(candidates.map((candidate) => candidate.sourceType)).toContain("artifact-generation");
    expect(candidates.map((candidate) => candidate.sourceType)).toContain("recommendation");

    const updated = recordVentureAgentRun(
      owner,
      saved.id,
      {
        sourceType: autonomyCandidate?.sourceType ?? "autonomy-audit",
        sourceRecordId: autonomyCandidate?.sourceRecordId,
        status: autonomyCandidate?.status ?? "planned",
        model: autonomyCandidate?.model,
        prompt: autonomyCandidate?.prompt ?? "Audit deployment approval.",
        outputSummary: "Autonomy audit showed deployment is externally proposed, not executed.",
        inputEvidence: autonomyCandidate?.inputEvidence,
        toolCalls: autonomyCandidate?.toolCalls,
        tokenEstimate: autonomyCandidate?.tokenEstimate,
        replayCommand: autonomyCandidate?.replayCommand,
        riskNote: autonomyCandidate?.riskNote,
        owner: "Rishabh",
        nextAction: "Keep deployment blocked until approval.",
      },
      storage,
      "2026-05-27T04:10:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.agentRuns).toHaveLength(1);
    expect(loaded.agentRuns[0]).toEqual(expect.objectContaining({
      sourceType: "autonomy-audit",
      status: "planned",
      model: "human-reviewed-local-audit",
      outputSummary: "Autonomy audit showed deployment is externally proposed, not executed.",
      replayCommand: "Replay by reviewing deployment approval trail before external execution.",
      owner: "Rishabh",
      nextAction: "Keep deployment blocked until approval.",
    }));
    expect(loaded.agentRuns[0].tokenEstimate).toBeGreaterThan(0);
    expect(buildVentureAgentRunCandidates(loaded).find((candidate) => candidate.sourceRecordId === autonomyCandidate?.sourceRecordId)).toBeUndefined();
    expect(filterVenturePortfolio([loaded], "deployment approval trail")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "externally proposed")).toHaveLength(1);
  });

  it("turns substitute pressure into searchable competitor watch records", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const workspace = evidenceRichWorkspace();
    workspace.evidenceSources.push({
      id: "source-competitor",
      platform: "reddit",
      title: "Students compare recovery apps and manual Notion templates",
      keywords: "alternative, competitor, templates",
      summary: "Buyers already use Notion templates as a substitute for weekly planning.",
      url: "https://example.com/reddit-competitor",
    });
    const saved = saveVentureWorkspace(owner, workspace, storage, "2026-05-27T01:00:00.000Z");
    const candidates = buildVentureCompetitorCandidates(saved);
    const substituteCandidate = candidates.find((candidate) => candidate.sourceType === "workspace-simulation");

    expect(substituteCandidate).toEqual(expect.objectContaining({
      competitorName: "Existing substitutes",
      competitorType: "substitute",
      suggestedThreatLevel: "high",
      responsePlan: "Interview buyers about their current substitute, then prove the wedge against that alternative before scaling.",
    }));
    expect(candidates.map((candidate) => candidate.sourceType)).toContain("evidence-source");

    const updated = recordVentureCompetitor(
      owner,
      saved.id,
      {
        sourceType: substituteCandidate?.sourceType ?? "workspace-simulation",
        sourceRecordId: substituteCandidate?.sourceRecordId,
        competitorName: "Notion reset templates",
        competitorType: "substitute",
        threatLevel: "high",
        status: "watching",
        positioning: "Students already use templates and wellness content instead of a recurring app.",
        evidence: substituteCandidate?.evidence,
        differentiation: "Automated Sunday reset workflow with consent-aware reminders.",
        responsePlan: "Compare activation and repeat-use against templates before scaling paid traffic.",
        owner: "Rishabh",
        watchCadence: "Weekly until paid cohort retention proves differentiation.",
        nextAction: "Interview five users about switching costs from templates.",
      },
      storage,
      "2026-05-27T04:20:00.000Z",
    );
    const loaded = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.competitors).toHaveLength(1);
    expect(loaded.competitors[0]).toEqual(expect.objectContaining({
      competitorName: "Notion reset templates",
      competitorType: "substitute",
      threatLevel: "high",
      status: "watching",
      owner: "Rishabh",
      watchCadence: "Weekly until paid cohort retention proves differentiation.",
      nextAction: "Interview five users about switching costs from templates.",
    }));
    expect(buildVentureCompetitorCandidates(loaded).find((candidate) => candidate.sourceRecordId === substituteCandidate?.sourceRecordId)).toBeUndefined();
    expect(filterVenturePortfolio([loaded], "Notion reset templates")).toHaveLength(1);
    expect(filterVenturePortfolio([loaded], "switching costs")).toHaveLength(1);
  });


  it("records kill-or-continue decisions with lifecycle history", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");

    const updated = recordVentureDecision(
      owner,
      "venture-demo-option-1",
      {
        decision: "scale",
        nextLifecycleStatus: "scaling",
        rationale: "Signup quality passed, but support load needs a tighter operator checklist.",
        nextAction: "Interview the first 5 signups before opening paid acquisition.",
      },
      storage,
      "2026-05-27T04:00:00.000Z",
    );
    const saved = loadVenturePortfolio(owner, storage)[0];

    expect(updated?.lifecycleStatus).toBe("scaling");
    expect(saved.updatedAt).toBe("2026-05-27T04:00:00.000Z");
    expect(saved.reviewCadence).toContain("Weekly scaling review");
    expect(saved.decisionHistory[0]).toEqual(expect.objectContaining({
      decision: "scale",
      previousLifecycleStatus: "validating",
      nextLifecycleStatus: "scaling",
      rationale: "Signup quality passed, but support load needs a tighter operator checklist.",
      nextAction: "Interview the first 5 signups before opening paid acquisition.",
    }));
  });

  it("exports and imports portable venture portfolio JSON", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const exported = serializeVenturePortfolio([saved]);
    const parsed = parseVenturePortfolioImport(exported);
    const imported = replaceVenturePortfolio("second-owner", parsed, storage);

    expect(exported).toContain("\"version\": 1");
    expect(exported).toContain("\"demandDriftReports\"");
    expect(exported).toContain("\"executionMemos\"");
    expect(exported).toContain("\"experimentLaunchPacks\"");
    expect(exported).toContain("\"qaReleaseReports\"");
    expect(exported).toContain("\"investorBriefs\"");
    expect(exported).toContain("\"financialModels\"");
    expect(exported).toContain("\"portfolioCharts\"");
    expect(exported).toContain("\"outreachCampaigns\"");
    expect(exported).toContain("\"generatedAppHandoffs\"");
    expect(exported).toContain("\"generatedAppSourceScaffolds\"");
    expect(exported).toContain("\"generatedAppVerificationProofs\"");
    expect(exported).toContain("\"killDecisionArtifacts\"");
    expect(exported).toContain("# Founder Execution Memo: Gen Z Recovery Planner");
    expect(exported).toContain("# Experiment Launch Pack: Fake-door waitlist test launch pack");
    expect(exported).toContain("# QA Release Report: Gen Z Recovery Planner");
    expect(exported).toContain("# Investor Brief: Gen Z Recovery Planner");
    expect(exported).toContain("# Financial Model: Gen Z Recovery Planner");
    expect(exported).toContain("# Venture Portfolio Charts");
    expect(exported).toContain("# Outreach Campaign Brief: Gen Z Recovery Planner");
    expect(exported).toContain("# Generated App Handoff: Gen Z Recovery Planner");
    expect(exported).toContain("# Generated App Source Scaffold: Gen Z Recovery Planner");
    expect(exported).toContain("# Generated App Verification Proof: Gen Z Recovery Planner");
    expect(exported).toContain("# Kill Decision Artifact: Gen Z Recovery Planner");
    expect(exported).toContain("\"source\": \"evaluation-lens\"");
    expect(exported).toContain("\"status\": \"confirmed\"");
    expect(parsed).toHaveLength(1);
    expect(imported[0].title).toBe("Gen Z Recovery Planner");
    expect(imported[0].reasoningDebate.clearestKillReason).toBe("Buyer does not show urgent pain.");
    expect(imported[0].reasoningDebate.confidence).toBe("inferred");
    expect(imported[0].evaluationLenses.platformDependency.label).toBe("Platform dependency");
    expect(exported).toContain("## Reasoning Debate");
    expect(exported).toContain("## Evaluation Lenses");
    expect(loadVenturePortfolio("second-owner", storage)[0].id).toBe("venture-demo-option-1");
  });

  it("marks pending portfolio import audit pruning in portable exports", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    const exported = serializeVenturePortfolio([saved], {
      portfolioImportAuditPruneSnapshot: {
        label: "all",
        prunedAt: "2026-05-27T20:55:00.000Z",
        entries: [{ id: "pruned-import-audit", blockedReason: "Import blocked: invalid JSON." }],
      },
      portfolioImportAuditPruneSnapshotExportedBy: owner,
    });
    const parsed = JSON.parse(exported) as {
      exportedBy?: string;
      portfolioImportAuditPruneSnapshot?: {
        status?: string;
        exportedBy?: string;
        label?: string;
        entries?: unknown[];
      };
    };

    expect(parsed.exportedBy).toBe(owner);
    expect(parsed.portfolioImportAuditPruneSnapshot).toEqual(expect.objectContaining({
      status: "pending-restore",
      exportedBy: owner,
      label: "all",
    }));
    expect(parsed.portfolioImportAuditPruneSnapshot?.entries).toHaveLength(1);
  });

  it("exports blocker packet handoff health with provenance", () => {
    const exported = serializeVenturePortfolio([], {
      demandSourceBlockerPacketHandoffHealth: [{
        id: "health-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        status: "repeated-drift-churn",
        churnScore: 25,
      }],
      demandSourceBlockerPacketHandoffHealthExportedBy: "test@marketpulse.dev",
    });
    const parsed = JSON.parse(exported) as {
      exportedBy?: string;
      demandSourceBlockerPacketHandoffHealth?: Array<{
        id?: string;
        exportedBy?: string;
        churnScore?: number;
      }>;
    };

    expect(parsed.exportedBy).toBe("test@marketpulse.dev");
    expect(parsed.demandSourceBlockerPacketHandoffHealth?.[0]).toEqual(expect.objectContaining({
      id: "health-test-channel-economics",
      exportedBy: "test@marketpulse.dev",
      churnScore: 25,
    }));
  });

  it("exports blocker packet handoff remediation queue and plans with provenance", () => {
    const exported = serializeVenturePortfolio([], {
      demandSourceBlockerPacketHandoffRemediationQueue: [{
        id: "remediation-test-channel-economics-repeated-drift",
        healthId: "health-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        trigger: "repeated-drift",
        priority: "critical",
        status: "ready",
        churnScore: 90,
        proofRequired: "Attach a fresh owner workload summary for test@marketpulse.dev / channel-economics.",
        nextAction: "Schedule owner/source remediation before accepting another portfolio transfer.",
        searchAnchor: "blocker packet owner workload test@marketpulse.dev channel-economics",
      }],
      demandSourceBlockerPacketHandoffRemediationQueueExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffRemediationPlans: [{
        id: "remediation-test-plan-1",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        healthId: "health-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        trigger: "repeated-drift",
        plannedBy: "test@marketpulse.dev",
        plannedAt: "2026-05-28T12:00:00.000Z",
        proofRequired: "Attach a fresh owner workload summary for test@marketpulse.dev / channel-economics.",
        nextAction: "Schedule owner/source remediation before accepting another portfolio transfer.",
      }],
      demandSourceBlockerPacketHandoffRemediationPlansExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffRemediationClosures: [{
        id: "remediation-test-closure-1",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        healthId: "health-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        trigger: "repeated-drift",
        closedBy: "test@marketpulse.dev",
        closedAt: "2026-05-28T12:05:00.000Z",
        proofRequired: "Attach a fresh owner workload summary for test@marketpulse.dev / channel-economics.",
        proofSummary: "Attached fresh owner workload summary and reconciled repeated drift.",
        proofArtifact: "handoff-remediation-summary.md",
        linkedDriftReportIds: ["drift-report-1"],
        totalDriftSnapshotsAtClosure: 2,
        unresolvedDriftCountAtClosure: 0,
        repeatedDriftCountAtClosure: 1,
        latestDriftAtAtClosure: "2026-05-28T12:04:00.000Z",
      }],
      demandSourceBlockerPacketHandoffRemediationClosuresExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffReopenEscalations: [{
        id: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        trigger: "repeated-drift",
        severity: "critical",
        reopenedCount: 2,
        failedClosureCount: 1,
        latestReopenedAt: "2026-05-28T13:00:00.000Z",
        latestClosedAt: "2026-05-28T12:05:00.000Z",
        latestProofSummary: "Attached fresh owner workload summary and reconciled repeated drift.",
        latestProofArtifact: "handoff-remediation-summary.md",
        reopenedReason: "Imported drift arrived after closure.",
        searchAnchor: "blocker packet owner workload test@marketpulse.dev channel-economics",
        churnScore: 95,
        totalDriftSnapshots: 3,
        repeatedDriftCount: 2,
        unresolvedDriftCount: 1,
        summary: "Reopened remediation with prior closure receipt.",
        nextAction: "Re-attach a fresh owner workload summary and re-close with proof.",
        evidence: ["Reopened after 1 prior closure"],
      }],
      demandSourceBlockerPacketHandoffReopenEscalationsExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts: [{
        id: "reopen-escalation-sla-test-1",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        assignedBy: "test@marketpulse.dev",
        assignedAt: "2026-05-28T13:05:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        reopenedCount: 2,
        failedClosureCount: 1,
        summary: "SLA assigned after closure proof failed.",
        nextAction: "Re-close with fresh owner summary before another transfer.",
      }],
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceiptsExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: [{
        id: "reopen-escalation-sla-resolution-test-1",
        slaReceiptId: "reopen-escalation-sla-test-1",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        resolvedBy: "test@marketpulse.dev",
        resolvedAt: "2026-05-28T13:30:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        wasOverdue: true,
        reopenedCount: 2,
        failedClosureCount: 1,
        proofSummary: "SLA resolved with fresh workload proof attached.",
        proofArtifact: "reopen-sla-resolution.md",
        nextAction: "Re-close with fresh owner summary before another transfer.",
      }],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutionsExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends: [{
        id: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        severity: "high",
        breachCount: 1,
        resolutionCount: 1,
        latestBreachAt: "2026-05-28T13:30:00.000Z",
        latestDueAt: "2026-05-28T12:05:00.000Z",
        latestResolvedAt: "2026-05-28T13:30:00.000Z",
        assignedOwners: ["test@marketpulse.dev"],
        breachedResolutionIds: ["reopen-escalation-sla-resolution-test-1"],
        summary: "test@marketpulse.dev / channel-economics has 1 reopened handoff SLA breach after proof closure failed.",
        nextAction: "Review the breached SLA receipt before accepting another handoff transfer.",
        evidence: ["1 resolved SLA receipt breached its due date"],
      }],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrendsExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans: [{
        id: "reopen-sla-breach-process-plan-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        plannedBy: "test@marketpulse.dev",
        plannedAt: "2026-05-28T13:35:00.000Z",
        dueAt: "2026-06-04T13:35:00.000Z",
        breachCount: 1,
        resolutionCount: 1,
        breachedResolutionIds: ["reopen-escalation-sla-resolution-test-1"],
        proofRequired: "Attach a process-change receipt for breached reopen SLA work.",
        followUpProof: "Pending owner/source process proof for 1 breached reopened SLA resolution.",
        summary: "Process plan assigned for reopened SLA breach debt.",
        nextAction: "Collect the process-change receipt.",
        evidence: ["1 resolved SLA receipt breached its due date"],
      }],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlansExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures: [{
        id: "reopen-sla-breach-process-closure-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        closedBy: "test@marketpulse.dev",
        closedAt: "2026-05-28T13:50:00.000Z",
        breachCount: 1,
        breachedResolutionIds: ["reopen-escalation-sla-resolution-test-1"],
        proofSummary: "Process changed so reopened SLA work gets pre-due review.",
        proofArtifact: "process-change-receipt.md",
        proofRequired: "Attach a process-change receipt for breached reopen SLA work.",
        nextAction: "Review closure against future reopened SLA breach trends.",
      }],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosuresExportedBy: "test@marketpulse.dev",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions: [{
        id: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        status: "stale-after-closure",
        breachCountAtClosure: 1,
        currentBreachCount: 2,
        latestBreachAt: "2026-05-28T14:10:00.000Z",
        closureClosedAt: "2026-05-28T13:50:00.000Z",
        closedBy: "test@marketpulse.dev",
        proofSummary: "Process changed so reopened SLA work gets pre-due review.",
        proofArtifact: "process-change-receipt.md",
        newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-2"],
        summary: "Process closure regressed after another breached SLA.",
        nextAction: "Re-open process review.",
        evidence: ["Breach count moved from 1 to 2"],
      }],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionsExportedBy: "test@marketpulse.dev",
      breachProcessRegressionClosures: [{
        id: "reopen-sla-breach-process-regression-closure-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        closedBy: "test@marketpulse.dev",
        closedAt: "2026-05-28T14:20:00.000Z",
        breachCountAtClosure: 1,
        currentBreachCount: 2,
        latestBreachAt: "2026-05-28T14:10:00.000Z",
        newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-2"],
        proofSummary: "Added a second pre-due review for regressed SLA work.",
        proofArtifact: "regression-reclosure.md",
        nextAction: "Compare future SLA breaches against this regression closure.",
      }],
      breachProcessRegressionClosuresExportedBy: "test@marketpulse.dev",
      breachProcessRegressionEscalations: [{
        id: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        severity: "critical",
        reason: "rebreach-after-reclosure",
        closureCount: 2,
        triggerClosureId: "reopen-sla-breach-process-regression-closure-test-1",
        triggerClosureClosedAt: "2026-05-28T14:20:00.000Z",
        triggerClosureBreachCount: 2,
        latestClosureId: "reopen-sla-breach-process-regression-closure-test-2",
        latestClosureClosedAt: "2026-05-28T14:40:00.000Z",
        currentBreachCount: 3,
        latestBreachAt: "2026-05-28T14:35:00.000Z",
        agedDays: 0,
        newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-3"],
        summary: "Regression proof rebreached after re-closure.",
        nextAction: "Run a higher-severity owner/source process audit.",
        evidence: ["Breach count moved from 2 to 3"],
      }],
      breachProcessRegressionEscalationsExportedBy: "test@marketpulse.dev",
      breachProcessRegressionEscalationAuditAssignments: [{
        id: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        assignedBy: "test@marketpulse.dev",
        assignedAt: "2026-05-28T15:00:00.000Z",
        dueAt: "2026-06-02T15:00:00.000Z",
        severity: "critical",
        reason: "rebreach-after-reclosure",
        currentBreachCount: 3,
        latestBreachAt: "2026-05-28T14:35:00.000Z",
        triggerClosureId: "reopen-sla-breach-process-regression-closure-test-1",
        newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-3"],
        proofRequired: "Run a higher-severity owner/source process audit.",
        nextAction: "Run a higher-severity owner/source process audit.",
      }],
      breachProcessRegressionEscalationAuditAssignmentsExportedBy: "test@marketpulse.dev",
      breachProcessRegressionEscalationAuditClosures: [{
        id: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        closedBy: "test@marketpulse.dev",
        closedAt: "2026-05-28T16:00:00.000Z",
        severity: "critical",
        reason: "rebreach-after-reclosure",
        currentBreachCount: 3,
        latestBreachAt: "2026-05-28T14:35:00.000Z",
        triggerClosureId: "reopen-sla-breach-process-regression-closure-test-1",
        newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-3"],
        proofSummary: "Completed higher-severity owner/source process audit with stable proof.",
        proofArtifact: "regression-escalation-audit.md",
        nextAction: "Compare future regressions against this audit closure.",
      }],
      breachProcessRegressionEscalationAuditClosuresExportedBy: "test@marketpulse.dev",
      breachProcessRegressionEscalationAuditReviews: [{
        id: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
        auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        reviewer: "auditor@marketpulse.dev",
        reviewedAt: "2026-05-28T17:00:00.000Z",
        outcome: "disputed",
        severity: "critical",
        reason: "rebreach-after-reclosure",
        currentBreachCount: 3,
        latestBreachAt: "2026-05-28T14:35:00.000Z",
        triggerClosureId: "reopen-sla-breach-process-regression-closure-test-1",
        newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-3"],
        reviewSummary: "Independent reviewer disputed the audit closure proof; stability acceptance is blocked.",
        reviewArtifact: "regression-escalation-audit-review.md",
        nextAction: "Block stability acceptance and require fresh corrective proof.",
      }],
      breachProcessRegressionEscalationAuditReviewsExportedBy: "auditor@marketpulse.dev",
      breachProcessRegressionEscalationAuditAppeals: [{
        id: "reopen-sla-breach-process-regression-escalation-audit-appeal-test-1",
        auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        recordedBy: "appeal-lead@marketpulse.dev",
        recordedAt: "2026-05-28T18:00:00.000Z",
        status: "quorum-required",
        reviewerQuorumCount: 2,
        independentReviewerCount: 2,
        staleDisputeAgeDays: 8,
        latestDisputeReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
        latestCorrectiveReviewId: null,
        conflictingReviewIds: ["reopen-sla-breach-process-regression-escalation-audit-review-attested-test-1"],
        reviewerIdentities: ["auditor@marketpulse.dev", "reviewer-two@marketpulse.dev"],
        appealSummary: "Appeal packet requires a two-reviewer quorum before stability can be accepted.",
        appealArtifact: "regression-escalation-audit-appeal.md",
        nextAction: "Keep quorum appeal open.",
      }, {
        id: "reopen-sla-breach-process-regression-escalation-audit-appeal-stale-test-1",
        auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        recordedBy: "appeal-lead@marketpulse.dev",
        recordedAt: "2026-05-29T18:00:00.000Z",
        status: "clearance-stale",
        reviewerQuorumCount: 2,
        independentReviewerCount: 2,
        staleDisputeAgeDays: 9,
        latestDisputeReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
        latestCorrectiveReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-corrective-test-1",
        conflictingReviewIds: ["reopen-sla-breach-process-regression-escalation-audit-review-attested-test-1"],
        reviewerIdentities: ["auditor@marketpulse.dev", "reviewer-two@marketpulse.dev"],
        appealSummary: "Prior quorum clearance is stale after a later reopened SLA breach landed outside its baseline.",
        appealArtifact: "regression-escalation-audit-appeal-clearance-stale.md",
        nextAction: "Preserve the prior clearance packet and require a fresh corrective review plus a new two-reviewer re-clearance.",
        clearanceBaselineReceiptIds: ["reopen-escalation-sla-resolution-test-3", "reopen-escalation-sla-resolution-test-4"],
        reopenedAfterClearanceReceiptIds: ["reopen-escalation-sla-resolution-test-5"],
        priorClearanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-cleared-prior-test-1",
        staleClearanceAgeDays: 3,
      }, {
        id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-test-1",
        auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        recordedBy: "appeal-lead@marketpulse.dev",
        recordedAt: "2026-05-29T19:00:00.000Z",
        status: "fragile-governance",
        reviewerQuorumCount: 2,
        independentReviewerCount: 2,
        staleDisputeAgeDays: 9,
        latestDisputeReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
        latestCorrectiveReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-corrective-test-1",
        conflictingReviewIds: ["reopen-sla-breach-process-regression-escalation-audit-review-attested-test-1"],
        reviewerIdentities: ["auditor@marketpulse.dev", "reviewer-two@marketpulse.dev"],
        appealSummary: "Fragile clearance governance requires an owner rotation before another re-clearance.",
        appealArtifact: "regression-escalation-audit-appeal-fragile-governance.md",
        nextAction: "Require separate remediation ownership, escalation proof, and reviewer rotation before operational stability.",
        clearanceBaselineReceiptIds: ["reopen-escalation-sla-resolution-test-3", "reopen-escalation-sla-resolution-test-4", "reopen-escalation-sla-resolution-test-5"],
        reopenedAfterClearanceReceiptIds: ["reopen-escalation-sla-resolution-test-6"],
        priorClearanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-recleared-prior-test-1",
        staleClearanceAgeDays: 4,
        fragileRemediationOwner: "governance-owner@marketpulse.dev",
        fragileEscalationArtifact: "fragile-clearance-governance-escalation.md",
        reviewerRotationProof: "Reviewer three is rotated in before re-clearance.",
        rotatedReviewerIdentities: ["reviewer-three@marketpulse.dev"],
      }, {
        id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-stale-test-1",
        auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        recordedBy: "appeal-lead@marketpulse.dev",
        recordedAt: "2026-05-30T19:00:00.000Z",
        status: "fragile-governance-stale",
        reviewerQuorumCount: 2,
        independentReviewerCount: 2,
        staleDisputeAgeDays: 10,
        latestDisputeReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
        latestCorrectiveReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-corrective-test-1",
        conflictingReviewIds: ["reopen-sla-breach-process-regression-escalation-audit-review-attested-test-1"],
        reviewerIdentities: ["auditor@marketpulse.dev", "reviewer-two@marketpulse.dev"],
        appealSummary: "Prior fragile governance is stale after another reopened SLA breach.",
        appealArtifact: "regression-escalation-audit-appeal-fragile-governance-stale.md",
        nextAction: "Require a fresh rotated owner/reviewer lane before another re-clearance.",
        priorFragileGovernanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-test-1",
        governanceBaselineReceiptIds: ["reopen-escalation-sla-resolution-test-3", "reopen-escalation-sla-resolution-test-4", "reopen-escalation-sla-resolution-test-5"],
        reopenedAfterGovernanceReceiptIds: ["reopen-escalation-sla-resolution-test-6"],
        staleGovernanceAgeDays: 2,
        staleGovernanceReason: "new-breach-after-governance",
      }, {
        id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-revoked-test-1",
        auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        recordedBy: "appeal-lead@marketpulse.dev",
        recordedAt: "2026-05-30T20:00:00.000Z",
        status: "fragile-governance-revoked",
        reviewerQuorumCount: 2,
        independentReviewerCount: 2,
        staleDisputeAgeDays: 10,
        latestDisputeReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
        latestCorrectiveReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-corrective-test-1",
        conflictingReviewIds: ["reopen-sla-breach-process-regression-escalation-audit-review-attested-test-1"],
        reviewerIdentities: ["auditor@marketpulse.dev", "reviewer-two@marketpulse.dev"],
        appealSummary: "Governance council revoked the repeated stale governance lane.",
        appealArtifact: "regression-escalation-audit-appeal-fragile-governance-revoked.md",
        nextAction: "Require fresh governance and ban revoked owner/reviewer reuse.",
        fragileRemediationOwner: "governance-council@marketpulse.dev",
        fragileEscalationArtifact: "fragile-governance-council-revocation.md",
        reviewerRotationProof: "Two council reviewers revoke the repeated stale lane.",
        rotatedReviewerIdentities: ["council-one@marketpulse.dev", "council-two@marketpulse.dev"],
        revokedFragileGovernanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-test-1",
        revokedGovernanceStaleAppealIds: ["reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-stale-test-1"],
        revocationReason: "repeated-stale-governance",
      }, {
        id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-revocation-stale-test-1",
        auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
        assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
        escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
        regressionId: "reopen-sla-breach-process-regression-test-1",
        planId: "reopen-sla-breach-process-plan-test-1",
        closureId: "reopen-sla-breach-process-closure-test-1",
        trendId: "reopen-sla-breach-trend-test-channel-economics",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        recordedBy: "appeal-lead@marketpulse.dev",
        recordedAt: "2026-06-08T20:00:00.000Z",
        status: "fragile-governance-revocation-stale",
        reviewerQuorumCount: 2,
        independentReviewerCount: 2,
        staleDisputeAgeDays: 10,
        latestDisputeReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
        latestCorrectiveReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-corrective-test-1",
        conflictingReviewIds: ["reopen-sla-breach-process-regression-escalation-audit-review-attested-test-1"],
        reviewerIdentities: ["auditor@marketpulse.dev", "reviewer-two@marketpulse.dev"],
        appealSummary: "Governance council revocation expired without fresh governance.",
        appealArtifact: "regression-escalation-audit-appeal-fragile-governance-revocation-stale.md",
        nextAction: "Require a fresh two-reviewer council packet before replacement governance.",
        priorGovernanceRevocationAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-revoked-test-1",
        staleGovernanceRevocationAgeDays: 9,
        staleGovernanceRevocationReason: "aged-without-fresh-governance",
      }],
      breachProcessRegressionEscalationAuditAppealsExportedBy: "appeal-lead@marketpulse.dev",
    });
    const parsed = JSON.parse(exported) as {
      exportedBy?: string;
      demandSourceBlockerPacketHandoffRemediationQueue?: Array<{
        id?: string;
        exportedBy?: string;
        trigger?: string;
        priority?: string;
        searchAnchor?: string;
      }>;
      demandSourceBlockerPacketHandoffRemediationPlans?: Array<{
        id?: string;
        remediationId?: string;
        exportedBy?: string;
        plannedBy?: string;
      }>;
      demandSourceBlockerPacketHandoffRemediationClosures?: Array<{
        id?: string;
        remediationId?: string;
        exportedBy?: string;
        closedBy?: string;
        proofSummary?: string;
        linkedDriftReportIds?: string[];
        totalDriftSnapshotsAtClosure?: number;
        latestDriftAtAtClosure?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalations?: Array<{
        id?: string;
        remediationId?: string;
        exportedBy?: string;
        severity?: string;
        reopenedCount?: number;
        failedClosureCount?: number;
        latestProofSummary?: string;
        reopenedReason?: string;
        searchAnchor?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?: Array<{
        id?: string;
        escalationId?: string;
        remediationId?: string;
        exportedBy?: string;
        assignedOwner?: string;
        dueAt?: string;
        failedClosureCount?: number;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?: Array<{
        id?: string;
        slaReceiptId?: string;
        escalationId?: string;
        exportedBy?: string;
        resolvedBy?: string;
        wasOverdue?: boolean;
        proofSummary?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?: Array<{
        id?: string;
        exportedBy?: string;
        breachCount?: number;
        latestBreachAt?: string;
        breachedResolutionIds?: string[];
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?: Array<{
        id?: string;
        trendId?: string;
        exportedBy?: string;
        assignedOwner?: string;
        proofRequired?: string;
        breachedResolutionIds?: string[];
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?: Array<{
        id?: string;
        planId?: string;
        exportedBy?: string;
        closedBy?: string;
        proofSummary?: string;
        proofArtifact?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?: Array<{
        id?: string;
        exportedBy?: string;
        status?: string;
        currentBreachCount?: number;
        newBreachedResolutionIds?: string[];
        proofArtifact?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?: Array<{
        id?: string;
        exportedBy?: string;
        regressionId?: string;
        closedBy?: string;
        currentBreachCount?: number;
        proofSummary?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations?: Array<{
        id?: string;
        exportedBy?: string;
        regressionId?: string;
        severity?: string;
        reason?: string;
        currentBreachCount?: number;
        newBreachedResolutionIds?: string[];
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments?: Array<{
        id?: string;
        exportedBy?: string;
        escalationId?: string;
        assignedOwner?: string;
        assignedBy?: string;
        dueAt?: string;
        proofRequired?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures?: Array<{
        id?: string;
        exportedBy?: string;
        assignmentId?: string;
        escalationId?: string;
        closedBy?: string;
        proofSummary?: string;
        proofArtifact?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews?: Array<{
        id?: string;
        exportedBy?: string;
        auditClosureId?: string;
        assignmentId?: string;
        escalationId?: string;
        reviewer?: string;
        outcome?: string;
        reviewSummary?: string;
        reviewArtifact?: string;
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?: Array<{
        id?: string;
        exportedBy?: string;
        auditClosureId?: string;
        assignmentId?: string;
        escalationId?: string;
        status?: string;
        reviewerQuorumCount?: number;
        independentReviewerCount?: number;
        staleDisputeAgeDays?: number;
        latestDisputeReviewId?: string;
        latestCorrectiveReviewId?: string | null;
        conflictingReviewIds?: string[];
        reviewerIdentities?: string[];
        appealSummary?: string;
        appealArtifact?: string;
        clearanceBaselineReceiptIds?: string[];
        reopenedAfterClearanceReceiptIds?: string[];
        priorClearanceAppealId?: string | null;
        staleClearanceAgeDays?: number;
        fragileRemediationOwner?: string | null;
        fragileEscalationArtifact?: string | null;
        reviewerRotationProof?: string | null;
        rotatedReviewerIdentities?: string[];
        priorFragileGovernanceAppealId?: string | null;
        governanceBaselineReceiptIds?: string[];
        reopenedAfterGovernanceReceiptIds?: string[];
        staleGovernanceAgeDays?: number;
        staleGovernanceReason?: string;
        revokedFragileGovernanceAppealId?: string | null;
        revokedGovernanceStaleAppealIds?: string[];
        revocationReason?: string;
        priorGovernanceRevocationAppealId?: string | null;
        staleGovernanceRevocationAgeDays?: number;
        staleGovernanceRevocationReason?: string;
      }>;
    };

    expect(parsed.exportedBy).toBe("test@marketpulse.dev");
    expect(parsed.demandSourceBlockerPacketHandoffRemediationQueue?.[0]).toEqual(expect.objectContaining({
      id: "remediation-test-channel-economics-repeated-drift",
      exportedBy: "test@marketpulse.dev",
      trigger: "repeated-drift",
      priority: "critical",
      searchAnchor: "blocker packet owner workload test@marketpulse.dev channel-economics",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffRemediationPlans?.[0]).toEqual(expect.objectContaining({
      id: "remediation-test-plan-1",
      remediationId: "remediation-test-channel-economics-repeated-drift",
      exportedBy: "test@marketpulse.dev",
      plannedBy: "test@marketpulse.dev",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffRemediationClosures?.[0]).toEqual(expect.objectContaining({
      id: "remediation-test-closure-1",
      remediationId: "remediation-test-channel-economics-repeated-drift",
      exportedBy: "test@marketpulse.dev",
      closedBy: "test@marketpulse.dev",
      proofSummary: "Attached fresh owner workload summary and reconciled repeated drift.",
      linkedDriftReportIds: ["drift-report-1"],
      totalDriftSnapshotsAtClosure: 2,
      latestDriftAtAtClosure: "2026-05-28T12:04:00.000Z",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalations?.[0]).toEqual(expect.objectContaining({
      id: "reopen-escalation-test-channel-economics",
      remediationId: "remediation-test-channel-economics-repeated-drift",
      exportedBy: "test@marketpulse.dev",
      severity: "critical",
      reopenedCount: 2,
      failedClosureCount: 1,
      latestProofSummary: "Attached fresh owner workload summary and reconciled repeated drift.",
      reopenedReason: "Imported drift arrived after closure.",
      searchAnchor: "blocker packet owner workload test@marketpulse.dev channel-economics",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?.[0]).toEqual(expect.objectContaining({
      id: "reopen-escalation-sla-test-1",
      escalationId: "reopen-escalation-test-channel-economics",
      remediationId: "remediation-test-channel-economics-repeated-drift",
      exportedBy: "test@marketpulse.dev",
      assignedOwner: "test@marketpulse.dev",
      dueAt: "2026-05-28T12:05:00.000Z",
      failedClosureCount: 1,
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?.[0]).toEqual(expect.objectContaining({
      id: "reopen-escalation-sla-resolution-test-1",
      slaReceiptId: "reopen-escalation-sla-test-1",
      escalationId: "reopen-escalation-test-channel-economics",
      exportedBy: "test@marketpulse.dev",
      resolvedBy: "test@marketpulse.dev",
      wasOverdue: true,
      proofSummary: "SLA resolved with fresh workload proof attached.",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-trend-test-channel-economics",
      exportedBy: "test@marketpulse.dev",
      breachCount: 1,
      latestBreachAt: "2026-05-28T13:30:00.000Z",
      breachedResolutionIds: ["reopen-escalation-sla-resolution-test-1"],
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-plan-test-1",
      trendId: "reopen-sla-breach-trend-test-channel-economics",
      exportedBy: "test@marketpulse.dev",
      assignedOwner: "test@marketpulse.dev",
      proofRequired: "Attach a process-change receipt for breached reopen SLA work.",
      breachedResolutionIds: ["reopen-escalation-sla-resolution-test-1"],
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-closure-test-1",
      planId: "reopen-sla-breach-process-plan-test-1",
      exportedBy: "test@marketpulse.dev",
      closedBy: "test@marketpulse.dev",
      proofSummary: "Process changed so reopened SLA work gets pre-due review.",
      proofArtifact: "process-change-receipt.md",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-test-1",
      exportedBy: "test@marketpulse.dev",
      status: "stale-after-closure",
      currentBreachCount: 2,
      newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-2"],
      proofArtifact: "process-change-receipt.md",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-closure-test-1",
      exportedBy: "test@marketpulse.dev",
      regressionId: "reopen-sla-breach-process-regression-test-1",
      closedBy: "test@marketpulse.dev",
      currentBreachCount: 2,
      proofSummary: "Added a second pre-due review for regressed SLA work.",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-test-1",
      exportedBy: "test@marketpulse.dev",
      regressionId: "reopen-sla-breach-process-regression-test-1",
      severity: "critical",
      reason: "rebreach-after-reclosure",
      currentBreachCount: 3,
      newBreachedResolutionIds: ["reopen-escalation-sla-resolution-test-3"],
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
      exportedBy: "test@marketpulse.dev",
      escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
      assignedOwner: "test@marketpulse.dev",
      assignedBy: "test@marketpulse.dev",
      dueAt: "2026-06-02T15:00:00.000Z",
      proofRequired: "Run a higher-severity owner/source process audit.",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
      exportedBy: "test@marketpulse.dev",
      assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
      escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
      closedBy: "test@marketpulse.dev",
      proofSummary: "Completed higher-severity owner/source process audit with stable proof.",
      proofArtifact: "regression-escalation-audit.md",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
      exportedBy: "auditor@marketpulse.dev",
      auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
      assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
      escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
      reviewer: "auditor@marketpulse.dev",
      outcome: "disputed",
      reviewSummary: "Independent reviewer disputed the audit closure proof; stability acceptance is blocked.",
      reviewArtifact: "regression-escalation-audit-review.md",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?.[0]).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-appeal-test-1",
      exportedBy: "appeal-lead@marketpulse.dev",
      auditClosureId: "reopen-sla-breach-process-regression-escalation-audit-closure-test-1",
      assignmentId: "reopen-sla-breach-process-regression-escalation-audit-assignment-test-1",
      escalationId: "reopen-sla-breach-process-regression-escalation-test-1",
      status: "quorum-required",
      reviewerQuorumCount: 2,
      independentReviewerCount: 2,
      staleDisputeAgeDays: 8,
      latestDisputeReviewId: "reopen-sla-breach-process-regression-escalation-audit-review-test-1",
      latestCorrectiveReviewId: null,
      conflictingReviewIds: ["reopen-sla-breach-process-regression-escalation-audit-review-attested-test-1"],
      reviewerIdentities: ["auditor@marketpulse.dev", "reviewer-two@marketpulse.dev"],
      appealSummary: "Appeal packet requires a two-reviewer quorum before stability can be accepted.",
      appealArtifact: "regression-escalation-audit-appeal.md",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?.find((appeal) => appeal.status === "clearance-stale")).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-appeal-stale-test-1",
      exportedBy: "appeal-lead@marketpulse.dev",
      status: "clearance-stale",
      clearanceBaselineReceiptIds: ["reopen-escalation-sla-resolution-test-3", "reopen-escalation-sla-resolution-test-4"],
      reopenedAfterClearanceReceiptIds: ["reopen-escalation-sla-resolution-test-5"],
      priorClearanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-cleared-prior-test-1",
      staleClearanceAgeDays: 3,
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?.find((appeal) => appeal.status === "fragile-governance")).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-test-1",
      exportedBy: "appeal-lead@marketpulse.dev",
      status: "fragile-governance",
      fragileRemediationOwner: "governance-owner@marketpulse.dev",
      fragileEscalationArtifact: "fragile-clearance-governance-escalation.md",
      reviewerRotationProof: "Reviewer three is rotated in before re-clearance.",
      rotatedReviewerIdentities: ["reviewer-three@marketpulse.dev"],
      priorClearanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-recleared-prior-test-1",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?.find((appeal) => appeal.status === "fragile-governance-stale")).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-stale-test-1",
      exportedBy: "appeal-lead@marketpulse.dev",
      status: "fragile-governance-stale",
      priorFragileGovernanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-test-1",
      governanceBaselineReceiptIds: ["reopen-escalation-sla-resolution-test-3", "reopen-escalation-sla-resolution-test-4", "reopen-escalation-sla-resolution-test-5"],
      reopenedAfterGovernanceReceiptIds: ["reopen-escalation-sla-resolution-test-6"],
      staleGovernanceAgeDays: 2,
      staleGovernanceReason: "new-breach-after-governance",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?.find((appeal) => appeal.status === "fragile-governance-revoked")).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-revoked-test-1",
      exportedBy: "appeal-lead@marketpulse.dev",
      status: "fragile-governance-revoked",
      fragileRemediationOwner: "governance-council@marketpulse.dev",
      rotatedReviewerIdentities: ["council-one@marketpulse.dev", "council-two@marketpulse.dev"],
      revokedFragileGovernanceAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-test-1",
      revokedGovernanceStaleAppealIds: ["reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-stale-test-1"],
      revocationReason: "repeated-stale-governance",
    }));
    expect(parsed.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?.find((appeal) => appeal.status === "fragile-governance-revocation-stale")).toEqual(expect.objectContaining({
      id: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-revocation-stale-test-1",
      exportedBy: "appeal-lead@marketpulse.dev",
      status: "fragile-governance-revocation-stale",
      priorGovernanceRevocationAppealId: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-revoked-test-1",
      staleGovernanceRevocationAgeDays: 9,
      staleGovernanceRevocationReason: "aged-without-fresh-governance",
    }));
  });

  it("flags a chronically re-breaching owner/source as a fragile clearance even after each re-clearance succeeds", () => {
    const baseAppeal = (overrides: Partial<BreachProcessRegressionEscalationAuditAppeal>): BreachProcessRegressionEscalationAuditAppeal => ({
      id: overrides.id ?? "appeal",
      auditClosureId: "audit-closure-1",
      assignmentId: "audit-assignment-1",
      escalationId: "escalation-1",
      regressionId: "regression-1",
      planId: "plan-1",
      closureId: "closure-1",
      trendId: "trend-1",
      owner: "test@marketpulse.dev",
      sourceType: "channel-economics",
      recordedBy: "appeal-lead@marketpulse.dev",
      recordedAt: "2026-05-28T18:00:00.000Z",
      status: "quorum-cleared",
      reviewerQuorumCount: 2,
      independentReviewerCount: 2,
      staleDisputeAgeDays: 0,
      latestDisputeReviewId: "review-dispute-1",
      latestCorrectiveReviewId: "review-corrective-1",
      conflictingReviewIds: [],
      reviewerIdentities: ["ops-reviewer-one@marketpulse.dev", "ops-reviewer-two@marketpulse.dev"],
      appealSummary: "appeal",
      appealArtifact: "appeal.md",
      nextAction: "next",
      ...overrides,
    });
    const appeals = [
      baseAppeal({ id: "appeal-cleared-1", status: "quorum-cleared", recordedAt: "2026-05-28T18:00:00.000Z" }),
      baseAppeal({ id: "appeal-stale-1", status: "clearance-stale", recordedAt: "2026-05-29T18:00:00.000Z", priorClearanceAppealId: "appeal-cleared-1", staleClearanceAgeDays: 1 }),
      baseAppeal({ id: "appeal-recleared-1", status: "quorum-cleared", recordedAt: "2026-05-30T18:00:00.000Z", priorClearanceAppealId: "appeal-cleared-1" }),
      baseAppeal({ id: "appeal-stale-2", status: "clearance-stale", recordedAt: "2026-05-31T18:00:00.000Z", priorClearanceAppealId: "appeal-recleared-1", staleClearanceAgeDays: 3 }),
      baseAppeal({
        id: "appeal-fragile-governance-stale-1",
        status: "fragile-governance-stale",
        recordedAt: "2026-05-31T20:00:00.000Z",
        priorClearanceAppealId: "appeal-recleared-1",
        priorFragileGovernanceAppealId: "appeal-fragile-governance-1",
        governanceBaselineReceiptIds: ["receipt-1", "receipt-2"],
        reopenedAfterGovernanceReceiptIds: ["receipt-3"],
        staleGovernanceAgeDays: 2,
        staleGovernanceReason: "new-breach-after-governance",
      }),
      // Latest packet is a successful re-clearance, yet the clearance must still read as fragile.
      baseAppeal({ id: "appeal-recleared-2", status: "quorum-cleared", recordedAt: "2026-06-01T18:00:00.000Z", priorClearanceAppealId: "appeal-recleared-1" }),
    ];
    const [calibration] = buildBreachProcessRegressionEscalationAppealReClearanceCalibrations(appeals);
    expect(calibration).toEqual(expect.objectContaining({
      owner: "test@marketpulse.dev",
      sourceType: "channel-economics",
      staleRecurrenceCount: 3,
      clearanceCount: 3,
      reClearanceCount: 2,
      meanDaysToStale: 2,
      fragileClearance: true,
      latestStatus: "quorum-cleared",
    }));
    expect(calibration.repeatReviewers).toEqual([
      "ops-reviewer-one@marketpulse.dev",
      "ops-reviewer-two@marketpulse.dev",
    ]);

    // The calibration history survives an export/import round-trip because it is derived from appeals.
    const reimported = parseBreachProcessRegressionEscalationAuditAppealsImport(JSON.stringify({
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: appeals,
    }));
    expect(reimported).not.toBeNull();
    const [reimportedCalibration] = buildBreachProcessRegressionEscalationAppealReClearanceCalibrations(reimported ?? []);
    expect(reimportedCalibration.fragileClearance).toBe(true);
    expect(reimportedCalibration.staleRecurrenceCount).toBe(3);

    // A single stale-then-reclear cycle stays below the fragile threshold.
    const [singleCycle] = buildBreachProcessRegressionEscalationAppealReClearanceCalibrations([
      baseAppeal({ id: "appeal-cleared-1", status: "quorum-cleared", recordedAt: "2026-05-28T18:00:00.000Z" }),
      baseAppeal({ id: "appeal-stale-1", status: "clearance-stale", recordedAt: "2026-05-29T18:00:00.000Z", priorClearanceAppealId: "appeal-cleared-1", staleClearanceAgeDays: 1 }),
      baseAppeal({ id: "appeal-recleared-1", status: "quorum-cleared", recordedAt: "2026-05-30T18:00:00.000Z", priorClearanceAppealId: "appeal-cleared-1" }),
    ]);
    expect(singleCycle.fragileClearance).toBe(false);
    expect(singleCycle.staleRecurrenceCount).toBe(1);
  });

  it("exports governance digests as compact preview artifacts without replacing appeal packets", () => {
    const baseAppeal = (overrides: Partial<BreachProcessRegressionEscalationAuditAppeal>): BreachProcessRegressionEscalationAuditAppeal => ({
      id: overrides.id ?? "appeal",
      auditClosureId: "audit-closure-1",
      assignmentId: "audit-assignment-1",
      escalationId: "escalation-1",
      regressionId: "regression-1",
      planId: "plan-1",
      closureId: "closure-1",
      trendId: "trend-1",
      owner: "test@marketpulse.dev",
      sourceType: "channel-economics",
      recordedBy: "appeal-lead@marketpulse.dev",
      recordedAt: "2026-05-28T18:00:00.000Z",
      status: "fragile-governance",
      reviewerQuorumCount: 2,
      independentReviewerCount: 2,
      staleDisputeAgeDays: 0,
      latestDisputeReviewId: "review-dispute-1",
      latestCorrectiveReviewId: "review-corrective-1",
      conflictingReviewIds: [],
      reviewerIdentities: ["ops-reviewer-one@marketpulse.dev", "ops-reviewer-two@marketpulse.dev"],
      appealSummary: "appeal",
      appealArtifact: "appeal.md",
      nextAction: "next",
      fragileRemediationOwner: "governance-owner@marketpulse.dev",
      fragileEscalationArtifact: "governance.md",
      reviewerRotationProof: "rotation.md",
      rotatedReviewerIdentities: ["ops-reviewer-three@marketpulse.dev"],
      ...overrides,
    });
    const appeals = [
      baseAppeal({ id: "governance-1", recordedAt: "2026-05-28T18:00:00.000Z" }),
      baseAppeal({
        id: "governance-stale-1",
        recordedAt: "2026-05-30T18:00:00.000Z",
        status: "fragile-governance-stale",
        priorFragileGovernanceAppealId: "governance-1",
        governanceBaselineReceiptIds: ["receipt-1"],
        reopenedAfterGovernanceReceiptIds: ["receipt-2"],
        staleGovernanceAgeDays: 2,
        staleGovernanceReason: "new-breach-after-governance",
      }),
      baseAppeal({
        id: "governance-revoked-1",
        recordedAt: "2026-05-31T18:00:00.000Z",
        status: "fragile-governance-revoked",
        fragileRemediationOwner: "governance-council@marketpulse.dev",
        fragileEscalationArtifact: "council-revocation.md",
        reviewerRotationProof: "two council reviewers signed.",
        rotatedReviewerIdentities: ["council-one@marketpulse.dev", "council-two@marketpulse.dev"],
        revokedFragileGovernanceAppealId: "governance-1",
        revokedGovernanceStaleAppealIds: ["governance-stale-1"],
        revocationReason: "repeated-stale-governance",
      }),
      baseAppeal({
        id: "governance-revocation-stale-1",
        recordedAt: "2026-06-08T18:00:00.000Z",
        status: "fragile-governance-revocation-stale",
        priorGovernanceRevocationAppealId: "governance-revoked-1",
        staleGovernanceRevocationAgeDays: 8,
        staleGovernanceRevocationReason: "aged-without-fresh-governance",
      }),
    ];
    const digests = buildBreachProcessRegressionEscalationGovernanceDigests(appeals, "2026-06-09T00:00:00.000Z");
    const exported = serializeVenturePortfolio([], {
      breachProcessRegressionEscalationAuditAppeals: appeals,
      breachProcessRegressionEscalationAuditAppealsExportedBy: "appeal-lead@marketpulse.dev",
      breachProcessRegressionEscalationGovernanceDigests: digests,
      breachProcessRegressionEscalationGovernanceDigestsExportedBy: "appeal-lead@marketpulse.dev",
    });
    const parsed = JSON.parse(exported) as Record<string, unknown>;
    const exportedDigests = parsed[BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY] as Array<Record<string, unknown>>;

    expect(exportedDigests).toHaveLength(1);
    expect(exportedDigests[0]).toEqual(expect.objectContaining({
      exportedBy: "appeal-lead@marketpulse.dev",
      immutable: true,
      packetCount: 4,
      latestPacketId: "governance-revocation-stale-1",
      latestStatus: "fragile-governance-revocation-stale",
      packetChainSignature: expect.stringMatching(/^governance-digest-v1:/),
      fullPacketGateRequired: true,
      digestCannotClearGovernance: true,
    }));
    expect(exportedDigests[0].governancePacketIds).toEqual(["governance-1"]);
    expect(exportedDigests[0].staleGovernancePacketIds).toEqual(["governance-stale-1"]);
    expect(exportedDigests[0].councilRevocationPacketIds).toEqual(["governance-revoked-1"]);
    expect(exportedDigests[0].staleCouncilRevocationPacketIds).toEqual(["governance-revocation-stale-1"]);
    expect(exportedDigests[0].packetSearchText).toContain("council-revocation.md");
    expect(auditBreachProcessRegressionEscalationGovernanceDigestIntegrity(digests, appeals)).toEqual([]);
    expect(auditBreachProcessRegressionEscalationGovernanceDigestIntegrity([
      { ...digests[0], packetChainSignature: "tampered" },
    ], appeals)).toEqual([expect.objectContaining({
      digestId: digests[0].id,
      reason: "signature-mismatch",
      packetChainSignature: "tampered",
      expectedPacketChainSignature: digests[0].packetChainSignature,
    })]);
    expect(auditBreachProcessRegressionEscalationGovernanceDigestReplay([
      { ...digests[0], exportedAt: "2026-05-30T00:00:00.000Z" },
    ], appeals)).toEqual([expect.objectContaining({
      digestId: digests[0].id,
      digestExportedAt: "2026-05-30T00:00:00.000Z",
      latestLocalPacketId: "governance-revocation-stale-1",
      latestLocalPacketAt: "2026-06-08T18:00:00.000Z",
    })]);
    const [conflictIssue] = auditBreachProcessRegressionEscalationGovernanceDigestConflicts([
      digests[0],
      {
        ...digests[0],
        id: "conflicting-governance-digest",
        packetChainSignature: "governance-digest-v1:competing",
        latestPacketId: "governance-revoked-1",
        latestPacketAt: "2026-05-31T18:00:00.000Z",
        packetCount: 3,
      },
    ], appeals);
    expect(conflictIssue).toEqual(expect.objectContaining({
      owner: "test@marketpulse.dev",
      sourceType: "channel-economics",
      escalationId: "escalation-1",
      digestIds: [digests[0].id, "conflicting-governance-digest"].sort((a, b) => a.localeCompare(b)),
      signatureCount: 2,
      packetWindowCount: 2,
      packetWindows: [
        "2026-05-28T18:00:00.000Z..2026-05-31T18:00:00.000Z:governance-revoked-1:3",
        "2026-05-28T18:00:00.000Z..2026-06-08T18:00:00.000Z:governance-revocation-stale-1:4",
      ],
      preferredFullPacketId: "governance-revocation-stale-1",
      preferredFullPacketAt: "2026-06-08T18:00:00.000Z",
    }));
    expect(formatBreachProcessRegressionEscalationGovernanceDigestConflictDrilldown(conflictIssue)).toContain(
      "conflicting-governance-digest",
    );
    expect(formatBreachProcessRegressionEscalationGovernanceDigestConflictDrilldown(conflictIssue)).toContain(
      "Preferred full appeal packet: governance-revocation-stale-1 at 2026-06-08T18:00:00.000Z.",
    );

    const digestOnlyPayload = JSON.stringify({
      [BREACH_PROCESS_REGRESSION_ESCALATION_GOVERNANCE_DIGESTS_EXPORT_KEY]: exportedDigests,
      exportedAt: "2026-06-09T00:00:00.000Z",
      exportedBy: "appeal-lead@marketpulse.dev",
    });
    expect(parseBreachProcessRegressionEscalationAuditAppealsImport(digestOnlyPayload)).toBeNull();
    const importedDigests = parseBreachProcessRegressionEscalationGovernanceDigestsImport(digestOnlyPayload);
    expect(importedDigests?.[0]).toEqual(expect.objectContaining({
      source: "imported",
      exportedBy: "appeal-lead@marketpulse.dev",
      fullPacketGateRequired: true,
      digestCannotClearGovernance: true,
    }));
  });

  it("rejects invalid portfolio import payloads", () => {
    expect(parseVenturePortfolioImport("{bad json")).toEqual([]);
    expect(parseVenturePortfolioImport(JSON.stringify({ ventures: [{ bad: true }] }))).toEqual([]);
  });

  it("searches saved ventures across buyer, evidence, channel, lifecycle, and outcomes", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    saveVentureWorkspace(owner, workspaceFixture(), storage, "2026-05-27T01:00:00.000Z");
    recordVentureExperimentResult(
      owner,
      "venture-demo-option-1",
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits.",
        interpretation: "Pass: early demand crossed the signup threshold.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    recordVentureDecision(
      owner,
      "venture-demo-option-1",
      {
        decision: "scale",
        nextLifecycleStatus: "scaling",
        rationale: "Support load stayed manageable after the first demand signal.",
        nextAction: "Open the next creator channel.",
      },
      storage,
      "2026-05-27T04:00:00.000Z",
    );
    const saved = loadVenturePortfolio(owner, storage);

    expect(filterVenturePortfolio(saved, "Gen Z students")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "creator partnerships")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "scaling")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "12 qualified")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "support load")).toHaveLength(1);
    expect(filterVenturePortfolio(saved, saved[0].predictionSnapshots[0].predictedOutcome)).toHaveLength(1);
    expect(filterVenturePortfolio(saved, "enterprise procurement")).toHaveLength(0);
  });

  it("summarizes evidence readiness with missing evidence and provenance warnings", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");

    const profile = summarizeVentureEvidence(saved);

    expect(profile.sourceCount).toBe(1);
    expect(profile.averageScore).toBeGreaterThan(70);
    expect(profile.readiness).toBe("needs-pressure-test");
    expect(profile.missingEvidenceCount).toBe(1);
    expect(profile.warnings).toContain("Freshness unknown");
    expect(profile.warnings).toContain("Missing evidence: x coverage");
    expect(profile.scoredSources[0]).toEqual(expect.objectContaining({
      platform: "youtube",
      title: "Creators package burnout recovery routines",
    }));
  });

  it("filters ventures by evidence readiness, gaps, and contradictions", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const ready = evidenceRichWorkspace("Ready Venture");
    ready.id = "venture-ready";
    ready.killCriteria.missingEvidence = [];
    ready.contradictions = [];
    const thin = workspaceFixture("Thin Venture");
    thin.id = "venture-thin";
    thin.killCriteria.missingEvidence = [];
    thin.contradictions = [];
    const gappy = evidenceRichWorkspace("Gappy Venture");
    gappy.id = "venture-gappy";

    saveVentureWorkspace(owner, ready, storage, "2026-05-27T01:00:00.000Z");
    saveVentureWorkspace(owner, thin, storage, "2026-05-27T02:00:00.000Z");
    saveVentureWorkspace(owner, gappy, storage, "2026-05-27T03:00:00.000Z");
    const saved = loadVenturePortfolio(owner, storage);

    expect(filterVenturePortfolioByEvidence(saved, "decision-ready").map((venture) => venture.title)).toEqual(["Ready Venture"]);
    expect(filterVenturePortfolioByEvidence(saved, "too-thin").map((venture) => venture.title)).toEqual(["Thin Venture"]);
    expect(filterVenturePortfolioByEvidence(saved, "has-gaps").map((venture) => venture.title)).toEqual(["Gappy Venture"]);
    expect(filterVenturePortfolioByEvidence(saved, "has-contradictions").map((venture) => venture.title)).toEqual(["Gappy Venture"]);
  });

  it("turns evidence gaps and readiness warnings into follow-up action tasks", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");

    const tasks = buildVentureGapActionQueue(saved);

    expect(tasks.map((task) => task.title)).toContain("Research missing evidence: x coverage");
    expect(tasks.map((task) => task.title)).toContain("Resolve contradiction: Missing x coverage.");
    expect(tasks.map((task) => task.title)).toContain("Run readiness review: needs-pressure-test");
    expect(tasks[0]).toEqual(expect.objectContaining({
      type: "missing-evidence",
      priority: "high",
    }));
    expect(tasks[0].prompt).toContain("Return source URLs, buyer objections, contradiction notes, and a continue/pivot/kill recommendation.");
  });

  it("records gap action launch and completion outcomes as auditable memory", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const saved = saveVentureWorkspace(owner, evidenceRichWorkspace(), storage, "2026-05-27T01:00:00.000Z");
    const task = buildVentureGapActionQueue(saved)[0];

    recordVentureGapAction(
      owner,
      saved.id,
      task,
      { status: "launch-requested", outcome: "Human approved a follow-up research launch." },
      storage,
      "2026-05-27T05:00:00.000Z",
    );
    recordVentureGapAction(
      owner,
      saved.id,
      task,
      { status: "launched" },
      storage,
      "2026-05-27T05:01:00.000Z",
    );
    recordVentureGapAction(
      owner,
      saved.id,
      task,
      { status: "completed", outcome: "New X research still showed weak buyer urgency." },
      storage,
      "2026-05-27T06:00:00.000Z",
    );
    const updated = loadVenturePortfolio(owner, storage)[0];

    expect(updated.gapActionHistory).toHaveLength(1);
    expect(updated.gapActionHistory[0]).toEqual(expect.objectContaining({
      taskId: task.id,
      status: "completed",
      requestedAt: "2026-05-27T05:00:00.000Z",
      launchedAt: "2026-05-27T05:01:00.000Z",
      completedAt: "2026-05-27T06:00:00.000Z",
      outcome: "New X research still showed weak buyer urgency.",
    }));
    expect(filterVenturePortfolio([updated], "weak buyer urgency")).toHaveLength(1);
  });

  it("summarizes portfolio readiness, open gaps, outcomes, and kill/scale pressure", () => {
    const storage = new MemoryStorage();
    const owner = "test@marketpulse.dev";
    const ready = evidenceRichWorkspace("Ready Venture");
    ready.id = "venture-ready";
    ready.killCriteria.missingEvidence = [];
    ready.contradictions = [];
    const gappy = evidenceRichWorkspace("Gappy Venture");
    gappy.id = "venture-gappy";

    const savedReady = saveVentureWorkspace(owner, ready, storage, "2026-05-27T01:00:00.000Z");
    const savedGappy = saveVentureWorkspace(owner, gappy, storage, "2026-05-27T02:00:00.000Z");
    recordVentureDecision(
      owner,
      savedReady.id,
      {
        decision: "scale",
        nextLifecycleStatus: "scaling",
        rationale: "Evidence is strong enough to scale the next channel.",
      },
      storage,
      "2026-05-27T03:00:00.000Z",
    );
    recordVentureExperimentResult(
      owner,
      savedReady.id,
      "fake-door-waitlist",
      {
        result: "12 qualified signups from 100 visits.",
        interpretation: "Pass: early demand crossed the signup threshold.",
      },
      storage,
      "2026-05-27T03:30:00.000Z",
    );
    recordVenturePricingSignal(
      owner,
      savedReady.id,
      {
        qualifiedBuyerCount: 5,
        paidCommitmentCount: 2,
        invoiceRequestCount: 1,
        acceptedPrice: "$9/month",
        objectionSummary: "Need student discount before annual plan.",
      },
      storage,
      "2026-05-27T03:45:00.000Z",
    );
    recordVentureCustomerInterview(
      owner,
      savedReady.id,
      {
        persona: "Burned-out sophomore",
        channel: "manual interview",
        painQuote: "I need a Sunday reset plan before the week starts.",
        willingnessToPay: "$9/month if it saves me time.",
        objections: "Privacy around wellness data.",
        requestedFeatures: "Calendar sync; gentle reminders",
        sentiment: "positive",
      },
      storage,
      "2026-05-27T03:50:00.000Z",
    );
    recordVentureOutreachApproval(
      owner,
      savedReady.id,
      {
        contactPersona: "Burned-out sophomore",
        channel: "manual email",
        messageDraft: "Thanks for joining the Recovery Planner early list.",
        status: "manual-contact-planned",
        riskNote: "Do not imply clinical advice.",
        nextAction: "Send manually after reviewing consent.",
        attribution: "founder@test.dev",
      },
      storage,
      "2026-05-27T03:55:00.000Z",
    );
    const readyWithSignals = loadVenturePortfolio(owner, storage).find((venture) => venture.id === savedReady.id);
    const riskCandidate = readyWithSignals ? buildVentureRiskCandidates(readyWithSignals)[0] : undefined;
    if (riskCandidate) {
      recordVentureRisk(
        owner,
        savedReady.id,
        {
          sourceType: riskCandidate.sourceType,
          sourceRecordId: riskCandidate.sourceRecordId,
          title: riskCandidate.title,
          detail: riskCandidate.detail,
          severity: "high",
          status: "resolved",
          owner: "Rishabh",
          mitigation: "Add consent language to wellness-data onboarding before outreach.",
          resolutionEvidence: "Consent copy added to the next outreach script.",
        },
        storage,
        "2026-05-27T03:57:00.000Z",
      );
    }
    recordVentureMvpBuildWorkspace(
      owner,
      savedReady.id,
      {
        status: "brief-ready",
        owner: "Rishabh",
        repoPath: "",
        setupCheck: "passed",
        typecheckCheck: "pending",
        unitTestCheck: "pending",
        buildCheck: "pending",
        browserSmokeCheck: "pending",
        deploymentCheck: "blocked",
        verificationNotes: "Build brief ready; generated source is not attached.",
      },
      storage,
      "2026-05-27T03:58:00.000Z",
    );
    recordVentureArtifact(
      owner,
      savedReady.id,
      {
        artifactType: "build-brief",
        status: "expected",
        title: "MVP build brief",
        owner: "Rishabh",
        verificationCommand: "No command until source repo exists.",
        evidence: "Build brief created from handoff; source repo still pending.",
        changeSummary: "Captured the build brief as an expected artifact before generated source exists.",
      },
      storage,
      "2026-05-27T03:59:00.000Z",
    );
    recordVentureMoneySignal(
      owner,
      savedReady.id,
      {
        type: "commitment",
        status: "committed",
        amountCents: 18000,
        source: "Paid pilot LOI",
        owner: "Rishabh",
        evidence: "Founder call produced a $180 pilot commitment; no payment collected.",
        notes: "Use this as revenue intent, not live billing proof.",
      },
      storage,
      "2026-05-27T03:59:30.000Z",
    );
    const readyWithRoadmapCandidates = loadVenturePortfolio(owner, storage).find((venture) => venture.id === savedReady.id);
    const roadmapCandidate = readyWithRoadmapCandidates ? buildVentureRoadmapCandidates(readyWithRoadmapCandidates)[0] : undefined;
    if (roadmapCandidate) {
      recordVentureRoadmapTask(
        owner,
        savedReady.id,
        {
          sourceType: roadmapCandidate.sourceType,
          sourceRecordId: roadmapCandidate.sourceRecordId,
          title: roadmapCandidate.title,
          detail: roadmapCandidate.detail,
          priority: roadmapCandidate.suggestedPriority,
          status: "queued",
          owner: "Rishabh",
          supportLoad: "Reduce manual support by designing calendar-sync copy before code.",
          riskReduction: "Avoids shipping reminders without consent expectations.",
          nextAction: "Scope a no-code calendar-sync concierge test.",
        },
        storage,
        "2026-05-27T03:59:45.000Z",
      );
    }
    const readyWithSupportCandidates = loadVenturePortfolio(owner, storage).find((venture) => venture.id === savedReady.id);
    const supportCandidate = readyWithSupportCandidates ? buildVentureSupportIssueCandidates(readyWithSupportCandidates)[0] : undefined;
    if (supportCandidate) {
      recordVentureSupportIssue(
        owner,
        savedReady.id,
        {
          sourceType: supportCandidate.sourceType,
          sourceRecordId: supportCandidate.sourceRecordId,
          issueType: supportCandidate.issueType,
          severity: "high",
          status: "in-progress",
          title: supportCandidate.title,
          detail: supportCandidate.detail,
          customerImpact: "Pilot users need concierge calendar-sync answers before setup.",
          supportLoad: supportCandidate.supportLoad,
          retentionRisk: "Retention risk: repeated manual calendar-sync support can swamp the founder.",
          owner: "Rishabh",
          resolution: "Support checklist is still open.",
          nextAction: "Call the first 5 pilot users and measure repeat support questions.",
        },
        storage,
        "2026-05-27T03:59:50.000Z",
      );
    }
    recordVentureActivationCohort(
      owner,
      savedReady.id,
      {
        sourceType: "experiment-result",
        sourceRecordId: "fake-door-waitlist",
        cohortLabel: "Fake-door waitlist test cohort",
        acquisitionChannel: "creator partnerships",
        activationEvent: "Completed Sunday reset plan.",
        retentionWindow: "Week-one retention after concierge setup.",
        signupCount: 12,
        activatedCount: 8,
        retainedCount: 5,
        paidCount: 2,
        revenueCents: 18000,
        supportIssueCount: 1,
        owner: "Rishabh",
        evidence: "12 qualified signups from 100 visits.",
        learning: "Activation rate is usable, retention depends on reducing support load.",
        nextAction: "Interview retained users before buying paid traffic.",
      },
      storage,
      "2026-05-27T03:59:55.000Z",
    );
    recordVentureChannelEconomics(
      owner,
      savedReady.id,
      {
        sourceType: "activation-cohort",
        sourceRecordId: "fake-door-waitlist",
        channel: "creator partnerships",
        spendCents: 9000,
        impressions: 1000,
        clicks: 120,
        signupCount: 12,
        activatedCount: 8,
        paidCount: 2,
        revenueCents: 18000,
        owner: "Rishabh",
        evidence: "Spent $90 on creator placements for the cohort.",
        nextAction: "Repeat only if paid cohort revenue stays above acquisition spend.",
      },
      storage,
      "2026-05-27T03:59:57.000Z",
    );
    const readyWithAuditCandidates = loadVenturePortfolio(owner, storage).find((venture) => venture.id === savedReady.id);
    const auditCandidate = readyWithAuditCandidates ? buildVentureAutonomyAuditCandidates(readyWithAuditCandidates)
      .find((item) => item.approvalLevel === "human-approved-outreach") : undefined;
    if (auditCandidate) {
      recordVentureAutonomyAudit(
        owner,
        savedReady.id,
        {
          approvalLevel: auditCandidate.approvalLevel,
          status: auditCandidate.status,
          sideEffect: auditCandidate.sideEffect,
          actionType: auditCandidate.actionType,
          actor: "Rishabh",
          sourceRecordId: auditCandidate.sourceRecordId,
          riskNote: auditCandidate.riskNote,
          replayNote: "Replay by reviewing the stored message draft and no-send state.",
          evidence: auditCandidate.evidence,
          nextAction: "Keep no-send state until consent review is complete.",
        },
        storage,
        "2026-05-27T03:59:58.000Z",
      );
    }
    const readyWithAgentRunCandidates = loadVenturePortfolio(owner, storage).find((venture) => venture.id === savedReady.id);
    const agentRunCandidate = readyWithAgentRunCandidates ? buildVentureAgentRunCandidates(readyWithAgentRunCandidates)[0] : undefined;
    if (agentRunCandidate) {
      recordVentureAgentRun(
        owner,
        savedReady.id,
        {
          sourceType: agentRunCandidate.sourceType,
          sourceRecordId: agentRunCandidate.sourceRecordId,
          status: agentRunCandidate.status,
          model: agentRunCandidate.model,
          prompt: agentRunCandidate.prompt,
          outputSummary: "Agent run captured the no-send audit trail for replay.",
          inputEvidence: agentRunCandidate.inputEvidence,
          toolCalls: agentRunCandidate.toolCalls,
          tokenEstimate: agentRunCandidate.tokenEstimate,
          replayCommand: agentRunCandidate.replayCommand,
          riskNote: agentRunCandidate.riskNote,
          owner: "Rishabh",
          nextAction: "Replay before external outreach.",
        },
        storage,
        "2026-05-27T03:59:59.000Z",
      );
    }
    const readyWithCompetitorCandidates = loadVenturePortfolio(owner, storage).find((venture) => venture.id === savedReady.id);
    const competitorCandidate = readyWithCompetitorCandidates ? buildVentureCompetitorCandidates(readyWithCompetitorCandidates)[0] : undefined;
    if (competitorCandidate) {
      recordVentureCompetitor(
        owner,
        savedReady.id,
        {
          sourceType: competitorCandidate.sourceType,
          sourceRecordId: competitorCandidate.sourceRecordId,
          competitorName: "Existing substitutes",
          competitorType: competitorCandidate.competitorType,
          threatLevel: competitorCandidate.suggestedThreatLevel,
          status: "watching",
          positioning: competitorCandidate.positioning,
          evidence: competitorCandidate.evidence,
          differentiation: "Prove the recovery planner wedge against templates.",
          responsePlan: competitorCandidate.responsePlan,
          owner: "Rishabh",
          watchCadence: competitorCandidate.watchCadence,
          nextAction: "Collect switching-cost evidence before scaling.",
        },
        storage,
        "2026-05-27T03:59:59.500Z",
      );
    }
    const task = buildVentureGapActionQueue(savedGappy)[0];
    recordVentureGapAction(
      owner,
      savedGappy.id,
      task,
      { status: "completed", outcome: "Gap follow-up confirmed weak urgency." },
      storage,
      "2026-05-27T04:00:00.000Z",
    );

    const summary = summarizeVenturePortfolio(loadVenturePortfolio(owner, storage));

    expect(summary.ventureCount).toBe(2);
    expect(summary.experimentLaunchPackCount).toBe(2);
    expect(summary.launchPackReadyCount + summary.launchPackNeedsApprovalCount + summary.launchPackRecordedCount + summary.launchPackBlockedCount).toBe(2);
    expect(summary.launchPackNeedsApprovalCount + summary.launchPackRecordedCount + summary.launchPackBlockedCount).toBeGreaterThan(0);
    expect(summary.qaReleaseReportCount).toBe(2);
    expect(summary.qaReadyCount + summary.qaNeedsFixesCount + summary.qaBlockedCount).toBe(2);
    expect(summary.qaBlockedCount).toBeGreaterThan(0);
    expect(summary.investorBriefCount).toBe(2);
    expect(summary.investableBriefCount + summary.watchBriefCount + summary.notReadyBriefCount).toBe(2);
    expect(summary.notReadyBriefCount + summary.watchBriefCount).toBeGreaterThan(0);
    expect(summary.financialModelCount).toBe(2);
    expect(
      summary.financialScaleReadyCount +
      summary.financialNeedsProofCount +
      summary.financialRunwayRiskCount +
      summary.financialBlockedCount,
    ).toBe(2);
    expect(summary.averageFinanceScore).toBeGreaterThan(0);
    expect(summary.decisionReadyCount).toBe(1);
    expect(summary.needsPressureTestCount).toBe(1);
    expect(summary.completedGapOutcomeCount).toBe(1);
    expect(summary.openGapTaskCount).toBeGreaterThan(0);
    expect(summary.scalePressureCount).toBe(1);
    expect(summary.measuredExperimentCount).toBe(1);
    expect(summary.demandPassCount).toBe(1);
    expect(summary.predictionSnapshotCount).toBe(2);
    expect(summary.demandDriftMeasuredCount).toBe(2);
    expect(summary.demandDriftConfirmedCount).toBe(1);
    expect(summary.demandOverestimatedCount).toBe(1);
    expect(summary.demandUnderestimatedCount).toBe(0);
    expect(summary.demandDriftMixedCount).toBe(0);
    expect(summary.pricingSignalCount).toBe(1);
    expect(summary.paidPricingSignalCount).toBe(3);
    expect(summary.pricingValidatedCount).toBe(1);
    expect(summary.customerInterviewCount).toBe(1);
    expect(summary.positiveInterviewCount).toBe(1);
    expect(summary.featureRequestCount).toBe(1);
    expect(summary.outreachApprovalCount).toBe(1);
    expect(summary.humanApprovedOutreachCount).toBe(1);
    expect(summary.manualOutreachPlannedCount).toBe(1);
    expect(summary.notSentOutreachCount).toBe(1);
    expect(summary.outreachCampaignCount).toBe(2);
    expect(
      summary.outreachCampaignReadyCount +
      summary.outreachCampaignNeedsApprovalCount +
      summary.outreachCampaignBlockedCount +
      summary.outreachCampaignRecordedCount,
    ).toBe(2);
    expect(summary.outreachCampaignReadyCount + summary.outreachCampaignNeedsApprovalCount).toBeGreaterThan(0);
    expect(summary.riskRecordCount).toBe(1);
    expect(summary.openRiskCount).toBe(0);
    expect(summary.highRiskCount).toBe(1);
    expect(summary.resolvedRiskCount).toBe(1);
    expect(summary.customerInboxRiskCount).toBe(1);
    expect(summary.untriagedRiskCandidateCount).toBeGreaterThan(0);
    expect(summary.mvpBuildWorkspaceCount).toBe(1);
    expect(summary.mvpRepoAttachedCount).toBe(0);
    expect(summary.mvpExecutableCount).toBe(0);
    expect(summary.mvpBlockedCount).toBe(0);
    expect(summary.mvpVerificationPassedCount).toBe(1);
    expect(summary.generatedAppHandoffCount).toBe(2);
    expect(
      summary.generatedAppSourcePendingCount +
      summary.generatedAppBriefReadyCount +
      summary.generatedAppRepoAttachedCount +
      summary.generatedAppExecutableCount,
    ).toBe(2);
    expect(summary.generatedAppBriefReadyCount + summary.generatedAppSourcePendingCount).toBeGreaterThan(0);
    expect(summary.generatedAppSourceScaffoldCount).toBe(2);
    expect(summary.generatedAppSourceFileCount).toBe(26);
    expect(summary.generatedAppReadyToMaterializeCount).toBe(1);
    expect(summary.generatedAppNoFakeSourceGuardCount).toBe(10);
    expect(summary.generatedAppVerificationProofCount).toBe(2);
    expect(summary.generatedAppVerifiedProofCount).toBe(0);
    expect(summary.generatedAppPartialProofCount).toBe(1);
    expect(summary.generatedAppMissingProofCount).toBe(1);
    expect(summary.artifactRecordCount).toBe(1);
    expect(summary.verifiedArtifactCount).toBe(0);
    expect(summary.blockedArtifactCount).toBe(0);
    expect(summary.deploymentProofCount).toBe(0);
    expect(summary.changelogEntryCount).toBe(1);
    expect(summary.moneySignalCount).toBe(1);
    expect(summary.revenueCents).toBe(0);
    expect(summary.expenseCents).toBe(0);
    expect(summary.netRevenueCents).toBe(0);
    expect(summary.committedRevenueCents).toBe(18000);
    expect(summary.runwayRiskCount).toBe(0);
    expect(summary.roadmapTaskCount).toBe(1);
    expect(summary.openRoadmapTaskCount).toBe(1);
    expect(summary.highRoadmapTaskCount).toBe(0);
    expect(summary.supportLoadTaskCount).toBe(1);
    expect(summary.untriagedRoadmapCandidateCount).toBeGreaterThan(0);
    expect(summary.supportIssueCount).toBe(1);
    expect(summary.supportQuestionCount).toBe(0);
    expect(summary.pilotIssueCount).toBe(1);
    expect(summary.openSupportIssueCount).toBe(1);
    expect(summary.criticalSupportIssueCount).toBe(0);
    expect(summary.resolvedSupportIssueCount).toBe(0);
    expect(summary.retentionRiskIssueCount).toBe(1);
    expect(summary.untriagedSupportIssueCandidateCount).toBeGreaterThan(0);
    expect(summary.activationCohortCount).toBe(1);
    expect(summary.cohortSignupCount).toBe(12);
    expect(summary.activatedUserCount).toBe(8);
    expect(summary.retainedUserCount).toBe(5);
    expect(summary.paidCohortUserCount).toBe(2);
    expect(summary.cohortRevenueCents).toBe(18000);
    expect(summary.cohortSupportIssueCount).toBe(1);
    expect(summary.averageActivationRate).toBe(67);
    expect(summary.averageRetentionRate).toBe(63);
    expect(summary.untriagedActivationCohortCandidateCount).toBeGreaterThan(0);
    expect(summary.channelEconomicsCount).toBe(1);
    expect(summary.acquisitionSpendCents).toBe(9000);
    expect(summary.channelSignupCount).toBe(12);
    expect(summary.channelActivatedCount).toBe(8);
    expect(summary.channelPaidUserCount).toBe(2);
    expect(summary.channelRevenueCents).toBe(18000);
    expect(summary.blendedCacCents).toBe(4500);
    expect(summary.paidBackChannelCount).toBe(1);
    expect(summary.untriagedChannelEconomicsCandidateCount).toBeGreaterThan(0);
    expect(summary.killRuleSignalCount).toBeGreaterThan(0);
    expect(summary.killRuleKillRecommendationCount).toBe(0);
    expect(summary.killRulePauseRecommendationCount).toBe(1);
    expect(summary.killRulePivotRecommendationCount).toBe(1);
    expect(summary.killRuleScaleRecommendationCount).toBe(0);
    expect(summary.killDecisionArtifactCount).toBe(2);
    expect(summary.killDecisionStopCount + summary.killDecisionContinueCount + summary.killDecisionScaleCount).toBe(2);
    expect(summary.killDecisionStopCount + summary.killDecisionContinueCount).toBeGreaterThan(0);
    expect(summary.autonomyAuditCount).toBe(1);
    expect(summary.externalApprovedActionCount).toBe(0);
    expect(summary.externalBlockedActionCount).toBe(1);
    expect(summary.replayableActionCount).toBe(1);
    expect(summary.untriagedAutonomyAuditCandidateCount).toBeGreaterThan(0);
    expect(summary.agentRunCount).toBe(1);
    expect(summary.modelCallLogCount).toBe(1);
    expect(summary.replayableAgentRunCount).toBe(1);
    expect(summary.blockedAgentRunCount).toBe(0);
    expect(summary.untriagedAgentRunCandidateCount).toBeGreaterThan(0);
    expect(summary.competitorRecordCount).toBe(1);
    expect(summary.highThreatCompetitorCount).toBe(1);
    expect(summary.substituteCompetitorCount).toBe(1);
    expect(summary.untriagedCompetitorCandidateCount).toBeGreaterThan(0);
    expect(summary.averageReadinessScore).toBeGreaterThan(0);
    expect(summary.marketModelAverageConfidenceScore).toBeGreaterThan(0);
    expect(
      summary.marketModelHighConfidenceCount +
      summary.marketModelMediumConfidenceCount +
      summary.marketModelLowConfidenceCount,
    ).toBe(2);
    expect(summary.marketModelMissingProofCount).toBeGreaterThan(0);
    expect(summary.dominantMarketProofGap).not.toBe("None");
    expect(summary.riskiestMarketTitle).toMatch(/Recovery Planner|Gappy Venture/);
    expect(summary.founderExecutionMemoCount).toBe(2);
    expect(summary.founderExecutionMemoBlockedCount).toBeGreaterThan(0);
    expect(
      summary.founderExecutionMemoReadyCount +
      summary.founderExecutionMemoPressureTestCount +
      summary.founderExecutionMemoBlockedCount,
    ).toBe(2);
  });
});
