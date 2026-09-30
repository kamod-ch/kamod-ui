import { expect, test } from "@playwright/test";

const routes = [
  "",
  "blocks",
  "blocks/sidebar",
  "blocks/application-shell",
  "blocks/login",
  "blocks/signup",
  "blocks/getting-started",
  "blocks/styles",
  "blocks/theming",
  "docs/components",
  "docs/button/usage",
  "docs/forms",
  "docs/packages",
  "blocks/application-shell/application-shell-1",
  "blocks/sidebar/sidebar-05",
  "blocks/login/login-01",
  "blocks/signup/signup-01",
  ...["hooks", "i18n", "icons", "signals", "state"].map(
    (name) => `docs/${name}-package/installation`,
  ),
];

test("page containers and sidebar tracks share the navbar geometry", async ({ page }) => {
  test.setTimeout(180_000);
  const layouts = new Map<number, { left: number; right: number; gap: number; top: number }>();
  for (const route of routes) {
    await page.goto(`./${route}`);
    await expect(page.locator(".docs-layout")).toBeVisible();
    for (const width of [
      320, 375, 390, 414, 479, 480, 481, 639, 640, 641, 767, 768, 769, 979, 980, 981, 1023, 1024,
      1025, 1259, 1260, 1261, 1439, 1440, 1441, 1679, 1680, 1681, 1920, 2560,
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      const geometry = await page.evaluate(() => {
        const layout = document.querySelector(".docs-layout")!;
        const navbar = document.querySelector(".docs-topbar-inner")!;
        const style = getComputedStyle(layout);
        const box = layout.getBoundingClientRect();
        const navBox = navbar.getBoundingClientRect();
        const navStyle = getComputedStyle(navbar);
        const sidebarWidth = (selector: string) =>
          document.querySelector(selector)?.getBoundingClientRect().width ?? 0;
        const detail = document.querySelector(".blocks-detail-documentation");
        return {
          edges: [box.left, box.right],
          navEdges: [navBox.left, navBox.right],
          padding: [parseFloat(style.paddingLeft), parseFloat(style.paddingRight)],
          navPadding: [parseFloat(navStyle.paddingLeft), parseFloat(navStyle.paddingRight)],
          left: sidebarWidth("aside.docs-sidebar"),
          right: sidebarWidth("aside.docs-rightbar"),
          detailRight: sidebarWidth(".blocks-detail-documentation > .blocks-doc-toc"),
          gap: parseFloat(style.columnGap),
          detailGap: detail ? parseFloat(getComputedStyle(detail).columnGap) : null,
          // Resizing can trigger browser scroll anchoring; compare document coordinates.
          top: box.top + scrollY + parseFloat(style.paddingTop),
          fits: document.documentElement.scrollWidth <= innerWidth,
        };
      });
      expect(geometry.edges, `${route} at ${width}px`).toEqual(geometry.navEdges);
      expect(geometry.padding).toEqual(geometry.navPadding);
      expect(geometry.fits).toBe(true);
      const baseline = layouts.get(width);
      if (baseline) {
        expect(geometry.top).toBeCloseTo(baseline.top, 0);
        expect(geometry.gap).toBe(baseline.gap);
        if (geometry.left && baseline.left) expect(geometry.left).toBe(baseline.left);
        if (geometry.right && baseline.right) expect(geometry.right).toBe(baseline.right);
        if (geometry.detailRight) {
          expect(geometry.detailRight).toBe(baseline.right);
          expect(geometry.detailGap).toBe(baseline.gap);
        }
      }
      if (route === "blocks") layouts.set(width, geometry);
      if (!route) await expect(page.locator("aside.docs-rightbar")).toHaveCount(0);
    }
  }
});
