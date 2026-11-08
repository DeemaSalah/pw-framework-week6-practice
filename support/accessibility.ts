import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/** The WCAG 2.0, 2.1 and 2.2 rules at levels A and AA - AA is the level most laws and contracts ask for. */
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Runs axe (the engine behind most accessibility checkers) on the page as it is right now,
 * and returns one readable line per kind of problem, with the elements that have it:
 *
 *   critical  button-name  Buttons must have discernible text  -> .promo-close
 *
 * An empty list means axe found nothing - NOT that the page is accessible. Automated checks find
 * roughly half of real problems. The rest need a keyboard, a screen reader and a person.
 */
export async function accessibilityProblems(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  return results.violations.map(
    (v) => `${v.impact}  ${v.id}  ${v.help}  -> ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
}
