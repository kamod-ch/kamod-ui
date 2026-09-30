import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const packages = ["hooks", "i18n", "icons", "signals", "state"];

for (const name of packages) {
  test(`${name}: package guide preserves content and supports nested navigation`, async ({
    page,
    context,
  }) => {
    // The unchanged package configuration is the source of truth for content retention.
    const source = readFileSync(
      new URL(`../src/docs/pages/${name}-package-doc.tsx`, import.meta.url),
      "utf8",
    );
    const textFields = [
      ...source.matchAll(
        /(?:eyebrow|headline|lead|installationText|usageText|apiReferenceText|accessibilityText|externalCtaTitle|externalCtaDescription|title|text|label|value|packagePath):\s*"([^"]*)"/g,
      ),
    ].map((match) => match[1]);
    await page.goto(`./docs/${name}-package/installation`);
    // Wait for the static-to-interactive handoff before taking a text snapshot.
    await page.waitForSelector("html.pp-ready");
    const article = page.locator("article.package-guide");
    await expect(article.locator("h1")).toBeInViewport();
    const text = (await article.innerText()).replace(/\s+/g, " ");
    for (const value of textFields) expect(text).toContain(value);
    for (const [, url] of source.matchAll(/(?:externalDocsUrl|githubUrl|npmUrl): "([^"]+)"/g)) {
      await expect(article.locator(`a[href="${url}"]`).first()).toBeVisible();
    }
    const toc = page.getByRole("navigation", { name: "On this page" });
    for (const href of await toc
      .locator("a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
      await expect(page.locator(href)).toHaveCount(1);
    }
    const child = toc.getByRole("link", { name: "Check your environment", exact: true });
    await child.focus();
    await page.keyboard.press("Enter");
    await expect(child).toHaveAttribute("aria-current", "location");
    await expect(page.locator("#check-your-environment")).toBeInViewport();
    const installation = article.locator('section[aria-labelledby="installation"]');
    await installation.getByRole("tab", { name: "npm", exact: true }).click();
    await expect(installation.getByRole("tabpanel")).toContainText("npm install");
    const usage = article.locator('section[aria-labelledby="usage"]');
    const code = await usage.locator("pre code").textContent();
    const originalImport = source.match(/import:\s*`([^`]+)`/)![1];
    const originalUsage = source.match(/usage:\s*`([^`]+)`/)![1];
    expect(code).toBe(`${originalImport}\n\n${originalUsage}`.replaceAll("\\n", "\n"));
    if (test.info().project.name === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await usage.getByRole("button", { name: "Copy code", exact: true }).click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(code);
    }
    await article.getByRole("button", { name: "View Markdown", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("Markdown for");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await assertNoBlockingA11yViolations(page, `${name} package guide`, {
      include: ".package-guide",
    });

    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => localStorage.setItem("theme", value), theme);
      await page.reload();
      for (const width of [320, 768, 980, 1260, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${name}: overflow at ${width}px`,
        ).toBe(true);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const mobile = page.locator(".block-guide-mobile-contents");
    await mobile.locator("summary").click();
    await mobile.getByRole("link", { name: "Before you ship", exact: true }).click();
    await expect(page.locator("#before-you-ship")).toBeInViewport();
    await page.goto(`./docs/${name}-package/usage`);
    await expect(page.locator("h2#usage")).toBeInViewport();
    await page.goto(`./docs/${name}-package/installation#check-your-environment`);
    await expect(page.locator("#check-your-environment")).toBeInViewport();
  });
}

test("package header and contents share the block guide layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const metrics = () =>
    page.locator(".block-guide-header").evaluate((header) => {
      const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      const title = header.querySelector("h1")!;
      const style = getComputedStyle(title);
      return {
        top: header.getBoundingClientRect().top,
        left: header.getBoundingClientRect().left,
        font: style.fontSize,
        margin: style.margin,
        contentsLeft: rect(".blocks-doc-toc").left,
      };
    });
  await page.goto("./blocks/styles");
  const reference = await metrics();
  for (const name of packages) {
    await page.goto(`./docs/${name}-package/installation`);
    expect(await metrics()).toEqual(reference);
    const heading = page.locator("h2#capabilities");
    await expect(heading.locator(".blocks-doc-heading-icon")).toHaveCSS("opacity", "0");
    await heading.getByRole("link").hover();
    await expect(heading.locator(".blocks-doc-heading-icon")).toHaveCSS("opacity", "1");
  }
});

test("package guides retain reading content and anchors without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const name of packages) {
      await page.goto(new URL(`./docs/${name}-package/installation/`, baseURL).href);
      await expect(page.locator(".package-guide h1")).toBeVisible();
      await expect(page.locator("h2#usage")).toBeVisible();
      await expect(page.locator("h3#before-you-ship")).toBeVisible();
      await expect(page.locator('.package-guide a[href="#integration"]').first()).toBeVisible();
    }
  } finally {
    await context.close();
  }
});
