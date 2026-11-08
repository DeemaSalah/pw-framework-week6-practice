# <Title: what is wrong, where, and for whom - in one line>

A good title lets someone triage the bug without opening it.
Weak: "Orders bug". Strong: "Any signed-in customer can read any other customer's order by its number".

**Severity:** Critical / Major / Minor / Trivial — how much damage it does
**Priority:** P1 / P2 / P3 — how soon it must be fixed (the team decides; you propose)
**Found by:** <test name, or "exploratory testing">  ·  **Environment:** <build, URL, browser, device>

## Steps to reproduce

1.
2.
3.

Short, numbered, starting from somewhere anyone can get to. If a test reproduces it, name the
test and the command — that is the best set of steps there is.

## Expected

<What should have happened. Point to the requirement if there is one.>

## Actual

<What happened. Exact status codes, messages and values — copied, not paraphrased.>

## Evidence

<Trace, screenshot, the request and response, the pipeline run link.>

## Impact

<Who is affected, how many, and what it costs them or us. This is what gets a bug fixed.>

---

**Security bugs are different.** Never put one in a public issue tracker, a public repository
or a group chat — that publishes the attack. Report it privately to whoever owns the product,
the way your company says to. For this course the shop is fake, so a file in your repo is fine.
