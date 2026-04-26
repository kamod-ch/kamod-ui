import { defineConfig, devices } from "@playwright/test";

/**
 * Docs QA against a **manually started** dev server (plan: port 5174).
 * Uses `http://localhost:5174` so it matches typical `localhost` resolution (often ::1).
 * No `webServer` — start Vite separately: `pnpm dev --host 127.0.0.1 --port 5174` or use an existing listener on 5174.
 */
export default defineConfig({
  testDir: "./e2e",
  /** Full docs crawl visits hundreds of URLs; allow ample time on slower machines. */
  timeout: 900_000,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:5174",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
