import { expect, type Page, test } from "@playwright/test";

/** Block remote sites before opening a reference: every reading must come from local assets. */
async function savedReferencePage(page: Page, scheme: "light" | "dark", width: number) {
  await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
  await page.addInitScript((scheme) => localStorage.setItem("theme", scheme), scheme);
  const remoteRequests: string[] = [];
  let record = false;
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(test.info().project.use.baseURL!).origin) {
      if (record) remoteRequests.push(url.href);
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("/docs/getting-started");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  record = true;
  return remoteRequests;
}

async function addReferences(page: Page, labels: string[]) {
  await page.evaluate((labels) => {
    const fixture = document.createElement("p");
    fixture.id = "saved-reference-fixture";
    for (const label of labels) {
      const code = document.createElement("code");
      code.textContent = label;
      fixture.append(code, document.createTextNode(" "));
    }
    document.querySelector("main")!.prepend(fixture);
  }, labels);
}

async function openReference(page: Page, label: string, kind: string) {
  const term = page
    .locator("#saved-reference-fixture code")
    .filter({ hasText: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) });
  await expect(term).toHaveAttribute("data-code-module");
  await term.scrollIntoViewIfNeeded();
  await page.keyboard.press("Tab");
  await term.focus();
  const card = page.getByRole("dialog", { name: `${label} reference`, exact: true });
  await expect(card.locator(`[data-reference-kind="${kind}"]`)).toBeVisible();
  return { card, term };
}

const technologyChapters = {
  "Tailwind CSS v4": ["Install with Vite", "Connect plugin & CSS", "Run & style"],
  Vite: ["CLI workflow", "Adding a plugin", "Environments configuration"],
  Valibot: ["Install from npm", "Basic concept", "A login schema"],
};

const packageReferences = [
  ["@kamod-ch/ui", "kamod-ui", "Installation"],
  ["@kamod-ch/hooks", "kamod-hooks", "Installation and imports"],
  ["@kamod-ch/preactpress", "preactpress", "Create and check a site"],
  ["@kamod-ch/signals", "kamod-signals", "Install and persist a value"],
  ["@kamod-ch/icons", "kamod-icons", "Install and draw an icon"],
] as const;

for (const [scheme, width] of [
  ["light", 1440],
  ["dark", 320],
] as const) {
  test(`saved technology guides open without contacting their websites (${scheme}, ${width}px)`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const remoteRequests = await savedReferencePage(page, scheme, width);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await addReferences(page, Object.keys(technologyChapters));
    for (const [label, titles] of Object.entries(technologyChapters)) {
      const { card, term } = await openReference(page, label, "technology");
      const chapters = card.locator(".code-reference-help-section");
      await expect(chapters).toHaveCount(titles.length);
      for (let index = 0; index < titles.length; index++) {
        await expect(chapters.nth(index).locator(".code-reference-help-section-title")).toHaveText(
          titles[index],
        );
        await expect(chapters.nth(index).locator("pre code").first()).not.toBeEmpty();
        await expect(
          chapters.nth(index).locator(".code-reference-help-section-source"),
        ).toHaveAttribute("href", /^https:\/\//);
      }
      await expect(card.locator(".code-reference-help-facts")).toHaveCount(0);
      await expect(card).not.toContainText("Source collaboration");
      const resources = card.locator(".code-reference-help-related");
      if (label === "Tailwind CSS v4") {
        await expect(
          resources.locator('a[href="https://tailwindcss.com/docs/installation/using-vite"]'),
        ).toHaveCount(1);
        await expect(
          resources.locator('a[href="https://tailwindcss.com/docs/installation/tailwind-cli"]'),
        ).toHaveCount(1);
      } else if (label === "Vite") {
        await expect(resources.locator('a[href="https://vite.dev/guide/cli"]')).toHaveCount(1);
        await expect(resources.locator('a[href="https://vite.dev/config/"]')).toHaveCount(1);
      } else await expect(resources.locator('a[href="https://valibot.dev/api/"]')).toHaveCount(1);
      expect(await card.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      await page.keyboard.press("Escape");
      await expect(term).toBeFocused();
      await expect(card).toHaveCount(0);
    }
    expect(remoteRequests).toEqual([]);
    expect(errors).toEqual([]);
    await expect(page).toHaveURL(/\/docs\/getting-started\/?$/);
  });

  test(`saved package READMEs and subpaths share their root reference offline (${scheme}, ${width}px)`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    const remoteRequests = await savedReferencePage(page, scheme, width);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const subpaths = ["@kamod-ch/ui/theme.css", "@kamod-ch/icons/tabler/outline"];
    await addReferences(page, [...packageReferences.map(([name]) => name), ...subpaths]);
    const rootDestinations = new Map<string, string>();
    for (const [name, repository, firstChapter] of packageReferences) {
      const { card, term } = await openReference(page, name, "package");
      const destination = `https://github.com/kamod-ch/${repository}`;
      rootDestinations.set(name, destination);
      await expect(
        card.locator(".code-reference-help-ready .code-reference-help-title code"),
      ).toHaveText(name);
      await expect(card.locator(".code-reference-help-primary-link")).toHaveAttribute(
        "href",
        destination,
      );
      const chapters = card.locator(".code-reference-help-section");
      await expect(chapters).toHaveCount(3);
      await expect(chapters.first().locator(".code-reference-help-section-title")).toHaveText(
        firstChapter,
      );
      expect(await card.locator("pre code").count()).toBeGreaterThanOrEqual(2);
      await expect(card.getByRole("note", { name: "Package subpath" })).toHaveCount(0);
      expect(await card.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      await page.keyboard.press("Escape");
      await expect(term).toBeFocused();
      await expect(card).toHaveCount(0);
    }
    for (const label of subpaths) {
      const { card, term } = await openReference(page, label, "package");
      const root = label.split("/").slice(0, 2).join("/");
      await expect(
        card.locator(".code-reference-help-ready .code-reference-help-title code"),
      ).toHaveText(root);
      await expect(card.locator(".code-reference-help-primary-link")).toHaveAttribute(
        "href",
        rootDestinations.get(root)!,
      );
      const notice = card.getByRole("note", { name: "Package subpath" });
      await expect(notice).toBeAttached();
      await expect(notice).toContainText(label);
      await expect(notice.getByRole("link")).toHaveAttribute(
        "href",
        /^https:\/\/github\.com\/kamod-ch\//,
      );
      await expect(card.locator(".code-reference-help-section")).toHaveCount(3);
      await page.keyboard.press("Escape");
      await expect(term).toBeFocused();
      await expect(card).toHaveCount(0);
    }
    expect(remoteRequests).toEqual([]);
    expect(errors).toEqual([]);
    await expect(page).toHaveURL(/\/docs\/getting-started\/?$/);
  });
}
