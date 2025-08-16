"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  managerId?: string
  level: number
  status: "active" | "on-leave" | "inactive"
  avatar?: string
  joinDate: string
  location: string
}

interface Department {
  id: string
  name: string
  count: number
  managerId: string
  budget: number
  performance: number
  growth: number
  locations: string[]
}

interface OrganizationHierarchy {
  id: string
  name: string
  position: string
  department: string
  level: number
  children: OrganizationHierarchy[]
  employeeCount: number
}

interface RealTimeMetrics {
  attendance: {
    present: number
    late: number
    absent: number
    remote: number
  }
  productivity: {
    tasksCompleted: number
    averageRating: number
    projectsOnTrack: number
    deadlinesMet: number
  }
  engagement: {
    activeUsers: number
    collaborationScore: number
    feedbackScore: number
    retentionRate: number
  }
}

interface OrganizationData {
  totalEmployees: number
  presentToday: number
  pendingLeaves: number
  notifications: number
  departments: Department[]
  employees: Employee[]
  hierarchy: OrganizationHierarchy[]
  recentActivity: { id: string; message: string; time: string; type: string; userId?: string }[]
  systemMetrics: {
    serverLoad: number
    memoryUsage: number
    activeUsers: number
    responseTime: number
  }
  realTimeMetrics: RealTimeMetrics
  organizationHealth: {
    overall: number
    attendance: number
    performance: number
    satisfaction: number
    growth: number
  }
}

interface OrganizationContextType {
  data: OrganizationData
  refreshData: () => void
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void
  updateDepartment: (departmentId: string, updates: Partial<Department>) => void
  addActivity: (activity: Omit<OrganizationData["recentActivity"][0], "id" | "time">) => void
  getEmployeesByDepartment: (departmentId: string) => Employee[]
  getDepartmentHierarchy: (departmentId: string) => OrganizationHierarchy[]
  isLoading: boolean
  lastUpdated: Date
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

// Mock data for comprehensive organizational structure
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@limitless.com",
    position: "CEO",
    department: "Executive",
    level: 1,
    status: "active",
    joinDate: "2020-01-15",
    location: "New York",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@limitless.com",
    position: "CTO",
    department: "Engineering",
    managerId: "1",
    level: 2,
    status: "active",
    joinDate: "2020-03-01",
    location: "San Francisco",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@limitless.com",
    position: "VP Engineering",
    department: "Engineering",
    managerId: "2",
    level: 3,
    status: "active",
    joinDate: "2020-06-15",
    location: "Seattle",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@limitless.com",
    position: "Senior Developer",
    department: "Engineering",
    managerId: "3",
    level: 4,
    status: "active",
    joinDate: "2021-02-10",
    location: "Austin",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@limitless.com",
    position: "HR Director",
    department: "HR",
    managerId: "1",
    level: 2,
    status: "on-leave",
    joinDate: "2020-08-20",
    location: "Chicago",
  },
]

const mockDepartments: Department[] = [
  {
    id: "eng",
    name: "Engineering",
    count: 89,
    managerId: "2",
    budget: 2500000,
    performance: 92,
    growth: 15,
    locations: ["San Francisco", "Seattle", "Austin"],
  },
  {
    id: "sales",
    name: "Sales",
    count: 45,
    managerId: "6",
    budget: 1200000,
    performance: 88,
    growth: 22,
    locations: ["New York", "Chicago", "Miami"],
  },
  {
    id: "marketing",
    name: "Marketing",
    count: 32,
    managerId: "7",
    budget: 800000,
    performance: 85,
    growth: 18,
    locations: ["Los Angeles", "New York"],
  },
  {
    id: "hr",
    name: "HR",
    count: 12,
    managerId: "5",
    budget: 400000,
    performance: 90,
    growth: 8,
    locations: ["Chicago", "New York"],
  },
  {
    id: "finance",
    name: "Finance",
    count: 18,
    managerId: "8",
    budget: 600000,
    performance: 94,
    growth: 5,
    locations: ["New York"],
  },
  {
    id: "operations",
    name: "Operations",
    count: 51,
    managerId: "9",
    budget: 1000000,
    performance: 87,
    growth: 12,
    locations: ["Multiple"],
  },
]

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OrganizationData>({
    totalEmployees: 247,
    presentToday: 234,
    pendingLeaves: 18,
    notifications: 5,
    departments: mockDepartments,
    employees: mockEmployees,
    hierarchy: [],
    recentActivity: [
      { id: "1", message: "John Doe checked in", time: "2 minutes ago", type: "attendance", userId: "4" },
      {
        id: "2",
        message: "Leave request approved for Sarah Johnson",
        time: "15 minutes ago",
        type: "leave",
        userId: "2",
      },
      { id: "3", message: "New employee Michael Chen onboarded", time: "1 hour ago", type: "employee", userId: "3" },
      { id: "4", message: "System backup completed successfully", time: "3 hours ago", type: "system" },
      { id: "5", message: "Department meeting scheduled - Engineering", time: "4 hours ago", type: "meeting" },
    ],
    systemMetrics: {
      serverLoad: 45,
      memoryUsage: 67,
      activeUsers: 89,
      responseTime: 120,
    },
    realTimeMetrics: {
      attendance: { present: 234, late: 8, absent: 5, remote: 67 },
      productivity: { tasksCompleted: 156, averageRating: 4.2, projectsOnTrack: 23, deadlinesMet: 89 },
      engagement: { activeUsers: 189, collaborationScore: 87, feedbackScore: 4.1, retentionRate: 94 },
    },
    organizationHealth: {
      overall: 88,
      attendance: 92,
      performance: 85,
      satisfaction: 87,
      growth: 91,
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshData = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setData((prev) => {
        const newPresentToday = Math.max(200, prev.presentToday + Math.floor(Math.random() * 6) - 3)
        const attendanceRate = (newPresentToday / prev.totalEmployees) * 100

        return {
          ...prev,
          presentToday: newPresentToday,
          notifications: Math.max(0, prev.notifications + Math.floor(Math.random() * 3) - 1),
          systemMetrics: {
            ...prev.systemMetrics,
            serverLoad: Math.max(0, Math.min(100, prev.systemMetrics.serverLoad + Math.floor(Math.random() * 10) - 5)),
            memoryUsage: Math.max(0, Math.min(100, prev.systemMetrics.memoryUsage + Math.floor(Math.random() * 8) - 4)),
            activeUsers: Math.max(0, prev.systemMetrics.activeUsers + Math.floor(Math.random() * 6) - 3),
            responseTime: Math.max(50, prev.systemMetrics.responseTime + Math.floor(Math.random() * 20) - 10),
          },
          realTimeMetrics: {
            attendance: {
              present: newPresentToday,
              late: Math.max(0, prev.realTimeMetrics.attendance.late + Math.floor(Math.random() * 3) - 1),
              absent: prev.totalEmployees - newPresentToday - prev.realTimeMetrics.attendance.remote,
              remote: Math.max(0, prev.realTimeMetrics.attendance.remote + Math.floor(Math.random() * 4) - 2),
            },
            productivity: {
              ...prev.realTimeMetrics.productivity,
              tasksCompleted: prev.realTimeMetrics.productivity.tasksCompleted + Math.floor(Math.random() * 5),
              averageRating: Math.max(
                1,
                Math.min(5, prev.realTimeMetrics.productivity.averageRating + (Math.random() * 0.2 - 0.1)),
              ),
              projectsOnTrack: Math.max(
                0,
                prev.realTimeMetrics.productivity.projectsOnTrack + Math.floor(Math.random() * 3) - 1,
              ),
            },
            engagement: {
              ...prev.realTimeMetrics.engagement,
              activeUsers: Math.max(0, prev.realTimeMetrics.engagement.activeUsers + Math.floor(Math.random() * 8) - 4),
              collaborationScore: Math.max(
                0,
                Math.min(100, prev.realTimeMetrics.engagement.collaborationScore + Math.floor(Math.random() * 6) - 3),
              ),
            },
          },
          organizationHealth: {
            ...prev.organizationHealth,
            attendance: Math.max(0, Math.min(100, attendanceRate)),
            overall: Math.max(0, Math.min(100, prev.organizationHealth.overall + Math.floor(Math.random() * 4) - 2)),
          },
        }
      })
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 1000)
  }, [])

  const updateEmployee = useCallback((employeeId: string, updates: Partial<Employee>) => {
    setData((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) => (emp.id === employeeId ? { ...emp, ...updates } : emp)),
    }))
    setLastUpdated(new Date())
  }, [])

  const updateDepartment = useCallback((departmentId: string, updates: Partial<Department>) => {
    setData((prev) => ({
      ...prev,
      departments: prev.departments.map((dept) => (dept.id === departmentId ? { ...dept, ...updates } : dept)),
    }))
    setLastUpdated(new Date())
  }, [])

  const addActivity = useCallback((activity: Omit<OrganizationData["recentActivity"][0], "id" | "time">) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      time: "Just now",
    }
    setData((prev) => ({
      ...prev,
      recentActivity: [newActivity, ...prev.recentActivity.slice(0, 9)],
    }))
    setLastUpdated(new Date())
  }, [])

  const getEmployeesByDepartment = useCallback(
    (departmentId: string) => {
      return data.employees.filter((emp) => emp.department.toLowerCase() === departmentId.toLowerCase())
    },
    [data.employees],
  )

  const getDepartmentHierarchy = useCallback(
    (departmentId: string): OrganizationHierarchy[] => {
      const deptEmployees = getEmployeesByDepartment(departmentId)
      const buildHierarchy = (managerId?: string, level = 1): OrganizationHierarchy[] => {
        return deptEmployees
          .filter((emp) => emp.managerId === managerId)
          .map((emp) => ({
            id: emp.id,
            name: emp.name,
            position: emp.position,
            department: emp.department,
            level,
            children: buildHierarchy(emp.id, level + 1),
            employeeCount: deptEmployees.filter((e) => e.managerId === emp.id).length,
          }))
      }
      return buildHierarchy()
    },
    [getEmployeesByDepartment],
  )

  useEffect(() => {
    const interval = setInterval(refreshData, 15000) // Refresh every 15 seconds
    const activityInterval = setInterval(() => {
      // Add random activity updates
      const activities = [
        { message: "Employee checked in", type: "attendance" },
        { message: "Task completed in Engineering", type: "productivity" },
        { message: "Meeting started in Conference Room A", type: "meeting" },
        { message: "Document uploaded to project folder", type: "document" },
        { message: "Performance review scheduled", type: "review" },
      ]
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      addActivity(randomActivity)
    }, 45000) // Add activity every 45 seconds

    return () => {
      clearInterval(interval)
      clearInterval(activityInterval)
    }
  }, [refreshData, addActivity])

  return (
    <OrganizationContext.Provider
      value={{
        data,
        refreshData,
        updateEmployee,
        updateDepartment,
        addActivity,
        getEmployeesByDepartment,
        getDepartmentHierarchy,
        isLoading,
        lastUpdated,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}
