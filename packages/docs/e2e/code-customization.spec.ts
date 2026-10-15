import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

test("language selection changes the grammar without changing or losing source", async ({
  page,
}) => {
  await page.goto("./docs/code/installation#code-language-switcher");
  const demo = page.locator('[data-code-demo="language"]');
  await demo.scrollIntoViewIfNeeded();
  const source = demo.locator("pre code");
  await expect(source.locator(".token.keyword").first()).toBeVisible();
  const original = await source.textContent();
  await demo.getByLabel("Highlighting language").selectOption("text");
  await expect(demo.locator("pre")).toHaveAttribute("data-language", "text");
  await expect(source.locator(".token")).toHaveCount(0);
  expect(await source.textContent()).toBe(original);
  await demo.getByLabel("Highlighting language").selectOption("typescript");
  await expect(demo.locator("pre")).toHaveAttribute("data-language", "typescript");
  await expect(source.locator(".token.keyword").first()).toBeVisible();
  expect(await source.textContent()).toBe(original);
});

test("visible parts and externally owned preferences stay independent", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./docs/code/installation#code-visible-parts");
  const parts = page.locator('[data-code-demo="parts"]');
  await parts.scrollIntoViewIfNeeded();
  const header = parts.getByRole("switch", { name: "Header", exact: true });
  const reset = parts.getByRole("button", { name: "Reset visible parts" });
  await expect(reset).toBeDisabled();
  await expect(header).toHaveAccessibleDescription("A shared home for the file and actions.");
  await header.focus();
  await page.keyboard.press("Space");
  await expect(header).not.toBeChecked();
  await expect(parts.locator('[data-slot="code-toolbar"]')).toHaveCount(0);
  await expect(parts.getByRole("switch", { name: "File label", exact: true })).toBeChecked();
  await expect(parts.getByRole("switch", { name: "Copy action", exact: true })).toBeChecked();
  await expect(parts.getByRole("switch", { name: "Wrap code lines" })).toBeVisible();
  await parts.getByRole("switch", { name: "Import folding", exact: true }).click();
  await expect(parts.locator("pre code")).toContainText("import { Button }");
  const completeSource = await parts.locator("pre code").textContent();
  await parts.getByRole("switch", { name: "Syntax colors", exact: true }).click();
  await expect(parts.locator("pre .token")).toHaveCount(0);
  await parts.getByRole("switch", { name: "Wrap control", exact: true }).click();
  await expect(parts.locator('[data-slot="code-imports"]')).toHaveCount(0);
  await expect(parts.locator(".kamod-code")).toHaveClass(/is-wrapped/);
  await parts.getByRole("switch", { name: "Context before and after source", exact: true }).click();
  await expect(parts.locator(".code-parts-source-note")).toHaveCount(2);
  await expect(parts.locator("pre code")).not.toContainText("A reusable action");
  await reset.click();
  await expect(reset).toBeDisabled();
  await expect(header).toBeChecked();
  await expect(parts.locator(".code-parts-source-note")).toHaveCount(0);
  await expect(parts.locator("pre .token.keyword").first()).toBeVisible();
  await expect(parts.locator("pre code")).not.toContainText("import { Button }");
  await parts.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(completeSource);

  const preferences = page.locator('[data-code-demo="preferences"]');
  await preferences.scrollIntoViewIfNeeded();
  await preferences.getByLabel("Wrap source lines", { exact: true }).uncheck();
  await expect(preferences.getByRole("switch", { name: "Wrap code lines" })).not.toBeChecked();
  await preferences.getByRole("switch", { name: "Wrap code lines" }).click();
  await expect(preferences.getByLabel("Wrap source lines", { exact: true })).toBeChecked();
  await preferences.getByLabel("Collapse imports", { exact: true }).check();
  await expect(preferences.locator("pre code")).not.toContainText("import { Button }");
});

test("replacement controls retain complete copying and accessible feedback", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./docs/code/installation#code-control-slots");
  const demo = page.locator('[data-code-demo="controls"]');
  await demo.scrollIntoViewIfNeeded();
  const source = await demo.locator("pre code").textContent();
  await demo.getByRole("button", { name: "Hide 2 imports" }).click();
  await expect(demo.locator("pre code")).not.toContainText("import { Button }");
  await demo.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  await expect(demo.getByRole("status")).toHaveText("Code copied to clipboard.");
});

for (const scheme of ["light", "dark"] as const) {
  test(`syntax themes and typography apply locally in ${scheme} mode`, async ({ page }) => {
    await page.goto("./docs/code/installation#code-syntax-presets");
    await page.evaluate((mode) => {
      document.documentElement.classList.toggle("dark", mode === "dark");
      document.documentElement.classList.toggle("light", mode === "light");
    }, scheme);
    const demo = page.locator('[data-code-demo="theme"]');
    await demo.scrollIntoViewIfNeeded();
    const source = demo.locator("pre code");
    const keyword = source.locator(".token.keyword").first();
    await expect(keyword).toBeVisible();
    const original = await source.textContent();
    // This reader exposes actual import controls; the palette study deliberately hides them.
    const metadataReader = page.locator('[data-code-demo="parts"] .kamod-code');
    await metadataReader.scrollIntoViewIfNeeded();
    const importKeyword = metadataReader.locator(".docs-import-keyword");
    await expect(importKeyword).toBeVisible();
    const colors = new Set<string>();
    for (const palette of ["default", "dusk", "forest", "monochrome"]) {
      await demo.getByLabel("Syntax palette").selectOption(palette);
      const color = await keyword.evaluate((node) => getComputedStyle(node).color);
      colors.add(color);
      await metadataReader.evaluate((node, value) => (node.dataset.syntaxTheme = value), palette);
      await expect(importKeyword).toHaveCSS("color", color);
      expect(await source.textContent()).toBe(original);
    }
    expect(colors.size).toBe(4);
    await expect(keyword).toHaveCSS("font-weight", "600");
    await expect(source.locator(".token.comment").first()).toHaveCSS("font-style", "italic");
    await demo.getByLabel("Roomier source typography").check();
    await expect(demo.locator("pre")).toHaveCSS("font-size", "15px");
    await expect(source).toHaveCSS("line-height", "28.5px");
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await demo.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
    }
  });
}
