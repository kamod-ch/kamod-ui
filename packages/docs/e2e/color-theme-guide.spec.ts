import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";
import { enableTestClipboard } from "./browser-utils";

for (const width of [320, 768, 1024, 1440]) {
  test(`color theme studies keep their palettes and fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/theming/installation#color-theme-presets");
    await page.waitForSelector("html.pp-ready");
    const gallery = page.locator(".theme-studies");
    await expect(gallery.locator(".theme-study")).toHaveCount(8);
    await expect(gallery.locator(".theme-study-preview")).toHaveCount(16);
    await expect(gallery.locator("[data-palette-sketch]")).toHaveCount(48);
    await expect(gallery.locator(".theme-study-colors > div")).toHaveCount(128);
    await expect(gallery.locator(".theme-study-type-specimen")).toHaveCount(8);
    await expect(gallery.locator(".theme-study-notes[open]")).toHaveCount(0);
    await expect(gallery.locator(".theme-study-practice")).toHaveCount(8);
    await expect(
      gallery.locator(
        '.theme-study-preview button, .theme-study-preview input, [aria-busy="true"]',
      ),
    ).toHaveCount(0);
    await expect(gallery.locator(".theme-study-recipe .kamod-code")).toHaveCount(0);
    const readStudies = () =>
      gallery.locator(".theme-study-preview").evaluateAll((samples) =>
        samples.map((sample) => ({
          background: getComputedStyle(sample).backgroundColor,
          primary: getComputedStyle(sample.querySelector(".theme-study-action")!).backgroundColor,
          foreground: getComputedStyle(sample.querySelector(".theme-study-action")!).color,
          overflow: sample.scrollWidth > sample.clientWidth,
          plainLabels: [...sample.querySelectorAll(".theme-study-colors code")].every((label) => {
            const style = getComputedStyle(label);
            return style.backgroundColor === "rgba(0, 0, 0, 0)" && style.boxShadow === "none";
          }),
          swatches: [...sample.querySelectorAll(".theme-study-colors dd")].map((swatch) => ({
            color: getComputedStyle(swatch).backgroundColor,
            height: swatch.getBoundingClientRect().height,
          })),
        })),
      );
    const initial = await readStudies();
    expect(
      initial.every(
        ({ overflow, plainLabels, swatches }) =>
          !overflow && plainLabels && swatches.every(({ height }) => height >= 48),
      ),
    ).toBe(true);
    const readWashes = () =>
      gallery
        .locator(".theme-study-wash")
        .evaluateAll((washes) => washes.map((wash) => getComputedStyle(wash).backgroundImage));
    const initialWashes = await readWashes();
    for (let i = 0; i < initial.length; i += 2)
      expect(initial[i].background).not.toBe(initial[i + 1].background);
    const useOcean = gallery.getByRole("button", { name: "Use Ocean theme on this page" });
    await useOcean.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "ocean");
    await expect(useOcean).toHaveAttribute("aria-pressed", "true");
    for (const scheme of ["light", "dark"] as const) {
      const trigger = page
        .getByRole("button", { name: "Choose color theme" })
        .filter({ visible: true });
      await trigger.click();
      const picker = page.getByRole("dialog", { name: "Find your Palette" });
      const switchMode = picker.getByRole("button", { name: `Switch to ${scheme} mode` });
      if (await switchMode.count()) await switchMode.click();
      await picker.getByRole("button", { name: "Close color theme picker" }).click();
      expect(await readStudies()).toEqual(initial);
      expect(await readWashes()).toEqual(initialWashes);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await assertNoBlockingA11yViolations(page, `palette guide ${width}px ${scheme}`, {
        include: ".theme-studies",
      });
    }
    await page.reload();
    await page.waitForSelector("html.pp-ready");
    await expect(useOcean).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveClass(/dark/);
    if (width === 1440) {
      const entries = page
        .getByRole("navigation", { name: "On This Page" })
        .getByRole("listitem")
        .filter({ has: page.getByRole("link", { name: "Color Theme Presets", exact: true }) })
        .last()
        .locator("a");
      await expect(entries).toHaveCount(10);
      for (const target of await entries.evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).hash.slice(1)),
      )) {
        await expect(page.locator(`[id="${target}"]`)).toHaveCount(1);
      }
    }
  });
}

test("the color picker opens the exact palette section instead of the repository", async ({
  page,
}) => {
  await page.goto("/docs/pagination/installation");
  await page.waitForSelector("html.pp-ready");
  await page.getByRole("button", { name: "Choose color theme" }).filter({ visible: true }).click();
  const picker = page.getByRole("dialog", { name: "Find your Palette" });
  await expect(picker.getByRole("link", { name: "Kamod UI Repository" })).toHaveCount(0);
  await picker.getByRole("link", { name: "Explore Color Themes" }).click();
  await expect(page).toHaveURL(/\/docs\/theming\/installation\/?#color-theme-presets$/);
  await expect(
    page.getByRole("heading", { name: "Color Theme Presets", exact: true }),
  ).toBeInViewport();
});

test("each applied preset keeps its design study readable in both page appearances", async ({
  page,
}) => {
  await page.goto("/docs/theming/installation#color-theme-presets");
  await page.waitForSelector("html.pp-ready");
  const studies = page.locator(".theme-study");
  for (const study of await studies.all()) {
    await study.getByRole("button", { name: /^Use .+ theme on this page$/ }).click();
    await expect(
      study.getByRole("button", { name: /^Use .+ theme on this page$/ }),
    ).toHaveAttribute("aria-pressed", "true");
    const target = await study.getAttribute("aria-labelledby");
    for (const scheme of ["light", "dark"]) {
      await page.evaluate(
        (dark) => document.documentElement.classList.toggle("dark", dark),
        scheme === "dark",
      );
      await assertNoBlockingA11yViolations(page, `${target} on ${scheme}`, {
        include: `[aria-labelledby="${target}"]`,
      });
    }
  }
});

test("every preset route opens a copyable local recipe and releases its reader", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  const ids = [
    "kamod",
    "shadcn",
    "ocean",
    "sunset",
    "cursor-warm",
    "voltage",
    "watson",
    "professional",
  ];
  for (const id of ids) {
    await page.goto(`/docs/theming/color-theme-${id}`);
    const study = page.locator(`[aria-labelledby="color-theme-${id}"]`);
    await expect(study).toBeVisible();
    await expect(page.locator(`#color-theme-${id}`)).toBeInViewport();
    const recipe = study.locator(".theme-study-recipe");
    const summary = recipe.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    const reader = recipe.locator(".kamod-code");
    await expect(reader.locator("pre code")).toContainText(`data-theme="${id}"`);
    const source = await reader.locator("pre code").textContent();
    await reader.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
    await summary.click();
    await expect(reader).toHaveCount(0);
    const file = id === "kamod" ? "tokens.css" : `brands/${id}.css`;
    await expect(study.getByRole("link", { name: "Read preset CSS" })).toHaveAttribute(
      "href",
      `https://github.com/kamod-ch/kamod-ui/blob/main/packages/themes/src/${file}`,
    );
  }
});

for (const width of [320, 1440]) {
  test(`expanded palette roles stay local and readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/docs/theming/installation#color-theme-ocean");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const study = page.locator('[aria-labelledby="color-theme-ocean"]');
    const notes = study.locator(".theme-study-notes");
    await notes.locator("summary").press("Enter");
    await expect(notes.locator(".theme-study-practice")).toBeVisible();
    for (const advice of await study.locator(".theme-study-advice").all()) {
      await advice.locator("summary").press("Enter");
      await expect(advice).toHaveAttribute("open", "");
      await expect(advice.locator("p")).toBeVisible();
    }
    for (const scheme of ["light", "dark"]) {
      const panel = study.locator(`.theme-study-preview.${scheme}`);
      await panel.locator("summary").click();
      await expect(panel.getByText("--sidebar-background", { exact: true })).toBeVisible();
      const layout = await panel.evaluate((node) => ({
        fits: node.scrollWidth <= node.clientWidth + 1,
        animated: [...node.querySelectorAll("[data-palette-sketch], [data-palette-sketch] *")].some(
          (element) => getComputedStyle(element).animationName !== "none",
        ),
      }));
      expect(layout).toEqual({ fits: true, animated: false });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await assertNoBlockingA11yViolations(page, `expanded palette roles ${width}px`, {
      include: ".theme-studies",
    });
  });
}
