import path from 'node:path';
import { test as base, expect } from '@playwright/test';
import { ShopApi } from '../api/ShopApi';
import { buildUser, type NewUser } from '../data/factories';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ShopPage } from '../pages/ShopPage';

/** Where auth.setup.ts saves the signed-in customer's session. Never commit it - it IS a password. */
export const STORAGE = {
  customer: path.join(__dirname, '..', '.auth', 'customer.json'),
};

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  /** The shop's API, sharing this test's browser session. */
  shopApi: ShopApi;
  /** A brand-new user who exists in the shop but is not signed in. Deleted afterwards. */
  freshUser: NewUser;
  /** A brand-new user who is ALREADY signed in, in this test's browser. Deleted afterwards. */
  shopper: NewUser;
  /** Details for a user who does not exist yet - for tests that register through the UI. Cleaned up afterwards. */
  userToRegister: NewUser;
  /**
   * A SECOND customer, signed in with a cookie jar of their own - nothing shared with this test's
   * page or shopApi. For tests about what one customer must never see of another's. Deleted afterwards.
   */
  otherCustomer: ShopApi;
};

/**
 * Import `test` and `expect` from here instead of from '@playwright/test'.
 *
 * A fixture is set up only when a test asks for it by name, and torn down when that test ends.
 * Everything before `await use(...)` is setup. Everything after it is teardown, and it runs whether
 * the test passed or failed. Why not beforeEach/afterEach? They run for every test in the file,
 * needed or not, and keep setup and cleanup in two different places. A fixture runs only when
 * asked for, keeps both halves together, and works in every file that imports this `test`.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },

  // Week 5, EX 4 - two lines, and every test can ask for a cartPage by name.
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  shopApi: async ({ page }, use) => {
    await use(new ShopApi(page.request));
  },

  freshUser: async ({ request }, use) => {
    // SETUP: make a user nobody else has ever used, through the API - fast, no browser involved.
    const api = new ShopApi(request);
    const user = buildUser();
    await api.createUser(user);

    await use(user); // <- the test runs here

    // TEARDOWN: runs after the test, pass or fail. Leave the shop as you found it.
    await api.signIn(user);
    await api.deleteMe();
  },

  shopper: async ({ freshUser, page }, use) => {
    // Fixtures can use other fixtures. This one builds on freshUser, then signs in
    // through the API. page.request shares cookies with the browser, so the page is signed in
    // too - no form, no clicking, a fraction of the time.
    await new ShopApi(page.request).signIn(freshUser);
    await use(freshUser);
  },

  otherCustomer: async ({ playwright, baseURL }, use) => {
    // A brand-new request context = a brand-new cookie jar. This customer is not signed in as
    // anybody else, and nobody else is signed in as them.
    const context = await playwright.request.newContext({ baseURL });
    const api = new ShopApi(context);
    const user = buildUser();
    await api.createUser(user);
    await api.signIn(user);

    await use(api);

    await api.deleteMe();
    await context.dispose();
  },

  userToRegister: async ({ request }, use) => {
    const user = buildUser();
    await use(user);
    // The test may or may not have managed to create this user. Clean up only if it exists.
    const signedIn = await request.post('/api/login', { data: { email: user.email, password: user.password } });
    if (signedIn.ok()) await request.delete('/api/users/me');
  },
});

export { expect };
