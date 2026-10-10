import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

const themes = [
  "kamod",
  "shadcn",
  "ocean",
  "sunset",
  "cursor-warm",
  "voltage",
  "watson",
  "professional",
];

for (const dark of [false, true]) {
  test(`shared copy feedback stays aligned and follows every palette (${dark ? "dark" : "light"})`, async ({
    page,
    context,
    browserName,
  }) => {
    test.setTimeout(90_000);
    await enableTestClipboard(context, browserName);
    await page.goto("./docs/icons-package/installation#usage");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const snippet = page
      .locator(".kamod-code")
      .filter({ has: page.locator(".docs-code-file-path", { hasText: "src/example.tsx" }) })
      .first();
    const button = snippet.locator(".kamod-copy-button");
    const colors = new Set<string>();
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of themes) {
        await page.evaluate(
          ({ dark, theme }) => {
            document.documentElement.classList.toggle("dark", dark);
            document.documentElement.classList.toggle("light", !dark);
            document.documentElement.dataset.theme = theme;
          },
          { dark, theme },
        );
        await expect(button).toHaveAttribute("data-copy-state", "idle");
        await button.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        const before = await button.boundingBox();
        const iconSize = await button
          .locator("svg")
          .evaluate((node) => getComputedStyle(node).width);
        await button.hover();
        const hovered = await button.boundingBox();
        expect(Math.abs(hovered!.y - before!.y)).toBeLessThan(0.1);
        expect(Math.abs(hovered!.x - before!.x)).toBeLessThan(0.1);
        await expect(button.locator("svg")).toHaveCSS("transform", "none");
        await button.click();
        await expect(button).toHaveAttribute("data-copy-state", "copied");
        await expect
          .poll(() =>
            button.evaluate(
              (node) =>
                node
                  .getAnimations()
                  .filter(
                    (animation) =>
                      animation instanceof CSSTransition && animation.playState === "running",
                  ).length,
            ),
          )
          .toBe(0);
        await expect
          .poll(() => page.evaluate(() => navigator.clipboard.readText()))
          .toBe(await snippet.locator("pre code").textContent());
        await expect(button.locator("svg")).toHaveCSS("width", iconSize);
        await expect(button.locator("svg")).toHaveCSS("animation-name", "kamod-copy-snap");
        const after = await button.boundingBox();
        expect(Math.abs(after!.width - before!.width)).toBeLessThan(0.1);
        expect(Math.abs(after!.height - before!.height)).toBeLessThan(0.1);
        const style = await button.evaluate((node) => {
          const css = getComputedStyle(node);
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const context = canvas.getContext("2d")!;
          context.fillStyle = css.color;
          context.fillRect(0, 0, 1, 1);
          const rgb = [...context.getImageData(0, 0, 1, 1).data];
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = css.backgroundColor;
          context.fillRect(0, 0, 1, 1);
          return {
            rgb,
            backgroundAlpha: context.getImageData(0, 0, 1, 1).data[3],
            color: css.color,
            background: css.backgroundColor,
            position: css.position,
            pulse: getComputedStyle(node, "::after").animationName,
          };
        });
        colors.add(style.color);
        expect(style.rgb[1]).toBeGreaterThan(style.rgb[0] + 5);
        expect(style.rgb[1]).toBeGreaterThan(style.rgb[2] + 5);
        expect(style.backgroundAlpha).toBeGreaterThan(0);
        expect(style.backgroundAlpha).toBeLessThan(80);
        expect(style.background).not.toBe("rgba(0, 0, 0, 0)");
        expect(style.position).toBe("relative");
        expect(style.pulse).toBe("kamod-copy-confirm");
      }
    }
    expect(colors.size).toBeGreaterThan(3);
  });
}

test("reduced motion, keyboard copying, and denied clipboard access retain useful feedback", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./docs/icons-package/installation#usage");
  const snippet = page
    .locator(".kamod-code")
    .filter({ has: page.locator(".docs-code-file-path", { hasText: "src/example.tsx" }) })
    .first();
  const button = snippet.locator(".kamod-copy-button");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("data-copy-state", "copied");
  await expect(button).toBeFocused();
  await expect(button.locator("svg")).toHaveCSS("animation-name", "none");
  await expect(button).toHaveCSS("transition-duration", "0s");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    });
    document.execCommand = () => false;
  });
  await button.click();
  await expect(button).toHaveAttribute("data-copy-state", "error");
  await expect(snippet.getByRole("status")).toContainText("Could not copy code");
  await expect(button).toHaveAccessibleName("Retry copying code");
});
