"""
Firebase service for MAES Hospital Management System
Handles all Firebase Firestore operations using your configuration
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth
from django.conf import settings
import json
import os
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class FirebaseService:
    """Firebase service class for MAES Hospital management"""
    
    def __init__(self):
        self.db = None
        self.initialize_firebase()
    
    def initialize_firebase(self):
        """Initialize Firebase connection with your config"""
        try:
            if not firebase_admin._apps:
                # Try to use service account file first
                service_account_path = os.path.join(settings.BASE_DIR, 'firebase-service-account.json')
                
                if os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred)
                    logger.info("Firebase initialized with service account")
                else:
                    # Use default credentials or environment variables
                    firebase_admin.initialize_app()
                    logger.info("Firebase initialized with default credentials")
            
            self.db = firestore.client()
            logger.info("Firebase Firestore client initialized successfully")
            
        except Exception as e:
            logger.error(f"Firebase initialization failed: {str(e)}")
            # Don't raise exception to allow Django to start without Firebase
            self.db = None
    
    def is_connected(self):
        """Check if Firebase is properly connected"""
        return self.db is not None
    
    def create_user_profile(self, user_data):
        """Create user profile in Firestore"""
        if not self.is_connected():
            return None
            
        try:
            doc_ref = self.db.collection('users').document(str(user_data['user_id']))
            doc_ref.set({
                **user_data,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'hospital': 'MAES Laboratory'
            })
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error creating user profile: {str(e)}")
            return None
    
    def create_appointment(self, appointment_data):
        """Create appointment in Firestore"""
        if not self.is_connected():
            return None
            
        try:
            doc_ref = self.db.collection('appointments').document()
            doc_ref.set({
                **appointment_data,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'hospital': 'MAES Laboratory',
                'status': 'pending'
            })
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error creating appointment: {str(e)}")
            return None
    
    def update_appointment_status(self, doc_id, status, notes=""):
        """Update appointment status in Firestore"""
        if not self.is_connected():
            return False
            
        try:
            doc_ref = self.db.collection('appointments').document(doc_id)
            update_data = {
                'status': status,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            if notes:
                update_data['admin_notes'] = notes
            
            doc_ref.update(update_data)
            return True
        except Exception as e:
            logger.error(f"Error updating appointment status: {str(e)}")
            return False
    
    def create_payment_transaction(self, payment_data):
        """Create payment transaction in Firestore"""
        if not self.is_connected():
            return None
            
        try:
            doc_ref = self.db.collection('payments').document()
            doc_ref.set({
                **payment_data,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'hospital': 'MAES Laboratory'
            })
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error creating payment transaction: {str(e)}")
            return None
    
    def create_test_result(self, result_data):
        """Create test result in Firestore"""
        if not self.is_connected():
            return None
            
        try:
            doc_ref = self.db.collection('test_results').document()
            doc_ref.set({
                **result_data,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'hospital': 'MAES Laboratory',
                'patient_notified': False
            })
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error creating test result: {str(e)}")
            return None
    
    def save_chat_message(self, message_data):
        """Save chat message to Firestore"""
        if not self.is_connected():
            return None
            
        try:
            doc_ref = self.db.collection('chat_messages').document()
            doc_ref.set({
                **message_data,
                'timestamp': firestore.SERVER_TIMESTAMP,
                'hospital': 'MAES Laboratory'
            })
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error saving chat message: {str(e)}")
            return None
    
    def get_dashboard_analytics(self):
        """Get analytics data for admin dashboard"""
        if not self.is_connected():
            return {}
            
        try:
            # Get today's appointments
            today = datetime.now().date()
            appointments_ref = self.db.collection('appointments')
            today_appointments = appointments_ref.where('appointment_date', '==', today.isoformat()).stream()
            
            # Get pending payments
            payments_ref = self.db.collection('payments')
            pending_payments = payments_ref.where('status', '==', 'pending').stream()
            
            analytics = {
                'today_appointments': len(list(today_appointments)),
                'pending_payments': len(list(pending_payments)),
                'last_updated': datetime.now().isoformat(),
                'hospital': 'MAES Laboratory'
            }
            
            return analytics
        except Exception as e:
            logger.error(f"Error getting dashboard analytics: {str(e)}")
            return {}
    
    def get_payment_settings(self):
        """Get payment settings from Firestore"""
        if not self.is_connected():
            return self._get_default_payment_settings()
            
        try:
            doc_ref = self.db.collection('settings').document('payment_settings')
            doc = doc_ref.get()
            
            if doc.exists:
                return doc.to_dict()
            else:
                # Create default settings
                default_settings = self._get_default_payment_settings()
                doc_ref.set(default_settings)
                return default_settings
        except Exception as e:
            logger.error(f"Error getting payment settings: {str(e)}")
            return self._get_default_payment_settings()
    
    def _get_default_payment_settings(self):
        """Get default payment settings for MAES Laboratory"""
        return {
            'gcash_number': '09123456789',
            'gcash_name': 'MAES Laboratory',
            'paymaya_number': '09987654321',
            'paymaya_name': 'MAES Laboratory',
            'bank_accounts': [
                {
                    'bank': 'BPI',
                    'account_number': '1234567890123',
                    'account_name': 'Maria Estrella General Hospital'
                },
                {
                    'bank': 'BDO',
                    'account_number': '9876543210987',
                    'account_name': 'Maria Estrella General Hospital'
                }
            ],
            'payment_instructions': 'Please send payment screenshot for verification.',
            'auto_verify_payments': False,
            'hospital': 'MAES Laboratory',
            'updated_at': datetime.now().isoformat()
        }
    
    def send_notification(self, user_id, notification_data):
        """Send notification to user"""
        if not self.is_connected():
            return None
            
        try:
            doc_ref = self.db.collection('notifications').document()
            doc_ref.set({
                'user_id': user_id,
                'title': notification_data.get('title', ''),
                'message': notification_data.get('message', ''),
                'type': notification_data.get('type', 'info'),
                'read': False,
                'hospital': 'MAES Laboratory',
                'created_at': firestore.SERVER_TIMESTAMP
            })
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error sending notification: {str(e)}")
            return None
    
    def initialize_sample_data(self):
        """Initialize sample data for MAES Laboratory"""
        if not self.is_connected():
            logger.warning("Firebase not connected, skipping sample data initialization")
            return False
            
        try:
            # Sample laboratory services
            services = [
                {
                    'name': 'Complete Blood Count (CBC)',
                    'code': 'CBC',
                    'price': 350,
                    'category': 'Hematology',
                    'duration': '2-4 hours',
                    'description': 'Complete blood analysis including WBC, RBC, hemoglobin, hematocrit, and platelets'
                },
                {
                    'name': 'Fasting Blood Sugar (FBS)',
                    'code': 'FBS',
                    'price': 150,
                    'category': 'Chemistry',
                    'duration': '1-2 hours',
                    'description': 'Blood glucose level measurement after fasting'
                },
                {
                    'name': 'Lipid Profile',
                    'code': 'LIPID',
                    'price': 600,
                    'category': 'Chemistry',
                    'duration': '2-4 hours',
                    'description': 'Cholesterol and triglyceride levels analysis'
                },
                {
                    'name': 'Urinalysis',
                    'code': 'URINE',
                    'price': 200,
                    'category': 'Clinical Microscopy',
                    'duration': '1-2 hours',
                    'description': 'Complete urine examination'
                },
                {
                    'name': 'Chest X-Ray',
                    'code': 'CXR',
                    'price': 500,
                    'category': 'Radiology',
                    'duration': '30 minutes',
                    'description': 'Chest radiographic examination'
                },
                {
                    'name': 'ECG',
                    'code': 'ECG',
                    'price': 300,
                    'category': 'Cardiology',
                    'duration': '15 minutes',
                    'description': 'Electrocardiogram examination'
                }
            ]
            
            # Add services to Firestore
            services_ref = self.db.collection('laboratory_services')
            for service in services:
                doc_ref = services_ref.document(service['code'])
                doc_ref.set({
                    **service,
                    'hospital': 'MAES Laboratory',
                    'is_active': True,
                    'created_at': firestore.SERVER_TIMESTAMP
                })
            
            # Initialize system settings
            settings_ref = self.db.collection('settings').document('hospital_info')
            settings_ref.set({
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
                    'emergency': '24/7'
                },
                'created_at': firestore.SERVER_TIMESTAMP
            })
            
            logger.info("Sample data initialized successfully in Firebase")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing sample data: {str(e)}")
            return False

# Singleton instance
_firebase_service = None

def get_firebase_service():
    """Get Firebase service singleton instance"""
    global _firebase_service
    if _firebase_service is None:
        _firebase_service = FirebaseService()
    return _firebase_service
