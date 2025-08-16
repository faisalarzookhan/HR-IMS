"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useOrganization } from "./OrganizationProvider"
import { Users, Clock, Activity, Target, Heart, Zap, Calendar, MapPin, Wifi, WifiOff } from "lucide-react"

export default function RealTimeMetricsDashboard() {
  const { data, lastUpdated } = useOrganization()
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected")

  useEffect(() => {
    // Simulate connection status changes
    const interval = setInterval(() => {
      const statuses: ("connected" | "connecting" | "disconnected")[] = [
        "connected",
        "connected",
        "connected",
        "connecting",
        "connected",
      ]
      setConnectionStatus(statuses[Math.floor(Math.random() * statuses.length)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthBg = (score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 75) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          {connectionStatus === "connected" ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : connectionStatus === "connecting" ? (
            <Activity className="w-4 h-4 text-yellow-600 animate-pulse" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <span className="text-sm font-medium">
            {connectionStatus === "connected"
              ? "Real-time Connected"
              : connectionStatus === "connecting"
                ? "Reconnecting..."
                : "Connection Lost"}
          </span>
        </div>
        <div className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      </div>

      {/* Real-time Attendance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Live Attendance Tracking</span>
          </CardTitle>
          <CardDescription>Real-time employee presence and location data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{data.realTimeMetrics.attendance.present}</span>
              </div>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">{data.realTimeMetrics.attendance.late}</span>
              </div>
              <p className="text-sm text-gray-600">Late</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{data.realTimeMetrics.attendance.remote}</span>
              </div>
              <p className="text-sm text-gray-600">Remote</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{data.realTimeMetrics.attendance.absent}</span>
              </div>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Productivity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Productivity Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tasks Completed Today</span>
              <Badge variant="outline">{data.realTimeMetrics.productivity.tasksCompleted}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Rating</span>
                <span className="text-sm text-gray-600">
                  {data.realTimeMetrics.productivity.averageRating.toFixed(1)}/5.0
                </span>
              </div>
              <Progress value={(data.realTimeMetrics.productivity.averageRating / 5) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Projects On Track</span>
                <span className="text-sm text-gray-600">{data.realTimeMetrics.productivity.projectsOnTrack}/25</span>
              </div>
              <Progress value={(data.realTimeMetrics.productivity.projectsOnTrack / 25) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deadlines Met</span>
                <span className="text-sm text-gray-600">{data.realTimeMetrics.productivity.deadlinesMet}%</span>
              </div>
              <Progress value={data.realTimeMetrics.productivity.deadlinesMet} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Engagement Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <Badge variant="outline">{data.realTimeMetrics.engagement.activeUsers}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collaboration Score</span>
                <span className="text-sm text-gray-600">{data.realTimeMetrics.engagement.collaborationScore}%</span>
              </div>
              <Progress value={data.realTimeMetrics.engagement.collaborationScore} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Feedback Score</span>
                <span className="text-sm text-gray-600">
                  {data.realTimeMetrics.engagement.feedbackScore.toFixed(1)}/5.0
                </span>
              </div>
              <Progress value={(data.realTimeMetrics.engagement.feedbackScore / 5) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Retention Rate</span>
                <span className="text-sm text-gray-600">{data.realTimeMetrics.engagement.retentionRate}%</span>
              </div>
              <Progress value={data.realTimeMetrics.engagement.retentionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Health Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Organization Health</span>
          </CardTitle>
          <CardDescription>Real-time organizational performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${getHealthBg(data.organizationHealth.overall)}`}
              >
                <span className={`text-xl font-bold ${getHealthColor(data.organizationHealth.overall)}`}>
                  {data.organizationHealth.overall}
                </span>
              </div>
              <p className="text-sm font-medium">Overall</p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${getHealthBg(data.organizationHealth.attendance)}`}
              >
                <span className={`text-xl font-bold ${getHealthColor(data.organizationHealth.attendance)}`}>
                  {Math.round(data.organizationHealth.attendance)}
                </span>
              </div>
              <p className="text-sm font-medium">Attendance</p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${getHealthBg(data.organizationHealth.performance)}`}
              >
                <span className={`text-xl font-bold ${getHealthColor(data.organizationHealth.performance)}`}>
                  {data.organizationHealth.performance}
                </span>
              </div>
              <p className="text-sm font-medium">Performance</p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${getHealthBg(data.organizationHealth.satisfaction)}`}
              >
                <span className={`text-xl font-bold ${getHealthColor(data.organizationHealth.satisfaction)}`}>
                  {data.organizationHealth.satisfaction}
                </span>
              </div>
              <p className="text-sm font-medium">Satisfaction</p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${getHealthBg(data.organizationHealth.growth)}`}
              >
                <span className={`text-xl font-bold ${getHealthColor(data.organizationHealth.growth)}`}>
                  {data.organizationHealth.growth}
                </span>
              </div>
              <p className="text-sm font-medium">Growth</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
