#!/bin/bash
echo "Setting up MAES Laboratory Management System..."
echo

echo "Step 1: Installing required packages..."
pip install Django==4.2.7
pip install python-dotenv==1.0.0
pip install Pillow==10.1.0
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install whitenoise==6.6.0
pip install requests==2.31.0

echo
echo "Step 2: Creating environment file..."
cp .env.example .env

echo
echo "Step 3: Creating migrations..."
python manage.py makemigrations

echo
echo "Step 4: Applying migrations..."
python manage.py migrate

echo
echo "Step 5: Creating directories..."
mkdir -p media/profiles
mkdir -p media/test_results
mkdir -p static/css
mkdir -p static/js
mkdir -p static/images

echo
echo "Setup complete! Now create a superuser account:"
echo "python manage.py createsuperuser"
echo
echo "Then run the server:"
echo "python manage.py runserver"
