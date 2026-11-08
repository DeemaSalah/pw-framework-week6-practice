import { test, expect } from '../fixtures';

/**
 * Written against CartPage (Week 5, EX 3), which is a fixture (EX 4).
 * No raw locators left. Each test reads as what the customer does and what they should see.
 */

test('a product added in the shop appears in the cart', async ({ shopper, shopPage, cartPage }) => {
  await shopPage.goto();
  await shopPage.addToCart('Combination Pliers');

  await cartPage.goto();
  await expect(cartPage.line('Combination Pliers')).toBeVisible();
  await expect(cartPage.quantityOf('Combination Pliers')).toHaveValue('1');
  await expect(cartPage.total).toHaveText('$14.15');
});

test('changing the quantity updates the totals', async ({ shopper, shopPage, cartPage }) => {
  await shopPage.goto();
  await shopPage.addToCart('Combination Pliers');

  await cartPage.goto();
  await cartPage.setQuantity('Combination Pliers', 3);

  await expect(cartPage.lineTotalOf('Combination Pliers')).toHaveText('$42.45');
  await expect(cartPage.total).toHaveText('$42.45');
  await expect(cartPage.header.cartCount).toHaveText('3');
});

test('removing the only product empties the cart', async ({ shopper, shopPage, cartPage }) => {
  await shopPage.goto();
  await shopPage.addToCart('Claw Hammer');

  await cartPage.goto();
  await cartPage.remove('Claw Hammer');

  await expect(cartPage.emptyMessage).toBeVisible();
  await expect(cartPage.header.cartCount).toHaveText('0');
});
