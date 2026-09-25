// Captures every landing section at every target width.
// Usage: npm run build:pages && npx serve out -l 4180 -n & node scripts/screens.mjs [baseUrl] [outDir]
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const baseUrl = process.argv[2] ?? "http://localhost:4180";
const outDir = process.argv[3] ?? "docs/rapport/screens";

const viewports = [
  { name: "320", width: 320, height: 640, mobile: true },
  { name: "375", width: 375, height: 812, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: true },
  { name: "1024", width: 1024, height: 768, mobile: false },
  { name: "1440", width: 1440, height: 900, mobile: false },
  { name: "812x375", width: 812, height: 375, mobile: true },
];

const sections = ["problem", "compare", "how-it-works", "details", "token", "faq"];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);

  // Nav + hero: exactly what the visitor sees on arrival.
  await page.screenshot({ path: `${outDir}/hero-${vp.name}.png` });
  await page.locator("header").screenshot({ path: `${outDir}/nav-${vp.name}.png` });

  // Walk the page so every scroll-triggered reveal fires, then settle.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(vp.height / 3)) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: "header { visibility: hidden !important; }" });

  // Grow the viewport to fit each section so the fixed ambient glows are not stitched into bands.
  const shoot = async (locator, name) => {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    await page.setViewportSize({ width: vp.width, height: Math.max(vp.height, Math.ceil(box.height)) });
    await page.waitForTimeout(300);
    await locator.screenshot({ path: `${outDir}/${name}-${vp.name}.png` });
    await page.setViewportSize({ width: vp.width, height: vp.height });
  };
  for (const id of sections) await shoot(page.locator(`section#${id}`), id);
  await shoot(page.locator("footer"), "footer");
  await context.close();
  console.log(`captured ${vp.name}`);
}

await browser.close();
