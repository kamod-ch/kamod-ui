import { expect, type Locator, test } from "@playwright/test";

async function scroll(area: Locator, top: number) {
  await area.dispatchEvent("wheel");
  await area.evaluate((node, value) => {
    node.scrollTop = value;
    node.dispatchEvent(new Event("scroll"));
  }, top);
  await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(top);
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
    await scroll(area, 180);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(180);
    // A fresh request to the same document, including a section fragment, keeps its place.
    await page.goto(`./${path}#top`, { waitUntil: "domcontentloaded" });
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(180);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await page.setViewportSize({ width: 1440, height: 700 });
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(180);
    // No contents sidebar exists here, but this visit must still invalidate the old page.
    await page.goto("./blocks/sidebar", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(0);
    await scroll(area, 120);
    await page.goto("./blocks/theming", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expect
      .poll(() => page.locator(".docs-rightbar-contents").evaluate((node) => node.scrollTop))
      .toBe(0);
    await page.goto(`./${path}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("html.pp-ready");
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(0);
  });
}
