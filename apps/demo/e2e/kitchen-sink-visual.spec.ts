import { expect, test } from "@playwright/test";

test.describe("kitchen sink visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("kitchen-sink").waitFor({ state: "visible" });
  });

  test("full kitchen sink page", async ({ page }) => {
    await expect(page).toHaveScreenshot("kitchen-sink-full.png", {
      fullPage: true,
      caret: "hide",
    });
  });

  test("main content region", async ({ page }) => {
    const main = page.getByTestId("kitchen-sink");
    await expect(main).toHaveScreenshot("kitchen-sink-main.png");
  });

  test("top navigation strip", async ({ page }, testInfo) => {
    // Below md breakpoint the horizontal nav is hidden; capture the full header bar on phone instead.
    if (testInfo.project.name === "iphone") {
      const header = page.locator("header.landing-shadcn-header");
      await expect(header).toHaveScreenshot("kitchen-sink-header-mobile.png");
    } else {
      const nav = page.getByTestId("kitchen-sink-nav");
      await expect(nav).toHaveScreenshot("kitchen-sink-nav.png");
    }
  });

  test("component showcase grid", async ({ page }) => {
    const showcase = page.getByTestId("kitchen-sink-showcase");
    await expect(showcase).toHaveScreenshot("kitchen-sink-showcase.png");
  });

  test("isolated payment column", async ({ page }) => {
    const panel = page.getByTestId("kitchen-sink-payment-panel");
    await expect(panel).toHaveScreenshot("kitchen-sink-payment-panel.png");
  });
});
