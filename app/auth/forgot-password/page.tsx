"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Check if it's admin email
      if (email === "mariaestrellageneralhospital@gmail.com") {
        // Simulate sending reset email to admin
        setTimeout(() => {
          setSuccess(true)
          setLoading(false)
        }, 2000)
      } else if (email) {
        // Simulate sending reset email to patient
        setTimeout(() => {
          setSuccess(true)
          setLoading(false)
        }, 2000)
      } else {
        setError("Please enter a valid email address.")
        setLoading(false)
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-emerald-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-emerald-800">Check Your Email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>Didn't receive the email? Check your spam folder or</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Try again
                </Button>
              </div>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-800">MEGH</h1>
                <p className="text-xs text-emerald-600">Healthcare Portal</p>
              </div>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        <Card className="border-emerald-200 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Forgot Password?</CardTitle>
            <CardDescription className="text-center">
              No worries! Enter your email and we'll send you reset instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 border-emerald-200 focus:border-emerald-500 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">For admin access, use: mariaestrellageneralhospital@gmail.com</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 h-12 text-base font-medium"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
