import { expect, test } from "@playwright/test";

for (const width of [320, 1440]) {
  for (const mode of ["light", "dark"]) {
    test(`reference help stays aligned and reachable at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("./docs/formisch/installation", { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      for (const term of ["Preact", "Valibot", "@formisch/preact", "@preact/signals"]) {
        if (term === "@preact/signals") {
          await page.goto("./docs/signals-package/installation", { waitUntil: "domcontentloaded" });
          await expect(page.locator("html")).toHaveClass(/pp-ready/);
        }
        await page.evaluate((scheme) => {
          document.documentElement.classList.toggle("dark", scheme === "dark");
          document.documentElement.classList.toggle("light", scheme === "light");
          document.documentElement.dataset.colorScheme = scheme;
        }, mode);
        const trigger = page.locator(`[data-inline-code-help="${term}"]`).first();
        await trigger.scrollIntoViewIfNeeded();
        await page.keyboard.press("Shift");
        await trigger.focus();
        const help = page.getByRole("dialog", { name: `${term} explained`, exact: true });
        await expect(help).toBeVisible();
        const header = help.locator(".reference-help-header");
        await expect(header.locator("strong")).not.toBeEmpty();
        await expect(header.locator(".reference-help-separator")).toHaveText("/");
        await expect(header.locator(".reference-help-action").first()).toBeVisible();
        const layout = await header.evaluate((node) => {
          const [heading, actions] = [...node.children].map((child) =>
            child.getBoundingClientRect(),
          );
          return {
            centers: Math.abs(heading.y + heading.height / 2 - actions.y - actions.height / 2),
            gap: actions.left - heading.right,
          };
        });
        expect(layout.centers).toBeLessThan(1);
        expect(layout.gap).toBeGreaterThanOrEqual(16);
        expect(await help.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
        const box = (await help.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        if (term === "Valibot")
          await expect(help.locator(".reference-help-footer")).toHaveText("https://valibot.dev/");
        if (term === "@preact/signals") {
          const url = "https://preactjs.com/guide/v10/signals/";
          const code = header.locator("code");
          await expect(code).toHaveText(url);
          await expect(code).toHaveCSS("display", "block");
          await expect(code).toHaveCSS("text-overflow", "ellipsis");
          expect(await code.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
          await expect(header.locator(".docs-code-explanation-path > a")).toHaveAttribute(
            "href",
            url,
          );
          await expect(help.locator(".reference-help-footer")).toHaveAttribute("href", url);
          const footerGap = await help.locator(".reference-help-footer").evaluate((node) => {
            const [label, icon] = [...node.children].map((child) => child.getBoundingClientRect());
            return icon.left - label.right;
          });
          expect(footerGap).toBeGreaterThanOrEqual(16);
        }
        await page.keyboard.press("Tab");
        await expect(help.locator("a").first()).toBeFocused();
        await page.screenshot({
          path: `/tmp/reference-help-${term.replace(/\W/g, "")}-${mode}-${width}.png`,
        });
        await page.keyboard.press("Escape");
        await expect(help).toBeHidden();
        await expect(trigger).toBeFocused();
      }
    });
  }
}
