import { expect, test } from "@playwright/test";
import { forwardTabKey } from "./browser-utils";

const route = "./blocks/signup/signup-01";
const key = "kamod:block-showcase:v1:signup/signup-01";

test("viewport availability follows container width and preserves the preferred mode and demo state", async ({
  page,
  browserName,
}) => {
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  const showcase = page.locator(".blocks-showcase");
  const mobile = showcase.getByRole("button", { name: "Mobile View", exact: true });
  const tablet = showcase.getByRole("button", { name: "Tablet View", exact: true });
  const desktop = showcase.getByRole("button", { name: "Desktop View", exact: true });
  await mobile.click();
  await desktop.click();
  const input = showcase.frameLocator("iframe").getByRole("textbox", { name: "Name", exact: true });
  await input.fill("Ada Example");
  const frameOrigin = await input.evaluate(() => performance.timeOrigin);

  // Resize the showcase alone: availability must not depend on the browser window width.
  for (const width of [980, 979, 768, 767, 320, 981]) {
    await showcase.evaluate((node, width) => {
      node.style.boxSizing = "content-box";
      node.style.width = `${width}px`;
    }, width);
    await expect(mobile).toBeEnabled();
    if (width >= 768) await expect(tablet).toBeEnabled();
    else await expect(tablet).toBeDisabled();
    if (width >= 980) await expect(desktop).toBeEnabled();
    else await expect(desktop).toBeDisabled();
    const selected = width >= 980 ? desktop : width >= 768 ? tablet : mobile;
    await expect(selected).toHaveAttribute("aria-pressed", "true");
    await expect(
      showcase.locator('.blocks-preview-viewport-switcher [aria-pressed="true"]'),
    ).toHaveCount(1);
    await expect(input).toHaveValue("Ada Example");
    expect(await input.evaluate(() => performance.timeOrigin)).toBe(frameOrigin);
    expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).viewport, key)).toBe(
      "desktop",
    );
  }

  await page.setViewportSize({ width: 375, height: 900 });
  await page.reload();
  await expect(mobile).toHaveAttribute("aria-pressed", "true");
  await expect(tablet).toBeDisabled();
  await expect(desktop).toBeDisabled();
  await expect(desktop).toHaveAttribute("title", /980px/);
  await mobile.focus();
  await page.keyboard.press(forwardTabKey(browserName));
  await expect(showcase.getByRole("button", { name: "Dark preview", exact: true })).toBeFocused();
  const disabledBackground = await desktop.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await desktop.hover();
  await expect(desktop).toHaveCSS("background-color", disabledBackground);
  await expect(desktop).toHaveCSS("cursor", "not-allowed");

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(desktop).toHaveAttribute("aria-pressed", "true");
  await mobile.click();
  await page.reload();
  await expect(mobile).toHaveAttribute("aria-pressed", "true");
});

test("viewport availability also updates while the preview is unmounted", async ({ page }) => {
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  const showcase = page.locator(".blocks-showcase");
  await showcase.getByRole("tab", { name: "Code", exact: true }).click();
  await page.setViewportSize({ width: 375, height: 900 });
  await expect(showcase.getByRole("button", { name: "Desktop View" })).toBeDisabled();
  await expect(showcase.getByRole("button", { name: "Mobile View" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await showcase.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(showcase.locator(".blocks-preview-mobile")).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(showcase.getByRole("button", { name: "Desktop View" })).toBeEnabled();
  await expect(showcase.locator(".blocks-preview-desktop")).toBeVisible();
});
