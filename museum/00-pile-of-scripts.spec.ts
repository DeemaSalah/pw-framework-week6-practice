import { test, expect } from '@playwright/test';
import { env } from '../config/env';

/**
 * THE BEFORE PICTURE (Week 5) - what a suite looks like after three months without page objects.
 *
 * Every test repeats the same sign-in steps with the same locators. It moved to the museum in
 * Week 6: tests/01-page-objects.spec.ts is the same five tests, written against LoginPage.
 */

test('customer can sign in', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(env.customer.email);
  await page.getByLabel('Password').fill(env.customer.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByTestId('user-email')).toHaveText(env.customer.email);
});

test('a wrong password is refused', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(env.customer.email);
  await page.getByLabel('Password').fill('not-the-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Invalid email or password');
});

test('an empty email is caught before it reaches the server', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Password').fill(env.customer.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Enter your email address');
});

test('a signed-in customer sees all four products', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(env.customer.email);
  await page.getByLabel('Password').fill(env.customer.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('list', { name: 'Products' }).getByRole('listitem')).toHaveCount(4);
});

test('signing out returns to the sign-in page', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(env.customer.email);
  await page.getByLabel('Password').fill(env.customer.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
