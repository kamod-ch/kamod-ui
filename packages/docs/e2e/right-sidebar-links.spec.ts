import { expect, test } from "@playwright/test";

for (const path of [
  "docs/pagination/installation",
  "docs/hooks-package/installation",
  "blocks/sidebar/sidebar-01",
]) {
  test(`${path}: followed contents links reach the top without overriding manual scroll`, async ({
    page,
  }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`./${path}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const breadcrumbTop = await page
      .locator(".block-guide-breadcrumb")
      .first()
      .evaluate((node) => node.getBoundingClientRect().top);
    const area = page.locator(
      path.startsWith("blocks/")
        ? ".blocks-detail-documentation .blocks-doc-toc nav"
        : ".docs-rightbar-contents",
    );
    const links = area.locator("a[href]");
    const middle = links.nth(Math.floor((await links.count()) / 2));
    const last = links.last();
    const aligned = async (href: string) => {
      await expect
        .poll(() =>
          area.evaluate((node, target) => {
            const link = Array.from(node.querySelectorAll("a")).find(
              (link) => link.getAttribute("href") === target,
            )!;
            return Math.abs(link.getBoundingClientRect().top - node.getBoundingClientRect().top);
          }, href),
        )
        .toBeLessThan(1);
    };
    const middleHref = (await middle.getAttribute("href"))!;
    const lastHref = (await last.getAttribute("href"))!;
    await middle.click();
    await aligned(middleHref);
    await expect
      .poll(() => area.evaluate((node) => node.getBoundingClientRect().top))
      .toBe(breadcrumbTop);
    await last.click();
    await aligned(lastHref);
    await page.goBack();
    await aligned(middleHref);

    await area.dispatchEvent("wheel");
    await area.evaluate((node) => {
      node.scrollTop = 80;
      node.dispatchEvent(new Event("scroll"));
    });
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(80);
    // The same fragment must realign when followed from an article permalink too.
    await page.locator(`a.blocks-doc-heading-link[href="${middleHref}"]`).first().click();
    await aligned(middleHref);
    await area.dispatchEvent("wheel");
    await area.evaluate((node) => {
      node.scrollTop = 80;
      node.dispatchEvent(new Event("scroll"));
    });
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(80);
    await page.goto(`./${path}${lastHref}`);
    await aligned(lastHref);
  });
}

for (const path of [
  "docs/getting-started",
  "docs/hooks-package/installation",
  "blocks/sidebar/sidebar-01",
]) {
  test(`${path}: scrolling the article reveals offscreen active links in both directions`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 700 });
    await page.goto(`./${path}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const area = page.locator(
      path.startsWith("blocks/")
        ? ".blocks-detail-documentation .blocks-doc-toc nav"
        : ".docs-rightbar-contents",
    );
    const targets = await area.locator("a[href]").evaluateAll((links) =>
      links
        .map((link) => {
          const id = new URL((link as HTMLAnchorElement).href).hash.slice(1);
          return id && document.getElementById(id) ? id : null;
        })
        .filter((id): id is string => !!id),
    );
    for (const index of [Math.floor(targets.length * 0.8), 1]) {
      if (index === 1) {
        await page.reload();
        await expect(page.locator("html")).toHaveClass(/pp-ready/);
        await page.locator("main").first().dispatchEvent("wheel");
      }
      const id = targets[index];
      await page
        .locator(`[id="${id}"]`)
        .evaluate((node) => node.scrollIntoView({ block: "start", behavior: "instant" }));
      const active = area.locator('a[aria-current="location"]');
      await expect(active).toHaveAttribute("href", new RegExp(`#${id}$`));
      const articleTop = await page.evaluate(() => scrollY);
      await expect
        .poll(() =>
          active.evaluate((link) => {
            const pane = link.closest(".docs-rightbar-contents") ?? link.closest("nav")!;
            const bounds = pane.getBoundingClientRect();
            const item = link.getBoundingClientRect();
            const bottom = Math.min(innerHeight, bounds.top + pane.clientHeight);
            // The full active entry and a glimpse of the following entry should be readable.
            return item.top >= Math.max(0, bounds.top) + 15 && item.bottom <= bottom - 55;
          }),
        )
        .toBe(true);
      expect(await page.evaluate(() => scrollY)).toBe(articleTop);
    }
  });
}
