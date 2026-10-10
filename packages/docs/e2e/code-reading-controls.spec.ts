import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

test("prompts stay wrapped and copy exactly without exposing a wrap switch", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./blocks/application-shell/application-shell-1");
  await page.locator(".blocks-showcase").getByRole("tab", { name: "Prompt", exact: true }).click();
  const panel = page.getByRole("tabpanel", { name: "Prompt", exact: true });
  for (const display of ["Code (Markdown)", "Plain Text"]) {
    await panel.getByRole("button", { name: display, exact: true }).click();
    await expect(panel.getByRole("switch", { name: "Wrap code lines" })).toHaveCount(0);
    if (display === "Code (Markdown)") {
      await expect(panel.locator(".token.title").first()).toBeVisible();
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      );
      await expect(panel.locator(".docs-code-line").first()).toBeVisible();
    }
    const original = await panel.locator("pre code").textContent();
    expect(original).toBeTruthy();
    await expect(panel.locator("pre code")).toHaveCSS("white-space", "normal");
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(panel.getByRole("button", { name: "Copy code", exact: true })).toBeVisible();
      await expect(panel.locator("pre code")).toHaveText(original!, { useInnerText: false });
      expect(await panel.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      expect(await panel.locator("pre").evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
        true,
      );
    }
    await panel.getByRole("button", { name: "Copy code", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
  }
  await panel.getByRole("button", { name: "Markdown", exact: true }).click();
  await expect(panel.getByRole("region", { name: "Rendered prompt" })).toBeVisible();
  await expect(
    panel.locator('.blocks-prompt-rendered pre[data-language="tsx"]').first(),
  ).toBeVisible();
  await expect(
    panel.locator(".blocks-prompt-rendered .language-tsx .token.keyword").first(),
  ).toBeAttached();
  await expect(panel.locator('[data-prompt-depth="3"]').first()).toHaveText(
    "1. Understand the project",
  );
  await expect(panel.getByRole("switch", { name: "Wrap code lines" })).toHaveCount(0);
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await panel
        .locator(".blocks-prompt-rendered pre")
        .first()
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
  }
});

for (const scheme of ["light", "dark"] as const) {
  test(`folded Application Shell imports leave no gap in ${scheme} mode`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
    await page.goto("./blocks/application-shell/application-shell-1");
    await page.locator(".blocks-showcase").getByRole("tab", { name: "Code", exact: true }).click();
    const panel = page.locator(".blocks-showcase-source");
    const code = panel.locator("pre code");
    await expect(code).toContainText("const ShellBreadcrumbs");
    const original = (await code.textContent())!;
    const header = original.slice(0, original.indexOf("import {")).trimEnd();
    const body = original.slice(original.indexOf("/** Omits empty trails"));
    await panel.getByRole("button", { name: "Hide imports" }).click();
    await expect(code).toHaveText(`${header}\n\n${body}`, { useInnerText: false });
    const disclosure = panel.locator(".docs-import-toggle");
    await expect(disclosure).toContainText("4 statements hidden");
    const wrap = panel.getByRole("switch", { name: "Wrap code lines" });
    await wrap.focus();
    await page.keyboard.press("Space");
    await expect(wrap).toBeChecked();
    await expect(panel.locator(".docs-code-wrap-state")).toHaveText("wrap enabled");
    expect(await code.textContent()).toBe(`${header}\n\n${body}`);
    await panel.locator(".docs-code-wrap-icon").click();
    await expect(wrap).not.toBeChecked();
    await panel.locator(".docs-code-wrap-state").click();
    await expect(wrap).toBeChecked();
    const wrapControl = panel.locator(".docs-code-wrap-control");
    await expect(wrapControl).toHaveCSS("cursor", "pointer");
    await wrapControl.click({ position: { x: 2, y: 2 } });
    await expect(wrap).not.toBeChecked();
    await wrap.focus();
    await page.keyboard.press("Enter");
    await expect(wrap).toBeChecked();
    const track = (await wrap.boundingBox())!;
    const thumb = (await wrap.locator('[data-slot="switch-thumb"]').boundingBox())!;
    expect(thumb.x + thumb.width).toBeLessThanOrEqual(track.x + track.width);
    for (const width of [320, 375, 640, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const left = (await disclosure.boundingBox())!;
      const right = (await panel.locator(".docs-code-wrap-control").boundingBox())!;
      expect(left.height).toBeCloseTo(right.height, 0);
      expect(left.x).toBeGreaterThanOrEqual(0);
      expect(right.x + right.width).toBeLessThanOrEqual(width);
      const endIcons = panel.locator(".docs-code-control-end-icon");
      for (const icon of await endIcons.all()) {
        await expect(icon).toBeVisible();
      }
      const snippetWidth = (await panel.locator(".docs-code-wrap").boundingBox())!.width;
      const importLabel = panel.locator(".docs-import-label");
      const wrapState = panel.locator(".docs-code-wrap-state");
      if (snippetWidth <= 512) await expect(importLabel).toBeHidden();
      else await expect(importLabel).toBeVisible();
      if (snippetWidth <= 320) await expect(wrapState).toBeHidden();
      else await expect(wrapState).toBeVisible();
      const iconPositions = await endIcons.evaluateAll((icons) =>
        icons.map((icon) => icon.getBoundingClientRect().x),
      );
      await disclosure.click();
      await wrap.click();
      const shown = (await disclosure.boundingBox())!;
      const unwrapped = (await panel.locator(".docs-code-wrap-control").boundingBox())!;
      expect(shown.width).toBeCloseTo(left.width, 1);
      expect(unwrapped.width).toBeCloseTo(right.width, 1);
      expect(
        await endIcons.evaluateAll((icons) => icons.map((icon) => icon.getBoundingClientRect().x)),
      ).toEqual(iconPositions);
      await disclosure.click();
      await wrap.click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await panel.getByRole("button", { name: "Copy code", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
    await disclosure.click();
    expect(await code.textContent()).toBe(original);
  });
}

test("terminal commands omit the switch while unnamed code retains wrapping and exact copying", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("./docs/cn/installation");
  const snippet = page
    .locator(".docs-code-wrap")
    .filter({ hasText: "pnpm add @kamod-ch/ui" })
    .first();
  await expect(snippet.getByRole("switch", { name: "Wrap code lines" })).toHaveCount(0);
  await expect(snippet.locator("pre code")).toHaveText("pnpm add @kamod-ch/ui");
  await snippet.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe("pnpm add @kamod-ch/ui");
  const example = page
    .locator(".docs-code-wrap")
    .filter({ has: page.locator("pre", { hasText: /^export function panelClasses/ }) })
    .first();
  await expect(example.locator(".docs-code-file-path")).toHaveCount(0);
  const source = await example.locator("pre code").textContent();
  const wrap = example.getByRole("switch", { name: "Wrap code lines" });
  await wrap.click();
  await expect(wrap).toBeChecked();
  await expect(example.locator("pre code")).toHaveText(source!, { useInnerText: false });
  await expect(example.locator("pre code")).toHaveCSS("white-space", "normal");
  await example.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("wrapping preserves existing indentation when the code pane has room", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("./docs/theming/installation");
  const snippet = page
    .locator(".docs-code-wrap")
    .filter({ hasText: "src/components/AccountActions.tsx" });
  const code = snippet.locator("pre code");
  await code.scrollIntoViewIfNeeded();
  await expect(code.locator(".token.keyword").first()).toBeVisible();
  // Compare actual character positions, including indentation, across the two renderers.
  const positions = () =>
    code.evaluate((element) => {
      const source = element.textContent!;
      return ["return (", "<div class=", "<Button type="].map((text) => {
        let offset = source.indexOf(text);
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          if (offset < node.textContent!.length) {
            const range = document.createRange();
            range.setStart(node, offset);
            range.setEnd(node, offset + 1);
            return range.getBoundingClientRect().x;
          }
          offset -= node.textContent!.length;
        }
        throw new Error(`Missing source text: ${text}`);
      });
    });
  const original = await code.textContent();
  const before = await positions();
  await snippet.getByRole("switch", { name: "Wrap code lines" }).click();
  await expect(snippet.locator(".docs-code-line").first()).toBeVisible();
  const after = await positions();
  after.forEach((x, index) => expect(x).toBeCloseTo(before[index], 0));
  expect(await code.textContent()).toBe(original);
});
