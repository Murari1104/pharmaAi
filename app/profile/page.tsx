"use client"

import { useState } from "react"
import { ArrowLeft, Edit, LogOut, User, Phone, BadgeIcon as IdCard, QrCode, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    userId: "USR-2024-001",
  })

  const [editedDetails, setEditedDetails] = useState(userDetails)
  const [showQrCode, setShowQrCode] = useState(false)
  const [qrCodeData, setQrCodeData] = useState("")

  const handleEdit = () => {
    setIsEditing(true)
    setEditedDetails(userDetails)
  }

  const handleSave = () => {
    setUserDetails(editedDetails)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedDetails(userDetails)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Redirect to main page
    window.location.href = "/"
  }

  const handleBack = () => {
    window.location.href = "/"
  }

  const handleProfilePictureClick = () => {
    // Generate QR code data with user information
    const userData = {
      name: userDetails.name,
      userId: userDetails.userId,
      phone: userDetails.phone,
      timestamp: new Date().toISOString(),
    }

    // Convert user data to JSON string for QR code
    const qrData = JSON.stringify(userData)
    setQrCodeData(qrData)
    setShowQrCode(true)
  }

  const closeQrCode = () => {
    setShowQrCode(false)
    setQrCodeData("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <div className="w-9 h-9"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-md mx-auto">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="text-center pb-4">
            {/* Profile Picture */}
            <button
              onClick={handleProfilePictureClick}
              className="w-24 h-24 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-200 active:scale-95 group"
            >
              <span className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-200">
                {userDetails.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Details */}
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                  {isEditing ? (
                    <Input
                      value={editedDetails.name}
                      onChange={(e) => setEditedDetails({ ...editedDetails, name: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userDetails.name}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={editedDetails.phone}
                      onChange={(e) => setEditedDetails({ ...editedDetails, phone: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userDetails.phone}</p>
                  )}
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <IdCard className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 block mb-1">User ID</label>
                  <p className="text-gray-900 font-medium font-mono text-sm">{userDetails.userId}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              {isEditing ? (
                <div className="flex space-x-3">
                  <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleEdit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        {/* QR Code Modal */}
        {showQrCode && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full">
              <div className="p-6 text-center">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">My QR Code</h3>
                  <button
                    onClick={closeQrCode}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* QR Code Display */}
                <div className="bg-white p-4 rounded-xl border-2 border-gray-100 mb-4">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* QR Code Pattern Simulation */}
                    <div className="absolute inset-2 bg-white">
                      <div className="grid grid-cols-8 gap-1 h-full">
                        {Array.from({ length: 64 }, (_, i) => (
                          <div key={i} className={`${Math.random() > 0.5 ? "bg-black" : "bg-white"} rounded-sm`} />
                        ))}
                      </div>
                    </div>
                    <QrCode className="w-8 h-8 text-blue-600 z-10" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-900">{userDetails.name}</p>
                  <p className="text-xs text-gray-600">ID: {userDetails.userId}</p>
                  <p className="text-xs text-gray-500">Scan to view profile information</p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <button
                  onClick={closeQrCode}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
