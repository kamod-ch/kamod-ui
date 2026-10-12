import { expect, type Locator, test } from "@playwright/test";

async function scroll(area: Locator, top: number) {
  await area.dispatchEvent("wheel");
  await area.evaluate((node, value) => {
    node.scrollTop = value;
    node.dispatchEvent(new Event("scroll"));
  }, top);
  await expect
    .poll(() => area.evaluate((node, target) => Math.abs(node.scrollTop - target), top))
    .toBeLessThan(1);
}

async function expectActiveVisible(area: Locator) {
  const active = area.locator('a[aria-current="location"]');
  await expect(active).toBeVisible();
  await expect
    .poll(() =>
      active.evaluate((link) => {
        const pane =
          link.closest<HTMLElement>(".docs-rightbar-contents") ?? link.closest<HTMLElement>("nav")!;
        const bounds = pane.getBoundingClientRect();
        const item = link.getBoundingClientRect();
        // Block guides place their sidebar below the showcase; revealing a pane must not move the article.
        const offscreen = bounds.top >= innerHeight || bounds.bottom <= 0;
        const top = offscreen
          ? bounds.top + pane.clientTop
          : Math.max(0, bounds.top + pane.clientTop);
        const bottom = bounds.top + pane.clientTop + pane.clientHeight;
        return (
          item.top >= top - 1 &&
          item.bottom <= (offscreen ? bottom : Math.min(innerHeight, bottom)) + 1
        );
      }),
    )
    .toBe(true);
}

async function scrollKeepingActiveVisible(area: Locator) {
  const top = await area.evaluate((node) => {
    const active = node.querySelector<HTMLAnchorElement>('a[aria-current="location"]')!;
    return Math.max(
      0,
      Math.min(
        node.scrollHeight - node.clientHeight,
        Math.round(
          node.scrollTop +
            active.getBoundingClientRect().top -
            node.getBoundingClientRect().top -
            node.clientHeight / 2,
        ),
      ),
    );
  });
  await scroll(area, top);
  await expectActiveVisible(area);
  return top;
}

for (const { path, selector } of [
  { path: "docs/hooks-package/installation", selector: ".docs-rightbar-contents" },
  {
    path: "blocks/sidebar/sidebar-01",
    selector: ".blocks-detail-documentation .blocks-doc-toc nav",
  },
]) {
  test(`${path}: keeps only the current page's right sidebar position`, async ({ page }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.setViewportSize({ width: 1440, height: 700 });
    await page.goto(`./${path}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    const area = page.locator(selector);
    const links = area.locator('a[href^="#"]');
    const middle = links.nth(Math.floor((await links.count()) / 2));
    const href = (await middle.getAttribute("href"))!;
    await page
      .locator(`[id="${decodeURIComponent(href.slice(1))}"]`)
      .evaluate((node) => node.scrollIntoView({ block: "start", behavior: "instant" }));
    await expect(area.locator('a[aria-current="location"]')).toHaveAttribute("href", href);
    const top = await scrollKeepingActiveVisible(area);
    expect(top).toBeGreaterThan(0);
    // The router saves article position after a scroll burst; reload must use that settled entry.
    await expect.poll(() => page.evaluate(() => history.state?.ppScrollY === scrollY)).toBe(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expect(area.locator('a[aria-current="location"]')).toHaveAttribute("href", href);
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(top);
    // A fresh document visit reveals its new active section instead of a hidden old destination.
    await page.goto(`./${path}`, { waitUntil: "domcontentloaded" });
    await expectActiveVisible(area);
    const revisitedTop = await area.evaluate((node) => node.scrollTop);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await page.setViewportSize({ width: 1440, height: 700 });
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(revisitedTop);
    // No contents sidebar exists here, but this visit must still invalidate the old page.
    await page.goto("./blocks/sidebar", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expectActiveVisible(area);
    await scrollKeepingActiveVisible(area);
    await page.goto("./blocks/theming", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expect
      .poll(() => page.locator(".docs-rightbar-contents").evaluate((node) => node.scrollTop))
      .toBe(0);
    await page.goto(`./${path}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expectActiveVisible(area);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });

  test(`${path}: loading and reloading reveal an offscreen active section`, async ({ page }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.setViewportSize({ width: 1440, height: 700 });
    await page.goto(`./${path}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const area = page.locator(selector);
    const links = area.locator('a[href^="#"]');
    const destination = links.nth(Math.floor((await links.count()) * 0.8));
    const href = (await destination.getAttribute("href"))!;
    await page.goto(`./${path}${href}`);
    await expect(area.locator('a[aria-current="location"]')).toHaveAttribute("href", href);
    await expectActiveVisible(area);
    await scroll(area, 0);
    const articleTop = await page.evaluate(() => scrollY);
    expect(articleTop).toBeGreaterThan(0);
    await expect.poll(() => page.evaluate(() => history.state?.ppScrollY)).toBe(articleTop);
    await page.reload();
    await expect(area.locator('a[aria-current="location"]')).toHaveAttribute("href", href);
    await expectActiveVisible(area);
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(articleTop);

    const bottom = await area.evaluate((node) => node.scrollHeight - node.clientHeight);
    await scroll(area, bottom);
    await page.goto(`./${path}`);
    await expectActiveVisible(area);
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBeLessThan(bottom);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });
}
