import { expect, test } from "@playwright/test";

const routes = [
  "docs/getting-started",
  "docs/components",
  "docs/accordion/installation",
  "docs/cn/installation",
  "docs/code/installation",
  "docs/forms",
  "docs/formisch/installation",
  "docs/packages",
  "docs/hooks-package/installation",
  "docs/icons-package/installation",
  "blocks",
  "blocks/sidebar",
  "blocks/sidebar/sidebar-01",
  "blocks/application-shell",
  "blocks/application-shell/application-shell-1",
  "blocks/login/login-01",
  "blocks/app-sidebar",
  "blocks/dashboard",
  "blocks/marketing",
  "blocks/communication",
  "blocks/commerce",
  "blocks/auth",
];

test.beforeEach(async ({ page }) => {
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
});

for (const route of routes) {
  test(`${route}: main title and first contents entry share the same destination`, async ({
    page,
  }) => {
    await page.goto(`./${route}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const title = page.locator("h1#page-title");
    await expect(title).toHaveCount(1);
    await expect(title.getByRole("link")).toHaveAttribute("href", "#page-title");
    const contents = page.locator(
      ".docs-rightbar-contents, .blocks-detail-documentation .blocks-doc-toc nav",
    );
    const first = contents.locator(".page-contents-list > li > a").first();
    await expect(first).toHaveAttribute("href", "#page-title");
    await expect(first).toHaveText((await title.innerText()).trim());
    await first.focus();
    await first.press("Enter");
    await expect(page).toHaveURL(/#page-title$/);
    await expect(title).toBeInViewport();
    await expect(first).toHaveAttribute("aria-current", "location");
    if (route === "docs/cn/installation") await expect(title.locator("code")).toHaveText("cn");
    if (route === "blocks/sidebar/sidebar-01") {
      await expect(page.locator("#sidebar-01-overview")).toBeAttached();
      await page.goto(`./${route}#sidebar-01-overview`);
      await expect(title).toBeInViewport();
    }
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`title permalink stays usable on small screens in ${scheme} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
    await page.goto("./docs/accordion/installation");
    const title = page.locator("h1#page-title");
    const link = title.getByRole("link");
    await expect(title).toBeVisible();
    await link.focus();
    await link.press("Enter");
    await expect(page).toHaveURL(/#page-title$/);
    await expect(title).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  });
}
