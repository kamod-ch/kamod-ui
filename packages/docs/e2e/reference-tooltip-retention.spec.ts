import { expect, type Page, test } from "@playwright/test";

async function openSidebarReference(page: Page) {
  await page.goto("/docs/getting-started");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await page.evaluate(() => {
    const fixture = document.createElement("p");
    fixture.id = "reference-retention-fixture";
    fixture.innerHTML = "<code>Sidebar</code>";
    document.querySelector("main")!.prepend(fixture);
  });
  const term = page.locator("#reference-retention-fixture code");
  await expect(term).toHaveAttribute("data-code-module");
  await term.scrollIntoViewIfNeeded();
  await term.hover();
  const card = page.getByRole("dialog", { name: "Sidebar reference", exact: true });
  await expect(card.locator('[data-reference-kind="component"]')).toBeVisible();
  return card;
}

test("wheel scrolling at a reference card's lower edge does not scroll or dismiss the page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 568 });
  const card = await openSidebarReference(page);
  // Exercise the scroll boundary even when the source contract becomes shorter.
  await card.evaluate((node) => {
    node.style.maxHeight = "180px";
    node.scrollTop = node.scrollHeight;
  });
  await expect(card).toHaveCSS("overscroll-behavior", "contain");
  expect(await card.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await card.hover({ position: { x: 30, y: 30 } });
  const pageTop = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 1200);
  await page.mouse.wheel(0, 1200);
  // Outlast departure grace: a chained page scroll used to close the card immediately.
  await page.waitForTimeout(450);
  await expect(card).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(pageTop);
  const atEnd = await card.evaluate(
    (node) => node.scrollHeight - node.scrollTop - node.clientHeight < 1,
  );
  expect(atEnd).toBe(true);
  await page.keyboard.press("Escape");
  await expect(card).toHaveCount(0);
});

test("briefly leaving an open reference allows reentry, while a complete departure closes it", async ({
  page,
}) => {
  const card = await openSidebarReference(page);
  await card.hover({ position: { x: 30, y: 30 } });
  await page.mouse.move(1, 1);
  await page.waitForTimeout(180);
  await expect(card).toBeVisible();
  await card.hover({ position: { x: 30, y: 30 } });
  await page.waitForTimeout(450);
  await expect(card).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(card).toHaveCount(0);
});
