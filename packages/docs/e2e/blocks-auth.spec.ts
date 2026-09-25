import { expect, test } from "@playwright/test";

for (const category of ["login", "signup"] as const) {
  const title =
    category === "login" ? "Login Forms and Sign-in Pages" : "Signup Forms and Registration Pages";
  test(`${category}: overview, detail, source and return navigation`, async ({ page }) => {
    page.on("pageerror", (error) => {
      throw error;
    });
    const assets: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") assets.push(request.url());
    });
    await page.goto(`./blocks/${category}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    const cards = page.locator("a.blocks-overview-card");
    await expect(cards).toHaveCount(5);
    await expect(page.locator("article.blocks-card, iframe.blocks-preview-iframe")).toHaveCount(0);
    expect(assets.some((url) => /BlocksAuthContent-|auth-source-/.test(url))).toBe(false);

    await cards.filter({ hasText: `${category}-02` }).click();
    await expect(page).toHaveURL(new RegExp(`/blocks/${category}/${category}-02/?$`));
    const showcase = page.locator(`article#${category}-02`);
    await expect(showcase).toBeVisible();
    expect(assets.some((url) => /BlocksAuthContent-/.test(url))).toBe(true);
    await expect(page.locator("article.blocks-card")).toHaveCount(1);
    expect(assets.some((url) => /auth-source-/.test(url))).toBe(false);
    await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    await expect(
      showcase.getByText(`@kamod-ch/blocks/${category}/${category}-02`, { exact: true }),
    ).toBeVisible();
    await expect(showcase.locator(".blocks-code-pane code")).toContainText("import");
    await showcase.getByRole("button", { name: "auth-cover.svg", exact: true }).click();
    await expect(showcase.locator(".blocks-code-pane code")).toContainText("<svg");
    await showcase.getByRole("tab", { name: "Preview", exact: true }).click();
    await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    await expect(
      showcase.getByRole("button", { name: "auth-cover.svg", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("link", { name: `All ${category} blocks` }).click();
    await expect(cards).toHaveCount(5);
  });

  test(`${category}: old anchors retain their destination and do not trap Back`, async ({
    page,
  }) => {
    await page.goto("./blocks/sidebar");
    await page.goto(`./blocks/${category}?from=bookmark#${category}-03`);
    await expect(page).toHaveURL(
      new RegExp(`/blocks/${category}/${category}-03/?\\?from=bookmark#${category}-03$`),
    );
    await expect(page.locator(`article#${category}-03`)).toBeVisible();
    await page.reload();
    await expect(page.locator(`article#${category}-03`)).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/blocks\/sidebar\/?$/);
  });

  test(`${category}: all detail and preview routes are statically rendered`, async ({
    request,
  }) => {
    for (let i = 1; i <= 5; i++) {
      const id = `${category}-${String(i).padStart(2, "0")}`;
      const detail = await request.get(`./blocks/${category}/${id}/`);
      expect(detail.ok()).toBe(true);
      const html = await detail.text();
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`All ${category} blocks`);
      expect(html).not.toContain("Loading block…");
      expect((await request.get(`./blocks/${category}/${id}/preview/`)).ok()).toBe(true);
    }
  });

  for (const width of [320, 768, 1440]) {
    for (const scheme of ["light", "dark"] as const) {
      test(`${category}: ${width}px ${scheme} keyboard and responsive layout`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: scheme });
        await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
        await page.goto(`./blocks/${category}`);
        const card = page.locator("a.blocks-overview-card").first();
        // The site preloader temporarily makes the document inert; focus() does not wait for it.
        await expect(page.locator("#pp-preloader")).toBeHidden();
        await card.focus();
        await expect(card).toBeFocused();
        await page.keyboard.press("Enter");
        const showcase = page.locator("article.blocks-card");
        await expect(showcase).toBeVisible();
        await showcase.getByRole("button", { name: "Mobile view" }).click();
        await expect(showcase.locator("iframe")).toHaveAttribute(
          "src",
          new RegExp(`/blocks/${category}/${category}-01/preview$`),
        );
        await showcase.getByRole("button", { name: "Refresh Preview" }).click();
        await expect(showcase.locator("iframe")).toBeVisible();
        await showcase.getByRole("tab", { name: "Code", exact: true }).focus();
        await page.keyboard.press("Enter");
        await expect(showcase.locator(".blocks-code-pane code")).toContainText("import");
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      });
    }
  }
}

test("unknown category anchors stay on the overview", async ({ page }) => {
  await page.goto("./blocks/login#signup-01");
  await expect(page.getByRole("heading", { name: "Login Forms and Sign-in Pages" })).toBeVisible();
  await expect(page).toHaveURL(/\/blocks\/login\/?#signup-01$/);
  await page.evaluate(() => {
    window.location.hash = "login-04";
  });
  await expect(page).toHaveURL(/\/blocks\/login\/login-04\/?#login-04$/);
});
