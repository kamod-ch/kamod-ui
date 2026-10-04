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
  await page.goto("./docs/formisch/installation");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const showcase = page.locator(".component-example").first();
  const code = showcase.getByRole("tab", { name: "Code", exact: true });
  await code.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  await code.hover();
  await expect(page.locator('[data-application-tooltip] [role="tooltip"]')).toContainText("Code");
  await code.click();
  await expect(code).toHaveAttribute("aria-selected", "true");
  const setup = showcase
    .getByRole("navigation", { name: "Example guides" })
    .getByRole("link", { name: "Setup guide", exact: true });
  await setup.hover();
  await expect(page.getByRole("tooltip")).toHaveText("Setup guide");
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

test("component preview frames include field hints without exposing entered data", async ({
  page,
}) => {
  await page.goto("./docs/formisch/installation");
  const showcase = page.locator(".component-example").first();
  await showcase.scrollIntoViewIfNeeded();
  const frame = showcase.frameLocator("iframe");
  const field = frame.locator("input:not([type=hidden])").first();
  await field.fill("private-input-value");
  await page.mouse.move(0, 0);
  await field.hover();
  const hint = frame.locator('[data-application-tooltip] [role="tooltip"]');
  await expect(hint).toBeVisible();
  await expect(hint).not.toContainText("private-input-value");
  const bounds = await hint.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: innerWidth,
      height: innerHeight,
    };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.width);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.height);
});
