from django.urls import path
from . import views, firebase_views

urlpatterns = [
    # Original Django views
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('patient-dashboard/', views.patient_dashboard, name='patient_dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('book-appointment/', views.book_appointment, name='book_appointment'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    
    # Firebase views
    path('firebase/', firebase_views.firebase_home, name='firebase_home'),
    path('firebase/register/', firebase_views.firebase_register, name='firebase_register'),
    path('firebase/book-appointment/', firebase_views.firebase_book_appointment, name='firebase_book_appointment'),
    path('firebase/patient-appointments/<str:patient_id>/', firebase_views.firebase_patient_appointments, name='firebase_patient_appointments'),
    path('firebase/create-payment/', firebase_views.firebase_create_payment, name='firebase_create_payment'),
    
    # Firebase APIs
    path('api/firebase/services/', firebase_views.firebase_services_api, name='firebase_services_api'),
    path('api/firebase/departments/', firebase_views.firebase_departments_api, name='firebase_departments_api'),
]
