from django.urls import path
from . import views

urlpatterns = [
    # Main pages
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    # Dashboards
    path('patient-dashboard/', views.patient_dashboard, name='patient_dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # Appointments
    path('book-appointment/', views.book_appointment, name='book_appointment'),
    path('medical-certificate-request/', views.medical_certificate_request, name='medical_certificate_request'),
    
    # API endpoints
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    path('api/services/<int:department_id>/', views.get_services_by_department, name='get_services_by_department'),
    path('api/check-availability/', views.check_appointment_availability, name='check_appointment_availability'),
    
    # Export functions
    path('export/appointments/csv/', views.export_appointments_csv, name='export_appointments_csv'),
    path('export/appointments/excel/', views.export_appointments_excel, name='export_appointments_excel'),
    
    # Password reset
    path('password-reset/', views.password_reset_request, name='password_reset_request'),
]
