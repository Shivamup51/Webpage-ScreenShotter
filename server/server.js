const express = require("express")
const cors = require("cors")
const path = require("path")
require('dotenv').config()

// Import routes
const screenshotRoutes = require("./routes/screenshotRoutes")

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || "https://webpage-screen-shotter-frontend.vercel.app"

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// CORS configuration
app.use(cors({
    origin: [FRONTEND_URL, "https://webpage-screen-shotter.vercel.app"],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// Serve static files
app.use('/screenshots', express.static(path.join(__dirname, 'public', 'screenshots')))

// Routes
app.use('/', screenshotRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something broke!' })
})

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' })
})

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

module.exports = app

