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
  await expect(
    menu.getByRole("group", { name: "Appearance resources" }).getByRole("menuitem"),
  ).toHaveCount(5);
  await expect(
    menu
      .getByRole("menuitemradio", { name: "System" })
      .locator(".site-color-mode-swatches")
      .filter({ visible: true }),
  ).toHaveClass(/dark/);
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
  await expect(
    menu
      .getByRole("menuitemradio", { name: "System" })
      .locator(".site-color-mode-swatches")
      .filter({ visible: true }),
  ).toHaveClass(/dark/);
  await assertNoBlockingA11yViolations(page, "color mode menu", {
    include: [".site-color-mode-menu"],
  });
});

test("keyboard mode selection, Tab and outside dismissal keep focus usable", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./docs/components");
  const trigger = page.locator(".docs-topbar .site-color-mode-trigger");
  await expect(trigger).toBeEnabled();
  // Hydration can enable the trigger while the page preloader still hides it.
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const menu = page.locator(".site-color-mode-menu");
  const system = menu.getByRole("menuitemradio", { name: "System", exact: true });
  await expect(system).toBeFocused();
  await page.keyboard.press("Home");
  await expect(menu.getByRole("menuitem", { name: "How appearance works" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: "Close color mode picker" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitemradio", { name: "Light", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(menu.getByRole("menuitemradio", { name: "Dark", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page.keyboard.press("End");
  await expect(menu.getByRole("menuitem", { name: "Theme Runtime Reference" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(menu).toHaveCount(0);
  expect(await page.evaluate(() => document.activeElement?.closest(".docs-topbar") != null)).toBe(
    true,
  );
  await trigger.click();
  await page.locator("h1").click();
  await expect(menu).toHaveCount(0);
});

test("mode samples follow the palette and the help shortcut opens the appearance guide", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("theme-preset", "ocean"));
  await page.goto("./docs/components");
  const trigger = page.locator(".docs-topbar .site-color-mode-trigger");
  const menu = page.locator(".site-color-mode-menu");
  await trigger.click();
  const samples = menu.locator(".site-color-mode-swatches").filter({ visible: true });
  await expect(samples).toHaveCount(3);
  for (const sample of await samples.all()) {
    await expect(sample).toHaveAttribute("data-theme", "ocean");
    await expect(sample.locator("[data-color-role]")).toHaveCount(4);
  }
  const light = menu.getByRole("menuitemradio", { name: "Light", exact: true });
  const dark = menu.getByRole("menuitemradio", { name: "Dark", exact: true });
  const lightSurface = await light
    .locator('[data-color-role="background"]')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(
    await dark
      .locator('[data-color-role="background"]')
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightSurface);
  await page.keyboard.press("Escape");
  await page.locator(".docs-topbar").getByRole("button", { name: "Choose color theme" }).click();
  const picker = page.getByRole("dialog", { name: "Find your Palette", exact: true });
  await picker.getByRole("button", { name: "Sunset", exact: true }).click();
  await picker.getByRole("button", { name: "Close color theme picker" }).click();
  await trigger.click();
  for (const sample of await samples.all())
    await expect(sample).toHaveAttribute("data-theme", "sunset");
  await expect(menu.getByRole("menuitem", { name: "Compare Color Themes" })).toHaveAttribute(
    "href",
    /\/docs\/theming\/installation#color-theme-presets$/,
  );
  await page.keyboard.press("Home");
  await expect(menu.getByRole("menuitem", { name: "How appearance works" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/docs\/theming\/installation#provider-controls$/);
  await expect(page.locator("#provider-controls")).toBeVisible();
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
    trigger: getComputedStyle(
      document.querySelector(
        '.docs-topbar .site-color-mode-glyph .docs-state-icon-item[data-active="true"]',
      )!,
    ).animationName,
    indicator: getComputedStyle(document.querySelector(".site-color-mode-options")!, "::before")
      .transitionDuration,
    icon: getComputedStyle(
      document.querySelector('.site-color-mode-option[aria-checked="true"] .site-color-mode-icon')!,
    ).animationName,
  }));
  expect(motion.trigger).toBe("site-color-mode-snap");
  expect(motion.indicator.split(",")[0].trim()).toBe("0.7s");
  expect(motion.icon).toBe("site-color-mode-select");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await menu.getByRole("menuitemradio", { name: "Light", exact: true }).click();
  await expect(
    trigger.locator('.site-color-mode-glyph .docs-state-icon-item[data-active="true"]'),
  ).toHaveCSS("animation-name", "none");
  await expect(menu.locator(".site-color-mode-icon").first()).toHaveCSS("animation-name", "none");
  expect(
    await menu
      .locator(".site-color-mode-options")
      .evaluate((element) => getComputedStyle(element, "::before").transitionDuration),
  ).toBe("0s");
});

for (const width of [320, 768, 1024, 1440]) {
  test(`appearance matches palette chrome and compact rows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.addInitScript(() => localStorage.setItem("theme-preset", "ocean"));
    await page.goto("./docs/components");
    const topbar = page.locator(".docs-topbar");
    const appearance = page.locator(".site-color-mode-menu");
    const palette = page.getByRole("dialog", { name: "Find your Palette", exact: true });
    // Compare actual computed chrome, including core dropdown utilities that could override it.
    const measure = (root: HTMLElement) => {
      const styles = (selector: string, properties: string[]) => {
        const node = selector ? root.querySelector(selector)! : root;
        const css = getComputedStyle(node);
        return Object.fromEntries(
          properties.map((property) => [property, css.getPropertyValue(property)]),
        );
      };
      const row = root.querySelector('[aria-pressed="true"], [aria-checked="true"]')!;
      const rowCss = getComputedStyle(row);
      const plate = getComputedStyle(root.querySelector(".site-theme-options")!, "::before");
      return {
        panel: styles("", [
          "width",
          "padding",
          "background-color",
          "border",
          "border-radius",
          "box-shadow",
        ]),
        header: styles(".site-theme-picker-header", ["padding", "gap", "background-color"]),
        heading: styles('[data-slot="popover-title"]', [
          "font-size",
          "font-weight",
          "color",
          "gap",
        ]),
        icon: styles('[data-slot="popover-title"] > svg', ["width", "height", "color"]),
        close: styles(".site-theme-picker-close", [
          "width",
          "height",
          "padding",
          "background-color",
          "border-radius",
        ]),
        separator: styles('.site-theme-picker-separator > [data-slot="separator"]', [
          "height",
          "background-color",
        ]),
        row: Object.fromEntries(
          [
            "height",
            "padding",
            "gap",
            "border-radius",
            "background-color",
            "font-size",
            "font-weight",
            "color",
          ].map((property) => [property, rowCss.getPropertyValue(property)]),
        ),
        plate: Object.fromEntries(
          ["height", "background-color", "box-shadow", "border-radius", "transition"].map(
            (property) => [property, plate.getPropertyValue(property)],
          ),
        ),
        swatch: styles(".site-theme-swatches i", [
          "width",
          "height",
          "border-radius",
          "box-shadow",
        ]),
        footer: styles(".site-theme-picker-footer", ["padding", "background-color"]),
        actions: styles(".site-theme-picker-actions", [
          "gap",
          "padding",
          "align-items",
          "justify-content",
        ]),
        action: styles(".site-theme-picker-action", [
          "width",
          "height",
          "padding",
          "background-color",
          "border-radius",
        ]),
      };
    };
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await topbar.getByRole("button", { name: "Choose color theme" }).click();
      await expect(palette).toBeVisible();
      await palette.getByRole("button", { name: "Ocean", exact: true }).click();
      await page.mouse.move(0, 0);
      const reference = await palette.evaluate(measure);
      await palette.getByRole("button", { name: "Close color theme picker" }).click();
      await topbar.getByRole("button", { name: "Choose color mode" }).click();
      await expect(appearance).toBeVisible();
      await page.mouse.move(0, 0);
      expect(await appearance.evaluate(measure)).toEqual(reference);
      await expect(appearance.locator(".site-theme-option-status")).toHaveText("· active");
      await expect(appearance.locator(".site-color-mode-option[aria-describedby]")).toHaveCount(0);
      await expect(appearance.locator(".site-theme-picker-action")).toHaveCount(5);
      const alignment = await appearance.evaluate((root) => {
        const heading = root.querySelector(".site-theme-picker-heading")!;
        const center = (node: Element) => {
          const rect = node.getBoundingClientRect();
          return rect.top + rect.height / 2;
        };
        const samples = [...root.querySelectorAll(".site-theme-swatches i")].filter(
          (node) => node.getBoundingClientRect().width > 0,
        );
        return {
          centers: [...heading.children].map(center),
          rowOverflow: [...root.querySelectorAll(".site-color-mode-option")].some(
            (row) => row.scrollWidth > row.clientWidth,
          ),
          colors: new Set(samples.map((node) => getComputedStyle(node).backgroundColor)).size,
          caption: getComputedStyle(
            root.querySelector(".site-color-mode-caption > span:last-child")!,
          ).textOverflow,
        };
      });
      expect(Math.max(...alignment.centers) - Math.min(...alignment.centers)).toBeLessThan(1);
      expect(alignment.rowOverflow).toBe(false);
      expect(alignment.colors).toBeGreaterThanOrEqual(8);
      expect(alignment.caption).toBe("ellipsis");
      const bounds = (await appearance.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(800);
      await appearance.getByRole("menuitem", { name: "Close color mode picker" }).click();
      await expect(appearance).toHaveCount(0);
      await expect(topbar.getByRole("button", { name: "Choose color mode" })).toBeFocused();
    }
  });
}
