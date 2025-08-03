"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Key, Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"email" | "reset">("email")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "patient"

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate email verification
    setTimeout(() => {
      if (userType === "admin" && email === "mariaestrellageneralhospital@gmail.com") {
        setStep("reset")
        setMessage("Admin email verified. You can now reset your password.")
      } else if (userType === "patient" && email) {
        setStep("reset")
        setMessage("Email verified. You can now reset your password.")
      } else {
        setError("Email not found in our system.")
      }
      setIsLoading(false)
    }, 2000)
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      setIsLoading(false)
      return
    }

    // Simulate password reset
    setTimeout(() => {
      setMessage("Password successfully reset! You can now login with your new password.")

      // For demo purposes, we'll show success and redirect
      setTimeout(() => {
        router.push(`/auth/login?type=${userType}`)
      }, 2000)

      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <div className="mb-6">
          <Link
            href={`/auth/login?type=${userType}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

        <Card className="border-emerald-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Image
                  src="/images/maeslogo.avif"
                  alt="Maria Estrella General Hospital Logo"
                  width={80}
                  height={80}
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Key className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              {step === "email" ? "Reset Password" : "Create New Password"}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {step === "email"
                ? `Enter your ${userType} email address to reset your password`
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {message && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-emerald-800 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder={
                        userType === "admin" ? "mariaestrellageneralhospital@gmail.com" : "your.email@example.com"
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying Email...
                    </div>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-emerald-800 font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 w-4 h-4" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter new password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-emerald-800 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Confirm new password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-800 mb-1">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>At least 8 characters long</li>
                    <li>Contains both letters and numbers</li>
                    <li>Avoid common words or patterns</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}

            {/* Security Information */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Security Notice
              </h4>
              <div className="text-xs text-amber-700 space-y-1">
                {userType === "admin" ? (
                  <>
                    <p>• Admin password resets are logged for security</p>
                    <p>• Use a strong, unique password for admin access</p>
                    <p>• Never share admin credentials with unauthorized users</p>
                  </>
                ) : (
                  <>
                    <p>• Password reset instructions are sent securely</p>
                    <p>• Your account will be temporarily locked during reset</p>
                    <p>• Contact support if you need additional help</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
