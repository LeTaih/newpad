import { details, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

type Visual = (typeof details.items)[number]["visual"];

const figure = "font-mono text-[clamp(2.5rem,9vw,5rem)] leading-none tracking-tight";

/** Decorative glyph at the top of each tile; the heading and body carry the meaning. */
function TileVisual({ visual }: { visual: Visual }) {
  switch (visual) {
    case "suffix":
      return (
        <p className={figure}>
          <span className="text-subtle">…</span>
          <span className="text-accent">{site.mintSuffix}</span>
        </p>
      );
    case "zero":
      return (
        <p className={figure}>
          <span className="text-accent">0</span>
          <span className="text-subtle">%</span>
        </p>
      );
    case "lock":
      return (
        <svg viewBox="0 0 48 56" className="h-[clamp(2.75rem,9vw,4.75rem)] w-auto" fill="none">
          <path d="M13 24v-8a11 11 0 0 1 22 0v8" stroke="currentColor" strokeWidth="3" className="text-subtle" />
          <rect x="4" y="24" width="40" height="30" rx="8" className="fill-white/[0.04] stroke-white/20" strokeWidth="1.5" />
          <circle cx="24" cy="37" r="3.5" className="fill-accent" />
          <path d="M24 40v6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent" />
        </svg>
      );
    case "curve":
      return (
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="h-[clamp(3rem,9vw,5rem)] w-full" fill="none">
          <defs>
            <linearGradient id="details-curve" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.15" />
              <stop offset="1" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <path d="M0 99H400" stroke="white" strokeOpacity="0.08" vectorEffect="non-scaling-stroke" />
          <path
            d="M0 96C140 94 260 76 400 4"
            stroke="url(#details-curve)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
  }
}

export function Details() {
  return (
    <Section id="details" eyebrow={details.eyebrow} title={details.title}>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {details.items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 0.06}
            className={cn("glass flex min-h-60 flex-col rounded-[2rem] p-7 md:min-h-72 md:p-8", item.wide && "lg:col-span-2")}
          >
            <div aria-hidden className="mb-auto">
              <TileVisual visual={item.visual} />
            </div>
            <h3 className="mt-10 text-2xl font-semibold tracking-[-0.03em] text-balance">{item.title}</h3>
            <p className="mt-2 text-pretty text-muted">{item.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
