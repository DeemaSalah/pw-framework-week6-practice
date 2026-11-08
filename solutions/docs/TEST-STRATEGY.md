# Test strategy - Toolshop

**Owner:** <you>  ·  **Last updated:** <date>  ·  *MODEL ANSWER - one way to fill in the template*

## 1. What we are testing, and why

Toolshop sells tools online: customers create an account, add products to a cart and place
orders. A bad release loses sales (checkout broken), loses trust (data leaked) or shuts people out
(unusable on phones or with assistive technology). In scope: the web shop and its API. Out of
scope: payment and delivery - the demo shop has neither.

## 2. The risks that matter most

| # | Risk | How bad | How likely | How we will know |
| - | --- | --- | --- | --- |
| 1 | A customer sees another customer's data | High | Medium - it has happened (BUG-ORDERS) | API tests with two customers, `tests/08-order-privacy` |
| 2 | Checkout charges the wrong amount, or loses the order | High | Low | `tests/05-checkout` checks the UI *and* the server's record |
| 3 | The shop is unusable on a phone | High - most traffic | Medium | Nightly `mobile` project; real-device check before big releases |
| 4 | Customers with disabilities cannot buy | High | Medium | axe on every page in the gate + a keyboard pass each release |
| 5 | Search slows to a crawl in a sale | Medium | High | `npm run perf` before release; p95 under 200 ms at expected load |

## 3. How we test it

| Level | What it covers | Tool | When it runs | Who |
| --- | --- | --- | --- | --- |
| API | Rules, errors, access control | Playwright `request` | Every push | Testers |
| UI end-to-end | The journeys a customer takes | Playwright, Chromium | Every push | Testers |
| Cross-browser | The same journeys elsewhere | Firefox, WebKit, Pixel 7 | Nightly | Pipeline |
| Accessibility | What a machine can find | axe | Every push | Pipeline |
| Accessibility | What it cannot: keyboard, screen reader | By hand | Each release | Testers |
| Performance | Search and cart under load | `perf/load.mjs`, k6 | Before release | Testers |
| Security | Access control, the OWASP Top 10 | API tests + a review | Every push / each release | Testers + security |
| Exploratory | Whatever the scripts did not imagine | By hand, time-boxed | Each new feature | Testers |

## 4. Environments and data

Locally and in the pipeline: the demo shop, started fresh for every run. Every test makes its own
user and deletes it; the catalogue is shared, read-only reference data. The one secret,
`SHOP_PASSWORD`, lives in `.env` locally and in the repository's secrets on GitHub.

## 5. Quality gates

| Gate | What must be true | What happens if not |
| --- | --- | --- |
| Pull request | Typecheck passes; every test passes within 2 retries | The ruleset blocks the merge |
| Nightly | All four projects green | Triage first thing; a bug report for every real failure |
| Release | No open Critical bugs; flaky count not rising; perf budget met | No release until fixed or explicitly accepted |

## 6. What we are deliberately NOT testing

Real phones and real Safari on iOS (emulation only - accepted risk until the mobile share is
known). Payment and delivery (not in the product). Load beyond 50 users (we have no
production-sized environment to test it on).

## 7. How we report

Every run: the summary on the pipeline run page. Every Friday: the five-line status update in the
team channel. Before a release: the same, with a go / no-go recommendation; the product owner decides.
