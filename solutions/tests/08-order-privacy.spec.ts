import { test, expect } from '../fixtures';
import { PRODUCTS } from '../data/products';

/**
 * MODEL ANSWER - final project, part 3. Belongs at tests/08-order-privacy.spec.ts.
 *
 * The EX 6 test, moved into the suite and marked as a KNOWN failure. test.fail() flips the result:
 *   - while the bug exists, the test fails as expected, and the build stays green
 *   - the day someone fixes the bug, the test passes unexpectedly, and the build goes RED -
 *     telling you to delete the test.fail line, so the test guards the fix from then on.
 * The reason string is what the report shows. Point it at the bug report.
 */

test("a customer cannot open another customer's order", async ({ shopper, shopApi, otherCustomer }) => {
  test.fail(true, 'BUG-ORDERS: any customer can read any order - docs/BUG-ORDERS.md');

  await shopApi.addToCart(PRODUCTS.drill.id, 1);
  const order = await shopApi.placeOrder();

  const response = await otherCustomer.getOrder(order.orderId);

  expect(response.status(), `customer B was able to open ${order.orderId}, which belongs to customer A`).toBe(404);
});

test('a customer can open their own order', async ({ shopper, shopApi }) => {
  await shopApi.addToCart(PRODUCTS.drill.id, 1);
  const order = await shopApi.placeOrder();

  const response = await shopApi.getOrder(order.orderId);

  await expect(response).toBeOK();
  expect((await response.json()).total).toBe(PRODUCTS.drill.price);
});
