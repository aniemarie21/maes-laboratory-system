from firebase_config import firebase_config
from datetime import datetime
import uuid

class FirebaseUserModel:
    def __init__(self):
        self.db = firebase_config.get_db()
        self.collection = 'users'
    
    def create_user(self, user_data):
        """Create a new user in Firestore"""
        try:
            user_id = str(uuid.uuid4())
            user_data['created_at'] = datetime.now()
            user_data['updated_at'] = datetime.now()
            
            doc_ref = self.db.collection(self.collection).document(user_id)
            doc_ref.set(user_data)
            
            return user_id
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    def get_user(self, user_id):
        """Get user by ID"""
        try:
            doc = self.db.collection(self.collection).document(user_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def update_user(self, user_id, user_data):
        """Update user data"""
        try:
            user_data['updated_at'] = datetime.now()
            doc_ref = self.db.collection(self.collection).document(user_id)
            doc_ref.update(user_data)
            return True
        except Exception as e:
            print(f"Error updating user: {e}")
            return False

class FirebaseAppointmentModel:
    def __init__(self):
        self.db = firebase_config.get_db()
        self.collection = 'appointments'
    
    def create_appointment(self, appointment_data):
        """Create a new appointment"""
        try:
            appointment_id = str(uuid.uuid4())
            appointment_data['appointment_id'] = appointment_id
            appointment_data['created_at'] = datetime.now()
            appointment_data['status'] = 'pending'
            
            doc_ref = self.db.collection(self.collection).document(appointment_id)
            doc_ref.set(appointment_data)
            
            return appointment_id
        except Exception as e:
            print(f"Error creating appointment: {e}")
            return None
    
    def get_appointments_by_patient(self, patient_id):
        """Get all appointments for a patient"""
        try:
            appointments = []
            docs = self.db.collection(self.collection).where('patient_id', '==', patient_id).stream()
            
            for doc in docs:
                appointment = doc.to_dict()
                appointment['id'] = doc.id
                appointments.append(appointment)
            
            return appointments
        except Exception as e:
            print(f"Error getting appointments: {e}")
            return []
    
    def update_appointment_status(self, appointment_id, status):
        """Update appointment status"""
        try:
            doc_ref = self.db.collection(self.collection).document(appointment_id)
            doc_ref.update({
                'status': status,
                'updated_at': datetime.now()
            })
            return True
        except Exception as e:
            print(f"Error updating appointment: {e}")
            return False

class FirebaseServiceModel:
    def __init__(self):
        self.db = firebase_config.get_db()
        self.collection = 'services'
    
    def create_service(self, service_data):
        """Create a new service"""
        try:
            service_id = str(uuid.uuid4())
            service_data['service_id'] = service_id
            service_data['created_at'] = datetime.now()
            service_data['is_available'] = True
            
            doc_ref = self.db.collection(self.collection).document(service_id)
            doc_ref.set(service_data)
            
            return service_id
        except Exception as e:
            print(f"Error creating service: {e}")
            return None
    
    def get_all_services(self):
        """Get all available services"""
        try:
            services = []
            docs = self.db.collection(self.collection).where('is_available', '==', True).stream()
            
            for doc in docs:
                service = doc.to_dict()
                service['id'] = doc.id
                services.append(service)
            
            return services
        except Exception as e:
            print(f"Error getting services: {e}")
            return []

class FirebaseDepartmentModel:
    def __init__(self):
        self.db = firebase_config.get_db()
        self.collection = 'departments'
    
    def create_department(self, department_data):
        """Create a new department"""
        try:
            department_id = str(uuid.uuid4())
            department_data['department_id'] = department_id
            department_data['created_at'] = datetime.now()
            department_data['is_active'] = True
            
            doc_ref = self.db.collection(self.collection).document(department_id)
            doc_ref.set(department_data)
            
            return department_id
        except Exception as e:
            print(f"Error creating department: {e}")
            return None
    
    def get_all_departments(self):
        """Get all active departments"""
        try:
            departments = []
            docs = self.db.collection(self.collection).where('is_active', '==', True).stream()
            
            for doc in docs:
                department = doc.to_dict()
                department['id'] = doc.id
                departments.append(department)
            
            return departments
        except Exception as e:
            print(f"Error getting departments: {e}")
            return []

class FirebasePaymentModel:
    def __init__(self):
        self.db = firebase_config.get_db()
        self.collection = 'payments'
    
    def create_payment(self, payment_data):
        """Create a new payment record"""
        try:
            payment_id = str(uuid.uuid4())
            payment_data['payment_id'] = payment_id
            payment_data['created_at'] = datetime.now()
            payment_data['is_verified'] = False
            
            doc_ref = self.db.collection(self.collection).document(payment_id)
            doc_ref.set(payment_data)
            
            return payment_id
        except Exception as e:
            print(f"Error creating payment: {e}")
            return None
    
    def verify_payment(self, payment_id):
        """Verify a payment"""
        try:
            doc_ref = self.db.collection(self.collection).document(payment_id)
            doc_ref.update({
                'is_verified': True,
                'verified_at': datetime.now()
            })
            return True
        except Exception as e:
            print(f"Error verifying payment: {e}")
            return False
