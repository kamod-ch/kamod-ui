import { expect, test } from "@playwright/test";

// Cover Tailwind sizes and both sides of the landing page's layout transitions.
const widths = [
  320, 360, 375, 390, 414, 479, 480, 639, 640, 767, 768, 939, 940, 979, 980, 1023, 1024, 1199, 1200,
  1279, 1280, 1440, 1535, 1536, 1920, 2560,
];

for (const scheme of ["light", "dark"] as const) {
  test(`landing content fits across breakpoints in ${scheme} mode`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await page.addInitScript((value) => {
      localStorage.setItem("theme", value);
      localStorage.setItem("theme-preset", "ocean");
    }, scheme);
    await page.goto("./");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.locator(".home-shell-showcase").scrollIntoViewIfNeeded();
    await expect(page.locator(".home-shell-showcase iframe")).toBeVisible();
    const workspace = page.locator(".home-workspace");
    await workspace.scrollIntoViewIfNeeded();
    await expect(workspace.frameLocator("iframe").getByLabel("Workspace name")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    for (const width of widths) {
      await test.step(`${width}px`, async () => {
        await page.setViewportSize({ width, height: width < 480 ? 667 : 900 });
        await page.evaluate(
          () =>
            new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        const layout = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const visible = (element: Element) => element.getBoundingClientRect().width > 0;
          const label = (element: Element) =>
            element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 60);
          const outsideViewport = [
            ...document.querySelectorAll(
              ".home-page h1,.home-page h2,.home-page h3,.home-page p,.home-component-card," +
                ".home-guide-grid > *, .home-ecosystem-grid > *, .home-footer nav, .docs-topbar-brand",
            ),
          ]
            .filter(visible)
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              return rect.left < -1 || rect.right > viewport + 1;
            })
            .map(label);
          const clippedText: (string | undefined)[] = [];
          for (const element of document.querySelectorAll(
            ".home-primary-cta,.home-entry-title,.home-token-grid code," +
              ".home-block-heading strong,.home-live-label,.home-footer nav a",
          )) {
            if (!visible(element)) continue;
            const box = element.getBoundingClientRect();
            const range = document.createRange();
            range.selectNodeContents(element);
            const text = range.getBoundingClientRect();
            if (text.width > box.width + 1 || text.height > box.height + 1) {
              clippedText.push(label(element));
            }
          }
          const clippedControls: (string | undefined)[] = [];
          const headerGroups = [
            ...document.querySelectorAll(
              ".docs-topbar-leading,.docs-topbar-links,.docs-topbar-actions",
            ),
          ].filter(visible);
          for (const [index, group] of headerGroups.entries()) {
            const rect = group.getBoundingClientRect();
            for (const other of headerGroups.slice(index + 1)) {
              const next = other.getBoundingClientRect();
              if (
                rect.left < next.right - 1 &&
                rect.right > next.left + 1 &&
                rect.top < next.bottom - 1 &&
                rect.bottom > next.top + 1
              ) {
                clippedControls.push("Header navigation overlaps");
              }
            }
          }
          const counts: number[] = [];
          for (const selector of [".home-workspace", ".home-shell-showcase .blocks-showcase"]) {
            const showcase = document.querySelector(selector)!;
            const rect = showcase.getBoundingClientRect();
            const parent = showcase.parentElement!.getBoundingClientRect();
            if (rect.left < parent.left - 1 || rect.right > parent.right + 1) {
              clippedControls.push(`${selector} exceeds its container`);
            }
            const toolbar = showcase.querySelector(".blocks-showcase-toolbar")!;
            const bounds = toolbar.getBoundingClientRect();
            const controls = [...toolbar.querySelectorAll("button, a")].filter(visible);
            counts.push(controls.length);
            for (const control of controls) {
              const item = control.getBoundingClientRect();
              if (
                item.left < bounds.left - 1 ||
                item.right > bounds.right + 1 ||
                item.top < bounds.top - 1 ||
                item.bottom > bounds.bottom + 1
              ) {
                clippedControls.push(label(control));
              }
            }
          }
          const rim = document.querySelector(".home-workspace")!.getBoundingClientRect();
          return {
            viewport,
            scrollWidth: document.documentElement.scrollWidth,
            outsideViewport,
            clippedText,
            clippedControls,
            workspaceControls: counts[0],
            rimVisible: rim.left >= 7 && rim.right + 7 <= viewport,
          };
        });
        expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport + 1);
        expect(layout.outsideViewport).toEqual([]);
        expect(layout.clippedText).toEqual([]);
        expect(layout.clippedControls).toEqual([]);
        expect(layout.workspaceControls).toBe(7);
        expect(layout.rimVisible).toBe(true);
      });
    }
  });
}

test("narrow layout keeps the live examples usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("./");
  await page
    .getByRole("region", { name: "Interactive workspace example" })
    .scrollIntoViewIfNeeded();
  const workspace = page.frameLocator(
    'iframe[title="Workspace preferences interactive example 1"]',
  );
  await workspace.getByLabel("Workspace name").fill("Mobile workspace");
  await workspace.getByRole("button", { name: "Save Preferences" }).click();
  await expect(workspace.getByRole("status")).toContainText("Mobile workspace");
  const shell = page.getByRole("region", { name: "Application shell playground" });
  await shell.scrollIntoViewIfNeeded();
  await expect(shell.locator(".home-block-toolbar .home-live-label")).toBeVisible();
  await expect(shell.getByRole("link", { name: "Explore This Block" })).toBeVisible();
});

test.describe("compact touch layouts", () => {
  test.use({ hasTouch: true });
  test("home navigation and workspace stay usable with enlarged text on a narrow screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("./");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "125%";
    });
    const brand = page.locator(".docs-topbar-brand");
    const actions = page.locator(".docs-topbar-actions");
    await expect(brand).toBeVisible();
    await expect(actions.getByRole("button", { name: "Choose color mode" })).toBeVisible();
    const overlaps = await brand.evaluate((element) => {
      const logo = element.getBoundingClientRect();
      const tools = document.querySelector(".docs-topbar-actions")!.getBoundingClientRect();
      return (
        logo.left < tools.right &&
        logo.right > tools.left &&
        logo.top < tools.bottom &&
        logo.bottom > tools.top
      );
    });
    expect(overlaps).toBe(false);
    const menu = page.getByRole("button", { name: "Open navigation menu", exact: true });
    await menu.tap();
    await expect(page.locator(".site-navigation-panel")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".site-navigation-panel")).not.toBeVisible();
    await expect(menu).toBeFocused();
    const workspace = page.locator(".home-workspace");
    await workspace.scrollIntoViewIfNeeded();
    const preview = workspace.frameLocator("iframe");
    await preview.getByLabel("Workspace name").fill("Small screen workspace");
    await preview.getByRole("button", { name: "Save Preferences" }).click();
    await expect(preview.getByRole("status")).toContainText("Small screen workspace");
    await workspace.getByRole("button", { name: "Dark preview", exact: true }).click();
    await expect(preview.locator("html")).toHaveClass(/dark/);
    for (const size of [
      { width: 568, height: 320 },
      { width: 844, height: 390 },
    ]) {
      await page.setViewportSize(size);
      await expect(workspace.getByRole("tab", { name: "Code", exact: true })).toBeVisible();
      await workspace.getByRole("tab", { name: "Code", exact: true }).click();
      await expect(workspace.locator("pre")).toContainText("WorkspaceDemo");
      await workspace.getByRole("tab", { name: "Preview", exact: true }).click();
      await expect(preview.getByLabel("Workspace name")).toHaveValue("Small screen workspace");
    }
    await page.evaluate(() => {
      document.documentElement.style.removeProperty("font-size");
    });
  });
});
