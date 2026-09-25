import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const category = "./blocks/application-shell";
const detail = `${category}/application-shell-1`;
const preview = `${detail}/preview`;

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => {
    throw error;
  });
});

test("navigates category, overview card, detail and back", async ({ page }) => {
  await page.goto("./blocks/sidebar");
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("aside.docs-sidebar")
    .getByRole("link", { name: "Application Shell", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Application Shells for Your Workspace", exact: true }),
  ).toBeVisible();
  await expect(page.locator("article.blocks-card")).toHaveCount(0);
  await page.locator("a.blocks-overview-card").filter({ hasText: "application-shell-01" }).click();
  await expect(
    page.getByRole("heading", { name: "application-shell-01", exact: true }),
  ).toBeVisible();
  await expect(page.locator("aside.docs-sidebar")).toHaveCount(0);
  await expect(page.locator(".blocks-preview-host")).toContainText("Overview");
  await expect(page.getByRole("heading", { name: "Props and data" })).toBeVisible();
  await page.getByRole("link", { name: "All application shell blocks", exact: true }).click();
  await expect(page.locator("a.blocks-overview-card")).toHaveCount(1);
});

test("shell routes generate canonical metadata with a single deployment prefix", async ({
  page,
  baseURL,
}) => {
  for (const route of [category, detail, preview]) {
    await page.goto(route);
    const pathname = new URL(`${route}/`, baseURL).pathname;
    const canonical = `https://kamod-ch.github.io${pathname}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
  }
});

test("documentation header exposes breadcrumbs, repository links and disabled variant boundaries", async ({
  page,
}) => {
  await page.goto(detail);
  const header = page.locator(".blocks-shell-header");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Application Shell 1 — Sidebar shell with breadcrumbs",
  );
  await expect(header.locator('[data-slot="badge"]')).toHaveText("Layout block");
  await expect(header.locator('[data-slot="badge"]')).toHaveAttribute("data-variant", "secondary");
  for (const direction of ["Previous", "Next"]) {
    const control = header.getByRole("button", { name: `${direction} variant unavailable` });
    await expect(control).toBeDisabled();
    await expect(control).not.toHaveAttribute("href");
  }
  const breadcrumb = header.getByRole("navigation", { name: "Block breadcrumb", exact: true });
  await expect(breadcrumb.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
    "href",
    /\/$/,
  );
  await expect(breadcrumb.getByRole("link", { name: "Blocks", exact: true })).toHaveAttribute(
    "href",
    /\/blocks\/sidebar$/,
  );
  await expect(
    breadcrumb.getByRole("link", { name: "Application Shell", exact: true }),
  ).toHaveAttribute("href", /\/blocks\/application-shell$/);
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText("application-shell-01");

  const report = header.getByRole("link", { name: /Report a bug/ });
  const reportUrl = new URL((await report.getAttribute("href"))!);
  expect(`${reportUrl.origin}${reportUrl.pathname}`).toBe(
    "https://github.com/kamod-ch/kamod-ui/issues/new",
  );
  expect(reportUrl.searchParams.get("title")).toContain("application-shell-01");
  expect(reportUrl.searchParams.get("body")).toContain("Steps to reproduce");
  const source = header.getByRole("link", { name: /View .* source on GitHub/ });
  await expect(source).toHaveAttribute(
    "href",
    "https://github.com/kamod-ch/kamod-ui/tree/main/packages/blocks/src/application-shell/application-shell-1",
  );
  for (const link of [report, source]) await expect(link).toHaveAttribute("target", "_blank");

  // Disabled neighbours stay out of the keyboard order; the repository links remain reachable.
  await breadcrumb.getByRole("link", { name: "Application Shell", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(report).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(source).toBeFocused();
  const overview = page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "Overview", exact: true });
  await overview.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#top$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(overview).toHaveAttribute("aria-current", "location");

  // Both links return above the backlink, even when the URL already ends in #top.
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const titleLink = page.getByRole("heading", { level: 1 }).getByRole("link");
    await titleLink.focus();
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(
      header.getByRole("link", { name: "All application shell blocks" }),
    ).toBeInViewport();
  }

  await page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", {
      name: "Usage",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/#application-shell-usage$/);
  await page.goBack();
  await expect(page).toHaveURL(/#top$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.reload();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await breadcrumb.getByRole("link", { name: "Blocks", exact: true }).click();
  await expect(page).toHaveURL(/\/blocks\/sidebar\/?$/);
  await expect(page.locator("a.blocks-overview-card").first()).toBeVisible();
});

test("loads detail directly, displays sources and switches preview viewports", async ({ page }) => {
  await page.goto(detail);
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(page.locator(".blocks-code-pane")).toContainText("SidebarProvider");
  await page.getByRole("button", { name: "types.ts", exact: true }).click();
  await expect(page.locator(".blocks-code-pane")).toContainText("ApplicationShell1Props");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const panel = page.locator(".blocks-preview-panel");
  for (const viewport of ["Mobile", "Tablet"]) {
    await panel.getByRole("button", { name: `${viewport} view` }).click();
    await expect(panel.locator("iframe")).toHaveAttribute(
      "src",
      /\/blocks\/application-shell\/application-shell-1\/preview$/,
    );
    await expect(panel.frameLocator("iframe").getByText("Overview")).toBeVisible();
  }
  await panel.getByRole("button", { name: "Desktop view" }).click();
  await expect(panel.locator("iframe")).toHaveCount(0);
  // The embedded sidebar must fit the preview, including its footer.
  const frameBox = await panel.locator(".blocks-preview-frame").boundingBox();
  const userBox = await panel
    .getByRole("button", { name: "Open account menu for Alex Morgan" })
    .boundingBox();
  expect(userBox!.y + userBox!.height).toBeLessThanOrEqual(frameBox!.y + frameBox!.height);
});

test("documentation contents support keyboard links, history and scroll tracking", async ({
  page,
}) => {
  await page.goto(detail);
  const contents = page.getByRole("navigation", { name: "On this page" });
  const dependencies = contents.getByRole("link", { name: "2. Install missing dependencies" });
  await dependencies.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#application-shell-dependencies$/);
  await expect(page.locator("#application-shell-dependencies")).toBeFocused();
  await expect(dependencies).toHaveAttribute("aria-current", "location");
  const topbar = await page.locator(".docs-topbar").boundingBox();
  const heading = await page.locator("#application-shell-dependencies").boundingBox();
  expect(heading!.y).toBeGreaterThan(topbar!.y + topbar!.height);

  await contents.getByRole("link", { name: "Usage", exact: true }).click();
  await expect(page).toHaveURL(/#application-shell-usage$/);
  await page.goBack();
  await expect(page).toHaveURL(/#application-shell-dependencies$/);
  await expect(dependencies).toHaveAttribute("aria-current", "location");
  await page.goForward();
  await expect(page).toHaveURL(/#application-shell-usage$/);
  await expect(contents.getByRole("link", { name: "Usage", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );

  await page.locator("#application-shell-responsive").evaluate((node) => node.scrollIntoView());
  await expect(
    contents.getByRole("link", { name: "Responsive behavior and state" }),
  ).toHaveAttribute("aria-current", "location");
  const sticky = await contents.boundingBox();
  expect(sticky!.y).toBeGreaterThanOrEqual(topbar!.height);
  expect(sticky!.y).toBeLessThan(120);

  const finalSection = contents.getByRole("link", {
    name: "Design reference",
    exact: true,
  });
  await finalSection.click();
  await expect(finalSection).toHaveAttribute("aria-current", "location");

  await contents.getByRole("link", { name: "application-shell-01 Showcase" }).click();
  await expect(page).toHaveURL(/#application-shell-1$/);
  await expect(page.getByRole("article", { name: "application-shell-01 showcase" })).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "application-shell-01", exact: true }),
  ).toBeInViewport();
});

test("documentation sections can be opened directly by URL", async ({ page }) => {
  await page.goto(`${detail}#application-shell-props`);
  await expect(page.getByRole("heading", { name: "Props and data" })).toBeInViewport();
  await expect(
    page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("link", { name: "Props and data" }),
  ).toHaveAttribute("aria-current", "location");
});

test("documentation contents remain below the site bar near the end of short windows", async ({
  page,
}) => {
  for (const height of [500, 375]) {
    await page.setViewportSize({ width: 1440, height });
    await page.goto(detail);
    const contents = page.getByRole("navigation", { name: "On this page" });
    await contents.getByRole("link", { name: "Design reference", exact: true }).click();
    await expect(page.locator("#application-shell-reference")).toBeInViewport();
    const topbar = await page.locator(".docs-topbar").boundingBox();
    const sidebar = await contents.boundingBox();
    expect(sidebar!.y).toBeGreaterThanOrEqual(topbar!.y + topbar!.height);
    expect(sidebar!.y + sidebar!.height).toBeLessThanOrEqual(height);
  }
});

for (const width of [320, 640, 768, 979, 980, 1024, 1260, 1440]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`documentation ${width}px ${scheme} layout`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
      await page.goto(detail);
      const header = page.locator(".blocks-shell-header");
      await expect(header).toBeVisible();
      const headerBox = await header.boundingBox();
      const showcaseBox = await page.locator("article.blocks-card").boundingBox();
      expect(showcaseBox!.y).toBeGreaterThan(headerBox!.y + headerBox!.height);
      // Only show the permalink when the gutter fits it without indenting the title.
      const titleLink = header.getByRole("heading", { level: 1 }).getByRole("link");
      await titleLink.hover();
      const titleIcon = titleLink.locator("svg");
      if (width >= 980) await expect(titleIcon).toBeVisible();
      else await expect(titleIcon).toBeHidden();
      await titleLink.focus();
      const titleTextLeft = await titleLink.evaluate((link) => {
        const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) =>
            node.textContent?.trim() && !node.parentElement?.closest('[aria-hidden="true"]')
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP,
        });
        const text = walker.nextNode();
        if (!text) throw new Error("The page title must contain visible text.");
        const start = text.textContent!.search(/\S/);
        const range = document.createRange();
        range.setStart(text, start);
        range.setEnd(text, start + 1);
        return range.getBoundingClientRect().left;
      });
      expect(titleTextLeft).toBeCloseTo(headerBox!.x, 0);
      if (width >= 980) {
        const iconBox = await titleIcon.boundingBox();
        expect(iconBox!.x).toBeGreaterThanOrEqual(0);
        expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(titleTextLeft);
        await titleIcon.click();
      } else {
        await expect(titleIcon).toBeHidden();
        await titleLink.press("Enter");
      }
      await expect(page).toHaveURL(/#top$/);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      if (width === 320) {
        const themePreset = page.getByRole("combobox", { name: "Color theme preset" });
        await themePreset.selectOption("professional");
        await page.evaluate(() => document.fonts.ready);
        const brand = await page.locator(".docs-topbar-brand").boundingBox();
        const topbarActions = await page.locator(".docs-topbar-actions").boundingBox();
        expect(topbarActions!.y).toBeGreaterThanOrEqual(brand!.y + brand!.height);
        expect(topbarActions!.x + topbarActions!.width).toBeLessThanOrEqual(width);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true);
        await themePreset.selectOption("kamod");
      }
      const currentCrumb = await header.locator('[data-slot="breadcrumb-page"]').boundingBox();
      const firstCrumb = await header
        .getByRole("link", { name: "Home", exact: true })
        .boundingBox();
      expect(currentCrumb!.y).toBeCloseTo(firstCrumb!.y, 0);
      expect(currentCrumb!.x + currentCrumb!.width).toBeLessThanOrEqual(
        headerBox!.x + headerBox!.width,
      );
      if (width < 640) {
        const badge = await header.locator('[data-slot="badge"]').boundingBox();
        const title = await header.getByRole("heading", { level: 1 }).boundingBox();
        const backlink = await header.locator(".blocks-shell-header-back").boundingBox();
        expect(badge!.y).toBeGreaterThanOrEqual(backlink!.y + backlink!.height + 16);
        expect(badge!.y + badge!.height).toBeLessThan(title!.y);
      }
      const actions = header.locator(".blocks-shell-header-actions");
      // Action visibility follows available header space, not the viewport breakpoint.
      const actionsFit = await header.evaluate(
        (node) =>
          node.clientWidth >=
          44 * Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
      );
      if (actionsFit) {
        await expect(actions).toBeVisible();
        const actionsBox = await actions.boundingBox();
        const breadcrumbs = await header.locator('[data-slot="breadcrumb-list"]').boundingBox();
        expect(actionsBox!.x - (breadcrumbs!.x + breadcrumbs!.width)).toBeGreaterThanOrEqual(24);
        expect(actionsBox!.x + actionsBox!.width).toBeLessThanOrEqual(
          headerBox!.x + headerBox!.width,
        );
        expect(breadcrumbs!.y + breadcrumbs!.height).toBeCloseTo(
          actionsBox!.y + actionsBox!.height,
          0,
        );
        const currentPage = await header.locator('[data-slot="breadcrumb-page"]').boundingBox();
        const home = await header.getByRole("link", { name: "Home", exact: true }).boundingBox();
        expect(currentPage!.y).toBeCloseTo(home!.y, 0);
      } else {
        await expect(actions).toBeHidden();
        await expect(header.getByRole("group", { name: "Block navigation and links" })).toHaveCount(
          0,
        );
        // Hidden actions must not intercept keyboard navigation after the breadcrumbs.
        await header.getByRole("link", { name: "Application Shell", exact: true }).focus();
        await page.keyboard.press("Tab");
        await expect(
          page
            .getByRole("heading", { name: "application-shell-01", exact: true })
            .getByRole("link"),
        ).toBeFocused();
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await assertNoBlockingA11yViolations(page, `Block header ${width}px ${scheme}`, {
        include: ".blocks-shell-header",
      });
      await page.screenshot({ path: testInfo.outputPath(`header-${width}-${scheme}.png`) });
      const contents = page.locator(".blocks-doc-toc nav");
      const body = page.locator(".blocks-doc-body");
      const bodyBox = await body.boundingBox();
      if (width >= 980) {
        await expect(contents).toBeVisible();
        const contentsBox = await contents.boundingBox();
        expect(contentsBox!.x).toBeGreaterThan(bodyBox!.x + bodyBox!.width);
      } else {
        await expect(contents).toBeHidden();
        await expect(page.getByRole("navigation", { name: "On this page" })).toHaveCount(0);
        const grid = await page.locator(".blocks-detail-documentation").boundingBox();
        expect(bodyBox!.width).toBeCloseTo(grid!.width, 0);
        expect(bodyBox!.y).toBeCloseTo(grid!.y, 0);
        expect(bodyBox!.x - headerBox!.x).toBeCloseTo(
          headerBox!.x + headerBox!.width - (bodyBox!.x + bodyBox!.width),
          0,
        );
      }
      const guide = page.getByRole("region", {
        name: "application-shell-01 documentation",
        exact: true,
      });
      await guide.evaluate((node) => node.scrollIntoView({ block: "start" }));
      await page.screenshot({
        path: testInfo.outputPath(`documentation-guide-${width}-${scheme}.png`),
      });
      await (
        width >= 980
          ? contents.getByRole("link", { name: "Add this block", exact: true })
          : page.getByRole("heading", { name: "Add this block", exact: true }).getByRole("link")
      ).click();
      await expect(
        page.getByRole("heading", { name: "Add this block", exact: true }),
      ).toBeInViewport();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`documentation-${width}-${scheme}.png`) });

      const note = page.locator(".blocks-api-source-note");
      const noteLayout = await note.evaluate((node) => {
        const icon = node.querySelector("svg")!.getBoundingClientRect();
        const text = node.querySelector("span")!.getBoundingClientRect();
        const badge = node.querySelector('[data-slot="badge"]')!.getBoundingClientRect();
        const style = getComputedStyle(node);
        const contentWidth =
          node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        return {
          contentWidth,
          textWidth: text.width,
          textTop: text.top,
          iconBottom: icon.bottom,
          badgeBottom: badge.bottom,
        };
      });
      if (noteLayout.contentWidth <= 672) {
        expect(noteLayout.textWidth).toBeCloseTo(noteLayout.contentWidth, 0);
        expect(noteLayout.textTop).toBeGreaterThan(
          Math.max(noteLayout.iconBottom, noteLayout.badgeBottom),
        );
      }
      if (width < 980) {
        const copy = await page
          .locator(".blocks-doc-body .docs-code-wrap")
          .first()
          .getByRole("button", { name: "Copy code" })
          .boundingBox();
        expect(copy!.height).toBeGreaterThanOrEqual(24);
        expect(copy!.height).toBeLessThanOrEqual(32);
      }
      if (width < 640) {
        for (const step of await page.locator(".blocks-doc-steps > li").all()) {
          await expect(step.locator(".blocks-doc-step-index")).toBeVisible();
          const heading = step.getByRole("heading");
          const stepBox = await heading.boundingBox();
          expect(stepBox!.x).toBeCloseTo(bodyBox!.x, 0);
          await heading.hover();
          await expect(heading.locator(".blocks-doc-heading-icon")).toBeHidden();
        }
        const code = page.locator(".blocks-doc-body .docs-code-wrap").first();
        const copy = await code.getByRole("button", { name: "Copy code" }).boundingBox();
        const sample = await code.locator("pre").boundingBox();
        expect(copy!.y + copy!.height).toBeLessThanOrEqual(sample!.y);
        await code.getByRole("button", { name: "Copy code" }).focus();
        await page.keyboard.press("Tab");
        await expect(code.locator("pre")).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect
          .poll(() => code.locator("pre").evaluate((node) => node.scrollLeft))
          .toBeGreaterThan(0);
        const props = page.locator(".blocks-doc-table");
        await props.focus();
        await page.keyboard.press("ArrowRight");
        await expect.poll(() => props.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true);
      }

      await (
        width >= 980
          ? contents.getByRole("link", { name: "About this block", exact: true })
          : page.getByRole("heading", { name: "About this block", exact: true }).getByRole("link")
      ).click();
      await expect(
        page.getByRole("heading", { name: "About this block", exact: true }),
      ).toBeInViewport();
      await expect(page.locator(".blocks-doc-explanation")).toContainText(
        "Desktop collapse and mobile visibility are independent",
      );
      const paragraph = await page
        .locator(".blocks-doc-explanation > section p")
        .first()
        .boundingBox();
      expect(paragraph!.width).toBeCloseTo(bodyBox!.width, 0);
      await assertNoBlockingA11yViolations(page, `Block documentation ${width}px ${scheme}`, {
        include: ".blocks-doc-guide",
      });
      await page.screenshot({ path: testInfo.outputPath(`explanation-${width}-${scheme}.png`) });
      const reference = page
        .getByRole("region", { name: "Design reference", exact: true })
        .getByRole("link", { name: "Shadcnblocks Application Shell 1", exact: true });
      await expect(
        page.getByRole("heading", { name: "Design reference", level: 2, exact: true }),
      ).toBeVisible();
      await (
        width >= 980
          ? contents.getByRole("link", { name: "Design reference", exact: true })
          : page.locator("#application-shell-reference .blocks-doc-heading-link")
      ).click();
      await expect(page.locator("#application-shell-reference")).toBeFocused();
      await expect(reference).toHaveAttribute(
        "href",
        "https://www.shadcnblocks.com/block/application-shell1",
      );
      await page.screenshot({ path: testInfo.outputPath(`reference-${width}-${scheme}.png`) });
      const footer = page.locator(".blocks-doc-footer");
      for (const label of await footer.locator(".blocks-doc-footer-short").all()) {
        if (width < 640) await expect(label).toBeVisible();
        else await expect(label).toBeHidden();
      }
      await guide.getByRole("link", { name: "Back to showcase", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "application-shell-01", exact: true }),
      ).toBeInViewport();
    });
  }
}
