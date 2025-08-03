"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  FileText,
  Shield,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  Award,
  Clock,
  Activity,
  CheckCircle,
  MessageSquare,
  Menu,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatSupport from "@/components/chat-support"
import { NotificationProvider } from "@/components/notification-system"

export default function HomePage() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-emerald-100 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src="/images/maes-logo.avif"
                    alt="Maria Estrella General Hospital Logo"
                    width={60}
                    height={60}
                    className="rounded-xl shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                    Maria Estrella General Hospital
                  </h1>
                  <p className="text-sm text-emerald-600 font-medium">Laboratory Services Department</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex space-x-3">
                <Link href="/auth/login?type=patient">
                  <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent shadow-sm"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Patient Portal
                  </Button>
                </Link>
                <Link href="/auth/login?type=admin">
                  <Button className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 shadow-lg">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Portal
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 pb-4 border-t border-emerald-100">
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/auth/login?type=patient">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Patient Portal
                    </Button>
                  </Link>
                  <Link href="/auth/login?type=admin">
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Portal
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section with Hospital Image */}
        <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hospital-building.jpg"
              alt="Maria Estrella General Hospital Building"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-green-900/90"></div>
          </div>
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 sm:mb-8 border border-white/30">
                <Award className="w-4 h-4 mr-2" />
                Trusted Laboratory Services • Calapan, MIMAROPA
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight drop-shadow-lg">
                Advanced Laboratory
                <br />
                <span className="text-2xl sm:text-3xl lg:text-5xl bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent">
                  Services & Diagnostics
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-emerald-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow">
                Experience seamless laboratory services with our state-of-the-art digital platform. Book tests, access
                results instantly, and manage your health journey with confidence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
                <Link href="/auth/register?type=patient">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 px-8 sm:px-10 py-4 text-base sm:text-lg shadow-2xl font-semibold"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Laboratory Test
                  </Button>
                </Link>
                <Link href="#services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8 sm:px-10 py-4 text-base sm:text-lg backdrop-blur-sm shadow-2xl font-semibold bg-transparent"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    View All Tests
                  </Button>
                </Link>
              </div>

              {/* Hospital Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                {[
                  { number: "50K+", label: "Tests Performed", icon: Activity },
                  { number: "29+", label: "Years Experience", icon: Award },
                  { number: "24/7", label: "Emergency Testing", icon: Clock },
                  { number: "98%", label: "Accuracy Rate", icon: Star },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl"
                  >
                    <stat.icon className="w-8 sm:w-10 h-8 sm:h-10 text-emerald-200 mx-auto mb-3" />
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-emerald-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Laboratory Services */}
        <section id="services" className="py-16 sm:py-24 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16 sm:mb-20">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
                Our Laboratory Services
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive diagnostic services with state-of-the-art equipment and expert medical professionals
                providing accurate and timely results.
              </p>
            </div>

            <Tabs defaultValue="hematology" className="w-full max-w-5xl mx-auto">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-8 w-full">
                <TabsTrigger value="hematology" className="text-xs sm:text-sm">
                  Hematology
                </TabsTrigger>
                <TabsTrigger value="chemistry" className="text-xs sm:text-sm">
                  Chemistry
                </TabsTrigger>
                <TabsTrigger value="serology" className="text-xs sm:text-sm">
                  Serology
                </TabsTrigger>
                <TabsTrigger value="imaging" className="text-xs sm:text-sm">
                  Imaging
                </TabsTrigger>
              </TabsList>
              <TabsContent value="hematology" className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      name: "Complete Blood Count",
                      price: "₱450",
                      description: "Basic blood test to check overall health",
                    },
                    { name: "Hemoglobin A1c", price: "₱800", description: "Measures blood sugar control over time" },
                    { name: "Coagulation Profile", price: "₱1,200", description: "Evaluates blood clotting function" },
                  ].map((service, index) => (
                    <Card key={index} className="border-emerald-200 hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-800 text-base sm:text-lg">{service.name}</CardTitle>
                        <Badge className="w-fit bg-emerald-100 text-emerald-700">{service.price}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="chemistry" className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { name: "Blood Chemistry Panel", price: "₱1,200", description: "Comprehensive metabolic panel" },
                    { name: "Lipid Profile", price: "₱800", description: "Cholesterol and triglyceride levels" },
                    {
                      name: "Kidney Function Test",
                      price: "₱950",
                      description: "Evaluates kidney health and function",
                    },
                  ].map((service, index) => (
                    <Card key={index} className="border-emerald-200 hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-800 text-base sm:text-lg">{service.name}</CardTitle>
                        <Badge className="w-fit bg-emerald-100 text-emerald-700">{service.price}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="serology" className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { name: "Hepatitis Panel", price: "₱2,000", description: "Hepatitis A, B, C screening" },
                    { name: "Thyroid Function Test", price: "₱1,500", description: "TSH, T3, T4 levels" },
                    { name: "COVID-19 Antibody", price: "₱1,800", description: "Detects previous COVID-19 infection" },
                  ].map((service, index) => (
                    <Card key={index} className="border-emerald-200 hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-800 text-base sm:text-lg">{service.name}</CardTitle>
                        <Badge className="w-fit bg-emerald-100 text-emerald-700">{service.price}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="imaging" className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { name: "Chest X-Ray", price: "₱600", description: "Chest imaging for lung health" },
                    { name: "Ultrasound", price: "₱1,800", description: "Imaging of abdominal organs" },
                    { name: "ECG", price: "₱500", description: "Heart rhythm and electrical activity" },
                  ].map((service, index) => (
                    <Card key={index} className="border-emerald-200 hover:shadow-lg transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-800 text-base sm:text-lg">{service.name}</CardTitle>
                        <Badge className="w-fit bg-emerald-100 text-emerald-700">{service.price}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-12 sm:mt-16">
              <Link href="/services">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 shadow-xl px-8 sm:px-10 py-4 text-base sm:text-lg"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Complete Test Catalog
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-gray-50 to-emerald-50">
          <div className="container mx-auto">
            <div className="text-center mb-16 sm:mb-20">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
                Why Choose Our Laboratory?
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our digital laboratory platform is designed to make your testing experience smooth, secure, and
                efficient.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
              {[
                {
                  icon: Calendar,
                  title: "Easy Scheduling",
                  description:
                    "Book laboratory tests online with real-time availability, instant confirmation, and automated reminders",
                  features: ["Online booking", "SMS reminders", "Flexible scheduling"],
                },
                {
                  icon: FileText,
                  title: "Digital Results",
                  description:
                    "Access your test results and medical certificates instantly through our secure, encrypted portal",
                  features: ["Instant access", "Secure encryption", "PDF downloads"],
                },
                {
                  icon: Shield,
                  title: "Multiple Payment Options",
                  description:
                    "Safe and convenient payment options with GCash, HMO coverage, and financial assistance programs",
                  features: ["GCash integration", "HMO processing", "Guarantee letters"],
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-emerald-200 hover:shadow-2xl transition-all duration-500 group overflow-hidden bg-white"
                >
                  <CardHeader className="relative p-6 sm:p-8">
                    <div
                      className={`w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                    >
                      <feature.icon className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                    </div>
                    <CardTitle className="text-emerald-800 text-xl sm:text-2xl mb-4 font-bold">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-xs sm:text-sm text-emerald-700">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 sm:py-24 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
                Frequently Asked Questions
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about our laboratory services
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base sm:text-lg font-medium text-emerald-800 text-left">
                    How do I prepare for a blood test?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base">
                    For most blood tests, you'll need to fast for 8-12 hours before your appointment. This means no food
                    or drinks except water. Specific tests may have different requirements, which will be communicated
                    to you when you book your appointment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-base sm:text-lg font-medium text-emerald-800 text-left">
                    How quickly will I receive my test results?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base">
                    Most routine laboratory tests are available within 24-48 hours. Some specialized tests may take 3-5
                    business days. You'll receive a notification via your preferred method (SMS or email) when your
                    results are ready to view in your patient portal.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-base sm:text-lg font-medium text-emerald-800 text-left">
                    Does the laboratory accept HMO and insurance?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base">
                    Yes, we accept most major HMOs and insurance providers. You can upload your HMO card during the
                    booking process. For specific coverage questions, please contact your provider or our customer
                    service team.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-base sm:text-lg font-medium text-emerald-800 text-left">
                    How do I request a medical certificate?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base">
                    You can request a medical certificate through your patient portal under "Medical Certificate
                    Requests." Fill out the required information, specify the purpose, and submit your request. Medical
                    certificates are typically processed within 1-2 business days.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-base sm:text-lg font-medium text-emerald-800 text-left">
                    What payment methods are accepted?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base">
                    We accept cash, credit/debit cards, GCash, PayMaya, and bank transfers. For HMO-covered services,
                    you may need to present your HMO card and authorization. We also offer financial assistance programs
                    for eligible patients.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8 sm:mt-12 text-center">
                <p className="text-gray-600 mb-6">Don't see your question? Contact our support team</p>
                <Button
                  onClick={() => setShowChatbot(true)}
                  className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with Support
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-20">
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-800 mb-8 sm:mb-10">
                  Get in Touch
                </h3>
                <div className="space-y-6 sm:space-y-8">
                  {[
                    { icon: Phone, label: "Laboratory Hotline", value: "(043) 286-2531", color: "text-emerald-600" },
                    { icon: Phone, label: "Appointment Line", value: "(043) 286-2532", color: "text-emerald-600" },
                    {
                      icon: Mail,
                      label: "Email Address",
                      value: "lab@megh.com.ph",
                      color: "text-emerald-600",
                    },
                    {
                      icon: MapPin,
                      label: "Laboratory Address",
                      value: "115 Strong Republic Nautical Highway, Calapan, MIMAROPA, Philippines",
                      color: "text-emerald-600",
                    },
                  ].map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <contact.icon className={`w-6 sm:w-8 h-6 sm:h-8 text-white`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-emerald-800 text-base sm:text-lg">{contact.label}</p>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                          {contact.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl">
                <h4 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-6 sm:mb-8">Laboratory Hours</h4>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { day: "Monday - Friday", hours: "7:00 AM - 6:00 PM", isToday: true },
                    { day: "Saturday", hours: "8:00 AM - 5:00 PM", isToday: false },
                    { day: "Sunday", hours: "9:00 AM - 3:00 PM", isToday: false },
                    { day: "Emergency Testing", hours: "24/7 Available", isToday: false, isEmergency: true },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 rounded-2xl transition-all ${
                        schedule.isEmergency
                          ? "bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200"
                          : schedule.isToday
                            ? "bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-md"
                            : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`font-bold text-base sm:text-lg mb-1 sm:mb-0 ${
                          schedule.isEmergency
                            ? "text-red-700"
                            : schedule.isToday
                              ? "text-emerald-800"
                              : "text-gray-700"
                        }`}
                      >
                        {schedule.day}
                      </span>
                      <span
                        className={`font-bold text-base sm:text-lg ${
                          schedule.isEmergency
                            ? "text-red-600"
                            : schedule.isToday
                              ? "text-emerald-600"
                              : "text-gray-600"
                        }`}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900 text-white py-12 sm:py-16 px-4">
          <div className="container mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
              <div className="sm:col-span-2">
                <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                  <Image
                    src="/images/maes-logo.avif"
                    alt="Maria Estrella General Hospital Logo"
                    width={48}
                    height={48}
                    className="rounded-xl"
                  />
                  <div>
                    <span className="text-xl sm:text-2xl font-bold">Maria Estrella General Hospital</span>
                    <p className="text-emerald-200 text-sm sm:text-base">Laboratory Services Department</p>
                  </div>
                </div>
                <p className="text-emerald-200 mb-6 leading-relaxed text-sm sm:text-lg">
                  Providing quality laboratory services with modern technology and expert professionals since 1995. Your
                  health and accurate diagnostics are our top priorities.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                    <span className="text-white font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                    <span className="text-white font-bold">@</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Quick Links</h4>
                <ul className="space-y-2 sm:space-y-3 text-emerald-200">
                  <li>
                    <Link href="#services" className="hover:text-white transition-colors text-sm sm:text-base">
                      Laboratory Tests
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors text-sm sm:text-base">
                      About Our Lab
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors text-sm sm:text-base">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="hover:text-white transition-colors text-sm sm:text-base">
                      Help & FAQs
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Patient Portal</h4>
                <ul className="space-y-2 sm:space-y-3 text-emerald-200">
                  <li>
                    <Link
                      href="/auth/login?type=patient"
                      className="hover:text-white transition-colors text-sm sm:text-base"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register?type=patient"
                      className="hover:text-white transition-colors text-sm sm:text-base"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link href="/patient/results" className="hover:text-white transition-colors text-sm sm:text-base">
                      View Results
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/patient/appointments"
                      className="hover:text-white transition-colors text-sm sm:text-base"
                    >
                      My Appointments
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-emerald-700 pt-6 sm:pt-8 text-center">
              <p className="text-emerald-300 text-base sm:text-lg">
                © 2024 Maria Estrella General Hospital. All rights reserved.
              </p>
              <p className="text-emerald-400 text-sm sm:text-base mt-2">
                Licensed by the Department of Health | Accredited by PhilHealth | Located in Calapan, MIMAROPA
              </p>
            </div>
          </div>
        </footer>

        {/* Floating Chat Button */}
        {!showChatbot && (
          <button
            onClick={() => setShowChatbot(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 animate-bounce"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}

        {/* Chat Support */}
        <ChatSupport isOpen={showChatbot} onClose={() => setShowChatbot(false)} userType="patient" userName="Visitor" />
      </div>
    </NotificationProvider>
  )
}
