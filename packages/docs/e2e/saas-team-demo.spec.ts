import { expect, test } from "@playwright/test";

test.describe("SaaS team demo", () => {
  test("overview metrics match seed data", async ({ page }) => {
    await page.goto("./demo/saas-team");
    await expect(page.getByTestId("saas-team-demo")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Overview", level: 1 })).toBeVisible();
    await expect(page.getByText("Team members", { exact: true })).toBeVisible();
    await expect(page.getByText("5", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Pending invites", { exact: true })).toBeVisible();
    await expect(page.getByText("1", { exact: true })).toBeVisible();
  });

  test("search, invite, and reset on team view", async ({ page }) => {
    await page.goto("./demo/saas-team#team");
    await page.getByTestId("saas-team-search").fill("taylor");
    await expect(page.getByTestId("saas-team-table").getByRole("row")).toHaveCount(2);
    await page.getByTestId("saas-team-invite").click();
    await page.getByLabel("Name", { exact: true }).fill("Casey Kim");
    await page.getByLabel("Email", { exact: true }).fill("casey@kamod-demo.test");
    await page.getByRole("button", { name: "Send invite" }).click();
    await expect(page.getByTestId("saas-team-table")).toContainText("Casey Kim");
    await page.goto("./demo/saas-team#settings");
    await page.getByTestId("saas-team-reset").click();
    await page.goto("./demo/saas-team#team");
    await expect(page.getByTestId("saas-team-table")).not.toContainText("Casey Kim");
  });
});
