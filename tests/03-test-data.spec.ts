import { test, expect } from '../fixtures';
import { buildUser } from '../data/factories';

/**
 * Test data. Every test here makes the user it needs and leaves nothing behind.
 *
 * Run this file twice in a row, or with --repeat-each=5, and it still passes.
 * Then try museum/hard-coded-user.spec.ts the same way:
 *     npm run museum -- hard-coded --repeat-each=2
 */

test('a new customer can create an account', async ({ registerPage, shopPage, userToRegister }) => {
  await registerPage.goto();
  await registerPage.register(userToRegister);

  await expect(shopPage.welcome).toHaveText(`Welcome to Toolshop, ${userToRegister.name}`);
  await expect(shopPage.header.userEmail).toHaveText(userToRegister.email);
});

test('an email that is already registered is refused', async ({ registerPage, freshUser }) => {
  // freshUser already exists (the fixture made it through the API). Try to register it again.
  await registerPage.goto();
  await registerPage.register(freshUser);

  await expect(registerPage.error).toHaveText('An account with this email already exists');
});

test('a password shorter than 8 characters is refused', async ({ registerPage }) => {
  // Override only what this test is about. Everything else stays valid and unique.
  await registerPage.goto();
  await registerPage.register(buildUser({ password: 'short' }));

  await expect(registerPage.error).toHaveText('Password must be at least 8 characters');
});

test('a name of 51 characters is refused', async ({ registerPage }) => {
  // Boundary value analysis, from Week 1. The limit is 50.
  await registerPage.goto();
  await registerPage.register(buildUser({ name: 'A'.repeat(51) }));

  await expect(registerPage.error).toHaveText('Name must be 50 characters or fewer');
});
