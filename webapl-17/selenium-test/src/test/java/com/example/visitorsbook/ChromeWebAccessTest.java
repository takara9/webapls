package com.example.visitorsbook.it;

import java.time.Duration;
import java.nio.file.Path;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeOptions;

import static io.github.bonigarcia.wdm.WebDriverManager.isDockerAvailable;
import io.github.bonigarcia.wdm.WebDriverManager;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assumptions.assumeThat;



public class ChromeWebAccessTest {

	String url = "https://ingress.k8s4.labo.local";
	//String url = "http://webapl-17.test.k8s4.labo.local";
    WebDriver driver;

    WebDriverManager wdm = WebDriverManager.chromedriver().browserInDocker()
        .enableRecording();
        //.browserVersion("beta");
   
    
    @BeforeEach
    public void setupTest() {
        //assumeThat(isDockerAvailable()).isTrue();
    	ChromeOptions options = new ChromeOptions();
    	options.setAcceptInsecureCerts(true);
    	wdm.capabilities(options);
        driver = wdm.create();
    }

    @AfterEach
    public void teardown() {
        wdm.quit();
    }

    // トップページからビジターリストへ遷移
    @Test
    public void it_トップからリスト画面遷移001() throws Exception {
        System.out.println("it_トップからリスト画面遷移001");
        driver.get(url + "/");
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));
        Thread.sleep(Duration.ofSeconds(2).toMillis());
        assertThat(driver.getTitle()).isEqualTo("ビジターブック");

        // 画面を２秒表示
        Thread.sleep(Duration.ofSeconds(2).toMillis());
        driver.findElement(By.xpath("//a[text()='ビジターのリスト表示']")).click(); 
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));

        // 画面を２秒表示
        Thread.sleep(Duration.ofSeconds(2).toMillis());
        Path recordingPath = wdm.getDockerRecordingPath();
        System.out.println("path = " + recordingPath);
        assertThat(recordingPath).exists();
    }

    // トップページからインプットへ遷移
    @Test
    public void it_トップからインプット画面遷移002() throws Exception {
        System.out.println("it_トップからインプット画面遷移002");

        driver.get(url + "/");
        assertThat(driver.getTitle()).contains("ビジターブック");
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));

        // 画面を２秒表示
        Thread.sleep(Duration.ofSeconds(2).toMillis());
        driver.findElement(By.xpath("//a[text()='ビジター登録']")).click(); 
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));

        // 画面を２秒表示
        Thread.sleep(Duration.ofSeconds(2).toMillis());
        Path recordingPath = wdm.getDockerRecordingPath();
        System.out.println("path = " + recordingPath);
        assertThat(recordingPath).exists();
    }

    // ビジター登録
    @Test
    public void it_ユーザー登録画面003() throws Exception {
        System.out.println("it_ユーザー登録画面003");

        driver.get(url + "/input.html");
        assertThat(driver.getTitle()).contains("ビジター登録");
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));
	
        // テストユーザー登録
        WebElement searchBox1 = driver.findElement(By.name("user_name"));
        searchBox1.sendKeys("吉高 百合子");

        WebElement searchBox2 = driver.findElement(By.name("user_email"));
        searchBox2.sendKeys("yoshitaka@labo.local");

        WebElement radio1 = driver.findElement(By.name("rb-1"));
        WebElement radio2 = driver.findElement(By.name("rb-2"));
        radio2.click();
        
        WebElement searchButton = driver.findElement(By.name("submit"));
        searchButton.click();   
        
        Thread.sleep(Duration.ofSeconds(2).toMillis());
        Path recordingPath = wdm.getDockerRecordingPath();
        assertThat(recordingPath).exists();
    }

    
    @Test
    public void it_ユーザーのリスト表示004() throws Exception {
        System.out.println("it_ユーザーのリスト表示004");

        driver.get(url + "/list.html");
        assertThat(driver.getTitle()).contains("ビジターリスト");
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));
	
        Thread.sleep(Duration.ofSeconds(2).toMillis());
        Path recordingPath = wdm.getDockerRecordingPath();
        assertThat(recordingPath).exists();
    }


    @Test
    public void ref_リファレンステスト_グーグル検索000() throws Exception {
        System.out.println("it_グーグル検索000");
        
        driver.get("https://google.com");
        Assertions.assertEquals("Google", driver.getTitle());
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));

        WebElement searchBox = driver.findElement(By.name("q"));
        WebElement searchButton = driver.findElement(By.name("btnK"));
        searchBox.sendKeys("Selenium");
        searchButton.click();

        searchBox = driver.findElement(By.name("q"));
        Assertions.assertEquals("Selenium", searchBox.getAttribute("value"));
    }
}
