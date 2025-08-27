"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/AccessControl"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  Play,
  Pause,
  Settings,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  FileText,
  Bell,
  Zap,
  GitBranch,
  ArrowRight,
  DollarSign,
} from "lucide-react"

interface WorkflowStep {
  id: string
  name: string
  type: "approval" | "notification" | "assignment" | "condition"
  assignee?: string
  condition?: string
  action: string
}

interface Workflow {
  id: string
  name: string
  description: string
  trigger: string
  status: "active" | "inactive" | "draft"
  steps: WorkflowStep[]
  lastRun?: string
  totalRuns: number
  successRate: number
  category: string
}

export default function WorkflowsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Leave Request Approval",
      description: "Automated leave request approval process with manager review",
      trigger: "Leave request submitted",
      status: "active",
      steps: [
        {
          id: "1",
          name: "Manager Review",
          type: "approval",
          assignee: "Direct Manager",
          action: "Review and approve/reject leave request",
        },
        { id: "2", name: "HR Notification", type: "notification", action: "Notify HR team of approval decision" },
        {
          id: "3",
          name: "Employee Notification",
          type: "notification",
          action: "Send approval/rejection email to employee",
        },
      ],
      lastRun: "2024-01-15T10:30:00Z",
      totalRuns: 45,
      successRate: 96,
      category: "Leave Management",
    },
    {
      id: "2",
      name: "New Employee Onboarding",
      description: "Complete onboarding workflow for new hires",
      trigger: "Employee hired",
      status: "active",
      steps: [
        {
          id: "1",
          name: "Welcome Email",
          type: "notification",
          action: "Send welcome email with first day information",
        },
        {
          id: "2",
          name: "IT Setup",
          type: "assignment",
          assignee: "IT Team",
          action: "Create accounts and assign equipment",
        },
        {
          id: "3",
          name: "HR Orientation",
          type: "assignment",
          assignee: "HR Team",
          action: "Schedule orientation session",
        },
        {
          id: "4",
          name: "Manager Introduction",
          type: "assignment",
          assignee: "Direct Manager",
          action: "Schedule first meeting",
        },
      ],
      lastRun: "2024-01-12T14:20:00Z",
      totalRuns: 12,
      successRate: 100,
      category: "Employee Management",
    },
    {
      id: "3",
      name: "Performance Review Reminder",
      description: "Automated reminders for quarterly performance reviews",
      trigger: "90 days since last review",
      status: "active",
      steps: [
        { id: "1", name: "Manager Reminder", type: "notification", action: "Remind manager to schedule review" },
        { id: "2", name: "Employee Notification", type: "notification", action: "Notify employee of upcoming review" },
        {
          id: "3",
          name: "Review Scheduling",
          type: "assignment",
          assignee: "Manager",
          action: "Schedule review meeting",
        },
      ],
      lastRun: "2024-01-10T09:00:00Z",
      totalRuns: 28,
      successRate: 89,
      category: "Performance",
    },
    {
      id: "4",
      name: "Expense Report Processing",
      description: "Automated expense report approval and reimbursement",
      trigger: "Expense report submitted",
      status: "draft",
      steps: [
        {
          id: "1",
          name: "Manager Approval",
          type: "approval",
          assignee: "Direct Manager",
          action: "Review and approve expenses",
        },
        {
          id: "2",
          name: "Finance Review",
          type: "approval",
          assignee: "Finance Team",
          action: "Verify and process payment",
        },
        { id: "3", name: "Payment Notification", type: "notification", action: "Notify employee of payment status" },
      ],
      totalRuns: 0,
      successRate: 0,
      category: "Finance",
    },
  ])

  const [activeWorkflows, setActiveWorkflows] = useState(0)
  const [totalExecutions, setTotalExecutions] = useState(0)

  useEffect(() => {
    setActiveWorkflows(workflows.filter((w) => w.status === "active").length)
    setTotalExecutions(workflows.reduce((sum, w) => sum + w.totalRuns, 0))
  }, [workflows])

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || workflow.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(workflows.map((w) => w.category)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "approval":
        return CheckCircle2
      case "notification":
        return Bell
      case "assignment":
        return Users
      case "condition":
        return GitBranch
      default:
        return Clock
    }
  }

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w)),
    )
  }

  return (
    <ProtectedRoute requiredPermissions={["workflows", "all"]}>
      <div className="min-h-screen bg-gray-50 pb-24">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflow Automation</h1>
              <p className="text-gray-600 mt-1">Automate HR processes and improve efficiency</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                    <p className="text-3xl font-bold text-gray-900">{activeWorkflows}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Executions</p>
                    <p className="text-3xl font-bold text-gray-900">{totalExecutions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900">94%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time Saved</p>
                    <p className="text-3xl font-bold text-gray-900">240h</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="workflows" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Workflows Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-lg">{workflow.name}</CardTitle>
                            <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                          </div>
                          <CardDescription>{workflow.description}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleWorkflowStatus(workflow.id)}>
                            {workflow.status === "active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Trigger: {workflow.trigger}
                      </div>

                      {/* Workflow Steps */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Workflow Steps:</h4>
                        <div className="space-y-2">
                          {workflow.steps.map((step, index) => {
                            const StepIcon = getStepIcon(step.type)
                            return (
                              <div key={step.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <StepIcon className="w-3 h-3 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{step.name}</p>
                                  {step.assignee && (
                                    <p className="text-xs text-gray-500">Assigned to: {step.assignee}</p>
                                  )}
                                </div>
                                {index < workflow.steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400" />}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{workflow.totalRuns}</p>
                          <p className="text-xs text-gray-500">Total Runs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{workflow.successRate}%</p>
                          <p className="text-xs text-gray-500">Success Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Last Run</p>
                          <p className="text-sm font-medium">
                            {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : "Never"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Employee Onboarding", icon: Users, description: "Complete new hire process automation" },
                  { name: "Leave Approval", icon: Calendar, description: "Streamlined leave request workflow" },
                  { name: "Document Approval", icon: FileText, description: "Multi-step document review process" },
                  {
                    name: "Performance Review",
                    icon: CheckCircle2,
                    description: "Automated review scheduling and reminders",
                  },
                  { name: "Expense Processing", icon: DollarSign, description: "Expense report approval workflow" },
                  { name: "IT Provisioning", icon: Settings, description: "Automated IT setup for new employees" },
                ].map((template, index) => {
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

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Performance</CardTitle>
                    <CardDescription>Success rates and execution times</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workflows
                        .filter((w) => w.status === "active")
                        .map((workflow) => (
                          <div
                            key={workflow.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{workflow.name}</p>
                              <p className="text-sm text-gray-500">{workflow.totalRuns} executions</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{workflow.successRate}%</p>
                              <p className="text-xs text-gray-500">Success Rate</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest workflow executions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          workflow: "Leave Request Approval",
                          status: "completed",
                          time: "2 hours ago",
                          user: "John Doe",
                        },
                        {
                          workflow: "New Employee Onboarding",
                          status: "in-progress",
                          time: "4 hours ago",
                          user: "Jane Smith",
                        },
                        {
                          workflow: "Performance Review Reminder",
                          status: "completed",
                          time: "1 day ago",
                          user: "Mike Johnson",
                        },
                        {
                          workflow: "Leave Request Approval",
                          status: "failed",
                          time: "2 days ago",
                          user: "Sarah Wilson",
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.status === "completed"
                                ? "bg-green-500"
                                : activity.status === "in-progress"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.workflow}</p>
                            <p className="text-xs text-gray-500">
                              {activity.user} • {activity.time}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.status === "completed"
                                ? "default"
                                : activity.status === "in-progress"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
