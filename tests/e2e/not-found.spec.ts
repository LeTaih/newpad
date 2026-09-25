import { test, expect } from "@playwright/test";

test("404 page is dark, on-brand, and links home", async ({ page }) => {
  const response = await page.goto("/404.html");
  expect(response?.status()).toBe(200);

  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(5, 6, 8)");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing here.");

  const homeLink = page.getByRole("link", { name: "Back to ForYouPad" });
  await expect(homeLink).toBeVisible();
  const href = await homeLink.getAttribute("href");
  const resolved = new URL(href!, page.url());
  expect(resolved.pathname).toBe("/");
});
