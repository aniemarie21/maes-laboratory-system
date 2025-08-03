"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Settings,
  Save,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Percent,
  Clock,
  Users,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"

const paymentMethods = [
  {
    id: "cash",
    name: "Cash Payment",
    description: "Accept cash payments at the laboratory",
    icon: DollarSign,
    enabled: true,
    settings: {
      acceptedDenominations: ["20", "50", "100", "200", "500", "1000"],
      changePolicy: "Always provide exact change when possible",
    },
  },
  {
    id: "gcash",
    name: "GCash",
    description: "Mobile wallet payments via GCash",
    icon: Smartphone,
    enabled: true,
    settings: {
      merchantNumber: "09123456789",
      merchantName: "MAES Laboratory",
      qrCode: "gcash-qr-code.png",
      fees: "0%",
    },
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Online bank transfers and deposits",
    icon: Building2,
    enabled: true,
    settings: {
      bankName: "Bank of the Philippine Islands (BPI)",
      accountName: "Maria Estrella General Hospital",
      accountNumber: "1234567890123",
      swiftCode: "BOPIPHMM",
    },
  },
  {
    id: "card",
    name: "Credit/Debit Cards",
    description: "Visa, Mastercard, and other major cards",
    icon: CreditCard,
    enabled: false,
    settings: {
      acceptedCards: ["Visa", "Mastercard", "JCB", "American Express"],
      processingFee: "3.5%",
      terminal: "POS Terminal Required",
    },
  },
]

const hmoPartners = [
  { name: "PhilHealth", coverage: "80%", status: "active", patients: 245 },
  { name: "Maxicare", coverage: "90%", status: "active", patients: 156 },
  { name: "Medicard", coverage: "85%", status: "active", patients: 89 },
  { name: "Intellicare", coverage: "75%", status: "active", patients: 67 },
  { name: "Cocolife", coverage: "70%", status: "pending", patients: 23 },
  { name: "Avega", coverage: "80%", status: "inactive", patients: 12 },
]

const discountPrograms = [
  {
    id: "senior",
    name: "Senior Citizen Discount",
    description: "20% discount for patients 60 years and above",
    discount: 20,
    enabled: true,
    requirements: "Valid Senior Citizen ID",
  },
  {
    id: "pwd",
    name: "PWD Discount",
    description: "20% discount for Persons with Disabilities",
    discount: 20,
    enabled: true,
    requirements: "Valid PWD ID",
  },
  {
    id: "student",
    name: "Student Discount",
    description: "10% discount for students",
    discount: 10,
    enabled: false,
    requirements: "Valid Student ID",
  },
  {
    id: "employee",
    name: "Hospital Employee Discount",
    description: "15% discount for hospital employees",
    discount: 15,
    enabled: true,
    requirements: "Valid Employee ID",
  },
]

export default function PaymentSettingsPage() {
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [showGCashNumber, setShowGCashNumber] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Payment Settings</h1>
            <p className="text-xl text-gray-600 mt-2">
              Manage payment methods, HMO partnerships, and discount programs
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 px-8 py-3 text-lg shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Payment settings have been updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="methods" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="methods"
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Methods</span>
            </TabsTrigger>
            <TabsTrigger
              value="hmo"
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>HMO Partners</span>
            </TabsTrigger>
            <TabsTrigger
              value="discounts"
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Percent className="w-4 h-4" />
              <span>Discounts</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Payment Methods Tab */}
          <TabsContent value="methods" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            method.enabled ? "bg-emerald-100" : "bg-gray-100"
                          }`}
                        >
                          <method.icon className={`w-6 h-6 ${method.enabled ? "text-emerald-600" : "text-gray-400"}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.name}</CardTitle>
                          <CardDescription>{method.description}</CardDescription>
                        </div>
                      </div>
                      <Switch checked={method.enabled} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {method.id === "gcash" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>GCash Number</Label>
                            <Button variant="ghost" size="sm" onClick={() => setShowGCashNumber(!showGCashNumber)}>
                              {showGCashNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type={showGCashNumber ? "text" : "password"}
                              value={method.settings.merchantNumber}
                              readOnly
                              className="font-mono"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(method.settings.merchantNumber)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div>
                            <Label>Merchant Name</Label>
                            <Input value={method.settings.merchantName} className="mt-1" />
                          </div>
                        </div>
                      )}

                      {method.id === "bank" && (
                        <div className="space-y-3">
                          <div>
                            <Label>Bank Name</Label>
                            <Input value={method.settings.bankName} className="mt-1" />
                          </div>
                          <div>
                            <Label>Account Name</Label>
                            <Input value={method.settings.accountName} className="mt-1" />
                          </div>
                          <div>
                            <Label>Account Number</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                type={showAccountNumber ? "text" : "password"}
                                value={method.settings.accountNumber}
                                className="font-mono"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAccountNumber(!showAccountNumber)}
                              >
                                {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(method.settings.accountNumber)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {method.id === "cash" && (
                        <div className="space-y-3">
                          <div>
                            <Label>Change Policy</Label>
                            <Textarea value={method.settings.changePolicy} className="mt-1 min-h-20" />
                          </div>
                        </div>
                      )}

                      {method.id === "card" && (
                        <div className="space-y-3">
                          <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-700">
                              Card payments require a POS terminal and merchant account setup.
                            </AlertDescription>
                          </Alert>
                          <div>
                            <Label>Processing Fee</Label>
                            <Input value={method.settings.processingFee} className="mt-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* HMO Partners Tab */}
          <TabsContent value="hmo" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>HMO Partnership Management</span>
                </CardTitle>
                <CardDescription>Manage health insurance partnerships and coverage rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hmoPartners.map((hmo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{hmo.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Coverage: {hmo.coverage}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{hmo.patients} patients</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          className={`${
                            hmo.status === "active"
                              ? "bg-green-100 text-green-800"
                              : hmo.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {hmo.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Add New HMO Partner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {discountPrograms.map((program) => (
                <Card key={program.id} className="border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <CardDescription>{program.description}</CardDescription>
                      </div>
                      <Switch checked={program.enabled} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <span className="font-medium text-emerald-800">Discount Rate</span>
                        <span className="text-2xl font-bold text-emerald-600">{program.discount}%</span>
                      </div>

                      <div>
                        <Label>Requirements</Label>
                        <Input value={program.requirements} className="mt-1" />
                      </div>

                      <div>
                        <Label>Additional Notes</Label>
                        <Textarea
                          placeholder="Any additional requirements or conditions..."
                          className="mt-1 min-h-20"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Payment Security</span>
                  </CardTitle>
                  <CardDescription>Configure security settings for payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium text-green-800">SSL Encryption</span>
                      <p className="text-sm text-green-600">All payment data is encrypted</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium text-green-800">PCI Compliance</span>
                      <p className="text-sm text-green-600">Payment card industry standards</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="font-medium text-blue-800">Transaction Monitoring</span>
                      <p className="text-sm text-blue-600">Real-time fraud detection</p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="font-medium text-blue-800">Payment Notifications</span>
                      <p className="text-sm text-blue-600">Email alerts for transactions</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span>Transaction Limits</span>
                  </CardTitle>
                  <CardDescription>Set daily and transaction limits for security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Daily Transaction Limit</Label>
                    <Input type="number" placeholder="50000" className="mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Maximum daily transaction amount in PHP</p>
                  </div>

                  <div>
                    <Label>Single Transaction Limit</Label>
                    <Input type="number" placeholder="10000" className="mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Maximum single transaction amount in PHP</p>
                  </div>

                  <div>
                    <Label>Minimum Transaction Amount</Label>
                    <Input type="number" placeholder="50" className="mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Minimum transaction amount in PHP</p>
                  </div>

                  <Alert className="bg-purple-50 border-purple-200">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-700">
                      Transaction limits help prevent fraud and ensure secure payment processing.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
