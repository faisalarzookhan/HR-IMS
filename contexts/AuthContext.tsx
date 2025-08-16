"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "hr" | "employee"
  department: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  hasPermission: (permission: string) => boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const rolePermissions = {
  admin: ["all"],
  hr: ["employees", "recruitment", "payroll", "evaluation", "attendance", "leave", "notifications", "profile"],
  employee: ["profile", "attendance", "leave", "notifications", "assets_view"],
}

const demoUsers: Record<string, User> = {
  "admin@limitless.com": {
    id: "1",
    name: "Admin User",
    email: "admin@limitless.com",
    role: "admin",
    department: "Administration",
  },
  "hr@limitless.com": {
    id: "2",
    name: "HR Manager",
    email: "hr@limitless.com",
    role: "hr",
    department: "Human Resources",
  },
  "employee@limitless.com": {
    id: "3",
    name: "John Employee",
    email: "employee@limitless.com",
    role: "employee",
    department: "Engineering",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem("hr_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const user = demoUsers[email]
    if (user) {
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem("hr_user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("hr_user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    const permissions = rolePermissions[user.role]
    return permissions.includes("all") || permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
