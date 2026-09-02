import { expect, test } from "@playwright/test";

const ids = Array.from(
  { length: 16 },
  (_, index) => `sidebar-${String(index + 1).padStart(2, "0")}`,
);

test.describe("sidebar blocks docs", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (error) => {
      throw error;
    });
    page.on("console", (message) => {
      if (message.type() === "error") throw new Error(message.text());
    });
  });

  test("lists all sidebar blocks as overview cards", async ({ page }) => {
    await page.goto("./blocks/sidebar");
    await expect(
      page.getByRole("heading", { level: 1, name: "Building Blocks for the Web" }),
    ).toBeVisible();
    await expect(
      page.locator("aside.docs-sidebar").getByRole("heading", { name: "Blocks" }),
    ).toBeVisible();
    for (const hidden of ["Components", "Packages", "Forms", "Motion"]) {
      await expect(
        page.locator("aside.docs-sidebar").getByRole("heading", { name: hidden }),
      ).toHaveCount(0);
    }
    for (const id of ids) {
      await expect(
        page.locator("a.blocks-overview-card").filter({ hasText: id }).first(),
      ).toBeVisible();
    }
    await expect(page.locator("article.blocks-card")).toHaveCount(0);
  });

  test("opens a block detail page without the docs sidebar", async ({ page }) => {
    await page.goto("./blocks/sidebar/sidebar-01");
    await expect(page.locator("aside.docs-sidebar")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "All sidebar blocks" })).toBeVisible();
    await expect(page.locator("article#sidebar-01 .blocks-preview-host")).toContainText(
      "Data Fetching",
      { timeout: 15_000 },
    );
  });

  test("viewport switcher toggles mobile iframe preview", async ({ page }) => {
    await page.goto("./blocks/sidebar/sidebar-01");
    const panel = page.locator("article#sidebar-01 .blocks-preview-panel");
    await expect(panel.getByRole("group", { name: "Preview viewport" })).toBeVisible();
    await expect(panel.locator(".blocks-preview-frame")).not.toHaveClass(/blocks-preview-mobile/);

    await panel.getByRole("button", { name: "Mobile view" }).click();
    await expect(panel.locator(".blocks-preview-frame")).toHaveClass(/blocks-preview-mobile/);
    const iframe = panel.locator("iframe.blocks-preview-iframe");
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute("src", /\/blocks\/sidebar\/sidebar-01\/preview$/);

    await panel.getByRole("button", { name: "Tablet view" }).click();
    await expect(panel.locator(".blocks-preview-frame")).toHaveClass(/blocks-preview-tablet/);

    await panel.getByRole("button", { name: "Desktop view" }).click();
    await expect(panel.locator(".blocks-preview-frame")).not.toHaveClass(/blocks-preview-mobile/);
    await expect(panel.locator(".blocks-preview-frame")).not.toHaveClass(/blocks-preview-tablet/);
    await expect(panel.locator("iframe.blocks-preview-iframe")).toHaveCount(0);
  });

  test("loads sidebar overview without console errors while scrolling", async ({ page }) => {
    await page.goto("./blocks/sidebar");
    await page
      .locator("a.blocks-overview-card")
      .filter({ hasText: "sidebar-16" })
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator("a.blocks-overview-card").filter({ hasText: "sidebar-16" }).first(),
    ).toBeVisible();
    await page
      .locator("a.blocks-overview-card")
      .filter({ hasText: "sidebar-01" })
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator("a.blocks-overview-card").filter({ hasText: "sidebar-01" }).first(),
    ).toBeVisible();
  });

  test("code tab shows file tree and install path", async ({ page }) => {
    await page.goto("./blocks/sidebar/sidebar-01");
    const blockCard = page.locator("article#sidebar-01");
    await blockCard.getByRole("tab", { name: "Code" }).click();
    await expect(blockCard.getByText("@kamod-ch/blocks/sidebar/sidebar-01")).toBeVisible();
    await expect(blockCard.getByRole("button", { name: "page.tsx" })).toBeVisible();
    await blockCard.getByRole("button", { name: "app-sidebar.tsx" }).click();
    await expect(blockCard.locator(".blocks-code-pane")).toContainText("AppSidebar");
  });

  test("preview interactions: collapse, submenus, popover, dialog, right sidebar and mobile", async ({
    page,
  }) => {
    await page.goto("./blocks/sidebar/sidebar-07/preview");
    await page.locator('[data-slot="sidebar-trigger"]').click();
    await expect(page.locator('[data-slot="sidebar"][data-state="collapsed"]')).toBeVisible();

    await page.goto("./blocks/sidebar/sidebar-05/preview");
    await page
      .getByRole("button", { name: /Playground|Models|Documentation/ })
      .first()
      .click();
    await expect(page.getByText("History").or(page.getByText("Genesis")).first()).toBeVisible();

    await page.goto("./blocks/sidebar/sidebar-06/preview");
    await page.getByRole("button", { name: "Playground" }).click();
    await expect(page.getByRole("menuitem", { name: "History" })).toBeVisible();

    await page.goto("./blocks/sidebar/sidebar-10/preview");
    await page.getByRole("button", { name: "Open sidebar popover" }).click();
    await expect(page.getByText("Favorites")).toBeVisible();

    await page.goto("./blocks/sidebar/sidebar-13/preview");
    await page.getByRole("button", { name: "Open settings" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.goto("./blocks/sidebar/sidebar-14/preview");
    await expect(page.locator('[data-side="right"]').first()).toBeVisible();
    await page.locator('[data-slot="sidebar-trigger"]').click();
    await expect(page.locator('[data-side="right"][data-state="collapsed"]').first()).toBeVisible();

    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("./blocks/sidebar/sidebar-01/preview");
    await page.locator('[data-slot="sidebar-trigger"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
