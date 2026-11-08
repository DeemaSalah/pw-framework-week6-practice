# MODEL ANSWER - reading Selenium

Questions and answers for `selenium/src/test/java/toolshop/AddToCartTest.java`.

**1. Which line would you delete first, and what would you put instead?**
`Thread.sleep(1000);` - a fixed wait. It makes every run a second slower, and it is still a guess:
on a slow day the cart takes longer and the test fails. Replace it with an explicit wait for the
thing you actually need - the badge showing the new number:

```java
wait.until(ExpectedConditions.textToBe(By.cssSelector("[data-test='cart-count']"), String.valueOf(before + 1)));
```

Playwright's `expect(badge).toHaveText('1')` does that on its own: every assertion retries until
it passes or times out.

**2. Why does the test need `wait.until(...visibilityOfElementLocated...)` at all?**
`findElement` looks once and fails at once if the element is not there yet - and the products
arrive a second after the page. Selenium waits only where you tell it to. Playwright waits before
every action and inside every assertion.

**3. What do `@BeforeEach` and `@AfterEach` do? What is the Playwright equivalent?**
Open a browser before each test and close it after - setup and teardown. In Playwright the `page`
fixture does both, and your own fixtures (`shopper`, `otherCustomer`) follow the same pattern.

**4. The test signs in as the shared customer and reads the badge's number before adding.
What problem is it working around - and what would you do instead?**
The shared customer's cart may already contain things, from earlier runs or from other tests
running in parallel. Reading "before" makes the test survive that - mostly. Two tests adding to the
same cart at the same moment would still collide. Better: a fresh user per test, as in Week 5.

**5. Where is the locator that will break first when the page changes?**
The XPath `//li[.//h2[text()='Claw Hammer']]` - it depends on the exact tags (`li`, `h2`) and on the
structure between them. Playwright's `getByRole('listitem').filter({ has: getByRole('heading',
{ name: 'Claw Hammer' }) })` says the same thing in terms of what the user sees.

**6. Name two things Selenium has that Playwright does not.**
Any of: language bindings for more languages (Java, Python, C#, Ruby and JavaScript);
Selenium Grid for running browsers on your own machines at scale; support for older browsers;
it implements the W3C WebDriver standard, which browser vendors build drivers for; twenty years of
answers on the internet and many existing suites - which is why job adverts still ask for it.
