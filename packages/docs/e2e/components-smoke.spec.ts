import { expect, test } from "@playwright/test";

test.describe("core component docs smoke", () => {
  test("Tooltip opens on hover and closes on mouse leave", async ({ page }) => {
    await page.goto("./docs/tooltip/basic-tooltip");
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
    await page.goto("./docs/toggle/toggle-options");
    await expect(page.locator("h1", { hasText: "Toggle" })).toBeVisible();

    const italicToggle = page.locator("[data-slot='toggle'][aria-label='Toggle italic']").first();
    await expect(italicToggle).toHaveAttribute("aria-pressed", "false");

    await italicToggle.click();
    await expect(italicToggle).toHaveAttribute("aria-pressed", "true");
  });

  test("ToggleGroup single and multiple interactions work", async ({ page }) => {
    await page.goto("./docs/toggle-group/single-selection");
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
    await page.goto("./docs/typography/full-example");
    await expect(page.locator("h1", { hasText: "Typography" })).toBeVisible();

    await expect(
      page.locator("section#h1").getByText("Taxing Laughter: The Joke Tax Chronicles"),
    ).toBeVisible();
    await expect(page.locator("section#h2").getByText("The People's Rebellion")).toBeVisible();
    await expect(
      page.locator("section#h4").getByText("People stopped telling jokes"),
    ).toBeVisible();

    await page.goto("./docs/typography/inline-code");
    await expect(page.locator("section#inline-code").getByRole("code")).toContainText(
      /@radix-ui\/react-alert-dialog/,
    );
    await expect(
      page.locator("section#list").getByText("1st level of puns: 5 gold coins"),
    ).toBeVisible();
    await expect(page.locator("section#table").getByText("King's Treasury")).toBeVisible();
  });

  test("Textarea production field validates and updates character count", async ({ page }) => {
    await page.goto("./docs/textarea/textarea-production-field");
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

  test("Visual snapshots stay stable for tooltip, toggle, toggle group and typography", async ({
    page,
  }) => {
    await page.goto("./docs/tooltip/basic-tooltip");
    await expect(page).toHaveScreenshot("tooltip-doc.png", { fullPage: false });

    await page.goto("./docs/toggle/toggle-options");
    await expect(page).toHaveScreenshot("toggle-doc.png", { fullPage: false });

    await page.goto("./docs/toggle-group/single-selection");
    await expect(page).toHaveScreenshot("toggle-group-doc.png", { fullPage: false });

    await page.goto("./docs/typography/full-example");
    await expect(page).toHaveScreenshot("typography-doc.png", { fullPage: false });
  });

  test("Visual snapshot stays stable for textarea production field", async ({ page }) => {
    await page.goto("./docs/textarea/textarea-production-field");
    await expect(page).toHaveScreenshot("textarea-doc.png", { fullPage: false });
  });

  test("Visual snapshot stays stable for sheet basic example", async ({ page }) => {
    await page.goto("./docs/sheet/basic-sheet");
    await expect(page.locator("h1", { hasText: "Sheet" })).toBeVisible();
    await expect(page).toHaveScreenshot("sheet-doc.png", { fullPage: false });
  });

  test("Dialog opens from basic example and closes on Escape", async ({ page }) => {
    await page.goto("./docs/dialog/basic-dialog");
    await page.locator("#basic-dialog").getByRole("button", { name: "Open dialog" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Are you absolutely sure?" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("Sheet opens from basic example", async ({ page }) => {
    await page.goto("./docs/sheet/basic-sheet");
    await page.locator(".preview").first().getByRole("button", { name: "Open" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("heading", { name: "Edit profile" })).toBeVisible();
  });

  test("Context menu opens on right-click in basic example", async ({ page }) => {
    await page.goto("./docs/context-menu/basic-example");
    const trigger = page.locator("#basic-example").getByText("Right click here");
    await trigger.click({ button: "right" });
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Back" })).toBeVisible();
  });

  test("View Markdown dialog opens on component doc pages", async ({ page }) => {
    await page.goto("./docs/button/installation");
    await page.getByRole("button", { name: "View Markdown" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Markdown for Button" })).toBeVisible();
  });

  test("Synced tabs keep groups in sync", async ({ page }) => {
    await page.goto("./docs/tabs/synced-tabs");
    const preview = page.locator("#synced-tabs .preview");
    const tabLists = preview.locator("[data-slot='tabs-list']");
    await expect(tabLists).toHaveCount(2);
    await tabLists.nth(0).getByRole("tab", { name: "Vue" }).click();
    await expect(tabLists.nth(0).getByRole("tab", { name: "Vue" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(tabLists.nth(1).getByRole("tab", { name: "Vue" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("Radio group selection updates on click", async ({ page }) => {
    await page.goto("./docs/radio-group/radio-default-labels");
    const preview = page.locator(".preview").first();
    const optionTwo = preview.getByLabel("Option two");
    await optionTwo.click();
    await expect(optionTwo).toBeChecked();
    await expect(preview.getByLabel("Option one")).not.toBeChecked();
  });

  test("Tree expands via chevron and selects on row click", async ({ page }) => {
    await page.goto("./docs/tree/single-selection");
    await expect(page.locator("h1", { hasText: "Tree" })).toBeVisible();

    const preview = page.locator("#single-selection .preview");
    await preview.scrollIntoViewIfNeeded();
    const documents = preview.getByRole("treeitem", { name: "Documents" });
    const chevron = documents.locator('[data-slot="tree-item-chevron"]');

    await expect(documents).toHaveAttribute("aria-expanded", "true");
    await chevron.click();
    await expect(documents).toHaveAttribute("aria-expanded", "false");

    await documents.click();
    await expect(documents).toHaveAttribute("aria-selected", "true");
    await expect(documents).toHaveAttribute("aria-expanded", "false");
  });

  test("Accordion toggles and settles without runaway height animation", async ({ page }) => {
    await page.goto("./docs/accordion/basic");
    await expect(page.locator("h1", { hasText: "Accordion" })).toBeVisible();

    const preview = page.locator(".preview").first();
    const first = preview.getByRole("button", { name: "How do I reset my password?" });
    const second = preview.getByRole("button", { name: "Can I change my subscription plan?" });

    await expect(first).toHaveAttribute("aria-expanded", "true");

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");

    const content = preview.locator('[data-slot="accordion-content"][data-state="open"]').first();

    await expect(content).toBeVisible();
    await page.waitForTimeout(400);

    const heightAfterSettle = await content.evaluate((node) => node.style.height);
    await page.waitForTimeout(200);
    await expect(content).toHaveJSProperty("style.height", heightAfterSettle);
  });

  test("DatePicker opens calendar popover", async ({ page }) => {
    await page.goto("./docs/date-picker/date-picker-convenience");
    await page
      .locator("#date-picker-convenience")
      .getByRole("button", { name: "Pick a date" })
      .first()
      .click();
    await expect(
      page.locator("[data-slot='popover-content'] [data-slot='calendar']"),
    ).toBeVisible();
  });
});
