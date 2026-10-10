import { expect, test } from "@playwright/test";

// Touch devices can retain :hover after a tap; force it to verify the CSS guard itself.
test("touch pages disable authored hover styles, including standalone previews", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
  try {
    for (const route of [
      "",
      "docs/components",
      "docs/button/installation",
      "blocks/application-shell/application-shell-1",
      "blocks/application-shell/application-shell-1/preview",
    ]) {
      await page.goto(new URL(route, baseURL).href);
      await page.waitForSelector("html.pp-ready");
      expect(await page.evaluate(() => matchMedia("(hover: none)").matches)).toBe(true);
      const unguarded = await page.evaluate(() => {
        const selectors: string[] = [];
        const visit = (rules: CSSRuleList) => {
          for (const rule of rules) {
            if (rule instanceof CSSMediaRule && !matchMedia(rule.conditionText).matches) continue;
            if (rule instanceof CSSStyleRule && /(^|[^\\]):hover\b/.test(rule.selectorText)) {
              // Forms repeats resting checked colors; Blobatar supplies its own touch reset.
              // Their effective styles are verified with forced hover below.
              const formsReset =
                rule.selectorText.startsWith('input:where([type="') &&
                ["transparent", "rgba(0, 0, 0, 0)"].includes(rule.style.borderColor) &&
                rule.style.backgroundColor.toLowerCase() === "currentcolor";
              if (!formsReset && rule.selectorText !== ".mo-root:hover")
                selectors.push(rule.selectorText);
            }
            if ("cssRules" in rule) visit((rule as CSSGroupingRule).cssRules);
          }
        };
        for (const sheet of document.styleSheets) {
          if (!sheet.href || new URL(sheet.href).origin === location.origin) visit(sheet.cssRules);
        }
        return selectors;
      });
      expect(unguarded, route).toEqual([]);
    }
  } finally {
    await context.close();
  }
});

test("touch menu keeps resting visuals under forced hover and retains keyboard focus", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto(baseURL!);
    await page.getByRole("button", { name: "Open navigation menu" }).tap();
    await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.id = "touch-hover-probe";
      probe.innerHTML =
        '<div class="mo-root"></div><input type="checkbox" checked><input type="radio" checked><input type="checkbox">';
      probe.querySelectorAll("input")[2].indeterminate = true;
      document.body.append(probe);
    });
    await page
      .locator(".site-navigation-panel")
      .getByRole("button", { name: /Kamod Ecosystem/ })
      .click();
    const client = await context.newCDPSession(page);
    await client.send("DOM.enable");
    await client.send("CSS.enable");
    const { root } = await client.send("DOM.getDocument");
    for (const selector of [
      ".site-navigation-close",
      ".navigation-header-link",
      ".site-navigation-group-trigger",
      ".site-navigation-panel .docs-sidebar-ecosystem-heading",
      ".docs-sidebar-ecosystem a",
      "#touch-hover-probe .mo-root",
      "#touch-hover-probe input:nth-child(2)",
      "#touch-hover-probe input:nth-child(3)",
      "#touch-hover-probe input:nth-child(4)",
    ]) {
      const target = page.locator(selector).first();
      const read = () =>
        target.evaluate((node) => {
          const style = getComputedStyle(node);
          return [
            style.backgroundColor,
            style.color,
            style.boxShadow,
            style.translate,
            style.transform,
            style.getPropertyValue("--mo-amp"),
            style.animationPlayState,
          ];
        });
      const before = await read();
      const { nodeId } = await client.send("DOM.querySelector", { nodeId: root.nodeId, selector });
      await client.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["hover"] });
      await target.evaluate(async (node) => {
        await Promise.all(
          node
            .getAnimations()
            .filter((animation) => animation instanceof CSSTransition)
            .map((animation) => animation.finished),
        );
      });
      expect(await read(), selector).toEqual(before);
      await client.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
    }
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus-visible")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  } finally {
    await context.close();
  }
});

test("precise pointers retain hover feedback", async ({ page }) => {
  await page.goto("/");
  const target = page.locator(".docs-icon-button").filter({ visible: true }).first();
  const resting = await target.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(
    true,
  );
  await target.hover();
  await expect
    .poll(() => target.evaluate((node) => getComputedStyle(node).backgroundColor))
    .not.toBe(resting);
});

test("narrow screens suppress icon and grouped-control hover even with a mouse", async ({
  page,
  context,
}) => {
  await page.goto("/docs/pagination/installation");
  await page.waitForSelector("html.pp-ready");
  const example = page.locator(".component-example").first();
  await example.getByRole("tab", { name: "Prompt", exact: true }).click();
  const client = await context.newCDPSession(page);
  await client.send("DOM.enable");
  await client.send("CSS.enable");
  const { root } = await client.send("DOM.getDocument");
  const targets = example.locator(
    '.docs-icon-button, [data-slot="tabs-trigger"], [data-slot="toggle-group-item"]',
  );
  const count = await targets.count();
  expect(count).toBeGreaterThan(5);
  for (const width of [390, 767]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches),
    ).toBe(true);
    for (const theme of ["default", "watson"]) {
      await page.evaluate((theme) => (document.documentElement.dataset.theme = theme), theme);
      for (let index = 0; index < count; index++) {
        const target = targets.nth(index);
        if (!(await target.isVisible())) continue;
        await target.evaluate((node) => node.setAttribute("data-hover-test", ""));
        const read = () =>
          target.evaluate((node) => {
            const style = getComputedStyle(node);
            return [
              style.backgroundColor,
              style.color,
              style.borderColor,
              style.boxShadow,
              style.translate,
              style.transform,
              style.scale,
              style.opacity,
              node.getAttribute("aria-selected"),
              node.getAttribute("data-state"),
            ];
          });
        // Finish selection/theme transitions before comparing hover-only changes.
        await target.evaluate(async (node) => {
          await Promise.all(
            node
              .getAnimations()
              .filter((animation) => animation instanceof CSSTransition)
              .map((animation) => animation.finished),
          );
        });
        const before = await read();
        const { nodeId } = await client.send("DOM.querySelector", {
          nodeId: root.nodeId,
          selector: "[data-hover-test]",
        });
        await client.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["hover"] });
        await target.evaluate(async (node) => {
          await Promise.all(
            node
              .getAnimations()
              .filter((animation) => animation instanceof CSSTransition)
              .map((animation) => animation.finished),
          );
        });
        expect(await read(), `${width}px ${theme} control ${index}`).toEqual(before);
        await client.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
        await target.evaluate((node) => node.removeAttribute("data-hover-test"));
      }
    }
  }
  const selected = example.getByRole("tab", { name: "Prompt", exact: true });
  await expect(selected).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Tab");
  await selected.focus();
  await expect(page.locator(":focus-visible")).toHaveCount(1);
});
