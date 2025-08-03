"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Code, Database, Download, Github, Terminal } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetupGuidePage() {
  const [activeStep, setActiveStep] = useState(1)

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 5))
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">System Setup Guide</h1>
          <p className="text-gray-600">Complete step-by-step instructions for setting up the laboratory system</p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            This guide will help you set up the entire laboratory management system, including VS Code configuration,
            Firebase setup, and deployment instructions.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <Button
                key={step}
                variant={activeStep === step ? "default" : "outline"}
                className={
                  activeStep === step ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-200 text-emerald-800"
                }
                onClick={() => setActiveStep(step)}
              >
                Step {step}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
              onClick={handlePrevStep}
              disabled={activeStep === 1}
            >
              Previous
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleNextStep}
              disabled={activeStep === 5}
            >
              Next
            </Button>
          </div>
        </div>

        <Tabs value={`step-${activeStep}`} className="w-full">
          <TabsContent value="step-1" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-emerald-100 text-emerald-800">Step 1</Badge>
                  <CardTitle className="text-emerald-800">Prerequisites & Environment Setup</CardTitle>
                </div>
                <CardDescription>Install required software and set up your development environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      <div className="flex items-center">
                        <Terminal className="w-5 h-5 mr-2" />
                        Install Node.js and npm
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Download and Install Node.js:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>
                            Visit{" "}
                            <a href="https://nodejs.org" className="text-blue-600 hover:underline">
                              https://nodejs.org
                            </a>
                          </li>
                          <li>Download the LTS version (recommended)</li>
                          <li>Run the installer and follow the setup wizard</li>
                          <li>Verify installation by opening terminal/command prompt and running:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-3 rounded mt-3 font-mono text-sm">
                          <div>node --version</div>
                          <div>npm --version</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      <div className="flex items-center">
                        <Code className="w-5 h-5 mr-2" />
                        Install Visual Studio Code
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Download and Install VS Code:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>
                            Visit{" "}
                            <a href="https://code.visualstudio.com" className="text-blue-600 hover:underline">
                              https://code.visualstudio.com
                            </a>
                          </li>
                          <li>Download the version for your operating system</li>
                          <li>Install VS Code following the setup wizard</li>
                          <li>Launch VS Code after installation</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      <div className="flex items-center">
                        <Github className="w-5 h-5 mr-2" />
                        Install Git
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Download and Install Git:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>
                            Visit{" "}
                            <a href="https://git-scm.com" className="text-blue-600 hover:underline">
                              https://git-scm.com
                            </a>
                          </li>
                          <li>Download Git for your operating system</li>
                          <li>Install Git with default settings</li>
                          <li>Verify installation:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-3 rounded mt-3 font-mono text-sm">git --version</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Once you have Node.js, VS Code, and Git installed, you're ready to proceed to the next step.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-2" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-emerald-100 text-emerald-800">Step 2</Badge>
                  <CardTitle className="text-emerald-800">VS Code Configuration</CardTitle>
                </div>
                <CardDescription>Set up VS Code with essential extensions and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Install Essential Extensions
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Required Extensions:</h4>
                        <div className="space-y-3">
                          {[
                            { name: "ES7+ React/Redux/React-Native snippets", id: "dsznajder.es7-react-js-snippets" },
                            { name: "Prettier - Code formatter", id: "esbenp.prettier-vscode" },
                            { name: "ESLint", id: "dbaeumer.vscode-eslint" },
                            { name: "Auto Rename Tag", id: "formulahendry.auto-rename-tag" },
                            { name: "Bracket Pair Colorizer", id: "coenraads.bracket-pair-colorizer" },
                            { name: "GitLens", id: "eamodio.gitlens" },
                            { name: "Thunder Client", id: "rangav.vscode-thunder-client" },
                            { name: "Firebase", id: "toba.vsfire" },
                          ].map((ext, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm font-medium">{ext.name}</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ext.id}</code>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Installation Steps:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Open VS Code</li>
                            <li>
                              Press <kbd className="bg-gray-200 px-1 rounded">Ctrl+Shift+X</kbd> (or{" "}
                              <kbd className="bg-gray-200 px-1 rounded">Cmd+Shift+X</kbd> on Mac)
                            </li>
                            <li>Search for each extension by name or ID</li>
                            <li>Click "Install" for each extension</li>
                          </ol>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Configure VS Code Settings
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Recommended Settings:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
                          <li>
                            Press <kbd className="bg-gray-200 px-1 rounded">Ctrl+,</kbd> (or{" "}
                            <kbd className="bg-gray-200 px-1 rounded">Cmd+,</kbd> on Mac) to open settings
                          </li>
                          <li>Click on "Open Settings (JSON)" icon in the top right</li>
                          <li>Add the following configuration:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                          <pre>{`{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "editor.minimap.enabled": true,
  "workbench.colorTheme": "Dark+ (default dark)",
  "terminal.integrated.defaultProfile.windows": "Command Prompt"
}`}</pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Set up Prettier Configuration
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Create .prettierrc file:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
                          <li>
                            Create a new file in your project root called <code>.prettierrc</code>
                          </li>
                          <li>Add the following configuration:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs">
                          <pre>{`{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}`}</pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-3" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-emerald-100 text-emerald-800">Step 3</Badge>
                  <CardTitle className="text-emerald-800">Firebase Setup</CardTitle>
                </div>
                <CardDescription>Create and configure Firebase project for the laboratory system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      <div className="flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        Create Firebase Project
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Step-by-step Firebase Project Creation:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>
                            Go to{" "}
                            <a href="https://console.firebase.google.com" className="text-blue-600 hover:underline">
                              Firebase Console
                            </a>
                          </li>
                          <li>Sign in with your Google account</li>
                          <li>Click "Create a project"</li>
                          <li>
                            Enter project name: <code className="bg-gray-200 px-1 rounded">megh-laboratory-system</code>
                          </li>
                          <li>Choose whether to enable Google Analytics (recommended)</li>
                          <li>Select or create a Google Analytics account</li>
                          <li>Click "Create project"</li>
                          <li>Wait for project creation to complete</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Configure Authentication
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Enable Authentication Methods:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>In Firebase Console, click "Authentication" in the left sidebar</li>
                          <li>Click "Get started" if it's your first time</li>
                          <li>Go to "Sign-in method" tab</li>
                          <li>Enable the following providers:</li>
                        </ol>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Email/Password</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Google</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Configure Google Sign-in:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Click on Google provider</li>
                            <li>Toggle "Enable"</li>
                            <li>Add your project support email</li>
                            <li>Click "Save"</li>
                          </ol>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Set up Firestore Database
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Create Firestore Database:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Click "Firestore Database" in the left sidebar</li>
                          <li>Click "Create database"</li>
                          <li>Choose "Start in test mode" (we'll configure security later)</li>
                          <li>Select a location (choose closest to your users)</li>
                          <li>Click "Done"</li>
                        </ol>
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Create Collections:</h5>
                          <div className="space-y-2">
                            {[
                              "users",
                              "appointments",
                              "services",
                              "payments",
                              "results",
                              "notifications",
                              "medical_certificates",
                              "activity_logs",
                            ].map((collection, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <code className="bg-gray-200 px-2 py-1 rounded text-xs">{collection}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-emerald-700 font-medium">Configure Storage</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Set up Firebase Storage:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Click "Storage" in the left sidebar</li>
                          <li>Click "Get started"</li>
                          <li>Review security rules (start in test mode)</li>
                          <li>Choose a location (same as Firestore)</li>
                          <li>Click "Done"</li>
                        </ol>
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Create Folder Structure:</h5>
                          <div className="space-y-1 text-sm">
                            <div>📁 documents/</div>
                            <div className="ml-4">📁 patient-ids/</div>
                            <div className="ml-4">📁 hmo-cards/</div>
                            <div className="ml-4">📁 guarantee-letters/</div>
                            <div>📁 results/</div>
                            <div>📁 certificates/</div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-4" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-emerald-100 text-emerald-800">Step 4</Badge>
                  <CardTitle className="text-emerald-800">Project Setup & Configuration</CardTitle>
                </div>
                <CardDescription>Clone the project and configure environment variables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Get Firebase Configuration
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Obtain Firebase Config:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>In Firebase Console, click the gear icon ⚙️ next to "Project Overview"</li>
                          <li>Select "Project settings"</li>
                          <li>Scroll down to "Your apps" section</li>
                          <li>Click "Add app" and select the web icon {"</>"}</li>
                          <li>
                            Enter app nickname: <code className="bg-gray-200 px-1 rounded">MEGH Laboratory System</code>
                          </li>
                          <li>Check "Also set up Firebase Hosting"</li>
                          <li>Click "Register app"</li>
                          <li>Copy the Firebase configuration object</li>
                        </ol>
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Your config will look like this:</h5>
                          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                            <pre>{`const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};`}</pre>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-emerald-700 font-medium">Create Next.js Project</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Initialize Project:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Open terminal/command prompt</li>
                          <li>Navigate to your desired directory</li>
                          <li>Run the following commands:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm mt-3">
                          <div>npx create-next-app@latest megh-laboratory-system</div>
                          <div>cd megh-laboratory-system</div>
                          <div>npm install firebase</div>
                          <div>npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog</div>
                          <div>npm install @radix-ui/react-tabs @radix-ui/react-select</div>
                          <div>npm install lucide-react recharts</div>
                          <div>npm install tailwindcss-animate class-variance-authority</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Configure Environment Variables
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Create Environment Files:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
                          <li>
                            Create <code>.env.local</code> file in project root
                          </li>
                          <li>Add your Firebase configuration:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                          <pre>{`NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Admin Configuration (Keep Secret)
ADMIN_EMAIL=mariaestrellageneralhospital@gmail.com
ADMIN_PASSWORD=MariaEstrella_MEGH`}</pre>
                        </div>
                        <Alert className="bg-red-50 border-red-200 mt-4">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-700">
                            Never commit .env.local to version control. Add it to your .gitignore file.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Initialize Firebase in Project
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Create Firebase Configuration File:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
                          <li>
                            Create <code>lib/firebase.js</code> file
                          </li>
                          <li>Add the following code:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                          <pre>{`import { initializeApp } from 'firebase/app'
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
export default app`}</pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-5" className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-emerald-100 text-emerald-800">Step 5</Badge>
                  <CardTitle className="text-emerald-800">Deployment & Testing</CardTitle>
                </div>
                <CardDescription>Deploy your application and test all functionality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Local Development Setup
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Run Development Server:</h4>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
                          <div>npm run dev</div>
                        </div>
                        <p className="text-sm mt-2">
                          Open{" "}
                          <a href="http://localhost:3000" className="text-blue-600 hover:underline">
                            http://localhost:3000
                          </a>{" "}
                          in your browser
                        </p>

                        <h4 className="font-medium mb-2 mt-4">Test Features:</h4>
                        <div className="space-y-2">
                          {[
                            "Patient registration and login",
                            "Admin login with credentials",
                            "Laboratory service booking",
                            "File upload functionality",
                            "Payment method selection",
                            "Medical certificate requests",
                            "Admin dashboard analytics",
                            "Appointment approval workflow",
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-emerald-700 font-medium">Deploy to Vercel</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Deployment Steps:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>
                            Create account at{" "}
                            <a href="https://vercel.com" className="text-blue-600 hover:underline">
                              vercel.com
                            </a>
                          </li>
                          <li>Install Vercel CLI:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm mt-2 mb-2">
                          npm i -g vercel
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-sm" start={3}>
                          <li>Login to Vercel:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm mt-2 mb-2">
                          vercel login
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-sm" start={4}>
                          <li>Deploy your project:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm mt-2 mb-2">vercel</div>
                        <ol className="list-decimal list-inside space-y-2 text-sm" start={5}>
                          <li>Follow the prompts to configure deployment</li>
                          <li>Add environment variables in Vercel dashboard</li>
                          <li>Your app will be live at the provided URL</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Configure Firebase Security Rules
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Update Firestore Rules:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
                          <li>Go to Firebase Console → Firestore Database → Rules</li>
                          <li>Replace the default rules with:</li>
                        </ol>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                          <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - users can create, admins can manage
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Services - read only for patients, write for admins
    match /services/{serviceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Results - users can read their own
    match /results/{resultId} {
      allow read: if request.auth != null && 
        resource.data.patientId == request.auth.uid;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}`}</pre>
                        </div>
                        <p className="text-sm mt-2">Click "Publish" to apply the rules</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-emerald-700 font-medium">
                      Final Testing Checklist
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Complete System Test:</h4>
                        <div className="space-y-3">
                          {[
                            {
                              category: "Authentication",
                              items: ["Patient registration", "Admin login", "Google sign-in", "Password reset"],
                            },
                            {
                              category: "Patient Features",
                              items: [
                                "Book laboratory tests",
                                "Upload documents",
                                "Select payment methods",
                                "Request medical certificates",
                              ],
                            },
                            {
                              category: "Admin Features",
                              items: [
                                "View pending requests",
                                "Approve/reject appointments",
                                "Manage payment settings",
                                "Export reports",
                              ],
                            },
                            {
                              category: "System Features",
                              items: [
                                "File uploads to Firebase Storage",
                                "Email notifications",
                                "Data persistence",
                                "Responsive design",
                              ],
                            },
                          ].map((section, index) => (
                            <div key={index} className="border rounded p-3">
                              <h5 className="font-medium text-emerald-700 mb-2">{section.category}:</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {section.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Congratulations! Your Maria Estrella General Hospital Laboratory Management System is now fully set
                    up and ready for use.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Print Guide
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Setup Complete
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
