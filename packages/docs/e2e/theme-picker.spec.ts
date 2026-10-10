import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

test("preview system mode stays local and follows the device after closing the picker", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/pagination/installation");
  await page.waitForSelector("html.pp-ready");
  const showcase = page.locator(".blocks-showcase").first();
  const trigger = showcase.getByRole("button", { name: "Preview color theme" });
  const preferences = await page.evaluate(() => [
    localStorage.getItem("theme"),
    localStorage.getItem("theme-preset"),
  ]);
  await page.setViewportSize({ width: 320, height: 900 });
  await trigger.click();
  const picker = page.getByRole("dialog", { name: "Find your Palette", exact: true });
  const box = (await picker.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  await picker.getByRole("button", { name: "Use system color mode" }).click();
  await picker.getByRole("button", { name: "Close color theme picker" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(showcase.locator('button[aria-label="Dark preview"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(showcase.frameLocator("iframe").locator("html")).toHaveClass(/dark/);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(showcase.locator('button[aria-label="Dark preview"]')).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(
    await page.evaluate(() => [
      localStorage.getItem("theme"),
      localStorage.getItem("theme-preset"),
    ]),
  ).toEqual(preferences);
});

for (const width of [320, 768, 1440]) {
  test(`theme picker layout, resources and close at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/pagination/installation");
    await page.waitForSelector("html.pp-ready");
    const trigger = page
      .getByRole("button", { name: "Choose color theme" })
      .filter({ visible: true });
    for (const dark of [false, true]) {
      await page.emulateMedia({ colorScheme: dark ? "dark" : "light" });
      await trigger.click();
      const picker = page.locator(".site-theme-picker-content:visible");
      await expect(picker.getByText("Find your Palette", { exact: true })).toBeVisible();
      await expect(picker.locator(".site-theme-picker-count")).toContainText("8 presets");
      await expect(picker.locator(".site-theme-picker-header")).toHaveCSS(
        "background-image",
        "none",
      );
      await expect(picker.locator(".site-theme-picker-footer")).toHaveCSS(
        "background-color",
        "rgba(0, 0, 0, 0)",
      );
      await expect(
        picker.getByRole("link", { name: "Theming Guide", exact: true }),
      ).toHaveAttribute("href", /\/docs\/theming\/installation$/);
      await expect(picker.getByRole("link", { name: "Customize Tokens" })).toHaveAttribute(
        "href",
        /\/docs\/theming\/token-overrides$/,
      );
      await expect(picker.getByRole("link", { name: "Kamod UI Repository" })).toHaveAttribute(
        "href",
        "https://github.com/kamod-ch/kamod-ui",
      );
      await expect(picker.locator(".site-theme-picker-action")).toHaveCount(5);
      const selected = picker.getByRole("button", {
        name: "Professional (Electronics)",
        exact: true,
      });
      await selected.click();
      await expect(selected).toHaveAttribute("aria-pressed", "true");
      await expect(picker.locator(".site-theme-option-status")).toHaveCount(1);
      await expect(selected.locator(".site-theme-option-status")).toHaveText("· active");
      const spacing = await selected.evaluate((button) => {
        const name = button.querySelector(".site-theme-option-name")!;
        const label = button.querySelector(".site-theme-option-label")!;
        const swatches = button.querySelector(".site-theme-swatches")!;
        return {
          gap: swatches.getBoundingClientRect().left - label.getBoundingClientRect().right,
          truncated: name.scrollWidth > name.clientWidth,
          overflow: button.scrollWidth > button.clientWidth,
        };
      });
      expect(spacing.gap).toBeGreaterThanOrEqual(11.5);
      expect(spacing.truncated).toBe(true);
      expect(spacing.overflow).toBe(false);
      if (width === 1440) {
        await page.mouse.move(0, 0);
        await selected.hover();
        await expect(
          page.getByRole("tooltip").filter({
            hasText:
              "Yellow and black accents with geometric Poppins type: confident and purposeful.",
          }),
        ).toBeVisible();
      }
      const box = (await picker.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(900);
      await picker.getByRole("button", { name: "Close color theme picker" }).click();
      await expect(picker).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
    if (width === 1440) {
      await trigger.click();
      await assertNoBlockingA11yViolations(page, "theme picker", {
        include: [".site-theme-picker-content"],
      });
    }
  });
}

test("system mode stays synchronized after closing, OS changes and reloads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components");
  await page.waitForSelector("html.pp-ready");
  const open = () =>
    page.getByRole("button", { name: "Choose color theme" }).filter({ visible: true }).click();
  const picker = page.locator(".site-theme-picker-content:visible");
  await open();
  await picker.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const system = picker.getByRole("button", { name: "Use system color mode" });
  await expect(system).toHaveAttribute("aria-pressed", "false");
  await system.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(system).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  await picker.getByRole("button", { name: "Close color theme picker" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator('.docs-topbar [data-slot="theme-toggle"]')).toHaveAttribute(
    "data-state",
    "dark",
  );
  await page.reload();
  await open();
  await expect(system).toHaveAttribute("aria-pressed", "true");
  await picker.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(system).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("entry animation is staggered and respects reduced motion", async ({ page }) => {
  await page.goto("/docs/components");
  const open = () =>
    page.getByRole("button", { name: "Choose color theme" }).filter({ visible: true }).click();
  await open();
  const slots = page.locator(".site-theme-picker-content:visible .site-theme-picker-action-slot");
  const delays = await slots.evaluateAll((nodes) =>
    nodes.map((node) => parseFloat(getComputedStyle(node).animationDelay)),
  );
  expect(delays).toHaveLength(5);
  expect(delays[0]).toBeGreaterThan(0);
  expect(delays.every((delay, index) => index === 0 || delay > delays[index - 1])).toBe(true);
  await page.getByRole("button", { name: "Close color theme picker" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open();
  await expect(slots.first()).toHaveCSS("animation-name", "none");
  await expect(slots.first().locator(".site-theme-picker-action-icon")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(slots.first()).toHaveCSS("opacity", "1");
});
