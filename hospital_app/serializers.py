"""
Serializers for MAES Hospital Management System API
"""

from rest_framework import serializers
from .models import (
    UserProfile, LabService, Appointment, TestResult, 
    PaymentTransaction, ChatSession
)
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'user', 'user_type', 'phone', 'date_of_birth', 
            'address', 'notification_preference', 'created_at'
        ]

class LabServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabService
        fields = [
            'id', 'name', 'code', 'description', 'category', 
            'price', 'duration_hours', 'preparation_instructions',
            'requires_fasting', 'priority_service', 'ai_analysis_available'
        ]

class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    services = LabServiceSerializer(many=True, read_only=True)
    service_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    
    class Meta:
        model = Appointment
        fields = [
            'appointment_id', 'patient', 'services', 'service_ids',
            'appointment_date', 'appointment_time', 'status',
            'total_amount', 'payment_method', 'payment_status',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['appointment_id', 'total_amount', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        service_ids = validated_data.pop('service_ids')
        appointment = Appointment.objects.create(**validated_data)
        
        services = LabService.objects.filter(id__in=service_ids)
        appointment.services.set(services)
        appointment.calculate_total()
        appointment.save()
        
        return appointment

class TestResultSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    service = LabServiceSerializer(read_only=True)
    appointment = AppointmentSerializer(read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'result_id', 'patient', 'service', 'appointment',
            'status', 'result_data', 'ai_analysis',
            'technician_notes', 'doctor_review', 'recommendations',
            'patient_notified', 'created_at', 'updated_at'
        ]

class PaymentTransactionSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    appointment = AppointmentSerializer(read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'transaction_id', 'patient', 'appointment',
            'amount', 'payment_method', 'payment_reference',
            'status', 'payment_date', 'notes', 'created_at'
        ]

class ChatSessionSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatSession
        fields = [
            'session_id', 'patient', 'session_type',
            'is_active', 'messages', 'session_rating',
            'feedback', 'created_at', 'updated_at'
        ]
