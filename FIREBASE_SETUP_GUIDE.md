# 🔥 Firebase Database Setup Guide - Step by Step

## 📋 Prerequisites
- Google Account
- Internet connection
- VS Code installed

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
- Open your browser and go to: https://console.firebase.google.com/
- Click "Create a project"

### 1.2 Project Setup
1. **Project Name**: Enter "maes-laboratory-system"
2. **Project ID**: Will be auto-generated (note this down)
3. Click "Continue"

### 1.3 Google Analytics (Optional)
- You can disable Google Analytics for now
- Click "Create project"
- Wait for project creation (30-60 seconds)
- Click "Continue"

## 🚀 Step 2: Setup Firestore Database

### 2.1 Create Firestore Database
1. In Firebase Console, click "Firestore Database" in left sidebar
2. Click "Create database"
3. **Security Rules**: Choose "Start in test mode" (we'll secure it later)
4. **Location**: Choose "asia-southeast1 (Singapore)" for better performance
5. Click "Done"

### 2.2 Create Collections
Create these collections in Firestore:

1. **users** - Store user profiles
2. **appointments** - Store appointment data
3. **services** - Store available services
4. **departments** - Store hospital departments
5. **payments** - Store payment records
6. **test_results** - Store lab results

## 🚀 Step 3: Setup Authentication

### 3.1 Enable Authentication
1. Click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab

### 3.2 Enable Sign-in Methods
1. Click "Email/Password"
2. Enable "Email/Password"
3. Click "Save"

## 🚀 Step 4: Generate Service Account Key

### 4.1 Go to Project Settings
1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"

### 4.2 Service Accounts Tab
1. Click "Service accounts" tab
2. Click "Generate new private key"
3. Click "Generate key"
4. **IMPORTANT**: Save the JSON file securely (don't share it!)

### 4.3 Note Down Your Credentials
From the downloaded JSON file, you'll need:
- `project_id`
- `private_key_id`
- `private_key`
- `client_email`
- `client_id`

## 🚀 Step 5: Setup Firebase Storage (Optional)

### 5.1 Enable Storage
1. Click "Storage" in left sidebar
2. Click "Get started"
3. Choose "Start in test mode"
4. Choose same location as Firestore
5. Click "Done"

## 🚀 Step 6: Configure Security Rules

### 6.1 Firestore Security Rules
Go to Firestore → Rules and replace with:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - users can manage their own
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Services and departments - read only for authenticated users
    match /services/{serviceId} {
      allow read: if request.auth != null;
    }
    
    match /departments/{departmentId} {
      allow read: if request.auth != null;
    }
    
    // Admin only collections
    match /payments/{paymentId} {
      allow read, write: if request.auth != null;
    }
    
    match /test_results/{resultId} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

### 6.2 Storage Security Rules
Go to Storage → Rules and replace with:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 🚀 Step 7: Update Your .env File

Replace your `.env` file with your Firebase credentials:
