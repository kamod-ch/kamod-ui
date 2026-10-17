import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

test("rocket sparkles change between loops and pause while the header is offscreen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/getting-started");
  const flight = page.locator(".getting-started-flight");
  await expect(flight).toHaveAttribute("data-active", "true");
  const star = flight.locator(".getting-started-flight-star").first();
  const original = await star.getAttribute("style");
  // Reach a real iteration seam without waiting through a whole sparkle cycle.
  await star.evaluate((node) => {
    const animation = node.getAnimations()[0]!;
    const timing = animation.effect!.getTiming();
    const iteration = animation.effect!.getComputedTiming().currentIteration ?? 0;
    animation.currentTime = Number(timing.delay) + (iteration + 1) * Number(timing.duration) - 80;
    animation.play();
  });
  await expect.poll(() => star.getAttribute("style")).not.toBe(original);
  expect(
    await star.evaluate((node) => {
      const field = node.closest(".getting-started-flight")!.getBoundingClientRect();
      const rect = node.getBoundingClientRect();
      return (
        rect.left >= field.left &&
        rect.right <= field.right &&
        rect.top >= field.top &&
        rect.bottom <= field.bottom
      );
    }),
  ).toBe(true);

  // A fresh CSS animation releases the play() override used only to reach the seam above.
  await page.reload();
  await expect(flight).toHaveAttribute("data-active", "true");
  await page.locator("main h2").nth(2).scrollIntoViewIfNeeded();
  await expect(flight).toHaveAttribute("data-active", "false");
  await expect
    .poll(() =>
      flight.evaluate((node) => [
        ...new Set(node.getAnimations({ subtree: true }).map((animation) => animation.playState)),
      ]),
    )
    .toEqual(["paused"]);
  await flight.scrollIntoViewIfNeeded();
  await expect(flight).toHaveAttribute("data-active", "true");
  await expect
    .poll(() =>
      flight.evaluate((node) => [
        ...new Set(node.getAnimations({ subtree: true }).map((animation) => animation.playState)),
      ]),
    )
    .toEqual(["running"]);
});

for (const scheme of ["light", "dark"] as const) {
  for (const width of [320, 768, 1024, 1440]) {
    test(`rocket flies without a backdrop or heading collisions at ${width}px (${scheme})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
      await page.addInitScript((scheme) => {
        localStorage.setItem("theme", scheme);
        localStorage.setItem("theme-preset", scheme === "dark" ? "cursor-warm" : "ocean");
      }, scheme);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/docs/getting-started");
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      await page.evaluate(() => document.fonts.ready);
      const flight = page.locator(".getting-started-flight");
      const rocket = flight.locator(".getting-started-flight-rocket");
      await expect(flight).toHaveAttribute("aria-hidden", "true");
      await expect(rocket).toBeVisible();

      const paint = await flight.evaluate((node) => {
        const title = node.closest("header")!.querySelector("h1")!;
        const foreground = getComputedStyle(title).color;
        const containers = [
          node.parentElement!,
          node,
          node.querySelector(".getting-started-flight-rocket")!,
        ];
        return {
          clear: containers.every((container) =>
            [null, "::before", "::after"].every((pseudo) => {
              const style = getComputedStyle(container, pseudo);
              return (
                style.backgroundColor === "rgba(0, 0, 0, 0)" &&
                style.backgroundImage === "none" &&
                style.boxShadow === "none"
              );
            }),
          ),
          foreground: [...node.querySelectorAll("svg")].every(
            (part) => getComputedStyle(part).color === foreground,
          ),
        };
      });
      expect(paint).toEqual({ clear: true, foreground: true });

      // Sample the actual flight, rather than merely checking that a keyframe name exists.
      const motion = await flight.evaluate((node) => {
        const moving = node.querySelector(".getting-started-flight-rocket")!;
        const animations = node.getAnimations({ subtree: true });
        const movingAnimations = moving.getAnimations({ subtree: true });
        const duration = Math.max(
          ...movingAnimations.map((animation) =>
            Number(animation.effect!.getComputedTiming().duration),
          ),
        );
        animations.forEach((animation) => animation.pause());
        const field = node.getBoundingClientRect();
        const header = node.closest("header")!;
        const text: DOMRect[] = [];
        for (const element of header.querySelectorAll(
          ".block-guide-breadcrumb, .block-guide-eyebrow, h1",
        )) {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(walker.currentNode);
            text.push(...range.getClientRects());
          }
        }
        const frames = Array.from({ length: 17 }, (_, index) => {
          for (const animation of animations) {
            animation.currentTime =
              (Number(animation.effect!.getComputedTiming().duration) * index) / 16;
          }
          const box = moving.getBoundingClientRect();
          return {
            x: box.x,
            y: box.y,
            bounded:
              box.left >= field.left - 1 &&
              box.right <= field.right + 1 &&
              box.top >= field.top - 1 &&
              box.bottom <= field.bottom + 1,
            clear: text.every(
              (rect) =>
                box.right <= rect.left ||
                box.left >= rect.right ||
                box.bottom <= rect.top ||
                box.top >= rect.bottom,
            ),
          };
        });
        const stars = [...node.querySelectorAll(".getting-started-flight-star")].map((star) => {
          const style = getComputedStyle(star);
          const rect = star.getBoundingClientRect();
          return {
            size: style.width,
            x: rect.x,
            y: rect.y,
            bounded:
              rect.left >= field.left - 1 &&
              rect.right <= field.right + 1 &&
              rect.top >= field.top - 1 &&
              rect.bottom <= field.bottom + 1,
          };
        });
        return {
          duration,
          distance: Math.max(
            ...frames.flatMap((frame) =>
              frames.map((other) => Math.hypot(frame.x - other.x, frame.y - other.y)),
            ),
          ),
          bounded: frames.every((frame) => frame.bounded),
          clear: frames.every((frame) => frame.clear),
          fieldVisible: field.left >= 0 && field.right <= innerWidth,
          stars: stars.length,
          boundedStars: stars.every((star) => star.bounded),
          variedSizes: new Set(stars.map((star) => star.size)).size > 1,
          spread: new Set(stars.map((star) => `${star.x},${star.y}`)).size > 3,
        };
      });
      expect(motion.duration).toBeGreaterThan(6_000);
      expect(motion.distance).toBeGreaterThan(10);
      expect(motion.bounded).toBe(true);
      expect(motion.clear).toBe(true);
      expect(motion.fieldVisible).toBe(true);
      expect(motion.stars).toBeGreaterThan(3);
      expect(motion.boundedStars).toBe(true);
      expect(motion.variedSizes).toBe(true);
      expect(motion.spread).toBe(true);

      const sidebarRocket = page.locator("aside.docs-sidebar .navigation-header-link > svg");
      expect(await sidebarRocket.evaluate((node) => node.getAnimations().length > 0)).toBe(
        width >= 1024,
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect
        .poll(() =>
          flight.evaluate(
            (node) =>
              node
                .getAnimations({ subtree: true })
                .filter((animation) => animation.playState === "running").length,
          ),
        )
        .toBe(0);
      expect(await sidebarRocket.evaluate((node) => node.getAnimations().length)).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );

      await page.locator('.block-guide-breadcrumb a[href="/"]').click();
      await expect(page.getByTestId("home-page")).toBeVisible();
      await expect(flight).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }
}

for (const scheme of ["light", "dark"] as const) {
  for (const width of [320, 1440]) {
    test(`page headings, reference pairs and open endings fit ${width}px (${scheme})`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 950 });
      await page.addInitScript((scheme) => {
        localStorage.setItem("theme", scheme);
        localStorage.setItem("theme-preset", "ocean");
      }, scheme);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/docs/getting-started");
      const label = page.locator(".block-guide-eyebrow-label");
      await expect(label).toHaveCSS("font-weight", "600");
      await expect(label.locator("svg")).toHaveCSS("stroke-width", "2.25px");
      await page.goto("/docs/accordion/installation#component-references");
      const pair = page.locator(".component-reference-pair").first();
      await pair.locator("h3").scrollIntoViewIfNeeded();
      expect((await pair.locator(".component-reference-bridge").boundingBox())!.x).toBeCloseTo(
        (await pair.boundingBox())!.x,
        1,
      );
      await expect(pair.locator(".component-reference-panel h3")).toHaveCount(0);
      await expect(pair.locator(".component-reference-category")).toContainText("·");
      const ending = page.locator(".getting-started-reference");
      await ending.getByRole("heading", { level: 2 }).scrollIntoViewIfNeeded();
      await expect(ending.getByRole("heading", { level: 2 })).toBeInViewport();
      await expect(ending.getByRole("heading", { level: 3 })).toHaveCount(3);
      await expect(ending.locator("a")).not.toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.goto("/docs/ecosystem#your-next-step");
      const next = page.locator(".ecosystem-next");
      await expect(next.locator(".ecosystem-next-path")).toHaveCount(3);
      await expect(next.locator(".ecosystem-next-path a.docs-icon-button")).toHaveCount(3);
      await expect(next).not.toContainText("One button, one hook");
      for (const link of await next.locator(".ecosystem-next-footer a").all())
        await expect(link).toHaveCSS("text-decoration-line", "underline");
      await expect(page.locator(".ecosystem-source-header-actions a")).toHaveCount(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(errors).toEqual([]);
    });
  }
}

test("CSS imports fold while wrapping and Copy preserve complete source", async ({
  page,
  context,
  browserName,
}) => {
  await enableTestClipboard(context, browserName);
  await page.goto("/docs/code/installation#code-folding-rules");
  const snippet = page.locator(".kamod-code").filter({ hasText: "src/styles/theme.css" });
  const source = snippet.locator("pre code");
  await source.scrollIntoViewIfNeeded();
  await expect(source.locator(".token").first()).toBeAttached();
  const original = (await source.textContent())!;
  expect(original).toContain('@import "tailwindcss";');
  await snippet.getByRole("button", { name: "Hide imports" }).click();
  await expect(source).not.toContainText("@import");
  await expect(source).toContainText("--radius");
  await snippet.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(original);
  await snippet.getByRole("switch", { name: "Wrap code lines" }).click();
  await expect(snippet).toHaveClass(/is-wrapped/);
  await snippet.getByRole("button", { name: "Show imports" }).click();
  expect(await source.textContent()).toBe(original);
});

test("pending syntax pulses only until the grammar settles and respects reduced motion", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested = false;
  await page.route(/\/assets\/highlight-code-[\w-]+\.js(?:\?|$)/, async (route) => {
    requested = true;
    await held;
    await route.continue();
  });
  try {
    await page.goto("/docs/getting-started", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await page.evaluate(() => document.fonts.ready);
    const code = page.locator(".kamod-code pre code").first();
    await code.scrollIntoViewIfNeeded();
    await expect.poll(() => requested).toBe(true);
    await expect(code).toHaveCSS("animation-name", "code-grammar-pending");
    const original = await code.textContent();
    const frames = await code.evaluate((node) =>
      node
        .getAnimations()[0]
        .effect!.getKeyframes()
        .map((frame) => frame.opacity),
    );
    expect(frames).toEqual(["0.05", "0.35"]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(code).toHaveCSS("animation-name", "none");
    await expect(code).toHaveCSS("opacity", "0.35");
    release();
    await expect(code).toHaveCSS("opacity", "1");
    await expect(code.locator("..").locator("..")).not.toHaveAttribute("data-highlight-pending");
    expect(await code.textContent()).toBe(original);
  } finally {
    release();
  }
});
