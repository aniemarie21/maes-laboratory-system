# MEGH Laboratory Management System - Complete Setup Guide

## 🚀 Quick Start Overview

This guide will help you set up the Maria Estrella General Hospital Laboratory Management System on your local machine using VS Code, Firebase, and Next.js.

## 📋 Prerequisites

Before starting, ensure you have:
- A computer with Windows, macOS, or Linux
- Internet connection
- Google account (for Firebase)
- Basic familiarity with using a terminal/command prompt

## 🛠️ Step 1: Install Required Software

### 1.1 Install Node.js
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation by opening terminal/command prompt and typing:
   \`\`\`bash
   node --version
   npm --version
   \`\`\`

### 1.2 Install Git
1. Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download for your operating system
3. Install with default settings
4. Verify installation:
   \`\`\`bash
   git --version
   \`\`\`

### 1.3 Install VS Code
1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download and install VS Code
3. Launch VS Code after installation

## 🔧 Step 2: VS Code Extensions Setup

Install these essential extensions in VS Code:

### Required Extensions:
1. **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
2. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
3. **TypeScript Importer** - `pmneo.tsimporter`
4. **Auto Rename Tag** - `formulahendry.auto-rename-tag`
5. **Bracket Pair Colorizer** - `coenraads.bracket-pair-colorizer`
6. **GitLens** - `eamodio.gitlens`
7. **Prettier - Code formatter** - `esbenp.prettier-vscode`
8. **ESLint** - `dbaeumer.vscode-eslint`

### Firebase Extensions:
9. **Firebase** - `toba.vsfire`
10. **Firebase Explorer** - `jsayol.firebase-explorer`

### How to Install Extensions:
1. Open VS Code
2. Click the Extensions icon (⬜) in the sidebar or press `Ctrl+Shift+X`
3. Search for each extension by name
4. Click "Install" for each one

## 🔥 Step 3: Firebase Setup

### 3.1 Create Firebase Project
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Click "Create a project"
4. Enter project name: `megh-laboratory-system`
5. Enable Google Analytics (recommended)
6. Click "Create project"

### 3.2 Enable Authentication
1. In your Firebase console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable these providers:
   - **Email/Password**: Click → Enable → Save
   - **Google**: Click → Enable → Add your email as authorized domain → Save

### 3.3 Create Firestore Database
1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location (closest to you)
5. Click "Done"

### 3.4 Set Up Storage
1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Keep default security rules for now
4. Choose same location as Firestore
5. Click "Done"

### 3.5 Get Firebase Configuration
1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>`
5. Enter app nickname: `megh-lab-web`
6. Check "Also set up Firebase Hosting"
7. Click "Register app"
8. **IMPORTANT**: Copy the Firebase configuration object - you'll need this later!

Example configuration (yours will be different):
\`\`\`javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
\`\`\`

## 💻 Step 4: Project Setup

### 4.1 Create Project Directory
1. Open VS Code
2. Open terminal in VS Code: `View → Terminal` or `Ctrl+\``
3. Navigate to where you want to create the project:
   \`\`\`bash
   cd Desktop  # or wherever you prefer
   \`\`\`

### 4.2 Create Next.js Project
\`\`\`bash
npx create-next-app@latest megh-laboratory-system --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
\`\`\`

### 4.3 Navigate to Project
\`\`\`bash
cd megh-laboratory-system
\`\`\`

### 4.4 Install Additional Dependencies
\`\`\`bash
npm install firebase
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install recharts
npm install date-fns
npm install react-hook-form @hookform/resolvers zod
\`\`\`

### 4.5 Install shadcn/ui
\`\`\`bash
npx shadcn@latest init
\`\`\`

When prompted, choose:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 4.6 Add shadcn/ui Components
\`\`\`bash
npx shadcn@latest add button card input label textarea select checkbox radio-group badge alert accordion tabs toast tooltip progress separator
\`\`\`

## 🔧 Step 5: Configure Firebase in Your Project

### 5.1 Create Firebase Configuration File
1. In VS Code, create a new file: `lib/firebase-config.ts`
2. Add your Firebase configuration:

\`\`\`typescript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  // Replace with your actual Firebase config
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
\`\`\`

### 5.2 Create Environment Variables
1. Create a file named `.env.local` in your project root
2. Add your Firebase configuration as environment variables:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
\`\`\`

### 5.3 Update Firebase Config to Use Environment Variables
Update `lib/firebase-config.ts`:

\`\`\`typescript
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

export default app
\`\`\`

## 📁 Step 6: Add Project Files

### 6.1 Create Required Directories
In VS Code terminal, create the following directories:
\`\`\`bash
mkdir -p app/admin/dashboard app/patient/dashboard app/auth/login app/auth/register
mkdir -p components/ui
mkdir -p public/images
\`\`\`

### 6.2 Add Images
1. Create a folder `public/images` in your project
2. Add the hospital logo as `maes-logo.avif`
3. Add the hospital building image as `hospital-building.jpg`

You can use placeholder images for now or download appropriate images.

## 🎨 Step 7: Configure Tailwind CSS

Update `tailwind.config.ts`:

\`\`\`typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
\`\`\`

## 🚀 Step 8: Run the Development Server

### 8.1 Start the Development Server
\`\`\`bash
npm run dev
\`\`\`

### 8.2 Open in Browser
1. Open your web browser
2. Go to `http://localhost:3000`
3. You should see your application running!

## 🔐 Step 9: Set Up Authentication Rules

### 9.1 Configure Firestore Security Rules
1. Go to Firebase Console → Firestore Database → Rules
2. Replace the default rules with:

\`\`\`javascript
rules_version = '2';
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
}
\`\`\`

### 9.2 Configure Storage Security Rules
1. Go to Firebase Console → Storage → Rules
2. Replace with:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /admin/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
\`\`\`

## 📊 Step 10: Set Up Initial Data

### 10.1 Create Sample Data in Firestore
1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Create these collections with sample documents:

**Collection: `services`**
\`\`\`json
{
  "id": "cbc",
  "name": "Complete Blood Count",
  "category": "Hematology",
  "price": 450,
  "description": "Basic blood test to check overall health",
  "duration": "15 mins"
}
\`\`\`

**Collection: `settings`**
\`\`\`json
{
  "id": "payment",
  "gcashNumber": "09123456789",
  "bankAccount": "1234567890",
  "bankName": "BDO Unibank"
}
\`\`\`

## 🔧 Step 11: VS Code Configuration

### 11.1 Create VS Code Settings
Create `.vscode/settings.json`:

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
\`\`\`

### 11.2 Create Prettier Configuration
Create `.prettierrc`:

\`\`\`json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false
}
\`\`\`

## 🚀 Step 12: Deploy to Firebase Hosting

### 12.1 Install Firebase CLI
\`\`\`bash
npm install -g firebase-tools
\`\`\`

### 12.2 Login to Firebase
\`\`\`bash
firebase login
\`\`\`

### 12.3 Initialize Firebase Hosting
\`\`\`bash
firebase init hosting
\`\`\`

Choose:
- Use existing project
- Select your project
- Public directory: `out`
- Single-page app: Yes
- Overwrite index.html: No

### 12.4 Update package.json
Add these scripts to `package.json`:

\`\`\`json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "deploy": "npm run build && npm run export && firebase deploy"
  }
}
\`\`\`

### 12.5 Deploy
\`\`\`bash
npm run deploy
\`\`\`

## 🎯 Step 13: Testing Your Application

### 13.1 Test Patient Portal
1. Go to `http://localhost:3000`
2. Click "Patient Portal"
3. Register a new account or login
4. Test booking an appointment
5. Test viewing dashboard

### 13.2 Test Admin Portal
1. Go to `http://localhost:3000`
2. Click "Admin Portal"
3. Login with admin credentials
4. Test dashboard functionality
5. Test approving appointments

### 13.3 Test Firebase Integration
1. Check if data is being saved to Firestore
2. Test file uploads to Storage
3. Verify authentication is working

## 🔍 Troubleshooting

### Common Issues:

**1. Firebase Configuration Error**
- Double-check your Firebase config in `.env.local`
- Ensure all environment variables are prefixed with `NEXT_PUBLIC_`

**2. Module Not Found Errors**
- Run `npm install` to ensure all dependencies are installed
- Check import paths are correct

**3. Build Errors**
- Check TypeScript errors in VS Code
- Ensure all required props are passed to components

**4. Authentication Issues**
- Verify Firebase Authentication is enabled
- Check security rules in Firebase Console

**5. Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check if shadcn/ui components are installed

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🎉 Congratulations!

You have successfully set up the MEGH Laboratory Management System! Your application should now be running with:

✅ Complete patient and admin portals
✅ Firebase authentication and database
✅ Responsive design with Tailwind CSS
✅ Modern UI components with shadcn/ui
✅ Real-time notifications
✅ Secure payment processing
✅ File upload capabilities
✅ Comprehensive dashboard analytics

## 🔄 Next Steps

1. Customize the branding and colors to match your needs
2. Add more laboratory services and tests
3. Configure email notifications
4. Set up automated backups
5. Add more advanced features as needed

## 💡 Tips for Success

- Always test changes in development before deploying
- Keep your Firebase security rules updated
- Regularly backup your data
- Monitor your Firebase usage to stay within limits
- Use VS Code extensions to improve productivity

## 🆘 Getting Help

If you encounter any issues:
1. Check the browser console for errors
2. Review the Firebase Console for any issues
3. Ensure all dependencies are properly installed
4. Verify your environment variables are correct

Happy coding! 🚀
\`\`\`
