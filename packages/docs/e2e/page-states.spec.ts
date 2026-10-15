import { expect, type Locator, type Page, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const responsiveViewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 640, height: 900 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1920, height: 1080 },
  { width: 568, height: 320 },
  { width: 667, height: 375 },
  { width: 844, height: 390 },
  { width: 1024, height: 480 },
  { width: 1440, height: 480 },
];

// Allow subpixel intersection rounding; frame geometry still has a one-pixel bound.
const viewportIntersectionRatio = 0.999;

async function expectReachableControls(scope: Locator) {
  for (const control of await scope.locator("a[href], button:not(:disabled)").all()) {
    await control.focus();
    await expect(control).toBeFocused();
    await expect(control).toBeInViewport({ ratio: viewportIntersectionRatio });
  }
}

async function expectStandaloneFrameFits(page: Page) {
  const shell = page.locator(".page-state-shell");
  await expect(shell).toBeVisible();
  const brand = shell.getByRole("link", { name: "Kamod UI home", exact: true });
  await expect(brand).toHaveCount(1);
  await expect(brand.locator(".kamod-ui-logo-wordmark")).toHaveCSS("font-weight", "700");
  await expect(brand.locator(".kamod-icon__img").filter({ visible: true })).toHaveCount(1);
  const rootSize = await page
    .locator("html")
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const symbolSize = `${rootSize * (page.viewportSize()!.width < 480 ? 1.3125 : 1.625)}px`;
  await expect(brand.locator(".kamod-icon")).toHaveCSS("width", symbolSize);
  await expect(brand.locator(".kamod-icon")).toHaveCSS("height", symbolSize);
  const main = shell.getByRole("main");
  const heading = main.getByRole("heading", { level: 1 });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeInViewport({ ratio: viewportIntersectionRatio });

  const geometry = await shell.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const header = element.querySelector<HTMLElement>(".page-state-topbar")!;
    const main = element.querySelector<HTMLElement>(".page-state-main")!;
    const footer = element.querySelector<HTMLElement>(".page-state-footer")!;
    const mainBounds = main.getBoundingClientRect();
    const headerBounds = header.getBoundingClientRect();
    const footerBounds = footer.getBoundingClientRect();
    return {
      top: bounds.top,
      bottom: bounds.bottom,
      headerTop: headerBounds.top,
      headerBottom: headerBounds.bottom,
      footerTop: footerBounds.top,
      footerBottom: footerBounds.bottom,
      mainTop: mainBounds.top,
      mainBottom: mainBounds.bottom,
      mainHeight: main.clientHeight,
      horizontalOverflow:
        element.scrollWidth > element.clientWidth + 1 ||
        main.scrollWidth > main.clientWidth + 1 ||
        document.documentElement.scrollWidth > innerWidth + 1,
      documentHeight: document.scrollingElement!.scrollHeight,
      viewportHeight: innerHeight,
    };
  });
  expect(geometry.top).toBeGreaterThanOrEqual(-1);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 1);
  expect(geometry.headerTop).toBeGreaterThanOrEqual(-1);
  expect(geometry.footerBottom).toBeLessThanOrEqual(geometry.viewportHeight + 1);
  expect(geometry.mainTop).toBeGreaterThanOrEqual(geometry.headerBottom - 1);
  expect(geometry.mainBottom).toBeLessThanOrEqual(geometry.footerTop + 1);
  expect(geometry.mainHeight).toBeGreaterThan(0);
  expect(geometry.horizontalOverflow).toBe(false);
  expect(geometry.documentHeight).toBeLessThanOrEqual(geometry.viewportHeight + 1);
  await expectReachableControls(shell);
  await expect(shell.locator(".page-state-topbar")).toBeInViewport({
    ratio: viewportIntersectionRatio,
  });
  await expect(shell.locator(".page-state-footer")).toBeInViewport({
    ratio: viewportIntersectionRatio,
  });
}

async function expectRecoveryFits(page: Page, compact: boolean) {
  const recovery = page.locator(".page-state-recovery");
  const heading = recovery.getByRole("heading", { level: 1 });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeInViewport({ ratio: viewportIntersectionRatio });
  const geometry = await recovery.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const parent = element.parentElement!.getBoundingClientRect();
    return {
      top: bounds.top,
      bottom: bounds.bottom,
      height: bounds.height,
      parentTop: parent.top,
      parentBottom: parent.bottom,
      horizontalOverflow:
        element.scrollWidth > element.clientWidth + 1 ||
        document.documentElement.scrollWidth > innerWidth + 1,
      documentHeight: document.scrollingElement!.scrollHeight,
      viewportHeight: innerHeight,
    };
  });
  expect(geometry.horizontalOverflow).toBe(false);
  if (compact) {
    await expect(recovery).toHaveJSProperty("tagName", "DIV");
    await expect(page.locator("main, #content")).toHaveCount(0);
    expect(geometry.top).toBeGreaterThanOrEqual(geometry.parentTop - 1);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.parentBottom + 1);
    expect(geometry.height).toBeLessThan(geometry.viewportHeight);
  } else {
    expect(geometry.top).toBeGreaterThanOrEqual(-1);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 1);
    expect(geometry.documentHeight).toBeLessThanOrEqual(geometry.viewportHeight + 1);
  }
  await expectReachableControls(recovery);
}

async function expectEnlargedTextFits(page: Page, check: () => Promise<void>) {
  await page.setViewportSize({ width: 768, height: 480 });
  const rootSize = await page
    .locator("html")
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const enlarged = await page.addStyleTag({
    content: `html { font-size: ${rootSize * 2}px !important; }`,
  });
  try {
    await check();
  } finally {
    await enlarged.evaluate((element) => element.remove());
  }
}

async function expectRecoveryLayout(page: Page, compact: boolean) {
  const recovery = page.locator(".page-state-recovery");
  await expect(recovery.getByRole("alert")).toContainText("Let’s Try That Again.");
  await expect(recovery.getByRole("heading", { level: 1 })).toHaveText("Let’s Try That Again.");
  const reload = recovery.getByRole("button", { name: "Reload Page", exact: true });
  await expect(reload).toBeVisible();
  await expect(reload).toHaveJSProperty("tagName", "BUTTON");
  await expect(reload).toHaveAttribute("type", "button");
  await expect(recovery.locator("hr.page-recovery-divider")).toBeVisible();
  await expect(
    recovery.locator(
      '.page-state-skeleton, .page-loading-track, .page-loading-spinner, [data-slot="spinner"], [role="progressbar"]',
    ),
  ).toHaveCount(0);
  await expect(
    page.locator(".page-state-topbar, .page-state-footer, .page-state-shell"),
  ).toHaveCount(0);
  expect(await recovery.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);

  const layout = await recovery.evaluate((element) => {
    const shell = element.getBoundingClientRect();
    const message = element.querySelector<HTMLElement>(".page-state-message")!;
    const column = message.getBoundingClientRect();
    const heading = message.querySelector("h1")!;
    const divider = message.querySelector<HTMLElement>(".page-recovery-divider")!;
    return {
      shellHeight: shell.height,
      shellCenterY: shell.y + shell.height / 2,
      columnWidth: column.width,
      columnCenterX: column.x + column.width / 2,
      columnCenterY: column.y + column.height / 2,
      headingSize: parseFloat(getComputedStyle(heading).fontSize),
      dividerHeight: divider.getBoundingClientRect().height,
      dividerRadius: parseFloat(getComputedStyle(divider).borderTopLeftRadius),
      overflow:
        message.scrollWidth > message.clientWidth + 1 ||
        document.documentElement.scrollWidth > innerWidth + 1,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
    };
  });
  expect(layout.overflow).toBe(false);
  expect(layout.columnWidth).toBeCloseTo(Math.min(448, layout.viewportWidth - 48), 1);
  expect(layout.columnCenterX).toBeCloseTo(layout.viewportWidth / 2, 1);
  expect(layout.columnCenterY).toBeCloseTo(layout.shellCenterY, 1);
  expect(layout.headingSize).toBeCloseTo(26.4, 1);
  expect(layout.dividerHeight).toBe(3);
  expect(layout.dividerRadius).toBeGreaterThanOrEqual(layout.dividerHeight / 2);
  if (compact) {
    await expect(recovery).toHaveClass(/page-state-recovery--compact/);
    await expect(recovery).toHaveJSProperty("tagName", "DIV");
    await expect(page.locator("main, #content")).toHaveCount(0);
    await expect(recovery.getByRole("link", { name: "Back to Home", exact: true })).toHaveCount(0);
    expect(layout.shellHeight).toBeLessThan(layout.viewportHeight);
  } else {
    await expect(recovery).toHaveJSProperty("tagName", "MAIN");
    await expect(recovery).toHaveAttribute("id", "content");
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(recovery.getByRole("link", { name: "Back to Home", exact: true })).toHaveAttribute(
      "href",
      /\/$/,
    );
    expect(layout.shellHeight).toBeGreaterThanOrEqual(layout.viewportHeight);
    expect(layout.columnCenterY).toBeCloseTo(layout.viewportHeight / 2, 1);
  }
  await assertNoBlockingA11yViolations(page, `${compact ? "Preview" : "Page"} recovery`, {
    include: ".page-state-recovery",
  });
}

test("unknown addresses offer working recovery links on direct and client navigation", async ({
  page,
}) => {
  // Preview serves bare 404 text; model a host's custom document without changing the missing URL.
  await page.route(/\/this-page-does-not-exist(?:\?|$)/, async (route) => {
    const response = await route.fetch({
      url: new URL("./404", route.request().url()).href,
    });
    await route.fulfill({ response, status: 404 });
  });
  await page.goto("./this-page-does-not-exist");
  await expect(page).toHaveURL(/\/this-page-does-not-exist$/);
  await expect(page.locator("h1")).toHaveText("This page is off the map.");
  await expect(
    page.getByRole("navigation", { name: "Explore the documentation" }).getByRole("link"),
  ).toHaveCount(4);
  await page.getByRole("link", { name: "Getting Started", exact: true }).click();
  await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
  await page.evaluate(() => {
    history.pushState({}, "", "./another-missing-page");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator("h1")).toHaveText("This page is off the map.");
  const home = page.getByRole("link", { name: "Back to Home", exact: true });
  await home.focus();
  await expect(home).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("home-page")).toBeVisible();
});

test("a pending page module shows the loading view and then yields to its content", async ({
  page,
}) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/GettingStartedContent.*\.(?:js|tsx)/, async (route) => {
    await pending;
    await route.continue();
  });
  try {
    await page.goto("./404");
    await page.getByRole("link", { name: "Getting Started", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Opening Your Next Page…");
    const loading = page.getByLabel("Loading content");
    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(
      loading.getByRole("heading", { name: "Opening Your Next Page…", exact: true }),
    ).toBeVisible();
    await expect(loading.locator(".page-loading-spinner")).toBeVisible();
    await expect(loading.locator(".page-loading-label")).toContainText(
      "Your next page is taking shape",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await loading.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);
  } finally {
    release();
  }
  await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
  await expect(page.getByLabel("Loading content")).toHaveCount(0);
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`failed page modules provide a centered static recovery and keyboard reload in ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "no-preference" });
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), colorScheme);
    await page.route(/GettingStartedContent.*\.(?:js|tsx)/, (route) => route.abort());
    await page.goto("./404");
    await page.getByRole("link", { name: "Getting Started", exact: true }).click();
    await expect(page.locator(".page-state-recovery")).toBeVisible();
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expectRecoveryLayout(page, false);
    }
    for (const viewport of responsiveViewports) {
      await test.step(`Page recovery at ${viewport.width}×${viewport.height}`, async () => {
        await page.setViewportSize(viewport);
        await expectRecoveryFits(page, false);
      });
    }
    await expectEnlargedTextFits(page, () => expectRecoveryFits(page, false));
    const reload = page.getByRole("button", { name: "Reload Page", exact: true });
    const home = page.getByRole("link", { name: "Back to Home", exact: true });
    await reload.focus();
    await reload.press("Tab");
    await expect(home).toBeFocused();
    await home.press("Shift+Tab");
    await expect(reload).toBeFocused();
    await expect(reload).toHaveCSS("outline-style", "solid");
    await page.unroute(/GettingStartedContent.*\.(?:js|tsx)/);
    await reload.press("Enter");
    await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
    await expect(page.locator(".page-state-recovery")).toHaveCount(0);
  });

  test(`failed preview modules keep compact recovery and keyboard reload in ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "no-preference" });
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), colorScheme);
    await page.route(/ComponentPreviewPage.*\.(?:js|tsx)/, (route) => route.abort());
    await page.goto("./component-preview?component=button&example=0");
    await expect(page.locator(".page-state-recovery--compact")).toBeVisible();
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expectRecoveryLayout(page, true);
    }
    for (const viewport of responsiveViewports) {
      await test.step(`Preview recovery at ${viewport.width}×${viewport.height}`, async () => {
        await page.setViewportSize(viewport);
        await expectRecoveryFits(page, true);
      });
    }
    const reload = page.getByRole("button", { name: "Reload Page", exact: true });
    await reload.focus();
    await expect(reload).toBeFocused();
    await page.unroute(/ComponentPreviewPage.*\.(?:js|tsx)/);
    await reload.press("Enter");
    await expect(page.locator("#component-preview-root .component-example-canvas")).toBeVisible();
    await expect(page.locator(".page-state-recovery")).toHaveCount(0);
  });

  test(`not-found and pending route frames fit responsive viewports in ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), colorScheme);
    // The shared exception header must stay styled if the optional brand asset CSS fails.
    await page.route(/\/styles\/logo\.css(?:\?|$)/, (route) =>
      route.fulfill({ contentType: "text/css", body: "" }),
    );
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(/GettingStartedContent.*\.(?:js|tsx)/, async (route) => {
      await pending;
      await route.continue();
    });
    try {
      await page.goto("./404");
      await expect(page.locator("#pp-preloader")).toBeHidden();
      for (const viewport of responsiveViewports) {
        await test.step(`404 at ${viewport.width}×${viewport.height}`, async () => {
          await page.setViewportSize(viewport);
          await expectStandaloneFrameFits(page);
        });
      }
      await expectEnlargedTextFits(page, () => expectStandaloneFrameFits(page));
      await page.getByRole("link", { name: "Getting Started", exact: true }).click();
      await expect(page.getByLabel("Loading content")).toBeVisible();
      for (const viewport of responsiveViewports) {
        await test.step(`Route loading at ${viewport.width}×${viewport.height}`, async () => {
          await page.setViewportSize(viewport);
          await expectStandaloneFrameFits(page);
        });
      }
      await expectEnlargedTextFits(page, () => expectStandaloneFrameFits(page));
    } finally {
      release();
    }
    await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
  });

  test(`bootstrap loading fits without site CSS in ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), colorScheme);
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(
      /\/assets\/main-[^/]+\.js(?:\?|$)|\/entry-client\.[jt]sx?(?:\?|$)|[?&]html-proxy\b/,
      async (route) => {
        await pending;
        await route.continue();
      },
    );
    await page.route(/\.css(?:\?|$)/, (route) =>
      route.fulfill({ contentType: "text/css", body: "" }),
    );
    const preloader = page.getByRole("status", { name: "Loading documentation" });
    try {
      await page.goto("./404", { waitUntil: "commit" });
      await expect(preloader).toBeVisible();
      await expect(page.locator("html")).not.toHaveClass(/pp-ready/);
      for (const viewport of responsiveViewports) {
        await test.step(`Bootstrap at ${viewport.width}×${viewport.height}`, async () => {
          await page.setViewportSize(viewport);
          const geometry = await preloader.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            const message = element.querySelector<HTMLElement>(".page-state-message")!;
            return {
              top: bounds.top,
              bottom: bounds.bottom,
              left: bounds.left,
              right: bounds.right,
              horizontalOverflow:
                element.scrollWidth > element.clientWidth + 1 ||
                message.scrollWidth > message.clientWidth + 1,
              viewportWidth: innerWidth,
              viewportHeight: innerHeight,
            };
          });
          expect(geometry.top).toBeGreaterThanOrEqual(-1);
          expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight + 1);
          expect(geometry.left).toBeGreaterThanOrEqual(-1);
          expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
          expect(geometry.horizontalOverflow).toBe(false);
          for (const part of await preloader
            .locator(
              ".page-loading-label, .page-state-message-title, .page-loading-description, .page-loading-track",
            )
            .all()) {
            await part.scrollIntoViewIfNeeded();
            await expect(part).toBeInViewport({ ratio: viewportIntersectionRatio });
          }
          await expect(preloader).toBeVisible();
        });
      }
    } finally {
      release();
    }
    await expect(preloader).toBeHidden();
  });
}

for (const width of [320, 768, 1440]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`not-found fits ${width}px in ${colorScheme} mode`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.addInitScript(() => localStorage.setItem("theme-preset", "cursor-warm"));
      await page.goto("./404");
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".not-found-status")).toContainText("Error 404 / Page not found");
      await expect(page.locator(".not-found-art")).toHaveAttribute("aria-hidden", "true");
      expect(
        await page
          .locator(".not-found-art")
          .evaluate((node) => node.getAnimations({ subtree: true }).length),
      ).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.getByRole("link", { name: "Getting Started", exact: true })).toBeVisible();
      if (width === 1440) await assertNoBlockingA11yViolations(page, `404 / ${colorScheme}`);
    });
  }
}
