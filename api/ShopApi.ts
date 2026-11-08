import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { NewUser } from '../data/factories';

export type Cart = {
  lines: { productId: string; name: string; price: string; quantity: number; lineTotal: string }[];
  count: number;
  total: string;
};

export type Order = {
  orderId: string;
  customer: { name: string; email: string };
  total: string;
  lines: Cart['lines'];
};

/**
 * The shop's API, wrapped the same way a page object wraps a page.
 *
 * Give it page.request and it shares the browser's cookies - so signing in here signs the page in,
 * and anything you add to the cart here is in the cart the page shows.
 * Give it the `request` fixture and it has a cookie jar of its own.
 *
 * Use it for SETUP and for CHECKING. Use the UI for the thing the test is actually about.
 */
export class ShopApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createUser(user: NewUser) {
    const res = await this.request.post('/api/users', { data: user });
    await expect(res, `creating ${user.email}`).toBeOK();
    return res.json();
  }

  async signIn(user: { email: string; password: string }) {
    const res = await this.request.post('/api/login', { data: { email: user.email, password: user.password } });
    await expect(res, `signing in as ${user.email}`).toBeOK();
  }

  async deleteMe() {
    const res = await this.request.delete('/api/users/me');
    await expect(res, 'deleting the signed-in user').toBeOK();
  }

  async addToCart(productId: string, quantity = 1): Promise<Cart> {
    const res = await this.request.post('/api/cart', { data: { productId, quantity } });
    await expect(res, `adding ${quantity} x ${productId}`).toBeOK();
    return res.json();
  }

  async getCart(): Promise<Cart> {
    const res = await this.request.get('/api/cart');
    await expect(res).toBeOK();
    return res.json();
  }

  async getOrders(): Promise<Order[]> {
    const res = await this.request.get('/api/orders');
    await expect(res).toBeOK();
    return res.json();
  }

  async placeOrder(): Promise<Order> {
    const res = await this.request.post('/api/orders');
    await expect(res, 'placing an order').toBeOK();
    return res.json();
  }

  /**
   * One order, by its number. Returns the raw response, with no check of its own - because
   * sometimes the right answer is a refusal, and the TEST decides what correct looks like.
   */
  async getOrder(orderId: string): Promise<APIResponse> {
    return this.request.get(`/api/orders/${orderId}`);
  }
}
