import os
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class FirebaseConfig:
    def __init__(self):
        self.app = None
        self.db = None
        self.bucket = None
        self.initialize_firebase()
    
    def initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        if not firebase_admin._apps:
            try:
                # Firebase configuration from environment variables
                firebase_config = {
                    "type": os.getenv('FIREBASE_TYPE'),
                    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                    "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
                    "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                    "client_id": os.getenv('FIREBASE_CLIENT_ID'),
                    "auth_uri": os.getenv('FIREBASE_AUTH_URI'),
                    "token_uri": os.getenv('FIREBASE_TOKEN_URI'),
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_CERT_URL')
                }
                
                # Initialize Firebase
                cred = credentials.Certificate(firebase_config)
                self.app = firebase_admin.initialize_app(cred, {
                    'storageBucket': f"{os.getenv('FIREBASE_PROJECT_ID')}.appspot.com"
                })
                
                # Initialize Firestore
                self.db = firestore.client()
                
                # Initialize Storage
                self.bucket = storage.bucket()
                
                print("✅ Firebase initialized successfully!")
                
            except Exception as e:
                print(f"❌ Firebase initialization error: {e}")
                raise e
    
    def get_db(self):
        """Get Firestore database instance"""
        return self.db
    
    def get_storage(self):
        """Get Firebase Storage bucket"""
        return self.bucket
    
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

# Initialize Firebase configuration
firebase_config = FirebaseConfig()
