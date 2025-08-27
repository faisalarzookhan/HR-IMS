"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"
import { PenTool, Type, X, Check } from "lucide-react"

interface SignatureProps {
  documentId: string
  documentName: string
  onSignatureComplete: (signature: SignatureData) => void
  onCancel: () => void
}

interface SignatureData {
  type: "drawn" | "typed"
  data: string
  timestamp: string
  signer: string
  position: { x: number; y: number }
}

export default function DigitalSignature({ documentId, documentName, onSignatureComplete, onCancel }: SignatureProps) {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureType, setSignatureType] = useState<"drawn" | "typed">("drawn")
  const [typedSignature, setTypedSignature] = useState("")
  const [signatureReason, setSignatureReason] = useState("")
  const [signatureLocation, setSignatureLocation] = useState("")

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
      }
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setTypedSignature("")
  }

  const saveSignature = () => {
    let signatureData: string

    if (signatureType === "drawn") {
      const canvas = canvasRef.current
      if (canvas) {
        signatureData = canvas.toDataURL()
      } else {
        return
      }
    } else {
      signatureData = typedSignature
    }

    const signature: SignatureData = {
      type: signatureType,
      data: signatureData,
      timestamp: new Date().toISOString(),
      signer: user?.name || "Unknown",
      position: { x: 100, y: 100 }, // Default position
    }

    onSignatureComplete(signature)
  }

  const isSignatureValid = () => {
    if (signatureType === "drawn") {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          return imageData.data.some((channel) => channel !== 0)
        }
      }
      return false
    } else {
      return typedSignature.trim().length > 0
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Digital Signature</CardTitle>
              <CardDescription>Sign: {documentName}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signature Type Selection */}
          <div className="flex space-x-4">
            <Button
              variant={signatureType === "drawn" ? "default" : "outline"}
              onClick={() => setSignatureType("drawn")}
              className="flex-1"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Draw Signature
            </Button>
            <Button
              variant={signatureType === "typed" ? "default" : "outline"}
              onClick={() => setSignatureType("typed")}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-2" />
              Type Signature
            </Button>
          </div>

          {/* Signature Input Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {signatureType === "drawn" ? (
              <div className="space-y-4">
                <Label>Draw your signature below:</Label>
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="border border-gray-300 rounded cursor-crosshair w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex justify-center">
                  <Button variant="outline" size="sm" onClick={clearSignature}>
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="typedSignature">Type your full name:</Label>
                <Input
                  id="typedSignature"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Enter your full name"
                  className="text-2xl font-script text-center"
                  style={{ fontFamily: "cursive" }}
                />
                {typedSignature && (
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <p className="text-3xl font-script" style={{ fontFamily: "cursive" }}>
                      {typedSignature}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signatureReason">Reason for signing (optional)</Label>
              <Input
                id="signatureReason"
                value={signatureReason}
                onChange={(e) => setSignatureReason(e.target.value)}
                placeholder="e.g., I agree to the terms"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signatureLocation">Location (optional)</Label>
              <Input
                id="signatureLocation"
                value={signatureLocation}
                onChange={(e) => setSignatureLocation(e.target.value)}
                placeholder="e.g., New York, NY"
              />
            </div>
          </div>

          {/* Signature Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Signature Details:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Signer:</span>
                <span className="ml-2 font-medium">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Document:</span>
                <span className="ml-2 font-medium">{documentName}</span>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Legal Notice:</strong> By signing this document electronically, you agree that your electronic
              signature is the legal equivalent of your manual signature and has the same legal effect as a handwritten
              signature.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={saveSignature} disabled={!isSignatureValid()} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Sign Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
