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
  test(`prose inline code follows its surrounding text with one optical reduction at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      ...routes,
      "docs/cn/installation",
      "docs/getting-started",
      "docs/ecosystem",
    ]) {
      await page.goto(`./${route}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const result = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("main code")]
          .filter(
            (code) =>
              !code.closest(
                "pre, h1, h2, h3, h4, h5, h6, .docs-code-name, .code-reference-help, .docs-code-toolbar, .docs-import-label, .docs-code-file-path, .docs-code-explanation, [contenteditable], [data-inline-code-size]",
              ) && code.getClientRects().length > 0,
          )
          .map((code) => ({
            text: code.textContent?.slice(0, 60),
            font: parseFloat(getComputedStyle(code).fontSize),
            parent: parseFloat(getComputedStyle(code.parentElement!).fontSize),
          })),
      );
      expect(result.length, route).toBeGreaterThan(0);
      for (const code of result)
        expect(code.font, `${route}: ${code.text}`).toBeCloseTo(code.parent * 0.94, 2);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
    }
  });
}

test("explicit size choices work in body prose without changing text or destinations", async ({
  page,
}) => {
  await page.goto("./docs/forms", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const code = page.locator(".block-guide-section a.docs-inline-code-link > code").first();
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
