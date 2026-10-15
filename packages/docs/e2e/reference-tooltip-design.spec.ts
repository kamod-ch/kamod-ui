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
        await expect(card.locator(".code-reference-help-owner")).not.toBeEmpty();
        await expect(card.locator(".code-reference-help-kind")).toHaveCSS("border-radius", "2px");
        const origin = card.locator(".code-reference-help-origin");
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
        await expect(card.locator("footer a")).toHaveCount(1);
        await expect(card.locator(".code-reference-help-note")).not.toBeEmpty();
        const bounds = (await card.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        expect(await card.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
        if (label === "TypeScript") expect(grammars).toHaveLength(0);
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
  await expect(card.locator(".code-reference-help-fields dd code").first()).toHaveText("string");
  await expect(card.locator(".code-reference-help-contract .token")).toHaveCount(0);
  await expect(card.getByRole("link", { name: "API reference", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(term).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Theming");
  expect(errors).toEqual([]);
});
