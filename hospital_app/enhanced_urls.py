from django.urls import path
from . import views
from .chatbot import enhanced_chatbot_api
from .password_reset_views import (
    CustomPasswordResetView, 
    CustomPasswordResetDoneView,
    CustomPasswordResetConfirmView, 
    CustomPasswordResetCompleteView
)

urlpatterns = [
    # Main pages
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    # Dashboard pages
    path('patient/dashboard/', views.patient_dashboard, name='patient_dashboard'),
    path('admin/dashboard/', views.enhanced_admin_dashboard, name='admin_dashboard'),
    
    # Appointment management
    path('book-appointment/', views.book_appointment, name='book_appointment'),
    path('appointment/<uuid:appointment_id>/', views.view_appointment, name='view_appointment'),
    path('appointment/<uuid:appointment_id>/cancel/', views.cancel_appointment, name='cancel_appointment'),
    
    # Financial assistance
    path('financial-assistance/', views.financial_assistance_form, name='financial_assistance'),
    path('financial-assistance/submit/', views.submit_financial_assistance, name='submit_financial_assistance'),
    
    # Medical certificates
    path('medical-certificate/request/', views.request_medical_certificate, name='request_medical_certificate'),
    path('medical-certificate/<int:cert_id>/', views.view_medical_certificate, name='view_medical_certificate'),
    
    # User management
    path('profile/', views.profile_view, name='profile'),
    path('notifications/', views.notifications_view, name='notifications'),
    path('notification-preferences/', views.notification_preferences, name='notification_preferences'),
    
    # Password reset
    path('password-reset/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', CustomPasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password-reset/confirm/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset/complete/', CustomPasswordResetCompleteView.as_view(), name='password_reset_complete'),
    
    # API endpoints
    path('api/chatbot/', enhanced_chatbot_api, name='enhanced_chatbot_api'),
    path('api/services/<int:department_id>/', views.get_services_by_department, name='get_services_by_department'),
    path('api/check-availability/', views.check_appointment_availability, name='check_appointment_availability'),
    path('api/dashboard-stats/', views.get_dashboard_stats, name='dashboard_stats'),
    
    # Export functionality
    path('export/appointments/csv/', views.export_appointments_csv, name='export_appointments_csv'),
    path('export/appointments/excel/', views.export_appointments_excel, name='export_appointments_excel'),
    path('export/reports/', views.export_reports_page, name='export_reports'),
    
    # Payment management
    path('payment/gcash-info/', views.gcash_payment_info, name='gcash_payment_info'),
    path('payment/verify/<int:payment_id>/', views.verify_payment, name='verify_payment'),
]
