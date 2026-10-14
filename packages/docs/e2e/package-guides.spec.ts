import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

test.beforeEach(async ({ page }) => {
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
});

const packages = ["hooks", "i18n", "icons", "signals", "state"];

// Brand references display the authored “shadcn” alias as “Shadcn/ui”.
const normalizeProse = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^\s)]+\)/g, "$1")
    .replace(/\*\*|`/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/shadcn\/ui/g, "shadcn");

for (const name of packages) {
  test(`${name}: package guide preserves content and supports nested navigation`, async ({
    page,
    context,
  }) => {
    // Keep the existing descriptive content; compact resource links replace the old stat strip.
    const source = readFileSync(
      new URL(`../src/docs/pages/${name}-package-doc.tsx`, import.meta.url),
      "utf8",
    );
    const textFields = [
      ...source.matchAll(
        /(?:eyebrow|headline|lead|installationText|usageText|apiReferenceText|accessibilityText|externalCtaTitle|externalCtaDescription|title|text|packagePath):\s*("(?:\\.|[^"\\])*")/g,
      ),
    ].map((match) => JSON.parse(match[1]) as string);
    await page.goto(`./docs/${name}-package/installation`);
    // Wait for the static-to-interactive handoff before taking a text snapshot.
    await page.waitForSelector("html.pp-ready");
    const article = page.locator("article.package-guide");
    await expect(article.locator("h1")).toBeInViewport();
    // Compare authored content without layout-generated spaces in responsive paths.
    const text = normalizeProse((await article.textContent())!);
    for (const value of textFields) expect(text).toContain(normalizeProse(value));
    for (const [, url] of source.matchAll(/(?:externalDocsUrl|githubUrl|npmUrl): "([^"]+)"/g)) {
      await expect(article.locator(`a[href="${url}"]`).first()).toBeVisible();
    }
    const toc = page.getByRole("navigation", { name: "On This Page" });
    for (const href of await toc
      .locator('a[href^="#"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
      await expect(page.locator(href)).toHaveCount(1);
    }
    const child = toc.getByRole("link", { name: "Check Your Environment", exact: true });
    await child.focus();
    await page.keyboard.press("Enter");
    await expect(child).toHaveAttribute("aria-current", "location");
    await expect(page.locator("#check-your-environment")).toBeInViewport();
    const installation = article.locator('section[aria-labelledby="installation"]');
    await installation.getByRole("tab", { name: "npm", exact: true }).click();
    await expect(installation.getByRole("tabpanel")).toContainText("npm install");
    const usage = article.locator('section[aria-labelledby="usage"]');
    for (const section of [installation, usage]) {
      const introduction = section.locator(":scope > .block-guide-prose").first();
      expect(await introduction.locator(":scope > p").count()).toBeGreaterThanOrEqual(2);
      await expect(introduction.locator("strong").first()).toBeVisible();
      // Local links in the expanded guidance must reach a real section on this page.
      for (const href of await introduction
        .locator('a[href^="#"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
        await expect(article.locator(href)).toHaveCount(1);
      }
    }
    if (name === "hooks") {
      const introduction = usage.locator(":scope > .block-guide-prose").first();
      // Hook actions must remain literal calls, not links to similarly named UI components.
      await expect(introduction.locator('a[href*="/docs/toggle/"]')).toHaveCount(0);
      for (const call of ["toggle()", "inc()", "setTheme(nextTheme)"]) {
        await expect(introduction.locator("code", { hasText: call })).toHaveText(call);
      }
    }
    const code = await usage.locator("pre code").first().textContent();
    const originalImport = source.match(/import:\s*`([^`]+)`/)![1];
    const originalUsage = source.match(/usage:\s*`([^`]+)`/)![1];
    expect(code).toBe(`${originalImport}\n\n${originalUsage}`.replaceAll("\\n", "\n"));
    if (test.info().project.name === "chromium" || test.info().project.name === "chrome") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await usage.getByRole("button", { name: "Copy code", exact: true }).first().click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(code);
    }
    await expect(article.getByRole("button", { name: "View Markdown", exact: true })).toHaveCount(
      0,
    );
    const reference = article.locator(".package-guide-reference");
    const document = await reference.locator("pre code").textContent();
    expect(document).toContain("## Troubleshooting");
    expect(document).toContain(originalImport);
    for (const name of ["Code (Markdown)", "Markdown", "Plain Text"]) {
      await reference.getByRole("tab", { name, exact: true }).click();
      if (name === "Markdown") {
        await expect(
          reference.getByRole("region", { name: "Rendered Package Reference" }),
        ).toContainText("integration reference");
      } else {
        await expect(reference.locator("pre code")).toHaveText(document!);
      }
      if (test.info().project.name === "chromium" || test.info().project.name === "chrome") {
        await reference.getByRole("button", { name: /Copy code|Code copied/ }).click();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(document);
      }
    }
    const downloadEvent = page.waitForEvent("download");
    await reference.getByRole("link", { name: "Download Markdown Reference" }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe(`${name}-package-reference.md`);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(chunk);
    expect(Buffer.concat(chunks).toString("utf8")).toBe(document);
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
    await expect(page.locator(".block-guide-mobile-contents")).toHaveCount(0);
    await page.goto(`./docs/${name}-package/installation#before-you-ship`);
    await expect(page.locator("#before-you-ship")).toBeInViewport();
    await page.goto(`./docs/${name}-package/usage`);
    await expect(page.locator("h2#usage")).toBeInViewport();
    await page.goto(`./docs/${name}-package/installation#check-your-environment`);
    await expect(page.locator("#check-your-environment")).toBeInViewport();
  });
}

for (const name of packages) {
  for (const scheme of ["light", "dark"] as const) {
    test(`${name}: sources and companion packages remain readable in ${scheme} mode`, async ({
      page,
    }) => {
      const source = readFileSync(
        new URL(`../src/docs/pages/${name}-package-doc.tsx`, import.meta.url),
        "utf8",
      );
      const resourceUrls = [
        ...source.matchAll(/(?:externalDocsUrl|githubUrl|npmUrl): "([^"]+)"/g),
      ].map((match) => match[1]);
      expect(resourceUrls).toHaveLength(3);
      await page.emulateMedia({ colorScheme: scheme });
      await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
      await page.goto(`./docs/${name}-package/installation#sources-and-attribution`);
      await page.waitForSelector("html.pp-ready");
      const ending = page.locator(".package-guide-sources");
      const resources = ending.getByRole("navigation", {
        name: "Package source resources",
        exact: true,
      });
      const companions = ending.getByRole("navigation", {
        name: "Companion packages",
        exact: true,
      });
      await expect(resources.getByRole("link")).toHaveCount(3);
      for (const href of resourceUrls) {
        const resource = resources.locator(`a[href="${href}"]`);
        await expect(resource).toHaveCount(1);
        await expect(resource).toHaveAttribute("target", "_blank");
        await expect(resource).toHaveAttribute("rel", /noopener/);
      }
      await expect(companions.getByRole("link")).toHaveCount(3);
      const destinations = await companions.getByRole("link").evaluateAll((links) =>
        links.map((link) => {
          const url = new URL((link as HTMLAnchorElement).href);
          return {
            origin: url.origin,
            name: url.pathname.match(/\/docs\/([^/]+)-package\/installation\/?$/)?.[1],
          };
        }),
      );
      const origin = new URL(page.url()).origin;
      expect(new Set(destinations.map(({ name }) => name)).size).toBe(3);
      for (const destination of destinations) {
        expect(destination.origin).toBe(origin);
        expect(packages).toContain(destination.name);
        expect(destination.name).not.toBe(name);
      }
      for (const companion of await companions.getByRole("link").all()) {
        const packageName = companion.locator("code");
        await expect(packageName).toHaveCount(1);
        await expect(packageName).toHaveText(/@kamod-ch\//);
        await expect(packageName).toHaveCSS("font-family", /mono/i);
      }
      const contents = page.getByRole("navigation", { name: "On This Page" });
      for (const id of ["source-resources", "companion-packages", "keep-going"]) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
        await expect(ending.locator(`h3#${id}`)).toBeVisible();
        await expect(contents.locator(`a[href="#${id}"]`)).toHaveCount(1);
      }
      await expect(ending.locator(".package-source-finish")).toBeVisible();

      for (const width of [320, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await ending.scrollIntoViewIfNeeded();
        const layout = await ending.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const containers = [
            element,
            ...element.querySelectorAll<HTMLElement>(
              ".package-source-links, .package-companions, .package-source-finish",
            ),
          ];
          const overflowing = containers
            .filter((node) => node.scrollWidth > node.clientWidth + 1)
            .map((node) => node.className);
          const clipped: string[] = [];
          for (const link of element.querySelectorAll<HTMLAnchorElement>("a[href]")) {
            const linkBounds = link.getBoundingClientRect();
            // Inline reference glyphs can extend beyond their anchor's line box without clipping.
            // The resource and companion rows own actual boxes that must contain all their text.
            const row = link.matches(".package-source-links > a, .package-companions > a");
            const left = row ? Math.max(bounds.left, linkBounds.left) : bounds.left;
            const right = row ? Math.min(bounds.right, linkBounds.right) : bounds.right;
            const textNodes = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
            let text: Node | null;
            while ((text = textNodes.nextNode())) {
              if (!text.textContent?.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(text);
              if (
                Array.from(range.getClientRects()).some(
                  (rect) =>
                    rect.left < left - 1 ||
                    rect.right > right + 1 ||
                    (row && (rect.top < linkBounds.top - 1 || rect.bottom > linkBounds.bottom + 1)),
                )
              ) {
                clipped.push(text.textContent.trim());
              }
            }
          }
          return { overflowing, clipped };
        });
        expect(layout.overflowing, `${name}: ending overflow at ${width}px`).toEqual([]);
        expect(layout.clipped, `${name}: ending link text clipped at ${width}px`).toEqual([]);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${name}: page overflow at ${width}px`,
        ).toBe(true);
        for (const link of [
          ...(await resources.getByRole("link").all()),
          ...(await companions.getByRole("link").all()),
        ]) {
          expect(
            await link.evaluate((node) => (node as HTMLAnchorElement).tabIndex),
          ).toBeGreaterThanOrEqual(0);
          await link.focus();
          await expect(link).toBeFocused();
        }
        await assertNoBlockingA11yViolations(page, `${name} sources at ${width}px in ${scheme}`, {
          include: ".package-guide-sources",
        });
      }
    });
  }
}

test("portable reference download keeps its layout and offers keyboard-reachable guidance", async ({
  page,
}) => {
  await page.goto("./docs/hooks-package/installation#portable-reference");
  await page.waitForSelector("html.pp-ready");
  const controls = page.locator(".package-guide-reference-controls");
  const workspace = page.locator(".package-reference-workspace");
  const tabs = workspace.getByRole("tablist", { name: "Reference Display", exact: true });
  const footer = workspace.locator(".package-guide-reference-note");
  const download = controls.getByRole("link", { name: "Download Markdown Reference", exact: true });
  const help = page.getByRole("dialog", { name: "Download reference explained", exact: true });
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await download.scrollIntoViewIfNeeded();
    const before = (await download.boundingBox())!;
    const row = (await controls.boundingBox())!;
    const frame = (await workspace.boundingBox())!;
    const tabBounds = (await tabs.boundingBox())!;
    const heading = (await controls.locator(".package-reference-heading").boundingBox())!;
    const reader = (await workspace.locator("pre").boundingBox())!;
    const footerBounds = (await footer.boundingBox())!;
    expect(row.y + row.height).toBeLessThanOrEqual(frame.y + 1);
    expect(before.x).toBeGreaterThanOrEqual(row.x - 1);
    expect(before.x + before.width).toBeLessThanOrEqual(row.x + row.width + 1);
    expect(Math.abs(heading.y + heading.height / 2 - before.y - before.height / 2)).toBeLessThan(2);
    await expect(controls.locator(".package-reference-heading strong")).toHaveText("Keep It Handy");
    await expect(controls.locator(".package-reference-caption")).toHaveText(
      "Ready for your project",
    );
    expect(Math.abs(tabBounds.width - frame.width)).toBeLessThanOrEqual(2);
    expect(footerBounds.y).toBeGreaterThanOrEqual(reader.y + reader.height - 1);
    await expect(footer).toContainText(
      "Copy and download include the complete Markdown reference.",
    );
    await expect(tabs.getByRole("tab")).toHaveCount(3);
    await download.hover();
    await expect(help).toBeVisible();
    expect(await download.boundingBox()).toEqual(before);
    await expect(download).toHaveCSS("translate", "none");
    // A production CSS transform must not turn the secondary label transparent.
    await expect(download.locator(".package-reference-download-format")).not.toHaveCSS(
      "color",
      /(?:transparent|\/ 0\))/,
    );
    await expect(download.locator("svg")).toHaveCSS("stroke-width", "2px");
    await expect(help.locator(".reference-help-heading code")).toHaveText(
      "hooks-package-reference.md",
    );
    await expect(help.locator("dt")).toHaveCount(4);
    await expect(help).toContainText("Download always includes the complete reference.");
    expect(
      await help.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return (
          box.left >= 0 &&
          box.right <= innerWidth &&
          box.top >= 0 &&
          box.bottom <= innerHeight &&
          node.scrollWidth <= node.clientWidth
        );
      }),
    ).toBe(true);
    await assertNoBlockingA11yViolations(page, "portable download guidance", {
      include: "[data-application-tooltip]",
    });
    await page.keyboard.press("Escape");
    await expect(help).toHaveCount(0);
    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab");
    await download.focus();
    await expect(help).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(help.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(help).toHaveCount(0);
    await expect(download).toBeFocused();
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(0, 0);
  await download.hover();
  await expect
    .poll(() => download.evaluate((node) => node.getAnimations({ subtree: true }).length))
    .toBe(0);
});

test("portable reference tabs support keyboard selection and retain the complete document", async ({
  page,
}) => {
  await page.goto("./docs/hooks-package/installation#portable-reference");
  await page.waitForSelector("html.pp-ready");
  const reference = page.locator(".package-guide-reference");
  const tabs = reference.getByRole("tablist", { name: "Reference Display", exact: true });
  const document = await reference.locator("pre code").textContent();
  const text = tabs.getByRole("tab", { name: "Plain Text", exact: true });
  const code = tabs.getByRole("tab", { name: "Code (Markdown)", exact: true });
  const markdown = tabs.getByRole("tab", { name: "Markdown", exact: true });
  // Styled SSR can precede listener hydration; confirm the first keyboard activation is live.
  await expect(async () => {
    await text.press("ArrowRight");
    await expect(code).toBeFocused({ timeout: 1000 });
    await expect(code).toHaveAttribute("aria-selected", "true", { timeout: 1000 });
  }).toPass({ timeout: 15000 });
  await expect(reference.locator("pre")).toBeVisible();
  await expect(reference.locator("pre code")).toHaveText(document!);
  await page.keyboard.press("End");
  await expect(markdown).toBeFocused();
  await expect(markdown).toHaveAttribute("aria-selected", "true");
  await expect(reference.getByRole("region", { name: "Rendered Package Reference" })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(text).toBeFocused();
  await expect(text).toHaveAttribute("aria-selected", "true");
  await expect(reference.locator("pre")).toBeVisible();
  await expect(reference.locator("pre code")).toHaveText(document!);
  const panel = reference.getByRole("tabpanel");
  await expect(panel).toHaveAttribute("aria-labelledby", (await text.getAttribute("id"))!);
  await assertNoBlockingA11yViolations(page, "portable reference keyboard tabs", {
    include: ".package-reference-workspace",
  });
});

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
      const reference = page.locator(".package-guide-reference");
      await expect(reference.getByRole("tab", { name: "Plain Text", exact: true })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(reference.locator("pre code")).toContainText("## Troubleshooting");
      await expect(reference.locator(".showcase-loading")).toHaveCount(0);
      const ending = page.locator(".package-guide-sources");
      await expect(
        ending
          .getByRole("navigation", { name: "Companion packages", exact: true })
          .getByRole("link"),
      ).toHaveCount(3);
      await expect(
        ending
          .getByRole("navigation", { name: "Package source resources", exact: true })
          .getByRole("link"),
      ).toHaveCount(3);
      for (const id of ["source-resources", "companion-packages", "keep-going"]) {
        await expect(ending.locator(`h3#${id}`)).toHaveCount(1);
      }
    }
  } finally {
    await context.close();
  }
});

test("package resources adapt to their container and keep icon actions accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("./docs/hooks-package/installation");
  await page.waitForSelector("html.pp-ready");
  const header = page.locator(".package-guide > .block-guide-header");
  const resources = page.getByRole("navigation", { name: "Package resources", exact: true });
  const label = resources.locator(".package-guide-resource-label").first();
  await expect(label).toBeVisible();
  const code = resources.locator(".package-guide-identity code.path-display");
  expect((await code.boundingBox())!.height).toBeLessThan(28);
  const centers = await resources.evaluate((row) =>
    [...row.querySelectorAll(".package-guide-identity, .package-guide-resource-action")].map(
      (element) => {
        const rect = element.getBoundingClientRect();
        return rect.y + rect.height / 2;
      },
    ),
  );
  expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(2);

  // Keep the viewport fixed: density must follow the available container width.
  await header.evaluate((node) => {
    node.style.maxWidth = "480px";
  });
  await expect(label).toBeHidden();
  for (const name of ["Live Docs", "GitHub", "npm"]) {
    const action = resources.getByRole("link", {
      name: `${name} (opens in a new tab)`,
      exact: true,
    });
    await action.focus();
    const tooltip = page.getByRole("dialog", { name: `${name} explained` });
    await expect(tooltip).toContainText(name);
    expect(await tooltip.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await expect
      .poll(() =>
        tooltip.evaluate((node) => {
          const bounds = node.getBoundingClientRect();
          return bounds.left >= 0 && bounds.right <= innerWidth;
        }),
      )
      .toBe(true);
    await page.keyboard.press("Escape");
    await expect(tooltip).toHaveCount(0);
  }
  await header.evaluate((node) => {
    node.style.maxWidth = "";
  });
  await expect(label).toBeVisible();
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(label).toBeHidden();
  expect(await resources.evaluate((row) => row.scrollWidth <= row.clientWidth)).toBe(true);
  await assertNoBlockingA11yViolations(page, "compact package resources", {
    include: ".package-guide-resources",
  });
  await page.goto("./docs/packages");
  await expect(page.locator(".package-guide-resources")).toHaveCount(0);
});
