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
