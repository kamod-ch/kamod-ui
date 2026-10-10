import { expect, test } from "@playwright/test";

const routes = [
  "",
  "docs/components",
  "docs/code/installation",
  "docs/forms",
  "docs/formisch/installation",
  "docs/packages",
  "docs/hooks-package/installation",
  "blocks/application-shell/application-shell-1",
];

for (const width of [320, 1440]) {
  test(`linked inline code uses only the two shared sizes at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    const seen = new Set<number>();
    for (const route of routes) {
      await page.goto(`./${route}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const result = await page.evaluate(() => {
        const codes = [
          ...document.querySelectorAll<HTMLElement>(
            "a code, code:has(a), code.docs-reference-code, code.docs-kamod-path",
          ),
        ].filter((code) => !code.closest("pre") && code.getClientRects().length > 0);
        return codes.map((code) => {
          const style = getComputedStyle(code);
          return {
            text: code.textContent?.slice(0, 70),
            font: parseFloat(style.fontSize),
            line: parseFloat(style.lineHeight),
            padding: parseFloat(style.paddingInlineStart),
            border: parseFloat(style.borderTopWidth),
          };
        });
      });
      expect(result.length, route).toBeGreaterThan(0);
      for (const code of result) {
        expect([12, 14], `${route}: ${code.text}`).toContain(code.font);
        expect(code.line).toBe(code.font === 12 ? 16 : 20);
        expect(code.padding).toBe(code.font === 12 ? 3 : 4);
        expect(code.border).toBe(1);
        seen.add(code.font);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
    }
    if (width === 1440) expect([...seen].sort()).toEqual([12, 14]);
  });
}

test("explicit size choices override context without changing text or destinations", async ({
  page,
}) => {
  await page.goto("./docs/forms", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const code = page.locator("a.docs-inline-code-link > code").first();
  const text = await code.textContent();
  const href = await code.locator("..").getAttribute("href");
  for (const [size, pixels] of [
    ["compact", "12px"],
    ["regular", "14px"],
  ]) {
    await code.evaluate((node, size) => (node.dataset.inlineCodeSize = size), size);
    await expect(code).toHaveCSS("font-size", pixels);
    await expect(code).toHaveText(text!);
    await expect(code.locator("..")).toHaveAttribute("href", href!);
  }
});
