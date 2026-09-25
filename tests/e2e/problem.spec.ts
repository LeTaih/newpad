import { test, expect } from "@playwright/test";
import { effectiveOpacity } from "./helpers";

test("lists every fee destination and lands on You.", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#problem");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("Everyone found somewhere to send your fees.");
  await expect(section.getByRole("listitem")).toHaveText([
    "To charity.",
    "To buybacks.",
    "To holders.",
    "To a treasury.",
    "To someone's OnlyFans.",
  ]);
  await expect(section.getByText("We found a better place.")).toBeVisible();
  await expect(section.getByText("You.", { exact: true })).toBeVisible();
});

test("section content reveals when reached", async ({ page }) => {
  await page.goto("/");
  const answer = page.locator("section#problem").getByText("You.", { exact: true });
  await answer.scrollIntoViewIfNeeded();
  await expect.poll(() => effectiveOpacity(answer)).toBeGreaterThan(0.99);
});
