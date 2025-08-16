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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Target, Users, Calendar, FileText, Plus, Search, Eye, Edit, Award, MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface Employee {
  id: string
  empCode: string
  name: string
  designation: string
  department: string
  manager: string
  joiningDate: string
  avatar: string
}

interface Evaluation {
  id: string
  employeeId: string
  evaluatorId: string
  period: string
  year: number
  type: "annual" | "mid-year" | "quarterly" | "probation"
  status: "draft" | "submitted" | "reviewed" | "completed"
  overallRating: number
  categories: {
    technical: number
    communication: number
    teamwork: number
    leadership: number
    initiative: number
    reliability: number
  }
  goals: Goal[]
  feedback: string
  recommendations: string
  createdDate: string
  dueDate: string
}

interface Goal {
  id: string
  title: string
  description: string
  category: "performance" | "development" | "behavioral"
  priority: "high" | "medium" | "low"
  status: "not-started" | "in-progress" | "completed" | "overdue"
  progress: number
  targetDate: string
  completedDate?: string
  comments: string
}

interface FeedbackItem {
  id: string
  evaluationId: string
  fromId: string
  fromName: string
  fromRole: string
  category: string
  rating: number
  comments: string
  isAnonymous: boolean
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    empCode: "LIS-ENG-001",
    name: "Ahmed Al-Rashid",
    designation: "Senior Software Engineer",
    department: "Engineering",
    manager: "David Wilson",
    joiningDate: "2022-03-15",
    avatar: "/professional-man.png",
  },
  {
    id: "2",
    empCode: "LIS-HR-001",
    name: "Fatima Al-Zahra",
    designation: "HR Manager",
    department: "Human Resources",
    manager: "Sarah Johnson",
    joiningDate: "2021-08-10",
    avatar: "/professional-woman-diverse.png",
  },
]

const mockEvaluations: Evaluation[] = [
  {
    id: "1",
    employeeId: "1",
    evaluatorId: "manager1",
    period: "Annual Review",
    year: 2024,
    type: "annual",
    status: "completed",
    overallRating: 4.2,
    categories: {
      technical: 4.5,
      communication: 4.0,
      teamwork: 4.2,
      leadership: 3.8,
      initiative: 4.3,
      reliability: 4.4,
    },
    goals: [
      {
        id: "g1",
        title: "Complete React Advanced Certification",
        description: "Obtain advanced React certification to improve frontend development skills",
        category: "development",
        priority: "high",
        status: "completed",
        progress: 100,
        targetDate: "2024-06-30",
        completedDate: "2024-06-15",
        comments: "Successfully completed with distinction",
      },
      {
        id: "g2",
        title: "Lead Mobile App Project",
        description: "Take leadership role in the new mobile application development",
        category: "performance",
        priority: "high",
        status: "in-progress",
        progress: 75,
        targetDate: "2024-12-31",
        comments: "Project is on track, good progress made",
      },
    ],
    feedback:
      "Ahmed has shown excellent technical skills and leadership potential. His contribution to the team has been outstanding.",
    recommendations: "Consider for senior technical lead position. Recommend advanced leadership training.",
    createdDate: "2024-01-15",
    dueDate: "2024-02-15",
  },
]

const mockFeedback: FeedbackItem[] = [
  {
    id: "1",
    evaluationId: "1",
    fromId: "peer1",
    fromName: "Sarah Chen",
    fromRole: "Senior Developer",
    category: "Teamwork",
    rating: 4,
    comments: "Ahmed is always willing to help team members and shares knowledge effectively.",
    isAnonymous: false,
  },
  {
    id: "2",
    evaluationId: "1",
    fromId: "peer2",
    fromName: "Anonymous",
    fromRole: "Team Member",
    category: "Communication",
    rating: 4,
    comments: "Clear communicator, explains complex concepts well during meetings.",
    isAnonymous: true,
  },
]

export default function EvaluationPage() {
  const { t, language } = useLanguage()
  const [employees] = useState<Employee[]>(mockEmployees)
  const [evaluations] = useState<Evaluation[]>(mockEvaluations)
  const [feedback] = useState<FeedbackItem[]>(mockFeedback)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "not-started":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const averageRating = evaluations.reduce((sum, evaluation) => sum + evaluation.overallRating, 0) / evaluations.length
  const completedEvaluations = evaluations.filter((evaluation) => evaluation.status === "completed").length
  const pendingEvaluations = evaluations.filter((evaluation) => evaluation.status !== "completed").length

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Evaluation & Performance</h1>
          <p className="text-gray-600">Comprehensive performance management and evaluation system</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5.0</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Reviews</p>
                  <p className="text-2xl font-bold">{completedEvaluations}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold">{pendingEvaluations}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
            <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
            <TabsTrigger value="feedback">360° Feedback</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {employees.map((employee) => {
                const employeeEvaluations = evaluations.filter((evaluation) => evaluation.employeeId === employee.id)
                const latestEvaluation = employeeEvaluations[0]
                const completedGoals = latestEvaluation?.goals.filter((goal) => goal.status === "completed").length || 0
                const totalGoals = latestEvaluation?.goals.length || 0

                return (
                  <Card key={employee.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <img
                            src={employee.avatar || "/placeholder.svg"}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <CardTitle className="text-xl">{employee.name}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span>{employee.designation}</span>
                              <span>•</span>
                              <span>{employee.department}</span>
                              <span>•</span>
                              <span>{employee.empCode}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          {latestEvaluation && (
                            <div className="flex items-center gap-2">
                              <div className="flex">{getRatingStars(latestEvaluation.overallRating)}</div>
                              <span className="text-sm font-medium">{latestEvaluation.overallRating}/5.0</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Latest Evaluation</h4>
                          {latestEvaluation ? (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Period:</span>
                                <span>
                                  {latestEvaluation.period} {latestEvaluation.year}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <Badge className={getStatusColor(latestEvaluation.status)}>
                                  {latestEvaluation.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Due Date:</span>
                                <span>{latestEvaluation.dueDate}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No evaluations yet</p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Goals Progress</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completed Goals:</span>
                              <span>
                                {completedGoals}/{totalGoals}
                              </span>
                            </div>
                            <Progress
                              value={totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500">
                              {totalGoals > 0
                                ? `${Math.round((completedGoals / totalGoals) * 100)}% complete`
                                : "No goals set"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Performance Categories</h4>
                          {latestEvaluation ? (
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Technical:</span>
                                <span>{latestEvaluation.categories.technical}/5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Communication:</span>
                                <span>{latestEvaluation.categories.communication}/5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Teamwork:</span>
                                <span>{latestEvaluation.categories.teamwork}/5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Leadership:</span>
                                <span>{latestEvaluation.categories.leadership}/5</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No ratings available</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedEmployee(employee)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          New Evaluation
                        </Button>
                        <Button size="sm" variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          Set Goals
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="evaluations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Performance Evaluations</CardTitle>
                    <CardDescription>Manage and review employee performance evaluations</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Evaluation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Evaluation</DialogTitle>
                        <DialogDescription>Start a new performance evaluation for an employee</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Employee</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((emp) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name} - {emp.empCode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Evaluation Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="annual">Annual Review</SelectItem>
                              <SelectItem value="mid-year">Mid-Year Review</SelectItem>
                              <SelectItem value="quarterly">Quarterly Review</SelectItem>
                              <SelectItem value="probation">Probation Review</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Review Period</Label>
                          <Input placeholder="e.g., Q1 2024" />
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create Evaluation</Button>
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
                      placeholder="Search evaluations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Overall Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation) => {
                      const employee = employees.find((emp) => emp.id === evaluation.employeeId)
                      return (
                        <TableRow key={evaluation.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={employee?.avatar || "/placeholder.svg"}
                                alt={employee?.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">{employee?.name}</p>
                                <p className="text-sm text-gray-500">{employee?.empCode}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {evaluation.period} {evaluation.year}
                          </TableCell>
                          <TableCell className="capitalize">{evaluation.type}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex">{getRatingStars(evaluation.overallRating)}</div>
                              <span className="text-sm">{evaluation.overallRating}/5</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(evaluation.status)}>{evaluation.status}</Badge>
                          </TableCell>
                          <TableCell>{evaluation.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedEvaluation(evaluation)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
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

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Goals & Objectives</CardTitle>
                <CardDescription>Track employee goals and performance objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {evaluations.flatMap((evaluation) =>
                    evaluation.goals.map((goal) => {
                      const employee = employees.find((emp) => emp.id === evaluation.employeeId)
                      return (
                        <div key={goal.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{goal.title}</h4>
                              <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{employee?.name}</span>
                                <span>•</span>
                                <span>{employee?.empCode}</span>
                                <span>•</span>
                                <span>Due: {goal.targetDate}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                              <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>

                            {goal.comments && (
                              <div className="bg-gray-50 p-3 rounded text-sm">
                                <span className="font-medium">Comments: </span>
                                {goal.comments}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Update Progress
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    }),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>360° Feedback</CardTitle>
                <CardDescription>Collect feedback from peers, managers, and subordinates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{item.category}</h4>
                          <p className="text-sm text-gray-600">
                            From: {item.fromName} ({item.fromRole})
                            {item.isAnonymous && (
                              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">Anonymous</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">{getRatingStars(item.rating)}</div>
                          <span className="text-sm">{item.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{item.comments}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Overall performance metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Technical Skills</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-24 h-2" />
                        <span className="text-sm">4.2/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Communication</span>
                      <div className="flex items-center gap-2">
                        <Progress value={80} className="w-24 h-2" />
                        <span className="text-sm">4.0/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Teamwork</span>
                      <div className="flex items-center gap-2">
                        <Progress value={84} className="w-24 h-2" />
                        <span className="text-sm">4.2/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Leadership</span>
                      <div className="flex items-center gap-2">
                        <Progress value={76} className="w-24 h-2" />
                        <span className="text-sm">3.8/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Average ratings by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Engineering</span>
                      <div className="flex items-center gap-2">
                        <Progress value={84} className="w-24 h-2" />
                        <span className="text-sm">4.2/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Human Resources</span>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="w-24 h-2" />
                        <span className="text-sm">4.4/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Marketing</span>
                      <div className="flex items-center gap-2">
                        <Progress value={82} className="w-24 h-2" />
                        <span className="text-sm">4.1/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Finance</span>
                      <div className="flex items-center gap-2">
                        <Progress value={86} className="w-24 h-2" />
                        <span className="text-sm">4.3/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Evaluation Detail Modal */}
        {selectedEvaluation && (
          <Dialog open={!!selectedEvaluation} onOpenChange={() => setSelectedEvaluation(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Performance Evaluation - {employees.find((emp) => emp.id === selectedEvaluation.employeeId)?.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedEvaluation.period} {selectedEvaluation.year} • Overall Rating:{" "}
                  {selectedEvaluation.overallRating}/5.0
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Performance Categories</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedEvaluation.categories).map(([category, rating]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="capitalize">{category}:</span>
                          <div className="flex items-center gap-2">
                            <div className="flex">{getRatingStars(rating)}</div>
                            <span className="text-sm">{rating}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Goals Progress</h4>
                    <div className="space-y-3">
                      {selectedEvaluation.goals.map((goal) => (
                        <div key={goal.id} className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{goal.title}</span>
                            <Badge className={getStatusColor(goal.status)} size="sm">
                              {goal.status}
                            </Badge>
                          </div>
                          <Progress value={goal.progress} className="h-1" />
                          <p className="text-xs text-gray-500 mt-1">{goal.progress}% complete</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Manager Feedback</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedEvaluation.feedback}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedEvaluation.recommendations}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Evaluation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
