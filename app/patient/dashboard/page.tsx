"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  Heart,
  Brain,
  Plus,
  ArrowRight,
  Star,
  Award,
  Target,
} from "lucide-react"
import Link from "next/link"
import PatientLayout from "@/components/patient-layout"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const healthTrendData = [
  { month: "Jan", score: 85, cholesterol: 180, bloodPressure: 120 },
  { month: "Feb", score: 87, cholesterol: 175, bloodPressure: 118 },
  { month: "Mar", score: 90, cholesterol: 170, bloodPressure: 115 },
  { month: "Apr", score: 92, cholesterol: 165, bloodPressure: 112 },
  { month: "May", score: 94, cholesterol: 160, bloodPressure: 110 },
  { month: "Jun", score: 96, cholesterol: 155, bloodPressure: 108 },
]

const testResultsData = [
  { name: "Blood Count", value: 95, color: "#10b981" },
  { name: "Cholesterol", value: 88, color: "#3b82f6" },
  { name: "Blood Sugar", value: 92, color: "#8b5cf6" },
  { name: "Liver Function", value: 90, color: "#f59e0b" },
]

const upcomingTests = [
  { name: "Lipid Profile", date: "2024-01-15", time: "10:00 AM", status: "confirmed" },
  { name: "Thyroid Function", date: "2024-01-20", time: "2:00 PM", status: "pending" },
]

const recentResults = [
  { test: "Complete Blood Count", date: "2024-01-05", status: "normal", aiScore: 95 },
  { test: "Blood Chemistry", date: "2024-01-03", status: "normal", aiScore: 88 },
  { test: "Urinalysis", date: "2023-12-28", status: "normal", aiScore: 92 },
]

const healthInsights = [
  {
    title: "Excellent Progress",
    description: "Your health score has improved by 11% over the last 6 months",
    type: "positive",
    icon: TrendingUp,
    action: "View Trends",
  },
  {
    title: "Cholesterol Improvement",
    description: "Your cholesterol levels have decreased by 25mg/dL since January",
    type: "positive",
    icon: Heart,
    action: "View Details",
  },
  {
    title: "Upcoming Checkup",
    description: "Your annual comprehensive health screening is due next month",
    type: "info",
    icon: Calendar,
    action: "Schedule Now",
  },
]

export default function PatientDashboard() {
  const [healthScore, setHealthScore] = useState(94)
  const [userName, setUserName] = useState("John")

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Patient"
    setUserName(name)
  }, [])

  return (
    <PatientLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
                <p className="text-xl text-emerald-100">Your health journey continues with AI-powered insights</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">{healthScore}%</div>
                <div className="text-emerald-200">Health Score</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-emerald-100">Upcoming Tests</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-blue-100">Recent Results</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-purple-100">AI Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/patient/book-appointment">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-emerald-800 mb-2">Book Test</h3>
                <p className="text-sm text-emerald-600">Schedule your next laboratory test</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/patient/results">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-blue-800 mb-2">View Results</h3>
                <p className="text-sm text-blue-600">Check your latest test results</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/patient/medical-certificate">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-purple-800 mb-2">Medical Certificate</h3>
                <p className="text-sm text-purple-600">Request medical certificates</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/patient/chat">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-orange-800 mb-2">AI Assistant</h3>
                <p className="text-sm text-orange-600">Get instant health guidance</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Health Score and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Health Trends</span>
              </CardTitle>
              <CardDescription>Your health metrics over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      name="Health Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-6xl font-bold text-emerald-600 mb-4">{healthScore}%</div>
                  <Progress value={healthScore} className="mb-4" />
                  <div className="flex items-center justify-center space-x-2 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+11% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span>Achievement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Health Champion</h3>
                  <p className="text-sm text-gray-600">Maintained excellent health for 6 months</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Test Results Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Recent Test Results</span>
              </CardTitle>
              <CardDescription>Your latest laboratory test results with AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{result.test}</div>
                        <div className="text-sm text-gray-500">{result.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-1">Normal</Badge>
                      <div className="text-xs text-gray-500">AI Score: {result.aiScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/patient/results">
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  View All Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Upcoming Tests</span>
              </CardTitle>
              <CardDescription>Your scheduled laboratory appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTests.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{test.name}</div>
                        <div className="text-sm text-gray-500">
                          {test.date} at {test.time}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        test.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {test.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Link href="/patient/book-appointment">
                <Button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                  Book New Test
                  <Plus className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* AI Health Insights */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Health Insights</span>
            </CardTitle>
            <CardDescription>Personalized recommendations based on your health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {healthInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        insight.type === "positive"
                          ? "bg-green-100"
                          : insight.type === "info"
                            ? "bg-blue-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      <insight.icon
                        className={`w-6 h-6 ${
                          insight.type === "positive"
                            ? "text-green-600"
                            : insight.type === "info"
                              ? "text-blue-600"
                              : "text-yellow-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{insight.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Results Distribution */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Test Results Distribution</span>
            </CardTitle>
            <CardDescription>Overview of your recent test performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={testResultsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {testResultsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {testResultsData.map((test, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: test.color }}></div>
                      <span className="font-medium text-gray-900">{test.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">{test.value}%</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  )
}
