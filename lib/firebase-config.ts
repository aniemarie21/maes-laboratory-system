// Firebase Configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Admin Configuration (Hidden from public)
export const ADMIN_CONFIG = {
  email: "mariaestrellageneralhospital@gmail.com",
  password: "MariaEstrella_MEGH",
}

// Database Collections
export const COLLECTIONS = {
  USERS: "users",
  APPOINTMENTS: "appointments",
  SERVICES: "services",
  PAYMENTS: "payments",
  RESULTS: "results",
  NOTIFICATIONS: "notifications",
  ACTIVITY_LOGS: "activity_logs",
}

// Service Categories
export const SERVICE_CATEGORIES = [
  "Hematology",
  "Laboratory",
  "Radiology",
  "Cardiology",
  "Endocrinology",
  "Serology",
  "Pathology",
  "Microbiology",
]

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

// Payment Methods
export const PAYMENT_METHODS = {
  GCASH: "gcash",
  PAYMAYA: "paymaya",
  BANK_TRANSFER: "bank-transfer",
  CASH: "cash",
}
