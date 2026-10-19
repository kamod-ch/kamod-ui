import { expect, test } from "@playwright/test";

const guides = [
  "docs/getting-started",
  "docs/ecosystem",
  "docs/theming/installation",
  "docs/code/installation",
  "blocks/getting-started",
];
const widths = [
  320, 375, 479, 480, 639, 640, 767, 768, 939, 940, 1023, 1024, 1199, 1200, 1279, 1280, 1440, 1535,
  1536, 1920,
];

for (const scheme of ["light", "dark"] as const) {
  for (const route of guides) {
    test(`${route} retains readable content and navigation across breakpoints (${scheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.addInitScript((value) => {
        localStorage.setItem("theme", value);
        localStorage.setItem("theme-preset", "ocean");
      }, scheme);
      await page.goto(`./${route}`);
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(() => document.fonts.ready);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const issues = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const scrollsHorizontally = (element: Element) => {
            for (let parent = element.parentElement; parent; parent = parent.parentElement) {
              if (
                ["auto", "scroll"].includes(getComputedStyle(parent).overflowX) &&
                parent.scrollWidth > parent.clientWidth + 1
              )
                return true;
            }
            return false;
          };
          const outside = [...document.querySelectorAll("main h1,main h2,main h3,main p")]
            .filter((element) => !element.closest("pre,[hidden],[inert]"))
            .filter((element) => {
              const box = element.getBoundingClientRect();
              return (
                box.width > 0 &&
                (box.left < -1 || box.right > viewport + 1) &&
                !scrollsHorizontally(element)
              );
            })
            .map((element) => element.textContent?.trim().slice(0, 70));
          const logo = document
            .querySelector(".docs-topbar-brand .kamod-ui-logo")!
            .getBoundingClientRect();
          const tools = document.querySelector(".docs-topbar-actions")!.getBoundingClientRect();
          if (
            logo.left < tools.right &&
            logo.right > tools.left &&
            logo.top < tools.bottom &&
            logo.bottom > tools.top
          ) {
            outside.push("Logo overlaps navigation controls");
          }
          if (document.documentElement.scrollWidth > viewport + 1) outside.push("Page overflow");
          return outside;
        });
        expect(issues, `${route} at ${width}px`).toEqual([]);
      }
      await page.setViewportSize({ width: 320, height: 568 });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "125%";
      });
      const overlap = await page
        .locator(".docs-topbar-brand .kamod-ui-logo")
        .evaluate((element) => {
          const logo = element.getBoundingClientRect();
          const tools = document.querySelector(".docs-topbar-actions")!.getBoundingClientRect();
          return (
            logo.left < tools.right &&
            logo.right > tools.left &&
            logo.top < tools.bottom &&
            logo.bottom > tools.top
          );
        });
      expect(overlap).toBe(false);
      await expect
        .poll(() =>
          page
            .locator(".docs-topbar")
            .evaluate(
              (bar) =>
                parseFloat(
                  document.documentElement.style.getPropertyValue("--docs-topbar-offset"),
                ) === Math.ceil(bar.getBoundingClientRect().height),
            ),
        )
        .toBe(true);
      await expect(
        page
          .locator(".docs-topbar")
          .getByRole("button", { name: "Open navigation menu", exact: true }),
      ).toBeVisible();
      await expect(
        page
          .locator(".docs-topbar")
          .getByRole("button", { name: "Choose color mode", exact: true }),
      ).toBeVisible();
      const target = page.locator("main h2[id]").first();
      if (await target.count()) {
        await target.evaluate((element) => element.scrollIntoView());
        const bar = (await page.locator(".docs-topbar").boundingBox())!;
        const heading = (await target.boundingBox())!;
        expect(heading.y).toBeGreaterThanOrEqual(bar.y + bar.height - 1);
      }
    });
  }
}
