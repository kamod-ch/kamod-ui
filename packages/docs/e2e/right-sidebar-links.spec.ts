import { expect, test } from "@playwright/test";

for (const path of [
  "docs/components",
  "docs/accordion/installation",
  "blocks/sidebar/sidebar-01",
]) {
  test(`${path}: compact contents action copies the active section without navigating`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`./${path}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const area = page.locator(
      path.startsWith("blocks/")
        ? ".blocks-detail-documentation .blocks-doc-toc nav"
        : ".docs-rightbar",
    );
    const entry = area
      .locator('a[href^="#"]')
      .filter({ hasNotText: /^(On This Page|Overview)$/ })
      .nth(1);
    const href = (await entry.getAttribute("href"))!;
    const id = decodeURIComponent(href.slice(1));
    await page
      .locator(`[id="${id}"]`)
      .evaluate((node) => node.scrollIntoView({ block: "start", behavior: "instant" }));
    await expect(area.locator('a[aria-current="location"]')).toHaveAttribute("href", href);
    const originalUrl = page.url();
    const action = area.locator(".page-contents-copy");
    await expect(action).toHaveAccessibleName("Copy page or section link");
    await expect(action).toHaveCSS("width", "28px");
    await expect(action.locator(".kamod-copy-symbol")).toHaveCSS("width", "14px");
    await action.focus();
    const beforeCopy = await page.evaluate(() => scrollY);
    await page.keyboard.press("Enter");
    const expected = new URL(originalUrl);
    expected.hash = id;
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(expected.href);
    await expect(action).toHaveAttribute("data-copy-state", "copied");
    await expect(action.locator(".kamod-copy-symbol")).toHaveCSS("width", "14px");
    expect(page.url()).toBe(originalUrl);
    expect(await page.evaluate(() => scrollY)).toBe(beforeCopy);
  });
}

for (const path of [
  "docs/pagination/installation",
  "docs/hooks-package/installation",
  "blocks/sidebar/sidebar-01",
]) {
  test(`${path}: followed contents links respect the natural scroll range and manual scroll`, async ({
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
            const offset =
              link.getBoundingClientRect().top -
              node.getBoundingClientRect().top -
              node.clientTop +
              node.scrollTop;
            const maximum = Math.max(0, node.scrollHeight - node.clientHeight);
            return Math.abs(node.scrollTop - Math.min(maximum, Math.max(0, offset)));
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
    await expect
      .poll(() =>
        area.evaluate((node) => {
          const last = Array.from(node.querySelectorAll("a[href]")).at(-1)!;
          const end =
            last.getBoundingClientRect().bottom -
            node.getBoundingClientRect().top -
            node.clientTop +
            node.scrollTop;
          // Short lists may fill a flex pane, but must not acquire extra scrollable space.
          return node.scrollHeight - Math.max(node.clientHeight, end);
        }),
      )
      .toBeLessThanOrEqual(1);
    await page.goBack();
    await aligned(middleHref);

    const manualTop = await area.evaluate((node) =>
      Math.min(80, node.scrollHeight - node.clientHeight),
    );
    await area.dispatchEvent("wheel");
    await area.evaluate((node) => {
      node.scrollTop = Math.min(80, node.scrollHeight - node.clientHeight);
      node.dispatchEvent(new Event("scroll"));
    });
    await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(manualTop);
    // The same fragment must realign when followed from an article permalink too.
    await page.locator(`a.blocks-doc-heading-link[href="${middleHref}"]`).first().click();
    await aligned(middleHref);
    await area.dispatchEvent("wheel");
    await area.evaluate((node) => {
      node.scrollTop = Math.min(80, node.scrollHeight - node.clientHeight);
      node.dispatchEvent(new Event("scroll"));
    });
    const visibleBeforeReload = await area.evaluate((node) => {
      const active = node.querySelector<HTMLAnchorElement>('a[aria-current="location"]')!;
      const bounds = node.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      return (
        item.top >= Math.max(0, bounds.top + node.clientTop) - 1 &&
        item.bottom <= Math.min(innerHeight, bounds.top + node.clientTop + node.clientHeight) + 1
      );
    });
    const activeBeforeReload = await area
      .locator('a[aria-current="location"]')
      .getAttribute("href");
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    // Back/Forward can restore a different article position than its remaining URL fragment.
    const activeAfterReload = await area.locator('a[aria-current="location"]').getAttribute("href");
    if (visibleBeforeReload && activeAfterReload === activeBeforeReload) {
      await expect.poll(() => area.evaluate((node) => node.scrollTop)).toBe(manualTop);
    } else {
      await expect
        .poll(() =>
          area.evaluate((node) => {
            const active = node.querySelector<HTMLAnchorElement>('a[aria-current="location"]')!;
            const bounds = node.getBoundingClientRect();
            const item = active.getBoundingClientRect();
            return (
              item.top >= Math.max(0, bounds.top + node.clientTop) - 1 &&
              item.bottom <=
                Math.min(innerHeight, bounds.top + node.clientTop + node.clientHeight) + 1
            );
          }),
        )
        .toBe(true);
    }
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
            // Reserve next-entry space where possible; at the end, prioritize the active link.
            const atEnd = pane.scrollTop >= pane.scrollHeight - pane.clientHeight - 1;
            return (
              item.top >= Math.max(0, bounds.top) - 1 &&
              item.bottom <= bottom - (atEnd ? 0 : 55) + 1
            );
          }),
        )
        .toBe(true);
      expect(await page.evaluate(() => scrollY)).toBe(articleTop);
    }
  });
}
