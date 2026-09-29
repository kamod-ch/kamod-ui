import { expect, test } from "@playwright/test";
import { assertNoBlockingA11yViolations } from "./a11y-utils";
import { enableTestClipboard } from "./browser-utils";
import { showcaseWidths } from "./showcase-viewports";

for (const scheme of ["light", "dark"] as const) {
  for (const category of ["application-shell", "sidebar", "login", "signup"]) {
    test(`${category}: source browser layout and controls in ${scheme} mode`, async ({
      page,
      context,
      browserName,
    }) => {
      await enableTestClipboard(context, browserName);
      await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
      const id = category === "application-shell" ? "application-shell-1" : `${category}-01`;
      await page.goto(`./blocks/${category}/${id}`);
      // The static Application Shell markup arrives before its lazy interactive modules.
      await page.waitForLoadState("networkidle");
      const codeTab = page
        .locator(".blocks-showcase")
        .getByRole("tab", { name: "Code", exact: true });
      await codeTab.click();
      await expect(codeTab).toHaveAttribute("aria-selected", "true");
      const panel = page.locator(".blocks-showcase-source");
      const code = panel.locator("pre");
      await expect(code).toBeVisible();
      const filePath = panel.locator(".docs-code-toolbar .docs-code-file-path");
      await expect(filePath).toHaveAttribute("title", /^src\/components\//);
      await expect(panel.locator(".blocks-source-intro")).toHaveCSS("display", "flex");
      await page.evaluate(() => document.fonts.ready);

      for (const width of showcaseWidths) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        const tree = (await panel.locator(".blocks-file-tree").boundingBox())!;
        const pane = (await panel.locator(".blocks-code-pane").boundingBox())!;
        const pathBox = (await filePath.boundingBox())!;
        const copyBox = (await panel
          .getByRole("button", { name: "Copy code", exact: true })
          .boundingBox())!;
        expect(pathBox.x + pathBox.width).toBeLessThan(copyBox.x - 8);
        expect(pathBox.y + pathBox.height / 2).toBeCloseTo(copyBox.y + copyBox.height / 2, 0);
        await expect(filePath.locator(".docs-code-path-root")).toHaveText("src/");
        if (width < 768) expect(pane.y).toBeGreaterThanOrEqual(tree.y + tree.height - 1);
        else expect(pane.y).toBeCloseTo(tree.y, 0);
        if (width < 640) {
          for (const name of ["Wrap code lines", "Copy code"]) {
            expect(
              (await panel.getByRole("button", { name, exact: true }).boundingBox())!.height,
            ).toBeGreaterThanOrEqual(40);
          }
        }
      }

      const original = await code.textContent();
      const wrap = panel.getByRole("button", { name: "Wrap code lines" });
      await expect(wrap).toHaveText("Wrap off");
      const wrapPosition = await wrap.boundingBox();
      await panel.getByRole("button", { name: "Copy code", exact: true }).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
      await expect(panel.getByRole("button", { name: "Code copied", exact: true })).toBeVisible();
      expect(await wrap.boundingBox()).toEqual(wrapPosition);
      await page.setViewportSize({ width: 320, height: 1000 });
      await wrap.click();
      await expect(wrap).toHaveText("Wrap on");
      await expect(wrap).toHaveAttribute("aria-pressed", "true");
      await expect(code.locator("code")).toHaveCSS("white-space", "pre-wrap");
      expect(await code.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      await expect(code).toHaveText(original!);

      await wrap.click();
      await expect(wrap).toHaveText("Wrap off");
      await expect(wrap).toHaveAttribute("aria-pressed", "false");
      await expect(panel.getByRole("searchbox")).toHaveCount(0);
      const second = panel.locator(".blocks-file-tree-btn").nth(1);
      const path = await second.getAttribute("title");
      await second.focus();
      await second.press("Enter");
      await expect(panel.locator(".blocks-source-file-heading code")).toHaveText(path!);
      await expect(code).not.toHaveText(original!);
      await expect(panel.getByRole("link", { name: "Setup guide" })).toHaveAttribute(
        "href",
        `#${category === "application-shell" ? "application-shell" : id}-installation`,
      );
      await assertNoBlockingA11yViolations(page, `${category} ${scheme} source browser`, {
        include: ".blocks-showcase-source",
      });
    });
  }
}
