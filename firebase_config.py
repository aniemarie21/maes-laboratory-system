import os
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from dotenv import load_dotenv
import pyrebase

# Load environment variables
load_dotenv()

class FirebaseConfig:
    def __init__(self):
        self.app = None
        self.db = None
        self.bucket = None
        self.pyrebase_app = None
        self.initialize_firebase()
    
    def initialize_firebase(self):
        """Initialize Firebase Admin SDK and Pyrebase"""
        try:
            # Firebase Admin SDK configuration
            if not firebase_admin._apps:
                firebase_config = {
                    "type": "service_account",
                    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                    "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
                    "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                    "client_id": os.getenv('FIREBASE_CLIENT_ID'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_CERT_URL')
                }
                
                # Initialize Firebase Admin
                cred = credentials.Certificate(firebase_config)
                self.app = firebase_admin.initialize_app(cred, {
                    'storageBucket': f"{os.getenv('FIREBASE_PROJECT_ID')}.appspot.com"
                })
                
                # Initialize Firestore
                self.db = firestore.client()
                
                # Initialize Storage
                self.bucket = storage.bucket()
            
            # Pyrebase configuration for client-side operations
            pyrebase_config = {
                "apiKey": os.getenv('FIREBASE_API_KEY'),
                "authDomain": f"{os.getenv('FIREBASE_PROJECT_ID')}.firebaseapp.com",
                "projectId": os.getenv('FIREBASE_PROJECT_ID'),
                "storageBucket": f"{os.getenv('FIREBASE_PROJECT_ID')}.appspot.com",
                "messagingSenderId": os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
                "appId": os.getenv('FIREBASE_APP_ID'),
                "databaseURL": f"https://{os.getenv('FIREBASE_PROJECT_ID')}-default-rtdb.firebaseio.com/"
            }
            
            self.pyrebase_app = pyrebase.initialize_app(pyrebase_config)
            
            print("✅ Firebase initialized successfully!")
            
        except Exception as e:
            print(f"❌ Firebase initialization error: {e}")
            # Don't raise error to allow Django to start without Firebase
    
    def get_db(self):
        """Get Firestore database instance"""
        return self.db
    
    def get_storage(self):
        """Get Firebase Storage bucket"""
        return self.bucket
    
    def get_pyrebase_auth(self):
        """Get Pyrebase auth instance for client operations"""
        if self.pyrebase_app:
            return self.pyrebase_app.auth()
        return None
    
    def create_user(self, email, password, display_name=None):
        """Create a new user in Firebase Auth"""
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=display_name
            )
            return user
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    def get_user(self, uid):
        """Get user by UID"""
        try:
            user = auth.get_user(uid)
            return user
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def verify_id_token(self, id_token):
        """Verify Firebase ID token"""
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            print(f"Error verifying token: {e}")
            return None

# Initialize Firebase configuration
firebase_config = FirebaseConfig()
