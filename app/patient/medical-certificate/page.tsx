"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, User, Building, Clock, CheckCircle, AlertCircle, Download, Eye, Send } from "lucide-react"
import PatientLayout from "@/components/patient-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"

const certificateTypes = [
  {
    id: "fitness",
    name: "Medical Fitness Certificate",
    description: "For employment, school, or general fitness purposes",
    price: 200,
    duration: "24 hours",
  },
  {
    id: "sick-leave",
    name: "Sick Leave Certificate",
    description: "For work or school absence due to illness",
    price: 150,
    duration: "2 hours",
  },
  {
    id: "pre-employment",
    name: "Pre-Employment Medical Certificate",
    description: "Comprehensive medical clearance for employment",
    price: 500,
    duration: "48 hours",
  },
  {
    id: "travel",
    name: "Travel Medical Certificate",
    description: "For international travel requirements",
    price: 300,
    duration: "24 hours",
  },
  {
    id: "sports",
    name: "Sports Participation Certificate",
    description: "Medical clearance for sports activities",
    price: 250,
    duration: "24 hours",
  },
]

const previousCertificates = [
  {
    id: "cert-001",
    type: "Medical Fitness Certificate",
    requestDate: "2024-01-10",
    status: "completed",
    purpose: "Employment at ABC Company",
    downloadUrl: "#",
  },
  {
    id: "cert-002",
    type: "Sick Leave Certificate",
    requestDate: "2024-01-05",
    status: "completed",
    purpose: "Work absence - Flu",
    downloadUrl: "#",
  },
  {
    id: "cert-003",
    type: "Pre-Employment Medical Certificate",
    requestDate: "2023-12-20",
    status: "completed",
    purpose: "Job application at XYZ Corp",
    downloadUrl: "#",
  },
]

export default function MedicalCertificatePage() {
  const [selectedType, setSelectedType] = useState("")
  const [purpose, setPurpose] = useState("")
  const [employerName, setEmployerName] = useState("")
  const [employerAddress, setEmployerAddress] = useState("")
  const [urgentRequest, setUrgentRequest] = useState("no")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedType("")
        setPurpose("")
        setEmployerName("")
        setEmployerAddress("")
        setUrgentRequest("no")
        setAdditionalNotes("")
      }, 3000)
    }, 2000)
  }

  const selectedCertificate = certificateTypes.find((cert) => cert.id === selectedType)

  if (showSuccess) {
    return (
      <PatientLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">Request Submitted Successfully!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your medical certificate request has been submitted. You will receive an email notification once it's
                ready.
              </p>
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-green-800 mb-2">What's Next:</h3>
                <ul className="text-left text-green-700 space-y-2">
                  <li>• Your request will be reviewed by our medical team</li>
                  <li>• You'll receive an email when the certificate is ready</li>
                  <li>• Download your certificate from the patient portal</li>
                  <li>• Contact us if you need any assistance</li>
                </ul>
              </div>
              <Button onClick={() => setShowSuccess(false)} className="bg-green-600 hover:bg-green-700">
                Request Another Certificate
              </Button>
            </CardContent>
          </Card>
        </div>
      </PatientLayout>
    )
  }

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Certificate Request</h1>
          <p className="text-xl text-gray-600">Request official medical certificates for various purposes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Certificate Type Selection */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Certificate Type</span>
                  </CardTitle>
                  <CardDescription>Select the type of medical certificate you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedType} onValueChange={setSelectedType} required>
                    <div className="space-y-4">
                      {certificateTypes.map((cert) => (
                        <div
                          key={cert.id}
                          className="flex items-start space-x-3 p-4 border rounded-xl hover:bg-gray-50"
                        >
                          <RadioGroupItem value={cert.id} id={cert.id} className="mt-1" />
                          <Label htmlFor={cert.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-gray-900">{cert.name}</h3>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">₱{cert.price}</div>
                                <div className="text-xs text-gray-500">{cert.duration}</div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{cert.description}</p>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Certificate Details */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Certificate Details</span>
                  </CardTitle>
                  <CardDescription>Provide details for your medical certificate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Certificate *</Label>
                    <Input
                      id="purpose"
                      placeholder="e.g., Employment at ABC Company, School enrollment, etc."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                      className="border-gray-300 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employer">Company/Institution Name</Label>
                      <Input
                        id="employer"
                        placeholder="Enter company or institution name"
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        className="border-gray-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgent">Urgent Request</Label>
                      <Select value={urgentRequest} onValueChange={setUrgentRequest}>
                        <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No - Standard Processing</SelectItem>
                          <SelectItem value="yes">Yes - Rush Processing (+₱100)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Company/Institution Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address"
                      value={employerAddress}
                      onChange={(e) => setEmployerAddress(e.target.value)}
                      className="min-h-20 border-gray-300 focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or additional information"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="min-h-20 border-gray-300 focus:border-emerald-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              {selectedCertificate && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span>Request Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="font-medium">Certificate Type:</span>
                        <span className="text-blue-700">{selectedCertificate.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="font-medium">Processing Time:</span>
                        <span className="text-blue-700">{selectedCertificate.duration}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="font-medium">Base Price:</span>
                        <span className="text-blue-700">₱{selectedCertificate.price}</span>
                      </div>
                      {urgentRequest === "yes" && (
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="font-medium">Rush Processing:</span>
                          <span className="text-orange-600">+₱100</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 text-xl font-bold text-blue-700">
                        <span>Total Amount:</span>
                        <span>₱{selectedCertificate.price + (urgentRequest === "yes" ? 100 : 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Important Information */}
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  <strong>Important:</strong> Medical certificates will be issued based on your medical records and
                  recent test results. Additional tests may be required for certain certificate types. You will be
                  notified if any additional requirements are needed.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={!selectedType || !purpose || isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Submitting Request...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Submit Certificate Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Previous Certificates */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span>Previous Certificates</span>
                </CardTitle>
                <CardDescription>Your certificate history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previousCertificates.map((cert) => (
                    <div key={cert.id} className="p-4 bg-gray-50 rounded-xl border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-green-100 text-green-800 text-xs">{cert.status}</Badge>
                        <span className="text-xs text-gray-500">{cert.requestDate}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{cert.type}</h4>
                      <p className="text-sm text-gray-600 mb-3">{cert.purpose}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Information */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-purple-700">
                  <p>
                    <strong>Processing Times:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Standard: 24-48 hours</li>
                    <li>Rush: 2-4 hours (+₱100)</li>
                  </ul>

                  <p>
                    <strong>Required Information:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Valid ID</li>
                    <li>Recent medical records</li>
                    <li>Purpose of certificate</li>
                  </ul>

                  <p>
                    <strong>Contact Support:</strong>
                  </p>
                  <p className="text-xs">(043) 286-2531</p>
                  <p className="text-xs">support@maes-laboratory.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  )
}
