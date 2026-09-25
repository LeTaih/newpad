import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

test("charset meta appears within the first 1024 bytes of out/index.html", () => {
  const html = readFileSync("out/index.html", "utf8");
  const charsetIndex = html.search(/<meta\s+charset="[^"]*"/i);
  expect(charsetIndex).toBeGreaterThanOrEqual(0);
  expect(charsetIndex).toBeLessThan(1024);
});

test("every request during a full scroll is same-origin", async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const urls: string[] = [];
  page.on("request", (request) => urls.push(request.url()));

  await page.goto("/");
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 300) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(500);

  expect(urls.length).toBeGreaterThan(0);
  const offOrigin = urls.filter((url) => new URL(url).origin !== origin);
  expect(offOrigin).toEqual([]);
});

test("no console errors and no CSP violations while browsing", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/");
  for (const heading of await page.getByRole("heading").all()) await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  expect(errors).toEqual([]);
});
