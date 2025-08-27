import {
  db,
  type Employee,
  type AttendanceRecord,
  type LeaveRequest,
  type PayrollRecord,
  type ITAsset,
  type Notification,
} from "./database"

export class APIError extends Error {
  constructor(
    message: string,
    public status = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Generic API Response type
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// API Service Class
export class APIService {
  private static instance: APIService

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService()
    }
    return APIService.instance
  }

  // Generic API methods
  private async handleRequest<T>(operation: () => Promise<T>): Promise<APIResponse<T>> {
    try {
      const data = await operation()
      return {
        success: true,
        data,
        message: "Operation completed successfully",
      }
    } catch (error) {
      console.error("[v0] API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  // Employee API
  async getEmployees(filter?: Partial<Employee>): Promise<APIResponse<Employee[]>> {
    return this.handleRequest(async () => {
      await db.connect()
      return await db.findMany<Employee>("employees", filter)
    })
  }

  async getEmployee(id: string): Promise<APIResponse<Employee>> {
    return this.handleRequest(async () => {
      await db.connect()
      const employee = await db.findById<Employee>("employees", id)
      if (!employee) {
        throw new APIError("Employee not found", 404)
      }
      return employee
    })
  }

  async createEmployee(data: Omit<Employee, "id" | "createdAt" | "updatedAt">): Promise<APIResponse<Employee>> {
    return this.handleRequest(async () => {
      await db.connect()

      // Validate required fields
      if (!data.email || !data.name || !data.employeeCode) {
        throw new APIError("Missing required fields: email, name, employeeCode", 400)
      }

      // Check for duplicate email or employee code
      const existingByEmail = await db.findMany<Employee>("employees", { email: data.email })
      if (existingByEmail.length > 0) {
        throw new APIError("Employee with this email already exists", 409)
      }

      const existingByCode = await db.findMany<Employee>("employees", { employeeCode: data.employeeCode })
      if (existingByCode.length > 0) {
        throw new APIError("Employee with this code already exists", 409)
      }

      return await db.create<Employee>("employees", data)
    })
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<APIResponse<Employee>> {
    return this.handleRequest(async () => {
      await db.connect()
      const updated = await db.update<Employee>("employees", id, data)
      if (!updated) {
        throw new APIError("Employee not found", 404)
      }
      return updated
    })
  }

  async deleteEmployee(id: string): Promise<APIResponse<boolean>> {
    return this.handleRequest(async () => {
      await db.connect()
      const deleted = await db.delete("employees", id)
      if (!deleted) {
        throw new APIError("Employee not found", 404)
      }
      return true
    })
  }

  // Attendance API
  async getAttendance(employeeId?: string, date?: string): Promise<APIResponse<AttendanceRecord[]>> {
    return this.handleRequest(async () => {
      await db.connect()
      const filter: Partial<AttendanceRecord> = {}
      if (employeeId) filter.employeeId = employeeId
      if (date) filter.date = date
      return await db.findMany<AttendanceRecord>("attendance", filter)
    })
  }

  async recordAttendance(
    data: Omit<AttendanceRecord, "id" | "createdAt" | "updatedAt">,
  ): Promise<APIResponse<AttendanceRecord>> {
    return this.handleRequest(async () => {
      await db.connect()

      // Check if attendance already exists for this employee and date
      const existing = await db.findMany<AttendanceRecord>("attendance", {
        employeeId: data.employeeId,
        date: data.date,
      })

      if (existing.length > 0) {
        // Update existing record
        return await db.update<AttendanceRecord>("attendance", existing[0].id, data)
      } else {
        // Create new record
        return await db.create<AttendanceRecord>("attendance", data)
      }
    })
  }

  // Leave API
  async getLeaveRequests(employeeId?: string, status?: string): Promise<APIResponse<LeaveRequest[]>> {
    return this.handleRequest(async () => {
      await db.connect()
      const filter: Partial<LeaveRequest> = {}
      if (employeeId) filter.employeeId = employeeId
      if (status) filter.status = status as any
      return await db.findMany<LeaveRequest>("leave_requests", filter)
    })
  }

  async createLeaveRequest(
    data: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">,
  ): Promise<APIResponse<LeaveRequest>> {
    return this.handleRequest(async () => {
      await db.connect()

      // Validate dates
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)

      if (startDate >= endDate) {
        throw new APIError("End date must be after start date", 400)
      }

      return await db.create<LeaveRequest>("leave_requests", {
        ...data,
        status: "pending",
      })
    })
  }

  async updateLeaveRequest(id: string, data: Partial<LeaveRequest>): Promise<APIResponse<LeaveRequest>> {
    return this.handleRequest(async () => {
      await db.connect()
      const updated = await db.update<LeaveRequest>("leave_requests", id, data)
      if (!updated) {
        throw new APIError("Leave request not found", 404)
      }
      return updated
    })
  }

  // Payroll API
  async getPayrollRecords(employeeId?: string, month?: string, year?: number): Promise<APIResponse<PayrollRecord[]>> {
    return this.handleRequest(async () => {
      await db.connect()
      const filter: Partial<PayrollRecord> = {}
      if (employeeId) filter.employeeId = employeeId
      if (month) filter.month = month
      if (year) filter.year = year
      return await db.findMany<PayrollRecord>("payroll", filter)
    })
  }

  async createPayrollRecord(
    data: Omit<PayrollRecord, "id" | "createdAt" | "updatedAt">,
  ): Promise<APIResponse<PayrollRecord>> {
    return this.handleRequest(async () => {
      await db.connect()

      // Calculate totals
      const totalEarnings =
        data.basicSalary +
        Object.values(data.allowances).reduce((sum, val) => sum + val, 0) +
        data.overtime +
        data.bonus

      const totalDeductions = Object.values(data.deductions).reduce((sum, val) => sum + val, 0)

      const netSalary = totalEarnings - totalDeductions

      return await db.create<PayrollRecord>("payroll", {
        ...data,
        totalEarnings,
        totalDeductions,
        netSalary,
      })
    })
  }

  // Assets API
  async getAssets(assignedTo?: string, status?: string): Promise<APIResponse<ITAsset[]>> {
    return this.handleRequest(async () => {
      await db.connect()
      const filter: Partial<ITAsset> = {}
      if (assignedTo) filter.assignedTo = assignedTo
      if (status) filter.status = status as any
      return await db.findMany<ITAsset>("assets", filter)
    })
  }

  async createAsset(data: Omit<ITAsset, "id" | "createdAt" | "updatedAt">): Promise<APIResponse<ITAsset>> {
    return this.handleRequest(async () => {
      await db.connect()

      // Check for duplicate asset code
      const existing = await db.findMany<ITAsset>("assets", { assetCode: data.assetCode })
      if (existing.length > 0) {
        throw new APIError("Asset with this code already exists", 409)
      }

      return await db.create<ITAsset>("assets", data)
    })
  }

  async updateAsset(id: string, data: Partial<ITAsset>): Promise<APIResponse<ITAsset>> {
    return this.handleRequest(async () => {
      await db.connect()
      const updated = await db.update<ITAsset>("assets", id, data)
      if (!updated) {
        throw new APIError("Asset not found", 404)
      }
      return updated
    })
  }

  // Notifications API
  async getNotifications(userId: string, unreadOnly?: boolean): Promise<APIResponse<Notification[]>> {
    return this.handleRequest(async () => {
      await db.connect()
      const filter: Partial<Notification> = { userId }
      if (unreadOnly) filter.read = false
      return await db.findMany<Notification>("notifications", filter)
    })
  }

  async createNotification(
    data: Omit<Notification, "id" | "createdAt" | "updatedAt">,
  ): Promise<APIResponse<Notification>> {
    return this.handleRequest(async () => {
      await db.connect()
      return await db.create<Notification>("notifications", {
        ...data,
        read: false,
      })
    })
  }

  async markNotificationAsRead(id: string): Promise<APIResponse<Notification>> {
    return this.handleRequest(async () => {
      await db.connect()
      const updated = await db.update<Notification>("notifications", id, { read: true })
      if (!updated) {
        throw new APIError("Notification not found", 404)
      }
      return updated
    })
  }

  // Analytics API
  async getDashboardStats(): Promise<APIResponse<any>> {
    return this.handleRequest(async () => {
      await db.connect()

      const employees = await db.findMany<Employee>("employees")
      const attendance = await db.findMany<AttendanceRecord>("attendance")
      const leaveRequests = await db.findMany<LeaveRequest>("leave_requests")
      const notifications = await db.findMany<Notification>("notifications")

      const today = new Date().toISOString().split("T")[0]
      const todayAttendance = attendance.filter((record) => record.date === today)

      return {
        totalEmployees: employees.length,
        activeEmployees: employees.filter((emp) => emp.status === "active").length,
        presentToday: todayAttendance.filter((record) => record.status === "present").length,
        pendingLeaves: leaveRequests.filter((req) => req.status === "pending").length,
        unreadNotifications: notifications.filter((notif) => !notif.read).length,
        departments: [...new Set(employees.map((emp) => emp.department))].length,
      }
    })
  }
}

// Export singleton instance
export const api = APIService.getInstance()

// Utility functions for common operations
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

export const formatCurrency = (amount: number, currency = "AED"): string => {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export const calculateWorkingDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let workingDays = 0

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Exclude weekends
      workingDays++
    }
  }

  return workingDays
}
