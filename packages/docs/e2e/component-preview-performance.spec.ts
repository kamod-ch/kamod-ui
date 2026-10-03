import { expect, test } from "@playwright/test";

const docsRoute = (route: string) => `./${route}`;

for (const slug of ["progress", "formisch"]) {
  test(`${slug} preview loads without the documentation application`, async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(docsRoute(`component-preview-frame.htm?component=${slug}&example=0`));
    await expect(page.locator("#component-preview-root")).toHaveAttribute(
      "data-preview-ready",
      "true",
    );
    await expect(page.locator(".component-example-canvas")).toBeVisible();
    await expect(page.locator("#component-preview-root")).toHaveCSS("padding", "4px");
    await expect(page.locator(".docs-topbar, .docs-sidebar")).toHaveCount(0);
    expect(
      requests.filter((url) =>
        /(?:entry-client|highlight-code|prism|\/main-[^/]+\.js|\/docs\/registry\.ts|matomo)/.test(
          url,
        ),
      ),
    ).toEqual([]);
    await expect(page.locator('[role="alert"]')).toHaveCount(0);
  });
}

test("invalid preview selection shows a readable error", async ({ page }) => {
  await page.goto(docsRoute("component-preview-frame.htm?component=progress&example=99999"));
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
});
