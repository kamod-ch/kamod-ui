import { defineConfig, devices } from "@playwright/test";

/**
 * - **chromium**: all E2E specs (component smoke + kitchen sink).
 * - **webkit** / **iphone**: kitchen-sink specs only (visual + smoke on demo home / kitchen sink).
 *
 * Update baselines: `pnpm test:e2e --update-snapshots` (from apps/demo).
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixels: 150,
      threshold: 0.25,
      animations: "disabled",
    },
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "webkit",
      testMatch: /kitchen-sink.*\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "iphone",
      testMatch: /kitchen-sink.*\.spec\.ts/,
      use: { ...devices["iPhone 13"] },
    },
  ],
});
