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
//
// Fails loudly (non-zero exit) rather than silently shipping a broken or
// no-op policy: see assertOrFail() calls below.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const cspMetaRe = /<meta http-equiv="Content-Security-Policy"[^>]*>\s*/gi;
const inlineScriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;

function fail(message) {
  console.error(`csp: ${message}`);
  process.exit(1);
}

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...collectHtmlFiles(full));
    else if (entry.endsWith(".html")) files.push(full);
  }
  return files;
}

/** Bodies of every src-less <script> tag with non-whitespace content. */
function inlineScriptBodies(html) {
  const bodies = [];
  let match;
  inlineScriptRe.lastIndex = 0;
  while ((match = inlineScriptRe.exec(html))) {
    if (match[1].trim()) bodies.push(match[1]);
  }
  return bodies;
}

function sha256(body) {
  return `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`;
}

function buildCsp(hashes) {
  const scriptSrc = hashes.length ? `'self' ${hashes.join(" ")}` : "'self'";
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Three patterns of inline style attribute exist in the build (~23
    // occurrences total): Motion's SSR'd `initial` state on every Reveal
    // ("opacity:0;transform:translateY(24px)"), the Problem section's
    // strike-through variants ("background-size:…;color:…"), and the
    // CoinCard bonding-curve bar width ("width:64%"). All three are fixed
    // literals baked in at build time (Motion's static initial style, and a
    // hardcoded constant in src/content/site.ts) — none is derived from user
    // input. The narrower style-src-attr directive would scope this more
    // tightly without opening up <style> tags in general, but Safari/WebKit
    // doesn't implement style-src-attr: an unsupported directive is ignored
    // outright, so on Safari style-src alone would then govern inline style
    // attributes too, and without 'unsafe-inline' there these elements would
    // silently render without their inline styles. 'unsafe-inline' on
    // style-src only reintroduces CSS-based data exfiltration via an
    // *injected* style — which requires an injection point that doesn't
    // exist on this static page — so that trade-off was accepted rather
    // than shipping a policy that breaks on Safari/iOS.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join("; ");
}

const files = collectHtmlFiles(outDir);
if (files.length === 0) fail(`no HTML files found under ${outDir}/ — did the build run first?`);

let count = 0;
for (const file of files) {
  const original = readFileSync(file, "utf8");
  if (!original.includes("<head>")) fail(`${file}: no <head> tag found, cannot inject CSP`);

  // Idempotent: strip any CSP meta tag from a previous run before recomputing,
  // so running this script twice never produces two <meta> tags.
  const html = original.replace(cspMetaRe, "");

  const bodies = inlineScriptBodies(html);
  const hashes = [...new Set(bodies.map(sha256))];

  if (bodies.length > 0 && hashes.length === 0) {
    fail(`${file}: found ${bodies.length} inline <script> tag(s) but computed zero hashes`);
  }

  const csp = buildCsp(hashes);
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  const injected = html.replace("<head>", `<head>${tag}`);

  // Re-derive from the final, injected file: every inline script's hash must
  // actually be present in the policy we just wrote, and the count of
  // distinct hashes in the policy must match the count of distinct src-less
  // inline scripts in the file.
  const bodiesAfter = inlineScriptBodies(injected);
  const uniqueHashesAfter = new Set(bodiesAfter.map(sha256));
  const hashesInTag = [...injected.matchAll(/'sha256-[^']+'/g)].map((m) => m[0]);

  if (uniqueHashesAfter.size !== new Set(hashesInTag).size) {
    fail(
      `${file}: hash count mismatch after injection — ${uniqueHashesAfter.size} distinct inline script(s) ` +
        `but ${new Set(hashesInTag).size} distinct hash(es) in the injected policy`,
    );
  }
  for (const body of bodiesAfter) {
    if (!injected.includes(sha256(body))) {
      fail(`${file}: an inline script's hash is missing from the injected CSP after writing it`);
    }
  }

  writeFileSync(file, injected);
  count++;
}
console.log(`csp: injected policy into ${count} html file(s)`);
