# ForYouPad Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ForYouPad static landing page (English, Apple-style dark glassmorphism) and deploy it to GitHub Pages.

**Architecture:** Next.js App Router site, statically exported (`output: "export"`) only when `GITHUB_PAGES=true`, so the same codebase can later run as a Node server on Railway. All copy lives in one content module; each page section is its own component built from a few UI primitives (`Section`, `Reveal`, buttons, `Badge`). Behaviour is verified with Playwright against the exported build served locally, on a 1440 px desktop project and a 375 px mobile project.

**Tech Stack:** Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS 4, Motion 12+ (`motion/react`), Geist fonts via `next/font/google`, Playwright, `serve`, GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-25-foryoupad-landing-design.md`

## Global Constraints

- All user-facing text is English. All copy comes from `src/content/site.ts`; components never hard-code copy.
- Competitors are never named on the site; the comparison column is `Other launchpads`.
- No invented statistics anywhere on the page.
- Every “Launch a coin” CTA is a `<button type="button" aria-disabled="true">` with a `Soon` badge — never a link.
- Dark mode only. Accent colour `#7cf5c0` used sparingly (CTA details, active states, the ForYouPad column).
- Motion is wrapped in `<MotionConfig reducedMotion="user">`; CSS transitions/smooth scroll are disabled under `prefers-reduced-motion: reduce`.
- Everything readable at 375 px wide with no content cut off.
- `output: "export"` only when `GITHUB_PAGES=true`; `basePath` comes from `PAGES_BASE_PATH` (empty locally).
- Mint-address suffix shown on the site: `fyp`.

## Review Focus

1. **375 px phone**: no heading, paragraph, list item, table cell or FAQ question extends past the viewport's right edge (text must wrap, not be clipped). Test: Task 7 “no content overflows at 375 px”.
2. **`prefers-reduced-motion: reduce`**: every section's content ends fully opaque after being scrolled to. Test: Task 7 “reduced motion still reveals everything”.
3. **Deep link to an anchor** (`/#faq`, or a nav click): the target section's content becomes visible without the user scrolling past it first. Test: Task 4 “section content reveals when reached” + Task 7 “deep link to #faq reveals the FAQ”.
4. **Served under the `/newpad/` sub-path on GitHub Pages**: nav anchors, CSS/JS assets and the favicon still resolve. Tests: Task 7 “nav links are hash-only and point at real sections”; Task 9 live checks with `curl`.
5. **Clicking or keyboard-activating a “Launch a coin” CTA**: nothing navigates, and assistive tech hears it as disabled. Test: Task 3 “launch CTAs are disabled buttons, never links”.

---

## File Structure

```
.github/workflows/deploy.yml        build + deploy to GitHub Pages
next.config.ts                      export/basePath switches
playwright.config.ts                desktop + mobile projects, serves ./out
scripts/og.mjs                      renders public/og.png with Playwright
public/og.png                       Open Graph image (generated, committed)
src/app/globals.css                 Tailwind theme, glass + gradient utilities, details animation
src/app/layout.tsx                  fonts, metadata, ambient background, MotionProvider
src/app/page.tsx                    assembles sections
src/app/icon.svg                    favicon
src/content/site.ts                 ALL copy and constants
src/lib/cn.ts                       class-name joiner
src/lib/site-url.ts                 absolute site URL from env
src/components/MotionProvider.tsx   MotionConfig reducedMotion="user"
src/components/ui/Badge.tsx
src/components/ui/Buttons.tsx       LinkButton, ComingSoonButton
src/components/ui/Reveal.tsx        scroll-reveal wrapper
src/components/ui/Section.tsx       section shell with eyebrow + title
src/components/sections/Nav.tsx
src/components/sections/Hero.tsx
src/components/sections/CoinCard.tsx
src/components/sections/Problem.tsx
src/components/sections/Compare.tsx
src/components/sections/HowItWorks.tsx
src/components/sections/Details.tsx
src/components/sections/Token.tsx
src/components/sections/Faq.tsx
src/components/sections/Footer.tsx
tests/e2e/helpers.ts                effectiveOpacity()
tests/e2e/*.spec.ts                 one spec per task
```

---

### Task 1: Scaffold Next.js, static export switch, Playwright harness

**Files:**
- Create (via scaffold): `package.json`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`, `.gitignore`, `src/app/*`
- Create: `next.config.ts` (overwrite scaffold), `playwright.config.ts`, `tests/e2e/smoke.spec.ts`, `README.md` (overwrite scaffold)
- Modify: `src/app/page.tsx` (replace scaffold content)

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `build:pages`, `lint`, `typecheck`, `test:e2e`; Playwright `baseURL` `http://localhost:4173`; projects `desktop` (1440×900) and `mobile` (375×812).

- [ ] **Step 1: Scaffold into a temp dir and copy in** (the repo already has `docs/`, which create-next-app refuses)

```bash
rm -rf /tmp/fyp-scaffold
npx create-next-app@latest /tmp/fyp-scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes
rsync -a --exclude .git --exclude node_modules /tmp/fyp-scaffold/ ./
rm -f public/*.svg src/app/favicon.ico
npm install
npm install motion
npm install -D @playwright/test serve
npx playwright install chromium
```

Expected: `package.json` lists `next` 16.x, `react` 19.x, `tailwindcss` 4.x, `motion`, `@playwright/test`, `serve`.

- [ ] **Step 2: Write the failing smoke test** — `tests/e2e/smoke.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("home page is served from the static export", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("main#top")).toHaveCount(1);
});
```

- [ ] **Step 3: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    command: "npm run build:pages && npx serve out -l 4173 -n",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx playwright test tests/e2e/smoke.spec.ts`
Expected: FAIL — webServer errors with `Missing script: "build:pages"`.

- [ ] **Step 5: Add scripts, config and a minimal page**

In `package.json`, set `"scripts"` to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "build:pages": "GITHUB_PAGES=true next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "test:e2e": "playwright test"
}
```

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
```

`src/app/page.tsx`:

```tsx
export default function Home() {
  return <main id="top" />;
}
```

Append to `.gitignore`:

```
/test-results
/playwright-report
/blob-report
```

`README.md`:

```md
# ForYouPad

Creator fees. For you. — landing page for foryoupad.fun.

- `npm run dev` — local dev server
- `npm run build:pages` — static export to `./out` (GitHub Pages)
- `npm run test:e2e` — Playwright tests against the static export
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/e2e/smoke.spec.ts`
Expected: PASS (2 tests: desktop, mobile). `ls out/index.html` exists.

- [ ] **Step 7: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "chore: scaffold Next.js static site with Playwright harness"
```

---

### Task 2: Design system, content module, layout and metadata

**Files:**
- Create: `src/content/site.ts`, `src/lib/cn.ts`, `src/lib/site-url.ts`, `src/components/MotionProvider.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/Buttons.tsx`, `src/components/ui/Reveal.tsx`, `src/components/ui/Section.tsx`, `tests/e2e/layout.spec.ts`
- Modify: `src/app/globals.css` (replace), `src/app/layout.tsx` (replace)

**Interfaces:**
- Produces (content): `site`, `navLinks`, `launchCta`, `hero`, `problem`, `compare`, `steps`, `details`, `token`, `faq`, `footer` exported from `@/content/site` (shapes below).
- Produces (lib): `cn(...classes: (string | false | null | undefined)[]): string`; `siteUrl: string` (no trailing slash).
- Produces (UI): `<Badge className?>`, `<LinkButton variant?: "primary" | "glass" …anchor props>`, `<ComingSoonButton variant? className?>{label}</ComingSoonButton>`, `<Reveal delay?: number className?>`, `<Section id eyebrow? title? className?>`.
- Produces (CSS): theme colours `ink`, `fg`, `muted`, `subtle`, `accent`; component classes `glass`, `text-gradient`; easing `ease-spring`.

- [ ] **Step 1: Write the failing test** — `tests/e2e/layout.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("document metadata carries the pitch", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("ForYouPad — Creator fees. For you.");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "The next generation of launchpads. Launch on pump.fun and keep 100% of your creator fees. No treasury. No middleman. No cut.",
  );
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#050608");
});

test("page background is the ink colour", async ({ page }) => {
  await page.goto("/");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(5, 6, 8)");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/e2e/layout.spec.ts`
Expected: FAIL — title is `Create Next App`.

- [ ] **Step 3: Write `src/content/site.ts`**

```ts
export const site = {
  name: "ForYouPad",
  domain: "foryoupad.fun",
  mintSuffix: "fyp",
  tagline: "Creator fees. For you.",
  description:
    "The next generation of launchpads. Launch on pump.fun and keep 100% of your creator fees. No treasury. No middleman. No cut.",
} as const;

export const launchCta = "Launch a coin";

export const navLinks = [
  { label: "Compare", href: "#compare" },
  { label: "How it works", href: "#how-it-works" },
  { label: "$FYP", href: "#token" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  eyebrow: "The next generation of launchpads.",
  titleLines: ["Creator fees.", "For you."],
  subtitle: "Launch on pump.fun and keep 100% of your creator fees. No treasury. No middleman. No cut.",
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  card: {
    name: "Your Coin",
    ticker: "$YOURS",
    mintPrefix: "7xKq…R",
    bondingPercent: 64,
    rows: [
      { label: "Creator", value: "You" },
      { label: "Creator fees", value: "100% → You" },
    ],
  },
} as const;

export const problem = {
  title: "Everyone found somewhere to send your fees.",
  destinations: ["To charity.", "To buybacks.", "To holders.", "To a treasury.", "To someone's OnlyFans."],
  turn: "We found a better place.",
  answer: "You.",
} as const;

export const compare = {
  eyebrow: "Compare",
  title: "The difference is you.",
  columns: ["Other launchpads", "ForYouPad"],
  rows: [
    { label: "On-chain creator", others: "Their treasury", us: "You" },
    { label: "Platform cut", others: "Up to 20%", us: "0%" },
    { label: "Who holds your fees", others: "They do, until payout", us: "Nobody. They're yours." },
    { label: "How you get paid", others: "Thresholds, verification", us: "One signature" },
    { label: "Trust required", others: "A lot", us: "None" },
  ],
} as const;

export const steps = {
  eyebrow: "How it works",
  title: "Three steps. All yours.",
  items: [
    { number: "01", title: "Connect.", body: "Any Solana wallet. We never see your keys." },
    { number: "02", title: "Launch.", body: "Name, ticker, image. Your coin goes live on pump.fun, with you as its creator." },
    { number: "03", title: "Earn.", body: "Every trade pays you. Claim whenever you want." },
  ],
} as const;

export const details = {
  eyebrow: "Details",
  title: "Everything else. Obviously.",
  items: [
    { title: "Ends in fyp.", body: "Every coin launched here gets an address that ends in fyp.", wide: true },
    { title: "Non-custodial.", body: "You sign every transaction. We never hold funds.", wide: false },
    { title: "Zero platform fee.", body: "Only pump.fun's standard costs.", wide: false },
    { title: "Built on pump.fun.", body: "Same curve, same liquidity, same terminals.", wide: true },
  ],
} as const;

export const token = {
  eyebrow: "The platform token",
  title: "$FYP.",
  body: "Our own token, launched on ForYouPad. Its creator fees go to its creators. Like every coin here.",
  badge: "Coming soon",
} as const;

export const faq = {
  eyebrow: "FAQ",
  title: "Questions. Answered.",
  items: [
    {
      q: "Isn't this just how pump.fun already works?",
      a: "Yes. That's the point. Every other launchpad added a detour. We removed it.",
    },
    {
      q: "What's the catch?",
      a: "There isn't one. We earn the same way you do: from the creator fees of our own coin, $FYP.",
    },
    {
      q: "Do you ever hold my funds?",
      a: "Never. You sign every transaction from your own wallet. Your coin's creator is your address, not ours.",
    },
    {
      q: "How much does it cost?",
      a: "Pump.fun's standard creation cost and network rent (around 0.02–0.04 SOL). ForYouPad adds nothing.",
    },
    {
      q: "Why do addresses end in fyp?",
      a: "So everyone knows where the coin came from. And where its fees go.",
    },
    {
      q: "Is this financial advice?",
      a: "No. Memecoins are extremely volatile and most go to zero. Only use money you can afford to lose.",
    },
  ],
} as const;

export const footer = {
  tagline: "Designed for you. Fees included.",
  risk: "Memecoins are extremely volatile and most go to zero. Nothing on this site is financial advice.",
  socials: ["X", "Telegram"],
  copyright: "© 2026 ForYouPad",
} as const;
```

- [ ] **Step 4: Write the lib helpers**

`src/lib/cn.ts`:

```ts
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

`src/lib/site-url.ts`:

```ts
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173").replace(/\/$/, "");
```

- [ ] **Step 5: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-ink: #050608;
  --color-fg: #f5f5f7;
  --color-muted: #86868b;
  --color-subtle: #424245;
  --color-accent: #7cf5c0;
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
}

@theme inline {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

html {
  color-scheme: dark;
  scroll-behavior: smooth;
  scroll-padding-top: 6rem;
  background: var(--color-ink);
}

body {
  background: var(--color-ink);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

@layer components {
  /* Opaque fallback first; translucent + blur only where backdrop-filter exists. */
  .glass {
    position: relative;
    background: rgb(18 20 24 / 0.88);
    border: 1px solid rgb(255 255 255 / 0.08);
    box-shadow:
      inset 0 1px 0 0 rgb(255 255 255 / 0.07),
      0 24px 64px -24px rgb(0 0 0 / 0.7);
  }

  .text-gradient {
    background-image: linear-gradient(180deg, #ffffff 10%, var(--color-accent) 110%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  @layer components {
    .glass {
      background: rgb(255 255 255 / 0.035);
      -webkit-backdrop-filter: blur(24px) saturate(160%);
      backdrop-filter: blur(24px) saturate(160%);
    }
  }
}

@supports (interpolate-size: allow-keywords) {
  :root {
    interpolate-size: allow-keywords;
  }
  details::details-content {
    height: 0;
    overflow: clip;
    transition:
      height 0.4s var(--ease-spring),
      content-visibility 0.4s allow-discrete;
  }
  details[open]::details-content {
    height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after,
  details::details-content {
    transition-duration: 0s !important;
  }
}
```

- [ ] **Step 6: Write the UI primitives**

`src/components/MotionProvider.tsx`:

```tsx
"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

`src/components/ui/Badge.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-current/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
```

`src/components/ui/Buttons.tsx`:

```tsx
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

type Variant = "primary" | "glass";

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium tracking-tight whitespace-nowrap transition-[transform,background-color] duration-200 ease-spring focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-ink",
  glass: "glass text-fg",
};

export function LinkButton({
  variant = "primary",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a
      className={cn(
        base,
        variants[variant],
        variant === "primary" ? "hover:bg-white" : "hover:bg-white/10",
        "active:scale-[0.97]",
        className,
      )}
      {...props}
    />
  );
}

export function ComingSoonButton({
  children,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <button type="button" aria-disabled="true" title="Coming soon" className={cn(base, variants[variant], "cursor-default", className)}>
      {children}
      <Badge className="opacity-60">Soon</Badge>
    </button>
  );
}
```

`src/components/ui/Reveal.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

`src/components/ui/Section.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-36", className)}>
      {(eyebrow || title) && (
        <Reveal className="mb-12 max-w-3xl md:mb-16">
          {eyebrow && <p className="mb-3 text-sm font-medium text-accent">{eyebrow}</p>}
          {title && (
            <h2 className="text-[clamp(2.25rem,7vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
              {title}
            </h2>
          )}
        </Reveal>
      )}
      {children}
    </section>
  );
}
```

- [ ] **Step 7: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title,
  description: site.description,
  openGraph: { title, description: site.description, siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-accent/12 blur-[140px]" />
          <div className="absolute top-1/3 -left-48 h-[32rem] w-[32rem] rounded-full bg-[#3b5bff]/12 blur-[140px]" />
          <div className="absolute -right-48 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[#9b5cff]/10 blur-[140px]" />
        </div>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx playwright test tests/e2e/layout.spec.ts tests/e2e/smoke.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 9: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "feat: add design system, site content and layout metadata"
```

---

### Task 3: Nav, Hero and example coin card

**Files:**
- Create: `src/components/sections/Nav.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/CoinCard.tsx`, `tests/e2e/hero.spec.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `site`, `navLinks`, `launchCta`, `hero` from `@/content/site`; `Badge`, `LinkButton`, `ComingSoonButton`, `Reveal`.
- Produces: `<Nav />`, `<Hero />` (renders `<section id="top">`), `<CoinCard />`. `page.tsx` renders `<Nav />` then `<main>` containing sections; `id="top"` moves from `main` to the hero section.

- [ ] **Step 1: Write the failing tests** — `tests/e2e/hero.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("hero states the pitch", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Creator fees.");
  await expect(h1).toContainText("For you.");
  await expect(page.getByText("The next generation of launchpads.")).toBeVisible();
});

test("launch CTAs are disabled buttons, never links", async ({ page }) => {
  await page.goto("/");
  const ctas = page.getByRole("button", { name: /Launch a coin/ });
  await expect(ctas.first()).toBeVisible();
  for (const cta of await ctas.all()) {
    await expect(cta).toHaveAttribute("aria-disabled", "true");
    await expect(cta).toContainText("Soon");
  }
  await expect(page.getByRole("link", { name: /Launch a coin/ })).toHaveCount(0);

  const urlBefore = page.url();
  await ctas.first().click();
  await ctas.first().press("Enter");
  expect(page.url()).toBe(urlBefore);
});

test("example coin shows an address ending in fyp", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("7xKq…Rfyp").first()).toBeVisible();
  await expect(page.getByText("100% → You")).toBeVisible();
});
```

Note: the `main#top` assertion in `smoke.spec.ts` becomes `section#top` in Step 4.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx playwright test tests/e2e/hero.spec.ts`
Expected: FAIL — no `h1`.

- [ ] **Step 3: Implement**

`src/components/sections/Nav.tsx`:

```tsx
import { launchCta, navLinks, site } from "@/content/site";
import { ComingSoonButton } from "@/components/ui/Buttons";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav aria-label="Main" className="glass mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full pr-2 pl-5">
        <a href="#top" className="text-[15px] font-semibold tracking-tight">
          {site.name.replace("Pad", "")}
          <span className="text-muted">Pad</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm text-muted md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors duration-200 hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ComingSoonButton className="h-10 px-4 text-sm">{launchCta}</ComingSoonButton>
      </nav>
    </header>
  );
}
```

`src/components/sections/CoinCard.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { hero, site } from "@/content/site";
import { Badge } from "@/components/ui/Badge";

export function CoinCard() {
  const { card } = hero;
  return (
    <motion.div
      aria-hidden
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="glass w-[min(21rem,calc(100vw-2.5rem))] rounded-[2rem] p-6"
    >
      <div className="flex items-center gap-4">
        <div className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-accent to-[#3b5bff] text-lg font-semibold text-ink">
          Y
        </div>
        <div>
          <p className="font-semibold tracking-tight">{card.name}</p>
          <p className="text-sm text-muted">{card.ticker}</p>
        </div>
        <Badge className="ml-auto text-accent">Live</Badge>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
          <dt className="text-muted">Mint</dt>
          <dd className="font-mono">
            {card.mintPrefix}
            <span className="text-accent">{site.mintSuffix}</span>
          </dd>
        </div>
        {card.rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b border-white/5 pb-3 last:border-0">
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-muted">
          <span>Bonding curve</span>
          <span className="font-mono">{card.bondingPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent" style={{ width: `${card.bondingPercent}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
```

`src/components/sections/Hero.tsx`:

```tsx
import { hero, launchCta } from "@/content/site";
import { ComingSoonButton, LinkButton } from "@/components/ui/Buttons";
import { Reveal } from "@/components/ui/Reveal";
import { CoinCard } from "./CoinCard";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center gap-16 px-5 pt-32 pb-20 md:flex-row md:justify-between md:gap-10 md:px-8"
    >
      <div className="max-w-2xl text-center md:text-left">
        <Reveal>
          <p className="mb-5 text-sm font-medium text-accent">{hero.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
            {hero.titleLines[0]}
            <br />
            <span className="text-gradient">{hero.titleLines[1]}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted md:mx-0 md:text-xl">{hero.subtitle}</p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
          <ComingSoonButton>{launchCta}</ComingSoonButton>
          <LinkButton variant="glass" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </LinkButton>
        </Reveal>
      </div>
      <Reveal delay={0.25}>
        <CoinCard />
      </Reveal>
    </section>
  );
}
```

`src/app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Update the smoke test** — in `tests/e2e/smoke.spec.ts` replace `main#top` with `section#top`.

- [ ] **Step 5: Run all tests to verify they pass**

Run: `npx playwright test`
Expected: PASS.

- [ ] **Step 6: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "feat: add nav, hero and example coin card"
```

---

### Task 4: “The problem” section with struck-through destinations

**Files:**
- Create: `src/components/sections/Problem.tsx`, `tests/e2e/helpers.ts`, `tests/e2e/problem.spec.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `problem`; `Section`, `Reveal`.
- Produces: `<Problem />` rendering `<section id="problem">`; test helper `effectiveOpacity(locator: Locator): Promise<number>`.

- [ ] **Step 1: Write the helper and failing tests**

`tests/e2e/helpers.ts`:

```ts
import type { Locator } from "@playwright/test";

/** Product of the element's opacity and all its ancestors' — 1 means fully visible. */
export function effectiveOpacity(locator: Locator): Promise<number> {
  return locator.evaluate((el) => {
    let opacity = 1;
    for (let node: Element | null = el; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity);
    }
    return opacity;
  });
}
```

`tests/e2e/problem.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { effectiveOpacity } from "./helpers";

test("lists every fee destination and lands on You.", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#problem");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("Everyone found somewhere to send your fees.");
  await expect(section.getByRole("listitem")).toHaveText([
    "To charity.",
    "To buybacks.",
    "To holders.",
    "To a treasury.",
    "To someone's OnlyFans.",
  ]);
  await expect(section.getByText("We found a better place.")).toBeVisible();
  await expect(section.getByText("You.", { exact: true })).toBeVisible();
});

test("section content reveals when reached", async ({ page }) => {
  await page.goto("/");
  const answer = page.locator("section#problem").getByText("You.", { exact: true });
  await answer.scrollIntoViewIfNeeded();
  await expect.poll(() => effectiveOpacity(answer)).toBeGreaterThan(0.99);
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx playwright test tests/e2e/problem.spec.ts`
Expected: FAIL — `section#problem` not found.

- [ ] **Step 3: Implement** — `src/components/sections/Problem.tsx`

```tsx
"use client";

import { motion } from "motion/react";
import { problem } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

export function Problem() {
  return (
    <Section id="problem" title={problem.title}>
      <motion.ul initial="idle" whileInView="struck" viewport={{ once: true, amount: 0.6 }} className="space-y-1 md:space-y-2">
        {problem.destinations.map((destination, i) => (
          <li
            key={destination}
            className="relative w-fit text-[clamp(1.75rem,6.5vw,4.5rem)] leading-tight font-semibold tracking-[-0.035em]"
          >
            <motion.span
              variants={{
                idle: { opacity: 1 },
                struck: { opacity: 0.3, transition: { delay: 0.35 + i * 0.3, duration: 0.4 } },
              }}
            >
              {destination}
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-[0.07em] origin-left -translate-y-1/2 rounded-full bg-accent"
              variants={{
                idle: { scaleX: 0 },
                struck: { scaleX: 1, transition: { delay: 0.2 + i * 0.3, duration: 0.5, ease } },
              }}
            />
          </li>
        ))}
      </motion.ul>

      <Reveal className="mt-20 md:mt-28">
        <p className="text-xl text-muted md:text-2xl">{problem.turn}</p>
        <p className="text-gradient mt-2 w-fit pb-4 text-[clamp(5rem,24vw,14rem)] leading-none font-semibold tracking-[-0.06em]">
          {problem.answer}
        </p>
      </Reveal>
    </Section>
  );
}
```

In `src/app/page.tsx`, import `Problem` from `@/components/sections/Problem` and render `<Problem />` after `<Hero />`.

- [ ] **Step 4: Run all tests to verify they pass**

Run: `npx playwright test`
Expected: PASS.

- [ ] **Step 5: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "feat: add problem section with struck-through fee destinations"
```

---

### Task 5: Comparison table

**Files:**
- Create: `src/components/sections/Compare.tsx`, `tests/e2e/compare.spec.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `compare`; `Section`, `Reveal`.
- Produces: `<Compare />` rendering `<section id="compare">` with a real `<table>`.

- [ ] **Step 1: Write the failing tests** — `tests/e2e/compare.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("compares other launchpads with ForYouPad row by row", async ({ page }) => {
  await page.goto("/");
  const table = page.locator("section#compare").getByRole("table");
  await expect(table.getByRole("columnheader")).toHaveText(["Feature", "Other launchpads", "ForYouPad"]);

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
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx playwright test tests/e2e/compare.spec.ts`
Expected: FAIL on the first test — no table. (The second passes already; it guards future copy.)

- [ ] **Step 3: Implement** — `src/components/sections/Compare.tsx`

```tsx
import { compare } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const cell = "px-3 py-4 align-top md:px-6 md:py-5";

export function Compare() {
  return (
    <Section id="compare" eyebrow={compare.eyebrow} title={compare.title}>
      <Reveal>
        <div className="glass overflow-hidden rounded-[2rem]">
          <table className="w-full table-fixed text-left text-sm break-words hyphens-auto md:text-base">
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className={cell}>
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className={`${cell} font-medium text-muted`}>
                  {compare.columns[0]}
                </th>
                <th scope="col" className={`${cell} bg-accent/7 font-semibold text-fg`}>
                  {compare.columns[1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row) => (
                <tr key={row.label} className="border-b border-white/5 last:border-0">
                  <th scope="row" className={`${cell} font-medium text-fg/80`}>
                    {row.label}
                  </th>
                  <td className={`${cell} text-muted`}>{row.others}</td>
                  <td className={`${cell} bg-accent/7 font-medium text-accent`}>{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
```

In `src/app/page.tsx`, import and render `<Compare />` after `<Problem />`.

- [ ] **Step 4: Run all tests to verify they pass**

Run: `npx playwright test`
Expected: PASS.

- [ ] **Step 5: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "feat: add others-vs-ForYouPad comparison table"
```

---

### Task 6: How it works, Details bento and $FYP

**Files:**
- Create: `src/components/sections/HowItWorks.tsx`, `src/components/sections/Details.tsx`, `src/components/sections/Token.tsx`, `tests/e2e/content.spec.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `steps`, `details`, `token`, `site`; `Section`, `Reveal`, `Badge`.
- Produces: `<HowItWorks />` (`section#how-it-works`), `<Details />` (`section#details`), `<Token />` (`section#token`).

- [ ] **Step 1: Write the failing tests** — `tests/e2e/content.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("how it works lists the three steps in order", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#how-it-works");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText(["Connect.", "Launch.", "Earn."]);
  await expect(section.getByText("Every trade pays you. Claim whenever you want.")).toBeVisible();
});

test("details cover suffix, custody, fees and pump.fun", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#details");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "Ends in fyp.",
    "Non-custodial.",
    "Zero platform fee.",
    "Built on pump.fun.",
  ]);
});

test("$FYP is presented as coming soon", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#token");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("$FYP.");
  await expect(section.getByText("Coming soon")).toBeVisible();
  await expect(section.getByText(/Its creator fees go to its creators\./)).toBeVisible();
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx playwright test tests/e2e/content.spec.ts`
Expected: FAIL — sections not found.

- [ ] **Step 3: Implement**

`src/components/sections/HowItWorks.tsx`:

```tsx
import { steps } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function HowItWorks() {
  return (
    <Section id="how-it-works" eyebrow={steps.eyebrow} title={steps.title}>
      <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
        {steps.items.map((step, i) => (
          <li key={step.number}>
            <Reveal delay={i * 0.08} className="glass h-full rounded-[2rem] p-7 md:p-8">
              <p className="font-mono text-sm text-accent">{step.number}</p>
              <h3 className="mt-10 text-3xl font-semibold tracking-[-0.03em] md:mt-16">{step.title}</h3>
              <p className="mt-3 text-pretty text-muted">{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

`src/components/sections/Details.tsx`:

```tsx
import { details, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Details() {
  return (
    <Section id="details" eyebrow={details.eyebrow} title={details.title}>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {details.items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 0.06}
            className={cn("glass flex min-h-56 flex-col justify-end rounded-[2rem] p-7 md:p-8", item.wide && "md:col-span-2")}
          >
            {i === 0 && (
              <p aria-hidden className="mb-auto font-mono text-[clamp(2.5rem,9vw,5rem)] leading-none tracking-tight">
                <span className="text-subtle">…</span>
                <span className="text-accent">{site.mintSuffix}</span>
              </p>
            )}
            <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
            <p className="mt-2 text-pretty text-muted">{item.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

`src/components/sections/Token.tsx`:

```tsx
import { token } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export function Token() {
  return (
    <section id="token" className="mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-36">
      <Reveal className="glass flex flex-col items-center rounded-[2.5rem] px-6 py-20 text-center md:py-28">
        <p className="mb-4 text-sm font-medium text-accent">{token.eyebrow}</p>
        <h2 className="text-gradient pb-2 text-[clamp(4rem,16vw,10rem)] leading-none font-semibold tracking-[-0.05em]">
          {token.title}
        </h2>
        <p className="mt-6 max-w-lg text-lg text-pretty text-muted md:text-xl">{token.body}</p>
        <Badge className="mt-8 text-accent">{token.badge}</Badge>
      </Reveal>
    </section>
  );
}
```

In `src/app/page.tsx`, import and render `<HowItWorks />`, `<Details />`, `<Token />` (in that order) after `<Compare />`.

- [ ] **Step 4: Run all tests to verify they pass**

Run: `npx playwright test`
Expected: PASS.

- [ ] **Step 5: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "feat: add how-it-works, details bento and \$FYP sections"
```

---

### Task 7: FAQ, footer, and whole-page robustness checks

**Files:**
- Create: `src/components/sections/Faq.tsx`, `src/components/sections/Footer.tsx`, `tests/e2e/page.spec.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `faq`, `footer`, `navLinks`; `Section`, `Reveal`, `Badge`; `effectiveOpacity` from `tests/e2e/helpers.ts`.
- Produces: `<Faq />` (`section#faq`, native `<details>`/`<summary>`), `<Footer />`. Final `page.tsx` order: Nav, main[Hero, Problem, Compare, HowItWorks, Details, Token, Faq], Footer.

- [ ] **Step 1: Write the failing tests** — `tests/e2e/page.spec.ts`

```ts
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
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx playwright test tests/e2e/page.spec.ts`
Expected: FAIL — `section#faq` and `contentinfo` missing; nav links point at `#faq` with no section.

- [ ] **Step 3: Implement**

`src/components/sections/Faq.tsx`:

```tsx
import { faq } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Faq() {
  return (
    <Section id="faq" eyebrow={faq.eyebrow} title={faq.title}>
      <Reveal className="glass divide-y divide-white/5 rounded-[2rem]">
        {faq.items.map((item) => (
          <details key={item.q} className="group px-6 md:px-8">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-xl [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full bg-white/5 text-muted transition-transform duration-300 ease-spring group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-pretty text-muted">{item.a}</p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
```

`src/components/sections/Footer.tsx`:

```tsx
import { footer } from "@/content/site";
import { Badge } from "@/components/ui/Badge";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl border-t border-white/10 px-5 pt-12 pb-16 md:px-8">
      <p className="text-2xl font-semibold tracking-[-0.03em]">{footer.tagline}</p>
      <p className="mt-4 max-w-xl text-sm text-pretty text-muted">{footer.risk}</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
        {footer.socials.map((name) => (
          <span key={name} className="inline-flex items-center gap-2">
            {name}
            <Badge className="opacity-60">Soon</Badge>
          </span>
        ))}
        <span className="md:ml-auto">{footer.copyright}</span>
      </div>
    </footer>
  );
}
```

Final `src/app/page.tsx`:

```tsx
import { Compare } from "@/components/sections/Compare";
import { Details } from "@/components/sections/Details";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Nav } from "@/components/sections/Nav";
import { Problem } from "@/components/sections/Problem";
import { Token } from "@/components/sections/Token";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Compare />
        <HowItWorks />
        <Details />
        <Token />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run all tests to verify they pass**

Run: `npx playwright test`
Expected: PASS. If “no content overflows at 375 px” fails, the message lists the offending element — fix it by reducing that element's `clamp()` minimum or adding `break-words`, never by hiding overflow.

- [ ] **Step 5: Visual check**

```bash
npx serve out -l 4173 -n &
npx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=4000 http://localhost:4173 /tmp/fyp-desktop.png
npx playwright screenshot --viewport-size=375,812 --full-page --wait-for-timeout=4000 http://localhost:4173 /tmp/fyp-mobile.png
kill %1
```

Open both PNGs and check: glass cards readable against the ambient glows, hero title on two lines, compare table legible on mobile, no element visibly misaligned. (Sections below the fold may appear faded in full-page shots because reveals trigger on scroll — that is expected.)

- [ ] **Step 6: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "feat: add FAQ and footer, complete landing page"
```

---

### Task 8: Open Graph image and favicon

**Files:**
- Create: `scripts/og.mjs`, `public/og.png` (generated), `src/app/icon.svg`, `tests/e2e/meta.spec.ts`
- Modify: `src/app/layout.tsx` (metadata images), `package.json` (script `og`)

**Interfaces:**
- Consumes: `siteUrl`, `site`.
- Produces: `public/og.png` (1200×630); `og:image` / `twitter:image` = `${siteUrl}/og.png`; favicon at `/icon.svg` (basePath-aware via Next metadata).

- [ ] **Step 1: Write the failing test** — `tests/e2e/meta.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("share image and favicon are wired and served", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "http://localhost:4173/og.png");
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", "http://localhost:4173/og.png");

  const og = await request.get("/og.png");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toBe("image/png");

  const iconHref = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(iconHref).toMatch(/icon\.svg/);
  expect((await request.get(iconHref!)).status()).toBe(200);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/e2e/meta.spec.ts`
Expected: FAIL — no `og:image` meta.

- [ ] **Step 3: Write the OG generator** — `scripts/og.mjs`

```js
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
```

Add to `package.json` scripts: `"og": "node scripts/og.mjs"`, then run:

```bash
npm run og
```

Expected: `wrote public/og.png`. Open it and check the text is in Geist, not a serif fallback.

- [ ] **Step 4: Favicon** — `src/app/icon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="15" fill="#050608"/>
  <text x="32" y="42" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="27" font-weight="700" letter-spacing="-1" fill="#7cf5c0">fyp</text>
</svg>
```

- [ ] **Step 5: Wire the image into metadata** — in `src/app/layout.tsx` replace the `metadata` object with:

```tsx
const ogImage = { url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: title };

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title,
  description: site.description,
  openGraph: { title, description: site.description, siteName: site.name, type: "website", images: [ogImage] },
  twitter: { card: "summary_large_image", title, description: site.description, images: [ogImage.url] },
};
```

- [ ] **Step 6: Run all tests to verify they pass**

Run: `npx playwright test`
Expected: PASS.

- [ ] **Step 7: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck
git add -A
git commit -m "feat: add Open Graph image and favicon"
```

---

### Task 9: Deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build:pages`, env `PAGES_BASE_PATH`, `NEXT_PUBLIC_SITE_URL`.
- Produces: live site at `https://letaih.github.io/newpad/`.

- [ ] **Step 1: Verify the sub-path build locally before touching CI**

```bash
PAGES_BASE_PATH=/newpad NEXT_PUBLIC_SITE_URL=https://letaih.github.io/newpad npm run build:pages
grep -o 'property="og:image" content="[^"]*"' out/index.html
grep -o 'rel="icon" href="[^"]*"' out/index.html
grep -o 'href="/newpad/_next/static/[^"]*\.css"' out/index.html | head -1
```

Expected:
- `property="og:image" content="https://letaih.github.io/newpad/og.png"`
- icon href starts with `/newpad/icon.svg`
- one CSS href under `/newpad/_next/static/`

- [ ] **Step 2: Write `.github/workflows/deploy.yml`** (action majors checked on 2026-09-25 with `gh api repos/<action>/releases/latest`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - id: pages
        uses: actions/configure-pages@v6
      - run: npm run lint && npm run typecheck
      - run: npm run build:pages
        env:
          PAGES_BASE_PATH: ${{ steps.pages.outputs.base_path }}
          NEXT_PUBLIC_SITE_URL: ${{ steps.pages.outputs.base_url }}
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v5
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy static export to GitHub Pages"
```

- [ ] **Step 4: Ask the user before publishing.** The repo `LeTaih/newpad` is currently **private**; GitHub Pages on a private repo requires a paid GitHub plan. Ask whether to (a) make the repo public, or (b) keep it private (paid plan). Do not change visibility or push without an explicit answer.

- [ ] **Step 5: Enable Pages (Actions source) and push**

```bash
gh api -X POST repos/LeTaih/newpad/pages -f build_type=workflow
git push -u origin main
gh run watch --exit-status $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')
```

Expected: the run finishes with both `build` and `deploy` jobs green.

- [ ] **Step 6: Verify the live site**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://letaih.github.io/newpad/
curl -s https://letaih.github.io/newpad/ | grep -o '<title>[^<]*'
css=$(curl -s https://letaih.github.io/newpad/ | grep -o '/newpad/_next/static/[^"]*\.css' | head -1)
curl -s -o /dev/null -w "%{http_code}\n" "https://letaih.github.io$css"
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://letaih.github.io/newpad/og.png
```

Expected: `200`; `<title>ForYouPad — Creator fees. For you.`; `200`; `200 image/png`.
