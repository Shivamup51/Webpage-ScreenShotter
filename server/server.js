const express = require("express")
const cors = require("cors")
const path = require("path")
const screenshotRoutes = require("./routes/screenshotRoutes")

const app = express()
app.use(cors({
    origin: "https://webpage-screen-shotter-frontend.vercel.app",
    credentials: true,
    // Add these headers for SSE support
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Accept"]
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Middleware to handle SSE connections
app.use((req, res, next) => {
    // Check if it's an SSE request
    if (req.headers.accept && req.headers.accept === 'text/event-stream') {
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        
        // Keep the connection alive
        const intervalId = setInterval(() => {
            res.write(':keepalive\n\n')
        }, 30000)

        // Clean up on client disconnect
        res.on('close', () => {
            clearInterval(intervalId)
        })
    }
    next()
})

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/screenshots', express.static(path.join(__dirname, '..', 'client', 'public', 'screenshots')));

app.use("/", screenshotRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

