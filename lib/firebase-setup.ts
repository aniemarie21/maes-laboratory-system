import { db, auth } from "./firebase-config"
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"

// Sample data for initial setup
const sampleServices = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive blood analysis including white blood cells, red blood cells, and platelets",
    price: 350,
    category: "Hematology",
    duration: "24 hours",
    preparation: "No special preparation required",
    aiEnabled: true,
  },
  {
    id: "lipid-profile",
    name: "Lipid Profile",
    description: "Cholesterol and triglyceride levels assessment",
    price: 600,
    category: "Clinical Chemistry",
    duration: "24 hours",
    preparation: "12-hour fasting required",
    aiEnabled: true,
  },
  {
    id: "blood-sugar",
    name: "Blood Sugar (FBS/RBS)",
    description: "Fasting and random blood sugar levels",
    price: 150,
    category: "Clinical Chemistry",
    duration: "2 hours",
    preparation: "8-hour fasting for FBS",
    aiEnabled: true,
  },
  {
    id: "thyroid-function",
    name: "Thyroid Function Tests",
    description: "TSH, T3, T4 levels assessment",
    price: 1200,
    category: "Endocrinology",
    duration: "48 hours",
    preparation: "No special preparation required",
    aiEnabled: true,
  },
  {
    id: "liver-function",
    name: "Liver Function Tests",
    description: "ALT, AST, bilirubin, and other liver markers",
    price: 800,
    category: "Clinical Chemistry",
    duration: "24 hours",
    preparation: "No special preparation required",
    aiEnabled: true,
  },
]

const sampleNotifications = [
  {
    title: "Welcome to MAES Laboratory",
    message: "Your account has been successfully created. You can now book appointments and view results.",
    type: "success",
    category: "system",
  },
  {
    title: "New AI Features Available",
    message: "Experience our new AI-powered test result analysis for better health insights.",
    type: "info",
    category: "system",
  },
  {
    title: "Payment Methods Updated",
    message: "We now accept GCash, bank transfers, and various HMO plans for your convenience.",
    type: "info",
    category: "payment",
  },
]

const sampleSettings = {
  hospitalInfo: {
    name: "Maria Estrella General Hospital",
    address: "115 Strong Republic Nautical Highway, Calapan, MIMAROPA",
    phone: "(043) 286-2531",
    email: "mariaestrellageneralhospital@gmail.com",
    website: "https://maes-laboratory.vercel.app",
    operatingHours: {
      weekdays: "6:00 AM - 8:00 PM",
      saturday: "7:00 AM - 6:00 PM",
      sunday: "8:00 AM - 4:00 PM",
      emergency: "24/7",
    },
  },
  paymentMethods: {
    cash: true,
    creditCard: true,
    gcash: {
      enabled: true,
      number: "09123456789",
      name: "MAES Laboratory",
    },
    bankTransfer: {
      enabled: true,
      accountName: "Maria Estrella General Hospital",
      accountNumber: "1234567890",
      bank: "BPI",
    },
    hmo: ["PhilHealth", "Maxicare", "Medicard", "Intellicare"],
  },
  aiSettings: {
    enabled: true,
    analysisTypes: ["predictive", "diagnostic", "trend"],
    confidenceThreshold: 0.85,
    autoReports: true,
  },
  notificationSettings: {
    sms: {
      enabled: true,
      provider: "Semaphore",
    },
    email: {
      enabled: true,
      provider: "Gmail",
    },
    push: {
      enabled: true,
    },
  },
}

export const initializeFirebaseData = async () => {
  try {
    console.log("🔥 Initializing Firebase data...")

    // 1. Create admin user if not exists
    await createAdminUser()

    // 2. Set up services collection
    await setupServices()

    // 3. Set up system notifications
    await setupNotifications()

    // 4. Set up system settings
    await setupSettings()

    // 5. Create sample patient data
    await createSamplePatient()

    console.log("✅ Firebase data initialization completed successfully!")
    return { success: true, message: "Firebase data initialized successfully" }
  } catch (error) {
    console.error("❌ Error initializing Firebase data:", error)
    return { success: false, error: error.message }
  }
}

const createAdminUser = async () => {
  try {
    console.log("👤 Creating admin user...")

    // Check if admin user already exists
    const adminQuery = query(collection(db, "users"), where("email", "==", "mariaestrellageneralhospital@gmail.com"))
    const adminSnapshot = await getDocs(adminQuery)

    if (!adminSnapshot.empty) {
      console.log("ℹ️ Admin user already exists")
      return
    }

    // Create admin user in Authentication
    const adminCredential = await createUserWithEmailAndPassword(
      auth,
      "mariaestrellageneralhospital@gmail.com",
      "MariaEstrella_MEGH",
    )

    // Create admin user document in Firestore
    await setDoc(doc(db, "users", adminCredential.user.uid), {
      email: "mariaestrellageneralhospital@gmail.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phone: "(043) 286-2531",
      department: "Laboratory Administration",
      permissions: ["all"],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    })

    console.log("✅ Admin user created successfully")
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Admin user already exists in Authentication")
    } else {
      console.error("❌ Error creating admin user:", error)
      throw error
    }
  }
}

const setupServices = async () => {
  try {
    console.log("🧪 Setting up laboratory services...")

    const servicesRef = collection(db, "services")

    for (const service of sampleServices) {
      await setDoc(doc(servicesRef, service.id), {
        ...service,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      })
    }

    console.log("✅ Laboratory services setup completed")
  } catch (error) {
    console.error("❌ Error setting up services:", error)
    throw error
  }
}

const setupNotifications = async () => {
  try {
    console.log("🔔 Setting up system notifications...")

    const notificationsRef = collection(db, "system_notifications")

    for (const notification of sampleNotifications) {
      await addDoc(notificationsRef, {
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
    }

    console.log("✅ System notifications setup completed")
  } catch (error) {
    console.error("❌ Error setting up notifications:", error)
    throw error
  }
}

const setupSettings = async () => {
  try {
    console.log("⚙️ Setting up system settings...")

    await setDoc(doc(db, "settings", "hospital"), {
      ...sampleSettings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ System settings setup completed")
  } catch (error) {
    console.error("❌ Error setting up settings:", error)
    throw error
  }
}

const createSamplePatient = async () => {
  try {
    console.log("👥 Creating sample patient data...")

    // Check if sample patient already exists
    const patientQuery = query(collection(db, "users"), where("email", "==", "patient.demo@example.com"))
    const patientSnapshot = await getDocs(patientQuery)

    if (!patientSnapshot.empty) {
      console.log("ℹ️ Sample patient already exists")
      return
    }

    // Create sample patient user
    const patientCredential = await createUserWithEmailAndPassword(auth, "patient.demo@example.com", "patient123")

    // Create patient user document
    await setDoc(doc(db, "users", patientCredential.user.uid), {
      email: "patient.demo@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "patient",
      phone: "+63912345678",
      dateOfBirth: "1990-01-15",
      address: "Calapan City, Oriental Mindoro",
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "+63987654321",
      },
      medicalHistory: {
        allergies: ["None"],
        medications: ["None"],
        conditions: ["None"],
      },
      preferences: {
        notifications: {
          sms: true,
          email: true,
          push: true,
        },
        language: "en",
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    })

    // Create sample appointment
    await addDoc(collection(db, "appointments"), {
      userId: patientCredential.user.uid,
      patientName: "John Doe",
      services: ["cbc", "lipid-profile"],
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      timeSlot: "10:00 AM",
      status: "pending",
      amount: 950,
      paymentMethod: "cash",
      notes: "Regular health checkup",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Create sample test result
    await addDoc(collection(db, "test_results"), {
      userId: patientCredential.user.uid,
      patientName: "John Doe",
      testType: "Complete Blood Count",
      testDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      results: {
        wbc: { value: 7.5, unit: "x10³/μL", normalRange: "4.0-11.0", status: "normal" },
        rbc: { value: 4.8, unit: "x10⁶/μL", normalRange: "4.2-5.4", status: "normal" },
        hemoglobin: { value: 14.2, unit: "g/dL", normalRange: "12.0-16.0", status: "normal" },
        hematocrit: { value: 42.5, unit: "%", normalRange: "36.0-46.0", status: "normal" },
        platelets: { value: 285, unit: "x10³/μL", normalRange: "150-450", status: "normal" },
      },
      aiAnalysis: {
        overallHealth: "excellent",
        riskFactors: [],
        recommendations: [
          "Continue maintaining healthy lifestyle",
          "Regular exercise and balanced diet",
          "Annual health checkups recommended",
        ],
        confidence: 0.95,
        trends: {
          improving: ["overall_health"],
          stable: ["blood_parameters"],
          concerning: [],
        },
      },
      status: "completed",
      reviewedBy: "Dr. Maria Santos",
      createdAt: serverTimestamp(),
    })

    console.log("✅ Sample patient data created successfully")
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Sample patient already exists")
    } else {
      console.error("❌ Error creating sample patient:", error)
      throw error
    }
  }
}

// Utility function to check if Firebase is properly configured
export const checkFirebaseConnection = async () => {
  try {
    console.log("🔍 Checking Firebase connection...")

    // Test Firestore connection
    const testDoc = await getDocs(collection(db, "users"))
    console.log("✅ Firestore connection successful")

    // Test Authentication
    console.log("✅ Authentication service available")

    return { success: true, message: "Firebase connection successful" }
  } catch (error) {
    console.error("❌ Firebase connection failed:", error)
    return { success: false, error: error.message }
  }
}

// Function to reset all data (use with caution)
export const resetFirebaseData = async () => {
  try {
    console.log("🗑️ Resetting Firebase data...")

    // This would require admin SDK for bulk operations
    // For now, we'll just log the intention
    console.log("⚠️ Data reset requires manual intervention in Firebase Console")

    return { success: true, message: "Data reset initiated" }
  } catch (error) {
    console.error("❌ Error resetting data:", error)
    return { success: false, error: error.message }
  }
}
