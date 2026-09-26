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
  expect(geometry.height).toBe(2);
  expect(geometry.topInset).toBeGreaterThanOrEqual(0);
  expect(
    geometry.bottomInset,
    "underline must remain inside the scrollport",
  ).toBeGreaterThanOrEqual(0);
  expect(
    geometry.bottomInset,
    "underline stays adjacent to the list's bottom border",
  ).toBeLessThanOrEqual(2);
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
      expect(await yarn.evaluate((tab) => getComputedStyle(tab).boxShadow)).not.toBe("none");
      const panel = list.locator("..").getByRole("tabpanel");
      await expect(panel).toBeVisible();
      await expect(panel).toContainText("yarn add");
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

test("other docs line tabs keep their indicator when switching preview and code", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("./docs/tabs/disabled-triggers");
  const list = page.locator("#disabled-triggers .docs-tabs-list");
  await expectVisibleUnderline(list);
  await list.getByRole("tab", { name: "Code", exact: true }).click();
  await expectVisibleUnderline(list);
  await list.getByRole("tab", { name: "Preview", exact: true }).click();
  const example = page.locator("#disabled-triggers .preview").getByRole("tablist");
  await expectVisibleUnderline(example);
  await example.getByRole("tab", { name: "Overview" }).press("ArrowRight");
  await expect(example.getByRole("tab", { name: "Usage" })).toBeFocused();
  await expect(example.getByRole("tab", { name: "Billing (Soon)" })).toBeDisabled();
  await expectVisibleUnderline(example);
});

test("default tabs retain their pill styling without a visible underline", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("./docs/tabs/synced-tabs");
  const list = page.locator("#synced-tabs .preview").getByRole("tablist").first();
  await expect(list).toHaveAttribute("data-variant", "default");
  await list.getByRole("tab", { name: "React", exact: true }).press("ArrowRight");
  const active = list.getByRole("tab", { name: "Vue", exact: true });
  await expect(active).toBeFocused();
  await expect(active).toHaveAttribute("aria-selected", "true");
  await expect
    .poll(() => active.evaluate((tab) => getComputedStyle(tab).backgroundColor))
    .not.toBe("rgba(0, 0, 0, 0)");
  const style = await active.evaluate((tab) => ({
    indicator: getComputedStyle(tab, "::after").opacity,
    radius: parseFloat(getComputedStyle(tab).borderRadius),
    background: getComputedStyle(tab).backgroundColor,
  }));
  expect(style.indicator).toBe("0");
  expect(style.radius).toBeGreaterThan(0);
  expect(style.background).not.toBe("rgba(0, 0, 0, 0)");
});
