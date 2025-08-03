const admin = require("firebase-admin")
const fs = require("fs")
const path = require("path")

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      // For local development with service account
      const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json")

      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath)
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        })
        console.log("✅ Firebase Admin initialized with service account")
      } else {
        // For production or when using environment variables
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        })
        console.log("✅ Firebase Admin initialized with default credentials")
      }
    }

    return admin.firestore()
  } catch (error) {
    console.error("❌ Firebase initialization error:", error.message)
    console.log("\n🔧 Setup Instructions:")
    console.log("1. Go to Firebase Console → Project Settings → Service Accounts")
    console.log("2. Click 'Generate new private key'")
    console.log("3. Save as 'firebase-service-account.json' in project root")
    console.log("4. Or set up Application Default Credentials")
    process.exit(1)
  }
}

// Enhanced sample data
const laboratoryTests = [
  {
    id: "complete-blood-count",
    name: "Complete Blood Count (CBC)",
    description:
      "Comprehensive blood analysis including white blood cells, red blood cells, hemoglobin, hematocrit, and platelets with AI-powered health insights",
    price: 350,
    duration: "2-4 hours",
    category: "Hematology",
    requirements: "No fasting required",
    active: true,
    featured: true,
    aiAnalysis: true,
    normalRanges: {
      wbc: "4.5-11.0 x10³/μL",
      rbc: "4.5-5.5 x10⁶/μL",
      hemoglobin: "12.0-16.0 g/dL",
      hematocrit: "36-46%",
      platelets: "150-450 x10³/μL",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fasting-blood-sugar",
    name: "Fasting Blood Sugar (FBS)",
    description:
      "Measures glucose levels after fasting to screen for diabetes and prediabetes with personalized health recommendations",
    price: 150,
    duration: "1-2 hours",
    category: "Chemistry",
    requirements: "8-12 hours fasting required",
    active: true,
    featured: true,
    aiAnalysis: true,
    normalRanges: {
      glucose: "70-100 mg/dL",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "lipid-profile-complete",
    name: "Complete Lipid Profile",
    description:
      "Comprehensive cholesterol and triglyceride analysis with cardiovascular risk assessment and lifestyle recommendations",
    price: 450,
    duration: "2-4 hours",
    category: "Chemistry",
    requirements: "12 hours fasting required",
    active: true,
    featured: true,
    aiAnalysis: true,
    normalRanges: {
      totalCholesterol: "<200 mg/dL",
      ldl: "<100 mg/dL",
      hdl: ">40 mg/dL (men), >50 mg/dL (women)",
      triglycerides: "<150 mg/dL",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "comprehensive-urinalysis",
    name: "Comprehensive Urinalysis",
    description:
      "Complete urine examination for kidney function, infections, and metabolic disorders with microscopic analysis",
    price: 120,
    duration: "1-2 hours",
    category: "Clinical Microscopy",
    requirements: "Clean catch midstream urine sample",
    active: true,
    featured: false,
    aiAnalysis: true,
    normalRanges: {
      protein: "Negative",
      glucose: "Negative",
      ketones: "Negative",
      blood: "Negative",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hepatitis-b-surface-antigen",
    name: "Hepatitis B Surface Antigen (HBsAg)",
    description: "Rapid screening test for Hepatitis B infection with confirmatory testing available",
    price: 200,
    duration: "2-4 hours",
    category: "Serology",
    requirements: "No special preparation required",
    active: true,
    featured: false,
    aiAnalysis: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "thyroid-function-panel",
    name: "Thyroid Function Panel (TSH, T3, T4)",
    description:
      "Complete thyroid hormone assessment including TSH, Free T3, and Free T4 with metabolic health insights",
    price: 800,
    duration: "4-6 hours",
    category: "Endocrinology",
    requirements: "No fasting required, avoid biotin supplements 72 hours prior",
    active: true,
    featured: true,
    aiAnalysis: true,
    normalRanges: {
      tsh: "0.4-4.0 mIU/L",
      freeT3: "2.3-4.2 pg/mL",
      freeT4: "0.8-1.8 ng/dL",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Enhanced admin user
const adminUser = {
  uid: "admin-maes-001",
  email: "admin@maeslaboratory.com",
  displayName: "MAES Laboratory Administrator",
  role: "admin",
  permissions: [
    "read",
    "write",
    "delete",
    "manage_users",
    "view_reports",
    "manage_tests",
    "process_payments",
    "export_data",
    "system_settings",
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  active: true,
  profile: {
    firstName: "MAES",
    lastName: "Administrator",
    phone: "+63 43 286 2531",
    department: "Laboratory Administration",
    position: "System Administrator",
    avatar: "/images/admin-avatar.png",
  },
  preferences: {
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    dashboard: {
      defaultView: "analytics",
      refreshInterval: 30,
    },
  },
}

// Enhanced patient user
const patientUser = {
  uid: "patient-demo-001",
  email: "patient.demo@example.com",
  displayName: "John Doe",
  role: "patient",
  permissions: ["read", "book_appointments", "view_results", "make_payments", "chat_support"],
  createdAt: new Date(),
  updatedAt: new Date(),
  active: true,
  profile: {
    firstName: "John",
    lastName: "Doe",
    phone: "+63 987 654 3210",
    dateOfBirth: "1990-01-15",
    gender: "Male",
    address: {
      street: "123 Main Street",
      city: "Calapan",
      province: "Oriental Mindoro",
      zipCode: "5200",
      country: "Philippines",
    },
    emergencyContact: {
      name: "Jane Doe",
      phone: "+63 987 654 3211",
      relationship: "Spouse",
    },
    medicalHistory: {
      allergies: ["None known"],
      medications: [],
      conditions: [],
    },
  },
  preferences: {
    notifications: {
      method: "sms",
      appointmentReminders: true,
      resultNotifications: true,
      promotions: false,
    },
    privacy: {
      shareDataForResearch: false,
      allowMarketing: false,
    },
  },
}

// Enhanced system settings
const systemSettings = {
  id: "general",
  hospitalInfo: {
    name: "Maria Estrella General Hospital Laboratory",
    shortName: "MAES Laboratory",
    address: {
      street: "115 Strong Republic Nautical Highway",
      city: "Calapan",
      province: "Oriental Mindoro",
      region: "MIMAROPA",
      zipCode: "5200",
      country: "Philippines",
    },
    contact: {
      phone: "(043) 286-2531",
      email: "mariaestrellageneralhospital@gmail.com",
      website: "https://maeslaboratory.com",
      emergencyPhone: "(043) 286-2531",
    },
    license: {
      number: "LTO-2024-001",
      issueDate: "2024-01-01",
      expiryDate: "2025-12-31",
      issuingAuthority: "Department of Health - MIMAROPA",
    },
  },
  operatingHours: {
    monday: { open: "07:00", close: "17:00", isOpen: true },
    tuesday: { open: "07:00", close: "17:00", isOpen: true },
    wednesday: { open: "07:00", close: "17:00", isOpen: true },
    thursday: { open: "07:00", close: "17:00", isOpen: true },
    friday: { open: "07:00", close: "17:00", isOpen: true },
    saturday: { open: "07:00", close: "12:00", isOpen: true },
    sunday: { open: "00:00", close: "00:00", isOpen: false },
  },
  paymentMethods: {
    cash: { enabled: true, processingFee: 0 },
    gcash: {
      enabled: true,
      number: "09123456789",
      name: "MAES Laboratory",
      processingFee: 0.02,
    },
    paymaya: {
      enabled: true,
      merchantId: "MAES_LAB_001",
      name: "MAES Laboratory",
      processingFee: 0.025,
    },
    bankTransfer: {
      enabled: true,
      banks: [
        {
          name: "BPI",
          accountNumber: "1234567890123",
          accountName: "Maria Estrella General Hospital",
        },
        {
          name: "BDO",
          accountNumber: "9876543210987",
          accountName: "Maria Estrella General Hospital",
        },
      ],
      processingFee: 0,
    },
    creditCard: { enabled: false, processingFee: 0.035 },
  },
  notifications: {
    sms: {
      enabled: true,
      provider: "Semaphore",
      defaultSender: "MAES_LAB",
    },
    email: {
      enabled: true,
      provider: "SendGrid",
      fromEmail: "noreply@maeslaboratory.com",
      fromName: "MAES Laboratory",
    },
    push: {
      enabled: true,
      provider: "Firebase",
    },
  },
  features: {
    onlineBooking: { enabled: true, advanceBookingDays: 30 },
    resultsPortal: { enabled: true, autoNotify: true },
    chatSupport: { enabled: true, aiAssistant: true },
    mobileApp: { enabled: true, version: "2.0.0" },
    aiAnalysis: { enabled: true, provider: "OpenAI" },
    queueManagement: { enabled: true, realTimeUpdates: true },
    telehealth: { enabled: false },
    homeService: { enabled: false },
  },
  security: {
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    twoFactorAuth: { enabled: false, required: false },
    dataEncryption: { enabled: true, algorithm: "AES-256" },
  },
  analytics: {
    googleAnalytics: { enabled: true, trackingId: "" },
    facebookPixel: { enabled: false, pixelId: "" },
    customTracking: { enabled: true },
  },
  maintenance: {
    scheduledMaintenance: false,
    maintenanceMessage: "System is currently under maintenance. Please try again later.",
    allowedIPs: [],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Sample appointments for demo
const sampleAppointments = [
  {
    id: "apt-001",
    patientId: "patient-demo-001",
    patientName: "John Doe",
    testIds: ["complete-blood-count", "fasting-blood-sugar"],
    appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    appointmentTime: "09:00",
    status: "confirmed",
    paymentStatus: "pending",
    totalAmount: 500,
    notes: "Regular health checkup",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "apt-002",
    patientId: "patient-demo-001",
    patientName: "John Doe",
    testIds: ["lipid-profile-complete"],
    appointmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
    appointmentTime: "10:30",
    status: "completed",
    paymentStatus: "paid",
    totalAmount: 450,
    notes: "Follow-up lipid panel",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
]

// Setup function
const setupFirebaseData = async () => {
  console.log("🚀 Starting Enhanced MAES Laboratory Firebase Setup...\n")

  const db = initializeFirebase()

  try {
    // Setup laboratory tests
    console.log("🧪 Setting up enhanced laboratory tests...")
    const testsCollection = db.collection("laboratory_tests")

    for (const test of laboratoryTests) {
      await testsCollection.doc(test.id).set(test)
      console.log(`   ✅ Added test: ${test.name}`)
    }

    // Setup users
    console.log("\n👥 Setting up users...")
    const usersCollection = db.collection("users")

    await usersCollection.doc(adminUser.uid).set(adminUser)
    console.log(`   ✅ Added admin user: ${adminUser.email}`)

    await usersCollection.doc(patientUser.uid).set(patientUser)
    console.log(`   ✅ Added patient user: ${patientUser.email}`)

    // Setup system settings
    console.log("\n⚙️ Setting up enhanced system settings...")
    await db.collection("settings").doc("general").set(systemSettings)
    console.log("   ✅ System settings configured")

    // Setup sample appointments
    console.log("\n📅 Setting up sample appointments...")
    const appointmentsCollection = db.collection("appointments")

    for (const appointment of sampleAppointments) {
      await appointmentsCollection.doc(appointment.id).set(appointment)
      console.log(`   ✅ Added appointment: ${appointment.id}`)
    }

    // Initialize collections with proper structure
    console.log("\n📁 Initializing enhanced collections...")

    const collections = [
      "test_results",
      "payments",
      "chat_sessions",
      "notifications",
      "queue_management",
      "analytics",
      "audit_logs",
    ]

    for (const collectionName of collections) {
      await db.collection(collectionName).doc("_init").set({
        initialized: true,
        createdAt: new Date(),
        version: "2.0.0",
      })
    }

    console.log("   ✅ Collections initialized")

    // Create sample queue entries
    console.log("\n🎯 Setting up queue management...")
    await db
      .collection("queue_management")
      .doc("current-queue")
      .set({
        date: new Date().toISOString().split("T")[0],
        totalPatients: 0,
        currentNumber: 0,
        averageWaitTime: 15,
        status: "active",
        lastUpdated: new Date(),
      })

    console.log("   ✅ Queue management initialized")

    console.log("\n🎉 Enhanced Firebase setup completed successfully!")
    console.log("\n📊 Setup Summary:")
    console.log(`   • ${laboratoryTests.length} enhanced laboratory tests`)
    console.log("   • 2 users (1 admin, 1 patient)")
    console.log("   • Enhanced system settings")
    console.log("   • Sample appointments")
    console.log("   • Queue management system")
    console.log("   • Analytics tracking")
    console.log("   • Security configurations")

    console.log("\n🔐 Default Login Credentials:")
    console.log("   👨‍⚕️ Admin Portal:")
    console.log("     Email: admin@maeslaboratory.com")
    console.log("     Password: (Set in Firebase Auth Console)")
    console.log("\n   👤 Patient Portal:")
    console.log("     Email: patient.demo@example.com")
    console.log("     Password: (Set in Firebase Auth Console)")

    console.log("\n🌟 Enhanced Features Enabled:")
    console.log("   ✅ AI-powered test analysis")
    console.log("   ✅ Real-time queue management")
    console.log("   ✅ Advanced payment processing")
    console.log("   ✅ Smart notifications (SMS + Email)")
    console.log("   ✅ Modern UI with animations")
    console.log("   ✅ Mobile-optimized interface")
    console.log("   ✅ Analytics and reporting")
    console.log("   ✅ Security and compliance")

    console.log("\n🚀 Next Steps:")
    console.log("   1. Set up Firebase Authentication users")
    console.log("   2. Configure payment gateway credentials")
    console.log("   3. Customize branding and colors")
    console.log("   4. Add your laboratory services")
    console.log("   5. Train staff on the new system")
    console.log("   6. Launch to patients")

    console.log("\n🌐 Access Your System:")
    console.log("   Local: http://localhost:3000")
    console.log("   Production: https://your-domain.vercel.app")
  } catch (error) {
    console.error("❌ Setup failed:", error)
    console.log("\n🔧 Troubleshooting:")
    console.log("   1. Check Firebase project permissions")
    console.log("   2. Verify service account key")
    console.log("   3. Ensure Firestore is enabled")
    console.log("   4. Check internet connection")
    process.exit(1)
  }
}

// Run setup
if (require.main === module) {
  setupFirebaseData()
}

module.exports = { setupFirebaseData }
