import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

test("Code documentation exposes complete examples, reading guides and the public API", async ({
  page,
}) => {
  await page.goto("./docs/code/installation");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Code");
  await expect(page.locator(".component-example")).toHaveCount(11);
  for (const id of [
    "language-detection",
    "reading-behavior",
    "copy-and-content",
    "customization",
    "performance",
    "troubleshooting",
  ]) {
    await expect(page.locator(`[id="${id}"]`)).toBeAttached();
    await expect(page.locator(`.blocks-doc-toc a[href="#${id}"]`)).toHaveCount(1);
  }
  await expect(page.locator("#component-data-types")).toBeAttached();
  await expect(page.locator("main")).toContainText("CodeProps");

  const showcase = page.locator(".component-example").first();
  await showcase.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(showcase.locator("pre code")).toContainText(
    'import { Code } from "@kamod-ch/ui/code"',
  );
  await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
  await expect(showcase.locator("pre code")).toContainText("Code");
});

for (const scheme of ["light", "dark"] as const) {
  test(`Code preserves source and responsive controls in ${scheme} mode`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.goto("./docs/code/installation");
    const showcase = page.locator(".component-example").first();
    await showcase.scrollIntoViewIfNeeded();
    const darkToggle = showcase.getByRole("button", { name: "Dark preview", exact: true });
    if (((await darkToggle.getAttribute("aria-pressed")) === "true") !== (scheme === "dark"))
      await darkToggle.click();
    const preview = showcase.locator("iframe").contentFrame();
    const code = preview.locator(".kamod-code");
    const source = code.locator("pre code");
    await expect(source.locator(".token.keyword").first()).toBeVisible();
    const original = await source.textContent();
    expect(original).toContain("import { Button }");

    await code.getByRole("button", { name: "Hide imports", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(source).not.toContainText("import { Button }");
    await code.getByRole("switch", { name: "Wrap code lines" }).focus();
    await page.keyboard.press("Space");
    await expect(code.getByRole("switch", { name: "Wrap code lines" })).toBeChecked();
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(code.locator(".docs-code-control-end-icon")).toHaveCount(2);
      for (const icon of await code.locator(".docs-code-control-end-icon").all())
        await expect(icon).toBeVisible();
      expect(await code.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
    }
    await code.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
    await expect(code.getByRole("status")).toHaveText("Code copied to clipboard.");
  });
}

test("Code surface variants remain distinct inside documentation previews", async ({ page }) => {
  await page.goto("./docs/code/installation#appearance");
  const example = page.locator("#appearance").locator(".component-example");
  await example.scrollIntoViewIfNeeded();
  const preview = example.locator("iframe").contentFrame();
  await expect(preview.locator(".kamod-code")).toHaveCount(3);
  const surfaces = await preview
    .locator(".kamod-code pre")
    .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor));
  expect(new Set(surfaces).size).toBe(3);
});
