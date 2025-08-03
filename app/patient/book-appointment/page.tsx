"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, TestTube, CreditCard, User, Check, Clock, Star, Shield } from 'lucide-react'

export default function BookAppointmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",

    // Test Selection
    selectedTests: [] as string[],

    // Date & Time
    selectedDate: "",
    selectedTime: "",

    // Payment
    paymentMethod: "",

    // Additional
    notes: "",
  })

  const laboratoryTests = [
    {
      id: "cbc",
      name: "Complete Blood Count (CBC)",
      price: 350,
      description: "Comprehensive blood analysis including white blood cells, red blood cells, and platelets",
      duration: "2-4 hours",
      popular: true,
      category: "Hematology",
    },
    {
      id: "fbs",
      name: "Fasting Blood Sugar (FBS)",
      price: 150,
      description: "Blood glucose level test for diabetes screening and monitoring",
      duration: "1-2 hours",
      popular: true,
      category: "Clinical Chemistry",
    },
    {
      id: "lipid",
      name: "Lipid Profile",
      price: 450,
      description: "Cholesterol and triglyceride levels for cardiovascular health assessment",
      duration: "2-4 hours",
      popular: false,
      category: "Clinical Chemistry",
    },
    {
      id: "urinalysis",
      name: "Complete Urinalysis",
      price: 120,
      description: "Comprehensive urine analysis for kidney function and urinary tract health",
      duration: "1-2 hours",
      popular: true,
      category: "Clinical Microscopy",
    },
    {
      id: "hbsag",
      name: "Hepatitis B Surface Antigen",
      price: 250,
      description: "Screening test for Hepatitis B infection",
      duration: "2-4 hours",
      popular: false,
      category: "Serology",
    },
    {
      id: "thyroid",
      name: "Thyroid Function Test",
      price: 800,
      description: "TSH, T3, T4 levels for thyroid health evaluation",
      duration: "4-6 hours",
      popular: false,
      category: "Endocrinology",
    },
    {
      id: "creatinine",
      name: "Serum Creatinine",
      price: 180,
      description: "Kidney function assessment test",
      duration: "2-4 hours",
      popular: false,
      category: "Clinical Chemistry",
    },
    {
      id: "uric-acid",
      name: "Uric Acid",
      price: 160,
      description: "Gout and kidney function evaluation",
      duration: "2-4 hours",
      popular: false,
      category: "Clinical Chemistry",
    },
  ]

  const timeSlots = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  const paymentMethods = [
    {
      id: "gcash",
      name: "GCash",
      description: "Pay via GCash mobile wallet",
      icon: "💳",
      popular: true,
    },
    {
      id: "paymaya",
      name: "PayMaya",
      description: "Pay via PayMaya digital wallet",
      icon: "💰",
      popular: true,
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct bank transfer payment",
      icon: "🏦",
      popular: false,
    },
    {
      id: "cash",
      name: "Cash on Visit",
      description: "Pay when you arrive at the laboratory",
      icon: "💵",
      popular: false,
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTestSelection = (testId: string) => {
    const updatedTests = formData.selectedTests.includes(testId)
      ? formData.selectedTests.filter((id) => id !== testId)
      : [...formData.selectedTests, testId]

    setFormData({ ...formData, selectedTests: updatedTests })
  }

  const calculateTotal = () => {
    return formData.selectedTests.reduce((total, testId) => {
      const test = laboratoryTests.find((t) => t.id === testId)
      return total + (test?.price || 0)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(5) // Success step
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Select Tests", icon: TestTube },
    { number: 3, title: "Date & Time", icon: Calendar },
    { number: 4, title: "Payment", icon: CreditCard },
  ]

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth
      case 2:
        return formData.selectedTests.length > 0
      case 3:
        return formData.selectedDate && formData.selectedTime
      case 4:
        return formData.paymentMethod
      default:
        return false
    }
  }

  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="card">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your laboratory appointment has been successfully booked. You will receive a confirmation email shortly with all the details.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Appointment Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formData.selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{formData.selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tests:</span>
                  <span className="font-medium">{formData.selectedTests.length} test(s)</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-primary-600">₱{calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/patient/dashboard" className="btn-primary w-full">
                View My Appointments
              </Link>
              <Link href="/" className="btn-secondary w-full">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">Book Laboratory Appointment</h1>
          <p className="text-gray-600">Schedule your laboratory tests with MAES Laboratory</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    currentStep >= step.number 
                      ? "bg-primary-600 text-white" 
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium transition-colors ${
                    currentStep >= step.number ? "text-primary-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 transition-colors ${
                    currentStep > step.number ? "bg-primary-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <User className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="font-heading font-semibold text-xl text-gray-900">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="09XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Complete address (optional)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Test Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <TestTube className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="font-heading font-semibold text-xl text-gray-900">Select Laboratory Tests</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {laboratoryTests.map((test) => (
                    <div
                      key={test.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
                        formData.selectedTests.includes(test.id)
                          ? "border-primary-500 bg-primary-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => handleTestSelection(test.id)}
                    >
                      {test.popular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h3 className="font-medium text-gray-900 mb-1">{test.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-primary-600">₱{test.price}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {test.duration}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{test.category}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.selectedTests.includes(test.id)}
                          onChange={() => handleTestSelection(test.id)}
                          className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {formData.selectedTests.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Selected Tests Summary:
                    </h3>
                    <div className="space-y-2">
                      {formData.selectedTests.map((testId) => {
                        const test = laboratoryTests.find((t) => t.id === testId)
                        return (
                          <div key={testId} className="flex justify-between text-sm">
                            <span className="text-gray-700">{test?.name}</span>
                            <span className="font-medium">₱{test?.price}</span>
                          </div>
                        )
                      })}
                      <div className="border-t pt-2 mt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-gray-900">Total Amount:</span>
                          <span className="text-primary-600">₱{calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="font-heading font-semibold text-xl text-gray-900">Select Date & Time</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      name="selectedDate"
                      required
                      value={formData.selectedDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                    <select
                      name="selectedTime"
                      required
                      value={formData.selectedTime}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select time slot</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field"
                    placeholder="Any special instructions, medical conditions, or requirements we should know about..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Important Reminders:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Please arrive 15 minutes before your scheduled time</li>
                    <li>• Bring a valid ID and your appointment confirmation</li>
                    <li>• Follow any specific preparation instructions for your tests</li>
                    <li>• Fasting may be required for certain tests (we'll notify you)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="font-heading font-semibold text-xl text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
                        formData.paymentMethod === method.id
                          ? "border-primary-500 bg-primary-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    >
                      {method.popular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Popular
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{method.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Booking Summary */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-primary-600" />
                    Final Booking Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Patient:</span>
                        <div className="font-medium">{formData.firstName} {formData.lastName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <div className="font-medium">{formData.phone}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Date & Time:</span>
                        <div className="font-medium">{formData.selectedDate} at {formData.selectedTime}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Method:</span>
                        <div className="font-medium">
                          {paymentMethods.find(m => m.id === formData.paymentMethod)?.name}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Selected Tests ({formData.selectedTests.length}):</span>
                      <div className="mt-1 space-y-1">
                        {formData.selectedTests.map((testId) => {
                          const test = laboratoryTests.find((t) => t.id === testId)
                          return (
                            <div key={testId} className="flex justify-between">
                              <span className="text-gray-700">• {test?.name}</span>
                              <span className="font-medium">₱{test?.price}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="border-t border-primary-200 pt-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary-600">₱{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isStepValid(currentStep)
                      ? "btn-primary"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !formData.paymentMethod}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    !isLoading && formData.paymentMethod
                      ? "btn-primary"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
