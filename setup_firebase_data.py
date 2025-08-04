"""
Script to populate Firebase with initial data
Run this after setting up Firebase: python setup_firebase_data.py
"""

from firebase_config import firebase_config
from datetime import datetime

def setup_initial_data():
    """Setup initial departments and services in Firebase"""
    db = firebase_config.get_db()
    
    print("🔥 Setting up initial Firebase data...")
    
    # Departments data
    departments = [
        {
            'name': 'Laboratory',
            'description': 'Complete blood tests, urine analysis, and diagnostic testing',
            'is_active': True,
            'created_at': datetime.now()
        },
        {
            'name': 'Radiology',
            'description': 'X-ray, ultrasound, and imaging services',
            'is_active': True,
            'created_at': datetime.now()
        },
        {
            'name': 'Cardiology',
            'description': 'Heart health monitoring and ECG services',
            'is_active': True,
            'created_at': datetime.now()
        },
        {
            'name': 'General Medicine',
            'description': 'General health checkups and consultations',
            'is_active': True,
            'created_at': datetime.now()
        }
    ]
    
    # Services data
    services = [
        {
            'name': 'Complete Blood Count (CBC)',
            'department': 'Laboratory',
            'description': 'Comprehensive blood analysis including RBC, WBC, platelets',
            'price': 350.00,
            'duration_minutes': 30,
            'is_available': True,
            'created_at': datetime.now()
        },
        {
            'name': 'Urinalysis',
            'department': 'Laboratory',
            'description': 'Complete urine examination and analysis',
            'price': 200.00,
            'duration_minutes': 20,
            'is_available': True,
            'created_at': datetime.now()
        },
        {
            'name': 'Chest X-Ray',
            'department': 'Radiology',
            'description': 'Digital chest X-ray imaging',
            'price': 500.00,
            'duration_minutes': 15,
            'is_available': True,
            'created_at': datetime.now()
        },
        {
            'name': 'ECG/EKG',
            'department': 'Cardiology',
            'description': 'Electrocardiogram heart monitoring',
            'price': 400.00,
            'duration_minutes': 20,
            'is_available': True,
            'created_at': datetime.now()
        },
        {
            'name': 'Ultrasound',
            'department': 'Radiology',
            'description': 'Abdominal and pelvic ultrasound imaging',
            'price': 800.00,
            'duration_minutes': 45,
            'is_available': True,
            'created_at': datetime.now()
        }
    ]
    
    try:
        # Add departments
        print("📁 Adding departments...")
        for dept in departments:
            doc_ref = db.collection('departments').add(dept)
            print(f"✅ Added department: {dept['name']}")
        
        # Add services
        print("🔬 Adding services...")
        for service in services:
            doc_ref = db.collection('services').add(service)
            print(f"✅ Added service: {service['name']} - ₱{service['price']}")
        
        print("\n🎉 Firebase initial data setup completed successfully!")
        print("🌐 You can now run your Django server: python manage.py runserver")
        
    except Exception as e:
        print(f"❌ Error setting up data: {e}")

if __name__ == "__main__":
    setup_initial_data()
