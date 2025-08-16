"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RouteGuard } from "@/components/AccessControl"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import {
  Shield,
  Users,
  Settings,
  Activity,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Lock,
  Unlock,
  Mail,
  Plus,
  ArrowLeft,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface User {
  id: string
  empCode: string
  name: string
  email: string
  phone: string
  designation: string
  department: string
  role: "super_admin" | "admin" | "hr_manager" | "manager" | "employee"
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdDate: string
  permissions: string[]
  location: string
  country: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  userCount: number
  isSystem: boolean
}

interface Permission {
  id: string
  name: string
  category: string
  description: string
  enabled: boolean
}

interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

const mockUsers: User[] = [
  {
    id: "1",
    empCode: "LIS-ADM-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@limitless.com",
    phone: "+971-50-123-4567",
    designation: "System Administrator",
    department: "IT",
    role: "super_admin",
    status: "active",
    lastLogin: "2024-01-28 14:30:00",
    createdDate: "2023-01-15",
    permissions: ["all"],
    location: "Dubai",
    country: "UAE",
  },
  {
    id: "2",
    empCode: "LIS-HR-001",
    name: "Fatima Al-Zahra",
    email: "fatima.zahra@limitless.com",
    phone: "+966-55-987-6543",
    designation: "HR Manager",
    department: "Human Resources",
    role: "hr_manager",
    status: "active",
    lastLogin: "2024-01-28 09:15:00",
    createdDate: "2021-08-10",
    permissions: ["employees.read", "employees.write", "recruitment.all", "payroll.read"],
    location: "Riyadh",
    country: "Saudi Arabia",
  },
  {
    id: "3",
    empCode: "LIS-ENG-001",
    name: "Ahmed Al-Rashid",
    email: "ahmed.rashid@limitless.com",
    phone: "+971-50-123-4567",
    designation: "Senior Software Engineer",
    department: "Engineering",
    role: "employee",
    status: "active",
    lastLogin: "2024-01-28 08:45:00",
    createdDate: "2022-03-15",
    permissions: ["profile.read", "profile.write", "assets.read"],
    location: "Dubai",
    country: "UAE",
  },
]

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: [
      { id: "1", name: "System Administration", category: "System", description: "Full system control", enabled: true },
      { id: "2", name: "User Management", category: "Users", description: "Manage all users", enabled: true },
      {
        id: "3",
        name: "Role Management",
        category: "Roles",
        description: "Manage roles and permissions",
        enabled: true,
      },
    ],
    userCount: 1,
    isSystem: true,
  },
  {
    id: "2",
    name: "HR Manager",
    description: "Human Resources management permissions",
    permissions: [
      { id: "4", name: "Employee Management", category: "Employees", description: "Manage employees", enabled: true },
      { id: "5", name: "Recruitment", category: "Recruitment", description: "Manage recruitment", enabled: true },
      { id: "6", name: "Payroll Read", category: "Payroll", description: "View payroll data", enabled: true },
    ],
    userCount: 2,
    isSystem: false,
  },
  {
    id: "3",
    name: "Manager",
    description: "Department management permissions",
    permissions: [
      { id: "7", name: "Team Management", category: "Team", description: "Manage team members", enabled: true },
      { id: "8", name: "Performance Review", category: "Performance", description: "Conduct reviews", enabled: true },
    ],
    userCount: 5,
    isSystem: false,
  },
  {
    id: "4",
    name: "Employee",
    description: "Standard employee permissions",
    permissions: [
      { id: "9", name: "Profile Access", category: "Profile", description: "View and edit profile", enabled: true },
      { id: "10", name: "Leave Requests", category: "Leave", description: "Submit leave requests", enabled: true },
    ],
    userCount: 25,
    isSystem: true,
  },
]

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "1",
    userName: "Sarah Johnson",
    action: "User Created",
    resource: "User Management",
    details: "Created new user: Ahmed Al-Rashid",
    timestamp: "2024-01-28 14:30:00",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "2",
    userId: "2",
    userName: "Fatima Al-Zahra",
    action: "Employee Updated",
    resource: "Employee Management",
    details: "Updated employee salary information",
    timestamp: "2024-01-28 11:15:00",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  },
  {
    id: "3",
    userId: "3",
    userName: "Ahmed Al-Rashid",
    action: "Profile Updated",
    resource: "User Profile",
    details: "Updated personal information",
    timestamp: "2024-01-28 08:45:00",
    ipAddress: "192.168.1.110",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
]

function AdminPageContent() {
  const { t, language } = useLanguage()
  const { user, hasPermission } = useAuth()
  const [users] = useState<User[]>(mockUsers)
  const [roles] = useState<Role[]>(mockRoles)
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "hr_manager":
        return "bg-orange-100 text-orange-800"
      case "manager":
        return "bg-yellow-100 text-yellow-800"
      case "employee":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const inactiveUsers = users.filter((user) => user.status === "inactive").length
  const suspendedUsers = users.filter((user) => user.status === "suspended").length

  return (
    <div className={`min-h-screen bg-gray-50 ${language === "ar" ? "rtl" : "ltr"}`}>
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
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Controls</h1>
                <p className="text-xs text-gray-500">Super Admin Access • User: {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <Shield className="w-3 h-3 mr-1" />
                Admin Only
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Controls & Role Management</h1>
          <p className="text-gray-600">Advanced system administration and user management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{activeUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Roles Defined</p>
                  <p className="text-2xl font-bold">{roles.length}</p>
                </div>
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Activities</p>
                  <p className="text-2xl font-bold">{auditLogs.length}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Role Management</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users, roles, and permissions</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account with appropriate permissions</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Employee Code</Label>
                          <Input placeholder="e.g., LIS-EMP-001" />
                        </div>
                        <div>
                          <Label>Full Name</Label>
                          <Input placeholder="Enter full name" />
                        </div>
                        <div>
                          <Label>Email Address</Label>
                          <Input type="email" placeholder="user@limitless.com" />
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <Input placeholder="+971-50-123-4567" />
                        </div>
                        <div>
                          <Label>Designation</Label>
                          <Input placeholder="e.g., Software Engineer" />
                        </div>
                        <div>
                          <Label>Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="it">IT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="hr_manager">HR Manager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input placeholder="e.g., Dubai" />
                        </div>
                        <div>
                          <Label>Country</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="uae">UAE</SelectItem>
                              <SelectItem value="saudi">Saudi Arabia</SelectItem>
                              <SelectItem value="qatar">Qatar</SelectItem>
                              <SelectItem value="kuwait">Kuwait</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create User</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hr_manager">HR Manager</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((user) => {
                        const matchesSearch =
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.empCode.toLowerCase().includes(searchTerm.toLowerCase())
                        const matchesRole = filterRole === "all" || user.role === filterRole
                        const matchesStatus = filterStatus === "all" || user.status === filterStatus
                        return matchesSearch && matchesRole && matchesStatus
                      })
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.empCode}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            {user.location}, {user.country}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.status === "active" ? (
                                <Button size="sm" variant="outline">
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline">
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Role Management</CardTitle>
                    <CardDescription>Define and manage user roles and their permissions</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Role</DialogTitle>
                        <DialogDescription>Define a new role with specific permissions</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Role Name</Label>
                          <Input placeholder="e.g., Project Manager" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input placeholder="Brief description of the role" />
                        </div>
                        <div>
                          <Label>Permissions</Label>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="emp-read" />
                                <Label htmlFor="emp-read">Employee Read</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="emp-write" />
                                <Label htmlFor="emp-write">Employee Write</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="payroll-read" />
                                <Label htmlFor="payroll-read">Payroll Read</Label>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="assets-read" />
                                <Label htmlFor="assets-read">Assets Read</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="reports-read" />
                                <Label htmlFor="reports-read">Reports Read</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="admin-access" />
                                <Label htmlFor="admin-access">Admin Access</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create Role</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {roles.map((role) => (
                    <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{role.name}</h3>
                              {role.isSystem && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  System Role
                                </Badge>
                              )}
                              <Badge variant="outline">{role.userCount} users</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{role.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {role.permissions.slice(0, 3).map((permission) => (
                                <Badge key={permission.id} variant="outline" className="text-xs">
                                  {permission.name}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedRole(role)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!role.isSystem && (
                              <>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission Management</CardTitle>
                <CardDescription>Configure system permissions and access controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Employee Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">View Employees</p>
                          <p className="text-sm text-gray-500">Access to employee directory</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Edit Employees</p>
                          <p className="text-sm text-gray-500">Modify employee information</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Delete Employees</p>
                          <p className="text-sm text-gray-500">Remove employees from system</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Export Employee Data</p>
                          <p className="text-sm text-gray-500">Download employee reports</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Payroll & Finance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">View Payroll</p>
                          <p className="text-sm text-gray-500">Access salary information</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Process Payroll</p>
                          <p className="text-sm text-gray-500">Generate and approve payroll</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Financial Reports</p>
                          <p className="text-sm text-gray-500">Access financial analytics</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Budget Management</p>
                          <p className="text-sm text-gray-500">Manage department budgets</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">System Administration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">User Management</p>
                          <p className="text-sm text-gray-500">Manage system users</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Role Management</p>
                          <p className="text-sm text-gray-500">Configure roles and permissions</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">System Settings</p>
                          <p className="text-sm text-gray-500">Configure system parameters</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Audit Logs</p>
                          <p className="text-sm text-gray-500">View system activity logs</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Audit Logs</CardTitle>
                    <CardDescription>System activity and security audit trail</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.userName}</p>
                            <p className="text-sm text-gray-500">ID: {log.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>General system settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Multi-language Support</p>
                      <p className="text-sm text-gray-500">Enable Arabic and English languages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Send system notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Audit Logging</p>
                      <p className="text-sm text-gray-500">Track all system activities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Backup</p>
                      <p className="text-sm text-gray-500">Automatic daily system backups</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Security and access control configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-gray-500">Auto logout after inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">IP Restrictions</p>
                      <p className="text-sm text-gray-500">Limit access to specific IP ranges</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password Policy</p>
                      <p className="text-sm text-gray-500">Enforce strong password requirements</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update company details and branding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input defaultValue="Limitless Infotech Solutions" />
                  </div>
                  <div>
                    <Label>Company Code Prefix</Label>
                    <Input defaultValue="LIS" />
                  </div>
                  <div>
                    <Label>Primary Email</Label>
                    <Input defaultValue="info@limitless.com" />
                  </div>
                  <div>
                    <Label>Support Email</Label>
                    <Input defaultValue="support@limitless.com" />
                  </div>
                  <div>
                    <Label>Headquarters Location</Label>
                    <Input defaultValue="Dubai, UAE" />
                  </div>
                  <div>
                    <Label>Time Zone</Label>
                    <Select defaultValue="uae">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uae">UAE Standard Time (UTC+4)</SelectItem>
                        <SelectItem value="saudi">Arabia Standard Time (UTC+3)</SelectItem>
                        <SelectItem value="qatar">Qatar Standard Time (UTC+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Modal */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedUser.name}</DialogTitle>
                <DialogDescription>
                  {selectedUser.empCode} • {selectedUser.designation}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span>{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Department:</span>
                        <span>{selectedUser.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>
                          {selectedUser.location}, {selectedUser.country}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{selectedUser.createdDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Access Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role.replace("_", " ")}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Login:</span>
                        <span>{selectedUser.lastLogin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Permissions:</span>
                        <span>{selectedUser.permissions.length} assigned</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Assigned Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <RouteGuard requiredPermission="all">
      <AdminPageContent />
    </RouteGuard>
  )
}
