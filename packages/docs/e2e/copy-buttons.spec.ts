import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

const themes = [
  "kamod",
  "shadcn",
  "ocean",
  "sunset",
  "cursor-warm",
  "voltage",
  "watson",
  "professional",
];

for (const dark of [false, true]) {
  test(`shared copy feedback stays aligned and follows every palette (${dark ? "dark" : "light"})`, async ({
    page,
    context,
    browserName,
  }) => {
    test.setTimeout(90_000);
    await enableTestClipboard(context, browserName);
    await page.goto("./docs/icons-package/installation#usage");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const snippet = page
      .locator(".kamod-code")
      .filter({ has: page.locator(".docs-code-file-path", { hasText: "src/example.tsx" }) })
      .first();
    await expect(snippet.locator("pre .token").first()).toBeVisible();
    const button = snippet.locator(".kamod-copy-button");
    const colors = new Set<string>();
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of themes) {
        await page.evaluate(
          ({ dark, theme }) => {
            document.documentElement.classList.toggle("dark", dark);
            document.documentElement.classList.toggle("light", !dark);
            document.documentElement.dataset.theme = theme;
          },
          { dark, theme },
        );
        await expect(button).toHaveAttribute("data-copy-state", "idle");
        await button.scrollIntoViewIfNeeded();
        await expect(button.locator(".kamod-copy-symbol")).toBeVisible();
        await page.mouse.move(0, 0);
        const before = await button.boundingBox();
        const iconSize = await button
          .locator(".kamod-copy-symbol")
          .evaluate((node) => getComputedStyle(node).width);
        await button.hover();
        const hovered = await button.boundingBox();
        expect(Math.abs(hovered!.y - before!.y)).toBeLessThan(0.1);
        expect(Math.abs(hovered!.x - before!.x)).toBeLessThan(0.1);
        await expect(button.locator(".kamod-copy-symbol")).toHaveCSS("transform", "none");
        await button.click();
        await expect(button).toHaveAttribute("data-copy-state", "copied");
        await expect
          .poll(() =>
            button.evaluate(
              (node) =>
                node
                  .getAnimations()
                  .filter(
                    (animation) =>
                      animation instanceof CSSTransition && animation.playState === "running",
                  ).length,
            ),
          )
          .toBe(0);
        await expect(button.locator(".kamod-copy-symbol")).toHaveCSS("width", iconSize);
        await expect(button.locator(".kamod-copy-symbol")).toHaveCSS(
          "animation-name",
          "kamod-copy-handoff",
        );
        const after = await button.boundingBox();
        expect(Math.abs(after!.width - before!.width)).toBeLessThan(0.1);
        expect(Math.abs(after!.height - before!.height)).toBeLessThan(0.1);
        const style = await button.evaluate((node) => {
          const css = getComputedStyle(node);
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const context = canvas.getContext("2d")!;
          context.fillStyle = css.color;
          context.fillRect(0, 0, 1, 1);
          const rgb = [...context.getImageData(0, 0, 1, 1).data];
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = css.backgroundColor;
          context.fillRect(0, 0, 1, 1);
          return {
            rgb,
            backgroundAlpha: context.getImageData(0, 0, 1, 1).data[3],
            color: css.color,
            background: css.backgroundColor,
            position: css.position,
            ring: getComputedStyle(node.querySelector(".kamod-copy-glyph")!, "::after")
              .animationName,
          };
        });
        colors.add(style.color);
        expect(style.rgb[1]).toBeGreaterThan(style.rgb[0] + 5);
        expect(style.rgb[1]).toBeGreaterThan(style.rgb[2] + 5);
        expect(style.backgroundAlpha).toBeGreaterThan(0);
        expect(style.backgroundAlpha).toBeLessThan(80);
        expect(style.background).not.toBe("rgba(0, 0, 0, 0)");
        expect(style.position).toBe("relative");
        expect(style.ring).toBe("kamod-action-stamp-ring");
        // The shared slot settles before feedback resets, including the compact icon-only layout.
        await expect(button.locator(".kamod-copy-symbol")).toHaveCSS("transform", "none");
        await expect(button.locator(".kamod-copy-outgoing")).toHaveCSS("opacity", "0");
        await expect
          .poll(() => page.evaluate(() => navigator.clipboard.readText()))
          .toBe(await snippet.locator("pre code").textContent());
      }
    }
    expect(colors.size).toBeGreaterThan(3);
  });
}

test("reduced motion, keyboard copying, and denied clipboard access retain useful feedback", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./docs/icons-package/installation#usage");
  const snippet = page
    .locator(".kamod-code")
    .filter({ has: page.locator(".docs-code-file-path", { hasText: "src/example.tsx" }) })
    .first();
  await expect(snippet.locator("pre .token").first()).toBeVisible();
  const button = snippet.locator(".kamod-copy-button");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("data-copy-state", "copied");
  await expect(button).toBeFocused();
  await expect(button.locator(".kamod-copy-symbol")).toHaveCSS("animation-name", "none");
  await expect(button.locator(".kamod-copy-outgoing")).toHaveCSS("opacity", "0");
  expect(await button.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(button).toHaveCSS("transition-duration", "0s");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    });
    document.execCommand = () => false;
  });
  await button.click();
  await expect(button).toHaveAttribute("data-copy-state", "error");
  await expect(snippet.getByRole("status")).toContainText("Could not copy code");
  await expect(button).toHaveAccessibleName("Retry copying code");
});

test("copy feedback swaps icons halfway through one turn, snaps back and fades its green glow", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("./docs/icons-package/installation#usage");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const snippet = page
    .locator(".kamod-code")
    .filter({ has: page.locator(".docs-code-file-path", { hasText: "src/example.tsx" }) })
    .first();
  const button = snippet.locator(".kamod-copy-button");
  await button.scrollIntoViewIfNeeded();
  const before = await button.boundingBox();
  await button.click();
  await expect(button).toHaveAttribute("data-copy-state", "copied");
  const frames = await button.evaluate((node) => {
    const animations = node
      .getAnimations({ subtree: true })
      .filter((animation): animation is CSSAnimation => animation instanceof CSSAnimation);
    for (const animation of animations) animation.pause();
    const turn = animations.find((animation) => animation.animationName === "kamod-copy-orbit")!;
    const duration = Number(turn.effect!.getTiming().duration);
    const glyph = node.querySelector(".kamod-copy-glyph")!;
    const frame = (time: number) => {
      for (const animation of animations) animation.currentTime = time;
      const matrix = new DOMMatrixReadOnly(getComputedStyle(glyph).transform);
      return {
        angle: (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI,
        scale: Math.hypot(matrix.a, matrix.b),
        outgoing: Number(getComputedStyle(node.querySelector(".kamod-copy-outgoing")!).opacity),
        incoming: Number(getComputedStyle(node.querySelector(".kamod-copy-symbol")!).opacity),
        glow: Number(getComputedStyle(node, "::before").opacity),
        shadow: getComputedStyle(node, "::before").boxShadow,
      };
    };
    return {
      duration,
      start: frame(0),
      halfway: frame(duration / 2),
      overshoot: frame(duration * 0.76),
      rebound: frame(duration * 0.9),
      settled: frame(duration),
      faded: frame(700),
      restingTransform: getComputedStyle(glyph).transform,
      contributingHandoff: animations
        .filter((animation) => /kamod-copy-(?:orbit|handoff)/.test(animation.animationName))
        .filter((animation) => animation.effect?.getComputedTiming().progress !== null)
        .map((animation) => animation.animationName),
    };
  });
  expect(frames.duration).toBeLessThan(600);
  expect(frames.start.outgoing).toBe(1);
  expect(frames.start.incoming).toBe(0);
  expect(Math.abs(frames.halfway.angle)).toBeCloseTo(180, 1);
  expect(frames.halfway.outgoing).toBeCloseTo(0.5, 1);
  expect(frames.halfway.incoming).toBeCloseTo(0.5, 1);
  expect(frames.overshoot.angle).toBeGreaterThan(0);
  expect(frames.overshoot.angle).toBeLessThan(45);
  expect(frames.overshoot.incoming).toBe(1);
  expect(frames.rebound.angle).toBeLessThan(0);
  expect(frames.rebound.angle).toBeGreaterThan(-15);
  expect(frames.settled.angle).toBeCloseTo(0, 5);
  expect(frames.settled.scale).toBeCloseTo(1, 5);
  expect(frames.start.glow).toBe(0);
  expect(frames.halfway.glow).toBeGreaterThan(0.5);
  expect(frames.halfway.shadow).not.toBe("none");
  expect(frames.faded.glow).toBe(0);
  expect(frames.faded.outgoing).toBe(0);
  expect(frames.faded.incoming).toBe(1);
  expect(frames.restingTransform).toBe("none");
  expect(frames.contributingHandoff).toEqual([]);
  const after = await button.boundingBox();
  expect(after!.x).toBeCloseTo(before!.x, 1);
  expect(after!.y).toBeCloseTo(before!.y, 1);
  expect(after!.width).toBeCloseTo(before!.width, 1);
  expect(after!.height).toBeCloseTo(before!.height, 1);
  // Releasing the animation must not change the glyph's exact resting transform.
  await button.evaluate((node) => {
    for (const animation of node.getAnimations({ subtree: true })) animation.finish();
  });
  await expect(button.locator(".kamod-copy-glyph")).toHaveCSS("transform", frames.restingTransform);
});

for (const width of [320, 1440]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`copy glyph remains visible through natural completion and reset at ${width}px in ${scheme}`, async ({
      page,
      context,
      browserName,
    }) => {
      await enableTestClipboard(context, browserName);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
      await page.addInitScript((scheme) => {
        localStorage.setItem("theme", scheme);
        localStorage.setItem("theme-preset", "kamod");
      }, scheme);
      await page.goto("./docs/icons-package/installation#usage");
      const snippet = page
        .locator(".kamod-code")
        .filter({ has: page.locator(".docs-code-file-path", { hasText: "src/example.tsx" }) })
        .first();
      // Highlighting confirms the source reader has hydrated before its first copy action.
      await expect(snippet.locator("pre .token").first()).toBeVisible();
      const button = snippet.locator(".kamod-copy-button");
      const glyph = button.locator(".kamod-copy-glyph");
      const incoming = button.locator(".kamod-copy-symbol");
      await button.scrollIntoViewIfNeeded();
      await button.hover();
      await expect(button).toHaveAttribute("data-copy-state", "idle");
      await button.evaluate(async (node) => {
        await Promise.all(
          node.getAnimations({ subtree: true }).map((animation) => animation.finished),
        );
      });
      const idleColor = await incoming.evaluate((node) => getComputedStyle(node).color);
      const before = await glyph.screenshot({ animations: "allow" });
      const scroll = await page.evaluate(() => [scrollX, scrollY]);

      await button.click();
      await expect(button).toHaveAttribute("data-copy-state", "copied");
      const completed = await button.evaluate(async (node) => {
        const animations = node
          .getAnimations({ subtree: true })
          .filter((animation): animation is CSSAnimation => animation instanceof CSSAnimation);
        // Wait for the real motion to complete, retaining references to detect filled effects.
        await Promise.all(animations.map((animation) => animation.finished));
        return {
          names: animations.map((animation) => animation.animationName),
          contributing: animations
            .filter((animation) => animation.effect?.getComputedTiming().progress !== null)
            .map((animation) => animation.animationName),
          state: node.getAttribute("data-copy-state"),
          transform: getComputedStyle(node.querySelector(".kamod-copy-glyph")!).transform,
          incoming: getComputedStyle(node.querySelector(".kamod-copy-symbol")!).opacity,
          outgoing: getComputedStyle(node.querySelector(".kamod-copy-outgoing")!).opacity,
          scroll: [scrollX, scrollY],
        };
      });
      expect(completed.names).toContain("kamod-copy-orbit");
      expect(completed.names).toContain("kamod-copy-handoff");
      expect(completed.contributing).toEqual([]);
      expect(completed.state).toBe("copied");
      expect(completed.transform).toBe("none");
      expect(completed.incoming).toBe("1");
      expect(completed.outgoing).toBe("0");
      expect(completed.scroll).toEqual(scroll);

      // The actual 1500ms feedback timer resets the icon; no scroll or second click intervenes.
      await expect(button).toHaveAttribute("data-copy-state", "idle");
      await expect(glyph).toHaveCSS("transform", "none");
      await expect(incoming).toHaveCSS("opacity", "1");
      await expect(incoming).toHaveCSS("color", idleColor);
      await expect(button.locator(".kamod-copy-outgoing")).toHaveCount(0);
      expect(await page.evaluate(() => [scrollX, scrollY])).toEqual(scroll);
      // Screenshots can force painting, so released effects above are the primary regression check.
      expect((await glyph.screenshot({ animations: "allow" })).equals(before)).toBe(true);
      expect(await page.evaluate(() => [scrollX, scrollY])).toEqual(scroll);
    });
  }
}
