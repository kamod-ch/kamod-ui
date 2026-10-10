import { expect, test } from "@playwright/test";

for (const route of [
  "blocks/application-shell/application-shell-1",
  "docs/formisch/installation",
]) {
  test(`${route}: code and prompt shortcuts stay beside narrow headings`, async ({ page }) => {
    await page.goto(`./${route}`);
    await page.waitForSelector("html.pp-ready");
    const showcase = page.locator(".blocks-showcase").first();
    for (const width of [320, 480, 528, 640, 768, 980, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const tab of ["Code", "Prompt"]) {
        await showcase.getByRole("tab", { name: tab, exact: true }).click();
        const intro = showcase.locator(".blocks-showcase-intro");
        const heading = intro.getByRole("heading");
        const links = intro.getByRole("navigation").getByRole("link");
        await expect(links).toHaveCount(3);
        const bounds = (await intro.boundingBox())!;
        expect(await intro.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
        const showcaseWidth = (await showcase.boundingBox())!.width;
        const compact = showcaseWidth <= 640;
        if (tab === "Prompt") {
          const purpose = showcase.getByRole("group", { name: "Prompt purpose" });
          const format = showcase.getByRole("group", { name: "Prompt Display" });
          const left = (await purpose.boundingBox())!;
          const right = (await format.boundingBox())!;
          expect(left.y).toBeCloseTo(right.y, 0);
          expect(left.x + left.width).toBeLessThan(right.x);
          expect(
            await showcase
              .locator(".blocks-prompt-hint p")
              .evaluate((node) => getComputedStyle(node).fontSize),
          ).toBe(await intro.locator("P").evaluate((node) => getComputedStyle(node).fontSize));
          for (const button of await format.getByRole("button").all()) {
            await expect(button).toHaveAccessibleName(/.+/);
            await expect(button).toHaveAttribute("title", /.+/);
            if (showcaseWidth <= 512)
              await expect(button.locator(".document-display-label")).toBeHidden();
            else await expect(button.locator(".document-display-label")).toBeVisible();
          }
        }
        for (const link of await links.all()) {
          const button = (await link.boundingBox())!;
          expect(button.x + button.width).toBeLessThanOrEqual(bounds.x + bounds.width);
          if (compact) {
            expect(button.width).toBe(28);
            expect(button.height).toBe(28);
            const title = (await heading.boundingBox())!;
            expect(title.x + title.width).toBeLessThan(button.x);
            expect(title.y + title.height / 2).toBeCloseTo(button.y + button.height / 2, 0);
            expect((await intro.locator("P").boundingBox())!.y).toBeGreaterThan(
              button.y + button.height,
            );
          }
        }
        if (compact) {
          await expect(heading).toHaveCSS("text-overflow", "ellipsis");
          await expect(heading).toHaveCSS("white-space", "nowrap");
          await expect(heading).toHaveAttribute("title", (await heading.textContent())!);
        }
      }
    }
  });
}
