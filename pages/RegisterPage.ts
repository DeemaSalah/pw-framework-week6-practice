import type { Locator, Page } from '@playwright/test';
import type { NewUser } from '../data/factories';

export class RegisterPage {
  readonly page: Page;
  readonly name: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.getByLabel('Full name');
    this.email = page.getByLabel('Email address');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Create account' });
    this.error = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/register');
  }

  /** Takes a whole user, so tests pass in buildUser(...) rather than three loose strings. */
  async register(user: NewUser) {
    await this.name.fill(user.name);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}
