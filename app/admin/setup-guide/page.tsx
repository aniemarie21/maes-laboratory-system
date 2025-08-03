"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Code,
  Database,
  Settings,
  Download,
  CheckCircle,
  AlertCircle,
  Terminal,
  Folder,
  FileText,
  Zap,
  Cloud,
  Shield,
  Smartphone,
  Monitor,
  Globe,
  Copy,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"

export default function SetupGuidePage() {
  const [copiedCommand, setCopiedCommand] = useState<string>("")

  const copyToClipboard = (text: string, command: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(""), 2000)
  }

  const setupSteps = [
    {
      id: "prerequisites",
      title: "Prerequisites",
      icon: CheckCircle,
      items: [
        "Node.js 18.x or later",
        "VS Code with recommended extensions",
        "Git version control",
        "Firebase account",
        "Basic terminal/command line knowledge",
      ],
    },
    {
      id: "vscode",
      title: "VS Code Extensions",
      icon: Code,
      items: [
        "ES7+ React/Redux/React-Native snippets",
        "Tailwind CSS IntelliSense",
        "TypeScript Importer",
        "Auto Rename Tag",
        "Prettier - Code formatter",
        "ESLint",
        "Firebase",
        "GitLens",
      ],
    },
    {
      id: "firebase",
      title: "Firebase Setup",
      icon: Database,
      items: [
        "Create new Firebase project",
        "Enable Authentication (Email/Password, Google)",
        "Set up Firestore Database",
        "Configure Storage",
        "Get Firebase configuration",
        "Set up security rules",
      ],
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: Globe,
      items: [
        "Build production version",
        "Configure Firebase Hosting",
        "Set up environment variables",
        "Deploy to Firebase",
        "Configure custom domain (optional)",
      ],
    },
  ]

  const commands = [
    {
      title: "Install Node.js Dependencies",
      command: "npm install",
      description: "Install all required packages and dependencies",
    },
    {
      title: "Install Firebase CLI",
      command: "npm install -g firebase-tools",
      description: "Global installation of Firebase command line tools",
    },
    {
      title: "Install Additional Packages",
      command: "npm install firebase @radix-ui/react-accordion @radix-ui/react-alert-dialog lucide-react recharts",
      description: "Install Firebase SDK and additional UI components",
    },
    {
      title: "Initialize Firebase",
      command: "firebase init",
      description: "Initialize Firebase project in your local directory",
    },
    {
      title: "Start Development Server",
      command: "npm run dev",
      description: "Run the application in development mode",
    },
    {
      title: "Build for Production",
      command: "npm run build",
      description: "Create optimized production build",
    },
    {
      title: "Deploy to Firebase",
      command: "firebase deploy",
      description: "Deploy your application to Firebase Hosting",
    },
  ]

  const firebaseConfig = `// lib/firebase-config.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app`

  const envExample = `# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id`

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - users can read/write their own, admins can read all
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.admin == true);
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Public read access for services and pricing
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}`

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Complete Setup Guide</h1>
          <p className="text-gray-600">Step-by-step instructions to set up the MEGH Laboratory Management System</p>
        </div>

        {/* Quick Start */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              Quick Start
            </CardTitle>
            <CardDescription>Get up and running in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-emerald-800 mb-2">1. Download & Install</h3>
                <p className="text-sm text-gray-600">Install Node.js, VS Code, and Git on your computer</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-emerald-800 mb-2">2. Setup Firebase</h3>
                <p className="text-sm text-gray-600">Create Firebase project and configure authentication</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-emerald-800 mb-2">3. Deploy & Go Live</h3>
                <p className="text-sm text-gray-600">Build and deploy your application to the web</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Progress */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Setup Progress</CardTitle>
            <CardDescription>Track your setup completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4 p-4 border border-emerald-100 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-800">{step.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {step.items.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Setup Instructions */}
        <Tabs defaultValue="installation" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="installation">
              <Download className="w-4 h-4 mr-2" />
              Installation
            </TabsTrigger>
            <TabsTrigger value="firebase">
              <Database className="w-4 h-4 mr-2" />
              Firebase
            </TabsTrigger>
            <TabsTrigger value="configuration">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="deployment">
              <Globe className="w-4 h-4 mr-2" />
              Deployment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="installation" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Software Installation</CardTitle>
                <CardDescription>Install required software and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-4 flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Command Line Instructions
                  </h3>
                  <div className="space-y-4">
                    {commands.map((cmd, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{cmd.title}</h4>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(cmd.command, cmd.title)}>
                            <Copy className="w-4 h-4 mr-1" />
                            {copiedCommand === cmd.title ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <code className="block bg-gray-100 p-3 rounded text-sm font-mono mb-2">{cmd.command}</code>
                        <p className="text-sm text-gray-600">{cmd.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    <strong>Windows Users:</strong> Use Command Prompt or PowerShell.
                    <strong>Mac/Linux:</strong> Use Terminal application.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="firebase" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Firebase Project Setup</CardTitle>
                <CardDescription>Configure Firebase services for the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-emerald-800">Required Services</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Authentication", desc: "User login and registration", icon: Shield },
                        { name: "Firestore Database", desc: "Store application data", icon: Database },
                        { name: "Cloud Storage", desc: "File uploads and media", icon: Folder },
                        { name: "Hosting", desc: "Deploy your application", icon: Globe },
                      ].map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border border-emerald-100 rounded-lg"
                        >
                          <service.icon className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="font-medium text-emerald-800">{service.name}</div>
                            <div className="text-sm text-gray-600">{service.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-emerald-800">Setup Steps</h3>
                    <div className="space-y-3">
                      {[
                        "Go to Firebase Console",
                        "Create new project",
                        "Enable Authentication providers",
                        "Create Firestore database",
                        "Set up Cloud Storage",
                        "Copy configuration keys",
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    Save your Firebase configuration keys securely. You'll need them for the next step.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Project Configuration</CardTitle>
                <CardDescription>Configure your application with Firebase credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Firebase Configuration File
                  </h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">lib/firebase-config.ts</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(firebaseConfig, "Firebase Config")}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {copiedCommand === "Firebase Config" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        <code>{firebaseConfig}</code>
                      </pre>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Environment Variables (.env.local)</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(envExample, "Environment Variables")}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {copiedCommand === "Environment Variables" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        <code>{envExample}</code>
                      </pre>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Firestore Security Rules</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(firestoreRules, "Firestore Rules")}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {copiedCommand === "Firestore Rules" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        <code>{firestoreRules}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Deploy to Production</CardTitle>
                <CardDescription>Make your application live on the web</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-emerald-800 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Deployment Platforms
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Firebase Hosting",
                          desc: "Recommended - Integrated with Firebase",
                          badge: "Recommended",
                        },
                        { name: "Vercel", desc: "Excellent for Next.js applications", badge: "Popular" },
                        { name: "Netlify", desc: "Great for static site deployment", badge: "Alternative" },
                      ].map((platform, index) => (
                        <div key={index} className="border border-emerald-100 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-emerald-800">{platform.name}</span>
                            <Badge className="bg-emerald-100 text-emerald-800">{platform.badge}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{platform.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-emerald-800 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Pre-deployment Checklist
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Environment variables configured",
                        "Firebase services enabled",
                        "Security rules updated",
                        "Production build tested",
                        "Domain name ready (optional)",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-700">
                    Your MEGH Laboratory Management System is now ready for production! Users can access both patient
                    and admin portals with full functionality.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Section */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-600 to-green-700 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Need Help with Setup?</h3>
              <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                Our technical support team is here to help you get your laboratory management system up and running
                smoothly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Documentation
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                  <Monitor className="w-4 h-4 mr-2" />
                  Schedule Setup Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
