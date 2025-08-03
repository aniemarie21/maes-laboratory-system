# 🔥 Firebase Setup Guide for MAES Laboratory System

This comprehensive guide will walk you through setting up Firebase for the MAES Laboratory Management System.

## 📋 Prerequisites

- Google account
- Node.js installed (v18+)
- Basic understanding of Firebase concepts

## 🚀 Step 1: Create Firebase Project

### 1.1 Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Click **"Create a project"**

### 1.2 Project Configuration
1. **Project name**: `maes-laboratory-system`
2. **Project ID**: Will be auto-generated (e.g., `maes-laboratory-system-12345`)
3. **Analytics**: Enable Google Analytics (recommended)
4. **Analytics account**: Create new or use existing
5. Click **"Create project"**

### 1.3 Wait for Project Creation
- Firebase will set up your project (takes 1-2 minutes)
- Click **"Continue"** when ready

## 🔐 Step 2: Authentication Setup

### 2.1 Enable Authentication
1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab

### 2.2 Configure Sign-in Providers

#### Email/Password Provider
1. Click **"Email/Password"**
2. Toggle **"Enable"** to ON
3. Leave **"Email link"** disabled for now
4. Click **"Save"**

#### Google Provider (Optional)
1. Click **"Google"**
2. Toggle **"Enable"** to ON
3. **Project support email**: Select your email
4. Click **"Save"**

### 2.3 Authorized Domains
1. Go to **"Settings"** tab in Authentication
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `maes-laboratory.vercel.app`)

## 🗄️ Step 3: Firestore Database Setup

### 3.1 Create Database
1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**

### 3.2 Security Rules
1. Choose **"Start in test mode"** for development
2. **Location**: Choose closest to your users (e.g., `asia-southeast1`)
3. Click **"Done"**

### 3.3 Create Collections

#### Users Collection
1. Click **"Start collection"**
2. **Collection ID**: `users`
3. **Document ID**: Auto-ID
4. Add fields:
   \`\`\`
   email: string
   firstName: string
   lastName: string
   role: string
   createdAt: timestamp
   \`\`\`

#### Appointments Collection
1. Create collection: `appointments`
2. Add sample document with fields:
   \`\`\`
   userId: string
   services: array
   appointmentDate: timestamp
   status: string
   amount: number
   createdAt: timestamp
   \`\`\`

#### Test Results Collection
1. Create collection: `test_results`
2. Add sample document with fields:
   \`\`\`
   userId: string
   appointmentId: string
   testType: string
   results: map
   aiAnalysis: map
   createdAt: timestamp
   \`\`\`

## 📁 Step 4: Storage Setup

### 4.1 Enable Storage
1. Click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Select same location as Firestore
5. Click **"Done"**

### 4.2 Create Folder Structure
1. Create folders:
   - `users/` - User profile images
   - `test_results/` - Test result documents
   - `medical_certificates/` - Medical certificates
   - `reports/` - Generated reports

## ⚙️ Step 5: Web App Configuration

### 5.1 Register Web App
1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click web app icon (`</>`)
4. **App nickname**: `MAES Laboratory Web`
5. **Hosting**: Leave unchecked for now
6. Click **"Register app"**

### 5.2 Get Configuration
Copy the Firebase configuration object:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};
\`\`\`

### 5.3 Environment Variables
Create `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

## 🔒 Step 6: Security Rules

### 6.1 Firestore Security Rules
1. Go to **Firestore Database** > **Rules**
2. Replace default rules with:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - users can manage their own, admins can manage all
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Test results - users can read their own, admins can manage all
    match /test_results/{resultId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Notifications - users can read their own
    match /notifications/{notificationId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin collections - admin only
    match /admin_settings/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
\`\`\`

3. Click **"Publish"**

### 6.2 Storage Security Rules
1. Go to **Storage** > **Rules**
2. Replace default rules with:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User files - users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Test results - users can read their own, admins can manage all
    match /test_results/{userId}/{allPaths=**} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Medical certificates - users can read their own, admins can manage all
    match /medical_certificates/{userId}/{allPaths=**} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Reports - admin only
    match /reports/{allPaths=**} {
      allow read, write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
\`\`\`

3. Click **"Publish"**

## 🛠️ Step 7: Firebase CLI Setup

### 7.1 Install Firebase CLI
\`\`\`bash
npm install -g firebase-tools
\`\`\`

### 7.2 Login to Firebase
\`\`\`bash
firebase login
\`\`\`

### 7.3 Initialize Firebase in Project
\`\`\`bash
cd your-project-directory
firebase init
\`\`\`

Select:
- ✅ Firestore
- ✅ Storage
- ✅ Hosting (optional)

### 7.4 Configuration Files

#### firebase.json
\`\`\`json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
\`\`\`

## 📊 Step 8: Sample Data Setup

### 8.1 Create Admin User
1. Go to **Authentication** > **Users**
2. Click **"Add user"**
3. **Email**: `mariaestrellageneralhospital@gmail.com`
4. **Password**: Create secure password
5. Click **"Add user"**

### 8.2 Add Admin User Document
1. Go to **Firestore Database**
2. Navigate to `users` collection
3. Create document with admin user's UID:
\`\`\`json
{
  "email": "mariaestrellageneralhospital@gmail.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### 8.3 Sample Patient Data
Create sample patient documents in `users` collection:
\`\`\`json
{
  "email": "patient@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient",
  "phone": "+63912345678",
  "dateOfBirth": "1990-01-01",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

## 🧪 Step 9: Testing Firebase Connection

### 9.1 Test Authentication
\`\`\`javascript
// In your app
import { auth } from './lib/firebase-config'
import { signInWithEmailAndPassword } from 'firebase/auth'

const testAuth = async () => {
  try {
    const result = await signInWithEmailAndPassword(
      auth, 
      'test@example.com', 
      'password123'
    )
    console.log('Auth successful:', result.user)
  } catch (error) {
    console.error('Auth error:', error)
  }
}
\`\`\`

### 9.2 Test Firestore
\`\`\`javascript
// In your app
import { db } from './lib/firebase-config'
import { collection, addDoc } from 'firebase/firestore'

const testFirestore = async () => {
  try {
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Hello Firebase!',
      timestamp: new Date()
    })
    console.log('Document written with ID: ', docRef.id)
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}
\`\`\`

## 🚀 Step 10: Production Deployment

### 10.1 Update Security Rules for Production
1. Change Firestore rules from test mode to production
2. Update allowed domains in Authentication settings
3. Review and tighten security rules

### 10.2 Environment Variables for Production
Add environment variables to your hosting platform:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables

### 10.3 Firebase Hosting (Optional)
\`\`\`bash
# Build your app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
\`\`\`

## 🔍 Step 11: Monitoring and Analytics

### 11.1 Enable Performance Monitoring
1. Go to **Performance** in Firebase Console
2. Click **"Get started"**
3. Add Performance SDK to your app

### 11.2 Set up Crashlytics
1. Go to **Crashlytics** in Firebase Console
2. Click **"Get started"**
3. Add Crashlytics SDK to your app

### 11.3 Analytics Dashboard
1. Go to **Analytics** > **Dashboard**
2. Monitor user engagement
3. Track conversion events

## 🆘 Troubleshooting

### Common Issues

#### 1. Permission Denied Errors
- Check Firestore security rules
- Verify user authentication
- Ensure proper user roles

#### 2. Configuration Errors
- Verify environment variables
- Check Firebase config object
- Ensure project ID matches

#### 3. Network Errors
- Check internet connection
- Verify Firebase project status
- Review CORS settings

#### 4. Authentication Issues
- Check enabled sign-in methods
- Verify authorized domains
- Review user permissions

### Getting Help

- 📚 [Firebase Documentation](https://firebase.google.com/docs)
- 💬 [Firebase Community](https://firebase.google.com/community)
- 🐛 [Firebase Support](https://firebase.google.com/support)
- 📧 Project Support: support@maes-laboratory.com

## ✅ Checklist

Before going live, ensure:

- [ ] Firebase project created and configured
- [ ] Authentication providers enabled
- [ ] Firestore database created with proper collections
- [ ] Storage bucket configured
- [ ] Security rules implemented and tested
- [ ] Environment variables set
- [ ] Admin user created
- [ ] Sample data added
- [ ] Connection tested
- [ ] Production deployment configured
- [ ] Monitoring enabled

## 🎉 Conclusion

Your Firebase setup for MAES Laboratory System is now complete! You have:

- ✅ Secure authentication system
- ✅ Scalable Firestore database
- ✅ File storage capabilities
- ✅ Proper security rules
- ✅ Admin and patient role management
- ✅ Production-ready configuration

The system is now ready for development and deployment. Happy coding! 🚀

---

**Need help?** Contact our support team at support@maes-laboratory.com or call (043) 286-2531.
\`\`\`

\`\`\`
