import { expect, type Locator, type Page, test } from "@playwright/test";
import { choosePreviewTheme } from "./browser-utils";

type Scheme = "light" | "dark";
const opposite = (scheme: Scheme): Scheme => (scheme === "light" ? "dark" : "light");
const schemes = ["light", "dark"] as const;
const palettes = [
  "default",
  "dusk",
  "forest",
  "monochrome",
  "okaidia",
  "tomorrow",
  "twilight",
  "solarized-light",
];

/** Sample computed colors through sRGB canvas, including CSS color-mix/oklab output. */
const readingPaint = (surface: Locator) =>
  surface.evaluate((node) => {
    const context = document.createElement("canvas").getContext("2d")!;
    const rgba = (color: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    const luminance = (channels: number[]) =>
      channels.slice(0, 3).reduce((sum, value, index) => {
        const channel = value / 255;
        return (
          sum +
          (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) *
            [0.2126, 0.7152, 0.0722][index]
        );
      }, 0);
    const style = getComputedStyle(node);
    const background = rgba(style.backgroundColor);
    const light = luminance(background);
    const colors = new Set(
      [node, ...node.querySelectorAll(".token")].map((item) => getComputedStyle(item).color),
    );
    const contrasts = [...colors].map((color) => {
      const foreground = luminance(rgba(color));
      return (Math.max(light, foreground) + 0.05) / (Math.min(light, foreground) + 0.05);
    });
    return { light, alpha: background[3], contrast: Math.min(...contrasts) };
  });

async function expectReadingMode(surface: Locator, scheme: Scheme) {
  await expect(surface).toBeVisible();
  await expect(surface).toHaveCSS("color-scheme", scheme);
  const paint = await readingPaint(surface);
  expect(paint.alpha, "The reading canvas must cover the ambient surface").toBe(255);
  if (scheme === "light") expect(paint.light).toBeGreaterThan(0.6);
  else expect(paint.light).toBeLessThan(0.15);
  expect(paint.contrast, "Source text and syntax tokens remain legible").toBeGreaterThanOrEqual(
    4.5,
  );
}

const chromePaint = (chrome: Locator) =>
  chrome.evaluate((node) => {
    const style = getComputedStyle(node);
    const bounds = node.getBoundingClientRect();
    return {
      background: style.backgroundColor,
      color: style.color,
      border: style.borderColor,
      padding: style.padding,
      width: bounds.width,
      height: bounds.height,
    };
  });

async function seedSiteMode(page: Page, scheme: Scheme) {
  await page.emulateMedia({ colorScheme: scheme });
  await page.addInitScript((value) => {
    if (window === window.top) localStorage.setItem("theme", value);
  }, scheme);
}

async function setSiteMode(page: Page, scheme: Scheme) {
  await page.evaluate((value) => {
    document.documentElement.classList.toggle("dark", value === "dark");
    document.documentElement.classList.toggle("light", value === "light");
  }, scheme);
}

async function setPreviewMode(showcase: Locator, scheme: Scheme) {
  const dark = showcase.getByRole("button", { name: "Dark preview", exact: true });
  if ((await dark.getAttribute("aria-pressed")) !== String(scheme === "dark")) await dark.click();
  await expect(dark).toHaveAttribute("aria-pressed", String(scheme === "dark"));
}

test.beforeEach(async ({ page }) => {
  await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
});

for (const site of schemes) {
  test(`all palettes and color-mode choices paint correctly without recoloring ${site} chrome`, async ({
    page,
  }) => {
    await seedSiteMode(page, site);
    await page.goto("./docs/code/installation#code-syntax-presets");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const demo = page.locator('[data-code-demo="theme"]');
    const reader = demo.locator(".kamod-code");
    const source = reader.locator('pre[data-slot="code-content"]');
    await demo.scrollIntoViewIfNeeded();
    await expect(source.locator(".token.keyword").first()).toBeVisible();
    const original = await source.textContent();
    const header = reader.locator('[data-slot="code-toolbar"]');
    const copy = header.getByRole("button", { name: "Copy code", exact: true });
    const chrome = { header: await chromePaint(header), copy: await chromePaint(copy) };
    const paletteChoice = demo.getByLabel("Syntax palette");
    const modeChoice = demo.getByLabel("Source color mode");
    await expect(paletteChoice.locator("option")).toHaveCount(8);
    await expect(modeChoice.locator("option")).toHaveCount(4);
    for (const palette of palettes) {
      await paletteChoice.selectOption(palette);
      for (const mode of ["inverse", "inherit", "light", "dark"] as const) {
        await modeChoice.selectOption(mode);
        const expected = mode === "inverse" ? opposite(site) : mode === "inherit" ? site : mode;
        await expectReadingMode(source, expected);
        expect(await source.textContent()).toBe(original);
        expect(await chromePaint(header)).toEqual(chrome.header);
        expect(await chromePaint(copy)).toEqual(chrome.copy);
      }
    }
    // The separate minimal playground exercises the public default without a file header.
    const minimal = page.locator('[data-code-demo="color-mode"]');
    await minimal.scrollIntoViewIfNeeded();
    await expect(minimal.getByLabel("Source color mode")).toHaveValue("inverse");
    await expectReadingMode(minimal.locator("pre"), opposite(site));
  });

  test(`component source and all prompt views follow their local appearance inside a ${site} page`, async ({
    page,
  }) => {
    await seedSiteMode(page, site);
    await page.goto("./docs/collapsible/installation#component-preview");
    const showcase = page.locator("#collapsible-example-1-showcase");
    await showcase.scrollIntoViewIfNeeded();
    await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    const source = showcase.locator(".component-example-source pre");
    await expect(source).toBeVisible();
    const header = showcase.locator(".component-example-source .docs-code-toolbar");
    const ambientHeader = await chromePaint(header);
    for (const local of [opposite(site), site]) {
      await setPreviewMode(showcase, local);
      await expectReadingMode(source, opposite(local));
      expect(await chromePaint(header)).toEqual(ambientHeader);
    }

    await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
    const prompt = showcase.locator(".blocks-prompt-document");
    const options = showcase.getByRole("group", { name: "Prompt Display" });
    for (const format of ["Code (Markdown)", "Plain Text", "Markdown"]) {
      await options.getByRole("button", { name: format, exact: true }).click();
      if (format === "Markdown")
        await expect(prompt.locator(".blocks-prompt-rendered")).toBeVisible();
      const content = prompt.locator(".kamod-code-source").first();
      await expect(content).toBeVisible();
      const metadata = prompt.locator(":scope > .docs-code-toolbar");
      const footer = showcase.locator(".blocks-prompt-footer");
      const ambient = { metadata: await chromePaint(metadata), footer: await chromePaint(footer) };
      const text = await content.textContent();
      for (const local of [opposite(site), site]) {
        await setPreviewMode(showcase, local);
        await expectReadingMode(content, opposite(local));
        expect(await content.textContent()).toBe(text);
        expect(await chromePaint(metadata)).toEqual(ambient.metadata);
        expect(await chromePaint(footer)).toEqual(ambient.footer);
      }
    }
    if (site === "dark") await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    else await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });
}

test("portable Markdown and static fences share one inverse canvas while nested metadata stays ambient", async ({
  page,
}) => {
  await seedSiteMode(page, "light");
  await page.goto("./docs/hooks-package/installation#portable-reference");
  const reference = page.locator(".package-guide-reference");
  await reference.getByRole("tab", { name: "Markdown", exact: true }).click();
  const reader = reference.locator(".package-guide-reference-code");
  const document = reader.locator(':scope > [data-slot="code-document"]');
  await expect(document.locator(".blocks-prompt-rendered")).toBeVisible();
  const fence = document.locator("pre.kamod-code-source").first();
  const nestedHeader = document.locator(".docs-code-toolbar").first();
  const header = reader.locator(":scope > .docs-code-toolbar");
  for (const scheme of schemes) {
    await setSiteMode(page, scheme);
    await expectReadingMode(document, opposite(scheme));
    await expectReadingMode(fence, opposite(scheme));
    // Bare Markdown fences follow an explicit document mode instead of inverting twice.
    for (const mode of ["inherit", "light", "dark", "inverse"] as const) {
      await document.evaluate((node, value) => node.setAttribute("data-color-mode", value), mode);
      const expected = mode === "inverse" ? opposite(scheme) : mode === "inherit" ? scheme : mode;
      await expectReadingMode(document, expected);
      await expectReadingMode(fence, expected);
    }
    await expect(nestedHeader).toHaveCSS("color-scheme", scheme);
    const ambient = await chromePaint(header);
    const nested = await chromePaint(nestedHeader);
    expect(nested.color).toBe(ambient.color);
    expect(nested.background).toBe(ambient.background);
    const body = await document.boundingBox();
    const frame = await reference.locator(".package-reference-workspace").boundingBox();
    expect(body!.height).toBeLessThanOrEqual(448);
    expect(frame!.height).toBeLessThan(600);
  }
});

test("every grammar, plain text and unavailable grammar retain the inverse reading canvas", async ({
  page,
}) => {
  await seedSiteMode(page, "light");
  await page.goto("./docs/code/installation#code-language-switcher");
  const demo = page.locator('[data-code-demo="language"]');
  await demo.scrollIntoViewIfNeeded();
  const choice = demo.getByLabel("Highlighting language");
  const source = demo.locator("pre");
  await expect(source.locator(".token.keyword").first()).toBeVisible();
  const original = await source.textContent();
  const languages = await choice
    .locator('option:not([value="auto"])')
    .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
  // Simulate a consumer supplying a label outside the supported grammar catalog.
  await choice.evaluate((select: HTMLSelectElement) => {
    select.add(new Option("Unavailable grammar", "unavailable-grammar"));
  });
  for (const scheme of schemes) {
    await setSiteMode(page, scheme);
    for (const language of [...languages, "unavailable-grammar"]) {
      await choice.selectOption(language);
      await expectReadingMode(source, opposite(scheme));
      expect(await source.textContent()).toBe(original);
      if (language === "text" || language === "unavailable-grammar") {
        await expect(source).toHaveAttribute("data-language", "text");
        await expect(source.locator(".token")).toHaveCount(0);
      }
    }
  }
});

test("source-link dashes use the local preset's opposite primary without changing syntax ink", async ({
  page,
}) => {
  await seedSiteMode(page, "light");
  await page.goto("./docs/collapsible/installation#component-preview");
  const showcase = page.locator("#collapsible-example-1-showcase");
  await showcase.getByRole("tab", { name: "Code", exact: true }).click();
  const link = showcase
    .locator(".component-example-source pre code")
    .getByRole("link", { name: "Collapsible", exact: true })
    .last();
  await expect(link).toBeVisible();
  const appearance = (preset: string, sourceScheme: Scheme) =>
    link.evaluate(
      (node, { preset, sourceScheme }) => {
        const context = document.createElement("canvas").getContext("2d")!;
        const rgba = (color: string) => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          return [...context.getImageData(0, 0, 1, 1).data];
        };
        // Read the real theme tokens independently of the Code primary-pair implementation.
        const probe = document.createElement("span");
        probe.hidden = true;
        probe.style.color = "var(--primary)";
        document.body.append(probe);
        const ambient = rgba(getComputedStyle(probe).color);
        probe.dataset.themeScope = "";
        probe.dataset.theme = preset;
        probe.className = sourceScheme;
        const primary = rgba(getComputedStyle(probe).color);
        // Sample the translucent reference separately: 8-bit alpha readback can round RGB.
        probe.style.color = "color-mix(in oklab, var(--primary) 25%, transparent)";
        const faintPrimary = rgba(getComputedStyle(probe).color);
        probe.remove();
        const style = getComputedStyle(node);
        return {
          ambient,
          primary,
          faintPrimary,
          dash: rgba(style.borderBottomColor),
          style: style.borderBottomStyle,
          decoration: style.textDecorationLine,
          before: getComputedStyle(node, "::before").content,
          after: getComputedStyle(node, "::after").content,
          ink: [node, ...node.querySelectorAll("*")].map((item) => getComputedStyle(item).color),
        };
      },
      { preset, sourceScheme },
    );
  for (const site of schemes) {
    await setSiteMode(page, site);
    for (const preset of ["kamod", "ocean"]) {
      // Keep the surrounding preset different so accidental ambient inheritance is detectable.
      await page
        .locator("html")
        .evaluate(
          (node, value) => (node.dataset.theme = value),
          preset === "kamod" ? "ocean" : "kamod",
        );
      await choosePreviewTheme(
        showcase.getByRole("button", { name: "Preview color theme" }),
        preset,
      );
      for (const local of schemes) {
        await setPreviewMode(showcase, local);
        const sourceScheme = opposite(local);
        await expect(showcase.locator(".component-example-source pre")).toHaveCSS(
          "color-scheme",
          sourceScheme,
        );
        await page.mouse.move(1, 1);
        // Alpha can finish before the RGB transition; wait for the complete destination paint.
        const paintDifference = async (target: "primary" | "faintPrimary") => {
          const paint = await appearance(preset, sourceScheme);
          return Math.max(
            ...paint.dash.map((value, channel) => Math.abs(value - paint[target][channel])),
          );
        };
        await expect.poll(() => paintDifference("faintPrimary")).toBeLessThanOrEqual(1);
        const resting = await appearance(preset, sourceScheme);
        expect(resting.dash[3]).toBe(64);
        expect(resting.style).toBe("dashed");
        expect(resting.decoration).toBe("none");
        expect(resting.before).toBe("none");
        expect(resting.after).toBe("none");
        expect(await link.locator("svg").count()).toBe(0);
        expect(resting.primary).not.toEqual(resting.ambient);
        await link.hover();
        await expect.poll(() => paintDifference("primary")).toBeLessThanOrEqual(1);
        const hovered = await appearance(preset, sourceScheme);
        expect(hovered.dash[3]).toBe(255);
        expect(hovered.ink).toEqual(resting.ink);
        expect(hovered.decoration).toBe("none");
        expect(hovered.after).toBe("none");
      }
    }
  }
});
