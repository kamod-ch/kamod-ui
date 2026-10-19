import { expect, test } from "@playwright/test";

for (const width of [320, 1440]) {
  test(`fast jumps skip queued previews while letting started examples finish at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    let release!: () => void;
    const pending = new Promise<void>((resolve) => (release = resolve));
    const requested: number[] = [];
    await page.route(/component-preview-frame\.htm\?component=button&example=/, async (route) => {
      requested.push(Number(new URL(route.request().url()).searchParams.get("example")));
      await pending;
      // Unmounting the page may already have cancelled this navigation.
      await route.continue().catch(() => {});
    });
    try {
      await page.goto("./docs/button/installation", { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const examples = page.locator(".component-example");
      const first = examples.first().locator("iframe");
      const last = examples.last().locator("iframe");
      await first.scrollIntoViewIfNeeded();
      await expect(first).toHaveAttribute("src", /component=button&example=0$/);
      await expect(examples.first().locator(".showcase-loading")).toBeVisible();
      await last.scrollIntoViewIfNeeded();
      await expect(first).toHaveAttribute("src", /component=button&example=0$/);
      const active = page.locator('iframe[src*="component-preview-frame.htm"]');
      expect(await active.count()).toBe(1);
      expect(new Set(requested).size).toBeLessThan(await examples.count());
      release();
      await expect(examples.last().locator(".showcase-loading")).toHaveCount(0);
      await first.scrollIntoViewIfNeeded();
      await expect(examples.first().locator(".showcase-loading")).toHaveCount(0);
      expect(requested.filter((index) => index === 0)).toHaveLength(1);
      await expect(first.contentFrame().locator("#component-preview-root")).toHaveAttribute(
        "data-preview-ready",
        "true",
      );
      await expect(page.locator(".showcase-preview-error")).toHaveCount(0);
    } finally {
      release();
    }
  });

  test(`completed previews keep input and do not reload when scrolled away and back at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    let navigations = 0;
    page.on("request", (request) => {
      if (request.url().endsWith("component-preview-frame.htm?component=formisch&example=0"))
        navigations++;
    });
    await page.goto("./docs/formisch/installation", { waitUntil: "domcontentloaded" });
    const examples = page.locator(".component-example");
    const first = examples.first();
    const frame = first.locator("iframe").contentFrame();
    await first.locator("iframe").scrollIntoViewIfNeeded();
    await expect(first.locator(".showcase-loading")).toHaveCount(0);
    await frame.getByLabel("Bug Title", { exact: true }).fill("Keep this preview state");
    await examples.last().scrollIntoViewIfNeeded();
    await first.locator("iframe").scrollIntoViewIfNeeded();
    await expect(frame.getByLabel("Bug Title", { exact: true })).toHaveValue(
      "Keep this preview state",
    );
    expect(navigations).toBe(1);
  });
}
