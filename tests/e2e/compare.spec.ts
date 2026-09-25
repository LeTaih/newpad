import { test, expect } from "@playwright/test";

test("compares everyone else with ForYouPad row by row", async ({ page }) => {
  await page.goto("/");
  const table = page.locator("section#compare").getByRole("table");
  await expect(table.getByRole("columnheader")).toHaveText(["Feature", "Everyone else", "ForYouPad"]);

  const expected: [string, string, string][] = [
    ["On-chain creator", "Their treasury", "You"],
    ["Platform cut", "Up to 20%", "0%"],
    ["Who holds your fees", "They do, until payout", "Nobody. They're yours."],
    ["How you get paid", "Thresholds, verification", "One signature"],
    ["Trust required", "A lot", "None"],
  ];
  for (const [label, others, us] of expected) {
    const row = table.getByRole("row", { name: new RegExp(`^${label}`) });
    await expect(row.getByRole("rowheader")).toHaveText(label);
    await expect(row.getByRole("cell")).toHaveText([others, us]);
  }
});

test("never names a competitor", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toContainText(/fanspad|bonkfun|letsbonk|believe|bags\.fm|zpad/i);
});
