# Any signed-in customer can read any other customer's order by its number

**Severity:** Critical  ·  **Priority:** P1 (proposed - block the release)
**Found by:** `explore/order-privacy.spec.ts`  ·  **Environment:** demo shop, Week 6 starter, local

## Steps to reproduce

1. Customer A signs in, adds a product to the cart and places an order. The shop shows the
   order number, for example `ORD-1001`.
2. Customer B - a different account - signs in.
3. Customer B requests `GET /api/orders/ORD-1001`.

Or run: `npm run explore -- order-privacy`

## Expected

Customer B gets `404 Not Found`, exactly as for an order that does not exist - so B cannot even
learn that the order exists.

## Actual

`200 OK`, with customer A's full order:

```json
{ "orderId": "ORD-1001", "customer": { "name": "...", "email": "..." }, "total": "$89.55", "lines": [ ... ] }
```

## Evidence

The test fails with: `customer B was able to open ORD-1001, which belongs to customer A -
Expected: 404, Received: 200`. Trace in the HTML report.

## Impact

Every customer's name, e-mail address and purchase history can be read by anyone with an account.
Order numbers count up by one, so a script can collect all of them in minutes. This is personal
data: in most countries a leak like this must be reported to a regulator.
OWASP Top 10:2025, A01 - Broken Access Control.

## Notes for the developer

The endpoint looks the order up across all customers. It should look only in the signed-in
customer's own orders (`user.orders`), and return 404 when it is not there.

*(For the course this file lives in your repository. At work, a security bug is reported
privately - never in a public tracker.)*
