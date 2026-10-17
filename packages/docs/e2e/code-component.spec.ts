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
  test(`Code starts plain and preserves optional reading tools in ${scheme} mode`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.goto("./docs/code/installation");
    const plainShowcase = page.locator(".component-example").first();
    await plainShowcase.scrollIntoViewIfNeeded();
    const plainToggle = plainShowcase.getByRole("button", { name: "Dark preview", exact: true });
    if (((await plainToggle.getAttribute("aria-pressed")) === "true") !== (scheme === "dark"))
      await plainToggle.click();
    const plainCode = plainShowcase.locator("iframe").contentFrame().locator(".kamod-code");
    await expect(plainCode.locator("pre code")).toContainText("console.log(greeting)");
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(plainCode.locator('[data-slot="code-toolbar"]')).toHaveCount(0);
      await expect(plainCode.locator('[data-slot="code-imports"]')).toHaveCount(0);
      await expect(plainCode.getByRole("button", { name: "Copy code", exact: true })).toHaveCount(
        0,
      );
    }

    const showcase = page.locator("#imports .component-example");
    await showcase.scrollIntoViewIfNeeded();
    const darkToggle = showcase.getByRole("button", { name: "Dark preview", exact: true });
    if (((await darkToggle.getAttribute("aria-pressed")) === "true") !== (scheme === "dark"))
      await darkToggle.click();
    await page.setViewportSize({ width: 320, height: 1000 });
    await showcase.scrollIntoViewIfNeeded();
    const preview = showcase.locator("iframe").contentFrame();
    const code = preview.locator(".kamod-code");
    const source = code.locator("pre code");
    await expect(source.locator(".token.keyword").first()).toBeVisible();
    await code.getByRole("button", { name: "Show imports", exact: true }).focus();
    await page.keyboard.press("Enter");
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
      // Complete, unwrapped source can fit at wider sizes; controls stay paired when needed.
      const controls = await code.evaluate((node) => {
        const icons = [...node.querySelectorAll(".docs-code-control-end-icon")];
        return {
          count: icons.length,
          visible: icons.every((icon) => getComputedStyle(icon).display !== "none"),
        };
      });
      expect([0, 2]).toContain(controls.count);
      expect(controls.visible).toBe(true);
      expect(await code.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
    }
    await code.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
    await expect(code.locator(".kamod-copy-status")).toHaveText("Code copied to clipboard.");
  });
}

test("Code surface variants remain distinct inside documentation previews", async ({ page }) => {
  await page.goto("./docs/code/installation#appearance");
  const example = page.locator("#appearance").locator(".component-example");
  await example.scrollIntoViewIfNeeded();
  const preview = example.locator("iframe").contentFrame();
  await expect(preview.locator(".kamod-code")).toHaveCount(3);
  const surfaces = await preview
    .locator(".kamod-code")
    .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor));
  expect(new Set(surfaces).size).toBe(3);
});
