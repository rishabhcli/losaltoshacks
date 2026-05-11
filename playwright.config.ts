import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  webServer: [
    {
      command: "MARKETPULSE_DEMO_MODE=1 AI_SERVER_PORT=3211 node server/ai-server.mjs",
      url: "http://127.0.0.1:3211/health",
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: "VITE_API_BASE_URL=http://127.0.0.1:3211 pnpm exec vite --host 127.0.0.1 --port 3210 --strictPort",
      url: "http://127.0.0.1:3210",
      reuseExistingServer: false,
      timeout: 60000,
    },
  ],
  use: {
    baseURL: "http://127.0.0.1:3210",
    headless: true,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
