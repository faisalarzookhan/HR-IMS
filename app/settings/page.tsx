"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Users, Database, Bell, Mail, Globe, Server, Activity, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Mock system settings
const mockSystemSettings = {
  general: {
    companyName: "Limitless Infotech Solutions",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    language: "en",
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    weeklyReports: true,
    systemAlerts: true,
  },
  security: {
    passwordPolicy: "strong",
    sessionTimeout: 30,
    twoFactorRequired: false,
    ipWhitelist: false,
    auditLogging: true,
  },
  integrations: {
    emailService: "smtp",
    smsProvider: "twilio",
    backupService: "aws",
    analyticsEnabled: true,
  },
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState(mockSystemSettings)

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
    // Here you would save settings to your backend
    console.log(`Updated ${category}.${key} to:`, value)
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
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
                <p className="text-xs text-gray-500">Configure system-wide preferences</p>
              </div>
            </div>
            <Badge variant="secondary">Admin Only</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-2xl font-bold text-green-600">Healthy</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-blue-600">234</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Storage Used</p>
                  <p className="text-2xl font-bold text-orange-600">67%</p>
                </div>
                <Database className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                </div>
                <Server className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Basic company and system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={settings.general.companyName}
                      onChange={(e) => handleSettingChange("general", "companyName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => handleSettingChange("general", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select
                      value={settings.general.dateFormat}
                      onValueChange={(value) => handleSettingChange("general", "dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.general.currency}
                      onValueChange={(value) => handleSettingChange("general", "currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure how the system sends notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.emailEnabled}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "emailEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-green-600" />
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-600">Send browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.pushEnabled}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "pushEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.smsEnabled}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "smsEnabled", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automated Reports</CardTitle>
                <CardDescription>Configure automatic report generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-gray-600">Generate and send weekly summary reports</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "weeklyReports", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Alerts</Label>
                    <p className="text-sm text-gray-600">Send alerts for system issues</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "systemAlerts", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Authentication</CardTitle>
                <CardDescription>Configure security policies and authentication requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <Select
                      value={settings.security.passwordPolicy}
                      onValueChange={(value) => handleSettingChange("security", "passwordPolicy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                        <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                        <SelectItem value="complex">Complex (12+ chars, symbols required)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Force all users to enable 2FA</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorRequired}
                      onCheckedChange={(checked) => handleSettingChange("security", "twoFactorRequired", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch
                      checked={settings.security.ipWhitelist}
                      onCheckedChange={(checked) => handleSettingChange("security", "ipWhitelist", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-gray-600">Log all user actions for security audits</p>
                    </div>
                    <Switch
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) => handleSettingChange("security", "auditLogging", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>External Services</CardTitle>
                <CardDescription>Configure integrations with external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-service">Email Service</Label>
                    <Select
                      value={settings.integrations.emailService}
                      onValueChange={(value) => handleSettingChange("integrations", "emailService", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sms-provider">SMS Provider</Label>
                    <Select
                      value={settings.integrations.smsProvider}
                      onValueChange={(value) => handleSettingChange("integrations", "smsProvider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="nexmo">Nexmo</SelectItem>
                        <SelectItem value="aws-sns">AWS SNS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-service">Backup Service</Label>
                    <Select
                      value={settings.integrations.backupService}
                      onValueChange={(value) => handleSettingChange("integrations", "backupService", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">Amazon S3</SelectItem>
                        <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                        <SelectItem value="azure">Azure Blob Storage</SelectItem>
                        <SelectItem value="local">Local Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics Tracking</Label>
                    <p className="text-sm text-gray-600">Enable usage analytics and reporting</p>
                  </div>
                  <Switch
                    checked={settings.integrations.analyticsEnabled}
                    onCheckedChange={(checked) => handleSettingChange("integrations", "analyticsEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>Manage system maintenance and cleanup tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Database className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium">Database Cleanup</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Remove old logs and temporary data</p>
                    <Button variant="outline" size="sm">
                      Run Cleanup
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Server className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium">System Backup</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Create a full system backup</p>
                    <Button variant="outline" size="sm">
                      Start Backup
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Activity className="w-5 h-5 text-orange-600" />
                      <h4 className="font-medium">Performance Check</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Analyze system performance</p>
                    <Button variant="outline" size="sm">
                      Run Analysis
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-medium">System Restart</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Restart system services</p>
                    <Button variant="destructive" size="sm">
                      Restart System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
