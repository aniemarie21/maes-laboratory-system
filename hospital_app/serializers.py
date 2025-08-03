from rest_framework import serializers
from .models import Appointment, Service, Payment, Notification, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['full_name', 'role', 'phone_number']

class ServiceSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'department_name', 'description', 'price', 'duration_minutes', 'requires_fasting']

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'appointment_id', 'patient_name', 'service_name', 'appointment_date',
            'status', 'status_display', 'payment_status', 'final_amount', 'notes'
        ]

class PaymentSerializer(serializers.ModelSerializer):
    appointment_id = serializers.CharField(source='appointment.appointment_id', read_only=True)
    patient_name = serializers.CharField(source='appointment.patient.get_full_name', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'appointment_id', 'patient_name', 'amount', 'payment_method',
            'payment_status', 'reference_number', 'payment_date', 'is_verified'
        ]

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'is_read',
            'created_at', 'read_at'
        ]
