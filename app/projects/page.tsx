"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/AccessControl"
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  Play,
  Square,
  Clock,
  Target,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Timer,
  BarChart3,
  Folder,
} from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
  team: {
    id: string
    name: string
    avatar?: string
    role: string
  }[]
  tasks: {
    id: string
    title: string
    status: "todo" | "in-progress" | "completed"
    assignee: string
    dueDate: string
    timeSpent: number
    estimatedTime: number
  }[]
  timeTracked: number
  client?: string
}

interface TimeEntry {
  id: string
  projectId: string
  taskId?: string
  userId: string
  description: string
  startTime: string
  endTime?: string
  duration: number
  date: string
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerStart, setTimerStart] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "HR Management System v2.0",
      description: "Complete overhaul of the HR management system with new features",
      status: "active",
      priority: "high",
      progress: 75,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      budget: 50000,
      spent: 37500,
      team: [
        { id: "1", name: "John Doe", avatar: "/placeholder.svg", role: "Lead Developer" },
        { id: "2", name: "Jane Smith", avatar: "/placeholder.svg", role: "UI/UX Designer" },
        { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg", role: "Backend Developer" },
      ],
      tasks: [
        {
          id: "1",
          title: "User Authentication System",
          status: "completed",
          assignee: "John Doe",
          dueDate: "2024-01-15",
          timeSpent: 40,
          estimatedTime: 35,
        },
        {
          id: "2",
          title: "Employee Dashboard",
          status: "in-progress",
          assignee: "Jane Smith",
          dueDate: "2024-02-01",
          timeSpent: 25,
          estimatedTime: 30,
        },
        {
          id: "3",
          title: "Reporting Module",
          status: "todo",
          assignee: "Mike Johnson",
          dueDate: "2024-02-15",
          timeSpent: 0,
          estimatedTime: 45,
        },
      ],
      timeTracked: 320,
      client: "Internal",
    },
    {
      id: "2",
      name: "Client Portal Development",
      description: "Custom client portal for external stakeholders",
      status: "active",
      priority: "medium",
      progress: 45,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      budget: 30000,
      spent: 13500,
      team: [
        { id: "4", name: "Sarah Wilson", avatar: "/placeholder.svg", role: "Full Stack Developer" },
        { id: "5", name: "Tom Brown", avatar: "/placeholder.svg", role: "QA Engineer" },
      ],
      tasks: [
        {
          id: "4",
          title: "Portal Architecture",
          status: "completed",
          assignee: "Sarah Wilson",
          dueDate: "2024-01-30",
          timeSpent: 32,
          estimatedTime: 30,
        },
        {
          id: "5",
          title: "User Interface Design",
          status: "in-progress",
          assignee: "Sarah Wilson",
          dueDate: "2024-02-10",
          timeSpent: 18,
          estimatedTime: 25,
        },
      ],
      timeTracked: 180,
      client: "ABC Corporation",
    },
    {
      id: "3",
      name: "Mobile App Development",
      description: "Native mobile application for iOS and Android",
      status: "on-hold",
      priority: "low",
      progress: 20,
      startDate: "2024-02-01",
      endDate: "2024-06-01",
      budget: 75000,
      spent: 15000,
      team: [
        { id: "6", name: "Alex Chen", avatar: "/placeholder.svg", role: "Mobile Developer" },
        { id: "7", name: "Lisa Wang", avatar: "/placeholder.svg", role: "Mobile Developer" },
      ],
      tasks: [
        {
          id: "6",
          title: "App Architecture Planning",
          status: "completed",
          assignee: "Alex Chen",
          dueDate: "2024-02-05",
          timeSpent: 16,
          estimatedTime: 15,
        },
        {
          id: "7",
          title: "UI Component Library",
          status: "todo",
          assignee: "Lisa Wang",
          dueDate: "2024-02-20",
          timeSpent: 0,
          estimatedTime: 40,
        },
      ],
      timeTracked: 85,
      client: "Internal",
    },
  ])

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      projectId: "1",
      taskId: "1",
      userId: user?.id || "1",
      description: "Working on authentication logic",
      startTime: "2024-01-15T09:00:00Z",
      endTime: "2024-01-15T12:00:00Z",
      duration: 180,
      date: "2024-01-15",
    },
    {
      id: "2",
      projectId: "1",
      taskId: "2",
      userId: user?.id || "1",
      description: "Dashboard UI improvements",
      startTime: "2024-01-15T13:00:00Z",
      endTime: "2024-01-15T17:00:00Z",
      duration: 240,
      date: "2024-01-15",
    },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeTimer && timerStart) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - timerStart.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer, timerStart])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "todo":
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const startTimer = (projectId: string, taskId?: string) => {
    setActiveTimer(projectId)
    setTimerStart(new Date())
    setElapsedTime(0)
  }

  const stopTimer = () => {
    if (activeTimer && timerStart) {
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - timerStart.getTime()) / 1000)

      const newTimeEntry: TimeEntry = {
        id: Date.now().toString(),
        projectId: activeTimer,
        userId: user?.id || "current-user",
        description: "Time tracking session",
        startTime: timerStart.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        date: new Date().toISOString().split("T")[0],
      }

      setTimeEntries((prev) => [...prev, newTimeEntry])
    }

    setActiveTimer(null)
    setTimerStart(null)
    setElapsedTime(0)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const totalActiveProjects = projects.filter((p) => p.status === "active").length
  const totalTimeTracked = projects.reduce((sum, p) => sum + p.timeTracked, 0)
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)

  return (
    <ProtectedRoute requiredPermissions={["projects", "all"]}>
      <div className="min-h-screen bg-gray-50 pb-24">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="text-gray-600 mt-1">Track time, manage projects, and monitor progress</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              {activeTimer ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-lg">
                    <Timer className="w-4 h-4 text-green-600" />
                    <span className="font-mono text-green-600">{formatTime(elapsedTime)}</span>
                  </div>
                  <Button variant="outline" onClick={stopTimer}>
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              ) : (
                <Button variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              )}
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-3xl font-bold text-gray-900">{totalActiveProjects}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time Tracked</p>
                    <p className="text-3xl font-bold text-gray-900">{formatDuration(totalTimeTracked)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-3xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget Used</p>
                    <p className="text-3xl font-bold text-gray-900">{((totalSpent / totalBudget) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="timesheet">Time Tracking</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                            <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                          </div>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          {activeTimer === project.id ? (
                            <Button variant="outline" size="sm" onClick={stopTimer}>
                              <Square className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => startTimer(project.id)}>
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      {/* Team */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Team Members:</h4>
                        <div className="flex -space-x-2">
                          {project.team.map((member) => (
                            <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>

                      {/* Tasks Summary */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Recent Tasks:</h4>
                        <div className="space-y-1">
                          {project.tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                {getTaskStatusIcon(task.status)}
                                <span className="truncate">{task.title}</span>
                              </div>
                              <span className="text-gray-500">{formatDuration(task.timeSpent)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Project Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{formatDuration(project.timeTracked)}</p>
                          <p className="text-xs text-gray-500">Time Tracked</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">${project.spent.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Spent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(project.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">Due Date</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timesheet" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Time Entries</CardTitle>
                      <CardDescription>Recent time tracking entries</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {timeEntries.map((entry) => {
                          const project = projects.find((p) => p.id === entry.projectId)
                          return (
                            <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium">{project?.name}</h4>
                                  <Badge variant="outline">{formatDuration(entry.duration / 60)}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">{entry.description}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(entry.startTime).toLocaleDateString()} •{" "}
                                  {new Date(entry.startTime).toLocaleTimeString()} -{" "}
                                  {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : "Running"}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {formatTime(
                            timeEntries
                              .filter((entry) => entry.date === new Date().toISOString().split("T")[0])
                              .reduce((sum, entry) => sum + entry.duration, 0),
                          )}
                        </p>
                        <p className="text-sm text-gray-500">Total Time Today</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Projects worked on:</span>
                          <span>2</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tasks completed:</span>
                          <span>3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Productivity score:</span>
                          <span className="text-green-600">85%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start">
                        <Play className="w-4 h-4 mr-2" />
                        Start New Timer
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Manual Entry
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Reports
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Performance</CardTitle>
                    <CardDescription>Progress and budget utilization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects
                        .filter((p) => p.status === "active")
                        .map((project) => (
                          <div key={project.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{project.name}</span>
                              <span className="text-sm text-gray-500">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Budget: ${project.budget.toLocaleString()}</span>
                              <span>Spent: ${project.spent.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Productivity</CardTitle>
                    <CardDescription>Time tracking by team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "John Doe", hours: 42, projects: 2, efficiency: 95 },
                        { name: "Jane Smith", hours: 38, projects: 3, efficiency: 88 },
                        { name: "Mike Johnson", hours: 35, projects: 1, efficiency: 92 },
                        { name: "Sarah Wilson", hours: 40, projects: 2, efficiency: 90 },
                      ].map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.projects} projects</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{member.hours}h</p>
                            <p className="text-sm text-green-600">{member.efficiency}% efficiency</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
