import { test, expect } from '../fixtures';
import { PRODUCTS } from '../data/products';
import { accessibilityProblems } from '../support/accessibility';

/**
 * A quality gate: these pages have no accessibility problems that a machine can find,
 * and this file keeps it that way. If a change adds one, the build goes red and says which.
 *
 * Always scan the FINISHED page: wait for the content first, or you are scanning a spinner.
 */

test('the sign-in page has no problems axe can find', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

  expect(await accessibilityProblems(page)).toEqual([]);
});

test('the registration page has no problems axe can find', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();

  expect(await accessibilityProblems(page)).toEqual([]);
});

test('a cart with a product in it has no problems axe can find', async ({ page, shopper, shopApi, cartPage }) => {
  await shopApi.addToCart(PRODUCTS.hammer.id, 2);
  await cartPage.goto();
  await expect(cartPage.line('Claw Hammer')).toBeVisible();

  expect(await accessibilityProblems(page)).toEqual([]);
});

test('the products page has no problems axe can find', async ({ page, shopper, shopPage }) => {
  await shopPage.goto();
  await expect(shopPage.productCards).toHaveCount(4); // the finished page, not the loading one

  expect(await accessibilityProblems(page)).toEqual([]);
});