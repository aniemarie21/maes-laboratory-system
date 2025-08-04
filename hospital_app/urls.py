from django.urls import path
from . import views

urlpatterns = [
    # Main pages
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    # Dashboard pages
    path('patient/dashboard/', views.patient_dashboard, name='patient_dashboard'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # Appointment management
    path('book-appointment/', views.book_appointment, name='book_appointment'),
    path('appointment/<uuid:appointment_id>/', views.view_appointment, name='view_appointment'),
    path('appointment/<uuid:appointment_id>/cancel/', views.cancel_appointment, name='cancel_appointment'),
    
    # User management
    path('profile/', views.profile_view, name='profile'),
    path('notifications/', views.notifications_view, name='notifications'),
    
    # API endpoints
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
    # path('api/services/<int:department_id>/', views.get_services_by_department, name='get_services_by_department'),
    # path('api/check-availability/', views.check_appointment_availability, name='check_appointment_availability'),
    
    # Export functionality
    # path('export/appointments/', views.export_appointments, name='export_appointments'),
]
