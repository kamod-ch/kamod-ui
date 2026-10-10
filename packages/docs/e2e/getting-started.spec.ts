import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

test("Getting Started: home entry opens the complete guide", async ({ page }) => {
  await page.goto("./", { waitUntil: "domcontentloaded" });
  const entry = page.getByRole("link", { name: "Get Started", exact: true });
  await expect(entry).toHaveAttribute("href", /\/docs\/getting-started$/);
  await entry.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Getting Started with Kamod UI");
});

test("Getting Started: server-rendered guide, internal destinations and recursive contents", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("./docs/getting-started", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
  expect(await response!.text()).toContain('id="your-first-working-screen"');
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Getting Started with Kamod UI");
  await expect(page.locator("aside.docs-sidebar .navigation-header-link")).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.locator('aside.docs-sidebar [data-navigation-group="foundations"]'),
  ).toHaveCount(0);
  await expect(page.locator("aside.docs-sidebar [data-navigation-group]")).toHaveCount(4);
  const links = await page
    .locator('.block-guide a[href^="/"], .block-guide a[href^="#"], .blocks-doc-toc a[href^="#"]')
    .evaluateAll((anchors) => [
      ...new Set(anchors.map((anchor) => (anchor as HTMLAnchorElement).href)),
    ]);
  const pages = new Map<string, string>();
  const missingFragments: string[] = [];
  for (const link of links) {
    const url = new URL(link);
    const fragment = decodeURIComponent(url.hash.slice(1));
    url.hash = "";
    if (!pages.has(url.href)) {
      const target = await request.get(url.href);
      expect(target.ok(), url.href).toBe(true);
      pages.set(url.href, await target.text());
    }
    if (fragment && !pages.get(url.href)?.includes(`id="${fragment}"`)) missingFragments.push(link);
  }
  expect(missingFragments).toEqual([]);
  const nested = page.locator('.blocks-doc-toc a[href="#connect-tailwind-to-your-build-tool"]');
  await nested.click();
  await expect(page.locator("#connect-tailwind-to-your-build-tool")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("Getting Started: mobile entry link closes navigation and remains current", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("./docs/forms", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const panel = page.locator(".site-navigation-panel");
  const link = panel.locator(".navigation-header-link");
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Getting Started with Kamod UI");
  await expect(panel).toBeHidden();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(link).toHaveAttribute("aria-current", "page");
  await expect(link).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("Getting Started: package-manager tabs and copied commands", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./docs/getting-started", { waitUntil: "domcontentloaded" });
  const section = page.locator('section[aria-labelledby="set-up-your-app"]');
  await section.getByRole("tab", { name: "pnpm", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(section.getByRole("tab", { name: "npm", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await section
    .getByRole("tabpanel")
    .filter({ visible: true })
    .getByRole("button", { name: "Copy code", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe("npm install @kamod-ch/ui @kamod-ch/themes @preact/signals");
});

test("Getting Started: contextual references across the library", async ({ page }) => {
  for (const [route, fragment] of [
    ["/docs/button/installation", "components"],
    ["/blocks/sidebar/sidebar-01", "blocks"],
    ["/docs/forms", "forms"],
    ["/docs/hooks-package/installation", "hooks"],
    ["/docs/cn/installation", "style-your-interface"],
  ]) {
    await page.goto(`.${route}`, { waitUntil: "domcontentloaded" });
    const reference = page.getByRole("navigation", { name: "Getting Started guide", exact: true });
    await expect(reference).toHaveCount(1);
    await expect(reference.locator(`a[href$="#${fragment}"]`)).toHaveCount(1);
  }
});

for (const scheme of ["light", "dark"] as const) {
  test(`Getting Started: readable responsive structure (${scheme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), scheme);
    await page.goto("./docs/getting-started", { waitUntil: "domcontentloaded" });
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${width}px`,
      ).toBe(true);
      const table = page.locator(".getting-started-checks");
      await expect(table.getByRole("columnheader")).toHaveCount(2);
      await expect(table.getByRole("rowheader")).toHaveCount(6);
      expect(
        await table.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
        `verification table at ${width}px`,
      ).toBe(true);
    }
    await assertNoBlockingA11yViolations(page, `Getting Started (${scheme})`, {
      include: ".block-guide",
    });
  });
}

test("Getting Started: verification links preserve keyboard focus and desktop-only hover", async ({
  page,
}) => {
  await page.goto("./docs/getting-started", { waitUntil: "domcontentloaded" });
  const link = page.locator(
    '.getting-started-check-link[href="#compose-behavior-before-extracting-an-abstraction"]',
  );
  await link.scrollIntoViewIfNeeded();
  await expect(link).toHaveCSS("text-decoration-line", "none");
  await link.hover();
  await expect(link).toHaveCSS("text-decoration-line", "underline");
  await page.setViewportSize({ width: 320, height: 900 });
  await link.hover();
  await expect(link).toHaveCSS("text-decoration-line", "none");
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#compose-behavior-before-extracting-an-abstraction")).toBeInViewport();
});
