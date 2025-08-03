from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'appointments', api_views.AppointmentViewSet)
router.register(r'services', api_views.ServiceViewSet)
router.register(r'payments', api_views.PaymentViewSet)
router.register(r'notifications', api_views.NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', api_views.dashboard_stats, name='dashboard_stats'),
    path('appointment-calendar/', api_views.appointment_calendar, name='appointment_calendar'),
]
