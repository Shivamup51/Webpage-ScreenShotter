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
    let browser = null
    
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        console.log("Starting screenshot capture for URL:", url)

        // Configure chrome options for Vercel
        const options = {
            args: [
                ...chrome.args,
                "--hide-scrollbars",
                "--disable-web-security",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
                "--no-first-run",
                "--no-zygote",
                "--single-process"
            ],
            defaultViewport: {
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1
            },
            executablePath: await chrome.executablePath(),
            headless: true,
            ignoreHTTPSErrors: true,
        }

        console.log("Launching browser with options:", JSON.stringify(options))
        browser = await puppeteer.launch(options)
        
        console.log("Creating new page")
        const page = await browser.newPage()
        
        // Set longer timeouts
        await page.setDefaultNavigationTimeout(60000)
        await page.setDefaultTimeout(60000)

        console.log("Sending initial progress")
        res.write(`data: ${JSON.stringify({ progress: 10 })}\n\n`)

        console.log("Navigating to URL")
        try {
            await page.goto(url, { 
                waitUntil: ['load', 'networkidle0'],
                timeout: 60000 
            })
        } catch (navigationError) {
            console.error("Navigation error:", navigationError)
            res.write(`data: ${JSON.stringify({ error: "Failed to load the webpage. Please check the URL and try again." })}\n\n`)
            res.end()
            return
        }

        console.log("Getting page height")
        const pageHeight = await page.evaluate(() => {
            return Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                1080
            )
        })

        console.log("Page height:", pageHeight)
        const screenshots = []
        const sectionHeight = 1080
        const sections = Math.ceil(pageHeight / sectionHeight)

        console.log("Starting screenshot capture, sections:", sections)
        for (let i = 0; i < sections; i++) {
            try {
                console.log(`Capturing section ${i + 1} of ${sections}`)
                
                await page.evaluate((i, height) => {
                    window.scrollTo(0, i * height)
                }, i, sectionHeight)

                // Wait for scrolling and content to settle
                await page.waitForTimeout(1000)

                const screenshot = await page.screenshot({
                    type: 'png',
                    encoding: 'base64',
                    clip: {
                        x: 0,
                        y: i * sectionHeight,
                        width: 1920,
                        height: Math.min(sectionHeight, pageHeight - (i * sectionHeight))
                    },
                    omitBackground: false
                })

                screenshots.push({
                    fileName: `screenshot_${(i + 1).toString().padStart(2, '0')}.png`,
                    base64: screenshot,
                    order: i + 1,
                    imageUrl: `/screenshots/screenshot_${(i + 1).toString().padStart(2, '0')}.png`
                })

                const progress = Math.floor(30 + ((i + 1) / sections * 60))
                res.write(`data: ${JSON.stringify({ progress })}\n\n`)

            } catch (screenshotError) {
                console.error(`Error capturing section ${i + 1}:`, screenshotError)
                continue
            }
        }

        console.log(`Captured ${screenshots.length} screenshots`)
        if (screenshots.length > 0) {
            res.write(`data: ${JSON.stringify({
                progress: 100,
                screenshots
            })}\n\n`)
        } else {
            res.write(`data: ${JSON.stringify({ 
                error: "Failed to capture any screenshots" 
            })}\n\n`)
        }

    } catch (error) {
        console.error("Capture error:", error)
        res.write(`data: ${JSON.stringify({ 
            error: "Failed to capture screenshots. Please try again." 
        })}\n\n`)
    } finally {
        if (browser) {
            console.log("Closing browser")
            await browser.close()
        }
        res.end()
    }
})

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({ status: "OK" })
})

// Add this route to test environment variables
router.get("/test-env", (req, res) => {
    res.json({
        nodeEnv: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL
    })
})

// Test endpoint
router.get("/test", (req, res) => {
    res.json({ status: "OK", message: "Screenshot service is running" })
})

module.exports = router

