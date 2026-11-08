import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

/**
 * Week 6 config. Everything from Week 5 is still here.
 * New this week: more browsers and a phone (projects), and reporters a pipeline can read.
 */
export default defineConfig({
  testDir: './tests',

  // Files AND the tests inside them run at the same time. This is why every test owns its data.
  fullyParallel: true,

  // A stray test.only fails the build on CI, instead of quietly skipping every other test.
  forbidOnly: !!process.env.CI,

  // None locally, on purpose: a flaky test should hurt while you can still fix it.
  // Two on CI - and then read the "flaky" count in the summary. That number is a to-do list.
  retries: process.env.CI ? 2 : 0,

  // undefined = half your CPU cores. GitHub's free runners have 4 cores on a public repository
  // and 2 on a private one, so two workers is safe on either.
  workers: process.env.CI ? 2 : undefined,

  // GitHub sets CI=true on every run, so this switch flips by itself in the pipeline.
  //   github = failures appear as notes on the exact line, in the pull request
  //   list   = what you watch in the log
  //   html   = the report you download from the run's Artifacts
  //   junit  = what Jenkins, GitLab and Azure DevOps turn into a test dashboard
  //   json   = what scripts/summary.mjs reads to write the run's summary page
  reporter: process.env.CI
    ? [
        ['github'],
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'results/junit.xml' }],
        ['json', { outputFile: 'results/results.json' }],
      ]
    : [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'results/results.json' }]],

  use: {
    // One variable repoints the whole suite: BASE_URL=https://staging.example.com npm test
    baseURL: env.baseURL,
    testIdAttribute: 'data-test',
    // A click waits up to 5s for its element - the same as an assertion.
    actionTimeout: 5_000,
    // Records every first attempt and keeps the trace only if it failed.
    trace: 'retain-on-first-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Runs first. Signs in once and saves the session to .auth/customer.json.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // What `npm test` runs - on your laptop and on every push.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },

    // Same tests, other engines. `npm run test:all` runs them; so does the nightly pipeline.
    // Firefox and WebKit (the engine inside Safari) need a one-off download:
    //   npx playwright install firefox webkit
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },

    // A phone-sized screen with touch, on the Chromium you already have. Week 5 left this
    // commented out; this week it finds a bug. An emulated phone is not a real phone - see README.
    { name: 'mobile', use: { ...devices['Pixel 7'] }, dependencies: ['setup'] },
  ],

  // Start the demo shop before the tests, stop it after.
  // Pointing BASE_URL at a real environment? Then there is nothing to start.
  webServer: env.isLocal
    ? {
        command: 'node app/server.js',
        url: `${env.baseURL}/api/health`,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
