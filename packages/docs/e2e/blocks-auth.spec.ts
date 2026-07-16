import { expect, test } from "@playwright/test";

const loginIds = Array.from(
  { length: 5 },
  (_, index) => `login-${String(index + 1).padStart(2, "0")}`,
);
const signupIds = Array.from(
  { length: 5 },
  (_, index) => `signup-${String(index + 1).padStart(2, "0")}`,
);

test.describe("auth blocks docs", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (error) => {
      throw error;
    });
    page.on("console", (message) => {
      if (message.type() === "error") throw new Error(message.text());
    });
  });

  test("lists login blocks and shows install command in code tab", async ({ page }) => {
    await page.goto("./blocks/login");
    await expect(page.getByRole("heading", { level: 1, name: "Login Blocks" })).toBeVisible();
    for (const id of loginIds) {
      await expect(page.locator(`article#${id}`)).toBeAttached();
    }

    const firstCard = page.locator("article#login-01");
    await firstCard.getByRole("tab", { name: "Code" }).click();
    await expect(firstCard.getByText("@kamod-ch/blocks/login/login-01")).toBeVisible();
  });

  test("lists signup blocks and opens isolated previews", async ({ page }) => {
    await page.goto("./blocks/signup");
    await expect(page.getByRole("heading", { level: 1, name: "Signup Blocks" })).toBeVisible();
    for (const id of signupIds) {
      await expect(page.locator(`article#${id}`)).toBeAttached();
    }

    await page.goto("./blocks/signup/signup-05/preview");
    await expect(page.getByRole("button", { name: /GitHub/ })).toBeVisible();
  });
});
