import { test, expect, STORAGE } from '../fixtures';
import { PRODUCTS } from '../data/products';
import { env } from '../config/env';

/**
 * Logging in once. This line is the whole trick:
 */
test.use({ storageState: STORAGE.customer });
/**
 * Every test in this file starts with the session auth.setup.ts saved - already signed in,
 * no form. Notice there is no sign-in step anywhere below.
 *
 * The catch: all of these tests are the SAME customer, at the same time. That is only safe
 * because they only READ. A test that changes the cart must not use this - it uses the
 * `shopper` fixture and gets a customer of its own.
 */

test('the header shows who is signed in', async ({ shopPage }) => {
  await shopPage.goto();
  await expect(shopPage.header.userEmail).toHaveText(env.customer.email);
});

test('the shop lists all four products', async ({ shopPage }) => {
  await shopPage.goto();
  await expect(shopPage.productCards).toHaveCount(4);
});

test('the drill shows the catalogue price', async ({ shopPage }) => {
  await shopPage.goto();
  await expect(shopPage.priceOf(PRODUCTS.drill.name)).toHaveText(PRODUCTS.drill.price);
});
