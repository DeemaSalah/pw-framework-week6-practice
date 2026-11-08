import { test, expect } from '../fixtures';

/**
 * MUSEUM PIECE - a flaky test, kept on purpose.
 *
 * Most cart saves take the shop under a tenth of a second; about one in four takes nearly half a
 * second, like a real server on a busy day. This test waits a fixed 250ms and then reads the badge
 * once. Most of the time that is enough.
 *
 * Run it ten times with retries switched on, the way CI does:
 *     npm run museum -- flaky --retries=2 --repeat-each=10
 *
 * Most runs come back green. Read the summary line anyway - the word "flaky" is in it.
 * Then open the report (npm run report) and filter by Flaky.
 *
 * The fix is one line. You have known it since Week 4.
 */
test('the cart badge counts a product as soon as it is added', async ({ page, shopper, shopPage }) => {
  await shopPage.goto();
  await shopPage.product('Combination Pliers').getByRole('button', { name: 'Add to cart' }).click();

  await page.waitForTimeout(250); // "long enough" - usually
  const count = await shopPage.header.cartCount.textContent();
  expect(count).toBe('1');
});
