"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrganization } from "./OrganizationProvider"
import { Users, Building2, TrendingUp, TrendingDown, ChevronDown, ChevronRight, MapPin } from "lucide-react"

interface OrgChartNodeProps {
  node: any
  level: number
  isExpanded: boolean
  onToggle: () => void
}

function OrgChartNode({ node, level, isExpanded, onToggle }: OrgChartNodeProps) {
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="relative">
      <div
        className={`flex items-center space-x-3 p-3 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow ${level === 1 ? "border-blue-200 bg-blue-50" : level === 2 ? "border-green-200 bg-green-50" : "border-gray-200"}`}
      >
        {hasChildren && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onToggle}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        {!hasChildren && <div className="w-6" />}

        <Avatar className="h-8 w-8">
          <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
          <AvatarFallback className="text-xs">
            {node.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm truncate">{node.name}</p>
            {node.employeeCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {node.employeeCount} reports
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 truncate">{node.position}</p>
          <p className="text-xs text-gray-500">{node.department}</p>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
          {node.children.map((child: any) => (
            <OrgChartNode key={child.id} node={child} level={level + 1} isExpanded={false} onToggle={() => {}} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrganizationalChart() {
  const { data, getDepartmentHierarchy } = useOrganization()
  const [selectedDepartment, setSelectedDepartment] = useState("Engineering")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]))

  const hierarchy = getDepartmentHierarchy(selectedDepartment)
  const selectedDept = data.departments.find((d) => d.name === selectedDepartment)

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{selectedDept?.count || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-green-600">{selectedDept?.performance || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-600">{selectedDept?.growth || 0}%</p>
              </div>
              {(selectedDept?.growth || 0) > 0 ? (
                <TrendingUp className="w-8 h-8 text-purple-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-orange-600">{selectedDept?.locations.length || 0}</p>
              </div>
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizational Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Organizational Structure</span>
              </CardTitle>
              <CardDescription>Department hierarchy and reporting structure</CardDescription>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {data.departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hierarchy.length > 0 ? (
              hierarchy.map((node) => (
                <OrgChartNode
                  key={node.id}
                  node={node}
                  level={1}
                  isExpanded={expandedNodes.has(node.id)}
                  onToggle={() => toggleNode(node.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No organizational structure available for this department</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Department Locations */}
      {selectedDept && selectedDept.locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Department Locations</CardTitle>
            <CardDescription>Geographic distribution of {selectedDepartment} team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedDept.locations.map((location, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{location}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
