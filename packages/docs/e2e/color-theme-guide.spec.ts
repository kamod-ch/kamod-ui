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
    await expect(gallery.locator(".theme-color-core-grid > article")).toHaveCount(64);
    await expect(gallery.locator(".theme-color-all")).toHaveCount(8);
    await expect(gallery.locator(".theme-playground-scope")).toHaveCount(8);
    await expect(gallery.locator(".theme-study-type-specimen")).toHaveCount(8);
    await expect(gallery.locator(".theme-study-notes[open]")).toHaveCount(0);
    await expect(gallery.locator(".theme-study-practice")).toHaveCount(8);
    await expect(
      gallery.locator(
        '.theme-study-preview button, .theme-study-preview input, [aria-busy="true"]',
      ),
    ).toHaveCount(0);
    await expect(gallery.locator(".theme-study-recipe .kamod-code")).toHaveCount(8);
    const readStudies = () =>
      gallery.locator(".theme-study-preview").evaluateAll((samples) =>
        samples.map((sample) => ({
          background: getComputedStyle(sample).backgroundColor,
          primary: getComputedStyle(sample.querySelector(".theme-study-action")!).backgroundColor,
          foreground: getComputedStyle(sample.querySelector(".theme-study-action")!).color,
          overflow: sample.scrollWidth > sample.clientWidth,
        })),
      );
    const initial = await readStudies();
    expect(initial.every(({ overflow }) => !overflow)).toBe(true);
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
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await assertNoBlockingA11yViolations(page, `palette guide ${width}px ${scheme}`, {
        include: ".theme-studies",
        // The historic Prism specimens intentionally preserve upstream ink. Their
        // inspector exposes literal contrast; surrounding controls remain audited.
        exclude: ".prism-study-source pre",
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
      await expect(entries).toHaveCount(36);
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

test("every preset route includes its complete copyable app recipe without opening a disclosure", async ({
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
    await expect(recipe.locator("summary")).toHaveCount(0);
    const reader = recipe.locator(".kamod-code");
    await expect(reader.locator("pre code")).toContainText(`data-theme="${id}"`);
    const source = await reader.locator("pre code").textContent();
    await reader.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
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

for (const width of [320, 1440]) {
  test(`color values, complete references and detailed help work at ${width}px`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/theming/installation#color-theme-kamod-core-colors");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const study = page.locator('.theme-study[aria-labelledby="color-theme-kamod"]');
    const core = study.locator(".theme-color-core");
    const all = study.locator(".theme-color-all");
    await expect(study.locator("#color-theme-kamod-core-colors")).toBeInViewport();
    const preference = await page.evaluate(() => ({
      preset: localStorage.getItem("theme-preset"),
      scheme: localStorage.getItem("theme"),
    }));
    await core.scrollIntoViewIfNeeded();
    const first = core.locator(".theme-color-swatch").first();
    await expect(first.locator(".theme-color-swatch-value code")).toHaveText(/^#[0-9A-F]{6,8}$/);
    await core
      .getByRole("group", { name: "Kamod core palette appearance" })
      .getByRole("button", { name: "Dark", exact: true })
      .click();
    const hex = await first.locator(".theme-color-swatch-value code").textContent();
    const pixel = await first.locator(".theme-color-paint").evaluate((paint) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      context.fillStyle = getComputedStyle(paint).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      return `#${[...context.getImageData(0, 0, 1, 1).data]
        .slice(0, 3)
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("")}`.toUpperCase();
    });
    expect(hex).toBe(pixel);
    await first.locator(".theme-color-swatch-value button").click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(hex);
    await core.getByRole("combobox", { name: "Copy as" }).selectOption("variable");
    await first.locator(".theme-color-swatch-value button").click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("var(--primary)");
    const inspect = core.getByRole("button", {
      name: "Explore Kamod dark Primary color",
      exact: true,
    });
    await inspect.focus();
    await expect(
      page.getByRole("tooltip").filter({ hasText: "The strongest action" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".theme-color-tooltip")).toHaveCount(0);
    await inspect.click();
    await expect(all.getByRole("region", { name: "Kamod selected color" })).toBeFocused();
    const filter = all.getByRole("searchbox", { name: "Find a Kamod color" });
    await filter.fill("sidebar");
    await expect(all.locator("tbody > tr:not(.theme-color-inspector-row)")).toHaveCount(8);
    await all
      .getByRole("button", { name: "Inspect Kamod dark Sidebar boundary color", exact: true })
      .click();
    await all
      .getByRole("button", { name: "Copy sidebar-border CSS variable", exact: true })
      .click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("var(--sidebar-border)");
    await filter.fill("no matching color here");
    await expect(all.getByText("No matching color.", { exact: false })).toBeVisible();
    // A core swatch must reveal its inspector even after a restrictive table search.
    await inspect.click();
    await expect(filter).toHaveValue("");
    await expect(all.getByLabel("Kamod selected color")).toContainText("Primary");
    await all
      .getByRole("button", { name: "Inspect Kamod dark Boundary color", exact: true })
      .click();
    await all.getByRole("button", { name: "Copy border HEX color", exact: true }).click();
    const alphaHex = await page.evaluate(() => navigator.clipboard.readText());
    expect(alphaHex).toMatch(/^#[0-9A-F]{8}$/);
    expect(alphaHex.endsWith("FF")).toBe(false);
    await all.getByRole("button", { name: "Copy border resolved CSS", exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .not.toMatch(/^var\(/);
    expect(
      await page.evaluate(() => ({
        preset: localStorage.getItem("theme-preset"),
        scheme: localStorage.getItem("theme"),
      })),
    ).toEqual(preference);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  });

  test(`the local playground supports real states and quiet loading at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/theming/installation#color-theme-ocean-playground");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const playground = page.locator(
      '.theme-study[aria-labelledby="color-theme-ocean"] .theme-playground',
    );
    await playground.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => ({
      preset: localStorage.getItem("theme-preset"),
      scheme: localStorage.getItem("theme"),
    }));
    const originalDark = await page
      .locator("html")
      .evaluate((node) => node.classList.contains("dark"));
    const notification = playground.getByRole("switch", { name: "Notify the team", exact: true });
    await notification.click();
    await expect(notification).toHaveAttribute("data-state", "unchecked");
    // Compare stable local paint after the checked-to-unchecked transition has finished.
    await notification.evaluate((node) =>
      Promise.all(node.getAnimations().map((animation) => animation.finished.catch(() => {}))),
    );
    const localPaint = () =>
      playground.locator(".theme-playground-scope").evaluate((scope) =>
        [
          '[data-slot="input"]',
          '[data-slot="checkbox"][data-state="unchecked"] > span[aria-hidden]',
          '[data-slot="switch"]',
          '[data-slot="progress"]',
          '[data-slot="button"][data-variant="outline"]',
        ].map((selector) => {
          const style = getComputedStyle(scope.querySelector(selector)!);
          return {
            background: style.backgroundColor,
            color: style.color,
            border: style.borderColor,
            shadow: style.boxShadow,
          };
        }),
      );
    await page.locator("html").evaluate((node) => node.classList.remove("dark"));
    const localLight = await localPaint();
    await page.locator("html").evaluate((node) => node.classList.add("dark"));
    await expect.poll(localPaint).toEqual(localLight);
    await page
      .locator("html")
      .evaluate((node, dark) => node.classList.toggle("dark", dark), originalDark);
    await playground.getByRole("switch", { name: "Notify the team", exact: true }).click();
    await playground
      .getByRole("group", { name: "Workspace appearance" })
      .getByRole("button", { name: "Dark", exact: true })
      .click();
    await expect(playground.locator(".theme-playground-scope")).toHaveClass(/dark/);
    const title = playground.getByRole("textbox", { name: "Release title" });
    await title.fill("A clearer next step");
    await playground.getByRole("button", { name: "Loading", exact: true }).click();
    const skeleton = playground.locator('[data-slot="skeleton"]').first();
    await expect(skeleton).toHaveCSS("animation-name", "none");
    await playground.getByRole("switch", { name: "Animate placeholders" }).click();
    await expect(skeleton).not.toHaveCSS("animation-name", "none");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(skeleton).toHaveCSS("animation-name", "none");
    await playground.getByRole("button", { name: "Content", exact: true }).click();
    await expect(skeleton).toHaveCount(0);
    await expect(title).toHaveValue("A clearer next step");
    await playground.getByRole("button", { name: "Validation", exact: true }).click();
    await expect(playground.getByRole("alert")).toContainText("already in use");
    await title.fill("A useful release");
    await expect(playground.getByRole("alert")).toHaveCount(0);
    await playground.getByRole("checkbox", { name: /Both modes checked/ }).click();
    await playground.getByRole("switch", { name: "Notify the team", exact: true }).click();
    await playground.getByRole("button", { name: "Publish preview", exact: true }).click();
    await expect(playground.getByRole("status")).toContainText("Published quietly");
    await playground.getByRole("button", { name: "Reset experiment", exact: true }).click();
    await expect(title).toHaveValue("A better first impression");
    await expect(
      playground.getByRole("button", { name: "Publish preview", exact: true }),
    ).toBeDisabled();
    expect(
      await page.evaluate(() => ({
        preset: localStorage.getItem("theme-preset"),
        scheme: localStorage.getItem("theme"),
      })),
    ).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await assertNoBlockingA11yViolations(page, `playground ${width}px`, {
      include: '.theme-study[aria-labelledby="color-theme-ocean"] .theme-playground',
    });
  });
}

test("bright playground actions stay readable when enabled and published", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/theming/installation#color-theme-cursor-warm-playground");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const preference = await page.evaluate(() => ({
    preset: localStorage.getItem("theme-preset"),
    scheme: localStorage.getItem("theme"),
  }));
  for (const [preset, scheme] of [
    ["cursor-warm", "light"],
    ["cursor-warm", "dark"],
    ["voltage", "light"],
    ["watson", "light"],
  ] as const) {
    const selector = `.theme-study[aria-labelledby="color-theme-${preset}"] .theme-playground-scope`;
    const workspace = page.locator(selector);
    await workspace.scrollIntoViewIfNeeded();
    await workspace.getByRole("button", { name: "Reset experiment", exact: true }).click();
    await workspace
      .getByRole("group", { name: "Workspace appearance" })
      .getByRole("button", { name: scheme === "light" ? "Light" : "Dark", exact: true })
      .click();
    await workspace.getByRole("checkbox", { name: /Both modes checked/ }).check();
    const publish = workspace.getByRole("button", { name: "Publish preview", exact: true });
    await expect(publish).toBeEnabled();
    await workspace.evaluate((node) =>
      Promise.all(
        node
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
    await assertNoBlockingA11yViolations(page, `${preset} ${scheme} enabled action`, {
      include: selector,
    });
    await publish.click();
    await expect(workspace.getByRole("status")).toContainText("Published.");
    await expect(
      workspace.getByRole("button", { name: "Published locally", exact: true }),
    ).toBeDisabled();
    await workspace.evaluate((node) =>
      Promise.all(
        node
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
    await assertNoBlockingA11yViolations(page, `${preset} ${scheme} published feedback`, {
      include: selector,
    });
  }
  expect(
    await page.evaluate(() => ({
      preset: localStorage.getItem("theme-preset"),
      scheme: localStorage.getItem("theme"),
    })),
  ).toEqual(preference);
});

test("preset pills keep their own palette and respect keyboard and reduced motion", async ({
  page,
}) => {
  await page.goto("/docs/theming/installation#color-theme-presets");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const navigation = page.getByRole("navigation", { name: "Jump to a color theme" });
  const links = navigation.getByRole("link");
  await expect(links).toHaveCount(8);
  const readLocalPaint = () =>
    navigation.locator(".theme-preset-pill-paint").evaluateAll((paints) => {
      const context = document.createElement("canvas").getContext("2d")!;
      const luminance = (color: string) => {
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        const values = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
      };
      return paints.map((paint) => {
        const style = getComputedStyle(paint);
        const ink = luminance(style.color);
        const surface = luminance(style.backgroundColor);
        return {
          preset: paint.getAttribute("data-theme"),
          scheme: paint.classList.contains("dark") ? "dark" : "light",
          background: style.backgroundColor,
          color: style.color,
          font: style.fontFamily,
          contrast: (Math.max(ink, surface) + 0.05) / (Math.min(ink, surface) + 0.05),
        };
      });
    });
  const initial = await readLocalPaint();
  expect(initial.filter(({ contrast }) => contrast < 4.5)).toEqual([]);
  await expect(navigation.locator('.theme-preset-pill-light[data-theme="professional"]')).toHaveCSS(
    "font-family",
    /^Poppins,/,
  );
  await expect(navigation.locator('.theme-preset-pill-light[data-theme="shadcn"]')).toHaveCSS(
    "font-family",
    /^"Geist Variable", Geist,/,
  );
  await page.getByRole("button", { name: "Use Watson theme on this page" }).click();
  expect(await readLocalPaint()).toEqual(initial);
  for (const scheme of ["light", "dark"]) {
    await page.evaluate(
      (dark) => document.documentElement.classList.toggle("dark", dark),
      scheme === "dark",
    );
    for (const link of await links.all()) {
      const paint = link.locator(`.theme-preset-pill-${scheme}`);
      const id = await paint.getAttribute("data-theme");
      const expected = {
        background: await page
          .locator(`.theme-study-preview.${scheme}[data-theme="${id}"]`)
          .evaluate((preview) => getComputedStyle(preview).backgroundColor),
        colors: await page
          .locator(`.theme-study-signature-${scheme}[data-theme="${id}"] > i`)
          .evaluateAll((dots) => dots.map((dot) => getComputedStyle(dot).backgroundColor)),
      };
      await expect(paint).toBeVisible();
      expect(
        await paint.evaluate((node) => ({
          background: getComputedStyle(node).backgroundColor,
          colors: [...node.querySelectorAll(".theme-preset-pill-colors i")].map(
            (dot) => getComputedStyle(dot).backgroundColor,
          ),
          idleAnimations: node.getAnimations({ subtree: true }).length,
        })),
      ).toEqual({ ...expected, idleAnimations: 0 });
      await expect(link).toHaveAttribute("href", `#color-theme-${id}`);
    }
    const ocean = navigation.getByRole("link", { name: "Ocean", exact: true });
    const paint = ocean.locator(`.theme-preset-pill-${scheme}`);
    const arrow = paint.locator(".theme-preset-pill-arrow");
    await expect(arrow).toHaveCSS("opacity", "0.45");
    await ocean.hover();
    await expect(arrow).toHaveCSS("opacity", "1");
    await expect(arrow).toHaveCSS("transform", "matrix(1.12, 0, 0, 1.12, 1, -1)");
    expect(await arrow.evaluate((node) => getComputedStyle(node).color)).toBe(
      await paint
        .locator("i")
        .first()
        .evaluate((node) => getComputedStyle(node).backgroundColor),
    );
    await expect
      .poll(() => paint.evaluate((node) => node.getAnimations({ subtree: true }).length))
      .toBe(0);
    await page.mouse.move(0, 0);
    await expect(arrow).toHaveCSS("opacity", "0.45");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  const ocean = navigation.getByRole("link", { name: "Ocean", exact: true });
  await ocean.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(ocean).toBeFocused();
  await expect(ocean.locator(".theme-preset-pill-dark .theme-preset-pill-arrow")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(ocean.locator(".theme-preset-pill-dark .theme-preset-pill-arrow")).toHaveCSS(
    "transform",
    "none",
  );
  expect(await ocean.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);
  await page.keyboard.press("Enter");
  await expect(page.locator("#color-theme-ocean")).toBeInViewport();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "watson");
});
