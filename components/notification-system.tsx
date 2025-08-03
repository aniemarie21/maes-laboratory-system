"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock, Calendar, FileText, Heart, Settings } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  category: "system" | "appointment" | "results" | "payment" | "general"
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

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)

  // Initialize with sample notifications
  useEffect(() => {
    const sampleNotifications: Omit<Notification, "id" | "timestamp" | "read">[] = [
      {
        type: "success",
        title: "Test Results Available",
        message: "Your Complete Blood Count results are now ready for review.",
        category: "results",
        action: {
          label: "View Results",
          onClick: () => console.log("View results clicked"),
        },
      },
      {
        type: "info",
        title: "Appointment Reminder",
        message: "Your laboratory appointment is scheduled for tomorrow at 10:00 AM.",
        category: "appointment",
        action: {
          label: "View Details",
          onClick: () => console.log("View appointment clicked"),
        },
      },
      {
        type: "warning",
        title: "Payment Due",
        message: "Your recent laboratory test payment is due in 3 days.",
        category: "payment",
        action: {
          label: "Pay Now",
          onClick: () => console.log("Pay now clicked"),
        },
      },
    ]

    sampleNotifications.forEach((notification) => {
      addNotification(notification)
    })
  }, [])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "appointment":
        return <Calendar className="w-4 h-4" />
      case "results":
        return <FileText className="w-4 h-4" />
      case "payment":
        return <Heart className="w-4 h-4" />
      case "system":
        return <Settings className="w-4 h-4" />
      case "general":
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

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

      {/* Notification Panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none">
          <Card className="w-full max-w-md max-h-[80vh] shadow-2xl border-0 bg-white/95 backdrop-blur-xl pointer-events-auto">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold">Notifications</h3>
                    <p className="text-sm text-emerald-100">{unreadCount} unread</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-white hover:bg-white/20 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPanel(false)}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              {getCategoryIcon(notification.category)}
                              <span className="capitalize">{notification.category}</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(notification.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {notification.action && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    notification.action?.onClick()
                                    markAsRead(notification.id)
                                  }}
                                  className="text-xs px-2 py-1 h-auto"
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Notification Button */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={() => setShowPanel(!showPanel)}
          className="relative bg-white shadow-lg hover:shadow-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </NotificationContext.Provider>
  )
}
