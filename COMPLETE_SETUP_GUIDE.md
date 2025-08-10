# MAES Laboratory Management System - Complete Setup Guide

## Prerequisites
- Python 3.8+
- VS Code
- Git
- Google Account
- Firebase Account

## Step 1: VS Code Setup

1. **Install VS Code Extensions:**
   - Python
   - Django
   - Firebase
   - GitLens
   - Prettier

2. **Open Terminal in VS Code** (Ctrl + `)

## Step 2: Project Setup

\`\`\`bash
# Clone or create project directory
mkdir maes_hospital_system
cd maes_hospital_system

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create Django project
django-admin startproject maes_lab .
cd maes_lab
python manage.py startapp hospital
\`\`\`

## Step 3: Firebase Setup

1. **Go to Firebase Console** (https://console.firebase.google.com/)
2. **Create New Project:**
   - Project name: "MAES Laboratory"
   - Enable Google Analytics (optional)
   - Choose default account

3. **Enable Authentication:**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google
   - Add your domain to authorized domains

4. **Create Firestore Database:**
   - Go to Firestore Database
   - Create database in production mode
   - Choose location (closest to your users)

5. **Generate Service Account Key:**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download JSON file
   - Rename to `firebase-service-account.json`

6. **Get Web App Config:**
   - Go to Project Settings > General
   - Add web app
   - Copy configuration object

## Step 4: Environment Configuration

Create `.env` file in project root with your Firebase credentials.

## Step 5: Run Setup Commands

\`\`\`bash
# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run development server
python manage.py runserver
\`\`\`

## Step 6: Access Points

- **Main Website:** http://127.0.0.1:8000/
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **Firebase Console:** https://console.firebase.google.com/

## Step 7: Testing

1. Register new patient account
2. Book appointment
3. Test Google login
4. Access admin dashboard
5. Test chatbot functionality

## Troubleshooting

If you encounter errors:
1. Check Firebase credentials in `.env`
2. Ensure all dependencies are installed
3. Verify Firebase project settings
4. Check console for detailed error messages
\`\`\`

```python file="requirements.txt"
Django==4.2.7
firebase-admin==6.2.0
python-dotenv==1.0.0
Pillow==10.1.0
requests==2.31.0
whitenoise==6.6.0
gunicorn==21.2.0
google-cloud-firestore==2.13.1
google-cloud-storage==2.10.0
google-auth==2.23.4
google-auth-oauthlib==1.1.0
google-auth-httplib2==0.1.1
djangorestframework==3.14.0
django-cors-headers==4.3.1
pyrebase4==4.7.1
python-firebase==1.2
social-auth-app-django==5.4.0
django-allauth==0.57.0
openpyxl==3.1.2
reportlab==4.0.7
matplotlib==3.8.2
seaborn==0.13.0
pandas==2.1.4
