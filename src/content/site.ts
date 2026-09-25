export const site = {
  name: "ForYouPad",
  domain: "foryoupad.fun",
  mintSuffix: "fyp",
  tagline: "Creator fees. For you.",
  description:
    "The next generation of token launches. Launch a token and point its creator fees at the one person who deserves them: you. No treasury. No middleman. No cut.",
} as const;

export const launchCta = "Launch a token";

export const navLinks = [
  { label: "Compare", href: "#compare" },
  { label: "How it works", href: "#how-it-works" },
  { label: "$FYP", href: "#token" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  eyebrow: "The next generation of token launches.",
  titleLines: ["Creator fees.", "For you."],
  subtitleLines: [
    "Launch a token and point its creator fees at the one person who deserves them: you.",
    "No treasury. No middleman. No cut.",
  ],
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  card: {
    name: "Your Token",
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
  columns: ["Everyone else", "ForYouPad"],
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
    {
      number: "01",
      title: "Launch.",
      body: "Name, ticker, image, and the wallet that should get paid. It's yours. It's already filled in.",
    },
    { number: "02", title: "Fees accrue.", body: "Every trade on your token pays a creator fee. To you." },
    { number: "03", title: "You get paid.", body: "100% of every claim goes to the creator. That's you." },
  ],
} as const;

export const details = {
  eyebrow: "Details",
  title: "Everything else. Obviously.",
  items: [
    { title: "Ends in fyp.", body: "Every token launched here gets an address that ends in fyp.", wide: true, visual: "suffix" },
    { title: "Non-custodial.", body: "You sign every transaction. We never hold funds.", wide: false, visual: "lock" },
    { title: "Zero platform fee.", body: "You pay the standard creation cost. We add nothing.", wide: false, visual: "zero" },
    { title: "Same curve. Same traders.", body: "Your token trades exactly where it would have anyway.", wide: true, visual: "curve" },
  ],
} as const;

export const token = {
  eyebrow: "The platform token",
  title: "$FYP.",
  body: "Our own token, launched on ForYouPad. Its creator fees go to its creators. Like every token here.",
  badge: "Coming soon",
} as const;

export const faq = {
  eyebrow: "FAQ",
  title: "Questions. Answered.",
  items: [
    {
      q: "Isn't this just how pump.fun already works?",
      a: "Yes. That's the point. Everyone else added a detour. We removed it.",
    },
    {
      q: "What's the catch?",
      a: "There isn't one. We earn the same way you do: from the creator fees of our own token, $FYP.",
    },
    {
      q: "Do you ever hold my funds?",
      a: "Never. You sign every transaction from your own wallet. Your token's creator is your address, not ours.",
    },
    {
      q: "How much does it cost?",
      a: "The standard creation cost and network rent (around 0.02–0.04 SOL). ForYouPad adds nothing.",
    },
    {
      q: "Why do addresses end in fyp?",
      a: "So everyone knows where the token came from. And where its fees go.",
    },
    {
      q: "Is this financial advice?",
      a: "No. Memecoins are extremely volatile and most go to zero. Only use money you can afford to lose.",
    },
  ],
} as const;

export const notFound = {
  title: "Nothing here.",
  body: "Your fees are still yours. This page just isn't one of ours.",
  cta: "Back to ForYouPad",
} as const;

export const footer = {
  tagline: "Designed for you. Fees included.",
  about: "Token creator fees, routed to the token's creator. Built on pump.fun and Solana.",
  risk: "Memecoins are extremely volatile and most go to zero. Nothing on this site is financial advice.",
  socials: ["X", "Telegram"],
  copyright: "© 2026 ForYouPad",
} as const;
