# Test strategy — <product or feature>

One page. If it does not fit on one page, nobody will read it — including you, in three months.
A strategy answers *what could hurt us, and how will we know in time?* It is not a list of
test cases. Write it before the tests, and change it when the risks change.

**Owner:** <name>  ·  **Last updated:** <date>

## 1. What we are testing, and why

<Two or three sentences. What does the product do, who depends on it, and what would a bad
release cost? Name what is IN scope and what is OUT.>

## 2. The risks that matter most

Ranked. Each one is something that could go wrong *and* would hurt.

| # | Risk | How bad | How likely | How we will know |
| - | --- | --- | --- | --- |
| 1 | | High / Medium / Low | High / Medium / Low | <which tests, checks or monitors> |
| 2 | | | | |
| 3 | | | | |

## 3. How we test it

| Level | What it covers | Tool | When it runs | Who |
| --- | --- | --- | --- | --- |
| API | | | | |
| UI end-to-end | | | | |
| Accessibility | | | | |
| Performance | | | | |
| Security | | | | |
| Exploratory, by hand | | | | |

Most checks low in the pyramid (fast, many); few at the top (slow, precious). Say why if not.

## 4. Environments and data

<Where do tests run? Where does test data come from, and who cleans it up? Where do secrets live?>

## 5. Quality gates

| Gate | What must be true | What happens if not |
| --- | --- | --- |
| Pull request | | |
| Nightly | | |
| Release | | |

## 6. What we are deliberately NOT testing

<And why. "We ran out of time" is a reason; write it down anyway — it is a risk someone accepted.>

## 7. How we report

<What the team sees after each run, each week, and before a release. Who decides go / no-go.>
