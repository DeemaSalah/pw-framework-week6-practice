import { test, expect, STORAGE } from '../fixtures';

// These tests only read, so sharing the saved customer session is safe.
test.use({ storageState: STORAGE.customer });

/**
 * Mocking: answering the browser's request yourself, for the states the real server will not give
 * you on demand. A mocked test proves the PAGE handles a response - never that the server sends it.
 */

test('an error message appears when products fail to load', async ({ page, shopPage }) => {
  await page.route('**/api/products', (route) => route.fulfill({ status: 500, json: { error: 'Database unavailable' } }));

  await shopPage.goto();

  await expect(shopPage.loadError).toBeVisible();
  await expect(shopPage.productCards).toHaveCount(0);
});

// EX 6, part 1
test('a message appears when there are no products', async ({ page, shopPage }) => {
  await page.route('**/api/products', (route) => route.fulfill({ json: [] }));

  await shopPage.goto();

  await expect(shopPage.emptyMessage).toHaveText('No products available right now.');
  await expect(shopPage.loadError).toBeHidden();
});

// EX 6, part 2 (stretch): a route can keep state. Fail once, then let the real server answer.
test('Try again recovers after a failure', async ({ page, shopPage }) => {
  let calls = 0;
  await page.route('**/api/products', (route) => {
    calls += 1;
    return calls === 1 ? route.fulfill({ status: 503 }) : route.continue();
  });

  await shopPage.goto();
  await expect(shopPage.loadError).toBeVisible();

  await shopPage.retryButton.click();

  await expect(shopPage.productCards).toHaveCount(4);
  await expect(shopPage.loadError).toBeHidden();
});

// Bonus: change the REAL response instead of inventing one. Keeps everything the server sent,
// alters only what the test is about.
test('a very long product name still leaves the button usable', async ({ page, shopPage }) => {
  const longName = 'Professional Heavy-Duty Insulated Combination Pliers '.repeat(4).trim();

  await page.route('**/api/products', async (route) => {
    const response = await route.fetch(); // the real answer from the real server
    const products = await response.json();
    products[0].name = longName;
    await route.fulfill({ response, json: products });
  });

  await shopPage.goto();

  await expect(shopPage.addToCartButton(longName)).toBeInViewport();
});
