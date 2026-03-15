import { expect, test } from "@playwright/test";

test.describe("kitchen sink (demo home) smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("main landmark and hero render", async ({ page }) => {
    const main = page.getByTestId("kitchen-sink");
    await expect(main).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Kitchen Sink$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
  });

  test("/kitchen-sink alias renders same kitchen sink", async ({ page }) => {
    await page.goto("/kitchen-sink");
    await expect(page.getByTestId("kitchen-sink")).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Kitchen Sink$/i })).toBeVisible();
  });

  test("top nav exposes docs entry points", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "iphone",
      "Horizontal nav is hidden below md; mobile header is covered by kitchen-sink visual tests."
    );
    const nav = page.getByTestId("kitchen-sink-nav");
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs/button/installation");
    await expect(nav.getByRole("link", { name: "Components" })).toHaveAttribute("href", "/docs/components");
  });

  test("component showcase mounts payment + team panels", async ({ page }) => {
    const showcase = page.getByTestId("kitchen-sink-showcase");
    await expect(showcase).toBeVisible();
    await expect(page.getByTestId("kitchen-sink-payment-panel")).toBeVisible();
    await expect(showcase.getByRole("heading", { name: "Payment Method" })).toBeVisible();
    await expect(showcase.getByRole("heading", { name: "No Team Members" })).toBeVisible();
  });

  test("payment panel inputs are editable", async ({ page }) => {
    const panel = page.getByTestId("kitchen-sink-payment-panel");
    const name = panel.getByLabel("Name on Card");
    await name.fill("Ada Lovelace");
    await expect(name).toHaveValue("Ada Lovelace");
  });

  test("Get Started navigates into docs", async ({ page }) => {
    await page.getByRole("link", { name: "Get Started" }).click();
    await expect(page).toHaveURL(/\/docs\/button\//);
    await expect(page.locator("h1", { hasText: "Button" })).toBeVisible();
  });

  test("375px viewport stacks showcase panels and payment card/CVV row", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const showcase = page.getByTestId("kitchen-sink-showcase");
    const panels = showcase.locator(".landing-showcase-panel");
    await expect(panels).toHaveCount(4);
    const first = await panels.nth(0).boundingBox();
    const second = await panels.nth(1).boundingBox();
    expect(first && second).toBeTruthy();
    expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height - 12);

    const row = page.locator(".landing-payment-card-cvv-row");
    const cardBox = await row.locator(".landing-payment-card-field").boundingBox();
    const cvvBox = await row.locator(".landing-payment-cvv-field").boundingBox();
    expect(cardBox && cvvBox).toBeTruthy();
    expect(cvvBox!.y).toBeGreaterThanOrEqual(cardBox!.y + cardBox!.height - 8);
  });

  test("payment Month select opens, selects a value, and closes", async ({ page }) => {
    await page.goto("/");
    const panel = page.getByTestId("kitchen-sink-payment-panel");
    const monthTrigger = panel.locator('[data-slot="select-trigger"]').first();

    await expect(monthTrigger).toHaveAttribute("aria-expanded", "false");
    await monthTrigger.click();
    await expect(monthTrigger).toHaveAttribute("aria-expanded", "true");

    const listbox = page.locator('[data-slot="select-content"][role="listbox"]');
    await expect(listbox).toBeVisible();
    await listbox.getByRole("option", { name: "03" }).click();

    await expect(monthTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(monthTrigger).toContainText("03");
  });

  test("showcase hear-about chips toggle as checkboxes", async ({ page }) => {
    const showcase = page.getByTestId("kitchen-sink-showcase");
    const social = showcase.getByRole("checkbox", { name: "Social Media" });
    const search = showcase.getByRole("checkbox", { name: "Search Engine" });

    // Inputs use sr-only; Playwright's toBeChecked expects visibility — assert via isChecked().
    await expect(social).toBeAttached();
    await expect(search).toBeAttached();
    await expect.poll(async () => social.isChecked()).toBe(true);
    await expect.poll(async () => search.isChecked()).toBe(true);
    await showcase.getByRole("group", { name: /how did you hear about us/i }).getByText("Search Engine", { exact: true }).click();
    await expect.poll(async () => search.isChecked()).toBe(false);
    await expect.poll(async () => social.isChecked()).toBe(true);
  });
});

test.describe("kitchen sink — overlay smoke (docs)", () => {
  test("Alert Dialog opens, sets aria-expanded on trigger, closes on Cancel", async ({ page }) => {
    await page.goto("/docs/alert-dialog/basic");
    await expect(page.locator("h1", { hasText: "Alert Dialog" })).toBeVisible();

    const section = page.locator("section#basic");
    const trigger = section.getByRole("button", { name: "Show Dialog" }).first();

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const dialog = page.getByRole("dialog").filter({ hasText: "Are you absolutely sure?" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
