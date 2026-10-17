import { expect, type Locator, test } from "@playwright/test";

const references = [
  "TypeScript",
  "ThemeToggle",
  "Dialog",
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
      const pagePaint = await page.locator("main").evaluate((node) => {
        const sample = document.createElement("span");
        sample.style.cssText = "background:var(--background);color:var(--foreground)";
        node.append(sample);
        const style = getComputedStyle(sample);
        const paint = { background: style.backgroundColor, ink: style.color };
        sample.remove();
        return paint;
      });
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
        const layout = card.locator(".code-reference-help-layout[data-reference-kind]");
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
        await expect(location).toHaveAttribute("href", destination);
        await expect(location).toHaveAttribute("target", "_top");
        const shownDestination = await location.locator("span[dir='ltr']").innerText();
        expect(destination).toContain(shownDestination);
        await expect(location).toHaveAccessibleName(`Open ${shownDestination}`);
        await expect(location).toHaveAttribute("title", shownDestination);
        const fact = card.locator(".code-reference-help-location-detail");
        await expect(fact.locator("span")).not.toBeEmpty();
        await expect(
          card.locator(".code-reference-help-heading-meta .code-reference-help-location-detail"),
        ).toHaveCount(0);
        await expect(location).not.toContainText((await fact.locator("span").innerText()).trim());
        for (const icon of [
          title.locator(".code-reference-help-title-mark"),
          card.locator(".code-reference-help-connection"),
        ]) {
          await expect(icon).toHaveAttribute("aria-hidden", "true");
          await expect(icon).not.toHaveAttribute("tabindex");
        }
        const origin = card.locator(".code-reference-help-origin");
        const context = origin.locator(".code-reference-help-context");
        await expect(origin.locator(".code-reference-help-location-detail")).toHaveCount(1);
        const factBox = (await fact.boundingBox())!;
        const contextBox = (await context.boundingBox())!;
        const pathBox = (await origin.locator(".code-reference-help-path").boundingBox())!;
        for (const box of [contextBox, pathBox])
          expect(box.y + box.height / 2).toBeCloseTo(factBox.y + factBox.height / 2, 1);
        expect(factBox.x).toBeGreaterThanOrEqual(contextBox.x + contextBox.width - 1);
        const summaryStyle = await card
          .locator(".code-reference-help-summary > p")
          .first()
          .evaluate((node) => {
            const style = getComputedStyle(node);
            return {
              color: style.color,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              lineHeight: style.lineHeight,
            };
          });
        for (const text of [context, fact]) {
          await expect(text).toHaveCSS("color", summaryStyle.color);
          await expect(text).toHaveCSS("font-size", summaryStyle.fontSize);
          await expect(text).toHaveCSS("font-weight", summaryStyle.fontWeight);
          await expect(text).toHaveCSS("line-height", summaryStyle.lineHeight);
        }
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
        await expect(postscript).toHaveCSS("color", summaryStyle.color);
        await expect(card.locator("footer")).toHaveCount(0);
        const content = card.locator(".code-reference-help-content");
        if (await content.count()) {
          for (const section of await content.locator(".code-reference-help-section").all()) {
            const heading = section.locator(".code-reference-help-section-label");
            const panel = section.locator(".code-reference-help-panel");
            await expect(heading).toHaveCSS("font-size", "9.5px");
            await expect(heading.locator(".code-reference-help-section-open")).toHaveCount(0);
            await expect(panel).toHaveCSS("border-top-width", "0px");
            await expect(panel).toHaveCSS("background-color", pagePaint.background);
            for (const miniature of await panel.locator(".code-reference-help-miniature").all()) {
              await expect(miniature).toHaveCSS("background-color", pagePaint.background);
              await expect(miniature).toHaveCSS("color", pagePaint.ink);
            }
            expect(await heading.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(
              true,
            );
            await expect(panel.locator("a.code-reference-help-panel-open")).toHaveCount(0);
            const source = heading.locator(".code-reference-help-section-source");
            if (await source.count()) {
              await expect(source).toHaveAttribute(
                "href",
                (await heading.locator("a").first().getAttribute("href"))!,
              );
              await expect(source).toHaveCSS("color", ink);
              await expect(source.locator("svg")).toHaveCount(2);
              const sourceBox = (await source.boundingBox())!;
              const headingBox = (await heading
                .locator(".code-reference-help-section-title")
                .boundingBox())!;
              expect(sourceBox.y + sourceBox.height / 2).toBeCloseTo(
                headingBox.y + headingBox.height / 2,
                1,
              );
              const panelBox = (await panel.boundingBox())!;
              const sectionBox = (await section.boundingBox())!;
              expect(panelBox.x).toBeCloseTo(sectionBox.x, 1);
              expect(panelBox.width).toBeCloseTo(sectionBox.width, 1);
              const note = section.locator(".code-reference-help-section-note");
              await expect(note).toHaveCSS("text-align", "center");
              await expect(note).toHaveCSS("-webkit-line-clamp", "1");
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
        }
        if (label === "Dialog") {
          const chapters = card.locator(".code-reference-help-section");
          await expect(chapters).toHaveCount(3);
          await expect(chapters.nth(0)).toContainText("Installation & usage");
          await expect(chapters.nth(0).locator(".kamod-code")).toHaveCount(2);
          const props = chapters.nth(1);
          await expect(props).toContainText("Dialog lockBodyScroll");
          await expect(props).toContainText("locks document scroll");
          await expect(props).toContainText("open / onOpenChange");
          await expect(props.locator(".component-api-owners a").first()).toContainText(
            "DialogProps",
          );
          await expect(
            props.getByRole("link", { name: /Read the complete props and data table/ }),
          ).toBeAttached();
          await expect(props).not.toContainText("Optional in source");
          await expect(props).not.toContainText("3 of");
          await expect(chapters.nth(2)).toContainText("Data type reference");
          await expect(chapters.nth(2).locator('[data-slot="type-definition"]')).toHaveCount(3);
        }
        const index = card.locator(".code-reference-help-related");
        await expect(index).toContainText("Useful resources");
        await expect(index.locator(".code-reference-help-panel")).toHaveCount(0);
        const resources = index.locator(".code-reference-help-related-link");
        const count = await resources.count();
        expect(count).toBeGreaterThan(0);
        await expect(resources.first()).toHaveAttribute("href", destination);
        await expect(resources.first()).toHaveAttribute("data-reference-primary", "true");
        await expect(index.getByRole("list")).toHaveCount(1);
        await expect(index.getByRole("listitem")).toHaveCount(count);
        await expect(index.getByText("Contracts", { exact: true })).toHaveCount(0);
        await expect(index.getByText("Resources", { exact: true })).toHaveCount(0);
        await expect(index.locator(".code-reference-help-reading-count")).toHaveText(
          `${count} ${count === 1 ? "reference" : "references"}`,
        );
        const destinations = await resources.evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")),
        );
        expect(new Set(destinations).size).toBe(destinations.length);
        const chapterDestinations = await card
          .locator(
            ".code-reference-help-section-source, .code-reference-help-continuation, [data-slot='type-definition'] h6 a",
          )
          .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
        for (const href of chapterDestinations) expect(destinations).toContain(href);
        for (const link of await resources.all()) {
          await expect(link).toHaveCSS("text-decoration-line", "none");
          await expect(link.locator("code")).toHaveCSS("text-decoration-line", "underline");
          await expect(link.locator(".code-reference-help-related-kind")).toHaveCSS(
            "text-decoration-line",
            "none",
          );
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
  const types = card.locator(".blocks-api-prop-type");
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
