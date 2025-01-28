const puppeteer = require("puppeteer")
const path = require("path")
const fs = require("fs").promises

exports.captureScreenshots = async (url) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: {
        width: 1920,  // Full HD width
        height: 1080, // Full HD height
        deviceScaleFactor: 2  // 2x resolution for clarity
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    await page.goto(url, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 60000
    });

    // Get full page height
    const fullHeight = await page.evaluate(() => {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    });

    // Calculate number of screenshots needed
    const viewportHeight = 1080; // Match viewport height
    const screenshotsCount = Math.ceil(fullHeight / viewportHeight);
    const screenshots = [];

    // Take sequential screenshots
    for (let i = 0; i < screenshotsCount; i++) {
      // Scroll to the correct position
      await page.evaluate((i, viewportHeight) => {
        window.scrollTo(0, i * viewportHeight);
      }, i, viewportHeight);

      // Wait for any lazy-loaded content
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Take the screenshot
      const base64Data = await page.screenshot({
        encoding: 'base64',
        clip: {
          x: 0,
          y: i * viewportHeight,
          width: 1920,
          height: Math.min(viewportHeight, fullHeight - (i * viewportHeight))
        },
        type: 'png'
      });

      screenshots.push({
        fileName: `img${(i + 1).toString().padStart(2, '0')}.png`,
        base64: base64Data,
        order: i + 1
      });

    }

    return {
      message: "Screenshots captured successfully",
      totalScreenshots: screenshotsCount,
      screenshots: screenshots
    };
  } catch (error) {
    console.error('Screenshot capture error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

