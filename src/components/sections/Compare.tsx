import { compare } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/*
 * Three columns from sm up. Below that there is no room for three columns of words,
 * so each row becomes a two-column grid: the feature label spans the top, the two
 * answers sit side by side beneath it. Explicit roles keep the table semantics
 * that some engines drop when a table element's display changes.
 */
const cell = "px-4 py-4 align-top sm:px-3 md:px-6 md:py-5";
const ours = "sm:bg-accent/7";

export function Compare() {
  return (
    <Section id="compare" eyebrow={compare.eyebrow} title={compare.title}>
      <Reveal>
        <div className="glass overflow-hidden rounded-[2rem]">
          <table role="table" className="w-full text-left text-[15px] max-sm:block sm:table-fixed md:text-base">
            <thead role="rowgroup" className="max-sm:block">
              <tr role="row" className="border-b border-white/10 max-sm:grid max-sm:grid-cols-2">
                <th role="columnheader" scope="col" className={`${cell} max-sm:sr-only`}>
                  <span className="sr-only">Feature</span>
                </th>
                <th role="columnheader" scope="col" className={`${cell} font-medium text-muted`}>
                  {compare.columns[0]}
                </th>
                <th role="columnheader" scope="col" className={`${cell} ${ours} font-semibold text-fg`}>
                  {compare.columns[1]}
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup" className="max-sm:block">
              {compare.rows.map((row) => (
                <tr
                  role="row"
                  key={row.label}
                  className="border-b border-white/5 last:border-0 max-sm:grid max-sm:grid-cols-2"
                >
                  <th
                    role="rowheader"
                    scope="row"
                    className={`${cell} font-medium text-fg/80 max-sm:col-span-2 max-sm:pb-1 max-sm:text-[13px] max-sm:text-fg/60`}
                  >
                    {row.label}
                  </th>
                  <td role="cell" className={`${cell} text-muted max-sm:pt-0`}>
                    {row.others}
                  </td>
                  <td role="cell" className={`${cell} ${ours} font-medium text-accent max-sm:pt-0`}>
                    {row.us}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
