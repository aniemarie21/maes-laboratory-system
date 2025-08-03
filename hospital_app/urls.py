"""
URL patterns for MAES Hospital Management System main app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Public pages
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('services/', views.services, name='services'),
    
    # Dashboard
    path('dashboard/', views.dashboard, name='dashboard'),
    path('patient/dashboard/', views.patient_dashboard, name='patient_dashboard'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # Patient functions
    path('book-appointment/', views.book_appointment, name='book_appointment'),
    path('appointments/', views.view_appointments, name='view_appointments'),
    path('test-results/', views.view_test_results, name='view_test_results'),
    
    # Admin functions
    path('admin/payment-settings/', views.payment_settings, name='payment_settings'),
    
    # API endpoints
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
]
