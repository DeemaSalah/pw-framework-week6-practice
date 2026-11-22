# Test Strategy — Toolshop

**Owner:** Deema Salah-QA Intern · **Last updated:** 22 November 2026

## 1. What we are testing, and why

Toolshop is a demo online shop where customers can browse products, manage carts, and place orders. This strategy focuses on checkout and shopping workflows, API behavior, accessibility, security, and performance. External payment-provider integrations and production infrastructure are out of scope.

## 2. The risks that matter most

| # | Risk | How bad | How likely | How we will know |
|---|---|---|---|---|
| 1 | A customer can access another customer's order without authorization. | High | Medium | `explore/order-privacy.spec.ts` detects unauthorized order access. |
| 2 | Cart or checkout failures cause incorrect orders or prevent customers from completing purchases. | High | Medium | `tests/02-cart.spec.ts`, `tests/05-checkout.spec.ts`, and CI test runs. |
| 3 | Search becomes too slow under concurrent user load. | Medium | High | `perf/load.mjs` measures p50, p95, and RPS; `docs/PERFORMANCE.md` records results against the 200ms p95 budget. |

## 3. How we test it

| Level | What it covers | Tool | When it runs | Who |
|---|---|---|---|---|
| API | Search responses, validation, and edge cases | Playwright API / ShopApi | On test runs | QA |
| UI end-to-end | Cart, checkout, and customer workflows | Playwright | Pull requests and nightly | QA / CI |
| Accessibility | Accessible names, contrast, and keyboard-related issues | Accessibility checks / Playwright | During accessibility checks | QA |
| Performance | Search response times under concurrent load | Node.js load test | Manually, when evaluating performance | QA |
| Security | Customer order authorization and access control | Playwright API | During security testing and before release | QA |
| Exploratory, by hand | Unexpected behavior, usability, and edge cases | Browser / DevTools | During feature testing | QA |

API checks are kept relatively fast and reusable, while UI, security, and performance checks target higher-risk behavior.

## 4. Environments and data

Tests run on the local application and through GitHub Actions. Test data comes from the project's seed data and factories. Each test uses its own test user when needed to avoid interfering with other tests. Login credentials used in CI are stored securely as GitHub Actions secrets, not directly in the code.

## 5. Quality gates

| Gate | What must be true | What happens if not |
|---|---|---|
| Pull request | TypeScript checks and Chromium tests pass. | Investigate failures and fix or document blockers before merging. |
| Nightly | Cross-browser and mobile test runs are reviewed. | Investigate browser-specific or mobile failures. |
| Release | Critical checkout and security issues are resolved, accessibility issues are reviewed, and p95 remains within the 200ms budget at the agreed load. | Hold the release until critical issues are addressed or explicitly accepted. |

## 6. What we are deliberately NOT testing

This strategy does not cover real external payment-provider transactions, production-scale infrastructure, or exhaustive load testing beyond the defined user levels. These areas require external services or environments that are not part of this demo project.

## 7. How we report

Test results and failures are reviewed through Playwright and GitHub Actions reports. Performance measurements are recorded in `docs/PERFORMANCE.md`, and security findings are documented in `docs/ORDERS-BUG-REPORT.md`. The QA owner summarizes critical risks and outstanding defects before release; the release decision belongs to the responsible project team.