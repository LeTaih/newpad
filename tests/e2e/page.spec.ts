import { test, expect, type Page } from "@playwright/test";
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
  await expect(heading).toBeInViewport();
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
    for (const el of await page.locator("main :is(h1, h2, h3, p, th, td, summary)").all()) {
      if (!(await el.isVisible())) continue;
      await el.scrollIntoViewIfNeeded();
      await expect.poll(() => effectiveOpacity(el)).toBeGreaterThan(0.99);
    }
  });

  test("reduced motion strikes the fee destinations without a sweep", async ({ page }) => {
    await page.goto("/");
    const list = page.locator("section#problem ul");
    await list.scrollIntoViewIfNeeded();
    for (const strike of await list.locator("li > span").all()) {
      await expect
        .poll(() => strike.evaluate((el) => getComputedStyle(el).backgroundSize), { timeout: 300 })
        .toMatch(/^100% /);
    }
  });
});

async function overflowingElements(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [...document.querySelectorAll("header, header *, main *, footer, footer *")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.right > width + 1 || rect.left < -1);
      })
      .map((el) => `${el.tagName}.${el.className.toString().slice(0, 30)}: ${el.textContent?.trim().slice(0, 40)}`);
  });
}

/** Horizontal breathing room between the nav wordmark and its CTA, in px. */
async function navGap(page: Page): Promise<number> {
  const nav = page.getByRole("navigation", { name: "Main" });
  const logo = await nav.getByRole("link").first().boundingBox();
  const cta = await nav.getByRole("button", { name: /Launch a token/ }).boundingBox();
  if (!logo || !cta) throw new Error("nav logo or CTA missing");
  return cta.x - (logo.x + logo.width);
}

test("no content overflows at 375 px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only check");
  await page.goto("/");
  expect(await overflowingElements(page)).toEqual([]);
  expect(await navGap(page)).toBeGreaterThanOrEqual(12);
});

for (const viewport of [
  { width: 320, height: 640 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 812, height: 375 },
]) {
  test.describe(`at ${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport });

    test("no content overflows and the nav wordmark keeps clear of the CTA", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "mobile", "runs once, in the touch project");
      await page.goto("/");
      expect(await overflowingElements(page)).toEqual([]);
      expect(await navGap(page)).toBeGreaterThanOrEqual(12);
    });
  });
}

for (const viewport of [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  test.describe(`hero at ${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport });

    test("hero CTAs sit in the first screen, clear of the fixed nav", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "mobile", "runs once, in the touch project");
      await page.goto("/");
      const navBox = await page.getByRole("navigation", { name: "Main" }).boundingBox();
      const hero = page.locator("section#top");
      const ctas = [hero.getByRole("button", { name: /Launch a token/ }), hero.getByRole("link", { name: "See how it works" })];
      for (const cta of ctas) {
        await expect.poll(() => effectiveOpacity(cta)).toBeGreaterThan(0.99);
        await expect.poll(async () => (await cta.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(navBox!.y + navBox!.height);
        const box = (await cta.boundingBox())!;
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      }
    });
  });
}
