"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Smartphone, Building, Shield, AlertCircle, Save, Copy, Eye, EyeOff } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export default function PaymentSettingsPage() {
  const [gcashSettings, setGcashSettings] = useState({
    enabled: true,
    accountName: "Maria Estrella General Hospital",
    accountNumber: "09123456789",
    displayQR: true,
    instructions: "Please include your name and appointment reference number in the payment notes.",
  })

  const [bankSettings, setBankSettings] = useState({
    enabled: true,
    bankName: "BDO",
    accountName: "Maria Estrella General Hospital",
    accountNumber: "1234567890",
    instructions: "Please include your name and appointment reference number in the payment notes.",
  })

  const [hmoSettings, setHmoSettings] = useState({
    enabled: true,
    acceptedProviders: ["Maxicare", "Medicard", "Intellicare", "Valucare", "PhilHealth", "Cocolife", "Insular Health"],
    instructions:
      "Please upload a clear photo of your HMO card (front and back) when booking an appointment. Pre-authorization may be required for some procedures.",
    newProvider: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    requireVerification: true,
    hideAccountDetails: false,
    allowPartialPayments: false,
    sendPaymentReminders: true,
    storePaymentInfo: false,
  })

  const [showAccountNumber, setShowAccountNumber] = useState(false)

  const handleAddHMOProvider = () => {
    if (hmoSettings.newProvider.trim()) {
      setHmoSettings({
        ...hmoSettings,
        acceptedProviders: [...hmoSettings.acceptedProviders, hmoSettings.newProvider.trim()],
        newProvider: "",
      })
    }
  }

  const handleRemoveHMOProvider = (provider: string) => {
    setHmoSettings({
      ...hmoSettings,
      acceptedProviders: hmoSettings.acceptedProviders.filter((p) => p !== provider),
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const handleSaveSettings = () => {
    // Here you would normally save to your backend
    alert("Payment settings saved successfully!")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Payment Settings</h1>
          <p className="text-gray-600">Configure payment methods and options for laboratory services</p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            These settings will be visible to patients when they book laboratory services. Make sure all information is
            accurate and up-to-date.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="gcash" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="gcash">
              <Smartphone className="w-4 h-4 mr-2" />
              GCash
            </TabsTrigger>
            <TabsTrigger value="bank">
              <Building className="w-4 h-4 mr-2" />
              Bank Transfer
            </TabsTrigger>
            <TabsTrigger value="hmo">
              <CreditCard className="w-4 h-4 mr-2" />
              HMO Coverage
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gcash" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-800">GCash Settings</CardTitle>
                    <CardDescription>Configure GCash payment options</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="gcash-enabled" className="text-sm font-medium">
                      Enable GCash
                    </Label>
                    <Switch
                      id="gcash-enabled"
                      checked={gcashSettings.enabled}
                      onCheckedChange={(checked) => setGcashSettings({ ...gcashSettings, enabled: checked })}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gcash-account-name">Account Name</Label>
                  <Input
                    id="gcash-account-name"
                    value={gcashSettings.accountName}
                    onChange={(e) => setGcashSettings({ ...gcashSettings, accountName: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-500"
                    disabled={!gcashSettings.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gcash-account-number">Account Number</Label>
                  <div className="relative">
                    <Input
                      id="gcash-account-number"
                      type={showAccountNumber ? "text" : "password"}
                      value={gcashSettings.accountNumber}
                      onChange={(e) => setGcashSettings({ ...gcashSettings, accountNumber: e.target.value })}
                      className="border-emerald-200 focus:border-emerald-500 pr-20"
                      disabled={!gcashSettings.enabled}
                    />
                    <div className="absolute right-2 top-2 flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                        className="h-6 w-6 p-0"
                      >
                        {showAccountNumber ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(gcashSettings.accountNumber)}
                        className="h-6 w-6 p-0"
                        disabled={!gcashSettings.enabled}
                      >
                        <Copy className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="display-qr"
                    checked={gcashSettings.displayQR}
                    onCheckedChange={(checked) => setGcashSettings({ ...gcashSettings, displayQR: checked })}
                    disabled={!gcashSettings.enabled}
                  />
                  <Label htmlFor="display-qr" className="text-sm font-medium">
                    Display QR Code to patients
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gcash-instructions">Payment Instructions</Label>
                  <Textarea
                    id="gcash-instructions"
                    value={gcashSettings.instructions}
                    onChange={(e) => setGcashSettings({ ...gcashSettings, instructions: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-500"
                    rows={3}
                    disabled={!gcashSettings.enabled}
                  />
                </div>

                <div className="pt-4">
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      For security reasons, we recommend updating your GCash account details periodically.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save GCash Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-800">Bank Transfer Settings</CardTitle>
                    <CardDescription>Configure bank transfer payment options</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="bank-enabled" className="text-sm font-medium">
                      Enable Bank Transfer
                    </Label>
                    <Switch
                      id="bank-enabled"
                      checked={bankSettings.enabled}
                      onCheckedChange={(checked) => setBankSettings({ ...bankSettings, enabled: checked })}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-500"
                    disabled={!bankSettings.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-account-name">Account Name</Label>
                  <Input
                    id="bank-account-name"
                    value={bankSettings.accountName}
                    onChange={(e) => setBankSettings({ ...bankSettings, accountName: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-500"
                    disabled={!bankSettings.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-account-number">Account Number</Label>
                  <div className="relative">
                    <Input
                      id="bank-account-number"
                      type={showAccountNumber ? "text" : "password"}
                      value={bankSettings.accountNumber}
                      onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                      className="border-emerald-200 focus:border-emerald-500 pr-20"
                      disabled={!bankSettings.enabled}
                    />
                    <div className="absolute right-2 top-2 flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                        className="h-6 w-6 p-0"
                      >
                        {showAccountNumber ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankSettings.accountNumber)}
                        className="h-6 w-6 p-0"
                        disabled={!bankSettings.enabled}
                      >
                        <Copy className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-instructions">Payment Instructions</Label>
                  <Textarea
                    id="bank-instructions"
                    value={bankSettings.instructions}
                    onChange={(e) => setBankSettings({ ...bankSettings, instructions: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-500"
                    rows={3}
                    disabled={!bankSettings.enabled}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Bank Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="hmo" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-800">HMO Coverage Settings</CardTitle>
                    <CardDescription>Configure accepted HMO providers and policies</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="hmo-enabled" className="text-sm font-medium">
                      Enable HMO Coverage
                    </Label>
                    <Switch
                      id="hmo-enabled"
                      checked={hmoSettings.enabled}
                      onCheckedChange={(checked) => setHmoSettings({ ...hmoSettings, enabled: checked })}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Accepted HMO Providers</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hmoSettings.acceptedProviders.map((provider) => (
                      <div
                        key={provider}
                        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {provider}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveHMOProvider(provider)}
                          className="h-5 w-5 p-0 ml-1 hover:bg-emerald-200 rounded-full"
                          disabled={!hmoSettings.enabled}
                        >
                          <span className="sr-only">Remove</span>
                          <span aria-hidden="true">×</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={hmoSettings.newProvider}
                      onChange={(e) => setHmoSettings({ ...hmoSettings, newProvider: e.target.value })}
                      className="border-emerald-200 focus:border-emerald-500"
                      placeholder="Add new HMO provider"
                      disabled={!hmoSettings.enabled}
                    />
                    <Button
                      type="button"
                      onClick={handleAddHMOProvider}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={!hmoSettings.enabled || !hmoSettings.newProvider.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hmo-instructions">HMO Instructions for Patients</Label>
                  <Textarea
                    id="hmo-instructions"
                    value={hmoSettings.instructions}
                    onChange={(e) => setHmoSettings({ ...hmoSettings, instructions: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-500"
                    rows={4}
                    disabled={!hmoSettings.enabled}
                  />
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Patients will be required to upload their HMO cards during the booking process. Make sure to verify
                    coverage before approving appointments.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save HMO Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Payment Security Settings</CardTitle>
                <CardDescription>Configure security options for payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-emerald-800">Require Payment Verification</h4>
                    <p className="text-sm text-gray-600">
                      Patients must upload proof of payment before appointment is confirmed
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.requireVerification}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireVerification: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-emerald-800">Hide Account Details Until Approval</h4>
                    <p className="text-sm text-gray-600">
                      Payment details are only shown after appointment request is approved
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.hideAccountDetails}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, hideAccountDetails: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-emerald-800">Allow Partial Payments</h4>
                    <p className="text-sm text-gray-600">Patients can pay a deposit and complete payment on arrival</p>
                  </div>
                  <Switch
                    checked={securitySettings.allowPartialPayments}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, allowPartialPayments: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-emerald-800">Send Payment Reminders</h4>
                    <p className="text-sm text-gray-600">Automatically send reminders for pending payments</p>
                  </div>
                  <Switch
                    checked={securitySettings.sendPaymentReminders}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, sendPaymentReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-emerald-800">Store Payment Information</h4>
                    <p className="text-sm text-gray-600">Save payment details for returning patients (encrypted)</p>
                  </div>
                  <Switch
                    checked={securitySettings.storePaymentInfo}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, storePaymentInfo: checked })
                    }
                  />
                </div>

                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    Always follow PCI DSS guidelines when handling payment information. Never store sensitive card
                    details in plain text.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
