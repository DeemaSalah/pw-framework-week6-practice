import { test, expect } from '@playwright/test';
import { env } from '../config/env';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';

/**
 * The same five tests as 00-pile-of-scripts.spec.ts, written against page objects.
 *
 * Read one out loud. It says what the customer does, not which boxes get filled.
 * And when the "Sign in" button is renamed, one line in pages/LoginPage.ts fixes all five.
 */

test('customer can sign in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.goto();
  await loginPage.signIn(env.customer.email, env.customer.password);
  await expect(shopPage.header.userEmail).toHaveText(env.customer.email);
});

test('a wrong password is refused', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.signIn(env.customer.email, 'not-the-password');
  await expect(loginPage.error).toHaveText('Invalid email or password');
});

test('an empty email is caught before it reaches the server', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.signIn('', env.customer.password);
  await expect(loginPage.error).toHaveText('Enter your email address');
});

test('a signed-in customer sees all four products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.goto();
  await loginPage.signIn(env.customer.email, env.customer.password);
  await expect(shopPage.productCards).toHaveCount(4);
});

test('signing out returns to the sign-in page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.goto();
  await loginPage.signIn(env.customer.email, env.customer.password);
  await shopPage.header.signOut();
  await expect(loginPage.heading).toBeVisible();
});
