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

test("desktop keyboard navigation, collapse and account actions", async ({ page }) => {
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
  const account = page.getByRole("button", { name: "Open account menu for Alex Morgan" });
  await account.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "Account", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Billing", exact: true })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.getByRole("menuitem", { name: "Account", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(account).toBeFocused();
  await account.click();
  await page.getByRole("menuitem", { name: "Log out", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Selected Log out");
});

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
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Acme Inc", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  const account = dialog.getByRole("button", { name: "Open account menu for Alex Morgan" });
  await account.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(account).toBeFocused();
  await dialog.getByRole("link", { name: "Design Engineering", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("Selected Design Engineering");
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
