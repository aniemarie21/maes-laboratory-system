"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  FileText,
  Bell,
  CreditCard,
  MessageSquare,
  Activity,
  CheckCircle,
  AlertCircle,
  Heart,
  Clock,
  TrendingUp,
  Download,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import PatientLayout from "@/components/patient-layout"
import ChatSupport from "@/components/chat-support"
import { useNotifications, NotificationProvider } from "@/components/notification-system"
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
} from "recharts"

function PatientDashboardContent() {
  const [userEmail, setUserEmail] = useState("")
  const [showChat, setShowChat] = useState(false)
  const { addNotification } = useNotifications()

  const [notifications] = useState([
    { id: 1, message: "Your blood test results are ready for download", type: "success", time: "2 hours ago" },
    { id: 2, message: "Appointment reminder: Tomorrow at 10:00 AM", type: "info", time: "1 day ago" },
    { id: 3, message: "Payment confirmation received for CBC test", type: "success", time: "3 days ago" },
    { id: 4, message: "Medical certificate request approved", type: "success", time: "5 days ago" },
  ])

  const [recentAppointments] = useState([
    {
      id: 1,
      service: "Complete Blood Count",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "completed",
      amount: "₱450",
      results: "Available",
    },
    {
      id: 2,
      service: "Blood Chemistry Panel",
      date: "2024-01-20",
      time: "2:00 PM",
      status: "approved",
      amount: "₱1,200",
      results: "Pending",
    },
    {
      id: 3,
      service: "Urinalysis",
      date: "2024-01-25",
      time: "9:00 AM",
      status: "scheduled",
      amount: "₱300",
      results: "Pending",
    },
  ])

  const [healthData] = useState([
    { month: "Jan", tests: 2, spending: 750, healthScore: 85 },
    { month: "Feb", tests: 1, spending: 450, healthScore: 87 },
    { month: "Mar", tests: 3, spending: 1950, healthScore: 82 },
    { month: "Apr", tests: 2, spending: 1200, healthScore: 88 },
    { month: "May", tests: 1, spending: 300, healthScore: 90 },
    { month: "Jun", tests: 2, spending: 900, healthScore: 92 },
  ])

  const [testCategories] = useState([
    { name: "Blood Tests", value: 60, count: 8, color: "#10b981" },
    { name: "Imaging", value: 25, count: 3, color: "#3b82f6" },
    { name: "Cardiology", value: 15, count: 2, color: "#f59e0b" },
  ])

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    }

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const notifications = [
        {
          title: "Test Results Ready",
          message: "Your CBC test results are now available for download",
          type: "success" as const,
          category: "result" as const,
          persistent: true,
          actionUrl: "/patient/results",
          actionText: "View Results",
        },
        {
          title: "Appointment Reminder",
          message: "You have an appointment tomorrow at 10:00 AM",
          type: "info" as const,
          category: "appointment" as const,
          actionUrl: "/patient/appointments",
          actionText: "View Details",
        },
        {
          title: "Payment Confirmed",
          message: "Your payment of ₱1,200 has been successfully processed",
          type: "success" as const,
          category: "payment" as const,
        },
      ]

      if (Math.random() > 0.7) {
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
        addNotification(randomNotification)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [addNotification])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "info":
        return <Bell className="w-4 h-4 text-blue-600" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <PatientLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-emerald-100 text-base sm:text-lg mb-4">
                Your health journey continues here. Book laboratory tests, view results, and manage your appointments.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-emerald-100 text-sm">Account Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-emerald-100 text-sm">Last visit: Jan 15, 2024</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <Heart className="w-16 sm:w-20 h-16 sm:h-20 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">Total Tests</CardTitle>
              <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">13</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2 from last month
              </p>
              <Progress value={75} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">Pending Results</CardTitle>
              <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">2</div>
              <p className="text-xs text-emerald-600">1 ready for pickup</p>
              <div className="mt-2">
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Processing</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">This Month</CardTitle>
              <CreditCard className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">₱2,450</div>
              <p className="text-xs text-emerald-600">Total spent</p>
              <Progress value={60} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">Health Score</CardTitle>
              <Activity className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">92%</div>
              <p className="text-xs text-emerald-600">Excellent</p>
              <div className="mt-2">
                <Badge className="bg-emerald-100 text-emerald-800 text-xs">Healthy</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Trends */}
          <Card className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-emerald-800 flex items-center text-base sm:text-lg">
                  <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Health Activity & Spending
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your test history and health score trends
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs"
              >
                <Download className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "spending" ? `₱${value}` : name === "healthScore" ? `${value}%` : value,
                      name === "spending" ? "Spending" : name === "healthScore" ? "Health Score" : "Tests",
                    ]}
                  />
                  <Line type="monotone" dataKey="tests" stroke="#10b981" strokeWidth={3} name="tests" />
                  <Line type="monotone" dataKey="healthScore" stroke="#3b82f6" strokeWidth={2} name="healthScore" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Test Categories */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center text-base sm:text-lg">
                <Activity className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Test Categories
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Distribution of your laboratory tests</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={testCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {testCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <Card className="border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-800 text-base sm:text-lg">Recent Appointments</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your latest laboratory services and appointments
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs"
                >
                  <Download className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-emerald-100 rounded-xl hover:shadow-md transition-shadow space-y-3 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-emerald-800 text-sm sm:text-base">{appointment.service}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <p className="text-xs text-emerald-600">Results: {appointment.results}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <Badge className={`${getStatusColor(appointment.status)} text-xs`}>{appointment.status}</Badge>
                        <p className="text-sm font-semibold text-emerald-700 mt-1">{appointment.amount}</p>
                        {appointment.results === "Available" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/patient/appointments">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      View All Appointments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications & Quick Actions */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center text-base sm:text-lg">
                  <Bell className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-emerald-800">{notification.message}</p>
                        <p className="text-xs text-emerald-600 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/patient/notifications">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs"
                    >
                      View All Notifications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800 text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/patient/book-appointment">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 justify-start text-xs sm:text-sm">
                    <Calendar className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                    Book New Test
                  </Button>
                </Link>
                <Link href="/patient/results">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-start bg-transparent text-xs sm:text-sm"
                  >
                    <FileText className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                    View Test Results
                  </Button>
                </Link>
                <Link href="/patient/medical-certificate">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-start bg-transparent text-xs sm:text-sm"
                  >
                    <Stethoscope className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                    Request Med Certificate
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-start bg-transparent text-xs sm:text-sm"
                  onClick={() => setShowChat(true)}
                >
                  <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                  Chat with Support
                </Button>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center text-base sm:text-lg">
                  <Heart className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Health Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-emerald-700 mb-3">
                  Regular health checkups can help detect potential issues early. Consider scheduling your annual
                  physical exam and routine blood work.
                </p>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Support */}
      <ChatSupport isOpen={showChat} onClose={() => setShowChat(false)} userType="patient" userName="John Doe" />
    </PatientLayout>
  )
}

export default function PatientDashboard() {
  return (
    <NotificationProvider>
      <PatientDashboardContent />
    </NotificationProvider>
  )
}
