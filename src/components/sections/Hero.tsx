import { hero, launchCta } from "@/content/site";
import { ComingSoonButton, LinkButton } from "@/components/ui/Buttons";
import { Reveal } from "@/components/ui/Reveal";
import { CoinCard } from "./CoinCard";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center gap-16 px-5 pt-32 pb-20 short:gap-12 short:pt-24 md:px-8 lg:flex-row lg:justify-between lg:gap-10"
    >
      <div className="max-w-2xl text-center lg:text-left">
        <Reveal>
          <p className="mb-5 text-sm font-medium text-accent short:mb-3">{hero.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] short:text-5xl">
            {hero.titleLines[0]}
            <br className="short:hidden" />{" "}
            <span className="text-gradient">{hero.titleLines[1]}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted short:mt-4 short:text-base md:text-xl lg:mx-0">
            {hero.subtitleLines[0]} <span className="block">{hero.subtitleLines[1]}</span>
          </p>
        </Reveal>
        <Reveal
          delay={0.15}
          className="mt-10 flex flex-col items-center gap-3 max-sm:w-full short:mt-6 sm:flex-row sm:justify-center lg:justify-start"
        >
          <ComingSoonButton className="w-full max-w-72 sm:w-auto">{launchCta}</ComingSoonButton>
          <LinkButton variant="glass" href={hero.secondaryCta.href} className="w-full max-w-72 sm:w-auto">
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
