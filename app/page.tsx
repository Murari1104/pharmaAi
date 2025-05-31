"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bell, QrCode, Mic, Info, Bot, Calendar, Clock, AlertTriangle, Video, Home, FileText, User } from "lucide-react"

export default function PharmaDashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Toggle dark class on document and store preference
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const featureCards = [
    {
      id: "med-info",
      title: "Med Info",
      icon: Info,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-100",
    },
    {
      id: "pharma-ai",
      title: "Pharma AI",
      icon: Bot,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-100",
    },
    {
      id: "appointments",
      title: "Appointments",
      icon: Calendar,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-100",
    },
    {
      id: "pill-timeline",
      title: "Pill Timeline",
      icon: Clock,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-100",
    },
    {
      id: "emergency",
      title: "Emergency",
      icon: AlertTriangle,
      color: "bg-red-50 hover:bg-red-100 border-red-100",
    },
    {
      id: "health-shorts",
      title: "Health Shorts",
      icon: Video,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-100",
    },
  ]

  const bottomNavItems = [
    { id: "home", icon: Home, label: "Home", active: true },
    { id: "appointments", icon: Calendar, label: "Appointments", active: false },
    { id: "voice", icon: Mic, label: "Voice", active: false, isCenter: true },
    { id: "records", icon: FileText, label: "Records", active: false },
    { id: "profile", icon: User, label: "Profile", active: false },
  ]

  const handleCardClick = (cardId: string) => {
    if (cardId === "health-shorts") {
      // Open YouTube Shorts in a new tab
      window.open("https://www.youtube.com/shorts", "_blank")
    } else if (cardId === "pharma-ai") {
      // Navigate to chatbot page
      window.location.href = "/chatbot"
    } else if (cardId === "pill-timeline") {
      // Navigate to pill timeline page
      window.location.href = "/pill-timeline"
    }
    // Add other card actions as needed
  }

  const handleBottomNavClick = (itemId: string) => {
    if (itemId === "profile") {
      // Navigate to profile page using Next.js router
      window.location.href = "/profile"
    }
    // Add other navigation actions as needed
  }

  const handleVoiceAssistantClick = () => {
    setShowVoiceAssistant(true)
    setIsAnimating(true)

    // Speak greeting with user's name
    const userName = "John" // In real app, get from user context/profile
    const greeting = `Hey ${userName}! How are you doing today?`

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(greeting)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.start()
    } else {
      alert("Speech recognition not supported in this browser")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const closeVoiceAssistant = () => {
    setShowVoiceAssistant(false)
    setIsAnimating(false)
    setTranscript("")
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleQrButtonClick = () => {
    // Trigger file input click to open camera
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string)
        setShowCamera(false)

        // In a real app, you would process the QR code here
        // For now, just show an alert
        setTimeout(() => {
          alert("QR Code scanned successfully! Processing prescription...")
          setCapturedImage(null)
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const closeCamera = () => {
    setShowCamera(false)
    setCapturedImage(null)
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? "bg-gray-200" : "bg-gray-50"}`}>
      {/* Header */}
      <header
        className={`shadow-sm border-b px-4 py-4 sticky top-0 z-40 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-300 border-gray-400" : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1
            className={`text-xl font-bold transition-colors duration-300 ${
              isDarkMode ? "text-gray-800" : "text-gray-900"
            }`}
          >
            Pharma AI
          </h1>

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 active:scale-95">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 active:scale-95 ${
                isDarkMode
                  ? "text-yellow-400 hover:text-yellow-300 hover:bg-gray-700"
                  : "text-gray-600 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
            >
              <span className="text-lg">💡</span>
            </button>

            {/* User Profile */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">UN</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Greeting Section */}
        <section className="text-center mb-8">
          <h2
            className={`text-lg font-medium mb-6 transition-colors duration-300 ${
              isDarkMode ? "text-gray-800" : "text-gray-900"
            }`}
          >
            Hello, what can I help you with today?
          </h2>

          {/* QR Code Button */}
          <div className="flex flex-col items-center">
            <button
              className="w-24 h-24 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 mb-4"
              onClick={handleQrButtonClick}
            >
              <QrCode className="w-10 h-10 text-white" />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageCapture}
              />
            </button>

            <div className="text-center">
              <p
                className={`text-base font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-800" : "text-gray-900"
                }`}
              >
                Scan QR Code
              </p>
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? "text-gray-600" : "text-gray-600"}`}>
                For prescriptions or medical profiles
              </p>
            </div>
          </div>
        </section>

        {/* Captured Image Preview */}
        {capturedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg overflow-hidden max-w-md w-full">
              <div className="p-4">
                <h3 className="text-lg font-medium text-center mb-2">Processing QR Code</h3>
                <div className="relative">
                  <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full rounded" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
                  onClick={closeCamera}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            {featureCards.map((card) => {
              const IconComponent = card.icon
              const isEmergency = card.id === "emergency"

              return (
                <button
                  key={card.id}
                  className={`
                    border rounded-2xl p-6 flex flex-col items-center justify-center
                    transition-all duration-200 active:scale-95 hover:shadow-md
                    min-h-[120px] group
                    ${
                      isDarkMode
                        ? isEmergency
                          ? "bg-red-100 hover:bg-red-200 border-red-200"
                          : "bg-gray-100 hover:bg-gray-50 border-gray-300"
                        : card.color
                    }
                  `}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-3
                    ${isEmergency ? "bg-red-100 group-hover:bg-red-200" : "bg-blue-100 group-hover:bg-blue-200"}
                    transition-colors duration-200
                  `}
                  >
                    <IconComponent className={`w-6 h-6 ${isEmergency ? "text-red-600" : "text-blue-600"}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center leading-tight">{card.title}</span>
                </button>
              )
            })}
          </div>
        </section>
        {/* Voice Assistant Modal */}
        {showVoiceAssistant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-white/20">
              {/* Animated Microphone */}
              <div className="relative mb-6">
                <div
                  className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-300 ${isAnimating ? "animate-pulse scale-110" : ""}`}
                >
                  <div
                    className={`w-20 h-20 rounded-full bg-white/20 flex items-center justify-center transition-all duration-500 ${isListening ? "animate-ping" : ""}`}
                  >
                    <Mic
                      className={`w-10 h-10 text-white transition-all duration-300 ${isListening ? "scale-125" : ""}`}
                    />
                  </div>
                </div>

                {/* Siri-like Animation Rings */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-blue-400/30 animate-ping"></div>
                    <div
                      className="absolute inset-0 w-32 h-32 mx-auto -m-4 rounded-full border-2 border-purple-400/20 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute inset-0 w-40 h-40 mx-auto -m-8 rounded-full border border-blue-300/10 animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </>
                )}
              </div>

              {/* Greeting Text */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Hey John! 👋</h2>
                <p className="text-lg text-gray-600">How are you doing today?</p>
              </div>

              {/* Voice Transcript */}
              {transcript && (
                <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">You said:</p>
                  <p className="text-gray-800 font-medium">{transcript}</p>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4 mb-4">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-200 active:scale-95 flex items-center space-x-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Listening</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all duration-200 active:scale-95 flex items-center space-x-2"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                    <span>Stop</span>
                  </button>
                )}
              </div>

              {/* Status Text */}
              <p className="text-sm text-gray-500 mb-4">
                {isListening ? "Listening... Speak now!" : "Tap to start voice recognition"}
              </p>

              {/* Close Button */}
              <button
                onClick={closeVoiceAssistant}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 border-t px-4 py-2 z-50 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-300 border-gray-400" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around">
            {bottomNavItems.map((item) => {
              const IconComponent = item.icon

              if (item.isCenter) {
                return (
                  <button
                    key={item.id}
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 -mt-2"
                    onClick={handleVoiceAssistantClick}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </button>
                )
              }

              return (
                <button
                  key={item.id}
                  className={`
                    flex flex-col items-center justify-center py-2 px-3 rounded-lg
                    transition-all duration-200 active:scale-95
                    ${item.active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}
                  `}
                  onClick={() => handleBottomNavClick(item.id)}
                >
                  <IconComponent className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
