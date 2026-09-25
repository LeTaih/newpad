import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("no axe violations", async ({ page }) => {
  await page.goto("/");
  for (const heading of await page.getByRole("heading").all()) await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});
