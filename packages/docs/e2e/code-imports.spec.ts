import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

for (const variant of ["block", "component", "guide"] as const) {
  test(`${variant}: imports fold without changing copied source`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    const path =
      variant === "block"
        ? "blocks/application-shell/application-shell-1"
        : variant === "component"
          ? "docs/pagination/installation"
          : "docs/forms";
    await page.goto(`./${path}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    let region = page.locator("body");
    if (variant !== "guide") {
      const showcase = page
        .locator(variant === "block" ? ".blocks-showcase" : ".component-example")
        .first();
      region = showcase;
      await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    }
    const snippet = region
      .locator(".docs-code-wrap")
      .filter({ has: page.getByRole("button", { name: "Hide imports", exact: true }) })
      .filter({ visible: true })
      .first();
    const code = snippet.locator("pre code");
    await expect(code).toBeVisible();
    const original = await code.textContent();
    expect(original).toMatch(/import\b/);
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await snippet.scrollIntoViewIfNeeded();
      for (const dark of [false, true]) {
        await page.evaluate(
          (dark) => document.documentElement.classList.toggle("dark", dark),
          dark,
        );
        const importColor = await snippet
          .locator(".docs-import-keyword")
          .evaluate((element) => getComputedStyle(element).color);
        await expect(
          code
            .locator(".token.keyword")
            .filter({ hasText: /^import$/ })
            .first(),
        ).toHaveCSS("color", importColor);
        await expect(snippet.locator(".docs-code-imports-row")).toHaveCSS("padding-top", "10px");
        await expect(snippet.locator(".docs-code-imports-row")).toHaveCSS("margin-bottom", "-2px");
        const toggle = snippet.getByRole("button", { name: "Hide imports", exact: true });
        await toggle.focus();
        await page.keyboard.press("Enter");
        // Keep a stable ancestor after the toggle's accessible name changes.
        const folded = page
          .locator(".docs-code-wrap")
          .filter({ has: page.getByRole("button", { name: "Show imports", exact: true }) });
        await expect(folded.getByRole("button", { name: "Show imports" })).toHaveAttribute(
          "aria-expanded",
          "false",
        );
        expect(await folded.locator("pre code").textContent()).not.toBe(original);
        await folded.getByRole("button", { name: "Copy code", exact: true }).click();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
        await folded.getByRole("button", { name: "Show imports", exact: true }).click();
        await expect(code).toHaveText(original!);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        await expect(snippet.getByRole("button", { name: "Copy code", exact: true })).toBeVisible();
      }
    }
  });
}

for (const width of [320, 1440]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`home: folded source remains readable at ${width}px in ${scheme} mode`, async ({
      page,
      context,
      browserName,
    }) => {
      const original = readFileSync(
        new URL("../src/home/WorkspaceDemo.tsx", import.meta.url),
        "utf8",
      );
      const folded = original.replace(/^(?:import [^\n]+\n)+\n/, "");
      expect(folded).not.toBe(original);
      await enableTestClipboard(context, browserName);
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
      await page.goto("./");
      const showcase = page.getByRole("region", { name: "Interactive workspace example" });
      const code = showcase.locator("pre code");
      const expectReadableSource = async (expected: string) => {
        await expect(code).toHaveText(expected, { useInnerText: false });
        await expect(code.locator(".token.keyword").first()).toBeVisible();
        expect(await code.textContent()).toBe(expected);
        const rendering = await code.evaluate((element) => {
          const hiddenTokens = Array.from(element.querySelectorAll(".token"))
            .filter((token) => token.textContent?.trim())
            .flatMap((token) => {
              const { display, visibility, opacity } = getComputedStyle(token);
              const { width, height } = token.getBoundingClientRect();
              // Off-screen source still has geometry inside the scrollable code pane.
              return display === "none" ||
                visibility !== "visible" ||
                Number(opacity) < 1 ||
                !width ||
                !height
                ? [{ text: token.textContent, display, visibility, opacity, width, height }]
                : [];
            });
          return {
            hiddenTokens,
            // Wrapping omits empty logical lines from innerText, but no source characters.
            renderedText: (element as HTMLElement).innerText.replace(/\s/g, ""),
          };
        });
        expect(rendering.hiddenTokens).toEqual([]);
        expect(rendering.renderedText).toBe(expected.replace(/\s/g, ""));
      };

      for (let visit = 0; visit < 2; visit += 1) {
        await showcase.getByRole("tab", { name: "Code", exact: true }).click();
        const wrap = showcase.getByRole("switch", { name: "Wrap code lines" });
        await expect(wrap).not.toBeChecked();
        for (const wrapped of [false, true]) {
          if (wrapped) {
            await wrap.click();
            await expect(wrap).toBeChecked();
          }
          await expectReadableSource(original);
          await showcase.getByRole("button", { name: "Hide imports", exact: true }).click();
          await expectReadableSource(folded);
          await showcase.getByRole("button", { name: "Copy code", exact: true }).click();
          await expect
            .poll(() => page.evaluate(() => navigator.clipboard.readText()))
            .toBe(original);
          await showcase.getByRole("button", { name: "Show imports", exact: true }).click();
          await expectReadableSource(original);
        }
        await showcase.getByRole("tab", { name: "Preview", exact: true }).click();
      }
    });
  }
}
