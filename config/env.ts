/**
 * Every setting the suite needs from the outside world, in one place.
 *
 * Secrets come from environment variables: a .env file on your laptop,
 * the repository's secrets on GitHub in the pipeline. They never go in a test file.
 *
 * If a secret is missing we stop straight away with a message that says how to fix it -
 * instead of letting thirty tests fail with "Invalid email or password".
 */

// Load .env if there is one. On CI there is no .env file; the pipeline sets the variables itself.
try {
  process.loadEnvFile();
} catch {
  // No .env file. Fine on CI - and locally, required() below will tell you what is missing.
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    const fix = process.env.CI
      ? `  In the pipeline: on GitHub, open Settings -> Secrets and variables -> Actions,\n` +
        `  and add a repository secret named exactly ${name}.\n`
      : `  Copy .env.example to .env and fill it in - your mentor has the value.\n`;
    throw new Error(`\n\n  ${name} is not set.\n` + fix + `  Never paste it into a test file. See README.md.\n`);
  }
  return value;
}

export const env = {
  /** Which shop we are testing. Unset = the demo shop in this repo, started for you. */
  baseURL: process.env.BASE_URL || 'http://localhost:4175',
  /** True when nobody pointed BASE_URL somewhere else. */
  isLocal: !process.env.BASE_URL,
  /** The seeded customer account. */
  customer: {
    email: process.env.SHOP_EMAIL || 'customer@practice.test',
    password: required('SHOP_PASSWORD'),
  },
};
