import { expect, test } from "@playwright/test";

const key = "kamod:block-showcase:v1:sidebar/sidebar-05";
const route = "./blocks/sidebar/sidebar-05";

for (const { preset, scheme, saved } of [
  { preset: "sunset", scheme: "light", saved: null },
  { preset: "ocean", scheme: "dark", saved: { viewport: "tablet" } },
] as const) {
  test(`unsaved showcase appearance inherits the page's ${preset}/${scheme} theme`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ key, preset, scheme, saved }) => {
        if (window !== window.top || sessionStorage.getItem("theme-test-seeded")) return;
        localStorage.setItem("theme-preset", preset);
        localStorage.setItem("theme", scheme);
        if (saved) localStorage.setItem(key, JSON.stringify(saved));
        sessionStorage.setItem("theme-test-seeded", "true");
      },
      { key, preset, scheme, saved },
    );
    await page.goto(route);
    const showcase = page.locator(".blocks-showcase");
    const assertAppearance = async () => {
      await expect(page.locator("html")).toHaveAttribute("data-theme", preset);
      await expect(showcase.getByRole("combobox", { name: "Preview color theme" })).toHaveValue(
        preset,
      );
      await expect(showcase.getByRole("button", { name: "Dark preview" })).toHaveAttribute(
        "aria-pressed",
        String(scheme === "dark"),
      );
      const frame = showcase.frameLocator("iframe").locator("html");
      await expect(frame).toHaveAttribute("data-theme", preset);
      if (scheme === "dark") await expect(frame).toHaveClass(/dark/);
      else await expect(frame).not.toHaveClass(/dark/);
    };
    await assertAppearance();
    await showcase.getByRole("button", { name: "Mobile view" }).click();
    expect(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}"), key),
    ).not.toHaveProperty("appearance");
    await page.reload();
    await assertAppearance();
  });
}

test("a saved showcase appearance takes precedence over the page theme", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem("theme-preset", "sunset");
    localStorage.setItem("theme", "light");
    localStorage.setItem(key, JSON.stringify({ appearance: { preset: "ocean", scheme: "dark" } }));
  }, key);
  await page.goto(route);
  const showcase = page.locator(".blocks-showcase");
  await expect(showcase.getByRole("combobox", { name: "Preview color theme" })).toHaveValue(
    "ocean",
  );
  await expect(showcase.getByRole("button", { name: "Dark preview" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(showcase.frameLocator("iframe").locator("html")).toHaveAttribute(
    "data-theme",
    "ocean",
  );
  await expect(showcase.frameLocator("iframe").locator("html")).toHaveClass(/dark/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "sunset");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("showcase selections survive reloads, stay per-block and yield to source links", async ({
  page,
}) => {
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  const showcase = page.locator(".blocks-showcase");
  const siteTheme = await page.evaluate(() => [
    localStorage.getItem("theme"),
    localStorage.getItem("theme-preset"),
  ]);
  await showcase.getByRole("button", { name: "Tablet view" }).click();
  await showcase.getByRole("combobox", { name: "Preview color theme" }).selectOption("ocean");
  const dark = showcase.getByRole("button", { name: "Dark preview", exact: true });
  if ((await dark.getAttribute("aria-pressed")) !== "true") await dark.click();
  await showcase.getByRole("tab", { name: "Preview", exact: true }).focus();
  await page.keyboard.press("End");
  await showcase.getByRole("button", { name: "Adapt block", exact: true }).click();
  await showcase
    .getByRole("group", { name: "Prompt display" })
    .getByRole("button", { name: "Markdown", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").view, key))
    .toBe("prompt");
  await page.reload();
  await expect(showcase.getByRole("tab", { name: "Prompt", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(showcase.getByRole("button", { name: "Adapt block", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    showcase
      .getByRole("group", { name: "Prompt display" })
      .getByRole("button", { name: "Markdown", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(showcase.getByRole("button", { name: "Tablet view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(showcase.getByRole("combobox", { name: "Preview color theme" })).toHaveValue(
    "ocean",
  );
  await expect(dark).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.evaluate(() => [
      localStorage.getItem("theme"),
      localStorage.getItem("theme-preset"),
    ]),
  ).toEqual(siteTheme);
  await showcase.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(showcase.frameLocator("iframe").locator("html")).toHaveAttribute(
    "data-theme",
    "ocean",
  );
  await expect(showcase.frameLocator("iframe").locator("html")).toHaveClass(/dark/);

  await page.goto("./blocks/sidebar/sidebar-06");
  await page.waitForLoadState("networkidle");
  await expect(showcase.getByRole("tab", { name: "Preview", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(showcase.getByRole("button", { name: "Desktop view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").view, key))
    .toBe("prompt");
  await page.goto(`${route}#sidebar-05-code/components%2Fnav-main.tsx`);
  await expect(showcase.getByRole("tab", { name: "Code", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(showcase.locator(".blocks-source-file-heading code")).toContainText(
    "components/nav-main.tsx",
  );
  await page.reload();
  await expect(showcase.locator(".blocks-source-file-heading code")).toContainText(
    "components/nav-main.tsx",
  );
});

test("malformed saved preferences fall back to usable defaults", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "{broken-json"), key);
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  const showcase = page.locator(".blocks-showcase");
  await expect(showcase.getByRole("tab", { name: "Preview", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(showcase.getByRole("button", { name: "Desktop view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await showcase.getByRole("button", { name: "Mobile view" }).click();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).viewport, key))
    .toBe("mobile");
});

test("blocked storage leaves the controls functional in memory", async ({ page }) => {
  await page.addInitScript(() => {
    const getItem = Storage.prototype.getItem;
    const setItem = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) {
      if (key.startsWith("kamod:block-showcase:"))
        throw new DOMException("Blocked", "SecurityError");
      return getItem.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("kamod:block-showcase:"))
        throw new DOMException("Blocked", "QuotaExceededError");
      return setItem.call(this, key, value);
    };
  });
  await page.goto(route);
  await page.waitForLoadState("networkidle");
  const showcase = page.locator(".blocks-showcase");
  await showcase.getByRole("button", { name: "Mobile view" }).click();
  await expect(showcase.getByRole("button", { name: "Mobile view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await showcase.getByRole("tab", { name: "Prompt", exact: true }).click();
  await expect(showcase.getByRole("tab", { name: "Prompt", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
