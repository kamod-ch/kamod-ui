import { expect, test } from "@playwright/test";

test("controlled slider updates when input event is dispatched programmatically", async ({
  page,
}) => {
  await page.goto("/docs/slider#controlled-slider");
  await page.locator("#controlled-slider").waitFor({ state: "visible" });
  const valueLabel = page.locator("#controlled-slider .docs-slider-demo-value").first();
  const input = page.locator('#controlled-slider input[type="range"]').first();
  await expect(input).toBeVisible();
  await input.evaluate((el) => {
    const inputEl = el as HTMLInputElement;
    inputEl.value = "80";
    inputEl.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(valueLabel).toHaveText("80");
});

test("controlled slider responds to click on track (native range)", async ({ page }) => {
  await page.goto("/docs/slider#controlled-slider");
  await page.locator("#controlled-slider").waitFor({ state: "visible" });
  const valueLabel = page.locator("#controlled-slider .docs-slider-demo-value").first();
  const before = (await valueLabel.textContent())?.trim() ?? "";
  const input = page.locator('#controlled-slider input[type="range"]').first();
  await expect(input).toBeVisible();
  const box = await input.boundingBox();
  expect(box).toBeTruthy();
  if (!box) return;
  await input.click({
    position: { x: Math.floor(box.width * 0.92), y: Math.floor(box.height / 2) },
  });
  await expect(valueLabel).not.toHaveText(before);
});
