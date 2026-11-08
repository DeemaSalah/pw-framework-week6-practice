# Final project — make it yours

Six weeks, one repository. This is where it becomes something you can show a stranger: a hiring
manager, a team lead, the interviewer who asks *"have you actually done any of this?"*

**Time:** two weeks, alongside your other work. **Show it:** five minutes, to the group.
**Where:** your own public `pw-framework` repository on GitHub. One pull request per part.

## The six parts

Every part is a pull request into `main`. Every pull request must go green before you merge it —
your ruleset makes sure of that.

1. **A green pipeline, both of them.** `tests.yml` green on `main`. `nightly.yml` green on all
   four projects — which means the phone bugs from EX 3 are fixed. Add the status badge to the top
   of your README (Actions tab → a workflow → `···` → Create status badge).

2. **The products page in the gate.** Fix what EX 4 found — what axe found *and* what it did not.
   Move the test into `tests/07-accessibility.spec.ts`.

3. **The security bug, written up and pinned down.** Your bug report for EX 6, in
   `docs/BUG-ORDERS.md`. Your test in `tests/`, marked as a known failure so the build stays usable
   and turns red the day the bug is fixed:

   ```ts
   test.fail(true, 'BUG-ORDERS: any customer can read any order - docs/BUG-ORDERS.md');
   ```

4. **Tests for a feature nobody has tested yet: search.** `GET /api/search?q=...` has no tests.
   Write at least four, in a new file, using the framework — fixtures, the API wrapper, your own
   data. Ideas: a typo still finds the product; an empty search is refused; something that does not
   exist finds nothing; a very long search does not break it. Write down anything that surprises you.

5. **A performance result you can defend.** Run `npm run perf` at 1, 5, 10, 25 and 50 users on
   your machine. In `docs/PERFORMANCE.md`: your table, the number of users at which p95 crosses
   200 ms, and three sentences on what you would tell the team.

6. **A one-page test strategy for the shop.** `docs/TEST-STRATEGY.md`, from the template. Your top
   three risks must each point to something in your repository that would catch them.

## The README is the cover letter

Someone will give your repository thirty seconds. Make them count. At the top of `README.md`:

- one sentence on what this is: *a Playwright + TypeScript test framework for a demo shop*
- the badges — green
- what it tests and how: browsers, API, accessibility, performance, security
- one bug it found, linked to the report
- how to run it in three commands

Keep the course's explanations further down, or delete them. It is your repository now.

## Done means

- [ ] Six merged pull requests, each one green before it was merged
- [ ] Both workflows green on `main`; the badge shows it
- [ ] No secret anywhere in the repository or its history
- [ ] A stranger could clone it, follow the README, and see it pass
- [ ] You can explain every file you changed, out loud, without notes
