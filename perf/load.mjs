// A small load test with no dependencies - so it runs on every laptop in the room.
//
//   npm run perf                          10 users, 15 seconds, the search endpoint
//   npm run perf -- --users 50            50 users at once
//   npm run perf -- --users 1 --seconds 10
//   npm run perf -- --path "/api/search?q=saw" --budget 300
//
// Each "user" sends a request, waits for the answer, and immediately sends the next one.
// Real customers pause to read; this is a stress test, not a model of a Tuesday afternoon.
//
// The industry tools (k6, JMeter, Gatling) do the same thing with far more control.
// perf/search.k6.js is this test written for k6 - try it once k6 is installed.
//
// Never point this at a site you do not own or have written permission to test.
// A load test against someone else's server is indistinguishable from an attack.

import { spawn } from 'node:child_process';

// ---------- settings ----------
const args = Object.fromEntries(
  process.argv.slice(2).join(' ').split('--').filter(Boolean).map((a) => {
    const [key, ...rest] = a.trim().split(/\s+/);
    return [key, rest.join(' ')];
  }),
);
const users = Number(args.users || 10);
const seconds = Number(args.seconds || 15);
const path = args.path || '/api/search?q=hammer';
const budgetMs = Number(args.budget || 200); // the p95 we promised. Above it, the run fails.
const baseURL = process.env.BASE_URL || 'http://localhost:4175';

// ---------- start the demo shop if nobody else has ----------
async function isUp() {
  try {
    return (await fetch(`${baseURL}/api/health`)).ok;
  } catch {
    return false;
  }
}

let shop;
if (!(await isUp())) {
  if (process.env.BASE_URL) {
    console.error(`Nothing answering at ${baseURL}. Is BASE_URL right?`);
    process.exit(1);
  }
  shop = spawn(process.execPath, ['app/server.js'], { stdio: 'ignore' });
  for (let i = 0; i < 50 && !(await isUp()); i++) await new Promise((r) => setTimeout(r, 100));
}

// ---------- the test ----------
const times = [];
let errors = 0;
const endAt = Date.now() + seconds * 1000;

async function user() {
  while (Date.now() < endAt) {
    const start = performance.now();
    try {
      const res = await fetch(baseURL + path);
      await res.arrayBuffer(); // the response is not finished until the body has arrived
      if (!res.ok) errors++;
    } catch {
      errors++;
    }
    times.push(performance.now() - start);
  }
}

console.log(`\nLoad test: GET ${path}`);
console.log(`${users} user${users === 1 ? '' : 's'} for ${seconds} s, no pause between requests\n`);
await Promise.all(Array.from({ length: users }, user));
shop?.kill();

// ---------- the numbers ----------
times.sort((a, b) => a - b);
const pct = (p) => times[Math.min(times.length - 1, Math.ceil((p / 100) * times.length) - 1)];
const ms = (v) => `${Math.round(v)} ms`.padStart(8);
const p95 = pct(95);
const errorRate = errors / times.length;
const average = times.reduce((a, b) => a + b, 0) / times.length;

console.log(`  requests     ${String(times.length).padStart(8)}   (${(times.length / seconds).toFixed(0)} per second)`);
console.log(`  errors       ${String(errors).padStart(8)}   (${(errorRate * 100).toFixed(1)}%)`);
console.log(`  fastest      ${ms(times[0])}`);
console.log(`  median (p50) ${ms(pct(50))}   half of all requests were faster than this`);
console.log(`  p95          ${ms(p95)}   1 in 20 was slower than this    budget ${budgetMs} ms`);
console.log(`  p99          ${ms(pct(99))}`);
console.log(`  slowest      ${ms(times[times.length - 1])}`);
console.log(`  average      ${ms(average)}   (the number not to report - see the study guide)\n`);

// A load test with no pass/fail line is a demo, not a test.
const failures = [];
if (p95 > budgetMs) failures.push(`p95 is ${Math.round(p95)} ms - over the ${budgetMs} ms budget`);
if (errorRate > 0.01) failures.push(`${(errorRate * 100).toFixed(1)}% of requests failed - over 1%`);
console.log(failures.length ? `  FAIL  ${failures.join('; ')}\n` : `  PASS  p95 within ${budgetMs} ms, errors under 1%\n`);
process.exit(failures.length ? 1 : 0);
