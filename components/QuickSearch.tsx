"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  Search,
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
  Command,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: string
  title: string
  description: string
  href: string
  type: "page" | "employee" | "action"
  icon: React.ComponentType<{ className?: string }>
  permission?: string
}

export default function QuickSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { hasPermission } = useAuth()
  const { t } = useLanguage()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchData: SearchResult[] = [
    {
      id: "1",
      title: t("nav.dashboard"),
      description: "Main dashboard overview",
      href: "/",
      type: "page",
      icon: Search,
    },
    {
      id: "2",
      title: t("nav.employees"),
      description: "Manage employee records",
      href: "/employees",
      type: "page",
      icon: Users,
      permission: "employees",
    },
    {
      id: "3",
      title: "Add Employee",
      description: "Create new employee record",
      href: "/employees/add",
      type: "action",
      icon: UserPlus,
      permission: "employees",
    },
    {
      id: "4",
      title: t("nav.recruitment"),
      description: "Manage recruitment process",
      href: "/recruitment",
      type: "page",
      icon: UserPlus,
      permission: "recruitment",
    },
    {
      id: "5",
      title: t("nav.attendance"),
      description: "Track employee attendance",
      href: "/attendance",
      type: "page",
      icon: Clock,
      permission: "attendance",
    },
    {
      id: "6",
      title: t("nav.leave"),
      description: "Manage leave requests",
      href: "/leave",
      type: "page",
      icon: Calendar,
      permission: "leave",
    },
    {
      id: "7",
      title: t("nav.payroll"),
      description: "Payroll management",
      href: "/payroll",
      type: "page",
      icon: DollarSign,
      permission: "payroll",
    },
    {
      id: "8",
      title: t("nav.evaluation"),
      description: "Employee performance evaluation",
      href: "/evaluation",
      type: "page",
      icon: Award,
      permission: "evaluation",
    },
    {
      id: "9",
      title: t("nav.assets"),
      description: "IT assets management",
      href: "/assets",
      type: "page",
      icon: Monitor,
      permission: "assets",
    },
    {
      id: "10",
      title: t("nav.notifications"),
      description: "View notifications",
      href: "/notifications",
      type: "page",
      icon: Bell,
      permission: "notifications",
    },
    {
      id: "11",
      title: t("nav.profile"),
      description: "User profile settings",
      href: "/profile",
      type: "page",
      icon: User,
      permission: "profile",
    },
    {
      id: "12",
      title: "Admin Panel",
      description: "System administration",
      href: "/admin",
      type: "page",
      icon: Settings,
      permission: "all",
    },
    {
      id: "13",
      title: "Organization",
      description: "Organizational structure",
      href: "/organization",
      type: "page",
      icon: Users,
      permission: "all",
    },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
        setSelectedIndex(0)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const filteredResults = searchData
      .filter((item) => {
        if (item.permission && !hasPermission(item.permission)) return false
        return (
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        )
      })
      .slice(0, 8)

    setResults(filteredResults)
    setSelectedIndex(0)
  }, [query, hasPermission])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      window.location.href = results[selectedIndex].href
      setIsOpen(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "bg-blue-100 text-blue-800"
      case "employee":
        return "bg-green-100 text-green-800"
      case "action":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <Button
        variant="outline"
        className="w-64 justify-start text-gray-500 bg-white/50 backdrop-blur-sm border-gray-200/50"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4 mr-2" />
        <span>Quick search...</span>
        <div className="ml-auto flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">K</kbd>
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
          <Card className="w-full max-w-2xl mx-4 shadow-2xl">
            <CardContent className="p-0">
              <div className="flex items-center border-b px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <Input
                  ref={inputRef}
                  placeholder="Search pages, employees, actions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 focus-visible:ring-0 text-lg"
                  autoFocus
                />
                <div className="flex items-center space-x-1 ml-3">
                  <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">ESC</kbd>
                </div>
              </div>

              {results.length > 0 && (
                <div className="max-h-96 overflow-y-auto">
                  {results.map((result, index) => {
                    const Icon = result.icon
                    return (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                          index === selectedIndex ? "bg-blue-50 border-r-2 border-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{result.title}</p>
                              <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)}`}>
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{result.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    )
                  })}
                </div>
              )}

              {query && results.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No results found for "{query}"</p>
                </div>
              )}

              {!query && (
                <div className="px-4 py-6 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Command className="w-5 h-5" />
                    <span className="text-sm">Quick Search</span>
                  </div>
                  <p className="text-xs">Start typing to search pages, employees, and actions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
