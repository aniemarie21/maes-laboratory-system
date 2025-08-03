"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Heart,
  Home,
  Calendar,
  CreditCard,
  Shield,
  Upload,
  History,
  UserCheck,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Manage Patients", href: "/admin/patients", icon: Users },
    { name: "Appointment Requests", href: "/admin/appointments", icon: Calendar },
    { name: "Manage Services", href: "/admin/services", icon: FileText },
    { name: "Payment Management", href: "/admin/payments", icon: CreditCard },
    { name: "Results Management", href: "/admin/results", icon: Upload },
    { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
    { name: "User Management", href: "/admin/users", icon: UserCheck },
    { name: "Chat Support", href: "/admin/chat", icon: MessageSquare },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Activity History", href: "/admin/history", icon: History },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-emerald-800">MEGH Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 shadow-sm"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-emerald-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-sm border-r border-emerald-200 shadow-lg">
          <div className="flex items-center h-16 px-6 border-b border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">MEGH</span>
                <p className="text-xs text-emerald-100">Admin Portal</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 shadow-sm border border-emerald-200"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-emerald-200 bg-emerald-50">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-800">Admin User</p>
                <p className="text-xs text-emerald-600 truncate">{userEmail}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-emerald-200 bg-white/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-emerald-200" />
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-emerald-700 font-medium">System Online</span>
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  5
                </span>
              </Button>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-emerald-200" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block">
                  <span className="text-sm font-medium text-emerald-800">Admin User</span>
                  <p className="text-xs text-emerald-600">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
