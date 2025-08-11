"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Clock, CalendarIcon, Users, CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Mock attendance data
const mockAttendanceData = [
  {
    id: "1",
    employeeName: "John Doe",
    employeeId: "EMP001",
    date: "2024-01-15",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    totalHours: "9h 0m",
    status: "Present",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    employeeName: "Sarah Johnson",
    employeeId: "EMP002",
    date: "2024-01-15",
    checkIn: "08:45 AM",
    checkOut: "05:30 PM",
    totalHours: "8h 45m",
    status: "Present",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    employeeName: "Michael Chen",
    employeeId: "EMP003",
    date: "2024-01-15",
    checkIn: "09:15 AM",
    checkOut: "06:30 PM",
    totalHours: "9h 15m",
    status: "Late",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    employeeName: "Emily Rodriguez",
    employeeId: "EMP004",
    date: "2024-01-15",
    checkIn: "-",
    checkOut: "-",
    totalHours: "-",
    status: "Absent",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    employeeName: "David Wilson",
    employeeId: "EMP005",
    date: "2024-01-15",
    checkIn: "-",
    checkOut: "-",
    totalHours: "-",
    status: "On Leave",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const mockStats = {
  totalEmployees: 247,
  present: 234,
  absent: 8,
  onLeave: 5,
  late: 12,
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const departments = ["Engineering", "Human Resources", "Product", "Design", "Sales"]
  const statuses = ["Present", "Absent", "Late", "On Leave"]

  const filteredAttendance = mockAttendanceData.filter((record) => {
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>
      case "Late":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Late</Badge>
      case "Absent":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Absent</Badge>
      case "On Leave":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">On Leave</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-xs text-gray-500">Track employee attendance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900">{mockStats.totalEmployees}</p>
                </div>
                <Users className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-3xl font-bold text-green-600">{mockStats.present}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-3xl font-bold text-red-600">{mockStats.absent}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                  <p className="text-3xl font-bold text-blue-600">{mockStats.onLeave}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late</p>
                  <p className="text-3xl font-bold text-yellow-600">{mockStats.late}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter attendance records by date and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
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

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              Daily attendance for {format(selectedDate, "MMMM d, yyyy")} ({filteredAttendance.length} records)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={record.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {record.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.employeeName}</h3>
                      <p className="text-sm text-gray-600">{record.employeeId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Check In</p>
                      <p className="text-sm text-gray-600">{record.checkIn}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Check Out</p>
                      <p className="text-sm text-gray-600">{record.checkOut}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Total Hours</p>
                      <p className="text-sm text-gray-600">{record.totalHours}</p>
                    </div>
                    <div className="text-center">{getStatusBadge(record.status)}</div>
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
