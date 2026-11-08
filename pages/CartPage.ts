import type { Locator, Page } from '@playwright/test';
import { Header } from './Header';

/** The cart page. Written in Week 5, EX 3. */
export class CartPage {
  readonly page: Page;
  readonly header: Header;
  readonly heading: Locator;
  readonly total: Locator;
  readonly emptyMessage: Locator;
  readonly placeOrderButton: Locator;
  readonly confirmation: Locator;
  readonly orderNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.heading = page.getByRole('heading', { name: 'Your cart' });
    this.total = page.getByTestId('cart-total');
    this.emptyMessage = page.getByText('Your cart is empty');
    this.placeOrderButton = page.getByRole('button', { name: 'Place order' });
    this.confirmation = page.getByRole('status').filter({ hasText: 'Order confirmed' });
    this.orderNumber = page.getByTestId('order-number');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  /** One row of the cart, found by the product's name - scope, then act. */
  line(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  quantityOf(name: string): Locator {
    return this.page.getByLabel(`Quantity for ${name}`);
  }

  lineTotalOf(name: string): Locator {
    return this.line(name).getByTestId('line-total');
  }

  async setQuantity(name: string, quantity: number) {
    const saved = this.page.waitForResponse((res) => res.url().includes('/api/cart/') && res.request().method() === 'PUT');
    await this.quantityOf(name).fill(String(quantity));
    await this.quantityOf(name).press('Enter');
    await saved;
  }

  async remove(name: string) {
    await this.page.getByRole('button', { name: `Remove ${name}` }).click();
  }

  /**
   * The shop asks for confirmation in a browser dialog ("Place this order for $42.45?").
   * The test does not need to know that - it just wants to place an order. Hiding details like
   * this is exactly what the page object is for. (Week 4: register the handler BEFORE the click.)
   */
  async placeOrder() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.placeOrderButton.click();
  }
}
