import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

for (const [category, count] of [
  ["sidebar", 16],
  ["application-shell", 1],
  ["login", 5],
  ["signup", 5],
] as const) {
  test(`${category}: lightweight image cards link to every variant`, async ({ page }) => {
    const scripts: string[] = [];
    page.on("pageerror", (error) => {
      throw error;
    });
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(request.url());
    });
    await page.goto(`./blocks/${category}`);
    await expect(
      page.locator(".blocks-category-header").getByRole("link", { name: "Blocks", exact: true }),
    ).toHaveAttribute("href", /\/blocks\/sidebar$/);
    const cards = page.locator("a.blocks-overview-card");
    await expect(cards).toHaveCount(count);
    await expect(page.locator("iframe, article.blocks-card")).toHaveCount(0);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card.locator("img")).toBeVisible();
      await expect
        .poll(() =>
          card
            .locator("img")
            .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
      await expect(card).toHaveAttribute("href", new RegExp(`/blocks/${category}/[^/]+$`));
      await expect(card.locator("button, a, input")).toHaveCount(0);
    }
    expect(
      scripts.filter((url) =>
        /Blocks\w+Content-|(?:auth|sidebar|application-shell)-source-/.test(url),
      ),
    ).toEqual([]);
    await expect(cards.nth(0).locator("img")).toHaveAttribute("loading", "eager");
    if (count > 3) await expect(cards.nth(3).locator("img")).toHaveAttribute("loading", "lazy");
    await cards.first().focus();
    await expect(cards.first()).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("article.blocks-card")).toBeVisible();
  });
}

for (const width of [320, 768, 1024, 1440, 1920]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`overview ${width}px ${scheme}: theme images, layout and accessibility`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      // Deliberately disagree with stored preference: no incorrect initial set should be fetched.
      await page.emulateMedia({ colorScheme: scheme === "dark" ? "light" : "dark" });
      await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
      const images: string[] = [];
      page.on("request", (request) => {
        if (request.url().includes("/block-previews/")) images.push(request.url());
      });
      await page.goto("./blocks/login");
      const first = page.locator("a.blocks-overview-card").first();
      await expect(first.locator("img")).toHaveAttribute("src", new RegExp(`-${scheme}-`));
      await expect
        .poll(() => first.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
      expect(images.length).toBeGreaterThan(0);
      expect(images.every((url) => url.includes(`-${scheme}-`))).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.locator("#pp-preloader")).toBeHidden();
      await first.focus();
      await expect(first).toHaveCSS("outline-style", "solid");
      // The official logo's orange "UI" wordmark is exempt from WCAG text-contrast requirements.
      await assertNoBlockingA11yViolations(page, "block overview", {
        exclude: ".kamod-logo__suffix",
      });
      await page.locator('[data-slot="theme-toggle"]').click();
      await expect(first.locator("img")).toHaveAttribute(
        "src",
        new RegExp(`-${scheme === "dark" ? "light" : "dark"}-`),
      );
    });
  }
}

test("failed thumbnails preserve the preview frame and detail link", async ({ page }) => {
  await page.route("**/block-previews/**", (route) => route.abort());
  await page.goto("./blocks/login");
  const card = page.locator("a.blocks-overview-card").first();
  await expect(card.locator("img")).toHaveCount(0);
  await expect(card.getByText("Explore the live demo")).toBeVisible();
  const box = await card.locator(".blocks-overview-preview").boundingBox();
  expect(box && box.height > 100).toBeTruthy();
  await card.click();
  await expect(page.locator("article#login-01")).toBeVisible();
});

test("static cards retain text and navigation without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL("./blocks/login/", baseURL).href);
  const card = page.getByRole("link", { name: "login-01", exact: true });
  await expect(card).toHaveAttribute("href", /\/blocks\/login\/login-01$/);
  await expect(card.getByText("A simple login form.")).toBeVisible();
  await context.close();
});
