import { launchCta, navLinks, site } from "@/content/site";
import { ComingSoonButton } from "@/components/ui/Buttons";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav aria-label="Main" className="glass mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full pr-2 pl-5">
        <a href="#top" className="text-[15px] font-semibold tracking-tight">
          {site.name.replace("Pad", "")}
          <span className="text-muted">Pad</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm text-muted md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors duration-200 hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ComingSoonButton className="h-10 px-4 text-sm">{launchCta}</ComingSoonButton>
      </nav>
    </header>
  );
}
