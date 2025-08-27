"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Plus, X, BarChart3 } from "lucide-react"

interface ReportField {
  id: string
  name: string
  type: "text" | "number" | "date" | "boolean"
  category: string
}

interface ReportFilter {
  field: string
  operator: string
  value: string
}

export default function ReportBuilder() {
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [filters, setFilters] = useState<ReportFilter[]>([{ field: "", operator: "equals", value: "" }])
  const [chartType, setChartType] = useState("table")
  const [groupBy, setGroupBy] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const availableFields: ReportField[] = [
    { id: "employee_id", name: "Employee ID", type: "text", category: "Employee" },
    { id: "employee_name", name: "Employee Name", type: "text", category: "Employee" },
    { id: "department", name: "Department", type: "text", category: "Employee" },
    { id: "position", name: "Position", type: "text", category: "Employee" },
    { id: "hire_date", name: "Hire Date", type: "date", category: "Employee" },
    { id: "salary", name: "Salary", type: "number", category: "Payroll" },
    { id: "attendance_rate", name: "Attendance Rate", type: "number", category: "Attendance" },
    { id: "leave_balance", name: "Leave Balance", type: "number", category: "Leave" },
    { id: "performance_score", name: "Performance Score", type: "number", category: "Performance" },
    { id: "last_evaluation", name: "Last Evaluation", type: "date", category: "Performance" },
  ]

  const fieldCategories = Array.from(new Set(availableFields.map((field) => field.category)))

  const addFilter = () => {
    setFilters([...filters, { field: "", operator: "equals", value: "" }])
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, key: keyof ReportFilter, value: string) => {
    const updatedFilters = [...filters]
    updatedFilters[index] = { ...updatedFilters[index], [key]: value }
    setFilters(updatedFilters)
  }

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => (prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]))
  }

  const generateReport = () => {
    const reportConfig = {
      name: reportName,
      description: reportDescription,
      fields: selectedFields,
      filters,
      chartType,
      groupBy,
      sortBy,
      sortOrder,
    }
    console.log("Generating report with config:", reportConfig)
    // In a real app, this would send the config to the backend
  }

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`)
    // In a real app, this would trigger the export
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>Create custom reports with your preferred data and visualizations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chartType">Visualization Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportDescription">Description</Label>
            <Textarea
              id="reportDescription"
              placeholder="Describe what this report shows"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Field Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Data Fields</h3>
              <Badge variant="secondary">{selectedFields.length} fields selected</Badge>
            </div>

            {fieldCategories.map((category) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-600 uppercase tracking-wide">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableFields
                    .filter((field) => field.category === category)
                    .map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.id}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => toggleField(field.id)}
                        />
                        <Label htmlFor={field.id} className="text-sm cursor-pointer">
                          {field.name}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="w-4 h-4 mr-2" />
                Add Filter
              </Button>
            </div>

            {filters.map((filter, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Select value={filter.field} onValueChange={(value) => updateFilter(index, "field", value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filter.operator} onValueChange={(value) => updateFilter(index, "operator", value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                    <SelectItem value="between">Between</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, "value", e.target.value)}
                  className="flex-1"
                />

                <Button variant="ghost" size="sm" onClick={() => removeFilter(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Sorting and Grouping */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Group By</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Grouping</SelectItem>
                  {availableFields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={generateReport} className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={() => exportReport("pdf")}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => exportReport("excel")}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => exportReport("csv")}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
