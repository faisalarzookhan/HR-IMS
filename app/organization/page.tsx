"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RouteGuard, AccessControl } from "@/components/AccessControl"
import OrganizationalChart from "@/components/OrganizationalChart"
import RealTimeMetricsDashboard from "@/components/RealTimeMetricsDashboard"
import { useOrganization } from "@/components/OrganizationProvider"
import { Building2, ArrowLeft, RefreshCw, BarChart3, Users, Activity } from "lucide-react"
import Link from "next/link"

function OrganizationPageContent() {
  const { refreshData, isLoading } = useOrganization()

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
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Organization Management</h1>
                <p className="text-xs text-gray-500">Real-time organizational insights and structure</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Data</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Real-time Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Org Structure</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <RealTimeMetricsDashboard />
          </TabsContent>

          <TabsContent value="structure">
            <OrganizationalChart />
          </TabsContent>

          <TabsContent value="analytics">
            <AccessControl requiredPermission={["all", "hr"]}>
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>Comprehensive organizational analytics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Advanced Analytics Coming Soon</p>
                    <p>
                      Detailed performance analytics, predictive insights, and custom reports will be available here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AccessControl>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function OrganizationPage() {
  return (
    <RouteGuard requiredPermission={["all", "hr", "employees"]}>
      <OrganizationPageContent />
    </RouteGuard>
  )
}
