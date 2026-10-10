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
      await expect(filePath).toHaveText(/^src\/components\//);
      await expect(panel.locator(".blocks-showcase-intro")).toHaveCSS("display", "flex");
      await expect(panel.locator(".blocks-showcase-import")).toHaveCount(0);
      await expect(panel.locator(".blocks-install")).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);

      for (const width of showcaseWidths) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        const guides = panel.getByRole("navigation", { name: "Block Guides" }).getByRole("link");
        for (const guide of await guides.all()) {
          await expect(guide).toHaveText("");
          await expect(guide).toHaveAccessibleName(/.+/);
        }
        const tree = (await panel.locator(".blocks-file-tree").boundingBox())!;
        const treeRoot = panel.locator(".blocks-file-tree");
        await expect(treeRoot).toHaveCSS("overflow-y", "auto");
        await expect(panel.locator(".blocks-file-tree-content")).toHaveCSS("overflow-y", "visible");
        await treeRoot.evaluate((node) => {
          node.scrollTop = node.scrollHeight;
        });
        const lastFile = (await treeRoot.locator(".blocks-file-tree-btn").last().boundingBox())!;
        expect(lastFile.y + lastFile.height).toBeLessThanOrEqual(tree.y + tree.height);
        const pinnedHeading = (await treeRoot.locator(".blocks-file-tree-heading").boundingBox())!;
        expect(pinnedHeading.y).toBeCloseTo(tree.y, 0);
        await treeRoot.evaluate((node) => {
          node.scrollTop = 0;
        });
        const pane = (await panel.locator(".blocks-code-pane").boundingBox())!;
        const pathBox = (await filePath.boundingBox())!;
        const copyBox = (await panel
          .getByRole("button", { name: "Copy code", exact: true })
          .boundingBox())!;
        if (pane.width > 448) {
          expect(pathBox.x + pathBox.width).toBeLessThan(copyBox.x - 8);
          expect(pathBox.y + pathBox.height / 2).toBeCloseTo(copyBox.y + copyBox.height / 2, 0);
        } else {
          expect(pathBox.y + pathBox.height).toBeLessThan(copyBox.y);
        }
        await expect(filePath.locator('[data-path-part="root"]')).toHaveText("src/");
        const filename = filePath.locator('[data-path-part="end"]');
        expect(await filename.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(
          true,
        );
        await expect(panel.getByRole("group", { name: "Source controls" })).toBeVisible();
        await expect(
          panel.locator(".blocks-source-file-heading .blocks-source-lines"),
        ).toContainText("·");
        if (width < 768) expect(pane.y).toBeGreaterThanOrEqual(tree.y + tree.height - 1);
        else {
          expect(pane.y).toBeCloseTo(tree.y, 0);
          const filesHeading = (await panel.locator(".blocks-file-tree-heading").boundingBox())!;
          const sourceHeading = (await panel.locator(".blocks-source-file-heading").boundingBox())!;
          expect(filesHeading.y + filesHeading.height).toBeCloseTo(
            sourceHeading.y + sourceHeading.height,
            0,
          );
          const hint = panel.locator(".blocks-file-tree-hint");
          const footer = panel.locator(".blocks-source-footer");
          expect((await hint.boundingBox())!.y).toBeCloseTo((await footer.boundingBox())!.y, 0);
          const textTop = (element: Element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            return range.getClientRects()[0].top;
          };
          expect(await hint.evaluate(textTop)).toBeCloseTo(
            await footer.locator("span").first().evaluate(textTop),
            0,
          );
        }
        if (width < 768) {
          expect(copyBox.height).toBe(28);
          expect(copyBox.width).toBe(28);
        }
      }

      const original = await code.textContent();
      const wrap = panel.getByRole("switch", { name: "Wrap code lines" });
      await expect(wrap).not.toBeChecked();
      const wrapPosition = await wrap.boundingBox();
      await panel.getByRole("button", { name: "Copy code", exact: true }).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
      await expect(panel.getByRole("button", { name: "Code copied", exact: true })).toBeVisible();
      expect(await wrap.boundingBox()).toEqual(wrapPosition);
      await page.setViewportSize({ width: 320, height: 1000 });
      await panel.getByRole("switch", { name: "Wrap code lines" }).click();
      await expect(wrap).toBeChecked();
      await expect(code.locator(".docs-code-line").first()).toHaveCSS("white-space", "pre-wrap");
      expect(await code.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      await expect(code).toHaveText(original!);

      await wrap.focus();
      await wrap.press("Space");
      await expect(wrap).not.toBeChecked();
      await expect(panel.getByRole("searchbox")).toHaveCount(0);
      const second = panel.locator(".blocks-file-tree-btn").nth(1);
      const path = await second.getAttribute("title");
      await second.focus();
      await second.press("Enter");
      await expect(panel.locator('.blocks-source-file-heading [data-path-part="end"]')).toHaveText(
        `/${path!.split("/").at(-1)}`,
      );
      await expect(code).not.toHaveText(original!);
      await expect(
        panel.getByRole("navigation", { name: "Block Guides" }).getByRole("link"),
      ).toHaveCount(3);
      await expect(
        panel
          .getByRole("navigation", { name: "Block Guides" })
          .getByRole("link", { name: "Setup Guide", exact: true }),
      ).toHaveAttribute(
        "href",
        `#${category === "application-shell" ? "application-shell" : id}-installation`,
      );
      await assertNoBlockingA11yViolations(page, `${category} ${scheme} source browser`, {
        include: ".blocks-showcase-source",
      });
    });
  }
}
