"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Home,
  Users,
  Calendar,
  Clock,
  Bell,
  UserPlus,
  DollarSign,
  Award,
  Monitor,
  Settings,
  User,
  ChevronUp,
  ChevronDown,
  Building2,
  BarChart3,
  Folder,
} from "lucide-react"

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  permission: string
  badge?: number
  shortcut?: string
}

export default function FloatingNavigation() {
  const { user, hasPermission } = useAuth()
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [notifications, setNotifications] = useState(5)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const navItems: NavItem[] = [
    { href: "/", icon: Home, label: t("nav.dashboard"), permission: "all", shortcut: "1" },
    { href: "/employees", icon: Users, label: t("nav.employees"), permission: "employees", shortcut: "2" },
    { href: "/recruitment", icon: UserPlus, label: t("nav.recruitment"), permission: "recruitment", shortcut: "3" },
    { href: "/attendance", icon: Clock, label: t("nav.attendance"), permission: "attendance", shortcut: "4" },
    { href: "/leave", icon: Calendar, label: t("nav.leave"), permission: "leave", shortcut: "5" },
    { href: "/payroll", icon: DollarSign, label: t("nav.payroll"), permission: "payroll", shortcut: "6" },
    { href: "/evaluation", icon: Award, label: t("nav.evaluation"), permission: "evaluation", shortcut: "7" },
    {
      href: "/assets",
      icon: Monitor,
      label: t("nav.assets"),
      permission: user?.role === "employee" ? "assets_view" : "assets",
      shortcut: "8",
    },
    {
      href: "/notifications",
      icon: Bell,
      label: t("nav.notifications"),
      permission: "notifications",
      badge: notifications,
      shortcut: "9",
    },
    { href: "/profile", icon: User, label: t("nav.profile"), permission: "profile", shortcut: "0" },
  ]

  if (hasPermission("projects") || hasPermission("all") || hasPermission("hr")) {
    navItems.splice(9, 0, { href: "/projects", icon: Folder, label: "Projects", permission: "projects" })
  }

  if (hasPermission("analytics") || hasPermission("all") || hasPermission("hr")) {
    navItems.splice(9, 0, { href: "/analytics", icon: BarChart3, label: "Analytics", permission: "analytics" })
  }

  if (hasPermission("all") || hasPermission("hr")) {
    navItems.push({ href: "/organization", icon: Building2, label: "Organization", permission: "hr" })
  }

  if (hasPermission("all")) {
    navItems.push({ href: "/admin", icon: Settings, label: "Admin", permission: "all" })
  }

  const visibleItems = navItems.filter((item) => hasPermission(item.permission))
  const primaryItems = visibleItems.slice(0, 5)
  const secondaryItems = visibleItems.slice(5)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= "1" && e.key <= "9") {
        e.preventDefault()
        const item = visibleItems.find((item) => item.shortcut === e.key)
        if (item) {
          window.location.href = item.href
        }
      }
      if (e.altKey && e.key === "0") {
        e.preventDefault()
        const profileItem = visibleItems.find((item) => item.shortcut === "0")
        if (profileItem) {
          window.location.href = profileItem.href
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [lastScrollY, visibleItems])

  useEffect(() => {
    // Simulate real-time notification updates
    const interval = setInterval(() => {
      setNotifications((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <TooltipProvider>
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        {/* Secondary Navigation (Expandable) */}
        {secondaryItems.length > 0 && (
          <div
            className={`mb-2 transition-all duration-300 ${isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 px-4 py-3">
              <div className="flex items-center space-x-2">
                {secondaryItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            size="sm"
                            className={`relative h-10 w-10 rounded-xl transition-all duration-200 ${
                              isActive ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {item.badge && item.badge > 0 && (
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white animate-pulse">
                                {item.badge > 9 ? "9+" : item.badge}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-900 text-white">
                        <div className="flex items-center space-x-2">
                          <span>{item.label}</span>
                          {item.shortcut && (
                            <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded">Alt+{item.shortcut}</kbd>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Primary Navigation */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 px-4 py-3">
          <div className="flex items-center space-x-2">
            {primaryItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`relative h-12 w-12 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md transform scale-105"
                            : "hover:bg-gray-100 text-gray-600 hover:scale-105"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.badge && item.badge > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white animate-pulse">
                            {item.badge > 9 ? "9+" : item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-900 text-white">
                    <div className="flex items-center space-x-2">
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded">Alt+{item.shortcut}</kbd>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}

            {/* Expand/Collapse Button */}
            {secondaryItems.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12 rounded-xl text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 text-white">
                  {isExpanded ? "Collapse menu" : "Expand menu"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Connection Status Indicator */}
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
        </div>
      </div>
    </TooltipProvider>
  )
}
