"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Laptop,
  Smartphone,
  Monitor,
  Printer,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface ITAsset {
  id: string
  assetTag: string
  name: string
  category: "laptop" | "desktop" | "monitor" | "phone" | "tablet" | "printer" | "other"
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  warrantyExpiry: string
  status: "available" | "assigned" | "maintenance" | "retired"
  assignedTo?: string
  assignedDate?: string
  location: string
  condition: "excellent" | "good" | "fair" | "poor"
  value: number
  specifications: string
  notes: string
}

interface Document {
  id: string
  name: string
  type: "contract" | "policy" | "manual" | "certificate" | "agreement" | "other"
  category: string
  uploadDate: string
  uploadedBy: string
  fileSize: string
  status: "pending" | "approved" | "rejected" | "expired"
  expiryDate?: string
  relatedAsset?: string
  relatedEmployee?: string
  accessLevel: "public" | "restricted" | "confidential"
  signatureRequired: boolean
  signedBy?: string[]
  signedDate?: string
  reviewedBy?: string
  reviewDate?: string
  version: string
}

interface AssetAssignment {
  id: string
  assetId: string
  employeeId: string
  employeeName: string
  assignedDate: string
  returnDate?: string
  status: "active" | "returned" | "overdue"
  condition: string
  notes: string
  signedDocument?: string
}

const mockAssets: ITAsset[] = [
  {
    id: "1",
    assetTag: "LIS-LAP-001",
    name: "MacBook Pro 16-inch",
    category: "laptop",
    brand: "Apple",
    model: "MacBook Pro M2",
    serialNumber: "C02YW0AAJGH6",
    purchaseDate: "2023-06-15",
    warrantyExpiry: "2026-06-15",
    status: "assigned",
    assignedTo: "Ahmed Al-Rashid",
    assignedDate: "2023-06-20",
    location: "Dubai Office",
    condition: "excellent",
    value: 8500,
    specifications: "M2 Pro chip, 16GB RAM, 512GB SSD, 16-inch Liquid Retina XDR display",
    notes: "Primary development machine for senior engineer",
  },
  {
    id: "2",
    assetTag: "LIS-MON-001",
    name: "Dell UltraSharp 27-inch",
    category: "monitor",
    brand: "Dell",
    model: "U2723QE",
    serialNumber: "CN-0H7H2G-74180-25A-0001",
    purchaseDate: "2023-07-10",
    warrantyExpiry: "2026-07-10",
    status: "assigned",
    assignedTo: "Ahmed Al-Rashid",
    assignedDate: "2023-07-15",
    location: "Dubai Office",
    condition: "excellent",
    value: 1200,
    specifications: "27-inch 4K USB-C Hub Monitor, IPS Black technology",
    notes: "External monitor for development workstation",
  },
  {
    id: "3",
    assetTag: "LIS-PHN-001",
    name: "iPhone 14 Pro",
    category: "phone",
    brand: "Apple",
    model: "iPhone 14 Pro",
    serialNumber: "F2LN8J9HQ6L3",
    purchaseDate: "2023-09-20",
    warrantyExpiry: "2024-09-20",
    status: "available",
    location: "Dubai Office",
    condition: "excellent",
    value: 4200,
    specifications: "128GB, Deep Purple, A16 Bionic chip",
    notes: "Available for assignment to new employees",
  },
]

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "IT Asset Assignment Agreement",
    type: "agreement",
    category: "IT Assets",
    uploadDate: "2023-06-20",
    uploadedBy: "HR Department",
    fileSize: "245 KB",
    status: "approved",
    relatedAsset: "LIS-LAP-001",
    relatedEmployee: "Ahmed Al-Rashid",
    accessLevel: "restricted",
    signatureRequired: true,
    signedBy: ["Ahmed Al-Rashid", "IT Manager"],
    signedDate: "2023-06-20",
    reviewedBy: "Legal Team",
    reviewDate: "2023-06-19",
    version: "1.0",
  },
  {
    id: "2",
    name: "Laptop Usage Policy",
    type: "policy",
    category: "IT Policies",
    uploadDate: "2023-01-15",
    uploadedBy: "IT Department",
    fileSize: "180 KB",
    status: "approved",
    accessLevel: "public",
    signatureRequired: false,
    reviewedBy: "IT Manager",
    reviewDate: "2023-01-14",
    version: "2.1",
  },
  {
    id: "3",
    name: "MacBook Pro User Manual",
    type: "manual",
    category: "User Guides",
    uploadDate: "2023-06-15",
    uploadedBy: "IT Support",
    fileSize: "2.1 MB",
    status: "approved",
    relatedAsset: "LIS-LAP-001",
    accessLevel: "public",
    signatureRequired: false,
    version: "1.0",
  },
]

const mockAssignments: AssetAssignment[] = [
  {
    id: "1",
    assetId: "1",
    employeeId: "1",
    employeeName: "Ahmed Al-Rashid",
    assignedDate: "2023-06-20",
    status: "active",
    condition: "excellent",
    notes: "Assigned for development work, includes charger and carrying case",
    signedDocument: "IT Asset Assignment Agreement",
  },
  {
    id: "2",
    assetId: "2",
    employeeId: "1",
    employeeName: "Ahmed Al-Rashid",
    assignedDate: "2023-07-15",
    status: "active",
    condition: "excellent",
    notes: "External monitor for workstation setup",
    signedDocument: "Monitor Assignment Form",
  },
]

export default function AssetsPage() {
  const { t, language } = useLanguage()
  const [assets] = useState<ITAsset[]>(mockAssets)
  const [documents] = useState<Document[]>(mockDocuments)
  const [assignments] = useState<AssetAssignment[]>(mockAssignments)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState<ITAsset | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "returned":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "laptop":
        return <Laptop className="h-5 w-5" />
      case "desktop":
        return <Monitor className="h-5 w-5" />
      case "monitor":
        return <Monitor className="h-5 w-5" />
      case "phone":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Smartphone className="h-5 w-5" />
      case "printer":
        return <Printer className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const totalAssets = assets.length
  const assignedAssets = assets.filter((asset) => asset.status === "assigned").length
  const availableAssets = assets.filter((asset) => asset.status === "available").length
  const maintenanceAssets = assets.filter((asset) => asset.status === "maintenance").length

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Assets & Document Management</h1>
          <p className="text-gray-600">Comprehensive asset tracking and document management system</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assets</p>
                  <p className="text-2xl font-bold">{totalAssets}</p>
                </div>
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold">{assignedAssets}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold">{availableAssets}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold">{maintenanceAssets}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assets">IT Assets</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>IT Assets Inventory</CardTitle>
                    <CardDescription>Manage and track all IT assets and equipment</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New IT Asset</DialogTitle>
                        <DialogDescription>Register a new IT asset in the inventory</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Asset Tag</Label>
                          <Input placeholder="e.g., LIS-LAP-002" />
                        </div>
                        <div>
                          <Label>Asset Name</Label>
                          <Input placeholder="e.g., MacBook Pro 14-inch" />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="laptop">Laptop</SelectItem>
                              <SelectItem value="desktop">Desktop</SelectItem>
                              <SelectItem value="monitor">Monitor</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="tablet">Tablet</SelectItem>
                              <SelectItem value="printer">Printer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Brand</Label>
                          <Input placeholder="e.g., Apple" />
                        </div>
                        <div>
                          <Label>Model</Label>
                          <Input placeholder="e.g., MacBook Pro M2" />
                        </div>
                        <div>
                          <Label>Serial Number</Label>
                          <Input placeholder="Device serial number" />
                        </div>
                        <div>
                          <Label>Purchase Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Warranty Expiry</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Value (AED)</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input placeholder="e.g., Dubai Office" />
                        </div>
                        <div className="col-span-2">
                          <Label>Specifications</Label>
                          <Textarea placeholder="Detailed specifications and features..." />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Add Asset</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="laptop">Laptops</SelectItem>
                      <SelectItem value="desktop">Desktops</SelectItem>
                      <SelectItem value="monitor">Monitors</SelectItem>
                      <SelectItem value="phone">Phones</SelectItem>
                      <SelectItem value="printer">Printers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  {assets
                    .filter((asset) => {
                      const matchesSearch =
                        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase())
                      const matchesStatus = filterStatus === "all" || asset.status === filterStatus
                      const matchesCategory = filterCategory === "all" || asset.category === filterCategory
                      return matchesSearch && matchesStatus && matchesCategory
                    })
                    .map((asset) => (
                      <Card key={asset.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="p-3 bg-gray-100 rounded-lg">{getCategoryIcon(asset.category)}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">{asset.name}</h3>
                                  <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                                  <Badge className={getConditionColor(asset.condition)}>{asset.condition}</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Asset Tag:</span>
                                    <p>{asset.assetTag}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Brand/Model:</span>
                                    <p>
                                      {asset.brand} {asset.model}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Serial Number:</span>
                                    <p>{asset.serialNumber}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Value:</span>
                                    <p>AED {asset.value.toLocaleString()}</p>
                                  </div>
                                </div>
                                {asset.assignedTo && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                    <span className="font-medium">Assigned to:</span> {asset.assignedTo} on{" "}
                                    {asset.assignedDate}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedAsset(asset)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {asset.status === "available" && (
                                <Button size="sm">
                                  <User className="h-4 w-4 mr-2" />
                                  Assign
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Assignments</CardTitle>
                <CardDescription>Track asset assignments and returns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Signed Document</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => {
                      const asset = assets.find((a) => a.id === assignment.assetId)
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded">
                                {getCategoryIcon(asset?.category || "other")}
                              </div>
                              <div>
                                <p className="font-medium">{asset?.name}</p>
                                <p className="text-sm text-gray-500">{asset?.assetTag}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{assignment.employeeName}</p>
                              <p className="text-sm text-gray-500">ID: {assignment.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{assignment.assignedDate}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(assignment.status)}>{assignment.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getConditionColor(assignment.condition)}>{assignment.condition}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{assignment.signedDocument}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {assignment.status === "active" && (
                                <Button size="sm" variant="outline">
                                  Return Asset
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Document Management</CardTitle>
                    <CardDescription>Manage contracts, policies, and signed documents</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upload New Document</DialogTitle>
                        <DialogDescription>Add a new document to the system</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Document Name</Label>
                          <Input placeholder="e.g., Asset Assignment Agreement" />
                        </div>
                        <div>
                          <Label>Document Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="policy">Policy</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="certificate">Certificate</SelectItem>
                              <SelectItem value="agreement">Agreement</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input placeholder="e.g., IT Assets" />
                        </div>
                        <div>
                          <Label>Access Level</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="restricted">Restricted</SelectItem>
                              <SelectItem value="confidential">Confidential</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Expiry Date (Optional)</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Version</Label>
                          <Input placeholder="e.g., 1.0" />
                        </div>
                        <div className="col-span-2">
                          <Label>File Upload</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Upload Document</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((document) => (
                    <Card key={document.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{document.name}</h3>
                                <Badge className={getStatusColor(document.status)}>{document.status}</Badge>
                                <Badge variant="outline">{document.type}</Badge>
                                {document.signatureRequired && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    Signature Required
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Category:</span>
                                  <p>{document.category}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Upload Date:</span>
                                  <p>{document.uploadDate}</p>
                                </div>
                                <div>
                                  <span className="font-medium">File Size:</span>
                                  <p>{document.fileSize}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Version:</span>
                                  <p>{document.version}</p>
                                </div>
                              </div>
                              {document.signedBy && document.signedBy.length > 0 && (
                                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                                  <span className="font-medium">Signed by:</span> {document.signedBy.join(", ")} on{" "}
                                  {document.signedDate}
                                </div>
                              )}
                              {document.relatedAsset && (
                                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                  <span className="font-medium">Related Asset:</span> {document.relatedAsset}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedDocument(document)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            {document.signatureRequired && !document.signedBy && (
                              <Button size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Sign
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Utilization</CardTitle>
                  <CardDescription>Asset usage and availability statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Laptops</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <span className="text-sm">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Monitors</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                        <span className="text-sm">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Phones</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                        <span className="text-sm">40%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Printers</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                        <span className="text-sm">90%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Warranty Status</CardTitle>
                  <CardDescription>Assets warranty expiration tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Expiring in 30 days</span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">2 assets</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Expiring in 90 days</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">5 assets</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Valid warranty</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">15 assets</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create detailed reports for assets and documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <FileText className="h-6 w-6 mb-2" />
                    Asset Inventory Report
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <User className="h-6 w-6 mb-2" />
                    Assignment Report
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Calendar className="h-6 w-6 mb-2" />
                    Warranty Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Asset Detail Modal */}
        {selectedAsset && (
          <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedAsset.name}</DialogTitle>
                <DialogDescription>Asset Tag: {selectedAsset.assetTag}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Asset Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Brand:</span>
                        <span>{selectedAsset.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span>{selectedAsset.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Serial Number:</span>
                        <span>{selectedAsset.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="capitalize">{selectedAsset.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedAsset.status)}>{selectedAsset.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Condition:</span>
                        <Badge className={getConditionColor(selectedAsset.condition)}>{selectedAsset.condition}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Purchase & Warranty</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Purchase Date:</span>
                        <span>{selectedAsset.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Warranty Expiry:</span>
                        <span>{selectedAsset.warrantyExpiry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span>AED {selectedAsset.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{selectedAsset.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Specifications</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedAsset.specifications}</p>
                  </div>
                </div>

                {selectedAsset.assignedTo && (
                  <div>
                    <h4 className="font-medium mb-3">Current Assignment</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Assigned to:</span>
                          <p>{selectedAsset.assignedTo}</p>
                        </div>
                        <div>
                          <span className="font-medium">Assignment Date:</span>
                          <p>{selectedAsset.assignedDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAsset.notes && (
                  <div>
                    <h4 className="font-medium mb-3">Notes</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">{selectedAsset.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Asset
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  {selectedAsset.status === "available" && (
                    <Button>
                      <User className="h-4 w-4 mr-2" />
                      Assign Asset
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
