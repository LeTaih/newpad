import { test, expect } from "@playwright/test";

test("home page is served from the static export", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("main#top")).toHaveCount(1);
});
