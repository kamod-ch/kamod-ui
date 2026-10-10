import { expect, type Page, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

async function openGuide(page: Page, name = "cn") {
  await page.goto("./docs/cn/installation");
  const term = page.locator(`[data-inline-code-help="${name}"]`).first();
  await term.scrollIntoViewIfNeeded();
  // Let the preceding lazy preview settle before testing pointer placement.
  await page.waitForLoadState("networkidle");
  return term;
}

test("inline explanations keep keyboard flow, working links and source text intact", async ({
  page,
}) => {
  const term = await openGuide(page);
  const help = page.getByRole("dialog", { name: "cn explained" });
  await term.hover();
  await expect(help).toContainText("Combine Class Names.");
  await expect(
    page.locator("pre [data-inline-code-help], .docs-code-wrap [data-inline-code-help]"),
  ).toHaveCount(0);
  await expect(term).toHaveText("cn");
  await assertNoBlockingA11yViolations(page, "Inline code explanation", {
    include: "[data-application-tooltip]",
  });
  await page.keyboard.press("Escape");
  await term.focus();
  await expect(help).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(help.getByRole("link", { name: "@kamod-ch/ui/utils" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(help.getByRole("link", { name: "Explore cn" })).toBeFocused();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("[data-application-tooltip]")),
  ).toBe(false);
  await term.focus();
  await expect(help).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(term).toBeFocused();
  await expect(help).toBeHidden();
  // Linked identifiers retain normal navigation; focusing reopens their explanation.
  await page.keyboard.press("Tab");
  await term.focus();
  await expect(help).toBeVisible();
  await help.getByRole("link", { name: "Explore cn" }).click();
  await expect(help).toBeHidden();
  await expect(page).toHaveURL(/\/docs\/cn\/installation$/);
});

test("inline explanations open on tap, fit a narrow screen and dismiss outside", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 812 },
    hasTouch: true,
  });
  const page = await context.newPage();
  const term = await openGuide(page, "class");
  await term.tap();
  const help = page.getByRole("dialog", { name: "class explained" });
  await expect(help).toBeVisible();
  const bounds = (await help.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(812);
  const arrow = (await help.locator('[data-slot="tooltip-arrow"]').boundingBox())!;
  const trigger = (await term.boundingBox())!;
  expect(Math.abs(arrow.x + arrow.width / 2 - trigger.x - trigger.width / 2)).toBeLessThan(4);
  await page.locator(".docs-topbar").tap({ position: { x: 3, y: 3 } });
  await expect(help).toBeHidden();
  await context.close();
});
