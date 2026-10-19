import { expect, test } from "@playwright/test";

for (const width of [320, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`inline references stay readable and navigate at ${width}px in ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/docs/getting-started");
      await page.evaluate((mode) => {
        document.documentElement.classList.toggle("dark", mode === "dark");
        document.documentElement.setAttribute("data-theme", "cursor-warm");
      }, theme);
      const paragraph = page.locator("main p").filter({ hasText: "are the individual pieces:" });
      await paragraph.scrollIntoViewIfNeeded();
      for (const name of ["Button", "Input", "Dialog", "Sidebar"]) {
        const link = paragraph.getByRole("link", { name, exact: true });
        await expect(link).toHaveAttribute("href", `/docs/${name.toLowerCase()}/installation`);
        await expect(link.locator('svg[aria-hidden="true"]')).toHaveCount(2);
        const geometry = await link.locator("code").evaluate((code) => {
          const bounds = code.getBoundingClientRect();
          return [...code.querySelectorAll("svg")].every((icon) => {
            const rect = icon.getBoundingClientRect();
            return rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1;
          });
        });
        expect(geometry).toBe(true);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
      ).toBe(true);
      await expect(page.locator("main a a, main code code, main pre a")).toHaveCount(0);
      await paragraph.getByRole("link", { name: "Button", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/docs\/button\/installation$/);
      await expect(page.locator("h1")).toContainText(/button/i);
    });
  }
}

test("component and collection hints expose source paths and underline the full code link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/docs/getting-started");
  const paragraph = page.locator("main p").filter({ hasText: "are the individual pieces:" });
  await paragraph.scrollIntoViewIfNeeded();
  for (const [label, path] of [
    ["Button", "@/components/kamod-ui/button"],
    ["Components", "packages/core/src/components"],
    ["Blocks", "packages/blocks/src"],
    ["Packages", "packages"],
  ]) {
    const link = paragraph.getByRole("link", { name: label, exact: true });
    const href = await link.getAttribute("href");
    await link.hover();
    const help = page.getByRole("dialog", { name: `${label} explained` });
    await expect(help.locator(".docs-code-explanation-path a")).toHaveText(path);
    await expect(help.locator("p").nth(1)).not.toBeEmpty();
    const underline = await link.locator("code").evaluate((code) => {
      const rule = getComputedStyle(code, "::after");
      const arrow = code.querySelector(".docs-reference-arrow")!;
      return {
        width: parseFloat(rule.width),
        edge: arrow.getBoundingClientRect().right - code.getBoundingClientRect().left,
        border: rule.borderBottomWidth,
        opacity: parseFloat(getComputedStyle(arrow).opacity),
      };
    });
    expect(underline.border).toBe("1px");
    expect(underline.width).toBeGreaterThanOrEqual(underline.edge);
    expect(underline.opacity).toBeGreaterThanOrEqual(0.9);
    await expect(link).toHaveAttribute("href", href!);
    await page.keyboard.press("Escape");
  }
});
