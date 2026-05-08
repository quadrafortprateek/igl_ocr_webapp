import { useState, useRef } from 'react'
import Header from '../components/Header'

export default function MeterCapturePage() {
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target.result)
        setImageFile(file)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleReadMeter = async () => {
    if (!image || !imageFile) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      // Use Netlify Function on production, Vite proxy on localhost
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? '/api/read-meter'
        : '/.netlify/functions/read-meter'

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Format the reading with proper decimal placement (3 decimals)
      let formattedReading = data.reading || 'N/A'
      if (formattedReading !== 'N/A' && formattedReading.length > 0) {
        // Insert decimal point 3 places from the right (for units like 00461312 -> 00461.312)
        formattedReading = (formattedReading.slice(0, -3) || '0') + '.' + formattedReading.slice(-3)
      }

      const result = {
        reading: formattedReading,
        unit: 'SCM',
        rawResponse: data
      }

      setResult(result)
    } catch (error) {
      alert(`Error reading meter: ${error.message}`)
      console.error('API Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setImageFile(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-igl-light flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* Image Capture Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Capture Meter Reading</h2>

          {!image ? (
            // Upload Buttons
            <div className="space-y-3">
              <button
                onClick={handleCameraClick}
                className="w-full text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 active:scale-95"
                style={{ backgroundColor: '#ff8c00' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e00'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ff8c00'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open Camera
              </button>

              <button
                onClick={handleUploadClick}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Photo
              </button>

              <p className="text-center text-gray-500 text-sm py-4">
                Take a clear photo of your IGL meter
              </p>
            </div>
          ) : (
            // Image Preview
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt="Captured meter"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>

              {!loading && !result && (
                <div className="flex gap-3">
                  <button
                    onClick={handleReadMeter}
                    className="flex-1 text-white font-semibold py-3 rounded-lg transition duration-200 active:scale-95"
                    style={{ backgroundColor: '#006837' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#004d28'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#006837'}
                  >
                    Read Meter
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200 active:scale-95"
                  >
                    Retake
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-igl-green mb-4"></div>
                  <p className="text-gray-600 font-medium">Processing meter image...</p>
                </div>
              )}
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Result Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-igl-green/20">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Meter Reading Result</h3>

            <div className="space-y-4">
              {/* Main Reading */}
              <div className="bg-gradient-to-br from-igl-green/10 to-igl-green/5 rounded-xl p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Reading</p>
                <p className="text-4xl font-bold text-igl-green">{result.reading}</p>
                <p className="text-gray-600 mt-2">{result.unit}</p>
              </div>


              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleReset}
                  className="flex-1 text-white font-semibold py-3 rounded-lg transition duration-200 active:scale-95"
                  style={{ backgroundColor: '#006837' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#004d28'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#006837'}
                >
                  Capture Another
                </button>
                <button
                  onClick={() => alert('Submit functionality to be implemented with backend API')}
                  className="flex-1 text-white font-semibold py-3 rounded-lg transition duration-200 active:scale-95"
                  style={{ backgroundColor: '#ff8c00' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e00'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ff8c00'}
                >
                  Submit
                </button>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-500 text-center pt-2">
                * Reading extracted using OCR technology
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
