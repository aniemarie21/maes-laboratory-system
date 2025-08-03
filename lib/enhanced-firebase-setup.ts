import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth, connectAuthEmulator, createUserWithEmailAndPassword } from "firebase/auth"
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { getStorage, type FirebaseStorage, connectStorageEmulator } from "firebase/storage"
import { getAnalytics, type Analytics } from "firebase/analytics"

// Enhanced Firebase configuration with validation
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate configuration
const validateConfig = () => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missing = requiredKeys.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

  if (missing.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missing.join(", ")}`)
  }
}

// Initialize Firebase with enhanced error handling
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let analytics: Analytics | null = null

try {
  validateConfig()

  // Initialize Firebase app
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  // Initialize services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  // Initialize analytics only in browser
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app)
  }

  // Connect to emulators in development
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    const isEmulatorConnected = {
      auth: false,
      firestore: false,
      storage: false,
    }

    if (!isEmulatorConnected.auth) {
      try {
        connectAuthEmulator(auth, "http://localhost:9099")
        isEmulatorConnected.auth = true
      } catch (error) {
        console.log("Auth emulator not available")
      }
    }

    if (!isEmulatorConnected.firestore) {
      try {
        connectFirestoreEmulator(db, "localhost", 8080)
        isEmulatorConnected.firestore = true
      } catch (error) {
        console.log("Firestore emulator not available")
      }
    }

    if (!isEmulatorConnected.storage) {
      try {
        connectStorageEmulator(storage, "localhost", 9199)
        isEmulatorConnected.storage = true
      } catch (error) {
        console.log("Storage emulator not available")
      }
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  throw error
}

// Enhanced Laboratory Services with modern pricing and features
const enhancedServices = [
  {
    id: "cbc-enhanced",
    name: "Complete Blood Count (CBC) with AI Analysis",
    description: "Comprehensive blood analysis with AI-powered insights and health predictions",
    price: 450,
    originalPrice: 350,
    category: "Hematology",
    duration: "30 minutes",
    preparation: "No special preparation required",
    features: ["AI Analysis", "Health Score", "Trend Tracking", "Risk Assessment"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: true,
    aiEnabled: true,
    popular: true,
  },
  {
    id: "lipid-profile-premium",
    name: "Premium Lipid Profile with Cardiovascular Risk Assessment",
    description: "Advanced cholesterol analysis with AI-powered cardiovascular risk prediction",
    price: 950,
    originalPrice: 800,
    category: "Clinical Chemistry",
    duration: "45 minutes",
    preparation: "12-hour fasting required",
    features: ["AI Risk Assessment", "Cardiovascular Scoring", "Lifestyle Recommendations", "Diet Planning"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: true,
    aiEnabled: true,
    popular: true,
  },
  {
    id: "diabetes-panel-smart",
    name: "Smart Diabetes Panel with Glucose Monitoring",
    description: "Comprehensive diabetes screening with AI-powered glucose trend analysis",
    price: 650,
    originalPrice: 500,
    category: "Endocrinology",
    duration: "30 minutes",
    preparation: "8-hour fasting required",
    features: ["AI Glucose Trends", "Diabetes Risk Score", "HbA1c Analysis", "Lifestyle Coaching"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: true,
    aiEnabled: true,
    popular: false,
  },
  {
    id: "thyroid-complete-ai",
    name: "Complete Thyroid Function with AI Interpretation",
    description: "Comprehensive thyroid analysis with AI-powered hormone balance assessment",
    price: 1800,
    originalPrice: 1500,
    category: "Endocrinology",
    duration: "30 minutes",
    preparation: "No special preparation required",
    features: ["AI Hormone Analysis", "Thyroid Health Score", "Symptom Correlation", "Treatment Suggestions"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: true,
    aiEnabled: true,
    popular: false,
  },
  {
    id: "liver-function-enhanced",
    name: "Enhanced Liver Function Panel with Detox Assessment",
    description: "Advanced liver health analysis with AI-powered detoxification capacity evaluation",
    price: 1400,
    originalPrice: 1200,
    category: "Clinical Chemistry",
    duration: "30 minutes",
    preparation: "No special preparation required",
    features: ["AI Liver Health Score", "Detox Capacity", "Lifestyle Impact", "Recovery Recommendations"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: true,
    aiEnabled: true,
    popular: false,
  },
  {
    id: "kidney-function-smart",
    name: "Smart Kidney Function Assessment",
    description: "Comprehensive kidney health evaluation with AI-powered filtration analysis",
    price: 850,
    originalPrice: 700,
    category: "Clinical Chemistry",
    duration: "30 minutes",
    preparation: "No special preparation required",
    features: ["AI Kidney Score", "Filtration Rate Analysis", "Risk Prediction", "Prevention Tips"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: false,
    aiEnabled: true,
    popular: false,
  },
  {
    id: "urinalysis-complete",
    name: "Complete Urinalysis with Microscopic Examination",
    description: "Comprehensive urine analysis with AI-enhanced microscopic evaluation",
    price: 250,
    originalPrice: 150,
    category: "Clinical Microscopy",
    duration: "20 minutes",
    preparation: "Clean catch midstream urine sample",
    features: ["AI Microscopy", "Infection Detection", "Crystal Analysis", "Health Insights"],
    walkInOnly: true,
    onlinePaymentPreferred: false,
    priority: false,
    aiEnabled: true,
    popular: false,
  },
  {
    id: "chest-xray-digital",
    name: "Digital Chest X-Ray with AI Interpretation",
    description: "High-resolution digital chest radiography with AI-powered abnormality detection",
    price: 800,
    originalPrice: 600,
    category: "Radiology",
    duration: "15 minutes",
    preparation: "Remove all metal objects and jewelry",
    features: ["AI Abnormality Detection", "Lung Health Score", "Comparison Analysis", "Report Generation"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: false,
    aiEnabled: true,
    popular: false,
  },
  {
    id: "executive-health-premium",
    name: "Executive Health Package Premium",
    description: "Comprehensive executive health screening with full AI analysis and personalized health plan",
    price: 4500,
    originalPrice: 3500,
    category: "Health Packages",
    duration: "2 hours",
    preparation: "12-hour fasting required",
    features: [
      "Complete AI Health Analysis",
      "Executive Health Score",
      "Personalized Health Plan",
      "Lifestyle Coaching",
      "Follow-up Consultation",
    ],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: true,
    aiEnabled: true,
    popular: true,
  },
  {
    id: "cardiac-risk-assessment",
    name: "Comprehensive Cardiac Risk Assessment",
    description: "Advanced cardiovascular health evaluation with AI-powered risk stratification",
    price: 2200,
    originalPrice: 1800,
    category: "Cardiology",
    duration: "1 hour",
    preparation: "No special preparation required",
    features: ["AI Risk Stratification", "ECG Analysis", "Cardiac Biomarkers", "Prevention Plan"],
    walkInOnly: true,
    onlinePaymentPreferred: true,
    priority: true,
    aiEnabled: true,
    popular: false,
  },
]

// Enhanced Payment Settings with modern payment options
const enhancedPaymentSettings = {
  gcash: {
    enabled: true,
    number: "09123456789",
    name: "MAES Laboratory",
    qrCode: "/images/payment/gcash-qr.png",
    instructions: "Scan QR code or send to 09123456789. Use your full name as reference.",
    processingTime: "Instant verification",
    fees: "No additional fees",
  },
  paymaya: {
    enabled: true,
    number: "09987654321",
    name: "MAES Laboratory",
    qrCode: "/images/payment/paymaya-qr.png",
    instructions: "Scan QR code or send to 09987654321. Include appointment ID in message.",
    processingTime: "Instant verification",
    fees: "No additional fees",
  },
  bankTransfer: {
    enabled: true,
    accounts: [
      {
        bank: "BPI",
        accountName: "Maria Estrella General Hospital",
        accountNumber: "1234567890123",
        branch: "Calapan Branch",
        swiftCode: "BOPIPHMM",
      },
      {
        bank: "BDO",
        accountName: "Maria Estrella General Hospital",
        accountNumber: "9876543210987",
        branch: "Calapan Branch",
        swiftCode: "BNORPHMM",
      },
    ],
    instructions: "Transfer exact amount and send screenshot with your full name and appointment ID.",
    processingTime: "1-2 hours verification",
    fees: "Bank charges may apply",
  },
  creditCard: {
    enabled: false, // Will be enabled when payment gateway is integrated
    providers: ["Visa", "Mastercard", "JCB", "American Express"],
    processingTime: "Instant",
    fees: "3.5% processing fee",
  },
  cash: {
    enabled: true,
    note: "Cash payments accepted on arrival. Online payment customers get priority service.",
    processingTime: "Immediate",
    fees: "No additional fees",
    waitTimeIncrease: "15-30 minutes additional wait time",
  },
  hmo: {
    enabled: true,
    providers: [
      { name: "PhilHealth", coverage: "80%", requirements: "Valid PhilHealth ID" },
      { name: "Maxicare", coverage: "90%", requirements: "Valid Maxicare card and LOA" },
      { name: "Medicard", coverage: "85%", requirements: "Valid Medicard and pre-authorization" },
      { name: "Intellicare", coverage: "75%", requirements: "Valid Intellicare card" },
      { name: "Avega", coverage: "80%", requirements: "Valid Avega card and referral" },
      { name: "Cocolife", coverage: "70%", requirements: "Valid Cocolife card" },
    ],
    instructions: "Present valid HMO card and required documents. Some tests may require pre-authorization.",
    processingTime: "Depends on HMO verification",
  },
  discounts: {
    senior: {
      percentage: 20,
      requirements: "Valid Senior Citizen ID",
      description: "20% discount for patients 60 years and above",
    },
    pwd: {
      percentage: 20,
      requirements: "Valid PWD ID",
      description: "20% discount for Persons with Disabilities",
    },
    student: {
      percentage: 10,
      requirements: "Valid Student ID",
      description: "10% discount for students with valid school ID",
    },
    employee: {
      percentage: 15,
      requirements: "Valid Employee ID",
      description: "15% discount for hospital employees and their families",
    },
  },
}

// Enhanced Hospital Settings with modern features
const enhancedHospitalSettings = {
  name: "Maria Estrella General Hospital",
  shortName: "MAES Laboratory",
  address: "115 Strong Republic Nautical Highway, Calapan, MIMAROPA",
  phone: "(043) 286-2531",
  email: "mariaestrellageneralhospital@gmail.com",
  website: "https://maes-laboratory.vercel.app",

  operatingHours: {
    monday: { open: "06:00", close: "20:00", emergency: true },
    tuesday: { open: "06:00", close: "20:00", emergency: true },
    wednesday: { open: "06:00", close: "20:00", emergency: true },
    thursday: { open: "06:00", close: "20:00", emergency: true },
    friday: { open: "06:00", close: "20:00", emergency: true },
    saturday: { open: "07:00", close: "18:00", emergency: true },
    sunday: { open: "08:00", close: "16:00", emergency: true },
    holidays: { open: "08:00", close: "16:00", emergency: true },
  },

  services: {
    walkInOnly: true,
    onlinePaymentPreferred: true,
    queueManagement: true,
    emergencyServices: true,
    homeService: false,
    telemedicine: false, // Explicitly disabled
    remoteConsultation: false, // Explicitly disabled
  },

  features: {
    aiAnalysis: true,
    realTimeQueue: true,
    onlinePayment: true,
    mobileApp: true,
    pushNotifications: true,
    smsNotifications: true,
    emailNotifications: true,
    chatSupport: true,
    multiLanguage: false,
    darkMode: true,
    accessibility: true,
    offlineMode: false,
  },

  branding: {
    primaryColor: "#10b981", // Emerald-600
    secondaryColor: "#3b82f6", // Blue-600
    accentColor: "#8b5cf6", // Purple-600
    logo: "/images/maeslogo.avif",
    favicon: "/favicon.ico",
    appleTouchIcon: "/apple-touch-icon.png",
  },

  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || "",
    facebookPixel: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
    hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID || "",
    enableTracking: true,
  },

  seo: {
    title: "MAES Laboratory - Maria Estrella General Hospital",
    description:
      "Advanced laboratory services with AI-powered analysis, online payment, and smart queue management in Calapan, MIMAROPA.",
    keywords: "laboratory, medical tests, AI analysis, online payment, Calapan, MIMAROPA, blood test, health checkup",
    ogImage: "/images/og-image.jpg",
  },
}

// Enhanced System Configuration
const enhancedSystemConfig = {
  version: "2.0.0",
  lastUpdated: new Date().toISOString(),

  queue: {
    maxWaitTime: 120, // minutes
    priorityWaitTime: 30, // minutes for online payment
    averageServiceTime: 15, // minutes per patient
    maxDailyCapacity: 200, // patients per day
    queueNumberFormat: "A{000}", // A001, A002, etc.
  },

  notifications: {
    sms: {
      enabled: true,
      provider: "Semaphore",
      templates: {
        appointment_confirmed:
          "Your appointment at MAES Laboratory is confirmed for {date} at {time}. Queue number: {queue}. Estimated wait: {wait} minutes.",
        payment_received: "Payment received! Your appointment is confirmed. Show this message for priority service.",
        results_ready: "Your test results are ready! Visit our website or app to view your AI-enhanced health report.",
        queue_update: "Queue update: You are number {position} in line. Estimated wait: {wait} minutes.",
      },
    },
    email: {
      enabled: true,
      provider: "SendGrid",
      templates: {
        appointment_confirmation: "appointment-confirmation",
        payment_receipt: "payment-receipt",
        results_notification: "results-notification",
        queue_notification: "queue-notification",
      },
    },
    push: {
      enabled: true,
      provider: "Firebase",
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY || "",
    },
  },

  ai: {
    enabled: true,
    provider: "OpenAI",
    models: {
      textAnalysis: "gpt-4",
      imageAnalysis: "gpt-4-vision",
      healthScoring: "custom-health-model",
    },
    features: {
      healthScoring: true,
      riskAssessment: true,
      trendAnalysis: true,
      recommendations: true,
      abnormalityDetection: true,
    },
  },

  security: {
    encryption: "AES-256",
    tokenExpiry: 86400, // 24 hours
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireMFA: false,
    sessionTimeout: 3600, // 1 hour
  },

  performance: {
    cacheTimeout: 300, // 5 minutes
    imageOptimization: true,
    lazyLoading: true,
    compressionEnabled: true,
    cdnEnabled: true,
  },
}

export const initializeEnhancedFirebaseData = async () => {
  try {
    console.log("🚀 Initializing Enhanced MAES Laboratory System...")

    // 1. Create admin user with enhanced profile
    await createEnhancedAdminUser()

    // 2. Set up enhanced laboratory services
    await setupEnhancedServices()

    // 3. Set up enhanced payment settings
    await setupEnhancedPaymentSettings()

    // 4. Set up enhanced hospital settings
    await setupEnhancedHospitalSettings()

    // 5. Set up system configuration
    await setupSystemConfiguration()

    // 6. Create sample patient with enhanced profile
    await createEnhancedSamplePatient()

    // 7. Create sample appointments and data
    await createSampleAppointmentsAndData()

    console.log("✅ Enhanced MAES Laboratory System initialized successfully!")
    console.log("🎉 Your enhanced system is ready with modern features!")

    return {
      success: true,
      message: "Enhanced system initialized successfully",
      features: [
        "AI-Powered Analysis",
        "Modern Payment Options",
        "Smart Queue Management",
        "Enhanced User Experience",
        "Real-time Notifications",
        "Advanced Analytics",
        "Mobile-Optimized Interface",
        "Accessibility Features",
      ],
    }
  } catch (error) {
    console.error("❌ Error initializing enhanced system:", error)
    return { success: false, error: error.message }
  }
}

const createEnhancedAdminUser = async () => {
  try {
    console.log("👤 Creating enhanced admin user...")

    const adminQuery = query(collection(db, "users"), where("email", "==", "mariaestrellageneralhospital@gmail.com"))
    const adminSnapshot = await getDocs(adminQuery)

    if (!adminSnapshot.empty) {
      console.log("ℹ️ Admin user already exists, updating with enhanced features...")

      // Update existing admin with enhanced features
      const adminDoc = adminSnapshot.docs[0]
      await setDoc(
        doc(db, "users", adminDoc.id),
        {
          ...adminDoc.data(),
          features: {
            dashboard: true,
            analytics: true,
            userManagement: true,
            paymentManagement: true,
            queueManagement: true,
            reportGeneration: true,
            systemSettings: true,
            aiConfiguration: true,
          },
          permissions: ["all"],
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      return
    }

    // Create new admin user
    const adminCredential = await createUserWithEmailAndPassword(
      auth,
      "mariaestrellageneralhospital@gmail.com",
      "MariaEstrella_MEGH",
    )

    await setDoc(doc(db, "users", adminCredential.user.uid), {
      email: "mariaestrellageneralhospital@gmail.com",
      firstName: "MAES",
      lastName: "Administrator",
      role: "admin",
      phone: "(043) 286-2531",
      department: "Laboratory Administration",
      avatar: "/images/admin-avatar.png",
      features: {
        dashboard: true,
        analytics: true,
        userManagement: true,
        paymentManagement: true,
        queueManagement: true,
        reportGeneration: true,
        systemSettings: true,
        aiConfiguration: true,
      },
      permissions: ["all"],
      preferences: {
        theme: "light",
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        dashboard: {
          layout: "modern",
          widgets: ["analytics", "queue", "payments", "recent_activity"],
        },
      },
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Enhanced admin user created successfully")
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Admin user already exists in Authentication")
    } else {
      console.error("❌ Error creating enhanced admin user:", error)
      throw error
    }
  }
}

const setupEnhancedServices = async () => {
  try {
    console.log("🧪 Setting up enhanced laboratory services...")

    const servicesRef = collection(db, "services")

    for (const service of enhancedServices) {
      await setDoc(doc(servicesRef, service.id), {
        ...service,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    console.log("✅ Enhanced laboratory services setup completed")
  } catch (error) {
    console.error("❌ Error setting up enhanced services:", error)
    throw error
  }
}

const setupEnhancedPaymentSettings = async () => {
  try {
    console.log("💳 Setting up enhanced payment settings...")

    await setDoc(doc(db, "settings", "payments"), {
      ...enhancedPaymentSettings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Enhanced payment settings setup completed")
  } catch (error) {
    console.error("❌ Error setting up enhanced payment settings:", error)
    throw error
  }
}

const setupEnhancedHospitalSettings = async () => {
  try {
    console.log("🏥 Setting up enhanced hospital settings...")

    await setDoc(doc(db, "settings", "hospital"), {
      ...enhancedHospitalSettings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Enhanced hospital settings setup completed")
  } catch (error) {
    console.error("❌ Error setting up enhanced hospital settings:", error)
    throw error
  }
}

const setupSystemConfiguration = async () => {
  try {
    console.log("⚙️ Setting up system configuration...")

    await setDoc(doc(db, "settings", "system"), {
      ...enhancedSystemConfig,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ System configuration setup completed")
  } catch (error) {
    console.error("❌ Error setting up system configuration:", error)
    throw error
  }
}

const createEnhancedSamplePatient = async () => {
  try {
    console.log("👥 Creating enhanced sample patient...")

    const patientQuery = query(collection(db, "users"), where("email", "==", "patient.demo@example.com"))
    const patientSnapshot = await getDocs(patientQuery)

    if (!patientSnapshot.empty) {
      console.log("ℹ️ Sample patient already exists, updating with enhanced features...")

      const patientDoc = patientSnapshot.docs[0]
      await setDoc(
        doc(db, "users", patientDoc.id),
        {
          ...patientDoc.data(),
          avatar: "/images/patient-avatar.png",
          healthProfile: {
            bloodType: "O+",
            allergies: ["None"],
            medications: ["None"],
            conditions: ["None"],
            emergencyContact: {
              name: "Maria Dela Cruz",
              relationship: "Spouse",
              phone: "+63987654321",
            },
          },
          preferences: {
            paymentMethod: "gcash",
            notifications: {
              sms: true,
              email: true,
              push: true,
            },
            language: "en",
            theme: "light",
          },
          aiInsights: {
            healthScore: 94,
            riskLevel: "low",
            lastAssessment: serverTimestamp(),
            recommendations: [
              "Continue maintaining healthy lifestyle",
              "Regular exercise recommended",
              "Annual health checkups advised",
            ],
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      return
    }

    // Create new sample patient
    const patientCredential = await createUserWithEmailAndPassword(auth, "patient.demo@example.com", "patient123")

    await setDoc(doc(db, "users", patientCredential.user.uid), {
      email: "patient.demo@example.com",
      firstName: "Juan",
      lastName: "Dela Cruz",
      role: "patient",
      phone: "+63912345678",
      dateOfBirth: "1990-01-15",
      address: "Calapan City, Oriental Mindoro",
      avatar: "/images/patient-avatar.png",
      healthProfile: {
        bloodType: "O+",
        allergies: ["None"],
        medications: ["None"],
        conditions: ["None"],
        emergencyContact: {
          name: "Maria Dela Cruz",
          relationship: "Spouse",
          phone: "+63987654321",
        },
      },
      preferences: {
        paymentMethod: "gcash",
        notifications: {
          sms: true,
          email: true,
          push: true,
        },
        language: "en",
        theme: "light",
      },
      aiInsights: {
        healthScore: 94,
        riskLevel: "low",
        lastAssessment: serverTimestamp(),
        recommendations: [
          "Continue maintaining healthy lifestyle",
          "Regular exercise recommended",
          "Annual health checkups advised",
        ],
      },
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Enhanced sample patient created successfully")
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Sample patient already exists")
    } else {
      console.error("❌ Error creating enhanced sample patient:", error)
      throw error
    }
  }
}

const createSampleAppointmentsAndData = async () => {
  try {
    console.log("📅 Creating sample appointments and data...")

    // Get patient user ID
    const patientQuery = query(collection(db, "users"), where("email", "==", "patient.demo@example.com"))
    const patientSnapshot = await getDocs(patientQuery)

    if (patientSnapshot.empty) {
      console.log("⚠️ No sample patient found, skipping sample data creation")
      return
    }

    const patientDoc = patientSnapshot.docs[0]
    const patientId = patientDoc.id

    // Create sample appointment with online payment
    const appointmentRef = await addDoc(collection(db, "appointments"), {
      userId: patientId,
      patientName: "Juan Dela Cruz",
      patientEmail: "patient.demo@example.com",
      patientPhone: "+63912345678",
      services: ["cbc-enhanced", "lipid-profile-premium"],
      serviceNames: [
        "Complete Blood Count (CBC) with AI Analysis",
        "Premium Lipid Profile with Cardiovascular Risk Assessment",
      ],
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      timeSlot: "10:00 AM",
      status: "confirmed",
      paymentStatus: "completed",
      paymentMethod: "gcash",
      paymentReference: "GC123456789",
      totalAmount: 1400,
      discountAmount: 0,
      finalAmount: 1400,
      queueNumber: "A001",
      estimatedWaitTime: 15,
      priority: "high", // Online payment gets priority
      notes: "Online payment completed - Priority service. AI analysis requested.",
      features: ["AI Analysis", "Health Score", "Risk Assessment"],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Create sample payment transaction
    await addDoc(collection(db, "payments"), {
      userId: patientId,
      appointmentId: appointmentRef.id,
      transactionId: "TXN-" + Date.now(),
      amount: 1400,
      method: "gcash",
      status: "completed",
      reference: "GC123456789",
      screenshot: "/images/sample-payment-screenshot.jpg",
      verifiedBy: "system",
      verifiedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    })

    // Create sample queue entry
    await addDoc(collection(db, "queue"), {
      appointmentId: appointmentRef.id,
      patientId: patientId,
      patientName: "Juan Dela Cruz",
      queueNumber: "A001",
      services: ["CBC with AI Analysis", "Lipid Profile Premium"],
      priority: "high",
      status: "waiting",
      estimatedWaitTime: 15,
      checkInTime: serverTimestamp(),
      createdAt: serverTimestamp(),
    })

    // Create sample test result with AI analysis
    await addDoc(collection(db, "test_results"), {
      userId: patientId,
      appointmentId: appointmentRef.id,
      patientName: "Juan Dela Cruz",
      testType: "Complete Blood Count (CBC)",
      testDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: "completed",
      results: {
        wbc: { value: 7.5, unit: "x10³/μL", normalRange: "4.0-11.0", status: "normal" },
        rbc: { value: 4.8, unit: "x10⁶/μL", normalRange: "4.2-5.4", status: "normal" },
        hemoglobin: { value: 14.2, unit: "g/dL", normalRange: "12.0-16.0", status: "normal" },
        hematocrit: { value: 42.5, unit: "%", normalRange: "36.0-46.0", status: "normal" },
        platelets: { value: 285, unit: "x10³/μL", normalRange: "150-450", status: "normal" },
      },
      aiAnalysis: {
        healthScore: 94,
        overallAssessment: "excellent",
        riskFactors: [],
        recommendations: [
          "Continue maintaining healthy lifestyle",
          "Regular exercise and balanced diet",
          "Annual health checkups recommended",
          "Monitor stress levels",
        ],
        confidence: 0.95,
        trends: {
          improving: ["overall_health"],
          stable: ["blood_parameters"],
          concerning: [],
        },
        insights: [
          "Your blood parameters are within optimal ranges",
          "Excellent immune system indicators",
          "Low cardiovascular risk profile",
        ],
      },
      reviewedBy: "Dr. Maria Santos",
      reviewedAt: serverTimestamp(),
      reportGenerated: true,
      reportUrl: "/reports/sample-cbc-report.pdf",
      createdAt: serverTimestamp(),
    })

    // Create sample medical certificate
    await addDoc(collection(db, "medical_certificates"), {
      userId: patientId,
      patientName: "Juan Dela Cruz",
      certificateType: "fitness",
      purpose: "Employment at ABC Company",
      status: "completed",
      paymentStatus: "completed",
      amount: 200,
      paymentMethod: "gcash",
      issuedBy: "Dr. Maria Santos",
      issueDate: serverTimestamp(),
      certificateNumber: "CERT-2024-001",
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      certificateUrl: "/certificates/sample-fitness-cert.pdf",
      createdAt: serverTimestamp(),
    })

    // Create sample chat session
    await addDoc(collection(db, "chat_sessions"), {
      userId: patientId,
      patientName: "Juan Dela Cruz",
      sessionType: "general_inquiry",
      status: "completed",
      messages: [
        {
          type: "user",
          message: "Hello, I'd like to know about your AI-enhanced blood tests",
          timestamp: serverTimestamp(),
        },
        {
          type: "bot",
          message:
            "Hello! Our AI-enhanced blood tests provide detailed health insights, risk assessments, and personalized recommendations. Would you like to book an appointment?",
          timestamp: serverTimestamp(),
        },
        {
          type: "user",
          message: "Yes, I'd like to book a CBC with AI analysis",
          timestamp: serverTimestamp(),
        },
        {
          type: "bot",
          message:
            "Great! I can help you book a Complete Blood Count with AI Analysis. The cost is ₱450 and includes health scoring, trend analysis, and personalized recommendations. Would you like to proceed?",
          timestamp: serverTimestamp(),
        },
      ],
      rating: 5,
      feedback: "Very helpful and informative!",
      createdAt: serverTimestamp(),
      endedAt: serverTimestamp(),
    })

    console.log("✅ Sample appointments and data created successfully")
  } catch (error) {
    console.error("❌ Error creating sample appointments and data:", error)
    throw error
  }
}

// Utility function to check enhanced Firebase connection
export const checkEnhancedFirebaseConnection = async () => {
  try {
    console.log("🔍 Checking enhanced Firebase connection...")

    // Test Firestore connection
    const testDoc = await getDocs(collection(db, "users"))
    console.log("✅ Firestore connection successful")

    // Test Authentication
    console.log("✅ Authentication service available")

    // Test enhanced features
    const settingsDoc = await getDocs(collection(db, "settings"))
    console.log("✅ Enhanced settings available")

    return {
      success: true,
      message: "Enhanced Firebase connection successful",
      features: ["Firestore", "Authentication", "Storage", "Enhanced Settings"],
    }
  } catch (error) {
    console.error("❌ Enhanced Firebase connection failed:", error)
    return { success: false, error: error.message }
  }
}

// Function to update existing data to enhanced version
export const upgradeToEnhancedVersion = async () => {
  try {
    console.log("🔄 Upgrading to enhanced version...")

    // This function can be used to upgrade existing installations
    await initializeEnhancedFirebaseData()

    console.log("✅ Upgrade to enhanced version completed!")
    return { success: true, message: "Successfully upgraded to enhanced version" }
  } catch (error) {
    console.error("❌ Error upgrading to enhanced version:", error)
    return { success: false, error: error.message }
  }
}

// Enhanced Firebase utilities
export const firebaseUtils = {
  // Connection status
  isConnected: () => {
    return !!(app && auth && db && storage)
  },

  // Get current user with enhanced info
  getCurrentUser: () => {
    return auth.currentUser
  },

  // Check if user is admin
  isAdmin: async (uid: string) => {
    try {
      const { doc, getDoc } = await import("firebase/firestore")
      const userDoc = await getDoc(doc(db, "users", uid))
      return userDoc.exists() && userDoc.data()?.role === "admin"
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  },

  // Enhanced error handling
  handleError: (error: any) => {
    console.error("Firebase error:", error)

    const errorMessages: { [key: string]: string } = {
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password should be at least 6 characters long.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/network-request-failed": "Network error. Please check your connection.",
      "permission-denied": "You do not have permission to perform this action.",
      unavailable: "Service temporarily unavailable. Please try again later.",
    }

    return errorMessages[error.code] || error.message || "An unexpected error occurred."
  },

  // Performance monitoring
  logPerformance: (action: string, startTime: number) => {
    const duration = Date.now() - startTime
    console.log(`Firebase ${action} completed in ${duration}ms`)

    if (analytics && typeof window !== "undefined") {
      import("firebase/analytics").then(({ logEvent }) => {
        logEvent(analytics!, "firebase_performance", {
          action,
          duration,
          timestamp: Date.now(),
        })
      })
    }
  },
}

// Export Firebase instances
export { app, auth, db, storage, analytics }
export default app
