import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

for (const dark of [false, true]) {
  test(`unnamed snippets have useful headers and import-only examples stay expanded (${dark ? "dark" : "light"})`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.goto("./docs/cn/installation");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
    const snippets = page.locator(".docs-code-wrap");
    const install = snippets
      .filter({ has: page.locator("pre", { hasText: /^pnpm add @kamod-ch\/ui$/ }) })
      .first();
    const imports = snippets
      .filter({
        has: page.locator("pre", { hasText: /^import \{ cn \} from "@kamod-ch\/ui\/utils";$/ }),
      })
      .first();
    const example = snippets
      .filter({ has: page.locator("pre", { hasText: /^export function panelClasses/ }) })
      .first();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [snippet, label] of [
        [install, "Install Packages·Terminal"],
        [imports, "Import Setup·TypeScript"],
        [example, "Usage Pattern·TypeScript"],
      ] as const) {
        await expect(snippet.locator(".docs-code-label")).toHaveText(label);
        await snippet.scrollIntoViewIfNeeded();
        const heading = await snippet.locator(".docs-code-label").boundingBox();
        const copy = await snippet
          .getByRole("button", { name: "Copy code", exact: true })
          .boundingBox();
        expect(heading!.x + heading!.width).toBeLessThan(copy!.x);
        expect(
          Math.abs(heading!.y + heading!.height / 2 - copy!.y - copy!.height / 2),
        ).toBeLessThan(2);
        const centers = await snippet.locator(".docs-code-label").evaluate((label) => {
          const children = label.querySelectorAll(
            ":scope > svg, :scope > strong, .docs-code-label-detail a, .docs-code-label-detail svg",
          );
          return [...children].map((child) => {
            const { y, height } = child.getBoundingClientRect();
            return y + height / 2;
          });
        });
        expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(2);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await expect(imports.getByRole("button", { name: /imports/i })).toHaveCount(0);
    const source = await imports.locator("pre code").textContent();
    await imports.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
    // Real examples still fold their imports below the filename header.
    const named = snippets.filter({
      has: page.locator(".docs-code-file-path", { hasText: "surface-classes.ts" }),
    });
    await expect(named.locator(".docs-code-label")).toHaveCount(0);
    await named.getByRole("button", { name: "Hide imports", exact: true }).click();
    await expect(named.getByRole("button", { name: "Show imports", exact: true })).toBeVisible();
  });
}
