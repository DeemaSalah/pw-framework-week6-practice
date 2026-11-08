# Test status — <product>, <date>

Five lines a busy person can read on a phone. The verdict first; detail only if they ask.

**Verdict:** <Ready / Ready with known risks / Not ready> — <one reason>

**What ran:** <which suites, which browsers, how many tests, pass / fail / flaky>

**New problems:** <bug, severity, one line each — most severe first>

**Not tested:** <what you did not cover, and the risk that leaves>

**Decision needed:** <what you need from whom, and by when — or "none">

---

Rules of thumb
- Lead with the verdict, not with the effort. "We ran 96 tests" is not news; "not ready, because
  any customer can read any order" is.
- Numbers need a comparison. "3 flaky" means little; "3 flaky, up from 0 last week" means a lot.
- Say what you did not test. Silence reads as "covered".
- No blame. A bug is a fact about the product, not about a person.
