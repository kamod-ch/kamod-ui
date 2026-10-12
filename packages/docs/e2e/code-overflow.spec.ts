import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

test("wrapping appears only for overflowing lines and survives responsive resizing", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./docs/theming/installation");
  const snippet = page
    .locator(".kamod-code")
    .filter({ hasText: "src/components/AccountActions.tsx" });
  const code = snippet.locator("pre code");
  const wrap = snippet.getByRole("switch", { name: "Wrap code lines" });
  await code.scrollIntoViewIfNeeded();
  await expect(code.locator(".token.keyword").first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const source = await code.textContent();
  await expect(wrap).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(wrap).toBeVisible();
  await wrap.click();
  await expect(wrap).toBeChecked();
  expect(await snippet.locator("pre").evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(
    true,
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(wrap).toHaveCount(0);
  await expect(snippet).toHaveClass(/is-wrapped/);
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(wrap).toBeChecked();
  await expect(code).toHaveText(source!, { useInnerText: false });
  await expect(snippet.locator("[data-code-measure]")).toHaveCount(0);
  await snippet.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
});

test("both reading controls stay reachable for long folded imports and hide together when they fit", async ({
  page,
}) => {
  await page.goto("./docs/icons-package/installation#usage");
  const snippet = page.locator(".kamod-code").filter({ hasText: "src/example.tsx" }).first();
  const code = snippet.locator("pre code");
  await code.scrollIntoViewIfNeeded();
  await expect(code.locator(".token.keyword").first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const source = await code.textContent();
  const intrinsicWidth = () =>
    code.evaluate((el) => {
      el.setAttribute("data-code-measure", "");
      const width = el.scrollWidth;
      el.removeAttribute("data-code-measure");
      return width;
    });
  const full = await intrinsicWidth();
  const body = await code.evaluate((el) => {
    const source = el.textContent!;
    const body = source.slice(source.indexOf("export function"));
    const probe = el.cloneNode(false) as HTMLElement;
    probe.textContent = body;
    probe.setAttribute("data-code-measure", "");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    el.parentElement!.append(probe);
    const width = probe.scrollWidth;
    probe.remove();
    return width;
  });
  expect(full).toBeGreaterThan(body + 10);
  const inset = await snippet.locator("pre").evaluate((el) => {
    const style = getComputedStyle(el);
    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 2;
  });
  await snippet.evaluate(
    (el, width) => {
      el.style.width = `${width}px`;
    },
    (full + body) / 2 + inset,
  );
  const wrap = snippet.getByRole("switch", { name: "Wrap code lines" });
  await expect(wrap).toBeVisible();
  await wrap.click();
  await expect(wrap).toBeChecked();
  await snippet.getByRole("button", { name: "Hide imports" }).click();
  await expect(wrap).toBeChecked();
  await expect(snippet.getByRole("button", { name: "Show imports" })).toBeVisible();
  await expect(snippet).toHaveClass(/is-wrapped/);
  await snippet.getByRole("button", { name: "Show imports" }).click();
  await expect(wrap).toBeChecked();
  await expect(code).toHaveText(source!, { useInnerText: false });
  await snippet.evaluate((el) => {
    el.style.width = "";
  });
  await expect(wrap).toHaveCount(0);
  await expect(snippet.getByRole("button", { name: /imports$/ })).toHaveCount(0);
});

test("remeasuring wrapped syntax keeps the source pane's scroll position", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("./docs/code/installation#code-syntax-presets");
  const demo = page.locator('[data-code-demo="theme"]');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator("pre .token.keyword").first()).toBeVisible();
  const pre = demo.locator("pre");
  const original = await pre.textContent();
  const scrollTop = await pre.evaluate((el) => {
    el.style.maxHeight = "80px";
    el.scrollTop = el.scrollHeight - el.clientHeight;
    return el.scrollTop;
  });
  expect(scrollTop).toBeGreaterThan(0);
  await demo.getByLabel("Syntax palette").selectOption("monochrome");
  await expect(demo.locator("pre .token.keyword").first()).toHaveCSS("font-weight", "600");
  await expect.poll(() => pre.evaluate((el) => el.scrollTop)).toBeGreaterThanOrEqual(scrollTop - 1);
  await expect(pre).toHaveText(original!, { useInnerText: false });
  await expect(demo.locator("[data-code-probe], [data-code-measure]")).toHaveCount(0);
});
