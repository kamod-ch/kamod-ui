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
  await page
    .locator("aside.docs-sidebar")
    .getByRole("link", { name: "Application Shell", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Application Shell Blocks", exact: true }),
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

test("documentation header exposes breadcrumbs, repository links and disabled variant boundaries", async ({
  page,
}) => {
  await page.goto(detail);
  const header = page.locator(".blocks-shell-header");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Application Shell 1 — Sidebar shell with breadcrumbs",
  );
  await expect(header.locator('[data-slot="badge"]')).toHaveText("Preact native");
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
    /\/blocks$/,
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
      // A flush title must keep its permalink visible and clickable at narrow widths.
      const titleLink = header.getByRole("heading", { level: 1 }).getByRole("link");
      await titleLink.focus();
      const titleIcon = titleLink.locator("svg");
      await expect(titleIcon).toBeVisible();
      const iconBox = await titleIcon.boundingBox();
      expect(iconBox!.x).toBeGreaterThanOrEqual(0);
      expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(width);
      await titleIcon.click();
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
      const actions = header.locator(".blocks-shell-header-actions");
      if (width >= 768) {
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

      if (width < 640) {
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
      await guide.getByRole("link", { name: "Back to showcase", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "application-shell-01", exact: true }),
      ).toBeInViewport();
    });
  }
}

test("desktop keyboard navigation and collapse", async ({ page }) => {
  await page.goto(preview);
  const models = page.getByRole("button", { name: "Models", exact: true });
  await models.focus();
  await page.keyboard.press("Enter");
  await expect(models).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Genesis", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Selected Genesis");
  await expect(page.getByRole("link", { name: "Genesis", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.getByRole("button", { name: "Toggle Sidebar", exact: true }).click();
  await expect(page.locator('[data-slot="sidebar"][data-state="collapsed"]')).toBeVisible();
  const playground = page.getByRole("button", { name: "Playground", exact: true });
  await playground.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "History", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(playground).toBeFocused();
  await expect(page.getByRole("menu")).toHaveCount(0);
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("menuitem", { name: "History", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Starred", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Selected Starred");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(playground).toBeFocused();
});

for (const mode of ["expanded", "collapsed", "mobile"] as const) {
  test(`${mode} account menu supports keyboard selection and focus return`, async ({ page }) => {
    await page.setViewportSize({ width: mode === "mobile" ? 320 : 1440, height: 900 });
    await page.goto(preview);
    if (mode !== "expanded")
      await page.getByRole("button", { name: "Toggle Sidebar", exact: true }).click();
    const account = page.getByRole("button", { name: "Open account menu for Alex Morgan" });
    const first = page.getByRole("menuitem", { name: "Account", exact: true });
    const last = page.getByRole("menuitem", { name: "Log out", exact: true });
    await account.focus();
    await page.keyboard.press("Enter");
    await expect(first).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Billing", exact: true })).toBeFocused();
    await page.keyboard.press("End");
    await expect(last).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(first).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(last).toBeFocused();
    await page.keyboard.press("Home");
    await expect(first).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(account).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(first).toBeFocused();
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(page.getByRole("status")).toHaveText("Selected Log out");
    await expect(account).toBeFocused();
    if (mode === "mobile")
      await expect(page.getByRole("dialog", { name: "Sidebar", exact: true })).toBeVisible();
  });
}

test("mobile sheet traps focus, closes on navigation and returns focus on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(preview);
  const trigger = page.getByRole("button", { name: "Toggle Sidebar", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Sidebar", exact: true });
  await expect(dialog).toBeVisible();
  await assertNoBlockingA11yViolations(page, "Application Shell mobile sheet", {
    include: '[role="dialog"]',
  });
  const brand = dialog.getByRole("link", { name: "Acme Inc", exact: true });
  const account = dialog.getByRole("button", { name: "Open account menu for Alex Morgan" });
  // Prove both boundaries wrap past the hidden Sheet close button and untabbable rail.
  await brand.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(account).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(brand).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Acme Inc", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await account.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(account).toBeFocused();
  const models = dialog.getByRole("button", { name: "Models", exact: true });
  await models.focus();
  await page.keyboard.press("Enter");
  await expect(models).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "Genesis", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("Selected Genesis");
  await expect(trigger).toBeFocused();
});

test("reduced motion applies to the shell and portaled mobile sheet", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(preview);
  const sidebar = page.locator('[data-slot="sidebar-container"]');
  await expect(sidebar).toHaveCSS("transition-property", "none");
  const trigger = page.getByRole("button", { name: "Toggle Sidebar", exact: true });
  await trigger.click();
  const account = page.getByRole("button", { name: "Open account menu for Alex Morgan" });
  await account.click();
  await expect(page.getByRole("menu")).toHaveCSS("animation-name", "none");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 320, height: 800 });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Sidebar", exact: true });
  await expect(dialog).toHaveCSS("animation-name", "none");
  await expect(page.locator('[data-slot="sheet-overlay"]')).toHaveCSS("animation-name", "none");
  await account.click();
  await expect(page.getByRole("menu")).toHaveCSS("animation-name", "none");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

for (const width of [320, 768, 1024, 1440]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`${width}px ${scheme} layout and long labels`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
      await page.goto(preview);
      await expect
        .poll(() => page.locator("html").evaluate((node) => node.classList.contains("dark")))
        .toBe(scheme === "dark");
      await expect(page.getByText("Overview", { exact: true })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      if (width === 320)
        await page.getByRole("button", { name: "Toggle Sidebar", exact: true }).click();
      await expect(
        page.getByRole("button", { name: "Open account menu for Alex Morgan" }),
      ).toBeVisible();
      await assertNoBlockingA11yViolations(page, `Application Shell ${width}px ${scheme}`);
      await page.screenshot({
        path: testInfo.outputPath(`shell-${width}-${scheme}.png`),
        fullPage: true,
      });
      // Stress the same rendered text slots without adding fixture-only props to the public block.
      await page.getByText("alex@example.com", { exact: true }).evaluate((node) => {
        node.textContent = "a-very-long-email-address-for-a-workspace-owner@example.com";
      });
      await page
        .getByRole("link", { name: "Design Engineering", exact: true })
        .locator("span")
        .evaluate((node) => {
          node.textContent = "A very long navigation label that must truncate inside the sidebar";
        });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      const label = page
        .getByRole("link", { name: "Design Engineering", exact: true })
        .locator("span");
      expect(await label.evaluate((node) => getComputedStyle(node).textOverflow)).toBe("ellipsis");
      const linkBox = await label.boundingBox();
      expect(linkBox!.x + linkBox!.width).toBeLessThanOrEqual(width === 320 ? 288 : 256);
      await page.screenshot({
        path: testInfo.outputPath(`shell-${width}-${scheme}-long-labels.png`),
        fullPage: true,
      });
    });
  }
}
