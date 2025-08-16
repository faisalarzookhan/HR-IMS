"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RouteGuard, AccessControl, useDataFilter, useAuditLog } from "@/components/AccessControl"
import { useAuth } from "@/contexts/AuthContext"
import { Users, Search, Plus, Mail, Phone, MapPin, Calendar, Building2, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

// Mock employee data
const mockEmployees = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@limitless.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Developer",
    department: "Engineering",
    location: "New York",
    joinDate: "2022-03-15",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: 95000,
    personalDetails: { ssn: "***-**-1234", address: "123 Main St, NY" },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@limitless.com",
    phone: "+1 (555) 234-5678",
    position: "HR Manager",
    department: "Human Resources",
    location: "San Francisco",
    joinDate: "2021-08-22",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: 85000,
    personalDetails: { ssn: "***-**-5678", address: "456 Oak Ave, SF" },
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@limitless.com",
    phone: "+1 (555) 345-6789",
    position: "Product Manager",
    department: "Product",
    location: "Seattle",
    joinDate: "2023-01-10",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: 105000,
    personalDetails: { ssn: "***-**-9012", address: "789 Pine St, Seattle" },
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@limitless.com",
    phone: "+1 (555) 456-7890",
    position: "UX Designer",
    department: "Design",
    location: "Austin",
    joinDate: "2022-11-05",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: 75000,
    personalDetails: { ssn: "***-**-3456", address: "321 Elm St, Austin" },
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@limitless.com",
    phone: "+1 (555) 567-8901",
    position: "Sales Director",
    department: "Sales",
    location: "Chicago",
    joinDate: "2020-06-18",
    status: "On Leave",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: 120000,
    personalDetails: { ssn: "***-**-7890", address: "654 Maple Ave, Chicago" },
  },
]

function EmployeesPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { user, hasPermission } = useAuth()
  const { filterEmployeeData } = useDataFilter()
  const { logAccess } = useAuditLog()

  const filteredEmployeeData = filterEmployeeData(mockEmployees)

  useEffect(() => {
    logAccess("employees", "view_list", {
      searchTerm: searchTerm || "none",
      filters: { department: departmentFilter, status: statusFilter },
    })
  }, [searchTerm, departmentFilter, statusFilter, logAccess])

  const departments = ["Engineering", "Human Resources", "Product", "Design", "Sales"]
  const statuses = ["Active", "On Leave", "Inactive"]

  const filteredEmployees = filteredEmployeeData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-xs text-gray-500">
                  Manage your workforce • Role: {user?.role} • Access Level: {hasPermission("all") ? "Full" : "Limited"}
                </p>
              </div>
            </div>
            <AccessControl requiredPermission={["employees", "all"]}>
              <Link href="/employees/add">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </Link>
            </AccessControl>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredEmployees.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {filteredEmployees.filter((emp) => emp.status === "Active").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {filteredEmployees.filter((emp) => emp.status === "On Leave").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-3xl font-bold text-purple-600">{departments.length}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find employees by name, email, or position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Employees ({filteredEmployees.length})</span>
              {!hasPermission("all") && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Limited Access
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Complete list of all employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                        <Badge
                          variant={
                            employee.status === "Active"
                              ? "default"
                              : employee.status === "On Leave"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {employee.status}
                        </Badge>
                        <AccessControl requiredPermission={["payroll", "all"]} showFallback={false}>
                          {employee.salary && (
                            <Badge variant="outline" className="text-xs">
                              ${employee.salary.toLocaleString()}
                            </Badge>
                          )}
                        </AccessControl>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {employee.position} • {employee.department}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{employee.email}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{employee.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{employee.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/employees/${employee.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function EmployeesPage() {
  return (
    <RouteGuard requiredPermission={["employees", "all", "profile"]}>
      <EmployeesPageContent />
    </RouteGuard>
  )
}
