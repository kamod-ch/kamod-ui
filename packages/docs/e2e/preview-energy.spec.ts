import { expect, test } from "@playwright/test";

for (const width of [320, 1440]) {
  test(`visiting every example bounds retained documents and reloads evicted previews at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const requests: number[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.pathname.endsWith("component-preview-frame.htm"))
        requests.push(Number(url.searchParams.get("example")));
    });
    await page.goto("/docs/button/installation");
    const frames = page.locator(".component-example iframe");
    for (const frame of await frames.all()) {
      await frame.scrollIntoViewIfNeeded();
      await expect(frame.contentFrame().locator("#component-preview-root")).toHaveAttribute(
        "data-preview-ready",
        "true",
      );
      await expect
        .poll(() => page.locator('iframe[src*="component-preview-frame.htm"]').count())
        .toBeLessThanOrEqual(3);
    }
    await expect(frames.first()).toHaveAttribute("src", "about:blank");
    await frames.first().scrollIntoViewIfNeeded();
    await expect(frames.first().contentFrame().locator("#component-preview-root")).toHaveAttribute(
      "data-preview-ready",
      "true",
    );
    expect(requests.filter((index) => index === 0)).toHaveLength(2);
    await expect(page.locator(".showcase-preview-error")).toHaveCount(0);
  });
}

test("retained skeleton examples stop animating outside the article viewport", async ({ page }) => {
  await page.goto("/docs/skeleton/installation");
  const frames = page.locator(".component-example iframe");
  for (const frame of [frames.first(), frames.last()]) {
    await frame.scrollIntoViewIfNeeded();
    await expect(frame.contentFrame().locator("#component-preview-root")).toHaveAttribute(
      "data-preview-ready",
      "true",
    );
  }
  const first = frames.first().contentFrame();
  await expect(first.locator("html")).toHaveAttribute("data-preview-paused");
  await expect
    .poll(() =>
      first
        .locator("body")
        .evaluate(() =>
          document.getAnimations().some((animation) => animation.playState === "running"),
        ),
    )
    .toBe(false);
  await frames.first().scrollIntoViewIfNeeded();
  await expect(first.locator("html")).not.toHaveAttribute("data-preview-paused");
  await expect
    .poll(() =>
      first
        .locator("body")
        .evaluate(() =>
          document.getAnimations().some((animation) => animation.playState === "running"),
        ),
    )
    .toBe(true);
});

test("the settled home page has no permanent decorative animation or offscreen loader loop", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".home-workspace-preview")).toHaveAttribute("aria-busy", "false");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.getAnimations().filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBe(0);
});

test("inline usage examples pause their motion outside the viewport", async ({ page }) => {
  await page.goto("/docs/button/installation");
  const preview = page.locator(".docs-button-usage-preview");
  const running = () =>
    preview.evaluate((node) =>
      node.getAnimations({ subtree: true }).some((animation) => animation.playState === "running"),
    );
  await expect.poll(running).toBe(false);
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(running).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(running).toBe(false);
});

test("a block's retained preview receives the same offscreen pause signal", async ({ page }) => {
  await page.goto("/blocks/application-shell/application-shell-1");
  const frame = page.getByTitle("Block preview", { exact: true });
  await frame.scrollIntoViewIfNeeded();
  await expect(page.locator(".blocks-showcase-preview")).toHaveAttribute("aria-busy", "false");
  const root = frame.contentFrame().locator("html");
  await expect(root).not.toHaveAttribute("data-preview-paused");
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(root).toHaveAttribute("data-preview-paused");
  await frame.scrollIntoViewIfNeeded();
  await expect(root).not.toHaveAttribute("data-preview-paused");
});
