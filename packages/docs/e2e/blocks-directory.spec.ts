import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const categories = [
  ["Application Shell", "application-shell", 1],
  ["Login", "login", 5],
  ["Sidebar", "sidebar", 16],
  ["Signup", "signup", 5],
] as const;

test("the Blocks directory lists published collections and links through the site hierarchy", async ({
  page,
}) => {
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("./blocks");
  await expect(page.getByRole("heading", { name: "Blocks", exact: true, level: 1 })).toBeVisible();
  await expect(page.getByText(/Browse 27 reusable Kamod UI blocks/)).toBeVisible();
  await expect(page.getByText("Straight talk", { exact: true })).toBeVisible();
  await expect(
    page.locator(".docs-topbar-links").getByRole("link", { name: "Blocks" }),
  ).toHaveAttribute("href", /\/blocks$/);
  await expect(
    page.locator("aside.docs-sidebar").getByRole("link", { name: "Blocks overview" }),
  ).toHaveAttribute("aria-current", "page");
  const directory = page.getByRole("navigation", { name: "Block categories", exact: true });
  await expect(directory.getByRole("link")).toHaveCount(categories.length);
  for (const [label, slug, count] of categories) {
    await expect(
      directory.getByRole("link", {
        name: `${label} ${count} ${count === 1 ? "variant" : "variants"}`,
        exact: true,
      }),
    ).toHaveAttribute("href", new RegExp(`/blocks/${slug}$`));
  }
  await expect(page.locator("iframe, article.blocks-card")).toHaveCount(0);
  expect(
    scripts.filter((url) =>
      /Blocks\w+Content-|(?:auth|sidebar|application-shell)-source-/.test(url),
    ),
  ).toEqual([]);

  const sidebar = directory.getByRole("link", { name: "Sidebar 16 variants", exact: true });
  await sidebar.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/blocks\/sidebar\/?$/);
  await page
    .getByRole("navigation", { name: "Block breadcrumb" })
    .getByRole("link", { name: "Blocks", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blocks\/?$/);

  await page.goto("./blocks/sidebar/sidebar-05");
  await page
    .getByRole("navigation", { name: "Block breadcrumb" })
    .getByRole("link", { name: "Blocks", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "All block categories" })).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  test(`the directory stays usable across site breakpoints (${theme})`, async ({ page }) => {
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), theme);
    await page.goto("./blocks/");
    for (const width of [320, 360, 639, 640, 979, 980, 1259, 1260, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const directory = page.getByRole("navigation", { name: "Block categories", exact: true });
      await expect(directory.getByRole("link")).toHaveCount(categories.length);
      for (const link of await directory.getByRole("link").all()) {
        await expect(link).toBeVisible();
        const bounds = (await link.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        expect(bounds.height).toBeGreaterThanOrEqual(44);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await assertNoBlockingA11yViolations(page, "Blocks directory", {
      include: "main.docs-content",
    });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const menu = page.getByRole("navigation", { name: "Browse all pages" });
    await expect(menu.getByRole("link", { name: "Blocks overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await menu.getByRole("link", { name: "Blocks overview" }).click();
    await expect(menu).toBeHidden();
  });
}

test("directory links are present in static HTML without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(new URL("./blocks/", baseURL).href);
    await expect(
      page.getByRole("heading", { name: "Blocks", exact: true, level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Block categories", exact: true }).getByRole("link"),
    ).toHaveCount(4);
  } finally {
    await context.close();
  }
});
