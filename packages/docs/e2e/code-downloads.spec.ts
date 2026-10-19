import { type Download, expect, type Locator, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

async function downloadedSource(download: Download) {
  expect(await download.failure()).toBeNull();
  const chunks: Buffer[] = [];
  for await (const chunk of await download.createReadStream()) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function completeSource(panel: Locator) {
  const reveal = panel.getByRole("button", { name: "Show imports", exact: true });
  if (await reveal.count()) await reveal.click();
  return (await panel.locator("pre code").textContent())!;
}

test("ordinary documentation snippets download their exact source using the resolved extension", async ({
  page,
}) => {
  await page.goto("./docs/code/installation", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const panel = page.locator("#code-install-package").locator("..").locator(".kamod-code").first();
  const source = await completeSource(panel);
  expect(source).toContain("pnpm add @kamod-ch/ui");
  const downloadButton = panel.locator('[data-slot="code-download"]');
  await expect(downloadButton).toHaveCount(1);
  await expect(panel.locator('[data-slot="code-copy"]')).toHaveCount(1);
  const pending = page.waitForEvent("download");
  await downloadButton.click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("snippet.sh");
  expect(await downloadedSource(download)).toBe(source);
  await expect(downloadButton).toHaveAttribute("data-download-state", "complete");
  await download.delete();
});

for (const scheme of ["light", "dark"] as const) {
  test(`selected block files keep exact downloads and Copy's compact footprint at 320px (${scheme})`, async ({
    page,
  }) => {
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("./blocks/sidebar/sidebar-05", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const showcase = page.locator(".blocks-showcase").first();
    await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    const files = showcase.locator(".blocks-file-tree-btn");
    await expect(files.first()).toBeVisible();
    const labels = await files.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("title")!),
    );
    const first = await files
      .filter({ has: page.locator(".blocks-file-tree-selection") })
      .getAttribute("title");
    const second = labels.find((label) => label.split("/").at(-1) !== first!.split("/").at(-1));
    expect(second).toBeDefined();

    for (const label of [first!, second!]) {
      await files.locator(`xpath=self::*[@title=${JSON.stringify(label)}]`).click();
      const pane = showcase.locator(".blocks-code-pane");
      const downloadButton = pane.locator('[data-slot="code-download"]');
      const copy = pane.locator('[data-slot="code-copy"]');
      await expect(downloadButton).toHaveAttribute("data-download-state", "idle");
      const source = await completeSource(pane);
      await downloadButton.scrollIntoViewIfNeeded();
      const before = (await downloadButton.boundingBox())!;
      const copyBox = (await copy.boundingBox())!;
      expect(before.width).toBe(28);
      expect(before.height).toBe(copyBox.height);
      expect(before.height).toBe(28);
      expect(before.x + before.width).toBeLessThan(copyBox.x);
      expect(before.y).toBeCloseTo(copyBox.y, 1);
      for (const property of ["backgroundColor", "color", "padding", "borderRadius"] as const) {
        expect(
          await downloadButton.evaluate((node, key) => getComputedStyle(node)[key], property),
        ).toBe(await copy.evaluate((node, key) => getComputedStyle(node)[key], property));
      }
      await expect(downloadButton.locator(".kamod-action-label")).toHaveCSS("display", "none");
      const pending = page.waitForEvent("download");
      await downloadButton.click();
      const download = await pending;
      expect(download.suggestedFilename()).toBe(label.split("/").at(-1));
      expect(await downloadedSource(download)).toBe(source);
      await expect(downloadButton).toHaveAttribute("data-download-state", "complete");
      expect((await downloadButton.boundingBox())!.width).toBe(before.width);
      expect(await showcase.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(
        true,
      );
      await download.delete();
    }
  });
}

test("live public-Code examples retain custom Copy composition beside exact-source downloads", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./docs/code/installation#code-control-slots", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const panel = page.locator('[data-code-demo="controls"] .kamod-code');
  const source = await completeSource(panel);
  const copy = panel.locator(
    '[title="Copy the complete source, including folded imports"] [data-slot="code-copy"]',
  );
  await expect(copy).toHaveCount(1);
  await expect(panel.locator('[data-slot="code-download"]')).toHaveCount(1);
  const pending = page.waitForEvent("download");
  await panel.locator('[data-slot="code-download"]').click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("Welcome.tsx");
  expect(await downloadedSource(download)).toBe(source);
  await copy.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  await download.delete();
});

test("hiding Copy or the header also removes Download from a live component example", async ({
  page,
}) => {
  await page.goto("./docs/code/installation#code-visible-parts", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const playground = page.locator('[data-code-demo="parts"]');
  const panel = playground.locator(".code-parts-preview .kamod-code");
  await expect(panel.locator('[data-slot="code-download"]')).toHaveCount(1);
  await playground.getByRole("switch", { name: "Copy action", exact: true }).click();
  await expect(panel.locator('[data-slot="code-copy"], [data-slot="code-download"]')).toHaveCount(
    0,
  );
  await playground.getByRole("switch", { name: "Copy action", exact: true }).click();
  await expect(panel.locator('[data-slot="code-download"]')).toHaveCount(1);
  await playground.getByRole("switch", { name: "Header", exact: true }).click();
  await expect(panel.locator('[data-slot="code-copy"], [data-slot="code-download"]')).toHaveCount(
    0,
  );
});
