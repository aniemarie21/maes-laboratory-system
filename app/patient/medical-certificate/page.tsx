"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Calendar, Upload, AlertCircle } from "lucide-react"
import PatientLayout from "@/components/patient-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function MedicalCertificatePage() {
  const [formData, setFormData] = useState({
    purpose: "",
    requestDate: new Date().toISOString().split("T")[0],
    requiredDate: "",
    additionalNotes: "",
    certificateType: "",
    addressTo: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    validId: null,
    previousResults: null,
  })

  const [previousTests, setPreviousTests] = useState([
    {
      id: 1,
      service: "Complete Blood Count",
      date: "2024-01-15",
      status: "completed",
      selected: false,
    },
    {
      id: 2,
      service: "Blood Chemistry Panel",
      date: "2023-12-10",
      status: "completed",
      selected: false,
    },
    {
      id: 3,
      service: "Urinalysis",
      date: "2023-11-05",
      status: "completed",
      selected: false,
    },
  ])

  const handleFileUpload = (type: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }))
  }

  const toggleTestSelection = (testId: number) => {
    setPreviousTests((prev) => prev.map((test) => (test.id === testId ? { ...test, selected: !test.selected } : test)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally submit to your backend
    alert("Medical certificate request submitted! Our team will process your request within 24-48 hours.")
  }

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Request Medical Certificate</h1>
          <p className="text-gray-600">Request official medical certificates based on your laboratory test results</p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Medical certificates are typically processed within 1-2 business days. You will be notified when your
            certificate is ready for download or pickup.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificate Details */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Certificate Details
              </CardTitle>
              <CardDescription>Provide information about the certificate you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select
                  value={formData.certificateType}
                  onValueChange={(value) => setFormData({ ...formData, certificateType: value })}
                >
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Medical Certificate</SelectItem>
                    <SelectItem value="fitness">Fitness to Work/Study Certificate</SelectItem>
                    <SelectItem value="lab-results">Laboratory Results Certificate</SelectItem>
                    <SelectItem value="travel">Medical Certificate for Travel</SelectItem>
                    <SelectItem value="insurance">Medical Certificate for Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Certificate</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="border-green-200 focus:border-green-500"
                  placeholder="e.g., Employment, School, Insurance, Travel"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressTo">Address Certificate To (Optional)</Label>
                <Input
                  id="addressTo"
                  value={formData.addressTo}
                  onChange={(e) => setFormData({ ...formData, addressTo: e.target.value })}
                  className="border-green-200 focus:border-green-500"
                  placeholder="e.g., To Whom It May Concern, Company Name, School Name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestDate">Request Date</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                    className="border-green-200 focus:border-green-500"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredDate">Date Required By</Label>
                  <Input
                    id="requiredDate"
                    type="date"
                    value={formData.requiredDate}
                    onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                    className="border-green-200 focus:border-green-500"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="border-green-200 focus:border-green-500"
                  placeholder="Any specific information you want included in the certificate"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Previous Test Results */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Select Relevant Test Results
              </CardTitle>
              <CardDescription>Choose the test results to include in your certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {previousTests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      test.selected ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                    onClick={() => toggleTestSelection(test.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">{test.service}</h4>
                        <p className="text-sm text-gray-600">Test Date: {test.date}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">{test.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {previousTests.filter((t) => t.selected).length === 0 && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    Please select at least one test result to include in your certificate.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Additional Documents (Optional)
              </CardTitle>
              <CardDescription>Upload any additional documents that may be required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validId">Valid ID</Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <input
                      type="file"
                      id="validId"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("validId", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="validId" className="cursor-pointer">
                      <span className="text-sm text-green-600 hover:text-green-700">
                        {uploadedFiles.validId ? uploadedFiles.validId.name : "Click to upload"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousResults">Previous External Results (Optional)</Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <input
                      type="file"
                      id="previousResults"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("previousResults", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="previousResults" className="cursor-pointer">
                      <span className="text-sm text-green-600 hover:text-green-700">
                        {uploadedFiles.previousResults ? uploadedFiles.previousResults.name : "Click to upload"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Delivery Options
              </CardTitle>
              <CardDescription>Choose how you want to receive your certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50">
                  <div className="flex items-center justify-center h-12 mb-2">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-center text-green-800">Digital Download</h4>
                  <p className="text-xs text-center text-gray-600 mt-1">Available within 24-48 hours</p>
                </div>

                <div className="border rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50">
                  <div className="flex items-center justify-center h-12 mb-2">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-center text-green-800">Pickup at Laboratory</h4>
                  <p className="text-xs text-center text-gray-600 mt-1">Available within 24-48 hours</p>
                </div>

                <div className="border rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50">
                  <div className="flex items-center justify-center h-12 mb-2">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-center text-green-800">Email Delivery</h4>
                  <p className="text-xs text-center text-gray-600 mt-1">Sent to your registered email</p>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Digital certificates are signed electronically and include a verification QR code. Physical
                  certificates will have an official stamp and signature.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
              disabled={previousTests.filter((t) => t.selected).length === 0}
            >
              Submit Certificate Request
            </Button>
          </div>
        </form>
      </div>
    </PatientLayout>
  )
}
