import { expect, test } from "@playwright/test";

// Include both sides of layout transitions, plus narrow phones and wide desktops.
const widths = [
  320, 375, 479, 480, 639, 640, 767, 768, 979, 980, 1024, 1199, 1200, 1440, 1920, 2560,
];

for (const colorScheme of ["light", "dark"] as const) {
  test(`landing content fits across breakpoints in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto("./");
    await expect(page.getByTestId("home-page")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const issues = await page.evaluate(() => {
        const problems: string[] = [];
        if (document.documentElement.scrollWidth > innerWidth) problems.push("Page overflow");
        for (const element of document.querySelectorAll<HTMLElement>(
          ".home-primary-cta, .home-entry-title, .home-token-grid code, .home-block-heading strong, .home-live-label, .home-footer nav a",
        )) {
          const box = element.getBoundingClientRect();
          if (box.left < 0 || box.right > innerWidth + 1) problems.push(element.textContent ?? "");
          const range = document.createRange();
          range.selectNodeContents(element);
          const text = range.getBoundingClientRect();
          if (text.width > box.width + 1 || text.height > box.height + 1)
            problems.push(`Clipped content: ${element.textContent}`);
        }
        return problems;
      });
      expect(issues, `Layout at ${width}px`).toEqual([]);
    }
  });
}

test("narrow layout keeps the live examples usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("./");
  await page
    .getByRole("region", { name: "Interactive workspace example" })
    .scrollIntoViewIfNeeded();
  const workspace = page.frameLocator(
    'iframe[title="Workspace preferences interactive example 1"]',
  );
  await workspace.getByLabel("Workspace name").fill("Mobile workspace");
  await workspace.getByRole("button", { name: "Save Preferences" }).click();
  await expect(workspace.getByRole("status")).toContainText("Mobile workspace");
  const shell = page.getByRole("region", { name: "Application shell playground" });
  await shell.scrollIntoViewIfNeeded();
  await expect(shell.locator(".home-block-toolbar .home-live-label")).toBeVisible();
  await expect(shell.getByRole("link", { name: "Explore This Block" })).toBeVisible();
});
