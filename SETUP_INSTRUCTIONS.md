# 🏥 MAES Laboratory Management System - Complete Setup Guide

## 📋 Prerequisites
- Python 3.8+ installed
- VS Code installed
- Git installed
- Internet connection

## 🚀 Step-by-Step Setup

### Step 1: Create Project Directory
\`\`\`bash
mkdir maes-laboratory
cd maes-laboratory
\`\`\`

### Step 2: Create Virtual Environment
\`\`\`bash
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
\`\`\`

### Step 3: Install All Required Packages
\`\`\`bash
pip install Django==4.2.7
pip install firebase-admin==6.2.0
pip install python-dotenv==1.0.0
pip install Pillow==10.1.0
pip install requests==2.31.0
pip install whitenoise==6.6.0
\`\`\`

### Step 4: Create Django Project
\`\`\`bash
django-admin startproject maes_lab .
python manage.py startapp hospital
\`\`\`

### Step 5: Create Required Directories
\`\`\`bash
mkdir templates
mkdir static
mkdir static/css
mkdir static/js
mkdir static/images
mkdir media
mkdir media/uploads
\`\`\`

### Step 6: Setup Environment Variables
Create `.env` file in root directory with Firebase credentials

### Step 7: Configure Django Settings
Update settings.py with Firebase and static files configuration

### Step 8: Create Database
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
\`\`\`

### Step 9: Run Development Server
\`\`\`bash
python manage.py runserver
\`\`\`

### Step 10: VS Code Extensions (Install these)
- Python
- Django
- HTML CSS Support
- Auto Rename Tag
- Prettier
- GitLens
\`\`\`

```python file="requirements.txt"
Django==4.2.7
firebase-admin==6.2.0
python-dotenv==1.0.0
Pillow==10.1.0
requests==2.31.0
whitenoise==6.6.0
gunicorn==21.2.0
