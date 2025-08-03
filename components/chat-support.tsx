"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Phone,
  Video,
  Paperclip,
  Smile,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  text: string
  sender: "user" | "admin" | "system"
  timestamp: Date
  status: "sent" | "delivered" | "read"
  senderName?: string
  senderRole?: string
}

interface ChatSupportProps {
  isOpen: boolean
  onClose: () => void
  userType: "patient" | "admin"
  userName?: string
}

export default function ChatSupport({ isOpen, onClose, userType, userName = "User" }: ChatSupportProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello ${userName}! Welcome to MEGH Laboratory Support. How can I assist you today?`,
      sender: "system",
      timestamp: new Date(),
      status: "delivered",
      senderName: "MEGH Support",
      senderRole: "System",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [adminOnline, setAdminOnline] = useState(true)
  const [waitingForAdmin, setWaitingForAdmin] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate admin responses and status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change admin status
      if (Math.random() > 0.8) {
        setAdminOnline((prev) => !prev)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      senderName: userName,
      senderRole: userType === "admin" ? "Admin" : "Patient",
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Show typing indicator
    setIsTyping(true)

    // Simulate admin response
    setTimeout(() => {
      setIsTyping(false)

      if (!adminOnline && !waitingForAdmin) {
        setWaitingForAdmin(true)
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Our support team is currently offline. Your message has been queued and an admin will respond as soon as they're available. You'll receive a notification when they reply.",
          sender: "system",
          timestamp: new Date(),
          status: "delivered",
          senderName: "MEGH Support",
          senderRole: "System",
        }
        setMessages((prev) => [...prev, systemMessage])

        // Show notification
        showNotification(
          "Message Queued",
          "Your message has been sent to our support team. You'll be notified when they respond.",
          "info",
        )
      } else {
        // Simulate admin response
        const responses = [
          "Thank you for contacting us. Let me help you with that.",
          "I understand your concern. Let me check that for you right away.",
          "That's a great question! Here's what I can tell you...",
          "I'm here to help. Can you provide me with more details about your issue?",
          "Let me connect you with the right department for this inquiry.",
        ]

        const adminMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: "admin",
          timestamp: new Date(),
          status: "delivered",
          senderName: "Dr. Maria Santos",
          senderRole: "Support Specialist",
        }
        setMessages((prev) => [...prev, adminMessage])

        // Show notification for admin response
        showNotification("New Message", "Dr. Maria Santos has replied to your message", "success")
      }
    }, 2000)
  }

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    // This would integrate with your notification system
    console.log(`${type.toUpperCase()}: ${title} - ${message}`)

    // You can implement toast notifications here
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/images/maes-logo.avif",
      })
    }
  }

  const requestLiveSupport = () => {
    setWaitingForAdmin(true)
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: "Connecting you to a live support agent. Please wait...",
      sender: "system",
      timestamp: new Date(),
      status: "delivered",
      senderName: "MEGH Support",
      senderRole: "System",
    }
    setMessages((prev) => [...prev, systemMessage])

    showNotification("Live Support Requested", "We're connecting you to a live agent. Please wait...", "info")

    // Simulate connection
    setTimeout(() => {
      if (adminOnline) {
        setWaitingForAdmin(false)
        const connectMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Hello! I'm Dr. Maria Santos, and I'm here to help you. What can I assist you with today?",
          sender: "admin",
          timestamp: new Date(),
          status: "delivered",
          senderName: "Dr. Maria Santos",
          senderRole: "Live Support Agent",
        }
        setMessages((prev) => [...prev, connectMessage])
        showNotification("Connected to Live Support", "Dr. Maria Santos is now available to help you", "success")
      } else {
        const offlineMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, all our support agents are currently busy. Your request has been queued with high priority. Estimated wait time: 5-10 minutes.",
          sender: "system",
          timestamp: new Date(),
          status: "delivered",
          senderName: "MEGH Support",
          senderRole: "System",
        }
        setMessages((prev) => [...prev, offlineMessage])
        showNotification(
          "Support Queue",
          "You've been added to the priority queue. Estimated wait: 5-10 minutes",
          "warning",
        )
      }
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Clock className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />
      case "read":
        return <CheckCircle2 className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-80 sm:w-96 shadow-2xl border-emerald-200 transition-all duration-300 ${isMinimized ? "h-16" : "h-[500px]"}`}
      >
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-white text-emerald-600 text-sm font-bold">MS</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${adminOnline ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
              </div>
              <div>
                <CardTitle className="text-sm font-medium">MEGH Support</CardTitle>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-300" : connectionStatus === "connecting" ? "bg-yellow-300 animate-pulse" : "bg-red-300"}`}
                  ></div>
                  <span className="text-xs text-emerald-100">
                    {adminOnline ? "Online" : "Offline"} • {connectionStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isMinimized && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => requestLiveSupport()}
                    disabled={waitingForAdmin}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    <Video className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Status Alerts */}
            {waitingForAdmin && (
              <Alert className="m-2 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700 text-xs">
                  Waiting for live support agent... You're #2 in queue
                </AlertDescription>
              </Alert>
            )}

            {!adminOnline && !waitingForAdmin && (
              <Alert className="m-2 bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 text-xs">
                  Support team is offline. Messages will be answered when they return.
                </AlertDescription>
              </Alert>
            )}

            {/* Messages */}
            <CardContent className="p-0 h-80 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                      {message.sender !== "user" && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                              {message.sender === "admin" ? (
                                <Shield className="w-3 h-3" />
                              ) : (
                                <MessageSquare className="w-3 h-3" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600 font-medium">{message.senderName}</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {message.senderRole}
                          </Badge>
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-emerald-600 text-white"
                            : message.sender === "admin"
                              ? "bg-white border border-emerald-200 text-gray-800"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-xs ${message.sender === "user" ? "text-emerald-100" : "text-gray-500"}`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.sender === "user" && (
                            <div className="flex items-center space-x-1">{getStatusIcon(message.status)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-emerald-200 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-emerald-200 bg-white rounded-b-lg">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-emerald-600">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="pr-10 border-emerald-200 focus:border-emerald-500"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-6 w-6 p-0 text-gray-500 hover:text-emerald-600"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 h-8 w-8 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {!adminOnline && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestLiveSupport}
                    disabled={waitingForAdmin}
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs"
                  >
                    {waitingForAdmin ? "Waiting for agent..." : "Request Live Support"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
