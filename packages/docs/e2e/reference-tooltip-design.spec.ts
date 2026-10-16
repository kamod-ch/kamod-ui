import { expect, type Locator, test } from "@playwright/test";

const references = [
  "TypeScript",
  "ThemeToggle",
  "DirectionProviderProps",
  "pnpm build",
  "@kamod-ch/ui/theme.css",
  "Getting Started Guide",
  "sidebar-05.tsx",
];

/** Actions retain their typography and geometry; only their paint responds to hover. */
async function assertBackgroundOnlyHover(action: Locator) {
  await action.scrollIntoViewIfNeeded();
  const read = () =>
    action.evaluate((node) => {
      const style = getComputedStyle(node);
      const icon = getComputedStyle(node.querySelector("svg")!);
      const rect = node.getBoundingClientRect();
      return {
        background: style.backgroundColor,
        ink: style.color,
        opacity: style.opacity,
        font: `${style.fontSize}/${style.fontWeight}`,
        shadow: style.boxShadow,
        icon: `${icon.color}/${icon.width}/${icon.height}/${icon.strokeWidth}`,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      };
    });
  const before = await read();
  await action.hover();
  await expect.poll(async () => (await read()).background).not.toBe(before.background);
  const after = await read();
  expect({ ...after, background: before.background, rect: before.rect }).toEqual(before);
  for (const key of ["x", "y", "width", "height"] as const)
    expect(after.rect[key]).toBeCloseTo(before.rect[key], 1);
}

for (const scheme of ["light", "dark"] as const) {
  for (const width of [320, 768, 1440]) {
    test(`source miniatures and reference index fit ${width}px (${scheme})`, async ({ page }) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
      await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
      await page.goto("/docs/getting-started");
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate((labels) => {
        const fixture = document.createElement("p");
        fixture.id = "tooltip-design-fixture";
        for (const label of labels) {
          const code = document.createElement("code");
          code.textContent = label;
          fixture.append(code, document.createTextNode(" "));
        }
        document.querySelector("main")!.prepend(fixture);
      }, references);
      for (const label of references) {
        const term = page.locator("#tooltip-design-fixture code").filter({ hasText: label });
        await expect(term).toHaveAttribute("data-code-module");
        await term.scrollIntoViewIfNeeded();
        await page.keyboard.press("Tab");
        await term.focus();
        const card = page.getByRole("dialog", { name: `${label} reference`, exact: true });
        const layout = card.locator(".code-reference-help-layout");
        await expect(layout).toBeVisible();
        await expect
          .poll(() =>
            layout.evaluate((node) =>
              node.getAnimations().some((animation) => animation.playState === "running"),
            ),
          )
          .toBe(false);
        const ink = await layout.evaluate((node) => getComputedStyle(node).color);
        const primary = card.locator(".code-reference-help-primary-link");
        const destination = (await primary.getAttribute("href"))!;
        const badge = card.locator(".code-reference-help-kind");
        const open = card.locator(".code-reference-help-open");
        const main = card.locator("a.code-reference-help-kind-icon");
        const title = card.locator("a.code-reference-help-title");
        await expect(card.locator("header [data-slot='badge']")).toHaveCount(1);
        await expect(badge).toHaveCSS(
          "background-color",
          await card
            .locator(".code-reference-help-path")
            .evaluate((node) => getComputedStyle(node).backgroundColor),
        );
        await expect(badge).toHaveCSS("border-radius", "4px");
        await expect(badge).toHaveCSS("font-size", "11px");
        await expect(badge.locator("svg")).toHaveCSS("width", "12px");
        await expect(badge.locator("svg")).toHaveCSS("stroke-width", "2px");
        const badgeBox = (await badge.boundingBox())!;
        const openBox = (await open.boundingBox())!;
        const mainBox = (await main.boundingBox())!;
        expect(openBox.height).toBeCloseTo(badgeBox.height, 2);
        expect(openBox.width).toBeCloseTo(openBox.height, 2);
        expect(openBox.height).toBeCloseTo(22, 2);
        expect(openBox.y).toBeCloseTo(mainBox.y, 1);
        expect((await title.boundingBox())!.y).toBeCloseTo(mainBox.y, 1);
        await expect(open).toHaveCSS(
          "background-color",
          await badge.evaluate((node) => getComputedStyle(node).backgroundColor),
        );
        await expect(open).toHaveCSS(
          "color",
          await badge.evaluate((node) => getComputedStyle(node).color),
        );
        await expect(open.locator("svg")).toHaveCSS("width", "11px");
        await expect(open.locator("svg")).toHaveCSS("stroke-width", "1.75px");
        for (const link of [open, main, title]) {
          await expect(link).toHaveAttribute("href", destination);
          await expect(link).toHaveAttribute("target", "_top");
        }
        await expect(main).toHaveCSS(
          "color",
          await badge.evaluate((node) => getComputedStyle(node).backgroundColor),
        );
        const location = card.locator(".code-reference-help-location");
        await expect(location).toHaveCSS("font-weight", "400");
        await expect(location).toHaveCSS("color", ink);
        const shownDestination = await location.locator("span").first().innerText();
        expect(destination).toContain(shownDestination);
        await expect(location.locator("span").last()).not.toBeEmpty();
        const origin = card.locator(".code-reference-help-origin");
        const context = origin.locator(".code-reference-help-context");
        await expect(context).toHaveCSS("color", ink);
        expect(
          (await context.locator("span").last().innerText()).trim().split(/\s+/).length,
        ).toBeLessThanOrEqual(3);
        await expect(origin.locator(".code-reference-help-origin-label")).toHaveCount(0);
        expect(await origin.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(
          true,
        );
        const postscript = card.locator(".code-reference-help-detail");
        await expect(postscript).not.toBeEmpty();
        await expect(postscript).toHaveCSS("font-size", "8.5px");
        await expect(postscript).toHaveCSS("color", ink);
        await expect(card.locator("footer")).toHaveCount(0);
        const content = card.locator(".code-reference-help-content");
        if (await content.count()) {
          for (const section of await content.locator(".code-reference-help-section").all()) {
            const heading = section.locator(".code-reference-help-section-label");
            const panel = section.locator(".code-reference-help-panel");
            await expect(heading).toHaveCSS("font-size", "9.5px");
            await expect(heading.locator(".code-reference-help-section-open")).toHaveCount(0);
            await expect(panel).toHaveCSS("border-top-width", "0px");
            expect(await heading.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(
              true,
            );
            const source = panel.locator(".code-reference-help-panel-open");
            if (await source.count()) {
              await expect(source).toHaveAttribute(
                "href",
                (await heading.locator("a").getAttribute("href"))!,
              );
              await expect(source).toHaveCSS("width", "22px");
              await expect(source.locator("svg")).toHaveCSS("stroke-width", "1.75px");
              const note = section.locator(".code-reference-help-section-note");
              await expect(note).toHaveCSS("text-align", "center");
              await expect(note.locator("a").first()).toHaveAttribute(
                "href",
                (await source.getAttribute("href"))!,
              );
            }
          }
        }
        if (label === "TypeScript") {
          expect(await card.locator(".code-reference-help-section").count()).toBeGreaterThanOrEqual(
            2,
          );
          await expect(card.locator(".code-reference-help-miniature").first()).toBeAttached();
          await assertBackgroundOnlyHover(open);
          await assertBackgroundOnlyHover(main);
        }
        if (label === "ThemeToggle") {
          const table = card.locator(".blocks-api-props-table table");
          await expect(table).toHaveCount(1);
          expect(await table.locator("tbody tr").count()).toBeGreaterThan(0);
          expect(await table.locator("tbody tr").count()).toBeLessThanOrEqual(3);
          await expect(card.locator('[data-slot="type-definition"]').first()).toBeAttached();
          await expect(
            card.locator('.code-reference-help-miniature-code [data-slot="code"]').first(),
          ).toBeAttached();
          await assertBackgroundOnlyHover(card.locator(".code-reference-help-panel-open").first());
        }
        const index = card.locator(".code-reference-help-related");
        await expect(index).toContainText("Reference index");
        await expect(index.locator(".code-reference-help-panel")).toHaveCount(0);
        const resources = index.locator(".code-reference-help-related-link");
        expect(await resources.count()).toBeGreaterThan(0);
        const destinations = await resources.evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")),
        );
        expect(new Set(destinations).size).toBe(destinations.length);
        for (const link of await resources.all()) {
          await expect(link).toHaveCSS("text-decoration-line", "underline");
          await expect(link.locator("code")).toHaveCSS("font-size", "7.5px");
          await expect(link.locator(".code-reference-help-related-kind")).toContainText("/");
          await expect(link.locator("svg")).toHaveCount(1);
        }
        const bounds = (await card.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
        expect(await card.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
        await term.focus();
        await page.keyboard.press("Tab");
        await expect(card.locator("a").first()).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(term).toBeFocused();
        await expect(card).toHaveCount(0);
      }
    });
  }
}

test("failed optional coloring preserves actual source previews and navigation", async ({
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
  await expect(card.locator(".blocks-api-props-table table")).toBeAttached();
  await expect.poll(() => requested).toBe(true);
  const types = card.locator(".blocks-api-prop-type > .code-reference-help-syntax");
  expect(await types.count()).toBeGreaterThan(0);
  for (const type of await types.all()) await expect(type).not.toBeEmpty();
  await expect(card.locator(".code-reference-help-contract .token")).toHaveCount(0);
  await expect(card.locator(".code-reference-help-primary-link")).toHaveAttribute(
    "href",
    "/docs/theme-toggle/installation#api-reference",
  );
  await page.keyboard.press("Escape");
  await expect(term).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Theming");
  expect(errors).toEqual([]);
});
