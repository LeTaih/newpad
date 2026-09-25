import { launchCta, navLinks, site } from "@/content/site";
import { ComingSoonButton } from "@/components/ui/Buttons";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 min-[360px]:top-4 min-[360px]:px-4">
      <nav aria-label="Main" className="glass mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full pr-2 pl-4 min-[360px]:pl-5">
        <a href="#top" className="text-[15px] font-semibold tracking-tight">
          {site.name.replace("Pad", "")}
          <span className="text-fg/65">Pad</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm text-fg/65 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors duration-200 hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ComingSoonButton size="sm">{launchCta}</ComingSoonButton>
      </nav>
    </header>
  );
}
