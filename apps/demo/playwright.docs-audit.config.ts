import { defineConfig, devices } from "@playwright/test";

const docsAuditBase =
  process.env.DOCS_AUDIT_BASE_URL?.trim().replace(/\/?$/, "/") || "http://127.0.0.1:5174/kamod-ui/";

/**
 * Docs QA against a **manually started** dev server (plan: port 5174).
 * Default base matches GitHub Pages (`VITE_BASE_PATH=/kamod-ui/`).
 * Override with `DOCS_AUDIT_BASE_URL` (e.g. `http://127.0.0.1:5174` for root dev).
 * No `webServer` — start separately: `VITE_BASE_PATH=/kamod-ui/ pnpm dev --host 127.0.0.1 --port 5174`.
 */
export default defineConfig({
  testDir: "./e2e",
  /** Full docs crawl visits hundreds of URLs; allow ample time on slower machines. */
  timeout: 900_000,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: docsAuditBase,
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
