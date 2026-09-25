import { test, expect } from "@playwright/test";

test("how it works lists the three steps in order", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#how-it-works");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText(["Launch.", "Fees accrue.", "You get paid."]);
  await expect(section.getByText("Every trade on your token pays a creator fee. To you.")).toBeVisible();
});

test("details cover suffix, custody, fees and the curve", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#details");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "Ends in fyp.",
    "Non-custodial.",
    "Zero platform fee.",
    "Same curve. Same traders.",
  ]);
});

test("$FYP is presented as coming soon", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#token");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("$FYP.");
  await expect(section.getByText("Coming soon")).toBeVisible();
  await expect(section.getByText(/Its creator fees go to its creators\./)).toBeVisible();
});
