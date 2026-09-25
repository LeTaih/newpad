import { chromium } from "@playwright/test";

const html = `<!doctype html>
<html><head>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;600&display=block" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #050608; color: #f5f5f7; font-family: Geist, sans-serif; }
  .glow { position: absolute; border-radius: 50%; filter: blur(140px); }
  .wrap { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 0 96px; }
  .brand { font-size: 30px; font-weight: 600; letter-spacing: -0.5px; }
  .brand span { color: #86868b; }
  h1 { margin: 36px 0 0; font-size: 120px; line-height: 0.95; font-weight: 600; letter-spacing: -5px; }
  .you { background: linear-gradient(180deg, #fff 10%, #7cf5c0 110%); -webkit-background-clip: text; color: transparent; }
  .sub { margin-top: 36px; font-size: 28px; color: #86868b; }
</style></head>
<body>
  <div class="glow" style="width:620px;height:620px;left:560px;top:-260px;background:rgba(124,245,192,.22)"></div>
  <div class="glow" style="width:480px;height:480px;left:-200px;top:260px;background:rgba(59,91,255,.18)"></div>
  <div class="wrap">
    <div class="brand">ForYou<span>Pad</span></div>
    <h1>Creator fees.<br><span class="you">For you.</span></h1>
    <div class="sub">The next generation of launchpads.</div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("wrote public/og.png");
