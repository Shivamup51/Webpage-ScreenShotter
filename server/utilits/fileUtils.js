const fs = require("fs").promises
const path = require("path")

exports.createScreenshotDirectory = async () => {
  try {
    const screenshotDir = path.join(__dirname, "..", "public", "screenshots")
    await fs.mkdir(screenshotDir, { recursive: true })
    return screenshotDir
  } catch (error) {
    console.error("Error creating screenshot directory:", error)
    throw error
  }
}

