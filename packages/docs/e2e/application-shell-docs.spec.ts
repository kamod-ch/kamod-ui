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
    page.getByRole("heading", {
      name: "Application Shell 1 — Sidebar Shell with Breadcrumbs",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("aside.docs-sidebar")).toBeVisible();
  await page.locator(".blocks-showcase").scrollIntoViewIfNeeded();
  await expect(page.frameLocator(".blocks-preview-iframe").locator("body")).toContainText(
    "Overview",
  );
  await expect(page.getByRole("heading", { name: "Props and Data" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Block Breadcrumb", exact: true })
    .getByRole("link", { name: "Application Shell", exact: true })
    .click();
  await expect(page.locator("a.blocks-overview-card")).toHaveCount(8);
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
    "Application Shell 1 — Sidebar Shell with Breadcrumbs",
  );
  await expect(header.locator(".block-guide-eyebrow-label")).toHaveText("Layout Block");
  await expect(header.locator('[data-slot="badge"]')).toHaveCount(0);
  await expect(header.getByRole("button", { name: "Previous variant unavailable" })).toBeDisabled();
  const next = header.getByRole("link", { name: "Next variant: application-shell-02" });
  await expect(next).toHaveAttribute("href", /application-shell-2$/);
  const breadcrumb = header.getByRole("navigation", { name: "Block Breadcrumb", exact: true });
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
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText("Application Shell 1");

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

  // The disabled previous control is skipped; available navigation and resources stay reachable.
  await next.focus();
  await page.keyboard.press("Tab");
  await expect(report).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(source).toBeFocused();
  const overview = page
    .getByRole("navigation", { name: "On This Page" })
    .getByRole("link", { name: "Overview", exact: true });
  await overview.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#top$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(overview).toHaveAttribute("aria-current", "location");

  // Both links return above the introductory breadcrumbs, even when the URL already ends in #top.
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const titleLink = page.getByRole("heading", { level: 1 }).getByRole("link");
    await titleLink.focus();
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(header.locator(".blocks-page-header-breadcrumbs")).toBeInViewport();
  }

  await page
    .getByRole("navigation", { name: "On This Page" })
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
  await expect(page).toHaveURL(/\/blocks\/?$/);
  await expect(
    page.getByRole("heading", { name: "Blocks for Complete Application Layouts", exact: true }),
  ).toBeVisible();
});

test("loads detail directly, displays sources and switches preview viewports", async ({ page }) => {
  await page.goto(detail);
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(page.locator(".blocks-code-pane")).toContainText("SidebarProvider");
  await page.getByRole("button", { name: "types.ts", exact: true }).click();
  await expect(page.locator(".blocks-code-pane")).toContainText("ApplicationShell1Props");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const panel = page.locator(".blocks-showcase");
  for (const viewport of ["Mobile", "Tablet"]) {
    await panel.getByRole("button", { name: `${viewport} view` }).click();
    await expect(panel.locator("iframe")).toHaveAttribute(
      "src",
      /\/blocks\/application-shell\/application-shell-1\/preview$/,
    );
    await expect(panel.frameLocator("iframe").getByText("Overview")).toBeVisible();
  }
  await panel.getByRole("button", { name: "Desktop View" }).click();
  await expect(panel.locator("iframe")).toBeVisible();
  // The embedded sidebar must fit the preview, including its footer.
  const frameBox = await panel.locator(".blocks-preview-frame").boundingBox();
  const userBox = await panel
    .frameLocator("iframe")
    .getByRole("button", { name: "Open account menu for Alex Morgan" })
    .boundingBox();
  expect(userBox!.y + userBox!.height).toBeLessThanOrEqual(frameBox!.y + frameBox!.height);
});

test("documentation contents support keyboard links, history and scroll tracking", async ({
  page,
}) => {
  await page.goto(detail);
  const contents = page.getByRole("navigation", { name: "On This Page" });
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
    contents.getByRole("link", { name: "Responsive Behavior and State" }),
  ).toHaveAttribute("aria-current", "location");
  const sticky = await contents.boundingBox();
  expect(sticky!.y).toBeGreaterThanOrEqual(topbar!.height);
  expect(sticky!.y).toBeLessThan(120);

  const finalSection = contents.getByRole("link", {
    name: "Design Reference",
    exact: true,
  });
  await finalSection.click();
  await expect(finalSection).toHaveAttribute("aria-current", "location");

  await contents.getByRole("link", { name: "Live Preview" }).click();
  await expect(page).toHaveURL(/#application-shell-1$/);
  await expect(page.getByRole("article", { name: "application-shell-01 showcase" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Preview", exact: true })).toBeInViewport();
});

test("mobile section history restores position without a visible contents sidebar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(detail);
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await expect(page.locator(".blocks-doc-toc")).toBeHidden();
  for (const id of ["application-shell-installation", "application-shell-usage"]) {
    await page.locator(`#${id}`).getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
  }
  await page.goBack();
  await expect(page.locator("#application-shell-installation")).toBeInViewport();
  await page.goForward();
  await expect(page.locator("#application-shell-usage")).toBeInViewport();
});

test("documentation sections can be opened directly by URL", async ({ page }) => {
  await page.goto(`${detail}#application-shell-props`);
  await expect(page.getByRole("heading", { name: "Props and Data" })).toBeInViewport();
  await expect(
    page
      .getByRole("navigation", { name: "On This Page" })
      .getByRole("link", { name: "Props and Data" }),
  ).toHaveAttribute("aria-current", "location");
});

test("documentation contents remain below the site bar near the end of short windows", async ({
  page,
}) => {
  for (const height of [500, 375]) {
    await page.setViewportSize({ width: 1440, height });
    await page.goto(detail);
    const contents = page.getByRole("navigation", { name: "On This Page" });
    await contents.getByRole("link", { name: "Design Reference", exact: true }).click();
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
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const header = page.locator(".blocks-shell-header");
      const bounds = (await header.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      await expect(header.locator('[aria-current="page"]')).toHaveText("Application Shell 1");
      const actions = header.getByRole("group", { name: "Block navigation and links" });
      await expect(actions).toBeVisible();
      const actionBounds = (await actions.boundingBox())!;
      expect(actionBounds.x + actionBounds.width).toBeLessThanOrEqual(width);
      const title = header.getByRole("heading", { level: 1 }).getByRole("link");
      await title.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#top$/);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      for (const id of ["installation", "usage", "props", "about", "production", "reference"]) {
        const heading = page.locator(`#application-shell-${id}`);
        await expect(heading).toBeAttached();
        const box = (await heading.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await assertNoBlockingA11yViolations(page, `Block header ${width}px ${scheme}`, {
        include: ".blocks-shell-header",
      });
      await page.screenshot({ path: testInfo.outputPath(`header-${width}-${scheme}.png`) });
      const install = page.locator("#application-shell-installation");
      await install.scrollIntoViewIfNeeded();
      await expect(install).toBeInViewport();
      await page.screenshot({ path: testInfo.outputPath(`installation-${width}-${scheme}.png`) });
    });
  }
}

for (const dark of [false, true]) {
  test(`release guidance remains readable and navigable (${dark ? "dark" : "light"})`, async ({
    page,
  }) => {
    await page.addInitScript((dark) => {
      localStorage.setItem("theme", dark ? "dark" : "light");
      localStorage.setItem("theme-preset", "ocean");
    }, dark);
    await page.goto(`${detail}#application-shell-release-checks`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")))
      .toBe(dark);
    const section = page.getByRole("region", { name: "Release Checks", exact: true });
    const checklist = section.getByRole("list", { name: "Release checklist" });
    await expect(checklist.getByRole("listitem")).toHaveCount(6);
    for (const item of await checklist.getByRole("listitem").all()) {
      await expect(item.getByRole("heading", { level: 4 })).toBeVisible();
      await expect(item.locator("dt")).toHaveText(["Try this", "Looks right when"]);
    }
    for (const link of await section.locator('a[href^="#"]').all()) {
      const href = await link.getAttribute("href");
      await expect(page.locator(href!)).toHaveCount(1);
    }
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await section.scrollIntoViewIfNeeded();
      // Protect against clipped prose or controls, including labels enhanced into inline links.
      expect(await section.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await assertNoBlockingA11yViolations(page, "release guidance", { include: ".shell-release" });
    const routerLink = section.getByRole("link", { name: "router and navigation data" });
    await routerLink.focus();
    await expect(routerLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#application-shell-route-lifetime$/);
    await expect(page.locator("#application-shell-route-lifetime")).toBeInViewport();
  });
}
