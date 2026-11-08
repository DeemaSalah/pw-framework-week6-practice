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
 * Write the test:
 *   1. A puts something in the cart and places an order        (shopApi.addToCart, shopApi.placeOrder)
 *   2. B asks for A's order by its number                      (otherCustomer.getOrder)
 *   3. Expect B to be turned away: status 404, as if it did not exist
 *
 * Run it:  npm run explore -- order-privacy
 *
 * If it fails, you have found a bug - the most common serious bug on the web (OWASP A01).
 * Do not "fix" the test. Write the bug report: docs/BUG-REPORT-TEMPLATE.md
 */

test("a customer cannot open another customer's order", async ({ shopper, shopApi, otherCustomer }) => {
  // 1. Customer A orders something
  // TODO

  // 2. Customer B asks for that order by its number
  // TODO

  // 3. B must be turned away
  // TODO
});
