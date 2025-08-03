"""
Django management command to set up sample data for MAES Laboratory
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from hospital_app.models import UserProfile, LabService, Appointment, TestResult
from hospital_app.firebase_service import get_firebase_service
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Set up sample data for MAES Laboratory Management System'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🏥 Setting up MAES Laboratory sample data...'))
        
        # Create sample laboratory services
        self.create_lab_services()
        
        # Create sample users
        self.create_sample_users()
        
        # Create sample appointments
        self.create_sample_appointments()
        
        # Initialize Firebase data
        self.initialize_firebase_data()
        
        self.stdout.write(self.style.SUCCESS('✅ Sample data setup completed successfully!'))

    def create_lab_services(self):
        """Create sample laboratory services"""
        self.stdout.write('Creating laboratory services...')
        
        services = [
            {
                'name': 'Complete Blood Count (CBC)',
                'code': 'CBC',
                'description': 'Comprehensive blood analysis including white blood cells, red blood cells, hemoglobin, hematocrit, and platelets',
                'category': 'hematology',
                'price': 350.00,
                'duration_hours': 4,
                'preparation_instructions': 'No special preparation required',
                'requires_fasting': False,
                'priority_service': True,
                'ai_analysis_available': True,
            },
            {
                'name': 'Fasting Blood Sugar (FBS)',
                'code': 'FBS',
                'description': 'Blood glucose level measurement after fasting to screen for diabetes',
                'category': 'chemistry',
                'price': 150.00,
                'duration_hours': 2,
                'preparation_instructions': '8-12 hours fasting required',
                'requires_fasting': True,
                'priority_service': True,
                'ai_analysis_available': True,
            },
            {
                'name': 'Lipid Profile',
                'code': 'LIPID',
                'description': 'Cholesterol and triglyceride levels analysis for cardiovascular risk assessment',
                'category': 'chemistry',
                'price': 600.00,
                'duration_hours': 4,
                'preparation_instructions': '12 hours fasting required',
                'requires_fasting': True,
                'priority_service': True,
                'ai_analysis_available': True,
            },
            {
                'name': 'Urinalysis',
                'code': 'URINE',
                'description': 'Complete urine examination for kidney function and urinary tract infections',
                'category': 'microbiology',
                'price': 200.00,
                'duration_hours': 2,
                'preparation_instructions': 'Clean catch midstream urine sample',
                'requires_fasting': False,
                'priority_service': False,
                'ai_analysis_available': True,
            },
            {
                'name': 'Chest X-Ray',
                'code': 'CXR',
                'description': 'Chest radiographic examination for lung and heart conditions',
                'category': 'radiology',
                'price': 500.00,
                'duration_hours': 1,
                'preparation_instructions': 'Remove all metal objects and jewelry',
                'requires_fasting': False,
                'priority_service': False,
                'ai_analysis_available': False,
            },
            {
                'name': 'Electrocardiogram (ECG)',
                'code': 'ECG',
                'description': 'Heart rhythm and electrical activity examination',
                'category': 'cardiology',
                'price': 300.00,
                'duration_hours': 1,
                'preparation_instructions': 'No special preparation required',
                'requires_fasting': False,
                'priority_service': False,
                'ai_analysis_available': False,
            },
        ]
        
        for service_data in services:
            service, created = LabService.objects.get_or_create(
                code=service_data['code'],
                defaults=service_data
            )
            if created:
                self.stdout.write(f'  ✅ Created service: {service.name}')
            else:
                self.stdout.write(f'  ℹ️ Service already exists: {service.name}')

    def create_sample_users(self):
        """Create sample users"""
        self.stdout.write('Creating sample users...')
        
        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@maeslaboratory.com',
                'first_name': 'MAES',
                'last_name': 'Administrator',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('  ✅ Created admin user')
        else:
            self.stdout.write('  ℹ️ Admin user already exists')
        
        # Create admin profile
        admin_profile, created = UserProfile.objects.get_or_create(
            user=admin_user,
            defaults={
                'user_type': 'admin',
                'phone': '(043) 286-2531',
                'address': '115 Strong Republic Nautical Highway, Calapan, MIMAROPA',
            }
        )
        
        # Create sample patient users
        patients = [
            {
                'username': 'patient',
                'email': 'patient@example.com',
                'first_name': 'Juan',
                'last_name': 'Dela Cruz',
                'phone': '+63 912 345 6789',
                'address': 'Calapan City, Oriental Mindoro',
            },
        ]
        
        for patient_data in patients:
            user, created = User.objects.get_or_create(
                username=patient_data['username'],
                defaults={
                    'email': patient_data['email'],
                    'first_name': patient_data['first_name'],
                    'last_name': patient_data['last_name'],
                }
            )
            if created:
                user.set_password('patient123')
                user.save()
                self.stdout.write(f'  ✅ Created patient user: {user.username}')
            else:
                self.stdout.write(f'  ℹ️ Patient user already exists: {user.username}')
            
            # Create patient profile
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'user_type': 'patient',
                    'phone': patient_data['phone'],
                    'address': patient_data['address'],
                    'date_of_birth': datetime(1990, 1, 15).date(),
                }
            )

    def create_sample_appointments(self):
        """Create sample appointments"""
        self.stdout.write('Creating sample appointments...')
        
        patients = User.objects.filter(userprofile__user_type='patient')
        services = LabService.objects.filter(is_active=True)
        
        if not patients.exists() or not services.exists():
            self.stdout.write('  ⚠️ No patients or services found, skipping appointments')
            return
        
        # Create appointments for the next 7 days
        for i in range(3):
            appointment_date = datetime.now().date() + timedelta(days=i)
            
            # Create 1-2 appointments per day
            for j in range(random.randint(1, 2)):
                patient = random.choice(patients)
                selected_services = random.sample(list(services), random.randint(1, 2))
                
                appointment = Appointment.objects.create(
                    patient=patient,
                    appointment_date=appointment_date,
                    appointment_time=f"{random.randint(8, 16):02d}:00",
                    status=random.choice(['pending', 'confirmed']),
                    payment_method=random.choice(['cash', 'gcash']),
                    payment_status='pending',
                    notes=f'Sample appointment for {patient.get_full_name()}',
                )
                
                appointment.services.set(selected_services)
                appointment.calculate_total()
                appointment.save()
        
        self.stdout.write(f'  ✅ Created sample appointments')

    def initialize_firebase_data(self):
        """Initialize Firebase with sample data"""
        self.stdout.write('Initializing Firebase data...')
        
        firebase_service = get_firebase_service()
        if firebase_service.is_connected():
            success = firebase_service.initialize_sample_data()
            if success:
                self.stdout.write('  ✅ Firebase data initialized successfully')
            else:
                self.stdout.write('  ⚠️ Firebase data initialization failed')
        else:
            self.stdout.write('  ⚠️ Firebase not connected, skipping Firebase initialization')
