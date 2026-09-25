"use client";

import { motion } from "motion/react";
import { hero, site } from "@/content/site";
import { Badge } from "@/components/ui/Badge";

export function CoinCard() {
  const { card } = hero;
  return (
    <motion.div
      aria-hidden
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="glass w-[min(21rem,calc(100vw-2.5rem))] rounded-[2rem] p-6"
    >
      <div className="flex items-center gap-4">
        <div className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-accent to-[#3b5bff] text-lg font-semibold text-ink">
          Y
        </div>
        <div>
          <p className="font-semibold tracking-tight">{card.name}</p>
          <p className="text-sm text-fg/65">{card.ticker}</p>
        </div>
        <Badge className="ml-auto text-accent">Live</Badge>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
          <dt className="text-fg/65">Mint</dt>
          <dd className="font-mono">
            {card.mintPrefix}
            <span className="text-accent">{site.mintSuffix}</span>
          </dd>
        </div>
        {card.rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b border-white/5 pb-3 last:border-0">
            <dt className="text-fg/65">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-fg/65">
          <span>Bonding curve</span>
          <span className="font-mono">{card.bondingPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent" style={{ width: `${card.bondingPercent}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
