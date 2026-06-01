import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AI_SERVER_URL, mockAuthAndSetup } from "./helpers";
import {
  MASTERBUILD_DASHBOARD_CONTRACT_VERSION,
  MASTERBUILD_DASHBOARD_KEYS,
} from "../src/lib/masterbuild-contract";

const BLOCKED_WORKER_PROMPT = "AI wellness apps for Gen Z";

function buildEmptyDashboardSnapshot() {
  return {
    mission: null,
    recentMissions: [],
    agents: [],
    discoveries: [],
    logs: [],
    signals: [],
    thoughts: [],
    memory: [],
    businessPlans: [],
  };
}

function buildBlockedWorkerDashboard(timestamp: string) {
  return {
    mission: {
      id: "blocked-worker-mission",
      prompt: BLOCKED_WORKER_PROMPT,
      status: "error",
      live_url_1: null,
      live_url_2: null,
      live_url_3: null,
      live_url_4: null,
      live_url_5: "/agent-stream/5",
      final_options: null,
      created_at: timestamp,
      stopped_at: timestamp,
    },
    recentMissions: [],
    agents: [1, 2, 3, 4, 5].map((agentId) => ({
      id: `blocked-agent-${agentId}`,
      agent_id: agentId,
      name: ["Echo", "Pulse", "Thread", "Ledger", "Atlas"][agentId - 1],
      platform: ["youtube", "x", "reddit", "substack", "market_research"][agentId - 1],
      role: ["Video Scan", "Conversation Scan", "Community Scan", "Narrative Scan", "Market Research"][agentId - 1],
      status: "blocked",
      current_url: "",
      profile_path: "",
      assignment: BLOCKED_WORKER_PROMPT,
      energy: 0,
      status_detail: "Live LLM credentials are missing or invalid.",
      failure_reason: "Missing OPENAI_API_KEY or MINIMAX_API_KEY.",
      retry_count: 0,
      confidence: 0,
      last_heartbeat: timestamp,
    })),
    discoveries: [],
    logs: [{
      id: "blocked-worker-log",
      agent_id: null,
      type: "error",
      message: "Live LLM credentials are missing or invalid. Set OPENAI_API_KEY for live OpenAI inference, or MINIMAX_API_KEY to let the worker use its MiniMax fallback.",
      metadata: {},
      created_at: timestamp,
    }],
    signals: [],
    thoughts: [],
    memory: [],
    businessPlans: [],
  };
}

function buildQueuedMissionDashboard(prompt: string, timestamp: string) {
  return {
    mission: {
      id: "retry-worker-mission",
      prompt,
      status: "queued",
      live_url_1: "/agent-stream/1",
      live_url_2: "/agent-stream/2",
      live_url_3: "/agent-stream/3",
      live_url_4: "/agent-stream/4",
      live_url_5: "/agent-stream/5",
      final_options: null,
      created_at: timestamp,
      stopped_at: null,
    },
    recentMissions: [],
    agents: [1, 2, 3, 4, 5].map((agentId) => ({
      id: `queued-agent-${agentId}`,
      agent_id: agentId,
      name: ["Echo", "Pulse", "Thread", "Ledger", "Atlas"][agentId - 1],
      platform: ["youtube", "x", "reddit", "substack", "market_research"][agentId - 1],
      role: ["Video Scan", "Conversation Scan", "Community Scan", "Narrative Scan", "Market Research"][agentId - 1],
      status: "queued",
      current_url: "",
      profile_path: "",
      assignment: prompt,
      energy: 100,
      status_detail: "Queued for worker pickup.",
      failure_reason: "",
      retry_count: 0,
      confidence: null,
      last_heartbeat: timestamp,
    })),
    discoveries: [],
    logs: [{
      id: "retry-worker-log",
      agent_id: null,
      type: "status",
      message: "Mission created. Worker pickup should begin shortly.",
      metadata: {},
      created_at: timestamp,
    }],
    signals: [],
    thoughts: [],
    memory: [],
    businessPlans: [],
  };
}

function buildSavedVentureFixture(title = "Gen Z Recovery Planner") {
  const now = "2026-05-27T20:50:00.000Z";
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
    experiments: [{
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
      result: "12 qualified signups from 100 visits.",
      interpretation: "Pass: early demand crossed the signup threshold.",
      nextAction: "Publish waitlist.",
      recordedAt: now,
    }],
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
    approvals: [{ level: "Human-approved deployment", status: "requires-human", evidence: "Required." }],
    nextActions: ["Run the fake-door waitlist test."],
    savedAt: now,
    updatedAt: now,
    lifecycleStatus: "validating",
    reviewCadence: "Weekly until validation completes.",
    decisionHistory: [],
    gapActionHistory: [],
    predictionSnapshots: [{
      id: "venture-demo-option-1-fake-door-waitlist-prediction",
      experimentId: "fake-door-waitlist",
      type: "Fake-door waitlist test",
      predictedAt: now,
      predictedOutcome: "expected-pass",
      buyerUrgency: 86,
      budgetLikelihood: 78,
      adoptionFriction: 28,
      trustBarrier: 34,
      competitivePull: 22,
      messageMarketFit: 82,
      channelReach: 76,
      conversionProbability: 84,
      retentionProbability: 72,
      expansionPotential: 68,
      successThreshold: "8% signup",
      failureThreshold: "2% signup",
      rationale: "Deadline-heavy students and creator channel evidence predicted the fake-door waitlist would pass.",
    }],
    pricingSignals: [{
      id: "pricing-signal-paid-pilot",
      experimentId: "pricing-smoke",
      recordedAt: now,
      pricingHypothesis: "$9/month",
      qualifiedBuyerCount: 5,
      paidCommitmentCount: 2,
      invoiceRequestCount: 1,
      acceptedPrice: "$9/month",
      objectionSummary: "Need student discount before annual plan.",
      evidenceNote: "Three qualified buyers accepted the paid pilot.",
    }],
    customerInterviews: [],
    outreachApprovals: [],
    riskRecords: [],
    mvpBuildWorkspaces: [{
      id: "mvp-build-generated-proof",
      createdAt: now,
      updatedAt: now,
      status: "executable",
      owner: "generated-app-verifier",
      sourceCodeStatus: "Source code: attached verifier report",
      repoPath: "/tmp/marketpulse-generated-proof/generated-app",
      setupInstructions: "pnpm install",
      setupCommand: "pnpm install",
      typecheckCommand: "pnpm type-check",
      testCommand: "pnpm test",
      buildCommand: "pnpm build",
      browserSmokeCommand: "pnpm browser-smoke",
      deploymentCommand: "No deployment command approved yet.",
      deploymentPath: "Deployment proposal blocked.",
      analyticsPlan: "Track signup rate.",
      securityNotes: "No sensitive data.",
      accessibilityPass: "Check mobile.",
      mobileBehavior: "Mobile-first.",
      dataModel: ["RecoveryPlan: energyScore"],
      operatorDashboard: "Show experiments.",
      evidenceBacklink: "2 evidence sources linked.",
      setupCheck: "passed",
      typecheckCheck: "passed",
      unitTestCheck: "passed",
      buildCheck: "passed",
      browserSmokeCheck: "passed",
      deploymentCheck: "blocked",
      verificationNotes: "Generated verifier completed install, typecheck, test, build, and browser smoke in under a second each.",
    }],
    artifactRecords: [],
    moneySignals: [{
      id: "money-signal-paid-pilot",
      recordedAt: now,
      type: "commitment",
      status: "committed",
      amountCents: 18000,
      currency: "USD",
      source: "Paid pilot LOI",
      owner: "Rishabh",
      evidence: "Founder call produced a $180 pilot commitment.",
      notes: "Record-only money signal.",
      linkedExperimentId: "pricing-smoke",
      externalBillingStatus: "not-charged",
    }],
    roadmapTasks: [],
    supportIssues: [],
    activationCohorts: [{
      id: "activation-cohort-campus-pilot",
      recordedAt: now,
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
    }],
    channelEconomics: [{
      id: "channel-economics-awareness-ads",
      recordedAt: now,
      sourceType: "manual",
      channel: "campus awareness ads",
      spendCents: 12000,
      impressions: 2500,
      clicks: 180,
      signupCount: 1,
      activatedCount: 0,
      paidCount: 0,
      revenueCents: 0,
      costPerSignupCents: 12000,
      cacCents: 0,
      paybackStatus: "no-payback",
      owner: "Rishabh",
      evidence: "Awareness ad generated clicks but no paid users.",
      nextAction: "Stop spend until clicks turn into retained or paid users.",
    }],
    autonomyAudit: [],
    agentRuns: [],
    competitors: [],
    browserResearchTasks: [],
  };
}

function buildDraftReadyNoSendVentureFixture() {
  const now = "2026-05-27T21:20:00.000Z";
  const venture = buildSavedVentureFixture("Draft Ready Recovery Planner");
  return {
    ...venture,
    riskRecords: [],
    supportIssues: [],
    customerInterviews: [],
    mvpBuildWorkspaces: venture.mvpBuildWorkspaces.map((workspace) => ({
      ...workspace,
      deploymentCheck: "passed",
      deploymentPath: "Local no-deploy preview ready.",
      verificationNotes: "Generated verifier completed setup, typecheck, test, build, browser smoke, and local no-deploy preview checks.",
    })),
    artifactRecords: [{
      id: "artifact-local-no-deploy-proof",
      createdAt: now,
      updatedAt: now,
      artifactType: "deployment-proof",
      status: "verified",
      title: "Local no-deploy pilot preview proof",
      uri: "/tmp/marketpulse-generated-proof/generated-app",
      owner: "generated-app-verifier",
      verificationCommand: "Local preview only; no external deployment command approved.",
      evidence: "Verified local preview artifact for pilot onboarding. No deploy, no send, no spend, no contact, no billing change.",
      changeSummary: "Attached no-deploy readiness proof for pilot onboarding.",
    }],
    productBuildCommandRuns: [{
      id: "product-build-run-local-ready",
      recordedAt: now,
      commandId: "local-no-deploy-product-build-command",
      commandTitle: "Local no-deploy product build command",
      sourceType: "mvp-build-workspace",
      sourceArtifactId: "mvp-build-generated-proof",
      sourceArtifactLabel: "MVP build workspace: generated proof",
      runState: "promoted",
      appName: "draft-ready-recovery-planner",
      buildCommand: "pnpm build",
      artifactTarget: "/tmp/marketpulse-generated-proof/generated-app",
      owner: "generated-app-verifier",
      runProof: "Promoted local MVP run is ready for internal pilot onboarding proof.",
      localArtifactProof: "/tmp/marketpulse-generated-proof/generated-app",
      verifierReportProof: "Verifier report: setup/typecheck/test/build/browser-smoke all green.",
      noExternalSideEffectProof: "No external side effects: no deploy, no send, no spend, no contact, no billing change.",
      learning: "The first pilot cohort can be measured from local-only onboarding.",
      evidence: [
        "Promoted local build run.",
        "Verifier report attached.",
        "Local artifact proof attached.",
      ],
    }],
  };
}

function buildPortfolioImportPayload(
  savedViews: unknown[] = [],
  portfolioImportAuditHistory: unknown[] = [],
  demandSourceBlockerSavedViews: unknown[] = [],
  demandSourceBlockerPacketTriage: unknown[] = [],
  demandSourceBlockerPacketTriageAuditHistory: unknown[] = [],
  demandSourceBlockerPacketTriageOwnerWorkloadSummary: unknown[] = [],
  demandSourceBlockerPacketTriageWorkloadDriftReconciliation: unknown[] = [],
  demandSourceBlockerPacketTriageWorkloadPinnedSummaries: unknown[] = [],
  demandSourceBlockerPacketHandoffHealth: unknown[] = [],
  demandSourceBlockerPacketHandoffRemediationQueue: unknown[] = [],
  demandSourceBlockerPacketHandoffRemediationPlans: unknown[] = [],
  demandSourceBlockerPacketHandoffRemediationClosures: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalations: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews: unknown[] = [],
  demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: unknown[] = [],
) {
  return JSON.stringify({
    version: 1,
    exportedAt: "2026-05-27T20:51:00.000Z",
    exportedBy: "test@marketpulse.dev",
    deploymentEscalationAuditSavedViews: savedViews,
    demandSourceBlockerSavedViews,
    demandSourceBlockerPacketTriage,
    demandSourceBlockerPacketTriageAuditHistory,
    demandSourceBlockerPacketTriageOwnerWorkloadSummary,
    demandSourceBlockerPacketTriageWorkloadDriftReconciliation,
    demandSourceBlockerPacketTriageWorkloadPinnedSummaries,
    demandSourceBlockerPacketHandoffHealth,
    demandSourceBlockerPacketHandoffRemediationQueue,
    demandSourceBlockerPacketHandoffRemediationPlans,
    demandSourceBlockerPacketHandoffRemediationClosures,
    demandSourceBlockerPacketHandoffReopenEscalations,
    demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts,
    demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews,
    demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals,
    portfolioImportAuditHistory,
    ventures: [buildSavedVentureFixture()],
  });
}

async function seedVenturePortfolio(page: Page) {
  await page.addInitScript((venture) => {
    if (!localStorage.getItem("marketpulse-venture-portfolio:test-marketpulse.dev")) {
      localStorage.setItem("marketpulse-venture-portfolio:test-marketpulse.dev", JSON.stringify([venture]));
    }
    sessionStorage.setItem("marketpulse_splash_shown", "1");
  }, buildSavedVentureFixture());
}

test.describe("Login page", () => {
  test("renders login form when not authenticated", async ({ page }) => {
    await page.route("**/api/auth/**", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "not_authenticated" }),
      });
    });
    await page.route("**/socket.io/**", (route) => route.abort());

    await page.goto("/");
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page.getByRole("button", { name: "Sign in" }).first()).toBeVisible();
  });
});

test.describe("Authenticated app", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthAndSetup(page);
  });

  test("dashboard loads with sidebar navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=MarketPulse").first()).toBeVisible({ timeout: 10000 });

    await expect(page.locator("nav button", { hasText: "Dashboard" })).toBeVisible();
    await expect(page.locator("nav button", { hasText: "Market Research" })).toBeVisible();
    await expect(page.locator("nav button", { hasText: "Trends" })).toBeVisible();
    await expect(page.locator("nav button", { hasText: "Recommendations" })).toBeVisible();
    await expect(page.locator("nav button", { hasText: "Briefing" })).toBeVisible();
  });

  test("accessibility smoke: critical routes expose landmarks and named controls", async ({ page }) => {
    const expectAppShell = async () => {
      await expect(page.locator("nav[aria-label='Main navigation']")).toBeVisible({ timeout: 10000 });
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByRole("button", { name: "MarketPulse home" })).toBeVisible();
      for (const name of ["Dashboard", "Market Research", "Trends", "Recommendations", "Venture Lab", "Briefing", "Report", "History", "Business Type"]) {
        await expect(page.getByRole("button", { name })).toBeVisible();
      }
    };

    await page.goto("/");
    await expectAppShell();
    await expect(page.getByRole("button", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("Welcome back, Test Business")).toBeVisible({ timeout: 10000 });

    await page.goto("/market-research");
    await expectAppShell();
    await expect(page.getByRole("button", { name: "Market Research" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("textbox", { name: "Research mission prompt" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Dictate research mission prompt" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Launch Mission" })).toBeVisible();

    await page.goto("/ventures");
    await expectAppShell();
    await expect(page.getByRole("button", { name: "Venture Lab" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("textbox", { name: "Thesis title" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Target buyer" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Pain statement" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create venture thesis" })).toBeVisible();
  });

  test("Market Research: command view renders with all sections", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Demo ready")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Live backend degraded")).toBeVisible();
    await expect(page.getByText("python-worker: missing-llm")).toBeVisible();
    await expect(page.getByText("worker-preflight: llm-missing")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Set OPENAI_API_KEY for live OpenAI inference").first()).toBeVisible();

    // Bottom command bar with mission input
    await expect(page.getByPlaceholder(/Describe a market to research/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Launch Mission" })).toBeVisible();

    // View mode toggle
    await expect(page.getByRole("button", { name: "Command" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Observe" })).toBeVisible();

    // Browser agent cards (4 browser agents, Atlas has no browser)
    await expect(page.getByText("Echo")).toBeVisible();
    await expect(page.getByText("Pulse", { exact: true })).toBeVisible();
    await expect(page.getByText("Thread")).toBeVisible();
    await expect(page.getByText("Ledger")).toBeVisible();

    // Discoveries section
    await expect(page.getByText("Discoveries").first()).toBeVisible();

    // Live Feed sidebar
    await expect(page.getByText("Live Feed")).toBeVisible();
  });

  test("Market Research: mobile command view keeps runtime status and mission controls visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/market-research");

    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Demo ready")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Live backend degraded")).toBeVisible();
    await expect(page.getByText("python-worker: missing-llm")).toBeVisible();
    await expect(page.getByText("worker-preflight: llm-missing")).toBeVisible({ timeout: 15000 });
    await expect(page.getByPlaceholder(/Describe a market to research/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Launch Mission" })).toBeVisible();

    const widthMetrics = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
    }));
    expect(widthMetrics.documentWidth).toBeLessThanOrEqual(widthMetrics.viewportWidth);
    expect(widthMetrics.bodyWidth).toBeLessThanOrEqual(widthMetrics.viewportWidth);

    await page.getByPlaceholder(/Describe a market to research/).fill("AI wellness apps for Gen Z");
    await page.getByRole("button", { name: "Launch Mission" }).click();
    await expect(page.getByText("Gen Z creators are packaging burnout recovery").first()).toBeVisible({ timeout: 15000 });

    await page.getByText("Browser Sessions").scrollIntoViewIfNeeded();
    await expect(page.getByText("Browser Sessions")).toBeVisible();
    await page.getByText("Discoveries").first().scrollIntoViewIfNeeded();
    await expect(page.getByText("Discoveries").first()).toBeVisible();
  });

  test("Market Research: dark theme keeps research surfaces dark", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("marketpulse-theme", "dark");
    });

    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Echo")).toBeVisible();

    const surfaceState = await page.evaluate(() => {
      const browserCards = Array.from(document.querySelectorAll("div.rounded-xl")).filter((card) => {
        const text = card.textContent ?? "";
        return text.includes("Echo") || text.includes("Pulse") || text.includes("Thread") || text.includes("Ledger");
      }) as HTMLElement[];

      return {
        darkClassApplied: document.documentElement.classList.contains("dark"),
        cardClassNames: browserCards.map((card) => card.className),
      };
    });

    expect(surfaceState.darkClassApplied).toBe(true);
    expect(surfaceState.cardClassNames.length).toBeGreaterThan(0);

    for (const className of surfaceState.cardClassNames) {
      expect(className).toContain("dark:bg-slate-950/90");
      expect(className).toContain("dark:border-slate-800/80");
    }
  });

  test("Market Research: observe view shows tabs", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    // Switch to Observe view
    await page.getByRole("button", { name: "Observe" }).click();

    // Observability tabs should now be visible
    await expect(page.getByText("Mission Timeline")).toBeVisible();
    await expect(page.getByText("0 of 5 phases complete")).toBeVisible();
    await expect(page.getByText("No mission has been launched.")).toBeVisible();
    await expect(page.getByText("Trust Audit")).toBeVisible();
    await expect(page.getByText("No evidence yet")).toBeVisible();
    await expect(page.getByText("No agent issues")).toBeVisible();
    await expect(page.getByText("No plan confidence yet")).toBeVisible();
    await expect(page.getByRole("tab", { name: "Agent Feed" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Business Plan" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Shared Memory" })).toBeVisible();

    // Click Business Plan tab
    await page.getByRole("tab", { name: "Business Plan" }).click();
    await expect(page.getByText("Launch a mission to generate a business report")).toBeVisible();

    // Click Shared Memory tab
    await page.getByRole("tab", { name: "Shared Memory" }).click();
    await expect(page.getByText("No memory files yet")).toBeVisible();

    // Click back to Agent Feed
    await page.getByRole("tab", { name: "Agent Feed" }).click();
    await expect(page.getByText("No events yet")).toBeVisible();
  });

  test("Market Research: mission input is interactive", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    const input = page.getByPlaceholder(/Describe a market to research/);
    await input.fill("AI wellness apps for Gen Z");
    await expect(input).toHaveValue("AI wellness apps for Gen Z");

    await expect(page.getByRole("button", { name: "Launch Mission" })).toBeEnabled();
  });

  test("Market Research: agent status taxonomy covers empty and partial mission states", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("No mission")).toBeVisible();
    await expect(page.getByText("IDLE").first()).toBeVisible();

    await page.getByPlaceholder(/Describe a market to research/).fill("AI wellness apps for Gen Z");
    await page.getByRole("button", { name: "Launch Mission" }).click();

    await expect(page.getByText("DONE").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("FAILED", { exact: true })).toBeVisible();
    await expect(page.getByText("STALE", { exact: true })).toBeVisible();
    await expect(page.getByText("2 agents need review")).toBeVisible();
    await expect(page.getByText("X coverage is unavailable in demo mode")).toBeVisible();

    await page.getByRole("button", { name: "Observe" }).click();
    await expect(page.getByText("Mission Complete With Gaps")).toBeVisible();
    await expect(page.getByText("Mission Timeline")).toBeVisible();
    await expect(page.getByText("2 of 5 phases complete")).toBeVisible();
    await expect(page.getByText("3 sources captured; 2 agents need review.")).toBeVisible();
    await expect(page.getByText("2 options ready; waiting for x.")).toBeVisible();
    await expect(page.getByText("2 agents can be retried before launch decisions.")).toBeVisible();
    await expect(page.getByText("Trust Audit")).toBeVisible();
    await expect(page.getByText("3/4 channels covered")).toBeVisible();
    await expect(page.getByText("Missing: x")).toBeVisible();
    await expect(page.getByText("1 stale heartbeat")).toBeVisible();
    await expect(page.getByText("Plan confidence 82%")).toBeVisible();
    await expect(page.getByText("2 low-confidence channels")).toBeVisible();
    await expect(page.getByText("Partial package")).toBeVisible();
    await expect(page.getByText("2 needs review")).toBeVisible();
    await expect(page.getByText("Pulse could not validate X coverage").first()).toBeVisible();
  });

  test("Market Research: failed agents can be retried from the browser card", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder(/Describe a market to research/).fill(BLOCKED_WORKER_PROMPT);
    await page.getByRole("button", { name: "Launch Mission" }).click();

    await expect(page.getByText("FAILED", { exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Retry Pulse agent" }).click();

    await expect(page.getByText("Retry requested for Pulse.").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Retry requested from command UI. Waiting for worker pickup.").first()).toBeVisible();
    await expect(page.getByText("Worker pickup in progress")).toBeVisible();
  });

  test("Market Research: blocked live-worker missions surface missing LLM credentials", async ({ page }) => {
    const timestamp = new Date().toISOString();
    await page.route("**/api/dashboard", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(buildBlockedWorkerDashboard(timestamp)),
      });
    });

    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("BLOCKED", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("5 needs review")).toBeVisible();
    await expect(page.getByText("Live LLM credentials are missing or invalid.").first()).toBeVisible();

    await page.getByRole("button", { name: "Observe" }).click();
    await expect(page.getByText("Mission Error", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Set OPENAI_API_KEY for live OpenAI inference").first()).toBeVisible();
  });

  test("Market Research: blocked mission can be cleared from the cockpit", async ({ page }) => {
    let dashboardPayload = buildBlockedWorkerDashboard(new Date().toISOString());
    let resetCalled = false;

    await page.route("**/api/dashboard", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(dashboardPayload),
      });
    });
    await page.route("**/api/mission/reset", (route) => {
      resetCalled = true;
      dashboardPayload = buildEmptyDashboardSnapshot();
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, missionId: "blocked-worker-mission" }),
      });
    });

    await page.goto("/market-research");
    await expect(page.getByRole("button", { name: "Clear Mission" })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Clear Mission" }).click();

    await expect.poll(() => resetCalled).toBe(true);
    await expect(page.getByText("No mission")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "Launch Mission" })).toBeVisible();
    await expect(page.getByText("Mission Error", { exact: true })).toHaveCount(0);
  });

  test("Market Research: blocked mission can retry the same prompt", async ({ page }) => {
    let dashboardPayload = buildBlockedWorkerDashboard(new Date().toISOString());
    let retryPrompt = "";

    await page.route("**/api/dashboard", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(dashboardPayload),
      });
    });
    await page.route("**/api/mission/create", (route) => {
      const body = route.request().postDataJSON() as { prompt?: string };
      retryPrompt = body.prompt ?? "";
      dashboardPayload = buildQueuedMissionDashboard(retryPrompt, new Date().toISOString());
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          mission: {
            mission_id: "retry-worker-mission",
            prompt: retryPrompt,
            status: "queued",
            supersededMissionIds: ["blocked-worker-mission"],
          },
        }),
      });
    });

    await page.goto("/market-research");
    await expect(page.getByRole("button", { name: "Retry Prompt" })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Retry Prompt" }).click();

    await expect.poll(() => retryPrompt).toBe(BLOCKED_WORKER_PROMPT);
    await expect(page.getByText("Worker pickup in progress")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Queued for worker pickup.").first()).toBeVisible();
  });

  test("Venture Lab: portfolio import audit previews collisions and blocks invalid payloads", async ({ page }) => {
    test.setTimeout(90000);
    await seedVenturePortfolio(page);
    const savedView = {
      id: "view-release-owner-no-send",
      name: "Saved collision check",
      createdAt: "2026-05-27T20:51:00.000Z",
      statusFilter: "proposed",
      sideEffectFilter: "none",
      actorFilter: "release-owner",
    };
    const blockerSavedView = {
      id: "view-channel-economics-blocker",
      name: "Saved channel blocker",
      createdAt: "2026-05-27T20:52:00.000Z",
      sourceType: "channel-economics",
      searchQuery: "demand source blocker drilldown channel-economics",
    };
    const blockerPacketTriage = {
      id: "triage-view-channel-economics-blocker",
      savedViewId: "view-channel-economics-blocker",
      savedViewName: "Saved channel blocker",
      packetId: "view-channel-economics-blocker-packet",
      sourceType: "channel-economics",
      searchQuery: "demand source blocker drilldown channel-economics",
      status: "delegated",
      updatedAt: "2026-05-27T20:53:00.000Z",
    };
    const blockerPacketTriageAuditEntry = {
      id: "triage-audit-view-channel-economics-blocker",
      savedViewId: "view-channel-economics-blocker",
      savedViewName: "Saved channel blocker",
      packetId: "view-channel-economics-blocker-packet",
      sourceType: "channel-economics",
      searchQuery: "demand source blocker drilldown channel-economics",
      previousStatus: "needs-evidence",
      nextStatus: "delegated",
      recordedAt: "2026-05-27T20:54:00.000Z",
    };
    const staleBlockerWorkloadSummary = {
      id: "demand-source-blocker-packet-workload-test-channel-economics-stale",
      owner: "test@marketpulse.dev",
      sourceType: "channel-economics",
      searchAnchor: "blocker packet owner workload test@marketpulse.dev channel-economics",
      queueItemIds: ["stale-workload-queue-item-a", "stale-workload-queue-item-b", "stale-workload-queue-item-c"],
      savedViewNames: ["Saved channel blocker"],
      activeCount: 3,
      delegatedCount: 2,
      needsEvidenceCount: 1,
      staleCount: 1,
      missingEvidenceCount: 1,
      latestTransitionAt: "2026-05-20T10:00:00.000Z",
    };
    const carriedAuditEntry = {
      id: "carried-import-audit",
      recordedAt: "2026-05-27T20:40:00.000Z",
      status: "blocked",
      ventureCount: 0,
      savedViewCount: 0,
      mode: "keep-both",
      collisionCount: 0,
      added: 0,
      renamed: 0,
      replaced: 0,
      skipped: 0,
      blockedReason: "Imported audit history carried over.",
    };
    const importPayload = buildPortfolioImportPayload([savedView], [carriedAuditEntry]);
    const blockerViewImportPayload = buildPortfolioImportPayload([], [], [blockerSavedView], [blockerPacketTriage], [blockerPacketTriageAuditEntry], [staleBlockerWorkloadSummary]);
    const portfolioWithoutSavedViews = JSON.parse(importPayload) as Record<string, unknown>;
    delete portfolioWithoutSavedViews.deploymentEscalationAuditSavedViews;
    delete portfolioWithoutSavedViews.demandSourceBlockerSavedViews;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketTriage;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketTriageAuditHistory;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketTriageOwnerWorkloadSummary;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketTriageWorkloadDriftReconciliation;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketTriageWorkloadPinnedSummaries;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffHealth;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffRemediationQueue;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffRemediationPlans;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffRemediationClosures;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalations;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews;
    delete portfolioWithoutSavedViews.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals;
    const importPayloadWithoutSavedViews = JSON.stringify(portfolioWithoutSavedViews);

    await page.goto("/ventures");
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("[aria-label='Converted pain memory']").getByText("Burned-out students need help.", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Converted pain memory']").getByText("$360", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Converted pricing memory']").getByText("$9/month", { exact: true }).first()).toBeVisible();
    await expect(page.locator("[aria-label='Converted pricing memory']").getByText("$180", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='MVP feature memory']").getByText("Completed Sunday reset plan.", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='MVP feature memory']").getByText(/5 retained/)).toBeVisible();
    await expect(page.locator("[aria-label='Retained user memory']").getByText("Campus pilot cohort", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Retained user memory']").getByText(/63% retained/)).toBeVisible();
    await expect(page.locator("[aria-label='Success prediction memory']").getByText("Fake-door waitlist test", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Success prediction memory']").getByText("confirmed", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Vanity metric memory']").getByText("campus awareness ads reach", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Vanity metric memory']").getByText("0 paid users, $0 revenue, no-payback payback", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Generated code pattern memory']").getByText("gen-z-recovery-planner", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Generated code pattern memory']").getByText("13 files · 6/6 proof checks · 5 MVP checks", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Empirical calibration memory']").getByText(/(medium|high) risk/)).toBeVisible();
    await expect(page.locator("[aria-label='Empirical calibration memory']").getByText("Do not scale this channel on impressions, clicks, or signups alone.", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Fake market memory']").getByText("Gen Z students via campus awareness ads reach", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Fake market memory']").getByText("Do not treat this market as attractive again without fresh measured demand, paid intent, retained users, or channel payback that reverses the fake signal.", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Wrong claim memory']").getByText("Evidence supports weekly routines.", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Wrong claim memory']").getByText("Missing x coverage.", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Worked channel memory']").getByText("creator partnerships", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Worked channel memory']").getByText("$180", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Failed outreach memory']").getByText("creator partnerships", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Failed outreach memory']").getByText("Requires a human-approved outreach record before any external contact.", { exact: true })).toBeVisible();

    const importDraft = page.getByPlaceholder("Paste portfolio JSON...");
    const importButton = page.getByRole("button", { name: "Import portfolio JSON" });
    const portfolioImportPreview = page.locator("[aria-label='Portfolio import preview']");
    const portfolioImportPreviewWarnings = page.locator("[aria-label='Portfolio import preview warnings']");
    const deploymentEscalationAuditImportSummary = page.locator("[aria-label='Deployment escalation saved-view import summary']");
    const deploymentEscalationAuditReplay = page.locator("[aria-label='Deployment escalation audit replay']");
    const portfolioImportAuditHistory = page.locator("[aria-label='Portfolio import audit history']");
    const exportOutput = page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.");

    await importDraft.fill(importPayload);
    await expect(portfolioImportPreview.getByText("1 venture")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 saved view")).toBeVisible();
    await expect(portfolioImportPreview.getByText("0 collisions")).toBeVisible();
    await expect(portfolioImportPreview.getByText("Mode: Keep both")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 will add")).toBeVisible();
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(deploymentEscalationAuditImportSummary.getByText("1 added")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByRole("button", { name: "Apply saved view Saved collision check" })).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("Imported").first()).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("1 added").first()).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("Imported audit history carried over.")).toBeVisible();
    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(exportOutput).toHaveValue(/portfolioImportAuditHistory/);
    await expect(exportOutput).toHaveValue(/Imported audit history carried over/);

    await importDraft.fill(importPayload);
    await expect(portfolioImportPreview.getByText("1 collision")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 will rename")).toBeVisible();
    await importButton.click();
    await expect(deploymentEscalationAuditImportSummary.getByText("1 renamed")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByRole("button", { name: "Apply saved view Saved collision check (imported copy)" })).toBeVisible();

    await page.getByRole("combobox", { name: "Deployment escalation saved-view import collision mode" }).click();
    await page.getByRole("option", { name: "Replace matching saved views" }).click();
    await importDraft.fill(importPayload);
    await expect(portfolioImportPreview.getByText("Mode: Replace matching")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 will replace")).toBeVisible();
    await importButton.click();
    await expect(deploymentEscalationAuditImportSummary.getByText("1 replaced")).toBeVisible();

    await page.getByRole("combobox", { name: "Deployment escalation saved-view import collision mode" }).click();
    await page.getByRole("option", { name: "Skip matching saved views" }).click();
    await importDraft.fill(importPayload);
    await expect(portfolioImportPreview.getByText("Mode: Skip matching")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 will skip")).toBeVisible();
    await importButton.click();
    await expect(deploymentEscalationAuditImportSummary.getByText("1 skipped")).toBeVisible();

    await importDraft.fill(blockerViewImportPayload);
    await expect(portfolioImportPreview.getByText("1 saved view")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 packet triage state")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 triage audit entry")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 workload summary")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 will add")).toBeVisible();
    await importButton.click();
    const blockerDrilldowns = page.locator("[aria-label='Demand source blocker drilldowns']");
    const packetInbox = page.locator("[aria-label='Demand source blocker packet inbox']");
    await expect(deploymentEscalationAuditImportSummary.getByText("1 added")).toBeVisible();
    await expect(blockerDrilldowns.getByRole("button", { name: "Apply blocker source view Saved channel blocker" })).toBeVisible();
    await expect(packetInbox.getByText("1 delegated").first()).toBeVisible();
    await expect(packetInbox.getByText("Delegated", { exact: true }).first()).toBeVisible();
    await expect(packetInbox.getByText(/Latest transition: Needs evidence -> Delegated/).first()).toBeVisible();
    const packetWorkloadImportDrift = page.locator("[aria-label='Demand source blocker workload import drift']");
    await expect(packetWorkloadImportDrift.getByText("Imported workload drift report")).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText("1 unresolved drift warning")).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText("Count mismatch", { exact: true })).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText(/Imported active 3/)).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText(/current active 1/)).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText(/Latest transition imported 2026-05-20T10:00:00.000Z vs current 2026-05-/)).toBeVisible();
    await packetWorkloadImportDrift.getByRole("button", { name: "Mark drift reviewed" }).click();
    await expect(packetWorkloadImportDrift.getByText("0 unresolved drift warnings")).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText(/Reviewed by test@marketpulse.dev/)).toBeVisible();
    await expect(packetWorkloadImportDrift.locator("[aria-label='Demand source blocker workload import drift reconciliation history']").getByText(/reviewed test@marketpulse.dev \/ channel-economics/)).toBeVisible();
    await packetWorkloadImportDrift.getByRole("button", { name: "Pin current as authoritative" }).click();
    await expect(packetWorkloadImportDrift.getByText("1 pinned authoritative summary")).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText("Pinned authoritative summary").first()).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText(/Pinned current summary: 1 active, 1 delegated, 0 needs evidence/)).toBeVisible();
    const packetHandoffHealth = page.locator("[aria-label='Demand source blocker packet handoff health']");
    await expect(packetHandoffHealth.getByText("Portfolio handoff health")).toBeVisible();
    await expect(packetHandoffHealth.getByText("1 owner/source health group")).toBeVisible();
    await expect(packetHandoffHealth.getByText("1 drift snapshot").first()).toBeVisible();
    await expect(packetHandoffHealth.getByText("0 unresolved drift").first()).toBeVisible();
    await expect(packetHandoffHealth.getByText("1 pinned summary").first()).toBeVisible();
    await expect(packetHandoffHealth.getByText("Reconciled", { exact: true })).toBeVisible();
    await packetWorkloadImportDrift.getByRole("button", { name: "Show unresolved workload drift" }).click();
    await expect(packetWorkloadImportDrift.getByText("No workload drift reports match the current drift filter.")).toBeVisible();
    await packetWorkloadImportDrift.getByRole("button", { name: "Show all workload drift" }).click();
    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketTriageWorkloadDriftReconciliation/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketTriageWorkloadPinnedSummaries/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffHealth/);
    await expect(exportOutput).toHaveValue(/churnScore/);
    await expect(exportOutput).toHaveValue(/pinned-current/);
    await expect(exportOutput).toHaveValue(/reviewed/);
    const reconciledWorkloadExport = JSON.parse(await exportOutput.inputValue()) as {
      demandSourceBlockerPacketTriageWorkloadDriftReconciliation?: unknown[];
      demandSourceBlockerPacketTriageWorkloadPinnedSummaries?: unknown[];
      demandSourceBlockerPacketHandoffHealth?: unknown[];
    };
    await importDraft.fill(buildPortfolioImportPayload(
      [],
      [],
      [],
      [],
      [],
      [],
      reconciledWorkloadExport.demandSourceBlockerPacketTriageWorkloadDriftReconciliation ?? [],
      reconciledWorkloadExport.demandSourceBlockerPacketTriageWorkloadPinnedSummaries ?? [],
      reconciledWorkloadExport.demandSourceBlockerPacketHandoffHealth ?? [],
    ));
    await expect(portfolioImportPreview.getByText("2 drift reconciliation entries")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 pinned workload summary")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 handoff health group")).toBeVisible();
    const packetOwnerQueue = page.locator("[aria-label='Demand source blocker packet triage owner queue']");
    const packetWorkloadSummary = page.locator("[aria-label='Demand source blocker packet owner workload summary']");
    await expect(packetWorkloadSummary.getByText("Owner workload summary")).toBeVisible();
    await expect(packetWorkloadSummary.getByText("1 owner/source group")).toBeVisible();
    await expect(packetWorkloadSummary.getByText("1 delegated")).toBeVisible();
    await expect(packetWorkloadSummary.getByText(/Search anchor: blocker packet owner workload test@marketpulse.dev channel-economics/)).toBeVisible();
    await expect(packetOwnerQueue.getByText("Owner triage work queue")).toBeVisible();
    await expect(packetOwnerQueue.getByText(/test@marketpulse.dev \/ channel-economics \/ delegated/)).toBeVisible();
    await blockerDrilldowns.getByRole("button", { name: "Apply blocker source view Saved channel blocker" }).click();
    await expect(page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...")).toHaveValue("demand source blocker drilldown channel-economics");
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("");

    await importDraft.fill(blockerViewImportPayload);
    await expect(portfolioImportPreview.getByText("1 collision")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 will skip")).toBeVisible();
    await importButton.click();
    await expect(deploymentEscalationAuditImportSummary.getByText("1 skipped")).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText("1 pinned authoritative summary")).toBeVisible();
    await expect(packetWorkloadImportDrift.getByText(/Pinned current summary: 1 active, 1 delegated, 0 needs evidence/).first()).toBeVisible();
    await expect(packetHandoffHealth.getByText("2 drift snapshots").first()).toBeVisible();
    await expect(packetHandoffHealth.getByText("1 repeated drift event").first()).toBeVisible();
    await expect(packetHandoffHealth.getByText("Repeated drift churn")).toBeVisible();

    const packetHandoffRemediation = page.locator("[aria-label='Demand source blocker packet handoff remediation queue']");
    await expect(packetHandoffRemediation).toBeVisible();
    await expect(packetHandoffRemediation.getByText("Handoff remediation queue")).toBeVisible();
    await expect(packetHandoffRemediation.getByText(/1 remediation item/)).toBeVisible();
    await expect(packetHandoffRemediation.getByText("high", { exact: true })).toBeVisible();
    await expect(packetHandoffRemediation.getByText("repeated drift", { exact: true })).toBeVisible();
    await expect(packetHandoffRemediation.getByText(/Proof required: Attach a fresh owner workload summary/)).toBeVisible();
    await packetHandoffRemediation.getByRole("button", { name: /Mark remediation planned test@marketpulse\.dev channel-economics/ }).click();
    await expect(packetHandoffRemediation.getByText("1 planned")).toBeVisible();
    await expect(packetHandoffRemediation.getByText(/Planned by test@marketpulse\.dev/)).toBeVisible();
    const remediationProofCapture = packetHandoffRemediation.locator("[aria-label='Handoff remediation proof capture test@marketpulse.dev channel-economics']");
    await expect(remediationProofCapture).toBeVisible();
    await remediationProofCapture.getByPlaceholder("Remediation proof summary").fill("Attached fresh owner workload summary and reconciled repeated drift before the next transfer.");
    await remediationProofCapture.getByPlaceholder("Closure artifact or receipt link").fill("handoff-remediation-test-receipt.md");
    await remediationProofCapture.getByRole("button", { name: /Close remediation with proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(packetHandoffRemediation.getByText("1 proof-closed")).toBeVisible();
    await expect(packetHandoffRemediation.getByText("proof-closed", { exact: true })).toBeVisible();
    await expect(packetHandoffRemediation.getByText(/Closure proof: Attached fresh owner workload summary/)).toBeVisible();
    await expect(packetHandoffRemediation.getByText(/Linked drift reports:/)).toBeVisible();
    await importDraft.fill(blockerViewImportPayload);
    await expect(portfolioImportPreview.getByText("1 collision")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 will skip")).toBeVisible();
    await importButton.click();
    await expect(packetHandoffRemediation.getByText("1 ready")).toBeVisible();
    await expect(packetHandoffRemediation.getByLabel("Re-opened handoff remediation").getByText("Re-opened after 1 closure receipt")).toBeVisible();
    await expect(packetHandoffRemediation.getByText(/Previous closure proof: Attached fresh owner workload summary/)).toBeVisible();
    await expect(packetHandoffRemediation.getByText(/New drift reason: Imported drift arrived after closure/)).toBeVisible();
    const packetHandoffReopenEscalation = page.locator("[aria-label='Demand source blocker packet handoff reopen escalation']");
    await expect(packetHandoffReopenEscalation).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText("Reopened handoff remediation escalations")).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/1 reopen escalation/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/1 failed closure receipt/).first()).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/Reason: Imported drift arrived after closure/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/Failed proof: Attached fresh owner workload summary/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/Search anchor: blocker packet owner workload test@marketpulse.dev channel-economics/)).toBeVisible();
    await packetHandoffReopenEscalation.getByRole("button", { name: /Assign escalation SLA test@marketpulse\.dev channel-economics/ }).click();
    await expect(packetHandoffReopenEscalation.getByText(/1 overdue SLA/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/SLA owner: test@marketpulse\.dev/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/SLA due:/)).toBeVisible();
    const reopenSlaProofCapture = packetHandoffReopenEscalation.locator("[aria-label='Reopen escalation SLA proof capture test@marketpulse.dev channel-economics']");
    await expect(reopenSlaProofCapture).toBeVisible();
    await reopenSlaProofCapture.getByPlaceholder("SLA resolution proof summary").fill("Attached fresh workload summary after the failed closure and confirmed the reopened drift is owner-tracked.");
    await reopenSlaProofCapture.getByPlaceholder("SLA resolution artifact or receipt link").fill("reopen-sla-resolution-test-receipt.md");
    await reopenSlaProofCapture.getByRole("button", { name: /Resolve escalation SLA with proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(packetHandoffReopenEscalation.getByText(/0 overdue SLAs/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/1 resolved SLA receipt/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/1 breached history receipt/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/resolved overdue SLA/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/SLA resolution proof: Attached fresh workload summary/)).toBeVisible();
    await expect(packetHandoffReopenEscalation.getByText(/Failed proof: Attached fresh owner workload summary/)).toBeVisible();
    const reopenSlaBreachTrends = page.locator("[aria-label='Demand source blocker packet handoff reopen SLA breach trends']");
    await expect(reopenSlaBreachTrends.getByText("Reopen SLA breach trends")).toBeVisible();
    await expect(reopenSlaBreachTrends.getByText("1 breach trend")).toBeVisible();
    await expect(reopenSlaBreachTrends.getByText(/1 breached SLA resolution/)).toBeVisible();
    await expect(reopenSlaBreachTrends.getByText(/test@marketpulse\.dev/).first()).toBeVisible();
    await expect(reopenSlaBreachTrends.getByText(/Latest breach:/)).toBeVisible();
    await expect(reopenSlaBreachTrends.getByText(/Next: Review the breached SLA receipt/)).toBeVisible();
    await reopenSlaBreachTrends.getByRole("button", { name: /Create breach process plan test@marketpulse\.dev channel-economics/ }).click();
    await expect(reopenSlaBreachTrends.getByText("1 process plan")).toBeVisible();
    const breachProcessPlan = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process plan test@marketpulse.dev channel-economics']");
    await expect(breachProcessPlan).toBeVisible();
    await expect(breachProcessPlan.getByText("process plan assigned")).toBeVisible();
    await expect(breachProcessPlan.getByText(/Process owner: test@marketpulse\.dev/)).toBeVisible();
    await expect(breachProcessPlan.getByText(/Follow-up proof: Pending owner\/source process proof/)).toBeVisible();
    await expect(breachProcessPlan.getByText(/Proof required: Attach a process-change receipt/)).toBeVisible();
    const breachProcessProofCapture = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process proof capture test@marketpulse.dev channel-economics']");
    await expect(breachProcessProofCapture).toBeVisible();
    await breachProcessProofCapture.getByPlaceholder("Process-change proof summary").fill("Added a pre-due review checklist for reopened SLA work and named the breached receipt owner.");
    await breachProcessProofCapture.getByPlaceholder("Process-change artifact or receipt link").fill("reopen-sla-breach-process-closure.md");
    await breachProcessProofCapture.getByRole("button", { name: /Close breach process plan with proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(reopenSlaBreachTrends.getByText("1 process closure")).toBeVisible();
    await expect(breachProcessPlan.getByText("process plan proof-closed")).toBeVisible();
    await expect(breachProcessPlan.getByText(/Closure proof: Added a pre-due review checklist/)).toBeVisible();
    await expect(breachProcessPlan.getByText(/Closure artifact: reopen-sla-breach-process-closure\.md/)).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2099-05-28T14:10:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: [{
        id: "reopen-escalation-sla-resolution-regression-test-2",
        slaReceiptId: "reopen-escalation-sla-regression-test-2",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        resolvedBy: "test@marketpulse.dev",
        resolvedAt: "2099-05-28T14:10:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        wasOverdue: true,
        reopenedCount: 3,
        failedClosureCount: 1,
        proofSummary: "Second reopened SLA breached after the process closure.",
        proofArtifact: "reopen-sla-regression-resolution.md",
        nextAction: "Re-open process review.",
      }],
    }));
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(reopenSlaBreachTrends.getByText(/2 breached SLA resolutions/)).toBeVisible();
    await expect(reopenSlaBreachTrends.getByText("1 process regression")).toBeVisible();
    await expect(breachProcessPlan.getByText("process plan stale after closure")).toBeVisible();
    const breachProcessRegression = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process regression test@marketpulse.dev channel-economics']");
    await expect(breachProcessRegression).toBeVisible();
    await expect(breachProcessRegression.getByText(/Prior closure proof: Added a pre-due review checklist/)).toBeVisible();
    await expect(breachProcessRegression.getByText(/Prior closure artifact: reopen-sla-breach-process-closure\.md/)).toBeVisible();
    await expect(breachProcessRegression.getByText(/New breached receipts: reopen-escalation-sla-resolution-regression-test-2/)).toBeVisible();
    const regressionClosureHistory = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process regression closure history test@marketpulse.dev channel-economics']");
    await expect(regressionClosureHistory.getByText("0 regression re-closures")).toBeVisible();
    const regressionProofCapture = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process regression proof capture test@marketpulse.dev channel-economics']");
    await regressionProofCapture.getByPlaceholder("Regression re-closure proof summary").fill("Added a regression review checkpoint for reopened SLA breaches after process closure.");
    await regressionProofCapture.getByPlaceholder("Regression re-closure artifact or receipt link").fill("reopen-sla-breach-regression-reclosure-1.md");
    await regressionProofCapture.getByRole("button", { name: /Close stale process regression with proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionClosureHistory.getByText("1 regression re-closure")).toBeVisible();
    await expect(regressionClosureHistory.getByText(/Regression closure proof: Added a regression review checkpoint/)).toBeVisible();
    await expect(regressionClosureHistory.getByText(/Regression closure artifact: reopen-sla-breach-regression-reclosure-1\.md/)).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2100-05-28T14:10:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: [{
        id: "reopen-escalation-sla-resolution-regression-test-3",
        slaReceiptId: "reopen-escalation-sla-regression-test-3",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        resolvedBy: "test@marketpulse.dev",
        resolvedAt: "2100-05-28T14:10:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        wasOverdue: true,
        reopenedCount: 4,
        failedClosureCount: 1,
        proofSummary: "Third reopened SLA breached after the first regression re-closure.",
        proofArtifact: "reopen-sla-regression-resolution-3.md",
        nextAction: "Add another regression closure without overwriting prior proof.",
      }],
    }));
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(reopenSlaBreachTrends.getByText(/3 breached SLA resolutions/)).toBeVisible();
    await expect(regressionClosureHistory.getByText("1 regression re-closure")).toBeVisible();
    await expect(regressionClosureHistory.getByText(/reopen-sla-breach-regression-reclosure-1\.md/)).toBeVisible();
    const regressionEscalation = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process regression escalation test@marketpulse.dev channel-economics']");
    await expect(reopenSlaBreachTrends.getByText("1 regression escalation")).toBeVisible();
    await expect(regressionEscalation.getByText("rebreach after re-closure")).toBeVisible();
    await expect(regressionEscalation.getByText(/Higher-severity process audit required/)).toBeVisible();
    await expect(regressionEscalation.getByText(/reopen-escalation-sla-resolution-regression-test-3/)).toBeVisible();
    const regressionEscalationAudit = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process regression escalation audit test@marketpulse.dev channel-economics']");
    await expect(regressionEscalationAudit.getByText("0 audit assignments")).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit proof open")).toBeVisible();
    await regressionEscalationAudit.getByRole("button", { name: /Assign regression escalation audit test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("1 audit assignment")).toBeVisible();
    await expect(regressionEscalationAudit.getByText("Audit owner: test@marketpulse.dev")).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Regression escalation audit proof summary").fill("Added a higher-severity process audit for regression rebreach history.");
    await regressionEscalationAudit.getByPlaceholder("Regression escalation audit artifact or receipt link").fill("reopen-sla-breach-regression-escalation-audit-1.md");
    await regressionEscalationAudit.getByRole("button", { name: /Close regression escalation audit with proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit proof-closed")).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Audit closure proof: Added a higher-severity process audit/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Audit closure artifact: reopen-sla-breach-regression-escalation-audit-1\.md/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit review required")).toBeVisible();
    await expect(regressionEscalationAudit.getByText("Independent review required before stability can be accepted.")).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Independent reviewer identity").fill("ops-reviewer-one@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review summary").fill("Independent reviewer disputes the audit until blocker evidence is attached.");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review artifact or dispute packet").fill("reopen-sla-breach-regression-escalation-audit-dispute-1.md");
    await regressionEscalationAudit.getByRole("button", { name: /Dispute regression escalation audit review test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit dispute unresolved").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit closure reopened").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Stability blocked by independent dispute/)).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Independent reviewer identity").fill("ops-reviewer-one@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review summary").fill("Corrective packet links the missing blocker evidence and owner signoff.");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review artifact or dispute packet").fill("reopen-sla-breach-regression-escalation-audit-corrective-1.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record corrective audit proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum required").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit closure reopened").first()).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Independent reviewer identity").fill("ops-reviewer-two@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review summary").fill("Independent reviewer re-disputes stability until the next breached receipt is resolved.");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review artifact or dispute packet").fill("reopen-sla-breach-regression-escalation-audit-dispute-2.md");
    await regressionEscalationAudit.getByRole("button", { name: /Dispute regression escalation audit review test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("2 independent reviewers")).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum required").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Appeal quorum required before stability can be accepted/)).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Appeal packet keeps stability blocked until two reviewers clear corrective proof.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-required-1.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record audit appeal packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Appeal packet quorum-required/)).toBeVisible();
    await regressionProofCapture.getByPlaceholder("Regression re-closure proof summary").fill("Added a second regression closure after another reopened SLA breach.");
    await regressionProofCapture.getByPlaceholder("Regression re-closure artifact or receipt link").fill("reopen-sla-breach-regression-reclosure-2.md");
    await regressionProofCapture.getByRole("button", { name: /Close stale process regression with proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionClosureHistory.getByText("2 regression re-closures")).toBeVisible();
    await expect(regressionEscalation.getByText("rebreach after re-closure")).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit closure reopened").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum required").first()).toBeVisible();
    await expect(regressionClosureHistory.getByText(/Regression closure proof: Added a second regression closure/)).toBeVisible();
    await expect(regressionClosureHistory.getByText(/reopen-sla-breach-regression-reclosure-1\.md/)).toBeVisible();
    await expect(regressionClosureHistory.getByText(/reopen-sla-breach-regression-reclosure-2\.md/)).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2101-05-28T14:10:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: [{
        id: "reopen-escalation-sla-resolution-regression-test-4",
        slaReceiptId: "reopen-escalation-sla-regression-test-4",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        resolvedBy: "test@marketpulse.dev",
        resolvedAt: "2101-05-28T14:10:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        wasOverdue: true,
        reopenedCount: 5,
        failedClosureCount: 1,
        proofSummary: "Fourth reopened SLA breached after the escalation audit closure.",
        proofArtifact: "reopen-sla-regression-resolution-4.md",
        nextAction: "Reopen the escalation audit instead of accepting closure.",
      }],
    }));
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(reopenSlaBreachTrends.getByText(/4 breached SLA resolutions/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit closure reopened").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum required").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Stability blocked by independent dispute/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/New receipts after audit closure: reopen-escalation-sla-resolution-regression-test-4/)).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Independent reviewer identity").fill("ops-reviewer-two@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review summary").fill("Corrective proof after the fourth breach links the reopened receipt and quorum evidence.");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review artifact or dispute packet").fill("reopen-sla-breach-regression-escalation-audit-corrective-quorum-2.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record corrective audit proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum required").first()).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Two independent reviewers cleared the corrected audit after the fourth breached receipt.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-cleared-2.md");
    await regressionEscalationAudit.getByRole("button", { name: /Clear audit appeal quorum test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum cleared").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Appeal quorum cleared by/)).toBeVisible();
    // Appeal-clearance durability monitoring: a fifth breached receipt after the quorum clearance makes it stale.
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2102-05-28T14:10:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: [{
        id: "reopen-escalation-sla-resolution-regression-test-5",
        slaReceiptId: "reopen-escalation-sla-regression-test-5",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        resolvedBy: "test@marketpulse.dev",
        resolvedAt: "2102-05-28T14:10:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        wasOverdue: true,
        reopenedCount: 6,
        failedClosureCount: 1,
        proofSummary: "Fifth reopened SLA breached after the audit appeal quorum was cleared.",
        proofArtifact: "reopen-sla-regression-resolution-5.md",
        nextAction: "Mark the prior quorum clearance stale and require a fresh re-clearance.",
      }],
    }));
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(reopenSlaBreachTrends.getByText(/5 breached SLA resolutions/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit clearance stale").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit appeal clearance stale").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Prior appeal quorum clearance .* is stale after a later reopened SLA breach/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Reopened-after-clearance receipts: reopen-escalation-sla-resolution-regression-test-5/)).toBeVisible();
    // The prior quorum clearance packet is preserved in the appeal history.
    await expect(regressionEscalationAudit.getByText(/Appeal packet quorum-cleared/).first()).toBeVisible();
    // A fresh stale-clearance appeal packet must be recorded before any re-clearance.
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Prior quorum clearance is stale; preserve it and reopen the audit for the fifth breached receipt.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-stale-3.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record stale clearance appeal packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Appeal packet clearance-stale/)).toBeVisible();
    // A fresh corrective review after the stale-clearance packet is required.
    await regressionEscalationAudit.getByPlaceholder("Independent reviewer identity").fill("ops-reviewer-two@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review summary").fill("Corrective proof after the stale clearance packet links the fifth reopened receipt.");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review artifact or dispute packet").fill("reopen-sla-breach-regression-escalation-audit-corrective-stale-3.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record corrective audit proof test@marketpulse\.dev channel-economics/ }).click();
    // Only now can a fresh two-reviewer re-clearance be recorded.
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Two independent reviewers re-cleared the appeal after the fifth breached receipt was corrected.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-recleared-3.md");
    await regressionEscalationAudit.getByRole("button", { name: /Re-clear audit appeal quorum test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum cleared").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Appeal quorum re-cleared by .* after stale clearance/)).toBeVisible();
    // Appeal re-clearance audit calibration: a sixth breach makes the re-cleared appeal stale a second time,
    // proving a chronically re-breaching owner/source is flagged fragile even after each re-clearance succeeds.
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2103-05-28T14:10:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: [{
        id: "reopen-escalation-sla-resolution-regression-test-6",
        slaReceiptId: "reopen-escalation-sla-regression-test-6",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        resolvedBy: "test@marketpulse.dev",
        resolvedAt: "2103-05-28T14:10:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        wasOverdue: true,
        reopenedCount: 7,
        failedClosureCount: 1,
        proofSummary: "Sixth reopened SLA breached after the appeal was re-cleared.",
        proofArtifact: "reopen-sla-regression-resolution-6.md",
        nextAction: "Mark the re-clearance stale again and require another fresh re-clearance.",
      }],
    }));
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(reopenSlaBreachTrends.getByText(/6 breached SLA resolutions/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit clearance stale").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Reopened-after-clearance receipts: reopen-escalation-sla-resolution-regression-test-6/)).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Re-cleared appeal is stale again after the sixth breached receipt; preserve it and reopen.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-stale-6.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record stale clearance appeal packet test@marketpulse\.dev channel-economics/ }).click();
    // Two recorded stale recurrences now flag the owner/source clearance as fragile.
    const appealCalibration = reopenSlaBreachTrends.locator("[aria-label='Reopen SLA breach process regression escalation appeal re-clearance calibration test@marketpulse.dev channel-economics']");
    await expect(regressionEscalationAudit.getByText("fragile clearance").first()).toBeVisible();
    await expect(appealCalibration.getByText(/Fragile clearance: 2 clearance\/governance packets went stale/)).toBeVisible();
    await expect(appealCalibration.getByText(/Chronic re-breach detected/)).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Independent reviewer identity").fill("ops-reviewer-two@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review summary").fill("Corrective proof after the second stale clearance packet links the sixth reopened receipt.");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review artifact or dispute packet").fill("reopen-sla-breach-regression-escalation-audit-corrective-stale-6.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record corrective audit proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Fragile clearance governance required/)).toBeVisible();
    await expect(regressionEscalationAudit.getByRole("button", { name: /Re-clear audit appeal quorum test@marketpulse\.dev channel-economics/ })).toHaveCount(0);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Fragile governance assigns a separate owner and rotated reviewer before another re-clearance.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-packet-6.md");
    await regressionEscalationAudit.getByPlaceholder("Fragile remediation owner").fill("fragile-remediation-owner@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Fragile escalation artifact").fill("fragile-clearance-governance-escalation-6.md");
    await regressionEscalationAudit.getByPlaceholder("Reviewer rotation proof").fill("ops-reviewer-three is rotated in before this fragile owner/source can be treated as stable.");
    await regressionEscalationAudit.getByPlaceholder("Rotated reviewer identity").fill("ops-reviewer-three@marketpulse.dev");
    await page.evaluate(`
      (() => {
        if (window.__marketpulseSetMockNow) return;
        const RealDate = Date;
        window.__marketpulseMockNow = RealDate.now();
        window.__marketpulseSetMockNow = (iso) => { window.__marketpulseMockNow = RealDate.parse(iso); };
        class MockDate extends RealDate {
          constructor(...args) {
            if (args.length === 0) {
              super(window.__marketpulseMockNow);
            } else {
              super(...args);
            }
          }
          static now() { return window.__marketpulseMockNow; }
          static parse(value) { return RealDate.parse(value); }
          static UTC(...args) { return RealDate.UTC(...args); }
        }
        window.Date = MockDate;
      })();
    `);
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-20T14:10:00.000Z")`);
    await regressionEscalationAudit.getByRole("button", { name: /Record fragile clearance governance packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Appeal packet fragile-governance/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Fragile governance accepted: fragile-remediation-owner@marketpulse\.dev owns remediation/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-30T14:10:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Fragile governance aged without a successful re-clearance.");
    await expect(regressionEscalationAudit.getByText(/Fragile governance stale: fragile-clearance-governance-escalation-6\.md sat 10 days without successful re-clearance/)).toBeVisible();
    await expect(regressionEscalationAudit.getByRole("button", { name: /Re-clear audit appeal quorum test@marketpulse\.dev channel-economics/ })).toHaveCount(0);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-stale-aged-6.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record stale fragile governance packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Stale governance reason: aged-without-reclearance; age 10 days/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-30T14:11:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Replacement fragile governance assigns a fresh owner and aged reviewer before the sixth receipt re-clearance.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-packet-aged-6.md");
    await regressionEscalationAudit.getByPlaceholder("Fragile remediation owner").fill("fragile-remediation-owner-aged@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Fragile escalation artifact").fill("fragile-clearance-governance-escalation-aged-6.md");
    await regressionEscalationAudit.getByPlaceholder("Reviewer rotation proof").fill("ops-reviewer-aged is rotated in because the prior governance packet expired before re-clearance.");
    await regressionEscalationAudit.getByPlaceholder("Rotated reviewer identity").fill("ops-reviewer-aged@marketpulse.dev");
    await regressionEscalationAudit.getByRole("button", { name: /Record fragile clearance governance packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Fragile governance accepted: fragile-remediation-owner-aged@marketpulse\.dev owns remediation/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-30T14:12:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Two independent reviewers re-cleared the appeal again after the sixth breached receipt.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-recleared-6.md");
    await regressionEscalationAudit.getByRole("button", { name: /Re-clear audit appeal quorum test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum cleared").first()).toBeVisible();
    // Fragility persists even though the latest individual re-clearance succeeded.
    await expect(regressionEscalationAudit.getByText("fragile clearance").first()).toBeVisible();
    await expect(appealCalibration.getByText(/Fragile clearance: 3 clearance\/governance packets went stale/)).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2104-05-28T14:10:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: [{
        id: "reopen-escalation-sla-resolution-regression-test-7",
        slaReceiptId: "reopen-escalation-sla-regression-test-7",
        escalationId: "reopen-escalation-test-channel-economics",
        remediationId: "remediation-test-channel-economics-repeated-drift",
        owner: "test@marketpulse.dev",
        sourceType: "channel-economics",
        assignedOwner: "test@marketpulse.dev",
        resolvedBy: "test@marketpulse.dev",
        resolvedAt: "2104-05-28T14:10:00.000Z",
        dueAt: "2026-05-28T12:05:00.000Z",
        wasOverdue: true,
        reopenedCount: 8,
        failedClosureCount: 1,
        proofSummary: "Seventh reopened SLA breached after fragile governance was accepted.",
        proofArtifact: "reopen-sla-regression-resolution-7.md",
        nextAction: "Mark fragile governance stale and require a fresh rotated governance lane.",
      }],
    }));
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(reopenSlaBreachTrends.getByText(/7 breached SLA resolutions/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText("audit clearance stale").first()).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Fragile governance stale:/)).toBeVisible();
    await expect(regressionEscalationAudit.getByText(/Fragile governance stale: .*reopen-escalation-sla-resolution-regression-test-7/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-30T14:13:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Re-cleared appeal is stale after the seventh breached receipt.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-stale-7.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record stale clearance appeal packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Record a stale fragile-governance packet before a fresh rotated owner\/reviewer lane can be reused/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-30T14:14:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Prior fragile governance is stale after the seventh breached receipt.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-stale-7.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record stale fragile governance packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/reopen-sla-breach-regression-escalation-audit-fragile-governance-stale-7\.md/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-30T14:15:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Independent reviewer identity").fill("ops-reviewer-two@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review summary").fill("Corrective proof after stale governance links the seventh reopened receipt.");
    await regressionEscalationAudit.getByPlaceholder("Independent audit review artifact or dispute packet").fill("reopen-sla-breach-regression-escalation-audit-corrective-stale-governance-7.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record corrective audit proof test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByRole("button", { name: /Re-clear audit appeal quorum test@marketpulse\.dev channel-economics/ })).toHaveCount(0);
    await page.evaluate(`window.__marketpulseSetMockNow("2104-05-30T14:16:00.000Z")`);
    await expect(regressionEscalationAudit.getByText(/Fragile governance revocation required/)).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Governance council revokes the repeated stale fragile governance lane before another replacement.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-revocation-7.md");
    await regressionEscalationAudit.getByPlaceholder("Fragile remediation owner").fill("fragile-governance-council@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Fragile escalation artifact").fill("fragile-governance-council-revocation-7.md");
    await regressionEscalationAudit.getByPlaceholder("Reviewer rotation proof").fill("Governance council revoked the aged owner/reviewer lane after two stale governance packets.");
    await regressionEscalationAudit.getByPlaceholder("Rotated reviewer identity").fill("governance-council-reviewer@marketpulse.dev");
    await regressionEscalationAudit.getByRole("button", { name: /Record fragile governance revocation packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(page.getByText("Fragile governance revocation requires two independent council reviewers")).toBeVisible();
    await regressionEscalationAudit.getByPlaceholder("Rotated reviewer identity").fill("governance-council-reviewer-one@marketpulse.dev, governance-council-reviewer-two@marketpulse.dev");
    await regressionEscalationAudit.getByRole("button", { name: /Record fragile governance revocation packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Appeal packet fragile-governance-revoked/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-06-08T14:16:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Governance council revocation expired without a replacement governance lane.");
    await expect(regressionEscalationAudit.getByText(/Governance council revocation stale: fragile-governance-council-revocation-7\.md sat 9 days without a fresh accepted governance lane/)).toBeVisible();
    await expect(regressionEscalationAudit.getByRole("button", { name: /Record fragile clearance governance packet test@marketpulse\.dev channel-economics/ })).toHaveCount(0);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-revocation-stale-7.md");
    await regressionEscalationAudit.getByRole("button", { name: /Record stale governance council revocation packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Stale governance council revocation packet:/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-06-08T14:17:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Replacement governance council revokes the stale council packet before another replacement.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-revocation-refresh-7.md");
    await regressionEscalationAudit.getByPlaceholder("Fragile remediation owner").fill("fragile-governance-council-refresh@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Fragile escalation artifact").fill("fragile-governance-council-revocation-refresh-7.md");
    await regressionEscalationAudit.getByPlaceholder("Reviewer rotation proof").fill("Replacement council revokes the stale council packet with two reviewers before governance can resume.");
    await regressionEscalationAudit.getByPlaceholder("Rotated reviewer identity").fill("governance-council-reviewer-three@marketpulse.dev, governance-council-reviewer-four@marketpulse.dev");
    await regressionEscalationAudit.getByRole("button", { name: /Record fragile governance revocation packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/reopen-sla-breach-regression-escalation-audit-fragile-governance-revocation-refresh-7\.md/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-06-08T14:18:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Attempted reuse of the revoked owner and reviewer should be rejected.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-reused-revoked-7.md");
    await regressionEscalationAudit.getByPlaceholder("Fragile remediation owner").fill("fragile-remediation-owner-aged@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Fragile escalation artifact").fill("fragile-clearance-governance-escalation-reused-revoked-7.md");
    await regressionEscalationAudit.getByPlaceholder("Reviewer rotation proof").fill("This tries to reuse the revoked aged reviewer lane.");
    await regressionEscalationAudit.getByPlaceholder("Rotated reviewer identity").fill("ops-reviewer-aged@marketpulse.dev");
    await regressionEscalationAudit.getByRole("button", { name: /Record fragile clearance governance packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(page.getByText("Revoked fragile governance owner or reviewer cannot be reused")).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-06-08T14:19:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Fresh fragile governance assigns a new owner and fourth reviewer before the seventh receipt re-clearance.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-fragile-governance-packet-7.md");
    await regressionEscalationAudit.getByPlaceholder("Fragile remediation owner").fill("fragile-remediation-owner-two@marketpulse.dev");
    await regressionEscalationAudit.getByPlaceholder("Fragile escalation artifact").fill("fragile-clearance-governance-escalation-7.md");
    await regressionEscalationAudit.getByPlaceholder("Reviewer rotation proof").fill("ops-reviewer-four is rotated in because the prior governance packet went stale.");
    await regressionEscalationAudit.getByPlaceholder("Rotated reviewer identity").fill("ops-reviewer-four@marketpulse.dev");
    await regressionEscalationAudit.getByRole("button", { name: /Record fragile clearance governance packet test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText(/Fragile governance accepted: fragile-remediation-owner-two@marketpulse\.dev owns remediation/)).toBeVisible();
    await page.evaluate(`window.__marketpulseSetMockNow("2104-06-08T14:20:00.000Z")`);
    await regressionEscalationAudit.getByPlaceholder("Audit appeal quorum summary").fill("Two independent reviewers re-cleared the appeal after stale governance was replaced.");
    await regressionEscalationAudit.getByPlaceholder("Audit appeal artifact or quorum packet").fill("reopen-sla-breach-regression-escalation-audit-appeal-recleared-7.md");
    await regressionEscalationAudit.getByRole("button", { name: /Re-clear audit appeal quorum test@marketpulse\.dev channel-economics/ }).click();
    await expect(regressionEscalationAudit.getByText("audit appeal quorum cleared").first()).toBeVisible();
    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffRemediationQueue/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffRemediationPlans/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffRemediationClosures/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalations/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals/);
    await expect(exportOutput).toHaveValue(/"trigger": "repeated-drift"/);
    await expect(exportOutput).toHaveValue(/"plannedBy": "test@marketpulse\.dev"/);
    await expect(exportOutput).toHaveValue(/"closedBy": "test@marketpulse\.dev"/);
    await expect(exportOutput).toHaveValue(/"assignedOwner": "test@marketpulse\.dev"/);
    await expect(exportOutput).toHaveValue(/"wasOverdue": true/);
    await expect(exportOutput).toHaveValue(/"status": "stale-after-closure"/);
    await expect(exportOutput).toHaveValue(/"reason": "rebreach-after-reclosure"/);
    await expect(exportOutput).toHaveValue(/"breachedResolutionIds"/);
    await expect(exportOutput).toHaveValue(/process-change receipt/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-process-closure\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-regression-resolution\.md/);
    await expect(exportOutput).toHaveValue(/reopen-escalation-sla-resolution-regression-test-3/);
    await expect(exportOutput).toHaveValue(/reopen-escalation-sla-resolution-regression-test-4/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-reclosure-1\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-reclosure-2\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-1\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-dispute-1\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-corrective-1\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-dispute-2\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-required-1\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-corrective-quorum-2\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-cleared-2\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-regression-resolution-5\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-stale-3\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-corrective-stale-3\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-recleared-3\.md/);
    await expect(exportOutput).toHaveValue(/"status": "clearance-stale"/);
    await expect(exportOutput).toHaveValue(/reopen-escalation-sla-resolution-regression-test-5/);
    await expect(exportOutput).toHaveValue(/reopen-sla-regression-resolution-6\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-stale-6\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-corrective-stale-6\.md/);
    await expect(exportOutput).toHaveValue(/"status": "fragile-governance"/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-packet-6\.md/);
    await expect(exportOutput).toHaveValue(/fragile-clearance-governance-escalation-6\.md/);
    await expect(exportOutput).toHaveValue(/ops-reviewer-three@marketpulse\.dev/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-recleared-6\.md/);
    await expect(exportOutput).toHaveValue(/reopen-escalation-sla-resolution-regression-test-6/);
    await expect(exportOutput).toHaveValue(/reopen-sla-regression-resolution-7\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-stale-7\.md/);
    await expect(exportOutput).toHaveValue(/"status": "fragile-governance-stale"/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-stale-aged-6\.md/);
    await expect(exportOutput).toHaveValue(/"staleGovernanceReason": "aged-without-reclearance"/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-stale-7\.md/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-packet-aged-6\.md/);
    await expect(exportOutput).toHaveValue(/fragile-clearance-governance-escalation-aged-6\.md/);
    await expect(exportOutput).toHaveValue(/ops-reviewer-aged@marketpulse\.dev/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-corrective-stale-governance-7\.md/);
    await expect(exportOutput).toHaveValue(/"status": "fragile-governance-revoked"/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-revocation-7\.md/);
    await expect(exportOutput).toHaveValue(/fragile-governance-council-revocation-7\.md/);
    await expect(exportOutput).toHaveValue(/governance-council-reviewer-one@marketpulse\.dev/);
    await expect(exportOutput).toHaveValue(/governance-council-reviewer-two@marketpulse\.dev/);
    await expect(exportOutput).toHaveValue(/"revocationReason": "repeated-stale-governance"/);
    await expect(exportOutput).toHaveValue(/"status": "fragile-governance-revocation-stale"/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-revocation-stale-7\.md/);
    await expect(exportOutput).toHaveValue(/"staleGovernanceRevocationReason": "aged-without-fresh-governance"/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-revocation-refresh-7\.md/);
    await expect(exportOutput).toHaveValue(/governance-council-reviewer-three@marketpulse\.dev/);
    await expect(exportOutput).toHaveValue(/governance-council-reviewer-four@marketpulse\.dev/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-fragile-governance-packet-7\.md/);
    await expect(exportOutput).toHaveValue(/fragile-clearance-governance-escalation-7\.md/);
    await expect(exportOutput).toHaveValue(/ops-reviewer-four@marketpulse\.dev/);
    await expect(exportOutput).toHaveValue(/reopen-sla-breach-regression-escalation-audit-appeal-recleared-7\.md/);
    await expect(exportOutput).toHaveValue(/reopen-escalation-sla-resolution-regression-test-7/);
    await expect(exportOutput).toHaveValue(/reopen-sla-resolution-test-receipt\.md/);
    await expect(exportOutput).toHaveValue(/handoff-remediation-test-receipt\.md/);
    const remediationExport = JSON.parse(await exportOutput.inputValue()) as {
      demandSourceBlockerPacketHandoffRemediationQueue?: unknown[];
      demandSourceBlockerPacketHandoffRemediationPlans?: unknown[];
      demandSourceBlockerPacketHandoffRemediationClosures?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalations?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?: unknown[];
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?: Array<{
        id?: string;
        fullPacketGateRequired?: boolean;
        digestCannotClearGovernance?: boolean;
        packetChainSignature?: string;
        packetCount?: number;
        staleGovernancePacketIds?: string[];
        councilRevocationPacketIds?: string[];
        staleCouncilRevocationPacketIds?: string[];
        packetSearchText?: string;
      }>;
    };
    type ExportedProcessArtifact = {
      id?: string;
      planId?: string;
      closureId?: string;
      trendId?: string;
      owner?: string;
      sourceType?: string;
      proofRequired?: string;
      proofSummary?: string;
      proofArtifact?: string;
      newBreachedResolutionIds?: string[];
    };
    const exportedProcessPlans = (remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans ?? []) as ExportedProcessArtifact[];
    const exportedProcessClosures = (remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures ?? []) as ExportedProcessArtifact[];
    const exportedProcessRegressions = (remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions ?? []) as ExportedProcessArtifact[];
    const exportedRegressionClosures = (remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures ?? []) as ExportedProcessArtifact[];
    const exportedProcessPlan = exportedProcessPlans.find((plan) => (
      plan.owner === "test@marketpulse.dev" &&
      plan.sourceType === "channel-economics"
    ));
    expect(exportedProcessPlan).toEqual(expect.objectContaining({
      proofRequired: expect.stringContaining("process-change receipt"),
    }));
    const exportedProcessPlanId = exportedProcessPlan?.id;
    const exportedProcessClosure = exportedProcessClosures.find((closure) => (
      closure.planId === exportedProcessPlanId &&
      closure.proofArtifact === "reopen-sla-breach-process-closure.md"
    ));
    expect(exportedProcessClosure).toEqual(expect.objectContaining({
      proofSummary: expect.stringContaining("Added a pre-due review checklist"),
    }));
    const exportedProcessRegression = exportedProcessRegressions.find((regression) => (
      regression.planId === exportedProcessPlanId &&
      regression.closureId === exportedProcessClosure?.id &&
      regression.proofArtifact === "reopen-sla-breach-process-closure.md"
    ));
    expect(exportedProcessRegression).toEqual(expect.objectContaining({
      newBreachedResolutionIds: expect.arrayContaining(["reopen-escalation-sla-resolution-regression-test-2"]),
    }));
    expect(exportedRegressionClosures.filter((closure) => closure.planId === exportedProcessPlanId).map((closure) => closure.proofArtifact)).toEqual(expect.arrayContaining([
      "reopen-sla-breach-regression-reclosure-1.md",
      "reopen-sla-breach-regression-reclosure-2.md",
    ]));
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalations?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures?.length ?? 0).toBeGreaterThan(1);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews?.length ?? 0).toBeGreaterThan(2);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals?.length ?? 0).toBeGreaterThan(1);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?.[0]).toEqual(expect.objectContaining({
      fullPacketGateRequired: true,
      digestCannotClearGovernance: true,
    }));
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?.[0].packetCount ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?.[0].staleGovernancePacketIds?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?.[0].councilRevocationPacketIds?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?.[0].staleCouncilRevocationPacketIds?.length ?? 0).toBeGreaterThan(0);
    expect(remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?.[0].packetSearchText ?? "").toContain("fragile-governance-council-revocation-7.md");
    const remediationReimportPayload = JSON.stringify({
      version: 1,
      exportedAt: "2026-05-28T12:00:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffRemediationQueue: remediationExport.demandSourceBlockerPacketHandoffRemediationQueue ?? [],
      demandSourceBlockerPacketHandoffRemediationPlans: remediationExport.demandSourceBlockerPacketHandoffRemediationPlans ?? [],
      demandSourceBlockerPacketHandoffRemediationClosures: remediationExport.demandSourceBlockerPacketHandoffRemediationClosures ?? [],
      demandSourceBlockerPacketHandoffReopenEscalations: remediationExport.demandSourceBlockerPacketHandoffReopenEscalations ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests ?? [],
    });
    await importDraft.fill(remediationReimportPayload);
    await expect(portfolioImportPreview.getByText("1 handoff remediation item")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 handoff remediation plan")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 handoff remediation closure receipt")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 handoff reopen escalation")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA receipt")).toBeVisible();
    await expect(portfolioImportPreview.getByText("7 reopen SLA resolutions")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA breach trend")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA breach process plan")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA breach process closure")).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA breach process regression", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("2 reopen SLA breach process regression closures", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA breach process regression escalation", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA breach process regression escalation audit assignment", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 reopen SLA breach process regression escalation audit closure", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("7 reopen SLA breach process regression escalation audit reviews", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("16 reopen SLA breach process regression escalation audit appeals", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 compact governance digest", { exact: true })).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2026-05-28T12:00:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests ?? [],
    }));
    await expect(portfolioImportPreview.getByText("1 compact governance digest", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("0 reopen SLA breach process regression escalation audit appeals", { exact: true })).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Compact governance digests are preview-only; full audit appeal packets are still required before governance or re-clearance gates can unlock.")).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2026-05-28T12:00:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests: (remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests ?? []).map((digest) => ({
        ...digest,
        packetChainSignature: "tampered",
      })),
    }));
    await expect(portfolioImportPreview.getByText("16 reopen SLA breach process regression escalation audit appeals", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 compact governance digest", { exact: true })).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("1 compact governance digest has a missing or altered packet chain and will stay preview-only.")).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2026-05-28T12:00:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests: (remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests ?? []).map((digest) => ({
        ...digest,
        exportedAt: "2026-05-28T12:00:00.000Z",
      })),
    }));
    await expect(portfolioImportPreview.getByText("16 reopen SLA breach process regression escalation audit appeals", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("1 compact governance digest", { exact: true })).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("1 compact governance digest is older than local governance packet history and will stay preview-only.")).toBeVisible();
    await importDraft.fill(JSON.stringify({
      version: 1,
      exportedAt: "2026-05-28T12:00:00.000Z",
      exportedBy: "test@marketpulse.dev",
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals ?? [],
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests: (remediationExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests ?? []).flatMap((digest) => [
        digest,
        {
          ...digest,
          id: `${digest.id}-competing-window`,
          packetChainSignature: "governance-digest-v1:competing-window",
          latestPacketAt: "2026-05-31T18:00:00.000Z",
          latestPacketId: "reopen-sla-breach-process-regression-escalation-audit-appeal-fragile-governance-revoked-test-1",
          packetCount: Math.max(1, (digest.packetCount ?? 1) - 1),
        },
      ]),
    }));
    await expect(portfolioImportPreview.getByText("16 reopen SLA breach process regression escalation audit appeals", { exact: true })).toBeVisible();
    await expect(portfolioImportPreview.getByText("2 compact governance digests", { exact: true })).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("1 compact governance digest conflict has competing signatures or packet windows; newest full appeal packets remain authoritative.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText(/Compact governance digest conflict drilldown for test@marketpulse\.dev \/ channel-economics/)).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText(/Digest ids: .*competing-window/)).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText(/Signatures: 2; packet windows: 2/)).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText(/Preferred full appeal packet: .* at 2104-06-08T14:19:00\.000Z\. Preview-only: compact summaries cannot overwrite or suppress appeal packets\./)).toBeVisible();
    await importButton.click();
    const governanceDigestConflictReceipt = page.locator("[aria-label^='Portfolio import governance digest conflict receipts']").first();
    await expect(governanceDigestConflictReceipt.getByText("1 preview-only digest conflict receipt")).toBeVisible();
    await expect(governanceDigestConflictReceipt.getByText(/Compact governance digest conflict drilldown for test@marketpulse\.dev \/ channel-economics/)).toBeVisible();
    await expect(governanceDigestConflictReceipt.getByText(/Digest ids: .*competing-window/)).toBeVisible();
    await expect(governanceDigestConflictReceipt.getByText(/Signatures: 2; packet windows: 2/)).toBeVisible();
    await expect(governanceDigestConflictReceipt.getByText(/Preferred full appeal packet: .* Preview-only: compact summaries cannot overwrite or suppress appeal packets\./)).toBeVisible();
    await page.getByRole("button", { name: "Export JSON" }).click();
    const conflictReceiptExport = JSON.parse(await exportOutput.inputValue()) as {
      portfolioImportAuditHistory?: Array<{
        compactGovernanceDigestConflictReceipts?: string[];
      }>;
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests?: Array<{
        id?: string;
      }>;
    };
    const conflictReceiptText = conflictReceiptExport.portfolioImportAuditHistory?.[0]?.compactGovernanceDigestConflictReceipts?.join(" ") ?? "";
    expect(conflictReceiptText).toContain("competing-window");
    expect(conflictReceiptText).toContain("packet windows: 2");
    expect(conflictReceiptText).toContain("Preview-only: compact summaries cannot overwrite or suppress appeal packets.");
    expect(
      conflictReceiptExport.demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests
        ?.some((digest) => digest.id?.includes("competing-window")) ?? false,
    ).toBe(false);
    const portfolioSearchInput = page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...");
    await portfolioSearchInput.fill("competing-window");
    await expect(portfolioImportAuditHistory.getByText(/1\/\d+ shown/)).toBeVisible();
    await expect(governanceDigestConflictReceipt.getByText(/competing-window/)).toBeVisible();
    await page.getByRole("button", { name: "Clear matching portfolio import audit history" }).click();
    await expect(portfolioImportAuditHistory.getByText(/0\/\d+ shown/)).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("1 matching pruned")).toBeVisible();
    await expect(page.locator("[aria-label^='Portfolio import governance digest conflict receipts']")).toHaveCount(0);
    await page.getByRole("button", { name: "Restore portfolio import audit history" }).click();
    await expect(portfolioImportAuditHistory.getByText(/1\/\d+ shown/)).toBeVisible();
    await expect(page.locator("[aria-label^='Portfolio import governance digest conflict receipts']").first().getByText(/competing-window/)).toBeVisible();
    await portfolioSearchInput.fill("");
    await importDraft.fill(JSON.stringify({
      ventures: [buildSavedVentureFixture()],
      demandSourceBlockerPacketHandoffRemediationQueue: "broken",
      demandSourceBlockerPacketHandoffRemediationPlans: "broken",
      demandSourceBlockerPacketHandoffRemediationClosures: "broken",
      demandSourceBlockerPacketHandoffReopenEscalations: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals: "broken",
      demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests: "broken",
    }));
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff remediation queue payload is malformed; no remediation queue items will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff remediation plans payload is malformed; no remediation plans will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff remediation closure receipts payload is malformed; no remediation closure receipts will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation payload is malformed; no reopen escalations will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA receipt payload is malformed; no reopen escalation SLA receipts will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA resolution payload is malformed; no reopen escalation SLA resolutions will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach trend payload is malformed; no reopen escalation SLA breach trends will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process plan payload is malformed; no reopen escalation SLA breach process plans will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process closure payload is malformed; no reopen escalation SLA breach process closures will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression payload is malformed; no reopen escalation SLA breach process regressions will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression closure payload is malformed; no reopen escalation SLA breach process regression closures will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation payload is malformed; no reopen escalation SLA breach process regression escalations will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit assignment payload is malformed; no reopen escalation SLA breach process regression escalation audit assignments will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit closure payload is malformed; no reopen escalation SLA breach process regression escalation audit closures will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit review payload is malformed; no reopen escalation SLA breach process regression escalation audit reviews will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation audit appeal payload is malformed; no reopen escalation SLA breach process regression escalation audit appeals will import.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Demand-source blocker packet handoff reopen escalation SLA breach process regression escalation governance digest payload is malformed; no compact governance digests will be previewed.")).toBeVisible();

    await importDraft.fill(importPayloadWithoutSavedViews);
    await expect(portfolioImportPreview.getByText("No deployment escalation saved-view payload found.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Valid ventures with no saved views.")).toBeVisible();
    await expect(importButton).toBeEnabled();

    await importDraft.fill("{\"ventures\": [], \"deploymentEscalationAuditSavedViews\": \"broken\"}");
    await expect(portfolioImportPreviewWarnings.getByText("No valid venture records found; import will be blocked.")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("Saved-view payload is malformed; no saved views will import.")).toBeVisible();
    await expect(importButton).toBeDisabled();
    await expect(page.locator("[aria-label='Portfolio import blocked reason']")).toHaveText("Import blocked: no valid venture records.");
    await expect(portfolioImportAuditHistory.getByText("Blocked").first()).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("Import blocked: no valid venture records.")).toBeVisible();

    await importDraft.fill("{not json");
    await expect(portfolioImportPreviewWarnings.getByText("Invalid JSON; import will be blocked.")).toBeVisible();
    await expect(importButton).toBeDisabled();
    await expect(page.locator("[aria-label='Portfolio import blocked reason']")).toHaveText("Import blocked: invalid JSON.");
    await expect(portfolioImportAuditHistory.getByText("Import blocked: invalid JSON.")).toBeVisible();

    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("invalid JSON");
    await expect(portfolioImportAuditHistory.getByText("1/8 shown")).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("Import blocked: invalid JSON.")).toBeVisible();
    await page.getByRole("button", { name: "Clear matching portfolio import audit history" }).click();
    await expect(portfolioImportAuditHistory.getByText("0/7 shown")).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("1 matching pruned")).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("No import audit entries match the current search.")).toBeVisible();
    await page.getByRole("button", { name: "Restore portfolio import audit history" }).click();
    await expect(portfolioImportAuditHistory.getByText("1/8 shown")).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("Import blocked: invalid JSON.")).toBeVisible();
    await page.getByRole("button", { name: "Clear all portfolio import audit history" }).click();
    await expect(portfolioImportAuditHistory.getByText("0/0 shown")).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("8 all pruned")).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    await expect(portfolioImportAuditHistory.getByText("0/0 shown")).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("8 all pruned")).toBeVisible();
    await expect(page.locator("[aria-label='Portfolio export pending import audit pruning']")).toContainText("8 pruned");
    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(exportOutput).toHaveValue(/portfolioImportAuditPruneSnapshot/);
    await expect(exportOutput).toHaveValue(/pending-restore/);
    const prunedExportPayload = await exportOutput.inputValue();
    await page.getByRole("button", { name: "Restore portfolio import audit history" }).click();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("invalid JSON");
    await expect(portfolioImportAuditHistory.getByText("1/8 shown")).toBeVisible();
    await expect(portfolioImportAuditHistory.getByText("Import blocked: invalid JSON.")).toBeVisible();
    await importDraft.fill(prunedExportPayload);
    await expect(portfolioImportPreview.getByText("8 pruned audit entries")).toBeVisible();
    await expect(portfolioImportPreviewWarnings.getByText("8 pruned import audit entries can be restored after import.")).toBeVisible();
    await importButton.click();
    await expect(portfolioImportAuditHistory.getByText("8 all pruned")).toBeVisible();
    await expect(page.locator("[aria-label='Portfolio export pending import audit pruning']")).toContainText("8 pruned");
    await page.getByRole("button", { name: "Restore portfolio import audit history" }).click();
    await expect(portfolioImportAuditHistory.getByText("1/8 shown")).toBeVisible();
  });

  test("Venture Lab: related idea merge audits render portfolio pair provenance", async ({ page }) => {
    const primary = buildSavedVentureFixture("Gen Z Recovery Planner");
    const related = {
      ...buildSavedVentureFixture("Gen Z Recovery Companion"),
      id: "venture-related-companion",
      savedAt: "2026-05-27T21:10:00.000Z",
      updatedAt: "2026-05-27T21:10:00.000Z",
      evidenceSources: [{
        id: "source-related-companion",
        platform: "youtube",
        title: "Students save burnout recovery routines",
        keywords: "burnout recovery, weekly routine",
        summary: "Students ask for lightweight weekly reset support.",
        url: "https://example.com/related-companion",
        views: 180000,
        comments: 420,
      }],
    };

    await page.addInitScript((ventures) => {
      localStorage.setItem("marketpulse-venture-portfolio:test-marketpulse.dev", JSON.stringify(ventures));
      sessionStorage.setItem("marketpulse_splash_shown", "1");
    }, [primary, related]);

    await page.goto("/ventures");
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    const mergeAudits = page.locator("[aria-label='Related idea merge audits']");
    await expect(mergeAudits).toBeVisible();
    await expect(mergeAudits.getByText("Merge related ideas", { exact: true })).toBeVisible();
    await expect(mergeAudits.getByText(/Human review only/)).toBeVisible();
    await expect(mergeAudits.getByText(/Gen Z Recovery Companion.*Gen Z Recovery Planner/).first()).toBeVisible();
    await expect(mergeAudits.getByText(/Primary evidence:/)).toBeVisible();
    await expect(mergeAudits.getByText(/Related evidence:/)).toBeVisible();

    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/relatedIdeaMergeAudits/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Merge Audit/);

    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("merge audit");
    await expect(mergeAudits).toBeVisible();
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Companion" })).toBeVisible();
  });

  test("Venture Lab: no-send reply proof capture saves redacted replies", async ({ page }) => {
    test.setTimeout(45000);
    await page.addInitScript((venture) => {
      if (!localStorage.getItem("marketpulse-venture-portfolio:test-marketpulse.dev")) {
        localStorage.setItem("marketpulse-venture-portfolio:test-marketpulse.dev", JSON.stringify([venture]));
      }
      sessionStorage.setItem("marketpulse_splash_shown", "1");
    }, buildDraftReadyNoSendVentureFixture());

    await page.goto("/ventures");
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    const worklist = page.locator("[aria-label='No-send email gate worklist']");
    await expect(worklist).toBeVisible();
    await expect(worklist.getByText("draft-ready", { exact: true })).toBeVisible();

    const replyProofCapture = page.locator("[aria-label^='No-send reply proof capture']").first();
    await expect(replyProofCapture).toBeVisible();
    await replyProofCapture.getByPlaceholder("Manual consent evidence, no recipient").fill("Manual consent reviewed outside the app; no recipient stored.");
    await replyProofCapture.getByPlaceholder("Redacted reply note, no email or phone...").fill("Reviewer asked for a local Sunday reset walkthrough before any account or payment.");
    await replyProofCapture.getByPlaceholder("Next action or mitigation").fill("Inspect demand capture proof queue before any external send.");
    await replyProofCapture.getByRole("button", { name: "Save reply proof" }).click();
    await expect(page.getByText("No-send reply proof saved")).toBeVisible();
    await expect(page.getByText("manual no-send email gate reply").first()).toBeVisible();
    await expect(page.getByText("Reviewer asked for a local Sunday reset walkthrough before any account or payment.").first()).toBeVisible();
    await expect(page.locator("[aria-label^='No-send reply proof receipts']").getByText("Customer interview").first()).toBeVisible();
    await expect(worklist.getByText(/1 converted reply proof receipt/)).toBeVisible();
    await expect(worklist.getByText(/exact duplicate redacted notes/)).toBeVisible();
    const demandCaptureQueue = page.locator("[aria-label='Demand capture proof queue']");
    await expect(demandCaptureQueue.getByText("no-send-reply-proof").first()).toBeVisible();
    await expect(demandCaptureQueue.getByText(/counted once per dedupe key/).first()).toBeVisible();
    const decisionCommandQueue = page.locator("[aria-label='Portfolio decision command queue']");
    await expect(decisionCommandQueue.getByText("Demand source provenance").first()).toBeVisible();
    await expect(decisionCommandQueue.getByText(/Decision note: .*demand/i).first()).toBeVisible();
    await expect(decisionCommandQueue.getByText(/demand-drift-report|pricing-signal|activation-cohort/).first()).toBeVisible();
    await expect(decisionCommandQueue.getByText("Demand source blocker provenance").first()).toBeVisible();
    await expect(decisionCommandQueue.getByText(/Summary: .*non-no-send demand|Summary: No blocked non-no-send/).first()).toBeVisible();
    await expect(decisionCommandQueue.getByText("No-send email gate reply demand").first()).toBeVisible();
    await expect(decisionCommandQueue.getByText(/Influence: .*no-send email-gate reply receipt/i).first()).toBeVisible();
    await expect(decisionCommandQueue.getByText(/Confidence note:/).first()).toBeVisible();
    await expect(page.getByText("Command source blockers").first()).toBeVisible();
    await expect(page.getByText("Command source blocked").first()).toBeVisible();
    await expect(page.getByText("Blocker source mix").first()).toBeVisible();
    const blockerDrilldowns = page.locator("[aria-label='Demand source blocker drilldowns']");
    await expect(blockerDrilldowns).toBeVisible();
    await expect(blockerDrilldowns.getByText("Demand source blocker drilldowns")).toBeVisible();
    await expect(blockerDrilldowns.getByText("channel-economics").first()).toBeVisible();
    await expect(blockerDrilldowns.getByText(/Awareness ad generated clicks/i).first()).toBeVisible();
    await blockerDrilldowns.getByRole("button", { name: "Filter channel-economics blocker source" }).click();
    await expect(page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...")).toHaveValue("demand source blocker drilldown channel-economics");
    await expect(page.getByRole("heading", { name: "Draft Ready Recovery Planner" })).toBeVisible();
    await blockerDrilldowns.getByLabel("Demand source blocker saved view name").fill("Channel blocker watch");
    await blockerDrilldowns.getByRole("button", { name: "Save channel-economics blocker view" }).click();
    await expect(page.getByText("Demand source blocker view saved")).toBeVisible();
    await expect(blockerDrilldowns.getByRole("button", { name: "Apply blocker source view Channel blocker watch" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("");
    await blockerDrilldowns.getByRole("button", { name: "Apply blocker source view Channel blocker watch" }).click();
    await expect(page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...")).toHaveValue("demand source blocker drilldown channel-economics");
    const blockerPackets = page.locator("[aria-label='Demand source blocker saved view packets']");
    await expect(blockerPackets).toBeVisible();
    await expect(blockerPackets.getByText("Shareable operator packets")).toBeVisible();
    await expect(blockerPackets.getByText("Channel blocker watch", { exact: true })).toBeVisible();
    await expect(blockerPackets.getByText(/Saved query: demand source blocker drilldown channel-economics/)).toBeVisible();
    await expect(blockerPackets.getByText(/Awareness ad generated clicks/i).first()).toBeVisible();
    const packetInbox = page.locator("[aria-label='Demand source blocker packet inbox']");
    await expect(packetInbox).toBeVisible();
    await expect(packetInbox.getByText("Demand source blocker packet inbox")).toBeVisible();
    await expect(packetInbox.getByText("Channel blocker watch", { exact: true })).toBeVisible();
    await expect(packetInbox.getByText(/Freshness:/).first()).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("");
    await packetInbox.getByRole("button", { name: "Replay packet Channel blocker watch" }).click();
    await expect(page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...")).toHaveValue("demand source blocker drilldown channel-economics");
    await packetInbox.getByRole("button", { name: "Flag needs evidence Channel blocker watch" }).click();
    await expect(packetInbox.getByText("1 needs evidence").first()).toBeVisible();
    await expect(packetInbox.getByText("Needs evidence", { exact: true }).first()).toBeVisible();
    await expect(packetInbox.getByText(/Latest transition: Untriaged -> Needs evidence/).first()).toBeVisible();
    const packetWorkloadSummary = page.locator("[aria-label='Demand source blocker packet owner workload summary']");
    await expect(packetWorkloadSummary.getByText("Owner workload summary")).toBeVisible();
    await expect(packetWorkloadSummary.getByText("1 owner/source group")).toBeVisible();
    await expect(packetWorkloadSummary.getByText("1 needs evidence")).toBeVisible();
    await expect(packetWorkloadSummary.getByText(/Search anchor: blocker packet owner workload test@marketpulse.dev channel-economics/)).toBeVisible();
    await packetWorkloadSummary.getByRole("button", { name: "Jump to owner workload test@marketpulse.dev channel-economics" }).click();
    await expect(packetInbox.getByText("Channel blocker watch", { exact: true })).toBeVisible();
    const packetOwnerQueue = page.locator("[aria-label='Demand source blocker packet triage owner queue']");
    await expect(packetOwnerQueue.getByText("Owner triage work queue")).toBeVisible();
    await expect(packetOwnerQueue.getByText(/test@marketpulse.dev \/ channel-economics \/ needs evidence/)).toBeVisible();
    await packetInbox.getByRole("button", { name: "Show needs-evidence blocker packets" }).click();
    await expect(packetInbox.getByText("Channel blocker watch", { exact: true })).toBeVisible();
    await packetInbox.getByRole("button", { name: "Show delegated blocker packets" }).click();
    await expect(packetInbox.getByText("No packet cards match the current triage filter.")).toBeVisible();
    await packetInbox.getByRole("button", { name: "Show all blocker packets" }).click();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    const packetInboxAfterReload = page.locator("[aria-label='Demand source blocker packet inbox']");
    await expect(packetInboxAfterReload.getByText("Needs evidence", { exact: true }).first()).toBeVisible();
    await expect(packetInboxAfterReload.getByText("1 needs evidence").first()).toBeVisible();
    await expect(packetInboxAfterReload.getByText(/Latest transition: Untriaged -> Needs evidence/).first()).toBeVisible();
    await packetInboxAfterReload.getByRole("button", { name: "Delegate packet Channel blocker watch" }).click();
    await expect(packetInboxAfterReload.getByText("Delegated", { exact: true }).first()).toBeVisible();
    await expect(packetInboxAfterReload.getByText("1 delegated").first()).toBeVisible();
    await expect(packetInboxAfterReload.getByText(/Latest transition: Needs evidence -> Delegated/).first()).toBeVisible();
    await packetInboxAfterReload.getByRole("button", { name: "Show delegated blocker packets" }).click();
    await expect(packetInboxAfterReload.getByText("Channel blocker watch", { exact: true })).toBeVisible();
    await expect(packetInboxAfterReload.locator("[aria-label='Demand source blocker packet triage owner queue']").getByText(/test@marketpulse.dev \/ channel-economics \/ delegated/)).toBeVisible();

    await page.getByRole("button", { name: "Export JSON" }).click();
    const exportOutput = page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.");
    await expect(exportOutput).toHaveValue(/No-send email gate reply proof/);
    await expect(exportOutput).toHaveValue(/Reply Proof Receipts/);
    await expect(exportOutput).toHaveValue(/replyProofReceipts/);
    await expect(exportOutput).toHaveValue(/no-send-reply-proof/);
    await expect(exportOutput).toHaveValue(/demandSourceProvenanceSummary/);
    await expect(exportOutput).toHaveValue(/demandSourceDecisionNote/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerSummary/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerEvidence/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerDrilldowns/);
    await expect(exportOutput).toHaveValue(/Demand Source Blocker Drilldown/);
    await expect(exportOutput).toHaveValue(/demand source blocker drilldown channel-economics/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerSavedViews/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerSavedViewPackets/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketTriage/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketTriageAuditHistory/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketTriageOwnerQueue/);
    await expect(exportOutput).toHaveValue(/demandSourceBlockerPacketTriageOwnerWorkloadSummary/);
    await expect(exportOutput).toHaveValue(/latestAuditTransition/);
    await expect(exportOutput).toHaveValue(/searchAnchor/);
    await expect(exportOutput).toHaveValue(/groupKey/);
    await expect(exportOutput).toHaveValue(/triageStatus/);
    await expect(exportOutput).toHaveValue(/previousStatus/);
    await expect(exportOutput).toHaveValue(/nextStatus/);
    await expect(exportOutput).toHaveValue(/delegated/);
    await expect(exportOutput).toHaveValue(/Channel blocker watch/);
    await expect(exportOutput).toHaveValue(/Demand Source Blocker Saved View Packet/);
    await expect(exportOutput).toHaveValue(/matchingVentureTitles/);
    await expect(exportOutput).toHaveValue(/commandIds/);
    await expect(exportOutput).toHaveValue(/portfolioSummary/);
    await expect(exportOutput).toHaveValue(/portfolioDecisionDemandSourceBlockerCount/);
    await expect(exportOutput).toHaveValue(/portfolioDecisionDemandSourceBlockerBreakdown/);
    await expect(exportOutput).toHaveValue(/Demand Source Provenance/);
    await expect(exportOutput).toHaveValue(/Demand Source Blocker Provenance/);
    await expect(exportOutput).toHaveValue(/noSendReplyDecisionNote/);
    await expect(exportOutput).toHaveValue(/confidenceNote/);
    await expect(exportOutput).toHaveValue(/No-Send Email Gate Reply Demand/);
    await expect(exportOutput).toHaveValue(/counted once per dedupe key/);
    await expect(exportOutput).toHaveValue(/Reviewer asked for a local Sunday reset walkthrough/);
    await expect(exportOutput).not.toHaveValue(/jane@example\.com/);
  });

  test("core demo flow: launch mission, inspect evidence, accept opportunity, view report and briefing", async ({ page }) => {
    test.setTimeout(150000);

    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder(/Describe a market to research/).fill("AI wellness apps for Gen Z");
    await page.getByRole("button", { name: "Launch Mission" }).click();

    await expect(page.getByText("Gen Z creators are packaging burnout recovery").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Evidence", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "View Results" })).toBeVisible();

    await page.getByRole("button", { name: "View Results" }).click();
    await expect(page.getByText("Source Evidence")).toBeVisible();
    await expect(page.getByText("Evidence quality 81").first()).toBeVisible();
    await expect(page.getByText("Freshness unknown").first()).toBeVisible();
    await expect(page.getByText("Opportunity Scorecard")).toBeVisible();
    await expect(page.getByLabel("Opportunity score 64")).toBeVisible();
    await expect(page.getByText("Demand Evidence", { exact: true })).toBeVisible();
    await expect(page.getByText(/Demand score: \d+/)).toBeVisible();
    await expect(page.getByText(/Buyer: Students and first-job Gen Z professionals/).first()).toBeVisible();
    await expect(page.getByText("Evidence diversity: 3/4 platforms")).toBeVisible();
    await expect(page.getByText("Missing platform coverage: x", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Execution difficulty: Moderate")).toBeVisible();
    await expect(page.getByRole("button", { name: "Research Evidence Gap" })).toBeVisible();
    await expect(page.getByText("Venture Operating Workspace")).toBeVisible();
    await expect(page.getByText("Why Now").first()).toBeVisible();
    await expect(page.getByRole("region", { name: "MVP Scope" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Build Estimate" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Evidence Confidence" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Reasoning Debate" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Evaluation Lenses" })).toBeVisible();
    await expect(page.getByText(/Window: /).first()).toBeVisible();
    await expect(page.getByText("Kill-or-continue rubric")).toBeVisible();
    await expect(page.getByText("Fake-door waitlist test")).toBeVisible();
    await expect(page.getByText("Source code: pending builder output")).toBeVisible();
    await expect(page.getByText("Human-approved deployment")).toBeVisible();
    await page.getByRole("button", { name: "Save venture" }).click();
    await expect(page.getByText("Venture workspace saved")).toBeVisible();
    await expect(page.getByText("Evidence-backed", { exact: true })).toBeVisible();
    await expect(page.getByText("Gen Z Recovery Planner").first()).toBeVisible();
    await expect(page.getByText("Waiting for: x")).toBeVisible();

    await page.goto("/ventures");
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Saved venture workspaces with evidence")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await expect(page.getByText("Operating analytics")).toBeVisible();
    await expect(page.getByText("Market confidence")).toBeVisible();
    await expect(page.getByText("Dominant proof gap")).toBeVisible();
    await expect(page.getByText("Riskiest market")).toBeVisible();
    await expect(page.getByText("Open gaps")).toBeVisible();
    await expect(page.getByText("Completed follow-up outcomes")).toBeVisible();
    await expect(page.getByText("Kill pressure", { exact: true })).toBeVisible();
    await expect(page.getByText("Kill decision artifacts")).toBeVisible();
    await expect(page.getByText("Scale pressure")).toBeVisible();
    await expect(page.getByText("Demand calibration")).toBeVisible();
    await expect(page.getByText("Opportunity demand snapshot").first()).toBeVisible();
    await expect(page.getByText(/Pre-venture demand score \d+/).first()).toBeVisible();
    await expect(page.getByText("Demand drift analytics").first()).toBeVisible();
    await expect(page.getByText(/Actual demand score \d+/).first()).toBeVisible();
    await expect(page.getByText("Demand drift measured")).toBeVisible();
    await expect(page.getByText("Demand overestimated")).toBeVisible();
    await expect(page.getByText("Launch packs")).toBeVisible();
    await expect(page.getByText("Launch needs approval")).toBeVisible();
    await expect(page.getByText("QA reports")).toBeVisible();
    await expect(page.getByText("QA blocked", { exact: true })).toBeVisible();
    await expect(page.getByText("Deployment packets", { exact: true })).toBeVisible();
    await expect(page.getByText("Deployment blocked", { exact: true })).toBeVisible();
    await expect(page.getByText("Deployment roadmap-owned", { exact: true })).toBeVisible();
    await expect(page.getByText("Deployment support-owned", { exact: true })).toBeVisible();
    await expect(page.getByText("Stale deploy escalations", { exact: true })).toBeVisible();
    const deploymentOwnerWorklist = page.locator("[aria-label='Deployment owner worklist']");
    await expect(deploymentOwnerWorklist).toBeVisible();
    const staleDeploymentEscalationQueue = page.locator("[aria-label='Stale deployment escalation queue']");
    await expect(staleDeploymentEscalationQueue).toBeVisible();
    await expect(staleDeploymentEscalationQueue.getByText(/no-send escalation/).first()).toBeVisible();
    await expect(staleDeploymentEscalationQueue.getByRole("button", { name: "Record no-send escalation audit" })).toBeVisible();
    await staleDeploymentEscalationQueue.getByRole("button", { name: "Record no-send escalation audit" }).click();
    await expect(page.getByText("Deployment escalation audit recorded")).toBeVisible();
    const deploymentEscalationAuditReplay = page.locator("[aria-label='Deployment escalation audit replay']");
    await expect(deploymentEscalationAuditReplay).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByText("Deployment escalation audit replay", { exact: true })).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByText("1 recorded")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByText("0 external side effects")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByText(/side effect: none/).first()).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByLabel("Deployment escalation audit markdown")).toHaveValue(/Deployment Escalation Audit Replay/);
    await deploymentEscalationAuditReplay.getByRole("combobox", { name: "Deployment escalation audit status filter" }).click();
    await page.getByRole("option", { name: "proposed" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await deploymentEscalationAuditReplay.getByRole("combobox", { name: "Deployment escalation audit side-effect filter" }).click();
    await page.getByRole("option", { name: "none" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await deploymentEscalationAuditReplay.getByRole("combobox", { name: "Deployment escalation audit actor filter" }).click();
    await page.getByRole("option", { name: "release-owner" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await deploymentEscalationAuditReplay.getByRole("button", { name: "Clear" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("Deployment workload summary")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("release-owner workload")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("support-owner workload")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText(/SLA: Fresh/).first()).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText(/Age: \d+ day/).first()).toBeVisible();
    const deploymentDrilldowns = page.locator("[aria-label='Deployment chart drilldowns']");
    const deploymentWorkItems = page.locator("[aria-label='Deployment owner work items']");
    await expect(deploymentDrilldowns.getByRole("button", { name: /Drilldown owner release-owner/ })).toBeVisible();
    await expect(deploymentDrilldowns.getByRole("button", { name: /Drilldown production/ })).toBeVisible();
    await expect(deploymentDrilldowns.getByRole("button", { name: /Drilldown status candidate/ })).toBeVisible();
    await deploymentDrilldowns.getByRole("button", { name: /Drilldown production/ }).click();
    await expect(deploymentWorkItems.getByText(/Production:/).first()).toBeVisible();
    await expect(deploymentWorkItems.getByText(/Staging:/)).toHaveCount(0);
    await deploymentDrilldowns.getByRole("button", { name: "Clear deployment drilldowns" }).click();
    await expect(deploymentOwnerWorklist.getByText("release-owner").first()).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("support-owner").first()).toBeVisible();
    await expect(deploymentWorkItems.getByText("Deployment promotion blocker: Production", { exact: true })).toBeVisible();
    await expect(deploymentWorkItems.getByText("Deployment support risk: Production", { exact: true })).toBeVisible();
    await deploymentOwnerWorklist.getByRole("combobox", { name: "Deployment owner filter" }).click();
    await page.getByRole("option", { name: "release-owner" }).click();
    await expect(deploymentWorkItems.getByText("Deployment promotion blocker: Production", { exact: true })).toBeVisible();
    await expect(deploymentWorkItems.getByText("Deployment support risk: Production", { exact: true })).toHaveCount(0);
    await deploymentOwnerWorklist.getByRole("button", { name: "Record roadmap task" }).first().click();
    await expect(page.getByText("Deployment roadmap task recorded")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("queued").first()).toBeVisible();
    await deploymentOwnerWorklist.getByRole("button", { name: "Mark roadmap done" }).first().click();
    await expect(page.getByText("Deployment roadmap task marked done")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("done").first()).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText(/Done: 1/).first()).toBeVisible();
    await deploymentOwnerWorklist.getByRole("combobox", { name: "Deployment owner filter" }).click();
    await page.getByRole("option", { name: "support-owner" }).click();
    await expect(deploymentWorkItems.getByText("Deployment support risk: Production", { exact: true })).toBeVisible();
    await deploymentOwnerWorklist.getByRole("button", { name: "Record support issue" }).first().click();
    await expect(page.getByText("Deployment support issue recorded")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("triaged").first()).toBeVisible();
    await deploymentOwnerWorklist.getByRole("button", { name: "Resolve support issue" }).first().click();
    await expect(page.getByText("Deployment support issue resolved")).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText("resolved").first()).toBeVisible();
    await expect(deploymentOwnerWorklist.getByText(/Resolved: 1/).first()).toBeVisible();
    await deploymentOwnerWorklist.getByRole("combobox", { name: "Deployment owner filter" }).click();
    await page.getByRole("option", { name: "All owners" }).click();
    await expect(page.getByText("Investor briefs")).toBeVisible();
    await expect(page.getByText("Not-ready briefs")).toBeVisible();
    await expect(page.getByText("Financial models")).toBeVisible();
    await expect(page.getByText("Finance score", { exact: true })).toBeVisible();
    await expect(page.getByText("Finance needs proof", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Portfolio charts" })).toBeVisible();
    await expect(page.getByText("Evidence Readiness Chart").first()).toBeVisible();
    await expect(page.getByText("Demand Reality Chart").first()).toBeVisible();
    await expect(page.getByText("Finance Score Chart").first()).toBeVisible();
    await expect(page.getByText("QA Readiness Chart").first()).toBeVisible();
    await expect(page.getByText("Deployment Owner Workload Chart").first()).toBeVisible();
    await expect(page.getByText("Deployment Environment Workload Chart").first()).toBeVisible();
    await expect(page.getByText("Deployment SLA Workload Chart").first()).toBeVisible();
    await expect(page.getByText("Deployment Status Workload Chart").first()).toBeVisible();
    await expect(page.getByText("Deployment Escalation Status Chart").first()).toBeVisible();
    await expect(page.getByText("Deployment Escalation Side Effect Chart").first()).toBeVisible();
    await expect(page.getByText("Deployment Escalation Actor Chart").first()).toBeVisible();
    await expect(page.getByLabel("Portfolio chart markdown")).toHaveValue(/# Venture Portfolio Charts/);
    await expect(page.getByLabel("Portfolio chart markdown")).toHaveValue(/Deployment Owner Workload Chart/);
    await expect(page.getByLabel("Portfolio chart markdown")).toHaveValue(/Deployment Escalation Side Effect Chart/);
    await page.getByRole("button", { name: "Drilldown proposed" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Drilldown proposed" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await page.getByRole("button", { name: "Drilldown none" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Drilldown none" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await page.getByRole("button", { name: "Drilldown release-owner" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Drilldown release-owner" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await deploymentEscalationAuditReplay.getByLabel("Deployment escalation saved view name").fill("Release owner no-send");
    await deploymentEscalationAuditReplay.getByRole("button", { name: "Save escalation view" }).click();
    await expect(page.getByText("Deployment escalation view saved")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByText("Local", { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    await expect(deploymentEscalationAuditReplay.getByRole("button", { name: "Apply saved view Release owner no-send" })).toBeVisible();
    await deploymentEscalationAuditReplay.getByRole("button", { name: "Apply saved view Release owner no-send" }).click();
    await expect(page.getByText("Deployment escalation view applied: Release owner no-send")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByRole("combobox", { name: "Deployment escalation audit status filter" })).toContainText("proposed");
    await expect(deploymentEscalationAuditReplay.getByRole("combobox", { name: "Deployment escalation audit side-effect filter" })).toContainText("none");
    await expect(deploymentEscalationAuditReplay.getByRole("combobox", { name: "Deployment escalation audit actor filter" })).toContainText("release-owner");
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await deploymentEscalationAuditReplay.getByRole("button", { name: "Clear" }).click();
    await expect(deploymentEscalationAuditReplay.getByText("1 shown")).toBeVisible();
    await page.getByRole("button", { name: "Export JSON" }).click();
    const portablePortfolioExport = page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.");
    await expect(portablePortfolioExport).toHaveValue(/deploymentEscalationAuditSavedViews/);
    await expect(portablePortfolioExport).toHaveValue(/Release owner no-send/);
    await expect(portablePortfolioExport).toHaveValue(/"exportedBy": "test@marketpulse.dev"/);
    await expect(portablePortfolioExport).toHaveValue(/"exportedAt":/);
    const exportedPortfolioWithSavedView = await portablePortfolioExport.inputValue();
    await deploymentEscalationAuditReplay.getByRole("button", { name: "Delete saved view Release owner no-send" }).click();
    await expect(page.getByText("Deployment escalation view deleted")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByText("No saved escalation audit filter views yet.")).toBeVisible();
    const importDraft = page.getByPlaceholder("Paste portfolio JSON...");
    const importButton = page.getByRole("button", { name: "Import portfolio JSON" });
    const portfolioImportPreview = page.locator("[aria-label='Portfolio import preview']");
    await importDraft.fill(exportedPortfolioWithSavedView);
    await expect(importDraft).toHaveValue(exportedPortfolioWithSavedView);
    await expect(portfolioImportPreview.getByText("1 venture")).toBeVisible();
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(page.getByText("Imported 1 venture workspace")).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByRole("button", { name: "Apply saved view Release owner no-send" })).toBeVisible();
    await expect(deploymentEscalationAuditReplay.getByText("Imported · test@marketpulse.dev")).toBeVisible();
    await expect(page.getByText("Demand passed")).toBeVisible();
    await expect(page.getByText("Prediction snapshots", { exact: true })).toBeVisible();
    await expect(page.getByText("Prediction snapshot:").first()).toBeVisible();
    await expect(page.getByText("Pricing signals", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pricing calibration" })).toBeVisible();
    await expect(page.getByText(/Pricing hypothesis: \$9\/month/).last()).toBeVisible();
    await expect(page.getByText("Customer interviews")).toBeVisible();
    await expect(page.getByText("Customer interview memory")).toBeVisible();
    await expect(page.getByText("Outreach approvals")).toBeVisible();
    await expect(page.getByText("Outreach campaigns")).toBeVisible();
    await expect(page.getByText("Campaign blocked")).toBeVisible();
    await expect(page.getByText("Outreach approval log")).toBeVisible();
    await expect(page.getByText("Risk records")).toBeVisible();
    await expect(page.getByText("Risk register")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fake-door waitlist test" })).toBeVisible();
    await expect(page.getByText("Human-approved deployment").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Deployment approval boundary" })).toBeVisible();
    await expect(page.getByText("no-deploy: human approval required")).toBeVisible();
    await expect(page.getByText(/Proposal: (available|blocked); human gate: requires-human/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Market model" })).toBeVisible();
    await expect(page.getByText("Competition", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Channel", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Pricing", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Missing proof", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Named competitor or substitute")).toBeVisible();
    await expect(page.getByText("Founder memos")).toBeVisible();
    await expect(page.getByText("Memo blocked")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Founder execution memo" })).toBeVisible();
    await expect(page.getByText("Technical ticket", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Founder memo markdown")).toHaveValue(/# Founder Execution Memo: Gen Z Recovery Planner/);
    await expect(page.getByRole("heading", { name: "Investor brief" })).toBeVisible();
    await expect(page.getByText(/Investability \d+\/100/).first()).toBeVisible();
    await expect(page.getByLabel("Investor brief markdown")).toHaveValue(/# Investor Brief: Gen Z Recovery Planner/);
    await expect(page.getByRole("heading", { name: "Financial model" })).toBeVisible();
    await expect(page.getByText(/Finance \d+\/100/).first()).toBeVisible();
    await expect(page.getByText("Revenue evidence").first()).toBeVisible();
    await expect(page.getByText("Scaling threshold: Do not scale until acquisition spend, paid users, and channel revenue are tied to the same cohort.")).toBeVisible();
    await expect(page.getByLabel("Financial model markdown")).toHaveValue(/# Financial Model: Gen Z Recovery Planner/);
    await expect(page.getByRole("heading", { name: "Experiment launch pack" })).toBeVisible();
    await expect(page.getByText("Landing sections", { exact: true })).toBeVisible();
    await expect(page.getByText("Channel copy", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Experiment launch pack markdown")).toHaveValue(/# Experiment Launch Pack: Fake-door waitlist test launch pack/);
    await expect(page.getByRole("heading", { name: "Evidence readiness" })).toBeVisible();
    await expect(page.getByText("Source provenance", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Gap action queue")).toBeVisible();
    await expect(page.getByText("Research missing evidence: x coverage", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy prompt" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Launch research" }).first()).toBeVisible();
    await page.getByPlaceholder("Record gap outcome...").first().fill("Follow-up X scan found weak buyer urgency.");
    await page.getByRole("button", { name: "Save gap outcome" }).first().click();
    await expect(page.getByText("Gap outcome saved")).toBeVisible();
    await expect(page.getByText("Gap outcome recorded")).toBeVisible();
    await expect(page.getByText("Follow-up X scan found weak buyer urgency.").first()).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Evidence filter" })).toBeVisible();
    await page.getByRole("combobox", { name: "Evidence filter" }).click();
    await page.getByRole("option", { name: "Has gaps" }).click();
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByRole("combobox", { name: "Evidence filter" }).click();
    await page.getByRole("option", { name: "All evidence" }).click();
    await page.getByPlaceholder("Qualified buyers").fill("5");
    await page.getByPlaceholder("Paid commitments").fill("2");
    await page.getByPlaceholder("Invoice requests").fill("1");
    await page.getByPlaceholder("Accepted price").fill("$9/month");
    await page.getByPlaceholder("Record pricing objections...").fill("Need student discount before annual plan.");
    await page.getByPlaceholder("Record pricing evidence...").fill("Three qualified buyers accepted the paid pilot.");
    await page.getByRole("button", { name: "Save pricing signal" }).click();
    await expect(page.getByText("Pricing signal saved")).toBeVisible();
    await expect(page.getByText("Latest pricing signal")).toBeVisible();
    await expect(page.getByText("3 paid signals from 5 qualified buyers").first()).toBeVisible();
    await expect(page.getByText("Need student discount before annual plan.")).toBeVisible();
    await page.getByPlaceholder("Interview persona").fill("Burned-out sophomore");
    await page.getByPlaceholder("Interview channel").fill("manual interview");
    await page.getByRole("combobox", { name: "Interview sentiment" }).click();
    await page.getByRole("option", { name: "Positive" }).click();
    await page.getByPlaceholder("Record buyer pain quote...").fill("I need a Sunday reset plan before the week starts.");
    await page.getByPlaceholder("Record willingness-to-pay quote...").fill("$9/month if it saves me time.");
    await page.getByPlaceholder("Record interview objections...").fill("Privacy around wellness data.");
    await page.getByPlaceholder("Record requested features...").fill("Calendar sync; gentle reminders");
    await page.getByPlaceholder("Record interview evidence note...").fill("Interview notes captured after waitlist signup.");
    await page.getByRole("button", { name: "Save customer interview" }).click();
    await expect(page.getByText("Customer interview saved")).toBeVisible();
    await expect(page.getByText("Latest interview")).toBeVisible();
    await expect(page.getByText("I need a Sunday reset plan before the week starts.").first()).toBeVisible();
    await expect(page.getByText("Feature requests: Calendar sync; gentle reminders")).toBeVisible();
    await page.getByPlaceholder("Outreach contact persona").fill("Burned-out sophomore");
    await page.getByPlaceholder("Outreach channel").fill("manual email");
    await page.getByPlaceholder("Draft outreach message...").fill("Thanks for joining the Recovery Planner early list.");
    await page.getByPlaceholder("Record outreach risk note...").fill("Do not imply clinical advice.");
    await page.getByPlaceholder("Define outreach next action...").fill("Send manually after reviewing consent.");
    await page.getByRole("button", { name: "Save outreach approval" }).click();
    await expect(page.getByText("Outreach approval saved")).toBeVisible();
    await expect(page.getByText("Latest outreach approval")).toBeVisible();
    await expect(page.getByText("No external message was sent.")).toBeVisible();
    await expect(page.getByText("Do not imply clinical advice.").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Outreach campaign brief" })).toBeVisible();
    await expect(page.getByText("ready", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("External send status: not-sent. The app stores the draft and did not send it.").first()).toBeVisible();
    await expect(page.getByText("Opening: Thanks for joining the Recovery Planner early list.").first()).toBeVisible();
    await expect(page.getByLabel("Outreach campaign markdown")).toHaveValue(/# Outreach Campaign Brief: Gen Z Recovery Planner/);
    await expect(page.getByText("Customer inbox risk candidate")).toBeVisible();
    await expect(page.getByText("Customer objection: Burned-out sophomore")).toBeVisible();
    await expect(page.getByText("Privacy around wellness data.").first()).toBeVisible();
    await page.getByPlaceholder("Risk owner").fill("Rishabh");
    await page.getByRole("combobox", { name: "Risk severity" }).click();
    await page.getByRole("option", { name: "High" }).click();
    await page.getByRole("combobox", { name: "Risk status" }).click();
    await page.getByRole("option", { name: "Mitigating" }).click();
    await page.getByPlaceholder("Risk mitigation").fill("Add consent language to wellness-data onboarding before outreach.");
    await page.getByRole("textbox", { name: "Resolution evidence", exact: true }).fill("Consent review queued with the next customer script.");
    await page.getByRole("button", { name: "Save risk record" }).click();
    await expect(page.getByText("Risk record saved")).toBeVisible();
    await expect(page.getByText("Latest risk record")).toBeVisible();
    await expect(page.getByText("Owner: Rishabh")).toBeVisible();
    await expect(page.getByText("Mitigation: Add consent language to wellness-data onboarding before outreach.")).toBeVisible();
    await expect(page.getByText("Resolution evidence: Consent review queued with the next customer script.")).toBeVisible();
    await expect(page.getByText("MVP build workspaces")).toBeVisible();
    await expect(page.getByText("Generated app handoffs", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("App source pending", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Source scaffolds", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Source scaffold files", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("App proof reports", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Missing app proofs", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Artifact records")).toBeVisible();
    await expect(page.getByText("Money signals")).toBeVisible();
    await expect(page.getByText("Roadmap tasks", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "MVP build workspace" })).toBeVisible();
    await expect(page.getByText("Handoff truth")).toBeVisible();
    await page.getByPlaceholder("MVP workspace owner").fill("Rishabh");
    await page.getByRole("combobox", { name: "Setup check" }).click();
    await page.getByRole("option", { name: "Passed" }).click();
    await page.getByPlaceholder("Record MVP workspace verification notes...").fill("Build brief ready; generated source is not attached.");
    await page.getByRole("button", { name: "Save MVP build workspace" }).click();
    await expect(page.getByText("MVP build workspace saved")).toBeVisible();
    await expect(page.getByText("Latest MVP build workspace")).toBeVisible();
    await expect(page.getByText("No generated source attached yet.").first()).toBeVisible();
    await expect(page.getByText("Build brief ready; generated source is not attached.").first()).toBeVisible();
    await expect(page.getByText("Setup: Passed", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Generated app handoff" })).toBeVisible();
    await expect(page.getByText("brief-ready", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("No generated app source has been attached; this is a local-only handoff manifest, not a created app.").first()).toBeVisible();
    await expect(page.getByText("src/App.tsx: route shell with approval-aware navigation.").first()).toBeVisible();
    await expect(page.getByText("Generated source scaffold", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("ready-to-materialize", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Source files", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/src\/App\.tsx: fnv1a-/).first()).toBeVisible();
    await expect(page.getByText("Proof capture checklist", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/pnpm browser-smoke/).first()).toBeVisible();
    await expect(page.getByText(/pnpm generated-app:materialize/).first()).toBeVisible();
    await expect(page.getByText(/pnpm generated-app:verify/).first()).toBeVisible();
    await expect(page.getByLabel("Generated app source scaffold markdown")).toHaveValue(/# Generated App Source Scaffold: Gen Z Recovery Planner/);
    await expect(page.getByLabel("Generated app source file preview")).toHaveValue(/No external side effects/);
    await expect(page.getByText("Generated app verification proof", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/1\/6 passed/).first()).toBeVisible();
    await expect(page.getByText("Browser smoke proof missing or not passed.").first()).toBeVisible();
    await expect(page.getByLabel("Generated app verification proof markdown")).toHaveValue(/# Generated App Verification Proof: Gen Z Recovery Planner/);
    await page.getByRole("button", { name: "Stage verifier proof artifact" }).click();
    await expect(page.getByText("Generated app proof staged as an artifact")).toBeVisible();
    await expect(page.getByPlaceholder("Artifact title")).toHaveValue(/Generated app verifier proof/);
    await expect(page.getByPlaceholder("Verification command")).toHaveValue(/generated-app:verify/);
    await expect(page.getByPlaceholder("Record artifact evidence...")).toHaveValue(/Generated app source exists as an exportable scaffold/);
    const verifierReport = JSON.stringify({
      scaffoldId: "venture-demo-option-1-generated-app-source-scaffold",
      ventureId: "venture-demo-option-1",
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
    }, null, 2);
    const verifierReportPath = path.join(os.tmpdir(), `marketpulse-verifier-report-${Date.now()}.json`);
    fs.writeFileSync(verifierReportPath, verifierReport);
    await page.getByLabel("Generated app verifier report file").first().setInputFiles(verifierReportPath);
    await expect(page.getByText("Generated app verifier report file loaded")).toBeVisible();
    await expect(page.getByLabel("Generated app verifier report JSON").first()).toHaveValue(/venture-demo-option-1/);
    await page.getByRole("button", { name: "Save verifier report" }).first().click();
    await expect(page.getByText("Generated app verifier report saved")).toBeVisible();
    await expect(page.getByText("Generated app verifier report: gen-z-recovery-planner", { exact: true })).toBeVisible();
    await expect(page.getByText(/6\/6 passed/).first()).toBeVisible();
    await expect(page.getByLabel("Generated app handoff markdown")).toHaveValue(/# Generated App Handoff: Gen Z Recovery Planner/);
    await expect(page.getByRole("heading", { name: "Artifact and changelog ledger" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "QA release report" })).toBeVisible();
    await expect(page.getByText(/Readiness \d+\/100/).first()).toBeVisible();
    await expect(page.getByText("Deployment", { exact: true }).first()).toBeVisible();
    await expect(page.getByLabel("QA release report markdown")).toHaveValue(/# QA Release Report: Gen Z Recovery Planner/);
    await expect(page.getByRole("heading", { name: "Deployment readiness packet" })).toBeVisible();
    await expect(page.getByText("Deployment proof missing").first()).toBeVisible();
    await expect(page.getByText("This packet proposes readiness only; it does not deploy").first()).toBeVisible();
    await expect(page.getByText("Human-approved deployment is required before any external execution.").first()).toBeVisible();
    await expect(page.getByText("No verified deployment-proof artifact is attached.").first()).toBeVisible();
    await expect(page.getByText("Deployment environment matrix", { exact: true })).toBeVisible();
    await expect(page.getByText("Production remains blocked unless the matrix says ready").first()).toBeVisible();
    await expect(page.getByText("Local", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Production", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Production is blocked until human-approved deployment is complete.").first()).toBeVisible();
    await expect(page.getByLabel("Deployment readiness packet markdown")).toHaveValue(/# Deployment Readiness Packet: Gen Z Recovery Planner/);
    await expect(page.getByLabel("Deployment environment matrix markdown")).toHaveValue(/# Deployment Environment Matrix: Gen Z Recovery Planner/);
    await page.getByRole("button", { name: "Stage Production roadmap task" }).click();
    await expect(page.getByText("Deployment promotion task staged")).toBeVisible();
    await expect(page.getByPlaceholder("Roadmap task title")).toHaveValue(/Deployment promotion blocker: Production/);
    await expect(page.getByPlaceholder("Roadmap task detail")).toHaveValue(/Production is blocked until human-approved deployment is complete/);
    await expect(page.getByPlaceholder("Roadmap next action")).toHaveValue(/update both with proof before promotion/);
    await page.getByPlaceholder("Roadmap task title").fill("");
    await page.getByPlaceholder("Roadmap owner").fill("");
    await page.getByPlaceholder("Roadmap task detail").fill("");
    await page.getByPlaceholder("Support-load note").fill("");
    await page.getByPlaceholder("Risk-reduction note").fill("");
    await page.getByPlaceholder("Roadmap next action").fill("");
    await page.getByRole("button", { name: "Stage deployment rehearsal proof" }).click();
    await expect(page.getByText("Deployment rehearsal proof staged")).toBeVisible();
    await expect(page.getByPlaceholder("Artifact title")).toHaveValue(/Deployment rehearsal proof/);
    await expect(page.getByPlaceholder("Artifact URI")).toHaveValue(/deployment-readiness\/venture-demo-option-1\.md/);
    await expect(page.getByPlaceholder("Verification command")).toHaveValue(/No deployment command executed/);
    await expect(page.getByPlaceholder("Record artifact evidence...")).toHaveValue(/does not deploy/);
    await page.getByPlaceholder("Artifact title").fill("MVP build brief");
    await page.getByPlaceholder("Artifact URI").fill("");
    await page.getByPlaceholder("Artifact owner").fill("Rishabh");
    await page.getByRole("combobox", { name: "Artifact type" }).click();
    await page.getByRole("option", { name: "Build brief" }).click();
    await page.getByRole("combobox", { name: "Artifact status" }).click();
    await page.getByRole("option", { name: "Expected" }).click();
    await page.getByPlaceholder("Verification command").fill("No command until source repo exists.");
    await page.getByPlaceholder("Record artifact evidence...").fill("Build brief created from handoff; source repo still pending.");
    await page.getByPlaceholder("Record changelog summary...").fill("Captured the build brief as an expected artifact before generated source exists.");
    await page.getByRole("button", { name: "Save artifact record" }).click();
    await expect(page.getByText("Artifact record saved").first()).toBeVisible();
    await expect(page.getByText("Latest artifact record")).toBeVisible();
    await expect(page.getByText("No artifact URI attached yet.")).toBeVisible();
    await expect(page.getByText("Build brief created from handoff; source repo still pending.")).toBeVisible();
    await expect(page.getByText("Change: Captured the build brief as an expected artifact before generated source exists.")).toBeVisible();
    await page.getByPlaceholder("Artifact title").fill("Generated MVP source repo");
    await page.getByPlaceholder("Artifact URI").fill("/tmp/recovery-routine-mvp");
    await page.getByRole("combobox", { name: "Artifact type" }).click();
    await page.getByRole("option", { name: "Source repo" }).click();
    await page.getByRole("combobox", { name: "Artifact status" }).click();
    await page.getByRole("option", { name: "Verified" }).click();
    await page.getByPlaceholder("Verification command").fill("pnpm type-check");
    await page.getByPlaceholder("Record artifact evidence...").fill("Generated source repo exists locally and type-checks.");
    await page.getByPlaceholder("Record changelog summary...").fill("Created a local-only MVP source tree for review.");
    await page.getByRole("button", { name: "Save artifact record" }).click();
    await expect(page.getByText("Artifact record saved").first()).toBeVisible();
    await expect(page.getByText("Generated source repo exists locally and type-checks.")).toBeVisible();
    await page.getByPlaceholder("Artifact title").fill("Local verification report");
    await page.getByPlaceholder("Artifact URI").fill("test-results/venture-local.txt");
    await page.getByRole("combobox", { name: "Artifact type" }).click();
    await page.getByRole("option", { name: "Test report" }).click();
    await page.getByPlaceholder("Verification command").fill("pnpm test -- src/lib/venture-portfolio.test.ts");
    await page.getByPlaceholder("Record artifact evidence...").fill("Local unit tests passed against the generated source.");
    await page.getByPlaceholder("Record changelog summary...").fill("Recorded local test execution before any deployment proposal.");
    await page.getByRole("button", { name: "Save artifact record" }).click();
    await expect(page.getByText("Artifact record saved").first()).toBeVisible();
    await expect(page.getByText("Local unit tests passed against the generated source.")).toBeVisible();
    await page.getByPlaceholder("Artifact title").fill("Deployment proof blocked");
    await page.getByRole("combobox", { name: "Artifact type" }).click();
    await page.getByRole("option", { name: "Deployment proof" }).click();
    await page.getByRole("combobox", { name: "Artifact status" }).click();
    await page.getByRole("option", { name: "Blocked" }).click();
    await page.getByPlaceholder("Verification command").fill("No deploy command approved.");
    await page.getByPlaceholder("Record artifact evidence...").fill("Deployment proof intentionally withheld until human approval.");
    await page.getByPlaceholder("Record changelog summary...").fill("No deployment was executed.");
    await page.getByRole("button", { name: "Save artifact record" }).click();
    await expect(page.getByText("Artifact record saved").first()).toBeVisible();
    await expect(page.getByText("Deployment proof intentionally withheld until human approval.")).toBeVisible();
    await expect(page.getByText("no-deploy: deployment proof blocked")).toBeVisible();
    await expect(page.getByText("1 blocked proof")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Revenue and cost ledger" })).toBeVisible();
    await page.getByPlaceholder("Money source").fill("Paid pilot LOI");
    await page.getByPlaceholder("Amount").fill("180");
    await page.getByPlaceholder("Money owner").fill("Rishabh");
    await page.getByPlaceholder("Record money evidence...").fill("Founder call produced a $180 pilot commitment; no payment collected.");
    await page.getByPlaceholder("Record finance notes...").fill("Use this as revenue intent, not live billing proof.");
    await page.getByRole("button", { name: "Save money signal" }).click();
    await expect(page.getByText("Money signal saved")).toBeVisible();
    await expect(page.getByText("Latest money signal")).toBeVisible();
    await expect(page.getByText("$180 from Paid pilot LOI")).toBeVisible();
    await expect(page.getByText("External billing: not-charged")).toBeVisible();
    await expect(page.getByText("Approval: human-approved-billing-change; state: approval-required; external action: no-app-charge")).toBeVisible();
    await expect(page.getByText("1 billing-gated")).toBeVisible();
    await page.getByPlaceholder("Money source").fill("Creator placement budget");
    await page.getByPlaceholder("Amount").fill("90");
    await page.getByRole("combobox", { name: "Money signal type" }).click();
    await page.getByRole("option", { name: "Expense" }).click();
    await page.getByRole("combobox", { name: "Money signal status" }).click();
    await page.getByRole("option", { name: "Planned" }).click();
    await page.getByPlaceholder("Record money evidence...").fill("Proposed $90 creator placement; no spend executed by the app.");
    await page.getByPlaceholder("Record finance notes...").fill("Budget requires approval before any external payment.");
    await page.getByRole("button", { name: "Save money signal" }).click();
    await expect(page.getByText("Money signal saved").first()).toBeVisible();
    await expect(page.getByText("$90 from Creator placement budget")).toBeVisible();
    await expect(page.getByText("Approval: human-approved-spend; state: approval-required; external action: no-app-spend")).toBeVisible();
    await expect(page.getByText("1 spend-gated")).toBeVisible();
    await expect(page.getByText("1 billing-gated")).toBeVisible();
    await expect(page.getByText("$0 received, $180 committed").first()).toBeVisible();
    await expect(page.getByText("$90 money expenses/refunds plus $0 acquisition spend; total modeled expense $90.").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Roadmap and support queue" })).toBeVisible();
    await expect(page.getByText("Roadmap inbox candidate")).toBeVisible();
    await expect(page.getByText("Feature request: Burned-out sophomore")).toBeVisible();
    await page.getByPlaceholder("Roadmap owner").fill("Rishabh");
    await page.getByPlaceholder("Support-load note").fill("Reduce manual support by designing calendar-sync copy before code.");
    await page.getByPlaceholder("Risk-reduction note").fill("Avoids shipping reminders without consent expectations.");
    await page.getByPlaceholder("Roadmap next action").fill("Scope a no-code calendar-sync concierge test.");
    await page.getByRole("button", { name: "Save roadmap task" }).click();
    await expect(page.getByText("Roadmap task saved")).toBeVisible();
    await expect(page.getByText("Latest roadmap task")).toBeVisible();
    await expect(page.getByText("Support load: Reduce manual support by designing calendar-sync copy before code.").first()).toBeVisible();
    await expect(page.getByText("Next: Scope a no-code calendar-sync concierge test.")).toBeVisible();
    await expect(page.getByText("Support issues", { exact: true })).toBeVisible();
    await expect(page.getByText("Pilot issues")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Support and pilot issue log" })).toBeVisible();
    await expect(page.getByText("Support inbox candidate")).toBeVisible();
    await expect(page.getByText("Pilot issue: Feature request: Burned-out sophomore")).toBeVisible();
    await page.getByPlaceholder("Support owner").fill("Rishabh");
    await page.getByRole("combobox", { name: "Support severity" }).click();
    await page.getByRole("option", { name: "High" }).click();
    await page.getByRole("combobox", { name: "Support status" }).click();
    await page.getByRole("option", { name: "In progress" }).click();
    await page.getByPlaceholder("Customer impact").fill("Pilot users need concierge calendar-sync answers before setup.");
    await page.getByPlaceholder("Retention-risk evidence").fill("Retention risk: repeated manual calendar-sync support can swamp the founder.");
    await page.getByPlaceholder("Support resolution evidence").fill("Support checklist is still open.");
    await page.getByPlaceholder("Support next action").fill("Call the first 5 pilot users and measure repeat support questions.");
    await page.getByRole("button", { name: "Save support issue" }).click();
    await expect(page.getByText("Support issue saved")).toBeVisible();
    await expect(page.getByText("Latest support issue")).toBeVisible();
    await expect(page.getByText("Retention risk: repeated manual calendar-sync support can swamp the founder.")).toBeVisible();
    await expect(page.getByText("Next: Call the first 5 pilot users and measure repeat support questions.")).toBeVisible();
    await page.getByPlaceholder("Record measured result...").fill("12 qualified signups from 100 visits.");
    await page.getByPlaceholder("Interpret the signal...").fill("Pass: early demand crossed the signup threshold.");
    await page.getByRole("button", { name: "Save experiment result" }).click();
    await expect(page.getByText("Experiment result saved")).toBeVisible();
    await expect(page.getByText("Recorded result")).toBeVisible();
    await expect(page.getByText("12 qualified signups from 100 visits.").first()).toBeVisible();
    await expect(page.getByText("Fake-door waitlist test: passed against success threshold")).toBeVisible();
    await expect(page.getByText("Prediction alignment:").first()).toBeVisible();
    await expect(page.getByText("conversion probability").first()).toBeVisible();
    await expect(page.getByText("building", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Activation cohorts", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Activation and retention cohorts" })).toBeVisible();
    await expect(page.getByText("Activation cohort candidate")).toBeVisible();
    await expect(page.getByText("Fake-door waitlist test cohort")).toBeVisible();
    await page.getByPlaceholder("Cohort owner").fill("Rishabh");
    await page.getByRole("textbox", { name: "Activated", exact: true }).fill("8");
    await page.getByRole("textbox", { name: "Retained", exact: true }).fill("5");
    await page.getByRole("textbox", { name: "Paid users", exact: true }).fill("2");
    await page.getByPlaceholder("Cohort revenue").fill("180");
    await page.getByRole("textbox", { name: "Support issues", exact: true }).fill("1");
    await page.getByPlaceholder("Activation event").fill("Completed Sunday reset plan.");
    await page.getByPlaceholder("Retention window").fill("Week-one retention after concierge setup.");
    await page.getByPlaceholder("Cohort learning").fill("Activation rate is usable, retention depends on reducing support load.");
    await page.getByPlaceholder("Cohort next action").fill("Interview retained users before buying paid traffic.");
    await page.getByRole("button", { name: "Save activation cohort" }).click();
    await expect(page.getByText("Activation cohort saved")).toBeVisible();
    await expect(page.getByText("Latest activation cohort")).toBeVisible();
    await expect(page.getByText("12 signups, 8 activated, 5 retained, 2 paid")).toBeVisible();
    await expect(page.getByText("Activation 67%")).toBeVisible();
    await expect(page.getByText("Retention 63%")).toBeVisible();
    await expect(page.getByText("Next: Interview retained users before buying paid traffic.")).toBeVisible();
    await expect(page.getByText("Channel economics", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Channel economics and CAC" })).toBeVisible();
    await expect(page.getByText("Channel economics candidate")).toBeVisible();
    await page.getByPlaceholder("Channel owner").fill("Rishabh");
    await page.getByPlaceholder("Channel spend").fill("90");
    await page.getByPlaceholder("Impressions").fill("1000");
    await page.getByPlaceholder("Clicks").fill("120");
    await page.getByPlaceholder("Channel evidence").fill("Spent $90 on creator placements for the cohort.");
    await page.getByPlaceholder("Channel next action").fill("Repeat only if paid cohort revenue stays above acquisition spend.");
    await page.getByRole("button", { name: "Save channel economics" }).click();
    await expect(page.getByText("Channel economics saved")).toBeVisible();
    await expect(page.getByText("Latest channel economics")).toBeVisible();
    await expect(page.getByText("CAC $45", { exact: true })).toBeVisible();
    await expect(page.getByText("Cost per signup: $8")).toBeVisible();
    await expect(page.getByText("Next: Repeat only if paid cohort revenue stays above acquisition spend.")).toBeVisible();
    await expect(page.getByText("Payback paid-back").first()).toBeVisible();
    await expect(page.getByText("2 paid users, blended CAC $45, payback paid-back.").first()).toBeVisible();
    await expect(page.getByText(/Scaling threshold: .*CAC/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Scale strong branch plan" })).toBeVisible();
    await expect(page.getByText("Human review only. This app does not spend, contact customers, deploy, or change billing from this plan.")).toBeVisible();
    await expect(page.getByLabel("Scale strong branch plan markdown")).toHaveValue(/# Scale Strong Branch Plan: Gen Z Recovery Planner/);
    await expect(page.getByText("Spawned drafts")).toBeVisible();
    await expect(page.locator("[aria-label='Spawned venture drafts']")).toBeVisible();
    await expect(page.locator("[aria-label='Spawned venture drafts']").getByText("Human review required before save")).toBeVisible();
    await expect(page.locator("[aria-label='Spawned venture drafts']").getByText("Pricing tier").first()).toBeVisible();
    await expect(page.getByText("Kill pressure rules")).toBeVisible();
    await expect(page.getByText("Recommended decision: Kill")).toBeVisible();
    await expect(page.locator("[aria-label='Weak branch kill memory']")).toBeVisible();
    await expect(page.locator("[aria-label='Weak branch kill memory']").getByText("Kill weak branches", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Weak branch kill memory']").getByText("no spend / no outreach")).toBeVisible();
    await expect(page.locator("[aria-label='Learning reinvestment queue']")).toBeVisible();
    await expect(page.locator("[aria-label='Learning reinvestment queue']").getByText("Old learning changes the next branch")).toBeVisible();
    await expect(page.locator("[aria-label='Learning reinvestment queue']").getByText(/Proof:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Opportunity discovery backlog']")).toBeVisible();
    await expect(page.locator("[aria-label='Opportunity discovery backlog']").getByText("Next research command attached")).toBeVisible();
    await expect(page.locator("[aria-label='Opportunity discovery backlog']").getByText(/Research:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Overlooked opportunity atlas']")).toBeVisible();
    await expect(page.locator("[aria-label='Overlooked opportunity atlas']").getByText("Find overlooked high-value opportunities")).toBeVisible();
    await expect(page.locator("[aria-label='Overlooked opportunity atlas']").getByText("Cheap internal test only")).toBeVisible();
    await expect(page.locator("[aria-label='Overlooked opportunity atlas']").getByText("No external send / spend / deploy / billing")).toBeVisible();
    await expect(page.locator("[aria-label='Overlooked opportunity atlas']").getByText(/Hidden wedge:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Overlooked opportunity atlas']").getByText(/Not recycled:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Overlooked opportunity atlas']").getByText(/Cheap test:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText("Prove whether anyone wants one")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText("Approval gated")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText("No external send / spend / deploy / contact / billing")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText(/Hypothesis:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText(/Validation command:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText(/Success:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText(/Failure:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText(/Pivot:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation command packs']").getByText(/Demand drift update:/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Manual atlas validation result" })).toBeVisible();
    await page.getByPlaceholder("Validation buyer count").fill("7");
    await page.getByPlaceholder("Validation pain count").fill("6");
    await page.getByPlaceholder("Validation wedge count").fill("5");
    await page.getByPlaceholder("Validation paid count").fill("2");
    await page.getByPlaceholder("Strongest validation quote...").fill("I would use the Sunday reset if reminders worked without another template.");
    await page.getByPlaceholder("Strongest validation objection...").fill("Needs calendar privacy guardrails before rollout.");
    await page.getByPlaceholder("Source-backed validation evidence...").fill("Seven saved manual notes confirmed the pain; two accepted paid pilots.");
    await page.getByPlaceholder("Validation learning...").fill("The overlooked wedge is reminder orchestration, not another template.");
    await page.getByPlaceholder("Validation owner").fill("Rishabh");
    await page.getByPlaceholder("Validation next action").fill("Convert this validation result into the next concierge cohort.");
    await page.getByRole("button", { name: "Save atlas validation result" }).click();
    await expect(page.getByText("Atlas validation result saved")).toBeVisible();
    await expect(page.getByText("Latest validation result")).toBeVisible();
    await expect(page.getByText("Latest validation result").locator("..").getByText("passed: 7 qualified buyers, 5 hidden-wedge confirmations, 2 paid pricing signals.")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation result ledger']")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation result ledger']").getByText("Manual demand proof")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation result ledger']").getByText("Updates demand drift")).toBeVisible();
    await expect(page.locator("[aria-label='Atlas validation result ledger']").getByText(/Manual result:/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Local product-build run proof" })).toBeVisible();
    await page.getByPlaceholder("Product build run owner").fill("Rishabh");
    await page.getByPlaceholder("Local build run proof...").fill("Ran the local generated-app verifier command and captured the report without deploying.");
    await page.getByPlaceholder("Local artifact proof...").fill("/tmp/recovery-planner/generated-app with source signatures preserved.");
    await page.getByPlaceholder("Verifier report proof...").fill("Verifier report shows setup/typecheck/test/build/browser-smoke passed locally.");
    await page.getByPlaceholder("Product build run learning...").fill("Validation-backed build proof is ready to import before pilot handoff.");
    await page.getByRole("button", { name: "Save product build run proof" }).click();
    await expect(page.getByText("Product build run proof saved")).toBeVisible();
    await expect(page.getByText("Latest build run proof")).toBeVisible();
    await expect(page.locator("[aria-label='Product build command run ledger']")).toBeVisible();
    await expect(page.locator("[aria-label='Product build command run ledger']").getByText("Local proof only")).toBeVisible();
    await expect(page.locator("[aria-label='Product build command run ledger']").getByText("No external build side effect")).toBeVisible();
    await expect(page.locator("[aria-label='Product build command queue']")).toBeVisible();
    await expect(page.locator("[aria-label='Product build command queue']").getByText("No fake source boundary")).toBeVisible();
    await expect(page.locator("[aria-label='Product build command queue']").getByText("Validation-backed build")).toBeVisible();
    await expect(page.locator("[aria-label='Product build command queue']").getByText(/Command:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Executable MVP release workspaces']")).toBeVisible();
    await expect(page.locator("[aria-label='Executable MVP release workspaces']").getByText("No-deploy release boundary", { exact: true })).toBeVisible();
    await expect(page.locator("[aria-label='Executable MVP release workspaces']").getByText(/Verifier proof:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Pilot cohort signal gates']")).toBeVisible();
    await expect(page.locator("[aria-label='Pilot cohort signal gates']").getByText("No-send pilot cohort")).toBeVisible();
    await expect(page.locator("[aria-label='No-send email gate worklist']")).toBeVisible();
    await expect(page.locator("[aria-label='No-send email gate worklist']").getByText("Draft only - do not send")).toBeVisible();
    await expect(page.locator("[aria-label='No-send email gate worklist']").getByText("Redacted replies can become interview, pricing, risk, or activation proof")).toBeVisible();
    await expect(page.locator("[aria-label='Launch control queue']")).toBeVisible();
    await expect(page.locator("[aria-label='Launch control queue']").getByText("No external send / spend / deploy")).toBeVisible();
    await expect(page.locator("[aria-label='Launch control queue']").getByText(/Launch command:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Launch control queue']").getByText(/Approval:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Demand capture proof queue']")).toBeVisible();
    await expect(page.locator("[aria-label='Demand capture proof queue']").getByText("No fake demand boundary")).toBeVisible();
    await expect(page.locator("[aria-label='Demand capture proof queue']").getByText(/Capture command:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Demand capture proof queue']").getByText(/Metric:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Portfolio decision command queue']")).toBeVisible();
    await expect(page.locator("[aria-label='Portfolio decision command queue']").getByText("Human review boundary")).toBeVisible();
    await expect(page.locator("[aria-label='Portfolio decision command queue']").getByText(/Decision command:/).first()).toBeVisible();
    await expect(page.locator("[aria-label='Portfolio decision command queue']").getByText(/Next command:/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Kill decision artifact" })).toBeVisible();
    await expect(page.getByText(/Confidence \d+\/100/).first()).toBeVisible();
    await expect(page.getByText("Evidence for stopping", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Kill decision markdown")).toHaveValue(/# Kill Decision Artifact: Gen Z Recovery Planner/);
    await expect(page.getByText("Product not differentiated").first()).toBeVisible();
    await expect(page.getByText("Competitive evidence says the product is not meaningfully differentiated from existing alternatives.")).toBeVisible();
    await expect(page.getByText("Support load pressure").first()).toBeVisible();
    await expect(page.getByText("Resolve high-severity support issues before scaling acquisition.")).toBeVisible();
    await expect(page.getByText("Next: Prove a unique wedge against the strongest substitute before adding build scope or paid acquisition.").first()).toBeVisible();
    await expect(page.getByText("Channel paid back", { exact: true })).toBeVisible();
    await expect(page.getByText("Competitor watches", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Competitor watchlist" })).toBeVisible();
    await expect(page.getByText("Competitor candidate")).toBeVisible();
    await page.getByPlaceholder("Competitor name").fill("Notion reset templates");
    await page.getByPlaceholder("Competitor owner").fill("Rishabh");
    await page.getByPlaceholder("Differentiation plan").fill("Automated Sunday reset workflow with consent-aware reminders.");
    await page.getByPlaceholder("Competitor response plan").fill("Compare repeat-use and setup time against templates before scaling paid traffic.");
    await page.getByPlaceholder("Competitor next action").fill("Interview five users about switching-cost pressure from templates.");
    await page.getByRole("button", { name: "Save competitor watch" }).click();
    await expect(page.getByText("Competitor watch saved")).toBeVisible();
    await expect(page.getByText("Latest competitor watch")).toBeVisible();
    await expect(page.getByText("Notion reset templates", { exact: true })).toBeVisible();
    await expect(page.getByText("Differentiation: Automated Sunday reset workflow with consent-aware reminders.")).toBeVisible();
    await expect(page.getByText("Response: Compare repeat-use and setup time against templates before scaling paid traffic.")).toBeVisible();
    await expect(page.getByText("Next: Interview five users about switching-cost pressure from templates.")).toBeVisible();
    await expect(page.getByText("Autonomy audits")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Autonomy audit log" })).toBeVisible();
    await expect(page.getByText(/\d+ local code/)).toBeVisible();
    await expect(page.getByText(/\d+ local tests/)).toBeVisible();
    await expect(page.getByText("Autonomy audit candidate")).toBeVisible();
    await page.getByPlaceholder("Audit actor").fill("Rishabh");
    await page.getByRole("textbox", { name: "Replay note", exact: true }).fill("Replay by reviewing deployment approval trail before external execution.");
    await page.getByPlaceholder("Autonomy next action").fill("Keep deployment blocked until a human approves the external action.");
    await page.getByRole("button", { name: "Save autonomy audit" }).click();
    await expect(page.getByText("Autonomy audit saved")).toBeVisible();
    await expect(page.getByText("Latest autonomy audit")).toBeVisible();
    await expect(page.getByText(/side effect: external-(proposed|blocked)/).first()).toBeVisible();
    await expect(page.getByText("Replay: Replay by reviewing deployment approval trail before external execution.")).toBeVisible();
    await expect(page.getByText("Agent runs", { exact: true })).toBeVisible();
    await expect(page.getByText("Model-call logs", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Agent run replay log" })).toBeVisible();
    await expect(page.getByText("Agent run candidate")).toBeVisible();
    await page.getByPlaceholder("Agent run owner").fill("Rishabh");
    await page.getByPlaceholder("Agent replay command").fill("Replay by opening the autonomy audit, then checking the deployment approval trail.");
    await page.getByPlaceholder("Agent run next action").fill("Replay this run before any external deployment side effect.");
    await page.getByRole("button", { name: "Save agent run" }).click();
    await expect(page.getByText("Agent run saved")).toBeVisible();
    await expect(page.getByText("Latest agent run")).toBeVisible();
    await expect(page.getByText("human-reviewed-local-audit").first()).toBeVisible();
    await expect(page.getByText("Replay: Replay by opening the autonomy audit, then checking the deployment approval trail.")).toBeVisible();
    await expect(page.getByText("Next: Replay this run before any external deployment side effect.")).toBeVisible();
    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Gen Z Recovery Planner/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/weak buyer urgency/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/12 qualified signups/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/student discount/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Sunday reset plan/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/clinical advice/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/not-sent/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Outreach Campaign Brief/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/consent language/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/customer-interview/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No generated source attached yet/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/generated source is not attached/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Generated App Handoff/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Generated App Source Scaffold/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Generated App Verification Proof/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Deployment Readiness Packet/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Deployment Environment Matrix/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/deploymentEscalationAuditRollup/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Deployment Escalation Audit Replay/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Deployment Escalation Side Effect Chart/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/does not deploy/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/VITE_EXTERNAL_ACTIONS_ENABLED=false/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/generated-app:materialize/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/generated-app:verify/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/browser-smoke/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/src\/routes\/Experiments/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No artifact URI attached yet/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/source repo still pending/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Deployment proof blocked/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No deployment was executed/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Paid pilot LOI/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/not-charged/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Kill Decision Artifact/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/weakBranchKillMemories/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Weak Branch Kill Memory/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/calendar-sync concierge/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/pilot-issue/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/repeat support questions/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Week-one retention/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/buying paid traffic/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/paid-back/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/creator placements/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Financial Model/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Net evidence cash/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Venture Portfolio Charts/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Finance Score Chart/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Notion reset templates/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/switching-cost pressure/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/deployment approval trail/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/human-reviewed-local-audit/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/external deployment side effect/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/scaleStrongBranchPlans/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Scale Strong Branch Plan/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/spawnedVentureDrafts/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Spawned Venture Draft/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/learningReinvestmentQueue/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Learning Reinvestment Task/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/old learning changes/i);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/opportunityDiscoveryBacklog/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Opportunity Discovery Backlog/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Next Research Command/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/overlookedOpportunityAtlas/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Overlooked Opportunity Atlas Item/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Hidden Wedge Rationale/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Not-Recycled Proof/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Cheap Internal Test Command/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/atlasValidationCommandPacks/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Atlas Validation Command Pack/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Cheapest Internal Validation Command/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Demand Drift Update Instruction/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Approval Gates/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/atlasValidationResultLedger/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Atlas Validation Result/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Manual Result/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/productBuildCommandQueue/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Product Build Command/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No-Fake-Source Boundary/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/validation-backed product build/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/validation-result/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/productBuildCommandRunLedger/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Product Build Command Run/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/local product build command run/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/mvpReleaseWorkspaceList/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Executable MVP Release Workspace/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No-Deploy Release Boundary/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/launchControlQueue/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Launch Control Queue Item/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No External Action Proof/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/demandCaptureProofQueue/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Demand Capture Proof Item/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No-Fake-Demand Boundary/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/portfolioDecisionCommandQueue/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Portfolio Decision Command/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Human Review Boundary/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/pilotCohortSignalGates/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Pilot Cohort Signal Gate/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No-Send Boundary/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/noSendEmailGateWorklist/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/No-Send Email Gate Work Item/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/DRAFT ONLY - DO NOT SEND FROM THIS APP/);
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("pilot cohort signal gate");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("no-send pilot cohort");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("no-send email gate");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("internal outreach draft");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("activation cohort draft");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("scale strong branches");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("kill weak branches");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("learning reinvestment queue");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("reinvest learning");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("opportunity discovery backlog");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("discover opportunities");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("overlooked opportunity atlas");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("overlooked high value opportunity");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("hidden wedge rationale");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("cheap internal test command");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("atlas validation command packs");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("prove whether anyone wants one");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("validation command pack");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("cheap internal validation command");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("demand drift update instruction");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("approval gated validation pack");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("atlas validation result ledger");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("manual validation result");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("manual demand proof");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("product build command queue");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("build products");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("validation-backed product build");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("build first product");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("product build command run ledger");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("validation-backed product build run");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("executable mvp release workspace");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("no-deploy release boundary");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("launch control queue");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("launch experiments");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("no external send spend deploy");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("demand capture proof queue");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("capture demand");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("no fake demand boundary");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("portfolio decision command queue");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("recommend continue pivot kill");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("human review boundary");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("weak buyer urgency");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("student discount");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Calendar sync");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("manual email");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("clinical advice");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("outreach campaign");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("consent language");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("generated source is not attached");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("generated app handoff");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("generated app source scaffold");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("No external side effects");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("generated app verification proof");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("deployment readiness packet");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("deployment environment matrix");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Deployment Escalation Audit Replay");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Deployment Owner Workload Chart");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Deployment Escalation Side Effect Chart");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Production remains blocked");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("does not deploy");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("source repo still pending");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Deployment proof blocked");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("No deployment was executed");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("revenue intent");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("kill decision artifact");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("calendar-sync concierge");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("repeat support questions");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("buying paid traffic");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("above acquisition spend");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("financial model");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Net evidence cash");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Finance Score Chart");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Notion reset templates");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("switching-cost pressure");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("deployment approval trail");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("external deployment side effect");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("spawned venture draft");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("pricing tier branch");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("12 qualified");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("enterprise procurement");
    await expect(page.getByText("No ventures match this search")).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("Gen Z students");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();
    await page.getByRole("combobox", { name: "Decision" }).click();
    await page.getByRole("option", { name: "Scale" }).click();
    await page.getByRole("combobox", { name: "Next lifecycle" }).click();
    await page.getByRole("option", { name: "Scaling" }).click();
    await page.getByPlaceholder("Record kill/continue rationale...").fill("Channel passed but support load needs review.");
    await page.getByPlaceholder("Define next decision action...").fill("Interview the first 5 signups before paid acquisition.");
    await page.getByRole("button", { name: "Save decision" }).click();
    await expect(page.getByText("Venture decision saved")).toBeVisible();
    await expect(page.getByText("Decision history")).toBeVisible();
    await expect(page.getByText("Scale: Building -> Scaling")).toBeVisible();
    await expect(page.locator("p").filter({ hasText: "Channel passed but support load needs review." }).last()).toBeVisible();
    await expect(page.getByText("scaling", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/support load needs review/);
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("support load");
    await expect(page.getByRole("heading", { name: "Gen Z Recovery Planner" })).toBeVisible();

    await page.goto("/market-research");
    await page.getByRole("button", { name: "View Results" }).click();

    await page.getByRole("button", { name: "Research Evidence Gap" }).click();
    await expect(page.getByText("Follow-up research: pressure-test Gen Z Recovery Planner.").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Validate missing or weak evidence, especially x.").first()).toBeVisible();
    await expect(page.getByText("Market Research Results")).toHaveCount(0);
    await page.getByRole("button", { name: "View Results" }).click();
    await expect(page.getByText("Opportunity Scorecard")).toBeVisible();

    await page.goto("/recommendations");
    await expect(page.getByRole("heading", { name: "Recommendations" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Launch Gen Z Recovery Planner")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Source Evidence: 3").first()).toBeVisible();
    await page.getByText("Launch Gen Z Recovery Planner").click();
    const recDialog = page.getByRole("dialog");
    await expect(recDialog).toBeVisible();
    await expect(recDialog.getByText("Source Evidence")).toBeVisible();
    await expect(recDialog.getByText("Evidence-backed by 3 sources")).toBeVisible();
    await expect(recDialog.getByText("Gen Z creators are packaging burnout recovery")).toBeVisible();
    await page.getByRole("button", { name: "Accept" }).click();
    await expect(page.getByText("Recommendation accepted")).toBeVisible({ timeout: 5000 });

    await page.goto("/accepted-ideas");
    await expect(page.getByRole("heading", { name: "Accepted Ideas" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Decision Library")).toBeVisible();
    await expect(page.getByText("Evidence-backed decisions")).toBeVisible();
    await expect(page.getByRole("button", { name: /Launch Gen Z Recovery Planner/ })).toBeVisible();
    await expect(page.getByText("Source Evidence: 3").first()).toBeVisible();
    await expect(page.getByText("Ready for pilot")).toBeVisible();
    await expect(page.getByText("Review cadence: Weekly until launch").first()).toBeVisible();

    await page.goto("/report");
    await expect(page.getByText("MarketPulse Intelligence Report")).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Recovery Routine Planners" })).toBeVisible();
    await expect(page.getByText("Launch Gen Z Recovery Planner").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Evidence Appendix" })).toBeVisible();
    await expect(page.getByText("Gen Z creators are packaging burnout recovery").first()).toBeVisible();
    await expect(page.getByText("AI Output Audit Trail")).toBeVisible();
    await expect(page.getByText("Local deterministic draft").first()).toBeVisible();
    await expect(page.getByText("Source Inputs").first()).toBeVisible();
    await expect(page.getByText(/output tokens/).first()).toBeVisible();

    await page.goto("/briefing");
    await expect(page.getByRole("heading", { name: "Intelligence Briefing" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Local draft from trends, report synthesis, and recommendations")).toBeVisible();
    await expect(page.getByText("Briefing Trust Ledger")).toBeVisible();
    await expect(page.getByText("AI Output Audit Trail")).toBeVisible();
    await expect(page.getByText("Local draft mode")).toBeVisible();
    await expect(page.getByText("Regenerate using stricter evidence")).toBeVisible();
    await page.getByRole("button", { name: "Regenerate using stricter evidence" }).click();
    await expect(page.getByText("Strict evidence mode")).toBeVisible();
    await expect(page.getByText("Strict evidence local draft", { exact: true })).toBeVisible();
    await expect(page.getByText("Strict evidence local draft from cited trends and recommendations")).toBeVisible();
    await expect(page.getByText("Recovery Routine Planners").first()).toBeVisible();
    await expect(page.getByText("Evidence Covered in This Briefing")).toBeVisible();
    await expect(page.getByText("Gen Z creators are packaging burnout recovery").first()).toBeVisible();
  });

  test("Venture Lab: manual thesis onboarding creates a workspace", async ({ page }) => {
    test.setTimeout(60000);

    await page.addInitScript(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("marketpulse-venture-portfolio:")) {
          localStorage.removeItem(key);
        }
      }
    });

    await page.goto("/ventures");
    await expect(page.getByRole("heading", { name: "Venture Lab" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Demo ready")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("worker-preflight:")).toBeVisible();
    await expect(page.getByText("Runtime health memory")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Worker status")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create venture thesis" })).toBeVisible();
    await expect(page.getByText("No saved venture workspaces")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create venture thesis" })).toBeDisabled();

    await page.getByPlaceholder("Thesis title").fill("Campus Ops Copilot");
    await page.getByPlaceholder("Target buyer").fill("Student club treasurers");
    await page.getByPlaceholder("Pain statement").fill("Club leaders lose reimbursements and vendor deadlines.");
    await page.getByPlaceholder("Product wedge").fill("Inbox-to-budget workflow that turns receipts into approved reimbursement packets.");
    await page.getByPlaceholder("Revenue model").fill("$29/month per club");
    await page.getByPlaceholder("Pricing hypothesis").fill("$29/month");
    await page.getByLabel("Acquisition channel", { exact: true }).fill("student government partnerships");
    await page.getByPlaceholder("Evidence note").fill("Manual thesis from two club organizer conversations.");
    await page.getByRole("button", { name: "Create venture thesis" }).click();

    await expect(page.getByText("Venture thesis created")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Campus Ops Copilot" })).toBeVisible();
    await expect(page.getByText("Manual thesis workspace")).toBeVisible();
    await expect(page.getByText("Why Now").first()).toBeVisible();
    await expect(page.getByText("Student club treasurers", { exact: true }).first()).toBeVisible();
    await page.getByPlaceholder("Thesis title").fill("Campus Reimbursement Copilot");
    await page.getByPlaceholder("Target buyer").fill("Student club treasurers");
    await page.getByPlaceholder("Pain statement").fill("Treasurers miss reimbursement packet deadlines.");
    await page.getByPlaceholder("Product wedge").fill("Inbox workflow for approved reimbursement packets.");
    await page.getByLabel("Acquisition channel", { exact: true }).fill("student government partnerships");
    await expect(page.getByText("Tried-this-before matches")).toBeVisible();
    await expect(page.getByText("Campus Ops Copilot").first()).toBeVisible();
    await expect(page.getByText("fork", { exact: true })).toBeVisible();
    await expect(page.getByText(/Matched .*buyer/)).toBeVisible();
    await expect(page.getByText(/Difference check: .*pain/)).toBeVisible();
    await expect(page.getByText("Venture readiness blockers")).toBeVisible();
    await expect(page.getByText("No source-backed evidence attached")).toBeVisible();
    await expect(page.getByText("No measured experiment result")).toBeVisible();
    await expect(page.getByText("No MVP build workspace", { exact: true })).toBeVisible();
    await expect(page.getByText("No artifact proof", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Browser research queue" })).toBeVisible();
    await expect(page.getByText("Browser research candidate")).toBeVisible();
    await expect(page.getByText("source-backed market evidence").first()).toBeVisible();
    await page.getByRole("combobox", { name: "Browser research status" }).click();
    await page.getByRole("option", { name: "Evidence captured" }).click();
    await page.getByPlaceholder("Browser research owner").fill("Rishabh");
    await page.getByPlaceholder("Evidence URL").fill("https://example.com/student-government-budget-thread");
    await page.getByPlaceholder("Browser findings").fill("Student government budget thread shows treasurers missing reimbursement packet deadlines.");
    await page.getByPlaceholder("Browser replay note").fill("Replay by reopening the saved budget thread and checking the timestamped treasurer quotes.");
    await page.getByPlaceholder("Browser research next action").fill("Attach the thread as source evidence before building.");
    await page.getByRole("button", { name: "Save browser research task" }).click();
    await expect(page.getByText("Browser research task saved")).toBeVisible();
    await expect(page.getByText("Latest browser research task")).toBeVisible();
    await expect(page.getByText("Student government budget thread shows treasurers missing reimbursement packet deadlines.", { exact: true })).toBeVisible();
    await expect(page.getByText(/\d+ read-only research/).first()).toBeVisible();
    await expect(page.getByText("Manual thesis still needs independent source evidence.").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fake-door waitlist test" })).toBeVisible();
    await page.getByPlaceholder("Record measured result...").fill("Missed signup threshold; treasurers said reimbursement packet automation was not urgent.");
    await page.getByPlaceholder("Interpret the signal...").fill("Failed because buyers liked the idea but would not switch from spreadsheets.");
    await page.getByRole("button", { name: "Save experiment result" }).click();
    await expect(page.getByText("Experiment result saved")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Failure lessons" }).first()).toBeVisible();
    await expect(page.getByText("Fake-door waitlist test failed").first()).toBeVisible();
    await expect(page.getByText("Buyer does not care").first()).toBeVisible();
    await expect(page.getByText("Do not build more until a buyer shows urgent switching behavior, paid intent, or repeated activation.").first()).toBeVisible();
    await expect(page.getByText(/Never repeat:/).first()).toBeVisible();
    await expect(page.getByText(/Reuse trigger:/).first()).toBeVisible();
    await page.getByRole("combobox", { name: "Decision" }).click();
    await page.getByRole("option", { name: "Kill" }).click();
    await page.getByRole("combobox", { name: "Next lifecycle" }).click();
    await page.getByRole("option", { name: "Killed" }).click();
    await page.getByPlaceholder("Record kill/continue rationale...").fill("Killed because treasurers did not show urgent reimbursement demand.");
    await page.getByPlaceholder("Define next decision action...").fill("Revisit only if reimbursement deadlines become externally enforced.");
    await page.getByRole("button", { name: "Save decision" }).click();
    await expect(page.getByText("Venture decision saved")).toBeVisible();
    await expect(page.getByText("Killed venture memory").first()).toBeVisible();
    await page.getByPlaceholder("Qualified buyers").fill("3");
    await page.getByPlaceholder("Paid commitments").fill("1");
    await page.getByPlaceholder("Invoice requests").fill("1");
    await page.getByPlaceholder("Accepted price").fill("$29/month");
    await page.getByPlaceholder("Record pricing objections...").fill("Needs student government budget approval.");
    await page.getByPlaceholder("Record pricing evidence...").fill("Treasurer budget approval committee requested a paid pilot after procurement dates changed.");
    await page.getByRole("button", { name: "Save pricing signal" }).click();
    await expect(page.getByText("Pricing signal saved")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Revival triggers" }).first()).toBeVisible();
    await expect(page.getByText("Post-kill willingness-to-pay evidence changes the budget or urgency assumption.").first()).toBeVisible();
    await expect(page.getByText(/Revival condition:/).first()).toBeVisible();
    await expect(page.getByText("Deployment proposal blocked until independent evidence and a build artifact exist.").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Competitor watchlist" })).toBeVisible();

    await page.getByRole("button", { name: "Export JSON" }).click();
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Campus Ops Copilot/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/student government partnerships/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/Manual thesis from two club organizer conversations/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/student-government-budget-thread/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/would not switch from spreadsheets/);
    await expect(page.getByPlaceholder("Click Export JSON to generate a portable venture portfolio payload.")).toHaveValue(/paid pilot after procurement dates changed/);

    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("student government partnerships");
    await expect(page.getByRole("heading", { name: "Campus Ops Copilot" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("approved reimbursement packets");
    await expect(page.getByRole("heading", { name: "Campus Ops Copilot" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("timestamped treasurer quotes");
    await expect(page.getByRole("heading", { name: "Campus Ops Copilot" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("would not switch from spreadsheets");
    await expect(page.getByRole("heading", { name: "Campus Ops Copilot" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("paid pilot after procurement dates changed");
    await expect(page.getByRole("heading", { name: "Campus Ops Copilot" })).toBeVisible();
    await page.getByPlaceholder("Search ventures or import audits by buyer, pain, channel, reason, or outcome...").fill("enterprise procurement");
    await expect(page.getByText("No ventures match this search")).toBeVisible();
  });

  test("Recommendations: dismissed opportunities become rejected decision-library records", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder(/Describe a market to research/).fill("AI wellness apps for Gen Z");
    await page.getByRole("button", { name: "Launch Mission" }).click();
    await expect(page.getByRole("button", { name: "View Results" })).toBeVisible({ timeout: 15000 });

    await page.goto("/recommendations");
    await expect(page.getByRole("heading", { name: "Recommendations" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Launch Gen Z Recovery Planner")).toBeVisible({ timeout: 15000 });
    await page.getByText("Launch Gen Z Recovery Planner").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Dismiss" }).click();
    await expect(page.getByText("Recommendation dismissed")).toBeVisible({ timeout: 5000 });

    await page.goto("/rejected-ideas");
    await expect(page.getByRole("heading", { name: "Rejected Ideas" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Rejected Decision Library")).toBeVisible();
    await expect(page.getByText("Evidence-backed decisions")).toBeVisible();
    await expect(page.getByRole("button", { name: /Launch Gen Z Recovery Planner/ })).toBeVisible();
    await expect(page.getByText("Archived with evidence")).toBeVisible();
    await expect(page.getByText("Revisit trigger: Revisit if market moves").first()).toBeVisible();
    await expect(page.getByText("High-priority watchlist")).toBeVisible();

    await page.getByRole("button", { name: /Launch Gen Z Recovery Planner/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Research Follow-up" }).click();
    await expect(page).toHaveURL(/market-research/);
    await expect(page.getByText("Follow-up research: reassess Launch Gen Z Recovery Planner.").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Decision context: rejected decision with 84% confidence and high priority.").first()).toBeVisible();
  });

  test("Market Research: launch button disabled when input empty", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole("button", { name: "Launch Mission" })).toBeDisabled();
  });

  test("Market Research: view mode toggle switches layout", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    // Default is Command view — Live Feed visible, tabs not visible
    await expect(page.getByText("Live Feed")).toBeVisible();

    // Switch to Observe
    await page.getByRole("button", { name: "Observe" }).click();
    await expect(page.getByRole("tab", { name: "Agent Feed" })).toBeVisible();

    // Switch back to Command
    await page.getByRole("button", { name: "Command" }).click();
    await expect(page.getByText("Live Feed")).toBeVisible();
  });

  test("Market Research: discovery grid shows empty state", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("No discoveries yet")).toBeVisible();
  });

  test("sidebar navigation to Market Research works", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=MarketPulse").first()).toBeVisible({ timeout: 10000 });

    const marketResearchNav = page.locator("nav button", { hasText: "Market Research" });
    await marketResearchNav.hover();
    await marketResearchNav.focus();
    await marketResearchNav.click();
    await page.waitForURL("**/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible();
    await expect(page.getByText("route-preload: 1 loaded")).toBeVisible();
  });

  test("sidebar highlights active Market Research tab", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    const navBtn = page.locator("nav button", { hasText: "Market Research" });
    await expect(navBtn).toHaveClass(/text-blue-600/);
  });

  test("existing Dashboard page still works", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=MarketPulse").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Welcome back, Test Business")).toBeVisible({ timeout: 5000 });
  });

  test("existing Trends page still works", async ({ page }) => {
    await page.goto("/trends");
    await expect(page.locator("text=MarketPulse").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Trends Explorer")).toBeVisible({ timeout: 5000 });
  });

  test("Trends Explorer: generated trend detail shows trend memory", async ({ page, request }) => {
    await request.post(`${AI_SERVER_URL}/api/mission/reset`);
    const createResp = await request.post(`${AI_SERVER_URL}/api/mission/create`, {
      data: { prompt: "AI wellness apps for Gen Z" },
    });
    expect(createResp.ok()).toBeTruthy();

    await page.goto("/trends");
    await expect(page.getByRole("heading", { name: "Trends Explorer" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Recovery Routine Planners")).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Recovery Routine Planners/ }).click();
    await expect(page).toHaveURL(/\/trends\/demo-trend-/);
    await expect(page.getByRole("heading", { name: "Recovery Routine Planners" })).toBeVisible();
    await expect(page.getByLabel("Trend Memory")).toBeVisible();
    await expect(page.getByText("New signal", { exact: true })).toBeVisible();
    await expect(page.getByText("Forecast Confidence")).toBeVisible();
    await expect(page.getByText("Source Mix")).toBeVisible();
    await expect(page.getByText("3 sources across 3 platforms")).toBeVisible();
    await expect(page.getByText("X/Twitter coverage missing")).toBeVisible();
  });

  test("existing Recommendations page still works", async ({ page }) => {
    await page.goto("/recommendations");
    await expect(page.locator("text=MarketPulse").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Recommendations" })).toBeVisible({ timeout: 5000 });
  });

  test("navigation between Market Research and Dashboard preserves state", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    await page.locator("nav button", { hasText: "Dashboard" }).click();
    await page.waitForURL("/");
    await expect(page.getByText("Welcome back, Test Business")).toBeVisible({ timeout: 5000 });

    await page.locator("nav button", { hasText: "Market Research" }).click();
    await page.waitForURL("**/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible();
    await expect(page.getByText("Echo")).toBeVisible();
  });
});

test.describe("AI Server API", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const resp = await request.get(`${AI_SERVER_URL}/health`);
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(body.demoMode).toBe(true);
    expect(body.status).toBe("ready");
    expect(body.missingRequired).toEqual([]);
    expect(body.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "ai-server", ok: true, required: true }),
      expect.objectContaining({ name: "insforge", required: false }),
      expect.objectContaining({ name: "openai", status: expect.stringMatching(/ready|demo-fallback/) }),
      expect.objectContaining({ name: "python-worker", status: expect.stringMatching(/ready|missing-llm|blocked/) }),
      expect.objectContaining({ name: "mongodb-vector", required: false }),
      expect.objectContaining({ name: "tts", required: false }),
    ]));
  });

  test("worker preflight endpoint exposes strict live-readiness blocker", async ({ request }) => {
    const resp = await request.get(`${AI_SERVER_URL}/api/worker/preflight`);
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.workerCanStart).toBe(true);
    expect(body.insforge).toEqual(expect.objectContaining({ status: "ready" }));
    expect(body.liveLlm).toEqual(expect.objectContaining({
      status: "missing",
      openaiConfigured: false,
      minimaxConfigured: false,
    }));

    const strictResp = await request.get(`${AI_SERVER_URL}/api/worker/preflight?strict=1`);
    expect(strictResp.status()).toBe(503);
    const strictBody = await strictResp.json();
    expect(strictBody.ok).toBe(false);
    expect(strictBody.liveMissionReady).toBe(false);
    expect(strictBody.exitCode).toBe(1);
  });

  test("mission create rejects empty prompt", async ({ request }) => {
    const resp = await request.post(`${AI_SERVER_URL}/api/mission/create`, {
      data: { prompt: "" },
    });
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toBe("mission_prompt_required");
  });

  test("agent retry rejects invalid agent id", async ({ request }) => {
    const resp = await request.post(`${AI_SERVER_URL}/api/agent/retry`, {
      data: { agentId: 99 },
    });
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toBe("agent_id_invalid");
  });

  test("dashboard endpoint responds", async ({ request }) => {
    const resp = await request.get(`${AI_SERVER_URL}/api/dashboard`);
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(MASTERBUILD_DASHBOARD_CONTRACT_VERSION).toBe("masterbuild-dashboard-v1");
    expect(Object.keys(body)).toEqual(expect.arrayContaining([...MASTERBUILD_DASHBOARD_KEYS]));
    expect(body).toEqual(expect.objectContaining({
      mission: null,
      recentMissions: expect.any(Array),
      agents: expect.any(Array),
      discoveries: expect.any(Array),
      logs: expect.any(Array),
      signals: expect.any(Array),
      thoughts: expect.any(Array),
      memory: expect.any(Array),
      businessPlans: expect.any(Array),
    }));
  });

  test("demo dashboard exposes inspectable agent lifecycle states", async ({ request }) => {
    await request.post(`${AI_SERVER_URL}/api/mission/reset`);
    const createResp = await request.post(`${AI_SERVER_URL}/api/mission/create`, {
      data: { prompt: "AI wellness apps for Gen Z" },
    });
    expect(createResp.ok()).toBeTruthy();

    const dashboardResp = await request.get(`${AI_SERVER_URL}/api/dashboard`);
    expect(dashboardResp.ok()).toBeTruthy();
    const body = await dashboardResp.json();
    const statuses = (body.agents as Array<{ status: string }>).map((agent) => agent.status);
    expect(statuses).toEqual(expect.arrayContaining(["done", "failed", "stale", "synthesizing"]));
    expect(body.agents).toContainEqual(expect.objectContaining({
      status: "failed",
      status_detail: expect.stringContaining("trust gap"),
      failure_reason: "Missing X/Twitter source coverage",
      retry_count: 2,
      confidence: expect.any(Number),
      last_heartbeat: expect.any(String),
    }));
  });
});
