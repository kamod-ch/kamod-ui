import { expect, type Locator, type Page, test } from "@playwright/test";

async function scrollTo(area: Locator, top: number) {
  // Synthetic dispatch bypasses actionability; wait until the initially hidden app is ready.
  await expect(area.page().locator("html")).toHaveClass(/pp-ready/);
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

async function expectVisibleDestination(area: Locator) {
  const active = area.locator("a[aria-current]").first();
  await expect(active).toBeVisible();
  await expect
    .poll(() =>
      active.evaluate((link) => {
        const pane = link.closest<HTMLElement>(".docs-sidebar-scroll")!;
        const bounds = pane.getBoundingClientRect();
        const item = link.getBoundingClientRect();
        const styles = getComputedStyle(pane);
        return (
          item.top >= bounds.top + pane.clientTop + parseFloat(styles.paddingTop) - 1 &&
          item.bottom <=
            bounds.top + pane.clientTop + pane.clientHeight - parseFloat(styles.paddingBottom) + 1
        );
      }),
    )
    .toBe(true);
}

async function scrollKeepingDestinationVisible(area: Locator) {
  const top = await area.evaluate((node) => {
    const active = node.querySelector<HTMLAnchorElement>("a[aria-current]")!;
    return Math.max(
      0,
      Math.min(
        node.scrollHeight - node.clientHeight,
        Math.round(
          node.scrollTop +
            active.getBoundingClientRect().top -
            node.getBoundingClientRect().top -
            node.clientHeight / 2,
        ),
      ),
    );
  });
  await scrollTo(area, top);
  await expectVisibleDestination(area);
  return top;
}

test("desktop navigation keeps visible offsets and reveals different page groups", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./docs/pagination/installation", { waitUntil: "domcontentloaded" });
  const sidebar = page.locator(".docs-sidebar-scroll");
  await expect(
    sidebar.getByRole("button", { name: /^Components UI Building Blocks/ }),
  ).toHaveAttribute("aria-expanded", "true");
  await expectVisibleDestination(sidebar);
  const top = await scrollKeepingDestinationVisible(sidebar);
  await expectSaved(page, "desktop", top);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectOffset(sidebar, top);
  await page.goto("./blocks/styles", { waitUntil: "domcontentloaded" });
  await expectVisibleDestination(sidebar);
  for (const id of ["components", "blocks"]) {
    await expect(sidebar.locator(`[data-navigation-group="${id}"]`)).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  }
  const groups = sidebar.locator(".site-navigation-group");
  await expect(groups.first()).toHaveCSS("margin-top", "0px");
  await expect(groups.nth(1)).toHaveCSS("margin-top", "10px");
});

test("reload never paints the sidebar at the top before restoring saved groups", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./docs/packages");
  const sidebar = page.locator(".docs-sidebar-scroll");
  for (const id of ["components", "blocks"]) {
    const trigger = sidebar.locator(`[data-navigation-group="${id}"]`);
    await trigger.click();
    await expect(trigger.locator("..").locator('[data-slot="collapsible-content"]')).toHaveCSS(
      "transition-property",
      "none",
    );
  }
  const top = await scrollKeepingDestinationVisible(sidebar);
  await expectSaved(page, "desktop", top);

  // Make the SSR-to-hydration interval deterministic instead of relying on a flaky reload race.
  await page.route("**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    await route.continue();
  });
  await page.addInitScript(() => {
    const offsets: number[] = [];
    Reflect.set(window, "sidebarPaintOffsets", offsets);
    const sample = () => {
      const area = document.querySelector<HTMLElement>(".docs-sidebar-scroll");
      if (
        area &&
        document.documentElement.classList.contains("pp-ready") &&
        getComputedStyle(area).visibility === "visible"
      ) {
        offsets.push(area.scrollTop);
      }
      if (performance.now() < 5000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  for (let reload = 0; reload < 3; reload++) {
    await page.reload();
    await expectOffset(sidebar, top);
    await expect(sidebar).toBeVisible({ timeout: 1000 });
    await expect
      .poll(() => page.evaluate(() => Reflect.get(window, "sidebarPaintOffsets").length))
      .toBeGreaterThan(0);
    const offsets = await page.evaluate<number[]>(() => Reflect.get(window, "sidebarPaintOffsets"));
    expect(
      offsets.every((offset) => offset === top),
      JSON.stringify(offsets),
    ).toBe(true);
    await expect(page.locator("html")).not.toHaveAttribute("data-navigation-restoring");
  }
});

test("responsive navigation remembers reopening and reloads without overwriting desktop position", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./docs/pagination/installation", { waitUntil: "domcontentloaded" });
  const sidebar = page.locator(".docs-sidebar-scroll");
  await expectVisibleDestination(sidebar);
  const desktopTop = await scrollKeepingDestinationVisible(sidebar);
  await expectSaved(page, "desktop", desktopTop);
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
  await expectSaved(page, "desktop", desktopTop);
  await page.reload({ waitUntil: "domcontentloaded" });
  await open.click();
  await expectOffset(mobile, 220);
  await close.click();
  await page.goto("./docs/button/installation", { waitUntil: "domcontentloaded" });
  await open.click();
  await expectAligned(mobile, "Button");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectVisibleDestination(sidebar);
});

test("desktop loading reveals a deep destination and reopens its saved collapsed group", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto("./docs/pagination/installation");
  const sidebar = page.locator(".docs-sidebar-scroll");
  const owner = sidebar.locator('[data-navigation-group="components"]');
  await expectVisibleDestination(sidebar);
  await expect.poll(() => sidebar.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);

  await owner.click();
  await expect(owner).toHaveAttribute("aria-expanded", "false");
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(sessionStorage.getItem("kamod:navigation:/:desktop")!).groups.components,
      ),
    )
    .toBe(false);
  await page.reload();
  await expect(owner).toHaveAttribute("aria-expanded", "true");
  await expectVisibleDestination(sidebar);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("desktop reload reveals a destination hidden by manual sidebar scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto("./docs/pagination/installation");
  const sidebar = page.locator(".docs-sidebar-scroll");
  await expectVisibleDestination(sidebar);
  await scrollTo(sidebar, 0);
  await expectSaved(page, "desktop", 0);
  await page.reload();
  await expectVisibleDestination(sidebar);
  await expect.poll(() => sidebar.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("clicked guide navigation and cached history reveal their desktop destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto("./blocks/getting-started");
  const sidebar = page.locator(".docs-sidebar-scroll");
  await expectVisibleDestination(sidebar);
  const components = sidebar.locator('[data-navigation-group="components"]');
  await components.click();
  await expect(components.locator("..").locator('[data-slot="collapsible-content"]')).toHaveCSS(
    "transition-property",
    "none",
  );
  await page.evaluate(() => Reflect.set(window, "guideNavigationSession", true));
  await sidebar.locator('a[href$="/blocks/theming"]').click();
  await expect(page).toHaveURL(/\/blocks\/theming\/?$/);
  await expectVisibleDestination(sidebar);
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(sessionStorage.getItem("kamod:navigation:/:desktop")!).page),
    )
    .toBe("/blocks/theming");
  expect(await page.evaluate(() => Reflect.get(window, "guideNavigationSession"))).toBe(true);

  await scrollTo(sidebar, 0);
  await expectSaved(page, "desktop", 0);
  await page.goBack();
  await expect(page).toHaveURL(/\/blocks\/getting-started\/?$/);
  await expectVisibleDestination(sidebar);
  await expect.poll(() => sidebar.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(sessionStorage.getItem("kamod:navigation:/:desktop")!).page),
    )
    .toBe("/blocks/getting-started");
  expect(await page.evaluate(() => Reflect.get(window, "guideNavigationSession"))).toBe(true);
});

async function expectAligned(area: Locator, name: string) {
  const link = area
    .locator(".site-navigation-link[aria-current]")
    .filter({ hasText: name })
    .first();
  await expect(link).toBeVisible();
  await expect
    .poll(async () => {
      const target = (await link.boundingBox())!;
      const container = (await area.boundingBox())!;
      const padding = await area.evaluate((node) => parseFloat(getComputedStyle(node).paddingTop));
      return Math.abs(target.y - container.y - padding);
    })
    .toBeLessThan(2);
}

test("mobile destinations reopen their group, align at the top and keep subsequent manual scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./docs/components");
  const open = page.getByRole("button", { name: "Open navigation menu" });
  const close = page.getByRole("button", { name: "Close navigation menu" });
  const menu = page.locator(".site-navigation-body");
  await open.click();
  await menu.getByRole("button", { name: /^Components UI Building Blocks/ }).click();
  await close.click();
  await page.goto("./docs/pagination/installation");
  await open.click();
  await expect(
    menu.getByRole("button", { name: /^Components UI Building Blocks/ }),
  ).toHaveAttribute("aria-expanded", "true");
  await expectAligned(menu, "Pagination");
  await scrollTo(menu, 100);
  await close.click();
  await open.click();
  await expectOffset(menu, 100);
  // Following the active link again is an explicit request to return to that destination.
  await menu.getByRole("link", { name: "Pagination", exact: true }).click();
  await open.click();
  await expectAligned(menu, "Pagination");
  await close.click();
  await page.goto("./docs/state-package/installation");
  await open.click();
  await expectAligned(menu, "State");
  await scrollTo(menu, 100);
  await page.reload();
  await open.click();
  await expectOffset(menu, 100);
});
