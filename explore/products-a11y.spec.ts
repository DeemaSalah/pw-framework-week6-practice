import { test, expect } from '../fixtures';
import { accessibilityProblems } from '../support/accessibility';

/**
 * EX 4 - this test FAILS. That is the point: it is how you find out what is wrong.
 *
 *   npm run explore -- a11y
 *
 * Read the list it prints. Each line is one kind of problem, then -> the elements that have it.
 * For each: what is the problem, who does it stop, and where is it on the page? Then fix them in
 * app/public/index.html and app/public/app.css, and run it again until it passes.
 *
 * Then put the mouse away and press Tab, all the way down the page. axe cannot do that part.
 *
 * When it passes, move this test into tests/07-accessibility.spec.ts - now it guards the page.
 */

test('the products page has no problems axe can find', async ({ page, shopper, shopPage }) => {
  await shopPage.goto();
  await expect(shopPage.productCards).toHaveCount(4); // the finished page, not the loading one

  expect(await accessibilityProblems(page)).toEqual([]);
});
