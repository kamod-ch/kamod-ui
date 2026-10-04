import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { enableTestClipboard, forwardTabKey } from "./browser-utils";
import { showcaseWidths } from "./showcase-viewports";

for (const [category, id] of [
  ["sidebar", "sidebar-05"],
  ["application-shell", "application-shell-1"],
  ["login", "login-02"],
  ["signup", "signup-05"],
]) {
  for (const dark of [false, true]) {
    test(`${id}: complete prompts, keyboard selection and responsive layout (${dark ? "dark" : "light"})`, async ({
      page,
      context,
      browserName,
    }) => {
      await enableTestClipboard(context, browserName);
      await page.addInitScript(
        (dark) => localStorage.setItem("theme", dark ? "dark" : "light"),
        dark,
      );
      await page.goto(`./blocks/${category}/${id}`);
      await page.waitForLoadState("networkidle");
      await page
        .locator(".blocks-showcase")
        .getByRole("tab", { name: "Prompt", exact: true })
        .click();
      const panel = page.getByRole("tabpanel", { name: "Prompt", exact: true });
      const setup = panel.getByRole("button", { name: "Set up block", exact: true });
      const adapt = panel.getByRole("button", { name: "Adapt block", exact: true });
      await expect(setup).toHaveAttribute("aria-pressed", "true");
      await expect(panel.locator("pre")).toContainText("## Installation and integration");
      const references = panel.getByRole("navigation", { name: "Block guides" });
      await expect(references.getByRole("link")).toHaveCount(3);
      await expect(
        references.getByRole("link", { name: "Setup guide", exact: true }),
      ).toHaveAttribute(
        "href",
        `#${category === "application-shell" ? "application-shell" : id}-installation`,
      );
      await references.getByRole("link", { name: "Refine component styles", exact: true }).focus();
      await expect(page.getByRole("tooltip")).toContainText("Refine component styles");
      await page.keyboard.press("Escape");
      await expect(
        panel.getByRole("link", { name: "Setup and Integration", exact: true }),
      ).toHaveAttribute(
        "href",
        `#${category === "application-shell" ? "application-shell" : id}-installation`,
      );
      await expect(
        panel.getByText("No assistant-specific setup required", { exact: true }),
      ).toHaveCount(0);
      const sourceLink = panel
        .locator(".docs-code-toolbar")
        .getByRole("link", { name: /source files? included/ });
      await expect(sourceLink).toHaveAttribute("href", `#${id}-code`);
      await expect(panel.locator(".blocks-prompt-format")).toContainText("·");
      await sourceLink.click();
      await expect(
        page.locator(".blocks-showcase").getByRole("tab", { name: "Code", exact: true }),
      ).toHaveAttribute("aria-selected", "true");
      await page
        .locator(".blocks-showcase")
        .getByRole("tab", { name: "Prompt", exact: true })
        .click();

      await panel.getByRole("button", { name: "Copy code", exact: true }).click();
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied).toBe(await panel.locator("pre code").textContent());
      expect(copied).toContain("## Source files (");
      expect(copied).toContain("### src/components/");
      expect(copied).toContain("@kamod-ch/themes");
      await setup.focus();
      await page.keyboard.press(forwardTabKey(browserName));
      await expect(adapt).toBeFocused();
      await page.keyboard.press("Space");
      await expect(adapt).toHaveAttribute("aria-pressed", "true");
      await expect(
        panel.getByRole("heading", { name: "Adaptation prompt", exact: true }),
      ).toBeVisible();
      await expect(panel.locator("pre")).toContainText("## My changes");
      await expect(panel.getByRole("button", { name: "Copy code", exact: true })).toBeVisible();
      const raw = await panel.locator("pre code").textContent();
      for (const name of ["Code (Markdown)", "Markdown", "Plain text"]) {
        await panel
          .getByRole("group", { name: "Prompt display" })
          .getByRole("button", { name, exact: true })
          .click();
        if (name === "Markdown") {
          await expect(panel.getByRole("region", { name: "Rendered prompt" })).toBeVisible();
          await expect(panel.locator(".blocks-prompt-rendered h5")).toContainText(
            "Adapt the block",
          );
        } else {
          await expect(panel.locator("pre code")).toHaveText(raw!);
          if (name === "Code (Markdown)")
            await expect(panel.locator(".token.title").first()).toBeVisible();
        }
        await panel.getByRole("button", { name: "Copy code", exact: true }).click();
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(raw);
        await page.setViewportSize({ width: 320, height: 900 });
        expect(await panel.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
        expect(
          (await new AxeBuilder({ page }).include(".blocks-showcase-prompt").analyze()).violations,
        ).toEqual([]);
      }
      for (const width of showcaseWidths) {
        await page.setViewportSize({ width, height: 900 });
        await expect(panel.locator(".blocks-prompt-options")).toHaveCSS("display", "flex");
        expect(
          await panel.evaluate((node) => node.scrollWidth <= node.clientWidth),
          `panel at ${width}`,
        ).toBe(true);
        expect(
          await panel.locator("pre").evaluate((node) => node.scrollWidth <= node.clientWidth),
          `prompt at ${width}`,
        ).toBe(true);
        for (const selector of [
          ".blocks-showcase-intro",
          ".blocks-prompt-selectors",
          ".docs-code-toolbar",
        ]) {
          expect(
            await panel.locator(selector).evaluate((node) => node.scrollWidth <= node.clientWidth),
            `${selector} at ${width}`,
          ).toBe(true);
        }
        if (width < 640) {
          expect(
            (await panel.locator(".docs-copy-code-button").boundingBox())!.height,
          ).toBeGreaterThanOrEqual(40);
        }
      }
      expect(
        (await new AxeBuilder({ page }).include(".blocks-showcase-prompt").analyze()).violations,
      ).toEqual([]);
    });
  }
}

test("source loads only in Prompt and a failed bundle offers retry without Copy", async ({
  page,
}) => {
  let requests = 0;
  let fail = true;
  await page.route("**/blocks/downloads/sidebar-05.json", async (route) => {
    requests++;
    if (fail) await route.abort();
    else await route.continue();
  });
  await page.goto("./blocks/sidebar/sidebar-05");
  await page.waitForLoadState("networkidle");
  expect(requests).toBe(0);
  await page.locator(".blocks-showcase").getByRole("tab", { name: "Prompt", exact: true }).click();
  const panel = page.getByRole("tabpanel", { name: "Prompt", exact: true });
  await expect(panel.getByRole("alert")).toContainText("source could not be loaded");
  await expect(panel.getByRole("button", { name: "Copy code", exact: true })).toHaveCount(0);
  fail = false;
  await panel.getByRole("button", { name: "Try again" }).click();
  await expect(panel.locator("pre")).toContainText("## Installation and integration");
  expect(requests).toBe(2);
});
