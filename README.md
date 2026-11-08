# pw-framework — Week 6 starter

Week 5 turned a pile of scripts into a framework. This week it runs without you: on every push,
every night on three browsers and a phone-sized screen, with a gate that stops a red pull request from merging. And it
goes looking for the problems functional tests never see — on a phone, with a keyboard, under
load, and from the point of view of someone who should not be allowed in.

Everything still runs against the small demo shop inside this repo (`app/`).

## Before the session: put it on GitHub

You need Node 22 or newer, git, and a GitHub account.

```bash
npm install
cp .env.example .env               # Windows: copy .env.example .env  - then fill in SHOP_PASSWORD
npm test                           # 25 passed
```

Then create a new **public** repository on GitHub called `pw-framework` — empty: no README,
no .gitignore — and push this folder to it:

```bash
git config --global user.name "Your Name"            # once per computer, if git has never asked
git config --global user.email "you@example.com"     # the e-mail address of your GitHub account
git init -b main
git add .
git status                         # .env must NOT be in this list. If it is, stop and ask.
git commit -m "Week 6 starter"
git remote add origin https://github.com/<you>/pw-framework.git
git push -u origin main
```

If `git push` asks for a password: GitHub does not accept your account password there. Two easy
ways in. The GitHub CLI: `gh auth login`, then run the push again. Or **GitHub Desktop**: File →
Add local repository → choose this folder → Publish repository, with "Keep this code private"
unticked (Desktop creates the repository on GitHub for you, so skip creating it by hand). A
personal access token works too, but it needs the **workflow** scope, or GitHub refuses the files
in `.github/workflows/`.

Open the **Actions** tab of your repository. A run called *Tests* has started — and it goes
red. Do not fix it. That red run is where Session 6 begins.

> Why public? On a public repository GitHub's standard runners are free, and rulesets — the
> thing that blocks a red pull request — are available on the free plan. And it is your
> portfolio: by the end of the week, it is the link you put on your CV.

## Commands

| Command | What it does |
| --- | --- |
| `npm test` | The suite on desktop Chromium — what runs on every push |
| `npm test -- 02-cart` | One file |
| `npx playwright test --project=mobile` | The suite on a Pixel 7-sized screen |
| `npm run test:all` | Chromium, Firefox, WebKit and the phone — needs `npx playwright install firefox webkit` |
| `npm run typecheck` | Compile without running — catches a broken import in seconds |
| `npm run summary` | The last run as a short report: verdict, what failed, what was flaky |
| `npm run explore -- a11y` | EX 4: what axe finds on the products page |
| `npm run explore -- order-privacy` | EX 6: can one customer read another's order? |
| `npm run perf -- --users 10` | EX 5: ten users searching at once, for 15 seconds |
| `npm run report` | The HTML report from the last run |
| `npm run ui` | UI mode |
| `npm run museum -- <name>` | The museum (below) |
| `npm run shop` | The demo shop on its own, at http://localhost:4175 |

`npx playwright test` with no `--project` runs **every** project, including Firefox and WebKit.
Use `npm test` unless you mean it.

## What is where

```
.github/workflows/
  tests.yml           Every push and pull request: typecheck, then the suite on Chromium
  nightly.yml         Weeknights at 03:17 UTC, and on demand: all four projects, side by side
app/                  The demo shop - the product under test. Not test code.
config/env.ts         Every setting from outside. Fails loudly if a secret is missing.
pages/  api/  data/   Page objects, the API wrapper, test data - unchanged from Week 5
fixtures/index.ts     Custom fixtures. New: otherCustomer, a second signed-in customer
support/              accessibility.ts - axe, with output a person can read
tests/                The suite - the quality gate
  07-accessibility      New: pages that must stay free of problems axe can find
explore/              Tests that go looking for problems. Some fail - that is the finding.
perf/                 load.mjs - a load test with no dependencies; search.k6.js - the same in k6
scripts/summary.mjs   Turns results/results.json into the run's summary page
selenium/             One test in Java + Selenium, for reading. Not part of the suite.
docs/                 Templates: test strategy, bug report, status update. And the final project.
museum/               Wrong on purpose. Never part of npm test.
solutions/            Model answers for the Week 6 exercises. Try first, then compare.
```

## The pipeline

| | `tests.yml` | `nightly.yml` |
| --- | --- | --- |
| Runs on | push to main, every pull request, the Run workflow button | weeknights 03:17 UTC, the Run workflow button |
| Browsers | Chromium | Chromium, Firefox, WebKit, Pixel 7 — four jobs in parallel |
| Fails when | typecheck fails, or any test fails all three tries | any test fails all three tries |
| Leaves behind | a summary on the run page, `playwright-report` (14 days) | a summary and a `report-<project>` for each |

**Secrets.** The pipeline reads `SHOP_PASSWORD` from *Settings → Secrets and variables →
Actions*. GitHub replaces it with `***` in the log. It does **not** remove it from files you
upload: a trace of a test that typed the password contains the password. Anyone who can
download your artifacts can read it. For this course the password guards a fake shop. At work:
a private repository, short retention, and test accounts that can do no harm.

**Reading a red run.** Run page → the red job → the first red step → scroll up from the bottom
to the first error. Then the summary at the top of the run page, then the report artifact.

## Phones, and what an emulator is not

The `mobile` project gives the browser a Pixel 7's screen size, pixel density, touch and user
agent. It is still desktop Chromium. It finds layout bugs — the kind most phone bugs are — but
not a real phone's keyboard, memory, network or Safari quirks. Teams that need those rent real
devices from a device cloud (BrowserStack, Sauce Labs, LambdaTest and others).

## When it does not work

| You see | It is |
| --- | --- |
| `SHOP_PASSWORD is not set` on your laptop | No `.env`, or the password line is empty |
| `SHOP_PASSWORD is not set` in the pipeline | The repository secret is missing, or named differently |
| `Executable doesn't exist at …` | That browser is not installed: `npx playwright install firefox webkit` |
| The Actions tab is empty | The workflow files did not get pushed — is `.github/` in your repo on GitHub? |
| The nightly never runs | Schedules only run on the default branch, and stop after 60 days without activity |
| `EADDRINUSE :4175` | Something else is using port 4175 — another app, or a demo shop left running |
| Green locally, red in the pipeline | Read the first error. Usual suspects: a secret, a timing assumption, test data |
