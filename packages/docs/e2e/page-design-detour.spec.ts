import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

for (const scheme of ["light", "dark"] as const) {
  for (const width of [320, 1440]) {
    test(`page headings, reference pairs and open endings fit ${width}px (${scheme})`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 950 });
      await page.addInitScript((scheme) => {
        localStorage.setItem("theme", scheme);
        localStorage.setItem("theme-preset", "ocean");
      }, scheme);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/docs/getting-started");
      const flight = page.locator(".getting-started-flight");
      await expect(flight).toHaveAttribute("aria-hidden", "true");
      await expect(flight).toHaveCSS("animation-name", "getting-started-orbit");
      const label = page.locator(".block-guide-eyebrow-label");
      await expect(label).toHaveCSS("font-weight", "600");
      await expect(label.locator("svg")).toHaveCSS("stroke-width", "2.25px");
      const sidebarRocket = page.locator("aside.docs-sidebar .navigation-header-link > svg");
      await expect(sidebarRocket).toHaveCSS(
        "animation-name",
        width === 1440 ? "getting-started-orbit" : "none",
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(flight).toHaveCSS("animation-name", "none");
      await expect(sidebarRocket).toHaveCSS("animation-name", "none");
      await page.goto("/docs/accordion/installation#component-references");
      const pair = page.locator(".component-reference-pair").first();
      await pair.locator("h3").scrollIntoViewIfNeeded();
      expect((await pair.locator(".component-reference-bridge").boundingBox())!.x).toBeCloseTo(
        (await pair.boundingBox())!.x,
        1,
      );
      await expect(pair.locator(".component-reference-panel h3")).toHaveCount(0);
      await expect(pair.locator(".component-reference-category")).toContainText("·");
      const ending = page.locator(".getting-started-reference");
      await ending.getByRole("heading", { level: 2 }).scrollIntoViewIfNeeded();
      await expect(ending.getByRole("heading", { level: 2 })).toBeInViewport();
      await expect(ending.getByRole("heading", { level: 3 })).toHaveCount(3);
      await expect(ending.locator("a")).not.toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.goto("/docs/ecosystem#your-next-step");
      const next = page.locator(".ecosystem-next");
      await expect(next.locator(".ecosystem-next-path")).toHaveCount(3);
      await expect(next.locator(".ecosystem-next-path a.docs-icon-button")).toHaveCount(3);
      await expect(next).not.toContainText("One button, one hook");
      for (const link of await next.locator(".ecosystem-next-footer a").all())
        await expect(link).toHaveCSS("text-decoration-line", "underline");
      await expect(page.locator(".ecosystem-source-header-actions a")).toHaveCount(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(errors).toEqual([]);
    });
  }
}

test("CSS imports fold while wrapping and Copy preserve complete source", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("/docs/code/installation#code-folding-rules");
  const snippet = page.locator(".kamod-code").filter({ hasText: "src/styles/theme.css" });
  const source = snippet.locator("pre code");
  await source.scrollIntoViewIfNeeded();
  await expect(source.locator(".token").first()).toBeAttached();
  const original = (await source.textContent())!;
  expect(original).toContain('@import "tailwindcss";');
  await snippet.getByRole("button", { name: "Hide imports" }).click();
  await expect(source).not.toContainText("@import");
  await expect(source).toContainText("--radius");
  await snippet.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
  await snippet.getByRole("switch", { name: "Wrap code lines" }).click();
  await expect(snippet).toHaveClass(/is-wrapped/);
  await snippet.getByRole("button", { name: "Show imports" }).click();
  expect(await source.textContent()).toBe(original);
});

test("pending syntax pulses only until the grammar settles and respects reduced motion", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested = false;
  await page.route(/\/assets\/highlight-code-[\w-]+\.js(?:\?|$)/, async (route) => {
    requested = true;
    await held;
    await route.continue();
  });
  try {
    await page.goto("/docs/getting-started", { waitUntil: "domcontentloaded" });
    const code = page.locator(".kamod-code pre code").first();
    await code.scrollIntoViewIfNeeded();
    await expect.poll(() => requested).toBe(true);
    await expect(code).toHaveCSS("animation-name", "code-grammar-pending");
    const original = await code.textContent();
    const frames = await code.evaluate((node) =>
      node
        .getAnimations()[0]
        .effect!.getKeyframes()
        .map((frame) => frame.opacity),
    );
    expect(frames).toEqual(["0.05", "0.35"]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(code).toHaveCSS("animation-name", "none");
    await expect(code).toHaveCSS("opacity", "0.35");
    release();
    await expect(code).toHaveCSS("opacity", "1");
    await expect(code.locator("..").locator("..")).not.toHaveAttribute("data-highlight-pending");
    expect(await code.textContent()).toBe(original);
  } finally {
    release();
  }
});
