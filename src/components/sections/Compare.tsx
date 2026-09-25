import { compare } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const cell = "px-3 py-4 align-top md:px-6 md:py-5";

export function Compare() {
  return (
    <Section id="compare" eyebrow={compare.eyebrow} title={compare.title}>
      <Reveal>
        <div className="glass overflow-hidden rounded-[2rem]">
          <table className="w-full table-fixed text-left text-sm break-words hyphens-auto md:text-base">
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className={cell}>
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className={`${cell} font-medium text-muted`}>
                  {compare.columns[0]}
                </th>
                <th scope="col" className={`${cell} bg-accent/7 font-semibold text-fg`}>
                  {compare.columns[1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row) => (
                <tr key={row.label} className="border-b border-white/5 last:border-0">
                  <th scope="row" className={`${cell} font-medium text-fg/80`}>
                    {row.label}
                  </th>
                  <td className={`${cell} text-muted`}>{row.others}</td>
                  <td className={`${cell} bg-accent/7 font-medium text-accent`}>{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
