import { expect, type Page, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";
import { enableTestClipboard } from "./browser-utils";

const openGuide = async (page: Page, hash = "prism-color-themes") => {
  await page.goto(`/docs/theming/installation#${hash}`);
  await page.waitForSelector("html.pp-ready");
  await expect(page.locator(`#${hash}`)).toBeInViewport();
};

async function pageAppearance(page: Page, scheme: "light" | "dark") {
  await page.getByRole("button", { name: "Choose color theme" }).filter({ visible: true }).click();
  const picker = page.getByRole("dialog", { name: "Find your Palette" });
  const action = picker.getByRole("button", { name: `Switch to ${scheme} mode` });
  if (await action.count()) await action.click();
  await picker.getByRole("button", { name: "Close color theme picker" }).click();
}

for (const width of [320, 768, 1024, 1440]) {
  test(`Prism chapters and credits fit at ${width}px in both appearances`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openGuide(page, "prism-theme-dracula");
    const chapter = page.locator('[data-prism-study="dracula"]');
    await expect(page.locator(".prism-theme-study")).toHaveCount(24);
    await expect(chapter.locator(".prism-study-source .token.keyword").first()).toBeVisible();
    const paint = () =>
      chapter.locator(".prism-study-source pre code").evaluate((code) => ({
        background: getComputedStyle(code).backgroundColor,
        foreground: getComputedStyle(code).color,
        keyword: getComputedStyle(code.querySelector(".token.keyword")!).color,
      }));
    const sourceColors = await paint();
    for (const appearance of ["light", "dark"] as const) {
      await pageAppearance(page, appearance);
      await chapter.scrollIntoViewIfNeeded();
      expect(await paint()).toEqual(sourceColors);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      for (const selector of [
        ".prism-study-workbench",
        ".prism-study-inspector",
        ".prism-study-recipe",
      ]) {
        expect(
          await chapter
            .locator(selector)
            .evaluate((element) => element.scrollWidth <= element.clientWidth),
        ).toBe(true);
      }
      await assertNoBlockingA11yViolations(page, `Prism ${width}px ${appearance} controls`, {
        include: '[data-prism-study="dracula"]',
        // Preserve literal upstream specimens, whose contrast is described by the inspector.
        exclude: ".prism-study-source pre",
      });
      await page.locator("#prism-theme-resources").scrollIntoViewIfNeeded();
      expect(
        await page
          .locator(".prism-theme-resources")
          .evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("the final theme group expands by keyboard and filters only its navigation", async ({
  page,
}) => {
  await openGuide(page, "color-theme-presets");
  const index = page.locator(".prism-theme-index");
  const summary = index.locator(":scope > summary");
  await expect(index).not.toHaveAttribute("open");
  await summary.focus();
  await summary.press("Enter");
  await expect(index).toHaveAttribute("open", "");
  await summary.press("Space");
  await expect(index).not.toHaveAttribute("open");
  await summary.press("Enter");
  const search = index.getByRole("searchbox", { name: "Find a Prism theme" });
  await search.fill("dracula");
  await expect(index.locator(".prism-theme-index-links a")).toHaveCount(1);
  await index.getByRole("combobox").selectOption("light");
  await expect(index.getByText("No theme matches.")).toBeVisible();
  await index.getByRole("button", { name: "Clear filters" }).click();
  await expect(search).toBeFocused();
  await expect(index.locator(".prism-theme-index-links a")).toHaveCount(24);
  await expect(page.locator(".prism-theme-study")).toHaveCount(24);

  const sidebar = page.getByRole("navigation", { name: "On This Page" }).filter({ visible: true });
  const toggle = sidebar.getByRole("button", { name: "Toggle Prism Syntax Themes sections" });
  await toggle.focus();
  await toggle.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await index.getByRole("link", { name: "Nord", exact: true }).click();
  await expect(page).toHaveURL(/#prism-theme-nord$/);
  await expect(page.locator("#prism-theme-nord")).toBeInViewport();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(sidebar.getByRole("link", { name: "Nord", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("each saved palette paints its source and token inspector independently", async ({ page }) => {
  const thirdParty: string[] = [];
  page.on("request", (request) => {
    // The site's existing analytics are independent of the saved palettes.
    if (
      /^https?:/.test(request.url()) &&
      !["127.0.0.1", "matomo.kamod.ch"].includes(new URL(request.url()).hostname)
    )
      thirdParty.push(request.url());
  });
  await openGuide(page);
  const studies = page.locator(".prism-theme-study");
  for (const chapter of await studies.all()) {
    await chapter.locator("h4").scrollIntoViewIfNeeded();
    await expect(chapter.locator(".prism-study-source .token.keyword").first()).toBeVisible();
    const colors = await chapter.evaluate((element) => {
      const code = element.querySelector(".prism-study-source pre code")!;
      const keyword = code.querySelector(".token.keyword")!;
      const sample = element.querySelector(".prism-selected-paint")!;
      const root = document.documentElement;
      const initialDark = root.classList.contains("dark");
      try {
        return [false, true].map((dark) => {
          root.classList.toggle("dark", dark);
          return {
            dark,
            expected: getComputedStyle(sample).backgroundColor,
            actual: getComputedStyle(keyword).color,
          };
        });
      } finally {
        root.classList.toggle("dark", initialDark);
      }
    });
    for (const paint of colors) expect(paint.actual).toBe(paint.expected);
    await expect(chapter.locator(".prism-study-footer a").first()).toHaveAttribute(
      "href",
      /^https:\/\/github.com\/PrismJS\/(prism|prism-themes)\/blob\//,
    );
  }
  expect(thirdParty).toEqual([]);
});

test("language, exact copy, licensed download and recipe controls stay local", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await openGuide(page, "prism-theme-dracula");
  const chapter = page.locator('[data-prism-study="dracula"]');
  const preferences = await page.evaluate(() => ({
    theme: localStorage.getItem("theme"),
    preset: localStorage.getItem("theme-preset"),
  }));
  await chapter.getByRole("button", { name: "CSS", exact: true }).click();
  await expect(chapter.locator(".prism-study-source pre code")).toHaveText(/\.review-queue/);
  await chapter.getByRole("button", { name: "JSON", exact: true }).click();
  await expect(chapter.locator(".prism-study-source pre code")).toHaveText(/"pending": 3/);
  await expect(
    page.locator('[data-prism-study="nord"] .prism-study-languages button[aria-pressed="true"]'),
  ).toHaveText("TSX");

  const swatch = chapter.getByRole("button", { name: "Inspect Dracula strings color" });
  await swatch.click();
  const value = (await chapter.locator(".prism-study-token-value code").innerText()).trim();
  await chapter.getByRole("button", { name: "Copy Dracula strings color" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value);
  await swatch.focus();
  await expect(
    page.getByRole("tooltip").filter({ hasText: "A representative string token" }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("tooltip")
      .filter({ hasText: "A representative string token" })
      .evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("tooltip").filter({ hasText: "A representative string token" }),
  ).toHaveCount(0);

  await chapter.getByRole("button", { name: "Copy scoped CSS", exact: true }).click();
  const css = await page.evaluate(() => navigator.clipboard.readText());
  expect(css).toContain('[data-prism-theme="dracula"]');
  expect(css).toContain("SPDX-License-Identifier: MIT");
  expect(css).toContain("447479fc7b2be2051fe27e561aceed7cc87a589f");
  const downloading = page.waitForEvent("download");
  await chapter
    .locator(".prism-study-css-actions")
    .getByRole("button", { name: /Download/ })
    .click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("prism-dracula.css");
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  expect(Buffer.concat(chunks).toString("utf8")).toBe(css);

  await chapter.getByRole("button", { name: "Show TSX example" }).click();
  await expect(chapter.locator(".prism-study-integration pre code")).toHaveText(
    /data-prism-theme="dracula"/,
  );
  await expect(
    chapter
      .locator(".prism-study-integration")
      .getByRole("button", { name: "Copy code", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => ({
      theme: localStorage.getItem("theme"),
      preset: localStorage.getItem("theme-preset"),
    })),
  ).toEqual(preferences);
});

test("incoming Prism routes reveal the group and retain the correct heading after reload", async ({
  page,
}) => {
  await page.goto("/docs/theming/prism-theme-atom-dark");
  await page.waitForSelector("html.pp-ready");
  await expect(page.locator("#prism-theme-atom-dark")).toBeInViewport();
  await expect(page.locator(".prism-theme-index")).toHaveAttribute("open", "");
  const toggle = page
    .getByRole("button", { name: "Toggle Prism Syntax Themes sections" })
    .filter({ visible: true });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.reload();
  await page.waitForSelector("html.pp-ready");
  await expect(page.locator("#prism-theme-atom-dark")).toBeInViewport();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});
