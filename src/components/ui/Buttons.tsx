import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

type Variant = "primary" | "glass";

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium tracking-tight whitespace-nowrap transition-[transform,background-color] duration-200 ease-spring focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-ink",
  glass: "glass text-fg",
};

export function LinkButton({
  variant = "primary",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a
      className={cn(
        base,
        variants[variant],
        variant === "primary" ? "hover:bg-white" : "hover:bg-white/10",
        "active:scale-[0.97]",
        className,
      )}
      {...props}
    />
  );
}

export function ComingSoonButton({
  children,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <button type="button" aria-disabled="true" title="Coming soon" className={cn(base, variants[variant], "cursor-default", className)}>
      {children}
      <Badge className="opacity-60">Soon</Badge>
    </button>
  );
}
