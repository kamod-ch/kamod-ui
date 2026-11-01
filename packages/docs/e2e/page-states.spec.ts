import { expect, type Locator, type Page, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

// A loaded analytics pixel must not extend a full-height page, regardless of network availability.
test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/matomo\.kamod\.ch\/matomo\.php(?:\?|$)/, (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
    }),
  );
});

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

async function expectLoadingContentReachable(loading: Locator) {
  for (const part of await loading
    .locator(
      ".page-loading-label, .page-loading-title, .page-loading-description, .page-loading-track, .page-loading-panel-header, .page-loading-panel-footer, .page-loading-tagline",
    )
    .all()) {
    const geometry = () =>
      part.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const main = element.closest<HTMLElement>(".page-state-main, .page-opening-main")!;
        const mainBounds = main.getBoundingClientRect();
        return {
          top: bounds.top,
          bottom: bounds.bottom,
          height: bounds.height,
          mainTop: mainBounds.top + main.clientTop,
          mainBottom: mainBounds.top + main.clientTop + main.clientHeight,
        };
      });
    const initial = await geometry();
    if (initial.height <= initial.mainBottom - initial.mainTop) {
      await part.scrollIntoViewIfNeeded();
      await expect(part).toBeInViewport({ ratio: viewportIntersectionRatio });
      continue;
    }
    // Enlarged text can be taller than the scrollport; both ends must remain readable.
    await part.evaluate((element) => element.scrollIntoView({ block: "start" }));
    const start = await geometry();
    expect(start.top).toBeGreaterThanOrEqual(start.mainTop - 1);
    expect(start.top).toBeLessThan(start.mainBottom);
    await part.evaluate((element) => element.scrollIntoView({ block: "end" }));
    const end = await geometry();
    expect(end.bottom).toBeGreaterThan(end.mainTop);
    expect(end.bottom).toBeLessThanOrEqual(end.mainBottom + 1);
  }
}

async function expectStandaloneFrameFits(
  page: Page,
  requireNoContentScroll = false,
  shell = page.locator(".page-state-shell").filter({ visible: true }),
) {
  await expect(shell).toBeVisible();
  const isLoading = (await shell.getAttribute("class"))!.includes("page-opening");
  const brand = shell.getByRole("link", { name: "Kamod UI home", exact: true });
  await expect(brand).toHaveCount(1);
  await expect(brand.locator(".kamod-logo__suffix")).toHaveCSS("font-weight", "700");
  await expect(brand.locator(".kamod-logo__mark-img").filter({ visible: true })).toHaveCount(1);
  const rootSize = await page
    .locator("html")
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const markHeight = `${rootSize * (page.viewportSize()!.width < 480 ? 1.3125 : 1.625)}px`;
  await expect(brand.locator(".kamod-logo__mark")).toHaveCSS("height", markHeight);
  const main = shell.locator(".page-state-main, .page-opening-main");
  const heading = isLoading
    ? main.locator(".page-loading-title")
    : main.getByRole("heading", { level: 1 });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeInViewport({ ratio: viewportIntersectionRatio });

  const geometry = await shell.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const header = element.querySelector<HTMLElement>(".page-state-topbar, .page-opening-topbar")!;
    const main = element.querySelector<HTMLElement>(".page-state-main, .page-opening-main")!;
    const footer = element.querySelector<HTMLElement>(".page-state-footer");
    const mainBounds = main.getBoundingClientRect();
    const headerBounds = header.getBoundingClientRect();
    const footerBounds = footer?.getBoundingClientRect();
    return {
      top: bounds.top,
      bottom: bounds.bottom,
      headerTop: headerBounds.top,
      headerBottom: headerBounds.bottom,
      footerTop: footerBounds?.top ?? bounds.bottom,
      footerBottom: footerBounds?.bottom ?? bounds.bottom,
      mainTop: mainBounds.top,
      mainBottom: mainBounds.bottom,
      mainHeight: main.clientHeight,
      mainScrollRange: main.scrollHeight - main.clientHeight,
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
  expect(geometry.documentHeight).toBe(geometry.viewportHeight);
  if (requireNoContentScroll) expect(geometry.mainScrollRange).toBe(0);
  await expectReachableControls(shell);
  const header = shell.locator(".page-state-topbar, .page-opening-topbar");
  await expect(header).toBeInViewport({
    ratio: viewportIntersectionRatio,
  });
  if (isLoading) {
    await expect(shell.locator(".page-state-footer")).toHaveCount(0);
    await expect(header.locator("a")).toHaveCount(1);
    await expect(header).toHaveCSS("border-bottom-width", "0px");
  } else {
    await expect(shell.locator(".page-state-footer")).toBeInViewport({
      ratio: viewportIntersectionRatio,
    });
  }
}

async function expectSharedLoadingDesign(loading: Locator) {
  const shell = loading.locator(
    'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " page-opening ")]',
  );
  await expect(loading).toHaveAttribute("aria-busy", "true");
  await expect(loading.locator(".page-loading-title")).toContainText("Opening Your Next Page");
  await expect(loading.locator(".page-loading-caption")).toHaveText(
    "Your next page is taking shape...",
  );
  await expect(
    loading.locator('.page-loading-brand :is(.page-loading-spinner, [data-slot="spinner"])'),
  ).toHaveCount(0);
  const backdrop = await shell.evaluate((node) => {
    const wash = getComputedStyle(node, "::before");
    const glass = getComputedStyle(node, "::after");
    const content = getComputedStyle(node.querySelector(".page-opening-content")!);
    return {
      pointerEvents: [wash.pointerEvents, glass.pointerEvents],
      behindContent:
        getComputedStyle(node).isolation === "isolate" &&
        Number(wash.zIndex) < Number(glass.zIndex) &&
        Number(glass.zIndex) < (Number.parseInt(content.zIndex, 10) || 0),
      contentFilter: content.filter,
    };
  });
  expect(backdrop.pointerEvents).toEqual(["none", "none"]);
  expect(backdrop.behindContent).toBe(true);
  expect(backdrop.contentFilter).toBe("none");
  await expect(loading.locator(".page-loading-brand > strong")).toHaveText("kamod");
  const typography = await loading.evaluate((node) => {
    const brand = getComputedStyle(node.querySelector(".page-loading-brand > strong")!);
    const caption = getComputedStyle(node.querySelector(".page-loading-caption")!);
    const tagline = getComputedStyle(node.querySelector(".page-loading-tagline")!);
    return {
      brandSize: brand.fontSize,
      captionSize: caption.fontSize,
      captionColor: caption.color,
      taglineSize: tagline.fontSize,
      taglineColor: tagline.color,
      brandWeight: brand.fontWeight,
      brandColor: brand.color,
      foreground: getComputedStyle(node).color,
    };
  });
  expect(typography.brandSize).toBe(typography.captionSize);
  expect(typography.brandWeight).toBe("600");
  expect(typography.brandColor).toBe(typography.foreground);
  expect(typography.taglineSize).toBe(typography.captionSize);
  expect(typography.taglineColor).toBe(typography.captionColor);
  await expect(loading.locator(".page-state-skeleton")).toHaveAttribute("aria-hidden", "true");
  await expect(shell.locator(".page-loading-rocket .getting-started-flight")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(shell.locator(".page-loading-rocket .getting-started-flight-star")).toHaveCount(4);
  await expect(loading.locator(".page-loading-tagline")).toHaveText(
    "Made for Preact. Built to be yours.",
  );
  const order = await loading.evaluate((node) => {
    const skeleton = node.querySelector(".page-state-skeleton")!;
    const tagline = node.querySelector(".page-loading-tagline")!;
    return Boolean(skeleton.compareDocumentPosition(tagline) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(order).toBe(true);
}

async function expectNotFoundFits(page: Page) {
  await expectStandaloneFrameFits(page, true);
  const hero = page.locator(".not-found-hero");
  for (const part of await hero
    .locator(".not-found-status, h1, .not-found-description, a[href]")
    .all()) {
    const geometry = await part.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const main = element.closest<HTMLElement>(".page-state-main")!;
      const mainBounds = main.getBoundingClientRect();
      return {
        top: bounds.top,
        bottom: bounds.bottom,
        mainTop: mainBounds.top + main.clientTop,
        mainBottom: mainBounds.top + main.clientTop + main.clientHeight,
      };
    });
    // A fixed-height shell must fit the content, rather than hide it behind its chrome.
    expect(geometry.top).toBeGreaterThanOrEqual(geometry.mainTop - 1);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.mainBottom + 1);
    await expect(part).toBeInViewport({ ratio: viewportIntersectionRatio });
  }
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
    expect(geometry.documentHeight).toBe(geometry.viewportHeight);
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
  await expect(page.locator("h1")).toHaveText("Page not found");
  await expect(page.locator(".page-state-main").getByRole("link")).toHaveCount(2);
  await page.getByRole("link", { name: "Getting Started", exact: true }).click();
  await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
  await page.evaluate(() => {
    history.pushState({}, "", "./another-missing-page");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator("h1")).toHaveText("Page not found");
  const home = page.getByRole("link", { name: "Back to Home", exact: true });
  const gettingStarted = page.getByRole("link", { name: "Getting Started", exact: true });
  await home.focus();
  await expect(home).toBeFocused();
  await home.press("Tab");
  await expect(gettingStarted).toBeFocused();
  await gettingStarted.press("Shift+Tab");
  await expect(home).toBeFocused();
  await home.press("Enter");
  await expect(page.getByTestId("home-page")).toBeVisible();
});

test("server-rendered reading stays scrollable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  try {
    await context.route("https://matomo.kamod.ch/**", (route) => route.abort());
    const page = await context.newPage();
    await page.goto(new URL("./docs/code/installation/", baseURL).href);
    await expect(page.locator("#pp-preloader")).toBeHidden();
    await expect(page.locator("html")).not.toHaveAttribute("aria-busy", "true");
    const reading = page.locator("main.docs-content");
    await expect(reading).toBeVisible();
    await expect(reading.getByRole("heading", { level: 1 })).toBeVisible();
    const height = await page.evaluate(() => document.scrollingElement!.scrollHeight);
    expect(height).toBeGreaterThan(900);
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await page.mouse.wheel(0, height);
    const ending = reading.locator(".component-reference-next > p").last();
    await expect(ending).toContainText("Leave a Small Trail for the Next Edit.");
    // Deferred browser layout can change the long article's estimated height after a wheel jump.
    await ending.scrollIntoViewIfNeeded();
    await expect(ending).toBeInViewport({ ratio: viewportIntersectionRatio });
  } finally {
    await context.close();
  }
});

test("a pending preview keeps its compact loading layout", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/ComponentPreviewPage.*\.(?:js|tsx)/, async (route) => {
    await pending;
    await route.continue();
  });
  try {
    // Client navigation exercises Suspense; initial hydration preserves the server-rendered preview.
    await page.goto("./404");
    await expect(page.locator("#pp-preloader")).toBeHidden();
    await page.evaluate(() => {
      history.pushState({}, "", "./component-preview?component=button&example=0");
      dispatchEvent(new PopStateEvent("popstate"));
    });
    const loading = page.locator(".page-state-loading--compact");
    await expect(loading).toBeVisible();
    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(
      loading.getByRole("heading", { name: "Loading Preview…", exact: true }),
    ).toBeVisible();
    await expect(loading.locator(".page-loading-label")).toContainText(
      "Preparing your interactive preview",
    );
    await expect(page.locator(".page-state-shell")).toHaveCount(0);
    expect(
      await loading.evaluate((element) => {
        const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return {
          heading: parseFloat(getComputedStyle(element.querySelector("h1")!).fontSize) / rootSize,
          description:
            parseFloat(
              getComputedStyle(element.querySelector(".page-loading-description")!).fontSize,
            ) / rootSize,
        };
      }),
    ).toEqual({ heading: 1.25, description: 0.875 });
  } finally {
    release();
  }
  await expect(page.locator("#component-preview-root .component-example-canvas")).toBeVisible();
  await expect(page.getByLabel("Loading content")).toHaveCount(0);
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`a pending page has a unified animated loading view in ${colorScheme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme, reducedMotion: "no-preference" });
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), colorScheme);
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
      const loading = page.getByLabel("Loading content");
      await expectSharedLoadingDesign(loading);
      await expect(
        loading.getByRole("heading", { name: "Opening Your Next Page…", exact: true }),
      ).toBeVisible();
      await expect(loading.getByRole("status")).toContainText("Opening Your Next Page…");
      await expectStandaloneFrameFits(page, true);
      for (const area of [".page-loading-track", ".page-loading-panel"]) {
        await expect
          .poll(() =>
            loading.locator(area).evaluate((node) =>
              node.getAnimations({ subtree: true }).some((animation) => {
                const timing = animation.effect!.getTiming();
                return (
                  animation.playState === "running" &&
                  timing.iterations === Infinity &&
                  typeof timing.duration === "number" &&
                  timing.duration > 0 &&
                  timing.duration < 3000
                );
              }),
            ),
          )
          .toBe(true);
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(await loading.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(
        0,
      );
    } finally {
      release();
    }
    await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
    await expect(page.getByLabel("Loading content")).toHaveCount(0);
  });

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
          await expectNotFoundFits(page);
        });
      }
      await expectEnlargedTextFits(page, () => expectNotFoundFits(page));
      await page.getByRole("link", { name: "Getting Started", exact: true }).click();
      const loading = page.getByLabel("Loading content");
      await expectSharedLoadingDesign(loading);
      for (const viewport of responsiveViewports) {
        await test.step(`Route loading at ${viewport.width}×${viewport.height}`, async () => {
          await page.setViewportSize(viewport);
          // The ordinary phone, tablet and desktop frames need no inner scroll either.
          // Short landscape windows retain scrolling so text is never clipped.
          await expectStandaloneFrameFits(page, viewport.height >= 568);
          await expectLoadingContentReachable(loading);
        });
      }
      await expectEnlargedTextFits(page, async () => {
        await expectStandaloneFrameFits(page);
        await expectLoadingContentReachable(loading);
      });
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
      const shell = preloader.locator(".page-opening");
      const loading = shell.locator(".page-opening-content");
      await expectSharedLoadingDesign(loading);
      for (const viewport of responsiveViewports) {
        await test.step(`Bootstrap at ${viewport.width}×${viewport.height}`, async () => {
          await page.setViewportSize(viewport);
          await expectStandaloneFrameFits(page, viewport.height >= 568, shell);
          await expectLoadingContentReachable(loading);
          await expect(preloader).toBeVisible();
        });
      }
      await expectEnlargedTextFits(page, async () => {
        await expectStandaloneFrameFits(page, false, shell);
        await expectLoadingContentReachable(loading);
      });
    } finally {
      release();
    }
    await expect(preloader).toBeHidden();
  });
}

for (const width of [320, 768, 1024, 1440]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`not-found fits ${width}px in ${colorScheme} mode`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.addInitScript(() => localStorage.setItem("theme-preset", "cursor-warm"));
      await page.goto("./404");
      await expect(page.locator("h1")).toHaveText("Page not found");
      await expect(page.locator(".not-found-status")).toHaveText("404");
      await expect(page.locator(".page-state-main").getByRole("link")).toHaveCount(2);
      await expectNotFoundFits(page);
      if (width === 1440) {
        await assertNoBlockingA11yViolations(page, `404 / ${colorScheme}`, {
          exclude: ".kamod-logo__suffix",
        });
      }
    });
  }
}
