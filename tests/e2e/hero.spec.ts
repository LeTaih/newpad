import { test, expect } from "@playwright/test";

test("hero states the pitch", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Creator fees.");
  await expect(h1).toContainText("For you.");
  await expect(page.getByText("The next generation of token launches.")).toBeVisible();
});

test("launch CTAs are disabled buttons, never links", async ({ page }) => {
  await page.goto("/");
  const ctas = page.getByRole("button", { name: /Launch a token/ });
  await expect(ctas.first()).toBeVisible();
  for (const cta of await ctas.all()) {
    await expect(cta).toHaveAttribute("aria-disabled", "true");
    await expect(cta).toContainText("Soon");
  }
  await expect(page.getByRole("link", { name: /Launch a token/ })).toHaveCount(0);

  const urlBefore = page.url();
  await ctas.first().click({ force: true });
  await ctas.first().press("Enter");
  expect(page.url()).toBe(urlBefore);
});

test("example coin shows an address ending in fyp", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("7xKq…Rfyp").first()).toBeVisible();
  await expect(page.getByText("100% → You")).toBeVisible();
});
