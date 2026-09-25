"use client";

import { motion } from "motion/react";
import { problem } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

export function Problem() {
  return (
    <Section id="problem" title={problem.title}>
      <motion.ul initial="idle" whileInView="struck" viewport={{ once: true, amount: 0.6 }} className="space-y-1 md:space-y-2">
        {problem.destinations.map((destination, i) => (
          <li
            key={destination}
            className="relative w-fit text-[clamp(1.75rem,6.5vw,4.5rem)] leading-tight font-semibold tracking-[-0.035em]"
          >
            <motion.span
              variants={{
                idle: { opacity: 1 },
                struck: { opacity: 0.3, transition: { delay: 0.35 + i * 0.3, duration: 0.4 } },
              }}
            >
              {destination}
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-[0.07em] origin-left -translate-y-1/2 rounded-full bg-accent"
              variants={{
                idle: { scaleX: 0 },
                struck: { scaleX: 1, transition: { delay: 0.2 + i * 0.3, duration: 0.5, ease } },
              }}
            />
          </li>
        ))}
      </motion.ul>

      <Reveal className="mt-20 md:mt-28">
        <p className="text-xl text-muted md:text-2xl">{problem.turn}</p>
        <p className="text-gradient mt-2 w-fit pb-4 text-[clamp(5rem,24vw,14rem)] leading-none font-semibold tracking-[-0.06em]">
          {problem.answer}
        </p>
      </Reveal>
    </Section>
  );
}
