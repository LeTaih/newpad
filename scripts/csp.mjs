// Injects a Content-Security-Policy <meta> tag into every exported HTML file.
// GitHub Pages serves static files with no way to set response headers, so a
// meta http-equiv tag is the only lever available (frame-ancestors, sandbox and
// report-uri are not honoured from a meta tag — that's a real gap, see the
// security review report).
//
// script-src stays strict ('self' + a hash per inline script) rather than
// falling back to 'unsafe-inline': Next's static export inlines the RSC flight
// payload as a handful of <script> tags with fixed, build-time content, so we
// can hash each one exactly instead of trusting all inline scripts.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...collectHtmlFiles(full));
    else if (entry.endsWith(".html")) files.push(full);
  }
  return files;
}

function inlineScriptHashes(html) {
  const hashes = new Set();
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html))) {
    const body = match[1];
    if (!body.trim()) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  return [...hashes];
}

function buildCsp(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`,
    // Only one inline style attribute exists (a bonding-curve bar width, a fixed
    // number from src/content/site.ts, never user input). style-src-attr would
    // scope this more tightly, but Safari does not implement it and falls back
    // to enforcing style-src, which would then block that bar. 'unsafe-inline'
    // on style-src is the trade-off: it cannot execute script, so the risk it
    // reintroduces is CSS-only data exfiltration via injected style, which
    // requires an injection point that does not exist on this static page.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join("; ");
}

let count = 0;
for (const file of collectHtmlFiles(outDir)) {
  const html = readFileSync(file, "utf8");
  if (!html.includes("<head>")) continue;
  const csp = buildCsp(inlineScriptHashes(html));
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  writeFileSync(file, html.replace("<head>", `<head>${tag}`));
  count++;
}
console.log(`csp: injected policy into ${count} html file(s)`);
