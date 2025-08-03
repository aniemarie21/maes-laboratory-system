# 🏥 MAES Laboratory Management System
## Complete Django + Firebase Setup Guide

### 📋 **STEP 1: Prerequisites**

Make sure you have:
- **Python 3.8+** installed
- **pip** package manager
- **Git** (optional)
- **Firebase account** (you already have this)

### 📋 **STEP 2: Project Setup**

\`\`\`bash
# Create project directory
mkdir maes-hospital-system
cd maes-hospital-system

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
\`\`\`

### 📋 **STEP 3: Firebase Service Account Setup**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `maes-laboratory-system-9fd9c`
3. **Go to Project Settings** → **Service Accounts**
4. **Click "Generate new private key"**
5. **Save the file as**: `firebase-service-account.json` in your project root
6. **Keep this file secure** (never commit to Git)

### 📋 **STEP 4: Environment Configuration**

Create `.env` file in project root:

\`\`\`env
SECRET_KEY=django-insecure-maes-hospital-change-in-production-2024
DEBUG=True
FIREBASE_PROJECT_ID=maes-laboratory-system-9fd9c
\`\`\`

### 📋 **STEP 5: Database Setup**

\`\`\`bash
# Create database tables
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser
# Username: admin
# Email: admin@maeslaboratory.com
# Password: admin123
\`\`\`

### 📋 **STEP 6: Load Sample Data**

\`\`\`bash
# Create sample laboratory services
python manage.py shell

# In the Python shell, run:
from hospital_app.models import LabService
from hospital_app.firebase_service import get_firebase_service

# Create sample services
services = [
    {'name': 'Complete Blood Count (CBC)', 'code': 'CBC', 'price': 350, 'category': 'hematology', 'duration_hours': 4},
    {'name': 'Fasting Blood Sugar (FBS)', 'code': 'FBS', 'price': 150, 'category': 'chemistry', 'duration_hours': 2},
    {'name': 'Lipid Profile', 'code': 'LIPID', 'price': 600, 'category': 'chemistry', 'duration_hours': 4},
    {'name': 'Urinalysis', 'code': 'URINE', 'price': 200, 'category': 'microbiology', 'duration_hours': 2},
    {'name': 'Chest X-Ray', 'code': 'CXR', 'price': 500, 'category': 'radiology', 'duration_hours': 1},
    {'name': 'ECG', 'code': 'ECG', 'price': 300, 'category': 'cardiology', 'duration_hours': 1},
]

for service_data in services:
    LabService.objects.get_or_create(
        code=service_data['code'],
        defaults={
            'name': service_data['name'],
            'price': service_data['price'],
            'category': service_data['category'],
            'duration_hours': service_data['duration_hours'],
            'description': f"{service_data['name']} - Professional laboratory service",
            'preparation_instructions': 'Follow standard preparation guidelines',
            'is_active': True,
            'priority_service': service_data['code'] in ['CBC', 'FBS', 'LIPID']
        }
    )

# Initialize Firebase sample data
firebase_service = get_firebase_service()
firebase_service.initialize_sample_data()

exit()
\`\`\`

### 📋 **STEP 7: Start the Development Server**

\`\`\`bash
python manage.py runserver
\`\`\`

**Expected Output:**
\`\`\`
System check identified no issues (0 silenced).
December 08, 2024 - 15:30:45
Django version 4.2.7, using settings 'maes_hospital.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
\`\`\`

### 📋 **STEP 8: Access Your System**

Open your browser and go to:

1. **Homepage**: `http://127.0.0.1:8000/`
2. **Admin Panel**: `http://127.0.0.1:8000/admin/`
3. **Patient Login**: `http://127.0.0.1:8000/auth/login/`
4. **Register**: `http://127.0.0.1:8000/auth/register/`

### 🎯 **WHAT YOU'LL SEE WORKING**

#### ✅ **Homepage Features**
- **Modern Bootstrap design** with MAES branding
- **Laboratory services** with real pricing (CBC ₱350, FBS ₱150, etc.)
- **Contact information** exactly as specified
- **Operating hours** display
- **Statistics section** (patients served, services available)
- **Responsive design** for mobile and desktop

#### ✅ **Authentication System**
- **Patient/Admin login** toggle
- **Registration form** with validation
- **User profiles** with Firebase sync
- **Session management**

#### ✅ **Appointment Booking**
- **Multi-step booking** process
- **Service selection** by category
- **Date/time picker**
- **Payment method** selection
- **Real-time price** calculation
- **Firebase integration** for real-time sync

#### ✅ **Admin Dashboard**
- **Analytics overview**
- **Appointment management**
- **Payment tracking**
- **User management**
- **Firebase data** synchronization

#### ✅ **Chatbot System**
- **Interactive chatbot** with MAES-specific responses
- **Service information**
- **Appointment help**
- **Contact details**
- **Operating hours**

### 🔧 **Firebase Integration Features**

- ✅ **Real-time data sync** between Django and Firebase
- ✅ **User profiles** stored in both systems
- ✅ **Appointments** synced to Firestore
- ✅ **Payment transactions** tracked
- ✅ **Chat messages** stored in Firebase
- ✅ **Analytics data** from Firebase

### 📱 **Mobile Responsive**

The system is fully responsive and works on:
- ✅ **Mobile phones** (320px+)
- ✅ **Tablets** (768px+)
- ✅ **Desktops** (1024px+)

### 🎨 **Professional Design**

- **Bootstrap 5** for modern UI
- **Font Awesome** icons
- **Google Fonts** (Inter + Poppins)
- **Gradient backgrounds**
- **Card-based layout**
- **Smooth animations**

### 📞 **Your Contact Information**

All preserved exactly as requested:
- **Phone**: (043) 286-2531
- **Email**: mariaestrellageneralhospital@gmail.com
- **Address**: 115 Strong Republic Nautical Highway, Calapan, MIMAROPA
- **Hospital**: Maria Estrella General Hospital

### 🚀 **Deployment to Firebase Hosting**

\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build static files
python manage.py collectstatic

# Deploy to Firebase
firebase deploy
\`\`\`

Your site will be available at:
`https://maes-laboratory-system-9fd9c.web.app`

### 🔒 **Security Features**

- ✅ **CSRF protection**
- ✅ **User authentication**
- ✅ **Session management**
- ✅ **Input validation**
- ✅ **Firebase security rules**

### 📊 **Database Structure**

The system includes these models:
- **UserProfile** - Extended user information
- **LabService** - Laboratory services and pricing
- **Appointment** - Patient appointments
- **TestResult** - Laboratory test results
- **PaymentTransaction** - Payment tracking
- **ChatSession** - Support chat sessions

### 🎉 **SUCCESS VERIFICATION**

- [ ] Django server starts without errors
- [ ] Homepage loads with MAES branding
- [ ] Login/Register pages work
- [ ] Admin panel accessible
- [ ] Appointment booking functional
- [ ] Firebase connection established
- [ ] Chatbot responds correctly
- [ ] Mobile responsive design works

**Your Django + Firebase MAES Laboratory system is now fully functional! 🏥✨**
\`\`\`

```python file="hospital_app/management/__init__.py"
# Management commands package
