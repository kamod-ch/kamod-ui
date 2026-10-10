import { expect, test } from "@playwright/test";
import { blockGuides } from "../src/blocks/guides/guide-catalog";
import { guideExercises } from "../src/blocks/guides/guide-exercises";
import { linkTitle } from "../src/link-title";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

for (const guide of blockGuides) {
  test(`${guide.label}: follow-up examples support keyboard switching and copying`, async ({
    page,
    context,
  }) => {
    await page.goto(`./blocks/${guide.slug}#continue-building`);
    const section = page.getByRole("region", { name: "Continue Building", exact: true });
    await expect(
      section.getByRole("heading", { name: "Continue Building", exact: true }),
    ).toBeVisible();
    const example = guideExercises.find((item) => item.slug === guide.slug)!;
    const tab = section.getByRole("tab", { name: example.label, exact: true });
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await tab.focus();
    await page.keyboard.press("ArrowRight");
    const next = guideExercises[(guideExercises.indexOf(example) + 1) % guideExercises.length];
    await expect(section.getByRole("tab", { name: next.label, exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    const panel = section.getByRole("tabpanel");
    await expect(panel.locator("pre code")).toHaveText(next.code);
    if (test.info().project.name === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await panel.getByRole("button", { name: "Copy code", exact: true }).click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(next.code);
    }
    await expect(page.locator(".blocks-doc-footer")).toHaveCount(0);
    await expect(
      page
        .getByRole("navigation", { name: "On This Page" })
        .getByRole("link", { name: "Continue Building", exact: true }),
    ).toHaveAttribute("href", "#continue-building");
  });

  test(`${guide.label}: shared navigation, contents and copyable source`, async ({
    page,
    context,
  }) => {
    const response = await page.goto(`./blocks/${guide.slug}`);
    expect(await response!.text()).toContain(linkTitle(guide.title).replaceAll("&", "&amp;"));
    await expect(
      page.getByRole("heading", { level: 1, name: linkTitle(guide.title) }),
    ).toBeVisible();
    const header = page.locator(".block-guide-header");
    await expect(header.locator(".block-guide-description p")).toHaveCount(2);
    await expect(header.locator(".block-guide-description code").first()).toBeVisible();
    const cssGuide = header.getByRole("link", { name: "CSS Guide", exact: true });
    await expect(cssGuide).toHaveAttribute("href", /\/docs\/theming\/css-setup$/);
    await expect(cssGuide.locator("svg")).toHaveCount(2);
    await expect(header.locator(".library-directory-jump-links")).toHaveCSS(
      "border-bottom-width",
      "1px",
    );
    await expect(
      header.getByRole("navigation", { name: "Block Guides" }).getByRole("link", {
        name: linkTitle(guide.label),
        exact: true,
      }),
    ).toHaveAttribute("aria-current", "page");
    const sidebar = page.locator("aside.docs-sidebar");
    await expect(
      sidebar.locator(".site-navigation-link-overview > span:first-child svg"),
    ).toHaveCount(0);
    await expect(
      sidebar.getByRole("button", { name: /^Blocks Application Layouts/ }),
    ).toHaveAttribute("aria-expanded", "true");
    const blockGroup = sidebar
      .locator(".site-navigation-group")
      .filter({ has: page.getByRole("button", { name: /^Blocks Application Layouts/ }) });
    await expect(
      blockGroup.locator(".site-navigation-link-overview .site-navigation-special-icon"),
    ).toHaveCount(blockGuides.length + 1);
    await expect(blockGroup.locator(".site-navigation-link-overview")).toHaveText([
      "Blocks Overview",
      ...blockGuides.map(({ label }) => linkTitle(label)),
    ]);
    await expect(
      blockGroup.getByRole("link", { name: linkTitle(guide.label), exact: true }),
    ).toHaveAttribute("aria-current", "page");
    const targets = await page
      .locator('.blocks-doc-toc a[href^="#"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    for (const target of targets) await expect(page.locator(target!)).toHaveCount(1);
    await page.locator('.blocks-doc-toc a[href^="#"]').last().click();
    await expect(page.locator(targets.at(-1)!)).toBeInViewport();
    if (test.info().project.name === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      const snippet = page.locator(".docs-code-wrap").first();
      const original = await snippet.locator("pre code").textContent();
      await snippet.getByRole("button", { name: "Copy code", exact: true }).click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const panel = page.locator(".site-navigation-panel");
    const mobileBlockGroup = panel.locator(".site-navigation-group").filter({
      has: page.getByRole("button", { name: /^Blocks Application Layouts/ }),
    });
    const active = mobileBlockGroup.getByRole("link", {
      name: linkTitle(guide.label),
      exact: true,
    });
    await expect(active).toHaveAttribute("aria-current", "page");
    const next = blockGuides.find(({ slug }) => slug !== guide.slug)!;
    await mobileBlockGroup.getByRole("link", { name: linkTitle(next.label), exact: true }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: linkTitle(next.title) }),
    ).toBeVisible();
    await expect(panel).toBeHidden();
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`${guide.label}: readable at all layout breakpoints (${scheme})`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), scheme);
      await page.goto(`./blocks/${guide.slug}`);
      for (const width of [320, 768, 980, 1250, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(
          page.getByRole("heading", { level: 1, name: linkTitle(guide.title) }),
        ).toBeVisible();
        const titleWidth = await page.locator(".block-guide-header").evaluate((header) => ({
          header: header.getBoundingClientRect().width,
          title: header.querySelector("h1")!.getBoundingClientRect().width,
        }));
        expect(titleWidth.title).toBeCloseTo(titleWidth.header, 0);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `overflow at ${width}px`,
        ).toBe(true);
        if (width < 1200) {
          await expect(page.locator(".block-guide-mobile-contents")).toHaveCount(0);
        } else {
          await expect(page.locator(".blocks-doc-toc")).toBeVisible();
          const placement = await page.evaluate(() => {
            const layout = document.querySelector(".docs-layout")!;
            return {
              edge:
                layout.getBoundingClientRect().right -
                parseFloat(getComputedStyle(layout).paddingRight),
              sidebar: document.querySelector(".blocks-doc-toc")!.getBoundingClientRect().right,
            };
          });
          expect(placement.sidebar).toBeCloseTo(placement.edge, 0);
        }
      }
      await assertNoBlockingA11yViolations(page, `${guide.label} ${scheme}`, {
        include: ".block-guide",
      });
    });
  }
}

test("guide contents track subsections, preserve history and keep heading icons in the gutter", async ({
  page,
}) => {
  await page.goto("./blocks/getting-started");
  const toc = page.getByRole("navigation", { name: "On This Page" });
  const target = toc.getByRole("link", { name: "The Import Path Cannot Be Resolved", exact: true });
  await target.focus();
  await page.keyboard.press("Enter");
  await expect(target).toHaveAttribute("aria-current", "location");
  const heading = page.locator("#the-import-path-cannot-be-resolved");
  await expect(heading).toBeInViewport();
  await expect(heading.getByRole("link")).toHaveAttribute(
    "href",
    "#the-import-path-cannot-be-resolved",
  );
  await toc.getByRole("link", { name: "Connect the Global Stylesheet", exact: true }).click();
  await page.goBack();
  await expect(target).toHaveAttribute("aria-current", "location");
  await expect(heading).toBeInViewport();
  for (const selector of [
    "#understand-what-you-are-adding",
    "#the-import-path-cannot-be-resolved",
  ]) {
    const title = page.locator(selector);
    const link = title.getByRole("link");
    await link.hover();
    const bounds = await title.evaluate((node) => {
      const heading = node.getBoundingClientRect();
      const link = node.querySelector("a")!.getBoundingClientRect();
      const icon = node.querySelector(".blocks-doc-heading-icon")!.getBoundingClientRect();
      return { headingX: heading.x, linkX: link.x, iconRight: icon.right };
    });
    expect(bounds.linkX).toBe(bounds.headingX);
    expect(bounds.iconRight).toBeLessThanOrEqual(bounds.linkX);
    await expect(title.locator(".blocks-doc-heading-icon")).toBeVisible();
  }
});
