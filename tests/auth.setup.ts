import { test as setup, expect } from '@playwright/test';
import { env } from '../config/env';
import { STORAGE } from '../fixtures';
import { LoginPage } from '../pages/LoginPage';

/**
 * Runs ONCE, before every other test (see "projects" in playwright.config.ts).
 *
 * Signs in through the real form - so the sign-in page is still tested every run - then saves
 * the browser's cookies to .auth/customer.json. Any test that says
 *     test.use({ storageState: STORAGE.customer })
 * starts already signed in, without touching the form.
 *
 * Open .auth/customer.json after a run and look at what is in it. That cookie is as good as the
 * password for as long as the session lasts - which is why .auth/ is in .gitignore.
 */
setup('sign in once as the customer and save the session', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.signIn(env.customer.email, env.customer.password);
  // The second argument to expect() is a message for whoever reads the failure. Use it.
  await expect(page.getByTestId('user-email'), 'Not signed in. Is SHOP_PASSWORD in .env right?').toHaveText(env.customer.email);

  await page.context().storageState({ path: STORAGE.customer });
});
