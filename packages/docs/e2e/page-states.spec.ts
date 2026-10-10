import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

test("unknown addresses offer working recovery links on direct and client navigation", async ({
  page,
}) => {
  await page.goto("./this-page-does-not-exist");
  await expect(page.locator("h1")).toHaveText("This page is off the map.");
  await expect(
    page.getByRole("navigation", { name: "Explore the documentation" }).getByRole("link"),
  ).toHaveCount(4);
  await page.getByRole("link", { name: "Getting Started", exact: true }).click();
  await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
  await page.evaluate(() => {
    history.pushState({}, "", "./another-missing-page");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator("h1")).toHaveText("This page is off the map.");
  const home = page.getByRole("link", { name: "Back to Home", exact: true });
  await home.focus();
  await expect(home).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("home-page")).toBeVisible();
});

test("a pending page module shows the loading view and then yields to its content", async ({
  page,
}) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/GettingStartedContent.*\.(?:js|tsx)/, async (route) => {
    await pending;
    await route.continue();
  });
  try {
    await page.goto("./404");
    await page.getByRole("link", { name: "Getting Started", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Opening Your Next Page…");
    await expect(page.getByLabel("Loading content")).toHaveAttribute("aria-busy", "true");
  } finally {
    release();
  }
  await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
  await expect(page.getByLabel("Loading content")).toHaveCount(0);
});

test("failed page modules provide a reload action", async ({ page }) => {
  await page.route(/GettingStartedContent.*\.(?:js|tsx)/, (route) => route.abort());
  await page.goto("./404");
  await page.getByRole("link", { name: "Getting Started", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Let’s Try That Again.");
  await expect(page.getByRole("button", { name: "Reload Page" })).toBeVisible();
  await page.unroute(/GettingStartedContent.*\.(?:js|tsx)/);
  await page.getByRole("button", { name: "Reload Page" }).click();
  await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
});

for (const width of [320, 768, 1440]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`not-found fits ${width}px in ${colorScheme} mode`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.addInitScript(() => localStorage.setItem("theme-preset", "cursor-warm"));
      await page.goto("./404");
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".not-found-status")).toContainText("Error 404 / Page not found");
      await expect(page.locator(".not-found-art")).toHaveAttribute("aria-hidden", "true");
      await expect(page.locator(".not-found-orbit")).toHaveCSS("animation-name", "none");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.getByRole("link", { name: "Getting Started", exact: true })).toBeVisible();
      if (width === 1440) await assertNoBlockingA11yViolations(page, `404 / ${colorScheme}`);
    });
  }
}
