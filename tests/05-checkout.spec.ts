import { test, expect } from '../fixtures';
import { PRODUCTS } from '../data/products';

/**
 * Week 5, EX 5. Two tests of the same thing - checkout. The first does everything through the
 * browser; the second builds its starting point through the API. Compare their times in the report.
 */

test('a customer can buy three pliers - everything through the UI', async ({ page, freshUser, loginPage, shopPage }) => {
  await loginPage.goto();
  await loginPage.signIn(freshUser.email, freshUser.password);

  await shopPage.addToCart('Combination Pliers');
  await shopPage.addToCart('Combination Pliers');
  await shopPage.addToCart('Combination Pliers');
  await shopPage.header.openCart();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page.getByTestId('order-number')).toHaveText(/^ORD-\d+$/);
  await expect(page.getByTestId('cart-count')).toHaveText('0');
});

test('a customer can buy three pliers - setup through the API', async ({ shopper, shopApi, cartPage }) => {
  // Arrange: through the API. Not what this test is about, so do it the fast way.
  await shopApi.addToCart(PRODUCTS.pliers.id, 3);

  // Act: through the UI. This IS what the test is about.
  await cartPage.goto();
  await expect(cartPage.total).toHaveText('$42.45');
  await cartPage.placeOrder();

  // Assert: what the customer sees...
  await expect(cartPage.orderNumber).toHaveText(/^ORD-\d+$/);
  await expect(cartPage.header.cartCount).toHaveText('0');

  // ...and what the server actually recorded. The screen can say "confirmed" and be wrong.
  const cart = await shopApi.getCart();
  expect(cart.lines).toHaveLength(0);
  const orders = await shopApi.getOrders();
  expect(orders).toHaveLength(1);
  expect(orders[0].total).toBe('$42.45');
});
