import { expect, type Locator, type Page, test } from "@playwright/test";

async function scrollTo(area: Locator, top: number) {
  // Synthetic dispatch bypasses actionability; wait until the initially hidden app is ready.
  await expect(area.page().locator("html")).toHaveClass(/pp-ready/);
  // Model wheel intent before setting a deterministic offset; restoration must yield to the user.
  await area.dispatchEvent("wheel");
  await area.evaluate((node, value) => {
    node.scrollTop = value;
    node.dispatchEvent(new Event("scroll"));
  }, top);
  await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(top);
}

async function expectSaved(page: Page, mode: string, top: number) {
  await expect
    .poll(() =>
      page.evaluate(
        (presentation) =>
          JSON.parse(sessionStorage.getItem(`kamod:navigation:/:${presentation}`) ?? "{}").top,
        mode,
      ),
    )
    .toBe(top);
}

async function expectOffset(area: Locator, top: number) {
  await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(top);
}

test("desktop navigation retains its place across reloads and different page groups", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./docs/components", { waitUntil: "domcontentloaded" });
  const sidebar = page.locator(".docs-sidebar-scroll");
  await expect(
    sidebar.getByRole("button", { name: /^Components UI Building Blocks/ }),
  ).toHaveAttribute("aria-expanded", "true");
  await scrollTo(sidebar, 350);
  await expectSaved(page, "desktop", 350);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectOffset(sidebar, 350);
  await page.goto("./blocks/styles", { waitUntil: "domcontentloaded" });
  await expectOffset(sidebar, 350);
  for (const id of ["components", "blocks"]) {
    await expect(sidebar.locator(`[data-navigation-group="${id}"]`)).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  }
  const groups = sidebar.locator(".site-navigation-group");
  await expect(groups.first()).toHaveCSS("margin-top", "0px");
  await expect(groups.nth(1)).toHaveCSS("margin-top", "10px");
});

test("responsive navigation remembers reopening and reloads without overwriting desktop position", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./docs/components", { waitUntil: "domcontentloaded" });
  const sidebar = page.locator(".docs-sidebar-scroll");
  await scrollTo(sidebar, 350);
  await expectSaved(page, "desktop", 350);
  await page.setViewportSize({ width: 390, height: 844 });
  const open = page.getByRole("button", { name: "Open navigation menu" });
  const close = page.getByRole("button", { name: "Close navigation menu" });
  const mobile = page.locator(".site-navigation-body");
  await open.click();
  await scrollTo(mobile, 220);
  await expectSaved(page, "mobile", 220);
  await close.click();
  await open.click();
  await expectOffset(mobile, 220);
  await page.reload({ waitUntil: "domcontentloaded" });
  await open.click();
  await expectOffset(mobile, 220);
  await close.click();
  await page.goto("./docs/button/installation", { waitUntil: "domcontentloaded" });
  await open.click();
  await expectAligned(mobile, "Button");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectOffset(sidebar, 350);
  await expectSaved(page, "desktop", 350);
});

async function expectAligned(area: Locator, name: string) {
  const link = area
    .locator(".site-navigation-link[aria-current]")
    .filter({ hasText: name })
    .first();
  await expect(link).toBeVisible();
  await expect
    .poll(async () => {
      const target = (await link.boundingBox())!;
      const container = (await area.boundingBox())!;
      const padding = await area.evaluate((node) => parseFloat(getComputedStyle(node).paddingTop));
      return Math.abs(target.y - container.y - padding);
    })
    .toBeLessThan(2);
}

test("mobile destinations reopen their group, align at the top and keep subsequent manual scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./docs/components");
  const open = page.getByRole("button", { name: "Open navigation menu" });
  const close = page.getByRole("button", { name: "Close navigation menu" });
  const menu = page.locator(".site-navigation-body");
  await open.click();
  await menu.getByRole("button", { name: /^Components UI Building Blocks/ }).click();
  await close.click();
  await page.goto("./docs/pagination/installation");
  await open.click();
  await expect(
    menu.getByRole("button", { name: /^Components UI Building Blocks/ }),
  ).toHaveAttribute("aria-expanded", "true");
  await expectAligned(menu, "Pagination");
  await scrollTo(menu, 100);
  await close.click();
  await open.click();
  await expectOffset(menu, 100);
  // Following the active link again is an explicit request to return to that destination.
  await menu.getByRole("link", { name: "Pagination", exact: true }).click();
  await open.click();
  await expectAligned(menu, "Pagination");
  await close.click();
  await page.goto("./docs/state-package/installation");
  await open.click();
  await expectAligned(menu, "State");
  await scrollTo(menu, 100);
  await page.reload();
  await open.click();
  await expectOffset(menu, 100);
});
