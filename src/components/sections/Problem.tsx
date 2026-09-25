"use client";

import { motion, useReducedMotion } from "motion/react";
import { problem } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

export function Problem() {
  // MotionConfig only neutralises transforms; the background sweep must be told to jump to its end state.
  const reduceMotion = useReducedMotion();
  return (
    <Section id="problem" title={problem.title}>
      <motion.ul initial="idle" whileInView="struck" viewport={{ once: true, amount: 0.6 }} className="space-y-1 md:space-y-2">
        {problem.destinations.map((destination, i) => (
          <li
            key={destination}
            className="text-[clamp(1.75rem,6.5vw,4.5rem)] leading-tight font-semibold tracking-[-0.035em] text-balance"
          >
            {/* The strike is a background on the inline text, so it follows the words onto a second line. */}
            <motion.span
              className="bg-linear-to-r from-accent to-accent bg-no-repeat [background-position:0_52%]"
              variants={{
                idle: { backgroundSize: "0% 0.07em", color: "rgba(245, 245, 247, 1)" },
                struck: {
                  backgroundSize: "100% 0.07em",
                  color: "rgba(245, 245, 247, 0.4)",
                  transition: reduceMotion
                    ? { duration: 0, delay: 0 }
                    : {
                        backgroundSize: { delay: 0.2 + i * 0.3, duration: 0.5, ease },
                        color: { delay: 0.35 + i * 0.3, duration: 0.4 },
                      },
                },
              }}
            >
              {destination}
            </motion.span>
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
