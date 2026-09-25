import { test, expect } from "@playwright/test";
import { effectiveOpacity } from "./helpers";

test.use({ javaScriptEnabled: false });

test("revealed content is visible without JavaScript", async ({ page }) => {
  await page.goto("/");
  const heading = page.locator("section#faq").getByRole("heading", { level: 2 });
  await expect.poll(() => effectiveOpacity(heading)).toBeGreaterThan(0.99);
});
