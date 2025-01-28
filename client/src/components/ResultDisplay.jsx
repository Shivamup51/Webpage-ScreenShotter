import React from "react"
import { BsCheckCircleFill } from "react-icons/bs";
import { HiXCircle } from "react-icons/hi2";


function ResultDisplay({ isCapturing, progress, error }) {
  if (isCapturing) {
    return null
  }

  if (error) {
    return (
      <div className="mt-8 flex items-center text-red-500">
        <HiXCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    )
  }

  if (progress === 100) {
    return (
      <div className="mt-8 flex items-center text-pink-500">
        <BsCheckCircleFill className="h-5 w-5 mr-2" />
        Screenshots captured successfully!
      </div>
    )
  }

  return null
}

export default ResultDisplay

