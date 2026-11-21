import { test, expect } from '../fixtures';
import { PRODUCTS } from '../data/products';

/**
 * EX 6 - can one customer read another customer's order?
 *
 * The shop has a new endpoint: GET /api/orders/ORD-1234 returns one order - for the confirmation
 * e-mail and the "Your order" link. Order numbers count up by one. Someone who has ORD-1234 can
 * guess ORD-1233.
 *
 * You have two customers:
 *   shopper + shopApi   customer A - signed in, in this test's browser
 *   otherCustomer       customer B - signed in separately, nothing shared with A
 *
 */

test("a customer cannot open another customer's order", async ({ shopper, shopApi, otherCustomer }) => {
  test.fail();

  // 1. Customer A orders something
  await shopApi.addToCart(PRODUCTS.hammer.id);
  const order = await shopApi.placeOrder();

  // 2. Customer B asks for that order by its number
  const response = await otherCustomer.getOrder(order.orderId);

  // 3. B must be turned away
  expect(response.status()).toBe(404);
});
