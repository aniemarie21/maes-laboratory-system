# 🚨 Quick Fix for Django Setup Error

## The Problem
You're getting a `ModuleNotFoundError: No module named 'dotenv'` error because the required packages aren't installed.

## 🔧 Quick Solution

### Step 1: Install Required Packages
Run these commands in your terminal:

\`\`\`bash
pip install python-dotenv
pip install Django==4.2.7
pip install Pillow
pip install djangorestframework
pip install django-cors-headers
pip install whitenoise
\`\`\`

### Step 2: Create Environment File
Create a `.env` file in your project root with:

\`\`\`env
SECRET_KEY=django-insecure-your-secret-key-here-change-this-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@maeslaboratory.com
\`\`\`

### Step 3: Run Django Commands
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
\`\`\`

## 🎯 Alternative: Use the Setup Script

### For Windows:
\`\`\`bash
setup_commands.bat
\`\`\`

### For Mac/Linux:
\`\`\`bash
chmod +x setup_commands.sh
./setup_commands.sh
\`\`\`

## ✅ Verification
After setup, you should be able to access:
- Homepage: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/
- Registration: http://127.0.0.1:8000/register/

## 🆘 If Still Having Issues
1. Make sure you're in the correct directory
2. Activate your virtual environment if using one
3. Check Python version: `python --version` (should be 3.8+)
4. Try installing packages one by one to identify issues
