# MODEL ANSWER - EX 7: the status update

Written from a nightly run and EX 6, for the team channel. Five lines. The numbers are an example -
yours come from your own run; the shape is what matters.

> **Test status - Toolshop, Friday**
>
> **Verdict:** Not ready to release - any customer can read any other customer's order.
>
> **What ran:** 24 tests on Chromium, Firefox, WebKit and a Pixel 7 screen. Desktop: all green.
> Phone: 3 failures from 2 bugs.
>
> **New problems:** (1) Critical - order details readable by any signed-in customer (BUG-ORDERS).
> (2) Major - on phones, Sign out is pushed off the header and cannot be tapped. (3) Major - on
> phones, the cart table is too wide and Remove cannot be tapped. Also: the products page has
> 4 accessibility problems, 2 of them invisible to automated checks.
>
> **Not tested:** real phones (only an emulated screen size); performance on production-sized
> servers; payment, which the demo shop does not have.
>
> **Decision needed:** fix BUG-ORDERS before release - yes or no? Today, please.

Why it works
- The verdict and its one reason come first. Everything else is supporting detail.
- "3 failures from 2 bugs" shows triage happened - nobody has to wonder whether it is 3 bugs.
- "Not tested" is said out loud, so nobody mistakes silence for coverage.
- It asks for one specific decision, from the people who can make it.
