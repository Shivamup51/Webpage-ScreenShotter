const screenshotService = require("../services/screenshotService")
const fs = require('fs').promises;
const path = require('path');

exports.captureScreenshots = async (req, res) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ error: "URL is required" })
  }

  try {
    const result = await screenshotService.captureScreenshots(url)
    res.json(result)
  } catch (error) {
    console.error("Capture error:", error)
    res.status(500).json({ error: "An error occurred while capturing screenshots" })
  }
}

exports.getScreenshots = async (req, res) => {
  try {
    const screenshotDir = path.join(__dirname, '..', 'public', 'screenshots');
    const files = await fs.readdir(screenshotDir);
    const screenshots = files
      .filter(file => file.endsWith('.png'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
      })
      .map(file => `/screenshots/${file}`);
    
    res.json({ screenshots });
  } catch (error) {
    console.error("Error getting screenshots:", error);
    res.status(500).json({ error: 'Failed to get screenshots' });
  }
};

exports.saveScreenshots = async (req, res) => {
  const { screenshots, folderName } = req.body;

  try {
    // Create the screenshots directory in the client's public folder
    const clientPublicDir = path.join(__dirname, '../../client/public/screenshots');
    const folderPath = path.join(clientPublicDir, folderName);
    
    await fs.mkdir(folderPath, { recursive: true });

    // Save each screenshot
    for (const screenshot of screenshots) {
      const buffer = Buffer.from(screenshot.base64, 'base64');
      const fileName = `screenshot_${(screenshot.order).toString().padStart(2, '0')}.png`;
      const filePath = path.join(folderPath, fileName);
      await fs.writeFile(filePath, buffer);
    }

    res.json({ 
      success: true, 
      folderPath: `/screenshots/${folderName}` 
    });
  } catch (error) {
    console.error('Error saving screenshots:', error);
    res.status(500).json({ error: 'Failed to save screenshots' });
  }
};

