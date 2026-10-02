import { expect, test } from "@playwright/test";

test("refresh follows the frame load, holds completion, and blocks repeat clicks until reset", async ({
  page,
}) => {
  await page.goto("./blocks/signup/signup-01");
  await page.waitForLoadState("networkidle");
  const showcase = page.locator(".blocks-showcase");
  const button = showcase.locator(".blocks-showcase-refresh");
  await expect(showcase.locator(".blocks-showcase-toolbar")).toHaveCSS("display", "flex");
  const input = showcase.frameLocator("iframe").getByRole("textbox", { name: "Name", exact: true });
  await input.fill("Before refresh");
  const width = (await button.boundingBox())!.width;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requests = 0;
  let held = false;
  await page.route(/\/blocks\/signup\/signup-01\/preview\/?$/, async (route) => {
    if (!held) {
      held = true;
      requests++;
      await gate;
    }
    await route.continue();
  });
  try {
    await button.click();
    await expect(button).toHaveAttribute("data-refresh-state", "loading");
    await expect(button).toHaveAccessibleName("Refreshing…");
    await expect(button).toBeDisabled();
    await expect(showcase.locator(".blocks-showcase-preview")).toHaveAttribute("aria-busy", "true");
    await expect(button.locator(".blocks-showcase-refresh-spinner")).toHaveCSS(
      "animation-name",
      "blocks-refresh-spin",
    );
    await expect.poll(() => requests).toBe(1);
    await button.evaluate((node: HTMLButtonElement) => {
      node.click();
      node.click();
    });
    expect(requests).toBe(1);
    const loadingWidth = (await button.boundingBox())!.width;
    expect(loadingWidth).toBeGreaterThan(width);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(button.locator(".blocks-showcase-refresh-spinner")).toHaveCSS(
      "animation-name",
      "none",
    );
    release();
    await expect(input).toHaveValue("");
    await expect(button).toHaveAttribute("data-refresh-state", "complete");
    await expect(button).toHaveAccessibleName("Refreshed");
    await expect(button).toBeDisabled();
    const completeWidth = (await button.boundingBox())!.width;
    expect(completeWidth).toBeGreaterThan(width);
    expect(completeWidth).toBeLessThan(loadingWidth);
    // The hook tests verify the short, disabled reset phase with deterministic timers.
    await expect(button).toHaveAttribute("data-refresh-state", "idle");
    await expect(button).toBeEnabled();
    await expect(button).toHaveAccessibleName("Refresh");
    expect((await button.boundingBox())!.width).toBeCloseTo(width, 1);
    await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    await button.click();
    await expect(showcase.getByRole("tab", { name: "Preview", exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(button).toBeEnabled();
  } finally {
    release();
  }
});

test("leaving Preview cancels an unfinished refresh and restores the control", async ({ page }) => {
  await page.goto("./blocks/signup/signup-01");
  await page.waitForLoadState("networkidle");
  const showcase = page.locator(".blocks-showcase");
  const button = showcase.locator(".blocks-showcase-refresh");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/blocks\/signup\/signup-01\/preview\/?$/, async (route) => {
    await gate;
    await route.abort();
  });
  try {
    await button.click();
    await expect(button).toBeDisabled();
    await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
    await expect(button).toHaveAttribute("data-refresh-state", "idle");
    await expect(button).toBeEnabled();
  } finally {
    release();
  }
});
