import { expect, test } from "@playwright/test";

const routes = [
  "",
  "docs/components",
  "docs/code/installation",
  "docs/forms",
  "docs/formisch/installation",
  "docs/packages",
  "docs/hooks-package/installation",
  "docs/theming/installation",
  "blocks/application-shell/application-shell-1",
];

for (const width of [320, 1440]) {
  test(`prose inline code follows its surrounding text with one optical reduction at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      ...routes,
      "docs/cn/installation",
      "docs/getting-started",
      "docs/ecosystem",
    ]) {
      await page.goto(`./${route}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(/pp-ready/);
      const result = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("main code")]
          .filter(
            (code) =>
              !code.closest(
                "pre, h1, h2, h3, h4, h5, h6, .docs-code-name, .code-reference-help, .docs-code-toolbar, .docs-import-label, .docs-code-file-path, .docs-code-explanation, [contenteditable], [data-inline-code-size]",
              ) &&
              // Token inventories and explicit reader sizes keep their own compact labels.
              !getComputedStyle(code).getPropertyValue("--inline-code-prose-font").trim() &&
              code.getClientRects().length > 0,
          )
          .map((code) => ({
            text: code.textContent?.slice(0, 60),
            font: parseFloat(getComputedStyle(code).fontSize),
            parent: parseFloat(getComputedStyle(code.parentElement!).fontSize),
          })),
      );
      expect(result.length, route).toBeGreaterThan(0);
      for (const code of result)
        expect(code.font, `${route}: ${code.text}`).toBeCloseTo(code.parent * 0.94, 2);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
    }
  });
}

test("explicit size choices work in body prose without changing text or destinations", async ({
  page,
}) => {
  await page.goto("./docs/forms", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const code = page.locator(".block-guide-section a.docs-inline-code-link > code").first();
  const text = await code.textContent();
  const href = await code.locator("..").getAttribute("href");
  for (const [size, pixels] of [
    ["compact", "12px"],
    ["regular", "14px"],
  ]) {
    await code.evaluate((node, size) => (node.dataset.inlineCodeSize = size), size);
    await expect(code).toHaveCSS("font-size", pixels);
    await expect(code).toHaveText(text!);
    await expect(code.locator("..")).toHaveAttribute("href", href!);
  }
});

test("plain and detected multiword code move together to the next sentence line", async ({
  page,
}) => {
  await page.goto("./docs/theming/installation", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const results = await page.evaluate(() => {
      const container = document.querySelector(".block-guide-description")!;
      const reference = [...container.querySelectorAll<HTMLAnchorElement>("a")].find(
        (link) => link.textContent?.trim() === "Theme Toggle",
      )!;
      const href = reference.getAttribute("href");
      return ["plain", "detected"].map((kind) => {
        const paragraph = document.createElement("p");
        const prefix = document.createElement("span");
        prefix.textContent = "Continue with";
        const item =
          kind === "detected" ? reference.cloneNode(true) : document.createElement("code");
        if (kind === "plain") item.textContent = "shared value";
        paragraph.append(prefix, " ", item, " in a reusable component.");
        container.append(paragraph);
        const code =
          item instanceof HTMLElement && item.matches("code")
            ? item
            : (item as HTMLElement).querySelector("code")!;
        // Leave enough room for either item, but not for both on the same line.
        paragraph.style.width = `${prefix.getBoundingClientRect().width + code.getBoundingClientRect().width - 8}px`;
        const box = code.getBoundingClientRect();
        const text = document.createRange();
        text.selectNodeContents(code);
        const result = {
          kind,
          nextLine: box.top >= prefix.getBoundingClientRect().bottom,
          startsAtLeft: Math.abs(box.left - paragraph.getBoundingClientRect().left) < 1,
          textLines: new Set(
            [...text.getClientRects()]
              .filter((rect) => rect.width > 0)
              .map((rect) => Math.round(rect.top)),
          ).size,
          href: item instanceof HTMLAnchorElement ? item.getAttribute("href") : null,
          expectedHref: kind === "detected" ? href : null,
        };
        paragraph.remove();
        return result;
      });
    });
    for (const result of results) {
      expect(result.nextLine, `${result.kind} at ${width}px`).toBe(true);
      expect(result.startsAtLeft, `${result.kind} at ${width}px`).toBe(true);
      expect(result.textLines, `${result.kind} at ${width}px`).toBe(1);
      expect(result.href).toBe(result.expectedHref);
    }
  }
});

test("prose highlights stay compact and oversized tokens stay readable without changing source chips", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto("./docs/components", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const result = await page.evaluate(() => {
    const container = document.querySelector(".block-guide-description")!;
    const pairs = [11, 15, 20].map((size) => {
      const paragraph = document.createElement("p");
      paragraph.style.fontSize = `${size}px`;
      const plain = document.createElement("code");
      plain.textContent = "shared value";
      const link = document.createElement("a");
      link.className = "docs-inline-source-reference";
      link.href = "#component-source";
      const linked = plain.cloneNode(true) as HTMLElement;
      link.append(linked);
      paragraph.append(plain, " ", link);
      container.append(paragraph);
      const metrics = [plain, linked].map((code) => {
        const style = getComputedStyle(code);
        return {
          font: parseFloat(style.fontSize),
          line: parseFloat(style.lineHeight),
          block: parseFloat(style.paddingTop),
          inline: parseFloat(style.paddingLeft),
          height: code.getBoundingClientRect().height,
        };
      });
      const surroundingLine = parseFloat(getComputedStyle(paragraph).lineHeight);
      paragraph.remove();
      return { size, metrics, surroundingLine };
    });
    const paragraph = document.createElement("p");
    paragraph.style.width = "240px";
    paragraph.style.maxWidth = "100%";
    const code = document.createElement("code");
    const fullText = "a_very_long_but_still_copyable_code_value_".repeat(12);
    code.textContent = fullText;
    paragraph.append(code);
    container.append(paragraph);
    code.scrollLeft = code.scrollWidth;
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    const longToken = {
      contained: code.getBoundingClientRect().width <= paragraph.getBoundingClientRect().width + 1,
      canScroll: code.scrollLeft > 0,
      copied: selection.toString() === fullText,
      pageFits: document.documentElement.scrollWidth <= innerWidth,
    };
    selection.removeAllRanges();
    paragraph.remove();
    // These standalone package identities keep the roomier source-card treatment.
    const sourceChips = [...document.querySelectorAll<HTMLElement>(".library-source-package")].map(
      (chip) => {
        const style = getComputedStyle(chip);
        const parent = getComputedStyle(chip.parentElement!);
        return {
          font: parseFloat(style.fontSize),
          parentFont: parseFloat(parent.fontSize),
          line: style.lineHeight,
          parentLine: parent.lineHeight,
          block: style.paddingTop,
          inline: style.paddingLeft,
          href: chip.closest("a")?.getAttribute("href"),
          text: chip.textContent,
        };
      },
    );
    return { pairs, longToken, sourceChips };
  });
  for (const {
    size,
    metrics: [plain, linked],
    surroundingLine,
  } of result.pairs) {
    expect(plain.font).toBeCloseTo(size * 0.94, 2);
    expect(linked).toEqual(plain);
    expect(plain.height).toBeLessThanOrEqual(surroundingLine);
  }
  expect(result.longToken).toEqual({
    contained: true,
    canScroll: true,
    copied: true,
    pageFits: true,
  });
  expect(result.sourceChips).toHaveLength(2);
  for (const chip of result.sourceChips) {
    expect(chip.font).toBeCloseTo(chip.parentFont * 0.94, 2);
    expect(parseFloat(chip.line) / chip.font).toBeCloseTo(
      parseFloat(chip.parentLine) / chip.parentFont,
      3,
    );
    expect(chip.block).toBe("0px");
    expect(chip.inline).toBe("3px");
    expect(chip.href).toBe(
      `https://github.com/kamod-ch/${chip.text === "@kamod-ch/ui" ? "kamod-ui" : "kamod-icons"}`,
    );
  }
});
