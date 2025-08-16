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
import { Calendar, MapPin, Users, CheckCircle, XCircle, AlertCircle, Plus, Search, Filter } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface Position {
  id: string
  title: string
  department: string
  location: string
  country: string
  salary: string
  contractPeriod: string
  status: "open" | "closed" | "on-hold"
  applicants: number
  postedDate: string
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  location: string
  country: string
  currentRound: number
  status: "in-progress" | "selected" | "rejected"
  rounds: {
    round: number
    name: string
    interviewer: string
    date: string
    status: "pending" | "completed" | "scheduled"
    result: "pass" | "fail" | "pending"
    feedback: string
  }[]
  joiningDate?: string
  salary?: string
  empCode?: string
}

const mockPositions: Position[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Dubai",
    country: "UAE",
    salary: "AED 15,000 - 20,000",
    contractPeriod: "2 Years",
    status: "open",
    applicants: 24,
    postedDate: "2024-01-15",
  },
  {
    id: "2",
    title: "HR Manager",
    department: "Human Resources",
    location: "Riyadh",
    country: "Saudi Arabia",
    salary: "SAR 12,000 - 16,000",
    contractPeriod: "3 Years",
    status: "open",
    applicants: 18,
    postedDate: "2024-01-20",
  },
]

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Ahmed Al-Rashid",
    email: "ahmed.rashid@email.com",
    phone: "+971-50-123-4567",
    position: "Senior Software Engineer",
    location: "Dubai",
    country: "UAE",
    currentRound: 3,
    status: "in-progress",
    rounds: [
      {
        round: 1,
        name: "HR Screening",
        interviewer: "Sarah Johnson",
        date: "2024-01-22",
        status: "completed",
        result: "pass",
        feedback: "Strong communication skills and relevant experience",
      },
      {
        round: 2,
        name: "Technical Interview",
        interviewer: "Mike Chen",
        date: "2024-01-25",
        status: "completed",
        result: "pass",
        feedback: "Excellent technical knowledge in React and Node.js",
      },
      {
        round: 3,
        name: "Manager Interview",
        interviewer: "David Wilson",
        date: "2024-01-28",
        status: "scheduled",
        result: "pending",
        feedback: "",
      },
      {
        round: 4,
        name: "Final Interview",
        interviewer: "CEO",
        date: "",
        status: "pending",
        result: "pending",
        feedback: "",
      },
    ],
  },
  {
    id: "2",
    name: "Fatima Al-Zahra",
    email: "fatima.zahra@email.com",
    phone: "+966-55-987-6543",
    position: "HR Manager",
    location: "Riyadh",
    country: "Saudi Arabia",
    currentRound: 4,
    status: "selected",
    joiningDate: "2024-02-15",
    salary: "SAR 14,000",
    empCode: "LIS-HR-001",
    rounds: [
      {
        round: 1,
        name: "HR Screening",
        interviewer: "Sarah Johnson",
        date: "2024-01-18",
        status: "completed",
        result: "pass",
        feedback: "Impressive HR background with 8+ years experience",
      },
      {
        round: 2,
        name: "Technical Interview",
        interviewer: "Lisa Brown",
        date: "2024-01-21",
        status: "completed",
        result: "pass",
        feedback: "Strong knowledge of HR policies and labor laws",
      },
      {
        round: 3,
        name: "Manager Interview",
        interviewer: "David Wilson",
        date: "2024-01-24",
        status: "completed",
        result: "pass",
        feedback: "Great leadership potential and cultural fit",
      },
      {
        round: 4,
        name: "Final Interview",
        interviewer: "CEO",
        date: "2024-01-26",
        status: "completed",
        result: "pass",
        feedback: "Excellent candidate, approved for hiring",
      },
    ],
  },
]

export default function RecruitmentPage() {
  const { t, language } = useLanguage()
  const [positions] = useState<Position[]>(mockPositions)
  const [candidates] = useState<Candidate[]>(mockCandidates)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "selected":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pass":
        return "bg-green-100 text-green-800"
      case "fail":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoundIcon = (result: string) => {
    switch (result) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("recruitment.title")}</h1>
          <p className="text-gray-600">Manage recruitment process from job posting to onboarding</p>
        </div>

        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="positions">{t("recruitment.positions")}</TabsTrigger>
            <TabsTrigger value="candidates">{t("recruitment.candidates")}</TabsTrigger>
            <TabsTrigger value="interviews">{t("recruitment.interviews")}</TabsTrigger>
            <TabsTrigger value="onboarding">{t("recruitment.onboarding")}</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t("common.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("recruitment.addPosition")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("recruitment.addPosition")}</DialogTitle>
                    <DialogDescription>Create a new job position for recruitment</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("recruitment.position")}</Label>
                      <Input placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <div>
                      <Label>{t("recruitment.department")}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t("recruitment.location")}</Label>
                      <Input placeholder="e.g. Dubai" />
                    </div>
                    <div>
                      <Label>{t("recruitment.country")}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uae">UAE</SelectItem>
                          <SelectItem value="saudi">Saudi Arabia</SelectItem>
                          <SelectItem value="qatar">Qatar</SelectItem>
                          <SelectItem value="kuwait">Kuwait</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t("recruitment.salary")}</Label>
                      <Input placeholder="e.g. AED 15,000 - 20,000" />
                    </div>
                    <div>
                      <Label>{t("recruitment.contract")}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="2years">2 Years</SelectItem>
                          <SelectItem value="3years">3 Years</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Job Description</Label>
                      <Textarea placeholder="Describe the role, responsibilities, and requirements..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">{t("common.cancel")}</Button>
                    <Button>{t("common.save")}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {positions.map((position) => (
                <Card key={position.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {position.location}, {position.country}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {position.applicants} applicants
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Posted {position.postedDate}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(position.status)}>{position.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{t("recruitment.department")}:</span>
                        <p className="text-gray-600">{position.department}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t("recruitment.salary")}:</span>
                        <p className="text-gray-600">{position.salary}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t("recruitment.contract")}:</span>
                        <p className="text-gray-600">{position.contractPeriod}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          {t("common.edit")}
                        </Button>
                        <Button size="sm">{t("common.view")} Candidates</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <div className="grid gap-6">
              {candidates.map((candidate) => (
                <Card key={candidate.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{candidate.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span>{candidate.email}</span>
                          <span>{candidate.phone}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {candidate.location}, {candidate.country}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(candidate.status)}>{t(`recruitment.${candidate.status}`)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Position:</span>
                        <span className="ml-2 text-gray-600">{candidate.position}</span>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">{t("recruitment.rounds")}:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {candidate.rounds.map((round) => (
                            <div key={round.round} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Round {round.round}</span>
                                {getRoundIcon(round.result)}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{round.name}</p>
                              <p className="text-xs text-gray-500">by {round.interviewer}</p>
                              {round.date && <p className="text-xs text-gray-500 mt-1">{round.date}</p>}
                              {round.feedback && (
                                <p className="text-xs text-gray-600 mt-2 italic">"{round.feedback}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {candidate.status === "selected" && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Selected for Hiring</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">{t("employee.empCode")}:</span>
                              <p className="text-gray-600">{candidate.empCode}</p>
                            </div>
                            <div>
                              <span className="font-medium">{t("recruitment.salary")}:</span>
                              <p className="text-gray-600">{candidate.salary}</p>
                            </div>
                            <div>
                              <span className="font-medium">{t("recruitment.joiningDate")}:</span>
                              <p className="text-gray-600">{candidate.joiningDate}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedCandidate(candidate)}>
                          {t("common.view")} Details
                        </Button>
                        {candidate.status === "in-progress" && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 bg-transparent">
                              {t("common.approve")} Round
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                              {t("common.reject")}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interviews">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Interviews</CardTitle>
                <CardDescription>Upcoming and recent interview sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.flatMap((candidate) =>
                    candidate.rounds
                      .filter((round) => round.status === "scheduled" || round.date)
                      .map((round) => (
                        <div
                          key={`${candidate.id}-${round.round}`}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">
                              {round.name} - {candidate.position}
                            </p>
                            <p className="text-xs text-gray-500">Interviewer: {round.interviewer}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{round.date}</p>
                            <Badge className={getStatusColor(round.status)}>{round.status}</Badge>
                          </div>
                        </div>
                      )),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onboarding">
            <Card>
              <CardHeader>
                <CardTitle>{t("recruitment.onboarding")}</CardTitle>
                <CardDescription>New employee onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates
                    .filter((candidate) => candidate.status === "selected")
                    .map((candidate) => (
                      <div key={candidate.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium text-lg">{candidate.name}</h4>
                            <p className="text-gray-600">{candidate.position}</p>
                            <p className="text-sm text-gray-500">{candidate.empCode}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Onboarding</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">{t("recruitment.joiningDate")}:</span>
                            <p className="text-gray-600">{candidate.joiningDate}</p>
                          </div>
                          <div>
                            <span className="font-medium">{t("recruitment.salary")}:</span>
                            <p className="text-gray-600">{candidate.salary}</p>
                          </div>
                          <div>
                            <span className="font-medium">{t("recruitment.location")}:</span>
                            <p className="text-gray-600">{candidate.location}</p>
                          </div>
                          <div>
                            <span className="font-medium">{t("recruitment.country")}:</span>
                            <p className="text-gray-600">{candidate.country}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-medium">Onboarding Checklist:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Contract Signed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Employee Code Assigned</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span>IT Assets Assignment</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span>Office Access Setup</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span>HR Orientation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span>Team Introduction</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
