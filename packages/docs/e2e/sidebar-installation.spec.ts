import { expect, test } from "@playwright/test";
import { strFromU8, unzipSync } from "fflate";

for (const theme of ["light", "dark"]) {
  test(`sidebar installation fits narrow screens and offers an accessible destination tree (${theme})`, async ({
    page,
  }) => {
    await page.addInitScript((mode) => localStorage.setItem("theme", mode), theme);
    await page.goto("./blocks/sidebar/sidebar-05#sidebar-05-copy");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    // The page shell is ready before the lazy block guide attaches its keyboard handlers.
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "View included files" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const tree = page.locator(".blocks-install-files");
    await expect(tree).toContainText("sidebar-05/");
    await expect(tree).toContainText("index.ts");
    await expect(tree).not.toContainText("SidebarBlockShell");
    for (const width of [320, 640, 768, 980, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      expect(await tree.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      await expect(page.getByRole("link", { name: "Download block", exact: true })).toBeVisible();
      await trigger.locator("code").click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      // Padding belongs to the same trigger, not just its label and chevron.
      await trigger.click({ position: { x: 4, y: 4 } });
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    }
    await expect(trigger.locator("button, a, [role='button']")).toHaveCount(0);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
}

test("every sidebar download and source-viewer asset has identical installable contents", async ({
  page,
  request,
}) => {
  for (let number = 1; number <= 16; number++) {
    const id = `sidebar-${String(number).padStart(2, "0")}`;
    const zip = await request.get(`./blocks/downloads/${id}.zip`);
    expect(zip.ok()).toBe(true);
    const archive = unzipSync(new Uint8Array(await zip.body()));
    const response = await request.get(`./blocks/downloads/${id}.json`);
    expect(response.ok()).toBe(true);
    const sources = await response.json();
    expect(Object.keys(archive).length).toBe(Object.keys(sources).length);
    for (const [path, bytes] of Object.entries(archive))
      expect(strFromU8(bytes)).toBe(sources[path.slice(id.length + 1)]);
  }
  await page.goto("./blocks/sidebar/sidebar-05#sidebar-05-copy");
  await page.waitForLoadState("networkidle");
  const event = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download block", exact: true }).click();
  const download = await event;
  expect(download.suggestedFilename()).toBe("sidebar-05.zip");
  expect(await download.failure()).toBeNull();
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(page.locator("#sidebar-05 .blocks-showcase-import")).toContainText(
    "src/components/blocks/sidebar-05",
  );
  await expect(page.locator("#sidebar-05 pre").first()).toContainText("export const Sidebar05");
});

test("manual-copy link opens Code on first, repeated and direct navigation", async ({ page }) => {
  await page.goto("./blocks/sidebar/sidebar-05#sidebar-05-copy");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  const link = page.getByRole("link", { name: "Open the Showcase’s Code tab", exact: true });
  const showcase = page.locator("#sidebar-05");
  const code = showcase.getByRole("tab", { name: "Code", exact: true });
  const preview = showcase.getByRole("tab", { name: "Preview", exact: true });

  await link.click();
  await expect(page).toHaveURL(/#sidebar-05-code$/);
  await expect(code).toHaveAttribute("aria-selected", "true");
  await expect(code).toBeInViewport();
  await expect(showcase.locator("pre").first()).toContainText("export const Sidebar05");

  // The URL is unchanged by the tab controls, so repeated activation needs to work too.
  await preview.click();
  await expect(preview).toHaveAttribute("aria-selected", "true");
  await link.press("Enter");
  await expect(code).toHaveAttribute("aria-selected", "true");
  await expect(code).toBeInViewport();

  await page.reload();
  await expect(code).toHaveAttribute("aria-selected", "true");
  await expect(code).toBeInViewport();
  await expect(showcase.locator("pre").first()).toContainText("export const Sidebar05");
});

test("included-file links select the exact source and survive repeat activation and reload", async ({
  page,
  request,
}) => {
  const response = await request.get("./blocks/downloads/sidebar-05.json");
  expect(response.ok()).toBe(true);
  const sources: Record<string, string> = await response.json();
  await page.goto("./blocks/sidebar/sidebar-05#sidebar-05-copy");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("html")).toHaveClass(/pp-ready/);
  await page.getByRole("button", { name: "View included files" }).click();
  const inventory = page.locator(".blocks-install-inventory");
  const showcase = page.locator("#sidebar-05");
  const code = showcase.getByRole("tab", { name: "Code", exact: true });
  await expect(inventory.getByRole("link")).toHaveCount(Object.keys(sources).length);

  for (const [file, source] of Object.entries(sources)) {
    await inventory.getByRole("link", { name: `View ${file} source`, exact: true }).click();
    await expect(code).toHaveAttribute("aria-selected", "true");
    await expect(code).toBeInViewport();
    await expect(showcase.locator('.blocks-file-tree-btn[aria-pressed="true"]')).toHaveText(
      file.split("/").at(-1)!,
    );
    await expect(showcase.locator("pre").first()).toHaveText(source);
  }

  const file = "components/nav-main.tsx";
  const link = inventory.getByRole("link", { name: `View ${file} source`, exact: true });
  await link.click();
  await expect(page).toHaveURL(/#sidebar-05-code\/components%2Fnav-main\.tsx$/);
  await showcase.getByRole("button", { name: "index.ts", exact: true }).click();
  await showcase.getByRole("tab", { name: "Preview", exact: true }).click();
  await link.press("Enter");
  await expect(code).toHaveAttribute("aria-selected", "true");
  await expect(showcase.locator("pre").first()).toHaveText(sources[file]);

  await page.reload();
  await expect(code).toHaveAttribute("aria-selected", "true");
  await expect(code).toBeInViewport();
  await expect(showcase.locator("pre").first()).toHaveText(sources[file]);
});
