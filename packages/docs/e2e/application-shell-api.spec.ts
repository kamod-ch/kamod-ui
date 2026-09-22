import { expect, type Page, test } from "@playwright/test";

const detail = "./blocks/application-shell/application-shell-1";

const typePanel = (page: Page, name: string) => {
  const id = `application-shell-type-${name}`;
  const content = page.locator(`#${id}-content`);
  return {
    id,
    heading: page.locator(`#${id}`),
    trigger: page.locator(`#${id}-trigger`),
    content,
    code: content.locator("pre code"),
  };
};

const expectTypeTarget = async (page: Page, name: string, expectFocus = true) => {
  const panel = typePanel(page, name);
  await expect(page).toHaveURL(new RegExp(`#${panel.id}$`));
  await expect(panel.trigger).toHaveAttribute("aria-expanded", "true");
  if (expectFocus) await expect(panel.heading).toBeFocused();
  await expect(panel.heading).toBeVisible();
  await expect(panel.heading).toBeInViewport();
  const topbar = await page.locator(".docs-topbar").boundingBox();
  const heading = await panel.heading.boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(topbar!.y + topbar!.height);
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  page.on("pageerror", (error) => {
    throw error;
  });
});

test("prop type links reveal their definition and restore deep links through history", async ({
  page,
}) => {
  await page.goto(detail);
  const table = page.locator(".blocks-api-props-table");
  await expect(table.getByRole("columnheader")).toHaveText(["Prop / type", "Description"]);
  await expect(
    table
      .locator("th[scope='row']")
      .filter({ has: page.getByRole("button", { name: /^Required prop:/ }) })
      .locator("code"),
  ).toHaveText(["brand", "navigationGroups", "user", "breadcrumbs"]);
  const required = table.getByRole("button", { name: "Required prop: brand", exact: true });
  await required.hover();
  await expect(page.getByRole("tooltip")).toHaveText("Required prop: brand");
  await required.focus();
  await expect(required).toHaveAccessibleDescription("Required prop: brand");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("tooltip")).toHaveText("Required prop: brand");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  const dataTypes = page.locator("section[aria-labelledby='application-shell-data-types']");
  await expect(
    dataTypes.locator(".blocks-api-type-intro").getByRole("button", { name: /^Required Fields?:/ }),
  ).toHaveCount(6);
  await expect(
    dataTypes.locator(".blocks-api-type-heading").getByRole("button", { name: /^Required type:/ }),
  ).toHaveCount(4);
  for (const [type, prop] of [
    ["ApplicationShellBrand", "brand"],
    ["ApplicationShellUser", "user"],
    ["ApplicationShellNavigationGroup", "navigationGroups"],
    ["ApplicationShellDestination", "breadcrumbs"],
  ]) {
    const card = dataTypes.locator(".blocks-api-type").filter({
      has: page.locator(`#application-shell-type-${type}`),
    });
    const heading = card.locator(".blocks-api-type-heading");
    await expect(heading.locator(".blocks-api-type-required")).toHaveText("Required type");
    const marker = heading.getByRole("button", { name: `Required type: ${type}`, exact: true });
    await marker.focus();
    await expect(page.getByRole("tooltip")).toHaveText(`Used by required prop: ${prop}`);
    await expect(marker).toHaveAccessibleDescription(`Used by required prop: ${prop}`);
    await page.keyboard.press("Escape");
  }
  const inherited = dataTypes
    .locator(".blocks-api-type")
    .filter({
      has: page.getByRole("heading", { name: "Top-level items and branches", exact: true }),
    })
    .locator(".blocks-api-type-intro");
  await expect(inherited.locator(".blocks-api-type-fields code")).toHaveText(["id", "label"]);
  await expect(inherited.locator(".blocks-api-type-field-list")).toHaveText(/id,\s*label/);
  const fields = inherited.getByRole("button", { name: "Required Fields: id, label", exact: true });
  await fields.focus();
  await expect(page.getByRole("tooltip")).toHaveText("Required Fields");
  await expect(fields).toHaveAccessibleDescription("Required Fields");
  await page.keyboard.press("Escape");
  const singleField = dataTypes
    .locator(".blocks-api-type-intro")
    .getByRole("button", { name: "Required Field: name", exact: true });
  await singleField.focus();
  await expect(page.getByRole("tooltip")).toHaveText("Required Field");
  await expect(singleField).toHaveAccessibleDescription("Required Field");
  await page.keyboard.press("Escape");
  const icons = dataTypes.locator(".blocks-api-type").filter({
    has: page.getByRole("heading", { name: "Navigation icons", exact: true }),
  });
  await expect(icons.getByRole("button", { name: /^Required Fields?:/ })).toHaveCount(0);
  const brand = typePanel(page, "ApplicationShellBrand");
  const user = typePanel(page, "ApplicationShellUser");
  await expect(brand.trigger).toHaveAttribute("aria-expanded", "false");

  await table.getByRole("link", { name: "ApplicationShellBrand", exact: true }).click();
  await expectTypeTarget(page, "ApplicationShellBrand");
  await expect(brand.code).toContainText("export type ApplicationShellBrand =");

  await table.getByRole("link", { name: "ApplicationShellUser", exact: true }).click();
  await expectTypeTarget(page, "ApplicationShellUser");
  await expect(brand.content).toBeVisible();

  // Returning to an earlier fragment must reopen it after a manual collapse.
  await brand.trigger.click();
  await expect(brand.content).toBeHidden();
  await page.goBack();
  await expectTypeTarget(page, "ApplicationShellBrand");
  await expect(user.content).toBeVisible();
  await page.goForward();
  await expectTypeTarget(page, "ApplicationShellUser");
  await page.reload();
  // Initial document loading restores the anchor without taking keyboard focus.
  await expectTypeTarget(page, "ApplicationShellUser", false);
});

test("type definitions toggle independently by keyboard and copy their complete source", async ({
  page,
  context,
  browserName,
}) => {
  await page.goto(detail);
  const brand = typePanel(page, "ApplicationShellBrand");
  const user = typePanel(page, "ApplicationShellUser");
  await expect(brand.trigger).toHaveAccessibleName(
    "Show ApplicationShellBrand definition and field documentation",
  );
  await brand.trigger.focus();
  await page.keyboard.press("Enter");
  await expect(brand.trigger).toHaveAttribute("aria-expanded", "true");
  await expect(brand.trigger).toHaveAccessibleName(
    "Hide ApplicationShellBrand definition and field documentation",
  );
  await page.keyboard.press("Tab");
  const requiredField = brand.content.getByRole("button", {
    name: "Required Field: name",
    exact: true,
  });
  await expect(requiredField).toBeFocused();
  await expect(requiredField).toHaveAccessibleDescription("Required Field");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Tab");
  const copy = brand.content.getByRole("button", { name: "Copy code", exact: true });
  await expect(copy).toBeFocused();

  if (browserName === "chromium") {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const source = await brand.code.textContent();
    await page.keyboard.press("Enter");
    await expect(brand.content.getByRole("button", { name: "Code copied" })).toBeFocused();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  }

  await page.keyboard.press("Tab");
  await expect(brand.content.locator("pre")).toBeFocused();
  await user.trigger.focus();
  await page.keyboard.press("Space");
  await expect(user.trigger).toHaveAttribute("aria-expanded", "true");
  await expect(brand.content).toBeVisible();

  await brand.trigger.focus();
  await page.keyboard.press("Space");
  await expect(brand.content).toBeHidden();
  await page.keyboard.press("Tab");
  // Hidden code and its Copy control must not remain in the keyboard order.
  await expect(user.heading.getByRole("link")).toBeFocused();
  await expect(user.content).toBeVisible();

  const signature = typePanel(page, "ApplicationShell1Props");
  await signature.trigger.click();
  await expect(signature.trigger).toHaveAccessibleName("Hide ApplicationShell1Props definition");
  const signatureSource = await signature.code.textContent();
  expect(signatureSource).toMatch(/^export type ApplicationShell1Props = \{/);
  expect(signatureSource).not.toMatch(/\/\*|\*\/|\/\//);
  expect(signatureSource).toContain(
    "navigationGroups: readonly ApplicationShellNavigationGroup[];",
  );
  expect(signatureSource).toContain("onUserAction?: (action: ApplicationShellUserAction) => void;");
  if (browserName === "chromium") {
    await signature.content.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(signatureSource);
  }
});

test("expanded type documentation keeps overflow inside code and tables at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`${detail}#application-shell-type-ApplicationShell1Props`);
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await page.evaluate((mode) => localStorage.setItem("theme", mode), theme);
    await page.reload();
    await expectTypeTarget(page, "ApplicationShell1Props", false);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")))
      .toBe(theme === "dark");

    const closedTypes = page.getByRole("button", {
      name: /^Show ApplicationShell.* definition(?: and field documentation)?$/,
    });
    while ((await closedTypes.count()) > 0) await closedTypes.first().click();

    const cards = page.locator(".blocks-api-type");
    await expect(cards).toHaveCount(10);
    expect(
      await cards.evaluateAll((elements) =>
        elements.every((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.left >= 0 && bounds.right <= window.innerWidth;
        }),
      ),
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      320,
    );

    const signature = typePanel(page, "ApplicationShell1Props").content.locator("pre");
    expect(await signature.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
    await signature.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => signature.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);

    const table = page.locator(".blocks-api-props-table");
    expect(await table.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
    await table.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => table.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  }
});
