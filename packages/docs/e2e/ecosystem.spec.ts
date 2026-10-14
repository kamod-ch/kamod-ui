import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

test("ecosystem guide has complete static content and valid internal references", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("./docs/ecosystem", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
  expect(await response!.text()).toContain('id="build-one-small-feature"');
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The Kamod Ecosystem");
  await expect(page.locator(".ecosystem-project")).toHaveCount(14);
  await expect(page.locator(".ecosystem-guide .block-guide-section")).toHaveCount(8);
  const startingPoints = page.getByRole("region", { name: "Choose a starting point", exact: true });
  const checks = page.getByRole("region", { name: "Integration checks", exact: true });
  for (const table of [startingPoints, checks]) {
    await expect(table.getByRole("columnheader")).toHaveCount(2);
    await expect(table.getByRole("rowheader")).toHaveCount(7);
  }
  await expect(startingPoints).toContainText("Your router, real destinations and account actions");
  await expect(checks).toContainText("Unused demos stay out of the route");
  const sourceCard = page.locator(".ecosystem-source");
  await expect(sourceCard).toContainText("Browse Kamod on GitHub");
  await expect(sourceCard.locator(".ecosystem-source-context")).toContainText(
    "Source, releases and conversations",
  );
  const repositories = sourceCard.getByRole("link", { name: "All Repositories", exact: true });
  await expect(repositories).toHaveAttribute(
    "href",
    "https://github.com/orgs/kamod-ch/repositories",
  );
  const followups = sourceCard.getByRole("group", { name: "UI source and issues" });
  await expect(followups.getByRole("link", { name: "Explore the UI source" })).toHaveAttribute(
    "href",
    "https://github.com/kamod-ch/kamod-ui",
  );
  await expect(followups.getByRole("link", { name: "Find or report an issue" })).toHaveAttribute(
    "href",
    "https://github.com/kamod-ch/kamod-ui/issues",
  );
  for (const link of [
    repositories,
    followups.getByRole("link").nth(0),
    followups.getByRole("link").nth(1),
  ]) {
    await expect(link.locator("svg")).toHaveCount(2);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(sourceCard.getByRole("link", { name: "UI README" })).toHaveAttribute(
    "href",
    "https://github.com/kamod-ch/kamod-ui#readme",
  );
  await expect(sourceCard.locator(".ecosystem-source-rule")).toHaveCSS("height", "1px");
  await expect(
    page.locator('aside.docs-sidebar [data-navigation-help="ecosystem"]'),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.locator("aside.docs-sidebar [data-navigation-group][data-current]"),
  ).toHaveCount(0);
  const links = await page
    .locator(
      '.ecosystem-guide a[href^="/"],.ecosystem-guide a[href^="#"],.blocks-doc-toc a[href^="#"]',
    )
    .evaluateAll((anchors) => [
      ...new Set(anchors.map((anchor) => (anchor as HTMLAnchorElement).href)),
    ]);
  const html = new Map<string, string>();
  for (const link of links) {
    const url = new URL(link);
    const fragment = decodeURIComponent(url.hash.slice(1));
    url.hash = "";
    if (!html.has(url.href)) {
      const result = await request.get(url.href);
      expect(result.ok(), url.href).toBe(true);
      html.set(url.href, await result.text());
    }
    if (fragment) expect(html.get(url.href), link).toContain(`id="${fragment}"`);
  }
  await page.locator('.blocks-doc-toc a[href="#build-one-small-feature"]').click();
  await expect(page.locator("#build-one-small-feature")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("both pinned links navigate by keyboard, close mobile navigation and share selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("./docs/components");
  const panel = page.locator(".site-navigation-panel");
  let selectedBackground: string | undefined;
  for (const [key, title] of [
    ["ecosystem", "The Kamod Ecosystem"],
    ["getting-started", "Getting Started with Kamod UI"],
  ]) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const entry = panel.locator(`[data-navigation-help="${key}"]`);
    await entry.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(panel).toBeHidden();
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(entry).toHaveAttribute("aria-current", "page");
    await expect(entry).not.toHaveAttribute("aria-expanded");
    const background = await entry.evaluate((node) => getComputedStyle(node).backgroundColor);
    if (selectedBackground) expect(background).toBe(selectedBackground);
    selectedBackground = background;
    expect(await entry.locator(".sidebar-entry-action svg").getAttribute("viewBox")).toBe(
      "0 0 24 24",
    );
    await page.keyboard.press("Escape");
  }
  await page.goto("./docs/ecosystem");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const table of await page.locator(".ecosystem-reference-table").all()) {
    expect(await table.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    expect(
      await table
        .getByRole("rowheader")
        .first()
        .evaluate((node) => {
          const wrapper = node.closest(".ecosystem-reference-table")!;
          return node.getBoundingClientRect().width >= wrapper.clientWidth - 1;
        }),
    ).toBe(true);
  }
  await assertNoBlockingA11yViolations(page, "Ecosystem guide", { include: ".ecosystem-guide" });
});
