import { type Page } from "@playwright/test";

export const AI_SERVER_URL = process.env.E2E_AI_SERVER_URL ?? "http://127.0.0.1:3211";

const MOCK_USER = {
  id: "test-user-001",
  email: "test@marketpulse.dev",
  display_name: "Test User",
  email_verified: true,
  created_at: "2025-01-01T00:00:00Z",
};

/**
 * Mock InsForge auth so the app thinks we're logged in.
 * The SDK flow in browser:
 *   1. tokenManager.getSession() → null
 *   2. refreshSession() → POST /api/auth/refresh → returns {accessToken, user}
 *   3. saveSessionFromResponse → sets in-memory session
 *   4. getCurrentUser() returns the user
 */
export async function mockAuthAndSetup(page: Page) {
  await page.request.post(`${AI_SERVER_URL}/api/mission/reset`).catch(() => null);

  // Mock the refresh session endpoint — this is what the SDK calls in browser mode
  await page.route("**/api/auth/refresh", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        accessToken: "mock-access-token-for-testing",
        refreshToken: "mock-refresh-token",
        user: MOCK_USER,
        csrfToken: "mock-csrf",
      }),
    });
  });

  // Mock any other auth calls
  await page.route("**/api/auth/**", (route) => {
    if (route.request().url().includes("/refresh")) {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          accessToken: "mock-access-token-for-testing",
          refreshToken: "mock-refresh-token",
          user: MOCK_USER,
          csrfToken: "mock-csrf",
        }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: null, error: null }),
      });
    }
  });

  // Block WebSocket/realtime connections to prevent hanging
  await page.route("**/socket.io/**", (route) => {
    route.abort();
  });

  await page.route("**/api/ai/tts", (route) => {
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "TTS disabled in e2e demo mode" }),
    });
  });

  // Mock InsForge database queries (for existing pages that use osdk-shims)
  await page.route("**/api/database/**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  // Set localStorage to simulate completed setup + mark splash shown
  await page.addInitScript(() => {
    localStorage.setItem(
      "marketpulse-prefs-test@marketpulse.dev",
      JSON.stringify({
        industry: "All",
        businessName: "Test Business",
        hasCompletedSetup: true,
      })
    );
    sessionStorage.setItem("marketpulse_splash_shown", "1");
  });
}
