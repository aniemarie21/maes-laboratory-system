# 🚀 Complete Setup Guide - MAES Laboratory Management System

## 📋 Prerequisites

Before starting, ensure you have:
- Python 3.8+ installed
- Git installed
- A code editor (VS Code recommended)
- Internet connection for package downloads

## 🔧 Step 1: Environment Setup

### 1.1 Create Project Directory
\`\`\`bash
# Create main project directory
mkdir maes-laboratory
cd maes-laboratory

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
\`\`\`

### 1.2 Install Dependencies
\`\`\`bash
# Upgrade pip
python -m pip install --upgrade pip

# Install required packages
pip install Django==4.2.7
pip install python-dotenv==1.0.0
pip install Pillow==10.1.0
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install whitenoise==6.6.0
pip install requests==2.31.0
\`\`\`

## 🏗️ Step 2: Django Project Setup

### 2.1 Create Django Project
\`\`\`bash
# Create Django project
django-admin startproject modern_maes .

# Create Django app
python manage.py startapp hospital_app

# Create necessary directories
mkdir templates
mkdir templates/hospital_app
mkdir static
mkdir static/css
mkdir static/js
mkdir static/images
mkdir media
mkdir media/profiles
mkdir media/test_results
\`\`\`

### 2.2 Configure Settings
Create `.env` file in project root:
\`\`\`env
SECRET_KEY=your-super-secret-key-here-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.vercel.app,.herokuapp.com

# Database (SQLite for development)
DATABASE_URL=sqlite:///db.sqlite3

# Email Configuration (for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@maeslaboratory.com

# Security Settings
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True
\`\`\`

## 🗄️ Step 3: Database Setup

### 3.1 Apply Migrations
\`\`\`bash
# Create and apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Enter username: admin
# Enter email: admin@maeslaboratory.com
# Enter password: (choose a strong password)
\`\`\`

### 3.2 Load Sample Data
\`\`\`bash
# Create sample data (optional)
python manage.py shell
\`\`\`

In the Django shell, run:
```python
from django.contrib.auth.models import User
from hospital_app.models import *

# Create sample departments
dept1 = Department.objects.create(name="Laboratory", description="Blood tests and analysis")
dept2 = Department.objects.create(name="Radiology", description="X-ray and imaging services")
dept3 = Department.objects.create(name="Cardiology", description="Heart-related diagnostics")

# Create sample services
Service.objects.create(name="Complete Blood Count", department=dept1, description="Full blood analysis", price=500.00, duration_minutes=30)
Service.objects.create(name="Chest X-Ray", department=dept2, description="Chest imaging", price=800.00, duration_minutes=15)
Service.objects.create(name="ECG Test", department=dept3, description="Heart rhythm analysis", price=600.00, duration_minutes=20)

# Create sample patient
patient_user = User.objects.create_user(username='patient1', email='patient@example.com', password='patient123', first_name='John', last_name='Doe')
UserProfile.objects.create(user=patient_user, role='patient', phone_number='09123456789')

print("Sample data created successfully!")
exit()
