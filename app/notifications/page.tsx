"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bell, Check, X, Settings, AlertCircle, Info, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "leave_request",
    title: "New Leave Request",
    message: "John Doe has submitted a leave request for 3 days starting Jan 20, 2024",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    priority: "high",
    actionRequired: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    type: "attendance",
    title: "Late Check-in Alert",
    message: "Sarah Johnson checked in 15 minutes late today",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    priority: "medium",
    actionRequired: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 11 PM to 1 AM",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    priority: "low",
    actionRequired: false,
    avatar: null,
  },
  {
    id: "4",
    type: "employee",
    title: "New Employee Added",
    message: "Emily Rodriguez has been added to the Engineering department",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    priority: "medium",
    actionRequired: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    type: "leave_approved",
    title: "Leave Request Approved",
    message: "Your leave request for Jan 25-26 has been approved",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: "medium",
    actionRequired: false,
    avatar: null,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const priorities = ["high", "medium", "low"]
  const types = ["leave_request", "attendance", "system", "employee", "leave_approved"]

  const filteredNotifications = notifications.filter((notification) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.read) ||
      (activeTab === "action" && notification.actionRequired)
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter
    return matchesTab && matchesPriority
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leave_request":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "attendance":
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case "system":
        return <Settings className="w-5 h-5 text-gray-600" />
      case "employee":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "leave_approved":
        return <Check className="w-5 h-5 text-green-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return `${days}d ago`
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                <p className="text-xs text-gray-500">Stay updated with latest activities</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <Bell className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-3xl font-bold text-orange-600">{unreadCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Action Required</p>
                  <p className="text-3xl font-bold text-red-600">{actionRequiredCount}</p>
                </div>
                <Clock className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter notifications by priority and type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>Manage your notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="action">Action Required ({actionRequiredCount})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No notifications found</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                          !notification.read ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {notification.avatar ? (
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {notification.title
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(notification.priority)}
                              {notification.actionRequired && (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Action Required</Badge>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm mb-2 ${!notification.read ? "text-gray-800" : "text-gray-600"}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</p>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                                  <Check className="w-4 h-4 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                                <X className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
