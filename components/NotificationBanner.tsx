"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, AlertCircle, CheckCircle2, Info } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  duration?: number
  persistent?: boolean
}

interface NotificationBannerProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export default function NotificationBanner({ notifications, onDismiss }: NotificationBannerProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setVisibleNotifications(notifications)

    // Auto-dismiss non-persistent notifications
    notifications.forEach((notification) => {
      if (!notification.persistent && notification.duration !== 0) {
        const timeout = setTimeout(() => {
          onDismiss(notification.id)
        }, notification.duration || 5000)

        return () => clearTimeout(timeout)
      }
    })
  }, [notifications, onDismiss])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "info":
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {visibleNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 shadow-lg animate-in slide-in-from-right-full duration-300 ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => onDismiss(notification.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
