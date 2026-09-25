import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

type Variant = "primary" | "glass";
type Size = "md" | "sm";

const base =
  "inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-tight whitespace-nowrap transition-[transform,background-color] duration-200 ease-spring focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

// Sizes are exclusive sets so callers never fight the base classes (cn does not merge).
const sizes: Record<Size, string> = {
  md: "h-12 gap-2 px-6 text-[15px]",
  sm: "h-10 gap-1.5 px-3.5 text-sm min-[360px]:gap-2 min-[360px]:px-4",
};

const variants: Record<Variant, string> = {
  primary: "bg-fg text-ink",
  glass: "glass text-fg",
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size }) {
  return (
    <a
      className={cn(
        base,
        sizes[size],
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
  size = "md",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title="Coming soon"
      className={cn(base, sizes[size], variants[variant], "cursor-default", className)}
    >
      {children}
      <Badge className="opacity-60">Soon</Badge>
    </button>
  );
}
