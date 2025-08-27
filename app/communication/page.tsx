"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/AccessControl"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  Send,
  Search,
  Plus,
  Users,
  MessageCircle,
  Bell,
  Megaphone,
  Pin,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Settings,
  Hash,
  Lock,
} from "lucide-react"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  content: string
  timestamp: string
  type: "text" | "file" | "announcement"
  attachments?: { name: string; url: string }[]
  reactions?: { emoji: string; count: number; users: string[] }[]
}

interface Channel {
  id: string
  name: string
  description: string
  type: "public" | "private" | "direct"
  members: number
  unread: number
  lastMessage?: string
  lastActivity: string
}

export default function CommunicationPage() {
  const { user } = useAuth()
  const [selectedChannel, setSelectedChannel] = useState<string>("general")
  const [messageInput, setMessageInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const channels: Channel[] = [
    {
      id: "general",
      name: "General",
      description: "Company-wide discussions",
      type: "public",
      members: 45,
      unread: 3,
      lastMessage: "Welcome to the new communication platform!",
      lastActivity: "2 minutes ago",
    },
    {
      id: "hr-announcements",
      name: "HR Announcements",
      description: "Official HR communications",
      type: "public",
      members: 45,
      unread: 1,
      lastMessage: "New policy updates available",
      lastActivity: "1 hour ago",
    },
    {
      id: "engineering",
      name: "Engineering",
      description: "Engineering team discussions",
      type: "private",
      members: 12,
      unread: 0,
      lastMessage: "Code review completed",
      lastActivity: "3 hours ago",
    },
    {
      id: "sales",
      name: "Sales",
      description: "Sales team coordination",
      type: "private",
      members: 8,
      unread: 5,
      lastMessage: "Q1 targets discussion",
      lastActivity: "30 minutes ago",
    },
  ]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: { id: "admin", name: "HR Admin", avatar: "/placeholder.svg?height=32&width=32", role: "HR Manager" },
      content:
        "Welcome to our new internal communication platform! This will help us stay connected and collaborate more effectively.",
      timestamp: "2024-01-15T09:00:00Z",
      type: "announcement",
      reactions: [
        { emoji: "👍", count: 12, users: ["user1", "user2"] },
        { emoji: "🎉", count: 8, users: ["user3", "user4"] },
      ],
    },
    {
      id: "2",
      sender: {
        id: "john",
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Software Engineer",
      },
      content: "This looks great! Much better than our old system.",
      timestamp: "2024-01-15T09:15:00Z",
      type: "text",
    },
    {
      id: "3",
      sender: {
        id: "jane",
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Marketing Manager",
      },
      content: "I love the real-time features. Can we create department-specific channels?",
      timestamp: "2024-01-15T09:30:00Z",
      type: "text",
    },
    {
      id: "4",
      sender: { id: "admin", name: "HR Admin", avatar: "/placeholder.svg?height=32&width=32", role: "HR Manager" },
      content: "I'll set up department channels this afternoon. Also sharing the user guide document.",
      timestamp: "2024-01-15T09:45:00Z",
      type: "file",
      attachments: [{ name: "Communication_Platform_Guide.pdf", url: "#" }],
    },
  ])

  const [announcements] = useState([
    {
      id: "1",
      title: "New Communication Platform Launch",
      content:
        "We're excited to announce the launch of our new internal communication platform. This will replace our old email chains and provide better collaboration tools.",
      author: "HR Team",
      timestamp: "2024-01-15T08:00:00Z",
      priority: "high",
      department: "All",
    },
    {
      id: "2",
      title: "Quarterly All-Hands Meeting",
      content:
        "Join us for our Q1 all-hands meeting this Friday at 2 PM in the main conference room. We'll be discussing company goals and achievements.",
      author: "Management",
      timestamp: "2024-01-14T16:00:00Z",
      priority: "medium",
      department: "All",
    },
    {
      id: "3",
      title: "IT Maintenance Window",
      content:
        "Scheduled maintenance on our servers this weekend. Some services may be temporarily unavailable on Saturday from 2-4 AM.",
      author: "IT Team",
      timestamp: "2024-01-13T10:00:00Z",
      priority: "low",
      department: "All",
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: {
        id: user?.id || "current-user",
        name: user?.name || "Current User",
        avatar: user?.avatar,
        role: user?.role || "Employee",
      },
      content: messageInput,
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentChannel = channels.find((c) => c.id === selectedChannel)
  const filteredChannels = channels.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "public":
        return <Hash className="w-4 h-4" />
      case "private":
        return <Lock className="w-4 h-4" />
      case "direct":
        return <MessageCircle className="w-4 h-4" />
      default:
        return <Hash className="w-4 h-4" />
    }
  }

  return (
    <ProtectedRoute requiredPermissions={["communication", "all"]}>
      <div className="min-h-screen bg-gray-50 pb-24">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
              <p className="text-gray-600 mt-1">Stay connected with your team</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Channel
              </Button>
              <Button>
                <Megaphone className="w-4 h-4 mr-2" />
                Make Announcement
              </Button>
            </div>
          </div>

          <Tabs defaultValue="chat" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Team Chat</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                {/* Channels Sidebar */}
                <Card className="lg:col-span-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Channels</CardTitle>
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search channels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {filteredChannels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => setSelectedChannel(channel.id)}
                          className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                            selectedChannel === channel.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getChannelIcon(channel.type)}
                              <span className="font-medium">{channel.name}</span>
                            </div>
                            {channel.unread > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">{channel.unread}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">{channel.lastMessage}</p>
                          <p className="text-xs text-gray-400">{channel.lastActivity}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Area */}
                <Card className="lg:col-span-3 flex flex-col">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {currentChannel && getChannelIcon(currentChannel.type)}
                        <div>
                          <CardTitle className="text-lg">{currentChannel?.name}</CardTitle>
                          <CardDescription>
                            {currentChannel?.description} • {currentChannel?.members} members
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex space-x-3 ${
                          message.type === "announcement" ? "bg-blue-50 p-3 rounded-lg" : ""
                        }`}
                      >
                        <Avatar>
                          <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {message.sender.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{message.sender.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {message.sender.role}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            {message.type === "announcement" && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Megaphone className="w-3 h-3 mr-1" />
                                Announcement
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-900">{message.content}</p>

                          {message.attachments && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                                  <Paperclip className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {message.reactions && (
                            <div className="flex space-x-2 mt-2">
                              {message.reactions.map((reaction, index) => (
                                <button
                                  key={index}
                                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-xs">{reaction.count}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="resize-none"
                          rows={1}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CardTitle className="text-lg">{announcement.title}</CardTitle>
                              <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>By {announcement.author}</span>
                              <span>{new Date(announcement.timestamp).toLocaleDateString()}</span>
                              <span>Department: {announcement.department}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Pin className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-900">{announcement.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start">
                        <Megaphone className="w-4 h-4 mr-2" />
                        Create Announcement
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Recipients
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Bell className="w-4 h-4 mr-2" />
                        Notification Settings
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { action: "New announcement posted", time: "2 hours ago" },
                          { action: "Channel #engineering created", time: "1 day ago" },
                          { action: "User joined #sales", time: "2 days ago" },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
