import { expect, type Locator, test } from "@playwright/test";

/** Inverse tooltip text must not disappear through self-referential currentColor mixes. */
async function assertReferenceContrast(card: Locator) {
  const textAlpha = await card.evaluate((node) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    return [
      ".code-reference-help-kind",
      ".code-reference-help-summary > p:first-child",
      ".code-reference-help-detail",
      ".code-reference-help-related-link",
    ].map((selector) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = getComputedStyle(node.querySelector(selector)!).color;
      context.fillRect(0, 0, 1, 1);
      return context.getImageData(0, 0, 1, 1).data[3];
    });
  });
  // Inverse tooltip text must remain readable; self-referential color mixes can become transparent.
  expect(textAlpha.every((alpha) => alpha >= 180)).toBe(true);
}

test("lazy help shows a reading placeholder and dismissed requests cannot reopen it", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/assets\/code-reference-help-[\w-]+\.js(?:\?|$)/, async (route) => {
    await held;
    await route.continue();
  });
  try {
    // The intentionally held optional chunk may keep the load event pending.
    await page.goto("./docs/code/installation#source-links", { waitUntil: "domcontentloaded" });
    const sample = page
      .locator('section[aria-labelledby="code-reference-navigation"] pre code')
      .filter({ hasText: "LocaleBoundary" });
    await sample.scrollIntoViewIfNeeded();
    await expect(sample.locator(".token")).not.toHaveCount(0);
    const provider = sample.getByRole("link", { name: "DirectionProvider", exact: true }).first();
    await page.keyboard.press("Tab");
    await provider.focus();
    const card = page.getByRole("dialog", { name: "DirectionProvider reference", exact: true });
    const loading = card.locator(".code-reference-help-loading");
    const title = loading.getByText("Following the reference...", { exact: true });
    await expect(title).toBeVisible();
    const spinner = loading.locator(".code-reference-help-loading-spinner");
    await expect(spinner).toBeVisible();
    await expect(loading.locator(".code-reference-help-loading-pulse")).toHaveCount(0);
    await expect(loading.locator(".code-reference-help-loading-module")).toHaveCount(0);
    expect(
      await loading
        .locator(".code-reference-help-loading-note")
        .evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
    ).toBeGreaterThanOrEqual(8.5);
    const headingBox = (await title.boundingBox())!;
    const spinnerBox = (await spinner.boundingBox())!;
    expect(
      Math.abs(headingBox.y + headingBox.height / 2 - spinnerBox.y - spinnerBox.height / 2),
    ).toBeLessThan(1);
    await expect(card.locator('[aria-busy="true"]')).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
    release();
    await page.waitForLoadState("networkidle");
    await expect(card).toHaveCount(0);
    await provider.evaluate((node) => node.blur());
    await provider.focus();
    await expect(card.locator('[data-reference-kind="component"]')).toBeVisible();
  } finally {
    release();
  }
});

test("failed optional details retain the source destination", async ({ page }) => {
  await page.route(/\/assets\/code-reference-help-[\w-]+\.js(?:\?|$)/, (route) => route.abort());
  await page.goto("./docs/code/installation#source-links");
  const sample = page
    .locator('section[aria-labelledby="code-reference-navigation"] pre code')
    .filter({ hasText: "LocaleBoundary" });
  await sample.scrollIntoViewIfNeeded();
  await expect(sample.locator(".token")).not.toHaveCount(0);
  const provider = sample.getByRole("link", { name: "DirectionProvider", exact: true }).first();
  await provider.hover();
  const card = page.getByRole("dialog", { name: "DirectionProvider reference", exact: true });
  await expect(card.getByRole("link", { name: "Open the reference", exact: true })).toHaveAttribute(
    "href",
    /\/docs\/direction\/installation#api-reference$/,
  );
  await card.getByRole("link", { name: "Open the reference", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/direction\/installation\/?#api-reference$/);
});

test("source references reveal verified context after deliberate hover and keep native navigation", async ({
  page,
}) => {
  await page.goto("./docs/code/installation#source-links");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const sample = page
    .locator('section[aria-labelledby="code-reference-navigation"] pre code')
    .filter({ hasText: "LocaleBoundary" });
  const provider = sample.getByRole("link", { name: "DirectionProvider", exact: true }).first();
  await provider.scrollIntoViewIfNeeded();
  const source = await sample.textContent();
  await provider.hover();
  await expect(
    page.getByRole("dialog", { name: "DirectionProvider reference", exact: true }),
  ).toHaveCount(0);
  const card = page.getByRole("dialog", { name: "DirectionProvider reference", exact: true });
  await expect(card.locator('[data-reference-kind="component"]')).toBeVisible();
  await expect(card).toContainText("direction");
  await assertReferenceContrast(card);
  const index = card.locator(".code-reference-help-related");
  await expect(
    index.getByRole("link", { name: "DirectionProviderProps", exact: true }),
  ).toHaveAttribute("href", /#component-type-Direction-DirectionProviderProps$/);
  await expect(index.getByRole("link", { name: "DirectionProps", exact: true })).toHaveAttribute(
    "href",
    /#component-type-Direction-DirectionProps$/,
  );
  await expect(index.getByRole("link", { name: "Props & defaults", exact: true })).toHaveAttribute(
    "href",
    /#component-props-direction-Direction$/,
  );
  await expect(
    index.locator('a[href$="packages/core/src/components/direction/Direction.tsx"]'),
  ).toHaveCount(1);
  expect(await sample.textContent()).toBe(source);
  await card.hover();
  await expect(card).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(card).toHaveCount(0);
  await provider.click();
  await expect(page).toHaveURL(/\/docs\/direction\/installation\/?#api-reference$/);
  await expect(page.locator("#api-reference")).toBeInViewport();
});

for (const scheme of ["light", "dark"] as const) {
  test(`types and module cards fit narrow screens and keyboard links work (${scheme})`, async ({
    page,
  }) => {
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
    await page.goto("./docs/code/installation#source-links");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const sample = page
      .locator('section[aria-labelledby="code-reference-navigation"] pre code')
      .filter({ hasText: "LocaleBoundary" });
    await sample.scrollIntoViewIfNeeded();
    // Deferred coloring replaces the initial escaped markup; focus the settled source anchor.
    await expect(sample.locator(".token")).not.toHaveCount(0);
    const type = sample.getByRole("link", { name: "DirectionProviderProps", exact: true }).first();
    await type.scrollIntoViewIfNeeded();
    await page.keyboard.press("Tab");
    await type.focus();
    const card = page.getByRole("dialog", {
      name: "DirectionProviderProps reference",
      exact: true,
    });
    await expect(card.locator('[data-reference-kind="type"]')).toBeVisible();
    await assertReferenceContrast(card);
    await page.keyboard.press("Tab");
    expect(await card.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(type).toBeFocused();
    await expect(card).toHaveCount(0);
    await page.setViewportSize({ width: 320, height: 900 });
    const module = sample.getByRole("link", { name: "@kamod-ch/ui/direction", exact: true });
    await module.scrollIntoViewIfNeeded();
    await page.keyboard.press("Tab");
    await module.focus();
    const moduleCard = page.getByRole("dialog", {
      name: "@kamod-ch/ui/direction reference",
      exact: true,
    });
    await expect(moduleCard.locator('[data-reference-kind="module"]')).toBeVisible();
    const bounds = (await moduleCard.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
    expect(await moduleCard.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    await moduleCard
      .locator(".code-reference-help-related")
      .getByRole("link", { name: "DirectionProviderProps", exact: true })
      .click();
    await expect(page).toHaveURL(
      /\/docs\/direction\/installation\/?#component-type-Direction-DirectionProviderProps$/,
    );
    await expect(page.locator("#component-type-Direction-DirectionProviderProps")).toBeInViewport();
  });
}
