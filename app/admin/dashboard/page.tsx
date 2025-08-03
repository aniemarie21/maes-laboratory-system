"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const revenueData = [
  { month: "Jan", revenue: 45000, tests: 320, patients: 180 },
  { month: "Feb", revenue: 52000, tests: 380, patients: 210 },
  { month: "Mar", revenue: 48000, tests: 350, patients: 195 },
  { month: "Apr", revenue: 61000, tests: 420, patients: 240 },
  { month: "May", revenue: 58000, tests: 410, patients: 230 },
  { month: "Jun", revenue: 67000, tests: 480, patients: 270 },
]

const testDistributionData = [
  { name: "Blood Tests", value: 45, color: "#10b981" },
  { name: "Chemistry Panel", value: 25, color: "#3b82f6" },
  { name: "Immunology", value: 15, color: "#8b5cf6" },
  { name: "Microbiology", value: 10, color: "#f59e0b" },
  { name: "Others", value: 5, color: "#ef4444" },
]

const patientAgeData = [
  { age: "0-18", count: 45 },
  { age: "19-35", count: 120 },
  { age: "36-50", count: 95 },
  { age: "51-65", count: 80 },
  { age: "65+", count: 60 },
]

const recentActivities = [
  { type: "appointment", message: "New appointment booked by Maria Santos", time: "5 minutes ago", status: "new" },
  { type: "result", message: "Test results uploaded for John Doe", time: "12 minutes ago", status: "completed" },
  { type: "payment", message: "Payment received from Anna Cruz - ₱1,200", time: "25 minutes ago", status: "success" },
  { type: "alert", message: "Critical result flagged for review", time: "1 hour ago", status: "urgent" },
  { type: "user", message: "New patient registration: Carlos Mendez", time: "2 hours ago", status: "new" },
]

const pendingTasks = [
  { task: "Review critical test results", count: 3, priority: "high" },
  { task: "Approve pending appointments", count: 12, priority: "medium" },
  { task: "Process payment confirmations", count: 8, priority: "medium" },
  { task: "Update patient records", count: 5, priority: "low" },
  { task: "Generate monthly reports", count: 2, priority: "high" },
]

export default function AdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(331000)
  const [totalPatients, setTotalPatients] = useState(1325)
  const [totalTests, setTotalTests] = useState(2360)
  const [pendingApprovals, setPendingApprovals] = useState(24)

  const stats = [
    {
      title: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Patients",
      value: totalPatients.toLocaleString(),
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Tests Completed",
      value: totalTests.toLocaleString(),
      change: "+15.3%",
      changeType: "positive",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      change: "-5.1%",
      changeType: "negative",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard 🏥</h1>
                <p className="text-xl text-emerald-100">MAES Laboratory Management System</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge
                      className={`${stat.changeType === "positive" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"} border-0`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Revenue & Performance</span>
              </CardTitle>
              <CardDescription>Monthly revenue, tests completed, and patient growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      name="Revenue (₱)"
                    />
                    <Area
                      type="monotone"
                      dataKey="tests"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Tests Completed"
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
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Server Health</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Excellent</span>
                    </div>
                  </div>
                  <Progress value={98} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Performance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Optimal</span>
                    </div>
                  </div>
                  <Progress value={95} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Processing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span>Security Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">All Systems Secure</h3>
                  <p className="text-sm text-gray-600">Last security scan: 2 hours ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Test Distribution and Patient Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                <span>Test Distribution</span>
              </CardTitle>
              <CardDescription>Breakdown of laboratory tests by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={testDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {testDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {testDistributionData.map((test, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: test.color }}></div>
                        <span className="text-sm font-medium text-gray-900">{test.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{test.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Patient Demographics</span>
              </CardTitle>
              <CardDescription>Patient distribution by age groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientAgeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Recent Activities</span>
              </CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.status === "new"
                          ? "bg-blue-100"
                          : activity.status === "completed"
                            ? "bg-green-100"
                            : activity.status === "success"
                              ? "bg-emerald-100"
                              : activity.status === "urgent"
                                ? "bg-red-100"
                                : "bg-gray-100"
                      }`}
                    >
                      {activity.type === "appointment" && <Calendar className="w-5 h-5 text-blue-600" />}
                      {activity.type === "result" && <FileText className="w-5 h-5 text-green-600" />}
                      {activity.type === "payment" && <DollarSign className="w-5 h-5 text-emerald-600" />}
                      {activity.type === "alert" && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      {activity.type === "user" && <Users className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge
                      className={`${
                        activity.status === "urgent"
                          ? "bg-red-100 text-red-800"
                          : activity.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : activity.status === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                <span>Pending Tasks</span>
              </CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">{task.task}</p>
                        <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.count}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Analytics Summary */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Analytics Summary</span>
            </CardTitle>
            <CardDescription>Intelligent insights and predictions for laboratory operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800">Revenue Prediction</h3>
                    <p className="text-sm text-emerald-600">Next month forecast</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-700 mb-2">₱72,000</div>
                <p className="text-sm text-emerald-600">+8% increase expected</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800">Patient Growth</h3>
                    <p className="text-sm text-blue-600">Projected new patients</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-700 mb-2">+45</div>
                <p className="text-sm text-blue-600">Based on current trends</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-800">Efficiency Score</h3>
                    <p className="text-sm text-purple-600">Overall system performance</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-2">94%</div>
                <p className="text-sm text-purple-600">Excellent performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
