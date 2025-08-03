"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  FileText,
  User,
  Bell,
  MessageSquare,
  CreditCard,
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  Stethoscope,
  Activity,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Shield,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PatientLayoutProps {
  children: React.ReactNode
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/patient/dashboard", icon: Home, badge: null },
    { name: "Book Appointment", href: "/patient/book-appointment", icon: Calendar, badge: null },
    { name: "My Appointments", href: "/patient/appointments", icon: Calendar, badge: "2" },
    { name: "Test Results", href: "/patient/results", icon: FileText, badge: "1" },
    { name: "Medical Certificates", href: "/patient/medical-certificate", icon: Stethoscope, badge: null },
    { name: "Payment History", href: "/patient/payments", icon: CreditCard, badge: null },
    { name: "Chat Support", href: "/patient/chat", icon: MessageSquare, badge: null },
    { name: "Health Records", href: "/patient/health-records", icon: Activity, badge: null },
    { name: "Notifications", href: "/patient/notifications", icon: Bell, badge: "3" },
    { name: "Profile", href: "/patient/profile", icon: User, badge: null },
    { name: "Settings", href: "/patient/settings", icon: Settings, badge: null },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-gray-50 to-emerald-50"}`}>
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white dark:bg-gray-800 shadow-2xl">
          {/* Mobile Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-600 to-blue-600">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/maeslogo.avif"
                alt="MAES Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-lg"
              />
              <div>
                <span className="text-xl font-bold text-white">MAES</span>
                <p className="text-xs text-emerald-100">Patient Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 shadow-lg border border-emerald-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && <Badge className="bg-blue-500 text-white text-xs px-2 py-1">{item.badge}</Badge>}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 shadow-2xl">
          {/* Desktop Header */}
          <div className="flex items-center h-20 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-600 to-blue-600">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src="/images/maeslogo.avif"
                  alt="MAES Logo"
                  width={48}
                  height={48}
                  className="rounded-xl shadow-lg ring-2 ring-white/50"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">MAES</span>
                <p className="text-sm text-emerald-100">Patient Portal</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your health records..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 shadow-lg border border-emerald-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon
                      className={`w-5 h-5 mr-4 ${isActive ? "text-emerald-600" : "group-hover:text-emerald-600"} transition-colors duration-300`}
                    />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge className="bg-blue-500 text-white text-xs px-2 py-1 animate-pulse">{item.badge}</Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Patient Profile Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center space-x-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Avatar className="w-12 h-12 ring-2 ring-blue-500">
                <AvatarImage src="/placeholder.svg?height=48&width=48&text=Patient" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{userEmail}</p>
                <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Active Patient
                </Badge>
              </div>
            </div>

            {/* Health Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-md">
                <div className="text-lg font-bold text-emerald-600">94%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Health Score</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-md">
                <div className="text-lg font-bold text-blue-600">2</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Upcoming Tests</div>
              </div>
            </div>

            {/* Next Appointment */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 shadow-md">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-gray-900 dark:text-white">Next Appointment</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Blood Test - Tomorrow 10:00 AM</div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-20 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Account Active</span>
                <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Patient
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                  3
                </span>
              </Button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />

              {/* Patient Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-xl"
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-blue-500">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=Patient" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">John Doe</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Patient</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Activity className="mr-2 h-4 w-4" />
                    <span>Health Records</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
