import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * Week 6: tests that go looking for problems. Some of them fail - that is how they report what
 * they found. They never run as part of `npm test` or in the pipeline. Run them on their own:
 *
 *   npm run explore -- a11y            EX 4 - what can axe find on the products page?
 *   npm run explore -- order-privacy   EX 6 - can one customer read another customer's order?
 *
 * Desktop Chromium only.
 */
export default defineConfig({
  ...base,
  testDir: './explore',
  projects: base.projects!.filter((p) => p.name === 'setup' || p.name === 'chromium'),
});
