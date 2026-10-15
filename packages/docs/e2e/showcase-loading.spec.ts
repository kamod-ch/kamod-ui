import { expect, type Locator, test } from "@playwright/test";
import { choosePreviewTheme } from "./browser-utils";

function deferred() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { promise, release };
}

/** Sample painted frames through fast tab changes, rather than only their settled state. */
async function samplePanelHeights(showcase: Locator) {
  return showcase.evaluate(async (element) => {
    const samples: {
      view: string;
      height: number;
      reserved: number;
      loading: boolean;
      selected: boolean;
    }[] = [];
    for (const view of ["Code", "Preview", "Prompt", "Code", "Prompt", "Preview"]) {
      const tab = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(
        (tab) => (tab.getAttribute("aria-label") ?? tab.textContent?.trim()) === view,
      );
      if (!tab) throw new Error(`Missing ${view} showcase tab`);
      tab.click();
      for (let frame = 0; frame < 4; frame++) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const panel = element.querySelector(
          '.blocks-showcase-tabs > [data-slot="tabs-content"][data-state="active"]',
        );
        const tabs = element.querySelector(".blocks-showcase-tabs")!;
        const toolbar = tabs.querySelector(".blocks-showcase-toolbar")!;
        samples.push({
          view,
          height: panel?.getBoundingClientRect().height ?? 0,
          reserved: tabs.getBoundingClientRect().bottom - toolbar.getBoundingClientRect().bottom,
          loading: !!panel?.querySelector(".showcase-loading"),
          selected: tab.getAttribute("aria-selected") === "true",
        });
      }
    }
    return samples;
  });
}

for (const width of [320, 1440]) {
  for (const { name, route, selector } of [
    { name: "component", route: "./docs/button/installation", selector: ".component-example" },
    { name: "workspace", route: "./", selector: ".home-workspace" },
    {
      name: "block",
      route: "./blocks/application-shell/application-shell-1",
      selector: ".blocks-showcase",
    },
  ]) {
    test(`${name} panels keep content height while loading and switching at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const module = deferred();
      await page.route(
        /\/(?:ComponentExample(?:Code|Prompt)|Workspace(?:Source|Prompt)|application-shell-source)-[^/]+\.js$/,
        async (request) => {
          await module.promise;
          await request.continue();
        },
      );
      try {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.locator("html")).toHaveClass(/pp-ready/);
        const showcase = page.locator(selector).first();
        await showcase.getByRole("tab", { name: "Preview", exact: true }).waitFor();
        await showcase.scrollIntoViewIfNeeded();
        const panel = showcase.locator(
          '.blocks-showcase-tabs > [data-slot="tabs-content"][data-state="active"]',
        );
        // Include the first Code/Prompt selection, before any lazy module has been visited.
        const pending = await samplePanelHeights(showcase);
        expect(
          pending.filter(
            // Compositor translations can round a 448px box down by a few millionths of a pixel.
            ({ height, reserved, selected }) => height < 447.99 || reserved < 447.99 || !selected,
          ),
        ).toEqual([]);
        expect(pending.filter(({ view, loading }) => view !== "Preview" && !loading)).toEqual([]);
        await showcase.getByRole("tab", { name: "Code", exact: true }).click();
        await expect(panel.locator(".showcase-loading")).toBeVisible();
        module.release();
        await expect(panel.locator(".showcase-loading")).toHaveCount(0);
        await expect(panel.locator("pre")).toBeVisible();
        await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
        await expect(panel.locator(".showcase-loading")).toHaveCount(0);
        await expect(panel.locator("pre")).toBeVisible();
        const ready = await samplePanelHeights(showcase);
        expect(
          ready.filter(
            ({ height, reserved, selected }) => height < 447.99 || reserved < 447.99 || !selected,
          ),
        ).toEqual([]);
        const icon = showcase.locator(
          '.blocks-showcase-toolbar [data-slot="tabs-trigger"][data-state="active"] > svg',
        );
        await expect(panel).toHaveCSS("animation-duration", "0.34s");
        await expect(icon).toHaveCSS("animation-duration", "0.34s");
        await expect(panel).toHaveCSS("transform", "none");
        await expect(icon).toHaveCSS("transform", "none");
        await page.emulateMedia({ reducedMotion: "reduce" });
        await showcase.getByRole("tab", { name: "Code", exact: true }).click();
        await expect(panel).toHaveCSS("animation-name", "none");
        await expect(icon).toHaveCSS("animation-name", "none");
      } finally {
        module.release();
      }
    });
  }
}

test("component views show real loading feedback until their frame or module is ready", async ({
  page,
}) => {
  const preview = deferred();
  const code = deferred();
  const prompt = deferred();
  await page.route(
    /component-preview-frame\.htm\?component=button&example=0(?:&|$)/,
    async (route) => {
      await preview.promise;
      await route.continue();
    },
  );
  await page.route(/\/ComponentExample(Code|Prompt)-[^/]+\.js$/, async (route) => {
    await (route.request().url().includes("ComponentExampleCode-") ? code : prompt).promise;
    await route.continue();
  });
  try {
    await page.goto("./docs/button/installation", { waitUntil: "domcontentloaded" });
    const example = page.locator(".component-example").first();
    await example.scrollIntoViewIfNeeded();
    await expect(example.locator('.showcase-loading[data-view="preview"]')).toBeVisible();
    await choosePreviewTheme(example.getByRole("button", { name: "Preview color theme" }), "ocean");
    const dark = example.getByRole("button", { name: "Dark preview", exact: true });
    if ((await dark.getAttribute("aria-pressed")) !== "true") await dark.click();
    await expect(example.locator(".showcase-loading")).toHaveAttribute("data-theme", "ocean");
    await expect(example.locator(".showcase-loading")).toHaveCSS("color-scheme", "dark");
    preview.release();
    await expect(example.locator(".showcase-loading")).toHaveCount(0);
    for (const [name, gate] of [
      ["Code", code],
      ["Prompt", prompt],
    ] as const) {
      await example.getByRole("tab", { name, exact: true }).click();
      const loading = example.locator(".showcase-loading");
      await expect(loading).toBeVisible();
      await expect(loading.getByRole("status")).toBeVisible();
      await expect(loading).toHaveAttribute("data-theme", "ocean");
      await expect(loading).toHaveCSS("color-scheme", "dark");
      await dark.click();
      await expect(loading).toHaveCSS("color-scheme", "light");
      await dark.click();
      await expect(loading).toHaveCSS("color-scheme", "dark");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      const activity = loading.locator(".showcase-loading-activity");
      await expect(activity).toBeVisible();
      await expect(activity).toHaveAttribute("aria-hidden", "true");
      await expect(
        loading.locator(".showcase-loading-chrome > .showcase-loading-activity"),
      ).toHaveCount(1);
      await expect(activity).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(activity).toHaveCSS("border-width", "0px");
      await expect(activity.locator(":scope > span")).not.toHaveCSS("animation-name", "none");
      await expect(activity.locator("svg")).toHaveCSS("animation-name", "none");
      await expect(loading.locator(".showcase-loading-sketch")).not.toHaveCSS(
        "animation-name",
        "none",
      );
      const companion = loading.locator(".showcase-loading-companion");
      await expect(companion).not.toHaveCSS("animation-name", "none");
      await expect(companion.locator("i")).toHaveCount(3);
      await expect(companion.locator("svg")).toHaveCount(0);
      await expect(
        loading.locator(".showcase-loading-ellipsis, .showcase-loading-pulse"),
      ).toHaveCount(0);
      const dots = loading.locator(".showcase-loading-chrome-marks i");
      for (const dot of await dots.all()) await expect(dot).not.toHaveCSS("animation-name", "none");
      const delays = await dots.evaluateAll((nodes) =>
        nodes.map((node) => getComputedStyle(node).animationDelay),
      );
      expect(new Set(delays).size).toBe(3);
      const cycle = await companion.evaluate((node) =>
        parseFloat(getComputedStyle(node).animationDuration),
      );
      expect(cycle).toBeLessThan(6.4);
      await expect(loading.locator(".showcase-loading-title")).toHaveCSS("animation-name", "none");
      await expect(loading.getByRole("link")).toHaveCount(0);
      const caption = await loading.locator("p").allTextContents();
      expect(caption).toHaveLength(1);
      expect(caption[0].split(/\s+/).length).toBeLessThanOrEqual(3);
      // The first example can still be within the 100px activity margin at the page top.
      await page.evaluate(() =>
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
      );
      await expect(loading).not.toHaveAttribute("data-loading-active");
      await expect
        .poll(() =>
          loading.evaluate(
            (node) =>
              node
                .getAnimations({ subtree: true })
                .filter((animation) => animation.playState === "running").length,
          ),
        )
        .toBe(0);
      await loading.scrollIntoViewIfNeeded();
      await expect(loading).toHaveAttribute("data-loading-active");
      const bounds = await loading.boundingBox();
      await page.emulateMedia({ reducedMotion: "reduce" });
      // Reduced motion stops every decorative loop, without changing the reserved panel size.
      await expect
        .poll(() => loading.evaluate((element) => element.getAnimations({ subtree: true }).length))
        .toBe(0);
      expect(await loading.boundingBox()).toEqual(bounds);
      gate.release();
      await expect(loading).toHaveCount(0);
      await expect(example.locator("pre")).toBeVisible();
    }
  } finally {
    preview.release();
    code.release();
    prompt.release();
  }
});

test("a pending block file follows selection and builds the prompt only after sources arrive", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme-preset", "sunset");
    localStorage.setItem("theme", "light");
    localStorage.setItem(
      "kamod:block-showcase:v1:application-shell/application-shell-1",
      JSON.stringify({ appearance: { preset: "ocean", scheme: "dark" } }),
    );
  });
  const source = deferred();
  await page.route(/\/application-shell-source-[^/]+\.js$/, async (route) => {
    await source.promise;
    await route.continue();
  });
  try {
    await page.goto("./blocks/application-shell/application-shell-1");
    const showcase = page.locator(".blocks-showcase");
    await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    const loader = showcase.locator('.showcase-loading[data-view="file"]');
    await expect(loader).toBeVisible();
    await expect(loader).toHaveAttribute("data-theme", "ocean");
    await expect(loader).toHaveCSS("color-scheme", "dark");
    const file = showcase.locator(".blocks-file-tree-btn").nth(1);
    const filename = await file.getAttribute("title");
    await file.click();
    await expect(loader).toContainText(filename!);
    await expect(showcase.getByRole("button", { name: "Copy code", exact: true })).toHaveCount(0);
    await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
    await expect(showcase.locator('.showcase-loading[data-view="prompt"]')).toBeVisible();
    await expect(showcase.locator('.showcase-loading[data-view="prompt"]')).toHaveAttribute(
      "data-theme",
      "ocean",
    );
    await expect(showcase.locator('.showcase-loading[data-view="prompt"]')).toHaveCSS(
      "color-scheme",
      "dark",
    );
    source.release();
    await expect(showcase.locator(".showcase-loading")).toHaveCount(0);
    await expect(showcase.locator("pre")).toContainText("## Source files");
    await showcase.getByRole("tab", { name: "Code", exact: true }).click();
    await expect(showcase.locator(".docs-code-file-path")).toContainText(filename!);
    await expect(showcase.locator("pre")).toBeVisible();
  } finally {
    source.release();
  }
});

test("loaders use every local palette in both schemes independently of the page", async ({
  page,
}) => {
  const preview = deferred();
  await page.route(
    /component-preview-frame\.htm\?component=button&example=0(?:&|$)/,
    async (route) => {
      await preview.promise;
      await route.continue();
    },
  );
  try {
    await page.goto("./docs/button/installation", { waitUntil: "domcontentloaded" });
    const example = page.locator(".component-example").first();
    const loader = example.locator(".showcase-loading");
    await example.scrollIntoViewIfNeeded();
    await expect(loader).toBeVisible();
    const picker = example.getByRole("button", { name: "Preview color theme" });
    for (const preset of [
      "kamod",
      "shadcn",
      "ocean",
      "sunset",
      "cursor-warm",
      "voltage",
      "watson",
      "professional",
    ]) {
      await choosePreviewTheme(picker, preset);
      for (const scheme of ["light", "dark"]) {
        const toggle = example.getByRole("button", { name: "Dark preview" });
        if ((await toggle.getAttribute("aria-pressed")) !== String(scheme === "dark"))
          await toggle.click();
        await expect(loader).toHaveAttribute("data-theme", preset);
        await expect(loader).toHaveCSS("color-scheme", scheme);
        // Compare with the actual page palette, then put the page in the opposite scheme.
        const result = await loader.evaluate(
          (element, { preset, scheme }) => {
            const root = document.documentElement;
            const originalTheme = root.getAttribute("data-theme");
            const originalClass = root.className;
            const read = (node: Element) => {
              const style = getComputedStyle(node);
              return [
                "background",
                "foreground",
                "primary",
                "card",
                "muted-foreground",
                "border",
              ].map((token) => style.getPropertyValue(`--${token}`).trim());
            };
            root.setAttribute("data-theme", preset);
            root.classList.toggle("dark", scheme === "dark");
            const expected = read(root);
            root.setAttribute("data-theme", preset === "ocean" ? "sunset" : "ocean");
            root.classList.toggle("dark", scheme !== "dark");
            const actual = read(element);
            root.className = originalClass;
            if (originalTheme) root.setAttribute("data-theme", originalTheme);
            else root.removeAttribute("data-theme");
            const activity = element.querySelector(".showcase-loading-activity")!;
            const probe = document.createElement("span");
            element.append(probe);
            probe.style.color = "var(--primary)";
            const spinnerColor = getComputedStyle(probe).color;
            probe.remove();
            return {
              actual,
              expected,
              spinnerColor,
              renderedColor: getComputedStyle(activity).color,
              dotColors: [...element.querySelectorAll(".showcase-loading-chrome-marks i")].map(
                (dot) => getComputedStyle(dot).backgroundColor,
              ),
              background: getComputedStyle(activity).backgroundColor,
              border: getComputedStyle(activity).borderWidth,
              outline: getComputedStyle(activity).outlineWidth,
            };
          },
          { preset, scheme },
        );
        expect(result.actual, `${preset}/${scheme}`).toEqual(result.expected);
        expect(result.renderedColor).toBe(result.spinnerColor);
        expect(result.dotColors).toEqual(Array(3).fill(result.spinnerColor));
        expect(result.background).toBe("rgba(0, 0, 0, 0)");
        expect(result.border).toBe("0px");
        expect(result.outline).toBe("0px");
      }
    }
  } finally {
    preview.release();
  }
});

test("code formatting shows themed feedback and folding ready imports never restarts it", async ({
  page,
}) => {
  const grammar = deferred();
  await page.route(/\/highlight-code-[^/]+\.js$/, async (route) => {
    await grammar.promise;
    await route.continue();
  });
  try {
    await page.goto("./docs/button/installation", { waitUntil: "domcontentloaded" });
    const example = page.locator(".component-example").first();
    await example.scrollIntoViewIfNeeded();
    await choosePreviewTheme(example.getByRole("button", { name: "Preview color theme" }), "ocean");
    const dark = example.getByRole("button", { name: "Dark preview", exact: true });
    if ((await dark.getAttribute("aria-pressed")) !== "true") await dark.click();
    // Narrow only after using the desktop appearance controls; this guarantees reading overflow.
    await page.setViewportSize({ width: 320, height: 900 });
    await example.getByRole("tab", { name: "Code", exact: true }).click();
    const content = example.locator(".kamod-code-content[data-loading]");
    await content.scrollIntoViewIfNeeded();
    const loading = content.locator('.showcase-loading[data-view="code"]');
    await expect(loading).toBeVisible();
    await expect(loading).toHaveAttribute("data-theme", "ocean");
    await expect(loading).toHaveCSS("color-scheme", "dark");
    await expect(loading.locator(".showcase-loading-sketch")).not.toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(content.locator("pre")).toHaveCSS("visibility", "hidden");
    expect((await content.boundingBox())!.height).toBeGreaterThan(0);
    grammar.release();
    await expect(example.locator(".kamod-code-loading")).toHaveCount(0);
    await expect(example.locator("pre")).toBeVisible();
    await expect(example.locator("pre .token").first()).toBeVisible();
    for (const label of ["Hide imports", "Show imports", "Hide imports"]) {
      await example.getByRole("button", { name: label, exact: true }).click();
      await expect(example.locator(".showcase-loading")).toHaveCount(0);
      await expect(example.locator("pre")).toBeVisible();
    }
  } finally {
    grammar.release();
  }
});

for (const { route, selector, displayLabel, region } of [
  {
    route: "./docs/button/installation",
    selector: ".component-example",
    displayLabel: "Prompt Display",
    region: "Rendered prompt",
  },
  {
    route: "./blocks/application-shell/application-shell-1",
    selector: ".blocks-showcase",
    displayLabel: "Prompt Display",
    region: "Rendered prompt",
  },
  {
    route: "./docs/hooks-package/installation",
    selector: ".package-guide-reference",
    displayLabel: "Reference Display",
    region: "Rendered Package Reference",
  },
]) {
  test(`${route}: Markdown keeps the animated reading loader until the renderer is ready`, async ({
    page,
  }) => {
    const markdown = deferred();
    await page.route(/\/PromptMarkdown-[^/]+\.js$/, async (route) => {
      await markdown.promise;
      await route.continue();
    });
    try {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const section = page.locator(selector).first();
      if (displayLabel === "Prompt Display") {
        await section.scrollIntoViewIfNeeded();
        await section.getByRole("tab", { name: "Prompt", exact: true }).click();
      }
      if (displayLabel === "Reference Display") {
        const tab = section
          .getByRole("tablist", { name: displayLabel, exact: true })
          .getByRole("tab", { name: "Markdown", exact: true });
        // Wait for the SSR-to-interactive handoff through selection, not stylesheet readiness.
        await expect(async () => {
          await tab.click({ timeout: 2000 });
          await expect(tab).toHaveAttribute("aria-selected", "true", { timeout: 1000 });
        }).toPass({ timeout: 15000 });
      } else {
        await section
          .getByRole("group", { name: displayLabel, exact: true })
          .getByRole("button", { name: "Markdown", exact: true })
          .click();
      }
      const loading = section.locator('.showcase-loading[data-view="markdown"]');
      await expect(loading).toBeVisible();
      await expect(loading.getByRole("status")).toContainText("Formatting the reading view");
      await expect(loading.locator(".showcase-loading-sketch")).not.toHaveCSS(
        "animation-name",
        "none",
      );
      await expect(loading.locator(".showcase-loading-companion i")).toHaveCount(3);
      await expect(loading.getByRole("link")).toHaveCount(0);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect
        .poll(() => loading.evaluate((node) => node.getAnimations({ subtree: true }).length))
        .toBe(0);
      markdown.release();
      await expect(loading).toHaveCount(0);
      await expect(section.getByRole("region", { name: region, exact: true })).toBeVisible();
      const reader = section.getByRole("region", { name: region, exact: true });
      await expect(reader).toHaveCSS("min-height", "448px");
      await expect(reader).toHaveCSS("max-height", "448px");
      expect((await reader.boundingBox())!.height).toBeCloseTo(448, 1);
      const scroll = await reader.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
        return {
          height: element.clientHeight,
          content: element.scrollHeight,
          top: element.scrollTop,
        };
      });
      expect(scroll.content).toBeGreaterThan(scroll.height);
      expect(scroll.top).toBeGreaterThan(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
    } finally {
      markdown.release();
    }
  });
}

for (const width of [320, 1440]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`portable reference paints pending feedback through rapid switches at ${width}px in ${scheme}`, async ({
      page,
      context,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
      const modules = deferred();
      let markdownRequested = false;
      await page.route(/\/(?:highlight-code|PromptMarkdown)-[^/]+\.js$/, async (route) => {
        if (/\/PromptMarkdown-[^/]+\.js$/.test(route.request().url())) markdownRequested = true;
        await modules.promise;
        await route.continue();
      });
      try {
        await page.goto("./docs/hooks-package/installation#portable-reference", {
          waitUntil: "domcontentloaded",
        });
        await expect(page.locator("html")).toHaveClass(/pp-ready/);
        const reference = page.locator(".package-guide-reference");
        const tabs = reference.getByRole("tablist", { name: "Reference Display", exact: true });
        await tabs.scrollIntoViewIfNeeded();
        const document = await reference.locator("pre code").textContent();
        const originalHeight = (await reference.locator("pre").boundingBox())!.height;
        expect(originalHeight).toBeGreaterThanOrEqual(447.99);

        // Visit both asynchronous readers before racing them, so their work is genuinely pending.
        await tabs.getByRole("tab", { name: "Code (Markdown)", exact: true }).click();
        await expect(reference.locator(".kamod-code-content[data-loading]")).toHaveCount(1);
        await expect(reference.locator(".showcase-loading")).toBeVisible();
        expect((await reference.locator(".showcase-loading").boundingBox())!.height).toBeCloseTo(
          originalHeight,
          1,
        );
        await tabs.getByRole("tab", { name: "Markdown", exact: true }).click();
        await expect.poll(() => markdownRequested).toBe(true);
        await expect(reference.locator(".showcase-loading")).toBeVisible();

        const samples = await reference.evaluate(async (element) => {
          const samples: {
            phase: string;
            view: string;
            selected: boolean;
            loading: boolean;
            content: boolean;
            height: number;
          }[] = [];
          const capture = (view: string, phase: string) => {
            const panel = element.querySelector<HTMLElement>('[role="tabpanel"]');
            const loader = panel?.querySelector<HTMLElement>(".showcase-loading");
            const body =
              loader ??
              panel?.querySelector<HTMLElement>(".blocks-prompt-rendered, pre:not([aria-hidden])");
            const tab = element.querySelector(`[role="tab"][data-value="${view}"]`);
            samples.push({
              phase,
              view,
              selected: tab?.getAttribute("aria-selected") === "true",
              loading: !!loader && getComputedStyle(loader).visibility !== "hidden",
              content: !!body?.textContent?.trim(),
              height: body?.getBoundingClientRect().height ?? 0,
            });
          };
          for (const view of ["code", "markdown", "text", "markdown", "code", "text"]) {
            const tab = element.querySelector<HTMLButtonElement>(
              `[role="tab"][data-value="${view}"]`,
            );
            if (!tab) throw new Error(`Missing ${view} reference tab`);
            tab.click();
            // Drain Preact's selection commit before the browser has painted another frame.
            await Promise.resolve();
            capture(view, "commit");
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            capture(view, "frame");
          }
          return samples;
        });
        expect(samples.filter(({ selected, content }) => !selected || !content)).toEqual([]);
        expect(samples.filter(({ phase, loading }) => phase === "commit" && !loading)).toEqual([]);
        expect(
          samples.filter(
            ({ view, phase, loading }) => phase === "frame" && view !== "text" && !loading,
          ),
        ).toEqual([]);
        expect(samples.filter(({ height }) => Math.abs(height - originalHeight) > 1)).toEqual([]);

        // Resolve work started by now-inactive views; it must never replace the final Plain Text.
        const markdownResponse = page.waitForResponse(/\/PromptMarkdown-[^/]+\.js$/);
        modules.release();
        await (await markdownResponse).finished();
        await expect(tabs.getByRole("tab", { name: "Plain Text", exact: true })).toHaveAttribute(
          "aria-selected",
          "true",
        );
        await expect(reference.locator(".showcase-loading")).toHaveCount(0);
        await expect(reference.locator("pre")).toBeVisible();
        await expect(reference.locator("pre code")).toHaveText(document!);
        await expect(
          reference.getByRole("region", { name: "Rendered Package Reference" }),
        ).toHaveCount(0);
        expect((await reference.locator("pre").boundingBox())!.height).toBeCloseTo(
          originalHeight,
          1,
        );
        if (test.info().project.name === "chromium" || test.info().project.name === "chrome") {
          await context.grantPermissions(["clipboard-read", "clipboard-write"]);
          await reference.getByRole("button", { name: /Copy code|Code copied/ }).click();
          await expect
            .poll(() => page.evaluate(() => navigator.clipboard.readText()))
            .toBe(document);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true);
      } finally {
        modules.release();
      }
    });
  }
}
