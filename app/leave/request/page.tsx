"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, Send, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format, differenceInDays } from "date-fns"

export default function LeaveRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    reason: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const leaveTypes = [
    { value: "annual", label: "Annual Leave", balance: 15 },
    { value: "sick", label: "Sick Leave", balance: 10 },
    { value: "personal", label: "Personal Leave", balance: 5 },
    { value: "maternity", label: "Maternity Leave", balance: 90 },
    { value: "paternity", label: "Paternity Leave", balance: 14 },
    { value: "emergency", label: "Emergency Leave", balance: 3 },
  ]

  const selectedLeaveType = leaveTypes.find((type) => type.value === formData.leaveType)
  const totalDays =
    formData.startDate && formData.endDate ? differenceInDays(formData.endDate, formData.startDate) + 1 : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Leave request submitted:", formData)
    // Here you would send the data to your backend
    router.push("/leave")
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/leave">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Leave Management
                </Button>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Request Leave</h1>
                <p className="text-xs text-gray-500">Submit a new leave request</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Leave Balance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Leave Balance</CardTitle>
            <CardDescription>Available leave days by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {leaveTypes.map((type) => (
                <div key={type.value} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">{type.label}</p>
                  <p className="text-2xl font-bold text-blue-600">{type.balance}</p>
                  <p className="text-xs text-gray-500">days left</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leave Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Request Form</CardTitle>
            <CardDescription>Fill in the details for your leave request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type *</Label>
                <Select value={formData.leaveType} onValueChange={(value) => handleInputChange("leaveType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} ({type.balance} days available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLeaveType && (
                  <p className="text-sm text-gray-600">
                    You have {selectedLeaveType.balance} days available for {selectedLeaveType.label}
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => handleInputChange("startDate", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => handleInputChange("endDate", date)}
                        disabled={(date) => date < (formData.startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Duration Summary */}
              {totalDays > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Total Duration: {totalDays} day{totalDays > 1 ? "s" : ""}
                  </p>
                  {selectedLeaveType && totalDays > selectedLeaveType.balance && (
                    <p className="text-sm text-red-600 mt-1">
                      Warning: You are requesting more days than available ({selectedLeaveType.balance} days left)
                    </p>
                  )}
                </div>
              )}

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  placeholder="Please provide a brief reason for your leave request"
                  rows={4}
                  required
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Contact person during leave"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/leave">
                  <Button type="button" variant="ghost">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
