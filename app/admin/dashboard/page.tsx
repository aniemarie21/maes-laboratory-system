"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Download,
  Eye,
  Settings,
  MessageSquare,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import ChatSupport from "@/components/chat-support"
import { NotificationProvider, useNotifications } from "@/components/notification-system"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function AdminDashboardContent() {
  const [showChat, setShowChat] = useState(false)
  const { addNotification } = useNotifications()

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      patientName: "John Doe",
      patientEmail: "john.doe@email.com",
      services: ["Complete Blood Count", "Urinalysis"],
      amount: 750,
      requestDate: "2024-01-15",
      appointmentDate: "2024-01-20",
      status: "pending",
      documents: ["valid-id.jpg", "senior-id.jpg"],
      paymentMethod: "gcash",
      financialAssistance: "senior-discount",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientEmail: "jane.smith@email.com",
      services: ["Blood Chemistry Panel"],
      amount: 1200,
      requestDate: "2024-01-15",
      appointmentDate: "2024-01-22",
      status: "pending",
      documents: ["valid-id.jpg", "hmo-card.jpg"],
      paymentMethod: "hmo",
      financialAssistance: "hmo-coverage",
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      patientEmail: "mike.johnson@email.com",
      services: ["Thyroid Function Test", "Lipid Profile"],
      amount: 2300,
      requestDate: "2024-01-14",
      appointmentDate: "2024-01-25",
      status: "pending",
      documents: ["valid-id.jpg", "guarantee-letter.pdf"],
      paymentMethod: "guarantee",
      financialAssistance: "company-guarantee",
    },
  ])

  const [stats, setStats] = useState({
    totalPatients: 1234,
    pendingRequests: 3,
    monthlyRevenue: 245680,
    completedToday: 28,
    approvalRate: 94,
    avgProcessingTime: 2.5,
    totalTests: 15420,
    activeAppointments: 45,
  })

  // Chart data
  const revenueData = [
    { month: "Jan", revenue: 185000, patients: 890, tests: 1250 },
    { month: "Feb", revenue: 210000, patients: 950, tests: 1380 },
    { month: "Mar", revenue: 195000, patients: 920, tests: 1290 },
    { month: "Apr", revenue: 225000, patients: 1020, tests: 1450 },
    { month: "May", revenue: 240000, patients: 1100, tests: 1520 },
    { month: "Jun", revenue: 245680, patients: 1234, tests: 1580 },
  ]

  const serviceData = [
    { name: "Blood Tests", value: 35, count: 432, revenue: 95000 },
    { name: "Radiology", value: 25, count: 308, revenue: 78000 },
    { name: "Cardiology", value: 20, count: 247, revenue: 52000 },
    { name: "Others", value: 20, count: 247, revenue: 20680 },
  ]

  const dailyActivity = [
    { day: "Mon", appointments: 45, completed: 42, revenue: 12500 },
    { day: "Tue", appointments: 52, completed: 48, revenue: 14200 },
    { day: "Wed", appointments: 38, completed: 35, revenue: 10800 },
    { day: "Thu", appointments: 61, completed: 58, revenue: 16400 },
    { day: "Fri", appointments: 49, completed: 46, revenue: 13600 },
    { day: "Sat", appointments: 33, completed: 30, revenue: 8900 },
    { day: "Sun", appointments: 28, completed: 25, revenue: 7200 },
  ]

  const paymentMethods = [
    { name: "GCash", value: 40, amount: 98272 },
    { name: "Cash", value: 30, amount: 73704 },
    { name: "HMO", value: 20, amount: 49136 },
    { name: "Bank Transfer", value: 10, amount: 24568 },
  ]

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

  const [recentActivity] = useState([
    { id: 1, action: "Approved appointment request", user: "Dr. Admin", time: "2 hours ago", type: "approval" },
    { id: 2, action: "Updated service pricing", user: "Admin User", time: "4 hours ago", type: "update" },
    { id: 3, action: "Sent test results to patient", user: "Lab Tech", time: "6 hours ago", type: "result" },
    { id: 4, action: "New patient registration", user: "System", time: "8 hours ago", type: "registration" },
    { id: 5, action: "Payment confirmed", user: "System", time: "10 hours ago", type: "payment" },
  ])

  const handleApproveRequest = (requestId: number) => {
    const request = pendingRequests.find((req) => req.id === requestId)
    if (request) {
      setPendingRequests((prev) =>
        prev
          .map((req) => (req.id === requestId ? { ...req, status: "approved" } : req))
          .filter((req) => req.status === "pending"),
      )
      setStats((prev) => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }))

      addNotification({
        title: "Appointment Approved",
        message: `${request.patientName}'s appointment has been approved. Patient will be notified to proceed with payment.`,
        type: "success",
        category: "appointment",
        persistent: true,
      })
    }
  }

  const handleRejectRequest = (requestId: number) => {
    const request = pendingRequests.find((req) => req.id === requestId)
    if (request) {
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId))
      setStats((prev) => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }))

      addNotification({
        title: "Appointment Rejected",
        message: `${request.patientName}'s appointment has been rejected. Patient will be notified.`,
        type: "warning",
        category: "appointment",
      })
    }
  }

  const handleViewDocuments = (documents: string[]) => {
    addNotification({
      title: "Documents Viewed",
      message: `Viewing documents: ${documents.join(", ")}`,
      type: "info",
      category: "system",
    })
  }

  const exportReport = (type: string) => {
    // Simulate export functionality
    const data = {
      revenue: revenueData,
      services: serviceData,
      daily: dailyActivity,
      payments: paymentMethods,
      pending: pendingRequests,
    }

    const jsonData = JSON.stringify(data[type as keyof typeof data], null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addNotification({
      title: "Report Exported",
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully!`,
      type: "success",
      category: "system",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Laboratory Management Dashboard</h1>
              <p className="text-emerald-100 text-base sm:text-lg">
                Manage appointments, patients, and laboratory operations efficiently
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-emerald-100 text-sm">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-emerald-100 text-sm">Last updated: Just now</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <Activity className="w-16 sm:w-20 h-16 sm:h-20 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">Total Patients</CardTitle>
              <Users className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
                {stats.totalPatients.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
              <Progress value={75} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-yellow-800">Pending Requests</CardTitle>
              <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-700">{stats.pendingRequests}</div>
              <p className="text-xs text-yellow-600">Awaiting approval</p>
              <div className="mt-2">
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Urgent</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
                ₱{stats.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% from last month
              </p>
              <Progress value={82} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">Completed Today</CardTitle>
              <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.completedToday}</div>
              <p className="text-xs text-emerald-600">Laboratory tests</p>
              <div className="mt-2">
                <Badge className="bg-emerald-100 text-emerald-800 text-xs">On Track</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Card className="border-emerald-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <CardTitle className="text-emerald-800 flex items-center text-base sm:text-lg">
                <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Laboratory Analytics
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport("revenue")}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs"
              >
                <Download className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Export Data
              </Button>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Comprehensive analytics for laboratory operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue" className="w-full">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8 w-full">
                <TabsTrigger value="revenue" className="text-xs sm:text-sm">
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="patients" className="text-xs sm:text-sm">
                  Patients
                </TabsTrigger>
                <TabsTrigger value="tests" className="text-xs sm:text-sm">
                  Tests
                </TabsTrigger>
                <TabsTrigger value="payments" className="text-xs sm:text-sm">
                  Payments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-4">
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b98133" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Total Revenue", value: "₱1,300,680", change: "+8.2%" },
                    { title: "Avg. Transaction", value: "₱1,054", change: "+2.1%" },
                    { title: "Revenue per Patient", value: "₱1,054", change: "+3.5%" },
                    { title: "Projected Growth", value: "₱1.5M", change: "+12%" },
                  ].map((stat, i) => (
                    <Card key={i} className="border-emerald-100">
                      <CardContent className="p-3 sm:p-4">
                        <p className="text-xs text-gray-500">{stat.title}</p>
                        <p className="text-lg sm:text-xl font-bold text-emerald-700">{stat.value}</p>
                        <p className="text-xs text-emerald-600">{stat.change} from last month</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="patients" className="space-y-4">
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Total Patients", value: "1,234", change: "+12%" },
                    { title: "New Patients", value: "134", change: "+5.2%" },
                    { title: "Returning Rate", value: "68%", change: "+2.1%" },
                    { title: "Avg. Age", value: "42", change: "-1.5 years" },
                  ].map((stat, i) => (
                    <Card key={i} className="border-emerald-100">
                      <CardContent className="p-3 sm:p-4">
                        <p className="text-xs text-gray-500">{stat.title}</p>
                        <p className="text-lg sm:text-xl font-bold text-emerald-700">{stat.value}</p>
                        <p className="text-xs text-emerald-600">{stat.change} from last month</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tests" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="tests" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethods}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {paymentMethods.map((method, index) => (
                      <Card key={index} className="border-emerald-100">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-emerald-800">{method.name}</p>
                              <p className="text-sm text-gray-600">{method.value}% of transactions</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-700">₱{method.amount.toLocaleString()}</p>
                              <Progress value={method.value} className="w-20 h-2 mt-1" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Requests */}
          <div className="lg:col-span-2">
            <Card className="border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-800 text-base sm:text-lg">Pending Appointment Requests</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Review and approve patient appointment requests
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportReport("pending")}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs"
                >
                  <Download className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-emerald-100 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <h4 className="font-semibold text-emerald-800 text-base">{request.patientName}</h4>
                            <Badge className="w-fit bg-yellow-100 text-yellow-800 text-xs">
                              {request.financialAssistance}
                            </Badge>
                            <Badge className="w-fit bg-blue-100 text-blue-800 text-xs">{request.paymentMethod}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Email: {request.patientEmail}</p>
                            <p>Services: {request.services.join(", ")}</p>
                            <p>Appointment: {request.appointmentDate}</p>
                            <p>
                              Amount:{" "}
                              <span className="font-semibold text-emerald-700">₱{request.amount.toLocaleString()}</span>
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDocuments(request.documents)}
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Documents ({request.documents.length})
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(request.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                            className="border-red-600 text-red-600 hover:bg-red-50 text-xs"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingRequests.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                      <p className="text-emerald-700 font-medium">All requests have been processed!</p>
                      <p className="text-gray-600 text-sm">New requests will appear here for review.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center text-base sm:text-lg">
                  <Activity className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-emerald-800">{activity.action}</p>
                        <p className="text-xs text-emerald-600">
                          by {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800 text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 justify-start text-xs sm:text-sm">
                  <Users className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                  View All Patients
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-start text-xs sm:text-sm bg-transparent"
                >
                  <FileText className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                  Generate Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-start text-xs sm:text-sm bg-transparent"
                >
                  <Settings className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                  System Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-start text-xs sm:text-sm bg-transparent"
                  onClick={() => setShowChat(true)}
                >
                  <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                  Support Chat
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center text-base sm:text-lg">
                  <Activity className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Database</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Payment Gateway</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Email Service</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">Running</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Backup Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">Updated</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Support */}
      <ChatSupport isOpen={showChat} onClose={() => setShowChat(false)} userType="admin" userName="Admin User" />
    </AdminLayout>
  )
}

export default function AdminDashboard() {
  return (
    <NotificationProvider>
      <AdminDashboardContent />
    </NotificationProvider>
  )
}
