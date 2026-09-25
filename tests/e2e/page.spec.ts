import { test, expect } from "@playwright/test";
import { effectiveOpacity } from "./helpers";

test("FAQ opens with the keyboard", async ({ page }) => {
  await page.goto("/");
  const question = page.locator("section#faq summary", { hasText: "What's the catch?" });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/We earn the same way you do/)).toBeVisible();
});

test("deep link to #faq reveals the FAQ", async ({ page }) => {
  await page.goto("/#faq");
  const heading = page.locator("section#faq").getByRole("heading", { level: 2 });
  await expect(heading).toHaveText("Questions. Answered.");
  await expect.poll(() => effectiveOpacity(heading)).toBeGreaterThan(0.99);
});

test("nav links are hash-only and point at real sections", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("navigation", { name: "Main" }).getByRole("link");
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^#[a-z-]+$/);
    await expect(page.locator(`section${href}`)).toHaveCount(1);
  }
});

test("footer carries the tagline and the risk notice", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("Designed for you. Fees included.");
  await expect(footer).toContainText("Nothing on this site is financial advice.");
  await expect(footer.getByRole("link")).toHaveCount(0);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("reduced motion still reveals everything", async ({ page }) => {
    await page.goto("/");
    for (const heading of await page.getByRole("heading").all()) {
      await heading.scrollIntoViewIfNeeded();
      await expect.poll(() => effectiveOpacity(heading)).toBeGreaterThan(0.99);
    }
  });
});

test("no content overflows at 375 px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only check");
  await page.goto("/");
  const overflowing = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [...document.querySelectorAll("h1, h2, h3, p, li, th, td, summary, a, button")]
      .filter((el) => el.getBoundingClientRect().right > width + 1)
      .map((el) => `${el.tagName}: ${el.textContent?.trim().slice(0, 40)}`);
  });
  expect(overflowing).toEqual([]);
});
