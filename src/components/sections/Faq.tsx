import { faq } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Faq() {
  return (
    <Section id="faq" eyebrow={faq.eyebrow} title={faq.title}>
      <Reveal className="glass max-w-4xl divide-y divide-white/5 rounded-[2rem]">
        {faq.items.map((item) => (
          <details key={item.q} className="group px-6 md:px-8">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] leading-snug font-medium tracking-tight text-balance focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-xl [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-fg/70 transition-transform duration-300 ease-spring group-open:rotate-45"
              >
                <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 1.5v9M1.5 6h9" />
                </svg>
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-pretty text-muted">{item.a}</p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
