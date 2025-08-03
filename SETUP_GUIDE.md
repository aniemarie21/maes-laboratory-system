# MAES Laboratory Management System - Complete Setup Guide

## 🏥 About MAES Laboratory

Maria Estrella General Hospital Laboratory Management System is a comprehensive, AI-powered healthcare platform designed to streamline laboratory operations, patient management, and diagnostic services.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or later)
- **npm** or **yarn** package manager
- **Git** for version control
- **VS Code** (recommended) with extensions

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/maes-laboratory-system.git
   cd maes-laboratory-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Optional: Analytics
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `maes-laboratory-system`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password**
   - **Google** (optional)

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location
5. Click **Done**

### 4. Set up Storage

1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select the same location as Firestore
5. Click **Done**

### 5. Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register your app with name: `MAES Laboratory`
5. Copy the configuration object
6. Add the values to your `.env.local` file

## 💻 VS Code Setup

### Recommended Extensions

Install these VS Code extensions for the best development experience:

\`\`\`json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint",
    "firebase.vscode-firebase-explorer",
    "ms-vscode.vscode-react-native"
  ]
}
\`\`\`

### VS Code Settings

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

## 🗄️ Database Schema

### Collections Structure

\`\`\`
users/
├── {userId}/
    ├── email: string
    ├── firstName: string
    ├── lastName: string
    ├── role: "patient" | "admin"
    ├── createdAt: timestamp
    └── updatedAt: timestamp

appointments/
├── {appointmentId}/
    ├── userId: string
    ├── services: string[]
    ├── appointmentDate: timestamp
    ├── status: "pending" | "approved" | "completed"
    ├── amount: number
    └── createdAt: timestamp

test_results/
├── {resultId}/
    ├── userId: string
    ├── appointmentId: string
    ├── testType: string
    ├── results: object
    ├── aiAnalysis: object
    └── createdAt: timestamp

notifications/
├── {notificationId}/
    ├── userId: string
    ├── title: string
    ├── message: string
    ├── type: "info" | "success" | "warning" | "error"
    ├── read: boolean
    └── createdAt: timestamp
\`\`\`

## 🔐 Security Rules

### Firestore Rules

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
    
    // Test results - users can read their own, admins can read/write all
    match /test_results/{resultId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.admin == true);
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
\`\`\`

### Storage Rules

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User files - users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Test results - users can read their own, admins can read/write all
    match /test_results/{userId}/{allPaths=**} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.admin == true);
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
\`\`\`

## 🧪 Testing

### Run Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### Test Structure

\`\`\`
__tests__/
├── components/
├── pages/
├── utils/
└── setup.js
\`\`\`

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Environment Variables in Production

Add these environment variables in Vercel dashboard:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📱 Features

### Patient Portal
- ✅ User registration and authentication
- ✅ Appointment booking system
- ✅ Test result viewing with AI analysis
- ✅ Medical certificate requests
- ✅ Payment management
- ✅ Real-time notifications
- ✅ AI-powered chatbot support

### Admin Portal
- ✅ Patient management
- ✅ Appointment approval system
- ✅ Test result management
- ✅ Payment tracking
- ✅ Analytics dashboard
- ✅ User management
- ✅ System notifications

### AI Features
- ✅ Intelligent test result analysis
- ✅ Predictive health insights
- ✅ Automated report generation
- ✅ Smart appointment scheduling
- ✅ Chatbot with medical knowledge

## 🔧 Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Check your environment variables
   - Ensure Firebase project is properly configured
   - Verify API keys are correct

2. **Build errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Next.js cache: `rm -rf .next`
   - Check TypeScript errors: `npm run type-check`

3. **Authentication issues**
   - Verify Firebase Auth is enabled
   - Check security rules
   - Ensure proper user roles are set

### Getting Help

- 📧 Email: support@maes-laboratory.com
- 📞 Phone: (043) 286-2531
- 🌐 Website: https://maes-laboratory.vercel.app
- 📚 Documentation: https://docs.maes-laboratory.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- Maria Estrella General Hospital
- Next.js team for the amazing framework
- Firebase team for the backend services
- Tailwind CSS for the styling system
- shadcn/ui for the component library

---

**MAES Laboratory Management System** - Revolutionizing healthcare through technology 🏥✨
\`\`\`

\`\`\`
