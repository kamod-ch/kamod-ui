import { expect, type Locator, type Page, test } from "@playwright/test";

async function scrollTo(area: Locator, top: number) {
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
  await expect(sidebar.getByRole("button", { name: /^Components Documentation/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await scrollTo(sidebar, 350);
  await expectSaved(page, "desktop", 350);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectOffset(sidebar, 350);
  await page.goto("./blocks/styles", { waitUntil: "domcontentloaded" });
  await expectOffset(sidebar, 350);
  for (const name of [/^Components Documentation/, /^Blocks Layout/]) {
    await expect(sidebar.getByRole("button", { name })).toHaveAttribute("aria-expanded", "true");
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
  await expectOffset(mobile, 220);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectOffset(sidebar, 350);
  await expectSaved(page, "desktop", 350);
});
