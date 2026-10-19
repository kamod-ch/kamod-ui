import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1024, 1440]) {
  test(`component toolbar and preview link fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("./docs/button/installation");
    const showcase = page.locator(".component-example").first();
    await showcase.scrollIntoViewIfNeeded();
    await expect(showcase.frameLocator("iframe").getByRole("button").first()).toBeVisible();
    const intro = page.locator(".component-preview-intro").first();
    const link = intro.getByRole("link", { name: "Interactive Live Preview" });
    await expect(link).toHaveAttribute("href", `#${await showcase.getAttribute("id")}`);
    const layout = await showcase.evaluate((element) => {
      const box = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
      const views = box('[aria-label="Example view"]');
      const actions = box(".component-example-actions");
      const picker = box('[aria-label="Preview color theme"]');
      const label = element.querySelector(
        '[data-slot="tabs-trigger"] .blocks-showcase-control-label',
      )!;
      return {
        width: element.clientWidth,
        groupGap: picker.left - actions.right,
        centered: Math.abs(views.y + views.height / 2 - actions.y - actions.height / 2),
        labelsVisible: getComputedStyle(label).display !== "none",
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(layout.overflow).toBe(false);
    expect(layout.centered).toBeLessThan(1);
    expect(layout.groupGap).toBeLessThan(70);
    expect(layout.labelsVisible).toBe(layout.width >= 544);
    if (width >= 980) {
      const headingBox = (await link.boundingBox())!;
      const controlsBox = (await showcase
        .getByRole("tablist", { name: "Example view" })
        .boundingBox())!;
      expect(Math.abs(headingBox.x - controlsBox.x)).toBeLessThan(1);
    }
    const hint = intro.locator(".showcase-heading-description");
    const introWidth = await intro.evaluate(
      (element) =>
        element.clientWidth -
        parseFloat(getComputedStyle(element).paddingLeft) -
        parseFloat(getComputedStyle(element).paddingRight),
    );
    if (introWidth >= 512) await expect(hint).toBeVisible();
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${await showcase.getAttribute("id")}$`));
    await expect(link).toHaveCSS("text-decoration-line", "none");
  });
}
