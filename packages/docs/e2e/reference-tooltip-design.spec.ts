import { expect, test } from "@playwright/test";

for (const scheme of ["light", "dark"] as const) {
  for (const width of [320, 768, 1440]) {
    test(`reference reading panels and one-line locations fit ${width}px (${scheme})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
      await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
      const grammars: string[] = [];
      page.on("request", (request) => {
        if (/\/assets\/reference-declaration-[\w-]+\.js/.test(request.url()))
          grammars.push(request.url());
      });
      await page.goto("/docs/getting-started");
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(() => {
        const fixture = document.createElement("p");
        fixture.id = "tooltip-design-fixture";
        for (const label of [
          "TypeScript",
          "ThemeToggle",
          "DirectionProviderProps",
          "pnpm build",
          "@kamod-ch/ui/theme.css",
          "Getting Started Guide",
          "sidebar-05.tsx",
        ]) {
          const code = document.createElement("code");
          code.textContent = label;
          fixture.append(code, document.createTextNode(" "));
        }
        document.querySelector("main")!.prepend(fixture);
      });
      for (const label of [
        "TypeScript",
        "ThemeToggle",
        "DirectionProviderProps",
        "pnpm build",
        "@kamod-ch/ui/theme.css",
        "Getting Started Guide",
        "sidebar-05.tsx",
      ]) {
        const term = page.locator("#tooltip-design-fixture code").filter({ hasText: label });
        await expect(term).toHaveAttribute("data-code-module");
        await term.scrollIntoViewIfNeeded();
        await page.keyboard.press("Tab");
        await term.focus();
        const card = page.getByRole("dialog", { name: `${label} reference`, exact: true });
        await expect(card.locator(".code-reference-help-layout")).toBeVisible();
        await expect(card.locator("header [data-slot='badge']")).toHaveCount(1);
        const badge = card.locator(".code-reference-help-kind");
        const open = card.locator(".code-reference-help-open");
        const chipStyle = await card.locator(".code-reference-help-path").evaluate((node) => ({
          background: getComputedStyle(node).backgroundColor,
        }));
        await expect(badge).toHaveCSS("background-color", chipStyle.background);
        await expect(badge).toHaveCSS("border-radius", "4px");
        await expect(badge).toHaveCSS("font-size", "11px");
        await expect(badge).toHaveCSS("font-weight", "500");
        const badgeBox = (await badge.boundingBox())!;
        const openBox = (await open.boundingBox())!;
        expect(openBox.height).toBeCloseTo(28, 3);
        expect(openBox.width).toBeCloseTo(openBox.height, 3);
        expect(
          Math.abs(openBox.y + openBox.height / 2 - badgeBox.y - badgeBox.height / 2),
        ).toBeLessThan(1);
        await expect(open.locator("svg")).toHaveCSS("stroke-width", "3px");
        await expect(open).toHaveAttribute(
          "href",
          (await card.locator(".code-reference-help-primary-link").getAttribute("href"))!,
        );
        await expect(open).toHaveAttribute("target", "_top");
        await expect(open).toHaveAccessibleName(
          `Open ${await card.locator(".code-reference-help-primary-link").getAttribute("aria-label")} for ${label}`,
        );
        await expect(badge.locator("svg")).toHaveCSS("width", "10.5px");
        await expect(badge.locator("svg")).toHaveCSS("stroke-width", "2.5px");
        const mainIcon = card.locator("a.code-reference-help-kind-icon");
        await expect(mainIcon).toHaveAttribute("href", (await open.getAttribute("href"))!);
        await expect(mainIcon).toHaveAttribute("target", "_top");
        await expect(mainIcon).toHaveAccessibleName(`View ${label} reference`);
        await expect(mainIcon.locator("svg")).toHaveCSS("stroke-width", "2.25px");
        await expect(mainIcon).toHaveCSS(
          "background-color",
          await open.evaluate((node) => getComputedStyle(node).backgroundColor),
        );
        const origin = card.locator(".code-reference-help-origin");
        await expect(origin.locator(".code-reference-help-origin-label")).toHaveCount(0);
        await expect(origin.locator("a")).toHaveCount(1);
        const context = origin.locator(".code-reference-help-context > span:last-child");
        expect((await context.innerText()).trim().split(/\s+/).length).toBeLessThanOrEqual(3);
        await expect(context).toHaveCSS("white-space", "nowrap");
        await expect(card.locator(".code-reference-help-detail")).not.toBeEmpty();
        const dimensions = await origin.evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return {
            width: node.clientWidth,
            scroll: node.scrollWidth,
            top: rect.top,
            bottom: rect.bottom,
            children: [...node.querySelectorAll("a")].map((a) => {
              const b = a.getBoundingClientRect();
              return { top: b.top, bottom: b.bottom };
            }),
          };
        });
        expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
        for (const link of dimensions.children) {
          expect(link.top).toBeGreaterThanOrEqual(dimensions.top);
          expect(link.bottom).toBeLessThanOrEqual(dimensions.bottom);
        }
        const chip = card.locator(".code-reference-help-path");
        expect(
          await chip.evaluate((node) => {
            const probe = document.createElement("span");
            probe.style.background = "var(--docs-inline-code-background)";
            node.append(probe);
            const same =
              getComputedStyle(node).backgroundColor === getComputedStyle(probe).backgroundColor;
            probe.remove();
            return same;
          }),
        ).toBe(true);
        expect(await card.locator("footer a").count()).toBeGreaterThanOrEqual(1);
        expect(await card.locator("footer a").count()).toBeLessThanOrEqual(4);
        const postscript = card.locator(".code-reference-help-detail");
        await expect(postscript).toHaveCSS("font-size", "8.5px");
        await expect(postscript).toHaveCSS("color", /\/ 0\.4\)/);
        const content = card.locator(".code-reference-help-content");
        if (await content.count()) {
          const body = (await content.boundingBox())!;
          const outer = (await card.boundingBox())!;
          expect(Math.abs(body.width - (outer.width - 2))).toBeLessThan(1);
          await expect(content).toHaveCSS("border-top-width", "1px");
          for (const section of await content.locator(".code-reference-help-section").all()) {
            const heading = section.locator(".code-reference-help-section-label");
            const panel = section.locator(".code-reference-help-panel");
            const headingBox = (await heading.boundingBox())!;
            const panelBox = (await panel.boundingBox())!;
            expect(headingBox.y + headingBox.height).toBeLessThan(panelBox.y);
            await expect(panel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
            for (const type of await panel.locator("dt > .code-reference-help-syntax").all()) {
              await expect(type).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
              await expect(type).toHaveCSS("font-size", "8.5px");
            }
            const title = heading.locator("a.code-reference-help-section-title");
            const action = heading.locator(".code-reference-help-section-open");
            await expect(action).toHaveAttribute("href", (await title.getAttribute("href"))!);
            await expect(action.locator("svg")).toHaveCSS("stroke-width", "2.75px");
            expect(await heading.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(
              true,
            );
          }
        }
        const reading = card.locator(".code-reference-help-related");
        if (await reading.count()) {
          await expect(reading).toHaveCSS("border-top-width", "1px");
          await expect(reading.locator(".code-reference-help-panel")).toHaveCount(0);
          expect((await reading.boundingBox())!.width).toBeCloseTo(
            (await card.boundingBox())!.width - 2,
            0,
          );
          for (const chip of await reading.locator(".code-reference-help-related-link").all()) {
            await expect(chip.locator("code")).toHaveCSS("font-size", "8.5px");
          }
        }
        await expect(card.locator("footer")).toHaveCSS("border-top-width", "1px");
        await expect(card.locator(".code-reference-help-note")).not.toBeEmpty();
        const bounds = (await card.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        expect(await card.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
        if (label === "TypeScript") {
          expect(grammars).toHaveLength(0);
          const action = card.locator("footer a").last();
          await action.focus();
          const hint = card.getByRole("tooltip");
          await expect(hint).toBeVisible();
          await expect(hint.locator("p")).not.toBeEmpty();
          await expect(hint.locator("code")).not.toBeEmpty();
          const hintBox = (await hint.boundingBox())!;
          expect(hintBox.x).toBeGreaterThanOrEqual(bounds.x);
          expect(hintBox.x + hintBox.width).toBeLessThanOrEqual(bounds.x + bounds.width);
          expect(hintBox.y).toBeGreaterThanOrEqual(bounds.y);
          await term.focus();
          await expect(hint).toHaveCount(0);
        }
        if (label === "ThemeToggle") {
          await expect(card.locator(".code-reference-help-contract .token").first()).toBeAttached();
          await expect(card.locator(".code-reference-help-related")).toBeAttached();
        }
        await page.keyboard.press("Tab");
        await expect(card.locator("a").first()).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(term).toBeFocused();
        await expect(card).toHaveCount(0);
      }
      expect(grammars).toHaveLength(1);
    });
  }
}

test("failed optional declaration coloring preserves plain code and reference navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let requested = false;
  await page.route(/\/assets\/reference-declaration-[\w-]+\.js(?:\?|$)/, (route) => {
    requested = true;
    return route.abort();
  });
  await page.goto("/docs/theming/installation");
  const term = page
    .locator(".block-guide-description")
    .getByRole("link", { name: "Theme Toggle", exact: true });
  await expect(term).toHaveAttribute("data-code-imported", "ThemeToggle");
  await term.scrollIntoViewIfNeeded();
  await page.keyboard.press("Tab");
  await term.focus();
  const card = page.getByRole("dialog", { name: "Theme Toggle reference", exact: true });
  await expect(card.locator(".code-reference-help-contract")).toBeVisible();
  await expect.poll(() => requested).toBe(true);
  await expect(
    card.locator(".code-reference-help-fields dt > .code-reference-help-syntax").first(),
  ).toHaveText("string");
  await expect(card.locator(".code-reference-help-contract .token")).toHaveCount(0);
  await expect(card.getByRole("link", { name: "API reference", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(term).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Theming");
  expect(errors).toEqual([]);
});
