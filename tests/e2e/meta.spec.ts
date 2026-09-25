import { test, expect } from "@playwright/test";

test("share image and favicon are wired and served", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "http://localhost:4173/og.png");
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", "http://localhost:4173/og.png");

  const og = await request.get("/og.png");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toBe("image/png");

  const iconHref = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(iconHref).toMatch(/icon\.svg/);
  expect((await request.get(iconHref!)).status()).toBe(200);
});
