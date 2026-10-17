import { expect, test } from "@playwright/test";

for (const scheme of ["light", "dark"] as const) {
  test(`component identity and root package readings survive page aliases (${scheme})`, async ({
    page,
  }) => {
    await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
    await page.goto("/docs/theming/installation#page-title");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const component = page.locator(".block-guide-description").getByRole("link", {
      name: "Theme Toggle",
      exact: true,
    });
    await expect(component).toHaveAttribute("data-code-imported", "ThemeToggle");
    // Preserve the authored link while the help card provides the precise component API.
    await expect(component).toHaveAttribute("href", "/docs/theme-toggle/installation");
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await component.scrollIntoViewIfNeeded();
      await page.keyboard.press("Tab");
      await component.focus();
      const card = page.getByRole("dialog", { name: "Theme Toggle reference", exact: true });
      await expect(card.locator('[data-reference-kind="component"]')).toBeVisible();
      await expect(card.locator(".code-reference-help-content")).toContainText("ThemeToggleProps");
      await expect(card.locator(".code-reference-help-primary-link")).toHaveAttribute(
        "href",
        "/docs/theme-toggle/installation#api-reference",
      );
      const bounds = (await card.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
      await expect(component).toBeFocused();
    }

    const stylesheet = page
      .locator('a.docs-inline-source-reference[data-code-module="@kamod-ch/ui/theme.css"]')
      .first();
    await stylesheet.scrollIntoViewIfNeeded();
    const source = "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/theme.css";
    await expect(stylesheet).toHaveAttribute("href", source);
    await page.keyboard.press("Tab");
    await stylesheet.focus();
    const card = page.getByRole("dialog", {
      name: "@kamod-ch/ui/theme.css reference",
      exact: true,
    });
    await expect(card.locator('[data-reference-kind="package"]')).toBeVisible();
    const resources = card.locator(
      ".code-reference-help-related .code-reference-help-primary-link",
    );
    await expect(resources).toHaveCount(1);
    await expect(resources.first()).toHaveAttribute("href", "https://github.com/kamod-ch/kamod-ui");
    await expect(
      card.getByRole("note", { name: "Package subpath" }).getByRole("link"),
    ).toHaveAttribute("href", source);
    await expect(
      card.locator(
        '.code-reference-help-related-link[href="/docs/theming/installation#css-setup"]',
      ),
    ).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(card.locator("a").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(stylesheet).toBeFocused();

    // Authored section links and incremental raw prose use the same categorization rules.
    await page.evaluate(() => {
      const fixture = document.createElement("p");
      fixture.id = "classification-regression";
      for (const [label, href] of [
        ["Getting Started Guide", "/docs/getting-started#set-up-your-app"],
        ["@kamod-ch/ui/theme.css", "/docs/components"],
      ]) {
        const link = document.createElement("a");
        link.href = href;
        const code = document.createElement("code");
        code.textContent = label;
        link.append(code);
        fixture.append(link, document.createTextNode(" "));
      }
      document.querySelector("main")!.prepend(fixture);
    });
    for (const [label, kind, destination] of [
      ["Getting Started Guide", "page", "/docs/getting-started#set-up-your-app"],
      ["@kamod-ch/ui/theme.css", "package", "/docs/components"],
    ]) {
      const term = page.locator("#classification-regression a").filter({ hasText: label });
      await expect(term).toHaveAttribute("data-code-module");
      await expect(term).toHaveAttribute("href", destination);
      await term.scrollIntoViewIfNeeded();
      await page.keyboard.press("Tab");
      await term.focus();
      const card = page.getByRole("dialog", { name: `${label} reference`, exact: true });
      await expect(card.locator(`[data-reference-kind="${kind}"]`)).toBeVisible();
      if (kind === "package") {
        await expect(card.locator(".code-reference-help-primary-link")).toHaveAttribute(
          "href",
          "https://github.com/kamod-ch/kamod-ui",
        );
        await expect(
          card.getByRole("note", { name: "Package subpath" }).getByRole("link"),
        ).toHaveAttribute("href", source);
        await expect(
          card.locator(
            '.code-reference-help-related-link[href="/docs/theming/installation#css-setup"]',
          ),
        ).toHaveCount(1);
      } else
        await expect(
          card.getByRole("link", { name: "Read the section", exact: true }),
        ).toHaveAttribute("href", destination);
      const bounds = (await card.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
      await page.keyboard.press("Escape");
    }
  });
}
