import { expect, test } from "@playwright/test";

const surfaces = [
  ".site-navigation-group-trigger",
  '.site-navigation-link[aria-current="page"]',
  ".docs-sidebar-ecosystem code",
  ".docs-callout",
];

test("dark highlights strengthen every preset and restore the original light appearance", async ({
  page,
}) => {
  await page.goto("./docs/components");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await page
    .locator("aside.docs-sidebar")
    .getByRole("button", { name: /Kamod Ecosystem/ })
    .click();
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });
  const read = () =>
    page.evaluate(
      (selectors) =>
        selectors.map((selector) => {
          const element = document.querySelector(selector)!;
          const style = getComputedStyle(element);
          return { background: style.backgroundColor, color: style.color };
        }),
      surfaces,
    );
  for (const preset of [
    "kamod",
    "shadcn",
    "ocean",
    "sunset",
    "cursor-warm",
    "voltage",
    "watson",
    "professional",
  ]) {
    await page.evaluate((preset) => {
      const root = document.documentElement;
      root.dataset.theme = preset;
      root.classList.remove("dark");
      root.style.removeProperty("--docs-highlight-boost");
    }, preset);
    const light = await read();
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.documentElement.style.setProperty("--docs-highlight-boost", "0");
    });
    const original = await read();
    await page.evaluate(() =>
      document.documentElement.style.removeProperty("--docs-highlight-boost"),
    );
    // Wait out any existing color transitions; don't sample an intermediate frame.
    await expect
      .poll(async () =>
        (await read()).map((value, index) => value.background !== original[index].background),
      )
      .toEqual(surfaces.map(() => true));
    const enhanced = await read();
    expect(
      enhanced.map(({ color }) => color),
      preset,
    ).toEqual(original.map(({ color }) => color));
    await page.evaluate(() => document.documentElement.classList.remove("dark"));
    await expect.poll(read).toEqual(light);
  }
});

test("opacity utilities retain solid overrides and selected / hover distinctions", async ({
  page,
}) => {
  await page.goto("./docs/components");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await page
    .locator("aside.docs-sidebar")
    .getByRole("button", { name: /Kamod Ecosystem/ })
    .click();
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });
  await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.id = "highlight-probe";
    probe.innerHTML =
      '<div class="bg-primary/10"></div><div class="bg-foreground/[0.02]"></div><div class="bg-primary/10 dark:bg-muted"></div><div class="bg-muted"></div>';
    document.body.append(probe);
  });
  const backgrounds = () =>
    page
      .locator("#highlight-probe > div")
      .evaluateAll((elements) => elements.map((el) => getComputedStyle(el).backgroundColor));
  const light = await backgrounds();
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const dark = await backgrounds();
  expect(dark[0]).toMatch(/\/ 0\.19\)/);
  expect(dark[1]).toMatch(/\/ 0\.0396\)/);
  expect(dark[2]).toBe(dark[3]);
  const selected = page.locator("aside.docs-sidebar .site-navigation-group-trigger[data-current]");
  const resting = await selected.evaluate((el) => getComputedStyle(el).backgroundColor);
  await selected.hover();
  await expect
    .poll(() => selected.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(resting);
  await page.mouse.move(0, 0);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const mobile = page.locator(".site-navigation-panel .site-navigation-close");
  const mobileRest = await mobile.evaluate((el) => getComputedStyle(el).backgroundColor);
  await mobile.hover();
  await expect(mobile).toHaveCSS("background-color", mobileRest);
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  expect(await backgrounds()).toEqual(light);
});
