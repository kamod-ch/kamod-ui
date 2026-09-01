import { expect, type Page, test } from "@playwright/test";
import { docsShowMotion } from "../src/docs/docs-feature-flags";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const motionSheetSides = ["top", "right", "bottom", "left"] as const;

const UI_MOTION_ROUTES = [
  "docs/ui-motion/installation",
  "docs/ui-motion/dialog",
  "docs/ui-motion/alert-dialog",
  "docs/ui-motion/sheet",
  "docs/ui-motion/accordion",
  "docs/ui-motion/collapsible",
  "docs/ui-motion/reduced-motion",
] as const;

const WITH_MOTION_ROUTES = [
  "docs/dialog/with-motion",
  "docs/alert-dialog/with-motion",
  "docs/sheet/with-motion",
  "docs/accordion/with-motion",
  "docs/collapsible/with-motion",
] as const;

const A11Y_EXCLUDE = [".docs-code-wrap", ".docs-tab-code", ".tag.token", "pre[class*='language-']"];

function collectConsoleIssues(page: Page) {
  const issues: string[] = [];

  page.on("console", (message) => {
    const type = message.type();
    const text = message.text();
    if (type === "error") {
      issues.push(`console.error: ${text}`);
    }
    if (type === "warning" && /hydration|Hydration/i.test(text)) {
      issues.push(`console.warning: ${text}`);
    }
  });

  page.on("pageerror", (error) => {
    issues.push(`pageerror: ${error.message}`);
  });

  return issues;
}

function docsRoute(...segments: string[]) {
  return `./${segments.filter(Boolean).join("/")}`;
}

test.describe("UI Motion docs", () => {
  test.skip(!docsShowMotion, "Motion docs are hidden");

  test("alert dialog opens and cancel closes without confirming", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/ui-motion/alert-dialog"));
    await expect(page.locator("h1", { hasText: "UI Motion" })).toBeVisible();

    const trigger = page.getByTestId("ui-motion-alert-trigger");
    await trigger.click();

    const dialog = page.getByRole("alertdialog", { name: "Delete this project?" });
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden({ timeout: 10_000 });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("alert dialog escape closes and can reopen", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/alert-dialog/with-motion"));
    await expect(page.locator("h1", { hasText: "Alert Dialog" })).toBeVisible();

    const trigger = page.getByTestId("ui-motion-alert-trigger");
    await trigger.click();

    const dialog = page.getByRole("alertdialog", { name: "Delete this project?" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 10_000 });

    await trigger.click();
    await expect(page.getByRole("alertdialog", { name: "Delete this project?" })).toBeVisible();

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("sheet opens from each side and closes with Escape", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/ui-motion/sheet"));
    await expect(page.locator("h1", { hasText: "UI Motion" })).toBeVisible();

    for (const side of motionSheetSides) {
      const trigger = page.getByTestId(`ui-motion-sheet-trigger-${side}`);
      await trigger.click();

      const dialog = page.getByRole("dialog", { name: `${side} sheet` });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("data-side", side);

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("sheet survives rapid close and reopen without mixing sides", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/sheet/with-motion"));
    await expect(page.locator("h1", { hasText: "Sheet" })).toBeVisible();

    const rightTrigger = page.getByTestId("ui-motion-sheet-trigger-right");
    const leftTrigger = page.getByTestId("ui-motion-sheet-trigger-left");

    await rightTrigger.click();
    await expect(page.getByRole("dialog", { name: "right sheet" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "right sheet" })).toBeHidden();

    await rightTrigger.click();
    await page.keyboard.press("Escape");
    await rightTrigger.click();

    await expect(page.getByRole("dialog", { name: "right sheet" })).toHaveAttribute(
      "data-side",
      "right",
    );

    await page.keyboard.press("Escape");
    await leftTrigger.click();
    await expect(page.getByRole("dialog", { name: "left sheet" })).toHaveAttribute(
      "data-side",
      "left",
    );
    await page.keyboard.press("Escape");

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("reduced motion section reports policy state in text", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "prefers-reduced-motion emulation is chromium-only");

    const issues = collectConsoleIssues(page);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(docsRoute("docs/ui-motion/reduced-motion"));
    await expect(page.locator("h1", { hasText: "UI Motion" })).toBeVisible();

    const status = page.getByTestId("ui-motion-reduced-status");
    await expect(status).toContainText("policy: user");
    await expect(status).toContainText("reduced: yes");
    await expect(page.getByTestId("ui-motion-reduced-panel")).toContainText("opacity only");

    await page.getByRole("button", { name: "never", exact: true }).click();
    await expect(status).toContainText("policy: never");
    await expect(status).toContainText("reduced: no");
    await expect(page.getByTestId("ui-motion-reduced-panel")).toContainText("Full slide-up");

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("accordion FAQ toggles with keyboard and exposes aria-expanded", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/ui-motion/accordion"));
    await expect(page.locator("h1", { hasText: "UI Motion" })).toBeVisible();

    const shipping = page.getByTestId("ui-motion-accordion-trigger-shipping");
    const returns = page.getByTestId("ui-motion-accordion-trigger-returns");

    await expect(shipping).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("ui-motion-accordion-content-shipping")).toHaveAttribute(
      "data-state",
      "open",
    );

    await shipping.click();
    await expect(shipping).toHaveAttribute("aria-expanded", "false");

    await returns.focus();
    await page.keyboard.press("Enter");
    await expect(returns).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("ui-motion-accordion-content-returns")).toHaveAttribute(
      "data-state",
      "open",
    );

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("accordion with-motion route is reachable from accordion docs", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/accordion/with-motion"));
    await expect(page.locator("h1", { hasText: "Accordion" })).toBeVisible();
    await expect(page.getByTestId("ui-motion-accordion")).toBeVisible();

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("collapsible file tree toggles rapidly and hides nested controls when closed", async ({
    page,
  }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/ui-motion/collapsible"));
    await expect(page.locator("h1", { hasText: "UI Motion" })).toBeVisible();

    const trigger = page.getByTestId("ui-motion-collapsible-trigger-src");
    const status = page.getByTestId("ui-motion-collapsible-status-src");
    const nestedFile = page.getByTestId("ui-motion-collapsible-file-src-index.ts");

    await expect(status).toHaveText("Collapsed");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("ui-motion-collapsible-file-src-index.ts")).toHaveCount(0);

    await trigger.click();
    await trigger.click();
    await trigger.click();

    await expect(status).toHaveText("Expanded");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(nestedFile).toBeVisible();

    await trigger.click();
    await expect(status).toHaveText("Collapsed");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("ui-motion-collapsible-file-src-index.ts")).toHaveCount(0);

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("collapsible with-motion route is reachable from collapsible docs", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/collapsible/with-motion"));
    await expect(page.locator("h1", { hasText: "Collapsible" })).toBeVisible();
    await expect(page.getByTestId("ui-motion-collapsible-tree")).toBeVisible();

    expect(issues, issues.join("\n")).toEqual([]);
  });
});

test.describe("UI Motion docs polish QA", () => {
  test.skip(!docsShowMotion, "Motion docs are hidden");
  test("dialog with-motion route reuses the shared profile example", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/dialog/with-motion"));
    await expect(page.locator("h1", { hasText: "Dialog" })).toBeVisible();
    await expect(
      page.locator("section#with-motion").getByRole("button", { name: "Edit profile" }),
    ).toBeVisible();
    await expect(page.locator("section#with-motion .docs-ui-motion-link")).toContainText(
      "UI Motion",
    );

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("components grid links to UI Motion", async ({ page }) => {
    await page.goto(docsRoute("docs/components"));
    await expect(page.locator("h1", { hasText: "Components" })).toBeVisible();

    const gridLink = page.locator("a.docs-component-item").filter({ hasText: "UI Motion" }).first();
    await expect(gridLink).toHaveAttribute("href", /\/docs\/ui-motion\/installation$/);
  });

  test("sidebar shows new badge on UI Motion", async ({ page }) => {
    await page.goto(docsRoute("docs/ui-motion/installation"));
    const uiMotionLink = page.locator(".docs-sidebar nav a.docs-nav-button", {
      hasText: "UI Motion",
    });
    await expect(uiMotionLink).toBeVisible();
    await expect(uiMotionLink.getByText("new", { exact: true })).toBeVisible();
  });

  test("View Markdown dialog works on UI Motion installation", async ({ page }) => {
    await page.goto(docsRoute("docs/ui-motion/installation"));
    await page.getByRole("button", { name: "View Markdown" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Markdown for UI Motion" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("mobile navigation lists UI Motion", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(docsRoute("docs/ui-motion/installation"));
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const mobileNav = page.locator(
      '[aria-label="Docs navigation panel"] nav[aria-label="Mobile docs navigation"]',
    );
    await expect(mobileNav.getByRole("link", { name: /UI Motion/ })).toBeVisible();
    await page.keyboard.press("Escape");
  });

  for (const route of UI_MOTION_ROUTES) {
    test(`axe: ${route} has no blocking violations outside code blocks`, async ({ page }) => {
      await page.goto(docsRoute(route));
      await expect(page.locator("main.docs-content")).toBeVisible();
      await assertNoBlockingA11yViolations(page, route, {
        include: "main.docs-content",
        exclude: A11Y_EXCLUDE,
      });
    });
  }

  for (const route of WITH_MOTION_ROUTES) {
    test(`axe: ${route} with-motion section has no blocking violations`, async ({ page }) => {
      await page.goto(docsRoute(route));
      await expect(page.locator("section#with-motion")).toBeVisible();
      await assertNoBlockingA11yViolations(page, route, {
        include: "section#with-motion",
        exclude: A11Y_EXCLUDE,
      });
    });
  }

  test("overlay demos restore scroll lock and leave no orphaned portals", async ({ page }) => {
    const issues = collectConsoleIssues(page);

    await page.goto(docsRoute("docs/ui-motion/dialog"));
    const trigger = page.getByRole("button", { name: "Edit profile" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Edit profile" });
    await expect(dialog).toBeVisible();

    const overflowWhileOpen = await page.evaluate(() => document.body.style.overflow);
    expect(overflowWhileOpen === "hidden" || overflowWhileOpen === "").toBeTruthy();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 10_000 });

    const portalCount = await page.locator('[data-slot="dialog-portal"]').count();
    expect(portalCount).toBe(0);

    const overflowAfterClose = await page.evaluate(() => document.body.style.overflow);
    expect(overflowAfterClose).not.toBe("hidden");

    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("reduced motion policies user always and never", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "prefers-reduced-motion emulation is chromium-only");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(docsRoute("docs/ui-motion/reduced-motion"));
    const status = page.getByTestId("ui-motion-reduced-status");
    await expect(status).toContainText("reduced: yes");

    await page.getByRole("button", { name: "always", exact: true }).click();
    await expect(status).toContainText("policy: always");
    await expect(status).toContainText("reduced: yes");

    await page.getByRole("button", { name: "never", exact: true }).click();
    await expect(status).toContainText("policy: never");
    await expect(status).toContainText("reduced: no");
  });

  test("stable screenshots at 375px tablet and desktop in light and dark", async ({ page }) => {
    const viewports = [
      { name: "mobile", width: 375, height: 812 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1440, height: 900 },
    ] as const;

    for (const theme of ["light", "dark"] as const) {
      if (theme === "dark") {
        await page.emulateMedia({ colorScheme: "dark" });
      } else {
        await page.emulateMedia({ colorScheme: "light" });
      }

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(docsRoute("docs/ui-motion/installation"));
        await expect(page.locator("h1", { hasText: "UI Motion" })).toBeVisible();
        await expect(page.locator("main .preview").first()).toBeVisible();
        await expect(page).toHaveScreenshot(
          `ui-motion-installation-${theme}-${viewport.name}.png`,
          {
            fullPage: false,
            mask: [page.locator(".docs-tabs-list"), page.locator(".docs-topbar")],
          },
        );
      }
    }
  });
});
