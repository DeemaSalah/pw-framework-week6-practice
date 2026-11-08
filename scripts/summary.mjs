// Turns the last run's results into a short report a person can read in ten seconds.
//
//   npm run summary                      after any local run - paste it into Slack or Teams
//   node scripts/summary.mjs firefox     what the pipeline runs; it writes the run's summary page
//
// It reads results/results.json, which the json reporter writes (see playwright.config.ts).
// Rule of thumb for any report: lead with the verdict, then what failed, then where to look.

import { readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const label = process.argv[2] ? ` - ${process.argv[2]}` : '';
const file = 'results/results.json';

if (!existsSync(file)) {
  console.log(`## Tests${label}: NO RESULTS\n`);
  console.log('The run stopped before a single test ran, so there is nothing to count.');
  console.log('Open the log of the step that ran the tests and read the first error.');
  console.log('The usual cause: a missing secret, such as SHOP_PASSWORD.\n');
  process.exit(0);
}

const report = JSON.parse(readFileSync(file, 'utf8'));
const strip = (text = '') => text.replace(/\u001b\[[0-9;]*m/g, ''); // remove terminal colours

// Where each project's tests live, so a file can be shown as tests/02-cart.spec.ts, not 02-cart.spec.ts.
const testDirOf = Object.fromEntries((report.config.projects ?? []).map((p) => [p.name, p.testDir]));
const pathOf = (project, file) => (testDirOf[project] ? relative(process.cwd(), join(testDirOf[project], file)) : file).replaceAll('\\', '/');

// Walk every suite (files, and describe blocks inside them) and collect each test.
const tests = [];
function walk(suite, path) {
  const here = suite.title && !suite.title.endsWith('.ts') ? [...path, suite.title] : path;
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const last = test.results.at(-1);
      // A test can fail with more than one error. Prefer the one that names the element it was
      // waiting for - that is the clue - and show its first line plus the "waiting for" line.
      const errors = (last?.errors ?? []).map((e) => strip(e.message ?? ''));
      const isWaitingLine = (l) => l.trim().startsWith('- waiting for');
      const best = errors.find((m) => m.split('\n').some(isWaitingLine)) ?? errors[0] ?? '';
      const firstLine = best.split('\n').find((l) => l.trim()) ?? '';
      // Long locators are cut from the front: the end - the element itself - is the useful part.
      const waiting = best.split('\n').find(isWaitingLine)?.trim().slice(2);
      const waitingFor = waiting && waiting.length > 140 ? `waiting for ...${waiting.slice(-120)}` : waiting;
      tests.push({
        name: [...here, spec.title].join(' › '),
        where: `${pathOf(test.projectName, spec.file)}:${spec.line}`,
        project: test.projectName,
        status: test.status, // expected | unexpected | flaky | skipped
        error: waitingFor ? `${firstLine.trim()} - ${waitingFor}` : firstLine.trim(),
        tries: test.results.length,
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child, here);
}
for (const suite of report.suites) walk(suite, []);

const failed = tests.filter((t) => t.status === 'unexpected');
const flaky = tests.filter((t) => t.status === 'flaky');
const passed = tests.filter((t) => t.status === 'expected');
const skipped = tests.filter((t) => t.status === 'skipped');
const seconds = Math.round(report.stats.duration / 1000);
const runErrors = (report.errors ?? []).map((e) => strip(e.message).split('\n').find((l) => l.trim()));

// 1. The verdict - first, and in words.
const verdict = failed.length || runErrors.length ? 'FAILED' : flaky.length ? 'PASSED, WITH FLAKY TESTS' : 'PASSED';
console.log(`## Tests${label}: ${verdict}\n`);
console.log('| Passed | Failed | Flaky | Skipped | Time |');
console.log('| ---: | ---: | ---: | ---: | ---: |');
console.log(`| ${passed.length} | ${failed.length} | ${flaky.length} | ${skipped.length} | ${seconds} s |\n`);

// 2. What went wrong - by name, with the first line of the error.
for (const message of runErrors) console.log(`**The run itself failed:** ${message}\n`);

if (failed.length) {
  console.log(`### Failed (${failed.length})\n`);
  for (const t of failed) console.log(`- **${t.name}** - \`${t.where}\` (${t.project})\n  ${t.error}`);
  console.log('');
}

if (flaky.length) {
  console.log(`### Flaky (${flaky.length}) - failed, then passed on a retry\n`);
  console.log('Green is not the same as fine. Each of these failed at least once. Open its trace.\n');
  for (const t of flaky) console.log(`- **${t.name}** - \`${t.where}\` (${t.project}, ${t.tries} tries)`);
  console.log('');
}

// 3. Where to look next.
if (failed.length || flaky.length) {
  console.log('**Where to look:** download the report from the Artifacts list at the bottom of this run,');
  console.log('unzip it into the repo, and run `npx playwright show-report <folder>`. Every failure has its trace.');
}
