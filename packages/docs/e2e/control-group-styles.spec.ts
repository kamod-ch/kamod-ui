import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1440]) {
  for (const mode of ["light", "dark"] as const) {
    test(`rounded controls stay legible and keyboard usable at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("./docs/forms", { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate((mode) => {
        document.documentElement.classList.toggle("dark", mode === "dark");
        document.documentElement.classList.toggle("light", mode === "light");
        document.documentElement.dataset.colorScheme = mode;
      }, mode);
      const list = page
        .getByRole("tablist")
        .filter({ has: page.getByRole("tab", { name: "Native", exact: true }) })
        .first();
      await list.scrollIntoViewIfNeeded();
      await expect(list).toHaveAttribute("data-variant", "default");
      const first = list.getByRole("tab", { name: "Native", exact: true });
      const second = list.getByRole("tab", { name: "Schema", exact: true });
      const styles = await first.evaluate((tab) => {
        const style = getComputedStyle(tab);
        const list = getComputedStyle(tab.parentElement!);
        return {
          radius: parseFloat(style.borderRadius),
          listRadius: parseFloat(list.borderRadius),
          border: parseFloat(list.borderWidth),
          padding: parseFloat(list.padding),
          background: list.backgroundColor,
          selection: style.backgroundColor,
          stripe: getComputedStyle(tab, "::after").content,
          dot: getComputedStyle(tab, "::before").content,
          size: parseFloat(style.fontSize),
          gap: parseFloat(list.gap),
          aligned: style.alignItems === "center" && style.justifyContent === "center",
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(styles.radius).toBe(8);
      expect(styles.listRadius).toBe(8);
      expect(styles.border).toBe(1);
      expect(styles.padding).toBe(2);
      expect(styles.background).not.toBe("rgba(0, 0, 0, 0)");
      expect(styles.selection).not.toBe("rgba(0, 0, 0, 0)");
      expect(styles.stripe).toBe("none");
      expect(styles.dot).toBe("none");
      expect(styles.size).toBe(12);
      expect(styles.gap).toBe(2);
      expect(styles.aligned).toBe(true);
      expect(styles.overflow).toBe(false);
      await second.hover();
      if (width >= 768) {
        await expect
          .poll(() => second.evaluate((tab) => getComputedStyle(tab).backgroundColor))
          .not.toBe("rgba(0, 0, 0, 0)");
      } else await expect(second).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await first.focus();
      await first.press("ArrowRight");
      await expect(second).toBeFocused();
      await expect(second).toHaveAttribute("aria-selected", "true");
      await expect(
        page.locator(`[id="${await second.getAttribute("aria-controls")}"]`),
      ).toBeVisible();
      await second.press("Home");
      await expect(first).toBeFocused();
      await page.screenshot({ path: `/tmp/rounded-controls-${mode}-${width}.png` });
    });
  }
}

test("showcases use rounded controls while the optional inset variant keeps its own styling", async ({
  page,
}) => {
  await page.goto("./docs/tabs/inset-tabs", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const frame = page.locator("section#inset-tabs iframe").first();
  await frame.scrollIntoViewIfNeeded();
  const vertical = frame
    .contentFrame()
    .getByRole("tablist", { name: "vertical workspace example", exact: true });
  await vertical.scrollIntoViewIfNeeded();
  await expect(vertical).toHaveAttribute("data-variant", "inset");
  await vertical.getByRole("tab", { name: "Overview" }).press("ArrowDown");
  await expect(vertical.getByRole("tab", { name: "Activity" })).toBeFocused();
  await expect(vertical.getByRole("tab", { name: "Activity" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  for (const list of await page
    .locator('.blocks-showcase-segmented[data-slot="tabs-list"]')
    .all()) {
    await expect(list).toHaveAttribute("data-variant", "default");
  }
  await page.goto("./", { waitUntil: "domcontentloaded" });
  const showcase = page
    .getByRole("tablist", { name: "Workspace example view", exact: true })
    .first();
  await showcase.scrollIntoViewIfNeeded();
  await expect(showcase).toHaveAttribute("data-variant", "default");
  const gap = await showcase.evaluate((list) => parseFloat(getComputedStyle(list).gap));
  expect(gap).toBe(2);
  await expect
    .poll(() =>
      showcase
        .getByRole("tab", { name: "Code", exact: true })
        .evaluate((tab) => getComputedStyle(tab, "::before").content),
    )
    .toBe("none");
  await showcase.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(showcase.getByRole("tab", { name: "Code", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".home-workspace pre").first()).toBeVisible();
  const appearance = page
    .locator(".home-workspace")
    .getByRole("group", { name: "Preview appearance", exact: true });
  expect(await appearance.evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe(
    "rgba(0, 0, 0, 0)",
  );
  await expect(appearance).toHaveCSS("border-top-width", "1px");
  const scheme = appearance.getByRole("button", { name: "Dark preview", exact: true });
  if ((await scheme.getAttribute("aria-pressed")) === "false") await scheme.click();
  await expect(scheme).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => scheme.evaluate((button) => getComputedStyle(button).backgroundColor))
    .not.toBe("rgba(0, 0, 0, 0)");
  await expect(scheme).toHaveCSS("border-radius", "8px");
  expect(await scheme.evaluate((button) => getComputedStyle(button, "::after").content)).toBe(
    "none",
  );
});
