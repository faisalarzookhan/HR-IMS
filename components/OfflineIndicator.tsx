"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { WifiOff } from "lucide-react"

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Badge variant="destructive" className="flex items-center space-x-1 px-3 py-1">
        <WifiOff className="w-3 h-3" />
        <span className="text-xs">Offline Mode</span>
      </Badge>
    </div>
  )
}
