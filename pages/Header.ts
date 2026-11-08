import type { Locator, Page } from '@playwright/test';

/**
 * Not a page - a component that sits on top of every signed-in page.
 * Pages that have it simply hold one (shopPage.header.cartCount).
 * That is composition. It beats a giant BasePage that everything inherits from.
 */
export class Header {
  readonly cartCount: Locator;
  readonly userEmail: Locator;
  readonly cartLink: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.cartCount = page.getByTestId('cart-count');
    this.userEmail = page.getByTestId('user-email');
    this.cartLink = page.getByRole('link', { name: /^Cart/ });
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async openCart() {
    await this.cartLink.click();
  }

  async signOut() {
    await this.signOutButton.click();
  }
}
