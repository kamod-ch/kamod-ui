import { expect, test } from "@playwright/test";
import { enableTestClipboard } from "./browser-utils";

test("rocket sparkles change between loops and pause while the header is offscreen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/getting-started");
  const flight = page.locator(".page-header-decoration .getting-started-flight");
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
      const style = getComputedStyle(node);
      const x = Number.parseFloat(style.getPropertyValue("--star-x"));
      const y = Number.parseFloat(style.getPropertyValue("--star-y"));
      return (
        rect.left >= field.left &&
        rect.right <= field.right &&
        rect.top >= field.top &&
        rect.bottom <= field.bottom &&
        (x < 30 || x > 70) &&
        (y < 30 || y > 70)
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
      const flight = page.locator(".page-header-decoration .getting-started-flight");
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
        const thrust = node.querySelector(".getting-started-flight-thrust")!;
        const trails = [...node.querySelectorAll("svg.getting-started-flight-trail")];
        const animations = node.getAnimations({ subtree: true });
        const duration = (element: Element) =>
          Number(element.getAnimations()[0]!.effect!.getComputedTiming().duration);
        const sample = (animation: Animation, fraction: number) => {
          const timing = animation.effect!.getTiming();
          const delay = Number(timing.delay);
          const duration = Number(timing.duration);
          // Stay after local time zero even when a negative delay skips most of the first cycle.
          const cycle = 1 + Math.max(0, Math.ceil(-delay / duration));
          animation.currentTime = delay + duration * (cycle + fraction);
        };
        // Compare either side of the seam, including each animation's negative phase offset.
        const seamless = (element: Element) => {
          const states = [0, 0.9999].map((fraction) => {
            element.getAnimations().forEach((animation) => sample(animation, fraction));
            const style = getComputedStyle(element);
            return [...new DOMMatrix(style.transform).toFloat64Array(), Number(style.opacity)];
          });
          return states[0].every((value, index) => Math.abs(value - states[1][index]) < 0.03);
        };
        animations.forEach((animation) => animation.pause());
        const field = node.getBoundingClientRect();
        const insideField = (box: DOMRect) =>
          box.left >= field.left - 1 &&
          box.right <= field.right + 1 &&
          box.top >= field.top - 1 &&
          box.bottom <= field.bottom + 1;
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
          animations.forEach((animation) => sample(animation, index / 16));
          const box = moving.getBoundingClientRect();
          const vehicle = thrust.getBoundingClientRect();
          return {
            x: vehicle.x,
            y: vehicle.y,
            visible: [moving, thrust].every((part) => Number(getComputedStyle(part).opacity) === 1),
            bounded: insideField(box) && insideField(vehicle),
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
          const x = Number.parseFloat(style.getPropertyValue("--star-x"));
          const y = Number.parseFloat(style.getPropertyValue("--star-y"));
          return {
            size: Number.parseFloat(style.width),
            x: rect.x,
            y: rect.y,
            outer: (x < 30 || x > 70) && (y < 30 || y > 70),
            clearance:
              Math.hypot(((x - 50) * field.width) / 100, ((y - 50) * field.height) / 100) >
              Math.min(field.width, field.height) * 0.42,
            bounded: insideField(rect),
          };
        });
        const exhaust = trails.map((trail) => {
          const animation = trail.getAnimations()[0]!;
          const states = [0.2, 0.6].map((fraction) => {
            sample(animation, fraction);
            const style = getComputedStyle(trail);
            return `${style.transform}/${style.opacity}`;
          });
          return {
            duration: duration(trail),
            phase: animation.effect!.getTiming().delay,
            moving: states[0] !== states[1],
          };
        });
        return {
          holdDuration: duration(moving),
          thrustDuration: duration(thrust),
          seamless: seamless(moving) && seamless(thrust),
          alwaysVisible: frames.every((frame) => frame.visible),
          distance: Math.max(
            ...frames.flatMap((frame) =>
              frames.map((other) => Math.hypot(frame.x - other.x, frame.y - other.y)),
            ),
          ),
          bounded: frames.every((frame) => frame.bounded),
          clear: frames.every((frame) => frame.clear),
          fieldVisible: field.left >= 0 && field.right <= innerWidth,
          stars: stars.length,
          outerStars: stars.every((star) => star.outer),
          clearStars: stars.every((star) => star.clearance),
          starSizes: stars.map((star) => star.size),
          boundedStars: stars.every((star) => star.bounded),
          variedSizes: new Set(stars.map((star) => star.size)).size > 1,
          spread: new Set(stars.map((star) => `${star.x},${star.y}`)).size > 3,
          exhaust,
        };
      });
      expect(motion.holdDuration).toBeGreaterThan(1_000);
      expect(motion.holdDuration).toBeLessThan(3_000);
      expect(motion.thrustDuration).toBeGreaterThan(100);
      expect(motion.thrustDuration).toBeLessThan(1_000);
      expect(motion.distance).toBeGreaterThan(0.15);
      expect(motion.distance).toBeLessThan(6);
      expect(motion.seamless).toBe(true);
      expect(motion.alwaysVisible).toBe(true);
      expect(motion.bounded).toBe(true);
      expect(motion.clear).toBe(true);
      expect(motion.fieldVisible).toBe(true);
      expect(motion.stars).toBe(4);
      expect(motion.outerStars).toBe(true);
      expect(motion.clearStars).toBe(true);
      for (const size of motion.starSizes) {
        expect(size).toBeGreaterThanOrEqual(width < 640 ? 11.8 : 14);
        expect(size).toBeLessThanOrEqual(width < 640 ? 13.7 : 16);
      }
      expect(motion.boundedStars).toBe(true);
      expect(motion.variedSizes).toBe(true);
      expect(motion.spread).toBe(true);
      expect(motion.exhaust).toHaveLength(3);
      expect(new Set(motion.exhaust.map(({ phase }) => phase)).size).toBe(3);
      for (const trail of motion.exhaust) {
        expect(trail.duration).toBeGreaterThan(200);
        expect(trail.duration).toBeLessThan(1_000);
        expect(trail.moving).toBe(true);
      }

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
