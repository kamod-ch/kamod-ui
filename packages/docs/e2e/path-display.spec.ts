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
    const originalPaths = await page.locator(".path-display").evaluateAll((nodes) =>
      nodes.map((node) => {
        const reference = node.closest("[data-code-module]");
        // Source metadata keeps the full path even when its middle is visually shortened.
        const source =
          reference && !reference.hasAttribute("data-code-reference")
            ? (reference.getAttribute("data-code-file") ??
              reference.getAttribute("data-code-module"))
            : null;
        return node.getAttribute("title") ?? source ?? node.textContent;
      }),
    );
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const paths = await page.locator(".path-display").evaluateAll(
        (nodes, originals) =>
          nodes
            .map((n, index) => ({
              visible: n.getClientRects().length > 0,
              text: n.textContent,
              full: originals[index],
              title: n.getAttribute("title"),
              width: n.clientWidth,
              scroll: n.scrollWidth,
              ends: [...n.querySelectorAll('[data-path-part="root"],[data-path-part="end"]')].map(
                (end) => ({
                  width: end.clientWidth,
                  scroll: end.scrollWidth,
                }),
              ),
            }))
            .filter((path) => path.visible),
        originalPaths,
      );
      for (const path of paths) {
        expect(path.text).toBe(path.full);
        if (path.title !== null) expect(path.title).toBe(path.full);
        expect(path.scroll).toBeLessThanOrEqual(path.width + 1);
        for (const end of path.ends) {
          expect(end.scroll).toBeLessThanOrEqual(end.width + 1);
          expect(end.width).toBeGreaterThan(0);
        }
      }
    }
  });
}
