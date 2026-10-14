import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

test("navbar mode choices persist, follow the device and leave the preview independent", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const preview = page.frameLocator(".home-workspace iframe");
  await expect(preview.getByLabel("Workspace name")).toBeVisible();
  const previewIsDark = await preview
    .locator("html")
    .evaluate((root) => root.classList.contains("dark"));
  const trigger = page.locator(".docs-topbar").getByRole("button", { name: "Choose color mode" });
  await trigger.click();
  const menu = page.getByRole("menu", { name: "Choose color mode" });
  for (const mode of ["Dark", "Light", "System"]) {
    await menu.getByRole("menuitemradio", { name: mode, exact: true }).click();
    await expect(menu.getByRole("menuitemradio", { name: mode, exact: true })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute("data-color-mode", mode.toLowerCase());
  }
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(menu.locator(".site-color-mode-footer")).toContainText("Device is using dark.");
  expect(await preview.locator("html").evaluate((root) => root.classList.contains("dark"))).toBe(
    previewIsDark,
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.reload();
  await trigger.click();
  await expect(menu.getByRole("menuitemradio", { name: "System", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await menu.getByRole("menuitemradio", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await assertNoBlockingA11yViolations(page, "color mode menu", {
    include: [".site-color-mode-menu"],
  });
});

test("keyboard mode selection, Tab and outside dismissal keep focus usable", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./docs/components");
  const trigger = page.locator(".docs-topbar .site-color-mode-trigger");
  await expect(trigger).toBeEnabled();
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const menu = page.locator(".site-color-mode-menu");
  const system = menu.getByRole("menuitemradio", { name: "System", exact: true });
  await expect(system).toBeFocused();
  await page.keyboard.press("Home");
  await expect(menu.getByRole("menuitemradio", { name: "Light", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(menu.getByRole("menuitemradio", { name: "Dark", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page.keyboard.press("End");
  await expect(system).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(menu).toHaveCount(0);
  expect(await page.evaluate(() => document.activeElement?.closest(".docs-topbar") != null)).toBe(
    true,
  );
  await trigger.click();
  await page.locator("h1").click();
  await expect(menu).toHaveCount(0);
});

for (const width of [320, 768]) {
  test(`sidebar shares the menu and Escape closes only the innermost layer at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("./docs/components");
    const open = page.getByRole("button", { name: "Open navigation menu", exact: true });
    await open.click();
    const sidebar = page.getByRole("dialog", { name: "Explore Kamod", exact: true });
    const trigger = sidebar.getByRole("button", { name: "Choose color mode" });
    await trigger.click();
    const menu = page.locator(".site-color-mode-menu");
    await menu.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(sidebar).toBeVisible();
    await expect(menu).toBeVisible();
    const bounds = (await menu.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(800);
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(sidebar).toBeVisible();
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(sidebar).toHaveCount(0);
    await expect(open).toBeFocused();
    await expect(page.locator(".docs-topbar .site-color-mode-trigger")).toHaveAttribute(
      "data-color-mode",
      "dark",
    );
  });
}

test("mode transitions animate briefly and stop immediately with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await page.goto("./");
  const trigger = page.locator(".docs-topbar .site-color-mode-trigger");
  await trigger.click();
  const menu = page.locator(".site-color-mode-menu");
  await menu.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
  const motion = await page.evaluate(() => ({
    trigger: getComputedStyle(document.querySelector(".docs-topbar .site-color-mode-glyph")!)
      .animationName,
    indicator: getComputedStyle(document.querySelector(".site-color-mode-options")!, "::before")
      .transitionDuration,
    icon: getComputedStyle(
      document.querySelector('.site-color-mode-option[aria-checked="true"] .site-color-mode-icon')!,
    ).animationName,
  }));
  expect(motion.trigger).toBe("site-color-mode-snap");
  expect(motion.indicator).toBe("0.38s");
  expect(motion.icon).toBe("site-color-mode-select");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await menu.getByRole("menuitemradio", { name: "Light", exact: true }).click();
  await expect(trigger.locator(".site-color-mode-glyph")).toHaveCSS("animation-name", "none");
  await expect(menu.locator(".site-color-mode-icon").first()).toHaveCSS("animation-name", "none");
  expect(
    await menu
      .locator(".site-color-mode-options")
      .evaluate((element) => getComputedStyle(element, "::before").transitionDuration),
  ).toBe("0s");
});
