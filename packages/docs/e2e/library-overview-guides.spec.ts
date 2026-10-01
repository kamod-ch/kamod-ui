import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const pages = [
  {
    route: "forms",
    title: "Forms that guide people from input to completion",
    catalog: "Form guides",
    count: 1,
    examples: "form-examples",
    review: "form-review",
    tab: "Schema",
  },
  {
    route: "packages",
    title: "Focused packages for the rest of your Preact app",
    catalog: "All packages",
    count: 5,
    examples: "package-examples",
    review: "package-review",
    tab: "Icons",
  },
] as const;

for (const topic of pages) {
  for (const theme of ["light", "dark"] as const) {
    test(`${topic.route} overview: reading navigation, examples and responsive layout (${theme})`, async ({
      page,
      context,
    }) => {
      await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), theme);
      await page.goto(`./docs/${topic.route}`);
      await expect(page.getByRole("heading", { level: 1, name: topic.title })).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: topic.catalog, exact: true }).getByRole("link"),
      ).toHaveCount(topic.count);
      const toc = page.locator(".docs-rightbar .blocks-doc-toc");
      const targets = await toc
        .locator("a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
      for (const target of targets) await expect(page.locator(target)).toHaveCount(1);
      await toc.locator(`a[href="#${topic.examples}"]`).click();
      await expect(page.locator(`#${topic.examples}`)).toBeInViewport();
      if (topic.route === "forms") {
        const form = page.getByRole("form", { name: "Email form demo" });
        await form.getByRole("button", { name: "Check form" }).click();
        await expect(form.getByRole("status")).toHaveText("Ready to check your input.");
        await form.getByRole("textbox", { name: "Email address" }).fill("reader@example.com");
        await form.getByRole("textbox", { name: "Email address" }).press("Enter");
        await expect(form.getByRole("status")).toHaveText("The form is valid. Nothing was sent.");
        await form.getByRole("button", { name: "Reset", exact: true }).click();
        await expect(form.getByRole("textbox", { name: "Email address" })).toHaveValue("");
        await expect(form.getByRole("status")).toHaveText("Ready to check your input.");
      } else {
        const toggle = page.getByRole("button", { name: "Show package details" });
        await toggle.focus();
        await page.keyboard.press("Space");
        await expect(page.getByRole("button", { name: "Hide package details" })).toHaveAttribute(
          "aria-expanded",
          "true",
        );
        await expect(page.locator("#overview-package-details")).toBeVisible();
      }
      await page.getByRole("tab").first().focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: topic.tab, exact: true })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      if (test.info().project.name === "chromium") {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
        const panel = page.getByRole("tabpanel");
        const source = await panel.locator("pre code").textContent();
        await panel.getByRole("button", { name: "Copy code", exact: true }).click();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
      }
      for (const width of [320, 375, 768, 979, 980, 1259, 1260, 1440, 1920]) {
        await page.setViewportSize({ width, height: 950 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
      await page.setViewportSize({ width: 375, height: 812 });
      const mobile = page.locator(".block-guide-mobile-contents");
      await mobile.locator("summary").click();
      await mobile.locator(`a[href="#${topic.review}"]`).click();
      await expect(page.locator(`#${topic.review}`)).toBeInViewport();
      await assertNoBlockingA11yViolations(page, `${topic.route} overview`, {
        include: "main.docs-content",
      });
    });
  }
}

test("overview headers and sidebar widths match the Component styles guide", async ({ page }) => {
  const geometry = async () =>
    page.evaluate(() => {
      const header = document.querySelector(".block-guide-header")!;
      const h1 = getComputedStyle(header.querySelector("h1")!);
      return {
        header: header.getBoundingClientRect().width,
        font: h1.fontSize,
        line: h1.lineHeight,
        left: document.querySelector("aside.docs-sidebar")!.getBoundingClientRect().width,
        right: document.querySelector("aside.docs-rightbar")!.getBoundingClientRect().width,
      };
    });
  for (const width of [1260, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("./blocks/styles");
    const reference = await geometry();
    for (const topic of pages) {
      await page.goto(`./docs/${topic.route}`);
      expect(await geometry()).toEqual(reference);
    }
  }
});

test("Forms and Packages retain their catalog and reading content without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const topic of pages) {
      await page.goto(new URL(`./docs/${topic.route}/`, baseURL).href);
      await expect(page.getByRole("heading", { level: 1, name: topic.title })).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: topic.catalog, exact: true }).getByRole("link"),
      ).toHaveCount(topic.count);
      await expect(page.locator(`#${topic.review}`)).toBeVisible();
    }
  } finally {
    await context.close();
  }
});
