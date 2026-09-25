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
