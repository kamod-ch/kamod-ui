import { expect, test } from "@playwright/test";
import { applicationShellBlockMetadata } from "../../blocks/src/application-shell/metadata";
import { assertNoBlockingA11yViolations } from "./a11y-utils";

const profiles = [
  { number: 2, title: "Projects", name: "Inset Workspace", action: "New project" },
  { number: 3, title: "Deployments", name: "Compact Navigation Rail", action: "Stage release" },
  { number: 4, title: "Team", name: "Horizontal Workspace", action: "Add member" },
  { number: 5, title: "Inbox", name: "Right-Hand Navigation", action: "New request" },
  { number: 6, title: "Documents", name: "Split Workspace with Inspector", action: "Save draft" },
  { number: 7, title: "Project overview", name: "Sectioned Workspace", action: "Add milestone" },
  {
    number: 8,
    title: "Workspace settings",
    name: "Persistent Action Workspace",
    action: "Save settings",
  },
];
for (const profile of profiles) {
  const route = `/blocks/application-shell/application-shell-${profile.number}`;
  test(`Shell ${profile.number}: complete detail, source and guide`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(profile.name);
    for (const id of ["installation", "usage", "props", "about", "production", "reference"])
      await expect(page.locator(`#application-shell-${id}`)).toBeAttached();
    await page.getByRole("tab", { name: "Code", exact: true }).click();
    await expect(page.locator(".blocks-code-layout")).toContainText(
      `ApplicationShell${profile.number}`,
    );
    const count = applicationShellBlockMetadata.find(
      (block) => block.id === `application-shell-${profile.number}`,
    )!.files.length;
    await expect(page.locator(".blocks-code-layout")).toContainText(
      new RegExp(`${count}\\s*files`),
    );
    await expect(page.locator(".blocks-code-layout")).not.toContainText("Could not load");
    await page.getByRole("tab", { name: "Prompt", exact: true }).click();
    await expect(page.getByRole("tabpanel", { name: "Prompt", exact: true })).toContainText(
      `application-shell-${profile.number}`,
    );
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const dark of [false, true]) {
        await page.evaluate(
          (dark) => document.documentElement.classList.toggle("dark", dark),
          dark,
        );
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true);
      }
    }
    expect(errors).toEqual([]);
  });
  test(`Shell ${profile.number}: responsive themes and local interactions`, async ({ page }) => {
    await page.goto(`${route}/preview`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const dark of [false, true]) {
        await page.evaluate(
          (dark) => document.documentElement.classList.toggle("dark", dark),
          dark,
        );
        await expect(page.getByRole("heading", { level: 1, name: profile.title })).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${width}px ${dark ? "dark" : "light"}`,
        ).toBe(true);
      }
    }
    if (profile.number === 8) {
      const name = page.getByRole("textbox", { name: "Workspace name" });
      await name.fill("");
      await page.getByRole("button", { name: "Save settings" }).click();
      await expect(name).toBeFocused();
      await expect(page.getByRole("status")).not.toContainText("Saved in this preview");
      await name.fill("Research workspace");
      await page.getByRole("button", { name: "Save settings" }).click();
      await expect(page.getByRole("status")).toContainText("Saved in this preview only.");
      await name.fill("Temporary edit");
      await page.getByRole("button", { name: "Discard changes" }).click();
      await expect(name).toHaveValue("Research workspace");
      await expect(page.getByRole("button", { name: "Save settings" })).toBeDisabled();
      await page.setViewportSize({ width: 320, height: 800 });
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const footer = page.locator('footer[aria-label="Page actions"]');
      await expect(footer).toBeInViewport();
      const finalNote = await page
        .getByText("Try changing a value, saving it, and making another edit.", { exact: false })
        .boundingBox();
      expect(finalNote!.y + finalNote!.height).toBeLessThanOrEqual(
        (await footer.boundingBox())!.y + 1,
      );
      await page.setViewportSize({ width: 1440, height: 900 });
    } else {
      const search = page.getByRole("textbox", { name: `Find ${profile.title.toLowerCase()}` });
      await search.fill("no-such-record");
      await expect(
        page.getByText("No matches. Try another name or clear your search."),
      ).toBeVisible();
      await search.fill("");
      await page.getByRole("button", { name: profile.action, exact: true }).click();
      await expect(page.getByRole("status")).toContainText("in this preview only.");
    }
    if (profile.number === 7) {
      const sections = page.getByRole("navigation", { name: "Project sections" });
      await sections.getByRole("link", { name: "Activity", exact: true }).click();
      await expect(page.getByRole("heading", { level: 1, name: "Activity" })).toBeVisible();
      await expect(sections.getByRole("link", { name: "Activity", exact: true })).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
    if (profile.number === 6) {
      const toggle = page.getByRole("button", { name: "Document details", exact: true });
      await toggle.click();
      await expect(page.getByRole("complementary", { name: "Document details" })).toHaveCount(0);
      await toggle.click();
      await expect(page.getByRole("complementary", { name: "Document details" })).toBeVisible();
    }
    await page.screenshot({
      path: `/tmp/application-shell-${profile.number}-desktop.png`,
      fullPage: true,
    });
    await assertNoBlockingA11yViolations(page, `Shell ${profile.number} desktop`);
    const account = page.getByRole("button", { name: "Open account menu for Alex Morgan" });
    await account.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menuitem", { name: "Account", exact: true })).toBeFocused();
    await expect(page.getByRole("menuitem", { name: /^Log out$/i })).toBeInViewport();
    await page.keyboard.press("Escape");
    await expect(account).toBeFocused();
    if (profile.number === 3) {
      const library = page.getByRole("button", { name: "Library", exact: true });
      await library.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("menuitem", { name: "Recent", exact: true })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(library).toBeFocused();
    }
  });
  test(`Shell ${profile.number}: mobile navigation, nested links and focus return`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`${route}/preview`);
    await expect(page.locator("html")).toHaveClass(/pp-ready/);
    const trigger = page.getByRole("button", { name: "Toggle Sidebar", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Sidebar", exact: true });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("button", { name: "Library", exact: true }).click();
    await dialog.getByRole("link", { name: "Recent", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: profile.number === 8 ? "Workspace settings" : "Recent",
      }),
    ).toBeVisible();
    await trigger.click();
    await dialog.getByRole("button", { name: "Open account menu for Alex Morgan" }).click();
    await page.getByRole("menuitem", { name: /^Log out$/i }).click();
    await expect(page.getByRole("status")).toContainText(
      profile.number === 8 ? "logout selected." : "Sign out selected.",
    );
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.screenshot({
      path: `/tmp/application-shell-${profile.number}-mobile.png`,
      fullPage: true,
    });
  });
}
