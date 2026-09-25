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
    await expect(page.locator(".blocks-overview-count")).toHaveText(
      `Showing ${count} of ${count} ${count === 1 ? "variant" : "variants"}`,
    );
    await expect(page.locator("iframe, article.blocks-card")).toHaveCount(0);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card.locator("img")).toBeVisible();
      await expect(card.locator("img")).toHaveCSS("object-fit", "cover");
      await expect
        .poll(() =>
          card
            .locator("img")
            .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
      await expect(card).toHaveAttribute("href", new RegExp(`/blocks/${category}/[^/]+$`));
      await expect(card.locator("button, a, input")).toHaveCount(0);
      const surface = card.locator("..");
      await expect(surface.getByRole("link", { name: /source on GitHub/ })).toHaveAttribute(
        "href",
        new RegExp(`github.com/kamod-ch/kamod-ui/tree/main/packages/blocks/src/${category}/`),
      );
      await expect(surface.getByRole("link", { name: /Add .* to your project/ })).toHaveAttribute(
        "href",
        /#.*installation$/,
      );
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
    await page.goBack();
    await cards.first().focus();
    await page.keyboard.press("Tab");
    await expect(
      cards
        .first()
        .locator("..")
        .getByRole("link", { name: /source on GitHub/ }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      cards
        .first()
        .locator("..")
        .getByRole("link", { name: /Add .* to your project/ }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Add this block", exact: true }),
    ).toBeInViewport();
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
      await expect(page.getByRole("main")).toHaveCount(1);
      const header = await page.locator(".blocks-category-header").boundingBox();
      const grid = await page.locator(".blocks-overview-grid").boundingBox();
      expect(header && grid).toBeTruthy();
      expect(Math.abs(header!.x - grid!.x)).toBeLessThan(1);
      expect(Math.abs(header!.width - grid!.width)).toBeLessThan(1);
      expect(header!.y + header!.height).toBeLessThan(grid!.y);
      if (width >= 980) {
        const sidebar = await page.locator("aside.docs-sidebar").boundingBox();
        expect(sidebar).toBeTruthy();
        expect(Math.abs(sidebar!.y - grid!.y)).toBeLessThan(1);
      } else {
        await expect(page.locator("aside.docs-sidebar")).toBeHidden();
      }
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

test("planned categories stay navigable without becoming screenshot targets", async ({ page }) => {
  await page.goto("./blocks/sidebar");
  const sidebar = page.locator("aside.docs-sidebar");
  const links = sidebar.getByRole("navigation", { name: "Docs blocks", exact: true });
  await expect(links.locator("a[data-block-placeholder]")).toHaveCount(20);
  await expect(links.locator("a:not([data-block-placeholder])")).toHaveCount(4);
  await expect(sidebar.getByText("27 blocks", { exact: true })).toBeVisible();
  const about = links.getByRole("link", { name: "About", exact: true });
  await expect(about).toHaveAttribute("href", /\/blocks\/about$/);
  await expect(about).toHaveAccessibleDescription("0 variants; page not available yet");
  await page.setViewportSize({ width: 320, height: 900 });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const mobile = page.getByRole("navigation", { name: "Mobile block categories", exact: true });
  await expect(mobile.getByRole("link")).toHaveCount(24);
  await mobile.getByRole("link", { name: "Login", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Login Forms and Sign-in Pages" })).toBeVisible();
});

for (const scheme of ["light", "dark"] as const) {
  test(`category disclosures expose variant links independently (${scheme})`, async ({ page }) => {
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
    await page.goto("./blocks/sidebar");
    const navigation = page
      .locator("aside.docs-sidebar")
      .getByRole("navigation", { name: "Docs blocks" });
    await expect(navigation.getByRole("button")).toHaveCount(4);
    const emptyRows = navigation.locator(".blocks-category-row").filter({
      has: page.locator("a[data-block-placeholder]"),
    });
    await expect(emptyRows).toHaveCount(20);
    await expect(emptyRows.locator("button, svg")).toHaveCount(0);

    for (const [label, count] of [
      ["Sidebar", 16],
      ["Login", 5],
      ["Signup", 5],
      ["Application Shell", 1],
    ] as const) {
      const toggle = navigation.getByRole("button", { name: `Toggle ${label} variants` });
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      const variants = navigation.getByRole("list", { name: `${label} variants` });
      await expect(variants.getByRole("link")).toHaveCount(count);
      await expect(variants).toHaveCSS("border-left-style", "dashed");
      await expect(page).toHaveURL(/\/blocks\/sidebar\/?$/);
      // Leave Sidebar expanded while opening another category.
      if (label !== "Sidebar") {
        await expect(navigation.getByRole("list", { name: "Sidebar variants" })).toBeVisible();
        await page.keyboard.press("Space");
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(variants).toBeHidden();
        await expect(toggle).toBeFocused();
      }
    }
    await expect(
      navigation.locator("a.blocks-category-link:not([data-block-placeholder])"),
    ).toHaveCount(4);
    await assertNoBlockingA11yViolations(page, "expanded block categories", {
      exclude: ".kamod-logo__suffix",
    });
    const variant = navigation.getByRole("link", { name: "Sidebar 16", exact: true });
    await variant.scrollIntoViewIfNeeded();
    await variant.click();
    await expect(page).toHaveURL(/\/blocks\/sidebar\/sidebar-16\/?$/);
    await expect(page.locator("article#sidebar-16")).toBeVisible();
  });
}

for (const width of [320, 768]) {
  test(`mobile category disclosure stays open until a variant is selected (${width}px)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 600 });
    await page.goto("./blocks/login");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const navigation = page.getByRole("navigation", { name: "Mobile block categories" });
    const toggle = navigation.getByRole("button", { name: "Toggle Signup variants" });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(navigation).toBeVisible();
    expect((await toggle.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const variant = navigation.getByRole("link", { name: "Signup 5", exact: true });
    await variant.scrollIntoViewIfNeeded();
    expect((await variant.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await variant.click();
    await expect(page).toHaveURL(/\/blocks\/signup\/signup-05\/?$/);
    await expect(page.locator("article#signup-05")).toBeVisible();
    await expect(navigation).toBeHidden();
  });
}

test("header preview uses a current-category thumbnail and keeps its selection when themes change", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  for (const category of ["sidebar", "application-shell", "login", "signup"]) {
    await page.goto(`./blocks/${category}`);
    const preview = page.locator(".blocks-category-preview-link");
    await expect(preview).toBeVisible();
    const destination = await preview.getAttribute("href");
    const card = page.locator(`.blocks-overview-card[href="${destination}"]`);
    await expect(card).toHaveCount(1);
    await expect
      .poll(() => preview.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
    await expect(preview.locator("img")).toHaveAttribute(
      "src",
      (await card.locator("img").getAttribute("src"))!,
    );
    const before = await preview.locator("img").getAttribute("src");
    await page.locator('[data-slot="theme-toggle"]').click();
    await expect(preview.locator("img")).not.toHaveAttribute("src", before!);
    await expect(preview).toHaveAttribute("href", destination!);
    const bounds = (await preview.boundingBox())!;
    const sidebar = (await page.locator("aside.docs-sidebar").boundingBox())!;
    const header = (await page.locator(".blocks-category-header").boundingBox())!;
    expect(bounds.x).toBe(sidebar.x);
    expect(bounds.x + bounds.width).toBeLessThan(header.x);
    expect(bounds.y + bounds.height).toBeLessThan(sidebar.y);
    await preview.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(preview).toBeFocused();
    await expect(preview).toHaveCSS("outline-style", "solid");
    await page.setViewportSize({ width: 979, height: 900 });
    await expect(preview).toBeHidden();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(preview).toHaveAttribute("href", destination!);
  }
});

for (const scheme of ["light", "dark"] as const) {
  test(`category headers and card contents fit across breakpoint boundaries (${scheme})`, async ({
    page,
  }) => {
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
    for (const category of ["application-shell", "sidebar", "login", "signup"]) {
      await page.goto(`./blocks/${category}`);
      await expect(page.locator(".blocks-overview-preview img").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      for (const width of [
        320, 608, 639, 640, 667, 668, 768, 979, 980, 1024, 1259, 1260, 1440, 1679, 1680, 1920,
      ]) {
        await page.setViewportSize({ width, height: 900 });
        const layout = await page.evaluate(() => {
          const header = document.querySelector(".blocks-category-title-row")!;
          const title = header.querySelector("h1")!.getBoundingClientRect();
          const badge = header.querySelector('[data-slot="badge"]')!.getBoundingClientRect();
          const cards = [...document.querySelectorAll(".blocks-overview-surface")];
          const introduction = document
            .querySelector(".blocks-category-header")!
            .getBoundingClientRect();
          const grid = document.querySelector(".blocks-overview-grid")!.getBoundingClientRect();
          const preview = document.querySelector(".blocks-category-preview")!;
          const previewFrame = preview.getBoundingClientRect();
          const sidebar = document.querySelector("aside.docs-sidebar")!.getBoundingClientRect();
          const imageFrame = preview
            .querySelector(".blocks-overview-preview")!
            .getBoundingClientRect();
          return {
            pageFits: document.documentElement.scrollWidth <= innerWidth,
            badgeAboveTitle: badge.bottom <= title.top,
            headerAligned:
              Math.abs(introduction.left - grid.left) < 1 &&
              Math.abs(introduction.width - grid.width) < 1 &&
              introduction.bottom < grid.top,
            previewFits:
              innerWidth < 980
                ? previewFrame.width === 0 && sidebar.width === 0
                : Math.abs(previewFrame.left - sidebar.left) < 1 &&
                  previewFrame.right + 16 <= introduction.left &&
                  previewFrame.top >= introduction.top &&
                  previewFrame.bottom < grid.top &&
                  Math.abs(sidebar.top - grid.top) < 1 &&
                  preview.scrollWidth <= preview.clientWidth + 1 &&
                  imageFrame.left > previewFrame.left &&
                  imageFrame.right < previewFrame.right &&
                  Math.abs(imageFrame.width / imageFrame.height - 16 / 9) < 0.01,
            cardsFit: cards.every((card) => {
              const path = card.querySelector(".blocks-overview-path code")!;
              const end = path.lastElementChild!.getBoundingClientRect();
              const actions = card.querySelector(".blocks-overview-action-links")!;
              const frame = card.getBoundingClientRect();
              const links = actions.getBoundingClientRect();
              return (
                frame.width >= 294 &&
                path.scrollWidth <= path.clientWidth + 1 &&
                links.left - end.right >= 12 &&
                links.right <= frame.right &&
                Math.abs(end.top + end.height / 2 - (links.top + links.height / 2)) < 1
              );
            }),
          };
        });
        expect(layout.pageFits, `${category} page at ${width}px`).toBe(true);
        expect(layout.headerAligned, `${category} header/grid alignment at ${width}px`).toBe(true);
        expect(layout.previewFits, `${category} header preview at ${width}px`).toBe(true);
        expect(layout.cardsFit, `${category} card paths/actions at ${width}px`).toBe(true);
        if (width < 640) expect(layout.badgeAboveTitle, `${category} mobile badge`).toBe(true);
      }
    }
  });
}

test("header preview and category navigation remain usable on short desktop screens", async ({
  page,
}) => {
  for (const category of ["application-shell", "sidebar"]) {
    await page.goto(`./blocks/${category}`);
    await expect(page.locator("#pp-preloader")).toBeHidden();
    const preview = page.locator(".blocks-category-preview-link");
    const destination = await preview.getAttribute("href");
    for (const width of [980, 1280]) {
      await page.setViewportSize({ width, height: 480 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(preview).toBeVisible();
      const sidebar = page.locator("aside.docs-sidebar");
      await sidebar.scrollIntoViewIfNeeded();
      const lastCategory = sidebar.getByRole("link").last();
      await lastCategory.scrollIntoViewIfNeeded();
      await expect(lastCategory).toBeInViewport();
      await lastCategory.focus();
      await expect(lastCategory).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(preview).toHaveAttribute("href", destination!);
    }
    await page.setViewportSize({ width: 768, height: 480 });
    await expect(preview).toBeHidden();
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile block categories" })).toBeVisible();
    await page.keyboard.press("Escape");
  }
});

test("category menu stays usable in a short touch viewport", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 740, height: 360 },
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto("./blocks/sidebar");
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.tap();
    const navigation = page.getByRole("navigation", { name: "Mobile block categories" });
    const signup = navigation.getByRole("link", { name: "Signup", exact: true });
    await signup.scrollIntoViewIfNeeded();
    await expect(signup).toBeInViewport();
    expect((await signup.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press("Escape");
    await expect(navigation).toBeHidden();
    await expect(trigger).toBeFocused();
  } finally {
    await context.close();
  }
});

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
  const card = page.locator("a.blocks-overview-card").first();
  await expect(card).toHaveAccessibleName("Login 1 login-01");
  await expect(card).toHaveAttribute("href", /\/blocks\/login\/login-01$/);
  await expect(card.getByText("A simple login form.")).toBeVisible();
  await context.close();
});
