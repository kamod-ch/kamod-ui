import { expect, test } from "@playwright/test";

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
      card.getByRole("link", { name: "DirectionProviderProps", exact: true }),
    ).toHaveAttribute("href", /#component-type-Direction-DirectionProviderProps$/);
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
        node.append(probe);
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
        };
      });
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await term.scrollIntoViewIfNeeded();
      await page.mouse.move(1, 1);
      await expect.poll(async () => (await appearance()).line).toMatch(/\/ 0\.25\)/);
      const before = await appearance();
      expect(before.style).toBe("dashed");
      expect(before.thickness).toBe("1.5px");
      expect(before.outerBorder).toBe("0px");
      expect(before.decoration).toBe("none");
      expect(before.codeDecoration).toBe("none");
      expect(before.line).toMatch(/\/ 0\.25\)/);
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
      expect((await appearance()).color).toBe(before.color);
      const card = page.getByRole("dialog", { name: "useCounter reference", exact: true });
      await expect(card.locator('[data-reference-kind="function"]')).toBeVisible();
      const bounds = await card.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
    }
  });
}
