import { expect, test } from "@playwright/test";

for (const path of [
  "docs/components",
  "docs/accordion/installation",
  "blocks/sidebar/sidebar-01",
]) {
  test(`${path}: compact contents shortcut follows the tracked section with keyboard navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`./${path}`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const area = page.locator(
      path.startsWith("blocks/")
        ? ".blocks-detail-documentation .blocks-doc-toc nav"
        : ".docs-rightbar",
    );
    const entry = area.locator('a[href^="#"]:not([data-contents-action])').nth(1);
    const href = (await entry.getAttribute("href"))!;
    const id = decodeURIComponent(href.slice(1));
    await page
      .locator(`[id="${id}"]`)
      .evaluate((node) => node.scrollIntoView({ block: "start", behavior: "instant" }));
    await expect(area.locator('a[aria-current="location"]')).toHaveAttribute("href", href);
    const action = area.locator(".page-contents-locate");
    await expect(action).toHaveAccessibleName("Jump to the current section");
    await expect(action).toHaveAttribute("href", href);
    await expect(action).toHaveCSS("width", "24px");
    await expect(action.locator("svg")).toHaveCSS("width", "14px");
    await action.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
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
    const links = area.locator("a[href]:not([data-contents-action])");
    const middle = links.nth(Math.floor((await links.count()) / 2));
    const last = links.last();
    const aligned = async (href: string) => {
      await expect
        .poll(() =>
          area.evaluate((node, target) => {
            const link = Array.from(node.querySelectorAll("a:not([data-contents-action])")).find(
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
          const last = Array.from(node.querySelectorAll("a[href]:not([data-contents-action])")).at(
            -1,
          )!;
          const end =
            last.getBoundingClientRect().bottom -
            node.getBoundingClientRect().top -
            node.clientTop +
            node.scrollTop;
          // Only the small end inset may follow the final link; short lists need no extra scroll.
          return (
            node.scrollHeight -
            Math.max(node.clientHeight, end) -
            parseFloat(getComputedStyle(node).paddingBottom)
          );
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
            // Reload can return above a block's preview; keep its link inside the offscreen pane.
            const offscreen = bounds.top >= innerHeight || bounds.bottom <= 0;
            const top = bounds.top + node.clientTop;
            const bottom = top + node.clientHeight;
            return (
              item.top >= (offscreen ? top : Math.max(0, top)) - 1 &&
              item.bottom <= (offscreen ? bottom : Math.min(innerHeight, bottom)) + 1
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
    const targets = await area.locator("a[href]:not([data-contents-action])").evaluateAll(
      (links, blockPage) =>
        links
          .map((link) => {
            const id = new URL((link as HTMLAnchorElement).href).hash.slice(1);
            const heading = id && document.getElementById(id);
            // A block's contents pane begins below its preview; exercise reading follow inside its guide.
            return heading && (!blockPage || heading.closest(".blocks-detail-documentation"))
              ? id
              : null;
          })
          .filter((id): id is string => !!id),
      path.startsWith("blocks/"),
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

for (const scheme of ["light", "dark"] as const) {
  test(`final contents links stay clear of the unchanged pane edge in ${scheme} mode`, async ({
    page,
  }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), scheme);
    for (const height of [600, 900]) {
      await page.setViewportSize({ width: 1440, height });
      for (const path of [
        "docs/getting-started",
        "docs/accordion/installation",
        "blocks/sidebar/sidebar-01",
      ]) {
        await page.goto(`./${path}`, { waitUntil: "domcontentloaded" });
        await expect(page.locator("html")).toHaveClass(/pp-ready/);
        if (path.startsWith("blocks/"))
          await page.locator(".blocks-detail-documentation").scrollIntoViewIfNeeded();
        const area = page.locator(
          path.startsWith("blocks/")
            ? ".blocks-detail-documentation .blocks-doc-toc nav"
            : ".docs-rightbar-contents",
        );
        if (!path.startsWith("blocks/"))
          await expect(page.locator(".docs-rightbar > .feedback-card")).toBeVisible();
        const before = await area.boundingBox();
        // Disable only the new inset to compare the existing outer geometry with the final layout.
        const unchanged = await area.evaluate((node) => {
          node.style.paddingBottom = "0px";
          const bounds = node.getBoundingClientRect();
          node.style.removeProperty("padding-bottom");
          return { top: bounds.top, bottom: bounds.bottom };
        });
        expect(before!.y).toBeCloseTo(unchanged.top, 1);
        expect(before!.y + before!.height).toBeCloseTo(unchanged.bottom, 1);
        await area.dispatchEvent("wheel");
        const geometry = await area.evaluate((node) => {
          node.scrollTop = node.scrollHeight;
          const bounds = node.getBoundingClientRect();
          const last = Array.from(
            node.querySelectorAll('a[href^="#"]:not([data-contents-action])'),
          ).at(-1)!;
          const item = last.getBoundingClientRect();
          return {
            gap: bounds.bottom - item.bottom,
            top: item.top - bounds.top,
            padding: getComputedStyle(node).paddingBottom,
          };
        });
        expect(geometry.padding).toBe("16px");
        expect(geometry.gap).toBeGreaterThanOrEqual(15);
        expect(geometry.gap).toBeLessThanOrEqual(17);
        expect(geometry.top).toBeGreaterThanOrEqual(0);
      }
    }
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`contents header matches pinned navigation rows and nesting softens ink (${theme})`, async ({
    page,
  }) => {
    await page.route("https://matomo.kamod.ch/**", (route) => route.fulfill({ status: 204 }));
    await page.addInitScript((theme) => localStorage.setItem("theme", theme), theme);
    await page.goto("./docs/getting-started");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const components = page.locator('.docs-sidebar [data-navigation-group="components"]');
    if ((await components.getAttribute("aria-expanded")) === "false") await components.click();
    for (const width of [1200, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      const reading = page.locator(".page-contents-header .sidebar-entry-row").first();
      const left = page.locator(".docs-sidebar .sidebar-entry-row:not([aria-current])").first();
      const styles = async (row: import("@playwright/test").Locator) =>
        row.evaluate((node) => {
          const css = getComputedStyle(node);
          const title = getComputedStyle(node.querySelector(".sidebar-entry-title")!);
          const caption = getComputedStyle(node.querySelector(".sidebar-entry-caption")!);
          const action = getComputedStyle(node.querySelector(".sidebar-entry-action")!);
          return {
            height: node.getBoundingClientRect().height,
            padding: css.padding,
            radius: css.borderRadius,
            background: css.backgroundColor,
            layers: css.backgroundImage,
            titleSize: title.fontSize,
            titleWeight: title.fontWeight,
            titleColor: title.color,
            captionSize: caption.fontSize,
            captionColor: caption.color,
            actionSize: action.width,
            actionColor: action.color,
            actionBackground: action.backgroundColor,
          };
        });
      expect(await styles(reading)).toEqual(await styles(left));
      await expect(reading.locator(".page-contents-count")).not.toContainText("Page");
      const colorDistance = await page
        .locator(".docs-rightbar .page-contents-list")
        .first()
        .evaluate((list) => {
          const context = document.createElement("canvas").getContext("2d")!;
          const rgb = (color: string) => {
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
          };
          const background = rgb(
            getComputedStyle(document.documentElement).getPropertyValue("--background"),
          );
          const normal = document.querySelector(
            ".docs-sidebar .site-navigation-link:not([aria-current]):not(.site-navigation-link-overview)",
          )!;
          const base = rgb(getComputedStyle(normal).color);
          const seen = new Map<string, Element>();
          for (const item of list.querySelectorAll<HTMLAnchorElement>("a[data-contents-depth]"))
            if (!seen.has(item.dataset.contentsDepth!)) seen.set(item.dataset.contentsDepth!, item);
          const colors = [...seen.entries()]
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([, item]) => rgb(getComputedStyle(item).color));
          return {
            base,
            first: colors[0],
            distances: colors.map((color) =>
              Math.hypot(...color.map((value, index) => value - background[index])),
            ),
          };
        });
      expect(colorDistance.first).toEqual(colorDistance.base);
      expect(colorDistance.distances.length).toBeGreaterThanOrEqual(3);
      for (let depth = 1; depth < colorDistance.distances.length; depth++)
        expect(colorDistance.distances[depth]).toBeLessThan(colorDistance.distances[depth - 1]);
    }
  });
}
