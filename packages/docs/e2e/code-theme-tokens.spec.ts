import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1440]) {
  for (const outerScheme of ["light", "dark"]) {
    test(`semantic syntax palettes stay local and readable at ${width}px on ${outerScheme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("./docs/code/installation#code-theme-tokens");
      await page.waitForSelector("html.pp-ready");
      await page.evaluate((scheme) => {
        document.documentElement.classList.toggle("dark", scheme === "dark");
      }, outerScheme);
      const lab = page.locator('[data-code-demo="theme-tokens"]');
      await lab.scrollIntoViewIfNeeded();
      const code = lab.locator("pre code");
      await expect(code.locator(".token.keyword").first()).toBeVisible();
      const token = await code.locator(".token.keyword").first().elementHandle();
      const original = await code.textContent();
      const preferences = () =>
        page.evaluate(() => ({
          theme: document.documentElement.getAttribute("data-theme"),
          classes: document.documentElement.className,
          savedPreset: localStorage.getItem("theme-preset"),
          savedScheme: localStorage.getItem("theme"),
        }));
      const initial = await preferences();
      const palette = lab.getByLabel("Application palette");
      const appearance = lab.getByLabel("Local appearance");
      const ids = await palette
        .locator("option")
        .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
      expect(ids).toHaveLength(8);
      const colors = new Set<string>();
      for (const id of ids) {
        await palette.selectOption(id);
        for (const scheme of ["light", "dark"]) {
          await appearance.selectOption(scheme);
          const result = await code.evaluate((node) => {
            // Canvas resolves modern CSS color spaces before calculating sRGB contrast.
            const context = document
              .createElement("canvas")
              .getContext("2d", { willReadFrequently: true })!;
            const luminance = (layers: string[]) => {
              context.clearRect(0, 0, 1, 1);
              context.fillStyle = "white";
              context.fillRect(0, 0, 1, 1);
              for (const value of layers) {
                context.fillStyle = value;
                context.fillRect(0, 0, 1, 1);
              }
              return [...context.getImageData(0, 0, 1, 1).data]
                .slice(0, 3)
                .reduce((sum, channel, i) => {
                  const normalized = channel / 255;
                  return (
                    sum +
                    (normalized <= 0.04045
                      ? normalized / 12.92
                      : ((normalized + 0.055) / 1.055) ** 2.4) *
                      [0.2126, 0.7152, 0.0722][i]
                  );
                }, 0);
            };
            // Headerless source can be transparent over its reader's surface.
            const backgrounds: string[] = [];
            for (let parent: Element | null = node; parent; parent = parent.parentElement) {
              backgrounds.unshift(getComputedStyle(parent).backgroundColor);
            }
            const bg = luminance(backgrounds);
            const contrasts = [node, ...node.querySelectorAll(".token")].map((part) => {
              const fg = luminance([...backgrounds, getComputedStyle(part).color]);
              return (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
            });
            return {
              minimum: Math.min(...contrasts),
              keyword: getComputedStyle(node.querySelector(".token.keyword")!).color,
              fits: node.parentElement!.scrollWidth <= node.parentElement!.clientWidth + 1,
            };
          });
          expect(result.minimum, `${id}/${scheme}`).toBeGreaterThanOrEqual(4.5);
          expect(result.fits, `${id}/${scheme}`).toBe(true);
          colors.add(result.keyword);
          expect(await code.textContent()).toBe(original);
          expect(
            await code.evaluate(
              (node, prior) => node.querySelector(".token.keyword") === prior,
              token,
            ),
          ).toBe(true);
        }
      }
      expect(colors.size).toBeGreaterThanOrEqual(12);
      expect(await preferences()).toEqual(initial);
      await expect(lab.locator("iframe")).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      await palette.focus();
      await page.keyboard.press("Tab");
      await expect(appearance).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(palette).toBeFocused();
    });
  }
}
