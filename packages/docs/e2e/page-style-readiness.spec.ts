import { expect, test } from "@playwright/test";

test("keeps documentation hidden until delayed stylesheets have loaded", async ({ page }) => {
  let releaseStyles!: () => void;
  const stylesReady = new Promise<void>((resolve) => {
    releaseStyles = resolve;
  });
  let waiting = false;
  await page.route(/\.css(?:\?|$)/, async (route) => {
    waiting = true;
    await stylesReady;
    await route.continue();
  });
  try {
    await page.goto("./docs/getting-started", { waitUntil: "commit" });
    await expect.poll(() => waiting).toBe(true);
    await expect(page.locator("html")).not.toHaveClass(/pp-ready/);
    // A render-blocking sheet may pause parsing before the preloader body exists.
    await expect(page.locator("#app")).not.toBeVisible();
    releaseStyles();
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await expect(page.locator("#pp-preloader")).not.toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--background").trim(),
      ),
    ).not.toBe("");
  } finally {
    releaseStyles();
  }
});
