import type { Locator, Page } from '@playwright/test';
import { Header } from './Header';

/**
 * The product list.
 *
 * Notice what is NOT in here: no expect(). The page object knows how to find things and
 * how to do things. The test decides what "correct" means.
 */
export class ShopPage {
  readonly page: Page;
  readonly header: Header;
  readonly heading: Locator;
  readonly productCards: Locator;
  readonly loadError: Locator;
  readonly retryButton: Locator;
  readonly emptyMessage: Locator;
  readonly welcome: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.heading = page.getByRole('heading', { name: 'Products' });
    this.productCards = page.getByRole('list', { name: 'Products' }).getByRole('listitem');
    this.loadError = page.getByTestId('products-error');
    this.retryButton = page.getByRole('button', { name: 'Try again' });
    this.emptyMessage = page.getByTestId('products-empty');
    this.welcome = page.getByTestId('welcome');
  }

  async goto() {
    await this.page.goto('/');
  }

  /** Scope, then act (Week 4): find the card by its name, never by its position. */
  product(name: string): Locator {
    return this.productCards.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  priceOf(name: string): Locator {
    return this.product(name).getByTestId('price');
  }

  /** The Add to cart button on one product's card. The only place in the suite that knows its text. */
  addToCartButton(name: string): Locator {
    return this.product(name).getByRole('button', { name: 'Add to cart' });
  }

  /**
   * Waits until the shop has actually saved it - listen, then act.
   * Without this, a test that navigates straight to the cart can leave before the request lands.
   * Writing that wait once, here, is half the reason page objects exist.
   */
  async addToCart(name: string) {
    const saved = this.page.waitForResponse(
      (res) => res.url().endsWith('/api/cart') && res.request().method() === 'POST',
    );
    await this.addToCartButton(name).click();
    await saved;
  }
}
