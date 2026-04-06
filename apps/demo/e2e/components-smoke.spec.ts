import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("core component docs smoke", () => {
  test("Tooltip opens on hover and closes on mouse leave", async ({ page }) => {
    await page.goto("/docs/tooltip/basic-tooltip");
    await expect(page.locator("h1", { hasText: "Tooltip" })).toBeVisible();

    const trigger = page
      .locator("[data-slot='tooltip-trigger']")
      .filter({ hasText: "Hover" })
      .first();
    await trigger.hover();

    const tooltip = page
      .locator("[data-slot='tooltip-content']")
      .filter({ hasText: "Add to library" });
    await expect(tooltip).toBeVisible();

    await trigger.hover();
    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
  });

  test("Toggle changes aria-pressed state on click", async ({ page }) => {
    await page.goto("/docs/toggle/toggle-options");
    await expect(page.locator("h1", { hasText: "Toggle" })).toBeVisible();

    const italicToggle = page.locator("[data-slot='toggle'][aria-label='Toggle italic']").first();
    await expect(italicToggle).toHaveAttribute("aria-pressed", "false");

    await italicToggle.click();
    await expect(italicToggle).toHaveAttribute("aria-pressed", "true");
  });

  test("ToggleGroup single and multiple interactions work", async ({ page }) => {
    await page.goto("/docs/toggle-group/single-selection");
    await expect(page.locator("h1", { hasText: "Toggle Group" })).toBeVisible();

    const left = page.getByRole("button", { name: "Align left" }).first();
    const center = page.getByRole("button", { name: "Align center" }).first();

    await expect(left).toHaveAttribute("aria-pressed", "true");
    await center.click();
    await expect(center).toHaveAttribute("aria-pressed", "true");
    await expect(left).toHaveAttribute("aria-pressed", "false");

    const bold = page.getByRole("button", { name: "Toggle bold" }).first();
    const italic = page.getByRole("button", { name: "Toggle italic" }).first();

    await expect(bold).toHaveAttribute("aria-pressed", "true");
    await italic.click();
    await expect(italic).toHaveAttribute("aria-pressed", "true");
    await expect(bold).toHaveAttribute("aria-pressed", "true");
  });

  test("Typography docs render modernized variants", async ({ page }) => {
    await page.goto("/docs/typography/full-example");
    await expect(page.locator("h1", { hasText: "Typography" })).toBeVisible();

    await expect(
      page.locator("section#h1").getByText("Taxing Laughter: The Joke Tax Chronicles"),
    ).toBeVisible();
    await expect(page.locator("section#h2").getByText("The People's Rebellion")).toBeVisible();
    await expect(
      page.locator("section#h4").getByText("People stopped telling jokes"),
    ).toBeVisible();

    await page.goto("/docs/typography/inline-code");
    await expect(page.locator("section#inline-code").getByRole("code")).toContainText(
      /@radix-ui\/react-alert-dialog/,
    );
    await expect(
      page.locator("section#list").getByText("1st level of puns: 5 gold coins"),
    ).toBeVisible();
    await expect(page.locator("section#table").getByText("King's Treasury")).toBeVisible();
  });

  test("Textarea production field validates and updates character count", async ({ page }) => {
    await page.goto("/docs/textarea/textarea-production-field");
    await expect(page.locator("h1", { hasText: "Textarea" })).toBeVisible();

    const textarea = page.getByPlaceholder("What changed, and why does it matter?");
    const helper = page.getByText("Looks good.");
    const section = page.locator("section#textarea-production-field");
    const counter = section.getByText(/^\d+\/180$/);

    await expect(helper).toBeVisible();
    await expect(counter).toHaveText("0/180");

    await textarea.fill("Too short");
    await expect(page.getByText("Minimum 20 characters required.")).toBeVisible();
    await expect(counter).not.toHaveText("0/180");
    await expect(textarea).toHaveAttribute("aria-invalid", "true");

    await textarea.fill("Released a clearer onboarding walkthrough for first-time users.");
    await expect(page.getByText("Looks good.")).toBeVisible();
    await expect(counter).toHaveText("63/180");
    await expect(textarea).not.toHaveAttribute("aria-invalid", "true");
  });

  test("A11y checks pass for tooltip, toggle, toggle group and typography docs", async ({
    page,
  }) => {
    await page.goto("/docs/tooltip/basic-tooltip");
    await page.locator("#basic-tooltip").waitFor({ state: "attached" });
    const tooltipA11y = await new AxeBuilder({ page }).include("#basic-tooltip").analyze();
    expect(tooltipA11y.violations).toEqual([]);

    await page.goto("/docs/toggle/toggle-options");
    await page.locator("#toggle-options").waitFor({ state: "attached" });
    const toggleA11y = await new AxeBuilder({ page }).include("#toggle-options").analyze();
    expect(toggleA11y.violations).toEqual([]);

    await page.goto("/docs/toggle-group/single-selection");
    await page.locator("#single-selection").waitFor({ state: "attached" });
    const toggleGroupA11y = await new AxeBuilder({ page }).include("#single-selection").analyze();
    expect(toggleGroupA11y.violations).toEqual([]);

    await page.goto("/docs/typography/h1");
    await page.locator("#h1").waitFor({ state: "attached" });
    const typographyA11y = await new AxeBuilder({ page }).include("#h1").analyze();
    expect(typographyA11y.violations).toEqual([]);

    await page.goto("/docs/textarea/textarea-production-field");
    await page.locator("#textarea-production-field").waitFor({ state: "attached" });
    const textareaA11y = await new AxeBuilder({ page })
      .include("#textarea-production-field")
      .analyze();
    expect(textareaA11y.violations).toEqual([]);

    await page.goto("/docs/sheet/basic-sheet");
    await page.locator("#basic-sheet").waitFor({ state: "attached" });
    const sheetA11y = await new AxeBuilder({ page }).include("#basic-sheet").analyze();
    expect(sheetA11y.violations).toEqual([]);
  });

  test("Visual snapshots stay stable for tooltip, toggle, toggle group and typography", async ({
    page,
  }) => {
    await page.goto("/docs/tooltip/basic-tooltip");
    await expect(page).toHaveScreenshot("tooltip-doc.png", { fullPage: false });

    await page.goto("/docs/toggle/toggle-options");
    await expect(page).toHaveScreenshot("toggle-doc.png", { fullPage: false });

    await page.goto("/docs/toggle-group/single-selection");
    await expect(page).toHaveScreenshot("toggle-group-doc.png", { fullPage: false });

    await page.goto("/docs/typography/full-example");
    await expect(page).toHaveScreenshot("typography-doc.png", { fullPage: false });
  });

  test("Visual snapshot stays stable for textarea production field", async ({ page }) => {
    await page.goto("/docs/textarea/textarea-production-field");
    await expect(page).toHaveScreenshot("textarea-doc.png", { fullPage: false });
  });

  test("Visual snapshot stays stable for sheet basic example", async ({ page }) => {
    await page.goto("/docs/sheet/basic-sheet");
    await expect(page.locator("h1", { hasText: "Sheet" })).toBeVisible();
    await expect(page).toHaveScreenshot("sheet-doc.png", { fullPage: false });
  });
});
