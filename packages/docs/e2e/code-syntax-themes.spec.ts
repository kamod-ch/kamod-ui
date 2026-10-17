import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

const canvases = {
  okaidia: "rgb(39, 40, 34)",
  tomorrow: "rgb(45, 45, 45)",
  twilight: "rgb(20, 20, 20)",
  "solarized-light": "rgb(253, 246, 227)",
};

test("all nine palettes reuse highlighted nodes and preserve the source and controls", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./docs/code/installation#syntax-themes");
  const demo = page.locator('[data-code-demo="theme"]');
  const reader = demo.locator(".kamod-code");
  const source = reader.locator("pre code");
  await demo.scrollIntoViewIfNeeded();
  await expect(source.locator(".token.keyword").first()).toBeVisible();
  const original = await source.textContent();
  const token = await source.locator(".token.keyword").first().elementHandle();
  const header = reader.locator('[data-slot="code-toolbar"]');
  const headerStyle = await header.evaluate((node) => ({
    background: getComputedStyle(node).backgroundColor,
    color: getComputedStyle(node).color,
  }));
  const choices = demo.getByLabel("Syntax palette");
  await expect(choices.locator("option")).toHaveCount(9);
  for (const theme of [
    "default",
    "theme",
    "dusk",
    "forest",
    "monochrome",
    ...Object.keys(canvases),
  ]) {
    await choices.selectOption(theme);
    await expect(reader).toHaveAttribute("data-syntax-theme", theme);
    expect(
      await source.evaluate((node, prior) => node.querySelector(".token.keyword") === prior, token),
    ).toBe(true);
    expect(await source.textContent()).toBe(original);
    expect(
      await header.evaluate((node) => ({
        background: getComputedStyle(node).backgroundColor,
        color: getComputedStyle(node).color,
      })),
    ).toEqual(headerStyle);
    if (theme in canvases) {
      expect(
        await reader.locator("pre").evaluate((node) => getComputedStyle(node).backgroundColor),
      ).toBe(canvases[theme as keyof typeof canvases]);
    }
  }
  await choices.selectOption("default");
  expect(
    await reader.locator("pre").evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe(canvases["solarized-light"]);
  await reader.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
});

for (const width of [320, 768, 1440]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`Prism studies stay scoped and readable at ${width}px in ${scheme} mode`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("./docs/code/installation#code-prism-palettes");
      await page.waitForSelector("html.pp-ready");
      await page.evaluate(
        (dark) => document.documentElement.classList.toggle("dark", dark),
        scheme === "dark",
      );
      const gallery = page.locator(".code-prism-studies");
      await expect(gallery.locator(".code-prism-study")).toHaveCount(4);
      await expect(gallery.locator("iframe")).toHaveCount(0);
      let commonSource: string | null = null;
      for (const [theme, background] of Object.entries(canvases)) {
        const reader = gallery.locator(`.kamod-code[data-syntax-theme="${theme}"]`);
        await reader.scrollIntoViewIfNeeded();
        await expect(reader.locator(".token.keyword").first()).toBeVisible();
        const text = await reader.locator("pre code").textContent();
        if (commonSource === null) commonSource = text;
        expect(text).toBe(commonSource);
        const rendered = await reader.locator("pre").evaluate((node) => {
          const rgb = (color: string) =>
            color
              .match(/[\d.]+/g)!
              .slice(0, 3)
              .map(Number);
          const luminance = (color: string) =>
            rgb(color).reduce((sum, value, i) => {
              const channel = value / 255;
              return (
                sum +
                (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) *
                  [0.2126, 0.7152, 0.0722][i]
              );
            }, 0);
          const background = getComputedStyle(node).backgroundColor;
          const bg = luminance(background);
          const contrasts = [node, ...node.querySelectorAll(".token")].map((token) => {
            const fg = luminance(getComputedStyle(token).color);
            return (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
          });
          return {
            background,
            contrast: Math.min(...contrasts),
            fits: node.scrollWidth <= node.clientWidth + 1,
          };
        });
        expect(rendered.background).toBe(background);
        expect(rendered.contrast).toBeGreaterThanOrEqual(4.5);
        expect(rendered.fits).toBe(true);
      }
      const layout = await gallery.evaluate((node) => ({
        width: node.clientWidth,
        columns: getComputedStyle(
          node.querySelector(".code-prism-studies-grid")!,
        ).gridTemplateColumns.split(" ").length,
      }));
      expect(layout.columns).toBe(layout.width >= 640 ? 2 : 1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      for (const id of ["code-prism-palettes", "code-shared-syntax-choice"]) {
        await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
      }
    });
  }
}

test("adaptive syntax ink follows the nearest appearance boundary", async ({ page }) => {
  await page.goto("./docs/code/installation#syntax-themes");
  const reader = page.locator('[data-code-demo="theme"] .kamod-code');
  await reader.scrollIntoViewIfNeeded();
  await expect(reader.locator(".token.keyword").first()).toBeAttached();
  const comparisons = await reader.evaluate((reader) => {
    const root = document.documentElement;
    const fixture = document.createElement("div");
    document.body.append(fixture);
    const results: Record<string, string[][]> = {};
    try {
      for (const palette of ["default", "dusk", "forest"]) {
        results[palette] = [];
        for (const rootScheme of ["light", "dark"]) {
          root.classList.toggle("dark", rootScheme === "dark");
          root.classList.toggle("light", rootScheme === "light");
          const colors: string[] = [];
          for (const localScheme of ["light", "dark"]) {
            for (const nested of [false, true]) {
              const scope = document.createElement("section");
              scope.className = localScheme;
              scope.dataset.themeScope = "";
              const clone = reader.cloneNode(true) as HTMLElement;
              clone.dataset.syntaxTheme = palette;
              scope.append(clone);
              // A second, opposite ancestor must not override the nearest scope.
              const host = document.createElement("div");
              if (nested) host.className = localScheme === "light" ? "dark" : "light";
              host.append(scope);
              fixture.replaceChildren(host);
              colors.push(getComputedStyle(clone.querySelector(".token.keyword")!).color);
            }
          }
          results[palette].push(colors);
        }
      }
      return results;
    } finally {
      fixture.remove();
    }
  });
  for (const [lightRoot, darkRoot] of Object.values(comparisons)) {
    expect(darkRoot).toEqual(lightRoot);
    expect(lightRoot[0]).toBe(lightRoot[1]);
    expect(lightRoot[2]).toBe(lightRoot[3]);
    expect(lightRoot[0]).not.toBe(lightRoot[2]);
  }
});
