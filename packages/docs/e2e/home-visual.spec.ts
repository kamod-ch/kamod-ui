import { expect, type Page, test } from "@playwright/test";

/**
 * Landing page visual baselines for before/after redesigns.
 * Refresh: `pnpm --filter @kamod-ch/ui-docs exec playwright test e2e/home-visual.spec.ts --update-snapshots`
 */
test.describe.configure({ mode: "serial" });
test.describe.configure({ timeout: 120_000 });

async function gotoStableLanding(
  page: Page,
  scheme: "light" | "dark",
  viewport: { width: number; height: number } = { width: 1440, height: 900 },
) {
  await page.route(/https:\/\/matomo\.kamod\.ch\/matomo\.php(?:\?|$)/, (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
    }),
  );
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
  await page.addInitScript((value) => {
    localStorage.setItem("theme", value);
    localStorage.setItem("theme-preset", "ocean");
  }, scheme);
  await page.setViewportSize(viewport);
  await page.goto("./");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await expect(page.getByTestId("home-page")).toBeVisible();
  await expect(page.getByTestId("kitchen-sink-showcase")).toBeVisible();
  await page.locator(".home-workspace").scrollIntoViewIfNeeded();
  await expect(
    page.locator(".home-workspace").frameLocator("iframe").getByLabel("Workspace name"),
  ).toBeVisible();
  await page.locator(".home-shell-showcase").scrollIntoViewIfNeeded();
  await expect(page.locator(".home-shell-showcase iframe")).toBeVisible({ timeout: 60_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

test.describe("landing visual regression", () => {
  test("full page light desktop", async ({ page }) => {
    await gotoStableLanding(page, "light");
    await expect(page).toHaveScreenshot("home-landing-full-light-desktop.png", {
      fullPage: true,
      caret: "hide",
      maxDiffPixels: 15_000,
    });
  });

  test("full page dark desktop", async ({ page }) => {
    await gotoStableLanding(page, "dark");
    await expect(page).toHaveScreenshot("home-landing-full-dark-desktop.png", {
      fullPage: true,
      caret: "hide",
      maxDiffPixels: 15_000,
    });
  });

  test("full page light mobile", async ({ page }) => {
    await gotoStableLanding(page, "light", { width: 390, height: 844 });
    await expect(page).toHaveScreenshot("home-landing-full-light-mobile.png", {
      fullPage: true,
      caret: "hide",
      maxDiffPixels: 15_000,
    });
  });

  test("hero region desktop light", async ({ page }) => {
    await gotoStableLanding(page, "light");
    await expect(page.locator(".home-hero")).toHaveScreenshot(
      "home-landing-hero-light-desktop.png",
      {
        maxDiffPixels: 4_000,
      },
    );
  });
});
