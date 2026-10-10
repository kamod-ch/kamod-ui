import { expect, test } from "@playwright/test";
import { choosePreviewTheme } from "./browser-utils";

test("home introduces the library and links prominently to Getting Started", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByTestId("home-page")).toBeVisible();
  await expect(page.locator("h1")).toHaveText(
    "Good Interfaces.Clear Foundations.Your Next Project.",
  );
  await page.getByRole("link", { name: "Get Started", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/getting-started/);
  await expect(page.locator("h1")).toContainText("Getting Started with Kamod UI");
});

test("workspace controls retain their local state and report a completed interaction", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("region", { name: "Interactive workspace example" })
    .scrollIntoViewIfNeeded();
  const example = page.frameLocator('iframe[title="Workspace preferences interactive example 1"]');
  await example.getByLabel("Workspace name").fill("My first workspace");
  const updates = example.getByRole("switch", { name: "Product updates" });
  await updates.focus();
  await page.keyboard.press("Space");
  await expect(updates).toHaveAttribute("aria-checked", "false");
  await example.getByRole("button", { name: "Save Preferences" }).click();
  await expect(example.getByRole("status")).toHaveText(
    "My first workspace: updates off. Nothing was sent.",
  );
});

test("native form checks input locally and can be reset", async ({ page }) => {
  await page.goto("./");
  const form = page.getByRole("form", { name: "Email form demo" });
  await form.getByLabel("Email address").fill("invalid");
  await form.getByRole("button", { name: "Check form" }).click();
  await expect(form.getByRole("status")).toHaveText("Ready to check your input.");
  await form.getByLabel("Email address").fill("demo@example.com");
  await form.getByRole("button", { name: "Check form" }).click();
  await expect(form.getByRole("status")).toHaveText("The form is valid. Nothing was sent.");
  await form.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(form.getByLabel("Email address")).toHaveValue("");
});

test("application shell has a descriptive heading and a direct guide link", async ({ page }) => {
  await page.goto("./");
  const section = page.getByRole("region", { name: "Application shell playground" });
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator(".home-block-heading")).toContainText("Navigation & Layout");
  await expect(section.locator(".home-block-toolbar .home-live-label")).toBeVisible();
  await expect(page.getByRole("tablist", { name: "Choose a block preview" })).toHaveCount(0);
  await expect(section.getByRole("link", { name: "Explore This Block" })).toHaveAttribute(
    "href",
    /\/blocks\/application-shell\/application-shell-1$/,
  );
});

test("workspace showcase preserves edits between views and resets the example", async ({
  page,
}) => {
  await page.goto("./");
  const showcase = page.getByRole("region", { name: "Interactive workspace example" });
  await showcase.scrollIntoViewIfNeeded();
  const example = showcase.frameLocator("iframe");
  const name = example.getByLabel("Workspace name");
  await name.fill("   ");
  await example.getByRole("button", { name: "Save Preferences" }).click();
  await expect
    .poll(() => name.evaluate((input: HTMLInputElement) => input.checkValidity()))
    .toBe(false);
  await expect(example.getByRole("status")).toHaveText(
    "Try it here. Changes stay in this example.",
  );
  await name.fill("Playground workspace");
  await showcase.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(showcase.locator("pre")).toContainText("export function WorkspaceDemo");
  await expect(showcase.getByRole("button", { name: "Copy code", exact: true })).toBeVisible();
  await showcase.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(name).toHaveValue("Playground workspace");
  await showcase.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(name).toHaveValue("Design workspace");
  await expect(example.getByRole("switch", { name: "Product updates" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(showcase.getByRole("button", { name: "Refresh", exact: true })).toBeEnabled();
});

test("workspace preview appearance is isolated from the page and survives reset", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./");
  const showcase = page.getByRole("region", { name: "Interactive workspace example" });
  await showcase.scrollIntoViewIfNeeded();
  const example = showcase.frameLocator("iframe");
  await expect(example.getByLabel("Workspace name")).toBeVisible();
  const originalTheme = await page.locator("html").getAttribute("data-theme");
  await showcase.getByRole("button", { name: "Dark preview", exact: true }).click();
  await expect(example.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await choosePreviewTheme(
    showcase.getByRole("button", { name: "Preview color theme", exact: true }),
    "ocean",
  );
  await expect(example.locator("html")).toHaveAttribute("data-theme", "ocean");
  expect(await page.locator("html").getAttribute("data-theme")).toBe(originalTheme);
  await showcase.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(example.getByLabel("Workspace name")).toBeVisible();
  await expect(example.locator("html")).toHaveClass(/dark/);
  await expect(example.locator("html")).toHaveAttribute("data-theme", "ocean");
});

test("home application shell exposes the full block source and setup prompt", async ({ page }) => {
  await page.goto("./");
  await page.locator(".home-block-examples").scrollIntoViewIfNeeded();
  const showcase = page.locator(".home-shell-showcase .blocks-showcase");
  await expect(showcase.getByRole("tab", { name: "Preview", exact: true })).toBeVisible();
  await expect(
    showcase
      .frameLocator('iframe[title="Block preview"]')
      .getByRole("button", { name: "Toggle Sidebar", exact: true })
      .first(),
  ).toBeVisible();
  await showcase.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(showcase.locator("pre")).toContainText("ApplicationShell1");
  await expect(
    showcase.getByRole("link", { name: "Setup Guide", exact: true }).first(),
  ).toHaveAttribute(
    "href",
    /\/blocks\/application-shell\/application-shell-1#application-shell-installation$/,
  );
  await showcase.getByRole("button", { name: "index.ts", exact: true }).click();
  await expect(showcase.locator("pre")).toContainText("export");
  await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
  await expect(showcase.getByRole("region", { name: "Block prompt" })).toContainText(
    "ApplicationShell1",
  );
  await expect(
    showcase.getByRole("link", { name: "Setup and Integration", exact: true }),
  ).toHaveAttribute(
    "href",
    /\/blocks\/application-shell\/application-shell-1#application-shell-installation$/,
  );
  await showcase.getByRole("tab", { name: "Preview", exact: true }).click();
  await showcase.getByRole("button", { name: "Mobile View", exact: true }).click();
  await expect
    .poll(() =>
      showcase
        .frameLocator('iframe[title="Block preview"]')
        .locator("html")
        .evaluate(() => innerWidth),
    )
    .toBeLessThanOrEqual(390);
});

test("workspace views retain their height and Open preserves preview appearance", async ({
  page,
}) => {
  await page.goto("./");
  const showcase = page.getByRole("region", { name: "Interactive workspace example" });
  await showcase.scrollIntoViewIfNeeded();
  await expect(showcase.frameLocator("iframe").getByLabel("Workspace name")).toBeVisible();
  const height = (await showcase.boundingBox())!.height;
  const note = page.locator(".home-hero-example .home-example-note");
  const noteOffset = async () =>
    note.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  const initialNoteOffset = await noteOffset();
  const assertStable = async () => {
    expect((await showcase.boundingBox())!.height).toBe(height);
    expect(Math.abs((await noteOffset()) - initialNoteOffset)).toBeLessThan(1);
  };
  await showcase.getByRole("tab", { name: "Code", exact: true }).click();
  expect((await showcase.boundingBox())!.height).toBe(height);
  await expect(showcase.locator(".home-workspace-footnote")).toHaveText(
    "Small form. Give Save a real job.",
  );
  await expect(showcase).not.toContainText("Copy preserves source formatting.");
  await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
  expect((await showcase.boundingBox())!.height).toBe(height);
  await expect(showcase.locator('pre[data-language="markdown"]')).toContainText("```tsx");
  await expect(showcase.locator(".home-workspace-footnote")).toHaveText(
    "Brief your AI. Start on solid ground.",
  );
  await expect(showcase.getByRole("switch", { name: "Wrap code lines" })).toHaveCount(0);
  await showcase.getByRole("button", { name: /1 source file/ }).click();
  await expect(showcase.getByRole("tab", { name: "Code", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await showcase.getByRole("button", { name: "Dark preview", exact: true }).click();
  await choosePreviewTheme(
    showcase.getByRole("button", { name: "Preview color theme", exact: true }),
    "ocean",
  );
  await assertStable();
  await showcase.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(showcase.getByRole("tab", { name: "Preview", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await assertStable();
  await expect(showcase.getByRole("button", { name: "Refresh", exact: true })).toBeEnabled();
  await assertStable();
  const popupPromise = page.waitForEvent("popup");
  await showcase.getByRole("link", { name: "Open Preview in a New Tab" }).click();
  const popup = await popupPromise;
  await expect(popup.getByLabel("Workspace name")).toBeVisible();
  await expect(popup.locator("html")).toHaveAttribute("data-theme", "ocean");
  await expect(popup.locator("html")).toHaveClass(/dark/);
  await popup.close();
});

test("workspace loading states reserve the full panel while each view arrives", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme-preset", "sunset");
    localStorage.setItem("theme", "dark");
  });
  const releases: Record<string, () => void> = {};
  const gates = Object.fromEntries(
    ["Preview", "Source", "Prompt"].map((name) => [
      name,
      new Promise<void>((resolve) => {
        releases[name] = resolve;
      }),
    ]),
  );
  await page.route(/component-preview-frame\.htm\?component=home-workspace&/, async (route) => {
    await gates.Preview;
    await route.continue();
  });
  await page.route(/\/Workspace(Source|Prompt)-[^/]+\.js$/, async (route) => {
    const name = route.request().url().includes("WorkspaceSource-") ? "Source" : "Prompt";
    await gates[name];
    await route.continue();
  });
  try {
    await page.goto("./", { waitUntil: "domcontentloaded" });
    const showcase = page.getByRole("region", { name: "Interactive workspace example" });
    await showcase.scrollIntoViewIfNeeded();
    await expect(showcase.locator(".home-workspace-loading")).toContainText("Setting the scene");
    await expect(showcase.locator(".home-workspace-loading")).toHaveAttribute(
      "data-theme",
      "sunset",
    );
    await expect(showcase.locator(".home-workspace-loading")).toHaveCSS("color-scheme", "dark");
    await choosePreviewTheme(
      showcase.getByRole("button", { name: "Preview color theme" }),
      "ocean",
    );
    await showcase.getByRole("button", { name: "Dark preview", exact: true }).click();
    await expect(showcase.locator(".home-workspace-loading")).toHaveAttribute(
      "data-theme",
      "ocean",
    );
    await expect(showcase.locator(".home-workspace-loading")).toHaveCSS("color-scheme", "light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "sunset");
    await expect(page.locator("html")).toHaveClass(/dark/);
    const height = (await showcase.boundingBox())!.height;
    releases.Preview();
    await expect(showcase.locator(".home-workspace-loading")).toHaveCount(0);
    await expect(showcase.frameLocator("iframe").getByLabel("Workspace name")).toBeVisible();
    expect((await showcase.boundingBox())!.height).toBe(height);
    for (const [tab, module, message] of [
      ["Code", "Source", "Opening the source"],
      ["Prompt", "Prompt", "Preparing your prompt"],
    ]) {
      await showcase.getByRole("tab", { name: tab, exact: true }).click();
      await expect(showcase.locator(".home-workspace-loading")).toContainText(message);
      await expect(showcase.locator(".home-workspace-loading")).toHaveAttribute(
        "data-theme",
        "ocean",
      );
      await expect(showcase.locator(".home-workspace-loading")).toHaveCSS("color-scheme", "light");
      expect((await showcase.boundingBox())!.height).toBe(height);
      releases[module]();
      await expect(showcase.locator(".home-workspace-loading")).toHaveCount(0);
      await expect(showcase.locator("pre")).toBeVisible();
      expect((await showcase.boundingBox())!.height).toBe(height);
    }
  } finally {
    Object.values(releases).forEach((release) => release());
  }
});

test("faded component cards reveal individually and remain navigable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  const continuation = page.locator(".home-component-continuation");
  const links = continuation.getByRole("link");
  await continuation.scrollIntoViewIfNeeded();
  await expect(links).toHaveCount(6);
  const veilOpacity = (index: number) =>
    links.nth(index).evaluate((link) => getComputedStyle(link, "::after").opacity);
  await links.first().hover();
  expect(await veilOpacity(0)).toBe("0.55");
  expect(await veilOpacity(1)).toBe("1");
  await links.first().focus();
  expect(await veilOpacity(0)).toBe("0");
  await links.last().focus();
  expect(await veilOpacity(5)).toBe("0");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/docs\/slider\/installation$/);
  await expect(page.locator("h1")).toContainText("Slider");

  await page.goto("./");
  await links.nth(3).click();
  await expect(page).toHaveURL(/\/docs\/calendar\/installation$/);

  await page.goto("./");
  for (const [width, count] of [
    [768, 4],
    [320, 2],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const visibleLinks = continuation.locator("a:visible");
    await expect(visibleLinks).toHaveCount(count);
    await visibleLinks.last().focus();
    await expect(visibleLinks.last()).toBeFocused();
    await expect(visibleLinks.last()).toBeInViewport();
    expect(
      await visibleLinks.last().evaluate((link) => getComputedStyle(link, "::after").opacity),
    ).toBe("0");
  }
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/docs\/popover\/installation$/);
});
