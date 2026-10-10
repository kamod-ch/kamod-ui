import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const variants = [
  { category: "application-shell", id: "application-shell-1" },
  ...Array.from({ length: 16 }, (_, i) => ({
    category: "sidebar",
    id: `sidebar-${String(i + 1).padStart(2, "0")}`,
  })),
  ...["login", "signup"].flatMap((category) =>
    Array.from({ length: 5 }, (_, i) => ({
      category,
      id: `${category}-${String(i + 1).padStart(2, "0")}`,
    })),
  ),
];

test("every registered variant has a complete guide with valid, unique contents destinations", async ({
  page,
}) => {
  test.setTimeout(180_000);
  page.on("pageerror", (error) => {
    throw error;
  });
  for (const { category, id } of variants) {
    await page.goto(`./blocks/${category}/${id}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const guide = page.locator(".blocks-doc-guide");
    await expect(guide).toBeVisible();
    // The preview is isolated; documentation retains its own heading hierarchy.
    await expect(page.locator(".blocks-page-header h1")).toHaveCount(1);
    await expect(page.locator(".blocks-showcase > h2")).toHaveCount(1);
    const prefix = category === "application-shell" ? "application-shell" : id;
    const sections = ["installation", "usage", "props", "about", "reference"];
    if (category !== "application-shell") sections.push("behavior", "source");
    for (const section of sections) {
      await expect(guide.locator(`h2#${prefix}-${section}`)).toHaveCount(1);
    }
    if (category === "login" || category === "signup") {
      for (const section of ["render", "connect-app", "verify-flow"]) {
        await expect(guide.locator(`h3#${id}-${section}`)).toHaveCount(1);
      }
    }
    // Source-file permalinks resolve through the showcase's Code anchor.
    expect(
      await guide.locator('a[href^="#"]').evaluateAll((links) =>
        links.every((link) => {
          const hash = (link as HTMLAnchorElement).hash.slice(1);
          const target = hash.includes("-code/") ? hash.split("/")[0] : hash;
          return target === "top" || !!document.getElementById(target);
        }),
      ),
      id,
    ).toBe(true);
    expect(
      await guide.locator('.blocks-doc-toc a[href^="#"]').evaluateAll((links) =>
        links.every((link) => {
          const hash = (link as HTMLAnchorElement).hash;
          return hash === "#top" || !!document.getElementById(hash.slice(1));
        }),
      ),
      id,
    ).toBe(true);
    expect(
      await guide.evaluate((node) => {
        const ids = [...node.querySelectorAll("[id]")].map((element) => element.id);
        return ids.length === new Set(ids).size;
      }),
      id,
    ).toBe(true);
    await expect(guide.getByRole("tab", { name: "pnpm", exact: true })).toHaveCount(1);
    await expect(guide.locator(`#${prefix}-accessibility`)).toHaveCount(1);
  }
});

for (const theme of ["light", "dark"]) {
  for (const { category, id } of [
    { category: "sidebar", id: "sidebar-13" },
    { category: "login", id: "login-05" },
    { category: "signup", id: "signup-04" },
  ]) {
    test(`${id} guide adapts its navigation, steps, API and footer (${theme})`, async ({
      page,
    }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.goto(`./blocks/${category}/${id}`);
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(() => document.fonts.ready);
      for (const width of [320, 640, 768, 979, 980, 1024, 1260, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        const toc = page.locator(".blocks-doc-toc");
        if (width < 1200) await expect(toc).toBeHidden();
        else await expect(toc).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${id}: ${width}px`,
        ).toBe(true);
        expect(
          await page.locator(".blocks-detail-documentation").evaluate((container) => {
            const rect = container.getBoundingClientRect();
            return [
              ...container.querySelectorAll(
                ".blocks-doc-section-header, .blocks-api-type, .blocks-doc-footer",
              ),
            ].every((element) => {
              const bounds = element.getBoundingClientRect();
              return bounds.left >= rect.left - 1 && bounds.right <= rect.right + 1;
            });
          }),
          `${id}: content stays within guide at ${width}px`,
        ).toBe(true);
      }
      expect(
        await page.locator(".blocks-api").evaluate((section) => {
          const note = section.querySelector(".blocks-api-source-note")!.getBoundingClientRect();
          const heading = section.querySelector("h3")!.getBoundingClientRect();
          return heading.top - note.bottom;
        }),
      ).toBeGreaterThanOrEqual(24);
      expect(
        await page
          .locator(".blocks-doc-explanation > section")
          .evaluateAll((sections) =>
            sections.every((section) => parseFloat(getComputedStyle(section).marginTop) >= 24),
          ),
      ).toBe(true);
      await assertNoBlockingA11yViolations(page, `${id} guide`, { include: [".blocks-doc-guide"] });
    });
  }
}

test("guide links, source disclosures and manager tabs work with keyboard and browser history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./blocks/login/login-05");
  const toc = page.getByRole("navigation", { name: "On This Page" });
  await toc.getByRole("link", { name: "Usage", exact: true }).click();
  await expect(page).toHaveURL(/#login-05-usage$/);
  await toc.getByRole("link", { name: "Data Type Reference", exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/#login-05-usage$/);
  await expect
    .poll(() => page.locator("#login-05-usage").evaluate((el) => el.getBoundingClientRect().top))
    .toBeLessThan(200);
  await page.goto("./blocks/login/login-05#login-05-type-MagicLinkValues");
  const disclosure = page
    .locator(".blocks-api-type")
    .filter({ has: page.locator("#login-05-type-MagicLinkValues") });
  await expect(disclosure.getByRole("button", { name: /Hide MagicLinkValues/ })).toBeVisible();
  await expect(disclosure.locator("pre")).toContainText("email: string");
  await expect(disclosure.locator("pre")).not.toContainText("password");
  const trigger = disclosure.getByRole("button", { name: /Hide MagicLinkValues/ });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure.getByRole("button", { name: /Show MagicLinkValues/ })).toBeVisible();
  await disclosure.getByRole("link", { name: "Submission values", exact: true }).click();
  await expect(disclosure.getByRole("button", { name: /Hide MagicLinkValues/ })).toBeVisible();
  await expect(page.locator("#login-05-type-MagicLinkValues")).toBeFocused();
  await disclosure.getByRole("button", { name: /Hide MagicLinkValues/ }).click();
  await page.locator(".blocks-api-field-owner").filter({ hasText: "MagicLinkValues" }).click();
  await expect(disclosure.getByRole("button", { name: /Hide MagicLinkValues/ })).toBeVisible();
  await page.getByRole("tab", { name: "npm", exact: true }).click();
  await expect(
    page.locator(".blocks-doc-guide pre").filter({ hasText: "npm install" }),
  ).toBeVisible();
  await toc.getByRole("link", { name: "Overview", exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});
