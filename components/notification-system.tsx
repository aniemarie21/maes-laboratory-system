"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  Clock,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  category: "appointment" | "payment" | "result" | "system" | "chat"
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
  persistent?: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/images/maes-logo.avif",
        tag: newNotification.id,
      })
    }

    // Auto-remove non-persistent notifications after 5 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        removeNotification,
        clearAll,
        unreadCount,
      }}
    >
      {children}
      <NotificationToasts />
    </NotificationContext.Provider>
  )
}

function NotificationToasts() {
  const { notifications, removeNotification, markAsRead } = useNotifications()
  const activeNotifications = notifications.filter((n) => !n.read).slice(0, 3)

  const getIcon = (type: string, category: string) => {
    if (category === "appointment") return <Calendar className="w-5 h-5" />
    if (category === "payment") return <CreditCard className="w-5 h-5" />
    if (category === "result") return <FileText className="w-5 h-5" />
    if (category === "chat") return <MessageSquare className="w-5 h-5" />

    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getColorClasses = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {activeNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={`w-80 shadow-lg border-2 ${getColorClasses(notification.type)} animate-in slide-in-from-right duration-300`}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">{getIcon(notification.type, notification.category)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{notification.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {notification.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {notification.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {notification.actionUrl && notification.actionText && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs bg-transparent"
                      onClick={() => {
                        markAsRead(notification.id)
                        window.location.href = notification.actionUrl!
                      }}
                    >
                      {notification.actionText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Notification Bell Component for Headers
export function NotificationBell() {
  const { unreadCount } = useNotifications()

  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="w-5 h-5 text-emerald-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  )
}
