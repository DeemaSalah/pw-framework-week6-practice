package toolshop;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Duration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Week 6 - reading Selenium.
 *
 * One test you already know - sign in, add a hammer, check the cart badge - written the way most
 * job adverts will show it to you: Java, JUnit 5 and Selenium 4. You are not asked to write this.
 * You are asked to read it, and to say what Playwright would have done for you.
 *
 * Read it next to selenium/README.md, which puts the Playwright version beside it.
 */
class AddToCartTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    void openBrowser() {
        driver = new ChromeDriver(); // Selenium Manager finds (or downloads) a driver for your Chrome
        wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    }

    @AfterEach
    void closeBrowser() {
        driver.quit(); // forget this and every run leaves a Chrome window behind
    }

    @Test
    void addingAProductUpdatesTheCartBadge() throws InterruptedException {
        driver.get("http://localhost:4175/login");
        driver.findElement(By.id("email")).sendKeys("customer@practice.test");
        driver.findElement(By.id("password")).sendKeys(System.getenv("SHOP_PASSWORD"));
        driver.findElement(By.cssSelector("[data-test='login-submit']")).click();

        // The products arrive about a second after the page does. Wait for the hammer's card.
        WebElement hammer = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//li[.//h2[text()='Claw Hammer']]")));

        int before = Integer.parseInt(driver.findElement(By.cssSelector("[data-test='cart-count']")).getText());
        hammer.findElement(By.tagName("button")).click();

        Thread.sleep(1000); // give the cart time to save

        int after = Integer.parseInt(driver.findElement(By.cssSelector("[data-test='cart-count']")).getText());
        assertEquals(before + 1, after);
    }
}
