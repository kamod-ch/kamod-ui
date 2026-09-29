import { expect, test } from "@playwright/test";

const variants = [
  { category: "application-shell", id: "application-shell-1" },
  ...Array.from({ length: 16 }, (_, index) => ({
    category: "sidebar",
    id: `sidebar-${String(index + 1).padStart(2, "0")}`,
  })),
  ...["login", "signup"].flatMap((category) =>
    Array.from({ length: 5 }, (_, index) => ({
      category,
      id: `${category}-${String(index + 1).padStart(2, "0")}`,
    })),
  ),
];

// Exercise both sides of every docs/preview layout breakpoint, plus narrow and wide screens.
const widths = [
  320, 375, 639, 640, 767, 768, 979, 980, 1023, 1024, 1259, 1260, 1439, 1440, 1679, 1680, 1920,
  2560,
];

for (const theme of ["light", "dark"]) {
  for (const { category, id } of variants) {
    test(`${id} keeps expanded documentation and showcase controls within the page (${theme})`, async ({
      page,
    }) => {
      await page.addInitScript((mode) => localStorage.setItem("theme", mode), theme);
      await page.goto(`./blocks/${category}/${id}`);
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(() => document.fonts.ready);
      // Wait for the lazy page to hydrate, then expand each disclosure as a user would.
      await page.waitForLoadState("networkidle");
      for (const trigger of await page.locator(".blocks-api-type-trigger").all()) {
        if ((await trigger.getAttribute("data-state")) === "closed") await trigger.click();
        await expect(trigger).toHaveAttribute("data-state", "open");
      }
      const inventory = page.locator(".blocks-install-files-heading");
      if (await inventory.count()) {
        if ((await inventory.getAttribute("aria-expanded")) === "false") await inventory.click();
        await expect(inventory).toHaveAttribute("aria-expanded", "true");
      }

      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const problems = await page.evaluate(() => {
          const issues: string[] = [];
          if (document.documentElement.scrollWidth > innerWidth + 1) issues.push("Page overflows");
          const toolbar = document
            .querySelector(".blocks-showcase-toolbar")!
            .getBoundingClientRect();
          const preview = document.querySelector(".blocks-preview-frame")!.getBoundingClientRect();
          if (toolbar.bottom > preview.top) issues.push("Viewport controls overlap the live demo");
          const selectors = [
            ".blocks-page-header",
            ".blocks-page-header-title-row",
            ".blocks-page-header-summary",
            ".blocks-card-header",
            ".blocks-card-actions",
            ".blocks-card-body",
            ".blocks-showcase-toolbar",
            ".blocks-doc-section-header",
            ".blocks-doc-callouts",
            ".blocks-doc-footer",
            ".blocks-api-type",
            ".blocks-api-type-heading",
            ".blocks-api-type-fields",
            ".blocks-api-source-note",
            ".blocks-api-type-trigger",
            ".docs-code-toolbar",
            ".blocks-install-files",
            ".blocks-install-actions",
            ".blocks-install-files-heading",
            ".blocks-install-inventory",
            ".blocks-doc-body .docs-code-wrap",
          ];
          for (const element of document.querySelectorAll<HTMLElement>(selectors.join(","))) {
            if (!element.getClientRects().length) continue;
            const rect = element.getBoundingClientRect();
            if (rect.left < -1 || rect.right > innerWidth + 1)
              issues.push(`${element.className}: outside viewport`);
            // Code samples and tables scroll in their own dedicated containers, never these rows/cards.
            if (element.scrollWidth > element.clientWidth + 2)
              issues.push(
                `${element.className}: contents overflow by ${element.scrollWidth - element.clientWidth}px`,
              );
          }
          const breadcrumb = document.querySelector<HTMLElement>(
            '.blocks-page-header [data-slot="breadcrumb-list"]',
          )!;
          if (breadcrumb.clientHeight > parseFloat(getComputedStyle(breadcrumb).lineHeight) + 1)
            issues.push("Breadcrumbs wrap to multiple lines");
          const toc = document.querySelector<HTMLElement>(".blocks-doc-toc")!;
          if ((getComputedStyle(toc).display !== "none") !== innerWidth >= 980)
            issues.push("Contents visibility does not match available width");
          return issues;
        });
        expect(problems, `${id}, ${theme}, ${width}px`).toEqual([]);
      }

      const showcase = page.locator("article.blocks-card");
      await showcase.getByRole("tab", { name: "Code", exact: true }).click();
      await expect(showcase.locator("pre").first()).toBeVisible();
      for (const width of [320, 640, 768, 980, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await showcase.locator(".blocks-code-layout").evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return (
              bounds.left >= 0 &&
              bounds.right <= innerWidth &&
              element.scrollWidth <= element.clientWidth + 1
            );
          }),
          `Source viewer at ${width}px`,
        ).toBe(true);
      }
    });
  }
}

for (const route of [
  "application-shell/application-shell-1",
  "sidebar/sidebar-16",
  "login/login-02",
  "signup/signup-04",
]) {
  test(`${route} keeps viewport controls separate in mobile and tablet previews`, async ({
    page,
  }) => {
    await page.goto(`./blocks/${route}`);
    const showcase = page.locator("article.blocks-card");
    for (const width of [320, 768, 980, 1440]) {
      await page.setViewportSize({ width, height: 600 });
      for (const mode of ["Mobile", "Tablet", "Desktop"]) {
        const control = showcase.getByRole("button", { name: `${mode} view`, exact: true });
        const minWidth = mode === "Desktop" ? 980 : mode === "Tablet" ? 768 : 0;
        const fits = (await showcase.evaluate((node) => node.clientWidth)) >= minWidth;
        if (!fits) {
          await expect(control).toBeDisabled();
          continue;
        }
        await expect(control).toBeEnabled();
        await control.click();
        const toolbar = await showcase.locator(".blocks-showcase-toolbar").boundingBox();
        const preview = await showcase.locator(".blocks-preview-frame").boundingBox();
        expect(toolbar!.y + toolbar!.height).toBeLessThan(preview!.y);
        expect(preview!.x).toBeGreaterThanOrEqual(0);
        expect(preview!.x + preview!.width).toBeLessThanOrEqual(width);
        await expect(showcase.locator("iframe")).toBeVisible();
      }
    }
  });
}
