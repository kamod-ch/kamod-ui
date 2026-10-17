import { expect, type Locator, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

async function expectHeaderAboveSource(snippet: Locator) {
  const toolbar = snippet.locator(":scope > .docs-code-toolbar");
  const metadata = toolbar.locator(".docs-code-label, .docs-code-file-path");
  const copy = toolbar.getByRole("button", { name: "Copy code", exact: true });
  await expect(metadata).toBeVisible();
  await expect(copy).toBeVisible();
  await expect(snippet.locator(":scope > button")).toHaveCount(0);
  await snippet.scrollIntoViewIfNeeded();
  const bounds = await snippet.evaluate((element) => {
    const toolbar = element.querySelector(":scope > .docs-code-toolbar")!;
    const metadata = toolbar.querySelector(".docs-code-label, .docs-code-file-path")!;
    const copy = toolbar.querySelector('[aria-label="Copy code"]')!;
    const source = element.querySelector("pre")!;
    return {
      toolbar: toolbar.getBoundingClientRect().toJSON(),
      metadata: metadata.getBoundingClientRect().toJSON(),
      copy: copy.getBoundingClientRect().toJSON(),
      source: source.getBoundingClientRect().toJSON(),
    };
  });
  expect(bounds.metadata.right).toBeLessThan(bounds.copy.left);
  expect(bounds.metadata.bottom).toBeLessThanOrEqual(bounds.source.top);
  expect(bounds.copy.bottom).toBeLessThanOrEqual(bounds.source.top);
  expect(bounds.toolbar.bottom).toBeLessThanOrEqual(bounds.source.top);
}

const foundationCommand =
  "pnpm add preact @kamod-ch/ui @kamod-ch/icons @kamod-ch/themes @preact/signals";
const tailwindCommand = "pnpm add -D tailwindcss @tailwindcss/vite";
const viteConfig = `import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [preact(), tailwindcss()],
});`;

for (const dark of [false, true]) {
  test(`block foundation snippets keep their metadata and copy action above the source (${dark ? "dark" : "light"})`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.goto("./blocks/getting-started#check-your-project-foundation");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
    const section = page.locator('section[aria-labelledby="check-your-project-foundation"]');
    const snippets = section.locator(".docs-code-wrap");
    await expect(snippets).toHaveCount(3);

    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [index, source] of [foundationCommand, tailwindCommand, viteConfig].entries()) {
        const snippet = snippets.nth(index);
        if (index < 2) {
          await expect(snippet.locator(".docs-code-label")).toHaveText("Install Packages·Terminal");
        } else {
          await expect(snippet.locator(".docs-code-file-path")).toHaveText("vite.config.ts");
          await expect(snippet.locator(".docs-code-label")).toHaveCount(0);
        }
        await expect(snippet.locator("pre code")).toHaveText(source);
        await expectHeaderAboveSource(snippet);
        const copy = snippet.getByRole("button", { name: "Copy code", exact: true });
        await copy.focus();
        await page.keyboard.press("Enter");
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
        await expect(copy).toBeFocused();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });

  test(`shared Getting Started guide labels command and import snippets without changing copied source (${dark ? "dark" : "light"})`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.goto("./docs/getting-started");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
    const section = page.locator('section[aria-labelledby="set-up-your-app"]');
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [source, label] of [
        [
          "pnpm list @kamod-ch/ui @kamod-ch/themes preact @preact/signals\npnpm why preact",
          "Run Command·Terminal",
        ],
        ["pnpm add @kamod-ch/ui @kamod-ch/themes @preact/signals", "Install Packages·Terminal"],
        ['import "./app.css";', "Import Setup·TypeScript"],
      ] as const) {
        const snippet = section.locator(".docs-code-wrap").filter({
          has: page.locator("pre code", { hasText: source }),
        });
        await expect(snippet.locator(".docs-code-label")).toHaveText(label);
        await expect(snippet.locator("pre code")).toHaveText(source);
        await expectHeaderAboveSource(snippet);
        await snippet.getByRole("button", { name: "Copy code", exact: true }).click();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });

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
        await expectHeaderAboveSource(snippet);
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
    // Named examples offer folding when the narrow pane needs reading controls.
    await page.setViewportSize({ width: 320, height: 900 });
    const named = snippets.filter({
      has: page.locator(".docs-code-file-path", { hasText: "surface-classes.ts" }),
    });
    await expect(named.locator(".docs-code-label")).toHaveCount(0);
    await expectHeaderAboveSource(named);
    await named.getByRole("button", { name: "Hide imports", exact: true }).click();
    await expect(named.getByRole("button", { name: "Show imports", exact: true })).toBeVisible();
  });
}
