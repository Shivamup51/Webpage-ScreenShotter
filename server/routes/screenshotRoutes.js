const express = require("express")
const router = express.Router()
const screenshotController = require("../controllers/screenshotController")
const puppeteer = require("puppeteer-core")
const chrome = require("@sparticuz/chromium")
const fs = require("fs").promises
const path = require("path")

// Helper function to create screenshot directory
async function createScreenshotDirectory(folderName) {
    const screenshotsDir = path.join(__dirname, '..', '..', 'client', 'public', 'screenshots', folderName)
    await fs.mkdir(screenshotsDir, { recursive: true })
    return screenshotsDir
}

router.get("/screenshots", screenshotController.getScreenshots)
router.post("/capture", screenshotController.captureScreenshots)
router.post("/save-screenshots", screenshotController.saveScreenshots)

router.get("/capture-progress", async (req, res) => {
    const { url } = req.query
    let browser = null;
    
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        // Use chromium for Vercel deployment
        browser = await puppeteer.launch({
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath(),
            headless: chrome.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage()
        
        // Set high-quality viewport
        await page.setViewport({ 
            width: 1920,    // Full HD width
            height: 1080,   // Full HD height
            deviceScaleFactor: 2  // Increased for better quality
        })

        res.write(`data: ${JSON.stringify({ progress: 10 })}\n\n`)

        // Load page and wait for content
        await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        })
        
        // Get full page height
        const pageHeight = await page.evaluate(() => 
            Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            )
        )

        // Create directory for sequential screenshots
        const folderName = `webpage_screenshots_${Date.now()}`
        const screenshotsDir = path.join(__dirname, '..', '..', 'client', 'public', 'screenshots', folderName)
        await fs.mkdir(screenshotsDir, { recursive: true })

        const screenshots = []
        const sectionHeight = 1080  // Full HD height
        const sections = Math.ceil(pageHeight / sectionHeight)

        // Take sequential screenshots
        for (let i = 0; i < sections; i++) {
            // Ensure proper sequential naming (img01.png, img02.png, etc.)
            const fileName = `img${String(i + 1).padStart(2, '0')}.png`
            const filePath = path.join(screenshotsDir, fileName)

            // Capture screenshot with precise dimensions
            await page.screenshot({
                path: filePath,
                clip: {
                    x: 0,
                    y: i * sectionHeight,
                    width: 1920,
                    height: Math.min(sectionHeight, pageHeight - (i * sectionHeight))
                },
                type: 'png',  // Ensure high quality for AI processing
                omitBackground: false  // Include background for complete UI capture
            })

            screenshots.push({
                fileName,
                imageUrl: `/screenshots/${folderName}/${fileName}`,
                order: i + 1
            })

            const progress = Math.floor(30 + ((i + 1) / sections * 60))
            res.write(`data: ${JSON.stringify({ progress })}\n\n`)
        }

        res.write(`data: ${JSON.stringify({
            progress: 100,
            screenshots
        })}\n\n`)

        await browser.close()
        res.end()

    } catch (error) {
        console.error("Error:", error);
        if (browser) {
            await browser.close()
        }
        res.write(`data: ${JSON.stringify({ error: "Failed to capture screenshots" })}\n\n`)
        res.end()
    }
})

// Add this route to test environment variables
router.get("/test-env", (req, res) => {
    res.json({
        nodeEnv: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL
    })
})

module.exports = router

