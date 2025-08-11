"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building2, User, FileText, Edit, MoreVertical } from "lucide-react"
import Link from "next/link"

// Mock employee data - in real app, this would come from API based on ID
const mockEmployee = {
  id: "1",
  name: "John Doe",
  email: "john.doe@limitless.com",
  phone: "+1 (555) 123-4567",
  position: "Senior Developer",
  department: "Engineering",
  location: "New York",
  joinDate: "2022-03-15",
  status: "Active",
  avatar: "/placeholder.svg?height=80&width=80",
  employeeId: "EMP001",
  manager: "Sarah Johnson",
  employmentType: "Full-time",
  salary: "$95,000",
  address: "123 Main St, New York, NY 10001",
  emergencyContact: "Jane Doe",
  emergencyPhone: "+1 (555) 987-6543",
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
  education: "Bachelor's in Computer Science, MIT",
  notes: "Excellent team player with strong technical skills. Leading the frontend architecture project.",
}

const mockAttendance = [
  { date: "2024-01-15", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present" },
  { date: "2024-01-14", checkIn: "09:15 AM", checkOut: "06:30 PM", status: "Present" },
  { date: "2024-01-13", checkIn: "-", checkOut: "-", status: "Weekend" },
  { date: "2024-01-12", checkIn: "09:00 AM", checkOut: "05:45 PM", status: "Present" },
  { date: "2024-01-11", checkIn: "-", checkOut: "-", status: "Sick Leave" },
]

const mockLeaveHistory = [
  { type: "Annual Leave", startDate: "2024-01-20", endDate: "2024-01-22", days: 3, status: "Approved" },
  { type: "Sick Leave", startDate: "2024-01-11", endDate: "2024-01-11", days: 1, status: "Approved" },
  { type: "Personal Leave", startDate: "2023-12-25", endDate: "2023-12-26", days: 2, status: "Approved" },
]

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/employees">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Employees
                </Button>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employee Details</h1>
                <p className="text-xs text-gray-500">{mockEmployee.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employee Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={mockEmployee.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {mockEmployee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{mockEmployee.name}</h2>
                  <Badge variant={mockEmployee.status === "Active" ? "default" : "secondary"}>
                    {mockEmployee.status}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-3">{mockEmployee.position}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>{mockEmployee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{mockEmployee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{mockEmployee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{mockEmployee.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(mockEmployee.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>ID: {mockEmployee.employeeId}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="text-sm text-gray-900">{mockEmployee.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employee ID</p>
                      <p className="text-sm text-gray-900">{mockEmployee.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-sm text-gray-900">{mockEmployee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-sm text-gray-900">{mockEmployee.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-sm text-gray-900">{mockEmployee.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Position</p>
                      <p className="text-sm text-gray-900">{mockEmployee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Department</p>
                      <p className="text-sm text-gray-900">{mockEmployee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Manager</p>
                      <p className="text-sm text-gray-900">{mockEmployee.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employment Type</p>
                      <p className="text-sm text-gray-900">{mockEmployee.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Join Date</p>
                      <p className="text-sm text-gray-900">{new Date(mockEmployee.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Salary</p>
                      <p className="text-sm text-gray-900">{mockEmployee.salary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Name</p>
                      <p className="text-sm text-gray-900">{mockEmployee.emergencyContact}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Phone</p>
                      <p className="text-sm text-gray-900">{mockEmployee.emergencyPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {mockEmployee.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Education</p>
                    <p className="text-sm text-gray-900">{mockEmployee.education}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Notes</p>
                    <p className="text-sm text-gray-900">{mockEmployee.notes}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAttendance.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Check In: {record.checkIn}</p>
                          <p className="text-sm text-gray-600">Check Out: {record.checkOut}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          record.status === "Present"
                            ? "default"
                            : record.status === "Weekend"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave">
            <Card>
              <CardHeader>
                <CardTitle>Leave History</CardTitle>
                <CardDescription>Past and upcoming leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaveHistory.map((leave, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{leave.type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(leave.startDate).toLocaleDateString()} -{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">{leave.days} day(s)</p>
                      </div>
                      <Badge variant={leave.status === "Approved" ? "default" : "secondary"}>{leave.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Employee documents and files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
