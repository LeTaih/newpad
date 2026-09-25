import { test, expect } from "@playwright/test";

test("document metadata carries the pitch", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("ForYouPad — Creator fees. For you.");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "The next generation of launchpads. Launch on pump.fun and keep 100% of your creator fees. No treasury. No middleman. No cut.",
  );
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#050608");
});

test("page background is the ink colour", async ({ page }) => {
  await page.goto("/");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(5, 6, 8)");
});
