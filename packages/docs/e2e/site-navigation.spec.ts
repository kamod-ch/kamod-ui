import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const routes = [
  "",
  "docs/components",
  "docs/button/usage",
  "docs/forms",
  "docs/packages",
  "blocks",
  "blocks/sidebar",
  "blocks/sidebar/sidebar-05",
  "blocks/application-shell/application-shell-1",
  "blocks/login/login-01",
  "blocks/signup/signup-01",
];

for (const route of routes) {
  test(`shared navigation is available on /${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto(`./${route}`);
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await expect(trigger).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await trigger.click();
    const panel = page.getByRole("dialog", { name: "Explore Kamod", exact: true });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("button", { name: /Components Documentation/ })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`responsive navigation fits narrow, tablet and landscape screens (${scheme})`, async ({
    page,
  }) => {
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
    for (const [width, height] of [
      [320, 568],
      [479, 800],
      [480, 800],
      [639, 800],
      [640, 800],
      [768, 1024],
      [979, 800],
      [740, 360],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto("./blocks/sidebar/sidebar-05");
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      const panel = page.getByRole("dialog", { name: "Explore Kamod", exact: true });
      await expect(panel).toBeVisible();
      // Geometry is checked after the sheet's entrance animation has settled.
      await expect.poll(async () => (await panel.boundingBox())!.x).toBeGreaterThanOrEqual(0);
      const bounds = await panel.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height);
      expect(await panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
        true,
      );
      await expect(panel.getByRole("link", { name: "GitHub" })).toBeInViewport();
      await expect(panel.getByRole("link", { name: "Sidebar 5", exact: true })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await panel.getByRole("button", { name: /Signup Layout collection/ }).click();
      const last = panel.getByRole("link", { name: "Signup 5", exact: true });
      await last.scrollIntoViewIfNeeded();
      await expect(last).toBeInViewport();
      expect((await last.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await page.keyboard.press("Escape");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });
}

test("search, empty results, keyboard navigation and focus restoration", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const panel = page.getByRole("dialog", { name: "Explore Kamod", exact: true });
  const search = panel.getByRole("searchbox", { name: "Find a page" });
  await search.fill("no-such-page");
  await expect(panel.getByText(/No pages found/)).toBeVisible();
  await search.fill("sidebar-05");
  await expect(panel.getByRole("link", { name: "Sidebar 5", exact: true })).toBeVisible();
  const results = panel.getByRole("button", { name: /Sidebar Layout collection/ });
  await results.click();
  await expect(results).toHaveAttribute("aria-expanded", "false");
  await results.click();
  await expect(panel.getByRole("link", { name: "Sidebar 5", exact: true })).toBeVisible();
  await assertNoBlockingA11yViolations(page, "Navigation search", {
    include: ".site-navigation-panel",
  });
  const last = panel.getByRole("link", { name: "GitHub" });
  await last.focus();
  await page.keyboard.press("Tab");
  await expect(panel.getByRole("button", { name: "Close navigation menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await panel.getByRole("link", { name: "Sidebar 5", exact: true }).click();
  await expect(page).toHaveURL(/\/blocks\/sidebar\/sidebar-05\/?$/);
  await expect(panel).toBeHidden();
  await trigger.click();
  await expect(search).toHaveValue("");
  await panel.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("data-kamod-scroll-lock", "");
});

test("backdrop dismissal and desktop resize release the navigation and scroll lock", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("./docs/components");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  await page.mouse.click(720, 300);
  await expect(page.getByRole("dialog", { name: "Explore Kamod", exact: true })).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 980, height: 900 });
  await expect(trigger).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Explore Kamod", exact: true })).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-kamod-scroll-lock", "");
  await expect(
    page.locator(".docs-topbar-links").getByRole("link", { name: "Components" }),
  ).toBeVisible();
});
