import React, { useState, useEffect } from "react"
import axios from "axios"
import Header from "./components/Header"
import InputForm from "./components/InputForm"
import ProgressBar from "./components/ProgressBar"
import ResultDisplay from "./components/ResultDisplay"
import ScreenshotGallery from "./components/ScreenshotGallery"

function App() {
  const [url, setUrl] = useState("")
  const [isCapturing, setIsCapturing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [sessionId] = useState(() => Date.now().toString())
  const [eventSource, setEventSource] = useState(null)

  // Cleanup function for SSE
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  const saveScreenshotsToPublic = async (screenshots) => {
    try {
      // Generate a unique folder name using timestamp
      const timestamp = Date.now()
      const folderName = `screenshots_${timestamp}`

      const response = await axios.post("https://webpage-screen-shotter.vercel.app/save-screenshots", {
        screenshots,
        folderName
      })

      return response.data.folderPath
    } catch (error) {
      console.error('Error saving screenshots:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsCapturing(true)
    setError(null)
    setProgress(0)
    setScreenshots([])

    if (eventSource) {
      eventSource.close()
    }

    const sse = new EventSource(`https://webpage-screen-shotter.vercel.app/capture-progress?url=${encodeURIComponent(url)}`)
    setEventSource(sse)

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.error) {
        setError(data.error)
        setIsCapturing(false)
        sse.close()
        return
      }

      if (data.progress) {
        setProgress(data.progress)
      }

      if (data.screenshots) {
        const processedScreenshots = data.screenshots.map(screenshot => ({
          ...screenshot,
          imageUrl: `https://webpage-screen-shotter.vercel.app${screenshot.imageUrl}`
        }))
        setScreenshots(processedScreenshots)
        setIsCapturing(false)
        sse.close()
      }
    }

    sse.onerror = (error) => {
      console.error("SSE error:", error)
      setError("An error occurred while capturing screenshots.")
      setIsCapturing(false)
      setProgress(0)
      sse.close()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-indigo-300">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Website Screenshot Capture
              </h2>
              <InputForm url={url} setUrl={setUrl} handleSubmit={handleSubmit} isCapturing={isCapturing} />
              {isCapturing && (
                <div className="mt-6">
                  <ProgressBar progress={progress} />
                </div>
              )}
              <ResultDisplay isCapturing={isCapturing} progress={progress} error={error} />
            </div>
          </div>
          {screenshots.length > 0 && (
            <ScreenshotGallery screenshots={screenshots} sessionId={sessionId} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App

