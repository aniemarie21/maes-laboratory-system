"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Shield, Users, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useNotifications, NotificationProvider } from "@/components/notification-system"

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "patient"
  const { addNotification } = useNotifications()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simulate authentication
    setTimeout(() => {
      if (userType === "admin") {
        // Admin credentials (hidden from UI)
        if (email === "admin@megh.com.ph" && password === "MeghAdmin2024!") {
          localStorage.setItem("userEmail", email)
          localStorage.setItem("userType", "admin")

          addNotification({
            title: "Login Successful",
            message: "Welcome back, Admin! You have successfully logged in.",
            type: "success",
            category: "system",
            persistent: true,
          })

          router.push("/admin/dashboard")
        } else {
          setError("Invalid admin credentials. Please check your email and password.")
          addNotification({
            title: "Login Failed",
            message: "Invalid admin credentials. Please try again.",
            type: "error",
            category: "system",
          })
        }
      } else {
        // Patient login - more flexible for demo
        if (email && password) {
          localStorage.setItem("userEmail", email)
          localStorage.setItem("userType", "patient")

          addNotification({
            title: "Login Successful",
            message: "Welcome back! You have successfully logged in to your patient portal.",
            type: "success",
            category: "system",
            persistent: true,
          })

          router.push("/patient/dashboard")
        } else {
          setError("Please enter both email and password.")
          addNotification({
            title: "Login Failed",
            message: "Please enter both email and password.",
            type: "error",
            category: "system",
          })
        }
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)

    // Simulate Google OAuth
    setTimeout(() => {
      const mockGoogleUser = {
        email: "user@gmail.com",
        name: "John Doe",
      }

      localStorage.setItem("userEmail", mockGoogleUser.email)
      localStorage.setItem("userType", userType)
      localStorage.setItem("userName", mockGoogleUser.name)

      addNotification({
        title: "Google Login Successful",
        message: `Welcome ${mockGoogleUser.name}! You have successfully logged in with Google.`,
        type: "success",
        category: "system",
        persistent: true,
      })

      if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/patient/dashboard")
      }

      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="border-emerald-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Image
                  src="/images/maes-logo.avif"
                  alt="Maria Estrella General Hospital Logo"
                  width={80}
                  height={80}
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  {userType === "admin" ? (
                    <Shield className="w-3 h-3 text-white" />
                  ) : (
                    <Users className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              {userType === "admin" ? "Admin Portal" : "Patient Portal"}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {userType === "admin"
                ? "Access the laboratory management system"
                : "Access your laboratory services and results"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-800 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder={userType === "admin" ? "admin@megh.com.ph" : "your.email@example.com"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-800 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/auth/forgot-password" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  `Sign in to ${userType === "admin" ? "Admin" : "Patient"} Portal`
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full border-emerald-200 hover:bg-emerald-50 py-3 bg-transparent"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </div>
              )}
            </Button>

            {userType === "patient" && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register?type=patient"
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            )}

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Demo Access Information
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                {userType === "admin" ? (
                  <p>Admin credentials are configured securely in the system.</p>
                ) : (
                  <>
                    <p>• Use any valid email format for patient login</p>
                    <p>• Or click "Continue with Google" for quick access</p>
                    <p>• Create a new account if you don't have one</p>
                  </>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-emerald-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emerald-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Switch Portal Type */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {userType === "admin" ? "Are you a patient?" : "Are you an administrator?"}
          </p>
          <Link
            href={`/auth/login?type=${userType === "admin" ? "patient" : "admin"}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {userType === "admin" ? (
              <>
                <Users className="w-4 h-4 mr-2" />
                Access Patient Portal
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Access Admin Portal
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <NotificationProvider>
      <LoginContent />
    </NotificationProvider>
  )
}
