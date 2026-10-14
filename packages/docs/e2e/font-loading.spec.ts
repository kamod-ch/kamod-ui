import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// One real local font makes cold-font tests independent of third-party CDNs.
const font = readFileSync(
  new URL(import.meta.resolve("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")),
);

for (const preset of ["kamod", "cursor-warm", "professional", "watson"]) {
  for (const width of [375, 1440]) {
    test(`late fonts keep visible text stable (${preset}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((preset) => {
        localStorage.setItem("theme-preset", preset);
        localStorage.setItem("theme", "light");
      }, preset);

      // Retain the authored display policy while substituting deterministic font files.
      await page.route("https://fonts.googleapis.com/**", (route) => {
        const query = new URL(route.request().url()).searchParams;
        const display = query.get("display") ?? "auto";
        const css = query
          .getAll("family")
          .map((family) => {
            const name = family.split(":")[0];
            return `@font-face { font-family: "${name}"; font-style: normal; font-weight: 100 900; font-display: ${display}; src: url("https://font-fixture.test/${encodeURIComponent(name)}.woff2") format("woff2"); }`;
          })
          .join("\n");
        return route.fulfill({ contentType: "text/css", body: css });
      });
      let release!: () => void;
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      let requests = 0;
      await page.route(/\.woff2(?:\?|$)/, async (route) => {
        requests++;
        await pending;
        await route.fulfill({
          contentType: "font/woff2",
          headers: { "access-control-allow-origin": "*" },
          body: font,
        });
      });
      try {
        await page.goto("./docs/getting-started", { waitUntil: "domcontentloaded" });
        await expect(page.locator("html")).toHaveClass(/pp-ready/);
        await expect(page.locator(".block-guide-header h1")).toBeVisible();
        expect(requests).toBeGreaterThan(0);
        // Exceed the short font block period; the user can already read the fallback.
        await page.waitForTimeout(200);
        const measure = () =>
          page.evaluate(() =>
            [
              ...document.querySelectorAll(
                ".block-guide-header h1, .block-guide-description, .kamod-ui-logo",
              ),
            ].map((node) => {
              const rect = node.getBoundingClientRect();
              const words = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
              const text = words.nextNode();
              const range = document.createRange();
              if (text) {
                range.setStart(text, 0);
                range.setEnd(text, Math.min(text.textContent?.length ?? 0, 24));
              }
              return [rect.width, rect.height, text ? range.getBoundingClientRect().width : 0];
            }),
          );
        const before = await measure();
        expect(before.length).toBeGreaterThanOrEqual(3);
        release();
        await page.evaluate(() => document.fonts.ready);
        const after = await measure();
        expect(after).toEqual(before);
        expect(
          await page.evaluate(() =>
            [...document.fonts].every((face) => face.display === "optional"),
          ),
        ).toBe(true);
      } finally {
        release();
      }
    });
  }
}
