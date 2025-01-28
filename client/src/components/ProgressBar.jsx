import React, { useState, useEffect } from "react"

function ProgressBar({ progress }) {
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    // Reset currentProgress when progress is 0
    if (progress === 0) {
      setCurrentProgress(0)
      return
    }

    const timer = setInterval(() => {
      setCurrentProgress(prevProgress => {
        if (prevProgress < progress) {
          return prevProgress + 1
        }
        clearInterval(timer)
        return prevProgress
      })
    }, 20) // Updates every 20ms for smooth animation

    return () => clearInterval(timer)
  }, [progress])

  return (
    <div className="mt-8">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-purple-600">{currentProgress}%</span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
          <div
            style={{ width: `${currentProgress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500 ease-out"
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar

