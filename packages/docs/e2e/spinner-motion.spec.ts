import { expect, test } from "@playwright/test";

for (const width of [320, 1440]) {
  test(`spinner uses HTML rotation and respects reduced motion at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./docs/spinner/installation", { waitUntil: "domcontentloaded" });
    const example = page.locator(".component-example").nth(1);
    await example.locator("iframe").scrollIntoViewIfNeeded();
    const frame = example.locator("iframe").contentFrame();
    const spinners = frame.locator('[data-slot="spinner"]');
    await expect(spinners).toHaveCount(5);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const [index, size] of [12, 16, 24, 32, 40].entries()) {
      const spinner = spinners.nth(index);
      await expect(spinner).toHaveCSS("width", `${size}px`);
      await expect(spinner).toHaveCSS("height", `${size}px`);
      await expect(spinner.locator(":scope > span")).toHaveCSS("animation-name", "spin");
      await expect(spinner.locator("svg")).toHaveCSS("animation-name", "none");
      await expect(spinner.locator("svg")).toHaveCSS("transform", "none");
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const spinner of await spinners.all()) {
      await expect(spinner.locator(":scope > span")).toHaveCSS("animation-name", "none");
      await expect(spinner.locator(":scope > span")).toHaveCSS("transform", "none");
    }
  });
}
