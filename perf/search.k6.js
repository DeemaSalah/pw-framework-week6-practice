// The same load test as perf/load.mjs, written for k6 - the tool you will meet at work.
// Optional homework. Install k6 (https://grafana.com/docs/k6/latest/set-up/install-k6/), then:
//
//   npm run shop                      (in another terminal)
//   k6 run perf/search.k6.js
//   k6 run --vus 50 perf/search.k6.js
//
// What k6 adds over our script: ramping users up and down (stages), many scenarios at once,
// checks, and thresholds that turn the run red - the same idea as our 200 ms budget.

import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4175';

export const options = {
  vus: 10, // virtual users, each looping through the function below
  duration: '15s',
  thresholds: {
    http_req_duration: ['p(95)<200'], // the budget: 95% of requests under 200 ms
    http_req_failed: ['rate<0.01'], // and fewer than 1% failing
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/search?q=hammer`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'found the hammer': (r) => r.json('results.0.name') === 'Claw Hammer',
  });
}
