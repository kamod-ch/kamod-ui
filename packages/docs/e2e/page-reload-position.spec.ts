import { expect, test } from "@playwright/test";

for (const path of [
  "docs/hooks-package/installation",
  "blocks/styles",
  "docs/accordion/installation",
]) {
  test(`${path}: reload restores reading position and active contents link`, async ({ page }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`./${path}`);
    await page.waitForSelector("html.pp-ready");
    await page.evaluate(() => window.scrollTo({ top: 1700, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => history.state?.ppScrollY)).toBe(1700);
    const active = page.locator('.blocks-doc-toc a[aria-current="location"]');
    await expect(active).not.toHaveAttribute("href", /#(page-title|top)$/);
    const href = await active.getAttribute("href");
    const contents = page.locator(".docs-rightbar-contents");
    await contents.dispatchEvent("wheel");
    await contents.evaluate((node) => {
      node.scrollTop = 120;
      node.dispatchEvent(new Event("scroll"));
    });
    const sidebarTop = await contents.evaluate((node) => node.scrollTop);
    await page.reload();
    await page.waitForSelector("html.pp-ready");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(1700);
    await expect(active).toHaveAttribute("href", href!);
    await expect.poll(() => contents.evaluate((node) => node.scrollTop)).toBe(sidebarTop);
    // A user's next scroll must win over delayed layout restoration.
    await page.mouse.move(700, 500);
    await page.mouse.wheel(0, 250);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1700);
    // New navigation must still open normally, without inheriting the old reading position.
    await page.goto("./blocks/getting-started");
    await page.waitForSelector("html.pp-ready");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  });
}

test("mobile reload keeps the reading position even with an older hash in the URL", async ({
  page,
}) => {
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./blocks/styles#top");
  await page.waitForSelector("html.pp-ready");
  await page.evaluate(() => window.scrollTo({ top: 1900, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => history.state?.ppScrollY)).toBe(1900);
  await page.reload();
  await page.waitForSelector("html.pp-ready");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(1900);
});

for (const path of ["docs/accordion/usage", "blocks/sidebar/sidebar-01"]) {
  test(`${path}: reload takes precedence over the route's initial section jump`, async ({
    page,
  }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`./${path}`);
    await page.waitForSelector("html.pp-ready");
    await page.evaluate(() => window.scrollTo({ top: 4000, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => history.state?.ppScrollY)).toBe(4000);
    const active = page.locator('.blocks-doc-toc a[aria-current="location"]');
    await expect(active).not.toHaveAttribute("href", /#(page-title|top)$/);
    const href = await active.getAttribute("href");
    await page.reload();
    await page.waitForSelector("html.pp-ready");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(4000);
    await expect(active).toHaveAttribute("href", href!);
  });
}
