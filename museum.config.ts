import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * The museum: tests kept on purpose because they are wrong in instructive ways.
 * They never run as part of `npm test` or in the pipeline. Run them on their own:
 *
 *   npm run museum -- flaky --retries=2 --repeat-each=10     (retries hiding a flaky test)
 *   npm run museum -- hard-coded --repeat-each=2             (two tests, one email address)
 *   npm run museum -- pr-42                                  (the pull request from Week 5)
 *   npm run museum -- pile                                   (the suite before page objects)
 *
 * Desktop Chromium only.
 */
export default defineConfig({
  ...base,
  testDir: './museum',
  projects: base.projects!.filter((p) => p.name === 'setup' || p.name === 'chromium'),
});
