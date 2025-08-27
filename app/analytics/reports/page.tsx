"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/AccessControl"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import ReportBuilder from "@/components/ReportBuilder"
import { Search, Plus, Download, Calendar, Users, BarChart3, FileText, Clock, Filter } from "lucide-react"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const savedReports = [
    {
      id: 1,
      name: "Monthly Employee Report",
      description: "Comprehensive monthly overview of all employees",
      type: "Employee",
      lastRun: "2024-01-15",
      createdBy: "HR Manager",
      status: "Ready",
    },
    {
      id: 2,
      name: "Attendance Summary",
      description: "Weekly attendance patterns and trends",
      type: "Attendance",
      lastRun: "2024-01-14",
      createdBy: "Admin",
      status: "Running",
    },
    {
      id: 3,
      name: "Payroll Analysis",
      description: "Salary distribution and payroll metrics",
      type: "Payroll",
      lastRun: "2024-01-10",
      createdBy: "Finance",
      status: "Ready",
    },
    {
      id: 4,
      name: "Performance Review Summary",
      description: "Quarterly performance evaluation results",
      type: "Performance",
      lastRun: "2024-01-08",
      createdBy: "HR Manager",
      status: "Ready",
    },
  ]

  const reportTemplates = [
    {
      name: "Employee Directory",
      description: "Complete list of all employees with contact information",
      icon: Users,
      category: "Employee",
    },
    {
      name: "Attendance Report",
      description: "Daily, weekly, or monthly attendance tracking",
      icon: Clock,
      category: "Attendance",
    },
    {
      name: "Leave Balance Report",
      description: "Current leave balances for all employees",
      icon: Calendar,
      category: "Leave",
    },
    {
      name: "Salary Report",
      description: "Comprehensive salary and compensation analysis",
      icon: BarChart3,
      category: "Payroll",
    },
  ]

  const filteredReports = savedReports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800"
      case "Running":
        return "bg-blue-100 text-blue-800"
      case "Error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute requiredPermissions={["analytics", "all"]}>
      <div className="min-h-screen bg-gray-50 pb-24">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Create, manage, and export custom reports</p>
            </div>
          </div>

          <Tabs defaultValue="saved" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="saved">Saved Reports</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="builder">Report Builder</TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <CardDescription className="mt-1">{report.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Type: {report.type}</span>
                        <span>By: {report.createdBy}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Last run: {new Date(report.lastRun).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <FileText className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportTemplates.map((template, index) => {
                  const Icon = template.icon
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="builder" className="space-y-6">
              <ReportBuilder />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
