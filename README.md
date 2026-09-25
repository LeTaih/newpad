# ForYouPad

Creator fees. For you. — landing page for foryoupad.fun.

- `npm run dev` — local dev server
- `npm run build:pages` — static export to `./out` (GitHub Pages), then injects the CSP `<meta>` tag (see below)
- `npm run test:e2e` — Playwright tests against the static export
- `npm run og` — regenerates `public/og.png`, the Open Graph / Twitter share image, by rendering `scripts/og.mjs`'s HTML in a headless browser and screenshotting it

## Environment variables

- `GITHUB_PAGES` — set to `"true"` by `build:pages` to enable Next's static `output: "export"` mode (see `next.config.ts`). Not needed for `npm run dev` or `npm run build`.
- `PAGES_BASE_PATH` — the site's base path when served from a GitHub Pages project page (e.g. `/newpad`). Set by the deploy workflow from `actions/configure-pages`' `base_path` output; leave unset for a local build served from `/`.
- `NEXT_PUBLIC_SITE_URL` — the absolute origin used to build absolute URLs (Open Graph images, canonical/metadataBase). Falls back to `http://localhost:4173` if unset; a production build without it logs a `console.warn` at build time so the fallback is never silent.

## Testing

`npm run test:e2e` (or `npx playwright test`) builds the static export and serves it on `:4173` via `npx serve`. Playwright's `webServer.reuseExistingServer` is `true` outside CI, so if a server is already listening on `:4173` (e.g. from a previous test run that didn't shut down cleanly), the test run reuses it as-is instead of rebuilding — kill it first if you want a fresh build:

```
lsof -ti :4173 | xargs kill
```

Also run `npm run lint && npm run typecheck` before pushing.

## Content-Security-Policy

GitHub Pages serves static files with no way to set response headers, so `scripts/csp.mjs` (run automatically by `build:pages`) injects a CSP `<meta http-equiv>` tag into every exported HTML file, immediately after the `<meta charset>` tag (browsers only honour `<meta charset>` within the first 1024 bytes of the document, so it must stay first). `script-src` is a strict allowlist of `'self'` plus a `sha256-` hash per inline `<script>` found in the export; the script fails loudly (non-zero exit) if it can't find a `<head>` tag, a charset meta tag, or can't account for every inline script's hash.

## Deploying

Pushes to `main` trigger `.github/workflows/deploy.yml`, which lints, typechecks, runs the full Playwright suite, builds the static export, and publishes it to GitHub Pages.

One-time GitHub setup required before the first deploy: **Settings → Environments → github-pages → Deployment branches → add `main`** (GitHub Pages environments restrict which branches may deploy to them by default).
