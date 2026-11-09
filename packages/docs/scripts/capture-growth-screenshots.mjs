/**
 * Capture README and Open Graph screenshots from the running docs dev server.
 * Usage: node ./scripts/capture-growth-screenshots.mjs
 * (Playwright starts `pnpm dev` on 127.0.0.1:4173 when the port is free.)
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(docsRoot, "../..");
const port = 4173;
const baseUrl = `http://127.0.0.1:${port}/`;

const outputs = [
  {
    file: path.join(docsRoot, "public/social/saas-team-demo-og.png"),
    repoCopy: path.join(repoRoot, ".github/assets/saas-team-demo.png"),
    goto: "./demo/saas-team",
    selector: '[data-testid="saas-team-demo"]',
  },
  {
    file: path.join(docsRoot, "public/social/home-og.png"),
    goto: "./",
    selector: '[data-testid="home-page"]',
  },
];

async function waitForServer(url, attempts = 90) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Dev server did not respond at ${url}`);
}

async function main() {
  let child;
  try {
    const probe = await fetch(baseUrl);
    if (!probe.ok) throw new Error("not running");
  } catch {
    child = spawn("pnpm", ["dev", "--host", "127.0.0.1", `--port`, String(port)], {
      cwd: docsRoot,
      stdio: "ignore",
      env: { ...process.env, VITE_GROWTH_ANALYTICS: "noop" },
    });
    await waitForServer(baseUrl);
  }

  await fs.mkdir(path.join(docsRoot, "public/social"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, ".github/assets"), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route(/https:\/\/matomo\.kamod\.ch\//, (route) =>
    route.fulfill({ status: 204, body: "" }),
  );
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("theme-preset", "ocean");
  });

  for (const shot of outputs) {
    await page.goto(new URL(shot.goto, baseUrl).href);
    await page.locator("html").waitFor({ state: "attached" });
    await page.waitForSelector(shot.selector, { timeout: 120_000 });
    await page.evaluate(() => document.fonts.ready);
    const target = page.locator(shot.selector);
    await target.screenshot({ path: shot.file, animations: "disabled" });
    if (shot.repoCopy) {
      await fs.copyFile(shot.file, shot.repoCopy);
    }
    console.log("wrote", shot.file);
  }

  await browser.close();
  child?.kill("SIGTERM");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
