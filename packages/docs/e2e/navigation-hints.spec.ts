import { expect, test } from "@playwright/test";

test("sidebar groups offer useful hover references and preserve keyboard navigation", async ({
  page,
}) => {
  await page.goto("./docs/components");
  const sidebar = page.locator("aside.docs-sidebar");
  for (const group of ["Components", "Blocks", "Forms", "Packages"]) {
    const trigger = sidebar.locator(`[data-navigation-group="${group.toLowerCase()}"]`);
    await trigger.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await trigger.hover();
    const hint = page.getByRole("dialog", { name: `${group} explained` });
    await expect(hint).toBeVisible();
    await expect(hint.locator("dt")).toHaveText(["Explore", "Make it yours"]);
    await expect(hint.locator("a.docs-inline-code-link")).toHaveCount(2);
    await expect(hint.locator("a.docs-inline-code-link svg")).toHaveCount(4);
    await hint.hover();
    await expect(hint).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(hint).toBeHidden();
  }
  const trigger = sidebar.locator('[data-navigation-group="components"]');
  await page.keyboard.press("Shift");
  await trigger.focus();
  const hint = page.getByRole("dialog", { name: "Components explained" });
  await expect(hint).toBeVisible();
  const expanded = await trigger.getAttribute("aria-expanded");
  await page.keyboard.press("Tab");
  await expect(hint.getByRole("link", { name: "Open Components", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await expect(hint).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", expanded!);
});

test("single-line sidebar links stay tooltip-free and mobile group help stays usable", async ({
  page,
}) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("./docs/components");
    const mobile = width < 940;
    if (mobile) await page.getByRole("button", { name: "Open navigation menu" }).click();
    const root = page.locator(mobile ? ".site-navigation-panel" : "aside.docs-sidebar");
    const links = root.locator(
      '.site-navigation-group[data-kind="components"] .site-navigation-link',
    );
    const heights = await links.evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().height),
    );
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
    expect(
      await links.evaluateAll((items) =>
        items.every((item) => item.scrollWidth <= item.clientWidth),
      ),
    ).toBe(true);
    const longLink = root.getByRole("link", { name: "Locale Segment Group", exact: true });
    await longLink.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await longLink.hover();
    const hint = page.getByRole("tooltip");
    await page.waitForTimeout(550);
    await expect(hint).toBeHidden();
    await expect(longLink).toHaveAttribute("data-tooltip", "off");
    await expect(root.locator('.site-navigation-link:not([data-tooltip="off"])')).toHaveCount(0);
    await expect(root.locator(".site-navigation-link[title]")).toHaveCount(0);
    await expect(longLink.locator(".site-navigation-link-label > span")).toHaveCSS(
      "white-space",
      "nowrap",
    );
    await expect(
      root.locator('a[href$="/docs/code/installation"] .site-navigation-status'),
    ).toHaveText("Fresh");
    await expect(
      root.locator(".site-navigation-link-overview .site-navigation-status"),
    ).toHaveCount(0);
    await expect(root.locator(".site-navigation-special-icon").first()).toHaveCSS("width", "20px");
    await page.keyboard.press("Escape");
    if (mobile) {
      // Reopen if Escape also dismissed the menu's simple text hint.
      if (!(await root.isVisible())) {
        await page.getByRole("button", { name: "Open navigation menu" }).click();
        await expect(root).toBeFocused();
      }
      const trigger = root.locator('[data-navigation-group="components"]');
      await page.keyboard.press("Shift");
      await trigger.focus();
      const help = page.getByRole("dialog", { name: "Components explained" });
      await expect(help).toBeVisible();
      const box = (await help.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(800);
      await page.keyboard.press("Tab");
      await expect(help.getByRole("link", { name: "Open Components", exact: true })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(help).toBeHidden();
      await expect(root).toBeVisible();
      await expect(trigger).toBeFocused();
      await page.keyboard.press("Escape");
    }
  }
});

test("sidebar entry help offers useful references without taking over navigation", async ({
  page,
}) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./docs/components", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    if (width === 320) await page.getByRole("button", { name: "Open navigation menu" }).click();
    const root = page.locator(width === 320 ? ".site-navigation-panel" : "aside.docs-sidebar");
    for (const [key, name] of [
      ["getting-started", "Getting Started"],
      ["ecosystem", "Kamod Ecosystem"],
    ]) {
      const trigger = root.locator(`[data-navigation-help="${key}"]`);
      await trigger.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await page.keyboard.press("Shift");
      await trigger.focus();
      const help = page.getByRole("dialog", { name: `${name} explained` });
      await expect(help).toBeVisible();
      await expect(help.locator("dt")).toHaveText(["Explore", "Make it yours"]);
      await expect(help.locator("a.docs-inline-code-link")).toHaveCount(2);
      const box = (await help.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(900);
      await page.keyboard.press("Tab");
      await expect(help.locator("a").first()).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(help).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(root).toBeVisible();
    }
    const ecosystem = root.locator('[data-navigation-help="ecosystem"]');
    await ecosystem.click();
    await expect(ecosystem).toHaveAttribute("aria-expanded", "true");
    const repository = root.getByRole("link", { name: "Icons on GitHub (opens in a new tab)" });
    await repository.hover();
    await page.waitForTimeout(550);
    await expect(page.locator("[data-application-tooltip]")).toHaveCount(0);
    await ecosystem.click();
    await expect(ecosystem).toHaveAttribute("aria-expanded", "false");
    await root.getByRole("link", { name: "Getting Started" }).click();
    await expect(page).toHaveURL(/\/docs\/getting-started/);
  }
});
