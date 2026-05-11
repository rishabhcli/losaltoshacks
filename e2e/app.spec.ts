import { test, expect } from "@playwright/test";
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

  test("core demo flow: launch mission, inspect evidence, accept opportunity, view report and briefing", async ({ page }) => {
    test.setTimeout(60000);

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
    await expect(page.getByText("Evidence diversity: 3/4 platforms")).toBeVisible();
    await expect(page.getByText("Missing platform coverage: x", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Execution difficulty: Moderate")).toBeVisible();
    await expect(page.getByRole("button", { name: "Research Evidence Gap" })).toBeVisible();
    await expect(page.getByText("Evidence-backed", { exact: true })).toBeVisible();
    await expect(page.getByText("Gen Z Recovery Planner").first()).toBeVisible();
    await expect(page.getByText("Waiting for: x")).toBeVisible();

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

    await page.locator("nav button", { hasText: "Market Research" }).click();
    await page.waitForURL("**/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible();
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
