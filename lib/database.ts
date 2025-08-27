export interface DatabaseConfig {
  type: "postgresql" | "mysql" | "sqlite" | "mongodb"
  host?: string
  port?: number
  database: string
  username?: string
  password?: string
  url?: string
}

// Employee Management
export interface Employee {
  id: string
  employeeCode: string
  email: string
  name: string
  role: "admin" | "hr" | "manager" | "employee"
  department: string
  position: string
  salary?: number
  joinDate: string
  location: string
  country: string
  phone: string
  avatar?: string
  status: "active" | "inactive" | "terminated"
  skills: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  contractPeriod?: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// Attendance Management
export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "late" | "half-day" | "leave"
  workingHours?: number
  overtime?: number
  notes?: string
  location?: string
  createdAt: string
  updatedAt: string
}

// Leave Management
export interface LeaveRequest {
  id: string
  employeeId: string
  type: "annual" | "sick" | "maternity" | "emergency" | "unpaid"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvedAt?: string
  comments?: string
  documents?: string[]
  createdAt: string
  updatedAt: string
}

// Payroll Management
export interface PayrollRecord {
  id: string
  employeeId: string
  month: string
  year: number
  basicSalary: number
  allowances: {
    housing: number
    transport: number
    medical: number
    other: number
  }
  deductions: {
    tax: number
    insurance: number
    loan: number
    other: number
  }
  overtime: number
  bonus: number
  totalEarnings: number
  totalDeductions: number
  netSalary: number
  gratuity: number
  endOfServiceBenefit: number
  status: "draft" | "processed" | "paid"
  payDate?: string
  createdAt: string
  updatedAt: string
}

// IT Assets Management
export interface ITAsset {
  id: string
  assetCode: string
  name: string
  category: "laptop" | "desktop" | "phone" | "tablet" | "monitor" | "other"
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  warrantyExpiry: string
  value: number
  condition: "excellent" | "good" | "fair" | "poor"
  status: "available" | "assigned" | "maintenance" | "retired"
  assignedTo?: string
  assignedDate?: string
  location: string
  specifications: Record<string, any>
  documents: string[]
  maintenanceHistory: {
    date: string
    type: string
    description: string
    cost: number
  }[]
  createdAt: string
  updatedAt: string
}

// Recruitment Management
export interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  country: string
  type: "full-time" | "part-time" | "contract" | "internship"
  level: "entry" | "mid" | "senior" | "executive"
  salary: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  status: "open" | "closed" | "on-hold"
  postedDate: string
  closingDate: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Candidate {
  id: string
  positionId: string
  name: string
  email: string
  phone: string
  location: string
  country: string
  resume: string
  coverLetter?: string
  experience: number
  expectedSalary?: number
  status: "applied" | "screening" | "interview" | "selected" | "rejected" | "hired"
  rounds: {
    round: number
    type: "screening" | "technical" | "hr" | "final"
    interviewer: string
    date: string
    feedback: string
    rating: number
    status: "pending" | "passed" | "failed"
  }[]
  appliedDate: string
  createdAt: string
  updatedAt: string
}

// Notification System
export interface Notification {
  id: string
  userId: string
  type: "info" | "success" | "warning" | "error" | "system"
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: "attendance" | "leave" | "payroll" | "system" | "announcement"
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

// Organization Structure
export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  parentId?: string
  budget: number
  location: string
  employees: string[]
  createdAt: string
  updatedAt: string
}

// Database Service Class
export class DatabaseService {
  private static instance: DatabaseService
  private config: DatabaseConfig
  private connected = false

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  static getInstance(config?: DatabaseConfig): DatabaseService {
    if (!DatabaseService.instance) {
      if (!config) {
        throw new Error("Database configuration required for first initialization")
      }
      DatabaseService.instance = new DatabaseService(config)
    }
    return DatabaseService.instance
  }

  async connect(): Promise<void> {
    // Mock connection for now - replace with actual database connection
    console.log("[v0] Connecting to database:", this.config.type)
    this.connected = true
  }

  async disconnect(): Promise<void> {
    console.log("[v0] Disconnecting from database")
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }

  // Generic CRUD operations
  async create<T>(table: string, data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const now = new Date().toISOString()
    const record = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T

    // Store in localStorage for now - replace with actual database operations
    const key = `hr_${table}`
    const existing = this.getFromStorage(key) || []
    existing.push(record)
    this.saveToStorage(key, existing)

    console.log(`[v0] Created ${table} record:`, record)
    return record
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    const key = `hr_${table}`
    const records = this.getFromStorage(key) || []
    return records.find((record: any) => record.id === id) || null
  }

  async findMany<T>(table: string, filter?: Partial<T>): Promise<T[]> {
    const key = `hr_${table}`
    let records = this.getFromStorage(key) || []

    if (filter) {
      records = records.filter((record: any) => {
        return Object.entries(filter).every(([key, value]) => record[key] === value)
      })
    }

    return records
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    const key = `hr_${table}`
    const records = this.getFromStorage(key) || []
    const index = records.findIndex((record: any) => record.id === id)

    if (index === -1) return null

    const updatedRecord = {
      ...records[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    records[index] = updatedRecord
    this.saveToStorage(key, records)

    console.log(`[v0] Updated ${table} record:`, updatedRecord)
    return updatedRecord
  }

  async delete(table: string, id: string): Promise<boolean> {
    const key = `hr_${table}`
    const records = this.getFromStorage(key) || []
    const filteredRecords = records.filter((record: any) => record.id !== id)

    if (filteredRecords.length === records.length) return false

    this.saveToStorage(key, filteredRecords)
    console.log(`[v0] Deleted ${table} record with id:`, id)
    return true
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getFromStorage(key: string): any[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private saveToStorage(key: string, data: any[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("[v0] Failed to save to localStorage:", error)
    }
  }

  // Seed initial data
  async seedData(): Promise<void> {
    console.log("[v0] Seeding initial data...")

    // Seed employees
    const employees = await this.findMany<Employee>("employees")
    if (employees.length === 0) {
      await this.seedEmployees()
    }

    // Seed departments
    const departments = await this.findMany<Department>("departments")
    if (departments.length === 0) {
      await this.seedDepartments()
    }

    console.log("[v0] Data seeding completed")
  }

  private async seedEmployees(): Promise<void> {
    const sampleEmployees = [
      {
        employeeCode: "EMP001",
        email: "admin@limitless.com",
        name: "Admin User",
        role: "admin" as const,
        department: "IT",
        position: "System Administrator",
        salary: 8000,
        joinDate: "2023-01-15",
        location: "Dubai",
        country: "UAE",
        phone: "+971-50-123-4567",
        status: "active" as const,
        skills: ["System Administration", "Network Management", "Security"],
        emergencyContact: {
          name: "Emergency Contact",
          phone: "+971-50-987-6543",
          relationship: "Spouse",
        },
        contractPeriod: "Permanent",
        permissions: ["all"],
      },
      {
        employeeCode: "EMP002",
        email: "hr@limitless.com",
        name: "HR Manager",
        role: "hr" as const,
        department: "Human Resources",
        position: "HR Manager",
        salary: 7000,
        joinDate: "2023-02-01",
        location: "Dubai",
        country: "UAE",
        phone: "+971-50-234-5678",
        status: "active" as const,
        skills: ["HR Management", "Recruitment", "Employee Relations"],
        emergencyContact: {
          name: "Emergency Contact",
          phone: "+971-50-876-5432",
          relationship: "Parent",
        },
        contractPeriod: "Permanent",
        permissions: ["employees", "recruitment", "leave", "evaluation"],
      },
      {
        employeeCode: "EMP003",
        email: "employee@limitless.com",
        name: "John Employee",
        role: "employee" as const,
        department: "Development",
        position: "Software Developer",
        salary: 5000,
        joinDate: "2023-03-15",
        location: "Dubai",
        country: "UAE",
        phone: "+971-50-345-6789",
        status: "active" as const,
        skills: ["JavaScript", "React", "Node.js"],
        emergencyContact: {
          name: "Emergency Contact",
          phone: "+971-50-765-4321",
          relationship: "Sibling",
        },
        contractPeriod: "2 Years",
        permissions: ["attendance", "leave", "profile"],
      },
    ]

    for (const employee of sampleEmployees) {
      await this.create<Employee>("employees", employee)
    }
  }

  private async seedDepartments(): Promise<void> {
    const sampleDepartments = [
      {
        name: "Human Resources",
        description: "Manages employee relations and organizational development",
        managerId: "hr-manager-id",
        budget: 500000,
        location: "Dubai",
        employees: [],
      },
      {
        name: "Development",
        description: "Software development and engineering",
        managerId: "dev-manager-id",
        budget: 1000000,
        location: "Dubai",
        employees: [],
      },
      {
        name: "IT",
        description: "Information Technology and system administration",
        managerId: "it-manager-id",
        budget: 300000,
        location: "Dubai",
        employees: [],
      },
    ]

    for (const department of sampleDepartments) {
      await this.create<Department>("departments", department)
    }
  }
}

// Initialize database service
export const db = DatabaseService.getInstance({
  type: "sqlite",
  database: "hr_management.db",
})

// Export commonly used types
export type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  ITAsset,
  JobPosition,
  Candidate,
  Notification,
  Department,
}
