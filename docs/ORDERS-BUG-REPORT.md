# Any signed-in customer can read another customer's order by its number

**Severity:** Major

**Priority:** P1 (Proposed)

**Found by:** `a customer cannot open another customer's order` — `explore/order-privacy.spec.ts`

**Environment:** Local Toolshop demo · Chromium · `http://localhost:4175`

## Steps to reproduce

1. Sign in as Customer A.
2. Add a product to the cart and place an order using `shopApi.addToCart()` and `shopApi.placeOrder()`.
3. Save the generated `orderId`.
4. Sign in as Customer B using a separate request context and cookie jar.
5. Request Customer A's order using `GET /api/orders/{orderId}`.

**Automation command:**

```bash
npm run explore -- --grep "order-privacy"
```

**Test file:** `explore/order-privacy.spec.ts`

## Expected

Customer B must not be able to access Customer A's order.

The server should reject the request with `404 Not Found`, as if the order does not exist.

## Actual

The server responds with `200 OK` and returns Customer A's order to Customer B.

The test expected status `404` but received `200`.

## Evidence

- Playwright test failure showing:
  - Expected: `404`
  - Received: `200`
- Screenshot: `docs/evidence/order-privacy-failure.png`
- Trace: `test-results/order-privacy-a-customer-c-61390-en-another-customer-s-order-chromium/trace.zip`
- Vulnerable endpoint: `GET /api/orders/{orderId}`

## Impact

Any authenticated customer who obtains or guesses another customer's order number may be able to access that customer's order details.

The exposed information includes customer name, email address, order total, and purchased product details.

This is an Insecure Direct Object Reference (IDOR) vulnerability and an instance of Broken Access Control.

---

**Note:** This is a security issue in the training application's local demo environment. It should be reported privately in a real application.