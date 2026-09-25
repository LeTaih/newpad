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
