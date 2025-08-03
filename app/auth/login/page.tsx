"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Stethoscope, ArrowLeft, User, Shield } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"patient" | "admin">("patient")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      if (userType === "admin") {
        alert("Admin login successful! Redirecting to admin dashboard...")
        // In real app: router.push('/admin/dashboard')
      } else {
        alert("Patient login successful! Redirecting to patient dashboard...")
        // In real app: router.push('/patient/dashboard')
      }
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="font-heading font-bold text-3xl text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your MAES Laboratory account</p>
        </div>

        {/* User Type Selection */}
        <div className="card">
          <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setUserType("patient")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                userType === "patient" ? "bg-white text-primary-700 shadow-sm" : "text-gray-600 hover:text-gray-700"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType("admin")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                userType === "admin" ? "bg-white text-primary-700 shadow-sm" : "text-gray-600 hover:text-gray-700"
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder={
                    userType === "admin" ? "admin@maeslaboratory.com" : "your.email@example.com"
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 text-lg relative">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${userType === "admin" ? "Admin" : "Patient"}`
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {userType === "patient" ? "Don't have an account?" : "Need admin access?"}
                </span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            {userType === "patient" ? (
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Create a new patient account
              </Link>
            ) : (
              <p className="text-gray-500 text-sm">
                Admin accounts are created by system administrators.
                <br />
                Contact IT support for access.
              </p>
            )}
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Demo Credentials
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <div className="bg-white rounded p-2">
              <p className="font-medium">Patient Demo:</p>
              <p>Email: patient@demo.com</p>
              <p>Password: patient123</p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="font-medium">Admin Demo:</p>
              <p>Email: admin@maeslaboratory.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
