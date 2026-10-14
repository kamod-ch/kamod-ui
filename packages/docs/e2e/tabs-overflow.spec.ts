import { expect, type Locator, test } from "@playwright/test";

const shellDetail = "./blocks/application-shell/application-shell-1";

/** Check actual indicator geometry too: hiding overflow alone must not pass this regression. */
async function expectVisibleUnderline(list: Locator) {
  const active = list.locator('[role="tab"][aria-selected="true"]');
  await expect(active).toBeVisible();
  await expect
    .poll(() => active.evaluate((tab) => getComputedStyle(tab, "::after").opacity))
    .toBe("1");

  const geometry = await active.evaluate((tab) => {
    const list = tab.closest<HTMLElement>('[role="tablist"]')!;
    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const style = getComputedStyle(tab);
    const indicator = getComputedStyle(tab, "::after");
    // Absolute positioning uses the trigger's padding box, inside its border.
    const bottom =
      tabRect.bottom - parseFloat(style.borderBottomWidth) - parseFloat(indicator.bottom);
    const top = bottom - parseFloat(indicator.height);
    const viewportTop = listRect.top + list.clientTop;
    const viewportBottom = viewportTop + list.clientHeight;
    list.scrollTop = 100;
    const scrollTop = list.scrollTop;
    list.scrollTop = 0;
    return {
      scrollTop,
      overflow: list.scrollHeight - list.clientHeight,
      height: parseFloat(indicator.height),
      topInset: top - viewportTop,
      bottomInset: viewportBottom - bottom,
    };
  });

  expect(geometry.scrollTop, "tab list must not scroll vertically").toBe(0);
  expect(geometry.overflow, "indicator must not enlarge scroll height").toBe(0);
  expect(geometry.height).toBe(2.5);
  expect(geometry.topInset).toBeGreaterThanOrEqual(0);
  expect(
    geometry.bottomInset,
    "underline must remain inside the scrollport",
  ).toBeGreaterThanOrEqual(0);
  expect(geometry.bottomInset, "underline stays close to the list edge").toBeLessThanOrEqual(8);
}

for (const scheme of ["light", "dark"] as const) {
  for (const width of [320, 768, 979, 980, 1440]) {
    test(`package-manager underline stays visible at ${width}px in ${scheme} mode`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: scheme });
      await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
      await page.goto(shellDetail);
      const list = page.getByRole("tablist", { name: "Package manager" });
      await list.scrollIntoViewIfNeeded();
      await expectVisibleUnderline(list);

      const npm = list.getByRole("tab", { name: "npm", exact: true });
      await npm.click();
      await expect(npm).toHaveAttribute("aria-selected", "true");
      await expectVisibleUnderline(list);
      // Enter through the keyboard to exercise focus-visible consistently across browsers.
      await npm.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(npm).toBeFocused();
      await npm.press("ArrowRight");
      const yarn = list.getByRole("tab", { name: "yarn", exact: true });
      await expect(yarn).toBeFocused();
      await expect(yarn).toHaveAttribute("aria-selected", "true");
      await expectVisibleUnderline(list);
      expect(await yarn.evaluate((tab) => tab.matches(":focus-visible"))).toBe(true);
      await expect(yarn).toHaveCSS("outline-style", "solid");
      await expect(yarn).toHaveCSS("outline-width", "2px");
      await expect(yarn).toHaveCSS("outline-offset", "-2px");
      const panel = page.getByRole("tabpanel", { name: "yarn", exact: true });
      await expect(panel).toBeVisible();
      await expect(panel).toContainText("yarn add");
      await expect(panel).toHaveAttribute("id", (await yarn.getAttribute("aria-controls"))!);
      await expect(panel).toHaveAttribute("aria-labelledby", (await yarn.getAttribute("id"))!);
      await yarn.press("Home");
      await expect(list.getByRole("tab", { name: "pnpm", exact: true })).toBeFocused();
      await expectVisibleUnderline(list);
    });
  }
}

test("overflowing labels still scroll horizontally without hiding the underline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(shellDetail);
  const list = page.getByRole("tablist", { name: "Package manager" });
  // Constrain the list as a consumer would, then supply labels wider than its scrollport.
  await list.evaluate((node) => {
    node.style.maxWidth = `${node.clientWidth}px`;
  });
  await list.getByRole("tab").evaluateAll((tabs) => {
    for (const tab of tabs) tab.textContent += " — install dependencies";
  });
  await list.scrollIntoViewIfNeeded();
  expect(await list.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
  await expectVisibleUnderline(list);
  const first = list.getByRole("tab").first();
  await first.focus();
  await first.press("End");
  await expect(list.getByRole("tab").last()).toBeFocused();
  await expect.poll(() => list.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  await expectVisibleUnderline(list);
  await list.getByRole("tab").last().press("Home");
  await expect(first).toBeFocused();
  await expect.poll(() => list.evaluate((node) => node.scrollLeft)).toBe(0);
});

test("rounded showcase controls and nested line tabs retain independent styling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("./docs/tabs/disabled-triggers");
  const list = page.locator('#disabled-triggers .blocks-showcase-segmented[role="tablist"]');
  await expect(list).toHaveAttribute("data-variant", "default");
  await list.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(list.getByRole("tab", { name: "Code", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(
    await list
      .getByRole("tab", { name: "Code", exact: true })
      .evaluate((tab) => getComputedStyle(tab, "::after").content),
  ).toBe("none");
  await list.getByRole("tab", { name: "Preview", exact: true }).click();
  const frame = page.locator("#disabled-triggers iframe").first();
  await frame.scrollIntoViewIfNeeded();
  const example = frame.contentFrame().getByRole("tablist");
  await expectVisibleUnderline(example);
  await example.getByRole("tab", { name: "Overview" }).press("ArrowRight");
  await expect(example.getByRole("tab", { name: "Usage" })).toBeFocused();
  await expect(example.getByRole("tab", { name: "Billing (Soon)" })).toBeDisabled();
  await expectVisibleUnderline(example);
});

test("synced tabs use the shared line styling and a visible underline", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("./docs/tabs/synced-tabs");
  const frame = page.locator("#synced-tabs iframe").first();
  await frame.scrollIntoViewIfNeeded();
  const list = frame.contentFrame().getByRole("tablist").first();
  await expect(list).toHaveAttribute("data-variant", "line");
  await list.getByRole("tab", { name: "React", exact: true }).press("ArrowRight");
  const active = list.getByRole("tab", { name: "Vue", exact: true });
  await expect(active).toBeFocused();
  await expect(active).toHaveAttribute("aria-selected", "true");
  await expect
    .poll(() => active.evaluate((tab) => getComputedStyle(tab).backgroundColor))
    .not.toBe("rgba(0, 0, 0, 0)");
  await expect
    .poll(() => active.evaluate((tab) => getComputedStyle(tab, "::after").opacity))
    .toBe("1");
  const style = await active.evaluate((tab) => ({
    indicator: getComputedStyle(tab, "::after").opacity,
    radius: parseFloat(getComputedStyle(tab).borderRadius),
    background: getComputedStyle(tab).backgroundColor,
  }));
  expect(style.indicator).toBe("1");
  expect(style.radius).toBe(8);
  expect(style.background).not.toBe("rgba(0, 0, 0, 0)");
});

for (const scheme of ["light", "dark"] as const) {
  test(`tabs retain selection with matching hover increments in ${scheme} mode`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
    await page.goto("./docs/tabs/inset-tabs");
    const showcase = page.locator("#inset-tabs");
    const frame = showcase.locator("iframe").first();
    await frame.scrollIntoViewIfNeeded();
    const inset = frame
      .contentFrame()
      .getByRole("tablist", { name: "horizontal workspace example" });
    const vertical = frame
      .contentFrame()
      .getByRole("tablist", { name: "vertical workspace example" });
    const variants = [
      page.locator('[data-slot="tabs-list"][data-variant="line"]').first(),
      showcase.locator('.blocks-showcase-segmented[role="tablist"]').first(),
      inset,
      vertical,
    ];

    for (const list of variants) {
      const active = list.locator('[role="tab"][aria-selected="true"]');
      const inactive = list.locator('[role="tab"][aria-selected="false"]:not(:disabled)').first();
      await active.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      // Resolve colors through the browser rather than assuming a theme's RGB values.
      const expected = await list.evaluate((node) => {
        const probe = document.createElement("span");
        node.append(probe);
        const colors = [
          "--tabs-selected-background",
          "--tabs-hover-background",
          "--tabs-selected-hover-background",
        ].map((token) => {
          probe.style.background = `var(${token})`;
          return getComputedStyle(probe).backgroundColor;
        });
        probe.remove();
        return { selected: colors[0], hovered: colors[1], selectedHovered: colors[2] };
      });
      expect(expected.selected).not.toBe(expected.hovered);
      expect(expected.selectedHovered).not.toBe(expected.hovered);
      await expect(active).toHaveCSS("background-color", expected.selected);
      const idleBackground = await inactive.evaluate(
        (node) => getComputedStyle(node).backgroundColor,
      );
      const alpha = (color: string) =>
        parseFloat(
          color.startsWith("rgba")
            ? color.slice(color.lastIndexOf(",") + 1)
            : (color.split("/")[1] ?? "1"),
        );
      expect(alpha(expected.selectedHovered) - alpha(expected.selected)).toBeCloseTo(
        alpha(expected.hovered) - alpha(idleBackground),
        5,
      );
      const restingLine = await active.evaluate(
        (node) => getComputedStyle(node, "::after").transform,
      );
      await active.hover();
      await expect(active).toHaveCSS("background-color", expected.selectedHovered);
      await expect(active).toHaveCSS("background-image", "none");
      expect(await active.evaluate((node) => getComputedStyle(node, "::after").transform)).toBe(
        restingLine,
      );
      expect(restingLine).toBe("none");
      await inactive.hover();
      await expect(inactive).toHaveCSS("background-color", expected.hovered);
      await expect(active).toHaveCSS("background-color", expected.selected);
    }

    const appearance = showcase.getByRole("button", { name: "Dark preview", exact: true });
    if ((await appearance.getAttribute("aria-pressed")) === "true") await appearance.click();
    await page.mouse.move(0, 0);
    await expect(appearance).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await appearance.hover();
    const hoverTint = await appearance.evaluate((node) => {
      const probe = document.createElement("span");
      probe.style.background = "var(--docs-icon-button-hover-background)";
      probe.style.backgroundImage =
        "linear-gradient(var(--docs-icon-button-hover-background), var(--docs-icon-button-hover-background))";
      node.append(probe);
      const style = getComputedStyle(probe);
      const tint = { color: style.backgroundColor, gradient: style.backgroundImage };
      probe.style.background = "var(--background)";
      const selected = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { ...tint, selected };
    });
    await expect(appearance).toHaveCSS("background-color", hoverTint.color);
    await appearance.click();
    await expect(appearance).toHaveAttribute("aria-pressed", "true");
    await expect(appearance).toHaveCSS("background-image", hoverTint.gradient);
    await expect(appearance).toHaveCSS("background-color", hoverTint.selected);
    await page.mouse.move(0, 0);
    await expect(appearance).toHaveCSS("background-image", "none");
    await expect(appearance).toHaveCSS("background-color", hoverTint.selected);
  });
}
