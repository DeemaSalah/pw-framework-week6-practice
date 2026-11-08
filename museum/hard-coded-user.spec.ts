import { test, expect } from '@playwright/test';

/**
 * MUSEUM PIECE - test data that only works once.
 *
 * Passes the first time. The second time, the account already exists.
 *     npm run museum -- hard-coded --repeat-each=2
 *
 * It also fails if you run it a second time while the shop from the first run is still up
 * (in UI mode, for example) - which is how this bug usually shows up: "it passed on my machine
 * this morning".
 *
 * Compare tests/03-test-data.spec.ts, which uses buildUser() and cleans up after itself.
 */
test('a new customer can create an account', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Full name').fill('Intern Tester');
  await page.getByLabel('Email address').fill('intern@practice.test'); // the same email, every run
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByTestId('welcome')).toContainText('Welcome to Toolshop');
});
