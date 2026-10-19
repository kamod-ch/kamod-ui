import { expect, type Page, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const readAppearance = (page: Page) =>
  page.evaluate(() => ({
    preset: document.documentElement.getAttribute("data-theme"),
    dark: document.documentElement.classList.contains("dark"),
    storage: { ...localStorage },
    cookie:
      document.cookie
        .split(";")
        .map((value) => value.trim())
        .find((value) => value.startsWith("theme=")) ?? null,
  }));

for (const width of [320, 768, 1024, 1440]) {
  test(`theming conclusion is readable and its review stays local at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(
      width === 1440
        ? "/docs/theming/finish-with-a-theme-review"
        : "/docs/theming/accessibility#finish-with-a-theme-review",
    );
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await expect(page.locator("#finish-with-a-theme-review")).toBeInViewport();
    const outro = page.locator(".theming-outro");
    const checks = outro.getByRole("checkbox");
    await expect(checks).toHaveCount(3);

    for (const appearance of ["light", "dark"] as const) {
      await page
        .getByRole("button", { name: "Choose color theme" })
        .filter({ visible: true })
        .click();
      const picker = page.getByRole("dialog", { name: "Find your Palette" });
      const change = picker.getByRole("button", { name: `Switch to ${appearance} mode` });
      if (await change.count()) await change.click();
      await picker.getByRole("button", { name: "Close color theme picker" }).click();
      const preferences = await readAppearance(page);
      await checks.first().focus();
      await page.keyboard.press("Space");
      await expect(checks.first()).toBeChecked();
      await checks.nth(1).check();
      await checks.nth(2).check();
      await expect(outro.getByRole("status")).toHaveText(
        "Review complete. Take it into your next screen.",
      );
      await checks.first().uncheck();
      await expect(outro.getByRole("status")).toHaveText("2 of 3 checks reviewed.");
      for (const check of await checks.all()) await check.uncheck();
      expect(await readAppearance(page)).toEqual(preferences);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(await outro.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      await assertNoBlockingA11yViolations(page, `theming conclusion ${width}px ${appearance}`, {
        include: ".theming-outro",
      });
    }
    if (width === 1440) {
      await checks.first().check();
      await page.reload();
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await expect(page.locator("#finish-with-a-theme-review")).toBeInViewport();
      await expect(outro.getByRole("status")).toHaveText("0 of 3 checks reviewed.");
      for (const check of await checks.all()) await expect(check).not.toBeChecked();
    }
    await outro.getByRole("link", { name: "Work with the tokens" }).click();
    await expect(page.locator("#token-overrides")).toBeInViewport();
    await page.goBack();
    await expect(outro).toBeVisible();
    await outro.getByRole("link", { name: "Back to the guide" }).click();
    await expect(page.locator("#page-title")).toBeInViewport();
    expect(errors).toEqual([]);
  });
}

test("the compact setup retains incoming config routes and gallery review destinations", async ({
  page,
}) => {
  await page.goto("/docs/theming/tailwind-preset");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const heading = page.locator("#tailwind-preset");
  await expect(heading).toBeInViewport();
  await expect(heading).toHaveJSProperty("tagName", "H3");
  const css = page.locator('section[aria-labelledby="css-setup"]');
  await expect(css.locator("#tailwind-preset")).toHaveCount(1);
  await expect(css.locator("pre code").filter({ hasText: "presets: [kamodThemes]" })).toBeVisible();
  await page.goto("/docs/theming/installation#finish-with-a-theme-review");
  await expect(page.locator("#finish-with-a-theme-review")).toBeInViewport();
  await expect(page.locator(".theme-study")).toHaveCount(8);
  await expect(page.locator(".prism-theme-study")).toHaveCount(24);
});
