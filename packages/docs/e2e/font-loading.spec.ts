import { expect, test } from "@playwright/test";
import { THEME_PRESETS } from "../src/theme/theme-presets";

for (const { id: preset } of THEME_PRESETS) {
  for (const width of [375, 1440]) {
    test(`system text remains painted across stylesheet replacement (${preset}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((preset) => {
        localStorage.setItem("theme-preset", preset);
        localStorage.setItem("theme", "light");
      }, preset);
      const fontRequests: string[] = [];
      await page.route(/fonts\.(?:googleapis|gstatic)\.com|\.woff2?(?:\?|$)/, (route) => {
        fontRequests.push(route.request().url());
        return route.abort();
      });
      await page.goto("./docs/getting-started", { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const prose = page.locator(".block-guide-description");
      await expect(prose).toBeVisible();
      await page.mouse.move(0, 0);
      const before = await prose.screenshot();
      const metrics = () =>
        page.evaluate(() =>
          [
            ...document.querySelectorAll(
              ".block-guide-header h1, .block-guide-description, .kamod-ui-logo",
            ),
          ].map((node) => {
            const rect = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            return {
              width: rect.width,
              height: rect.height,
              font: style.fontFamily,
              visibility: style.visibility,
              opacity: style.opacity,
            };
          }),
        );
      const original = await metrics();
      expect(original.length).toBeGreaterThanOrEqual(3);
      for (const node of original) {
        expect(node.font).toContain("system-ui");
        expect(node.visibility).toBe("visible");
        expect(node.opacity).toBe("1");
      }

      // Re-register the complete stylesheet, as CSS hydration/HMR does. Compare
      // painted glyphs too: visibility/bounds alone cannot detect invisible fonts.
      for (let replacement = 0; replacement < 3; replacement++) {
        await page.evaluate(async () => {
          const style = document.querySelector<HTMLStyleElement>(
            'style[data-vite-dev-id*="/src/styles/index.css"]',
          );
          const link = document.querySelector<HTMLLinkElement>(
            'link[rel="stylesheet"][href*="/assets/main-"], link[rel="stylesheet"][href*="/src/styles/index.css"]',
          );
          const source = style ?? link;
          if (!source) throw new Error("The shared stylesheet was not found.");
          const next = source.cloneNode(true) as HTMLStyleElement | HTMLLinkElement;
          const loaded =
            next instanceof HTMLLinkElement
              ? new Promise<void>((resolve, reject) => {
                  next.onload = () => resolve();
                  next.onerror = () => reject(new Error("Replacement stylesheet failed to load."));
                })
              : Promise.resolve();
          source.after(next);
          await loaded;
          source.remove();
        });
        expect(await metrics()).toEqual(original);
        expect(await prose.screenshot()).toEqual(before);
      }
      expect(await page.evaluate(() => document.fonts.size)).toBe(0);
      expect(fontRequests).toEqual([]);
    });
  }
}
