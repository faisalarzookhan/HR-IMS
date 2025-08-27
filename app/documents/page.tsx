"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/AccessControl"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  File,
  ImageIcon,
  Video,
  Archive,
  Clock,
  CheckCircle2,
  AlertCircle,
  PenTool,
  Stamp,
  Plus,
  MoreVertical,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  category: string
  uploadedBy: {
    name: string
    avatar?: string
    role: string
  }
  uploadDate: string
  lastModified: string
  status: "draft" | "pending" | "approved" | "rejected" | "signed"
  version: string
  signatures?: {
    signer: string
    signedAt: string
    status: "pending" | "signed" | "declined"
  }[]
  permissions: {
    view: string[]
    edit: string[]
    sign: string[]
  }
  tags: string[]
  description?: string
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Employee Handbook 2024",
      type: "pdf",
      size: "2.4 MB",
      category: "Policy",
      uploadedBy: { name: "HR Admin", avatar: "/placeholder.svg", role: "HR Manager" },
      uploadDate: "2024-01-15T10:00:00Z",
      lastModified: "2024-01-15T10:00:00Z",
      status: "approved",
      version: "v2.1",
      permissions: { view: ["all"], edit: ["hr"], sign: [] },
      tags: ["handbook", "policy", "2024"],
      description: "Updated employee handbook with new policies and procedures",
    },
    {
      id: "2",
      name: "Employment Contract - John Doe",
      type: "pdf",
      size: "1.2 MB",
      category: "Contract",
      uploadedBy: { name: "Jane Smith", avatar: "/placeholder.svg", role: "HR Specialist" },
      uploadDate: "2024-01-14T14:30:00Z",
      lastModified: "2024-01-14T16:45:00Z",
      status: "signed",
      version: "v1.0",
      signatures: [
        { signer: "John Doe", signedAt: "2024-01-14T16:45:00Z", status: "signed" },
        { signer: "HR Manager", signedAt: "2024-01-14T16:30:00Z", status: "signed" },
      ],
      permissions: { view: ["hr", "john.doe"], edit: ["hr"], sign: ["john.doe", "hr.manager"] },
      tags: ["contract", "employment", "john-doe"],
      description: "Employment contract for new software engineer",
    },
    {
      id: "3",
      name: "Q1 Performance Review Template",
      type: "docx",
      size: "856 KB",
      category: "Template",
      uploadedBy: { name: "Mike Johnson", avatar: "/placeholder.svg", role: "Manager" },
      uploadDate: "2024-01-12T09:15:00Z",
      lastModified: "2024-01-13T11:20:00Z",
      status: "draft",
      version: "v1.2",
      permissions: { view: ["managers"], edit: ["hr", "managers"], sign: [] },
      tags: ["template", "performance", "review"],
      description: "Standard template for quarterly performance reviews",
    },
    {
      id: "4",
      name: "Leave Request Form - Sarah Wilson",
      type: "pdf",
      size: "324 KB",
      category: "Form",
      uploadedBy: { name: "Sarah Wilson", avatar: "/placeholder.svg", role: "Marketing Specialist" },
      uploadDate: "2024-01-10T13:45:00Z",
      lastModified: "2024-01-10T13:45:00Z",
      status: "pending",
      version: "v1.0",
      signatures: [
        { signer: "Sarah Wilson", signedAt: "2024-01-10T13:45:00Z", status: "signed" },
        { signer: "Manager", signedAt: "", status: "pending" },
      ],
      permissions: { view: ["sarah.wilson", "hr", "manager"], edit: [], sign: ["manager"] },
      tags: ["leave", "request", "sarah-wilson"],
      description: "Annual leave request for March vacation",
    },
  ])

  const categories = ["Policy", "Contract", "Template", "Form", "Report", "Certificate"]
  const statuses = ["draft", "pending", "approved", "rejected", "signed"]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />
      case "docx":
      case "doc":
        return <File className="w-8 h-8 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="w-8 h-8 text-green-500" />
      case "mp4":
      case "avi":
        return <Video className="w-8 h-8 text-purple-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "signed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "signed":
        return <CheckCircle2 className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log("Files selected:", files)
    }
  }

  const signDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "signed" as const,
              signatures: doc.signatures?.map((sig) =>
                sig.signer === user?.name
                  ? { ...sig, status: "signed" as const, signedAt: new Date().toISOString() }
                  : sig,
              ),
            }
          : doc,
      ),
    )
  }

  return (
    <ProtectedRoute requiredPermissions={["documents", "all"]}>
      <div className="min-h-screen bg-gray-50 pb-24">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600 mt-1">Manage, sign, and share documents securely</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={handleFileUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Document
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi"
          />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Documents</p>
                    <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Signatures</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {documents.filter((d) => d.status === "pending").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Signed Documents</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {documents.filter((d) => d.status === "signed").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Stamp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-3xl font-bold text-gray-900">24.8 GB</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Archive className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents">All Documents</TabsTrigger>
              <TabsTrigger value="signatures">Pending Signatures</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search documents..."
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <Card key={document.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(document.type)}
                          <div className="flex-1">
                            <CardTitle className="text-lg truncate">{document.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary">{document.category}</Badge>
                              <Badge className={getStatusColor(document.status)}>
                                {getStatusIcon(document.status)}
                                <span className="ml-1">{document.status}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p>{document.description}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={document.uploadedBy.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {document.uploadedBy.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-gray-600">
                          <span>{document.uploadedBy.name}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{document.size}</span>
                        <span>{document.version}</span>
                      </div>

                      {document.signatures && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Signatures:</h4>
                          {document.signatures.map((signature, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{signature.signer}</span>
                              <Badge
                                className={
                                  signature.status === "signed"
                                    ? "bg-green-100 text-green-800"
                                    : signature.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {signature.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {document.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {document.status === "pending" &&
                          document.signatures?.some((sig) => sig.signer === user?.name && sig.status === "pending") && (
                            <Button size="sm" onClick={() => signDocument(document.id)}>
                              <PenTool className="w-4 h-4 mr-2" />
                              Sign
                            </Button>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="signatures" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {documents
                  .filter((doc) => doc.status === "pending")
                  .map((document) => (
                    <Card key={document.id} className="border-yellow-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(document.type)}
                            <div>
                              <CardTitle className="text-lg">{document.name}</CardTitle>
                              <CardDescription>{document.description}</CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="w-4 h-4 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Signature Status:</h4>
                          {document.signatures?.map((signature, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {signature.signer
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{signature.signer}</span>
                              </div>
                              <Badge
                                className={
                                  signature.status === "signed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {signature.status}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          {document.signatures?.some(
                            (sig) => sig.signer === user?.name && sig.status === "pending",
                          ) && (
                            <Button size="sm" onClick={() => signDocument(document.id)}>
                              <PenTool className="w-4 h-4 mr-2" />
                              Sign Now
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Employment Contract", category: "Contract", description: "Standard employment agreement" },
                  { name: "NDA Template", category: "Legal", description: "Non-disclosure agreement template" },
                  { name: "Performance Review", category: "HR", description: "Employee performance evaluation form" },
                  { name: "Leave Request", category: "HR", description: "Standard leave application form" },
                  { name: "Expense Report", category: "Finance", description: "Employee expense reimbursement form" },
                  { name: "Offer Letter", category: "HR", description: "Job offer letter template" },
                ].map((template, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
