"""
Django settings for MAES Hospital Management System.
Production-ready configuration with Firebase integration.
"""

import os
from pathlib import Path
from decouple import config
import firebase_admin
from firebase_admin import credentials

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-maes-hospital-change-in-production-2024')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = [
    '127.0.0.1', 
    'localhost', 
    '.firebaseapp.com',
    '.web.app',
    'maes-laboratory-system-9fd9c.firebaseapp.com',
    'maes-laboratory-system-9fd9c.web.app'
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'hospital_app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'maes_hospital.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'maes_hospital.wsgi.application'

# Database - Using SQLite for local development, PostgreSQL for production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Manila'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Firebase Configuration - Your actual config
FIREBASE_CONFIG = {
    "apiKey": "AIzaSyCPHBkq6m2flEawIoDfcRvuBsUX5C2QAk4",
    "authDomain": "maes-laboratory-system-9fd9c.firebaseapp.com",
    "projectId": "maes-laboratory-system-9fd9c",
    "storageBucket": "maes-laboratory-system-9fd9c.firebasestorage.app",
    "messagingSenderId": "572351102236",
    "appId": "1:572351102236:web:4a59e7478575d699bc8ed9"
}

# Initialize Firebase Admin SDK
try:
    if not firebase_admin._apps:
        # For production, use service account key
        service_account_path = BASE_DIR / 'firebase-service-account.json'
        if service_account_path.exists():
            cred = credentials.Certificate(str(service_account_path))
            firebase_admin.initialize_app(cred)
        else:
            # For development, use default credentials
            firebase_admin.initialize_app()
except Exception as e:
    print(f"Firebase initialization warning: {e}")

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "https://maes-laboratory-system-9fd9c.firebaseapp.com",
    "https://maes-laboratory-system-9fd9c.web.app",
]

CORS_ALLOW_CREDENTIALS = True

# Login/Logout URLs
LOGIN_URL = '/auth/login/'
LOGIN_REDIRECT_URL = '/dashboard/'
LOGOUT_REDIRECT_URL = '/'

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@maeslaboratory.com'

# Session Configuration
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_SAVE_EVERY_REQUEST = True

# Security Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# WhiteNoise Configuration for static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Hospital Configuration
HOSPITAL_CONFIG = {
    'name': 'Maria Estrella General Hospital',
    'short_name': 'MAES Laboratory',
    'address': '115 Strong Republic Nautical Highway, Calapan, MIMAROPA',
    'phone': '(043) 286-2531',
    'email': 'mariaestrellageneralhospital@gmail.com',
    'website': 'https://maes-laboratory-system-9fd9c.web.app',
    'operating_hours': {
        'weekdays': '6:00 AM - 8:00 PM',
        'saturday': '7:00 AM - 6:00 PM',
        'sunday': '8:00 AM - 4:00 PM',
        'emergency': '24/7',
    },
    'services': [
        {'name': 'Complete Blood Count (CBC)', 'price': 350, 'duration': '2-4 hours'},
        {'name': 'Fasting Blood Sugar (FBS)', 'price': 150, 'duration': '1-2 hours'},
        {'name': 'Lipid Profile', 'price': 600, 'duration': '2-4 hours'},
        {'name': 'Urinalysis', 'price': 200, 'duration': '1-2 hours'},
        {'name': 'Chest X-Ray', 'price': 500, 'duration': '30 minutes'},
        {'name': 'ECG', 'price': 300, 'duration': '15 minutes'},
    ]
}

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}

# Create logs directory
os.makedirs(BASE_DIR / 'logs', exist_ok=True)
