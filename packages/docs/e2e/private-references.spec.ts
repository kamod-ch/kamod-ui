import { expect, test } from "@playwright/test";

for (const scheme of ["light", "dark"] as const) {
  test(`configuration, asset and consumer paths stay plain without tooltips (${scheme})`, async ({
    page,
  }) => {
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
    await page.goto("/docs/getting-started");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.evaluate(() => {
      const fixture = document.createElement("div");
      fixture.id = "plain-file-references";
      for (const label of [
        "package.json",
        "vite.config.ts",
        "app.css",
        "src/styles.css",
        "public/logo.svg",
        "@/lib/utils",
        "@/components/kamod-ui/button",
        "src/components/blocks/sidebar-05",
        "src/my app/styles.css",
      ]) {
        const row = document.createElement("p");
        const plain = document.createElement("code");
        plain.textContent = label;
        const link = document.createElement("a");
        link.href = "/docs/components";
        const linked = plain.cloneNode(true);
        link.append(linked);
        row.append(plain, document.createTextNode(" "), link);
        fixture.append(row);
      }
      const control = document.createElement("code");
      control.id = "plain-file-positive-control";
      control.textContent = "Button";
      fixture.append(control);
      document.querySelector("main")!.prepend(fixture);
    });
    const fixture = page.locator("#plain-file-references");
    const control = fixture.locator("#plain-file-positive-control");
    // Wait for the controller to process this insertion before asserting absent enhancement.
    await expect(control).toHaveAttribute("data-code-imported", "Button");
    const plain = fixture.locator("p");
    await expect(
      plain.locator(
        "[data-code-module], [data-code-reference], [data-inline-code-help], [tabindex], [role=button], .kamod-code-reference",
      ),
    ).toHaveCount(0);
    await expect(plain.locator('a[href="/docs/components"]')).toHaveCount(9);
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const code = plain.first().locator("code").first();
      await code.hover();
      expect(
        await code.evaluate((node) => getComputedStyle(node, "::before").borderBottomStyle),
      ).not.toBe("dashed");
      await expect(
        page.getByRole("dialog", { name: "package.json explained", exact: true }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("dialog", { name: "package.json reference", exact: true }),
      ).toHaveCount(0);
      // Known components continue to use their existing help surface.
      await page.keyboard.press("Tab");
      await control.focus();
      const card = page.getByRole("dialog", { name: "Button reference", exact: true });
      await expect(card.locator('[data-reference-kind="component"]')).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(card).toHaveCount(0);
    }
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`new inline families use lazy shared help and fit narrow screens (${scheme})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 780 });
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
    const requests: string[] = [];
    page.on("request", (request) => {
      if (/\/assets\/(?:command|block|technology|page)-[\w-]{8}\.js/.test(request.url()))
        requests.push(request.url());
    });
    await page.goto("/docs/getting-started");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    // A controlled raw-prose fixture exercises the same incremental controller as route insertion.
    await page.evaluate(() => {
      const fixture = document.createElement("p");
      fixture.id = "reference-families";
      for (const label of [
        "pnpm run build",
        "sidebar-05.tsx",
        "Getting Started Guide",
        "valibot",
        "/docs/components#library-items",
      ]) {
        const code = document.createElement("code");
        code.textContent = label;
        fixture.append(code, document.createTextNode(" "));
      }
      document.querySelector("main")!.prepend(fixture);
    });
    expect(requests).toHaveLength(0);
    await page.keyboard.press("Tab");
    for (const [name, kind] of [
      ["pnpm run build", "command"],
      ["sidebar-05.tsx", "block"],
      ["Getting Started Guide", "page"],
      ["valibot", "technology"],
      ["/docs/components#library-items", "page"],
    ]) {
      const term = page.locator("#reference-families code").filter({ hasText: name });
      await expect(term).toHaveAttribute("data-code-reference", new RegExp(`^${kind}:`));
      await term.focus();
      const card = page.getByRole("dialog", { name: `${name} reference`, exact: true });
      await expect(card.locator(`[data-reference-kind="${kind}"]`)).toBeVisible();
      const bounds = await card.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
      await expect(card.locator("a").first()).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(card).toHaveCount(0);
    }
    for (const family of ["command", "block", "technology", "page"])
      expect(
        requests.filter((url) => new URL(url).pathname.split("/").at(-1)!.startsWith(`${family}-`)),
      ).toHaveLength(1);
  });
}

for (const { name, pagePath, href } of [
  {
    name: "cn",
    pagePath: "/docs/cn/installation",
    href: "/docs/cn/installation#api-reference",
  },
  {
    name: "useTheme",
    pagePath: "/docs/getting-started",
    href: "/docs/theming/installation#read-and-change-appearance",
  },
]) {
  test(`${name}() keeps its call syntax, opens shared lazy help and navigates to its API`, async ({
    page,
  }) => {
    const helpRequests: string[] = [];
    page.on("request", (request) => {
      if (/\/assets\/code-reference-help-[^/]+\.js/.test(request.url()))
        helpRequests.push(request.url());
    });
    await page.goto(pagePath);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const term = page
      .locator(`a.docs-inline-source-reference[data-code-imported="${name}"]`)
      .filter({ hasText: `${name}()` })
      .first();
    await term.scrollIntoViewIfNeeded();
    await expect(term).toHaveText(`${name}()`);
    await expect(term).toHaveAttribute("href", href);
    expect(helpRequests).toHaveLength(0);
    await term.hover();
    const card = page.getByRole("dialog", { name: `${name}() reference`, exact: true });
    await expect(card.locator('[data-reference-kind="function"]')).toBeVisible();
    await expect(card.locator("a").first()).toBeVisible();
    expect(helpRequests).not.toHaveLength(0);
    await page.keyboard.press("Escape");
    await term.click();
    await expect(page).toHaveURL((url) => `${url.pathname}${url.hash}` === href);
    await expect(page.locator(href.slice(href.indexOf("#")))).toBeAttached();
  });
}

test("inline source help loads on demand and shares the snippet loading boundary", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  const requests: string[] = [];
  page.on("request", (request) => {
    if (/\/assets\/code-reference-help-[^/]+\.js/.test(request.url())) requests.push(request.url());
  });
  await page.route(/\/assets\/code-reference-help-[^/]+\.js(?:\?|$)/, async (route) => {
    await held;
    await route.continue();
  });
  try {
    await page.goto("./docs/direction/installation");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const term = page
      .locator('a.docs-inline-source-reference[data-code-imported="DirectionProvider"]')
      .first();
    await term.scrollIntoViewIfNeeded();
    expect(requests).toHaveLength(0);
    await term.hover();
    await expect(
      page.getByRole("dialog", { name: "DirectionProvider reference", exact: true }),
    ).toHaveCount(0);
    const card = page.getByRole("dialog", { name: "DirectionProvider reference", exact: true });
    await expect(card.locator('[aria-busy="true"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
    release();
    await page.waitForLoadState("networkidle");
    await expect(card).toHaveCount(0);
    await page.keyboard.press("Tab");
    await term.focus();
    await expect(card.locator('[data-reference-kind="component"]')).toBeVisible();
    await expect(
      card
        .locator(".code-reference-help-related")
        .getByRole("link", { name: "DirectionProviderProps", exact: true }),
    ).toHaveAttribute("href", /#component-type-Direction-DirectionProviderProps$/);
    const definitions = card.locator('[data-slot="type-definition-name"]');
    await expect(definitions.filter({ hasText: /^DirectionProviderProps$/ })).toHaveCount(1);
    await expect(definitions.filter({ hasText: /^DirectionValue$/ })).toHaveCount(1);
    await expect(definitions.filter({ hasText: /^DirectionProps$/ })).toHaveCount(0);
    await expect(
      card
        .locator(".code-reference-help-related")
        .getByRole("link", { name: "DirectionProps", exact: true }),
    ).toHaveAttribute("href", /#component-type-Direction-DirectionProps$/);
    await page.keyboard.press("Tab");
    await expect(card.locator("a").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(term).toBeFocused();
  } finally {
    release();
  }
});

for (const scheme of ["light", "dark"] as const) {
  test(`inline references retain code colors and use a single primary dash (${scheme})`, async ({
    page,
  }) => {
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
    await page.goto("./docs/hooks-package/installation");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const term = page
      .locator('a.docs-inline-source-reference[data-code-imported="useCounter"]')
      .first();
    const appearance = () =>
      term.evaluate((node) => {
        const css = getComputedStyle(node);
        const chip = node.querySelector("code")!;
        const code = getComputedStyle(chip);
        const cue = getComputedStyle(chip, "::before");
        const probe = document.createElement("span");
        probe.style.color = "var(--primary)";
        // A probe inside the source would correctly trigger mutation-based tooltip dismissal.
        node.parentElement!.append(probe);
        const primary = getComputedStyle(probe).color;
        probe.remove();
        return {
          color: code.color,
          line: cue.borderBottomColor,
          style: cue.borderBottomStyle,
          thickness: cue.borderBottomWidth,
          outerBorder: css.borderBottomWidth,
          decoration: css.textDecorationLine,
          codeDecoration: code.textDecorationLine,
          primary,
          emphasis: code.webkitTextStrokeWidth,
          strokeColor: code.webkitTextStrokeColor,
          width: chip.getBoundingClientRect().width,
          lift: code.top,
          fontSize: Number.parseFloat(code.fontSize),
          weight: code.fontWeight,
          arrow: getComputedStyle(chip, "::after").content,
          transition: css.transitionDuration,
          transitionProperty: css.transitionProperty,
          chipTransition: code.transitionProperty,
        };
      });
    let originalFontSize = 0;
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await term.scrollIntoViewIfNeeded();
      await page.mouse.move(1, 1);
      await expect.poll(async () => (await appearance()).line).toMatch(/\/ 0\.55\)/);
      await expect.poll(async () => (await appearance()).arrow).toBe("none");
      await expect.poll(async () => (await appearance()).emphasis).toBe("0px");
      await expect.poll(async () => (await appearance()).lift).toBe("0px");
      const before = await appearance();
      originalFontSize = before.fontSize;
      expect(before.emphasis).toBe("0px");
      expect(before.arrow).toBe("none");
      expect(before.weight).toBe("500");
      expect(before.lift).toBe("0px");
      expect(before.transition).toBe("0.36s");
      expect(before.transitionProperty).toBe("all");
      expect(before.chipTransition).toBe("none");
      await expect(term).toHaveClass(/transition-all/);
      expect(before.style).toBe("dashed");
      expect(before.thickness).toBe("1.5px");
      expect(before.outerBorder).toBe("0px");
      expect(before.decoration).toBe("none");
      expect(before.codeDecoration).toBe("none");
      expect(before.line).toMatch(/\/ 0\.55\)/);
      expect(await term.locator("svg").count()).toBe(0);
      // Computed border styles alone missed a dash hidden behind the chip's background.
      const chip = term.locator("code");
      const painted = await chip.screenshot({ animations: "disabled" });
      const hideCue = await page.addStyleTag({
        content: ".docs-inline-source-reference > code::before { visibility: hidden !important; }",
      });
      expect(await chip.screenshot({ animations: "disabled" })).not.toEqual(painted);
      await hideCue.evaluate((node) => node.remove());
      await term.hover();
      await expect.poll(async () => (await appearance()).line).toBe(before.primary);
      await expect.poll(async () => (await appearance()).emphasis).toBe("0px");
      expect((await appearance()).color).toBe(before.color);
      await expect.poll(async () => (await appearance()).weight).toBe("500");
      await expect.poll(async () => (await appearance()).fontSize).toBeCloseTo(before.fontSize, 2);
      expect((await appearance()).width).toBeLessThan(before.width * 1.04);
      expect((await appearance()).arrow).toBe("none");
      await expect.poll(async () => (await appearance()).lift).toBe("0px");
      const card = page.getByRole("dialog", { name: "useCounter reference", exact: true });
      await expect(card.locator('[data-reference-kind="function"]')).toBeVisible();
      const badge = card.locator(".code-reference-help-kind");
      for (const corner of ["top-left", "top-right", "bottom-left", "bottom-right"])
        await expect(badge).toHaveCSS(`border-${corner}-radius`, "4px");
      const bounds = await card.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
    }
    // Legacy authored code > a must paint on its outer chip, above the background too.
    await term.evaluate((node) => {
      const code = document.createElement("code");
      code.id = "legacy-code-reference";
      const link = document.createElement("a");
      link.href = "https://www.typescriptlang.org/";
      link.textContent = "TypeScript";
      code.append(link);
      node.after(code);
    });
    const legacy = page.locator("#legacy-code-reference");
    await expect(legacy.locator("a")).toHaveAttribute(
      "data-code-reference",
      "technology:typescript",
    );
    const legacyCue = () =>
      legacy.evaluate((node) => getComputedStyle(node, "::before").borderBottomColor);
    await expect.poll(legacyCue).toMatch(/\/ 0\.55\)/);
    await legacy.locator("a").focus();
    await expect.poll(legacyCue).not.toMatch(/\/ 0\.55\)/);
    await page.keyboard.press("Escape");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await term.focus();
    await expect(term.locator("code")).toHaveCSS("top", "0px");
    await expect(term).toHaveCSS("transition-duration", "0s");
    await expect(term.locator("code")).toHaveCSS("transition-duration", "0s");
    expect((await appearance()).fontSize).toBe(originalFontSize);
    expect(
      await term
        .locator("code")
        .evaluate((node) => getComputedStyle(node, "::before").transitionDuration),
    ).toBe("0s");
  });
}
