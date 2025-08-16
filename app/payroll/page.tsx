"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DollarSign,
  Download,
  Eye,
  Calculator,
  TrendingUp,
  Users,
  FileText,
  Search,
  Plus,
  ArrowLeft,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import { RouteGuard, AccessControl } from "@/components/AccessControl"

interface Employee {
  id: string
  empCode: string
  name: string
  designation: string
  department: string
  joiningDate: string
  basicSalary: number
  allowances: {
    housing: number
    transport: number
    food: number
    medical: number
    other: number
  }
  deductions: {
    tax: number
    insurance: number
    loan: number
    other: number
  }
  country: string
  contractPeriod: string
  status: "active" | "inactive"
}

interface PayrollRecord {
  id: string
  empId: string
  month: string
  year: number
  basicSalary: number
  allowances: number
  deductions: number
  grossSalary: number
  netSalary: number
  gratuity: number
  endOfServiceBenefit: number
  status: "processed" | "pending" | "approved"
  processedDate: string
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    empCode: "LIS-ENG-001",
    name: "Ahmed Al-Rashid",
    designation: "Senior Software Engineer",
    department: "Engineering",
    joiningDate: "2022-03-15",
    basicSalary: 15000,
    allowances: {
      housing: 5000,
      transport: 1500,
      food: 800,
      medical: 1200,
      other: 500,
    },
    deductions: {
      tax: 0,
      insurance: 500,
      loan: 1000,
      other: 200,
    },
    country: "UAE",
    contractPeriod: "2 Years",
    status: "active",
  },
  {
    id: "2",
    empCode: "LIS-HR-001",
    name: "Fatima Al-Zahra",
    designation: "HR Manager",
    department: "Human Resources",
    joiningDate: "2021-08-10",
    basicSalary: 14000,
    allowances: {
      housing: 4500,
      transport: 1200,
      food: 800,
      medical: 1200,
      other: 300,
    },
    deductions: {
      tax: 0,
      insurance: 450,
      loan: 0,
      other: 150,
    },
    country: "Saudi Arabia",
    contractPeriod: "3 Years",
    status: "active",
  },
]

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "1",
    empId: "1",
    month: "January",
    year: 2024,
    basicSalary: 15000,
    allowances: 9000,
    deductions: 1700,
    grossSalary: 24000,
    netSalary: 22300,
    gratuity: 1250,
    endOfServiceBenefit: 2500,
    status: "approved",
    processedDate: "2024-01-31",
  },
  {
    id: "2",
    empId: "2",
    month: "January",
    year: 2024,
    basicSalary: 14000,
    allowances: 8000,
    deductions: 600,
    grossSalary: 22000,
    netSalary: 21400,
    gratuity: 1400,
    endOfServiceBenefit: 3200,
    status: "approved",
    processedDate: "2024-01-31",
  },
]

function PayrollPageContent() {
  const { t, language } = useLanguage()
  const { user, hasPermission } = useAuth()
  const [employees] = useState<Employee[]>(mockEmployees)
  const [payrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedMonth, setSelectedMonth] = useState("January")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [searchTerm, setSearchTerm] = useState("")

  const calculateGratuity = (employee: Employee, months: number) => {
    const yearsOfService = months / 12
    let gratuityRate = 0.5 // 50% of basic salary for first 5 years

    if (yearsOfService > 5) {
      gratuityRate = 1 // 100% of basic salary after 5 years
    }

    return (employee.basicSalary * gratuityRate * yearsOfService) / 12
  }

  const calculateEndOfService = (employee: Employee) => {
    const joiningDate = new Date(employee.joiningDate)
    const currentDate = new Date()
    const monthsOfService =
      (currentDate.getFullYear() - joiningDate.getFullYear()) * 12 + (currentDate.getMonth() - joiningDate.getMonth())

    const yearsOfService = monthsOfService / 12

    // End of service calculation based on UAE/Saudi labor law
    let endOfServiceBenefit = 0

    if (yearsOfService >= 1 && yearsOfService < 5) {
      endOfServiceBenefit = (employee.basicSalary * 21 * yearsOfService) / 365 // 21 days per year
    } else if (yearsOfService >= 5) {
      endOfServiceBenefit = (employee.basicSalary * 30 * yearsOfService) / 365 // 30 days per year
    }

    return endOfServiceBenefit
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0)
  const averageSalary = totalPayroll / payrollRecords.length

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
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Payroll Management</h1>
                <p className="text-xs text-gray-500">
                  Role: {user?.role} • Access Level: {hasPermission("all") ? "Full" : "Limited"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("payroll.management")}</h1>
          <p className="text-gray-600">Comprehensive payroll management with salary statements and benefits</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                  <AccessControl requiredPermission={["payroll", "all"]}>
                    <p className="text-2xl font-bold">AED {totalPayroll.toLocaleString()}</p>
                  </AccessControl>
                  <AccessControl requiredPermission={["payroll", "all"]} showFallback={false}>
                    <p className="text-2xl font-bold text-gray-400">***</p>
                  </AccessControl>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Salary</p>
                  <AccessControl requiredPermission={["payroll", "all"]}>
                    <p className="text-2xl font-bold">AED {averageSalary.toLocaleString()}</p>
                  </AccessControl>
                  <AccessControl requiredPermission={["payroll", "all"]} showFallback={false}>
                    <p className="text-2xl font-bold text-gray-400">***</p>
                  </AccessControl>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Employees</p>
                  <p className="text-2xl font-bold">{employees.filter((emp) => emp.status === "active").length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processed Records</p>
                  <p className="text-2xl font-bold">
                    {payrollRecords.filter((record) => record.status === "approved").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <AccessControl requiredPermission={["payroll", "all"]}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="statements">Salary Statements</TabsTrigger>
              <TabsTrigger value="benefits">Benefits & Gratuity</TabsTrigger>
              <TabsTrigger value="processing">Process Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Payroll Overview - {selectedMonth} {selectedYear}
                  </CardTitle>
                  <CardDescription>Monthly payroll summary and employee breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="February">February</SelectItem>
                        <SelectItem value="March">March</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                        <SelectItem value="May">May</SelectItem>
                        <SelectItem value="June">June</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="August">August</SelectItem>
                        <SelectItem value="September">September</SelectItem>
                        <SelectItem value="October">October</SelectItem>
                        <SelectItem value="November">November</SelectItem>
                        <SelectItem value="December">December</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Basic Salary</TableHead>
                        <TableHead>Allowances</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead>Net Salary</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrollRecords.map((record) => {
                        const employee = employees.find((emp) => emp.id === record.empId)
                        return (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{employee?.name}</p>
                                <p className="text-sm text-gray-500">{employee?.empCode}</p>
                              </div>
                            </TableCell>
                            <TableCell>{employee?.department}</TableCell>
                            <TableCell>AED {record.basicSalary.toLocaleString()}</TableCell>
                            <TableCell>AED {record.allowances.toLocaleString()}</TableCell>
                            <TableCell>AED {record.deductions.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">AED {record.netSalary.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedEmployee(employee || null)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("payroll.statement")}</CardTitle>
                  <CardDescription>Individual employee salary statements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Statement
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {employees
                      .filter((emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((employee) => (
                        <Card key={employee.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                  <div>
                                    <h3 className="font-semibold text-lg">{employee.name}</h3>
                                    <p className="text-gray-600">{employee.designation}</p>
                                    <p className="text-sm text-gray-500">{employee.empCode}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">{t("payroll.basic")}:</span>
                                    <p className="text-gray-600">AED {employee.basicSalary.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">{t("payroll.allowances")}:</span>
                                    <p className="text-gray-600">
                                      AED{" "}
                                      {Object.values(employee.allowances)
                                        .reduce((sum, val) => sum + val, 0)
                                        .toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium">{t("payroll.deductions")}:</span>
                                    <p className="text-gray-600">
                                      AED{" "}
                                      {Object.values(employee.deductions)
                                        .reduce((sum, val) => sum + val, 0)
                                        .toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium">{t("payroll.net")}:</span>
                                    <p className="text-green-600 font-semibold">
                                      AED{" "}
                                      {(
                                        employee.basicSalary +
                                        Object.values(employee.allowances).reduce((sum, val) => sum + val, 0) -
                                        Object.values(employee.deductions).reduce((sum, val) => sum + val, 0)
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setSelectedEmployee(employee)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("payroll.gratuity")} & {t("payroll.endOfService")}
                  </CardTitle>
                  <CardDescription>Employee benefits and end of service calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Joining Date</TableHead>
                        <TableHead>Years of Service</TableHead>
                        <TableHead>Monthly Gratuity</TableHead>
                        <TableHead>End of Service Benefit</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => {
                        const joiningDate = new Date(employee.joiningDate)
                        const currentDate = new Date()
                        const monthsOfService =
                          (currentDate.getFullYear() - joiningDate.getFullYear()) * 12 +
                          (currentDate.getMonth() - joiningDate.getMonth())
                        const yearsOfService = (monthsOfService / 12).toFixed(1)
                        const monthlyGratuity = calculateGratuity(employee, monthsOfService)
                        const endOfServiceBenefit = calculateEndOfService(employee)

                        return (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-sm text-gray-500">{employee.empCode}</p>
                              </div>
                            </TableCell>
                            <TableCell>{employee.joiningDate}</TableCell>
                            <TableCell>{yearsOfService} years</TableCell>
                            <TableCell>AED {monthlyGratuity.toFixed(2)}</TableCell>
                            <TableCell>AED {endOfServiceBenefit.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                <Calculator className="h-4 w-4 mr-2" />
                                Calculate
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Process Monthly Payroll</CardTitle>
                  <CardDescription>Generate and process payroll for all employees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Select Month</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="february">February 2024</SelectItem>
                            <SelectItem value="march">March 2024</SelectItem>
                            <SelectItem value="april">April 2024</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Payroll Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular Payroll</SelectItem>
                            <SelectItem value="bonus">Bonus Payroll</SelectItem>
                            <SelectItem value="final">Final Settlement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Payroll Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Employees:</span>
                          <p className="text-blue-600">{employees.length}</p>
                        </div>
                        <div>
                          <span className="font-medium">Total Basic Salary:</span>
                          <p className="text-blue-600">
                            AED {employees.reduce((sum, emp) => sum + emp.basicSalary, 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Total Allowances:</span>
                          <p className="text-blue-600">
                            AED{" "}
                            {employees
                              .reduce(
                                (sum, emp) =>
                                  sum +
                                  Object.values(emp.allowances).reduce((allowanceSum, val) => allowanceSum + val, 0),
                                0,
                              )
                              .toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Total Deductions:</span>
                          <p className="text-blue-600">
                            AED{" "}
                            {employees
                              .reduce(
                                (sum, emp) =>
                                  sum +
                                  Object.values(emp.deductions).reduce((deductionSum, val) => deductionSum + val, 0),
                                0,
                              )
                              .toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button className="flex-1">
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Payroll
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Reports
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </AccessControl>

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Salary Statement - {selectedEmployee.name}</DialogTitle>
                <DialogDescription>
                  {selectedEmployee.empCode} | {selectedMonth} {selectedYear}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Employee Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span>{selectedEmployee.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employee Code:</span>
                        <span>{selectedEmployee.empCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Designation:</span>
                        <span>{selectedEmployee.designation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Department:</span>
                        <span>{selectedEmployee.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Joining Date:</span>
                        <span>{selectedEmployee.joiningDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Salary Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span>AED {selectedEmployee.basicSalary.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Allowances:</span>
                        <span></span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span>Housing:</span>
                        <span>AED {selectedEmployee.allowances.housing.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span>Transport:</span>
                        <span>AED {selectedEmployee.allowances.transport.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span>Food:</span>
                        <span>AED {selectedEmployee.allowances.food.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span>Medical:</span>
                        <span>AED {selectedEmployee.allowances.medical.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <span>Other:</span>
                        <span>AED {selectedEmployee.allowances.other.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Deductions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Insurance:</span>
                        <span>AED {selectedEmployee.deductions.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loan:</span>
                        <span>AED {selectedEmployee.deductions.loan.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other:</span>
                        <span>AED {selectedEmployee.deductions.other.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Gross Salary:</span>
                        <span>
                          AED{" "}
                          {(
                            selectedEmployee.basicSalary +
                            Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Deductions:</span>
                        <span>
                          AED{" "}
                          {Object.values(selectedEmployee.deductions)
                            .reduce((sum, val) => sum + val, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Net Salary:</span>
                        <span className="text-green-600">
                          AED{" "}
                          {(
                            selectedEmployee.basicSalary +
                            Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0) -
                            Object.values(selectedEmployee.deductions).reduce((sum, val) => sum + val, 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Email Statement
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

export default function PayrollPage() {
  return (
    <RouteGuard requiredPermission={["payroll", "all", "hr"]}>
      <PayrollPageContent />
    </RouteGuard>
  )
}
