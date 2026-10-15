import { expect, test } from "@playwright/test";
import { choosePreviewTheme, enableTestClipboard } from "./browser-utils";

for (const slug of ["accordion", "tabs", "video", "formisch"]) {
  test(`${slug}: all examples expose prompts with setup, adapt and identical copy formats`, async ({
    page,
    context,
    browserName,
  }) => {
    await enableTestClipboard(context, browserName);
    await page.goto(`./docs/${slug}/installation`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const examples = page.locator(".component-example");
    await examples.first().scrollIntoViewIfNeeded();
    await expect(examples.first().getByRole("button", { name: "Narrow container" })).toBeEnabled();
    const count = await examples.count();
    expect(count).toBeGreaterThan(1);
    await expect(examples.getByRole("tab", { name: "Prompt", exact: true })).toHaveCount(count);
    for (const index of [0, count - 1]) {
      const example = examples.nth(index);
      await example.getByRole("tab", { name: "Code", exact: true }).click();
      await expect(example.locator(".blocks-showcase-intro nav")).toHaveCount(0);
      await expect(
        example
          .locator(".blocks-showcase-intro")
          .getByRole("heading", { name: "Source in Action", exact: true }),
      ).toBeVisible();
      await expect(
        example
          .locator(".blocks-showcase-intro")
          .getByRole("link", { name: "Setup Guide", exact: true }),
      ).toHaveAttribute("href", "#installation");
      const source = await example.locator("pre code").innerText();
      const controls = example.getByRole("group", { name: "Source controls" });
      await expect(controls).toBeVisible();
      await expect(example.locator(".blocks-source-file-heading .docs-code-file-path")).toHaveText(
        /^src\//,
      );
      await controls.getByRole("button", { name: "Copy code", exact: true }).click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
      const wrap = example.getByRole("switch", { name: "Wrap code lines" });
      if (await wrap.count()) {
        await wrap.click();
        await expect(example.locator(".docs-code-line").first()).toHaveCSS(
          "white-space",
          "pre-wrap",
        );
      } else {
        // Short examples intentionally omit reading controls when every line already fits.
        const fits = await example
          .locator("pre")
          .evaluate((node) => node.scrollWidth <= node.clientWidth + 1);
        expect(fits).toBe(true);
      }
      await example.getByRole("tab", { name: "Prompt", exact: true }).click();
      await expect(
        example.getByRole("button", { name: "Code (Markdown)", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(example.locator("pre code")).toContainText(source);
      await expect(
        example.getByRole("link", { name: "Setup and Integration", exact: true }),
      ).toHaveAttribute("href", "#installation");
      await expect(example.getByRole("navigation", { name: "Example guides" })).toHaveCount(0);
      await expect(example.getByText("Example snippet included", { exact: true })).toHaveCount(0);
      await example.getByRole("button", { name: "Tailor Example", exact: true }).click();
      // Wrapped line boxes affect innerText; copying preserves the literal source whitespace.
      const prompt = await example.locator("pre code").textContent();
      expect(prompt).toContain("[describe the outcome]");
      for (const format of ["Code (Markdown)", "Markdown", "Plain Text"]) {
        await example
          .getByRole("group", { name: "Prompt Display" })
          .getByRole("button", { name: format, exact: true })
          .click();
        await example.getByRole("button", { name: "Copy code", exact: true }).click();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(prompt);
      }
      await example.getByRole("button", { name: "Add to Project", exact: true }).click();
      await expect(example.locator("pre code")).toContainText("Set up and integrate");
      await example.getByRole("tab", { name: "Preview", exact: true }).click();
      await example.getByRole("tab", { name: "Prompt", exact: true }).click();
      await expect(
        example.getByRole("button", { name: "Code (Markdown)", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
    }
  });
}

test("appearance is local, preserves form state, and width availability follows the actual space", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("./docs/formisch/installation", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const examples = page.locator(".component-example");
  const first = examples.first();
  const next = examples.nth(1);
  const frame = first.locator("iframe").contentFrame();
  await first.scrollIntoViewIfNeeded();
  await frame.getByLabel("Bug Title", { exact: true }).fill("Keep my input");
  const pageState = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    dark: document.documentElement.classList.contains("dark"),
    storage: JSON.stringify(localStorage),
  }));
  await choosePreviewTheme(first.getByRole("button", { name: "Preview color theme" }), "ocean");
  await first.getByRole("button", { name: "Dark preview" }).click();
  await expect(frame.locator("html")).toHaveAttribute("data-theme", "ocean");
  await expect(frame.locator("html")).toHaveClass(/dark/);
  await expect(frame.getByLabel("Bug Title", { exact: true })).toHaveValue("Keep my input");
  expect(
    await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      dark: document.documentElement.classList.contains("dark"),
      storage: JSON.stringify(localStorage),
    })),
  ).toEqual(pageState);
  await expect(next.getByRole("button", { name: "Preview color theme" })).not.toHaveAttribute(
    "data-preset",
    "ocean",
  );
  await first.getByRole("button", { name: "Narrow container" }).click();
  await expect(first.locator(".component-example-frame-wrap")).toHaveAttribute(
    "data-narrow",
    "true",
  );
  await first.getByRole("button", { name: "Reset example" }).click();
  await expect(frame.getByLabel("Bug Title", { exact: true })).toHaveValue("");
  await expect(frame.locator("html")).toHaveAttribute("data-theme", "ocean");
  for (const width of [320, 390, 640, 768, 980, 1260, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const available = await first.locator(".component-example-size-probe").evaluate((node) => {
      const style = getComputedStyle(node);
      return node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    });
    if (available <= 360)
      await expect(first.getByRole("button", { name: "Narrow container" })).toBeDisabled();
    else await expect(first.getByRole("button", { name: "Narrow container" })).toBeEnabled();
    await first.getByRole("tab", { name: "Prompt", exact: true }).click();
    const compact = await first.evaluate((node) => parseFloat(getComputedStyle(node).width) <= 640);
    const formats = first.getByRole("group", { name: "Prompt Display" });
    for (const name of ["Plain Text", "Code (Markdown)", "Markdown"]) {
      const option = formats.getByRole("button", { name, exact: true });
      await expect(option).toBeVisible();
      await expect(option.locator("svg")).toBeVisible();
      if (compact) {
        await expect(option.locator(".document-display-label")).toBeHidden();
        await expect(option).toHaveCSS(
          "width",
          await option.evaluate((node) => getComputedStyle(node).height),
        );
      } else await expect(option.locator(".document-display-label")).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});

test("portalled controls use the example theme and keyboard focus stays inside the preview", async ({
  page,
}) => {
  await page.goto("./docs/formisch/select", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const example = page.locator("#select .component-example");
  await example.locator("iframe").scrollIntoViewIfNeeded();
  const frame = example.locator("iframe").contentFrame();
  await choosePreviewTheme(example.getByRole("button", { name: "Preview color theme" }), "sunset");
  await example.getByRole("button", { name: "Dark preview" }).click();
  await frame.getByRole("button", { name: "Spoken Language" }).click();
  await expect(frame.getByRole("option", { name: "German" })).toBeVisible();
  await expect(frame.locator("html")).toHaveAttribute("data-theme", "sunset");
  await expect(frame.locator("html")).toHaveClass(/dark/);
  await page.keyboard.press("Escape");
  await expect(frame.getByRole("button", { name: "Spoken Language" })).toBeFocused();
});

for (const scheme of ["light", "dark"] as const) {
  test(`showcase heading actions match control-group surfaces in ${scheme} mode`, async ({
    page,
  }) => {
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
    for (const slug of ["accordion", "formisch"]) {
      await page.goto(`./docs/${slug}/installation`);
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const actions = page.locator(".component-example-links").first();
      const group = page.locator('.component-example [data-slot="tabs-list"]').first();
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await actions.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        const surface = await group.evaluate((node) => getComputedStyle(node).backgroundColor);
        for (const action of await actions.locator(".docs-icon-button").all()) {
          await expect(action).toHaveCSS("background-color", surface);
          await expect(action).toHaveCSS("background-image", "none");
          await expect(action).toHaveCSS("height", "32px");
        }
        if (width === 320) continue;
        // Compare the actual group hover paint with the same layer on the separate links.
        const hover = await actions.evaluate((node) => {
          const probe = document.createElement("span");
          node.append(probe);
          probe.style.background = "var(--showcase-control-hover-tint)";
          const tint = getComputedStyle(probe).backgroundColor;
          probe.style.backgroundImage =
            "linear-gradient(var(--showcase-control-hover-tint), var(--showcase-control-hover-tint))";
          const gradient = getComputedStyle(probe).backgroundImage;
          probe.remove();
          return { tint, gradient };
        });
        const inactive = group.getByRole("tab", { selected: false }).first();
        await inactive.hover();
        await expect(inactive).toHaveCSS("background-color", hover.tint);
        for (const action of await actions.locator(".docs-icon-button").all()) {
          await action.hover();
          await expect(action).toHaveCSS("background-color", surface);
          await expect(action).toHaveCSS("background-image", hover.gradient);
          await expect(action).toHaveCSS("box-shadow", "none");
        }
      }
    }
  });
}
