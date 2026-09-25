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
