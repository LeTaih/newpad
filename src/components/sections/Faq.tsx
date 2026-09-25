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
