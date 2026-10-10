import { expect, test } from "@playwright/test";

for (const route of [
  "docs/components",
  "blocks/sidebar/sidebar-01",
  "docs/formisch/installation",
]) {
  test(`${route}: shared hints support hover, focus and dismissal`, async ({ page }) => {
    await page.goto(`./${route}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const control = page.locator('button[aria-label="Toggle color scheme"]:visible').first();
    const hint = page.locator('[data-application-tooltip] [role="tooltip"]');
    await control.hover();
    await expect(hint).toHaveText("Toggle color scheme");
    await hint.hover();
    await expect(hint).toBeVisible();
    const bounds = await hint.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await page.keyboard.press("Escape");
    await expect(hint).toHaveCount(0);
    await page.keyboard.press("Tab");
    await control.focus();
    await expect(hint).toBeVisible();
    await expect(control).toHaveAttribute("aria-describedby", (await hint.getAttribute("id"))!);
    await control.click();
    await expect(hint).toHaveCount(0);
    await expect(control).not.toHaveAttribute("aria-describedby");
  });
}

test("showcase tabs still activate and authored guide tooltips are not duplicated", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("./docs/formisch/installation");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const showcase = page.locator(".component-example").first();
  const code = showcase.getByRole("tab", { name: "Code", exact: true });
  await code.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  // Exercise the icon-only layout explicitly; desktop tabs now have visible labels.
  await expect(code.locator(".blocks-showcase-control-label")).toBeHidden();
  await code.hover();
  await expect(page.locator('[data-application-tooltip] [role="tooltip"]')).toHaveText("Code");
  await expect(code).not.toHaveAttribute("title");
  await code.click();
  await expect(code).toHaveAttribute("aria-selected", "true");
  const setup = showcase
    .getByRole("navigation", { name: "Example guides" })
    .getByRole("link", { name: "Setup Guide", exact: true });
  await setup.hover();
  await expect(page.getByRole("tooltip")).toHaveText("Setup Guide");
  await expect(page.locator("[data-application-tooltip]")).toHaveCount(0);
});

test("touch navigation opens without an automatic hint covering the menu", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto("./docs/components");
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.tap();
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible();
    await expect(page.locator("[data-application-tooltip]")).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("component preview fields do not repeat their visible labels", async ({ page }) => {
  await page.goto("./docs/formisch/installation");
  const showcase = page.locator(".component-example").first();
  await showcase.scrollIntoViewIfNeeded();
  const frame = showcase.frameLocator("iframe");
  const field = frame.locator("input:not([type=hidden])").first();
  await field.fill("private-input-value");
  await page.mouse.move(0, 0);
  await field.hover();
  const hint = frame.locator('[data-application-tooltip] [role="tooltip"]');
  await page.waitForTimeout(550);
  await expect(hint).toHaveCount(0);
  await expect(field).toHaveValue("private-input-value");
});

test("text controls stay quiet while responsive icon-only controls retain hints", async ({
  page,
}) => {
  await page.goto("./blocks/application-shell/application-shell-1");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const showcase = page.locator(".blocks-showcase").first();
  const code = showcase.getByRole("tab", { name: "Code", exact: true });
  const hint = page.locator('[data-application-tooltip] [role="tooltip"]');
  await code.hover();
  await page.waitForTimeout(550);
  await expect(hint).toHaveCount(0);
  await code.click();
  const copy = showcase.getByRole("button", { name: "Copy code", exact: true });
  await copy.hover();
  await page.waitForTimeout(550);
  await expect(hint).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 850 });
  await page.mouse.move(0, 0);
  await code.hover();
  await expect(hint).toHaveText("Code");
  await page.keyboard.press("Escape");
  await expect(hint).toHaveCount(0);
});
