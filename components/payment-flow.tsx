"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Building, Shield, CheckCircle, Copy, QrCode, Upload, Clock, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNotifications } from "./notification-system"

interface PaymentFlowProps {
  appointmentId: string
  amount: number
  services: string[]
  onPaymentComplete: (paymentData: any) => void
  onCancel: () => void
}

export default function PaymentFlow({
  appointmentId,
  amount,
  services,
  onPaymentComplete,
  onCancel,
}: PaymentFlowProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [step, setStep] = useState<"select" | "details" | "confirm" | "processing" | "complete">("select")
  const [paymentData, setPaymentData] = useState<any>({})
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null)
  const { addNotification } = useNotifications()

  const paymentMethods = [
    {
      id: "gcash",
      name: "GCash",
      icon: Smartphone,
      description: "Pay using GCash mobile wallet",
      processingTime: "Instant",
      fees: "No additional fees",
    },
    {
      id: "paymaya",
      name: "PayMaya",
      icon: CreditCard,
      description: "Pay using PayMaya digital wallet",
      processingTime: "Instant",
      fees: "No additional fees",
    },
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      icon: Building,
      description: "Transfer to our bank account",
      processingTime: "1-2 business days",
      fees: "Bank charges may apply",
    },
    {
      id: "cash",
      name: "Cash Payment",
      icon: CreditCard,
      description: "Pay at the hospital counter",
      processingTime: "Immediate",
      fees: "No additional fees",
    },
  ]

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setStep("details")
  }

  const handlePaymentSubmit = () => {
    setStep("processing")

    // Simulate payment processing
    setTimeout(() => {
      setStep("complete")

      const paymentResult = {
        appointmentId,
        method: selectedMethod,
        amount,
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date(),
        status: "completed",
      }

      addNotification({
        title: "Payment Successful",
        message: `Your payment of ₱${amount.toLocaleString()} has been processed successfully.`,
        type: "success",
        category: "payment",
        persistent: true,
        actionUrl: `/patient/appointments/${appointmentId}`,
        actionText: "View Appointment",
      })

      onPaymentComplete(paymentResult)
    }, 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addNotification({
      title: "Copied to Clipboard",
      message: "Payment details copied successfully",
      type: "success",
      category: "system",
    })
  }

  const renderPaymentDetails = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod)
    if (!method) return null

    switch (selectedMethod) {
      case "gcash":
        return (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Send payment to the GCash number below and upload your receipt
              </AlertDescription>
            </Alert>

            <Card className="border-emerald-200">
              <CardContent className="p-4">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-500" />
                    <span className="sr-only">GCash QR Code</span>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">GCash Number</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input value="09123456789" readOnly className="text-center font-mono" />
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard("09123456789")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Account Name</Label>
                    <Input value="Maria Estrella General Hospital" readOnly className="text-center mt-1" />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Amount to Send</Label>
                    <Input
                      value={`₱${amount.toLocaleString()}`}
                      readOnly
                      className="text-center font-bold text-lg mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="proof">Upload Payment Receipt</Label>
              <div className="border-2 border-dashed border-emerald-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <input
                  type="file"
                  id="proof"
                  accept="image/*"
                  onChange={(e) => setProofOfPayment(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="proof" className="cursor-pointer">
                  <span className="text-sm text-emerald-600 hover:text-emerald-700">
                    {proofOfPayment ? proofOfPayment.name : "Click to upload receipt"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )

      case "bank-transfer":
        return (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Building className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Transfer the exact amount to our bank account and upload your receipt
              </AlertDescription>
            </Alert>

            <Card className="border-emerald-200">
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Bank Name</Label>
                  <Input value="BDO Unibank" readOnly className="mt-1" />
                </div>

                <div>
                  <Label className="text-sm font-medium">Account Name</Label>
                  <Input value="Maria Estrella General Hospital" readOnly className="mt-1" />
                </div>

                <div>
                  <Label className="text-sm font-medium">Account Number</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value="1234567890" readOnly className="font-mono" />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("1234567890")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Amount to Transfer</Label>
                  <Input value={`₱${amount.toLocaleString()}`} readOnly className="font-bold text-lg mt-1" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="bank-proof">Upload Bank Receipt</Label>
              <div className="border-2 border-dashed border-emerald-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <input
                  type="file"
                  id="bank-proof"
                  accept="image/*,.pdf"
                  onChange={(e) => setProofOfPayment(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="bank-proof" className="cursor-pointer">
                  <span className="text-sm text-emerald-600 hover:text-emerald-700">
                    {proofOfPayment ? proofOfPayment.name : "Click to upload receipt"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )

      case "cash":
        return (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CreditCard className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                You can pay in cash at our hospital counter. Please bring this reference number.
              </AlertDescription>
            </Alert>

            <Card className="border-emerald-200">
              <CardContent className="p-4 text-center space-y-4">
                <div>
                  <Label className="text-sm font-medium">Reference Number</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value={`CASH${appointmentId}`} readOnly className="text-center font-mono text-lg" />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(`CASH${appointmentId}`)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Amount to Pay</Label>
                  <Input
                    value={`₱${amount.toLocaleString()}`}
                    readOnly
                    className="text-center font-bold text-xl mt-1"
                  />
                </div>

                <div className="text-sm text-gray-600">
                  <p>Payment Counter Hours:</p>
                  <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
                  <p>Saturday: 8:00 AM - 5:00 PM</p>
                  <p>Sunday: 9:00 AM - 3:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  if (step === "complete") {
    return (
      <Card className="border-green-200">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono">TXN{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold">₱{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="capitalize">{selectedMethod.replace("-", " ")}</span>
              </div>
            </div>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => (window.location.href = "/patient/appointments")}
          >
            View My Appointments
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "processing") {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold text-blue-800 mb-2">Processing Payment...</h3>
          <p className="text-gray-600">Please wait while we verify your payment. This may take a few moments.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Secure Payment
          </CardTitle>
          <CardDescription>Complete your laboratory service payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
              <div className="space-y-1">
                {services.map((service, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {service}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-emerald-700">₱{amount.toLocaleString()}</span>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <Lock className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Your payment is secured with 256-bit SSL encryption
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {step === "select" && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Choose Payment Method</CardTitle>
            <CardDescription>Select your preferred payment option</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <method.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {method.processingTime}
                        </Badge>
                        <span className="text-xs text-gray-500">{method.fees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {step === "details" && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Payment Details</CardTitle>
            <CardDescription>
              Complete your payment using {paymentMethods.find((m) => m.id === selectedMethod)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderPaymentDetails()}

            <div className="flex space-x-4 mt-6">
              <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={selectedMethod !== "cash" && !proofOfPayment}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {selectedMethod === "cash" ? "Confirm Cash Payment" : "Submit Payment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
