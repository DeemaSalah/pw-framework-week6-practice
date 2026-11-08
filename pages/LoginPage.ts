import type { Locator, Page } from '@playwright/test';

/**
 * The sign-in page.
 *
 * Every locator for this page lives here and nowhere else. When the designer renames
 * the button, this is the only file that changes - not every test that signs in.
 */
export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Sign in' });
    this.email = page.getByLabel('Email address');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Sign in' });
    this.error = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  /** Named for what the user does - not for which boxes get filled. */
  async signIn(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
