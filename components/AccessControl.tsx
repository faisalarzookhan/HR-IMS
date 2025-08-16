"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AccessControlProps {
  children: React.ReactNode
  requiredPermission: string | string[]
  fallback?: React.ReactNode
  showFallback?: boolean
}

interface RouteGuardProps {
  children: React.ReactNode
  requiredPermission: string | string[]
  redirectTo?: string
}

// Higher-order component for protecting routes
export function RouteGuard({ children, requiredPermission, redirectTo = "/" }: RouteGuardProps) {
  const { user, hasPermission, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Authentication Required</CardTitle>
            <CardDescription>Please log in to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={redirectTo}>
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]
  const hasAccess = permissions.some((permission) => hasPermission(permission))

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Your role: <strong>{user?.role}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Required permissions: {permissions.join(" or ")}</p>
            <div className="flex space-x-2">
              <Link href={redirectTo}>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="flex-1">View Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Component-level access control
export function AccessControl({ children, requiredPermission, fallback, showFallback = true }: AccessControlProps) {
  const { hasPermission } = useAuth()

  const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]
  const hasAccess = permissions.some((permission) => hasPermission(permission))

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>
    if (!showFallback) return null

    return (
      <div className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <Shield className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Access restricted</p>
          <p className="text-xs">Required: {permissions.join(" or ")}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Data filtering utility
export function useDataFilter() {
  const { user, hasPermission } = useAuth()

  const filterEmployeeData = (employees: any[]) => {
    if (hasPermission("all")) return employees

    if (user?.role === "hr") {
      // HR can see all employees but with limited sensitive data
      return employees.map((emp) => ({
        ...emp,
        salary: hasPermission("payroll") ? emp.salary : undefined,
        personalDetails: hasPermission("employees") ? emp.personalDetails : undefined,
      }))
    }

    if (user?.role === "employee") {
      // Employees can only see basic info of others and full info of themselves
      return employees.map((emp) => ({
        ...emp,
        salary: emp.id === user.id ? emp.salary : undefined,
        personalDetails: emp.id === user.id ? emp.personalDetails : undefined,
        phone: emp.id === user.id ? emp.phone : undefined,
        email: emp.email, // Email is always visible
      }))
    }

    return []
  }

  const filterPayrollData = (payrollData: any[]) => {
    if (!hasPermission("payroll") && !hasPermission("all")) return []

    if (user?.role === "employee") {
      // Employees can only see their own payroll data
      return payrollData.filter((data) => data.employeeId === user.id)
    }

    return payrollData
  }

  const filterAdminData = (adminData: any[]) => {
    if (!hasPermission("all")) return []
    return adminData
  }

  return {
    filterEmployeeData,
    filterPayrollData,
    filterAdminData,
  }
}

// Audit logging utility
export function useAuditLog() {
  const { user } = useAuth()

  const logAccess = (resource: string, action: string, details?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: user?.id,
      userRole: user?.role,
      resource,
      action,
      details,
      ip: "simulated-ip", // In real app, get from request
      userAgent: navigator.userAgent,
    }

    // In a real application, this would send to your logging service
    console.log("[AUDIT LOG]", logEntry)

    // Store in localStorage for demo purposes
    const existingLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]")
    existingLogs.push(logEntry)
    localStorage.setItem("audit_logs", JSON.stringify(existingLogs.slice(-100))) // Keep last 100 logs
  }

  const getAuditLogs = () => {
    return JSON.parse(localStorage.getItem("audit_logs") || "[]")
  }

  return { logAccess, getAuditLogs }
}
