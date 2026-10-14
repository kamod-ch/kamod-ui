import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

for (const width of [320, 768, 1440]) {
  test(`color theme studies keep their palettes and fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/theming/installation#color-theme-presets");
    await page.waitForSelector("html.pp-ready");
    const gallery = page.locator(".theme-studies");
    await expect(gallery.locator(".theme-study")).toHaveCount(8);
    await expect(gallery.locator(".theme-study-preview")).toHaveCount(16);
    const readStudies = () =>
      gallery.locator(".theme-study-preview").evaluateAll((samples) =>
        samples.map((sample) => ({
          background: getComputedStyle(sample).backgroundColor,
          primary: getComputedStyle(sample.querySelector(".theme-study-action")!).backgroundColor,
          foreground: getComputedStyle(sample.querySelector(".theme-study-action")!).color,
          overflow: sample.scrollWidth > sample.clientWidth,
        })),
      );
    const initial = await readStudies();
    for (let i = 0; i < initial.length; i += 2)
      expect(initial[i].background).not.toBe(initial[i + 1].background);
    const useOcean = gallery.getByRole("button", { name: "Use Ocean theme on this page" });
    await useOcean.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "ocean");
    await expect(useOcean).toHaveAttribute("aria-pressed", "true");
    for (const scheme of ["light", "dark"] as const) {
      const trigger = page
        .getByRole("button", { name: "Choose color theme" })
        .filter({ visible: true });
      await trigger.click();
      const picker = page.getByRole("dialog", { name: "Find your Palette" });
      const switchMode = picker.getByRole("button", { name: `Switch to ${scheme} mode` });
      if (await switchMode.count()) await switchMode.click();
      await picker.getByRole("button", { name: "Close color theme picker" }).click();
      expect(await readStudies()).toEqual(initial);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await assertNoBlockingA11yViolations(page, `palette guide ${width}px ${scheme}`, {
        include: ".theme-studies",
      });
    }
    await page.reload();
    await page.waitForSelector("html.pp-ready");
    await expect(useOcean).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveClass(/dark/);
    if (width === 1440) {
      const entries = page
        .getByRole("navigation", { name: "On This Page" })
        .locator('a[href*="#color-theme-"]');
      await expect(entries).toHaveCount(9);
      for (const target of await entries.evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).hash.slice(1)),
      )) {
        await expect(page.locator(`[id="${target}"]`)).toHaveCount(1);
      }
    }
  });
}

test("the color picker opens the exact palette section instead of the repository", async ({
  page,
}) => {
  await page.goto("/docs/pagination/installation");
  await page.waitForSelector("html.pp-ready");
  await page.getByRole("button", { name: "Choose color theme" }).filter({ visible: true }).click();
  const picker = page.getByRole("dialog", { name: "Find your Palette" });
  await expect(picker.getByRole("link", { name: "Kamod UI Repository" })).toHaveCount(0);
  await picker.getByRole("link", { name: "Explore Color Themes" }).click();
  await expect(page).toHaveURL(/\/docs\/theming\/installation\/?#color-theme-presets$/);
  await expect(
    page.getByRole("heading", { name: "Color Theme Presets", exact: true }),
  ).toBeInViewport();
});
