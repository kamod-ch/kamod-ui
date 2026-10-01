import { expect, test } from "@playwright/test";
import { PLACEHOLDER_BLOCK_CATEGORIES } from "../src/blocks/block-nav-config";
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

test("sidebar project links stay reachable while the directory scrolls", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 980, height: 480 });
  await page.goto("./docs/components");
  const sidebar = page.locator("aside.docs-sidebar");
  const resources = sidebar.getByRole("group", { name: "Contribute to Kamod UI" });
  const initial = await resources.boundingBox();
  const lastGroup = sidebar.getByRole("button", { name: /^Packages Documentation/ });
  await lastGroup.focus();
  await expect(lastGroup).toBeInViewport();
  expect(
    await sidebar.locator(".docs-sidebar-scroll").evaluate((node) => node.scrollTop),
  ).toBeGreaterThan(0);
  expect((await resources.boundingBox())!.y).toBeCloseTo(initial!.y, 0);
  await page.keyboard.press(forwardTabKey(browserName));
  const repository = resources.getByRole("link", { name: /^Kamod UI on GitHub/ });
  await expect(repository).toBeFocused();
  await expect(repository).toHaveAttribute("href", "https://github.com/kamod-ch/kamod-ui");
  await expect(resources.getByRole("link", { name: /^Report a bug/ })).toHaveAttribute(
    "href",
    "https://github.com/kamod-ch/kamod-ui/issues/new/choose",
  );
  await expect(
    resources.getByRole("link", { name: /^Read the contribution guide/ }),
  ).toHaveAttribute("href", "https://github.com/kamod-ch/kamod-ui/blob/main/CONTRIBUTING.md");
  for (const link of await resources.getByRole("link").all()) {
    await expect(link).toBeInViewport();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await assertNoBlockingA11yViolations(page, "Sidebar project links", {
    include: "aside.docs-sidebar",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(resources).toBeHidden();
});

test("desktop sidebars share the mobile directory and current destination", async ({ page }) => {
  for (const [route, group, label] of [
    ["blocks", "Blocks", "Blocks overview"],
    ["blocks/sidebar", "Blocks", "Sidebar"],
    ["docs/components", "Components", "Components overview"],
    ["docs/button/usage", "Components", "Button"],
  ]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`./${route}`);
    const desktop = page.locator("aside.docs-sidebar .site-navigation-directory");
    await expect(desktop.getByRole("button", { name: new RegExp(`^${group} `) })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const selected = desktop.getByRole("link", { name: label, exact: true });
    await expect(selected).toHaveAttribute("aria-current", "page");
    const links = await desktop
      .locator("a")
      .evaluateAll((items) => items.map((a) => a.getAttribute("href")));
    const desktopStyle = await selected.evaluate((a) => {
      const style = getComputedStyle(a);
      return [style.backgroundImage, style.color, style.fontSize, style.padding];
    });
    await expect(desktop.getByRole("button", { name: /Toggle .* variants/ })).toHaveCount(0);
    await assertNoBlockingA11yViolations(page, "Shared sidebar", { include: "aside.docs-sidebar" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const mobile = page.locator(".site-navigation-panel .site-navigation-directory");
    expect(
      await mobile.locator("a").evaluateAll((items) => items.map((a) => a.getAttribute("href"))),
    ).toEqual(links);
    const mobileSelected = mobile.getByRole("link", { name: label, exact: true });
    await expect(mobileSelected).toHaveAttribute("aria-current", "page");
    if (group === "Blocks") {
      for (const directory of [desktop, mobile]) {
        const planned = directory.locator("a[data-block-placeholder]");
        await expect(planned.locator(".site-navigation-variant-count")).toHaveCount(0);
        await expect(planned.locator(".site-navigation-status")).toHaveText(
          PLACEHOLDER_BLOCK_CATEGORIES.map(() => "Planned"),
        );
        await expect(planned.locator(".site-navigation-status svg")).toHaveCount(
          PLACEHOLDER_BLOCK_CATEGORIES.length,
        );
        for (const [name, count] of [
          ["Sidebar", 16],
          ["Application Shell", 1],
          ["Login", 5],
          ["Signup", 5],
        ] as const) {
          const link = directory.getByRole("link", { name, exact: true, includeHidden: true });
          await expect(link.locator(".site-navigation-variant-count")).toHaveText(String(count));
          await expect(link).toHaveAccessibleDescription(
            `${count} ${count === 1 ? "variant" : "variants"}`,
          );
        }
      }
      const planned = mobile.locator("a[data-block-placeholder]");
      await expect(planned).toHaveCount(PLACEHOLDER_BLOCK_CATEGORIES.length);
      const contact = mobile.getByRole("link", { name: "Contact", exact: true });
      await contact.scrollIntoViewIfNeeded();
      await expect(contact).toBeInViewport();
      await expect(contact).toHaveAccessibleDescription(
        "0 variants · Planned collection — page not available yet",
      );
    }
    if (group === "Components") {
      for (const directory of [desktop, mobile]) {
        // The desktop directory is hidden at this point; inspect its DOM by route.
        const updated = directory.locator('a[href$="/docs/spinner/installation"]');
        await expect(updated.locator(".site-navigation-status")).toHaveText("Updated");
        await expect(updated.locator(".site-navigation-status svg")).toHaveCount(1);
        await expect(updated).toHaveAccessibleDescription("Updated");
        if (directory === mobile) await expect(updated).toHaveAccessibleName("Spinner");
        await expect(
          directory
            .getByRole("link", {
              name: "Button",
              exact: true,
              includeHidden: true,
            })
            .locator(".site-navigation-status"),
        ).toHaveCount(0);
      }
    }
    expect(
      await mobileSelected.evaluate((a) => {
        const style = getComputedStyle(a);
        return [style.backgroundImage, style.color, style.fontSize, style.padding];
      }),
    ).toEqual(desktopStyle);
  }
});

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
      [740, 320],
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
      await expect(panel.getByRole("link", { name: "Sidebar", exact: true })).toHaveAttribute(
        "aria-current",
        "location",
      );
      await expect(panel.getByRole("button", { name: /Toggle .* variants/ })).toHaveCount(0);
      const footer = panel.locator(".site-navigation-footer");
      for (const control of await footer.locator("a, button").all()) {
        await expect(control).toBeInViewport();
      }
      expect((await panel.locator(".site-navigation-body").boundingBox())!.height).toBeGreaterThan(
        120,
      );

      const last = panel.getByRole("link", { name: "Signup", exact: true });
      await last.scrollIntoViewIfNeeded();
      await expect(last).toBeInViewport();
      expect((await last.boundingBox())!.height).toBeGreaterThanOrEqual(36);
      await page.keyboard.press("Escape");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });
}

test("collection navigation, keyboard focus and theme picker", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const panel = page.getByRole("dialog", { name: "Explore Kamod", exact: true });
  await expect(panel.getByRole("searchbox")).toHaveCount(0);
  await panel.getByRole("button", { name: /Blocks Layout collections/ }).click();
  await expect(panel.getByRole("button", { name: /Toggle .* variants/ })).toHaveCount(0);
  await expect(panel.getByRole("link", { name: "Sidebar", exact: true })).toBeVisible();
  await assertNoBlockingA11yViolations(page, "Collection navigation", {
    include: ".site-navigation-panel",
  });
  const last = panel.getByRole("button", { name: "Choose color theme" });
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
  await panel.getByRole("link", { name: "Sidebar", exact: true }).click();
  await expect(page).toHaveURL(/\/blocks\/sidebar\/?$/);
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
    [980, 800],
    [1260, 900],
    [1440, 900],
    [1920, 1080],
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
    for (const [index, box] of boxes.entries()) {
      if (width >= 980 && index === 0) expect(box.width).toBeGreaterThan(36);
      else expect(box.width).toBe(width < 980 ? 40 : 36);
      expect(box.height).toBe(width < 980 ? 40 : 36);
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
    await picker.getByRole("button", { name: "Professional (Electronics)", exact: true }).click();
    if (width >= 980) {
      await expect(topbar.getByRole("button", { name: "Choose color theme" })).toContainText(
        "Professional (Electronics)",
      );
      const leading = (await topbar.locator(".docs-topbar-links").boundingBox())!;
      const actions = (await topbar.locator(".docs-topbar-actions").boundingBox())!;
      expect(leading.x + leading.width).toBeLessThanOrEqual(actions.x);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width >= 980) {
      await page.goto("./blocks/application-shell/application-shell-1");
      const navbar = page.locator(".docs-topbar-inner");
      const layout = page.locator(".docs-layout");
      await expect(navbar).toHaveCSS(
        "max-width",
        await layout.evaluate((e) => getComputedStyle(e).maxWidth),
      );
      await expect(navbar).toHaveCSS(
        "padding-left",
        await layout.evaluate((e) => getComputedStyle(e).paddingLeft),
      );
      await expect(navbar).toHaveCSS(
        "padding-right",
        await layout.evaluate((e) => getComputedStyle(e).paddingRight),
      );
    }
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

test("desktop navigation fills its column and shares the navbar content edge", async ({ page }) => {
  for (const route of ["blocks", "blocks/sidebar", "blocks/getting-started", "docs/components"]) {
    await page.goto(`./${route}`);
    for (const width of [980, 1260, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      const geometry = await page.evaluate(() => {
        const rect = (selector: string) =>
          document.querySelector(selector)!.getBoundingClientRect();
        const sidebar = document.querySelector("aside.docs-sidebar")!;
        const nav = rect("aside.docs-sidebar .site-navigation-directory");
        return {
          inset: nav.left - rect(".docs-topbar-brand").left,
          padding: parseFloat(getComputedStyle(sidebar).paddingLeft),
          width: sidebar.getBoundingClientRect().width,
          rowWidth: rect("aside.docs-sidebar .site-navigation-group-trigger").width,
          navWidth: nav.width,
          fits: document.documentElement.scrollWidth <= innerWidth,
        };
      });
      expect(geometry.inset, `${route} at ${width}px`).toBeCloseTo(geometry.padding, 0);
      expect(geometry.width).toBeGreaterThanOrEqual(256);
      expect(geometry.rowWidth).toBeCloseTo(geometry.navWidth, 0);
      expect(geometry.fits).toBe(true);
    }
  }
});
