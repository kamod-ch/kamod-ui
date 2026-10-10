import { expect, test } from "@playwright/test";

test("preview canvases share the page-owned pattern across routes and themes", async ({ page }) => {
  const routes = [
    ["./", ".home-workspace-preview"],
    ["./docs/button/installation", ".component-example-stage"],
    ["./blocks/application-shell/application-shell-1", ".blocks-showcase-preview"],
  ] as const;
  const expected = new Map<string, string>();
  for (const [route, selector] of routes) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const stage = page.locator(selector).first();
    await stage.scrollIntoViewIfNeeded();
    for (const scheme of ["light", "dark"] as const) {
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
        await page.evaluate(
          ({ scheme, preset }) => {
            const root = document.documentElement;
            root.classList.toggle("dark", scheme === "dark");
            root.classList.toggle("light", scheme === "light");
            root.setAttribute("data-theme", preset);
          },
          { scheme, preset },
        );
        const canvas = await stage.evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            image: style.backgroundImage,
            size: style.backgroundSize,
            base: style.backgroundColor,
          };
        });
        expect(canvas.image).toContain("radial-gradient");
        expect(canvas.image).toContain("1.1px");
        expect(canvas.image).toContain("1.25px");
        expect(canvas.size).toContain("16px 16px, 64px 64px, 64px 64px");
        const key = `${scheme}/${preset}`;
        const value = JSON.stringify(canvas);
        if (expected.has(key)) expect(value, `${route} ${key}`).toBe(expected.get(key));
        else expected.set(key, value);
      }
    }
  }
});

test("changing a component preview theme leaves its backdrop on the page theme", async ({
  page,
}) => {
  await page.goto("./docs/button/installation");
  const example = page.locator(".component-example").first();
  await example.scrollIntoViewIfNeeded();
  const stage = example.locator(".component-example-stage");
  const canvas = () => stage.evaluate((node) => getComputedStyle(node).backgroundImage);
  const before = await canvas();
  const preview = example.locator("iframe").contentFrame();
  await expect(preview.locator("html")).toHaveClass(/showcase-embedded-document/);
  await expect(preview.locator("body")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(preview.locator("#component-preview-root")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await example.getByRole("button", { name: "Dark preview", exact: true }).click();
  expect(await canvas()).toBe(before);
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});
