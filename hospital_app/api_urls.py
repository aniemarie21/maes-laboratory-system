"""
API URL patterns for MAES Hospital Management System.
"""

from django.urls import path
from . import api_views

urlpatterns = [
    path('appointments/', api_views.AppointmentListCreateView.as_view(), name='api_appointments'),
    path('appointments/<uuid:appointment_id>/', api_views.AppointmentDetailView.as_view(), name='api_appointment_detail'),
    path('services/', api_views.LabServiceListView.as_view(), name='api_services'),
    path('test-results/', api_views.TestResultListView.as_view(), name='api_test_results'),
    path('payments/', api_views.PaymentTransactionListView.as_view(), name='api_payments'),
]
