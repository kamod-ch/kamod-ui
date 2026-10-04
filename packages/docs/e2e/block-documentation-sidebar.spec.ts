import { expect, test } from "@playwright/test";

for (const [category, id] of [
  ["login", "login-01"],
  ["signup", "signup-01"],
  ["sidebar", "sidebar-01"],
  ["application-shell", "application-shell-1"],
]) {
  test(`${id} starts its shared navigation below the showcase`, async ({ page }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.goto(`./blocks/${category}/${id}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const sidebar = page.locator(".blocks-doc-guide > .docs-sidebar");
    const showcase = page.locator(".blocks-showcase").first();
    for (const width of [320, 979, 980, 1259, 1260, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      if (width < 980) {
        await expect(sidebar).toBeHidden();
        await expect(
          page.getByRole("button", { name: "Open navigation menu", exact: true }),
        ).toBeVisible();
      } else {
        await expect(sidebar).toBeVisible();
        await expect(sidebar.locator('[data-navigation-group="blocks"]')).toHaveAttribute(
          "data-current",
          "true",
        );
        await expect(sidebar.locator(`a[href$="/blocks/${category}"]`)).toHaveAttribute(
          "aria-current",
          "location",
        );
        const nav = await sidebar.boundingBox();
        const preview = await showcase.boundingBox();
        const content = await page.locator(".blocks-detail-documentation").boundingBox();
        expect(nav!.y).toBeGreaterThan(preview!.y + preview!.height);
        expect(Math.abs(nav!.y - content!.y)).toBeLessThan(2);
        expect(content!.x).toBeGreaterThanOrEqual(nav!.x + nav!.width);
        expect(preview!.width).toBeGreaterThan(content!.width);
      }
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true);
    }
    await sidebar.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "instant" }));
    await expect
      .poll(() => sidebar.evaluate((el) => Math.round(el.getBoundingClientRect().top)))
      .toBe(84);
    await expect(
      sidebar.getByRole("link", { name: "Kamod UI on GitHub (opens in a new tab)", exact: true }),
    ).toBeVisible();
  });
}
