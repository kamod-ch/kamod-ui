import { expect, test } from "@playwright/test";

test("scrolling does not write browser history on every frame", async ({ page }) => {
  await page.addInitScript(() => {
    const original = history.replaceState;
    let writes = 0;
    history.replaceState = function (...args) {
      if (args[0] && "ppScrollY" in args[0]) writes++;
      return original.apply(this, args);
    };
    Object.defineProperty(window, "scrollHistoryWrites", { get: () => writes });
  });
  await page.goto("./docs/getting-started");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await expect(page.locator(".docs-topbar")).toHaveCSS("backdrop-filter", "none");
  const writes = await page.evaluate(async () => {
    const count = () => Reflect.get(window, "scrollHistoryWrites") as number;
    const before = count();
    await new Promise<void>((resolve) => {
      let frames = 0;
      const scroll = () => {
        window.scrollBy(0, 45);
        if (++frames < 30) requestAnimationFrame(scroll);
        else resolve();
      };
      requestAnimationFrame(scroll);
    });
    return count() - before;
  });
  // Assert bounded work, not an FPS threshold that depends on the CI machine.
  expect(writes).toBeLessThan(10);
  await expect
    .poll(() => page.evaluate(() => history.state?.ppScrollY))
    .toBe(await page.evaluate(() => window.scrollY));
});

test("API definitions load for the selected article through client navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./docs/accordion/installation");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await expect(page.locator("#api-reference")).toBeAttached();
  await expect(page.locator('[id$="-AccordionProps"]')).toBeAttached();

  const destination = new URL("./docs/button/installation", page.url().replace(/docs\/.*$/, ""));
  await page.evaluate((href) => {
    const link = document.createElement("a");
    link.href = href;
    document.body.append(link);
    link.click();
    link.remove();
  }, destination.href);
  await expect(page.getByRole("heading", { level: 1, name: "Button", exact: true })).toBeVisible();
  await expect(page.locator('[id$="-ButtonProps"]')).toBeAttached();
  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "Accordion", exact: true }),
  ).toBeVisible();
  await expect(page.locator('[id$="-AccordionProps"]')).toBeAttached();
  expect(errors).toEqual([]);
});

test("immediate Back and Forward preserve the latest scroll without a pending history write", async ({
  page,
}) => {
  await page.goto("./docs/button/installation");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    window.dispatchEvent(new Event("wheel"));
    window.scrollTo(0, 540);
  });
  await expect.poll(() => page.evaluate(() => history.state?.ppScrollY)).toBe(540);
  await page.evaluate(() => {
    const link = document.createElement("a");
    link.href = location.href.replace("/button/", "/accordion/");
    document.body.append(link);
    link.click();
    link.remove();
  });
  await expect(
    page.getByRole("heading", { level: 1, name: "Accordion", exact: true }),
  ).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    window.dispatchEvent(new Event("wheel"));
    window.scrollTo(0, 700);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    history.back();
  });
  await expect(page.getByRole("heading", { level: 1, name: "Button", exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(540);
  await page.goForward();
  await expect(
    page.getByRole("heading", { level: 1, name: "Accordion", exact: true }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(700);
});
