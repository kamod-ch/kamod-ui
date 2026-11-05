import { expect, test } from "@playwright/test";
import { docsShowMotion, isMotionDocSlug } from "../src/docs/docs-feature-flags";
import { docsRouteManifest } from "../src/docs/generated-manifest";
import {
  assertNoBlockingA11yViolations,
  componentExamplePreviewFrame,
  sectionPreviewFrame,
  waitForDocsAppReady,
  waitForFirstInstallationPreview,
} from "./a11y-utils";

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
    await page.goto(`./docs/${slug}/installation`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await waitForDocsAppReady(page);

    if (PREVIEW_LESS_SLUGS.has(slug)) {
      await expect(page.locator("main")).toBeVisible();
    } else {
      await waitForFirstInstallationPreview(page);
    }

    await assertNoBlockingA11yViolations(page, `${slug} /installation`, { include: "main" });
  });
}

test.describe("interactive accessibility states", () => {
  test("open dialog has no blocking violations and returns focus on Escape", async ({ page }) => {
    await page.goto("./docs/dialog/basic-dialog", { waitUntil: "domcontentloaded" });
    await waitForDocsAppReady(page);
    const preview = await sectionPreviewFrame(page, "basic-dialog");
    const trigger = preview.getByRole("button", { name: "Open dialog" });
    await trigger.click();

    const dialog = preview.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Are You Absolutely Sure?" })).toBeVisible();

    await assertNoBlockingA11yViolations(page, "dialog open state", {
      include: "section#basic-dialog iframe",
    });

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("open sheet has no blocking violations and returns focus on Escape", async ({ page }) => {
    await page.goto("./docs/sheet/basic-sheet", { waitUntil: "domcontentloaded" });
    await waitForDocsAppReady(page);
    const preview = await componentExamplePreviewFrame(page);
    const trigger = preview.getByRole("button", { name: "Open" });
    await trigger.click();

    const sheet = preview.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("heading", { name: "Edit Profile" })).toBeVisible();

    await assertNoBlockingA11yViolations(page, "sheet open state", {
      include: "main .component-example iframe",
    });

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("formisch invalid state has no blocking violations", async ({ page }) => {
    await page.goto("./docs/formisch/demo", { waitUntil: "domcontentloaded" });
    await waitForDocsAppReady(page);
    const demo = await sectionPreviewFrame(page, "demo");
    await demo.getByRole("button", { name: "Submit" }).click();
    await expect(demo.getByText("Use at least 5 characters.")).toBeVisible();
    await expect(demo.getByText("Describe the problem in at least 20 characters.")).toBeVisible();

    await assertNoBlockingA11yViolations(page, "formisch invalid demo", {
      include: "section#demo",
      exclude: ".docs-code-wrap",
    });
  });
});

/*
test.describe("nested overlay Escape (browser)", () => {
  test("Escape closes only the topmost portaled menu inside an open dialog", async ({ page }) => {
    await page.goto("./docs/dropdown/basic-dropdown");
    await page.getByRole("button", { name: "Open dialog with menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Actions" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
*/
