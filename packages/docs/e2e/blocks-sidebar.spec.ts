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

  test("lists all sidebar blocks and opens isolated previews", async ({ page }) => {
    await page.goto("./blocks/sidebar");
    await expect(
      page.getByRole("heading", { level: 1, name: "Building Blocks for the Web" }),
    ).toBeVisible();
    await expect(
      page.locator("aside.docs-sidebar").getByRole("heading", { name: "Blocks" }),
    ).toBeVisible();
    for (const id of ids) {
      await expect(page.locator(`article#${id}`)).toBeAttached();
    }
    const firstCard = page.locator("article#sidebar-01");
    await expect(firstCard.locator(".blocks-preview-host")).toContainText("Data Fetching", {
      timeout: 15_000,
    });
  });

  test("loads sidebar overview without console errors while scrolling", async ({ page }) => {
    await page.goto("./blocks/sidebar");
    await page.locator("article#sidebar-16").scrollIntoViewIfNeeded();
    await expect(page.locator("article#sidebar-16")).toBeVisible();
    await page.locator("article#sidebar-01").scrollIntoViewIfNeeded();
    await expect(page.locator("article#sidebar-01")).toBeVisible();
  });

  test("code tab shows file tree and install path", async ({ page }) => {
    await page.goto("./blocks/sidebar");
    const firstCard = page.locator("article#sidebar-01");
    await firstCard.getByRole("tab", { name: "Code" }).click();
    await expect(firstCard.getByText("@kamod-ch/blocks/sidebar/sidebar-01")).toBeVisible();
    await expect(firstCard.getByRole("button", { name: "page.tsx" })).toBeVisible();
    await firstCard.getByRole("button", { name: "app-sidebar.tsx" }).click();
    await expect(firstCard.locator(".blocks-code-pane")).toContainText("AppSidebar");
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
