import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";
import { forwardTabKey } from "./browser-utils";

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
      await expect(
        panel.getByRole("link", { name: "Kamod UI repository on GitHub" }),
      ).toBeInViewport();
      await expect(panel.getByRole("link", { name: "Sidebar 5", exact: true })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await panel.getByRole("button", { name: "Toggle Signup variants" }).click();
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

test("nested navigation, keyboard focus and theme picker", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const panel = page.getByRole("dialog", { name: "Explore Kamod", exact: true });
  await expect(panel.getByRole("searchbox")).toHaveCount(0);
  await panel.getByRole("button", { name: /Blocks Layout collections/ }).click();
  const collection = panel.getByRole("button", { name: "Toggle Sidebar variants" });
  await collection.click();
  await expect(collection).toHaveAttribute("aria-expanded", "true");
  await expect(panel.getByRole("link", { name: "Sidebar 5", exact: true })).toBeVisible();
  await assertNoBlockingA11yViolations(page, "Nested navigation", {
    include: ".site-navigation-panel",
  });
  const last = panel.getByRole("link", { name: "Kamod UI repository on GitHub" });
  await last.focus();
  await page.keyboard.press(forwardTabKey(browserName));
  await expect(panel.getByRole("button", { name: "Close navigation menu" })).toBeFocused();
  await panel.getByRole("button", { name: "Choose color theme" }).click();
  const themes = panel.getByRole("group", { name: "Site color theme" });
  await themes.getByRole("button", { name: "Professional (Electronics)", exact: true }).click();
  await expect(
    themes.getByRole("button", { name: "Professional (Electronics)", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await panel.getByRole("button", { name: "Choose color theme" }).click();
  await panel.getByRole("link", { name: "Sidebar 5", exact: true }).click();
  await expect(page).toHaveURL(/\/blocks\/sidebar\/sidebar-05\/?$/);
  await expect(panel).toBeHidden();
  await trigger.click();
  await panel.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("data-kamod-scroll-lock", "");
});

test("navbar controls share one row and theme menus fit short screens", async ({ page }) => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [740, 360],
    [979, 800],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("./docs/components");
    const topbar = page.locator(".docs-topbar");
    await expect(topbar.getByRole("combobox")).toHaveCount(0);
    const controls = topbar.locator(".site-icon-button:visible");
    await expect(controls).toHaveCount(3);
    const boxes = await controls.evaluateAll((items) =>
      items.map((item) => {
        const { y, width, height } = item.getBoundingClientRect();
        return { y, width, height };
      }),
    );
    expect(boxes).toHaveLength(3);
    for (const box of boxes) {
      expect(box.width).toBe(40);
      expect(box.height).toBe(40);
      expect(box.y).toBeCloseTo(boxes[0].y, 0);
    }
    if (width < 980) await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page
      .getByRole("button", { name: "Choose color theme" })
      .filter({ visible: true })
      .click();
    const picker = page.locator(".site-theme-picker-content:visible");
    await expect(picker).toBeVisible();
    const bounds = (await picker.boundingBox())!;
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
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
