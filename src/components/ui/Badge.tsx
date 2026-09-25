import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-current/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
