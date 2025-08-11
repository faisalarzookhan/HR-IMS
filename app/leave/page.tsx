"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Plus, Check, X, Clock, FileText } from "lucide-react"
import Link from "next/link"

// Mock leave requests data
const mockLeaveRequests = [
  {
    id: "1",
    employeeName: "John Doe",
    employeeId: "EMP001",
    leaveType: "Annual Leave",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    days: 3,
    reason: "Family vacation",
    status: "Pending",
    appliedDate: "2024-01-10",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    employeeName: "Sarah Johnson",
    employeeId: "EMP002",
    leaveType: "Sick Leave",
    startDate: "2024-01-18",
    endDate: "2024-01-19",
    days: 2,
    reason: "Medical appointment",
    status: "Approved",
    appliedDate: "2024-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    employeeName: "Michael Chen",
    employeeId: "EMP003",
    leaveType: "Personal Leave",
    startDate: "2024-01-25",
    endDate: "2024-01-26",
    days: 2,
    reason: "Personal matters",
    status: "Pending",
    appliedDate: "2024-01-12",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    employeeName: "Emily Rodriguez",
    employeeId: "EMP004",
    leaveType: "Maternity Leave",
    startDate: "2024-02-01",
    endDate: "2024-04-01",
    days: 60,
    reason: "Maternity leave",
    status: "Approved",
    appliedDate: "2024-01-05",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    employeeName: "David Wilson",
    employeeId: "EMP005",
    leaveType: "Annual Leave",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    days: 3,
    reason: "Weekend getaway",
    status: "Rejected",
    appliedDate: "2024-01-08",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const mockStats = {
  totalRequests: 45,
  pending: 8,
  approved: 32,
  rejected: 5,
}

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const leaveTypes = ["Annual Leave", "Sick Leave", "Personal Leave", "Maternity Leave", "Paternity Leave"]
  const statuses = ["Pending", "Approved", "Rejected"]

  const filteredRequests = mockLeaveRequests.filter((request) => {
    const matchesTab = activeTab === "all" || request.status.toLowerCase() === activeTab
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.leaveType === typeFilter
    return matchesTab && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleApprove = (id: string) => {
    console.log("Approving leave request:", id)
    // Here you would update the status in your backend
  }

  const handleReject = (id: string) => {
    console.log("Rejecting leave request:", id)
    // Here you would update the status in your backend
  }

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
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Leave Management</h1>
                <p className="text-xs text-gray-500">Manage employee leave requests</p>
              </div>
            </div>
            <Link href="/leave/request">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{mockStats.totalRequests}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{mockStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{mockStats.approved}</p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{mockStats.rejected}</p>
                </div>
                <X className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter leave requests by type and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Leave Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Manage and review employee leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({mockLeaveRequests.length})</TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({mockLeaveRequests.filter((r) => r.status === "Pending").length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({mockLeaveRequests.filter((r) => r.status === "Approved").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({mockLeaveRequests.filter((r) => r.status === "Rejected").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={request.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {request.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{request.employeeName}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {request.employeeId} • {request.leaveType}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              {new Date(request.startDate).toLocaleDateString()} -{" "}
                              {new Date(request.endDate).toLocaleDateString()}
                            </span>
                            <span>{request.days} day(s)</span>
                            <span>Applied: {new Date(request.appliedDate).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">
                            <strong>Reason:</strong> {request.reason}
                          </p>
                        </div>
                      </div>
                      {request.status === "Pending" && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
