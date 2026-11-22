# Performance Testing Report

## 1. Test Overview

- **Endpoint:** `GET /api/search?q=hammer`
- **Tool:** Node.js (`perf/load.mjs`)
- **Duration:** 15 seconds per test
- **Load levels:** 1, 5, 10, 25, and 50 users
- **Performance budget:** p95 must be below 200ms

## 2. Test Results

| Concurrent Users | Requests | RPS | p50 (ms) | p95 (ms) | Errors | Result |
|---:|---:|---:|---:|---:|---:|---|
| 1 | 497 | 33 | 31 | 37 | 0% | PASS |
| 5 | 892 | 59 | 83 | 93 | 0% | PASS |
| 10 | 818 | 55 | 171 | 249 | 0% | FAIL |
| 25 | 705 | 47 | 554 | 667 | 0% | FAIL |
| 50 | 939 | 63 | 840 | 872 | 0% | FAIL |

## 3. Performance Analysis

The p95 response time first exceeded the 200ms performance budget at 10 users, reaching 249ms.

At 25 users, p95 increased to 667ms, and at 50 users it reached 872ms.

All tests recorded 0% errors, but response times increased at higher load.

## 4. Breaking Point

The first observed performance violation was at **10 users**.

- 1 and 5 users: Within the performance budget.
- 10, 25, and 50 users: Exceeded the 200ms p95 budget.

This identifies 10 users as the first tested load level where the performance requirement was violated, not necessarily the exact maximum capacity of the server.

## 5. Team Summary

-The search endpoint maintained acceptable performance with 1 and 5 users, keeping p95 below 200ms.  
-At 10 users, p95 increased to 249ms and exceeded the performance budget,and went higher at 25 and 50 users.  
-Although no request errors occurred, the response time measurements indicate that the endpoint requires performance investigation under higher loads.