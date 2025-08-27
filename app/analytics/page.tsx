"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/AccessControl"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/components/OrganizationProvider"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  Award,
  Download,
  Filter,
  BarChart3,
  PieChartIcon,
} from "lucide-react"

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { data: orgData } = useOrganization()
  const [dateRange, setDateRange] = useState({ from: new Date(2024, 0, 1), to: new Date() })
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedMetric, setSelectedMetric] = useState("attendance")

  // Mock analytics data
  const [analyticsData, setAnalyticsData] = useState({
    employeeGrowth: [
      { month: "Jan", employees: 45, hires: 5, departures: 2 },
      { month: "Feb", employees: 48, hires: 4, departures: 1 },
      { month: "Mar", employees: 52, hires: 6, departures: 2 },
      { month: "Apr", employees: 55, hires: 4, departures: 1 },
      { month: "May", employees: 58, hires: 5, departures: 2 },
      { month: "Jun", employees: 61, hires: 4, departures: 1 },
    ],
    attendanceData: [
      { day: "Mon", present: 95, absent: 5, late: 3 },
      { day: "Tue", present: 92, absent: 8, late: 5 },
      { day: "Wed", present: 97, absent: 3, late: 2 },
      { day: "Thu", present: 94, absent: 6, late: 4 },
      { day: "Fri", present: 89, absent: 11, late: 7 },
    ],
    departmentDistribution: [
      { name: "Engineering", value: 35, employees: 21 },
      { name: "Sales", value: 25, employees: 15 },
      { name: "Marketing", value: 15, employees: 9 },
      { name: "HR", value: 10, employees: 6 },
      { name: "Finance", value: 15, employees: 9 },
    ],
    performanceMetrics: [
      { department: "Engineering", performance: 92, satisfaction: 88, productivity: 95 },
      { department: "Sales", performance: 89, satisfaction: 85, productivity: 91 },
      { department: "Marketing", performance: 87, satisfaction: 90, productivity: 88 },
      { department: "HR", performance: 94, satisfaction: 92, productivity: 89 },
      { department: "Finance", performance: 91, satisfaction: 87, productivity: 93 },
    ],
    salaryAnalysis: [
      { range: "30-40k", count: 15, percentage: 25 },
      { range: "40-50k", count: 18, percentage: 30 },
      { range: "50-60k", count: 12, percentage: 20 },
      { range: "60-70k", count: 9, percentage: 15 },
      { range: "70k+", count: 6, percentage: 10 },
    ],
    leaveAnalysis: [
      { month: "Jan", sick: 12, vacation: 8, personal: 5 },
      { month: "Feb", sick: 15, vacation: 6, personal: 4 },
      { month: "Mar", sick: 10, vacation: 12, personal: 7 },
      { month: "Apr", sick: 8, vacation: 15, personal: 6 },
      { month: "May", sick: 11, vacation: 18, personal: 8 },
      { month: "Jun", sick: 9, vacation: 22, personal: 5 },
    ],
  })

  const kpiData = [
    {
      title: "Employee Retention",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Average Attendance",
      value: "93.4%",
      change: "+1.8%",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Employee Satisfaction",
      value: "88.7%",
      change: "-0.5%",
      trend: "down",
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Avg. Salary Growth",
      value: "7.2%",
      change: "+1.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const exportReport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting report in ${format} format`)
    // In a real app, this would generate and download the report
  }

  return (
    <ProtectedRoute requiredPermissions={["analytics", "all"]}>
      <div className="min-h-screen bg-gray-50 pb-24">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights into your organization</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                        <div className="flex items-center mt-1">
                          {kpi.trend === "up" ? (
                            <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                          )}
                          <span className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {kpi.change} from last month
                          </span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${kpi.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Employee Growth Trend
                    </CardTitle>
                    <CardDescription>Monthly employee count and hiring trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData.employeeGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="employees"
                          stackId="1"
                          stroke="#2563eb"
                          fill="#2563eb"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="hires"
                          stackId="2"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChartIcon className="w-5 h-5 mr-2" />
                      Department Distribution
                    </CardTitle>
                    <CardDescription>Employee distribution across departments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.departmentDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.departmentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hiring vs Departures</CardTitle>
                    <CardDescription>Monthly comparison of new hires and departures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.employeeGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hires" fill="#10b981" name="New Hires" />
                        <Bar dataKey="departures" fill="#ef4444" name="Departures" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Salary Distribution</CardTitle>
                    <CardDescription>Employee count by salary ranges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.salaryAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Attendance Pattern</CardTitle>
                    <CardDescription>Daily attendance, absence, and late arrival trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Leave Analysis</CardTitle>
                    <CardDescription>Monthly breakdown of different leave types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData.leaveAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="sick"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="vacation"
                          stackId="1"
                          stroke="#2563eb"
                          fill="#2563eb"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="personal"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance Metrics</CardTitle>
                  <CardDescription>Performance, satisfaction, and productivity by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={analyticsData.performanceMetrics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="performance" fill="#2563eb" name="Performance Score" />
                      <Bar dataKey="satisfaction" fill="#10b981" name="Satisfaction Score" />
                      <Bar dataKey="productivity" fill="#f59e0b" name="Productivity Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payroll" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Distribution Analysis</CardTitle>
                    <CardDescription>Employee distribution across salary ranges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.salaryAnalysis}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ range, percentage }) => `${range}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analyticsData.salaryAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Summary</CardTitle>
                    <CardDescription>Key payroll metrics and statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Total Monthly Payroll</span>
                      <span className="text-xl font-bold text-blue-600">$284,500</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Average Salary</span>
                      <span className="text-xl font-bold text-green-600">$4,742</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Highest Paid Department</span>
                      <span className="text-xl font-bold text-orange-600">Engineering</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Salary Growth Rate</span>
                      <span className="text-xl font-bold text-purple-600">+7.2%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>Download detailed reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => exportReport("pdf")}
                  className="flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportReport("excel")}
                  className="flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportReport("csv")}
                  className="flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
