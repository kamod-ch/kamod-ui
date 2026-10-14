import { expect, type Locator, test } from "@playwright/test";

test("import links preserve syntax/source, follow aliases and navigate to local source references", async ({
  page,
}) => {
  await page.goto("./docs/code/installation#source-links");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const topic = page.locator('section[aria-labelledby="code-reference-navigation"]');
  const panel = topic.locator(".kamod-code").first();
  const code = panel.locator("pre code");
  await expect(code.locator(".token")).not.toHaveCount(0);
  const aliases = code.getByRole("link", { name: "SaveButton", exact: true });
  await expect(aliases).toHaveCount(3);
  await expect(aliases.first()).toHaveAttribute(
    "href",
    /\/docs\/button\/installation#api-reference$/,
  );
  const module = code.getByRole("link", { name: "@kamod-ch/ui/button", exact: true });
  await expect(module).toHaveAttribute("href", /\/docs\/button\/installation#api-reference$/);
  const link = aliases.last();
  const appearance = (target: Locator) =>
    target.evaluate((node) => {
      const css = getComputedStyle(node);
      const arrow = getComputedStyle(node, "::after");
      const probe = document.createElement("span");
      probe.style.borderBottomColor = "var(--primary, currentColor)";
      node.append(probe);
      const primary = getComputedStyle(probe).borderBottomColor;
      probe.remove();
      return {
        color: css.color,
        syntaxColor: getComputedStyle(node.parentElement!).color,
        font: css.fontSize,
        decoration: css.textDecorationLine,
        underline: css.borderBottomColor,
        primary,
        thickness: css.borderBottomWidth,
        style: css.borderBottomStyle,
        arrow: arrow.content,
        width: node.getBoundingClientRect().width,
        background: css.backgroundColor,
      };
    });
  // Direct code children and nested syntax tokens must both escape prose-chip hover rules.
  for (const target of [aliases.first(), link, module]) {
    await page.mouse.move(0, 0);
    const before = await appearance(target);
    expect(before.thickness).toBe("1.5px");
    expect(before.underline).toMatch(/\/ 0\.25\)/);
    expect(before.decoration).toBe("none");
    expect(before.color).toBe(before.syntaxColor);
    expect(before.arrow).toBe("none");
    expect(before.style).toBe("dashed");
    await target.hover();
    await expect.poll(async () => (await appearance(target)).underline).toBe(before.primary);
    const hovered = await appearance(target);
    expect(hovered.decoration).toBe("none");
    expect(hovered.color).toBe(before.color);
    expect(hovered.font).toBe(before.font);
    expect(hovered.background).toBe(before.background);
    expect(hovered.width).toBe(before.width);
    expect(hovered.arrow).toBe("none");
    expect(hovered.style).toBe("dashed");
    expect(hovered.underline).toBe(before.primary);
    expect(hovered.underline).not.toMatch(/\/ 0\.25\)/);
  }
  const text = await code.textContent();
  expect(text).toContain("import { Button as SaveButton }");
  expect(text).toContain("<SaveButton>Save your changes</SaveButton>");
  expect(text).not.toContain("↗");
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
  const focused = await appearance(link);
  expect(focused.decoration).toBe("none");
  expect(focused.color).toBe(focused.syntaxColor);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/docs\/button\/installation\/?#api-reference$/);
  await expect(page.locator("#api-reference")).toBeInViewport();
});

test("shared navigation works in landing showcase code and static Markdown fences", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const home = page.getByRole("region", { name: "Interactive workspace example" });
  await home.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(home.locator("pre code a.kamod-code-reference")).not.toHaveCount(0);
  await page.goto("./blocks/getting-started");
  const imports = page.locator("pre code").filter({ hasText: "@preact/preset-vite" }).first();
  await imports.scrollIntoViewIfNeeded();
  await expect(imports.locator("a.kamod-code-reference")).not.toHaveCount(0);
  await expect(
    imports.getByRole("link", { name: "@preact/preset-vite", exact: true }),
  ).toHaveAttribute("href", /https:\/\/github.com\//);
  // Markdown prose must not add solid underlines or recolor linked syntax tokens.
  const module = imports.getByRole("link", { name: "@preact/preset-vite", exact: true });
  for (const state of ["idle", "hover", "focus"] as const) {
    if (state === "hover") await module.hover();
    if (state === "focus") await module.focus();
    await expect(module).toHaveCSS("text-decoration-line", "none");
    const colors = await module.evaluate((node) => [
      getComputedStyle(node).color,
      getComputedStyle(node.parentElement!).color,
    ]);
    expect(colors[0]).toBe(colors[1]);
  }
});

test("reference links inside a component preview navigate the containing page", async ({
  page,
}) => {
  await page.goto("./docs/code/installation");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const example = page.locator("#imports .component-example");
  await example.scrollIntoViewIfNeeded();
  const preview = example.frameLocator("iframe");
  const component = preview
    .locator("pre code")
    .getByRole("link", { name: "Button", exact: true })
    .first();
  await expect(component).toHaveAttribute("target", "_top");
  await component.click();
  await expect(page).toHaveURL(/\/docs\/button\/installation\/?#api-reference$/);
  await expect(page.locator("#api-reference")).toBeInViewport();
});

for (const scheme of ["light", "dark"] as const) {
  test(`Collapsible source links keep dashed cues without arrows in ${scheme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("./docs/collapsible/installation#collapsible-example-1-showcase");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const example = page.locator("#collapsible-example-1-showcase");
    const tab = example.getByRole("tab", { name: "Code", exact: true });
    // The page-ready class precedes hydration of the route's lazy showcase.
    await expect(async () => {
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true", { timeout: 1000 });
    }).toPass();
    const code = example.locator("pre code");
    const references = code.locator("a.kamod-code-reference");
    await expect(references).not.toHaveCount(0);
    const original = await code.textContent();
    const verify = async () => {
      const styles = await references.evaluateAll((nodes) =>
        nodes.map((node) => {
          const css = getComputedStyle(node);
          return [
            css.borderBottomStyle,
            css.borderBottomWidth,
            getComputedStyle(node, "::after").content,
            css.textDecorationLine,
            css.color === getComputedStyle(node.parentElement!).color,
          ];
        }),
      );
      expect(styles.length).toBeGreaterThan(0);
      for (const style of styles) expect(style).toEqual(["dashed", "1.5px", "none", "none", true]);
    };
    await verify();
    const component = code.getByRole("link", { name: "Collapsible", exact: true });
    await expect(component.first()).toHaveAttribute(
      "href",
      /collapsible\/installation#api-reference$/,
    );
    await component.first().hover();
    await verify();
    await example.getByRole("button", { name: "Hide imports", exact: true }).click();
    await expect(code).not.toContainText("import {");
    await verify();
    await example.getByRole("switch", { name: "Wrap code lines" }).click();
    await verify();
    await example.getByRole("button", { name: "Show imports", exact: true }).click();
    expect(await code.textContent()).toBe(original);
    await verify();
    await page.keyboard.press("Tab");
    await component.last().focus();
    await expect(component.last()).toHaveCSS("outline-style", "solid");
    await verify();
  });
}
