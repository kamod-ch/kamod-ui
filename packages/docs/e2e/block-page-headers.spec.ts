import { expect, type Page, test } from "@playwright/test";

/** Compare computed styles and vertical geometry rather than unrelated page content. */
async function headerMetrics(page: Page) {
  return page.locator(".blocks-page-header").evaluate((header) => {
    const title = header.querySelector("h1")!;
    const badge = header.querySelector('[data-slot="badge"]')!;
    const lead = header.querySelector(".blocks-hero-lead")!;
    const description = header.querySelector(".blocks-page-header-description")!;
    const breadcrumbs = header.querySelector('[data-slot="breadcrumb-list"]')!;
    const actions = header.querySelector(".blocks-page-header-links")!;
    const summary = header.querySelector(".blocks-page-header-summary")!;
    const count = header.querySelector(".blocks-overview-count")!;
    const separator = header.querySelector(".blocks-overview-summary-separator")!;
    const button = actions.querySelector('[data-slot="button"]')!;
    const rect = header.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const typography = (el: Element) => {
      const s = getComputedStyle(el);
      return [s.fontSize, s.lineHeight, s.fontWeight, s.letterSpacing];
    };
    return {
      top: rect.top + scrollY,
      titleTop: titleRect.top + scrollY,
      title: typography(title),
      badge: typography(badge),
      description: typography(lead),
      descriptionHeight: description.getBoundingClientRect().height,
      breadcrumbs: typography(breadcrumbs),
      breadcrumbHeight: breadcrumbs.getBoundingClientRect().height,
      breadcrumbLineHeight: parseFloat(getComputedStyle(breadcrumbs).lineHeight),
      button: [button.getBoundingClientRect().width, button.getBoundingClientRect().height],
      iconSize: button.querySelector("svg")!.getBoundingClientRect().width,
      overflow: document.documentElement.scrollWidth > innerWidth,
      badgeAboveTitle: badge.getBoundingClientRect().bottom <= titleRect.top,
      actionsFit: actions.getBoundingClientRect().right <= rect.right + 1,
      descriptionFits:
        lead.getBoundingClientRect().bottom <= description.getBoundingClientRect().bottom + 1,
      descriptionGap:
        summary.getBoundingClientRect().top - description.getBoundingClientRect().bottom,
      titleFits: titleRect.left >= rect.left - 1 && titleRect.right <= rect.right + 1,
      summaryFits: summary.scrollWidth <= summary.clientWidth + 1,
      actionCenters: [count, separator, actions].map((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top + bounds.height / 2;
      }),
    };
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`overview and detail headers share responsive typography and top spacing (${theme})`, async ({
    page,
  }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    for (const category of ["application-shell", "sidebar", "login", "signup"]) {
      const widths = [
        320, 375, 390, 414, 639, 640, 641, 767, 768, 769, 979, 980, 981, 1023, 1024, 1025, 1259,
        1260, 1261, 1439, 1440, 1441, 1679, 1680, 1681, 1920, 2560,
      ];
      const overview = new Map<number, Awaited<ReturnType<typeof headerMetrics>>>();
      await page.goto(`./blocks/${category}`);
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(() => document.fonts.ready);
      const destination = (await page
        .locator(".blocks-overview-card")
        .first()
        .getAttribute("href"))!;
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        overview.set(width, await headerMetrics(page));
      }
      await page.goto(destination);
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("aside.docs-sidebar")).toHaveCount(0);
      await expect(page.locator(".blocks-page-header-eyebrow")).toHaveText(
        "Built with Preact & Kamod UI",
      );
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const detail = await headerMetrics(page);
        const reference = overview.get(width)!;
        for (const key of [
          "title",
          "badge",
          "description",
          "breadcrumbs",
          "button",
          "iconSize",
        ] as const) {
          expect(detail[key], `${category}: ${key} at ${width}px`).toEqual(reference[key]);
        }
        expect(detail.top, `${category}: header top at ${width}px`).toBeCloseTo(reference.top, 0);
        expect(detail.titleTop, `${category}: title start at ${width}px`).toBeCloseTo(
          reference.titleTop,
          0,
        );
        if (category === "application-shell") {
          // The inline About link must remain reachable, even beyond four lines.
          expect(detail.descriptionHeight).toBeGreaterThanOrEqual(reference.descriptionHeight);
          await expect(page.locator(".blocks-hero-lead .blocks-shell-header-about")).toBeVisible();
        } else {
          expect(detail.descriptionHeight).toBeCloseTo(reference.descriptionHeight, 0);
        }
        expect(detail.overflow).toBe(false);
        expect(detail.actionsFit).toBe(true);
        for (const metrics of [reference, detail]) {
          expect(metrics.descriptionFits).toBe(true);
          expect(metrics.descriptionGap).toBeGreaterThanOrEqual(0);
          expect(metrics.titleFits).toBe(true);
          expect(metrics.summaryFits).toBe(true);
          for (const center of metrics.actionCenters.slice(0, 2)) {
            expect(center).toBeCloseTo(metrics.actionCenters[2], 0);
          }
        }
        expect(detail.breadcrumbHeight).toBeLessThanOrEqual(detail.breadcrumbLineHeight + 1);
        if (width < 640) expect(detail.badgeAboveTitle).toBe(true);
        const header = (await page.locator(".blocks-page-header").boundingBox())!;
        const showcase = (await page.locator("article.blocks-card").boundingBox())!;
        expect(header.x).toBeCloseTo(showcase.x, 0);
        expect(header.width).toBeCloseTo(showcase.width, 0);
        expect(showcase.y - header.y - header.height).toBeCloseTo(width >= 980 ? 20 : 12, 0);
      }
    }
  });
}

test("detail headers follow registry neighbours and expose the correct variant source", async ({
  page,
}) => {
  await page.goto("./blocks/login/login-01");
  const header = page.locator(".blocks-page-header");
  await expect(header.getByRole("heading", { level: 1 })).toHaveText("Login 1");
  await expect(header.getByRole("button", { name: "Previous variant unavailable" })).toBeDisabled();
  await header.getByRole("link", { name: "Next variant: login-02" }).click();
  await expect(page).toHaveURL(/\/blocks\/login\/login-02\/?$/);
  await expect(header.getByRole("heading", { level: 1 })).toHaveText("Login 2");
  await expect(header.getByRole("link", { name: "Previous variant: login-01" })).toHaveAttribute(
    "href",
    /\/blocks\/login\/login-01$/,
  );
  await expect(header.getByRole("link", { name: /View .* source on GitHub/ })).toHaveAttribute(
    "href",
    /packages\/blocks\/src\/login\/login-02$/,
  );
  await page.goto("./blocks/login/login-05");
  await expect(header.getByRole("button", { name: "Next variant unavailable" })).toBeDisabled();
});
