import { test, expect } from "@playwright/test";

test("how it works lists the three steps in order", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#how-it-works");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText(["Connect.", "Launch.", "Earn."]);
  await expect(section.getByText("Every trade pays you. Claim whenever you want.")).toBeVisible();
});

test("details cover suffix, custody, fees and pump.fun", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#details");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "Ends in fyp.",
    "Non-custodial.",
    "Zero platform fee.",
    "Built on pump.fun.",
  ]);
});

test("$FYP is presented as coming soon", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#token");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("$FYP.");
  await expect(section.getByText("Coming soon")).toBeVisible();
  await expect(section.getByText(/Its creator fees go to its creators\./)).toBeVisible();
});
