import { expect, test } from "@playwright/test";
import { docsShowMotion, isMotionDocSlug } from "../src/docs/docs-feature-flags";
import { docsRouteManifest } from "../src/docs/generated-manifest";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

/**
 * Package teaser docs render overview/CTA content without live `.preview` demos.
 * Each entry must keep a one-line reason; do not broaden this list casually.
 */
const PREVIEW_LESS_SLUGS = new Set([
  "hooks-package", // external package teaser — no in-repo live preview demos
  "i18n-package", // external package teaser — no in-repo live preview demos
  "icons-package", // external package teaser — no in-repo live preview demos
  "signals-package", // external package teaser — no in-repo live preview demos
  "state-package", // external package teaser — no in-repo live preview demos
]);

for (const { slug } of docsRouteManifest) {
  if (!docsShowMotion && isMotionDocSlug(slug)) {
    continue;
  }

  test(`${slug} docs have no blocking initial-state violations`, async ({ page }) => {
    await page.goto(`./docs/${slug}/installation`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    if (PREVIEW_LESS_SLUGS.has(slug)) {
      await expect(page.locator("main")).toBeVisible();
    } else {
      await expect(page.locator("main .preview").first()).toBeVisible();
    }

    await assertNoBlockingA11yViolations(page, `${slug} /installation`, { include: "main" });
  });
}

test.describe("interactive accessibility states", () => {
  test("open dialog has no blocking violations and returns focus on Escape", async ({ page }) => {
    await page.goto("./docs/dialog/basic-dialog");
    const trigger = page.locator("#basic-dialog").getByRole("button", { name: "Open dialog" });
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Are you absolutely sure?" })).toBeVisible();

    await assertNoBlockingA11yViolations(page, "dialog open state", {
      include: '[role="dialog"]',
    });

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("open sheet has no blocking violations and returns focus on Escape", async ({ page }) => {
    await page.goto("./docs/sheet/basic-sheet");
    const trigger = page.locator(".preview").first().getByRole("button", { name: "Open" });
    await trigger.click();

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("heading", { name: "Edit profile" })).toBeVisible();

    await assertNoBlockingA11yViolations(page, "sheet open state", {
      include: '[role="dialog"]',
    });

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("formisch invalid state has no blocking violations", async ({ page }) => {
    await page.goto("./docs/formisch/demo");
    const demo = page.locator("section#demo");
    await demo.getByRole("button", { name: "Submit" }).click();
    await expect(demo.getByText("Use at least 5 characters.")).toBeVisible();
    await expect(demo.getByText("Describe the problem in at least 20 characters.")).toBeVisible();

    await assertNoBlockingA11yViolations(page, "formisch invalid demo", {
      include: "section#demo",
      exclude: ".docs-code-wrap",
    });
  });
});
