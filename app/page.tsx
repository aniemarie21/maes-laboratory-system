"use client"

import { useState } from "react"
import Link from "next/link"
import { Stethoscope, Users, Calendar, Shield, Phone, Mail, MapPin, Menu, X, TestTube, Clock, Award, Heart, ArrowRight, CheckCircle, Star } from 'lucide-react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    {
      icon: TestTube,
      title: "Complete Blood Count (CBC)",
      description: "Comprehensive blood analysis including white blood cells, red blood cells, and platelets",
      price: "₱350",
      duration: "2-4 hours",
      popular: true,
    },
    {
      icon: Stethoscope,
      title: "Fasting Blood Sugar (FBS)",
      description: "Blood glucose level test for diabetes screening and monitoring",
      price: "₱150",
      duration: "1-2 hours",
      popular: true,
    },
    {
      icon: Heart,
      title: "Lipid Profile",
      description: "Cholesterol and triglyceride levels for cardiovascular health assessment",
      price: "₱450",
      duration: "2-4 hours",
      popular: false,
    },
    {
      icon: Shield,
      title: "Complete Urinalysis",
      description: "Comprehensive urine analysis for kidney function and urinary tract health",
      price: "₱120",
      duration: "1-2 hours",
      popular: false,
    },
    {
      icon: TestTube,
      title: "Hepatitis B Surface Antigen",
      description: "Screening test for Hepatitis B infection",
      price: "₱250",
      duration: "2-4 hours",
      popular: false,
    },
    {
      icon: Stethoscope,
      title: "Thyroid Function Test",
      description: "TSH, T3, T4 levels for thyroid health evaluation",
      price: "₱800",
      duration: "4-6 hours",
      popular: false,
    },
  ]

  const stats = [
    { icon: Users, number: "10,000+", label: "Patients Served" },
    { icon: TestTube, number: "50,000+", label: "Tests Completed" },
    { icon: Award, number: "15+", label: "Years Experience" },
    { icon: Heart, number: "99.9%", label: "Satisfaction Rate" },
  ]

  const features = [
    {
      icon: Clock,
      title: "Fast Results",
      description: "Get your test results quickly with our efficient laboratory processes",
    },
    {
      icon: Shield,
      title: "Accurate Testing",
      description: "State-of-the-art equipment ensures precise and reliable test results",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule your appointments online with our convenient booking system",
    },
    {
      icon: Users,
      title: "Expert Staff",
      description: "Certified medical technologists and experienced healthcare professionals",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl text-gray-900">MAES Laboratory</h1>
                <p className="text-xs text-gray-600">Maria Estrella General Hospital</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="nav-link">
                Home
              </a>
              <a href="#services" className="nav-link">
                Services
              </a>
              <a href="#about" className="nav-link">
                About
              </a>
              <a href="#contact" className="nav-link">
                Contact
              </a>
              <Link href="/auth/login" className="btn-primary">
                Login
              </Link>
              <Link href="/patient/book-appointment" className="btn-secondary">
                Book Now
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="nav-link">
                  Home
                </a>
                <a href="#services" className="nav-link">
                  Services
                </a>
                <a href="#about" className="nav-link">
                  About
                </a>
                <a href="#contact" className="nav-link">
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/auth/login" className="btn-primary text-center">
                    Login
                  </Link>
                  <Link href="/patient/book-appointment" className="btn-secondary text-center">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6 animate-fade-in">
              Professional Laboratory Services
              <span className="block text-yellow-300">at MAES Hospital</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto animate-slide-up opacity-90">
              Experience world-class laboratory services at Maria Estrella General Hospital. Fast, accurate, and
              reliable diagnostic testing with modern equipment and expert staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/patient/book-appointment" className="btn-primary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-100">
                <Calendar className="w-5 h-5 mr-2" />
                Book Laboratory Test
              </Link>
              <Link href="/auth/login" className="btn-secondary text-lg px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
                <TestTube className="w-5 h-5 mr-2" />
                View Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="font-heading font-bold text-3xl md:text-4xl mb-2 text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">Our Laboratory Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive laboratory testing services with state-of-the-art equipment and certified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative">
                {service.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </div>
                )}
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-primary-600 font-bold text-lg">{service.price}</div>
                  <div className="text-gray-500 text-sm">{service.duration}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/patient/book-appointment" className="btn-primary text-lg px-8 py-4">
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Tests Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">Why Choose MAES Laboratory?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with compassionate care to deliver exceptional laboratory services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-6">About MAES Laboratory</h2>
              <p className="text-lg text-gray-600 mb-6">
                Located at Maria Estrella General Hospital, MAES Laboratory has been serving the community for over 15
                years with reliable, accurate, and timely diagnostic services.
              </p>
              <p className="text-gray-600 mb-6">
                Our state-of-the-art facility is equipped with modern laboratory equipment and staffed by certified
                medical technologists who are committed to providing the highest quality of care.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">ISO certified laboratory standards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">24/7 emergency testing available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Digital results delivery system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Experienced medical professionals</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Stethoscope className="w-24 h-24 text-primary-600 mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">Professional Excellence</h3>
                  <p className="text-gray-600">Committed to your health and well-being</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600">Get in touch with our team for appointments and inquiries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 text-lg">(043) 286-2531</p>
              <p className="text-gray-500 text-sm mt-1">Available 24/7 for emergencies</p>
            </div>
            <div className="card text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">mariaestrellageneralhospital@gmail.com</p>
              <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
            </div>
            <div className="card text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600 text-sm">115 Strong Republic Nautical Highway</p>
              <p className="text-gray-600 text-sm">Calapan, MIMAROPA</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
              <h3 className="font-heading font-semibold text-2xl text-gray-900 mb-4">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">Book your laboratory appointment today and experience professional healthcare services</p>
              <Link href="/patient/book-appointment" className="btn-primary text-lg px-8 py-4">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Your Appointment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl">MAES Laboratory</h3>
                  <p className="text-gray-400 text-sm">Maria Estrella General Hospital</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Professional laboratory services with modern equipment and expert staff. Serving the community with
                reliable diagnostic testing for over 15 years.
              </p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">15+</div>
                  <div className="text-xs text-gray-400">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-400">50K+</div>
                  <div className="text-xs text-gray-400">Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">99.9%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-400">Blood Tests</span>
                </li>
                <li>
                  <span className="text-gray-400">Urinalysis</span>
                </li>
                <li>
                  <span className="text-gray-400">Health Checkups</span>
                </li>
                <li>
                  <span className="text-gray-400">Diagnostic Tests</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MAES Laboratory - Maria Estrella General Hospital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
