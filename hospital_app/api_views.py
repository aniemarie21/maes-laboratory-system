from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from .models import Appointment, Service, Payment, Notification
from .serializers import AppointmentSerializer, ServiceSerializer, PaymentSerializer, NotificationSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.userprofile.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(patient=self.request.user)

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_available=True)
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.userprofile.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(appointment__patient=self.request.user)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """API endpoint for dashboard statistics"""
    if request.user.userprofile.role != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    today = timezone.now().date()
    this_month = today.replace(day=1)
    
    stats = {
        'total_patients': Appointment.objects.values('patient').distinct().count(),
        'total_appointments': Appointment.objects.count(),
        'today_appointments': Appointment.objects.filter(appointment_date__date=today).count(),
        'monthly_revenue': Payment.objects.filter(
            payment_date__gte=this_month,
            payment_status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0,
        'pending_appointments': Appointment.objects.filter(status='pending').count(),
        'completed_appointments': Appointment.objects.filter(status='completed').count(),
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def appointment_calendar(request):
    """API endpoint for appointment calendar data"""
    appointments = Appointment.objects.filter(
        appointment_date__gte=timezone.now().date()
    ).select_related('patient', 'service')
    
    calendar_data = []
    for appointment in appointments:
        calendar_data.append({
            'id': str(appointment.appointment_id),
            'title': f"{appointment.patient.get_full_name()} - {appointment.service.name}",
            'start': appointment.appointment_date.isoformat(),
            'status': appointment.status,
            'color': {
                'pending': '#ffc107',
                'confirmed': '#28a745',
                'completed': '#6c757d',
                'cancelled': '#dc3545'
            }.get(appointment.status, '#007bff')
        })
    
    return Response(calendar_data)
