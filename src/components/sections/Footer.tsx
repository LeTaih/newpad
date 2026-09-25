import { footer } from "@/content/site";
import { Badge } from "@/components/ui/Badge";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl border-t border-white/10 px-5 pt-12 pb-16 md:px-8">
      <p className="text-2xl font-semibold tracking-[-0.03em] text-balance">{footer.tagline}</p>
      <p className="mt-4 max-w-xl text-sm text-pretty text-muted">{footer.risk}</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
        {footer.socials.map((name) => (
          <span key={name} className="inline-flex items-center gap-2">
            {name}
            <Badge className="opacity-60">Soon</Badge>
          </span>
        ))}
        <span className="md:ml-auto">{footer.copyright}</span>
      </div>
    </footer>
  );
}
