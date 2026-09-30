import { expect, type Page, test } from "@playwright/test";
import { PLACEHOLDER_BLOCK_CATEGORIES } from "../src/blocks/block-nav-config";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const categories = [
  ["Application Shell", "application-shell", 1],
  ["Login", "login", 5],
  ["Sidebar", "sidebar", 16],
  ["Signup", "signup", 5],
] as const;

/** Protect readable introductions without tying the layout to specific spacing tokens. */
async function expectSectionIntroductionsToFit(page: Page) {
  const sections = await page
    .locator(".library-section-header, .components-guide .block-guide-section")
    .evaluateAll((headers) =>
      headers.map((header) => {
        const bounds = (selector: string) => {
          const { x, y, width, right, bottom } = header
            .querySelector(selector)!
            .getBoundingClientRect();
          return { x, y, width, right, bottom };
        };
        return {
          headerWidth: header.getBoundingClientRect().width,
          heading: bounds("h2"),
          link: bounds(".blocks-doc-heading-link"),
          icon: bounds(".blocks-doc-heading-icon"),
          meta: header.querySelector(".library-section-meta")
            ? bounds(".library-section-meta")
            : null,
          description: bounds(".library-section-description, .block-guide-prose"),
        };
      }),
    );
  expect(sections.length).toBeGreaterThan(0);
  for (const { headerWidth, heading, link, icon, meta, description } of sections) {
    expect(description.width).toBeCloseTo(headerWidth, 0);
    if (meta) expect(meta.bottom).toBeLessThanOrEqual(heading.y);
    expect(heading.bottom).toBeLessThan(description.y);
    expect(link.x).toBeCloseTo(description.x, 0);
    expect(icon.x).toBeGreaterThanOrEqual(0);
    expect(icon.right).toBeLessThanOrEqual(link.x);
  }
}

test("the Blocks directory lists published collections and links through the site hierarchy", async ({
  page,
}) => {
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("./blocks");
  await expect(
    page.getByRole("heading", {
      name: "Blocks for complete application layouts",
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
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
  const planned = page.getByRole("navigation", { name: "Planned block categories" });
  await expect(planned.getByRole("link")).toHaveCount(20);
  const placeholderPaths = PLACEHOLDER_BLOCK_CATEGORIES.map(({ key }) => `/blocks/${key}`).sort();
  expect(
    await planned
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")).sort()),
  ).toEqual(placeholderPaths);
  await expect(planned.getByRole("link").first()).toHaveAccessibleName(
    /0 variants; page not available yet/,
  );
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
      await expectSectionIntroductionsToFit(page);
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
      page.getByRole("heading", {
        name: "Blocks for complete application layouts",
        exact: true,
        level: 1,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Block categories", exact: true }).getByRole("link"),
    ).toHaveCount(4);
  } finally {
    await context.close();
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`components share the directory layout and guide links (${theme})`, async ({ page }) => {
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), theme);
    await page.goto("./docs/components");
    await expect(page.locator(".library-directory")).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "All components", exact: true })
        .getByRole("link")
        .first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Browse complete layouts", exact: true }),
    ).toHaveAttribute("href", /\/blocks$/);
    await page
      .getByRole("navigation", { name: "Directory sections" })
      .getByRole("link", { name: "Setup & theming" })
      .click();
    await expect(page).toHaveURL(/#library-guides$/);
    const guides = page.getByRole("navigation", { name: "Library guides" });
    await expect(guides).toBeInViewport();
    await expect(guides.locator(".library-guide-action")).toHaveCount(3);
    for (const heading of await page.locator(".library-directory :is(h2, h3)").all()) {
      const id = await heading.getAttribute("id");
      expect(id).toBeTruthy();
      await expect(heading.getByRole("link")).toHaveAttribute("href", `#${id}`);
    }
    for (const width of [320, 375, 480, 640, 768, 979, 980, 1260, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await expectSectionIntroductionsToFit(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      for (const link of await guides.getByRole("link").all()) {
        const bounds = (await link.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
      const cards = await guides.locator(".library-guide-card").evaluateAll((items) =>
        items.map((item) => {
          const { y, bottom, width } = item.getBoundingClientRect();
          return { y, bottom, width };
        }),
      );
      const guideWidth = (await guides.boundingBox())!.width;
      for (const [index, card] of cards.entries()) {
        expect(card.width).toBeCloseTo(guideWidth, 0);
        if (index) expect(card.y).toBeGreaterThan(cards[index - 1].bottom);
      }
    }
    await assertNoBlockingA11yViolations(page, "Components directory", {
      include: "main.docs-content",
    });
  });
}

test("component overview shares guide navigation and supports interactive examples", async ({
  page,
  context,
}) => {
  await page.goto("./blocks/styles");
  const reference = await page.locator(".block-guide-header").evaluate((header) => {
    const heading = getComputedStyle(header.querySelector("h1")!);
    return {
      fontSize: heading.fontSize,
      lineHeight: heading.lineHeight,
      width: header.getBoundingClientRect().width,
    };
  });
  await page.goto("./docs/components");
  await expect(page.locator(".block-guide-header")).toBeVisible();
  const actual = await page.locator(".block-guide-header").evaluate((header) => {
    const heading = getComputedStyle(header.querySelector("h1")!);
    return {
      fontSize: heading.fontSize,
      lineHeight: heading.lineHeight,
      width: header.getBoundingClientRect().width,
    };
  });
  expect(actual).toEqual(reference);
  const contents = page.locator(".docs-rightbar .blocks-doc-toc");
  const targets = await contents
    .locator("a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  for (const target of targets) await expect(page.locator(target)).toHaveCount(1);
  await contents.getByRole("link", { name: "Compose an interface", exact: true }).click();
  await expect(page).toHaveURL(/#compose-components$/);
  const actions = page.getByRole("tab", { name: "Actions", exact: true });
  await actions.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "State", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const toggle = page.getByRole("switch", { name: "Email notifications" });
  await expect(toggle).not.toBeChecked();
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await expect(page.getByRole("status")).toHaveText("Demo preference: on");
  const panel = page.getByRole("tabpanel");
  if (test.info().project.name === "chromium") {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const code = await panel.locator("pre code").textContent();
    await panel.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(code);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  const mobile = page.locator(".block-guide-mobile-contents");
  await mobile.locator("summary").click();
  await mobile.getByRole("link", { name: "Review before shipping", exact: true }).click();
  await expect(page.locator("#component-review")).toBeInViewport();
  await assertNoBlockingA11yViolations(page, "Components reading guide", {
    include: "main.docs-content",
  });
});
