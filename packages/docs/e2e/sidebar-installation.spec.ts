import { expect, test } from "@playwright/test";
import { strFromU8, unzipSync } from "fflate";

for (const theme of ["light", "dark"]) {
  test(`sidebar installation fits narrow screens and offers an accessible destination tree (${theme})`, async ({
    page,
  }) => {
    await page.addInitScript((mode) => localStorage.setItem("theme", mode), theme);
    await page.goto("./blocks/sidebar/sidebar-05#sidebar-05-copy");
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
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
    }
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
  const event = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download block", exact: true }).click();
  const download = await event;
  expect(download.suggestedFilename()).toBe("sidebar-05.zip");
  expect(await download.failure()).toBeNull();
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(page.locator("#sidebar-05 .blocks-install")).toContainText(
    "src/components/blocks/sidebar-05",
  );
  await expect(page.locator("#sidebar-05 pre").first()).toContainText("export const Sidebar05");
});
