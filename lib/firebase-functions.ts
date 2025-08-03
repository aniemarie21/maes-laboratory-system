import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { auth, db, storage } from "./firebase-config"

// Authentication Functions
export const authFunctions = {
  // Register new user
  register: async (email: string, password: string, userData: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create user document in Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      })

      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword)
        return { success: true }
      }
      return { success: false, error: "No authenticated user" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// User Management Functions
export const userFunctions = {
  // Get user profile
  getProfile: async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() }
      }
      return { success: false, error: "User not found" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update user profile
  updateProfile: async (userId: string, userData: any) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        ...userData,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"))
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: users }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get users by role
  getUsersByRole: async (role: string) => {
    try {
      const q = query(collection(db, "users"), where("role", "==", role))
      const usersSnapshot = await getDocs(q)
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: users }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// Appointment Functions
export const appointmentFunctions = {
  // Create appointment
  create: async (appointmentData: any) => {
    try {
      const docRef = await addDoc(collection(db, "appointments"), {
        ...appointmentData,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get user appointments
  getUserAppointments: async (userId: string) => {
    try {
      const q = query(collection(db, "appointments"), where("userId", "==", userId), orderBy("createdAt", "desc"))
      const appointmentsSnapshot = await getDocs(q)
      const appointments = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: appointments }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all appointments (admin only)
  getAllAppointments: async () => {
    try {
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"))
      const appointmentsSnapshot = await getDocs(q)
      const appointments = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: appointments }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update appointment status
  updateStatus: async (appointmentId: string, status: string, notes?: string) => {
    try {
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      }
      if (notes) updateData.adminNotes = notes

      await updateDoc(doc(db, "appointments", appointmentId), updateData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete appointment
  delete: async (appointmentId: string) => {
    try {
      await deleteDoc(doc(db, "appointments", appointmentId))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// Test Results Functions
export const testResultFunctions = {
  // Create test result
  create: async (resultData: any) => {
    try {
      const docRef = await addDoc(collection(db, "test_results"), {
        ...resultData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get user test results
  getUserResults: async (userId: string) => {
    try {
      const q = query(collection(db, "test_results"), where("userId", "==", userId), orderBy("testDate", "desc"))
      const resultsSnapshot = await getDocs(q)
      const results = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: results }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all test results (admin only)
  getAllResults: async () => {
    try {
      const q = query(collection(db, "test_results"), orderBy("testDate", "desc"))
      const resultsSnapshot = await getDocs(q)
      const results = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: results }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update test result
  update: async (resultId: string, resultData: any) => {
    try {
      await updateDoc(doc(db, "test_results", resultId), {
        ...resultData,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// Notification Functions
export const notificationFunctions = {
  // Create notification
  create: async (notificationData: any) => {
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        ...notificationData,
        read: false,
        createdAt: serverTimestamp(),
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get user notifications
  getUserNotifications: async (userId: string) => {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(50),
      )
      const notificationsSnapshot = await getDocs(q)
      const notifications = notificationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: notifications }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
        readAt: serverTimestamp(),
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete notification
  delete: async (notificationId: string) => {
    try {
      await deleteDoc(doc(db, "notifications", notificationId))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// File Upload Functions
export const fileUploadFunctions = {
  // Upload file
  uploadFile: async (file: File, path: string) => {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return { success: true, url: downloadURL }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete file
  deleteFile: async (path: string) => {
    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// Analytics Functions
export const analyticsFunctions = {
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      // Get total users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const totalUsers = usersSnapshot.size

      // Get total appointments
      const appointmentsSnapshot = await getDocs(collection(db, "appointments"))
      const totalAppointments = appointmentsSnapshot.size

      // Get pending appointments
      const pendingQuery = query(collection(db, "appointments"), where("status", "==", "pending"))
      const pendingSnapshot = await getDocs(pendingQuery)
      const pendingAppointments = pendingSnapshot.size

      // Get completed tests
      const completedQuery = query(collection(db, "test_results"), where("status", "==", "completed"))
      const completedSnapshot = await getDocs(completedQuery)
      const completedTests = completedSnapshot.size

      return {
        success: true,
        data: {
          totalUsers,
          totalAppointments,
          pendingAppointments,
          completedTests,
        },
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get monthly stats
  getMonthlyStats: async (year: number, month: number) => {
    try {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)

      const q = query(
        collection(db, "appointments"),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate)),
      )

      const snapshot = await getDocs(q)
      const appointments = snapshot.docs.map((doc) => doc.data())

      return { success: true, data: appointments }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// Settings Functions
export const settingsFunctions = {
  // Get settings
  getSettings: async (settingType: string) => {
    try {
      const settingDoc = await getDoc(doc(db, "settings", settingType))
      if (settingDoc.exists()) {
        return { success: true, data: settingDoc.data() }
      }
      return { success: false, error: "Settings not found" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update settings
  updateSettings: async (settingType: string, settingsData: any) => {
    try {
      await updateDoc(doc(db, "settings", settingType), {
        ...settingsData,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// Medical Certificate Functions
export const medicalCertificateFunctions = {
  // Request medical certificate
  request: async (certificateData: any) => {
    try {
      const docRef = await addDoc(collection(db, "medical_certificates"), {
        ...certificateData,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get user certificates
  getUserCertificates: async (userId: string) => {
    try {
      const q = query(
        collection(db, "medical_certificates"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      )
      const certificatesSnapshot = await getDocs(q)
      const certificates = certificatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { success: true, data: certificates }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update certificate status
  updateStatus: async (certificateId: string, status: string, adminNotes?: string) => {
    try {
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      }
      if (adminNotes) updateData.adminNotes = adminNotes
      if (status === "approved") updateData.approvedAt = serverTimestamp()

      await updateDoc(doc(db, "medical_certificates", certificateId), updateData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

// Export all functions
export default {
  auth: authFunctions,
  user: userFunctions,
  appointment: appointmentFunctions,
  testResult: testResultFunctions,
  notification: notificationFunctions,
  fileUpload: fileUploadFunctions,
  analytics: analyticsFunctions,
  settings: settingsFunctions,
  medicalCertificate: medicalCertificateFunctions,
}
