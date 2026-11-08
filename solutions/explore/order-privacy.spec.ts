import { test, expect } from '../fixtures';
import { PRODUCTS } from '../data/products';

/**
 * MODEL ANSWER - EX 6. Copy over explore/order-privacy.spec.ts to run it.
 *
 * Against the starter shop this test FAILS: customer B gets a 200 and customer A's order -
 * name, e-mail address, everything they bought. That is Broken Access Control, number one on
 * the OWASP Top 10. The bug report is in solutions/docs/BUG-ORDERS.md.
 */

test("a customer cannot open another customer's order", async ({ shopper, shopApi, otherCustomer }) => {
  // 1. Customer A orders something
  await shopApi.addToCart(PRODUCTS.drill.id, 1);
  const order = await shopApi.placeOrder();

  // 2. Customer B asks for that order by its number
  const response = await otherCustomer.getOrder(order.orderId);

  // 3. B must be turned away - and must not be told the order exists (404, not 403).
  //    The message is for whoever reads the failure in the pipeline.
  expect(response.status(), `customer B was able to open ${order.orderId}, which belongs to customer A`).toBe(404);
});

/**
 * And the other half - always check it. A test that only ever expects a refusal also passes
 * when the endpoint is simply broken for everybody.
 */
test('a customer can open their own order', async ({ shopper, shopApi }) => {
  await shopApi.addToCart(PRODUCTS.drill.id, 1);
  const order = await shopApi.placeOrder();

  const response = await shopApi.getOrder(order.orderId);

  await expect(response).toBeOK();
  expect((await response.json()).total).toBe(PRODUCTS.drill.price);
});
