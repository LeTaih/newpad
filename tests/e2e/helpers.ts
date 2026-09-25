import type { Locator } from "@playwright/test";

/** Product of the element's opacity and all its ancestors' — 1 means fully visible. */
export function effectiveOpacity(locator: Locator): Promise<number> {
  return locator.evaluate((el) => {
    let opacity = 1;
    for (let node: Element | null = el; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity);
    }
    return opacity;
  });
}
