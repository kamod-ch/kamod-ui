import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";
import { enableTestClipboard } from "./browser-utils";
import { showcaseWidths } from "./showcase-viewports";

for (const category of ["application-shell", "sidebar", "login", "signup"]) {
  const id = category === "application-shell" ? "application-shell-1" : `${category}-01`;
  test(`${category}: the shared control bar is accessible and responsive`, async ({ page }) => {
    await page.goto(`./blocks/${category}/${id}`);
    const showcase = page.locator(".blocks-showcase");
    const toolbar = showcase.locator(".blocks-showcase-toolbar");
    // Static markup can precede the lazy page stylesheet on a cold production load.
    await expect(toolbar).toHaveCSS("display", "flex");
    await page.evaluate(() => document.fonts.ready);
    await expect(toolbar.getByRole("tab")).toHaveCount(3);
    await expect(
      showcase.locator(".blocks-card-title, .blocks-card-desc, .blocks-preview-panel-toolbar"),
    ).toHaveCount(0);
    for (const width of showcaseWidths) {
      await page.setViewportSize({ width, height: 900 });
      await expect(toolbar).toBeVisible();
      expect(await toolbar.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      for (const control of await toolbar.locator("button, select, a").all()) {
        const bounds = (await control.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
      const groups = await toolbar
        .locator(".blocks-showcase-segmented, .blocks-preview-viewport-switcher")
        .evaluateAll((nodes) =>
          nodes.map((node) => {
            const { top, left, right, height } = node.getBoundingClientRect();
            return { top, left, right, height, center: top + height / 2 };
          }),
        );
      expect(groups).toHaveLength(4);
      const availableWidth = await showcase.evaluate((node) => node.clientWidth);
      for (const label of await toolbar.locator(".blocks-showcase-control-label").all()) {
        if (availableWidth <= 832) await expect(label).toBeHidden();
        else await expect(label).toBeVisible();
      }
      if (availableWidth <= 496) {
        expect(groups[0].left).toBeCloseTo(groups[2].left, 0);
        expect(groups[1].right).toBeCloseTo(groups[3].right, 0);
        expect(groups[0].top).toBeCloseTo(groups[1].top, 0);
        expect(groups[2].top).toBeCloseTo(groups[3].top, 0);
        expect(groups[2].top).toBeGreaterThan(groups[0].top + groups[0].height);
      }
      for (const group of groups) {
        expect(group.height).toBeCloseTo(groups[0].height, 0);
        // Wrapping is intentional; groups sharing a row must have the same centerline.
        for (const other of groups.filter((other) => Math.abs(other.top - group.top) < 15)) {
          expect(group.center).toBeCloseTo(other.center, 0);
        }
      }
      expect(
        await showcase
          .locator(".blocks-card-body")
          .evaluate((node) => getComputedStyle(node).padding),
      ).toBe("0px");
    }
    await assertNoBlockingA11yViolations(page, `${category} showcase controls`, {
      include: ".blocks-showcase-toolbar",
    });
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`preview settings stay local and preserve input (${scheme} page)`, async ({ page }) => {
    await page.addInitScript((scheme) => {
      localStorage.setItem("theme", scheme);
      localStorage.setItem("theme-preset", "kamod");
    }, scheme);
    await page.goto("./blocks/signup/signup-01");
    await page.waitForLoadState("networkidle");
    const showcase = page.locator(".blocks-showcase");
    await expect(showcase.locator(".blocks-showcase-toolbar")).toHaveCSS("display", "flex");
    const frame = showcase.frameLocator("iframe");
    const input = frame.getByRole("textbox", { name: "Name", exact: true });
    await input.fill("Ada Example");
    const initialDocument = await frame.locator("html").evaluate(() => performance.timeOrigin);
    const theme = showcase.getByRole("combobox", { name: "Preview color theme" });
    const dark = showcase.getByRole("button", { name: "Dark preview", exact: true });
    await expect(dark).toHaveAttribute("aria-pressed", String(scheme === "dark"));
    await dark.click();
    const previewScheme = scheme === "light" ? "dark" : "light";
    for (const preset of ["ocean", "sunset", "shadcn", "kamod"]) {
      await theme.selectOption(preset);
      await expect(frame.locator("html")).toHaveAttribute("data-theme", preset);
      await expect
        .poll(() => frame.locator("html").evaluate((node) => node.classList.contains("dark")))
        .toBe(previewScheme === "dark");
      await expect(input).toHaveValue("Ada Example");
    }
    expect(await frame.locator("html").evaluate(() => performance.timeOrigin)).toBe(
      initialDocument,
    );
    await expect(page.locator("html")).toHaveAttribute("data-theme", "kamod");
    expect(await page.locator("html").evaluate((node) => node.classList.contains("dark"))).toBe(
      scheme === "dark",
    );
    expect(
      await page.evaluate(() => [
        localStorage.getItem("theme"),
        localStorage.getItem("theme-preset"),
      ]),
    ).toEqual([scheme, "kamod"]);

    for (const [mode, expected] of [
      ["Mobile", 390],
      ["Tablet", 768],
    ] as const) {
      await showcase.getByRole("button", { name: `${mode} view` }).click();
      // Constrained frames have a subtle one-pixel border on each side.
      await expect.poll(() => frame.locator("html").evaluate(() => innerWidth)).toBe(expected - 2);
      await expect(input).toHaveValue("Ada Example");
    }
    await showcase.getByRole("button", { name: "Desktop view" }).click();
    const newTab = page.waitForEvent("popup");
    await showcase.getByRole("link", { name: "Open preview in a new tab" }).click();
    const popup = await newTab;
    await expect(popup.locator("html")).toHaveAttribute("data-theme", "kamod");
    await expect
      .poll(() => popup.locator("html").evaluate((node) => node.classList.contains("dark")))
      .toBe(previewScheme === "dark");
    await popup.close();
    await showcase.getByRole("button", { name: "Refresh", exact: true }).click();
    await expect(input).toHaveValue("");
    await expect
      .poll(() => frame.locator("html").evaluate((node) => node.classList.contains("dark")))
      .toBe(previewScheme === "dark");
  });
}

test("keyboard tabs expose a copyable prompt and preserve source deep links", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./blocks/sidebar/sidebar-05");
  const showcase = page.locator(".blocks-showcase");
  const preview = showcase.getByRole("tab", { name: "Preview", exact: true });
  await preview.focus();
  await page.keyboard.press("End");
  await expect(showcase.getByRole("tab", { name: "Prompt", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const prompt = showcase.getByRole("tabpanel", { name: "Prompt" });
  await expect(prompt).toContainText("Sidebar 5");
  await expect(prompt).toContainText("Installation and integration");
  await prompt.getByRole("button", { name: "Adapt block", exact: true }).click();
  await expect(prompt).toContainText("My changes");
  const setup = prompt.getByRole("link", { name: "Setup guide", exact: true });
  await expect(setup).toHaveAttribute("href", "#sidebar-05-installation");
  await expect(page.locator("#sidebar-05-installation")).toHaveCount(1);
  await prompt.getByRole("button", { name: "Copy code" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Adapt Kamod UI's Sidebar 5",
  );
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await prompt.locator("pre").evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(
    true,
  );
  await prompt.getByRole("link", { name: "Source files" }).click();
  await expect(showcase.getByRole("tab", { name: "Code", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.goto("./blocks/sidebar/sidebar-05#sidebar-05-code/sidebar-05.tsx");
  await expect(showcase.getByRole("tab", { name: "Code", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(showcase.locator(".blocks-code-pane")).toContainText("Sidebar05");
});
