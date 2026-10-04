import { expect, test } from "@playwright/test";

for (const route of [
  "blocks/application-shell/application-shell-1",
  "docs/accordion/installation",
  "docs/formisch/installation",
  "blocks/application-shell",
  "docs/hooks-package/installation",
]) {
  test(`${route}: shared paths preserve both ends at narrow widths`, async ({ page }) => {
    await page.goto(`./${route}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const code = page
      .locator(".blocks-showcase")
      .first()
      .getByRole("tab", { name: "Code", exact: true });
    if (await code.count()) await code.click();
    await expect(page.locator(".path-display").first()).toBeVisible();
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const paths = await page.locator(".path-display").evaluateAll((nodes) =>
        nodes
          .filter((n) => n.getClientRects().length)
          .map((n) => ({
            text: n.textContent,
            full: n.getAttribute("title"),
            width: n.clientWidth,
            scroll: n.scrollWidth,
            ends: [...n.querySelectorAll('[data-path-part="root"],[data-path-part="end"]')].map(
              (end) => ({
                width: end.clientWidth,
                scroll: end.scrollWidth,
                overflow: getComputedStyle(end).textOverflow,
              }),
            ),
          })),
      );
      for (const path of paths) {
        expect(path.text).toBe(path.full);
        expect(path.scroll).toBeLessThanOrEqual(path.width + 1);
        for (const end of path.ends) {
          expect(end.scroll).toBeLessThanOrEqual(end.width + 1);
          expect(end.overflow).not.toBe("ellipsis");
        }
      }
    }
  });
}
