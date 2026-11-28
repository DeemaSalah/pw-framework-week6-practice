# Playwright QA Automation Framework

A Playwright + TypeScript test automation framework for a demo e-commerce shop, covering functional, API, accessibility, security, and performance testing.

[![Tests](https://github.com/DeemaSalah/pw-framework-week6-practice/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/DeemaSalah/pw-framework-week6-practice/actions/workflows/tests.yml)
[![Nightly](https://github.com/DeemaSalah/pw-framework-week6-practice/actions/workflows/nightly.yml/badge.svg?branch=main)](https://github.com/DeemaSalah/pw-framework-week6-practice/actions/workflows/nightly.yml)

---

## Project Overview

This project demonstrates a practical QA automation workflow using Playwright and TypeScript.

It includes an automated test suite for a demo e-commerce application, along with exploratory testing, API validation, accessibility checks, security testing, performance measurements, and CI/CD integration.

The demo shop is included in the repository under `app/`, so the tests run against a local application rather than depending on an external website.

The project focuses not only on finding defects, but also on documenting them, evaluating application quality, and making test results repeatable.

## What This Project Tests

| Testing Area | Coverage |
|---|---|
| Functional UI Testing | User flows, products, cart, checkout, and form validation |
| Cross-Browser Testing | Chromium, Firefox, and WebKit |
| Mobile Testing | Responsive layout and mobile-sized viewport testing |
| API Testing | Search endpoint, response status codes, response data, and edge cases |
| Accessibility Testing | Automated axe checks and manual keyboard/accessibility exploration |
| Security Testing | Order ownership and unauthorized access (IDOR) |
| Performance Testing | Concurrent search requests, response times, throughput, and latency |
| CI/CD | Automated checks on pull requests and scheduled multi-browser runs |

## Framework Architecture

The project uses a modular structure to keep test logic, application interactions, test data, and supporting utilities organized.

| Directory / File | Purpose |
|---|---|
| `tests/` | Automated functional, API, and accessibility tests |
| `pages/` | Page Object Model classes for UI interactions |
| `api/` | API wrapper methods used by API tests |
| `data/` | Test data and reusable test inputs |
| `fixtures/` | Custom Playwright fixtures and reusable test setup |
| `support/` | Shared utilities, including accessibility helpers |
| `explore/` | Exploratory tests used to investigate application behavior and defects |
| `perf/` | Performance testing scripts |
| `scripts/` | Test result summary utilities |
| `app/` | Local demo shop application under test |
| `docs/` | Test strategy, bug reports, and performance documentation |
| `solutions/` | Developer-side fixes for selected issues identified during testing, included to simulate the defect resolution workflow |
| `.github/workflows/` | GitHub Actions CI/CD workflows |

### Automation Approach

- **Playwright + TypeScript:** Browser automation and test implementation.
- **Page Object Model:** Separates page interactions from test scenarios.
- **Fixtures:** Reusable setup and test dependencies.
- **API Wrapper:** Centralizes API requests and keeps request logic separate from test assertions.
- **Test Data:** Reusable data for consistent test execution.
- **Assertions:** Validate expected behavior, response data, and application states.

### Note on the Solutions Directory

The `solutions/` directory contains developer-side fixes for selected issues identified during testing, such as frontend and mobile responsiveness problems.

These solutions are included to simulate a real-world development workflow: as a QA engineer, my role was to identify, reproduce, and report defects with clear evidence. The fixes represent the developer's response to those reports, allowing the project to demonstrate the full defect lifecycle — from discovery and reporting to resolution and verification.

**The purpose is not to present this as development work, but to show how QA findings can lead to actionable fixes and verified improvements.**

## CI/CD Workflows

The project uses GitHub Actions to automate test execution.

### Pull Request / Push Workflow — `tests.yml`

- Runs on pushes and pull requests targeting `main`.
- Performs TypeScript type checking.
- Executes the Chromium test suite.
- Provides a test summary and Playwright report artifacts.

### Nightly Workflow — `nightly.yml`

- Runs on a scheduled basis and can also be triggered manually.
- Executes the suite across four projects:
  - Chromium
  - Firefox
  - WebKit
  - Mobile (Pixel 7-sized emulation)

**Note:** The mobile project uses browser emulation with a mobile viewport, device scale factor, touch support, and user agent. It does not replace testing on a physical mobile device.

## Important Findings

### 1. Security — Insecure Direct Object Reference (IDOR)

An order privacy issue was identified in the demo application's order endpoint.

A customer could access another customer's order by using its order ID, without proper ownership validation.

- The issue was reproduced through an automated security test.
- The test documents the expected behavior and the actual response.
- The known failure is tracked so the test can help verify the issue once it is fixed.

See: [`docs/ORDERS-BUG-REPORT.md`](docs/ORDERS-BUG-REPORT.md)

### 2. Accessibility

Accessibility exploration identified issues that automated checks could detect, as well as issues requiring manual investigation.

The project includes automated axe checks and additional manual exploration, including keyboard navigation and form accessibility.

See: [`tests/07-accessibility.spec.ts`](tests/07-accessibility.spec.ts)

### 3. Performance

The search endpoint was tested under increasing concurrent user loads.

| Virtual Users | Requests/sec | p50 | p95 |
|---:|---:|---:|---:|
| 1 | 33 | 31 ms | 37 ms |
| 5 | 59 | 83 ms | 93 ms |
| 10 | 55 | 171 ms | 249 ms |
| 25 | 47 | 554 ms | 667 ms |
| 50 | 63 | 840 ms | 872 ms |

The p95 response-time budget was 200 ms.

The first tested load level to exceed this budget was **10 concurrent users**.

These results represent measurements from the local test environment and should not be treated as production capacity limits.

See: [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md)

## Getting Started

### Prerequisites

- Node.js 22 or newer
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/DeemaSalah/pw-framework-week6-practice.git
cd pw-framework-week6-practice
```

### 2. Install dependencies and browsers

```bash
npm install
npx playwright install
```

### 3. Configure environment variables

Create a local `.env` file from the example:

**Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

Open `.env` and configure:

```env
SHOP_PASSWORD=your_authorized_demo_shop_password
```

The password is not included in the repository. Obtain the required demo-shop credentials from the project maintainer.

**Important:** Never commit your `.env` file or expose credentials in source code, test reports, screenshots, or logs.

### 4. Run the tests

```bash
npm test
```

This runs the default Chromium test suite.

## Available Commands

| Command | Description |
|---|---|
| `npm test` | Run the default Chromium test suite |
| `npm test -- 02-cart` | Run a specific test file |
| `npm run test:all` | Run the suite across all configured projects |
| `npx playwright test --project=mobile` | Run the mobile emulation project |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run summary` | Generate a summary of the latest test run |
| `npm run report` | Open the Playwright HTML report |
| `npm run ui` | Open Playwright UI mode |
| `npm run explore -- a11y` | Run accessibility exploration |
| `npm run explore -- order-privacy` | Run the order privacy security test |
| `npm run perf -- --users 10` | Run a 10-user performance test |
| `npm run shop` | Start the demo shop independently at `http://localhost:4175` |

For Firefox and WebKit, install the required browsers if they are not already available:

```bash
npx playwright install firefox webkit
```

## Documentation

Additional project documentation:

- [Test Strategy](docs/TEST-STRATEGY.md)
- [Order Privacy Bug Report](docs/ORDERS-BUG-REPORT.md)
- [Performance Test Results](docs/PERFORMANCE.md)

## Environment Variables and CI Secrets

The project uses `SHOP_PASSWORD` as an environment variable.

- Local execution reads it from `.env`.
- GitHub Actions reads it from the repository's Actions secrets.
- `.env` is excluded from version control.
- Actual credentials must never be committed to the repository.

GitHub Actions secrets are not accessible to people cloning the repository. Anyone running the tests locally must configure their own authorized demo-shop credentials.

## Future Improvements

Potential next steps for expanding the framework:

- Increase functional test coverage for cart and checkout edge cases.
- Expand API coverage to additional endpoints.
- Add more authorization and input-validation security tests.
- Improve test data management and isolation.
- Extend accessibility checks across more pages.
- Add repeated performance runs and comparisons between test results.

---

## Technologies

**Playwright · TypeScript · Node.js · Git · GitHub Actions · axe-core · REST API Testing · Performance Testing · Selenium**

---
## 👩‍💻 Author

**Deema Salah**  
Software Testing & QA | Manual Testing · API Testing · Playwright Automation

[LinkedIn](https://www.linkedin.com/in/deema-salah-2056412a6/) · [GitHub](https://github.com/DeemaSalah)