import { expect, test } from "@playwright/test";

const examples = [
  {
    name: "component",
    route: "./docs/accordion/installation",
    selector: ".component-example",
    file: "accordion-setup-prompt.md",
  },
  {
    name: "block",
    route: "./blocks/sidebar/sidebar-05",
    selector: ".blocks-showcase",
    file: "sidebar-05-setup-prompt.md",
  },
  {
    name: "workspace",
    route: "./",
    selector: ".home-workspace",
    file: "workspace-setup-prompt.md",
  },
];

for (const scheme of ["light", "dark"]) {
  for (const example of examples) {
    test(`${example.name}: Markdown downloads preserve all formats and share Copy's footprint (${scheme})`, async ({
      page,
    }) => {
      await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
      await page.goto(example.route);
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const showcase = page.locator(example.selector).first();
      await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
      await expect(showcase.locator("pre code")).toContainText("# ");
      const markdown = (await showcase.locator("pre code").textContent())!;
      const formats = showcase.getByRole("group", { name: "Prompt Display" });
      const choices = (await formats.count())
        ? ["Code (Markdown)", "Markdown", "Plain Text"]
        : ["Code (Markdown)"];
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const format of choices) {
          if (await formats.count())
            await formats.getByRole("button", { name: format, exact: true }).click();
          const button = showcase.locator('[data-slot="markdown-download"]');
          const copy = showcase.locator('[data-slot="code-copy"]');
          await expect(button).toHaveAttribute("data-download-state", "idle");
          await button.scrollIntoViewIfNeeded();
          const before = (await button.boundingBox())!;
          const copyBox = (await copy.boundingBox())!;
          expect(before.x + before.width).toBeLessThan(copyBox.x);
          expect(before.height).toBe(copyBox.height);
          expect(Math.abs(before.y - copyBox.y)).toBeLessThan(1);
          for (const property of [
            "backgroundColor",
            "color",
            "fontSize",
            "padding",
            "borderRadius",
          ] as const) {
            expect(
              await button.evaluate((node, key) => getComputedStyle(node)[key], property),
            ).toBe(await copy.evaluate((node, key) => getComputedStyle(node)[key], property));
          }
          const pending = page.waitForEvent("download");
          await button.click();
          const download = await pending;
          expect(download.suggestedFilename()).toBe(example.file);
          const chunks: Buffer[] = [];
          for await (const chunk of await download.createReadStream())
            chunks.push(Buffer.from(chunk));
          expect(Buffer.concat(chunks).toString("utf8")).toBe(markdown);
          await expect(button).toHaveAttribute("data-download-state", "complete");
          expect((await button.boundingBox())!.width).toBe(before.width);
          await expect(button.locator(".kamod-action-glyph")).toHaveCSS(
            "animation-name",
            "kamod-copy-orbit",
          );
          const color = await button.evaluate((node) => {
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            const context = canvas.getContext("2d")!;
            context.fillStyle = getComputedStyle(node).color;
            context.fillRect(0, 0, 1, 1);
            return [...context.getImageData(0, 0, 1, 1).data];
          });
          expect(color[2]).toBeGreaterThan(color[1] + 20);
          expect(color[0]).toBeGreaterThan(color[1] + 10);
          await expect(button).toHaveAttribute("data-download-state", "idle");
          await expect(button.locator("svg").first()).toHaveCSS("opacity", "1");
          await expect(button.locator(".kamod-action-glyph")).toHaveCSS("transform", "none");
          expect(await showcase.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(
            true,
          );
          await download.delete();
        }
      }
    });
  }
}

test("Markdown download keeps keyboard focus and static feedback with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./docs/accordion/installation");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const showcase = page.locator(".component-example").first();
  await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
  const button = showcase.locator('[data-slot="markdown-download"]');
  await button.focus();
  const pending = page.waitForEvent("download");
  await page.keyboard.press("Enter");
  const download = await pending;
  await expect(button).toHaveAttribute("data-download-state", "loading");
  await expect(button.locator(".docs-markdown-download-spinner")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(button).toHaveAttribute("data-download-state", "complete");
  await expect(button).toBeFocused();
  await expect(button.locator(".kamod-action-glyph")).toHaveCSS("animation-name", "none");
  await expect(button).toHaveAttribute("data-download-state", "idle");
  await expect(button).toBeFocused();
  await download.delete();
});
