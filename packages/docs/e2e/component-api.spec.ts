import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
});

test("component prop links open the source definition, including after it was closed", async ({
  page,
}) => {
  await page.goto("./docs/progress/installation#component-props");
  const owner = page.locator(".blocks-api-field-owner").first();
  await expect(owner).toHaveText("ProgressProps");
  await owner.click();
  const toggle = page.locator("#component-type-Progress-ProgressProps-trigger");
  const source = page.locator("#component-type-Progress-ProgressProps-content");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(source).toContainText("value?: number | null");
  await expect(source).toContainText("packages/core/src/components/progress/Progress.tsx");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await owner.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#integration-guide")).toContainText("TaskProgress");
  await expect(page.locator(".component-composition")).toContainText("recovery instructions");
});

test("Formisch distinguishes local required props from library integration contracts", async ({
  page,
}) => {
  await page.goto("./docs/formisch/installation#component-props");
  await expect(
    page.getByRole("heading", { name: "Form props and contracts", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Required prop: idPrefix", exact: true }),
  ).toBeVisible();
  await page.locator(".blocks-api-field-owner", { hasText: "ExampleProps" }).click();
  const definition = page.locator("#component-type-FormischExamples-ExampleProps-content");
  await expect(definition).toBeVisible();
  await expect(definition).toContainText("idPrefix: string");
  await expect(page.locator("#api-reference")).toContainText("Formisch integration");
  await expect(page.locator("#integration-guide")).toContainText("ContactFormProps");
});

for (const width of [320, 768, 1440]) {
  test(`API tables contain their scrolling and type cards remain usable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of ["progress", "accordion", "formisch"]) {
      await page.goto(`./docs/${slug}/installation#component-data-types`);
      const trigger = page.locator(".blocks-api-type-trigger").first();
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await trigger.scrollIntoViewIfNeeded();
      await trigger.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true);
      await expect(page.locator(".blocks-api-types .docs-copy-code-button").first()).toBeVisible();
      await expect(page.locator('.blocks-api-props-table th[scope="row"]').first()).toHaveCSS(
        "text-transform",
        "none",
      );
      await expect(page.locator(".blocks-api-props-table table").first()).toHaveCSS(
        "margin-top",
        "0px",
      );

      if (width === 1440) {
        const contents = page.locator(".blocks-doc-toc");
        await expect(
          contents.locator('a[href="#api-reference"] + ul a[href="#component-props"]'),
        ).toHaveCount(1);
        await expect(
          contents.locator('a[href="#api-reference"] + ul a[href="#component-data-types"]'),
        ).toHaveCount(1);
      }
    }
  });
}
