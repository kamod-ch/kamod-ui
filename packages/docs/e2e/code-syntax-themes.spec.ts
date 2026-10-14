import { expect, type Locator, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

const canvases = {
  okaidia: { light: "rgb(250, 250, 245)", dark: "rgb(39, 40, 34)" },
  tomorrow: { light: "rgb(246, 246, 246)", dark: "rgb(45, 45, 45)" },
  twilight: { light: "rgb(250, 248, 245)", dark: "rgb(20, 20, 20)" },
  "solarized-light": { light: "rgb(253, 246, 227)", dark: "rgb(0, 43, 54)" },
};

/** Normalize modern CSS colors before comparing source canvases or calculating contrast. */
const sourcePaint = (source: Locator) =>
  source.evaluate((node) => {
    const context = document.createElement("canvas").getContext("2d")!;
    const rgb = (color: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const luminance = (channels: number[]) =>
      channels.reduce((sum, value, index) => {
        const channel = value / 255;
        return (
          sum +
          (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) *
            [0.2126, 0.7152, 0.0722][index]
        );
      }, 0);
    const style = getComputedStyle(node);
    const background = rgb(style.backgroundColor);
    const bg = luminance(background);
    const colors = new Set(
      [node, ...node.querySelectorAll(".token")].map((token) => getComputedStyle(token).color),
    );
    const contrasts = [...colors].map((color) => {
      const fg = luminance(rgb(color));
      return (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
    });
    return {
      background: `rgb(${background.join(", ")})`,
      scheme: style.colorScheme,
      contrast: Math.min(...contrasts),
      fits: node.scrollWidth <= node.clientWidth + 1,
    };
  });

test("all eight palettes reuse highlighted nodes and preserve the source and controls", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("./docs/code/installation#syntax-themes");
  const demo = page.locator('[data-code-demo="theme"]');
  const reader = demo.locator(".kamod-code");
  const source = reader.locator("pre code");
  await demo.scrollIntoViewIfNeeded();
  await expect(source.locator(".token.keyword").first()).toBeVisible();
  const original = await source.textContent();
  const token = await source.locator(".token.keyword").first().elementHandle();
  const header = reader.locator('[data-slot="code-toolbar"]');
  const headerStyle = await header.evaluate((node) => ({
    background: getComputedStyle(node).backgroundColor,
    color: getComputedStyle(node).color,
  }));
  const choices = demo.getByLabel("Syntax palette");
  await expect(choices.locator("option")).toHaveCount(8);
  for (const theme of ["default", "dusk", "forest", "monochrome", ...Object.keys(canvases)]) {
    await choices.selectOption(theme);
    await expect(reader).toHaveAttribute("data-syntax-theme", theme);
    expect(
      await source.evaluate((node, prior) => node.querySelector(".token.keyword") === prior, token),
    ).toBe(true);
    expect(await source.textContent()).toBe(original);
    expect(
      await header.evaluate((node) => ({
        background: getComputedStyle(node).backgroundColor,
        color: getComputedStyle(node).color,
      })),
    ).toEqual(headerStyle);
    if (theme in canvases) {
      const rendered = await sourcePaint(reader.locator("pre"));
      expect(rendered.scheme).toBe("dark");
      expect(rendered.background).toBe(canvases[theme as keyof typeof canvases].dark);
    }
  }
  await choices.selectOption("default");
  expect((await sourcePaint(reader.locator("pre"))).background).not.toBe(
    canvases["solarized-light"].dark,
  );
  await reader.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
});

for (const width of [320, 768, 1440]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`Prism studies stay scoped and readable at ${width}px in ${scheme} mode`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("./docs/code/installation#code-prism-palettes");
      await page.waitForSelector("html.pp-ready");
      await page.evaluate((mode) => {
        document.documentElement.classList.toggle("dark", mode === "dark");
        document.documentElement.classList.toggle("light", mode === "light");
      }, scheme);
      const gallery = page.locator(".code-prism-studies");
      await expect(gallery.locator(".code-prism-study")).toHaveCount(4);
      await expect(gallery.locator("iframe")).toHaveCount(0);
      let commonSource: string | null = null;
      for (const [theme, backgrounds] of Object.entries(canvases)) {
        const reader = gallery.locator(`.kamod-code[data-syntax-theme="${theme}"]`);
        await reader.scrollIntoViewIfNeeded();
        await expect(reader.locator(".token.keyword").first()).toBeVisible();
        const text = await reader.locator("pre code").textContent();
        if (commonSource === null) commonSource = text;
        expect(text).toBe(commonSource);
        const rendered = await sourcePaint(reader.locator("pre"));
        const sourceScheme = scheme === "light" ? "dark" : "light";
        expect(rendered.scheme).toBe(sourceScheme);
        expect(rendered.background).toBe(backgrounds[sourceScheme]);
        expect(rendered.contrast).toBeGreaterThanOrEqual(4.5);
        expect(rendered.fits).toBe(true);
      }
      const layout = await gallery.evaluate((node) => ({
        width: node.clientWidth,
        columns: getComputedStyle(
          node.querySelector(".code-prism-studies-grid")!,
        ).gridTemplateColumns.split(" ").length,
      }));
      expect(layout.columns).toBe(layout.width >= 640 ? 2 : 1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      for (const id of ["code-prism-palettes", "code-shared-syntax-choice"]) {
        await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
      }
    });
  }
}
