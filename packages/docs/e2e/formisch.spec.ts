import { expect, test } from "@playwright/test";

test.describe("Forms / Formisch docs", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (error) => {
      throw error;
    });
    page.on("console", (message) => {
      if (message.type() === "error") throw new Error(message.text());
    });
  });

  test("desktop and mobile navigation expose Forms and open Formisch", async ({ page }) => {
    await page.goto("./docs/components");
    await expect(
      page.locator("aside.docs-sidebar").getByRole("heading", { name: "Forms" }),
    ).toHaveCount(0);

    await page.locator(".docs-topbar-links").getByRole("link", { name: "Forms" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Forms" })).toBeVisible();
    await expect(
      page.locator("aside.docs-sidebar").getByRole("heading", { name: "Forms" }),
    ).toBeVisible();
    await page
      .locator("aside.docs-sidebar nav[aria-label='Docs forms']")
      .getByRole("link", { name: "Formisch" })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Formisch" })).toBeVisible();

    await page.setViewportSize({ width: 600, height: 900 });
    await page.goto("./docs/forms");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(
      page.locator(".docs-mobile-sheet-group-label", { hasText: "Forms" }),
    ).toBeVisible();
    await page
      .locator("[aria-label='Mobile docs navigation']")
      .getByRole("link", { name: "Formisch" })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Formisch" })).toBeVisible();
  });

  test("deep links render all Formisch sections", async ({ page }) => {
    for (const section of [
      "installation",
      "usage",
      "demo",
      "approach",
      "form-methods",
      "anatomy",
      "schema-and-setup",
      "validation",
      "validation-modes",
      "displaying-errors",
      "input",
      "textarea",
      "select",
      "checkbox",
      "radio-group",
      "switch",
      "complex-forms",
      "resetting-form",
      "array-fields",
      "accessibility",
      "sources",
    ]) {
      await page.goto(`./docs/formisch/${section}`);
      await expect(page.locator(`section#${section}`)).toBeVisible();
    }
  });

  test("bug report validation, submit and reset work", async ({ page }) => {
    await page.goto("./docs/formisch/demo");
    const demo = page.locator("section#demo");
    await demo.getByRole("button", { name: "Submit" }).click();
    await expect(demo.getByText("Use at least 5 characters.")).toBeVisible();
    await expect(demo.getByText("Describe the problem in at least 20 characters.")).toBeVisible();
    await demo.getByLabel("Bug Title").fill("Broken menu");
    await demo
      .getByLabel("Description")
      .fill("The menu closes before I can choose the second item.");
    await demo.getByRole("button", { name: "Submit" }).click();
    await expect(demo.getByText('"title": "Broken menu"')).toBeVisible();
    await demo.getByRole("button", { name: "Reset" }).click();
    await expect(demo.getByText('"title": "Broken menu"')).toBeHidden();
    await expect(demo.getByLabel("Bug Title")).toHaveValue("");
  });

  test("select, checkbox, radio group and switch update state", async ({ page }) => {
    await page.goto("./docs/formisch/select");
    const select = page.locator("section#select");
    await select.getByRole("button", { name: "Spoken Language" }).click();
    await page.getByRole("option", { name: "German" }).click();
    await select.getByRole("button", { name: "Save" }).click();
    await expect(select.getByText('"language": "de"')).toBeVisible();

    await page.goto("./docs/formisch/checkbox");
    const checkbox = page.locator("section#checkbox");
    await checkbox.getByLabel("product").check();
    await checkbox.getByRole("button", { name: "Save" }).click();
    await expect(checkbox.getByText('"product"')).toBeVisible();

    await page.goto("./docs/formisch/radio-group");
    const radio = page.locator("section#radio-group");
    await radio.getByRole("radio", { name: /Enterprise/i }).check();
    await radio.getByRole("button", { name: "Save" }).click();
    await expect(radio.getByText('"plan": "enterprise"')).toBeVisible();

    await page.goto("./docs/formisch/switch");
    const sw = page.locator("section#switch");
    await sw.getByRole("switch", { name: /Multi-factor/i }).click();
    await sw.getByRole("button", { name: "Save" }).click();
    await expect(sw.getByText('"mfa": true')).toBeVisible();
  });

  test("FieldArray adds, removes, caps at five and validates email", async ({ page }) => {
    await page.goto("./docs/formisch/array-fields");
    const section = page.locator("section#array-fields");
    await section.getByRole("button", { name: "Add email" }).click();
    await expect(section.getByRole("textbox", { name: "Email 2" })).toBeVisible();
    await section.getByRole("button", { name: "Remove email 2" }).click();
    await expect(section.getByRole("textbox", { name: "Email 2" })).toBeHidden();
    for (let i = 0; i < 4; i += 1) await section.getByRole("button", { name: "Add email" }).click();
    await expect(section.getByRole("button", { name: "Add email" })).toBeDisabled();
    await section.getByRole("textbox", { name: "Email 1" }).fill("not-an-email");
    await section.getByRole("button", { name: "Save" }).click();
    await expect(section.getByText("Enter a valid email address.")).toBeVisible();
  });
});
