"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RealtimeDataWidget from "@/components/RealtimeDataWidget"
import { LanguageToggle } from "@/components/LanguageToggle"
import FloatingNavigation from "@/components/FloatingNavigation"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import QuickSearch from "@/components/QuickSearch"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/components/OrganizationProvider"
import {
  Users,
  Calendar,
  Clock,
  Bell,
  TrendingUp,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus,
  DollarSign,
  Award,
  Monitor,
  Settings,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { t, language } = useLanguage()
  const { user, login, logout, isAuthenticated, hasPermission } = useAuth()
  const { data: orgData, refreshData, isLoading } = useOrganization()
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(loginForm.email, loginForm.password)
  }

  const demoAccounts = [
    { role: "Admin", email: "admin@limitless.com", password: "admin123" },
    { role: "HR Manager", email: "hr@limitless.com", password: "hr123" },
    { role: "Employee", email: "employee@limitless.com", password: "emp123" },
  ]

  const getQuickActions = () => {
    const actions = [
      { href: "/employees", icon: Users, label: t("nav.employees"), permission: "employees" },
      { href: "/recruitment", icon: UserPlus, label: t("nav.recruitment"), permission: "recruitment" },
      { href: "/payroll", icon: DollarSign, label: t("nav.payroll"), permission: "payroll" },
      { href: "/evaluation", icon: Award, label: t("nav.evaluation"), permission: "evaluation" },
      {
        href: "/assets",
        icon: Monitor,
        label: t("nav.assets"),
        permission: user?.role === "employee" ? "assets_view" : "assets",
      },
      { href: "/admin", icon: Settings, label: "Admin", permission: "all" },
      { href: "/attendance", icon: Clock, label: t("nav.attendance"), permission: "attendance" },
      { href: "/notifications", icon: Bell, label: t("nav.notifications"), permission: "notifications" },
    ]

    return actions.filter((action) => hasPermission(action.permission))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Limitless Infotech</CardTitle>
            <CardDescription>HR Management System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <span className="font-medium">{account.role}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setLoginForm({ email: account.email, password: account.password })}
                    >
                      Use Account
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${language === "ar" ? "rtl" : "ltr"} pb-24`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Limitless Infotech</h1>
                <p className="text-xs text-gray-500">HR Management System</p>
              </div>
            </div>

            <div className="hidden md:block">
              <QuickSearch />
            </div>

            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {t("dashboard.welcome")}, {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role} • {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation />

        {/* Real-time Data Widgets */}
        {hasPermission("all") && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-time Monitoring</h2>
            <RealtimeDataWidget />
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("dashboard.totalEmployees")}</p>
                  <p className="text-3xl font-bold text-gray-900">{orgData.totalEmployees}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12 this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-3xl font-bold text-gray-900">{orgData.presentToday}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {((orgData.presentToday / orgData.totalEmployees) * 100).toFixed(1)}% attendance
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {hasPermission("leave") && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t("dashboard.pendingLeaves")}</p>
                    <p className="text-3xl font-bold text-gray-900">{orgData.pendingLeaves}</p>
                    <p className="text-xs text-orange-600 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />8 pending approval
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("nav.notifications")}</p>
                  <p className="text-3xl font-bold text-gray-900">{orgData.notifications}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" />2 urgent
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used HR operations</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {getQuickActions().map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}>
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent w-full">
                      <Icon className="w-6 h-6" />
                      <span>{action.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orgData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "attendance"
                        ? "bg-green-500"
                        : activity.type === "leave"
                          ? "bg-blue-500"
                          : activity.type === "employee"
                            ? "bg-orange-500"
                            : "bg-purple-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks - Only for HR and Admin */}
        {(hasPermission("leave") || hasPermission("all")) && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      High
                    </Badge>
                    <span className="font-medium">Review leave requests (8 pending)</span>
                  </div>
                  <Link href="/leave">
                    <Button size="sm">Review</Button>
                  </Link>
                </div>
                {hasPermission("employees") && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Medium
                      </Badge>
                      <span className="font-medium">Update employee records (3 incomplete)</span>
                    </div>
                    <Link href="/employees">
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    </Link>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Low
                    </Badge>
                    <span className="font-medium">Generate monthly report</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <FloatingNavigation />
    </div>
  )
}
