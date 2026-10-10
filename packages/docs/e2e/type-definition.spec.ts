import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
});

for (const width of [320, 768, 1440]) {
  for (const dark of [false, true]) {
    test(`definition background, hover and keyboard work at ${width}px in ${dark ? "dark" : "light"}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(
        "./blocks/application-shell/application-shell-1#application-shell-type-ApplicationShellBrand",
      );
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(
        (isDark) => document.documentElement.classList.toggle("dark", isDark),
        dark,
      );
      const trigger = page.locator("#application-shell-type-ApplicationShellBrand-trigger");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await trigger.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const muted = await trigger.evaluate((element) => {
        const sample = document.createElement("span");
        sample.style.background = "var(--muted)";
        element.append(sample);
        const color = getComputedStyle(sample).backgroundColor;
        sample.remove();
        return color;
      });
      await expect(trigger).toHaveCSS("background-color", muted);
      await expect(
        page
          .locator('[data-slot="type-definition"]')
          .filter({ has: page.locator("#application-shell-type-ApplicationShellBrand") })
          .locator('[data-slot="type-definition-name"]'),
      ).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await trigger.hover();
      await expect
        .poll(() => trigger.evaluate((el) => getComputedStyle(el).backgroundColor))
        .not.toBe(muted);
      await page.mouse.move(0, 0);
      await trigger.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveCSS("background-color", muted);
      await trigger.press("Space");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(
        page.locator("#application-shell-type-ApplicationShellBrand-content"),
      ).toContainText("ApplicationShellBrand");
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true);
    });
  }
}

test("the new component page exposes examples, source-backed props and accessible guidance", async ({
  page,
}) => {
  await page.goto("./docs/type-definition/installation");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Type Definition");
  await expect(page.locator("#component-data-types")).toContainText("Data Type Reference");
  await expect(page.locator("#accessibility")).toContainText("aria-controls");
  await expect(
    page.locator('a[href*="/docs/type-definition/installation"]').first(),
  ).toBeAttached();
  const trigger = page.locator("#component-type-TypeDefinition-TypeDefinitionProps-trigger");
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(
    page.locator("#component-type-TypeDefinition-TypeDefinitionProps-content"),
  ).toContainText("headingLevel?:");
});

test("standalone examples support controlled reveal and independent compact cards", async ({
  page,
}) => {
  await page.goto("./component-preview-frame.htm?component=type-definition&example=2");
  await expect(page.locator('[data-preview-ready="true"]')).toBeAttached();
  const toggle = page.getByRole("button", { name: "View Definition: NavigationItem" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Inspect navigation contract" }).click();
  await expect(
    page.getByRole("button", { name: "Hide Definition: NavigationItem" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.goto("./component-preview-frame.htm?component=type-definition&example=3");
  const first = page.getByRole("button", { name: /definition: DisplayMode/ });
  const second = page.getByRole("button", { name: /definition: SortDirection/ });
  await first.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(second).toHaveAttribute("aria-expanded", "false");
  await second.press("Space");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "true");
});
