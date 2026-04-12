import { test, expect } from "@playwright/test";
import { mockAuthAndSetup } from "./helpers";

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

    // Bottom command bar with mission input
    await expect(page.getByPlaceholder(/Describe a market to research/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Launch Mission" })).toBeVisible();

    // View mode toggle
    await expect(page.getByRole("button", { name: "Command" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Observe" })).toBeVisible();

    // Agent status grid: 5 agents
    await expect(page.getByText("Echo")).toBeVisible();
    await expect(page.getByText("Pulse", { exact: true })).toBeVisible();
    await expect(page.getByText("Thread")).toBeVisible();
    await expect(page.getByText("Ledger")).toBeVisible();
    await expect(page.getByText("Atlas")).toBeVisible();

    // Discoveries section
    await expect(page.getByText("Discoveries").first()).toBeVisible();

    // Live Feed sidebar
    await expect(page.getByText("Live Feed")).toBeVisible();
  });

  test("Market Research: observe view shows tabs", async ({ page }) => {
    await page.goto("/market-research");
    await expect(page.getByRole("heading", { name: "Market Research" })).toBeVisible({ timeout: 10000 });

    // Switch to Observe view
    await page.getByRole("button", { name: "Observe" }).click();

    // Observability tabs should now be visible
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
    const resp = await request.get("http://localhost:3001/health");
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.ok).toBe(true);
  });

  test("mission create rejects empty prompt", async ({ request }) => {
    const resp = await request.post("http://localhost:3001/api/mission/create", {
      data: { prompt: "" },
    });
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toBe("mission_prompt_required");
  });

  test("dashboard endpoint responds", async ({ request }) => {
    const resp = await request.get("http://localhost:3001/api/dashboard");
    const body = await resp.json();
    expect(typeof body).toBe("object");
  });
});
