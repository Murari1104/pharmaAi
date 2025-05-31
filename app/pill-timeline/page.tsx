"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, CalendarIcon, Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Pill {
  id: string
  name: string
  time: string
  taken: boolean
  date: string
}

interface PillSchedule {
  [date: string]: Pill[]
}

export default function PillTimelinePage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [showAddPill, setShowAddPill] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [pillName, setPillName] = useState("")
  const [pillTime, setPillTime] = useState("")
  const [addForAllDays, setAddForAllDays] = useState(false)
  const [pillSchedule, setPillSchedule] = useState<PillSchedule>({})

  // Generate 5 days starting from today
  const generateWeekDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      })
    }
    return dates
  }

  // Generate calendar dates (15 days previous history)
  const generateCalendarDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push({
        date: date.toISOString().split("T")[0],
        display: date.getDate(),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      })
    }
    return dates
  }

  const weekDates = generateWeekDates()
  const calendarDates = generateCalendarDates()

  useEffect(() => {
    // Set today as default selected date
    setSelectedDate(weekDates[0].date)

    // Initialize with sample data
    const sampleSchedule: PillSchedule = {}
    weekDates.forEach((dateObj) => {
      sampleSchedule[dateObj.date] = [
        {
          id: `${dateObj.date}-1`,
          name: "Vitamin D",
          time: "08:00",
          taken: new Date().getHours() > 8,
          date: dateObj.date,
        },
        {
          id: `${dateObj.date}-2`,
          name: "Omega-3",
          time: "12:00",
          taken: new Date().getHours() > 12,
          date: dateObj.date,
        },
        {
          id: `${dateObj.date}-3`,
          name: "Calcium",
          time: "20:00",
          taken: false,
          date: dateObj.date,
        },
      ]
    })
    setPillSchedule(sampleSchedule)
  }, [])

  const handleBack = () => {
    window.location.href = "/"
  }

  const togglePillTaken = (pillId: string) => {
    setPillSchedule((prev) => {
      const newSchedule = { ...prev }
      Object.keys(newSchedule).forEach((date) => {
        newSchedule[date] = newSchedule[date].map((pill) =>
          pill.id === pillId ? { ...pill, taken: !pill.taken } : pill,
        )
      })
      return newSchedule
    })
  }

  const addPill = () => {
    if (!pillName || !pillTime) return

    const newPill = {
      id: `${Date.now()}`,
      name: pillName,
      time: pillTime,
      taken: false,
      date: selectedDate,
    }

    setPillSchedule((prev) => {
      const newSchedule = { ...prev }

      if (addForAllDays) {
        // Add to all days
        weekDates.forEach((dateObj) => {
          if (!newSchedule[dateObj.date]) {
            newSchedule[dateObj.date] = []
          }
          newSchedule[dateObj.date].push({
            ...newPill,
            id: `${dateObj.date}-${Date.now()}`,
            date: dateObj.date,
          })
        })
      } else {
        // Add only to selected date
        if (!newSchedule[selectedDate]) {
          newSchedule[selectedDate] = []
        }
        newSchedule[selectedDate].push(newPill)
      }

      return newSchedule
    })

    setPillName("")
    setPillTime("")
    setShowAddPill(false)
    setAddForAllDays(false)
  }

  const isPillTimePassed = (time: string, date: string) => {
    const today = new Date().toISOString().split("T")[0]
    if (date !== today) return date < today

    const now = new Date()
    const [hours, minutes] = time.split(":").map(Number)
    const pillTime = new Date()
    pillTime.setHours(hours, minutes, 0, 0)

    return now > pillTime
  }

  const getDateStatus = (date: string) => {
    const pills = pillSchedule[date] || []
    if (pills.length === 0) return "none"

    const allTaken = pills.every((pill) => pill.taken)
    const anyMissed = pills.some((pill) => !pill.taken && isPillTimePassed(pill.time, date))

    if (allTaken) return "complete"
    if (anyMissed) return "missed"
    return "partial"
  }

  // Calculate insights data for graph
  const calculateInsights = () => {
    const insights = calendarDates.map((dateObj) => {
      const pills = pillSchedule[dateObj.date] || []
      const takenCount = pills.filter((pill) => pill.taken).length
      const totalCount = pills.length
      return {
        date: dateObj.display,
        percentage: totalCount > 0 ? (takenCount / totalCount) * 100 : 0,
      }
    })
    return insights
  }

  const insightsData = calculateInsights()
  const averageCompliance = insightsData.reduce((sum, day) => sum + day.percentage, 0) / insightsData.length

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
          <h1 className="text-xl font-bold text-gray-900">Pill Timeline</h1>
          <div className="w-9 h-9"></div>
        </div>
      </header>

      {!showCalendar ? (
        /* Weekly Timeline View */
        <main className="px-4 py-6 max-w-md mx-auto">
          {/* Week Timeline */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {weekDates.map((dateObj) => (
                <button
                  key={dateObj.date}
                  onClick={() => setSelectedDate(dateObj.date)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedDate === dateObj.date
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                  }`}
                >
                  <div className="text-xs font-medium">{dateObj.dayName}</div>
                  <div className="text-sm font-bold">{dateObj.display}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pills for Selected Date */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Pills for {weekDates.find((d) => d.date === selectedDate)?.display}
              </h3>
              <button
                onClick={() => setShowAddPill(true)}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(pillSchedule[selectedDate] || []).map((pill) => {
                const timePassed = isPillTimePassed(pill.time, selectedDate)
                return (
                  <Card key={pill.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              pill.taken && timePassed ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {pill.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span
                              className={`text-sm ${
                                pill.taken && timePassed ? "line-through text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {pill.time}
                            </span>
                            {timePassed && (
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                Time passed
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => togglePillTaken(pill.id)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            pill.taken
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {(!pillSchedule[selectedDate] || pillSchedule[selectedDate].length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No pills scheduled for this day</p>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Button */}
          <Button
            onClick={() => setShowCalendar(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>View Calendar & Insights</span>
          </Button>

          {/* Add Pill Modal */}
          {showAddPill && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Pill</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                    <Input
                      value={pillName}
                      onChange={(e) => setPillName(e.target.value)}
                      placeholder="Enter medicine name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <Input
                      type="time"
                      value={pillTime}
                      onChange={(e) => setPillTime(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allDays"
                      checked={addForAllDays}
                      onChange={(e) => setAddForAllDays(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="allDays" className="text-sm text-gray-700">
                      Add for all days
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button onClick={addPill} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Save
                  </Button>
                  <Button onClick={() => setShowAddPill(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      ) : (
        /* Calendar View with Insights */
        <main className="px-4 py-6 max-w-md mx-auto">
          {/* Insights Graph */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pill Compliance Insights</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>AVG. {averageCompliance.toFixed(1)}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-24 mb-4">
                <svg className="w-full h-full" viewBox="0 0 300 80">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 ${80 - (insightsData[0]?.percentage || 0) * 0.6} ${insightsData
                      .map(
                        (point, index) =>
                          `L ${(index * 300) / (insightsData.length - 1)} ${80 - point.percentage * 0.6}`,
                      )
                      .join(" ")}`}
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                  {insightsData.map((point, index) => (
                    <circle
                      key={index}
                      cx={(index * 300) / (insightsData.length - 1)}
                      cy={80 - point.percentage * 0.6}
                      r="4"
                      fill="#8B5CF6"
                      className="drop-shadow-sm"
                    />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                {insightsData.slice(0, 6).map((point, index) => (
                  <span key={index}>{point.date}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">15-Day History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {calendarDates.map((dateObj) => {
                  const status = getDateStatus(dateObj.date)
                  return (
                    <div
                      key={dateObj.date}
                      className={`aspect-square flex items-center justify-center rounded-lg border-2 text-sm font-medium relative ${
                        status === "complete"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : status === "missed"
                            ? "border-red-300 bg-red-50 text-red-700"
                            : status === "partial"
                              ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                              : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}
                    >
                      <span>{dateObj.display}</span>
                      {status === "complete" && <Check className="w-3 h-3 absolute top-1 right-1 text-green-600" />}
                      {status === "missed" && <X className="w-3 h-3 absolute top-1 right-1 text-red-600" />}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Complete</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span>Missed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>Partial</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => setShowCalendar(false)}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Timeline
          </Button>
        </main>
      )}
    </div>
  )
}
