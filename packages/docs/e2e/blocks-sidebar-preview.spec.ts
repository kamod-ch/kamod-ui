import { expect, test } from "@playwright/test";

test("sidebar variants fit their inline preview containers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  for (const id of [
    "sidebar-04",
    "sidebar-07",
    "sidebar-08",
    "sidebar-14",
    "sidebar-15",
    "sidebar-16",
  ]) {
    await test.step(id, async () => {
      await page.goto(`./blocks/sidebar/${id}`);
      const frame = page.locator(".blocks-preview-frame");
      const container = frame.locator('[data-slot="sidebar-container"]').first();
      await expect(container).toBeVisible();
      const bounds = await frame.boundingBox();
      const sidebar = await container.boundingBox();
      expect(sidebar!.x).toBeGreaterThanOrEqual(bounds!.x);
      expect(sidebar!.y).toBeGreaterThanOrEqual(bounds!.y);
      expect(sidebar!.x + sidebar!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width);
      expect(sidebar!.y + sidebar!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height);
    });
  }
});

// A DOM-visible button can still be clipped out of WebKit's paint/hit-test region.
// Verify the actual pointer target after outer-page scrolling before clicking it.
for (const block of [
  { route: "application-shell/application-shell-1", trigger: "Playground" },
  { route: "sidebar/sidebar-01", trigger: "Documentation" },
]) {
  test(`${block.route} remains usable after page and sidebar scrolling`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto(`./blocks/${block.route}`);
    const host = page.locator(".blocks-preview-host");
    const trigger = host.getByRole("button", { name: block.trigger }).first();
    await expect(trigger).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 160));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(160);
    await expect
      .poll(() =>
        trigger.evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return node.contains(
            document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2),
          );
        }),
      )
      .toBe(true);
    const wasExpanded = (await trigger.getAttribute("aria-expanded")) === "true";
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", String(!wasExpanded));
    await page.keyboard.press("Escape");
    const content = host.locator('[data-slot="sidebar-content"]').first();
    const lastLink = content.getByRole("link").last();
    await lastLink.scrollIntoViewIfNeeded();
    await expect(lastLink).toBeInViewport();
    await lastLink.click({ trial: true });
    await content.evaluate((node) => {
      node.scrollTop = 0;
    });
    await page.screenshot({ path: testInfo.outputPath("sidebar-after-scrolling.png") });
  });
}
