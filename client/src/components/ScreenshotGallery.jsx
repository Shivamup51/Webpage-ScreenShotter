import React, { useState } from 'react';

function ScreenshotGallery({ screenshots, sessionId }) {
  const [showGallery, setShowGallery] = useState(false);

  const handleDownloadAll = () => {
    screenshots.forEach((screenshot) => {
      const link = document.createElement('a');
      link.href = screenshot.imageUrl;
      link.download = screenshot.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (!screenshots.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowGallery(!showGallery)}
            className="px-6 py-2 rounded-lg font-medium text-white bg-pink-500 hover:bg-rose-300 transition-all flex items-center space-x-2"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${showGallery ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{showGallery ? 'Hide Screenshots' : 'View Screenshots'}</span>
          </button>
          <button
            onClick={handleDownloadAll}
            className="px-6 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-500 active:bg-green-800 transition-all flex items-center space-x-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download All</span>
          </button>
        </div>
      </div>

      {showGallery && (
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8">
            {screenshots.map((screenshot, index) => (
              <div 
                key={`${sessionId}-${index}`} 
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all hover:shadow-xl"
              >
                <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Screenshot {screenshot.order}
                  </span>
                  <a
                    href={screenshot.imageUrl}
                    download={screenshot.fileName}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download</span>
                  </a>
                </div>
                <div className="relative group">
                  <img 
                    src={screenshot.imageUrl}
                    alt={`Screenshot ${screenshot.order}`} 
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScreenshotGallery; 