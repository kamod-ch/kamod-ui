import { expect, type Locator, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

/** Sample completed browser paint, including the separate moving selection layers. */
async function optionPaint(option: Locator) {
  return option.evaluate(async (button) => {
    getComputedStyle(button).getPropertyValue("background-color");
    await Promise.all(
      button
        .parentElement!.getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => undefined)),
    );
    const context = Object.assign(document.createElement("canvas"), {
      width: 1,
      height: 1,
    }).getContext("2d")!;
    const alpha = (color: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return context.getImageData(0, 0, 1, 1).data[3];
    };
    const css = getComputedStyle(button);
    const check = getComputedStyle(button.querySelector(".site-theme-selection-check")!);
    return {
      wash: alpha(css.backgroundColor),
      ink: css.color,
      weight: css.fontWeight,
      check: [check.color, check.opacity],
      plates: ["::before", "::after"].map((pseudo) => {
        const plate = getComputedStyle(button.parentElement!, pseudo);
        return [alpha(plate.backgroundColor), plate.backgroundImage, plate.transform];
      }),
    };
  });
}

test("preview system mode stays local and follows the device after closing the picker", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/pagination/installation");
  await page.waitForSelector("html.pp-ready");
  const showcase = page.locator(".blocks-showcase").first();
  const trigger = showcase.getByRole("button", { name: "Preview color theme" });
  const preferences = await page.evaluate(() => [
    localStorage.getItem("theme"),
    localStorage.getItem("theme-preset"),
  ]);
  await page.setViewportSize({ width: 320, height: 900 });
  await trigger.click();
  const picker = page.getByRole("dialog", { name: "Find your Palette", exact: true });
  const box = (await picker.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  await picker.getByRole("button", { name: "Use system color mode" }).click();
  await picker.getByRole("button", { name: "Close color theme picker" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(showcase.locator('button[aria-label="Dark preview"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(showcase.frameLocator("iframe").locator("html")).toHaveClass(/dark/);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(showcase.locator('button[aria-label="Dark preview"]')).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(
    await page.evaluate(() => [
      localStorage.getItem("theme"),
      localStorage.getItem("theme-preset"),
    ]),
  ).toEqual(preferences);
});

for (const width of [320, 768, 1440]) {
  test(`theme picker layout, resources and close at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/pagination/installation");
    await page.waitForSelector("html.pp-ready");
    const trigger = page
      .getByRole("button", { name: "Choose color theme" })
      .filter({ visible: true });
    for (const dark of [false, true]) {
      await page.emulateMedia({ colorScheme: dark ? "dark" : "light" });
      await trigger.click();
      const picker = page.locator(".site-theme-picker-content:visible");
      await expect(picker.getByText("Find your Palette", { exact: true })).toBeVisible();
      await expect(picker.locator(".site-theme-picker-count")).toContainText("8 presets");
      await expect(picker.locator(".site-theme-picker-header")).toHaveCSS(
        "background-image",
        "none",
      );
      await expect(picker.locator(".site-theme-picker-footer")).toHaveCSS(
        "background-color",
        "rgba(0, 0, 0, 0)",
      );
      await expect(
        picker.getByRole("link", { name: "Theming Guide", exact: true }),
      ).toHaveAttribute("href", /\/docs\/theming\/installation$/);
      await expect(picker.getByRole("link", { name: "Customize Tokens" })).toHaveAttribute(
        "href",
        /\/docs\/theming\/token-overrides$/,
      );
      await expect(picker.getByRole("link", { name: "Explore Color Themes" })).toHaveAttribute(
        "href",
        /\/docs\/theming\/installation#color-theme-presets$/,
      );
      await expect(picker.locator(".site-theme-picker-action")).toHaveCount(5);
      const selected = picker.getByRole("button", {
        name: "Professional (Electronics)",
        exact: true,
      });
      await selected.click();
      await expect(selected).toHaveAttribute("aria-pressed", "true");
      await expect(picker.locator(".site-theme-option-status")).toHaveCount(1);
      await expect(selected.locator(".site-theme-option-status")).toHaveText("· active");
      const spacing = await selected.evaluate((button) => {
        const name = button.querySelector(".site-theme-option-name")!;
        const label = button.querySelector(".site-theme-option-label")!;
        const swatches = button.querySelector(".site-theme-swatches")!;
        return {
          gap: swatches.getBoundingClientRect().left - label.getBoundingClientRect().right,
          truncated: name.scrollWidth > name.clientWidth,
          overflow: button.scrollWidth > button.clientWidth,
        };
      });
      expect(spacing.gap).toBeGreaterThanOrEqual(11.5);
      expect(spacing.truncated).toBe(true);
      expect(spacing.overflow).toBe(false);
      if (width === 1440) {
        if (dark) await expect(page.locator("html")).toHaveClass(/dark/);
        else await expect(page.locator("html")).not.toHaveClass(/dark/);
        await page.mouse.move(0, 0);
        const resting = await optionPaint(selected);
        expect(resting.wash).toBe(0);
        expect(resting.plates[1][0]).toBeGreaterThan(0);
        expect(resting.check[1]).toBe("1");
        await selected.hover();
        const hovered = await optionPaint(selected);
        expect(hovered.wash).toBeGreaterThan(0);
        expect(hovered).toEqual({ ...resting, wash: hovered.wash });
        await expect(
          page.getByRole("tooltip").filter({
            hasText:
              "Yellow and black accents with geometric Poppins type: confident and purposeful.",
          }),
        ).toBeVisible();
        const ordinary = picker.locator('[data-theme-preset="ocean"]');
        expect((await optionPaint(ordinary)).wash).toBe(0);
        await ordinary.hover();
        expect((await optionPaint(ordinary)).wash).toBeGreaterThan(hovered.wash);
        await page.mouse.move(0, 0);
        expect(await optionPaint(selected)).toEqual(resting);
      }
      const box = (await picker.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(900);
      await picker.getByRole("button", { name: "Close color theme picker" }).click();
      await expect(picker).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
    if (width === 1440) {
      await trigger.click();
      await assertNoBlockingA11yViolations(page, "theme picker", {
        include: [".site-theme-picker-content"],
      });
    }
  });
}

test("system mode stays synchronized after closing, OS changes and reloads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components");
  await page.waitForSelector("html.pp-ready");
  const open = () =>
    page.getByRole("button", { name: "Choose color theme" }).filter({ visible: true }).click();
  const picker = page.locator(".site-theme-picker-content:visible");
  await open();
  await picker.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const system = picker.getByRole("button", { name: "Use system color mode" });
  await expect(system).toHaveAttribute("aria-pressed", "false");
  await system.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(system).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  await picker.getByRole("button", { name: "Close color theme picker" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator(".docs-topbar .site-color-mode-trigger")).toHaveAttribute(
    "data-resolved-mode",
    "dark",
  );
  await page.reload();
  await open();
  await expect(system).toHaveAttribute("aria-pressed", "true");
  await picker.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(system).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("entry animation is staggered and respects reduced motion", async ({ page }) => {
  await page.goto("/docs/components");
  const open = () =>
    page.getByRole("button", { name: "Choose color theme" }).filter({ visible: true }).click();
  await open();
  const slots = page.locator(".site-theme-picker-content:visible .site-theme-picker-action-slot");
  await expect(slots).toHaveCount(5);
  const delays = await slots.evaluateAll((nodes) =>
    nodes.map((node) => parseFloat(getComputedStyle(node).animationDelay)),
  );
  expect(delays[0]).toBeGreaterThan(0);
  expect(delays.every((delay, index) => index === 0 || delay > delays[index - 1])).toBe(true);
  await page.getByRole("button", { name: "Close color theme picker" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open();
  await expect(slots.first()).toHaveCSS("animation-name", "none");
  await expect(slots.first().locator(".site-theme-picker-action-icon")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(slots.first()).toHaveCSS("opacity", "1");
});

test("preset highlight travels between rows, redirects smoothly and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/docs/components");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const open = () =>
    page.locator(".docs-topbar").getByRole("button", { name: "Choose color theme" }).click();
  await open();
  const picker = page.getByRole("dialog", { name: "Find your Palette", exact: true });
  const options = picker.locator(".site-theme-options");
  const position = () =>
    options.evaluate((node) => new DOMMatrix(getComputedStyle(node, "::before").transform).m42);
  await options.locator('[data-theme-preset="kamod"]').click();
  await expect.poll(position).toBeCloseTo(0, 3);
  await options.locator('[data-theme-preset="professional"]').click();
  await expect(options.locator('[data-theme-preset="professional"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  // Sample the browser's real transition at a fixed time, independent of test-runner speed.
  const crossing = await options.evaluate((node) => {
    getComputedStyle(node, "::before").getPropertyValue("transform");
    const motion = node
      .getAnimations({ subtree: true })
      .find(
        (animation) =>
          animation instanceof CSSTransition && animation.transitionProperty === "transform",
      );
    if (!motion) throw new Error("Missing preset selection transition");
    motion.pause();
    const duration = Number(motion.effect!.getTiming().duration);
    motion.currentTime = duration * 0.2;
    const css = getComputedStyle(node, "::before");
    return {
      duration,
      position: new DOMMatrix(css.transform).m42,
      target:
        node.querySelector<HTMLElement>('[aria-pressed="true"]')!.offsetTop - parseFloat(css.top),
      pointerEvents: css.pointerEvents,
    };
  });
  expect(crossing.duration).toBe(700);
  expect(crossing.position).toBeGreaterThan(0);
  expect(crossing.position).toBeLessThan(crossing.target);
  expect(crossing.pointerEvents).toBe("none");
  await options.locator('[data-theme-preset="ocean"]').click();
  await expect(options.locator('[data-theme-preset="ocean"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const redirected = await options.evaluate((node) => {
    getComputedStyle(node, "::before").getPropertyValue("transform");
    const motion = node
      .getAnimations({ subtree: true })
      .find(
        (animation) =>
          animation instanceof CSSTransition && animation.transitionProperty === "transform",
      );
    if (!motion) throw new Error("Missing redirected selection transition");
    motion.pause();
    motion.currentTime = 0;
    const start = new DOMMatrix(getComputedStyle(node, "::before").transform).m42;
    motion.currentTime = Number(motion.effect!.getTiming().duration);
    const css = getComputedStyle(node, "::before");
    return {
      start,
      end: new DOMMatrix(css.transform).m42,
      target:
        node.querySelector<HTMLElement>('[aria-pressed="true"]')!.offsetTop - parseFloat(css.top),
    };
  });
  expect(redirected.start).toBeCloseTo(crossing.position, 1);
  expect(redirected.end).toBeCloseTo(redirected.target, 3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await options.locator('[data-theme-preset="professional"]').click();
  expect(
    await options.evaluate((node) => getComputedStyle(node, "::before").transitionDuration),
  ).toBe("0s");
  await expect.poll(position).toBeCloseTo(crossing.target, 3);
  await picker.getByRole("button", { name: "Close color theme picker" }).click();
  await open();
  await expect.poll(position).toBeCloseTo(crossing.target, 3);
});
