# Reading Selenium

Most job adverts for test automation still say **Selenium**, usually with **Java**. You do not need
to write it to get through an interview; you do need to read it, and to say how it compares with
what you already know. This folder is one test, for reading.

`src/test/java/toolshop/AddToCartTest.java` signs in, adds a hammer to the cart, and checks the
cart badge went up by one. Here is the same job in this repo's Playwright:

```ts
test('adding a product updates the cart badge', async ({ shopper, shopPage }) => {
  await shopPage.goto();
  await shopPage.addToCart('Claw Hammer');
  await expect(shopPage.header.cartCount).toHaveText('1');
});
```

## The same ideas, different words

| Selenium (Java) | Playwright (TypeScript) |
| --- | --- |
| `WebDriver driver = new ChromeDriver()` | the `page` fixture |
| `driver.get(url)` | `page.goto(url)` |
| `driver.findElement(By.id("email"))` | `page.locator('#email')` - better: `page.getByLabel('Email address')` |
| `By.cssSelector`, `By.xpath` | `page.locator(...)` - better: `getByRole`, `getByLabel`, `getByTestId` |
| `element.sendKeys("text")` | `locator.fill('text')` |
| `element.click()` | `locator.click()` - waits for the element to be ready first |
| `new WebDriverWait(driver, Duration.ofSeconds(5))` + `ExpectedConditions` | built in: every action and every `expect` waits |
| `assertEquals(expected, actual)` | `await expect(locator).toHaveText(...)` - retries until true |
| `@BeforeEach` / `@AfterEach` | fixtures: setup before `use()`, teardown after |
| `driver.quit()` | done for you when the test ends |
| Selenium Grid | `workers`, sharding, or a cloud browser provider |

## Reading questions

1. Which line would you delete first, and what would you put instead?
2. Why does the test need `wait.until(...)` at all?
3. What do `@BeforeEach` and `@AfterEach` do? What is the Playwright equivalent?
4. The test reads the badge's number *before* adding. What problem is it working around - and what
   would you do instead?
5. Which locator will break first when the page changes?
6. Name two things Selenium has that Playwright does not.

Answers: `solutions/selenium/reading-answers.md`.

## Running it (optional)

You need Java 17+, Maven and Chrome. The demo shop must be running (`npm run shop`). Then, from
this folder: `mvn test`, with `SHOP_PASSWORD` set in your environment. Selenium Manager, built into
Selenium, finds a matching ChromeDriver for you.
