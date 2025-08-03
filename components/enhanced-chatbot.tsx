"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  Send,
  X,
  User,
  Phone,
  Stethoscope,
  Calendar,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Minimize2,
  Maximize2,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  type: "user" | "bot" | "system"
  content: string
  timestamp: Date
  isTyping?: boolean
  suggestions?: string[]
  rating?: "positive" | "negative" | null
}

interface ChatSupportProps {
  isOpen: boolean
  onClose: () => void
  userType: "patient" | "admin" | "guest"
  userName?: string
  isLoggedIn?: boolean
}

export default function ChatSupport({
  isOpen,
  onClose,
  userType,
  userName = "User",
  isLoggedIn = false,
}: ChatSupportProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentStep, setCurrentStep] = useState("greeting")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const quickActions = [
    { icon: Calendar, label: "Book Appointment", action: "book_appointment" },
    { icon: FileText, label: "View Results", action: "view_results" },
    { icon: Stethoscope, label: "Health Questions", action: "health_questions" },
    { icon: Phone, label: "Contact Support", action: "contact_support" },
  ]

  const faqItems = [
    {
      question: "How do I book a laboratory test?",
      answer:
        "You can book a test through our patient portal or by calling (043) 286-2531. Our AI system will help you choose the right tests based on your needs.",
    },
    {
      question: "When will my results be ready?",
      answer:
        "Most results are available within 24-48 hours. Our AI-powered system provides preliminary insights immediately, with full reports following medical review.",
    },
    {
      question: "How accurate are your AI diagnostics?",
      answer:
        "Our AI system has a 99.9% accuracy rate and is used to assist, not replace, medical professionals. All results are reviewed by certified laboratory technicians.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash, credit cards, GCash, bank transfers, and various HMO plans. Financial assistance programs are also available.",
    },
  ]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content: `Hello ${userName}! 👋 I'm MAES AI Assistant, your intelligent healthcare companion. I'm here to help you with:

• 🔬 Laboratory test bookings and information
• 📊 Understanding your test results  
• 🏥 Hospital services and procedures
• 💊 Health questions and guidance
• 📞 Connecting with live medical experts

How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        "Book a blood test",
        "Check my results",
        "Ask health question",
        "Contact live support",
        "View services",
        "Emergency help",
      ],
    }

    setMessages([welcomeMessage])
  }

  const addMessage = (content: string, type: "user" | "bot" | "system", suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, delay)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    addMessage(inputMessage, "user")
    const userInput = inputMessage.toLowerCase()
    setInputMessage("")

    simulateTyping(() => {
      handleBotResponse(userInput)
    })
  }

  const handleBotResponse = (userInput: string) => {
    let response = ""
    let suggestions: string[] = []

    // AI-powered response logic
    if (userInput.includes("book") || userInput.includes("appointment") || userInput.includes("test")) {
      response = `I'd be happy to help you book a laboratory test! 🔬

Our most popular tests include:
• Complete Blood Count (CBC) - ₱350
• Comprehensive Metabolic Panel - ₱800  
• Lipid Profile - ₱600
• Thyroid Function Tests - ₱1,200
• COVID-19 Testing - ₱500

Would you like me to help you book one of these, or do you need a different test?`
      suggestions = ["Book CBC", "Book Metabolic Panel", "Book Lipid Profile", "Other tests", "Check availability"]
    } else if (userInput.includes("result") || userInput.includes("report")) {
      response = `I can help you access your test results! 📊

${
  isLoggedIn
    ? "Since you're logged in, I can see you have 2 pending results. Your CBC results from yesterday are ready for review. Would you like me to explain them?"
    : "To view your results, you'll need to log in to your patient portal. I can guide you through the process or help you understand what your results mean once you have them."
}

Our AI system provides:
• Instant result notifications
• Easy-to-understand explanations  
• Trend analysis over time
• Risk assessments and recommendations`
      suggestions = isLoggedIn
        ? ["View my results", "Explain my CBC", "Show trends", "Download report"]
        : ["Help me log in", "Explain test results", "Create account", "Contact support"]
    } else if (userInput.includes("health") || userInput.includes("symptom") || userInput.includes("medical")) {
      response = `I'm here to help with your health questions! 🏥

I can provide information about:
• Common symptoms and when to seek care
• Laboratory test explanations
• Preventive health measures
• Medication interactions with lab tests
• Preparation instructions for tests

⚠️ **Important**: I provide educational information only. For medical emergencies, call 911 or visit our emergency department immediately.

What specific health question can I help you with?`
      suggestions = [
        "Explain symptoms",
        "Test preparation",
        "Preventive care",
        "Emergency help",
        "Medication questions",
      ]
    } else if (userInput.includes("emergency") || userInput.includes("urgent") || userInput.includes("help")) {
      response = `🚨 **Emergency Support Available 24/7**

**For immediate medical emergencies:**
• Call 911 or go to the nearest emergency room
• Our hospital: (043) 286-2531

**For urgent lab questions:**
• I can connect you with our live medical team
• Available 24/7 for critical results
• Direct line to on-call physicians

**Current status:** All emergency services are operational

Would you like me to connect you with live support now?`
      suggestions = ["Connect live support", "Call emergency", "Urgent lab question", "Hospital directions"]
    } else if (userInput.includes("price") || userInput.includes("cost") || userInput.includes("payment")) {
      response = `Here's our current pricing for popular tests: 💰

**Basic Tests:**
• Complete Blood Count - ₱350
• Urinalysis - ₱200
• Blood Sugar - ₱150

**Comprehensive Panels:**
• Executive Health Package - ₱3,500
• Cardiac Risk Assessment - ₱2,800
• Diabetes Panel - ₱1,200

**Payment Options:**
• Cash, Credit Cards, GCash
• HMO partnerships available
• Installment plans for packages
• Senior citizen & PWD discounts

Would you like details about a specific test or payment option?`
      suggestions = ["Executive package", "HMO coverage", "Payment plans", "Discounts available", "Book now"]
    } else if (userInput.includes("live") || userInput.includes("human") || userInput.includes("doctor")) {
      response = `I can connect you with our live medical experts! 👨‍⚕️👩‍⚕️

**Available Support:**
• Medical Technologists (24/7)
• Laboratory Physicians (8 AM - 8 PM)
• Patient Care Coordinators (24/7)
• Emergency Medical Team (24/7)

**Current Wait Time:** Less than 2 minutes

Our live agents can help with:
• Complex medical questions
• Urgent result interpretations  
• Appointment scheduling
• Insurance and billing issues

Would you like me to connect you now?`
      suggestions = ["Connect now", "Schedule callback", "Medical emergency", "Billing question", "Continue with AI"]
    } else if (userInput.includes("hours") || userInput.includes("time") || userInput.includes("open")) {
      response = `Here are our operating hours: 🕐

**Laboratory Services:**
• Monday - Friday: 6:00 AM - 8:00 PM
• Saturday: 7:00 AM - 6:00 PM  
• Sunday: 8:00 AM - 4:00 PM

**Emergency Services:** 24/7/365

**Sample Collection:**
• Walk-ins welcome during operating hours
• Home service available (additional fee)
• Priority scheduling for seniors & PWDs

**Current Status:** 🟢 Open and accepting patients

Would you like to schedule an appointment?`
      suggestions = ["Book appointment", "Home service", "Emergency hours", "Holiday schedule", "Directions"]
    } else {
      // Default AI response
      response = `I understand you're asking about "${userInput}". Let me help you with that! 🤖

I'm powered by advanced AI to assist with:
• Laboratory services and test information
• Health questions and guidance  
• Appointment booking and scheduling
• Result explanations and insights
• Connecting with live medical experts

Could you please be more specific about what you need help with? I'm here to provide the best possible assistance!`
      suggestions = ["Book lab test", "Health question", "View results", "Contact support", "Emergency help", "FAQ"]
    }

    addMessage(response, "bot", suggestions)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    handleSendMessage()
  }

  const handleQuickAction = (action: string) => {
    let message = ""
    switch (action) {
      case "book_appointment":
        message = "I'd like to book a laboratory appointment"
        break
      case "view_results":
        message = "Can you help me view my test results?"
        break
      case "health_questions":
        message = "I have a health question"
        break
      case "contact_support":
        message = "I need to speak with live support"
        break
    }
    setInputMessage(message)
    handleSendMessage()
  }

  const handleFeedback = (messageId: string, rating: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg)))

    if (rating === "positive") {
      addMessage("Thank you for your feedback! 😊 Is there anything else I can help you with?", "bot")
    } else {
      addMessage(
        "I apologize that wasn't helpful. Let me connect you with a live agent who can better assist you. 🤝",
        "bot",
        ["Connect live agent", "Try different question", "View FAQ"],
      )
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add a toast notification here
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <Card
        className={`w-full max-w-md h-[600px] shadow-2xl border-0 bg-white/95 backdrop-blur-xl pointer-events-auto transition-all duration-500 ${isMinimized ? "h-16" : "h-[600px]"}`}
      >
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-white/50">
                  <AvatarFallback className="bg-white/20 text-white">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-lg font-bold">MAES AI Assistant</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-emerald-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online • Powered by AI</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-2"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 p-2">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 text-xs hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                  >
                    <action.icon className="w-3 h-3" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto max-h-96 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                      {/* Message Actions */}
                      {message.type === "bot" && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, "positive")}
                              className="p-1 h-6 w-6 hover:bg-green-100"
                            >
                              <ThumbsUp
                                className={`w-3 h-3 ${message.rating === "positive" ? "text-green-600" : "text-gray-400"}`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, "negative")}
                              className="p-1 h-6 w-6 hover:bg-red-100"
                            >
                              <ThumbsDown
                                className={`w-3 h-3 ${message.rating === "negative" ? "text-red-600" : "text-gray-400"}`}
                              />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="p-1 h-6 w-6 hover:bg-gray-200"
                          >
                            <Copy className="w-3 h-3 text-gray-400" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-2 py-1 h-auto bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className={`${message.type === "user" ? "order-1 ml-2" : "order-2 mr-2"}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className={message.type === "user" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"}
                      >
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-emerald-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 min-h-[40px] max-h-[100px] resize-none border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>AI Assistant Active</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Response time: &lt;30s</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSuggestionClick("Connect with live support")}
                    className="text-emerald-600 hover:text-emerald-700 p-0 h-auto font-medium"
                  >
                    Live Support Available
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
