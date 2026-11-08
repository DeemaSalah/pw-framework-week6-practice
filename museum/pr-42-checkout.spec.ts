import { test, expect } from '@playwright/test';

/*
 * ---------------------------------------------------------------------------------------------
 *  PULL REQUEST #42 - "Add checkout tests"
 *
 *  "Added two tests for checkout. All green on my machine. Had to add retries because
 *   checkout is a bit flaky sometimes. Should be good to merge!"
 *
 *  EX 7: you are the reviewer. Find everything you would ask the author to change.
 *  Then pick the ONE you would block the merge for.
 *
 *  It really is green - run it if you do not believe it:   npm run museum -- pr-42
 * ---------------------------------------------------------------------------------------------
 */

const EMAIL = 'customer@practice.test';
const PASSWORD = process.env.SHOP_PASSWORD || 'Summer2024!'; // TODO remove before merge

test.describe.configure({ mode: 'serial', retries: 3 });

test.describe('checkout', () => {
  test('test1', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill(EMAIL);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button.primary').click();
    await page.waitForTimeout(3000); // wait for products

    expect(await page.locator('.price').count()).toBeGreaterThan(0);

    await page.locator('.card button').nth(0).click();
    await page.locator('.card button').nth(0).click();
    await expect(page.locator('.card button').nth(0)).toBeEnabled();
  });

  test('checkout works', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill(EMAIL);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button.primary').click();
    await page.waitForTimeout(3000);

    await page.goto('/cart'); // cart from test1
    await page.locator('[data-test="place-order"]').click();

    try {
      await expect(page.getByText('Order confirmed')).toBeVisible({ timeout: 2000 });
    } catch {
      console.log('confirmation slow again, ignoring');
    }
  });
});
