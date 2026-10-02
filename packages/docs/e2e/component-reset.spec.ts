import { expect, test } from "@playwright/test";

for (const slug of ["accordion", "formisch"]) {
  test(`${slug}: first and last examples share the block reset animation`, async ({ page }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.setViewportSize({ width: 1920, height: 1000 });
    await page.goto(`./docs/${slug}/installation`);
    await page.waitForSelector("html.pp-ready");
    const examples = page.locator(".component-example");
    for (const position of [0, (await examples.count()) - 1]) {
      const example = examples.nth(position);
      await example.scrollIntoViewIfNeeded();
      const iframe = example.locator("iframe");
      await expect(iframe.contentFrame().locator(".component-example-canvas")).toBeVisible();
      await iframe
        .contentFrame()
        .locator("body")
        .evaluate((node) => node.setAttribute("data-reset-test", "old"));
      const index = await iframe.getAttribute("data-example-index");
      const url = `**/component-preview?component=${slug}&example=${index}`;
      const button = example.getByRole("button", { name: "Reset example", exact: true });
      await expect(button.locator(".blocks-showcase-refresh-label")).toBeVisible();
      const width = (await button.boundingBox())!.width;
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      let requests = 0;
      await page.route(url, async (route) => {
        requests++;
        await gate;
        await route.continue();
      });
      try {
        await button.click();
        await expect(button).toHaveAttribute("data-refresh-state", "loading");
        await expect(button).toBeDisabled();
        await expect(example.locator(".component-example-stage")).toHaveAttribute(
          "aria-busy",
          "true",
        );
        await expect(button.locator(".blocks-showcase-refresh-spinner")).toHaveCSS(
          "animation-name",
          "blocks-refresh-spin",
        );
        await expect.poll(() => requests).toBe(1);
        await button.evaluate((node: HTMLButtonElement) => {
          node.click();
          node.click();
        });
        expect(requests).toBe(1);
        expect((await button.boundingBox())!.width).toBeGreaterThan(width);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await expect(button.locator(".blocks-showcase-refresh-spinner")).toHaveCSS(
          "animation-name",
          "none",
        );
        release();
        await expect(button).toHaveAttribute("data-refresh-state", "complete");
        await expect(button).toBeDisabled();
        await expect(iframe.contentFrame().locator("body")).not.toHaveAttribute(
          "data-reset-test",
          "old",
        );
        expect((await button.boundingBox())!.width).toBe(width);
        await expect(button).toHaveAttribute("data-refresh-state", "idle");
        await expect(button).toBeEnabled();
      } finally {
        release();
        await page.unroute(url);
        await page.emulateMedia({ reducedMotion: "no-preference" });
      }
      await example.getByRole("tab", { name: "Code", exact: true }).click();
      await button.click();
      await expect(example.getByRole("tab", { name: "Preview", exact: true })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(button).toBeEnabled();
    }
  });
}

test("leaving a loading example cancels its reset without a success state", async ({ page }) => {
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
  await page.goto("./docs/formisch/installation");
  await page.waitForSelector("html.pp-ready");
  const example = page.locator(".component-example").first();
  const button = example.getByRole("button", { name: "Reset example", exact: true });
  await example.scrollIntoViewIfNeeded();
  await expect(
    example.locator("iframe").contentFrame().locator(".component-example-canvas"),
  ).toBeVisible();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/component-preview?component=formisch&example=0", async (route) => {
    await gate;
    await route.abort();
  });
  try {
    await button.click();
    await expect(button).toHaveAttribute("data-refresh-state", "loading");
    await example.getByRole("tab", { name: "Prompt", exact: true }).click();
    await expect(button).toHaveAttribute("data-refresh-state", "idle");
    await expect(button).toBeEnabled();
    await expect(example.getByRole("status")).not.toHaveText("Example reset.");
  } finally {
    release();
  }
});
