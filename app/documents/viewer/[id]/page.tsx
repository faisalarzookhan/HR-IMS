"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import DigitalSignature from "@/components/DigitalSignature"
import { useAuth } from "@/contexts/AuthContext"
import {
  Download,
  Share,
  Printer as Print,
  Edit,
  PenTool,
  Eye,
  Clock,
  CheckCircle2,
  Users,
  FileText,
  ArrowLeft,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"

interface SignatureData {
  type: "drawn" | "typed"
  data: string
  timestamp: string
  signer: string
  position: { x: number; y: number }
}

export default function DocumentViewer({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [documentSigned, setDocumentSigned] = useState(false)

  // Mock document data - in real app, fetch based on params.id
  const document = {
    id: params.id,
    name: "Employment Contract - John Doe",
    type: "pdf",
    size: "1.2 MB",
    category: "Contract",
    uploadedBy: { name: "Jane Smith", avatar: "/placeholder.svg", role: "HR Specialist" },
    uploadDate: "2024-01-14T14:30:00Z",
    lastModified: "2024-01-14T16:45:00Z",
    status: documentSigned ? "signed" : "pending",
    version: "v1.0",
    signatures: [
      {
        signer: "John Doe",
        signedAt: documentSigned ? new Date().toISOString() : "",
        status: documentSigned ? "signed" : "pending",
      },
      { signer: "HR Manager", signedAt: "2024-01-14T16:30:00Z", status: "signed" },
    ],
    permissions: { view: ["hr", "john.doe"], edit: ["hr"], sign: ["john.doe", "hr.manager"] },
    tags: ["contract", "employment", "john-doe"],
    description: "Employment contract for new software engineer",
    content: `
      EMPLOYMENT AGREEMENT
      
      This Employment Agreement ("Agreement") is entered into on January 14, 2024, between Limitless Infotech Solutions ("Company") and John Doe ("Employee").
      
      1. POSITION AND DUTIES
      Employee will serve as Software Engineer and will perform duties as assigned by the Company.
      
      2. COMPENSATION
      Employee will receive an annual salary of $75,000, payable in accordance with Company's standard payroll practices.
      
      3. BENEFITS
      Employee will be eligible for Company's standard benefits package including health insurance, retirement plan, and paid time off.
      
      4. TERM
      This agreement shall commence on February 1, 2024, and continue until terminated by either party.
      
      5. CONFIDENTIALITY
      Employee agrees to maintain confidentiality of all Company proprietary information.
      
      By signing below, both parties agree to the terms and conditions set forth in this Agreement.
    `,
  }

  const handleSignatureComplete = (signature: SignatureData) => {
    console.log("Signature completed:", signature)
    setDocumentSigned(true)
    setShowSignatureModal(false)
    // In real app, save signature to backend
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canUserSign = () => {
    return document.signatures.some((sig) => sig.signer === user?.name && sig.status === "pending")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/documents">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documents
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{document.name}</h1>
              <p className="text-gray-600 mt-1">{document.description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Print className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Document Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <CardTitle>{document.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{document.category}</Badge>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status === "signed" ? (
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                          ) : (
                            <Clock className="w-4 h-4 mr-1" />
                          )}
                          {document.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{document.version}</span>
                      </div>
                    </div>
                  </div>
                  {canUserSign() && !documentSigned && (
                    <Button onClick={() => setShowSignatureModal(true)}>
                      <PenTool className="w-4 h-4 mr-2" />
                      Sign Document
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Document Preview */}
                <div className="bg-white border rounded-lg p-8 min-h-[600px] shadow-inner">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{document.content}</pre>
                  </div>

                  {/* Signature Area */}
                  {document.signatures && (
                    <div className="mt-12 pt-8 border-t">
                      <h3 className="text-lg font-semibold mb-6">Signatures</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {document.signatures.map((signature, index) => (
                          <div key={index} className="space-y-2">
                            <div className="border-b-2 border-gray-300 pb-2 min-h-[60px] flex items-end">
                              {signature.status === "signed" ? (
                                <div className="text-2xl font-script text-blue-600" style={{ fontFamily: "cursive" }}>
                                  {signature.signer}
                                </div>
                              ) : (
                                <div className="text-gray-400 italic">Pending signature</div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">{signature.signer}</p>
                              {signature.signedAt && <p>Signed: {new Date(signature.signedAt).toLocaleString()}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={document.uploadedBy.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {document.uploadedBy.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{document.uploadedBy.name}</p>
                    <p className="text-sm text-gray-500">{document.uploadedBy.role}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span>{document.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="uppercase">{document.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modified:</span>
                    <span>{new Date(document.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tags:</h4>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signature Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Signature Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {document.signatures?.map((signature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{signature.signer}</p>
                      {signature.signedAt && (
                        <p className="text-xs text-gray-500">{new Date(signature.signedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                    <Badge
                      className={
                        signature.status === "signed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {signature.status === "signed" ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {signature.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  View History
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Properties
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Share className="w-4 h-4 mr-2" />
                  Share Document
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Digital Signature Modal */}
        {showSignatureModal && (
          <DigitalSignature
            documentId={document.id}
            documentName={document.name}
            onSignatureComplete={handleSignatureComplete}
            onCancel={() => setShowSignatureModal(false)}
          />
        )}
      </main>
    </div>
  )
}
