import { expect, test } from "@playwright/test";
import { PLACEHOLDER_BLOCK_CATEGORIES } from "../src/blocks/block-nav-config";
import { docsNavigation } from "../src/docs/generated-navigation";
import { linkTitle } from "../src/link-title";
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
  await page.setViewportSize({ width: 940, height: 480 });
  await page.goto("./docs/components");
  const sidebar = page.locator("aside.docs-sidebar");
  const resources = sidebar.getByRole("navigation", { name: "Kamod repositories" });
  const initial = await resources.boundingBox();
  const lastGroup = sidebar.getByRole("button", { name: /^Packages Tools & Integrations/ });
  await lastGroup.focus();
  await expect(lastGroup).toBeInViewport();
  expect(
    await sidebar.locator(".docs-sidebar-scroll").evaluate((node) => node.scrollTop),
  ).toBeGreaterThan(0);
  expect((await resources.boundingBox())!.y).toBeCloseTo(initial!.y, 0);
  const ecosystem = sidebar.getByRole("navigation", { name: "Kamod repositories" });
  const trigger = ecosystem.getByRole("button", { name: /Kamod Ecosystem/ });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(ecosystem.getByRole("link")).toHaveCount(0);
  // Group help has its own Tab-reachable links; dismiss it before following the directory order.
  await page.keyboard.press("Escape");
  await page.keyboard.press(forwardTabKey(browserName));
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(ecosystem.getByRole("link")).toHaveCount(9);
  await expect.poll(async () => (await resources.boundingBox())!.y).toBeLessThan(initial!.y - 50);
  const opened = (await resources.boundingBox())!;
  expect(opened.y + opened.height).toBeCloseTo(initial!.y + initial!.height, 0);
  for (const link of await ecosystem.getByRole("link").all()) {
    await page.keyboard.press(forwardTabKey(browserName));
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(sidebar.locator(".docs-sidebar-resource-actions")).toHaveCount(0);
  await expect(resources.locator("li code")).toHaveCount(8);
  await expect(resources.locator("li code").first()).toHaveText("@kamod-ch/icons");
  for (const row of await resources.locator(".docs-sidebar-repository").all()) {
    const content = (await row.locator(".docs-sidebar-repository-content").boundingBox())!;
    const arrow = (await row.locator(":scope > svg").last().boundingBox())!;
    expect(arrow.x - content.x - content.width).toBeGreaterThanOrEqual(8);
    expect(await row.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  }
  const heading = resources.locator(".docs-sidebar-ecosystem-heading");
  const title = (await heading.locator("strong").boundingBox())!;
  const action = (await heading.locator(".docs-sidebar-ecosystem-toggle").boundingBox())!;
  expect(Math.abs(title.y + title.height / 2 - action.y - action.height / 2)).toBeLessThan(1);
  await assertNoBlockingA11yViolations(page, "Sidebar project links", {
    include: "aside.docs-sidebar",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(ecosystem.getByRole("link")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(resources).toBeHidden();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const mobile = page
    .locator(".site-navigation-panel")
    .getByRole("navigation", { name: "Kamod repositories" });
  const mobileTrigger = mobile.getByRole("button", { name: /Kamod Ecosystem/ });
  await expect(mobileTrigger).toHaveAttribute("aria-expanded", "false");
  const closedMobile = (await mobile.boundingBox())!;
  await mobileTrigger.click();
  await expect(mobile.getByRole("link")).toHaveCount(9);
  await expect.poll(async () => (await mobile.boundingBox())!.y).toBeLessThan(closedMobile.y - 50);
  const openMobile = (await mobile.boundingBox())!;
  expect(openMobile.y + openMobile.height).toBeCloseTo(closedMobile.y + closedMobile.height, 0);
  await mobile.getByRole("link", { name: /^All Kamod repositories/ }).focus();
  await expect(mobile.getByRole("link", { name: /^All Kamod repositories/ })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("desktop sidebars share the mobile directory and current destination", async ({ page }) => {
  for (const [route, group, label] of [
    ["blocks", "Blocks", "Blocks Overview"],
    ["blocks/sidebar", "Blocks", "Sidebar"],
    ["docs/components", "Components", "Components Overview"],
    ["docs/button/usage", "Components", "Button"],
  ]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`./${route}`);
    const desktop = page.locator("aside.docs-sidebar .site-navigation-directory");
    await expect(desktop.getByRole("button", { name: new RegExp(`^${group} `) })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const selected = desktop.getByRole("link", { name: linkTitle(label), exact: true });
    await expect(selected).toHaveAttribute("aria-current", "page");
    // Desktop and mobile remember expansion independently; compare the current group.
    const groupLinks = `.site-navigation-group:has([data-navigation-group="${group.toLowerCase()}"]) a`;
    const links = await desktop
      .locator(groupLinks)
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
      await mobile
        .locator(groupLinks)
        .evaluateAll((items) => items.map((a) => a.getAttribute("href"))),
    ).toEqual(links);
    const mobileSelected = mobile.getByRole("link", { name: linkTitle(label), exact: true });
    await expect(mobileSelected).toHaveAttribute("aria-current", "page");
    for (const directory of [desktop, mobile]) {
      const introductions = directory.locator(".site-navigation-link-overview");
      await expect(
        introductions.locator(".site-navigation-status, .site-navigation-variant-count"),
      ).toHaveCount(0);
    }
    if (group === "Blocks") {
      for (const directory of [desktop, mobile]) {
        const planned = directory.locator("a[data-block-placeholder]");
        await expect(planned.locator(".site-navigation-variant-count")).toHaveCount(0);
        await expect(planned.locator(".site-navigation-status")).toHaveText(
          PLACEHOLDER_BLOCK_CATEGORIES.map(() => "Planned"),
        );
        await expect(planned.locator(".site-navigation-status > svg")).toHaveCount(
          PLACEHOLDER_BLOCK_CATEGORIES.length,
        );
        for (const [name, status] of [
          ["Sidebar", "Updated"],
          ["Application Shell", "Fresh"],
          ["Login", ""],
          ["Signup", ""],
        ] as const) {
          const link = directory.getByRole("link", { name, exact: true, includeHidden: true });
          // Registry counts are checked in navigation-data.test; verify their accessible wording here.
          const count = Number(await link.locator(".site-navigation-variant-count").textContent());
          expect(count).toBeGreaterThan(0);
          if (status) await expect(link.locator(".site-navigation-status")).toHaveText(status);
          else await expect(link.locator(".site-navigation-status")).toHaveCount(0);
          await expect(link.locator(".site-navigation-status > svg")).toHaveCount(status ? 1 : 0);
          await expect(link.locator(".site-navigation-variant-count")).toHaveText(String(count));
          await expect(link).toHaveAccessibleDescription(
            `${count} ${count === 1 ? "variant" : "variants"}${status ? ` · ${status}` : ""}${status === "Fresh" ? " — newly added to the library" : ""}`,
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
        const updated = directory.locator('a[href$="/docs/alert/installation"]');
        await expect(updated.locator(".site-navigation-status")).toHaveText("Updated");
        await expect(updated.locator(".site-navigation-status > svg")).toHaveCount(1);
        const alert = docsNavigation.find((doc) => doc.slug === "alert")!;
        await expect(updated).toHaveAccessibleDescription(
          `${alert.variantCount} variants · Updated`,
        );
        if (directory === mobile) await expect(updated).toHaveAccessibleName("Alert");
        // Existing upstream statuses survive audits of this contributor's changes.
        for (const slug of [
          "popover",
          "tooltip",
          "toggle",
          "toggle-group",
          "tree",
          "typography",
          "textarea",
          "spinner",
          "switch",
          "tabs",
        ]) {
          await expect(
            directory.locator(`a[href$="/docs/${slug}/installation"] .site-navigation-status`),
          ).toHaveText("Updated");
        }
        await expect(
          directory
            .getByRole("link", {
              name: "Button",
              exact: true,
              includeHidden: true,
            })
            .locator(".site-navigation-status"),
        ).toHaveCount(0);
        const added = directory.locator('a[href$="/docs/code/installation"]');
        await expect(added.locator(".site-navigation-status")).toHaveText("Fresh");
        await expect(added.locator(".site-navigation-status > svg")).toHaveCount(1);
        if (directory === mobile) {
          await expect(added).toHaveAccessibleName("Code");
          await added.focus();
          const code = docsNavigation.find((doc) => doc.slug === "code")!;
          // Tooltips may temporarily remove title; status remains available while focused.
          await expect(added).toHaveAccessibleDescription(
            `${code.variantCount} variants · Fresh — newly added to the library`,
          );
        }
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
    await expect(
      panel.getByRole("button", { name: /Components UI Building Blocks/ }),
    ).toBeVisible();
    const gettingStarted = panel.getByRole("link", { name: "Getting Started Guide", exact: true });
    await expect(gettingStarted).toBeVisible();
    await expect(gettingStarted).toHaveAttribute("href", /\/docs\/getting-started$/);
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
      [939, 800],
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
      await expect(panel.locator(".site-navigation-footer")).toHaveCount(0);
      await expect(panel.getByRole("link", { name: "Sidebar", exact: true })).toHaveAttribute(
        "aria-current",
        "location",
      );
      await expect(panel.getByRole("button", { name: /Toggle .* variants/ })).toHaveCount(0);
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
  await expect(
    panel.locator(".site-navigation-brand").getByRole("img", { name: "Kamod UI" }),
  ).toBeVisible();
  await expect(
    panel.locator(".navigation-header").getByRole("heading", { name: "Getting Started" }),
  ).toBeVisible();
  await expect(panel.locator(".navigation-header")).toContainText("· Guide");
  await expect(panel.locator(".navigation-header a")).toHaveAttribute(
    "href",
    /\/docs\/getting-started$/,
  );
  await expect(panel.locator(".site-navigation-head a")).toHaveCount(0);
  await expect(panel.locator(".site-navigation-group").first()).toHaveAttribute(
    "data-kind",
    "components",
  );
  await expect(panel.locator(".site-navigation-group")).toHaveCount(4);
  const brand = (await panel.locator(".site-navigation-brand .kamod-ui-logo").boundingBox())!;
  const heading = (await panel.getByRole("heading", { name: "Explore Kamod" }).boundingBox())!;
  expect(heading.x - brand.x - brand.width).toBeGreaterThanOrEqual(12);
  expect(Math.abs(heading.y + heading.height / 2 - brand.y - brand.height / 2)).toBeLessThan(1);
  await expect(panel.locator(".site-navigation-head [data-slot=dialog-description]")).toHaveCount(
    0,
  );
  await expect(panel.locator(".site-navigation-footer-actions a")).toHaveCount(0);
  await expect(panel.getByRole("button", { name: "Close navigation menu" })).toHaveCSS(
    "width",
    "28px",
  );
  await panel.getByRole("button", { name: /Blocks Application Layouts/ }).click();
  await expect(panel.getByRole("button", { name: /Toggle .* variants/ })).toHaveCount(0);
  await expect(panel.getByRole("link", { name: "Sidebar", exact: true })).toBeVisible();
  await assertNoBlockingA11yViolations(page, "Collection navigation", {
    include: ".site-navigation-panel",
  });
  await panel.getByRole("button", { name: "Kamod Ecosystem Toolkit", exact: true }).click();
  const last = panel.getByRole("link", {
    name: "All Kamod repositories (opens in a new tab)",
    exact: true,
  });
  await last.focus();
  await page.keyboard.press(forwardTabKey(browserName));
  await expect(panel.getByRole("button", { name: "Close navigation menu" })).toBeFocused();
  await panel.getByRole("link", { name: "Sidebar", exact: true }).click();
  await expect(page).toHaveURL(/\/blocks\/sidebar\/?$/);
  await expect(panel).toBeHidden();
  await trigger.click();
  await panel.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("data-kamod-scroll-lock", "");
  const palette = page
    .locator(".docs-topbar")
    .getByRole("button", { name: "Choose color theme" })
    .filter({ visible: true });
  await palette.click();
  const themes = page.getByRole("group", { name: "Choose color theme" });
  const professional = themes.getByRole("button", {
    name: "Professional (Electronics)",
    exact: true,
  });
  await professional.click();
  await expect(professional).toHaveAttribute("aria-pressed", "true");
  await palette.click();
});

test("navbar controls share one row and theme menus fit short screens", async ({ page }) => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [740, 360],
    [939, 800],
    [940, 800],
    [1200, 900],
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("./docs/components");
    const topbar = page.locator(".docs-topbar");
    await expect(topbar).toHaveCSS("height", "58px");
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
      if (width >= 940 && index === 0) expect(box.width).toBeGreaterThan(35);
      else expect(box.width).toBe(width < 940 ? 39 : 35);
      expect(box.height).toBe(width < 940 ? 39 : 35);
      expect(box.y).toBeCloseTo(boxes[0].y, 0);
    }
    if (width < 940) await expect(topbar.locator(".docs-topbar-github")).toBeHidden();
    else await expect(topbar.locator(".docs-topbar-github")).toBeVisible();
    if (width < 940) {
      await expect(controls.last()).toHaveAttribute("aria-label", "Choose color theme");
    }
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
    if (width >= 940) {
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
    if (width >= 940) {
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
  await page.setViewportSize({ width: 940, height: 900 });
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
    for (const width of [940, 1200, 1920, 2560]) {
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

test("top navigation highlights the owning section on overview and nested pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  for (const [route, label] of [
    ["docs/components", "Components"],
    ["docs/button/usage", "Components"],
    ["docs/forms", "Forms"],
    ["docs/formisch/installation", "Forms"],
    ["docs/packages", "Packages"],
    ["docs/hooks-package/installation", "Packages"],
    ["blocks", "Blocks"],
    ["blocks/application-shell/application-shell-1", "Blocks"],
  ]) {
    await page.goto(`./${route}`);
    const links = page.locator(".docs-topbar-links");
    await expect(links.locator("[aria-current]"), route).toHaveCount(1);
    await expect(links.getByRole("link", { name: label, exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
    await expect(links.locator("[aria-current]")).toHaveCSS("font-weight", "700");
  }
  await page.goto("./");
  await expect(page.locator(".docs-topbar-links [aria-current]")).toHaveCount(0);
});
