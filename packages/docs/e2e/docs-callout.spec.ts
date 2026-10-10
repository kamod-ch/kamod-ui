import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const examples = [
  {
    name: "component-api",
    path: "docs/accordion/installation",
    selector: ".blocks-api-source-note",
  },
  {
    name: "package",
    path: "docs/icons-package/installation",
    selector: ".package-guide .docs-callout",
  },
  {
    name: "block-api",
    path: "blocks/application-shell/application-shell-1",
    selector: ".blocks-api-source-note",
  },
  { name: "library", path: "blocks", selector: 'nav[aria-label="Library guides"] .docs-callout' },
  { name: "exercise", path: "blocks/styles", selector: ".guide-next-exercises .docs-callout" },
  {
    name: "component",
    path: "docs/accordion/installation",
    selector: ".component-references .docs-callout",
  },
];

for (const example of examples) {
  test(`${example.name} callouts preserve content, links and layout`, async ({
    page,
  }, testInfo) => {
    await page.goto(`./${example.path}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const cards = page.locator(example.selector);
    await expect(cards.first()).toBeVisible();
    await expect(cards.first()).toHaveAttribute("role", "note");
    for (const scheme of ["light", "dark"]) {
      await page.evaluate(
        (scheme) => document.documentElement.classList.toggle("dark", scheme === "dark"),
        scheme,
      );
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await cards.first().scrollIntoViewIfNeeded();
        const bounds = await cards.evaluateAll((elements) =>
          elements.map((element) => {
            const outer = element.getBoundingClientRect();
            return {
              width: outer.width,
              fits: element.scrollWidth <= element.clientWidth + 1,
              inside: [
                ...element.querySelectorAll(
                  '[data-slot="callout-header"], [data-slot="alert-description"], [data-slot="callout-footer"]',
                ),
              ].every((child) => {
                const rect = child.getBoundingClientRect();
                return rect.left >= outer.left - 1 && rect.right <= outer.right + 1;
              }),
            };
          }),
        );
        for (const card of bounds) {
          expect(card.width).toBeLessThanOrEqual(width);
          expect(card.fits).toBe(true);
          expect(card.inside).toBe(true);
        }
        await cards.first().screenshot({ path: testInfo.outputPath(`${scheme}-${width}.png`) });
      }
    }
    for (const heading of await cards.locator("h3[id]").all()) {
      await expect(heading.getByRole("link")).toHaveAttribute(
        "href",
        `#${await heading.getAttribute("id")}`,
      );
    }
    await assertNoBlockingA11yViolations(page, `${example.name} callouts`, {
      include: example.selector,
    });
  });
}
