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
