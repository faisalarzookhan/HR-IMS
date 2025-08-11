"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Clock, Wifi, WifiOff } from "lucide-react"

interface RealtimeData {
  activeUsers: number
  systemLoad: number
  attendanceRate: number
  pendingTasks: number
  lastUpdate: Date
}

export default function RealtimeDataWidget() {
  const [data, setData] = useState<RealtimeData>({
    activeUsers: 234,
    systemLoad: 45,
    attendanceRate: 94.7,
    pendingTasks: 12,
    lastUpdate: new Date(),
  })
  const [isConnected, setIsConnected] = useState(true)
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newActiveUsers = prev.activeUsers + Math.floor(Math.random() * 10 - 5)
        const newSystemLoad = Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 20 - 10)))
        const newAttendanceRate = Math.max(0, Math.min(100, prev.attendanceRate + (Math.random() * 2 - 1)))
        const newPendingTasks = Math.max(0, prev.pendingTasks + Math.floor(Math.random() * 6 - 3))

        // Determine trend
        const userTrend =
          newActiveUsers > prev.activeUsers ? "up" : newActiveUsers < prev.activeUsers ? "down" : "stable"
        setTrend(userTrend)

        return {
          activeUsers: Math.max(0, newActiveUsers),
          systemLoad: newSystemLoad,
          attendanceRate: newAttendanceRate,
          pendingTasks: newPendingTasks,
          lastUpdate: new Date(),
        }
      })
    }, 3000) // Update every 3 seconds

    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected((prev) => (Math.random() > 0.1 ? true : !prev)) // 90% chance to stay connected
    }, 10000)

    return () => {
      clearInterval(interval)
      clearInterval(connectionInterval)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const getSystemLoadColor = (load: number) => {
    if (load < 30) return "text-green-600"
    if (load < 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600"
    if (rate >= 90) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Connection Status */}
      <Card className="col-span-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isConnected ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
              <span className="text-sm font-medium">{isConnected ? "Connected" : "Disconnected"}</span>
              <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Live" : "Offline"}</Badge>
            </div>
            <div className="text-xs text-gray-500">Last update: {formatTime(data.lastUpdate)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.activeUsers}</p>
              <div className="flex items-center space-x-1 mt-1">
                {trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : trend === "down" ? (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                ) : null}
                <span
                  className={`text-xs ${
                    trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {trend === "stable" ? "No change" : trend === "up" ? "Increasing" : "Decreasing"}
                </span>
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* System Load */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">System Load</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className={`text-2xl font-bold ${getSystemLoadColor(data.systemLoad)}`}>{data.systemLoad}%</p>
              <Badge variant={data.systemLoad < 70 ? "default" : "destructive"}>
                {data.systemLoad < 30 ? "Low" : data.systemLoad < 70 ? "Normal" : "High"}
              </Badge>
            </div>
            <Progress value={data.systemLoad} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className={`text-2xl font-bold ${getAttendanceColor(data.attendanceRate)}`}>
                {data.attendanceRate.toFixed(1)}%
              </p>
              <Badge variant={data.attendanceRate >= 90 ? "default" : "destructive"}>
                {data.attendanceRate >= 95 ? "Excellent" : data.attendanceRate >= 90 ? "Good" : "Poor"}
              </Badge>
            </div>
            <Progress value={data.attendanceRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.pendingTasks}</p>
              <p className="text-xs text-gray-500 mt-1">
                {data.pendingTasks === 0 ? "All caught up!" : "Requires attention"}
              </p>
            </div>
            <Clock className={`w-8 h-8 ${data.pendingTasks > 10 ? "text-red-600" : "text-orange-600"}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
