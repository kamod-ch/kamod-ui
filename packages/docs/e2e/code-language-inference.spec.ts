import { expect, test } from "@playwright/test";

for (const dark of [false, true]) {
  test(`unlabelled definition source is highlighted (${dark ? "dark" : "light"})`, async ({
    page,
  }, testInfo) => {
    await page.goto("./component-preview-frame.htm?component=type-definition&example=0");
    await expect(page.locator("#component-preview-root")).toHaveAttribute(
      "data-preview-ready",
      "true",
    );
    await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
    const toggle = page.getByRole("button", { name: /View Definition/ }).first();
    await toggle.click();
    const code = page.locator("pre code");
    await code.scrollIntoViewIfNeeded();
    await expect(code).toHaveClass(/language-typescript/);
    await expect(code.locator(".token.keyword").first()).toBeVisible();
    expect(
      await code
        .locator(".token.keyword")
        .first()
        .evaluate(
          (token) =>
            getComputedStyle(token).color !== getComputedStyle(token.closest("code")!).color,
        ),
    ).toBe(true);
    const source = await code.textContent();
    expect(source).toContain("type NavigationItem");
    await page.getByRole("button", { name: /Hide Definition/ }).click();
    await page.getByRole("button", { name: /View Definition/ }).click();
    await expect(code.locator(".token.keyword").first()).toBeVisible();
    expect(await code.textContent()).toBe(source);
    await page.setViewportSize({ width: 320, height: 850 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page
      .locator('[data-slot="type-definition"]')
      .screenshot({ path: testInfo.outputPath(`${dark ? "dark" : "light"}-inferred.png`) });
  });
}

test("theming guide keeps its inferred file grammar and syntax colors", async ({ page }) => {
  await page.goto("./docs/theming/installation#tailwind-preset");
  const snippet = page
    .locator(".docs-code-wrap")
    .filter({ has: page.locator(".docs-code-file-path", { hasText: "tailwind.config.ts" }) })
    .first();
  await snippet.scrollIntoViewIfNeeded();
  await expect(snippet.locator("pre")).toHaveAttribute("data-language", "typescript");
  await expect(snippet.locator("pre .token.keyword").first()).toBeVisible();
});

for (const dark of [false, true]) {
  test(`sidebar state source retains syntax colors after navigation and reading toggles (${dark ? "dark" : "light"})`, async ({
    page,
  }) => {
    await page.goto("./blocks/application-shell");
    await page
      .locator('a[href$="/blocks/application-shell/application-shell-1"]')
      .filter({ visible: true })
      .first()
      .click();
    await expect(page.locator("#application-shell-state")).toBeAttached();
    await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
    const snippet = page
      .locator(".docs-code-wrap")
      .filter({
        has: page.locator("pre", { hasText: "export const AppFrame" }),
      })
      .first();
    await snippet.scrollIntoViewIfNeeded();
    const source = snippet.locator("pre code");
    const original = await source.textContent();
    const language = snippet.getByRole("link", { name: "TypeScript", exact: true });
    await expect(language).toHaveAttribute("href", "https://www.typescriptlang.org/");
    await expect(language.locator("svg")).toHaveCount(2);
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const wrap of [true, false]) {
        await snippet.getByRole("switch", { name: "Wrap code lines" }).setChecked(wrap);
        await snippet.getByRole("button", { name: "Hide imports", exact: true }).click();
        await expect(source).not.toContainText("import { useState }");
        await snippet.getByRole("button", { name: "Show imports", exact: true }).click();
        await expect(source).toHaveText(original!, { useInnerText: false });
        const keyword = source.locator(".token.keyword").first();
        await expect(keyword).toBeVisible();
        expect(
          await keyword.evaluate(
            (el) => getComputedStyle(el).color !== getComputedStyle(el.closest("code")!).color,
          ),
        ).toBe(true);
      }
      expect(await snippet.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
  });
}
