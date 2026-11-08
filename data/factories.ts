import { randomUUID } from 'node:crypto';

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

/**
 * A brand-new, valid user that no other test is using - not in this run, not in parallel,
 * not left over from yesterday.
 *
 * Override only the field your test is about, so the reader can see what matters:
 *   buildUser({ password: 'short' })       <- this test is about the password
 *   buildUser({ name: 'A'.repeat(51) })    <- this one is about the name limit
 */
export function buildUser(overrides: Partial<NewUser> = {}): NewUser {
  const id = randomUUID().slice(0, 8);
  return {
    name: `Test User ${id}`,
    email: `intern+${id}@practice.test`,
    password: `pw-${randomUUID()}`,
    ...overrides,
  };
}
